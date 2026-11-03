// generate-motherboards-suite.js
// Generates all 7 standalone Server Motherboards cheat sheets and updates the Motherboards dropdown across all HTML sheets.
const fs = require('fs');
const path = require('path');

// 1. Read motherboards.js to extract MOTHERBOARD_CHEAT_SHEET_DATA
const mbJs = fs.readFileSync(path.join(__dirname, 'motherboards.js'), 'utf8');
const dataEndIdx = mbJs.indexOf('const state = {');
const dataCode = mbJs.slice(0, dataEndIdx) + '\nMOTHERBOARD_CHEAT_SHEET_DATA;';
const MOTHERBOARD_CHEAT_SHEET_DATA = eval(dataCode);
console.log(`Loaded ${MOTHERBOARD_CHEAT_SHEET_DATA.length} Motherboard sections from motherboards.js`);

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 2. Define the Motherboards Navbar Dropdown Snippet
const MB_NAVBAR_SNIPPET = `              <div class="nav-dropdown" id="motherboards-nav-dropdown">
                <a href="motherboards.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="2" stroke="currentColor" stroke-width="1.7"/><rect x="6.5" y="5.5" width="6" height="6" rx="0.8" stroke="#38bdf8" stroke-width="1.6"/><circle cx="9.5" cy="8.5" r="1.2" fill="#38bdf8"/><path d="M15.5 5.5v6M18 5.5v6" stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round"/><path d="M6 15h12M6 18h9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>
                  <span>Motherboards</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu mb-dropdown-menu" role="menu">
                  <a href="motherboards.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Motherboards Hub &amp; POST Code Decoder</a>
                  <div class="dropdown-divider"></div>
                  <div class="mb-dropdown-grid">
                    <div class="mb-dropdown-col">
                      <div class="mb-dropdown-heading">POST &amp; CPU Architecture</div>
                      <a href="mb-memory-post.html" class="dropdown-item" role="menuitem"><code>mrc</code> <span class="cmd-desc">Memory MRC Codes (50–55)</span></a>
                      <a href="mb-pcie-dxe-post.html" class="dropdown-item" role="menuitem"><code>pci</code> <span class="cmd-desc">PCIe &amp; DXE Codes (60–99)</span></a>
                      <a href="mb-storage-bds-post.html" class="dropdown-item" role="menuitem"><code>bds</code> <span class="cmd-desc">Storage &amp; Boot BDS (A0–AA)</span></a>
                      <a href="mb-epyc-agesa.html" class="dropdown-item" role="menuitem"><code>epyc</code> <span class="cmd-desc">AMD EPYC AGESA &amp; PSP</span></a>
                    </div>
                    <div class="mb-dropdown-col">
                      <div class="mb-dropdown-heading">Vendor Boards &amp; Linux Triage</div>
                      <a href="mb-asus-servers.html" class="dropdown-item" role="menuitem"><code>asus</code> <span class="cmd-desc">ASUS Server Boards &amp; ASMB</span></a>
                      <a href="mb-gigabyte-servers.html" class="dropdown-item" role="menuitem"><code>giga</code> <span class="cmd-desc">GIGABYTE Server Boards</span></a>
                      <a href="mb-linux-audit.html" class="dropdown-item" role="menuitem"><code>dmi</code> <span class="cmd-desc">In-Band DMI &amp; ACPI Audit</span></a>
                    </div>
                  </div>
                </div>
              </div>`;

// 3. Update navbar across all existing HTML files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'datacenter-cheatsheet-portable.html' && f !== 'omarchy.html');
const mbLinkPattern = /<a href="motherboards\.html" class="sheet-link(?: active)?">[\s\S]*?<\/svg>\s*Motherboards<\/a>/;

let updatedNavCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (mbLinkPattern.test(content)) {
    content = content.replace(mbLinkPattern, MB_NAVBAR_SNIPPET);
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
    updatedNavCount++;
  }
}
console.log(`Updated navbar with Motherboards dropdown in ${updatedNavCount} existing HTML files`);

// Read pristine updated navbar from index.html
const indexHtmlForNav = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

// 4. Section mapping & file keys
const SECTION_MAP = {
  'memory-post': {
    file: 'mb-memory-post',
    badge: 'mrc',
    name: 'Memory MRC Codes',
    heading: 'Memory (MRC) POST Codes: 50–55, B0–BF RAM Init, DIMM Channels & Training',
    proTip: {
      desc: 'Memory Initialization & Rank Training Fault Isolation',
      cmd: 'dmidecode -t 17 | grep -E "(Locator|Size|Speed|Part Number)" && edac-util -v',
      details: 'POST codes 0x50–0x55 signal early PEI Memory Reference Code (MRC) failure. 0x53 indicates memory initialization failure (bad SPD read or unsupported timing), while 0x55 indicates no usable memory detected. B0–BF codes indicate Xeon/EPYC channel-specific training errors. If stuck on 0x55, reseat the primary channel DIMM in Slot A1.',
      tip: 'Always populate DIMM slots with the furthest slot from the CPU socket first (typically white/blue slots designated A1, B1, C1).',
      flags: [
        ['0x53 (Memory Init)', 'Memory initialization error: unreadable SPD EEPROM or timing mismatch'],
        ['0x55 (No Memory)', 'No memory installed: CPU socket pin contact fault or unseated A1 DIMM'],
        ['0xB7 / 0xBD (Training)', 'DDR4/DDR5 rank margin training failure on designated memory channel']
      ]
    }
  },
  'pcie-dxe-post': {
    file: 'mb-pcie-dxe-post',
    badge: 'pci',
    name: 'PCIe & DXE Codes',
    heading: 'PCIe, GPU, Riser & Option ROM POST Codes: 60–99, d2–d8 Bus Enumeration',
    proTip: {
      desc: 'PCIe Bus Hangs, Bifurcation & Option ROM Freeze Triage',
      cmd: 'lspci -tv && lspci -vvv -d 10de: | grep -E "(LnkCap|LnkSta|DevSta)"',
      details: 'Codes 0x91–0x96 occur during DXE driver dispatch and bus enumeration. A hang at 0x94 (PCI Bus Enumeration) indicates an unseated riser, bad PCIe Gen5 retimer, or shorted power pins on a multi-GPU add-in card. 0xd6 indicates No Console Output Found (missing or disabled GPU display output).',
      tip: 'Verify PCIe bifurcation settings in BIOS: setting an x16 slot to x4x4x4x4 for quad M.2 cards avoids post code 0x94 hangs.',
      flags: [
        ['0x94 (PCI Bus Enum)', 'PCIe bus scan failure: unseated riser, bad cable, or dead add-in card'],
        ['0x96 (PCI Resource)', 'PCI resource allocation failure: enable "Above 4G Decoding" and Large BARs'],
        ['0xd6 (No Console)', 'No VGA display device detected: verify primary display selection in BMC']
      ]
    }
  },
  'storage-bds-post': {
    file: 'mb-storage-bds-post',
    badge: 'bds',
    name: 'Storage & Boot BDS',
    heading: 'Storage, USB, BIOS Setup & OS Handoff Codes: A0–DF, 00 & AA Normal Boot',
    proTip: {
      desc: 'Storage Detection, Boot Device Selection (BDS) & OS Handoff',
      cmd: 'lsblk -o NAME,MODEL,SERIAL,SIZE,FSTYPE,MOUNTPOINT && efibootmgr -v',
      details: 'Codes starting with 0xA indicate Boot Device Selection (BDS). A hang at 0xA2 (IDE/SATA Detect) typically points to a failing NVMe SSD, corrupt M.2 controller, or degraded backplane cable. 0xAA indicates successfully passing control to the ACPI OS (normal operating state).',
      tip: '0xAD (Ready To Boot) means the system is waiting for boot media; check efibootmgr order or PXE timeout.',
      flags: [
        ['0xA2 (Storage Detect)', 'SATA/NVMe drive detection hang: bad drive controller or broken backplane link'],
        ['0xAD (Ready To Boot)', 'UEFI handoff pending: check USB installer, NVMe bootloader, or PXE target'],
        ['0xAA / 0x00 (OS Active)', 'ACPI OS payload running normally; boot phase complete']
      ]
    }
  },
  'amd-epyc-agesa': {
    file: 'mb-epyc-agesa',
    badge: 'epyc',
    name: 'AMD EPYC AGESA & PSP',
    heading: 'AMD EPYC CPU (AGESA ABL & Platform Security Processor) POST Codes: E0–FF',
    proTip: {
      desc: 'AMD EPYC AGESA Boot Loader (ABL) & xGMI Infinity Fabric Diagnostics',
      cmd: 'lscpu | grep -E "(Model name|NUMA|Socket)" && numactl --hardware',
      details: 'AMD EPYC motherboards exhibit a unique 2-stage POST cycle. The Platform Security Processor (PSP) boots first, displaying E0–FF codes on port 0x80 while loading microcode and initializing CPU chiplets. The board then resets and executes standard AMI Aptio PEI/DXE codes.',
      tip: 'A halt at 0xEA indicates AMD AGESA memory timing failure; check DIMM thermal sensors and socket torque spec (14.0 in-lbs / 1.58 Nm).',
      flags: [
        ['0xEA (AGESA Memory)', 'AMD memory training abort: uneven socket mounting pressure or damaged LGA pins'],
        ['0xEE (xGMI Link)', 'Dual-socket Infinity Fabric inter-socket link training timeout'],
        ['2-Stage Boot', 'Initial E0-FF codes followed by cold reset to 10-AA is expected normal behavior']
      ]
    }
  },
  'asus-server-board': {
    file: 'mb-asus-servers',
    badge: 'asus',
    name: 'ASUS Server Boards',
    heading: 'ASUS Server Motherboards: ASMB10/11 BMC, Q-Code 7-Segment & Diagnostic Jumpers',
    proTip: {
      desc: 'ASUS Server ASMB BMC Telemetry & Hardware Recovery Jumpers',
      cmd: 'ipmitool -I lanplus -H $BMC_IP -U admin -P admin raw 0x30 0x18',
      details: 'ASUS server boards (ESC8000, KRPA, Z13, K14 series) feature an onboard 2-digit 7-segment Q-Code display and ASMB10/11 BMC controller. Use the CLRTC jumper to reset corrupt NVRAM, or ME_RCVR jumper to force Intel ME firmware recovery.',
      tip: 'Query live ASUS Q-Codes over Redfish via /redfish/v1/Managers/1/Oem/Asus/PostCode without opening chassis.',
      flags: [
        ['CLRTC Jumper', 'Clear CMOS RTC jumper: short pins 1-2 for 10s with AC power removed to clear BIOS'],
        ['ME_RCVR Jumper', 'Intel Management Engine recovery mode jumper for recovering corrupted ME flash'],
        ['BMC_LED1', 'Blinks green at 1Hz when ASMB BMC Linux kernel is healthy and ready']
      ]
    }
  },
  'gigabyte-server-board': {
    file: 'mb-gigabyte-servers',
    badge: 'giga',
    name: 'GIGABYTE Server Boards',
    heading: 'GIGABYTE Server Boards: GSM / AST2600 BMC, Dual-BIOS & Diagnostic LEDs',
    proTip: {
      desc: 'GIGABYTE Dual-BIOS Switching & Remote Port 0x80 Snooping',
      cmd: 'ipmitool -I lanplus -H $BMC_IP -U admin -P password raw 0x32 0x8b',
      details: 'GIGABYTE server motherboards (MZ, MD, MS, R-series) utilize an ASPEED AST2500/AST2600 BMC with hardware port 0x80 LPC snooping. If the primary SPI flash chip becomes corrupted, toggle the Dual-BIOS switch (BIOS_SEL) to boot from the redundant secondary SPI ROM.',
      tip: 'If BMC_RDY LED is solid amber or off, BMC power rail or SPI flash is unpowered; verify standby 3.3V rail.',
      flags: [
        ['BIOS_SEL Switch', 'Hardware slide switch to manually select Primary vs Secondary SPI BIOS ROM'],
        ['BMC_RDY LED', 'Blinks green at 1Hz when ASPEED BMC firmware has successfully completed Linux boot'],
        ['CPU_ERR LED', 'Amber illumination indicates CPU socket VRM failure, missing VDD, or thermal shutdown']
      ]
    }
  },
  'inband-board-audit': {
    file: 'mb-linux-audit',
    badge: 'dmi',
    name: 'In-Band DMI & ACPI Audit',
    heading: 'Ubuntu In-Band Motherboard Telemetry, ACPI BERT Crash Tables & BIOS Checklist',
    proTip: {
      desc: 'Production In-Band Motherboard Telemetry & Fatal Crash Log Extraction',
      cmd: 'dmesg | grep -i bert && cat /sys/firmware/acpi/tables/BERT > bert.dat',
      details: 'The ACPI BERT (Boot Error Record Table) preserves hardware errors from fatal crashes that occurred during previous reboots. Use dmidecode -t 2 to audit motherboard manufacturer, serial number, and PCB revision across large server fleets.',
      tip: 'Ensure "Above 4G Decoding" and "SR-IOV Support" are enabled in BIOS to avoid post code 0x96 resource allocation failure with multi-GPU accelerators.',
      flags: [
        ['dmidecode -t 2', 'Query motherboard model, PCB hardware revision, and manufacturer serial number'],
        ['/sys/firmware/acpi/tables/BERT', 'ACPI Boot Error Record Table containing fatal post-mortem crash records'],
        ['SR-IOV & Above 4G', 'Mandatory BIOS settings for PCIe Gen4/Gen5 GPU accelerators and multi-port NICs']
      ]
    }
  }
};

// 5. Function to build cards for each Motherboard sub-sheet
function buildMbSectionCards(sec) {
  const cfg = SECTION_MAP[sec.id] || { file: `mb-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
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
          tags: [cfg.name, 'motherboard', 'post', 'bios', 'hardware', ...(cmd.tags || [])]
        }
      ]
    });

    // Card: Flags & Parameter Breakdown (if more flags exist)
    if (cmd.flags && cmd.flags.length > 3) {
      cards.push({
        id: `${sec.id}-flags-${cIdx + 1}`,
        badge: cfg.badge,
        title: `${cfg.name}: POST Hex Codes & Options`,
        subtitle: `Key hex codes, parameters, and error indicators for ${cmd.desc.split('.')[0].trim()}`,
        commands: [
          {
            id: `${cmd.id}-flags-card`,
            desc: `Hex code lookup and diagnostics breakdown for ${cmd.desc.split('.')[0].trim()}`,
            cmd: cmd.cmd,
            flags: cmd.flags.slice(3),
            details: `Common operational and diagnostic POST / Q-Codes on ASUS and GIGABYTE server motherboards.`,
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
        subtitle: `Production diagnostics commands & pipelines for ${cfg.name}`,
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
          tags: [sec.id, 'tips', 'pro', 'motherboard', 'post', 'best-practice']
        }
      ]
    });
  }

  return cards;
}

// 6. Generate JS file for each Motherboard sub-sheet
function generateMbJs(sec, cards, fileKey) {
  const varName = `MB_${fileKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`;
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for Motherboards: ${sec.title}
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

// Motherboard CLI / POST Syntax Highlighting
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

function isRunnableCommand(cmd) {
  if (window.AntigravityCommon && window.AntigravityCommon.isRunnableCommand) {
    return window.AntigravityCommon.isRunnableCommand(cmd);
  }
  if (!cmd || typeof cmd !== 'string') return false;
  var s = cmd.trim();
  if (!s) return false;
  if (s.startsWith('POST ') || s.startsWith('Stage ') || s.startsWith('1-DIMM') || s.startsWith('BMC_') || s.startsWith('Above 4G')) return false;
  if (s.startsWith('T568') || s.startsWith('[Transceiver') || s.startsWith('Switch Port: OSFP') || s.startsWith('800G Twin-Port') || s.startsWith('0.5')) return false;
  if (s.startsWith('Direct Optic-to-Optic') || s.startsWith('MPO-12') || s.startsWith('LC Duplex') || s.startsWith('1. Inspect') || s.startsWith('Check DOM') || s.startsWith('10km LR4') || s.startsWith('Tier ')) return false;
  if (s.includes('──►') || s.includes('◄──')) return false;
  if (s.startsWith('Win+') || s.startsWith('Alt+') || s.startsWith('Ctrl+')) return false;
  if (/[⇧⌘⌥⌃]/.test(s) || s.includes('-Finger Swipe')) return false;
  return true;
}

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

      const isRun = isRunnableCommand(cmd.cmd);
      const codeBoxLines = isRun
        ? [
            '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
            '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
            '    <button type="button" class="copy-btn" title="Copy command" aria-label="Copy command">',
            '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
            '        <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
            '        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>',
            '      </svg>',
            '      <span class="copy-feedback">Copy</span>',
            '    </button>',
            '  </div>'
          ]
        : [
            '  <div class="cmd-code-box ref-box">',
            '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
            '  </div>'
          ];

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
        codeBoxLines.join("\\n"),
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
      const codeBox = copyBtn.closest(".cmd-code-box[data-cmd]");
      const cmdText = codeBox ? codeBox.getAttribute("data-cmd") : "";
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const codeBox = e.target.closest(".cmd-code-box[data-cmd]");
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

// 7. Generate HTML file for each Motherboard sub-sheet
function generateMbHtml(sec, fileKey) {
  const cfg = SECTION_MAP[sec.id] || { file: `mb-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Motherboards: ${escapeHtml(cfg.name)} — ${escapeHtml(cfg.heading)}</title>
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
          <span class="prompt-symbol">0x</span><span class="cursor-block">80</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(cfg.name)}</h1>
            <span class="version-pill">${escapeHtml(cfg.badge.toUpperCase())} / ASUS &amp; GIGABYTE Server Architecture</span>
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
          placeholder="Search ${escapeHtml(cfg.name)} POST codes, jumpers, diagnostics..."
          aria-label="Search ${escapeHtml(cfg.name)} commands"
          autocomplete="off"
          spellcheck="false"
        />
        <button type="button" id="reset-search-btn" class="search-reset-btn" title="Clear search (Esc)" aria-label="Clear search">✕</button>
        <kbd class="search-kbd">/</kbd>
      </div>

      <div class="header-actions">
        <button
          type="button"
          id="saved-filter-btn"
          class="action-btn"
          title="Filter to bookmarked commands"
          aria-pressed="false"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Saved</span>
          <span id="saved-count" class="count-badge">0</span>
        </button>

        <button
          type="button"
          id="density-toggle"
          class="action-btn"
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
          class="action-btn"
          title="Print cheat sheet (Ctrl+P)"
          aria-label="Print cheat sheet"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
          <span>Print</span>
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
          <div id="theme-dropdown-menu" class="theme-dropdown-menu">
            <div class="theme-dropdown-header">
              <span>Color Theme</span>
              <span class="theme-count">24 Themes</span>
            </div>
            <div class="theme-options-list">
              <button type="button" class="theme-option active" data-theme="dark" title="Obsidian & cyan datacenter">
                <div class="theme-swatches"><span class="theme-dot" style="background:#0b0e14"></span><span class="theme-dot" style="background:#111621"></span><span class="theme-dot" style="background:#38bdf8"></span><span class="theme-dot" style="background:#4ade80"></span></div>
                <div class="theme-info"><span class="theme-name">Cyber Dark</span><span class="theme-desc">Obsidian & cyan datacenter</span></div>
                <span class="theme-check">✓</span>
              </button>
              <button type="button" class="theme-option" data-theme="light" title="Crisp daylight paper & azure">
                <div class="theme-swatches"><span class="theme-dot" style="background:#f5f7fa"></span><span class="theme-dot" style="background:#ffffff"></span><span class="theme-dot" style="background:#0284c7"></span><span class="theme-dot" style="background:#16a34a"></span></div>
                <div class="theme-info"><span class="theme-name">Clean Light</span><span class="theme-desc">Crisp daylight paper & azure</span></div>
                <span class="theme-check">✓</span>
              </button>
              <button type="button" class="theme-option" data-theme="gemini" title="Google Gemini cosmic indigo & violet">
                <div class="theme-swatches"><span class="theme-dot" style="background:#090a12"></span><span class="theme-dot" style="background:#101322"></span><span class="theme-dot" style="background:#818cf8"></span><span class="theme-dot" style="background:#c084fc"></span></div>
                <div class="theme-info"><span class="theme-name">Gemini Spark</span><span class="theme-desc">Cosmic indigo & violet spark</span></div>
                <span class="theme-check">✓</span>
              </button>
            </div>
          </div>
        </div>
        <button type="button" id="theme-toggle" style="display:none;" aria-hidden="true"></button>
      </div>
    </div>
    <div class="category-bar">
      <div class="container category-bar-inner">
        <div id="category-tabs" class="category-tabs" role="region" aria-label="Topic filters"></div>
        <div class="stats-summary" id="stats-summary">
          Showing <strong id="visible-count">0</strong> items
        </div>
      </div>
    </div>
  </header>

  <main class="container main-layout">
    <!-- Commands Container (Masonry Cards) -->
    <section id="sections-container" class="sections-grid sections-container" aria-label="Command cards"></section>

    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden" role="status">
      <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M17 17l4 4M9 11h4"/>
      </svg>
      <h3>No matching ${escapeHtml(cfg.name)} items</h3>
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
  <script src="manuals-data.js"></script>
  <script src="manuals-ui.js"></script>
  <script src="common.js"></script>
  <script src="${fileKey}.js"></script>
</body>
</html>
`;
}

// 8. Generate each Motherboard sub-sheet
let createdSheets = 0;
for (const sec of MOTHERBOARD_CHEAT_SHEET_DATA) {
  const cfg = SECTION_MAP[sec.id] || { file: `mb-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
  const fileKey = cfg.file;
  const cards = buildMbSectionCards(sec);

  const jsContent = generateMbJs(sec, cards, fileKey);
  fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), jsContent, 'utf8');

  const htmlContent = generateMbHtml(sec, fileKey);
  fs.writeFileSync(path.join(__dirname, `${fileKey}.html`), htmlContent, 'utf8');

  createdSheets++;
  console.log(`Created ${fileKey}.html and ${fileKey}.js (${cards.length} cards)`);
}

console.log(`\nSuccessfully created ${createdSheets} standalone Motherboard cheat sheets.`);
