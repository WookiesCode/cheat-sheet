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
        "cmd": "POST 0x53 (No usable memory)   |   POST 0x55 (Memory not installed)",
        "details": "",
        "flags": [
          [
            "0x50",
            "Memory initialization error: invalid memory type or incompatible memory speed"
          ],
          [
            "0x51",
            "Memory initialization error: SPD reading has failed"
          ],
          [
            "0x52",
            "Memory initialization error: invalid memory size, or memory modules do not match"
          ],
          [
            "0x53",
            "Memory initialization error: no usable memory detected (for example after mixing RDIMM and LRDIMM)"
          ],
          [
            "0x54",
            "Unspecified memory initialization error"
          ],
          [
            "0x55",
            "Memory not installed: check the first slot of CPU0 (ASUS boards often call it A1, GIGABYTE A0; the manual has the exact name)"
          ]
        ],
        "tip": "0x55 = no DIMM found: reseat the first slot of CPU0",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf",
              "title": "AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"
            }
          ],
          "note": "Corrected 2026-11-10: wording follows AMI's Aptio V table."
        }
      }
    ]
  },
  {
    "id": "memory-post-cmd-2",
    "badge": "mrc",
    "title": "Memory MRC Codes: Intel Xeon memory init",
    "subtitle": "Intel Xeon memory init (MRC) codes B0–BF, and why the same codes mean something else later in boot",
    "commands": [
      {
        "id": "post-b0-bf-xeon-epyc-training",
        "desc": "Intel Xeon memory init (MRC) codes B0–BF, and why the same codes mean something else later in boot",
        "cmd": "Intel MRC: 0xB0 (Detect DIMMs)  ->  0xB7 (Train DDR4 ranks)  ->  0xBF (MRC done)   |   AMI BDS later: B2 Option ROM, B4 USB hot plug, B7 NVRAM reset",
        "details": "",
        "flags": [
          [
            "0x2C / 0x2E / 0x2F",
            "AMI PEI: memory presence detection (2C), configuring memory (2E), memory initialization, other (2F)"
          ],
          [
            "0xB0 / 0xB1 / 0xB2",
            "Intel MRC: detect DIMM population (B0), set DDR4 frequency (B1), gather remaining SPD data (B2)"
          ],
          [
            "0xB4 / 0xB6",
            "Intel MRC: evaluate RAS modes and save rank information (B4); JEDEC initialization sequence (B6)"
          ],
          [
            "0xB7 / 0xB8",
            "Intel MRC: train DDR4 ranks (B7); initialize closed/open-loop thermal throttling (B8)"
          ],
          [
            "0xB9–0xBC / 0xBF",
            "Intel MRC: memory test, software init, memory map, RAS configuration; BF = MRC is done"
          ],
          [
            "Same code, later phase",
            "After memory init, AMI reuses B0–B7 for BDS (B2 legacy option ROM, B4 USB hot plug, B7 configuration reset). AMD EPYC boards do not use B0–BF for memory training"
          ],
          [
            "Intel fatal memory errors",
            "Intel lists E8 = no usable memory and EA = DDR4 channel training error"
          ]
        ],
        "tip": "Stuck on 0xB7 during memory init: check the BMC SEL for the failing DIMM",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://miyconst.github.io/assets/2024-07-27-intel-s2600-tpm20/Intel_S2600ST_TPS.pdf",
              "title": "Intel S2600ST TPS: MRC progress and error codes (copy)"
            },
            {
              "url": "https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf",
              "title": "AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"
            }
          ],
          "note": "Corrected 2026-11-10: B0–BF are Intel MRC codes during memory init and AMI BDS codes later; AMD does not use them for training."
        }
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
            "ASUS server boards usually label channels A, B, C… and slots 1 and 2: fill slot 1 of each channel first"
          ],
          [
            "GIGABYTE Slot Naming",
            "GIGABYTE server boards usually count from 0 (DIMM_P0_A0, B0, C0…): fill slot 0 first"
          ],
          [
            "Never Mix RDIMM & LRDIMM",
            "Mixing RDIMM, LRDIMM/3DS or UDIMM on one board fails memory init (AMI 0x50-0x53 range)"
          ],
          [
            "DDR5 first boot",
            "The first boot after a DDR5 change can spend minutes in memory training: do not power-cycle it early"
          ]
        ],
        "tip": "Give the first DDR5 boot several minutes before assuming a hang",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [],
          "note": "Board-specific (LED names, jumper positions, menu paths): check this board's manual; not confirmed against a vendor document here."
        }
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
        "details": "AMI's PEI memory errors are 0x50–0x55: 0x51 = SPD read failed, 0x53 = no usable memory detected, 0x55 = memory not installed. On Intel Xeon boards, B0–BF during memory init are Intel MRC progress codes (B7 = train DDR4 ranks). If stuck on 0x55, reseat the first DIMM slot of CPU0.",
        "flags": [
          [
            "0x53 (No usable memory)",
            "Memory was found but none of it could be used: mixed types, bad DIMM or wrong population"
          ],
          [
            "0x55 (Not installed)",
            "No DIMM detected: unseated first slot, or a socket-contact problem"
          ],
          [
            "0xB7 (Intel MRC)",
            "Training DDR4 ranks: a hang here points at one DIMM or channel; the BMC SEL names it"
          ]
        ],
        "tip": "Populate DIMMs in the order the board manual's population table gives.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf",
              "title": "AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"
            },
            {
              "url": "https://miyconst.github.io/assets/2024-07-27-intel-s2600-tpm20/Intel_S2600ST_TPS.pdf",
              "title": "Intel S2600ST TPS: MRC progress and error codes (copy)"
            },
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/edac-utils/edac-util.1.en.html",
              "title": "edac-util(1)"
            }
          ],
          "note": "Corrected 2026-11-10: 0x53 is no usable memory and 0x55 not installed (was swapped); the SPD failure is 0x51."
        },
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
