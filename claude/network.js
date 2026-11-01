// network.js
// Standalone interactive cheat sheet for Networking, Sockets, DNS, UFW & SSH
const NETWORK_DATA = [
  {
    "id": "network-card-1",
    "badge": "net",
    "title": "Networking: All listening TCP/UDP ports, owning process/PID,...",
    "subtitle": "Inspect all listening TCP/UDP ports, owning process/PID, and established socket states",
    "commands": [
      {
        "id": "ss-listening-conns",
        "desc": "Inspect all listening TCP/UDP ports, owning process/PID, and established socket states",
        "cmd": "ss -tulpn",
        "details": "Queries kernel netlink TCP_DIAG directly (much faster than legacy netstat on servers with 50,000+ sockets). Shows local bind address (0.0.0.0 vs 127.0.0.1 vs [::]), port number, and the process name + PID holding the socket.",
        "flags": [
          [
            "-t -u",
            "Show both TCP (-t) and UDP (-u) sockets"
          ],
          [
            "-l",
            "Show only listening server sockets (omit -l to see established connections)"
          ],
          [
            "-p",
            "Show process name, PID, and file descriptor owning the socket (requires sudo)"
          ],
          [
            "-n",
            "Numeric addresses and port numbers (do not block on DNS/service resolution)"
          ]
        ],
        "subcommands": [
          [
            "ss -tanp state established",
            "List all currently established TCP connections with remote peer IPs and local PIDs"
          ],
          [
            "ss -s",
            "Print high-level kernel socket summary (total TCP established, syn-recv, time-wait, orphaned)"
          ],
          [
            "lsof -iTCP:8080 -sTCP:LISTEN -P -n",
            "Find the exact process bound to TCP port 8080"
          ]
        ],
        "tip": "Fast netlink socket inspection",
        "tags": [
          "ports",
          "listen",
          "open",
          "netstat",
          "socket",
          "ss",
          "lsof"
        ]
      }
    ]
  },
  {
    "id": "network-card-2",
    "badge": "net",
    "title": "Networking: NIC link state, MAC, MTU, IPv6 (`/64` & `fe80::`...",
    "subtitle": "Inspect NIC link state, MAC, MTU, IPv6 (`/64` & `fe80::`) addresses, IPv6 routing table & NDP neighbor cache",
    "commands": [
      {
        "id": "iproute2-interfaces-routes",
        "desc": "Inspect NIC link state, MAC, MTU, IPv6 (`/64` & `fe80::`) addresses, IPv6 routing table & NDP neighbor cache",
        "cmd": "ip -c -br link show && ip -6 -c -br addr show && ip -6 -c route show",
        "details": "Modern iproute2 toolkit for inspecting L2 link state (LOWER_UP = physical carrier detected, UP = admin enabled), L3 IPv6/IPv4 CIDR assignments, default gateways (often link-local fe80:: via Router Advertisements or BGP Unnumbered), and policy routing tables.",
        "flags": [
          [
            "-6 -c -br",
            "Colorized single-line tabular output of IPv6 Global and Link-Local addresses per interface"
          ],
          [
            "-s",
            "Include RX/TX packet, byte, error, and dropped counters (ip -s -s link show eth0)"
          ]
        ],
        "subcommands": [
          [
            "ip -6 route get 2606:4700:4700::1111",
            "Query the kernel IPv6 routing table to see which egress interface, source IPv6, and next-hop gateway will be used"
          ],
          [
            "ip -6 -c neigh show",
            "Display the L2 IPv6 Neighbor Discovery (NDP) table (REACHABLE, STALE, FAILED, router)"
          ],
          [
            "ip -6 -c rule list && ip -6 route show table all",
            "Inspect IPv6 policy-based routing (PBR) rules and all kernel routing tables"
          ]
        ],
        "tip": "'ip -6 route get <IPv6>' tests routing policy",
        "tags": [
          "ip",
          "ipv6",
          "interface",
          "nic",
          "gateway",
          "route",
          "ndp",
          "arp",
          "mtu"
        ]
      }
    ]
  },
  {
    "id": "network-card-3",
    "badge": "net",
    "title": "Networking: Test IPv6 DNS (`AAAA`) resolution against specif...",
    "subtitle": "Test IPv6 DNS (`AAAA`) resolution against specific nameservers and measure IPv6 HTTP/TLS connection timing",
    "commands": [
      {
        "id": "dig-curl-diagnostics",
        "desc": "Test IPv6 DNS (`AAAA`) resolution against specific nameservers and measure IPv6 HTTP/TLS connection timing",
        "cmd": "dig @2606:4700:4700::1111 example.com AAAA +noall +answer && curl -g -6 -sSL -D - -o /dev/null -w 'DNS:%{time_namelookup}s TCP:%{time_connect}s TLS:%{time_appconnect}s TTFB:%{time_starttransfer}s\n' https://example.com",
        "details": "Separates IPv6 AAAA DNS lookup issues from TCPv6 routing, TLS handshake slowness, or backend application latency (TTFB = Time To First Byte). Pass '-g -6' when querying literal '[IPv6]' URLs with curl.",
        "flags": [
          [
            "dig @<IPv6_NS> AAAA",
            "Query a specific IPv6 DNS server directly for AAAA records, bypassing local /etc/resolv.conf"
          ],
          [
            "curl -g -6 -w '...'",
            "Force IPv6 (-6), disable bracket globbing (-g), and print DNS/TCP/TLS/TTFB timing"
          ]
        ],
        "subcommands": [
          [
            "dig -x 2606:4700:4700::1111 +short",
            "Perform reverse DNS (ip6.arpa PTR record) lookup on an IPv6 address"
          ],
          [
            "openssl s_client -6 -connect \"[2001:db8:dc:4::50]:443\" -servername bmc.local </dev/null 2>/dev/null | openssl x509 -noout -dates -subject -issuer",
            "Inspect a remote server/BMC's live TLS certificate over IPv6 (-6)"
          ],
          [
            "nc -6 -zv -w 3 2001:db8:dc:4::25 22 80 443",
            "Test raw IPv6 TCP port connectivity to a remote host with a 3-second timeout"
          ]
        ],
        "tags": [
          "dns",
          "ipv6",
          "aaaa",
          "dig",
          "curl",
          "http",
          "tls",
          "ssl",
          "certificate",
          "netcat"
        ]
      }
    ]
  },
  {
    "id": "network-card-4",
    "badge": "net",
    "title": "Networking: Capture live IPv6/ICMPv6 network packets (`tcpdu...",
    "subtitle": "Capture live IPv6/ICMPv6 network packets (`tcpdump`), manage Ubuntu UFW IPv6 firewall rules, and create SSH tunnels",
    "commands": [
      {
        "id": "tcpdump-ufw-ssh",
        "desc": "Capture live IPv6/ICMPv6 network packets (`tcpdump`), manage Ubuntu UFW IPv6 firewall rules, and create SSH tunnels",
        "cmd": "tcpdump -ni any 'ip6 and (tcp port 443 or icmp6)' -nn -vv -c 50",
        "details": "'tcpdump -ni any' captures packets across all interfaces without blocking on DNS or port name resolution (-nn). Filtering 'icmp6' captures IPv6 ping, Neighbor Discovery (NDP), and Router Advertisements.",
        "flags": [
          [
            "ip6 / icmp6",
            "Capture IPv6 traffic and ICMPv6 (Neighbor Solicitation/Advertisement, Router Advertisements, Ping6)"
          ],
          [
            "-nn",
            "Do not resolve hostnames or port service names"
          ],
          [
            "-i any",
            "Capture on all interfaces (or specify eth0 / bond0)"
          ]
        ],
        "subcommands": [
          [
            "ufw status numbered && ufw allow from 2001:db8:dc::/48 to any port 22 proto tcp",
            "View numbered Ubuntu UFW firewall rules and allow SSH only from internal 2001:db8:dc::/48 IPv6 prefix"
          ],
          [
            "ssh -6 -N -L \"[::1]:5432:[2001:db8:dc::db]:5432\" user@bastion-host",
            "Forward local IPv6 loopback port 5432 securely through an SSH bastion host to an internal IPv6 database"
          ],
          [
            "mtr -6 -rwzbc 20 2606:4700:4700::1111",
            "Run IPv6 My Traceroute report showing per-hop packet loss %, ASN, and latency jitter over 20 pings"
          ]
        ],
        "tags": [
          "tcpdump",
          "ipv6",
          "icmp6",
          "pcap",
          "ufw",
          "firewall",
          "ssh",
          "tunnel",
          "mtr",
          "traceroute"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("network_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const totalCommands = NETWORK_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of NETWORK_DATA) {
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

  for (const section of NETWORK_DATA) {
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
        localStorage.setItem("network_bookmarks", JSON.stringify([...state.bookmarks]));
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
