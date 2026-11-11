// Shared setup for the browser tests: where Playwright and the browser live, and which server to hit.
// No package.json on purpose: the site has no build dependencies, so Playwright is borrowed
// from wherever it is installed. Override any default with an environment variable.
const os = require('os');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const PLAYWRIGHT = process.env.PLAYWRIGHT_PATH
  || path.join(os.homedir(), '.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
// run-all.js sets TEST_BASE to its own server; run a test alone against your preview server.
const BASE = process.env.TEST_BASE || 'http://127.0.0.1:8765/';
// Screenshots and other artifacts; git-ignored.
const OUT = path.join(__dirname, 'output');

let chromium;
try {
  ({ chromium } = require(PLAYWRIGHT));
} catch (e) {
  console.error(`Playwright not found at ${PLAYWRIGHT}. Set PLAYWRIGHT_PATH to its node_modules/playwright folder.`);
  process.exit(2);
}

// The browser: CHROME_PATH if set, else your desktop's default browser, else Playwright's own
// Chromium. Playwright's chromium driver needs a Chromium-family browser (Chromium, Chrome,
// Brave, Edge, Vivaldi); a Firefox-family default (Firefox, Zen) falls back, and says so.
const CHROMIUM_FAMILY = /chrom|brave|edge|vivaldi|opera|thorium/i;
const quiet = (cmd, args) => {
  try { return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 3000 }).trim(); } catch (e) { return ''; }
};
const onPath = cmd => (cmd.includes('/') ? (fs.existsSync(cmd) ? cmd : '') : quiet('sh', ['-c', 'command -v -- "$1"', 'sh', cmd]));
const DATA_DIRS = [process.env.XDG_DATA_HOME || path.join(os.homedir(), '.local/share'),
  ...(process.env.XDG_DATA_DIRS || '/usr/local/share:/usr/share').split(':')];
// The program a .desktop entry runs (its Exec= line, first word).
function desktopExec(id) {
  for (const dir of DATA_DIRS) {
    const file = path.join(dir, 'applications', id);
    if (!fs.existsSync(file)) continue;
    const m = fs.readFileSync(file, 'utf8').match(/^Exec=(\S+)/m);
    return m ? m[1] : '';
  }
  return '';
}
function defaultBrowser() {
  let id = quiet('xdg-settings', ['get', 'default-web-browser']);
  let exec = id ? desktopExec(id) : '';
  // A launcher that picks the browser itself (Omarchy's omarchy-launch-browser): ask which one.
  if (exec && !CHROMIUM_FAMILY.test(exec) && onPath('omarchy-cmd-default-browser')) {
    id = quiet('omarchy-cmd-default-browser', []) || id;
    exec = desktopExec(id) || exec;
  }
  const bin = exec ? onPath(exec) : '';
  return { id, bin: bin && CHROMIUM_FAMILY.test(`${bin} ${fs.realpathSync(bin)}`) ? bin : '', other: bin };
}
function pickBrowser() {
  if (process.env.CHROME_PATH) return { path: process.env.CHROME_PATH, why: 'CHROME_PATH' };
  const d = defaultBrowser();
  if (d.bin) return { path: d.bin, why: `default browser (${d.id})` };
  const bundled = chromium.executablePath();
  const why = d.other ? `default browser ${d.other} is not Chromium-based, so Playwright's Chromium` : "no default browser found, so Playwright's Chromium";
  if (fs.existsSync(bundled)) return { path: bundled, why };
  console.error(`No browser to drive: ${why} is not installed either. Set CHROME_PATH to a Chromium-based browser.`);
  process.exit(2);
}
const BROWSER = pickBrowser();
const CHROME = BROWSER.path;
const launch = () => chromium.launch({ executablePath: CHROME });

// Skip the tour invite so it never covers what a test clicks.
async function newContext(browser, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, ...opts });
  await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '999'); } catch (e) {} });
  return ctx;
}

// The old per-topic pages are parts of group pages now (nv-smi.html → nvidia.html#nv-smi).
// page('nv-smi.html') gives the new address; sheetOf(item) is an index entry's sheet in that form.
const MERGED = require('./merged-pages.json');
const page = file => MERGED[file] || file;
const sheetOf = item => item.sheet || item.file;

module.exports = { ROOT, BASE, OUT, CHROME, BROWSER, chromium, launch, newContext, MERGED, page, sheetOf };
