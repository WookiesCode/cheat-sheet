// macos-system-admin.js
// Standalone interactive cheat sheet for macOS: System Defaults, Launchd, Power & Hardware
const MACOS_SYSTEM_ADMIN_DATA = [
  {
    "id": "system-admin-card-1",
    "badge": "sys",
    "title": "System Defaults: Prevent Sleep (caffeinate) & Power Config",
    "subtitle": "Prevent Mac from sleeping during long tasks or inspect battery & sleep assertions",
    "commands": [
      {
        "id": "caffeinate-pmset",
        "mode": "DARWIN CLI",
        "modeClass": "mode-i",
        "desc": "Prevent Mac from sleeping during long tasks or inspect battery & sleep assertions",
        "cmd": "caffeinate -dimsu   |   caffeinate -i make -j8   |   pmset -g batt   |   pmset -g assertions",
        "flags": [
          [
            "caffeinate -dimsu",
            "Prevent display (-d), idle (-i), disk (-m), system (-s) sleep while running"
          ],
          [
            "caffeinate -t 3600",
            "Keep Mac awake for 1 hour (3600 seconds)"
          ],
          [
            "pmset -g batt",
            "Show battery percentage, cycle status, and power draw"
          ],
          [
            "pmset -g assertions",
            "List processes currently blocking display or system sleep"
          ]
        ],
        "tip": "Wrap long builds in caffeinate",
        "tags": [
          "sleep",
          "awake",
          "caffeinate",
          "battery",
          "pmset",
          "power"
        ]
      }
    ]
  },
  {
    "id": "system-admin-card-2",
    "badge": "sys",
    "title": "System Defaults: Read & Modify .plist Preferences (defaults)",
    "subtitle": "Read, search, or modify macOS .plist preference files from Terminal",
    "commands": [
      {
        "id": "defaults-plutil",
        "mode": "DARWIN CLI",
        "modeClass": "mode-i",
        "desc": "Read, search, or modify macOS .plist preference files from Terminal",
        "cmd": "defaults domains   |   defaults find TrackpadThreeFingerDrag   |   plutil -p file.plist",
        "flags": [
          [
            "defaults find <word>",
            "Search all preference domains for keys/values matching <word>"
          ],
          [
            "defaults read <domain>",
            "Dump current settings for an app domain"
          ],
          [
            "plutil -p <file.plist>",
            "Pretty-print binary or XML property list file"
          ],
          [
            "plutil -convert xml1",
            "Convert binary .plist to human-editable XML"
          ]
        ],
        "tags": [
          "defaults",
          "plist",
          "plutil",
          "preferences",
          "config"
        ]
      }
    ]
  },
  {
    "id": "system-admin-card-3",
    "badge": "sys",
    "title": "System Defaults: Manage Launchd Daemons & Agents",
    "subtitle": "Inspect, bootstrap, or restart macOS launchd user agents and system daemons",
    "commands": [
      {
        "id": "launchctl-modern",
        "mode": "DARWIN CLI",
        "modeClass": "mode-i",
        "desc": "Inspect, bootstrap, or restart macOS launchd user agents and system daemons",
        "cmd": "launchctl list | grep -v com.apple   |   launchctl kickstart -k gui/$(id -u)/<service>",
        "flags": [
          [
            "launchctl list",
            "List loaded jobs with PID and last exit status"
          ],
          [
            "kickstart -k gui/$(id -u)/...",
            "Immediately kill and restart a running user agent"
          ],
          [
            "bootstrap / bootout",
            "Modern replacement for deprecated launchctl load / unload"
          ]
        ],
        "tags": [
          "launchctl",
          "launchd",
          "daemon",
          "agent",
          "service",
          "systemd"
        ]
      }
    ]
  },
  {
    "id": "system-admin-card-4",
    "badge": "sys",
    "title": "System Defaults: macOS Version, Apple Silicon Hardware & Updates",
    "subtitle": "Check macOS build version, Apple Silicon CPU cores/RAM, or install CLI updates",
    "commands": [
      {
        "id": "hardware-swvers-update",
        "mode": "DARWIN CLI",
        "modeClass": "mode-i",
        "desc": "Check macOS build version, Apple Silicon CPU cores/RAM, or install CLI updates",
        "cmd": "sw_vers   |   system_profiler SPHardwareDataType   |   softwareupdate -l   |   xcode-select --install",
        "flags": [
          [
            "sw_vers",
            "Print ProductName, ProductVersion & BuildVersion"
          ],
          [
            "sysctl -n machdep.cpu.brand_string",
            "Print exact Apple M-series or Intel chip model"
          ],
          [
            "softwareupdate -ia",
            "Download and install all available macOS system updates"
          ],
          [
            "xcode-select --install",
            "Install Xcode Command Line Tools (git, clang, make)"
          ]
        ],
        "tags": [
          "version",
          "hardware",
          "cpu",
          "apple-silicon",
          "update",
          "xcode"
        ]
      }
    ]
  },
  {
    "id": "system-admin-pro-tips",
    "badge": "tip",
    "title": "System Defaults: Pro Tips & Tricks",
    "subtitle": "Prevent sleep during long tasks, defaults customization & launchd triage",
    "commands": [
      {
        "id": "system-admin-tips-card",
        "desc": "Prevent sleep during long tasks, defaults customization & launchd triage",
        "cmd": "caffeinate -dimsu -t 3600   |   defaults read <domain>   |   launchctl list | grep -v 0$",
        "details": "caffeinate prevents your Mac from sleeping, dimming display, or throttling CPU while scripts run. The defaults command inspects and overrides preferences in ~/Library/Preferences/.",
        "flags": [
          [
            "caffeinate -dimsu",
            "Assert display, system, disk, and user active sleep prevention"
          ],
          [
            "caffeinate -i <command>",
            "Keep Mac awake until the specified command process terminates"
          ],
          [
            "defaults write <domain> <key> <val>",
            "Set hidden OS preferences; follow with killall <Process>"
          ],
          [
            "sw_vers",
            "Display macOS product name, version, and OS build number"
          ],
          [
            "sysctl -n machdep.cpu.brand_string",
            "Inspect exact CPU model (Apple M1/M2/M3/M4 or Intel)"
          ]
        ],
        "tip": "Use caffeinate -s during long ssh uploads or backup transfers to prevent idle sleep!",
        "tags": [
          "system-admin",
          "tips",
          "pro",
          "tricks",
          "macos",
          "best-practices"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("macos_system-admin_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM References
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

// macOS Shortcut & Command Syntax Highlighting
function highlightMacCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /([⌘⌥⌃⇧🌐⎋⌫↩]+[A-Za-z0-9`.\-\/←→↑↓]*)|(\s\|\s)|(\b(?:defaults|brew|open|pbcopy|pbpaste|mdfind|mdls|qlmanage|sips|say|afplay|caffeinate|pmset|plutil|launchctl|sw_vers|system_profiler|sysctl|softwareupdate|xcode-select|dscacheutil|killall|scutil|networkQuality|ipconfig|lsof|networksetup|xattr|codesign|spctl|security|diskutil|hdiutil|sudo)\b)|(\s-[a-zA-Z0-9-]+|\s--[a-zA-Z0-9-]+)/g,
    (match, modChord, sep, cliCmd, flagPart) => {
      if (modChord) return '<span class="tok-flag">' + modChord + '</span>';
      if (sep) return '<span class="tok-comment">' + sep + '</span>';
      if (cliCmd) return '<span class="tok-cmd">' + cliCmd + '</span>';
      if (flagPart) return '<span class="tok-flag">' + flagPart + '</span>';
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = MACOS_SYSTEM_ADMIN_DATA;
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

  for (const card of MACOS_SYSTEM_ADMIN_DATA) {
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
        '      title="' + (isBookmarked ? "Remove bookmark" : "Bookmark this shortcut") + '"',
        '      aria-label="' + (isBookmarked ? "Remove bookmark" : "Bookmark this shortcut") + '"',
        '    >',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <path fill="' + (isBookmarked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        '      </svg>',
        '    </button>',
        '  </div>',
        '',
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy shortcut">',
        '    <pre class="cmd-code"><code>' + highlightMacCmd(cmd.cmd) + '</code></pre>',
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
        localStorage.setItem("macos_system-admin_bookmarks", JSON.stringify([...state.bookmarks]));
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
