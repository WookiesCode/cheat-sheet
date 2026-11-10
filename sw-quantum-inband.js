// sw-quantum-inband.js
// Standalone interactive cheat sheet for Switches: NVIDIA Quantum IB (Unmanaged) — Host In-Band MFT & Diagnostics
const SW_SW_QUANTUM_INBAND_DATA = [
  {
    "id": "quantum-unmanaged-inband-cmd-1",
    "badge": "qib",
    "title": "Quantum: In-Band MFT: Remotely inspect optical DOM",
    "subtitle": "Remotely inspect optical DOM (dBm), BER, eye opening, and port counters on an Unmanaged Quantum switch using its IB LID",
    "commands": [
      {
        "id": "quantum-inband-mlxlink-smpquery",
        "desc": "Remotely inspect optical DOM (dBm), BER, eye opening, and port counters on an Unmanaged Quantum switch using its IB LID",
        "cmd": "ibswitches && mlxlink -d lid-1 -p 1 -m -c -e",
        "details": "Unmanaged NVIDIA Quantum switches (such as MQM8790 HDR and MQM9790 NDR) have no local CPU/SSH CLI—they are managed entirely in-band over the InfiniBand fabric via SMP/GMP MAD packets! From any GPU server or UFM appliance with Mellanox MFT installed, you can target any switch by its LID ('lid-<N>') and port ('-p <1..64>') to read optical transceivers, bounce ports, or check firmware.",
        "flags": [
          [
            "ibswitches",
            "Discover all Quantum InfiniBand switches in the fabric along with their GUID, port count, and LID"
          ],
          [
            "-d lid-<N>",
            "Target the remote Quantum switch in-band by its Local Identifier (e.g., -d lid-1 or hex -d lid-0x0001)"
          ],
          [
            "-p <1..64>",
            "Specify the physical switch port number on the remote Quantum switch (1..64)"
          ],
          [
            "-m -c -e",
            "Dump remote switch port optical module DOM (dBm/temp), BER counters, and SerDes eye grade"
          ]
        ],
        "tip": "MQM9790 / MQM8790 switches have no SSH CLI—use 'mlxlink -d lid-<N> -p <Port>' from any host!",
        "tags": [
          "Quantum: In-Band MFT",
          "switch",
          "nos",
          "cli",
          "triage",
          "nvidia",
          "quantum",
          "unmanaged",
          "mqm9790",
          "mqm8790",
          "inband",
          "mlxlink",
          "lid",
          "perfquery",
          "smpquery",
          "flint",
          "ibswitches"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility",
              "title": "MFT: mlxlink"
            },
            {
              "url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibswitches.8.in.rst",
              "title": "ibswitches man page (rdma-core)"
            }
          ],
          "note": "NVIDIA shows mlxlink -d lid-<LID> -p <port> for Quantum split ports."
        }
      },
      {
        "id": "quantum-inband-mlxlink-smpquery-sub-1",
        "desc": "Remotely read OSFP/QSFP optical Rx/Tx power (dBm), SNR, and BER on port 15 of Quantum switch LID 1",
        "cmd": "mlxlink -d lid-1 -p 15 -m -c -e",
        "tags": [
          "Quantum: In-Band MFT",
          "recipe",
          "automation",
          "cli"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility",
              "title": "MFT: mlxlink"
            },
            {
              "url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibswitches.8.in.rst",
              "title": "ibswitches man page (rdma-core)"
            }
          ],
          "note": "NVIDIA shows mlxlink -d lid-<LID> -p <port> for Quantum split ports."
        }
      },
      {
        "id": "quantum-inband-mlxlink-smpquery-sub-2",
        "desc": "Remotely bounce (toggle) port 15 on Quantum switch LID 1 over the InfiniBand fabric",
        "cmd": "mlxlink -d lid-1 -p 15 -a TG",
        "tags": [
          "Quantum: In-Band MFT",
          "recipe",
          "automation",
          "cli"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility",
              "title": "MFT: mlxlink"
            }
          ]
        }
      },
      {
        "id": "quantum-inband-mlxlink-smpquery-sub-3",
        "desc": "Read extended PMA error counters on switch LID 1 port 15, then reset (-R) its counters",
        "cmd": "perfquery -x 1 15 && perfquery -R 1 15",
        "tags": [
          "Quantum: In-Band MFT",
          "recipe",
          "automation",
          "cli"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/perfquery.8.in.rst",
              "title": "perfquery man page (rdma-core)"
            }
          ]
        }
      },
      {
        "id": "quantum-inband-mlxlink-smpquery-sub-4",
        "desc": "Query hardware NodeInfo and PortInfo (Active/Init state, speed, width, LID) of switch LID 1 port 15",
        "cmd": "smpquery nodeinfo 1 && smpquery portinfo 1 15",
        "tags": [
          "Quantum: In-Band MFT",
          "recipe",
          "automation",
          "cli"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "smpquery was not checked this round."
        }
      },
      {
        "id": "quantum-inband-mlxlink-smpquery-sub-5",
        "desc": "Query the ASIC firmware version and PSID of remote Quantum switch LID 1 in-band",
        "cmd": "flint -d lid-1 q",
        "tags": [
          "Quantum: In-Band MFT",
          "recipe",
          "automation",
          "cli"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/mftswum/4330/flint-firmware-burning-tool",
              "title": "MFT: flint"
            }
          ],
          "note": "flint documents q and in-band use, not a lid- example."
        }
      },
      {
        "id": "quantum-inband-mlxlink-smpquery-sub-6",
        "desc": "Sweep all Quantum switches in the fabric and dump every switch port's optical transceiver and temperature report",
        "cmd": "ibdiagnet --get_phy_info --get_cable_info -o /tmp/ibdiag",
        "tags": [
          "Quantum: In-Band MFT",
          "recipe",
          "automation",
          "cli"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/ibdiagnetutilityum/2.27.0/basic-commands",
              "title": "ibdiagnet commands"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "quantum-unmanaged-inband-pro-tips",
    "badge": "tip",
    "title": "Quantum: In-Band MFT: Pro Tips & Best Practices",
    "subtitle": "Out-of-Band vs In-Band Telemetry on Unmanaged QM8700/QM9700 Switches",
    "commands": [
      {
        "id": "quantum-unmanaged-inband-tips-card",
        "desc": "Out-of-Band vs In-Band Telemetry on Unmanaged QM8700/QM9700 Switches",
        "cmd": "mlxlink -d lid-0x0004 -p 1 --show_module --show_counters",
        "details": "Externally managed (unmanaged) Quantum switches have no management CPU or IP, so you read them in-band from a connected host with MFT, addressing the switch by LID: mlxlink -d lid-<LID> -p <port>. On managed MLNX-OS switches, in-band management is blocked by default (system manage inband-ib enables it).",
        "flags": [
          [
            "mlxlink -d lid-<LID> -p <port>",
            "Read a switch port's module and PHY state in-band"
          ],
          [
            "smpquery portinfo <LID> <port>",
            "SMP PortInfo: link speed, width, state, MTU"
          ],
          [
            "ibportstate <LID> <port> reset",
            "Reset a switch port from a host (changes state)"
          ]
        ],
        "tip": "Obtain switch LIDs with \"ibswitches\" or \"ibnetdiscover\" before querying via host in-band MFT tools.",
        "tags": [
          "quantum-unmanaged-inband",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility",
              "title": "MFT: mlxlink"
            },
            {
              "url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibswitches.8.in.rst",
              "title": "ibswitches man page (rdma-core)"
            },
            {
              "url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/smpquery.8.in.rst",
              "title": "smpquery man page (rdma-core)"
            },
            {
              "url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibportstate.8.in.rst",
              "title": "ibportstate man page (rdma-core)"
            },
            {
              "url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/infiniband-interface",
              "title": "MLNX-OS 3.12.6200: InfiniBand interface"
            }
          ],
          "note": "The in-band block on managed switches is from the MLNX-OS InfiniBand interface chapter."
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("sw-quantum-inband_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Switch NOS Command Syntax Highlighting
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
  const allCards = SW_SW_QUANTUM_INBAND_DATA;
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

  for (const card of SW_SW_QUANTUM_INBAND_DATA) {
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
        localStorage.setItem("sw-quantum-inband_bookmarks", JSON.stringify([...state.bookmarks]));
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
