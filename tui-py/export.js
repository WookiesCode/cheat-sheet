// export.js: the site's structure and sheets as JSON for the Textual prototype.
//   node tui-py/export.js  →  tui-py/data/site.json
//
// Everything comes from the built site, so the terminal shows what the browser shows:
// nav tabs and suites from index.html's nav, each sheet's sections and commands from
// its *_DATA file, and the danger / needs-root / alternatives rules evaluated with
// common.js's own code (Python can't run its JS regexes).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const site = path.join(__dirname, '..', 'cheat-sheets');
const read = f => fs.readFileSync(path.join(site, f), 'utf8');
const strip = s => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();

// ---- the site's rules, run as-is -------------------------------------------
const common = read('common.js');
function region(a, b) {
  const i = common.indexOf(a);
  const j = b ? common.indexOf(b, i) : common.indexOf('\n', i);
  if (i < 0 || j < 0) throw new Error(`common.js: marker "${a}" not found`);
  return common.slice(i, j);
}
const ctx = { window: { location: { pathname: '' } }, anatSheetFile: '', readStored: () => null };
vm.runInNewContext([
  region('const DANGER_RE = '),
  region('const ROOT_STYLE_KEY = ', 'function privTagHtml('),
  region('const ALT_SPLIT = ', 'function altClickOffset('),
  'globalThis.api = { DANGER_RE, privOf, privCopy, altSegments, altClean, altFull };'
].join('\n'), ctx);
const api = ctx.api;

function alternatives(cmd) {
  if (/\n/.test(cmd.trim())) return [cmd];
  const segs = api.altSegments(cmd).map(s => s.text);
  if (segs.length < 2) return [cmd.trim()];
  return segs.map(s => api.altClean(api.altFull(s, segs[0])));
}

// ---- nav: tabs → suites → sheets ------------------------------------------
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
function links(html) {
  const out = [];
  let heading = '';
  const rx = /<div class="ng-heading">([\s\S]*?)<\/div>|<a href="([\w.-]+\.html)" class="dropdown-item(?! dropdown-hub-link)[^"]*"[^>]*>([\s\S]*?)<\/a>/g;
  let m;
  while ((m = rx.exec(html))) {
    if (m[1] !== undefined) { heading = strip(m[1]); continue; }
    const code = (m[3].match(/<code>([\s\S]*?)<\/code>/) || [, ''])[1];
    const label = strip((m[3].match(/<span class="cmd-desc">([\s\S]*?)<\/span>/) || [, m[3]])[1]);
    out.push({ file: m[2], code: strip(code), label, heading });
  }
  return out;
}

const index = read('index.html');
const nav = index.slice(index.indexOf('<nav'), index.indexOf('</nav>'));
const toggles = [...nav.matchAll(/<a href="([\w.-]+\.html)" class="sheet-link( dropdown-toggle| nav-home| nav-tools)[^"]*"[^>]*>([\s\S]*?)<\/a>/g)];
const tabs = [];
toggles.forEach((t, k) => {
  const end = k + 1 < toggles.length ? toggles[k + 1].index : nav.length;
  const body = nav.slice(t.index, end);
  const tab = { label: strip(t[3]).replace(/\s*▾$/, ''), href: t[1], suites: [] };
  const groupRx = /<div\b[^>]*(?:data-suite-name="([^"]+)"[^>]*data-suite-hub="([^"]*)"|data-suite-name="([^"]+)")[^>]*>|<div\b[^>]*id="(cli|scripting)-nav-dropdown"[^>]*>/g;
  let g;
  while ((g = groupRx.exec(body))) {
    const name = g[1] || g[3] ? strip(g[1] || g[3]) : (g[4] === 'cli' ? 'CLI Tools' : 'Scripting');
    const hub = g[2] || (g[4] ? `${g[4] === 'cli' ? 'cli-tools' : 'scripting'}.html` : '');
    const html = body.slice(g.index, balancedDivEnd(body, g.index));
    const sheets = links(html);
    if (sheets.length) tab.suites.push({ name, hub, sheets });
    groupRx.lastIndex = g.index + html.length;
  }
  // CLI Tools, Scripting and Ticketing are plain menus, not suite groups: one suite each.
  if (!tab.suites.length) {
    const sheets = links(body).filter(s => s.file !== t[1]);
    if (sheets.length) tab.suites.push({ name: tab.label, hub: t[1], sheets });
  }
  tabs.push(tab);
});

// ---- sheets ------------------------------------------------------------------
const jsFor = f => (f === 'linux.html' ? 'app.js' : f.replace(/\.html$/, '.js'));
const sheets = {};
for (const tab of tabs) for (const suite of tab.suites) for (const s of [{ file: suite.hub }, ...suite.sheets]) {
  if (!s.file || sheets[s.file] || !fs.existsSync(path.join(site, jsFor(s.file)))) continue;
  const m = read(jsFor(s.file)).match(/const\s+([A-Z0-9_]+_DATA)\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!m) continue;
  let sections;
  try { sections = vm.runInNewContext(`(${m[2]})`); } catch (e) { continue; }
  ctx.anatSheetFile = s.file;
  sheets[s.file] = sections.filter(sec => sec && Array.isArray(sec.commands)).map(sec => ({
    badge: sec.badge || '', title: sec.title || '', subtitle: sec.subtitle || '',
    commands: sec.commands.filter(Boolean).map(c => {
      const cmd = String(c.cmd || '');
      const ref = !!(c.diagram || c.hideCode);
      const p = api.privOf(cmd);
      const out = { cmd, desc: c.desc || '', details: c.details || '', tip: c.tip || '', flags: (c.flags || []).filter(f => Array.isArray(f) && f.length >= 2) };
      if (Array.isArray(c.subcommands)) out.subs = c.subcommands.filter(x => Array.isArray(x) && x.length >= 2);
      if (ref) out.ref = true;
      if (api.DANGER_RE.test(cmd)) out.danger = true;
      if (p.level) { out.root = p.level; out.rootWhy = p.why; out.rootTool = p.tool; }
      if (!ref) out.copy = alternatives(cmd).map(a => api.privCopy(a, false));
      return out;
    })
  }));
}

fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, 'data', 'site.json'), JSON.stringify({ tabs, sheets }));
const nSuites = tabs.reduce((n, t) => n + t.suites.length, 0);
console.log(`site.json: ${tabs.length} tabs, ${nSuites} suites, ${Object.keys(sheets).length} sheets.`);
