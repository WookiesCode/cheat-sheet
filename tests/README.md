# Site tests

Browser checks for the cheat-sheet site. They drive headless Chrome with Playwright. The repo has no `package.json`, so Playwright is borrowed from wherever it is installed.

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
| `CHROME_PATH` | `/usr/bin/google-chrome-stable` | The browser to drive |
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
| `sources.test.js` | All 31 NVIDIA, 51 InfiniBand, 45 Redfish/IPMI, 107 BMC-tool, 67 switch, 21 Ethernet, 9 Linux storage, 16 Linux hardware and 50 hardware-reference and 96 Kubernetes/GPU-container entries show a source line (no sudo on those sheets; root badges and drain/cordon flags intact) (storage also on the Linux hub); stress-ng, modprobe loads and cpupower frequency-set flagged; the switch hub builder's corrected commands; blkdiscard, mdadm --add and lvextend flagged as changing state; the corrected commands; amber after a year; survives a re-render; the portable copy; no injection through `src` |
| `reboot-reference.test.js` | The 10 host reboot/shutdown entries and the NMI (kernel panic) commands are reference-only on every page and the portable copy (real clicks, Ctrl+K, My kit); BMC power and read-only neighbours still copy |
| `explain-help.test.js` | Explain reads a flag's description from its `--help` text without cutting at "e.g." (nvidia-smi `-d`) |
| `whats-new.test.js` | A returning user's "What's new" invite and tour walk only the 5 newest additions and mark version 9 seen |
| `jk-smooth-scroll.test.js` | `j` pressed while the page is still smooth-scrolling leaves the focused command visible (runs the race inside the page: driven step by step, headless Chrome finishes the animation between calls) |
| `redfish-builder.test.js` | The Redfish request builder's vendor presets: DGX uses Systems/DGX, Managers/BMC, LogServices/SEL; no HGX-baseboard preset; Standard and Dell unchanged |
| `practice-trail.test.js` | Practice's From my trail scope: matches filled-in trail entries (live and other nodes) back to sheet commands, most-copied first; no chip when the trail is empty |
| `nav-once.test.js` | Pages carry only the fallback nav plus `nav.js`; the full menus are in place by DOMContentLoaded (http and `file://`) and match `nav/nav-source.html`; hovering a tab opens its menu; without JavaScript the fallback still links every tab |
| `doc-counts.test.js` | The counts in `README.md` and `docs/site.md` match the home page (run after `node build-all.js`) |
| `portable-icon.test.js` | The portable file's favicon data URI decodes |
| `bridge.test.py` | `term-bridge.py` survives a large paste and bad or oversized resize messages (it uses a throwaway `HOME`) |

Run these by hand; the runner skips them:

- `perf.js`: load timing per page, and a horizontal-overflow sweep of every page at 700–1280 px. It's slow, and it reports rather than passes or fails.
- `xss-peek.js <tool>`: a debug helper for `xss.test.js` that prints what one tool's dialog shows.

## Writing a test

Name it `<what>.test.js` and start it with `const { BASE, launch, newContext } = require('./lib');`. Exit 0 on pass and 1 on fail. `newContext()` sets the laptop viewport and turns off the tour invite.

Click the way a person does: `mouse.down()`, wait about 150 ms, then `mouse.up()`. Instant synthetic clicks have hidden real bugs here before.
