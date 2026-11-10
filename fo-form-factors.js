// fo-form-factors.js
// Standalone interactive cheat sheet for Fiber Optics: Form Factors, 400G/800G Optics & Breakouts
const FO_FO_FORM_FACTORS_DATA = [
  {
    "id": "form-factors-breakout-cmd-1",
    "badge": "xcvr",
    "title": "Form Factors & Breakouts: OSFP Finned",
    "subtitle": "OSFP Finned (Switch side) vs OSFP Flat-Top / RHS (Riding Heat Sink for ConnectX-7/8 PCIe NICs)",
    "commands": [
      {
        "id": "osfp-finned-vs-flattop",
        "desc": "OSFP Finned (Switch side) vs OSFP Flat-Top / RHS (Riding Heat Sink for ConnectX-7/8 PCIe NICs)",
        "cmd": "Switch Port: OSFP Finned (8x100G = 800G)   |   NIC Card: OSFP Flat-Top / RHS or QSFP112 (4x100G = 400G)",
        "details": "",
        "flags": [
          [
            "OSFP Finned",
            "Integrated top heatsink fins — used in Quantum-2 / Spectrum-4 / 800G spine-leaf switches"
          ],
          [
            "OSFP Flat-Top (RHS)",
            "Flat top so the PCIe NIC cage's riding heatsink rests on the module — Finned OSFP will NOT fit in a Flat-Top NIC cage!"
          ],
          [
            "QSFP-DD vs OSFP",
            "QSFP-DD is backward-compatible with QSFP28/56; OSFP is slightly wider with more room for heat dissipation (check each module's power rating in its datasheet)"
          ]
        ],
        "tip": "",
        "tags": [
          "Form Factors & Breakouts",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "osfp",
          "finned",
          "flattop",
          "rhs",
          "qsfp-dd",
          "qsfp112",
          "800g",
          "400g"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/nvidia-mms4x00-ns400-400gb-s-single-port-osfp-single-mode-dr4-transceivers-product-specifications.pdf",
              "title": "NVIDIA MMS4X00-NS400 400G DR4 datasheet (RX power, RHS flat top)"
            },
            {
              "url": "https://content.mellanox.com/LinkX/LinkX_Configuration_Maps.pdf",
              "title": "NVIDIA LinkX configuration maps (DAC/ACC reach)"
            }
          ],
          "note": "Corrected 2026-11-10: removed an unsourced 30W figure."
        }
      }
    ]
  },
  {
    "id": "form-factors-breakout-cmd-2",
    "badge": "xcvr",
    "title": "Form Factors & Breakouts: Common AI / Datacenter optical breakout patterns",
    "subtitle": "Common AI / Datacenter optical breakout patterns (800G 2xDR4 → 2× 400G DR4, 400G DR4 → 4× 100G DR1)",
    "commands": [
      {
        "id": "breakout-topologies-800g-400g",
        "desc": "Common AI / Datacenter optical breakout patterns (800G 2xDR4 → 2× 400G DR4, 400G DR4 → 4× 100G DR1)",
        "cmd": "800G Twin-Port OSFP (2x MPO-12 APC)  ──►  2× 400G DR4 / QSFP112 (1x MPO-12 APC each)\n400G DR4 (1x MPO-12 APC)             ──►  4× 100G DR1 / SFP112 (4x LC Duplex UPC)",
        "details": "",
        "flags": [
          [
            "800G 2xDR4 / 2xFR4",
            "Houses TWO independent 400G ports (2x MPO-12 or 2x CS/LC) inside a single 800G OSFP switch cage"
          ],
          [
            "400G DR4 → 4×100G DR1",
            "MPO-12 (APC Green) fanout cable to 4× LC Duplex (UPC Blue) — 100G/lane PAM4 on both ends!"
          ],
          [
            "Modulation Match Rule",
            "Can only passive-breakout when per-lane speed & modulation match (e.g. 100G PAM4/lane to 100G PAM4/lane)"
          ]
        ],
        "tip": "Verify 100G/lane vs 50G/lane PAM4 before breakout!",
        "tags": [
          "Form Factors & Breakouts",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "breakout",
          "fanout",
          "2xdr4",
          "dr4",
          "dr1",
          "pam4",
          "lanes"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://content.mellanox.com/LinkX/LinkX_Configuration_Maps.pdf",
              "title": "NVIDIA LinkX configuration maps (DAC/ACC reach)"
            },
            {
              "url": "https://networking-docs.nvidia.com/mfp7e30nxxxpub",
              "title": "NVIDIA MFP7E30 MPO-12/APC cable (female-female, Type B)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "form-factors-breakout-cmd-3",
    "badge": "xcvr",
    "title": "Form Factors & Breakouts: Choosing between Passive DAC, Active AEC",
    "subtitle": "Choosing between Passive DAC, Active AEC (Retimed Copper), AOC, SR, DR, and FR optics by distance",
    "commands": [
      {
        "id": "dac-acc-aec-aoc",
        "desc": "Choosing between Passive DAC, Active AEC (Retimed Copper), AOC, SR, DR, and FR optics by distance",
        "cmd": "≤3m: Passive DAC   |   ≤5m: Active copper (ACC/AEC)   |   ≤100m: SR4/SR8 (MMF)   |   ≤500m: DR4/DR8 (SMF)   |   ≤2km: FR4 (SMF)",
        "details": "",
        "flags": [
          [
            "Passive DAC (≤3m at 100G/lane, NVIDIA LinkX)",
            "No power draw and the cheapest option; 26AWG for 2-3m is thick and stiff"
          ],
          [
            "ACC / AEC (active copper)",
            "Copper with an equalizer (ACC) or retimer (AEC) chip in the plug; NVIDIA's 100G/lane ACC reaches 4-5m"
          ],
          [
            "AOC (Active Optical Cable)",
            "Sealed factory-terminated fiber assembly (cannot clean internal ferrules or patch through panels)"
          ]
        ],
        "tip": "",
        "tags": [
          "Form Factors & Breakouts",
          "fiber",
          "optics",
          "transceiver",
          "dom",
          "dac",
          "aec",
          "acc",
          "aoc",
          "copper",
          "distance",
          "reach"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://content.mellanox.com/LinkX/LinkX_Configuration_Maps.pdf",
              "title": "NVIDIA LinkX configuration maps (DAC/ACC reach)"
            },
            {
              "url": "https://docs.nvidia.com/mca7j60-nxxx-800gb-s-twin-port-osfp-to-2x400gb-s-osfp-acc-splitter-product-specifications.pdf",
              "title": "NVIDIA MCA7J60 ACC splitter spec"
            }
          ],
          "note": "Corrected 2026-11-10: NVIDIA lists passive DAC to 3m and active copper to 5m at 100G/lane (was 2.5m and 7m)."
        }
      }
    ]
  },
  {
    "id": "form-factors-breakout-pro-tips",
    "badge": "tip",
    "title": "Form Factors & Breakouts: Pro Tips & Best Practices",
    "subtitle": "Transceiver Form Factors, Thermal Dissipation & Interconnect Selection",
    "commands": [
      {
        "id": "form-factors-breakout-tips-card",
        "desc": "Transceiver Form Factors, Thermal Dissipation & Interconnect Selection",
        "cmd": "show interfaces transceiver detail && show cables",
        "details": "NVIDIA Quantum-2 NDR switches use finned OSFP cages for top-down forced air cooling , whereas GPU servers use Flat-Top (RHS) OSFPs that insert flush into internal chassis heat sinks. NVIDIA lists passive DAC up to 3m at 100G PAM4/lane and active copper (ACC) at 4-5m; use optical MPO transceivers for longer, rack-to-rack runs.",
        "flags": [
          [
            "OSFP Finned",
            "Thermal fins integrated on transceiver body; required for external switch airflow"
          ],
          [
            "OSFP Flat-Top / RHS",
            "Smooth top surface designed to contact server internal heat sink clamps"
          ],
          [
            "800G 2xDR4 Breakout",
            "Split dual-port 800G OSFP into two 400G DR4 MPO-12 links"
          ]
        ],
        "tip": "Finned OSFPs are for switch cages and flat-top (RHS) OSFPs for adapter cages with a riding heat sink: match the module to the cage.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://content.mellanox.com/LinkX/LinkX_Configuration_Maps.pdf",
              "title": "NVIDIA LinkX configuration maps (DAC/ACC reach)"
            },
            {
              "url": "https://docs.nvidia.com/mca7j60-nxxx-800gb-s-twin-port-osfp-to-2x400gb-s-osfp-acc-splitter-product-specifications.pdf",
              "title": "NVIDIA MCA7J60 ACC splitter spec"
            },
            {
              "url": "https://docs.nvidia.com/nvidia-mms4x00-ns400-400gb-s-single-port-osfp-single-mode-dr4-transceivers-product-specifications.pdf",
              "title": "NVIDIA MMS4X00-NS400 400G DR4 datasheet (RX power, RHS flat top)"
            }
          ],
          "note": "Corrected 2026-11-10: DAC/ACC reach from NVIDIA (3m / 4-5m)."
        },
        "tags": [
          "form-factors-breakout",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("fo-form-factors_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = FO_FO_FORM_FACTORS_DATA;
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

  for (const card of FO_FO_FORM_FACTORS_DATA) {
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
        localStorage.setItem("fo-form-factors_bookmarks", JSON.stringify([...state.bookmarks]));
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
