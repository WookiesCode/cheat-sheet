// The counts in README.md and docs/site.md (written by build-index.js) match what the home page
// shows live, so the two copies of the counting rule can't drift apart. Run after build-all.js.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const RE = /<!-- counts -->(\d+) pages, (\d+) of them command sheets with ([\d,]+) commands<!-- \/counts -->/;

(async () => {
  const docs = {};
  for (const doc of ['README.md', path.join('docs', 'site.md')]) {
    const m = fs.readFileSync(path.join(ROOT, doc), 'utf8').match(RE);
    check(!!m, `${doc} has a filled <!-- counts --> block`);
    if (m) docs[doc] = { pages: +m[1], sheets: +m[2], commands: m[3] };
  }

  // Redirect stubs (old pages merged into a group page) are not pages of their own.
  const { isStub } = require(path.join(ROOT, 'build-redirect-stub.js'));
  const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'datacenter-cheatsheet-portable.html' && !isStub(fs.readFileSync(path.join(ROOT, f), 'utf8'))).length;
  const browser = await launch();
  const ctx = await newContext(browser);
  const p = await ctx.newPage();
  await p.goto(BASE + 'index.html', { waitUntil: 'load' });
  await p.waitForTimeout(800);
  const hero = (await p.locator('body').innerText()).match(/([\d,]+) commands across (\d+) sheets/);
  check(!!hero, `home page shows "N commands across M sheets"${hero ? ` (${hero[0]})` : ''}`);
  await browser.close();

  for (const [doc, d] of Object.entries(docs)) {
    check(d.pages === pages, `${doc}: ${d.pages} pages = ${pages} .html pages (redirects not counted)`);
    if (hero) check(d.commands === hero[1] && d.sheets === +hero[2], `${doc}: ${d.sheets} sheets / ${d.commands} commands = home page`);
  }
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
