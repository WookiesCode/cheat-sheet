// Devices folded in from the team's Switch & Fiber Field Guide: the front panel finds ports on the
// ten new layouts by the names each OS prints, shows the vendor photo, explains photo-only devices,
// and records the optic installed in a cage. The fiber and switch pages carry the guide's cards.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

// model, what a tech types, the cage it must light up
const FINDS = [
  ['nvidia-qm9700', 'port 3', '2'], ['nvidia-qm9700', 'port 4', '2'], ['nvidia-qm9700', 'port 5', '3'],
  ['nvidia-sn5400', 'swp6', '6'], ['nvidia-sn5400', 'swp14s1', '14'], ['nvidia-sn5400', '66', '66'],
  ['nvidia-sn5600', 'swp65', '65'], ['nvidia-sn2410', 'swp56', '56'],
  ['cisco-c9200l-48t-4x', 'Gi1/0/14', '14'], ['cisco-c9200l-48t-4x', 'Te1/1/3', '51'],
  ['cisco-n9k-c93180yc-fx3', 'Ethernet1/49', '49'], ['arista-7260cx3-64', 'Et33', '33'],
  ['mikrotik-ccr2216', 'sfp28-3', '3'], ['mikrotik-ccr2216', 'Q1', '13'], ['mikrotik-ccr2216', 'ether1', '15'],
  ['hasivo-s5800w-24g-2s', 'SFP 2', '26'], ['hasivo-s5800w-24g-2s', 'RJ45 5', '5']
];

(async () => {
  const browser = await launch();
  const ctx = await newContext(browser);
  const p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'page error: ' + e.message));
  await p.goto(BASE + 'switches.html', { waitUntil: 'load' });
  await p.waitForTimeout(600);
  await p.click('.ros-strip-panel', { delay: 120 });
  await p.waitForTimeout(300);
  const pick = async m => { await p.selectOption('.pn-model', m); await p.waitForTimeout(200); };
  const find = async t => { await p.fill('.pn-find', t); await p.waitForTimeout(150); return p.evaluate(() => ({ ans: document.querySelector('.pn-answer').textContent, focus: [...document.querySelectorAll('.pn-svg .is-focus')].map(g => g.dataset.pnCage).join(',') })); };

  const wrong = [];
  for (const [m, t, want] of FINDS) { await pick(m); const r = await find(t); if (r.focus !== want) wrong.push(`${m} "${t}" → ${r.focus || 'nothing'} (want ${want})`); }
  check(!wrong.length, `every port name lights the right cage (${FINDS.length - wrong.length}/${FINDS.length}) ${wrong.join('; ')}`);

  await pick('nvidia-qm9700');
  check(/IB port 3 is the right half of cage 2/.test((await find('port 3')).ans) && /IB port 4 is the left half of cage 2/.test((await find('port 4')).ans), 'QM9700: IB port 3 is the right half of cage 2, port 4 the left half (NVIDIA schematic)');
  await pick('mikrotik-ccr2216');
  check(/Q1 → Q1: QSFP28 1/.test((await find('Q1')).ans), 'an extra port is named the way it is printed (Q1), not by its index');

  // Photos: every device but the generic patterns has one, and it loads.
  const models = await p.evaluate(() => [...document.querySelectorAll('.pn-model option')].map(o => o.value));
  const noPhoto = [];
  for (const m of models.filter(m => !/^generic|^arista-7060/.test(m))) {
    await pick(m);
    await p.waitForTimeout(150);
    const ok = await p.evaluate(() => new Promise(res => { const i = document.querySelector('.pn-photo img'); if (!i) return res(false); if (i.complete) return res(i.naturalWidth > 0); i.onload = () => res(true); i.onerror = () => res(false); }));
    if (!ok) noPhoto.push(m);
  }
  check(!noPhoto.length, `the vendor photo shows for every guide device (${noPhoto.join(', ') || 'all'})`);
  await pick('vertiv-acs8000');
  check(/no fixed port drawing/.test((await find('LAN1')).ans) && !(await p.$('.pn-svg')), 'a console server is photo-only: no drawing, and the answer says why');

  // Installed optic: record one in QM cage 2, then copper ports refuse one.
  await pick('nvidia-qm9700');
  await find('port 3');
  await p.selectOption('.pn-optic-type', 'MMA4Z00-NS · 2×400G SR4');
  await p.fill('.pn-optic-part', 'MMA4Z00-NS test');
  await p.click('[data-pn-optic="save"]', { delay: 120 });
  await p.waitForTimeout(200);
  const rec = await p.evaluate(() => ({ dot: !!document.querySelector('.pn-svg [data-pn-cage="2"].has-optic'), row: document.querySelector('.pn-optic-table tbody tr') ? document.querySelector('.pn-optic-table tbody tr').textContent : '', store: JSON.parse(localStorage.getItem('cs_panel_optics_v1') || '{}') }));
  check(rec.dot && /MMA4Z00-NS test/.test(rec.row) && rec.store['nvidia-qm9700'] && rec.store['nvidia-qm9700']['2'].type === 'MMA4Z00-NS · 2×400G SR4', 'an optic saved in cage 2 is marked on the panel, listed and kept in the browser');
  await p.click('[data-pn-optic="clear"]', { delay: 120 });
  await p.waitForTimeout(150);
  check(await p.evaluate(() => !localStorage.getItem('cs_panel_optics_v1') || !JSON.parse(localStorage.getItem('cs_panel_optics_v1'))['nvidia-qm9700']), 'Clear removes it');
  await pick('hasivo-s5800w-24g-2s');
  await find('RJ45 5');
  check(/copper or management port: no optic to record/.test(await p.evaluate(() => document.querySelector('.pn-optic').textContent)), 'a copper port has no optic to record');

  // The folded cards.
  await p.goto(BASE + 'fiber.html#fo-team-optics', { waitUntil: 'load' });
  await p.waitForTimeout(600);
  const team = await p.evaluate(() => ({ parts: [...document.querySelectorAll('.cmd-item[data-id^="team-"]')].length, text: document.querySelector('#sections-container').textContent }));
  check(team.parts >= 14 && /32\.39\.4082/.test(team.text) && /MCX75310AAS-NEA/.test(team.text), `Team Optics: ${team.parts} cards, with the adapter part numbers and firmware`);
  await p.goto(BASE + 'switches.html#sw-hardware', { waitUntil: 'load' });
  await p.waitForTimeout(600);
  check((await p.evaluate(() => document.querySelectorAll('.cmd-item[data-id^="hw-"]').length)) === 11, 'Switch hardware: one card for each of the eleven devices');
  await ctx.close();

  // The one-file copy carries the photos inline.
  const portable = fs.readFileSync(path.join(ROOT, 'datacenter-cheatsheet-portable.html'), 'utf8');
  const m = portable.match(/window\.PANEL_PHOTOS = (\{.*?\});/s);
  const photos = m ? Object.keys(JSON.parse(m[1])) : [];
  check(photos.length === 11 && photos.every(f => f.endsWith('.webp')), `the portable file inlines the 11 front photos (${photos.length})`);

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
