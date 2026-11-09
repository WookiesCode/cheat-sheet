// Keyboard focus stays inside an open tool (Tab and Shift+Tab wrap) and returns to its opener on close.
// A tool pinned in the side dock is part of the page and must NOT trap focus.
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

// Press Tab n times; return how many presses left focus outside the open modal.
async function tabEscapes(page, n, shift) {
  let out = 0;
  for (let i = 0; i < n; i++) {
    await page.keyboard.press(shift ? 'Shift+Tab' : 'Tab');
    const inside = await page.evaluate(() => {
      const a = document.activeElement;
      return !!(a && a.closest('[aria-modal="true"]') && a !== document.body);
    });
    if (!inside) out++;
  }
  return out;
}

// Each tool: how to open it from the page, and a selector that is visible while it is open.
const TOOLS = [
  { name: 'Ctrl+K search', open: p => p.keyboard.press('Control+k'), shown: '#global-search-modal:not(.hidden)' },
  { name: 'Explain (e)', open: p => p.keyboard.press('e'), shown: '.an-backdrop.show .ex-dialog' },
  { name: 'Shortcuts (?)', open: p => p.keyboard.press('Shift+Slash'), shown: '.kb-help.show' },
  { name: 'Manuals (M)', open: p => p.keyboard.press('Shift+M'), shown: '#manuals-modal:not(.hidden)' },
  { name: 'My kit (header)', open: p => p.click('.kit-header-btn'), shown: '.kit-drawer.open', opener: '.kit-header-btn' },
  { name: 'Rack (header)', open: p => p.click('.rack-header-btn, [data-open-rack]'), shown: '.an-backdrop.show .rk-dialog', opener: '.rack-header-btn, [data-open-rack]' },
];

(async () => {
  const browser = await launch();
  const ctx = await newContext(browser);
  const page = await ctx.newPage();
  page.on('pageerror', e => check(false, 'page error: ' + e.message));
  await page.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
  await page.waitForTimeout(600);

  for (const t of TOOLS) {
    await page.evaluate(() => { document.activeElement && document.activeElement.blur(); window.scrollTo({ top: 0, behavior: 'instant' }); });
    if (t.opener) {
      const has = await page.$(t.opener);
      if (!has) { check(false, `${t.name}: opener ${t.opener} not found`); continue; }
    }
    await t.open(page);
    await page.waitForTimeout(400);
    const open = await page.$(t.shown);
    if (!open) { check(false, `${t.name}: did not open (${t.shown})`); await page.keyboard.press('Escape'); continue; }
    check(await tabEscapes(page, 25, false) === 0, `${t.name}: 25 × Tab stay inside`);
    check(await tabEscapes(page, 25, true) === 0, `${t.name}: 25 × Shift+Tab stay inside`);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    if (await page.$(t.shown)) { await page.keyboard.press('Escape'); await page.waitForTimeout(300); }
    check(!(await page.$(t.shown)), `${t.name}: Esc closes it`);
    if (t.opener) {
      const back = await page.evaluate(sel => document.activeElement && document.activeElement.matches(sel), t.opener);
      check(back, `${t.name}: focus returns to the button that opened it`);
    }
  }

  // A tool pinned to the side dock is part of the page: Tab must be free to leave it.
  await page.keyboard.press('e');
  await page.waitForTimeout(400);
  const side = await page.$('.an-backdrop.show .ex-dialog [data-sd-pin], .an-backdrop.show .ex-dialog .sd-pin');
  if (side) {
    await side.click();
    await page.waitForTimeout(500);
    const docked = await page.$('.an-backdrop.is-side');
    check(!!docked, 'Explain pins to the side dock');
    await page.focus('.an-backdrop.is-side textarea');
    let left = false;
    for (let i = 0; i < 40 && !left; i++) {
      await page.keyboard.press('Tab');
      left = await page.evaluate(() => !document.activeElement.closest('.an-backdrop.is-side'));
    }
    check(left, 'side-docked tool does not trap Tab');
    // Unpin so the next run starts clean (the dock is remembered across pages).
    await page.evaluate(() => { const x = document.querySelector('.an-backdrop.is-side .trail-close'); if (x) x.click(); });
  } else {
    check(false, 'side-dock pin button not found in Explain');
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
