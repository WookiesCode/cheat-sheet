"""dc-cheat (Textual prototype): one sheet page of the cheat-sheet site, in the terminal.

Mirrors the site's sheet page: header with search and toolbar, nav tabs, Rack
Targets bar, the suite sidebar, command cards in two columns, the prev/next
pager and the shortcut footer, in the site's dark-theme colours.

Data: data/site.json, written by export.js from the built site.
Run:  .venv/bin/python dc_cheat.py [sheet.html]
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

from rich.text import Text
from textual import events
from textual.app import App, ComposeResult
from textual.binding import Binding
from textual.containers import Horizontal, Vertical, VerticalScroll
from textual.widgets import Input, Static

HERE = Path(__file__).resolve().parent
DATA = json.loads((HERE / "data" / "site.json").read_text(encoding="utf-8"))

# The site's default Rack Targets. Values like mlx5_0 are drawn as "slots", as on the site.
TARGETS = [("$BMC", "2001:db8:dc::50"), ("$BMC_USER", "ADMIN"), ("$IFACE", "eno1"), ("$HCA", "mlx5_0"), ("$DISK", "/dev/nvme0n1")]
SLOT_VALUES = {v for _, v in TARGETS}

# Site colours (cheat-sheets/styles.css :root), for Rich text inside widgets.
C = {
    "cmd": "#4ade80", "flag": "#38bdf8", "arg": "#e2e8f0", "pipe": "#f472b6", "string": "#fbbf24",
    "comment": "#64748b", "muted": "#64748b", "secondary": "#9aa7b8", "accent": "#38bdf8",
    "amber": "#fbbf24", "red": "#f87171", "green": "#4ade80", "purple": "#c084fc", "slot_bg": "#1e2738",
}
# Below 150 columns the tabs use short labels, as the site's header collapses on narrow windows.
TAB_SHORT = {"Workbench": "Bench", "Operating Systems": "OS", "CLI Tools": "CLI", "Remote Management": "Remote", "Networking": "Network"}
TAB_ICONS = {"Home": "⌂", "Workbench": "▦", "Operating Systems": "▭", "Editors": "‹›", "CLI Tools": ">_",
             "Scripting": "{}", "Networking": "⋔", "Remote Management": "▤", "Hardware": "▣", "DevOps": "∞", "Ticketing": "▭"}
WRAPPERS = {"sudo", "env", "time", "nohup", "nice", "ionice", "timeout", "watch", "xargs", "exec", "stdbuf"}

# Where every sheet sits: file -> (tab index, suite index, sheet index).
WHERE: dict[str, tuple[int, int, int]] = {}
for ti, tab in enumerate(DATA["tabs"]):
    for si, suite in enumerate(tab["suites"]):
        for ki, sheet in enumerate(suite["sheets"]):
            WHERE.setdefault(sheet["file"], (ti, si, ki))


# ---- command colouring, like the site's command anatomy ----------------------
TOKEN = re.compile(r"""(\s+)|('(?:[^'])*'?|"(?:\\.|[^"])*"?)|(\|\||&&|2>&1|>>|[|;<>])|(\#.*$)|([^\s'"|;<>&]+|&)""")


def highlight(cmd: str) -> Text:
    """Colour a command: tool green, flags blue, strings amber, pipes pink, slots boxed."""
    out = Text()
    for n, line in enumerate(cmd.split("\n")):
        if n:
            out.append("\n")
        expect_tool = True
        for m in TOKEN.finditer(line):
            space, string, op, comment, word = m.groups()
            if space:
                out.append(space)
            elif string:
                out.append(string, style=C["string"])
            elif op:
                out.append(op, style=f"bold {C['pipe']}")
                expect_tool = op not in (">", ">>", "<", "2>&1")
            elif comment:
                out.append(comment, style=f"italic {C['comment']}")
            elif word:
                if expect_tool:
                    out.append(word, style=f"bold {C['cmd']}" if word not in WRAPPERS else C["muted"])
                    expect_tool = word in WRAPPERS
                elif word.startswith("-"):
                    flag, eq, val = word.partition("=")
                    out.append(flag, style=C["flag"])
                    if eq:
                        out.append("=" + val, style=C["arg"])
                elif word in SLOT_VALUES:
                    out.append(word, style=f"bold {C['arg']} on {C['slot_bg']}")
                elif word.startswith("$") or (word.startswith("<") and word.endswith(">")):
                    out.append(word, style=C["purple"])
                else:
                    out.append(word, style=C["arg"])
    return out


def tag(label: str, fg: str, bg: str) -> Text:
    return Text(f" {label} ", style=f"bold {fg} on {bg}")


# ---- widgets -------------------------------------------------------------------
class CommandBox(Static):
    """A command code box: click (or Enter on it) copies, like the site."""

    can_focus = True

    def __init__(self, entry: dict, **kw) -> None:
        self.entry = entry
        self.alt = 0
        self.head_lines = 0
        super().__init__(self.build(), **kw)

    def build(self) -> Text:
        e = self.entry
        t = Text()
        tags = []
        if e.get("root") == "root":
            tags.append(tag("🔒 ROOT", C["amber"], "#2a1f05"))
        elif e.get("root") == "maybe":
            tags.append(tag("🔒 MAYBE ROOT", C["secondary"], "#1a2130"))
        elif e.get("root") == "admin":
            tags.append(tag("SLURM ADMIN", C["amber"], "#2a1f05"))
        if e.get("danger"):
            tags.append(tag("⚠ CHANGES STATE", C["red"], "#2a0d0d"))
        if e.get("ref"):
            tags.append(tag("REFERENCE", C["muted"], "#1a2130"))
        if tags:
            for k, x in enumerate(tags):
                t.append_text(x)
                t.append(" " if k < len(tags) - 1 else "\n")
            self.head_lines = 1
        copies = e.get("copy") or []
        alts = [c.removeprefix("# needs root\n") for c in copies] or [e["cmd"]]
        for k, a in enumerate(alts):
            if k:
                t.append("\n")
            t.append("$ " if k == 0 or len(alts) == 1 else "│ ", style=C["muted"])
            t.append_text(highlight(a))
        return t

    def copy(self, alt: int | None = None) -> None:
        copies = self.entry.get("copy") or []
        if not copies:
            self.app.notify("Reference text: nothing to copy.", timeout=2)
            return
        text = copies[alt if alt is not None and alt < len(copies) else self.alt]
        self.app.copy_to_clipboard(text)
        first = text.removeprefix("# needs root\n").split("\n")[0][:70]
        if self.entry.get("danger"):
            self.app.notify(f"{first}\nConfirm the node is drained and the change approved before running it.", title="⚠ State-changing command copied", severity="warning", timeout=5)
        else:
            self.app.notify(first, title="Copied", timeout=2)

    def alt_at(self, y: int) -> int:
        """Which alternative is on screen row y of the box. Long ones wrap over several
        rows, so count each one's wrapped height at the box's current width."""
        row = y - 1 - self.head_lines  # minus the top border and the tag line
        width = max(10, self.content_region.width)
        copies = self.entry.get("copy") or []
        for k, c in enumerate(copies):
            alt = Text("$ ").append_text(highlight(c.removeprefix("# needs root\n")))
            rows = len(alt.wrap(self.app.console, width))
            if row < rows:
                return k
            row -= rows
        return max(0, len(copies) - 1)

    def on_click(self, event: events.Click) -> None:
        # Copy the alternative under the pointer, as the site does.
        self.copy(self.alt_at(event.y))


class SubBox(Static):
    """A related command under a card (the site's subcommand rows)."""

    can_focus = True

    def __init__(self, cmd: str, desc: str, **kw) -> None:
        self.cmd = cmd
        t = highlight(cmd)
        t.append("\n")
        t.append(desc, style=C["secondary"])
        super().__init__(t, **kw)

    def copy(self, alt: int | None = None) -> None:
        self.app.copy_to_clipboard(self.cmd)
        self.app.notify(self.cmd[:70], title="Copied", timeout=2)

    def on_click(self, event: events.Click) -> None:
        self.copy()


class Link(Static):
    """Anything that opens a sheet when clicked: sidebar item, tab, pager box."""

    def __init__(self, content, target: str, **kw) -> None:
        self.target = target
        super().__init__(content, **kw)

    def on_click(self, event: events.Click) -> None:
        if self.target:
            self.app.open_sheet(self.target)


class Dummy(Static):
    """Toolbar buttons that the prototype shows but doesn't wire up yet."""

    def on_click(self, event: events.Click) -> None:
        self.app.notify(f"“{self.content}” isn't wired up in the prototype.", timeout=2)


# ---- the app ---------------------------------------------------------------------
class CheatSheet(App):
    CSS_PATH = "dc_cheat.tcss"
    TITLE = "dc-cheat"
    HORIZONTAL_BREAKPOINTS = [(0, "-narrow"), (150, "-wide")]
    BINDINGS = [
        Binding("j", "move(1)", "next command", show=False),
        Binding("k", "move(-1)", "previous command", show=False),
        Binding("enter,c", "copy", "copy", show=False),
        Binding("slash,ctrl+k", "search", "search", show=False),
        Binding("escape", "leave", "clear", show=False),
        Binding("right_square_bracket", "page(1)", "next sheet", show=False),
        Binding("left_square_bracket", "page(-1)", "previous sheet", show=False),
        Binding("q", "quit", "quit", show=False),
    ]

    def __init__(self, start: str) -> None:
        super().__init__()
        self.file = start if start in WHERE else "ib-mlxlink.html"
        self.two_cols: bool | None = None
        self.matches: list[tuple[str, int]] = []
        self.match_i = -1
        self.pending_focus: int | None = None
        self.first_render = True

    def compose(self) -> ComposeResult:
        with Horizontal(id="topbar"):
            yield Static(id="brand-chip")
            yield Static(id="brand-title")
            yield Input(placeholder="Search all sheets…   Ctrl K", id="search")
            yield Dummy("⚡ Triage & RMA", classes="tbtn -danger")
            yield Dummy("☆ My kit 0", classes="tbtn")
            yield Dummy("Explain", classes="tbtn")
            yield Dummy("Rack", classes="tbtn -wide-only")
            yield Dummy(">_ Terminal", classes="tbtn -wide-only")
            yield Dummy("Theme ▾", classes="tbtn -wide-only")
            yield Dummy("··· More", classes="tbtn -wide-only")
        yield Horizontal(id="tabs")
        with Horizontal(id="targets"):
            yield Static("▭ Name this node ▾", classes="tgt -dashed")
            yield Static("⇉ Fleet off", classes="tgt -dashed")
            yield Static("◎ RACK TARGETS", classes="tgt -label")
            for k, v in TARGETS:
                yield Static(Text.assemble((k + " ", C["muted"]), (v, C["arg"])), classes="tgt")
        with Horizontal(id="body"):
            yield VerticalScroll(id="sidebar")
            with VerticalScroll(id="main"):
                with Horizontal(id="cols"):
                    yield Vertical(id="col1", classes="col")
                    yield Vertical(id="col2", classes="col -second")
        with Horizontal(id="pager"):
            yield Link("", "", id="page-prev", classes="page")
            yield Link("", "", id="page-suite", classes="page")
            yield Link("", "", id="page-next", classes="page")
        with Horizontal(id="hints"):
            yield Static("Tip: Click any command or code box to copy it to your clipboard.", id="tip-text")
            yield Static(Text.assemble((" / ", "bold"), "search  ", (" j k ", "bold"), "move  ", (" ↵ ", "bold"), "copy  ", (" [ ] ", "bold"), "sheet  ", (" q ", "bold"), "quit"), id="keys")

    async def on_mount(self) -> None:
        await self.render_sheet()

    async def on_resize(self, event: events.Resize) -> None:
        if self.two_cols is not None and (event.size.width >= 150) != self.two_cols:
            await self.render_sheet()

    # ---- rendering ---------------------------------------------------------------
    def open_sheet(self, file: str, focus: int | None = None) -> None:
        self.file = file
        self.pending_focus = focus
        self.run_worker(self.render_sheet(), exclusive=True)

    async def render_sheet(self) -> None:
        ti, si, ki = WHERE[self.file]
        tab, suite = DATA["tabs"][ti], DATA["tabs"][ti]["suites"][si]
        meta = suite["sheets"][ki]
        sections = DATA["sheets"].get(self.file, [])

        words = suite["name"].split()
        caps = re.sub(r"[^A-Z]", "", suite["name"])  # InfiniBand -> IB, like the site's chip
        short = caps[:2] if len(caps) >= 2 else (words[0][:2] if len(words) == 1 else words[0][0] + words[1][0]).upper()
        self.query_one("#brand-chip", Static).update(Text(short + "#"))
        self.query_one("#brand-title", Static).update(meta["label"].split(":")[0])

        tabs = self.query_one("#tabs")
        await tabs.remove_children()
        for k, t in enumerate(DATA["tabs"]):
            first = t["suites"][0]["sheets"][0]["file"] if t["suites"] else ""
            cls = "tab -active" if k == ti else "tab"
            label = t["label"] if self.size.width >= 150 else TAB_SHORT.get(t["label"], t["label"])
            await tabs.mount(Link(f"{TAB_ICONS.get(t['label'], '·')} {label}", first, classes=cls))

        side = self.query_one("#sidebar")
        await side.remove_children()
        head = Text(suite["name"], style="bold")
        count = f"{ki + 1}/{len(suite['sheets'])}"
        head.append(" " * max(1, 26 - len(suite["name"]) - len(count)))
        head.append(count, style=C["muted"])
        items: list[Static] = [Static(head, id="suite-head")]
        heading = None
        for k, s in enumerate(suite["sheets"]):
            if s["heading"] and s["heading"] != heading:
                heading = s["heading"]
                items.append(Static(heading.upper(), classes="side-group"))
            label = Text.assemble((f"{s['code']:<4}", C["muted"]), " ", s["label"])
            label.truncate(30, overflow="ellipsis")
            items.append(Link(label, s["file"], classes="side-item -active" if k == ki else "side-item"))
        await side.mount_all(items)

        self.two_cols = self.size.width >= 150
        col1, col2 = self.query_one("#col1"), self.query_one("#col2")
        await col1.remove_children()
        await col2.remove_children()
        col2.display = self.two_cols
        heights = [0, 0]
        self.order: list[Static] = []  # command boxes in the sheet's own order, for j/k and search
        for sec in sections:
            card, est = self.build_card(sec)
            target = 0 if not self.two_cols or heights[0] <= heights[1] else 1
            heights[target] += est
            await (col1 if target == 0 else col2).mount(card)

        prev_ = suite["sheets"][ki - 1] if ki > 0 else None
        next_ = suite["sheets"][ki + 1] if ki + 1 < len(suite["sheets"]) else None
        p = self.query_one("#page-prev", Link)
        p.target = prev_["file"] if prev_ else ""
        p.update(Text.assemble(("← PREVIOUS\n", f"bold {C['accent']}"), (prev_["label"] if prev_ else "", "bold")) if prev_ else "")
        s = self.query_one("#page-suite", Link)
        s.target = suite["hub"] if suite["hub"] in WHERE else ""
        s.update(Text.assemble(("⋔ ", C["green"]), (suite["name"], "bold"), (f"\nsheet {ki + 1} of {len(suite['sheets'])}", C["muted"])))
        n = self.query_one("#page-next", Link)
        n.target = next_["file"] if next_ else ""
        n.update(Text.assemble(("NEXT →\n", f"bold {C['accent']}"), (next_["label"] if next_ else "", "bold"), justify="right") if next_ else "")

        self.query_one("#main").scroll_home(animate=False)
        boxes = self.boxes()
        if boxes:
            target = boxes[min(self.pending_focus or 0, len(boxes) - 1)]
            # Start on the first command (the site's j/k cursor), not in the search box.
            if self.first_render or not isinstance(self.focused, Input) or self.pending_focus is not None:
                target.focus()
                target.scroll_visible(animate=False)
        self.pending_focus = None
        self.first_render = False

    def build_card(self, sec: dict) -> tuple[Vertical, int]:
        """One section as a card, plus a rough height for the two-column balance."""
        kids: list = []
        est = 6
        for k, e in enumerate(sec["commands"]):
            if e["desc"] and e["desc"] != sec["subtitle"]:
                kids.append(Static(e["desc"], classes="desc", markup=False))
                est += 2
            box = CommandBox(e, classes="cmdbox -danger" if e.get("danger") else "cmdbox")
            self.order.append(box)
            kids.append(box)
            est += 3 + len(e.get("copy") or [1])
            if e["details"]:
                kids.append(Static(e["details"], classes="details", markup=False))
                est += 2 + len(e["details"]) // 55
            for f in e["flags"]:
                kids.append(Horizontal(Static(str(f[0]), classes="flag", markup=False), Static(str(f[1]), classes="flagdesc", markup=False), classes="flagrow"))
                est += 2 + len(str(f[1])) // 50
            for sub in e.get("subs", []):
                subbox = SubBox(str(sub[0]), str(sub[1]), classes="sub")
                self.order.append(subbox)
                kids.append(subbox)
                est += 3
            if e["tip"]:
                kids.append(Static(Text.assemble(tag("TIP", "#052e16", C["green"]), " ", (e["tip"], C["secondary"])), classes="tip"))
                est += 2
        head = Horizontal(
            Static(sec["badge"] or "•", classes="chip", markup=False),
            Vertical(Static(sec["title"], classes="card-title", markup=False), Static(sec["subtitle"], classes="card-sub", markup=False), classes="card-titles"),
            classes="card-head",
        )
        return Vertical(head, *kids, classes="card"), est

    def boxes(self) -> list[Static]:
        """Command boxes in the sheet's order (cards may sit in either column)."""
        return [w for w in getattr(self, "order", []) if w.is_attached]

    # ---- actions -----------------------------------------------------------------------
    def action_move(self, step: int) -> None:
        boxes = self.boxes()
        if not boxes:
            return
        i = boxes.index(self.focused) if self.focused in boxes else -1
        target = boxes[max(0, min(len(boxes) - 1, i + step))]
        target.focus()
        target.scroll_visible(animate=False)

    def action_copy(self) -> None:
        if isinstance(self.focused, (CommandBox, SubBox)):
            self.focused.copy()

    def action_search(self) -> None:
        self.query_one("#search", Input).focus()

    def action_leave(self) -> None:
        search = self.query_one("#search", Input)
        if self.focused is search:
            search.value = ""
            self.action_move(0)

    def action_page(self, step: int) -> None:
        ti, si, ki = WHERE[self.file]
        sheets = DATA["tabs"][ti]["suites"][si]["sheets"]
        k = ki + step
        if 0 <= k < len(sheets):
            self.open_sheet(sheets[k]["file"])

    def on_input_submitted(self, event: Input.Submitted) -> None:
        """Enter in search jumps to the first match; Enter again goes to the next one."""
        words = event.value.lower().split()
        if not words:
            return
        key = " ".join(words)
        if getattr(self, "last_query", None) != key:
            self.last_query = key
            self.matches = []
            for tab in DATA["tabs"]:
                for suite in tab["suites"]:
                    for s in suite["sheets"]:
                        n = 0
                        for sec in DATA["sheets"].get(s["file"], []):
                            for e in sec["commands"]:
                                hay = f"{e['cmd']} {e['desc']} {sec['title']}".lower()
                                if all(w in hay for w in words):
                                    self.matches.append((s["file"], n))
                                n += 1 + len(e.get("subs", []))
            self.match_i = -1
        if not self.matches:
            self.notify(f"No command matches “{event.value}”.", timeout=2)
            return
        self.match_i = (self.match_i + 1) % len(self.matches)
        file, n = self.matches[self.match_i]
        self.notify(f"Match {self.match_i + 1} of {len(self.matches)}: Enter for the next, Esc to go back to the sheet.", timeout=2)
        self.open_sheet(file, focus=n)


if __name__ == "__main__":
    CheatSheet(sys.argv[1] if len(sys.argv) > 1 else "ib-mlxlink.html").run()
