// hw-rack.js
// Standalone interactive cheat sheet for Rack & hardware reference: Racks and Labelling: Rack Units, Open Rack and TIA-606
const HWREF_HW_RACK_DATA = [
  {
    "id": "rack-cmd-1",
    "badge": "rack",
    "title": "Racks & labelling: Who is this server? Serial, model and asset tag",
    "subtitle": "Who is this server? Serial, model and asset tag",
    "commands": [
      {
        "id": "rack-identity",
        "desc": "Who is this server? Serial, model and asset tag",
        "cmd": "dmidecode -s system-serial-number; dmidecode -s system-product-name",
        "details": "",
        "flags": [
          [
            "system-serial-number",
            "Service tag / serial: the RMA key"
          ],
          [
            "system-product-name",
            "Model"
          ],
          [
            "chassis-asset-tag",
            "Your asset tag, if set"
          ],
          [
            "ipmitool fru print 0",
            "Same data through the BMC, even with the OS down"
          ]
        ],
        "tip": "Blink the ID LED before you touch a server in a full rack",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "serial",
          "asset",
          "identify",
          "fru",
          "dmidecode"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_fru.c",
              "title": "ipmitool source: fru print [fru id]"
            }
          ],
          "note": "fru print [fru id] is in ipmitool's source usage text; the man page shows fru print without an ID. chassis identify takes seconds (default 15, 0 = off, force = on)."
        }
      },
      {
        "id": "rack-identity-sub-1",
        "desc": "FRU through the BMC",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E fru print 0",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "recipe",
          "serial",
          "asset",
          "identify"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_fru.c",
              "title": "ipmitool source: fru print [fru id]"
            }
          ],
          "note": "fru print [fru id] is in ipmitool's source usage text; the man page shows fru print without an ID. chassis identify takes seconds (default 15, 0 = off, force = on)."
        }
      },
      {
        "id": "rack-identity-sub-2",
        "desc": "Blink the ID LED for 60 s to find it in the row",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E chassis identify 60",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "recipe",
          "serial",
          "asset",
          "identify"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_fru.c",
              "title": "ipmitool source: fru print [fru id]"
            }
          ],
          "note": "fru print [fru id] is in ipmitool's source usage text; the man page shows fru print without an ID. chassis identify takes seconds (default 15, 0 = off, force = on)."
        }
      }
    ]
  },
  {
    "id": "rack-cmd-2",
    "badge": "rack",
    "title": "Racks & labelling: Rack units and rack types",
    "subtitle": "Rack units and rack types",
    "commands": [
      {
        "id": "rack-units",
        "desc": "Rack units and rack types",
        "cmd": "awk 'BEGIN{u=42; printf \"%dU = %.1f mm = %.2f in\\n\", u, u*44.45, u*1.75}'",
        "details": "",
        "flags": [
          [
            "1U",
            "1.75 in = 44.45 mm (EIA-310)"
          ],
          [
            "19-inch rack",
            "Mounting holes 465.14 mm apart, centre to centre"
          ],
          [
            "42U",
            "The common full-height rack"
          ],
          [
            "OCP Open Rack V3",
            "21-inch bay; supports 48 mm OpenU and 44.45 mm EIA units; 48 V busbar power"
          ],
          [
            "Busbar",
            "ORv3 gear takes power from the rear busbar, not PDU cords"
          ]
        ],
        "tip": "Count U from the bottom, the way the rack's numbering does",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "rack-unit",
          "eia-310",
          "ocp",
          "open-rack",
          "busbar"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://en.wikipedia.org/wiki/Rack_unit",
              "title": "Rack unit (Wikipedia, EIA-310)"
            },
            {
              "url": "https://www.opencompute.org/documents/open-rack-base-specification-version-3-pdf/",
              "title": "OCP Open Rack V3 base specification"
            },
            {
              "url": "https://www.opencompute.org/wiki/Rack_&_Power",
              "title": "OCP Rack & Power"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "rack-cmd-3",
    "badge": "rack",
    "title": "Racks & labelling: A labelling scheme",
    "subtitle": "A labelling scheme (TIA-606-D)",
    "commands": [
      {
        "id": "rack-labels",
        "desc": "A labelling scheme (TIA-606-D)",
        "cmd": "printf '%s\\n' 'DC1-R12-U24' 'DC1-R12-U24-PSU1->PDU-R12-A-07' 'DC1-R12-U24-ib0->SW-R12-01:p17'",
        "details": "",
        "flags": [
          [
            "ANSI/TIA-606-D",
            "Current edition (Oct 2021) of the telecom administration (labelling) standard"
          ],
          [
            "Classes 1-4",
            "Scaled to complexity: a single room up to a multi-site campus"
          ],
          [
            "Both ends",
            "Every cable labelled at both ends with both endpoints"
          ],
          [
            "Site-Row/Rack-U",
            "A sortable, unique ID for every position"
          ]
        ],
        "tip": "If the label and the CMDB disagree, trust neither until you trace the cable",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "labels",
          "tia-606",
          "cabling",
          "cmdb"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "ANSI/TIA-606-D is sold, not published openly, so its date and class definitions are not checked here. The label format is an example."
        }
      }
    ]
  },
  {
    "id": "rack-pro-tips",
    "badge": "tip",
    "title": "Racks & labelling: Pro Tip",
    "subtitle": "Physical location in the case notes",
    "commands": [
      {
        "id": "rack-tips-card",
        "desc": "Physical location in the case notes",
        "cmd": "echo \"$(hostname) serial=$(dmidecode -s system-serial-number) rack=<row-rack> U=<u>\"",
        "details": "Record logical and physical identity together in every case: hostname, serial, BMC address, row/rack/U, and the PDU outlets for each PSU. Field notes on the home page keep them per server.",
        "flags": [
          [
            "Serial + location",
            "Everything an on-site tech needs"
          ],
          [
            "PDU outlets",
            "Per PSU"
          ]
        ],
        "tip": "Replace the placeholders before you run it",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            }
          ]
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("hw-rack_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Command Syntax Highlighting
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
  const allCards = HWREF_HW_RACK_DATA;
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

  for (const card of HWREF_HW_RACK_DATA) {
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

      const codeBoxHtml = cmd.diagram
        ? window.CheatSheetCommon.renderDiagram(cmd.diagram)
        : cmd.hideCode ? "" : [
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <span class="copy-hint">Copy</span>',
        '  </div>'
      ].join("\n");

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
        '  ' + codeBoxHtml,
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
        localStorage.setItem("hw-rack_bookmarks", JSON.stringify([...state.bookmarks]));
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
