// scp.js
// Standalone interactive cheat sheet for scp — IPv6 SSH File Transfers & 3-Way Remote Copy
const SCP_DATA = [
  {
    "id": "scp-core",
    "badge": "scp",
    "title": "scp — Core Command & Flags",
    "subtitle": "Primary execution syntax, parameter flags, and datacenter defaults",
    "commands": [
      {
        "id": "scp-file-transfers-main",
        "desc": "Copy files or directories over IPv6 SSH using bracketed literal IPv6 syntax (`[2001:db8::]`), custom port (-P), and 3-way routing (-3)",
        "cmd": "scp -6 -r -p -P 2222 -J user@bastion /local/firmware/ \"root@[2001:db8:dc:4::15]:/tmp/firmware/\"",
        "details": "When using literal IPv6 addresses with 'scp' or 'rsync', wrap the IPv6 address in square brackets ('root@[2001:db8:dc:4::15]:/path') and quote it so the colons inside the IPv6 address are not misinterpreted as the host:path separator! Note that 'scp' uses capital '-P <port>' for the SSH port.",
        "flags": [
          [
            "-6",
            "Force IPv6 transport (wrap literal IPv6 host in brackets: user@[2001:db8::1]:/path)"
          ],
          [
            "-r",
            "Recursively copy entire directories"
          ],
          [
            "-p",
            "Preserve original modification times, access times, and file permission modes"
          ],
          [
            "-P <port>",
            "Connect to a non-standard SSH port on the remote host (capital -P!)"
          ],
          [
            "-J user@host",
            "Connect through one or more SSH ProxyJump bastion hosts"
          ],
          [
            "-3",
            "Copy between two remote hosts routed through the local machine"
          ],
          [
            "-l <Kbit/s>",
            "Limit transfer bandwidth in Kbit/s (e.g., -l 80000 = ~10 MB/s)"
          ]
        ],
        "subcommands": [],
        "tip": "Always wrap literal IPv6 addresses in brackets: root@[2001:db8::1]:/path",
        "tags": [
          "scp",
          "ipv6",
          "ssh",
          "transfer",
          "copy",
          "bastion",
          "proxyjump",
          "port"
        ]
      }
    ]
  },
  {
    "id": "scp-variations",
    "badge": "rec",
    "title": "scp — Variations & Targeted Recipes",
    "subtitle": "Common production flags, filtered runs, and specialized use cases",
    "commands": [
      {
        "id": "scp-file-transfers-sub-1",
        "desc": "Copy a file directly from remote Server A to remote Server B over IPv6 routed through your local jumpbox (-3)",
        "cmd": "scp -6 -3 \"root@[2001:db8:dc:4::10]:/etc/netplan/01-netcfg.yaml\" \"root@[2001:db8:dc:4::11]:/etc/netplan/01-netcfg.yaml\"",
        "details": "Production variation: Copy a file directly from remote Server A to remote Server B over IPv6 routed through your local jumpbox (-3). Useful for triage, automation, and targeted filtering.",
        "flags": [],
        "subcommands": [],
        "tip": "Frequently used with scp in production workflows",
        "tags": [
          "scp",
          "ipv6",
          "ssh",
          "transfer",
          "copy",
          "bastion",
          "proxyjump",
          "port",
          "variation",
          "recipe"
        ]
      },
      {
        "id": "scp-file-transfers-sub-2",
        "desc": "Copy firmware over IPv6 to a freshly imaged rack server without failing on changed/unknown known_hosts keys",
        "cmd": "scp -6 -o StrictHostKeyChecking=accept-new -o UserKnownHostsFile=/dev/null bios.bin \"root@[2001:db8:dc:4::50]:/tmp/\"",
        "details": "Production variation: Copy firmware over IPv6 to a freshly imaged rack server without failing on changed/unknown known_hosts keys. Useful for triage, automation, and targeted filtering.",
        "flags": [],
        "subcommands": [],
        "tip": "Frequently used with scp in production workflows",
        "tags": [
          "scp",
          "ipv6",
          "ssh",
          "transfer",
          "copy",
          "bastion",
          "proxyjump",
          "port",
          "variation",
          "recipe"
        ]
      }
    ]
  },
  {
    "id": "scp-pipelines",
    "badge": "pipe",
    "title": "scp — Pipeline & Composer Workflows",
    "subtitle": "Composing scp with grep, awk, sort, column, and system tools",
    "commands": [
      {
        "id": "scp-pipe-1",
        "desc": "Copy Directory via Bastion / Custom Port (-r -p -P -J)",
        "cmd": "scp -r -p -P 22 -J user@bastion ./firmware/ root@10.20.4.15:/tmp/",
        "details": "Recursively copies a directory preserving timestamps/modes (-p) over SSH port (-P) through a bastion host (-J).",
        "flags": [],
        "subcommands": [],
        "tip": "Composite shell pipeline",
        "tags": [
          "scp",
          "ipv6",
          "ssh",
          "transfer",
          "copy",
          "bastion",
          "proxyjump",
          "port",
          "pipe",
          "composite"
        ]
      },
      {
        "id": "scp-pipe-2",
        "desc": "Copy Directly Between Two Remote Servers (-3)",
        "cmd": "scp -3 root@10.20.4.15:/etc/netplan/01-netcfg.yaml root@10.20.4.16:/etc/netplan/",
        "details": "Routes a file copy between two remote rack servers through your local jumpbox (-3) when the servers cannot SSH to each other.",
        "flags": [],
        "subcommands": [],
        "tip": "Composite shell pipeline",
        "tags": [
          "scp",
          "ipv6",
          "ssh",
          "transfer",
          "copy",
          "bastion",
          "proxyjump",
          "port",
          "pipe",
          "composite"
        ]
      },
      {
        "id": "scp-pipe-3",
        "desc": "Serve Current Directory over HTTP for BMC/ISO Pull (python3)",
        "cmd": "python3 -m http.server 8000 --directory /srv/firmware",
        "details": "Starts an instant HTTP server so a BMC or isolated rack server can pull firmware/ISOs via curl or wget.",
        "flags": [],
        "subcommands": [],
        "tip": "Composite shell pipeline",
        "tags": [
          "scp",
          "ipv6",
          "ssh",
          "transfer",
          "copy",
          "bastion",
          "proxyjump",
          "port",
          "pipe",
          "composite"
        ]
      }
    ]
  },
  {
    "id": "scp-tips-diag",
    "badge": "tip",
    "title": "scp — Pro Tips & Datacenter Triage",
    "subtitle": "Operational guidelines, exit codes, signal handling, and safe defaults",
    "commands": [
      {
        "id": "scp-pro-tips",
        "desc": "Operational guidelines, safety flags, and best practices for scp",
        "cmd": "man scp 2>/dev/null || scp --help | head -n 30",
        "details": "Always wrap literal IPv6 addresses in brackets: root@[2001:db8::1]:/path. Always test destructive or high-I/O flags in a staging environment. Verify exit status using 'echo $?' after pipeline executions.",
        "flags": [
          [
            "--help / -h",
            "Display short parameter reference and available flags"
          ],
          [
            "$? == 0",
            "Standard exit status indicating clean termination and success"
          ],
          [
            "$? != 0",
            "Non-zero exit code indicating error, pattern mismatch, or interruption"
          ]
        ],
        "subcommands": [
          [
            "which scp && scp --version 2>&1 | head -n 1",
            "Verify binary path and installed version in current environment"
          ]
        ],
        "tip": "Always wrap literal IPv6 addresses in brackets: root@[2001:db8::1]:/path",
        "tags": [
          "scp",
          "ipv6",
          "ssh",
          "transfer",
          "copy",
          "bastion",
          "proxyjump",
          "port",
          "tips",
          "safety",
          "help"
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("scp_bookmarks") || "[]"))
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
  const totalCommands = SCP_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of SCP_DATA) {
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

  for (const section of SCP_DATA) {
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
        localStorage.setItem("scp_bookmarks", JSON.stringify([...state.bookmarks]));
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
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  } else {
    document.documentElement.removeAttribute("data-theme");
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
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
