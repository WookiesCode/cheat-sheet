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
    ['bmc-tools.html#supermicro-saa', /^\.\/saa -c /, 'root'], ['bmc-tools.html#onecli', /^\.\/OneCli inventory/, 'root'],
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
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
