// explain_golden.js: the site's own Explain (common.js exAnalyze, run in node:vm) over
// a list of commands, as JSON on stdout. test_explain.py compares explain.py with it.
//   node tui-py/explain_golden.js < commands.json  →  [{src, verdict, safe, findings, stages}]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const site = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(site, f), 'utf8');
const common = read('common.js');
const cut = (a, b) => {
  const i = common.indexOf(a);
  const j = b ? common.indexOf(b, i) : common.indexOf('\n', i);
  if (i < 0 || j < 0) throw new Error(`common.js: marker "${a}" not found`);
  return common.slice(i, j);
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const ctx = { window: {}, escapeHtml: esc };
vm.runInNewContext(read('global-search-index.js'), ctx);
vm.runInNewContext(read('flag-index.js'), ctx);
vm.runInNewContext(read('man-pages-data.js'), ctx);
const md = ctx.window.MAN_PAGES_DATA;
ctx.manuals = { list: Object.entries(md.pages).map(([name, p]) => ({ name, ...p })), helps: md.helps || {} };
ctx.exFlags = ctx.window.FLAG_INDEX;
vm.runInNewContext([
  cut('const DANGER_RE = '),
  cut('const RB_NEVER_RETURNS = '),
  cut('const EX_WRAPPERS = ', 'function exLoadFlags('),
  cut('function exTokenize(', 'function exMapHtml('),
  'globalThis.api = { exAnalyze };'
].join('\n'), ctx);

// The rows the site writes as HTML, as plain text: <br> is a line break.
const plain = html => html.replace(/<br>/g, '\n').replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const cmds = JSON.parse(fs.readFileSync(0, 'utf8'));
const out = cmds.map(c => {
  const r = ctx.api.exAnalyze(c);
  return {
    src: r.src, verdict: r.verdict, safe: r.safe,
    findings: r.findings.map(f => [f.sev, f.title, f.text, f.safe || '']),
    stages: r.stages.map(s => ({
      tool: s.ex.tool, name: s.ex.name, sheet: s.ex.sheet, remote: s.remote || '', leftovers: s.ex.leftovers,
      rows: s.ex.rows.map(x => [x.tok, x.kind, x.html ? plain(x.html) : x.text, x.src || '', !!x.unknown])
    }))
  };
});
process.stdout.write(JSON.stringify(out));
