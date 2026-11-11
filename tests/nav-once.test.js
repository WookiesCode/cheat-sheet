// #9: the top nav is stored once (nav/nav-source.html → nav.js) instead of in every page.
// Pages ship a small fallback nav; nav.js swaps in the full menus right after </nav>, so they
// are there before DOMContentLoaded (and before common.js reads them), over http and file://,
// and match the source link for link. Without JavaScript the fallback still reaches every tab.
const fs = require('fs');
const path = require('path');
const { ROOT, BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };
const NAV = /<nav class="sheet-switcher" aria-label="Switch cheat sheet">([\s\S]*?)\n\s*<\/nav>/;

(async () => {
  // 1. On disk: one full copy; every page carries only the fallback plus the script.
  const source = fs.readFileSync(path.join(ROOT, 'nav/nav-source.html'), 'utf8').match(NAV)[1];
  const pages = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && !['datacenter-cheatsheet-portable.html', 'omarchy.html'].includes(f));
  const big = [], noScript = [];
  for (const f of pages) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const m = html.match(NAV);
    if (!m) continue;
    if (m[1].length > 10000 || /ng-group|nav-dropdown-menu/.test(m[1])) big.push(f);
    if (!/^\s*<script src="nav\.js\?v=[0-9a-f]+"><\/script>/.test(html.slice(m.index + m[0].length))) noScript.push(f);
  }
  check(big.length === 0, `no page carries the full menus in its HTML (${big.slice(0, 5).join(', ') || 'none'})`);
  check(noScript.length === 0, `every page loads nav.js (hash-stamped) right after its nav (${noScript.slice(0, 5).join(', ') || 'none'})`);
  check(/ng-group/.test(source) && source.length > 100000, `nav/nav-source.html holds the full nav (${(source.length / 1024).toFixed(0)} KB)`);

  const browser = await launch();
  const expect = { groups: (source.match(/class="ng-group"/g) || []).length, items: (source.match(/class="dropdown-item[ "]/g) || []).length };
  // Record the nav at DOMContentLoaded, before any later script could have filled it.
  const atDcl = () => document.addEventListener('DOMContentLoaded', () => {
    window.__navAtDcl = { groups: document.querySelectorAll('nav.sheet-switcher .ng-group').length, items: document.querySelectorAll('nav.sheet-switcher .dropdown-item').length };
  });

  // 2. Over http and file://: full menus at DOMContentLoaded, same links as the source.
  for (const [name, url] of [['http index', BASE + 'index.html'], ['http nv-smi', BASE + 'nvidia.html#nv-smi'], ['http k8s-gpu', BASE + 'containers.html#k8s-gpu'],
                             ['http linux hub', BASE + 'linux.html'], ['file:// nv-smi', 'file://' + path.join(ROOT, 'nvidia.html#nv-smi')]]) {
    const ctx = await newContext(browser);
    await ctx.addInitScript(atDcl);
    const p = await ctx.newPage();
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await p.goto(url, { waitUntil: 'load' });
    await p.waitForTimeout(400);
    const r = await p.evaluate((src) => {
      const hrefs = el => [...el.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).join(' ');
      const tpl = document.createElement('div'); tpl.innerHTML = src;
      const nav = document.querySelector('nav.sheet-switcher');
      return { dcl: window.__navAtDcl, same: hrefs(nav) === hrefs(tpl), rail: document.querySelectorAll('[data-suite-name]').length };
    }, source);
    check(r.dcl && r.dcl.groups === expect.groups && r.dcl.items === expect.items,
      `${name}: full menus already in place at DOMContentLoaded (${r.dcl ? r.dcl.groups : '?'}/${expect.groups} groups, ${r.dcl ? r.dcl.items : '?'}/${expect.items} items)`);
    check(r.same, `${name}: every nav link matches nav/nav-source.html, in order`);
    check(errs.length === 0, `${name}: no page errors${errs.length ? ' · ' + errs[0] : ''}`);
    await ctx.close();
  }

  // 3. The injected drop-downs are live: hovering a tab opens its menu.
  {
    const ctx = await newContext(browser);
    const p = await ctx.newPage();
    await p.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    await p.waitForTimeout(400);
    await p.hover('#navgroup-hw > .dropdown-toggle');
    await p.waitForTimeout(300);
    const shown = await p.evaluate(() => { const m = document.querySelector('#navgroup-hw .nav-dropdown-menu'); return !!m && getComputedStyle(m).visibility !== 'hidden' && getComputedStyle(m).display !== 'none' && m.getBoundingClientRect().height > 0; });
    check(shown, 'hovering the Hardware tab opens its menu');
    await ctx.close();
  }

  // 4. JavaScript off: the fallback row still links Home, the Workbench and every tab's hub.
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    await p.goto(BASE + 'nvidia.html#nv-smi', { waitUntil: 'load' });
    const links = await p.evaluate(() => [...document.querySelectorAll('nav.sheet-switcher > a, nav.sheet-switcher > .nav-dropdown > a')].map(a => a.getAttribute('href')));
    const want = ['index.html', 'tools.html', 'linux.html', 'editors.html', 'infiniband.html', 'redfish.html', 'motherboards.html', 'containers.html', 'jira.html'];
    check(want.every(h => links.includes(h)), `without JavaScript the fallback links Home, Workbench and each tab hub (${links.length} links)`);
    await ctx.close();
  }

  await browser.close();
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
