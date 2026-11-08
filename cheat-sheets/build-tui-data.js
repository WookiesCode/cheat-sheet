// build-tui-data.js
// Writes ../tui/data/tui-data.json for the terminal version (dc-cheat).
//
// The TUI shows the same commands as the site, so it reads the same generated
// files (global-search-index.js, flag-index.js) instead of keeping its own copy.
// The danger and needs-root rules live in common.js and use JS-only regex features
// (lookahead), which Go's regexp cannot run, so they are evaluated here, once per
// command, with the site's own code. The site and the TUI can't disagree.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const here = f => path.join(__dirname, f);
const read = f => fs.readFileSync(here(f), 'utf8');

function loadWindowFile(file, key) {
  const ctx = { window: {} };
  vm.runInNewContext(read(file), ctx, { filename: file });
  if (!ctx.window[key]) throw new Error(`${key} not found in ${file}: run build-index.js first`);
  return ctx.window[key];
}

// Slice a region of common.js between two marker strings (start included, end excluded).
const common = read('common.js');
function region(startMarker, endMarker) {
  const a = common.indexOf(startMarker);
  if (a < 0) throw new Error(`common.js: "${startMarker}" not found`);
  const b = endMarker ? common.indexOf(endMarker, a) : common.indexOf('\n', a);
  if (b < 0) throw new Error(`common.js: "${endMarker}" not found after "${startMarker}"`);
  return common.slice(a, b);
}

const code = [
  region('const DANGER_RE = '),
  region('const ROOT_STYLE_KEY = ', 'function privTagHtml('),
  region('const ALT_SPLIT = ', 'function altClickOffset('),
  'globalThis.__api = { DANGER_RE, privOf, privCopy, altSegments, altClean, altFull };'
].join('\n');

// Only what those functions touch outside themselves. readStored → null keeps the
// default copy style, the house rule: a "# needs root" line and no sudo.
const ctx = { window: { location: { pathname: '' } }, anatSheetFile: '', readStored: () => null };
vm.runInNewContext(code, ctx, { filename: 'common.js (TUI rules)' });
const api = ctx.__api;
for (const k of ['DANGER_RE', 'privOf', 'privCopy', 'altSegments', 'altClean', 'altFull']) {
  if (!api || !api[k]) throw new Error(`common.js: ${k} did not load`);
}

// Suite groups from the built nav in index.html: each .ng-group (and the CLI/Scripting
// menus) owns the sheet links inside its balanced <div>.
function balancedDivEnd(s, start) {
  const rx = /<div\b|<\/div>/g;
  rx.lastIndex = start;
  let depth = 0, m;
  while ((m = rx.exec(s))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return m.index + m[0].length;
  }
  return s.length;
}
function suiteMap() {
  const html = read('index.html');
  const map = {};
  const groups = [];
  const rx = /<div\b[^>]*(data-suite-name="([^"]+)"|id="(cli|scripting)-nav-dropdown")[^>]*>/g;
  let m;
  while ((m = rx.exec(html))) {
    const name = m[2] ? m[2].replace(/&amp;/g, '&') : (m[3] === 'cli' ? 'CLI Tools' : 'Scripting');
    const body = html.slice(m.index, balancedDivEnd(html, m.index));
    for (const h of body.matchAll(/href="([\w.-]+\.html)"/g)) if (!map[h[1]]) map[h[1]] = name;
    if (!groups.includes(name)) groups.push(name);
  }
  return { map, groups };
}

const index = loadWindowFile('global-search-index.js', 'GLOBAL_SEARCH_INDEX');
const flags = loadWindowFile('flag-index.js', 'FLAG_INDEX');
const { map: suiteOf, groups } = suiteMap();

// Alternatives in one box ("a   |   b") copy one at a time, without "Vendor: " labels,
// with "..." expanded from the first alternative: same as the site's initAlternatives.
function alternatives(cmd) {
  if (/\n/.test(cmd.trim())) return [cmd];
  const segs = api.altSegments(cmd).map(s => s.text);
  if (segs.length < 2) return [cmd.trim()];
  return segs.map(s => api.altClean(api.altFull(s, segs[0])));
}

// Hubs repeat their sub-sheets' commands. Keep each command once, from the most
// specific sheet (fewer commands), as the site's searchIndexUnique() does.
function unique(list) {
  const size = new Map();
  list.forEach(i => size.set(i.file, (size.get(i.file) || 0) + 1));
  const best = new Map();
  list.forEach(i => {
    const k = String(i.cmd || '').replace(/\s+/g, ' ').trim() || `${i.file}#${i.id}`;
    const cur = best.get(k);
    if (!cur || size.get(i.file) < size.get(cur.file)) best.set(k, i);
  });
  const keep = new Set(best.values());
  return list.filter(i => keep.has(i));
}

const entries = unique(index).map(e => {
  ctx.anatSheetFile = e.file; // privOf exempts the sudo sheet, like the site
  const alts = e.noCopy ? [] : alternatives(e.cmd);
  const p = api.privOf(e.cmd);
  const out = {
    suite: suiteOf[e.file] || 'Other',
    sheet: e.sName,
    badge: e.badge || '',
    file: e.file,
    sec: e.sec,
    cmd: e.cmd,
    desc: e.desc
  };
  if (e.tip) out.tip = e.tip;
  if (e.tags) out.tags = e.tags;
  if (e.noCopy) out.ref = true;
  if (api.DANGER_RE.test(e.cmd)) out.danger = true;
  if (p.level) { out.root = p.level; out.rootWhy = p.why; out.rootTool = p.tool; }
  if (alts.length) out.copy = alts.map(a => api.privCopy(a, false));
  return out;
});

const usedSuites = new Set(entries.map(e => e.suite));
// No timestamp: the file only changes (in git) when the commands or rules do.
const data = {
  sourceHash: crypto.createHash('sha256').update(read('global-search-index.js') + read('flag-index.js') + code).digest('hex').slice(0, 12),
  suites: [...groups.filter(g => usedSuites.has(g)), ...(usedSuites.has('Other') ? ['Other'] : [])],
  entries,
  flags
};

const outDir = path.join(__dirname, '..', 'tui', 'data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'tui-data.json'), JSON.stringify(data) + '\n', 'utf8');
const n = k => entries.filter(e => e[k]).length;
console.log(`tui-data.json: ${entries.length} commands, ${data.suites.length} suites, ${n('danger')} state-changing, ${n('root')} with a root note, ${Object.keys(flags).length} tools in the flag index.`);
