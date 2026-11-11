// Copying a command that still has an unfilled <placeholder> copies it, but an amber toast names
// the slots to fill (a shell reads "<PID" as "take input from the file PID"). A filled slot, a command
// without one, and code generics such as Result<T> stay quiet. Real clicks and Ctrl+K Enter.
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

async function context(browser, slots) {
  const ctx = await newContext(browser);
  const writes = [];
  await ctx.exposeBinding('__recordCopy', (_s, t) => { writes.push(String(t)); });
  await ctx.addInitScript((slotValues) => {
    const fake = { writeText: t => { window.__recordCopy(t); return Promise.resolve(); }, readText: () => Promise.resolve('') };
    Object.defineProperty(navigator, 'clipboard', { configurable: true, get: () => fake });
    try {
      localStorage.setItem('dc_tour_seen', '99');
      if (slotValues) localStorage.setItem('dc_slot_values', JSON.stringify(slotValues));
    } catch (e) {}
  }, slots || null);
  return { ctx, writes };
}

const boxFor = (p, test) => p.evaluateHandle((src) => {
  const re = new RegExp(src);
  return [...document.querySelectorAll('.cmd-code-box, .subcmd-row')]
    .find(b => re.test(String(b.dataset.copy ?? b.dataset.cmd ?? b.dataset.subcmd ?? ''))) || null;
}, test.source);

async function realClick(p, handle) {
  await handle.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  // Toward the right end of the box: its start holds the root tag, a button of its own.
  const b = await handle.boundingBox();
  await p.mouse.move(b.x + b.width - 40, b.y + Math.min(14, b.height / 2));
  await p.mouse.down();
  await p.waitForTimeout(120);
  await p.mouse.up();
  await p.waitForTimeout(400);
}

const toast = p => p.evaluate(() => {
  const t = document.getElementById('toast');
  return { text: (document.getElementById('toast-text') || {}).textContent || '', warn: !!t && t.classList.contains('toast-warn'), visible: !!t && t.classList.contains('visible') };
});

(async () => {
  const browser = await launch();

  // 1. Unfilled: copied as is, with the amber toast naming the slot.
  let { ctx, writes } = await context(browser);
  let p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'page error: ' + e.message));
  await p.goto(BASE + 'linux.html#processes', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  let box = await boxFor(p, /^strace -p <PID>/);
  check(!!(await box.evaluate(b => !!b)), 'the strace -p <PID> command is on the Linux processes part');
  await realClick(p, box);
  let t = await toast(p);
  check(writes.some(w => w.includes('strace -p <PID>')), 'the command is still copied');
  check(t.warn && t.visible && /<PID>/.test(t.text) && /fill it before running/.test(t.text), `the toast warns about <PID> (${t.text})`);
  await p.waitForTimeout(2600);
  t = await toast(p);
  check(t.visible && t.warn, 'the warning is still up after 3 s (a normal toast is gone by then)');

  // 2. A command with no placeholder gives the normal toast, not the warning.
  await p.waitForTimeout(3600);
  box = await boxFor(p, /^ps\b(?![^\n]*<)/);
  if (await box.evaluate(b => !!b)) {
    await realClick(p, box);
    t = await toast(p);
    check(!t.warn, `a command without placeholders gets no warning (${t.text.slice(0, 50)})`);
  } else check(false, 'found a plain ps command to copy');

  // 3. Ctrl+K Enter on the same command warns too, and the palette's own "Copied" toast doesn't replace it.
  await p.waitForTimeout(3600);
  await p.keyboard.press('Control+k');
  await p.waitForTimeout(250);
  await p.keyboard.type('strace -p', { delay: 15 });
  await p.waitForTimeout(500);
  // The first row can be a shortcut; arrow down to the first command, as a person would.
  for (let i = 0; i < 4; i++) {
    const sel = await p.evaluate(() => (document.querySelector('.palette-item.is-selected') || {}).dataset?.cmd || '');
    if (sel) break;
    await p.keyboard.press('ArrowDown');
    await p.waitForTimeout(120);
  }
  const first = await p.evaluate(() => (document.querySelector('.palette-item.is-selected') || {}).dataset?.cmd || '');
  const before = writes.length;
  await p.keyboard.press('Enter');
  await p.waitForTimeout(500);
  t = await toast(p);
  check(/^strace -p <PID>/.test(first), `Ctrl+K selects the strace command (${first.slice(0, 40)})`);
  check(writes.length > before && /<PID>/.test(writes[writes.length - 1]), 'Ctrl+K Enter copies it');
  check(t.warn && /<PID>/.test(t.text), `…and the palette's own "Copied" toast doesn't replace the warning (${t.text.slice(0, 60)})`);
  await ctx.close();

  // 4. Filled (the dashed chip or Ctrl+K "pid 4321" saves dc_slot_values): the value goes in, no warning.
  ({ ctx, writes } = await context(browser, { pid: '4321' }));
  p = await ctx.newPage();
  await p.goto(BASE + 'linux.html#processes', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  box = await boxFor(p, /^strace -p <PID>/);
  await realClick(p, box);
  t = await toast(p);
  check(writes.some(w => w.includes('strace -p 4321')), `a filled <PID> is copied as 4321 (${writes.slice(-1)[0]})`);
  check(!t.warn, 'no warning once the slot is filled');
  await ctx.close();

  // 5. Code generics are not placeholders: TypeScript's Result<T> copies quietly.
  ({ ctx, writes } = await context(browser));
  p = await ctx.newPage();
  await p.goto(BASE + 'scripting.html', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  box = await boxFor(p, /Result<T>/);
  if (await box.evaluate(b => !!b)) {
    if (!(await box.boundingBox()) && await p.$('body.hub-folded #hub-wall button')) {
      await p.click('#hub-wall button', { delay: 120 });
      await p.waitForTimeout(400);
    }
    await realClick(p, box);
    t = await toast(p);
    check(writes.some(w => w.includes('Result<T>')) && !t.warn, `TypeScript Result<T> copies with no warning (${t.text.slice(0, 40)})`);
  } else check(false, 'found the TypeScript Result<T> command');
  await ctx.close();

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
