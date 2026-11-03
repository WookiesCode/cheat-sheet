// nv-smi.js
// Standalone interactive cheat sheet for NVIDIA: nvidia-smi Telemetry, Queries & Topology
const NV_NV_SMI_DATA = [
  {
    "id": "nvidia-smi-card-1",
    "badge": "smi",
    "title": "nvidia-smi Telemetry: GPU Topology & NUMA Affinity Matrix",
    "subtitle": "Display full GPU-to-GPU, NVLink, PCIe switch, NIC (mlx5), and NUMA CPU affinity matrix",
    "commands": [
      {
        "id": "smi-topo-matrix",
        "mode": "TOPOLOGY",
        "modeClass": "mode-n",
        "desc": "Display full GPU-to-GPU, NVLink, PCIe switch, NIC (mlx5), and NUMA CPU affinity matrix",
        "cmd": "nvidia-smi topo -m   |   nvidia-smi topo -p2p r",
        "flags": [
          [
            "topo -m",
            "Print topology matrix (NV18 = 18 NVLinks, PIX = same PCIe switch, PHB = same host bridge, SYS = cross-NUMA/QPI)"
          ],
          [
            "topo -p2p r/w/a",
            "Check Peer-to-Peer Read / Write / Atomic support matrix across all GPUs"
          ]
        ],
        "tip": "Verify NIC-to-GPU PIX alignment",
        "tags": [
          "topology",
          "numa",
          "nvlink",
          "pcie",
          "pix",
          "pxb",
          "mlx5",
          "p2p"
        ]
      }
    ]
  },
  {
    "id": "nvidia-smi-card-2",
    "badge": "smi",
    "title": "nvidia-smi Telemetry: Real-Time 1s Device Telemetry (dmon)",
    "subtitle": "Scroll live 1-second device telemetry (Power, Temp, SM/Mem Util, Clocks, ECC, PCIe/NVLink)",
    "commands": [
      {
        "id": "smi-dmon-live",
        "mode": "TELEMETRY",
        "modeClass": "mode-n",
        "desc": "Scroll live 1-second device telemetry (Power, Temp, SM/Mem Util, Clocks, ECC, PCIe/NVLink)",
        "cmd": "nvidia-smi dmon -s pucvmet -d 1   |   nvidia-smi pmon -s um -d 1",
        "flags": [
          [
            "-s pucvmet",
            "p=Power/Temp, u=Util, c=Clocks, v=Violations, m=FB/Bar1, e=ECC, t=PCIe throughput"
          ],
          [
            "pmon -s um",
            "Per-process GPU utilization (u) and framebuffer memory usage (m) every 1s"
          ]
        ],
        "tip": "Lightweight top for GPUs",
        "tags": [
          "dmon",
          "pmon",
          "live",
          "monitor",
          "watch",
          "utilization",
          "power",
          "temp"
        ]
      }
    ]
  },
  {
    "id": "nvidia-smi-card-3",
    "badge": "smi",
    "title": "nvidia-smi Telemetry: Fleet Inventory, VBIOS & PCIe Width",
    "subtitle": "Audit GPU serial numbers, UUIDs, VBIOS versions, and active vs max PCIe Gen/Width",
    "commands": [
      {
        "id": "smi-query-inventory-pcie",
        "mode": "INVENTORY",
        "modeClass": "mode-n",
        "desc": "Audit GPU serial numbers, UUIDs, VBIOS versions, and active vs max PCIe Gen/Width",
        "cmd": "nvidia-smi --query-gpu=index,name,serial,uuid,vbios_version,pci.bus_id,pcie.link.gen.current,pcie.link.gen.max,pcie.link.width.current,pcie.link.width.max --format=csv",
        "flags": [
          [
            "pcie.link.width.current",
            "Spot degraded risers/slots (e.g. x8 or x4 instead of x16)"
          ],
          [
            "pcie.link.gen.current",
            "Note: idle GPUs downshift to Gen1; run load or check gen.max"
          ],
          [
            "--format=csv,noheader,nounits",
            "Strip headers and units for clean awk/script parsing"
          ]
        ],
        "tip": "Catches degraded x8/x4 PCIe lanes",
        "tags": [
          "serial",
          "uuid",
          "vbios",
          "pcie",
          "lanes",
          "width",
          "gen5",
          "inventory",
          "csv"
        ]
      }
    ]
  },
  {
    "id": "nvidia-smi-card-4",
    "badge": "smi",
    "title": "nvidia-smi Telemetry: Clock Throttling & Power Capping Flags",
    "subtitle": "Inspect exact hardware/thermal/power clock throttling flags per GPU",
    "commands": [
      {
        "id": "smi-throttle-reasons",
        "mode": "PERFORMANCE",
        "modeClass": "mode-n",
        "desc": "Inspect exact hardware/thermal/power clock throttling flags per GPU",
        "cmd": "nvidia-smi -q -d PERFORMANCE,CLOCK,POWER,TEMPERATURE",
        "flags": [
          [
            "HW Slowdown",
            "Active if GPU temp > max threshold or external power brake asserted"
          ],
          [
            "HW Thermal Slowdown",
            "GPU or HBM memory temperature exceeded thermal slowdown threshold"
          ],
          [
            "HW Power Brake Slowdown",
            "PSU/chassis asserted external power brake signal to GPU"
          ],
          [
            "Sw Power Cap",
            "Clocks capped because GPU hit configured power limit (normal under full load)"
          ]
        ],
        "tags": [
          "throttle",
          "slowdown",
          "thermal",
          "power-brake",
          "clocks",
          "performance"
        ]
      }
    ]
  },
  {
    "id": "nvidia-smi-card-5",
    "badge": "smi",
    "title": "nvidia-smi Telemetry: Active Compute PIDs & VRAM Allocation",
    "subtitle": "List all active compute PIDs, process names, GPU UUIDs, and VRAM consumption",
    "commands": [
      {
        "id": "smi-compute-processes",
        "mode": "PROCESSES",
        "modeClass": "mode-n",
        "desc": "List all active compute PIDs, process names, GPU UUIDs, and VRAM consumption",
        "cmd": "nvidia-smi --query-compute-apps=gpu_bus_id,gpu_uuid,pid,process_name,used_memory --format=csv",
        "flags": [
          [
            "--query-compute-apps",
            "Outputs only active CUDA/Compute contexts across all GPUs"
          ],
          [
            "fuser -v /dev/nvidia*",
            "Show every host process holding open any /dev/nvidia character device"
          ]
        ],
        "tags": [
          "processes",
          "pid",
          "vram",
          "memory",
          "fuser",
          "zombie"
        ]
      }
    ]
  },
  {
    "id": "nvidia-smi-pro-tips",
    "badge": "tip",
    "title": "nvidia-smi Telemetry: Pro Tips & Best Practices",
    "subtitle": "Automated CSV telemetry logger, NUMA matrix & throttling reason flags",
    "commands": [
      {
        "id": "nvidia-smi-tips-card",
        "desc": "Automated CSV telemetry logger, NUMA matrix & throttling reason flags",
        "cmd": "nvidia-smi --query-gpu=timestamp,name,pci.bus_id,utilization.gpu,memory.used,temperature.gpu,power.draw --format=csv -l 1   |   nvidia-smi topo -m",
        "details": "Log 1-second continuous telemetry directly to CSV for post-crash analysis. Use nvidia-smi topo -m to audit GPU-to-GPU interconnects (NVLink vs PCIe vs NUMA traversal).",
        "flags": [
          [
            "--format=csv -l 1",
            "Streams continuous CSV telemetry metrics every 1 second to stdout"
          ],
          [
            "topo -m",
            "Matrix showing NV# (NVLink), PIX (PCIe switch), NODE (same NUMA), SYS (remote socket)"
          ],
          [
            "--query-gpu=clocks_throttle_reasons.active",
            "Detects SW_POWER_CAP, HW_SLOWDOWN, or THERMAL clock throttling"
          ],
          [
            "nvidia-smi dmon -s pucvmet -d 1",
            "Scrolls live per-device power, utilization, clock, VRAM, and ECC metrics"
          ]
        ],
        "tip": "NVLink connections (NV#) provide up to 900 GB/s bidirectional P2P throughput per GPU!",
        "tags": [
          "nvidia-smi",
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("nv-smi_bookmarks") || "[]"))
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
  const allCards = NV_NV_SMI_DATA;
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

  for (const card of NV_NV_SMI_DATA) {
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
        '      <span class="copy-feedback">Copy</span>',
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
        localStorage.setItem("nv-smi_bookmarks", JSON.stringify([...state.bookmarks]));
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
