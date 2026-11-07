// hw-power.js
// Standalone interactive cheat sheet for Rack & hardware reference: Power: Cords, PDUs, Circuits and the Power Budget
const HWREF_HW_POWER_DATA = [
  {
    "id": "power-cmd-1",
    "badge": "power",
    "title": "Power & PDUs: Real power draw from the BMC",
    "subtitle": "Real power draw from the BMC (DCMI)",
    "commands": [
      {
        "id": "power-read-bmc",
        "desc": "Real power draw from the BMC (DCMI)",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E dcmi power reading",
        "details": "",
        "flags": [
          [
            "-E",
            "Password from the IPMI_PASSWORD environment variable, not the command line"
          ],
          [
            "Instantaneous / Minimum / Maximum / Average",
            "Watts over the BMC's sampling period"
          ],
          [
            "No DCMI?",
            "Read the PSU input-power sensors instead (next card)"
          ]
        ],
        "tip": "Measure under real load; idle numbers hide the GPU peak",
        "tags": [
          "hardware",
          "reference",
          "power",
          "power",
          "dcmi",
          "watts",
          "psu",
          "budget"
        ]
      }
    ]
  },
  {
    "id": "power-flags-1",
    "badge": "power",
    "title": "Power & PDUs: More options",
    "subtitle": "More options for: Real power draw from the BMC",
    "commands": [
      {
        "id": "power-read-bmc-flags-card",
        "desc": "More options and gotchas for: Real power draw from the BMC",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E dcmi power reading",
        "hideCode": false,
        "flags": [
          [
            "Budget with the maximum",
            "Size circuits from the peak, not the average"
          ]
        ],
        "tags": [
          "hardware",
          "reference",
          "power",
          "flags",
          "options",
          "power",
          "dcmi",
          "watts"
        ]
      }
    ]
  },
  {
    "id": "power-recipes-1",
    "badge": "power",
    "title": "Power & PDUs: Related commands",
    "subtitle": "Related commands for: Real power draw from the BMC",
    "commands": [
      {
        "id": "power-read-bmc-sub-1",
        "desc": "PSU presence, failures and redundancy",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type \"Power Supply\"",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "power",
          "dcmi",
          "watts"
        ]
      },
      {
        "id": "power-read-bmc-sub-2",
        "desc": "Is a power cap set?",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E dcmi power get_limit",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "power",
          "dcmi",
          "watts"
        ]
      },
      {
        "id": "power-read-bmc-sub-3",
        "desc": "Per-GPU draw against its limit",
        "cmd": "nvidia-smi --query-gpu=index,power.draw,power.limit --format=csv",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "power",
          "dcmi",
          "watts"
        ]
      }
    ]
  },
  {
    "id": "power-cmd-2",
    "badge": "power",
    "title": "Power & PDUs: Cord and inlet ratings",
    "subtitle": "Cord and inlet ratings (IEC 60320)",
    "commands": [
      {
        "id": "power-cords",
        "desc": "Cord and inlet ratings (IEC 60320)",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E fru print | grep -iE 'power|psu'",
        "details": "",
        "flags": [
          [
            "C13 / C14",
            "10 A (IEC) / 15 A (UL). The usual server and switch PSU inlet"
          ],
          [
            "C19 / C20",
            "16 A (IEC) / 20 A (UL, with 12 AWG cord). High-power PSUs and PDU outlets"
          ],
          [
            "C14 vs C13",
            "C14 is the inlet (pins, on the PSU); C13 is the cord end"
          ]
        ],
        "tip": "Read the PSU label: input current and connector are printed on it",
        "tags": [
          "hardware",
          "reference",
          "power",
          "c13",
          "c19",
          "iec60320",
          "cord",
          "inlet"
        ]
      }
    ]
  },
  {
    "id": "power-flags-2",
    "badge": "power",
    "title": "Power & PDUs: More options",
    "subtitle": "More options for: Cord and inlet ratings",
    "commands": [
      {
        "id": "power-cords-flags-card",
        "desc": "More options and gotchas for: Cord and inlet ratings",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E fru print | grep -iE 'power|psu'",
        "hideCode": false,
        "flags": [
          [
            "Mixed cords",
            "A C13 cord on a C14-to-C19 adapter is still limited to the C13 rating"
          ],
          [
            "GPU nodes",
            "Multi-kW PSUs are usually C19/C20, or busbar-fed in OCP racks"
          ]
        ],
        "tags": [
          "hardware",
          "reference",
          "power",
          "flags",
          "options",
          "c13",
          "c19",
          "iec60320"
        ]
      }
    ]
  },
  {
    "id": "power-cmd-3",
    "badge": "power",
    "title": "Power & PDUs: Circuit math",
    "subtitle": "Circuit math: the 80% rule and three-phase power",
    "commands": [
      {
        "id": "power-circuit",
        "desc": "Circuit math: the 80% rule and three-phase power",
        "cmd": "awk 'BEGIN{v=415; a=32; pf=0.95; kw=sqrt(3)*v*a*pf/1000; printf \"%.1f kW total, %.1f kW usable at 80%%\\n\", kw, kw*0.8}'",
        "details": "",
        "flags": [
          [
            "NEC 210.20(A)",
            "A continuous load (3 hours or more) needs a breaker rated 125% of it, so load circuits to 80%"
          ],
          [
            "Single-phase",
            "kW = V × A × PF / 1000"
          ],
          [
            "Three-phase",
            "kW = √3 × V(line-to-line) × A × PF / 1000; kVA is the same without PF"
          ]
        ],
        "tip": "Change v and a to your PDU's rating and predict the result before you run it",
        "tags": [
          "hardware",
          "reference",
          "power",
          "nec",
          "80-percent",
          "three-phase",
          "kw",
          "circuit",
          "pdu"
        ]
      }
    ]
  },
  {
    "id": "power-flags-3",
    "badge": "power",
    "title": "Power & PDUs: More options",
    "subtitle": "More options for: Circuit math: the 80% rule and three-phase power",
    "commands": [
      {
        "id": "power-circuit-flags-card",
        "desc": "More options and gotchas for: Circuit math: the 80% rule and three-phase power",
        "cmd": "awk 'BEGIN{v=415; a=32; pf=0.95; kw=sqrt(3)*v*a*pf/1000; printf \"%.1f kW total, %.1f kW usable at 80%%\\n\", kw, kw*0.8}'",
        "hideCode": false,
        "flags": [
          [
            "PF",
            "Power factor: about 0.95-0.99 for modern server PSUs"
          ],
          [
            "100%-rated breakers",
            "An exception exists only when the whole assembly is listed for 100%"
          ]
        ],
        "tags": [
          "hardware",
          "reference",
          "power",
          "flags",
          "options",
          "nec",
          "80-percent",
          "three-phase"
        ]
      }
    ]
  },
  {
    "id": "power-recipes-3",
    "badge": "power",
    "title": "Power & PDUs: Related commands",
    "subtitle": "Related commands for: Circuit math: the 80% rule and three-phase power",
    "commands": [
      {
        "id": "power-circuit-sub-1",
        "desc": "Single-phase 208 V / 30 A circuit",
        "cmd": "awk 'BEGIN{v=208; a=30; printf \"%.1f kW at 80%%\\n\", v*a*0.8/1000}'",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "nec",
          "80-percent",
          "three-phase"
        ]
      }
    ]
  },
  {
    "id": "power-cmd-4",
    "badge": "power",
    "title": "Power & PDUs: PSU redundancy and A/B feeds",
    "subtitle": "PSU redundancy and A/B feeds",
    "commands": [
      {
        "id": "power-redundancy",
        "desc": "PSU redundancy and A/B feeds",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sel elist | grep -iE 'power supply|redundancy|ac lost'",
        "details": "",
        "flags": [
          [
            "A/B feeds",
            "Each PSU on a different PDU fed from a different upstream source"
          ],
          [
            "N+1 / N+N",
            "Spare PSU / a full second set; N+N survives losing a whole feed"
          ],
          [
            "Budget per feed",
            "With N+N, one feed must carry the whole node: size each PDU for it"
          ]
        ],
        "tip": "Swap the cord to a known-good outlet before you RMA a PSU",
        "tags": [
          "hardware",
          "reference",
          "power",
          "redundancy",
          "psu",
          "ab-feed",
          "pdu",
          "ac-lost"
        ]
      }
    ]
  },
  {
    "id": "power-flags-4",
    "badge": "power",
    "title": "Power & PDUs: More options",
    "subtitle": "More options for: PSU redundancy and A/B feeds",
    "commands": [
      {
        "id": "power-redundancy-flags-card",
        "desc": "More options and gotchas for: PSU redundancy and A/B feeds",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sel elist | grep -iE 'power supply|redundancy|ac lost'",
        "hideCode": false,
        "flags": [
          [
            "AC lost",
            "One PSU reporting AC lost: cord, PDU outlet or breaker first, PSU last"
          ]
        ],
        "tags": [
          "hardware",
          "reference",
          "power",
          "flags",
          "options",
          "redundancy",
          "psu",
          "ab-feed"
        ]
      }
    ]
  },
  {
    "id": "power-recipes-4",
    "badge": "power",
    "title": "Power & PDUs: Related commands",
    "subtitle": "Related commands for: PSU redundancy and A/B feeds",
    "commands": [
      {
        "id": "power-redundancy-sub-1",
        "desc": "Which PSU is unhappy",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type \"Power Supply\"",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "redundancy",
          "psu",
          "ab-feed"
        ]
      }
    ]
  },
  {
    "id": "power-pro-tips",
    "badge": "tip",
    "title": "Power & PDUs: Pro Tip",
    "subtitle": "GPU power at the card: the 12V-2x6 connector",
    "commands": [
      {
        "id": "power-tips-card",
        "desc": "GPU power at the card: the 12V-2x6 connector",
        "cmd": "nvidia-smi -q -d POWER",
        "details": "PCIe GPUs such as H200 NVL (up to 600 W) are fed by the 16-pin 12V-2x6 connector (PCIe CEM 5.1, marked H++), rated up to 600 W. Its sense pins only make contact when the plug is fully seated. A half-seated plug is a melting risk: push until it clicks and check that no gap shows. SXM GPUs (H200 SXM up to 700 W) are fed through the HGX baseboard.",
        "flags": [
          [
            "Power Limit / Max Power Limit",
            "What the GPU may draw"
          ],
          [
            "Clocks Event Reasons",
            "Shows when power capping slows the GPU"
          ]
        ],
        "tip": "Reseat 12V-2x6 plugs fully before blaming the GPU",
        "tags": [
          "hardware",
          "reference",
          "power",
          "tips",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("hw-power_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = HWREF_HW_POWER_DATA;
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

  for (const card of HWREF_HW_POWER_DATA) {
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
        localStorage.setItem("hw-power_bookmarks", JSON.stringify([...state.bookmarks]));
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
