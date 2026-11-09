// Returning users (an older tour seen) get the "What's new" invite, and it walks only today's additions.
const { BASE, launch } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '8'); } catch (e) {} });  // saw the v8 tour
  const p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'page error: ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'load' });
  await p.waitForTimeout(1300);  // the invite appears after 900 ms
  const invite = await p.locator('.tour-invite.show').innerText().catch(() => '');
  check(/New since your last tour/.test(invite) && /backup/i.test(invite) && /read-only reboot/.test(invite), 'the invite names the new additions');
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
  const expect = ['Search warns before risky copies', 'Back up everything you keep', 'Every command shows where it was checked', 'Reboot and crash commands are read-only', 'Keyboard: skip the menus'];
  check(expect.every(e => titles.includes(e)), `it walks the 5 new steps (${titles.slice(1).join(' · ')})`);
  check(!titles.includes('Node X-ray: see the GPU tray'), 'older additions are not in "What\'s new" any more');
  check(await p.evaluate(() => localStorage.getItem('dc_tour_seen')) === '9', 'opening it marks tour version 9 as seen');
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
