// Commands written for the technician never carry a sudo prefix: the site marks root commands
// itself (the ROOT badge, and "# needs root" on copy). Allowed: sheets that teach sudo, and the
// two idioms where sudo is the lesson (sudoedit after a backup, and `| sudo tee` into /sys).
// Every command that lost its sudo still shows a root (or maybe-root) badge.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

// Sheets about sudo, shells and the Linux basics teach the prefix itself.
const TEACHING_SHEETS = /^(sudo|cli-tools|bash|linux)\.html$/;
const IDIOMS = [/^sudo cp -a FILE FILE\.bak\.\$\(date \+%F\) && sudoedit FILE$/, /\|\s*sudo tee \//];

(async () => {
  const w = {};
  new Function('window', fs.readFileSync(path.join(ROOT, 'global-search-index.js'), 'utf8'))(w);
  const offenders = new Set();
  for (const i of w.GLOBAL_SEARCH_INDEX) {
    if (TEACHING_SHEETS.test(i.file) || !/(^|[\s;(|&])sudo\s/.test(i.cmd)) continue;
    if (IDIOMS.some(re => re.test(i.cmd))) continue;
    offenders.add(`${i.file}: ${i.cmd.slice(0, 80)}`);
  }
  check(offenders.size === 0, `no sudo-prefixed command outside the teaching sheets and idioms (${offenders.size}${offenders.size ? ': ' + [...offenders].slice(0, 3).join(' · ') : ''})`);

  // The commands that lost their sudo keep a badge.
  const browser = await launch();
  const ctx = await newContext(browser);
  const p = await ctx.newPage();
  const want = [
    ['bmc-tools.html#freeipmi', /^install -m 600 \/dev\/null \/etc\//, 'root'], ['editors.html#nano', /^(sshd -t|visudo -c|cp -a \/etc\/fstab)/, 'root'],
    ['editors.html#nano', /^findmnt --verify$/, 'maybe'], ['containers.html#docker-images', /^ctr -n k8s\.io/, 'root'], ['bmc-tools.html#serial-console', /^dmesg -T \| grep -i tty$/, 'maybe']
  ];
  for (const [file, re, level] of want) {
    await p.goto(BASE + file, { waitUntil: 'load' });
    await p.waitForTimeout(500);
    const r = await p.evaluate(([src, lvl]) => {
      const rx = new RegExp(src);
      const items = [...document.querySelectorAll('.cmd-item[data-cmd-id]')].filter(it => { const b = it.querySelector('.cmd-code-box'); return b && rx.test((b.dataset.cmd || b.dataset.copy || '').trim()); });
      return { n: items.length, badged: items.filter(it => it.querySelector(`.priv-tag.priv-${lvl}`)).length };
    }, [re.source, level]);
    check(r.n > 0 && r.badged === r.n, `${file}: ${re.source.replace(/\\/g, '')} shows a ${level} badge (${r.badged}/${r.n})`);
  }

  // The built-in tools follow the same rule (2026-11-11): healthy ranges and runbook steps show no sudo,
  // carry the root badge, copy as "# needs root", and run in the terminal as sudo -n on the stages
  // that need root (so a step fails fast instead of hanging on a password prompt).
  const src = fs.readFileSync(path.join(ROOT, 'common.js'), 'utf8');
  const toolSudo = (src.match(/cmd: ['"]sudo |&& sudo [a-z]/g) || []).length;
  check(toolSudo === 0, `no tool command (healthy ranges, runbooks) is stored with sudo (${toolSudo})`);
  await p.goto(BASE + 'nvidia.html', { waitUntil: 'load' });
  await p.waitForTimeout(500);
  const forms = await p.evaluate(() => {
    const C = window.CheatSheetCommon;
    return {
      nvme: C.privRunForm('nvme smart-log /dev/nvme0'),
      pipe: C.privRunForm('lspci -vvv -s 01:00.0 | grep -E "LnkCap:|LnkSta:"'),
      both: C.privRunForm('ras-mc-ctl --summary && ras-mc-ctl --errors'),
      plain: C.privRunForm('nvidia-smi -q'),
      kept: C.privRunForm('sudo dmesg -T'),
      cable: C.privRunForm('ethtool --cable-test eth0'),
      script: C.privRunForm('echo a\necho b'),
      copy: C.privCopy('nvme smart-log /dev/nvme0')
    };
  });
  check(forms.nvme === 'sudo -n nvme smart-log /dev/nvme0' && forms.pipe === 'sudo -n lspci -vvv -s 01:00.0 | grep -E "LnkCap:|LnkSta:"'
    && forms.both === 'sudo -n ras-mc-ctl --summary && sudo -n ras-mc-ctl --errors' && forms.plain === 'nvidia-smi -q' && forms.kept === 'sudo -n dmesg -T'
    && forms.cable === 'sudo -n ethtool --cable-test eth0' && forms.script === 'echo a\necho b',
    `the terminal runs root stages as sudo -n and leaves the rest alone (${JSON.stringify(forms).slice(0, 160)}…)`);
  check(forms.copy === '# needs root\nnvme smart-log /dev/nvme0', 'a root tool command copies with "# needs root" above it, no sudo');
  await p.click('[data-suite-rb="gpu-missing"] >> visible=true', { delay: 120 });
  await p.waitForTimeout(700);
  const rb = await p.evaluate(() => { const c = [...document.querySelectorAll('.rb-cmd, .rb-locked')]; return { n: c.length, sudo: c.filter(x => /\bsudo\b/.test((x.querySelector('code') || {}).textContent || '')).length, root: c.filter(x => x.querySelector('.priv-tag.priv-root')).length }; });
  check(rb.n > 0 && !rb.sudo && rb.root > 0, `the GPU-missing runbook shows no sudo and badges its root steps (${rb.root} of ${rb.n} commands)`);
  // The capture script runs sheet commands (no sudo) the same way: sudo -n on the root stages only.
  await p.keyboard.press('Escape');
  await p.goto(BASE + 'linux.html', { waitUntil: 'load' });
  await p.waitForTimeout(700);
  await p.evaluate(() => { const it = [...document.querySelectorAll('.cmd-item')].find(i => { const b = i.querySelector('.cmd-code-box'); return b && /^nvme list && nvme smart-log/.test((b.dataset.cmd || b.dataset.copy || '').trim()); }); it.querySelector('.bookmark-btn').click(); });
  await p.waitForTimeout(300);
  await p.keyboard.press('s');
  await p.waitForTimeout(600);
  await p.evaluate(() => document.querySelector('[data-kit-act="script"]').click());
  await p.waitForTimeout(800);
  const cs = await p.evaluate(() => [...document.querySelectorAll('.cs-item code')].map(c => c.textContent));
  check(cs.includes('nvme list && sudo -n nvme smart-log /dev/nvme0'), `the capture script runs nvme smart-log as sudo -n and leaves nvme list alone (${cs.join(' | ')})`);
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
