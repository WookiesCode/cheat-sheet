// Host reboot/shutdown commands stay visible as reference but cannot be copied or run
// (build-reference-rules.js HOST_REBOOT). Out-of-band BMC power commands still copy.
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

const REBOOTS = [
  ['linux.html', 'systemctl reboot --firmware-setup'],
  ['systemd.html', 'systemctl reboot --firmware-setup'],
  ['cli-tools.html', 'efibootmgr -n 0004 && reboot'],
  ['efibootmgr.html', 'efibootmgr -n 0004 && reboot'],
  ['bmc-tools.html', 'ilorest reboot PushPowerButton'],
  ['bmc-tools.html', 'ilorest reboot ForceOff'],
  ['ilorest.html', 'ilorest reboot PushPowerButton'],
  ['ilorest.html', 'ilorest reboot ForceOff'],
  ['windows.html', 'shutdown /r /fw /t 0'],
  ['win-sysadmin.html', 'shutdown /r /fw /t 0'],
];

async function context(browser) {
  const ctx = await newContext(browser);
  const writes = [];
  await ctx.exposeBinding('__recordCopy', (_s, t) => { writes.push(String(t)); });
  await ctx.addInitScript(() => {
    const fake = { writeText: t => { window.__recordCopy(t); return Promise.resolve(); }, readText: () => Promise.resolve('') };
    Object.defineProperty(navigator, 'clipboard', { configurable: true, get: () => fake });
  });
  return { ctx, writes };
}

// The box whose copy text starts with the command (sheets keep it in data-copy / data-cmd / data-subcmd).
const boxFor = (p, cmd) => p.evaluateHandle((c) => [...document.querySelectorAll('.cmd-code-box, .subcmd-row')]
  .find(b => String(b.dataset.copy ?? b.dataset.cmd ?? b.dataset.subcmd ?? '').startsWith(c)) || null, cmd);

async function realClick(p, handle) {
  // Suite hubs fold their full command list: open it the way a person would.
  if (!(await handle.boundingBox()) && await p.$('body.hub-folded #hub-wall button')) {
    await p.click('#hub-wall button', { delay: 120 });
    await p.waitForTimeout(400);
  }
  await handle.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const b = await handle.boundingBox();
  await p.mouse.move(b.x + 30, b.y + 10);
  await p.mouse.down();
  await p.waitForTimeout(120);
  await p.mouse.up();
  await p.waitForTimeout(300);
}

(async () => {
  const browser = await launch();
  const { ctx, writes } = await context(browser);
  const p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'page error: ' + e.message));

  // 1. On every page: marked, labelled, and a real click copies nothing.
  for (const [file, cmd] of REBOOTS) {
    await p.goto(BASE + file, { waitUntil: 'load' });
    await p.waitForTimeout(500);
    const h = await boxFor(p, cmd);
    if (!(await h.evaluate(x => !!x))) { check(false, `${file}: box for "${cmd}" not found`); continue; }
    const state = await h.evaluate(b => ({ ref: b.classList.contains('is-reference'), why: (b.querySelector('.ref-why') || {}).textContent || '' }));
    writes.length = 0;
    await realClick(p, h);
    check(state.ref && /Reference only: reboots or shuts down/.test(state.why) && writes.length === 0,
      `${file}: "${cmd}" is reference, says why, and a click copies nothing`);
  }

  // 2. Neighbours still copy: an out-of-band BMC power command and a read-only systemctl command.
  for (const [file, cmd] of [['ipmi-chassis-power.html', 'ipmitool'], ['linux.html', 'systemctl status']]) {
    await p.goto(BASE + file, { waitUntil: 'load' });
    await p.waitForTimeout(500);
    const h = await boxFor(p, cmd);
    writes.length = 0;
    await realClick(p, h);
    check(writes.length === 1 && writes[0].includes(cmd.split(' ')[0]), `${file}: "${cmd}…" still copies`);
  }

  // 3. Ctrl+K: the result opens its sheet, Enter copies nothing.
  await p.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
  await p.waitForTimeout(400);
  await p.keyboard.press('Control+k');
  await p.waitForTimeout(250);
  await p.keyboard.type('systemctl reboot firmware', { delay: 15 });
  await p.waitForTimeout(500);
  const hit = await p.evaluate(() => { const el = [...document.querySelectorAll('.palette-item')].find(i => /systemctl reboot --firmware-setup/.test(i.dataset.cmd || '')); return el ? el.querySelector('.palette-action-hint').textContent : null; });
  check(hit === 'Enter or Click to Open', `Ctrl+K shows "Enter or Click to Open" for it (${hit})`);
  for (let i = 0; i < 30; i++) {
    if (await p.evaluate(() => /systemctl reboot --firmware-setup/.test((document.querySelector('.palette-item.is-selected') || {}).dataset?.cmd || ''))) break;
    await p.keyboard.press('ArrowDown');
  }
  writes.length = 0;
  await p.keyboard.press('Enter');
  await p.waitForTimeout(600);
  check(writes.length === 0, 'Ctrl+K Enter on it copies nothing');

  // 4. My kit: starred anyway, it has no Copy button. (On ilorest.html the reboot is the card's
  // main command; on linux.html it is a sub-row, and a star bookmarks the card's main command.)
  await p.goto(BASE + 'ilorest.html', { waitUntil: 'load' });
  await p.waitForTimeout(500);
  // Each command's star carries its id (data-cmd-id).
  const star = await p.evaluateHandle(() => document.querySelector('.bookmark-btn[data-cmd-id="ilorest-reboot"]'));
  if (await star.evaluate(x => !!x)) {
    await star.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
    await star.click({ delay: 120 });
    await p.waitForTimeout(300);
    await p.click('.kit-header-btn');
    await p.waitForTimeout(400);
    const kit = await p.evaluate(() => [...document.querySelectorAll('.kit-entry')].filter(e => /reboot/.test(e.textContent)).map(e => ({ copy: !!e.querySelector('[data-kit-act="copy"]'), ref: !!e.querySelector('.kit-ref') })));
    check(kit.length > 0 && kit.every(k => !k.copy && k.ref), `My kit lists it without a Copy button (${kit.length} entr${kit.length === 1 ? 'y' : 'ies'})`);
  } else {
    check(false, 'star for the ilorest reboot card not found');
  }
  await ctx.close();

  // 5. The portable copy.
  {
    const { ctx: c2, writes: w2 } = await context(browser);
    const q = await c2.newPage();
    await q.goto('file://' + path.join(ROOT, 'datacenter-cheatsheet-portable.html') + '#sheet-windows', { waitUntil: 'load' });
    await q.waitForTimeout(900);
    const h = await boxFor(q, 'shutdown /r /fw /t 0');
    const ok = await h.evaluate(b => !!b && b.classList.contains('is-reference') && !!b.querySelector('.ref-why'));
    if (ok) await realClick(q, h);
    check(ok && w2.length === 0, 'portable file: the Windows shutdown entry is reference and copies nothing');
    await c2.close();
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
