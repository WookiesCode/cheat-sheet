// macos-finder-keys.js
// Standalone interactive cheat sheet for macOS: Finder, Quick Look & File Dialogs
const MACOS_FINDER_KEYS_DATA = [
  {
    "id": "finder-keys-card-1",
    "badge": "fndr",
    "title": "Finder: Folder Navigation & Path Jumps (⌘⇧G)",
    "subtitle": "Navigate folder hierarchy, jump to arbitrary POSIX path, or open selected item",
    "commands": [
      {
        "id": "finder-nav-folders",
        "mode": "FINDER",
        "modeClass": "mode-v",
        "desc": "Navigate folder hierarchy, jump to arbitrary POSIX path, or open selected item",
        "cmd": "⇧⌘G (Go to Path)   |   ⌘↑ (Parent)   |   ⌘↓ (Open)   |   ⌘O",
        "flags": [
          [
            "⇧⌘G",
            "Go to Folder by typing path (supports ~ and Tab completion)"
          ],
          [
            "⌘↑ / ⌘↓",
            "Go up to parent directory / Open selected file or enter folder"
          ],
          [
            "Return",
            "Rename selected file (unlike Windows/Linux where Enter opens it!)"
          ]
        ],
        "tip": "Works in Open/Save dialogs too!",
        "tags": [
          "finder",
          "goto",
          "path",
          "parent",
          "open",
          "rename"
        ]
      }
    ]
  },
  {
    "id": "finder-keys-card-2",
    "badge": "fndr",
    "title": "Finder: Hidden Dotfiles & View Modes (⌘⇧.)",
    "subtitle": "Instantly toggle hidden dotfiles, bottom path bar, status bar, and view modes",
    "commands": [
      {
        "id": "finder-dotfiles-pathbar",
        "mode": "FINDER",
        "modeClass": "mode-v",
        "desc": "Instantly toggle hidden dotfiles, bottom path bar, status bar, and view modes",
        "cmd": "⇧⌘. (Dotfiles)   |   ⌥⌘P (Path Bar)   |   ⌘/ (Status)   |   ⌘1 ⌘2 ⌘3 ⌘4",
        "flags": [
          [
            "⇧⌘.",
            "Toggle visibility of hidden dotfiles (.git, .env, .zshrc) anywhere"
          ],
          [
            "⌥⌘P / ⌘/",
            "Show clickable bottom Path Bar / Show free disk space Status Bar"
          ],
          [
            "⌘1 / ⌘2 / ⌘3 / ⌘4",
            "Switch to Icon / List / Column (Miller) / Gallery view"
          ]
        ],
        "tip": "⇧⌘. works in Save dialogs",
        "tags": [
          "hidden",
          "dotfiles",
          "pathbar",
          "views",
          "columns"
        ]
      }
    ]
  },
  {
    "id": "finder-keys-card-3",
    "badge": "fndr",
    "title": "Finder: Cut-Paste Move (⌥⌘V) & Path Copy",
    "subtitle": "Move (Cut-Paste) files, copy full POSIX file path, or duplicate item",
    "commands": [
      {
        "id": "finder-copy-move-path",
        "mode": "FINDER",
        "modeClass": "mode-v",
        "desc": "Move (Cut-Paste) files, copy full POSIX file path, or duplicate item",
        "cmd": "⌘C then ⌥⌘V (Move)   |   ⌥⌘C (Copy Path)   |   ⌘D (Duplicate)",
        "flags": [
          [
            "⌘C then ⌥⌘V",
            "Copy item then Move it here (macOS equivalent of Cut & Paste)"
          ],
          [
            "⌥⌘C",
            "Copy selected file's full POSIX path (e.g. /Users/jason/file.txt) to clipboard"
          ],
          [
            "⌃⌘N",
            "Create a new folder already containing the currently selected items"
          ]
        ],
        "tip": "⌥⌘V = Cut & Paste files",
        "tags": [
          "cut",
          "move",
          "paste",
          "path",
          "copy",
          "duplicate",
          "folder"
        ]
      }
    ]
  },
  {
    "id": "finder-keys-card-4",
    "badge": "fndr",
    "title": "Finder: Move to Trash & Instant Permanent Delete",
    "subtitle": "Move to Trash, bypass Trash (permanent delete), or empty Trash without prompt",
    "commands": [
      {
        "id": "finder-trash-delete",
        "mode": "FINDER",
        "modeClass": "mode-v",
        "desc": "Move to Trash, bypass Trash (permanent delete), or empty Trash without prompt",
        "cmd": "⌘⌫ (Trash)   |   ⌥⌘⌫ (Delete Immediately)   |   ⌥⇧⌘⌫ (Empty Trash)",
        "flags": [
          [
            "⌘⌫ (Delete)",
            "Move selected file(s) to Trash"
          ],
          [
            "⌥⌘⌫",
            "Delete immediately (bypasses Trash completely)"
          ],
          [
            "⇧⌘⌫ / ⌥⇧⌘⌫",
            "Empty Trash (with confirmation / skip confirmation dialog)"
          ]
        ],
        "tags": [
          "trash",
          "delete",
          "permanent",
          "empty",
          "remove"
        ]
      }
    ]
  },
  {
    "id": "finder-keys-card-5",
    "badge": "fndr",
    "title": "Finder: Quick Look Preview & Multi-File Inspector",
    "subtitle": "Preview files with Quick Look, markup PDFs/images, or open live Inspector",
    "commands": [
      {
        "id": "quicklook-inspector",
        "mode": "FINDER",
        "modeClass": "mode-v",
        "desc": "Preview files with Quick Look, markup PDFs/images, or open live Inspector",
        "cmd": "Space (Quick Look)   |   ⌥Space (Fullscreen)   |   ⌘I   |   ⌥⌘I (Inspector)",
        "flags": [
          [
            "Space",
            "Quick Look preview (use arrow keys while open to browse other files)"
          ],
          [
            "⌘I vs ⌥⌘I",
            "Get Info window vs Live Floating Inspector (updates as selection changes)"
          ],
          [
            "⌘Y",
            "Alternate shortcut to toggle Quick Look"
          ]
        ],
        "tags": [
          "quicklook",
          "preview",
          "info",
          "inspector",
          "metadata"
        ]
      }
    ]
  },
  {
    "id": "finder-keys-pro-tips",
    "badge": "tip",
    "title": "Finder: Pro Tips & Tricks",
    "subtitle": "Bypass trash, copy exact POSIX path & toggle hidden system dotfiles",
    "commands": [
      {
        "id": "finder-keys-tips-card",
        "desc": "Bypass trash, copy exact POSIX path & toggle hidden system dotfiles",
        "cmd": "⌥⌘V   |   ⌥⌘C   |   ⌥⌘⌫   |   ⌘⇧.",
        "details": "macOS has no \"cut\" for files in Finder—instead, press ⌘C to copy, then ⌥⌘V to move the file. Press ⌥⌘C to copy the full UNIX filesystem path directly to your clipboard.",
        "flags": [
          [
            "⌥⌘V",
            "Move (cut-paste) copied files into the current folder"
          ],
          [
            "⌥⌘C",
            "Copy exact full POSIX path (e.g. /Users/username/Docs/file.pdf)"
          ],
          [
            "⌥⌘⌫",
            "Immediately and permanently delete file without moving to Trash"
          ],
          [
            "⌘⇧.",
            "Toggle visibility of hidden dotfiles (.zshrc, .git, .env) in Finder"
          ]
        ],
        "tip": "Press ⌘⇧G in Finder to open the \"Go to Folder\" direct path prompt!",
        "tags": [
          "finder-keys",
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
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("macos_finder-keys_bookmarks") || "[]"))
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
  const allCards = MACOS_FINDER_KEYS_DATA;
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

  for (const card of MACOS_FINDER_KEYS_DATA) {
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
        '    <button type="button" class="copy-btn" title="Copy shortcut" aria-label="Copy shortcut">',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
        '        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>',
        '      </svg>',
        '      <span class="copy-feedback">Copied!</span>',
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
        localStorage.setItem("macos_finder-keys_bookmarks", JSON.stringify([...state.bookmarks]));
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
