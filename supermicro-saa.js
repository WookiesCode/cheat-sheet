// supermicro-saa.js
// Standalone interactive cheat sheet for BMC vendor tools: Supermicro SAA: SuperServer Automation Assistant
const BMC_SUPERMICRO_SAA_DATA = [
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
        "cmd": "sudo ./saa -c GetBiosInfo",
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
        "cmd": "sudo ./saa -c GetBmcInfo",
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
        "cmd": "sudo ./saa -c GetFruInfo",
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
        "cmd": "sudo ./saa -c GetEventLog --info --file EventLog.txt --overwrite",
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
        "cmd": "sudo ./saa -c CheckSensorData --action Show",
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
        "cmd": "sudo ./saa -c GetPsuInfo",
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
        "cmd": "sudo ./saa -c GetCpldInfo",
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
  }
];

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("supermicro-saa_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = BMC_SUPERMICRO_SAA_DATA;
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

  for (const card of BMC_SUPERMICRO_SAA_DATA) {
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
        localStorage.setItem("supermicro-saa_bookmarks", JSON.stringify([...state.bookmarks]));
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
