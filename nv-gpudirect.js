// nv-gpudirect.js
// Standalone interactive cheat sheet for NVIDIA: GPUDirect RDMA, Perftest & NCCL Validation
const NV_NV_GPUDIRECT_DATA = [
  {
    "id": "gpudirect-rdma-nccl-card-1",
    "badge": "rdma",
    "title": "GPUDirect RDMA: GPUDirect RDMA nvidia-peermem Module Audit",
    "subtitle": "Verify `nvidia-peermem` kernel module is loaded for zero-copy GPUDirect RDMA over InfiniBand/RoCE",
    "commands": [
      {
        "id": "nvidia-peermem-verify",
        "mode": "GPUDIRECT",
        "modeClass": "mode-v",
        "desc": "Verify `nvidia-peermem` kernel module is loaded for zero-copy GPUDirect RDMA over InfiniBand/RoCE",
        "cmd": "lsmod | grep nvidia_peermem   ||   modprobe nvidia-peermem",
        "flags": [
          [
            "nvidia_peermem",
            "Allows InfiniBand HCA (mlx5) to DMA directly to/from GPU HBM BAR1 over PCIe without CPU bounce buffers"
          ],
          [
            "DMA-BUF",
            "With DMA-BUF (open kernel modules) NCCL does not need nvidia-peermem; otherwise it must be loaded on every boot"
          ]
        ],
        "tip": "Required for full multi-node NCCL speed",
        "tags": [
          "gpudirect",
          "rdma",
          "peermem",
          "nvidia-peermem",
          "bar1",
          "dma"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/gpu_troubleshooting.html",
              "title": "NCCL troubleshooting"
            },
            {
              "url": "https://docs.nvidia.com/cuda/gpudirect-rdma/index.html",
              "title": "GPUDirect RDMA"
            }
          ],
          "note": "NVIDIA's pages write the module as nvidia-peermem; lsmod prints module names with underscores, so grep nvidia_peermem."
        }
      }
    ]
  },
  {
    "id": "gpudirect-rdma-nccl-card-2",
    "badge": "rdma",
    "title": "GPUDirect RDMA: GPUDirect RDMA Line-Rate Bandwidth (--use_cuda)",
    "subtitle": "Test line-rate GPUDirect RDMA bandwidth directly from GPU memory (`--use_cuda`) between two nodes",
    "commands": [
      {
        "id": "ib-write-bw-cuda",
        "mode": "RDMA TEST",
        "modeClass": "mode-v",
        "desc": "Test line-rate GPUDirect RDMA bandwidth directly from GPU memory (`--use_cuda`) between two nodes",
        "cmd": "# Server: ib_write_bw -d mlx5_0 --use_cuda=0 -a -F --report_gbits --ipv6-addr   |   # Client: ib_write_bw -d mlx5_0 --use_cuda=0 -a -F --report_gbits --ipv6-addr 2001:db8:dc::1",
        "flags": [
          [
            "-d mlx5_0 --use_cuda=0",
            "Bind HCA mlx5_0 to local GPU 0 (match closest PIX pair from 'nvidia-smi topo -m'!)"
          ],
          [
            "--report_gbits -F",
            "Report throughput in Gb/s (expect ~385–392 Gb/s on NDR400, ~192 Gb/s on HDR200) and ignore CPU freq warning"
          ],
          [
            "ib_write_lat",
            "Run latency counterpart (expect ~1.2–1.8 µs RDMA write latency)"
          ]
        ],
        "tip": "Pair mlx5_X with its PIX-local GPU",
        "tags": [
          "ib_write_bw",
          "perftest",
          "cuda",
          "gpudirect",
          "bandwidth",
          "latency"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/linux-rdma/perftest",
              "title": "perftest"
            }
          ],
          "note": "Corrected 2026-11-09: --ipv6-addr (not --ipv6) for an IPv6 server address, on both ends. Gb/s and latency figures are rules of thumb."
        }
      }
    ]
  },
  {
    "id": "gpudirect-rdma-nccl-card-3",
    "badge": "rdma",
    "title": "GPUDirect RDMA: NCCL all_reduce_perf Multi-GPU/Multi-Node Test",
    "subtitle": "Run single-node or multi-node `all_reduce_perf` with NCCL topology/IB debugging enabled",
    "commands": [
      {
        "id": "nccl-tests-allreduce",
        "mode": "NCCL",
        "modeClass": "mode-v",
        "desc": "Run single-node or multi-node `all_reduce_perf` with NCCL topology/IB debugging enabled",
        "cmd": "NCCL_DEBUG=INFO NCCL_IB_HCA=mlx5 ./build/all_reduce_perf -b 8M -e 8G -f 2 -g 8",
        "flags": [
          [
            "-b 8M -e 8G -f 2 -g 8",
            "Sweep message sizes from 8 MB to 8 GB by 2x factor across 8 GPUs"
          ],
          [
            "algbw / busbw",
            "Check 'busbw' column: healthy 8x H100 SXM hits ~360–390 GB/s intra-node busbw"
          ],
          [
            "NCCL_DEBUG=INFO",
            "Prints detected rings/trees, NVLS/SHARP status, and selected IB HCAs"
          ],
          [
            "NCCL_P2P_LEVEL=NVL",
            "Force or debug P2P transport selection"
          ]
        ],
        "tip": "Watch busbw (not algbw) for health",
        "tags": [
          "nccl",
          "all_reduce_perf",
          "busbw",
          "nvls",
          "sharp",
          "benchmark"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/nccl-tests",
              "title": "nccl-tests"
            },
            {
              "url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html",
              "title": "NCCL environment variables"
            }
          ],
          "note": "NCCL_IB_HCA=mlx5 is a prefix match (mlx5_*); use =mlx5_0 for an exact device. busbw figures are rules of thumb."
        }
      }
    ]
  },
  {
    "id": "gpudirect-rdma-nccl-pro-tips",
    "badge": "tip",
    "title": "GPUDirect RDMA: Pro Tips & Best Practices",
    "subtitle": "Zero-copy GPUDirect RDMA kernel module, CUDA DMA bandwidth & NCCL benchmarks",
    "commands": [
      {
        "id": "gpudirect-rdma-nccl-tips-card",
        "desc": "Zero-copy GPUDirect RDMA kernel module, CUDA DMA bandwidth & NCCL benchmarks",
        "cmd": "lsmod | grep nvidia_peermem   |   ib_write_bw -d mlx5_0 -F --use_cuda=0   |   all_reduce_perf",
        "details": "GPUDirect RDMA enables ConnectX InfiniBand/RoCE adapters to read/write directly to GPU VRAM bypassing CPU host memory. Requires nvidia-peermem module loaded in kernel.",
        "flags": [
          [
            "nvidia-peermem",
            "Kernel bridge driver enabling direct P2P DMA between NIC and GPU HBM"
          ],
          [
            "ib_write_bw --use_cuda=0",
            "Tests raw line-rate InfiniBand RDMA write bandwidth directly from GPU VRAM"
          ],
          [
            "NCCL_DEBUG=INFO",
            "Prints detailed NCCL tree/ring topology, IB verbs, and GPUDirect initialization"
          ],
          [
            "all_reduce_perf -b 8M -e 1G -f 2 -g 8",
            "Runs nccl-tests across all 8 GPUs measuring AllReduce bus bandwidth"
          ]
        ],
        "tip": "Compare all_reduce_perf busbw against your platform vendor's acceptance numbers; a single slow rank drags the whole result down",
        "tags": [
          "gpudirect-rdma-nccl",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/cuda/gpudirect-rdma/index.html",
              "title": "NVIDIA GPUDirect RDMA"
            },
            {
              "url": "https://github.com/linux-rdma/perftest",
              "title": "linux-rdma perftest"
            },
            {
              "url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html",
              "title": "NCCL environment variables"
            },
            {
              "url": "https://github.com/NVIDIA/nccl-tests",
              "title": "NVIDIA nccl-tests"
            }
          ],
          "note": "Removed 2026-11-10: an unsourced \"~450 GB/s on 8x H100\" target."
        }
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nv-gpudirect_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = NV_NV_GPUDIRECT_DATA;
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

  for (const card of NV_NV_GPUDIRECT_DATA) {
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
        localStorage.setItem("nv-gpudirect_bookmarks", JSON.stringify([...state.bookmarks]));
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
