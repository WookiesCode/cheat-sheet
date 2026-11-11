// Returning users (an older tour seen) get the "What's new" invite, and it walks only the newest additions.
const { BASE, launch } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '13'); } catch (e) {} });  // saw the v13 tour
  const p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'page error: ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'load' });
  await p.waitForTimeout(1300);  // the invite appears after 900 ms
  const invite = await p.locator('.tour-invite.show').innerText().catch(() => '');
  check(/New since your last tour/.test(invite) && /front panel/.test(invite), 'the invite names the new additions');
  await p.click('.tour-invite-go', { delay: 120 });
  await p.waitForTimeout(500);
  const titles = [];
  for (let i = 0; i < 10; i++) {
    const t = await p.locator('.tour-card #tour-title').innerText().catch(() => '');
    if (!t || titles.includes(t)) break;
    titles.push(t);
    await p.keyboard.press('ArrowRight');
    await p.waitForTimeout(250);
  }
  check(/What.s new since your last tour/.test(titles[0] || ''), `it opens on "What's new since your last tour" (${titles[0]})`);
  const expect = ['Find a port on your own switches', 'Breakouts and the optic in each cage', 'Team optics and the first connection', 'Switching sheets no longer reloads'];
  check(expect.every(e => titles.includes(e)) && titles.length === expect.length + 1, `it walks the 4 new steps and nothing else (${titles.slice(1).join(' · ')})`);
  check(!titles.includes('One page per group'), 'the v13 additions are not in "What\'s new" any more');
  check(await p.evaluate(() => localStorage.getItem('dc_tour_seen')) === '14', 'opening it marks tour version 14 as seen');

  // Each new step's ▶ button does what it says. Reopen "What's new" and press ▶ on step n.
  const tryStep = async n => {
    await p.goto(BASE + 'index.html', { waitUntil: 'load' });
    await p.waitForTimeout(1300);  // the init script puts the seen version back to 13, so the invite returns
    await p.click('.tour-invite-go', { delay: 120 });
    await p.waitForTimeout(400);
    for (let i = 0; i < n; i++) { await p.keyboard.press('ArrowRight'); await p.waitForTimeout(200); }
    await p.click('.tour-card [data-tour="try"]', { delay: 120 });
    await p.waitForTimeout(700);
  };
  const panel = () => p.evaluate(() => ({ model: (document.querySelector('.pn-model') || {}).value, focus: [...document.querySelectorAll('.pn-svg .is-focus')].map(g => g.dataset.pnCage).join(','), hit: (document.querySelector('.pn-svg .pn-sub.is-hit') || { dataset: {} }).dataset.pnSub, mode: (document.querySelector('.pn-mode') || {}).value }));
  await tryStep(1);
  let r = await panel();
  check(r.model === 'nvidia-qm9700' && r.focus === '2' && r.hit === '3', `▶ "Find IB port 3 on a QM9790" lights 3 inside cage C02 (${JSON.stringify(r)})`);
  await tryStep(2);
  r = await panel();
  check(r.model === 'nvidia-sn5600' && r.focus === '14' && r.mode === '4', `▶ "Find swp14s3 on an SN5600" shows cage 14 in the 4× view (${JSON.stringify(r)})`);
  await tryStep(3);
  check(/fiber\.html#fo-team-optics$/.test(p.url()), `▶ "Open Team Optics & Fit" opens it (${p.url()})`);
  await tryStep(4);
  check(/cli-tools\.html#tar$/.test(p.url()), `▶ "Open CLI Tools at tar" opens it (${p.url()})`);
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
