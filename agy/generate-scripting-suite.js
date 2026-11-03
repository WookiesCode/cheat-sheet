// generate-scripting-suite.js
// Generates all 11 individual scripting & format cheat sheets with complete learner foundations:
// Variables, Loops, Conditionals, Functions, File I/O, Error Handling, and Idiomatic Recipes.
const fs = require('fs');
const path = require('path');

const SCRIPTING_LANGUAGES = [
  // 1. BASH & SHELL
  {
    key: 'bash',
    file: 'bash.html',
    js: 'bash.js',
    varName: 'BASH_CHEAT_SHEET_DATA',
    name: 'Bash',
    title: 'Bash & POSIX Shell Scripting',
    subtitle: 'Variables, loops, conditionals, functions, arrays, parameter expansion & error handling',
    pill: 'Bash 5 / POSIX sh',
    prompt: '$',
    cursor: '_',
    sections: [
      {
        id: "bash-vars",
        badge: "vars",
        title: "Variables, Data Types & Scope",
        subtitle: "Variable assignment, string quoting, numbers, environment variables & readonly",
        commands: [
          {
            id: "bash-var-declare",
            desc: "Variable assignment, quoting rules (single vs double vs raw), and string interpolation",
            cmd: "NAME=\"Server-01\"\nCOUNT=42\nreadonly PI=\"3.14159\"\nexport API_KEY=\"secret_token\"\necho \"Host: ${NAME}, Count: $((COUNT + 1))\"",
            flags: [
              ["No spaces around =", "NAME=\"val\" is valid; NAME = \"val\" fails with command not found"],
              ["\"$DOUBLE_QUOTES\"", "Expands variables ($VAR) and subshells ($(cmd))"],
              ["'SINGLE_QUOTES'", "Raw string literal: disables all expansion and variable interpolation"],
              ["readonly VAR", "Prevents variable from being reassigned or unset"],
              ["export VAR", "Exports variable to child processes and subshells in environment"]
            ],
            subcommands: [
              ["unset VAR", "Remove/delete variable from current shell environment"],
              ["echo $((10 * 5 + 3))", "Integer arithmetic evaluation using $(( expression ))"],
              ["RESULT=$(date +%Y-%m-%d)", "Command substitution: captures command stdout into variable"]
            ],
            tip: "Always wrap variables in quotes: \"$VAR\" to prevent word-splitting and globbing!",
            tags: ["bash", "variables", "types", "scope", "export", "readonly", "quotes"]
          },
          {
            id: "bash-param-expansion-deep",
            desc: "Advanced parameter expansion: defaults, substring slicing, length & pattern replacement",
            cmd: "FILE=\"archive_2026.tar.gz\"\necho \"Ext: ${FILE##*.} | Base: ${FILE%%.*} | Len: ${#FILE}\"\nFALLBACK=\"${USER_PORT:-8080}\"\nUPPER=\"${FILE^^}\"",
            flags: [
              ["${VAR:-default}", "Return default if VAR is unset or null (does not assign)"],
              ["${VAR:=default}", "Set VAR to default if unset or null"],
              ["${VAR#pattern} / ${VAR##pattern}", "Strip shortest (#) or longest (##) leading match from string"],
              ["${VAR%pattern} / ${VAR%%pattern}", "Strip shortest (%) or longest (%%) trailing match from string"],
              ["${VAR/find/replace}", "Replace first occurrence (${VAR//find/replace} for all occurrences)"],
              ["${VAR:offset:length}", "Extract substring starting at offset for length characters"],
              ["${VAR^^} / ${VAR,,}", "Convert string to all UPPERCASE (^^) or lowercase (,,)"]
            ],
            subcommands: [
              ["${VAR:?error_msg}", "Exit script with error_msg if VAR is unset or empty"],
              ["${!PREFIX*}", "List all variable names currently defined starting with PREFIX"]
            ],
            tip: "Parameter expansions execute natively in memory inside Bash without spawning subshells or sed processes.",
            tags: ["bash", "parameter-expansion", "substring", "defaults", "string-manipulation"]
          },
          {
            id: "bash-arrays",
            desc: "Indexed arrays, associative key-value maps, iteration & element manipulation",
            cmd: "# Indexed array\nNODES=(\"node-01\" \"node-02\" \"node-03\")\nNODES+=(\"node-04\")\necho \"First: ${NODES[0]} | Total: ${#NODES[@]}\"\n\n# Associative array (Bash 4+)\ndeclare -A BMC_IPS\nBMC_IPS=([\"node-01\"]=\"10.0.0.10\" [\"node-02\"]=\"10.0.0.11\")\necho \"IP: ${BMC_IPS[\"node-01\"]}\"",
            flags: [
              ["${ARRAY[@]}", "Expands to all elements as separate quoted words"],
              ["${#ARRAY[@]}", "Returns count/length of elements in array"],
              ["${!ARRAY[@]}", "Returns list of indices or associative keys"],
              ["ARRAY+=(\"val\")", "Appends new element to end of indexed array"],
              ["declare -A MAP", "Mandatory declaration for associative arrays (hash maps)"]
            ],
            subcommands: [
              ["unset 'ARRAY[1]'", "Deletes element at index 1"],
              ["for k in \"${!BMC_IPS[@]}\"; do echo \"$k -> ${BMC_IPS[$k]}\"; done", "Iterate over associative array key-value pairs"]
            ],
            tip: "Always use \"${ARRAY[@]}\" with quotes so items containing spaces aren't split into multiple arguments.",
            tags: ["bash", "arrays", "associative", "hashmap", "collections"]
          }
        ]
      },
      {
        id: "bash-control",
        badge: "control",
        title: "Conditionals & Comparison Operators",
        subtitle: "Modern [[ ... ]] tests, integer vs string checks, file tests & case statements",
        commands: [
          {
            id: "bash-if-conditions",
            desc: "Modern [[ ... ]] conditional branching with integer, string, file tests & regex matching",
            cmd: "PORT=8080\nif [[ -f \"/etc/server.conf\" && \"$PORT\" -gt 1024 ]]; then\n  echo \"Valid config on unprivileged port\"\nelif [[ ! -e \"/etc/server.conf\" ]]; then\n  echo \"Config missing\"\nelse\n  echo \"Port requires root\"\nfi",
            flags: [
              ["-eq, -ne, -lt, -gt, -le, -ge", "Integer comparisons only (never use == or < for numbers)"],
              ["==, !=, <, >", "String lexicographical comparisons inside [[ ... ]]"],
              ["-z \"$VAR\" / -n \"$VAR\"", "-z tests if string is empty; -n tests if string is non-empty"],
              ["-f file / -d dir", "-f tests if regular file exists; -d tests if directory exists"],
              ["-e path / -s file", "-e tests if path exists; -s tests if file exists and size > 0"],
              ["-r, -w, -x", "Tests if file is readable (-r), writable (-w), or executable (-x)"],
              ["[[ \"$STR\" =~ ^[0-9]+$ ]]", "Regex pattern matching natively supported inside [[ ... ]]"]
            ],
            subcommands: [
              ["[[ condition ]] && true_action || false_action", "Compact ternary-style short-circuit execution"],
              ["(( COUNT > 10 ))", "Arithmetic evaluation conditional without dollar signs"]
            ],
            tip: "Always use [[ ... ]] instead of legacy [ ... ] in Bash to prevent syntax errors on empty strings.",
            tags: ["bash", "if", "conditionals", "comparison", "regex", "file-tests"]
          },
          {
            id: "bash-case-match",
            desc: "Multi-branch pattern matching with case / esac statements and glob wildcards",
            cmd: "case \"$1\" in\n  start|START)\n    echo \"Starting service...\" ;;\n  stop)\n    echo \"Stopping service...\" ;;\n  --port=*) \n    PORT=\"${1#*=}\" ;;\n  *)\n    echo \"Usage: $0 {start|stop|--port=N}\" >&2\n    exit 1 ;;\nesac",
            flags: [
              ["pattern1 | pattern2)", "Matches either pattern1 or pattern2"],
              [";;", "Terminates the branch (like break in C/Java)"],
              [";;&", "Tests subsequent patterns (fallthrough evaluation)"],
              ["*)", "Default fallback matching anything not matched above"]
            ],
            subcommands: [
              ["case \"$OS\" in [Uu]buntu|[Dd]ebian) PKG=\"apt\" ;; [Rr][Hh][Ee][Ll]) PKG=\"dnf\" ;; esac", "Case-insensitive OS branching"]
            ],
            tip: "Use case statements for CLI argument parsing instead of nested if-elif-else blocks for clean code.",
            tags: ["bash", "case", "switch", "branching", "cli-args"]
          }
        ]
      },
      {
        id: "bash-loops",
        badge: "loops",
        title: "Loops & Iteration",
        subtitle: "for loops, numeric ranges, while loops, safe file reading & loop control",
        commands: [
          {
            id: "bash-for-loops",
            desc: "Iterate over lists, file wildcards, brace expansions and C-style 3-expression loops",
            cmd: "# Loop over array or words\nfor HOST in \"node-01\" \"node-02\" \"node-03\"; do\n  ping -c 1 \"$HOST\" >/dev/null && echo \"$HOST online\"\ndone\n\n# Numeric range & C-style loop\nfor i in {1..5}; do echo \"Step $i\"; done\nfor ((i=0; i<10; i+=2)); do echo \"Even: $i\"; done",
            flags: [
              ["for item in \"${LIST[@]}\"", "Iterate over every item in an array safely"],
              ["for f in /var/log/*.log", "Iterate over all matching files (globbing)"],
              ["{1..10..2}", "Brace expansion: start..end..step (Bash 4+)"],
              ["break / continue", "break exits loop immediately; continue skips to next iteration"]
            ],
            subcommands: [
              ["for f in *; do [[ -f \"$f\" ]] || continue; echo \"$f\"; done", "Skip non-files safely"],
              ["for ((;;)); do echo \"Infinite\"; sleep 1; done", "Infinite loop with sleep interval"]
            ],
            tip: "Never use for line in $(cat file.txt); words with spaces will break into multiple loop iterations!",
            tags: ["bash", "for", "loops", "range", "iteration", "brace-expansion"]
          },
          {
            id: "bash-while-read",
            desc: "Safe line-by-line file reading without trailing newline loss & stream iteration",
            cmd: "while IFS= read -r LINE || [[ -n \"$LINE\" ]]; do\n  [[ \"$LINE\" =~ ^# || -z \"$LINE\" ]] && continue\n  echo \"Processing: $LINE\"\ndone < \"/etc/hosts\"",
            flags: [
              ["IFS=", "Clears Internal Field Separator to preserve leading/trailing whitespace"],
              ["read -r", "Prevents backslash escapes from being interpreted or stripped"],
              ["|| [[ -n \"$LINE\" ]]", "Ensures last line of file is processed even if missing trailing newline"],
              ["done < file", "Feeds file directly to loop without spawning subshell processes"]
            ],
            subcommands: [
              ["command | while IFS= read -r line; do ... done", "Process stdout stream of command line-by-line"],
              ["while IFS=',' read -r col1 col2 col3; do ... done < data.csv", "Parse CSV columns directly into variables"]
            ],
            tip: "done < file runs in current shell so variables modified inside loop persist after loop finishes.",
            tags: ["bash", "while", "read", "stream", "file-io", "csv"]
          }
        ]
      },
      {
        id: "bash-func-err",
        badge: "func",
        title: "Functions, CLI Arguments & Error Traps",
        subtitle: "Function declarations, argument parsing, return codes & automatic cleanup traps",
        commands: [
          {
            id: "bash-functions-args",
            desc: "Function definitions, local variables, return status vs return values & CLI arguments",
            cmd: "#!/usr/bin/env bash\nset -euo pipefail\n\nlog_msg() {\n  local LEVEL=\"$1\"\n  local MESSAGE=\"$2\"\n  echo \"[$(date +%T)] [${LEVEL}] ${MESSAGE}\"\n}\n\nlog_msg \"INFO\" \"Script started with $# arguments (Args: $@)\"",
            flags: [
              ["local VAR=\"val\"", "Restricts variable scope strictly to function body (essential!)"],
              ["$1, $2 ... $9", "Positional arguments passed to function or script"],
              ["$#", "Total count of positional arguments passed"],
              ["$@", "All arguments passed as individually quoted words (\"$1\" \"$2\")"],
              ["$*", "All arguments joined into a single string (\"$1 $2\")"],
              ["return N", "Exits function returning numeric exit code (0 = success, 1-255 = error)"],
              ["echo \"$val\"", "Return strings/data by echoing from function and capturing with $(func)"]
            ],
            subcommands: [
              ["shift", "Shifts positional arguments to the left: $2 becomes $1, $# decrements"],
              ["getopts \"p:h\" opt", "Standard POSIX option parsing loop for flags like -p 8080 -h"]
            ],
            tip: "set -euo pipefail at the top of your scripts catches uninitialized variables and pipe errors immediately.",
            tags: ["bash", "functions", "local", "arguments", "flags", "getopts"]
          },
          {
            id: "bash-traps-cleanup",
            desc: "Automatic cleanup on script exit, interruption (Ctrl+C) and error handling",
            cmd: "TMPDIR=$(mktemp -d)\ncleanup() {\n  echo \"Cleaning up temporary directory: $TMPDIR\"\n  rm -rf \"$TMPDIR\"\n}\ntrap cleanup EXIT ERR INT TERM\n\n# Your script logic below\necho \"Working in $TMPDIR...\"",
            flags: [
              ["trap cleanup EXIT", "Runs cleanup function whenever script terminates for ANY reason"],
              ["trap cleanup INT", "Runs cleanup when user interrupts with Ctrl+C (SIGINT)"],
              ["trap cleanup TERM", "Runs cleanup when killed by systemd or kill command (SIGTERM)"],
              ["trap cleanup ERR", "Triggers when any command fails with non-zero exit code"],
              ["$? == 0", "Checks exit code of immediately preceding command (0 = success)"]
            ],
            subcommands: [
              ["trap - EXIT", "Disables/unregisters the trap handler"],
              ["trap 'echo \"Error on line $LINENO\"' ERR", "Print file line number where an error occurred"]
            ],
            tip: "Traps guarantee temporary scratch directories and lock files are cleaned up even if script crashes.",
            tags: ["bash", "trap", "cleanup", "exit", "signals", "error-handling"]
          }
        ]
      }
    ]
  },

  // 2. PYTHON
  {
    key: 'python',
    file: 'python.html',
    js: 'python.js',
    varName: 'PYTHON_CHEAT_SHEET_DATA',
    name: 'Python',
    title: 'Python 3.10+ Reference & Scripting',
    subtitle: 'Variables, data types, collections, comprehensions, loops, pattern matching & file I/O',
    pill: 'Python 3.10+ / Standard Lib',
    prompt: 'py',
    cursor: '>>>',
    sections: [
      {
        id: "py-vars-types",
        badge: "types",
        title: "Variables, Types & Data Structures",
        subtitle: "Variable declarations, type hints, lists, dicts, tuples, sets & comprehensions",
        commands: [
          {
            id: "py-variables-typing",
            desc: "Variable declarations, type annotations, and modern f-string formatting",
            cmd: "# Variable assignment with type hints\nhost: str = \"node-01\"\nport: int = 8080\ntemp: float = 42.5\nis_active: bool = True\n\n# Formatted f-strings (Python 3.6+)\nprint(f\"Host: {host.upper()} | Port: {port} | Temp: {temp:.1f}°C\")",
            flags: [
              ["str, int, float, bool", "Primitive Python built-in types"],
              ["name: type = val", "Type hints: documented types checked by mypy and IDEs"],
              ["f\"{val:.2f}\"", "Format float to 2 decimal places inside f-string"],
              ["f\"{val=}\"", "Python 3.8+ debugging print shorthand: outputs 'val=42'"],
              ["r\"raw\\string\"", "Raw string: backslashes are not treated as escape sequences"]
            ],
            subcommands: [
              ["type(var)", "Inspect dynamic runtime type of variable"],
              ["isinstance(var, (int, float))", "Check if variable matches one or more types"],
              ["None", "Python's null/nil singleton representing absence of value"]
            ],
            tip: "Type hints don't affect runtime speed, but prevent common bugs and enable autocomplete in editors.",
            tags: ["python", "variables", "types", "f-strings", "annotations", "primitives"]
          },
          {
            id: "py-collections-deep",
            desc: "Core collections: Lists (mutable), Dicts (hashmap), Tuples (immutable) & Sets (unique)",
            cmd: "# List & Tuple\nnodes: list[str] = [\"node-01\", \"node-02\", \"node-03\"]\ncoordinates: tuple[int, int] = (10, 20)\n\n# Dictionary (Hashmap)\nbmc_info: dict[str, str] = {\"ip\": \"10.0.0.10\", \"user\": \"ADMIN\"}\nbmc_info[\"status\"] = \"ONLINE\"\n\n# Unique Set\nsubnets: set[str] = {\"10.0.0.0/24\", \"192.168.1.0/24\"}",
            flags: [
              ["list.append(x)", "Appends element x to end of list"],
              ["list[start:stop:step]", "Slice list: [::-1] reverses, [:2] gets first 2 items"],
              ["dict.get(key, default)", "Safe key lookup returning default if key doesn't exist"],
              ["dict.items()", "Returns iterable (key, value) tuples for looping"],
              ["set.union() / set.intersection()", "Set mathematical operations (&, |, -)"]
            ],
            subcommands: [
              ["nums = [x * 2 for x in range(5) if x % 2 == 0]", "List comprehension: compact, fast list building"],
              ["mapping = {k: v.upper() for k, v in bmc_info.items()}", "Dictionary comprehension"],
              ["a, b, *rest = [1, 2, 3, 4, 5]", "Extended iterable unpacking into variables"]
            ],
            tip: "Always use dict.get(\"key\", default) instead of dict[\"key\"] to avoid raising KeyError exceptions.",
            tags: ["python", "collections", "list", "dict", "tuple", "set", "comprehensions"]
          }
        ]
      },
      {
        id: "py-control-flow",
        badge: "control",
        title: "Conditionals & Pattern Matching",
        subtitle: "if-elif-else, boolean logic, membership operators & Python 3.10+ match/case",
        commands: [
          {
            id: "py-if-else",
            desc: "Conditional branching with boolean operators (and, or, not) and membership tests",
            cmd: "status = \"CRITICAL\"\ntemp = 85.5\n\nif status == \"CRITICAL\" and temp > 80.0:\n    print(\"Emergency thermal throttling triggered!\")\nelif status in (\"WARNING\", \"DEGRADED\"):\n    print(\"Warning state detected\")\nelse:\n    print(\"Normal operation\")\n\n# Ternary expression\nmode = \"production\" if is_active else \"staging\"",
            flags: [
              ["and, or, not", "Readable boolean logical operators (not &&, ||, !)"],
              ["x in collection", "Checks membership in list, set, tuple, or string substring"],
              ["is / is not", "Identity check (checks memory address: use exclusively for None)"],
              ["Truthy vs Falsy", "Falsy values: 0, 0.0, \"\", [], {}, set(), None, False"],
              ["x if cond else y", "One-line ternary conditional expression"]
            ],
            subcommands: [
              ["if not my_list:", "Idiomatic way to check if a list/string/dict is empty"],
              ["any([x > 80 for x in temps])", "Returns True if at least one item satisfies condition"],
              ["all([x > 0 for x in temps])", "Returns True only if every item satisfies condition"]
            ],
            tip: "Never compare with 'if var == None:'. Always write 'if var is None:' for identity comparison.",
            tags: ["python", "if", "else", "conditionals", "ternary", "truthy", "falsy"]
          },
          {
            id: "py-match-case",
            desc: "Modern structural pattern matching (Python 3.10+ match-case with guards)",
            cmd: "def handle_event(event: dict):\n    match event:\n        case {\"type\": \"alert\", \"level\": \"CRITICAL\", \"node\": node}:\n            print(f\"Critical alert on {node}!\")\n        case {\"type\": \"ping\", \"latency\": ms} if ms > 100:\n            print(f\"High latency detected: {ms}ms\")\n        case [\"ssh\", host, int(port)]:\n            print(f\"Connecting to {host}:{port}\")\n        case _:\n            print(\"Unknown event pattern\")",
            flags: [
              ["match val / case pattern:", "Unpacks structures and validates types simultaneously"],
              ["case ... if condition:", "Pattern guard: executes only if condition evaluates to True"],
              ["case _:", "Wildcard catch-all branch matching any remaining input"],
              ["case [a, b, *rest]:", "Sequence unpacking pattern matching lists/tuples"]
            ],
            subcommands: [
              ["case int() | float():", "Union pattern matching multiple alternative types"]
            ],
            tip: "match-case replaces complex nested isinstance checks and dictionary structure validators.",
            tags: ["python", "match", "case", "pattern-matching", "switch"]
          }
        ]
      },
      {
        id: "py-loops",
        badge: "loops",
        title: "Loops & Iteration",
        subtitle: "for loops, enumerate, zip, dictionary iteration, while loops & loop control",
        commands: [
          {
            id: "py-for-loops-deep",
            desc: "Iterate over sequences with enumerate() for index tracking and zip() for parallel lists",
            cmd: "nodes = [\"srv-01\", \"srv-02\", \"srv-03\"]\nips = [\"10.0.0.1\", \"10.0.0.2\", \"10.0.0.3\"]\n\n# Enumerate with custom start index\nfor idx, node in enumerate(nodes, start=1):\n    print(f\"#{idx}: {node}\")\n\n# Parallel iteration with zip\nfor node, ip in zip(nodes, ips):\n    print(f\"{node} -> {ip}\")",
            flags: [
              ["for item in iterable:", "Iterates over any sequence, generator, or collection"],
              ["enumerate(seq, start=0)", "Yields (index, item) pairs without manual counter variables"],
              ["zip(seq1, seq2)", "Combines multiple iterables pair-by-pair until shortest ends"],
              ["break / continue", "break stops loop immediately; continue skips to next item"],
              ["for ... else:", "else block executes ONLY if loop completed without hitting break"]
            ],
            subcommands: [
              ["for key, val in my_dict.items():", "Iterate over both keys and values of dictionary"],
              ["for i in range(0, 10, 2):", "Generate arithmetic progressions (start, stop, step)"],
              ["while count > 0: count -= 1", "Standard while loop condition"]
            ],
            tip: "Never use for i in range(len(items)):. Use for item in items: or for i, item in enumerate(items):.",
            tags: ["python", "for", "while", "loops", "enumerate", "zip", "iteration"]
          }
        ]
      },
      {
        id: "py-func-io",
        badge: "func",
        title: "Functions, File I/O & Exception Handling",
        subtitle: "def, *args, **kwargs, safe file I/O with context managers & try/except/finally",
        commands: [
          {
            id: "py-functions-advanced",
            desc: "Function definitions with typed parameters, default values, variable args and docstrings",
            cmd: "def deploy_node(name: str, port: int = 22, *tags: str, **metadata: str) -> bool:\n    \"\"\"Deploy a node with optional tags and arbitrary metadata.\"\"\"\n    print(f\"Deploying {name}:{port} | Tags: {tags} | Meta: {metadata}\")\n    return True\n\n# Calling with positional, variable, and keyword arguments\ndeploy_node(\"gpu-01\", 22, \"h100\", \"sxm5\", rack=\"R12\", zone=\"us-east\")",
            flags: [
              ["def name(...) -> ReturnType:", "Function definition with parameter and return type hints"],
              ["arg: int = 22", "Default parameter value (evaluated once at module import)"],
              ["*args", "Collects arbitrary extra positional arguments as a tuple"],
              ["**kwargs", "Collects arbitrary extra keyword arguments as a dictionary"],
              ["lambda x: x * 2", "Anonymous inline function for callbacks or sorting keys"]
            ],
            subcommands: [
              ["deploy_node(**config_dict)", "Unpack dictionary as keyword arguments into function call"],
              ["deploy_node(*arg_list)", "Unpack list as positional arguments into function call"]
            ],
            tip: "Never use mutable objects (like [] or {}) as default arguments; use arg: list = None instead.",
            tags: ["python", "functions", "args", "kwargs", "lambda", "typing"]
          },
          {
            id: "py-file-io-exceptions",
            desc: "Exception handling with try/except/else/finally and safe file I/O with context managers",
            cmd: "import json\nfrom pathlib import Path\n\nfile_path = Path(\"/etc/datacenter/config.json\")\n\ntry:\n    # Safe context manager: auto-closes file even on error\n    with open(file_path, \"r\", encoding=\"utf-8\") as f:\n        data = json.load(f)\nexcept FileNotFoundError:\n    print(f\"Config file missing: {file_path}\")\n    data = {}\nexcept json.JSONDecodeError as err:\n    print(f\"Malformed JSON on line {err.lineno}: {err.msg}\")\n    raise SystemExit(1)\nfinally:\n    print(\"Execution finished\")",
            flags: [
              ["with open(...) as f:", "Context manager guaranteeing file descriptor is closed properly"],
              ["encoding=\"utf-8\"", "Always specify encoding explicitly to prevent cross-platform errors"],
              ["mode: \"r\", \"w\", \"a\"", "Read (\"r\"), overwrite/write (\"w\"), append (\"a\")"],
              ["except SpecificError as e:", "Always catch specific exceptions rather than bare except:"],
              ["finally:", "Guaranteed cleanup block that always runs whether error occurred or not"]
            ],
            subcommands: [
              ["Path(\"data.txt\").read_text(encoding=\"utf-8\")", "Modern pathlib one-liner for reading entire text file"],
              ["Path(\"out.txt\").write_text(\"hello\", encoding=\"utf-8\")", "Modern pathlib one-liner for writing text file"]
            ],
            tip: "Use pathlib.Path for all file path operations instead of legacy os.path methods.",
            tags: ["python", "file-io", "exceptions", "try-except", "json", "pathlib", "with"]
          }
        ]
      }
    ]
  },

  // 3. JAVASCRIPT
  {
    key: 'javascript',
    file: 'javascript.html',
    js: 'javascript.js',
    varName: 'JS_CHEAT_SHEET_DATA',
    name: 'JavaScript',
    title: 'JavaScript (ES2024 / Node.js) Reference',
    subtitle: 'Variables, data types, operators, loops, functions, array methods, async/await & JSON',
    pill: 'ES2024 / Node.js 20+',
    prompt: 'js',
    cursor: '>',
    sections: [
      {
        id: "js-vars-types",
        badge: "types",
        title: "Variables, Scope & Operators",
        subtitle: "const vs let, template literals, destructuring, nullish coalescing & strict equality",
        commands: [
          {
            id: "js-const-let-templates",
            desc: "Block-scoped variable declarations, template literals, and destructuring assignment",
            cmd: "const serverName = 'node-01';\nlet connectionCount = 0;\nconst ports = [8000, 8080];\nconst [mainPort, backupPort = 9000] = ports;\n\n// Template literal with interpolation\nconsole.log(`Server: ${serverName}:${mainPort} (conns: ${++connectionCount})`);",
            flags: [
              ["const", "Block-scoped immutable binding (value itself can still be mutable if object/array)"],
              ["let", "Block-scoped reassignable variable"],
              ["Avoid 'var'", "Legacy function-scoped keyword with hoisting pitfalls"],
              ["Template literal (`... ${var}`)", "Supports multi-line strings and expression interpolation"],
              ["const { id, ip = '127.0.0.1' } = node", "Object destructuring with default fallback values"]
            ],
            subcommands: [
              ["const merged = { ...defaults, ...userConfig };", "Object spread: clones and shallow-merges objects"],
              ["const clone = [...originalArray, 'new_item'];", "Array spread: clones and appends elements"]
            ],
            tip: "Default to const everywhere; only use let when a variable must be reassigned.",
            tags: ["javascript", "const", "let", "variables", "template-literals", "destructuring", "spread"]
          },
          {
            id: "js-operators-truthiness",
            desc: "Strict equality (===), nullish coalescing (??) and optional chaining (?.)",
            cmd: "const timeout = config.timeout ?? 5000; // Only defaults on null/undefined\nconst bmcIp = node?.network?.bmc?.ip ?? '127.0.0.1';\n\nif (status === 'READY' && count !== 0) {\n  console.log('Operational');\n}",
            flags: [
              ["=== and !==", "Strict equality/inequality: checks value AND type without type coercion"],
              ["?? (Nullish Coalescing)", "Returns right side ONLY if left is null or undefined (preserves 0, false, '')"],
              ["|| (Logical OR)", "Returns right side if left is any falsy value (0, false, '', null, NaN)"],
              ["?. (Optional Chaining)", "Safely accesses nested properties without throwing TypeError if parent is nullish"],
              ["Falsy values", "false, 0, -0, 0n, '', null, undefined, NaN"]
            ],
            subcommands: [
              ["const label = isOnline ? 'Active' : 'Offline';", "Ternary conditional expression"],
              ["isReady && startService();", "Short-circuit execution: runs startService only if isReady is true"]
            ],
            tip: "Never use == or != in modern JavaScript. Always use strict === and !== to prevent type coercion bugs.",
            tags: ["javascript", "operators", "nullish", "optional-chaining", "equality", "truthy"]
          }
        ]
      },
      {
        id: "js-control",
        badge: "control",
        title: "Conditionals, Loops & Iteration",
        subtitle: "if-else, switch, for-of, for-in, while, and classic loops",
        commands: [
          {
            id: "js-loops-classic-modern",
            desc: "Classic for loop, for...of (iterables), for...in (object keys), and loop control",
            cmd: "const nodes = ['srv-01', 'srv-02', 'srv-03'];\n\n// for...of: best for arrays, strings, maps, sets\nfor (const node of nodes) {\n  if (node === 'srv-02') continue;\n  console.log(`Checking ${node}`);\n}\n\n// for...in: iterates enumerable object keys\nconst config = { host: 'localhost', port: 8080 };\nfor (const key in config) {\n  console.log(`${key}: ${config[key]}`);\n}",
            flags: [
              ["for (const item of iterable)", "Iterates directly over values of arrays, sets, maps, strings"],
              ["for (const key in object)", "Iterates over property names/keys of an object"],
              ["for (let i = 0; i < arr.length; i++)", "Classic indexed loop with explicit index counter"],
              ["while (condition) { ... }", "Repeats while condition is true"],
              ["break / continue", "break terminates loop immediately; continue skips to next iteration"]
            ],
            subcommands: [
              ["for (const [index, val] of nodes.entries()) { ... }", "Iterate over both index and value using .entries()"],
              ["switch (status) { case 'UP': ... break; default: ... }", "Multi-branch switch statement"]
            ],
            tip: "Use for...of for arrays and for...in for plain objects. Never use for...in on arrays.",
            tags: ["javascript", "for", "for-of", "for-in", "while", "loops", "iteration"]
          },
          {
            id: "js-functional-array-methods",
            desc: "Modern functional array transformations: map, filter, find, some, every, reduce",
            cmd: "const servers = [\n  { id: 's1', load: 45, online: true },\n  { id: 's2', load: 92, online: true },\n  { id: 's3', load: 10, online: false }\n];\n\n// Filter active and extract IDs\nconst activeIds = servers\n  .filter(s => s.online)\n  .map(s => s.id);\n\n// Find single item & calculate total load\nconst overloaded = servers.find(s => s.load > 90);\nconst avgLoad = servers.reduce((acc, s) => acc + s.load, 0) / servers.length;",
            flags: [
              [".map(fn)", "Transforms each element, returning a new array of same length"],
              [".filter(fn)", "Returns a new array containing only elements where fn returns truthy"],
              [".find(fn)", "Returns the first matching element, or undefined if not found"],
              [".some(fn) / .every(fn)", "some tests if at least one matches; every tests if all match"],
              [".reduce((acc, cur) => ..., initial)", "Reduces array to a single cumulative value"],
              [".flat() / .flatMap(fn)", "Flattens nested array dimensions"]
            ],
            subcommands: [
              ["[...new Set(duplicates)]", "Deduplicate array elements instantly using Set"],
              ["servers.sort((a, b) => b.load - a.load)", "Numeric sorting (b - a for descending order)"]
            ],
            tip: "Array methods like map and filter return new arrays without mutating the original input.",
            tags: ["javascript", "arrays", "map", "filter", "reduce", "find", "functional"]
          }
        ]
      },
      {
        id: "js-async-errors",
        badge: "async",
        title: "Functions, Promises & Async/Await",
        subtitle: "Arrow functions, closures, try/catch/finally, async/await & Promise.all",
        commands: [
          {
            id: "js-async-await-fetch",
            desc: "Asynchronous programming with async/await, Promise concurrency & try/catch error handling",
            cmd: "async function queryNode(ip) {\n  try {\n    const res = await fetch(`http://${ip}/health`, { signal: AbortSignal.timeout(3000) });\n    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);\n    const data = await res.json();\n    return { ip, status: 'OK', data };\n  } catch (err) {\n    console.error(`Failed ${ip}: ${err.message}`);\n    return { ip, status: 'FAILED', error: err.message };\n  }\n}\n\n// Concurrent parallel execution across multiple nodes\nconst results = await Promise.all(['10.0.0.1', '10.0.0.2'].map(queryNode));",
            flags: [
              ["async function", "Declares an asynchronous function that always returns a Promise"],
              ["await promise", "Pauses execution until Promise resolves or rejects (valid in async functions)"],
              ["Promise.all([...])", "Executes promises concurrently; rejects immediately if any promise fails"],
              ["Promise.allSettled([...])", "Waits for all promises to finish, returning results of both success and failure"],
              ["AbortSignal.timeout(ms)", "Built-in automatic fetch timeout controller"]
            ],
            subcommands: [
              ["const add = (a, b) => a + b;", "Concise arrow function with implicit return"],
              ["throw new Error('Custom failure message');", "Instantiate and throw standard Error object with stack trace"]
            ],
            tip: "Always wrap await calls in try...catch blocks to handle network timeouts and API errors gracefully.",
            tags: ["javascript", "async", "await", "promises", "fetch", "try-catch", "concurrency"]
          }
        ]
      }
    ]
  },

  // 4. TYPESCRIPT
  {
    key: 'typescript',
    file: 'typescript.html',
    js: 'typescript.js',
    varName: 'TS_CHEAT_SHEET_DATA',
    name: 'TypeScript',
    title: 'TypeScript 5+ Reference & Types',
    subtitle: 'Primitives, interfaces, union types, type guards, generics, utility types & tsconfig',
    pill: 'TypeScript 5.x / Strict',
    prompt: 'ts',
    cursor: ':',
    sections: [
      {
        id: "ts-basics",
        badge: "types",
        title: "Types, Interfaces & Generics",
        subtitle: "Primitive types, interfaces, type aliases, union types & generic containers",
        commands: [
          {
            id: "ts-interface-type-generics",
            desc: "Declare structured interfaces, union types, and reusable generic functions",
            cmd: "interface ServerNode {\n  id: string;\n  bmcIp: string;\n  gpus: number;\n  status: 'ONLINE' | 'OFFLINE' | 'MAINTENANCE';\n  tags?: string[]; // Optional property\n}\n\n// Generic API response container\ninterface ApiResponse<T> {\n  data: T;\n  timestamp: number;\n  error?: string;\n}",
            flags: [
              ["interface vs type", "Interfaces are extendable and ideal for object schemas; types handle unions and primitives"],
              ["'ONLINE' | 'OFFLINE'", "String literal union: restricts value to strictly defined strings"],
              ["<T>", "Generic type parameter: enables writing reusable components across different data types"],
              ["prop?: type", "Optional property: allows value to be undefined"],
              ["readonly prop: string", "Prevents property from being mutated after initialization"]
            ],
            subcommands: [
              ["type ID = string | number;", "Union type: value can be either string or number"],
              ["type ReadonlyNode = Readonly<ServerNode>;", "Built-in utility type: makes all properties immutable at compile time"]
            ],
            tip: "Prefer literal union types over numeric enums for cleaner JS output and exact compile-time validation.",
            tags: ["typescript", "interface", "type", "generics", "union", "schema"]
          },
          {
            id: "ts-narrowing-guards",
            desc: "Type guards and type narrowing with typeof, instanceof, in, and custom predicates",
            cmd: "type NetworkEvent = \n  | { kind: 'link_up'; speed: number }\n  | { kind: 'link_down'; reason: string };\n\nfunction handleEvent(e: NetworkEvent) {\n  if (e.kind === 'link_up') {\n    console.log(`Port active at ${e.speed}G`); // TS knows speed exists\n  } else {\n    console.log(`Down: ${e.reason}`);        // TS knows reason exists\n  }\n}",
            flags: [
              ["Discriminated Union", "Pattern sharing a common literal property ('kind') for bulletproof type safety"],
              ["typeof x === 'string'", "Narrows primitive types (string, number, boolean, symbol)"],
              ["x instanceof Date", "Narrows class instances and built-in objects"],
              ["'bmcIp' in server", "Checks if property key exists on object to narrow type"],
              ["value is ServerNode", "Custom type predicate return type: function isServer(x: any): x is ServerNode"]
            ],
            subcommands: [
              ["const val = (input as string);", "Type assertion (override compiler type checking)"],
              ["const val = input!;", "Non-null assertion operator: asserts value is not null or undefined"]
            ],
            tip: "Discriminated unions with exhaustive switch/if checks eliminate entire classes of runtime errors.",
            tags: ["typescript", "narrowing", "typeguards", "discriminated-union", "typeof", "instanceof"]
          }
        ]
      },
      {
        id: "ts-functions-classes",
        badge: "func",
        title: "Typed Functions, Classes & Utility Types",
        subtitle: "Function signatures, access modifiers, Partial, Pick, Omit, Record & async types",
        commands: [
          {
            id: "ts-utility-types",
            desc: "Built-in utility types: Partial, Required, Pick, Omit, Record & ReturnType",
            cmd: "interface MachineConfig {\n  hostname: string;\n  ip: string;\n  cores: number;\n  rackId: string;\n}\n\n// Update config: all fields optional\ntype MachineUpdate = Partial<MachineConfig>;\n\n// Public view: omit sensitive fields\ntype PublicMachine = Omit<MachineConfig, 'ip'>;\n\n// Dictionary mapping IDs to config\ntype MachineRegistry = Record<string, MachineConfig>;",
            flags: [
              ["Partial<T>", "Constructs a type with all properties of T set to optional"],
              ["Required<T>", "Constructs a type with all properties of T set to required"],
              ["Pick<T, Keys>", "Constructs a type by picking specific keys from T ('hostname' | 'ip')"],
              ["Omit<T, Keys>", "Constructs a type by picking all properties from T and removing Keys"],
              ["Record<K, V>", "Constructs an object type whose keys are K and values are V"]
            ],
            subcommands: [
              ["type PromResult = Awaited<Promise<string>>;", "Extracts resolved type of a Promise"],
              ["type FuncReturn = ReturnType<typeof myFunction>;", "Extracts return type of a function signature"]
            ],
            tip: "Utility types prevent code duplication by deriving DTOs, updates, and subsets from a single interface.",
            tags: ["typescript", "utility-types", "partial", "pick", "omit", "record", "generics"]
          },
          {
            id: "ts-classes-tooling",
            desc: "Class parameter properties, async typing, and essential tsconfig.json options",
            cmd: "class ServerManager {\n  // Parameter property: automatically assigns to private/public fields\n  constructor(\n    public readonly hostname: string,\n    private apiKey: string,\n    protected port: number = 22\n  ) {}\n\n  async ping(): Promise<boolean> {\n    return true;\n  }\n}",
            flags: [
              ["public, private, protected", "Compile-time access control modifiers (private only accessible in class)"],
              ["readonly", "Property can only be initialized in constructor"],
              ["Promise<T>", "Explicit return type annotation for asynchronous methods"],
              ["\"strict\": true", "Essential tsconfig.json flag enabling all strict type checking options"],
              ["\"noImplicitAny\": true", "Forces explicit typing when TypeScript cannot infer type"]
            ],
            subcommands: [
              ["npx tsx script.ts", "Run TypeScript files directly without separate build step (instant execution)"],
              ["npx tsc --noEmit", "Run type checker on codebase without generating JavaScript output files"]
            ],
            tip: "Use npx tsx for writing datacenter CLI scripts in TypeScript without needing a complex build setup.",
            tags: ["typescript", "classes", "access-modifiers", "tsconfig", "tooling", "tsx"]
          }
        ]
      }
    ]
  },

  // 5. POWERSHELL
  {
    key: 'powershell',
    file: 'powershell.html',
    js: 'powershell.js',
    varName: 'POWERSHELL_CHEAT_SHEET_DATA',
    name: 'PowerShell',
    title: 'PowerShell 7 / Windows & Linux Scripting',
    subtitle: 'Variables, typed objects, pipelines, conditionals, loops, functions, PSCustomObject & error handling',
    pill: 'PowerShell 7.x / pwsh',
    prompt: 'PS',
    cursor: '>',
    sections: [
      {
        id: "pwsh-vars-objects",
        badge: "objects",
        title: "Variables, Objects & Pipelines",
        subtitle: "Variable assignment, strong types, hashtables, arrays & pipeline object flow",
        commands: [
          {
            id: "pwsh-var-hashtable",
            desc: "Variable declarations, typed variables, hashtables, and pipeline transformations",
            cmd: "# Strongly-typed variable and hashtable (dictionary)\n[string]$Server = \"node-01\"\n[int]$Port = 8080\n$Config = @{ Host = $Server; Port = $Port; Active = $true }\n\n# Pipeline: Filter, select properties, and export to CSV\nGet-Service | Where-Object Status -eq 'Running' |\n  Select-Object Name, DisplayName, StartType |\n  Export-Csv -Path \"./services.csv\" -NoTypeInformation",
            flags: [
              ["$var = value", "Variables always start with $ sign; case-insensitive by default"],
              ["[type]$var", "Type casting: [int], [string], [bool], [datetime], [ipaddress]"],
              ["@(...) vs @{...}", "@() creates an indexed array; @{} creates a hashtable (dictionary)"],
              ["| (Pipeline)", "Passes full live objects (methods & properties) instead of plain text streams"],
              ["Where-Object (?)", "Filters pipeline objects by property conditions ($_.Property)"],
              ["Select-Object", "Picks, renames, or calculates specific object properties"],
              ["ForEach-Object (%)", "Executes script block for each item passing through pipeline"]
            ],
            subcommands: [
              ["$obj = [PSCustomObject]@{ Id = 'srv-01'; IP = '10.0.0.1' }", "Create custom structured object with properties"],
              ["$var | Get-Member (gm)", "Inspect all properties, methods, and types available on object"]
            ],
            tip: "In PowerShell, pipelines pass rich typed .NET objects, not raw strings. Use $_ to access current object.",
            tags: ["powershell", "variables", "pipeline", "hashtable", "objects", "csv"]
          }
        ]
      },
      {
        id: "pwsh-control",
        badge: "control",
        title: "Conditionals, Loops & Functions",
        subtitle: "Comparison operators (-eq, -ne, -gt), foreach loops, cmdlet functions & try/catch",
        commands: [
          {
            id: "pwsh-conditionals-loops",
            desc: "Comparison operators (-eq, -ne, -gt), foreach loops, and pipeline iteration",
            cmd: "$Nodes = @('node-01', 'node-02', 'node-03')\n\n# foreach loop\nforeach ($Node in $Nodes) {\n  if ($Node -match '^node-(01|02)$') {\n    Write-Host \"[PRIMARY] Connecting to $Node\" -ForegroundColor Green\n  } else {\n    Write-Warning \"[STANDBY] Node $Node in standby\"\n  }\n}",
            flags: [
              ["-eq, -ne, -gt, -lt, -ge, -le", "Comparison operators (never use == or > in PowerShell)"],
              ["-match / -notmatch", "Regex match comparison against string"],
              ["-like / -notlike", "Wildcard match comparison (*, ?)"],
              ["-contains / -in", "Collection membership: $list -contains 'x' or 'x' -in $list"],
              ["Write-Host vs Write-Output", "Write-Output sends to pipeline; Write-Host writes to console screen only"]
            ],
            subcommands: [
              ["switch -Regex ($node) { '^srv' { 'Server' } '^sw' { 'Switch' } default { 'Unknown' } }", "Regex pattern-matching switch statement"],
              ["1..5 | ForEach-Object { \"Step $_\" }", "Range operator and pipeline loop"]
            ],
            tip: "Use -match for regex and -like for simple globbing (*.log). Use -eq for exact string and numeric equality.",
            tags: ["powershell", "if", "comparison", "foreach", "switch", "loops", "regex"]
          },
          {
            id: "pwsh-functions-error-handling",
            desc: "Cmdlet functions with param blocks and enterprise try/catch/finally error handling",
            cmd: "function Test-NodeConnection {\n  [CmdletBinding()]\n  param(\n    [Parameter(Mandatory = $true, ValueFromPipeline = $true)]\n    [string]$ComputerName,\n    [int]$TimeoutSeconds = 5\n  )\n  process {\n    $ErrorActionPreference = 'Stop'\n    try {\n      $res = Test-Connection -TargetName $ComputerName -Count 1 -TimeoutSeconds $TimeoutSeconds\n      [PSCustomObject]@{ Computer = $ComputerName; Status = 'ONLINE'; Latency = $res.Latency }\n    } catch {\n      Write-Error \"Failed to reach $ComputerName: $_\"\n      [PSCustomObject]@{ Computer = $ComputerName; Status = 'OFFLINE'; Latency = $null }\n    }\n  }\n}",
            flags: [
              ["[CmdletBinding()]", "Enables advanced cmdlet features (-Verbose, -Debug, -ErrorAction)"],
              ["param(...)", "Declares strongly typed function parameters and validation attributes"],
              ["ValueFromPipeline = $true", "Allows function to accept input piped directly from other cmdlets"],
              ["try / catch / finally", "Standard error handling block; catches terminating exceptions"],
              ["$ErrorActionPreference = 'Stop'", "Promotes all non-terminating errors into catchable exceptions"],
              ["$_ (inside catch)", "Contains current error record and exception message"]
            ],
            subcommands: [
              ["Get-Content \"data.json\" | ConvertFrom-Json", "Parse JSON file into structured PowerShell object"],
              ["$obj | ConvertTo-Json -Depth 5 | Out-File \"out.json\"", "Serialize object to formatted JSON file"]
            ],
            tip: "Set $ErrorActionPreference = 'Stop' at the top of functions so try/catch reliably intercepts every failure.",
            tags: ["powershell", "functions", "param", "cmdlet", "try-catch", "json", "exceptions"]
          }
        ]
      }
    ]
  },

  // 6. JSON & JQ
  {
    key: 'json',
    file: 'json.html',
    js: 'json.js',
    varName: 'JSON_CHEAT_SHEET_DATA',
    name: 'JSON & jq',
    title: 'JSON Syntax & jq Query Reference',
    subtitle: 'JSON data types, quoting rules, validation, jq filters, slicing, formatting & transformations',
    pill: 'RFC 8259 / jq 1.7',
    prompt: 'jq',
    cursor: '.',
    sections: [
      {
        id: "json-basics",
        badge: "json",
        title: "JSON Rules, Syntax & Types",
        subtitle: "Valid JSON syntax structure, data types, and common syntax errors to avoid",
        commands: [
          {
            id: "json-syntax-rules",
            desc: "Valid JSON syntax structure, data types, and common syntax errors to avoid",
            cmd: "{\n  \"hostname\": \"gpu-node-01\",\n  \"rack_unit\": 42,\n  \"fans_healthy\": true,\n  \"ambient_temp\": 24.5,\n  \"firmware\": null,\n  \"gpus\": [\"gpu0\", \"gpu1\", \"gpu2\", \"gpu3\"],\n  \"network\": {\n    \"bmc_ip\": \"10.0.0.50\",\n    \"mac\": \"00:1A:2B:3C:4D:5E\"\n  }\n}",
            flags: [
              ["Double quotes only", "Keys and strings MUST use \"double quotes\"; 'single quotes' are illegal"],
              ["No trailing commas", "Trailing commas after last element in objects/arrays throw parse errors"],
              ["Allowed types", "String, Number, Boolean (true/false), Null (null), Object, Array"],
              ["Numbers", "No leading zeros (042 is invalid); no NaN or Infinity"],
              ["Unicode support", "UTF-8 encoded by default; escape special chars with \\n, \\t, \\\", \\\\"]
            ],
            subcommands: [
              ["python3 -m json.tool < input.json", "Validate and pretty-print JSON using Python standard library"],
              ["jq empty input.json", "Validates JSON syntax; exits 0 if valid, non-zero with error line number if invalid"]
            ],
            tip: "Never put comments in standard JSON. If you need comments in configuration, use YAML or TOML.",
            tags: ["json", "syntax", "types", "validation", "quotes", "schema"]
          }
        ]
      },
      {
        id: "jq-filters",
        badge: "jq",
        title: "jq Querying, Filtering & Slicing",
        subtitle: "Essential jq recipes for querying APIs, filtering arrays, and extracting CSV",
        commands: [
          {
            id: "jq-essential-recipes",
            desc: "Essential jq recipes for querying APIs, filtering arrays, and extracting CSV",
            cmd: "# Pretty print & drill down nested field\ncurl -s https://api.nodes/status | jq '.nodes[0].network.bmc_ip'\n\n# Filter array where GPU temp > 80\ncat metrics.json | jq '.[] | select(.temp > 80) | {id: .id, temp: .temp}'\n\n# Convert JSON array to clean CSV\ncat inventory.json | jq -r '.[] | [.name, .ip, .status] | @csv'",
            flags: [
              [".field", "Drill down into object property (.network.ip)"],
              [".[]", "Unpack/iterate array elements into stream"],
              ["select(condition)", "Filter elements matching boolean condition (select(.count > 10))"],
              ["{new_k: .old_k}", "Reconstruct new object shape with selected keys"],
              ["-r (Raw output)", "Outputs unquoted raw string values (essential for bash scripts)"],
              ["-c (Compact output)", "Outputs each JSON record on a single compact line (JSONL)"],
              ["@csv / @tsv", "Formats array of values into escaped CSV or TSV line"]
            ],
            subcommands: [
              ["jq 'map(.temp) | add / length'", "Compute arithmetic average across array of numbers"],
              ["jq 'sort_by(.load) | reverse'", "Sort JSON array by specific object property descending"],
              ["jq 'keys'", "Return array of all property keys in object"]
            ],
            tip: "Combine jq -r with bash loops: while IFS=',' read -r host ip; do ... done < <(jq -r '...' data.json).",
            tags: ["jq", "filter", "select", "csv", "json", "transform", "api"]
          }
        ]
      }
    ]
  },

  // 7. YAML & YQ
  {
    key: 'yaml',
    file: 'yaml.html',
    js: 'yaml.js',
    varName: 'YAML_CHEAT_SHEET_DATA',
    name: 'YAML & yq',
    title: 'YAML 1.2 Syntax & yq CLI Reference',
    subtitle: 'Indentation, scalars, multi-line blocks (| vs >), anchors, aliases, and yq query/mutations',
    pill: 'YAML 1.2 / yq v4',
    prompt: 'yq',
    cursor: '.',
    sections: [
      {
        id: "yaml-syntax-anchors",
        badge: "yaml",
        title: "YAML Syntax, Scalars & Anchors",
        subtitle: "Multi-line string styles, indentation rules, anchors (&) and aliases (*) for DRY config",
        commands: [
          {
            id: "yaml-syntax-rules",
            desc: "Multi-line string styles: Literal (| preserves newlines) vs Folded (> replaces with spaces)",
            cmd: "# Base template anchor\ndefault_settings: &base_cfg\n  timeout: 30\n  retries: 3\n  logging: verbose\n\n# Inherit from anchor using merge key (<<)\nproduction_node:\n  <<: *base_cfg\n  hostname: prod-gpu-01\n  motd: |\n    === AUTHORIZED ACCESS ONLY ===\n    All connections are logged and monitored.\n  description: >\n    This is a long description that wraps across\n    multiple lines but becomes a single space-separated string.",
            flags: [
              ["Indentation with spaces", "Never use tabs in YAML; standard indentation is 2 spaces"],
              ["| (Literal block)", "Preserves all newlines and formatting exactly as typed"],
              ["> (Folded block)", "Replaces newlines within a paragraph with spaces (wraps text)"],
              ["&name (Anchor)", "Defines a reusable anchor referencing a node or dictionary"],
              ["*name (Alias)", "References and pastes the anchor contents"],
              ["<<: *name (Merge key)", "Merges all properties from anchor into current mapping"]
            ],
            subcommands: [
              ["bool_val: true # True, false, yes, no", "Booleans in YAML (prefer lowercase true/false)"],
              ["list: [1, 2, 3] # or - 1 \\n - 2", "Inline flow list vs standard indented list"]
            ],
            tip: "Quote strings like \"yes\", \"no\", \"true\", \"false\" if they are meant to be string values, not booleans.",
            tags: ["yaml", "syntax", "anchors", "aliases", "merge", "multiline", "strings"]
          },
          {
            id: "yq-cli-operations",
            desc: "Query, mutate, and convert YAML files directly in the terminal using yq (v4)",
            cmd: "# Read property value\nyq '.production_node.hostname' config.yaml\n\n# Modify property in-place\nyq -i '.production_node.timeout = 60' config.yaml\n\n# Convert YAML to JSON (or JSON to YAML)\nyq -o=json config.yaml > config.json\nyq -p=json -o=yaml data.json > data.yaml",
            flags: [
              ["-i (In-place)", "Modifies the target YAML file in-place without temporary files"],
              ["-o=json / -o=yaml", "Specifies output format (json, yaml, props, csv, xml)"],
              ["-p=json / -p=yaml", "Specifies input parser format"],
              [".field = \"new_val\"", "Assignment operator for updating properties"]
            ],
            subcommands: [
              ["yq '.. | select(has(\"timeout\"))' config.yaml", "Recursively search all objects containing a specific key"],
              ["yq eval-all 'select(fileIndex == 0) * select(fileIndex == 1)' f1.yaml f2.yaml", "Deep-merge two YAML files together"]
            ],
            tip: "yq preserves comments and whitespace when modifying YAML files in-place with -i.",
            tags: ["yq", "yaml", "cli", "json", "mutate", "convert", "inplace"]
          }
        ]
      }
    ]
  },

  // 8. TOML
  {
    key: 'toml',
    file: 'toml.html',
    js: 'toml.js',
    varName: 'TOML_CHEAT_SHEET_DATA',
    name: 'TOML',
    title: 'TOML Reference (v1.0.0)',
    subtitle: 'Tables [table], sub-tables, array of tables [[items]], key-value pairs, dates & Python parsing',
    pill: 'TOML v1.0.0 / tomllib',
    prompt: 'toml',
    cursor: '=',
    sections: [
      {
        id: "toml-syntax",
        badge: "toml",
        title: "Tables, Arrays & Scalar Types",
        subtitle: "Standard TOML syntax: tables, array of tables [[...]], datetimes & python tomllib",
        commands: [
          {
            id: "toml-tables-arrays",
            desc: "Standard TOML syntax: tables, array of tables [[...]], and Python tomllib parsing",
            cmd: "[server]\nhost = \"10.0.0.1\"\nports = [ 8000, 8080, 9000 ]\nmax_conns = 5_000\ntimeout_seconds = 45.5\nenabled = true\ncreated_at = 2026-10-31T12:00:00Z\n\n# Array of Tables (Repeated records)\n[[nodes]]\nname = \"gpu-01\"\nmodel = \"H100\"\n\n[[nodes]]\nname = \"gpu-02\"\nmodel = \"H200\"",
            flags: [
              ["[table_name]", "Defines a key-value dictionary table group"],
              ["[[array_of_tables]]", "Defines a list of dictionaries (each [[...]] appends a new element)"],
              ["\"\"\"multiline string\"\"\"", "Multi-line basic string: escapes enabled, preserves newlines"],
              ["'''literal string'''", "Multi-line literal string: no escapes, exact characters preserved"],
              ["5_000", "Underscores permitted in numbers for readable digit grouping"],
              ["RFC 3339 Timestamps", "Native datetime support: 1979-05-27T07:32:00Z"]
            ],
            subcommands: [
              ["import tomllib; data = tomllib.loads(toml_str)", "Parse TOML natively in Python 3.11+ without third-party packages"],
              ["taplo fmt file.toml", "Format and lint TOML files with Taplo CLI"]
            ],
            tip: "Use TOML for configuration files (pyproject.toml, Cargo.toml) where clean, non-indented syntax is preferred.",
            tags: ["toml", "tables", "arrays", "config", "tomllib", "syntax"]
          }
        ]
      }
    ]
  },

  // 9. REGEX
  {
    key: 'regex',
    file: 'regex.html',
    js: 'regex.js',
    varName: 'REGEX_CHEAT_SHEET_DATA',
    name: 'Regex',
    title: 'Regular Expressions (PCRE / Modern RegExp)',
    subtitle: 'Tokens, character classes, quantifiers, lookahead/lookbehind, capture groups & datacenter recipes',
    pill: 'PCRE2 / ECMAScript',
    prompt: '/.*',
    cursor: '/g',
    sections: [
      {
        id: "regex-syntax",
        badge: "syntax",
        title: "Tokens, Quantifiers & Groups",
        subtitle: "Character classes, greedy vs lazy quantifiers, named groups & lookaround assertions",
        commands: [
          {
            id: "regex-tokens-quantifiers",
            desc: "Core regex tokens, character shorthands, quantifiers, and capturing groups",
            cmd: "# Matches IPv4: 4 groups of 1-3 digits\n^([0-9]{1,3}\\.){3}[0-9]{1,3}$\n\n# Named capture groups (Python / JS / PCRE)\n(?<interface>[a-z0-9]+):\\s+(?<rx_bytes>\\d+)\\s+(?<tx_bytes>\\d+)",
            flags: [
              ["^ and $", "^ asserts start of line; $ asserts end of line"],
              ["\\d, \\w, \\s", "\\d is digit [0-9]; \\w is word [a-zA-Z0-9_]; \\s is whitespace"],
              ["\\D, \\W, \\S", "Negated shorthands: non-digit, non-word, non-whitespace"],
              ["* vs + vs ?", "* is 0 or more; + is 1 or more; ? is 0 or 1 optional"],
              ["{min,max}", "Explicit quantifier bounds: {3} exactly 3, {2,5} between 2 and 5"],
              ["*? or +? (Lazy)", "Lazy matching: matches as few characters as possible"],
              ["(?:...)", "Non-capturing group: groups tokens without consuming group index"],
              ["(?<name>...)", "Named capture group for readable structured extraction"]
            ],
            subcommands: [
              ["(?i)", "Inline modifier flag enabling case-insensitive matching"],
              ["\\b", "Word boundary assertion: \\bword\\b prevents partial matches"]
            ],
            tip: "Always test regex patterns with sample edge cases on regex101.com before deploying to production.",
            tags: ["regex", "tokens", "quantifiers", "groups", "capture", "anchors"]
          },
          {
            id: "regex-lookarounds",
            desc: "Zero-width lookaround assertions: positive/negative lookahead & lookbehind",
            cmd: "# Positive lookahead: match 'node' only if followed by digits\nnode(?=\\d{2,3})\n\n# Negative lookahead: match 'error' NOT followed by 'timeout'\nerror(?!\\s+timeout)\n\n# Positive lookbehind: extract IP address after 'host='\n(?<=host=)[0-9.]+",
            flags: [
              ["(?=...)", "Positive Lookahead: asserts condition follows match without consuming text"],
              ["(?!...)", "Negative Lookahead: asserts condition does NOT follow match"],
              ["(?<=...)", "Positive Lookbehind: asserts condition precedes match without consuming text"],
              ["(?<!...)", "Negative Lookbehind: asserts condition does NOT precede match"]
            ],
            subcommands: [
              ["\\d+(?=px)", "Matches number in '100px' without including 'px' in match result"]
            ],
            tip: "Lookarounds are zero-width: they test text ahead or behind without including it in the matched capture.",
            tags: ["regex", "lookahead", "lookbehind", "lookaround", "assertions"]
          }
        ]
      },
      {
        id: "regex-recipes",
        badge: "recipes",
        title: "Datacenter & Production Pattern Recipes",
        subtitle: "Copy-pasteable regex recipes for common datacenter identifiers and network strings",
        commands: [
          {
            id: "regex-dc-patterns",
            desc: "Copy-pasteable regex recipes for common datacenter identifiers and network strings",
            cmd: "# MAC Address (colon or hyphen separated)\n^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$\n\n# PCIe BDF Address (e.g. 0000:04:00.0)\n^[0-9a-fA-F]{4}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}\\.[0-7]$\n\n# UUID / GUID (RFC 4122)\n^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$",
            flags: [
              ["MAC Regex", "Validates 6 pairs of hex digits separated by : or -"],
              ["PCIe BDF", "Validates Domain(4hex):Bus(2hex):Device(2hex).Function(0-7)"],
              ["UUID v4", "Matches standard 36-character hyphenated UUID tokens"],
              ["IPv4 with Port", "(?:[0-9]{1,3}\\.){3}[0-9]{1,3}:[0-9]{1,5}"]
            ],
            subcommands: [
              ["grep -P '^[0-9a-f]{4}:[0-9a-f]{2}:[0-9a-f]{2}\\.[0-7]' lspci.txt", "Filter lspci output by PCIe address using ripgrep or grep -P"]
            ],
            tip: "Use grep -P (Perl-compatible) or rg (ripgrep) when using these regex recipes in Linux terminals.",
            tags: ["regex", "recipes", "mac", "pcie", "uuid", "ipv4", "datacenter"]
          }
        ]
      }
    ]
  },

  // 10. AWK & SED
  {
    key: 'awk-sed',
    file: 'awk-sed.html',
    js: 'awk-sed.js',
    varName: 'AWK_SED_CHEAT_SHEET_DATA',
    name: 'AWK & Sed',
    title: 'AWK & Sed Stream Processing',
    subtitle: 'Field extraction, column math, BEGIN/END blocks, pattern filtering, and in-place stream editing',
    pill: 'POSIX AWK / GNU Sed',
    prompt: "awk '",
    cursor: "'",
    sections: [
      {
        id: "awk-patterns",
        badge: "awk",
        title: "AWK Field Parsing & Column Math",
        subtitle: "Field extraction ($1, $NF), custom delimiters, condition filtering & column totals",
        commands: [
          {
            id: "awk-essentials",
            desc: "Field extraction, delimiter splitting, condition filtering and summary calculations",
            cmd: "# Print columns 1 and 3 from space-delimited text\nps aux | awk '{print $1, $3, $11}'\n\n# Sum column 5 across all rows and print total in END block\nls -l | awk '{sum += $5} END {print \"Total bytes:\", sum}'\n\n# Filter rows where 3rd column is greater than threshold\nawk -F',' '$3 > 80 {print $1, \"High Temp:\", $3}' temps.csv",
            flags: [
              ["$1, $2 ... $NF", "Positional column fields; $0 is entire line; $NF is the last column"],
              ["-F',' (Field Separator)", "Specifies custom field delimiter (comma, colon, tab)"],
              ["NR", "Current record/line number (NR > 1 skips CSV header)"],
              ["NF", "Number of fields on the current record"],
              ["BEGIN { ... }", "Block executed ONCE before any lines are read"],
              ["END { ... }", "Block executed ONCE after all lines have been processed"],
              ["pattern { action }", "Executes action block only on lines matching pattern"]
            ],
            subcommands: [
              ["awk '!seen[$0]++' file.txt", "Remove duplicate lines while preserving original line order"],
              ["awk '{printf \"%-15s %5d\\n\", $1, $2}'", "Format output into fixed-width aligned columns"]
            ],
            tip: "AWK automatically splits on any whitespace sequence by default; specify -F for CSV or /etc/passwd.",
            tags: ["awk", "columns", "math", "sum", "filter", "delimiter", "csv"]
          }
        ]
      },
      {
        id: "sed-substitutions",
        badge: "sed",
        title: "Sed Stream Editor & In-Place Editing",
        subtitle: "Pattern substitution, in-place file editing, deleting comment lines & address ranges",
        commands: [
          {
            id: "sed-recipes",
            desc: "Substitute patterns, modify files in-place, delete comment lines & match address ranges",
            cmd: "# Global replace in file in-place with backup\nsed -i.bak 's/PORT=8080/PORT=9000/g' /etc/server.conf\n\n# Delete all empty lines and comments\nsed -E '/^\\s*(#|$)/d' /etc/nginx/nginx.conf\n\n# Print lines between two patterns (address range)\nsed -n '/BEGIN CERTIFICATE/,/END CERTIFICATE/p' fullchain.pem",
            flags: [
              ["s/find/replace/g", "Substitute find with replace; 'g' flag replaces all occurrences on line"],
              ["-i[suffix]", "Edit file in-place; optional suffix creates backup file (e.g. -i.bak)"],
              ["-E or -r", "Enables Extended Regular Expressions (ERE: +, ?, |, ()) without backslashes"],
              ["-n", "Quiet mode: suppresses automatic printing of lines; only prints with 'p' command"],
              ["/pattern/d", "Delete matching lines from output stream"],
              ["1,10d", "Delete lines 1 through 10 from output stream"]
            ],
            subcommands: [
              ["sed 's|^http://|https://|' urls.txt", "Use alternate delimiter (| or #) when replacement strings contain slashes"],
              ["sed -i 's/[ \\t]*$//' file.txt", "Strip trailing whitespace from ends of lines"]
            ],
            tip: "On macOS (BSD sed), -i requires an argument: sed -i '' 's/.../.../g' file. On Linux (GNU sed), sed -i '...' file works.",
            tags: ["sed", "substitute", "regex", "inplace", "delete", "cleanup", "streams"]
          }
        ]
      }
    ]
  },

  // 11. SQL & SQLITE
  {
    key: 'sql',
    file: 'sql.html',
    js: 'sql.js',
    varName: 'SQL_CHEAT_SHEET_DATA',
    name: 'SQL & SQLite',
    title: 'SQL & SQLite CLI Reference',
    subtitle: 'SELECT queries, filtering, joins, GROUP BY, aggregations, DDL, transactions & SQLite CLI',
    pill: 'ANSI SQL / SQLite 3.45',
    prompt: 'sqlite>',
    cursor: ';',
    sections: [
      {
        id: "sql-queries-joins",
        badge: "sql",
        title: "Queries, Joins & Aggregations",
        subtitle: "Structured SELECT queries with filtering, table joins, aggregations & group by",
        commands: [
          {
            id: "sql-select-joins",
            desc: "Structured SELECT queries with filtering, table joins, and group by aggregations",
            cmd: "-- Query nodes with high GPU temperature and join rack info\nSELECT \n  n.hostname,\n  n.ip_address,\n  r.name AS rack_name,\n  COUNT(g.id) AS gpu_count,\n  AVG(g.temp_c) AS avg_temp\nFROM nodes n\nINNER JOIN racks r ON n.rack_id = r.id\nLEFT JOIN gpus g ON n.id = g.node_id\nWHERE n.status = 'ACTIVE'\nGROUP BY n.id\nHAVING avg_temp > 75.0\nORDER BY avg_temp DESC\nLIMIT 20;",
            flags: [
              ["INNER JOIN", "Returns records that have matching values in both tables"],
              ["LEFT JOIN", "Returns all records from left table and matched records from right table"],
              ["WHERE vs HAVING", "WHERE filters rows before aggregation; HAVING filters aggregated groups"],
              ["COUNT(), AVG(), SUM()", "Standard SQL aggregate math functions"],
              ["ORDER BY col DESC", "Sorts results descending (ASC for ascending)"],
              ["LIMIT N OFFSET M", "Paginates results: returns N rows skipping M"]
            ],
            subcommands: [
              ["INSERT INTO nodes (hostname, ip) VALUES ('gpu-05', '10.0.0.15');", "Insert a new row into table"],
              ["UPDATE nodes SET status = 'MAINT' WHERE id = 42;", "Update matching rows"],
              ["BEGIN TRANSACTION; ... COMMIT;", "Atomic transaction block (rolls back on failure with ROLLBACK)"]
            ],
            tip: "Always create indexes on columns used in foreign keys and WHERE/JOIN clauses (CREATE INDEX idx_... ON ...).",
            tags: ["sql", "select", "join", "group-by", "aggregations", "having", "database"]
          }
        ]
      },
      {
        id: "sqlite-cli",
        badge: "sqlite",
        title: "SQLite CLI Superpowers & CSV/JSON",
        subtitle: "Run SQL directly on CSV files in-memory without installing database servers",
        commands: [
          {
            id: "sqlite-in-memory-csv",
            desc: "Run SQL directly on CSV files in-memory without installing database servers",
            cmd: "# Open SQLite in-memory, import CSV directly, and execute SQL query\nsqlite3 :memory: \\\n  -cmd \".mode csv\" \\\n  -cmd \".import server_metrics.csv metrics\" \\\n  -cmd \".mode column\" \\\n  -cmd \".headers on\" \\\n  \"SELECT hostname, MAX(cpu_load) FROM metrics GROUP BY hostname;\"",
            flags: [
              [":memory:", "Opens a volatile, blisteringly fast in-memory database with zero disk writes"],
              [".mode column / .mode markdown", "Formats terminal query output into aligned tables or markdown"],
              [".headers on", "Displays table column headers at top of output"],
              [".import file.csv tablename", "Imports CSV/TSV file directly into a new SQLite table"],
              [".tables / .schema", "Lists all tables (.tables) or displays DDL schema (.schema table)"],
              [".dump", "Exports entire database structure and data as plain SQL statements"]
            ],
            subcommands: [
              ["sqlite3 db.sqlite \".schema --indent\"", "Print clean indented DDL table schemas"],
              ["SELECT json_extract(metadata, '$.firmware.bios') FROM inventory;", "Extract nested JSON attributes from database columns"]
            ],
            tip: "sqlite3 :memory: gives you the full power of SQL on any CSV file instantly without setting up PostgreSQL or MySQL.",
            tags: ["sqlite", "csv", "json", "cli", "memory", "schema", "database"]
          }
        ]
      }
    ]
  }
];

console.log('Generating 11 individual scripting cheat sheet files with complete learner foundations...');

// Dropdown snippet with All-in-One Hub + 11 individual languages
const SCRIPTING_DROPDOWN_HTML = `
              <div class="nav-dropdown" id="scripting-nav-dropdown">
                <a href="scripting.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 4l-4 16" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/></svg>
                  <span>Scripting</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu" role="menu">
                  <a href="scripting.html" class="dropdown-item" role="menuitem">📑 All-in-One Hub</a>
                  <div class="dropdown-divider"></div>
                  <a href="bash.html" class="dropdown-item" role="menuitem">🐚 Bash &amp; Shell</a>
                  <a href="python.html" class="dropdown-item" role="menuitem">🐍 Python</a>
                  <a href="javascript.html" class="dropdown-item" role="menuitem">⚡ JavaScript</a>
                  <a href="typescript.html" class="dropdown-item" role="menuitem">🔷 TypeScript</a>
                  <a href="powershell.html" class="dropdown-item" role="menuitem">💻 PowerShell</a>
                  <a href="lua.html" class="dropdown-item" role="menuitem">🌙 Lua</a>
                  <div class="dropdown-divider"></div>
                  <a href="git.html" class="dropdown-item" role="menuitem">🌿 Git</a>
                  <div class="dropdown-divider"></div>
                  <a href="json.html" class="dropdown-item" role="menuitem">📋 JSON &amp; jq</a>
                  <a href="yaml.html" class="dropdown-item" role="menuitem">📄 YAML &amp; yq</a>
                  <a href="toml.html" class="dropdown-item" role="menuitem">⚙️ TOML</a>
                  <div class="dropdown-divider"></div>
                  <a href="regex.html" class="dropdown-item" role="menuitem">🔤 Regex</a>
                  <a href="awk-sed.html" class="dropdown-item" role="menuitem">✂️ AWK &amp; Sed</a>
                  <a href="sql.html" class="dropdown-item" role="menuitem">🗄️ SQL &amp; SQLite</a>
                </div>
              </div>`;

// Template for rendering a sheet JS file matching the standard suite formatting
function generateJsFile(lang) {
  return `const ${lang.varName} = ${JSON.stringify(lang.sections, null, 2)};

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("${lang.key}_cs_bookmarks") || "[]"))
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
    /(^|\\s|;|&&|\\|\\||\\|)(sudo\\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\\|\\||&&|\\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return \`<span class="tok-str">\${strLiteral}</span>\`;
      if (flagPart) return \`<span class="tok-flag">\${flagPart}</span>\`;
      if (operatorPart) return \`<span class="tok-pipe">\${operatorPart}</span>\`;
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? \`<span class="tok-pipe">\${sudoPart}</span>\` : "";
        return \`\${prefix}\${sudoHtml}<span class="tok-cmd">\${cmdName}</span>\`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = ${lang.varName}.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    \`<option value="all" \${state.activeCategory === "all" ? "selected" : ""}>All Sections (\${totalCommands} recipes)</option>\`
  ];

  for (const section of ${lang.varName}) {
    const isSelected = state.activeCategory === section.id ? "selected" : "";
    optionsHtml.push(
      \`<option value="\${section.id}" \${isSelected}>\${escapeHtml(section.title)} (\${section.commands.length})</option>\`
    );
  }

  const resetBtnHtml =
    state.activeCategory !== "all"
      ? \`<button type="button" class="cat-reset-btn" data-cat="all" title="Show all sections">✕ Show All</button>\`
      : "";

  categoryTabsEl.innerHTML = \`
    <div class="cat-dropdown-wrap">
      <label class="cat-dropdown-label" for="category-select">Section:</label>
      <select id="category-select" class="cat-select" aria-label="Filter by \${escapeHtml('${lang.name}')} section">
        \${optionsHtml.join("")}
      </select>
      \${resetBtnHtml}
    </div>
  \`;

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
  const terms = query.toLowerCase().split(/\\s+/).filter(Boolean);
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

  for (const section of ${lang.varName}) {
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
        const tipHtml = item.tip ? \`<span class="tip-badge">\${escapeHtml(item.tip)}</span>\` : "";
        const detailsHtml = item.details ? \`<p class="cmd-details">\${escapeHtml(item.details)}</p>\` : "";

        const flagsHtml =
          item.flags && item.flags.length
            ? \`<div class="flag-pills">
                \${item.flags
                  .map(
                    ([flag, exp]) =>
                      \`<span class="flag-pill"><code>\${escapeHtml(flag)}</code> <span>\${escapeHtml(exp)}</span></span>\`
                  )
                  .join("")}
              </div>\`
            : "";

        const subcommandsHtml =
          item.subcommands && item.subcommands.length
            ? \`<div class="subcmd-list">
                <span class="subcmd-header">Subcommands, Variations &amp; Snippets</span>
                \${item.subcommands
                  .map(
                    ([subcmd, exp]) =>
                      \`<div class="subcmd-row" data-copy="\${escapeHtml(subcmd)}" title="Click to copy snippet">
                        <code>\${escapeHtml(subcmd)}</code>
                        <span>\${escapeHtml(exp)}</span>
                      </div>\`
                  )
                  .join("")}
              </div>\`
            : "";

        return \`
          <div class="cmd-item" id="\${item.id}" data-id="\${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                <span>\${escapeHtml(item.desc)}</span>
                \${tipHtml}
              </div>
              <div class="cmd-actions">
                <button
                  type="button"
                  class="icon-btn bookmark-btn \${isSaved ? "bookmarked" : ""}"
                  data-bookmark-id="\${item.id}"
                  title="\${isSaved ? "Remove bookmark" : "Bookmark snippet"}"
                  aria-label="Bookmark snippet"
                >
                  \${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="\${escapeHtml(item.cmd)}" title="Click to copy snippet">
              <code class="cmd-code">\${highlightCommand(item.cmd)}</code>
              <span class="copy-hint">Copy</span>
            </div>

            \${detailsHtml}
            \${flagsHtml}
            \${subcommandsHtml}
          </div>
        \`;
      })
      .join("");

    cardsHtml.push(\`
      <article class="section-card" id="sec-\${section.id}">
        <header class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">\${escapeHtml(section.badge)}</span>
            <div>
              <h2 class="section-title">\${escapeHtml(section.title)}</h2>
              <p class="section-subtitle">\${escapeHtml(section.subtitle)}</p>
            </div>
          </div>
          <span class="count-badge">\${filteredCommands.length}</span>
        </header>
        <div class="command-list">
          \${itemsHtml}
        </div>
      </article>
    \`);
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
      localStorage.setItem("${lang.key}_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
`;
}

// Template for rendering a sheet HTML file matching the standard suite formatting
function generateHtmlFile(lang) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${lang.title} — Reference &amp; Cheat Sheet</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="top-bar">
    <div class="container top-bar-inner">
      <div class="brand">
        <div class="terminal-badge" aria-hidden="true">
          <span class="prompt-symbol">${lang.prompt}</span><span class="cursor-block">${lang.cursor}</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${lang.title}</h1>
            <span class="version-pill">${lang.pill}</span>
            <nav class="sheet-switcher" aria-label="Switch cheat sheet">
              <a href="index.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M12 2C8.8 2 7.2 4.3 7.2 7.2c0 1.4-.4 2.4-1.3 3.7-1.1 1.6-1.9 3.6-1.4 5.2.3.9 1.1 1.2 1.8.8.4 1.8 2.4 3.6 5.7 3.6s5.3-1.8 5.7-3.6c.7.4 1.5.1 1.8-.8.5-1.6-.3-3.6-1.4-5.2-.9-1.3-1.3-2.3-1.3-3.7C16.8 4.3 15.2 2 12 2z" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2"/><ellipse cx="12" cy="14.5" rx="4.1" ry="5" fill="#f8fafc"/><circle cx="10.2" cy="6.5" r="1.4" fill="#fff"/><circle cx="13.8" cy="6.5" r="1.4" fill="#fff"/><circle cx="10.5" cy="6.6" r="0.7" fill="#0f172a"/><circle cx="13.5" cy="6.6" r="0.7" fill="#0f172a"/><path d="M9.6 8.3c1.3-.5 3.5-.5 4.8 0L12 10.6 9.6 8.3z" fill="#f59e0b"/><ellipse cx="8.5" cy="20.5" rx="2.6" ry="1.3" fill="#f59e0b"/><ellipse cx="15.5" cy="20.5" rx="2.6" ry="1.3" fill="#f59e0b"/></svg> Linux</a>
              <a href="cli-tools.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2" y="3" width="20" height="18" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 9l3.5 3-3.5 3" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 15h5" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></svg> CLI Tools</a>
              ${SCRIPTING_DROPDOWN_HTML}
              <a href="neovim.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true"><path d="M2.5 5.2L7.3.5v23l-4.8-4.7V5.2z" fill="#16b0ed"/><path d="M16.7.5l4.8 4.7v13.6l-4.8 4.7V.5z" fill="#57a143"/><path d="M7.3.5l12 18.2-2.6 4.8L4.7 5.3 7.3.5z" fill="#7db643"/></svg> Neovim</a>
              <a href="macos.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg> macOS</a>
              <a href="windows.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="13" height="13" fill="#00a4ef" aria-hidden="true"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg> Windows</a>
              <a href="nvidia.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="15" height="15" fill="#76b900" aria-hidden="true"><path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4.01-1.952a6.016 6.016 0 0 0-.786.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.742-.035-1.104-.097v1.325c.292.035.6.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.98-.053v1.864H24V4.063zm0 10.326v1.166c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237h-.008c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.738 3.074M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936Z"/></svg> NVIDIA DC</a>
              <a href="infiniband.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><circle cx="5" cy="6" r="2.5" stroke="#38bdf8" stroke-width="1.8"/><circle cx="19" cy="6" r="2.5" stroke="#38bdf8" stroke-width="1.8"/><circle cx="5" cy="18" r="2.5" stroke="#4ade80" stroke-width="1.8"/><circle cx="19" cy="18" r="2.5" stroke="#4ade80" stroke-width="1.8"/><path d="M7.5 6h9M7.5 18h9M5 8.5v7M19 8.5v7M7 7.5l10 9M17 7.5l-10 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg> InfiniBand</a>
              <a href="switches.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="15" height="14" fill="none" aria-hidden="true"><path d="M1 8h1.5v8H1V8zm20.5 0H23v8h-1.5V8z" fill="currentColor" opacity="0.7"/><rect x="2.5" y="6" width="19" height="12" rx="1.5" fill="#0f172a" stroke="currentColor" stroke-width="1.6"/><circle cx="5.3" cy="9.5" r="1.1" fill="#22c55e"/><circle cx="5.3" cy="14.5" r="1.1" fill="#38bdf8"/><rect x="8.2" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="11.6" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="15" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="18.4" y="8" width="2" height="2.8" rx="0.4" fill="#22c55e"/><rect x="8.2" y="13.2" width="2.4" height="2.8" rx="0.4" fill="#22c55e"/><rect x="11.6" y="13.2" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="15" y="13.2" width="2.4" height="2.8" rx="0.4" fill="#22c55e"/><rect x="18.4" y="13.2" width="2" height="2.8" rx="0.4" fill="currentColor"/></svg> Switches</a>
              <a href="redfish.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 30 20" width="17" height="13" fill="none" aria-hidden="true"><path d="M.2 9.5C.3 8.8 1.8 7.8 5.5 4.7L11.6.5l3.6 2.6L17.9 1l3 2.3-2.4 1.9 2.2 1.7 5.4-4 3.3 2.6-5.3 4.3 5.3 4.3-3.3 2.6-5.4-4-2.2 1.7 2.4 1.9-3 2.3-2.7-2.1-3.6 2.6L.4 10.3l3.1.4L.2 9.5z" fill="#e11d48"/><circle cx="5.6" cy="6.6" r="1.95" fill="#fff"/><circle cx="5.6" cy="6.6" r="1" fill="#e11d48"/></svg> Redfish</a>
              <a href="ipmi.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7.5 12h2l1.5-3 2 6 1.5-3h2" stroke="#4ade80" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg> ipmitool</a>
              <a href="fiber.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2" y="8" width="7" height="8" rx="1.2" stroke="currentColor" stroke-width="1.8"/><path d="M9 10h3v4H9" stroke="currentColor" stroke-width="1.6"/><circle cx="14.5" cy="12" r="1.5" fill="#fbbf24"/><path d="M16 12h6M15.5 9.5l5.5-3.5M15.5 14.5l5.5 3.5" stroke="#22d3ee" stroke-width="1.8" stroke-linecap="round"/></svg> Fiber</a>
              <a href="ethernet.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="5" y="2" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 2v3.5M10.67 2v3.5M13.33 2v3.5M16 2v3.5" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/><path d="M9.5 8.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 12h8l-1 4.5H9L8 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 16.5V22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg> Ethernet</a>
              <a href="motherboards.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="2" stroke="currentColor" stroke-width="1.7"/><rect x="6.5" y="5.5" width="6" height="6" rx="0.8" stroke="#38bdf8" stroke-width="1.6"/><circle cx="9.5" cy="8.5" r="1.2" fill="#38bdf8"/><path d="M15.5 5.5v6M18 5.5v6" stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round"/><path d="M6 15h12M6 18h9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg> Motherboards</a>
            </nav>
          </div>
          <p class="brand-subtitle">${lang.subtitle}</p>
        </div>
      </div>

      <div class="search-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"/>
        </svg>
        <input
          type="search"
          id="search-input"
          placeholder="Search ${lang.name} syntax, variables, loops, functions..."
          autocomplete="off"
          spellcheck="false"
          aria-label="Search ${lang.name} snippets"
        />
        <kbd class="search-Shortcut" id="search-kbd">/</kbd>
      </div>

      <div class="header-actions">
        <button type="button" id="saved-filter-btn" class="action-btn" title="Show bookmarked commands">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Saved</span>
          <span id="saved-count" class="count-badge">0</span>
        </button>

        <button type="button" id="density-toggle" class="action-btn" title="Toggle compact density">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span id="density-label">Compact</span>
        </button>

        <button type="button" id="print-btn" class="action-btn" title="Print Cheat Sheet (Ctrl+P)">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/>
          </svg>
          <span>Print</span>
        </button>

        <button type="button" id="theme-toggle" class="action-btn icon-only" title="Toggle dark/light theme" aria-label="Toggle theme">
          <svg id="theme-icon-sun" viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg id="theme-icon-moon" viewBox="0 0 24 24" width="16" height="16" class="hidden">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="category-bar">
      <div class="container category-bar-inner">
        <nav class="category-tabs" id="category-tabs" aria-label="${lang.name} categories">
          <!-- Populated by JS -->
        </nav>
        <div class="stats-summary" id="stats-summary">
          Showing <strong id="visible-count">0</strong> recipes
        </div>
      </div>
    </div>
  </header>

  <main class="container main-layout">
    <div id="sections-container" class="sections-grid">
      <!-- Populated dynamically -->
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden">
      <div class="empty-icon">404</div>
      <h3>No matching ${lang.name} recipes found</h3>
      <p>Try searching for keywords or reset active filters.</p>
      <button type="button" id="reset-search-btn" class="action-btn">Reset Filters</button>
    </div>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <span>${lang.title} — Part of the Datacenter &amp; Developer Reference Suite</span>
      </div>
      <div class="footer-shortcuts">
        <span><kbd>Ctrl+K</kbd> Global Search</span>
        <span><kbd>/</kbd> In-Sheet Filter</span>
        <span><kbd>Esc</kbd> Clear</span>
        <span><kbd>Ctrl+P</kbd> Print Sheet</span>
      </div>
    </div>
  </footer>

  <div id="toast" class="toast" role="status" aria-live="polite">
    <span class="toast-check">&#10003;</span>
    <span id="toast-text">Copied to clipboard</span>
  </div>

  <script src="global-search-index.js"></script>
  <script src="common.js"></script>
  <script src="${lang.js}"></script>
</body>
</html>`;
}

// Write all 11 JS and HTML files
for (const lang of SCRIPTING_LANGUAGES) {
  const jsPath = path.join(__dirname, lang.js);
  const htmlPath = path.join(__dirname, lang.file);
  fs.writeFileSync(jsPath, generateJsFile(lang), 'utf8');
  fs.writeFileSync(htmlPath, generateHtmlFile(lang), 'utf8');
  console.log(`Created ${lang.file} and ${lang.js}`);
}

console.log('All 11 scripting language sheets generated successfully.');
