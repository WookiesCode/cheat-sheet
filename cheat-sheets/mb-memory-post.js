// mb-memory-post.js
// Standalone interactive cheat sheet for Motherboards: Memory (MRC) POST Codes — ASUS & GIGABYTE (50–55, B0–BF)
const MB_MB_MEMORY_POST_DATA = [
  {
    "id": "memory-post-cmd-1",
    "badge": "mrc",
    "title": "Memory MRC Codes: Decode AMI Aptio V memory initialization halt codes",
    "subtitle": "Decode AMI Aptio V memory initialization halt codes (`0x50`–`0x55`) on ASUS & GIGABYTE boards",
    "commands": [
      {
        "id": "post-50-55-memory-init",
        "desc": "Decode AMI Aptio V memory initialization halt codes (`0x50`–`0x55`) on ASUS & GIGABYTE boards",
        "cmd": "POST 0x53 (Invalid/Incompatible RAM)   |   POST 0x55 (Memory Not Installed / Unseated)",
        "details": "",
        "flags": [
          [
            "0x50 / 0x51",
            "Memory initialization error: Invalid memory type / incompatible speed (0x50) or SPD EEPROM read failure over I2C/I3C (0x51)"
          ],
          [
            "0x52",
            "Memory initialization error: Invalid memory size or mismatched rank/capacity modules across symmetric channels"
          ],
          [
            "0x53",
            "Memory initialization error: Memory modules detected, but no usable/compatible memory configured (mixing RDIMM & UDIMM/LRDIMM!)"
          ]
        ],
        "tip": "0x55 = Check primary slot population (ASUS=A1, GIGABYTE=A0) & CPU socket pins!",
        "tags": [
          "Memory MRC Codes",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "50",
          "51",
          "52",
          "53",
          "54",
          "55",
          "memory",
          "ram",
          "dimm",
          "rdimm",
          "mrc",
          "asus",
          "gigabyte"
        ]
      }
    ]
  },
  {
    "id": "memory-post-flags-1",
    "badge": "mrc",
    "title": "Memory MRC Codes: POST Hex Codes & Options",
    "subtitle": "Key hex codes, parameters, and error indicators for Decode AMI Aptio V memory initialization halt codes (`0x50`–`0x55`) on ASUS & GIGABYTE boards",
    "commands": [
      {
        "id": "post-50-55-memory-init-flags-card",
        "desc": "Hex code lookup and diagnostics breakdown for Decode AMI Aptio V memory initialization halt codes (`0x50`–`0x55`) on ASUS & GIGABYTE boards",
        "cmd": "POST 0x53 (Invalid/Incompatible RAM)   |   POST 0x55 (Memory Not Installed / Unseated)",
        "flags": [
          [
            "0x54",
            "Unspecified memory initialization error during early PEI MRC training"
          ],
          [
            "0x55",
            "Memory Not Installed: Zero DIMMs detected on CPU0 primary channel (ASUS: A1; GIGABYTE: A0) or uneven CPU cooler torque"
          ]
        ],
        "details": "Common operational and diagnostic POST / Q-Codes on ASUS and GIGABYTE server motherboards.",
        "tags": [
          "Memory MRC Codes",
          "flags",
          "options",
          "syntax"
        ]
      }
    ]
  },
  {
    "id": "memory-post-cmd-2",
    "badge": "mrc",
    "title": "Memory MRC Codes: Decode Intel Xeon & AMD EPYC DDR4/DDR5 MRC channel training codes",
    "subtitle": "Decode Intel Xeon & AMD EPYC DDR4/DDR5 MRC channel training codes (`0xB0`–`0xBF`, `0x2C`–`0x2F`)",
    "commands": [
      {
        "id": "post-b0-bf-xeon-epyc-training",
        "desc": "Decode Intel Xeon & AMD EPYC DDR4/DDR5 MRC channel training codes (`0xB0`–`0xBF`, `0x2C`–`0x2F`)",
        "cmd": "POST 0xB0 (DIMM Detect)  ->  0xB4 (Rank/RCD)  ->  0xB7 (Channel Training Fail)  ->  0xBF (MRC Done)",
        "details": "",
        "flags": [
          [
            "0x2C / 0x2E / 0x2F",
            "Early PEI Memory detection (2C), configuring memory timings (2E), and memory initialization complete (2F)"
          ],
          [
            "0xB0 / 0xB1",
            "Intel MRC: Detect presence of DIMMs via SPD (B0) and check DDR frequency/voltage compatibility (B1)"
          ],
          [
            "0xB4 / 0xB6",
            "Registering Clock Driver (RCD) & Data Buffer initialization on DDR4/DDR5 RDIMMs/MRDIMMs"
          ]
        ],
        "tip": "When stuck on 0xB7, check BMC Event Log (SEL) to see which exact DIMM slot failed!",
        "tags": [
          "Memory MRC Codes",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "b0",
          "b1",
          "b4",
          "b7",
          "b8",
          "ba",
          "bf",
          "2c",
          "2e",
          "2f",
          "mrc",
          "training",
          "xeon",
          "epyc"
        ]
      }
    ]
  },
  {
    "id": "memory-post-flags-2",
    "badge": "mrc",
    "title": "Memory MRC Codes: POST Hex Codes & Options",
    "subtitle": "Key hex codes, parameters, and error indicators for Decode Intel Xeon & AMD EPYC DDR4/DDR5 MRC channel training codes (`0xB0`–`0xBF`, `0x2C`–`0x2F`)",
    "commands": [
      {
        "id": "post-b0-bf-xeon-epyc-training-flags-card",
        "desc": "Hex code lookup and diagnostics breakdown for Decode Intel Xeon & AMD EPYC DDR4/DDR5 MRC channel training codes (`0xB0`–`0xBF`, `0x2C`–`0x2F`)",
        "cmd": "POST 0xB0 (DIMM Detect)  ->  0xB4 (Rank/RCD)  ->  0xB7 (Channel Training Fail)  ->  0xBF (MRC Done)",
        "flags": [
          [
            "0xB7 / 0xB8",
            "DDR channel training failure / marginal eye margin on a specific DIMM channel (check BMC SEL for exact failing DIMM slot label!)"
          ],
          [
            "0xBA / 0xBC / 0xBF",
            "Memory BIST (Built-In Self Test) & Rank Margin Tool (RMT) validation; 0xBF = MRC memory init complete"
          ]
        ],
        "details": "Common operational and diagnostic POST / Q-Codes on ASUS and GIGABYTE server motherboards.",
        "tags": [
          "Memory MRC Codes",
          "flags",
          "options",
          "syntax"
        ]
      }
    ]
  },
  {
    "id": "memory-post-cmd-3",
    "badge": "mrc",
    "title": "Memory MRC Codes: ASUS",
    "subtitle": "ASUS (K14/KRPA/Z13) vs GIGABYTE (MZ/MD/MS) server motherboard DIMM slot naming & population order",
    "commands": [
      {
        "id": "asus-gigabyte-dimm-population",
        "desc": "ASUS (K14/KRPA/Z13) vs GIGABYTE (MZ/MD/MS) server motherboard DIMM slot naming & population order",
        "cmd": "1-DIMM Minimal Boot Test:  ASUS = CPU1_DIMM_A1   |   GIGABYTE = CPU0_DIMM_A0 (or DIMM_P0_A0)",
        "details": "",
        "flags": [
          [
            "ASUS Slot Naming",
            "ASUS server boards label channels A..L and slots 1..2: always populate Slot 1 (e.g. DIMM_A1, B1, C1...) first before Slot 2!"
          ],
          [
            "GIGABYTE Slot Naming",
            "GIGABYTE server boards use 0-indexed labels (DIMM_P0_A0, B0, C0...): always populate Slot 0 (furthest from CPU in 2DPC) first!"
          ],
          [
            "Never Mix RDIMM & LRDIMM",
            "Mixing Registered (RDIMM), Load-Reduced (LRDIMM/3DS), or Unbuffered (ECC UDIMM) on the same board halts at POST 0x53"
          ]
        ],
        "tip": "Wait at least 4 minutes on first DDR5 boot before assuming a hang!",
        "tags": [
          "Memory MRC Codes",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "population",
          "slots",
          "a1",
          "a0",
          "ddr5",
          "ddr4",
          "rdimm",
          "lrdimm",
          "asus",
          "gigabyte"
        ]
      }
    ]
  },
  {
    "id": "memory-post-flags-3",
    "badge": "mrc",
    "title": "Memory MRC Codes: POST Hex Codes & Options",
    "subtitle": "Key hex codes, parameters, and error indicators for ASUS (K14/KRPA/Z13) vs GIGABYTE (MZ/MD/MS) server motherboard DIMM slot naming & population order",
    "commands": [
      {
        "id": "asus-gigabyte-dimm-population-flags-card",
        "desc": "Hex code lookup and diagnostics breakdown for ASUS (K14/KRPA/Z13) vs GIGABYTE (MZ/MD/MS) server motherboard DIMM slot naming & population order",
        "cmd": "1-DIMM Minimal Boot Test:  ASUS = CPU1_DIMM_A1   |   GIGABYTE = CPU0_DIMM_A0 (or DIMM_P0_A0)",
        "flags": [
          [
            "DDR5 PMIC Training",
            "First boot after swapping DDR5 RDIMMs on EPYC 9004/9005 or Xeon 4th/5th Gen takes 2–5 minutes at 0x2E/0xB4/0xEA — do not power-cycle early!"
          ]
        ],
        "details": "Common operational and diagnostic POST / Q-Codes on ASUS and GIGABYTE server motherboards.",
        "tags": [
          "Memory MRC Codes",
          "flags",
          "options",
          "syntax"
        ]
      }
    ]
  },
  {
    "id": "memory-post-pro-tips",
    "badge": "tip",
    "title": "Memory MRC Codes: Pro Tips & Best Practices",
    "subtitle": "Memory Initialization & Rank Training Fault Isolation",
    "commands": [
      {
        "id": "memory-post-tips-card",
        "desc": "Memory Initialization & Rank Training Fault Isolation",
        "cmd": "dmidecode -t 17 | grep -E \"(Locator|Size|Speed|Part Number)\" && edac-util -v",
        "details": "POST codes 0x50–0x55 signal early PEI Memory Reference Code (MRC) failure. 0x53 indicates memory initialization failure (bad SPD read or unsupported timing), while 0x55 indicates no usable memory detected. B0–BF codes indicate Xeon/EPYC channel-specific training errors. If stuck on 0x55, reseat the primary channel DIMM in Slot A1.",
        "flags": [
          [
            "0x53 (Memory Init)",
            "Memory initialization error: unreadable SPD EEPROM or timing mismatch"
          ],
          [
            "0x55 (No Memory)",
            "No memory installed: CPU socket pin contact fault or unseated A1 DIMM"
          ],
          [
            "0xB7 / 0xBD (Training)",
            "DDR4/DDR5 rank margin training failure on designated memory channel"
          ]
        ],
        "tip": "Always populate DIMM slots with the furthest slot from the CPU socket first (typically white/blue slots designated A1, B1, C1).",
        "tags": [
          "memory-post",
          "tips",
          "pro",
          "motherboard",
          "post",
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
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("mb-memory-post_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Motherboard CLI / POST Syntax Highlighting
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
  const allCards = MB_MB_MEMORY_POST_DATA;
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

  for (const card of MB_MB_MEMORY_POST_DATA) {
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
        '    <span class="copy-hint">Copy</span>',
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
        localStorage.setItem("mb-memory-post_bookmarks", JSON.stringify([...state.bookmarks]));
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
