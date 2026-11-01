// win-wsl.js
// Standalone interactive cheat sheet for Windows: WSL 2 (Subsystem for Linux) & Interop
const WIN_WIN_WSL_DATA = [
  {
    "id": "wsl-card-1",
    "badge": "wsl",
    "title": "WSL 2 (Subsystem for Linux): WSL 2 Installation & Distribution Status",
    "subtitle": "Install WSL 2 and Linux distributions, check running state, or update the WSL kernel",
    "commands": [
      {
        "id": "wsl-install-list",
        "mode": "WSL 2",
        "modeClass": "mode-v",
        "desc": "Install WSL 2 and Linux distributions, check running state, or update the WSL kernel",
        "cmd": "wsl --install -d Ubuntu   |   wsl --list --verbose   |   wsl --update   |   wsl --status",
        "flags": [
          [
            "wsl -l -v",
            "List installed distros, running/stopped state, and WSL version (1 or 2)"
          ],
          [
            "wsl -l --online",
            "List all official distros available for download"
          ],
          [
            "wsl --set-default <Distro>",
            "Set default distribution launched by 'wsl'"
          ]
        ],
        "tags": [
          "wsl",
          "ubuntu",
          "linux",
          "install",
          "distro",
          "update"
        ]
      }
    ]
  },
  {
    "id": "wsl-card-2",
    "badge": "wsl",
    "title": "WSL 2 (Subsystem for Linux): WSL VM Shutdown & Root Login",
    "subtitle": "Shut down the WSL 2 lightweight VM (reclaims RAM), terminate a distro, or log in as root",
    "commands": [
      {
        "id": "wsl-shutdown-root",
        "mode": "WSL 2",
        "modeClass": "mode-v",
        "desc": "Shut down the WSL 2 lightweight VM (reclaims RAM), terminate a distro, or log in as root",
        "cmd": "wsl --shutdown   |   wsl --terminate Ubuntu   |   wsl -d Ubuntu -u root",
        "flags": [
          [
            "--shutdown",
            "Immediately stop all running distros and the WSL 2 virtual machine"
          ],
          [
            "-u root",
            "Launch shell inside distro as root (useful to reset forgotten Linux password!)"
          ]
        ],
        "tip": "wsl --shutdown frees cached RAM",
        "tags": [
          "shutdown",
          "stop",
          "root",
          "memory",
          "restart",
          "vm"
        ]
      }
    ]
  },
  {
    "id": "wsl-card-3",
    "badge": "wsl",
    "title": "WSL 2 (Subsystem for Linux): WSL Distro Backup & Relocation (.tar)",
    "subtitle": "Snapshot a WSL distribution to a .tar archive or move it to another drive (e.g. D:\\)",
    "commands": [
      {
        "id": "wsl-export-import-move",
        "mode": "WSL 2",
        "modeClass": "mode-v",
        "desc": "Snapshot a WSL distribution to a .tar archive or move it to another drive (e.g. D:\\)",
        "cmd": "wsl --export Ubuntu D:\\backups\\ubuntu.tar   |   wsl --import UbuntuDev D:\\WSL\\UbuntuDev D:\\backups\\ubuntu.tar",
        "flags": [
          [
            "--export",
            "Create full tar image backup of distribution rootfs"
          ],
          [
            "--import <Name> <InstallDir> <Tar>",
            "Create new distro instance at custom disk path from tar"
          ],
          [
            "--unregister <Distro>",
            "Permanently delete distro and its virtual disk (ext4.vhdx)"
          ]
        ],
        "tags": [
          "backup",
          "export",
          "import",
          "move",
          "drive",
          "vhdx"
        ]
      }
    ]
  },
  {
    "id": "wsl-card-4",
    "badge": "wsl",
    "title": "WSL 2 (Subsystem for Linux): Windows-Linux Interoperability & File Sharing",
    "subtitle": "Call Windows executables from Linux bash or access Linux files from File Explorer",
    "commands": [
      {
        "id": "wsl-windows-interop",
        "mode": "WSL ↔ WIN",
        "modeClass": "mode-v",
        "desc": "Call Windows executables from Linux bash or access Linux files from File Explorer",
        "cmd": "explorer.exe .   |   cat ~/.ssh/id_ed25519.pub | clip.exe   |   pwsh.exe -c 'Get-Date'",
        "flags": [
          [
            "explorer.exe .",
            "Run inside WSL bash to open current Linux directory in Windows File Explorer"
          ],
          [
            "clip.exe",
            "Pipe Linux command output straight into the Windows clipboard"
          ],
          [
            "wslpath -w $(pwd)",
            "Convert Linux path (/mnt/c/...) to Windows path (C:\\...)"
          ]
        ],
        "tip": "Works directly inside WSL bash!",
        "tags": [
          "interop",
          "explorer",
          "clip",
          "wslpath",
          "bridge"
        ]
      }
    ]
  },
  {
    "id": "wsl-pro-tips",
    "badge": "tip",
    "title": "WSL 2 (Subsystem for Linux): Pro Tips & Best Practices",
    "subtitle": "Reclaim RAM instantly with VM shutdown & Windows-Linux filesystem interop",
    "commands": [
      {
        "id": "wsl-tips-card",
        "desc": "Reclaim RAM instantly with VM shutdown & Windows-Linux filesystem interop",
        "cmd": "wsl --shutdown   |   explorer.exe \\\\wsl$\\Ubuntu\\   |   wsl --export Ubuntu D:\\backup.tar",
        "details": "WSL 2 runs a lightweight Hyper-V VM that retains RAM caches. Running wsl --shutdown terminates the background VM and immediately releases gigabytes of RAM to Windows.",
        "flags": [
          [
            "wsl --shutdown",
            "Stops all running distributions and completely reclaims VM memory"
          ],
          [
            "\\\\wsl$\\<distro>\\",
            "Access the Linux root filesystem directly inside Windows File Explorer"
          ],
          [
            "wsl -u root",
            "Log into default distribution as root user to fix broken sudoers or permissions"
          ],
          [
            "wsl --export <distro> <file.tar>",
            "Create full portable backup snapshot of your Linux environment"
          ]
        ],
        "tip": "You can run Windows commands from inside Linux bash (e.g. clip.exe < file.txt)!",
        "tags": [
          "wsl",
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("win-wsl_bookmarks") || "[]"))
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
  const allCards = WIN_WIN_WSL_DATA;
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

  for (const card of WIN_WIN_WSL_DATA) {
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
        '    <pre class="cmd-code"><code>' + highlightPsCmd(cmd.cmd) + '</code></pre>',
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
        localStorage.setItem("win-wsl_bookmarks", JSON.stringify([...state.bookmarks]));
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
