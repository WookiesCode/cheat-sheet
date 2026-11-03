const PYTHON_CHEAT_SHEET_DATA = [
  {
    "id": "py-vars-types",
    "badge": "types",
    "title": "Variables, Types & Data Structures",
    "subtitle": "Variable declarations, type hints, lists, dicts, tuples, sets & comprehensions",
    "commands": [
      {
        "id": "py-variables-typing",
        "desc": "Variable declarations, type annotations, and modern f-string formatting",
        "cmd": "# Variable assignment with type hints\nhost: str = \"node-01\"\nport: int = 8080\ntemp: float = 42.5\nis_active: bool = True\n\n# Formatted f-strings (Python 3.6+)\nprint(f\"Host: {host.upper()} | Port: {port} | Temp: {temp:.1f}°C\")",
        "flags": [
          [
            "str, int, float, bool",
            "Primitive Python built-in types"
          ],
          [
            "name: type = val",
            "Type hints: documented types checked by mypy and IDEs"
          ],
          [
            "f\"{val:.2f}\"",
            "Format float to 2 decimal places inside f-string"
          ],
          [
            "f\"{val=}\"",
            "Python 3.8+ debugging print shorthand: outputs 'val=42'"
          ],
          [
            "r\"raw\\string\"",
            "Raw string: backslashes are not treated as escape sequences"
          ]
        ],
        "subcommands": [
          [
            "type(var)",
            "Inspect dynamic runtime type of variable"
          ],
          [
            "isinstance(var, (int, float))",
            "Check if variable matches one or more types"
          ],
          [
            "None",
            "Python's null/nil singleton representing absence of value"
          ]
        ],
        "tip": "Type hints don't affect runtime speed, but prevent common bugs and enable autocomplete in editors.",
        "tags": [
          "python",
          "variables",
          "types",
          "f-strings",
          "annotations",
          "primitives"
        ]
      },
      {
        "id": "py-collections-deep",
        "desc": "Core collections: Lists (mutable), Dicts (hashmap), Tuples (immutable) & Sets (unique)",
        "cmd": "# List & Tuple\nnodes: list[str] = [\"node-01\", \"node-02\", \"node-03\"]\ncoordinates: tuple[int, int] = (10, 20)\n\n# Dictionary (Hashmap)\nbmc_info: dict[str, str] = {\"ip\": \"10.0.0.10\", \"user\": \"ADMIN\"}\nbmc_info[\"status\"] = \"ONLINE\"\n\n# Unique Set\nsubnets: set[str] = {\"10.0.0.0/24\", \"192.168.1.0/24\"}",
        "flags": [
          [
            "list.append(x)",
            "Appends element x to end of list"
          ],
          [
            "list[start:stop:step]",
            "Slice list: [::-1] reverses, [:2] gets first 2 items"
          ],
          [
            "dict.get(key, default)",
            "Safe key lookup returning default if key doesn't exist"
          ],
          [
            "dict.items()",
            "Returns iterable (key, value) tuples for looping"
          ],
          [
            "set.union() / set.intersection()",
            "Set mathematical operations (&, |, -)"
          ]
        ],
        "subcommands": [
          [
            "nums = [x * 2 for x in range(5) if x % 2 == 0]",
            "List comprehension: compact, fast list building"
          ],
          [
            "mapping = {k: v.upper() for k, v in bmc_info.items()}",
            "Dictionary comprehension"
          ],
          [
            "a, b, *rest = [1, 2, 3, 4, 5]",
            "Extended iterable unpacking into variables"
          ]
        ],
        "tip": "Always use dict.get(\"key\", default) instead of dict[\"key\"] to avoid raising KeyError exceptions.",
        "tags": [
          "python",
          "collections",
          "list",
          "dict",
          "tuple",
          "set",
          "comprehensions"
        ]
      }
    ]
  },
  {
    "id": "py-control-flow",
    "badge": "control",
    "title": "Conditionals & Pattern Matching",
    "subtitle": "if-elif-else, boolean logic, membership operators & Python 3.10+ match/case",
    "commands": [
      {
        "id": "py-if-else",
        "desc": "Conditional branching with boolean operators (and, or, not) and membership tests",
        "cmd": "status = \"CRITICAL\"\ntemp = 85.5\n\nif status == \"CRITICAL\" and temp > 80.0:\n    print(\"Emergency thermal throttling triggered!\")\nelif status in (\"WARNING\", \"DEGRADED\"):\n    print(\"Warning state detected\")\nelse:\n    print(\"Normal operation\")\n\n# Ternary expression\nmode = \"production\" if is_active else \"staging\"",
        "flags": [
          [
            "and, or, not",
            "Readable boolean logical operators (not &&, ||, !)"
          ],
          [
            "x in collection",
            "Checks membership in list, set, tuple, or string substring"
          ],
          [
            "is / is not",
            "Identity check (checks memory address: use exclusively for None)"
          ],
          [
            "Truthy vs Falsy",
            "Falsy values: 0, 0.0, \"\", [], {}, set(), None, False"
          ],
          [
            "x if cond else y",
            "One-line ternary conditional expression"
          ]
        ],
        "subcommands": [
          [
            "if not my_list:",
            "Idiomatic way to check if a list/string/dict is empty"
          ],
          [
            "any([x > 80 for x in temps])",
            "Returns True if at least one item satisfies condition"
          ],
          [
            "all([x > 0 for x in temps])",
            "Returns True only if every item satisfies condition"
          ]
        ],
        "tip": "Never compare with 'if var == None:'. Always write 'if var is None:' for identity comparison.",
        "tags": [
          "python",
          "if",
          "else",
          "conditionals",
          "ternary",
          "truthy",
          "falsy"
        ]
      },
      {
        "id": "py-match-case",
        "desc": "Modern structural pattern matching (Python 3.10+ match-case with guards)",
        "cmd": "def handle_event(event: dict):\n    match event:\n        case {\"type\": \"alert\", \"level\": \"CRITICAL\", \"node\": node}:\n            print(f\"Critical alert on {node}!\")\n        case {\"type\": \"ping\", \"latency\": ms} if ms > 100:\n            print(f\"High latency detected: {ms}ms\")\n        case [\"ssh\", host, int(port)]:\n            print(f\"Connecting to {host}:{port}\")\n        case _:\n            print(\"Unknown event pattern\")",
        "flags": [
          [
            "match val / case pattern:",
            "Unpacks structures and validates types simultaneously"
          ],
          [
            "case ... if condition:",
            "Pattern guard: executes only if condition evaluates to True"
          ],
          [
            "case _:",
            "Wildcard catch-all branch matching any remaining input"
          ],
          [
            "case [a, b, *rest]:",
            "Sequence unpacking pattern matching lists/tuples"
          ]
        ],
        "subcommands": [
          [
            "case int() | float():",
            "Union pattern matching multiple alternative types"
          ]
        ],
        "tip": "match-case replaces complex nested isinstance checks and dictionary structure validators.",
        "tags": [
          "python",
          "match",
          "case",
          "pattern-matching",
          "switch"
        ]
      }
    ]
  },
  {
    "id": "py-loops",
    "badge": "loops",
    "title": "Loops & Iteration",
    "subtitle": "for loops, enumerate, zip, dictionary iteration, while loops & loop control",
    "commands": [
      {
        "id": "py-for-loops-deep",
        "desc": "Iterate over sequences with enumerate() for index tracking and zip() for parallel lists",
        "cmd": "nodes = [\"srv-01\", \"srv-02\", \"srv-03\"]\nips = [\"10.0.0.1\", \"10.0.0.2\", \"10.0.0.3\"]\n\n# Enumerate with custom start index\nfor idx, node in enumerate(nodes, start=1):\n    print(f\"#{idx}: {node}\")\n\n# Parallel iteration with zip\nfor node, ip in zip(nodes, ips):\n    print(f\"{node} -> {ip}\")",
        "flags": [
          [
            "for item in iterable:",
            "Iterates over any sequence, generator, or collection"
          ],
          [
            "enumerate(seq, start=0)",
            "Yields (index, item) pairs without manual counter variables"
          ],
          [
            "zip(seq1, seq2)",
            "Combines multiple iterables pair-by-pair until shortest ends"
          ],
          [
            "break / continue",
            "break stops loop immediately; continue skips to next item"
          ],
          [
            "for ... else:",
            "else block executes ONLY if loop completed without hitting break"
          ]
        ],
        "subcommands": [
          [
            "for key, val in my_dict.items():\n    print(f\"{key}: {val}\")",
            "Iterate over both keys and values of dictionary"
          ],
          [
            "for i in range(0, 10, 2):\n    print(i)",
            "Generate arithmetic progressions (start, stop, step)"
          ],
          [
            "while count > 0:\n    count -= 1",
            "Standard while loop condition"
          ]
        ],
        "tip": "Never use for i in range(len(items)):. Use for item in items: or for i, item in enumerate(items):.",
        "tags": [
          "python",
          "for",
          "while",
          "loops",
          "enumerate",
          "zip",
          "iteration"
        ]
      }
    ]
  },
  {
    "id": "py-func-io",
    "badge": "func",
    "title": "Functions, File I/O & Exception Handling",
    "subtitle": "def, *args, **kwargs, safe file I/O with context managers & try/except/finally",
    "commands": [
      {
        "id": "py-functions-advanced",
        "desc": "Function definitions with typed parameters, default values, variable args and docstrings",
        "cmd": "def deploy_node(name: str, port: int = 22, *tags: str, **metadata: str) -> bool:\n    \"\"\"Deploy a node with optional tags and arbitrary metadata.\"\"\"\n    print(f\"Deploying {name}:{port} | Tags: {tags} | Meta: {metadata}\")\n    return True\n\n# Calling with positional, variable, and keyword arguments\ndeploy_node(\"gpu-01\", 22, \"h100\", \"sxm5\", rack=\"R12\", zone=\"us-east\")",
        "flags": [
          [
            "def name(...) -> ReturnType:",
            "Function definition with parameter and return type hints"
          ],
          [
            "arg: int = 22",
            "Default parameter value (evaluated once at module import)"
          ],
          [
            "*args",
            "Collects arbitrary extra positional arguments as a tuple"
          ],
          [
            "**kwargs",
            "Collects arbitrary extra keyword arguments as a dictionary"
          ],
          [
            "lambda x: x * 2",
            "Anonymous inline function for callbacks or sorting keys"
          ]
        ],
        "subcommands": [
          [
            "deploy_node(**config_dict)",
            "Unpack dictionary as keyword arguments into function call"
          ],
          [
            "deploy_node(*arg_list)",
            "Unpack list as positional arguments into function call"
          ]
        ],
        "tip": "Never use mutable objects (like [] or {}) as default arguments; use arg: list = None instead.",
        "tags": [
          "python",
          "functions",
          "args",
          "kwargs",
          "lambda",
          "typing"
        ]
      },
      {
        "id": "py-file-io-exceptions",
        "desc": "Exception handling with try/except/else/finally and safe file I/O with context managers",
        "cmd": "import json\nfrom pathlib import Path\n\nfile_path = Path(\"/etc/datacenter/config.json\")\n\ntry:\n    # Safe context manager: auto-closes file even on error\n    with open(file_path, \"r\", encoding=\"utf-8\") as f:\n        data = json.load(f)\nexcept FileNotFoundError:\n    print(f\"Config file missing: {file_path}\")\n    data = {}\nexcept json.JSONDecodeError as err:\n    print(f\"Malformed JSON on line {err.lineno}: {err.msg}\")\n    raise SystemExit(1)\nfinally:\n    print(\"Execution finished\")",
        "flags": [
          [
            "with open(...) as f:",
            "Context manager guaranteeing file descriptor is closed properly"
          ],
          [
            "encoding=\"utf-8\"",
            "Always specify encoding explicitly to prevent cross-platform errors"
          ],
          [
            "mode: \"r\", \"w\", \"a\"",
            "Read (\"r\"), overwrite/write (\"w\"), append (\"a\")"
          ],
          [
            "except SpecificError as e:",
            "Always catch specific exceptions rather than bare except:"
          ],
          [
            "finally:",
            "Guaranteed cleanup block that always runs whether error occurred or not"
          ]
        ],
        "subcommands": [
          [
            "Path(\"data.txt\").read_text(encoding=\"utf-8\")",
            "Modern pathlib one-liner for reading entire text file"
          ],
          [
            "Path(\"out.txt\").write_text(\"hello\", encoding=\"utf-8\")",
            "Modern pathlib one-liner for writing text file"
          ]
        ],
        "tip": "Use pathlib.Path for all file path operations instead of legacy os.path methods.",
        "tags": [
          "python",
          "file-io",
          "exceptions",
          "try-except",
          "json",
          "pathlib",
          "with"
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("python_cs_bookmarks") || "[]"))
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
  const totalCommands = PYTHON_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of PYTHON_CHEAT_SHEET_DATA) {
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
      <select id="category-select" class="cat-select" aria-label="Filter by ${escapeHtml('Python')} section">
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

  for (const section of PYTHON_CHEAT_SHEET_DATA) {
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
  document.body.classList.toggle("compact-mode", compact);
  if (densityToggleBtn) {
    densityToggleBtn.classList.toggle("active", compact);
    densityToggleBtn.setAttribute("aria-pressed", compact ? "true" : "false");
  }
  if (densityLabel) densityLabel.textContent = compact ? "Relaxed" : "Compact";
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
      localStorage.setItem("python_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
