// nvim-operators.js
// Standalone interactive cheat sheet for Neovim: Operators, Text Objects & Editing
const NVIM_OPERATORS_DATA = [
  {
    "id": "operators-card-1",
    "badge": "edit",
    "title": "Operators: Quotes, Brackets & HTML Tags",
    "subtitle": "Change, delete, or yank inside/around quotes, parens, braces & tags",
    "commands": [
      {
        "id": "text-objects-quotes-brackets",
        "mode": "N / V",
        "modeClass": "mode-n",
        "desc": "Change, delete, or yank inside/around quotes, parens, braces & tags",
        "cmd": "ci\"   da(   yi{   cit   dip",
        "flags": [
          [
            "ci\"",
            "Change inside double quotes"
          ],
          [
            "da(",
            "Delete around parentheses (including parens)"
          ],
          [
            "yi{",
            "Yank inside curly braces {} (or yiB)"
          ],
          [
            "cit / cat",
            "Change inside / around HTML/XML <tag>"
          ],
          [
            "dip",
            "Delete inner paragraph"
          ]
        ],
        "tip": "Core Vim superpower",
        "tags": [
          "inside",
          "around",
          "text-object",
          "quotes",
          "parens",
          "braces",
          "html",
          "tag"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/motion/",
              "title": "Neovim help: motion"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "operators-card-2",
    "badge": "edit",
    "title": "Operators: Inner & Around Words (iw / aw)",
    "subtitle": "Operate on whole word under cursor regardless of cursor position in word",
    "commands": [
      {
        "id": "word-change-delete",
        "mode": "NORMAL",
        "modeClass": "mode-n",
        "desc": "Operate on whole word under cursor regardless of cursor position in word",
        "cmd": "ciw   diw   yiw   daw",
        "flags": [
          [
            "ciw",
            "Change inner word (works even from middle of word)"
          ],
          [
            "daw",
            "Delete a word including trailing whitespace"
          ],
          [
            "yiw",
            "Yank word under cursor"
          ]
        ],
        "tags": [
          "word",
          "replace",
          "delete",
          "copy",
          "inner"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/motion/",
              "title": "Neovim help: motion"
            },
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "operators-card-3",
    "badge": "edit",
    "title": "Operators: End-of-Line Shortcuts (C / D / Y)",
    "subtitle": "Single-key equivalents for operating from cursor to end of line",
    "commands": [
      {
        "id": "eol-shortcuts",
        "mode": "NORMAL",
        "modeClass": "mode-n",
        "desc": "Single-key equivalents for operating from cursor to end of line",
        "cmd": "D   C   Y   S   s   x",
        "flags": [
          [
            "D / C",
            "Delete (d$) / Change (c$) to end of line"
          ],
          [
            "Y",
            "Yank to end of line (y$) in Neovim default"
          ],
          [
            "S / cc",
            "Clear entire line and enter Insert mode"
          ],
          [
            "s / x",
            "Substitute char (cl) / Delete char under cursor (dl)"
          ]
        ],
        "tip": "Nvim defaults Y to y$",
        "tags": [
          "end",
          "line",
          "shortcut",
          "substitute",
          "delete"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            },
            {
              "url": "https://neovim.io/doc/user/vim_diff/",
              "title": "Neovim help: default mappings"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "operators-card-4",
    "badge": "edit",
    "title": "Operators: Dot Repeat, Joining & Numbers",
    "subtitle": "Repeat last change, join lines with or without space, and increment numbers",
    "commands": [
      {
        "id": "dot-repeat-and-join",
        "mode": "NORMAL",
        "modeClass": "mode-n",
        "desc": "Repeat last change, join lines with or without space, and increment numbers",
        "cmd": ".   J   gJ   <C-a>   <C-x>",
        "flags": [
          [
            ".",
            "Repeat last atomic edit command"
          ],
          [
            "J / gJ",
            "Join next line with space / without space"
          ],
          [
            "<C-a> / <C-x>",
            "Increment / decrement the number under the cursor (letters too only if 'nrformats' includes alpha; the default is bin,hex)"
          ]
        ],
        "tags": [
          "repeat",
          "dot",
          "join",
          "increment",
          "number"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/repeat/",
              "title": "Neovim help: repeat (macros, :g)"
            },
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            },
            {
              "url": "https://neovim.io/doc/user/options/",
              "title": "Neovim help: options"
            }
          ],
          "note": "Corrected 2026-11-10: Ctrl+A only changes letters when 'nrformats' includes alpha."
        }
      }
    ]
  },
  {
    "id": "operators-card-5",
    "badge": "edit",
    "title": "Operators: Case Toggle, Indent & Formatting",
    "subtitle": "Toggle case, uppercase/lowercase, auto-indent, and wrap paragraphs",
    "commands": [
      {
        "id": "case-indent-format",
        "mode": "N / V",
        "modeClass": "mode-n",
        "desc": "Toggle case, uppercase/lowercase, auto-indent, and wrap paragraphs",
        "cmd": "~   gUiw   guiw   =G   gqip",
        "flags": [
          [
            "~",
            "Toggle case of character(s)"
          ],
          [
            "gUiw / guiw",
            "Uppercase / lowercase inner word (gUU / guu for line)"
          ],
          [
            "=G / == ",
            "Auto-indent to end of file / current line"
          ],
          [
            "gqip",
            "Hard-wrap inner paragraph to textwidth"
          ]
        ],
        "tags": [
          "case",
          "uppercase",
          "lowercase",
          "indent",
          "format",
          "wrap"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "operators-card-6",
    "badge": "edit",
    "title": "Operators: Built-in Commenting (gc / gcc)",
    "subtitle": "Toggle code comments using Neovim 0.10+ built-in commenting",
    "commands": [
      {
        "id": "commenting-builtin",
        "mode": "N / V",
        "modeClass": "mode-n",
        "desc": "Toggle code comments using Neovim 0.10+ built-in commenting",
        "cmd": "gcc   gcip   gc}",
        "flags": [
          [
            "gcc",
            "Toggle line comment on current line"
          ],
          [
            "gc{motion}",
            "Toggle comment over motion/text-object (or visual gc)"
          ]
        ],
        "tip": "Built into Nvim 0.10+",
        "tags": [
          "comment",
          "uncomment",
          "toggle",
          "code"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/various/",
              "title": "Neovim help: various (:!, gc, CTRL-L)"
            },
            {
              "url": "https://neovim.io/doc/user/vim_diff/",
              "title": "Neovim help: default mappings"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "operators-pro-tips",
    "badge": "tip",
    "title": "Operators: Pro Tips & Chords",
    "subtitle": "Vim operator grammar composition rules: [operator][count][scope][target]",
    "commands": [
      {
        "id": "operators-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "Vim operator grammar composition rules: [operator][count][scope][target]",
        "cmd": "ci\"   da)   yiw   gUiw   =i}   gc",
        "details": "Operators (c, d, y, v, =, gU, gu, gc) combine with inner (i) or around (a) scope targets. Inner affects content inside delimiters; around includes delimiters themselves.",
        "flags": [
          [
            "ci\" / ca\"",
            "Change inside / around double quotes"
          ],
          [
            "da) / di)",
            "Delete around / inside parentheses"
          ],
          [
            "yiw / yaw",
            "Yank inner word / around word including trailing space"
          ],
          [
            "gUiw / guiw",
            "Convert inner word to UPPERCASE / lowercase"
          ],
          [
            "gc / gcc",
            "Comment motion target / comment entire current line"
          ]
        ],
        "tip": "The dot (.) command repeats the entire composite operator change!",
        "tags": [
          "operators",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/motion/",
              "title": "Neovim help: motion"
            },
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            },
            {
              "url": "https://neovim.io/doc/user/various/",
              "title": "Neovim help: various (:!, gc, CTRL-L)"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nvim_operators_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Neovim Keymap Syntax Highlighting
function highlightVimCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(&lt;[A-Za-z0-9\-\]]+&gt;)|(\s\|\s)|(:[a-zA-Z!]+|:%s|:'&lt;,'&gt;[a-zA-Z!]*)|(\{[a-zA-Z]+\})/g,
    (match, chord, sep, exCmd, placeholder) => {
      if (chord) return '<span class="tok-flag">' + chord + '</span>';
      if (sep) return '<span class="tok-comment">' + sep + '</span>';
      if (exCmd) return '<span class="tok-cmd">' + exCmd + '</span>';
      if (placeholder) return '<span class="tok-str">' + placeholder + '</span>';
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = NVIM_OPERATORS_DATA;
  const totalCmds = allCards.reduce((acc, c) => acc + c.commands.length, 0);

  const optionsHtml = [
    '<option value="all"' + (state.activeCategory === "all" ? " selected" : "") + '>All Topics (' + totalCmds + ' keymaps)</option>'
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
    cmd.mode || "",
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

  for (const card of NVIM_OPERATORS_DATA) {
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
      const modeHtml = cmd.mode
        ? '<span class="mode-pill ' + (cmd.modeClass || "mode-n") + '">' + escapeHtml(cmd.mode) + '</span>'
        : "";

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
        '      ' + modeHtml,
        '      <span>' + escapeHtml(cmd.desc) + '</span>',
        '    </div>',
        '    <button',
        '      type="button"',
        '      class="bookmark-btn ' + (isBookmarked ? "bookmarked" : "") + '"',
        '      data-cmd-id="' + escapeHtml(cmd.id) + '"',
        '      title="' + (isBookmarked ? "Remove bookmark" : "Bookmark this keymap") + '"',
        '      aria-label="' + (isBookmarked ? "Remove bookmark" : "Bookmark this keymap") + '"',
        '    >',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <path fill="' + (isBookmarked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        '      </svg>',
        '    </button>',
        '  </div>',
        '',
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy keymap">',
        '    <pre class="cmd-code"><code>' + highlightVimCmd(cmd.cmd) + '</code></pre>',
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
        localStorage.setItem("nvim_operators_bookmarks", JSON.stringify([...state.bookmarks]));
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
