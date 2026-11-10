// pfs-ceph.js
// Standalone interactive cheat sheet for Parallel filesystems: Ceph: Health, OSDs, Placement Groups & Devices
const PFS_PFS_CEPH_DATA = [
  {
    "id": "pfs-ceph-cmd-1",
    "badge": "ceph",
    "title": "Ceph: Cluster health at a glance, then the detail",
    "subtitle": "Cluster health at a glance, then the detail",
    "commands": [
      {
        "id": "ceph-status",
        "desc": "Cluster health at a glance, then the detail",
        "cmd": "ceph -s",
        "details": "",
        "flags": [
          [
            "HEALTH_OK / WARN / ERR",
            "The overall state; ceph health detail says why"
          ],
          [
            "ceph health detail",
            "Each health check with the OSDs and PG ids it concerns"
          ],
          [
            "ceph df",
            "Raw and per-pool usage"
          ]
        ],
        "tip": "HEALTH_WARN: read ceph health detail before acting",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "ceph",
          "status",
          "health"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/monitoring/",
              "title": "Ceph: monitoring a cluster"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/health-checks/",
              "title": "Ceph: health checks"
            }
          ]
        }
      },
      {
        "id": "ceph-status-sub-1",
        "desc": "Every warning and error with the OSDs and PGs involved",
        "cmd": "ceph health detail",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "status",
          "health"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/monitoring/",
              "title": "Ceph: monitoring a cluster"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/health-checks/",
              "title": "Ceph: health checks"
            }
          ]
        }
      },
      {
        "id": "ceph-status-sub-2",
        "desc": "Space per pool and raw capacity",
        "cmd": "ceph df",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "status",
          "health"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/monitoring/",
              "title": "Ceph: monitoring a cluster"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/health-checks/",
              "title": "Ceph: health checks"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-ceph-cmd-2",
    "badge": "ceph",
    "title": "Ceph: Every OSD by host, and which are down",
    "subtitle": "Every OSD by host, and which are down",
    "commands": [
      {
        "id": "ceph-osd-tree",
        "desc": "Every OSD by host, and which are down",
        "cmd": "ceph osd tree",
        "details": "",
        "flags": [
          [
            "up / down",
            "up: running and reachable; down: not running or not reachable"
          ],
          [
            "in / out",
            "in: holds data; a down OSD is marked out after mon_osd_down_out_interval (600 s) unless noout is set"
          ],
          [
            "ceph osd stat",
            "Totals: N osds, N up, N in"
          ]
        ],
        "tip": "Down but still in = data is degraded, not moving yet",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "ceph",
          "osd",
          "tree",
          "up",
          "down",
          "in",
          "out"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/control/",
              "title": "Ceph: control commands"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/",
              "title": "Ceph: monitoring OSDs and PGs"
            }
          ],
          "note": "ceph osd df tree is not in the current docs; ceph osd df <host> is."
        }
      },
      {
        "id": "ceph-osd-tree-sub-1",
        "desc": "How many OSDs are up and in",
        "cmd": "ceph osd stat",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "osd",
          "tree"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/control/",
              "title": "Ceph: control commands"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/",
              "title": "Ceph: monitoring OSDs and PGs"
            }
          ],
          "note": "ceph osd df tree is not in the current docs; ceph osd df <host> is."
        }
      },
      {
        "id": "ceph-osd-tree-sub-2",
        "desc": "Utilization of the OSDs on one host",
        "cmd": "ceph osd df <host>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "osd",
          "tree"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/control/",
              "title": "Ceph: control commands"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/",
              "title": "Ceph: monitoring OSDs and PGs"
            }
          ],
          "note": "ceph osd df tree is not in the current docs; ceph osd df <host> is."
        }
      }
    ]
  },
  {
    "id": "pfs-ceph-cmd-3",
    "badge": "ceph",
    "title": "Ceph: Placement group states, and inconsistent PGs after a scrub",
    "subtitle": "Placement group states, and inconsistent PGs after a scrub",
    "commands": [
      {
        "id": "ceph-pg",
        "desc": "Placement group states, and inconsistent PGs after a scrub",
        "cmd": "ceph pg stat",
        "details": "",
        "flags": [
          [
            "active+clean",
            "Healthy"
          ],
          [
            "degraded / undersized",
            "Fewer copies than wanted, usually after an OSD went down"
          ],
          [
            "backfilling / recovering",
            "Ceph is copying data back into place"
          ],
          [
            "inconsistent",
            "A scrub found copies that don't match: find them before repairing"
          ]
        ],
        "tip": "Inconsistent: find the bad copy (often a failing disk) before ceph pg repair",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "ceph",
          "pg",
          "degraded",
          "inconsistent",
          "scrub"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/",
              "title": "Ceph: monitoring OSDs and PGs"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/troubleshooting/troubleshooting-pg/",
              "title": "Ceph: troubleshooting PGs"
            }
          ]
        }
      },
      {
        "id": "ceph-pg-sub-1",
        "desc": "PG ids with inconsistencies in a pool",
        "cmd": "rados list-inconsistent-pg <pool>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "pg",
          "degraded"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/",
              "title": "Ceph: monitoring OSDs and PGs"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/troubleshooting/troubleshooting-pg/",
              "title": "Ceph: troubleshooting PGs"
            }
          ]
        }
      },
      {
        "id": "ceph-pg-sub-2",
        "desc": "Which objects, and which copy is bad",
        "cmd": "rados list-inconsistent-obj <pgid> --format=json-pretty",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "pg",
          "degraded"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/monitoring-osd-pg/",
              "title": "Ceph: monitoring OSDs and PGs"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/troubleshooting/troubleshooting-pg/",
              "title": "Ceph: troubleshooting PGs"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-ceph-cmd-4",
    "badge": "ceph",
    "title": "Ceph: Which physical disk is behind each OSD on a host",
    "subtitle": "Which physical disk is behind each OSD on a host",
    "commands": [
      {
        "id": "ceph-devices",
        "desc": "Which physical disk is behind each OSD on a host",
        "cmd": "ceph device ls-by-host <host>",
        "details": "",
        "flags": [
          [
            "Each line",
            "A device on that host and the OSD daemon(s) using it"
          ],
          [
            "ceph device info <devid>",
            "Everything Ceph knows about one device"
          ],
          [
            "ceph device ls",
            "Every device in the cluster"
          ]
        ],
        "tip": "Match the serial in the device id to the drive label",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "ceph",
          "device",
          "osd",
          "disk",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/devices/",
              "title": "Ceph: device management"
            }
          ]
        }
      },
      {
        "id": "ceph-devices-sub-1",
        "desc": "One device in detail",
        "cmd": "ceph device info <devid>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "device",
          "osd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/devices/",
              "title": "Ceph: device management"
            }
          ]
        }
      },
      {
        "id": "ceph-devices-sub-2",
        "desc": "All devices and their daemons",
        "cmd": "ceph device ls",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "device",
          "osd"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/devices/",
              "title": "Ceph: device management"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-ceph-cmd-5",
    "badge": "ceph",
    "title": "Ceph: Before maintenance",
    "subtitle": "Before maintenance: stop Ceph re-balancing while OSDs are down (changes state: ask first)",
    "commands": [
      {
        "id": "ceph-noout",
        "desc": "Before maintenance: stop Ceph re-balancing while OSDs are down (changes state: ask first)",
        "cmd": "ceph osd set noout",
        "details": "",
        "flags": [
          [
            "noout",
            "Down OSDs are not marked out, so no data moves while you work"
          ],
          [
            "Cluster-wide",
            "Affects every OSD: unset it as soon as the work is done"
          ],
          [
            "ceph osd out <id>",
            "Takes an OSD out on purpose: data starts migrating off it"
          ]
        ],
        "tip": "Set noout → work → unset noout",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "ceph",
          "noout",
          "maintenance",
          "osd",
          "out"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/health-checks/",
              "title": "Ceph: health checks (OSDMAP_FLAGS)"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/control/",
              "title": "Ceph: control commands"
            }
          ]
        }
      },
      {
        "id": "ceph-noout-sub-1",
        "desc": "After the work: let Ceph mark failed OSDs out again (changes state)",
        "cmd": "ceph osd unset noout",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "noout",
          "maintenance"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/health-checks/",
              "title": "Ceph: health checks (OSDMAP_FLAGS)"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/control/",
              "title": "Ceph: control commands"
            }
          ]
        }
      },
      {
        "id": "ceph-noout-sub-2",
        "desc": "Drain data off one OSD before replacing its disk (changes state)",
        "cmd": "ceph osd out <osd-id>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "noout",
          "maintenance"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/health-checks/",
              "title": "Ceph: health checks (OSDMAP_FLAGS)"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/control/",
              "title": "Ceph: control commands"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-ceph-cmd-6",
    "badge": "ceph",
    "title": "Ceph: cephadm",
    "subtitle": "cephadm: every daemon, host and device the orchestrator manages",
    "commands": [
      {
        "id": "ceph-orch",
        "desc": "cephadm: every daemon, host and device the orchestrator manages",
        "cmd": "ceph orch ps",
        "details": "",
        "flags": [
          [
            "orch ps",
            "Every daemon (mon, mgr, osd…) with its host and status"
          ],
          [
            "orch host ls",
            "Hosts and their status"
          ],
          [
            "cephadm shell",
            "A shell with the Ceph tools on a host that has no client installed"
          ]
        ],
        "tip": "No ceph CLI on the host? cephadm shell",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "ceph",
          "cephadm",
          "orch",
          "daemons"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/operations/",
              "title": "Ceph: cephadm operations"
            },
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/host-management/",
              "title": "Ceph: cephadm host management"
            },
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/install/",
              "title": "Ceph: cephadm install"
            }
          ]
        }
      },
      {
        "id": "ceph-orch-sub-1",
        "desc": "Hosts in the cluster",
        "cmd": "ceph orch host ls",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "cephadm",
          "orch"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/operations/",
              "title": "Ceph: cephadm operations"
            },
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/host-management/",
              "title": "Ceph: cephadm host management"
            },
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/install/",
              "title": "Ceph: cephadm install"
            }
          ]
        }
      },
      {
        "id": "ceph-orch-sub-2",
        "desc": "Disks on each host, and whether they are available",
        "cmd": "ceph orch device ls",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "cephadm",
          "orch"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/operations/",
              "title": "Ceph: cephadm operations"
            },
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/host-management/",
              "title": "Ceph: cephadm host management"
            },
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/install/",
              "title": "Ceph: cephadm install"
            }
          ]
        }
      },
      {
        "id": "ceph-orch-sub-3",
        "desc": "Run one ceph command through cephadm",
        "cmd": "cephadm shell -- ceph -s",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "cephadm",
          "orch"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/operations/",
              "title": "Ceph: cephadm operations"
            },
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/host-management/",
              "title": "Ceph: cephadm host management"
            },
            {
              "url": "https://docs.ceph.com/en/latest/cephadm/install/",
              "title": "Ceph: cephadm install"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-ceph-cmd-7",
    "badge": "ceph",
    "title": "Ceph: Daemon crash reports",
    "subtitle": "Daemon crash reports",
    "commands": [
      {
        "id": "ceph-crash",
        "desc": "Daemon crash reports",
        "cmd": "ceph crash ls-new",
        "details": "",
        "flags": [
          [
            "ls-new",
            "Crashes nobody has archived yet (these raise RECENT_CRASH)"
          ],
          [
            "info <id>",
            "The full report: daemon, version, backtrace"
          ],
          [
            "archive-all",
            "Acknowledge them all; they stay in ceph crash ls (changes state)"
          ]
        ],
        "tip": "Put the backtrace in the ticket before archiving",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "ceph",
          "crash",
          "mgr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/mgr/crash/",
              "title": "Ceph: crash module"
            }
          ]
        }
      },
      {
        "id": "ceph-crash-sub-1",
        "desc": "One crash in detail",
        "cmd": "ceph crash info <crashid>",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "crash",
          "mgr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/mgr/crash/",
              "title": "Ceph: crash module"
            }
          ]
        }
      },
      {
        "id": "ceph-crash-sub-2",
        "desc": "Archive every new crash once it is in the ticket (changes state)",
        "cmd": "ceph crash archive-all",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "recipe",
          "ceph",
          "crash",
          "mgr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/mgr/crash/",
              "title": "Ceph: crash module"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "pfs-ceph-pro-tips",
    "badge": "tip",
    "title": "Ceph: Pro Tip",
    "subtitle": "Replacing a disk under a Ceph OSD",
    "commands": [
      {
        "id": "pfs-ceph-tips-card",
        "desc": "Replacing a disk under a Ceph OSD",
        "cmd": "ceph device ls-by-host <host>",
        "details": "Find the OSD and the serial of its disk, check ceph -s and ceph health detail, get approval, set noout for a short swap (or take the OSD out to drain it first), replace the disk, let Ceph backfill, and unset noout. Watch PGs go back to active+clean.",
        "flags": [
          [
            "Short swap",
            "noout"
          ],
          [
            "Long or failed disk",
            "ceph osd out <id> and let it drain"
          ]
        ],
        "tip": "Serial first, then the drive",
        "tags": [
          "storage",
          "filesystem",
          "pfs",
          "pfs-ceph",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/devices/",
              "title": "Ceph: device management"
            },
            {
              "url": "https://docs.ceph.com/en/latest/rados/operations/control/",
              "title": "Ceph: control commands"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("pfs-ceph_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = PFS_PFS_CEPH_DATA;
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

  for (const card of PFS_PFS_CEPH_DATA) {
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
        localStorage.setItem("pfs-ceph_bookmarks", JSON.stringify([...state.bookmarks]));
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
