const SCRIPTING_DATA = [
  {
    "id": "shell-script",
    "badge": "bash",
    "title": "Bash & POSIX Shell Scripting",
    "subtitle": "Strict mode, parameter expansion, traps, arrays, heredocs & safe subprocess execution",
    "commands": [
      {
        "id": "bash-strict-mode-boilerplate",
        "mode": "BASH",
        "modeClass": "mode-n",
        "desc": "Strict mode header with safe errexit, nounset, pipefail and automatic cleanup trap",
        "cmd": "set -euo pipefail\nIFS=$'\\n\\t'\nTMPDIR=$(mktemp -d) && trap 'rm -rf \"$TMPDIR\"' EXIT",
        "flags": [
          [
            "set -e",
            "Exit immediately if any command returns a non-zero exit status"
          ],
          [
            "set -u",
            "Treat unset variables and parameters as an error when expanding"
          ],
          [
            "set -o pipefail",
            "Return value of a pipeline is the status of the last command to exit with non-zero"
          ],
          [
            "trap ... EXIT",
            "Guarantees temporary directory cleanup even if script is killed by SIGINT/SIGTERM"
          ]
        ],
        "subcommands": [
          [
            "SCRIPT_DIR=\"$(cd \"$(dirname \"${BASH_SOURCE[0]}\")\" && pwd)\"",
            "Resolve absolute directory path of the running script"
          ],
          [
            ": \"${TARGET_VAR:?Target variable must be set}\"",
            "Fail with descriptive error message if variable is unset or null"
          ],
          [
            "exec 3>&1 4>&2",
            "Save original stdout/stderr descriptors before redirection"
          ]
        ],
        "tip": "Standard production bash preamble",
        "tags": [
          "bash",
          "strict-mode",
          "pipefail",
          "trap",
          "boilerplate",
          "errexit"
        ]
      },
      {
        "id": "bash-parameter-expansion",
        "mode": "BASH",
        "modeClass": "mode-n",
        "desc": "Parameter expansion recipes: defaults, string slicing, search/replace, and case modification",
        "cmd": "echo \"${VAR:-default_val}\" | echo \"${FILENAME%.*}\" | echo \"${PATH//:/\\n}\"",
        "flags": [
          [
            "${VAR:-default}",
            "Use default if VAR is unset or null (does not assign)"
          ],
          [
            "${VAR:=default}",
            "Assign default to VAR if unset or null"
          ],
          [
            "${VAR#prefix} / ${VAR##*.}",
            "Trim shortest (#) or longest (##) prefix match (e.g. extension)"
          ],
          [
            "${VAR%suffix} / ${VAR%%/*}",
            "Trim shortest (%) or longest (%%) suffix match"
          ],
          [
            "${VAR//find/replace}",
            "Replace all occurrences of substring with replacement"
          ],
          [
            "${VAR^^} / ${VAR,,}",
            "Convert entire string to uppercase (^^) or lowercase (,,)"
          ]
        ],
        "subcommands": [
          [
            "for f in *.tar.gz; do echo \"${f%%.tar.gz}\"; done",
            "Strip double extensions cleanly"
          ],
          [
            "${VAR:0:8}",
            "Extract substring by offset and length (first 8 characters)"
          ],
          [
            "${#VAR}",
            "Return character length of string variable"
          ]
        ],
        "tip": "Avoids slow subshell spawning with sed/cut",
        "tags": [
          "bash",
          "parameter-expansion",
          "string",
          "defaults",
          "trim",
          "extension"
        ]
      },
      {
        "id": "bash-arrays-associative",
        "mode": "BASH",
        "modeClass": "mode-n",
        "desc": "Indexed arrays, associative key-value maps (hash tables), slicing & length operations",
        "cmd": "declare -A SERVERS=([node1]=\"10.0.0.1\" [node2]=\"10.0.0.2\") && for k in \"${!SERVERS[@]}\"; do echo \"$k -> ${SERVERS[$k]}\"; done",
        "flags": [
          [
            "declare -a arr=()",
            "Explicitly declare indexed array"
          ],
          [
            "declare -A map=()",
            "Declare associative array / key-value map (requires Bash 4+)"
          ],
          [
            "\"${arr[@]}\"",
            "Expands each element as a separate quoted word"
          ],
          [
            "\"${!arr[@]}\"",
            "Expands all indices or keys of the array"
          ],
          [
            "${#arr[@]}",
            "Returns total count of elements in the array"
          ]
        ],
        "subcommands": [
          [
            "mapfile -t LINES < <(grep 'ERROR' /var/log/syslog)",
            "Read command output lines into array without trailing newlines (readarray)"
          ],
          [
            "arr+=(\"new_item\")",
            "Append new element to indexed array"
          ],
          [
            "unset 'SERVERS[node1]'",
            "Remove specific key/value pair from associative array"
          ]
        ],
        "tip": "Always quote \"${arr[@]}\" to prevent word-splitting!",
        "tags": [
          "bash",
          "arrays",
          "associative",
          "hashmap",
          "mapfile",
          "loops"
        ]
      },
      {
        "id": "bash-heredoc-herestring",
        "mode": "BASH",
        "modeClass": "mode-n",
        "desc": "Quoted heredocs (preventing variable interpolation), indent-stripped `<<-`, and herestrings `<<<`",
        "cmd": "cat << 'EOF' > /etc/systemd/system/app.service\n[Unit]\nDescription=App\nExecStart=/usr/bin/app\nEOF",
        "flags": [
          [
            "<< 'EOF'",
            "Single-quote delimiter: Disables all variable/backtick expansion (raw literal template)"
          ],
          [
            "<< EOF",
            "Unquoted delimiter: Expands $VARS and `cmds` inside the heredoc before writing"
          ],
          [
            "<<- EOF",
            "Strips leading TAB characters for readable indentation in scripts"
          ],
          [
            "cmd <<< \"$VAR\"",
            "Herestring: feeds variable directly to stdin without `echo | cmd` subshell"
          ]
        ],
        "subcommands": [
          [
            "tee /etc/sysctl.d/99-custom.conf > /dev/null << 'EOF'\nnet.core.somaxconn = 65535\nEOF",
            "Write protected system files using sudo tee and heredoc"
          ],
          [
            "bc <<< \"scale=2; 100 / 3\"",
            "Calculate floating-point arithmetic with herestring and bc"
          ]
        ],
        "tip": "Quoting 'EOF' prevents accidental shell injection",
        "tags": [
          "bash",
          "heredoc",
          "herestring",
          "template",
          "tee",
          "multiline"
        ]
      }
    ]
  },
  {
    "id": "python-script",
    "badge": "python",
    "title": "Python 3.10+ Modern Scripting",
    "subtitle": "subprocess.run, pathlib, argparse, json/env handling, context managers & dataclasses",
    "commands": [
      {
        "id": "py-safe-subprocess",
        "mode": "PYTHON",
        "modeClass": "mode-n",
        "desc": "Safe, non-blocking subprocess execution with timeout, captured stdout/stderr, and exit code checking",
        "cmd": "import subprocess\nres = subprocess.run(['ip', '-j', 'link'], capture_output=True, text=True, check=True, timeout=10)\nprint(res.stdout)",
        "flags": [
          [
            "check=True",
            "Raises CalledProcessError automatically if command returns non-zero exit code"
          ],
          [
            "text=True (universal_newlines=True)",
            "Decodes stdout/stderr into str instead of raw bytes"
          ],
          [
            "capture_output=True",
            "Captures stdout and stderr into res.stdout and res.stderr"
          ],
          [
            "timeout=10",
            "Raises TimeoutExpired if process runs longer than 10 seconds"
          ]
        ],
        "subcommands": [
          [
            "res = subprocess.run('echo hello | tr a-z A-Z', shell=True, text=True, capture_output=True)",
            "Run shell pipeline safely when piping syntax is required"
          ],
          [
            "proc = subprocess.Popen(['ping', '-c', '4', '8.8.8.8'], stdout=subprocess.PIPE, text=True)",
            "Stream real-time output line-by-line using Popen"
          ]
        ],
        "tip": "Avoid shell=True with user input to prevent injection",
        "tags": [
          "python",
          "subprocess",
          "cli",
          "exec",
          "timeout",
          "pipe"
        ]
      },
      {
        "id": "py-pathlib-file-ops",
        "mode": "PYTHON",
        "modeClass": "mode-n",
        "desc": "Modern filesystem navigation, recursive globbing, atomic writes & permissions via pathlib.Path",
        "cmd": "from pathlib import Path\nlog_dir = Path('/var/log')\nfor p in log_dir.rglob('*.log'):\n    if p.stat().st_size > 10 * 1024 * 1024:\n        print(f'{p}: {p.stat().st_size / 1e6:.1f} MB')",
        "flags": [
          [
            "Path.cwd() / Path.home()",
            "Current working directory or user home directory"
          ],
          [
            "p.read_text(encoding='utf-8')",
            "Read entire file as string in one line"
          ],
          [
            "p.write_text('content', encoding='utf-8')",
            "Write string to file atomically"
          ],
          [
            "p.parent.mkdir(parents=True, exist_ok=True)",
            "Create parent directories recursively without error if exists"
          ]
        ],
        "subcommands": [
          [
            "[f.name for f in Path('.').iterdir() if f.is_file()]",
            "List all direct files in current directory"
          ],
          [
            "data = json.loads(Path('config.json').read_text())",
            "One-liner JSON load directly from Path object"
          ]
        ],
        "tip": "Replaces legacy os.path.join and os.walk",
        "tags": [
          "python",
          "pathlib",
          "files",
          "glob",
          "filesystem",
          "path"
        ]
      },
      {
        "id": "py-argparse-cli",
        "mode": "PYTHON",
        "modeClass": "mode-n",
        "desc": "Production CLI argument parser with subcommands, typed flags, defaults and auto-generated help",
        "cmd": "import argparse\np = argparse.ArgumentParser(description='Node Triage Tool')\np.add_argument('-n', '--node', required=True, help='Target hostname')\np.add_argument('-v', '--verbose', action='store_true', help='Verbose output')\np.add_argument('--retries', type=int, default=3, help='Max attempts')\nargs = p.parse_args()",
        "flags": [
          [
            "action='store_true'",
            "Boolean flag: false by default, true when flag is present (-v)"
          ],
          [
            "type=int / type=float",
            "Auto-casts input value and rejects invalid types with exit code 2"
          ],
          [
            "choices=['json', 'text', 'csv']",
            "Enforce strict enumeration of allowed argument values"
          ]
        ],
        "subcommands": [
          [
            "subparsers = p.add_subparsers(dest='command', required=True)",
            "Create multi-command CLI (like git commit, git push)"
          ],
          [
            "p.add_argument('targets', nargs='+', help='1 or more positional items')",
            "Accept one or more positional arguments into a list"
          ]
        ],
        "tip": "Built into Python standard library with zero external dependencies",
        "tags": [
          "python",
          "argparse",
          "cli",
          "flags",
          "options",
          "arguments"
        ]
      }
    ]
  },
  {
    "id": "javascript-node",
    "badge": "js",
    "title": "JavaScript & Node.js Scripting",
    "subtitle": "node:fs/promises, child_process, modern fetch, streams, worker threads & util.parseArgs",
    "commands": [
      {
        "id": "node-fs-promises",
        "mode": "NODE.JS",
        "modeClass": "mode-n",
        "desc": "Modern asynchronous filesystem I/O with async/await, streams & recursive directories",
        "cmd": "import fs from 'node:fs/promises';\nconst config = JSON.parse(await fs.readFile('./config.json', 'utf8'));\nawait fs.writeFile('./output.json', JSON.stringify(config, null, 2));",
        "flags": [
          [
            "node:fs/promises",
            "Official Node.js promise-based filesystem module"
          ],
          [
            "fs.mkdir(dir, { recursive: true })",
            "Create folder tree safely (mkdir -p)"
          ],
          [
            "fs.readdir(dir, { withFileTypes: true })",
            "Read directory returning Dirent objects (inspect .isDirectory())"
          ],
          [
            "fs.rm(dir, { recursive: true, force: true })",
            "Delete folder tree cleanly (rm -rf)"
          ]
        ],
        "subcommands": [
          [
            "for await (const line of readline.createInterface({ input: fs.createReadStream('huge.log') })) { ... }",
            "Stream gigabyte-sized log files line-by-line with minimal memory"
          ],
          [
            "await fs.stat('/path/file').then(s => s.size)",
            "Query file size, permissions (mode), and mtime"
          ]
        ],
        "tip": "Use 'node:' prefix for guaranteed built-in resolution",
        "tags": [
          "javascript",
          "nodejs",
          "fs",
          "async",
          "promises",
          "io"
        ]
      },
      {
        "id": "node-child-process-exec",
        "mode": "NODE.JS",
        "modeClass": "mode-n",
        "desc": "Promisified command execution with stdout/stderr capture and signal termination",
        "cmd": "import { execFile } from 'node:child_process';\nimport { promisify } from 'node:util';\nconst execFileAsync = promisify(execFile);\nconst { stdout } = await execFileAsync('git', ['status', '--porcelain']);",
        "flags": [
          [
            "execFileAsync(cmd, args)",
            "Executes binary directly without invoking a shell (prevents shell injection)"
          ],
          [
            "maxBuffer: 10 * 1024 * 1024",
            "Increase max stdout buffer (default 1MB) for large outputs"
          ],
          [
            "timeout: 5000",
            "Kill child process if it exceeds duration"
          ]
        ],
        "subcommands": [
          [
            "const child = spawn('tail', ['-f', 'app.log']); child.stdout.on('data', chunk => process.stdout.write(chunk));",
            "Real-time process streaming via spawn()"
          ],
          [
            "const { values, positionals } = parseArgs({ options: { port: { type: 'string', short: 'p', default: '8080' } } });",
            "Built-in Node.js CLI argument parsing without npm dependencies"
          ]
        ],
        "tip": "Prefer execFile over exec to avoid shell injection",
        "tags": [
          "nodejs",
          "exec",
          "spawn",
          "child_process",
          "cli"
        ]
      }
    ]
  },
  {
    "id": "typescript-script",
    "badge": "ts",
    "title": "TypeScript Types & Runtime",
    "subtitle": "Interfaces, generics, type guards, utility types (Partial/Record), tsconfig & instant execution (tsx/bun)",
    "commands": [
      {
        "id": "ts-utility-types-generics",
        "mode": "TYPESCRIPT",
        "modeClass": "mode-n",
        "desc": "Core utility types: Record, Partial, Pick, Omit, Readonly, and generic API wrappers",
        "cmd": "type NodeConfig = { id: string; bmcIp: string; gpus: number; tags?: string[] };\ntype UpdateConfig = Partial<NodeConfig>;\ntype HostLookup = Record<string, NodeConfig>;",
        "flags": [
          [
            "Partial<T>",
            "Makes all properties in T optional (for PATCH/update requests)"
          ],
          [
            "Required<T>",
            "Makes all properties in T required"
          ],
          [
            "Pick<T, 'k1' | 'k2'>",
            "Constructs a type by picking specific set of keys from T"
          ],
          [
            "Omit<T, 'k1'>",
            "Constructs a type by omitting keys from T"
          ],
          [
            "Record<K, V>",
            "Constructs an object type whose property keys are K and values are V"
          ]
        ],
        "subcommands": [
          [
            "type Result<T> = { data: T; error: null } | { data: null; error: string };",
            "Standard discriminated union for resilient error handling"
          ],
          [
            "const isNode = (val: unknown): val is NodeConfig => typeof val === 'object' && val !== null && 'bmcIp' in val;",
            "Custom type predicate (User-defined Type Guard)"
          ]
        ],
        "tip": "Avoid 'any' — prefer 'unknown' with type narrowing",
        "tags": [
          "typescript",
          "generics",
          "partial",
          "record",
          "omit",
          "types"
        ]
      },
      {
        "id": "ts-runtime-runners",
        "mode": "RUNNERS",
        "modeClass": "mode-n",
        "desc": "Instant TypeScript execution without manual tsc build steps via tsx, bun or ts-node",
        "cmd": "npx tsx script.ts   # Zero-config ESM/CJS runner\nbun run script.ts   # High-speed native TS runtime\nts-node --transpile-only script.ts",
        "flags": [
          [
            "npx tsx",
            "Modern esbuild-powered TypeScript runner (supports top-level await & ESM)"
          ],
          [
            "bun run",
            "Native Bun engine executing TS/JSX with near-instant startup"
          ],
          [
            "--transpile-only",
            "Skips type-checking during development for 10x faster execution"
          ]
        ],
        "tip": "Use 'tsx' for fast Node scripts without tsconfig headache",
        "tags": [
          "typescript",
          "tsx",
          "bun",
          "ts-node",
          "runtime",
          "runner"
        ]
      }
    ]
  },
  {
    "id": "powershell-script",
    "badge": "powershell",
    "title": "PowerShell Core 7+ Scripting",
    "subtitle": "Advanced pipelines, PSCustomObject, CmdletBinding functions, error handling & regex matches",
    "commands": [
      {
        "id": "pwsh-pipeline-custom-object",
        "mode": "POWERSHELL",
        "modeClass": "mode-n",
        "desc": "Construct structured PSCustomObjects inside pipelines with Where-Object and Select-Object",
        "cmd": "Get-Process | Where-Object WorkingSet64 -gt 200MB | Select-Object -First 10 ProcessName, @{Name='RAM_MB'; Expression={[math]::Round($_.WorkingSet64 / 1MB, 1)}} | Sort-Object RAM_MB -Descending",
        "flags": [
          [
            "Where-Object ($_) / ?",
            "Filters pipeline objects by property value or scriptblock"
          ],
          [
            "Select-Object / %",
            "Projects properties or generates calculated fields @{Name=''; Expression={}}"
          ],
          [
            "[PSCustomObject]@{...}",
            "Creates strongly-typed structured object with named properties"
          ],
          [
            "$_ (or $PSItem)",
            "Current pipeline object variable"
          ]
        ],
        "subcommands": [
          [
            "$node = [PSCustomObject]@{ Hostname='gpu01'; BMC='2001:db8::1'; GPUs=8 }",
            "Instantiate standalone custom object"
          ],
          [
            "$node | ConvertTo-Json -Depth 4",
            "Serialize object tree to formatted JSON string"
          ]
        ],
        "tip": "Pass objects through pipelines, not raw text!",
        "tags": [
          "powershell",
          "pipeline",
          "pscustomobject",
          "objects",
          "filter",
          "sort"
        ]
      },
      {
        "id": "pwsh-error-handling-trap",
        "mode": "POWERSHELL",
        "modeClass": "mode-n",
        "desc": "Production error handling with try/catch/finally, ErrorAction Stop & exit codes",
        "cmd": "$ErrorActionPreference = 'Stop'\ntry {\n  $resp = Invoke-RestMethod -Uri \"https://$BMC/redfish/v1/Systems\" -TimeoutSec 5\n} catch {\n  Write-Error \"Failed: $($_.Exception.Message)\"\n  exit 1\n}",
        "flags": [
          [
            "$ErrorActionPreference = 'Stop'",
            "Promotes non-terminating cmdlet errors to catchable terminating exceptions"
          ],
          [
            "$_.Exception.Message",
            "Extracts human-readable error description from pipeline exception"
          ],
          [
            "finally { ... }",
            "Block always executed regardless of success or failure (ideal for cleanup)"
          ]
        ],
        "subcommands": [
          [
            "if ($LASTEXITCODE -ne 0) { throw \"Native command exited with $LASTEXITCODE\" }",
            "Check exit status of native external binaries (like git or nvidia-smi)"
          ],
          [
            "Test-Path -Path $Path -PathType Leaf",
            "Verify file exists before operating"
          ]
        ],
        "tip": "Set ErrorActionPreference = 'Stop' at top of scripts",
        "tags": [
          "powershell",
          "error",
          "try-catch",
          "exceptions",
          "exitcode"
        ]
      },
      {
        "id": "pwsh-advanced-function",
        "mode": "POWERSHELL",
        "modeClass": "mode-n",
        "desc": "Advanced cmdlet function with [CmdletBinding()], typed parameters, validation and pipeline support",
        "cmd": "function Invoke-NodeTriage {\n  [CmdletBinding()]\n  param(\n    [Parameter(Mandatory, ValueFromPipeline)]\n    [string[]]$Hostname,\n    [ValidateRange(1, 60)][int]$Timeout = 10\n  )\n  process { Write-Host \"Checking node: $Hostname (timeout: ${Timeout}s)\" }\n}",
        "flags": [
          [
            "[CmdletBinding()]",
            "Enables common parameters (-Verbose, -Debug, -ErrorAction, -WhatIf)"
          ],
          [
            "ValueFromPipeline",
            "Allows function to consume streaming items directly from pipelined input"
          ],
          [
            "[ValidateSet('dev', 'prod')]",
            "Enforces parameter value to match allowed enumeration"
          ]
        ],
        "tip": "CmdletBinding unlocks -Verbose and -WhatIf flags",
        "tags": [
          "powershell",
          "function",
          "cmdlet",
          "param",
          "advanced",
          "pipeline"
        ]
      }
    ]
  },
  {
    "id": "json-jq",
    "badge": "json",
    "title": "JSON Syntax & jq Recipes",
    "subtitle": "Valid JSON schema rules, jq array transformations, key slicing, filtering & tabular output",
    "commands": [
      {
        "id": "jq-filtering-transform",
        "mode": "JQ",
        "modeClass": "mode-n",
        "desc": "Filter, slice and transform nested JSON arrays into custom objects or CSV rows",
        "cmd": "curl -s https://api.example.com/nodes | jq -r '.items[] | select(.status == \"FAILED\") | [.name, .bmcIp, .errorCode] | @csv'",
        "flags": [
          [
            "-r (--raw-output)",
            "Output raw strings without double quotes (ideal for shell variables and piping)"
          ],
          [
            ".items[]",
            "Unrolls array into stream of individual JSON objects"
          ],
          [
            "select(condition)",
            "Keeps only items satisfying boolean expression (e.g. .count > 5)"
          ],
          [
            "@csv / @tsv",
            "Formats array of values into CSV or TSV compatible lines"
          ]
        ],
        "subcommands": [
          [
            "jq -s 'add' *.json",
            "Slurp and merge multiple JSON files into a single array (-s)"
          ],
          [
            "jq '.Members | map({id: .\"@odata.id\", name: .Name})'",
            "Map array elements into transformed schema objects"
          ],
          [
            "jq 'keys'",
            "Return array of top-level key names in object"
          ]
        ],
        "tip": "Pass -r when assigning jq output into bash variables",
        "tags": [
          "json",
          "jq",
          "csv",
          "select",
          "transform",
          "filter",
          "array"
        ]
      },
      {
        "id": "json-formatting-validation",
        "mode": "JSON",
        "modeClass": "mode-n",
        "desc": "CLI validation, in-place minification/prettification and escaping rules",
        "cmd": "python3 -m json.tool input.json > pretty.json   # Pretty-print via standard library\njq empty < input.json && echo \"Valid JSON\"",
        "flags": [
          [
            "jq empty",
            "Parses input and returns exit code 0 if valid, non-zero if invalid syntax"
          ],
          [
            "jq -c '.' file.json",
            "Compact (minify) JSON to single-line without whitespace"
          ],
          [
            "JSON Strings",
            "MUST use double quotes (\"); single quotes (') are INVALID JSON!"
          ]
        ],
        "tip": "Trailing commas are strictly illegal in standard JSON",
        "tags": [
          "json",
          "validate",
          "minify",
          "pretty",
          "python",
          "schema"
        ]
      }
    ]
  },
  {
    "id": "yaml-yq",
    "badge": "yaml",
    "title": "YAML Syntax & yq Recipes",
    "subtitle": "Block scalars (| vs >), anchors (&) / aliases (*), boolean traps & in-place yq editing",
    "commands": [
      {
        "id": "yaml-scalars-anchors",
        "mode": "YAML",
        "modeClass": "mode-n",
        "desc": "Multiline block scalar chomping (| vs >) and node anchors/aliases for DRY configuration",
        "cmd": "default_profile: &base_env\n  timeout: 30\n  retries: 3\nproduction:\n  <<: *base_env\n  nodes: 64",
        "flags": [
          [
            "| (Literal scalar)",
            "Preserves newlines and line breaks verbatim"
          ],
          [
            "> (Folded scalar)",
            "Folds newlines into single spaces (ideal for long descriptive paragraphs)"
          ],
          [
            "|+ / |-",
            "+ preserves all trailing newlines; - strips all trailing newlines (chomping)"
          ],
          [
            "&anchor and *alias",
            "Defines reusable YAML snippet and injects it via merge key (<<: *anchor)"
          ]
        ],
        "subcommands": [
          [
            "# The Norway / Boolean Trap",
            "In YAML 1.1, unquoted NO, no, YES, yes, ON, on are parsed as boolean FALSE/TRUE! Quote country codes: 'NO'"
          ],
          [
            "yq eval '.production.nodes = 128' -i config.yaml",
            "Edit YAML file in-place with yq"
          ]
        ],
        "tip": "Always quote 'yes', 'no', 'on', 'off' to prevent boolean conversion!",
        "tags": [
          "yaml",
          "scalars",
          "anchors",
          "aliases",
          "yq",
          "multiline"
        ]
      },
      {
        "id": "yq-query-transform",
        "mode": "YQ",
        "modeClass": "mode-n",
        "desc": "Query, mutate, and convert YAML documents directly from the terminal with yq",
        "cmd": "yq -o=json '.services[] | select(.replicas > 1)' compose.yaml | jq .",
        "flags": [
          [
            "-o=json / -o=yaml",
            "Convert seamlessly between YAML and JSON output formats"
          ],
          [
            "-i (--inplace)",
            "Mutate target YAML file on disk in-place"
          ],
          [
            "yq '.a.b += [\"item\"]' -i file.yaml",
            "Append element to YAML list in-place"
          ]
        ],
        "tip": "yq syntax mirrors jq for easy muscle memory",
        "tags": [
          "yq",
          "yaml",
          "convert",
          "json",
          "mutate",
          "compose"
        ]
      }
    ]
  },
  {
    "id": "toml-format",
    "badge": "toml",
    "title": "TOML Configuration Reference",
    "subtitle": "Tables [table], array of tables [[array]], inline tables, datetimes & python-tomli/taplo",
    "commands": [
      {
        "id": "toml-tables-syntax",
        "mode": "TOML",
        "modeClass": "mode-n",
        "desc": "TOML table definitions, inline tables, array of tables and typed scalar syntax",
        "cmd": "[server]\nip = \"10.0.0.1\"\nports = [ 8000, 8001 ]\nconnection_max = 5000\nenabled = true\n\n[[servers]]\nname = \"alpha\"\nip = \"10.0.0.10\"\n\n[[servers]]\nname = \"beta\"\nip = \"10.0.0.11\"",
        "flags": [
          [
            "[table]",
            "Standard hash table / mapping section"
          ],
          [
            "[[array_of_tables]]",
            "Appends a new table to an array of tables (common in Cargo/pyproject)"
          ],
          [
            "inline = { k = 1, v = 2 }",
            "Inline compact table for concise single-line structures"
          ],
          [
            "ISO 8601 Datetime",
            "Native RFC 3339 timestamps supported directly: 2026-10-31T12:00:00Z"
          ]
        ],
        "subcommands": [
          [
            "python3 -c 'import tomllib, pprint; pprint.pprint(tomllib.load(open(\"pyproject.toml\", \"rb\")))'",
            "Parse TOML natively in Python 3.11+ using built-in tomllib"
          ],
          [
            "taplo fmt pyproject.toml",
            "Format and lint TOML configuration files using Taplo CLI"
          ]
        ],
        "tip": "Native standard in pyproject.toml, Cargo.toml & containerd config",
        "tags": [
          "toml",
          "config",
          "pyproject",
          "cargo",
          "tables",
          "schema"
        ]
      }
    ]
  },
  {
    "id": "regex-patterns",
    "badge": "regex",
    "title": "Regex Patterns & Lookarounds",
    "subtitle": "Lookaheads, lookbehinds, non-capturing groups, word boundaries & datacenter patterns",
    "commands": [
      {
        "id": "regex-lookaround-assertions",
        "mode": "REGEX",
        "modeClass": "mode-n",
        "desc": "Zero-width lookaround assertions: positive/negative lookaheads and lookbehinds",
        "cmd": "grep -oP '(?<=Temperature:\\s)[0-9]+(?=\\sC)' sensors.log   # Matches numbers between 'Temperature: ' and ' C'",
        "flags": [
          [
            "(?=...) (Positive Lookahead)",
            "Asserts that pattern matches directly ahead, without consuming characters"
          ],
          [
            "(?!...) (Negative Lookahead)",
            "Asserts that pattern does NOT match directly ahead (e.g. foo(?!bar))"
          ],
          [
            "(?<=...) (Positive Lookbehind)",
            "Asserts that pattern matches directly behind (requires fixed length in PCRE)"
          ],
          [
            "(?<!...) (Negative Lookbehind)",
            "Asserts that pattern does NOT match directly behind"
          ],
          [
            "(?:...) (Non-Capturing Group)",
            "Groups expression for repetition without creating match backreference"
          ]
        ],
        "subcommands": [
          [
            "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b",
            "Strict IPv4 address matcher with word boundaries"
          ],
          [
            "[0-9a-fA-F]{4}:[0-9a-fA-F]{2}:[0-9a-fA-F]{2}\\.[0-7]",
            "PCIe BDF identifier regex (e.g. 0000:41:00.0)"
          ],
          [
            "([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})",
            "Standard MAC address matcher"
          ]
        ],
        "tip": "Pass -P to grep to enable full PCRE lookaround support",
        "tags": [
          "regex",
          "lookahead",
          "lookbehind",
          "pcre",
          "ipv4",
          "mac",
          "bdf"
        ]
      }
    ]
  },
  {
    "id": "awk-sed",
    "badge": "awk/sed",
    "title": "AWK & Sed Stream Processing",
    "subtitle": "Column extraction, running totals, multi-file NR==FNR lookups, delimiters & in-place sed",
    "commands": [
      {
        "id": "awk-processing-recipes",
        "mode": "AWK",
        "modeClass": "mode-n",
        "desc": "Field extraction, delimiter splitting, conditions, running totals and END blocks",
        "cmd": "ps aux | awk '{sum+=$6} END {printf \"Total Resident Memory: %.2f GB\\n\", sum/1024/1024}'",
        "flags": [
          [
            "-F':'",
            "Set input field delimiter (e.g. -F, for CSV or -F: for /etc/passwd)"
          ],
          [
            "$1, $2, ... $NF",
            "$1 is first field, $NF is the last field, $0 is the entire line"
          ],
          [
            "NR / FNR",
            "NR is total record number across all files; FNR is record number in current file"
          ],
          [
            "NR==FNR",
            "Idiomatic awk pattern for joining/filtering file 2 based on a map built from file 1"
          ]
        ],
        "subcommands": [
          [
            "awk '!seen[$0]++' file.txt",
            "Deduplicate lines while preserving exact file order (faster than sort -u)"
          ],
          [
            "awk -F: '$3 >= 1000 {print $1, $3, $6}' /etc/passwd",
            "Filter system users with UID >= 1000"
          ]
        ],
        "tip": "awk '!seen[$0]++' keeps original order unlike sort -u",
        "tags": [
          "awk",
          "sum",
          "math",
          "columns",
          "dedup",
          "fields"
        ]
      },
      {
        "id": "sed-in-place-recipes",
        "mode": "SED",
        "modeClass": "mode-n",
        "desc": "In-place file editing, regex substitution, line deletion and range blocks",
        "cmd": "sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config",
        "flags": [
          [
            "-i (In-place)",
            "Modifies file directly on disk (on macOS pass -i '' to prevent backup file)"
          ],
          [
            "-E (-r)",
            "Enables Extended Regular Expressions (ERE) without backslash escaping () and +"
          ],
          [
            "s/find/replace/g",
            "Substitute all occurrences on each line (g = global)"
          ],
          [
            "/pattern/d",
            "Delete lines matching specified regex pattern"
          ]
        ],
        "subcommands": [
          [
            "sed -i '/^[[:space:]]*#/d; /^[[:space:]]*$/d' config.ini",
            "Strip all comment lines and blank lines in-place"
          ],
          [
            "sed -n '20,40p' file.log",
            "Print specific line number range (lines 20 to 40)"
          ]
        ],
        "tip": "Use alternate delimiters like s|http://|https://|g to avoid escaping slashes",
        "tags": [
          "sed",
          "stream",
          "substitute",
          "regex",
          "inplace",
          "delete"
        ]
      }
    ]
  },
  {
    "id": "sql-sqlite",
    "badge": "sql",
    "title": "SQL & SQLite One-Liners",
    "subtitle": "CLI querying, CSV import/export, JSON extraction, schema introspection & memory databases",
    "commands": [
      {
        "id": "sqlite-cli-json-csv",
        "mode": "SQLITE",
        "modeClass": "mode-n",
        "desc": "Execute queries directly from CLI with JSON or column formatting and import raw CSV files",
        "cmd": "sqlite3 -json database.db \"SELECT hostname, bmc_ip, gpus FROM nodes WHERE status='ONLINE';\"",
        "flags": [
          [
            "-json",
            "Outputs query result directly as a JSON array of objects"
          ],
          [
            "-column -header",
            "Formats query output as aligned terminal columns with column headers"
          ],
          [
            "-csv",
            "Formats query output as comma-separated values"
          ]
        ],
        "subcommands": [
          [
            "sqlite3 :memory: -cmd \".mode csv\" -cmd \".import nodes.csv data\" \"SELECT * FROM data LIMIT 5;\"",
            "Instant in-memory ad-hoc SQL query on a CSV file without installing a server"
          ],
          [
            "sqlite3 database.db \".schema --indent\"",
            "Introspect and print pretty-printed DDL database schema"
          ],
          [
            "sqlite3 db.sqlite \"SELECT json_extract(metadata, '$.firmware.bios') FROM inventory;\"",
            "Extract nested attributes from SQLite JSON columns"
          ]
        ],
        "tip": "sqlite3 :memory: lets you run SQL on any CSV instantly",
        "tags": [
          "sqlite",
          "sql",
          "csv",
          "json",
          "database",
          "schema",
          "cli"
        ]
      }
    ]
  },
  {
    "id": "lua-script",
    "badge": "lua",
    "title": "Lua 5.4 Systems & Embedded Scripting",
    "subtitle": "Tables, 1-based arrays, metatables & OOP, pcall error handling, closures, file I/O & subprocesses",
    "commands": [
      {
        "id": "lua-basics-tables",
        "mode": "LUA",
        "modeClass": "mode-n",
        "desc": "Lua foundational variables, 1-based arrays, hash dictionaries, and truthiness rules",
        "cmd": "local host = \"node-042\"\nlocal ports = { 80, 443, 8080 } -- 1-based array!\nlocal server = { name = host, rack = \"Rack-14\", active = true }\n\ntable.insert(ports, 9090)\nprint(\"First port:\", ports[1]) -- 1-based index!\nprint(\"Server rack:\", server.rack)\n-- Truthiness gotcha: ONLY false and nil are falsy! 0 and \"\" are TRUE!",
        "flags": [
          ["local var = val", "Lexical block scope. Without 'local', variable leaks to global _G!"],
          ["1-based arrays", "Array indexing starts at 1, NOT 0! ports[1] is 80"],
          ["table.insert(t, val)", "Appends element to sequential array table"],
          ["Truthiness", "0 and \"\" evaluate to true in if statements (only false and nil are falsy)"]
        ],
        "subcommands": [
          ["for i, v in ipairs(ports) do print(i, v) end", "Iterate sequential array in index order (1..N)"],
          ["for k, v in pairs(server) do print(k, v) end", "Iterate hash dictionary key-value pairs"],
          ["local str = table.concat(ports, \", \")", "Join all array string elements with a delimiter"]
        ],
        "tip": "Always use 'local' for variables and remember '~=' is not-equal (not '!=')",
        "tags": ["lua", "scripting", "tables", "arrays", "dictionaries", "truthiness", "syntax"]
      },
      {
        "id": "lua-functions-closures",
        "mode": "LUA",
        "modeClass": "mode-e",
        "desc": "Functions, multiple return values, closures, variadics (...) and custom iterator factories",
        "cmd": "-- Multiple return values & closures\nlocal function split_host(fqdn)\n  local host, domain = fqdn:match(\"^([%w%-]+)%.(.*)$\")\n  return host, domain or \"local\"\nend\n\n-- Closure factory (encapsulated state)\nlocal function make_counter(start)\n  local count = start or 0\n  return function(inc)\n    count = count + (inc or 1)\n    return count\n  end\nend\n\nlocal host, domain = split_host(\"node-042.dc.lan\")\nlocal c = make_counter(10)\nprint(host, domain, \"Next:\", c()) -- node-042  dc.lan  Next: 11",
        "flags": [
          ["return a, b", "Functions can return any number of values simultaneously"],
          ["closure", "Inner function retains reference to parent scope local variable (count)"],
          ["fqdn:match()", "Method colon syntax passes fqdn automatically as self"]
        ],
        "subcommands": [
          ["local function sum(...) local s = 0 for _, v in ipairs({...}) do s = s + v end return s end", "Variadic argument pack via {...}"],
          ["local ok, res = pcall(fn, arg1)", "Invoke function safely without crashing caller"]
        ],
        "tip": "Functions are first-class values in Lua—they can be stored in tables, passed as arguments, and returned from other functions.",
        "tags": ["lua", "functions", "closures", "multiple-returns", "variadics", "factory"]
      },
      {
        "id": "lua-metatables-oop",
        "mode": "LUA",
        "modeClass": "mode-c",
        "desc": "Metatables, metamethods (__index, __tostring) and object-oriented class patterns",
        "cmd": "-- Class prototype with metatable fallback\nlocal Server = {}\nServer.__index = Server\n\nfunction Server:new(name, ip)\n  local instance = setmetatable({ name = name, ip = ip, active = true }, self)\n  return instance\nend\n\nfunction Server:describe()\n  return string.format(\"[%s] IP: %s (Status: %s)\", self.name, self.ip, self.active and \"UP\" or \"DOWN\")\nend\n\n-- Instantiate and call method\nlocal s1 = Server:new(\"dgx-01\", \"10.0.1.50\")\nprint(s1:describe())",
        "flags": [
          ["setmetatable(t, mt)", "Associates metatable mt with table t to intercept operations"],
          ["__index = Server", "If key not found in instance, Lua looks it up in Server"],
          ["function Class:method()", "Syntactic sugar for Class.method(self, ...)"],
          ["obj:method()", "Syntactic sugar for obj.method(obj, ...)"]
        ],
        "subcommands": [
          ["Server.__tostring = function(self) return self.name end", "Custom string representation for tostring(obj)"],
          ["rawget(t, k) / rawset(t, k, v)", "Access or modify table without invoking metamethods"]
        ],
        "tip": "Metatables are Lua's core extensibility mechanism for OOP, operator overloading, and proxy tables.",
        "tags": ["lua", "metatables", "oop", "classes", "__index", "prototype", "objects"]
      },
      {
        "id": "lua-pcall-popen",
        "mode": "LUA",
        "modeClass": "mode-t",
        "desc": "Error trapping with pcall(), reading files & executing shell commands via io.popen()",
        "cmd": "-- 1. Protected call (try-catch alternative)\nlocal ok, res = pcall(function()\n  local f = assert(io.open(\"/proc/loadavg\", \"r\"))\n  local content = f:read(\"*a\")\n  f:close()\n  return content:gsub(\"%s+$\", \"\")\nend)\nif not ok then print(\"Caught runtime error:\", res) end\n\n-- 2. Shell sub-process execution and stdout capture\nlocal handle = io.popen(\"uname -r\", \"r\")\nlocal kernel = handle:read(\"*a\"):gsub(\"%s+$\", \"\")\nhandle:close()\nprint(\"Kernel:\", kernel)",
        "flags": [
          ["pcall(fn, ...)", "Calls function in protected mode: returns true + results, or false + error message"],
          ["io.open(path, mode)", "Opens file descriptor ('r' read, 'w' write, 'a' append)"],
          ["io.popen(cmd, \"r\")", "Runs shell command and opens a readable pipe to stdout stream"],
          ["handle:close()", "Closes stream descriptor to prevent leaking zombie processes"]
        ],
        "subcommands": [
          ["local f = assert(io.open(\"/etc/hosts\", \"r\"))", "Open file with built-in assertion (raises error on failure)"],
          ["for line in io.lines(\"/tmp/audit.log\") do ... end", "Memory-efficient line-by-line file iteration"],
          ["os.execute(\"systemctl is-active --quiet dcgm\")", "Execute command directly and return exit status"]
        ],
        "tip": "Always call handle:close() on io.popen streams to reap child processes and avoid descriptor leaks.",
        "tags": ["pcall", "popen", "error", "shell", "io", "subprocess", "try-catch"]
      }
    ]
  },
  {
    "id": "git-scm",
    "badge": "git",
    "title": "Git Version Control & Ops Workflow",
    "subtitle": "Branching, staging, worktrees, air-gapped bundles, history inspection & recovery recipes",
    "commands": [
      {
        "id": "git-workflow-daily",
        "mode": "GIT",
        "modeClass": "mode-e",
        "desc": "Everyday branching, interactive hunk staging, commit review & clean status summary",
        "cmd": "git status -sb\ngit switch -c feature/node-telemetry\ngit add -p\ngit diff --staged\ngit commit -m \"feat: collect nvlink error counters\"",
        "flags": [
          ["status -sb", "Short format with branch and upstream tracking information"],
          ["switch -c <branch>", "Create and switch to new branch (modern replacement for checkout -b)"],
          ["add -p", "Interactive patch staging: review and stage individual code hunks selectively"],
          ["diff --staged", "Compare staged index against HEAD before committing"]
        ],
        "subcommands": [
          ["git commit --amend --no-edit", "Incorporate new staged edits into previous commit without changing message"],
          ["git branch -vv", "List local branches with upstream tracking and ahead/behind count"],
          ["git switch -", "Switch back to the previous branch"]
        ],
        "tip": "Always check 'git status -sb' and 'git diff --staged' before committing to prevent accidental secrets leakage.",
        "tags": ["git", "workflow", "branch", "stage", "commit", "diff", "status"]
      },
      {
        "id": "git-inspect-history",
        "mode": "GIT",
        "modeClass": "mode-n",
        "desc": "Inspect history with ASCII graph trees, blame line annotations, and pickaxe search",
        "cmd": "git log --oneline --graph --decorate --all -20\ngit blame -L 40,65 scripts/collect-dcgm.sh\ngit log -S \"fabricmanager\" --source --all",
        "flags": [
          ["--graph", "Draw ASCII character graph of commit and merge topology"],
          ["--oneline", "Compact single-line output (abbreviated hash + subject)"],
          ["-L start,end", "Annotate specific line range with commit hash, author and timestamp"],
          ["-S <string>", "Pickaxe: search commits that added or removed occurrences of specific string"]
        ],
        "subcommands": [
          ["git show --stat <commit>", "Inspect commit diff, stats, and metadata"],
          ["git diff main...feature", "Show changes on feature since it diverged from main (three-dot diff)"],
          ["git log --stat -5", "Show top 5 commits with list of modified files and line deltas"]
        ],
        "tip": "Combine 'git log -p -S <symbol>' to find exact historical patches introducing a bug or API change.",
        "tags": ["git", "history", "log", "blame", "pickaxe", "search", "graph"]
      },
      {
        "id": "git-stash-worktrees",
        "mode": "GIT",
        "modeClass": "mode-t",
        "desc": "Parallel worktrees and safe stashes: switch contexts instantly without losing uncommitted edits",
        "cmd": "git stash push -u -m \"WIP: telemetry refactor\"\ngit worktree add ../hotfix-link -b hotfix/nvlink-flap main\ncd ../hotfix-link && git status\n# Once hotfix is complete:\ncd - && git worktree remove ../hotfix-link",
        "flags": [
          ["stash push -u", "Stash tracked edits and untracked new files (-u / --include-untracked)"],
          ["worktree add <path> -b <br>", "Check out branch in separate filesystem folder sharing the same .git repo"],
          ["worktree remove <path>", "Safely remove linked worktree after finishing work"]
        ],
        "subcommands": [
          ["git stash list", "List all stashed state snapshots with indices"],
          ["git stash pop", "Apply the latest stash (stash@{0}) and drop it from the stack"],
          ["git worktree list", "Display all currently active linked worktrees and checked out branches"]
        ],
        "tip": "Worktrees let you test multiple branches side-by-side or run long builds without switching your primary directory.",
        "tags": ["git", "worktree", "stash", "context", "parallel", "branch"]
      },
      {
        "id": "git-ops-deployment",
        "mode": "GIT",
        "modeClass": "mode-c",
        "desc": "Datacenter & production ops: air-gapped bundles, deployed version check, and ownership fixes",
        "cmd": "git -C /opt/tools describe --tags --always --dirty\ngit config --global --add safe.directory /opt/tools\ngit bundle create repo-offline.bundle --all\ngit clone repo-offline.bundle my-repo",
        "flags": [
          ["describe --tags --dirty", "Returns human-readable build version: tag, commit count, hash, and -dirty flag"],
          ["safe.directory", "Resolve 'detected dubious ownership' errors in multi-user cluster environments"],
          ["bundle create", "Package entire git repository and commit history into a single portable file for air-gapped clusters"],
          ["-C <path>", "Run git command as if started in specified target directory"]
        ],
        "subcommands": [
          ["git bundle verify repo-offline.bundle", "Verify bundle integrity and prerequisites before cloning"],
          ["git archive --format=tar.gz -o release.tar.gz HEAD", "Export current tree snapshot into archive without .git folder"],
          ["git clean -fdn", "Dry-run preview of untracked files and directories before cleaning (-fd to execute)"]
        ],
        "tip": "Air-gapped datacenters with zero internet access can sync Git repos over USB or scp using 'git bundle'.",
        "tags": ["git", "ops", "bundle", "air-gapped", "describe", "safe.directory", "clean"]
      },
      {
        "id": "git-recovery-undo",
        "mode": "GIT",
        "modeClass": "mode-e",
        "desc": "Emergency undo: reflog resurrection, restore staged files, soft resets, and safe reverts",
        "cmd": "git restore --staged path/to/file\ngit reset --soft HEAD~1\ngit reflog -15\ngit reset --hard HEAD@{2}\ngit revert <commit-hash>",
        "flags": [
          ["restore --staged", "Unstage file from index while keeping working tree modifications intact"],
          ["reset --soft HEAD~1", "Undo last commit but keep all modified files staged in index"],
          ["reflog", "Local flight-recorder recording every HEAD move (even deleted branches or aborted rebases)"],
          ["revert <commit>", "Create a new inverse commit that safely undos an already pushed commit"]
        ],
        "subcommands": [
          ["git restore path/to/file", "Discard working-tree changes in tracked file (revert to index/HEAD)"],
          ["git reset --hard HEAD~1", "Discard last commit and all uncommitted changes (DANGER: destroys uncommitted work)"],
          ["git cherry-pick --abort", "Cancel an in-progress cherry-pick and restore branch state"]
        ],
        "tip": "Nothing committed in Git is truly lost until garbage-collected—use 'git reflog' to find lost commit hashes.",
        "tags": ["git", "recovery", "undo", "restore", "reset", "revert", "reflog"]
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("scripting_cs_bookmarks") || "[]"))
};

// DOM References
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toast-text");

let toastTimer = null;

function showToast(message) {
  toastTextEl.textContent = message;
  toastEl.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
  }, 1900);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied: ${text.length > 42 ? text.slice(0, 42) + "…" : text}`);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copied to clipboard");
  }
}

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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
  const totalCommands = SCRIPTING_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of SCRIPTING_DATA) {
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
    <div class="cat-select-wrap">
      <select id="category-select" class="cat-select" aria-label="Filter by scripting category">
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
window.addEventListener("resize", () => packMasonry());
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of SCRIPTING_DATA) {
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
  if (densityLabel) {
    densityLabel.textContent = compact ? "Relaxed" : "Compact";
  }
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
        showToast("Removed from saved snippets");
      } else {
        state.bookmarks.add(id);
        showToast("Saved snippet to bookmarks");
      }
      localStorage.setItem("scripting_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      renderSections();
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
