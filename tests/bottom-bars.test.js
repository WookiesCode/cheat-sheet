// Only the footer is pinned to the bottom of a sheet (R6, 2026-11-11): the prev / hub / next pager
// sits at the end of the sheet, so the commands get its 60 px back on a laptop screen.
const { BASE, launch } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

(async () => {
  const browser = await launch();
  for (const [w, h] of [[1280, 720], [1366, 768]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', e => check(false, `${w}x${h}: page error ${e.message}`));
    await p.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    await p.waitForTimeout(1000);
    const r = await p.evaluate(() => {
      const pager = document.querySelector('.suite-rail-pager');
      // Everything wide that is pinned to the lower half of the window.
      const pinned = [...document.querySelectorAll('body *')].filter(e => {
        const s = getComputedStyle(e);
        if (!['fixed', 'sticky'].includes(s.position) || e.offsetWidth < innerWidth * 0.5 || e.offsetHeight < 10) return false;
        return e.getBoundingClientRect().top > innerHeight / 2;
      }).map(e => ({ cls: String(e.className).slice(0, 30), h: e.getBoundingClientRect().height }));
      return { position: pager ? getComputedStyle(pager).position : null, pinned, pinnedH: pinned.reduce((a, b) => a + b.h, 0) };
    });
    check(r.position === 'static', `${w}x${h}: the pager is in the flow (${r.position})`);
    check(r.pinnedH <= 40, `${w}x${h}: only ${Math.round(r.pinnedH)} px pinned at the bottom (${r.pinned.map(x => x.cls).join(', ')})`);
    // The pager is still there at the end of the sheet, and Next works.
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(500);
    const next = await p.evaluate(() => {
      const b = document.querySelector('.suite-rail-pager .suite-pg.next');
      if (!b) return null;
      const r = b.getBoundingClientRect();
      return { inView: r.top >= 0 && r.bottom <= innerHeight, text: b.textContent.replace(/\s+/g, ' ').trim() };
    });
    check(!!next && next.inView, `${w}x${h}: at the end of the sheet the pager's Next is on screen (${next && next.text})`);
    await ctx.close();
  }
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
