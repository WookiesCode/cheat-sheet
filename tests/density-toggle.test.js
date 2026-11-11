// The Compact / Detailed button keeps one size when clicked back and forth (its label is held at
// the wider word's width), and the narrow header still shows it as an icon only.
const { BASE, launch } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

(async () => {
  const browser = await launch();
  for (const [width, iconOnly] of [[1280, false], [1024, true]]) {
    const ctx = await browser.newContext({ viewport: { width, height: 800 } });
    await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
    const p = await ctx.newPage();
    p.on('pageerror', e => check(false, `${width}px: page error ${e.message}`));
    await p.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    await p.waitForTimeout(1000);
    const seen = [];
    for (let i = 0; i < 4; i++) {
      const r = await p.evaluate(() => ({
        w: Math.round(document.getElementById('density-toggle').getBoundingClientRect().width * 10) / 10,
        label: document.getElementById('density-label').textContent
      }));
      seen.push(r);
      const box = await p.locator('#density-toggle').boundingBox();
      await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await p.mouse.down();
      await p.waitForTimeout(120);
      await p.mouse.up();
      await p.waitForTimeout(250);
    }
    const widths = [...new Set(seen.map(s => s.w))];
    const labels = [...new Set(seen.map(s => s.label))];
    check(labels.length === 2, `${width}px: the label switches between ${labels.join(' and ')}`);
    check(widths.length === 1, `${width}px: the button stays one width through four clicks (${seen.map(s => `${s.label} ${s.w}`).join(', ')})`);
    if (iconOnly) check(widths[0] < 50, `${width}px: still icon-only in the narrow header (${widths[0]}px)`);
    await ctx.close();
  }
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
