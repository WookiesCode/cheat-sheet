// nv-nvlink.js
// Standalone interactive cheat sheet for NVIDIA: NVLink, NVSwitch & Fabric Manager
const NV_NV_NVLINK_DATA = [
  {
    "id": "nvlink-fabric-card-1",
    "badge": "nvl",
    "title": "NVLink: NVLink Per-Lane State & Error Counters",
    "subtitle": "Verify all NVLink lanes are active at full rate and inspect CRC/Replay/Recovery error counters",
    "commands": [
      {
        "id": "nvlink-status-errors",
        "mode": "NVLINK",
        "modeClass": "mode-v",
        "desc": "Verify all NVLink lanes are active at full rate and inspect CRC/Replay/Recovery error counters",
        "cmd": "nvidia-smi nvlink -s   |   nvidia-smi nvlink -e   |   nvidia-smi nvlink -R",
        "flags": [
          [
            "nvlink -s",
            "List active state and GB/s rate of all NVLink lanes per GPU (12 on A100, 18 on H100/B200)"
          ],
          [
            "nvlink -e",
            "Display CRC Flit, CRC Data, Replay, and Recovery error counters per link"
          ],
          [
            "nvlink -R",
            "Reset all NVLink error counters to zero"
          ]
        ],
        "tip": "Any inactive lane breaks NCCL ring",
        "tags": [
          "nvlink",
          "crc",
          "replay",
          "errors",
          "lanes",
          "status"
        ]
      }
    ]
  },
  {
    "id": "nvlink-fabric-card-2",
    "badge": "nvl",
    "title": "NVLink: HGX SXM NVSwitch Fabric Manager Daemon",
    "subtitle": "Manage `nvidia-fabricmanager` daemon required on 8-GPU HGX SXM / NVSwitch baseboards",
    "commands": [
      {
        "id": "fabric-manager-sxm",
        "mode": "NVSWITCH",
        "modeClass": "mode-v",
        "desc": "Manage `nvidia-fabricmanager` daemon required on 8-GPU HGX SXM / NVSwitch baseboards",
        "cmd": "systemctl status nvidia-fabricmanager   |   grep -E 'ERROR|SXid' /var/log/fabricmanager.log",
        "flags": [
          [
            "nvidia-fabricmanager",
            "Initializes NVSwitch routing tables; CUDA returns Error 802 (system not yet initialized) if stopped!"
          ],
          [
            "SXid",
            "NVSwitch hardware error code logged in /var/log/fabricmanager.log and dmesg"
          ],
          [
            "Version Lock",
            "Fabric Manager version MUST match exact installed NVIDIA kernel driver version"
          ]
        ],
        "tip": "CUDA Error 802 = check Fabric Manager",
        "tags": [
          "fabricmanager",
          "nvswitch",
          "hgx",
          "sxm",
          "sxid",
          "802"
        ]
      }
    ]
  },
  {
    "id": "nvlink-fabric-card-3",
    "badge": "nvl",
    "title": "NVLink: NVLink Peer-to-Peer & PCIe Bandwidth Tests",
    "subtitle": "Measure unidirectional and bidirectional GPU-to-GPU NVLink & Host-to-Device PCIe bandwidth",
    "commands": [
      {
        "id": "nvbandwidth-p2p",
        "mode": "BENCHMARK",
        "modeClass": "mode-v",
        "desc": "Measure unidirectional and bidirectional GPU-to-GPU NVLink & Host-to-Device PCIe bandwidth",
        "cmd": "nvbandwidth -t device_to_device_memcpy_read_ce,device_to_device_bidirectional_memcpy_read_ce,host_to_device_memcpy_ce",
        "flags": [
          [
            "device_to_device_..._ce",
            "Copy-Engine P2P bandwidth matrix across all GPU pairs (expect ~400+ GB/s unidir on H100)"
          ],
          [
            "host_to_device_memcpy_ce",
            "Verify each GPU achieves full PCIe Gen4 (~26 GB/s) or Gen5 (~54 GB/s) DMA speed"
          ]
        ],
        "tags": [
          "nvbandwidth",
          "p2p",
          "bandwidth",
          "memcpy",
          "benchmark",
          "nvlink"
        ]
      }
    ]
  },
  {
    "id": "nvlink-fabric-pro-tips",
    "badge": "tip",
    "title": "NVLink: Pro Tips & Best Practices",
    "subtitle": "SXM NVSwitch Fabric Manager required daemon, CRC error counters & bandwidth testing",
    "commands": [
      {
        "id": "nvlink-fabric-tips-card",
        "desc": "SXM NVSwitch Fabric Manager required daemon, CRC error counters & bandwidth testing",
        "cmd": "systemctl status nvidia-fabricmanager   |   nvidia-smi nvlink -e -i 0   |   nvbandwidth",
        "details": "HGX SXM systems (A100, H100, H200, B200) require nvidia-fabricmanager matching the exact driver version to configure the NVSwitch crossbar fabric. Rising CRC errors indicate dirty optics or connector degradation.",
        "flags": [
          [
            "nvidia-fabricmanager",
            "Must run on all NVSwitch baseboards; failure halts all multi-GPU jobs"
          ],
          [
            "nvidia-smi nvlink -e -i <ID>",
            "Inspects per-lane CRC, Replay, and Recovery error counters"
          ],
          [
            "nvbandwidth",
            "NVIDIA open-source P2P bandwidth test for measuring full NVLink crossbar saturation"
          ],
          [
            "nvidia-smi nvlink -s -i <ID>",
            "Confirms all NVLink physical links are in ACTIVE 100% line rate state"
          ]
        ],
        "tip": "Never upgrade the NVIDIA display driver on HGX SXM nodes without upgrading nvidia-fabricmanager simultaneously!",
        "tags": [
          "nvlink-fabric",
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("nv-nvlink_bookmarks") || "[]"))
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
  const allCards = NV_NV_NVLINK_DATA;
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

  for (const card of NV_NV_NVLINK_DATA) {
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
        localStorage.setItem("nv-nvlink_bookmarks", JSON.stringify([...state.bookmarks]));
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
