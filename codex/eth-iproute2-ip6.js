// eth-iproute2-ip6.js
// Standalone interactive cheat sheet for Ethernet: iproute2: IPv6 Links, Addresses, Routes & NDP
const ETH_ETH_IPROUTE2_IP6_DATA = [
  {
    "id": "iproute2-cmd-1",
    "badge": "ip6",
    "title": "iproute2 & IPv6 NDP: Show compact color-coded table of all network interfaces, MACs, link state, and Global/Link-Local IPv6 addresses",
    "subtitle": "Show compact color-coded table of all network interfaces, MACs, link state, and Global/Link-Local IPv6 addresses",
    "commands": [
      {
        "id": "ip-brief-color-overview",
        "desc": "Show compact color-coded table of all network interfaces, MACs, link state, and Global/Link-Local IPv6 addresses",
        "cmd": "ip -br -c link   |   ip -6 -br -c addr   |   ip -s -s link show dev eth0",
        "details": "",
        "flags": [
          [
            "-6 -br -c",
            "Brief single-line IPv6 tabular format (-6 -br) with UP/DOWN color highlighting (-c)"
          ],
          [
            "scope global vs link",
            "Global Unicast (2000::/3) or Unique Local (fd00::/8) vs Link-Local (fe80::/10, requires %eth0 zone ID)"
          ],
          [
            "-s -s link",
            "Detailed RX/TX byte/packet counters plus specific crc_errors, frame, fifo, and carrier_changes counts"
          ]
        ],
        "tip": "ip -6 -br -c addr shows all IPv6 prefixes cleanly",
        "tags": [
          "iproute2 & IPv6 NDP",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "ip",
          "ipv6",
          "brief",
          "addr",
          "link",
          "mac",
          "stats",
          "fe80"
        ]
      }
    ]
  },
  {
    "id": "iproute2-cmd-2",
    "badge": "ip6",
    "title": "iproute2 & IPv6 NDP: Bring interface up/down, enable Jumbo Frames",
    "subtitle": "Bring interface up/down, enable Jumbo Frames (`mtu 9000`), or add/remove IPv6 `/64` or `/128` addresses on the fly",
    "commands": [
      {
        "id": "ip-mtu-up-down-addr",
        "desc": "Bring interface up/down, enable Jumbo Frames (`mtu 9000`), or add/remove IPv6 `/64` or `/128` addresses on the fly",
        "cmd": "ip link set dev eth0 mtu 9000 up   |   ip -6 addr add 2001:db8:dc:10::50/64 dev eth0   |   ip -6 addr flush scope global dev eth0",
        "details": "",
        "flags": [
          [
            "mtu 9000",
            "Enable 9000-byte Jumbo Frames (ensure switch port & remote host also have MTU ≥ 9000)"
          ],
          [
            "scope global",
            "Flush only global IPv6 addresses while preserving the required fe80:: link-local address!"
          ]
        ],
        "tip": "Never flush link-local fe80:: — IPv6 NDP & routing need it!",
        "tags": [
          "iproute2 & IPv6 NDP",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "mtu",
          "jumbo",
          "9000",
          "up",
          "down",
          "ipv6",
          "cidr",
          "flush"
        ]
      }
    ]
  },
  {
    "id": "iproute2-cmd-3",
    "badge": "ip6",
    "title": "iproute2 & IPv6 NDP: Inspect IPv6 routing table or ask kernel which exact egress interface, next-hop",
    "subtitle": "Inspect IPv6 routing table or ask kernel which exact egress interface, next-hop (often `fe80::`), and source IPv6 will reach a target",
    "commands": [
      {
        "id": "ip-route-get-lookup",
        "desc": "Inspect IPv6 routing table or ask kernel which exact egress interface, next-hop (often `fe80::`), and source IPv6 will reach a target",
        "cmd": "ip -6 -c route   |   ip -6 route get 2606:4700:4700::1111   |   ip -6 route replace default via fe80::1 dev eth0",
        "details": "",
        "flags": [
          [
            "ip -6 route get <ipv6>",
            "Resolves multipath/policy routing rules and prints exact 'via <next-hop> dev <if> src <ipv6>'"
          ],
          [
            "via fe80::1 dev eth0",
            "IPv6 routers commonly route over link-local next-hops (BGP Unnumbered / RA) — always specify 'dev eth0'!"
          ],
          [
            "ip -6 rule show",
            "List IPv6 policy-based routing (PBR) tables and priorities"
          ]
        ],
        "tip": "'ip -6 route get' debugs multi-NIC IPv6 routing",
        "tags": [
          "iproute2 & IPv6 NDP",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "route",
          "ipv6",
          "gateway",
          "default",
          "egress",
          "source",
          "pbr",
          "fe80"
        ]
      }
    ]
  },
  {
    "id": "iproute2-cmd-4",
    "badge": "ip6",
    "title": "iproute2 & IPv6 NDP: Inspect IPv6 Neighbor Discovery Protocol",
    "subtitle": "Inspect IPv6 Neighbor Discovery Protocol (NDP) cache (`REACHABLE`, `STALE`, `FAILED`, `router`) or probe with `ndisc6` / `rdisc6`",
    "commands": [
      {
        "id": "ip-neigh-arping-duplicate",
        "desc": "Inspect IPv6 Neighbor Discovery Protocol (NDP) cache (`REACHABLE`, `STALE`, `FAILED`, `router`) or probe with `ndisc6` / `rdisc6`",
        "cmd": "ip -6 -c neigh show   |   ip -6 neigh flush all   |   ndisc6 2001:db8:dc:10::1 eth0   |   rdisc6 eth0",
        "details": "",
        "flags": [
          [
            "ip -6 -c neigh show",
            "Replaces IPv4 ARP! Maps IPv6 addresses to L2 MACs and marks upstream routers with the 'router' flag"
          ],
          [
            "ndisc6 <ipv6> <if>",
            "Send an explicit ICMPv6 Neighbor Solicitation (type 135) to resolve target IPv6's MAC address"
          ],
          [
            "rdisc6 <if>",
            "Send an ICMPv6 Router Solicitation (type 133) to inspect switch Router Advertisement (RA) prefixes, MTU, and flags"
          ]
        ],
        "tip": "IPv6 uses ICMPv6 Neighbor Discovery (NDP) instead of ARP!",
        "tags": [
          "iproute2 & IPv6 NDP",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "ndp",
          "neigh",
          "ndisc6",
          "rdisc6",
          "ipv6",
          "mac",
          "l2",
          "router-advertisement"
        ]
      }
    ]
  },
  {
    "id": "iproute2-pro-tips",
    "badge": "tip",
    "title": "iproute2 & IPv6 NDP: Pro Tips & Best Practices",
    "subtitle": "Production iproute2 CLI Operations & IPv6 Neighbor Discovery",
    "commands": [
      {
        "id": "iproute2-tips-card",
        "desc": "Production iproute2 CLI Operations & IPv6 Neighbor Discovery",
        "cmd": "ip -br -c a && ip -6 route show && ip -6 neigh show",
        "details": "iproute2 replaces legacy ifconfig/netstat/arp. Use \"ip -br -c a\" for a quick, colorized summary of all interfaces, MACs, and IPv4/IPv6 addresses. In modern IPv6 datacenter fabrics, \"ip -6 neigh show\" inspects Neighbor Discovery Protocol (NDP) states (\"REACHABLE\", \"STALE\", \"DELAY\") without generating legacy ARP broadcasts.",
        "flags": [
          [
            "ip -br -c link",
            "Compact one-line per interface status (UP/DOWN/LOWER_UP) with color coding"
          ],
          [
            "ip link set <dev> mtu 9000",
            "Configure 9000-byte Jumbo Frames for high-throughput RoCEv2 and Ceph storage"
          ],
          [
            "ip -6 route get <ip>",
            "Ask kernel routing subsystem exactly which egress interface and source IP will be used"
          ]
        ],
        "tip": "Always verify MTU symmetry across both ends of a link: mismatched MTUs cause TCP handshake success but silent payload drops on large packets.",
        "tags": [
          "iproute2",
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("eth-iproute2-ip6_bookmarks") || "[]"))
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
  const allCards = ETH_ETH_IPROUTE2_IP6_DATA;
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

  for (const card of ETH_ETH_IPROUTE2_IP6_DATA) {
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
        localStorage.setItem("eth-iproute2-ip6_bookmarks", JSON.stringify([...state.bookmarks]));
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
