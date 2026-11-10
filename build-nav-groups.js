// build-nav-groups.js
// Files the suite menus into a few tabs: Home · Operating Systems · Editors · CLI Tools ·
// Scripting · Networking · Remote Management · Hardware · DevOps.
//
// Each suite keeps its own menu definition: the generators' *_NAVBAR_SNIPPET constants, or,
// for suites whose menu is built at generate time (Editors, Containers, Grafana), the menu
// the generator just inserted into the page. Inside a tab every suite is a group with
// data-suite-name / data-suite-hub, which common.js (navSuites) reads for the suite rail,
// the pager and Practice, and every group keeps its official logo.
//
// Re-runnable: the nav (nav/nav-source.html) is split into its top-level elements (balanced <div>s and
// <a>s), the tabs are rebuilt, and anything this script does not know is kept at the end.
const fs = require('fs');
const path = require('path');

const read = f => fs.readFileSync(path.join(__dirname, f), 'utf8');
const genSnippet = (file, name) => {
  const m = read(file).match(new RegExp(`const ${name} = \`([\\s\\S]*?)\`;`));
  if (!m || /\$\{/.test(m[1])) throw new Error(`${name} not found (or not static) in ${file}`);
  return m[1];
};

// Official Omarchy wordmark (omarchy-settings package) and Jira mark (Simple Icons, CC0).
const OMARCHY_WORDMARK = '<svg class="omarchy-wordmark" viewBox="0 0 1215 285" width="47" height="11" role="img"><title>Omarchy</title><g fill="currentColor"><path clip-rule="evenodd" d="m720 120h-15v15h-14.998v14.999l-60.002.001v15.002l90-.002v.002h.002l-.002 89.998h-15v15h-13v15h-17v-89.998h-45v90l-45-.002v-89.998h-14.998v-30h14.998v-15.002h-14.998v-30.001h14.998v-75h15v-14.997h15v-15.002h105.002zm-90-.001h45v-74.997h-45z" fill-rule="evenodd"/><path clip-rule="evenodd" d="m105 30.002h15v14.997h15v180.001h-15v15h-15v15.002h-75v-15.002h-15v-15h-15v-180.001h15v-14.997h15v-15.002h75zm-60 194.998h45v-179.998h-45z" fill-rule="evenodd"/><path d="m300 15h60v15h15v14.999h15v180.001h-15v15h-15v15h-15l-.004-209.998h-44.994v-.002h-.002v210.002h-45v-210h-44.998v179.997h-.002v30.003h-15v-15.002h-15v-15h-14.998v-180.001h14.998v-14.999h15v-15h60v-15h45z"/><path clip-rule="evenodd" d="m555 225h-15v15h-15v15h-15v-105.001l-44.998.001v105.002h-45.002v-105.002h-15v-30.001h15v-75h15.002v-14.997h15v-15.002h105zm-89.998-105.001h44.998v-74.997h-44.998z" fill-rule="evenodd"/><path d="m885 75h-15v15h-15v15h-15v-59.998h-45v179.998h45v-59.998h15v14.997h15v15.001h15v30h-15v15h-15v15.002l-105-.002v-210.001h14.998v-14.997h15.002v-15.002h105z"/><path d="m960 119.999h45v-104.999h15v15h15v14.999h15v75.001h15v15h-15v90h-15v15h-15v15h-15v-105h-45v105.002l-45-.002v-105h-30v-15h15v-15.001h15v-75h15v-14.997h15v-15.002h15z"/><path d="m1125 119.999h45v-104.999h15v15h15v15h15v180h-15v15h-15v15.002l-75-.002v-15h-15v-15h-15v-45.001h15v-14.997-.002h30v60h45v-75h-90v-105.001h15v-14.997h15v-15.002h15z"/></g></svg>';
const JIRA_LOGO = '<svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="#0052CC" d="M11.571 11.513H0a5.218 5.218 0 0 0 5.232 5.215h2.13v2.057A5.215 5.215 0 0 0 12.575 24V12.518a1.005 1.005 0 0 0-1.005-1.005zm5.723-5.756H5.736a5.215 5.215 0 0 0 5.215 5.214h2.129v2.058a5.218 5.218 0 0 0 5.215 5.214V6.758a1.001 1.001 0 0 0-1.001-1.001zM23.013 0H11.455a5.215 5.215 0 0 0 5.215 5.215h2.129v2.057A5.215 5.215 0 0 0 24 12.483V1.005A1.001 1.001 0 0 0 23.013 0Z"/></svg>';

const ICON = {
  os: '<rect x="2.5" y="4" width="19" height="12.5" rx="2"/><path d="M8 20.5h8M12 16.5v4"/>',
  editors: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5"/><path d="M13.5 4l-3 16"/>',
  net: '<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><path d="M12 7.2v4.3M12 11.5l-5.6 5.6M12 11.5l5.6 5.6"/>',
  remote: '<rect x="3" y="3.5" width="18" height="7" rx="1.5"/><rect x="3" y="13.5" width="18" height="7" rx="1.5"/><path d="M7 7h.01M7 17h.01M11 7h6M11 17h6"/>',
  hw: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="9.5" y="9.5" width="5" height="5"/><path d="M9 2.5v3.5M15 2.5v3.5M9 18v3.5M15 18v3.5M2.5 9h3.5M2.5 15h3.5M18 9h3.5M18 15h3.5"/>',
  tickets: '<path d="M3 9V7.5A1.5 1.5 0 0 1 4.5 6h15A1.5 1.5 0 0 1 21 7.5V9a2.5 2.5 0 0 0 0 5v1.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.5V14a2.5 2.5 0 0 0 0-5z"/><path d="M14.5 6v2M14.5 10.5v2M14.5 15v2"/>',
  devops: '<path d="M6.5 8.5c-2 0-3.5 1.6-3.5 3.5s1.5 3.5 3.5 3.5c3.5 0 7.5-7 11-7 2 0 3.5 1.6 3.5 3.5s-1.5 3.5-3.5 3.5c-3.5 0-7.5-7-11-7z"/>'
};
const svgIcon = (k, cls) => `<svg class="${cls}" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[k]}</svg>`;

// Where each suite's menu comes from.
const SUITES = {
  linux: { id: 'linux-nav-dropdown', gen: ['generate-linux-suite.js', 'LINUX_NAVBAR_SNIPPET'], hub: 'linux.html' },
  macos: { id: 'macos-nav-dropdown', gen: ['generate-macos-suite.js', 'MACOS_NAVBAR_SNIPPET'] },
  windows: { id: 'win-nav-dropdown', gen: ['generate-windows-suite.js', 'WIN_NAVBAR_SNIPPET'] },
  omarchy: { link: 'omarchy.html', name: 'Omarchy', logo: OMARCHY_WORDMARK, label: 'Hyprland desktop' },
  neovim: { id: 'nvim-nav-dropdown', gen: ['generate-neovim-suite.js', 'NVIM_NAVBAR_SNIPPET'] },
  editors: { id: 'editors-nav-dropdown' },
  infiniband: { id: 'infiniband-nav-dropdown', gen: ['generate-infiniband-suite.js', 'IB_NAVBAR_SNIPPET'] },
  ethernet: { id: 'ethernet-nav-dropdown', gen: ['generate-ethernet-suite.js', 'ETH_NAVBAR_SNIPPET'] },
  fiber: { id: 'fiber-nav-dropdown', gen: ['generate-fiber-suite.js', 'FO_NAVBAR_SNIPPET'] },
  switches: { id: 'switches-nav-dropdown', gen: ['generate-switches-suite.js', 'SW_NAVBAR_SNIPPET'] },
  redfish: { id: 'redfish-nav-dropdown', gen: ['generate-redfish-suite.js', 'RF_NAVBAR_SNIPPET'] },
  ipmi: { id: 'ipmi-nav-dropdown', gen: ['generate-ipmi-suite.js', 'IPMI_NAVBAR_SNIPPET'] },
  bmctools: { id: 'bmctools-nav-dropdown' },
  nvidia: { id: 'nvidia-nav-dropdown', gen: ['generate-nvidia-suite.js', 'NVIDIA_NAVBAR_SNIPPET'] },
  motherboards: { id: 'motherboards-nav-dropdown', gen: ['generate-motherboards-suite.js', 'MB_NAVBAR_SNIPPET'] },
  hwref: { id: 'hwref-nav-dropdown' },
  // No hub page: the hardware-inventory sheets the Linux generator writes, filed under Hardware.
  internals: { name: 'Server internals', label: 'inventory, PCIe, ECC, NVMe', logo: svgIcon('hw', 'ng-logo'), take: ['dmi-hw.html', 'pcie-numa.html', 'ecc-edac.html', 'nvme-smart.html'] },
  containers: { id: 'containers-nav-dropdown' },
  grafana: { id: 'grafana-nav-dropdown' },
  sre: { id: 'sre-nav-dropdown' },
  slurm: { id: 'slurm-nav-dropdown' },
  jira: { link: 'jira.html', name: 'Jira', logo: JIRA_LOGO.replace('class="nav-logo"', 'class="ng-logo"'), label: 'JQL: tickets per server, rack, RMA' }
};

const TABS = [
  { key: 'os', label: 'Operating Systems', href: 'linux.html', cols: [['linux'], ['macos', 'omarchy'], ['windows']] },
  { key: 'editors', label: 'Editors', href: 'editors.html', cols: [['neovim'], ['editors']] },
  { key: 'net', label: 'Networking', href: 'infiniband.html', cols: [['infiniband'], ['ethernet', 'fiber'], ['switches']] },
  { key: 'remote', label: 'Remote Management', href: 'redfish.html', cols: [['redfish'], ['ipmi'], ['bmctools']] },
  { key: 'hw', label: 'Hardware', href: 'motherboards.html', cols: [['nvidia'], ['motherboards', 'internals'], ['hwref']] },
  { key: 'devops', label: 'DevOps', href: 'containers.html', cols: [['containers', 'slurm'], ['grafana'], ['sre']] },
  // Jira is a ticketing system, not DevOps: its own tab, with room for other ticketing tools.
  { key: 'tickets', label: 'Ticketing', href: 'jira.html', cols: [['jira']] }
];
// Top-level order; strings are tabs, { id } are menus kept as they are.
const ORDER = ['home', 'tools', 'os', 'editors', { id: 'cli-nav-dropdown' }, { id: 'scripting-nav-dropdown' }, 'net', 'remote', 'hw', 'devops', 'tickets'];

// ---- parsing -------------------------------------------------------------
function balancedDivEnd(s, start) {
  const rx = /<div\b|<\/div>/g;
  rx.lastIndex = start;
  let depth = 0, m;
  while ((m = rx.exec(s))) {
    depth += m[0] === '</div>' ? -1 : 1;
    if (depth === 0) return m.index + 6;
  }
  throw new Error('Unbalanced <div> in nav');
}
function topLevel(inner) {
  const out = [];
  let i = 0;
  while (i < inner.length) {
    const lt = inner.indexOf('<', i);
    if (lt < 0) break;
    let end;
    if (inner.startsWith('<div', lt)) end = balancedDivEnd(inner, lt);
    else if (inner.startsWith('<a', lt)) end = inner.indexOf('</a>', lt) + 4;
    else end = inner.indexOf('>', lt) + 1;
    out.push(inner.slice(lt, end));
    i = end;
  }
  return out;
}
const entriesOf = html => [...html.matchAll(/<div class="[\w-]*heading">([^<]*)<\/div>|<a href="([^"]+)" class="dropdown-item" role="menuitem">[\s\S]*?<\/a>/g)]
  .map(m => (m[1] !== undefined ? { h: m[1] } : { href: m[2], html: m[0] }));

// A suite's own menu (standalone dropdown).
function parseMenu(html) {
  const toggle = html.match(/<a href="([^"]+)" class="sheet-link dropdown-toggle"[^>]*>([\s\S]*?)<\/a>/);
  const hub = html.match(/<a href="([^"]+)" class="dropdown-item dropdown-hub-link"[^>]*>([\s\S]*?)<\/a>/);
  if (!toggle || !hub) throw new Error('Unexpected menu layout');
  const logo = (toggle[2].match(/<svg[\s\S]*?<\/svg>|<img[^>]*>/) || [''])[0].replace(/class="nav-logo"/, 'class="ng-logo"');
  return {
    name: (toggle[2].match(/<span>([^<]+)<\/span>/) || [, ''])[1].trim(),
    logo, hub: hub[1], label: hub[2].replace(/<[^>]+>/g, '').replace('📑', '').trim(),
    entries: entriesOf(html.slice(hub.index + hub[0].length))
  };
}
// A group this script wrote on an earlier run.
function parseGroup(html) {
  const head = html.match(/class="[^"]*ng-head[^"]*"[^>]*>([\s\S]*?)<\/(?:a|div)>/);
  return {
    name: (html.match(/data-suite-name="([^"]*)"/) || [, ''])[1],
    hub: (html.match(/data-suite-hub="([^"]*)"/) || [, ''])[1],
    logo: head ? (head[1].match(/<svg[\s\S]*?<\/svg>|<img[^>]*>/) || [''])[0] : '',
    label: head ? (head[1].match(/<small>([^<]*)<\/small>/) || [, ''])[1] : '',
    entries: entriesOf(html.slice(head ? head.index + head[0].length : 0))
  };
}

// ---- rendering -------------------------------------------------------------
const I = '                    ';
function groupHtml(key, g) {
  const head = g.hub
    ? `<a href="${g.hub}" class="dropdown-item dropdown-hub-link ng-head${key === 'omarchy' ? ' ng-wordmark' : ''}" role="menuitem">${g.logo}${key === 'omarchy' ? '' : `<b>${g.name}</b>`}<small>${g.label}</small></a>`
    : `<div class="ng-head ng-head-static">${g.logo}<b>${g.name}</b><small>${g.label}</small></div>`;
  const body = g.entries.map(e => (e.h !== undefined ? `${I}  <div class="ng-heading">${e.h}</div>` : `${I}  ${e.html}`)).join('\n');
  return `${I}<div class="ng-group" data-suite-key="${key}" data-suite-name="${g.name}" data-suite-hub="${g.hub}">
${I}  ${head}${body ? `\n${body}` : ''}
${I}</div>`;
}
function tabHtml(tab, groups) {
  return `<div class="nav-dropdown nav-group" id="navgroup-${tab.key}">
                <a href="${tab.href}" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  ${svgIcon(tab.key, 'nav-logo')}
                  <span>${tab.label}</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu ng-menu" role="menu" style="--ng-cols:${tab.cols.length}">
                  <div class="ng-grid">
${tab.cols.map(col => `                  <div class="ng-col">\n${col.map(k => groups[k]).filter(Boolean).join('\n')}\n                  </div>`).join('\n')}
                  </div>
                </div>
              </div>`;
}

const HOME_LINK = '<a href="index.html" class="sheet-link nav-home"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h5v-6h4v6h5V9.5"/></svg><span>Home</span></a>';
// Every tool on one page (tools.html), next to Home.
const TOOLS_LINK = '<a href="tools.html" class="sheet-link nav-tools"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M17.5 14v7M14 17.5h7"/></svg><span>Workbench</span></a>';

// ---- per page ----------------------------------------------------------------
const NAV = /(<nav class="sheet-switcher" aria-label="Switch cheat sheet">)([\s\S]*?)(\n\s*<\/nav>)/;
let changed = 0;
// Only the one nav copy: build-nav-js.js then hands it to every page through nav.js.
for (const file of require('./nav/targets').navFiles()) {
  const p = path.join(__dirname, file);
  const before = fs.readFileSync(p, 'utf8');
  const nav = before.match(NAV);
  if (!nav) continue;
  const parts = topLevel(nav[2]);
  const used = new Set();
  const byId = id => { const i = parts.findIndex(x => x.startsWith(`<div class="nav-dropdown`) && x.includes(`id="${id}"`)); if (i >= 0) used.add(i); return i >= 0 ? parts[i] : null; };
  const byHref = href => { const i = parts.findIndex(x => x.startsWith(`<a href="${href}" class="sheet-link`)); if (i >= 0) used.add(i); return i >= 0 ? parts[i] : null; };
  // Earlier runs: groups inside the tabs, and the old single OS menu.
  const oldGroups = {};
  parts.forEach((x, i) => {
    if (!/id="(navgroup-[a-z]+|os-nav-dropdown)"/.test(x)) return;
    used.add(i);
    for (const m of x.matchAll(/<div class="ng-group" data-suite-key="([a-z]+)"/g)) {
      const start = x.indexOf(m[0]);
      oldGroups[m[1]] = x.slice(start, balancedDivEnd(x, start));
    }
  });

  const groups = {};
  for (const [key, def] of Object.entries(SUITES)) {
    let g = null;
    if (def.link) {
      byHref(def.link);   // the plain top-level link, if still there, is replaced by the group
      g = { name: def.name, hub: def.link, logo: def.logo, label: def.label, entries: [] };
    } else if (def.take) {
      g = { name: def.name, hub: '', logo: def.logo, label: def.label, entries: [] };
    } else {
      const own = byId(def.id);
      if (own) g = parseMenu(own);
      else if (def.gen) g = parseMenu(genSnippet(...def.gen));
      else if (oldGroups[key]) g = parseGroup(oldGroups[key]);
      if (g && def.hub) g.hub = def.hub;
    }
    if (g) groups[key] = g;
  }
  // Server internals takes its sheets out of whichever suite listed them.
  const takes = SUITES.internals.take;
  for (const [key, g] of Object.entries(groups)) {
    if (key === 'internals') continue;
    const taken = g.entries.filter(e => e.href && takes.includes(e.href));
    if (!taken.length) continue;
    groups.internals.entries.push(...taken);
    g.entries = g.entries.filter(e => !(e.href && takes.includes(e.href)));
    // Drop a heading left with nothing under it.
    g.entries = g.entries.filter((e, i, a) => e.h === undefined || (a[i + 1] && a[i + 1].h === undefined));
  }
  groups.internals.entries.sort((a, b) => takes.indexOf(a.href) - takes.indexOf(b.href));
  const rendered = Object.fromEntries(Object.entries(groups).map(([k, g]) => [k, groupHtml(k, g)]));

  byHref('index.html');
  byHref('tools.html');
  byHref('notes.html');   // retired Notes tab: recognise it so it is removed, not kept as unknown
  const out = [];
  for (const slot of ORDER) {
    if (slot === 'home') out.push(HOME_LINK);
    else if (slot === 'tools') out.push(TOOLS_LINK);
    else if (typeof slot === 'string') out.push(tabHtml(TABS.find(t => t.key === slot), rendered));
    else { const keep = byId(slot.id); if (keep) out.push(keep); }
  }
  parts.forEach((x, i) => { if (!used.has(i) && x.trim()) out.push(x); });   // anything unknown stays

  const navHtml = `${nav[1]}\n              ${out.join('\n              ')}${nav[3]}`;
  const after = before.replace(NAV, () => navHtml);
  if (after !== before) { fs.writeFileSync(p, after, 'utf8'); changed++; }
}
console.log(`Nav tabs written into ${changed} nav source file(s)`);
