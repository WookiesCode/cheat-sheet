// win-shortcuts.js
// Standalone interactive cheat sheet for Windows: Windows 11, Snap & Explorer Shortcuts
const WIN_WIN_SHORTCUTS_DATA = [
  {
    "id": "win-keys-card-1",
    "badge": "keys",
    "title": "Windows 11: Power User Menu & Task Manager (Win+X)",
    "subtitle": "Open Quick Link admin menu, Task Manager, or launch any app as Administrator",
    "commands": [
      {
        "id": "win-power-user-admin",
        "mode": "SHORTCUT",
        "modeClass": "mode-n",
        "desc": "Open Quick Link admin menu, Task Manager, or launch any app as Administrator",
        "cmd": "Win+X   |   Win+X then I (Admin Terminal)   |   Ctrl+Shift+Esc   |   Ctrl+Shift+Enter",
        "flags": [
          [
            "Win+X",
            "Open Power User menu (Terminal, Disk Mgmt, Device Mgr, Event Viewer)"
          ],
          [
            "Win+X then u, u / u, r",
            "Instant Shutdown (u, u) or Restart (u, r) without mouse"
          ],
          [
            "Ctrl+Shift+Esc",
            "Open Task Manager directly"
          ],
          [
            "Ctrl+Shift+Enter",
            "Run selected Start Menu or Win+R command as Administrator (Elevated)"
          ]
        ],
        "tip": "Win+X then I = Admin PS",
        "tags": [
          "admin",
          "elevate",
          "task-manager",
          "shutdown",
          "menu",
          "terminal"
        ]
      }
    ]
  },
  {
    "id": "win-keys-card-2",
    "badge": "keys",
    "title": "Windows 11: Window Snapping & Layouts (Win+Z / Arrows)",
    "subtitle": "Snap windows into halves/quadrants, open Snap Layouts, or move window across monitors",
    "commands": [
      {
        "id": "win-snap-multimonitor",
        "mode": "SHORTCUT",
        "modeClass": "mode-n",
        "desc": "Snap windows into halves/quadrants, open Snap Layouts, or move window across monitors",
        "cmd": "Win+Z   |   Win+← / Win+→   |   Win+Shift+← / → (Monitor)   |   Win+Home",
        "flags": [
          [
            "Win+Z",
            "Open Windows 11 Snap Layouts picker for active window"
          ],
          [
            "Win+← / → then ↑ / ↓",
            "Snap window to left/right half, then corner quadrant"
          ],
          [
            "Win+Shift+← / →",
            "Teleport active window to left or right physical monitor"
          ],
          [
            "Win+Home / Win+D",
            "Minimize all windows except active one / Show Desktop"
          ]
        ],
        "tags": [
          "snap",
          "tile",
          "monitor",
          "layout",
          "minimize",
          "desktop"
        ]
      }
    ]
  },
  {
    "id": "win-keys-card-3",
    "badge": "keys",
    "title": "Windows 11: Virtual Desktops Management (Win+Ctrl+D/F4)",
    "subtitle": "Create, switch between, and close Virtual Desktops (Workspaces)",
    "commands": [
      {
        "id": "win-virtual-desktops",
        "mode": "SHORTCUT",
        "modeClass": "mode-n",
        "desc": "Create, switch between, and close Virtual Desktops (Workspaces)",
        "cmd": "Win+Tab   |   Win+Ctrl+D (New)   |   Win+Ctrl+← / → (Switch)   |   Win+Ctrl+F4 (Close)",
        "flags": [
          [
            "Win+Tab",
            "Open Task View (drag windows between Virtual Desktops)"
          ],
          [
            "Win+Ctrl+D",
            "Create and switch to a new Virtual Desktop"
          ],
          [
            "Win+Ctrl+← / →",
            "Switch immediately to previous / next Virtual Desktop"
          ],
          [
            "Win+Ctrl+F4",
            "Close current Virtual Desktop (moves open windows to neighbor)"
          ]
        ],
        "tags": [
          "virtual-desktop",
          "workspaces",
          "task-view",
          "switch"
        ]
      }
    ]
  },
  {
    "id": "win-keys-card-4",
    "badge": "keys",
    "title": "Windows 11: Clipboard History & GPU Reset (Win+V / Win+Ctrl+Shift+B)",
    "subtitle": "Clipboard history, region screenshot/screen-record, text OCR, and GPU driver reset",
    "commands": [
      {
        "id": "win-clipboard-capture-gpu",
        "mode": "SHORTCUT",
        "modeClass": "mode-n",
        "desc": "Clipboard history, region screenshot/screen-record, text OCR, and GPU driver reset",
        "cmd": "Win+V (Clipboard)   |   Win+Shift+S (Snip)   |   Win+Ctrl+Shift+B (Reset GPU)",
        "flags": [
          [
            "Win+V",
            "Open multi-item Clipboard History & pinned snippets"
          ],
          [
            "Win+Shift+S / Win+Shift+R",
            "Snipping Tool screenshot / screen video recording (Win 11)"
          ],
          [
            "Win+Ctrl+Shift+B",
            "Restart graphics driver immediately when screen freezes or goes black"
          ],
          [
            "Win+Ctrl+V",
            "Open quick audio output/input device switcher (Win 11)"
          ]
        ],
        "tip": "Win+Ctrl+Shift+B fixes black screens",
        "tags": [
          "clipboard",
          "screenshot",
          "snip",
          "record",
          "gpu",
          "audio"
        ]
      }
    ]
  },
  {
    "id": "win-keys-card-5",
    "badge": "keys",
    "title": "Windows 11: Explorer Path Copy & Terminal Launch",
    "subtitle": "Open Terminal in current Explorer folder, copy full file path, or toggle preview panes",
    "commands": [
      {
        "id": "win-explorer-power-tricks",
        "mode": "EXPLORER",
        "modeClass": "mode-v",
        "desc": "Open Terminal in current Explorer folder, copy full file path, or toggle preview panes",
        "cmd": "Alt+D then type wt<Enter>   |   Ctrl+Shift+C (Copy Path)   |   Alt+P (Preview)",
        "flags": [
          [
            "Alt+D → wt → Enter",
            "Focus Explorer address bar and launch Windows Terminal in that exact directory!"
          ],
          [
            "Ctrl+Shift+C",
            "Copy selected file's full quoted path (Win 11) or Shift+Right-Click → Copy as path"
          ],
          [
            "Ctrl+Shift+N / F2",
            "Create new folder / Rename selected file"
          ],
          [
            "Alt+P / Alt+Shift+P",
            "Toggle file Preview Pane / Details Pane"
          ]
        ],
        "tip": "Alt+D -> wt opens shell here",
        "tags": [
          "explorer",
          "path",
          "copy",
          "terminal",
          "folder",
          "preview"
        ]
      }
    ]
  },
  {
    "id": "win-keys-pro-tips",
    "badge": "tip",
    "title": "Windows 11: Pro Tips & Best Practices",
    "subtitle": "Instant graphics driver reset, Snipping Tool OCR & Task Manager shortcut",
    "commands": [
      {
        "id": "win-keys-tips-card",
        "desc": "Instant graphics driver reset, Snipping Tool OCR & Task Manager shortcut",
        "cmd": "Win+Ctrl+Shift+B   |   Win+Shift+S   |   Ctrl+Shift+Esc   |   Win+X",
        "details": "Press Win+Ctrl+Shift+B to instantly restart your graphics driver subsystem when experiencing screen flickering or black screen freezes without rebooting. Use Win+Shift+S for text OCR extraction from any image.",
        "flags": [
          [
            "Win+Ctrl+Shift+B",
            "Beeps and restarts GPU display driver pipeline without closing apps"
          ],
          [
            "Win+Shift+S",
            "Snipping Tool: capture region, window, screen recording, or extract text (OCR)"
          ],
          [
            "Ctrl+Shift+Esc",
            "Directly open Task Manager without going through Ctrl+Alt+Del lock screen"
          ],
          [
            "Win+V",
            "Open Clipboard History (press once to turn on, stores up to 25 items + pins)"
          ]
        ],
        "tip": "Press Win+X then A to launch an elevated Administrator PowerShell prompt in 1 second!",
        "tags": [
          "win-keys",
          "tips",
          "pro",
          "windows",
          "powershell",
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
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("win-shortcuts_bookmarks") || "[]"))
};

// DOM References
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
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

// Windows Shortcut & PowerShell Syntax Highlighting
function highlightPsCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(\b(?:Win|Ctrl|Alt|Shift)(?:\+[A-Za-z0-9←→↑↓.`]+)+)|(\s\|\s)|(\b[A-Z][a-zA-Z]+-[A-Z][a-zA-Z0-9]+\b|\b(?:winget|wsl|robocopy|powercfg|shutdown|DISM\.exe|sfc|netstat|findstr|where\.exe|explorer\.exe|clip\.exe|notepad)\b)|(\$[a-zA-Z0-9_:]+|\$_)|(\s-[a-zA-Z0-9-]+|\s\/[a-zA-Z0-9:]+)/g,
    (match, shortcut, sep, cmdlet, variable, flag) => {
      if (shortcut) return '<span class="tok-flag">' + shortcut + '</span>';
      if (sep) return '<span class="tok-pipe">' + sep + '</span>';
      if (cmdlet) return '<span class="tok-cmd">' + cmdlet + '</span>';
      if (variable) return '<span class="tok-str">' + variable + '</span>';
      if (flag) return '<span class="tok-flag">' + flag + '</span>';
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = WIN_WIN_SHORTCUTS_DATA;
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

  for (const card of WIN_WIN_SHORTCUTS_DATA) {
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
        '    <pre class="cmd-code"><code>' + highlightPsCmd(cmd.cmd) + '</code></pre>',
        '    <button type="button" class="copy-btn" title="Copy command" aria-label="Copy command">',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
        '        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>',
        '      </svg>',
        '      <span class="copy-feedback">Copy</span>',
        '    </button>',
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

  densityToggleBtn.addEventListener("click", () => {
    state.compact = !state.compact;
    document.body.classList.toggle("compact-mode", state.compact);
    densityLabel.textContent = state.compact ? "Normal" : "Compact";
    localStorage.setItem("linux_cs_compact", state.compact ? "1" : "0");
    packMasonry();
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
    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
      const codeBox = copyBtn.closest(".cmd-code-box");
      const cmdText = codeBox ? codeBox.getAttribute("data-cmd") : "";
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const codeBox = e.target.closest(".cmd-code-box");
    if (codeBox && !e.target.closest(".copy-btn")) {
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
        localStorage.setItem("win-shortcuts_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.CheatSheetCommon && typeof window.CheatSheetCommon.applyTheme === "function") {
    window.CheatSheetCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch (e) {}
  }
}

function init() {
  applyTheme(state.theme);
  if (state.compact) {
    document.body.classList.add("compact-mode");
    densityLabel.textContent = "Normal";
  }
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
