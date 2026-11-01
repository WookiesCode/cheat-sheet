// mb-epyc-agesa.js
// Standalone interactive cheat sheet for Motherboards: AMD EPYC CPU (AGESA ABL & PSP) POST Codes (E0–FF, D0–DF)
const MB_MB_EPYC_AGESA_DATA = [
  {
    "id": "amd-epyc-agesa-cmd-1",
    "badge": "epyc",
    "title": "AMD EPYC AGESA & PSP: Understand the 2-Stage POST sequence on GIGABYTE & ASUS AMD EPYC",
    "subtitle": "Understand the 2-Stage POST sequence on GIGABYTE & ASUS AMD EPYC (Rome/Milan/Genoa/Turin) boards",
    "commands": [
      {
        "id": "epyc-2stage-abl-post",
        "desc": "Understand the 2-Stage POST sequence on GIGABYTE & ASUS AMD EPYC (Rome/Milan/Genoa/Turin) boards",
        "cmd": "Stage 1: AMD PSP & AGESA BootLoader (0xE0..0xFF / 0xD0..0xDF)   -->   Stage 2: AMI Aptio V UEFI (0x10..0xAD)",
        "details": "",
        "flags": [
          [
            "Why codes cycle E0–FF first",
            "On AMD EPYC (SP3/SP5), the integrated Platform Security Processor (PSP) and AGESA BootLoader (ABL) initialize Infinity Fabric and DDR4/DDR5 BEFORE x86 cores start AMI UEFI!"
          ],
          [
            "0xE0 / 0xE1 / 0xE2",
            "ABL0/ABL1: Early processor & memory parameter initialization and SPD readout across all 8 or 12 memory channels"
          ],
          [
            "0xE6 / 0xE7 / 0xE8",
            "ABL2/ABL3: PMU (PHY Microcontroller Unit) DDR4/DDR5 training across populated DIMM channels"
          ]
        ],
        "tip": "EPYC SP3/SP5 sockets are extremely torque-sensitive: uneven Torx T20 screws cause 0xEA/0x55!",
        "tags": [
          "AMD EPYC AGESA & PSP",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "epyc",
          "amd",
          "agesa",
          "abl",
          "psp",
          "e0",
          "e1",
          "e6",
          "ea",
          "eb",
          "ee",
          "sp3",
          "sp5",
          "genoa",
          "turin"
        ]
      }
    ]
  },
  {
    "id": "amd-epyc-agesa-flags-1",
    "badge": "epyc",
    "title": "AMD EPYC AGESA & PSP: POST Hex Codes & Options",
    "subtitle": "Key hex codes, parameters, and error indicators for Understand the 2-Stage POST sequence on GIGABYTE & ASUS AMD EPYC (Rome/Milan/Genoa/Turin) boards",
    "commands": [
      {
        "id": "epyc-2stage-abl-post-flags-card",
        "desc": "Hex code lookup and diagnostics breakdown for Understand the 2-Stage POST sequence on GIGABYTE & ASUS AMD EPYC (Rome/Milan/Genoa/Turin) boards",
        "cmd": "Stage 1: AMD PSP & AGESA BootLoader (0xE0..0xFF / 0xD0..0xDF)   -->   Stage 2: AMI Aptio V UEFI (0x10..0xAD)",
        "flags": [
          [
            "0xEA / 0xEB / 0xED",
            "ABL Memory Training Error: PMU failed to train a DDR4/DDR5 channel (reseat DIMMs, check CPU socket torque of 12.0–13.5 in-lbs on Torx T20)"
          ],
          [
            "0xEE / 0xEF",
            "ABL Stage complete — releasing x86 Zen cores from reset to begin AMI Aptio V SEC/PEI (0x10+)"
          ]
        ],
        "details": "Common operational and diagnostic POST / Q-Codes on ASUS and GIGABYTE server motherboards.",
        "tags": [
          "AMD EPYC AGESA & PSP",
          "flags",
          "options",
          "syntax"
        ]
      }
    ]
  },
  {
    "id": "amd-epyc-agesa-cmd-2",
    "badge": "epyc",
    "title": "AMD EPYC AGESA & PSP: Diagnose Dual-Socket",
    "subtitle": "Diagnose Dual-Socket (2P) AMD EPYC Infinity Fabric (xGMI) & Intel Xeon UPI link training hangs",
    "commands": [
      {
        "id": "epyc-xgmi-dual-socket",
        "desc": "Diagnose Dual-Socket (2P) AMD EPYC Infinity Fabric (xGMI) & Intel Xeon UPI link training hangs",
        "cmd": "POST 0xE3 / 0xE4 (EPYC xGMI Link Training)   |   POST 0x19 / 0x2A / 0x3B (Intel Xeon UPI Init)",
        "details": "",
        "flags": [
          [
            "0xE3 / 0xE4 (AMD EPYC 2P)",
            "xGMI (External Global Memory Interconnect) inter-socket link training between CPU0 (P0) and CPU1 (P1)"
          ],
          [
            "Socket 1 (P1) Fault Isolation",
            "On GIGABYTE MZ72/MZ73 & ASUS KRPA-U16/K14PA: if 2P board halts on 0xE4 or 0xB7, check BMC SEL to see if error is on P0 (Socket 0) or P1 (Socket 1)"
          ],
          [
            "Mixed Stepping / AGESA Mismatch",
            "Installing an EPYC 9005 (Turin) or 9004 (Genoa) CPU on a board with older BIOS halts immediately at 0x00 / 0xD0 / 0xE0 — update BIOS via BMC first!"
          ]
        ],
        "tip": "You can flash BIOS via ASUS ASMB11 or GIGABYTE GSM BMC even without a supported CPU installed!",
        "tags": [
          "AMD EPYC AGESA & PSP",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "xgmi",
          "upi",
          "2p",
          "dual-socket",
          "e3",
          "e4",
          "mz73",
          "k14",
          "krpa"
        ]
      }
    ]
  },
  {
    "id": "amd-epyc-agesa-pro-tips",
    "badge": "tip",
    "title": "AMD EPYC AGESA & PSP: Pro Tips & Best Practices",
    "subtitle": "AMD EPYC AGESA Boot Loader (ABL) & xGMI Infinity Fabric Diagnostics",
    "commands": [
      {
        "id": "amd-epyc-agesa-tips-card",
        "desc": "AMD EPYC AGESA Boot Loader (ABL) & xGMI Infinity Fabric Diagnostics",
        "cmd": "lscpu | grep -E \"(Model name|NUMA|Socket)\" && numactl --hardware",
        "details": "AMD EPYC motherboards exhibit a unique 2-stage POST cycle. The Platform Security Processor (PSP) boots first, displaying E0–FF codes on port 0x80 while loading microcode and initializing CPU chiplets. The board then resets and executes standard AMI Aptio PEI/DXE codes.",
        "flags": [
          [
            "0xEA (AGESA Memory)",
            "AMD memory training abort: uneven socket mounting pressure or damaged LGA pins"
          ],
          [
            "0xEE (xGMI Link)",
            "Dual-socket Infinity Fabric inter-socket link training timeout"
          ],
          [
            "2-Stage Boot",
            "Initial E0-FF codes followed by cold reset to 10-AA is expected normal behavior"
          ]
        ],
        "tip": "A halt at 0xEA indicates AMD AGESA memory timing failure; check DIMM thermal sensors and socket torque spec (14.0 in-lbs / 1.58 Nm).",
        "tags": [
          "amd-epyc-agesa",
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
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("mb-epyc-agesa_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = MB_MB_EPYC_AGESA_DATA;
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

  for (const card of MB_MB_EPYC_AGESA_DATA) {
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
        localStorage.setItem("mb-epyc-agesa_bookmarks", JSON.stringify([...state.bookmarks]));
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
