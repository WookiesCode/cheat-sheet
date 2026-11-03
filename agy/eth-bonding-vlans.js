// eth-bonding-vlans.js
// Standalone interactive cheat sheet for Ethernet: LACP Bonding (802.3ad), 802.1Q VLANs & Bridges
const ETH_ETH_BONDING_VLANS_DATA = [
  {
    "id": "bonding-vlans-bridges-cmd-1",
    "badge": "bond",
    "title": "LACP Bonds & VLANs: Verify LACP",
    "subtitle": "Verify LACP (`802.3ad`) bond health, Partner System MAC, Aggregator ID, and slave `Link Failure Count`",
    "commands": [
      {
        "id": "lacp-bonding-proc-status",
        "desc": "Verify LACP (`802.3ad`) bond health, Partner System MAC, Aggregator ID, and slave `Link Failure Count`",
        "cmd": "cat /proc/net/bonding/bond0   |   ip -d link show bond0",
        "details": "",
        "flags": [
          [
            "Aggregator ID",
            "All active slave NICs in bond0 MUST share the same Aggregator ID; if Partner MAC is 00:00:00:00:00:00, switch port isn't running LACP!"
          ],
          [
            "Link Failure Count",
            "Spots intermittent flapping patch cords or switch ports inside a bond"
          ],
          [
            "xmit_hash_policy layer3+4",
            "Hashes on IP + TCP/UDP port so multiple flows between two hosts load-balance across all links"
          ]
        ],
        "tip": "Partner MAC 00:00:.. = switch LACP off",
        "tags": [
          "LACP Bonds & VLANs",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "bond",
          "lacp",
          "802.3ad",
          "bonding",
          "aggregator",
          "mlag",
          "port-channel"
        ]
      }
    ]
  },
  {
    "id": "bonding-vlans-bridges-cmd-2",
    "badge": "bond",
    "title": "LACP Bonds & VLANs: Create an 802",
    "subtitle": "Create an 802.1Q tagged VLAN sub-interface (`eth0.100`) or LACP bond dynamically via `ip link`",
    "commands": [
      {
        "id": "iproute2-create-bond-vlan",
        "desc": "Create an 802.1Q tagged VLAN sub-interface (`eth0.100`) or LACP bond dynamically via `ip link`",
        "cmd": "ip link add link eth0 name eth0.100 type vlan id 100 && ip link set eth0.100 up",
        "details": "",
        "flags": [
          [
            "type vlan id 100",
            "Tags egress frames with 802.1Q VLAN ID 100 and strips tag on ingress"
          ],
          [
            "cat /proc/net/vlan/eth0.100",
            "Inspect 802.1Q VLAN ID, reorder header flag, and per-VLAN packet counters"
          ]
        ],
        "tip": "",
        "tags": [
          "LACP Bonds & VLANs",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "vlan",
          "802.1q",
          "trunk",
          "tagged",
          "subinterface"
        ]
      }
    ]
  },
  {
    "id": "bonding-vlans-bridges-cmd-3",
    "badge": "bond",
    "title": "LACP Bonds & VLANs: Inspect Linux software bridge ports, learned L2 MAC forwarding database",
    "subtitle": "Inspect Linux software bridge ports, learned L2 MAC forwarding database (FDB), and bridge VLANs",
    "commands": [
      {
        "id": "bridge-fdb-vlan",
        "desc": "Inspect Linux software bridge ports, learned L2 MAC forwarding database (FDB), and bridge VLANs",
        "cmd": "bridge link show   |   bridge fdb show br br0   |   bridge vlan show",
        "details": "",
        "flags": [
          [
            "bridge link show",
            "Lists all member interfaces (physical NICs, veth pairs, tap VMs) enslaved to bridges"
          ],
          [
            "bridge fdb show",
            "Displays learned MAC address table per bridge port (like 'show mac address-table' on a switch)"
          ]
        ],
        "tip": "",
        "tags": [
          "LACP Bonds & VLANs",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "bridge",
          "br0",
          "fdb",
          "mac-table",
          "kvm",
          "veth"
        ]
      }
    ]
  },
  {
    "id": "bonding-vlans-bridges-pro-tips",
    "badge": "tip",
    "title": "LACP Bonds & VLANs: Pro Tips & Best Practices",
    "subtitle": "High-Availability LACP Aggregation & 802.1Q Tagged VLANs",
    "commands": [
      {
        "id": "bonding-vlans-bridges-tips-card",
        "desc": "High-Availability LACP Aggregation & 802.1Q Tagged VLANs",
        "cmd": "cat /proc/net/bonding/bond0 && ip link add link eth0 name eth0.100 type vlan id 100",
        "details": "LACP (802.3ad mode 4) bundles multiple physical Ethernet interfaces into a single high-bandwidth logical link with active health monitoring. Inspect /proc/net/bonding/bond0 to verify Partner System MAC and Actor/Partner Churn state. Use 802.1Q sub-interfaces (\"eth0.100\") to isolate storage, management, and tenant VM traffic.",
        "flags": [
          [
            "/proc/net/bonding/bond0",
            "Real-time kernel status: slave interfaces, MII link status, and LACP partner synchronization"
          ],
          [
            "type vlan id <vlan>",
            "Create kernel 802.1Q tagged sub-interface for VLAN trunk separation"
          ],
          [
            "bridge fdb show",
            "Display Layer-2 forwarding database (MAC learning table) on Linux bridge interfaces"
          ]
        ],
        "tip": "Set xmit_hash_policy to \"layer3+4\" (IP + Port hashing) to distribute TCP/UDP flows evenly across both bond slaves.",
        "tags": [
          "bonding-vlans-bridges",
          "tips",
          "pro",
          "ethernet",
          "nic",
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("eth-bonding-vlans_bookmarks") || "[]"))
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

// Ethernet Command Syntax Highlighting
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
  const allCards = ETH_ETH_BONDING_VLANS_DATA;
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

function isRunnableCommand(cmd) {
  if (window.AntigravityCommon && window.AntigravityCommon.isRunnableCommand) {
    return window.AntigravityCommon.isRunnableCommand(cmd);
  }
  if (!cmd || typeof cmd !== 'string') return false;
  var s = cmd.trim();
  if (!s) return false;
  if (s.startsWith('POST ') || s.startsWith('Stage ') || s.startsWith('1-DIMM') || s.startsWith('BMC_') || s.startsWith('Above 4G')) return false;
  if (s.startsWith('T568') || s.startsWith('[Transceiver') || s.startsWith('Switch Port: OSFP') || s.startsWith('800G Twin-Port') || s.startsWith('0.5')) return false;
  if (s.startsWith('Direct Optic-to-Optic') || s.startsWith('MPO-12') || s.startsWith('LC Duplex') || s.startsWith('1. Inspect') || s.startsWith('Check DOM') || s.startsWith('10km LR4') || s.startsWith('Tier ')) return false;
  if (s.includes('──►') || s.includes('◄──')) return false;
  if (s.startsWith('Win+') || s.startsWith('Alt+') || s.startsWith('Ctrl+')) return false;
  if (/[⇧⌘⌥⌃]/.test(s) || s.includes('-Finger Swipe')) return false;
  return true;
}

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const card of ETH_ETH_BONDING_VLANS_DATA) {
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

      const isRun = isRunnableCommand(cmd.cmd);
      const codeBoxLines = isRun
        ? [
            '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
            '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
            '    <button type="button" class="copy-btn" title="Copy command" aria-label="Copy command">',
            '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
            '        <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
            '        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>',
            '      </svg>',
            '      <span class="copy-feedback">Copy</span>',
            '    </button>',
            '  </div>'
          ]
        : [
            '  <div class="cmd-code-box ref-box">',
            '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
            '  </div>'
          ];

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
        codeBoxLines.join("\n"),
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
      const codeBox = copyBtn.closest(".cmd-code-box[data-cmd]");
      const cmdText = codeBox ? codeBox.getAttribute("data-cmd") : "";
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const codeBox = e.target.closest(".cmd-code-box[data-cmd]");
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
        localStorage.setItem("eth-bonding-vlans_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.CheatSheetCommon && window.CheatSheetCommon.applyTheme) {
    window.CheatSheetCommon.applyTheme(theme);
  } else if (window.AntigravityCommon && window.AntigravityCommon.applyTheme) {
    window.AntigravityCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch(e) {}
  }
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");
  if (sunIcon && moonIcon) {
    if (theme === "light") {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }
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
