// ecc-edac.js
// Standalone interactive cheat sheet for ECC Memory, EDAC, MCE & Thermal Triage
const ECC_EDAC_DATA = [
  {
    "id": "ecc-edac-card-1",
    "badge": "ecc",
    "title": "ECC Memory: Error Detection and Correction (EDAC) memory con...",
    "subtitle": "Check Error Detection and Correction (EDAC) memory controllers for Correctable (CE) & Uncorrectable (UE) ECC errors",
    "commands": [
      {
        "id": "edac-dimm-errors",
        "desc": "Check Error Detection and Correction (EDAC) memory controllers for Correctable (CE) & Uncorrectable (UE) ECC errors",
        "cmd": "edac-util -v && grep -H . /sys/devices/system/edac/mc/mc*/csrow*/ch*_ce_count /sys/devices/system/edac/mc/mc*/dimm*/dimm_*",
        "details": "Reads the Linux kernel EDAC subsystem to pinpoint exactly which memory controller (mc0/mc1), channel, and DIMM label is logging single-bit Correctable Errors (CE) or multi-bit Uncorrectable Errors (UE). High CE rates indicate a degrading DIMM that should be scheduled for replacement.",
        "flags": [
          [
            "edac-util -v",
            "Verbose summary of all memory controllers, chip-select rows, and error counts"
          ],
          [
            "dimm_label",
            "Motherboard silkscreen label mapped by EDAC driver"
          ],
          [
            "dimm_ce_count / dimm_ue_count",
            "Cumulative single-bit (CE) and multi-bit (UE) ECC error counters since boot"
          ]
        ],
        "subcommands": [
          [
            "edac-util --status",
            "Check whether the kernel EDAC driver is loaded and monitoring memory controllers"
          ],
          [
            "head -n 20 /sys/devices/system/edac/mc/mc*/dimm*/{dimm_label,dimm_location,dimm_ce_count,dimm_ue_count}",
            "Directly read per-DIMM labels and ECC error counts from sysfs (zero dependencies)"
          ]
        ],
        "tip": "Pinpoints bad DIMM slot in OS",
        "tags": [
          "ecc",
          "edac",
          "dimm",
          "memory-error",
          "ce",
          "ue",
          "ram"
        ]
      }
    ]
  },
  {
    "id": "ecc-edac-card-2",
    "badge": "ecc",
    "title": "ECC Memory: Ubuntu rasdaemon hardware error database for Mem...",
    "subtitle": "Query Ubuntu rasdaemon hardware error database for Memory ECC, PCIe AER, and CPU Machine Check Exceptions (MCE)",
    "commands": [
      {
        "id": "rasdaemon-mce-triage",
        "desc": "Query Ubuntu rasdaemon hardware error database for Memory ECC, PCIe AER, and CPU Machine Check Exceptions (MCE)",
        "cmd": "ras-mc-ctl --summary && ras-mc-ctl --errors",
        "details": "On modern Ubuntu servers, 'rasdaemon' replaces legacy 'mcelog' to record all hardware Reliability, Availability, and Serviceability (RAS) trace events into a persistent SQLite database (/var/lib/rasdaemon/ras-mc_event.db), preserving errors across reboots.",
        "flags": [
          [
            "--summary",
            "Aggregate count of Memory Controller, PCIe AER, Extlog, and CPU MCE errors"
          ],
          [
            "--errors",
            "Print detailed timestamped log of every recorded hardware error event"
          ]
        ],
        "subcommands": [
          [
            "ras-mc-ctl --mainboard",
            "Display mainboard vendor and model recognized by rasdaemon DIMM label database"
          ],
          [
            "journalctl -u rasdaemon.service --no-pager -n 50",
            "Inspect recent hardware error alerts logged by the rasdaemon systemd unit"
          ],
          [
            "dmesg -T | grep -iE 'mce|edac|hardware error|aer|ghES|apei'",
            "Search kernel ring buffer for ACPI APEI/GHES firmware-first hardware errors"
          ]
        ],
        "tags": [
          "rasdaemon",
          "ras-mc-ctl",
          "mce",
          "mcelog",
          "apei",
          "ghes",
          "hardware-error"
        ]
      }
    ]
  },
  {
    "id": "ecc-edac-card-3",
    "badge": "ecc",
    "title": "ECC Memory: CPU package/core temperatures, NVMe composite te...",
    "subtitle": "Monitor CPU package/core temperatures, NVMe composite temps, VRM voltages & chassis sensors",
    "commands": [
      {
        "id": "sensors-thermals",
        "desc": "Monitor CPU package/core temperatures, NVMe composite temps, VRM voltages & chassis sensors",
        "cmd": "sensors && cat /sys/class/thermal/thermal_zone*/{type,temp} 2>/dev/null | paste - -",
        "details": "Uses lm-sensors (coretemp / k10temp / drivetemp) and kernel thermal zones (millidegrees Celsius) to check if a server is overheating due to a failed heatsink fan, dried thermal paste, or blocked rack airflow.",
        "flags": [
          [
            "sensors",
            "Read all hwmon sensors (CPU Package id 0/1, core temps, NVMe composite temp)"
          ],
          [
            "thermal_zone*/temp",
            "Raw temperature in millidegrees Celsius (e.g. 45000 = 45.0°C)"
          ]
        ],
        "subcommands": [
          [
            "watch -n 1 sensors",
            "Live 1-second refresh of all CPU and board temperature sensors"
          ],
          [
            "grep -H . /sys/devices/system/cpu/cpu0/thermal_throttle/*_count",
            "Check if CPU0 has experienced core or package thermal throttling events since boot"
          ]
        ],
        "tags": [
          "sensors",
          "temperature",
          "thermal",
          "overheating",
          "throttling",
          "fan",
          "hwmon"
        ]
      }
    ]
  },
  {
    "id": "ecc-edac-card-4",
    "badge": "ecc",
    "title": "ECC Memory: Real-time x86 CPU telemetry: actual core MHz, bu...",
    "subtitle": "Real-time x86 CPU telemetry: actual core MHz, busy%, C-state residency, SMI interrupts & package wattage",
    "commands": [
      {
        "id": "turbostat-power-clocks",
        "desc": "Real-time x86 CPU telemetry: actual core MHz, busy%, C-state residency, SMI interrupts & package wattage",
        "cmd": "turbostat --Summary --quiet --show Busy%,Bzy_MHz,TSC_MHz,IRQ,SMI,PkgTmp,PkgWatt,RAMWatt --interval 2",
        "details": "Reads hardware Model-Specific Registers (MSRs) directly. Essential for diagnosing servers that feel 'slow': reveals if BIOS System Management Interrupts (SMI) are stalling cores, if CPU power capping is throttling frequency (Bzy_MHz), or how many Watts CPU & RAM are drawing.",
        "flags": [
          [
            "--Summary",
            "Print single aggregated system summary line per interval instead of 100+ core lines"
          ],
          [
            "Bzy_MHz",
            "Actual average clock speed (MHz) while cores are actively executing instructions"
          ],
          [
            "SMI",
            "BIOS System Management Interrupt count (non-zero spikes indicate firmware/ECC stalls)"
          ],
          [
            "PkgWatt / RAMWatt",
            "Real-time RAPL power consumption in Watts for CPU sockets and DRAM"
          ]
        ],
        "tip": "From linux-tools-common package",
        "tags": [
          "turbostat",
          "power",
          "wattage",
          "mhz",
          "throttling",
          "smi",
          "msr"
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("ecc-edac_bookmarks") || "[]"))
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
  const totalCommands = ECC_EDAC_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of ECC_EDAC_DATA) {
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

  for (const section of ECC_EDAC_DATA) {
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
        localStorage.setItem("ecc-edac_bookmarks", JSON.stringify([...state.bookmarks]));
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
