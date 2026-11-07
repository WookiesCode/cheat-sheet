// docker-images.js
// Standalone interactive cheat sheet for Containers: Docker Images: build, tag, pull, save/load & prune
const CTR_DOCKER_IMAGES_DATA = [
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
        ]
      }
    ]
  },
  {
    "id": "docker-images-recipes-1",
    "badge": "img",
    "title": "Docker Images: Related commands",
    "subtitle": "Related commands for: List local images with their size and digest",
    "commands": [
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
    "id": "docker-images-flags-2",
    "badge": "img",
    "title": "Docker Images: More options",
    "subtitle": "More options for: Build an image from the Dockerfile in the current directory and tag it",
    "commands": [
      {
        "id": "docker-build-tag-flags-card",
        "desc": "More options and gotchas for: Build an image from the Dockerfile in the current directory and tag it",
        "cmd": "docker build -t <name>:<tag> .",
        "hideCode": false,
        "flags": [
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
        "tags": [
          "docker",
          "containers",
          "flags",
          "options",
          "build",
          "buildkit",
          "buildx"
        ]
      }
    ]
  },
  {
    "id": "docker-images-recipes-2",
    "badge": "img",
    "title": "Docker Images: Related commands",
    "subtitle": "Related commands for: Build an image from the Dockerfile in the current directory and tag it",
    "commands": [
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
    "id": "docker-images-flags-3",
    "badge": "img",
    "title": "Docker Images: More options",
    "subtitle": "More options for: Minimal Dockerfile for a small Python tool, with the layer-caching order explained",
    "commands": [
      {
        "id": "dockerfile-minimal-flags-card",
        "desc": "More options and gotchas for: Minimal Dockerfile for a small Python tool, with the layer-caching order explained",
        "cmd": "FROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nUSER 1000\nCMD [\"python\", \"main.py\"]",
        "hideCode": true,
        "flags": [
          [
            "USER 1000",
            "Run as a non-root user; root in a container is still root on shared kernels"
          ],
          [
            "CMD [\"...\"] (exec form)",
            "JSON array form: the app gets signals directly, so docker stop works cleanly"
          ]
        ],
        "tags": [
          "docker",
          "containers",
          "flags",
          "options",
          "dockerfile",
          "from",
          "run"
        ]
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
        ]
      }
    ]
  },
  {
    "id": "docker-images-recipes-4",
    "badge": "img",
    "title": "Docker Images: Related commands",
    "subtitle": "Related commands for: Pull an image, retag it for a private registry and push it",
    "commands": [
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
    "id": "docker-images-flags-5",
    "badge": "img",
    "title": "Docker Images: More options",
    "subtitle": "More options for: Move an image to an air-gapped host as a tar file",
    "commands": [
      {
        "id": "docker-save-load-airgap-flags-card",
        "desc": "More options and gotchas for: Move an image to an air-gapped host as a tar file",
        "cmd": "docker save -o <name>.tar <image>:<tag>",
        "hideCode": false,
        "flags": [
          [
            "save vs export",
            "save keeps layers and tags (an image); export flattens a container's filesystem and loses them"
          ]
        ],
        "tags": [
          "docker",
          "containers",
          "flags",
          "options",
          "save",
          "load",
          "airgap"
        ]
      }
    ]
  },
  {
    "id": "docker-images-recipes-5",
    "badge": "img",
    "title": "Docker Images: Related commands",
    "subtitle": "Related commands for: Move an image to an air-gapped host as a tar file",
    "commands": [
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
        ]
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
        ]
      },
      {
        "id": "docker-save-load-airgap-sub-3",
        "desc": "Import into containerd's Kubernetes namespace on a node with no Docker (changes state)",
        "cmd": "sudo ctr -n k8s.io images import <name>.tar",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "save",
          "load",
          "airgap"
        ]
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
            "Also removes unused volumes: this deletes data. Never use it casually"
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
        ]
      }
    ]
  },
  {
    "id": "docker-images-flags-6",
    "badge": "img",
    "title": "Docker Images: More options",
    "subtitle": "More options for: Reclaim disk space from stopped containers, unused images and build cache",
    "commands": [
      {
        "id": "docker-prune-flags-card",
        "desc": "More options and gotchas for: Reclaim disk space from stopped containers, unused images and build cache",
        "cmd": "docker system prune",
        "hideCode": false,
        "flags": [
          [
            "-f",
            "Skip the confirmation prompt; avoid in scripts unless you are sure"
          ]
        ],
        "tags": [
          "docker",
          "containers",
          "flags",
          "options",
          "prune",
          "cleanup",
          "disk"
        ]
      }
    ]
  },
  {
    "id": "docker-images-recipes-6",
    "badge": "img",
    "title": "Docker Images: Related commands",
    "subtitle": "Related commands for: Reclaim disk space from stopped containers, unused images and build cache",
    "commands": [
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
        ]
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
        ]
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
        ]
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
        "details": "Images, containers and volumes live under the Docker root directory (default /var/lib/docker) using the storage driver shown (overlay2 on modern Ubuntu). When / fills up on a GPU node, this directory is the usual culprit. The location is set with data-root in /etc/docker/daemon.json.",
        "flags": [
          [
            "DockerRootDir",
            "Where everything is stored, default /var/lib/docker"
          ],
          [
            "Driver: overlay2",
            "The normal storage driver on current kernels"
          ],
          [
            "data-root in daemon.json",
            "Moves storage to another disk; needs a Docker restart and a data copy (changes state)"
          ]
        ],
        "tip": "Full root disk on a node? Check du -sh /var/lib/docker first",
        "tags": [
          "docker",
          "containers",
          "tips",
          "best-practice"
        ]
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("docker-images_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = CTR_DOCKER_IMAGES_DATA;
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

  for (const card of CTR_DOCKER_IMAGES_DATA) {
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
        localStorage.setItem("docker-images_bookmarks", JSON.stringify([...state.bookmarks]));
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
