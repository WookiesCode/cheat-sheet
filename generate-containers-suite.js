// generate-containers-suite.js
// Generates the Containers suite: a hub (containers.html) plus 5 Docker and 5 Kubernetes
// sheets, and inserts the Containers dropdown into the nav of every HTML sheet.
//
// The section data lives in this file (there is no hand-written hub with extra tools).
// Facts checked 2026-11-06 against official sources: Docker Engine 29.x with the
// `docker compose` plugin (Compose v1 `docker-compose` is end-of-life), Kubernetes 1.37
// (kubelet refuses cgroup v1 nodes by default), NVIDIA Container Toolkit `nvidia-ctk`
// (CDI in Docker needs Engine 25+).
//
// Re-runnable: sheet .js files are rewritten every run; .html files are only created when
// missing (existing pages own their chrome); the nav dropdown is replaced if present.
const fs = require('fs');
const path = require('path');
const { mergeCommandCards } = require('./generate-card-utils');

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 1. Section data. Each section becomes one sheet. `group` picks the nav column.
const CONTAINER_SECTIONS = [
  // ---------------------------------------------------------------- DOCKER
  {
    id: "docker-containers", group: "docker", file: "docker-containers", badge: "run", code: "run",
    name: "Docker Containers", navDesc: "run, ps, logs, exec, inspect",
    title: "Docker Containers: run, ps, logs, exec & inspect",
    subtitle: "Start containers, see what is running, read logs, get a shell, and find out why a container exited",
    commands: [
      {
        id: "docker-ps-table",
        desc: "List all containers (running and stopped) as a readable table",
        cmd: "docker ps -a --format 'table {{.Names}}\\t{{.Image}}\\t{{.Status}}\\t{{.Ports}}'",
        flags: [
          ["-a / --all", "Include stopped containers. Without it you only see running ones, so a crashed container looks like it vanished"],
          ["--format 'table ...'", "Go template: {{.Names}}, {{.Image}}, {{.Status}}, {{.Ports}} pick columns, \\t separates them, 'table' adds a header row"],
          ["Status column", "'Up 3 hours' = running; 'Exited (137)' = killed (137 = 128 + signal 9, often the OOM killer); 'Exited (0)' = finished normally"],
          ["-q", "Print only container IDs, useful for loops: docker ps -q"],
          ["--filter status=exited", "Show only containers in one state (running, exited, restarting, paused)"]
        ],
        tip: "Exit 137 = SIGKILL, usually out of memory",
        tags: ["ps", "list", "status", "exited", "format"]
      },
      {
        id: "docker-run-detached",
        desc: "Run a container in the background with a name, a restart policy and a published port (changes state)",
        cmd: "docker run -d --name <name> --restart unless-stopped -p 8080:80 <image>:<tag>",
        flags: [
          ["-d", "Detached: run in the background and print the container ID"],
          ["--name <name>", "A fixed name, so later commands can use it instead of a random ID"],
          ["--restart unless-stopped", "Restart after crashes and reboots, unless you stopped it yourself. Other values: no, on-failure[:N], always"],
          ["-p 8080:80", "Publish container port 80 on host port 8080 (host:container order)"],
          ["--rm", "Delete the container when it exits; good for one-off commands, never combine with a restart policy"],
          ["-e KEY=value / --env-file .env", "Set environment variables"]
        ],
        subcommands: [
          ["docker run --rm -it ubuntu:24.04 bash", "Throwaway interactive container: gone as soon as you exit the shell"],
          ["docker stop <container>", "Send SIGTERM, then SIGKILL after 10 s (changes state)"],
          ["docker start <container>", "Start a stopped container again with its original settings (changes state)"],
          ["docker restart <container>", "Stop then start (changes state)"],
          ["docker rm <container>", "Delete a stopped container; its writable layer is lost (changes state)"]
        ],
        tip: "Ports are host:container",
        tags: ["run", "start", "detached", "restart", "port", "publish"]
      },
      {
        id: "docker-logs-tail",
        desc: "Read the last 200 log lines of a container with timestamps",
        cmd: "docker logs --tail 200 --timestamps <container>",
        flags: [
          ["--tail 200", "Only the last 200 lines; without it Docker prints the whole log"],
          ["--timestamps / -t", "Prefix each line with the time Docker received it, to line up with dmesg or the BMC SEL"],
          ["--since 30m", "Only lines from the last 30 minutes (also accepts a timestamp like 2026-11-06T12:00)"],
          ["-f", "Follow new lines live (Ctrl+C to stop)"]
        ],
        subcommands: [
          ["docker logs --since 30m <container> 2>&1 | grep -i error", "Errors from the last 30 minutes. 2>&1 merges stderr, where many apps write errors"],
          ["docker logs -f --tail 50 <container>", "Follow live output, starting from the last 50 lines"]
        ],
        tip: "Apps often log to stderr: add 2>&1 before grep",
        tags: ["logs", "tail", "follow", "stderr", "timestamps"]
      },
      {
        id: "docker-exec-shell",
        desc: "Run a command inside a running container, or open a shell in it",
        cmd: "docker exec <container> cat /etc/os-release",
        flags: [
          ["docker exec <c> <cmd>", "Runs <cmd> inside the container's namespaces; the container must already be running"],
          ["-it", "-i keeps stdin open and -t allocates a terminal: both are needed for an interactive shell"],
          ["sh vs bash", "Slim images often have no bash. Try sh if bash gives 'executable file not found'"],
          ["-u 0", "Run as root inside the container, for debugging an image that drops privileges"]
        ],
        subcommands: [
          ["docker exec -it <container> sh", "Interactive shell inside the container (exit with Ctrl+D)"],
          ["docker exec <container> env", "Show the environment variables the app actually sees"]
        ],
        tip: "No bash? Use sh",
        tags: ["exec", "shell", "sh", "bash", "interactive"]
      },
      {
        id: "docker-inspect-state",
        desc: "Find out why a container stopped: state, exit code, OOM kill and restart count",
        cmd: "docker inspect <container> --format '{{.State.Status}} exit={{.State.ExitCode}} oom={{.State.OOMKilled}} restarts={{.RestartCount}}'",
        flags: [
          ["docker inspect", "Prints the full container configuration and state as JSON"],
          ["--format '{{...}}'", "Go template that pulls single fields out of that JSON"],
          ["oom=true", "The kernel's OOM killer stopped it: raise the memory limit or fix the leak. Confirm with dmesg -T | grep -i oom"],
          ["restarts=N rising", "The restart policy keeps bringing it back: a crash loop. Read docker logs from just before each restart"]
        ],
        subcommands: [
          ["docker inspect <container> | jq '.[0].Mounts'", "Which host paths and volumes are mounted, via jq"],
          ["docker stats --no-stream", "One snapshot of CPU, memory, network and disk I/O per container (without --no-stream it keeps refreshing)"],
          ["docker top <container>", "Processes running inside the container, as seen from the host"]
        ],
        tip: "Exited + oom=true → memory limit",
        tags: ["inspect", "state", "exitcode", "oom", "restart", "stats", "debug"]
      }
    ],
    proTip: {
      desc: "Read the state before you restart anything",
      cmd: "docker ps -a --filter status=exited --format '{{.Names}} {{.Status}}'",
      details: "When a service is down, the evidence is in the stopped container: its exit code, its last log lines and whether the OOM killer hit it. docker rm or a restart with --rm throws that evidence away. Capture docker logs and docker inspect first, then restart.",
      tip: "Capture logs + inspect output into cases/<host>/logs/ before restarting",
      flags: [
        ["Exit 0", "The process finished on its own; check the command or entrypoint"],
        ["Exit 1 / 2", "The application reported an error; read its logs"],
        ["Exit 125 / 126 / 127", "Docker could not start it: bad option, not executable, or command not found"],
        ["Exit 137", "Killed with SIGKILL: OOM killer or docker kill"],
        ["Exit 143", "Stopped with SIGTERM: a normal docker stop"]
      ]
    }
  },
  {
    id: "docker-images", group: "docker", file: "docker-images", badge: "img", code: "img",
    name: "Docker Images", navDesc: "build, pull, save/load, prune",
    title: "Docker Images: build, tag, pull, save/load & prune",
    subtitle: "Build images with BuildKit, move them between registries and air-gapped hosts, and reclaim disk space",
    commands: [
      {
        id: "docker-image-ls",
        desc: "List local images with their size and digest",
        cmd: "docker image ls --digests",
        flags: [
          ["REPOSITORY:TAG", "The human name. Tags move: :latest today may be a different image tomorrow"],
          ["--digests", "Show the sha256 content digest, which never changes for the same image"],
          ["<none>:<none>", "Dangling images: old layers left behind when a tag moved to a newer build"]
        ],
        subcommands: [
          ["docker system df", "Disk used by images, containers, volumes and build cache, and how much is reclaimable"],
          ["docker history --no-trunc <image>:<tag>", "The layers of an image and the Dockerfile step that created each one"]
        ],
        tip: "Pin production images by digest",
        tags: ["images", "ls", "digest", "size", "df"]
      },
      {
        id: "docker-build-tag",
        desc: "Build an image from the Dockerfile in the current directory and tag it (BuildKit is the default builder)",
        cmd: "docker build -t <name>:<tag> .",
        flags: [
          ["-t <name>:<tag>", "Name the result. Use real version tags (1.4.2), not only :latest"],
          [". (build context)", "The directory sent to the builder. Everything in it is uploaded, so add a .dockerignore"],
          ["-f <path>", "Use a Dockerfile with a different name or location"],
          ["--no-cache", "Rebuild every step instead of reusing cached layers"],
          ["--build-arg KEY=value", "Pass an ARG value into the Dockerfile at build time"],
          ["--platform linux/amd64", "Build for another CPU architecture (needs buildx/QEMU for cross builds)"]
        ],
        subcommands: [
          ["docker buildx ls", "List builders and the platforms they can build for"],
          ["docker builder prune", "Delete the build cache when disk is tight (changes state)"]
        ],
        tip: "Add a .dockerignore so .git and data aren't uploaded",
        tags: ["build", "buildkit", "buildx", "dockerfile", "tag"]
      },
      {
        id: "dockerfile-minimal",
        desc: "Minimal Dockerfile for a small Python tool, with the layer-caching order explained",
        cmd: "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nUSER 1000\nCMD [\"python\", \"main.py\"]",
        flags: [
          ["FROM", "The base image. -slim variants are much smaller than the full image"],
          ["COPY requirements.txt before COPY . .", "Dependencies change less often than code, so this layer stays cached and rebuilds are fast"],
          ["RUN", "Runs at build time and creates a layer. Each RUN, COPY and ADD adds a layer"],
          ["USER 1000", "Run as a non-root user; root in a container is still root on shared kernels"],
          ["CMD [\"...\"] (exec form)", "JSON array form: the app gets signals directly, so docker stop works cleanly"]
        ],
        tip: "Order steps from least to most often changed",
        tags: ["dockerfile", "from", "run", "copy", "cmd", "layers", "cache"]
      },
      {
        id: "docker-pull-tag-push",
        desc: "Pull an image, retag it for a private registry and push it (push changes the registry)",
        cmd: "docker pull <image>:<tag>",
        flags: [
          ["docker pull", "Downloads layers you don't already have"],
          ["docker tag <src> <registry>/<repo>:<tag>", "Adds a second name pointing at the same image; nothing is copied"],
          ["docker push", "Uploads to the registry named at the start of the tag (needs docker login first)"]
        ],
        subcommands: [
          ["docker tag <image>:<tag> <registry>/<repo>:<tag>", "Retag for your own registry"],
          ["docker push <registry>/<repo>:<tag>", "Upload to that registry (changes state)"],
          ["docker image inspect <image>:<tag> --format '{{.Architecture}} {{.Os}}'", "Check the image matches the host CPU (amd64 vs arm64)"]
        ],
        tip: "A tag is just a pointer",
        tags: ["pull", "push", "tag", "registry"]
      },
      {
        id: "docker-save-load-airgap",
        desc: "Move an image to an air-gapped host as a tar file",
        cmd: "docker save -o <name>.tar <image>:<tag>",
        flags: [
          ["docker save -o <file>.tar", "Writes the image, all its layers and tags into one tar file"],
          ["docker load -i <file>.tar", "Imports that tar on the other host; the original tag comes with it"],
          ["gzip / zstd", "Compress for transfer: docker save <image> | zstd > <file>.tar.zst"],
          ["save vs export", "save keeps layers and tags (an image); export flattens a container's filesystem and loses them"]
        ],
        subcommands: [
          ["docker load -i <name>.tar", "Import the image on the target host (changes state)"],
          ["sha256sum <name>.tar", "Checksum before and after copying, to catch a truncated transfer"],
          ["sudo ctr -n k8s.io images import <name>.tar", "Import into containerd's Kubernetes namespace on a node with no Docker (changes state)"]
        ],
        tip: "Checksum the tar on both ends",
        tags: ["save", "load", "airgap", "offline", "tar", "transfer", "ctr", "containerd"]
      },
      {
        id: "docker-prune",
        desc: "Reclaim disk space from stopped containers, unused images and build cache (changes state)",
        cmd: "docker system prune",
        flags: [
          ["docker system prune", "Removes stopped containers, unused networks, dangling images and build cache; asks for confirmation"],
          ["-a", "Also removes every image not used by a container, which means re-pulling later"],
          ["--volumes", "Also removes unused volumes: this deletes data. Never use it casually"],
          ["-f", "Skip the confirmation prompt; avoid in scripts unless you are sure"]
        ],
        subcommands: [
          ["docker system df -v", "See exactly what is using space before you prune"],
          ["docker image prune", "Only dangling images (changes state)"],
          ["docker container prune", "Only stopped containers (changes state)"]
        ],
        tip: "Run docker system df first; never add --volumes blindly",
        tags: ["prune", "cleanup", "disk", "space", "df"]
      }
    ],
    proTip: {
      desc: "Where Docker keeps its data",
      cmd: "docker info --format '{{.DockerRootDir}} {{.Driver}}'",
      details: "Images, containers and volumes live under the Docker root directory (default /var/lib/docker) using the storage driver shown (overlay2 on modern Ubuntu). When / fills up on a GPU node, this directory is the usual culprit. The location is set with data-root in /etc/docker/daemon.json.",
      tip: "Full root disk on a node? Check du -sh /var/lib/docker first",
      flags: [
        ["DockerRootDir", "Where everything is stored, default /var/lib/docker"],
        ["Driver: overlay2", "The normal storage driver on current kernels"],
        ["data-root in daemon.json", "Moves storage to another disk; needs a Docker restart and a data copy (changes state)"]
      ]
    }
  },
  {
    id: "docker-compose", group: "docker", file: "docker-compose", badge: "compose", code: "cmp",
    name: "Docker Compose", navDesc: "multi-container apps",
    title: "Docker Compose: multi-container stacks",
    subtitle: "Define several containers in one compose.yaml and start, inspect and stop them together with docker compose",
    commands: [
      {
        id: "compose-up",
        desc: "Start (or update) every service in compose.yaml in the background (changes state)",
        cmd: "docker compose up -d",
        flags: [
          ["docker compose (with a space)", "The current Compose plugin. The old Python docker-compose (v1) is end-of-life; don't install it"],
          ["up -d", "Create networks and volumes, then start containers detached. Re-running applies changes to compose.yaml"],
          ["-f <file>", "Use a different file; default is compose.yaml (or docker-compose.yml) in the current directory"],
          ["--build", "Rebuild images that have a build: section before starting"],
          ["-p <project>", "Project name, used as a prefix for containers, networks and volumes (default: the directory name)"]
        ],
        subcommands: [
          ["docker compose config", "Print the final merged config with variables filled in; a quick syntax check"],
          ["docker compose pull", "Pull newer images for all services (changes state)"],
          ["docker compose up -d --force-recreate <service>", "Recreate one service even if nothing changed (changes state)"]
        ],
        tip: "Run docker compose config before up",
        tags: ["compose", "up", "stack", "services"]
      },
      {
        id: "compose-ps-logs",
        desc: "See the state of every service in the stack",
        cmd: "docker compose ps",
        flags: [
          ["ps", "One row per service container, with state and health"],
          ["logs --tail 100 <service>", "Logs for one service; without a service name you get all of them interleaved"],
          ["exec <service> sh", "Shell inside a service by its name in compose.yaml, not the container name"]
        ],
        subcommands: [
          ["docker compose logs --tail 100 <service>", "Last 100 lines from one service"],
          ["docker compose logs -f", "Follow all services live (Ctrl+C to stop)"],
          ["docker compose exec <service> sh", "Interactive shell in a service container"]
        ],
        tip: "Use the service name from compose.yaml",
        tags: ["compose", "ps", "logs", "exec"]
      },
      {
        id: "compose-down",
        desc: "Stop and remove the stack's containers and networks (changes state)",
        cmd: "docker compose down",
        flags: [
          ["down", "Stops and removes containers and the default network. Named volumes are kept"],
          ["-v / --volumes", "Also deletes named volumes, so databases lose their data"],
          ["stop", "Use docker compose stop to pause the stack without removing anything"]
        ],
        subcommands: [
          ["docker compose stop", "Stop containers but keep them (changes state)"],
          ["docker compose restart <service>", "Restart one service (changes state)"]
        ],
        tip: "down keeps volumes; down -v deletes them",
        tags: ["compose", "down", "stop", "volumes"]
      },
      {
        id: "compose-yaml-example",
        desc: "Example compose.yaml: a web service plus a database with a named volume and a health check",
        cmd: "services:\n  web:\n    image: nginx:1.27\n    ports:\n      - \"8080:80\"\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD_FILE: /run/secrets/db_pw\n    volumes:\n      - dbdata:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD\", \"pg_isready\"]\n      interval: 10s\nvolumes:\n  dbdata:",
        flags: [
          ["services:", "Each key is one service; its name is also its DNS name on the stack's network (web can reach db at db:5432)"],
          ["ports: \"8080:80\"", "Quote port mappings: YAML can misread unquoted values like 22:22 as a number"],
          ["depends_on + condition: service_healthy", "Start web only after db's healthcheck passes, not just after db starts"],
          ["volumes: dbdata", "A named volume that survives docker compose down (but not down -v)"],
          ["*_FILE / secrets", "Read passwords from files instead of putting them in compose.yaml"]
        ],
        tip: "Services reach each other by service name",
        tags: ["compose", "yaml", "services", "volumes", "healthcheck", "depends_on"]
      }
    ],
    proTip: {
      desc: "Keep secrets out of compose.yaml",
      cmd: "docker compose config --quiet && echo OK",
      details: "Compose reads a .env file in the project directory automatically and substitutes ${VAR} references. Keep that .env out of git (add it to .gitignore) and commit a .env.example with placeholder values instead. --quiet validates without printing the merged config, which would otherwise show secret values on screen.",
      tip: "Commit .env.example, never .env",
      flags: [
        [".env", "Loaded automatically for ${VAR} substitution in compose.yaml"],
        ["config --quiet", "Validate only; prints nothing on success"],
        ["environment: vs env_file:", "Inline values vs. a file of KEY=value lines passed into the container"]
      ]
    }
  },
  {
    id: "docker-network-storage", group: "docker", file: "docker-network-storage", badge: "dnet", code: "net",
    name: "Docker Networking & Storage", navDesc: "networks, ports, volumes",
    title: "Docker Networking, Ports & Volumes",
    subtitle: "How containers reach each other and the host, and where their data lives",
    commands: [
      {
        id: "docker-network-ls",
        desc: "List Docker networks and see which containers are on one",
        cmd: "docker network ls",
        flags: [
          ["bridge (default)", "Private network with NAT to the host; containers on the default bridge can't resolve each other by name"],
          ["user-defined bridge", "docker network create <net>: containers on it resolve each other by container name"],
          ["host", "--network host: the container shares the host's network stack, no port mapping and no isolation"],
          ["none", "No networking at all"]
        ],
        subcommands: [
          ["docker network inspect <network> --format '{{range .Containers}}{{.Name}} {{.IPv4Address}}{{\"\\n\"}}{{end}}'", "Containers attached to a network and their IPs"],
          ["docker network create <network>", "Create a user-defined bridge (changes state)"],
          ["docker network connect <network> <container>", "Attach a running container to another network (changes state)"]
        ],
        tip: "Use a user-defined network for name resolution",
        tags: ["network", "bridge", "host", "dns"]
      },
      {
        id: "docker-port-check",
        desc: "Show which host ports a container publishes",
        cmd: "docker port <container>",
        flags: [
          ["80/tcp -> 0.0.0.0:8080", "Container port 80 is reachable on every host interface at port 8080"],
          ["-p 127.0.0.1:8080:80", "Publish only on localhost, so it is not exposed to the network"],
          ["Firewall note", "Published ports are added to iptables/nftables by Docker and can bypass ufw rules"]
        ],
        subcommands: [
          ["sudo ss -ltnp | grep <port>", "Confirm what is listening on the host side"],
          ["docker exec <container> getent hosts <other-container>", "Test name resolution from inside a container"]
        ],
        tip: "Docker-published ports can bypass ufw",
        tags: ["port", "publish", "ss", "firewall", "ufw"]
      },
      {
        id: "docker-volumes",
        desc: "List volumes and find where one lives on the host",
        cmd: "docker volume ls",
        flags: [
          ["named volume (-v data:/path)", "Managed by Docker under /var/lib/docker/volumes; survives container removal"],
          ["bind mount (-v /host/path:/path)", "A host directory mapped in directly; you manage permissions and backups"],
          [":ro", "Mount read-only, e.g. -v /etc/ssl:/etc/ssl:ro"],
          ["--mount type=bind,src=...,dst=...", "Longer syntax that fails loudly if the host path doesn't exist (-v silently creates it)"]
        ],
        subcommands: [
          ["docker volume inspect <volume> --format '{{.Mountpoint}}'", "Host path of a named volume"],
          ["docker run --rm -v <volume>:/data -v \"$PWD\":/backup ubuntu:24.04 tar czf /backup/<volume>.tgz -C /data .", "Back up a named volume to a tarball in the current directory"],
          ["docker volume prune", "Delete unused volumes: this deletes data (changes state)"]
        ],
        tip: "-v creates a missing host path silently; --mount errors",
        tags: ["volume", "bind", "mount", "storage", "backup"]
      }
    ],
    proTip: {
      desc: "RDMA and host networking for GPU jobs",
      cmd: "docker run --rm --network host --device /dev/infiniband --ulimit memlock=-1 <image> ibv_devinfo",
      details: "Multi-node GPU jobs that use InfiniBand or RoCE need the host's RDMA devices inside the container. --network host avoids NAT, --device /dev/infiniband exposes the verbs devices, and an unlimited memlock lets RDMA pin memory. Check the HCA from inside with ibv_devinfo before blaming the fabric.",
      tip: "ibv_devinfo inside the container should match the host",
      flags: [
        ["--network host", "Container uses the host's interfaces directly"],
        ["--device /dev/infiniband", "Pass the RDMA verbs devices through"],
        ["--ulimit memlock=-1", "Allow unlimited locked memory for RDMA registration"]
      ]
    }
  },
  {
    id: "docker-gpu-daemon", group: "docker", file: "docker-gpu-daemon", badge: "dgpu", code: "gpu",
    name: "Docker GPUs & Daemon", navDesc: "NVIDIA toolkit, daemon, events",
    title: "GPU Containers (NVIDIA Container Toolkit) & the Docker Daemon",
    subtitle: "Give containers access to NVIDIA GPUs, and check the Docker daemon's config, runtimes and logs",
    commands: [
      {
        id: "docker-gpu-smoke-test",
        desc: "Smoke test: run nvidia-smi inside a CUDA container with every GPU attached",
        cmd: "docker run --rm --gpus all nvidia/cuda:<tag> nvidia-smi",
        flags: [
          ["--gpus all", "Attach every GPU through the NVIDIA Container Toolkit"],
          ["--gpus '\"device=0,1\"'", "Only GPUs 0 and 1. The double quotes inside single quotes are required because of the comma"],
          ["nvidia/cuda:<tag>", "Pick a tag whose CUDA version is supported by the host driver (nvidia-smi on the host shows the max CUDA version)"],
          ["'could not select device driver'", "The toolkit isn't installed or Docker isn't configured for it: see nvidia-ctk below"]
        ],
        subcommands: [
          ["docker run --rm --gpus '\"device=0,1\"' nvidia/cuda:<tag> nvidia-smi -L", "List only the GPUs that were passed in"],
          ["docker run --rm --gpus all --ipc=host nvidia/cuda:<tag> nvidia-smi topo -m", "NVLink/PCIe topology as seen from inside a container"]
        ],
        tip: "Quote device lists: '\"device=0,1\"'",
        tags: ["gpu", "nvidia", "cuda", "nvidia-smi", "toolkit"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html", "title": "NVIDIA Container Toolkit: install guide"}], "note": "Docker's own GPU page could not be fetched (404); the --gpus device-list quoting is not confirmed against Docker's docs."}
      },
      {
        id: "nvidia-ctk-configure",
        desc: "Register the NVIDIA runtime with Docker, then restart Docker (changes state: restarts every container on the host)",
        cmd: "nvidia-ctk runtime configure --runtime=docker",
        flags: [
          ["runtime configure --runtime=docker", "Adds the nvidia runtime to /etc/docker/daemon.json"],
          ["systemctl restart docker", "Required afterwards; restarts all containers, so drain the node first"],
          ["nvidia-ctk --version", "Check the installed toolkit version against NVIDIA's release notes"]
        ],
        subcommands: [
          ["systemctl restart docker", "Apply the new daemon.json (changes state)"],
          ["docker info | grep -i -A3 runtimes", "Confirm the nvidia runtime is now listed"]
        ],
        tip: "Drain the node before restarting Docker",
        tags: ["nvidia-ctk", "toolkit", "runtime", "daemon.json"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html", "title": "NVIDIA Container Toolkit: install guide"}], "note": "Checked against Container Toolkit 1.20.1."}
      },
      {
        id: "nvidia-cdi",
        desc: "List the CDI (Container Device Interface) GPU devices NVIDIA has defined on this host",
        cmd: "nvidia-ctk cdi list",
        flags: [
          ["CDI", "A standard spec file (NVIDIA writes /var/run/cdi/nvidia.yaml) that describes devices, used by Docker, Podman and containerd"],
          ["nvidia-cdi-refresh", "Toolkit 1.18+: a systemd service keeps the spec up to date after driver changes; restart it after a driver removal or MIG change"],
          ["--device nvidia.com/gpu=all", "Request GPUs by CDI name instead of --gpus; CDI is on by default from Docker Engine 28.3.0"]
        ],
        subcommands: [
          ["systemctl restart nvidia-cdi-refresh.service", "Regenerate the CDI spec, e.g. after a driver removal or MIG change (changes state)"],
          ["nvidia-ctk cdi generate --output=/var/run/cdi/nvidia.yaml", "Generate the spec by hand on toolkits older than 1.18 (changes state)"],
          ["docker run --rm --device nvidia.com/gpu=all ubuntu:24.04 nvidia-smi -L", "Use CDI device names from Docker"]
        ],
        tip: "Toolkit 1.18+ refreshes the CDI spec for you",
        tags: ["cdi", "nvidia-ctk", "device", "gpu"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/cdi-support.html", "title": "NVIDIA Container Toolkit: CDI support"}, {"url": "https://docs.docker.com/reference/cli/dockerd/", "title": "dockerd reference (CDI)"}], "note": "Corrected 2026-11-09: the spec lives in /var/run/cdi/nvidia.yaml (not /etc/cdi), toolkit 1.18+ regenerates it with nvidia-cdi-refresh, and Docker enables CDI by default from 28.3.0 (not 25)."}
      },
      {
        id: "docker-daemon-health",
        desc: "Check the Docker daemon: version, storage and cgroup driver, runtimes, and recent errors",
        cmd: "docker info",
        flags: [
          ["Server Version", "The Engine version; compare with the release notes before upgrading"],
          ["Cgroup Driver / Version", "Should be systemd / 2 on current Ubuntu; cgroup v1 is deprecated in Kubernetes (1.35+) and the kubelet won't start on it by default"],
          ["Runtimes", "Should include nvidia on GPU nodes"],
          ["Storage Driver", "overlay2 on current kernels"]
        ],
        subcommands: [
          ["systemctl status docker --no-pager", "Is the daemon running, and its last log lines"],
          ["journalctl -u docker --since '1 hour ago' --no-pager", "Daemon log for the last hour"],
          ["cat /etc/docker/daemon.json", "The daemon's config file (runtimes, data-root, log limits)"],
          ["docker events --since 1h --until \"$(date +%s)\"", "Container start/stop/die/oom events from the last hour, then exit (--until takes a timestamp)"]
        ],
        tip: "docker events with --until returns instead of following",
        tags: ["daemon", "info", "journalctl", "events", "cgroup", "systemd"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.docker.com/reference/cli/docker/system/events/", "title": "docker events"}, {"url": "https://kubernetes.io/docs/concepts/architecture/cgroups/", "title": "Kubernetes: about cgroup v2"}], "note": "Corrected 2026-11-09: docker events --until now → --until \"$(date +%s)\" (now isn't a documented format); 'Kubernetes 1.37 refuses cgroup v1' → deprecated since 1.35, won't start by default."}
      }
    ],
    proTip: {
      desc: "Container sees no GPUs: check in this order",
      cmd: "nvidia-smi && nvidia-ctk --version && docker info | grep -i runtimes",
      details: "Work from the host up. If nvidia-smi fails on the host, it's a driver or hardware problem (see the NVIDIA DC sheets), not Docker. If the host is fine but the container isn't, check the toolkit is installed, the nvidia runtime is registered, and the image's CUDA version is not newer than the driver supports.",
      tip: "Host nvidia-smi fails → not a Docker problem",
      src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html", "title": "NVIDIA Container Toolkit: install guide"}, {"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "nvidia-smi documentation"}]},
      flags: [
        ["1. Host driver", "nvidia-smi on the host"],
        ["2. Toolkit", "nvidia-ctk --version"],
        ["3. Docker runtime", "docker info shows nvidia under Runtimes"],
        ["4. Image CUDA vs driver", "The image's CUDA must be supported by the host driver"]
      ]
    }
  },
  // ------------------------------------------------------------ KUBERNETES
  {
    id: "k8s-kubectl", group: "k8s", file: "k8s-kubectl", badge: "ctx", code: "ctx",
    name: "kubectl Basics & Contexts", navDesc: "contexts, get, output formats",
    title: "kubectl Basics: contexts, get, describe & output formats",
    subtitle: "Make sure you're pointed at the right cluster, then list and read any resource in the format you need",
    commands: [
      {
        id: "kubectl-contexts",
        desc: "Show which cluster and namespace kubectl is pointed at",
        cmd: "kubectl config get-contexts",
        flags: [
          ["* in the CURRENT column", "The context every kubectl command will use: check it before anything that changes state"],
          ["context", "A named combination of cluster + user + default namespace, stored in ~/.kube/config"],
          ["KUBECONFIG=<file>", "Point one command (or shell) at a different kubeconfig file"]
        ],
        subcommands: [
          ["kubectl config current-context", "Just the active context name"],
          ["kubectl config use-context <context>", "Switch clusters for every later command (changes local state)"],
          ["kubectl config set-context --current --namespace=<ns>", "Change the default namespace of the current context (changes local state)"]
        ],
        tip: "Check the context before every change",
        tags: ["context", "kubeconfig", "cluster", "namespace"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_config/kubectl_config_get-contexts/", "title": "kubectl config get-contexts"}, {"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "title": "Kubernetes: kubeconfig files"}]}
      },
      {
        id: "kubectl-get-wide",
        desc: "List pods in every namespace with their node and IP",
        cmd: "kubectl get pods -A -o wide",
        flags: [
          ["-A / --all-namespaces", "Every namespace; without it you only see your context's default namespace"],
          ["-n <ns>", "One namespace"],
          ["-o wide", "Adds NODE and IP columns: which server is the pod on?"],
          ["READY 1/2", "One of two containers in the pod isn't ready"],
          ["RESTARTS", "A climbing number means a crash loop"],
          ["-l app=<label>", "Filter by label"]
        ],
        subcommands: [
          ["kubectl get all -n <ns>", "Pods, services, deployments and replica sets in one namespace (not literally all kinds)"],
          ["kubectl get pods -A --field-selector=status.phase!=Running", "Everything that isn't Running"]
        ],
        tip: "-o wide shows the node",
        tags: ["get", "pods", "wide", "namespace", "list"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/", "title": "kubectl get"}]}
      },
      {
        id: "kubectl-output-formats",
        desc: "Print exactly the fields you need with jsonpath or custom columns",
        cmd: "kubectl get pods -n <ns> -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName,PHASE:.status.phase",
        flags: [
          ["-o yaml", "The whole object as YAML: the source of truth for every field"],
          ["-o jsonpath='{.items[*].metadata.name}'", "One field from every item, space-separated"],
          ["-o custom-columns=HEADER:.path,...", "Your own table; paths are the same as in -o yaml"],
          ["--sort-by=.metadata.creationTimestamp", "Sort rows by any field"]
        ],
        subcommands: [
          ["kubectl get pod <pod> -n <ns> -o yaml", "Full pod definition and status"],
          ["kubectl get pods -n <ns> -o jsonpath='{range .items[*]}{.metadata.name}{\"\\t\"}{.status.phase}{\"\\n\"}{end}'", "Name and phase, one pod per line"],
          ["kubectl get pods -n <ns> -o json | jq -r '.items[] | select(.status.phase != \"Running\") | .metadata.name'", "Same idea with jq, which is easier to read for complex filters"]
        ],
        tip: "Find the path in -o yaml, then use it in jsonpath",
        tags: ["output", "jsonpath", "custom-columns", "yaml", "jq", "sort"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/", "title": "kubectl get"}, {"url": "https://kubernetes.io/docs/reference/kubectl/jsonpath/", "title": "kubectl JSONPath support"}]}
      },
      {
        id: "kubectl-explain",
        desc: "Look up what a field means without leaving the terminal",
        cmd: "kubectl explain pod.spec.containers.resources",
        flags: [
          ["kubectl explain <kind>.<path>", "Docs for that field, straight from the cluster's own API (so it matches your version)"],
          ["--recursive", "Show the whole tree of sub-fields"],
          ["kubectl api-resources", "Every resource kind, its short name (po, deploy, svc) and whether it's namespaced"]
        ],
        subcommands: [
          ["kubectl api-resources", "All kinds the cluster knows, with short names"],
          ["kubectl version", "Client and server versions; kubectl should be within one minor version of the server"],
          ["kubectl auth can-i --list -n <ns>", "What you're allowed to do in a namespace"]
        ],
        tip: "kubectl explain matches your cluster's version",
        tags: ["explain", "api-resources", "version", "docs", "auth"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_explain/", "title": "kubectl explain"}, {"url": "https://kubernetes.io/releases/version-skew-policy/", "title": "Kubernetes version skew policy"}]}
      }
    ],
    proTip: {
      desc: "Make the active context impossible to miss",
      cmd: "kubectl config current-context",
      details: "Most Kubernetes accidents are the right command against the wrong cluster. Put the current context in your shell prompt, or run kubectl config current-context before any apply, delete, drain or scale. Separate kubeconfig files per cluster (KUBECONFIG=...) make it harder still to cross wires.",
      tip: "Right command, wrong cluster is the classic mistake",
      src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/", "title": "Kubernetes: kubeconfig files"}]},
      flags: [
        ["kubectl config current-context", "Run it before every change"],
        ["KUBECONFIG=~/.kube/<cluster>.yaml", "One file per cluster"],
        ["kubectl --context <ctx> ...", "Name the cluster explicitly on a single command"]
      ]
    }
  },
  {
    id: "k8s-workloads", group: "k8s", file: "k8s-workloads", badge: "wl", code: "wl",
    name: "Kubernetes Workloads", navDesc: "apply, rollout, scale, jobs",
    title: "Workloads: apply, deployments, rollouts, scaling & jobs",
    subtitle: "Declare what should run with YAML, roll changes out safely, roll them back, and run batch jobs",
    commands: [
      {
        id: "kubectl-diff-apply",
        desc: "Preview what a manifest would change, then apply it (apply changes state)",
        cmd: "kubectl diff -f <file>.yaml",
        flags: [
          ["kubectl diff -f", "Shows the change the server would make, without making it. Exit code 1 means there are differences"],
          ["kubectl apply -f <file>.yaml", "Create or update to match the file (declarative: the file is the desired state)"],
          ["-f <dir>/", "Apply every manifest in a directory"],
          ["--dry-run=server", "Let the API server validate the change without saving it"]
        ],
        subcommands: [
          ["kubectl apply -f <file>.yaml", "Apply the manifest (changes state)"],
          ["kubectl apply -f <file>.yaml --dry-run=server", "Validate against the live cluster without changing anything"]
        ],
        tip: "diff before apply",
        tags: ["apply", "diff", "manifest", "yaml", "declarative", "dry-run"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_diff/", "title": "kubectl diff"}, {"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_apply/", "title": "kubectl apply"}]}
      },
      {
        id: "deployment-yaml-example",
        desc: "Minimal Deployment manifest with resource requests and limits",
        cmd: "apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web\n  labels:\n    app: web\nspec:\n  replicas: 2\n  selector:\n    matchLabels:\n      app: web\n  template:\n    metadata:\n      labels:\n        app: web\n    spec:\n      containers:\n        - name: web\n          image: nginx:1.27\n          ports:\n            - containerPort: 80\n          resources:\n            requests:\n              cpu: 100m\n              memory: 128Mi\n            limits:\n              memory: 256Mi",
        flags: [
          ["selector.matchLabels = template labels", "The Deployment finds its pods by label; these two must match"],
          ["replicas: 2", "How many identical pods to keep running"],
          ["requests", "What the scheduler reserves on a node (100m = 0.1 CPU core)"],
          ["limits.memory", "Exceeding it gets the container OOMKilled"],
          ["Generate instead of typing", "kubectl create deployment web --image=nginx:1.27 --dry-run=client -o yaml > web.yaml"]
        ],
        tip: "Labels connect Deployment → pods → Service",
        tags: ["deployment", "yaml", "manifest", "requests", "limits", "labels"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/concepts/workloads/controllers/deployment/", "title": "Kubernetes: Deployments"}, {"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "title": "Kubernetes: resources for containers"}]}
      },
      {
        id: "kubectl-rollout",
        desc: "Watch a deployment roll out and check its history",
        cmd: "kubectl rollout status deployment/<name> -n <ns> --timeout=120s",
        flags: [
          ["rollout status", "Waits until the new pods are ready (or the timeout hits), then exits"],
          ["rollout history", "Previous revisions you can roll back to"],
          ["rollout undo", "Go back to the previous revision (changes state)"],
          ["rollout restart", "Recreate all pods one by one, e.g. to pick up a changed ConfigMap (changes state)"]
        ],
        subcommands: [
          ["kubectl rollout history deployment/<name> -n <ns>", "List revisions"],
          ["kubectl rollout undo deployment/<name> -n <ns>", "Roll back to the previous revision (changes state)"],
          ["kubectl rollout restart deployment/<name> -n <ns>", "Rolling restart of every pod (changes state)"]
        ],
        tip: "rollout undo is your fast rollback",
        tags: ["rollout", "status", "history", "undo", "restart", "deployment"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_rollout/", "title": "kubectl rollout"}]}
      },
      {
        id: "kubectl-scale",
        desc: "Change the number of replicas (changes state)",
        cmd: "kubectl scale deployment/<name> -n <ns> --replicas=3",
        flags: [
          ["--replicas=N", "Desired pod count; 0 stops the app but keeps its definition"],
          ["Drift warning", "The next kubectl apply of the YAML resets replicas to the file's value"],
          ["HPA", "If a HorizontalPodAutoscaler manages it, the HPA will override manual scaling"]
        ],
        subcommands: [
          ["kubectl get deploy,rs,pods -n <ns> -l app=<label>", "The Deployment, its ReplicaSets and pods together"],
          ["kubectl get hpa -n <ns>", "Autoscalers that may override your change"]
        ],
        tip: "Scaling by hand drifts from your YAML",
        tags: ["scale", "replicas", "hpa", "deployment"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_scale/", "title": "kubectl scale"}, {"url": "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/", "title": "Kubernetes: HPA"}]}
      },
      {
        id: "kubectl-jobs",
        desc: "Check batch Jobs and CronJobs",
        cmd: "kubectl get jobs,cronjobs -A",
        flags: [
          ["Job", "Runs pods until they complete successfully a set number of times"],
          ["CronJob", "Creates a Job on a cron schedule"],
          ["COMPLETIONS 0/1", "Not finished yet, or failing; check its pods' logs"]
        ],
        subcommands: [
          ["kubectl logs job/<job> -n <ns>", "Logs from a Job's pod"],
          ["kubectl create job <name>-manual --from=cronjob/<cronjob> -n <ns>", "Run a CronJob now, outside its schedule (changes state)"]
        ],
        tip: "Trigger a CronJob by hand with --from=cronjob/",
        tags: ["job", "cronjob", "batch"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_create/kubectl_create_job/", "title": "kubectl create job"}, {"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/", "title": "kubectl logs"}]}
      }
    ],
    proTip: {
      desc: "Requests, limits and what OOMKilled means",
      cmd: "kubectl get pod <pod> -n <ns> -o jsonpath='{.status.containerStatuses[*].lastState.terminated.reason}'",
      details: "Requests decide where a pod can be scheduled; limits are enforced at runtime. A container above its memory limit is killed (reason OOMKilled) and restarted. A container above its CPU limit is only throttled. When a node runs short of memory, the kubelet first evicts pods using more than they requested (by priority, then by how far over), so pods with no requests at all go early.",
      tip: "Memory over limit = killed; CPU over limit = slowed",
      src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/", "title": "Kubernetes: resources for containers"}, {"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/node-pressure-eviction/", "title": "Kubernetes: node-pressure eviction"}], "note": "Corrected 2026-11-09: 'pods with no requests are evicted first' → the kubelet orders by usage over requests, then priority; it doesn't use QoS class for the order."},
      flags: [
        ["OOMKilled", "Raise limits.memory or fix the leak"],
        ["Pending: Insufficient cpu/memory", "Requests don't fit on any node"],
        ["Evicted", "The node ran low on memory or disk and removed the pod"]
      ]
    }
  },
  {
    id: "k8s-troubleshoot", group: "k8s", file: "k8s-troubleshoot", badge: "dbg", code: "dbg",
    name: "Kubernetes Troubleshooting", navDesc: "describe, logs, events, debug",
    title: "Troubleshooting Pods: describe, events, logs, exec & debug",
    subtitle: "Work out why a pod is Pending, crash-looping or failing to pull its image",
    commands: [
      {
        id: "kubectl-describe-pod",
        desc: "Describe a pod: read the Events section at the bottom first",
        cmd: "kubectl describe pod <pod> -n <ns>",
        flags: [
          ["Events (bottom)", "Scheduling failures, image pull errors, probe failures and OOM kills appear here"],
          ["State / Last State", "Current state and how the previous container instance ended (reason and exit code)"],
          ["Conditions", "PodScheduled, Initialized, ContainersReady, Ready"],
          ["Node", "Which server it landed on; combine with the node sheets"]
        ],
        tip: "Read Events first",
        tags: ["describe", "events", "pod", "state"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe/", "title": "kubectl describe"}, {"url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/", "title": "Kubernetes: debug pods"}]}
      },
      {
        id: "kubectl-pod-status-meanings",
        desc: "What the common pod statuses mean and where to look next",
        cmd: "kubectl get pods -n <ns>",
        flags: [
          ["Pending", "Not scheduled yet: not enough CPU/memory/GPU, a taint, or an unbound PVC. Check describe → Events"],
          ["ContainerCreating (stuck)", "Usually a volume that won't mount or a CNI (network) problem"],
          ["ImagePullBackOff / ErrImagePull", "Wrong image name or tag, a private registry without credentials, or no route to the registry"],
          ["CrashLoopBackOff", "The container starts and exits again; read logs --previous"],
          ["OOMKilled", "Hit its memory limit"],
          ["Evicted", "The node ran out of memory or disk"],
          ["Terminating (stuck)", "A finalizer or an unreachable node; check the node first"]
        ],
        tip: "Pending → Events; CrashLoop → logs --previous",
        tags: ["status", "pending", "crashloopbackoff", "imagepullbackoff", "oomkilled", "evicted"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/", "title": "Kubernetes: pod lifecycle"}, {"url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/", "title": "Kubernetes: debug pods"}]}
      },
      {
        id: "kubectl-logs-previous",
        desc: "Logs from the previous (crashed) instance of a container",
        cmd: "kubectl logs <pod> -n <ns> --previous --tail=200",
        flags: [
          ["--previous / -p", "The instance that crashed, not the one currently restarting. Essential for CrashLoopBackOff"],
          ["-c <container>", "Pick a container when the pod has more than one"],
          ["--tail=200 / --since=30m", "Limit output"],
          ["-f", "Follow live"],
          ["-l app=<label> --all-containers", "Logs from every pod matching a label"]
        ],
        subcommands: [
          ["kubectl logs <pod> -n <ns> -c <container> --tail=200", "One container in a multi-container pod"],
          ["kubectl logs deploy/<name> -n <ns> --tail=100", "Logs from one pod of a Deployment"]
        ],
        tip: "CrashLoopBackOff? Always add --previous",
        tags: ["logs", "previous", "crashloop", "container"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_logs/", "title": "kubectl logs"}]}
      },
      {
        id: "kubectl-events-sorted",
        desc: "Recent events in a namespace, oldest first",
        cmd: "kubectl get events -n <ns> --sort-by=.lastTimestamp",
        flags: [
          ["--sort-by=.lastTimestamp", "Events are unsorted by default; this puts the newest at the bottom"],
          ["--field-selector type=Warning", "Only warnings"],
          ["Retention", "Events are kept for about an hour by default, so capture them early"]
        ],
        subcommands: [
          ["kubectl get events -A --field-selector type=Warning --sort-by=.lastTimestamp", "Warnings across the whole cluster"],
          ["kubectl events -n <ns> --for pod/<pod>", "Events for one object (newer kubectl events command)"]
        ],
        tip: "Events expire after about an hour",
        tags: ["events", "warning", "sort", "timeline"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/", "title": "kubectl get"}, {"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_events/", "title": "kubectl events"}, {"url": "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/", "title": "kube-apiserver (--event-ttl 1h)"}], "note": "kubectl get documents --sort-by with braces ('{.lastTimestamp}'); the bare form works too. Filtering events by type=Warning isn't shown in the docs read. kubectl events has no --sort-by."}
      },
      {
        id: "kubectl-exec-debug",
        desc: "Get a shell in a running pod, or attach a debug container to one that has no shell",
        cmd: "kubectl exec -it <pod> -n <ns> -- sh",
        flags: [
          ["-- (double dash)", "Everything after it is the command to run in the container, not kubectl flags"],
          ["-c <container>", "Choose the container in a multi-container pod"],
          ["kubectl debug -it <pod> --image=busybox --target=<container>", "Adds a temporary debug container that shares the target's process namespace; works for distroless images"],
          ["kubectl debug node/<node> -it --image=busybox", "A pod on the node with the host filesystem at /host (add --profile=sysadmin to chroot /host)"]
        ],
        subcommands: [
          ["kubectl exec <pod> -n <ns> -- env", "Environment variables the app sees"],
          ["kubectl debug -it <pod> -n <ns> --image=busybox --target=<container>", "Ephemeral debug container (changes state: adds a container to the pod)"],
          ["kubectl debug node/<node> -it --image=busybox", "Debug pod on a node, host filesystem under /host (changes state)"]
        ],
        tip: "No shell in the image? kubectl debug --target",
        tags: ["exec", "debug", "ephemeral", "shell", "distroless"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/", "title": "Kubernetes: debug running pods"}, {"url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/kubectl-node-debug/", "title": "Kubernetes: debug a node with kubectl"}, {"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_debug/", "title": "kubectl debug"}], "note": "With the default profile, chroot /host fails in a node debug pod: use --profile=sysadmin."}
      },
      {
        id: "kubectl-port-forward-top",
        desc: "Reach a service from your workstation, and see live resource usage",
        cmd: "kubectl port-forward svc/<service> 8080:80 -n <ns>",
        flags: [
          ["port-forward svc/<svc> 8080:80", "Local port 8080 → service port 80, through the API server; stays open until Ctrl+C"],
          ["kubectl top pods", "Live CPU and memory per pod (needs metrics-server installed)"],
          ["--sort-by=memory", "Biggest consumers first"]
        ],
        subcommands: [
          ["kubectl top pods -n <ns> --sort-by=memory", "Memory hogs in a namespace"],
          ["kubectl top nodes", "CPU and memory per node"],
          ["kubectl get endpointslices -n <ns> -l kubernetes.io/service-name=<service>", "Which pod IPs a service actually sends traffic to"]
        ],
        tip: "Service has no endpoints? Its selector doesn't match any ready pod",
        tags: ["port-forward", "top", "metrics", "service", "endpoints"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_port-forward/", "title": "kubectl port-forward"}, {"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_top/", "title": "kubectl top"}, {"url": "https://kubernetes.io/docs/concepts/services-networking/endpoint-slices/", "title": "Kubernetes: EndpointSlices"}]}
      }
    ],
    proTip: {
      desc: "A fixed order for any broken pod",
      cmd: "kubectl describe pod <pod> -n <ns> | sed -n '/^Events:/,$p'",
      details: "1) get pods -o wide: status, restarts and node. 2) describe: Events and Last State. 3) logs --previous: the crash itself. 4) get events --sort-by: what else happened around it. 5) If the node is involved (NotReady, evictions, GPU missing), move to the Nodes and GPU sheets.",
      tip: "Status → Events → previous logs → node",
      src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/", "title": "Kubernetes: debug pods"}]},
      flags: [
        ["1. kubectl get pods -o wide", "Status, restarts, node"],
        ["2. kubectl describe pod", "Events and Last State"],
        ["3. kubectl logs --previous", "The crash"],
        ["4. kubectl get events --sort-by", "Surrounding timeline"]
      ]
    }
  },
  {
    id: "k8s-nodes", group: "k8s", file: "k8s-nodes", badge: "node", code: "node",
    name: "Kubernetes Nodes & Maintenance", navDesc: "cordon, drain, kubelet, crictl",
    title: "Nodes: health, cordon & drain, taints, kubelet and crictl",
    subtitle: "Check a node's health, take it out of service safely for hardware work, and debug it from the server itself",
    commands: [
      {
        id: "kubectl-nodes-wide",
        desc: "List nodes with status, version, OS and container runtime",
        cmd: "kubectl get nodes -o wide",
        flags: [
          ["STATUS Ready", "kubelet is reporting healthy; NotReady means kubelet stopped reporting (crashed, network, or server down)"],
          ["SchedulingDisabled", "The node is cordoned: existing pods stay, no new ones arrive"],
          ["VERSION", "kubelet version"],
          ["CONTAINER-RUNTIME", "Usually containerd://<version>"]
        ],
        subcommands: [
          ["kubectl describe node <node>", "Conditions, capacity, allocated resources, taints and recent events"],
          ["kubectl get pods -A -o wide --field-selector spec.nodeName=<node>", "Every pod on one node, e.g. before draining it"]
        ],
        tip: "NotReady = kubelet stopped reporting",
        tags: ["nodes", "ready", "notready", "describe", "wide"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/", "title": "kubectl get"}, {"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe/", "title": "kubectl describe"}, {"url": "https://kubernetes.io/docs/concepts/architecture/nodes/", "title": "Kubernetes: nodes"}]}
      },
      {
        id: "kubectl-cordon-drain",
        desc: "Take a node out of service for hardware work: cordon, then drain (changes state: ask first)",
        cmd: "kubectl drain <node> --ignore-daemonsets --delete-emptydir-data --timeout=10m",
        flags: [
          ["kubectl cordon <node>", "Stop new pods landing on it; running pods stay"],
          ["kubectl drain <node>", "Cordon, then evict pods so their controllers recreate them elsewhere"],
          ["--ignore-daemonsets", "DaemonSet pods (CNI, GPU operator, monitoring) are meant to run everywhere and are left alone"],
          ["--delete-emptydir-data", "Allow evicting pods with emptyDir volumes; that scratch data is lost"],
          ["PodDisruptionBudget errors", "Drain waits rather than break an app's minimum availability; don't --force past it without the app owner"],
          ["kubectl uncordon <node>", "Put the node back into service after the work"]
        ],
        subcommands: [
          ["kubectl cordon <node>", "Mark unschedulable (changes state)"],
          ["kubectl uncordon <node>", "Return to service (changes state)"],
          ["kubectl get node <node> -o jsonpath='{.spec.unschedulable}'", "true = still cordoned"]
        ],
        tip: "Approval first; check the active context",
        tags: ["drain", "cordon", "uncordon", "maintenance", "pdb", "rma"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_drain/", "title": "kubectl drain"}, {"url": "https://kubernetes.io/docs/concepts/workloads/pods/disruptions/", "title": "Kubernetes: disruptions and PDBs"}, {"url": "https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/", "title": "Kubernetes: safely drain a node"}]}
      },
      {
        id: "kubectl-taints-labels",
        desc: "Show a node's taints and labels",
        cmd: "kubectl get node <node> -o jsonpath='{.spec.taints}'",
        flags: [
          ["taint key=value:NoSchedule", "Only pods that tolerate the taint can be scheduled here (common on GPU nodes)"],
          ["NoExecute", "Also evicts running pods that don't tolerate it"],
          ["key=value:NoSchedule- (trailing dash)", "Removes that taint"],
          ["--show-labels", "kubectl get nodes --show-labels lists every label"]
        ],
        subcommands: [
          ["kubectl get nodes --show-labels", "All node labels"],
          ["kubectl taint nodes <node> <key>=<value>:NoSchedule", "Add a taint (changes state)"],
          ["kubectl label node <node> <key>=<value>", "Add or change a label (changes state)"]
        ],
        tip: "Trailing dash removes a taint",
        tags: ["taint", "toleration", "label", "noschedule"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/", "title": "Kubernetes: taints and tolerations"}, {"url": "https://kubernetes.io/docs/reference/kubectl/generated/kubectl_taint/", "title": "kubectl taint"}]}
      },
      {
        id: "node-kubelet-crictl",
        desc: "On the node itself: kubelet logs and containers via crictl (works when the API is unreachable)",
        cmd: "journalctl -u kubelet --since '30 min ago' --no-pager",
        flags: [
          ["journalctl -u kubelet", "kubelet's own log: registration, image pulls, eviction decisions, volume mounts"],
          ["crictl", "Talks to containerd directly through the CRI socket; Kubernetes no longer uses Docker (dockershim was removed in 1.24)"],
          ["crictl ps -a", "Containers including exited ones, with their pod names"],
          ["cgroup v2", "stat -fc %T /sys/fs/cgroup must print cgroup2fs; the kubelet won't start on cgroup v1 by default (deprecated since 1.35)"]
        ],
        subcommands: [
          ["systemctl status kubelet containerd --no-pager", "Are kubelet and containerd running"],
          ["crictl ps -a", "All containers on this node"],
          ["crictl logs --tail 100 <container-id>", "Container logs without going through the API server"],
          ["crictl pods", "Pod sandboxes on this node"],
          ["stat -fc %T /sys/fs/cgroup", "cgroup2fs = cgroup v2 (the kubelet refuses cgroup v1 by default)"]
        ],
        tip: "API down? crictl on the node still works",
        tags: ["kubelet", "crictl", "containerd", "journalctl", "cgroup", "node"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/tasks/debug/debug-cluster/crictl/", "title": "Kubernetes: debugging with crictl"}, {"url": "https://kubernetes.io/docs/tasks/administer-cluster/migrating-from-dockershim/", "title": "Kubernetes: migrating from dockershim (removed in 1.24)"}, {"url": "https://kubernetes.io/docs/concepts/architecture/cgroups/", "title": "Kubernetes: about cgroup v2"}], "note": "Corrected 2026-11-09: 'kubelet 1.37 refuses cgroup v1' → cgroup v1 deprecated since 1.35; the kubelet won't start on it by default (failCgroupV1)."}
      }
    ],
    proTip: {
      desc: "Hardware work on a Kubernetes GPU node",
      cmd: "kubectl get pods -A -o wide --field-selector spec.nodeName=<node>",
      details: "Before an RMA or reseat: list what's running on the node, get approval, cordon, drain with --ignore-daemonsets, confirm only DaemonSet pods remain, then do the work. Afterwards check the node is Ready, the GPU count is back (see the GPU sheet), and uncordon. If Slurm also schedules on the node, drain it there as well.",
      tip: "List → approve → cordon → drain → work → verify → uncordon",
      src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/", "title": "Kubernetes: safely drain a node"}]},
      flags: [
        ["Before", "List pods on the node and get approval"],
        ["Drain", "--ignore-daemonsets --delete-emptydir-data"],
        ["After", "Node Ready + GPU allocatable restored, then uncordon"]
      ]
    }
  },
  {
    id: "k8s-gpu", group: "k8s", file: "k8s-gpu", badge: "kgpu", code: "gpu",
    name: "Kubernetes GPUs", navDesc: "GPU operator, device plugin",
    title: "GPUs in Kubernetes: allocatable GPUs, GPU Operator & test pods",
    subtitle: "Check that each node advertises its GPUs, inspect the NVIDIA GPU Operator, and prove a pod can use a GPU",
    commands: [
      {
        id: "k8s-gpu-allocatable",
        desc: "How many GPUs each node advertises to the scheduler",
        cmd: "kubectl get nodes -o custom-columns=NAME:.metadata.name,GPUS:.status.allocatable.nvidia\\.com/gpu",
        flags: [
          ["nvidia\\.com/gpu", "The dots in the resource name are escaped so custom-columns doesn't read them as path separators"],
          ["<none>", "The device plugin isn't running on that node, or found no GPUs"],
          ["Fewer than installed (e.g. 7 of 8)", "A GPU dropped off the bus or failed health checks; check nvidia-smi and dmesg on the node"]
        ],
        subcommands: [
          ["kubectl describe node <node> | grep -A10 'Allocated resources'", "GPUs requested by pods vs. available on one node"],
          ["kubectl get nodes -l feature.node.kubernetes.io/pci-10de.present=true", "Nodes with an NVIDIA PCI device (the label the GPU Operator uses to find GPU nodes)"]
        ],
        tip: "7 of 8 GPUs? Check the node, not Kubernetes",
        tags: ["gpu", "allocatable", "nvidia.com/gpu", "custom-columns", "capacity"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/", "title": "Kubernetes: schedule GPUs"}, {"url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html", "title": "NVIDIA GPU Operator: getting started"}], "note": "Corrected 2026-11-09: the GPU-node label is feature.node.kubernetes.io/pci-10de.present=true, the one the GPU Operator docs use (nvidia.com/gpu.present isn't on that page)."}
      },
      {
        id: "k8s-gpu-operator-pods",
        desc: "Check the NVIDIA GPU Operator components",
        cmd: "kubectl get pods -n gpu-operator -o wide",
        flags: [
          ["gpu-operator namespace", "The namespace NVIDIA's install examples use (Helm's default is default); yours may differ: kubectl get pods -A | grep -i nvidia"],
          ["driver daemonset", "Installs the driver in a container on each GPU node (if the operator manages the driver)"],
          ["container-toolkit daemonset", "Configures containerd for GPUs"],
          ["device-plugin daemonset", "Advertises nvidia.com/gpu to the scheduler"],
          ["dcgm-exporter", "GPU metrics for Prometheus"],
          ["validator", "Checks the stack works; Init or Error here explains missing GPUs"]
        ],
        subcommands: [
          ["kubectl logs -n gpu-operator <device-plugin-pod>", "Why GPUs aren't being advertised"],
          ["kubectl exec -n gpu-operator <driver-pod> -- nvidia-smi", "Run nvidia-smi through the driver container"]
        ],
        tip: "Validator not Completed = stack not ready",
        tags: ["gpu-operator", "device-plugin", "driver", "dcgm", "validator"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html", "title": "NVIDIA GPU Operator: getting started"}], "note": "Pod names in the docs: nvidia-driver-daemonset, nvidia-container-toolkit-daemonset, nvidia-device-plugin-daemonset, nvidia-dcgm-exporter, nvidia-operator-validator, gpu-feature-discovery. Checked against GPU Operator v26.7."}
      },
      {
        id: "k8s-gpu-test-pod",
        desc: "Test pod that requests one GPU and runs nvidia-smi",
        cmd: "apiVersion: v1\nkind: Pod\nmetadata:\n  name: gpu-test\nspec:\n  restartPolicy: Never\n  containers:\n    - name: cuda\n      image: nvidia/cuda:<tag>\n      command: [\"nvidia-smi\", \"-L\"]\n      resources:\n        limits:\n          nvidia.com/gpu: 1",
        flags: [
          ["limits: nvidia.com/gpu: 1", "GPUs are requested under limits and are whole devices (no fractions without MIG or time-slicing)"],
          ["restartPolicy: Never", "Run once and stop, so you can read the output"],
          ["Pending: Insufficient nvidia.com/gpu", "Every GPU is already allocated, or none are advertised"],
          ["Toleration", "If GPU nodes are tainted, add a matching toleration"]
        ],
        subcommands: [
          ["kubectl apply -f gpu-test.yaml", "Create the test pod (changes state)"],
          ["kubectl logs gpu-test", "Should list one GPU"],
          ["kubectl delete pod gpu-test", "Clean up (changes state)"]
        ],
        tip: "GPUs go under limits, in whole numbers",
        tags: ["gpu", "pod", "test", "limits", "nvidia-smi"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/", "title": "Kubernetes: schedule GPUs"}, {"url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html", "title": "NVIDIA GPU Operator: getting started"}]}
      },
      {
        id: "k8s-dcgm-metrics",
        desc: "Read GPU metrics from DCGM exporter",
        cmd: "kubectl port-forward -n gpu-operator svc/nvidia-dcgm-exporter 9400:9400",
        flags: [
          ["port 9400", "DCGM exporter's default metrics port"],
          ["curl -s localhost:9400/metrics", "From a second terminal while the port-forward runs"],
          ["DCGM_FI_DEV_XID_ERROR", "Last Xid error per GPU; map it with the NVIDIA DC Xid sheet (exporters before 4.9.0: DCGM_FI_DEV_XID_ERRORS)"],
          ["DCGM_FI_DEV_GPU_TEMP_CELSIUS / BOARD_POWER_WATTS", "Temperature and power per GPU (before 4.9.0: DCGM_FI_DEV_GPU_TEMP / POWER_USAGE)"]
        ],
        subcommands: [
          ["curl -s localhost:9400/metrics | grep -E 'XID|GPU_TEMP'", "Xid errors and temperatures"],
          ["kubectl get svc -A | grep -i dcgm", "Find the exporter service if it's in another namespace"]
        ],
        tip: "Xid in DCGM → check the NVIDIA DC Xid sheet",
        tags: ["dcgm", "metrics", "prometheus", "xid", "temperature"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/NVIDIA/dcgm-exporter/blob/main/etc/default-counters.csv", "title": "dcgm-exporter default counters"}, {"url": "https://github.com/NVIDIA/dcgm-exporter/releases", "title": "dcgm-exporter releases (4.9.0 renames)"}], "note": "The service name nvidia-dcgm-exporter and port 9400 aren't stated on the pages read: kubectl get svc -A | grep -i dcgm shows yours."}
      }
    ],
    proTip: {
      desc: "GPU missing in Kubernetes: check from the hardware up",
      cmd: "kubectl get nodes -o custom-columns=NAME:.metadata.name,GPUS:.status.allocatable.nvidia\\.com/gpu",
      details: "Start at the bottom. On the node: does nvidia-smi see every GPU, and is dmesg free of Xid or 'fallen off the bus' errors? Then the GPU Operator: driver, toolkit and device-plugin pods Running, validator Completed. Then the node's allocatable count. Only after all three are right is it a scheduling problem.",
      tip: "Hardware → operator pods → allocatable → scheduling",
      src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/getting-started.html", "title": "NVIDIA GPU Operator: getting started"}, {"url": "https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/", "title": "Kubernetes: schedule GPUs"}]},
      flags: [
        ["1. Node", "nvidia-smi and dmesg -T | grep -i xid"],
        ["2. Operator", "kubectl get pods -n gpu-operator"],
        ["3. Allocatable", "custom-columns query above"],
        ["4. Scheduling", "describe pod → Events"]
      ]
    }
  }
];

// 2. Navbar dropdown inserted into every sheet, just before the Omarchy link.
const navCol = (group, heading) => `                    <div class="ctr-dropdown-col">
                      <div class="ctr-dropdown-heading">${heading}</div>
${CONTAINER_SECTIONS.filter(s => s.group === group).map(s => `                      <a href="${s.file}.html" class="dropdown-item" role="menuitem"><code>${s.code}</code> <span class="cmd-desc">${escapeHtml(s.navDesc)}</span></a>`).join('\n')}
                    </div>`;

const CTR_NAVBAR_SNIPPET = `<div class="nav-dropdown" id="containers-nav-dropdown">
                <a href="containers.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M12 2.5l8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5L12 2.5z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M3.5 7.25L12 12l8.5-4.75M12 12v9.5" stroke="#38bdf8" stroke-width="1.6" stroke-linejoin="round"/></svg>
                  <span>Containers</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu ctr-dropdown-menu" role="menu">
                  <a href="containers.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Containers Hub (Docker &amp; Kubernetes)</a>
                  <div class="dropdown-divider"></div>
                  <div class="ctr-dropdown-grid">
${navCol('docker', 'Docker')}
${navCol('k8s', 'Kubernetes')}
                  </div>
                </div>
              </div>
              `;

// 3. Insert (or replace) the Containers dropdown in every sheet's nav.
const htmlFiles = require('./nav/targets').navFiles();   // the one nav copy, not every page
const existingDropdown = /<div class="nav-dropdown" id="containers-nav-dropdown">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*/;
// Fallback insertion point (the menu is missing once build-nav-groups.js has filed it in a tab):
// just before the Home link. build-nav-groups.js then moves it into its tab again.
const omarchyLink = /<a href="index\.html" class="sheet-link nav-home(?: active)?">/;
let navUpdated = 0, navMissing = [];
for (const file of htmlFiles) {
  const p = path.join(__dirname, file);
  let content = fs.readFileSync(p, 'utf8');
  if (!/<nav class="sheet-switcher"/.test(content)) continue;
  const before = content;
  if (existingDropdown.test(content)) content = content.replace(existingDropdown, CTR_NAVBAR_SNIPPET);
  else if (omarchyLink.test(content)) content = content.replace(omarchyLink, m => CTR_NAVBAR_SNIPPET + m);
  else { navMissing.push(file); continue; }
  if (content !== before) { fs.writeFileSync(p, content, 'utf8'); navUpdated++; }
}
console.log(`Containers dropdown written into ${navUpdated} sheet(s)` + (navMissing.length ? `; no insertion point in: ${navMissing.join(', ')}` : ''));

// New pages copy the nav from index.html, which now includes the dropdown.
const indexHtmlForNav = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

// 4. Split one section into cards: main command, extra flags, recipes, pro tip.
const isMultiline = s => /\n/.test(s || '');
function buildSectionCards(sec) {
  const cards = [];
  const baseTags = sec.group === 'docker' ? ['docker', 'containers'] : ['kubernetes', 'k8s', 'kubectl', 'containers'];
  sec.commands.forEach((cmd, cIdx) => {
    cards.push({
      id: `${sec.id}-cmd-${cIdx + 1}`,
      badge: sec.badge,
      title: `${sec.name}: ${cmd.desc.split('(')[0].split(':')[0].trim()}`,
      subtitle: cmd.desc,
      commands: [{
        id: cmd.id, desc: cmd.desc, cmd: cmd.cmd, details: cmd.details || '',
        flags: cmd.flags ? cmd.flags.slice(0, 3) : [], tip: cmd.tip || '',
        tags: [...baseTags, ...(cmd.tags || [])],
        ...(cmd.src ? { src: cmd.src } : {})
      }]
    });
    if (cmd.flags && cmd.flags.length > 3) {
      cards.push({
        id: `${sec.id}-flags-${cIdx + 1}`,
        badge: sec.badge,
        title: `${sec.name}: More options`,
        subtitle: `More options for: ${cmd.desc.split('(')[0].trim()}`,
        commands: [{
          id: `${cmd.id}-flags-card`,
          desc: `More options and gotchas for: ${cmd.desc.split('(')[0].trim()}`,
          cmd: cmd.cmd, hideCode: isMultiline(cmd.cmd),
          flags: cmd.flags.slice(3),
          tags: [...baseTags, 'flags', 'options', ...(cmd.tags || []).slice(0, 3)]
        }]
      });
    }
    if (cmd.subcommands && cmd.subcommands.length) {
      cards.push({
        id: `${sec.id}-recipes-${cIdx + 1}`,
        badge: sec.badge,
        title: `${sec.name}: Related commands`,
        subtitle: `Related commands for: ${cmd.desc.split('(')[0].trim()}`,
        commands: cmd.subcommands.map((sub, idx) => ({
          id: `${cmd.id}-sub-${idx + 1}`, desc: sub[1], cmd: sub[0],
          tags: [...baseTags, 'recipe', ...(cmd.tags || []).slice(0, 3)],
          ...((sub[2] || cmd.src) ? { src: sub[2] || cmd.src } : {})
        }))
      });
    }
  });
  if (sec.proTip) {
    cards.push({
      id: `${sec.id}-pro-tips`,
      badge: 'tip',
      title: `${sec.name}: Pro Tip`,
      subtitle: sec.proTip.desc,
      commands: [{
        id: `${sec.id}-tips-card`, desc: sec.proTip.desc, cmd: sec.proTip.cmd,
        details: sec.proTip.details, flags: sec.proTip.flags, tip: sec.proTip.tip,
        tags: [...baseTags, 'tips', 'best-practice'],
        ...(sec.proTip.src ? { src: sec.proTip.src } : {})
      }]
    });
  }
  return mergeCommandCards(cards);
}

// 5. Sheet JS: data plus the shared render/search/bookmark code used by the other suites.
function generateSheetJs(varName, title, cards, fileKey) {
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for Containers: ${title}
const ${varName} = ${jsonCards};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("${fileKey}_bookmarks") || "[]"); } catch (e) { return []; } })())
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
    /(^|\\s|;|&&|\\|\\||\\|)(sudo\\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\\|\\||&&|\\|)/g,
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
  const allCards = ${varName};
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

  for (const card of ${varName}) {
    if (state.activeCategory !== "all" && state.activeCategory !== card.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\\s+/)
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
      ].join("\\n");

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
      ].join("\\n");
    }).join("\\n");

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
    ].join("\\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\\n");
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
        localStorage.setItem("${fileKey}_bookmarks", JSON.stringify([...state.bookmarks]));
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
`;
}

// 6. HTML page. Mirrors the chrome of the current live sheets (theme menu, density
// toggle); common.js adds the header search pill, rail and tools at runtime.
function generateSheetHtml(o) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(o.docTitle)}</title>
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
          <span class="prompt-symbol">${escapeHtml(o.prompt)}</span><span class="cursor-block">${escapeHtml(o.cursor)}</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(o.h1)}</h1>
            <span class="version-pill">${escapeHtml(o.pill)}</span>
            ${EXACT_NAVBAR}
          </div>
          <p class="brand-subtitle">${escapeHtml(o.subtitle)}</p>
        </div>
      </div>
      <div class="header-actions">
        <button
          type="button"
          id="density-toggle"
          class="action-btn"
          title="Toggle compact view (compact spacing)"
          aria-label="Toggle compact view"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <span id="density-label">Compact</span>
        </button>
        <div class="theme-menu-wrapper" id="theme-menu-wrapper">
          <button type="button" id="theme-palette-btn" class="action-btn theme-palette-btn" title="Select Color Theme" aria-haspopup="true" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.4-.4-.8-.4-1.4 0-1.1.9-2 2-2h2.5c3.6 0 6.5-2.9 6.5-6.5C22 5.6 17.5 2 12 2z"></path>
            </svg>
            <span id="theme-btn-label">Theme</span>
            <svg class="dropdown-caret" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
        <button type="button" id="theme-toggle" style="display:none;" aria-hidden="true"></button>
      </div>
    </div>
  </header>
  <main class="container main-layout">
    <!-- Commands Container (Masonry Cards) -->
    <section id="sections-container" class="sections-container" aria-label="Command cards"></section>
    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden" role="status">
      <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M17 17l4 4M9 11h4"/>
      </svg>
      <h3>No matching ${escapeHtml(o.h1)} commands</h3>
      <p>Try searching with different keywords or clear active filters.</p>
    </div>
  </main>
  <!-- Toast Notification -->
  <div id="toast" class="toast" role="status" aria-live="polite">
    <span id="toast-text"></span>
  </div>
  <footer class="page-footer">
    <div class="container footer-inner">
      <span>${escapeHtml(o.h1)} Reference Cheat Sheet</span>
      <span>Press <kbd>/</kbd> to search &bull; Click any command to copy</span>
    </div>
  </footer>
  <script src="global-search-index.js"></script>
  <script src="common.js"></script>
  <script src="${o.fileKey}.js"></script>
</body>
</html>
`;
}

// 7. Write each sheet, then the hub (every card from every sheet).
const PILLS = { docker: 'Docker Engine 29 / Compose plugin', k8s: 'Kubernetes 1.37 / kubectl' };
const writeSheet = (fileKey, varName, title, cards, page) => {
  fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), generateSheetJs(varName, title, cards, fileKey), 'utf8');
  const htmlPath = path.join(__dirname, `${fileKey}.html`);
  if (!fs.existsSync(htmlPath)) fs.writeFileSync(htmlPath, generateSheetHtml({ ...page, fileKey }), 'utf8');
  console.log(`${fileKey}.js (${cards.length} cards)`);
};

const allCards = [];
for (const sec of CONTAINER_SECTIONS) {
  const cards = buildSectionCards(sec);
  allCards.push(...cards);
  writeSheet(sec.file, `CTR_${sec.file.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`, sec.title, cards, {
    docTitle: `Containers: ${sec.name} — ${sec.title}`,
    prompt: sec.group === 'docker' ? 'DKR' : 'K8S', cursor: '$',
    h1: sec.name, pill: PILLS[sec.group], subtitle: sec.subtitle
  });
}
writeSheet('containers', 'CONTAINERS_CHEAT_SHEET_DATA', 'Containers Hub (Docker & Kubernetes)', allCards, {
  docTitle: 'Containers: Docker & Kubernetes Hub',
  prompt: 'CTR', cursor: '$', h1: 'Containers: Docker & Kubernetes',
  pill: 'Docker Engine 29 / Kubernetes 1.37',
  subtitle: 'Run, build and debug containers with Docker; deploy, troubleshoot and maintain GPU nodes with kubectl'
});
console.log(`\nContainers suite: ${CONTAINER_SECTIONS.length} sheets + hub.`);
