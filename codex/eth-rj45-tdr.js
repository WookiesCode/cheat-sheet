// eth-rj45-tdr.js
// Standalone interactive cheat sheet for Ethernet: RJ45 Pinouts (T568B/A) & TDR Cable Testing
const ETH_ETH_RJ45_TDR_DATA = [
  {
    "id": "rj45-pinout-tdr-cmd-1",
    "badge": "rj45",
    "title": "RJ45 Pinouts & TDR: Complete TIA/EIA-568B vs 568A RJ45",
    "subtitle": "Complete TIA/EIA-568B vs 568A RJ45 (8P8C) wire order (Hold plug clip-down, gold pins facing you, left=Pin 1)",
    "commands": [
      {
        "id": "rj45-t568b-t568a-chart",
        "desc": "Complete TIA/EIA-568B vs 568A RJ45 (8P8C) wire order (Hold plug clip-down, gold pins facing you, left=Pin 1)",
        "cmd": "T568B (Standard): 1:W/Org  2:Org  3:W/Grn  4:Blu  5:W/Blu  6:Grn  7:W/Brn  8:Brn\nT568A (Gov/Res):  1:W/Grn  2:Grn  3:W/Org  4:Blu  5:W/Blu  6:Org  7:W/Brn  8:Brn",
        "details": "",
        "flags": [
          [
            "Pair 2 (Orange) & Pair 3 (Green)",
            "Pins 1–2 and Pins 3–6 carry TX/RX in 10/100BASE-TX (swapping Orange & Green converts T568B ↔ T568A)"
          ],
          [
            "Pair 1 (Blue: Pins 4–5)",
            "Center pair (Pins 4 & 5) is ALWAYS Blue / White-Blue in both T568B and T568A"
          ],
          [
            "Pair 4 (Brown: Pins 7–8)",
            "Rightmost pair (Pins 7 & 8) is ALWAYS White-Brown / Brown in both T568B and T568A"
          ],
          [
            "1G / 2.5G / 5G / 10GBASE-T",
            "Uses ALL 4 pairs (Pins 1–8) simultaneously in full-duplex PAM5 / PAM16"
          ]
        ],
        "tip": "Only Orange & Green swap between B and A",
        "tags": [
          "RJ45 Pinouts & TDR",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "rj45",
          "pinout",
          "t568b",
          "t568a",
          "568b",
          "568a",
          "wires",
          "colors",
          "8p8c"
        ]
      }
    ]
  },
  {
    "id": "rj45-pinout-tdr-cmd-2",
    "badge": "rj45",
    "title": "RJ45 Pinouts & TDR: Run built-in NIC PHY Time-Domain Reflectometer",
    "subtitle": "Run built-in NIC PHY Time-Domain Reflectometer (TDR) to find broken RJ45 pins & exact distance to fault",
    "commands": [
      {
        "id": "ethtool-cable-test-tdr",
        "desc": "Run built-in NIC PHY Time-Domain Reflectometer (TDR) to find broken RJ45 pins & exact distance to fault",
        "cmd": "ethtool --cable-test eth0   |   ethtool --cable-test-tdr eth0",
        "details": "",
        "flags": [
          [
            "--cable-test",
            "Tests Pair A (1-2), Pair B (3-6), Pair C (4-5), Pair D (7-8) for 'OK', 'Open', or 'Short' and distance in meters!"
          ],
          [
            "Why 1GbE drops to 100Mb/s",
            "If Pair C (Pins 4-5 Blue) or Pair D (Pins 7-8 Brown) has a bad crimp/punchdown, 1000BASE-T fails and downshifts to 100BASE-TX (which only uses Pins 1,2,3,6)!"
          ],
          [
            "Split Pair Error",
            "Wiring Pin 3 & 4 as a pair instead of Pin 3 & 6 passes basic continuity lights but fails at 1Gbps due to severe NEXT crosstalk!"
          ]
        ],
        "tip": "Finds bad crimp distance in meters!",
        "tags": [
          "RJ45 Pinouts & TDR",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "cable-test",
          "tdr",
          "ethtool",
          "open",
          "short",
          "100mbps",
          "crimp",
          "rj45"
        ]
      }
    ]
  },
  {
    "id": "rj45-pinout-tdr-cmd-3",
    "badge": "rj45",
    "title": "RJ45 Pinouts & TDR: Physically blink the RJ45/SFP port LED on a multi-port NIC to identify which cable is `eth0`/`eno1`",
    "subtitle": "Physically blink the RJ45/SFP port LED on a multi-port NIC to identify which cable is `eth0`/`eno1`",
    "commands": [
      {
        "id": "ethtool-identify-blink-led",
        "desc": "Physically blink the RJ45/SFP port LED on a multi-port NIC to identify which cable is `eth0`/`eno1`",
        "cmd": "ethtool -p eno1 30",
        "details": "",
        "flags": [
          [
            "-p <iface> 30",
            "Flashes the physical activity/link LED on that specific NIC port for 30 seconds"
          ]
        ],
        "tip": "Never unplug the wrong port again",
        "tags": [
          "RJ45 Pinouts & TDR",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "blink",
          "led",
          "identify",
          "port",
          "ethtool",
          "physical"
        ]
      }
    ]
  },
  {
    "id": "rj45-pinout-tdr-pro-tips",
    "badge": "tip",
    "title": "RJ45 Pinouts & TDR: Pro Tips & Best Practices",
    "subtitle": "Physical Layer RJ45 Cable Certification & TDR Fault Locating",
    "commands": [
      {
        "id": "rj45-pinout-tdr-tips-card",
        "desc": "Physical Layer RJ45 Cable Certification & TDR Fault Locating",
        "cmd": "ethtool --cable-test eth0 && ethtool -p eth0 5",
        "details": "TDR (Time-Domain Reflectometry) transmits electrical pulses into twisted pairs to measure impedance reflections, detecting open pairs, shorts, and distance to faults within 1 meter accuracy. In datacenter patching, an accidental 100Mbps fallback on a 1Gbps/10Gbps link almost always indicates damage or discontinuity on pins 4/5 (Blue) or 7/8 (Brown).",
        "flags": [
          [
            "ethtool --cable-test <dev>",
            "Trigger physical layer PHY TDR analysis on unlinked twisted copper pairs"
          ],
          [
            "ethtool -p <dev> <sec>",
            "Physically blink interface link/activity LED to trace cables in dense patch racks"
          ],
          [
            "T568B Standard",
            "Pin 1: White/Orange, 2: Orange, 3: White/Green, 4: Blue, 5: White/Blue, 6: Green, 7: White/Brown, 8: Brown"
          ]
        ],
        "tip": "Never punch down mixed T568A and T568B on opposite patch panel ends unless intentionally building a legacy crossover cable.",
        "tags": [
          "rj45-pinout-tdr",
          "tips",
          "pro",
          "ethernet",
          "nic",
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("eth-rj45-tdr_bookmarks") || "[]"))
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

// Ethernet Command Syntax Highlighting
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
  const allCards = ETH_ETH_RJ45_TDR_DATA;
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

  for (const card of ETH_ETH_RJ45_TDR_DATA) {
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
      const commandHtml = cmd.id === "rj45-t568b-t568a-chart"
        ? '<div class="pinout-diagrams">' +
          '<figure class="pinout-figure"><img src="assets/rj45-t568b.svg" alt="T568B plug wire order, pins 1 through 8: white-orange, orange, white-green, blue, white-blue, green, white-brown, brown" width="373" height="187"><figcaption>T568B · <a href="https://commons.wikimedia.org/wiki/File:RJ-45_TIA-568B_Right.svg">Miha Ulanov, CC0</a></figcaption></figure>' +
          '<figure class="pinout-figure"><img src="assets/rj45-t568a.svg" alt="T568A plug wire order, pins 1 through 8: white-green, green, white-orange, blue, white-blue, orange, white-brown, brown" width="373" height="187"><figcaption>T568A · <a href="https://commons.wikimedia.org/wiki/File:RJ-45_TIA-568A_Right.svg">Miha Ulanov, CC0</a></figcaption></figure>' +
          '</div>'
        : '<div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">' +
          '<pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>' +
          '<button type="button" class="copy-btn" title="Copy command" aria-label="Copy command">' +
            '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">' +
              '<rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>' +
              '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>' +
            '</svg><span class="copy-feedback">Copy</span></button></div>';

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
        '  ' + commandHtml,
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
        localStorage.setItem("eth-rj45-tdr_bookmarks", JSON.stringify([...state.bookmarks]));
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
