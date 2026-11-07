// racadm.js
// Standalone interactive cheat sheet for BMC vendor tools: Dell racadm: iDRAC from the Command Line
const BMC_RACADM_DATA = [
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
  }
];

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("racadm_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = BMC_RACADM_DATA;
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

  for (const card of BMC_RACADM_DATA) {
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
        localStorage.setItem("racadm_bookmarks", JSON.stringify([...state.bookmarks]));
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
