// mb-storage-bds-post.js
// Standalone interactive cheat sheet for Motherboards: Storage, USB, BIOS Setup & OS Handoff Codes (A0–DF, 00, AA)
const MB_MB_STORAGE_BDS_POST_DATA = [
  {
    "id": "storage-bds-post-cmd-1",
    "badge": "bds",
    "title": "Storage & Boot BDS: Decode SATA, SAS, M",
    "subtitle": "Decode SATA, SAS, M.2 NVMe, and USB bus initialization codes (`0x99`–`0xA7`, `0xB4`)",
    "commands": [
      {
        "id": "post-a0-a7-storage-usb",
        "desc": "Decode SATA, SAS, M.2 NVMe, and USB bus initialization codes (`0x99`–`0xA7`, `0xB4`)",
        "cmd": "POST 0x99 (Super IO)  ->  0x9C (USB Detect)  ->  0xA0 (IDE/AHCI Init)  ->  0xA2 (Drive Detect)  ->  0xB4 (USB Hotplug)",
        "details": "",
        "flags": [
          [
            "0x99 / 0x9A",
            "Super I/O initialization (99) and USB controller initialization started (9A)"
          ],
          [
            "0x9C / 0x9D",
            "USB Detect (9C — probing USB ports, KVM dongles, and BMC Virtual Media) and USB Enable (9D)"
          ],
          [
            "0xA0 / 0xA1",
            "IDE / SATA AHCI controller initialization started (A0) and reset (A1)"
          ]
        ],
        "tip": "Stuck on 0xA2 = unplug SATA/M.2 drives one by one to find the bad drive!",
        "tags": [
          "Storage & Boot BDS",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "99",
          "9c",
          "a0",
          "a1",
          "a2",
          "a3",
          "a4",
          "a6",
          "b4",
          "sata",
          "nvme",
          "usb",
          "virtual-media"
        ]
      }
    ]
  },
  {
    "id": "storage-bds-post-flags-1",
    "badge": "bds",
    "title": "Storage & Boot BDS: POST Hex Codes & Options",
    "subtitle": "Key hex codes, parameters, and error indicators for Decode SATA, SAS, M",
    "commands": [
      {
        "id": "post-a0-a7-storage-usb-flags-card",
        "desc": "Hex code lookup and diagnostics breakdown for Decode SATA, SAS, M",
        "cmd": "POST 0x99 (Super IO)  ->  0x9C (USB Detect)  ->  0xA0 (IDE/AHCI Init)  ->  0xA2 (Drive Detect)  ->  0xB4 (USB Hotplug)",
        "flags": [
          [
            "0xA2 / 0xA3",
            "IDE / SATA / M.2 Drive Detect (A2) and Enable (A3): Hang at 0xA2 = dead SATA DOM, failing M.2 SSD, or bad backplane SATA cable!"
          ],
          [
            "0xA4 / 0xA5 / 0xA6",
            "SCSI / SAS / NVMe backplane bus initialization (A4), reset (A5), and detect (A6)"
          ],
          [
            "0xB4",
            "USB Hot-Plug: Frequent pause point when a faulty USB flash drive or corrupted BMC Virtual Media ISO is mounted"
          ]
        ],
        "details": "Common operational and diagnostic POST / Q-Codes on ASUS and GIGABYTE server motherboards.",
        "tags": [
          "Storage & Boot BDS",
          "flags",
          "options",
          "syntax"
        ]
      }
    ]
  },
  {
    "id": "storage-bds-post-cmd-2",
    "badge": "bds",
    "title": "Storage & Boot BDS: Decode UEFI Setup entry, PXE/NVMe boot selection, and OS handoff codes",
    "subtitle": "Decode UEFI Setup entry, PXE/NVMe boot selection, and OS handoff codes (`0xA9`–`0xAE`, `0xAA`, `0x00`)",
    "commands": [
      {
        "id": "post-a9-ae-boot-handoff",
        "desc": "Decode UEFI Setup entry, PXE/NVMe boot selection, and OS handoff codes (`0xA9`–`0xAE`, `0xAA`, `0x00`)",
        "cmd": "POST 0xA9 (Start Setup)  ->  0xAB (Setup Input Wait)  ->  0xAD (Ready To Boot)  ->  0xAA / 0x00 (OS Running)",
        "details": "",
        "flags": [
          [
            "0xA9 / 0xAB",
            "Start of Setup (A9) and Setup Input Wait (AB): The server is NOT hung — it is sitting inside BIOS Setup or waiting for F1 on VGA/SOL!"
          ],
          [
            "0xAC",
            "Reserved for ASL / Entering UEFI Shell or boot menu selection"
          ],
          [
            "0xAD",
            "Ready To Boot Event: UEFI POST is 100% finished and handing control to GRUB / Linux EFI stub / PXE NBP"
          ]
        ],
        "tip": "0xAB means the board is waiting at the BIOS prompt (connect BMC KVM/SOL)!",
        "tags": [
          "Storage & Boot BDS",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "a9",
          "ab",
          "ac",
          "ad",
          "ae",
          "aa",
          "00",
          "ff",
          "bios",
          "setup",
          "grub",
          "boot",
          "acpi"
        ]
      }
    ]
  },
  {
    "id": "storage-bds-post-flags-2",
    "badge": "bds",
    "title": "Storage & Boot BDS: POST Hex Codes & Options",
    "subtitle": "Key hex codes, parameters, and error indicators for Decode UEFI Setup entry, PXE/NVMe boot selection, and OS handoff codes (`0xA9`–`0xAE`, `0xAA`, `0x00`)",
    "commands": [
      {
        "id": "post-a9-ae-boot-handoff-flags-card",
        "desc": "Hex code lookup and diagnostics breakdown for Decode UEFI Setup entry, PXE/NVMe boot selection, and OS handoff codes (`0xA9`–`0xAE`, `0xAA`, `0x00`)",
        "cmd": "POST 0xA9 (Start Setup)  ->  0xAB (Setup Input Wait)  ->  0xAD (Ready To Boot)  ->  0xAA / 0x00 (OS Running)",
        "flags": [
          [
            "0xAE",
            "Legacy Boot Event: Handing control to a legacy MBR bootloader"
          ],
          [
            "0xAA / 0xA0 (Normal Run)",
            "System has transitioned into ACPI APIC mode — OS is booted and running normally (ASUS Q-Code often rests on AA or A0 in Ubuntu)"
          ],
          [
            "0x00 / 0xFF (At Power-On)",
            "If stuck on 0x00 or 0xFF the instant power is pressed: CPU not executing reset vector (check 8-pin EPS12V cables, CPU VRMs, or BIOS flash)"
          ]
        ],
        "details": "Common operational and diagnostic POST / Q-Codes on ASUS and GIGABYTE server motherboards.",
        "tags": [
          "Storage & Boot BDS",
          "flags",
          "options",
          "syntax"
        ]
      }
    ]
  },
  {
    "id": "storage-bds-post-pro-tips",
    "badge": "tip",
    "title": "Storage & Boot BDS: Pro Tips & Best Practices",
    "subtitle": "Storage Detection, Boot Device Selection (BDS) & OS Handoff",
    "commands": [
      {
        "id": "storage-bds-post-tips-card",
        "desc": "Storage Detection, Boot Device Selection (BDS) & OS Handoff",
        "cmd": "lsblk -o NAME,MODEL,SERIAL,SIZE,FSTYPE,MOUNTPOINT && efibootmgr -v",
        "details": "Codes starting with 0xA indicate Boot Device Selection (BDS). A hang at 0xA2 (IDE/SATA Detect) typically points to a failing NVMe SSD, corrupt M.2 controller, or degraded backplane cable. 0xAA indicates successfully passing control to the ACPI OS (normal operating state).",
        "flags": [
          [
            "0xA2 (Storage Detect)",
            "SATA/NVMe drive detection hang: bad drive controller or broken backplane link"
          ],
          [
            "0xAD (Ready To Boot)",
            "UEFI handoff pending: check USB installer, NVMe bootloader, or PXE target"
          ],
          [
            "0xAA / 0x00 (OS Active)",
            "ACPI OS payload running normally; boot phase complete"
          ]
        ],
        "tip": "0xAD (Ready To Boot) means the system is waiting for boot media; check efibootmgr order or PXE timeout.",
        "tags": [
          "storage-bds-post",
          "tips",
          "pro",
          "motherboard",
          "post",
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
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("mb-storage-bds-post_bookmarks") || "[]"))
};

// DOM Elements
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

// Motherboard CLI / POST Syntax Highlighting
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
  const allCards = MB_MB_STORAGE_BDS_POST_DATA;
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

  for (const card of MB_MB_STORAGE_BDS_POST_DATA) {
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
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <button type="button" class="copy-btn" title="Copy command" aria-label="Copy command">',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
        '        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>',
        '      </svg>',
        '      <span class="copy-feedback">Copied!</span>',
        '    </button>',
        '  </div>',
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

    const codeBox = e.target.closest(".cmd-code-box");
    if (codeBox && !e.target.closest(".copy-btn")) {
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
        localStorage.setItem("mb-storage-bds-post_bookmarks", JSON.stringify([...state.bookmarks]));
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
    document.documentElement.setAttribute("data-theme", "dark");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  }
}

function init() {
  applyTheme(state.theme);
  if (state.compact) {
    document.body.classList.add("compact-mode");
    densityLabel.textContent = "Normal";
  }
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
