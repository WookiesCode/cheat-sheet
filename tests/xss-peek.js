// Debug helper for t-xss.js: open one tool with a payload and print what its dialog shows.
const { ROOT, BASE, OUT, launch, newContext } = require('./lib');
const fs = require('fs');
const path = require('path');

const HOOK = 'window.__t = { openIntake, openFabric, openFleetResults, openXray, openCheckup, openAnalyzer, openExplain, openGoldenDiff, openManuals };\n';
const which = process.argv[2] || 'intake';
const P = `<img src=x onerror="__xss.push(1)">`;
const INPUT = {
  intake: `__t.openIntake(${JSON.stringify(`Ticket: INC-4821 ${P}\nHost: gpu-node-07${P}\nBMC: 10.20.30.40\nSymptom: NVRM: Xid (PCI:0000:8a:00): 79, ${P}`)})`,
  analyzer: `__t.openAnalyzer(${JSON.stringify(`[Mon Nov  9 01:00:00 2026] NVRM: Xid (PCI:0000:18:00): 79, pid=1234, name=${P}\n[Mon Nov  9 01:00:01 2026] mlx5_core 0000:41:00.0: ${P} link down`)})`,
  explain: `__t.openExplain(${JSON.stringify(`ls -la ${P}`)})`,
  fleet: `__t.openFleetResults(${JSON.stringify(`gpu-node-01${P}: NVIDIA H200, 535.104 ${P}\ngpu-node-02: NVIDIA H200, 535.104\ngpu-node-03: NVIDIA H200, 550.54`)})`,
};

(async () => {
  const browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const common = fs.readFileSync(path.join(ROOT, 'common.js'), 'utf8').replace('  window.CheatSheetCommon = commonExports;', HOOK + '  window.CheatSheetCommon = commonExports;');
  await ctx.route(/common\.js/, r => r.fulfill({ body: common, contentType: 'application/javascript' }));
  await ctx.addInitScript(() => { window.__xss = []; try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
  const page = await ctx.newPage();
  await page.goto(BASE + 'index.html', { waitUntil: 'load' });
  await page.waitForTimeout(400);
  await page.evaluate(INPUT[which]);
  await page.waitForTimeout(1200);
  const info = await page.evaluate(() => {
    const d = document.querySelector('.an-backdrop.show, [class*="backdrop"].show, dialog[open]');
    return { dialog: d ? d.className : null, text: d ? d.innerText.slice(0, 2500) : document.body.innerText.slice(0, 300) };
  });
  console.log(JSON.stringify(info, null, 1));
  await page.screenshot({ path: path.join(OUT, `peek-${which}.png`) });
  await browser.close();
})();
