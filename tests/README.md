# Site tests

Browser checks for the cheat-sheet site. They drive a headless Chromium-based browser (your default one; see `CHROME_PATH` below) with Playwright. The repo has no `package.json`, so Playwright is borrowed from wherever it is installed.

## Run them

```bash
node tests/run-all.js
```

This starts its own server on `127.0.0.1:8799`, runs every `*.test.js` and `*.test.py` file, prints a summary, and exits non-zero if anything fails. To run only some tests, pass a filter: `node tests/run-all.js search`.

Run the tests after `node build-all.js`. The tests read the built pages and the portable file.

## Settings

| Variable | Default | What it sets |
|---|---|---|
| `PLAYWRIGHT_PATH` | `~/.npm/_npx/e41f203b7505f1fb/node_modules/playwright` | Playwright's `node_modules/playwright` folder |
| `CHROME_PATH` | your default browser, else Playwright's Chromium | The browser to drive. Unset, `lib.js` asks `xdg-settings` for the default browser (on Omarchy, `omarchy-cmd-default-browser` behind its launcher) and uses it if it is Chromium-based (Chromium, Chrome, Brave, Edge, Vivaldi); otherwise Playwright's own Chromium. `run-all.js` prints which one and why. |
| `TEST_PORT` | `8799` | The runner's server port |
| `TEST_BASE` | `http://127.0.0.1:8765/` | Site URL when you run one test directly against your own preview server |

## What each test checks

| File | Checks |
|---|---|
| `all-pages.test.js` | Every page loads with no page errors and no 4xx/5xx requests |
| `load.test.js` | The key pages and the portable file over `file://`: errors, console errors, failed requests (screenshots go to `output/`) |
| `search.test.js` | Ctrl+K finds commands once the stamped search index loads |
| `xss.test.js` | Every paste or input tool renders HTML payloads as text, never runs them (it includes a control payload that must fire) |
| `search-danger.test.js` | Ctrl+K flags state-changing results; the first Enter asks, the second copies; a click opens without copying |
| `dialog-focus.test.js` | Tab and Shift+Tab stay inside open tools, Esc returns focus to the opener, side-docked tools don't trap |
| `backup.test.js` | Backup from localhost, restore into the portable file: no secrets, own keys only, unticked items skipped, undo, rollback |
| `storage-persist.test.js` | The browser is asked to keep the data once per tab on a save, never on page load; each panel state |
| `storage-warn.test.js` | A refused save raises one persistent bar (full / blocked / refused); tab-only data stays quiet |
| `focus-visible.test.js` | Tab, Shift+Tab and j/k never leave focus fully hidden under the fixed bars at 1280 and 800 px |
| `skip-link.test.js` | The first Tab shows the skip link; Enter lands on the first command or the content, on every page type |
| `sources.test.js` | All 31 NVIDIA, 51 InfiniBand, 45 Redfish/IPMI, 78 BMC-tool, 67 switch, 21 Ethernet, 9 Linux storage, 16 Linux hardware and 50 hardware-reference, 96 Kubernetes/GPU-container, 37 Slurm, 91 parallel-filesystem the remaining 32 Linux entries all 195 CLI-tool cards (plus the CLI hub) all 63 general Docker cards, all 72 SRE cards and every Grafana card (six sheets and the hub) every editor card (nano, VS Code, Zed, Cursor and the hub) every Neovim card (hub and nine sheets) every Windows card (hub and eight sheets) every macOS card (hub and eight sheets) and every card on the scripting hub and its bash, Python, JS, TS, PowerShell, JSON, YAML, TOML, regex, awk/sed and SQL sheets, every Lua, git and Markdown card, every fiber card (hub and four sheets), every motherboard card (hub and seven sheets; four marked Not verified), every Omarchy card, every Jira card, and the 67 Pro Tip cards on the NVIDIA, InfiniBand, IPMI, Ethernet, Redfish, switch and BMC-tool sheets show a source line, Ctrl+K command results show it too and variants inside a card inherit it (every Linux hub card sourced; package, service, firewall and permission changes flagged; /etc/passwd as a file not) (no sudo on those sheets; root badges and drain/cordon flags intact) (storage also on the Linux hub); stress-ng, modprobe loads and cpupower frequency-set flagged; the switch hub builder's corrected commands; blkdiscard, mdadm --add and lvextend flagged as changing state; the corrected commands; amber after a year; survives a re-render; the portable copy; no injection through `src` |
| `reboot-reference.test.js` | The 10 host reboot/shutdown entries and the NMI (kernel panic) commands are reference-only on every page and the portable copy (real clicks, Ctrl+K, My kit); BMC power and read-only neighbours still copy |
| `explain-help.test.js` | Explain reads a flag's description from its `--help` text without cutting at "e.g." (nvidia-smi `-d`) |
| `sources.test.js` (2m, 2zc) | The merged CLI page: all 47 tools on cli-tools.html with sources; `#grep` shows only grep; rail click, Back, the All link and a command link; stars from the old pages carried over; the menu links to `#tool` |
| `lib.js` `page()` / `merged-pages.json` | Old page → its address on the group page (`nv-smi.html` → `nvidia.html#nv-smi`), for tests written against the old pages |
| `sources.test.js` (2zd) | Switch Rosetta: the corrected NVUE, SONiC and MLNX-OS commands, and its column links open parts of switches.html |
| `sources.test.js` (2ze) | BMC Rosetta without Dell: a `dell` vendor saved before 2026-11-11 is ignored (no page error), "Compare all" shows 6 tools, no racadm or Dell ids, Redfish paths use `Systems/1` and `Managers/1`; the BMC tools page has no racadm entries |
| `sources.test.js` (field guide) | The field-guide cards re-checked 2026-11-10: every fiber card has a source except the three First Connection procedure cards (Not verified); no card says its sources were not re-read; the MMA4Z00-NS-FLT and QSFP112-in-SN5400 corrections stay |
| `sources.test.js` (switch check) | Only the EOS `bash ethtool` row says Not verified on the Switches page; the MLNX-OS corrections stay (`boot system next`, no `show cables`, description inside interface ib mode); no Switch Rosetta cell says "check on your release"; the EOS MAC note |
| `sources.test.js` (InfiniBand four) | No InfiniBand recipe says Not verified; OpenSM status covers opensm and opensmd; the ibdiagnet grep matches the card's `-o` path and names the default `/var/tmp/ibdiagnet2/` |
| `sources.test.js` (lspci, RJ45) | No NVIDIA or Ethernet entry says Not verified; the lspci audit uses `-D` and a domain-prefixed header pattern |
| `panel-devices.test.js` | The guide's devices in the front panel: 22 port names light the right cage (IB `port 3` and `3`, `cage 14`, `C05`, `Gi1/0/14`, `Te1/1/3`, `sfp28-3`, `Q1`, `swp14s1`, `LAN2 SFP`, `LMIC1`…), every vendor photo loads; tiles: QM C01 holds 1\|2, C02 4\|3, searching IB port 3 lights it inside C02, clicking a logical port searches it; SN5600 2× rows s0\|s1 / s1\|s0; a breakout search switches to 4× once and a View choice sticks; ACS8000 drawn as four tiles; the picker lists only the 11 team devices; an optic saved in a cage is marked, listed, kept and cleared, copper ports take none; Team Optics and Switch hardware cards; the portable file inlines the 11 photos; the N9K photo note (drawing reads FX, Cisco's FX3 figure); Ctrl+K glossary: FR4 = Far Reach, QSFP28 = 4 × 25G NRZ, no invented LMIC expansion |
| `part-switch.test.js` | Group pages switch parts in place: rail, pager Next, **All …**, Back and a card link in another part change the cards, **Showing** bar and rail with no reload (one document load for the whole run); the window moves at most once (no glide) and the new part starts below the fixed command bar; **All** opens at the top; a star made after a switch saves; all 22 group pages switch between two parts in place |
| `whats-new.test.js` | A returning user's "What's new" invite and tour walk only the 4 newest additions (your switches on the front panel, breakouts and installed optics, team optics, sheets switching without a reload) and mark version 14 seen; each step's ▶ works (QM9790 IB port 3 lit inside C02, SN5600 swp14s3 in the 4× view, Team Optics & Fit opens, CLI Tools opens at tar) |
| `jk-smooth-scroll.test.js` | `j` pressed while the page is still smooth-scrolling leaves the focused command visible (runs the race inside the page: driven step by step, headless Chrome finishes the animation between calls) |
| `redfish-builder.test.js` | The Redfish request builder's vendor presets: DGX uses Systems/DGX, Managers/BMC, LogServices/SEL; no HGX-baseboard preset; no Dell preset or Dell ids; Standard unchanged |
| `no-sudo.test.js` | No command outside the sheets that teach sudo (and the `sudoedit` / `\| sudo tee` idioms) starts with `sudo`; the commands that lost it still show their root or maybe-root badge; the tools too: no stored sudo in healthy ranges or runbooks, root stages run as `sudo -n` (privRunForm), copy as `# needs root`, the GPU-missing runbook badges its root steps, the capture script sends `nvme list && sudo -n nvme smart-log` |
| `kit-navi.test.js` | My kit's Export for navi: the `.cheat` file's groups, variables, danger marks and left-out multi-line commands; the installed navi parses it and returns each command unchanged (skips the navi step if navi isn't installed) |
| `usage-meter.test.js` | Opening a sheet, Explain, the Case Trail and the triage tabs each counts once in `dc_usage`; the Workbench's Unused in 30 days fold lists exactly the stale tools and sheets; a young meter says so |
| `practice-trail.test.js` | Practice's From my trail scope: matches filled-in trail entries (live and other nodes) back to sheet commands, most-copied first; no chip when the trail is empty |
| `nav-once.test.js` | Pages carry only the fallback nav plus `nav.js`; the full menus are in place by DOMContentLoaded (http and `file://`) and match `nav/nav-source.html`; hovering a tab opens its menu; without JavaScript the fallback still links every tab |
| `doc-counts.test.js` | The counts in `README.md` and `docs/site.md` match the home page (run after `node build-all.js`) |
| `portable-icon.test.js` | The portable file's favicon data URI decodes |
| `bridge.test.py` | `term-bridge.py` survives a large paste and bad or oversized resize messages; a stop message ends it and its shells; it starts in the background in its own session, says "already running", and `--stop` stops it (it uses a throwaway `HOME` and `--no-open`) |
| `bridge-handoff.test.js` | Opening the site with `#term-token=…&term-port=…` saves the token, takes it out of the address bar and history, opens the Terminal and connects; Stop bridge asks first, then ends the bridge; a malformed token is ignored |

Run these by hand; the runner skips them:

- `perf.js`: load timing per page, and a horizontal-overflow sweep of every page at 700–1280 px. It's slow, and it reports rather than passes or fails.
- `xss-peek.js <tool>`: a debug helper for `xss.test.js` that prints what one tool's dialog shows.

## Writing a test

Name it `<what>.test.js` and start it with `const { BASE, launch, newContext } = require('./lib');`. Exit 0 on pass and 1 on fail. `newContext()` sets the laptop viewport and turns off the tour invite.

Click the way a person does: `mouse.down()`, wait about 150 ms, then `mouse.up()`. Instant synthetic clicks have hidden real bugs here before.
