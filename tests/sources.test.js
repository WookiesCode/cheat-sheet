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

  // 2b. InfiniBand: the 17 tool sheets (main command + recipes) and their corrections.
  {
    const IB = ['ib-ibstat', 'ib-ibv-devinfo', 'ib-rdma', 'ib-iblinkinfo', 'ib-ibswitches', 'ib-sminfo', 'ib-perfquery', 'ib-ibqueryerrors', 'ib-ibdiagnet', 'ib-ibping', 'ib-mst', 'ib-mlxconfig', 'ib-mlxlink', 'ib-mlxfwmanager', 'ib-perftest', 'ib-mlxcables', 'ib-bluefield'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    let total = 0, sourced = 0;
    const all = {};
    for (const f of IB) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(400);
      for (const l of await lines(p)) {
        if (/-(tips|flags)-card$/.test(l.id)) continue;  // advice and "-h" cards, not checked commands
        total++;
        all[l.id] = l;
        if (l.text) sourced++;
      }
    }
    check(total === 51 && sourced === 51, `all 51 InfiniBand commands and recipes show a source line (${sourced}/${total})`);
    const unverified = Object.values(all).filter(l => /is-unverified/.test(l.cls)).map(l => l.id).sort();
    check(unverified.join(' ') === 'ibdiagnet-sub-2 ibswitches-sub-1 ibv-devinfo-sub-1 sminfo-sub-1', `the 4 unconfirmed recipes say "Not verified" (${unverified.join(', ')})`);
    const pt = all['perftest-cmd'];
    check(/--ipv6-addr 2001:db8:dc::1/.test(pt.cmd) && (pt.cmd.match(/--ipv6-addr/g) || []).length === 2 && !/--ipv6\s/.test(pt.cmd), 'perftest passes --ipv6-addr on both server and client (not --ipv6)');
    check(/--test_mode EN/.test(all['mlxlink-sub-2'].cmd) && all['mlxlink-sub-2'].danger, 'PRBS test has --test_mode EN and is flagged');
    check(/--oprcvcounters/.test(all['perfquery-sub-2'].cmd), 'perfquery uses --oprcvcounters');
    check(/--get_phy_info/.test(all['ibdiagnet-cmd'].cmd) && !/--ber_test/.test(all['ibdiagnet-cmd'].cmd), 'ibdiagnet uses --get_phy_info (--ber_test is for old devices)');
    check(!/INTERNAL_CPU_MODEL/.test(all['bluefield-dpu-cmd'].cmd), 'BlueField query no longer asks for INTERNAL_CPU_MODEL');
    check(all['bluefield-dpu-sub-1'].danger && /bfb-install -r rshim0 -b/.test(all['bluefield-dpu-sub-2'].cmd) && all['bluefield-dpu-sub-2'].danger, 'BlueField mode switch and bfb-install are flagged; bfb-install uses -r / -b');
    check(all['mlxconfig-sub-3'].danger && !all['mlxconfig-cmd'].danger, 'mlxconfig reset is flagged; mlxconfig query is not');
    // The NVIDIA card had the same perftest mistake.
    await p.goto(BASE + 'nv-gpudirect.html', { waitUntil: 'load' });
    await p.waitForTimeout(400);
    const nv = (await lines(p)).find(l => l.id === 'ib-write-bw-cuda');
    check(nv && (nv.cmd.match(/--ipv6-addr/g) || []).length === 2 && /Corrected 2026-11-09: --ipv6-addr/.test(nv.text), 'NVIDIA ib_write_bw card fixed too, with a corrected note');
    await ctx.close();
  }

  // 2c. Redfish and IPMI: every command and recipe sourced, and the corrections.
  {
    const PAGES = ['rf-discovery', 'rf-power-boot', 'rf-inventory', 'rf-thermals-power', 'rf-logs-sel', 'rf-bios-bmc', 'rf-firmware', 'rf-hgx-dlc',
      'ipmi-chassis-power', 'ipmi-boot-override', 'ipmi-sensors-sdr', 'ipmi-sel-logs', 'ipmi-sol-console', 'ipmi-bmc-lan-users', 'ipmi-fru-mc'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    let total = 0, sourced = 0;
    const all = {};
    for (const f of PAGES) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(400);
      for (const l of await lines(p)) {
        if (/-(tips|flags)-card$/.test(l.id)) continue;
        total++;
        all[l.id] = l;
        if (l.text) sourced++;
      }
    }
    check(total === 45 && sourced === 45, `all 45 Redfish and IPMI commands and recipes show a source line (${sourced}/${total})`);
    const unverified = Object.values(all).filter(l => /is-unverified/.test(l.cls)).map(l => l.id);
    check(unverified.join(' ') === 'ipmi-bootparam-no-timeout', `only the bootparam no-timeout command says "Not verified" (${unverified.join(', ')})`);
    check(/enables ipv6/.test(all['ipmi-lan-set-static-dhcp'].cmd) && !/enabler/.test(all['ipmi-lan-set-static-dhcp'].cmd), 'ipmitool lan6 uses "enables ipv6" (not "enabler ipv6_only")');
    check(/<new-password>/.test(all['ipmi-user-password-admin'].cmd) && !/NewStrongPass/.test(all['ipmi-user-password-admin'].cmd), 'no literal sample password in the ipmitool user command');
    check(/Systems\/HGX_Baseboard_0\/Processors\/GPU_SXM_1/.test(all['rf-hgx-chassis-gpus'].cmd), 'HGX GPU path is the one NVIDIA documents');
    check(!/power diag/.test(all['ipmi-chassis-identify-nmi'].cmd) && !all['ipmi-chassis-identify-nmi'].danger, 'the identify box no longer carries the NMI and stays a plain command');
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
