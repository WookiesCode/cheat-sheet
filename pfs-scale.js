// pfs-scale.js
// Standalone interactive cheat sheet for Parallel filesystems: IBM Storage Scale (GPFS): Daemon State, Health, Disks & NSDs
const PFS_PFS_SCALE_DATA = [
  {
    "id": "pfs-scale-cmd-1",
    "badge": "gpfs",
    "title": "IBM Storage Scale: Is the GPFS daemon active on every node?",
    "subtitle": "Is the GPFS daemon active on every node?",
    "commands": [
      {
        "id": "scale-getstate",
        "desc": "Is the GPFS daemon active on every node?",
        "cmd": "mmgetstate -a",
        "details": "",
        "flags": [
          [
            "active",
            "The daemon is up and the node is in the cluster"
          ],
          [
            "arbitrating / down",
            "Trying to form or join a quorum / not running"
          ],
          [
            "unknown / unresponsive",
            "The node could not be reached, or did not answer in time"
          ],
          [
            "-L",
            "Adds the quorum count, nodes up, and total nodes"
          ]
        ],
        "tip": "Lost quorum = the whole filesystem stops",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "gpfs",
          "storage-scale",
          "mmgetstate",
          "quorum",
          "daemon"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmgetstate-command",
              "title": "IBM Storage Scale 5.2.3: mmgetstate"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlscluster-command",
              "title": "IBM Storage Scale 5.2.3: mmlscluster"
            }
          ],
          "note": "Commands live in /usr/lpp/mmfs/bin and run as root."
        }
      },
      {
        "id": "scale-getstate-sub-1",
        "desc": "Daemon state plus quorum details",
        "cmd": "mmgetstate -a -L",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmgetstate"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmgetstate-command",
              "title": "IBM Storage Scale 5.2.3: mmgetstate"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlscluster-command",
              "title": "IBM Storage Scale 5.2.3: mmlscluster"
            }
          ],
          "note": "Commands live in /usr/lpp/mmfs/bin and run as root."
        }
      },
      {
        "id": "scale-getstate-sub-2",
        "desc": "Cluster name, nodes, quorum and manager designations",
        "cmd": "mmlscluster",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmgetstate"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmgetstate-command",
              "title": "IBM Storage Scale 5.2.3: mmgetstate"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlscluster-command",
              "title": "IBM Storage Scale 5.2.3: mmlscluster"
            }
          ],
          "note": "Commands live in /usr/lpp/mmfs/bin and run as root."
        }
      }
    ]
  },
  {
    "id": "pfs-scale-cmd-2",
    "badge": "gpfs",
    "title": "IBM Storage Scale: What the health monitor flags on this node and across the cluster",
    "subtitle": "What the health monitor flags on this node and across the cluster",
    "commands": [
      {
        "id": "scale-health",
        "desc": "What the health monitor flags on this node and across the cluster",
        "cmd": "mmhealth node show --verbose",
        "details": "",
        "flags": [
          [
            "node show",
            "Each component on this node (network, disk, filesystem, GPFS) and its state"
          ],
          [
            "--unhealthy",
            "Only the components that are not healthy"
          ],
          [
            "cluster show",
            "The same, summed over every node"
          ]
        ],
        "tip": "Start with --unhealthy",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "gpfs",
          "storage-scale",
          "mmhealth",
          "health",
          "events"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmhealth-command",
              "title": "IBM Storage Scale 5.2.3: mmhealth"
            }
          ],
          "note": "The verbose option is --verbose; -v is not in the synopsis."
        }
      },
      {
        "id": "scale-health-sub-1",
        "desc": "Only what is wrong on this node",
        "cmd": "mmhealth node show --unhealthy",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmhealth"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmhealth-command",
              "title": "IBM Storage Scale 5.2.3: mmhealth"
            }
          ],
          "note": "The verbose option is --verbose; -v is not in the synopsis."
        }
      },
      {
        "id": "scale-health-sub-2",
        "desc": "Health across the whole cluster",
        "cmd": "mmhealth cluster show",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmhealth"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmhealth-command",
              "title": "IBM Storage Scale 5.2.3: mmhealth"
            }
          ],
          "note": "The verbose option is --verbose; -v is not in the synopsis."
        }
      },
      {
        "id": "scale-health-sub-3",
        "desc": "Health events on this node over the last day",
        "cmd": "mmhealth node eventlog --day",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmhealth"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmhealth-command",
              "title": "IBM Storage Scale 5.2.3: mmhealth"
            }
          ],
          "note": "The verbose option is --verbose; -v is not in the synopsis."
        }
      }
    ]
  },
  {
    "id": "pfs-scale-cmd-3",
    "badge": "gpfs",
    "title": "IBM Storage Scale: Disks in a filesystem that are not up and ready",
    "subtitle": "Disks in a filesystem that are not up and ready",
    "commands": [
      {
        "id": "scale-lsdisk",
        "desc": "Disks in a filesystem that are not up and ready",
        "cmd": "mmlsdisk <fs> -e",
        "details": "",
        "flags": [
          [
            "-e",
            "Only disks whose availability is not up or whose status is not ready (\"All disks up and ready\" when fine)"
          ],
          [
            "availability",
            "up · down · recovering · unrecovered"
          ],
          [
            "status",
            "ready · suspended · to be emptied · being emptied · emptied · replacing · replacement"
          ],
          [
            "GPFS down",
            "mmlsdisk needs the daemon running"
          ]
        ],
        "tip": "A disk down after a path flap: mmchdisk start once the path is back",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "gpfs",
          "storage-scale",
          "mmlsdisk",
          "mmdf",
          "disk",
          "nsd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlsdisk-command",
              "title": "IBM Storage Scale 5.2.3: mmlsdisk"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmdf-command",
              "title": "IBM Storage Scale 5.2.3: mmdf"
            }
          ],
          "note": "mmdf is I/O heavy: run it when the filesystem is lightly loaded."
        }
      },
      {
        "id": "scale-lsdisk-sub-1",
        "desc": "Every disk with its failure group, pool and state, plus the filesystem descriptor quorum",
        "cmd": "mmlsdisk <fs> -L",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmlsdisk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlsdisk-command",
              "title": "IBM Storage Scale 5.2.3: mmlsdisk"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmdf-command",
              "title": "IBM Storage Scale 5.2.3: mmdf"
            }
          ],
          "note": "mmdf is I/O heavy: run it when the filesystem is lightly loaded."
        }
      },
      {
        "id": "scale-lsdisk-sub-2",
        "desc": "Free space per disk and storage pool, in readable units",
        "cmd": "mmdf <fs> --block-size auto",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmlsdisk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlsdisk-command",
              "title": "IBM Storage Scale 5.2.3: mmlsdisk"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmdf-command",
              "title": "IBM Storage Scale 5.2.3: mmdf"
            }
          ],
          "note": "mmdf is I/O heavy: run it when the filesystem is lightly loaded."
        }
      }
    ]
  },
  {
    "id": "pfs-scale-cmd-4",
    "badge": "gpfs",
    "title": "IBM Storage Scale: Which local device is behind each NSD",
    "subtitle": "Which local device is behind each NSD",
    "commands": [
      {
        "id": "scale-nsd",
        "desc": "Which local device is behind each NSD",
        "cmd": "mmlsnsd -m",
        "details": "",
        "flags": [
          [
            "-m",
            "NSD name → device name on this node (and on its NSD servers)"
          ],
          [
            "-M",
            "The same on every node: slow, meant for problem determination"
          ],
          [
            "-X",
            "Adds volume IDs, server status and Persistent Reserve: also slow"
          ]
        ],
        "tip": "NSD → /dev name → drive serial before a swap",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "gpfs",
          "storage-scale",
          "mmlsnsd",
          "nsd",
          "device",
          "mmlsmount"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlsnsd-command",
              "title": "IBM Storage Scale 5.2.3: mmlsnsd"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlsmount-command",
              "title": "IBM Storage Scale 5.2.3: mmlsmount"
            }
          ]
        }
      },
      {
        "id": "scale-nsd-sub-1",
        "desc": "Extended NSD detail for problem determination (slow)",
        "cmd": "mmlsnsd -X",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmlsnsd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlsnsd-command",
              "title": "IBM Storage Scale 5.2.3: mmlsnsd"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlsmount-command",
              "title": "IBM Storage Scale 5.2.3: mmlsmount"
            }
          ]
        }
      },
      {
        "id": "scale-nsd-sub-2",
        "desc": "Which nodes have which filesystems mounted",
        "cmd": "mmlsmount all -L",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmlsnsd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlsnsd-command",
              "title": "IBM Storage Scale 5.2.3: mmlsnsd"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmlsmount-command",
              "title": "IBM Storage Scale 5.2.3: mmlsmount"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-scale-cmd-5",
    "badge": "gpfs",
    "title": "IBM Storage Scale: Bring a down disk back",
    "subtitle": "Bring a down disk back (changes state: ask first)",
    "commands": [
      {
        "id": "scale-change",
        "desc": "Bring a down disk back (changes state: ask first)",
        "cmd": "mmchdisk <fs> start -d \"<nsd-name>\"",
        "details": "",
        "flags": [
          [
            "start",
            "Tells GPFS to use a disk again after its path or server is fixed"
          ],
          [
            "-a",
            "mmchdisk <fs> start -a: all down disks; disks that went down together should start together"
          ],
          [
            "stop / suspend",
            "Stop using a disk, or stop new allocations on it; stop is refused with replication 1"
          ]
        ],
        "tip": "mmshutdown with no node stops only this one",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "gpfs",
          "storage-scale",
          "mmchdisk",
          "mmshutdown",
          "mmstartup",
          "mmumount"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmchdisk-command",
              "title": "IBM Storage Scale 5.2.3: mmchdisk"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmshutdown-command",
              "title": "IBM Storage Scale 5.2.3: mmshutdown"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmstartup-command",
              "title": "IBM Storage Scale 5.2.3: mmstartup"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmumount-command",
              "title": "IBM Storage Scale 5.2.3: mmumount"
            }
          ],
          "note": "Before stopping the cluster manager node, move the role with mmchmgr."
        }
      },
      {
        "id": "scale-change-sub-1",
        "desc": "Stop GPFS on one node before hardware work (changes state)",
        "cmd": "mmshutdown -N <node>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmchdisk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmchdisk-command",
              "title": "IBM Storage Scale 5.2.3: mmchdisk"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmshutdown-command",
              "title": "IBM Storage Scale 5.2.3: mmshutdown"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmstartup-command",
              "title": "IBM Storage Scale 5.2.3: mmstartup"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmumount-command",
              "title": "IBM Storage Scale 5.2.3: mmumount"
            }
          ],
          "note": "Before stopping the cluster manager node, move the role with mmchmgr."
        }
      },
      {
        "id": "scale-change-sub-2",
        "desc": "Start GPFS on it again afterwards (changes state)",
        "cmd": "mmstartup -N <node>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmchdisk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmchdisk-command",
              "title": "IBM Storage Scale 5.2.3: mmchdisk"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmshutdown-command",
              "title": "IBM Storage Scale 5.2.3: mmshutdown"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmstartup-command",
              "title": "IBM Storage Scale 5.2.3: mmstartup"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmumount-command",
              "title": "IBM Storage Scale 5.2.3: mmumount"
            }
          ],
          "note": "Before stopping the cluster manager node, move the role with mmchmgr."
        }
      },
      {
        "id": "scale-change-sub-3",
        "desc": "Unmount the filesystem on one node (changes state)",
        "cmd": "mmumount <fs> -N <node>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "recipe",
          "gpfs",
          "storage-scale",
          "mmchdisk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmchdisk-command",
              "title": "IBM Storage Scale 5.2.3: mmchdisk"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmshutdown-command",
              "title": "IBM Storage Scale 5.2.3: mmshutdown"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmstartup-command",
              "title": "IBM Storage Scale 5.2.3: mmstartup"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmumount-command",
              "title": "IBM Storage Scale 5.2.3: mmumount"
            }
          ],
          "note": "Before stopping the cluster manager node, move the role with mmchmgr."
        }
      }
    ]
  },
  {
    "id": "pfs-scale-pro-tips",
    "badge": "tip",
    "title": "IBM Storage Scale: Pro Tip",
    "subtitle": "Hardware work on a Storage Scale node",
    "commands": [
      {
        "id": "pfs-scale-tips-card",
        "desc": "Hardware work on a Storage Scale node",
        "cmd": "mmgetstate -a -L",
        "details": "Check quorum first: if this node is a quorum node, make sure the rest keep quorum without it. Drain the node in the scheduler, mmshutdown -N <node>, do the work, mmstartup -N <node>, then confirm mmgetstate shows active, mmlsdisk <fs> -e is clean and mmhealth node show --unhealthy is empty.",
        "flags": [
          [
            "Quorum",
            "mmgetstate -a -L"
          ],
          [
            "After",
            "mmlsdisk -e and mmhealth --unhealthy"
          ]
        ],
        "tip": "Never take down enough quorum nodes to lose quorum",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-scale",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmgetstate-command",
              "title": "IBM Storage Scale 5.2.3: mmgetstate"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmshutdown-command",
              "title": "IBM Storage Scale 5.2.3: mmshutdown"
            },
            {
              "url": "https://www.ibm.com/docs/en/storage-scale/5.2.3?topic=reference-mmhealth-command",
              "title": "IBM Storage Scale 5.2.3: mmhealth"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("pfs-scale_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = PFS_PFS_SCALE_DATA;
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

  for (const card of PFS_PFS_SCALE_DATA) {
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
        localStorage.setItem("pfs-scale_bookmarks", JSON.stringify([...state.bookmarks]));
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
