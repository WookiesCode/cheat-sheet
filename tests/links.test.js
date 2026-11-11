// Every link inside the site still goes somewhere after pages or parts are removed:
// 1. Static: each "<page>.html" or "<page>.html#<part>" written in the sources names a page
//    that exists and a part its menu (or a card id) still has; old single-sheet names
//    (nv-pcie.html) are fine when the menu has that part. The redirect table points at live parts.
// 2. Browser: recent sheets saved before a removal are left off the home page's Recent list,
//    on the site and in the portable file.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');

// File names in commands and examples, not links: powercfg's report, pandoc output, placeholders.
const NOT_LINKS = new Set(['battery.html', 'summary.html', 'page.html', 'group.html', 'x.html', 'e.html', 'l.html']);
// Generated files repeat the sources; IMPROVEMENTS.md is history and names removed pages on purpose.
const GENERATED = new Set(['global-search-index.js', 'flag-index.js', 'man-pages-data.js', 'nav.js', 'datacenter-cheatsheet-portable.html']);

const pages = new Set(fs.readdirSync(ROOT).filter(f => f.endsWith('.html')));
const nav = read('nav.js').replace(/\\"/g, '"');
const parts = new Map();   // page -> its menu parts
for (const [, page, part] of nav.matchAll(/href="([\w-]+\.html)#([\w-]+)"/g)) {
  if (!parts.has(page)) parts.set(page, new Set());
  parts.get(page).add(part);
}
const allParts = new Set([...parts.values()].flatMap(s => [...s]));
const jsFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.js') && !GENERATED.has(f));
const ids = new Set();
for (const f of jsFiles) for (const [, id] of read(f).matchAll(/["']?id["']?\s*:\s*["']([\w-]+)["']/g)) ids.add(id);
for (const f of pages) for (const [, id] of read(f).matchAll(/\bid="([\w-]+)"/g)) ids.add(id);

const docs = ['README.md', ...fs.readdirSync(path.join(ROOT, 'docs'), { recursive: true }).filter(f => f.endsWith('.md')).map(f => path.join('docs', f))];
const sources = [...jsFiles, ...[...pages].filter(f => !GENERATED.has(f)), 'nav/nav-source.html', ...docs];
const broken = [];
for (const f of sources) {
  const text = read(f);
  for (const m of text.matchAll(/(?<![\w/.-])([a-z0-9][\w-]*\.html)(?:#([\w-]+))?/g)) {
    const [, page, part] = m;
    if (NOT_LINKS.has(page)) continue;
    const ok = pages.has(page)
      ? !part || !parts.has(page) || parts.get(page).has(part) || ids.has(part)
      : !part && allParts.has(page.replace(/\.html$/, ''));
    if (!ok) broken.push(`${f}:${text.slice(0, m.index).split('\n').length} ${m[0]}`);
  }
}
check(broken.length === 0, `every page and part link in ${sources.length} source files resolves${broken.length ? ': ' + broken.slice(0, 8).join(', ') : ''}`);

const merged = JSON.parse(read('tests/merged-pages.json'));
const deadRedirects = Object.entries(merged).filter(([, to]) => {
  const [page, part] = to.split('#');
  return !pages.has(page) || (part && !(parts.get(page) || new Set()).has(part));
});
check(deadRedirects.length === 0, `every old sheet name redirects to a live part${deadRedirects.length ? ': ' + deadRedirects.map(e => e.join(' → ')).join(', ') : ''}`);

(async () => {
  const browser = await launch();
  for (const pg of ['index.html', 'datacenter-cheatsheet-portable.html']) {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    p.on('pageerror', e => check(false, `${pg}: page error ${e.message}`));
    await p.goto(BASE + pg, { waitUntil: 'load' });
    await p.evaluate(() => {
      const now = Date.now();
      localStorage.setItem('dc_recent_sheets', JSON.stringify([
        { file: 'pfs.html', name: 'Parallel filesystems', t: now },
        { file: 'bmc-tools.html#racadm', name: 'BMC tools · racadm', t: now - 1 },
        { file: 'linux.html', name: 'Linux', t: now - 2 },
        { file: 'bmc-tools.html#serial-console', name: 'BMC tools · Serial', t: now - 3 },
        null,
        { file: 'notes.html', name: 'Notes', t: now - 4 }
      ]));
    });
    await p.reload({ waitUntil: 'load' });
    await p.waitForSelector('.lp-recent', { timeout: 5000 }).catch(() => {});
    const shown = await p.evaluate(() => [...document.querySelectorAll('.lp-recent')].map(b => b.dataset.lpGo));
    check(shown.join() === 'linux.html,bmc-tools.html#serial-console,notes.html',
      `${pg}: Recent lists only live sheets and parts (${shown.join(', ')})`);
    await ctx.close();
  }
  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
