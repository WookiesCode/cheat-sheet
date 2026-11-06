// generate-fiber-suite.js
// Generates all 4 standalone Fiber Optics cheat sheets and updates the Fiber dropdown across all HTML sheets.
const fs = require('fs');
const path = require('path');

// 1. Read fiber.js to extract FIBER_CHEAT_SHEET_DATA
const foJs = fs.readFileSync(path.join(__dirname, 'fiber.js'), 'utf8');
const dataEndIdx = foJs.indexOf('const state = {');
const dataCode = foJs.slice(0, dataEndIdx) + '\nFIBER_CHEAT_SHEET_DATA;';
const FIBER_CHEAT_SHEET_DATA = eval(dataCode);
console.log(`Loaded ${FIBER_CHEAT_SHEET_DATA.length} Fiber sections from fiber.js`);

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 2. Define the Fiber Navbar Dropdown Snippet
const FO_NAVBAR_SNIPPET = `              <div class="nav-dropdown" id="fiber-nav-dropdown">
                <a href="fiber.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2" y="8" width="7" height="8" rx="1.2" stroke="currentColor" stroke-width="1.8"/><path d="M9 10h3v4H9" stroke="currentColor" stroke-width="1.6"/><circle cx="14.5" cy="12" r="1.5" fill="#fbbf24"/><path d="M16 12h6M15.5 9.5l5.5-3.5M15.5 14.5l5.5 3.5" stroke="#22d3ee" stroke-width="1.8" stroke-linecap="round"/></svg>
                  <span>Fiber</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu fo-dropdown-menu" role="menu">
                  <a href="fiber.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Fiber Optics Hub &amp; Link Budget Calculator</a>
                  <div class="dropdown-divider"></div>
                  <div class="fo-dropdown-grid">
                    <div class="fo-dropdown-col">
                      <div class="fo-dropdown-heading">Transceivers &amp; Optics</div>
                      <a href="fo-dom-cli.html" class="dropdown-item" role="menuitem"><code>dom</code> <span class="cmd-desc">DOM / DDM CLI Diagnostics</span></a>
                      <a href="fo-form-factors.html" class="dropdown-item" role="menuitem"><code>xcvr</code> <span class="cmd-desc">400G/800G Form Factors</span></a>
                    </div>
                    <div class="fo-dropdown-col">
                      <div class="fo-dropdown-heading">Connectors &amp; Field Triage</div>
                      <a href="fo-mpo-polarity.html" class="dropdown-item" role="menuitem"><code>conn</code> <span class="cmd-desc">MPO Pinning &amp; Polarity</span></a>
                      <a href="fo-cleaning-testing.html" class="dropdown-item" role="menuitem"><code>phy</code> <span class="cmd-desc">Cleaning, FEC &amp; Testing</span></a>
                    </div>
                  </div>
                </div>
              </div>`;

// 3. Update navbar across all existing HTML files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'datacenter-cheatsheet-portable.html' && f !== 'omarchy.html');
const foLinkPattern = /<a href="fiber\.html" class="sheet-link(?: active)?">[\s\S]*?<\/svg>\s*Fiber<\/a>/;

let updatedNavCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (foLinkPattern.test(content)) {
    content = content.replace(foLinkPattern, FO_NAVBAR_SNIPPET);
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
    updatedNavCount++;
  }
}
console.log(`Updated navbar with Fiber dropdown in ${updatedNavCount} existing HTML files`);

// Read pristine updated navbar from index.html
const indexHtmlForNav = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

// 4. Section mapping & file keys
const SECTION_MAP = {
  'dom-cli': {
    file: 'fo-dom-cli',
    badge: 'dom',
    name: 'DOM / DDM Telemetry',
    heading: 'Optical DOM/DDM Diagnostics: Linux ethtool, mlxlink, sfputil & EOS/NX-OS',
    proTip: {
      desc: 'Production Optical DOM Diagnostic Workflow & Threshold Limits',
      cmd: 'ethtool -m eth0 | grep -E "Laser (rx|output) power" && mlxlink -d mlx5_0 -p 1 --show_module',
      details: 'DOM (Digital Optical Monitoring) / DDM reports real-time laser TX/RX power in dBm and mW, bias current, and module temperature. When bringing up a new link or investigating flaps, verify that RX power is comfortably above the sensitivity threshold (typically -8 dBm to -10 dBm for 400G/800G optical lanes) and well below the receiver overload ceiling (+2.0 dBm).',
      tip: 'An RX power reading of -40 dBm indicates total loss of signal (RX_LOS); check fiber seating, dust, or a reversed pair.',
      flags: [
        ['ethtool -m <dev>', 'Dump SFF-8636 / CMIS transceiver EEPROM memory map and live DOM readings'],
        ['mlxlink -d <dev> -p 1 --show_module', 'Query ConnectX/BlueField HCA optical DOM power and SerDes eye health'],
        ['sfputil show eeprom -p <port>', 'SONiC CLI utility to display optical transceiver EEPROM and DOM telemetry']
      ]
    }
  },
  'form-factors-breakout': {
    file: 'fo-form-factors',
    badge: 'xcvr',
    name: 'Form Factors & Breakouts',
    heading: 'OSFP vs QSFP-DD, 400G/800G Breakout Topologies & DAC/ACC/AEC/AOC Media',
    proTip: {
      desc: 'Transceiver Form Factors, Thermal Dissipation & Interconnect Selection',
      cmd: 'show interfaces transceiver detail && show cables',
      details: 'NVIDIA Quantum-2 NDR switches use finned OSFP cages for top-down forced air cooling (dissipating up to 25W per module), whereas GPU servers use Flat-Top (RHS) OSFPs that insert flush into internal chassis heat sinks. Passive DAC is limited to 1.5–2m at 100G PAM4/lane; use Active AEC (retimed copper) up to 4–5m, or optical MPO transceivers for rack-to-rack runs.',
      tip: 'Never insert a finned OSFP transceiver into a flat-top riding-heatsink (RHS) cage, as the fin collar will damage the internal server heat sink.',
      flags: [
        ['OSFP Finned', 'Thermal fins integrated on transceiver body; required for external switch airflow'],
        ['OSFP Flat-Top / RHS', 'Smooth top surface designed to contact server internal heat sink clamps'],
        ['800G 2xDR4 Breakout', 'Split dual-port 800G OSFP into two 400G DR4 MPO-12 links']
      ]
    }
  },
  'mpo-polarity-connectors': {
    file: 'fo-mpo-polarity',
    badge: 'conn',
    name: 'MPO Pinning & Polarity',
    heading: 'MPO/MTP Pinning (Male vs Female), Polarity Types A/B/C & LC/CS/SN Connectors',
    proTip: {
      desc: 'MPO Mating Rules, Polarity Inversion & Connector Keying',
      cmd: 'cat /sys/class/net/eth0/device/infiniband/*/ports/*/counters/link_downed_counter',
      details: 'Transceiver optical receptacles are always FEMALE (unpinned). Connecting cables MUST BE MALE (pinned) to transceiver interfaces, and female-to-female patch cords require alignment pins inside the MPO bulkhead adapter. Direct transceiver-to-transceiver patch cables must use Type B (Key-Up to Key-Up rollover) polarity to ensure TX lanes cross to RX lanes.',
      tip: 'Never attempt to mate two pinned (male) MPO connectors; guide pins will collide and shatter the ceramic ferrule micro-lenses.',
      flags: [
        ['MPO Female (Unpinned)', 'Smooth guide holes without pins; standard for all QSFP/OSFP optical receptacles'],
        ['MPO Male (Pinned)', 'Metal guide alignment pins protruding from ferrule; mandatory for patch panels'],
        ['Type-B Polarity', 'Key-Up to Key-Up crossover; fiber 1 maps to fiber 12 (TX to RX)']
      ]
    }
  },
  'cleaning-testing-triage': {
    file: 'fo-cleaning-testing',
    badge: 'phy',
    name: 'Cleaning & Testing Triage',
    heading: 'IEC 61300-3-35 Inspect & Clean, Attenuators, Pre-FEC BER & OTDR/OLTS Field Triage',
    proTip: {
      desc: 'Inspect-Before-You-Connect Best Practices & Layer-1 Optical Flap Triage',
      cmd: 'ethtool --show-fec eth0 && mlxlink -d mlx5_0 -p 1 --show_ber',
      details: 'Over 85% of optical network failures in production datacenters stem from microscopic dust contamination on fiber end-faces. Inspect end-faces using a fiber video microscope before connecting. For short single-mode fiber runs (<50m) with high-output DR4/FR4 optics, verify RX optical power does not exceed the receiver overload threshold (+2 dBm); install inline attenuators (typically 3dB–5dB) if needed.',
      tip: 'Pre-FEC BER exceeding 10^-4 on PAM4 optics indicates dirty end-faces or excessive fiber bending; post-FEC uncorrectable codewords cause immediate packet drops.',
      flags: [
        ['IEC 61300-3-35', 'International inspection standard defining acceptable scratches and contamination zones on core/cladding'],
        ['Pre-FEC BER', 'Raw bit error rate before Reed-Solomon correction; normal PAM4 threshold is 10^-7 to 10^-5'],
        ['OTDR (Tier-2)', 'Optical Time-Domain Reflectometer: pinpoints distance to micro-bends, breaks, and high-loss splices']
      ]
    }
  }
};

// 5. Function to build cards for each Fiber sub-sheet
function buildFoSectionCards(sec) {
  const cfg = SECTION_MAP[sec.id] || { file: `fo-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
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
          tags: [cfg.name, 'fiber', 'optics', 'transceiver', 'dom', ...(cmd.tags || [])]
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
            details: `Common operational, diagnostic, and optical parameters for fiber optic testing and telemetry.`,
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
        subtitle: `Production fiber optic commands & pipelines for ${cfg.name}`,
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
          tags: [sec.id, 'tips', 'pro', 'fiber', 'optics', 'best-practice']
        }
      ]
    });
  }

  return cards;
}

// 6. Generate JS file for each Fiber sub-sheet
function generateFoJs(sec, cards, fileKey) {
  const varName = `FO_${fileKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`;
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for Fiber Optics: ${sec.title}
const ${varName} = ${jsonCards};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("${fileKey}_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
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

// Fiber Optic Command Syntax Highlighting
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
        '    <span class="copy-hint">Copy</span>',
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
    const codeBox = e.target.closest(".cmd-code-box");
    if (codeBox) {
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
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    sunIcon?.classList.add("hidden");
    moonIcon?.classList.remove("hidden");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    sunIcon?.classList.remove("hidden");
    moonIcon?.classList.add("hidden");
  }
}

function init() {
  applyTheme(state.theme);
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
`;
}

// 7. Generate HTML file for each Fiber sub-sheet
function generateFoHtml(sec, fileKey) {
  const cfg = SECTION_MAP[sec.id] || { file: `fo-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fiber: ${escapeHtml(cfg.name)} — ${escapeHtml(cfg.heading)}</title>
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
          <span class="prompt-symbol">FO</span><span class="cursor-block">&gt;</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(cfg.name)}</h1>
            <span class="version-pill">${escapeHtml(cfg.badge.toUpperCase())} / Optical Transceiver &amp; Physical Layer</span>
            ${EXACT_NAVBAR}
          </div>
          <p class="brand-subtitle">${escapeHtml(sec.subtitle)}</p>
        </div>
      </div>

      <div class="header-actions">

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
    </div>
  </header>

  <main class="container main-layout">

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

// 8. Generate each Fiber sub-sheet
let createdSheets = 0;
for (const sec of FIBER_CHEAT_SHEET_DATA) {
  const cfg = SECTION_MAP[sec.id] || { file: `fo-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
  const fileKey = cfg.file;
  const cards = buildFoSectionCards(sec);

  const jsContent = generateFoJs(sec, cards, fileKey);
  fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), jsContent, 'utf8');

  const htmlContent = generateFoHtml(sec, fileKey);
  // Existing pages are authoritative for header/nav chrome; only create missing ones.
  if (!fs.existsSync(path.join(__dirname, `${fileKey}.html`))) fs.writeFileSync(path.join(__dirname, `${fileKey}.html`), htmlContent, 'utf8');

  createdSheets++;
  console.log(`Created ${fileKey}.html and ${fileKey}.js (${cards.length} cards)`);
}

console.log(`\nSuccessfully created ${createdSheets} standalone Fiber cheat sheets.`);
