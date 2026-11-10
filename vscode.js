// vscode.js
// Standalone interactive cheat sheet for Editors: VS Code (Linux): Shortcuts, Code Navigation, the code CLI & Remote-SSH
const ED_VSCODE_DATA = [
  {
    "id": "vscode-cmd-1",
    "badge": "code",
    "title": "VS Code: Command Palette and Quick Open",
    "subtitle": "Command Palette and Quick Open: find any command or file",
    "commands": [
      {
        "id": "vscode-palette",
        "desc": "Command Palette and Quick Open: find any command or file",
        "cmd": "Ctrl+Shift+P  ·  Ctrl+P",
        "details": "",
        "flags": [
          [
            "Ctrl+Shift+P (or F1)",
            "Command Palette: every command by name"
          ],
          [
            "Ctrl+P",
            "Quick Open a file by name; type : for a line, @ for a symbol, > for commands"
          ],
          [
            "Ctrl+,",
            "Settings"
          ],
          [
            "Ctrl+K Ctrl+S",
            "Keyboard Shortcuts editor (a chord: press Ctrl+K, release, then Ctrl+S)"
          ]
        ],
        "tip": "Forgot a key? Search the palette",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "command palette",
          "quick open",
          "settings",
          "shortcuts"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            },
            {
              "url": "https://code.visualstudio.com/docs/configure/keybindings",
              "title": "VS Code: keyboard shortcuts"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "vscode-cmd-2",
    "badge": "code",
    "title": "VS Code: Show and hide the panels",
    "subtitle": "Show and hide the panels",
    "commands": [
      {
        "id": "vscode-panels",
        "desc": "Show and hide the panels",
        "cmd": "Ctrl+B  ·  Ctrl+`",
        "details": "",
        "flags": [
          [
            "Ctrl+B",
            "Toggle the sidebar"
          ],
          [
            "Ctrl+`",
            "Toggle the integrated terminal"
          ],
          [
            "Ctrl+Shift+E",
            "Explorer"
          ],
          [
            "Ctrl+Shift+F / Ctrl+Shift+H",
            "Search / replace across files"
          ],
          [
            "Ctrl+Shift+G",
            "Source Control (git)"
          ],
          [
            "Ctrl+Shift+X",
            "Extensions"
          ]
        ],
        "tip": "Ctrl+` keeps a shell one key away",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "sidebar",
          "terminal",
          "explorer",
          "search",
          "git"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "vscode-cmd-3",
    "badge": "code",
    "title": "VS Code: Move through code",
    "subtitle": "Move through code: definitions, symbols, lines",
    "commands": [
      {
        "id": "vscode-navigate",
        "desc": "Move through code: definitions, symbols, lines",
        "cmd": "F12  ·  Ctrl+Shift+O  ·  Ctrl+G",
        "details": "",
        "flags": [
          [
            "F12",
            "Go to definition"
          ],
          [
            "Ctrl+Shift+F10",
            "Peek definition (Linux; Alt+F12 on Windows)"
          ],
          [
            "F2",
            "Rename a symbol everywhere"
          ],
          [
            "Ctrl+Shift+O",
            "Go to a symbol in this file"
          ],
          [
            "Ctrl+T",
            "Go to a symbol in the workspace"
          ],
          [
            "Ctrl+G",
            "Go to line"
          ]
        ],
        "tip": "F12 in, Ctrl+Alt+- back",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "definition",
          "symbol",
          "rename",
          "go to line"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "vscode-cmd-4",
    "badge": "code",
    "title": "VS Code: Multi-cursor and line editing",
    "subtitle": "Multi-cursor and line editing",
    "commands": [
      {
        "id": "vscode-multicursor",
        "desc": "Multi-cursor and line editing",
        "cmd": "Ctrl+D  ·  Shift+Alt+Down",
        "details": "",
        "flags": [
          [
            "Ctrl+D",
            "Select the next occurrence (repeat to add more cursors)"
          ],
          [
            "Ctrl+Shift+L",
            "Select all occurrences"
          ],
          [
            "Shift+Alt+Up / Down",
            "Add a cursor above / below (Linux; Ctrl+Alt on Windows)"
          ],
          [
            "Alt+Up / Down",
            "Move the line up / down"
          ],
          [
            "Ctrl+Shift+Alt+Down",
            "Copy the line down (Linux)"
          ],
          [
            "Ctrl+/",
            "Toggle a line comment"
          ],
          [
            "Ctrl+Shift+I",
            "Format the document (Linux; Shift+Alt+F on Windows)"
          ]
        ],
        "tip": "Ctrl+D is the fastest bulk rename",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "multi-cursor",
          "select",
          "move line",
          "comment",
          "format"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            },
            {
              "url": "https://github.com/microsoft/vscode/blob/main/src/vs/editor/contrib/linesOperations/browser/linesOperations.ts",
              "title": "VS Code source: line commands"
            }
          ],
          "note": "Copy line down is not in the PDF; its Linux binding is in VS Code's source."
        }
      }
    ]
  },
  {
    "id": "vscode-cmd-5",
    "badge": "code",
    "title": "VS Code: Split, close and focus",
    "subtitle": "Split, close and focus",
    "commands": [
      {
        "id": "vscode-layout",
        "desc": "Split, close and focus",
        "cmd": "Ctrl+\\  ·  Ctrl+W  ·  Ctrl+K Z",
        "details": "",
        "flags": [
          [
            "Ctrl+\\",
            "Split the editor"
          ],
          [
            "Ctrl+W",
            "Close the editor"
          ],
          [
            "Ctrl+K Z",
            "Zen mode; Esc Esc leaves it"
          ]
        ],
        "tip": "Zen mode for long write-ups",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "split",
          "close",
          "zen",
          "layout"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/shortcuts/keyboard-shortcuts-linux.pdf",
              "title": "VS Code: Linux shortcut reference (PDF)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "vscode-cmd-6",
    "badge": "code",
    "title": "VS Code: The code command",
    "subtitle": "The code command: open, jump to a line, diff",
    "commands": [
      {
        "id": "vscode-cli",
        "desc": "The code command: open, jump to a line, diff",
        "cmd": "code -r -g /etc/netplan/50-cloud-init.yaml:12",
        "details": "",
        "flags": [
          [
            "code .",
            "Open the current folder"
          ],
          [
            "-g / --goto file:line[:col]",
            "Open at a line, e.g. straight from a compiler or log error"
          ],
          [
            "-r / --reuse-window",
            "Use the window that is already open"
          ],
          [
            "-n / --new-window",
            "Force a new window"
          ],
          [
            "-d / --diff A B",
            "Side-by-side diff of two files"
          ],
          [
            "-w / --wait",
            "Return only when the file is closed (needed as a git editor)"
          ]
        ],
        "tip": "core.editor needs --wait",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "code",
          "cli",
          "diff",
          "goto",
          "git",
          "extensions"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      },
      {
        "id": "vscode-cli-sub-1",
        "desc": "Compare two configs",
        "cmd": "code --diff running.conf backup.conf",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "recipe",
          "code",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      },
      {
        "id": "vscode-cli-sub-2",
        "desc": "VS Code for commit messages and rebases",
        "cmd": "git config --global core.editor \"code --wait\"",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "recipe",
          "code",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      },
      {
        "id": "vscode-cli-sub-3",
        "desc": "What is installed (and which versions)",
        "cmd": "code --list-extensions --show-versions",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "recipe",
          "code",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      },
      {
        "id": "vscode-cli-sub-4",
        "desc": "Install an extension by ID (changes state)",
        "cmd": "code --install-extension ms-vscode-remote.remote-ssh",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "recipe",
          "code",
          "cli",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration",
              "title": "Git: core.editor"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "vscode-cmd-7",
    "badge": "code",
    "title": "VS Code: Edit files on a server over SSH",
    "subtitle": "Edit files on a server over SSH (Remote-SSH)",
    "commands": [
      {
        "id": "vscode-remote",
        "desc": "Edit files on a server over SSH (Remote-SSH)",
        "cmd": "Ctrl+Shift+P → Remote-SSH: Connect to Host...",
        "details": "",
        "flags": [
          [
            "Remote-SSH extension",
            "Runs a small VS Code server on the target; files, terminal and search work as if local"
          ],
          [
            "~/.ssh/config",
            "Hosts you define there (Host, HostName, User, ProxyJump) appear in the host list"
          ],
          [
            "ProxyJump jumpbox",
            "Reach lab nodes through the jumpbox without extra tunnels"
          ],
          [
            "code --remote ssh-remote+HOST /path",
            "The same from the command line"
          ],
          [
            "code tunnel",
            "Alternative when inbound SSH is blocked: the machine connects out (needs sign-in)"
          ]
        ],
        "tip": "Define hosts in ~/.ssh/config once",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "remote",
          "ssh",
          "remote-ssh",
          "tunnel",
          "jumpbox"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/remote/ssh",
              "title": "VS Code: Remote-SSH"
            },
            {
              "url": "https://code.visualstudio.com/docs/configure/command-line",
              "title": "VS Code: command line"
            },
            {
              "url": "https://code.visualstudio.com/docs/remote/tunnels",
              "title": "VS Code: Remote Tunnels"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "vscode-pro-tips",
    "badge": "tip",
    "title": "VS Code: Pro Tip",
    "subtitle": "VS Code 1.145 (November 2026): keys above are the Linux defaults",
    "commands": [
      {
        "id": "vscode-tips-card",
        "desc": "VS Code 1.145 (November 2026): keys above are the Linux defaults",
        "cmd": "Ctrl+K Ctrl+S",
        "details": "Linux, Windows and macOS defaults differ (peek, format, add-cursor). The Keyboard Shortcuts editor shows what your install actually uses and lets you search by key.",
        "flags": [
          [
            "Search by key",
            "Click the keyboard icon in the editor and press the combo"
          ],
          [
            "Settings Sync",
            "Sign in once and keybindings follow you to other machines"
          ]
        ],
        "tip": "Check your own bindings with Ctrl+K Ctrl+S",
        "tags": [
          "editor",
          "editors",
          "vscode",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://code.visualstudio.com/docs/configure/keybindings",
              "title": "VS Code: keyboard shortcuts"
            },
            {
              "url": "https://code.visualstudio.com/updates/v1_145",
              "title": "VS Code 1.145 release notes"
            },
            {
              "url": "https://code.visualstudio.com/docs/configure/settings-sync",
              "title": "VS Code: Settings Sync"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("vscode_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = ED_VSCODE_DATA;
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

  for (const card of ED_VSCODE_DATA) {
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
        localStorage.setItem("vscode_bookmarks", JSON.stringify([...state.bookmarks]));
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
