const LUA_CHEAT_SHEET_DATA = [
  {
    "id": "lua-vars",
    "badge": "vars",
    "title": "Variables, Types & Strings",
    "subtitle": "local scope, truthiness, numbers, concatenation, formatting & patterns",
    "commands": [
      {
        "id": "lua-var-declare",
        "desc": "Variables, comments, data types, and what counts as true or false",
        "cmd": "-- Single-line comment\n--[[ Multi-line\n     comment ]]\nlocal host = \"node-01\"\nlocal port = 8080\nlocal enabled = true\nlocal nothing = nil\n\nprint(type(host), type(port), type(enabled), type(nothing))\nprint(host .. \":\" .. port)\nprint(port ~= 80, not enabled)\nlocal label = enabled and \"on\" or \"off\"\nprint(label)",
        "flags": [
          [
            "local name = value",
            "Scoped to the current block. Without local, the variable is global."
          ],
          [
            "-- comment",
            "Single-line comment. Deleting the -- turns the line back on."
          ],
          [
            "--[[ ... ]]",
            "Multi-line comment block"
          ],
          [
            "..",
            "Concatenate strings. Numbers convert automatically."
          ],
          [
            "~=",
            "Not equal (not != as in most languages)"
          ],
          [
            "and / or / not",
            "Logical operators, spelled as words"
          ],
          [
            "a and b or c",
            "Ternary-style pick. Gives c if b is false or nil."
          ],
          [
            "nil",
            "No value. Reading an unset variable gives nil, not an error."
          ]
        ],
        "subcommands": [
          [
            "type(value)",
            "Returns \"nil\", \"boolean\", \"number\", \"string\", \"table\", or \"function\""
          ],
          [
            "tostring(42) / tonumber(\"42\")",
            "Convert between numbers and strings. tonumber gives nil if invalid."
          ],
          [
            "local a, b = 1, 2",
            "Assign several variables at once"
          ],
          [
            "a, b = b, a",
            "Swap two values without a temporary variable"
          ]
        ],
        "tip": "Only false and nil are falsy. 0 and the empty string \"\" both count as true.",
        "tags": [
          "lua",
          "variables",
          "local",
          "global",
          "types",
          "nil",
          "comments",
          "truthy"
        ]
      },
      {
        "id": "lua-strings-patterns",
        "desc": "String functions and Lua patterns, which are similar to regex but simpler",
        "cmd": "local s = \"gpu-07: temp=71C\"\nprint(#s, s:upper(), s:sub(1, 6))\nprint(string.format(\"%-8s %5.1f%%\", \"load\", 93.456))\nprint(s:match(\"temp=(%d+)\"))\nprint(s:find(\"temp\", 1, true))\nprint((s:gsub(\"%d+\", \"#\")))\nfor key, value in (\"a=1, b=2\"):gmatch(\"(%w+)=(%w+)\") do\n  print(key, value)\nend",
        "flags": [
          [
            "#s",
            "Length of a string"
          ],
          [
            "s:sub(i, j)",
            "Substring. Positions start at 1, and negative counts from the end."
          ],
          [
            "s:upper() / s:lower()",
            "Change case"
          ],
          [
            "s:find(text, 1, true)",
            "Plain-text search. Returns start and end positions."
          ],
          [
            "s:match(pattern)",
            "Returns the captured parts of the first match"
          ],
          [
            "s:gsub(pattern, repl)",
            "Replace all matches. Also returns the replacement count."
          ],
          [
            "s:gmatch(pattern)",
            "Loop over every match"
          ],
          [
            "%d %a %w %s",
            "Digit, letter, alphanumeric, whitespace (capitalize to invert)"
          ]
        ],
        "subcommands": [
          [
            "string.format(\"%s %d %.2f\", s, i, f)",
            "printf-style formatting"
          ],
          [
            "%.  %-  %%",
            "Use % to escape magic characters, not a backslash"
          ],
          [
            "s:rep(3, \",\")",
            "Repeat a string with an optional separator"
          ],
          [
            "[[multi-line string]]",
            "Long string: no escapes, and newlines are kept"
          ]
        ],
        "tip": "Patterns are not regex: there is no | alternation or {n} count, and - means shortest repeat.",
        "tags": [
          "lua",
          "strings",
          "patterns",
          "format",
          "gsub",
          "match",
          "gmatch"
        ]
      }
    ]
  },
  {
    "id": "lua-tables",
    "badge": "tbl",
    "title": "Tables: Lists & Dictionaries",
    "subtitle": "Lua's only data structure: arrays, key-value maps, nesting & iteration",
    "commands": [
      {
        "id": "lua-table-basics",
        "desc": "A table works as a list, a dictionary, or both. Lists start at index 1.",
        "cmd": "local nodes = { \"node-01\", \"node-02\", \"node-03\" }\nprint(nodes[1], #nodes)\ntable.insert(nodes, \"node-04\")\ntable.remove(nodes, 1)\nprint(table.concat(nodes, \", \"))\n\nlocal server = { host = \"10.0.0.1\", port = 22, tags = { \"gpu\", \"prod\" } }\nprint(server.host, server[\"port\"], server.tags[2])\nserver.port = 2222\nserver.tags = nil",
        "flags": [
          [
            "{ \"a\", \"b\" }",
            "List. The first item is at index 1, not 0."
          ],
          [
            "{ key = value }",
            "Dictionary with named keys"
          ],
          [
            "t.key / t[\"key\"]",
            "Two ways to read the same field"
          ],
          [
            "t[key]",
            "Look up using the value of a variable"
          ],
          [
            "#t",
            "Length of a list. Unreliable if the list has nil gaps."
          ],
          [
            "t.key = nil",
            "Delete a field"
          ]
        ],
        "subcommands": [
          [
            "table.insert(t, value)",
            "Append to the end (table.insert(t, 1, value) to prepend)"
          ],
          [
            "table.remove(t, i)",
            "Remove item i and shift the rest down"
          ],
          [
            "table.sort(t, function(a, b) return a > b end)",
            "Sort in place, with an optional comparator"
          ],
          [
            "table.concat(t, \", \")",
            "Join a list into a string"
          ]
        ],
        "tip": "Config files are mostly nested tables, so a { key = value } block is the shape to recognize.",
        "tags": [
          "lua",
          "tables",
          "arrays",
          "lists",
          "dictionary",
          "map",
          "insert",
          "sort"
        ]
      }
    ]
  },
  {
    "id": "lua-flow",
    "badge": "flow",
    "title": "Conditionals & Loops",
    "subtitle": "if / elseif, numeric for, pairs, ipairs, while & repeat",
    "commands": [
      {
        "id": "lua-conditionals",
        "desc": "if / elseif / else blocks. Each block closes with end.",
        "cmd": "local temp = 83\nif temp >= 90 then\n  print(\"critical\")\nelseif temp >= 80 then\n  print(\"warning\")\nelse\n  print(\"ok\")\nend",
        "flags": [
          [
            "if cond then ... end",
            "Basic conditional. Parentheses are not needed."
          ],
          [
            "elseif",
            "One word, not else if"
          ],
          [
            "== ~= < <= > >=",
            "Comparison operators"
          ],
          [
            "if not value then",
            "Runs when value is nil or false"
          ]
        ],
        "subcommands": [
          [
            "if t and t.key then",
            "Check a table exists before reading a field"
          ],
          [
            "local port = opts.port or 8080",
            "Fall back to a default when a value is nil"
          ]
        ],
        "tip": "A missing end is the most common syntax error. Every if, for, while, and function needs one.",
        "tags": [
          "lua",
          "if",
          "else",
          "elseif",
          "conditionals",
          "defaults"
        ]
      },
      {
        "id": "lua-loops",
        "desc": "Numeric for loops, list and table iteration, while, and repeat",
        "cmd": "for i = 1, 3 do print(i) end\nfor i = 10, 0, -5 do print(i) end\n\nlocal list = { \"a\", \"b\" }\nfor index, value in ipairs(list) do\n  print(index, value)\nend\n\nlocal map = { host = \"n1\", port = 22 }\nfor key, value in pairs(map) do\n  print(key, value)\nend\n\nlocal n = 0\nwhile n < 2 do n = n + 1 end\nrepeat n = n - 1 until n == 0",
        "flags": [
          [
            "for i = start, stop, step do",
            "Numeric loop. Both ends are included, and step defaults to 1."
          ],
          [
            "ipairs(t)",
            "List items in order, stopping at the first nil"
          ],
          [
            "pairs(t)",
            "Every key in a table, in no guaranteed order"
          ],
          [
            "while cond do ... end",
            "Checks before each pass"
          ],
          [
            "repeat ... until cond",
            "Checks after each pass, so it always runs once"
          ],
          [
            "break",
            "Leave the innermost loop"
          ]
        ],
        "subcommands": [
          [
            "for _, value in ipairs(t) do",
            "_ is the usual name for a value you will ignore"
          ],
          [
            "goto continue ... ::continue::",
            "Stand-in for continue, which Lua does not have"
          ]
        ],
        "tip": "Use ipairs for lists when order matters, and pairs for dictionaries.",
        "tags": [
          "lua",
          "loops",
          "for",
          "while",
          "repeat",
          "pairs",
          "ipairs",
          "break"
        ]
      }
    ]
  },
  {
    "id": "lua-functions",
    "badge": "fn",
    "title": "Functions, Methods & Modules",
    "subtitle": "Multiple returns, closures, varargs, colon syntax, metatables & require",
    "commands": [
      {
        "id": "lua-function-basics",
        "desc": "Define functions, return several values, and pass functions around",
        "cmd": "local function add(a, b)\n  return a + b\nend\n\nlocal function min_max(list)\n  table.sort(list)\n  return list[1], list[#list]\nend\nlocal low, high = min_max({ 4, 9, 1 })\nprint(add(2, 3), low, high)\n\nlocal function counter()\n  local count = 0\n  return function()\n    count = count + 1\n    return count\n  end\nend\nlocal tick = counter()\ntick()\nprint(tick())\n\nlocal function sum(...)\n  local total = 0\n  for _, v in ipairs({ ... }) do total = total + v end\n  return total\nend\nprint(sum(1, 2, 3))",
        "flags": [
          [
            "local function name(args)",
            "Define a function in local scope"
          ],
          [
            "return a, b",
            "Return several values at once"
          ],
          [
            "function(x) ... end",
            "Anonymous function, used as a value or callback"
          ],
          [
            "...",
            "Accept any number of arguments"
          ],
          [
            "f{ a = 1 }",
            "Parentheses are optional for a single table argument"
          ],
          [
            "f\"text\"",
            "Parentheses are optional for a single string argument"
          ]
        ],
        "subcommands": [
          [
            "local x, y = f()",
            "Extra return values are dropped, and missing ones are nil"
          ],
          [
            "select(\"#\", ...)",
            "Count arguments, including nils"
          ],
          [
            "function M.name() end",
            "Define a function inside a table"
          ]
        ],
        "tip": "Missing arguments arrive as nil, and extra arguments are ignored without an error.",
        "tags": [
          "lua",
          "functions",
          "return",
          "closures",
          "varargs",
          "callbacks"
        ]
      },
      {
        "id": "lua-methods-modules",
        "desc": "Colon method calls, metatable classes, and splitting code into modules",
        "cmd": "local Node = {}\nNode.__index = Node\n\nfunction Node.new(name)\n  return setmetatable({ name = name, up = false }, Node)\nend\n\nfunction Node:start()\n  self.up = true\n  return self.name .. \" started\"\nend\n\nlocal node = Node.new(\"gpu-01\")\nprint(node:start())\nprint(node.up)",
        "flags": [
          [
            "obj:method(x)",
            "Shorthand for obj.method(obj, x)"
          ],
          [
            "function T:method()",
            "Defines a method with a hidden self parameter"
          ],
          [
            "setmetatable(t, mt)",
            "Attach behavior such as inheritance or operators to a table"
          ],
          [
            "__index",
            "Where Lua looks when a field is missing"
          ],
          [
            "require(\"module\")",
            "Load a module once and return its value"
          ],
          [
            "return M",
            "How a module file hands back its public table"
          ]
        ],
        "subcommands": [
          [
            "local cfg = require(\"hypr.monitors\")",
            "Dots map to folders: hypr/monitors.lua"
          ],
          [
            "package.path",
            "Search path that require uses to find files"
          ],
          [
            "dofile(\"file.lua\")",
            "Run a file every time, with no caching"
          ]
        ],
        "tip": "If you see a nil error on a method, check for . where : was needed.",
        "tags": [
          "lua",
          "methods",
          "self",
          "metatable",
          "class",
          "modules",
          "require"
        ]
      }
    ]
  },
  {
    "id": "lua-errors-files",
    "badge": "io",
    "title": "Errors, Files & the Command Line",
    "subtitle": "pcall, reading and writing files, running scripts & syntax checks",
    "commands": [
      {
        "id": "lua-error-handling",
        "desc": "Raise errors and catch them with pcall instead of crashing the script",
        "cmd": "local function read_port(cfg)\n  if not cfg.port then\n    error(\"port is missing\")\n  end\n  return cfg.port\nend\n\nlocal ok, result = pcall(read_port, {})\nif ok then\n  print(\"port\", result)\nelse\n  print(\"failed:\", result)\nend\n\nlocal f, err = io.open(\"/no/such/file\", \"r\")\nif not f then print(err) end",
        "flags": [
          [
            "error(\"message\")",
            "Raise an error, adding the file and line"
          ],
          [
            "pcall(f, args)",
            "Call f safely. Returns false and the error if it fails."
          ],
          [
            "xpcall(f, handler)",
            "Like pcall, with a handler that runs on failure"
          ],
          [
            "assert(value, \"message\")",
            "Raise an error if value is nil or false"
          ],
          [
            "return nil, \"reason\"",
            "Common way to report an expected failure"
          ]
        ],
        "subcommands": [
          [
            "local f = assert(io.open(path))",
            "Open a file or stop with the reason"
          ],
          [
            "debug.traceback()",
            "Get the call stack as a string"
          ]
        ],
        "tip": "pcall takes the function and its arguments separately: pcall(f, x), not pcall(f(x)).",
        "tags": [
          "lua",
          "errors",
          "pcall",
          "xpcall",
          "assert",
          "exceptions"
        ]
      },
      {
        "id": "lua-file-io",
        "desc": "Read and write files line by line or all at once",
        "cmd": "local path = \"lua-demo.txt\"\nlocal out = assert(io.open(path, \"w\"))\nout:write(\"node-01\\nnode-02\\n\")\nout:close()\n\nfor line in io.lines(path) do\n  print(line)\nend\n\nlocal input = assert(io.open(path, \"r\"))\nlocal content = input:read(\"a\")\ninput:close()\nprint(#content)\nos.remove(path)",
        "flags": [
          [
            "io.open(path, mode)",
            "Open a file: \"r\" read, \"w\" overwrite, \"a\" append"
          ],
          [
            "f:read(\"a\")",
            "Read the whole file (Lua 5.1 needs \"*a\")"
          ],
          [
            "f:read(\"l\")",
            "Read one line (Lua 5.1 needs \"*l\")"
          ],
          [
            "io.lines(path)",
            "Loop over lines and close the file automatically"
          ],
          [
            "f:write(text)",
            "Write text. It adds no newline."
          ],
          [
            "f:close()",
            "Close the file and flush pending writes"
          ]
        ],
        "subcommands": [
          [
            "os.getenv(\"HOME\")",
            "Read an environment variable"
          ],
          [
            "os.execute(\"cmd\")",
            "Run a shell command"
          ],
          [
            "io.popen(\"cmd\"):read(\"a\")",
            "Run a shell command and capture its output"
          ],
          [
            "os.date(\"%Y-%m-%d\") / os.time()",
            "Formatted date / Unix timestamp"
          ]
        ],
        "tip": "\"w\" mode erases the file as soon as it opens, so use \"a\" to add to it.",
        "tags": [
          "lua",
          "files",
          "io",
          "read",
          "write",
          "lines",
          "os"
        ]
      },
      {
        "id": "lua-cli",
        "desc": "Run scripts, check syntax without running, and try code interactively",
        "cmd": "lua script.lua arg1 arg2\nlua -e 'print(2 ^ 10)'\nlua -i\nluac -p script.lua",
        "flags": [
          [
            "lua script.lua",
            "Run a script"
          ],
          [
            "lua -e 'code'",
            "Run one line of code"
          ],
          [
            "lua -i",
            "Interactive prompt (Ctrl+D to exit)"
          ],
          [
            "luac -p file.lua",
            "Check syntax only, without running anything"
          ],
          [
            "luajit file.lua",
            "Run with LuaJIT, the engine Neovim uses"
          ],
          [
            "arg[1]",
            "First command-line argument inside a script"
          ]
        ],
        "subcommands": [
          [
            "#!/usr/bin/env lua",
            "Shebang line for executable scripts"
          ],
          [
            "lua -v",
            "Show the installed version"
          ]
        ],
        "tip": "luac -p catches typos in a config file before you reload it.",
        "tags": [
          "lua",
          "cli",
          "luac",
          "luajit",
          "repl",
          "syntax-check",
          "arguments"
        ]
      }
    ]
  },
  {
    "id": "lua-config",
    "badge": "cfg",
    "title": "Reading & Editing Lua Config Files",
    "subtitle": "How Lua is used in Omarchy / Hyprland and Neovim config files",
    "commands": [
      {
        "id": "lua-config-omarchy",
        "desc": "Omarchy and Hyprland: bindings, unbinding defaults, and switching settings on",
        "cmd": "-- ~/.config/hypr/bindings.lua\nhl.unbind(\"SUPER + SHIFT + E\")\no.bind(\"SUPER + SHIFT + E\", \"Email\", { webapp = \"https://mail.google.com\" })\n\n-- ~/.config/hypr/looknfeel.lua\nhl.config({\n  general = {\n    layout = \"scrolling\",\n  },\n})",
        "flags": [
          [
            "o.bind(keys, label, action)",
            "Add a keybinding. All three arguments go in the parentheses."
          ],
          [
            "hl.unbind(keys)",
            "Remove a default binding before replacing it"
          ],
          [
            "{ webapp = \"url\" }",
            "A table passed as the action"
          ],
          [
            "hl.config({ ... })",
            "Set options using nested tables"
          ],
          [
            "require(\"hypr.bindings\")",
            "Loads ~/.config/hypr/bindings.lua"
          ],
          [
            "-- at line start",
            "The line is off. Delete -- to turn it on."
          ]
        ],
        "subcommands": [
          [
            "hyprctl configerrors",
            "List config problems after you save and reload"
          ],
          [
            "hyprctl reload",
            "Reload the Hyprland config"
          ]
        ],
        "tip": "When uncommenting a setting inside { }, uncomment the opening and closing lines too.",
        "tags": [
          "lua",
          "omarchy",
          "hyprland",
          "bindings",
          "config",
          "o.bind",
          "hl.unbind"
        ]
      },
      {
        "id": "lua-config-neovim",
        "desc": "Neovim: options, keymaps, and autocommands",
        "cmd": "-- ~/.config/nvim/init.lua\nvim.opt.number = true\nvim.opt.shiftwidth = 2\nvim.g.mapleader = \" \"\n\nvim.keymap.set(\"n\", \"<leader>w\", \"<cmd>write<cr>\", { desc = \"Save file\" })\n\nvim.api.nvim_create_autocmd(\"BufWritePre\", {\n  pattern = \"*.lua\",\n  callback = function() print(\"saving\") end,\n})",
        "flags": [
          [
            "vim.opt.name = value",
            "Set an editor option"
          ],
          [
            "vim.g.name = value",
            "Set a global variable"
          ],
          [
            "vim.keymap.set(mode, keys, action, opts)",
            "Add a keymap"
          ],
          [
            "vim.api.nvim_create_autocmd(event, opts)",
            "Run code on an editor event"
          ],
          [
            "return { \"owner/plugin\", opts = {} }",
            "Common shape of a plugin spec file"
          ]
        ],
        "subcommands": [
          [
            ":lua print(vim.version().minor)",
            "Run Lua from Neovim's command line"
          ],
          [
            ":lua =vim.opt.number:get()",
            "Print the value of an expression"
          ]
        ],
        "tip": "Neovim runs LuaJIT (Lua 5.1), so 5.3+ features such as // and bitwise operators are unavailable.",
        "tags": [
          "lua",
          "neovim",
          "nvim",
          "init.lua",
          "keymap",
          "autocmd",
          "config"
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("lua_cs_bookmarks") || "[]"))
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
  const totalCommands = LUA_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of LUA_CHEAT_SHEET_DATA) {
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
      <select id="category-select" class="cat-select" aria-label="Filter by ${escapeHtml('Lua')} section">
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

  for (const section of LUA_CHEAT_SHEET_DATA) {
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
      localStorage.setItem("lua_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
