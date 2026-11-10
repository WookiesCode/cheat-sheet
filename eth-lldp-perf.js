// eth-lldp-perf.js
// Standalone interactive cheat sheet for Ethernet: LLDP Switch Discovery, Jumbo Ping, iperf3 & DNS
const ETH_ETH_LLDP_PERF_DATA = [
  {
    "id": "lldp-mtu-diag-cmd-1",
    "badge": "diag",
    "title": "LLDP & Line-Rate Tests: Identify which physical upstream switch name, port number, and native VLAN `eth0` is plugged into",
    "subtitle": "Identify which physical upstream switch name, port number, and native VLAN `eth0` is plugged into",
    "commands": [
      {
        "id": "lldp-cdp-capture-switch-port",
        "desc": "Identify which physical upstream switch name, port number, and native VLAN `eth0` is plugged into",
        "cmd": "lldpctl eth0   |   tcpdump -nn -v -i eth0 -s 1500 -c 1 '(ether proto 0x88cc or ether[20:2] == 0x2000)'",
        "details": "",
        "flags": [
          [
            "lldpctl (lldpd package)",
            "Shows the neighbors the lldpd daemon learned (the daemon sends and receives LLDP; lldpctl only displays)"
          ],
          [
            "tcpdump ether proto 0x88cc",
            "Zero-install trick: captures 1 raw LLDP (0x88cc) or Cisco CDP (0x2000) frame (sent every 30s by switches)"
          ]
        ],
        "tip": "Traces cables without going to the rack!",
        "tags": [
          "LLDP & Line-Rate Tests",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "lldp",
          "cdp",
          "switch",
          "port",
          "tcpdump",
          "lldpctl",
          "trace"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/lldpd/lldpctl.8.en.html",
              "title": "lldpctl(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man7/pcap-filter.7.html",
              "title": "pcap-filter(7)"
            }
          ],
          "note": "The neighbor fields lldpctl prints are not listed in its man page; the CDP filter is a convention."
        }
      }
    ]
  },
  {
    "id": "lldp-mtu-diag-cmd-2",
    "badge": "diag",
    "title": "LLDP & Line-Rate Tests: Verify end-to-end IPv6 9000-byte Jumbo Frame path without fragmentation",
    "subtitle": "Verify end-to-end IPv6 9000-byte Jumbo Frame path without fragmentation (`ping -6 -M do -s 8952`)",
    "commands": [
      {
        "id": "jumbo-frame-mtu-ping",
        "desc": "Verify end-to-end IPv6 9000-byte Jumbo Frame path without fragmentation (`ping -6 -M do -s 8952`)",
        "cmd": "ping -6 -M do -s 8952 -c 4 2001:db8:dc:10::1   |   ping -6 -M do -s 1452 -c 4 2606:4700:4700::1111",
        "details": "",
        "flags": [
          [
            "-6 -M do",
            "Force IPv6 without local fragmentation (routers never fragment IPv6 in flight; returns ICMPv6 Packet Too Big if MTU < 9000)"
          ],
          [
            "-s 8952 / -s 1452",
            "Payload size + 8-byte ICMPv6 header + 40-byte IPv6 header = exact 9000 (Jumbo) or 1500 (Standard) frame!"
          ]
        ],
        "tip": "IPv6 header is 40B: 8952 + 48 = 9000 MTU (vs 8972 on IPv4)",
        "tags": [
          "LLDP & Line-Rate Tests",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "mtu",
          "jumbo",
          "ping",
          "ping6",
          "ipv6",
          "fragment",
          "df",
          "8952",
          "1452"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man8/ping.8.html",
              "title": "ping(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "lldp-mtu-diag-cmd-3",
    "badge": "diag",
    "title": "LLDP & Line-Rate Tests: Test IPv6",
    "subtitle": "Test IPv6 (`-6`) 1G / 10G / 25G / 100G / 400G TCP & UDP line-rate throughput and TCP retransmissions (`Retr`)",
    "commands": [
      {
        "id": "iperf3-line-rate-test",
        "desc": "Test IPv6 (`-6`) 1G / 10G / 25G / 100G / 400G TCP & UDP line-rate throughput and TCP retransmissions (`Retr`)",
        "cmd": "# Server: iperf3 -s   |   # Client: iperf3 -6 -c 2001:db8:dc:10::1 -P 8 -t 30   |   iperf3 -6 -c 2001:db8:dc:10::1 -R",
        "details": "",
        "flags": [
          [
            "-6",
            "Use IPv6 addressing (for link-local fe80:: targets, append interface scope e.g. fe80::1%eth0)"
          ],
          [
            "-P 8",
            "Run 8 parallel TCP streams to saturate multi-queue 10G/25G/100G/400G links"
          ],
          [
            "-R (Reverse)",
            "Server sends, client receives (tests download direction without switching sides)"
          ],
          [
            "Retr column",
            "Watch TCP Retransmissions column: high Retr indicates switch buffer drops or bad cable CRC errors"
          ]
        ],
        "tip": "",
        "tags": [
          "LLDP & Line-Rate Tests",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "iperf3",
          "ipv6",
          "bandwidth",
          "throughput",
          "speedtest",
          "retransmissions",
          "10g"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://software.es.net/iperf/invoking.html",
              "title": "iperf3"
            }
          ],
          "note": "The Retr column is not described in the iperf3 manual."
        }
      }
    ]
  },
  {
    "id": "lldp-mtu-diag-cmd-4",
    "badge": "diag",
    "title": "LLDP & Line-Rate Tests: Inspect per-interface IPv6 DNS servers, query `AAAA` records, and flush cache in Ubuntu's `systemd-resolved`",
    "subtitle": "Inspect per-interface IPv6 DNS servers, query `AAAA` records, and flush cache in Ubuntu's `systemd-resolved`",
    "commands": [
      {
        "id": "ubuntu-resolvectl-dns",
        "desc": "Inspect per-interface IPv6 DNS servers, query `AAAA` records, and flush cache in Ubuntu's `systemd-resolved`",
        "cmd": "resolvectl status   |   resolvectl query --type=AAAA example.com   |   resolvectl flush-caches",
        "details": "",
        "flags": [
          [
            "resolvectl status",
            "Shows why /etc/resolv.conf points to 127.0.0.53 and lists actual upstream IPv6 DNS servers per NIC"
          ],
          [
            "resolvectl dns eth0 2606:4700:4700::1111 2001:4860:4860::8888",
            "Set upstream IPv6 DNS servers for interface eth0 on the fly"
          ]
        ],
        "tip": "",
        "tags": [
          "LLDP & Line-Rate Tests",
          "ethernet",
          "nic",
          "networking",
          "linux",
          "dns",
          "ipv6",
          "aaaa",
          "resolvectl",
          "systemd-resolved",
          "127.0.0.53",
          "ubuntu"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man1/resolvectl.1.html",
              "title": "resolvectl(1)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "lldp-mtu-diag-pro-tips",
    "badge": "tip",
    "title": "LLDP & Line-Rate Tests: Pro Tips & Best Practices",
    "subtitle": "Automated Switch Topology Discovery & Line-Rate Performance Validation",
    "commands": [
      {
        "id": "lldp-mtu-diag-tips-card",
        "desc": "Automated Switch Topology Discovery & Line-Rate Performance Validation",
        "cmd": "lldpcli show neighbors && ping -6 -M do -s 8952 <dest_ip>",
        "details": "LLDP (Link Layer Discovery Protocol) queries the adjacent switch port name, chassis ID, and VLAN settings without needing switch CLI credentials. When validating newly provisioned 10G/25G/100G NICs, use iperf3 in bidirectional parallel stream mode (\"-P 8\") to verify line-rate throughput and identify single-core CPU interrupt bottlenecks.",
        "flags": [
          [
            "lldpcli show neighbors",
            "Display upstream switch hostname, port identifier, and management IP"
          ],
          [
            "ping -M do -s <bytes>",
            "Enforce Don't Fragment flag to detect Path MTU Discovery blackholes"
          ],
          [
            "iperf3 -6 -c <ip> -P 8",
            "Run 8 parallel TCP streams over IPv6 to benchmark line-rate NIC performance"
          ]
        ],
        "tip": "Use \"ping -M do -s 8952\" (8952 payload + 40-byte IPv6 header + 8-byte ICMPv6 header = 9000 bytes) to audit MTU 9000 paths without fragmentation.",
        "tags": [
          "lldp-mtu-diag",
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
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("eth-lldp-perf_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = ETH_ETH_LLDP_PERF_DATA;
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

  for (const card of ETH_ETH_LLDP_PERF_DATA) {
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
        localStorage.setItem("eth-lldp-perf_bookmarks", JSON.stringify([...state.bookmarks]));
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
