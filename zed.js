// zed.js
// Standalone interactive cheat sheet for Editors: Zed (Linux): Default Keys, Panels, Agent & the zed CLI
const ED_ZED_DATA = [
  {
    "id": "zed-cmd-1",
    "badge": "zed",
    "title": "Zed: Command palette, file finder, settings and keymap",
    "subtitle": "Command palette, file finder, settings and keymap",
    "commands": [
      {
        "id": "zed-palette",
        "desc": "Command palette, file finder, settings and keymap",
        "cmd": "ctrl-shift-p  ·  ctrl-p",
        "details": "",
        "flags": [
          [
            "ctrl-shift-p (or f1)",
            "Command palette"
          ],
          [
            "ctrl-p (or ctrl-e)",
            "File finder"
          ],
          [
            "ctrl-,",
            "Settings window"
          ],
          [
            "ctrl-alt-,",
            "Open the settings file (JSON)"
          ],
          [
            "ctrl-k ctrl-s",
            "Keymap editor"
          ]
        ],
        "tip": "zed: open default keymap shows every binding",
        "tags": [
          "editor",
          "editors",
          "zed",
          "palette",
          "file finder",
          "settings",
          "keymap"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            },
            {
              "url": "https://zed.dev/docs/key-bindings",
              "title": "Zed: key bindings"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "zed-cmd-2",
    "badge": "zed",
    "title": "Zed: Docks, terminal and project search",
    "subtitle": "Docks, terminal and project search",
    "commands": [
      {
        "id": "zed-panels",
        "desc": "Docks, terminal and project search",
        "cmd": "ctrl-b  ·  ctrl-`",
        "details": "",
        "flags": [
          [
            "ctrl-b",
            "Toggle the left dock"
          ],
          [
            "ctrl-shift-e",
            "Project panel (file tree)"
          ],
          [
            "ctrl-`",
            "Toggle the terminal panel"
          ],
          [
            "ctrl-j",
            "Toggle the bottom dock"
          ],
          [
            "ctrl-shift-f / ctrl-shift-h",
            "Search / replace across the project"
          ]
        ],
        "tip": "Most default keys match VS Code's",
        "tags": [
          "editor",
          "editors",
          "zed",
          "dock",
          "terminal",
          "project",
          "search"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "zed-cmd-3",
    "badge": "zed",
    "title": "Zed: Definitions, references, symbols",
    "subtitle": "Definitions, references, symbols",
    "commands": [
      {
        "id": "zed-navigate",
        "desc": "Definitions, references, symbols",
        "cmd": "f12  ·  alt-shift-f12",
        "details": "",
        "flags": [
          [
            "f12",
            "Go to definition"
          ],
          [
            "alt-shift-f12",
            "Find all references"
          ],
          [
            "f2",
            "Rename symbol"
          ],
          [
            "ctrl-shift-o",
            "Outline: symbols in this file"
          ],
          [
            "ctrl-t",
            "Symbols across the project"
          ],
          [
            "ctrl-g",
            "Go to line"
          ]
        ],
        "tip": "ctrl-shift-o for a quick file outline",
        "tags": [
          "editor",
          "editors",
          "zed",
          "definition",
          "references",
          "symbols",
          "go to line"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "zed-cmd-4",
    "badge": "zed",
    "title": "Zed: Multi-cursor and line editing",
    "subtitle": "Multi-cursor and line editing",
    "commands": [
      {
        "id": "zed-editing",
        "desc": "Multi-cursor and line editing",
        "cmd": "ctrl-d  ·  shift-alt-down",
        "details": "",
        "flags": [
          [
            "ctrl-d",
            "Select the next occurrence"
          ],
          [
            "shift-alt-up / shift-alt-down",
            "Add a cursor above / below"
          ],
          [
            "alt-up / alt-down",
            "Move the line"
          ],
          [
            "ctrl-alt-shift-up / down",
            "Duplicate the line"
          ],
          [
            "ctrl-/",
            "Toggle comment"
          ],
          [
            "ctrl-shift-i",
            "Format"
          ],
          [
            "ctrl-\\ / ctrl-w",
            "Split right / close the tab"
          ]
        ],
        "tip": "Muscle memory from VS Code carries over",
        "tags": [
          "editor",
          "editors",
          "zed",
          "multi-cursor",
          "move line",
          "duplicate",
          "comment",
          "format",
          "split"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "zed-cmd-5",
    "badge": "zed",
    "title": "Zed: AI",
    "subtitle": "AI: agent panel and inline assist",
    "commands": [
      {
        "id": "zed-agent",
        "desc": "AI: agent panel and inline assist",
        "cmd": "ctrl-?  ·  ctrl-enter",
        "details": "",
        "flags": [
          [
            "ctrl-?",
            "Focus the agent panel (opens it if closed)"
          ],
          [
            "ctrl-enter (in the editor)",
            "Inline assist on the selection or the current line"
          ],
          [
            "Providers",
            "Configure models in the agent panel's settings"
          ]
        ],
        "tip": "Select code first, then ctrl-enter",
        "tags": [
          "editor",
          "editors",
          "zed",
          "ai",
          "agent",
          "inline assist",
          "assistant"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            },
            {
              "url": "https://zed.dev/docs/ai/agent-panel",
              "title": "Zed: agent panel"
            },
            {
              "url": "https://zed.dev/docs/ai/inline-assistant",
              "title": "Zed: inline assistant"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "zed-cmd-6",
    "badge": "zed",
    "title": "Zed: The zed command",
    "subtitle": "The zed command: open a folder, a line, a diff",
    "commands": [
      {
        "id": "zed-cli",
        "desc": "The zed command: open a folder, a line, a diff",
        "cmd": "zed /etc/netplan/50-cloud-init.yaml:12:5",
        "details": "",
        "flags": [
          [
            "zed ~/projects/repo",
            "Open a folder as a workspace"
          ],
          [
            "zed file:42 / file:42:10",
            "Open at a line (and column)"
          ],
          [
            "--diff OLD NEW",
            "Diff two files"
          ],
          [
            "-n / -a / -e",
            "New workspace / add to the current workspace / open in an existing window (-r, reuse, still works but is hidden from --help)"
          ],
          [
            "-w / --wait",
            "Wait for the file to close (for git core.editor)"
          ],
          [
            "zeditor",
            "Some Linux packages name the binary zeditor instead of zed"
          ]
        ],
        "tip": "core.editor needs --wait",
        "tags": [
          "editor",
          "editors",
          "zed",
          "zed",
          "cli",
          "diff",
          "git"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/crates/cli/src/main.rs",
              "title": "Zed CLI source (flags)"
            },
            {
              "url": "https://zed.dev/docs/linux",
              "title": "Zed on Linux (zeditor)"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ],
          "note": "Corrected 2026-11-10: -r is hidden; -e / --existing opens in an existing window."
        }
      },
      {
        "id": "zed-cli-sub-1",
        "desc": "Zed for commit messages",
        "cmd": "git config --global core.editor \"zed --wait\"",
        "tags": [
          "editor",
          "editors",
          "zed",
          "recipe",
          "zed",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/crates/cli/src/main.rs",
              "title": "Zed CLI source (flags)"
            },
            {
              "url": "https://zed.dev/docs/linux",
              "title": "Zed on Linux (zeditor)"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ],
          "note": "Corrected 2026-11-10: -r is hidden; -e / --existing opens in an existing window."
        }
      },
      {
        "id": "zed-cli-sub-2",
        "desc": "Installed version",
        "cmd": "zed --version",
        "tags": [
          "editor",
          "editors",
          "zed",
          "recipe",
          "zed",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/zed-industries/zed/blob/main/crates/cli/src/main.rs",
              "title": "Zed CLI source (flags)"
            },
            {
              "url": "https://zed.dev/docs/linux",
              "title": "Zed on Linux (zeditor)"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ],
          "note": "Corrected 2026-11-10: -r is hidden; -e / --existing opens in an existing window."
        }
      }
    ]
  },
  {
    "id": "zed-cmd-7",
    "badge": "zed",
    "title": "Zed: Keymap file, base keymap and vim mode",
    "subtitle": "Keymap file, base keymap and vim mode",
    "commands": [
      {
        "id": "zed-config",
        "desc": "Keymap file, base keymap and vim mode",
        "cmd": "~/.config/zed/keymap.json",
        "details": "",
        "flags": [
          [
            "~/.config/zed/keymap.json",
            "Your bindings (Linux); they take precedence over the defaults"
          ],
          [
            "zed: toggle base keymap selector",
            "Switch the base keymap: Zed (default), VS Code, JetBrains, Sublime Text, Emacs (beta), Cursor…"
          ],
          [
            "\"vim_mode\": true",
            "Vim keys, set in settings.json (open it with ctrl-alt-,)"
          ]
        ],
        "tip": "Keymap editor writes keymap.json for you",
        "tags": [
          "editor",
          "editors",
          "zed",
          "keymap",
          "settings",
          "vim",
          "base keymap",
          "config"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://zed.dev/docs/key-bindings",
              "title": "Zed: key bindings"
            },
            {
              "url": "https://zed.dev/docs/vim",
              "title": "Zed: Vim mode"
            }
          ],
          "note": "Corrected 2026-11-10: the default base keymap is Zed, not VS Code."
        }
      }
    ]
  },
  {
    "id": "zed-pro-tips",
    "badge": "tip",
    "title": "Zed: Pro Tip",
    "subtitle": "Zed 1.27 (November 2026): check the bindings your build ships",
    "commands": [
      {
        "id": "zed-tips-card",
        "desc": "Zed 1.27 (November 2026): check the bindings your build ships",
        "cmd": "ctrl-shift-p → zed: open default keymap",
        "details": "Zed updates often. The default keymap file is the source of truth for every action and its key; search it for an action name to find its binding.",
        "flags": [
          [
            "Actions",
            "There is no separate action list: the palette and the default keymap are it"
          ],
          [
            "Linux vs macOS",
            "These are the Linux keys; macOS uses cmd"
          ]
        ],
        "tip": "The default keymap is the reference",
        "tags": [
          "editor",
          "editors",
          "zed",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://zed.dev/docs/key-bindings",
              "title": "Zed: key bindings"
            },
            {
              "url": "https://github.com/zed-industries/zed/blob/main/assets/keymaps/default-linux.json",
              "title": "Zed default Linux keymap"
            },
            {
              "url": "https://github.com/zed-industries/zed/releases",
              "title": "Zed releases"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("zed_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = ED_ZED_DATA;
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

  for (const card of ED_ZED_DATA) {
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
        localStorage.setItem("zed_bookmarks", JSON.stringify([...state.bookmarks]));
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
