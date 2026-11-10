// sw-cumulus-hw.js
// Standalone interactive cheat sheet for Switches: Cumulus NVUE — PSU/Fan Health & Config Rollback
const SW_SW_CUMULUS_HW_DATA = [
  {
    "id": "cumulus-hw-cfg-cmd-1",
    "badge": "psu",
    "title": "Cumulus: PSU, Fans & Config: Inspect switch PSUs, fan RPMs, thermal sensors, and safely diff, apply, or rollback NVUE config revisions",
    "subtitle": "Inspect switch PSUs, fan RPMs, thermal sensors, and safely diff, apply, or rollback NVUE config revisions",
    "commands": [
      {
        "id": "nvue-platform-config",
        "desc": "Inspect switch PSUs, fan RPMs, thermal sensors, and safely diff, apply, or rollback NVUE config revisions",
        "cmd": "nv show platform environment && nv config diff",
        "details": "'nv show platform environment' checks all redundant Power Supply Units (PSUs), fan tray modules, and board/ASIC temperature sensors. In NVUE, 'nv set' stages changes in a candidate revision that you can inspect with 'nv config diff' before committing with 'nv config apply'.",
        "flags": [
          [
            "platform environment",
            "Show status of all PSUs, fan trays, and thermal sensors"
          ],
          [
            "nv config diff",
            "Show differences between the running config and pending candidate changes"
          ],
          [
            "nv config apply",
            "Apply pending candidate configuration and save to startup"
          ],
          [
            "nv config history",
            "List historical configuration commits with timestamps, user, and revision IDs"
          ]
        ],
        "tip": "nv config translate revision <id> exports a revision as nv set commands",
        "tags": [
          "Cumulus: PSU, Fans & Config",
          "switch",
          "nos",
          "cli",
          "triage",
          "cumulus",
          "platform",
          "psu",
          "fan",
          "temperature",
          "config",
          "rollback"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/",
              "title": "NVUE reference: platform"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/System/",
              "title": "NVUE reference: system"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Config-Commands/",
              "title": "NVUE reference: config commands"
            }
          ],
          "note": "Corrected 2026-11-09: there is no nv config rollback (use nv config apply <rev>), and nv config show -o takes only auto/json/yaml/native."
        }
      },
      {
        "id": "nvue-platform-config-sub-1",
        "desc": "Show Cumulus Linux OS version, uptime, switch model, ASIC type, and serial number",
        "cmd": "nv show system && nv show platform hardware",
        "tags": [
          "Cumulus: PSU, Fans & Config",
          "recipe",
          "automation",
          "cli"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/",
              "title": "NVUE reference: platform"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/System/",
              "title": "NVUE reference: system"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Config-Commands/",
              "title": "NVUE reference: config commands"
            }
          ],
          "note": "Corrected 2026-11-09: there is no nv config rollback (use nv config apply <rev>), and nv config show -o takes only auto/json/yaml/native."
        }
      },
      {
        "id": "nvue-platform-config-sub-2",
        "desc": "Go back to a known-good revision (list them with nv config history). nv config apply --confirm rolls back by itself if you do not confirm",
        "cmd": "nv config apply <revision_id> --assume-yes",
        "tags": [
          "Cumulus: PSU, Fans & Config",
          "recipe",
          "automation",
          "cli"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/",
              "title": "NVUE reference: platform"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/System/",
              "title": "NVUE reference: system"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Config-Commands/",
              "title": "NVUE reference: config commands"
            }
          ],
          "note": "Corrected 2026-11-09: there is no nv config rollback (use nv config apply <rev>), and nv config show -o takes only auto/json/yaml/native."
        }
      },
      {
        "id": "nvue-platform-config-sub-3",
        "desc": "Export a revision as flat, copy-pasteable 'nv set ...' commands (Cumulus 5.12 and later)",
        "cmd": "nv config translate revision <revision_id>",
        "tags": [
          "Cumulus: PSU, Fans & Config",
          "recipe",
          "automation",
          "cli"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/",
              "title": "NVUE reference: platform"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/System/",
              "title": "NVUE reference: system"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Config-Commands/",
              "title": "NVUE reference: config commands"
            }
          ],
          "note": "Corrected 2026-11-09: there is no nv config rollback (use nv config apply <rev>), and nv config show -o takes only auto/json/yaml/native."
        }
      }
    ]
  },
  {
    "id": "cumulus-hw-cfg-pro-tips",
    "badge": "tip",
    "title": "Cumulus: PSU, Fans & Config: Pro Tips & Best Practices",
    "subtitle": "Platform Environmental Monitoring & Safe Atomic Configuration",
    "commands": [
      {
        "id": "cumulus-hw-cfg-tips-card",
        "desc": "Platform Environmental Monitoring & Safe Atomic Configuration",
        "cmd": "nv show platform && nv config diff && nv config apply",
        "details": "NVUE features atomic commit semantics. Review configuration changes with `nv config diff` before applying them with `nv config apply`. If a change causes network isolation, go back with `nv config apply <revision_id>` (list revisions with `nv config history`), or use `nv config apply --confirm` so an unconfirmed change rolls itself back.",
        "flags": [
          [
            "nv show platform environment",
            "Check chassis power supplies (PSU1/PSU2 status, wattage), fan RPMs, and ASIC temps"
          ],
          [
            "nv config diff",
            "Display line-by-line unified diff between candidate buffer and active running configuration"
          ],
          [
            "nv config apply",
            "Atomically validate and apply all pending NVUE configuration changes"
          ],
          [
            "nv config apply <revision_id>",
            "Go back to an earlier revision (nv config history lists them)"
          ]
        ],
        "tip": "Inspect fan speeds and PSU redundancy: power supply failures in dense 800G switches cause immediate thermal throttling.",
        "tags": [
          "cumulus-hw-cfg",
          "tips",
          "pro",
          "switches",
          "fabric",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("sw-cumulus-hw_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Switch NOS Command Syntax Highlighting
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
  const allCards = SW_SW_CUMULUS_HW_DATA;
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

  for (const card of SW_SW_CUMULUS_HW_DATA) {
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
        localStorage.setItem("sw-cumulus-hw_bookmarks", JSON.stringify([...state.bookmarks]));
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
