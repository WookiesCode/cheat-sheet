// bmc-tools.js
// Standalone interactive cheat sheet for BMC vendor tools: BMC Vendor Tools Hub (racadm, iLOrest, SAA, OneCLI, FreeIPMI, serial)
const BMC_HUB_DATA = [
  {
    "part": "racadm",
    "id": "racadm-cmd-1",
    "badge": "racadm",
    "title": "Dell racadm: System and iDRAC summary, remote or in-band",
    "subtitle": "System and iDRAC summary, remote or in-band",
    "commands": [
      {
        "id": "racadm-getsysinfo",
        "desc": "System and iDRAC summary, remote or in-band",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" getsysinfo",
        "details": "",
        "flags": [
          [
            "-r -u -p",
            "Remote RACADM: iDRAC address, user, password. The guide documents no password prompt or env var, so keep the password in a variable, never typed inline"
          ],
          [
            "(no -r)",
            "Local RACADM on the host itself (racadm getsysinfo): no network password at all"
          ],
          [
            "--nocertwarn",
            "Add at the end to skip the self-signed certificate warning"
          ],
          [
            "-d / -c / -4 / -6",
            "Only iDRAC info / common settings / IPv4 / IPv6"
          ],
          [
            "-A",
            "No headers, easier to parse"
          ],
          [
            "Hostname and OS fields",
            "Only accurate when OpenManage Server Administrator is installed on the host"
          ]
        ],
        "tip": "-p shows up in ps; on a shared jumpbox, run racadm in-band or over SSH to the iDRAC",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "dell",
          "idrac",
          "sysinfo",
          "version",
          "sensors",
          "service-tag"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/remote-racadm?guid=guid-7b78457f-c280-4d99-a17e-73d0929409bc&lang=en-us",
              "title": "Dell RACADM 7.xx: remote RACADM"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsysinfo?guid=guid-1e0a055a-f2a9-4daf-a12c-44bc7dbd1a30&lang=en-us",
              "title": "Dell RACADM 7.xx: getsysinfo"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getversion?guid=guid-70acf03a-0937-4ec8-be57-277e7ce6ca7c&lang=en-us",
              "title": "Dell RACADM 7.xx: getversion"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsensorinfo?guid=guid-a0d65099-56ce-460b-baef-18ff746ffd02&lang=en-us",
              "title": "Dell RACADM 7.xx: getsensorinfo"
            }
          ],
          "note": "The guide documents no password prompt or environment variable for remote RACADM."
        }
      },
      {
        "id": "racadm-getsysinfo-sub-1",
        "desc": "Common settings only",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" getsysinfo -c",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "dell",
          "idrac",
          "sysinfo"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/remote-racadm?guid=guid-7b78457f-c280-4d99-a17e-73d0929409bc&lang=en-us",
              "title": "Dell RACADM 7.xx: remote RACADM"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsysinfo?guid=guid-1e0a055a-f2a9-4daf-a12c-44bc7dbd1a30&lang=en-us",
              "title": "Dell RACADM 7.xx: getsysinfo"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getversion?guid=guid-70acf03a-0937-4ec8-be57-277e7ce6ca7c&lang=en-us",
              "title": "Dell RACADM 7.xx: getversion"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsensorinfo?guid=guid-a0d65099-56ce-460b-baef-18ff746ffd02&lang=en-us",
              "title": "Dell RACADM 7.xx: getsensorinfo"
            }
          ],
          "note": "The guide documents no password prompt or environment variable for remote RACADM."
        }
      },
      {
        "id": "racadm-getsysinfo-sub-2",
        "desc": "BIOS, iDRAC and Lifecycle Controller versions",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" getversion",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "dell",
          "idrac",
          "sysinfo"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/remote-racadm?guid=guid-7b78457f-c280-4d99-a17e-73d0929409bc&lang=en-us",
              "title": "Dell RACADM 7.xx: remote RACADM"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsysinfo?guid=guid-1e0a055a-f2a9-4daf-a12c-44bc7dbd1a30&lang=en-us",
              "title": "Dell RACADM 7.xx: getsysinfo"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getversion?guid=guid-70acf03a-0937-4ec8-be57-277e7ce6ca7c&lang=en-us",
              "title": "Dell RACADM 7.xx: getversion"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsensorinfo?guid=guid-a0d65099-56ce-460b-baef-18ff746ffd02&lang=en-us",
              "title": "Dell RACADM 7.xx: getsensorinfo"
            }
          ],
          "note": "The guide documents no password prompt or environment variable for remote RACADM."
        }
      },
      {
        "id": "racadm-getsysinfo-sub-3",
        "desc": "One component: bios, idrac, lc or idsdm",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" getversion -f bios",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "dell",
          "idrac",
          "sysinfo"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/remote-racadm?guid=guid-7b78457f-c280-4d99-a17e-73d0929409bc&lang=en-us",
              "title": "Dell RACADM 7.xx: remote RACADM"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsysinfo?guid=guid-1e0a055a-f2a9-4daf-a12c-44bc7dbd1a30&lang=en-us",
              "title": "Dell RACADM 7.xx: getsysinfo"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getversion?guid=guid-70acf03a-0937-4ec8-be57-277e7ce6ca7c&lang=en-us",
              "title": "Dell RACADM 7.xx: getversion"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsensorinfo?guid=guid-a0d65099-56ce-460b-baef-18ff746ffd02&lang=en-us",
              "title": "Dell RACADM 7.xx: getsensorinfo"
            }
          ],
          "note": "The guide documents no password prompt or environment variable for remote RACADM."
        }
      },
      {
        "id": "racadm-getsysinfo-sub-4",
        "desc": "Every sensor, compact, grouped by type (power, temp, fan, voltage)",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" getsensorinfo -c",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "dell",
          "idrac",
          "sysinfo"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/remote-racadm?guid=guid-7b78457f-c280-4d99-a17e-73d0929409bc&lang=en-us",
              "title": "Dell RACADM 7.xx: remote RACADM"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsysinfo?guid=guid-1e0a055a-f2a9-4daf-a12c-44bc7dbd1a30&lang=en-us",
              "title": "Dell RACADM 7.xx: getsysinfo"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getversion?guid=guid-70acf03a-0937-4ec8-be57-277e7ce6ca7c&lang=en-us",
              "title": "Dell RACADM 7.xx: getversion"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsensorinfo?guid=guid-a0d65099-56ce-460b-baef-18ff746ffd02&lang=en-us",
              "title": "Dell RACADM 7.xx: getsensorinfo"
            }
          ],
          "note": "The guide documents no password prompt or environment variable for remote RACADM."
        }
      }
    ]
  },
  {
    "part": "racadm",
    "id": "racadm-cmd-2",
    "badge": "racadm",
    "title": "Dell racadm: Lifecycle log, filtered to storage and system warnings",
    "subtitle": "Lifecycle log, filtered to storage and system warnings",
    "commands": [
      {
        "id": "racadm-lclog",
        "desc": "Lifecycle log, filtered to storage and system warnings",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" lclog view -c storage,system -s warning,critical -n 50",
        "details": "",
        "flags": [
          [
            "-c",
            "Category, comma-separated: System, Storage, Worknotes, Config, Updates, Audit"
          ],
          [
            "-s",
            "Severity, comma-separated: Warning, Critical, Info"
          ],
          [
            "-n",
            "Number of records (local RACADM returns 100 if you leave it out)"
          ],
          [
            "-q <seq>",
            "Start at a sequence number: lclog view -q 20 -n 5"
          ],
          [
            "-r / -e \"yyyy-mm-dd HH:MM:SS\"",
            "Start and end time, in double quotes"
          ],
          [
            "-a <agent>",
            "One agent only, for example iDRAC, SEL or RACADM"
          ]
        ],
        "tip": "The Lifecycle log has more than the SEL: config changes, updates, and storage events",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "lclog",
          "sel",
          "logs",
          "events",
          "storage",
          "audit"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/lclog?guid=guid-8ac7dcaa-5d30-4eb6-93e9-b58b388b4d49&lang=en-us",
              "title": "Dell RACADM 7.xx: lclog"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsel?guid=guid-d7c7d4e2-eb61-4c84-a26e-5f2c8e05ba98&lang=en-us",
              "title": "Dell RACADM 7.xx: getsel"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/clrsel?guid=guid-101112ea-7ad1-4a51-8e26-0933aff51503&lang=en-us",
              "title": "Dell RACADM 7.xx: clrsel"
            }
          ],
          "note": "The \"100 records without -n\" default is not in the 7.xx guide text read."
        }
      },
      {
        "id": "racadm-lclog-sub-1",
        "desc": "How many SEL entries there are",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" getsel -i",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "lclog",
          "sel",
          "logs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/lclog?guid=guid-8ac7dcaa-5d30-4eb6-93e9-b58b388b4d49&lang=en-us",
              "title": "Dell RACADM 7.xx: lclog"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsel?guid=guid-d7c7d4e2-eb61-4c84-a26e-5f2c8e05ba98&lang=en-us",
              "title": "Dell RACADM 7.xx: getsel"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/clrsel?guid=guid-101112ea-7ad1-4a51-8e26-0933aff51503&lang=en-us",
              "title": "Dell RACADM 7.xx: clrsel"
            }
          ],
          "note": "The \"100 records without -n\" default is not in the 7.xx guide text read."
        }
      },
      {
        "id": "racadm-lclog-sub-2",
        "desc": "First 25 SEL records, one per line",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" getsel -s 1 -c 25 -o",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "lclog",
          "sel",
          "logs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/lclog?guid=guid-8ac7dcaa-5d30-4eb6-93e9-b58b388b4d49&lang=en-us",
              "title": "Dell RACADM 7.xx: lclog"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsel?guid=guid-d7c7d4e2-eb61-4c84-a26e-5f2c8e05ba98&lang=en-us",
              "title": "Dell RACADM 7.xx: getsel"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/clrsel?guid=guid-101112ea-7ad1-4a51-8e26-0933aff51503&lang=en-us",
              "title": "Dell RACADM 7.xx: clrsel"
            }
          ],
          "note": "The \"100 records without -n\" default is not in the 7.xx guide text read."
        }
      },
      {
        "id": "racadm-lclog-sub-3",
        "desc": "Clear the SEL (changes state; save it to the case first)",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" clrsel",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "lclog",
          "sel",
          "logs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/lclog?guid=guid-8ac7dcaa-5d30-4eb6-93e9-b58b388b4d49&lang=en-us",
              "title": "Dell RACADM 7.xx: lclog"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/getsel?guid=guid-d7c7d4e2-eb61-4c84-a26e-5f2c8e05ba98&lang=en-us",
              "title": "Dell RACADM 7.xx: getsel"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/clrsel?guid=guid-101112ea-7ad1-4a51-8e26-0933aff51503&lang=en-us",
              "title": "Dell RACADM 7.xx: clrsel"
            }
          ],
          "note": "The \"100 records without -n\" default is not in the 7.xx guide text read."
        }
      }
    ]
  },
  {
    "part": "racadm",
    "id": "racadm-cmd-3",
    "badge": "racadm",
    "title": "Dell racadm: Hardware inventory",
    "subtitle": "Hardware inventory: every component with FQDDs",
    "commands": [
      {
        "id": "racadm-hwinventory",
        "desc": "Hardware inventory: every component with FQDDs",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" hwinventory",
        "details": "",
        "flags": [
          [
            "hwinventory networktransceiver",
            "Optics and DACs seen by the NICs"
          ],
          [
            "hwinventory NIC|FC|Infiniband",
            "One class of adapters"
          ],
          [
            "hwinventory <FQDD>",
            "One device, for example NIC.Integrated.1-1 (NIC, InfiniBand and FC only)"
          ],
          [
            "FQDD",
            "Fully Qualified Device Descriptor: Dell's stable name for a part (RAID.Integrated.1-1, NIC.Slot.3-1). Use it in RMA tickets"
          ]
        ],
        "tip": "iDRAC allows at most 12 parallel hardware-inventory sessions",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "inventory",
          "fqdd",
          "nic",
          "transceiver",
          "serial",
          "rma"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/hwinventory?guid=guid-ce4113d2-9f80-4682-8b89-5f6f97d6ff55&lang=en-us",
              "title": "Dell RACADM 7.xx: hwinventory"
            }
          ]
        }
      },
      {
        "id": "racadm-hwinventory-sub-1",
        "desc": "Transceiver part and serial numbers",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" hwinventory networktransceiver",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "inventory",
          "fqdd",
          "nic"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/hwinventory?guid=guid-ce4113d2-9f80-4682-8b89-5f6f97d6ff55&lang=en-us",
              "title": "Dell RACADM 7.xx: hwinventory"
            }
          ]
        }
      },
      {
        "id": "racadm-hwinventory-sub-2",
        "desc": "InfiniBand adapters only",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" hwinventory Infiniband",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "inventory",
          "fqdd",
          "nic"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/hwinventory?guid=guid-ce4113d2-9f80-4682-8b89-5f6f97d6ff55&lang=en-us",
              "title": "Dell RACADM 7.xx: hwinventory"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "racadm",
    "id": "racadm-cmd-4",
    "badge": "racadm",
    "title": "Dell racadm: RAID controllers, physical and virtual disks",
    "subtitle": "RAID controllers, physical and virtual disks",
    "commands": [
      {
        "id": "racadm-storage",
        "desc": "RAID controllers, physical and virtual disks",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" storage get controllers -o",
        "details": "",
        "flags": [
          [
            "storage get controllers -o",
            "Controllers with their properties"
          ],
          [
            "storage get pdisks -o",
            "Physical disks; add -p <props> to pick columns (up to the names shown by -o)"
          ],
          [
            "storage get vdisks --refkey <ctrl FQDD> -o",
            "Virtual disks on one controller"
          ],
          [
            "storage get pdisks:<PD FQDD>",
            "One disk"
          ],
          [
            "storage get status",
            "Overall storage status"
          ],
          [
            "raid",
            "The guide says raid can be used in place of storage"
          ]
        ],
        "tip": "Run -o once to learn the property names, then use -p for a short table",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "storage",
          "raid",
          "pdisk",
          "vdisk",
          "perc",
          "disk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/storage?guid=guid-ddeb9619-85cc-4f1e-b4f9-c69babb518e0&lang=en-us",
              "title": "Dell RACADM 7.xx: storage"
            }
          ]
        }
      },
      {
        "id": "racadm-storage-sub-1",
        "desc": "Every physical disk with state and slot",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" storage get pdisks -o",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "storage",
          "raid",
          "pdisk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/storage?guid=guid-ddeb9619-85cc-4f1e-b4f9-c69babb518e0&lang=en-us",
              "title": "Dell RACADM 7.xx: storage"
            }
          ]
        }
      },
      {
        "id": "racadm-storage-sub-2",
        "desc": "Virtual disks on the integrated controller",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" storage get vdisks --refkey RAID.Integrated.1-1 -o",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "storage",
          "raid",
          "pdisk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/storage?guid=guid-ddeb9619-85cc-4f1e-b4f9-c69babb518e0&lang=en-us",
              "title": "Dell RACADM 7.xx: storage"
            }
          ]
        }
      },
      {
        "id": "racadm-storage-sub-3",
        "desc": "Quick storage health",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" storage get status",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "storage",
          "raid",
          "pdisk"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/storage?guid=guid-ddeb9619-85cc-4f1e-b4f9-c69babb518e0&lang=en-us",
              "title": "Dell RACADM 7.xx: storage"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "racadm",
    "id": "racadm-cmd-5",
    "badge": "racadm",
    "title": "Dell racadm: Power state, and power actions after a drain",
    "subtitle": "Power state, and power actions after a drain",
    "commands": [
      {
        "id": "racadm-serveraction",
        "desc": "Power state, and power actions after a drain",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" serveraction powerstatus",
        "details": "",
        "flags": [
          [
            "powerstatus",
            "Read-only: Server Power Status: ON / OFF"
          ],
          [
            "graceshutdown",
            "Ask the OS to shut down (changes state)"
          ],
          [
            "powerdown / powerup",
            "Hard off / on (changes state)"
          ],
          [
            "powercycle",
            "Off then on (changes state)"
          ],
          [
            "Before any of them",
            "Drain the node in Slurm or Kubernetes and get approval"
          ]
        ],
        "tip": "Prefer graceshutdown; powercycle skips the OS",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "power",
          "serveraction",
          "powercycle",
          "shutdown",
          "racreset"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/serveraction?guid=guid-16197034-e2a3-4174-a96d-7dae9afd66aa&lang=en-us",
              "title": "Dell RACADM 7.xx: serveraction"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/racreset?guid=guid-a5b943ea-b4b5-415a-bd3c-09a02dfed465&lang=en-us",
              "title": "Dell RACADM 7.xx: racreset"
            }
          ]
        }
      },
      {
        "id": "racadm-serveraction-sub-1",
        "desc": "Clean OS shutdown (changes state)",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" serveraction graceshutdown",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "power",
          "serveraction",
          "powercycle"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/serveraction?guid=guid-16197034-e2a3-4174-a96d-7dae9afd66aa&lang=en-us",
              "title": "Dell RACADM 7.xx: serveraction"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/racreset?guid=guid-a5b943ea-b4b5-415a-bd3c-09a02dfed465&lang=en-us",
              "title": "Dell RACADM 7.xx: racreset"
            }
          ]
        }
      },
      {
        "id": "racadm-serveraction-sub-2",
        "desc": "Power cycle (changes state)",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" serveraction powercycle",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "power",
          "serveraction",
          "powercycle"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/serveraction?guid=guid-16197034-e2a3-4174-a96d-7dae9afd66aa&lang=en-us",
              "title": "Dell RACADM 7.xx: serveraction"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/racreset?guid=guid-a5b943ea-b4b5-415a-bd3c-09a02dfed465&lang=en-us",
              "title": "Dell RACADM 7.xx: racreset"
            }
          ]
        }
      },
      {
        "id": "racadm-serveraction-sub-3",
        "desc": "Restart the iDRAC itself; up to 2 minutes unreachable (changes state)",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" racreset",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "power",
          "serveraction",
          "powercycle"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/serveraction?guid=guid-16197034-e2a3-4174-a96d-7dae9afd66aa&lang=en-us",
              "title": "Dell RACADM 7.xx: serveraction"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/racreset?guid=guid-a5b943ea-b4b5-415a-bd3c-09a02dfed465&lang=en-us",
              "title": "Dell RACADM 7.xx: racreset"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "racadm",
    "id": "racadm-cmd-6",
    "badge": "racadm",
    "title": "Dell racadm: Read and change attributes; BIOS changes need a job",
    "subtitle": "Read and change attributes; BIOS changes need a job",
    "commands": [
      {
        "id": "racadm-get-set-job",
        "desc": "Read and change attributes; BIOS changes need a job",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" get system.location.rack.name",
        "details": "",
        "flags": [
          [
            "get <alias>.<group>[.<object>]",
            "Read one attribute or a whole group"
          ],
          [
            "set <alias>.<group>.<object> <value>",
            "Change it (changes state)"
          ],
          [
            "Staged vs immediate",
            "iDRAC attributes apply at once; BIOS, NIC and most RAID changes are staged until a job runs at reboot"
          ],
          [
            "jobqueue create <FQDD> -r <type> -s TIME_NOW",
            "Schedule the staged change. Reboot types: none, pwrcycle, graceful, forced"
          ],
          [
            "jobqueue view [-i <JID>]",
            "All jobs, or one job's status"
          ],
          [
            "jobqueue delete -i JID_CLEARALL",
            "Force-delete every job in the queue (changes state)"
          ]
        ],
        "tip": "A set that seems to do nothing is usually a staged change waiting for its job",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "get",
          "set",
          "bios",
          "jobqueue",
          "job",
          "attributes"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/get?guid=guid-7c7f809b-3618-4fc8-9d39-f52694220f6f&lang=en-us",
              "title": "Dell RACADM 7.xx: get"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/set?guid=guid-799c4585-0d9f-4e27-8c79-38525e9d5643&lang=en-us",
              "title": "Dell RACADM 7.xx: set"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/jobqueue?guid=guid-a57b0f48-1ebe-4cbe-9681-458e3348301d&lang=en-us",
              "title": "Dell RACADM 7.xx: jobqueue"
            }
          ]
        }
      },
      {
        "id": "racadm-get-set-job-sub-1",
        "desc": "Pending and finished jobs",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" jobqueue view",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "get",
          "set",
          "bios"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/get?guid=guid-7c7f809b-3618-4fc8-9d39-f52694220f6f&lang=en-us",
              "title": "Dell RACADM 7.xx: get"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/set?guid=guid-799c4585-0d9f-4e27-8c79-38525e9d5643&lang=en-us",
              "title": "Dell RACADM 7.xx: set"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/jobqueue?guid=guid-a57b0f48-1ebe-4cbe-9681-458e3348301d&lang=en-us",
              "title": "Dell RACADM 7.xx: jobqueue"
            }
          ]
        }
      },
      {
        "id": "racadm-get-set-job-sub-2",
        "desc": "Apply staged BIOS changes with a graceful reboot (changes state)",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" jobqueue create BIOS.Setup.1-1 -r graceful -s TIME_NOW",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "get",
          "set",
          "bios"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/get?guid=guid-7c7f809b-3618-4fc8-9d39-f52694220f6f&lang=en-us",
              "title": "Dell RACADM 7.xx: get"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/set?guid=guid-799c4585-0d9f-4e27-8c79-38525e9d5643&lang=en-us",
              "title": "Dell RACADM 7.xx: set"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/jobqueue?guid=guid-a57b0f48-1ebe-4cbe-9681-458e3348301d&lang=en-us",
              "title": "Dell RACADM 7.xx: jobqueue"
            }
          ]
        }
      },
      {
        "id": "racadm-get-set-job-sub-3",
        "desc": "Clear a stuck job queue (changes state)",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" jobqueue delete -i JID_CLEARALL",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "get",
          "set",
          "bios"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/get?guid=guid-7c7f809b-3618-4fc8-9d39-f52694220f6f&lang=en-us",
              "title": "Dell RACADM 7.xx: get"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/set?guid=guid-799c4585-0d9f-4e27-8c79-38525e9d5643&lang=en-us",
              "title": "Dell RACADM 7.xx: set"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/jobqueue?guid=guid-a57b0f48-1ebe-4cbe-9681-458e3348301d&lang=en-us",
              "title": "Dell RACADM 7.xx: jobqueue"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "racadm",
    "id": "racadm-cmd-7",
    "badge": "racadm",
    "title": "Dell racadm: Export the whole server configuration",
    "subtitle": "Export the whole server configuration (SCP) to a share",
    "commands": [
      {
        "id": "racadm-scp",
        "desc": "Export the whole server configuration (SCP) to a share",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" get -f server-config.xml -t xml -l 192.0.2.50:/exports/scp",
        "details": "",
        "flags": [
          [
            "get -f -t xml|json -l <share>",
            "Server Configuration Profile: BIOS, iDRAC, NIC and RAID settings in one file"
          ],
          [
            "--clone / --replace",
            "Export for cloning to another server, or for a full replace"
          ],
          [
            "set -f ... --preview",
            "Validate a profile and get a job ID without rebooting"
          ],
          [
            "set -f ... -b graceful|forced|NoReboot -w <sec>",
            "Import with a reboot policy (changes state)"
          ]
        ],
        "tip": "Export before and after a change, then diff the two files",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "scp",
          "export",
          "config",
          "clone",
          "backup"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/get?guid=guid-7c7f809b-3618-4fc8-9d39-f52694220f6f&lang=en-us",
              "title": "Dell RACADM 7.xx: get"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/set?guid=guid-799c4585-0d9f-4e27-8c79-38525e9d5643&lang=en-us",
              "title": "Dell RACADM 7.xx: set"
            }
          ],
          "note": "set -f -w accepts 300–3600 seconds (default 1800); -b and -w do not combine with --preview."
        }
      },
      {
        "id": "racadm-scp-sub-1",
        "desc": "Dry-run an import",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" set -f server-config.xml -t xml -l 192.0.2.50:/exports/scp --preview",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "scp",
          "export",
          "config"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/get?guid=guid-7c7f809b-3618-4fc8-9d39-f52694220f6f&lang=en-us",
              "title": "Dell RACADM 7.xx: get"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/set?guid=guid-799c4585-0d9f-4e27-8c79-38525e9d5643&lang=en-us",
              "title": "Dell RACADM 7.xx: set"
            }
          ],
          "note": "set -f -w accepts 300–3600 seconds (default 1800); -b and -w do not combine with --preview."
        }
      }
    ]
  },
  {
    "part": "racadm",
    "id": "racadm-cmd-8",
    "badge": "racadm",
    "title": "Dell racadm: SupportAssist collection",
    "subtitle": "SupportAssist collection (formerly TSR) for Dell support",
    "commands": [
      {
        "id": "racadm-tsr",
        "desc": "SupportAssist collection (formerly TSR) for Dell support",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" techsupreport collect -t SysInfo,TTYLog",
        "details": "",
        "flags": [
          [
            "collect -t",
            "SysInfo (default), OSAppNoPII, OSAppAll, TTYLog. Returns a job ID"
          ],
          [
            "export -f <name>.zip",
            "Save the collection locally (must end in .zip)"
          ],
          [
            "export -l <share> -u -p",
            "Or push it to a CIFS, NFS, TFTP or FTP share"
          ]
        ],
        "tip": "Attach the SupportAssist zip to every Dell RMA: it is what they ask for first",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "tsr",
          "supportassist",
          "rma",
          "logs",
          "collect"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/techsupreport?guid=guid-168e5beb-9a71-4d37-af2a-04b73ec11a99&lang=en-us",
              "title": "Dell RACADM 7.xx: techsupreport"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/jobqueue?guid=guid-a57b0f48-1ebe-4cbe-9681-458e3348301d&lang=en-us",
              "title": "Dell RACADM 7.xx: jobqueue"
            }
          ]
        }
      },
      {
        "id": "racadm-tsr-sub-1",
        "desc": "Wait for the collection job to finish",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" jobqueue view -i <JID>",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "tsr",
          "supportassist",
          "rma"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/techsupreport?guid=guid-168e5beb-9a71-4d37-af2a-04b73ec11a99&lang=en-us",
              "title": "Dell RACADM 7.xx: techsupreport"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/jobqueue?guid=guid-a57b0f48-1ebe-4cbe-9681-458e3348301d&lang=en-us",
              "title": "Dell RACADM 7.xx: jobqueue"
            }
          ]
        }
      },
      {
        "id": "racadm-tsr-sub-2",
        "desc": "Download it for the RMA case",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" techsupreport export -f tsr_report.zip",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "recipe",
          "tsr",
          "supportassist",
          "rma"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/techsupreport?guid=guid-168e5beb-9a71-4d37-af2a-04b73ec11a99&lang=en-us",
              "title": "Dell RACADM 7.xx: techsupreport"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/jobqueue?guid=guid-a57b0f48-1ebe-4cbe-9681-458e3348301d&lang=en-us",
              "title": "Dell RACADM 7.xx: jobqueue"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "racadm",
    "id": "racadm-pro-tips",
    "badge": "tip",
    "title": "Dell racadm: Pro Tip",
    "subtitle": "Firmware from a Dell Update Package (changes state)",
    "commands": [
      {
        "id": "racadm-tips-card",
        "desc": "Firmware from a Dell Update Package (changes state)",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" update -f <update-file>",
        "details": "update -f takes a Dell Update Package (.exe, .d9, .pm, .sc). update -f Catalog.xml -t <FTP|TFTP|HTTP|HTTPS|CIFS|NFS> -l <share> updates from a repository (Dell's HTTPS example uses -e <server/path> instead of -l); with --verifycatalog, update viewreport shows the comparison report. Drain first, and check the job queue afterwards.",
        "flags": [
          [
            "update viewreport",
            "Comparison report from a --verifycatalog run"
          ],
          [
            "--reboot",
            "Graceful reboot after a single-file update (repository updates use -a TRUE)"
          ]
        ],
        "tip": "Firmware changes need a drain and approval",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/update?guid=guid-4bf8c7bd-3d8e-451f-8913-29433dd646cd&lang=en-us",
              "title": "Dell RACADM 7.xx: update"
            },
            {
              "url": "https://www.dell.com/support/manuals/en-us/poweredge-r760xd2/idrac9_7.xx_racadm_pub/jobqueue?guid=guid-a57b0f48-1ebe-4cbe-9681-458e3348301d&lang=en-us",
              "title": "Dell RACADM 7.xx: jobqueue"
            }
          ],
          "note": "Corrected 2026-11-10: viewreport shows the --verifycatalog comparison report; --reboot applies to single-file updates."
        }
      }
    ]
  },
  {
    "part": "ilorest",
    "id": "ilorest-cmd-1",
    "badge": "ilorest",
    "title": "HPE iLOrest: Log in to an iLO",
    "subtitle": "Log in to an iLO (the session is reused by later commands)",
    "commands": [
      {
        "id": "ilorest-login",
        "desc": "Log in to an iLO (the session is reused by later commands)",
        "cmd": "ilorest login $BMC -u $BMC_USER -p \"$BMC_PASS\"",
        "details": "",
        "flags": [
          [
            "login (no address)",
            "In-band: CHIF on iLO 5/6, the virtual NIC with an application account on iLO 7. No password"
          ],
          [
            "--https <ca.pem>",
            "Validate the iLO's TLS certificate against a CA bundle"
          ],
          [
            "--usercert / --userkey",
            "Certificate login, no password at all"
          ],
          [
            "--logout",
            "Append to any one-off command to end the session afterwards"
          ],
          [
            "Special characters",
            "Single-quote a password that contains ! on Linux"
          ]
        ],
        "tip": "Always logout: iLO has a limited number of sessions",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "hpe",
          "ilo",
          "login",
          "session",
          "logout"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/globalcommands.md",
              "title": "HPE iLOrest 7.4: global commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/usage.md",
              "title": "HPE iLOrest 7.4: usage"
            }
          ]
        }
      },
      {
        "id": "ilorest-login-sub-1",
        "desc": "End the session",
        "cmd": "ilorest logout",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "hpe",
          "ilo",
          "login"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/globalcommands.md",
              "title": "HPE iLOrest 7.4: global commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/usage.md",
              "title": "HPE iLOrest 7.4: usage"
            }
          ]
        }
      },
      {
        "id": "ilorest-login-sub-2",
        "desc": "What resource types this iLO exposes",
        "cmd": "ilorest types",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "hpe",
          "ilo",
          "login"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/globalcommands.md",
              "title": "HPE iLOrest 7.4: global commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/usage.md",
              "title": "HPE iLOrest 7.4: usage"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ilorest",
    "id": "ilorest-cmd-2",
    "badge": "ilorest",
    "title": "HPE iLOrest: Server summary",
    "subtitle": "Server summary: system, firmware, memory, CPUs, fans, power, thermals",
    "commands": [
      {
        "id": "ilorest-serverinfo",
        "desc": "Server summary: system, firmware, memory, CPUs, fans, power, thermals",
        "cmd": "ilorest serverinfo --system --firmware",
        "details": "",
        "flags": [
          [
            "--system --processors --memory",
            "Model, serial, CPU and DIMM details"
          ],
          [
            "--fans --thermals --power",
            "Fan speeds, temperatures, PSUs"
          ],
          [
            "--firmware --software",
            "Firmware inventory and installed software"
          ],
          [
            "--all -j",
            "Everything, as JSON"
          ],
          [
            "-f <file>",
            "Save to a file (default ilorest.json)"
          ]
        ],
        "tip": "serverstate FinishedPost means the OS is booting or up",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "serverinfo",
          "inventory",
          "thermals",
          "fans",
          "power",
          "firmware"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-serverinfo-sub-1",
        "desc": "POST state: InPost, FinishedPost, PowerOff…",
        "cmd": "ilorest serverstate",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "serverinfo",
          "inventory",
          "thermals"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-serverinfo-sub-2",
        "desc": "Thermal check",
        "cmd": "ilorest serverinfo --thermals --fans",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "serverinfo",
          "inventory",
          "thermals"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-serverinfo-sub-3",
        "desc": "Full snapshot for the case folder",
        "cmd": "ilorest serverinfo --all -j -f serverinfo.json",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "serverinfo",
          "inventory",
          "thermals"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ilorest",
    "id": "ilorest-cmd-3",
    "badge": "ilorest",
    "title": "HPE iLOrest: IML, iLO event log and AHS download",
    "subtitle": "IML, iLO event log and AHS download",
    "commands": [
      {
        "id": "ilorest-serverlogs",
        "desc": "IML, iLO event log and AHS download",
        "cmd": "ilorest serverlogs --selectlog=IML",
        "details": "",
        "flags": [
          [
            "--selectlog=IML",
            "Integrated Management Log: hardware events (DIMMs, PSUs, fans)"
          ],
          [
            "--selectlog=IEL",
            "iLO Event Log: logins, resets, iLO itself"
          ],
          [
            "--selectlog=AHS",
            "Active Health System log for HPE support; the file name is built from serial and date"
          ],
          [
            "--directorypath=<dir>",
            "Where to save the AHS file"
          ],
          [
            "--customiseAHS \"from=YYYY-MM-DD&&to=YYYY-MM-DD\"",
            "Only a date range of AHS"
          ],
          [
            "--filter Id=1",
            "Pick entries"
          ],
          [
            "--clearlog",
            "Clear the selected log (changes state)"
          ]
        ],
        "tip": "HPE support asks for the AHS log first; IML is the one to read yourself",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "iml",
          "iel",
          "ahs",
          "logs",
          "events",
          "rma"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ],
          "note": "AHS downloads must use the default file name (-f is not supported for AHS)."
        }
      },
      {
        "id": "ilorest-serverlogs-sub-1",
        "desc": "iLO's own event log",
        "cmd": "ilorest serverlogs --selectlog=IEL",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "iml",
          "iel",
          "ahs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ],
          "note": "AHS downloads must use the default file name (-f is not supported for AHS)."
        }
      },
      {
        "id": "ilorest-serverlogs-sub-2",
        "desc": "AHS file for an HPE case",
        "cmd": "ilorest serverlogs --selectlog=AHS --directorypath=./logs",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "iml",
          "iel",
          "ahs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ],
          "note": "AHS downloads must use the default file name (-f is not supported for AHS)."
        }
      },
      {
        "id": "ilorest-serverlogs-sub-3",
        "desc": "Save the IML to a file",
        "cmd": "ilorest serverlogs --selectlog=IML -f iml.json",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "iml",
          "iel",
          "ahs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ],
          "note": "AHS downloads must use the default file name (-f is not supported for AHS)."
        }
      }
    ]
  },
  {
    "part": "ilorest",
    "id": "ilorest-cmd-4",
    "badge": "ilorest",
    "title": "HPE iLOrest: Storage controllers, drives and volumes",
    "subtitle": "Storage controllers, drives and volumes (Gen10 and later)",
    "commands": [
      {
        "id": "ilorest-storage",
        "desc": "Storage controllers, drives and volumes (Gen10 and later)",
        "cmd": "ilorest storagecontroller",
        "details": "",
        "flags": [
          [
            "storagecontroller",
            "Formerly smartarray. Lists controllers with their storage IDs"
          ],
          [
            "--storageid=<id> --controller=<n>",
            "Pick one controller"
          ],
          [
            "--physicaldrives / --drives",
            "Drives behind it"
          ],
          [
            "--volumes / --logicaldrives",
            "Volumes"
          ],
          [
            "Scope",
            "PLDM RDE controllers (MR, SR, NS). For NVMe use select/get or Redfish"
          ]
        ],
        "tip": "If storage looks empty, check serverstate: discovery finishes at InPostDiscoveryComplete",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "storage",
          "raid",
          "drives",
          "volumes",
          "smartarray"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/smartarraycommands.md",
              "title": "HPE iLOrest 7.4: storage commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-storage-sub-1",
        "desc": "Drives on one controller",
        "cmd": "ilorest storagecontroller --storageid=DE00F000 --controller=0 --physicaldrives",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "storage",
          "raid",
          "drives"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/smartarraycommands.md",
              "title": "HPE iLOrest 7.4: storage commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-storage-sub-2",
        "desc": "Volumes on one controller",
        "cmd": "ilorest storagecontroller --storageid=DE00D000 --controller=0 --volumes",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "storage",
          "raid",
          "drives"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/smartarraycommands.md",
              "title": "HPE iLOrest 7.4: storage commands"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ilorest",
    "id": "ilorest-cmd-5",
    "badge": "ilorest",
    "title": "HPE iLOrest: Read any Redfish property with select and get",
    "subtitle": "Read any Redfish property with select and get",
    "commands": [
      {
        "id": "ilorest-select-get",
        "desc": "Read any Redfish property with select and get",
        "cmd": "ilorest get BootOrderPolicy --select Bios.",
        "details": "",
        "flags": [
          [
            "select Bios.",
            "Pick a type; the trailing dot excludes the collection type"
          ],
          [
            "get <prop>",
            "Read; --noreadonly shows only settable properties"
          ],
          [
            "list",
            "Like get, but includes @odata, Actions and Links"
          ],
          [
            "set <prop>=<value>",
            "Stage a change (changes state); quote the whole pair: \"Name=Two Words\""
          ],
          [
            "commit",
            "Apply staged changes (changes state); BIOS changes take effect after reboot"
          ]
        ],
        "tip": "set only stages: nothing changes until commit",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "select",
          "get",
          "set",
          "commit",
          "bios",
          "redfish"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/globalcommands.md",
              "title": "HPE iLOrest 7.4: global commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/usage.md",
              "title": "HPE iLOrest 7.4: usage"
            }
          ]
        }
      },
      {
        "id": "ilorest-select-get-sub-1",
        "desc": "System resource paths",
        "cmd": "ilorest list Name @odata.id --json --select ComputerSystem.",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "select",
          "get",
          "set"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/globalcommands.md",
              "title": "HPE iLOrest 7.4: global commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/usage.md",
              "title": "HPE iLOrest 7.4: usage"
            }
          ]
        }
      },
      {
        "id": "ilorest-select-get-sub-2",
        "desc": "Every BIOS setting you can change",
        "cmd": "ilorest get --select Bios. --noreadonly",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "select",
          "get",
          "set"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/globalcommands.md",
              "title": "HPE iLOrest 7.4: global commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/usage.md",
              "title": "HPE iLOrest 7.4: usage"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ilorest",
    "id": "ilorest-cmd-6",
    "badge": "ilorest",
    "title": "HPE iLOrest: Power control",
    "subtitle": "Power control (after a drain)",
    "commands": [
      {
        "id": "ilorest-reboot",
        "desc": "Power control (after a drain)",
        "cmd": "ilorest reboot PushPowerButton",
        "details": "",
        "flags": [
          [
            "(no argument)",
            "Gotcha: plain ilorest reboot is ForceRestart"
          ],
          [
            "On / ForceOff / ForceRestart",
            "Hard power actions (change state)"
          ],
          [
            "PushPowerButton / Press",
            "Momentary press: the OS gets an ACPI shutdown"
          ],
          [
            "PressAndHold",
            "Hold the button: hard off"
          ],
          [
            "ColdBoot / Nmi",
            "Full cold boot / send an NMI for a crash dump"
          ],
          [
            "iloreset",
            "Restart the iLO; the session ends (changes state)"
          ]
        ],
        "tip": "Every reboot form changes state: drain and get approval first",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "power",
          "reboot",
          "iloreset",
          "forceoff",
          "nmi"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-reboot-sub-1",
        "desc": "Hard off (changes state)",
        "cmd": "ilorest reboot ForceOff",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "power",
          "reboot",
          "iloreset"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-reboot-sub-2",
        "desc": "Restart iLO (changes state)",
        "cmd": "ilorest iloreset",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "power",
          "reboot",
          "iloreset"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ilorest",
    "id": "ilorest-cmd-7",
    "badge": "ilorest",
    "title": "HPE iLOrest: Firmware integrity and the iLO repository",
    "subtitle": "Firmware integrity and the iLO repository",
    "commands": [
      {
        "id": "ilorest-firmware",
        "desc": "Firmware integrity and the iLO repository",
        "cmd": "ilorest fwintegritycheck --results",
        "details": "",
        "flags": [
          [
            "fwintegritycheck",
            "Run a firmware integrity check (Gen10 and later); --results shows the last one"
          ],
          [
            "listcomp",
            "Components in the iLO repository"
          ],
          [
            "flashfwpkg <file>.fwpkg",
            "Upload and flash a package (changes state)"
          ],
          [
            "uploadcomp --component <file>",
            "Upload to the repository; needs iLO 5 1.48(a)+"
          ],
          [
            "firmwareupdate <URI>",
            "iLO and UEFI firmware (.bin images) from a URL (changes state)"
          ]
        ],
        "tip": "Read versions with serverinfo --firmware before and after an update",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "firmware",
          "integrity",
          "repository",
          "update",
          "fwpkg"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilorepositorycommands.md",
              "title": "HPE iLOrest 7.4: iLO repository commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-firmware-sub-1",
        "desc": "Installed firmware versions",
        "cmd": "ilorest serverinfo --firmware",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "firmware",
          "integrity",
          "repository"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilorepositorycommands.md",
              "title": "HPE iLOrest 7.4: iLO repository commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-firmware-sub-2",
        "desc": "What is staged in the repository",
        "cmd": "ilorest listcomp",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "firmware",
          "integrity",
          "repository"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilorepositorycommands.md",
              "title": "HPE iLOrest 7.4: iLO repository commands"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ilorest",
    "id": "ilorest-cmd-8",
    "badge": "ilorest",
    "title": "HPE iLOrest: iLO network settings and virtual media",
    "subtitle": "iLO network settings and virtual media",
    "commands": [
      {
        "id": "ilorest-network-media",
        "desc": "iLO network settings and virtual media",
        "cmd": "ilorest ethernet",
        "details": "",
        "flags": [
          [
            "ethernet",
            "Print the iLO network settings"
          ],
          [
            "ethernet save / load",
            "Save to or load from eth.json (load changes state)"
          ],
          [
            "--network_ipv4 / --nameservers",
            "Change the address or DNS; needs an iLO reset (changes state)"
          ],
          [
            "virtualmedia",
            "Show mounted media"
          ],
          [
            "virtualmedia 2 <url> --bootnextreset",
            "Mount an ISO as CD/DVD and boot from it once (changes state)"
          ],
          [
            "virtualmedia 2 --remove",
            "Eject"
          ]
        ],
        "tip": "Don't put credentials in the ISO URL; use a share that doesn't need them",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "ethernet",
          "network",
          "virtualmedia",
          "iso"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ]
        }
      },
      {
        "id": "ilorest-network-media-sub-1",
        "desc": "What is mounted now",
        "cmd": "ilorest virtualmedia",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "recipe",
          "ethernet",
          "network",
          "virtualmedia"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/ilocommands.md",
              "title": "HPE iLOrest 7.4: iLO commands"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ilorest",
    "id": "ilorest-pro-tips",
    "badge": "tip",
    "title": "HPE iLOrest: Pro Tip",
    "subtitle": "One-off command without a lasting session",
    "commands": [
      {
        "id": "ilorest-tips-card",
        "desc": "One-off command without a lasting session",
        "cmd": "ilorest serverinfo --system --url $BMC -u $BMC_USER -p \"$BMC_PASS\" --logout",
        "details": "Every command accepts the login options plus --logout, so a script can run one command and leave no session behind. Deprecated: iloclone (removed in 3.2.1, use serverclone) and unifiedcertificate (merged into certificate).",
        "flags": [
          [
            "--url",
            "iLO address for this one command"
          ],
          [
            "--logout",
            "End the session afterwards"
          ]
        ],
        "tip": "Use this form in scripts",
        "tags": [
          "bmc",
          "remote-management",
          "ilorest",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/globalcommands.md",
              "title": "HPE iLOrest 7.4: global commands"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/usage.md",
              "title": "HPE iLOrest 7.4: usage"
            },
            {
              "url": "https://servermanagementportal.ext.hpe.com/docs/redfishclients/ilorest-userguide/changelog.md",
              "title": "HPE iLOrest changelog"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "supermicro-saa",
    "id": "saa-cmd-1",
    "badge": "saa",
    "title": "Supermicro SAA: List the commands, and the options for one command",
    "subtitle": "List the commands, and the options for one command",
    "commands": [
      {
        "id": "saa-help",
        "desc": "List the commands, and the options for one command",
        "cmd": "./saa -h -c GetEventLog",
        "details": "",
        "flags": [
          [
            "./saa",
            "No arguments: usage and the full command list"
          ],
          [
            "-h -c <command>",
            "Options for one command; does not need root"
          ],
          [
            "-c <command>",
            "The command to run"
          ],
          [
            "-u / -p",
            "BMC user and password"
          ],
          [
            "-l <list file>",
            "Run against many BMCs: one IP per line (from Supermicro's FAQ)"
          ],
          [
            "-I Redfish_HI",
            "In-band through the Redfish Host Interface (UEFI guide)"
          ]
        ],
        "tip": "Check -h -c on your SAA version before scripting: options change between releases",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "supermicro",
          "saa",
          "sum",
          "help",
          "usage"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            },
            {
              "url": "https://www.supermicro.com/en/solutions/management-software/superserver-automation-assistant",
              "title": "Supermicro SAA"
            }
          ],
          "note": "Checked against the UEFI build's guide; the -l list form (Supermicro FAQ 42925) was not re-read."
        }
      },
      {
        "id": "saa-help-sub-1",
        "desc": "Options for a BIOS update",
        "cmd": "./saa -h -c UpdateBios",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "supermicro",
          "saa",
          "sum"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            },
            {
              "url": "https://www.supermicro.com/en/solutions/management-software/superserver-automation-assistant",
              "title": "Supermicro SAA"
            }
          ],
          "note": "Checked against the UEFI build's guide; the -l list form (Supermicro FAQ 42925) was not re-read."
        }
      }
    ]
  },
  {
    "part": "supermicro-saa",
    "id": "saa-cmd-2",
    "badge": "saa",
    "title": "Supermicro SAA: System, BIOS and BMC firmware information",
    "subtitle": "System, BIOS and BMC firmware information",
    "commands": [
      {
        "id": "saa-sysinfo",
        "desc": "System, BIOS and BMC firmware information",
        "cmd": "./saa -c GetSystemInfo",
        "details": "",
        "flags": [
          [
            "GetSystemInfo",
            "System-wide firmware summary"
          ],
          [
            "GetBiosInfo",
            "BIOS image info"
          ],
          [
            "GetBmcInfo",
            "BMC firmware info"
          ],
          [
            "GetFruInfo",
            "FRU: board, product and chassis serials"
          ],
          [
            "GetDmiInfo --file DMI.txt",
            "Editable DMI fields, saved to a file"
          ],
          [
            "Out-of-band",
            "SAA is SUM renamed (UEFI guide), so remote use follows SUM's -i <BMC IP> -u -p form: confirm with ./saa -h"
          ]
        ],
        "tip": "In-band commands need root; help (-h) doesn't",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "sysinfo",
          "bios",
          "bmc",
          "fru",
          "dmi",
          "inventory"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            },
            {
              "url": "https://www.supermicro.com/en/solutions/management-software/superserver-automation-assistant",
              "title": "Supermicro SAA"
            }
          ],
          "note": "The UEFI guide says \"SAA, formerly known as SUM\"; the product page says SAA brings SUM and the IPMI utilities together. Root for in-band use is not stated in the pages read."
        }
      },
      {
        "id": "saa-sysinfo-sub-1",
        "desc": "BIOS version and build date",
        "cmd": "./saa -c GetBiosInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "sysinfo",
          "bios",
          "bmc"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            },
            {
              "url": "https://www.supermicro.com/en/solutions/management-software/superserver-automation-assistant",
              "title": "Supermicro SAA"
            }
          ],
          "note": "The UEFI guide says \"SAA, formerly known as SUM\"; the product page says SAA brings SUM and the IPMI utilities together. Root for in-band use is not stated in the pages read."
        }
      },
      {
        "id": "saa-sysinfo-sub-2",
        "desc": "BMC firmware version",
        "cmd": "./saa -c GetBmcInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "sysinfo",
          "bios",
          "bmc"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            },
            {
              "url": "https://www.supermicro.com/en/solutions/management-software/superserver-automation-assistant",
              "title": "Supermicro SAA"
            }
          ],
          "note": "The UEFI guide says \"SAA, formerly known as SUM\"; the product page says SAA brings SUM and the IPMI utilities together. Root for in-band use is not stated in the pages read."
        }
      },
      {
        "id": "saa-sysinfo-sub-3",
        "desc": "Serial numbers for the RMA",
        "cmd": "./saa -c GetFruInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "sysinfo",
          "bios",
          "bmc"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            },
            {
              "url": "https://www.supermicro.com/en/solutions/management-software/superserver-automation-assistant",
              "title": "Supermicro SAA"
            }
          ],
          "note": "The UEFI guide says \"SAA, formerly known as SUM\"; the product page says SAA brings SUM and the IPMI utilities together. Root for in-band use is not stated in the pages read."
        }
      }
    ]
  },
  {
    "part": "supermicro-saa",
    "id": "saa-cmd-3",
    "badge": "saa",
    "title": "Supermicro SAA: BMC event log and sensor status",
    "subtitle": "BMC event log and sensor status",
    "commands": [
      {
        "id": "saa-eventlog",
        "desc": "BMC event log and sensor status",
        "cmd": "./saa -c GetEventLog --info",
        "details": "",
        "flags": [
          [
            "GetEventLog --info [--file <f>]",
            "Read the event log; --file saves it"
          ],
          [
            "ClearEventLog",
            "Clear it (changes state; save it to the case first)"
          ],
          [
            "GetMaintenEventLog",
            "Maintenance event log"
          ],
          [
            "CheckSensorData --action Show",
            "Sensor status"
          ],
          [
            "GetPsuInfo / GetPsFruInfo",
            "Power supplies and their FRU data"
          ],
          [
            "ChassisIntrusion",
            "Chassis intrusion status"
          ]
        ],
        "tip": "Save the event log before any clear or firmware update",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "eventlog",
          "sel",
          "sensors",
          "psu",
          "intrusion"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            }
          ]
        }
      },
      {
        "id": "saa-eventlog-sub-1",
        "desc": "Save the log for the case",
        "cmd": "./saa -c GetEventLog --info --file EventLog.txt --overwrite",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "eventlog",
          "sel",
          "sensors"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            }
          ]
        }
      },
      {
        "id": "saa-eventlog-sub-2",
        "desc": "Sensors",
        "cmd": "./saa -c CheckSensorData --action Show",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "eventlog",
          "sel",
          "sensors"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            }
          ]
        }
      },
      {
        "id": "saa-eventlog-sub-3",
        "desc": "PSU status",
        "cmd": "./saa -c GetPsuInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "eventlog",
          "sel",
          "sensors"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "supermicro-saa",
    "id": "saa-cmd-4",
    "badge": "saa",
    "title": "Supermicro SAA: Same command across many BMCs",
    "subtitle": "Same command across many BMCs (Supermicro FAQ form)",
    "commands": [
      {
        "id": "saa-multi",
        "desc": "Same command across many BMCs (Supermicro FAQ form)",
        "cmd": "./saa -l SList.txt -u $BMC_USER -p \"$BMC_PASS\" -c GetBmcCfg --file BmcCfg.xml --overwrite",
        "details": "",
        "flags": [
          [
            "-l SList.txt",
            "One BMC IP per line"
          ],
          [
            "GetBmcCfg --file",
            "Export BMC settings to XML"
          ],
          [
            "--overwrite",
            "Replace an existing output file"
          ],
          [
            "-p",
            "Visible in ps: keep the password in a variable, never typed inline"
          ]
        ],
        "tip": "Export the config from a known-good node and diff it against the suspect one",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "multi",
          "fleet",
          "bmccfg",
          "export"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "GetBmcCfg and the -l host-list form are not in the SAA UEFI guide; the full OS guide was not found. Check ./saa -h."
        }
      }
    ]
  },
  {
    "part": "supermicro-saa",
    "id": "saa-cmd-5",
    "badge": "saa",
    "title": "Supermicro SAA: GPU and CPLD firmware information",
    "subtitle": "GPU and CPLD firmware information",
    "commands": [
      {
        "id": "saa-gpu",
        "desc": "GPU and CPLD firmware information",
        "cmd": "./saa -c GetGpuInfo",
        "details": "",
        "flags": [
          [
            "GetGpuInfo",
            "GPU baseboard firmware info (with --file <pkg> --file_only it reads a package instead)"
          ],
          [
            "GetCpldInfo",
            "CPLD versions (also backplane, fan board, switch board variants)"
          ],
          [
            "UpdateGpu / UpdateCpld",
            "Firmware updates (change state)"
          ]
        ],
        "tip": "Compare GPU baseboard firmware across the nodes of one cluster",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "gpu",
          "hgx",
          "cpld",
          "firmware"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            }
          ]
        }
      },
      {
        "id": "saa-gpu-sub-1",
        "desc": "Motherboard CPLD version",
        "cmd": "./saa -c GetCpldInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "gpu",
          "hgx",
          "cpld"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "supermicro-saa",
    "id": "saa-pro-tips",
    "badge": "tip",
    "title": "Supermicro SAA: Pro Tip",
    "subtitle": "Firmware updates and BMC reset (change state)",
    "commands": [
      {
        "id": "saa-tips-card",
        "desc": "Firmware updates and BMC reset (change state)",
        "cmd": "./saa -c UpdateBios --file <bios-image>",
        "details": "UpdateBios, UpdateBmc, UpdateGpu and UpdateCpld flash firmware; BmcReset restarts the BMC (--boot_check waits for it). Read the options with ./saa -h -c <command> first, save the event log, drain the node and get approval. Licences: standard update and management need none; remote management features need SFT-OOB-LIC or SFT-DCMS-SINGLE (Supermicro's SAA page).",
        "flags": [
          [
            "BmcReset --boot_check",
            "Restart the BMC and wait for it"
          ],
          [
            "X13/H13 and older",
            "Supermicro still points these to SUM and the IPMI utilities"
          ]
        ],
        "tip": "Firmware changes need a drain and approval",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.supermicro.com/Bios/sw_download/781/UEFI_SAA_UserGuide.pdf",
              "title": "SAA for UEFI User's Guide 1.1.0"
            },
            {
              "url": "https://www.supermicro.com/en/solutions/management-software/superserver-automation-assistant",
              "title": "Supermicro SAA"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "onecli",
    "id": "onecli-cmd-1",
    "badge": "onecli",
    "title": "Lenovo OneCLI: System health summary through the XCC",
    "subtitle": "System health summary through the XCC",
    "commands": [
      {
        "id": "onecli-syshealth",
        "desc": "System health summary through the XCC",
        "cmd": "./OneCli misc syshealth --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "details": "",
        "flags": [
          [
            "--bmc user:password@host[:port]",
            "Out-of-band through the XCC. Without --bmc, OneCLI runs in-band"
          ],
          [
            "--device",
            "system, processor, fan, dimm, power or pci_adapter"
          ],
          [
            "--configfile <json>",
            "Credentials from a file (template: Sample/credentials_config.json)"
          ],
          [
            "-N / --never-check-trust",
            "Skip certificate and SSH fingerprint checks (lab only)"
          ],
          [
            "Quoting",
            "Single-quote passwords with special characters on Linux"
          ],
          [
            "ThinkSystem only",
            "syshealth is not supported on older System x"
          ]
        ],
        "tip": "Encrypt the credentials file with misc encrypt instead of passing --bmc on the command line",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "lenovo",
          "xcc",
          "health",
          "syshealth"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_misc_syshealth_command",
              "title": "Lenovo OneCLI: syshealth"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_c_technical_overview",
              "title": "Lenovo OneCLI: global parameters"
            }
          ]
        }
      },
      {
        "id": "onecli-syshealth-sub-1",
        "desc": "Power subsystem only",
        "cmd": "./OneCli misc syshealth --device power --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "lenovo",
          "xcc",
          "health"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_misc_syshealth_command",
              "title": "Lenovo OneCLI: syshealth"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_c_technical_overview",
              "title": "Lenovo OneCLI: global parameters"
            }
          ]
        }
      },
      {
        "id": "onecli-syshealth-sub-2",
        "desc": "Memory only",
        "cmd": "./OneCli misc syshealth --device dimm --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "lenovo",
          "xcc",
          "health"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_misc_syshealth_command",
              "title": "Lenovo OneCLI: syshealth"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_c_technical_overview",
              "title": "Lenovo OneCLI: global parameters"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "onecli",
    "id": "onecli-cmd-2",
    "badge": "onecli",
    "title": "Lenovo OneCLI: SEL, BMC and audit logs",
    "subtitle": "SEL, BMC and audit logs",
    "commands": [
      {
        "id": "onecli-logmgr",
        "desc": "SEL, BMC and audit logs",
        "cmd": "./OneCli misc logmgr showsel --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "details": "",
        "flags": [
          [
            "showsel",
            "System event log"
          ],
          [
            "showbmclog / showauditlog / showmaintlog",
            "XCC event log, audit log, maintenance log"
          ],
          [
            "--type AEL|PEL|ALL",
            "Audit, Platform, or both event logs (documented for the clear commands)"
          ],
          [
            "clearsel / clearbmclog / clearall",
            "Clear logs (changes state)"
          ],
          [
            "In-band too",
            "logmgr works in-band and out-of-band"
          ]
        ],
        "tip": "There is no getsel: showsel is the command",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "sel",
          "logs",
          "logmgr",
          "audit"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_logmgr_command",
              "title": "Lenovo OneCLI: logmgr"
            }
          ]
        }
      },
      {
        "id": "onecli-logmgr-sub-1",
        "desc": "XCC event log",
        "cmd": "./OneCli misc logmgr showbmclog --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "sel",
          "logs",
          "logmgr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_logmgr_command",
              "title": "Lenovo OneCLI: logmgr"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "onecli",
    "id": "onecli-cmd-3",
    "badge": "onecli",
    "title": "Lenovo OneCLI: Full inventory report",
    "subtitle": "Full inventory report (in-band)",
    "commands": [
      {
        "id": "onecli-inventory",
        "desc": "Full inventory report (in-band)",
        "cmd": "./OneCli inventory getinfor --output ./inventory --htmlreport",
        "details": "",
        "flags": [
          [
            "--output <dir>",
            "Where to write the report"
          ],
          [
            "--htmlreport",
            "Also write an HTML report"
          ],
          [
            "--device <name>",
            "One category (default all); list them with inventory getdevices"
          ],
          [
            "--ffdc",
            "Collect service data too"
          ],
          [
            "getdevices",
            "In-band only: the device categories getinfor accepts"
          ]
        ],
        "tip": "Attach the HTML report to the case",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "inventory",
          "getinfor",
          "report"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_getinfor_command",
              "title": "Lenovo OneCLI: inventory getinfor"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_getdevices_command",
              "title": "Lenovo OneCLI: getdevices"
            }
          ]
        }
      },
      {
        "id": "onecli-inventory-sub-1",
        "desc": "Categories: system_overview, bmc_event_logs, …",
        "cmd": "./OneCli inventory getdevices",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "inventory",
          "getinfor",
          "report"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_getinfor_command",
              "title": "Lenovo OneCLI: inventory getinfor"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_getdevices_command",
              "title": "Lenovo OneCLI: getdevices"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "onecli",
    "id": "onecli-cmd-4",
    "badge": "onecli",
    "title": "Lenovo OneCLI: Read and save settings",
    "subtitle": "Read and save settings (XCC, UEFI)",
    "commands": [
      {
        "id": "onecli-config",
        "desc": "Read and save settings (XCC, UEFI)",
        "cmd": "./OneCli config show IMM --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "details": "",
        "flags": [
          [
            "config show [all|group|setting]",
            "All settings, one group (IMM, UEFI…) or one setting"
          ],
          [
            "config save --file <f>",
            "Save settings to a file (name=value lines)"
          ],
          [
            "config set <setting> <value>",
            "Change one setting (changes state)"
          ],
          [
            "config compare / comparedefault",
            "Compare against a file or the defaults"
          ]
        ],
        "tip": "Save before you set, and keep the file in the case folder",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "config",
          "settings",
          "uefi",
          "imm",
          "xcc"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_commands_display_config_settings",
              "title": "Lenovo OneCLI: config show/compare"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_commands_save_replicate_system_config",
              "title": "Lenovo OneCLI: config save"
            }
          ]
        }
      },
      {
        "id": "onecli-config-sub-1",
        "desc": "Save every setting for a later diff",
        "cmd": "./OneCli config save --file saved.txt --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "config",
          "settings",
          "uefi"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_commands_save_replicate_system_config",
              "title": "Lenovo OneCLI: config save"
            }
          ],
          "note": "The --file option of config save was not confirmed on the page read."
        }
      },
      {
        "id": "onecli-config-sub-2",
        "desc": "BIOS (UEFI) settings",
        "cmd": "./OneCli config show UEFI --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "config",
          "settings",
          "uefi"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_commands_display_config_settings",
              "title": "Lenovo OneCLI: config show/compare"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_commands_save_replicate_system_config",
              "title": "Lenovo OneCLI: config save"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "onecli",
    "id": "onecli-cmd-5",
    "badge": "onecli",
    "title": "Lenovo OneCLI: What firmware is installed, and what is newer",
    "subtitle": "What firmware is installed, and what is newer",
    "commands": [
      {
        "id": "onecli-update",
        "desc": "What firmware is installed, and what is newer",
        "cmd": "./OneCli update scan --bmc \"$BMC_USER:$BMC_PASS@$BMC\" --output ./scan",
        "details": "",
        "flags": [
          [
            "update scan",
            "Installed firmware (out-of-band) or firmware and drivers (in-band)"
          ],
          [
            "update compare --scope latest|uxsp|individual",
            "Compare against packages in --dir"
          ],
          [
            "update flash",
            "Apply updates from the compare result (changes state)"
          ],
          [
            "--noreboot",
            "By default the BMC restarts itself after a BMC update"
          ]
        ],
        "tip": "scan and compare are read-only; flash needs a drain and approval",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "firmware",
          "update",
          "scan",
          "compare",
          "flash"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_up_compare_command",
              "title": "Lenovo OneCLI: update compare"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_flash_command",
              "title": "Lenovo OneCLI: update flash"
            }
          ],
          "note": "update scan --output: the scan page was not read."
        }
      },
      {
        "id": "onecli-update-sub-1",
        "desc": "What would be updated",
        "cmd": "./OneCli update compare --scope latest --bmc \"$BMC_USER:$BMC_PASS@$BMC\" --dir ./packages --output ./compare",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "firmware",
          "update",
          "scan"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_up_compare_command",
              "title": "Lenovo OneCLI: update compare"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_flash_command",
              "title": "Lenovo OneCLI: update flash"
            }
          ],
          "note": "update scan --output: the scan page was not read."
        }
      }
    ]
  },
  {
    "part": "onecli",
    "id": "onecli-cmd-6",
    "badge": "onecli",
    "title": "Lenovo OneCLI: Power state and control",
    "subtitle": "Power state and control (after a drain)",
    "commands": [
      {
        "id": "onecli-power",
        "desc": "Power state and control (after a drain)",
        "cmd": "./OneCli misc power state --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "details": "",
        "flags": [
          [
            "power state",
            "Read-only"
          ],
          [
            "power normaloff / normalrestart",
            "OS-level off or restart (changes state)"
          ],
          [
            "power forceoff / forcerestart / on",
            "Hard actions (change state)"
          ],
          [
            "power boottosetup",
            "Restart into UEFI setup (changes state)"
          ],
          [
            "rebootbmc",
            "Restart the XCC (changes state)"
          ],
          [
            "ospower",
            "OneCLI 5.2.0 and earlier only; use power"
          ]
        ],
        "tip": "Prefer normalrestart over forcerestart",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "power",
          "restart",
          "rebootbmc",
          "boottosetup"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/misc_power_command",
              "title": "Lenovo OneCLI: misc power"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_imm_rebootimm_command",
              "title": "Lenovo OneCLI: rebootbmc"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_c_misc",
              "title": "Lenovo OneCLI: misc commands"
            }
          ]
        }
      },
      {
        "id": "onecli-power-sub-1",
        "desc": "Clean restart (changes state)",
        "cmd": "./OneCli misc power normalrestart --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "power",
          "restart",
          "rebootbmc"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/misc_power_command",
              "title": "Lenovo OneCLI: misc power"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_imm_rebootimm_command",
              "title": "Lenovo OneCLI: rebootbmc"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_c_misc",
              "title": "Lenovo OneCLI: misc commands"
            }
          ]
        }
      },
      {
        "id": "onecli-power-sub-2",
        "desc": "Restart the XCC (changes state)",
        "cmd": "./OneCli misc rebootbmc --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "power",
          "restart",
          "rebootbmc"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/misc_power_command",
              "title": "Lenovo OneCLI: misc power"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_imm_rebootimm_command",
              "title": "Lenovo OneCLI: rebootbmc"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_c_misc",
              "title": "Lenovo OneCLI: misc commands"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "onecli",
    "id": "onecli-pro-tips",
    "badge": "tip",
    "title": "Lenovo OneCLI: Pro Tip",
    "subtitle": "Service data (FFDC) for a Lenovo case",
    "commands": [
      {
        "id": "onecli-tips-card",
        "desc": "Service data (FFDC) for a Lenovo case",
        "cmd": "./OneCli misc ffdc --bmc \"$BMC_USER:$BMC_PASS@$BMC\"",
        "details": "FFDC collects the XCC service data Lenovo support asks for. --upload lenovo sends it straight to Lenovo; --extra-data adds corefile, thermal, adapter or worknote data. Encrypt a credentials file with ./OneCli misc encrypt --configfile credentials.json and pass --configfile, so passwords stay off the command line.",
        "flags": [
          [
            "--configfile",
            "Credentials file instead of --bmc user:password"
          ],
          [
            "misc encrypt",
            "Encrypt that file (a passphrase is safer than --unattended)"
          ]
        ],
        "tip": "Attach FFDC to every Lenovo RMA",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/onecli_r_ffdc_command",
              "title": "Lenovo OneCLI: ffdc"
            },
            {
              "url": "https://pubs.lenovo.com/lxce-onecli/misc_encrypt_command",
              "title": "Lenovo OneCLI: misc encrypt"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-1",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Sensors with a health state, password prompted",
    "subtitle": "Sensors with a health state, password prompted",
    "commands": [
      {
        "id": "freeipmi-sensors",
        "desc": "Sensors with a health state, password prompted",
        "cmd": "ipmi-sensors -h $BMC -u $BMC_USER -P --output-sensor-state --ignore-not-available-sensors",
        "details": "",
        "flags": [
          [
            "-P / --password-prompt",
            "Ask for the password, so it never shows in ps or shell history"
          ],
          [
            "--output-sensor-state",
            "Add NOMINAL / WARNING / CRITICAL per sensor"
          ],
          [
            "--ignore-not-available-sensors",
            "Hide N/A sensors"
          ],
          [
            "--sdr-cache-recreate",
            "Rebuild a stale SDR cache (after a BMC firmware update)"
          ],
          [
            "-D LAN_2_0",
            "Force IPMI 2.0 (LAN is IPMI 1.5)"
          ],
          [
            "-I 3",
            "Cipher suite (default 3)"
          ]
        ],
        "tip": "-P (prompt) is the safe default; -p puts the password in ps",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "freeipmi",
          "sensors",
          "sdr",
          "bmc-info",
          "fru"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sensors.8.en.html",
              "title": "FreeIPMI ipmi-sensors(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/bmc-info.8.en.html",
              "title": "FreeIPMI bmc-info(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-fru.8.en.html",
              "title": "FreeIPMI ipmi-fru(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.7.en.html",
              "title": "FreeIPMI freeipmi(7)"
            }
          ],
          "note": "Sensor type names: list them with ipmi-sensors -L."
        }
      },
      {
        "id": "freeipmi-sensors-sub-1",
        "desc": "Only temperatures and fans",
        "cmd": "ipmi-sensors -h $BMC -u $BMC_USER -P -t Temperature,Fan",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "freeipmi",
          "sensors",
          "sdr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sensors.8.en.html",
              "title": "FreeIPMI ipmi-sensors(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/bmc-info.8.en.html",
              "title": "FreeIPMI bmc-info(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-fru.8.en.html",
              "title": "FreeIPMI ipmi-fru(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.7.en.html",
              "title": "FreeIPMI freeipmi(7)"
            }
          ],
          "note": "Sensor type names: list them with ipmi-sensors -L."
        }
      },
      {
        "id": "freeipmi-sensors-sub-2",
        "desc": "BMC firmware and IPMI version",
        "cmd": "bmc-info -h $BMC -u $BMC_USER -P --get-device-id",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "freeipmi",
          "sensors",
          "sdr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sensors.8.en.html",
              "title": "FreeIPMI ipmi-sensors(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/bmc-info.8.en.html",
              "title": "FreeIPMI bmc-info(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-fru.8.en.html",
              "title": "FreeIPMI ipmi-fru(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.7.en.html",
              "title": "FreeIPMI freeipmi(7)"
            }
          ],
          "note": "Sensor type names: list them with ipmi-sensors -L."
        }
      },
      {
        "id": "freeipmi-sensors-sub-3",
        "desc": "FRU serials for the RMA",
        "cmd": "ipmi-fru -h $BMC -u $BMC_USER -P",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "freeipmi",
          "sensors",
          "sdr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sensors.8.en.html",
              "title": "FreeIPMI ipmi-sensors(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/bmc-info.8.en.html",
              "title": "FreeIPMI bmc-info(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-fru.8.en.html",
              "title": "FreeIPMI ipmi-fru(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.7.en.html",
              "title": "FreeIPMI freeipmi(7)"
            }
          ],
          "note": "Sensor type names: list them with ipmi-sensors -L."
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-2",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Last SEL entries, interpreted",
    "subtitle": "Last SEL entries, interpreted",
    "commands": [
      {
        "id": "freeipmi-sel",
        "desc": "Last SEL entries, interpreted",
        "cmd": "ipmi-sel -h $BMC -u $BMC_USER -P --tail=50 --interpret-oem-data --output-event-state",
        "details": "",
        "flags": [
          [
            "--tail=<n>",
            "About the last n records (vendor SELs vary)"
          ],
          [
            "--interpret-oem-data",
            "Decode OEM records where FreeIPMI knows the vendor"
          ],
          [
            "--output-event-state",
            "NOMINAL / WARNING / CRITICAL per event"
          ],
          [
            "--display-range=<a>-<b>",
            "A range of record IDs"
          ],
          [
            "--clear / --post-clear / --delete=<id>",
            "Change the SEL (changes state)"
          ]
        ],
        "tip": "Save the SEL before anyone clears it",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "sel",
          "events",
          "logs",
          "oem"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sel.8.en.html",
              "title": "FreeIPMI ipmi-sel(8)"
            }
          ]
        }
      },
      {
        "id": "freeipmi-sel-sub-1",
        "desc": "Save the whole SEL to the case folder",
        "cmd": "ipmi-sel -h $BMC -u $BMC_USER -P --output-event-state > sel.txt",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "sel",
          "events",
          "logs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sel.8.en.html",
              "title": "FreeIPMI ipmi-sel(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-3",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Power status for a whole rack at once",
    "subtitle": "Power status for a whole rack at once",
    "commands": [
      {
        "id": "freeipmi-power",
        "desc": "Power status for a whole rack at once",
        "cmd": "ipmipower -h \"rack12-node[01-16]-bmc\" -u $BMC_USER -P --stat",
        "details": "",
        "flags": [
          [
            "-h \"prefix[01-16]\"",
            "Host range; quote it so the shell doesn't expand the brackets"
          ],
          [
            "--stat",
            "Read-only power status (USER privilege)"
          ],
          [
            "--on / --off / --cycle / --reset",
            "Power actions (change state; OPERATOR privilege)"
          ],
          [
            "--soft",
            "ACPI soft shutdown (changes state)"
          ],
          [
            "--on-if-off",
            "Power on instead of cycle/reset when the node is off"
          ],
          [
            "-F <n>",
            "Fan-out: hosts in parallel (default 64)"
          ]
        ],
        "tip": "Host ranges make rack-wide status checks one command",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "power",
          "ipmipower",
          "chassis",
          "hostrange",
          "rack"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmipower.8.en.html",
              "title": "FreeIPMI ipmipower(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-chassis.8.en.html",
              "title": "FreeIPMI ipmi-chassis(8)"
            }
          ],
          "note": "A host range with text after the brackets ([01-16]-bmc) is not shown in the man page; the fan-out default 64 is stated on the sibling tools' pages."
        }
      },
      {
        "id": "freeipmi-power-sub-1",
        "desc": "Power, last power event, intrusion",
        "cmd": "ipmi-chassis -h $BMC -u $BMC_USER -P --get-chassis-status",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "power",
          "ipmipower",
          "chassis"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-chassis.8.en.html",
              "title": "FreeIPMI ipmi-chassis(8)"
            }
          ],
          "note": "The man page does not list what the status shows (power, last event, intrusion)."
        }
      },
      {
        "id": "freeipmi-power-sub-2",
        "desc": "Clean OS shutdown (changes state)",
        "cmd": "ipmipower -h $BMC -u $BMC_USER -P --soft",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "power",
          "ipmipower",
          "chassis"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmipower.8.en.html",
              "title": "FreeIPMI ipmipower(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-chassis.8.en.html",
              "title": "FreeIPMI ipmi-chassis(8)"
            }
          ],
          "note": "A host range with text after the brackets ([01-16]-bmc) is not shown in the man page; the fan-out default 64 is stated on the sibling tools' pages."
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-4",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Serial-over-LAN console",
    "subtitle": "Serial-over-LAN console",
    "commands": [
      {
        "id": "freeipmi-sol",
        "desc": "Serial-over-LAN console",
        "cmd": "ipmiconsole -h $BMC -u $BMC_USER -P",
        "details": "",
        "flags": [
          [
            "&.",
            "Disconnect (the escape character is &)"
          ],
          [
            "&?",
            "List the escape sequences"
          ],
          [
            "&B",
            "Send a serial break"
          ],
          [
            "-e <char>",
            "Change the escape character"
          ],
          [
            "--dont-steal",
            "Don't take over a session someone else has open (the default is to steal it)"
          ],
          [
            "--deactivate",
            "Close a stuck SOL session and exit"
          ],
          [
            "Cipher suites 3, 8, 12",
            "The only ones that encrypt console traffic"
          ]
        ],
        "tip": "Use --dont-steal on a node someone else may be working on",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "sol",
          "console",
          "serial",
          "ipmiconsole"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmiconsole.8.en.html",
              "title": "FreeIPMI ipmiconsole(8)"
            }
          ]
        }
      },
      {
        "id": "freeipmi-sol-sub-1",
        "desc": "Free a stuck SOL session",
        "cmd": "ipmiconsole -h $BMC -u $BMC_USER -P --deactivate",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "sol",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmiconsole.8.en.html",
              "title": "FreeIPMI ipmiconsole(8)"
            }
          ]
        }
      },
      {
        "id": "freeipmi-sol-sub-2",
        "desc": "Watch only if nobody else is attached",
        "cmd": "ipmiconsole -h $BMC -u $BMC_USER -P --dont-steal",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "sol",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmiconsole.8.en.html",
              "title": "FreeIPMI ipmiconsole(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-5",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Power draw from the BMC",
    "subtitle": "Power draw from the BMC (DCMI)",
    "commands": [
      {
        "id": "freeipmi-dcmi",
        "desc": "Power draw from the BMC (DCMI)",
        "cmd": "ipmi-dcmi -h $BMC -u $BMC_USER -P --get-system-power-statistics",
        "details": "",
        "flags": [
          [
            "--get-system-power-statistics",
            "Current, min, max and average watts"
          ],
          [
            "--get-enhanced-system-power-statistics",
            "Averages over several periods"
          ],
          [
            "--get-power-limit",
            "The configured power cap"
          ],
          [
            "--set-power-limit",
            "Change the cap (changes state)"
          ]
        ],
        "tip": "A power cap can explain GPUs that never reach full clocks",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "dcmi",
          "power",
          "watts",
          "cap"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-dcmi.8.en.html",
              "title": "FreeIPMI ipmi-dcmi(8)"
            }
          ]
        }
      },
      {
        "id": "freeipmi-dcmi-sub-1",
        "desc": "Is a power cap active?",
        "cmd": "ipmi-dcmi -h $BMC -u $BMC_USER -P --get-power-limit",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "dcmi",
          "power",
          "watts"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-dcmi.8.en.html",
              "title": "FreeIPMI ipmi-dcmi(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-pro-tips",
    "badge": "tip",
    "title": "GNU FreeIPMI: Pro Tip",
    "subtitle": "Credentials in a config file instead of on the command line",
    "commands": [
      {
        "id": "freeipmi-tips-card",
        "desc": "Credentials in a config file instead of on the command line",
        "cmd": "install -m 600 /dev/null /etc/freeipmi/freeipmi.conf",
        "details": "freeipmi.conf takes one option per line: username <user>, password <pass>, driver-type LAN_2_0, cipher-suite-id 3. Tool-specific keys such as ipmi-sel-password override the general ones. Keep the file mode 600, or point a tool at your own file with --config-file. Never commit it, and never paste it into a case.",
        "flags": [
          [
            "--config-file <file>",
            "Use another config file"
          ],
          [
            "Command line wins",
            "Options on the command line override the file"
          ]
        ],
        "tip": "Mode 600, and keep it out of git",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.conf.5.en.html",
              "title": "FreeIPMI freeipmi.conf(5)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-cmd-1",
    "badge": "serial",
    "title": "Serial consoles: Open a USB serial console",
    "subtitle": "Open a USB serial console",
    "commands": [
      {
        "id": "serial-picocom",
        "desc": "Open a USB serial console",
        "cmd": "picocom -b 115200 /dev/ttyUSB0",
        "details": "",
        "flags": [
          [
            "-b 115200",
            "Baud rate: most servers and switches use 115200 or 9600"
          ],
          [
            "C-a C-x",
            "Exit and reset the port"
          ],
          [
            "C-a C-q",
            "Quit without resetting the port"
          ],
          [
            "C-a C-h",
            "Help: every C-a command"
          ],
          [
            "C-a C-\\",
            "Send a break"
          ],
          [
            "-g <file>",
            "Log the session to a file"
          ]
        ],
        "tip": "Use /dev/serial/by-id paths: ttyUSB numbers change on replug",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "serial",
          "picocom",
          "console",
          "usb",
          "tty"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/npat-efault/picocom/blob/master/picocom.1.md",
              "title": "picocom(1)"
            }
          ]
        }
      },
      {
        "id": "serial-picocom-sub-1",
        "desc": "Stable names for USB serial adapters",
        "cmd": "ls -l /dev/serial/by-id/",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "A standard Linux path, not checked against a document."
        }
      },
      {
        "id": "serial-picocom-sub-2",
        "desc": "Which ttyUSB the adapter just became",
        "cmd": "dmesg -T | grep -i tty",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "Standard Linux commands, not checked against a document."
        }
      },
      {
        "id": "serial-picocom-sub-3",
        "desc": "Are you in the dialout (or uucp) group that owns the port?",
        "cmd": "id -nG",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "Standard command; the group name (dialout or uucp) depends on the distribution."
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-cmd-2",
    "badge": "serial",
    "title": "Serial consoles: Share a serial port on the network with ser2net",
    "subtitle": "Share a serial port on the network with ser2net (YAML)",
    "commands": [
      {
        "id": "serial-ser2net",
        "desc": "Share a serial port on the network with ser2net (YAML)",
        "cmd": "connection: &rack12-sw1\n  accepter: telnet(rfc2217),tcp,3001\n  connector: serialdev,/dev/ttyUSB0,115200N81\n  options:\n    kickolduser: false\n    banner: \"rack12-sw1 console\\r\\n\"",
        "details": "",
        "flags": [
          [
            "/etc/ser2net/ser2net.yaml",
            "The YAML config path in the ser2net README (some distro packages put it elsewhere: check your package)"
          ],
          [
            "accepter",
            "What clients connect to: tcp,<port> or telnet(rfc2217),tcp,<port>"
          ],
          [
            "connector",
            "The device: serialdev,<path>,<baud><parity><bits><stop>"
          ],
          [
            "kickolduser",
            "true: a new user takes over from the old one"
          ],
          [
            "max-connections",
            "Default 1"
          ],
          [
            "*{file}",
            "YAML v1: insert a file's contents, so secrets stay out of the config"
          ]
        ],
        "tip": "Bind ser2net to a management VLAN only: it has no login by default",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "ser2net",
          "serial",
          "network",
          "yaml",
          "rfc2217"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/README.rst",
              "title": "ser2net README"
            }
          ],
          "note": "kickolduser, max-connections and the *{file} include are in ser2net.yaml(5), which could not be read."
        }
      },
      {
        "id": "serial-ser2net-sub-1",
        "desc": "Is it running?",
        "cmd": "systemctl status ser2net --no-pager",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "ser2net",
          "serial",
          "network"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "The service name depends on your ser2net package."
        }
      },
      {
        "id": "serial-ser2net-sub-2",
        "desc": "Connect (the README recommends gensiot over telnet)",
        "cmd": "gensiot telnet(rfc2217),tcp,localhost,3001",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "ser2net",
          "serial",
          "network"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/README.rst",
              "title": "ser2net README"
            },
            {
              "url": "https://github.com/cminyard/gensio",
              "title": "gensio / gensiot"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-cmd-3",
    "badge": "serial",
    "title": "Serial consoles: List and attach to logged consoles",
    "subtitle": "List and attach to logged consoles (conserver)",
    "commands": [
      {
        "id": "serial-conserver",
        "desc": "List and attach to logged consoles (conserver)",
        "cmd": "console -u",
        "details": "",
        "flags": [
          [
            "console -u",
            "Every console with state (up, down, init) and who is attached"
          ],
          [
            "console <name>",
            "Attach read-write"
          ],
          [
            "console -s <name>",
            "Spy: read-only"
          ],
          [
            "^Ec.",
            "Disconnect (Ctrl-E, c, period)"
          ],
          [
            "^Ec?",
            "List escape commands"
          ],
          [
            "^Ecr / ^Ecl0",
            "Replay recent output / send a break"
          ]
        ],
        "tip": "conserver logs every console, so the boot that crashed at 3 a.m. is in the log",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "conserver",
          "console",
          "serial",
          "logging"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/console.man.html",
              "title": "conserver console(1)"
            }
          ]
        }
      },
      {
        "id": "serial-conserver-sub-1",
        "desc": "Watch a console without typing into it",
        "cmd": "console -s rack12-node07",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "conserver",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/console.man.html",
              "title": "conserver console(1)"
            }
          ]
        }
      },
      {
        "id": "serial-conserver-sub-2",
        "desc": "Who is attached where",
        "cmd": "console -w",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "conserver",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/console.man.html",
              "title": "conserver console(1)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-cmd-4",
    "badge": "serial",
    "title": "Serial consoles: conserver console for an IPMI SOL target",
    "subtitle": "conserver console for an IPMI SOL target",
    "commands": [
      {
        "id": "serial-conserver-ipmi",
        "desc": "conserver console for an IPMI SOL target",
        "cmd": "console rack12-node07 {\n  master localhost;\n  type ipmi;\n  host rack12-node07-bmc.example.com;\n  username <bmc_user>;\n  rw *;\n}",
        "details": "",
        "flags": [
          [
            "type ipmi",
            "IPMI Serial-over-LAN through FreeIPMI"
          ],
          [
            "host / username / password",
            "BMC address and login. Keep the password in a root-only include, never in a shared copy"
          ],
          [
            "ipmiciphersuite / ipmiprivlevel",
            "Cipher suite and privilege (default admin)"
          ],
          [
            "type device + device + baud",
            "A local serial port instead"
          ]
        ],
        "tip": "chmod 600 conserver.cf when it holds BMC passwords",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "conserver",
          "ipmi",
          "sol",
          "config"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/conserver.cf.man.html",
              "title": "conserver.cf(5)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-pro-tips",
    "badge": "tip",
    "title": "Serial consoles: Pro Tip",
    "subtitle": "Pick the console path by situation",
    "commands": [
      {
        "id": "serial-tips-card",
        "desc": "Pick the console path by situation",
        "cmd": "ipmiconsole -h $BMC -u $BMC_USER -P --dont-steal",
        "details": "OS hung but BMC alive → SOL (ipmiconsole, ipmitool sol activate, or the conserver entry). BMC unreachable or a switch with no network → USB serial and picocom. Console that several people need, or one you want logged → ser2net or conserver.",
        "flags": [
          [
            "SOL",
            "Through the BMC network"
          ],
          [
            "USB serial",
            "When the network is the problem"
          ]
        ],
        "tip": "Log every console session to the case folder",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmiconsole.8.en.html",
              "title": "FreeIPMI ipmiconsole(8)"
            },
            {
              "url": "https://github.com/npat-efault/picocom/blob/master/picocom.1.md",
              "title": "picocom(1)"
            },
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/README.rst",
              "title": "ser2net README"
            },
            {
              "url": "https://www.conserver.com/docs/conserver.cf.man.html",
              "title": "conserver.cf(5)"
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
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("bmc-tools.html", "bmc-tools_bookmarks", BMC_HUB_DATA, {"racadm":"racadm_bookmarks","ilorest":"ilorest_bookmarks","supermicro-saa":"supermicro-saa_bookmarks","onecli":"onecli_bookmarks","freeipmi":"freeipmi_bookmarks","serial-console":"serial-console_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("bmc-tools_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(BMC_HUB_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: BMC_HUB_DATA, label: "BMC vendor tools sheets", parts: {
   "freeipmi": {
    "title": "GNU FreeIPMI",
    "subtitle": "The vendor-neutral IPMI toolkit: password prompt instead of -p, host ranges for whole racks, and readable SEL output",
    "pill": "FreeIPMI 1.6.20"
   },
   "ilorest": {
    "title": "HPE iLOrest",
    "subtitle": "Log in, server info and state, IML/IEL/AHS logs, storage, BIOS settings, power and firmware on HPE ProLiant",
    "pill": "iLOrest 7.4.0.0"
   },
   "onecli": {
    "title": "Lenovo OneCLI",
    "subtitle": "Health, inventory, event logs, settings, firmware compare and service data on Lenovo ThinkSystem",
    "pill": "OneCLI 5.7.0"
   },
   "racadm": {
    "title": "Dell racadm",
    "subtitle": "System info, SEL and Lifecycle log, inventory, storage, power, BIOS jobs and SupportAssist collections on Dell PowerEdge",
    "pill": "iDRAC9 7.x RACADM"
   },
   "serial-console": {
    "title": "Serial consoles",
    "subtitle": "Talk to a switch or server console over USB serial, share it on the network with ser2net, and log every console with conserver",
    "pill": "ser2net 4.6.8 · conserver 8.3.0"
   },
   "supermicro-saa": {
    "title": "Supermicro SAA",
    "subtitle": "Supermicro's all-in-one CLI (formerly SUM): system, BIOS, BMC, event log, sensors, PSUs, GPUs and firmware",
    "pill": "SAA · X12/H12 and newer"
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
  const allCards = BMC_HUB_DATA;
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

  for (const card of BMC_HUB_DATA) {
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
        localStorage.setItem("bmc-tools_bookmarks", JSON.stringify([...state.bookmarks]));
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
