// fo-dom-cli.js
// Standalone interactive cheat sheet for Fiber Optics: DOM / DDM Optical CLI Diagnostics
const FO_FO_DOM_CLI_DATA = [
  {
    "id": "dom-cli-cmd-1",
    "badge": "dom",
    "title": "DOM / DDM Telemetry: Read SFF-8636 / CMIS transceiver EEPROM & live DOM optical RX/TX power",
    "subtitle": "Read SFF-8636 / CMIS transceiver EEPROM & live DOM optical RX/TX power (dBm), temperature, and alarms",
    "commands": [
      {
        "id": "linux-ethtool-dom",
        "desc": "Read SFF-8636 / CMIS transceiver EEPROM & live DOM optical RX/TX power (dBm), temperature, and alarms",
        "cmd": "ethtool -m eth0   |   ethtool --show-fec eth0   |   ethtool -S eth0 | grep -E 'rx_pcs|fec|crc|err'",
        "details": "",
        "flags": [
          [
            "ethtool -m <iface>",
            "Dumps vendor, PN, SN, wavelength, per-lane Laser Bias (mA), TX power (dBm/mW), RX power (dBm/mW), and LOS/High/Low alarms"
          ],
          [
            "--show-fec",
            "Display active Forward Error Correction mode (RS / BaseR / Off)"
          ]
        ],
        "tip": "Works on any Linux NIC driver",
        "tags": [
          "DOM / DDM Telemetry",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "ethtool",
          "dom",
          "ddm",
          "eeprom",
          "dbm",
          "rx",
          "tx",
          "linux"
        ]
      }
    ]
  },
  {
    "id": "dom-cli-cmd-2",
    "badge": "dom",
    "title": "DOM / DDM Telemetry: Inspect ConnectX / Quantum / Spectrum optical transceiver DOM, PAM4 eye diagram, BER, and FEC histogram",
    "subtitle": "Inspect ConnectX / Quantum / Spectrum optical transceiver DOM, PAM4 eye diagram, BER, and FEC histogram",
    "commands": [
      {
        "id": "nvidia-mlxlink-optics",
        "desc": "Inspect ConnectX / Quantum / Spectrum optical transceiver DOM, PAM4 eye diagram, BER, and FEC histogram",
        "cmd": "mlxlink -d mlx5_0 -m -c -e   |   mlxlink -d /dev/mst/mt4129_pciconf0 -p 1 -m -c",
        "details": "",
        "flags": [
          [
            "-m",
            "Module info: vendor, SN, temp, voltage, and per-lane RX/TX power in dBm"
          ],
          [
            "-c",
            "Counters: Raw Physical BER, Effective Post-FEC BER, and RS-FEC corrected/uncorrectable symbol bins"
          ],
          [
            "-e",
            "Physical SerDes Eye Opening grades and height/width in mV / mUI per lane"
          ]
        ],
        "tip": "Best all-in-one 400G/800G optic check",
        "tags": [
          "DOM / DDM Telemetry",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "mlxlink",
          "nvidia",
          "mellanox",
          "ber",
          "eye",
          "pam4",
          "infiniband",
          "roce"
        ]
      }
    ]
  },
  {
    "id": "dom-cli-cmd-3",
    "badge": "dom",
    "title": "DOM / DDM Telemetry: Query transceiver presence, DOM optical power levels, and reset/low-power mode on SONiC switches",
    "subtitle": "Query transceiver presence, DOM optical power levels, and reset/low-power mode on SONiC switches",
    "commands": [
      {
        "id": "sonic-sfputil-show",
        "desc": "Query transceiver presence, DOM optical power levels, and reset/low-power mode on SONiC switches",
        "cmd": "sfputil show eeprom -d -p Ethernet0   |   show interfaces transceiver eeprom Ethernet0 --dom",
        "details": "",
        "flags": [
          [
            "-d (--dom)",
            "Include real-time Digital Optical Monitoring (DOM) per-lane RX/TX dBm and bias current"
          ],
          [
            "sfputil reset Ethernet0",
            "Hardware-reset a wedged CMIS optical transceiver in port Ethernet0"
          ],
          [
            "sfputil lpmode off Ethernet0",
            "Take high-power QSFP-DD/OSFP optic out of Low Power Mode"
          ]
        ],
        "tip": "",
        "tags": [
          "DOM / DDM Telemetry",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "sonic",
          "sfputil",
          "lpmode",
          "reset",
          "switch",
          "dom"
        ]
      }
    ]
  },
  {
    "id": "dom-cli-cmd-4",
    "badge": "dom",
    "title": "DOM / DDM Telemetry: Inspect optical transceiver DOM power levels and FEC counters on Arista EOS, Cisco NX-OS & Juniper Junos",
    "subtitle": "Inspect optical transceiver DOM power levels and FEC counters on Arista EOS, Cisco NX-OS & Juniper Junos",
    "commands": [
      {
        "id": "arista-cisco-juniper-dom",
        "desc": "Inspect optical transceiver DOM power levels and FEC counters on Arista EOS, Cisco NX-OS & Juniper Junos",
        "cmd": "Arista: show int Eth1/1 transceiver dom   |   NX-OS: show int eth1/1 transceiver details   |   Junos: show chassis pic fpc-slot 0 pic-slot 0",
        "details": "",
        "flags": [
          [
            "Arista: show int phy detail",
            "Shows per-lane PAM4 pre-FEC BER and FEC symbol error counters in EOS"
          ],
          [
            "Junos: show interfaces diagnostics optics et-0/0/0",
            "Displays per-lane laser output/receiver power and alarm flags on Junos"
          ]
        ],
        "tip": "",
        "tags": [
          "DOM / DDM Telemetry",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "arista",
          "eos",
          "cisco",
          "nxos",
          "juniper",
          "junos",
          "switch"
        ]
      }
    ]
  },
  {
    "id": "dom-cli-pro-tips",
    "badge": "tip",
    "title": "DOM / DDM Telemetry: Pro Tips & Best Practices",
    "subtitle": "Production Optical DOM Diagnostic Workflow & Threshold Limits",
    "commands": [
      {
        "id": "dom-cli-tips-card",
        "desc": "Production Optical DOM Diagnostic Workflow & Threshold Limits",
        "cmd": "ethtool -m eth0 | grep -E \"Laser (rx|output) power\" && mlxlink -d mlx5_0 -p 1 --show_module",
        "details": "DOM (Digital Optical Monitoring) / DDM reports real-time laser TX/RX power in dBm and mW, bias current, and module temperature. When bringing up a new link or investigating flaps, verify that RX power is comfortably above the sensitivity threshold (typically -8 dBm to -10 dBm for 400G/800G optical lanes) and well below the receiver overload ceiling (+2.0 dBm).",
        "flags": [
          [
            "ethtool -m <dev>",
            "Dump SFF-8636 / CMIS transceiver EEPROM memory map and live DOM readings"
          ],
          [
            "mlxlink -d <dev> -p 1 --show_module",
            "Query ConnectX/BlueField HCA optical DOM power and SerDes eye health"
          ],
          [
            "sfputil show eeprom -p <port>",
            "SONiC CLI utility to display optical transceiver EEPROM and DOM telemetry"
          ]
        ],
        "tip": "An RX power reading of -40 dBm indicates total loss of signal (RX_LOS); check fiber seating, dust, or a reversed pair.",
        "tags": [
          "dom-cli",
          "tips",
          "pro",
          "fiber",
          "optics",
          "best-practice"
        ]
      }
    ]
  }
];

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("fo-dom-cli_bookmarks") || "[]"))
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

// Fiber Optic Command Syntax Highlighting
function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
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
  const allCards = FO_FO_DOM_CLI_DATA;
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

  for (const card of FO_FO_DOM_CLI_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== card.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
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
      ].join("\n");
    }).join("\n");

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
    ].join("\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\n");
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
        localStorage.setItem("fo-dom-cli_bookmarks", JSON.stringify([...state.bookmarks]));
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
