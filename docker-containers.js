// docker-containers.js
// Standalone interactive cheat sheet for Containers: Docker Containers: run, ps, logs, exec & inspect
const CTR_DOCKER_CONTAINERS_DATA = [
  {
    "id": "docker-containers-cmd-1",
    "badge": "run",
    "title": "Docker Containers: List all containers",
    "subtitle": "List all containers (running and stopped) as a readable table",
    "commands": [
      {
        "id": "docker-ps-table",
        "desc": "List all containers (running and stopped) as a readable table",
        "cmd": "docker ps -a --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}'",
        "details": "",
        "flags": [
          [
            "-a / --all",
            "Include stopped containers. Without it you only see running ones, so a crashed container looks like it vanished"
          ],
          [
            "--format 'table ...'",
            "Go template: {{.Names}}, {{.Image}}, {{.Status}}, {{.Ports}} pick columns, \\t separates them, 'table' adds a header row"
          ],
          [
            "Status column",
            "'Up 3 hours' = running; 'Exited (137)' = killed (137 = 128 + signal 9, often the OOM killer); 'Exited (0)' = finished normally"
          ],
          [
            "-q",
            "Print only container IDs, useful for loops: docker ps -q"
          ],
          [
            "--filter status=exited",
            "Show only containers in one state (running, exited, restarting, paused)"
          ]
        ],
        "tip": "Exit 137 = SIGKILL, usually out of memory",
        "tags": [
          "docker",
          "containers",
          "ps",
          "list",
          "status",
          "exited",
          "format"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/ls/",
              "title": "docker ps (container ls)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-containers-cmd-2",
    "badge": "run",
    "title": "Docker Containers: Run a container in the background with a name, a restart policy and a published port",
    "subtitle": "Run a container in the background with a name, a restart policy and a published port (changes state)",
    "commands": [
      {
        "id": "docker-run-detached",
        "desc": "Run a container in the background with a name, a restart policy and a published port (changes state)",
        "cmd": "docker run -d --name <name> --restart unless-stopped -p 8080:80 <image>:<tag>",
        "details": "",
        "flags": [
          [
            "-d",
            "Detached: run in the background and print the container ID"
          ],
          [
            "--name <name>",
            "A fixed name, so later commands can use it instead of a random ID"
          ],
          [
            "--restart unless-stopped",
            "Restart after crashes and reboots, unless you stopped it yourself. Other values: no, on-failure[:N], always"
          ],
          [
            "-p 8080:80",
            "Publish container port 80 on host port 8080 (host:container order)"
          ],
          [
            "--rm",
            "Delete the container when it exits; good for one-off commands, never combine with a restart policy"
          ],
          [
            "-e KEY=value / --env-file .env",
            "Set environment variables"
          ]
        ],
        "tip": "Ports are host:container",
        "tags": [
          "docker",
          "containers",
          "run",
          "start",
          "detached",
          "restart",
          "port",
          "publish"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/run/",
              "title": "docker run"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stop/",
              "title": "docker stop"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/start/",
              "title": "docker start"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/rm/",
              "title": "docker rm"
            }
          ],
          "note": "Checked against Docker Engine 29.9.3 docs. Exit codes 125/126/127 (on the Pro Tip) are not on the current docker run reference page."
        }
      },
      {
        "id": "docker-run-detached-sub-1",
        "desc": "Throwaway interactive container: gone as soon as you exit the shell",
        "cmd": "docker run --rm -it ubuntu:24.04 bash",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "run",
          "start",
          "detached"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/run/",
              "title": "docker run"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stop/",
              "title": "docker stop"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/start/",
              "title": "docker start"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/rm/",
              "title": "docker rm"
            }
          ],
          "note": "Checked against Docker Engine 29.9.3 docs. Exit codes 125/126/127 (on the Pro Tip) are not on the current docker run reference page."
        }
      },
      {
        "id": "docker-run-detached-sub-2",
        "desc": "Send SIGTERM, then SIGKILL after 10 s (changes state)",
        "cmd": "docker stop <container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "run",
          "start",
          "detached"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/run/",
              "title": "docker run"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stop/",
              "title": "docker stop"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/start/",
              "title": "docker start"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/rm/",
              "title": "docker rm"
            }
          ],
          "note": "Checked against Docker Engine 29.9.3 docs. Exit codes 125/126/127 (on the Pro Tip) are not on the current docker run reference page."
        }
      },
      {
        "id": "docker-run-detached-sub-3",
        "desc": "Start a stopped container again with its original settings (changes state)",
        "cmd": "docker start <container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "run",
          "start",
          "detached"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/run/",
              "title": "docker run"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stop/",
              "title": "docker stop"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/start/",
              "title": "docker start"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/rm/",
              "title": "docker rm"
            }
          ],
          "note": "Checked against Docker Engine 29.9.3 docs. Exit codes 125/126/127 (on the Pro Tip) are not on the current docker run reference page."
        }
      },
      {
        "id": "docker-run-detached-sub-4",
        "desc": "Stop then start (changes state)",
        "cmd": "docker restart <container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "run",
          "start",
          "detached"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/run/",
              "title": "docker run"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stop/",
              "title": "docker stop"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/start/",
              "title": "docker start"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/rm/",
              "title": "docker rm"
            }
          ],
          "note": "Checked against Docker Engine 29.9.3 docs. Exit codes 125/126/127 (on the Pro Tip) are not on the current docker run reference page."
        }
      },
      {
        "id": "docker-run-detached-sub-5",
        "desc": "Delete a stopped container; its writable layer is lost (changes state)",
        "cmd": "docker rm <container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "run",
          "start",
          "detached"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/run/",
              "title": "docker run"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stop/",
              "title": "docker stop"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/start/",
              "title": "docker start"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/rm/",
              "title": "docker rm"
            }
          ],
          "note": "Checked against Docker Engine 29.9.3 docs. Exit codes 125/126/127 (on the Pro Tip) are not on the current docker run reference page."
        }
      }
    ]
  },
  {
    "id": "docker-containers-cmd-3",
    "badge": "run",
    "title": "Docker Containers: Read the last 200 log lines of a container with timestamps",
    "subtitle": "Read the last 200 log lines of a container with timestamps",
    "commands": [
      {
        "id": "docker-logs-tail",
        "desc": "Read the last 200 log lines of a container with timestamps",
        "cmd": "docker logs --tail 200 --timestamps <container>",
        "details": "",
        "flags": [
          [
            "--tail 200",
            "Only the last 200 lines; without it Docker prints the whole log"
          ],
          [
            "--timestamps / -t",
            "Prefix each line with the time Docker received it, to line up with dmesg or the BMC SEL"
          ],
          [
            "--since 30m",
            "Only lines from the last 30 minutes (also accepts a timestamp like 2026-11-06T12:00)"
          ],
          [
            "-f",
            "Follow new lines live (Ctrl+C to stop)"
          ]
        ],
        "tip": "Apps often log to stderr: add 2>&1 before grep",
        "tags": [
          "docker",
          "containers",
          "logs",
          "tail",
          "follow",
          "stderr",
          "timestamps"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/logs/",
              "title": "docker logs"
            }
          ]
        }
      },
      {
        "id": "docker-logs-tail-sub-1",
        "desc": "Errors from the last 30 minutes. 2>&1 merges stderr, where many apps write errors",
        "cmd": "docker logs --since 30m <container> 2>&1 | grep -i error",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "logs",
          "tail",
          "follow"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/logs/",
              "title": "docker logs"
            }
          ]
        }
      },
      {
        "id": "docker-logs-tail-sub-2",
        "desc": "Follow live output, starting from the last 50 lines",
        "cmd": "docker logs -f --tail 50 <container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "logs",
          "tail",
          "follow"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/logs/",
              "title": "docker logs"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-containers-cmd-4",
    "badge": "run",
    "title": "Docker Containers: Run a command inside a running container, or open a shell in it",
    "subtitle": "Run a command inside a running container, or open a shell in it",
    "commands": [
      {
        "id": "docker-exec-shell",
        "desc": "Run a command inside a running container, or open a shell in it",
        "cmd": "docker exec <container> cat /etc/os-release",
        "details": "",
        "flags": [
          [
            "docker exec <c> <cmd>",
            "Runs <cmd> inside the container's namespaces; the container must already be running"
          ],
          [
            "-it",
            "-i keeps stdin open and -t allocates a terminal: both are needed for an interactive shell"
          ],
          [
            "sh vs bash",
            "Slim images often have no bash. Try sh if bash gives 'executable file not found'"
          ],
          [
            "-u 0",
            "Run as root inside the container, for debugging an image that drops privileges"
          ]
        ],
        "tip": "No bash? Use sh",
        "tags": [
          "docker",
          "containers",
          "exec",
          "shell",
          "sh",
          "bash",
          "interactive"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/exec/",
              "title": "docker exec"
            }
          ]
        }
      },
      {
        "id": "docker-exec-shell-sub-1",
        "desc": "Interactive shell inside the container (exit with Ctrl+D)",
        "cmd": "docker exec -it <container> sh",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "exec",
          "shell",
          "sh"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/exec/",
              "title": "docker exec"
            }
          ]
        }
      },
      {
        "id": "docker-exec-shell-sub-2",
        "desc": "Show the environment variables the app actually sees",
        "cmd": "docker exec <container> env",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "exec",
          "shell",
          "sh"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/exec/",
              "title": "docker exec"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-containers-cmd-5",
    "badge": "run",
    "title": "Docker Containers: Find out why a container stopped",
    "subtitle": "Find out why a container stopped: state, exit code, OOM kill and restart count",
    "commands": [
      {
        "id": "docker-inspect-state",
        "desc": "Find out why a container stopped: state, exit code, OOM kill and restart count",
        "cmd": "docker inspect <container> --format '{{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}'",
        "details": "",
        "flags": [
          [
            "docker inspect",
            "Prints the full container configuration and state as JSON"
          ],
          [
            "--format '{{...}}'",
            "Go template that pulls single fields out of that JSON"
          ],
          [
            "oom=true",
            "The kernel's OOM killer stopped it: raise the memory limit or fix the leak. Confirm with dmesg -T | grep -i oom"
          ],
          [
            "restarts=N rising",
            "The restart policy keeps bringing it back: a crash loop. Read docker logs from just before each restart"
          ]
        ],
        "tip": "Exited + oom=true → memory limit",
        "tags": [
          "docker",
          "containers",
          "inspect",
          "state",
          "exitcode",
          "oom",
          "restart",
          "stats",
          "debug"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/inspect/",
              "title": "docker inspect"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stats/",
              "title": "docker stats"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/top/",
              "title": "docker top"
            }
          ]
        }
      },
      {
        "id": "docker-inspect-state-sub-1",
        "desc": "Which host paths and volumes are mounted, via jq",
        "cmd": "docker inspect <container> | jq '.[0].Mounts'",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "inspect",
          "state",
          "exitcode"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/inspect/",
              "title": "docker inspect"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stats/",
              "title": "docker stats"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/top/",
              "title": "docker top"
            }
          ]
        }
      },
      {
        "id": "docker-inspect-state-sub-2",
        "desc": "One snapshot of CPU, memory, network and disk I/O per container (without --no-stream it keeps refreshing)",
        "cmd": "docker stats --no-stream",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "inspect",
          "state",
          "exitcode"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/inspect/",
              "title": "docker inspect"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stats/",
              "title": "docker stats"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/top/",
              "title": "docker top"
            }
          ]
        }
      },
      {
        "id": "docker-inspect-state-sub-3",
        "desc": "Processes running inside the container, as seen from the host",
        "cmd": "docker top <container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "inspect",
          "state",
          "exitcode"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/inspect/",
              "title": "docker inspect"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/stats/",
              "title": "docker stats"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/top/",
              "title": "docker top"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-containers-pro-tips",
    "badge": "tip",
    "title": "Docker Containers: Pro Tip",
    "subtitle": "Read the state before you restart anything",
    "commands": [
      {
        "id": "docker-containers-tips-card",
        "desc": "Read the state before you restart anything",
        "cmd": "docker ps -a --filter status=exited --format '{{.Names}} {{.Status}}'",
        "details": "When a service is down, the evidence is in the stopped container: its exit code, its last log lines and whether the OOM killer hit it. docker rm or a restart with --rm throws that evidence away. Capture docker logs and docker inspect first, then restart.",
        "flags": [
          [
            "Exit 0",
            "The process finished on its own; check the command or entrypoint"
          ],
          [
            "Exit 1 / 2",
            "The application reported an error; read its logs"
          ],
          [
            "Exit 125 / 126 / 127",
            "Docker could not start it: bad option, not executable, or command not found"
          ],
          [
            "Exit 137",
            "Killed with SIGKILL: OOM killer or docker kill"
          ],
          [
            "Exit 143",
            "Stopped with SIGTERM: a normal docker stop"
          ]
        ],
        "tip": "Capture logs + inspect output into cases/<host>/logs/ before restarting",
        "tags": [
          "docker",
          "containers",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/ls/",
              "title": "docker ps"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/logs/",
              "title": "docker logs"
            }
          ],
          "note": "Exit codes 125/126/127 are Docker's long-standing convention but are not on the current docker run reference page."
        }
      }
    ]
  }
];

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("docker-containers_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
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

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  if (!toastEl) return;
  toastTextEl.textContent = msg;
  toastEl.classList.add("visible");
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
    toastEl.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
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
  showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
}

// Command Syntax Highlighting
function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return '<span class="tok-str">' + strLiteral + '</span>';
      if (flagPart) return '<span class="tok-flag">' + flagPart + '</span>';
      if (operatorPart) return '<span class="tok-pipe">' + operatorPart + '</span>';
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? '<span class="tok-pipe">' + sudoPart + '</span>' : "";
        return prefix + sudoHtml + '<span class="tok-cmd">' + cmdName + '</span>';
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = CTR_DOCKER_CONTAINERS_DATA;
  const totalCmds = allCards.reduce((acc, c) => acc + c.commands.length, 0);

  const optionsHtml = [
    '<option value="all"' + (state.activeCategory === "all" ? " selected" : "") + '>All Topics (' + totalCmds + ' items)</option>'
  ];

  for (const card of allCards) {
    const isSelected = state.activeCategory === card.id ? " selected" : "";
    optionsHtml.push(
      '<option value="' + escapeHtml(card.id) + '"' + isSelected + '>' +
      escapeHtml(card.title) + ' (' + card.commands.length + ')' +
      '</option>'
    );
  }

  const resetBtnHtml = state.activeCategory !== "all"
    ? '<button type="button" class="cat-reset-btn" id="cat-reset-btn" title="Show all topics">✕ Show All</button>'
    : "";

  categoryTabsEl.innerHTML =
    '<div class="cat-dropdown-wrap">' +
      '<label class="cat-dropdown-label" for="category-select">Topic:</label>' +
      '<select id="category-select" class="cat-select" aria-label="Filter by topic">' +
        optionsHtml.join("") +
      '</select>' +
      resetBtnHtml +
    '</div>';

  const catSelect = document.getElementById("category-select");
  if (catSelect) {
    catSelect.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderCategoryTabs();
      renderSections();
    });
  }

  const catReset = document.getElementById("cat-reset-btn");
  if (catReset) {
    catReset.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmd, searchTerms) {
  if (!searchTerms.length) return true;
  const target = [
    cmd.cmd || "",
    cmd.desc || "",
    cmd.details || "",
    cmd.tip || "",
    (cmd.tags || []).join(" "),
    (cmd.flags || []).map(([f, d]) => f + " " + d).join(" ")
  ].join(" ").toLowerCase();

  return searchTerms.every(term => target.includes(term));
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

let masonryResizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("fullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("webkitfullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const card of CTR_DOCKER_CONTAINERS_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== card.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const filteredCommands = card.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) return false;
      return matchesSearch(cmd, searchTerms);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const commandsHtml = filteredCommands.map((cmd) => {
      const isBookmarked = state.bookmarks.has(cmd.id);

      const flagsHtml = (cmd.flags && cmd.flags.length > 0)
        ? '<div class="flag-pills">' + cmd.flags.map(([f, d]) =>
            '<span class="flag-pill"><strong class="flag-token">' + escapeHtml(f) + '</strong> <span class="flag-desc">' + escapeHtml(d) + '</span></span>'
          ).join("") + '</div>'
        : "";

      const detailsHtml = cmd.details
        ? '<p class="cmd-details">' + escapeHtml(cmd.details) + '</p>'
        : "";

      const tipHtml = cmd.tip
        ? '<div class="cmd-tip"><span class="tip-badge">TIP</span>' + escapeHtml(cmd.tip) + '</div>'
        : "";

      const copyTarget = cmd.cmd.includes("   |   ")
        ? cmd.cmd.split("   |   ")[0].trim()
        : cmd.cmd.trim();

      const codeBoxHtml = cmd.diagram
        ? window.CheatSheetCommon.renderDiagram(cmd.diagram)
        : cmd.hideCode ? "" : [
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <span class="copy-hint">Copy</span>',
        '  </div>'
      ].join("\n");

      return [
        '<div class="cmd-item" id="cmd-' + escapeHtml(cmd.id) + '" data-cmd-id="' + escapeHtml(cmd.id) + '">',
        '  <div class="cmd-header-row">',
        '    <div class="cmd-desc">',
        '      <span>' + escapeHtml(cmd.desc) + '</span>',
        '    </div>',
        '    <button',
        '      type="button"',
        '      class="bookmark-btn ' + (isBookmarked ? "bookmarked" : "") + '"',
        '      data-cmd-id="' + escapeHtml(cmd.id) + '"',
        '      title="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '      aria-label="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '    >',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <path fill="' + (isBookmarked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        '      </svg>',
        '    </button>',
        '  </div>',
        '',
        '  ' + codeBoxHtml,
        '  ' + detailsHtml,
        '  ' + flagsHtml,
        '  ' + tipHtml,
        '</div>'
      ].join("\n");
    }).join("\n");

    cardsHtml.push([
      '<article class="section-card" id="sec-' + escapeHtml(card.id) + '">',
      '  <header class="section-header">',
      '    <div class="section-title-wrap">',
      '      <span class="section-badge">' + escapeHtml(card.badge) + '</span>',
      '      <div>',
      '        <h2 class="section-title">' + escapeHtml(card.title) + '</h2>',
      '        <p class="section-subtitle">' + escapeHtml(card.subtitle) + '</p>',
      '      </div>',
      '    </div>',
      '    <span class="count-badge">' + filteredCommands.length + '</span>',
      '  </header>',
      '  <div class="command-list">',
      commandsHtml,
      '  </div>',
      '</article>'
    ].join("\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\n");
  visibleCountEl.textContent = visibleCommandsCount;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }

  packMasonry();
}

function updateSavedCount() {
  savedCountEl.textContent = state.bookmarks.size;
  if (state.bookmarks.size > 0) {
    savedFilterBtn.classList.add("has-saved");
  } else {
    savedFilterBtn.classList.remove("has-saved");
  }
}

function initEventListeners() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderSections();
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.savedOnly = false;
    state.activeCategory = "all";
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
    searchInput.focus();
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
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
    localStorage.setItem("linux_cs_theme", state.theme);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      state.searchQuery = "";
      renderSections();
      searchInput.blur();
    }
  });

  sectionsContainer.addEventListener("click", (e) => {
    const codeBox = e.target.closest(".cmd-code-box");
    if (codeBox) {
      const cmdText = codeBox.getAttribute("data-cmd");
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const cmdId = bookmarkBtn.getAttribute("data-cmd-id");
      if (cmdId) {
        if (state.bookmarks.has(cmdId)) {
          state.bookmarks.delete(cmdId);
          bookmarkBtn.classList.remove("bookmarked");
        } else {
          state.bookmarks.add(cmdId);
          bookmarkBtn.classList.add("bookmarked");
        }
        localStorage.setItem("docker-containers_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    sunIcon?.classList.add("hidden");
    moonIcon?.classList.remove("hidden");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    sunIcon?.classList.remove("hidden");
    moonIcon?.classList.add("hidden");
  }
}

function init() {
  applyTheme(state.theme);
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
