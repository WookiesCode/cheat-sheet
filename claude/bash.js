const BASH_CHEAT_SHEET_DATA = [
  {
    "id": "bash-vars",
    "badge": "vars",
    "title": "Variables, Data Types & Scope",
    "subtitle": "Variable assignment, string quoting, numbers, environment variables & readonly",
    "commands": [
      {
        "id": "bash-var-declare",
        "desc": "Variable assignment, quoting rules (single vs double vs raw), and string interpolation",
        "cmd": "NAME=\"Server-01\"\nCOUNT=42\nreadonly PI=\"3.14159\"\nexport API_KEY=\"secret_token\"\necho \"Host: ${NAME}, Count: $((COUNT + 1))\"",
        "flags": [
          [
            "No spaces around =",
            "NAME=\"val\" is valid; NAME = \"val\" fails with command not found"
          ],
          [
            "\"$DOUBLE_QUOTES\"",
            "Expands variables ($VAR) and subshells ($(cmd))"
          ],
          [
            "'SINGLE_QUOTES'",
            "Raw string literal: disables all expansion and variable interpolation"
          ],
          [
            "readonly VAR",
            "Prevents variable from being reassigned or unset"
          ],
          [
            "export VAR",
            "Exports variable to child processes and subshells in environment"
          ]
        ],
        "subcommands": [
          [
            "unset VAR",
            "Remove/delete variable from current shell environment"
          ],
          [
            "echo $((10 * 5 + 3))",
            "Integer arithmetic evaluation using $(( expression ))"
          ],
          [
            "RESULT=$(date +%Y-%m-%d)",
            "Command substitution: captures command stdout into variable"
          ]
        ],
        "tip": "Always wrap variables in quotes: \"$VAR\" to prevent word-splitting and globbing!",
        "tags": [
          "bash",
          "variables",
          "types",
          "scope",
          "export",
          "readonly",
          "quotes"
        ]
      },
      {
        "id": "bash-param-expansion-deep",
        "desc": "Advanced parameter expansion: defaults, substring slicing, length & pattern replacement",
        "cmd": "FILE=\"archive_2026.tar.gz\"\necho \"Ext: ${FILE##*.} | Base: ${FILE%%.*} | Len: ${#FILE}\"\nFALLBACK=\"${USER_PORT:-8080}\"\nUPPER=\"${FILE^^}\"",
        "flags": [
          [
            "${VAR:-default}",
            "Return default if VAR is unset or null (does not assign)"
          ],
          [
            "${VAR:=default}",
            "Set VAR to default if unset or null"
          ],
          [
            "${VAR#pattern} / ${VAR##pattern}",
            "Strip shortest (#) or longest (##) leading match from string"
          ],
          [
            "${VAR%pattern} / ${VAR%%pattern}",
            "Strip shortest (%) or longest (%%) trailing match from string"
          ],
          [
            "${VAR/find/replace}",
            "Replace first occurrence (${VAR//find/replace} for all occurrences)"
          ],
          [
            "${VAR:offset:length}",
            "Extract substring starting at offset for length characters"
          ],
          [
            "${VAR^^} / ${VAR,,}",
            "Convert string to all UPPERCASE (^^) or lowercase (,,)"
          ]
        ],
        "subcommands": [
          [
            "${VAR:?error_msg}",
            "Exit script with error_msg if VAR is unset or empty"
          ],
          [
            "${!PREFIX*}",
            "List all variable names currently defined starting with PREFIX"
          ]
        ],
        "tip": "Parameter expansions execute natively in memory inside Bash without spawning subshells or sed processes.",
        "tags": [
          "bash",
          "parameter-expansion",
          "substring",
          "defaults",
          "string-manipulation"
        ]
      },
      {
        "id": "bash-arrays",
        "desc": "Indexed arrays, associative key-value maps, iteration & element manipulation",
        "cmd": "# Indexed array\nNODES=(\"node-01\" \"node-02\" \"node-03\")\nNODES+=(\"node-04\")\necho \"First: ${NODES[0]} | Total: ${#NODES[@]}\"\n\n# Associative array (Bash 4+)\ndeclare -A BMC_IPS\nBMC_IPS=([\"node-01\"]=\"10.0.0.10\" [\"node-02\"]=\"10.0.0.11\")\necho \"IP: ${BMC_IPS[\"node-01\"]}\"",
        "flags": [
          [
            "${ARRAY[@]}",
            "Expands to all elements as separate quoted words"
          ],
          [
            "${#ARRAY[@]}",
            "Returns count/length of elements in array"
          ],
          [
            "${!ARRAY[@]}",
            "Returns list of indices or associative keys"
          ],
          [
            "ARRAY+=(\"val\")",
            "Appends new element to end of indexed array"
          ],
          [
            "declare -A MAP",
            "Mandatory declaration for associative arrays (hash maps)"
          ]
        ],
        "subcommands": [
          [
            "unset 'ARRAY[1]'",
            "Deletes element at index 1"
          ],
          [
            "for k in \"${!BMC_IPS[@]}\"; do echo \"$k -> ${BMC_IPS[$k]}\"; done",
            "Iterate over associative array key-value pairs"
          ]
        ],
        "tip": "Always use \"${ARRAY[@]}\" with quotes so items containing spaces aren't split into multiple arguments.",
        "tags": [
          "bash",
          "arrays",
          "associative",
          "hashmap",
          "collections"
        ]
      }
    ]
  },
  {
    "id": "bash-control",
    "badge": "control",
    "title": "Conditionals & Comparison Operators",
    "subtitle": "Modern [[ ... ]] tests, integer vs string checks, file tests & case statements",
    "commands": [
      {
        "id": "bash-if-conditions",
        "desc": "Modern [[ ... ]] conditional branching with integer, string, file tests & regex matching",
        "cmd": "PORT=8080\nif [[ -f \"/etc/server.conf\" && \"$PORT\" -gt 1024 ]]; then\n  echo \"Valid config on unprivileged port\"\nelif [[ ! -e \"/etc/server.conf\" ]]; then\n  echo \"Config missing\"\nelse\n  echo \"Port requires root\"\nfi",
        "flags": [
          [
            "-eq, -ne, -lt, -gt, -le, -ge",
            "Integer comparisons only (never use == or < for numbers)"
          ],
          [
            "==, !=, <, >",
            "String lexicographical comparisons inside [[ ... ]]"
          ],
          [
            "-z \"$VAR\" / -n \"$VAR\"",
            "-z tests if string is empty; -n tests if string is non-empty"
          ],
          [
            "-f file / -d dir",
            "-f tests if regular file exists; -d tests if directory exists"
          ],
          [
            "-e path / -s file",
            "-e tests if path exists; -s tests if file exists and size > 0"
          ],
          [
            "-r, -w, -x",
            "Tests if file is readable (-r), writable (-w), or executable (-x)"
          ],
          [
            "[[ \"$STR\" =~ ^[0-9]+$ ]]",
            "Regex pattern matching natively supported inside [[ ... ]]"
          ]
        ],
        "subcommands": [
          [
            "[[ condition ]] && true_action || false_action",
            "Compact ternary-style short-circuit execution"
          ],
          [
            "(( COUNT > 10 ))",
            "Arithmetic evaluation conditional without dollar signs"
          ]
        ],
        "tip": "Always use [[ ... ]] instead of legacy [ ... ] in Bash to prevent syntax errors on empty strings.",
        "tags": [
          "bash",
          "if",
          "conditionals",
          "comparison",
          "regex",
          "file-tests"
        ]
      },
      {
        "id": "bash-case-match",
        "desc": "Multi-branch pattern matching with case / esac statements and glob wildcards",
        "cmd": "case \"$1\" in\n  start|START)\n    echo \"Starting service...\" ;;\n  stop)\n    echo \"Stopping service...\" ;;\n  --port=*) \n    PORT=\"${1#*=}\" ;;\n  *)\n    echo \"Usage: $0 {start|stop|--port=N}\" >&2\n    exit 1 ;;\nesac",
        "flags": [
          [
            "pattern1 | pattern2)",
            "Matches either pattern1 or pattern2"
          ],
          [
            ";;",
            "Terminates the branch (like break in C/Java)"
          ],
          [
            ";;&",
            "Tests subsequent patterns (fallthrough evaluation)"
          ],
          [
            "*)",
            "Default fallback matching anything not matched above"
          ]
        ],
        "subcommands": [
          [
            "case \"$OS\" in [Uu]buntu|[Dd]ebian) PKG=\"apt\" ;; [Rr][Hh][Ee][Ll]) PKG=\"dnf\" ;; esac",
            "Case-insensitive OS branching"
          ]
        ],
        "tip": "Use case statements for CLI argument parsing instead of nested if-elif-else blocks for clean code.",
        "tags": [
          "bash",
          "case",
          "switch",
          "branching",
          "cli-args"
        ]
      }
    ]
  },
  {
    "id": "bash-loops",
    "badge": "loops",
    "title": "Loops & Iteration",
    "subtitle": "for loops, numeric ranges, while loops, safe file reading & loop control",
    "commands": [
      {
        "id": "bash-for-loops",
        "desc": "Iterate over lists, file wildcards, brace expansions and C-style 3-expression loops",
        "cmd": "# Loop over array or words\nfor HOST in \"node-01\" \"node-02\" \"node-03\"; do\n  ping -c 1 \"$HOST\" >/dev/null && echo \"$HOST online\"\ndone\n\n# Numeric range & C-style loop\nfor i in {1..5}; do echo \"Step $i\"; done\nfor ((i=0; i<10; i+=2)); do echo \"Even: $i\"; done",
        "flags": [
          [
            "for item in \"${LIST[@]}\"",
            "Iterate over every item in an array safely"
          ],
          [
            "for f in /var/log/*.log",
            "Iterate over all matching files (globbing)"
          ],
          [
            "{1..10..2}",
            "Brace expansion: start..end..step (Bash 4+)"
          ],
          [
            "break / continue",
            "break exits loop immediately; continue skips to next iteration"
          ]
        ],
        "subcommands": [
          [
            "for f in *; do [[ -f \"$f\" ]] || continue; echo \"$f\"; done",
            "Skip non-files safely"
          ],
          [
            "for ((;;)); do echo \"Infinite\"; sleep 1; done",
            "Infinite loop with sleep interval"
          ]
        ],
        "tip": "Never use for line in $(cat file.txt); words with spaces will break into multiple loop iterations!",
        "tags": [
          "bash",
          "for",
          "loops",
          "range",
          "iteration",
          "brace-expansion"
        ]
      },
      {
        "id": "bash-while-read",
        "desc": "Safe line-by-line file reading without trailing newline loss & stream iteration",
        "cmd": "while IFS= read -r LINE || [[ -n \"$LINE\" ]]; do\n  [[ \"$LINE\" =~ ^# || -z \"$LINE\" ]] && continue\n  echo \"Processing: $LINE\"\ndone < \"/etc/hosts\"",
        "flags": [
          [
            "IFS=",
            "Clears Internal Field Separator to preserve leading/trailing whitespace"
          ],
          [
            "read -r",
            "Prevents backslash escapes from being interpreted or stripped"
          ],
          [
            "|| [[ -n \"$LINE\" ]]",
            "Ensures last line of file is processed even if missing trailing newline"
          ],
          [
            "done < file",
            "Feeds file directly to loop without spawning subshell processes"
          ]
        ],
        "subcommands": [
          [
            "command | while IFS= read -r line; do ... done",
            "Process stdout stream of command line-by-line"
          ],
          [
            "while IFS=',' read -r col1 col2 col3; do ... done < data.csv",
            "Parse CSV columns directly into variables"
          ]
        ],
        "tip": "done < file runs in current shell so variables modified inside loop persist after loop finishes.",
        "tags": [
          "bash",
          "while",
          "read",
          "stream",
          "file-io",
          "csv"
        ]
      }
    ]
  },
  {
    "id": "bash-func-err",
    "badge": "func",
    "title": "Functions, CLI Arguments & Error Traps",
    "subtitle": "Function declarations, argument parsing, return codes & automatic cleanup traps",
    "commands": [
      {
        "id": "bash-functions-args",
        "desc": "Function definitions, local variables, return status vs return values & CLI arguments",
        "cmd": "#!/usr/bin/env bash\nset -euo pipefail\n\nlog_msg() {\n  local LEVEL=\"$1\"\n  local MESSAGE=\"$2\"\n  echo \"[$(date +%T)] [${LEVEL}] ${MESSAGE}\"\n}\n\nlog_msg \"INFO\" \"Script started with $# arguments (Args: $@)\"",
        "flags": [
          [
            "local VAR=\"val\"",
            "Restricts variable scope strictly to function body (essential!)"
          ],
          [
            "$1, $2 ... $9",
            "Positional arguments passed to function or script"
          ],
          [
            "$#",
            "Total count of positional arguments passed"
          ],
          [
            "$@",
            "All arguments passed as individually quoted words (\"$1\" \"$2\")"
          ],
          [
            "$*",
            "All arguments joined into a single string (\"$1 $2\")"
          ],
          [
            "return N",
            "Exits function returning numeric exit code (0 = success, 1-255 = error)"
          ],
          [
            "echo \"$val\"",
            "Return strings/data by echoing from function and capturing with $(func)"
          ]
        ],
        "subcommands": [
          [
            "shift",
            "Shifts positional arguments to the left: $2 becomes $1, $# decrements"
          ],
          [
            "getopts \"p:h\" opt",
            "Standard POSIX option parsing loop for flags like -p 8080 -h"
          ]
        ],
        "tip": "set -euo pipefail at the top of your scripts catches uninitialized variables and pipe errors immediately.",
        "tags": [
          "bash",
          "functions",
          "local",
          "arguments",
          "flags",
          "getopts"
        ]
      },
      {
        "id": "bash-traps-cleanup",
        "desc": "Automatic cleanup on script exit, interruption (Ctrl+C) and error handling",
        "cmd": "TMPDIR=$(mktemp -d)\ncleanup() {\n  echo \"Cleaning up temporary directory: $TMPDIR\"\n  rm -rf \"$TMPDIR\"\n}\ntrap cleanup EXIT ERR INT TERM\n\n# Your script logic below\necho \"Working in $TMPDIR...\"",
        "flags": [
          [
            "trap cleanup EXIT",
            "Runs cleanup function whenever script terminates for ANY reason"
          ],
          [
            "trap cleanup INT",
            "Runs cleanup when user interrupts with Ctrl+C (SIGINT)"
          ],
          [
            "trap cleanup TERM",
            "Runs cleanup when killed by systemd or kill command (SIGTERM)"
          ],
          [
            "trap cleanup ERR",
            "Triggers when any command fails with non-zero exit code"
          ],
          [
            "$? == 0",
            "Checks exit code of immediately preceding command (0 = success)"
          ]
        ],
        "subcommands": [
          [
            "trap - EXIT",
            "Disables/unregisters the trap handler"
          ],
          [
            "trap 'echo \"Error on line $LINENO\"' ERR",
            "Print file line number where an error occurred"
          ]
        ],
        "tip": "Traps guarantee temporary scratch directories and lock files are cleaned up even if script crashes.",
        "tags": [
          "bash",
          "trap",
          "cleanup",
          "exit",
          "signals",
          "error-handling"
        ]
      }
    ]
  }
];

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("bash_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
const sectionsContainer = document.getElementById("sections-container");
const categoryTabsEl = document.getElementById("category-tabs");
const searchInput = document.getElementById("search-input");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const themeToggleBtn = document.getElementById("theme-toggle");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");
const printBtn = document.getElementById("print-btn");

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
  if (!toast) return;
  toastText.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied snippet to clipboard");
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
  showToast("Copied snippet to clipboard");
}

// Shell & language syntax highlighter
function highlightCommand(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return `<span class="tok-str">${strLiteral}</span>`;
      if (flagPart) return `<span class="tok-flag">${flagPart}</span>`;
      if (operatorPart) return `<span class="tok-pipe">${operatorPart}</span>`;
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? `<span class="tok-pipe">${sudoPart}</span>` : "";
        return `${prefix}${sudoHtml}<span class="tok-cmd">${cmdName}</span>`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = BASH_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of BASH_CHEAT_SHEET_DATA) {
    const isSelected = state.activeCategory === section.id ? "selected" : "";
    optionsHtml.push(
      `<option value="${section.id}" ${isSelected}>${escapeHtml(section.title)} (${section.commands.length})</option>`
    );
  }

  const resetBtnHtml =
    state.activeCategory !== "all"
      ? `<button type="button" class="cat-reset-btn" data-cat="all" title="Show all sections">✕ Show All</button>`
      : "";

  categoryTabsEl.innerHTML = `
    <div class="cat-dropdown-wrap">
      <label class="cat-dropdown-label" for="category-select">Section:</label>
      <select id="category-select" class="cat-select" aria-label="Filter by ${escapeHtml('Bash')} section">
        ${optionsHtml.join("")}
      </select>
      ${resetBtnHtml}
    </div>
  `;

  const sel = document.getElementById("category-select");
  if (sel) {
    sel.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderSections();
    });
  }

  const resetBtn = categoryTabsEl.querySelector(".cat-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmdObj, section, query) {
  if (!query) return true;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    cmdObj.desc,
    cmdObj.cmd,
    cmdObj.details || "",
    cmdObj.tip || "",
    section.title,
    section.subtitle,
    ...(cmdObj.tags || []),
    ...(cmdObj.flags || []).flat(),
    ...(cmdObj.subcommands || []).flat()
  ]
    .join(" ")
    .toLowerCase();

  return terms.every((t) => haystack.includes(t));
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

let masonryResizeTimer;
function scheduleMasonry() {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
}
window.addEventListener("resize", scheduleMasonry);
document.addEventListener("fullscreenchange", scheduleMasonry);

if (typeof ResizeObserver !== "undefined" && sectionsContainer) {
  let lastObservedWidth = 0;
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.round(entry.contentRect.width);
      if (w > 0 && Math.abs(w - lastObservedWidth) > 10) {
        lastObservedWidth = w;
        scheduleMasonry();
      }
    }
  });
  ro.observe(sectionsContainer);
}

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of BASH_CHEAT_SHEET_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const filteredCommands = section.commands.filter((cmdObj) => {
      if (state.savedOnly && !state.bookmarks.has(cmdObj.id)) {
        return false;
      }
      return matchesSearch(cmdObj, section, state.searchQuery);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const itemsHtml = filteredCommands
      .map((item) => {
        const isSaved = state.bookmarks.has(item.id);
        const tipHtml = item.tip ? `<span class="tip-badge">${escapeHtml(item.tip)}</span>` : "";
        const detailsHtml = item.details ? `<p class="cmd-details">${escapeHtml(item.details)}</p>` : "";

        const flagsHtml =
          item.flags && item.flags.length
            ? `<div class="flag-pills">
                ${item.flags
                  .map(
                    ([flag, exp]) =>
                      `<span class="flag-pill"><code>${escapeHtml(flag)}</code> <span>${escapeHtml(exp)}</span></span>`
                  )
                  .join("")}
              </div>`
            : "";

        const subcommandsHtml =
          item.subcommands && item.subcommands.length
            ? `<div class="subcmd-list">
                <span class="subcmd-header">Subcommands, Variations &amp; Snippets</span>
                ${item.subcommands
                  .map(
                    ([subcmd, exp]) =>
                      `<div class="subcmd-row" data-copy="${escapeHtml(subcmd)}" title="Click to copy snippet">
                        <code>${escapeHtml(subcmd)}</code>
                        <span>${escapeHtml(exp)}</span>
                      </div>`
                  )
                  .join("")}
              </div>`
            : "";

        return `
          <div class="cmd-item" id="${item.id}" data-id="${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                <span>${escapeHtml(item.desc)}</span>
                ${tipHtml}
              </div>
              <div class="cmd-actions">
                <button
                  type="button"
                  class="icon-btn bookmark-btn ${isSaved ? "bookmarked" : ""}"
                  data-bookmark-id="${item.id}"
                  title="${isSaved ? "Remove bookmark" : "Bookmark snippet"}"
                  aria-label="Bookmark snippet"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(item.cmd)}" title="Click to copy snippet">
              <code class="cmd-code">${highlightCommand(item.cmd)}</code>
              <span class="copy-hint">Copy</span>
            </div>

            ${detailsHtml}
            ${flagsHtml}
            ${subcommandsHtml}
          </div>
        `;
      })
      .join("");

    cardsHtml.push(`
      <article class="section-card" id="sec-${section.id}">
        <header class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">${escapeHtml(section.badge)}</span>
            <div>
              <h2 class="section-title">${escapeHtml(section.title)}</h2>
              <p class="section-subtitle">${escapeHtml(section.subtitle)}</p>
            </div>
          </div>
          <span class="count-badge">${filteredCommands.length}</span>
        </header>
        <div class="command-list">
          ${itemsHtml}
        </div>
      </article>
    `);
  }

  sectionsContainer.innerHTML = cardsHtml.join("");
  packMasonry();
  visibleCountEl.textContent = visibleCommandsCount;
  savedCountEl.textContent = state.bookmarks.size;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
    sectionsContainer.classList.add("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
    sectionsContainer.classList.remove("hidden");
  }
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.AntigravityCommon && window.AntigravityCommon.applyTheme) {
    window.AntigravityCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch(e) {}
  }
}

function applyDensity(compact) {
  state.compact = compact;
  document.body.classList.toggle("compact-density", compact);
  densityLabel.textContent = compact ? "Relaxed" : "Compact";
  localStorage.setItem("linux_cs_compact", compact ? "1" : "0");
  packMasonry();
}

function initEvents() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    renderSections();
  });

  sectionsContainer.addEventListener("click", (e) => {
    const copyBox = e.target.closest(".cmd-code-box, .subcmd-row");
    if (copyBox) {
      copyToClipboard(copyBox.dataset.copy);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const id = bookmarkBtn.dataset.bookmarkId;
      if (state.bookmarks.has(id)) {
        state.bookmarks.delete(id);
        bookmarkBtn.classList.remove("bookmarked");
        bookmarkBtn.textContent = "☆";
        bookmarkBtn.title = "Bookmark snippet";
        showToast("Removed from saved bookmarks");
      } else {
        state.bookmarks.add(id);
        bookmarkBtn.classList.add("bookmarked");
        bookmarkBtn.textContent = "★";
        bookmarkBtn.title = "Remove bookmark";
        showToast("Added to saved bookmarks");
      }
      localStorage.setItem("bash_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      savedCountEl.textContent = state.bookmarks.size;
      if (state.savedOnly) {
        renderSections();
      }
    }
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    savedFilterBtn.classList.toggle("active", state.savedOnly);
    renderSections();
  });

  densityToggleBtn.addEventListener("click", () => {
    applyDensity(!state.compact);
  });

  if (printBtn) printBtn.addEventListener("click", () => {
    window.print();
  });

  themeToggleBtn.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.activeCategory = "all";
    state.savedOnly = false;
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape") {
      if (document.activeElement === searchInput || state.searchQuery) {
        searchInput.value = "";
        state.searchQuery = "";
        searchInput.blur();
        renderSections();
      }
    }
  });
}

// Initialize
applyTheme(state.theme);
applyDensity(state.compact);
renderCategoryTabs();
renderSections();
initEvents();
