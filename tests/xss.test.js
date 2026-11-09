// HTML-injection test: feed every paste/input tool a payload and see if any of it executes.
// common.js is patched IN THE BROWSER ONLY (page.route) to expose the openers on window.__t.
const { ROOT, BASE, OUT, launch, newContext } = require('./lib');
const fs = require('fs');
const path = require('path');

const HOOK = 'window.__t = { openIntake, openFabric, openFleetResults, openXray, openCheckup, openAnalyzer, ' +
  'openExplain, openRack, openPanel, openRosetta, openGlobalSearch, openGoldenDiff, openManuals, openHealthAtlas, openRunbook };\n';

// Two contexts: plain text, and text that first closes an attribute.
const P = id => `<img src=x onerror="__xss.push('${id}')">`;
const PA = id => `"'><img src=x onerror="__xss.push('${id}-attr')">`;
const both = id => P(id) + ' ' + PA(id);

const CASES = {
  CONTROL: () => document.body.insertAdjacentHTML('beforeend', P('control-must-fire')),
  intake: () => __t.openIntake(`Ticket: INC-4821 ${both('intake')}\nHost: gpu-node-07${P('intake-host')}\nBMC: 10.20.30.40\nUser: ${both('intake-user')}\nSymptom: NVRM: Xid (PCI:0000:8a:00): 79, ${both('intake-sym')}\nSerial: ${both('intake-sn')}\nmlx5_0 link down ${P('intake-dev')}`),
  fabric: () => __t.openFabric(`Switch: 0xb83fd2030080e0e0 Quantum ${both('fabric-sw')}:\n           1    1[  ] ==( 4X      106.25 Gbps Active/  LinkUp)==>       5    1[  ] "gpu-node-07 ${both('fabric-peer')} mlx5_0" ( )\n           1    2[  ] ==(                Down/ Polling)==>             [  ] "" ( )\nCA: gpu-node-07 ${both('fabric-ca')} mlx5_0:\n      0x946dae0300a1b2c3      5    1[  ] ==( 4X      106.25 Gbps Active/  LinkUp)==>       1    1[  ] "Quantum ${P('fabric-ca-peer')}" ( )`),
  fleet: () => __t.openFleetResults(`gpu-node-01${P('fleet-host')}: NVIDIA H200, 535.104 ${both('fleet-val')}\ngpu-node-02: NVIDIA H200, 535.104\ngpu-node-03: NVIDIA H200, 550.54 ${P('fleet-val2')}`),
  xray: () => __t.openXray(`index, name, pci.bus_id, serial, temperature.gpu, ecc.errors.uncorrected.volatile.total\n0, NVIDIA H200 ${both('xray-name')}, 00000000:18:00.0, 165000${P('xray-sn')}, 41, 0\n1, NVIDIA H200, 00000000:2A:00.0, ${both('xray-sn2')}, 43, 2`),
  checkup: () => __t.openCheckup(`@@host\ngpu-node-07${both('ck-host')}\n@@gpu\n0, NVIDIA H200 ${both('ck-gpu')}, 00000000:18:00.0, 41, 0\n@@dmesg\n[Mon Nov  9 01:00:00 2026] NVRM: Xid (PCI:0000:18:00): 79, ${both('ck-dmesg')}`),
  analyzer: () => __t.openAnalyzer(`[Mon Nov  9 01:00:00 2026] NVRM: Xid (PCI:0000:18:00): 79, pid=1234, name=${both('an-dmesg')}\n[Mon Nov  9 01:00:01 2026] mlx5_core 0000:41:00.0: ${both('an-mlx')} link down\nSmart Log for NVME device:nvme0 namespace-id:ffffffff\ncritical_warning : 0 ${P('an-smart')}`),
  explain: () => __t.openExplain(`ls -la ${both('explain')} | grep ${P('explain-pipe')}`),
  rack: () => __t.openRack(both('rack')),
  panel: () => __t.openPanel('find', both('panel')),
  rosetta: () => __t.openRosetta(both('rosetta')),
  search: () => __t.openGlobalSearch(both('search')),
  golden: () => __t.openGoldenDiff(`GPU 0: ${both('golden-s')}\nDriver: 550 ${P('golden-s2')}`, `GPU 0: ok ${both('golden-g')}`),
  manuals: () => __t.openManuals(both('manuals')),
  atlas: () => __t.openHealthAtlas(both('atlas')),
};

(async () => {
  const browser = await launch();
  const common = fs.readFileSync(path.join(ROOT, 'common.js'), 'utf8').replace('  window.CheatSheetCommon = commonExports;', HOOK + '  window.CheatSheetCommon = commonExports;');
  if (!common.includes('window.__t =')) throw new Error('hook not inserted');
  const fired = {};
  const errors = {};
  for (const [name, run] of Object.entries(CASES)) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    await ctx.route(/common\.js/, r => r.fulfill({ body: common, contentType: 'application/javascript' }));
    await ctx.addInitScript(() => { window.__xss = []; try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
    const page = await ctx.newPage();
    page.on('pageerror', e => (errors[name] = errors[name] || []).push(e.message));
    await page.goto(BASE + 'index.html', { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const helpers = `const P = ${P.toString()}; const PA = ${PA.toString()}; const both = id => P(id) + ' ' + PA(id);`;
    try { await page.evaluate(`${helpers} (${run.toString()})()`); } catch (e) { (errors[name] = errors[name] || []).push('threw: ' + e.message.split('\n')[0]); }
    await page.waitForTimeout(900);
    // Count copies rendered as text (outside form fields) before any clicks change the view.
    const shown = await page.evaluate(() => {
      const clone = document.body.cloneNode(true);
      clone.querySelectorAll('textarea, input').forEach(n => n.remove());
      return (clone.textContent.match(/onerror=/g) || []).length;
    });
    (errors[name] = errors[name] || []).push(`rendered as text x${shown}`);
    // Click every button inside the open dialog once more to reach second-level views.
    await page.evaluate(() => document.querySelectorAll('.an-backdrop.show button, .an-backdrop.show summary').forEach(b => { if (!/close|✕|copy|download|save|connect|run|send/i.test(b.textContent + b.className)) try { b.click(); } catch (e) {} }));
    await page.waitForTimeout(600);
    fired[name] = await page.evaluate(() => window.__xss);
    // Proof the payload was rendered (as text) rather than dropped by the parser.
    await ctx.close();
  }
  await browser.close();
  let bad = 0;
  for (const name of Object.keys(CASES)) {
    const f = fired[name] || [];
    // The control proves the payload can execute at all; if it stays silent, every "ok" is meaningless.
    const isControl = name === 'CONTROL';
    const failed = isControl ? !f.length : f.length > 0;
    if (failed) bad++;
    const label = isControl ? (f.length ? 'ok  ' : 'DEAD') : (f.length ? 'XSS ' : 'ok  ');
    console.log(`${label} ${name.padEnd(9)} ${f.length ? [...new Set(f)].join(', ') : ''}${errors[name] ? '   notes: ' + [...new Set(errors[name])].join(' | ').slice(0, 160) : ''}`);
  }
  process.exit(bad ? 1 : 0);
})();
