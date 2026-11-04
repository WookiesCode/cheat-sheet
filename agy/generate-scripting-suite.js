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
  },

  // 12. LUA
  {
  "key": "lua",
  "file": "lua.html",
  "js": "lua.js",
  "varName": "LUA_CHEAT_SHEET_DATA",
  "name": "Lua",
  "title": "Lua Scripting & Config Reference",
  "subtitle": "Variables, tables, loops, functions, patterns, error handling & Hyprland / Neovim config files",
  "pill": "Lua 5.5 / LuaJIT",
  "prompt": "lua",
  "cursor": ">",
  "sections": [
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
  ]
},

  // 13. GIT
  {
  "key": "git",
  "file": "git.html",
  "js": "git.js",
  "varName": "GIT_CHEAT_SHEET_DATA",
  "name": "Git",
  "title": "Git Version Control Reference",
  "subtitle": "Setup, commits, branches, remotes, history search, undo & recovery, and offline transfer",
  "pill": "Git 2.x",
  "prompt": "git",
  "cursor": ">",
  "sections": [
    {
      "id": "git-setup",
      "badge": "setup",
      "title": "Setup & Configuration",
      "subtitle": "Identity, useful defaults, aliases, starting a repository & cloning",
      "commands": [
        {
          "id": "git-config-basics",
          "desc": "Set your identity and sensible defaults once per machine",
          "cmd": "git config --global user.name \"Your Name\"\ngit config --global user.email \"you@example.com\"\ngit config --global init.defaultBranch main\ngit config --global pull.rebase true\ngit config --global push.autoSetupRemote true\ngit config --global fetch.prune true",
          "flags": [
            [
              "--global",
              "Applies to your user (~/.gitconfig)"
            ],
            [
              "--local",
              "Applies to this repository only (.git/config). This is the default when writing"
            ],
            [
              "--system",
              "Applies to every user on the machine (/etc/gitconfig)"
            ],
            [
              "pull.rebase true",
              "git pull rebases your work instead of creating a merge commit"
            ],
            [
              "push.autoSetupRemote true",
              "The first git push on a new branch sets its upstream for you"
            ],
            [
              "fetch.prune true",
              "Fetching removes local copies of branches deleted on the remote"
            ]
          ],
          "subcommands": [
            [
              "git config --list --show-origin",
              "Show every setting and the file it came from"
            ],
            [
              "git config --global core.editor nvim",
              "Set the editor used for commit messages"
            ],
            [
              "git config --global --unset pull.rebase",
              "Remove a setting"
            ],
            [
              "git config --global --edit",
              "Open your global config in the editor"
            ]
          ],
          "tip": "Run git config user.email inside a repository to see which address your commits will use.",
          "tags": [
            "git",
            "config",
            "setup",
            "identity",
            "gitconfig",
            "defaults"
          ]
        },
        {
          "id": "git-aliases",
          "desc": "Short aliases for commands you type all day",
          "cmd": "git config --global alias.st \"status -sb\"\ngit config --global alias.co switch\ngit config --global alias.lg \"log --oneline --graph --decorate --all\"\ngit config --global alias.last \"log -1 --stat\"\ngit config --global alias.unstage \"restore --staged\"",
          "flags": [
            [
              "alias.NAME \"args\"",
              "Runs git args when you type git NAME"
            ],
            [
              "alias.NAME \"!cmd\"",
              "A leading ! runs a shell command instead of a git subcommand"
            ]
          ],
          "subcommands": [
            [
              "git config --get-regexp '^alias\\.'",
              "List your aliases"
            ],
            [
              "git config --global alias.root \"rev-parse --show-toplevel\"",
              "git root prints the top folder of the repository"
            ]
          ],
          "tip": "Aliases live in ~/.gitconfig, so copying that file brings them to a new machine.",
          "tags": [
            "git",
            "alias",
            "config",
            "shortcuts"
          ]
        },
        {
          "id": "git-init-clone",
          "desc": "Start a new repository or clone an existing one",
          "cmd": "# New repository\ngit init my-project\n\n# Clone over SSH or HTTPS\ngit clone git@github.com:org/repo.git\ngit clone https://github.com/org/repo.git my-folder",
          "flags": [
            [
              "--depth 1",
              "Shallow clone: fetch only the latest commit"
            ],
            [
              "--branch NAME",
              "Check out this branch or tag after cloning"
            ],
            [
              "--single-branch",
              "Fetch one branch instead of all of them"
            ],
            [
              "--filter=blob:none",
              "Partial clone: full history, with file contents fetched on demand"
            ],
            [
              "--recurse-submodules",
              "Also clone every submodule"
            ]
          ],
          "subcommands": [
            [
              "git clone --depth 1 --branch v1.2.0 https://github.com/org/repo.git",
              "Fetch one tagged release quickly"
            ],
            [
              "git clone --filter=blob:none https://github.com/org/repo.git",
              "Clone a large repository with history but less data"
            ],
            [
              "git fetch --unshallow",
              "Turn a shallow clone into a full one"
            ]
          ],
          "tip": "A shallow clone is ideal for pulling a tool onto a node. Use a full clone if you need log, blame or bisect.",
          "tags": [
            "git",
            "init",
            "clone",
            "shallow",
            "partial",
            "depth"
          ]
        },
        {
          "id": "git-ignore",
          "desc": "Keep logs, build output and secrets out of the repository",
          "cmd": "cat >> .gitignore <<'EOF'\n*.log\nbuild/\n.env\n!important.log\nEOF\ngit add .gitignore\ngit commit -m \"Ignore logs, build output and .env\"",
          "flags": [
            [
              "*.log",
              "Ignore matching files in every folder"
            ],
            [
              "build/",
              "Ignore a folder"
            ],
            [
              "/config.local",
              "A leading / matches only at the repository root"
            ],
            [
              "!important.log",
              "Exception: keep tracking this file"
            ]
          ],
          "subcommands": [
            [
              "git check-ignore -v build/out.bin",
              "Show which rule ignores a file"
            ],
            [
              "git rm --cached .env",
              "Stop tracking a file but keep it on disk"
            ],
            [
              "git rm -r --cached build/",
              "Stop tracking a whole folder"
            ],
            [
              "git status --ignored",
              "List ignored files too"
            ]
          ],
          "tip": ".gitignore only affects untracked files. If a file is already committed, remove it with git rm --cached first.",
          "tags": [
            "git",
            "gitignore",
            "ignore",
            "untrack",
            "secrets"
          ]
        }
      ]
    },
    {
      "id": "git-daily",
      "badge": "daily",
      "title": "Everyday Workflow",
      "subtitle": "Check status, stage changes, commit, compare & stash work",
      "commands": [
        {
          "id": "git-status-add-commit",
          "desc": "The basic loop: check what changed, stage it, commit it",
          "cmd": "git status -sb\ngit add path/to/file\ngit commit -m \"Fix BMC timeout in collection script\"\ngit push",
          "flags": [
            [
              "git add .",
              "Stage every change under the current folder"
            ],
            [
              "git add -A",
              "Stage every change in the repository, including deletions"
            ],
            [
              "git add -u",
              "Stage changes to tracked files only, leaving new files out"
            ],
            [
              "git add -p",
              "Choose individual hunks to stage"
            ],
            [
              "git commit -a",
              "Stage all tracked changes and commit in one step"
            ],
            [
              "git commit -v",
              "Show the diff in the editor while you write the message"
            ]
          ],
          "subcommands": [
            [
              "git commit --amend --no-edit",
              "Add staged changes to the last commit and keep its message"
            ],
            [
              "git commit --amend -m \"Better message\"",
              "Replace the last commit's message"
            ],
            [
              "git mv old.sh new.sh",
              "Rename a tracked file"
            ],
            [
              "git rm old.sh",
              "Delete a tracked file and stage the deletion"
            ],
            [
              "git ls-files",
              "List every tracked file"
            ]
          ],
          "tip": "Only amend commits you haven't pushed, because amending rewrites history other people may already have.",
          "tags": [
            "git",
            "status",
            "add",
            "commit",
            "amend",
            "stage",
            "push"
          ]
        },
        {
          "id": "git-diff",
          "desc": "Compare the working tree, staging area, commits and branches",
          "cmd": "git diff\ngit diff --staged\ngit diff HEAD~1 HEAD\ngit diff main...feature/fix",
          "flags": [
            [
              "git diff",
              "Unstaged changes"
            ],
            [
              "--staged",
              "What the next commit will contain"
            ],
            [
              "A..B or A B",
              "Direct comparison of two commits"
            ],
            [
              "A...B",
              "Changes on B since it split from A, which is what a pull request shows"
            ],
            [
              "--stat",
              "Summary of files and lines changed"
            ],
            [
              "--name-only",
              "Changed file names only"
            ],
            [
              "-w",
              "Ignore whitespace changes"
            ],
            [
              "--word-diff",
              "Highlight changed words instead of whole lines"
            ]
          ],
          "subcommands": [
            [
              "git diff --stat main...HEAD",
              "See how much your branch changes"
            ],
            [
              "git diff --name-only HEAD~3",
              "Files changed in the last 3 commits"
            ],
            [
              "git diff HEAD~1 -- path/to/file",
              "Limit the diff to one file"
            ],
            [
              "git show HEAD:path/to/file",
              "Print a file as it was in a commit"
            ]
          ],
          "tip": "Run git diff --staged before every commit to catch stray debug lines and secrets.",
          "tags": [
            "git",
            "diff",
            "compare",
            "staged",
            "changes"
          ]
        },
        {
          "id": "git-stash",
          "desc": "Set unfinished work aside and bring it back later",
          "cmd": "git stash push -u -m \"WIP timeout fix\"\ngit stash list\ngit stash pop",
          "flags": [
            [
              "-u",
              "Include untracked files"
            ],
            [
              "-m \"msg\"",
              "Label the stash so you can recognise it later"
            ],
            [
              "-p",
              "Choose which hunks to stash"
            ],
            [
              "pop",
              "Apply the newest stash and delete it"
            ],
            [
              "apply",
              "Apply a stash and keep it"
            ]
          ],
          "subcommands": [
            [
              "git stash show -p stash@{0}",
              "See what a stash contains"
            ],
            [
              "git stash apply stash@{1}",
              "Apply a specific stash"
            ],
            [
              "git stash branch fix-timeout stash@{0}",
              "Turn a stash into a new branch"
            ],
            [
              "git stash drop stash@{1}",
              "Delete one stash"
            ],
            [
              "git stash clear",
              "Delete every stash"
            ]
          ],
          "tip": "If git stash pop hits a conflict, the stash is kept. Fix the conflict, then git stash drop it.",
          "tags": [
            "git",
            "stash",
            "wip",
            "pop",
            "apply",
            "shelve"
          ]
        }
      ]
    },
    {
      "id": "git-branch",
      "badge": "branch",
      "title": "Branches, Merging & Rebasing",
      "subtitle": "Create and switch branches, merge, rebase, cherry-pick & resolve conflicts",
      "commands": [
        {
          "id": "git-branches",
          "desc": "Create, switch, rename and delete branches",
          "cmd": "git switch -c feature/nvme-check\ngit switch main\ngit switch -\ngit branch -vv",
          "flags": [
            [
              "-c NAME",
              "Create a branch and switch to it"
            ],
            [
              "git switch -",
              "Go back to the previous branch"
            ],
            [
              "-a",
              "List local and remote branches"
            ],
            [
              "-vv",
              "Show each branch's upstream and whether it's ahead or behind"
            ],
            [
              "-d NAME",
              "Delete a merged branch"
            ],
            [
              "-D NAME",
              "Force delete a branch, even if unmerged"
            ],
            [
              "-m OLD NEW",
              "Rename a branch"
            ]
          ],
          "subcommands": [
            [
              "git switch -c fix origin/fix",
              "Create a local branch from a remote branch"
            ],
            [
              "git switch --detach v1.2.0",
              "Look at a tag without being on a branch"
            ],
            [
              "git branch --merged main",
              "List branches already merged, which are safe to delete"
            ],
            [
              "git branch --sort=-committerdate",
              "List branches by most recent work"
            ],
            [
              "git push origin --delete feature/old",
              "Delete a branch on the remote"
            ]
          ],
          "tip": "git switch and git restore split up the old git checkout, so it's harder to overwrite files by mistake.",
          "tags": [
            "git",
            "branch",
            "switch",
            "checkout",
            "delete",
            "rename"
          ]
        },
        {
          "id": "git-merge",
          "desc": "Bring another branch into the current one",
          "cmd": "git switch main\ngit pull\ngit merge feature/nvme-check",
          "flags": [
            [
              "--ff-only",
              "Only merge if no merge commit is needed, otherwise stop"
            ],
            [
              "--no-ff",
              "Always create a merge commit, which keeps the branch visible in history"
            ],
            [
              "--squash",
              "Stage all the branch's changes as one commit for you to make"
            ],
            [
              "--abort",
              "Cancel a merge and go back to how things were"
            ],
            [
              "--continue",
              "Finish the merge after resolving conflicts"
            ]
          ],
          "subcommands": [
            [
              "git merge --squash feature/x && git commit -m \"Add feature x\"",
              "Merge a branch as a single commit"
            ],
            [
              "git merge --abort",
              "Back out of a conflicted merge"
            ],
            [
              "git log --merges --oneline",
              "List merge commits"
            ]
          ],
          "tip": "Commit or stash your work before merging. Merges are hard to back out of with uncommitted changes around.",
          "tags": [
            "git",
            "merge",
            "fast-forward",
            "squash",
            "no-ff"
          ]
        },
        {
          "id": "git-rebase",
          "desc": "Replay your commits on top of another branch and tidy them up",
          "cmd": "git switch feature/nvme-check\ngit fetch origin\ngit rebase origin/main\ngit push --force-with-lease",
          "flags": [
            [
              "-i HEAD~5",
              "Interactive: reorder, squash, edit or drop the last 5 commits"
            ],
            [
              "--continue",
              "Carry on after fixing a conflict and running git add"
            ],
            [
              "--skip",
              "Drop the commit that's currently conflicting"
            ],
            [
              "--abort",
              "Cancel and return the branch to where it started"
            ],
            [
              "--autosquash",
              "Move fixup! commits next to their targets automatically"
            ],
            [
              "--onto NEW OLD",
              "Move commits made after OLD onto NEW"
            ]
          ],
          "subcommands": [
            [
              "git rebase -i HEAD~5",
              "Clean up recent commits before opening a pull request"
            ],
            [
              "git commit --fixup=abc1234",
              "Mark a commit as a correction to abc1234"
            ],
            [
              "git rebase -i --autosquash origin/main",
              "Fold fixup commits into their targets"
            ],
            [
              "git rebase --onto main old-base feature/x",
              "Move a branch to a new base"
            ]
          ],
          "tip": "Don't rebase a branch other people work on. Rebasing rewrites commit IDs, and that breaks their copies.",
          "tags": [
            "git",
            "rebase",
            "interactive",
            "squash",
            "fixup",
            "history"
          ]
        },
        {
          "id": "git-cherry-pick",
          "desc": "Copy specific commits onto the current branch",
          "cmd": "git switch release/1.2\ngit cherry-pick abc1234",
          "flags": [
            [
              "-x",
              "Add \"cherry picked from\" with the original commit ID to the message"
            ],
            [
              "-n",
              "Apply the changes without committing"
            ],
            [
              "A^..B",
              "Pick a range of commits, including A"
            ],
            [
              "--abort",
              "Cancel and go back"
            ],
            [
              "--continue",
              "Carry on after fixing a conflict"
            ]
          ],
          "subcommands": [
            [
              "git cherry-pick -x abc1234",
              "Backport a fix and record where it came from"
            ],
            [
              "git cherry-pick abc1234^..def5678",
              "Pick a run of commits in order"
            ]
          ],
          "tip": "Use -x when backporting to a release branch, so people can trace the fix to its original commit.",
          "tags": [
            "git",
            "cherry-pick",
            "backport",
            "hotfix"
          ]
        },
        {
          "id": "git-conflicts",
          "desc": "Resolve merge and rebase conflicts",
          "cmd": "git status\n# Edit each conflicted file and remove the <<<<<<< ======= >>>>>>> markers\ngit add path/to/file\ngit merge --continue",
          "flags": [
            [
              "<<<<<<< HEAD",
              "Start of the version on your current branch"
            ],
            [
              "=======",
              "Divider between the two versions"
            ],
            [
              ">>>>>>> other",
              "End of the incoming version"
            ],
            [
              "--ours",
              "During a merge, your branch. During a rebase, the branch you're rebasing onto"
            ],
            [
              "--theirs",
              "During a merge, the incoming branch. During a rebase, your commit"
            ]
          ],
          "subcommands": [
            [
              "git diff --name-only --diff-filter=U",
              "List files that still have conflicts"
            ],
            [
              "git checkout --ours path/to/file",
              "Take one side of a conflicted file"
            ],
            [
              "git checkout --theirs path/to/file",
              "Take the other side of a conflicted file"
            ],
            [
              "git config --global merge.conflictStyle zdiff3",
              "Also show the original text inside conflict markers"
            ],
            [
              "git config --global rerere.enabled true",
              "Remember how you resolved a conflict and reuse it"
            ]
          ],
          "tip": "--ours and --theirs swap meaning during a rebase, so check the file after you pick a side.",
          "tags": [
            "git",
            "conflict",
            "merge",
            "rebase",
            "resolve",
            "ours",
            "theirs"
          ]
        }
      ]
    },
    {
      "id": "git-remote",
      "badge": "remote",
      "title": "Remotes, Fetch, Pull & Push",
      "subtitle": "Manage remotes, sync with them, safe force pushes & tags",
      "commands": [
        {
          "id": "git-remotes",
          "desc": "See and change the remotes this repository talks to",
          "cmd": "git remote -v\ngit remote add upstream https://github.com/org/repo.git\ngit remote set-url origin git@github.com:org/repo.git",
          "flags": [
            [
              "-v",
              "Show each remote's URLs"
            ],
            [
              "add NAME URL",
              "Add a remote"
            ],
            [
              "set-url NAME URL",
              "Change a remote's address, for example from HTTPS to SSH"
            ],
            [
              "rename OLD NEW",
              "Rename a remote"
            ],
            [
              "remove NAME",
              "Remove a remote"
            ],
            [
              "show NAME",
              "Show branches and tracking details for a remote"
            ]
          ],
          "subcommands": [
            [
              "git remote show origin",
              "Check the default branch and what tracks what"
            ],
            [
              "git remote prune origin",
              "Remove local references to deleted remote branches"
            ],
            [
              "git ls-remote origin",
              "List remote branches and tags without fetching"
            ]
          ],
          "tip": "git ls-remote is a quick way to test that you can reach a remote and that your credentials work.",
          "tags": [
            "git",
            "remote",
            "origin",
            "upstream",
            "url"
          ]
        },
        {
          "id": "git-fetch-pull-push",
          "desc": "Download changes, update your branch and publish your commits",
          "cmd": "git fetch --all --prune\ngit status -sb\ngit pull --rebase\ngit push -u origin HEAD",
          "flags": [
            [
              "git fetch",
              "Download changes without touching your files"
            ],
            [
              "git pull",
              "Fetch, then update the current branch"
            ],
            [
              "--rebase",
              "Put your local commits on top of what you pulled"
            ],
            [
              "--ff-only",
              "Pull only if no merge or rebase is needed"
            ],
            [
              "-u origin HEAD",
              "Push the current branch and set it as the upstream"
            ],
            [
              "--force-with-lease",
              "Force push, but stop if someone else has pushed in the meantime"
            ]
          ],
          "subcommands": [
            [
              "git log HEAD..@{u} --oneline",
              "Commits on the remote that you don't have yet"
            ],
            [
              "git log @{u}..HEAD --oneline",
              "Local commits you haven't pushed"
            ],
            [
              "git pull --ff-only",
              "Update a deployed copy, stopping if it has diverged"
            ],
            [
              "git push --force-with-lease",
              "Publish a rebased branch safely"
            ]
          ],
          "tip": "Use --force-with-lease rather than --force, because plain --force can erase a teammate's commits.",
          "tags": [
            "git",
            "fetch",
            "pull",
            "push",
            "upstream",
            "force-with-lease",
            "sync"
          ]
        },
        {
          "id": "git-tags",
          "desc": "Mark releases and compare what's between them",
          "cmd": "git tag -a v1.2.0 -m \"Release 1.2.0\"\ngit push origin v1.2.0\ngit tag -l 'v1.*'",
          "flags": [
            [
              "-a",
              "Annotated tag, which stores the author, date and message"
            ],
            [
              "-m \"msg\"",
              "Tag message"
            ],
            [
              "-l 'pattern'",
              "List matching tags"
            ],
            [
              "-d NAME",
              "Delete a local tag"
            ],
            [
              "--sort=-v:refname",
              "Sort by version, newest first"
            ]
          ],
          "subcommands": [
            [
              "git tag -a v1.1.9 abc1234 -m \"Tag an older commit\"",
              "Tag a past commit"
            ],
            [
              "git push origin --tags",
              "Push every local tag"
            ],
            [
              "git push origin --delete v1.2.0",
              "Delete a tag on the remote"
            ],
            [
              "git log v1.1.0..v1.2.0 --oneline",
              "List commits between two releases"
            ],
            [
              "git describe --tags --always --dirty",
              "Name the current commit relative to the nearest tag"
            ]
          ],
          "tip": "git push doesn't send tags by default, so push them by name.",
          "tags": [
            "git",
            "tag",
            "release",
            "version",
            "describe"
          ]
        }
      ]
    },
    {
      "id": "git-history",
      "badge": "history",
      "title": "History & Searching",
      "subtitle": "Read the log, find who changed what, search code & track down bad commits",
      "commands": [
        {
          "id": "git-log",
          "desc": "Read the commit history",
          "cmd": "git log --oneline --graph --decorate --all -20",
          "flags": [
            [
              "--oneline",
              "One line per commit"
            ],
            [
              "--graph",
              "Draw branches and merges"
            ],
            [
              "-n / -20",
              "Limit the number of commits"
            ],
            [
              "--stat",
              "Show files changed in each commit"
            ],
            [
              "-p",
              "Show the full diff of each commit"
            ],
            [
              "--author=\"name\"",
              "Commits by one author"
            ],
            [
              "--since=\"2 weeks ago\"",
              "Commits after a date (--until for before)"
            ],
            [
              "--grep=\"text\"",
              "Search commit messages"
            ],
            [
              "--follow -- file",
              "Follow one file's history across renames"
            ]
          ],
          "subcommands": [
            [
              "git log --pretty=format:'%h %ad %an %s' --date=short",
              "Compact custom format"
            ],
            [
              "git log main..feature/x --oneline",
              "Commits on the branch that aren't on main"
            ],
            [
              "git log --follow -p -- path/to/file",
              "Every change made to one file"
            ],
            [
              "git shortlog -sne",
              "Commit counts per author"
            ],
            [
              "git show abc1234 --stat",
              "Show one commit and its files"
            ]
          ],
          "tip": "Commits can be named with HEAD~2 (two back), HEAD^ (parent), a tag, a branch, or a short ID.",
          "tags": [
            "git",
            "log",
            "history",
            "graph",
            "shortlog",
            "show"
          ]
        },
        {
          "id": "git-blame-search",
          "desc": "Find who changed a line and when a string appeared",
          "cmd": "git blame -L 40,60 path/to/file\ngit log -S'bmc_timeout' --oneline\ngit grep -n 'bmc_timeout'",
          "flags": [
            [
              "-L 40,60",
              "Blame only these lines"
            ],
            [
              "-w",
              "Ignore whitespace-only changes when blaming"
            ],
            [
              "-C",
              "Follow lines moved or copied from other files"
            ],
            [
              "-S'text'",
              "Commits where the number of times text appears changed"
            ],
            [
              "-G'regex'",
              "Commits whose diff has a line matching the regex"
            ],
            [
              "git grep -n",
              "Search tracked files, showing line numbers"
            ]
          ],
          "subcommands": [
            [
              "git blame -w -C path/to/file",
              "Skip formatting changes to find the real author"
            ],
            [
              "git log -L 40,60:path/to/file",
              "History of a range of lines"
            ],
            [
              "git grep -n 'pattern' v1.2.0",
              "Search the code as it was at a tag"
            ],
            [
              "git log --all --oneline -- deleted/file.sh",
              "Find commits that touched a file that's now gone"
            ]
          ],
          "tip": "git log -S finds when something was added or removed, even if the line no longer exists.",
          "tags": [
            "git",
            "blame",
            "grep",
            "pickaxe",
            "search",
            "annotate"
          ]
        },
        {
          "id": "git-bisect",
          "desc": "Binary search through history to find the commit that broke something",
          "cmd": "git bisect start\ngit bisect bad HEAD\ngit bisect good v1.1.0\n# Test this commit, then mark it, and repeat until git names the culprit\ngit bisect good\ngit bisect reset",
          "flags": [
            [
              "start",
              "Begin a bisect session"
            ],
            [
              "bad [commit]",
              "Mark a commit as broken"
            ],
            [
              "good [commit]",
              "Mark a commit as working"
            ],
            [
              "skip",
              "Skip a commit you can't test"
            ],
            [
              "run ./test.sh",
              "Automate it: exit 0 is good, exit 1 to 127 is bad, 125 is skip"
            ],
            [
              "reset",
              "End the session and return to where you started"
            ]
          ],
          "subcommands": [
            [
              "git bisect run ./test.sh",
              "Let a script find the bad commit"
            ],
            [
              "git bisect log",
              "Show the steps so far"
            ]
          ],
          "tip": "Bisect tests about 10 commits to search 1,000, so it's well worth a small test script.",
          "tags": [
            "git",
            "bisect",
            "regression",
            "binary-search",
            "debug"
          ]
        }
      ]
    },
    {
      "id": "git-undo",
      "badge": "undo",
      "title": "Undo & Recovery",
      "subtitle": "Discard changes, unstage, undo commits & recover lost work",
      "commands": [
        {
          "id": "git-restore",
          "desc": "Undo changes that haven't been committed",
          "cmd": "git restore --staged path/to/file\ngit restore path/to/file",
          "flags": [
            [
              "--staged",
              "Unstage a file and keep your edits"
            ],
            [
              "git restore file",
              "Discard unstaged edits. They can't be recovered"
            ],
            [
              "--source=COMMIT",
              "Restore a file as it was in a commit"
            ],
            [
              "-p",
              "Choose which hunks to discard"
            ]
          ],
          "subcommands": [
            [
              "git restore --source=HEAD~2 -- path/to/file",
              "Bring back an older version of a file"
            ],
            [
              "git restore .",
              "Discard all unstaged edits under the current folder"
            ],
            [
              "git clean -nd",
              "Preview which untracked files and folders would be deleted"
            ],
            [
              "git clean -fd",
              "Delete untracked files and folders"
            ],
            [
              "git clean -fdx",
              "Also delete ignored files, such as build output and .env"
            ]
          ],
          "tip": "Always run git clean -nd first. git clean deletes files that git has no copy of.",
          "tags": [
            "git",
            "restore",
            "unstage",
            "discard",
            "clean",
            "untracked"
          ]
        },
        {
          "id": "git-reset",
          "desc": "Move the branch back to an earlier commit",
          "cmd": "# Undo the last commit and keep its changes staged\ngit reset --soft HEAD~1",
          "flags": [
            [
              "--soft",
              "Undo commits. Changes stay staged"
            ],
            [
              "--mixed",
              "Undo commits and unstage. Changes stay in your files. This is the default"
            ],
            [
              "--hard",
              "Undo commits and delete the changes from your files"
            ],
            [
              "HEAD~1",
              "One commit back. Use HEAD~3 for three"
            ]
          ],
          "subcommands": [
            [
              "git reset HEAD~1",
              "Undo the last commit and keep the edits unstaged"
            ],
            [
              "git reset --hard origin/main",
              "Make your branch match the remote exactly, discarding local work"
            ],
            [
              "git reset --hard ORIG_HEAD",
              "Undo a merge, rebase or reset you just did"
            ]
          ],
          "tip": "Run git status and git stash first. git reset --hard deletes uncommitted work for good.",
          "tags": [
            "git",
            "reset",
            "soft",
            "mixed",
            "hard",
            "uncommit"
          ]
        },
        {
          "id": "git-revert",
          "desc": "Undo a commit that's already pushed by adding a new commit",
          "cmd": "git revert abc1234\ngit push",
          "flags": [
            [
              "--no-edit",
              "Use the default commit message"
            ],
            [
              "-n",
              "Apply the reversal without committing"
            ],
            [
              "-m 1",
              "Revert a merge commit, keeping its first parent"
            ],
            [
              "A..B",
              "Revert a range of commits, leaving A itself in place"
            ]
          ],
          "subcommands": [
            [
              "git revert --no-edit HEAD",
              "Back out the latest commit"
            ],
            [
              "git revert -m 1 abc1234",
              "Back out a merged branch"
            ],
            [
              "git revert --abort",
              "Cancel a conflicted revert"
            ]
          ],
          "tip": "On shared branches use git revert, not git reset, because revert keeps history intact for everyone else.",
          "tags": [
            "git",
            "revert",
            "undo",
            "rollback",
            "shared"
          ]
        },
        {
          "id": "git-reflog",
          "desc": "Recover commits after a bad reset, rebase or deleted branch",
          "cmd": "git reflog -20\ngit branch recovered HEAD@{2}\ngit switch recovered",
          "flags": [
            [
              "git reflog",
              "Every position HEAD has been in, even for commits no branch points to"
            ],
            [
              "HEAD@{2}",
              "Where HEAD was two moves ago"
            ],
            [
              "git reflog show BRANCH",
              "History of one branch"
            ],
            [
              "git fsck --lost-found",
              "Find commits no reference points to, such as a dropped stash"
            ]
          ],
          "subcommands": [
            [
              "git reset --hard HEAD@{1}",
              "Jump back to where you were before the last move"
            ],
            [
              "git fsck --lost-found",
              "Find dangling commits and blobs"
            ],
            [
              "git show abc1234",
              "Inspect a recovered commit before using it"
            ]
          ],
          "tip": "If it was committed, it can usually be recovered. Reflog entries last 90 days by default, or 30 for unreachable commits.",
          "tags": [
            "git",
            "reflog",
            "recover",
            "lost",
            "fsck",
            "rescue"
          ]
        }
      ]
    },
    {
      "id": "git-advanced",
      "badge": "advanced",
      "title": "Worktrees, Submodules & Hooks",
      "subtitle": "Parallel checkouts, nested repositories, automation, large files & signing",
      "commands": [
        {
          "id": "git-worktree",
          "desc": "Check out a second branch in another folder without cloning again",
          "cmd": "git worktree add ../repo-hotfix -b hotfix main\ngit worktree list\ngit worktree remove ../repo-hotfix",
          "flags": [
            [
              "add PATH BRANCH",
              "Check out an existing branch at PATH"
            ],
            [
              "add PATH -b NEW BASE",
              "Create a new branch from BASE at PATH"
            ],
            [
              "list",
              "Show every worktree"
            ],
            [
              "remove PATH",
              "Delete a worktree"
            ],
            [
              "prune",
              "Clean up records of worktrees whose folders are gone"
            ]
          ],
          "subcommands": [
            [
              "git worktree add ../repo-review origin/main",
              "Check out a remote branch in a separate folder, detached, to compare with"
            ],
            [
              "git worktree prune",
              "Tidy up after deleting a folder by hand"
            ]
          ],
          "tip": "A branch can only be checked out in one worktree at a time.",
          "tags": [
            "git",
            "worktree",
            "parallel",
            "checkout",
            "hotfix"
          ]
        },
        {
          "id": "git-submodule",
          "desc": "Work with repositories nested inside another repository",
          "cmd": "git submodule add https://github.com/org/lib.git vendor/lib\ngit submodule update --init --recursive\ngit submodule status",
          "flags": [
            [
              "add URL PATH",
              "Add a repository as a submodule"
            ],
            [
              "update --init --recursive",
              "Download the exact commits the parent expects"
            ],
            [
              "update --remote",
              "Move submodules to the latest commit on their branch"
            ],
            [
              "status",
              "Show the commit each submodule is on"
            ]
          ],
          "subcommands": [
            [
              "git clone --recurse-submodules https://github.com/org/repo.git",
              "Clone with submodules included"
            ],
            [
              "git submodule foreach 'git status -sb'",
              "Run a command in every submodule"
            ]
          ],
          "tip": "Empty submodule folders after a clone just mean you need git submodule update --init --recursive.",
          "tags": [
            "git",
            "submodule",
            "vendor",
            "nested",
            "recursive"
          ]
        },
        {
          "id": "git-hooks",
          "desc": "Run checks automatically on commit or push",
          "cmd": "mkdir -p .githooks\ncat > .githooks/pre-commit <<'EOF'\n#!/bin/sh\nif git diff --cached | grep -qE 'BEGIN (RSA|OPENSSH) PRIVATE KEY'; then\n  echo \"Private key in staged changes\" >&2\n  exit 1\nfi\nEOF\nchmod +x .githooks/pre-commit\ngit config core.hooksPath .githooks",
          "flags": [
            [
              "pre-commit",
              "Runs before a commit. A non-zero exit stops the commit"
            ],
            [
              "commit-msg",
              "Checks the commit message"
            ],
            [
              "pre-push",
              "Runs before a push"
            ],
            [
              "core.hooksPath",
              "Use a tracked folder of hooks rather than .git/hooks"
            ]
          ],
          "subcommands": [
            [
              "git commit --no-verify",
              "Skip the pre-commit and commit-msg hooks once"
            ],
            [
              "ls .git/hooks",
              "See the sample hooks git installs"
            ]
          ],
          "tip": "Files in .git/hooks aren't cloned, so keep shared hooks in a tracked folder and set core.hooksPath.",
          "tags": [
            "git",
            "hooks",
            "pre-commit",
            "automation",
            "secrets"
          ]
        },
        {
          "id": "git-lfs-signing",
          "desc": "Store large binaries with Git LFS and sign commits with an SSH key",
          "cmd": "# Large files (needs the git-lfs package)\ngit lfs install\ngit lfs track \"*.bin\"\ngit add .gitattributes\n\n# Sign commits with your SSH key\ngit config --global gpg.format ssh\ngit config --global user.signingkey ~/.ssh/id_ed25519.pub\ngit config --global commit.gpgsign true",
          "flags": [
            [
              "git lfs track",
              "Store matching files in LFS. The rule goes in .gitattributes"
            ],
            [
              "git lfs pull",
              "Download the real files for the current checkout"
            ],
            [
              "gpg.format ssh",
              "Sign with an SSH key instead of GPG"
            ],
            [
              "commit.gpgsign true",
              "Sign every commit"
            ]
          ],
          "subcommands": [
            [
              "git lfs ls-files",
              "List files stored in LFS"
            ],
            [
              "git log --show-signature -1",
              "Check the signature on the last commit"
            ]
          ],
          "tip": "If firmware files look like tiny text files after a clone, those are LFS pointers. Run git lfs pull.",
          "tags": [
            "git",
            "lfs",
            "large-files",
            "signing",
            "ssh",
            "gpg",
            "firmware"
          ]
        }
      ]
    },
    {
      "id": "git-ops",
      "badge": "ops",
      "title": "Datacenter & Ops Recipes",
      "subtitle": "Check deployed copies, move code to air-gapped hosts & fix common errors",
      "commands": [
        {
          "id": "git-check-deployed",
          "desc": "Check what version of a repository is deployed on a node, without changing it",
          "cmd": "git -C /opt/tools describe --tags --always --dirty\ngit -C /opt/tools rev-parse HEAD\ngit -C /opt/tools status --short\ngit -C /opt/tools log -1 --format='%h %ad %an %s' --date=iso",
          "flags": [
            [
              "-C PATH",
              "Run git as if started in PATH, so you don't need to cd"
            ],
            [
              "--dirty",
              "Adds -dirty to the name if there are local edits"
            ],
            [
              "--short",
              "One line per changed file. Empty output means a clean copy"
            ]
          ],
          "subcommands": [
            [
              "git rev-parse --show-toplevel",
              "Print the top folder of the repository"
            ],
            [
              "git rev-parse --abbrev-ref HEAD",
              "Print the current branch name"
            ],
            [
              "for h in node01 node02; do echo \"$h: $(ssh \"$h\" git -C /opt/tools rev-parse --short HEAD)\"; done",
              "Compare the deployed commit across nodes"
            ]
          ],
          "tip": "These commands only read the repository, so they're safe to run on a node that's running jobs.",
          "tags": [
            "git",
            "deployed",
            "version",
            "describe",
            "rev-parse",
            "fleet",
            "drift"
          ]
        },
        {
          "id": "git-air-gapped",
          "desc": "Move a repository to a host with no route to the Git server",
          "cmd": "# On the connected machine\ngit bundle create tools.bundle --all\nsha256sum tools.bundle\nscp tools.bundle jumpbox:/tmp/\n\n# On the isolated host\ngit bundle verify /tmp/tools.bundle\ngit clone /tmp/tools.bundle tools",
          "flags": [
            [
              "git bundle create FILE --all",
              "Pack every branch and tag into one file"
            ],
            [
              "git bundle verify FILE",
              "Check that a bundle is complete and valid"
            ],
            [
              "base..HEAD",
              "Bundle only recent commits instead of everything"
            ],
            [
              "git archive",
              "Export a plain snapshot with no history"
            ],
            [
              "git format-patch",
              "Write commits out as patch files"
            ]
          ],
          "subcommands": [
            [
              "git bundle create update.bundle main ^v1.2.0",
              "Bundle main's commits made since a tag"
            ],
            [
              "git fetch /tmp/update.bundle main:refs/remotes/bundle/main",
              "Fetch from a bundle on the isolated host"
            ],
            [
              "git archive --format=tar.gz --prefix=tools/ -o tools.tar.gz HEAD",
              "Export the files only"
            ],
            [
              "git format-patch -3 -o patches/",
              "Save the last 3 commits as patches"
            ],
            [
              "git apply --check patches/0001-fix.patch",
              "Test whether a patch applies, without changing anything"
            ],
            [
              "git am patches/*.patch",
              "Apply patches as commits"
            ]
          ],
          "tip": "A git bundle works like a remote, so history and tags survive the trip. Compare the sha256sum at both ends.",
          "tags": [
            "git",
            "bundle",
            "archive",
            "air-gapped",
            "offline",
            "patch",
            "format-patch"
          ]
        },
        {
          "id": "git-network-auth",
          "desc": "Work behind a proxy or internal CA, and debug connections",
          "cmd": "# Check that you can reach the remote and authenticate\ngit ls-remote origin HEAD\nssh -T git@github.com\n\n# Show what git is doing on the network\nGIT_TRACE=1 GIT_CURL_VERBOSE=1 git fetch\nGIT_SSH_COMMAND=\"ssh -v\" git fetch",
          "flags": [
            [
              "GIT_TRACE=1",
              "Print the commands git runs internally"
            ],
            [
              "GIT_CURL_VERBOSE=1",
              "Print HTTP request details"
            ],
            [
              "GIT_SSH_COMMAND",
              "Replace the ssh command git uses"
            ],
            [
              "http.proxy",
              "Send HTTPS traffic through a proxy"
            ],
            [
              "http.sslCAInfo",
              "Trust an internal certificate authority"
            ]
          ],
          "subcommands": [
            [
              "git config --global http.proxy http://proxy.example.com:3128",
              "Use a proxy"
            ],
            [
              "git config --global --unset http.proxy",
              "Stop using a proxy"
            ],
            [
              "git config --global http.sslCAInfo /etc/ssl/certs/internal-ca.pem",
              "Trust an internal CA"
            ],
            [
              "GIT_SSH_COMMAND=\"ssh -i ~/.ssh/deploy_key -o IdentitiesOnly=yes\" git pull",
              "Use a specific SSH key once"
            ],
            [
              "git config --global credential.helper 'cache --timeout=3600'",
              "Keep HTTPS credentials in memory for an hour"
            ]
          ],
          "tip": "GIT_CURL_VERBOSE output can include auth headers, so clean it before pasting it into a ticket.",
          "tags": [
            "git",
            "proxy",
            "ssl",
            "ca",
            "ssh",
            "trace",
            "debug",
            "credentials"
          ]
        },
        {
          "id": "git-common-errors",
          "desc": "Fix common error messages",
          "cmd": "# fatal: detected dubious ownership in repository\ngit config --global --add safe.directory /opt/tools",
          "flags": [
            [
              "dubious ownership",
              "The folder belongs to another user. Add it to safe.directory, or run git as the owner"
            ],
            [
              "non-fast-forward",
              "The remote has commits you don't. Run git pull --rebase, then push"
            ],
            [
              "detached HEAD",
              "You aren't on a branch. Save your work with git switch -c NAME"
            ],
            [
              "Permission denied (publickey)",
              "Your SSH key isn't loaded or authorised. Test with ssh -T git@github.com"
            ],
            [
              "SSL certificate problem",
              "Your host doesn't trust the server's CA. Set http.sslCAInfo"
            ],
            [
              "index.lock exists",
              "Another git process is running, or one crashed. Check before deleting the lock"
            ],
            [
              "refusing to merge unrelated histories",
              "The two repositories don't share a root commit"
            ]
          ],
          "subcommands": [
            [
              "pgrep -a git",
              "Check for a running git process before touching a lock file"
            ],
            [
              "rm .git/index.lock",
              "Remove a stale lock once no git process is running"
            ],
            [
              "git switch -c rescue-work",
              "Keep commits made on a detached HEAD"
            ],
            [
              "git fsck",
              "Check the repository for corruption"
            ],
            [
              "git count-objects -vH",
              "Show how much space the repository uses"
            ],
            [
              "git gc",
              "Compress and clean up the repository"
            ]
          ],
          "tip": "Don't set http.sslVerify false to get past certificate errors. Install the CA instead.",
          "tags": [
            "git",
            "errors",
            "safe.directory",
            "dubious-ownership",
            "detached-head",
            "index.lock",
            "troubleshooting"
          ]
        },
        {
          "id": "git-secret-removal",
          "desc": "Deal with a password or key that was committed",
          "cmd": "# 1. Rotate the credential first. It's exposed once pushed.\n# 2. Rewrite history (needs the git-filter-repo package) in a fresh clone\ngit clone --mirror git@github.com:org/repo.git\ncd repo.git\ngit filter-repo --path config/secrets.env --invert-paths\n# 3. git filter-repo removes origin, so add it back, then coordinate the force push\ngit remote add origin git@github.com:org/repo.git\ngit push --force --mirror origin",
          "flags": [
            [
              "--path FILE",
              "Select a file"
            ],
            [
              "--invert-paths",
              "Remove the selected paths from every commit"
            ],
            [
              "--replace-text FILE",
              "Replace strings listed in a file throughout history"
            ],
            [
              "--mirror",
              "Clone or push every branch and tag exactly"
            ]
          ],
          "subcommands": [
            [
              "git log --all --oneline -- config/secrets.env",
              "See which commits contain the file"
            ],
            [
              "git log --all -p -S'SEARCH_TEXT'",
              "Find a leaked string anywhere in history"
            ],
            [
              "git filter-repo --replace-text replacements.txt",
              "Scrub a string everywhere"
            ]
          ],
          "tip": "Rewriting history breaks everyone's clones and doesn't reach copies already made. Rotating the secret is the real fix.",
          "tags": [
            "git",
            "secrets",
            "filter-repo",
            "history",
            "rewrite",
            "credentials",
            "leak"
          ]
        }
      ]
    }
  ]
},

  // 14. MARKDOWN
  {
  "key": "markdown",
  "file": "markdown.html",
  "js": "markdown.js",
  "varName": "MARKDOWN_CHEAT_SHEET_DATA",
  "name": "Markdown",
  "title": "Markdown & GitHub Flavored Markdown",
  "subtitle": "Headings, lists, links, code blocks, tables, GitHub alerts & ticket templates",
  "pill": "CommonMark / GFM",
  "prompt": "#",
  "cursor": "_",
  "sections": [
    {
      "id": "md-text",
      "badge": "text",
      "title": "Headings, Text & Paragraphs",
      "subtitle": "Headings, emphasis, line breaks, quotes, rules & escaping",
      "commands": [
        {
          "id": "md-headings",
          "desc": "Headings from level 1 to 6. Put a space after the # marks",
          "cmd": "# Node gpu-node-07 triage\n## Symptoms\n### GPU 3\n#### Xid 79\n##### Notes\n###### Footnote level",
          "flags": [
            [
              "# Title",
              "Level 1. Use one per document, as the title"
            ],
            [
              "## Section",
              "Level 2. GitHub draws a line under levels 1 and 2"
            ],
            [
              "#Title",
              "No space means plain text in CommonMark, not a heading"
            ],
            [
              "Title\\n=====",
              "Older underline style for level 1 (--- under the text gives level 2)"
            ]
          ],
          "subcommands": [
            [
              "## Step 1: Drain the node {#drain}",
              "Custom anchor id (Pandoc and some renderers, not GitHub)"
            ],
            [
              "[Jump to Symptoms](#symptoms)",
              "Link to a heading: lowercase, spaces become -, punctuation removed"
            ]
          ],
          "tip": "Leave a blank line before and after each heading so every renderer sees it.",
          "tags": [
            "markdown",
            "headings",
            "h1",
            "h2",
            "title",
            "anchor"
          ]
        },
        {
          "id": "md-emphasis",
          "desc": "Bold, italic, strikethrough and inline code",
          "cmd": "**bold**  __also bold__\n*italic*  _also italic_\n***bold and italic***\n~~strikethrough~~\n`inline code`\n<kbd>Ctrl</kbd>+<kbd>C</kbd>",
          "flags": [
            [
              "**text**",
              "Bold. Prefer ** over __, because _ inside words is ignored"
            ],
            [
              "*text*",
              "Italic"
            ],
            [
              "~~text~~",
              "Strikethrough (GitHub, not plain CommonMark)"
            ],
            [
              "`text`",
              "Inline code. Nothing inside is formatted"
            ],
            [
              "<kbd>Key</kbd>",
              "Keyboard key style, using HTML that GitHub allows"
            ]
          ],
          "subcommands": [
            [
              "``code with a ` backtick``",
              "Use two backticks to wrap code that contains one"
            ],
            [
              "<sub>2</sub> <sup>TM</sup>",
              "Subscript and superscript with HTML"
            ],
            [
              "<mark>highlighted</mark>",
              "Highlight text (rendered on GitHub)"
            ]
          ],
          "tip": "Put serial numbers, BDFs and hostnames in `backticks` so nothing turns them into links or formatting.",
          "tags": [
            "markdown",
            "bold",
            "italic",
            "strikethrough",
            "emphasis",
            "kbd",
            "inline-code"
          ]
        },
        {
          "id": "md-paragraphs",
          "desc": "Paragraphs, line breaks, block quotes and horizontal rules",
          "cmd": "First paragraph line one\nstill the same paragraph.\n\nNew paragraph after a blank line.\n\nLine one\\\nLine two (backslash break)\n\n> Quoted text from the vendor\n>\n> > Nested quote\n\n---",
          "flags": [
            [
              "Blank line",
              "Starts a new paragraph. A single newline joins the lines"
            ],
            [
              "Line\\\\ at end",
              "A backslash at the end of a line forces a line break"
            ],
            [
              "Two trailing spaces",
              "Also forces a break, but editors often strip them"
            ],
            [
              "> text",
              "Block quote. Add more > for nesting"
            ],
            [
              "--- or *** or ___",
              "Horizontal rule. Put a blank line above ---, or it makes the text above a heading"
            ]
          ],
          "subcommands": [
            [
              "<br>",
              "HTML line break, useful inside table cells"
            ],
            [
              "&nbsp;",
              "Non-breaking space"
            ]
          ],
          "tip": "Use a backslash line break rather than trailing spaces. You can see it, and editors leave it alone.",
          "tags": [
            "markdown",
            "paragraph",
            "line-break",
            "blockquote",
            "hr",
            "rule"
          ]
        },
        {
          "id": "md-escaping",
          "desc": "Show special characters literally with a backslash",
          "cmd": "\\*not italic\\*\n\\# not a heading\n1986\\. A great year\nC:\\\\Users\\\\admin\nfile\\_name\\_v2.txt\n\\| pipe inside a table",
          "flags": [
            [
              "\\\\ ` * _ { } [ ] < > ( ) # + - . ! |",
              "Characters you can escape with a backslash"
            ],
            [
              "1986\\.",
              "Stops a number followed by a period from starting a list"
            ],
            [
              "&lt; &gt; &amp;",
              "HTML entities for <, > and &"
            ]
          ],
          "subcommands": [
            [
              "`*args`",
              "Inline code is the easiest escape: everything inside is literal"
            ],
            [
              "<!-- hidden comment -->",
              "HTML comment, left out of the rendered page"
            ]
          ],
          "tip": "Paths, regexes and globs belong in backticks. Escaping each character one by one is error prone.",
          "tags": [
            "markdown",
            "escape",
            "backslash",
            "special-characters",
            "comment",
            "entities"
          ]
        }
      ]
    },
    {
      "id": "md-lists",
      "badge": "lists",
      "title": "Lists & Task Lists",
      "subtitle": "Bullets, numbered steps, nesting, checkboxes & content inside list items",
      "commands": [
        {
          "id": "md-bullets",
          "desc": "Bullet lists and nested lists",
          "cmd": "- Check SEL\n- Check dmesg\n  - Look for Xid errors\n  - Look for AER errors\n- Check NVLink\n\n* Asterisks work too\n+ So do plus signs",
          "flags": [
            [
              "- item",
              "Bullet. Use one marker style per list"
            ],
            [
              "  - nested",
              "Indent to line up with the text of the parent item (2 spaces after -)"
            ],
            [
              "Blank line between items",
              "Makes a loose list: items are spaced as paragraphs"
            ]
          ],
          "subcommands": [
            [
              "- item\\n\\n<!-- end list -->\\n\\n- new list",
              "A comment ends one list so the next starts fresh"
            ]
          ],
          "tip": "Changing the marker from - to * in the middle starts a new list.",
          "tags": [
            "markdown",
            "lists",
            "bullets",
            "unordered",
            "nested"
          ]
        },
        {
          "id": "md-numbered",
          "desc": "Numbered steps, with code and notes inside a step",
          "cmd": "1. Drain the node in Slurm\n2. Run the health check:\n\n   ```bash\n   dcgmi health -c\n   ```\n\n3. Record the result\n   > Paste the output into the ticket\n\n1. Numbers can all be 1.\n1. The renderer counts for you.",
          "flags": [
            [
              "1. item",
              "Numbered item. The first number sets the start"
            ],
            [
              "5. item",
              "A list that starts at 5 renders as 5, 6, 7"
            ],
            [
              "1) item",
              "A parenthesis also works in CommonMark"
            ],
            [
              "3 spaces of indent",
              "Lines up content with the text after \"1. \", so it stays inside the step"
            ]
          ],
          "subcommands": [
            [
              "1. Step\\n   - sub-bullet",
              "Bullets inside a numbered step"
            ],
            [
              "10. Step",
              "Two-digit numbers need 4 spaces of indent for content below"
            ]
          ],
          "tip": "Indent code blocks inside a numbered step, or the numbering restarts at 1 after the block.",
          "tags": [
            "markdown",
            "lists",
            "numbered",
            "ordered",
            "steps",
            "runbook"
          ]
        },
        {
          "id": "md-tasks",
          "desc": "Task lists with checkboxes",
          "cmd": "- [x] Drain node in Slurm\n- [x] Capture nvidia-smi -q\n- [ ] Reseat GPU 3\n- [ ] Run dcgmi diag -r 3\n  - [ ] Attach results to the RMA",
          "flags": [
            [
              "- [ ] item",
              "Open checkbox"
            ],
            [
              "- [x] item",
              "Checked box"
            ],
            [
              "Space inside [ ]",
              "Required. [] without a space is not a checkbox"
            ]
          ],
          "subcommands": [
            [
              "grep -c '\\- \\[ \\]' summary.md",
              "Count open tasks in a file"
            ],
            [
              "grep -n '\\- \\[ \\]' cases/*/summary.md",
              "List open tasks across every case"
            ]
          ],
          "tip": "On GitHub issues and PRs you can tick the boxes in the rendered page, and the counts show in issue lists.",
          "tags": [
            "markdown",
            "tasks",
            "checklist",
            "checkbox",
            "todo",
            "gfm"
          ]
        }
      ]
    },
    {
      "id": "md-links",
      "badge": "links",
      "title": "Links & Images",
      "subtitle": "Inline links, reference links, anchors, autolinks & images",
      "commands": [
        {
          "id": "md-links-inline",
          "desc": "Inline links, links to headings and links to other files",
          "cmd": "[NVIDIA Xid docs](https://docs.nvidia.com/deploy/xid-errors/)\n[With a title](https://example.com \"Hover text\")\n[Jump to Root Cause](#root-cause)\n[GPU playbook](../docs/playbooks/gpu-nvlink.md)\n[Line 42](scripts/collect.sh#L42)\n<https://example.com>",
          "flags": [
            [
              "[text](url)",
              "Inline link"
            ],
            [
              "[text](url \"title\")",
              "Adds hover text"
            ],
            [
              "[text](#heading-id)",
              "Link to a heading in the same file"
            ],
            [
              "[text](path/file.md)",
              "Relative link to another file in the repository"
            ],
            [
              "<url>",
              "Autolink: shows the URL as a link"
            ]
          ],
          "subcommands": [
            [
              "[text](<path with spaces.md>)",
              "Angle brackets allow spaces in the path"
            ],
            [
              "[text](path%20with%20spaces.md)",
              "Or encode spaces as %20"
            ],
            [
              "https://example.com",
              "GitHub links bare URLs; plain CommonMark doesn't"
            ]
          ],
          "tip": "Heading anchors are lowercase with spaces as -, so \"## Root Cause\" becomes #root-cause.",
          "tags": [
            "markdown",
            "links",
            "url",
            "anchor",
            "relative",
            "autolink"
          ]
        },
        {
          "id": "md-links-reference",
          "desc": "Reference links keep long URLs out of your sentences",
          "cmd": "See the [Xid list][xid] and the [DCGM guide][dcgm].\nThe [RMA portal] is linked below.\n\n[xid]: https://docs.nvidia.com/deploy/xid-errors/\n[dcgm]: https://docs.nvidia.com/datacenter/dcgm/latest/\n[RMA portal]: https://example.com/rma",
          "flags": [
            [
              "[text][label]",
              "Uses the URL defined for label"
            ],
            [
              "[label]",
              "Short form when the text and label match"
            ],
            [
              "[label]: url",
              "Definition. Put these at the bottom; they don't render"
            ],
            [
              "Labels are case-insensitive",
              "[XID] and [xid] are the same link"
            ]
          ],
          "subcommands": [
            [
              "[label]: url \"Title\"",
              "Definition with hover text"
            ]
          ],
          "tip": "Reference links make tables and lists readable in the raw file.",
          "tags": [
            "markdown",
            "links",
            "reference",
            "footnote-style",
            "url"
          ]
        },
        {
          "id": "md-images",
          "desc": "Images, sized images and clickable images",
          "cmd": "![Rack 12 front view](images/rack12-front.jpg)\n![Link LED amber](images/osfp-led.png \"Cage 4\")\n<img src=\"images/riser.jpg\" alt=\"PCIe riser\" width=\"400\">\n[![Status](badge.svg)](https://example.com/status)",
          "flags": [
            [
              "![alt](path)",
              "Image. The alt text is shown if the image can't load"
            ],
            [
              "<img width=\"400\">",
              "Use HTML to set a size"
            ],
            [
              "[![alt](img)](url)",
              "An image that links somewhere"
            ]
          ],
          "subcommands": [
            [
              "![Photo](https://example.com/photo.jpg)",
              "Remote image"
            ],
            [
              "<picture><source media=\"(prefers-color-scheme: dark)\" srcset=\"dark.png\"><img src=\"light.png\" alt=\"Diagram\"></picture>",
              "Different images for light and dark themes on GitHub"
            ]
          ],
          "tip": "Keep photos in an images/ folder next to the file and use relative paths, so they work offline and in clones.",
          "tags": [
            "markdown",
            "images",
            "img",
            "photos",
            "alt",
            "size"
          ]
        }
      ]
    },
    {
      "id": "md-code",
      "badge": "code",
      "title": "Code Blocks",
      "subtitle": "Fenced blocks, syntax highlighting, diffs, log output & nested fences",
      "commands": [
        {
          "id": "md-fenced",
          "desc": "Fenced code block with a language for highlighting",
          "cmd": "```bash\nnvidia-smi -q -d ECC\ndcgmi health -c\n```\n\n```json\n{ \"gpu\": 3, \"xid\": 79 }\n```\n\n```text\nPlain output, no highlighting\n```",
          "flags": [
            [
              "```lang",
              "Opens a block. The language word sets highlighting"
            ],
            [
              "bash sh console",
              "Shell scripts and terminal sessions"
            ],
            [
              "json yaml toml ini",
              "Config and data formats"
            ],
            [
              "python lua powershell sql",
              "Scripting languages"
            ],
            [
              "text or plaintext",
              "No highlighting, best for raw logs"
            ]
          ],
          "subcommands": [
            [
              "~~~bash",
              "Tildes work as fences too"
            ],
            [
              "    indented code",
              "Four spaces of indent also make a code block, but with no language"
            ]
          ],
          "tip": "Always add a language, even text. It keeps highlighting predictable and tells readers what they're looking at.",
          "tags": [
            "markdown",
            "code",
            "fenced",
            "syntax",
            "highlighting",
            "bash"
          ]
        },
        {
          "id": "md-diff-logs",
          "desc": "Show changes and log output",
          "cmd": "```diff\n- MTU=1500\n+ MTU=9000\n```\n\n```console\n$ ibstat mlx5_0 | grep State\n        State: Active\n        Physical state: LinkUp\n```",
          "flags": [
            [
              "```diff",
              "Lines starting with - are red, + are green"
            ],
            [
              "```console",
              "Terminal session: the $ prompt line is styled apart from the output"
            ],
            [
              "```log",
              "Highlights timestamps and levels on some renderers"
            ]
          ],
          "subcommands": [
            [
              "git diff > change.diff",
              "Save a diff to paste into a diff block"
            ]
          ],
          "tip": "Paste raw command output into text or console blocks so wide columns and spacing stay intact.",
          "tags": [
            "markdown",
            "code",
            "diff",
            "console",
            "logs",
            "output"
          ]
        },
        {
          "id": "md-nested-fences",
          "desc": "Show a code block inside a code block",
          "cmd": "````markdown\nUse this in the ticket:\n\n```bash\nipmitool sel elist\n```\n````",
          "flags": [
            [
              "````",
              "Four backticks wrap content that contains three"
            ],
            [
              "~~~ around ```",
              "Or mix tildes and backticks"
            ]
          ],
          "subcommands": [
            [
              "<details><summary>Full dmesg</summary>\\n\\n```text\\n...\\n```\\n\\n</details>",
              "Collapse a long block (see the GitHub section)"
            ]
          ],
          "tip": "The closing fence must use the same character and at least as many as the opening one.",
          "tags": [
            "markdown",
            "code",
            "nested",
            "fence",
            "backticks"
          ]
        }
      ]
    },
    {
      "id": "md-tables",
      "badge": "tables",
      "title": "Tables",
      "subtitle": "Pipe tables, alignment, special characters & building tables from command output",
      "commands": [
        {
          "id": "md-table-basic",
          "desc": "Table with a header row and column alignment",
          "cmd": "| GPU | BDF          | Temp | Status   |\n|:----|:-------------|-----:|:--------:|\n| 0   | 0000:18:00.0 |  41C | OK       |\n| 3   | 0000:8a:00.0 |  88C | **HOT**  |",
          "flags": [
            [
              ":---",
              "Left align"
            ],
            [
              "---:",
              "Right align, best for numbers"
            ],
            [
              ":---:",
              "Center"
            ],
            [
              "Header separator row",
              "Required. Each column needs at least three dashes"
            ],
            [
              "Outer pipes",
              "Optional, but they make the raw text easier to read"
            ]
          ],
          "subcommands": [
            [
              "| a \\| b |",
              "Escape a pipe inside a cell"
            ],
            [
              "| line one<br>line two |",
              "Line break inside a cell"
            ],
            [
              "| `code` | **bold** |",
              "Inline formatting works in cells; lists and code blocks don't"
            ]
          ],
          "tip": "Columns don't need to line up in the raw file. Your editor's formatter or prettier can align them.",
          "tags": [
            "markdown",
            "tables",
            "alignment",
            "columns",
            "gfm"
          ]
        },
        {
          "id": "md-table-from-cli",
          "desc": "Turn command output into a Markdown table",
          "cmd": "nvidia-smi --query-gpu=index,pci.bus_id,temperature.gpu,serial --format=csv,noheader \\\n  | awk -F', ' 'BEGIN { print \"| GPU | BDF | Temp | Serial |\"; print \"|---|---|---:|---|\" }\n               { printf \"| %s | %s | %sC | %s |\\n\", $1, $2, $3, $4 }'",
          "flags": [
            [
              "--format=csv,noheader",
              "Comma-separated output without a header line"
            ],
            [
              "awk -F', '",
              "Split fields on a comma and space"
            ],
            [
              "BEGIN { print ... }",
              "Print the header and separator rows once"
            ]
          ],
          "subcommands": [
            [
              "lsblk -o NAME,SIZE,MODEL,SERIAL -dn | awk '{ printf \"| %s | %s | %s | %s |\\n\", $1, $2, $3, $4 }'",
              "Disk inventory rows"
            ],
            [
              "column -t -s, data.csv",
              "Align a CSV for a plain text block instead"
            ],
            [
              "pandoc -f csv -t gfm data.csv",
              "Convert a CSV straight to a Markdown table"
            ]
          ],
          "tip": "Fields that can contain spaces, like model names, should come last or be quoted in the CSV.",
          "tags": [
            "markdown",
            "tables",
            "awk",
            "nvidia-smi",
            "csv",
            "pandoc",
            "inventory"
          ]
        }
      ]
    },
    {
      "id": "md-gfm",
      "badge": "gfm",
      "title": "GitHub Extensions",
      "subtitle": "Alerts, collapsible sections, footnotes, mentions, diagrams & math",
      "commands": [
        {
          "id": "md-alerts",
          "desc": "GitHub alert boxes for notes and warnings",
          "cmd": "> [!NOTE]\n> GPU 3 was reseated on 2026-11-03.\n\n> [!WARNING]\n> Drain the node before running dcgmi diag -r 3.\n\n> [!CAUTION]\n> nvme format erases the drive.",
          "flags": [
            [
              "[!NOTE]",
              "Blue: useful background"
            ],
            [
              "[!TIP]",
              "Green: a better way to do something"
            ],
            [
              "[!IMPORTANT]",
              "Purple: needed to succeed"
            ],
            [
              "[!WARNING]",
              "Yellow: needs attention right away"
            ],
            [
              "[!CAUTION]",
              "Red: risk of data loss or outage"
            ]
          ],
          "subcommands": [
            [
              "> **Note:** text",
              "Fallback that reads well on renderers without alerts"
            ]
          ],
          "tip": "Alerts render on GitHub and some editors. Elsewhere they show as plain block quotes.",
          "tags": [
            "markdown",
            "gfm",
            "alerts",
            "callout",
            "note",
            "warning",
            "admonition"
          ]
        },
        {
          "id": "md-details",
          "desc": "Collapsible section for long logs",
          "cmd": "<details>\n<summary>Full nvidia-smi -q output</summary>\n\n```text\n==============NVSMI LOG==============\n...\n```\n\n</details>",
          "flags": [
            [
              "<details>",
              "Collapsed by default"
            ],
            [
              "<details open>",
              "Starts expanded"
            ],
            [
              "<summary>",
              "The clickable title line"
            ],
            [
              "Blank lines inside",
              "Needed so the Markdown inside renders"
            ]
          ],
          "subcommands": [],
          "tip": "Keep the key evidence visible and fold the full logs, so reviewers see the cause first.",
          "tags": [
            "markdown",
            "gfm",
            "details",
            "summary",
            "collapse",
            "html",
            "logs"
          ]
        },
        {
          "id": "md-footnotes-mentions",
          "desc": "Footnotes, mentions and issue references",
          "cmd": "Row remap failed on GPU 3.[^1]\n\n[^1]: See nvidia-smi -q -d ROW_REMAPPER output in logs/.\n\nFixed in org/repo#42 and abc1234.\nClosing: Fixes #57",
          "flags": [
            [
              "[^1] and [^1]: text",
              "Footnote marker and its text, listed at the bottom"
            ],
            [
              "#123",
              "Links an issue or PR in the same repository"
            ],
            [
              "org/repo#123",
              "Links an issue in another repository"
            ],
            [
              "abc1234",
              "A commit hash becomes a link"
            ],
            [
              "Fixes #57",
              "In a PR, closes the issue when merged"
            ]
          ],
          "subcommands": [
            [
              "`@name`",
              "Put a name in backticks to mention it without notifying anyone"
            ]
          ],
          "tip": "On GitHub, a bare @name notifies that person, so only write it when you mean to.",
          "tags": [
            "markdown",
            "gfm",
            "footnotes",
            "mentions",
            "issues",
            "references"
          ]
        },
        {
          "id": "md-mermaid-math",
          "desc": "Diagrams with Mermaid and math with LaTeX",
          "cmd": "```mermaid\nflowchart LR\n  GPU3[GPU 3] -->|NVLink| NVS[NVSwitch 1]\n  NVS --> GPU5[GPU 5]\n```\n\nInline math: $BW = lanes \\times rate$\n\n$$\nBER = \\frac{errors}{bits}\n$$",
          "flags": [
            [
              "```mermaid",
              "Flowcharts, sequence diagrams and more, drawn from text"
            ],
            [
              "flowchart LR / TD",
              "Left-to-right or top-down layout"
            ],
            [
              "A -->|label| B",
              "Arrow with a label"
            ],
            [
              "$...$ and $$...$$",
              "Inline and block math on GitHub"
            ]
          ],
          "subcommands": [
            [
              "sequenceDiagram",
              "Mermaid sequence diagram, good for request flows"
            ]
          ],
          "tip": "Mermaid and math need a renderer that supports them. GitHub and Obsidian do; plain viewers show the source.",
          "tags": [
            "markdown",
            "gfm",
            "mermaid",
            "diagram",
            "math",
            "latex"
          ]
        }
      ]
    },
    {
      "id": "md-templates",
      "badge": "tmpl",
      "title": "Ticket & Runbook Templates",
      "subtitle": "Ready-to-fill case summaries, runbooks and front matter",
      "commands": [
        {
          "id": "md-case-summary",
          "desc": "Case summary.md skeleton for a hardware incident",
          "cmd": "# gpu-node-07: GPU 3 Xid 79\n\n| Field    | Value |\n|----------|-------|\n| Ticket   | DC-1234 |\n| Severity | High |\n| Node     | `gpu-node-07` (Rack 12, U20) |\n| Status   | Drained |\n\n## Symptoms\n\n## Timeline\n- 2026-11-03 09:12 Xid 79 on GPU 3\n\n## Evidence\n\n## Root Cause\n\n## Next Actions\n- [ ] Reseat GPU 3\n- [ ] Open RMA",
          "flags": [
            [
              "Title line",
              "Host and symptom, so the case is clear in a file list"
            ],
            [
              "Field table",
              "Quick facts at the top for whoever picks up the ticket"
            ],
            [
              "Timeline",
              "Timestamped entries, newest at the bottom"
            ],
            [
              "Next Actions",
              "A task list that shows what's still open"
            ]
          ],
          "subcommands": [
            [
              "mkdir -p cases/DC-1234/logs && $EDITOR cases/DC-1234/summary.md",
              "Start a new case folder"
            ]
          ],
          "tip": "Never paste passwords or tokens into a case file. Strip them from captured output first.",
          "tags": [
            "markdown",
            "template",
            "case",
            "incident",
            "summary",
            "rma",
            "ticket"
          ]
        },
        {
          "id": "md-runbook",
          "desc": "Runbook skeleton with prerequisites, steps and rollback",
          "cmd": "# Replace a failed NVMe drive\n\n> [!WARNING]\n> Confirm the drive serial before pulling anything.\n\n## Prerequisites\n- Node drained\n- Replacement drive on hand\n\n## Steps\n1. Identify the drive:\n\n   ```bash\n   nvme list\n   ```\n\n2. Light the bay LED.\n3. Swap the drive.\n\n## Verify\n\n## Rollback",
          "flags": [
            [
              "Warning at the top",
              "Puts the risk where nobody can miss it"
            ],
            [
              "Numbered steps",
              "Readers can say which step failed"
            ],
            [
              "Verify and Rollback",
              "How to confirm success and how to back out"
            ]
          ],
          "subcommands": [],
          "tip": "Write each step as a single action, with its command in a code block indented under it.",
          "tags": [
            "markdown",
            "template",
            "runbook",
            "procedure",
            "sop",
            "steps"
          ]
        },
        {
          "id": "md-front-matter",
          "desc": "YAML front matter for static sites and note apps",
          "cmd": "---\ntitle: Replace a failed NVMe drive\nauthor: dc-ops\ndate: 2026-11-03\ntags: [nvme, storage, runbook]\n---\n\n# Replace a failed NVMe drive",
          "flags": [
            [
              "--- ... ---",
              "YAML block. Must be the very first thing in the file"
            ],
            [
              "title, date, tags",
              "Common fields read by Hugo, Jekyll, MkDocs, Obsidian and Pandoc"
            ]
          ],
          "subcommands": [
            [
              "+++ ... +++",
              "TOML front matter (Hugo)"
            ]
          ],
          "tip": "GitHub shows front matter as a table at the top of the rendered file.",
          "tags": [
            "markdown",
            "front-matter",
            "yaml",
            "metadata",
            "hugo",
            "jekyll",
            "obsidian"
          ]
        }
      ]
    },
    {
      "id": "md-tools",
      "badge": "tools",
      "title": "Markdown Tools",
      "subtitle": "Preview in the terminal, lint, format, convert to other formats & build tables of contents",
      "commands": [
        {
          "id": "md-preview",
          "desc": "Read rendered Markdown in the terminal",
          "cmd": "glow README.md\nglow -p cases/DC-1234/summary.md\nmdcat README.md",
          "flags": [
            [
              "glow FILE",
              "Render Markdown with color in the terminal"
            ],
            [
              "glow -p",
              "Page through long files"
            ],
            [
              "glow -w 100",
              "Wrap at 100 columns"
            ],
            [
              "mdcat FILE",
              "Alternative renderer that can show images in some terminals"
            ]
          ],
          "subcommands": [
            [
              "glow",
              "Browse every Markdown file in the current folder"
            ],
            [
              "pandoc README.md | lynx -stdin",
              "Fallback with tools found on most servers"
            ]
          ],
          "tip": "Neovim users can install render-markdown.nvim to see headings and tables styled while editing.",
          "tags": [
            "markdown",
            "glow",
            "mdcat",
            "preview",
            "terminal",
            "render"
          ]
        },
        {
          "id": "md-lint-format",
          "desc": "Check and format Markdown files",
          "cmd": "markdownlint-cli2 \"**/*.md\"\nmarkdownlint-cli2 --fix \"docs/**/*.md\"\nprettier --write \"**/*.md\"",
          "flags": [
            [
              "markdownlint-cli2 GLOB",
              "Report problems such as skipped heading levels and bad list indents"
            ],
            [
              "--fix",
              "Fix the problems it can"
            ],
            [
              ".markdownlint.jsonc",
              "Turn rules on or off, for example { \"MD013\": false } to allow long lines"
            ],
            [
              "prettier --write",
              "Reformat files: aligns tables and normalizes list markers"
            ]
          ],
          "subcommands": [
            [
              "prettier --check \"**/*.md\"",
              "Fail in CI if files need formatting"
            ],
            [
              "npx markdown-link-check README.md",
              "Find broken links"
            ]
          ],
          "tip": "MD013 (line length) is the rule most teams turn off first.",
          "tags": [
            "markdown",
            "lint",
            "markdownlint",
            "prettier",
            "format",
            "ci"
          ]
        },
        {
          "id": "md-pandoc",
          "desc": "Convert Markdown to HTML, Word or PDF with Pandoc",
          "cmd": "pandoc summary.md -o summary.html --standalone\npandoc summary.md -o summary.docx\npandoc summary.md -o summary.pdf\npandoc report.docx -t gfm -o report.md",
          "flags": [
            [
              "-o FILE",
              "Output file. The extension sets the format"
            ],
            [
              "--standalone / -s",
              "Full HTML page with head and body"
            ],
            [
              "-t gfm",
              "Write GitHub Flavored Markdown"
            ],
            [
              "--toc",
              "Add a table of contents"
            ],
            [
              "--metadata title=\"...\"",
              "Set the document title"
            ]
          ],
          "subcommands": [
            [
              "pandoc -s --embed-resources summary.md -o summary.html",
              "Single HTML file with images built in"
            ],
            [
              "pandoc page.html -t gfm -o page.md",
              "Convert a web page or wiki export to Markdown"
            ],
            [
              "pandoc summary.md -t jira",
              "Convert to Jira wiki markup for older Jira editors"
            ]
          ],
          "tip": "PDF output needs a LaTeX engine. On Ubuntu, install texlive-latex-recommended, or write HTML and print it to PDF.",
          "tags": [
            "markdown",
            "pandoc",
            "convert",
            "html",
            "docx",
            "pdf",
            "jira"
          ]
        },
        {
          "id": "md-toc-grep",
          "desc": "List headings and build a table of contents",
          "cmd": "grep -n '^#\\{1,6\\} ' README.md\ngrep -h '^## ' docs/playbooks/*.md\npandoc -s --toc README.md -o README.html",
          "flags": [
            [
              "grep -n '^#\\{1,6\\} '",
              "Every heading with its line number"
            ],
            [
              "--toc --toc-depth=2",
              "Pandoc table of contents down to level 2"
            ]
          ],
          "subcommands": [
            [
              "grep '^## ' README.md | sed -E 's/^## (.*)/- [\\1](#\\1)/'",
              "Rough TOC list to paste (fix the anchors to lowercase-with-dashes)"
            ],
            [
              "npx markdown-toc -i README.md",
              "Insert a TOC between <!-- toc --> markers"
            ]
          ],
          "tip": "GitHub builds a TOC for you: use the outline button at the top of any rendered Markdown file.",
          "tags": [
            "markdown",
            "toc",
            "headings",
            "grep",
            "pandoc",
            "outline"
          ]
        }
      ]
    }
  ]
}
];

console.log('Generating 14 individual scripting cheat sheet files with complete learner foundations...');

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
                                    <a href="json.html" class="dropdown-item" role="menuitem">📋 JSON &amp; jq</a>
                  <a href="yaml.html" class="dropdown-item" role="menuitem">📄 YAML &amp; yq</a>
                  <a href="toml.html" class="dropdown-item" role="menuitem">⚙️ TOML</a>
                  <div class="dropdown-divider"></div>
                  <a href="regex.html" class="dropdown-item" role="menuitem">🔤 Regex</a>
                  <a href="awk-sed.html" class="dropdown-item" role="menuitem">✂️ AWK &amp; Sed</a>
                  <a href="sql.html" class="dropdown-item" role="menuitem">🗄️ SQL &amp; SQLite</a>
                  <a href="git.html" class="dropdown-item" role="menuitem">🌿 Git</a>
                  <a href="markdown.html" class="dropdown-item" role="menuitem">📝 Markdown</a>
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
  <script src="manuals-data.js"></script>
  <script src="manuals-ui.js"></script>
  <script src="common.js"></script>
  <script src="${lang.js}"></script>
</body>
</html>`;
}

// Write all 14 JS and HTML files
for (const lang of SCRIPTING_LANGUAGES) {
  const jsPath = path.join(__dirname, lang.js);
  const htmlPath = path.join(__dirname, lang.file);
  fs.writeFileSync(jsPath, generateJsFile(lang), 'utf8');
  if (!fs.existsSync(htmlPath)) fs.writeFileSync(htmlPath, generateHtmlFile(lang), 'utf8');
  console.log(`Created ${lang.file} and ${lang.js}`);
}

console.log('All 14 scripting language sheets generated successfully.');
