// Sweep every *.html at the repo root over HTTP: page errors and 4xx/5xx requests (favicon ignored).
const { ROOT, BASE, OUT, launch, newContext } = require('./lib');
const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'datacenter-cheatsheet-portable.html').sort();

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  let bad = 0;
  for (const f of files) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push('pageerror: ' + e.message));
    page.on('response', r => { if (r.status() >= 400 && !r.url().endsWith('/favicon.ico')) errs.push(r.status() + ' ' + r.url()); });
    await page.goto(BASE + f, { waitUntil: 'load' });
    await page.waitForTimeout(300);
    if (errs.length) { bad++; console.log('FAIL ' + f + '\n  ' + errs.slice(0, 5).join('\n  ')); }
    await page.close();
  }
  console.log(`${files.length - bad}/${files.length} pages loaded with no errors`);
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
