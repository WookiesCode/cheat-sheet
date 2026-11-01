// nvme-smart.js
// Standalone interactive cheat sheet for Enterprise NVMe, SMART, RAID & Drive Bay LEDs
const NVME_SMART_DATA = [
  {
    "id": "nvme-smart-card-1",
    "badge": "nvm",
    "title": "Enterprise NVMe: All NVMe namespaces (model, serial, FW) and insp...",
    "subtitle": "List all NVMe namespaces (model, serial, FW) and inspect SMART health log for wear, spare & media errors",
    "commands": [
      {
        "id": "nvme-list-smart",
        "desc": "List all NVMe namespaces (model, serial, FW) and inspect SMART health log for wear, spare & media errors",
        "cmd": "nvme list && nvme smart-log /dev/nvme0",
        "details": "Queries NVMe admin controller logs. For datacenter drive replacement triage, check 'critical_warning' (must be 0), 'available_spare' vs 'available_spare_threshold', 'percentage_used' (endurance wear), 'media_errors' (unrecovered NAND reads), and 'unsafe_shutdowns'.",
        "flags": [
          [
            "nvme list",
            "Tabular list of all /dev/nvmeXnY block devices, serial numbers, capacities, and firmware"
          ],
          [
            "smart-log",
            "Read NVMe SMART / Health Information Log (Log Page 02h)"
          ],
          [
            "media_errors",
            "Count of unrecovered data integrity errors on NAND media (non-zero = replace drive)"
          ]
        ],
        "subcommands": [
          [
            "nvme error-log /dev/nvme0 --log-entries=16",
            "Inspect recent controller command errors and status codes"
          ],
          [
            "nvme id-ctrl /dev/nvme0 | grep -E 'mn |sn |fr |ver |tnvmcap'",
            "Identify controller model (mn), serial (sn), firmware revision (fr), and total NVM capacity"
          ],
          [
            "nvme list-subsys",
            "Display NVMe multipath subsystems and PCIe BDF addresses for each controller"
          ]
        ],
        "tip": "Check media_errors & percentage_used",
        "tags": [
          "nvme",
          "nvme-cli",
          "smart",
          "ssd",
          "wear",
          "endurance",
          "firmware"
        ]
      }
    ]
  },
  {
    "id": "nvme-smart-card-2",
    "badge": "nvm",
    "title": "Enterprise NVMe: Cryptographically secure-erase an enterprise NVM...",
    "subtitle": "Cryptographically secure-erase an enterprise NVMe drive or update controller firmware online",
    "commands": [
      {
        "id": "nvme-format-fw",
        "desc": "Cryptographically secure-erase an enterprise NVMe drive or update controller firmware online",
        "cmd": "nvme format /dev/nvme0n1 --ses=1 --force",
        "details": "Executes an NVMe Format NVM Admin command. '--ses=1' performs a User Data Erase; '--ses=2' performs an instant Cryptographic Erase by destroying and regenerating the internal media encryption key. Can also switch logical block size (4096B vs 512B) via '--lbaf'.",
        "flags": [
          [
            "--ses=1",
            "Secure Erase Setting: 1 = User Data Erase, 2 = Cryptographic Erase (instant key wipe)"
          ],
          [
            "--lbaf=<N>",
            "LBA Format index (check 'nvme id-ns /dev/nvme0n1' for 512B vs 4K sector formats)"
          ]
        ],
        "subcommands": [
          [
            "nvme id-ns /dev/nvme0n1 -H | grep 'LBA Format'",
            "Check supported sector sizes (512B vs 4096B 4Kn) and active LBA format"
          ],
          [
            "nvme fw-download /dev/nvme0 --fw=firmware.bin && nvme fw-commit /dev/nvme0 --slot=1 --action=1",
            "Download firmware image to NVMe controller and activate it on slot 1"
          ],
          [
            "blkdiscard -v /dev/nvme0n1",
            "Discard (TRIM/Deallocate) all blocks on an SSD/NVMe device prior to re-partitioning"
          ]
        ],
        "danger": "Irreversibly erases all data on target namespace",
        "tags": [
          "nvme",
          "secure-erase",
          "format",
          "firmware",
          "4kn",
          "blkdiscard",
          "wipe"
        ]
      }
    ]
  },
  {
    "id": "nvme-smart-card-3",
    "badge": "nvm",
    "title": "Enterprise NVMe: SATA/SAS/NVMe SMART health attributes, grown def...",
    "subtitle": "Inspect SATA/SAS/NVMe SMART health attributes, grown defect lists, and trigger background self-tests",
    "commands": [
      {
        "id": "smartctl-disk-triage",
        "desc": "Inspect SATA/SAS/NVMe SMART health attributes, grown defect lists, and trigger background self-tests",
        "cmd": "smartctl -x /dev/sda",
        "details": "Reads complete SMART and extended device statistics. On SATA drives, check IDs 5 (Reallocated_Sector_Ct), 187 (Reported_Uncorrect), 197 (Current_Pending_Sector), and 198 (Offline_Uncorrectable). On SAS drives, check 'Elements in grown defect list' and 'Non-medium error count'.",
        "flags": [
          [
            "-x",
            "Print all SMART + Extended info (error logs, self-test history, Phy event counters)"
          ],
          [
            "-H",
            "Print brief SMART overall-health self-assessment test result (PASSED / FAILED)"
          ],
          [
            "-a",
            "Print standard SMART attributes, capabilities, and error logs"
          ]
        ],
        "subcommands": [
          [
            "smartctl -t short /dev/sda && smartctl -l selftest /dev/sda",
            "Run a 2-minute captive/background short self-test and view test log results"
          ],
          [
            "smartctl -a -d megaraid,0 /dev/bus/0",
            "Query physical disk #0 behind a Broadcom/LSI MegaRAID hardware RAID controller"
          ],
          [
            "smartctl --scan",
            "Scan and list all SMART-capable storage devices and RAID enclosures"
          ]
        ],
        "tip": "Watch Reallocated & Pending sectors",
        "tags": [
          "smartctl",
          "smart",
          "sata",
          "sas",
          "hdd",
          "ssd",
          "megaraid",
          "defects"
        ]
      }
    ]
  },
  {
    "id": "nvme-smart-card-4",
    "badge": "nvm",
    "title": "Enterprise NVMe: Linux software RAID (mdadm) array health, sync p...",
    "subtitle": "Inspect Linux software RAID (mdadm) array health, sync progress, and hot-swap a failed disk",
    "commands": [
      {
        "id": "mdadm-raid-ops",
        "desc": "Inspect Linux software RAID (mdadm) array health, sync progress, and hot-swap a failed disk",
        "cmd": "cat /proc/mdstat && mdadm --detail /dev/md0",
        "details": "Shows active mdraid personalities (RAID1/RAID5/RAID6/RAID10), member disk states ([UU] = healthy, [U_] = degraded), and rebuild speed. When replacing a failed drive in a rack server, mark it faulty, remove it, physically swap the sled, and re-add the replacement.",
        "flags": [
          [
            "/proc/mdstat",
            "Live kernel status of all active md RAID arrays and rebuild percentage"
          ],
          [
            "--detail",
            "Detailed array UUID, layout, state (clean/degraded/recovering), and member disk roles"
          ]
        ],
        "subcommands": [
          [
            "mdadm --manage /dev/md0 --fail /dev/sdb1 --remove /dev/sdb1",
            "Mark a failing partition as faulty and detach it from /dev/md0 before physical drive pull"
          ],
          [
            "mdadm --manage /dev/md0 --add /dev/sdb1",
            "Add newly inserted replacement drive partition into /dev/md0 to start rebuild"
          ],
          [
            "mdadm --examine /dev/sd[a-z]1",
            "Inspect RAID superblocks directly on member partitions"
          ],
          [
            "mdadm --detail --scan | tee -a /etc/mdadm/mdadm.conf && update-initramfs -u",
            "Save active RAID array definitions to mdadm.conf and update Ubuntu initramfs"
          ]
        ],
        "tags": [
          "mdadm",
          "raid",
          "mdstat",
          "degraded",
          "rebuild",
          "hotswap"
        ]
      }
    ]
  },
  {
    "id": "nvme-smart-card-5",
    "badge": "nvm",
    "title": "Enterprise NVMe: Blink physical drive bay Fault/Locate LEDs (ledc...",
    "subtitle": "Blink physical drive bay Fault/Locate LEDs (ledctl) and map SCSI/SAS HBA enclosure slots",
    "commands": [
      {
        "id": "ledctl-lsscsi-multipath",
        "desc": "Blink physical drive bay Fault/Locate LEDs (ledctl) and map SCSI/SAS HBA enclosure slots",
        "cmd": "ledctl locate=/dev/nvme0n1 && lsscsi -g -s -t",
        "details": "In a 24-bay server chassis, pulling the wrong drive can take down an array. 'ledctl' (from 'ledmon' package) drives SGPIO/SES-2/VMD backplane LEDs so the technician can visually verify the blinking bay before ejecting the carrier.",
        "flags": [
          [
            "locate=/dev/...",
            "Turn on the blue/amber Locate LED on the backplane slot for the specified block device"
          ],
          [
            "locate_off=/dev/...",
            "Turn off the Locate LED once the drive has been identified"
          ],
          [
            "lsscsi -g -s -t",
            "Show SCSI/SAS [Host:Channel:Target:LUN] tuple, SAS transport address, sg device, and size"
          ]
        ],
        "subcommands": [
          [
            "ledctl normal=/dev/nvme0n1",
            "Reset the drive bay backplane LED back to normal state"
          ],
          [
            "multipath -ll",
            "Display Device-Mapper Multipath topology, active/passive HBA paths, and LUN WWIDs"
          ]
        ],
        "tip": "Never pull a drive without blinking LED",
        "tags": [
          "ledctl",
          "lsscsi",
          "multipath",
          "backplane",
          "led",
          "hotswap",
          "sas"
        ]
      }
    ]
  }
];

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("nvme-smart_bookmarks") || "[]"))
};

// DOM References
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
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
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied command to clipboard");
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
  showToast("Copied command to clipboard");
}

function highlightCommand(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return `<span class="tok-str">${strLiteral}</span>`;
      if (flagPart) return `<span class="tok-flag">${flagPart}</span>`;
      if (operatorPart) return `<span class="tok-pipe">${operatorPart}</span>`;
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? `<span class="tok-pipe">${sudoPart}</span>` : "";
        return `${prefix}${sudoHtml}<span class="tok-cmd">${cmdName}</span>`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = NVME_SMART_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of NVME_SMART_DATA) {
    const isSelected = state.activeCategory === section.id ? "selected" : "";
    optionsHtml.push(
      `<option value="${section.id}" ${isSelected}>${escapeHtml(section.title)} (${section.commands.length})</option>`
    );
  }

  const resetBtnHtml =
    state.activeCategory !== "all"
      ? `<button type="button" class="cat-reset-btn" data-cat="all" title="Show all sections">✕ Show All</button>`
      : "";

  categoryTabsEl.innerHTML = `
    <div class="cat-select-wrapper">
      <select id="cat-select" class="cat-select" aria-label="Filter by section">
        ${optionsHtml.join("")}
      </select>
      <span class="cat-select-arrow" aria-hidden="true">▾</span>
    </div>
    ${resetBtnHtml}
  `;

  const sel = document.getElementById("cat-select");
  if (sel) {
    sel.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderSections();
      renderCategoryTabs();
    });
  }

  const resetBtn = categoryTabsEl.querySelector(".cat-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.activeCategory = "all";
      renderSections();
      renderCategoryTabs();
    });
  }
}

function matchesSearch(cmdObj, terms) {
  if (terms.length === 0) return true;
  const haystack = [
    cmdObj.desc || "",
    cmdObj.cmd || "",
    cmdObj.details || "",
    cmdObj.tip || "",
    ...(cmdObj.tags || []),
    ...(cmdObj.flags || []).flat(),
    ...(cmdObj.subcommands || []).flat()
  ].join(" ").toLowerCase();

  return terms.every((t) => haystack.includes(t));
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

  for (const section of NVME_SMART_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const filteredCommands = section.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) return false;
      return matchesSearch(cmd, searchTerms);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const commandsHtml = filteredCommands.map((cmd) => {
      const isBookmarked = state.bookmarks.has(cmd.id);

      const flagsHtml = (cmd.flags && cmd.flags.length > 0)
        ? `<div class="flag-pills">${cmd.flags.map(([f, d]) =>
            `<span class="flag-pill"><strong class="flag-token">${escapeHtml(f)}</strong> <span class="flag-desc">${escapeHtml(d)}</span></span>`
          ).join("")}</div>`
        : "";

      const subcommandsHtml = (cmd.subcommands && cmd.subcommands.length > 0)
        ? `<div class="subcmd-list">${cmd.subcommands.map(([sc, sd]) =>
            `<div class="subcmd-row" data-subcmd="${escapeHtml(sc)}">
              <span class="subcmd-code">${escapeHtml(sc)}</span>
              <span class="subcmd-desc">${escapeHtml(sd)}</span>
              <button type="button" class="subcmd-copy-btn" title="Copy subcommand" aria-label="Copy subcommand">
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/></svg>
              </button>
            </div>`
          ).join("")}</div>`
        : "";

      const detailsHtml = cmd.details
        ? `<p class="cmd-details">${escapeHtml(cmd.details)}</p>`
        : "";

      const tipHtml = cmd.tip
        ? `<div class="cmd-tip"><span class="tip-badge">TIP</span>${escapeHtml(cmd.tip)}</div>`
        : "";

      return `
        <div class="cmd-item" id="cmd-${escapeHtml(cmd.id)}" data-cmd-id="${escapeHtml(cmd.id)}">
          <div class="cmd-header-row">
            <span class="cmd-desc">${escapeHtml(cmd.desc)}</span>
            <button
              type="button"
              class="bookmark-btn ${isBookmarked ? "bookmarked" : ""}"
              data-cmd-id="${escapeHtml(cmd.id)}"
              title="${isBookmarked ? "Remove bookmark" : "Bookmark this recipe"}"
              aria-label="${isBookmarked ? "Remove bookmark" : "Bookmark this recipe"}"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path fill="${isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          <div class="cmd-code-box" data-cmd="${escapeHtml(cmd.cmd)}">
            <pre class="cmd-code"><code>${highlightCommand(cmd.cmd)}</code></pre>
            <button type="button" class="copy-btn" title="Copy command" aria-label="Copy command">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Copy</span>
            </button>
          </div>

          ${detailsHtml}
          ${flagsHtml}
          ${subcommandsHtml}
          ${tipHtml}
        </div>
      `;
    }).join("");

    cardsHtml.push(`
      <div class="section-card" id="sec-${escapeHtml(section.id)}">
        <div class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">${escapeHtml(section.badge)}</span>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
          </div>
          <span class="cmd-count-badge">${filteredCommands.length}</span>
        </div>
        <div class="section-body">
          ${commandsHtml}
        </div>
      </div>
    `);
  }

  sectionsContainer.innerHTML = cardsHtml.join("");
  visibleCountEl.textContent = visibleCommandsCount;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
    sectionsContainer.classList.add("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
    sectionsContainer.classList.remove("hidden");
    packMasonry();
  }
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

  densityToggleBtn.addEventListener("click", () => {
    state.compact = !state.compact;
    document.body.classList.toggle("compact-mode", state.compact);
    densityLabel.textContent = state.compact ? "Normal" : "Compact";
    localStorage.setItem("linux_cs_compact", state.compact ? "1" : "0");
    packMasonry();
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
    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
      const codeBox = copyBtn.closest(".cmd-code-box");
      const cmdText = codeBox ? codeBox.getAttribute("data-cmd") : "";
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const subCopyBtn = e.target.closest(".subcmd-copy-btn");
    if (subCopyBtn) {
      const row = subCopyBtn.closest(".subcmd-row");
      const subcmdText = row ? row.getAttribute("data-subcmd") : "";
      if (subcmdText) copyToClipboard(subcmdText);
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
        localStorage.setItem("nvme-smart_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.CheatSheetCommon && typeof window.CheatSheetCommon.applyTheme === "function") {
    window.CheatSheetCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch (e) {}
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(state.theme);
  if (state.compact) {
    document.body.classList.add("compact-mode");
    densityLabel.textContent = "Normal";
  }
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
});
