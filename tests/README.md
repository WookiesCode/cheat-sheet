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
| `portable-icon.test.js` | The portable file's favicon data URI decodes |
| `bridge.test.py` | `term-bridge.py` survives a large paste and bad or oversized resize messages (it uses a throwaway `HOME`) |

Run these by hand; the runner skips them:

- `perf.js`: load timing per page, and a horizontal-overflow sweep of every page at 700–1280 px. It's slow, and it reports rather than passes or fails.
- `xss-peek.js <tool>`: a debug helper for `xss.test.js` that prints what one tool's dialog shows.

## Writing a test

Name it `<what>.test.js` and start it with `const { BASE, launch, newContext } = require('./lib');`. Exit 0 on pass and 1 on fail. `newContext()` sets the laptop viewport and turns off the tour invite.

Click the way a person does: `mouse.down()`, wait about 150 ms, then `mouse.up()`. Instant synthetic clicks have hidden real bugs here before.
