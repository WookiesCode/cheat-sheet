// containers.js
// Standalone interactive cheat sheet for Containers: Containers Hub (Docker & Kubernetes)
const CONTAINERS_CHEAT_SHEET_DATA = [
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
  },
  {
    "id": "docker-images-cmd-1",
    "badge": "img",
    "title": "Docker Images: List local images with their size and digest",
    "subtitle": "List local images with their size and digest",
    "commands": [
      {
        "id": "docker-image-ls",
        "desc": "List local images with their size and digest",
        "cmd": "docker image ls --digests",
        "details": "",
        "flags": [
          [
            "REPOSITORY:TAG",
            "The human name. Tags move: :latest today may be a different image tomorrow"
          ],
          [
            "--digests",
            "Show the sha256 content digest, which never changes for the same image"
          ],
          [
            "<none>:<none>",
            "Dangling images: old layers left behind when a tag moved to a newer build"
          ]
        ],
        "tip": "Pin production images by digest",
        "tags": [
          "docker",
          "containers",
          "images",
          "ls",
          "digest",
          "size",
          "df"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/ls/",
              "title": "docker image ls"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/df/",
              "title": "docker system df"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/history/",
              "title": "docker history"
            }
          ]
        }
      },
      {
        "id": "docker-image-ls-sub-1",
        "desc": "Disk used by images, containers, volumes and build cache, and how much is reclaimable",
        "cmd": "docker system df",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "images",
          "ls",
          "digest"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/ls/",
              "title": "docker image ls"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/df/",
              "title": "docker system df"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/history/",
              "title": "docker history"
            }
          ]
        }
      },
      {
        "id": "docker-image-ls-sub-2",
        "desc": "The layers of an image and the Dockerfile step that created each one",
        "cmd": "docker history --no-trunc <image>:<tag>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "images",
          "ls",
          "digest"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/ls/",
              "title": "docker image ls"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/df/",
              "title": "docker system df"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/history/",
              "title": "docker history"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-images-cmd-2",
    "badge": "img",
    "title": "Docker Images: Build an image from the Dockerfile in the current directory and tag it",
    "subtitle": "Build an image from the Dockerfile in the current directory and tag it (BuildKit is the default builder)",
    "commands": [
      {
        "id": "docker-build-tag",
        "desc": "Build an image from the Dockerfile in the current directory and tag it (BuildKit is the default builder)",
        "cmd": "docker build -t <name>:<tag> .",
        "details": "",
        "flags": [
          [
            "-t <name>:<tag>",
            "Name the result. Use real version tags (1.4.2), not only :latest"
          ],
          [
            ". (build context)",
            "The directory sent to the builder. Everything in it is uploaded, so add a .dockerignore"
          ],
          [
            "-f <path>",
            "Use a Dockerfile with a different name or location"
          ],
          [
            "--no-cache",
            "Rebuild every step instead of reusing cached layers"
          ],
          [
            "--build-arg KEY=value",
            "Pass an ARG value into the Dockerfile at build time"
          ],
          [
            "--platform linux/amd64",
            "Build for another CPU architecture (needs buildx/QEMU for cross builds)"
          ]
        ],
        "tip": "Add a .dockerignore so .git and data aren't uploaded",
        "tags": [
          "docker",
          "containers",
          "build",
          "buildkit",
          "buildx",
          "dockerfile",
          "tag"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/buildx/build/",
              "title": "docker build (buildx)"
            },
            {
              "url": "https://docs.docker.com/build/buildkit/",
              "title": "BuildKit"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/builder/prune/",
              "title": "docker builder prune"
            }
          ]
        }
      },
      {
        "id": "docker-build-tag-sub-1",
        "desc": "List builders and the platforms they can build for",
        "cmd": "docker buildx ls",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "build",
          "buildkit",
          "buildx"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/buildx/build/",
              "title": "docker build (buildx)"
            },
            {
              "url": "https://docs.docker.com/build/buildkit/",
              "title": "BuildKit"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/builder/prune/",
              "title": "docker builder prune"
            }
          ]
        }
      },
      {
        "id": "docker-build-tag-sub-2",
        "desc": "Delete the build cache when disk is tight (changes state)",
        "cmd": "docker builder prune",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "build",
          "buildkit",
          "buildx"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/buildx/build/",
              "title": "docker build (buildx)"
            },
            {
              "url": "https://docs.docker.com/build/buildkit/",
              "title": "BuildKit"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/builder/prune/",
              "title": "docker builder prune"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-images-cmd-3",
    "badge": "img",
    "title": "Docker Images: Minimal Dockerfile for a small Python tool, with the layer-caching order explained",
    "subtitle": "Minimal Dockerfile for a small Python tool, with the layer-caching order explained",
    "commands": [
      {
        "id": "dockerfile-minimal",
        "desc": "Minimal Dockerfile for a small Python tool, with the layer-caching order explained",
        "cmd": "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nUSER 1000\nCMD [\"python\", \"main.py\"]",
        "details": "",
        "flags": [
          [
            "FROM",
            "The base image. -slim variants are much smaller than the full image"
          ],
          [
            "COPY requirements.txt before COPY . .",
            "Dependencies change less often than code, so this layer stays cached and rebuilds are fast"
          ],
          [
            "RUN",
            "Runs at build time and creates a layer. Each RUN, COPY and ADD adds a layer"
          ],
          [
            "USER 1000",
            "Run as a non-root user; root in a container is still root on shared kernels"
          ],
          [
            "CMD [\"...\"] (exec form)",
            "JSON array form: the app gets signals directly, so docker stop works cleanly"
          ]
        ],
        "tip": "Order steps from least to most often changed",
        "tags": [
          "docker",
          "containers",
          "dockerfile",
          "from",
          "run",
          "copy",
          "cmd",
          "layers",
          "cache"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/dockerfile/",
              "title": "Dockerfile reference"
            },
            {
              "url": "https://docs.docker.com/build/building/best-practices/",
              "title": "Dockerfile best practices"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-images-cmd-4",
    "badge": "img",
    "title": "Docker Images: Pull an image, retag it for a private registry and push it",
    "subtitle": "Pull an image, retag it for a private registry and push it (push changes the registry)",
    "commands": [
      {
        "id": "docker-pull-tag-push",
        "desc": "Pull an image, retag it for a private registry and push it (push changes the registry)",
        "cmd": "docker pull <image>:<tag>",
        "details": "",
        "flags": [
          [
            "docker pull",
            "Downloads layers you don't already have"
          ],
          [
            "docker tag <src> <registry>/<repo>:<tag>",
            "Adds a second name pointing at the same image; nothing is copied"
          ],
          [
            "docker push",
            "Uploads to the registry named at the start of the tag (needs docker login first)"
          ]
        ],
        "tip": "A tag is just a pointer",
        "tags": [
          "docker",
          "containers",
          "pull",
          "push",
          "tag",
          "registry"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/pull/",
              "title": "docker pull"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/tag/",
              "title": "docker tag"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/push/",
              "title": "docker push"
            }
          ]
        }
      },
      {
        "id": "docker-pull-tag-push-sub-1",
        "desc": "Retag for your own registry",
        "cmd": "docker tag <image>:<tag> <registry>/<repo>:<tag>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "pull",
          "push",
          "tag"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/pull/",
              "title": "docker pull"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/tag/",
              "title": "docker tag"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/push/",
              "title": "docker push"
            }
          ]
        }
      },
      {
        "id": "docker-pull-tag-push-sub-2",
        "desc": "Upload to that registry (changes state)",
        "cmd": "docker push <registry>/<repo>:<tag>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "pull",
          "push",
          "tag"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/pull/",
              "title": "docker pull"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/tag/",
              "title": "docker tag"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/push/",
              "title": "docker push"
            }
          ]
        }
      },
      {
        "id": "docker-pull-tag-push-sub-3",
        "desc": "Check the image matches the host CPU (amd64 vs arm64)",
        "cmd": "docker image inspect <image>:<tag> --format '{{.Architecture}} {{.Os}}'",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "pull",
          "push",
          "tag"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/pull/",
              "title": "docker pull"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/tag/",
              "title": "docker tag"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/push/",
              "title": "docker push"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-images-cmd-5",
    "badge": "img",
    "title": "Docker Images: Move an image to an air-gapped host as a tar file",
    "subtitle": "Move an image to an air-gapped host as a tar file",
    "commands": [
      {
        "id": "docker-save-load-airgap",
        "desc": "Move an image to an air-gapped host as a tar file",
        "cmd": "docker save -o <name>.tar <image>:<tag>",
        "details": "",
        "flags": [
          [
            "docker save -o <file>.tar",
            "Writes the image, all its layers and tags into one tar file"
          ],
          [
            "docker load -i <file>.tar",
            "Imports that tar on the other host; the original tag comes with it"
          ],
          [
            "gzip / zstd",
            "Compress for transfer: docker save <image> | zstd > <file>.tar.zst"
          ],
          [
            "save vs export",
            "save keeps layers and tags (an image); export flattens a container's filesystem and loses them"
          ]
        ],
        "tip": "Checksum the tar on both ends",
        "tags": [
          "docker",
          "containers",
          "save",
          "load",
          "airgap",
          "offline",
          "tar",
          "transfer",
          "ctr",
          "containerd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/save/",
              "title": "docker save"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/load/",
              "title": "docker load"
            }
          ]
        }
      },
      {
        "id": "docker-save-load-airgap-sub-1",
        "desc": "Import the image on the target host (changes state)",
        "cmd": "docker load -i <name>.tar",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "save",
          "load",
          "airgap"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/save/",
              "title": "docker save"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/load/",
              "title": "docker load"
            }
          ]
        }
      },
      {
        "id": "docker-save-load-airgap-sub-2",
        "desc": "Checksum before and after copying, to catch a truncated transfer",
        "cmd": "sha256sum <name>.tar",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "save",
          "load",
          "airgap"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/save/",
              "title": "docker save"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/load/",
              "title": "docker load"
            }
          ]
        }
      },
      {
        "id": "docker-save-load-airgap-sub-3",
        "desc": "Import into containerd's Kubernetes namespace on a node with no Docker (changes state)",
        "cmd": "ctr -n k8s.io images import <name>.tar",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "save",
          "load",
          "airgap"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/save/",
              "title": "docker save"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/load/",
              "title": "docker load"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-images-cmd-6",
    "badge": "img",
    "title": "Docker Images: Reclaim disk space from stopped containers, unused images and build cache",
    "subtitle": "Reclaim disk space from stopped containers, unused images and build cache (changes state)",
    "commands": [
      {
        "id": "docker-prune",
        "desc": "Reclaim disk space from stopped containers, unused images and build cache (changes state)",
        "cmd": "docker system prune",
        "details": "",
        "flags": [
          [
            "docker system prune",
            "Removes stopped containers, unused networks, dangling images and build cache; asks for confirmation"
          ],
          [
            "-a",
            "Also removes every image not used by a container, which means re-pulling later"
          ],
          [
            "--volumes",
            "Also removes unused anonymous volumes (named volumes are kept): still deletes data, never use it casually"
          ],
          [
            "-f",
            "Skip the confirmation prompt; avoid in scripts unless you are sure"
          ]
        ],
        "tip": "Run docker system df first; never add --volumes blindly",
        "tags": [
          "docker",
          "containers",
          "prune",
          "cleanup",
          "disk",
          "space",
          "df"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/prune/",
              "title": "docker system prune"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/prune/",
              "title": "docker image prune"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/prune/",
              "title": "docker container prune"
            }
          ],
          "note": "Corrected 2026-11-09: --volumes (and docker volume prune without -a) removes only anonymous volumes; named volumes are kept."
        }
      },
      {
        "id": "docker-prune-sub-1",
        "desc": "See exactly what is using space before you prune",
        "cmd": "docker system df -v",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "prune",
          "cleanup",
          "disk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/prune/",
              "title": "docker system prune"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/prune/",
              "title": "docker image prune"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/prune/",
              "title": "docker container prune"
            }
          ],
          "note": "Corrected 2026-11-09: --volumes (and docker volume prune without -a) removes only anonymous volumes; named volumes are kept."
        }
      },
      {
        "id": "docker-prune-sub-2",
        "desc": "Only dangling images (changes state)",
        "cmd": "docker image prune",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "prune",
          "cleanup",
          "disk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/prune/",
              "title": "docker system prune"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/prune/",
              "title": "docker image prune"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/prune/",
              "title": "docker container prune"
            }
          ],
          "note": "Corrected 2026-11-09: --volumes (and docker volume prune without -a) removes only anonymous volumes; named volumes are kept."
        }
      },
      {
        "id": "docker-prune-sub-3",
        "desc": "Only stopped containers (changes state)",
        "cmd": "docker container prune",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "prune",
          "cleanup",
          "disk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/prune/",
              "title": "docker system prune"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/image/prune/",
              "title": "docker image prune"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/prune/",
              "title": "docker container prune"
            }
          ],
          "note": "Corrected 2026-11-09: --volumes (and docker volume prune without -a) removes only anonymous volumes; named volumes are kept."
        }
      }
    ]
  },
  {
    "id": "docker-images-pro-tips",
    "badge": "tip",
    "title": "Docker Images: Pro Tip",
    "subtitle": "Where Docker keeps its data",
    "commands": [
      {
        "id": "docker-images-tips-card",
        "desc": "Where Docker keeps its data",
        "cmd": "docker info --format '{{.DockerRootDir}} {{.Driver}}'",
        "details": "Containers and volumes live under the Docker root directory (default /var/lib/docker), set with data-root in /etc/docker/daemon.json. Images depend on the storage backend: older installs use the overlay2 driver under the same directory; fresh installs of Engine 29+ use the containerd image store, whose image data sits under /var/lib/containerd and is not moved by data-root. When / fills up on a GPU node, check both.",
        "flags": [
          [
            "DockerRootDir",
            "Where everything is stored, default /var/lib/docker"
          ],
          [
            "Driver: overlay2 / overlayfs",
            "overlay2 on older installs; the containerd image store (Engine 29+ fresh installs) uses the overlayfs snapshotter"
          ],
          [
            "data-root in daemon.json",
            "Moves storage to another disk; needs a Docker restart and a data copy (changes state)"
          ]
        ],
        "tip": "Full root disk on a node? du -sh /var/lib/docker /var/lib/containerd",
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
              "url": "https://docs.docker.com/engine/daemon/",
              "title": "Docker daemon: data directory"
            },
            {
              "url": "https://docs.docker.com/engine/storage/containerd/",
              "title": "containerd image store"
            }
          ],
          "note": "Corrected 2026-11-09: with the containerd image store (default on fresh Engine 29+ installs) image data is under /var/lib/containerd, not data-root."
        }
      }
    ]
  },
  {
    "id": "docker-compose-cmd-1",
    "badge": "compose",
    "title": "Docker Compose: Start",
    "subtitle": "Start (or update) every service in compose.yaml in the background (changes state)",
    "commands": [
      {
        "id": "compose-up",
        "desc": "Start (or update) every service in compose.yaml in the background (changes state)",
        "cmd": "docker compose up -d",
        "details": "",
        "flags": [
          [
            "docker compose (with a space)",
            "The current Compose plugin. The old Python docker-compose (v1) is end-of-life; don't install it"
          ],
          [
            "up -d",
            "Create networks and volumes, then start containers detached. Re-running applies changes to compose.yaml"
          ],
          [
            "-f <file>",
            "Use a different file; default is compose.yaml (or docker-compose.yml) in the current directory"
          ],
          [
            "--build",
            "Rebuild images that have a build: section before starting"
          ],
          [
            "-p <project>",
            "Project name, used as a prefix for containers, networks and volumes (default: the directory name)"
          ]
        ],
        "tip": "Run docker compose config before up",
        "tags": [
          "docker",
          "containers",
          "compose",
          "up",
          "stack",
          "services"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/up/",
              "title": "docker compose up"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/config/",
              "title": "docker compose config"
            },
            {
              "url": "https://docs.docker.com/compose/intro/compose-application-model/",
              "title": "Compose application model"
            }
          ],
          "note": "The Python docker-compose (v1) is no longer maintained; Compose v5.7.0 is current (GitHub releases). Docker's migration page didn't state v1's end-of-life when checked."
        }
      },
      {
        "id": "compose-up-sub-1",
        "desc": "Print the final merged config with variables filled in; a quick syntax check",
        "cmd": "docker compose config",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "up",
          "stack"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/up/",
              "title": "docker compose up"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/config/",
              "title": "docker compose config"
            },
            {
              "url": "https://docs.docker.com/compose/intro/compose-application-model/",
              "title": "Compose application model"
            }
          ],
          "note": "The Python docker-compose (v1) is no longer maintained; Compose v5.7.0 is current (GitHub releases). Docker's migration page didn't state v1's end-of-life when checked."
        }
      },
      {
        "id": "compose-up-sub-2",
        "desc": "Pull newer images for all services (changes state)",
        "cmd": "docker compose pull",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "up",
          "stack"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/up/",
              "title": "docker compose up"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/config/",
              "title": "docker compose config"
            },
            {
              "url": "https://docs.docker.com/compose/intro/compose-application-model/",
              "title": "Compose application model"
            }
          ],
          "note": "The Python docker-compose (v1) is no longer maintained; Compose v5.7.0 is current (GitHub releases). Docker's migration page didn't state v1's end-of-life when checked."
        }
      },
      {
        "id": "compose-up-sub-3",
        "desc": "Recreate one service even if nothing changed (changes state)",
        "cmd": "docker compose up -d --force-recreate <service>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "up",
          "stack"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/up/",
              "title": "docker compose up"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/config/",
              "title": "docker compose config"
            },
            {
              "url": "https://docs.docker.com/compose/intro/compose-application-model/",
              "title": "Compose application model"
            }
          ],
          "note": "The Python docker-compose (v1) is no longer maintained; Compose v5.7.0 is current (GitHub releases). Docker's migration page didn't state v1's end-of-life when checked."
        }
      }
    ]
  },
  {
    "id": "docker-compose-cmd-2",
    "badge": "compose",
    "title": "Docker Compose: See the state of every service in the stack",
    "subtitle": "See the state of every service in the stack",
    "commands": [
      {
        "id": "compose-ps-logs",
        "desc": "See the state of every service in the stack",
        "cmd": "docker compose ps",
        "details": "",
        "flags": [
          [
            "ps",
            "One row per service container, with state and health"
          ],
          [
            "logs --tail 100 <service>",
            "Logs for one service; without a service name you get all of them interleaved"
          ],
          [
            "exec <service> sh",
            "Shell inside a service by its name in compose.yaml, not the container name"
          ]
        ],
        "tip": "Use the service name from compose.yaml",
        "tags": [
          "docker",
          "containers",
          "compose",
          "ps",
          "logs",
          "exec"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/ps/",
              "title": "docker compose ps"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/logs/",
              "title": "docker compose logs"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/exec/",
              "title": "docker compose exec"
            }
          ]
        }
      },
      {
        "id": "compose-ps-logs-sub-1",
        "desc": "Last 100 lines from one service",
        "cmd": "docker compose logs --tail 100 <service>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "ps",
          "logs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/ps/",
              "title": "docker compose ps"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/logs/",
              "title": "docker compose logs"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/exec/",
              "title": "docker compose exec"
            }
          ]
        }
      },
      {
        "id": "compose-ps-logs-sub-2",
        "desc": "Follow all services live (Ctrl+C to stop)",
        "cmd": "docker compose logs -f",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "ps",
          "logs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/ps/",
              "title": "docker compose ps"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/logs/",
              "title": "docker compose logs"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/exec/",
              "title": "docker compose exec"
            }
          ]
        }
      },
      {
        "id": "compose-ps-logs-sub-3",
        "desc": "Interactive shell in a service container",
        "cmd": "docker compose exec <service> sh",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "ps",
          "logs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/ps/",
              "title": "docker compose ps"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/logs/",
              "title": "docker compose logs"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/exec/",
              "title": "docker compose exec"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-compose-cmd-3",
    "badge": "compose",
    "title": "Docker Compose: Stop and remove the stack's containers and networks",
    "subtitle": "Stop and remove the stack's containers and networks (changes state)",
    "commands": [
      {
        "id": "compose-down",
        "desc": "Stop and remove the stack's containers and networks (changes state)",
        "cmd": "docker compose down",
        "details": "",
        "flags": [
          [
            "down",
            "Stops and removes containers and the default network. Named volumes are kept"
          ],
          [
            "-v / --volumes",
            "Also deletes named volumes, so databases lose their data"
          ],
          [
            "stop",
            "Use docker compose stop to pause the stack without removing anything"
          ]
        ],
        "tip": "down keeps volumes; down -v deletes them",
        "tags": [
          "docker",
          "containers",
          "compose",
          "down",
          "stop",
          "volumes"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/down/",
              "title": "docker compose down"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/stop/",
              "title": "docker compose stop"
            }
          ]
        }
      },
      {
        "id": "compose-down-sub-1",
        "desc": "Stop containers but keep them (changes state)",
        "cmd": "docker compose stop",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "down",
          "stop"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/down/",
              "title": "docker compose down"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/stop/",
              "title": "docker compose stop"
            }
          ]
        }
      },
      {
        "id": "compose-down-sub-2",
        "desc": "Restart one service (changes state)",
        "cmd": "docker compose restart <service>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "down",
          "stop"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/down/",
              "title": "docker compose down"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/stop/",
              "title": "docker compose stop"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-compose-cmd-4",
    "badge": "compose",
    "title": "Docker Compose: Example compose.yaml",
    "subtitle": "Example compose.yaml: a web service plus a database with a named volume and a health check",
    "commands": [
      {
        "id": "compose-yaml-example",
        "desc": "Example compose.yaml: a web service plus a database with a named volume and a health check",
        "cmd": "services:\n  web:\n    image: nginx:1.27\n    ports:\n      - \"8080:80\"\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD_FILE: /run/secrets/db_pw\n    volumes:\n      - dbdata:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD\", \"pg_isready\"]\n      interval: 10s\nvolumes:\n  dbdata:",
        "details": "",
        "flags": [
          [
            "services:",
            "Each key is one service; its name is also its DNS name on the stack's network (web can reach db at db:5432)"
          ],
          [
            "ports: \"8080:80\"",
            "Quote port mappings: YAML can misread unquoted values like 22:22 as a number"
          ],
          [
            "depends_on + condition: service_healthy",
            "Start web only after db's healthcheck passes, not just after db starts"
          ],
          [
            "volumes: dbdata",
            "A named volume that survives docker compose down (but not down -v)"
          ],
          [
            "*_FILE / secrets",
            "Read passwords from files instead of putting them in compose.yaml"
          ]
        ],
        "tip": "Services reach each other by service name",
        "tags": [
          "docker",
          "containers",
          "compose",
          "yaml",
          "services",
          "volumes",
          "healthcheck",
          "depends_on"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/compose-file/services/",
              "title": "Compose file: services"
            },
            {
              "url": "https://docs.docker.com/reference/compose-file/volumes/",
              "title": "Compose file: volumes"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-compose-pro-tips",
    "badge": "tip",
    "title": "Docker Compose: Pro Tip",
    "subtitle": "Keep secrets out of compose.yaml",
    "commands": [
      {
        "id": "docker-compose-tips-card",
        "desc": "Keep secrets out of compose.yaml",
        "cmd": "docker compose config --quiet && echo OK",
        "details": "Compose reads a .env file in the project directory automatically and substitutes ${VAR} references. Keep that .env out of git (add it to .gitignore) and commit a .env.example with placeholder values instead. --quiet validates without printing the merged config, which would otherwise show secret values on screen.",
        "flags": [
          [
            ".env",
            "Loaded automatically for ${VAR} substitution in compose.yaml"
          ],
          [
            "config --quiet",
            "Validate only; prints nothing on success"
          ],
          [
            "environment: vs env_file:",
            "Inline values vs. a file of KEY=value lines passed into the container"
          ]
        ],
        "tip": "Commit .env.example, never .env",
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
              "url": "https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/",
              "title": "Compose: variable interpolation (.env)"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/compose/config/",
              "title": "docker compose config"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-network-storage-cmd-1",
    "badge": "dnet",
    "title": "Docker Networking & Storage: List Docker networks and see which containers are on one",
    "subtitle": "List Docker networks and see which containers are on one",
    "commands": [
      {
        "id": "docker-network-ls",
        "desc": "List Docker networks and see which containers are on one",
        "cmd": "docker network ls",
        "details": "",
        "flags": [
          [
            "bridge (default)",
            "Private network with NAT to the host; containers on the default bridge can't resolve each other by name"
          ],
          [
            "user-defined bridge",
            "docker network create <net>: containers on it resolve each other by container name"
          ],
          [
            "host",
            "--network host: the container shares the host's network stack, no port mapping and no isolation"
          ],
          [
            "none",
            "No networking at all"
          ]
        ],
        "tip": "Use a user-defined network for name resolution",
        "tags": [
          "docker",
          "containers",
          "network",
          "bridge",
          "host",
          "dns"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/network/ls/",
              "title": "docker network ls"
            },
            {
              "url": "https://docs.docker.com/engine/network/drivers/bridge/",
              "title": "Bridge network driver"
            }
          ]
        }
      },
      {
        "id": "docker-network-ls-sub-1",
        "desc": "Containers attached to a network and their IPs",
        "cmd": "docker network inspect <network> --format '{{range .Containers}}{{.Name}} {{.IPv4Address}}{{\"\\n\"}}{{end}}'",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "network",
          "bridge",
          "host"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/network/ls/",
              "title": "docker network ls"
            },
            {
              "url": "https://docs.docker.com/engine/network/drivers/bridge/",
              "title": "Bridge network driver"
            }
          ]
        }
      },
      {
        "id": "docker-network-ls-sub-2",
        "desc": "Create a user-defined bridge (changes state)",
        "cmd": "docker network create <network>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "network",
          "bridge",
          "host"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/network/ls/",
              "title": "docker network ls"
            },
            {
              "url": "https://docs.docker.com/engine/network/drivers/bridge/",
              "title": "Bridge network driver"
            }
          ]
        }
      },
      {
        "id": "docker-network-ls-sub-3",
        "desc": "Attach a running container to another network (changes state)",
        "cmd": "docker network connect <network> <container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "network",
          "bridge",
          "host"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/network/ls/",
              "title": "docker network ls"
            },
            {
              "url": "https://docs.docker.com/engine/network/drivers/bridge/",
              "title": "Bridge network driver"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-network-storage-cmd-2",
    "badge": "dnet",
    "title": "Docker Networking & Storage: Show which host ports a container publishes",
    "subtitle": "Show which host ports a container publishes",
    "commands": [
      {
        "id": "docker-port-check",
        "desc": "Show which host ports a container publishes",
        "cmd": "docker port <container>",
        "details": "",
        "flags": [
          [
            "80/tcp -> 0.0.0.0:8080",
            "Container port 80 is reachable on every host interface at port 8080"
          ],
          [
            "-p 127.0.0.1:8080:80",
            "Publish only on localhost, so it is not exposed to the network"
          ],
          [
            "Firewall note",
            "Published ports are added to iptables/nftables by Docker and can bypass ufw rules"
          ]
        ],
        "tip": "Docker-published ports can bypass ufw",
        "tags": [
          "docker",
          "containers",
          "port",
          "publish",
          "ss",
          "firewall",
          "ufw"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/port/",
              "title": "docker port"
            },
            {
              "url": "https://docs.docker.com/engine/network/packet-filtering-firewalls/",
              "title": "Packet filtering and firewalls"
            }
          ]
        }
      },
      {
        "id": "docker-port-check-sub-1",
        "desc": "Confirm what is listening on the host side",
        "cmd": "ss -ltnp | grep <port>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "port",
          "publish",
          "ss"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/port/",
              "title": "docker port"
            },
            {
              "url": "https://docs.docker.com/engine/network/packet-filtering-firewalls/",
              "title": "Packet filtering and firewalls"
            }
          ]
        }
      },
      {
        "id": "docker-port-check-sub-2",
        "desc": "Test name resolution from inside a container",
        "cmd": "docker exec <container> getent hosts <other-container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "port",
          "publish",
          "ss"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/container/port/",
              "title": "docker port"
            },
            {
              "url": "https://docs.docker.com/engine/network/packet-filtering-firewalls/",
              "title": "Packet filtering and firewalls"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "docker-network-storage-cmd-3",
    "badge": "dnet",
    "title": "Docker Networking & Storage: List volumes and find where one lives on the host",
    "subtitle": "List volumes and find where one lives on the host",
    "commands": [
      {
        "id": "docker-volumes",
        "desc": "List volumes and find where one lives on the host",
        "cmd": "docker volume ls",
        "details": "",
        "flags": [
          [
            "named volume (-v data:/path)",
            "Managed by Docker under /var/lib/docker/volumes; survives container removal"
          ],
          [
            "bind mount (-v /host/path:/path)",
            "A host directory mapped in directly; you manage permissions and backups"
          ],
          [
            ":ro",
            "Mount read-only, e.g. -v /etc/ssl:/etc/ssl:ro"
          ],
          [
            "--mount type=bind,src=...,dst=...",
            "Longer syntax that fails (\"bind source path does not exist\") if the host path is missing; -v silently creates it as a directory"
          ]
        ],
        "tip": "-v creates a missing host path silently; --mount errors",
        "tags": [
          "docker",
          "containers",
          "volume",
          "bind",
          "mount",
          "storage",
          "backup"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/volume/ls/",
              "title": "docker volume ls"
            },
            {
              "url": "https://docs.docker.com/engine/storage/bind-mounts/",
              "title": "Bind mounts"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/volume/prune/",
              "title": "docker volume prune"
            }
          ],
          "note": "Corrected 2026-11-09: docker volume prune removes only anonymous volumes unless -a is given."
        }
      },
      {
        "id": "docker-volumes-sub-1",
        "desc": "Host path of a named volume",
        "cmd": "docker volume inspect <volume> --format '{{.Mountpoint}}'",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "volume",
          "bind",
          "mount"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/volume/ls/",
              "title": "docker volume ls"
            },
            {
              "url": "https://docs.docker.com/engine/storage/bind-mounts/",
              "title": "Bind mounts"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/volume/prune/",
              "title": "docker volume prune"
            }
          ],
          "note": "Corrected 2026-11-09: docker volume prune removes only anonymous volumes unless -a is given."
        }
      },
      {
        "id": "docker-volumes-sub-2",
        "desc": "Back up a named volume to a tarball in the current directory",
        "cmd": "docker run --rm -v <volume>:/data -v \"$PWD\":/backup ubuntu:24.04 tar czf /backup/<volume>.tgz -C /data .",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "volume",
          "bind",
          "mount"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/volume/ls/",
              "title": "docker volume ls"
            },
            {
              "url": "https://docs.docker.com/engine/storage/bind-mounts/",
              "title": "Bind mounts"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/volume/prune/",
              "title": "docker volume prune"
            }
          ],
          "note": "Corrected 2026-11-09: docker volume prune removes only anonymous volumes unless -a is given."
        }
      },
      {
        "id": "docker-volumes-sub-3",
        "desc": "Delete unused anonymous volumes; add -a for unused named volumes too: this deletes data (changes state)",
        "cmd": "docker volume prune",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "volume",
          "bind",
          "mount"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/volume/ls/",
              "title": "docker volume ls"
            },
            {
              "url": "https://docs.docker.com/engine/storage/bind-mounts/",
              "title": "Bind mounts"
            },
            {
              "url": "https://docs.docker.com/reference/cli/docker/volume/prune/",
              "title": "docker volume prune"
            }
          ],
          "note": "Corrected 2026-11-09: docker volume prune removes only anonymous volumes unless -a is given."
        }
      }
    ]
  },
  {
    "id": "docker-network-storage-pro-tips",
    "badge": "tip",
    "title": "Docker Networking & Storage: Pro Tip",
    "subtitle": "RDMA and host networking for GPU jobs",
    "commands": [
      {
        "id": "docker-network-storage-tips-card",
        "desc": "RDMA and host networking for GPU jobs",
        "cmd": "docker run --rm --network host --device /dev/infiniband --ulimit memlock=-1 <image> ibv_devinfo",
        "details": "Multi-node GPU jobs that use InfiniBand or RoCE need the host's RDMA devices inside the container. --network host avoids NAT, --device /dev/infiniband exposes the verbs devices, and an unlimited memlock lets RDMA pin memory. Check the HCA from inside with ibv_devinfo before blaming the fabric.",
        "flags": [
          [
            "--network host",
            "Container uses the host's interfaces directly"
          ],
          [
            "--device /dev/infiniband",
            "Pass the RDMA verbs devices through"
          ],
          [
            "--ulimit memlock=-1",
            "Allow unlimited locked memory for RDMA registration"
          ]
        ],
        "tip": "ibv_devinfo inside the container should match the host",
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
              "url": "https://docs.docker.com/reference/cli/docker/container/run/",
              "title": "docker run"
            }
          ],
          "note": "Docker's run reference shows --device with single device paths; passing the /dev/infiniband directory is common practice but not shown there."
        }
      }
    ]
  },
  {
    "id": "docker-gpu-daemon-cmd-1",
    "badge": "dgpu",
    "title": "Docker GPUs & Daemon: Smoke test",
    "subtitle": "Smoke test: run nvidia-smi inside a CUDA container with every GPU attached",
    "commands": [
      {
        "id": "docker-gpu-smoke-test",
        "desc": "Smoke test: run nvidia-smi inside a CUDA container with every GPU attached",
        "cmd": "docker run --rm --gpus all nvidia/cuda:<tag> nvidia-smi",
        "details": "",
        "flags": [
          [
            "--gpus all",
            "Attach every GPU through the NVIDIA Container Toolkit"
          ],
          [
            "--gpus '\"device=0,1\"'",
            "Only GPUs 0 and 1. The double quotes inside single quotes are required because of the comma"
          ],
          [
            "nvidia/cuda:<tag>",
            "Pick a tag whose CUDA version is supported by the host driver (nvidia-smi on the host shows the max CUDA version)"
          ],
          [
            "'could not select device driver'",
            "The toolkit isn't installed or Docker isn't configured for it: see nvidia-ctk below"
          ]
        ],
        "tip": "Quote device lists: '\"device=0,1\"'",
        "tags": [
          "docker",
          "containers",
          "gpu",
          "nvidia",
          "cuda",
          "nvidia-smi",
          "toolkit"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html",
              "title": "NVIDIA Container Toolkit: install guide"
            }
          ],
          "note": "Docker's own GPU page could not be fetched (404); the --gpus device-list quoting is not confirmed against Docker's docs."
        }
      },
      {
        "id": "docker-gpu-smoke-test-sub-1",
        "desc": "List only the GPUs that were passed in",
        "cmd": "docker run --rm --gpus '\"device=0,1\"' nvidia/cuda:<tag> nvidia-smi -L",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "gpu",
          "nvidia",
          "cuda"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html",
              "title": "NVIDIA Container Toolkit: install guide"
            }
          ],
          "note": "Docker's own GPU page could not be fetched (404); the --gpus device-list quoting is not confirmed against Docker's docs."
        }
      },
      {
        "id": "docker-gpu-smoke-test-sub-2",
        "desc": "NVLink/PCIe topology as seen from inside a container",
        "cmd": "docker run --rm --gpus all --ipc=host nvidia/cuda:<tag> nvidia-smi topo -m",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "gpu",
          "nvidia",
          "cuda"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html",
              "title": "NVIDIA Container Toolkit: install guide"
            }
          ],
          "note": "Docker's own GPU page could not be fetched (404); the --gpus device-list quoting is not confirmed against Docker's docs."
        }
      }
    ]
  },
  {
    "id": "docker-gpu-daemon-cmd-2",
    "badge": "dgpu",
    "title": "Docker GPUs & Daemon: Register the NVIDIA runtime with Docker, then restart Docker",
    "subtitle": "Register the NVIDIA runtime with Docker, then restart Docker (changes state: restarts every container on the host)",
    "commands": [
      {
        "id": "nvidia-ctk-configure",
        "desc": "Register the NVIDIA runtime with Docker, then restart Docker (changes state: restarts every container on the host)",
        "cmd": "nvidia-ctk runtime configure --runtime=docker",
        "details": "",
        "flags": [
          [
            "runtime configure --runtime=docker",
            "Adds the nvidia runtime to /etc/docker/daemon.json"
          ],
          [
            "systemctl restart docker",
            "Required afterwards; restarts all containers, so drain the node first"
          ],
          [
            "nvidia-ctk --version",
            "Check the installed toolkit version against NVIDIA's release notes"
          ]
        ],
        "tip": "Drain the node before restarting Docker",
        "tags": [
          "docker",
          "containers",
          "nvidia-ctk",
          "toolkit",
          "runtime",
          "daemon.json"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html",
              "title": "NVIDIA Container Toolkit: install guide"
            }
          ],
          "note": "Checked against Container Toolkit 1.20.1."
        }
      },
      {
        "id": "nvidia-ctk-configure-sub-1",
        "desc": "Apply the new daemon.json (changes state)",
        "cmd": "systemctl restart docker",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "nvidia-ctk",
          "toolkit",
          "runtime"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html",
              "title": "NVIDIA Container Toolkit: install guide"
            }
          ],
          "note": "Checked against Container Toolkit 1.20.1."
        }
      },
      {
        "id": "nvidia-ctk-configure-sub-2",
        "desc": "Confirm the nvidia runtime is now listed",
        "cmd": "docker info | grep -i -A3 runtimes",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "nvidia-ctk",
          "toolkit",
          "runtime"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html",
              "title": "NVIDIA Container Toolkit: install guide"
            }
          ],
          "note": "Checked against Container Toolkit 1.20.1."
        }
      }
    ]
  },
  {
    "id": "docker-gpu-daemon-cmd-3",
    "badge": "dgpu",
    "title": "Docker GPUs & Daemon: List the CDI",
    "subtitle": "List the CDI (Container Device Interface) GPU devices NVIDIA has defined on this host",
    "commands": [
      {
        "id": "nvidia-cdi",
        "desc": "List the CDI (Container Device Interface) GPU devices NVIDIA has defined on this host",
        "cmd": "nvidia-ctk cdi list",
        "details": "",
        "flags": [
          [
            "CDI",
            "A standard spec file (NVIDIA writes /var/run/cdi/nvidia.yaml) that describes devices, used by Docker, Podman and containerd"
          ],
          [
            "nvidia-cdi-refresh",
            "Toolkit 1.18+: a systemd service keeps the spec up to date after driver changes; restart it after a driver removal or MIG change"
          ],
          [
            "--device nvidia.com/gpu=all",
            "Request GPUs by CDI name instead of --gpus; CDI is on by default from Docker Engine 28.3.0"
          ]
        ],
        "tip": "Toolkit 1.18+ refreshes the CDI spec for you",
        "tags": [
          "docker",
          "containers",
          "cdi",
          "nvidia-ctk",
          "device",
          "gpu"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html",
              "title": "NVIDIA Container Toolkit: CDI support"
            },
            {
              "url": "https://docs.docker.com/reference/cli/dockerd/",
              "title": "dockerd reference (CDI)"
            }
          ],
          "note": "Corrected 2026-11-09: the spec lives in /var/run/cdi/nvidia.yaml (not /etc/cdi), toolkit 1.18+ regenerates it with nvidia-cdi-refresh, and Docker enables CDI by default from 28.3.0 (not 25)."
        }
      },
      {
        "id": "nvidia-cdi-sub-1",
        "desc": "Regenerate the CDI spec, e.g. after a driver removal or MIG change (changes state)",
        "cmd": "systemctl restart nvidia-cdi-refresh.service",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "cdi",
          "nvidia-ctk",
          "device"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html",
              "title": "NVIDIA Container Toolkit: CDI support"
            },
            {
              "url": "https://docs.docker.com/reference/cli/dockerd/",
              "title": "dockerd reference (CDI)"
            }
          ],
          "note": "Corrected 2026-11-09: the spec lives in /var/run/cdi/nvidia.yaml (not /etc/cdi), toolkit 1.18+ regenerates it with nvidia-cdi-refresh, and Docker enables CDI by default from 28.3.0 (not 25)."
        }
      },
      {
        "id": "nvidia-cdi-sub-2",
        "desc": "Generate the spec by hand on toolkits older than 1.18 (changes state)",
        "cmd": "nvidia-ctk cdi generate --output=/var/run/cdi/nvidia.yaml",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "cdi",
          "nvidia-ctk",
          "device"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html",
              "title": "NVIDIA Container Toolkit: CDI support"
            },
            {
              "url": "https://docs.docker.com/reference/cli/dockerd/",
              "title": "dockerd reference (CDI)"
            }
          ],
          "note": "Corrected 2026-11-09: the spec lives in /var/run/cdi/nvidia.yaml (not /etc/cdi), toolkit 1.18+ regenerates it with nvidia-cdi-refresh, and Docker enables CDI by default from 28.3.0 (not 25)."
        }
      },
      {
        "id": "nvidia-cdi-sub-3",
        "desc": "Use CDI device names from Docker",
        "cmd": "docker run --rm --device nvidia.com/gpu=all ubuntu:24.04 nvidia-smi -L",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "cdi",
          "nvidia-ctk",
          "device"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html",
              "title": "NVIDIA Container Toolkit: CDI support"
            },
            {
              "url": "https://docs.docker.com/reference/cli/dockerd/",
              "title": "dockerd reference (CDI)"
            }
          ],
          "note": "Corrected 2026-11-09: the spec lives in /var/run/cdi/nvidia.yaml (not /etc/cdi), toolkit 1.18+ regenerates it with nvidia-cdi-refresh, and Docker enables CDI by default from 28.3.0 (not 25)."
        }
      }
    ]
  },
  {
    "id": "docker-gpu-daemon-cmd-4",
    "badge": "dgpu",
    "title": "Docker GPUs & Daemon: Check the Docker daemon",
    "subtitle": "Check the Docker daemon: version, storage and cgroup driver, runtimes, and recent errors",
    "commands": [
      {
        "id": "docker-daemon-health",
        "desc": "Check the Docker daemon: version, storage and cgroup driver, runtimes, and recent errors",
        "cmd": "docker info",
        "details": "",
        "flags": [
          [
            "Server Version",
            "The Engine version; compare with the release notes before upgrading"
          ],
          [
            "Cgroup Driver / Version",
            "Should be systemd / 2 on current Ubuntu; cgroup v1 is deprecated in Kubernetes (1.35+) and the kubelet won't start on it by default"
          ],
          [
            "Runtimes",
            "Should include nvidia on GPU nodes"
          ],
          [
            "Storage Driver",
            "overlay2 on older installs; overlayfs (containerd image store) on fresh Engine 29+ installs"
          ]
        ],
        "tip": "docker events with --until returns instead of following",
        "tags": [
          "docker",
          "containers",
          "daemon",
          "info",
          "journalctl",
          "events",
          "cgroup",
          "systemd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/events/",
              "title": "docker events"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: docker events --until now → --until \"$(date +%s)\" (now isn't a documented format); 'Kubernetes 1.37 refuses cgroup v1' → deprecated since 1.35, won't start by default."
        }
      },
      {
        "id": "docker-daemon-health-sub-1",
        "desc": "Is the daemon running, and its last log lines",
        "cmd": "systemctl status docker --no-pager",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "daemon",
          "info",
          "journalctl"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/events/",
              "title": "docker events"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: docker events --until now → --until \"$(date +%s)\" (now isn't a documented format); 'Kubernetes 1.37 refuses cgroup v1' → deprecated since 1.35, won't start by default."
        }
      },
      {
        "id": "docker-daemon-health-sub-2",
        "desc": "Daemon log for the last hour",
        "cmd": "journalctl -u docker --since '1 hour ago' --no-pager",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "daemon",
          "info",
          "journalctl"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/events/",
              "title": "docker events"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: docker events --until now → --until \"$(date +%s)\" (now isn't a documented format); 'Kubernetes 1.37 refuses cgroup v1' → deprecated since 1.35, won't start by default."
        }
      },
      {
        "id": "docker-daemon-health-sub-3",
        "desc": "The daemon's config file (runtimes, data-root, log limits)",
        "cmd": "cat /etc/docker/daemon.json",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "daemon",
          "info",
          "journalctl"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/events/",
              "title": "docker events"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: docker events --until now → --until \"$(date +%s)\" (now isn't a documented format); 'Kubernetes 1.37 refuses cgroup v1' → deprecated since 1.35, won't start by default."
        }
      },
      {
        "id": "docker-daemon-health-sub-4",
        "desc": "Container start/stop/die/oom events from the last hour, then exit (--until takes a timestamp)",
        "cmd": "docker events --since 1h --until \"$(date +%s)\"",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "daemon",
          "info",
          "journalctl"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.docker.com/reference/cli/docker/system/events/",
              "title": "docker events"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: docker events --until now → --until \"$(date +%s)\" (now isn't a documented format); 'Kubernetes 1.37 refuses cgroup v1' → deprecated since 1.35, won't start by default."
        }
      }
    ]
  },
  {
    "id": "docker-gpu-daemon-pro-tips",
    "badge": "tip",
    "title": "Docker GPUs & Daemon: Pro Tip",
    "subtitle": "Container sees no GPUs: check in this order",
    "commands": [
      {
        "id": "docker-gpu-daemon-tips-card",
        "desc": "Container sees no GPUs: check in this order",
        "cmd": "nvidia-smi && nvidia-ctk --version && docker info | grep -i runtimes",
        "details": "Work from the host up. If nvidia-smi fails on the host, it's a driver or hardware problem (see the NVIDIA DC sheets), not Docker. If the host is fine but the container isn't, check the toolkit is installed, the nvidia runtime is registered, and the image's CUDA version is not newer than the driver supports.",
        "flags": [
          [
            "1. Host driver",
            "nvidia-smi on the host"
          ],
          [
            "2. Toolkit",
            "nvidia-ctk --version"
          ],
          [
            "3. Docker runtime",
            "docker info shows nvidia under Runtimes"
          ],
          [
            "4. Image CUDA vs driver",
            "The image's CUDA must be supported by the host driver"
          ]
        ],
        "tip": "Host nvidia-smi fails → not a Docker problem",
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
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html",
              "title": "NVIDIA Container Toolkit: install guide"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "nvidia-smi documentation"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-kubectl-cmd-1",
    "badge": "ctx",
    "title": "kubectl Basics & Contexts: Show which cluster and namespace kubectl is pointed at",
    "subtitle": "Show which cluster and namespace kubectl is pointed at",
    "commands": [
      {
        "id": "kubectl-contexts",
        "desc": "Show which cluster and namespace kubectl is pointed at",
        "cmd": "kubectl config get-contexts",
        "details": "",
        "flags": [
          [
            "* in the CURRENT column",
            "The context every kubectl command will use: check it before anything that changes state"
          ],
          [
            "context",
            "A named combination of cluster + user + default namespace, stored in ~/.kube/config"
          ],
          [
            "KUBECONFIG=<file>",
            "Point one command (or shell) at a different kubeconfig file"
          ]
        ],
        "tip": "Check the context before every change",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "context",
          "kubeconfig",
          "cluster",
          "namespace"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/kubectl_config_get-contexts/",
              "title": "kubectl config get-contexts"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/",
              "title": "Kubernetes: kubeconfig files"
            }
          ]
        }
      },
      {
        "id": "kubectl-contexts-sub-1",
        "desc": "Just the active context name",
        "cmd": "kubectl config current-context",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "context",
          "kubeconfig",
          "cluster"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/kubectl_config_get-contexts/",
              "title": "kubectl config get-contexts"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/",
              "title": "Kubernetes: kubeconfig files"
            }
          ]
        }
      },
      {
        "id": "kubectl-contexts-sub-2",
        "desc": "Switch clusters for every later command (changes local state)",
        "cmd": "kubectl config use-context <context>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "context",
          "kubeconfig",
          "cluster"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/kubectl_config_get-contexts/",
              "title": "kubectl config get-contexts"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/",
              "title": "Kubernetes: kubeconfig files"
            }
          ]
        }
      },
      {
        "id": "kubectl-contexts-sub-3",
        "desc": "Change the default namespace of the current context (changes local state)",
        "cmd": "kubectl config set-context --current --namespace=<ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "context",
          "kubeconfig",
          "cluster"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/kubectl_config_get-contexts/",
              "title": "kubectl config get-contexts"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/",
              "title": "Kubernetes: kubeconfig files"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-kubectl-cmd-2",
    "badge": "ctx",
    "title": "kubectl Basics & Contexts: List pods in every namespace with their node and IP",
    "subtitle": "List pods in every namespace with their node and IP",
    "commands": [
      {
        "id": "kubectl-get-wide",
        "desc": "List pods in every namespace with their node and IP",
        "cmd": "kubectl get pods -A -o wide",
        "details": "",
        "flags": [
          [
            "-A / --all-namespaces",
            "Every namespace; without it you only see your context's default namespace"
          ],
          [
            "-n <ns>",
            "One namespace"
          ],
          [
            "-o wide",
            "Adds NODE and IP columns: which server is the pod on?"
          ],
          [
            "READY 1/2",
            "One of two containers in the pod isn't ready"
          ],
          [
            "RESTARTS",
            "A climbing number means a crash loop"
          ],
          [
            "-l app=<label>",
            "Filter by label"
          ]
        ],
        "tip": "-o wide shows the node",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "get",
          "pods",
          "wide",
          "namespace",
          "list"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            }
          ]
        }
      },
      {
        "id": "kubectl-get-wide-sub-1",
        "desc": "Pods, services, deployments and replica sets in one namespace (not literally all kinds)",
        "cmd": "kubectl get all -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "get",
          "pods",
          "wide"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            }
          ]
        }
      },
      {
        "id": "kubectl-get-wide-sub-2",
        "desc": "Everything that isn't Running",
        "cmd": "kubectl get pods -A --field-selector=status.phase!=Running",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "get",
          "pods",
          "wide"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-kubectl-cmd-3",
    "badge": "ctx",
    "title": "kubectl Basics & Contexts: Print exactly the fields you need with jsonpath or custom columns",
    "subtitle": "Print exactly the fields you need with jsonpath or custom columns",
    "commands": [
      {
        "id": "kubectl-output-formats",
        "desc": "Print exactly the fields you need with jsonpath or custom columns",
        "cmd": "kubectl get pods -n <ns> -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName,PHASE:.status.phase",
        "details": "",
        "flags": [
          [
            "-o yaml",
            "The whole object as YAML: the source of truth for every field"
          ],
          [
            "-o jsonpath='{.items[*].metadata.name}'",
            "One field from every item, space-separated"
          ],
          [
            "-o custom-columns=HEADER:.path,...",
            "Your own table; paths are the same as in -o yaml"
          ],
          [
            "--sort-by=.metadata.creationTimestamp",
            "Sort rows by any field"
          ]
        ],
        "tip": "Find the path in -o yaml, then use it in jsonpath",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "output",
          "jsonpath",
          "custom-columns",
          "yaml",
          "jq",
          "sort"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/jsonpath/",
              "title": "kubectl JSONPath support"
            }
          ]
        }
      },
      {
        "id": "kubectl-output-formats-sub-1",
        "desc": "Full pod definition and status",
        "cmd": "kubectl get pod <pod> -n <ns> -o yaml",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "output",
          "jsonpath",
          "custom-columns"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/jsonpath/",
              "title": "kubectl JSONPath support"
            }
          ]
        }
      },
      {
        "id": "kubectl-output-formats-sub-2",
        "desc": "Name and phase, one pod per line",
        "cmd": "kubectl get pods -n <ns> -o jsonpath='{range .items[*]}{.metadata.name}{\"\\t\"}{.status.phase}{\"\\n\"}{end}'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "output",
          "jsonpath",
          "custom-columns"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/jsonpath/",
              "title": "kubectl JSONPath support"
            }
          ]
        }
      },
      {
        "id": "kubectl-output-formats-sub-3",
        "desc": "Same idea with jq, which is easier to read for complex filters",
        "cmd": "kubectl get pods -n <ns> -o json | jq -r '.items[] | select(.status.phase != \"Running\") | .metadata.name'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "output",
          "jsonpath",
          "custom-columns"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/jsonpath/",
              "title": "kubectl JSONPath support"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-kubectl-cmd-4",
    "badge": "ctx",
    "title": "kubectl Basics & Contexts: Look up what a field means without leaving the terminal",
    "subtitle": "Look up what a field means without leaving the terminal",
    "commands": [
      {
        "id": "kubectl-explain",
        "desc": "Look up what a field means without leaving the terminal",
        "cmd": "kubectl explain pod.spec.containers.resources",
        "details": "",
        "flags": [
          [
            "kubectl explain <kind>.<path>",
            "Docs for that field, straight from the cluster's own API (so it matches your version)"
          ],
          [
            "--recursive",
            "Show the whole tree of sub-fields"
          ],
          [
            "kubectl api-resources",
            "Every resource kind, its short name (po, deploy, svc) and whether it's namespaced"
          ]
        ],
        "tip": "kubectl explain matches your cluster's version",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "explain",
          "api-resources",
          "version",
          "docs",
          "auth"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_explain/",
              "title": "kubectl explain"
            },
            {
              "url": "https://kubernetes.io/releases/version-skew-policy/",
              "title": "Kubernetes version skew policy"
            }
          ]
        }
      },
      {
        "id": "kubectl-explain-sub-1",
        "desc": "All kinds the cluster knows, with short names",
        "cmd": "kubectl api-resources",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "explain",
          "api-resources",
          "version"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_explain/",
              "title": "kubectl explain"
            },
            {
              "url": "https://kubernetes.io/releases/version-skew-policy/",
              "title": "Kubernetes version skew policy"
            }
          ]
        }
      },
      {
        "id": "kubectl-explain-sub-2",
        "desc": "Client and server versions; kubectl should be within one minor version of the server",
        "cmd": "kubectl version",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "explain",
          "api-resources",
          "version"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_explain/",
              "title": "kubectl explain"
            },
            {
              "url": "https://kubernetes.io/releases/version-skew-policy/",
              "title": "Kubernetes version skew policy"
            }
          ]
        }
      },
      {
        "id": "kubectl-explain-sub-3",
        "desc": "What you're allowed to do in a namespace",
        "cmd": "kubectl auth can-i --list -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "explain",
          "api-resources",
          "version"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_explain/",
              "title": "kubectl explain"
            },
            {
              "url": "https://kubernetes.io/releases/version-skew-policy/",
              "title": "Kubernetes version skew policy"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-kubectl-pro-tips",
    "badge": "tip",
    "title": "kubectl Basics & Contexts: Pro Tip",
    "subtitle": "Make the active context impossible to miss",
    "commands": [
      {
        "id": "k8s-kubectl-tips-card",
        "desc": "Make the active context impossible to miss",
        "cmd": "kubectl config current-context",
        "details": "Most Kubernetes accidents are the right command against the wrong cluster. Put the current context in your shell prompt, or run kubectl config current-context before any apply, delete, drain or scale. Separate kubeconfig files per cluster (KUBECONFIG=...) make it harder still to cross wires.",
        "flags": [
          [
            "kubectl config current-context",
            "Run it before every change"
          ],
          [
            "KUBECONFIG=~/.kube/<cluster>.yaml",
            "One file per cluster"
          ],
          [
            "kubectl --context <ctx> ...",
            "Name the cluster explicitly on a single command"
          ]
        ],
        "tip": "Right command, wrong cluster is the classic mistake",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/",
              "title": "Kubernetes: kubeconfig files"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-workloads-cmd-1",
    "badge": "wl",
    "title": "Kubernetes Workloads: Preview what a manifest would change, then apply it",
    "subtitle": "Preview what a manifest would change, then apply it (apply changes state)",
    "commands": [
      {
        "id": "kubectl-diff-apply",
        "desc": "Preview what a manifest would change, then apply it (apply changes state)",
        "cmd": "kubectl diff -f <file>.yaml",
        "details": "",
        "flags": [
          [
            "kubectl diff -f",
            "Shows the change the server would make, without making it. Exit code 1 means there are differences"
          ],
          [
            "kubectl apply -f <file>.yaml",
            "Create or update to match the file (declarative: the file is the desired state)"
          ],
          [
            "-f <dir>/",
            "Apply every manifest in a directory"
          ],
          [
            "--dry-run=server",
            "Let the API server validate the change without saving it"
          ]
        ],
        "tip": "diff before apply",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "apply",
          "diff",
          "manifest",
          "yaml",
          "declarative",
          "dry-run"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_diff/",
              "title": "kubectl diff"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/",
              "title": "kubectl apply"
            }
          ]
        }
      },
      {
        "id": "kubectl-diff-apply-sub-1",
        "desc": "Apply the manifest (changes state)",
        "cmd": "kubectl apply -f <file>.yaml",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "apply",
          "diff",
          "manifest"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_diff/",
              "title": "kubectl diff"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/",
              "title": "kubectl apply"
            }
          ]
        }
      },
      {
        "id": "kubectl-diff-apply-sub-2",
        "desc": "Validate against the live cluster without changing anything",
        "cmd": "kubectl apply -f <file>.yaml --dry-run=server",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "apply",
          "diff",
          "manifest"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_diff/",
              "title": "kubectl diff"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/",
              "title": "kubectl apply"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-workloads-cmd-2",
    "badge": "wl",
    "title": "Kubernetes Workloads: Minimal Deployment manifest with resource requests and limits",
    "subtitle": "Minimal Deployment manifest with resource requests and limits",
    "commands": [
      {
        "id": "deployment-yaml-example",
        "desc": "Minimal Deployment manifest with resource requests and limits",
        "cmd": "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\n  labels:\n    app: web\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: web\n          image: nginx:1.27\n          ports:\n            - containerPort: 80\n          resources:\n            requests:\n              cpu: 100m\n              memory: 128Mi\n            limits:\n              memory: 256Mi",
        "details": "",
        "flags": [
          [
            "selector.matchLabels = template labels",
            "The Deployment finds its pods by label; these two must match"
          ],
          [
            "replicas: 2",
            "How many identical pods to keep running"
          ],
          [
            "requests",
            "What the scheduler reserves on a node (100m = 0.1 CPU core)"
          ],
          [
            "limits.memory",
            "Exceeding it gets the container OOMKilled"
          ],
          [
            "Generate instead of typing",
            "kubectl create deployment web --image=nginx:1.27 --dry-run=client -o yaml > web.yaml"
          ]
        ],
        "tip": "Labels connect Deployment → pods → Service",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "deployment",
          "yaml",
          "manifest",
          "requests",
          "limits",
          "labels"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/",
              "title": "Kubernetes: Deployments"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
              "title": "Kubernetes: resources for containers"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-workloads-cmd-3",
    "badge": "wl",
    "title": "Kubernetes Workloads: Watch a deployment roll out and check its history",
    "subtitle": "Watch a deployment roll out and check its history",
    "commands": [
      {
        "id": "kubectl-rollout",
        "desc": "Watch a deployment roll out and check its history",
        "cmd": "kubectl rollout status deployment/<name> -n <ns> --timeout=120s",
        "details": "",
        "flags": [
          [
            "rollout status",
            "Waits until the new pods are ready (or the timeout hits), then exits"
          ],
          [
            "rollout history",
            "Previous revisions you can roll back to"
          ],
          [
            "rollout undo",
            "Go back to the previous revision (changes state)"
          ],
          [
            "rollout restart",
            "Recreate all pods one by one, e.g. to pick up a changed ConfigMap (changes state)"
          ]
        ],
        "tip": "rollout undo is your fast rollback",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "rollout",
          "status",
          "history",
          "undo",
          "restart",
          "deployment"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/",
              "title": "kubectl rollout"
            }
          ]
        }
      },
      {
        "id": "kubectl-rollout-sub-1",
        "desc": "List revisions",
        "cmd": "kubectl rollout history deployment/<name> -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "rollout",
          "status",
          "history"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/",
              "title": "kubectl rollout"
            }
          ]
        }
      },
      {
        "id": "kubectl-rollout-sub-2",
        "desc": "Roll back to the previous revision (changes state)",
        "cmd": "kubectl rollout undo deployment/<name> -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "rollout",
          "status",
          "history"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/",
              "title": "kubectl rollout"
            }
          ]
        }
      },
      {
        "id": "kubectl-rollout-sub-3",
        "desc": "Rolling restart of every pod (changes state)",
        "cmd": "kubectl rollout restart deployment/<name> -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "rollout",
          "status",
          "history"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/",
              "title": "kubectl rollout"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-workloads-cmd-4",
    "badge": "wl",
    "title": "Kubernetes Workloads: Change the number of replicas",
    "subtitle": "Change the number of replicas (changes state)",
    "commands": [
      {
        "id": "kubectl-scale",
        "desc": "Change the number of replicas (changes state)",
        "cmd": "kubectl scale deployment/<name> -n <ns> --replicas=3",
        "details": "",
        "flags": [
          [
            "--replicas=N",
            "Desired pod count; 0 stops the app but keeps its definition"
          ],
          [
            "Drift warning",
            "The next kubectl apply of the YAML resets replicas to the file's value"
          ],
          [
            "HPA",
            "If a HorizontalPodAutoscaler manages it, the HPA will override manual scaling"
          ]
        ],
        "tip": "Scaling by hand drifts from your YAML",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "scale",
          "replicas",
          "hpa",
          "deployment"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_scale/",
              "title": "kubectl scale"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/",
              "title": "Kubernetes: HPA"
            }
          ]
        }
      },
      {
        "id": "kubectl-scale-sub-1",
        "desc": "The Deployment, its ReplicaSets and pods together",
        "cmd": "kubectl get deploy,rs,pods -n <ns> -l app=<label>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "scale",
          "replicas",
          "hpa"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_scale/",
              "title": "kubectl scale"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/",
              "title": "Kubernetes: HPA"
            }
          ]
        }
      },
      {
        "id": "kubectl-scale-sub-2",
        "desc": "Autoscalers that may override your change",
        "cmd": "kubectl get hpa -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "scale",
          "replicas",
          "hpa"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_scale/",
              "title": "kubectl scale"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/",
              "title": "Kubernetes: HPA"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-workloads-cmd-5",
    "badge": "wl",
    "title": "Kubernetes Workloads: Check batch Jobs and CronJobs",
    "subtitle": "Check batch Jobs and CronJobs",
    "commands": [
      {
        "id": "kubectl-jobs",
        "desc": "Check batch Jobs and CronJobs",
        "cmd": "kubectl get jobs,cronjobs -A",
        "details": "",
        "flags": [
          [
            "Job",
            "Runs pods until they complete successfully a set number of times"
          ],
          [
            "CronJob",
            "Creates a Job on a cron schedule"
          ],
          [
            "COMPLETIONS 0/1",
            "Not finished yet, or failing; check its pods' logs"
          ]
        ],
        "tip": "Trigger a CronJob by hand with --from=cronjob/",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "job",
          "cronjob",
          "batch"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_job/",
              "title": "kubectl create job"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/",
              "title": "kubectl logs"
            }
          ]
        }
      },
      {
        "id": "kubectl-jobs-sub-1",
        "desc": "Logs from a Job's pod",
        "cmd": "kubectl logs job/<job> -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "job",
          "cronjob",
          "batch"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_job/",
              "title": "kubectl create job"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/",
              "title": "kubectl logs"
            }
          ]
        }
      },
      {
        "id": "kubectl-jobs-sub-2",
        "desc": "Run a CronJob now, outside its schedule (changes state)",
        "cmd": "kubectl create job <name>-manual --from=cronjob/<cronjob> -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "job",
          "cronjob",
          "batch"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_job/",
              "title": "kubectl create job"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/",
              "title": "kubectl logs"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-workloads-pro-tips",
    "badge": "tip",
    "title": "Kubernetes Workloads: Pro Tip",
    "subtitle": "Requests, limits and what OOMKilled means",
    "commands": [
      {
        "id": "k8s-workloads-tips-card",
        "desc": "Requests, limits and what OOMKilled means",
        "cmd": "kubectl get pod <pod> -n <ns> -o jsonpath='{.status.containerStatuses[*].lastState.terminated.reason}'",
        "details": "Requests decide where a pod can be scheduled; limits are enforced at runtime. A container above its memory limit is killed (reason OOMKilled) and restarted. A container above its CPU limit is only throttled. When a node runs short of memory, the kubelet first evicts pods using more than they requested (by priority, then by how far over), so pods with no requests at all go early.",
        "flags": [
          [
            "OOMKilled",
            "Raise limits.memory or fix the leak"
          ],
          [
            "Pending: Insufficient cpu/memory",
            "Requests don't fit on any node"
          ],
          [
            "Evicted",
            "The node ran low on memory or disk and removed the pod"
          ]
        ],
        "tip": "Memory over limit = killed; CPU over limit = slowed",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/",
              "title": "Kubernetes: resources for containers"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/",
              "title": "Kubernetes: node-pressure eviction"
            }
          ],
          "note": "Corrected 2026-11-09: 'pods with no requests are evicted first' → the kubelet orders by usage over requests, then priority; it doesn't use QoS class for the order."
        }
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-1",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Describe a pod",
    "subtitle": "Describe a pod: read the Events section at the bottom first",
    "commands": [
      {
        "id": "kubectl-describe-pod",
        "desc": "Describe a pod: read the Events section at the bottom first",
        "cmd": "kubectl describe pod <pod> -n <ns>",
        "details": "",
        "flags": [
          [
            "Events (bottom)",
            "Scheduling failures, image pull errors, probe failures and OOM kills appear here"
          ],
          [
            "State / Last State",
            "Current state and how the previous container instance ended (reason and exit code)"
          ],
          [
            "Conditions",
            "PodScheduled, Initialized, ContainersReady, Ready"
          ],
          [
            "Node",
            "Which server it landed on; combine with the node sheets"
          ]
        ],
        "tip": "Read Events first",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "describe",
          "events",
          "pod",
          "state"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe/",
              "title": "kubectl describe"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/",
              "title": "Kubernetes: debug pods"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-2",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: What the common pod statuses mean and where to look next",
    "subtitle": "What the common pod statuses mean and where to look next",
    "commands": [
      {
        "id": "kubectl-pod-status-meanings",
        "desc": "What the common pod statuses mean and where to look next",
        "cmd": "kubectl get pods -n <ns>",
        "details": "",
        "flags": [
          [
            "Pending",
            "Not scheduled yet: not enough CPU/memory/GPU, a taint, or an unbound PVC. Check describe → Events"
          ],
          [
            "ContainerCreating (stuck)",
            "Usually a volume that won't mount or a CNI (network) problem"
          ],
          [
            "ImagePullBackOff / ErrImagePull",
            "Wrong image name or tag, a private registry without credentials, or no route to the registry"
          ],
          [
            "CrashLoopBackOff",
            "The container starts and exits again; read logs --previous"
          ],
          [
            "OOMKilled",
            "Hit its memory limit"
          ],
          [
            "Evicted",
            "The node ran out of memory or disk"
          ],
          [
            "Terminating (stuck)",
            "A finalizer or an unreachable node; check the node first"
          ]
        ],
        "tip": "Pending → Events; CrashLoop → logs --previous",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "status",
          "pending",
          "crashloopbackoff",
          "imagepullbackoff",
          "oomkilled",
          "evicted"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/",
              "title": "Kubernetes: pod lifecycle"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/",
              "title": "Kubernetes: debug pods"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-3",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Logs from the previous",
    "subtitle": "Logs from the previous (crashed) instance of a container",
    "commands": [
      {
        "id": "kubectl-logs-previous",
        "desc": "Logs from the previous (crashed) instance of a container",
        "cmd": "kubectl logs <pod> -n <ns> --previous --tail=200",
        "details": "",
        "flags": [
          [
            "--previous / -p",
            "The instance that crashed, not the one currently restarting. Essential for CrashLoopBackOff"
          ],
          [
            "-c <container>",
            "Pick a container when the pod has more than one"
          ],
          [
            "--tail=200 / --since=30m",
            "Limit output"
          ],
          [
            "-f",
            "Follow live"
          ],
          [
            "-l app=<label> --all-containers",
            "Logs from every pod matching a label"
          ]
        ],
        "tip": "CrashLoopBackOff? Always add --previous",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "logs",
          "previous",
          "crashloop",
          "container"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/",
              "title": "kubectl logs"
            }
          ]
        }
      },
      {
        "id": "kubectl-logs-previous-sub-1",
        "desc": "One container in a multi-container pod",
        "cmd": "kubectl logs <pod> -n <ns> -c <container> --tail=200",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "logs",
          "previous",
          "crashloop"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/",
              "title": "kubectl logs"
            }
          ]
        }
      },
      {
        "id": "kubectl-logs-previous-sub-2",
        "desc": "Logs from one pod of a Deployment",
        "cmd": "kubectl logs deploy/<name> -n <ns> --tail=100",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "logs",
          "previous",
          "crashloop"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/",
              "title": "kubectl logs"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-4",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Recent events in a namespace, oldest first",
    "subtitle": "Recent events in a namespace, oldest first",
    "commands": [
      {
        "id": "kubectl-events-sorted",
        "desc": "Recent events in a namespace, oldest first",
        "cmd": "kubectl get events -n <ns> --sort-by=.lastTimestamp",
        "details": "",
        "flags": [
          [
            "--sort-by=.lastTimestamp",
            "Events are unsorted by default; this puts the newest at the bottom"
          ],
          [
            "--field-selector type=Warning",
            "Only warnings"
          ],
          [
            "Retention",
            "Events are kept for about an hour by default, so capture them early"
          ]
        ],
        "tip": "Events expire after about an hour",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "events",
          "warning",
          "sort",
          "timeline"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_events/",
              "title": "kubectl events"
            },
            {
              "url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/",
              "title": "kube-apiserver (--event-ttl 1h)"
            }
          ],
          "note": "kubectl get documents --sort-by with braces ('{.lastTimestamp}'); the bare form works too. Filtering events by type=Warning isn't shown in the docs read. kubectl events has no --sort-by."
        }
      },
      {
        "id": "kubectl-events-sorted-sub-1",
        "desc": "Warnings across the whole cluster",
        "cmd": "kubectl get events -A --field-selector type=Warning --sort-by=.lastTimestamp",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "events",
          "warning",
          "sort"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_events/",
              "title": "kubectl events"
            },
            {
              "url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/",
              "title": "kube-apiserver (--event-ttl 1h)"
            }
          ],
          "note": "kubectl get documents --sort-by with braces ('{.lastTimestamp}'); the bare form works too. Filtering events by type=Warning isn't shown in the docs read. kubectl events has no --sort-by."
        }
      },
      {
        "id": "kubectl-events-sorted-sub-2",
        "desc": "Events for one object (newer kubectl events command)",
        "cmd": "kubectl events -n <ns> --for pod/<pod>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "events",
          "warning",
          "sort"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_events/",
              "title": "kubectl events"
            },
            {
              "url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/",
              "title": "kube-apiserver (--event-ttl 1h)"
            }
          ],
          "note": "kubectl get documents --sort-by with braces ('{.lastTimestamp}'); the bare form works too. Filtering events by type=Warning isn't shown in the docs read. kubectl events has no --sort-by."
        }
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-5",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Get a shell in a running pod, or attach a debug container to one that has no shell",
    "subtitle": "Get a shell in a running pod, or attach a debug container to one that has no shell",
    "commands": [
      {
        "id": "kubectl-exec-debug",
        "desc": "Get a shell in a running pod, or attach a debug container to one that has no shell",
        "cmd": "kubectl exec -it <pod> -n <ns> -- sh",
        "details": "",
        "flags": [
          [
            "-- (double dash)",
            "Everything after it is the command to run in the container, not kubectl flags"
          ],
          [
            "-c <container>",
            "Choose the container in a multi-container pod"
          ],
          [
            "kubectl debug -it <pod> --image=busybox --target=<container>",
            "Adds a temporary debug container that shares the target's process namespace; works for distroless images"
          ],
          [
            "kubectl debug node/<node> -it --image=busybox",
            "A pod on the node with the host filesystem at /host (add --profile=sysadmin to chroot /host)"
          ]
        ],
        "tip": "No shell in the image? kubectl debug --target",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "exec",
          "debug",
          "ephemeral",
          "shell",
          "distroless"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/",
              "title": "Kubernetes: debug running pods"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/kubectl-node-debug/",
              "title": "Kubernetes: debug a node with kubectl"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_debug/",
              "title": "kubectl debug"
            }
          ],
          "note": "With the default profile, chroot /host fails in a node debug pod: use --profile=sysadmin."
        }
      },
      {
        "id": "kubectl-exec-debug-sub-1",
        "desc": "Environment variables the app sees",
        "cmd": "kubectl exec <pod> -n <ns> -- env",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "exec",
          "debug",
          "ephemeral"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/",
              "title": "Kubernetes: debug running pods"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/kubectl-node-debug/",
              "title": "Kubernetes: debug a node with kubectl"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_debug/",
              "title": "kubectl debug"
            }
          ],
          "note": "With the default profile, chroot /host fails in a node debug pod: use --profile=sysadmin."
        }
      },
      {
        "id": "kubectl-exec-debug-sub-2",
        "desc": "Ephemeral debug container (changes state: adds a container to the pod)",
        "cmd": "kubectl debug -it <pod> -n <ns> --image=busybox --target=<container>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "exec",
          "debug",
          "ephemeral"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/",
              "title": "Kubernetes: debug running pods"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/kubectl-node-debug/",
              "title": "Kubernetes: debug a node with kubectl"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_debug/",
              "title": "kubectl debug"
            }
          ],
          "note": "With the default profile, chroot /host fails in a node debug pod: use --profile=sysadmin."
        }
      },
      {
        "id": "kubectl-exec-debug-sub-3",
        "desc": "Debug pod on a node, host filesystem under /host (changes state)",
        "cmd": "kubectl debug node/<node> -it --image=busybox",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "exec",
          "debug",
          "ephemeral"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/",
              "title": "Kubernetes: debug running pods"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/kubectl-node-debug/",
              "title": "Kubernetes: debug a node with kubectl"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_debug/",
              "title": "kubectl debug"
            }
          ],
          "note": "With the default profile, chroot /host fails in a node debug pod: use --profile=sysadmin."
        }
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-6",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Reach a service from your workstation, and see live resource usage",
    "subtitle": "Reach a service from your workstation, and see live resource usage",
    "commands": [
      {
        "id": "kubectl-port-forward-top",
        "desc": "Reach a service from your workstation, and see live resource usage",
        "cmd": "kubectl port-forward svc/<service> 8080:80 -n <ns>",
        "details": "",
        "flags": [
          [
            "port-forward svc/<svc> 8080:80",
            "Local port 8080 → service port 80, through the API server; stays open until Ctrl+C"
          ],
          [
            "kubectl top pods",
            "Live CPU and memory per pod (needs metrics-server installed)"
          ],
          [
            "--sort-by=memory",
            "Biggest consumers first"
          ]
        ],
        "tip": "Service has no endpoints? Its selector doesn't match any ready pod",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "port-forward",
          "top",
          "metrics",
          "service",
          "endpoints"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_port-forward/",
              "title": "kubectl port-forward"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/",
              "title": "kubectl top"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/",
              "title": "Kubernetes: EndpointSlices"
            }
          ]
        }
      },
      {
        "id": "kubectl-port-forward-top-sub-1",
        "desc": "Memory hogs in a namespace",
        "cmd": "kubectl top pods -n <ns> --sort-by=memory",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "port-forward",
          "top",
          "metrics"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_port-forward/",
              "title": "kubectl port-forward"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/",
              "title": "kubectl top"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/",
              "title": "Kubernetes: EndpointSlices"
            }
          ]
        }
      },
      {
        "id": "kubectl-port-forward-top-sub-2",
        "desc": "CPU and memory per node",
        "cmd": "kubectl top nodes",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "port-forward",
          "top",
          "metrics"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_port-forward/",
              "title": "kubectl port-forward"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/",
              "title": "kubectl top"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/",
              "title": "Kubernetes: EndpointSlices"
            }
          ]
        }
      },
      {
        "id": "kubectl-port-forward-top-sub-3",
        "desc": "Which pod IPs a service actually sends traffic to",
        "cmd": "kubectl get endpointslices -n <ns> -l kubernetes.io/service-name=<service>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "port-forward",
          "top",
          "metrics"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_port-forward/",
              "title": "kubectl port-forward"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/",
              "title": "kubectl top"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/",
              "title": "Kubernetes: EndpointSlices"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-pro-tips",
    "badge": "tip",
    "title": "Kubernetes Troubleshooting: Pro Tip",
    "subtitle": "A fixed order for any broken pod",
    "commands": [
      {
        "id": "k8s-troubleshoot-tips-card",
        "desc": "A fixed order for any broken pod",
        "cmd": "kubectl describe pod <pod> -n <ns> | sed -n '/^Events:/,$p'",
        "details": "1) get pods -o wide: status, restarts and node. 2) describe: Events and Last State. 3) logs --previous: the crash itself. 4) get events --sort-by: what else happened around it. 5) If the node is involved (NotReady, evictions, GPU missing), move to the Nodes and GPU sheets.",
        "flags": [
          [
            "1. kubectl get pods -o wide",
            "Status, restarts, node"
          ],
          [
            "2. kubectl describe pod",
            "Events and Last State"
          ],
          [
            "3. kubectl logs --previous",
            "The crash"
          ],
          [
            "4. kubectl get events --sort-by",
            "Surrounding timeline"
          ]
        ],
        "tip": "Status → Events → previous logs → node",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/",
              "title": "Kubernetes: debug pods"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-nodes-cmd-1",
    "badge": "node",
    "title": "Kubernetes Nodes & Maintenance: List nodes with status, version, OS and container runtime",
    "subtitle": "List nodes with status, version, OS and container runtime",
    "commands": [
      {
        "id": "kubectl-nodes-wide",
        "desc": "List nodes with status, version, OS and container runtime",
        "cmd": "kubectl get nodes -o wide",
        "details": "",
        "flags": [
          [
            "STATUS Ready",
            "kubelet is reporting healthy; NotReady means kubelet stopped reporting (crashed, network, or server down)"
          ],
          [
            "SchedulingDisabled",
            "The node is cordoned: existing pods stay, no new ones arrive"
          ],
          [
            "VERSION",
            "kubelet version"
          ],
          [
            "CONTAINER-RUNTIME",
            "Usually containerd://<version>"
          ]
        ],
        "tip": "NotReady = kubelet stopped reporting",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "nodes",
          "ready",
          "notready",
          "describe",
          "wide"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe/",
              "title": "kubectl describe"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/nodes/",
              "title": "Kubernetes: nodes"
            }
          ]
        }
      },
      {
        "id": "kubectl-nodes-wide-sub-1",
        "desc": "Conditions, capacity, allocated resources, taints and recent events",
        "cmd": "kubectl describe node <node>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "nodes",
          "ready",
          "notready"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe/",
              "title": "kubectl describe"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/nodes/",
              "title": "Kubernetes: nodes"
            }
          ]
        }
      },
      {
        "id": "kubectl-nodes-wide-sub-2",
        "desc": "Every pod on one node, e.g. before draining it",
        "cmd": "kubectl get pods -A -o wide --field-selector spec.nodeName=<node>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "nodes",
          "ready",
          "notready"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/",
              "title": "kubectl get"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe/",
              "title": "kubectl describe"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/nodes/",
              "title": "Kubernetes: nodes"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-nodes-cmd-2",
    "badge": "node",
    "title": "Kubernetes Nodes & Maintenance: Take a node out of service for hardware work",
    "subtitle": "Take a node out of service for hardware work: cordon, then drain (changes state: ask first)",
    "commands": [
      {
        "id": "kubectl-cordon-drain",
        "desc": "Take a node out of service for hardware work: cordon, then drain (changes state: ask first)",
        "cmd": "kubectl drain <node> --ignore-daemonsets --delete-emptydir-data --timeout=10m",
        "details": "",
        "flags": [
          [
            "kubectl cordon <node>",
            "Stop new pods landing on it; running pods stay"
          ],
          [
            "kubectl drain <node>",
            "Cordon, then evict pods so their controllers recreate them elsewhere"
          ],
          [
            "--ignore-daemonsets",
            "DaemonSet pods (CNI, GPU operator, monitoring) are meant to run everywhere and are left alone"
          ],
          [
            "--delete-emptydir-data",
            "Allow evicting pods with emptyDir volumes; that scratch data is lost"
          ],
          [
            "PodDisruptionBudget errors",
            "Drain waits rather than break an app's minimum availability; don't --force past it without the app owner"
          ],
          [
            "kubectl uncordon <node>",
            "Put the node back into service after the work"
          ]
        ],
        "tip": "Approval first; check the active context",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "drain",
          "cordon",
          "uncordon",
          "maintenance",
          "pdb",
          "rma"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/",
              "title": "kubectl drain"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",
              "title": "Kubernetes: disruptions and PDBs"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/",
              "title": "Kubernetes: safely drain a node"
            }
          ]
        }
      },
      {
        "id": "kubectl-cordon-drain-sub-1",
        "desc": "Mark unschedulable (changes state)",
        "cmd": "kubectl cordon <node>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "drain",
          "cordon",
          "uncordon"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/",
              "title": "kubectl drain"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",
              "title": "Kubernetes: disruptions and PDBs"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/",
              "title": "Kubernetes: safely drain a node"
            }
          ]
        }
      },
      {
        "id": "kubectl-cordon-drain-sub-2",
        "desc": "Return to service (changes state)",
        "cmd": "kubectl uncordon <node>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "drain",
          "cordon",
          "uncordon"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/",
              "title": "kubectl drain"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",
              "title": "Kubernetes: disruptions and PDBs"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/",
              "title": "Kubernetes: safely drain a node"
            }
          ]
        }
      },
      {
        "id": "kubectl-cordon-drain-sub-3",
        "desc": "true = still cordoned",
        "cmd": "kubectl get node <node> -o jsonpath='{.spec.unschedulable}'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "drain",
          "cordon",
          "uncordon"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/",
              "title": "kubectl drain"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/",
              "title": "Kubernetes: disruptions and PDBs"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/",
              "title": "Kubernetes: safely drain a node"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-nodes-cmd-3",
    "badge": "node",
    "title": "Kubernetes Nodes & Maintenance: Show a node's taints and labels",
    "subtitle": "Show a node's taints and labels",
    "commands": [
      {
        "id": "kubectl-taints-labels",
        "desc": "Show a node's taints and labels",
        "cmd": "kubectl get node <node> -o jsonpath='{.spec.taints}'",
        "details": "",
        "flags": [
          [
            "taint key=value:NoSchedule",
            "Only pods that tolerate the taint can be scheduled here (common on GPU nodes)"
          ],
          [
            "NoExecute",
            "Also evicts running pods that don't tolerate it"
          ],
          [
            "key=value:NoSchedule- (trailing dash)",
            "Removes that taint"
          ],
          [
            "--show-labels",
            "kubectl get nodes --show-labels lists every label"
          ]
        ],
        "tip": "Trailing dash removes a taint",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "taint",
          "toleration",
          "label",
          "noschedule"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/",
              "title": "Kubernetes: taints and tolerations"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_taint/",
              "title": "kubectl taint"
            }
          ]
        }
      },
      {
        "id": "kubectl-taints-labels-sub-1",
        "desc": "All node labels",
        "cmd": "kubectl get nodes --show-labels",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "taint",
          "toleration",
          "label"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/",
              "title": "Kubernetes: taints and tolerations"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_taint/",
              "title": "kubectl taint"
            }
          ]
        }
      },
      {
        "id": "kubectl-taints-labels-sub-2",
        "desc": "Add a taint (changes state)",
        "cmd": "kubectl taint nodes <node> <key>=<value>:NoSchedule",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "taint",
          "toleration",
          "label"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/",
              "title": "Kubernetes: taints and tolerations"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_taint/",
              "title": "kubectl taint"
            }
          ]
        }
      },
      {
        "id": "kubectl-taints-labels-sub-3",
        "desc": "Add or change a label (changes state)",
        "cmd": "kubectl label node <node> <key>=<value>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "taint",
          "toleration",
          "label"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/",
              "title": "Kubernetes: taints and tolerations"
            },
            {
              "url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_taint/",
              "title": "kubectl taint"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-nodes-cmd-4",
    "badge": "node",
    "title": "Kubernetes Nodes & Maintenance: On the node itself",
    "subtitle": "On the node itself: kubelet logs and containers via crictl (works when the API is unreachable)",
    "commands": [
      {
        "id": "node-kubelet-crictl",
        "desc": "On the node itself: kubelet logs and containers via crictl (works when the API is unreachable)",
        "cmd": "journalctl -u kubelet --since '30 min ago' --no-pager",
        "details": "",
        "flags": [
          [
            "journalctl -u kubelet",
            "kubelet's own log: registration, image pulls, eviction decisions, volume mounts"
          ],
          [
            "crictl",
            "Talks to containerd directly through the CRI socket; Kubernetes no longer uses Docker (dockershim was removed in 1.24)"
          ],
          [
            "crictl ps -a",
            "Containers including exited ones, with their pod names"
          ],
          [
            "cgroup v2",
            "stat -fc %T /sys/fs/cgroup must print cgroup2fs; the kubelet won't start on cgroup v1 by default (deprecated since 1.35)"
          ]
        ],
        "tip": "API down? crictl on the node still works",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "kubelet",
          "crictl",
          "containerd",
          "journalctl",
          "cgroup",
          "node"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/",
              "title": "Kubernetes: debugging with crictl"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/",
              "title": "Kubernetes: migrating from dockershim (removed in 1.24)"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: 'kubelet 1.37 refuses cgroup v1' → cgroup v1 deprecated since 1.35; the kubelet won't start on it by default (failCgroupV1)."
        }
      },
      {
        "id": "node-kubelet-crictl-sub-1",
        "desc": "Are kubelet and containerd running",
        "cmd": "systemctl status kubelet containerd --no-pager",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/",
              "title": "Kubernetes: debugging with crictl"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/",
              "title": "Kubernetes: migrating from dockershim (removed in 1.24)"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: 'kubelet 1.37 refuses cgroup v1' → cgroup v1 deprecated since 1.35; the kubelet won't start on it by default (failCgroupV1)."
        }
      },
      {
        "id": "node-kubelet-crictl-sub-2",
        "desc": "All containers on this node",
        "cmd": "crictl ps -a",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/",
              "title": "Kubernetes: debugging with crictl"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/",
              "title": "Kubernetes: migrating from dockershim (removed in 1.24)"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: 'kubelet 1.37 refuses cgroup v1' → cgroup v1 deprecated since 1.35; the kubelet won't start on it by default (failCgroupV1)."
        }
      },
      {
        "id": "node-kubelet-crictl-sub-3",
        "desc": "Container logs without going through the API server",
        "cmd": "crictl logs --tail 100 <container-id>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/",
              "title": "Kubernetes: debugging with crictl"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/",
              "title": "Kubernetes: migrating from dockershim (removed in 1.24)"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: 'kubelet 1.37 refuses cgroup v1' → cgroup v1 deprecated since 1.35; the kubelet won't start on it by default (failCgroupV1)."
        }
      },
      {
        "id": "node-kubelet-crictl-sub-4",
        "desc": "Pod sandboxes on this node",
        "cmd": "crictl pods",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/",
              "title": "Kubernetes: debugging with crictl"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/",
              "title": "Kubernetes: migrating from dockershim (removed in 1.24)"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: 'kubelet 1.37 refuses cgroup v1' → cgroup v1 deprecated since 1.35; the kubelet won't start on it by default (failCgroupV1)."
        }
      },
      {
        "id": "node-kubelet-crictl-sub-5",
        "desc": "cgroup2fs = cgroup v2 (the kubelet refuses cgroup v1 by default)",
        "cmd": "stat -fc %T /sys/fs/cgroup",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/",
              "title": "Kubernetes: debugging with crictl"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/",
              "title": "Kubernetes: migrating from dockershim (removed in 1.24)"
            },
            {
              "url": "https://kubernetes.io/docs/concepts/architecture/cgroups/",
              "title": "Kubernetes: about cgroup v2"
            }
          ],
          "note": "Corrected 2026-11-09: 'kubelet 1.37 refuses cgroup v1' → cgroup v1 deprecated since 1.35; the kubelet won't start on it by default (failCgroupV1)."
        }
      }
    ]
  },
  {
    "id": "k8s-nodes-pro-tips",
    "badge": "tip",
    "title": "Kubernetes Nodes & Maintenance: Pro Tip",
    "subtitle": "Hardware work on a Kubernetes GPU node",
    "commands": [
      {
        "id": "k8s-nodes-tips-card",
        "desc": "Hardware work on a Kubernetes GPU node",
        "cmd": "kubectl get pods -A -o wide --field-selector spec.nodeName=<node>",
        "details": "Before an RMA or reseat: list what's running on the node, get approval, cordon, drain with --ignore-daemonsets, confirm only DaemonSet pods remain, then do the work. Afterwards check the node is Ready, the GPU count is back (see the GPU sheet), and uncordon. If Slurm also schedules on the node, drain it there as well.",
        "flags": [
          [
            "Before",
            "List pods on the node and get approval"
          ],
          [
            "Drain",
            "--ignore-daemonsets --delete-emptydir-data"
          ],
          [
            "After",
            "Node Ready + GPU allocatable restored, then uncordon"
          ]
        ],
        "tip": "List → approve → cordon → drain → work → verify → uncordon",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/",
              "title": "Kubernetes: safely drain a node"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-gpu-cmd-1",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: How many GPUs each node advertises to the scheduler",
    "subtitle": "How many GPUs each node advertises to the scheduler",
    "commands": [
      {
        "id": "k8s-gpu-allocatable",
        "desc": "How many GPUs each node advertises to the scheduler",
        "cmd": "kubectl get nodes -o custom-columns=NAME:.metadata.name,GPUS:.status.allocatable.nvidia\\.com/gpu",
        "details": "",
        "flags": [
          [
            "nvidia\\.com/gpu",
            "The dots in the resource name are escaped so custom-columns doesn't read them as path separators"
          ],
          [
            "<none>",
            "The device plugin isn't running on that node, or found no GPUs"
          ],
          [
            "Fewer than installed (e.g. 7 of 8)",
            "A GPU dropped off the bus or failed health checks; check nvidia-smi and dmesg on the node"
          ]
        ],
        "tip": "7 of 8 GPUs? Check the node, not Kubernetes",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "gpu",
          "allocatable",
          "nvidia.com/gpu",
          "custom-columns",
          "capacity"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/",
              "title": "Kubernetes: schedule GPUs"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ],
          "note": "Corrected 2026-11-09: the GPU-node label is feature.node.kubernetes.io/pci-10de.present=true, the one the GPU Operator docs use (nvidia.com/gpu.present isn't on that page)."
        }
      },
      {
        "id": "k8s-gpu-allocatable-sub-1",
        "desc": "GPUs requested by pods vs. available on one node",
        "cmd": "kubectl describe node <node> | grep -A10 'Allocated resources'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "allocatable",
          "nvidia.com/gpu"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/",
              "title": "Kubernetes: schedule GPUs"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ],
          "note": "Corrected 2026-11-09: the GPU-node label is feature.node.kubernetes.io/pci-10de.present=true, the one the GPU Operator docs use (nvidia.com/gpu.present isn't on that page)."
        }
      },
      {
        "id": "k8s-gpu-allocatable-sub-2",
        "desc": "Nodes with an NVIDIA PCI device (the label the GPU Operator uses to find GPU nodes)",
        "cmd": "kubectl get nodes -l feature.node.kubernetes.io/pci-10de.present=true",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "allocatable",
          "nvidia.com/gpu"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/",
              "title": "Kubernetes: schedule GPUs"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ],
          "note": "Corrected 2026-11-09: the GPU-node label is feature.node.kubernetes.io/pci-10de.present=true, the one the GPU Operator docs use (nvidia.com/gpu.present isn't on that page)."
        }
      }
    ]
  },
  {
    "id": "k8s-gpu-cmd-2",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Check the NVIDIA GPU Operator components",
    "subtitle": "Check the NVIDIA GPU Operator components",
    "commands": [
      {
        "id": "k8s-gpu-operator-pods",
        "desc": "Check the NVIDIA GPU Operator components",
        "cmd": "kubectl get pods -n gpu-operator -o wide",
        "details": "",
        "flags": [
          [
            "gpu-operator namespace",
            "The namespace NVIDIA's install examples use (Helm's default is default); yours may differ: kubectl get pods -A | grep -i nvidia"
          ],
          [
            "driver daemonset",
            "Installs the driver in a container on each GPU node (if the operator manages the driver)"
          ],
          [
            "container-toolkit daemonset",
            "Configures containerd for GPUs"
          ],
          [
            "device-plugin daemonset",
            "Advertises nvidia.com/gpu to the scheduler"
          ],
          [
            "dcgm-exporter",
            "GPU metrics for Prometheus"
          ],
          [
            "validator",
            "Checks the stack works; Init or Error here explains missing GPUs"
          ]
        ],
        "tip": "Validator not Completed = stack not ready",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "gpu-operator",
          "device-plugin",
          "driver",
          "dcgm",
          "validator"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ],
          "note": "Pod names in the docs: nvidia-driver-daemonset, nvidia-container-toolkit-daemonset, nvidia-device-plugin-daemonset, nvidia-dcgm-exporter, nvidia-operator-validator, gpu-feature-discovery. Checked against GPU Operator v26.7."
        }
      },
      {
        "id": "k8s-gpu-operator-pods-sub-1",
        "desc": "Why GPUs aren't being advertised",
        "cmd": "kubectl logs -n gpu-operator <device-plugin-pod>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu-operator",
          "device-plugin",
          "driver"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ],
          "note": "Pod names in the docs: nvidia-driver-daemonset, nvidia-container-toolkit-daemonset, nvidia-device-plugin-daemonset, nvidia-dcgm-exporter, nvidia-operator-validator, gpu-feature-discovery. Checked against GPU Operator v26.7."
        }
      },
      {
        "id": "k8s-gpu-operator-pods-sub-2",
        "desc": "Run nvidia-smi through the driver container",
        "cmd": "kubectl exec -n gpu-operator <driver-pod> -- nvidia-smi",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu-operator",
          "device-plugin",
          "driver"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ],
          "note": "Pod names in the docs: nvidia-driver-daemonset, nvidia-container-toolkit-daemonset, nvidia-device-plugin-daemonset, nvidia-dcgm-exporter, nvidia-operator-validator, gpu-feature-discovery. Checked against GPU Operator v26.7."
        }
      }
    ]
  },
  {
    "id": "k8s-gpu-cmd-3",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Test pod that requests one GPU and runs nvidia-smi",
    "subtitle": "Test pod that requests one GPU and runs nvidia-smi",
    "commands": [
      {
        "id": "k8s-gpu-test-pod",
        "desc": "Test pod that requests one GPU and runs nvidia-smi",
        "cmd": "apiVersion: v1\nkind: Pod\nmetadata:\n  name: gpu-test\nspec:\n  restartPolicy: Never\n  containers:\n    - name: cuda\n      image: nvidia/cuda:<tag>\n      command: [\"nvidia-smi\", \"-L\"]\n      resources:\n        limits:\n          nvidia.com/gpu: 1",
        "details": "",
        "flags": [
          [
            "limits: nvidia.com/gpu: 1",
            "GPUs are requested under limits and are whole devices (no fractions without MIG or time-slicing)"
          ],
          [
            "restartPolicy: Never",
            "Run once and stop, so you can read the output"
          ],
          [
            "Pending: Insufficient nvidia.com/gpu",
            "Every GPU is already allocated, or none are advertised"
          ],
          [
            "Toleration",
            "If GPU nodes are tainted, add a matching toleration"
          ]
        ],
        "tip": "GPUs go under limits, in whole numbers",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "gpu",
          "pod",
          "test",
          "limits",
          "nvidia-smi"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/",
              "title": "Kubernetes: schedule GPUs"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ]
        }
      },
      {
        "id": "k8s-gpu-test-pod-sub-1",
        "desc": "Create the test pod (changes state)",
        "cmd": "kubectl apply -f gpu-test.yaml",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "pod",
          "test"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/",
              "title": "Kubernetes: schedule GPUs"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ]
        }
      },
      {
        "id": "k8s-gpu-test-pod-sub-2",
        "desc": "Should list one GPU",
        "cmd": "kubectl logs gpu-test",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "pod",
          "test"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/",
              "title": "Kubernetes: schedule GPUs"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ]
        }
      },
      {
        "id": "k8s-gpu-test-pod-sub-3",
        "desc": "Clean up (changes state)",
        "cmd": "kubectl delete pod gpu-test",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "pod",
          "test"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/",
              "title": "Kubernetes: schedule GPUs"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "k8s-gpu-cmd-4",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Read GPU metrics from DCGM exporter",
    "subtitle": "Read GPU metrics from DCGM exporter",
    "commands": [
      {
        "id": "k8s-dcgm-metrics",
        "desc": "Read GPU metrics from DCGM exporter",
        "cmd": "kubectl port-forward -n gpu-operator svc/nvidia-dcgm-exporter 9400:9400",
        "details": "",
        "flags": [
          [
            "port 9400",
            "DCGM exporter's default metrics port"
          ],
          [
            "curl -s localhost:9400/metrics",
            "From a second terminal while the port-forward runs"
          ],
          [
            "DCGM_FI_DEV_XID_ERROR",
            "Last Xid error per GPU; map it with the NVIDIA DC Xid sheet (exporters before 4.9.0: DCGM_FI_DEV_XID_ERRORS)"
          ],
          [
            "DCGM_FI_DEV_GPU_TEMP_CELSIUS / BOARD_POWER_WATTS",
            "Temperature and power per GPU (before 4.9.0: DCGM_FI_DEV_GPU_TEMP / POWER_USAGE)"
          ]
        ],
        "tip": "Xid in DCGM → check the NVIDIA DC Xid sheet",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "dcgm",
          "metrics",
          "prometheus",
          "xid",
          "temperature"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/main/etc/default-counters.csv",
              "title": "dcgm-exporter default counters"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/releases",
              "title": "dcgm-exporter releases (4.9.0 renames)"
            }
          ],
          "note": "The service name nvidia-dcgm-exporter and port 9400 aren't stated on the pages read: kubectl get svc -A | grep -i dcgm shows yours."
        }
      },
      {
        "id": "k8s-dcgm-metrics-sub-1",
        "desc": "Xid errors and temperatures",
        "cmd": "curl -s localhost:9400/metrics | grep -E 'XID|GPU_TEMP'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "dcgm",
          "metrics",
          "prometheus"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/main/etc/default-counters.csv",
              "title": "dcgm-exporter default counters"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/releases",
              "title": "dcgm-exporter releases (4.9.0 renames)"
            }
          ],
          "note": "The service name nvidia-dcgm-exporter and port 9400 aren't stated on the pages read: kubectl get svc -A | grep -i dcgm shows yours."
        }
      },
      {
        "id": "k8s-dcgm-metrics-sub-2",
        "desc": "Find the exporter service if it's in another namespace",
        "cmd": "kubectl get svc -A | grep -i dcgm",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "dcgm",
          "metrics",
          "prometheus"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/main/etc/default-counters.csv",
              "title": "dcgm-exporter default counters"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/releases",
              "title": "dcgm-exporter releases (4.9.0 renames)"
            }
          ],
          "note": "The service name nvidia-dcgm-exporter and port 9400 aren't stated on the pages read: kubectl get svc -A | grep -i dcgm shows yours."
        }
      }
    ]
  },
  {
    "id": "k8s-gpu-pro-tips",
    "badge": "tip",
    "title": "Kubernetes GPUs: Pro Tip",
    "subtitle": "GPU missing in Kubernetes: check from the hardware up",
    "commands": [
      {
        "id": "k8s-gpu-tips-card",
        "desc": "GPU missing in Kubernetes: check from the hardware up",
        "cmd": "kubectl get nodes -o custom-columns=NAME:.metadata.name,GPUS:.status.allocatable.nvidia\\.com/gpu",
        "details": "Start at the bottom. On the node: does nvidia-smi see every GPU, and is dmesg free of Xid or 'fallen off the bus' errors? Then the GPU Operator: driver, toolkit and device-plugin pods Running, validator Completed. Then the node's allocatable count. Only after all three are right is it a scheduling problem.",
        "flags": [
          [
            "1. Node",
            "nvidia-smi and dmesg -T | grep -i xid"
          ],
          [
            "2. Operator",
            "kubectl get pods -n gpu-operator"
          ],
          [
            "3. Allocatable",
            "custom-columns query above"
          ],
          [
            "4. Scheduling",
            "describe pod → Events"
          ]
        ],
        "tip": "Hardware → operator pods → allocatable → scheduling",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html",
              "title": "NVIDIA GPU Operator: getting started"
            },
            {
              "url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/",
              "title": "Kubernetes: schedule GPUs"
            }
          ]
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("containers_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = CONTAINERS_CHEAT_SHEET_DATA;
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

  for (const card of CONTAINERS_CHEAT_SHEET_DATA) {
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
        localStorage.setItem("containers_bookmarks", JSON.stringify([...state.bookmarks]));
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
