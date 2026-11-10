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

  // 2d. BMC vendor tools (racadm, iLOrest, SAA, OneCLI, FreeIPMI, serial consoles).
  {
    const PAGES = ['racadm', 'ilorest', 'supermicro-saa', 'onecli', 'freeipmi', 'serial-console'];
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
    check(total === 107 && sourced === 107, `all 107 BMC-tool commands and recipes show a source line (${sourced}/${total})`);
    const unverified = Object.values(all).filter(l => /is-unverified/.test(l.cls)).map(l => l.id).sort();
    check(unverified.join(' ') === 'saa-multi serial-picocom-sub-1 serial-picocom-sub-2 serial-picocom-sub-3 serial-ser2net-sub-1',
      `the 5 unconfirmed entries say "Not verified" (${unverified.join(', ')})`);
    check(/racadm-getsysinfo/.test(Object.keys(all).join(' ')) && /Dell RACADM 7\.xx/.test(all['racadm-getsysinfo'].text), 'racadm cites the Dell RACADM 7.xx guide');
    check(/HPE iLOrest 7\.4/.test(all['ilorest-reboot'].text), 'iLOrest cites the HPE iLOrest 7.4 guide (even on the reference-only reboot card)');
    await ctx.close();
  }

  // 2e. Switch NOS sheets and Ethernet/Linux sheets, their corrections, and the hub builder.
  {
    const SW = ['sw-quantum-ports', 'sw-quantum-hw-sm', 'sw-quantum-inband', 'sw-cumulus-ports', 'sw-cumulus-optics', 'sw-cumulus-lldp', 'sw-cumulus-bonds',
      'sw-cumulus-bgp', 'sw-cumulus-hw', 'sw-arista-ports', 'sw-arista-mlag', 'sw-arista-bgp', 'sw-nxos-ports', 'sw-nxos-vpc', 'sw-sonic'];
    const ETH = ['eth-rj45-tdr', 'eth-ethtool-tuning', 'eth-netplan-systemd', 'eth-iproute2-ip6', 'eth-bonding-vlans', 'eth-lldp-perf'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    const collect = async (pages) => {
      const all = {};
      for (const f of pages) {
        await p.goto(BASE + f + '.html', { waitUntil: 'load' });
        await p.waitForTimeout(400);
        for (const l of await lines(p)) if (!/-(tips|flags)-card$/.test(l.id)) all[l.id] = l;
      }
      return all;
    };
    let swText = '';  // flag tables render client-side; keep each page's visible text for the flag-row checks
    const collectSw = async () => {
      const all = {};
      for (const f of SW) {
        await p.goto(BASE + f + '.html', { waitUntil: 'load' });
        await p.waitForTimeout(400);
        // Source notes name the old command on purpose ("Corrected: …"), so leave them out.
        swText += await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('.cmd-source').forEach(n => n.remove()); return c.textContent; }) + '\n';
        for (const l of await lines(p)) if (!/-(tips|flags)-card$/.test(l.id)) all[l.id] = l;
      }
      return all;
    };
    const sw = await collectSw();
    const swList = Object.values(sw);
    check(swList.length === 67 && swList.every(l => l.text), `all 67 switch commands and recipes show a source line (${swList.filter(l => l.text).length}/${swList.length})`);
    const swUnv = swList.filter(l => /is-unverified/.test(l.cls)).map(l => l.id).sort();
    check(swUnv.length === 11, `the 11 unconfirmed switch recipes say "Not verified" (${swUnv.join(', ')})`);
    const swCmds = swList.map(l => l.cmd).join('\n');
    check(/module-type qsfp-split-2/.test(swText) && !/interface ib 1\/1 split/.test(swText), 'MLNX-OS split uses module-type qsfp-split-2');
    check(/ib smnode <sm-node> enable/.test(swCmds) && !/show ib smgoing/.test(swCmds), 'MLNX-OS SM uses ib smnode … enable; no invented show ib smgoing');
    check(!/nv config apply -y/.test(swCmds) && /nv config apply --assume-yes/.test(swCmds), 'Cumulus uses --assume-yes (not -y)');
    check(!/nv config rollback|nv config show -o commands/.test(swCmds) && /nv config translate revision/.test(swCmds), 'no invented nv config rollback / -o commands');
    check(!/errors nz/.test(swText) && !/show logging last 50/.test(swText) && /show logging 50/.test(swText), 'Arista: no nz filter; show logging 50 for a count');
    check(!/sfputil show eeprom|nv config apply -y|nv config rollback|show ib smgoing/.test(swText), 'no corrected command survives anywhere on the switch pages');
    check(!/sfputil show eeprom/.test(swCmds) && /show interfaces transceiver eeprom --dom/.test(swCmds), 'SONiC DOM uses show interfaces transceiver eeprom --dom');
    check(sw['nvue-platform-config-sub-2'].danger, 'nv config apply is still flagged as changing state');
    const eth = await collect(ETH);
    const ethList = Object.values(eth);
    check(ethList.length === 21 && ethList.every(l => l.text), `all 21 Ethernet commands show a source line (${ethList.filter(l => l.text).length}/${ethList.length})`);
    const ethUnv = ethList.filter(l => /is-unverified/.test(l.cls)).map(l => l.id);
    check(ethUnv.join(' ') === 'rj45-t568b-t568a-chart', `only the RJ45 wiring chart says "Not verified" (${ethUnv.join(', ')})`);
    check(/man7\.org/.test(JSON.stringify(eth['ip-route-get-lookup'].links)), 'iproute2 commands link the man7.org man pages');
    // The hub builder produces the corrected commands too.
    await p.goto(BASE + 'switches.html', { waitUntil: 'load' });
    await p.waitForTimeout(500);
    const build = (nos, task) => p.evaluate(([n, t]) => {
      const set = (id, v) => { const el = document.getElementById(id); el.value = v; el.dispatchEvent(new Event('change', { bubbles: true })); };
      set('sw-nos-select', n); set('sw-task-select', t);
      return document.getElementById('sw-builder-output').textContent;
    }, [nos, task]);
    check((await build('arista', 'errors')) === 'show interfaces counters errors', 'builder: Arista errors has no nz');
    check(/^show interfaces transceiver eeprom --dom Ethernet/.test(await build('sonic', 'dom')), 'builder: SONiC DOM uses show interfaces transceiver eeprom --dom');
    await ctx.close();
  }

  // 2f. Linux storage sheets (NVMe/SMART/RAID/LEDs, filesystems/LVM): one source line per command
  // (recipes sit inside their command's card), on the sheets and on the Linux hub; corrections;
  // the data-destroying recipes are flagged.
  {
    const IDS = ['nvme-list-smart', 'nvme-format-fw', 'smartctl-disk-triage', 'mdadm-raid-ops', 'ledctl-lsscsi-multipath',
      'df-du-space', 'lsblk-blkid-fstab', 'lvm-resize-extend', 'dd-parted-fsck'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    const got = {};
    let text = '';
    const rows = [];
    for (const f of ['nvme-smart', 'storage']) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(400);
      for (const l of await lines(p)) got[l.id] = l;
      text += await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('.cmd-source, .cmd-details').forEach(n => n.remove()); return c.textContent; }) + '\n';
      rows.push(...await p.evaluate(() => [...document.querySelectorAll('.subcmd-row, .cmd-code-box')].map(b => ({ t: b.textContent, aria: b.getAttribute('aria-label') || '' }))));
    }
    const list = IDS.map(id => got[id]).filter(Boolean);
    check(list.length === 9 && list.every(l => l.text && !/is-unverified/.test(l.cls)), `all 9 storage commands show a verified source line (${list.filter(l => l.text).length}/${list.length})`);
    check(/man7\.org\/linux\/man-pages\/man1\/dd\.1/.test(JSON.stringify(got['dd-parted-fsck'].links)), 'dd cites dd(1) on man7.org');
    check(/conv=fsync/.test(got['dd-parted-fsck'].cmd) && !/oflag=sync/.test(text), 'dd flushes with conv=fsync, and oflag=sync is gone from commands and flag rows');
    check(!/ledctl (locate|locate_off|normal)=/.test(text) && /ledctl --listed-only locate=/.test(text), 'every ledctl pattern uses --listed-only');
    check(!/smartctl -t short \/dev\/sda &&/.test(text) && /smartctl -l selftest \/dev\/sda/.test(text), 'the self-test and its log are separate recipes');
    check(!/mkpart primary/.test(text) && /mkpart data ext4 1MiB 100%/.test(text), 'GPT mkpart uses a partition name, not "primary"');
    check(!/lsblk -f -o/.test(text), 'lsblk no longer mixes -f with -o');
    check(/activates at the next controller reset/.test(text), 'fw-commit --action=1 says it activates at the next reset');
    const flagged = (re) => rows.filter(r => re.test(r.t)).every(r => /Changes state/.test(r.aria)) && rows.some(r => re.test(r.t));
    check(flagged(/blkdiscard/), 'blkdiscard is flagged as changing state');
    check(flagged(/mdadm --manage \/dev\/md0 --add/), 'mdadm --add (starts a rebuild) is flagged as changing state');
    check(flagged(/lvextend -r/), 'lvextend is flagged as changing state');
    // The Linux hub renders the same data with its own renderer (cards marked data-id).
    await p.goto(BASE + 'linux.html', { waitUntil: 'load' });
    await p.waitForTimeout(600);
    const hub = await p.evaluate((ids) => ids.filter(id => { const it = document.querySelector(`.cmd-item[data-id="${id}"]`); return it && it.querySelector('.cmd-source'); }), IDS);
    check(hub.length === 9, `the Linux hub shows the same 9 source lines (${hub.length}/9)`);
    await ctx.close();
  }

  // 2g. Linux hardware sections (DMI, PCIe/NUMA, ECC/EDAC, kernel/boot): sources, corrections, and
  // the burn-in / module / governor commands flagged.
  {
    const PAGES = ['dmi-hw', 'pcie-numa', 'ecc-edac', 'kernel-boot'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    const got = {};
    let text = '';
    const rows = [];
    for (const f of PAGES) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(400);
      for (const l of await lines(p)) got[l.id] = l;
      text += await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('.cmd-source, .cmd-details').forEach(n => n.remove()); return c.textContent; }) + '\n';
      rows.push(...await p.evaluate(() => [...document.querySelectorAll('.subcmd-row, .cmd-code-box')].map(b => ({ t: b.textContent, aria: b.getAttribute('aria-label') || '' }))));
    }
    const list = Object.values(got);
    check(list.length === 16 && list.every(l => l.text && !/is-unverified/.test(l.cls)), `all 16 hardware commands show a verified source line (${list.filter(l => l.text).length}/${list.length})`);
    check(/lscpu -e=CPU,NODE,SOCKET,CORE,CACHE,/.test(got['lscpu-topology'].cmd) && !/-e=[^ ]*L1d:L1i/.test(text), 'lscpu -e uses the CACHE column (L1d:L1i:L2:L3 is only its heading)');
    check(!/rescan/.test(got['lspci-aer-rescan'].cmd), 'the read-only AER check no longer runs a bus rescan');
    check(!/iperf3 -s\s+#/.test(text) && /iperf3 -6 -c 2001:db8:dc:10::1/.test(text), 'iperf3 server and client are separate recipes (no # swallowing the client)');
    check(!/modprobe -v <module_name> &&/.test(text), 'module load and unload are separate recipes');
    check(/^lshw -businfo$/m.test(got['lshw-hardware-tree'].cmd) && !/lshw -short -businfo/.test(text), 'lshw uses one output format (-businfo)');
    const flagged = (re) => rows.some(r => re.test(r.t)) && rows.filter(r => re.test(r.t)).every(r => /Changes state/.test(r.aria));
    check(flagged(/stress-ng --cpu 0/), 'stress-ng burn-in is flagged as changing state');
    check(flagged(/cpupower frequency-set/), 'cpupower frequency-set is flagged');
    check(flagged(/^\s*modprobe -v </), 'modprobe (load) is flagged');
    check(flagged(/tee \/sys\/bus\/pci\/rescan/), 'the PCI rescan recipe is flagged');
    check(!rows.filter(r => /cpupower frequency-info|lspci -vvv \||lscpu &&/.test(r.t)).some(r => /Changes state/.test(r.aria)), 'read-only commands are not flagged');
    await ctx.close();
  }

  // 2h. Rack & hardware reference sheets: commands, recipes and Pro Tip cards sourced; reference
  // facts that couldn't be checked say so; no sudo (the site marks root itself); corrections.
  {
    const PAGES = ['hw-power', 'hw-cooling', 'hw-memory', 'hw-drives', 'hw-gpu-forms', 'hw-rack'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    const got = {};
    let text = '';
    const boxes = [];
    for (const f of PAGES) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(400);
      for (const l of await lines(p)) if (!/-flags-card$/.test(l.id)) got[l.id] = l;
      text += await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('.cmd-source').forEach(n => n.remove()); return c.textContent; }) + '\n';
      boxes.push(...await p.evaluate(() => [...document.querySelectorAll('.cmd-item[data-cmd-id]')].map(it => {
        const b = it.querySelector('.cmd-code-box');
        return { id: it.dataset.cmdId, code: b ? (b.dataset.cmd || b.dataset.copy || b.innerText) : '', root: !!it.querySelector('.priv-tag.priv-root') };
      })));
    }
    const list = Object.values(got);
    check(list.length === 50 && list.every(l => l.text), `all 50 hardware-reference commands, recipes and tip cards show a source line (${list.filter(l => l.text).length}/${list.length})`);
    const unv = list.filter(l => /is-unverified/.test(l.cls)).map(l => l.id).sort();
    check(unv.join(' ') === 'drives-link gpuform-tips-card power-circuit power-circuit-sub-1 rack-labels',
      `only the paywalled/undocumented entries say "Not verified" (${unv.join(', ')})`);
    check(!boxes.some(b => /(^|[\s;(|&$])sudo\s/.test(b.code)), 'no command on the hardware-reference sheets starts with sudo');
    const rooted = (re) => boxes.filter(b => re.test(b.code)).length > 0 && boxes.filter(b => re.test(b.code)).every(b => b.root);
    check(rooted(/^dmidecode /), 'dmidecode commands still carry the root badge');
    check(rooted(/^ledctl /), 'ledctl carries the root badge (new rule)');
    check(rooted(/^nvidia-bug-report\.sh/), 'nvidia-bug-report.sh carries the root badge');
    check(!/driver's exact version/.test(text) && /compatible with the driver/.test(text), 'Fabric Manager: compatible version, not "exact version"');
    check(/DDR5-6400 at 1 DPC \(5200 at 2 DPC\)/.test(text), 'Xeon 6 memory speed says 1 DPC vs 2 DPC');
    check(!/marked H\+\+/.test(text), 'the unverified "H++" marking is gone');
    check(/IEC 60320 \(Wikipedia\)/.test(got['power-cords'].text) && /NVIDIA HGX/.test(got['gpu-forms-hgx'].text), 'reference cards cite their spec pages');
    await ctx.close();
  }

  // 2i. Kubernetes and GPU-container sheets: every command, recipe and Pro Tip sourced; corrections;
  // no sudo (root badges instead); drain/cordon still flagged.
  {
    const PAGES = ['docker-gpu-daemon', 'k8s-kubectl', 'k8s-workloads', 'k8s-troubleshoot', 'k8s-nodes', 'k8s-gpu'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    const got = {};
    let text = '';
    const boxes = [];
    for (const f of PAGES) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(500);
      for (const l of await lines(p)) if (!/-flags-card$/.test(l.id)) got[l.id] = l;
      text += await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('.cmd-source').forEach(n => n.remove()); return c.textContent; }) + '\n';
      boxes.push(...await p.evaluate(() => [...document.querySelectorAll('.cmd-item[data-cmd-id]')].map(it => {
        const b = it.querySelector('.cmd-code-box');
        return { id: it.dataset.cmdId, code: b ? (b.dataset.cmd || b.dataset.copy || b.innerText) : '', root: !!it.querySelector('.priv-tag.priv-root'), danger: !!(b && /Changes state/.test(b.getAttribute('aria-label') || '')) };
      })));
    }
    const list = Object.values(got);
    check(list.length === 96 && list.every(l => l.text), `all 96 Kubernetes/GPU-container entries show a source line (${list.filter(l => l.text).length}/${list.length})`);
    check(!list.some(l => /is-unverified/.test(l.cls)), 'none of them is unverified');
    check(!boxes.some(b => /(^|[\s;(|&$])sudo\s/.test(b.code)), 'no command on these sheets uses sudo');
    const all = (re, key) => boxes.filter(b => re.test(b.code)).length > 0 && boxes.filter(b => re.test(b.code)).every(b => b[key]);
    check(all(/^nvidia-ctk runtime configure/, 'root') && all(/^crictl /, 'root'), 'nvidia-ctk configure and crictl carry the root badge');
    check(all(/^kubectl (drain|cordon|uncordon) /, 'danger') && all(/^nvidia-ctk runtime configure/, 'danger'), 'drain/cordon/uncordon and nvidia-ctk configure are flagged as changing state');
    check(!/\/etc\/cdi\/nvidia\.yaml/.test(text) && /nvidia-cdi-refresh/.test(text), 'CDI: /var/run/cdi and nvidia-cdi-refresh, not /etc/cdi');
    check(!/--until now/.test(text) && /--until "\$\(date \+%s\)"/.test(text), 'docker events --until takes a timestamp');
    check(!/1\.37 (refuses|nodes refuse)|required by kubelet 1\.37/.test(text), 'no unsupported "kubelet 1.37 refuses cgroup v1"');
    check(!/no requests are the first to be evicted/.test(text), 'eviction order matches the kubelet docs');
    check(!/nvidia\.com\/gpu\.present/.test(text) && /pci-10de\.present=true/.test(text), 'GPU nodes found by the documented pci-10de label');
    await ctx.close();
  }

  // 2j. Slurm suite (new sheets, written sourced): every entry has a source; state changes are
  // flagged and carry the Slurm admin badge; read-only checks are neither; it sits in the DevOps tab.
  {
    const PAGES = ['slurm-nodes', 'slurm-jobs', 'slurm-gpus'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    const all = [];
    for (const f of PAGES) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(500);
      all.push(...await p.evaluate(() => [...document.querySelectorAll('.cmd-item[data-cmd-id]')].filter(it => !/-flags-card$/.test(it.dataset.cmdId)).map(it => {
        const b = it.querySelector('.cmd-code-box');
        return { id: it.dataset.cmdId, code: b ? (b.dataset.cmd || b.dataset.copy || '') : '', src: !!it.querySelector('.cmd-source:not(.is-unverified)'),
          danger: !!(b && /Changes state/.test(b.getAttribute('aria-label') || '')), admin: !!it.querySelector('.priv-tag.priv-admin') };
      })));
    }
    check(all.length >= 30 && all.every(x => x.src), `every Slurm entry shows a verified source line (${all.filter(x => x.src).length}/${all.length})`);
    const muts = all.filter(x => /^(scontrol (update|reboot|cancel_reboot)|scancel)\b/.test(x.code));
    check(muts.length === 7 && muts.every(x => x.danger), `drain, resume, undrain, reboot, cancel_reboot and scancel are flagged (${muts.filter(x => x.danger).length}/${muts.length})`);
    check(muts.filter(x => /^scontrol/.test(x.code)).every(x => x.admin), 'the scontrol changes carry the Slurm admin badge');
    const reads = all.filter(x => /^(sinfo|squeue|sacct|scontrol (show|ping))\b/.test(x.code));
    check(reads.length >= 10 && !reads.some(x => x.danger), `read-only checks are not flagged (${reads.length})`);
    check(!all.some(x => /squeue -t PD -w/.test(x.code)), 'no squeue -t PD -w (pending jobs have no allocated node)');
    const inTab = await p.evaluate(() => !!document.querySelector('#navgroup-devops .ng-group[data-suite-key="slurm"]'));
    check(inTab, 'Slurm is a group in the DevOps tab');
    await ctx.close();
  }

  // 2k. Parallel filesystems (Lustre, WEKA, BeeGFS, Ceph), written sourced: every entry has a source,
  // the state-changing ones are flagged, the read-only checks are not, and the suite is in Hardware.
  {
    const PAGES = ['pfs-lustre', 'pfs-weka', 'pfs-beegfs', 'pfs-scale', 'pfs-ceph'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    const all = [];
    for (const f of PAGES) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(500);
      all.push(...await p.evaluate(() => [...document.querySelectorAll('.cmd-item[data-cmd-id]')].filter(it => !/-flags-card$/.test(it.dataset.cmdId)).map(it => {
        const b = it.querySelector('.cmd-code-box');
        return { id: it.dataset.cmdId, code: b ? (b.dataset.cmd || b.dataset.copy || '') : '', src: !!it.querySelector('.cmd-source'),
          verified: !!it.querySelector('.cmd-source:not(.is-unverified)'), danger: !!(b && /Changes state/.test(b.getAttribute('aria-label') || '')), root: !!it.querySelector('.priv-tag.priv-root') };
      })));
    }
    check(all.length >= 60 && all.every(x => x.verified), `every parallel-filesystem entry shows a verified source line (${all.filter(x => x.verified).length}/${all.length})`);
    const muts = all.filter(x => /^(umount|lfs setstripe|ceph osd (set|unset|out)|ceph crash archive-all|weka cluster drive deactivate|mmchdisk|mmshutdown|mmstartup|mmumount)\b/.test(x.code));
    check(muts.length === 11 && muts.every(x => x.danger), `umount, setstripe, noout, osd out, crash archive, drive deactivate and the Storage Scale changes are flagged (${muts.filter(x => x.danger).length}/${muts.length})`);
    check(all.filter(x => /^mm(getstate|health|lsnsd|lscluster|chdisk|shutdown|startup|umount)\b/.test(x.code)).every(x => x.root), 'Storage Scale admin commands carry the root badge');
    const reads = all.filter(x => /^(lfs (check|df|osts|getstripe|find)|lctl (dl|ping|get_param)|lnetctl|weka (status|alerts|cluster (container|drive|process|server)|local|events|fs)|beegfs(-ctl --(list|getentry)|-df|-net|-check-servers| (health|target list|node list))|ceph (-s|health detail|df|osd (tree|stat|df)|pg stat|device|orch (ps|host ls|device ls)|crash (ls-new|info))|rados list-|mm(getstate|health|lsdisk|df|lsnsd|lsmount|lscluster))/.test(x.code) && !/(deactivate)/.test(x.code));
    check(reads.length >= 50 && !reads.some(x => x.danger), `read-only checks are not flagged (${reads.length}; flagged: ${reads.filter(x => x.danger).map(x => x.code).join(' | ') || 'none'})`);
    check(!all.some(x => /weka cluster (host|nodes)\b|events list-local|ceph osd df tree|lnetctl ping|mmhealth node show -v\b/.test(x.code)), 'no retired or undocumented forms (weka cluster host/nodes, events list-local, ceph osd df tree, lnetctl ping, mmhealth -v)');
    check(await p.evaluate(() => !!document.querySelector('#navgroup-hw .ng-group[data-suite-key="pfs"]')), 'Parallel filesystems is a group in the Hardware tab');
    await ctx.close();
  }

  // 2l. The rest of the Linux sheets (files, permissions, text, processes, network, archives, systemd,
  // users, packages): all sourced, so every card on the Linux hub has a source; corrections; the
  // package, service, firewall and permission changes are flagged; reading /etc/passwd is not.
  {
    const PAGES = ['files', 'permissions', 'text', 'processes', 'network', 'archives', 'systemd', 'users', 'packages'];
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    const all = [];
    let text = '';
    for (const f of PAGES) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(400);
      text += await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('.cmd-source').forEach(n => n.remove()); return c.textContent; });
      all.push(...await p.evaluate(() => [...document.querySelectorAll('.cmd-item[data-cmd-id]')].filter(it => !/-flags-card$/.test(it.dataset.cmdId)).map(it => ({ id: it.dataset.cmdId, src: !!it.querySelector('.cmd-source:not(.is-unverified)') }))));
    }
    check(all.length >= 25 && all.every(x => x.src), `every remaining Linux command shows a verified source (${all.filter(x => x.src).length}/${all.length})`);
    await p.goto(BASE + 'linux.html', { waitUntil: 'load' });
    await p.waitForTimeout(700);
    const hub = await p.evaluate(() => { const items = [...document.querySelectorAll('.cmd-item[data-id]')]; return { n: items.length, src: items.filter(it => it.querySelector('.cmd-source')).length }; });
    check(hub.n >= 50 && hub.src === hub.n, `every card on the Linux hub has a source line (${hub.src}/${hub.n})`);
    check(!/single rename syscall|defaults to \/bin\/sh|5x faster than gzip|faillog -a/.test(text) && /mv -T \/srv\/current\.tmp \/srv\/current/.test(text), 'corrections: no atomic-ln or /bin/sh-default claim, atomic switch recipe present');
    // DANGER_RE is private to common.js: read the flag the page draws on a code box instead.
    const danger = {};
    for (const [f, re] of [['systemd', /^systemctl --failed && systemctl enable --now/], ['packages', /^apt update && apt full-upgrade/], ['network', /ufw allow from/], ['permissions', /^chown -R/], ['systemd', /journalctl --disk-usage && journalctl --vacuum-size/], ['text', /^column -t -s ':' \/etc\/passwd/]]) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(400);
      danger[re.source] = await p.evaluate((src) => { const rx = new RegExp(src); const b = [...document.querySelectorAll('.cmd-code-box, .subcmd-row')].find(x => rx.test((x.dataset.cmd || x.dataset.copy || x.dataset.subcmd || x.textContent).trim())); return b ? /Changes state/.test(b.getAttribute('aria-label') || '') : null; }, re.source);
    }
    const vals = Object.entries(danger);
    check(vals.slice(0, 5).every(([, v]) => v === true), `systemctl enable, apt full-upgrade, ufw allow, chown -R and journalctl --vacuum are flagged (${vals.slice(0, 5).map(([, v]) => v).join(', ')})`);
    check(vals[5][1] === false, 'reading /etc/passwd (column) is not flagged');
    await ctx.close();
  }

  // 2m. CLI tools (47 tool sheets + the hub): every card sourced (recipes, pipelines and tip cards
  // too), the corrections, and the new state-change flags; read-only ip/sysctl/efibootmgr stay plain.
  {
    // Load the tool list the way the generator does: a sandbox with a stub localStorage.
    const w = { localStorage: { getItem: () => null } };
    require('vm').runInNewContext(fs.readFileSync(path.join(ROOT, 'cli-tools.js'), 'utf8').split('const searchInput =')[0] + ';D = CLI_TOOLS_DATA;', w);
    const PAGES = w.D.map(t => t.id);
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    const all = [];
    const rows = [];
    let text = '';
    for (const f of PAGES) {
      await p.goto(BASE + f + '.html', { waitUntil: 'load' });
      await p.waitForTimeout(250);
      text += await p.evaluate(() => { const c = document.body.cloneNode(true); c.querySelectorAll('.cmd-source').forEach(n => n.remove()); return c.textContent; });
      all.push(...await p.evaluate(() => [...document.querySelectorAll('.cmd-item[data-cmd-id]')].filter(it => !/-flags-card$/.test(it.dataset.cmdId)).map(it => {
        const b = it.querySelector('.cmd-code-box');
        return { id: it.dataset.cmdId, code: b ? (b.dataset.cmd || b.dataset.copy || '').trim() : '', src: !!it.querySelector('.cmd-source:not(.is-unverified)'), danger: !!(b && /Changes state/.test(b.getAttribute('aria-label') || '')), ref: !!(b && b.classList.contains('is-reference')) };
      })));
      // Multi-command tools keep their recipes as rows inside the card.
      rows.push(...await p.evaluate(() => [...document.querySelectorAll('.subcmd-row')].map(r => ({ code: (r.dataset.copy || r.dataset.subcmd || '').trim(), danger: /Changes state/.test(r.getAttribute('aria-label') || '') }))));
    }
    check(all.length >= 190 && all.every(x => x.src), `every card on the 47 CLI tool sheets shows a verified source (${all.filter(x => x.src).length}/${all.length})`);
    await p.goto(BASE + 'cli-tools.html', { waitUntil: 'load' });
    await p.waitForTimeout(700);
    const hub = await p.evaluate(() => { const items = [...document.querySelectorAll('.cmd-item:is([data-id],[data-cmd-id])')]; return { n: items.length, src: items.filter(it => it.querySelector('.cmd-source')).length }; });
    check(hub.n >= 60 && hub.src === hub.n, `every command on the CLI tools hub has a source line (${hub.src}/${hub.n})`);
    check(!/-P 0 for all CPU cores|logical CPU cores|reget -P|tio -L\b|-d=permanent|neigh flush all|5x–10x|exact binary name and signal|Run with sudo when/.test(text), 'corrections: xargs -P 0, zstd -T0, sftp reget, tio -l, watch --differences, ip neigh flush, unsourced claims');
    check(all.some(x => x.code === "efibootmgr -c -d /dev/nvme0n1 -p 1 -L 'Ubuntu' -l '\\EFI\\ubuntu\\shimx64.efi'"), 'efibootmgr loader path renders with single backslashes');
    const byCode = re => [...all, ...rows].filter(x => re.test(x.code));
    check(byCode(/^efibootmgr -n 0004 && reboot/).every(x => x.ref), 'efibootmgr -n … && reboot is reference-only (it reboots this machine)');
    const flagged = [/^fuser -v -k -TERM/, /^efibootmgr -c /, /^sysctl -w /, /^sysctl --system/, /^udevadm control --reload-rules && udevadm trigger/, /^ip -6 neigh flush dev/, /^ip -6 addr add/, /^: > \/proc\//];
    const fl = flagged.map(re => [re.source, byCode(re)]);
    fl.filter(([, l]) => !(l.length && l.every(x => x.danger))).forEach(([re, l]) => console.log(`     not flagged or missing: ${re} (${l.map(x => x.code.slice(0, 60)).join(' | ') || 'no card'})`));
    check(fl.every(([, l]) => l.length && l.every(x => x.danger)), `fuser -k, efibootmgr changes, sysctl writes, udevadm trigger, ip add/flush and /proc fd truncation are flagged (${fl.filter(([, l]) => l.length && l.every(x => x.danger)).length}/${fl.length})`);
    const plain = [/^efibootmgr -v$/, /^sysctl -a /, /^ip -c -br link show/, /^ip -6 route get/, /^udevadm monitor/, /^watch -n 1 -d/];
    const pl = plain.map(re => byCode(re)).flat();
    check(pl.length >= 6 && !pl.some(x => x.danger), `read-only efibootmgr -v, sysctl -a, ip show/route get, udevadm monitor and watch are not flagged (${pl.filter(x => !x.danger).length}/${pl.length})`);
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
