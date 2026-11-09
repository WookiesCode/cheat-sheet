// WCAG 2.2 SC 2.4.11 Focus Not Obscured: keyboard focus never ends up fully hidden under the bars
// that stay on screen (command bar, pager, footer, tour invite), by Tab, Shift+Tab or j/k.
// Also: open nav menus draw above the pager, and a mouse click never scrolls the page.
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const SIZES = [[1280, 800], [800, 700]];
const PAGES = ['nv-smi.html', 'ib-mlxlink.html'];

// Sample 9 points of the focused element; "hidden" = every on-screen point is covered by a
// fixed/sticky layer. Elements inside such a layer (header, pager, rail) don't count.
const probe = () => {
  const el = document.activeElement;
  if (!el || el === document.body) return null;
  const rc = el.getBoundingClientRect();
  if (!rc.width || !rc.height) return null;
  const layer = (n) => { for (let x = n; x && x !== document.body; x = x.parentElement) { const p = getComputedStyle(x).position; if (p === 'fixed' || p === 'sticky') return x; } return null; };
  if (layer(el)) return null;
  let covered = 0, offscreen = 0, by = '';
  for (const fx of [0.1, 0.5, 0.9]) for (const fy of [0.15, 0.5, 0.85]) {
    const x = rc.left + rc.width * fx, y = rc.top + rc.height * fy;
    if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) { offscreen++; continue; }
    const t = document.elementFromPoint(x, y);
    if (t && t !== el && !el.contains(t)) { const L = layer(t); if (L) { covered++; by = String(L.className || L.tagName).split(' ')[0]; } }
  }
  return { hidden: covered > 0 && covered + offscreen === 9, what: `${el.tagName}.${String(el.className).split(' ')[0]} under ${by}` };
};

async function sweep(p, keys) {
  const hidden = [];
  for (const k of keys) {
    await p.keyboard.press(k);
    await p.waitForTimeout(25);
    const r = await p.evaluate(probe);
    if (r && r.hidden) hidden.push(`${k}: ${r.what}`);
  }
  return hidden;
}

(async () => {
  const browser = await launch();

  for (const [w, h] of SIZES) {
    for (const f of PAGES) {
      // dc_tour_seen = 999 (from newContext) shows the "what's new" invite: the worst case.
      const ctx = await newContext(browser, { viewport: { width: w, height: h } });
      const p = await ctx.newPage();
      await p.goto(BASE + f, { waitUntil: 'load' });
      await p.waitForTimeout(1200); // the invite appears after 900 ms
      const tab = await sweep(p, [...Array(160).fill('Tab'), ...Array(160).fill('Shift+Tab')]);
      check(!tab.length, `${w}x${h} ${f}: Tab / Shift+Tab never fully hidden${tab.length ? ` (${tab.length}: ${tab[0]})` : ''}`);
      await p.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo(0, 0); });
      const jk = await sweep(p, [...Array(40).fill('j'), ...Array(40).fill('k')]);
      check(!jk.length, `${w}x${h} ${f}: j / k never fully hidden${jk.length ? ` (${jk.length}: ${jk[0]})` : ''}`);
      await ctx.close();
    }
  }

  // Open nav menus draw above the pager and the invite (the header was capped at z-index 40).
  {
    const ctx = await newContext(browser, { viewport: { width: 800, height: 700 } });
    const p = await ctx.newPage();
    await p.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => {
      const pager = document.querySelector('.suite-rail-pager').getBoundingClientRect();
      for (const dd of document.querySelectorAll('.nav-dropdown')) {
        dd.classList.add('open');
        const item = [...dd.querySelectorAll('.dropdown-item')].find(a => { const b = a.getBoundingClientRect(); return b.height && b.top < pager.bottom && b.bottom > pager.top; });
        if (item) {
          const b = item.getBoundingClientRect();
          const t = document.elementFromPoint(b.left + b.width / 2, Math.max(b.top, pager.top) + 3);
          dd.classList.remove('open');
          return { found: true, onTop: !!t && (t === item || item.contains(t)) };
        }
        dd.classList.remove('open');
      }
      return { found: false };
    });
    check(r.found && r.onTop, 'an open nav menu item over the pager is drawn above it');
    await ctx.close();
  }

  // Mouse clicks don't trigger the reveal scroll; the terminal keeps its padding with the invite shown.
  {
    const ctx = await newContext(browser, { viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
    await p.waitForTimeout(1200);
    await p.evaluate(() => window.scrollTo(0, 300));
    await p.waitForTimeout(200);
    const box = p.locator('.cmd-code-box').nth(3);
    const b = await box.boundingBox();
    const before = await p.evaluate(() => scrollY);
    await p.mouse.move(b.x + 20, b.y + 8);
    await p.mouse.down();
    await p.waitForTimeout(120);
    await p.mouse.up();
    await p.waitForTimeout(300);
    check(await p.evaluate(() => scrollY) === before, 'clicking a command does not scroll the page');
    const pads = await p.evaluate(() => {
      const withInvite = parseFloat(getComputedStyle(document.body).paddingBottom);
      document.body.classList.add('con-open');
      const withTerminal = getComputedStyle(document.body).paddingBottom;
      document.body.classList.remove('con-open');
      return { withInvite, withTerminal, invite: !!document.querySelector('.tour-invite.show') };
    });
    check(pads.invite && pads.withInvite > 94, `page end leaves room for the invite (${pads.withInvite}px)`);
    check(/vh|px/.test(pads.withTerminal) && parseFloat(pads.withTerminal) > 250, `terminal drawer padding still applies with the invite shown (${pads.withTerminal})`);
    await ctx.close();
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
