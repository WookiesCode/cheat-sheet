// nv-admin.js
// Standalone interactive cheat sheet for NVIDIA: GPU Admin, Reset, ECC, Row Remap & Clocks
const NV_NV_ADMIN_DATA = [
  {
    "id": "gpu-admin-ecc-card-1",
    "badge": "adm",
    "title": "GPU Admin: HBM Row Remapper & RMA Health Check",
    "subtitle": "Inspect HBM Row Remapper state, pending remaps, failure flags & bank availability histogram",
    "commands": [
      {
        "id": "row-remapper-rma-check",
        "mode": "ECC / HBM",
        "modeClass": "mode-t",
        "desc": "Inspect HBM Row Remapper state, pending remaps, failure flags & bank availability histogram",
        "cmd": "nvidia-smi -q -d ROW_REMAPPER,PAGE_RETIREMENT,ECC",
        "flags": [
          [
            "Pending : Yes",
            "A row remap is queued; requires a GPU reset (or node reboot) to take effect!"
          ],
          [
            "Remapping Failure Occurred : Yes",
            "Hardware HBM bank exhausted spare rows (Xid 64) — qualifies GPU for RMA!"
          ],
          [
            "Bank Remap Availability",
            "Shows Max / High / Partial / Low / None spare rows remaining across HBM banks"
          ]
        ],
        "tip": "Primary A100/H100 HBM RMA check",
        "tags": [
          "remap",
          "row-remapper",
          "ecc",
          "dbe",
          "sbe",
          "hbm",
          "rma",
          "page-retirement"
        ]
      }
    ]
  },
  {
    "id": "gpu-admin-ecc-card-2",
    "badge": "adm",
    "title": "GPU Admin: Process Drain & Secondary-Bus GPU Reset",
    "subtitle": "Drain processes holding GPU device files and perform a secondary-bus GPU reset",
    "commands": [
      {
        "id": "gpu-reset-drain",
        "mode": "ADMIN",
        "modeClass": "mode-c",
        "desc": "Drain processes holding GPU device files and perform a secondary-bus GPU reset",
        "cmd": "fuser -kv /dev/nvidia0   &&   nvidia-smi --gpu-reset -i 0",
        "flags": [
          [
            "fuser -kv /dev/nvidia*",
            "Kill processes holding open GPU device nodes"
          ],
          [
            "--gpu-reset -i 0",
            "Reset specific GPU (clears Xid 95/48, applies pending row remaps or MIG changes)"
          ],
          [
            " Note on SXM/NVSwitch",
            "On HGX SXM systems with active Fabric Manager, stop fabricmanager or reset all GPUs together"
          ]
        ],
        "danger": "Kills active CUDA contexts on target GPU",
        "tags": [
          "reset",
          "gpu-reset",
          "drain",
          "fuser",
          "hang",
          "xid"
        ]
      }
    ]
  },
  {
    "id": "gpu-admin-ecc-card-3",
    "badge": "adm",
    "title": "GPU Admin: NVIDIA Persistence Daemon Configuration",
    "subtitle": "Enable NVIDIA Persistence Daemon so driver state stays loaded when no job is running",
    "commands": [
      {
        "id": "persistence-mode-daemon",
        "mode": "ADMIN",
        "modeClass": "mode-c",
        "desc": "Enable NVIDIA Persistence Daemon so driver state stays loaded when no job is running",
        "cmd": "systemctl enable --now nvidia-persistenced   |   nvidia-smi -pm 1",
        "flags": [
          [
            "nvidia-persistenced",
            "Preferred systemd daemon keeping NVML state initialized across idle periods"
          ],
          [
            "-pm 1",
            "Legacy persistence mode flag (prevents 3–5s driver init latency & preserves power/clock settings)"
          ]
        ],
        "tip": "Mandatory on datacenter nodes",
        "tags": [
          "persistence",
          "persistenced",
          "daemon",
          "init",
          "latency"
        ]
      }
    ]
  },
  {
    "id": "gpu-admin-ecc-card-4",
    "badge": "adm",
    "title": "GPU Admin: TDP Power Capping & Clock Locking",
    "subtitle": "Cap GPU TDP wattage (for rack power budgeting) or lock SM/Memory clocks for benchmarks",
    "commands": [
      {
        "id": "power-limit-clock-lock",
        "mode": "TUNING",
        "modeClass": "mode-c",
        "desc": "Cap GPU TDP wattage (for rack power budgeting) or lock SM/Memory clocks for benchmarks",
        "cmd": "nvidia-smi -pl 650   |   nvidia-smi -lgc 1980,1980   |   nvidia-smi -rgc",
        "flags": [
          [
            "-pl <watts>",
            "Set power management limit in Watts (check min/max in nvidia-smi -q -d POWER)"
          ],
          [
            "-lgc <min,max>",
            "Lock GPU SM clocks to exact MHz range for deterministic NCCL/inference latency"
          ],
          [
            "-rgc / -rmc",
            "Reset locked GPU / Memory clocks back to dynamic boost defaults"
          ]
        ],
        "tags": [
          "power",
          "limit",
          "tdp",
          "clocks",
          "lock",
          "lgc",
          "benchmark"
        ]
      }
    ]
  },
  {
    "id": "gpu-admin-ecc-card-5",
    "badge": "adm",
    "title": "GPU Admin: ECC Aggregate Counter Reset & Mode Toggle",
    "subtitle": "Clear volatile/aggregate ECC counters or enable ECC mode on workstation/L40S GPUs",
    "commands": [
      {
        "id": "ecc-toggle-clear",
        "mode": "ECC / HBM",
        "modeClass": "mode-t",
        "desc": "Clear volatile/aggregate ECC counters or enable ECC mode on workstation/L40S GPUs",
        "cmd": "nvidia-smi --clear-ecc-error-counts=0   |   nvidia-smi --clear-ecc-error-counts=1   |   nvidia-smi -e 1",
        "flags": [
          [
            "--clear-ecc-error-counts=0",
            "Reset volatile ECC error counters (since last driver load)"
          ],
          [
            "--clear-ecc-error-counts=1",
            "Reset aggregate (lifetime non-volatile) ECC counters"
          ],
          [
            "-e 1",
            "Enable ECC (always enabled and locked ON for A100/H100/H200)"
          ]
        ],
        "tags": [
          "ecc",
          "clear",
          "counters",
          "volatile",
          "aggregate"
        ]
      }
    ]
  },
  {
    "id": "gpu-admin-ecc-pro-tips",
    "badge": "tip",
    "title": "GPU Admin: Pro Tips & Best Practices",
    "subtitle": "HBM Row Remapper RMA inspection, persistent daemon & secondary bus reset",
    "commands": [
      {
        "id": "gpu-admin-ecc-tips-card",
        "desc": "HBM Row Remapper RMA inspection, persistent daemon & secondary bus reset",
        "cmd": "nvidia-smi --query-remmapped-rows=gpu_name,gpu_bus_id,remapped_rows.correctable,remapped_rows.uncorrectable,remapped_rows.pending,remapped_rows.failure --format=csv",
        "details": "HBM memory uses hardware Row Remapping to replace failing memory banks with spares. If remapped_rows.failure is true or pending remaps persist, the GPU has exhausted spares and qualifies for vendor RMA.",
        "flags": [
          [
            "remapped_rows.failure",
            "Returns true if hardware row remapper fails to allocate a spare bank (RMA trigger)"
          ],
          [
            "nvidia-smi --gpu-reset -i <ID>",
            "Performs secondary-bus PCIe GPU reset without requiring host server reboot"
          ],
          [
            "nvidia-persistenced --user root",
            "Maintains driver initialization state when no compute job is running"
          ],
          [
            "nvidia-smi -i <ID> -pl <WATTS>",
            "Caps GPU maximum TDP power limit for rack thermal budgeting"
          ]
        ],
        "tip": "Always drain holding processes with fuser -v /dev/nvidia* before running --gpu-reset!",
        "tags": [
          "gpu-admin-ecc",
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
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("nv-admin_bookmarks") || "[]"))
};

// DOM References
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
  const allCards = NV_NV_ADMIN_DATA;
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

  for (const card of NV_NV_ADMIN_DATA) {
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
        localStorage.setItem("nv-admin_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.CheatSheetCommon && typeof window.CheatSheetCommon.applyTheme === "function") {
    window.CheatSheetCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch (e) {}
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
