// fo-cleaning-testing.js
// Standalone interactive cheat sheet for Fiber Optics: Cleaning, OTDR/OLTS Testing, FEC & Triage
const FO_FO_CLEANING_TESTING_DATA = [
  {
    "id": "cleaning-testing-triage-cmd-1",
    "badge": "phy",
    "title": "Cleaning & Testing Triage: IEC 61300-3-35 Inspect-Before-You-Connect workflow",
    "subtitle": "IEC 61300-3-35 Inspect-Before-You-Connect workflow (85%+ of datacenter link issues are dirty ferrules)",
    "commands": [
      {
        "id": "inspect-clean-connect",
        "desc": "IEC 61300-3-35 Inspect-Before-You-Connect workflow (85%+ of datacenter link issues are dirty ferrules)",
        "cmd": "1. Inspect w/ 400x Scope  ──►  2. Dry IBC Click-Cleaner (1–2 clicks)  ──►  3. Wet-to-Dry Clean (if oil/gel)  ──►  4. Re-Inspect",
        "details": "",
        "flags": [
          [
            "9 µm SMF Core Size",
            "Single-mode core is only 9 microns wide (1/10th of a human hair) — a single skin-oil smudge or dust speck blocks the entire core!"
          ],
          [
            "Brand New Patch Cords",
            "Factory dust caps outgas plasticizer residue onto ferrules — ALWAYS click-clean brand-new cables straight out of the bag!"
          ],
          [
            "MPO vs LC Cleaners",
            "Use wide ribbon IBC cleaners for MPO-12/16 (cleans all 12/16 fibers + inside Male guide-pin holes) and 1.25mm pens for LC"
          ]
        ],
        "tip": "New out of bag ≠ clean!",
        "tags": [
          "Cleaning & Testing Triage",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "clean",
          "ibc",
          "clicker",
          "scope",
          "ferrule",
          "dust",
          "contamination"
        ]
      }
    ]
  },
  {
    "id": "cleaning-testing-triage-cmd-2",
    "badge": "phy",
    "title": "Cleaning & Testing Triage: When to install inline optical attenuators to prevent burning out receiver photodiodes",
    "subtitle": "When to install inline optical attenuators to prevent burning out receiver photodiodes (`RX High Alarm`)",
    "commands": [
      {
        "id": "optical-attenuators-overload",
        "desc": "When to install inline optical attenuators to prevent burning out receiver photodiodes (`RX High Alarm`)",
        "cmd": "10km LR4: Safe at 2m patch (Max TX ≤ Max RX)   |   40km ER4 / 80km ZR: MUST use 10–15 dB Attenuator on short patches!",
        "details": "",
        "flags": [
          [
            "Damage Threshold vs Overload",
            "If TX max launch power exceeds RX overload/damage rating (common on ER4, ZR, DWDM), short patch cords will saturate or permanently destroy the APD receiver!"
          ],
          [
            "DR4 / FR4 / LR4",
            "Standard 500m DR4, 2km FR4, and 10km LR4 are engineered so Max TX ≤ Max RX Overload (safe for short back-to-back rack patching)"
          ]
        ],
        "tip": "",
        "tags": [
          "Cleaning & Testing Triage",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "attenuator",
          "overload",
          "er4",
          "zr",
          "lr4",
          "burn",
          "damage",
          "pad"
        ]
      }
    ]
  },
  {
    "id": "cleaning-testing-triage-cmd-3",
    "badge": "phy",
    "title": "Cleaning & Testing Triage: Step-by-step field isolation for flapping links, high Pre-FEC BER, or uncorrectable FEC codeword errors",
    "subtitle": "Step-by-step field isolation for flapping links, high Pre-FEC BER, or uncorrectable FEC codeword errors",
    "commands": [
      {
        "id": "fec-ber-fault-triage",
        "desc": "Step-by-step field isolation for flapping links, high Pre-FEC BER, or uncorrectable FEC codeword errors",
        "cmd": "Check DOM RX dBm per lane  ──►  Check Lane Skew (<2.5 dB)  ──►  Clean Patch & Panel  ──►  Swap Patch Cord  ──►  Loopback Test Optic",
        "details": "",
        "flags": [
          [
            "1 single lane low RX (e.g. Lane 3 = -11 dBm, Lanes 0–2 = -2 dBm)",
            "Classic symptom of contamination on fiber #3/#10 of an MPO ferrule or damaged individual sub-assembly"
          ],
          [
            "All lanes low RX (-8 to -12 dBm)",
            "Excessive link insertion loss: pinched/macro-bent fiber (bend radius <30mm), Female-to-Female unpinned MPO coupler, or dirty trunk cassettes"
          ],
          [
            "Good RX dBm (-2 dBm) but high Pre-FEC BER / eye closure",
            "High reflectance (APC mated to UPC!), failing laser/DSP on remote TX or local RX, or chromatic/modal dispersion"
          ]
        ],
        "tip": "1 weak lane on MPO = dirty outer fiber",
        "tags": [
          "Cleaning & Testing Triage",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "triage",
          "troubleshooting",
          "ber",
          "fec",
          "flap",
          "crc",
          "skew",
          "loopback"
        ]
      }
    ]
  },
  {
    "id": "cleaning-testing-triage-cmd-4",
    "badge": "phy",
    "title": "Cleaning & Testing Triage: Tier-1 OLTS",
    "subtitle": "Tier-1 OLTS (Optical Loss Test Set) vs Tier-2 OTDR (Optical Time-Domain Reflectometer) structured cabling tests",
    "commands": [
      {
        "id": "olts-vs-otdr-testing",
        "desc": "Tier-1 OLTS (Optical Loss Test Set) vs Tier-2 OTDR (Optical Time-Domain Reflectometer) structured cabling tests",
        "cmd": "Tier 1 (OLTS Power Meter): Total End-to-End dB Insertion Loss   |   Tier 2 (OTDR): Distance-to-Fault (m) + Per-Panel Reflectance & Splice Loss",
        "details": "",
        "flags": [
          [
            "Launch & Receive Reference Cords",
            "Always use a 150m+ Launch Box & Receive Box with an OTDR so the first and last patch panels don't hide inside the OTDR's event dead zone!"
          ],
          [
            "Max Datacenter MPO Link Budget",
            "IEEE 400GBASE-DR4 / 800G-DR8 total channel insertion loss budget is typically ≤ 3.0 dB (500m)"
          ]
        ],
        "tip": "",
        "tags": [
          "Cleaning & Testing Triage",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "otdr",
          "olts",
          "fluke",
          "exfo",
          "tier1",
          "tier2",
          "launch-cable",
          "dead-zone"
        ]
      }
    ]
  },
  {
    "id": "cleaning-testing-triage-pro-tips",
    "badge": "tip",
    "title": "Cleaning & Testing Triage: Pro Tips & Best Practices",
    "subtitle": "Inspect-Before-You-Connect Best Practices & Layer-1 Optical Flap Triage",
    "commands": [
      {
        "id": "cleaning-testing-triage-tips-card",
        "desc": "Inspect-Before-You-Connect Best Practices & Layer-1 Optical Flap Triage",
        "cmd": "ethtool --show-fec eth0 && mlxlink -d mlx5_0 -p 1 --show_ber",
        "details": "Over 85% of optical network failures in production datacenters stem from microscopic dust contamination on fiber end-faces. Inspect end-faces using a fiber video microscope before connecting. For short single-mode fiber runs (<50m) with high-output DR4/FR4 optics, verify RX optical power does not exceed the receiver overload threshold (+2 dBm); install inline attenuators (typically 3dB–5dB) if needed.",
        "flags": [
          [
            "IEC 61300-3-35",
            "International inspection standard defining acceptable scratches and contamination zones on core/cladding"
          ],
          [
            "Pre-FEC BER",
            "Raw bit error rate before Reed-Solomon correction; normal PAM4 threshold is 10^-7 to 10^-5"
          ],
          [
            "OTDR (Tier-2)",
            "Optical Time-Domain Reflectometer: pinpoints distance to micro-bends, breaks, and high-loss splices"
          ]
        ],
        "tip": "Pre-FEC BER exceeding 10^-4 on PAM4 optics indicates dirty end-faces or excessive fiber bending; post-FEC uncorrectable codewords cause immediate packet drops.",
        "tags": [
          "cleaning-testing-triage",
          "tips",
          "pro",
          "fiber",
          "optics",
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
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("fo-cleaning-testing_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Fiber Optic Command Syntax Highlighting
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
  const allCards = FO_FO_CLEANING_TESTING_DATA;
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

  for (const card of FO_FO_CLEANING_TESTING_DATA) {
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
        localStorage.setItem("fo-cleaning-testing_bookmarks", JSON.stringify([...state.bookmarks]));
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
