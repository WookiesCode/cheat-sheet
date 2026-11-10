// build-portable.js
// Compiles every cheat sheet and interactive tool into one 100% offline HTML file:
// datacenter-cheatsheet-portable.html (Zero external requests, local CSS, local JS, local SVGs)
const fs = require('fs');
// Version-stamp common.js / styles.css in every page first (see build-stamp-assets.js).
require('./build-stamp-assets.js');
const path = require('path');
const vm = require('vm');

const SHEETS_CONFIG = [
  // Home (Mission Control) has no command data; common.js renders it.
  { key: 'home', file: 'index.html', js: null, name: 'Home', varName: null, prompt: '◆', cursor: '_', title: 'Mission Control', subtitle: 'Decode an error, check the node you are on, run a runbook, practise the commands', pill: 'Triage · Runbooks · Practice' },
  { key: 'tools', file: 'tools.html', js: null, name: 'Workbench', varName: null, prompt: '⚒', cursor: '_', title: 'Workbench', subtitle: 'Every tool in incident order, a paste box that opens the right one, and an address for each', pill: 'Every tool · one page' },
  { key: 'notes', file: 'notes.html', js: null, name: 'Notes', varName: null, prompt: '✎', cursor: '_', title: 'Field Notes', subtitle: 'Write as you work: one Markdown note per server and ticket, saved to cases/ or your Obsidian vault', pill: 'Markdown · per server · Obsidian' },
  { key: 'linux', file: 'linux.html', js: 'app.js', name: 'Linux', varName: 'CHEAT_SHEET_DATA', prompt: '$', cursor: '_', title: 'Ubuntu Linux Reference', subtitle: 'Interactive command cheat sheet, flag breakdown & pipe recipes', pill: 'Ubuntu / APT / systemd' },
  { key: 'cli-tools', file: 'cli-tools.html', js: 'cli-tools.js', name: 'CLI Tools', varName: 'CLI_TOOLS_DATA', prompt: 'CLI', cursor: '>', title: 'Modern CLI Tools Reference', subtitle: 'ripgrep, bat, fzf, fd, eza, zoxide, jq, dust, btop, delta, gum & modern shell utilities', pill: 'Rust / Go / Modern TUI' },
  { key: 'scripting', file: 'scripting.html', js: 'scripting.js', name: 'Scripting', varName: 'SCRIPTING_DATA', prompt: '#!/', cursor: '>', title: 'Scripting & Formats Reference', subtitle: 'Bash, Python 3.10+, JavaScript, TypeScript, PowerShell, Lua, JSON, YAML, TOML, Regex, AWK, SQLite, Git & Markdown', pill: 'Polyglot / Dev & Sysadmin' },
  { key: 'neovim', file: 'neovim.html', js: 'neovim.js', name: 'Neovim', varName: 'NEOVIM_CHEAT_SHEET_DATA', prompt: 'NV', cursor: ':', title: 'Neovim (NVIM) Reference', subtitle: 'Motions, operators, text objects, visual mode, windows, buffers, macros & Lua config', pill: 'v0.10+ / Lua / LSP' },
  { key: 'macos', file: 'macos.html', js: 'macos.js', name: 'macOS', varName: 'MACOS_CHEAT_SHEET_DATA', prompt: 'mac', cursor: '%', title: 'macOS Terminal & Sysadmin', subtitle: 'Zsh, launchctl, brew, diskutil, networksetup, defaults, dtrace, security & Apple Silicon', pill: 'Darwin / Apple Silicon / Zsh' },
  { key: 'windows', file: 'windows.html', js: 'windows.js', name: 'Windows', varName: 'WINDOWS_CHEAT_SHEET_DATA', prompt: 'C:\\>', cursor: '_', title: 'Windows Admin & Sysadmin', subtitle: 'PowerShell, WMI/CIM, winget, dism, sc.exe, netsh, WSL2, BitLocker & Active Directory', pill: 'Windows 11 / Server' },
  { key: 'nvidia', file: 'nvidia.html', js: 'nvidia.js', name: 'NVIDIA DC', varName: 'NVIDIA_CHEAT_SHEET_DATA', prompt: 'NV', cursor: '>', title: 'NVIDIA Datacenter GPU', subtitle: 'nvidia-smi, DCGM (dcgmi), NVLink/NVSwitch, MIG, ECC/Row Remap, InfiniBand/RDMA & Xid triage', pill: 'HGX / SXM / PCIe / IB' },
  { key: 'infiniband', file: 'infiniband.html', js: 'infiniband.js', name: 'InfiniBand', varName: 'IB_DATA', prompt: 'IB', cursor: '#', title: 'InfiniBand & RDMA Fabric', subtitle: 'Mellanox OFED, ConnectX-6/7/8, NDR 400G / XDR 800G, OpenSM, RoCEv2 & GPUDirect', pill: 'NDR / HDR / OFED / RoCE' },
  { key: 'switches', file: 'switches.html', js: 'switches.js', name: 'Switches', varName: 'SWITCH_DATA', prompt: 'SW', cursor: '#', title: 'Datacenter Switch CLI Reference', subtitle: 'SONiC / Azure NOS, Mellanox Onyx (MLNX-OS) & Cumulus Linux commands', pill: 'SONiC / Onyx / Cumulus' },
  { key: 'redfish', file: 'redfish.html', js: 'redfish.js', name: 'Redfish', varName: 'REDFISH_CHEAT_SHEET_DATA', prompt: 'RF', cursor: '>', title: 'DMTF Redfish REST API', subtitle: 'curl recipes, python-redfish, OEM actions (Dell iDRAC, HPE iLO, Supermicro, ASUS, GIGABYTE)', pill: 'REST / DMTF / v1 / OEM' },
  { key: 'ipmi', file: 'ipmi.html', js: 'ipmi.js', name: 'ipmitool', varName: 'IPMI_CHEAT_SHEET_DATA', prompt: 'IPMI', cursor: '>', title: 'ipmitool BMC Sysadmin', subtitle: 'Chassis power, SOL console, SEL event logs, SDR sensors, fan curves, raw hex & LAN config', pill: 'IPMI 2.0 / RMCP+ / SOL' },
  { key: 'fiber', file: 'fiber.html', js: 'fiber.js', name: 'Fiber', varName: 'FIBER_CHEAT_SHEET_DATA', prompt: 'FO', cursor: '>', title: 'Fiber & Transceiver DOM Optics', subtitle: 'Optical transceiver DOM/DDM telemetry, dmesg link state, FEC bit error rates & fiber cleaning', pill: 'QSFP-DD / OSFP / 400G / 800G' },
  { key: 'ethernet', file: 'ethernet.html', js: 'ethernet.js', name: 'Ethernet', varName: 'ETHERNET_CHEAT_SHEET_DATA', prompt: 'ETH', cursor: '#', title: 'Datacenter Ethernet & NIC Reference', subtitle: 'ethtool, iproute2 (ip link / ip route), bonding / LACP, SR-IOV, VLANs, ring buffers & FEC', pill: '100G / 200G / 400G / ethtool' },
  { key: 'motherboards', file: 'motherboards.html', js: 'motherboards.js', name: 'Motherboards', varName: 'MOTHERBOARD_CHEAT_SHEET_DATA', prompt: 'MB', cursor: '#', title: 'Server Motherboard Hardware', subtitle: 'ASUS, GIGABYTE, Supermicro, Dell & HPE AI server motherboard diagnostics, BIOS & sensors', pill: 'ASUS / GIGABYTE / SMC' },
  { key: 'bash', file: 'bash.html', js: 'bash.js', name: 'Bash', varName: 'BASH_CHEAT_SHEET_DATA', prompt: '$', cursor: '_', title: 'Bash & POSIX Shell Scripting', subtitle: 'Variables, loops, conditionals, functions, arrays, parameter expansion & error handling', pill: 'Bash 5 / POSIX sh' },
  { key: 'python', file: 'python.html', js: 'python.js', name: 'Python', varName: 'PYTHON_CHEAT_SHEET_DATA', prompt: 'py', cursor: '>>>', title: 'Python 3.10+ Reference & Scripting', subtitle: 'Variables, data types, collections, comprehensions, loops, pattern matching & file I/O', pill: 'Python 3.10+ / Standard Lib' },
  { key: 'javascript', file: 'javascript.html', js: 'javascript.js', name: 'JavaScript', varName: 'JS_CHEAT_SHEET_DATA', prompt: 'js', cursor: '>', title: 'JavaScript (ES2024 / Node.js) Reference', subtitle: 'Variables, data types, operators, loops, functions, array methods, async/await & JSON', pill: 'ES2024 / Node.js 20+' },
  { key: 'typescript', file: 'typescript.html', js: 'typescript.js', name: 'TypeScript', varName: 'TS_CHEAT_SHEET_DATA', prompt: 'ts', cursor: ':', title: 'TypeScript 5+ Reference & Types', subtitle: 'Primitives, interfaces, union types, type guards, generics, utility types & tsconfig', pill: 'TypeScript 5.x / Strict' },
  { key: 'powershell', file: 'powershell.html', js: 'powershell.js', name: 'PowerShell', varName: 'POWERSHELL_CHEAT_SHEET_DATA', prompt: 'PS', cursor: '>', title: 'PowerShell 7 / Windows & Linux Scripting', subtitle: 'Variables, typed objects, pipelines, conditionals, loops, functions, PSCustomObject & error handling', pill: 'PowerShell 7.x / pwsh' },
  { key: 'lua', file: 'lua.html', js: 'lua.js', name: 'Lua', varName: 'LUA_CHEAT_SHEET_DATA', prompt: 'lua', cursor: '>', title: 'Lua Scripting & Config Reference', subtitle: 'Variables, tables, loops, functions, patterns, error handling & Hyprland / Neovim config files', pill: 'Lua 5.5 / LuaJIT' },
  { key: 'jira', file: 'jira.html', js: 'jira.js', name: 'Jira', varName: 'JIRA_CHEAT_SHEET_DATA', prompt: 'JQL', cursor: '>', title: 'Jira JQL Queries', subtitle: 'Find every ticket for a server, rack, or position, plus queue, RMA, and shift handoff queries', pill: 'Jira Cloud / Data Center' },
  { key: 'json', file: 'json.html', js: 'json.js', name: 'JSON & jq', varName: 'JSON_CHEAT_SHEET_DATA', prompt: 'jq', cursor: '.', title: 'JSON Syntax & jq Query Reference', subtitle: 'JSON data types, quoting rules, validation, jq filters, slicing, formatting & transformations', pill: 'RFC 8259 / jq 1.7' },
  { key: 'yaml', file: 'yaml.html', js: 'yaml.js', name: 'YAML & yq', varName: 'YAML_CHEAT_SHEET_DATA', prompt: 'yq', cursor: '.', title: 'YAML 1.2 Syntax & yq CLI Reference', subtitle: 'Indentation, scalars, multi-line blocks (| vs >), anchors, aliases, and yq query/mutations', pill: 'YAML 1.2 / yq v4' },
  { key: 'toml', file: 'toml.html', js: 'toml.js', name: 'TOML', varName: 'TOML_CHEAT_SHEET_DATA', prompt: 'toml', cursor: '=', title: 'TOML Reference (v1.0.0)', subtitle: 'Tables [table], sub-tables, array of tables [[items]], key-value pairs, dates & Python parsing', pill: 'TOML v1.0.0 / tomllib' },
  { key: 'regex', file: 'regex.html', js: 'regex.js', name: 'Regex', varName: 'REGEX_CHEAT_SHEET_DATA', prompt: '/.*', cursor: '/g', title: 'Regular Expressions (PCRE / Modern RegExp)', subtitle: 'Tokens, character classes, quantifiers, lookahead/lookbehind, capture groups & datacenter recipes', pill: 'PCRE2 / ECMAScript' },
  { key: 'awk-sed', file: 'awk-sed.html', js: 'awk-sed.js', name: 'AWK & Sed', varName: 'AWK_SED_CHEAT_SHEET_DATA', prompt: "awk '", cursor: "'", title: 'AWK & Sed Stream Processing', subtitle: 'Field extraction, column math, BEGIN/END blocks, pattern filtering, and in-place stream editing', pill: 'POSIX AWK / GNU Sed' },
  { key: 'sql', file: 'sql.html', js: 'sql.js', name: 'SQL & SQLite', varName: 'SQL_CHEAT_SHEET_DATA', prompt: 'sqlite>', cursor: ';', title: 'SQL & SQLite CLI Reference', subtitle: 'SELECT queries, filtering, joins, GROUP BY, aggregations, DDL, transactions & SQLite CLI', pill: 'ANSI SQL / SQLite 3.45' },
  { key: 'git', file: 'git.html', js: 'git.js', name: 'Git', varName: 'GIT_CHEAT_SHEET_DATA', prompt: 'git', cursor: '>', title: 'Git Version Control Reference', subtitle: 'Setup, commits, branches, remotes, history search, undo & recovery, and offline transfer', pill: 'Git 2.x' },
  { key: 'markdown', file: 'markdown.html', js: 'markdown.js', name: 'Markdown', varName: 'MARKDOWN_CHEAT_SHEET_DATA', prompt: '#', cursor: '_', title: 'Markdown & GitHub Flavored Markdown', subtitle: 'Headings, lists, links, code blocks, tables, GitHub alerts & ticket templates', pill: 'CommonMark / GFM' },
];

// The entries above carry hand-written labels. Every other sheet is discovered from
// disk, so a new page is embedded without touching this list.
const isTooling = f => /^(build-|generate-|create-)/.test(f) || f === 'common.js' || f === 'global-search-index.js' || f === 'man-pages-data.js' || f === 'flag-index.js' || f === 'nav.js';
const decodeEntities = text => text
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#0?39;/g, "'").replace(/&amp;/g, '&');
const pageText = (html, regex) => {
  const match = html.match(regex);
  return match ? decodeEntities(match[1].replace(/<[^>]+>/g, '').trim()) : '';
};

// Old pages merged into a group page are redirects now: their data lives in the group page.
const { isStubFile } = require('./build-redirect-stub');
for (let i = SHEETS_CONFIG.length - 1; i >= 0; i--) if (isStubFile(path.join(__dirname, SHEETS_CONFIG[i].file))) SHEETS_CONFIG.splice(i, 1);

fs.readdirSync(__dirname)
  .filter(f => f.endsWith('.js') && !isTooling(f) && !SHEETS_CONFIG.some(cfg => cfg.js === f) && !isStubFile(path.join(__dirname, f.replace(/\.js$/, '.html'))))
  .sort()
  .forEach(js => {
    const key = js.replace(/\.js$/, '');
    const file = `${key}.html`;
    const html = fs.readFileSync(path.join(__dirname, file), 'utf8');
    const source = fs.readFileSync(path.join(__dirname, js), 'utf8');
    const varMatch = source.match(/const\s+([A-Z0-9_]*DATA)\s*=\s*\[/);
    if (!varMatch) throw new Error(`No data array found in ${js}`);
    SHEETS_CONFIG.push({
      key, file, js, name: key, varName: varMatch[1],
      prompt: pageText(html, /class="prompt-symbol"[^>]*>([\s\S]*?)<\/span>/),
      cursor: pageText(html, /class="cursor-block"[^>]*>([\s\S]*?)<\/span>/),
      title: pageText(html, /<h1[^>]*>([\s\S]*?)<\/h1>/),
      subtitle: pageText(html, /class="brand-subtitle"[^>]*>([\s\S]*?)<\/p>/),
      pill: pageText(html, /class="version-pill"[^>]*>([\s\S]*?)<\/span>/)
    });
  });

console.log('Compiling Datacenter Cheat Sheet Suite into single portable HTML...');

// 1. Read styles.css
let css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

// Replace external Google Font imports with clean system font stacks so portable file works 100% offline
css = css.replace(/@import\s+url\([^)]+\);?/gi, '');

// 2. Read the site's one nav copy (pages only carry a fallback; nav.js fills it in)
const navSourceHtml = fs.readFileSync(path.join(__dirname, require('./nav/targets').NAV_SOURCE), 'utf8');
const navMatch = navSourceHtml.match(/<nav class="sheet-switcher"[^>]*>([\s\S]*?)<\/nav>/);
let navLinksHtml = navMatch ? navMatch[1] : '';

// Convert every nav link to an in-page sheet link.
const keyForFile = file => (SHEETS_CONFIG.find(cfg => cfg.file === file) || {}).key;
// A merged group page's menu item (cli-tools.html#grep) opens that sheet filtered to the part.
navLinksHtml = navLinksHtml.replace(/href="([^"#]+\.html)#([a-z0-9-]+)"/g, (attr, file, part) => {
  const key = keyForFile(file);
  if (!key) throw new Error(`No portable sheet for nav link ${file}#${part}`);
  return `href="#sheet-${key}--${part}" data-sheet="${key}" data-part="${part}"`;
});
navLinksHtml = navLinksHtml.replace(/href="([^"#]+\.html)"/g, (attr, file) => {
  const key = keyForFile(file);
  if (!key) throw new Error(`No portable sheet for nav link ${file}`);
  return `href="#sheet-${key}" data-sheet="${key}"`;
});

// 3. Collect datasets
const allDatasets = {};
SHEETS_CONFIG.forEach(cfg => {
  if (!cfg.js) { allDatasets[cfg.key] = []; return; }
  const jsContent = fs.readFileSync(path.join(__dirname, cfg.js), 'utf8');
  const regex = new RegExp(`const\\s+${cfg.varName}\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);`);
  const match = jsContent.match(regex);
  if (!match) {
    console.error(`Failed to extract data for ${cfg.key}`);
    process.exit(1);
  }
  allDatasets[cfg.key] = eval(match[1]);
});

// 4. Read global-search-index.js and common.js
const globalSearchIndexJs = fs.readFileSync(path.join(__dirname, 'global-search-index.js'), 'utf8');
const commonJs = fs.readFileSync(path.join(__dirname, 'common.js'), 'utf8');
// The Terminal dock's emulator; pages load it on demand from vendor/, the 1-file copy carries it.
const xtermJs = ['xterm.js', 'addon-fit.js'].map(f => fs.readFileSync(path.join(__dirname, 'vendor', 'xterm', f), 'utf8')).join('\n');
const xtermCss = fs.readFileSync(path.join(__dirname, 'vendor', 'xterm', 'xterm.css'), 'utf8');
// Inlined: a file:// page never asks for favicon.ico beside it, and the 1-file copy travels alone.
const faviconUri = 'data:image/svg+xml;base64,' + fs.readFileSync(path.join(__dirname, 'favicon.svg')).toString('base64');

// 4b. Pages with interactive tools run their own unmodified code in a srcdoc frame,
// so each tool's globals stay isolated from the shell and from other tools.
const escapeScriptClose = source => source.replace(/<\/script/gi, '<\\/script');
const widgetPages = {};
SHEETS_CONFIG.forEach(cfg => {
  const html = fs.readFileSync(path.join(__dirname, cfg.file), 'utf8');
  if (!cfg.js || !html.includes('class="quick-widgets"')) return;
  const body = html
    .slice(html.indexOf('<body'), html.lastIndexOf('</body>'))
    .replace(/^<body[^>]*>/, '')
    .replace(/<nav class="sheet-switcher"[\s\S]*?<\/nav>/, '')
    .replace(/<script\b[\s\S]*?<\/script>/g, '');
  widgetPages[cfg.key] = {
    body,
    js: escapeScriptClose(fs.readFileSync(path.join(__dirname, cfg.js), 'utf8'))
  };
});
const widgetPayload = JSON.stringify({ common: escapeScriptClose(commonJs), pages: widgetPages }).replace(/</g, '\\u003c');

// 4c. Manuals. build-man-data.js writes the data that the reader in common.js opens.
const manData = JSON.parse(fs.readFileSync(path.join(__dirname, 'man-pages-data.js'), 'utf8').replace(/^window\.MAN_PAGES_DATA = /, '').replace(/;\s*$/, ''));
const manIndex = {
  pages: Object.keys(manData.pages).sort(),
  missing: manData.missing
};
const manPayload = JSON.stringify(manData).replace(/</g, '\\u003c');
// 4d. Flag index for "Explain a command" (build-index.js writes it).
const flagPayload = fs.readFileSync(path.join(__dirname, 'flag-index.js'), 'utf8').replace(/^[\s\S]*?window\.FLAG_INDEX = /, '').replace(/;\s*$/, '').replace(/</g, '\\u003c');

// 5. Build Portable HTML
const portableHtml = `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Datacenter &amp; Sysadmin Reference Suite — 100% Portable Air-Gapped Edition</title>
  <link rel="icon" type="image/svg+xml" href="${faviconUri}" />
  <style id="portable-css">
${css}

  .portable-widget-frame { display: block; width: 100%; height: 420px; border: 0; }

  .man-link-btn { padding: 0 0.4rem; color: var(--text-secondary); font-family: var(--font-mono); font-size: 0.68rem; background: none; border: 1px solid var(--border-strong); border-radius: 4px; cursor: pointer; }
  .man-link-btn:hover { color: var(--accent-primary); border-color: var(--accent-primary); }

  /* Portable font fallbacks for zero-internet environments */
  :root {
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  }

  .portable-badge {
    background: rgba(34, 197, 94, 0.15) !important;
    color: #4ade80 !important;
    border: 1px solid rgba(34, 197, 94, 0.3) !important;
    font-size: 0.65rem;
    font-weight: 700;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }
  </style>
</head>
<body>
  <header class="top-bar">
    <div class="container top-bar-inner">
      <div class="brand">
        <div class="terminal-badge" aria-hidden="true">
          <span class="prompt-symbol" id="brand-prompt">$</span><span class="cursor-block" id="brand-cursor">_</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1 id="brand-title">Ubuntu Linux Reference</h1>
            <span class="version-pill" id="brand-pill">Ubuntu / APT / systemd</span>
            <span class="portable-badge">100% OFFLINE PORTABLE</span>
            <nav class="sheet-switcher" aria-label="Switch cheat sheet" id="portable-sheet-nav">
${navLinksHtml}
            </nav>
          </div>
          <p class="brand-subtitle" id="brand-subtitle">Interactive command cheat sheet, flag breakdown &amp; pipe recipes</p>
        </div>
      </div>

      <div class="header-actions">

        <button type="button" id="density-toggle" class="action-btn" title="Toggle compact density">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span id="density-label">Compact</span>
        </button>

        <div class="theme-menu-wrapper" id="theme-menu-wrapper">
          <button type="button" id="theme-palette-btn" class="action-btn theme-palette-btn" title="Select Color Theme" aria-haspopup="true" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.4-.4-.8-.4-1.4 0-1.1.9-2 2-2h2.5c3.6 0 6.5-2.9 6.5-6.5C22 5.6 17.5 2 12 2z"></path>
            </svg>
            <span id="theme-btn-label">Theme</span>
            <svg class="dropdown-caret" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
        <button type="button" id="theme-toggle" style="display:none;" aria-hidden="true"></button>
      </div>
    </div>

  </header>

  <main class="container main-layout">
    <div id="portable-widgets"></div>
    <div id="sections-container" class="sections-grid">
      <!-- Populated dynamically -->
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden">
      <div class="empty-icon">404</div>
      <h3>No matching commands found</h3>
      <p>Try clearing your filter or press <kbd>Ctrl+K</kbd> to search across all other sheets.</p>
      <button type="button" id="reset-search-btn" class="action-btn">Reset Filters</button>
    </div>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <span>Datacenter &amp; AI Hardware Sysadmin Reference Suite — 100% Offline Portable Single-File Build</span>
      </div>
      <div class="footer-shortcuts">
        <span><kbd>Ctrl+K</kbd> Global Search (768 cmds)</span>
        <span><kbd>/</kbd> In-Sheet Filter</span>
        <span><kbd>Esc</kbd> Clear</span>
        <span><kbd>Ctrl+P</kbd> Print</span>
      </div>
    </div>
  </footer>

  <div id="toast" class="toast" role="status" aria-live="polite">
    <span class="toast-check">&#10003;</span>
    <span id="toast-text">Copied to clipboard</span>
  </div>

  <!-- Embedded Global Search Index -->
  <script>
${escapeScriptClose(globalSearchIndexJs)}
  </script>

  <!-- Embedded Datasets for Every Sheet -->
  <script type="application/json" id="portable-widget-pages">${widgetPayload}</script>
  <script type="application/json" id="portable-man-pages">${manPayload}</script>
  <script type="application/json" id="portable-flag-index">${flagPayload}</script>
  <script>
window.PORTABLE_SHEETS = ${JSON.stringify(SHEETS_CONFIG, null, 2)};
window.PORTABLE_MAN_INDEX = ${JSON.stringify(manIndex)};
window.PORTABLE_DATASETS = ${escapeScriptClose(JSON.stringify(allDatasets, null, 2))};
  </script>

  <!-- Terminal emulator (xterm.js, MIT) for the Terminal dock -->
  <style>
${xtermCss}
  </style>
  <script>
${escapeScriptClose(xtermJs)}
  </script>

  <!-- Embedded Shared Common Logic (Target Bar, Global Search Ctrl+K, Triage Modal) -->
  <script>
${escapeScriptClose(commonJs)}
  </script>

  <!-- Portable SPA Runtime -->
  <script>
(function() {
  'use strict';

  const SHEETS = window.PORTABLE_SHEETS;
  const DATASETS = window.PORTABLE_DATASETS;

  const state = {
    currentSheet: 'home',
    searchQuery: '',
    activeCategory: 'all',
    savedOnly: false,
    theme: localStorage.getItem('linux_cs_theme') || 'dark',
    bookmarks: new Set(JSON.parse(localStorage.getItem('portable_bookmarks') || '[]'))
  };

  const searchInput = document.getElementById('search-input');
  const categoryTabsEl = document.getElementById('category-tabs');
  const sectionsContainer = document.getElementById('sections-container');
  const visibleCountEl = document.getElementById('visible-count');
  const emptyStateEl = document.getElementById('empty-state');
  const savedFilterBtn = document.getElementById('saved-filter-btn');
  const savedCountEl = document.getElementById('saved-count');
  const printBtn = document.getElementById('print-btn');
  const themeToggleBtn = document.getElementById('theme-toggle');
  const resetSearchBtn = document.getElementById('reset-search-btn');

  function getActiveSheetConfig() {
    return SHEETS.find(s => s.key === state.currentSheet) || SHEETS[0];
  }

  function getActiveSheetData() {
    return DATASETS[state.currentSheet] || [];
  }

  const widgetData = JSON.parse(document.getElementById('portable-widget-pages').textContent);
  const widgetHost = document.getElementById('portable-widgets');
  // Height must come from the tools alone: body and main stretch to fill the frame,
  // so measuring them would grow the frame without end.
  const WIDGET_CSS = 'html,body{background:transparent!important;min-height:0!important}' +
    'body>*:not(main):not(.toast){display:none!important}' +
    'main{margin:0!important;padding:0!important;max-width:none!important;min-height:0!important;flex:none!important}' +
    'main>*:not(.quick-widgets){display:none!important}';
  const WIDGET_BRIDGE = '(function(){' +
    'var tools=document.querySelector(".quick-widgets");' +
    'function report(){parent.postMessage({portableWidgetHeight:tools.getBoundingClientRect().height+16},"*");}' +
    'new ResizeObserver(report).observe(tools);window.addEventListener("load",report);' +
    'window.addEventListener("message",function(e){' +
    'if(e.data&&e.data.portableTheme)document.documentElement.setAttribute("data-theme",e.data.portableTheme);});' +
    '})();';

  function widgetDocument(key) {
    const page = widgetData.pages[key];
    const open = '<' + 'script>';
    const close = '</' + 'script>';
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';
    return '<!DOCTYPE html><html lang="en" data-theme="' + escapeHtml(theme) + '"><head><meta charset="UTF-8">' +
      '<style>' + document.getElementById('portable-css').textContent + WIDGET_CSS + '</style></head><body>' +
      page.body + open + widgetData.common + close + open + page.js + close + open + WIDGET_BRIDGE + close +
      '</body></html>';
  }

  function showWidgets(key) {
    widgetHost.textContent = '';
    if (!widgetData.pages[key]) return;
    const frame = document.createElement('iframe');
    frame.className = 'portable-widget-frame';
    frame.title = 'Interactive tools';
    frame.setAttribute('allow', 'clipboard-write');
    frame.srcdoc = widgetDocument(key);
    widgetHost.appendChild(frame);
  }

  window.addEventListener('message', (e) => {
    const frame = widgetHost.querySelector('iframe');
    if (frame && e.source === frame.contentWindow && e.data && typeof e.data.portableWidgetHeight === 'number') {
      frame.style.height = Math.ceil(e.data.portableWidgetHeight) + 'px';
    }
    if (frame && e.source === frame.contentWindow && e.data && e.data.portableQueryFill) {
      applyQueryFill(e.data.portableQueryFill);
    }
  });

  // The Jira form runs in a frame, so its values are applied to the queries here.
  let jiraTemplates = null;

  function applyQueryFill(values) {
    if (!jiraTemplates) jiraTemplates = JSON.parse(JSON.stringify(DATASETS.jira));
    const fill = query => Object.entries(values).reduce(
      (text, [token, value]) => (value ? text.split(token).join(value) : text), query);
    DATASETS.jira.forEach((section, s) => {
      section.commands.forEach((command, c) => {
        const template = jiraTemplates[s].commands[c];
        command.cmd = fill(template.cmd);
        if (template.subcommands) {
          command.subcommands = template.subcommands.map(([query, note]) => [fill(query), note]);
        }
      });
    });
    if (state.currentSheet === 'jira') renderSections();
  }

  new MutationObserver(() => {
    const frame = widgetHost.querySelector('iframe');
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ portableTheme: document.documentElement.getAttribute('data-theme') }, '*');
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const manIndex = window.PORTABLE_MAN_INDEX;

  function manTool(cmd) {
    const [word, sub] = String(cmd).trim().replace(/^sudo\\s+/, '').replace(/^[A-Z_]+=\\S+\\s+/, '').split(/\\s+/);
    if (sub && manIndex.pages.includes(word + '-' + sub)) return word + '-' + sub;
    return manIndex.pages.includes(word) || manIndex.missing[word] ? word : '';
  }

  function manButton(cmd) {
    const tool = manTool(cmd);
    return tool ? '<button type="button" class="man-link-btn" data-man="' + escapeHtml(tool) + '" title="Open the man page reference">man</button>' : '';
  }

  function switchSheet(sheetKey, targetHash = '', part = '') {
    const cfg = SHEETS.find(s => s.key === sheetKey);
    if (!cfg) return;

    state.currentSheet = sheetKey;
    window.CheatSheetCommon.setSheetContext(cfg.file);
    state.activeCategory = part || 'all';
    state.searchQuery = '';
    state.savedOnly = false;
    searchInput.value = '';

    // Update Brand UI
    document.getElementById('brand-prompt').textContent = cfg.prompt;
    document.getElementById('brand-cursor').textContent = cfg.cursor;
    document.getElementById('brand-title').textContent = cfg.title;
    document.getElementById('brand-subtitle').textContent = cfg.subtitle;
    document.getElementById('brand-pill').textContent = cfg.pill;

    // Update Nav links & dropdown items
    document.querySelectorAll('#portable-sheet-nav .sheet-link, #portable-sheet-nav .dropdown-item').forEach(link => {
      link.classList.toggle('active', link.dataset.sheet === sheetKey && (link.dataset.part || '') === part);
    });
    document.querySelectorAll('#portable-sheet-nav .nav-dropdown').forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) toggle.classList.toggle('active', !!dropdown.querySelector('.dropdown-item.active'));
    });

    showWidgets(sheetKey);
    renderCategoryTabs();
    renderSections();

    if (targetHash) {
      setTimeout(() => window.AntigravityCommon?.scrollToCard(targetHash), 100);
    }
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightCommand(raw) {
    const escaped = escapeHtml(raw);
    return escaped.replace(
      /(^|\\s|;|&&|\\|\\||\\|)(sudo\\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\\|\\||&&|\\|)/g,
      (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
        if (strLiteral) return '<span class="tok-str">' + strLiteral + '</span>';
        if (flagPart) return '<span class="tok-flag">' + flagPart + '</span>';
        if (operatorPart) return '<span class="tok-pipe">' + operatorPart + '</span>';
        if (cmdName) {
          const prefix = lead || '';
          const sudoHtml = sudoPart ? '<span class="tok-pipe">' + sudoPart + '</span>' : '';
          return prefix + sudoHtml + '<span class="tok-cmd">' + cmdName + '</span>';
        }
        return match;
      }
    );
  }

  function renderCategoryTabs() {
    const data = getActiveSheetData();
    const totalCommands = data.reduce((sum, s) => sum + (s.commands ? s.commands.length : 0), 0);
    const optionsHtml = [
      '<option value="all" ' + (state.activeCategory === 'all' ? 'selected' : '') + '>All Sections (' + totalCommands + ')</option>'
    ];

    for (const section of data) {
      const isSelected = state.activeCategory === section.id ? 'selected' : '';
      optionsHtml.push(
        '<option value="' + section.id + '" ' + isSelected + '>' + escapeHtml(section.title) + ' (' + (section.commands ? section.commands.length : 0) + ')</option>'
      );
    }

    const resetBtnHtml =
      state.activeCategory !== 'all'
        ? '<button type="button" class="cat-reset-btn" data-cat="all" title="Show all sections">✕ Show All</button>'
        : '';

    categoryTabsEl.innerHTML =
      '<div class="cat-select-wrap">' +
        '<select id="category-select" class="cat-select" aria-label="Filter by section">' +
          optionsHtml.join('') +
        '</select>' +
        resetBtnHtml +
      '</div>';

    const sel = document.getElementById('category-select');
    if (sel) {
      sel.addEventListener('change', (e) => {
        state.activeCategory = e.target.value;
        renderSections();
      });
    }

    const resetBtn = categoryTabsEl.querySelector('.cat-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.activeCategory = 'all';
        renderCategoryTabs();
        renderSections();
      });
    }
  }

  function matchesSearch(cmdObj, section, query) {
    if (!query) return true;
    const terms = query.toLowerCase().split(/\\s+/).filter(Boolean);
    const haystack = [
      cmdObj.desc || '',
      cmdObj.cmd || '',
      cmdObj.details || '',
      section.title || '',
      section.subtitle || '',
      ...(cmdObj.tags || []),
      ...(cmdObj.flags || []).flat(),
      ...(cmdObj.subcommands || []).flat()
    ].join(' ').toLowerCase();

    return terms.every(t => haystack.includes(t));
  }

  let allRenderedCards = [];
  function packMasonry() {
    if (!sectionsContainer) return;
    if (sectionsContainer.querySelectorAll('.section-card').length === 0) {
      allRenderedCards = [];
      return;
    }
    const directCards = [...sectionsContainer.querySelectorAll(':scope > .section-card')];
    if (directCards.length > 0) {
      allRenderedCards = directCards;
    }
    if (allRenderedCards.length === 0) return;

    const containerWidth = sectionsContainer.clientWidth || window.innerWidth;
    const colCount = Math.max(1, Math.min(allRenderedCards.length, Math.floor((containerWidth + 18) / (380 + 18))));
    if (colCount <= 1) {
      sectionsContainer.classList.remove('has-masonry');
      sectionsContainer.replaceChildren(...allRenderedCards);
      return;
    }

    sectionsContainer.classList.add('has-masonry');

    const cols = Array.from({ length: colCount }, () => {
      const col = document.createElement('div');
      col.className = 'masonry-col';
      return col;
    });
    const colHeights = new Array(colCount).fill(0);
    sectionsContainer.replaceChildren(...cols);

    for (const card of allRenderedCards) {
      let shortestIdx = 0;
      for (let i = 1; i < colCount; i++) {
        if (colHeights[i] < colHeights[shortestIdx]) {
          shortestIdx = i;
        }
      }
      cols[shortestIdx].appendChild(card);
      colHeights[shortestIdx] += card.offsetHeight + 18;
    }
  }

  let masonryResizeTimer = null;
  function scheduleMasonry() {
    clearTimeout(masonryResizeTimer);
    masonryResizeTimer = setTimeout(packMasonry, 40);
  }
  window.addEventListener('resize', scheduleMasonry);
  document.addEventListener('fullscreenchange', scheduleMasonry);
  document.addEventListener('webkitfullscreenchange', scheduleMasonry);
  window.packMasonry = packMasonry;

  function renderSections() {
    if (!state.currentSheet) return; // the man page view is open
    const data = getActiveSheetData();
    let visibleCommandsCount = 0;
    const cardsHtml = [];

    for (const section of data) {
      if (state.activeCategory !== 'all' && state.activeCategory !== section.id && state.activeCategory !== section.part) {
        continue;
      }

      const filteredCommands = (section.commands || []).filter(cmdObj => {
        if (state.savedOnly && !state.bookmarks.has(cmdObj.id)) return false;
        return matchesSearch(cmdObj, section, state.searchQuery);
      });

      if (filteredCommands.length === 0) continue;
      visibleCommandsCount += filteredCommands.length;

      const itemsHtml = filteredCommands.map(item => {
        const isSaved = state.bookmarks.has(item.id);
        const dangerHtml = item.danger ? '<span class="danger-badge">! ' + escapeHtml(item.danger) + '</span>' : '';
        const tipHtml = item.tip ? '<span class="tip-badge">' + escapeHtml(item.tip) + '</span>' : '';
        const detailsHtml = item.details ? '<p class="cmd-details">' + escapeHtml(item.details) + '</p>' : '';

        const flagsHtml = item.flags && item.flags.length
          ? '<div class="flag-pills">' +
              item.flags.map(([flag, exp]) => '<span class="flag-pill"><code>' + escapeHtml(flag) + '</code> <span>' + escapeHtml(exp) + '</span></span>').join('') +
            '</div>'
          : '';

        const subcommandsHtml = item.subcommands && item.subcommands.length
          ? '<div class="subcmd-list">' +
              '<span class="subcmd-header">Subcommands &amp; Variants (click any to copy)</span>' +
              item.subcommands.map(([subcmd, exp]) =>
                '<div class="subcmd-row" data-copy="' + escapeHtml(subcmd) + '" title="Click to copy subcommand">' +
                  '<code>' + escapeHtml(subcmd) + '</code>' +
                  '<span>' + escapeHtml(exp) + '</span>' +
                '</div>'
              ).join('') +
            '</div>'
          : '';

        const codeBoxHtml = item.diagram
          ? window.CheatSheetCommon.renderDiagram(item.diagram)
          : item.hideCode ? '' : (
              '<div class="cmd-code-box" data-copy="' + escapeHtml(item.cmd.split('   |   ')[0].trim()) + '" title="Click to copy command">' +
              '<code class="cmd-code">' + highlightCommand(item.cmd) + '</code>' +
              '<span class="copy-hint">Copy</span>' +
            '</div>'
            );

        return (
          '<div class="cmd-item" id="' + item.id + '" data-id="' + item.id + '">' +
            '<div class="cmd-top-row">' +
              '<div class="cmd-desc">' +
                '<span>' + escapeHtml(item.desc) + '</span>' +
                tipHtml +
                dangerHtml +
              '</div>' +
              '<div class="cmd-actions">' +
                (item.diagram || item.hideCode ? '' : manButton(item.cmd)) +
                '<button type="button" class="icon-btn bookmark-btn ' + (isSaved ? 'bookmarked' : '') + '" data-bookmark-id="' + item.id + '" title="' + (isSaved ? 'Remove bookmark' : 'Bookmark command') + '">' +
                  (isSaved ? '★' : '☆') +
                '</button>' +
              '</div>' +
            '</div>' +
            codeBoxHtml +
            detailsHtml +
            flagsHtml +
            subcommandsHtml +
          '</div>'
        );
      }).join('');

      cardsHtml.push(
        '<article class="section-card" id="sec-' + section.id + '">' +
          '<header class="section-header">' +
            '<div class="section-title-wrap">' +
              '<span class="section-badge">' + escapeHtml(section.badge || '') + '</span>' +
              '<div>' +
                '<h2 class="section-title">' + escapeHtml(section.title) + '</h2>' +
                '<p class="section-subtitle">' + escapeHtml(section.subtitle || '') + '</p>' +
              '</div>' +
            '</div>' +
            '<span class="count-badge">' + filteredCommands.length + '</span>' +
          '</header>' +
          '<div class="command-list">' +
            itemsHtml +
          '</div>' +
        '</article>'
      );
    }

    sectionsContainer.innerHTML = cardsHtml.join('');
    packMasonry();
    visibleCountEl.textContent = visibleCommandsCount;
    savedCountEl.textContent = state.bookmarks.size;

    if (visibleCommandsCount === 0) {
      emptyStateEl.classList.remove('hidden');
      sectionsContainer.classList.add('hidden');
    } else {
      emptyStateEl.classList.add('hidden');
      sectionsContainer.classList.remove('hidden');
    }
  }

  function applyTheme(theme) {
    state.theme = theme;
    if (window.AntigravityCommon && window.AntigravityCommon.applyTheme) {
      window.AntigravityCommon.applyTheme(theme);
    } else {
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('linux_cs_theme', theme);
    }
  }

  function initEvents() {
    // Nav sheet links & dropdown menu items
    document.querySelectorAll('#portable-sheet-nav .sheet-link:not(.dropdown-toggle), #portable-sheet-nav .dropdown-item').forEach(link => {
      link.addEventListener('click', (e) => {
        const sheet = link.dataset.sheet;
        if (sheet) {
          e.preventDefault();
          link.closest('.nav-dropdown')?.classList.remove('open');
          const part = link.dataset.part || '';
          switchSheet(sheet, '', part);
          window.location.hash = 'sheet-' + sheet + (part ? '--' + part : '');
        }
      });
    });

    // In-sheet search
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value.trim();
      renderSections();
    });

    // Bookmark / copy clicks on cards
    sectionsContainer.addEventListener('click', (e) => {
      const manLink = e.target.closest('.man-link-btn');
      if (manLink) {
        window.CheatSheetCommon.openManuals(manLink.dataset.man);
        return;
      }

      const copyBox = e.target.closest('.cmd-code-box, .subcmd-row');
      if (copyBox && copyBox.dataset.copy) {
        navigator.clipboard.writeText(copyBox.dataset.copy);
        // common.js shows its own toast when it fills in Rack Targets values.
        if (!window.CheatSheetCommon.substituteVariables(copyBox.dataset.copy).substituted) {
          window.CheatSheetCommon.showToast('Copied to clipboard');
        }
        return;
      }

      const bookmarkBtn = e.target.closest('.bookmark-btn');
      if (bookmarkBtn) {
        const id = bookmarkBtn.dataset.bookmarkId;
        if (state.bookmarks.has(id)) {
          state.bookmarks.delete(id);
          window.AntigravityCommon?.showToast('Removed from saved');
        } else {
          state.bookmarks.add(id);
          window.AntigravityCommon?.showToast('Saved command to bookmarks');
        }
        localStorage.setItem('portable_bookmarks', JSON.stringify([...state.bookmarks]));
        renderSections();
      }
    });

    savedFilterBtn.addEventListener('click', () => {
      state.savedOnly = !state.savedOnly;
      savedFilterBtn.classList.toggle('active', state.savedOnly);
      renderSections();
    });

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      });
    }

    resetSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      state.activeCategory = 'all';
      state.savedOnly = false;
      searchInput.value = '';
      renderCategoryTabs();
      renderSections();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      } else if (e.key === 'Escape' && (document.activeElement === searchInput || state.searchQuery)) {
        searchInput.value = '';
        state.searchQuery = '';
        searchInput.blur();
        renderSections();
      }
    });

    // Hash check on load
    const hash = window.location.hash.replace(/^#/, '');
    if (hash.startsWith('sheet-')) {
      const [sKey, part] = hash.replace('sheet-', '').split('--');
      switchSheet(sKey, '', part || '');
    } else if (hash === 'man' || hash.startsWith('man-')) {
      switchSheet('home');
      window.CheatSheetCommon.openManuals(hash.replace(/^man-?/, ''));
    } else {
      switchSheet('home');
    }
  }

  window.portableOpenSheet = function (file, id) {
    const [page, part] = String(file).split('#');
    const cfg = SHEETS.find(s => s.file === page);
    if (cfg) {
      switchSheet(cfg.key, id, part || '');
      window.location.hash = 'sheet-' + cfg.key + (part ? '--' + part : '');
    }
  };

  applyTheme(state.theme);
  initEvents();
})();
  </script>
</body>
</html>
`;

const outPath = path.join(__dirname, 'datacenter-cheatsheet-portable.html');
// The runtime lives in a template literal, so an escaping slip is invisible to
// `node --check` on this file. Parse the generated scripts before writing them.
for (const [, script] of portableHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
  new vm.Script(script);
}

fs.writeFileSync(outPath, portableHtml, 'utf8');

const stats = fs.statSync(outPath);
console.log(`Successfully generated standalone portable file!`);
console.log(`File: ${outPath}`);
console.log(`Size: ${(stats.size / 1024).toFixed(1)} KB`);
