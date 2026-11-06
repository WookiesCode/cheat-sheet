// nv-ops.js
// Standalone interactive cheat sheet for NVIDIA: Slurm Drain, NVSM, Liquid Cooling & Container Triage
const NV_NV_OPS_DATA = [
  {
    "id": "slurm-nvsm-burnin-card-1",
    "badge": "ops",
    "title": "Slurm Drain: Slurm GPU Node Drain & Cluster Rejoin",
    "subtitle": "Check active Slurm GPU jobs on a node, drain it with a ticket reason before hardware work, and resume after burn-in",
    "commands": [
      {
        "id": "slurm-drain-resume",
        "mode": "SLURM OPS",
        "modeClass": "mode-c",
        "desc": "Check active Slurm GPU jobs on a node, drain it with a ticket reason before hardware work, and resume after burn-in",
        "cmd": "squeue -w $(hostname -s)   &&   scontrol update NodeName=$(hostname -s) State=DRAIN Reason=\"DC Tech: GPU 3 Xid 79 RMA\"",
        "flags": [
          [
            "State=DRAIN",
            "Marks node offline for new jobs while allowing currently running jobs to finish (use State=DOWN to kill immediately)"
          ],
          [
            "State=RESUME",
            "Returns a drained node back to IDLE/ALLOCATED production state after DCGM Level 3 passes"
          ],
          [
            "sinfo -Nl -n $(hostname -s)",
            "Show current node state (idle, alloc, drain, down*) and drain reason string"
          ]
        ],
        "tip": "Always check 'squeue -w $(hostname -s)' before rebooting a GPU node!",
        "tags": [
          "slurm",
          "scontrol",
          "squeue",
          "sinfo",
          "drain",
          "resume",
          "maintenance"
        ]
      }
    ]
  },
  {
    "id": "slurm-nvsm-burnin-card-2",
    "badge": "ops",
    "title": "Slurm Drain: NVSM Chassis & Subsystem Health Diagnostic",
    "subtitle": "Run NVIDIA System Management (`nvsm`) health check and generate a full chassis/GPU diagnostic bundle",
    "commands": [
      {
        "id": "nvsm-health-dump",
        "mode": "DGX / HGX NVSM",
        "modeClass": "mode-i",
        "desc": "Run NVIDIA System Management (`nvsm`) health check and generate a full chassis/GPU diagnostic bundle",
        "cmd": "nvsm show health   &&   nvsm show alerts   &&   nvsm dump health",
        "flags": [
          [
            "nvsm show health",
            "Audits GPUs, NVSwitches, NVLinks, PCIe risers, ConnectX HCAs, drives, PSUs, and fans on DGX/HGX systems"
          ],
          [
            "nvsm dump health",
            "Generates /tmp/nvsm-health-*.tar.xz bundle for NVIDIA Enterprise Support RMA"
          ],
          [
            "nv-fabricmanager -v",
            "Check installed NVIDIA Fabric Manager version (must match exact NVIDIA driver version!)"
          ]
        ],
        "tip": "Fabric Manager version mismatch stops multi-GPU jobs from starting!",
        "tags": [
          "nvsm",
          "dgx",
          "hgx",
          "health",
          "alerts",
          "fabricmanager"
        ]
      }
    ]
  },
  {
    "id": "slurm-nvsm-burnin-card-3",
    "badge": "ops",
    "title": "Slurm Drain: GPU Die vs HBM3/DLC Thermal Delta Triage",
    "subtitle": "Compare GPU die temp vs HBM3/HBM3e memory temp to spot cold-plate contact or TIM degradation on air/liquid nodes",
    "commands": [
      {
        "id": "hbm-dlc-thermal-delta",
        "mode": "DLC / THERMALS",
        "modeClass": "mode-t",
        "desc": "Compare GPU die temp vs HBM3/HBM3e memory temp to spot cold-plate contact or TIM degradation on air/liquid nodes",
        "cmd": "nvidia-smi --query-gpu=index,pci.bus_id,temperature.gpu,temperature.memory,temperature.gpu.tlimit,power.draw,clocks_event_reasons.hw_thermal_slowdown --format=csv",
        "flags": [
          [
            "temperature.memory",
            "HBM3/HBM3e stack temperature (throttles at ~95°C; if >20°C hotter than temperature.gpu, check cold-plate / TIM seating)"
          ],
          [
            "temperature.gpu.tlimit",
            "Remaining thermal margin (°C) before GPU hits hardware thermal slowdown"
          ],
          [
            "hw_thermal_slowdown",
            "True = GPU or HBM is actively downclocking due to failed fan, air baffle gap, or blocked DLC manifold"
          ]
        ],
        "tip": "High HBM temp with normal GPU temp = bad thermal pad / coldplate torque!",
        "tags": [
          "hbm",
          "dlc",
          "liquid-cooling",
          "thermal",
          "temperature",
          "coldplate",
          "tim"
        ]
      }
    ]
  },
  {
    "id": "slurm-nvsm-burnin-card-4",
    "badge": "ops",
    "title": "Slurm Drain: Container Toolkit /dev/nvidia* Pass-Through",
    "subtitle": "Verify `/dev/nvidia*` device nodes, UVM/MIG capabilities, and test Docker/Kubernetes GPU & RDMA pass-through",
    "commands": [
      {
        "id": "nvidia-container-devices",
        "mode": "CONTAINERS",
        "modeClass": "mode-v",
        "desc": "Verify `/dev/nvidia*` device nodes, UVM/MIG capabilities, and test Docker/Kubernetes GPU & RDMA pass-through",
        "cmd": "ls -la /dev/nvidia* /dev/infiniband/   &&   nvidia-ctk system create-dev-char-symlinks --create-all",
        "flags": [
          [
            "/dev/nvidia-uvm",
            "Unified Virtual Memory device node (if missing, run 'nvidia-modprobe -u -c=0')"
          ],
          [
            "/dev/nvidia-caps/*",
            "Required device nodes for MIG instances and nvlink/imex fabric channels"
          ],
          [
            "docker run --rm --gpus all ubuntu nvidia-smi",
            "Quick smoke test verifying container runtime can access all 8 GPUs"
          ]
        ],
        "tip": "Run 'nvidia-modprobe -u -c=0' if containers fail to open /dev/nvidia-uvm",
        "tags": [
          "container",
          "docker",
          "k8s",
          "nvidia-uvm",
          "nvidia-ctk",
          "nvidia-modprobe"
        ]
      }
    ]
  },
  {
    "id": "slurm-nvsm-burnin-pro-tips",
    "badge": "tip",
    "title": "Slurm Drain: Pro Tips & Best Practices",
    "subtitle": "Slurm GPU node drain, NVSM chassis diagnostics & HBM3 liquid cooling thermal triage",
    "commands": [
      {
        "id": "slurm-nvsm-burnin-tips-card",
        "desc": "Slurm GPU node drain, NVSM chassis diagnostics & HBM3 liquid cooling thermal triage",
        "cmd": "scontrol update nodename=node01 state=DRAIN reason=\"Xid triage\"   |   nvsm show health   |   nvidia-smi -q -d TEMPERATURE",
        "details": "Safely drain Slurm compute nodes before performing physical or driver maintenance. On direct-liquid-cooled (DLC) nodes, monitor delta between GPU die and HBM3 memory temperatures.",
        "flags": [
          [
            "scontrol update state=DRAIN",
            "Prevents new Slurm scheduler jobs from landing on server during triage"
          ],
          [
            "scontrol update state=RESUME",
            "Returns validated and qualified node to active Slurm partition"
          ],
          [
            "nvsm show health",
            "NVIDIA System Management: queries chassis fans, power supplies, BMC, and GPUs"
          ],
          [
            "GPU vs HBM Delta > 15°C",
            "Indicates cold-plate mounting contact degradation, TIM dry-out, or coolant bubble"
          ]
        ],
        "tip": "Inspect container device mounts in /dev/nvidia* and /dev/nvidia-uvm for Docker/Kubernetes workloads!",
        "tags": [
          "slurm-nvsm-burnin",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nv-ops_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = NV_NV_OPS_DATA;
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

  for (const card of NV_NV_OPS_DATA) {
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
        localStorage.setItem("nv-ops_bookmarks", JSON.stringify([...state.bookmarks]));
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
