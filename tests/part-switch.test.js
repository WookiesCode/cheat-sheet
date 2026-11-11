// Group pages switch parts in place: picking another part (rail, pager, "All", Back, a card link)
// redraws the cards without reloading the page, and the window moves at most once, instantly,
// to the new part's top. Before this, every part change reloaded the page and the browser's
// scroll restore glided (smooth scrolling) from the top back to the old position.
const { BASE, launch, newContext } = require('./lib');
const merged = require('./merged-pages.json');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

(async () => {
  const browser = await launch();
  const ctx = await newContext(browser);
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1280, height: 800 });
  p.on('pageerror', e => check(false, 'page error: ' + e.message));
  let docs = 0;
  p.on('domcontentloaded', () => docs++);
  // Every scroll position the window passes through, frame by frame.
  await p.addInitScript(() => {
    window.__ys = [];
    let last = -1;
    const tick = () => { if (scrollY !== last) { window.__ys.push(Math.round(scrollY)); last = scrollY; } requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
  const container = ':is(#sections-container, #sections-grid)';
  const view = () => p.evaluate(c => ({
    hash: location.hash,
    bar: (document.querySelector('#sheet-filter-bar b') || {}).textContent || '',
    bars: document.querySelectorAll('#sheet-filter-bar').length,
    cards: document.querySelectorAll(`${c} .cmd-item`).length,
    rail: ((document.querySelector('.rail-sheet.is-current') || {}).dataset || {}).suiteGo || '',
    y: Math.round(scrollY)
  }), container);
  // Real click timing: 120 ms between mouse down and up, on the element where it is.
  const clickAt = async sel => {
    const box = await p.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.x + Math.min(20, r.width / 2), y: r.y + r.height / 2 }; }, sel);
    if (!box) return false;
    await p.mouse.move(box.x, box.y); await p.mouse.down(); await p.waitForTimeout(120); await p.mouse.up();
    return true;
  };
  const scrolled = async () => { await p.mouse.move(640, 400); await p.mouse.wheel(0, 500); await p.waitForTimeout(500); await p.evaluate(() => { window.__ys.length = 0; }); };
  const moves = () => p.evaluate(() => window.__ys.slice());

  await p.goto(BASE + 'cli-tools.html#curl', { waitUntil: 'load' });
  await p.waitForTimeout(1200);
  const loaded = docs;

  // Rail: the part changes, the window jumps once to the new part's top (no glide).
  await scrolled();
  check(await clickAt('.rail-sheet[data-suite-go="cli-tools.html#tar"]'), 'the rail lists tar');
  await p.waitForTimeout(800);
  let v = await view(), ys = await moves();
  check(docs === loaded, 'clicking a part in the rail does not reload the page');
  check(v.hash === '#tar' && /^tar/.test(v.bar) && v.bars === 1 && v.cards > 0 && v.rail === 'cli-tools.html#tar', `rail → tar: cards, "Showing" bar and rail follow (${JSON.stringify(v)})`);
  check(ys.length <= 1, `the window moves at most once, with no glide (positions: ${ys.join(' → ') || 'none'})`);
  // ...and is not hidden under the compact command bar that is fixed over the top.
  const top = await p.evaluate(() => { const b = document.getElementById('sheet-filter-bar').getBoundingClientRect(); const c = document.getElementById('command-bar'); const cb = c && c.classList.contains('show') ? c.getBoundingClientRect().bottom : 0; return { bar: Math.round(b.top), cbar: Math.round(cb) }; });
  check(top.bar >= top.cbar && top.bar < 220, `the new part starts at the top of the window, below the command bar (bar ${top.bar}px, command bar ends ${top.cbar}px)`);

  // Pager Next.
  await scrolled();
  await clickAt('.suite-pg.next');
  await p.waitForTimeout(800);
  v = await view(); ys = await moves();
  check(docs === loaded && v.hash !== '#tar' && v.bar && ys.length <= 1, `pager Next switches in place (${v.hash}, positions ${ys.join(' → ') || 'none'})`);
  const afterNext = v.hash;

  // "All …" goes to the whole group, at the top.
  await clickAt('.sfb-all');
  await p.waitForTimeout(800);
  v = await view();
  check(docs === loaded && v.hash === '' && !v.bars && v.cards > 40 && v.y === 0, `"All CLI tools" shows the whole group from the top (${v.cards} cards, y=${v.y})`);

  // Back returns to the part, still without a reload and without a glide.
  await scrolled();
  await p.goBack();
  await p.waitForTimeout(800);
  v = await view(); ys = await moves();
  check(docs === loaded && v.hash === afterNext && v.bars === 1 && ys.length <= 1, `Back returns to ${afterNext} in place (positions ${ys.join(' → ') || 'none'})`);

  // A link to a card in another part lands on that card.
  const card = await p.evaluate(() => window.SHEET_FILTER.sections.find(s => (s.part || s.id) === 'awk').commands[2].id);
  await p.evaluate(id => { location.hash = id; }, card);
  await p.waitForTimeout(800);
  const at = await p.evaluate(id => { const el = document.querySelector(`.cmd-item[data-id="${id}"]`); if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top, bottom: r.bottom }; }, card);
  check(docs === loaded && at && at.top >= 0 && at.bottom <= 805, `a card link in another part switches and shows the card (${card})`);

  // Stars keep working after switches (the page's own click handling is untouched).
  await p.click(`${container} .bookmark-btn`, { delay: 120 });
  await p.waitForTimeout(200);
  check(await p.evaluate(() => JSON.parse(localStorage.getItem('cli_tools_bookmarks') || '[]').length > 0), 'a star made after a switch is saved');

  // Every group page has the hook and switches between two of its parts in place.
  const byPage = {};
  Object.values(merged).forEach(t => { const [pg, part] = t.split('#'); (byPage[pg] = byPage[pg] || []).push(part); });
  const bad = [];
  let pages = 0;
  for (const [pg, parts] of Object.entries(byPage)) {
    if (parts.length < 2) continue;
    pages++;
    await p.goto(`${BASE}${pg}#${parts[0]}`, { waitUntil: 'load' });
    await p.waitForTimeout(400);
    const before = docs;
    await p.evaluate(h => { location.hash = h; }, parts[1]);
    await p.waitForTimeout(300);
    const r = await view();
    if (docs !== before || !r.cards || r.bars !== 1 || r.rail !== `${pg}#${parts[1]}`) bad.push(`${pg} ${parts[0]} → ${parts[1]}: ${JSON.stringify(r)}${docs !== before ? ' (reloaded)' : ''}`);
  }
  check(!bad.length, `all ${pages} group pages switch parts in place ${bad.join('; ')}`);

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
