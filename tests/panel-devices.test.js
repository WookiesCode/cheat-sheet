// Devices folded in from the team's Switch & Fiber Field Guide: the front panel finds ports on the
// ten new layouts by the names each OS prints, draws each cage as a tile (label, logical ports, optic),
// switches breakout views, shows the vendor photo, and records the optic installed in a cage.
// The fiber and switch pages carry the guide's cards.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

// model, what a tech types, the cage it must light up
const FINDS = [
  ['nvidia-qm9700', 'port 3', '2'], ['nvidia-qm9700', 'port 4', '2'], ['nvidia-qm9700', 'port 5', '3'],
  ['nvidia-qm9700', '3', '2'], ['nvidia-qm9700', 'cage 14', '14'], ['nvidia-qm9700', 'C05', '5'],
  ['vertiv-acs8000', 'LAN2 SFP', '4'], ['juniper-mx304', 'LMIC1', '2'],
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

  // Photos: every device has one, and it loads.
  const models = await p.evaluate(() => [...document.querySelectorAll('.pn-model option')].map(o => o.value));
  const noPhoto = [];
  for (const m of models) {
    await pick(m);
    await p.waitForTimeout(150);
    const ok = await p.evaluate(() => new Promise(res => { const i = document.querySelector('.pn-photo img'); if (!i) return res(false); if (i.complete) return res(i.naturalWidth > 0); i.onload = () => res(true); i.onerror = () => res(false); }));
    if (!ok) noPhoto.push(m);
  }
  check(!noPhoto.length, `the vendor photo shows for every guide device (${noPhoto.join(', ') || 'all'})`);

  // Tiles as in the field guide: QM cages are labelled C01… with their IB ports inside, odd cages
  // 1 | 2 and even cages 4 | 3 (port numbering snakes through the top and bottom cages).
  await pick('nvidia-qm9700');
  const subsOf = c => p.evaluate(c => [...document.querySelectorAll(`.pn-svg [data-pn-cage="${c}"] [data-pn-sub]`)].map(g => g.dataset.pnSub).join('|') + ' ' + (document.querySelector(`.pn-svg [data-pn-cage="${c}"] .pn-tile-id`) || {}).textContent, c);
  const qm = [await subsOf(1), await subsOf(2), await subsOf(32)];
  check(qm.join(',') === '1|2 C01,4|3 C02,64|63 C32', `QM9700 tiles: C01 holds 1|2, C02 holds 4|3, C32 holds 64|63 (${qm.join(', ')})`);
  await find('3');
  check(await p.evaluate(() => !!document.querySelector('.pn-svg [data-pn-cage="2"] .pn-sub.is-hit[data-pn-sub="3"]')), 'searching IB port 3 lights the "3" inside cage C02');
  await p.click('.pn-svg [data-pn-cage="5"] [data-pn-sub="10"]', { delay: 120 });
  check(await p.$eval('.pn-find', i => i.value) === '10', 'clicking a logical port inside a tile searches for it');

  // Breakout views: SN5600 2× shows s0|s1 on the upper cage rows and s1|s0 on the lower ones.
  await pick('nvidia-sn5600');
  await find('');
  await p.selectOption('.pn-mode', '2');
  await p.waitForTimeout(150);
  const sn = [await subsOf(1), await subsOf(3)];
  check(sn.join(',') === 's0|s1 1,s1|s0 3', `SN5600 2×: upper cages s0|s1, lower cages s1|s0 (${sn.join(', ')})`);
  const mode = () => p.$eval('.pn-mode', s => s.value);
  await find('swp14s3');
  const m1 = await mode();
  await p.selectOption('.pn-mode', '1');
  await p.waitForTimeout(150);
  const m2 = await mode();
  await find('swp6'); await find('swp14s3');
  check(m1 === '4' && m2 === '1' && await mode() === '4', `a breakout search switches to 4×, a View choice then sticks, a new search switches again (${m1}, ${m2}, ${await mode()})`);
  await p.selectOption('.pn-mode', '2');
  await find('');

  // Devices with tiles in place of a port grid: console server and router.
  await pick('vertiv-acs8000');
  const acs = await p.evaluate(() => [...document.querySelectorAll('.pn-svg .pn-tile-id')].map(t => t.textContent).sort().join(','));
  check(acs === 'LAN1 Cu,LAN1 SFP,LAN2 Cu,LAN2 SFP', `ACS8000 draws its four network ports as tiles (${acs})`);

  // The picker lists only the team's devices: no reference layouts or generic patterns.
  const picker = await p.evaluate(() => ({ n: document.querySelectorAll('.pn-model option').length, groups: document.querySelectorAll('.pn-model optgroup').length, ref: [...document.querySelectorAll('.pn-model option')].some(o => /7060|generic/.test(o.value)) }));
  check(picker.n === 11 && !picker.groups && !picker.ref, `the switch picker lists the 11 team devices only (${picker.n} options)`);

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
  // Glossary terms from the guide, corrected 2026-11-10 against vendor pages (FR4 is Far Reach; the QSFP
  // number is the connector's rating; Juniper never spells out LMIC).
  const gloss = async q => { await p.keyboard.press('Control+k'); await p.waitForTimeout(250); await p.keyboard.type(q, { delay: 10 }); await p.waitForTimeout(400); const t = await p.evaluate(() => (document.querySelector('.palette-results, #palette-results') || document.body).textContent); await p.keyboard.press('Escape'); await p.waitForTimeout(200); return t; };
  const g = [await gloss('what is FR4'), await gloss('QSFP28'), await gloss('LMIC')];
  check(/FR4: Far Reach/.test(g[0]) && /25G NRZ: 100G/.test(g[1]) && /LMIC: Juniper MX304 line module/.test(g[2]) && !/Line Module Interface Card|Four-wavelength reach/.test(g.join(' ')),
    'glossary: FR4 = Far Reach, QSFP28 = 4 × 25G NRZ, LMIC not given an invented expansion');
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
