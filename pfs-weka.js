// pfs-weka.js
// Standalone interactive cheat sheet for Parallel filesystems: WEKA: Status, Alerts, Containers & Drives
const PFS_PFS_WEKA_DATA = [
  {
    "id": "pfs-weka-cmd-1",
    "badge": "weka",
    "title": "WEKA: Overall cluster status",
    "subtitle": "Overall cluster status: health, capacity and protection",
    "commands": [
      {
        "id": "weka-status",
        "desc": "Overall cluster status: health, capacity and protection",
        "cmd": "weka status",
        "details": "",
        "flags": [
          [
            "weka status rebuild",
            "Phasing in/out progress and protection per fault level"
          ],
          [
            "--detailed-capacity",
            "Capacity detail including data reduction"
          ],
          [
            "Output layout",
            "Redesigned in the 6.0 CLI: re-check scripts that parse it"
          ]
        ],
        "tip": "Rebuilding? Don't pull another drive",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "weka",
          "status",
          "rebuild",
          "protection",
          "capacity"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-status",
              "title": "WEKA CLI: weka status"
            }
          ]
        }
      },
      {
        "id": "weka-status-sub-1",
        "desc": "Rebuild / phase-out progress and protection level",
        "cmd": "weka status rebuild",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "status",
          "rebuild"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-status",
              "title": "WEKA CLI: weka status"
            }
          ]
        }
      },
      {
        "id": "weka-status-sub-2",
        "desc": "Capacity with data reduction",
        "cmd": "weka status --detailed-capacity",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "status",
          "rebuild"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-status",
              "title": "WEKA CLI: weka status"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-weka-cmd-2",
    "badge": "weka",
    "title": "WEKA: Active alerts in the cluster",
    "subtitle": "Active alerts in the cluster",
    "commands": [
      {
        "id": "weka-alerts",
        "desc": "Active alerts in the cluster",
        "cmd": "weka alerts",
        "details": "",
        "flags": [
          [
            "(no flags)",
            "Active alerts; muted ones are not listed"
          ],
          [
            "--severity <level>",
            "Filter by severity"
          ],
          [
            "--inactive",
            "Alerts that have cleared"
          ]
        ],
        "tip": "Muted alerts hide from the list",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "weka",
          "alerts",
          "health"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-alerts",
              "title": "WEKA CLI: weka alerts"
            }
          ]
        }
      },
      {
        "id": "weka-alerts-sub-1",
        "desc": "Recently cleared alerts",
        "cmd": "weka alerts --inactive",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "alerts",
          "health"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-alerts",
              "title": "WEKA CLI: weka alerts"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-weka-cmd-3",
    "badge": "weka",
    "title": "WEKA: Every WEKA container",
    "subtitle": "Every WEKA container (backend and client) and its status",
    "commands": [
      {
        "id": "weka-containers",
        "desc": "Every WEKA container (backend and client) and its status",
        "cmd": "weka cluster container",
        "details": "",
        "flags": [
          [
            "hostname / status / state / uptime",
            "Which server, whether it is UP, and for how long"
          ],
          [
            "Renamed in 6.0",
            "Older CLIs called these hosts (weka cluster host)"
          ],
          [
            "weka cluster process",
            "The processes inside each container"
          ]
        ],
        "tip": "A container not UP: check its server first",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "weka",
          "cluster",
          "container",
          "process",
          "server"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-cluster",
              "title": "WEKA CLI: weka cluster"
            },
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/migrate-from-legacy-weka-cli",
              "title": "WEKA: migrate from the legacy CLI"
            }
          ]
        }
      },
      {
        "id": "weka-containers-sub-1",
        "desc": "Processes per container",
        "cmd": "weka cluster process",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "cluster",
          "container"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-cluster",
              "title": "WEKA CLI: weka cluster"
            },
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/migrate-from-legacy-weka-cli",
              "title": "WEKA: migrate from the legacy CLI"
            }
          ]
        }
      },
      {
        "id": "weka-containers-sub-2",
        "desc": "Servers in the cluster",
        "cmd": "weka cluster server list",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "cluster",
          "container"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-cluster",
              "title": "WEKA CLI: weka cluster"
            },
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/migrate-from-legacy-weka-cli",
              "title": "WEKA: migrate from the legacy CLI"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-weka-cmd-4",
    "badge": "weka",
    "title": "WEKA: NVMe drives WEKA manages, per container, and their status",
    "subtitle": "NVMe drives WEKA manages, per container, and their status",
    "commands": [
      {
        "id": "weka-drives",
        "desc": "NVMe drives WEKA manages, per container, and their status",
        "cmd": "weka cluster drive",
        "details": "",
        "flags": [
          [
            "status / drive_status",
            "Whether each drive is active; look for anything not active"
          ],
          [
            "--container <id>",
            "Only the drives of one container (server)"
          ],
          [
            "deactivate / remove",
            "Change state and reduce protection: only with WEKA support and approval"
          ]
        ],
        "tip": "Match the drive to its server before any swap",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "weka",
          "drive",
          "nvme",
          "container"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-cluster",
              "title": "WEKA CLI: weka cluster"
            }
          ],
          "note": "The CLI reference names the status columns but does not list their values."
        }
      },
      {
        "id": "weka-drives-sub-1",
        "desc": "Drives on one server",
        "cmd": "weka cluster drive --container <container-id>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "drive",
          "nvme"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-cluster",
              "title": "WEKA CLI: weka cluster"
            }
          ],
          "note": "The CLI reference names the status columns but does not list their values."
        }
      },
      {
        "id": "weka-drives-sub-2",
        "desc": "Phase a drive out before replacing it (changes state: WEKA support + approval)",
        "cmd": "weka cluster drive deactivate <drive-id>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "drive",
          "nvme"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-cluster",
              "title": "WEKA CLI: weka cluster"
            }
          ],
          "note": "The CLI reference names the status columns but does not list their values."
        }
      }
    ]
  },
  {
    "id": "pfs-weka-cmd-5",
    "badge": "weka",
    "title": "WEKA: On one machine",
    "subtitle": "On one machine: its local WEKA containers and events",
    "commands": [
      {
        "id": "weka-local",
        "desc": "On one machine: its local WEKA containers and events",
        "cmd": "weka local ps",
        "details": "",
        "flags": [
          [
            "local ps",
            "Containers running on this machine"
          ],
          [
            "local events",
            "Local events; works without authentication even when the cluster is down"
          ],
          [
            "events local",
            "Recent events on this machine (was \"events list-local\")"
          ]
        ],
        "tip": "Cluster down? weka local events still answers",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "weka",
          "local",
          "events",
          "container"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-local",
              "title": "WEKA CLI: weka local"
            },
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-events",
              "title": "WEKA CLI: weka events"
            }
          ]
        }
      },
      {
        "id": "weka-local-sub-1",
        "desc": "Local events, even with the cluster down",
        "cmd": "weka local events",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "local",
          "events"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-local",
              "title": "WEKA CLI: weka local"
            },
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-events",
              "title": "WEKA CLI: weka events"
            }
          ]
        }
      },
      {
        "id": "weka-local-sub-2",
        "desc": "Recent events that happened on this machine",
        "cmd": "weka events local",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "local",
          "events"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-local",
              "title": "WEKA CLI: weka local"
            },
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-events",
              "title": "WEKA CLI: weka events"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-weka-cmd-6",
    "badge": "weka",
    "title": "WEKA: Mount a WEKA filesystem on a stateless client",
    "subtitle": "Mount a WEKA filesystem on a stateless client",
    "commands": [
      {
        "id": "weka-mount",
        "desc": "Mount a WEKA filesystem on a stateless client",
        "cmd": "mount -t wekafs <backend1>,<backend2>/<fs> /mnt/weka",
        "details": "",
        "flags": [
          [
            "<backend1>,<backend2>",
            "Backends to join through; list several in case one is down"
          ],
          [
            "/<fs>",
            "The filesystem name (weka fs lists them); <fs>/<subdir> mounts a subdirectory"
          ],
          [
            "Persistent clients",
            "Mount by filesystem name only: mount -t wekafs <fs> /mnt/weka"
          ]
        ],
        "tip": "List more than one backend",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "weka",
          "mount",
          "wekafs",
          "client"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/weka-filesystems-and-object-stores/mounting-filesystems",
              "title": "WEKA: mount filesystems"
            },
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-fs",
              "title": "WEKA CLI: weka fs"
            }
          ]
        }
      },
      {
        "id": "weka-mount-sub-1",
        "desc": "Filesystems in the cluster",
        "cmd": "weka fs",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "recipe",
          "weka",
          "mount",
          "wekafs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/weka-filesystems-and-object-stores/mounting-filesystems",
              "title": "WEKA: mount filesystems"
            },
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-fs",
              "title": "WEKA CLI: weka fs"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-weka-pro-tips",
    "badge": "tip",
    "title": "WEKA: Pro Tip",
    "subtitle": "Before touching a WEKA backend",
    "commands": [
      {
        "id": "pfs-weka-tips-card",
        "desc": "Before touching a WEKA backend",
        "cmd": "weka status rebuild",
        "details": "Check protection and rebuild first: a cluster that is already rebuilding or running with reduced protection may not survive another drive or server going away. Get WEKA support involved before deactivating drives or containers.",
        "flags": [
          [
            "Protection",
            "weka status rebuild"
          ],
          [
            "Alerts",
            "weka alerts"
          ]
        ],
        "tip": "Never start a second failure during a rebuild",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-weka",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.weka.io/getting-started-with-weka/weka-cli-overview/cli-reference-guide/weka-status",
              "title": "WEKA CLI: weka status"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("pfs-weka_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = PFS_PFS_WEKA_DATA;
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

  for (const card of PFS_PFS_WEKA_DATA) {
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
        localStorage.setItem("pfs-weka_bookmarks", JSON.stringify([...state.bookmarks]));
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
