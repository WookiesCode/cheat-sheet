"""Explain a command: a Python port of the site's Explain (common.js, exTokenize … exAnalyze).

Same steps and wording as the site: split the command into stages at pipes and && / ;,
find the tool behind wrappers like sudo or timeout, describe each subcommand and flag
from the sheets' notes, the man pages and captured --help output, then give a verdict
(changes state, password in clear, never returns, placeholders, files written, remote,
root).

The tables and the danger / never-returns regexes come from common.js through export.js
(data/explain.json), so only the logic lives here. test_explain.py runs the site's own
JS over every command on the sheets and checks this module gives the same answers.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field

# ---- data ----------------------------------------------------------------------------
_DATA: dict | None = None
_LINES: dict[str, list[str]] = {}  # man / --help text split into lines, once per page


def load(text: str) -> None:
    """Take explain.json's text (the app reads it from the folder or the .pyz)."""
    global _DATA, DANGER_RE, NEVER_RETURNS_RE, WRAP_ARGS
    _DATA = json.loads(text)
    # Both are /…/i in common.js.
    DANGER_RE = re.compile(_DATA["danger"], re.I)
    NEVER_RETURNS_RE = re.compile(_DATA["neverReturns"], re.I)
    WRAP_ARGS = {k: re.compile(v) for k, v in _DATA["wrapArgs"].items()}


def data() -> dict:
    if _DATA is None:
        raise RuntimeError("explain.load() first")
    return _DATA


DANGER_RE: re.Pattern
NEVER_RETURNS_RE: re.Pattern
WRAP_ARGS: dict[str, re.Pattern] = {}


@dataclass
class Page:
    """A man page or a captured --help page."""

    name: str  # "tail", "nvme-smart-log", or the help key "nvidia-smi nvlink"
    text: str
    source: str = ""  # for --help pages: the command that printed it


def man_page(name: str) -> Page | None:
    text = data()["pages"].get(name)
    return Page(name, text) if text else None


def _lines(page: Page) -> list[str]:
    key = ("help:" if page.source else "man:") + page.name
    if key not in _LINES:
        _LINES[key] = page.text.split("\n")
    return _LINES[key]


# ---- tokens and stages ---------------------------------------------------------------
@dataclass
class Token:
    t: str  # "word" or "op"
    v: str
    nl: bool = False  # an op that was a newline


_OP_RE = re.compile(r"^(2>&1|&>|2>>|2>|1>|>>|\|\||&&|[|;&<>])")


def tokenize(src: str) -> list[Token]:
    """Shell-ish: quotes, escapes, $(…) and backticks stay inside one word;
    operators and redirections become their own tokens."""
    out: list[Token] = []
    i, w, quoted = 0, "", False

    def push() -> None:
        nonlocal w, quoted
        if w != "" or quoted:
            out.append(Token("word", w))
        w, quoted = "", False

    while i < len(src):
        c = src[i]
        if c == "\\" and src[i + 1 : i + 2] == "\n":
            i += 2
            continue
        if c == "\n":
            push()
            out.append(Token("op", ";", nl=True))
            i += 1
            continue
        if c.isspace():
            push()
            i += 1
            continue
        if c in "'\"":
            end = src.find(c, i + 1)
            stop = len(src) if end < 0 else end
            w += src[i : stop + 1]
            quoted = True
            i = stop + 1
            continue
        if c == "$" and src[i + 1 : i + 2] == "(":
            depth, j = 0, i
            while j < len(src):
                if src[j] == "(":
                    depth += 1
                elif src[j] == ")":
                    depth -= 1
                    if depth == 0:
                        break
                j += 1
            w += src[i : j + 1]
            i = j + 1
            continue
        if c == "`":
            end = src.find("`", i + 1)
            stop = len(src) if end < 0 else end
            w += src[i : stop + 1]
            i = stop + 1
            continue
        op = _OP_RE.match(src[i:])
        if op and not (op[0] == "&" and w.endswith(">")):
            if re.fullmatch(r"\d", w) and op[0].startswith(">"):  # 2> 1>> written apart from the digit
                w += op[0]
                out.append(Token("op", w))
                w = ""
                i += len(op[0])
                continue
            push()
            out.append(Token("op", op[0]))
            i += len(op[0])
            continue
        w += c
        i += 1
    push()
    return out


def unquote(v: str) -> str:
    m = re.fullmatch(r"(['\"])([\s\S]*)\1", v)
    return m[2] if m else v


@dataclass
class Stage:
    words: list[str] = field(default_factory=list)
    redirs: list[tuple[str, str]] = field(default_factory=list)  # (operator, target)
    op: str = ""  # the operator after it: | && || ; & or "\n"


def stages_of(tokens: list[Token]) -> list[Stage]:
    stages: list[Stage] = []
    cur = Stage()
    k = 0
    while k < len(tokens):
        tk = tokens[k]
        if tk.t == "op" and tk.v in ("||", "&&", "|", ";", "&"):
            cur.op = "\n" if tk.nl else tk.v
            if cur.words or cur.redirs:
                stages.append(cur)
            cur = Stage()
        elif tk.t == "op":
            target = ""
            if k + 1 < len(tokens) and tokens[k + 1].t == "word" and tk.v != "2>&1":
                k += 1
                target = tokens[k].v
            cur.redirs.append((tk.v, target))
        else:
            cur.words.append(tk.v)
        k += 1
    if cur.words or cur.redirs:
        stages.append(cur)
    return stages


def tool_index(words: list[str]) -> tuple[int, list[tuple[str, str]]]:
    """Which word is the tool: skip env assignments and wrappers (sudo -n, timeout 30, watch -n 5).
    Returns its index and the (word, "env" | "wrap") pairs skipped."""
    wrappers: list[tuple[str, str]] = []
    i = 0
    while i < len(words):
        w = words[i]
        if re.match(r"[A-Za-z_][A-Za-z0-9_]*=", w):
            wrappers.append((w, "env"))
            i += 1
            continue
        base = re.sub(r"^.*/", "", w)
        if base in data()["wrappers"]:
            wrappers.append((base, "wrap"))
            i += 1
            # The wrapper's own options, and the value of those that take one (sudo -u root).
            while i < len(words) and words[i].startswith("-"):
                f = words[i]
                i += 1
                if base in WRAP_ARGS and WRAP_ARGS[base].search(f) and i < len(words):
                    i += 1
            if base == "timeout" and re.match(r"\d", words[i] if i < len(words) else ""):
                i += 1
            continue
        break
    return i, wrappers


# ---- manuals ---------------------------------------------------------------------------
def man_name(page: Page) -> str:
    m = re.search(r"\nNAME\n\s+([^\n]+(?:\n\s{6,}[^\n]+)?)", page.text)
    if not m:
        return ""
    return re.sub(r"^.*?\s-\s", "", re.sub(r"\s+", " ", m[1]), count=1).strip()


_BRACKET = re.compile(r"^\[(-[^\]]+)\]:\s*(.*)$")
_ONE_SPACE = re.compile(r"^(-{1,2}[^\s\[<=,]+(?:\[[^\]]*\])?(?:,\s*-{1,2}[^\s\[<=,]+(?:\[[^\]]*\])?)*)\s(\S+(?:\s\S+){2,})$")
_MORE = re.compile(r"^(-{1,2}[A-Za-z?][^\s,]*)(?:,?\s{2,}|,\s*|$)")
_SENTENCE = re.compile(r"[^.!?]+[.!?]+(\s|$)")


def _first_nonspace(s: str) -> int:
    m = re.search(r"\S", s)
    return m.start() if m else -1


def man_flag(page: Page, flag: str) -> str:
    """Find an option header ("-z, --gzip", "--since=", "-mtime n") and its paragraph:
    the first two sentences, at most 280 characters."""
    lines = _lines(page)
    for n, line in enumerate(lines):
        ind = _first_nonspace(line)
        # nvidia-smi subcommands write "[-m | --matrix]: Display the ... matrix". The colon
        # matters: man SYNOPSIS lines ("[--verbose | -v]") have none.
        bracket = _BRACKET.match(line[ind:]) if ind >= 0 else None
        if ind < 0 or (line[ind] != "-" and not bracket):
            continue
        rest = line[ind:]
        if bracket:
            header_end = -1
        else:
            gap = re.search(r"\s{2,}", rest)
            header_end = gap.start() if gap else -1
        # util-linux --help leaves one space before the text ("--summary[=when] print summary
        # information"); only taken with 3+ words after it, so "-mtime n" stays a header.
        one_space = _ONE_SPACE.match(rest) if not bracket and header_end < 0 else None
        if bracket:
            items = re.split(r"\s*\|\s*", bracket[1])
            text = bracket[2].strip()
        elif one_space:
            items = re.split(r",\s*", one_space[1])
            text = one_space[2]
        elif header_end < 0:
            items = re.split(r",\s*", rest)
            text = ""
        else:
            items = re.split(r",\s*", rest[:header_end])
            text = rest[header_end:].strip()
        # --help layouts put the long form after spaces, not a comma
        # ("-r    --gpu-reset    Trigger reset of the GPU."): those belong to the header too.
        while True:
            more = _MORE.match(text)
            if not more:
                break
            items.append(more[1])
            text = text[len(more[0]) :]
        # jq writes "--raw-output / -r:"; git writes "--[no-]depth <depth>" for --depth and --no-depth.
        forms: list[str] = []
        for it in items:
            for part in re.split(r"\s+/\s+", it):
                part = re.sub(r":$", "", part)
                if part.startswith("--[no-]"):
                    forms += [part.replace("[no-]", "", 1), part.replace("[no-]", "no-", 1)]
                else:
                    forms.append(part)
        if not any(it == flag or (it.startswith(flag) and re.match(r"[\s=<\[]", it[len(flag) :])) for it in forms):
            continue
        for m in range(n + 1, min(len(lines), n + 14)):
            nxt = lines[m]
            li = _first_nonspace(nxt)
            if li < 0:
                if text:
                    break
                continue
            if li <= ind and text:
                break
            if li <= ind and nxt.strip()[:1] == "-":
                break
            text += " " + nxt.strip()
        text = re.sub(r"\s+", " ", re.sub(r"‐\s+", "", text)).strip()
        if not text:
            continue
        sentences = [s[0] for s in _SENTENCE.finditer(text)] or [text]
        return "".join(sentences[:2]).strip()[:280]
    return ""


def help_pages(tool: str, subs: list[str]) -> list[Page]:
    """Captured --help pages for a tool: "tool sub1 sub2", "tool sub1", then "tool"."""
    helps = data()["helps"]
    if not tool:
        return []
    keys = []
    if len(subs) > 1:
        keys.append(f"{tool} {subs[0]} {subs[1]}")
    if subs:
        keys.append(f"{tool} {subs[0]}")
    keys.append(tool)
    return [Page(k, helps[k]["text"], helps[k].get("source", k)) for k in keys if k in helps]


def help_name(helps: list[Page]) -> str:
    """A one-line title from --help: its first line that isn't usage or an option."""
    for h in helps:
        for line in (x.strip() for x in h.text.split("\n")):
            if line and not re.match(r"(usage|or:|-|\[|options|commands|flags)", line, re.I):
                return re.sub(r"[.:]$", "", line)[:100]
    return ""


# ---- one stage ---------------------------------------------------------------------------
@dataclass
class Row:
    """One explained word. The site writes some rows as HTML; here they keep their parts."""

    tok: str
    kind: str  # wrap, var, sub, flag, op
    text: str = ""
    src: str = ""  # "shell", a sheet file, "man tail" or "$ nvidia-smi --help"
    unknown: bool = False
    parts: list[tuple[str, str]] = field(default_factory=list)  # bundled flags: (-i, text)
    value: str = ""  # a value attached to the flag (-A3 → 3)
    general: tuple[str, str] | None = None  # (where, text): the documentation's wider meaning

    def plain(self) -> str:
        """The row as the site's text reads, with line breaks where it has <br>."""
        if self.general:
            return f"{self.text}\nIn general ({self.general[0]}): {self.general[1]}"
        if self.parts:
            out = "\n".join(f"{f} {t}" for f, t in self.parts)
            return out + (f"\nValue: {self.value}" if self.value else "")
        return self.text


@dataclass
class StageResult:
    st: Stage
    tool: str
    tool_word: str
    page: Page | None
    rows: list[Row]
    leftovers: list[str]
    sheet: str
    name: str
    raw: str
    remote: str = ""  # set for the command inside ssh host '…'


def _overlap(a: str, b: str) -> bool:
    """Do two descriptions share a word of 4+ letters? None means they describe different things."""
    words = lambda s: set(re.findall(r"[a-z]{4,}", s.lower()))  # noqa: E731
    return bool(words(a) & words(b))


def explain_stage(st: Stage) -> StageResult:
    ti, wrappers = tool_index(st.words)
    tool_word = st.words[ti] if ti < len(st.words) else ""
    tool = re.sub(r"^.*/", "", tool_word)
    site: dict = data()["flags"].get(tool, {})
    page = man_page(tool) if tool else None
    rows: list[Row] = []
    for w, kind in wrappers:
        if kind == "env":
            rows.append(Row(w, "var", f"Sets {w.split('=')[0]} for this command only.", "shell"))
        else:
            rows.append(Row(w, "wrap", data()["wrappers"][w], "shell"))
    args = st.words[ti + 1 :]
    lead_subs: list[str] = []
    for w in args:
        if w.startswith("-") or len(lead_subs) == 2:
            break
        lead_subs.append(w)
    # Subcommands with their own manual (nvme smart-log → nvme-smart-log, ip address → ip-address).
    sub_page = man_page(f"{tool}-{lead_subs[0]}") if lead_subs else None
    helps = help_pages(tool, lead_subs)
    top_help = data()["helps"].get(tool)

    def doc_flag(f: str) -> tuple[str, str] | None:
        """After the sheets: the subcommand's manual, the tool's manual, then --help output."""
        if sub_page:
            t = man_flag(sub_page, f)
            if t:
                return t, f"man {sub_page.name}"
        if page:
            t = man_flag(page, f)
            if t:
                return t, f"man {tool}"
        for h in helps:
            t = man_flag(h, f)
            if t:
                return t, f"$ {h.source}"
        return None

    def sub_doc(f: str) -> tuple[str, str] | None:
        """The sheets' notes are per tool, not per subcommand: a note for "nvidia-smi dmon -s"
        would also answer "nvidia-smi nvlink -s". The subcommand's own documentation wins."""
        if sub_page:
            t = man_flag(sub_page, f)
            if t:
                return t, f"man {sub_page.name}"
        for h in helps:
            if top_help is not None and h.name == tool:
                continue
            t = man_flag(h, f)
            if t:
                return t, f"$ {h.source}"
        return None

    def any_flag(f: str) -> tuple[str, str] | None:
        return sub_doc(f) or ((site[f][0], site[f][1]) if f in site else doc_flag(f))

    used: set[int] = set()
    # Subcommands: the longest run of plain words the site knows ("chassis power cycle").
    for a in range(len(args)):
        if a in used or args[a].startswith("-"):
            continue
        for ln in (3, 2, 1):
            seq = args[a : a + ln]
            if len(seq) < ln or any(x.startswith("-") for x in seq):
                continue
            key = " ".join(seq)
            if key in site:
                used.update(range(a, a + ln))
                rows.append(Row(key, "sub", site[key][0], site[key][1]))
                break

    joined = " ".join(st.words)
    for a, w in enumerate(args):
        if not w.startswith("-") or w in ("-", "--"):
            continue
        fm = re.match(r"--?[^=\s]+", w)  # "-=" (count -= 1) starts with a dash but isn't a flag
        if not fm:
            continue
        used.add(a)
        flag = fm[0]
        if "=" in w:
            value_next = False
        else:
            value_next = a + 1 < len(args) and not args[a + 1].startswith("-") and (a + 1) not in used and any_flag(flag) is not None
        sub = sub_doc(flag)
        if sub:
            text, src = sub
        elif flag in site:
            text, src = site[flag][0], site[flag][1]
        else:
            text, src = "", ""
        # A sheet note can describe its own example ("the last 100 lines"): if it quotes
        # numbers this command doesn't have, the manual's general wording explains it better.
        if text and not sub and any(n not in joined for n in re.findall(r"\b\d+\b", text)):
            general = doc_flag(flag)
            if general:
                text, src = general
        if not text:
            d = doc_flag(flag)
            if d:
                text, src = d
        # A sheet note written for one use can miss the flag's general meaning: when the
        # documentation says something else entirely, show both.
        if text and flag in site and src == site[flag][1]:
            d = doc_flag(flag)
            if d and not _overlap(text, d[0]):
                rows.append(Row(w, "flag", text, src, general=(re.sub(r"^\$ ", "", d[1]), d[0])))
                if value_next:
                    used.add(a + 1)
                continue
        # Bundled short flags: -czf → -c -z -f, -iA3 → -i -A with the value 3. Only when
        # every letter is a known flag: -iTCP:8080 is -i with a value, not -i -T -C -P.
        bundle = re.match(r"^-([A-Za-z]{2,})([^A-Za-z].*)?$", w, re.S) if not text else None
        if bundle:
            found = [(f"-{ch}", any_flag(f"-{ch}")) for ch in bundle[1]]
            if all(d for _, d in found):
                rows.append(Row(w, "flag", src=found[0][1][1], parts=[(f, d[0]) for f, d in found], value=bundle[2] or ""))
                continue
        # A short flag with its value attached: -d':' -F',' -k2 -A3 -iTCP:8080.
        attached = re.match(r"^(-[A-Za-z])(.+)$", w, re.S) if not text else None
        if attached:
            d = any_flag(attached[1])
            if d:
                rows.append(Row(w, "flag", src=d[1], parts=[(attached[1], d[0])], value=attached[2]))
                continue
        # Documented somewhere, but not this flag: worth a second look at the spelling.
        docs = f"man {sub_page.name}" if sub_page else f"man {tool}" if page else helps[0].source if helps else ""
        if not text:
            if docs:
                text = f"Not on the sheets, and {docs} doesn't list it: check the spelling, or the tool's version."
            else:
                text = f"Not described on the sheets or in an offline manual. Run {tool} --help, or check its manual."
            rows.append(Row(w, "flag", text, src, unknown=True))
        else:
            rows.append(Row(w, "flag", text, src))
        if value_next:
            used.add(a + 1)

    leftovers = [w for a, w in enumerate(args) if a not in used]
    for op, target in st.redirs:
        text = data()["ops"].get(op, "") + (" /dev/null throws it away." if target == "/dev/null" else "")
        rows.append(Row(f"{op} {target}" if target else op, "op", text, "shell"))
    name = man_name(page) if page else help_name(helps) if helps else ""
    return StageResult(st, tool, tool_word, page, rows, leftovers, data()["sheetFor"].get(tool, "") if tool else "", name, " ".join(st.words))


# ---- secrets and the verdict -------------------------------------------------------------
_SECRET_RULES = [
    (re.compile(r"""(\bipmitool\b[^|;&\n]*?\s)-P\s+(?!["']?\$)("[^"]*"|'[^']*'|\S+)"""),
     lambda m: f"{m[1]}-E",
     "ipmitool -P: the password lands in your shell history (ipmitool only tries to hide it from ps). -E reads it from IPMI_PASSWORD instead."),
    (re.compile(r"""(\b(?:racadm|ilorest|saa|smcipmitool|ipmicfg|redfishtool|mysql|mysqladmin)\b[^|;&\n]*?\s)(-p|--password|--passwd)(\s+|=)(?!["']?\$)("[^"]*"|'[^']*'|\S+)""", re.I),
     lambda m: f'{m[1]}{m[2]}{m[3]}"$BMC_PASS"',
     "Password on the command line: keep it in $BMC_PASS (read -rs BMC_PASS; export BMC_PASS)."),
    (re.compile(r"""(\s--(?:password|passwd|pass)(?:\s+|=))(?!["']?\$)("[^"]*"|'[^']*'|\S+)"""),
     lambda m: f'{m[1]}"$BMC_PASS"',
     "--password in clear: use a variable or the tool’s config file."),
    (re.compile(r"""(\bcurl\b[^|;&\n]*?\s(?:-u|--user)\s+)(["']?)([^\s:"']+):(?!\$)[^\s"']+\2"""),
     lambda m: f"{m[1]}{m[3]}",
     "curl -u user:password: with just -u user curl prompts; better, use -K ~/.bmc-curlrc or a netrc file."),
    (re.compile(r"""(https?://)([^\s:@/]+):(?!\$)[^\s@/]+@"""),
     lambda m: f"{m[1]}{m[2]}@",
     "Credentials inside a URL end up in logs and history."),
    (re.compile(r"""(--bmc\s+["']?)([^\s:@"']+):(?!\$)[^\s@"']+@"""),
     lambda m: f"{m[1]}$BMC_USER:$BMC_PASS@",
     "OneCLI --bmc user:password@host: use variables, or an encrypted --configfile."),
    (re.compile(r"""((?:Authorization:\s*(?:Bearer|Basic)|X-Auth-Token:)\s*)(?!\$)[A-Za-z0-9._~+/=-]{8,}""", re.I),
     lambda m: f"{m[1]}$TOKEN",
     "A token in a header: keep it in $TOKEN."),
    (re.compile(r"""(\b(?:password|passwd|token|secret|api_key)=)(?!["']?\$)("[^"]*"|'[^']*'|[^\s&]+)""", re.I),
     lambda m: f'{m[1]}"$SECRET"',
     "A secret as a parameter: use a variable."),
]


def secrets(text: str) -> tuple[list[str], str]:
    """Passwords and tokens typed in clear, and a copy with them swapped for variables."""
    hits: list[str] = []
    safe = text
    for rx, rep, why in _SECRET_RULES:
        if rx.search(safe):
            hits.append(why)
            safe = rx.sub(rep, safe)
    return list(dict.fromkeys(hits)), safe


@dataclass
class Finding:
    sev: str  # crit, warn, info
    title: str
    text: str
    safe: str = ""


@dataclass
class Analysis:
    src: str
    stages: list[StageResult]
    findings: list[Finding]
    verdict: str  # crit, warn, ok
    safe: str  # the command with secrets replaced, or "" when there were none


VERDICT = {"crit": ("⛔", "Stop and check before running"), "warn": ("⚠", "Run with care"), "ok": ("✓", "Read-only as far as these sheets can tell")}


def analyze(text: str) -> Analysis:
    src = re.sub(r"^\s*\$\s+", "", text, flags=re.M).strip()
    stages = [explain_stage(st) for st in stages_of(tokenize(src))]
    # ssh host 'command': explain the quoted command too, as running on the remote host.
    for idx, s in enumerate(list(stages)):
        if s.tool != "ssh":
            continue
        last = s.st.words[-1]
        if len(s.st.words) > 2 and last[:1] in ("'", '"'):
            inner = analyze(unquote(last))
            host = next((w for k, w in enumerate(s.st.words) if k > 0 and not w.startswith("-") and w[:1] not in ("'", '"')), "the remote host")
            for x in inner.stages:
                x.remote = host
            stages[idx + 1 : idx + 1] = inner.stages

    findings: list[Finding] = []
    danger = [s for s in stages if DANGER_RE.search(s.raw)]
    if re.search(r"\b(curl|wget)\b[^;&]*\|\s*(sudo\s+)?(ba|z)?sh\b", src):
        findings.append(Finding("crit", "Runs a script straight from the internet", "Whatever the server sends runs, as root if sudo is there. Download it, read it, then run the file."))
    if danger:
        tools = list(dict.fromkeys(s.tool or s.raw.split(" ")[0] for s in danger))
        findings.append(Finding("crit", "Changes state", f"{', '.join(tools)}: drain the node and get approval before running it."))
    hits, safe = secrets(src)
    if hits:
        findings.append(Finding("crit", "Password or token in clear", " ".join(hits), safe))
    if any(NEVER_RETURNS_RE.search(s.raw) for s in stages):
        findings.append(Finding("warn", "Never returns on its own", "A live view, follow or console: stop it with Ctrl+C (or its escape sequence)."))
    ph = re.findall(r"<[A-Za-z_][\w -]*>", src)
    if ph:
        findings.append(Finding("warn", "Unfilled placeholders", f"{', '.join(dict.fromkeys(ph))}: replace them before running."))
    writes = [t for s in stages for op, t in s.st.redirs if op in (">", ">>", "1>", "&>") and t and t != "/dev/null"]
    if writes:
        findings.append(Finding("info", "Writes files", ", ".join(dict.fromkeys(writes))))
    # -h means "help" or "human" for most tools: only the IPMI tools and racadm take a host there.
    ssh_host = next((s for s in stages if s.tool == "ssh" and not s.remote), None)
    m = (re.search(r"""\b(?:ipmitool|ipmi-[\w-]+|ipmipower|ipmiconsole|bmc-info)\b[^|;&]*?\s-[Hh]\s+("[^"]*"|\S+)""", src)
         or re.search(r"""\bracadm\b[^|;&]*?\s-r\s+("[^"]*"|\S+)""", src)
         or re.search(r"""\s(?:--host|--url|--bmc)[\s=]+("[^"]*"|\S+)""", src))
    remote = m[1] if m else ""
    if not remote and ssh_host:
        remote = next((w for w in ssh_host.st.words[1:] if not w.startswith("-") and w[:1] not in ("'", '"')), "")
    if remote:
        findings.append(Finding("info", "Acts on another machine", unquote(remote)))
    if re.search(r"(^|[\s;|&])sudo\b", src):
        findings.append(Finding("info", "Runs as root", "sudo: double-check the target before you press Enter."))
    verdict = "crit" if any(f.sev == "crit" for f in findings) else "warn" if any(f.sev == "warn" for f in findings) else "ok"
    return Analysis(src, stages, findings, verdict, safe if hits else "")
