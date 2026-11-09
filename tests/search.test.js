// Ctrl+K search still finds commands once global-search-index.js loads from a stamped URL.
const { ROOT, BASE, OUT, launch, newContext } = require('./lib');

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
  const page = await ctx.newPage();
  let indexUrl = '';
  page.on('response', r => { if (r.url().includes('global-search-index.js')) indexUrl = r.url() + ' ' + r.status(); });
  await page.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(300);
  await page.keyboard.type('mlxlink', { delay: 40 });
  await page.waitForTimeout(600);
  const n = await page.evaluate(() => document.querySelectorAll('.palette-item').length);
  const first = await page.evaluate(() => { const r = document.querySelector('.palette-item'); return r ? r.innerText.split('\n')[0].slice(0, 80) : null; });
  console.log(`index: ${indexUrl}\nresults for "mlxlink": ${n}; first: ${first}`);
  await browser.close();
  process.exit(n > 0 ? 0 : 1);
})();
