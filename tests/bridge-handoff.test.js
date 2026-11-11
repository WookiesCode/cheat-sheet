// term-bridge.py opens the site with #term-token=…&term-port=…: the page keeps the token, takes it
// out of the address bar and history, opens the Terminal and connects. Stop bridge (after its
// confirm) ends the bridge process and its shell.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const PORT = 18768;
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  // A throwaway HOME, so the real token and pid file are untouched.
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'tb-handoff-'));
  const bridge = spawn('python3', [path.join(ROOT, 'term-bridge.py'), '--port', String(PORT), '--foreground', '--no-open'],
    { env: Object.assign({}, process.env, { HOME: home, SHELL: '/bin/bash' }), stdio: 'ignore' });
  let exited = false;
  bridge.on('exit', () => { exited = true; });
  await sleep(900);
  const token = fs.readFileSync(path.join(home, '.config/dc-cheatsheet/term-token'), 'utf8').trim();

  const browser = await launch();
  try {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    p.on('pageerror', e => check(false, 'page error: ' + e.message));
    await p.goto(`${BASE}index.html#term-token=${token}&term-port=${PORT}`, { waitUntil: 'load' });
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => ({ hash: location.hash, href: location.href, prefs: JSON.parse(localStorage.getItem('dc_terminal_prefs') || '{}') }));
    check(r.prefs.token && r.prefs.token.length >= 24 && r.prefs.port === 18768, 'the token and port from the address are saved like a pasted token');
    check(r.hash === '' && !/term-token/.test(r.href), 'the token is taken out of the address bar');
    await p.waitForSelector('.con-drawer.open', { timeout: 5000 }).catch(() => {});
    let status = '';
    for (let i = 0; i < 30 && !/@/.test(status); i++) { await p.waitForTimeout(200); status = await p.evaluate(() => (document.querySelector('.con-status') || {}).textContent || ''); }
    check(/@/.test(status), `the Terminal opens and connects by itself (${status})`);

    // Stop bridge asks first, then stops the bridge.
    await p.click('.con-stop', { delay: 120 });
    await p.waitForTimeout(200);
    check(await p.evaluate(() => !document.querySelector('.con-confirm').hidden && /Stop term-bridge\.py\?/.test(document.querySelector('.con-confirm').textContent)), 'Stop bridge asks before stopping');
    check(!exited, 'nothing is stopped before the confirm');
    await p.click('.con-confirm [data-con="confirm-yes"]', { delay: 120 });
    for (let i = 0; i < 25 && !exited; i++) await sleep(200);
    check(exited, 'the bridge process ends');
    status = await p.evaluate(() => document.querySelector('.con-status').textContent);
    check(/Bridge stopped/.test(status), `the dock says the bridge stopped (${status})`);

    // The address was replaced, not added: Back leaves the page instead of landing on the token URL.
    await p.goBack().catch(() => {});
    await p.waitForTimeout(200);
    check(!/term-token/.test(p.url()), `and no history entry keeps it (Back goes to ${p.url()})`);

    // A malformed fragment is left alone.
    await p.goto(`${BASE}index.html#term-token=short`, { waitUntil: 'load' });
    await p.waitForTimeout(300);
    check(await p.evaluate(() => JSON.parse(localStorage.getItem('dc_terminal_prefs') || '{}').token !== 'short'), 'a too-short token in the address is ignored');
    await ctx.close();
  } finally {
    await browser.close();
    if (!exited) bridge.kill('SIGTERM');
    fs.rmSync(home, { recursive: true, force: true });
  }
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
