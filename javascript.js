const JS_CHEAT_SHEET_DATA = [
  {
    "id": "js-vars-types",
    "badge": "types",
    "title": "Variables, Scope & Operators",
    "subtitle": "const vs let, template literals, destructuring, nullish coalescing & strict equality",
    "commands": [
      {
        "id": "js-const-let-templates",
        "desc": "Block-scoped variable declarations, template literals, and destructuring assignment",
        "cmd": "const serverName = 'node-01';\nlet connectionCount = 0;\nconst ports = [8000, 8080];\nconst [mainPort, backupPort = 9000] = ports;\n\n// Template literal with interpolation\nconsole.log(`Server: ${serverName}:${mainPort} (conns: ${++connectionCount})`);",
        "flags": [
          [
            "const",
            "Block-scoped immutable binding (value itself can still be mutable if object/array)"
          ],
          [
            "let",
            "Block-scoped reassignable variable"
          ],
          [
            "Avoid 'var'",
            "Legacy function-scoped keyword with hoisting pitfalls"
          ],
          [
            "Template literal (`... ${var}`)",
            "Supports multi-line strings and expression interpolation"
          ],
          [
            "const { id, ip = '127.0.0.1' } = node",
            "Object destructuring with default fallback values"
          ]
        ],
        "subcommands": [
          [
            "const merged = { ...defaults, ...userConfig };",
            "Object spread: clones and shallow-merges objects"
          ],
          [
            "const clone = [...originalArray, 'new_item'];",
            "Array spread: clones and appends elements"
          ]
        ],
        "tip": "Default to const everywhere; only use let when a variable must be reassigned.",
        "tags": [
          "javascript",
          "const",
          "let",
          "variables",
          "template-literals",
          "destructuring",
          "spread"
        ]
      },
      {
        "id": "js-operators-truthiness",
        "desc": "Strict equality (===), nullish coalescing (??) and optional chaining (?.)",
        "cmd": "const timeout = config.timeout ?? 5000; // Only defaults on null/undefined\nconst bmcIp = node?.network?.bmc?.ip ?? '127.0.0.1';\n\nif (status === 'READY' && count !== 0) {\n  console.log('Operational');\n}",
        "flags": [
          [
            "=== and !==",
            "Strict equality/inequality: checks value AND type without type coercion"
          ],
          [
            "?? (Nullish Coalescing)",
            "Returns right side ONLY if left is null or undefined (preserves 0, false, '')"
          ],
          [
            "|| (Logical OR)",
            "Returns right side if left is any falsy value (0, false, '', null, NaN)"
          ],
          [
            "?. (Optional Chaining)",
            "Safely accesses nested properties without throwing TypeError if parent is nullish"
          ],
          [
            "Falsy values",
            "false, 0, -0, 0n, '', null, undefined, NaN"
          ]
        ],
        "subcommands": [
          [
            "const label = isOnline ? 'Active' : 'Offline';",
            "Ternary conditional expression"
          ],
          [
            "isReady && startService();",
            "Short-circuit execution: runs startService only if isReady is true"
          ]
        ],
        "tip": "Never use == or != in modern JavaScript. Always use strict === and !== to prevent type coercion bugs.",
        "tags": [
          "javascript",
          "operators",
          "nullish",
          "optional-chaining",
          "equality",
          "truthy"
        ]
      }
    ]
  },
  {
    "id": "js-control",
    "badge": "control",
    "title": "Conditionals, Loops & Iteration",
    "subtitle": "if-else, switch, for-of, for-in, while, and classic loops",
    "commands": [
      {
        "id": "js-loops-classic-modern",
        "desc": "Classic for loop, for...of (iterables), for...in (object keys), and loop control",
        "cmd": "const nodes = ['srv-01', 'srv-02', 'srv-03'];\n\n// for...of: best for arrays, strings, maps, sets\nfor (const node of nodes) {\n  if (node === 'srv-02') continue;\n  console.log(`Checking ${node}`);\n}\n\n// for...in: iterates enumerable object keys\nconst config = { host: 'localhost', port: 8080 };\nfor (const key in config) {\n  console.log(`${key}: ${config[key]}`);\n}",
        "flags": [
          [
            "for (const item of iterable)",
            "Iterates directly over values of arrays, sets, maps, strings"
          ],
          [
            "for (const key in object)",
            "Iterates over property names/keys of an object"
          ],
          [
            "for (let i = 0; i < arr.length; i++)",
            "Classic indexed loop with explicit index counter"
          ],
          [
            "while (condition) { ... }",
            "Repeats while condition is true"
          ],
          [
            "break / continue",
            "break terminates loop immediately; continue skips to next iteration"
          ]
        ],
        "subcommands": [
          [
            "for (const [index, val] of nodes.entries()) { ... }",
            "Iterate over both index and value using .entries()"
          ],
          [
            "switch (status) { case 'UP': ... break; default: ... }",
            "Multi-branch switch statement"
          ]
        ],
        "tip": "Use for...of for arrays and for...in for plain objects. Never use for...in on arrays.",
        "tags": [
          "javascript",
          "for",
          "for-of",
          "for-in",
          "while",
          "loops",
          "iteration"
        ]
      },
      {
        "id": "js-functional-array-methods",
        "desc": "Modern functional array transformations: map, filter, find, some, every, reduce",
        "cmd": "const servers = [\n  { id: 's1', load: 45, online: true },\n  { id: 's2', load: 92, online: true },\n  { id: 's3', load: 10, online: false }\n];\n\n// Filter active and extract IDs\nconst activeIds = servers\n  .filter(s => s.online)\n  .map(s => s.id);\n\n// Find single item & calculate total load\nconst overloaded = servers.find(s => s.load > 90);\nconst avgLoad = servers.reduce((acc, s) => acc + s.load, 0) / servers.length;",
        "flags": [
          [
            ".map(fn)",
            "Transforms each element, returning a new array of same length"
          ],
          [
            ".filter(fn)",
            "Returns a new array containing only elements where fn returns truthy"
          ],
          [
            ".find(fn)",
            "Returns the first matching element, or undefined if not found"
          ],
          [
            ".some(fn) / .every(fn)",
            "some tests if at least one matches; every tests if all match"
          ],
          [
            ".reduce((acc, cur) => ..., initial)",
            "Reduces array to a single cumulative value"
          ],
          [
            ".flat() / .flatMap(fn)",
            "Flattens nested array dimensions"
          ]
        ],
        "subcommands": [
          [
            "[...new Set(duplicates)]",
            "Deduplicate array elements instantly using Set"
          ],
          [
            "servers.sort((a, b) => b.load - a.load)",
            "Numeric sorting (b - a for descending order)"
          ]
        ],
        "tip": "Array methods like map and filter return new arrays without mutating the original input.",
        "tags": [
          "javascript",
          "arrays",
          "map",
          "filter",
          "reduce",
          "find",
          "functional"
        ]
      }
    ]
  },
  {
    "id": "js-async-errors",
    "badge": "async",
    "title": "Functions, Promises & Async/Await",
    "subtitle": "Arrow functions, closures, try/catch/finally, async/await & Promise.all",
    "commands": [
      {
        "id": "js-async-await-fetch",
        "desc": "Asynchronous programming with async/await, Promise concurrency & try/catch error handling",
        "cmd": "async function queryNode(ip) {\n  try {\n    const res = await fetch(`http://${ip}/health`, { signal: AbortSignal.timeout(3000) });\n    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);\n    const data = await res.json();\n    return { ip, status: 'OK', data };\n  } catch (err) {\n    console.error(`Failed ${ip}: ${err.message}`);\n    return { ip, status: 'FAILED', error: err.message };\n  }\n}\n\n// Concurrent parallel execution across multiple nodes\nconst results = await Promise.all(['10.0.0.1', '10.0.0.2'].map(queryNode));",
        "flags": [
          [
            "async function",
            "Declares an asynchronous function that always returns a Promise"
          ],
          [
            "await promise",
            "Pauses execution until Promise resolves or rejects (valid in async functions)"
          ],
          [
            "Promise.all([...])",
            "Executes promises concurrently; rejects immediately if any promise fails"
          ],
          [
            "Promise.allSettled([...])",
            "Waits for all promises to finish, returning results of both success and failure"
          ],
          [
            "AbortSignal.timeout(ms)",
            "Built-in automatic fetch timeout controller"
          ]
        ],
        "subcommands": [
          [
            "const add = (a, b) => a + b;",
            "Concise arrow function with implicit return"
          ],
          [
            "throw new Error('Custom failure message');",
            "Instantiate and throw standard Error object with stack trace"
          ]
        ],
        "tip": "Always wrap await calls in try...catch blocks to handle network timeouts and API errors gracefully.",
        "tags": [
          "javascript",
          "async",
          "await",
          "promises",
          "fetch",
          "try-catch",
          "concurrency"
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
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("javascript_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
const sectionsContainer = document.getElementById("sections-container");
const categoryTabsEl = document.getElementById("category-tabs");
const searchInput = document.getElementById("search-input");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
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
  const totalCommands = JS_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of JS_CHEAT_SHEET_DATA) {
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
      <select id="category-select" class="cat-select" aria-label="Filter by ${escapeHtml('JavaScript')} section">
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

  for (const section of JS_CHEAT_SHEET_DATA) {
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
      localStorage.setItem("javascript_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
renderCategoryTabs();
renderSections();
initEvents();
