// #12 My kit → navi: "Export for navi" downloads a .cheat file that navi itself parses. Each
// starred command comes back out of `navi --best-match --print` exactly as exported, with
// placeholders turned into navi variables (<sm-node> → <sm_node>); multi-line commands are
// left out; state-changing ones are marked in their description. Skips without navi.
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const { BASE, launch, newContext } = require('./lib');

const failures = [];
const check = (ok, what) => { console.log(`${ok ? 'ok  ' : 'FAIL'} ${what}`); if (!ok) failures.push(what); };

(async () => {
  const browser = await launch();
  const ctx = await newContext(browser, { acceptDownloads: true });
  const p = await ctx.newPage();
  await p.goto(BASE + 'k8s-nodes.html', { waitUntil: 'load' });
  await p.waitForTimeout(500);

  // Star four kinds of command: a placeholder with a dash, a state-changing one, a plain one,
  // and a multi-line manifest.
  const picks = await p.evaluate(() => {
    const idx = window.GLOBAL_SEARCH_INDEX.filter(i => !i.noCopy);
    const first = new Map();
    idx.forEach(i => { const k = `${i.file}#${i.id}`; if (!first.has(k)) first.set(k, i); });
    const main = [...first.values()];
    const dash = main.find(i => /<[a-z]+-[a-z-]+>/.test(i.cmd) && !/\n/.test(i.cmd) && !/^[%#;$@]/.test(i.cmd));
    const drain = main.find(i => i.file === 'k8s-nodes.html' && i.id === 'kubectl-cordon-drain');
    const plain = main.find(i => i.file === 'k8s-nodes.html' && i.id === 'kubectl-nodes-wide');
    const multi = main.find(i => i.file === 'k8s-workloads.html' && /\n/.test(i.cmd));
    return { dash, drain, plain, multi };
  });
  check(Object.values(picks).every(Boolean), `found test commands (${Object.values(picks).map(x => x && `${x.file}#${x.id}`).join(', ')})`);
  await p.evaluate((ps) => {
    const by = {};
    Object.values(ps).forEach(i => { const k = `${i.file.replace(/\.html$/, '')}_bookmarks`; (by[k] = by[k] || []).push(i.id); });
    Object.entries(by).forEach(([k, ids]) => localStorage.setItem(k, JSON.stringify(ids)));
  }, picks);
  await p.reload({ waitUntil: 'load' });
  await p.waitForTimeout(500);

  await p.keyboard.press('s');
  await p.waitForSelector('[data-kit-act="navi"]');
  const [dl] = await Promise.all([p.waitForEvent('download'), p.click('[data-kit-act="navi"]')]);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-navi-'));
  const file = path.join(dir, dl.suggestedFilename());
  await dl.saveAs(file);
  const text = fs.readFileSync(file, 'utf8');
  const toast = await p.evaluate(() => (document.getElementById('toast-text') || {}).textContent || '');
  check(dl.suggestedFilename() === 'my-kit.cheat', `downloads my-kit.cheat (${dl.suggestedFilename()})`);
  check(/^% k8s-nodes, cheat-sheet$/m.test(text) && /^# /m.test(text), 'the file has a % tag line per sheet and # descriptions');
  const dashOut = picks.dash.cmd.split('   |   ')[0].trim().replace(/<[^<>\s][^<>]*>/g, m => `<${m.slice(1, -1).replace(/[^A-Za-z0-9_]+/g, '_').replace(/^_+|_+$/g, '')}>`);
  check(text.includes(dashOut) && !/<[^<>\s]*-[^<>\s]*>/.test(text.split('\n').filter(l => !/^[;#%]/.test(l)).join('\n')), `placeholders become navi variables (${dashOut})`);
  check(/\[changes state: drain and get approval first\]\nkubectl drain /.test(text), 'kubectl drain is marked as changing state');
  check(!/apiVersion:/.test(text), 'the multi-line manifest is left out');
  check(/Saved my-kit\.cheat \(3 commands; left out 1 multi-line\)/.test(toast), `the toast counts what was exported and left out (${toast.slice(0, 90)})`);
  await browser.close();

  // navi parses it: search for each description, get the command back unchanged. The query is
  // the first few words: navi truncates the description column it matches against.
  let navi = '';
  try { navi = execFileSync('navi', ['--version'], { encoding: 'utf8' }).trim(); } catch (e) { navi = ''; }
  if (!navi) {
    console.log('skip navi is not installed: the file was checked against the syntax rules only');
  } else {
    const entries = [];
    const lines = text.split('\n');
    lines.forEach((l, i) => { if (l.startsWith('# ')) entries.push({ desc: l.slice(2), cmd: lines[i + 1] }); });
    let good = 0;
    for (const e of entries) {
      const query = e.desc.split(' ').slice(0, 4).join(' ');
      const out = execFileSync('navi', ['--path', dir, '--query', query, '--best-match', '--print', '--prevent-interpolation'], { encoding: 'utf8' }).trim();
      if (out === e.cmd) good++; else console.log(`     navi printed: ${out}\n     expected:     ${e.cmd}`);
    }
    check(entries.length === 3 && good === entries.length, `${navi} parses the file: ${good}/${entries.length} commands come back exactly as exported`);
  }
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(failures.length ? `${failures.length} check(s) failed` : 'all checks passed');
  process.exit(failures.length ? 1 : 0);
})();
