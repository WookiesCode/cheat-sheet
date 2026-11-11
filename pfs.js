// pfs.js
// Standalone interactive cheat sheet for Parallel filesystems: Parallel Filesystems Hub (Lustre, WEKA, BeeGFS, Storage Scale, Ceph)
const PFS_HUB_DATA = [
  {
    "part": "pfs-lustre",
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
    "part": "pfs-lustre",
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
    "part": "pfs-lustre",
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
    "part": "pfs-lustre",
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
    "part": "pfs-lustre",
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
    "part": "pfs-lustre",
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
    "part": "pfs-lustre",
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
  },
  {
    "part": "pfs-weka",
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
    "part": "pfs-weka",
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
    "part": "pfs-weka",
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
    "part": "pfs-weka",
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
    "part": "pfs-weka",
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
    "part": "pfs-weka",
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
    "part": "pfs-weka",
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
  },
  {
    "part": "pfs-beegfs",
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
    "part": "pfs-beegfs",
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
    "part": "pfs-beegfs",
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
    "part": "pfs-beegfs",
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
    "part": "pfs-beegfs",
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
    "part": "pfs-beegfs",
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
  },
  {
    "part": "pfs-scale",
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
    "part": "pfs-scale",
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
    "part": "pfs-scale",
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
    "part": "pfs-scale",
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
    "part": "pfs-scale",
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
    "part": "pfs-scale",
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
  },
  {
    "part": "pfs-ceph",
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
    "part": "pfs-ceph",
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
    "part": "pfs-ceph",
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
    "part": "pfs-ceph",
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
    "part": "pfs-ceph",
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
    "part": "pfs-ceph",
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
    "part": "pfs-ceph",
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
    "part": "pfs-ceph",
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
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("pfs.html", "pfs_bookmarks", PFS_HUB_DATA, {"pfs-lustre":"pfs-lustre_bookmarks","pfs-weka":"pfs-weka_bookmarks","pfs-beegfs":"pfs-beegfs_bookmarks","pfs-scale":"pfs-scale_bookmarks","pfs-ceph":"pfs-ceph_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("pfs_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(PFS_HUB_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: PFS_HUB_DATA, label: "Parallel filesystems sheets", parts: {
   "pfs-beegfs": {
    "title": "BeeGFS",
    "subtitle": "BeeGFS 8 uses one beegfs command; each card also gives the BeeGFS 7.4 command for older clusters",
    "pill": "BeeGFS 8.4 · 7.4 recipes"
   },
   "pfs-ceph": {
    "title": "Ceph",
    "subtitle": "Cluster health, which OSD is down and on which disk, PG states, crash reports, and setting noout for maintenance",
    "pill": "Ceph 21.2 Umbrella · 20.2 · 19.2"
   },
   "pfs-lustre": {
    "title": "Lustre",
    "subtitle": "From a client: are the MDS and OSS reachable, which OST is full or missing, is LNet up, and how a file is striped",
    "pill": "Lustre 2.17 · 2.15 LTS"
   },
   "pfs-scale": {
    "title": "IBM Storage Scale",
    "subtitle": "Is GPFS active on every node, what mmhealth flags, which disk is down, which device is behind an NSD, and the commands that change state",
    "pill": "Storage Scale 5.2 · 6.0 (GPFS)"
   },
   "pfs-weka": {
    "title": "WEKA",
    "subtitle": "Cluster health and rebuild, active alerts, which container or drive is down, local status, and the client mount",
    "pill": "WEKA 6.0 CLI"
   }
  } };


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
  const allCards = PFS_HUB_DATA;
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

  for (const card of PFS_HUB_DATA) {
    if (((state.activeCategory !== "all" && state.activeCategory !== card.id) || (state.part && (card.part || card.id) !== state.part))) {
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
        localStorage.setItem("pfs_bookmarks", JSON.stringify([...state.bookmarks]));
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
