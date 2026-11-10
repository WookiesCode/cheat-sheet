// rf-discovery.js
// Standalone interactive cheat sheet for Redfish: Discovery, Session Tokens & ETag Headers
const RF_RF_DISCOVERY_DATA = [
  {
    "id": "discovery-auth-cmd-1",
    "badge": "auth",
    "title": "Discovery & Auth: Query `/redfish/v1` ServiceRoot over IPv6",
    "subtitle": "Query `/redfish/v1` ServiceRoot over IPv6 (`-g -6`) and dynamically discover System & Manager URIs",
    "commands": [
      {
        "id": "rf-service-root-discover",
        "desc": "Query `/redfish/v1` ServiceRoot over IPv6 (`-g -6`) and dynamically discover System & Manager URIs",
        "cmd": "SYS_URI=$(curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/Systems\" | jq -r '.Members[0].\"@odata.id\"') && echo \"$SYS_URI\"",
        "details": "",
        "flags": [
          [
            "-g -6",
            "-g turns off URL globbing (curl already accepts numeric [IPv6] addresses without it; -g matters when a URL has other [ ] or { }); -6 resolves names to IPv6 only"
          ],
          [
            ".Members[0].\"@odata.id\"",
            "Extracts exact vendor-specific URI (/redfish/v1/Systems/1 vs /redfish/v1/Systems/System.Embedded.1)"
          ],
          [
            "-sk",
            "-s silent mode, -k ignore self-signed BMC TLS certificate (use %25eth0 for link-local fe80:: addresses)"
          ]
        ],
        "tip": "Link-local BMC address? Write the zone as %25, e.g. [fe80::1%25eth0]",
        "tags": [
          "Discovery & Auth",
          "redfish",
          "rest",
          "api",
          "bmc",
          "discover",
          "serviceroot",
          "systems",
          "uri",
          "members",
          "jq",
          "ipv6"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://curl.se/docs/manpage.html",
              "title": "curl man page"
            },
            {
              "url": "https://curl.se/docs/url-syntax.html",
              "title": "curl URL syntax"
            }
          ],
          "note": "Corrected 2026-11-09: -g is not needed for numeric IPv6 addresses (curl detects them); kept because it is harmless."
        }
      }
    ]
  },
  {
    "id": "discovery-auth-cmd-2",
    "badge": "auth",
    "title": "Discovery & Auth: Create a Redfish Session Token",
    "subtitle": "Create a Redfish Session Token (`X-Auth-Token`) to avoid slow Basic Auth hashing on every request",
    "commands": [
      {
        "id": "rf-session-token-create",
        "desc": "Create a Redfish Session Token (`X-Auth-Token`) to avoid slow Basic Auth hashing on every request",
        "cmd": "curl -g -6 -sk -D - -X POST \"https://[$BMC]/redfish/v1/SessionService/Sessions\" -H \"Content-Type: application/json\" -d \"{\\\"UserName\\\":\\\"$BMC_USER\\\",\\\"Password\\\":\\\"$BMC_PASS\\\"}\"",
        "details": "",
        "flags": [
          [
            "X-Auth-Token:",
            "Grab token from response headers and pass via -H 'X-Auth-Token: <token>' on subsequent requests"
          ],
          [
            "Location:",
            "Session URI (e.g. .../Sessions/1) — send HTTP DELETE to this URI when done to avoid exhausting BMC session slots!"
          ]
        ],
        "tip": "10x faster than Basic Auth",
        "tags": [
          "Discovery & Auth",
          "redfish",
          "rest",
          "api",
          "bmc",
          "session",
          "token",
          "x-auth-token",
          "login",
          "auth",
          "delete"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf",
              "title": "Redfish Specification DSP0266 1.25"
            }
          ],
          "note": "\"Faster than Basic Auth\" is a rule of thumb, not from the spec."
        }
      }
    ]
  },
  {
    "id": "discovery-auth-cmd-3",
    "badge": "auth",
    "title": "Discovery & Auth: Use `$expand=",
    "subtitle": "Use `$expand=.($levels=1)` to fetch an entire collection's child objects in a single HTTP call",
    "commands": [
      {
        "id": "rf-expand-query-param",
        "desc": "Use `$expand=.($levels=1)` to fetch an entire collection's child objects in a single HTTP call",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/Systems/1/Memory?\\$expand=.(\\$levels=1)\" | jq '.Members[] | {Name, CapacityMiB, Manufacturer, SerialNumber, Status}'",
        "details": "",
        "flags": [
          [
            "$expand=.($levels=1)",
            "Inlines all Member objects instead of returning only @odata.id links"
          ],
          [
            "only",
            "Query parameter only (no $): if the collection has exactly one member, return that member instead of the collection"
          ]
        ],
        "tip": "Avoids N+1 HTTP loop",
        "tags": [
          "Discovery & Auth",
          "redfish",
          "rest",
          "api",
          "bmc",
          "expand",
          "levels",
          "collection",
          "batch",
          "fast"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf",
              "title": "Redfish Specification DSP0266 1.25"
            }
          ],
          "note": "Corrected 2026-11-09: the single-member parameter is only, not $only."
        }
      }
    ]
  },
  {
    "id": "discovery-auth-pro-tips",
    "badge": "tip",
    "title": "Discovery & Auth: Pro Tips & Best Practices",
    "subtitle": "Production Redfish API Discovery & Authentication Best Practices",
    "commands": [
      {
        "id": "discovery-auth-tips-card",
        "desc": "Production Redfish API Discovery & Authentication Best Practices",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1\" | jq .",
        "details": "Start at the service root (/redfish/v1) and follow the @odata.id links instead of hard-coding vendor paths. For scripts, log in once with a POST to /redfish/v1/SessionService/Sessions and send the returned X-Auth-Token header on later requests instead of Basic auth on every call.",
        "flags": [
          [
            "-g",
            "Turn off curl URL globbing so [IPv6] brackets in the URL work"
          ],
          [
            "-k",
            "Skip TLS certificate checks (BMCs often use self-signed certificates)"
          ],
          [
            "-H \"X-Auth-Token: <token>\"",
            "Send the session token instead of Basic auth"
          ]
        ],
        "tip": "When the script finishes, DELETE the session URI from the Location header; otherwise the session stays open until it times out.",
        "tags": [
          "discovery-auth",
          "tips",
          "pro",
          "redfish",
          "rest",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf",
              "title": "DMTF DSP0266 Redfish Specification 1.25.0"
            },
            {
              "url": "https://curl.se/docs/manpage.html",
              "title": "curl man page"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("rf-discovery_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Redfish REST & curl Syntax Highlighting
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
  const allCards = RF_RF_DISCOVERY_DATA;
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

  for (const card of RF_RF_DISCOVERY_DATA) {
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
        localStorage.setItem("rf-discovery_bookmarks", JSON.stringify([...state.bookmarks]));
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
