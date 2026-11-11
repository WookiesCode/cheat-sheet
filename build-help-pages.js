// build-help-pages.js
// --help output for tools that have no offline man page, for "Explain a command".
//
//   node build-help-pages.js --list   writes scripts/help-tools.txt: the exact help
//                                     commands scripts/capture-help.sh runs
//   node build-help-pages.js          merges help-captures/<label>/*.txt into
//                                     help-pages.json (build-man-data.js ships it)
//
// The list comes from the sheets themselves: every tool their commands use with a flag,
// plus the subcommands they use for CLIs whose flags are per subcommand
// (nvidia-smi nvlink, dcgmi diag, kubectl get, git config, openssl x509...).
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const here = f => path.join(__dirname, f);
const read = f => fs.readFileSync(here(f), 'utf8');

// Shell words and builtins are not tools. The second group could change something if a
// tool didn't understand --help, so they are never run (and all have man pages anyway).
const NOT_TOOLS = /^(do|done|if|then|else|elif|fi|for|while|until|case|esac|function|set|unset|declare|local|read|mapfile|readarray|echo|printf|export|return|source|eval|exec|test|true|false|cd|pushd|popd|let|shift|trap|wait|time|RUN|FROM|COPY|ENV|CMD|agent|console|put|show|switch|the|split-window|tnc)$/;
// Tools where only one help form is safe to try: written to the list exactly.
const EXACT_HELP = { 'nvidia-bug-report.sh': '--help', needrestart: '-h', 'update-initramfs': '-h', sh: '--help', code: '--help', zed: '--help', open: '--help' };
// fsck with no device checks everything in /etc/fstab, so the checkers are never run either.
const NEVER_RUN = /^(reboot|shutdown|poweroff|halt|init|telinit|kill|killall|pkill|rm|rmdir|dd|shred|wipefs|mkfs(\..*)?|mkswap|fdisk|sfdisk|cfdisk|gdisk|sgdisk|parted|blkdiscard|fsck(\..*)?|e2fsck|xfs_repair|badblocks|sudo|su|doas)$/;

// How each multi-command CLI prints one subcommand's help. Only these get subcommand
// captures: each form is answered by the tool's argument parser before anything runs.
const SUB_HELP = {
  'nvidia-smi': s => `nvidia-smi ${s} -h`,
  dcgmi: s => `dcgmi ${s} --help`,
  'nvidia-ctk': s => `nvidia-ctk ${s} --help`,
  kubectl: s => `kubectl ${s} --help`,
  helm: s => `helm ${s} --help`,
  docker: s => `docker ${s} --help`,
  crictl: s => `crictl ${s} --help`,
  ctr: s => `ctr ${s} --help`,
  argocd: s => `argocd ${s} --help`,
  terraform: s => `terraform ${s} -help`,
  git: s => `git ${s} -h`,
  openssl: s => `openssl ${s} -help`,
};
const HELP_WORDS = new Set(['--help', '-h', '-?', 'help', '-help']);

function sheetUsage() {
  const common = read('common.js');
  const cut = (a, b) => {
    const i = common.indexOf(a), j = common.indexOf(b, i);
    if (i < 0 || j < 0) throw new Error(`common.js: marker "${a}" or "${b}" not found`);
    return common.slice(i, j);
  };
  const ctx = { window: {} };
  vm.runInNewContext(read('global-search-index.js'), ctx);
  vm.runInNewContext([
    cut('const EX_WRAPPERS = ', 'function exLoadFlags('),
    cut('function exTokenize(', 'function exManPage('),
    'globalThis.api = { exTokenize, exStages, exToolIndex };'
  ].join('\n'), ctx);
  const { exTokenize, exStages, exToolIndex } = ctx.api;
  const usage = new Map(); // tool -> Set of first subcommand words
  for (const it of ctx.window.GLOBAL_SEARCH_INDEX) {
    if (it.noCopy) continue;
    for (const alt of String(it.cmd).split(/\s{2,}\|\s{2,}/)) {
      for (const st of exStages(exTokenize(alt))) {
        const { i } = exToolIndex(st.words);
        const tool = (st.words[i] || '').replace(/^.*\//, '');
        // CLI names only: lowercase, at least two characters (no PowerShell cmdlets,
        // key combos or words from code samples on the scripting sheets).
        if (!/^[a-z][a-z0-9._+-]+$/.test(tool) || NOT_TOOLS.test(tool) || NEVER_RUN.test(tool)) continue;
        // ...and used with a flag somewhere, which prose and code samples rarely are.
        const args = st.words.slice(i + 1);
        if (!args.some(w => /^--?[A-Za-z?]/.test(w))) continue;
        if (!usage.has(tool)) usage.set(tool, new Set());
        const sub = args[0] || '';
        if (/^[a-z][a-z0-9-]{1,30}$/.test(sub)) usage.get(tool).add(sub);
      }
    }
  }
  return usage;
}

function writeList() {
  const man = JSON.parse(read('man-pages-data.json')).pages;
  const extra = JSON.parse(read('man-pages-extra.json')).pages;
  const hasMan = t => !!(man[t] || extra[t]);
  const lines = [];
  for (const [tool, subs] of [...sheetUsage()].sort((a, b) => a[0].localeCompare(b[0]))) {
    // Every tool, man page or not: Explain only falls back to --help when the man page
    // doesn't describe a flag (jq, apt, zstd and fio lay their options out their own way).
    lines.push(EXACT_HELP[tool] ? `${tool} ${EXACT_HELP[tool]}` : tool);
    const form = SUB_HELP[tool];
    if (form) for (const s of [...subs].sort()) if (!HELP_WORDS.has(s) && !hasMan(`${tool}-${s}`)) lines.push(form(s));
  }
  const out = path.join(__dirname, 'scripts', 'help-tools.txt');
  fs.writeFileSync(out, [
    '# Generated by build-help-pages.js --list: the help commands',
    '# scripts/capture-help.sh runs. Review before running on a new box.',
    ...lines, ''
  ].join('\n'));
  console.log(`help-tools.txt: ${lines.length} help commands (${lines.filter(l => !l.includes(' ')).length} tools).`);
}

// "nvidia-smi nvlink -h" -> "nvidia-smi nvlink"; "mlxlink --help" -> "mlxlink".
const keyOf = cmd => cmd.split(/\s+/).filter(w => !HELP_WORDS.has(w)).join(' ');
const optionLines = t => (t.match(/^\s*-{1,2}[A-Za-z?]/gm) || []).length;

function merge() {
  const root = here('help-captures');
  const pages = {};
  const labels = fs.existsSync(root) ? fs.readdirSync(root).filter(d => fs.statSync(path.join(root, d)).isDirectory()) : [];
  for (const label of labels.sort()) {
    for (const f of fs.readdirSync(path.join(root, label)).filter(f => f.endsWith('.txt'))) {
      const raw = fs.readFileSync(path.join(root, label, f), 'utf8');
      const head = {};
      const body = raw.replace(/^(# [a-z-]+(?: \d+)?:? ?.*\n)+\n?/, m => {
        for (const l of m.split('\n')) { const x = l.match(/^# (\w+): (.*)$/); if (x) head[x[1]] = x[2].trim(); }
        return '';
      }).replace(/\s+$/, '');
      if (!head.command || !body) continue;
      const key = keyOf(head.command);
      const page = { text: body, source: head.command, label: head.label || label, version: head.version || '', captured: head.captured || '' };
      // Several boxes may have the same tool: keep the most complete help.
      if (!pages[key] || optionLines(body) > optionLines(pages[key].text)) pages[key] = page;
    }
  }
  // A subcommand "help" that only repeats the tool's own help adds nothing.
  for (const key of Object.keys(pages)) {
    const parent = key.split(' ')[0];
    if (key !== parent && pages[parent] && pages[parent].text === pages[key].text) delete pages[key];
  }
  const sorted = Object.fromEntries(Object.keys(pages).sort().map(k => [k, pages[k]]));
  fs.writeFileSync(here('help-pages.json'), JSON.stringify({ pages: sorted }, null, 1) + '\n');
  console.log(`help-pages.json: ${Object.keys(sorted).length} help pages from ${labels.length} capture(s).`);
}

if (process.argv.includes('--list')) writeList();
else merge();
