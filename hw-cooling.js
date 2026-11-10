// hw-cooling.js
// Standalone interactive cheat sheet for Rack & hardware reference: Cooling: Inlet Temperatures, Fans and Liquid Cooling
const HWREF_HW_COOLING_DATA = [
  {
    "id": "cooling-cmd-1",
    "badge": "cooling",
    "title": "Cooling: Inlet and component temperatures from the BMC",
    "subtitle": "Inlet and component temperatures from the BMC",
    "commands": [
      {
        "id": "cooling-inlet",
        "desc": "Inlet and component temperatures from the BMC",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type Temperature",
        "details": "",
        "flags": [
          [
            "Inlet / Ambient",
            "The air entering the server: compare it with ASHRAE"
          ],
          [
            "Recommended 18-27 °C",
            "ASHRAE recommended inlet range, classes A1-A4"
          ],
          [
            "A1 allowable 15-32 °C",
            "Wider range the hardware tolerates; A2-A4 allow more"
          ],
          [
            "Exhaust",
            "Usually 10-20 °C above inlet; a small difference with high fan speed points to blocked airflow"
          ]
        ],
        "tip": "One hot node in a cold row is a node problem; a whole hot rack is a room problem",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "temperature",
          "inlet",
          "ashrae",
          "sensors",
          "airflow"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://manpages.debian.org/trixie/lm-sensors/sensors.1.en.html",
              "title": "sensors(1)"
            }
          ],
          "note": "The ASHRAE TC 9.9 ranges (recommended 18-27 °C, A1 allowable 15-32 °C) could not be checked: ASHRAE's reference card is not freely fetchable. The exhaust delta is a rule of thumb."
        }
      },
      {
        "id": "cooling-inlet-sub-1",
        "desc": "Fan speeds and failed fans",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type Fan",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "recipe",
          "temperature",
          "inlet",
          "ashrae"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://manpages.debian.org/trixie/lm-sensors/sensors.1.en.html",
              "title": "sensors(1)"
            }
          ],
          "note": "The ASHRAE TC 9.9 ranges (recommended 18-27 °C, A1 allowable 15-32 °C) could not be checked: ASHRAE's reference card is not freely fetchable. The exhaust delta is a rule of thumb."
        }
      },
      {
        "id": "cooling-inlet-sub-2",
        "desc": "On the host: CPU and board temperatures (lm-sensors)",
        "cmd": "sensors",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "recipe",
          "temperature",
          "inlet",
          "ashrae"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://manpages.debian.org/trixie/lm-sensors/sensors.1.en.html",
              "title": "sensors(1)"
            }
          ],
          "note": "The ASHRAE TC 9.9 ranges (recommended 18-27 °C, A1 allowable 15-32 °C) could not be checked: ASHRAE's reference card is not freely fetchable. The exhaust delta is a rule of thumb."
        }
      }
    ]
  },
  {
    "id": "cooling-cmd-2",
    "badge": "cooling",
    "title": "Cooling: GPU temperatures and thermal slowdown",
    "subtitle": "GPU temperatures and thermal slowdown",
    "commands": [
      {
        "id": "cooling-gpu",
        "desc": "GPU temperatures and thermal slowdown",
        "cmd": "nvidia-smi --query-gpu=index,temperature.gpu,temperature.memory,power.draw,clocks_event_reasons.active --format=csv",
        "details": "",
        "flags": [
          [
            "temperature.gpu / temperature.memory",
            "Core and HBM temperatures"
          ],
          [
            "clocks_event_reasons.active",
            "Non-zero bits show why clocks dropped (thermal or power)"
          ],
          [
            "nvidia-smi -q -d TEMPERATURE",
            "Slowdown and shutdown thresholds for this GPU"
          ],
          [
            "One GPU hot",
            "Check its slot: airflow, blank panels, cold plate or fan module"
          ]
        ],
        "tip": "Compare the hot GPU with its neighbours in the same chassis",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "gpu",
          "temperature",
          "throttle",
          "hbm",
          "thermal"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "--query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      },
      {
        "id": "cooling-gpu-sub-1",
        "desc": "Thresholds per GPU",
        "cmd": "nvidia-smi -q -d TEMPERATURE",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "recipe",
          "gpu",
          "temperature",
          "throttle"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "--query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      },
      {
        "id": "cooling-gpu-sub-2",
        "desc": "Clock event reasons in words",
        "cmd": "nvidia-smi -q -d PERFORMANCE",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "recipe",
          "gpu",
          "temperature",
          "throttle"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "--query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      }
    ]
  },
  {
    "id": "cooling-cmd-3",
    "badge": "cooling",
    "title": "Cooling: Airflow checklist",
    "subtitle": "Airflow checklist (physical)",
    "commands": [
      {
        "id": "cooling-airflow",
        "desc": "Airflow checklist (physical)",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sel elist | grep -iE 'fan|temp'",
        "details": "",
        "flags": [
          [
            "Blanking panels",
            "Every empty U in the rack, or hot exhaust loops back to the front"
          ],
          [
            "Front-to-back",
            "All gear in a row pointing the same way (switches can be reversed)"
          ],
          [
            "Cable bundles",
            "Behind the fans, they choke exhaust"
          ],
          [
            "Fan module",
            "Reseat a fan that reads 0 RPM before replacing it"
          ],
          [
            "Hot aisle / cold aisle",
            "Containment doors closed"
          ]
        ],
        "tip": "Fix airflow before you change fan settings",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "airflow",
          "fans",
          "blanking",
          "physical"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            }
          ],
          "note": "The checklist is field practice, not from a standard."
        }
      }
    ]
  },
  {
    "id": "cooling-cmd-4",
    "badge": "cooling",
    "title": "Cooling: Liquid cooling",
    "subtitle": "Liquid cooling: ASHRAE W classes",
    "commands": [
      {
        "id": "cooling-liquid",
        "desc": "Liquid cooling: ASHRAE W classes",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr elist | grep -iE 'coolant|leak|flow|pump'",
        "details": "",
        "flags": [
          [
            "W17 / W27 / W32 / W40 / W45",
            "Facility supply-water temperature limits in °C (ASHRAE 5th ed., 2021)"
          ],
          [
            "W+",
            "Supply water above 45 °C"
          ],
          [
            "Rack-scale liquid",
            "GB200 / GB300 NVL72 racks are liquid-cooled"
          ],
          [
            "Leak sensors",
            "Treat any leak event as critical: stop and escalate"
          ],
          [
            "Sensor names",
            "Coolant, flow and leak sensors are vendor-specific: grep broadly"
          ]
        ],
        "tip": "Never open a liquid loop without the facility team",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "liquid",
          "w-class",
          "coolant",
          "leak",
          "nvl72"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
              "title": "NVIDIA GB200 NVL72"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/gb300-nvl72/",
              "title": "NVIDIA GB300 NVL72"
            }
          ],
          "note": "The ASHRAE W classes (W17-W45, W+) could not be checked: ASHRAE's pages refuse automated fetches."
        }
      }
    ]
  },
  {
    "id": "cooling-pro-tips",
    "badge": "tip",
    "title": "Cooling: Pro Tip",
    "subtitle": "Room vs node: a quick test",
    "commands": [
      {
        "id": "cooling-tips-card",
        "desc": "Room vs node: a quick test",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type Temperature | grep -i inlet",
        "details": "Read the inlet sensor on the hot node and on two neighbours above and below it. Same inlet everywhere and only one node hot → that node (fans, heatsink, cold plate). Inlet high on all of them → the room or the rack (blanking, containment, CRAH). Put the numbers in the case.",
        "flags": [
          [
            "Neighbours",
            "Same rack, nodes above and below"
          ],
          [
            "Record",
            "Time, inlet, exhaust, fan RPM"
          ]
        ],
        "tip": "Numbers from neighbours settle the argument quickly",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("hw-cooling_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = HWREF_HW_COOLING_DATA;
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

  for (const card of HWREF_HW_COOLING_DATA) {
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
        localStorage.setItem("hw-cooling_bookmarks", JSON.stringify([...state.bookmarks]));
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
