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
            "Cleans up the temporary directory even if the script is killed by SIGINT/SIGTERM (nothing runs on SIGKILL)"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man1/bash.1.html",
              "title": "bash(1)"
            }
          ]
        }
      },
      {
        "id": "bash-parameter-expansion",
        "mode": "BASH",
        "modeClass": "mode-n",
        "desc": "Parameter expansion recipes: defaults, string slicing, search/replace, and case modification",
        "cmd": "echo \"${VAR:-default_val}\"; echo \"${FILENAME%.*}\"; echo \"${PATH//:/$'\\n'}\"",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man1/bash.1.html",
              "title": "bash(1)"
            }
          ],
          "note": "Corrected 2026-11-10: the echo commands were piped into each other, and ${PATH//:/\\n} inserts a literal n; now $'\\n'."
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man1/bash.1.html",
              "title": "bash(1)"
            }
          ]
        }
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
            "Write a root-owned file with tee and a heredoc (run it as root)"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man1/bash.1.html",
              "title": "bash(1)"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.python.org/3/library/subprocess.html",
              "title": "Python: subprocess"
            }
          ]
        }
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
            "Write a string to a file (not atomic: for that, write a temp file and Path.replace() it)"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.python.org/3/library/pathlib.html",
              "title": "Python: pathlib"
            },
            {
              "url": "https://docs.python.org/3/library/json.html",
              "title": "Python: json (and json.tool)"
            }
          ],
          "note": "Corrected 2026-11-10: Path.write_text() is not atomic."
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.python.org/3/library/argparse.html",
              "title": "Python: argparse"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://nodejs.org/api/fs.html",
              "title": "Node.js: fs"
            },
            {
              "url": "https://nodejs.org/api/readline.html",
              "title": "Node.js: readline"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://nodejs.org/api/child_process.html",
              "title": "Node.js: child_process"
            },
            {
              "url": "https://nodejs.org/api/util.html",
              "title": "Node.js: util (promisify, parseArgs)"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.typescriptlang.org/docs/handbook/utility-types.html",
              "title": "TypeScript: utility types"
            },
            {
              "url": "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
              "title": "TypeScript: narrowing"
            }
          ]
        }
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
            "Skips type checking, so it starts faster"
          ],
          [
            "node script.ts",
            "Node 22.18+ / 23.6+ strip types natively: no runner needed, but no enums or parameter properties"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/privatenumber/tsx",
              "title": "tsx"
            },
            {
              "url": "https://bun.sh/docs/runtime/typescript",
              "title": "Bun: TypeScript"
            },
            {
              "url": "https://github.com/TypeStrong/ts-node",
              "title": "ts-node"
            },
            {
              "url": "https://nodejs.org/api/typescript.html",
              "title": "Node.js: TypeScript type stripping"
            }
          ]
        }
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
            "Select-Object (select)",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/where-object",
              "title": "Where-Object"
            },
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/select-object",
              "title": "Select-Object"
            },
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pscustomobject",
              "title": "about_PSCustomObject"
            },
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables",
              "title": "about_Automatic_Variables ($_, $LASTEXITCODE)"
            },
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/convertto-json",
              "title": "ConvertTo-Json"
            }
          ],
          "note": "Corrected 2026-11-10: % is ForEach-Object, not Select-Object."
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables",
              "title": "about_Preference_Variables"
            },
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_try_catch_finally",
              "title": "about_Try_Catch_Finally"
            },
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_automatic_variables",
              "title": "about_Automatic_Variables ($_, $LASTEXITCODE)"
            },
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.utility/invoke-restmethod",
              "title": "Invoke-RestMethod"
            }
          ]
        }
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
            "Enables common parameters (-Verbose, -Debug, -ErrorAction…); -WhatIf and -Confirm need [CmdletBinding(SupportsShouldProcess)]"
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
        "tip": "CmdletBinding unlocks -Verbose; add SupportsShouldProcess for -WhatIf",
        "tags": [
          "powershell",
          "function",
          "cmdlet",
          "param",
          "advanced",
          "pipeline"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_cmdletbindingattribute",
              "title": "about_Functions_CmdletBindingAttribute"
            },
            {
              "url": "https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_functions_advanced_parameters",
              "title": "about_Functions_Advanced_Parameters"
            }
          ],
          "note": "Corrected 2026-11-10: -WhatIf comes from SupportsShouldProcess, not CmdletBinding alone."
        }
      }
    ]
  },
  {
    "id": "lua-script",
    "badge": "lua",
    "title": "Lua Scripting & Config Files",
    "subtitle": "Variables, tables, loops, strings, files, pcall & Hyprland / Neovim config. The Lua sheet has the full reference.",
    "commands": [
      {
        "id": "lua-hub-basics",
        "mode": "LUA",
        "modeClass": "mode-n",
        "desc": "Variables, comments, tables, and the rules that surprise newcomers",
        "cmd": "-- Comment: delete the -- to turn a line on\nlocal server = { host = \"10.0.0.1\", ports = { 22, 8080 } }\nprint(server.host .. \":\" .. server.ports[1])\nprint(#server.ports, server.missing == nil)",
        "flags": [
          [
            "local name = value",
            "Block scope. Without local, the variable is global."
          ],
          [
            "{ key = value }",
            "Table used as a dictionary"
          ],
          [
            "{ \"a\", \"b\" }",
            "Table used as a list, starting at index 1"
          ],
          [
            "..",
            "Concatenate strings"
          ],
          [
            "~=",
            "Not equal"
          ],
          [
            "#t",
            "Length of a list or string"
          ]
        ],
        "tip": "Only false and nil are falsy; 0 and \"\" are true",
        "subcommands": [
          [
            "local port = opts.port or 8080",
            "Use a default when a value is nil or false"
          ],
          [
            "local a, b = 1, 2",
            "Assign several values at once, or swap with a, b = b, a"
          ],
          [
            "print(type(server), tostring(nil))",
            "Check a value's type, or turn it into a string"
          ]
        ],
        "tags": [
          "lua",
          "variables",
          "tables",
          "local",
          "comments",
          "hyprland",
          "neovim"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.lua.org/manual/5.4/manual.html",
              "title": "Lua 5.4 reference manual"
            }
          ]
        }
      },
      {
        "id": "lua-hub-flow-functions",
        "mode": "LUA",
        "modeClass": "mode-n",
        "desc": "Loop over tables, define functions, and catch errors with pcall",
        "cmd": "local function check(temps)\n  for name, temp in pairs(temps) do\n    if temp >= 90 then error(name .. \" too hot\") end\n  end\n  return \"ok\"\nend\nprint(pcall(check, { gpu0 = 71, gpu1 = 95 }))",
        "flags": [
          [
            "pairs(t)",
            "Every key in a table, in no guaranteed order"
          ],
          [
            "ipairs(t)",
            "List items in order"
          ],
          [
            "for i = 1, 10, 2 do ... end",
            "Numeric loop that includes both ends"
          ],
          [
            "if x then ... elseif y then ... end",
            "Every block closes with end"
          ],
          [
            "pcall(f, args)",
            "Call f safely. Returns false and the error if it fails."
          ],
          [
            "obj:method(x)",
            "Shorthand for obj.method(obj, x)"
          ]
        ],
        "tip": "luac -p file.lua checks syntax without running it",
        "subcommands": [
          [
            "for i, host in ipairs(hosts) do print(i, host) end",
            "Loop over a list in order"
          ],
          [
            "while retries > 0 do retries = retries - 1 end",
            "Loop until a condition changes"
          ],
          [
            "local ok, err = pcall(check, temps)",
            "Catch an error: ok is false and err holds the message"
          ]
        ],
        "tags": [
          "lua",
          "loops",
          "pairs",
          "ipairs",
          "functions",
          "pcall",
          "errors"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.lua.org/manual/5.4/manual.html",
              "title": "Lua 5.4 reference manual"
            }
          ]
        }
      },
      {
        "id": "lua-hub-strings-tables",
        "mode": "LUA",
        "modeClass": "mode-n",
        "desc": "Search and format strings, and change lists",
        "cmd": "local line = \"gpu-node-014 degraded\"\nlocal host, state = line:match(\"^(%S+)%s+(%S+)$\")\nprint(string.format(\"%-14s %s\", host, state:upper()))\n\nlocal hosts = { \"node2\", \"node1\" }\ntable.insert(hosts, \"node3\")\ntable.sort(hosts)\nprint(table.concat(hosts, \",\"))",
        "flags": [
          [
            "s:match(pattern)",
            "Return the captured parts of a string"
          ],
          [
            "%s  %S  %d",
            "Lua patterns: space, not space, digit"
          ],
          [
            "string.format(fmt, ...)",
            "Build text from a template, like printf"
          ],
          [
            "table.insert(t, value)",
            "Add to the end of a list"
          ],
          [
            "table.concat(t, sep)",
            "Join a list into one string"
          ]
        ],
        "subcommands": [
          [
            "for word in line:gmatch(\"%S+\") do print(word) end",
            "Split a string on whitespace"
          ],
          [
            "local clean = line:gsub(\"%s+$\", \"\")",
            "Trim trailing spaces. gsub finds and replaces."
          ],
          [
            "table.remove(hosts, 1)",
            "Remove and return the first item"
          ],
          [
            "local copy = { table.unpack(hosts) }",
            "Make a shallow copy of a list. In Neovim, use unpack(hosts) instead."
          ]
        ],
        "tip": "Lua patterns are not regex, so use %d instead of \\d and there is no | for alternatives",
        "tags": [
          "lua",
          "strings",
          "patterns",
          "match",
          "gsub",
          "format",
          "tables",
          "insert",
          "sort",
          "concat"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.lua.org/manual/5.4/manual.html",
              "title": "Lua 5.4 reference manual"
            },
            {
              "url": "https://luajit.org/extensions.html",
              "title": "LuaJIT (Lua 5.1 + extensions)"
            }
          ]
        }
      },
      {
        "id": "lua-hub-files-cli",
        "mode": "LUA",
        "modeClass": "mode-n",
        "desc": "Read files, run commands, and run scripts",
        "cmd": "local f = assert(io.open(\"/etc/hostname\", \"r\"))\nlocal name = f:read(\"l\")\nf:close()\nprint(name)\n\nlocal p = assert(io.popen(\"uname -r\"))\nprint(p:read(\"l\"))\np:close()",
        "flags": [
          [
            "assert(value)",
            "Stop with the error if the value is nil or false"
          ],
          [
            "io.open(path, mode)",
            "Open a file: \"r\" read, \"w\" write, \"a\" append"
          ],
          [
            "f:read(\"l\")",
            "Read one line. \"a\" reads the whole file."
          ],
          [
            "io.popen(command)",
            "Run a shell command and read its output"
          ],
          [
            "arg[1]",
            "First argument passed to the script"
          ]
        ],
        "subcommands": [
          [
            "lua script.lua arg1",
            "Run a script"
          ],
          [
            "lua -e 'print(_VERSION)'",
            "Run one line without a file"
          ],
          [
            "luac -p script.lua",
            "Check syntax without running it"
          ]
        ],
        "tip": "Always close what you open, or use for line in io.lines(path) do ... end, which closes the file for you",
        "tags": [
          "lua",
          "files",
          "io",
          "open",
          "read",
          "popen",
          "cli",
          "arg",
          "luac"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.lua.org/manual/5.4/manual.html",
              "title": "Lua 5.4 reference manual"
            }
          ]
        }
      },
      {
        "id": "lua-hub-config",
        "mode": "LUA",
        "modeClass": "mode-n",
        "desc": "Edit Hyprland and Neovim config files",
        "cmd": "-- ~/.config/hypr/bindings.lua\nhl.unbind(\"SUPER + SHIFT + E\")\no.bind(\"SUPER + SHIFT + E\", \"Email\", { webapp = \"https://mail.google.com\" })\n\n-- ~/.config/nvim/init.lua\nvim.opt.number = true\nvim.keymap.set(\"n\", \"<leader>w\", \"<cmd>write<CR>\", { desc = \"Save file\" })",
        "flags": [
          [
            "o.bind(keys, label, action)",
            "Add an Omarchy keybinding"
          ],
          [
            "hl.unbind(keys)",
            "Remove a default binding before replacing it"
          ],
          [
            "vim.opt.name = value",
            "Set a Neovim option"
          ],
          [
            "vim.keymap.set(mode, keys, action, opts)",
            "Add a Neovim keymap"
          ]
        ],
        "subcommands": [
          [
            "hyprctl configerrors",
            "List Hyprland config problems after you save"
          ],
          [
            "hyprctl reload",
            "Reload the Hyprland config"
          ],
          [
            ":lua print(vim.version().minor)",
            "Run Lua from Neovim's command line"
          ]
        ],
        "tip": "Neovim runs LuaJIT (Lua 5.1), so features from Lua 5.3 and later, such as // and bitwise operators, are unavailable",
        "tags": [
          "lua",
          "hyprland",
          "omarchy",
          "neovim",
          "config",
          "bindings",
          "keymap"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/basecamp/omarchy/blob/quattro/config/hypr/bindings.lua",
              "title": "Omarchy: bindings.lua"
            },
            {
              "url": "https://neovim.io/doc/user/lua-guide/",
              "title": "Neovim: Lua guide"
            },
            {
              "url": "https://wiki.hypr.land/configuring/core/advanced-configuration/using-hyprctl/",
              "title": "Hyprland wiki: hyprctl"
            },
            {
              "url": "https://luajit.org/extensions.html",
              "title": "LuaJIT (Lua 5.1 + extensions)"
            }
          ],
          "note": "o.bind / hl.unbind checked against an Omarchy install and its bindings.lua; hyprctl configerrors is listed by hyprctl --help on Hyprland 0.56.2."
        }
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
            "Slurp several files into one array (-s); add then merges them (objects merge, arrays concatenate)"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://jqlang.org/manual/",
              "title": "jq manual"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://jqlang.org/manual/",
              "title": "jq manual"
            },
            {
              "url": "https://docs.python.org/3/library/json.html",
              "title": "Python: json (and json.tool)"
            },
            {
              "url": "https://www.rfc-editor.org/rfc/rfc8259.html",
              "title": "RFC 8259: JSON"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://yaml.org/spec/1.2.2/",
              "title": "YAML 1.2.2 spec (core schema booleans)"
            },
            {
              "url": "https://yaml.org/type/merge.html",
              "title": "YAML 1.1 merge key (<<)"
            },
            {
              "url": "https://mikefarah.gitbook.io/yq",
              "title": "yq documentation"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://mikefarah.gitbook.io/yq",
              "title": "yq documentation"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://toml.io/en/v1.1.0",
              "title": "TOML 1.1.0 spec"
            },
            {
              "url": "https://docs.python.org/3/library/tomllib.html",
              "title": "Python: tomllib"
            },
            {
              "url": "https://taplo.tamasfe.dev/cli/usage/formatting.html",
              "title": "Taplo: formatting"
            }
          ]
        }
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
            "Asserts that pattern matches directly behind (PCRE2 before 10.43: fixed length; 10.43+: bounded variable length)"
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
            "IPv4-shaped matcher with word boundaries (shape only: also accepts 999.1.1.1)"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.pcre.org/current/doc/html/pcre2pattern.html",
              "title": "PCRE2 pattern syntax"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/grep.1.html",
              "title": "grep(1)"
            }
          ],
          "note": "Corrected 2026-11-10: PCRE2 10.43+ allows bounded variable-length lookbehind."
        }
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
            "Deduplicate lines while preserving exact file order"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man1/gawk.1.html",
              "title": "gawk(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/ps.1.html",
              "title": "ps(1) (RSS in KiB)"
            }
          ]
        }
      },
      {
        "id": "sed-in-place-recipes",
        "mode": "SED",
        "modeClass": "mode-n",
        "desc": "In-place file editing, regex substitution, line deletion and range blocks",
        "cmd": "sed -i.bak 's/^PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man1/sed.1.html",
              "title": "sed(1)"
            }
          ],
          "note": "Changed 2026-11-10: the example no longer disables SELinux."
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://sqlite.org/cli.html",
              "title": "SQLite CLI"
            },
            {
              "url": "https://sqlite.org/json1.html",
              "title": "SQLite JSON functions"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "git-script",
    "badge": "git",
    "title": "Git Version Control",
    "subtitle": "Daily commands, undoing mistakes & scripting against repositories. The Git sheet has the full reference.",
    "commands": [
      {
        "id": "git-hub-daily",
        "mode": "GIT",
        "modeClass": "mode-n",
        "desc": "The everyday loop: check, stage, commit, sync and branch",
        "cmd": "git status -sb\ngit add -p\ngit commit -m \"Fix BMC timeout\"\ngit pull --rebase\ngit push -u origin HEAD",
        "flags": [
          [
            "-sb",
            "Short status, including the branch and how far ahead or behind it is"
          ],
          [
            "add -p",
            "Choose which hunks to stage"
          ],
          [
            "pull --rebase",
            "Put your commits on top of what you pulled"
          ],
          [
            "push -u origin HEAD",
            "Push the current branch and set its upstream"
          ]
        ],
        "subcommands": [
          [
            "git switch -c feature/x",
            "Create a branch and switch to it"
          ],
          [
            "git log --oneline --graph --all -20",
            "See recent history across branches"
          ],
          [
            "git diff --staged",
            "Review what the next commit contains"
          ]
        ],
        "tip": "Run git diff --staged before committing to catch debug lines and secrets",
        "tags": [
          "git",
          "status",
          "add",
          "commit",
          "pull",
          "push",
          "branch"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://git-scm.com/docs/git-status",
              "title": "git status"
            },
            {
              "url": "https://git-scm.com/docs/git-add",
              "title": "git add"
            },
            {
              "url": "https://git-scm.com/docs/git-pull",
              "title": "git pull"
            },
            {
              "url": "https://git-scm.com/docs/git-push",
              "title": "git push"
            },
            {
              "url": "https://git-scm.com/docs/git-switch",
              "title": "git switch"
            },
            {
              "url": "https://git-scm.com/docs/git-log",
              "title": "git log"
            },
            {
              "url": "https://git-scm.com/docs/git-diff",
              "title": "git diff"
            }
          ]
        }
      },
      {
        "id": "git-hub-undo",
        "mode": "GIT",
        "modeClass": "mode-n",
        "desc": "Undo mistakes, from unstaging a file to recovering lost commits",
        "cmd": "git restore --staged path/to/file\ngit reset --soft HEAD~1\ngit revert abc1234\ngit reflog -20",
        "flags": [
          [
            "restore --staged",
            "Unstage a file and keep your edits"
          ],
          [
            "reset --soft HEAD~1",
            "Undo the last commit and keep its changes staged"
          ],
          [
            "revert",
            "Undo a pushed commit by adding a new one"
          ],
          [
            "reflog",
            "List where HEAD has been, so you can recover lost commits"
          ]
        ],
        "subcommands": [
          [
            "git stash push -u -m \"WIP\"",
            "Set work aside, including untracked files"
          ],
          [
            "git clean -nd",
            "Preview which untracked files would be deleted"
          ],
          [
            "git branch recovered HEAD@{2}",
            "Recover a commit found in the reflog"
          ]
        ],
        "tip": "Use git revert on shared branches, because git reset rewrites history",
        "tags": [
          "git",
          "undo",
          "restore",
          "reset",
          "revert",
          "reflog",
          "stash"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://git-scm.com/docs/git-restore",
              "title": "git restore"
            },
            {
              "url": "https://git-scm.com/docs/git-reset",
              "title": "git reset"
            },
            {
              "url": "https://git-scm.com/docs/git-revert",
              "title": "git revert"
            },
            {
              "url": "https://git-scm.com/docs/git-reflog",
              "title": "git reflog"
            },
            {
              "url": "https://git-scm.com/docs/git-stash",
              "title": "git stash"
            },
            {
              "url": "https://git-scm.com/docs/git-clean",
              "title": "git clean"
            }
          ]
        }
      },
      {
        "id": "git-hub-scripts",
        "mode": "GIT",
        "modeClass": "mode-n",
        "desc": "Use git in scripts: check for local edits and report the version",
        "cmd": "cd \"$(git rev-parse --show-toplevel)\"\nif [[ -n \"$(git status --porcelain)\" ]]; then\n  echo \"Refusing to deploy: uncommitted changes\" >&2\n  exit 1\nfi\nVERSION=\"$(git describe --tags --always --dirty)\"\necho \"Deploying $VERSION\"",
        "flags": [
          [
            "--porcelain",
            "Stable status output meant for scripts"
          ],
          [
            "--show-toplevel",
            "Print the top folder of the repository"
          ],
          [
            "describe --always",
            "Name the commit, even if there are no tags"
          ],
          [
            "-C PATH",
            "Run git in PATH without changing folder"
          ]
        ],
        "subcommands": [
          [
            "git -C /opt/tools rev-parse --short HEAD",
            "Print the commit deployed in a folder"
          ],
          [
            "git diff --quiet || echo \"Unstaged changes\"",
            "Use the exit code to detect changes"
          ],
          [
            "git rev-parse --abbrev-ref HEAD",
            "Print the current branch name"
          ]
        ],
        "tip": "Parse --porcelain output, not plain git status, because the plain text can change between versions",
        "tags": [
          "git",
          "scripts",
          "porcelain",
          "rev-parse",
          "describe",
          "deploy",
          "automation"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://git-scm.com/docs/git-rev-parse",
              "title": "git rev-parse"
            },
            {
              "url": "https://git-scm.com/docs/git-status",
              "title": "git status"
            },
            {
              "url": "https://git-scm.com/docs/git-describe",
              "title": "git describe"
            },
            {
              "url": "https://git-scm.com/docs/git",
              "title": "git (-C)"
            },
            {
              "url": "https://git-scm.com/docs/git-diff",
              "title": "git diff"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "markdown-script",
    "badge": "md",
    "title": "Markdown",
    "subtitle": "Formatting, tables & collapsible logs for tickets and READMEs. The Markdown sheet has the full reference.",
    "commands": [
      {
        "id": "md-hub-basics",
        "mode": "MARKDOWN",
        "modeClass": "mode-n",
        "desc": "The syntax you use every day: headings, emphasis, lists, links and code",
        "cmd": "# Title\n## Section\n\n**bold**  *italic*  `inline code`\n\n- Bullet\n  - Nested bullet\n1. Numbered step\n- [ ] Open task\n\n[Link text](https://example.com)\n\n```bash\nnvidia-smi -q -d ECC\n```",
        "flags": [
          [
            "# to ######",
            "Heading levels 1 to 6, with a space after the marks"
          ],
          [
            "**text** / *text*",
            "Bold and italic"
          ],
          [
            "- [ ] / - [x]",
            "Open and checked task boxes"
          ],
          [
            "```lang",
            "Fenced code block with highlighting"
          ]
        ],
        "subcommands": [
          [
            "> [!WARNING]\n> Drain the node first.",
            "GitHub alert box"
          ],
          [
            "[Jump](#root-cause)",
            "Link to a heading in the same file"
          ],
          [
            "\\*not italic\\*",
            "Backslash shows a special character literally"
          ]
        ],
        "tip": "Leave a blank line around headings, lists and code blocks so every renderer reads them the same way",
        "tags": [
          "markdown",
          "md",
          "headings",
          "lists",
          "links",
          "code",
          "gfm"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://spec.commonmark.org/0.31.2/",
              "title": "CommonMark 0.31.2 spec"
            },
            {
              "url": "https://github.github.com/gfm/",
              "title": "GitHub Flavored Markdown spec (tables, task lists)"
            },
            {
              "url": "https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax",
              "title": "GitHub: basic writing and formatting (alerts)"
            }
          ]
        }
      },
      {
        "id": "md-hub-tables",
        "mode": "MARKDOWN",
        "modeClass": "mode-n",
        "desc": "Tables with alignment, and a table built from command output",
        "cmd": "| GPU | BDF          | Temp |\n|:----|:-------------|-----:|\n| 3   | 0000:8a:00.0 |  88C |\n\nnvidia-smi --query-gpu=index,pci.bus_id,temperature.gpu --format=csv,noheader \\\n  | awk -F', ' '{ printf \"| %s | %s | %sC |\\n\", $1, $2, $3 }'",
        "flags": [
          [
            ":--- / ---: / :---:",
            "Left, right and center alignment"
          ],
          [
            "\\|",
            "Pipe character inside a cell"
          ],
          [
            "<br>",
            "Line break inside a cell"
          ]
        ],
        "subcommands": [
          [
            "pandoc -f csv -t gfm data.csv",
            "Convert a CSV to a Markdown table"
          ]
        ],
        "tip": "Right-align number columns so values are easy to compare",
        "tags": [
          "markdown",
          "tables",
          "awk",
          "nvidia-smi",
          "csv"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.github.com/gfm/",
              "title": "GitHub Flavored Markdown spec (tables, task lists)"
            },
            {
              "url": "https://pandoc.org/MANUAL.html",
              "title": "Pandoc manual"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "nvidia-smi documentation"
            }
          ]
        }
      },
      {
        "id": "md-hub-details",
        "mode": "MARKDOWN",
        "modeClass": "mode-n",
        "desc": "Fold long logs into a collapsible section in a ticket or PR",
        "cmd": "<details>\n<summary>Full dmesg output</summary>\n\n```text\n...\n```\n\n</details>",
        "flags": [
          [
            "<details open>",
            "Start expanded"
          ],
          [
            "<summary>",
            "The clickable title line"
          ]
        ],
        "subcommands": [
          [
            "glow summary.md",
            "Preview rendered Markdown in the terminal"
          ],
          [
            "pandoc summary.md -o summary.docx",
            "Convert to Word"
          ]
        ],
        "tip": "Leave blank lines inside <details>, or the Markdown in it won't render",
        "tags": [
          "markdown",
          "details",
          "summary",
          "collapse",
          "logs",
          "ticket"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-collapsed-sections",
              "title": "GitHub: collapsed sections"
            },
            {
              "url": "https://github.com/charmbracelet/glow",
              "title": "glow"
            },
            {
              "url": "https://pandoc.org/MANUAL.html",
              "title": "Pandoc manual"
            }
          ]
        }
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("scripting_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM References
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
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
renderCategoryTabs();
renderSections();
initEvents();
