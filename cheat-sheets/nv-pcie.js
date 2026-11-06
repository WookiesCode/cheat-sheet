// nv-pcie.js
// Standalone interactive cheat sheet for NVIDIA: PCIe AER, ACS, Xid Triage, GSP & Bug Reports
const NV_NV_PCIE_DATA = [
  {
    "id": "pcie-kernel-triage-card-1",
    "badge": "pcie",
    "title": "PCIe AER: Kernel Xid, SXid & PCIe AER Error Decoding",
    "subtitle": "Extract all NVIDIA Xid, NVSwitch SXid, NVLink, and PCIe AER hardware errors with timestamps",
    "commands": [
      {
        "id": "dmesg-xid-sxid-triage",
        "mode": "TRIAGE",
        "modeClass": "mode-t",
        "desc": "Extract all NVIDIA Xid, NVSwitch SXid, NVLink, and PCIe AER hardware errors with timestamps",
        "cmd": "dmesg -T | grep -E 'NVRM: Xid|nvidia-nvswitch: SXid|nvlink|AER|fallen off the bus'",
        "flags": [
          [
            "PCI:xxxx:xx:xx.x",
            "The PCI BDF printed in the Xid log identifies the exact physical GPU that faulted!"
          ],
          [
            "Xid 79",
            "GPU fell off PCIe bus — inspect PSU cables, PCIe riser/retimer, and motherboard BMC/SEL logs"
          ],
          [
            "Xid 48 / 64 / 95",
            "Uncorrectable HBM ECC / Row Remap Failure — run nvidia-smi -q -d ROW_REMAPPER"
          ]
        ],
        "tip": "Match PCI BDF to physical slot",
        "tags": [
          "xid",
          "sxid",
          "dmesg",
          "aer",
          "triage",
          "fault",
          "79",
          "48",
          "64"
        ]
      }
    ]
  },
  {
    "id": "pcie-kernel-triage-card-2",
    "badge": "pcie",
    "title": "PCIe AER: PCIe Gen/Width Capability vs Active Status",
    "subtitle": "Inspect PCIe Link Capabilities vs Link Status (Speed/Width), NUMA node, and AER error registers",
    "commands": [
      {
        "id": "lspci-link-aer-audit",
        "mode": "PCIE BUS",
        "modeClass": "mode-t",
        "desc": "Inspect PCIe Link Capabilities vs Link Status (Speed/Width), NUMA node, and AER error registers",
        "cmd": "lspci -vvv -d 10de: | grep -E '^([0-9a-f]{2}:|.*LnkCap:|.*LnkSta:|.*NUMA|.*UESta:|.*CESta:)'",
        "flags": [
          [
            "LnkCap vs LnkSta",
            "Verify Speed (16GT/s=Gen4, 32GT/s=Gen5) and Width (x16) match capability"
          ],
          [
            "UESta / CESta",
            "Uncorrectable / Correctable PCIe AER error status flags (BadTLP, BadDLLP, Replay Timer Timeout)"
          ]
        ],
        "tags": [
          "lspci",
          "aer",
          "pcie",
          "lnksta",
          "lnkcap",
          "gen5",
          "gen4",
          "numa"
        ]
      }
    ]
  },
  {
    "id": "pcie-kernel-triage-card-3",
    "badge": "pcie",
    "title": "PCIe AER: Disable PCIe ACS for Peer-to-Peer Routing",
    "subtitle": "Disable PCIe Access Control Services (ACS) on PCIe switch ports to prevent P2P traffic routing through CPU root complex",
    "commands": [
      {
        "id": "disable-pcie-acs",
        "mode": "PCIE P2P",
        "modeClass": "mode-c",
        "desc": "Disable PCIe Access Control Services (ACS) on PCIe switch ports to prevent P2P traffic routing through CPU root complex",
        "cmd": "for bdf in $(lspci -d '*:*:0604' | awk '{print $1}'); do setpci -v -s $bdf ECAP_ACS+0x6.w=0000; done",
        "flags": [
          [
            "ECAP_ACS+0x6.w=0000",
            "Clears ACSControl register on PCIe bridge/switch ports so GPUDirect P2P & RDMA stay on switch fabric"
          ],
          [
            "IOMMU / VT-d",
            "If P2P still routes via SYS, verify kernel booted with 'iommu=pt' (passthrough)"
          ]
        ],
        "tip": "Fixes slow SYS P2P on PCIe servers",
        "tags": [
          "acs",
          "setpci",
          "p2p",
          "gpudirect",
          "iommu",
          "bridge",
          "switch"
        ]
      }
    ]
  },
  {
    "id": "pcie-kernel-triage-card-4",
    "badge": "pcie",
    "title": "PCIe AER: GSP Firmware Verification & nvidia-bug-report",
    "subtitle": "Check GSP firmware status and generate official `nvidia-bug-report.log.gz` for vendor RMA",
    "commands": [
      {
        "id": "gsp-firmware-bugreport",
        "mode": "SUPPORT / RMA",
        "modeClass": "mode-c",
        "desc": "Check GSP firmware status and generate official `nvidia-bug-report.log.gz` for vendor RMA",
        "cmd": "cat /proc/driver/nvidia/gpus/*/information   |   nvidia-bug-report.sh --output-file /tmp/nvidia-bug-report.log.gz",
        "flags": [
          [
            "nvidia-bug-report.sh",
            "Collects NVML state, dmesg, Xids, VBIOS, lspci, acpidump, and DCGM logs required for RMA tickets"
          ],
          [
            "NVreg_EnableGpuFirmware=0",
            "Kernel module parameter workaround if troubleshooting GSP firmware hangs (Xid 119/120)"
          ]
        ],
        "tip": "Capture BEFORE rebooting faulted node!",
        "tags": [
          "bug-report",
          "rma",
          "gsp",
          "firmware",
          "support",
          "proc"
        ]
      }
    ]
  },
  {
    "id": "pcie-kernel-triage-pro-tips",
    "badge": "tip",
    "title": "PCIe AER: Pro Tips & Best Practices",
    "subtitle": "Critical Xid error decoding, PCIe AER link errors & vendor RMA bug reports",
    "commands": [
      {
        "id": "pcie-kernel-triage-tips-card",
        "desc": "Critical Xid error decoding, PCIe AER link errors & vendor RMA bug reports",
        "cmd": "dmesg -T | grep -E \"NVRM: Xid|AER\"   |   lspci -vvv -s <BUS_ID>   |   nvidia-bug-report.sh",
        "details": "Xid errors are logged directly to dmesg. Xid 31 indicates page faults; Xid 43 indicates the GPU stopped processing, usually an application fault; Xid 79 indicates GPU fallen off PCIe bus. Always generate nvidia-bug-report.sh before host reboot.",
        "flags": [
          [
            "Xid 79",
            "GPU fallen off PCIe bus: check PCIe auxiliary power cables, risers, or cold-plate torque"
          ],
          [
            "Xid 45",
            "Preemptive cleanup: GPU driver reset required due to hardware or memory fault"
          ],
          [
            "Xid 62",
            "Internal micro-controller halt: VBIOS or GSP firmware communication timeout"
          ],
          [
            "nvidia-bug-report.sh",
            "Generates compressed diagnostic bundle required by NVIDIA Enterprise Support for RMA"
          ]
        ],
        "tip": "Disable PCIe ACS (Access Control Services) on PCIe switches to enable direct P2P peer transfers!",
        "tags": [
          "pcie-kernel-triage",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nv-pcie_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = NV_NV_PCIE_DATA;
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

  for (const card of NV_NV_PCIE_DATA) {
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
        localStorage.setItem("nv-pcie_bookmarks", JSON.stringify([...state.bookmarks]));
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
