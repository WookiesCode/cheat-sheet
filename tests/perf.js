// Load cost per page (CDP metrics) and horizontal overflow at laptop widths.
const { ROOT, BASE, OUT, launch, newContext } = require('./lib');
const fs = require('fs');
const path = require('path');

const PERF_PAGES = ['index.html', 'linux.html', 'nv-smi.html', 'git.html', 'grafana.html', 'ib-mlxlink.html'];
const WIDTHS = [700, 900, 1024, 1280];
const allPages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !f.includes('portable'));

(async () => {
  const browser = await launch();

  console.log('page                 DCL ms  load ms  script ms  task ms  JS KB transferred  heap MB');
  for (const f of PERF_PAGES) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Performance.enable');
    let jsBytes = 0;
    page.on('response', async r => { if (/\.js(\?|$)/.test(r.url())) { try { jsBytes += (await r.body()).length; } catch (e) {} } });
    await page.goto(BASE + f, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd }; });
    const m = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x => [x.name, x.value]));
    console.log(`${f.padEnd(20)} ${String(Math.round(nav.dcl)).padStart(6)} ${String(Math.round(nav.load)).padStart(8)} ${String(Math.round(m.ScriptDuration * 1000)).padStart(10)} ${String(Math.round(m.TaskDuration * 1000)).padStart(8)} ${String(Math.round(jsBytes / 1024)).padStart(18)} ${(m.JSHeapUsedSize / 1048576).toFixed(1).padStart(8)}`);
    await ctx.close();
  }

  // Overflow sweep: every page at each laptop width.
  const ctx = await browser.newContext();
  await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
  const page = await ctx.newPage();
  const over = {};
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const f of allPages) {
      await page.goto(BASE + f, { waitUntil: 'load' });
      await page.waitForTimeout(150);
      const r = await page.evaluate(() => {
        const de = document.documentElement;
        if (de.scrollWidth <= de.clientWidth + 1) return null;
        // Name the widest offending element to make the report actionable.
        let worst = null;
        for (const el of document.querySelectorAll('body *')) {
          const b = el.getBoundingClientRect();
          if (b.right > de.clientWidth + 1 && b.width > 0 && getComputedStyle(el).position !== 'fixed') {
            if (!worst || b.right > worst.right) worst = { right: Math.round(b.right), sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '') };
          }
        }
        return { sw: de.scrollWidth, cw: de.clientWidth, worst };
      });
      if (r) (over[w] = over[w] || []).push(`${f} (${r.sw}>${r.cw}) ${r.worst ? r.worst.sel : ''}`);
    }
    console.log(`width ${w}: ${(over[w] || []).length}/${allPages.length} pages overflow horizontally`);
    for (const line of (over[w] || []).slice(0, 6)) console.log('   ' + line);
  }
  await browser.close();
})();
