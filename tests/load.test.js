// Load-check after the flatten: each page over HTTP plus the 1-file portable over file://.
// Reports page errors, console errors, failed/404 requests, and a few content counts.
const { ROOT, BASE, OUT, launch, newContext } = require('./lib');
const path = require('path');

const PAGES = [
  ['home', BASE + 'index.html'],
  ['linux', BASE + 'linux.html'],
  ['nv-smi', BASE + 'nvidia.html#nv-smi'],
  ['notes', BASE + 'notes.html'],
  ['tools', BASE + 'tools.html'],
  ['portable', 'file://' + path.join(ROOT, 'datacenter-cheatsheet-portable.html')],
];

(async () => {
  const browser = await launch();
  let bad = 0;
  for (const [name, url] of PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '999'); } catch (e) {} });
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
    page.on('requestfailed', r => errs.push('failed: ' + r.url()));
    page.on('response', r => { if (r.status() >= 400) errs.push(r.status() + ': ' + r.url()); });
    const resp = await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const info = await page.evaluate(() => ({
      title: document.title,
      cmds: document.querySelectorAll('.cmd-code-box, .cmd-code').length,
      cards: document.querySelectorAll('.section-card').length,
      nav: document.querySelectorAll('nav a, .ng-group').length,
      cssOk: getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)',
    }));
    await page.screenshot({ path: path.join(OUT, `load-${name}.png`) });
    const status = resp ? resp.status() : 'file';
    if (errs.length) bad++;
    console.log(`${errs.length ? 'FAIL' : 'ok  '} ${name.padEnd(8)} ${status} "${info.title}" cmds=${info.cmds} cards=${info.cards} nav=${info.nav} css=${info.cssOk}`);
    for (const e of errs.slice(0, 8)) console.log('       ' + e);
    await ctx.close();
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
