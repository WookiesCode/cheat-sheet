// nvim-visual.js
// Standalone interactive cheat sheet for Neovim: Visual Mode & Multi-Line Block Editing
const NVIM_VISUAL_DATA = [
  {
    "id": "visual-card-1",
    "badge": "vis",
    "title": "Visual Mode: Column Multi-Line Insertion",
    "subtitle": "Insert text at the beginning of multiple lines simultaneously",
    "commands": [
      {
        "id": "visual-block-insert",
        "mode": "VISUAL BLOCK",
        "modeClass": "mode-v",
        "desc": "Insert text at the beginning of multiple lines simultaneously",
        "cmd": "<C-v>  jjj  I{text}<Esc>",
        "flags": [
          [
            "<C-v>",
            "Enter Visual Block (column) mode"
          ],
          [
            "jjj",
            "Extend block across target lines"
          ],
          [
            "I ... <Esc>",
            "Capital I, type prefix, press Esc to apply to all lines"
          ]
        ],
        "tip": "Multi-cursor alternative",
        "tags": [
          "block",
          "column",
          "multiline",
          "prefix",
          "insert"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/visual/",
              "title": "Neovim help: visual"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "visual-card-2",
    "badge": "vis",
    "title": "Visual Mode: Column Ragged-Line Appending",
    "subtitle": "Append text to the end of multiple ragged-length lines",
    "commands": [
      {
        "id": "visual-block-append",
        "mode": "VISUAL BLOCK",
        "modeClass": "mode-v",
        "desc": "Append text to the end of multiple ragged-length lines",
        "cmd": "<C-v>  jjj  $A{text}<Esc>",
        "flags": [
          [
            "$A",
            "Extend block to end of each line and append text"
          ],
          [
            "c",
            "Change selected rectangular block across all lines"
          ]
        ],
        "tags": [
          "append",
          "eol",
          "block",
          "multiline",
          "column"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/visual/",
              "title": "Neovim help: visual"
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
    "id": "visual-card-3",
    "badge": "vis",
    "title": "Visual Mode: Reselection & Cursor Swapping",
    "subtitle": "Reselect previous visual area or jump cursor to other end of selection",
    "commands": [
      {
        "id": "visual-reselect-and-ends",
        "mode": "VISUAL",
        "modeClass": "mode-v",
        "desc": "Reselect previous visual area or jump cursor to other end of selection",
        "cmd": "gv   o   O   V   v",
        "flags": [
          [
            "gv",
            "Restore last visual selection (Normal mode)"
          ],
          [
            "o / O",
            "Swap active cursor to opposite corner of selection"
          ]
        ],
        "tags": [
          "reselect",
          "swap",
          "corner",
          "selection"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/visual/",
              "title": "Neovim help: visual"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "visual-card-4",
    "badge": "vis",
    "title": "Visual Mode: Sequential Number Generation",
    "subtitle": "Turn column of zeros into sequential numbers (1, 2, 3, 4...)",
    "commands": [
      {
        "id": "visual-number-sequence",
        "mode": "VISUAL",
        "modeClass": "mode-v",
        "desc": "Turn column of zeros into sequential numbers (1, 2, 3, 4...)",
        "cmd": "<C-v> jjj  g<C-a>",
        "flags": [
          [
            "g<C-a>",
            "Increment each selected line cumulatively (1, 2, 3...)"
          ],
          [
            "<C-a>",
            "Increment all selected lines by same amount"
          ]
        ],
        "tip": "Instant numbered lists",
        "tags": [
          "sequence",
          "increment",
          "numbers",
          "list"
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
    "id": "visual-card-5",
    "badge": "vis",
    "title": "Visual Mode: Block Sorting & Moving",
    "subtitle": "Sort selected lines uniquely or move selected block up/down",
    "commands": [
      {
        "id": "visual-sort-and-move",
        "mode": "VISUAL",
        "modeClass": "mode-v",
        "desc": "Sort selected lines uniquely or move selected block up/down",
        "cmd": ":'<,'>sort u   |   <A-j>   <A-k>",
        "flags": [
          [
            ":sort u",
            "Sort selected lines alphabetically & remove duplicates"
          ],
          [
            ":sort n",
            "Sort numerically"
          ],
          [
            "<A-j> / <A-k>",
            "Move selected line(s) down / up (LazyVim)"
          ]
        ],
        "tags": [
          "sort",
          "unique",
          "move",
          "lines",
          "deduplicate"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/change/",
              "title": "Neovim help: change"
            },
            {
              "url": "https://www.lazyvim.org/keymaps",
              "title": "LazyVim keymaps"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "visual-pro-tips",
    "badge": "tip",
    "title": "Visual Mode: Pro Tips & Chords",
    "subtitle": "Visual-block multi-line column editing & reselection",
    "commands": [
      {
        "id": "visual-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "Visual-block multi-line column editing & reselection",
        "cmd": "<C-v>   I<text><Esc>   |   <C-v>$   A<text><Esc>   |   gv",
        "details": "Visual-block mode (<C-v>) allows typing text on 20+ lines at once. Select column, press uppercase I, type prefix, and hit Esc. For ragged lines, select column, hit $ to extend to line ends, press uppercase A, and hit Esc.",
        "flags": [
          [
            "<C-v> then I ... <Esc>",
            "Insert at beginning of all selected column lines simultaneously"
          ],
          [
            "<C-v>$ then A ... <Esc>",
            "Append to end of uneven ragged lines simultaneously"
          ],
          [
            "gv",
            "Reselect the exact previous visual selection area"
          ],
          [
            "o",
            "Swap cursor to opposite diagonal corner of visual block"
          ],
          [
            "< / >",
            "Indent selection left / right (re-select with gv to repeat)"
          ]
        ],
        "tip": "The text shows up on the other lines only after you press Esc",
        "tags": [
          "visual",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/visual/",
              "title": "Neovim help: visual"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nvim_visual_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = NVIM_VISUAL_DATA;
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

  for (const card of NVIM_VISUAL_DATA) {
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
        localStorage.setItem("nvim_visual_bookmarks", JSON.stringify([...state.bookmarks]));
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
