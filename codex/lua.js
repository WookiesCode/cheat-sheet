const LUA_DATA = [
  {
    "id": "lua-basics",
    "badge": "LUA",
    "title": "Lua Basics & Running Scripts",
    "subtitle": "Run Lua code in the interpreter, not directly in a shell",
    "commands": [
      {
        "id": "lua-run",
        "desc": "Check the interpreter, run a script, or evaluate a short expression",
        "cmd": "lua -v\nlua script.lua node-a\nlua -e 'print(\"hello\")'\nluac -p script.lua",
        "details": "Shell commands. lua runs a script; -e evaluates code; luac -p checks syntax without running the script. These examples target Lua 5.4. Neovim and other embedded hosts may use LuaJIT with Lua 5.1 semantics.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "cli",
          "interpreter",
          "syntax"
        ]
      },
      {
        "id": "lua-variables",
        "desc": "Local variables, types, nil, and conversion",
        "cmd": "local host = \"node-a\"\nlocal count = 8\nlocal enabled = false\nlocal missing = nil\nprint(type(host), tonumber(\"42\"), tostring(enabled))\nprint(0 and \"zero is truthy\")",
        "details": "Prefer local variables: assignments without local normally set globals. Only false and nil are falsey; 0 and the empty string are truthy. Lua is case-sensitive. -- starts a line comment; --[[ ... ]] is a block comment.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "variables",
          "scope",
          "types"
        ]
      },
      {
        "id": "lua-strings",
        "desc": "Concatenate and format strings",
        "cmd": "local host = \"node-a\"\nlocal status = \"healthy\"\nprint(host .. \": \" .. status)\nprint(string.format(\"%s has %d GPUs\", host, 8))\nlocal message = [[first line\nsecond line]]\nprint(message)",
        "details": "Use .. for concatenation; + is arithmetic. Strings are immutable byte sequences; # returns byte length, not Unicode character count. Long bracket strings preserve newlines.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "strings",
          "format"
        ]
      }
    ]
  },
  {
    "id": "lua-control",
    "badge": "LUA",
    "title": "Conditions, Loops & Tables",
    "subtitle": "Tables implement both sequences and key/value maps",
    "commands": [
      {
        "id": "lua-conditions",
        "desc": "if / elseif / else, comparisons, and boolean logic",
        "cmd": "local temperature = 74\nif temperature >= 85 then\n  print(\"critical\")\nelseif temperature >= 70 then\n  print(\"warm\")\nelse\n  print(\"normal\")\nend\nprint(temperature ~= 0 and \"sensor available\")",
        "details": "Use == to compare and ~= for not equal. and/or return operands rather than forcing booleans. An or default also replaces false; use an explicit nil check when false is a valid value.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "if",
          "conditions",
          "boolean"
        ]
      },
      {
        "id": "lua-loops",
        "desc": "Numeric for, while, repeat, and break",
        "cmd": "for i = 1, 3 do print(i) end\nlocal n = 3\nwhile n > 0 do n = n - 1 end\nrepeat n = n + 1 until n == 3\nfor i = 1, 10 do\n  if i == 4 then break end\n  print(i)\nend",
        "details": "Numeric for includes both endpoints. repeat tests its condition after the body. Lua has no standard continue keyword; structure the body with if.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "for",
          "while",
          "repeat",
          "loops"
        ]
      },
      {
        "id": "lua-tables",
        "desc": "Sequences, maps, and safe field access",
        "cmd": "local nodes = {\"node-a\", \"node-b\"}\ntable.insert(nodes, \"node-c\")\nfor i, name in ipairs(nodes) do print(i, name) end\nlocal inventory = {host = \"node-a\", gpus = 8}\nfor key, value in pairs(inventory) do print(key, value) end\nprint(inventory.host, inventory[\"gpus\"])",
        "details": "Sequence indices conventionally begin at 1. ipairs stops at the first absent integer entry; pairs order is unspecified. The length operator # is reliable for dense sequences, not a general count of keys or sparse entries. Assign nil to remove a key.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "tables",
          "arrays",
          "maps",
          "pairs",
          "ipairs"
        ]
      },
      {
        "id": "lua-sort",
        "desc": "Sort records and join a sequence",
        "cmd": "local nodes = {{name=\"b\", errors=2}, {name=\"a\", errors=0}}\ntable.sort(nodes, function(a, b) return a.name < b.name end)\nlocal names = {}\nfor _, node in ipairs(nodes) do names[#names + 1] = node.name end\nprint(table.concat(names, \", \"))",
        "details": "table.sort mutates its input; provide a strict ordering comparator. table.concat joins a sequence of strings or numbers. Tables are references: assigning a table to another variable does not copy it.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "sort",
          "tables",
          "join"
        ]
      }
    ]
  },
  {
    "id": "lua-functions",
    "badge": "LUA",
    "title": "Functions, Modules & Error Handling",
    "subtitle": "Reusable helpers and protected calls",
    "commands": [
      {
        "id": "lua-functions",
        "desc": "Functions, multiple results, and closures",
        "cmd": "local function divide(a, b)\n  if b == 0 then return nil, \"division by zero\" end\n  return a / b\nend\nlocal value, err = divide(12, 3)\nprint(value, err)\nlocal function counter()\n  local n = 0\n  return function() n = n + 1; return n end\nend\nlocal next_id = counter()\nprint(next_id(), next_id())",
        "details": "Functions are first-class values and can return multiple results. Closures retain access to surrounding local variables. Parentheses around a function call can reduce its results to one value.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "functions",
          "closures",
          "returns"
        ]
      },
      {
        "id": "lua-errors",
        "desc": "Catch a runtime error with pcall",
        "cmd": "local ok, result = pcall(function()\n  local value = tonumber(\"bad input\")\n  assert(value, \"expected a number\")\n  return value * 2\nend)\nif ok then print(result) else io.stderr:write(tostring(result), \"\\n\") end",
        "details": "pcall returns true plus results on success, or false plus the error object on failure. It does not validate the safety of executing untrusted Lua code.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "errors",
          "pcall",
          "assert"
        ]
      },
      {
        "id": "lua-module",
        "desc": "A module file and its caller",
        "cmd": "-- inventory.lua\nlocal M = {}\nfunction M.gpu_count(node) return node.gpus or 0 end\nreturn M",
        "details": "Save this as inventory.lua. In a separate script: local inventory = require(\"inventory\"); print(inventory.gpu_count({gpus=8})). require uses package.path and caches loaded modules in package.loaded. This snippet is the module file only.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "module",
          "require",
          "package"
        ]
      },
      {
        "id": "lua-methods",
        "desc": "Metatables and colon method calls",
        "cmd": "local Node = {}\nNode.__index = Node\nfunction Node.new(name)\n  return setmetatable({name = name}, Node)\nend\nfunction Node:describe() return \"Node: \" .. self.name end\nlocal node = Node.new(\"node-a\")\nprint(node:describe())",
        "details": "The colon call passes the receiver as the first argument (self). __index provides fallback lookups; Lua tables and metatables can model objects without a built-in class keyword.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "metatable",
          "methods",
          "self"
        ]
      }
    ]
  },
  {
    "id": "lua-io",
    "badge": "LUA",
    "title": "Files, Arguments & Log Parsing",
    "subtitle": "Read-only examples for inventory and diagnostic text",
    "commands": [
      {
        "id": "lua-args",
        "desc": "Command-line arguments and environment variables",
        "cmd": "local host = arg[1] or \"node-a\"\nlocal home = os.getenv(\"HOME\") or \".\"\nprint(host, home)",
        "details": "Run as lua script.lua node-a. arg[0] contains the script name; arg[1] is the first argument. arg is provided by the standalone interpreter and may be absent in embedded hosts.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "arguments",
          "environment",
          "cli"
        ]
      },
      {
        "id": "lua-file",
        "desc": "Read a text file and close it explicitly",
        "cmd": "local file, err = io.open(\"inventory.txt\", \"r\")\nif not file then\n  io.stderr:write(tostring(err), \"\\n\")\nelse\n  for line in file:lines() do print(line) end\n  file:close()\nend",
        "details": "Mode r reads an existing file and does not create it. Always close handles. io.lines(filename) can also iterate a file and closes it when iteration reaches EOF; breaking early needs deliberate cleanup.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "file",
          "io",
          "read"
        ]
      },
      {
        "id": "lua-patterns",
        "desc": "Parse key=value records with Lua patterns",
        "cmd": "local line = \"host=node-a gpus=8 state=healthy\"\nlocal values = {}\nfor key, value in line:gmatch(\"([%w_]+)=([^%s]+)\") do\n  values[key] = value\nend\nprint(values.host, tonumber(values.gpus))",
        "details": "Lua patterns are not PCRE regular expressions: %d matches digits, %s whitespace, and captures use parentheses. There is no regex alternation operator |. This simple parser does not support quoted values containing spaces.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "patterns",
          "parsing",
          "logs"
        ]
      },
      {
        "id": "lua-logs",
        "desc": "Count Xid messages in diagnostic text",
        "cmd": "local sample = \"GPU Xid 79\\nhealthy\\nGPU Xid 48\\nGPU Xid 79\\n\"\nlocal counts = {}\nfor xid in sample:gmatch(\"Xid%s+(%d+)\") do\n  counts[xid] = (counts[xid] or 0) + 1\nend\nlocal keys = {}\nfor key in pairs(counts) do keys[#keys + 1] = key end\ntable.sort(keys, function(a,b) return tonumber(a) < tonumber(b) end)\nfor _, key in ipairs(keys) do print(key, counts[key]) end",
        "details": "Counts the simplified Xid <number> format in sample text. Real driver log formats vary; adapt the pattern to captured lines. Counts are evidence to investigate, not a hardware diagnosis.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "logs",
          "gpu",
          "xid",
          "recipe"
        ]
      },
      {
        "id": "lua-coroutines",
        "desc": "Cooperative coroutine execution",
        "cmd": "local co = coroutine.create(function()\n  for i = 1, 2 do coroutine.yield(i) end\nend)\nwhile coroutine.status(co) ~= \"dead\" do\n  local ok, value = coroutine.resume(co)\n  assert(ok, value)\n  if value ~= nil then print(value) end\nend",
        "details": "Coroutines cooperate by yielding; they do not automatically execute in parallel or turn blocking I/O into asynchronous I/O.",
        "flags": [],
        "subcommands": [],
        "tip": "Lua 5.4 reference; most basics also work in LuaJIT / Lua 5.1. Check host-specific APIs separately.",
        "tags": [
          "lua",
          "scripting",
          "coroutine",
          "yield"
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("bash_cs_bookmarks") || "[]"))
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
  const totalCommands = LUA_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of LUA_DATA) {
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

  for (const section of LUA_DATA) {
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
  document.body.classList.toggle("compact-mode", compact);
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
