// nv-dcgm.js
// Standalone interactive cheat sheet for NVIDIA: DCGM (dcgmi) Diagnostics, Health & Profiling
const NV_NV_DCGM_DATA = [
  {
    "id": "dcgm-card-1",
    "badge": "dcgm",
    "title": "DCGM (dcgmi) Diagnostics: DCGM Diagnostic Qualification (Level 1–4)",
    "subtitle": "Run official NVIDIA DCGM hardware qualification & stress diagnostics (Levels 1 to 4)",
    "commands": [
      {
        "id": "dcgmi-diag-levels",
        "mode": "DIAGNOSTIC",
        "modeClass": "mode-t",
        "desc": "Run official NVIDIA DCGM hardware qualification & stress diagnostics (Levels 1 to 4)",
        "cmd": "dcgmi diag -r 1   |   dcgmi diag -r 2   |   dcgmi diag -r 3   |   dcgmi diag -r 4",
        "flags": [
          [
            "-r 1 (< 2.5 s)",
            "Quick: system validation (software, driver, deployment). Good as a job prologue"
          ],
          [
            "-r 2 (< 2.5 min on 4 GPUs, < 10.5 min on 8)",
            "Medium: adds the memory test and PCIe/NVLink"
          ],
          [
            "-r 3 (< 10 min on 4 GPUs, < 35 min on 8)",
            "Long: adds memory bandwidth, diagnostic, targeted stress and targeted power"
          ],
          [
            "-r 4 (< 45 min on 4 GPUs, < 2.25 h on 8)",
            "Extended: longer-running hardware diagnostics; each level includes the ones below"
          ]
        ],
        "tip": "Run -r 3 before returning node to prod",
        "tags": [
          "dcgmi",
          "diag",
          "burn-in",
          "stress",
          "qualification",
          "eud",
          "memtest"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/dcgm-diagnostics.html",
              "title": "DCGM diagnostics"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html",
              "title": "DCGM feature overview"
            }
          ],
          "note": "Corrected 2026-11-09: run times now from the DCGM docs (they grow with GPU count)."
        }
      }
    ]
  },
  {
    "id": "dcgm-card-2",
    "badge": "dcgm",
    "title": "DCGM (dcgmi) Diagnostics: Targeted Stress, PCIe & Memtest Plugins",
    "subtitle": "Run specific DCGM diagnostic tests by name (`pcie`, `memtest`, `targeted_stress`, `targeted_power`)",
    "commands": [
      {
        "id": "dcgmi-diag-targeted",
        "mode": "DIAGNOSTIC",
        "modeClass": "mode-t",
        "desc": "Run specific DCGM diagnostic tests by name (`pcie`, `memtest`, `targeted_stress`, `targeted_power`)",
        "cmd": "dcgmi diag -r 'pcie,memtest,targeted_stress,targeted_power' -i 0 -v",
        "flags": [
          [
            "pcie",
            "Tests Host-to-Device & Device-to-Host DMA bandwidth and PCIe AER replay errors"
          ],
          [
            "memtest",
            "Tests HBM memory patterns for SBE/DBE faults"
          ],
          [
            "targeted_stress / targeted_power",
            "Sustained FP64/Tensor compute load & max TDP thermal test"
          ],
          [
            "-j",
            "Output structured JSON diagnostic report for automated ticketing"
          ]
        ],
        "tags": [
          "plugin",
          "pcie",
          "memtest",
          "stress",
          "power",
          "pulse",
          "dcgmi"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/dcgm-diagnostics.html",
              "title": "DCGM diagnostics"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "dcgm-card-3",
    "badge": "dcgm",
    "title": "DCGM (dcgmi) Diagnostics: DCGM Discovery & Background Health Watches",
    "subtitle": "Discover GPUs/NVSwitches in DCGM hostengine and run passive background health checks",
    "commands": [
      {
        "id": "dcgmi-discovery-health",
        "mode": "HEALTH",
        "modeClass": "mode-n",
        "desc": "Discover GPUs/NVSwitches in DCGM hostengine and run passive background health checks",
        "cmd": "dcgmi discovery -l   |   dcgmi health -g 0 -s a   |   dcgmi health -g 0 -c",
        "flags": [
          [
            "discovery -l",
            "List the active GPUs and any NVSwitches tracked by nv-hostengine (-a shows all GPUs)"
          ],
          [
            "health -g 0 -s a",
            "Enable all health watches (a = p PCIe, m memory, i InfoROM, t thermal/power, n NVLink, d driver, x ConnectX)"
          ],
          [
            "health -g 0 -c",
            "Check current health status and print any degraded/faulty subsystem warnings"
          ]
        ],
        "tags": [
          "discovery",
          "health",
          "hostengine",
          "watches",
          "nvswitch"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/getting-started.html",
              "title": "DCGM getting started"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html",
              "title": "DCGM feature overview"
            }
          ],
          "note": "The docs name the default all-GPU group but not its ID: confirm group 0 with dcgmi group -l."
        }
      }
    ]
  },
  {
    "id": "dcgm-card-4",
    "badge": "dcgm",
    "title": "DCGM (dcgmi) Diagnostics: Hardware Profiling (Tensor Cores & FP Pipes)",
    "subtitle": "Monitor hardware performance counters: SM Occupancy, Tensor Core, FP16/FP32/FP64 & NVLink",
    "commands": [
      {
        "id": "dcgmi-dmon-profiling",
        "mode": "PROFILING",
        "modeClass": "mode-n",
        "desc": "Monitor hardware performance counters: SM Occupancy, Tensor Core, FP16/FP32/FP64 & NVLink",
        "cmd": "dcgmi dmon -e 203,1002,1003,1004,1006,1007,1008,1011,1012 -d 1000",
        "flags": [
          [
            "1002 / 1003",
            "SM Active (fraction of cycles ≥1 warp active) / SM Occupancy"
          ],
          [
            "1004",
            "Tensor Core (HMMA/IMMA/DMMA) pipe active ratio (0.0 to 1.0)"
          ],
          [
            "1006 / 1007 / 1008",
            "FP64 / FP32 / FP16 compute pipe active ratio"
          ],
          [
            "1011 / 1012",
            "NVLink TX / RX bandwidth in bytes/sec"
          ]
        ],
        "tip": "Exposes real Tensor Core usage",
        "tags": [
          "dmon",
          "tensor",
          "sm",
          "occupancy",
          "fp16",
          "fp64",
          "profiling",
          "counters"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/dcgm-api/dcgm-api-field-ids.html",
              "title": "DCGM field IDs"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html",
              "title": "DCGM feature overview"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "dcgm-pro-tips",
    "badge": "tip",
    "title": "DCGM (dcgmi) Diagnostics: Pro Tips & Best Practices",
    "subtitle": "Official NVIDIA hardware burn-in qualification (Level 1–4) & stress tests",
    "commands": [
      {
        "id": "dcgm-tips-card",
        "desc": "Official NVIDIA hardware burn-in qualification (Level 1–4) & stress tests",
        "cmd": "dcgmi diag -r 3   |   dcgmi diag -r pcie,targeted_stress,memtest   |   dcgmi health -c",
        "details": "DCGM Level 3 runs comprehensive 15-minute qualification burn-in including memory bandwidth, stress, and PCIe link integrity. Level 4 performs extended multi-hour burn-in.",
        "flags": [
          [
            "dcgmi diag -r 1",
            "Quick health check: basic blacklist, deployment, and permission verification"
          ],
          [
            "dcgmi diag -r 3",
            "Production qualification: runs targeted_stress, memtest, PCIe bandwidth, and context"
          ],
          [
            "dcgmi diag -r 4",
            "Extended burn-in qualification for newly racked HGX/DGX servers"
          ],
          [
            "dcgmi health -c",
            "Passive health check: monitors PCIe, memory, thermal, and power violations in background"
          ]
        ],
        "tip": "Ensure nvidia-dcgm.service is active before executing dcgmi CLI commands!",
        "tags": [
          "dcgm",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nv-dcgm_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM References
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

// NVIDIA Shell & Telemetry Syntax Highlighting
function highlightNvCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(#[^\n|]*)|(\s\|\s|\s&&\s|\s\|\|\s)|(\b(?:nvidia-smi|dcgmi|nvbandwidth|nvidia-bug-report\.sh|ibstat|ibstatus|ibv_devinfo|rdma|mlxlink|perfquery|ibdiagnet|mst|mlxfwmanager|mlxconfig|ib_write_bw|ib_write_lat|all_reduce_perf|lspci|setpci|dmesg|fuser|systemctl|modprobe|lsmod|watch|grep|cat|sudo)\b)|(\s-[a-zA-Z0-9-]+|\s--[a-zA-Z0-9_-]+=?)(\S*)/g,
    (match, comment, sep, cmd, flag, flagVal) => {
      if (comment) return '<span class="tok-comment">' + comment + '</span>';
      if (sep) return '<span class="tok-pipe">' + sep + '</span>';
      if (cmd) return '<span class="tok-cmd">' + cmd + '</span>';
      if (flag) return '<span class="tok-flag">' + flag + '</span>' + (flagVal || "");
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = NV_NV_DCGM_DATA;
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

  for (const card of NV_NV_DCGM_DATA) {
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
        '    <pre class="cmd-code"><code>' + highlightNvCmd(cmd.cmd) + '</code></pre>',
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
        localStorage.setItem("nv-dcgm_bookmarks", JSON.stringify([...state.bookmarks]));
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
