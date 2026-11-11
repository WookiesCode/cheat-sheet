// The symptom decoder on real log lines, pasted into the home page's "What's broken?" box.
// Each case names the card it must produce (title pattern, severity), or is a known gap that must
// still show Closest matches. When a gap gets a decoder entry, give its line a title here.
// The two lines first written by hand (mlx5, kubelet) now carry the real kernel / kubelet wording.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

// [line, expected title (RegExp) or null for "no decoder card", severity, extra checks]
const CASES = [
  // NVSwitch SXids, classified from the Fabric Manager guide's tables 22-25.
  ['nvidia-nvswitch0: SXid (PCI:0000:05:00.0): 12028, Non-fatal, Link 32 egress non-posted PRIV error', /^SXid 12028 \(non-fatal\) — Link 32 egress/, 'warn', { src: /Fabric Manager/, not: /fabric not ready/i }],
  ['nvidia-nvswitch2: SXid (PCI:0000:07:00.0): 20034, Fatal, Link 30 LTSSM Fault Up', /^SXid 20034 \(fatal\)/, 'crit', { steps: /nvlink -s/ }],
  ['nvidia-nvswitch1: SXid (PCI:0000:06:00.0): 22003, Fatal, Minion Halt', /^SXid 22003 \(always fatal\)/, 'crit'],
  ['nvidia-nvswitch1: SXid (PCI:0000:06:00.0): 19049, Non-fatal, Link 12 single bit ECC error', /^SXid 19049 \(non-fatal\)/, 'info', { meaning: /corrects it/ }],
  ['nvidia-nvswitch1: SXid (PCI:0000:06:00.0): 22013, Non-fatal, Link 4 Minion Link DLREQ interrupt', /^SXid 22013 \(non-fatal\)/, 'info', { meaning: /safely ignored/ }],
  ['nvidia-nvswitch3: SXid (PCI:0000:08:00.0): 10004, Non-fatal, Host_thermal_event_start', /^SXid 10004 \(notable\)/, 'warn'],
  // A code the tables don't list: the line's own word sets the severity.
  ['nvidia-nvswitch1: SXid (PCI:0000:06:00.0): 99999, Fatal, Link 3 something new', /^SXid 99999 \(not in the guide's tables\)/, 'crit'],
  // Fabric Manager without an SXid number keeps the fabric-not-ready card.
  ['nvidia-fabricmanager: request to query NVSwitch device information from NVSwitch driver failed', /fabric not ready/i, 'crit'],

  // The review corpus (IMPROVEMENTS.md, review round 2): lines a technician pastes on a real shift.
  // GPU
  ['NVRM: Xid (PCI:0000:8a:00): 79, pid=1234, name=python, GPU has fallen off the bus.', /^Xid 79 — GPU has fallen off the bus/, 'crit', { steps: /lspci -vvv -s 0000:8a:00/ }],
  ['NVRM: GPU 0000:8a:00.0: GPU has fallen off the bus.', /^Xid 79/, 'crit'],
  ['NVRM: Xid (PCI:0000:8a:00): 48, pid=1234, name=python, An uncorrectable double bit error (DBE) has been detected on GPU in the framebuffer', /^Xid 48 — Double-bit ECC/, 'crit'],
  // Codes from NVIDIA's Xid catalog for H200 / B200 (with a catalog source line).
  ['NVRM: Xid (PCI:0000:8a:00): 140, pid=1234, name=python, ECC unrecovered error', /^Xid 140 — ECC unrecovered error/, 'crit', { src: /Xid catalog/, steps: /nvidia-bug-report\.sh/ }],
  ['NVRM: Xid (PCI:0000:8a:00): 137, pid=1234, name=python, NVLink privilege error', /^Xid 137 — NVLink privilege error/, 'warn', { meaning: /application-level bug/ }],
  ['NVRM: Xid (PCI:0000:8a:00): 165, Power Smoothing HW Circuitry lifetime exhausted', /^Xid 165 — Power smoothing lifetime exhausted/, 'warn'],
  ['NVRM: Xid (PCI:0000:8a:00): 171, uncorrectable DRAM error', /^Xid 171 — Uncorrectable DRAM error/, 'crit'],
  ['NVRM: Xid (PCI:0000:8a:00): 167, PCIE_FATAL_TIMEOUT', /^Xid 167 — PCIe fatal timeout/, 'crit', { steps: /LnkSta/ }],
  // NVLink5 (144-150): the line's own fatal / nonfatal word sets the severity. The shape follows the
  // catalog's message format; the field values are placeholders.
  ['NVRM: Xid (PCI:0000:8a:00): 145, RLW Fatal XC0 i0 Link 12 (0x00000000 0x00000000 0x0 0x0 0x0 0x0 0x0)', /^Xid 145 — NVLink RLW error/, 'crit', { meaning: /intrInfo/, steps: /nvlink -e/ }],
  ['NVRM: Xid (PCI:0000:8a:00): 145, RLW Nonfatal XC0 i0 Link 12 (0x00000000 0x00000000 0x0 0x0 0x0 0x0 0x0)', /^Xid 145 — NVLink RLW error/, 'warn'],
  // A code still missing from the table says so instead of guessing.
  ['NVRM: Xid (PCI:0000:8a:00): 199, pid=1234, name=python', /^Xid 199 — Not in the local decoder table/, 'warn'],
  // Memory, CPU, PCIe
  ['EDAC MC0: 1 CE memory read error on CPU_SrcID#0_MC#0_Chan#1_DIMM#0', /^Correctable DRAM error/, 'warn'],
  ['mce: [Hardware Error]: Machine check events logged', /machine check/i, 'crit'],
  ['pcieport 0000:00:01.1: AER: Corrected error message received from 0000:41:00.0', /^PCIe corrected \(AER\)/, 'warn'],
  // Storage
  ['nvme nvme0: I/O 123 QID 4 timeout, aborting', /^NVMe drive timeout/, 'crit'],
  ['blk_update_request: I/O error, dev sda, sector 123456 op 0x0:(READ)', /^Block device I\/O error/, 'crit'],
  // Network
  ['mlx5_core 0000:41:00.0 ib0: Link down', /^InfiniBand link down/, 'warn'],
  // BMC SEL (ipmitool sel elist rows)
  ['  12 | 11/10/2026 | 14:02:11 | Memory #0x87 | Correctable ECC | Asserted', /^Correctable DRAM error/, 'warn'],
  ['  13 | 11/10/2026 | 14:05:00 | Power Supply PSU2 | Power Supply AC lost | Asserted', /^Power supply fault/, 'crit'],
  ['  14 | 11/10/2026 | 14:06:00 | Fan FAN3 | Lower Critical going low | Asserted', /fan fault/i, 'warn'],
  // Workload
  ['Out of memory: Killed process 4321 (python) total-vm:123456kB', /OOM killer/, 'info'],

  // Former gaps, decoded since R9 (each card cites the source of its message).
  ['mlx5_core 0000:41:00.0: mlx5_crdump_collect:50:(pid 812): crdump: failed to lock vsc gw err -16', /^ConnectX firmware fatal error/, 'crit', { src: /mlx5 devlink/, steps: /devlink health show pci\/0000:41:00\.0 reporter fw_fatal/ }],
  ['mlx5_core 0000:41:00.0: mlx5_health_try_recover:330:(pid 812): Fatal error 3 detected', /^ConnectX firmware fatal error/, 'crit'],
  ['kernel: watchdog: BUG: soft lockup - CPU#12 stuck for 22s! [kworker/12:1:4321]', /^CPU lockup/, 'crit', { src: /lockup detectors/ }],
  ['NMI watchdog: Watchdog detected hard LOCKUP on cpu 7', /^CPU lockup/, 'crit'],
  ['XFS (nvme0n1p1): Corruption detected. Unmount and run xfs_repair', /^XFS metadata corruption/, 'crit', { steps: /nvme smart-log \/dev\/nvme0n1/, src: /xfs_repair/ }],
  ['slurmd: error: Node configuration differs from hardware: CPUs=128:256(hw) Boards=1:1(hw) SocketsPerBoard=2:2(hw) CoresPerSocket=32:64(hw) ThreadsPerCore=2:2(hw)', /^Slurm node config differs/, 'warn', { steps: /slurmd -C/ }],
  ['Warning  UnexpectedAdmissionError  pod/train-0  Allocate failed due to requested number of devices unavailable for nvidia.com/gpu. Requested: 1, Available: 0, which is unexpected', /^Kubelet could not hand out the GPUs/, 'warn'],
  ["Couldn't connect to 10.0.0.2:18515", /^perftest client could not reach the server/, 'info'],
  ['pcieport 0000:00:03.1: pciehp: Slot(4): Cannot train link: status 0x2001', /^PCIe link failed to train/, 'crit', { src: /pciehp/ }],
  ['Retimer (PCIe) link training failure', /^PCIe link failed to train/, 'crit'],
  ['Port 1/1/3 Symbol Errors: 1534', /^InfiniBand link down, flapping or erroring/, 'warn'],
  // Still not decoded on purpose: a line naming no known failure must not grab a card, and search
  // still offers Closest matches.
  ['slurmstepd: task/cgroup: _memcg_initialize: job: alloc=8192MB mem.limit=8192MB', null, null, { closest: true }],
];

// The dmesg greps that collect SXids must match a real line (the switch number sits before the
// colon: "nvidia-nvswitch0: SXid"). GNU ERE and JS regex agree on | [0-9] and *, so test it here.
const SXID_LINE = 'nvidia-nvswitch0: SXid (PCI:0000:05:00.0): 12028, Non-fatal, Link 32 egress non-posted PRIV error';
for (const f of ['nvidia.js', 'common.js', 'docs/playbooks/gpu-nvlink.md']) {
  const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
  const greps = [...text.matchAll(/grep -E (?:-i )?["']([^"']*SXid[^"']*)["']/g)].map(m => m[1]);
  check(greps.length > 0, `${f} has an SXid grep`);
  for (const g of greps) check(new RegExp(g, 'i').test(SXID_LINE), `${f}: grep -E '${g.slice(0, 40)}…' matches a real SXid line`);
}

(async () => {
  const browser = await launch();
  const ctx = await newContext(browser);
  await ctx.addInitScript(() => { try { localStorage.setItem('dc_tour_seen', '99'); } catch (e) {} });
  const p = await ctx.newPage();
  p.on('pageerror', e => check(false, 'page error: ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'load' });
  await p.waitForTimeout(1000);

  for (const [line, title, sev, extra = {}] of CASES) {
    await p.fill('#lp-omni-input', line);
    await p.press('#lp-omni-input', 'Enter');
    await p.waitForTimeout(500);
    const card = await p.evaluate(() => {
      const c = document.querySelector('.decoder-card');
      if (!c) return null;
      return {
        title: c.querySelector('.decoder-title').textContent,
        sev: (c.className.match(/sev-(\w+)/) || [])[1],
        meaning: (c.querySelector('.decoder-meaning') || {}).textContent || '',
        src: (c.querySelector('.decoder-src') || {}).textContent || '',
        steps: [...c.querySelectorAll('.decoder-steps code')].map(e => e.textContent).join(' ;; ')
      };
    });
    const loose = await p.evaluate(() => ({ closest: !!document.querySelector('.palette-closest'), n: document.querySelectorAll('.palette-item[data-cmd]').length }));
    const short = line.length > 60 ? line.slice(0, 60) + '…' : line;
    if (title === null) {
      check(!card, `"${short}" is not decoded (known gap)`);
      if (extra.closest) check(loose.closest && loose.n > 0, `…but shows ${loose.n} closest matches, not a dead end`);
    } else if (!card) {
      check(false, `"${short}" decodes (no card)`);
    } else {
      check(title.test(card.title) && card.sev === sev, `"${short}" → ${card.title} [${card.sev}]`);
      // Steps are read-only: a reset, reboot or module unload is only ever described in "Then".
      const intrusive = card.steps.match(/nvidia-smi[^;]*\s(-r|--gpu-reset)\b|\breboot\b|\brmmod\b|modprobe -r|chassis power/);
      if (intrusive) check(false, `…offers an intrusive step: ${intrusive[0]}`);
      if (extra.src) check(extra.src.test(card.src), `…cites ${card.src}`);
      if (extra.not) check(!extra.not.test(card.title), '…is not the generic fabric card');
      if (extra.steps) check(extra.steps.test(card.steps), `…offers ${extra.steps}`);
      if (extra.meaning) check(extra.meaning.test(card.meaning), `…says ${extra.meaning}`);
    }
    await p.keyboard.press('Escape');
    await p.waitForTimeout(150);
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
