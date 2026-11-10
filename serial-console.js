// serial-console.js
// Standalone interactive cheat sheet for BMC vendor tools: Serial Consoles: picocom, ser2net and conserver
const BMC_SERIAL_CONSOLE_DATA = [
  {
    "id": "serial-cmd-1",
    "badge": "serial",
    "title": "Serial consoles: Open a USB serial console",
    "subtitle": "Open a USB serial console",
    "commands": [
      {
        "id": "serial-picocom",
        "desc": "Open a USB serial console",
        "cmd": "picocom -b 115200 /dev/ttyUSB0",
        "details": "",
        "flags": [
          [
            "-b 115200",
            "Baud rate: most servers and switches use 115200 or 9600"
          ],
          [
            "C-a C-x",
            "Exit and reset the port"
          ],
          [
            "C-a C-q",
            "Quit without resetting the port"
          ],
          [
            "C-a C-h",
            "Help: every C-a command"
          ],
          [
            "C-a C-\\",
            "Send a break"
          ],
          [
            "-g <file>",
            "Log the session to a file"
          ]
        ],
        "tip": "Use /dev/serial/by-id paths: ttyUSB numbers change on replug",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "serial",
          "picocom",
          "console",
          "usb",
          "tty"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/npat-efault/picocom/blob/master/picocom.1.md",
              "title": "picocom(1)"
            }
          ]
        }
      },
      {
        "id": "serial-picocom-sub-1",
        "desc": "Stable names for USB serial adapters",
        "cmd": "ls -l /dev/serial/by-id/",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "A standard Linux path, not checked against a document."
        }
      },
      {
        "id": "serial-picocom-sub-2",
        "desc": "Which ttyUSB the adapter just became",
        "cmd": "dmesg -T | grep -i tty",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "Standard Linux commands, not checked against a document."
        }
      },
      {
        "id": "serial-picocom-sub-3",
        "desc": "Are you in the dialout (or uucp) group that owns the port?",
        "cmd": "id -nG",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "Standard command; the group name (dialout or uucp) depends on the distribution."
        }
      }
    ]
  },
  {
    "id": "serial-cmd-2",
    "badge": "serial",
    "title": "Serial consoles: Share a serial port on the network with ser2net",
    "subtitle": "Share a serial port on the network with ser2net (YAML)",
    "commands": [
      {
        "id": "serial-ser2net",
        "desc": "Share a serial port on the network with ser2net (YAML)",
        "cmd": "connection: &rack12-sw1\n  accepter: telnet(rfc2217),tcp,3001\n  connector: serialdev,/dev/ttyUSB0,115200N81\n  options:\n    kickolduser: false\n    banner: \"rack12-sw1 console\\r\\n\"",
        "details": "",
        "flags": [
          [
            "/etc/ser2net/ser2net.yaml",
            "The YAML config path in the ser2net README (some distro packages put it elsewhere: check your package)"
          ],
          [
            "accepter",
            "What clients connect to: tcp,<port> or telnet(rfc2217),tcp,<port>"
          ],
          [
            "connector",
            "The device: serialdev,<path>,<baud><parity><bits><stop>"
          ],
          [
            "kickolduser",
            "true: a new user takes over from the old one"
          ],
          [
            "max-connections",
            "Default 1"
          ],
          [
            "*{file}",
            "YAML v1: insert a file's contents, so secrets stay out of the config"
          ]
        ],
        "tip": "Bind ser2net to a management VLAN only: it has no login by default",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "ser2net",
          "serial",
          "network",
          "yaml",
          "rfc2217"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/README.rst",
              "title": "ser2net README"
            }
          ],
          "note": "kickolduser, max-connections and the *{file} include are in ser2net.yaml(5), which could not be read."
        }
      },
      {
        "id": "serial-ser2net-sub-1",
        "desc": "Is it running?",
        "cmd": "systemctl status ser2net --no-pager",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "ser2net",
          "serial",
          "network"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "The service name depends on your ser2net package."
        }
      },
      {
        "id": "serial-ser2net-sub-2",
        "desc": "Connect (the README recommends gensiot over telnet)",
        "cmd": "gensiot telnet(rfc2217),tcp,localhost,3001",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "ser2net",
          "serial",
          "network"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/README.rst",
              "title": "ser2net README"
            },
            {
              "url": "https://github.com/cminyard/gensio",
              "title": "gensio / gensiot"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "serial-cmd-3",
    "badge": "serial",
    "title": "Serial consoles: List and attach to logged consoles",
    "subtitle": "List and attach to logged consoles (conserver)",
    "commands": [
      {
        "id": "serial-conserver",
        "desc": "List and attach to logged consoles (conserver)",
        "cmd": "console -u",
        "details": "",
        "flags": [
          [
            "console -u",
            "Every console with state (up, down, init) and who is attached"
          ],
          [
            "console <name>",
            "Attach read-write"
          ],
          [
            "console -s <name>",
            "Spy: read-only"
          ],
          [
            "^Ec.",
            "Disconnect (Ctrl-E, c, period)"
          ],
          [
            "^Ec?",
            "List escape commands"
          ],
          [
            "^Ecr / ^Ecl0",
            "Replay recent output / send a break"
          ]
        ],
        "tip": "conserver logs every console, so the boot that crashed at 3 a.m. is in the log",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "conserver",
          "console",
          "serial",
          "logging"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/console.man.html",
              "title": "conserver console(1)"
            }
          ]
        }
      },
      {
        "id": "serial-conserver-sub-1",
        "desc": "Watch a console without typing into it",
        "cmd": "console -s rack12-node07",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "conserver",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/console.man.html",
              "title": "conserver console(1)"
            }
          ]
        }
      },
      {
        "id": "serial-conserver-sub-2",
        "desc": "Who is attached where",
        "cmd": "console -w",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "conserver",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/console.man.html",
              "title": "conserver console(1)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "serial-cmd-4",
    "badge": "serial",
    "title": "Serial consoles: conserver console for an IPMI SOL target",
    "subtitle": "conserver console for an IPMI SOL target",
    "commands": [
      {
        "id": "serial-conserver-ipmi",
        "desc": "conserver console for an IPMI SOL target",
        "cmd": "console rack12-node07 {\n  master localhost;\n  type ipmi;\n  host rack12-node07-bmc.example.com;\n  username <bmc_user>;\n  rw *;\n}",
        "details": "",
        "flags": [
          [
            "type ipmi",
            "IPMI Serial-over-LAN through FreeIPMI"
          ],
          [
            "host / username / password",
            "BMC address and login. Keep the password in a root-only include, never in a shared copy"
          ],
          [
            "ipmiciphersuite / ipmiprivlevel",
            "Cipher suite and privilege (default admin)"
          ],
          [
            "type device + device + baud",
            "A local serial port instead"
          ]
        ],
        "tip": "chmod 600 conserver.cf when it holds BMC passwords",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "conserver",
          "ipmi",
          "sol",
          "config"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/conserver.cf.man.html",
              "title": "conserver.cf(5)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "serial-pro-tips",
    "badge": "tip",
    "title": "Serial consoles: Pro Tip",
    "subtitle": "Pick the console path by situation",
    "commands": [
      {
        "id": "serial-tips-card",
        "desc": "Pick the console path by situation",
        "cmd": "ipmiconsole -h $BMC -u $BMC_USER -P --dont-steal",
        "details": "OS hung but BMC alive → SOL (ipmiconsole, ipmitool sol activate, or the conserver entry). BMC unreachable or a switch with no network → USB serial and picocom. Console that several people need, or one you want logged → ser2net or conserver.",
        "flags": [
          [
            "SOL",
            "Through the BMC network"
          ],
          [
            "USB serial",
            "When the network is the problem"
          ]
        ],
        "tip": "Log every console session to the case folder",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "tips",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("serial-console_bookmarks") || "[]"); } catch (e) { return []; } })())
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

// Command Syntax Highlighting
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
  const allCards = BMC_SERIAL_CONSOLE_DATA;
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

  for (const card of BMC_SERIAL_CONSOLE_DATA) {
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
        localStorage.setItem("serial-console_bookmarks", JSON.stringify([...state.bookmarks]));
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
