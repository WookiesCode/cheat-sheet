// win-network.js
// Standalone interactive cheat sheet for Windows: Networking, Ports, DNS & Firewall
const WIN_WIN_NETWORK_DATA = [
  {
    "id": "ps-net-card-1",
    "badge": "net",
    "title": "Networking: Listening TCP Ports & Process ID (Get-NetTCPConnection)",
    "subtitle": "Find which process owns a listening TCP port (PowerShell & netstat one-liners)",
    "commands": [
      {
        "id": "find-listening-ports-pid",
        "mode": "NETWORK",
        "modeClass": "mode-t",
        "desc": "Find which process owns a listening TCP port (PowerShell & netstat one-liners)",
        "cmd": "Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object LocalPort,State,OwningProcess,@{N='Process';E={(Get-Process -Id $_.OwningProcess).ProcessName}}",
        "flags": [
          [
            "Get-NetTCPConnection",
            "Native object replacement for netstat (use -State Listen for all open ports)"
          ],
          [
            "netstat -ano | findstr :3000",
            "Classic fast CMD/PS alternative showing PID in last column"
          ]
        ],
        "tip": "Windows equivalent of lsof -i",
        "tags": [
          "ports",
          "listen",
          "pid",
          "netstat",
          "lsof",
          "tcp"
        ]
      }
    ]
  },
  {
    "id": "ps-net-card-2",
    "badge": "net",
    "title": "Networking: Network Port Test & Traceroute (Test-NetConnection)",
    "subtitle": "Test remote TCP port connectivity, IPv6/IPv4 ping latency, or trace route (nc / traceroute)",
    "commands": [
      {
        "id": "test-netconnection-tnc",
        "mode": "NETWORK",
        "modeClass": "mode-t",
        "desc": "Test remote TCP port connectivity, IPv6/IPv4 ping latency, or trace route (nc / traceroute)",
        "cmd": "Test-NetConnection -ComputerName github.com -Port 443   |   tnc 2606:4700:4700::1111 -TraceRoute",
        "flags": [
          [
            "tnc <host> -Port <p>",
            "Test TCP handshake to remote port (returns TcpTestSucceeded: True/False)"
          ],
          [
            "-TraceRoute",
            "Perform hop-by-hop route trace to target IPv6/IPv4 host"
          ],
          [
            "-InformationLevel Detailed",
            "Show local interface, source IPv6/IPv4, and matching route"
          ]
        ],
        "tip": "Alias: tnc host -Port 443",
        "tags": [
          "ping",
          "ipv6",
          "port",
          "telnet",
          "nc",
          "traceroute",
          "tnc"
        ]
      }
    ]
  },
  {
    "id": "ps-net-card-3",
    "badge": "net",
    "title": "Networking: DNS Record Query & Cache Flush (Resolve-DnsName)",
    "subtitle": "Query specific DNS record types (`AAAA`, `TXT`, `MX`) or flush Windows DNS cache",
    "commands": [
      {
        "id": "dns-resolve-flush",
        "mode": "NETWORK",
        "modeClass": "mode-t",
        "desc": "Query specific DNS record types (`AAAA`, `TXT`, `MX`) or flush Windows DNS cache",
        "cmd": "Resolve-DnsName -Name example.com -Type AAAA -Server 2606:4700:4700::1111   |   Clear-DnsClientCache",
        "flags": [
          [
            "Resolve-DnsName",
            "Query AAAA, A, MX, TXT, CNAME, SRV records"
          ],
          [
            "-Server 2606:4700:4700::1111",
            "Query a specific upstream IPv6 DNS resolver"
          ],
          [
            "Clear-DnsClientCache",
            "Flush local DNS cache (same as ipconfig /flushdns)"
          ]
        ],
        "tags": [
          "dns",
          "ipv6",
          "aaaa",
          "dig",
          "nslookup",
          "flush",
          "txt",
          "mx"
        ]
      }
    ]
  },
  {
    "id": "ps-net-card-4",
    "badge": "net",
    "title": "Networking: REST API Queries & HTTP Downloads (Invoke-RestMethod)",
    "subtitle": "Fetch JSON REST APIs directly into PowerShell objects or download files via HTTP",
    "commands": [
      {
        "id": "invoke-restmethod-webrequest",
        "mode": "NETWORK",
        "modeClass": "mode-t",
        "desc": "Fetch JSON REST APIs directly into PowerShell objects or download files via HTTP",
        "cmd": "Invoke-RestMethod -Uri 'https://ifconfig.me/all.json'   |   Invoke-WebRequest -Uri $url -OutFile app.zip",
        "flags": [
          [
            "Invoke-RestMethod (irm)",
            "Automatically parses JSON/XML HTTP response into native objects!"
          ],
          [
            "Invoke-WebRequest (iwr)",
            "Download files or inspect HTTP status headers"
          ]
        ],
        "tip": "Note: use curl.exe for real curl",
        "tags": [
          "curl",
          "http",
          "api",
          "rest",
          "download",
          "irm"
        ]
      }
    ]
  },
  {
    "id": "ps-net-card-5",
    "badge": "net",
    "title": "Networking: IP Configuration & Firewall Port Rules",
    "subtitle": "List clean IPv4 addresses, network interfaces, or open a Windows Firewall port",
    "commands": [
      {
        "id": "ip-adapters-firewall",
        "mode": "NETWORK",
        "modeClass": "mode-t",
        "desc": "List clean IPv4 addresses, network interfaces, or open a Windows Firewall port",
        "cmd": "Get-NetIPAddress -AddressFamily IPv4 | Select-Object InterfaceAlias, IPAddress   |   New-NetFirewallRule -DisplayName 'Dev 8080' -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow",
        "flags": [
          [
            "Get-NetAdapter",
            "List physical & virtual NICs with link speed and MAC address"
          ],
          [
            "New-NetFirewallRule",
            "Create inbound/outbound Windows Defender Firewall rule from Admin PS"
          ]
        ],
        "tags": [
          "ip",
          "ipconfig",
          "firewall",
          "adapter",
          "nic",
          "port"
        ]
      }
    ]
  },
  {
    "id": "ps-net-pro-tips",
    "badge": "tip",
    "title": "Networking: Pro Tips & Best Practices",
    "subtitle": "Instant listening port ownership mapping & PowerShell netcat replacement",
    "commands": [
      {
        "id": "ps-net-tips-card",
        "desc": "Instant listening port ownership mapping & PowerShell netcat replacement",
        "cmd": "Get-NetTCPConnection -State Listen | Select LocalPort, OwningProcess   |   Test-NetConnection",
        "details": "Map listening TCP ports directly to process IDs without third-party utilities. Use Test-NetConnection as a built-in replacement for netcat, telnet, and traceroute.",
        "flags": [
          [
            "Get-NetTCPConnection -State Listen",
            "Returns all active listening TCP ports with OwningProcess PID"
          ],
          [
            "Test-NetConnection -ComputerName 1.1.1.1 -Port 443",
            "Tests TCP handshake connectivity and reports ping RTT"
          ],
          [
            "Resolve-DnsName -Name google.com -Type AAAA",
            "Queries specific DNS records bypassing local hosts file"
          ],
          [
            "Clear-DnsClientCache",
            "Immediately purges Windows DNS resolver cache"
          ]
        ],
        "tip": "Use Invoke-RestMethod instead of curl to parse JSON REST endpoints directly into PowerShell objects!",
        "tags": [
          "ps-net",
          "tips",
          "pro",
          "windows",
          "powershell",
          "best-practices"
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("win-network_bookmarks") || "[]"))
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

// Windows Shortcut & PowerShell Syntax Highlighting
function highlightPsCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(\b(?:Win|Ctrl|Alt|Shift)(?:\+[A-Za-z0-9←→↑↓.`]+)+)|(\s\|\s)|(\b[A-Z][a-zA-Z]+-[A-Z][a-zA-Z0-9]+\b|\b(?:winget|wsl|robocopy|powercfg|shutdown|DISM\.exe|sfc|netstat|findstr|where\.exe|explorer\.exe|clip\.exe|notepad)\b)|(\$[a-zA-Z0-9_:]+|\$_)|(\s-[a-zA-Z0-9-]+|\s\/[a-zA-Z0-9:]+)/g,
    (match, shortcut, sep, cmdlet, variable, flag) => {
      if (shortcut) return '<span class="tok-flag">' + shortcut + '</span>';
      if (sep) return '<span class="tok-pipe">' + sep + '</span>';
      if (cmdlet) return '<span class="tok-cmd">' + cmdlet + '</span>';
      if (variable) return '<span class="tok-str">' + variable + '</span>';
      if (flag) return '<span class="tok-flag">' + flag + '</span>';
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = WIN_WIN_NETWORK_DATA;
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

  for (const card of WIN_WIN_NETWORK_DATA) {
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
            '    <pre class="cmd-code"><code>' + highlightPsCmd(cmd.cmd) + '</code></pre>',
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
            '    <pre class="cmd-code"><code>' + highlightPsCmd(cmd.cmd) + '</code></pre>',
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
        localStorage.setItem("win-network_bookmarks", JSON.stringify([...state.bookmarks]));
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
