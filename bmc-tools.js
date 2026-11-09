// bmc-tools.js
// Standalone interactive cheat sheet for BMC vendor tools: BMC Vendor Tools Hub (racadm, iLOrest, SAA, OneCLI, FreeIPMI, serial)
const BMC_HUB_DATA = [
  {
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
    "id": "racadm-pro-tips",
    "badge": "tip",
    "title": "Dell racadm: Pro Tip",
    "subtitle": "Firmware from a Dell Update Package (changes state)",
    "commands": [
      {
        "id": "racadm-tips-card",
        "desc": "Firmware from a Dell Update Package (changes state)",
        "cmd": "racadm -r $BMC -u $BMC_USER -p \"$BMC_PASS\" update -f <update-file>",
        "details": "update -f takes a Dell Update Package (.exe, .d9, .pm, .sc). update -f Catalog.xml -t HTTPS -l <repo> updates from a repository. update viewreport shows the result. Drain first, and check the job queue afterwards.",
        "flags": [
          [
            "update viewreport",
            "Result of the last update"
          ],
          [
            "--reboot",
            "Graceful reboot after the update"
          ]
        ],
        "tip": "Firmware changes need a drain and approval",
        "tags": [
          "bmc",
          "remote-management",
          "racadm",
          "tips",
          "best-practice"
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
            "iLO and UEFI firmware from a URL (changes state)"
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
      }
    ]
  },
  {
    "id": "saa-cmd-2",
    "badge": "saa",
    "title": "Supermicro SAA: System, BIOS and BMC firmware information",
    "subtitle": "System, BIOS and BMC firmware information",
    "commands": [
      {
        "id": "saa-sysinfo",
        "desc": "System, BIOS and BMC firmware information",
        "cmd": "sudo ./saa -c GetSystemInfo",
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
        ]
      },
      {
        "id": "saa-sysinfo-sub-1",
        "desc": "BIOS version and build date",
        "cmd": "sudo ./saa -c GetBiosInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "sysinfo",
          "bios",
          "bmc"
        ]
      },
      {
        "id": "saa-sysinfo-sub-2",
        "desc": "BMC firmware version",
        "cmd": "sudo ./saa -c GetBmcInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "sysinfo",
          "bios",
          "bmc"
        ]
      },
      {
        "id": "saa-sysinfo-sub-3",
        "desc": "Serial numbers for the RMA",
        "cmd": "sudo ./saa -c GetFruInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "sysinfo",
          "bios",
          "bmc"
        ]
      }
    ]
  },
  {
    "id": "saa-cmd-3",
    "badge": "saa",
    "title": "Supermicro SAA: BMC event log and sensor status",
    "subtitle": "BMC event log and sensor status",
    "commands": [
      {
        "id": "saa-eventlog",
        "desc": "BMC event log and sensor status",
        "cmd": "sudo ./saa -c GetEventLog --info",
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
        ]
      },
      {
        "id": "saa-eventlog-sub-1",
        "desc": "Save the log for the case",
        "cmd": "sudo ./saa -c GetEventLog --info --file EventLog.txt --overwrite",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "eventlog",
          "sel",
          "sensors"
        ]
      },
      {
        "id": "saa-eventlog-sub-2",
        "desc": "Sensors",
        "cmd": "sudo ./saa -c CheckSensorData --action Show",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "eventlog",
          "sel",
          "sensors"
        ]
      },
      {
        "id": "saa-eventlog-sub-3",
        "desc": "PSU status",
        "cmd": "sudo ./saa -c GetPsuInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "eventlog",
          "sel",
          "sensors"
        ]
      }
    ]
  },
  {
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
        ]
      }
    ]
  },
  {
    "id": "saa-cmd-5",
    "badge": "saa",
    "title": "Supermicro SAA: GPU and CPLD firmware information",
    "subtitle": "GPU and CPLD firmware information",
    "commands": [
      {
        "id": "saa-gpu",
        "desc": "GPU and CPLD firmware information",
        "cmd": "sudo ./saa -c GetGpuInfo",
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
        ]
      },
      {
        "id": "saa-gpu-sub-1",
        "desc": "Motherboard CPLD version",
        "cmd": "sudo ./saa -c GetCpldInfo",
        "tags": [
          "bmc",
          "remote-management",
          "saa",
          "recipe",
          "gpu",
          "hgx",
          "cpld"
        ]
      }
    ]
  },
  {
    "id": "saa-pro-tips",
    "badge": "tip",
    "title": "Supermicro SAA: Pro Tip",
    "subtitle": "Firmware updates and BMC reset (change state)",
    "commands": [
      {
        "id": "saa-tips-card",
        "desc": "Firmware updates and BMC reset (change state)",
        "cmd": "sudo ./saa -c UpdateBios --file <bios-image>",
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
            "Audit, Platform, or both event logs"
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
        ]
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
        ]
      }
    ]
  },
  {
    "id": "onecli-cmd-3",
    "badge": "onecli",
    "title": "Lenovo OneCLI: Full inventory report",
    "subtitle": "Full inventory report (in-band)",
    "commands": [
      {
        "id": "onecli-inventory",
        "desc": "Full inventory report (in-band)",
        "cmd": "sudo ./OneCli inventory getinfor --output ./inventory --htmlreport",
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
        ]
      },
      {
        "id": "onecli-inventory-sub-1",
        "desc": "Categories: system_overview, bmc_event_logs, …",
        "cmd": "sudo ./OneCli inventory getdevices",
        "tags": [
          "bmc",
          "remote-management",
          "onecli",
          "recipe",
          "inventory",
          "getinfor",
          "report"
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
      }
    ]
  },
  {
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
            "Replaced by power in OneCLI 5.3.0"
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
      }
    ]
  },
  {
    "id": "freeipmi-pro-tips",
    "badge": "tip",
    "title": "GNU FreeIPMI: Pro Tip",
    "subtitle": "Credentials in a config file instead of on the command line",
    "commands": [
      {
        "id": "freeipmi-tips-card",
        "desc": "Credentials in a config file instead of on the command line",
        "cmd": "sudo install -m 600 /dev/null /etc/freeipmi/freeipmi.conf",
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
      },
      {
        "id": "serial-picocom-sub-2",
        "desc": "Which ttyUSB the adapter just became",
        "cmd": "sudo dmesg -T | grep -i tty",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ]
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
        ]
      }
    ]
  },
  {
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
            "/etc/ser2net.yaml",
            "Config file since ser2net 4 (YAML)"
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
      }
    ]
  },
  {
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("bmc-tools_bookmarks") || "[]"); } catch (e) { return []; } })())
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
