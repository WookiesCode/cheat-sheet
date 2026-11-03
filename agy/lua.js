const LUA_CHEAT_SHEET_DATA = [
  {
    id: "lua-vars",
    badge: "vars",
    title: "Variables, Types, Scope & Strings",
    subtitle: "Local vs global scope, truthiness, type checking, string concatenation & pattern matching",
    commands: [
      {
        id: "lua-var-types",
        desc: "Declare variables with local scope, inspect types, and understand Lua truthiness",
        cmd: "-- Always use local for lexical scope\nlocal host = \"node-042\"\nlocal port = 8080\nlocal enabled = true\nlocal spare = nil\n\nprint(type(host), type(port), type(enabled), type(spare))\n-- Output: string  number  boolean  nil",
        flags: [
          ["local var = val", "Lexical block scope. Without 'local', variable leaks to global environment (_G)!"],
          ["type(v)", "Returns type as string: 'nil', 'boolean', 'number', 'string', 'table', 'function', 'thread', 'userdata'"],
          ["Truthiness", "In Lua, ONLY 'false' and 'nil' are falsy! 0, 0.0, and \"\" (empty string) are TRUTHY!"]
        ],
        subcommands: [
          ["local val = enabled and \"on\" or \"off\"", "Idiomatic Lua ternary idiom (ensure truthy value is never false/nil)"],
          ["local x, y, z = 1, 2, 3", "Multiple variable parallel assignment in a single line"],
          ["local PI <const> = 3.14159", "Lua 5.4 to-be-closed or compile-time constant variable attribute"]
        ],
        tip: "Rule of thumb in Lua: ALWAYS declare variables with 'local' unless intentionally exporting to _G",
        tags: ["lua", "variables", "types", "scope", "local", "truthiness", "nil"]
      },
      {
        id: "lua-strings-ops",
        desc: "String concatenation, multi-line blocks, length operator, and string formatting",
        cmd: "local prefix = \"gpu\"\nlocal id = 42\nlocal fqdn = prefix .. \"-\" .. string.format(\"%03d.dc.lan\", id)\nlocal raw_block = [[\n  Line 1: No escapes needed\n  Line 2: \"quotes\" & 'apostrophes' preserved\n]]\nprint(fqdn, \"Length:\", #fqdn)",
        flags: [
          ["..", "String concatenation operator (automatically coerces numbers to strings)"],
          ["#str", "Unary length operator: returns string byte count"],
          ["[[ ... ]]", "Multi-line string literal block: raw text preserving newlines and quotes"],
          ["string.format()", "C-style printf formatting (%s, %d, %02x, %.2f)"]
        ],
        subcommands: [
          ["string.upper(s) / string.lower(s)", "Convert string to all uppercase or lowercase"],
          ["string.sub(s, 1, 4)", "Extract substring (1-based indexing! -1 is last character)"],
          ["string.rep(\"=\", 40)", "Repeat string N times (e.g. print horizontal separator lines)"]
        ],
        tip: "Use 'table.concat(parts)' instead of repeated '..' loops when joining thousands of strings for 10x speed",
        tags: ["string", "concat", "format", "multiline", "length", "printf"]
      },
      {
        id: "lua-patterns",
        desc: "Lua pattern matching (lightweight regex alternative): find, match & gsub",
        cmd: "local log = \"[2026-11-02] ERROR node-042: GPU 3 dropped off bus\"\nlocal date, level, host = string.match(log, \"%[(%d+%-%d+%-%d+)%]%s+(%a+)%s+([%w%-]+)\")\nlocal cleaned = string.gsub(log, \"node%-%d+\", \"[REDACTED]\")\nprint(date, level, host)",
        flags: [
          ["%d / %D", "%d matches digit (0-9); %D matches non-digit"],
          ["%a / %w / %s", "%a letters; %w alphanumeric; %s whitespace (%S non-whitespace)"],
          ["(%b()) / (%b[])", "Balanced character match (e.g. parentheses or brackets)"],
          ["string.match(s, pat)", "Extract capture groups () matching pattern, or nil if no match"],
          ["string.gsub(s, pat, repl)", "Global search and replace: returns modified string and match count"]
        ],
        subcommands: [
          ["for match in string.gmatch(text, \"%S+\") do ... end", "Iterate over all whitespace-separated words in a string"],
          ["local start_pos, end_pos = string.find(text, \"ERROR\")", "Return starting and ending integer index of substring match"]
        ],
        tip: "Lua uses '%' instead of '\\' as the pattern escape character (e.g. '%.' matches a literal dot)",
        tags: ["patterns", "regex", "match", "gsub", "gmatch", "find", "search"]
      }
    ]
  },
  {
    id: "lua-tables",
    badge: "tables",
    title: "Tables: Arrays, Dictionaries & Metatables",
    subtitle: "Lua's single universal data structure: 1-based arrays, hash maps, table utilities & OOP metatables",
    commands: [
      {
        id: "lua-table-arrays",
        desc: "Sequential lists (arrays) in Lua: 1-based indexing, insertion, removal & length",
        cmd: "local nodes = { \"node-001\", \"node-002\", \"node-003\" }\ntable.insert(nodes, \"node-004\")      -- Append to end\ntable.insert(nodes, 1, \"head-000\")   -- Prepend at index 1\nlocal removed = table.remove(nodes)   -- Pop last element\n\nprint(\"Node count:\", #nodes)\nprint(\"First item:\", nodes[1])       -- 1-based index!",
        flags: [
          ["1-based indexing", "Arrays start at index 1! nodes[1] is the first item (not nodes[0])"],
          ["#table", "Returns array length (stops at the first nil element hole)"],
          ["table.insert(t, [pos,] val)", "Inserts element; shifts subsequent elements right"],
          ["table.remove(t [, pos])", "Removes element; shifts subsequent elements left"]
        ],
        subcommands: [
          ["table.concat(nodes, \", \")", "Join all array string elements with a separator"],
          ["table.sort(nodes)", "Sort array elements in-place in ascending order"],
          ["table.sort(nodes, function(a, b) return a > b end)", "Sort with custom comparator function (descending)"]
        ],
        tip: "Avoid creating 'holes' (nil values) in arrays, as '#table' may return an unpredictable length!",
        tags: ["table", "array", "list", "insert", "remove", "sort", "concat", "1-based"]
      },
      {
        id: "lua-table-dicts",
        desc: "Key-value hash maps (dictionaries) and nested table objects",
        cmd: "local server = {\n  hostname = \"gpu-worker-042\",\n  rack = \"Rack-14\",\n  ru_slot = 21,\n  gpus = { \"H200-0\", \"H200-1\", \"H200-2\", \"H200-3\" },\n  active = true\n}\n\nserver.uptime_days = 45          -- Dot notation\nserver[\"bmc-ip\"] = \"2001:db8::50\" -- Bracket notation for non-identifier keys\nprint(server.hostname, server[\"bmc-ip\"])",
        flags: [
          ["table.field", "Dot syntax works for keys that are valid Lua identifiers"],
          ["table[\"key\"]", "Bracket syntax allows any string, number, or object as a dictionary key"],
          ["table[key] = nil", "Deletes a key-value pair from the dictionary"]
        ],
        subcommands: [
          ["if server.rack then ... end", "Check if key exists in dictionary (returns nil if key is absent)"],
          ["local keys = {}; for k in pairs(server) do table.insert(keys, k) end", "Collect all dictionary keys into an array"]
        ],
        tip: "The length operator '#table' ONLY works on integer-indexed arrays, not on string-keyed dictionaries!",
        tags: ["dict", "hash", "map", "key-value", "object", "table", "nested"]
      },
      {
        id: "lua-metatables",
        desc: "Metatables, operator overloading, and prototypal inheritance (__index)",
        cmd: "local Server = {}\nServer.__index = Server\n\nfunction Server.new(hostname, rack)\n  local self = setmetatable({}, Server)\n  self.hostname = hostname\n  self.rack = rack\n  return self\nend\n\nfunction Server:describe()\n  return self.hostname .. \" in \" .. self.rack\nend\n\nlocal s1 = Server.new(\"dgx-01\", \"Rack-04\")\nprint(s1:describe())",
        flags: [
          ["setmetatable(tbl, meta)", "Associates a metatable with a table"],
          ["__index", "Fallback lookup table or function when a key is not found in the original table"],
          ["__tostring", "Metamethod invoked when object is passed to tostring() or print()"],
          ["Colon syntax (obj:method())", "Syntactic sugar for Server.describe(self) — passes self automatically!"]
        ],
        subcommands: [
          ["__add / __sub / __eq", "Operator overloading metamethods for +, -, and =="],
          ["__call", "Allows a table to be called directly like a function: tbl()"]
        ],
        tip: "Use the ':' colon operator for method definitions and calls to pass 'self' implicitly",
        tags: ["metatable", "oop", "class", "prototype", "inheritance", "colon", "self"]
      }
    ]
  },
  {
    id: "lua-flow",
    badge: "flow",
    title: "Control Flow, Conditionals & Loops",
    subtitle: "if/elseif/else/end, numeric for loops, generic pairs() vs ipairs() iteration & while loops",
    commands: [
      {
        id: "lua-conditionals",
        desc: "Branching logic with if, elseif, else, and boolean comparison operators",
        cmd: "local temp_c = 78\nlocal alert_level = \"\"\n\nif temp_c >= 85 then\n  alert_level = \"CRITICAL: Thermal Throttling!\"\nelseif temp_c >= 75 and temp_c < 85 then\n  alert_level = \"WARNING: High GPU Temp\"\nelse\n  alert_level = \"NORMAL: Operating Nominal\"\nend\n\nprint(alert_level)",
        flags: [
          ["if ... then ... end", "Requires 'then' after condition and 'end' at block termination"],
          ["elseif", "Spelled as a single word 'elseif' (not 'else if')!"],
          ["~=", "Not-equal operator in Lua (NOT !=)"],
          ["and / or / not", "Logical operators (lowercase words, not &&, ||, !)"]
        ],
        subcommands: [
          ["if x ~= nil and not done then ... end", "Combine logical negation and inequality"],
          ["local status = (code == 0) and \"SUCCESS\" or \"FAILED\"", "Compact inline conditional assignment"]
        ],
        tip: "Remember that '~=' is not-equal in Lua — typing '!=' will cause a syntax error!",
        tags: ["if", "elseif", "else", "then", "end", "conditionals", "operators"]
      },
      {
        id: "lua-loops",
        desc: "Loop iteration: numeric for, generic ipairs (arrays), pairs (dictionaries), and while",
        cmd: "-- 1. Numeric for loop: start, stop [, step]\nfor i = 1, 5, 2 do\n  print(\"Step:\", i) -- 1, 3, 5\nend\n\n-- 2. ipairs: guaranteed order for sequential arrays (1 to #tbl)\nlocal hosts = { \"node-01\", \"node-02\", \"node-03\" }\nfor idx, host in ipairs(hosts) do\n  print(idx, host)\nend\n\n-- 3. pairs: iterates over all keys (including non-integer/string keys)\nlocal metrics = { temp = 72, fan = 4500, psu = \"ok\" }\nfor k, v in pairs(metrics) do\n  print(k, \"=\", v)\nend",
        flags: [
          ["ipairs(array)", "Iterates index 1, 2, ... in order until first nil hole. Best for arrays!"],
          ["pairs(dict)", "Iterates all keys in undefined hash order. Best for dictionaries and key-value tables!"],
          ["while condition do ... end", "Pre-test loop: executes while condition is truthy"],
          ["repeat ... until condition", "Post-test loop: executes at least once, stops when condition is TRUE"]
        ],
        subcommands: [
          ["for i = #hosts, 1, -1 do ... end", "Reverse loop through an array using a step of -1"],
          ["break", "Exits the innermost loop immediately (Lua has no 'continue' keyword)"]
        ],
        tip: "To simulate 'continue' in Lua 5.2+, put a '::continue::' goto label at the bottom of the loop body",
        tags: ["loops", "for", "ipairs", "pairs", "while", "repeat", "break", "iteration"]
      }
    ]
  },
  {
    id: "lua-functions",
    badge: "fn",
    title: "Functions, Closures, Variadics & Modules",
    subtitle: "First-class functions, multiple return values, closures, varargs (...), and require modules",
    commands: [
      {
        id: "lua-func-multi-ret",
        desc: "Define functions with multiple return values, default parameters & variadics",
        cmd: "local function divide_checked(numerator, denominator)\n  if denominator == 0 then\n    return nil, \"Division by zero error\"\n  end\n  return numerator / denominator, nil\nend\n\nlocal result, err = divide_checked(100, 4)\nif err then\n  print(\"Failed:\", err)\nelse\n  print(\"Result:\", result)\nend",
        flags: [
          ["return val1, val2", "Functions can return multiple independent values"],
          ["val = param or default", "Idiomatic pattern for optional / default arguments"],
          ["function(...)", "Variadic function accepting arbitrary number of arguments into '...'"],
          ["local args = { ... }", "Packs variadic arguments into an array table"]
        ],
        subcommands: [
          ["local sum = function(a, b) return a + b end", "Anonymous function expression assigned to a variable"],
          ["local function counter()\n  local n = 0\n  return function() n = n + 1; return n end\nend", "Closure capturing upvalue state across function invocations"]
        ],
        tip: "Follow the standard Lua convention for error-prone functions: return 'result, nil' or 'nil, err_msg'",
        tags: ["function", "return", "multiple", "closure", "variadic", "args", "error-pattern"]
      },
      {
        id: "lua-modules",
        desc: "Write modular Lua libraries and export tables via require()",
        cmd: "-- In file: /opt/cluster/hardware.lua\nlocal M = {}\nM._VERSION = \"1.0.0\"\n\nfunction M.check_health(host)\n  return { host = host, status = \"OK\", gpus = 8 }\nend\n\nreturn M\n\n-- In consumer script:\n-- local hw = require(\"hardware\")\n-- local info = hw.check_health(\"node-042\")",
        flags: [
          ["local M = {}", "Standard Lua module convention: define a local table and return it at file end"],
          ["require(\"modname\")", "Loads module once and caches result in package.loaded[modname]"],
          ["package.path", "Semicolon-separated search path string for require (e.g. './?.lua;/opt/lua/?.lua')"]
        ],
        subcommands: [
          ["package.loaded[\"hardware\"] = nil", "Unload module from memory cache to allow dynamic reloading in Neovim/scripts"],
          ["local pcall_ok, mod = pcall(require, \"optional_mod\")", "Safely require a module without crashing if it is not installed"]
        ],
        tip: "Always wrap 'require' in a pcall if a plugin or third-party library might not be present",
        tags: ["module", "require", "package", "library", "export", "import"]
      }
    ]
  },
  {
    id: "lua-errors-files",
    badge: "io",
    title: "Error Handling, File I/O & System Execution",
    subtitle: "assert(), pcall() protected calls, reading/writing files, popen subcommands & CLI args",
    commands: [
      {
        id: "lua-pcall-assert",
        desc: "Error handling with assert(), pcall() (protected call), and xpcall() with tracebacks",
        cmd: "local function risky_query(bdf)\n  if not bdf then error(\"BDF address cannot be nil!\") end\n  return \"Link: Gen5 x16\"\nend\n\n-- pcall catches runtime errors: returns ok_status, result_or_err\nlocal ok, res = pcall(risky_query, nil)\nif not ok then\n  print(\"Caught error gracefully:\", res)\nend\n\n-- xpcall captures stack traceback\nlocal ok2, res2 = xpcall(\n  function() return risky_query(nil) end,\n  debug.traceback\n)",
        flags: [
          ["error(\"msg\" [, level])", "Throws a runtime error; terminates execution unless trapped by pcall"],
          ["assert(condition, \"msg\")", "Evaluates condition: returns condition if truthy, otherwise throws error"],
          ["pcall(fn, arg1, ...)", "Protected call: returns true + results on success, or false + error message on failure"],
          ["debug.traceback", "Captures full call stack frames with line numbers for post-mortem debugging"]
        ],
        subcommands: [
          ["local f = assert(io.open(\"/etc/hosts\", \"r\"))", "Open file or crash immediately with helpful OS error message"]
        ],
        tip: "Use pcall() whenever parsing untrusted JSON/YAML or querying hardware sysfs nodes that may vanish",
        tags: ["error", "pcall", "xpcall", "assert", "traceback", "try-catch", "exception"]
      },
      {
        id: "lua-file-io",
        desc: "Read and write files line-by-line using Lua's standard I/O library",
        cmd: "-- Read file line-by-line\nlocal file, err = io.open(\"/etc/os-release\", \"r\")\nif not file then\n  print(\"Cannot open file:\", err)\n  return\nend\n\nfor line in file:lines() do\n  if line:match(\"^PRETTY_NAME\") then\n    print(\"OS:\", line)\n  end\nend\nfile:close()\n\n-- Write text to file\nlocal out = assert(io.open(\"/tmp/audit.txt\", \"w\"))\nout:write(\"Node: gpu-worker-042\\nStatus: PASS\\n\")\nout:close()",
        flags: [
          ["io.open(path, mode)", "Modes: 'r' read, 'w' overwrite, 'a' append, 'r+' read/write, 'rb' binary"],
          ["file:lines()", "Memory-efficient iterator yielding one line at a time without reading whole file into RAM"],
          ["file:read(\"*a\")", "Read entire file contents into a single string (*all)"],
          ["file:close()", "Closes the file descriptor handle"]
        ],
        subcommands: [
          ["io.input(\"/path\"); local content = io.read(\"*a\")", "Simplified default input stream helper"]
        ],
        tip: "Always close open file descriptors or use io.lines(filename) which auto-closes upon EOF",
        tags: ["io", "file", "read", "write", "open", "lines", "append"]
      },
      {
        id: "lua-sys-popen",
        desc: "Execute shell commands, capture process stdout with io.popen, and read CLI args",
        cmd: "-- Read command stdout stream\nlocal handle = io.popen(\"uname -r\", \"r\")\nif handle then\n  local kernel = handle:read(\"*a\"):gsub(\"%s+$\", \"\")\n  handle:close()\n  print(\"Kernel version:\", kernel)\nend\n\n-- Access CLI script arguments via global 'arg' table\n-- arg[0] is script name; arg[1] is first argument\nprint(\"Script name:\", arg[0])\nfor i = 1, #arg do\n  print(\"Arg \" .. i .. \":\", arg[i])\nend",
        flags: [
          ["io.popen(cmd, \"r\")", "Spawns a shell sub-process and returns a readable pipe connected to its stdout"],
          ["os.execute(cmd)", "Runs command directly in shell; returns true/nil, exit_type, exit_code"],
          ["os.getenv(\"USER\")", "Reads environment variable from parent shell (returns nil if unset)"],
          ["arg[1], arg[2]...", "Global array holding command-line parameters passed to the script"]
        ],
        subcommands: [
          ["os.exit(1)", "Terminates the running Lua process with an exit status code"],
          ["os.time()", "Returns current epoch timestamp in seconds"]
        ],
        tip: "Always close handle with handle:close() to avoid leaking zombie sub-processes!",
        tags: ["popen", "execute", "shell", "subcommand", "cli", "arg", "env", "os"]
      }
    ]
  },
  {
    id: "lua-modules-stdlib",
    badge: "stdlib",
    title: "Modules, Packages & OS / System Standard Library",
    subtitle: "Reusable modules with require(), package.path, os.date, os.time, os.getenv & math utilities",
    commands: [
      {
        id: "lua-module-export",
        desc: "Structure and export reusable Lua modules with require() and custom search paths",
        cmd: "-- mymodule.lua\nlocal M = {}\nM.VERSION = \"1.2.0\"\n\nfunction M.format_mac(mac)\n  return mac:upper():gsub(\"([%x]{2})(?=[%x])\", \"%1:\")\nend\n\nfunction M.calc_pct(part, total)\n  if total == 0 then return 0.0 end\n  return (part / total) * 100\nend\n\nreturn M\n\n-- main.lua\n-- package.path = package.path .. \";./lib/?.lua\"\nlocal net = require(\"mymodule\")\nprint(\"Version:\", net.VERSION)\nprint(\"MAC:\", net.format_mac(\"e4115be99f20\"))",
        flags: [
          ["local M = {}", "Module table pattern: all exported public functions and constants are attached to M"],
          ["return M", "Module files must return their exported table at the end"],
          ["require(\"name\")", "Loads and runs file once; caches returned table in package.loaded[name]"],
          ["package.path", "Semicolon-delimited template string Lua uses to search for .lua source files"]
        ],
        subcommands: [
          ["package.loaded[\"mymodule\"] = nil", "Unload module from cache to force reload on next require()"],
          ["local ok, mod = pcall(require, \"optional_mod\")", "Safely test if optional module or C extension is installed"]
        ],
        tip: "Keep helper functions local to the file so they remain private to your module",
        tags: ["modules", "require", "package", "exports", "library", "architecture"]
      },
      {
        id: "lua-os-system",
        desc: "System time, date formatting, environment variables, and process exit status via os library",
        cmd: "-- Current timestamp & ISO 8601 UTC date\nlocal now = os.time()\nlocal iso = os.date(\"!%Y-%m-%dT%H:%M:%SZ\", now)\n\n-- Environment variables\nlocal user = os.getenv(\"USER\") or \"unknown\"\nlocal rack = os.getenv(\"TARGET_RACK\") or \"Rack-01\"\n\nprint(string.format(\"[%s] Audit run by %s on %s\", iso, user, rack))\n\n-- Exit script with status code\nif false then os.exit(1) end",
        flags: [
          ["os.time([table])", "Returns current UNIX epoch timestamp in seconds, or converts date table to epoch"],
          ["os.date(fmt, time)", "Formats epoch into string; leading '!' forces UTC/GMT instead of local timezone"],
          ["os.getenv(\"VAR\")", "Returns value of environment variable as string, or nil if unset"],
          ["os.exit(code)", "Terminates the host program/script with integer exit code (0 for success)"],
          ["os.difftime(t2, t1)", "Calculates elapsed time in seconds between two os.time timestamps"]
        ],
        subcommands: [
          ["local start = os.clock(); ...; print(os.clock() - start)", "Benchmark CPU execution time with fractional second precision"],
          ["local ok, kind, code = os.execute(\"ping -c 1 127.0.0.1 >/dev/null\")", "Run system command and check exit code"]
        ],
        tip: "Use os.date('!%Y-%m-%d %H:%M:%S') for RFC-3339 timestamps in datacenter incident logs",
        tags: ["os", "time", "date", "getenv", "exit", "epoch", "timestamp", "benchmark"]
      }
    ]
  }
];

// Global state for LUA sheet
let state = {
  searchQuery: "",
  activeCategory: "all",
  bookmarks: new Set(JSON.parse(localStorage.getItem("lua_cs_bookmarks") || "[]")),
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark"
};

// DOM references
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const commandCountEl = document.getElementById("command-count");
const totalCommandsCountEl = document.getElementById("total-commands-count");
const savedCountEl = document.getElementById("saved-count");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const resetSearchBtn = document.getElementById("reset-search-btn");

function getFilteredData() {
  const query = state.searchQuery.toLowerCase().trim();

  return LUA_CHEAT_SHEET_DATA.map((section) => {
    if (state.activeCategory !== "all" && section.id !== state.activeCategory) {
      return null;
    }

    const filteredCommands = section.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) {
        return false;
      }

      if (!query) return true;

      const inDesc = cmd.desc.toLowerCase().includes(query);
      const inCmd = cmd.cmd.toLowerCase().includes(query);
      const inDetails = cmd.details && cmd.details.toLowerCase().includes(query);
      const inTags = cmd.tags && cmd.tags.some((t) => t.toLowerCase().includes(query));
      const inSub = cmd.subcommands && cmd.subcommands.some(([c, d]) =>
        c.toLowerCase().includes(query) || d.toLowerCase().includes(query)
      );

      return inDesc || inCmd || inDetails || inTags || inSub;
    });

    if (filteredCommands.length === 0) return null;

    return {
      ...section,
      commands: filteredCommands
    };
  }).filter(Boolean);
}

function renderCategoryTabs() {
  if (!categoryTabsEl) return;
  const categories = [
    { id: "all", label: "All Lua Concepts" },
    ...LUA_CHEAT_SHEET_DATA.map((s) => ({ id: s.id, label: s.title.split(":")[0].trim() }))
  ];

  categoryTabsEl.innerHTML = categories
    .map(
      (cat) => `
    <button
      type="button"
      class="cat-tab ${state.activeCategory === cat.id ? "active" : ""}"
      data-cat="${cat.id}"
      role="tab"
      aria-selected="${state.activeCategory === cat.id}"
    >
      ${escapeHtml(cat.label)}
    </button>
  `
    )
    .join("");
}

function renderSections() {
  if (!sectionsContainer) return;
  const filteredData = getFilteredData();
  const totalVisibleCommands = filteredData.reduce((acc, s) => acc + s.commands.length, 0);

  if (commandCountEl) commandCountEl.textContent = totalVisibleCommands;
  if (savedCountEl) savedCountEl.textContent = state.bookmarks.size;

  const totalAll = LUA_CHEAT_SHEET_DATA.reduce((acc, s) => acc + s.commands.length, 0);
  if (totalCommandsCountEl) totalCommandsCountEl.textContent = totalAll;

  if (filteredData.length === 0) {
    sectionsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No matching Lua recipes found</h3>
        <p>Try searching for a different keyword, function, or clear active filters.</p>
        <button type="button" class="btn" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  sectionsContainer.innerHTML = filteredData.map((section) => renderSectionCard(section)).join("");
}

function renderSectionCard(section) {
  return `
    <section class="section-card" id="${section.id}">
      <div class="section-header">
        <div class="section-badge">${escapeHtml(section.badge)}</div>
        <div class="section-title-wrap">
          <h2 class="section-title">${escapeHtml(section.title)}</h2>
          <p class="section-subtitle">${escapeHtml(section.subtitle)}</p>
        </div>
      </div>
      <div class="commands-grid">
        ${section.commands.map((cmd) => renderCommandCard(cmd, section)).join("")}
      </div>
    </section>
  `;
}

function renderCommandCard(cmd, section) {
  const isBookmarked = state.bookmarks.has(cmd.id);

  return `
    <div class="cmd-item command-card" id="card-${cmd.id}" data-id="${cmd.id}">
      <div class="cmd-top-row">
        <div class="cmd-desc-wrap">
          <span class="cmd-desc">${escapeHtml(cmd.desc)}</span>
        </div>
        <div class="cmd-actions">
          <button
            type="button"
            class="bookmark-btn ${isBookmarked ? "active" : ""}"
            data-bookmark-id="${cmd.id}"
            title="${isBookmarked ? "Remove from saved" : "Save for quick access"}"
            aria-label="${isBookmarked ? "Remove from saved" : "Save for quick access"}"
          >
            ★
          </button>
        </div>
      </div>

      <div class="cmd-code-box" data-copy="${escapeHtml(cmd.cmd)}" title="Click to copy snippet">
        <div class="cmd-code-header">
          <span class="cmd-lang-label">LUA</span>
          <span class="copy-hint">Copy</span>
        </div>
        <pre class="cmd-pre"><code class="cmd-code">${escapeHtml(cmd.cmd)}</code></pre>
      </div>

      ${cmd.details ? `<div class="cmd-details cmd-details-box"><p>${escapeHtml(cmd.details)}</p></div>` : ""}

      ${
        cmd.flags && cmd.flags.length > 0
          ? `
        <div class="flag-pills cmd-flags-wrap">
          <span class="mini-heading">Syntax &amp; Semantics</span>
          <div class="flags-table">
            ${cmd.flags
              .map(
                ([flag, desc]) => `
              <div class="flag-row">
                <code class="flag-code">${escapeHtml(flag)}</code>
                <span class="flag-desc">${escapeHtml(desc)}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      ${
        cmd.subcommands && cmd.subcommands.length > 0
          ? `
        <div class="subcmd-list cmd-subcommands-wrap">
          <span class="mini-heading">Idiomatic Patterns &amp; Variations</span>
          <div class="subcommands-list">
            ${cmd.subcommands
              .map(
                ([subCmd, subDesc]) => `
              <div class="subcommand-item">
                <div class="sub-code-line" data-copy="${escapeHtml(subCmd)}" title="Click to copy">
                  <code>${escapeHtml(subCmd)}</code>
                  <span class="copy-hint-tiny">Copy</span>
                </div>
                <div class="sub-desc">${escapeHtml(subDesc)}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      <div class="cmd-footer-row">
        ${
          cmd.tags && cmd.tags.length > 0
            ? `
          <div class="cmd-tags-list">
            ${cmd.tags.map((t) => `<span class="cmd-tag">${escapeHtml(t)}</span>`).join("")}
          </div>
        `
            : "<div></div>"
        }
        ${cmd.tip ? `<span class="cmd-tip-pill" title="${escapeHtml(cmd.tip)}">💡 ${escapeHtml(cmd.tip)}</span>` : ""}
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function copyToClipboard(text) {
  if (!navigator.clipboard) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copied Lua snippet to clipboard!");
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => showToast("Copied Lua snippet to clipboard!"),
    () => showToast("Failed to copy code")
  );
}

function showToast(msg) {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("visible"), 10);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

function resetAllFilters() {
  state.searchQuery = "";
  state.activeCategory = "all";
  state.savedOnly = false;
  if (searchInput) searchInput.value = "";
  renderCategoryTabs();
  renderSections();
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("linux_cs_theme", theme);
  } catch (e) {}
}

function applyDensity(compact) {
  state.compact = compact;
  document.body.classList.toggle("compact-mode", compact);
  document.body.classList.toggle("compact-density", compact);
  if (densityToggleBtn) {
    densityToggleBtn.classList.toggle("active", compact);
    densityToggleBtn.setAttribute("aria-pressed", compact ? "true" : "false");
  }
  if (densityLabel) {
    densityLabel.textContent = compact ? "Relaxed" : "Compact";
  }
  try {
    localStorage.setItem("linux_cs_compact", compact ? "1" : "0");
  } catch (e) {}
}

function initEvents() {
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderSections();
    });
  }

  if (categoryTabsEl) {
    categoryTabsEl.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-cat]");
      if (!tab) return;
      state.activeCategory = tab.dataset.cat;
      renderCategoryTabs();
      renderSections();
    });
  }

  if (sectionsContainer) {
    sectionsContainer.addEventListener("click", (e) => {
      const copyBox = e.target.closest(".cmd-code-box");
      if (copyBox) {
        copyToClipboard(copyBox.dataset.copy);
        return;
      }

      const bookmarkBtn = e.target.closest(".bookmark-btn");
      if (bookmarkBtn) {
        const id = bookmarkBtn.dataset.bookmarkId;
        if (state.bookmarks.has(id)) {
          state.bookmarks.delete(id);
          showToast("Removed from saved snippets");
        } else {
          state.bookmarks.add(id);
          showToast("Saved snippet to bookmarks");
        }
        localStorage.setItem("lua_cs_bookmarks", JSON.stringify([...state.bookmarks]));
        renderSections();
      }
    });
  }

  if (savedFilterBtn) {
    savedFilterBtn.addEventListener("click", () => {
      state.savedOnly = !state.savedOnly;
      renderSections();
    });
  }

  if (densityToggleBtn) {
    densityToggleBtn.addEventListener("click", () => {
      applyDensity(!state.compact);
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", resetAllFilters);
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    } else if (e.key === "Escape") {
      if (document.activeElement === searchInput || state.searchQuery) {
        if (searchInput) searchInput.value = "";
        state.searchQuery = "";
        if (searchInput) searchInput.blur();
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
