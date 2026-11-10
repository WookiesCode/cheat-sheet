// onecli.js
// Standalone interactive cheat sheet for BMC vendor tools: Lenovo XClarity Essentials OneCLI: XCC from the Command Line
const BMC_ONECLI_DATA = [
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
  }
];

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("onecli_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = BMC_ONECLI_DATA;
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

  for (const card of BMC_ONECLI_DATA) {
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
        localStorage.setItem("onecli_bookmarks", JSON.stringify([...state.bookmarks]));
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
