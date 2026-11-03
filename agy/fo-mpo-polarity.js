// fo-mpo-polarity.js
// Standalone interactive cheat sheet for Fiber Optics: MPO/MTP Pinning, Polarity & Connector Types
const FO_FO_MPO_POLARITY_DATA = [
  {
    "id": "mpo-polarity-connectors-cmd-1",
    "badge": "conn",
    "title": "MPO Pinning & Polarity: Prevent transceiver damage: How Male",
    "subtitle": "Prevent transceiver damage: How Male (Pinned) and Female (Unpinned) MPO/MTP connectors mate",
    "commands": [
      {
        "id": "mpo-male-female-pin-rule",
        "desc": "Prevent transceiver damage: How Male (Pinned) and Female (Unpinned) MPO/MTP connectors mate",
        "cmd": "[Transceiver: MALE PINS] ◄── [Patch Cord: FEMALE] ──► [Trunk Panel: MALE] ◄── [Patch Cord: FEMALE] ──► [Transceiver: MALE PINS]",
        "details": "",
        "flags": [
          [
            "Transceiver MPO Cage",
            "Every SR4/SR8/DR4/DR8 transceiver has 2 metal guide pins (MALE) inside the optical receptacle"
          ],
          [
            "Female-to-Female Patch Cord",
            "Direct transceiver-to-transceiver MPO jumper MUST be Female (Unpinned) on BOTH ends"
          ],
          [
            "Male-to-Male Clash",
            "Forcing a Male (Pinned) cable into a Male transceiver crushes guide pins and ruins the optic!"
          ]
        ],
        "tip": "",
        "tags": [
          "MPO Pinning & Polarity",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "mpo",
          "mtp",
          "male",
          "female",
          "pins",
          "pinned",
          "unpinned",
          "damage"
        ]
      }
    ]
  },
  {
    "id": "mpo-polarity-connectors-flags-1",
    "badge": "conn",
    "title": "MPO Pinning & Polarity: Arguments & Parameters",
    "subtitle": "Key arguments, parameters, and filtering options for Prevent transceiver damage: How Male (Pinned) and Female (Unpinned) MPO/MTP connectors mate",
    "commands": [
      {
        "id": "mpo-male-female-pin-rule-flags-card",
        "desc": "Options breakdown and parameter syntax for Prevent transceiver damage: How Male (Pinned) and Female (Unpinned) MPO/MTP connectors mate",
        "cmd": "[Transceiver: MALE PINS] ◄── [Patch Cord: FEMALE] ──► [Trunk Panel: MALE] ◄── [Patch Cord: FEMALE] ──► [Transceiver: MALE PINS]",
        "flags": [
          [
            "Female-to-Female Mismatch",
            "Mating two Female connectors in a patch coupler leaves cores unaligned (causes 3–10+ dB loss!)"
          ]
        ],
        "details": "Common operational, diagnostic, and optical parameters for fiber optic testing and telemetry.",
        "tags": [
          "MPO Pinning & Polarity",
          "flags",
          "options",
          "syntax"
        ]
      }
    ]
  },
  {
    "id": "mpo-polarity-connectors-cmd-2",
    "badge": "conn",
    "title": "MPO Pinning & Polarity: MPO-12 / MPO-16 Polarity Types",
    "subtitle": "MPO-12 / MPO-16 Polarity Types (Type B rollover for direct patch vs Type A structured trunks)",
    "commands": [
      {
        "id": "mpo-polarity-type-a-b-c",
        "desc": "MPO-12 / MPO-16 Polarity Types (Type B rollover for direct patch vs Type A structured trunks)",
        "cmd": "Direct Optic-to-Optic Patch: Type B (Key-Up to Key-Up, Female-to-Female)   |   MPO-12 Lanes: TX=1..4, Unused=5..8, RX=9..12",
        "details": "",
        "flags": [
          [
            "Type B (Rollover: 1→12, 2→11...)",
            "Standard direct patch cord between two SR4/DR4/DR8 transceivers: maps Fiber 1 (TX1) to Fiber 12 (RX1)"
          ],
          [
            "Type A (Straight: 1→1, 2→2...)",
            "Key-Up to Key-Down trunk cable; requires one Type A + one Type B patch cord at the panels to flip TX→RX"
          ],
          [
            "Odd number of Type B cables",
            "In an end-to-end MPO link without cassettes, you generally need an ODD number of Type B flips so Pos 1 lands on Pos 12"
          ]
        ],
        "tip": "Direct jumper between 2 optics = Type B Female-Female",
        "tags": [
          "MPO Pinning & Polarity",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "polarity",
          "type-b",
          "type-a",
          "rollover",
          "key-up",
          "mpo12",
          "mpo16"
        ]
      }
    ]
  },
  {
    "id": "mpo-polarity-connectors-cmd-3",
    "badge": "conn",
    "title": "MPO Pinning & Polarity: Distinguishing MPO-12",
    "subtitle": "Distinguishing MPO-12 (4-lane SR4/DR4) from MPO-16 (8-lane 800G SR8/DR8) connectors",
    "commands": [
      {
        "id": "mpo12-vs-mpo16-keying",
        "desc": "Distinguishing MPO-12 (4-lane SR4/DR4) from MPO-16 (8-lane 800G SR8/DR8) connectors",
        "cmd": "MPO-12 (4-lane): Centered Alignment Key   |   MPO-16 (8-lane 800G): Offset (Left-Shifted) Alignment Key",
        "details": "",
        "flags": [
          [
            "MPO-12 (Centered Key)",
            "Used for 4-lane parallel optics (100G SR4/DR4, 400G SR4/DR4); middle 4 fibers (5–8) are dark"
          ],
          [
            "MPO-16 (Offset Key)",
            "Used for 8-lane single-port 800G SR8 / DR8 optics (all 16 fibers active: 1–8 TX, 9–16 RX) — offset key prevents plugging MPO-12 into MPO-16!"
          ]
        ],
        "tip": "",
        "tags": [
          "MPO Pinning & Polarity",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "mpo12",
          "mpo16",
          "key",
          "offset",
          "sr8",
          "dr8",
          "800g"
        ]
      }
    ]
  },
  {
    "id": "mpo-polarity-connectors-cmd-4",
    "badge": "conn",
    "title": "MPO Pinning & Polarity: Duplex 2-fiber connectors",
    "subtitle": "Duplex 2-fiber connectors (LC, CS, SN, MDC) and how to fix RX_LOS polarity swaps in the field",
    "commands": [
      {
        "id": "lc-cs-sn-mdc-duplex",
        "desc": "Duplex 2-fiber connectors (LC, CS, SN, MDC) and how to fix RX_LOS polarity swaps in the field",
        "cmd": "LC Duplex (FR4/LR4/SR/DR1)   |   CS / SN / MDC (High-Density 2xFR4 / 4xDR1 breakouts)",
        "details": "",
        "flags": [
          [
            "Both ends show RX -40 dBm (LOS)",
            "If both transceivers transmit healthy TX power (~0 dBm) but both read -40 dBm RX, TX is going to TX — pop the LC duplex clip and swap A/B fibers on ONE end!"
          ],
          [
            "UPC (Blue) vs APC (Green)",
            "Duplex LR4/FR4/CWDM4 transceivers almost always use flat Blue LC/UPC; Single-Mode MPO (DR4/DR8) ALWAYS uses angled Green MPO/APC!"
          ]
        ],
        "tip": "TX ok + RX -40dBm on both sides = roll LC clip",
        "tags": [
          "MPO Pinning & Polarity",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "lc",
          "duplex",
          "cs",
          "sn",
          "mdc",
          "los",
          "swap",
          "roll",
          "upc",
          "apc"
        ]
      }
    ]
  },
  {
    "id": "mpo-polarity-connectors-pro-tips",
    "badge": "tip",
    "title": "MPO Pinning & Polarity: Pro Tips & Best Practices",
    "subtitle": "MPO Mating Rules, Polarity Inversion & Connector Keying",
    "commands": [
      {
        "id": "mpo-polarity-connectors-tips-card",
        "desc": "MPO Mating Rules, Polarity Inversion & Connector Keying",
        "cmd": "cat /sys/class/net/eth0/device/infiniband/*/ports/*/counters/link_downed_counter",
        "details": "Transceiver optical receptacles are always FEMALE (unpinned). Connecting cables MUST BE MALE (pinned) to transceiver interfaces, and female-to-female patch cords require alignment pins inside the MPO bulkhead adapter. Direct transceiver-to-transceiver patch cables must use Type B (Key-Up to Key-Up rollover) polarity to ensure TX lanes cross to RX lanes.",
        "flags": [
          [
            "MPO Female (Unpinned)",
            "Smooth guide holes without pins; standard for all QSFP/OSFP optical receptacles"
          ],
          [
            "MPO Male (Pinned)",
            "Metal guide alignment pins protruding from ferrule; mandatory for patch panels"
          ],
          [
            "Type-B Polarity",
            "Key-Up to Key-Up crossover; fiber 1 maps to fiber 12 (TX to RX)"
          ]
        ],
        "tip": "Never attempt to mate two pinned (male) MPO connectors; guide pins will collide and shatter the ceramic ferrule micro-lenses.",
        "tags": [
          "mpo-polarity-connectors",
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("fo-mpo-polarity_bookmarks") || "[]"))
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
  const allCards = FO_FO_MPO_POLARITY_DATA;
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

  for (const card of FO_FO_MPO_POLARITY_DATA) {
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
        codeBoxLines.join("\n"),
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
        localStorage.setItem("fo-mpo-polarity_bookmarks", JSON.stringify([...state.bookmarks]));
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
