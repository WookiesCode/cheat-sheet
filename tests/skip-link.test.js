// The first Tab on every page shows a skip link; Enter lands on the first command (or the main
// content), and the next Tab continues from there. The portable file's URL hash is untouched.
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

const PAGES = [
  ['sheet', BASE + 'nv-smi.html', 'Skip to commands'],
  ['home', BASE + 'index.html', 'Skip to content'],
  ['notes', BASE + 'notes.html', 'Skip to content'],
  ['workbench', BASE + 'tools.html', 'Skip to content'],
  ['portable', 'file://' + path.join(ROOT, 'datacenter-cheatsheet-portable.html') + '#sheet-nv-smi', 'Skip to commands'],
];

(async () => {
  const browser = await launch();
  for (const [name, url, label] of PAGES) {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    p.on('pageerror', e => check(false, `${name}: page error ${e.message}`));
    await p.goto(url, { waitUntil: 'load' });
    await p.waitForTimeout(800);
    const hashBefore = await p.evaluate(() => location.hash);

    check(await p.evaluate(() => document.querySelector('.skip-link').getBoundingClientRect().bottom <= 0), `${name}: hidden until focused`);
    await p.keyboard.press('Tab');
    await p.waitForTimeout(250);
    const first = await p.evaluate(() => { const a = document.activeElement; const r = a.getBoundingClientRect(); return { skip: a.classList.contains('skip-link'), text: a.textContent, onScreen: r.top >= 0 && r.bottom <= innerHeight }; });
    check(first.skip && first.onScreen, `${name}: the first Tab focuses the skip link, on screen`);
    check(first.text === label, `${name}: it reads "${label}" (got "${first.text}")`);

    await p.keyboard.press('Enter');
    await p.waitForTimeout(300);
    const landed = await p.evaluate(() => {
      const a = document.activeElement;
      const r = a.getBoundingClientRect();
      // Visible = its middle point is not under anything else.
      const t = document.elementFromPoint(r.left + Math.min(r.width / 2, 40), r.top + Math.min(r.height / 2, 12));
      return { cmd: a.matches('.cmd-code-box, .subcmd-row'), main: a.matches('main, #launchpad, #notes-page, #wb-page'), visible: !!t && (t === a || a.contains(t)), hash: location.hash };
    });
    check(label === 'Skip to commands' ? landed.cmd : landed.main, `${name}: Enter lands on ${label === 'Skip to commands' ? 'the first command' : 'the main content'}`);
    check(landed.visible, `${name}: where it lands is visible, not under a bar`);
    check(landed.hash === hashBefore, `${name}: the URL hash is unchanged (${hashBefore || 'none'})`);

    await p.keyboard.press('Tab');
    const next = await p.evaluate(() => { const m = [...document.querySelectorAll('main, #launchpad, #notes-page, #wb-page')].find(x => x.getClientRects().length > 0); return !!m && m.contains(document.activeElement) && document.activeElement !== m; });
    check(next, `${name}: the next Tab continues inside the content`);
    await ctx.close();
  }

  // A mouse click works too (100–150 ms between press and release, like a person).
  {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    await p.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
    await p.waitForTimeout(600);
    await p.keyboard.press('Tab');
    await p.waitForTimeout(250);
    const b = await p.locator('.skip-link').boundingBox();
    await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await p.mouse.down();
    await p.waitForTimeout(120);
    await p.mouse.up();
    await p.waitForTimeout(300);
    check(await p.evaluate(() => document.activeElement.matches('.cmd-code-box, .subcmd-row')), 'a mouse click on the skip link lands on the first command');
    await ctx.close();
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
