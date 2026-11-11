// The symptom decoder on real log lines, pasted into the home page's "What's broken?" box.
// Each case names the card it must produce (title pattern, severity) or that it must not decode.
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
    const short = line.length > 60 ? line.slice(0, 60) + '…' : line;
    if (title === null) {
      check(!card, `"${short}" is not decoded`);
    } else if (!card) {
      check(false, `"${short}" decodes (no card)`);
    } else {
      check(title.test(card.title) && card.sev === sev, `"${short}" → ${card.title} [${card.sev}]`);
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
