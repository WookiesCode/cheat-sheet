// mb-pcie-dxe-post.js
// Standalone interactive cheat sheet for Motherboards: PCIe, GPU, Riser & Option ROM POST Codes (60–99, d2–d8)
const MB_MB_PCIE_DXE_POST_DATA = [
  {
    "id": "pcie-dxe-post-cmd-1",
    "badge": "pci",
    "title": "PCIe & DXE Codes: Decode PCIe bus, riser card, GPU, and NVMe enumeration hangs",
    "subtitle": "Decode PCIe bus, riser card, GPU, and NVMe enumeration hangs (`0x91`–`0x99`)",
    "commands": [
      {
        "id": "post-91-96-pcie-enumeration",
        "desc": "Decode PCIe bus, riser card, GPU, and NVMe enumeration hangs (`0x91`–`0x99`)",
        "cmd": "POST 0x91 (PCIe Init)  ->  0x92 (Bridge/Riser Detect)  ->  0x94 (Bus Enumeration)  ->  0x96 (BAR Resources)",
        "details": "",
        "flags": [
          [
            "0x91",
            "PCI Bus Initialization is started: Root Complex beginning to probe CPU PCIe lanes"
          ],
          [
            "0x92",
            "PCI Bus Bridge initialization: Hung here = faulty PCIe riser card, unseated MCIO/SlimSAS cable, or dead PCIe switch"
          ],
          [
            "0x93",
            "PCI Bus Hot-Plug controller initialization"
          ],
          [
            "0x94",
            "PCI Bus Enumeration: Probing all endpoints (GPUs, ConnectX NICs, U.2 NVMe). Hang at 0x94 = bad GPU/NIC or unseated riser"
          ],
          [
            "0x95",
            "PCI Bus Request Resources: Calculating MMIO aperture requirements across all PCIe devices"
          ],
          [
            "0x96",
            "PCI Bus Assign Resources: Out of 32-bit MMIO BAR space! Enable 'Above 4G Decoding' and set 'MMIO High Base / Size' in BIOS"
          ]
        ],
        "tip": "Hang at 0x94/0x96 after adding GPUs = Enable 'Above 4G Decoding' in BIOS!",
        "tags": [
          "PCIe & DXE Codes",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "91",
          "92",
          "93",
          "94",
          "95",
          "96",
          "pcie",
          "gpu",
          "riser",
          "mcio",
          "slimsas",
          "above-4g",
          "bar"
        ]
      }
    ]
  },
  {
    "id": "pcie-dxe-post-cmd-2",
    "badge": "pci",
    "title": "PCIe & DXE Codes: Decode DXE error codes",
    "subtitle": "Decode DXE error codes (`0xd0`–`0xd8`), missing VGA/Console (`0xd6`), and Option ROM hangs (`0xB2`)",
    "commands": [
      {
        "id": "post-d0-d8-dxe-console-errors",
        "desc": "Decode DXE error codes (`0xd0`–`0xd8`), missing VGA/Console (`0xd6`), and Option ROM hangs (`0xB2`)",
        "cmd": "POST 0xd6 (No Console Output / VGA)   |   POST 0xd7 (No Console Input)   |   POST 0xB2 (Legacy Option ROM)",
        "details": "",
        "flags": [
          [
            "0xd0 / 0xd1",
            "CPU initialization error (d0) or Northbridge / Root Complex initialization error (d1)"
          ],
          [
            "0xd2 / 0xd4",
            "Southbridge / PCH initialization error (d2) or PCI resource allocation error — Out of Resources (d4)"
          ],
          [
            "0xd6",
            "No Console Output Devices found: Onboard ASPEED AST2500/AST2600 VGA disabled via jumper (VGA_SW1) or discrete GPU missing 12VHPWR/8-pin power"
          ],
          [
            "0xd7",
            "No Console Input Devices found: No USB keyboard or BMC virtual HID keyboard detected"
          ],
          [
            "0xd8",
            "Invalid password or corrupted UEFI NVRAM variable state"
          ],
          [
            "0xB2",
            "Legacy Option ROM Initialization: Hangs if an older RAID HBA/NIC tries to load a Legacy 16-bit OpROM when CSM is misconfigured"
          ]
        ],
        "tip": "Check onboard VGA_SW1 jumper on ASUS/GIGABYTE boards if halting at 0xd6!",
        "tags": [
          "PCIe & DXE Codes",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "d0",
          "d1",
          "d2",
          "d4",
          "d6",
          "d7",
          "d8",
          "b2",
          "vga",
          "console",
          "option-rom",
          "ast2600"
        ]
      }
    ]
  },
  {
    "id": "pcie-dxe-post-cmd-3",
    "badge": "pci",
    "title": "PCIe & DXE Codes: Decode DXE Core, NVRAM, Northbridge/UPI, and Southbridge/PCH codes",
    "subtitle": "Decode DXE Core, NVRAM, Northbridge/UPI, and Southbridge/PCH codes (`0x60`–`0x79`)",
    "commands": [
      {
        "id": "post-60-79-dxe-core-pch",
        "desc": "Decode DXE Core, NVRAM, Northbridge/UPI, and Southbridge/PCH codes (`0x60`–`0x79`)",
        "cmd": "POST 0x60 (DXE Core)  ->  0x61 (NVRAM)  ->  0x68 (PCI Host Bridge)  ->  0x70 (Southbridge)  ->  0x79 (CSM)",
        "details": "",
        "flags": [
          [
            "0x60 / 0x61",
            "DXE Core started (60) and NVRAM initialization (61 — if stuck at 61, Clear CMOS or reflash corrupted BIOS NVRAM)"
          ],
          [
            "0x62 / 0x63",
            "Installation of Southbridge Runtime Services (62) and CPU DXE initialization started (63)"
          ],
          [
            "0x68 / 0x69",
            "PCI Host Bridge initialization (68) and Northbridge / Intel IOH / AMD IOD SMM initialization (69)"
          ],
          [
            "0x70 / 0x71 / 0x72",
            "Southbridge DXE initialization started (70), Southbridge SMM initialization (71), and Southbridge devices init (72)"
          ],
          [
            "0x78 / 0x79",
            "ACPI module initialization (78) and CSM (Compatibility Support Module) initialization (79 — often hangs if GPU vBIOS is corrupted)"
          ]
        ],
        "tip": "Stuck at 0x61 = corrupted UEFI NVRAM (use CLRTC / CLR_CMOS jumper)",
        "tags": [
          "PCIe & DXE Codes",
          "motherboard",
          "post",
          "bios",
          "hardware",
          "60",
          "61",
          "62",
          "63",
          "68",
          "69",
          "70",
          "78",
          "79",
          "dxe",
          "nvram",
          "cmos",
          "acpi",
          "csm"
        ]
      }
    ]
  },
  {
    "id": "pcie-dxe-post-pro-tips",
    "badge": "tip",
    "title": "PCIe & DXE Codes: Pro Tips & Best Practices",
    "subtitle": "PCIe Bus Hangs, Bifurcation & Option ROM Freeze Triage",
    "commands": [
      {
        "id": "pcie-dxe-post-tips-card",
        "desc": "PCIe Bus Hangs, Bifurcation & Option ROM Freeze Triage",
        "cmd": "lspci -tv && lspci -vvv -d 10de: | grep -E \"(LnkCap|LnkSta|DevSta)\"",
        "details": "Codes 0x91–0x96 occur during DXE driver dispatch and bus enumeration. A hang at 0x94 (PCI Bus Enumeration) indicates an unseated riser, bad PCIe Gen5 retimer, or shorted power pins on a multi-GPU add-in card. 0xd6 indicates No Console Output Found (missing or disabled GPU display output).",
        "flags": [
          [
            "0x94 (PCI Bus Enum)",
            "PCIe bus scan failure: unseated riser, bad cable, or dead add-in card"
          ],
          [
            "0x96 (PCI Resource)",
            "PCI resource allocation failure: enable \"Above 4G Decoding\" and Large BARs"
          ],
          [
            "0xd6 (No Console)",
            "No VGA display device detected: verify primary display selection in BMC"
          ]
        ],
        "tip": "Verify PCIe bifurcation settings in BIOS: setting an x16 slot to x4x4x4x4 for quad M.2 cards avoids post code 0x94 hangs.",
        "tags": [
          "pcie-dxe-post",
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
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("mb-pcie-dxe-post_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = MB_MB_PCIE_DXE_POST_DATA;
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

  for (const card of MB_MB_PCIE_DXE_POST_DATA) {
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
        '    <span class="copy-hint">Copy</span>',
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
        localStorage.setItem("mb-pcie-dxe-post_bookmarks", JSON.stringify([...state.bookmarks]));
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
