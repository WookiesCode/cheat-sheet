// dmi-hw.js
// Standalone interactive cheat sheet for DMI / SMBIOS, FRU & Motherboard Inventory
const DMI_HW_DATA = [
  {
    "id": "dmi-hw-card-1",
    "badge": "dmi",
    "title": "DMI / SMBIOS: System manufacturer, product name, service tag /...",
    "subtitle": "Query system manufacturer, product name, service tag / serial number, UUID & BIOS revision",
    "commands": [
      {
        "id": "dmidecode-system-bios",
        "desc": "Query system manufacturer, product name, service tag / serial number, UUID & BIOS revision",
        "cmd": "dmidecode -t system -t bios -t baseboard -t chassis",
        "details": "Reads the motherboard SMBIOS/DMI table directly via /dev/mem or /sys/firmware/dmi/tables. Essential for verifying server asset tags, chassis serial numbers, motherboard revision, and BIOS firmware version without rebooting or logging into the BMC.",
        "flags": [
          [
            "-t system",
            "DMI Type 1: System Manufacturer, Product Name, Serial Number, SKU & UUID"
          ],
          [
            "-t bios",
            "DMI Type 0: BIOS Vendor, Version, Release Date & firmware revision"
          ],
          [
            "-t baseboard",
            "DMI Type 2: Motherboard model, serial, asset tag & physical location"
          ],
          [
            "-t chassis",
            "DMI Type 3: Rack chassis type, lock status, serial & height (U)"
          ]
        ],
        "subcommands": [
          [
            "dmidecode -s system-serial-number",
            "Print only the server chassis/system serial number"
          ],
          [
            "dmidecode -s system-product-name",
            "Print only the server model (e.g. PowerEdge, ProLiant, Supermicro)"
          ],
          [
            "dmidecode -s bios-version && dmidecode -s bios-release-date",
            "Print only the active BIOS version and release date"
          ],
          [
            "dmidecode -t slot",
            "DMI Type 9: List all physical PCIe riser slots and whether each slot is In Use or Available"
          ]
        ],
        "tip": "Instant FRU / Serial lookup",
        "tags": [
          "dmidecode",
          "serial",
          "bios",
          "motherboard",
          "fru",
          "asset",
          "datacenter"
        ]
      }
    ]
  },
  {
    "id": "dmi-hw-card-2",
    "badge": "dmi",
    "title": "DMI / SMBIOS: Physical RAM DIMM slots, populated vs empty sock...",
    "subtitle": "Inspect physical RAM DIMM slots, populated vs empty sockets, DDR speed, manufacturer & part numbers",
    "commands": [
      {
        "id": "dmidecode-memory-dimms",
        "desc": "Inspect physical RAM DIMM slots, populated vs empty sockets, DDR speed, manufacturer & part numbers",
        "cmd": "dmidecode -t memory | grep -E 'Size:|Locator:|Bank Locator:|Type:|Speed:|Configured Memory Speed:|Manufacturer:|Serial Number:|Part Number:'",
        "details": "Queries DMI Type 16 (Physical Memory Array) and Type 17 (Memory Device). Crucial for data center techs replacing a faulty DIMM or verifying that all populated channels are running at their rated MT/s speed and matching part numbers.",
        "flags": [
          [
            "-t memory",
            "DMI Types 16 & 17: Physical memory array capacity and individual DIMM slot details"
          ],
          [
            "Locator",
            "Silkscreened motherboard DIMM slot label (e.g., PROC 1 DIMM 1A, P0_MC0_DIMM_A0)"
          ],
          [
            "Configured Memory Speed",
            "Actual negotiated DDR4/DDR5 transfer rate (check for downclocking)"
          ]
        ],
        "subcommands": [
          [
            "dmidecode -t 16",
            "Show maximum supported memory capacity, error correction type (Multi-bit ECC), and total slot count"
          ],
          [
            "dmidecode -t 17 | awk '/Memory Device/,/^$/' | grep -E 'Locator:|Size:'",
            "Compact list of every motherboard DIMM slot and whether it is populated or 'No Module Installed'"
          ],
          [
            "lshw -short -C memory",
            "Concise summary of system RAM banks and populated DIMM sizes"
          ]
        ],
        "tip": "Maps OS to motherboard silkscreen",
        "tags": [
          "dimm",
          "ram",
          "memory",
          "ddr5",
          "ddr4",
          "slot",
          "part-number",
          "dmidecode"
        ]
      }
    ]
  },
  {
    "id": "dmi-hw-card-3",
    "badge": "dmi",
    "title": "DMI / SMBIOS: Redundant Power Supply Units (PSU wattage, seria...",
    "subtitle": "Inspect redundant Power Supply Units (PSU wattage, serial, status) and CPU socket population",
    "commands": [
      {
        "id": "dmidecode-psu-cpu",
        "desc": "Inspect redundant Power Supply Units (PSU wattage, serial, status) and CPU socket population",
        "cmd": "dmidecode -t 39 && dmidecode -t processor",
        "details": "DMI Type 39 reports installed server power supplies, their max power capacity (e.g., 1600W/2400W), part/serial numbers, and whether each PSU is Present and OK. DMI Type 4 reports physical CPU sockets, voltage, external clock, and enabled core counts.",
        "flags": [
          [
            "-t 39",
            "DMI Type 39: System Power Supply (Status, Plugged/Unplugged, Max Power Capacity)"
          ],
          [
            "-t processor",
            "DMI Type 4: Socket designation (CPU0/CPU1), family, voltage, max/current speed"
          ]
        ],
        "subcommands": [
          [
            "dmidecode -s processor-version",
            "Print exact CPU model strings for all populated sockets"
          ],
          [
            "cat /sys/class/dmi/id/product_name /sys/class/dmi/id/product_serial",
            "Read product name and serial without root if permissions allow (/sys/class/dmi/id/)"
          ]
        ],
        "tags": [
          "psu",
          "power-supply",
          "cpu",
          "socket",
          "dmidecode",
          "datacenter"
        ]
      }
    ]
  },
  {
    "id": "dmi-hw-card-4",
    "badge": "dmi",
    "title": "DMI / SMBIOS: Complete hardware inventory tree with bus addres...",
    "subtitle": "Generate complete hardware inventory tree with bus addresses (PCI/USB/SCSI/NVMe) and driver status",
    "commands": [
      {
        "id": "lshw-hardware-tree",
        "desc": "Generate complete hardware inventory tree with bus addresses (PCI/USB/SCSI/NVMe) and driver status",
        "cmd": "lshw -short -businfo",
        "details": "Probes DMI, sysfs, PCI, USB, and storage subsystems to map physical hardware paths (e.g., pci@0000:3b:00.0) to Linux device names (eth0, nvme0n1) and hardware classes. Spots 'UNCLAIMED' devices missing a kernel driver.",
        "flags": [
          [
            "-short",
            "Compact tabular hardware tree"
          ],
          [
            "-businfo",
            "Include PCI/USB/SCSI/NVMe bus addresses for physical slot tracing"
          ]
        ],
        "subcommands": [
          [
            "lshw -C network -businfo",
            "List all NIC ports with PCIe bus address, logical interface name, MAC, and link state"
          ],
          [
            "lshw -C storage -C disk",
            "List all storage controllers (RAID/HBA/NVMe) and attached physical disks"
          ],
          [
            "lshw -json > /tmp/server-hw-manifest.json",
            "Export full machine-readable hardware manifest for DCIM asset ingestion"
          ]
        ],
        "tip": "Look for UNCLAIMED devices",
        "tags": [
          "lshw",
          "inventory",
          "businfo",
          "unclaimed",
          "driver",
          "manifest"
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("dmi-hw_bookmarks") || "[]"))
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
  const totalCommands = DMI_HW_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of DMI_HW_DATA) {
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

  for (const section of DMI_HW_DATA) {
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
        localStorage.setItem("dmi-hw_bookmarks", JSON.stringify([...state.bookmarks]));
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
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  } else {
    document.documentElement.removeAttribute("data-theme");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
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
