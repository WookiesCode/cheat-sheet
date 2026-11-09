// Shared setup for the browser tests: where Playwright and Chrome live, and which server to hit.
// No package.json on purpose: the site has no build dependencies, so Playwright is borrowed
// from wherever it is installed. Override any default with an environment variable.
const os = require('os');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PLAYWRIGHT = process.env.PLAYWRIGHT_PATH
  || path.join(os.homedir(), '.npm/_npx/e41f203b7505f1fb/node_modules/playwright');
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome-stable';
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

const launch = () => chromium.launch({ executablePath: CHROME });

// Skip the tour invite so it never covers what a test clicks.
async function newContext(browser, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, ...opts });
  await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '999'); } catch (e) {} });
  return ctx;
}

module.exports = { ROOT, BASE, OUT, CHROME, chromium, launch, newContext };
