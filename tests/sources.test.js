// Command sources: every NVIDIA command shows where it was checked and when; corrected commands are
// right and flagged; old dates turn amber; the line survives a re-render; nothing in src can inject.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const NV = ['nv-smi.html', 'nv-admin.html', 'nv-dcgm.html', 'nv-nvlink.html', 'nv-mig.html', 'nv-gpudirect.html', 'nv-pcie.html', 'nv-ops.html'];
const lines = (p) => p.evaluate(() => [...document.querySelectorAll('.cmd-item[data-cmd-id]')].map(it => {
  const s = it.querySelector('.cmd-source');
  return { id: it.dataset.cmdId, cmd: (it.querySelector('.cmd-code-box') || {}).dataset ? it.querySelector('.cmd-code-box').innerText : '', text: s ? s.innerText : null,
    cls: s ? s.className : '', links: s ? [...s.querySelectorAll('a')].map(a => ({ href: a.href, rel: a.rel, target: a.target })) : [],
    danger: !!it.querySelector('.cmd-code-box.anat-danger') };
}));

(async () => {
  const browser = await launch();

  // 1. Every command on the 8 NVIDIA sheets has a source line; links are https, new tab, noopener.
  {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    let total = 0, sourced = 0, unverified = 0, badLinks = 0;
    const all = {};
    for (const f of NV) {
      await p.goto(BASE + f, { waitUntil: 'load' });
      await p.waitForTimeout(500);
      for (const l of await lines(p)) {
        if (/-tips-card$/.test(l.id)) continue;  // pro-tip cards are advice, not commands
        total++;
        all[l.id] = l;
        if (l.text) sourced++;
        if (/is-unverified/.test(l.cls)) unverified++;
        for (const a of l.links) if (!a.href.startsWith('https://') || a.target !== '_blank' || !/noopener/.test(a.rel)) badLinks++;
      }
    }
    check(total === 31 && sourced === 31, `all 31 NVIDIA commands show a source line (${sourced}/${total})`);
    check(unverified === 1 && /Not verified/.test(all['lspci-link-aer-audit'].text), 'the one unchecked command (lspci) says "Not verified"');
    check(badLinks === 0, 'every source link is https, opens a new tab, rel=noopener');
    check(/verified Nov 2026/.test(all['smi-topo-matrix'].text), 'the date reads "verified Nov 2026"');

    // 2. The corrections, as shown on the sheets.
    const ecc = all['ecc-toggle-clear'];
    check(/nvidia-smi -p 0/.test(ecc.cmd) && !/clear-ecc-error-counts/.test(ecc.cmd), 'ECC reset uses -p (the non-existent --clear-ecc-error-counts is gone)');
    check(ecc.danger, 'the ECC counter reset is flagged as changing state');
    const nvl = all['nvlink-status-errors'];
    check(/nvlink -re/.test(nvl.cmd) && !/nvlink -R\b/.test(nvl.cmd), 'NVLink counter reset uses -re, not -R');
    check(nvl.danger, 'the NVLink counter reset is flagged as changing state');
    check(/-mig 1\s+\|?\s*\n?.*--gpu-reset/s.test(all['mig-enable-disable'].cmd) && !/-mig 1\s+&&/.test(all['mig-enable-disable'].cmd), 'MIG enable no longer chains a reset (Ampere only)');
    check(all['disable-pcie-acs'].danger, 'setpci writing PCIe config space is flagged as changing state');
    check(!all['smi-topo-matrix'].danger, 'read-only nvidia-smi topo is not flagged');
    await ctx.close();
  }

  // 3. Over a year old → amber "re-check"; and src can't inject markup or javascript: links.
  {
    const ctx = await newContext(browser);
    const index = fs.readFileSync(path.join(ROOT, 'global-search-index.js'), 'utf8')
      .replace(/"verified": "2026-11-09"/g, '"verified": "2024-01-15"')
      .replace('"title": "NVIDIA nvidia-smi documentation"', '"title": "<img src=x onerror=window.__xss=1>"')
      .replace('"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html"', '"url": "javascript:window.__xss=2"');
    await ctx.route(/global-search-index\.js/, r => r.fulfill({ body: index, contentType: 'application/javascript' }));
    const p = await ctx.newPage();
    await p.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
    await p.waitForTimeout(600);
    const l = await lines(p);
    check(l.every(x => /is-stale/.test(x.cls) || /-tips-card$/.test(x.id) || !x.text), 'a date over a year old turns every line amber');
    check(l.some(x => /re-check/.test(x.text || '')), 'stale lines say "re-check"');
    check(!(await p.evaluate(() => window.__xss)), 'a hostile title or javascript: URL in src does not run');
    check(!(await p.evaluate(() => [...document.querySelectorAll('.cmd-source a')].some(a => a.href.startsWith('javascript:')))), 'a javascript: URL is never rendered as a link');
    await ctx.close();
  }

  // 4. A re-render (starring a command rebuilds the cards) keeps the source lines.
  {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    await p.goto(BASE + 'nv-smi.html', { waitUntil: 'load' });
    await p.waitForTimeout(500);
    await p.locator('.bookmark-btn').first().click({ delay: 120 });
    await p.waitForTimeout(500);
    const l = await lines(p);
    check(l.filter(x => !/-tips-card$/.test(x.id)).every(x => x.text), 'source lines are back after the sheet re-renders');
    check(l.every(x => (x.text || '').split('verified').length <= 2), 'no line is drawn twice');
    await ctx.close();
  }

  // 5. The portable copy shows them too.
  {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    await p.goto('file://' + path.join(ROOT, 'datacenter-cheatsheet-portable.html') + '#sheet-nv-admin', { waitUntil: 'load' });
    await p.waitForTimeout(900);
    const n = await p.evaluate(() => document.querySelectorAll('.cmd-source').length);
    check(n >= 5, `portable file: nv-admin shows its source lines (${n})`);
    await ctx.close();
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
