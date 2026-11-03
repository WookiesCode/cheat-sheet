// rf-power-boot.js
// Standalone interactive cheat sheet for Redfish: Chassis Power Control & Boot Overrides
const RF_RF_POWER_BOOT_DATA = [
  {
    "id": "power-boot-cmd-1",
    "badge": "pwr",
    "title": "Power & Boot: Check current server power state or execute `ComputerSystem",
    "subtitle": "Check current server power state or execute `ComputerSystem.Reset` (On, ForceOff, ForceRestart, PowerCycle)",
    "commands": [
      {
        "id": "rf-power-state-reset",
        "desc": "Check current server power state or execute `ComputerSystem.Reset` (On, ForceOff, ForceRestart, PowerCycle)",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc -X POST \"https://[$BMC]/redfish/v1/Systems/1/Actions/ComputerSystem.Reset\" -H \"Content-Type: application/json\" -d '{\"ResetType\": \"PowerCycle\"}'",
        "details": "",
        "flags": [
          [
            "PowerCycle",
            "Cold DC power off followed by power on"
          ],
          [
            "ForceRestart / GracefulRestart",
            "Immediate warm reset vs ACPI OS reboot"
          ],
          [
            "ResetType@Redfish.AllowableValues",
            "Inspect Actions.#ComputerSystem.Reset in GET /Systems/1 to see supported ResetTypes"
          ]
        ],
        "tip": "",
        "tags": [
          "Power & Boot",
          "redfish",
          "rest",
          "api",
          "bmc",
          "power",
          "reset",
          "reboot",
          "powercycle",
          "forceoff",
          "on"
        ]
      }
    ]
  },
  {
    "id": "power-boot-cmd-2",
    "badge": "pwr",
    "title": "Power & Boot: Set one-time UEFI PXE network boot on next restart",
    "subtitle": "Set one-time UEFI PXE network boot on next restart (`BootSourceOverrideTarget: Pxe`)",
    "commands": [
      {
        "id": "rf-boot-override-pxe",
        "desc": "Set one-time UEFI PXE network boot on next restart (`BootSourceOverrideTarget: Pxe`)",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc -X PATCH \"https://[$BMC]/redfish/v1/Systems/1\" -H \"Content-Type: application/json\" -d '{\"Boot\": {\"BootSourceOverrideTarget\": \"Pxe\", \"BootSourceOverrideEnabled\": \"Once\", \"BootSourceOverrideMode\": \"UEFI\"}}'",
        "details": "",
        "flags": [
          [
            "BootSourceOverrideEnabled",
            "'Once' (single reboot), 'Continuous' (permanent), or 'Disabled'"
          ],
          [
            "BootSourceOverrideTarget",
            "'Pxe', 'BiosSetup', 'Cd', 'Hdd', 'UefiHttp', 'UefiShell', 'None'"
          ]
        ],
        "tip": "Follow with ForceRestart",
        "tags": [
          "Power & Boot",
          "redfish",
          "rest",
          "api",
          "bmc",
          "pxe",
          "boot",
          "uefi",
          "override",
          "once",
          "network"
        ]
      }
    ]
  },
  {
    "id": "power-boot-cmd-3",
    "badge": "pwr",
    "title": "Power & Boot: Force server to boot directly into UEFI/BIOS Setup utility on next reboot",
    "subtitle": "Force server to boot directly into UEFI/BIOS Setup utility on next reboot",
    "commands": [
      {
        "id": "rf-boot-into-bios",
        "desc": "Force server to boot directly into UEFI/BIOS Setup utility on next reboot",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc -X PATCH \"https://[$BMC]/redfish/v1/Systems/1\" -H \"Content-Type: application/json\" -d '{\"Boot\": {\"BootSourceOverrideTarget\": \"BiosSetup\", \"BootSourceOverrideEnabled\": \"Once\"}}'",
        "details": "",
        "flags": [
          [
            "BiosSetup",
            "Enters BIOS setup automatically on next boot (viewable via SOL or HTML5 KVM)"
          ]
        ],
        "tip": "",
        "tags": [
          "Power & Boot",
          "redfish",
          "rest",
          "api",
          "bmc",
          "bios",
          "setup",
          "boot",
          "uefi"
        ]
      }
    ]
  },
  {
    "id": "power-boot-cmd-4",
    "badge": "pwr",
    "title": "Power & Boot: Send diagnostic Non-Maskable Interrupt",
    "subtitle": "Send diagnostic Non-Maskable Interrupt (`Nmi`) to hung OS to trigger kernel kdump crash dump",
    "commands": [
      {
        "id": "rf-trigger-nmi",
        "desc": "Send diagnostic Non-Maskable Interrupt (`Nmi`) to hung OS to trigger kernel kdump crash dump",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc -X POST \"https://[$BMC]/redfish/v1/Systems/1/Actions/ComputerSystem.Reset\" -H \"Content-Type: application/json\" -d '{\"ResetType\": \"Nmi\"}'",
        "details": "",
        "flags": [
          [
            "Nmi",
            "Triggers kernel panic/kdump when Linux kernel is hard-locked (`kernel.unknown_nmi_panic=1`)"
          ]
        ],
        "tip": "",
        "tags": [
          "Power & Boot",
          "redfish",
          "rest",
          "api",
          "bmc",
          "nmi",
          "kdump",
          "crash",
          "hang",
          "panic",
          "diagnostic"
        ]
      }
    ]
  },
  {
    "id": "power-boot-pro-tips",
    "badge": "tip",
    "title": "Power & Boot: Pro Tips & Best Practices",
    "subtitle": "Chassis Power State Triage & Boot Target Verification",
    "commands": [
      {
        "id": "power-boot-tips-card",
        "desc": "Chassis Power State Triage & Boot Target Verification",
        "cmd": "curl -k -sS -K ~/.bmc-curlrc -X POST \"https://${BMC_IP}/redfish/v1/Systems/1/Actions/ComputerSystem.Reset\" -d '{\"ResetType\":\"GracefulRestart\"}'",
        "details": "Use GracefulShutdown or GracefulRestart to give the OS time to sync buffers and unmount filesystems cleanly. If the host kernel is frozen or panicked, fall back to ForceRestart or send an NMI to trigger a kdump kernel crash dump.",
        "flags": [
          [
            "GracefulRestart",
            "ACPI clean OS shutdown and reboot; allows daemons and disk caches to flush"
          ],
          [
            "ForceRestart",
            "Immediate hard chassis reset without OS coordination (simulates front power button 4s hold)"
          ],
          [
            "Nmi",
            "Diagnostic interrupt injection that triggers Linux kernel sysrq crash/kdump"
          ]
        ],
        "tip": "BootSourceOverrideTarget settings like Pxe or BiosSetup only apply for the immediate next boot cycle when BootSourceOverrideEnabled is set to \"Once\".",
        "tags": [
          "power-boot",
          "tips",
          "pro",
          "redfish",
          "rest",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("rf-power-boot_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Redfish REST & curl Syntax Highlighting
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
  const allCards = RF_RF_POWER_BOOT_DATA;
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

  for (const card of RF_RF_POWER_BOOT_DATA) {
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
        localStorage.setItem("rf-power-boot_bookmarks", JSON.stringify([...state.bookmarks]));
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
