// nvim-lsp.js
// Standalone interactive cheat sheet for Neovim: Built-in LSP, Diagnostics & Treesitter
const NVIM_LSP_DATA = [
  {
    "id": "lsp-card-1",
    "badge": "lsp",
    "title": "Built-in LSP: Go-to Definition & References",
    "subtitle": "Jump to symbol definition, references, implementation, or type definition",
    "commands": [
      {
        "id": "lsp-goto-navigation",
        "mode": "NORMAL",
        "modeClass": "mode-n",
        "desc": "Jump to symbol definition, references, implementation, or type definition",
        "cmd": "gd   gr   gI   gy   gD   K",
        "flags": [
          [
            "gd / gD",
            "Goto Definition / Declaration (LazyVim; in plain Neovim gd is the built-in local-declaration jump, and Ctrl+] reaches the LSP definition)"
          ],
          [
            "gr (or grr)",
            "References: gr in LazyVim, grr is the Neovim 0.11+ default"
          ],
          [
            "gI / gy",
            "Implementation / Type Definition in LazyVim (gri / grt by default in Neovim)"
          ],
          [
            "K",
            "Show Hover documentation float (press K again to focus float)"
          ]
        ],
        "tip": "<C-o> jumps right back",
        "tags": [
          "lsp",
          "definition",
          "references",
          "hover",
          "implementation",
          "type"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/lsp/",
              "title": "Neovim help: LSP defaults"
            },
            {
              "url": "https://neovim.io/doc/user/news-0.11/",
              "title": "Neovim 0.11 news"
            },
            {
              "url": "https://neovim.io/doc/user/news-0.12/",
              "title": "Neovim 0.12 news"
            },
            {
              "url": "https://www.lazyvim.org/keymaps",
              "title": "LazyVim keymaps"
            }
          ],
          "note": "Corrected 2026-11-10: gd, gr, gI and gy are LazyVim keys; Neovim's own are grr, gri and grt."
        }
      }
    ]
  },
  {
    "id": "lsp-card-2",
    "badge": "lsp",
    "title": "Built-in LSP: Code Actions, Rename & Formatting",
    "subtitle": "Trigger LSP code actions, workspace-wide symbol rename, and formatting",
    "commands": [
      {
        "id": "lsp-actions-rename-format",
        "mode": "N / V",
        "modeClass": "mode-n",
        "desc": "Trigger LSP code actions, workspace-wide symbol rename, and formatting",
        "cmd": "<leader>ca   <leader>cr   <leader>cf   |   gra   grn",
        "flags": [
          [
            "<leader>ca / gra",
            "Code Actions (quickfix, imports, refactors)"
          ],
          [
            "<leader>cr / grn",
            "Rename symbol across all project files"
          ],
          [
            "<leader>cf",
            "Format current buffer or visual selection"
          ],
          [
            "<C-k> (Insert)",
            "Signature help in LazyVim (Ctrl+S is Neovim's 0.11+ default)"
          ]
        ],
        "tags": [
          "rename",
          "refactor",
          "code-action",
          "format",
          "signature"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/lsp/",
              "title": "Neovim help: LSP defaults"
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
    "id": "lsp-card-3",
    "badge": "lsp",
    "title": "Built-in LSP: Compiler & LSP Diagnostics",
    "subtitle": "Jump between compiler/LSP diagnostics, errors, and inspect floating details",
    "commands": [
      {
        "id": "diagnostics-navigation",
        "mode": "NORMAL",
        "modeClass": "mode-n",
        "desc": "Jump between compiler/LSP diagnostics, errors, and inspect floating details",
        "cmd": "]d   [d   ]e   [e   <leader>cd   <leader>xx",
        "flags": [
          [
            "]d / [d",
            "Next / previous diagnostic (any severity)"
          ],
          [
            "]e / [e",
            "Next / previous Error (LazyVim)"
          ],
          [
            "<leader>cd / <C-w>d",
            "Show line diagnostic details in floating window"
          ],
          [
            "<leader>xx",
            "Toggle Trouble workspace diagnostics panel (LazyVim)"
          ]
        ],
        "tags": [
          "error",
          "warning",
          "diagnostic",
          "trouble",
          "lint"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/diagnostic/",
              "title": "Neovim help: diagnostics"
            },
            {
              "url": "https://neovim.io/doc/user/vim_diff/",
              "title": "Neovim help: default mappings"
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
    "id": "lsp-card-4",
    "badge": "lsp",
    "title": "Built-in LSP: Treesitter Syntax AST Selection",
    "subtitle": "Expand or shrink visual selection incrementally by AST syntax nodes",
    "commands": [
      {
        "id": "treesitter-incremental-select",
        "mode": "N / V",
        "modeClass": "mode-v",
        "desc": "Expand or shrink visual selection incrementally by AST syntax nodes",
        "cmd": "<C-space>   <BS>   |   ]f   [f   ]c   [c",
        "flags": [
          [
            "<C-space>",
            "Start / expand selection to the parent node (LazyVim, via flash.nvim; Neovim 0.12+ has an / in in Visual mode built in)"
          ],
          [
            "<BS> (Backspace)",
            "Shrink selection to child AST node"
          ],
          [
            "]f / [f",
            "Jump to next / prev function start (Treesitter textobjects)"
          ],
          [
            "]c / [c",
            "Next / previous class start (in diff mode: the next / previous change); git hunks are ]h / [h"
          ]
        ],
        "tip": "AST-aware selection",
        "tags": [
          "treesitter",
          "ast",
          "node",
          "expand",
          "function",
          "class"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/LazyVim/LazyVim/blob/v16.0.2/lua/lazyvim/plugins/editor.lua",
              "title": "LazyVim source: editor.lua (gitsigns, flash)"
            },
            {
              "url": "https://github.com/LazyVim/LazyVim/blob/v16.0.2/lua/lazyvim/plugins/treesitter.lua",
              "title": "LazyVim source: treesitter.lua"
            },
            {
              "url": "https://neovim.io/doc/user/treesitter/",
              "title": "Neovim help: treesitter (an / in)"
            }
          ],
          "note": "Corrected 2026-11-10: ]c is a class (a change in diff mode); git hunks are ]h."
        }
      }
    ]
  },
  {
    "id": "lsp-pro-tips",
    "badge": "tip",
    "title": "Built-in LSP: Pro Tips & Chords",
    "subtitle": "LSP navigation, inlay hints & code actions (LazyVim keys; Neovim 0.11+ defaults in brackets)",
    "commands": [
      {
        "id": "lsp-tips-card",
        "mode": "PRO TIP",
        "modeClass": "mode-n",
        "desc": "LSP navigation, inlay hints & code actions (LazyVim keys; Neovim 0.11+ defaults in brackets)",
        "cmd": "gd   gr   K   |   <leader>ca   <leader>cr   |   [d   ]d",
        "details": "Native Neovim LSP powers modern IDE capabilities. Jump to definitions with gd, show hover docs with K, trigger code actions with <leader>ca, and navigate compiler diagnostics with [d and ]d.",
        "flags": [
          [
            "gd / gD",
            "Goto Definition / Declaration (LazyVim; Ctrl+] in plain Neovim)"
          ],
          [
            "gr (grr)",
            "Find all references across the project"
          ],
          [
            "K",
            "Show hover documentation float (press K again to focus float)"
          ],
          [
            "<leader>ca (gra)",
            "Code actions (quickfix, imports, refactor)"
          ],
          [
            "<leader>cr (grn)",
            "Rename symbol workspace-wide"
          ],
          [
            "[d / ]d",
            "Jump to previous / next diagnostic error or warning"
          ]
        ],
        "tip": "Since Neovim 0.10, turn on inlay hints with: vim.lsp.inlay_hint.enable()",
        "tags": [
          "lsp",
          "tips",
          "pro",
          "chords",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://neovim.io/doc/user/lsp/",
              "title": "Neovim help: LSP defaults"
            },
            {
              "url": "https://neovim.io/doc/user/news-0.11/",
              "title": "Neovim 0.11 news"
            },
            {
              "url": "https://www.lazyvim.org/keymaps",
              "title": "LazyVim keymaps"
            }
          ],
          "note": "Corrected 2026-11-10: gd and <leader>ca / <leader>cr are LazyVim keys; plain Neovim has Ctrl+], gra and grn."
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nvim_lsp_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = NVIM_LSP_DATA;
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

  for (const card of NVIM_LSP_DATA) {
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
        localStorage.setItem("nvim_lsp_bookmarks", JSON.stringify([...state.bookmarks]));
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
