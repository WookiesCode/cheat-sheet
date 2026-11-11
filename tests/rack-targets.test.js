// Rack Targets count only once they are set. The built-in values (2001:db8:dc::50, ADMIN, eno1…)
// are examples: on a fresh browser a copy keeps "$BMC" / "$BMC_USER" for the shell, the bar shows
// "e.g. …" and the form inputs are empty with the example as placeholder. A value typed into the
// form (or saved) is substituted; clearing it makes the target unset again.
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const CMD = /^ipmitool -I lanplus -H "\$BMC" -U "\$BMC_USER" -E sel elist/;

async function context(browser, vars) {
  const ctx = await newContext(browser);
  const writes = [];
  await ctx.exposeBinding('__recordCopy', (_s, x) => { writes.push(String(x)); });
  await ctx.addInitScript((v) => {
    const fake = { writeText: x => { window.__recordCopy(x); return Promise.resolve(); }, readText: () => Promise.resolve('') };
    Object.defineProperty(navigator, 'clipboard', { configurable: true, get: () => fake });
    try {
      localStorage.setItem('dc_tour_seen', '99');
      if (v) localStorage.setItem('dc_target_vars', JSON.stringify(v));
    } catch (e) {}
  }, vars || null);
  return { ctx, writes };
}

async function copySel(p, writes) {
  const before = writes.length;
  const h = await p.evaluateHandle((src) => [...document.querySelectorAll('.cmd-code-box, .subcmd-row')]
    .find(b => new RegExp(src).test(b.dataset.copy ?? b.dataset.cmd ?? b.dataset.subcmd ?? '')) || null, CMD.source);
  await h.evaluate(el => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const b = await h.boundingBox();
  await p.mouse.move(b.x + b.width - 40, b.y + Math.min(14, b.height / 2));
  await p.mouse.down();
  await p.waitForTimeout(120);
  await p.mouse.up();
  await p.waitForTimeout(400);
  return writes.length > before ? writes[writes.length - 1] : '(nothing copied)';
}

const chips = p => p.evaluate(() => Object.fromEntries([...document.querySelectorAll('.target-chip[data-target-edit]')]
  .map(c => [c.dataset.targetEdit, { example: c.classList.contains('is-example'), set: c.classList.contains('is-set'), text: c.textContent }])));

(async () => {
  const browser = await launch();

  // 1. Fresh browser: nothing set.
  let { ctx, writes } = await context(browser);
  let p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'page error: ' + e.message));
  await p.goto(BASE + 'ipmi.html', { waitUntil: 'load' });
  await p.waitForTimeout(900);
  let copied = await copySel(p, writes);
  check(copied === 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E sel elist', `unset: the copy keeps $BMC and $BMC_USER (${copied})`);
  check(!/2001:db8|ADMIN/.test(copied), 'unset: no example address or user reaches the clipboard');
  let c = await chips(p);
  check(c.bmc.example && /e\.g\. 2001:db8:dc::50/.test(c.bmc.text) && c.user.example && /e\.g\. ADMIN/.test(c.user.text), `unset: the bar shows the examples as "e.g." (${c.bmc.text} · ${c.user.text})`);
  // The compact command bar (shown once the header scrolls away) doesn't show the example BMC either.
  await p.evaluate(() => window.scrollTo(0, 1500));
  await p.waitForTimeout(500);
  const pill = await p.evaluate(() => (document.querySelector('.cbar-target-text') || {}).textContent || '(no command bar)');
  check(!/2001:db8/.test(pill), `unset: the command bar's target pill doesn't show the example address (${pill})`);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);

  // 2. Type a BMC into the form: copies use it; the user stays a $VAR.
  await p.evaluate(() => { const b = document.querySelector('#target-collapse-btn'); if (b && /Expand/.test(b.textContent)) b.click(); });
  await p.waitForTimeout(300);
  const field = await p.evaluate(() => { const i = document.getElementById('var-bmc'); return { value: i.value, placeholder: i.placeholder }; });
  check(field.value === '' && field.placeholder === '2001:db8:dc::50', `unset: the BMC input is empty with the example as placeholder (${JSON.stringify(field)})`);
  await p.click('#var-bmc');
  await p.keyboard.type('10.20.4.17', { delay: 15 });
  await p.waitForTimeout(300);
  copied = await copySel(p, writes);
  check(copied === 'ipmitool -I lanplus -H "10.20.4.17" -U "$BMC_USER" -E sel elist', `a typed BMC is filled in, the unset user is not (${copied})`);

  // 3. Clear it again: back to $BMC.
  // Select the field's text and delete it, then Tab away, the way a person clears it.
  await p.click('#var-bmc', { clickCount: 3 });
  await p.keyboard.press('Backspace');
  await p.keyboard.press('Tab');
  await p.waitForTimeout(300);
  copied = await copySel(p, writes);
  check(/-H "\$BMC"/.test(copied), `a cleared BMC is unset again (${copied})`);
  await ctx.close();

  // 4. Saved values (a returning user): both filled in, both chips set.
  ({ ctx, writes } = await context(browser, { bmc: '10.20.4.17', user: 'admin' }));
  p = await ctx.newPage();
  await p.goto(BASE + 'ipmi.html', { waitUntil: 'load' });
  await p.waitForTimeout(900);
  copied = await copySel(p, writes);
  check(copied === 'ipmitool -I lanplus -H "10.20.4.17" -U "admin" -E sel elist', `saved targets are filled in (${copied})`);
  c = await chips(p);
  check(c.bmc.set && c.user.set && c.iface.example, 'saved targets show as set, the others as examples');
  await ctx.close();

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
