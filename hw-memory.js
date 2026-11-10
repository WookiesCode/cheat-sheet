// hw-memory.js
// Standalone interactive cheat sheet for Rack & hardware reference: Memory: Channels, DIMMs per Channel and Speeds
const HWREF_HW_MEMORY_DATA = [
  {
    "id": "memory-cmd-1",
    "badge": "memory",
    "title": "Memory population: Every DIMM slot",
    "subtitle": "Every DIMM slot: populated, size, speed, part and serial",
    "commands": [
      {
        "id": "mem-dmidecode",
        "desc": "Every DIMM slot: populated, size, speed, part and serial",
        "cmd": "dmidecode -t memory | grep -E 'Locator|Size|Speed|Part Number|Serial Number'",
        "details": "",
        "flags": [
          [
            "Locator",
            "The silkscreen slot name, for example DIMM_A1: the physical slot to pull"
          ],
          [
            "Bank Locator",
            "Socket / channel as the BIOS sees it"
          ],
          [
            "Speed vs Configured Memory Speed",
            "What the DIMM supports vs what it runs at now"
          ],
          [
            "Size: No Module Installed",
            "An empty slot"
          ],
          [
            "Serial Number",
            "Goes in the RMA"
          ]
        ],
        "tip": "Compare installed DIMMs with the order: a missing DIMM shows as an empty Locator",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "dimm",
          "dmidecode",
          "locator",
          "serial",
          "memory"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lsmem.1.html",
              "title": "lsmem(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ]
        }
      },
      {
        "id": "mem-dmidecode-sub-1",
        "desc": "How many DIMMs are installed",
        "cmd": "dmidecode -t memory | grep -c 'Size: [0-9]'",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "dimm",
          "dmidecode",
          "locator"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lsmem.1.html",
              "title": "lsmem(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ]
        }
      },
      {
        "id": "mem-dmidecode-sub-2",
        "desc": "Total online memory as Linux sees it",
        "cmd": "lsmem --summary",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "dimm",
          "dmidecode",
          "locator"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lsmem.1.html",
              "title": "lsmem(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ]
        }
      },
      {
        "id": "mem-dmidecode-sub-3",
        "desc": "Memory per NUMA node: unequal nodes mean unbalanced DIMMs",
        "cmd": "numactl --hardware",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "dimm",
          "dmidecode",
          "locator"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lsmem.1.html",
              "title": "lsmem(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "memory-cmd-2",
    "badge": "memory",
    "title": "Memory population: Channels per socket on current CPUs",
    "subtitle": "Channels per socket on current CPUs",
    "commands": [
      {
        "id": "mem-channels",
        "desc": "Channels per socket on current CPUs",
        "cmd": "lscpu | grep -E 'Model name|Socket|NUMA node\\(s\\)'",
        "details": "",
        "flags": [
          [
            "AMD EPYC 9005",
            "12 DDR5 channels per socket, RDIMM up to 6400 MT/s, up to 2 DIMMs per channel (24 per socket)"
          ],
          [
            "Intel Xeon 6900P",
            "12 channels, DDR5-6400 at 1 DPC (5200 at 2 DPC), MRDIMM up to 8800 MT/s"
          ],
          [
            "Intel Xeon 6700P",
            "8 channels, DDR5-6400 at 1 DPC (5200 at 2 DPC), MRDIMM up to 8000 MT/s on some SKUs"
          ],
          [
            "Highest common speed",
            "The system runs every DIMM at the speed the slowest DIMM and the layout allow"
          ],
          [
            "2 DPC",
            "Two DIMMs per channel usually lowers the speed; check the server's memory guide"
          ]
        ],
        "tip": "One DIMM per channel on every channel is usually the fastest layout",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "channels",
          "dpc",
          "epyc",
          "xeon",
          "ddr5",
          "mrdimm"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man1/lscpu.1.html",
              "title": "lscpu(1)"
            },
            {
              "url": "https://en.wikipedia.org/wiki/Granite_Rapids",
              "title": "Granite Rapids (Wikipedia, Xeon 6900P/6700P)"
            }
          ],
          "note": "Corrected 2026-11-09: Xeon 6 DDR5-6400 is at 1 DPC (5200 at 2 DPC). The AMD EPYC 9005 figures and the 'highest common speed' rule could not be checked (AMD, Kingston and HPE pages refused or timed out); use your server's memory population guide."
        }
      }
    ]
  },
  {
    "id": "memory-cmd-3",
    "badge": "memory",
    "title": "Memory population: Balanced population check",
    "subtitle": "Balanced population check",
    "commands": [
      {
        "id": "mem-balance",
        "desc": "Balanced population check",
        "cmd": "dmidecode -t memory | awk -F: '/Size:/{s=$2} /Bank Locator/{print $2 \" ->\" s}' | sort",
        "details": "",
        "flags": [
          [
            "Balanced",
            "Same number and size of DIMMs on every channel and both sockets"
          ],
          [
            "Unbalanced",
            "Works, but bandwidth drops and one NUMA node has less memory"
          ],
          [
            "Mixed part numbers",
            "Avoid: the system falls back to the slowest common timing"
          ],
          [
            "After a swap",
            "Replacement DIMM: same part number, same slot"
          ]
        ],
        "tip": "Check balance after every DIMM replacement",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "balance",
          "numa",
          "population",
          "dimm"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ],
          "note": "Balance guidance is general; the server vendor's population guide is the authority."
        }
      },
      {
        "id": "mem-balance-sub-1",
        "desc": "Memory per NUMA node",
        "cmd": "numactl --hardware | grep size",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "balance",
          "numa",
          "population"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ],
          "note": "Balance guidance is general; the server vendor's population guide is the authority."
        }
      }
    ]
  },
  {
    "id": "memory-cmd-4",
    "badge": "memory",
    "title": "Memory population: Correctable errors per DIMM",
    "subtitle": "Correctable errors per DIMM",
    "commands": [
      {
        "id": "mem-errors",
        "desc": "Correctable errors per DIMM",
        "cmd": "edac-util -v",
        "details": "",
        "flags": [
          [
            "CE",
            "Correctable errors: count them over time"
          ],
          [
            "UE",
            "Uncorrectable errors: the DIMM (or slot) goes on the RMA"
          ],
          [
            "Map to slot",
            "Match the EDAC row/channel to the dmidecode Locator"
          ],
          [
            "BMC SEL",
            "Also check ipmitool sel elist for memory events"
          ]
        ],
        "tip": "The ECC sheet under Server internals goes deeper",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "ecc",
          "edac",
          "errors",
          "rma"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/edac-utils/edac-util.1.en.html",
              "title": "edac-util(1)"
            },
            {
              "url": "https://www.kernel.org/doc/Documentation/ABI/testing/sysfs-devices-edac",
              "title": "Kernel ABI: sysfs-devices-edac"
            }
          ],
          "note": "edac-util reads world-readable sysfs counters, so it doesn't need root (the old sudo was dropped)."
        }
      },
      {
        "id": "mem-errors-sub-1",
        "desc": "EDAC's slot labels",
        "cmd": "grep -r . /sys/devices/system/edac/mc/mc*/dimm*/dimm_label 2>/dev/null",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "ecc",
          "edac",
          "errors"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/edac-utils/edac-util.1.en.html",
              "title": "edac-util(1)"
            },
            {
              "url": "https://www.kernel.org/doc/Documentation/ABI/testing/sysfs-devices-edac",
              "title": "Kernel ABI: sysfs-devices-edac"
            }
          ],
          "note": "edac-util reads world-readable sysfs counters, so it doesn't need root (the old sudo was dropped)."
        }
      }
    ]
  },
  {
    "id": "memory-pro-tips",
    "badge": "tip",
    "title": "Memory population: Pro Tip",
    "subtitle": "Before you reseat or swap a DIMM",
    "commands": [
      {
        "id": "memory-tips-card",
        "desc": "Before you reseat or swap a DIMM",
        "cmd": "dmidecode -t memory > dimms-before.txt",
        "details": "Save the DIMM table, note the slot from the Locator (not the Linux row number), drain the node and get approval to power off. After the swap, save dimms-after.txt and diff: same count, same Configured Memory Speed, and the new serial in the right slot.",
        "flags": [
          [
            "diff dimms-before.txt dimms-after.txt",
            "Proves the swap"
          ],
          [
            "Locator",
            "Physical slot name"
          ]
        ],
        "tip": "Before/after files go in the case folder",
        "tags": [
          "hardware",
          "reference",
          "memory",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("hw-memory_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = HWREF_HW_MEMORY_DATA;
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

  for (const card of HWREF_HW_MEMORY_DATA) {
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
        localStorage.setItem("hw-memory_bookmarks", JSON.stringify([...state.bookmarks]));
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
