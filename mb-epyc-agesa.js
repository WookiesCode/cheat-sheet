// mb-epyc-agesa.js
// Standalone interactive cheat sheet for Motherboards: AMD EPYC CPU (AGESA ABL & PSP) POST Codes (E0–FF, D0–DF)
const MB_MB_EPYC_AGESA_DATA = [
  {
    "id": "amd-epyc-agesa-cmd-1",
    "badge": "epyc",
    "title": "AMD EPYC AGESA & PSP: AMD EPYC boards show AMD firmware codes before AMI UEFI starts: decode those from the board manual, not AMI's table",
    "subtitle": "AMD EPYC boards show AMD firmware codes before AMI UEFI starts: decode those from the board manual, not AMI's table",
    "commands": [
      {
        "id": "epyc-2stage-abl-post",
        "desc": "AMD EPYC boards show AMD firmware codes before AMI UEFI starts: decode those from the board manual, not AMI's table",
        "cmd": "Stage 1: AMD PSP / AGESA boot loader (vendor-specific codes)   -->   Stage 2: AMI Aptio V UEFI (0x10 onward)",
        "details": "",
        "flags": [
          [
            "Why other codes appear first",
            "On AMD EPYC, the Platform Security Processor and AGESA boot loader (ABL) train memory before the x86 cores run AMI's UEFI, and they write their own port-80 codes"
          ],
          [
            "Do not decode with AMI's table",
            "In AMI's table E0–E8 are S3 resume and E9–EF S3 resume errors (EA = S3 boot script error). Intel's MRC uses E8/EA for memory errors. Neither applies to EPYC's ABL codes"
          ],
          [
            "Where to look",
            "The board manual's AMD POST code section and the BMC SEL"
          ]
        ],
        "tip": "Early-code hang after a DIMM or CPU change: reseat, then look the code up in the board manual",
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
        ],
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
            }
          ],
          "note": "Corrected 2026-11-10: removed specific E0–EF ABL meanings and socket-torque figures that contradicted each other and had no source."
        }
      }
    ]
  },
  {
    "id": "amd-epyc-agesa-cmd-2",
    "badge": "epyc",
    "title": "AMD EPYC AGESA & PSP: Two-socket boards",
    "subtitle": "Two-socket boards (AMD EPYC xGMI, Intel Xeon UPI): find which socket failed, and update BIOS before a newer CPU",
    "commands": [
      {
        "id": "epyc-xgmi-dual-socket",
        "desc": "Two-socket boards (AMD EPYC xGMI, Intel Xeon UPI): find which socket failed, and update BIOS before a newer CPU",
        "cmd": "BMC SEL: which socket (P0 / P1) logged the error   |   New CPU generation: update BIOS first",
        "details": "",
        "flags": [
          [
            "2-socket hang",
            "Read the BMC SEL to see whether the failing DIMM or link is on socket 0 or 1, then reseat or swap on that side"
          ],
          [
            "Newer CPU, older BIOS",
            "The BIOS must support the CPU generation: update it before installing the new CPU"
          ],
          [
            "BIOS update without a supported CPU",
            "Many server BMCs can flash the host BIOS with the host off: check your board's BMC guide"
          ]
        ],
        "tip": "Update BIOS through the BMC before swapping in a newer CPU generation",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [],
          "note": "Corrected 2026-11-10: removed unsourced xGMI/UPI code numbers. General advice; check your board's BMC guide."
        }
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
        "details": "AMD EPYC boots in two stages: AMD's PSP and AGESA boot loader train memory first, then AMI's UEFI runs its own PEI/DXE codes. The early codes are vendor-specific, so decode them with the board manual.",
        "flags": [
          [
            "lscpu | grep -E \"Socket|NUMA\"",
            "Confirm both sockets and all NUMA nodes came up"
          ],
          [
            "numactl --hardware",
            "Confirm every NUMA node has memory (a missing node points at a socket or its DIMMs)"
          ],
          [
            "2-Stage Boot",
            "AMD firmware codes first, then a reset into AMI's 0x10-onward codes: normal behavior"
          ]
        ],
        "tip": "AMI's E0–EF meanings (S3 resume) do not apply to EPYC's early boot codes: use the board manual.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf",
              "title": "AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lscpu.1.html",
              "title": "lscpu(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ],
          "note": "Corrected 2026-11-10: removed 0xEA/0xEE meanings and a torque value that contradicted the other card."
        },
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
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
