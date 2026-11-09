// Explain reads flag descriptions from captured --help text without cutting sentences at
// "e.g." or "1.2" (nvidia-smi -d used to read "g. ECC,POWER.").
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

(async () => {
  const browser = await launch();
  const ctx = await newContext(browser);
  const p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'page error: ' + e.message));
  await p.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
  await p.waitForTimeout(500);
  await p.keyboard.press('e');
  await p.waitForTimeout(300);
  await p.fill('.an-backdrop.show textarea', 'nvidia-smi -q -d ECC');
  await p.waitForTimeout(1500);  // the help pages load on first use
  // Each flag's explanation is an .ex-row whose <code> holds the flag.
  const row = await p.evaluate(() => {
    const r = [...document.querySelectorAll('.an-backdrop.show .ex-row')].find(x => (x.querySelector('code') || {}).textContent === '-d');
    return r ? r.innerText.replace(/\s+/g, ' ') : '';
  });
  check(/Display only selected information/.test(row), `-d is described from the start of its help text ("${row.slice(0, 70)}…")`);
  check(!/(^|\s)g\. ECC,POWER/.test(row), 'no "g. ECC,POWER." fragment');
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
