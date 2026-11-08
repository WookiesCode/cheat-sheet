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

First time only (creates `tui-py/.venv`, nothing system-wide):

```bash
uv venv .venv --python 3.12 && uv pip install --python .venv/bin/python 'textual==8.2.8'
```

## Keys and mouse

| Key / mouse | Does |
|---|---|
| click a command, or `Enter` / `c` | copy it (OSC 52; root commands get a `# needs root` line, no sudo) |
| click one line of a multi-alternative box | copy that alternative |
| `j` / `k` | next / previous command |
| `[` / `]` | previous / next sheet in the suite |
| click a sidebar item, tab or pager box | open that sheet |
| `/` or `Ctrl+K`, type, `Enter` | jump to the first matching command; `Enter` again for the next |
| `Esc` | leave the search box |
| `q` | quit |

## Files

| File | What |
|---|---|
| `export.js` | `node tui-py/export.js` → `data/site.json`: nav tabs, suites, every sheet's sections, plus the site's own danger / root / alternatives rules (run from `common.js`) |
| `dc_cheat.py` | the app |
| `dc_cheat.tcss` | the stylesheet: the site's dark-theme tokens from `styles.css` |
| `test_dc_cheat.py` | clicks and keys driven headless (`.venv/bin/python test_dc_cheat.py`) |
| `sweep.py` | opens every sheet: crashes and render time |
| `shot.py` | SVG screenshot of any sheet at any size |

## Not in the prototype yet

Toolbar buttons (Triage, My kit, Explain, Rack, Terminal, Theme, More) are shown but not wired;
hub pages, Home/Workbench, Ticketing and Omarchy aren't exported; Rack Targets are the
site's defaults and not editable; no light theme; no single-file `.pyz` packaging yet.
