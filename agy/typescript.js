const TS_CHEAT_SHEET_DATA = [
  {
    "id": "ts-basics",
    "badge": "types",
    "title": "Types, Interfaces & Generics",
    "subtitle": "Primitive types, interfaces, type aliases, union types & generic containers",
    "commands": [
      {
        "id": "ts-interface-type-generics",
        "desc": "Declare structured interfaces, union types, and reusable generic functions",
        "cmd": "interface ServerNode {\n  id: string;\n  bmcIp: string;\n  gpus: number;\n  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';\n  tags?: string[]; // Optional property\n}\n\n// Generic API response container\ninterface ApiResponse<T> {\n  data: T;\n  timestamp: number;\n  error?: string;\n}",
        "flags": [
          [
            "interface vs type",
            "Interfaces are extendable and ideal for object schemas; types handle unions and primitives"
          ],
          [
            "'ONLINE' | 'OFFLINE'",
            "String literal union: restricts value to strictly defined strings"
          ],
          [
            "<T>",
            "Generic type parameter: enables writing reusable components across different data types"
          ],
          [
            "prop?: type",
            "Optional property: allows value to be undefined"
          ],
          [
            "readonly prop: string",
            "Prevents property from being mutated after initialization"
          ]
        ],
        "subcommands": [
          [
            "type ID = string | number;",
            "Union type: value can be either string or number"
          ],
          [
            "type ReadonlyNode = Readonly<ServerNode>;",
            "Built-in utility type: makes all properties immutable at compile time"
          ]
        ],
        "tip": "Prefer literal union types over numeric enums for cleaner JS output and exact compile-time validation.",
        "tags": [
          "typescript",
          "interface",
          "type",
          "generics",
          "union",
          "schema"
        ]
      },
      {
        "id": "ts-narrowing-guards",
        "desc": "Type guards and type narrowing with typeof, instanceof, in, and custom predicates",
        "cmd": "type NetworkEvent = \n  | { kind: 'link_up'; speed: number }\n  | { kind: 'link_down'; reason: string };\n\nfunction handleEvent(e: NetworkEvent) {\n  if (e.kind === 'link_up') {\n    console.log(`Port active at ${e.speed}G`); // TS knows speed exists\n  } else {\n    console.log(`Down: ${e.reason}`);        // TS knows reason exists\n  }\n}",
        "flags": [
          [
            "Discriminated Union",
            "Pattern sharing a common literal property ('kind') for bulletproof type safety"
          ],
          [
            "typeof x === 'string'",
            "Narrows primitive types (string, number, boolean, symbol)"
          ],
          [
            "x instanceof Date",
            "Narrows class instances and built-in objects"
          ],
          [
            "'bmcIp' in server",
            "Checks if property key exists on object to narrow type"
          ],
          [
            "value is ServerNode",
            "Custom type predicate return type: function isServer(x: any): x is ServerNode"
          ]
        ],
        "subcommands": [
          [
            "const val = (input as string);",
            "Type assertion (override compiler type checking)"
          ],
          [
            "const val = input!;",
            "Non-null assertion operator: asserts value is not null or undefined"
          ]
        ],
        "tip": "Discriminated unions with exhaustive switch/if checks eliminate entire classes of runtime errors.",
        "tags": [
          "typescript",
          "narrowing",
          "typeguards",
          "discriminated-union",
          "typeof",
          "instanceof"
        ]
      }
    ]
  },
  {
    "id": "ts-functions-classes",
    "badge": "func",
    "title": "Typed Functions, Classes & Utility Types",
    "subtitle": "Function signatures, access modifiers, Partial, Pick, Omit, Record & async types",
    "commands": [
      {
        "id": "ts-utility-types",
        "desc": "Built-in utility types: Partial, Required, Pick, Omit, Record & ReturnType",
        "cmd": "interface MachineConfig {\n  hostname: string;\n  ip: string;\n  cores: number;\n  rackId: string;\n}\n\n// Update config: all fields optional\ntype MachineUpdate = Partial<MachineConfig>;\n\n// Public view: omit sensitive fields\ntype PublicMachine = Omit<MachineConfig, 'ip'>;\n\n// Dictionary mapping IDs to config\ntype MachineRegistry = Record<string, MachineConfig>;",
        "flags": [
          [
            "Partial<T>",
            "Constructs a type with all properties of T set to optional"
          ],
          [
            "Required<T>",
            "Constructs a type with all properties of T set to required"
          ],
          [
            "Pick<T, Keys>",
            "Constructs a type by picking specific keys from T ('hostname' | 'ip')"
          ],
          [
            "Omit<T, Keys>",
            "Constructs a type by picking all properties from T and removing Keys"
          ],
          [
            "Record<K, V>",
            "Constructs an object type whose keys are K and values are V"
          ]
        ],
        "subcommands": [
          [
            "type PromResult = Awaited<Promise<string>>;",
            "Extracts resolved type of a Promise"
          ],
          [
            "type FuncReturn = ReturnType<typeof myFunction>;",
            "Extracts return type of a function signature"
          ]
        ],
        "tip": "Utility types prevent code duplication by deriving DTOs, updates, and subsets from a single interface.",
        "tags": [
          "typescript",
          "utility-types",
          "partial",
          "pick",
          "omit",
          "record",
          "generics"
        ]
      },
      {
        "id": "ts-classes-tooling",
        "desc": "Class parameter properties, async typing, and essential tsconfig.json options",
        "cmd": "class ServerManager {\n  // Parameter property: automatically assigns to private/public fields\n  constructor(\n    public readonly hostname: string,\n    private apiKey: string,\n    protected port: number = 22\n  ) {}\n\n  async ping(): Promise<boolean> {\n    return true;\n  }\n}",
        "flags": [
          [
            "public, private, protected",
            "Compile-time access control modifiers (private only accessible in class)"
          ],
          [
            "readonly",
            "Property can only be initialized in constructor"
          ],
          [
            "Promise<T>",
            "Explicit return type annotation for asynchronous methods"
          ],
          [
            "\"strict\": true",
            "Essential tsconfig.json flag enabling all strict type checking options"
          ],
          [
            "\"noImplicitAny\": true",
            "Forces explicit typing when TypeScript cannot infer type"
          ]
        ],
        "subcommands": [
          [
            "npx tsx script.ts",
            "Run TypeScript files directly without separate build step (instant execution)"
          ],
          [
            "npx tsc --noEmit",
            "Run type checker on codebase without generating JavaScript output files"
          ]
        ],
        "tip": "Use npx tsx for writing datacenter CLI scripts in TypeScript without needing a complex build setup.",
        "tags": [
          "typescript",
          "classes",
          "access-modifiers",
          "tsconfig",
          "tooling",
          "tsx"
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("typescript_cs_bookmarks") || "[]"))
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
  const totalCommands = TS_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of TS_CHEAT_SHEET_DATA) {
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
      <select id="category-select" class="cat-select" aria-label="Filter by ${escapeHtml('TypeScript')} section">
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

  for (const section of TS_CHEAT_SHEET_DATA) {
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
      localStorage.setItem("typescript_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
