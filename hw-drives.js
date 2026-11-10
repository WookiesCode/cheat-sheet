// hw-drives.js
// Standalone interactive cheat sheet for Rack & hardware reference: Drive Form Factors: U.2, U.3 and EDSFF (E1.S, E1.L, E3.S, E3.L)
const HWREF_HW_DRIVES_DATA = [
  {
    "id": "drives-cmd-1",
    "badge": "drives",
    "title": "Drive form factors: Which drives, which transport, which model",
    "subtitle": "Which drives, which transport, which model",
    "commands": [
      {
        "id": "drives-identify",
        "desc": "Which drives, which transport, which model",
        "cmd": "lsblk -d -o NAME,TRAN,MODEL,SIZE,SERIAL",
        "details": "",
        "flags": [
          [
            "TRAN nvme / sas / sata",
            "The protocol the drive is using"
          ],
          [
            "nvme list",
            "NVMe drives with model, serial and firmware"
          ],
          [
            "SERIAL",
            "Match it to the bay label and the RMA"
          ]
        ],
        "tip": "Map serial → bay before you pull anything",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "nvme",
          "lsblk",
          "serial",
          "identify"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man8/lsblk.8.html",
              "title": "lsblk(8)"
            },
            {
              "url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-list.txt",
              "title": "nvme-cli: nvme list"
            },
            {
              "url": "https://manpages.debian.org/trixie/smartmontools/smartctl.8.en.html",
              "title": "smartctl(8)"
            }
          ],
          "note": "smartctl -i shows model, serial and firmware; form factor and rotation rate appear only when the drive reports them."
        }
      },
      {
        "id": "drives-identify-sub-1",
        "desc": "NVMe inventory",
        "cmd": "nvme list",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "recipe",
          "nvme",
          "lsblk",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man8/lsblk.8.html",
              "title": "lsblk(8)"
            },
            {
              "url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-list.txt",
              "title": "nvme-cli: nvme list"
            },
            {
              "url": "https://manpages.debian.org/trixie/smartmontools/smartctl.8.en.html",
              "title": "smartctl(8)"
            }
          ],
          "note": "smartctl -i shows model, serial and firmware; form factor and rotation rate appear only when the drive reports them."
        }
      },
      {
        "id": "drives-identify-sub-2",
        "desc": "Model, form factor and rotation rate for SAS/SATA",
        "cmd": "smartctl -i /dev/sda",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "recipe",
          "nvme",
          "lsblk",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man8/lsblk.8.html",
              "title": "lsblk(8)"
            },
            {
              "url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-list.txt",
              "title": "nvme-cli: nvme list"
            },
            {
              "url": "https://manpages.debian.org/trixie/smartmontools/smartctl.8.en.html",
              "title": "smartctl(8)"
            }
          ],
          "note": "smartctl -i shows model, serial and firmware; form factor and rotation rate appear only when the drive reports them."
        }
      }
    ]
  },
  {
    "id": "drives-cmd-2",
    "badge": "drives",
    "title": "Drive form factors: U.2 vs U.3",
    "subtitle": "U.2 vs U.3 (same connector, different wiring)",
    "commands": [
      {
        "id": "drives-u2u3",
        "desc": "U.2 vs U.3 (same connector, different wiring)",
        "cmd": "lspci -vv -s <bdf> | grep -E 'LnkCap|LnkSta'",
        "details": "",
        "flags": [
          [
            "U.2",
            "2.5\" NVMe on the SFF-8639 connector"
          ],
          [
            "U.3",
            "SFF-TA-1001 (2017): tri-mode bays, one controller for NVMe, SAS and SATA"
          ],
          [
            "U.3 drive in a U.2 bay",
            "Works: U.3 drives must be backward-compatible with U.2 hosts"
          ],
          [
            "U.2 drive in a U.3 host",
            "Not compatible: U.3 moved the PCIe lanes"
          ],
          [
            "Same plug ≠ works",
            "The backplane and controller must support the protocol too"
          ]
        ],
        "tip": "Check the backplane's spec before ordering spares",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "u.2",
          "u.3",
          "sff-8639",
          "tri-mode",
          "backplane"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://en.wikipedia.org/wiki/U.2",
              "title": "U.2 / U.3 (Wikipedia)"
            },
            {
              "url": "https://www.snia.org/technology-communities/sff/specifications?items_per_page=All",
              "title": "SNIA SFF specifications (SFF-TA-1001)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/lspci.8.html",
              "title": "lspci(8)"
            }
          ],
          "note": "SNIA lists SFF-TA-1001 as the Universal x4 Link Definition for SFF-8639 (1.1, 2018); the U.2/U.3 compatibility rule is from Wikipedia's summary."
        }
      },
      {
        "id": "drives-u2u3-sub-1",
        "desc": "Which controller and path each NVMe drive is on",
        "cmd": "nvme list -v",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "recipe",
          "u.2",
          "u.3",
          "sff-8639"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://en.wikipedia.org/wiki/U.2",
              "title": "U.2 / U.3 (Wikipedia)"
            },
            {
              "url": "https://www.snia.org/technology-communities/sff/specifications?items_per_page=All",
              "title": "SNIA SFF specifications (SFF-TA-1001)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/lspci.8.html",
              "title": "lspci(8)"
            }
          ],
          "note": "SNIA lists SFF-TA-1001 as the Universal x4 Link Definition for SFF-8639 (1.1, 2018); the U.2/U.3 compatibility rule is from Wikipedia's summary."
        }
      }
    ]
  },
  {
    "id": "drives-cmd-3",
    "badge": "drives",
    "title": "Drive form factors: EDSFF sizes",
    "subtitle": "EDSFF sizes (SNIA)",
    "commands": [
      {
        "id": "drives-edsff",
        "desc": "EDSFF sizes (SNIA)",
        "cmd": "nvme id-ctrl /dev/nvme0 | grep -E '^(mn|sn|fr) '",
        "details": "",
        "flags": [
          [
            "E1.S",
            "SFF-TA-1006. 31.5-33.75 mm wide, about 111-119 mm long, thickness 5.9, 8.01, 9.5, 15 or 25 mm. Up to 20 W and x8 in the 9.5 mm symmetric enclosure"
          ],
          [
            "E1.L",
            "SFF-TA-1007. 38.4 mm × 318.75 mm, 9.5 or 18 mm thick: long ruler for density"
          ],
          [
            "E3.S / E3.L",
            "SFF-TA-1008. 76 mm tall, 112.75 mm (S) or 142.2 mm (L) long, 7.5 mm or 16.8 mm (2T). Up to 70 W"
          ],
          [
            "Connector",
            "SFF-TA-1002 edge connector across the family"
          ],
          [
            "Thickness matters",
            "A 15 mm E1.S does not fit a 9.5 mm bay"
          ]
        ],
        "tip": "Order spares by form factor and thickness, not just capacity",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "edsff",
          "e1.s",
          "e3.s",
          "e1.l",
          "ruler"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.snia.org/forums/cmsi/knowledge/formfactors",
              "title": "SNIA: SSD form factors (EDSFF)"
            },
            {
              "url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-id-ctrl.txt",
              "title": "nvme-cli: id-ctrl"
            }
          ],
          "note": "The mn/sn/fr field names are nvme-cli output, not listed in its man page."
        }
      }
    ]
  },
  {
    "id": "drives-cmd-4",
    "badge": "drives",
    "title": "Drive form factors: Is the NVMe link at full width and speed?",
    "subtitle": "Is the NVMe link at full width and speed?",
    "commands": [
      {
        "id": "drives-link",
        "desc": "Is the NVMe link at full width and speed?",
        "cmd": "for d in /sys/class/nvme/nvme*; do echo \"$(basename $d): $(cat $d/device/current_link_width)x @ $(cat $d/device/current_link_speed)\"; done",
        "details": "",
        "flags": [
          [
            "current_link_width",
            "Expect 4 for U.2/U.3 and most E1.S/E3.S"
          ],
          [
            "current_link_speed",
            "32.0 GT/s = PCIe 5, 16.0 GT/s = PCIe 4"
          ],
          [
            "max_link_width / max_link_speed",
            "What it should be"
          ],
          [
            "Degraded",
            "x2 or a lower speed: reseat the drive, then check the backplane cable"
          ]
        ],
        "tip": "A degraded link is a physical problem until proven otherwise",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "pcie",
          "link",
          "width",
          "speed",
          "degraded"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "current_link_width/_speed and max_link_* exist in PCI device sysfs (seen on a live system) but are not in the kernel ABI docs."
        }
      }
    ]
  },
  {
    "id": "drives-pro-tips",
    "badge": "tip",
    "title": "Drive form factors: Pro Tip",
    "subtitle": "Find the bay before you pull",
    "commands": [
      {
        "id": "drives-tips-card",
        "desc": "Find the bay before you pull",
        "cmd": "ledctl --listed-only locate=/dev/nvme0n1",
        "details": "Light the bay LED (ledctl --listed-only locate=..., then locate_off=... to switch it off; without --listed-only ledctl turns off every other drive's LEDs, fault LEDs included) and match the serial on the drive label before pulling. The storage playbook (docs/playbooks/storage-jbod.md) covers SES slot mapping for JBODs.",
        "flags": [
          [
            "locate_off=",
            "Turn the LED off again"
          ],
          [
            "Serial",
            "Always match it before pulling"
          ]
        ],
        "tip": "Wrong-drive pulls in a degraded array lose data",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/ledmon/ledctl.8.en.html",
              "title": "ledctl(8) (ledmon 0.97)"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("hw-drives_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = HWREF_HW_DRIVES_DATA;
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

  for (const card of HWREF_HW_DRIVES_DATA) {
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
        localStorage.setItem("hw-drives_bookmarks", JSON.stringify([...state.bookmarks]));
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
