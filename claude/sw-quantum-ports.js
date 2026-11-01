// sw-quantum-ports.js
// Standalone interactive cheat sheet for Switches: NVIDIA Quantum IB (MLNX-OS) — Ports, Optics & Counters
const SW_SW_QUANTUM_PORTS_DATA = [
  {
    "id": "quantum-mlnxos-ports-cmd-1",
    "badge": "qtm",
    "title": "Quantum: Ports & Optics: Show operational state, physical link state, NDR/HDR rate, and speed of all InfiniBand switch ports",
    "subtitle": "Show operational state, physical link state, NDR/HDR rate, and speed of all InfiniBand switch ports (IB 1/1..1/64)",
    "commands": [
      {
        "id": "mlnxos-show-interfaces-ib",
        "desc": "Show operational state, physical link state, NDR/HDR rate, and speed of all InfiniBand switch ports (IB 1/1..1/64)",
        "cmd": "show interfaces ib status && show interfaces ib 1/1",
        "details": "On managed NVIDIA Quantum (QM8700 HDR) and Quantum-2 (QM9700 NDR) switches running MLNX-OS, enter privileged mode with 'enable' (and 'configure terminal' for config changes). 'show interfaces ib status' lists every IB port's Operational State (Active, Armed, Init, Down), Physical State (LinkUp vs Polling), Speed (NDR 400G / HDR 200G), and Width (4x / 2x).",
        "flags": [
          [
            "enable",
            "Enter Privileged EXEC mode on MLNX-OS (prompt changes from '>' to '#')"
          ],
          [
            "show interfaces ib status",
            "Compact summary table of all IB 1/1..1/64 (or split 1/1/1..1/32/2) switch ports"
          ],
          [
            "show interfaces ib 1/1",
            "Detailed link state, LID, physical state, speed, width, FEC, and counters for port IB 1/1"
          ]
        ],
        "tip": "Physical 'LinkUp' + Logical 'Init' means OpenSM/UFM Subnet Manager is not reachable!",
        "tags": [
          "Quantum: Ports & Optics",
          "switch",
          "nos",
          "cli",
          "triage",
          "nvidia",
          "quantum",
          "mlnx-os",
          "infiniband",
          "ib",
          "interfaces",
          "transceiver",
          "dom",
          "counters",
          "qm9700",
          "qm8700"
        ]
      }
    ]
  },
  {
    "id": "quantum-mlnxos-ports-recipes-1",
    "badge": "qtm",
    "title": "Quantum: Ports & Optics: Common Recipes & Verification",
    "subtitle": "Production CLI commands, transceivers & diagnostic workflows for Quantum: Ports & Optics",
    "commands": [
      {
        "id": "mlnxos-show-interfaces-ib-sub-1",
        "desc": "Inspect OSFP/QSFP optical DOM on IB 1/1: per-lane Rx/Tx optical power (dBm), bias current, module temp, PN & SN",
        "cmd": "show interfaces ib 1/1 transceiver",
        "tags": [
          "Quantum: Ports & Optics",
          "recipe",
          "automation",
          "cli"
        ]
      },
      {
        "id": "mlnxos-show-interfaces-ib-sub-2",
        "desc": "Dump optical transceiver inventory and DOM diagnostics across all populated InfiniBand switch ports",
        "cmd": "show interfaces ib transceiver",
        "tags": [
          "Quantum: Ports & Optics",
          "recipe",
          "automation",
          "cli"
        ]
      },
      {
        "id": "mlnxos-show-interfaces-ib-sub-3",
        "desc": "Display IB 1/1 traffic and physical error counters (SymbolError, LinkErrorRecovery, LinkDowned, PortRcvErrors)",
        "cmd": "show interfaces ib 1/1 counters",
        "tags": [
          "Quantum: Ports & Optics",
          "recipe",
          "automation",
          "cli"
        ]
      },
      {
        "id": "mlnxos-show-interfaces-ib-sub-4",
        "desc": "Reset hardware error counters on IB 1/1 after cleaning fiber or replacing an OSFP/QSFP module",
        "cmd": "clear interfaces ib 1/1 counters",
        "tags": [
          "Quantum: Ports & Optics",
          "recipe",
          "automation",
          "cli"
        ]
      },
      {
        "id": "mlnxos-show-interfaces-ib-sub-5",
        "desc": "Bounce (shut / no shut) InfiniBand switch port IB 1/1 to force link retraining",
        "cmd": "configure terminal ; interface ib 1/1 shutdown ; no interface ib 1/1 shutdown",
        "tags": [
          "Quantum: Ports & Optics",
          "recipe",
          "automation",
          "cli"
        ]
      },
      {
        "id": "mlnxos-show-interfaces-ib-sub-6",
        "desc": "Label InfiniBand switch port IB 1/1 with the connected GPU server hostname and HCA",
        "cmd": "interface ib 1/1 description \"GPU-Node-01 mlx5_0\"",
        "tags": [
          "Quantum: Ports & Optics",
          "recipe",
          "automation",
          "cli"
        ]
      }
    ]
  },
  {
    "id": "quantum-mlnxos-ports-cmd-2",
    "badge": "qtm",
    "title": "Quantum: Ports & Optics: Configure or inspect 2x400G",
    "subtitle": "Configure or inspect 2x400G (NDR) / 2x200G (HDR) twin-port OSFP/QSFP split mode and cable info on Quantum switches",
    "commands": [
      {
        "id": "mlnxos-split-ports-cable",
        "desc": "Configure or inspect 2x400G (NDR) / 2x200G (HDR) twin-port OSFP/QSFP split mode and cable info on Quantum switches",
        "cmd": "show system profile && show interfaces ib 1/1/1 status",
        "details": "NVIDIA Quantum-2 QM9700 switches feature 32 physical OSFP cages where each 800G cage natively splits into two 4-lane 400G NDR ports (1/1/1 and 1/1/2, totaling 64x 400G NDR ports) using twin-port OSFP finned transceivers and 2x MPO-12 APC splitters.",
        "flags": [
          [
            "show system profile",
            "Display active switch system profile (ib, ib-split-ready, etc.) and max port layout"
          ],
          [
            "interface ib 1/1 split",
            "Split a 4x port into two 2x sub-ports (1/1/1 and 1/1/2) for HDR100 / NDR200 splitter cables"
          ]
        ],
        "tip": "Quantum-2 QM9700 cages house two 400G NDR ports per OSFP module (64 ports in 32 cages)",
        "tags": [
          "Quantum: Ports & Optics",
          "switch",
          "nos",
          "cli",
          "triage",
          "nvidia",
          "quantum",
          "mlnx-os",
          "split",
          "osfp",
          "ndr",
          "hdr",
          "cables"
        ]
      }
    ]
  },
  {
    "id": "quantum-mlnxos-ports-recipes-2",
    "badge": "qtm",
    "title": "Quantum: Ports & Optics: Common Recipes & Verification",
    "subtitle": "Production CLI commands, transceivers & diagnostic workflows for Quantum: Ports & Optics",
    "commands": [
      {
        "id": "mlnxos-split-ports-cable-sub-1",
        "desc": "Check optical DOM Tx/Rx dBm and module temperature on split sub-port IB 1/1/1",
        "cmd": "show interfaces ib 1/1/1 transceiver",
        "tags": [
          "Quantum: Ports & Optics",
          "recipe",
          "automation",
          "cli"
        ]
      },
      {
        "id": "mlnxos-split-ports-cable-sub-2",
        "desc": "List all plugged InfiniBand cables/transceivers (OSFP/QSFP, active optical vs passive DAC, length, vendor PN/SN)",
        "cmd": "show cables",
        "tags": [
          "Quantum: Ports & Optics",
          "recipe",
          "automation",
          "cli"
        ]
      }
    ]
  },
  {
    "id": "quantum-mlnxos-ports-pro-tips",
    "badge": "tip",
    "title": "Quantum: Ports & Optics: Pro Tips & Best Practices",
    "subtitle": "NVIDIA Quantum & Quantum-2 (MLNX-OS) Port Provisioning & DOM Diagnostics",
    "commands": [
      {
        "id": "quantum-mlnxos-ports-tips-card",
        "desc": "NVIDIA Quantum & Quantum-2 (MLNX-OS) Port Provisioning & DOM Diagnostics",
        "cmd": "show interfaces ib 1/1 transceiver && show interfaces ib status",
        "details": "On QM8700 (HDR 200G) and QM9700 (NDR 400G) switches, OSFP twin-port transceivers split a single 800G cage into two 400G NDR ports (1/1/1 and 1/1/2). If a link remains in \"Init\" state while physical link is LinkUp, verify the Subnet Manager (OpenSM or UFM) is active and reachable.",
        "flags": [
          [
            "show interfaces ib status",
            "View summary link state, physical state, speed and width across all IB ports"
          ],
          [
            "show interfaces ib 1/1 transceiver",
            "Detailed optical DOM: Tx/Rx optical power (dBm), bias current, and module temperature"
          ],
          [
            "show cables",
            "Verify cable type (AOC, passive copper DAC, optical MPO), vendor part number, and serial number"
          ]
        ],
        "tip": "Physical LinkUp + Logical Init = Subnet Manager unreachable. Check \"show ib sm\" or restart OpenSM.",
        "tags": [
          "quantum-mlnxos-ports",
          "tips",
          "pro",
          "switches",
          "fabric",
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
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("sw-quantum-ports_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
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
  const allCards = SW_SW_QUANTUM_PORTS_DATA;
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

  for (const card of SW_SW_QUANTUM_PORTS_DATA) {
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
        localStorage.setItem("sw-quantum-ports_bookmarks", JSON.stringify([...state.bookmarks]));
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
