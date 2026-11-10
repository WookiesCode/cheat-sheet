// nano.js
// Standalone interactive cheat sheet for Editors: GNU nano: Edit Config Files on a Server
const ED_NANO_DATA = [
  {
    "id": "nano-cmd-1",
    "badge": "nano",
    "title": "GNU nano: Open a file at a given line",
    "subtitle": "Open a file at a given line (with line numbers on)",
    "commands": [
      {
        "id": "nano-open-line",
        "desc": "Open a file at a given line (with line numbers on)",
        "cmd": "nano -l +120 /etc/ssh/sshd_config",
        "details": "",
        "flags": [
          [
            "+120",
            "Start at line 120; +120,8 also sets the column. +/PermitRoot starts at the first match"
          ],
          [
            "-l / --linenumbers",
            "Show line numbers, handy when an error message names a line"
          ],
          [
            "-v / --view",
            "Read-only: you cannot change the file by accident"
          ],
          [
            "-B / --backup",
            "Keep the previous version as file~ when you save"
          ],
          [
            "-m / --mouse",
            "Click to place the cursor and scroll with the wheel"
          ],
          [
            "-E -T 4",
            "Convert typed tabs to spaces, tab width 4 (YAML wants spaces)"
          ]
        ],
        "tip": "Use -v when you only need to read",
        "tags": [
          "editor",
          "editors",
          "nano",
          "open",
          "line",
          "view",
          "flags"
        ]
      },
      {
        "id": "nano-open-line-sub-1",
        "desc": "Page through a log without any risk of editing it",
        "cmd": "nano -v /var/log/syslog",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "open",
          "line",
          "view"
        ]
      },
      {
        "id": "nano-open-line-sub-2",
        "desc": "Open at the first match of a word",
        "cmd": "nano +/ListenAddress /etc/ssh/sshd_config",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "open",
          "line",
          "view"
        ]
      }
    ]
  },
  {
    "id": "nano-cmd-2",
    "badge": "nano",
    "title": "GNU nano: Edit a root-owned file safely with sudoedit",
    "subtitle": "Edit a root-owned file safely with sudoedit",
    "commands": [
      {
        "id": "nano-sudoedit",
        "desc": "Edit a root-owned file safely with sudoedit",
        "cmd": "sudoedit /etc/fstab",
        "details": "",
        "flags": [
          [
            "sudoedit (= sudo -e)",
            "Copies the file to a temp file, runs your editor as you, and writes it back as root only when you save"
          ],
          [
            "Why not sudo nano",
            "Your editor, its config and plugins never run as root, and a crash cannot leave the real file half-written"
          ],
          [
            "SUDO_EDITOR=nano",
            "Pick the editor sudoedit uses (it also honours VISUAL and EDITOR)"
          ]
        ],
        "tip": "Back up, sudoedit, then validate",
        "tags": [
          "editor",
          "editors",
          "nano",
          "sudoedit",
          "sudo",
          "root",
          "safe",
          "fstab",
          "validate"
        ]
      },
      {
        "id": "nano-sudoedit-sub-1",
        "desc": "Keep a dated copy before you touch it (changes state)",
        "cmd": "cp -a /etc/fstab /etc/fstab.bak.$(date +%F)",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "sudoedit",
          "sudo",
          "root"
        ]
      },
      {
        "id": "nano-sudoedit-sub-2",
        "desc": "Check /etc/fstab before the next reboot finds the mistake",
        "cmd": "findmnt --verify",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "sudoedit",
          "sudo",
          "root"
        ]
      },
      {
        "id": "nano-sudoedit-sub-3",
        "desc": "Check sshd_config before restarting sshd",
        "cmd": "sshd -t",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "sudoedit",
          "sudo",
          "root"
        ]
      },
      {
        "id": "nano-sudoedit-sub-4",
        "desc": "Check sudoers syntax",
        "cmd": "visudo -c",
        "tags": [
          "editor",
          "editors",
          "nano",
          "recipe",
          "sudoedit",
          "sudo",
          "root"
        ]
      }
    ]
  },
  {
    "id": "nano-cmd-3",
    "badge": "nano",
    "title": "GNU nano: Save, exit and get help",
    "subtitle": "Save, exit and get help (the bottom two lines list the rest)",
    "commands": [
      {
        "id": "nano-save-exit",
        "desc": "Save, exit and get help (the bottom two lines list the rest)",
        "cmd": "Ctrl+O  Enter  ·  Ctrl+X",
        "details": "",
        "flags": [
          [
            "Ctrl+O",
            "Write Out: save; Enter confirms the file name (change it to save a copy)"
          ],
          [
            "Ctrl+X",
            "Exit; if there are changes it asks Y (save), N (discard) or Ctrl+C (cancel)"
          ],
          [
            "Ctrl+S",
            "Save without the file-name prompt"
          ],
          [
            "Ctrl+G",
            "Help: every key binding for your version"
          ],
          [
            "^ and M-",
            "In nano's own help ^ means Ctrl and M- means Alt (Meta): M-U is Alt+U"
          ]
        ],
        "tip": "^ = Ctrl, M- = Alt",
        "tags": [
          "editor",
          "editors",
          "nano",
          "save",
          "exit",
          "write out",
          "help",
          "keys"
        ]
      }
    ]
  },
  {
    "id": "nano-cmd-4",
    "badge": "nano",
    "title": "GNU nano: Search and replace",
    "subtitle": "Search and replace",
    "commands": [
      {
        "id": "nano-search-replace",
        "desc": "Search and replace",
        "cmd": "Ctrl+W  ·  Ctrl+\\",
        "details": "",
        "flags": [
          [
            "Ctrl+W",
            "Where Is: search forward; Alt+W repeats the last search"
          ],
          [
            "Ctrl+\\",
            "Replace: type the search, then the replacement, then Y / N / A (all) per match"
          ],
          [
            "Alt+R (in the search prompt)",
            "Toggle regular expressions"
          ],
          [
            "Alt+C (in the search prompt)",
            "Toggle case-sensitive"
          ],
          [
            "Alt+B (in the search prompt)",
            "Search backwards"
          ]
        ],
        "tip": "A = replace all remaining matches",
        "tags": [
          "editor",
          "editors",
          "nano",
          "search",
          "find",
          "replace",
          "regex"
        ]
      }
    ]
  },
  {
    "id": "nano-cmd-5",
    "badge": "nano",
    "title": "GNU nano: Cut, copy and paste whole lines; undo and redo",
    "subtitle": "Cut, copy and paste whole lines; undo and redo",
    "commands": [
      {
        "id": "nano-cut-paste",
        "desc": "Cut, copy and paste whole lines; undo and redo",
        "cmd": "Ctrl+K  ·  Alt+6  ·  Ctrl+U",
        "details": "",
        "flags": [
          [
            "Ctrl+K",
            "Cut the current line (press repeatedly to cut several lines into one clipboard)"
          ],
          [
            "Alt+6",
            "Copy the current line"
          ],
          [
            "Ctrl+U",
            "Paste (Uncut) what you cut or copied"
          ],
          [
            "Alt+A",
            "Set a mark: move the cursor to select a region, then Ctrl+K or Alt+6 acts on it"
          ],
          [
            "Alt+U / Alt+E",
            "Undo / redo"
          ]
        ],
        "tip": "Ctrl+K several times, then Ctrl+U = move a block",
        "tags": [
          "editor",
          "editors",
          "nano",
          "cut",
          "copy",
          "paste",
          "undo",
          "redo",
          "mark"
        ]
      }
    ]
  },
  {
    "id": "nano-cmd-6",
    "badge": "nano",
    "title": "GNU nano: Jump around a long file",
    "subtitle": "Jump around a long file",
    "commands": [
      {
        "id": "nano-navigate",
        "desc": "Jump around a long file",
        "cmd": "Ctrl+_  (go to line)",
        "details": "",
        "flags": [
          [
            "Ctrl+_ or Alt+G",
            "Go to line (and column: 120,8)"
          ],
          [
            "Alt+\\ / Alt+/",
            "Top / bottom of the file"
          ],
          [
            "Ctrl+C",
            "Show the current line and column"
          ],
          [
            "Ctrl+Y / Ctrl+V",
            "Page up / page down"
          ],
          [
            "Line numbers",
            "Toggle them with the key listed under Ctrl+G (Alt+N in current nano)"
          ]
        ],
        "tip": "Ctrl+G lists the keys of your exact version",
        "tags": [
          "editor",
          "editors",
          "nano",
          "navigate",
          "go to line",
          "page",
          "position"
        ]
      }
    ]
  },
  {
    "id": "nano-cmd-7",
    "badge": "nano",
    "title": "GNU nano: ~/.config/nano/nanorc",
    "subtitle": "~/.config/nano/nanorc: sensible defaults for config files",
    "commands": [
      {
        "id": "nano-nanorc",
        "desc": "~/.config/nano/nanorc: sensible defaults for config files",
        "cmd": "set linenumbers\nset mouse\nset autoindent\nset tabsize 4\nset tabstospaces\nset constantshow\ninclude \"/usr/share/nano/*.nanorc\"",
        "details": "",
        "flags": [
          [
            "~/.config/nano/nanorc",
            "Your settings (~/.nanorc also works); /etc/nanorc is the system-wide one"
          ],
          [
            "tabstospaces",
            "Typed tabs become spaces: YAML and most configs want that"
          ],
          [
            "constantshow",
            "Always show the cursor position in the status bar"
          ],
          [
            "include …*.nanorc",
            "Syntax colouring for many file types (shipped with the nano package)"
          ]
        ],
        "tip": "One file, every server: keep it in your dotfiles",
        "tags": [
          "editor",
          "editors",
          "nano",
          "nanorc",
          "config",
          "syntax",
          "tabs",
          "dotfiles"
        ]
      }
    ]
  },
  {
    "id": "nano-cmd-8",
    "badge": "nano",
    "title": "GNU nano: Make nano",
    "subtitle": "Make nano (or any editor) the default for git, crontab and visudo",
    "commands": [
      {
        "id": "nano-default-editor",
        "desc": "Make nano (or any editor) the default for git, crontab and visudo",
        "cmd": "export EDITOR=nano VISUAL=nano",
        "details": "",
        "flags": [
          [
            "EDITOR / VISUAL",
            "Most tools (crontab -e, visudo, git, sudoedit) read these; put the line in ~/.bashrc"
          ],
          [
            "git config --global core.editor nano",
            "Only git"
          ],
          [
            "update-alternatives --config editor",
            "System-wide default on Debian/Ubuntu (changes state)"
          ]
        ],
        "tip": "Set EDITOR in ~/.bashrc",
        "tags": [
          "editor",
          "editors",
          "nano",
          "editor",
          "default",
          "git",
          "crontab",
          "visudo"
        ]
      }
    ]
  },
  {
    "id": "nano-pro-tips",
    "badge": "tip",
    "title": "GNU nano: Pro Tip",
    "subtitle": "Change a config the safe way",
    "commands": [
      {
        "id": "nano-tips-card",
        "desc": "Change a config the safe way",
        "cmd": "sudo cp -a FILE FILE.bak.$(date +%F) && sudoedit FILE",
        "details": "Keep a dated copy, edit with sudoedit, validate with the service's own checker (sshd -t, nginx -t, visudo -c, findmnt --verify), and only then reload the service.",
        "flags": [
          [
            "cp -a",
            "Keeps owner, mode and timestamps"
          ],
          [
            "Validate first",
            "A typo in sshd_config plus a restart can lock you out of the box"
          ]
        ],
        "tip": "Backup → edit → validate → reload",
        "tags": [
          "editor",
          "editors",
          "nano",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nano_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = ED_NANO_DATA;
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

  for (const card of ED_NANO_DATA) {
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
        localStorage.setItem("nano_bookmarks", JSON.stringify([...state.bookmarks]));
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
