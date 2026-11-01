// generate-ipmi-suite.js
// Generates all 7 standalone ipmitool cheat sheets and updates the ipmitool dropdown across all HTML sheets.
const fs = require('fs');
const path = require('path');

// 1. Read ipmi.js to extract IPMI_CHEAT_SHEET_DATA
const ipmiJs = fs.readFileSync(path.join(__dirname, 'ipmi.js'), 'utf8');
const dataEndIdx = ipmiJs.indexOf('const state = {');
const dataCode = ipmiJs.slice(0, dataEndIdx) + '\nIPMI_CHEAT_SHEET_DATA;';
const IPMI_CHEAT_SHEET_DATA = eval(dataCode);
console.log(`Loaded ${IPMI_CHEAT_SHEET_DATA.length} ipmitool sections from ipmi.js`);

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 2. Define the ipmitool Navbar Dropdown Snippet
const IPMI_NAVBAR_SNIPPET = `              <div class="nav-dropdown" id="ipmi-nav-dropdown">
                <a href="ipmi.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7.5 12h2l1.5-3 2 6 1.5-3h2" stroke="#4ade80" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  <span>ipmitool</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu ipmi-dropdown-menu" role="menu">
                  <a href="ipmi.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 ipmitool Hub &amp; Command Builder</a>
                  <div class="dropdown-divider"></div>
                  <div class="ipmi-dropdown-grid">
                    <div class="ipmi-dropdown-col">
                      <div class="ipmi-dropdown-heading">Power, Boot &amp; Sensors</div>
                      <a href="ipmi-chassis-power.html" class="dropdown-item" role="menuitem"><code>pwr</code> <span class="cmd-desc">Chassis Power &amp; UID</span></a>
                      <a href="ipmi-boot-override.html" class="dropdown-item" role="menuitem"><code>boot</code> <span class="cmd-desc">Bootdev &amp; Boot Flags</span></a>
                      <a href="ipmi-sensors-sdr.html" class="dropdown-item" role="menuitem"><code>sdr</code> <span class="cmd-desc">SDR Sensors &amp; DCMI Power</span></a>
                    </div>
                    <div class="ipmi-dropdown-col">
                      <div class="ipmi-dropdown-heading">Console, Network &amp; Hardware</div>
                      <a href="ipmi-sel-logs.html" class="dropdown-item" role="menuitem"><code>sel</code> <span class="cmd-desc">SEL Event Logs &amp; Triage</span></a>
                      <a href="ipmi-sol-console.html" class="dropdown-item" role="menuitem"><code>sol</code> <span class="cmd-desc">SOL Serial Console</span></a>
                      <a href="ipmi-bmc-lan-users.html" class="dropdown-item" role="menuitem"><code>lan</code> <span class="cmd-desc">BMC Network &amp; Users</span></a>
                      <a href="ipmi-fru-mc.html" class="dropdown-item" role="menuitem"><code>fru</code> <span class="cmd-desc">FRU, BMC Reset &amp; Watchdog</span></a>
                    </div>
                  </div>
                </div>
              </div>`;

// 3. Update navbar across all existing HTML files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'datacenter-cheatsheet-portable.html' && f !== 'omarchy.html');
const ipmiLinkPattern = /<a href="ipmi\.html" class="sheet-link(?: active)?">[\s\S]*?<\/svg>\s*ipmitool<\/a>/;

let updatedNavCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (ipmiLinkPattern.test(content)) {
    content = content.replace(ipmiLinkPattern, IPMI_NAVBAR_SNIPPET);
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
    updatedNavCount++;
  }
}
console.log(`Updated navbar with ipmitool dropdown in ${updatedNavCount} existing HTML files`);

// Read pristine updated navbar from index.html
const indexHtmlForNav = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

// 4. Section mapping & file keys
const SECTION_MAP = {
  'chassis-power': {
    file: 'ipmi-chassis-power',
    badge: 'pwr',
    name: 'Chassis Power & UID',
    heading: 'Power Actions (on/off/cycle/reset), Status & Chassis UID Locator',
    proTip: {
      desc: 'Chassis Power Cycling & Hard Freeze Triage',
      cmd: 'ipmitool -I lanplus -H $BMC_IP -U admin -P password chassis power status',
      details: 'Use "power soft" first to give ACPI OS time to cleanly shutdown daemons and unmount NVMe filesystems. If the OS kernel is hard frozen, use "power cycle" (powers off, waits 1s, powers on) or pulse an NMI diagnostics trigger to force a kernel crash dump.',
      tip: 'Run "chassis status" after unexpected node drops to inspect "Last Power Event" (e.g. AC failed, power overload, power interlock).',
      flags: [
        ['chassis power status', 'Query whether the host motherboard is currently on or off'],
        ['chassis power cycle', 'Perform a cold power cycle (drop main 12V rails and re-engage)'],
        ['chassis identify <seconds>', 'Blink front/rear blue UID LED to visually identify the physical chassis in a 42U rack']
      ]
    }
  },
  'boot-override': {
    file: 'ipmi-boot-override',
    badge: 'boot',
    name: 'Boot Device Override',
    heading: 'UEFI PXE, BIOS Setup, Virtual Media & Boot Flag Watchdog',
    proTip: {
      desc: 'Automated PXE Re-imaging & Boot Flag Persistence',
      cmd: 'ipmitool -I lanplus -H $BMC_IP -U admin -P password chassis bootdev pxe options=efiboot',
      details: 'By default, IPMI bootdev flags are volatile and expire after 60 seconds if the host does not reboot immediately. To avoid missing the boot flag window, run "chassis bootparam set bootflag no-timeout" or combine the bootdev command with "chassis power reset" on a single shell line.',
      tip: 'Always specify "options=efiboot" on modern UEFI servers to avoid legacy BIOS CSM boot failure.',
      flags: [
        ['bootdev pxe', 'Direct next host boot to UEFI PXE network installer (HTTP/TFTP)'],
        ['bootdev bios', 'Force the host server directly into UEFI BIOS Setup on the next boot'],
        ['bootparam set bootflag no-timeout', 'Keep the boot override persistent until the machine actually executes the reboot']
      ]
    }
  },
  'sensors-sdr-dcmi': {
    file: 'ipmi-sensors-sdr',
    badge: 'sdr',
    name: 'Sensors & DCMI Power',
    heading: 'SDR Sensor Telemetry, Fan RPMs, Thermal Limits & DCMI Wattage',
    proTip: {
      desc: 'Hardware Environmental Triage & Thermal Throttling Detection',
      cmd: 'ipmitool -I lanplus -H $BMC_IP -U admin -P password sdr elist full',
      details: 'SDR elist full prints real-time analog sensor values (volts, amps, RPMs, Celsius) with sensor state ("ok", "nc", "cr"). DCMI (Data Center Management Interface) commands query calibrated high-frequency power meters to monitor instantaneous wattage and rolling averages.',
      tip: 'Filter SDR by sensor type using "sdr type Temperature" or "sdr type Fan" to cut through noisy SDR catalogs.',
      flags: [
        ['sdr elist full', 'Display all populated sensors with calibrated analog units and health status'],
        ['dcmi power reading', 'Read instantaneous, minimum, maximum, and average server power consumption in Watts'],
        ['sensor get <name>', 'Display lower and upper non-critical, critical, and non-recoverable threshold boundaries']
      ]
    }
  },
  'sel-logs': {
    file: 'ipmi-sel-logs',
    badge: 'sel',
    name: 'SEL Logs & Faults',
    heading: 'BMC System Event Log (SEL), Hardware Faults & Event Log Clearing',
    proTip: {
      desc: 'Out-of-Band Hardware Event Triage & Post-Mortem Crash Analysis',
      cmd: 'ipmitool -I lanplus -H $BMC_IP -U admin -P password sel elist',
      details: 'The BMC System Event Log captures critical hardware events that bypass the host OS, such as uncorrectable multi-bit ECC errors, PCIe AER fatal timeouts, power supply failures, and CPU thermal trips. "sel elist" cross-references raw sensor numbers with human-readable SDR names.',
      tip: 'Back up SEL entries to a timestamped file before calling "sel clear", as cleared events cannot be recovered.',
      flags: [
        ['sel elist', 'Print human-readable SEL entries cross-referenced against the SDR catalog'],
        ['sel info', 'Inspect SEL fullness percentage, total entries, and free record space'],
        ['sel clear', 'Purge the BMC SEL memory buffer after documenting diagnostic fault traces']
      ]
    }
  },
  'sol-console': {
    file: 'ipmi-sol-console',
    badge: 'sol',
    name: 'SOL Serial Console',
    heading: 'Serial-over-LAN (SOL) Console, Baud Rates & Session Deactivation',
    proTip: {
      desc: 'Out-of-Band Serial Console Operations & Session Recovery',
      cmd: 'ipmitool -I lanplus -H $BMC_IP -U admin -P password sol activate',
      details: 'Serial-over-LAN redirects the host server\'s UART serial port (COM1 / ttyS0 / ttyS1) over the encrypted IPMI 2.0 RMCP+ channel. If another administrator leaves an SOL session open, use "sol deactivate" to forcibly release the session.',
      tip: 'To disconnect an active SOL session without killing the terminal, press Enter, then ~ (tilde), then . (period).',
      flags: [
        ['sol activate', 'Open bidirectional Serial-over-LAN terminal to view BIOS POST and GRUB'],
        ['sol deactivate', 'Forcefully terminate a hung or abandoned SOL session on the BMC'],
        ['sol info', 'Inspect SOL baud rate (typically 115200), character accumulation, and payload encryption']
      ]
    }
  },
  'bmc-lan-users': {
    file: 'ipmi-bmc-lan-users',
    badge: 'lan',
    name: 'BMC Network & Users',
    heading: 'BMC IPv6/IPv4 Network Setup (lan6/lan), User Accounts & Password Reset',
    proTip: {
      desc: 'BMC Out-of-Band Network Provisioning & Root Password Recovery',
      cmd: 'ipmitool -I lanplus -H $BMC_IP -U admin -P password lan print 1',
      details: 'Configure dedicated or shared BMC network interfaces across channel 1 (or channel 8). In-band access from the host OS via "ipmitool user set password 2 <newpass>" allows root administrators to recover lost BMC passwords without physical serial cables.',
      tip: 'Modern AI clusters use IPv6 link-local and static ULA addressing; query channel 1 using "lan6 print 1".',
      flags: [
        ['lan print 1', 'Display current BMC IP address, MAC address, subnet mask, and default gateway'],
        ['lan6 print 1', 'Display current BMC IPv6 global, link-local, SLAAC, and DHCPv6 addresses'],
        ['user set password <id> <pass>', 'Change BMC user password directly from local host or over RMCP+']
      ]
    }
  },
  'fru-mc-watchdog': {
    file: 'ipmi-fru-mc',
    badge: 'fru',
    name: 'FRU, BMC Reset & Watchdog',
    heading: 'FRU Inventory EEPROM, BMC Controller Reset (mc) & Hardware Watchdog',
    proTip: {
      desc: 'Hardware Inventory Audit & BMC Health Maintenance',
      cmd: 'ipmitool -I lanplus -H $BMC_IP -U admin -P password fru print',
      details: 'FRU (Field Replaceable Unit) EEPROMs store motherboard, chassis, and power supply part numbers, serial numbers, and asset tags. If the BMC becomes unresponsive or fails to serve Redfish/web traffic, use "mc reset cold" to reboot the BMC controller without interrupting host OS operations.',
      tip: 'Check "mc watchdog get" to verify hardware watchdog timer parameters; disable watchdog during prolonged debug sessions.',
      flags: [
        ['fru print', 'Dump board manufacturer, product name, serial number, and part number EEPROM data'],
        ['mc info', 'Display BMC firmware revision, IPMI version compliance (v2.0), and device ID'],
        ['mc reset cold', 'Reboot the BMC processor without affecting host power or operating system payload']
      ]
    }
  }
};

// 5. Function to build cards for each ipmitool sub-sheet
function buildIpmiSectionCards(sec) {
  const cfg = SECTION_MAP[sec.id] || { file: `ipmi-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
  const cards = [];

  sec.commands.forEach((cmd, cIdx) => {
    // Card: Primary Command & Status Triage
    cards.push({
      id: `${sec.id}-cmd-${cIdx + 1}`,
      badge: cfg.badge,
      title: `${cfg.name}: ${cmd.desc.split('.')[0].split('(')[0].trim()}`,
      subtitle: cmd.desc,
      commands: [
        {
          id: cmd.id,
          desc: cmd.desc,
          cmd: cmd.cmd,
          details: cmd.details || '',
          flags: cmd.flags ? cmd.flags.slice(0, 3) : [],
          tip: cmd.tip || '',
          tags: [cfg.name, 'ipmi', 'ipmitool', 'bmc', 'hardware', ...(cmd.tags || [])]
        }
      ]
    });

    // Card: Flags & Parameter Breakdown (if more flags exist)
    if (cmd.flags && cmd.flags.length > 3) {
      cards.push({
        id: `${sec.id}-flags-${cIdx + 1}`,
        badge: cfg.badge,
        title: `${cfg.name}: Arguments & Parameters`,
        subtitle: `Key arguments, parameters, and filtering options for ${cmd.desc.split('.')[0].trim()}`,
        commands: [
          {
            id: `${cmd.id}-flags-card`,
            desc: `Options breakdown and parameter syntax for ${cmd.desc.split('.')[0].trim()}`,
            cmd: cmd.cmd,
            flags: cmd.flags.slice(3),
            details: `Common operational and diagnostic parameters for ipmitool CLI commands.`,
            tags: [cfg.name, 'flags', 'options', 'syntax']
          }
        ]
      });
    }

    // Card: Common Recipes & Subcommands (if subcommands exist)
    if (cmd.subcommands && cmd.subcommands.length > 0) {
      cards.push({
        id: `${sec.id}-recipes-${cIdx + 1}`,
        badge: cfg.badge,
        title: `${cfg.name}: Common Recipes & Verification`,
        subtitle: `Production ipmitool commands & pipelines for ${cfg.name}`,
        commands: cmd.subcommands.map((sub, idx) => ({
          id: `${cmd.id}-sub-${idx + 1}`,
          desc: sub[1],
          cmd: sub[0],
          tags: [cfg.name, 'recipe', 'automation', 'cli']
        }))
      });
    }
  });

  // Pro Tips & Production Best Practices Card
  if (cfg.proTip) {
    cards.push({
      id: `${sec.id}-pro-tips`,
      badge: 'tip',
      title: `${cfg.name}: Pro Tips & Best Practices`,
      subtitle: cfg.proTip.desc,
      commands: [
        {
          id: `${sec.id}-tips-card`,
          desc: cfg.proTip.desc,
          cmd: cfg.proTip.cmd,
          details: cfg.proTip.details,
          flags: cfg.proTip.flags,
          tip: cfg.proTip.tip,
          tags: [sec.id, 'tips', 'pro', 'ipmitool', 'bmc', 'best-practice']
        }
      ]
    });
  }

  return cards;
}

// 6. Generate JS file for each ipmitool sub-sheet
function generateIpmiJs(sec, cards, fileKey) {
  const varName = `IPMI_${fileKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`;
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for ipmitool: ${sec.title}
const ${varName} = ${jsonCards};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("${fileKey}_bookmarks") || "[]"))
};

// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toast-text");

let toastTimer = null;

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  if (!toastEl) return;
  toastTextEl.textContent = msg;
  toastEl.classList.add("visible");
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
    toastEl.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
}

// ipmitool Command Syntax Highlighting
function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /(^|\\s|;|&&|\\|\\||\\|)(sudo\\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\\|\\||&&|\\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return '<span class="tok-str">' + strLiteral + '</span>';
      if (flagPart) return '<span class="tok-flag">' + flagPart + '</span>';
      if (operatorPart) return '<span class="tok-pipe">' + operatorPart + '</span>';
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? '<span class="tok-pipe">' + sudoPart + '</span>' : "";
        return prefix + sudoHtml + '<span class="tok-cmd">' + cmdName + '</span>';
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = ${varName};
  const totalCmds = allCards.reduce((acc, c) => acc + c.commands.length, 0);

  const optionsHtml = [
    '<option value="all"' + (state.activeCategory === "all" ? " selected" : "") + '>All Topics (' + totalCmds + ' items)</option>'
  ];

  for (const card of allCards) {
    const isSelected = state.activeCategory === card.id ? " selected" : "";
    optionsHtml.push(
      '<option value="' + escapeHtml(card.id) + '"' + isSelected + '>' +
      escapeHtml(card.title) + ' (' + card.commands.length + ')' +
      '</option>'
    );
  }

  const resetBtnHtml = state.activeCategory !== "all"
    ? '<button type="button" class="cat-reset-btn" id="cat-reset-btn" title="Show all topics">✕ Show All</button>'
    : "";

  categoryTabsEl.innerHTML =
    '<div class="cat-dropdown-wrap">' +
      '<label class="cat-dropdown-label" for="category-select">Topic:</label>' +
      '<select id="category-select" class="cat-select" aria-label="Filter by topic">' +
        optionsHtml.join("") +
      '</select>' +
      resetBtnHtml +
    '</div>';

  const catSelect = document.getElementById("category-select");
  if (catSelect) {
    catSelect.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderCategoryTabs();
      renderSections();
    });
  }

  const catReset = document.getElementById("cat-reset-btn");
  if (catReset) {
    catReset.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmd, searchTerms) {
  if (!searchTerms.length) return true;
  const target = [
    cmd.cmd || "",
    cmd.desc || "",
    cmd.details || "",
    cmd.tip || "",
    (cmd.tags || []).join(" "),
    (cmd.flags || []).map(([f, d]) => f + " " + d).join(" ")
  ].join(" ").toLowerCase();

  return searchTerms.every(term => target.includes(term));
}

let allRenderedCards = [];
function packMasonry() {
  if (!sectionsContainer) return;
  if (sectionsContainer.querySelectorAll(".section-card").length === 0) {
    allRenderedCards = [];
    return;
  }
  const directCards = [...sectionsContainer.querySelectorAll(":scope > .section-card")];
  if (directCards.length > 0) {
    allRenderedCards = directCards;
  }
  if (allRenderedCards.length === 0) return;

  const containerWidth = sectionsContainer.clientWidth || window.innerWidth;
  const colCount = Math.max(1, Math.min(allRenderedCards.length, Math.floor((containerWidth + 18) / (380 + 18))));
  if (colCount <= 1) {
    sectionsContainer.classList.remove("has-masonry");
    sectionsContainer.replaceChildren(...allRenderedCards);
    return;
  }

  sectionsContainer.classList.add("has-masonry");

  const cols = Array.from({ length: colCount }, () => {
    const col = document.createElement("div");
    col.className = "masonry-col";
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
window.addEventListener("resize", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("fullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("webkitfullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const card of ${varName}) {
    if (state.activeCategory !== "all" && state.activeCategory !== card.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\\s+/)
      .filter(Boolean);

    const filteredCommands = card.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) return false;
      return matchesSearch(cmd, searchTerms);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const commandsHtml = filteredCommands.map((cmd) => {
      const isBookmarked = state.bookmarks.has(cmd.id);

      const flagsHtml = (cmd.flags && cmd.flags.length > 0)
        ? '<div class="flag-pills">' + cmd.flags.map(([f, d]) =>
            '<span class="flag-pill"><strong class="flag-token">' + escapeHtml(f) + '</strong> <span class="flag-desc">' + escapeHtml(d) + '</span></span>'
          ).join("") + '</div>'
        : "";

      const detailsHtml = cmd.details
        ? '<p class="cmd-details">' + escapeHtml(cmd.details) + '</p>'
        : "";

      const tipHtml = cmd.tip
        ? '<div class="cmd-tip"><span class="tip-badge">TIP</span>' + escapeHtml(cmd.tip) + '</div>'
        : "";

      const copyTarget = cmd.cmd.includes("   |   ")
        ? cmd.cmd.split("   |   ")[0].trim()
        : cmd.cmd.trim();

      return [
        '<div class="cmd-item" id="cmd-' + escapeHtml(cmd.id) + '" data-cmd-id="' + escapeHtml(cmd.id) + '">',
        '  <div class="cmd-header-row">',
        '    <div class="cmd-desc">',
        '      <span>' + escapeHtml(cmd.desc) + '</span>',
        '    </div>',
        '    <button',
        '      type="button"',
        '      class="bookmark-btn ' + (isBookmarked ? "bookmarked" : "") + '"',
        '      data-cmd-id="' + escapeHtml(cmd.id) + '"',
        '      title="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '      aria-label="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '    >',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <path fill="' + (isBookmarked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        '      </svg>',
        '    </button>',
        '  </div>',
        '',
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <button type="button" class="copy-btn" title="Copy command" aria-label="Copy command">',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
        '        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>',
        '      </svg>',
        '      <span class="copy-feedback">Copied!</span>',
        '    </button>',
        '  </div>',
        '  ' + detailsHtml,
        '  ' + flagsHtml,
        '  ' + tipHtml,
        '</div>'
      ].join("\\n");
    }).join("\\n");

    cardsHtml.push([
      '<article class="section-card" id="sec-' + escapeHtml(card.id) + '">',
      '  <header class="section-header">',
      '    <div class="section-title-wrap">',
      '      <span class="section-badge">' + escapeHtml(card.badge) + '</span>',
      '      <div>',
      '        <h2 class="section-title">' + escapeHtml(card.title) + '</h2>',
      '        <p class="section-subtitle">' + escapeHtml(card.subtitle) + '</p>',
      '      </div>',
      '    </div>',
      '    <span class="count-badge">' + filteredCommands.length + '</span>',
      '  </header>',
      '  <div class="command-list">',
      commandsHtml,
      '  </div>',
      '</article>'
    ].join("\\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\\n");
  visibleCountEl.textContent = visibleCommandsCount;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }

  packMasonry();
}

function updateSavedCount() {
  savedCountEl.textContent = state.bookmarks.size;
  if (state.bookmarks.size > 0) {
    savedFilterBtn.classList.add("has-saved");
  } else {
    savedFilterBtn.classList.remove("has-saved");
  }
}

function initEventListeners() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderSections();
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.savedOnly = false;
    state.activeCategory = "all";
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
    searchInput.focus();
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    savedFilterBtn.classList.toggle("active", state.savedOnly);
    renderSections();
  });

  densityToggleBtn.addEventListener("click", () => {
    state.compact = !state.compact;
    document.body.classList.toggle("compact-mode", state.compact);
    densityLabel.textContent = state.compact ? "Normal" : "Compact";
    localStorage.setItem("linux_cs_compact", state.compact ? "1" : "0");
    packMasonry();
  });

  if (printBtn) printBtn.addEventListener("click", () => {
    window.print();
  });

  themeToggleBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
    localStorage.setItem("linux_cs_theme", state.theme);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      state.searchQuery = "";
      renderSections();
      searchInput.blur();
    }
  });

  sectionsContainer.addEventListener("click", (e) => {
    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
      const codeBox = copyBtn.closest(".cmd-code-box");
      const cmdText = codeBox ? codeBox.getAttribute("data-cmd") : "";
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const codeBox = e.target.closest(".cmd-code-box");
    if (codeBox && !e.target.closest(".copy-btn")) {
      const cmdText = codeBox.getAttribute("data-cmd");
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const cmdId = bookmarkBtn.getAttribute("data-cmd-id");
      if (cmdId) {
        if (state.bookmarks.has(cmdId)) {
          state.bookmarks.delete(cmdId);
          bookmarkBtn.classList.remove("bookmarked");
        } else {
          state.bookmarks.add(cmdId);
          bookmarkBtn.classList.add("bookmarked");
        }
        localStorage.setItem("${fileKey}_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.CheatSheetCommon && window.CheatSheetCommon.applyTheme) {
    window.CheatSheetCommon.applyTheme(theme);
  } else if (window.AntigravityCommon && window.AntigravityCommon.applyTheme) {
    window.AntigravityCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch(e) {}
  }
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");
  if (sunIcon && moonIcon) {
    if (theme === "light") {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }
  }
}

function init() {
  applyTheme(state.theme);
  if (state.compact) {
    document.body.classList.add("compact-mode");
    densityLabel.textContent = "Normal";
  }
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
`;
}

// 7. Generate HTML file for each ipmitool sub-sheet
function generateIpmiHtml(sec, fileKey) {
  const cfg = SECTION_MAP[sec.id] || { file: `ipmi-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ipmitool: ${escapeHtml(cfg.name)} — ${escapeHtml(cfg.heading)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="top-bar">
    <div class="container top-bar-inner">
      <div class="brand">
        <div class="terminal-badge" aria-hidden="true">
          <span class="prompt-symbol">IPMI</span><span class="cursor-block">&gt;</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(cfg.name)}</h1>
            <span class="version-pill">${escapeHtml(cfg.badge.toUpperCase())} / IPMI 2.0 &amp; RMCP+</span>
            ${EXACT_NAVBAR}
          </div>
          <p class="brand-subtitle">${escapeHtml(sec.subtitle)}</p>
        </div>
      </div>

      <div class="search-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"/>
        </svg>
        <input
          type="search"
          id="search-input"
          placeholder="Search ${escapeHtml(cfg.name)} commands, flags, parameters..."
          aria-label="Search ${escapeHtml(cfg.name)} commands"
          autocomplete="off"
          spellcheck="false"
        />
        <button type="button" id="reset-search-btn" class="search-reset-btn" title="Clear search (Esc)" aria-label="Clear search">✕</button>
        <kbd class="search-kbd">/</kbd>
      </div>
    </div>
  </header>

  <main class="container main-content">
    <!-- Toolbar -->
    <section class="filter-bar" aria-label="Command filters">
      <div id="category-tabs" class="category-tabs" role="region" aria-label="Topic filters"></div>

      <div class="filter-actions">
        <button
          type="button"
          id="saved-filter-btn"
          class="saved-filter-btn"
          title="Filter to bookmarked commands"
          aria-pressed="false"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Saved</span>
          <span id="saved-count" class="saved-badge">0</span>
        </button>

        <button
          type="button"
          id="density-toggle"
          class="density-btn"
          title="Toggle compact view (compact spacing)"
          aria-label="Toggle compact view"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <span id="density-label">Compact</span>
        </button>

        <button
          type="button"
          id="print-btn"
          class="print-btn"
          title="Print cheat sheet (Ctrl+P)"
          aria-label="Print cheat sheet"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>

        <button
          type="button"
          id="theme-toggle"
          class="theme-toggle-btn"
          title="Toggle light/dark theme"
          aria-label="Toggle light/dark theme"
        >
          <svg id="theme-icon-sun" class="hidden" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
          <svg id="theme-icon-moon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- Results Counter -->
    <div class="results-info" aria-live="polite">
      Showing <span id="visible-count">0</span> items
    </div>

    <!-- Commands Container (Masonry Cards) -->
    <section id="sections-container" class="sections-container" aria-label="Command cards"></section>

    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden" role="status">
      <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M17 17l4 4M9 11h4"/>
      </svg>
      <h3>No matching ${escapeHtml(cfg.name)} commands</h3>
      <p>Try searching with different keywords or clear active filters.</p>
    </div>
  </main>

  <!-- Toast Notification -->
  <div id="toast" class="toast" role="status" aria-live="polite">
    <span id="toast-text"></span>
  </div>

  <footer class="page-footer">
    <div class="container footer-inner">
      <span>${escapeHtml(cfg.name)} Reference Cheat Sheet</span>
      <span>Press <kbd>/</kbd> to search &bull; Click any command to copy</span>
    </div>
  </footer>

  <script src="global-search-index.js"></script>
  <script src="common.js"></script>
  <script src="${fileKey}.js"></script>
</body>
</html>
`;
}

// 8. Generate each ipmitool sub-sheet
let createdSheets = 0;
for (const sec of IPMI_CHEAT_SHEET_DATA) {
  const cfg = SECTION_MAP[sec.id] || { file: `ipmi-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
  const fileKey = cfg.file;
  const cards = buildIpmiSectionCards(sec);

  const jsContent = generateIpmiJs(sec, cards, fileKey);
  fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), jsContent, 'utf8');

  const htmlContent = generateIpmiHtml(sec, fileKey);
  fs.writeFileSync(path.join(__dirname, `${fileKey}.html`), htmlContent, 'utf8');

  createdSheets++;
  console.log(`Created ${fileKey}.html and ${fileKey}.js (${cards.length} cards)`);
}

console.log(`\nSuccessfully created ${createdSheets} standalone ipmitool cheat sheets.`);
