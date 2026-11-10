// pfs-lustre.js
// Standalone interactive cheat sheet for Parallel filesystems: Lustre: Servers, Targets, Space & LNet
const PFS_PFS_LUSTRE_DATA = [
  {
    "id": "pfs-lustre-cmd-1",
    "badge": "lustre",
    "title": "Lustre: Are all the Lustre servers",
    "subtitle": "Are all the Lustre servers (MDTs and OSTs) reachable from this client?",
    "commands": [
      {
        "id": "lustre-check-servers",
        "desc": "Are all the Lustre servers (MDTs and OSTs) reachable from this client?",
        "cmd": "lfs check servers",
        "details": "",
        "flags": [
          [
            "servers",
            "Every MDT and OST the client knows about"
          ],
          [
            "osts / mds",
            "lfs check osts or lfs check mds: only one kind"
          ]
        ],
        "tip": "First check on a \"Lustre is slow / hung\" ticket",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "lustre",
          "lfs",
          "servers",
          "ost",
          "mdt",
          "reachability"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      },
      {
        "id": "lustre-check-servers-sub-1",
        "desc": "Only the object storage targets",
        "cmd": "lfs check osts",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lfs",
          "servers"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      },
      {
        "id": "lustre-check-servers-sub-2",
        "desc": "Only the metadata targets",
        "cmd": "lfs check mds",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lfs",
          "servers"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-lustre-cmd-2",
    "badge": "lustre",
    "title": "Lustre: Space per MDT and OST",
    "subtitle": "Space per MDT and OST: which target is full",
    "commands": [
      {
        "id": "lustre-df",
        "desc": "Space per MDT and OST: which target is full",
        "cmd": "lfs df -h /mnt/<fsname>",
        "details": "",
        "flags": [
          [
            "-h",
            "Human-readable sizes, per MDT and OST"
          ],
          [
            "-i",
            "Inodes instead of space: a full MDT runs out of inodes first"
          ],
          [
            "--lazy",
            "Skip OSTs that are disconnected instead of waiting on them"
          ]
        ],
        "tip": "One OST at 100% stalls writes striped onto it",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "lustre",
          "lfs",
          "df",
          "space",
          "inodes",
          "ost"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      },
      {
        "id": "lustre-df-sub-1",
        "desc": "Inode use per MDT and OST",
        "cmd": "lfs df -i /mnt/<fsname>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lfs",
          "df"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      },
      {
        "id": "lustre-df-sub-2",
        "desc": "Every OST with its index and UUID",
        "cmd": "lfs osts /mnt/<fsname>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lfs",
          "df"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-lustre-cmd-3",
    "badge": "lustre",
    "title": "Lustre: Lustre devices on this node and whether they are UP",
    "subtitle": "Lustre devices on this node and whether they are UP",
    "commands": [
      {
        "id": "lustre-dl",
        "desc": "Lustre devices on this node and whether they are UP",
        "cmd": "lctl dl",
        "details": "",
        "flags": [
          [
            "Columns",
            "Index, status (UP), type (mgc, mdc, osc, lov…), name, UUID, refcount"
          ],
          [
            "osc / mdc",
            "One per OST / MDT the client talks to: a missing one is a target it cannot see"
          ],
          [
            "device_list",
            "lctl device_list is the same command"
          ]
        ],
        "tip": "Count the osc lines against lfs osts",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "lustre",
          "lctl",
          "devices",
          "osc",
          "mdc"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ],
          "note": "The manual shows lctl get_param osc.<fs>-OST0001-osc-*.import; the fields in its output vary by version."
        }
      },
      {
        "id": "lustre-dl-sub-1",
        "desc": "Only the client's connections to MDTs and OSTs",
        "cmd": "lctl dl | grep -E \" (mdc|osc) \"",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lctl",
          "devices"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ],
          "note": "The manual shows lctl get_param osc.<fs>-OST0001-osc-*.import; the fields in its output vary by version."
        }
      },
      {
        "id": "lustre-dl-sub-2",
        "desc": "Connection detail for every OST import (fields vary by Lustre version)",
        "cmd": "lctl get_param osc.*.import",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lctl",
          "devices"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ],
          "note": "The manual shows lctl get_param osc.<fs>-OST0001-osc-*.import; the fields in its output vary by version."
        }
      }
    ]
  },
  {
    "id": "pfs-lustre-cmd-4",
    "badge": "lustre",
    "title": "Lustre: LNet",
    "subtitle": "LNet: which networks this node is on, and can it reach a server NID",
    "commands": [
      {
        "id": "lustre-lnet",
        "desc": "LNet: which networks this node is on, and can it reach a server NID",
        "cmd": "lnetctl net show --verbose",
        "details": "",
        "flags": [
          [
            "status: up",
            "The LNet network (tcp, o2ib) is up on this interface"
          ],
          [
            "NID",
            "address@network, e.g. 192.0.2.10@o2ib for InfiniBand or @tcp0"
          ],
          [
            "--net <name>",
            "Only one network, e.g. --net o2ib"
          ]
        ],
        "tip": "lctl ping fails but IP ping works → LNet / IB, not the network",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "lustre",
          "lnet",
          "lnetctl",
          "nid",
          "o2ib",
          "ping"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ],
          "note": "lnetctl ping is not in the Operations Manual; lctl ping {nid} is."
        }
      },
      {
        "id": "lustre-lnet-sub-1",
        "desc": "LNet-level ping of a server, e.g. lctl ping 192.0.2.10@o2ib",
        "cmd": "lctl ping <nid>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lnet",
          "lnetctl"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ],
          "note": "lnetctl ping is not in the Operations Manual; lctl ping {nid} is."
        }
      },
      {
        "id": "lustre-lnet-sub-2",
        "desc": "Peers this node knows, with their NIDs and state",
        "cmd": "lnetctl peer show",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lnet",
          "lnetctl"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ],
          "note": "lnetctl ping is not in the Operations Manual; lctl ping {nid} is."
        }
      },
      {
        "id": "lustre-lnet-sub-3",
        "desc": "Timeouts, evictions and reconnects in the kernel log",
        "cmd": "dmesg -T | grep -iE \"lustre|lnet\"",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lnet",
          "lnetctl"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ],
          "note": "lnetctl ping is not in the Operations Manual; lctl ping {nid} is."
        }
      }
    ]
  },
  {
    "id": "pfs-lustre-cmd-5",
    "badge": "lustre",
    "title": "Lustre: How a file or directory is striped across OSTs",
    "subtitle": "How a file or directory is striped across OSTs",
    "commands": [
      {
        "id": "lustre-stripe",
        "desc": "How a file or directory is striped across OSTs",
        "cmd": "lfs getstripe -v <file-or-dir>",
        "details": "",
        "flags": [
          [
            "stripe_count",
            "How many OSTs the file is spread over"
          ],
          [
            "obdidx",
            "Which OSTs hold its objects: match them to a slow or failed OST"
          ],
          [
            "lfs setstripe -c N <dir>",
            "Sets the layout for new files in the directory (changes state)"
          ]
        ],
        "tip": "lfs find --obd lists what a dead OST takes with it",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "lustre",
          "lfs",
          "stripe",
          "layout",
          "ost"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      },
      {
        "id": "lustre-stripe-sub-1",
        "desc": "Stripe new files in this directory over <count> OSTs (changes state)",
        "cmd": "lfs setstripe -c <count> <dir>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lfs",
          "stripe"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      },
      {
        "id": "lustre-stripe-sub-2",
        "desc": "Files with objects on one OST (e.g. before replacing it)",
        "cmd": "lfs find --obd <ost-uuid> /mnt/<fsname>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "lfs",
          "stripe"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-lustre-cmd-6",
    "badge": "lustre",
    "title": "Lustre: Mount a Lustre filesystem on a client",
    "subtitle": "Mount a Lustre filesystem on a client",
    "commands": [
      {
        "id": "lustre-mount",
        "desc": "Mount a Lustre filesystem on a client",
        "cmd": "mount -t lustre <mgs-nid>:/<fsname> /mnt/<fsname>",
        "details": "",
        "flags": [
          [
            "<mgs-nid>",
            "The MGS NID, e.g. 192.0.2.10@o2ib; list a failover MGS as nid1:nid2:/fsname"
          ],
          [
            "/<fsname>",
            "The filesystem name chosen at mkfs.lustre time"
          ],
          [
            "umount",
            "Unmounting kills I/O for every job using it: drain the node first"
          ]
        ],
        "tip": "Failover MGS: nid1:nid2:/fsname",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "lustre",
          "mount",
          "client",
          "mgs",
          "nid"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      },
      {
        "id": "lustre-mount-sub-1",
        "desc": "Unmount (changes state: drain the node first)",
        "cmd": "umount /mnt/<fsname>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "recipe",
          "lustre",
          "mount",
          "client"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-lustre-pro-tips",
    "badge": "tip",
    "title": "Lustre: Pro Tip",
    "subtitle": "Server side: is the target healthy?",
    "commands": [
      {
        "id": "pfs-lustre-tips-card",
        "desc": "Server side: is the target healthy?",
        "cmd": "lctl get_param health_check",
        "details": "On an MDS or OSS, the health_check parameter says \"healthy\", or \"not healthy\" after an LBUG or a failed device. If it is not healthy, check the server consoles and syslogs for LustreError and LBUG lines before restarting anything.",
        "flags": [
          [
            "not healthy",
            "Look for LustreError / LBUG first"
          ],
          [
            "Clients",
            "lfs check servers from a client"
          ]
        ],
        "tip": "Read the logs before you restart a Lustre server",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-lustre",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://doc.lustre.org/lustre_manual.xhtml",
              "title": "Lustre Operations Manual"
            }
          ],
          "note": "The manual names the health_check parameter and its \"not healthy\" status; reading it with lctl get_param is the standard form."
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("pfs-lustre_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = PFS_PFS_LUSTRE_DATA;
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

  for (const card of PFS_PFS_LUSTRE_DATA) {
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
        localStorage.setItem("pfs-lustre_bookmarks", JSON.stringify([...state.bookmarks]));
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
