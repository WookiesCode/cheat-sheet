// mb-gigabyte-servers.js
// Standalone interactive cheat sheet for Motherboards: GIGABYTE Server Boards (GSM / AST2600 BMC, Dual-BIOS & Jumpers)
const MB_MB_GIGABYTE_SERVERS_DATA = [
  {
    "id": "gigabyte-server-board-cmd-1",
    "badge": "giga",
    "title": "GIGABYTE Server Boards: Query GIGABYTE Server Management",
    "subtitle": "Query GIGABYTE Server Management (GSM / MegaRAC) BMC POST Snooping code over IPv6 Redfish or IPMI",
    "commands": [
      {
        "id": "gigabyte-bmc-post-snooping",
        "desc": "Query GIGABYTE Server Management (GSM / MegaRAC) BMC POST Snooping code over IPv6 Redfish or IPMI",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/Systems/Self\" | jq '{PowerState, BootProgress}'",
        "details": "",
        "flags": [
          [
            "Web UI POST codes",
            "The BMC web UI keeps the POST codes of the current and previous boot (menu names vary by firmware)"
          ],
          [
            "Redfish BootProgress",
            "Standard Redfish field with the current boot stage (see the command above)"
          ],
          [
            "Default GIGABYTE BMC Login",
            "Shipped before March 2020: admin / password. Later boards: a unique password, the last 11 characters of the serial number on the board's sticker"
          ]
        ],
        "tip": "Newer GIGABYTE boards: the default BMC password is on the serial-number sticker",
        "tags": [
          "GIGABYTE Server Boards",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "gigabyte",
          "gsm",
          "bmc",
          "post",
          "snooping",
          "redfish",
          "ipv6",
          "mz73",
          "ms73",
          "g492"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.gigabyte.com/Support/Security/1762",
              "title": "GIGABYTE: BMC unique pre-programmed password"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.v1_22_0.json",
              "title": "DMTF Redfish ComputerSystem schema (BootProgress)"
            }
          ],
          "note": "Corrected 2026-11-10: GIGABYTE says the unique password is the last 11 characters of the serial (was 8); removed an unsourced raw IPMI command."
        }
      }
    ]
  },
  {
    "id": "gigabyte-server-board-cmd-2",
    "badge": "giga",
    "title": "GIGABYTE Server Boards: GIGABYTE server motherboard status LEDs",
    "subtitle": "GIGABYTE server motherboard status LEDs (`BMC_RDY`, `CPU_ERR`), Dual-BIOS switches & CMOS jumpers",
    "commands": [
      {
        "id": "gigabyte-leds-switches-jumpers",
        "desc": "GIGABYTE server motherboard status LEDs (`BMC_RDY`, `CPU_ERR`), Dual-BIOS switches & CMOS jumpers",
        "cmd": "BMC_RDY LED (Blinking Green)   |   SW_BIOS / BIOS_SW (Dual-BIOS ROM Select)   |   CLR_CMOS (Pins 1-2 Short)",
        "details": "",
        "flags": [
          [
            "BMC_RDY LED",
            "Blinks when the BMC has finished booting; on many models the power button waits for it"
          ],
          [
            "BIOS_SW / BIOS_SEL",
            "Switch or jumper selecting the primary or backup BIOS flash chip (the name varies by board)"
          ],
          [
            "CLR_CMOS",
            "Clear CMOS with standby power removed (positions and timing in the board manual)"
          ],
          [
            "SYS_ERR / ID_LED",
            "Blue UID (identify) LED and amber system-fault LED"
          ]
        ],
        "tip": "If a GIGABYTE board won't POST after a failed BIOS flash, flip SW_BIOS to the backup ROM!",
        "tags": [
          "GIGABYTE Server Boards",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "gigabyte",
          "bmc_rdy",
          "sw_bios",
          "dual-bios",
          "clr_cmos",
          "jumper",
          "dip-switch"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [],
          "note": "Board-specific (LED names, jumper positions, menu paths): check this board's manual; not confirmed against a vendor document here."
        }
      }
    ]
  },
  {
    "id": "gigabyte-server-board-pro-tips",
    "badge": "tip",
    "title": "GIGABYTE Server Boards: Pro Tips & Best Practices",
    "subtitle": "GIGABYTE Dual-BIOS Switching & Remote Port 0x80 Snooping",
    "commands": [
      {
        "id": "gigabyte-server-board-tips-card",
        "desc": "GIGABYTE Dual-BIOS Switching & Remote Port 0x80 Snooping",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E sel elist",
        "details": "GIGABYTE server motherboards (MZ, MD, MS, R-series) utilize an ASPEED AST2500/AST2600 BMC with hardware port 0x80 LPC snooping. If the primary SPI flash chip becomes corrupted, toggle the Dual-BIOS switch (BIOS_SEL) to boot from the redundant secondary SPI ROM.",
        "flags": [
          [
            "BIOS_SEL Switch",
            "Hardware slide switch to manually select Primary vs Secondary SPI BIOS ROM"
          ],
          [
            "BMC_RDY LED",
            "Blinks green at 1Hz when ASPEED BMC firmware has successfully completed Linux boot"
          ],
          [
            "CPU_ERR LED",
            "Amber illumination indicates CPU socket VRM failure, missing VDD, or thermal shutdown"
          ]
        ],
        "tip": "If BMC_RDY LED is solid amber or off, BMC power rail or SPI flash is unpowered; verify standby 3.3V rail.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool",
              "title": "ipmitool"
            },
            {
              "url": "https://www.gigabyte.com/Support/Security/1762",
              "title": "GIGABYTE: BMC unique pre-programmed password"
            }
          ],
          "note": "Corrected 2026-11-10: replaced an unsourced raw IPMI command with the standard SEL listing. LED and switch names are board-specific."
        },
        "tags": [
          "gigabyte-server-board",
          "tips",
          "pro",
          "motherboard",
          "post",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("mb-gigabyte-servers_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Motherboard CLI / POST Syntax Highlighting
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
  const allCards = MB_MB_GIGABYTE_SERVERS_DATA;
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

  for (const card of MB_MB_GIGABYTE_SERVERS_DATA) {
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
        localStorage.setItem("mb-gigabyte-servers_bookmarks", JSON.stringify([...state.bookmarks]));
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
