// build-man-pages.js
// Captures Ubuntu 24.04 (noble) man pages for the tools in the cheat sheets into
// man-pages-data.json, which build-portable.js embeds. Packages are unpacked, never
// installed or run. Only main and universe are used, and every file is checked
// against the SHA-256 chain that starts at InRelease.
//
//   node build-man-pages.js --plan   list packages and download size, fetch no packages
//   node build-man-pages.js          download, capture, write the JSON
//
// Needs network access, so it is not part of build-all.js. MAN_WORK_DIR sets the
// working directory, which is kept for reuse when given and deleted otherwise.
const { execFileSync, spawnSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const zlib = require('zlib');

const MIRROR = 'https://archive.ubuntu.com/ubuntu';
const SOURCE = 'Ubuntu 24.04 LTS (noble)';
const POCKETS = ['noble', 'noble-updates']; // later pockets win; updates carries security fixes
const COMPONENTS = ['main', 'universe'];
const RANK = { required: 0, important: 1, standard: 2, optional: 3, extra: 4 };

// Left out by policy even though some are packaged: redistribution may not be allowed.
const VENDOR_TOOLS = [
  'all_reduce_perf', 'bfb-install', 'dcgmi', 'flint', 'ib_write_bw', 'ib_write_lat', 'ibdiagnet',
  'mget_temp', 'mlxcables', 'mlxconfig', 'mlxfwmanager', 'mlxfwreset', 'mlxlink', 'mst',
  'nvbandwidth', 'nvidia-bug-report.sh', 'nvidia-ctk', 'nvidia-smi', 'sfputil', 'show_gids'
];

// Fleet tools the sheets may not name in first position.
const EXTRA_TOOLS = [
  'apt', 'apt-cache', 'apt-file', 'apt-mark', 'arp-scan', 'awk', 'cloud-init', 'cpupower',
  'debsums', 'dig', 'dmidecode', 'dpkg', 'dpkg-deb', 'edac-util', 'ethtool', 'fio', 'ibhosts',
  'iblinkinfo', 'ibnetdiscover', 'ibping', 'ibqueryerrors', 'ibstat', 'ibstatus', 'ibswitches',
  'ibtracert', 'ibv_devices', 'ibv_devinfo', 'iostat', 'iperf3', 'ipmitool', 'kdump-config',
  'ledctl', 'lldpcli', 'lldpctl', 'lshw', 'lsscsi', 'lvextend', 'lvs', 'mcelog', 'mokutil', 'mtr',
  'multipath', 'ncdu', 'ndisc6', 'needrestart', 'netplan', 'nmap', 'nvme', 'perf', 'perfquery',
  'picocom', 'pidstat', 'pvs', 'ras-mc-ctl', 'rdisc6', 'redfishtool', 'saquery', 'scontrol',
  'sg_inq', 'sg_map', 'sg_ses', 'sinfo', 'smartctl', 'sminfo', 'smpquery', 'snap', 'squeue',
  'strace', 'stress-ng', 'tcpdump', 'tio', 'turbostat', 'update-grub', 'update-initramfs', 'vgs',
  'wget', 'xxd', 'zfs', 'zpool'
];

// Tools with one page per subcommand, such as ip-link(8) and nvme-smart-log(1).
const SUBCOMMAND_TOOLS = ['ip', 'nvme', 'zpool', 'zfs'];

// Names provided through Debian alternatives, which the file listing can't show.
const ALIASES = { awk: 'mawk', nc: 'nc.openbsd', python3: 'python3.12', which: 'which.debianutils' };

// Where several packages ship a page, the smallest isn't always the real tool.
const PREFERRED_OWNER = { docker: 'docker.io' };

const NON_COMMANDS = new Set(
  'sudo if then else fi for do done while echo cat true false export local set unset cd test time env exec eval source case esac function return exit read printf'.split(' ')
);
// Words the command scan picks up that also happen to be unrelated man page names.
const NOT_TOOLS = new Set(
  'aer align all bios boot build config configuration configure count++ cpu crc drop ecn edac error fallen fcs fec fifo fr fs.file-max hardware ib interface killed mce microcode miss no nv nvlink out over panic pause pro put ras reget set-window-option show sn split-window ver vm.nr_hugepages vm.swappiness'.split(' ')
);
const OFF_TOPIC_SHEET = /^(bash|python|javascript|typescript|powershell|json|yaml|toml|regex|sql|scripting|neovim|nvim-|win|windows|macos|omarchy)/;

const sha256 = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

async function download(url, file, expected) {
  if (!fs.existsSync(file) || (expected && sha256(file) !== expected)) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} for ${url}`);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, Buffer.from(await response.arrayBuffer()));
  }
  if (expected && sha256(file) !== expected) throw new Error(`SHA-256 mismatch for ${url}`);
  return file;
}

function commandsInSheets() {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'global-search-index.js'), 'utf8'), context);
  const names = new Set();
  for (const item of context.window.GLOBAL_SEARCH_INDEX) {
    if (OFF_TOPIC_SHEET.test(item.file)) continue;
    for (const part of String(item.cmd).split(/\s*\|{1,2}\s*|\s*&&\s*|\s*;\s*|\n|\$\(/)) {
      const word = part.trim().replace(/^sudo\s+/, '').replace(/^[A-Z_]+=\S+\s+/, '').split(/\s+/)[0];
      if (/^[a-z][a-z0-9_.+-]{1,30}$/.test(word) && !NON_COMMANDS.has(word) && !NOT_TOOLS.has(word)) names.add(word);
    }
  }
  return names;
}

function parseIndexHashes(inRelease) {
  const hashes = {};
  const block = inRelease.slice(inRelease.indexOf('SHA256:'));
  for (const match of block.matchAll(/^ ([0-9a-f]{64})\s+\d+\s+(\S+)$/gm)) hashes[match[2]] = match[1];
  return hashes;
}

async function loadIndexes(work) {
  const packages = new Map();
  const pagesByName = new Map(); // "ip" -> [{ section, file, owners }]
  for (const pocket of POCKETS) {
    const dists = `${MIRROR}/dists/${pocket}`;
    const inRelease = path.join(work, 'index', `${pocket}.InRelease`);
    await download(`${dists}/InRelease`, inRelease);
    const hashes = parseIndexHashes(fs.readFileSync(inRelease, 'utf8'));

    for (const component of COMPONENTS) {
      const rel = `${component}/binary-amd64/Packages.gz`;
      const file = await download(`${dists}/${rel}`, path.join(work, 'index', `${pocket}.${component}.Packages.gz`), hashes[rel]);
      for (const stanza of zlib.gunzipSync(fs.readFileSync(file)).toString('utf8').split('\n\n')) {
        const field = key => (stanza.match(new RegExp(`^${key}: (.+)$`, 'm')) || [])[1];
        if (!field('Package')) continue;
        packages.set(field('Package'), {
          name: field('Package'), version: field('Version'), filename: field('Filename'),
          sha256: field('SHA256'), size: Number(field('Size')), component,
          rank: RANK[field('Priority')] ?? 5
        });
      }
    }

    const contents = await download(`${dists}/Contents-amd64.gz`, path.join(work, 'index', `${pocket}.Contents.gz`), hashes['Contents-amd64.gz']);
    const listing = spawnSync('sh', ['-c', 'gzip -dc "$1" | grep -E "^usr/share/man/man[18]/"', 'sh', contents], { encoding: 'utf8', maxBuffer: 1 << 30 });
    for (const line of listing.stdout.split('\n')) {
      const match = line.match(/^(usr\/share\/man\/man[18]\/(.+)\.([18][a-z]*)\.gz)\s+(\S+)$/);
      if (!match) continue;
      const owners = match[4].split(',').map(owner => owner.split('/').pop());
      const list = pagesByName.get(match[2]) || [];
      if (!list.some(entry => entry.file === match[1])) list.push({ section: match[3], file: match[1], owners });
      pagesByName.set(match[2], list);
    }
  }
  return { packages, pagesByName };
}

// Picks the page a default install would show: the most basic package that owns it.
function choosePage(name, pagesByName, packages) {
  const options = [];
  for (const page of pagesByName.get(ALIASES[name] || name) || []) {
    for (const owner of page.owners) {
      if (packages.has(owner)) options.push({ ...page, pkg: packages.get(owner) });
    }
  }
  const score = option => [
    option.pkg.name === PREFERRED_OWNER[name] ? 0 : 1,
    option.pkg.component === 'main' ? 0 : 1,
    option.pkg.rank,
    option.section.startsWith('8') ? 1 : 0,
    option.pkg.size
  ];
  options.sort((a, b) => {
    const [x, y] = [score(a), score(b)];
    return x.map((v, i) => v - y[i]).find(Boolean) || 0;
  });
  return options[0];
}

function extractPackage(deb, root) {
  const scratch = fs.mkdtempSync(path.join(root, '..', 'deb-'));
  execFileSync('ar', ['x', deb], { cwd: scratch });
  const data = fs.readdirSync(scratch).find(file => file.startsWith('data.tar'));
  spawnSync('tar', [
    '-xf', path.join(scratch, data), '-C', root, '--no-same-owner', '--no-same-permissions',
    '--wildcards', './usr/share/man/man[18]/*', './usr/share/doc/*/copyright'
  ]);
  fs.rmSync(scratch, { recursive: true, force: true });
}

function renderPage(root, file) {
  const env = { ...process.env, MANWIDTH: '80', MANPAGER: 'cat', LC_ALL: 'C.UTF-8' };
  const cwd = path.join(root, 'usr/share/man'); // .so includes resolve from here
  const relative = path.relative(cwd, path.join(root, file));
  const formatted = spawnSync('man', ['-l', relative], { cwd, env, maxBuffer: 1 << 26 }).stdout;
  return spawnSync('col', ['-bx'], { input: formatted, encoding: 'utf8', maxBuffer: 1 << 26 }).stdout || '';
}

function licenseOf(root, pkg) {
  const file = path.join(root, 'usr/share/doc', pkg, 'copyright');
  if (!fs.existsSync(file)) return `See the ${pkg} package`;
  const names = [...fs.readFileSync(file, 'utf8').matchAll(/^License: *(\S.*)$/gm)].map(match => match[1].trim());
  return names.length ? [...new Set(names)].join(', ') : `See /usr/share/doc/${pkg}/copyright`;
}

async function main() {
  const planOnly = process.argv.includes('--plan');
  const kept = process.env.MAN_WORK_DIR;
  const work = kept || fs.mkdtempSync(path.join(os.tmpdir(), 'man-pages-'));
  fs.mkdirSync(work, { recursive: true });

  const { packages, pagesByName } = await loadIndexes(work);
  const wanted = new Set([...commandsInSheets(), ...EXTRA_TOOLS]);
  VENDOR_TOOLS.forEach(tool => wanted.delete(tool));
  for (const tool of SUBCOMMAND_TOOLS) {
    const parent = choosePage(tool, pagesByName, packages).pkg.name;
    for (const [name, list] of pagesByName) {
      if (name.startsWith(`${tool}-`) && list.some(page => page.owners.includes(parent))) wanted.add(name);
    }
  }

  const chosen = new Map();
  const missing = Object.fromEntries(VENDOR_TOOLS.map(tool => [tool, 'vendor']));
  for (const name of [...wanted].sort()) {
    const page = choosePage(name, pagesByName, packages);
    if (page) chosen.set(name, page); else missing[name] = 'unavailable';
  }

  const needed = new Map([...chosen.values()].map(page => [page.pkg.name, page.pkg]));
  const bytes = [...needed.values()].reduce((sum, pkg) => sum + pkg.size, 0);
  console.log(`${chosen.size} pages from ${needed.size} packages, ${(bytes / 1048576).toFixed(1)} MB to download`);
  console.log(`Largest: ${[...needed.values()].sort((a, b) => b.size - a.size).slice(0, 8).map(p => `${p.name} ${(p.size / 1048576).toFixed(1)}M`).join(', ')}`);
  console.log(`Unavailable: ${Object.keys(missing).filter(k => missing[k] === 'unavailable').join(' ')}`);
  if (planOnly) {
    console.log(`Packages: ${[...needed.keys()].sort().join(' ')}`);
    if (!kept) fs.rmSync(work, { recursive: true, force: true });
    return;
  }

  const root = path.join(work, 'tree', 'root');
  fs.mkdirSync(root, { recursive: true });
  for (const pkg of needed.values()) {
    const deb = await download(`${MIRROR}/${pkg.filename}`, path.join(work, 'debs', path.basename(pkg.filename)), pkg.sha256);
    extractPackage(deb, root);
  }

  const pages = {};
  for (const [name, page] of chosen) {
    const text = renderPage(root, page.file);
    if (text.trim().length < 100) {
      missing[name] = 'unavailable';
      continue;
    }
    pages[name] = {
      section: page.section, package: page.pkg.name, version: page.pkg.version,
      license: licenseOf(root, page.pkg.name), text
    };
  }

  fs.writeFileSync(path.join(__dirname, 'man-pages-data.json'), JSON.stringify({ source: SOURCE, captured: new Date().toISOString().slice(0, 10), pages, missing }, null, 1) + '\n');
  console.log(`Captured ${Object.keys(pages).length} man pages from ${SOURCE}; ${Object.keys(missing).length} tools have none.`);
  if (!kept) fs.rmSync(work, { recursive: true, force: true });
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
