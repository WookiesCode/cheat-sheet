// macos-net-disk-sec.js
// Standalone interactive cheat sheet for macOS: Networking, Disks, Gatekeeper & Keychain
const MACOS_NET_DISK_SEC_DATA = [
  {
    "id": "net-disk-sec-card-1",
    "badge": "net",
    "title": "Networking: DNS Cache Flush & Apple networkQuality",
    "subtitle": "Flush macOS DNS cache, inspect active resolver config, or run Apple's network speed test",
    "commands": [
      {
        "id": "dns-flush-and-lookup",
        "mode": "NETWORK",
        "modeClass": "mode-t",
        "desc": "Flush macOS DNS cache, inspect active resolver config, or run Apple's network speed test",
        "cmd": "dscacheutil -flushcache; killall -HUP mDNSResponder   |   scutil --dns   |   networkQuality",
        "flags": [
          [
            "killall -HUP mDNSResponder",
            "Flush macOS DNS resolver cache immediately"
          ],
          [
            "scutil --dns",
            "Show exact DNS resolvers (including VPN/Tailscale split-DNS order)"
          ],
          [
            "networkQuality -v",
            "Built-in macOS uplink/downlink throughput & responsiveness (RPM) test"
          ]
        ],
        "tip": "networkQuality is built-in!",
        "tags": [
          "dns",
          "flush",
          "speedtest",
          "network",
          "scutil",
          "vpn"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://keith.github.io/xcode-man-pages/dscacheutil.1.html",
              "title": "dscacheutil man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/mDNSResponder.8.html",
              "title": "mDNSResponder man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/scutil.8.html",
              "title": "scutil man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/networkQuality.8.html",
              "title": "networkQuality man page (Xcode man-page mirror)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "net-disk-sec-card-2",
    "badge": "net",
    "title": "Networking: LAN IP, Listening TCP Ports (lsof) & Wi-Fi",
    "subtitle": "Get local LAN IP, list listening TCP ports (`lsof`), or manage interfaces via `networksetup`",
    "commands": [
      {
        "id": "ip-ports-wifi",
        "mode": "NETWORK",
        "modeClass": "mode-t",
        "desc": "Get local LAN IP, list listening TCP ports (`lsof`), or manage interfaces via `networksetup`",
        "cmd": "ipconfig getifaddr en0   |   lsof -iTCP -sTCP:LISTEN -n -P   |   networksetup -listallhardwareports",
        "flags": [
          [
            "ipconfig getifaddr en0",
            "Print clean LAN IPv4 address of primary interface (en0)"
          ],
          [
            "lsof -i :3000",
            "Find which process is occupying port 3000 on macOS"
          ],
          [
            "networksetup -setdnsservers Wi-Fi 2606:4700:4700::1111 2001:4860:4860::8888",
            "Set IPv6 DNS servers for Wi-Fi from CLI"
          ]
        ],
        "tags": [
          "ip",
          "ports",
          "lsof",
          "listen",
          "wifi",
          "en0",
          "networksetup"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://keith.github.io/xcode-man-pages/ipconfig.8.html",
              "title": "ipconfig man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/lsof.8.html",
              "title": "lsof man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/networksetup.8.html",
              "title": "networksetup man page (Xcode man-page mirror)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "net-disk-sec-card-3",
    "badge": "net",
    "title": "Networking: Fix Damaged App Quarantine (xattr -d)",
    "subtitle": "Fix 'App is damaged / unverified developer' by clearing quarantine xattr or verify signature",
    "commands": [
      {
        "id": "gatekeeper-quarantine-codesign",
        "mode": "SECURITY",
        "modeClass": "mode-t",
        "desc": "Fix 'App is damaged / unverified developer' by clearing quarantine xattr or verify signature",
        "cmd": "xattr -dr com.apple.quarantine /Applications/App.app   |   codesign -dv --verbose=4 /Applications/App.app",
        "flags": [
          [
            "xattr -dr com.apple.quarantine",
            "Recursively strip Gatekeeper download quarantine flag from an app/binary"
          ],
          [
            "codesign -dv --verbose=4",
            "Inspect Developer Team ID and code signature of an app"
          ],
          [
            "spctl --assess -vv /Applications/App.app",
            "Test whether Gatekeeper approves an application"
          ]
        ],
        "tip": "Only for software you trust: this skips Gatekeeper's check",
        "tags": [
          "quarantine",
          "xattr",
          "gatekeeper",
          "damaged",
          "codesign",
          "unverified"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://keith.github.io/xcode-man-pages/xattr.1.html",
              "title": "xattr man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/codesign.1.html",
              "title": "codesign man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/spctl.8.html",
              "title": "spctl man page (Xcode man-page mirror)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "net-disk-sec-card-4",
    "badge": "net",
    "title": "Networking: Saved Wi-Fi Passwords & Keychain CLI",
    "subtitle": "Retrieve saved Wi-Fi password or store/fetch secrets in macOS Keychain from CLI",
    "commands": [
      {
        "id": "keychain-security-cli",
        "mode": "SECURITY",
        "modeClass": "mode-t",
        "desc": "Retrieve saved Wi-Fi password or store/fetch secrets in macOS Keychain from CLI",
        "cmd": "security find-generic-password -D 'AirPort network password' -wa 'MyWiFi'",
        "flags": [
          [
            "-wa <name>",
            "Print only the raw password string (-w) for account <name>"
          ],
          [
            "security add-generic-password -a $USER -s my_api_key -w",
            "Save a secret into the login keychain; -w last makes it prompt, so the secret stays out of shell history"
          ]
        ],
        "tags": [
          "keychain",
          "password",
          "wifi",
          "secret",
          "security"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://keith.github.io/xcode-man-pages/security.1.html",
              "title": "security man page (Xcode man-page mirror)"
            }
          ],
          "note": "Corrected 2026-11-10: -w with the password on the command line puts it in history; the man page recommends -w last to prompt."
        }
      }
    ]
  },
  {
    "id": "net-disk-sec-card-5",
    "badge": "net",
    "title": "Networking: APFS Containers, Drive Eject & DMG Mount",
    "subtitle": "List disks and APFS containers, safely eject external drives, or mount .dmg images",
    "commands": [
      {
        "id": "diskutil-apfs-dmg",
        "mode": "STORAGE",
        "modeClass": "mode-t",
        "desc": "List disks and APFS containers, safely eject external drives, or mount .dmg images",
        "cmd": "diskutil list   |   diskutil apfs list   |   diskutil eject /dev/disk4   |   hdiutil attach app.dmg",
        "flags": [
          [
            "diskutil list",
            "Show all physical disks, partitions, and synthesized APFS containers"
          ],
          [
            "diskutil unmountDisk force /dev/disk4",
            "Force unmount stubborn external drive"
          ],
          [
            "hdiutil attach / detach",
            "Mount or unmount a .dmg or .iso disk image from CLI"
          ]
        ],
        "tags": [
          "diskutil",
          "apfs",
          "eject",
          "unmount",
          "dmg",
          "hdiutil",
          "usb"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://keith.github.io/xcode-man-pages/diskutil.8.html",
              "title": "diskutil man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/hdiutil.1.html",
              "title": "hdiutil man page (Xcode man-page mirror)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "net-disk-sec-pro-tips",
    "badge": "tip",
    "title": "Networking: Pro Tips & Tricks",
    "subtitle": "Quarantine xattr clearance, Apple networkQuality & Keychain password recovery",
    "commands": [
      {
        "id": "net-disk-sec-tips-card",
        "desc": "Quarantine xattr clearance, Apple networkQuality & Keychain password recovery",
        "cmd": "xattr -dr com.apple.quarantine /Applications/App.app   |   networkQuality -v   |   security find-generic-password",
        "details": "For an app you trust that Gatekeeper calls \"damaged\", remove only the quarantine attribute with xattr -dr com.apple.quarantine (xattr -c would clear every attribute). Measure throughput and responsiveness under load with networkQuality.",
        "flags": [
          [
            "xattr -dr com.apple.quarantine <path>",
            "Recursively delete just the quarantine attribute (-c clears all attributes)"
          ],
          [
            "networkQuality -v",
            "Run Apple official responsiveness test (RPM, latency & bufferbloat)"
          ],
          [
            "dscacheutil -flushcache; killall -HUP mDNSResponder",
            "Completely flush and reset macOS DNS cache"
          ],
          [
            "security find-generic-password -ga \"SSID\"",
            "Retrieve saved Wi-Fi WPA2/WPA3 password from Keychain"
          ],
          [
            "diskutil list",
            "List all physical disks, synthesize APFS containers, and volume groups"
          ]
        ],
        "tip": "Run codesign -dvvv /Applications/App.app to verify code signatures and team identifiers!",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://keith.github.io/xcode-man-pages/xattr.1.html",
              "title": "xattr man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/networkQuality.8.html",
              "title": "networkQuality man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/dscacheutil.1.html",
              "title": "dscacheutil man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/security.1.html",
              "title": "security man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/diskutil.8.html",
              "title": "diskutil man page (Xcode man-page mirror)"
            },
            {
              "url": "https://keith.github.io/xcode-man-pages/codesign.1.html",
              "title": "codesign man page (Xcode man-page mirror)"
            }
          ],
          "note": "Corrected 2026-11-10: xattr -cr clears every extended attribute, not just quarantine."
        },
        "tags": [
          "net-disk-sec",
          "tips",
          "pro",
          "tricks",
          "macos",
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
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("macos_net-disk-sec_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM References
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

// macOS Shortcut & Command Syntax Highlighting
function highlightMacCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /([⌘⌥⌃⇧🌐⎋⌫↩]+[A-Za-z0-9`.\-\/←→↑↓]*)|(\s\|\s)|(\b(?:defaults|brew|open|pbcopy|pbpaste|mdfind|mdls|qlmanage|sips|say|afplay|caffeinate|pmset|plutil|launchctl|sw_vers|system_profiler|sysctl|softwareupdate|xcode-select|dscacheutil|killall|scutil|networkQuality|ipconfig|lsof|networksetup|xattr|codesign|spctl|security|diskutil|hdiutil|sudo)\b)|(\s-[a-zA-Z0-9-]+|\s--[a-zA-Z0-9-]+)/g,
    (match, modChord, sep, cliCmd, flagPart) => {
      if (modChord) return '<span class="tok-flag">' + modChord + '</span>';
      if (sep) return '<span class="tok-comment">' + sep + '</span>';
      if (cliCmd) return '<span class="tok-cmd">' + cliCmd + '</span>';
      if (flagPart) return '<span class="tok-flag">' + flagPart + '</span>';
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = MACOS_NET_DISK_SEC_DATA;
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

  for (const card of MACOS_NET_DISK_SEC_DATA) {
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
        '      title="' + (isBookmarked ? "Remove bookmark" : "Bookmark this shortcut") + '"',
        '      aria-label="' + (isBookmarked ? "Remove bookmark" : "Bookmark this shortcut") + '"',
        '    >',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <path fill="' + (isBookmarked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        '      </svg>',
        '    </button>',
        '  </div>',
        '',
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy shortcut">',
        '    <pre class="cmd-code"><code>' + highlightMacCmd(cmd.cmd) + '</code></pre>',
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
        localStorage.setItem("macos_net-disk-sec_bookmarks", JSON.stringify([...state.bookmarks]));
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
