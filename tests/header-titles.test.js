// Sheet titles are never cut off in the header (R7, 2026-11-11), on every page at laptop widths:
// the search pill gives way instead (down to its icon), and from 1100 to 1279 px the Compact, Rack and
// theme tools drop their labels. Nothing in the header row overflows, and the Ctrl K hint is hidden
// rather than clipped when the pill is narrow. The text width is measured exactly (a Range), because
// scrollWidth rounds and misses an ellipsis caused by a fraction of a pixel.
const fs = require('fs');
const { ROOT, BASE, launch } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !/portable/.test(f)).sort();

(async () => {
  const browser = await launch();
  for (const width of [1100, 1280, 1366]) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
    const p = await ctx.newPage();
    const cut = [], overflow = [], clippedKbd = [];
    for (const f of pages) {
      await p.goto(BASE + f, { waitUntil: 'load' });
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(250);
      const r = await p.evaluate(() => {
        const h = document.querySelector('.top-bar h1');
        const row = document.querySelector('.top-bar-inner');
        if (!h || !row) return null;
        const range = document.createRange();
        range.selectNodeContents(h);
        const kbd = document.querySelector('.hdr-search-pill kbd');
        const pill = document.querySelector('.hdr-search-pill');
        const kbdShown = kbd && getComputedStyle(kbd).display !== 'none';
        return {
          title: h.textContent.trim(),
          cut: range.getBoundingClientRect().width > h.getBoundingClientRect().width + 0.01,
          overflow: row.scrollWidth > row.clientWidth + 1 || document.documentElement.scrollWidth > innerWidth,
          kbdClipped: !!(kbdShown && pill && kbd.getBoundingClientRect().right > pill.getBoundingClientRect().right)
        };
      });
      if (!r) continue;
      if (r.cut) cut.push(r.title);
      if (r.overflow) overflow.push(f);
      if (r.kbdClipped) clippedKbd.push(f);
    }
    check(!cut.length, `${width}px: no sheet title is cut off (${pages.length} pages)${cut.length ? ': ' + cut.join(', ') : ''}`);
    check(!overflow.length, `${width}px: the header row never overflows${overflow.length ? ': ' + overflow.join(', ') : ''}`);
    check(!clippedKbd.length, `${width}px: the Ctrl K hint is hidden, not clipped, in a narrow search pill${clippedKbd.length ? ': ' + clippedKbd.join(', ') : ''}`);
    await ctx.close();
  }
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
