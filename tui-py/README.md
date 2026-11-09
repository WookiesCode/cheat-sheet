# dc-cheat: Textual prototype

A **prototype** of the cheat-sheet site's sheet page in the terminal, built with
[Textual](https://textual.textualize.io/) (Python), to compare with the web page before
deciding whether to replace the Go version in `../tui/`.

## Run it

```bash
cd tui-py
.venv/bin/python dc_cheat.py              # opens ib-mlxlink
.venv/bin/python dc_cheat.py nv-smi.html  # any sheet in the nav
```

First time only (creates `tui-py/.venv`, nothing system-wide), then build the data for Explain
(`data/explain.json`, ~10 MB, git-ignored because it's a copy of the site's man pages):

```bash
uv venv .venv --python 3.12 && uv pip install --python .venv/bin/python 'textual==8.2.8'
```

```bash
node export.js
```

## One file for servers (`.pyz`)

```bash
./build_pyz.sh                       # → dist/dc-cheat.pyz (~10 MB) + .sha256
scp dist/dc-cheat.pyz <host>:bin/dc-cheat
```

On the server it needs only **python3 3.9 or newer** (Ubuntu 22.04 and 24.04 yes; 20.04's 3.8 no,
and it says so). No pip, no internet, nothing written to disk; run it as `dc-cheat` or
`python3 dc-cheat.pyz`. It holds Textual and its dependencies (all pure Python) plus the app,
stylesheet and data. Bytecode is built for Python 3.12, so 3.12 starts fastest (~0.4 s to the
first screen); other versions compile from source each start (~0.7 s).

## Keys and mouse

| Key / mouse | Does |
|---|---|
| click a command, or `Enter` / `c` | copy it (OSC 52; root commands get a `# needs root` line, no sudo) |
| click one line of a multi-alternative box | copy that alternative |
| `j` / `k` | next / previous command |
| `[` / `]` | previous / next sheet in the suite |
| click a sidebar item, tab or pager box | open that sheet |
| `/` or `Ctrl+K`, type, `Enter` | jump to the first matching command; `Enter` again for the next |
| `e`, or the **Explain** button | Explain a command: `e` fills in the focused command, the button opens it empty with the site's samples |
| in Explain: type or paste | explained as you type: verdict, the command word by word, each flag from the sheets, man pages or `--help` |
| in Explain: `Tab` / `Enter`, or click | the buttons: copy the command, copy the safe version (password swapped for a variable), open the tool's sheet, search the sheets |
| `Esc` | leave the search box |
| `q` | quit |

## Files

| File | What |
|---|---|
| `export.js` | `node tui-py/export.js` → `data/site.json`: nav tabs, suites, every sheet's sections, plus the site's own danger / root / alternatives rules (run from `common.js`) |
| `dc_cheat.py` | the app |
| `explain.py` | Explain a command: a port of the site's Explain (common.js `exTokenize` … `exAnalyze`) |
| `dc_cheat.tcss` | the stylesheet: the site's dark-theme tokens from `styles.css` |
| `test_dc_cheat.py` | clicks and keys driven headless (`.venv/bin/python test_dc_cheat.py`) |
| `test_explain.py`, `explain_golden.js` | runs the site's own Explain (in node) and `explain.py` over every command on the sheets and compares them |
| `sweep.py` | opens every sheet: crashes and render time |
| `shot.py` | SVG screenshot of any sheet at any size |
| `build_pyz.sh` | builds `dist/dc-cheat.pyz` (git-ignored) |

## Not in the prototype yet

Toolbar buttons (Triage, My kit, Rack, Terminal, Theme, More) are shown but not wired; Explain has no
Pin to case, Manual or Side buttons and no hover linking between the words and their rows; its input
is one line (pasted newlines are not kept);
hub pages, Home/Workbench, Ticketing and Omarchy aren't exported; Rack Targets are the
site's defaults and not editable; no light theme.
