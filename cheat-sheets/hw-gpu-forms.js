// hw-gpu-forms.js
// Standalone interactive cheat sheet for Rack & hardware reference: GPU Form Factors: SXM (HGX/DGX), PCIe and Rack-Scale NVL72
const HWREF_HW_GPU_FORMS_DATA = [
  {
    "id": "gpuform-cmd-1",
    "badge": "gpu",
    "title": "GPU form factors: Which GPUs, which bus IDs, which power limits",
    "subtitle": "Which GPUs, which bus IDs, which power limits",
    "commands": [
      {
        "id": "gpu-forms-identify",
        "desc": "Which GPUs, which bus IDs, which power limits",
        "cmd": "nvidia-smi --query-gpu=index,name,pci.bus_id,power.limit,serial --format=csv",
        "details": "",
        "flags": [
          [
            "SXM",
            "Module on an HGX baseboard: NVLink through NVSwitch, power through the board"
          ],
          [
            "PCIe",
            "Standard card in a slot, powered by 12V-2x6; NVLink only with a bridge (NVL variants)"
          ],
          [
            "power.limit",
            "H200 SXM up to 700 W; H200 NVL (PCIe) up to 600 W"
          ]
        ],
        "tip": "topo -m tells SXM (NV18 everywhere) from PCIe (PIX/SYS) at a glance",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "sxm",
          "pcie",
          "hgx",
          "topology",
          "identify"
        ]
      }
    ]
  },
  {
    "id": "gpuform-flags-1",
    "badge": "gpu",
    "title": "GPU form factors: More options",
    "subtitle": "More options for: Which GPUs, which bus IDs, which power limits",
    "commands": [
      {
        "id": "gpu-forms-identify-flags-card",
        "desc": "More options and gotchas for: Which GPUs, which bus IDs, which power limits",
        "cmd": "nvidia-smi --query-gpu=index,name,pci.bus_id,power.limit,serial --format=csv",
        "hideCode": false,
        "flags": [
          [
            "serial",
            "Goes in the RMA, with the bus ID"
          ]
        ],
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "flags",
          "options",
          "sxm",
          "pcie",
          "hgx"
        ]
      }
    ]
  },
  {
    "id": "gpuform-recipes-1",
    "badge": "gpu",
    "title": "GPU form factors: Related commands",
    "subtitle": "Related commands for: Which GPUs, which bus IDs, which power limits",
    "commands": [
      {
        "id": "gpu-forms-identify-sub-1",
        "desc": "How GPUs and NICs connect: NV# = NVLink, PIX/PXB/SYS = PCIe paths",
        "cmd": "nvidia-smi topo -m",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "recipe",
          "sxm",
          "pcie",
          "hgx"
        ]
      },
      {
        "id": "gpu-forms-identify-sub-2",
        "desc": "NVIDIA devices on the PCIe bus",
        "cmd": "lspci -d 10de: -nn",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "recipe",
          "sxm",
          "pcie",
          "hgx"
        ]
      }
    ]
  },
  {
    "id": "gpuform-cmd-2",
    "badge": "gpu",
    "title": "GPU form factors: HGX / DGX 8-GPU systems",
    "subtitle": "HGX / DGX 8-GPU systems",
    "commands": [
      {
        "id": "gpu-forms-hgx",
        "desc": "HGX / DGX 8-GPU systems",
        "cmd": "nvidia-smi nvlink -s",
        "details": "",
        "flags": [
          [
            "HGX B200 / B300",
            "8 GPUs, NVLink 5: 1.8 TB/s per GPU, 14.4 TB/s total"
          ],
          [
            "DGX B200",
            "8 Blackwell GPUs, 10 RU, about 14.3 kW max, 10-35 °C operating"
          ],
          [
            "HGX Rubin NVL8",
            "NVLink 6: 3.6 TB/s per GPU"
          ]
        ],
        "tip": "Inactive NVLinks on one GPU point at that module or its baseboard connector",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "hgx",
          "dgx",
          "nvlink",
          "nvswitch",
          "b200",
          "b300"
        ]
      }
    ]
  },
  {
    "id": "gpuform-flags-2",
    "badge": "gpu",
    "title": "GPU form factors: More options",
    "subtitle": "More options for: HGX / DGX 8-GPU systems",
    "commands": [
      {
        "id": "gpu-forms-hgx-flags-card",
        "desc": "More options and gotchas for: HGX / DGX 8-GPU systems",
        "cmd": "nvidia-smi nvlink -s",
        "hideCode": false,
        "flags": [
          [
            "Fabric Manager",
            "Must run, at the driver's exact version, before CUDA works on NVSwitch systems"
          ],
          [
            "Service",
            "A failed SXM GPU usually means a baseboard-level RMA: collect nvidia-bug-report first"
          ]
        ],
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "flags",
          "options",
          "hgx",
          "dgx",
          "nvlink"
        ]
      }
    ]
  },
  {
    "id": "gpuform-recipes-2",
    "badge": "gpu",
    "title": "GPU form factors: Related commands",
    "subtitle": "Related commands for: HGX / DGX 8-GPU systems",
    "commands": [
      {
        "id": "gpu-forms-hgx-sub-1",
        "desc": "Fabric Manager state",
        "cmd": "systemctl status nvidia-fabricmanager --no-pager",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "recipe",
          "hgx",
          "dgx",
          "nvlink"
        ]
      }
    ]
  },
  {
    "id": "gpuform-cmd-3",
    "badge": "gpu",
    "title": "GPU form factors: Rack-scale",
    "subtitle": "Rack-scale: GB200 / GB300 NVL72",
    "commands": [
      {
        "id": "gpu-forms-nvl72",
        "desc": "Rack-scale: GB200 / GB300 NVL72",
        "cmd": "nvidia-smi -q | grep -iA3 fabric",
        "details": "",
        "flags": [
          [
            "GB200 NVL72",
            "36 Grace CPUs + 72 Blackwell GPUs in one NVLink domain (130 TB/s)"
          ],
          [
            "GB300 NVL72",
            "72 Blackwell Ultra GPUs, fully liquid-cooled"
          ],
          [
            "One rack = one system",
            "NVLink switch trays join compute trays; a tray fault affects the domain"
          ]
        ],
        "tip": "On NVL72, check the NVLink switch trays before blaming one GPU",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "nvl72",
          "gb200",
          "gb300",
          "rack-scale",
          "liquid"
        ]
      }
    ]
  },
  {
    "id": "gpuform-flags-3",
    "badge": "gpu",
    "title": "GPU form factors: More options",
    "subtitle": "More options for: Rack-scale: GB200 / GB300 NVL72",
    "commands": [
      {
        "id": "gpu-forms-nvl72-flags-card",
        "desc": "More options and gotchas for: Rack-scale: GB200 / GB300 NVL72",
        "cmd": "nvidia-smi -q | grep -iA3 fabric",
        "hideCode": false,
        "flags": [
          [
            "Liquid",
            "Coolant and leak alarms are part of triage (Cooling sheet)"
          ]
        ],
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "flags",
          "options",
          "nvl72",
          "gb200",
          "gb300"
        ]
      }
    ]
  },
  {
    "id": "gpuform-pro-tips",
    "badge": "tip",
    "title": "GPU form factors: Pro Tip",
    "subtitle": "Evidence first, then the RMA",
    "commands": [
      {
        "id": "gpuform-tips-card",
        "desc": "Evidence first, then the RMA",
        "cmd": "sudo nvidia-bug-report.sh",
        "details": "Before any GPU swap, collect nvidia-bug-report (long-running), the SEL, and nvidia-smi -q. Record logical and physical IDs together: GPU index, UUID, bus ID and the SXM module or slot number. The NVIDIA DC suite and docs/playbooks/gpu-nvlink.md have the full flow.",
        "flags": [
          [
            "nvidia-smi -q",
            "Full GPU state"
          ],
          [
            "UUID + BDF + slot",
            "Logical and physical IDs"
          ]
        ],
        "tip": "Drain before nvidia-bug-report on a busy node",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "tips",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("hw-gpu-forms_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Command Syntax Highlighting
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
  const allCards = HWREF_HW_GPU_FORMS_DATA;
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

  for (const card of HWREF_HW_GPU_FORMS_DATA) {
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

      const codeBoxHtml = cmd.diagram
        ? window.CheatSheetCommon.renderDiagram(cmd.diagram)
        : cmd.hideCode ? "" : [
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <span class="copy-hint">Copy</span>',
        '  </div>'
      ].join("\n");

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
        '  ' + codeBoxHtml,
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
        localStorage.setItem("hw-gpu-forms_bookmarks", JSON.stringify([...state.bookmarks]));
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
