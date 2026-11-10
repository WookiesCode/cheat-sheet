// ipmi-bmc-lan-users.js
// Standalone interactive cheat sheet for ipmitool: BMC Network (lan6 / lan) & User Management
const IPMI_IPMI_BMC_LAN_USERS_DATA = [
  {
    "id": "bmc-lan-users-cmd-1",
    "badge": "lan",
    "title": "BMC Network & Users: Print current BMC IPv6",
    "subtitle": "Print current BMC IPv6 (Global/SLAAC/DHCPv6/Link-Local) and IPv4 address, MAC, gateway, and VLAN from inside the host OS",
    "commands": [
      {
        "id": "ipmi-lan-print-discover",
        "desc": "Print current BMC IPv6 (Global/SLAAC/DHCPv6/Link-Local) and IPv4 address, MAC, gateway, and VLAN from inside the host OS",
        "cmd": "ipmitool lan6 print 1 && ipmitool lan print 1",
        "details": "",
        "flags": [
          [
            "lan6 print 1",
            "Displays IPMI 2.0 IPv6 Static/Dynamic (SLAAC/DHCPv6) addresses, prefix length (/64), link-local fe80:: address, and IPv6 gateway"
          ],
          [
            "Channel 1 vs 8",
            "Most servers use Channel 1 for dedicated BMC; some use Channel 8 for shared LOM"
          ]
        ],
        "tip": "Use 'lan6 print 1' to see BMC IPv6 SLAAC/DHCPv6 addresses!",
        "tags": [
          "BMC Network & Users",
          "ipmi",
          "ipmitool",
          "bmc",
          "hardware",
          "lan6",
          "lan",
          "ipv6",
          "ip",
          "mac",
          "gateway",
          "channel",
          "discover",
          "slaac",
          "dhcpv6"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_lanp6.c",
              "title": "ipmitool source (ipmi_lanp6.c)"
            }
          ],
          "note": "lan6 is in ipmitool's source but not its man page."
        }
      }
    ]
  },
  {
    "id": "bmc-lan-users-cmd-2",
    "badge": "lan",
    "title": "BMC Network & Users: Configure static IPv6 address & prefix",
    "subtitle": "Configure static IPv6 address & prefix (or enable SLAAC/DHCPv6 dynamic addressing) and 802.1Q VLAN on the BMC",
    "commands": [
      {
        "id": "ipmi-lan-set-static-dhcp",
        "desc": "Configure static IPv6 address & prefix (or enable SLAAC/DHCPv6 dynamic addressing) and 802.1Q VLAN on the BMC",
        "cmd": "ipmitool lan6 set 1 enables ipv6 && ipmitool lan6 set 1 static_addr 0 enable 2001:db8:dc:1::100 64",
        "details": "",
        "flags": [
          [
            "lan6 set 1 enables ipv4 / ipv6 / both",
            "IPv4 only, IPv6 only, or dual-stack on BMC channel 1"
          ],
          [
            "lan6 print 1",
            "Shows the dynamic (SLAAC/DHCPv6) addresses; ipmitool has no lan6 addr_src setting (dynamic_addr is read-only)"
          ],
          [
            "lan set 1 vlan id 200",
            "Enable 802.1Q VLAN tagging on VLAN 200 (use 'vlan id off' to disable)"
          ]
        ],
        "tip": "",
        "tags": [
          "BMC Network & Users",
          "ipmi",
          "ipmitool",
          "bmc",
          "hardware",
          "lan6",
          "ipv6",
          "static",
          "dhcpv6",
          "slaac",
          "gateway",
          "vlan",
          "ipaddr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_lanp6.c",
              "title": "ipmitool source (ipmi_lanp6.c)"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            }
          ],
          "note": "Corrected 2026-11-09: the parameter is enables (ipv4|ipv6|both), not enabler ipv6_only; there is no addr_src."
        }
      }
    ]
  },
  {
    "id": "bmc-lan-users-cmd-3",
    "badge": "lan",
    "title": "BMC Network & Users: List BMC user accounts, reset forgotten BMC admin password from host OS, or grant Admin privilege",
    "subtitle": "List BMC user accounts, reset forgotten BMC admin password from host OS, or grant Admin privilege",
    "commands": [
      {
        "id": "ipmi-user-password-admin",
        "desc": "List BMC user accounts, reset forgotten BMC admin password from host OS, or grant Admin privilege",
        "cmd": "ipmitool user list 1   |   ipmitool user set password 2 '<new-password>'   |   ipmitool channel setaccess 1 2 link=on ipmi=on callin=on privilege=4",
        "details": "",
        "flags": [
          [
            "user list 1",
            "List all user slot IDs (ID 2 is typically 'admin' or 'root')"
          ],
          [
            "privilege=4",
            "Grant ADMINISTRATOR (4) privilege on Channel 1 and enable user via 'ipmitool user enable <id>'"
          ]
        ],
        "tip": "Reset BMC password without rebooting!",
        "tags": [
          "BMC Network & Users",
          "ipmi",
          "ipmitool",
          "bmc",
          "hardware",
          "user",
          "password",
          "reset",
          "admin",
          "privilege",
          "channel"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            }
          ],
          "note": "Fill <new-password> yourself; the sample password was removed."
        }
      }
    ]
  },
  {
    "id": "bmc-lan-users-pro-tips",
    "badge": "tip",
    "title": "BMC Network & Users: Pro Tips & Best Practices",
    "subtitle": "BMC Out-of-Band Network Provisioning & Root Password Recovery",
    "commands": [
      {
        "id": "bmc-lan-users-tips-card",
        "desc": "BMC Out-of-Band Network Provisioning & Root Password Recovery",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E lan print 1",
        "details": "The BMC LAN channel is usually 1, but some vendors use another number: find it with \"channel info <n>\" (look for 802.3 LAN). From the host OS as root, in-band ipmitool (no -H) can reset a lost BMC password with \"user set password <id>\".",
        "flags": [
          [
            "lan print 1",
            "Display current BMC IP address, MAC address, subnet mask, and default gateway"
          ],
          [
            "lan6 print 1",
            "Display current BMC IPv6 global, link-local, SLAAC, and DHCPv6 addresses"
          ],
          [
            "user set password <id> <new_pass>",
            "Change BMC user password directly from local host or over RMCP+"
          ]
        ],
        "tip": "If the BMC has IPv6 enabled, \"lan6 print 1\" shows its static, SLAAC and DHCPv6 addresses",
        "tags": [
          "bmc-lan-users",
          "tips",
          "pro",
          "ipmitool",
          "bmc",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool(1) man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_lanp6.c",
              "title": "ipmitool source: ipmi_lanp6.c (lan6)"
            },
            {
              "url": "https://docs.kernel.org/driver-api/ipmi.html",
              "title": "Linux kernel IPMI driver"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("ipmi-bmc-lan-users_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// ipmitool Command Syntax Highlighting
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
  const allCards = IPMI_IPMI_BMC_LAN_USERS_DATA;
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

  for (const card of IPMI_IPMI_BMC_LAN_USERS_DATA) {
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
        localStorage.setItem("ipmi-bmc-lan-users_bookmarks", JSON.stringify([...state.bookmarks]));
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
