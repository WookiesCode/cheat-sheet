// Ctrl+K: state-changing results are flagged red and need Enter twice to copy; safe ones copy on one Enter.
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

(async () => {
  const browser = await launch();
  const ctx = await newContext(browser);
  // Record clipboard writes on the Node side (a copy can be followed by navigation to another sheet).
  const writes = [];
  await ctx.exposeBinding('__recordCopy', (_src, text) => { writes.push(String(text)); });
  await ctx.addInitScript(() => {
    const fake = { writeText: t => { window.__recordCopy(t); return Promise.resolve(); }, readText: () => Promise.resolve('') };
    Object.defineProperty(navigator, 'clipboard', { configurable: true, get: () => fake });
  });
  const page = await ctx.newPage();
  page.on('pageerror', e => check(false, 'page error: ' + e.message));
  await page.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const copied = () => writes.slice();
  const openSearch = async (q) => {
    await page.keyboard.press('Control+k');
    await page.waitForTimeout(300);
    await page.keyboard.type(q, { delay: 20 });
    await page.waitForTimeout(500);
  };
  // Move the highlight to the first result whose command matches, using the keyboard like a person.
  const highlight = async (re) => {
    for (let i = 0; i < 40; i++) {
      const cmd = await page.evaluate(() => { const el = document.querySelector('.palette-item.is-selected'); return el ? el.dataset.cmd || '' : ''; });
      if (re.test(cmd)) return true;
      await page.keyboard.press('ArrowDown');
    }
    return false;
  };

  // 1. The port bounce is flagged.
  await openSearch('mlxlink ber');
  const flagged = await page.evaluate(() => [...document.querySelectorAll('.palette-item')].map(el => ({
    cmd: el.dataset.cmd || '', danger: el.classList.contains('is-danger'), tag: !!el.querySelector('.danger-tag')
  })));
  const bounce = flagged.find(r => /--port_state\s+TG/.test(r.cmd));
  check(bounce && bounce.danger && bounce.tag, 'mlxlink --port_state TG result carries the red danger tag');
  const readOnly = flagged.find(r => /^mlxlink -d mlx5_0 -m -c -e$/.test(r.cmd));
  check(readOnly && !readOnly.danger && !readOnly.tag, 'read-only mlxlink -m -c -e is not flagged');

  // 2. First Enter on the bounce arms, does not copy.
  check(await highlight(/--port_state\s+TG/), 'keyboard reaches the bounce result');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  check((await copied()).length === 0, 'first Enter on a state-changing result copies nothing');
  check(await page.evaluate(() => !!document.querySelector('.palette-item.is-armed .palette-confirm')), 'first Enter shows "Enter again to copy"');

  // 3. Moving away disarms; coming back needs two Enters again.
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowUp');
  check(await page.evaluate(() => !document.querySelector('.palette-item.is-armed')), 'moving the highlight cancels the armed result');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(200);
  check((await copied()).length === 0, 'after moving away, one Enter still copies nothing');

  // 4. Second Enter copies the command.
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const afterSecond = await copied();
  check(afterSecond.length === 1 && /--port_state\s+TG/.test(afterSecond[0]), 'second Enter copies the command');

  writes.length = 0;
  // 5. Clicking a dangerous result opens it without copying (it navigates within this sheet's suite).
  await page.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  await openSearch('mlxlink ber');
  const el = page.locator('.palette-item.is-danger').first();
  await el.scrollIntoViewIfNeeded();
  const box = await el.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 12);
  await page.mouse.down();
  await page.waitForTimeout(150);
  await page.mouse.up();
  await page.waitForTimeout(600);
  check((await copied()).length === 0, 'clicking a state-changing result does not copy it');

  writes.length = 0;
  // 6. A safe result still copies on the first Enter (no regression).
  await page.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  await openSearch('nvidia-smi topo');
  check(await highlight(/^nvidia-smi topo -m/), 'keyboard reaches nvidia-smi topo -m');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
  const safe = await copied();
  check(safe.length === 1 && /^nvidia-smi topo -m/.test(safe[0]), 'a read-only result copies on the first Enter');

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
