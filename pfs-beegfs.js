// pfs-beegfs.js
// Standalone interactive cheat sheet for Parallel filesystems: BeeGFS: Health, Targets, Nodes & Free Space
const PFS_PFS_BEEGFS_DATA = [
  {
    "id": "pfs-beegfs-cmd-1",
    "badge": "beegfs",
    "title": "BeeGFS: Check for common problems across the whole filesystem",
    "subtitle": "Check for common problems across the whole filesystem",
    "commands": [
      {
        "id": "beegfs-health-check",
        "desc": "Check for common problems across the whole filesystem",
        "cmd": "beegfs health check",
        "details": "",
        "flags": [
          [
            "health check",
            "BeeGFS 8: one pass over nodes, targets and connectivity"
          ],
          [
            "beegfs-check-servers",
            "BeeGFS 7.x: whether each service can be reached"
          ],
          [
            "After an upgrade",
            "BeeGFS's own upgrade guide uses it to confirm all nodes and targets are good"
          ]
        ],
        "tip": "Start here on any BeeGFS ticket",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "beegfs",
          "health",
          "check-servers"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 8.4 quick start"
            },
            {
              "url": "https://doc.beegfs.io/latest/advanced_topics/upgrade.html",
              "title": "BeeGFS 8.4 upgrade guide"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
            }
          ]
        }
      },
      {
        "id": "beegfs-health-check-sub-1",
        "desc": "BeeGFS 7.x: reachability of mgmtd, meta and storage services",
        "cmd": "beegfs-check-servers",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "recipe",
          "beegfs",
          "health",
          "check-servers"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 8.4 quick start"
            },
            {
              "url": "https://doc.beegfs.io/latest/advanced_topics/upgrade.html",
              "title": "BeeGFS 8.4 upgrade guide"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-beegfs-cmd-2",
    "badge": "beegfs",
    "title": "BeeGFS: Target reachability and consistency",
    "subtitle": "Target reachability and consistency",
    "commands": [
      {
        "id": "beegfs-targets",
        "desc": "Target reachability and consistency",
        "cmd": "beegfs target list --state",
        "details": "",
        "flags": [
          [
            "Online / Probably Offline / Offline",
            "Reachable · a communication failure was seen · unreachable (a buddy-mirror primary fails over)"
          ],
          [
            "Good / Needs resync / Resyncing / Bad",
            "Consistency; anything but Good is a mirrored secondary that needs or failed a resync"
          ],
          [
            "7.x",
            "beegfs-ctl --listtargets --longnodes --state"
          ]
        ],
        "tip": "Bad consistency = the resync failed",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "beegfs",
          "targets",
          "state",
          "mirror",
          "resync"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/reference/target_states.html",
              "title": "BeeGFS 8.4: target states"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/advanced_topics/target_management.html",
              "title": "BeeGFS 7.4.6: target management"
            }
          ]
        }
      },
      {
        "id": "beegfs-targets-sub-1",
        "desc": "BeeGFS 7.x: the same view",
        "cmd": "beegfs-ctl --listtargets --longnodes --state",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "recipe",
          "beegfs",
          "targets",
          "state"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/reference/target_states.html",
              "title": "BeeGFS 8.4: target states"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/advanced_topics/target_management.html",
              "title": "BeeGFS 7.4.6: target management"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-beegfs-cmd-3",
    "badge": "beegfs",
    "title": "BeeGFS: Nodes and the network interfaces they use",
    "subtitle": "Nodes and the network interfaces they use",
    "commands": [
      {
        "id": "beegfs-nodes",
        "desc": "Nodes and the network interfaces they use",
        "cmd": "beegfs node list --with-nics",
        "details": "",
        "flags": [
          [
            "--with-nics",
            "Each node's network interfaces (RDMA or TCP)"
          ],
          [
            "--node-type=meta --reachability-check",
            "Only metadata nodes, with a reachability check"
          ],
          [
            "7.x",
            "beegfs-ctl --listnodes --nodetype=storage --nicdetails"
          ]
        ],
        "tip": "Expect RDMA NICs on an IB fabric",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "beegfs",
          "nodes",
          "nic",
          "rdma"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/advanced_topics/node_management.html",
              "title": "BeeGFS 8.4: node management"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
            }
          ]
        }
      },
      {
        "id": "beegfs-nodes-sub-1",
        "desc": "Metadata nodes, NICs and reachability",
        "cmd": "beegfs node list --node-type=meta --with-nics --reachability-check",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "recipe",
          "beegfs",
          "nodes",
          "nic"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/advanced_topics/node_management.html",
              "title": "BeeGFS 8.4: node management"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
            }
          ]
        }
      },
      {
        "id": "beegfs-nodes-sub-2",
        "desc": "BeeGFS 7.x: storage nodes with NIC details",
        "cmd": "beegfs-ctl --listnodes --nodetype=storage --nicdetails",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "recipe",
          "beegfs",
          "nodes",
          "nic"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/advanced_topics/node_management.html",
              "title": "BeeGFS 8.4: node management"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-beegfs-cmd-4",
    "badge": "beegfs",
    "title": "BeeGFS: Free space and inodes on metadata and storage targets",
    "subtitle": "Free space and inodes on metadata and storage targets",
    "commands": [
      {
        "id": "beegfs-df",
        "desc": "Free space and inodes on metadata and storage targets",
        "cmd": "beegfs health df",
        "details": "",
        "flags": [
          [
            "health df",
            "BeeGFS 8: space and inodes per metadata and storage target"
          ],
          [
            "beegfs-df",
            "BeeGFS 7.x equivalent"
          ],
          [
            "health net",
            "beegfs health net: the connections this client is actually using (7.x: beegfs-net)"
          ]
        ],
        "tip": "TCP where you expected RDMA = check the IB fabric",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "beegfs",
          "df",
          "space",
          "inodes",
          "net"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 8.4 quick start"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
            }
          ]
        }
      },
      {
        "id": "beegfs-df-sub-1",
        "desc": "BeeGFS 7.x: free space and inodes per target",
        "cmd": "beegfs-df",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "recipe",
          "beegfs",
          "df",
          "space"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 8.4 quick start"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
            }
          ]
        }
      },
      {
        "id": "beegfs-df-sub-2",
        "desc": "Connections this client uses (RDMA or TCP fallback)",
        "cmd": "beegfs health net",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "recipe",
          "beegfs",
          "df",
          "space"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 8.4 quick start"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
            }
          ]
        }
      },
      {
        "id": "beegfs-df-sub-3",
        "desc": "BeeGFS 7.x: the same",
        "cmd": "beegfs-net",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "recipe",
          "beegfs",
          "df",
          "space"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 8.4 quick start"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-beegfs-cmd-5",
    "badge": "beegfs",
    "title": "BeeGFS: Where a file or directory lives",
    "subtitle": "Where a file or directory lives: stripe pattern and targets",
    "commands": [
      {
        "id": "beegfs-entry",
        "desc": "Where a file or directory lives: stripe pattern and targets",
        "cmd": "beegfs-ctl --getentryinfo <path>",
        "details": "",
        "flags": [
          [
            "--getentryinfo",
            "BeeGFS 7.x: stripe pattern, chunk size and the targets holding the entry"
          ],
          [
            "BeeGFS 8",
            "beegfs entry info replaces it (beegfs entry info --help for the arguments)"
          ],
          [
            "Client service",
            "systemctl status beegfs-client on the client node"
          ]
        ],
        "tip": "Map a slow file to its targets",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "beegfs",
          "entry",
          "stripe",
          "client"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/7.4.6/advanced_topics/striping.html",
              "title": "BeeGFS 7.4.6: striping"
            },
            {
              "url": "https://doc.beegfs.io/latest/release_notes.html",
              "title": "BeeGFS 8.4 release notes"
            }
          ],
          "note": "The 8.4 docs name beegfs entry info but don't show its arguments."
        }
      },
      {
        "id": "beegfs-entry-sub-1",
        "desc": "Is the BeeGFS client service running on this node",
        "cmd": "systemctl status beegfs-client --no-pager",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "recipe",
          "beegfs",
          "entry",
          "stripe"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/7.4.6/advanced_topics/striping.html",
              "title": "BeeGFS 7.4.6: striping"
            },
            {
              "url": "https://doc.beegfs.io/latest/release_notes.html",
              "title": "BeeGFS 8.4 release notes"
            }
          ],
          "note": "The 8.4 docs name beegfs entry info but don't show its arguments."
        }
      }
    ]
  },
  {
    "id": "pfs-beegfs-pro-tips",
    "badge": "tip",
    "title": "BeeGFS: Pro Tip",
    "subtitle": "Which BeeGFS do you have?",
    "commands": [
      {
        "id": "pfs-beegfs-tips-card",
        "desc": "Which BeeGFS do you have?",
        "cmd": "beegfs --help",
        "details": "BeeGFS 8 ships the beegfs command (package beegfs-tools); 7.x uses beegfs-ctl, beegfs-df, beegfs-net and beegfs-check-servers. Flags differ: 8.x spells --node-type with a hyphen, 7.x --nodetype. Check which one the node has before copying.",
        "flags": [
          [
            "8.x",
            "beegfs <noun> <verb>"
          ],
          [
            "7.x",
            "beegfs-ctl --<action>"
          ]
        ],
        "tip": "Don't mix 7.x flags into 8.x commands",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-beegfs",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.beegfs.io/latest/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 8.4 quick start"
            },
            {
              "url": "https://doc.beegfs.io/7.4.6/quick_start_guide/quick_start_guide.html",
              "title": "BeeGFS 7.4.6 quick start"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("pfs-beegfs_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = PFS_PFS_BEEGFS_DATA;
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

  for (const card of PFS_PFS_BEEGFS_DATA) {
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
        localStorage.setItem("pfs-beegfs_bookmarks", JSON.stringify([...state.bookmarks]));
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
