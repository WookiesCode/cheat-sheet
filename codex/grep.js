// grep.js
// Standalone interactive cheat sheet for grep — Pattern, Regex & Log Search
const GREP_DATA = [
  {
    "id": "grep-card-1",
    "badge": "grp",
    "title": "grep: Logs or directories recursively with Extended Re",
    "subtitle": "Search logs or directories recursively with Extended Regex, line numbers, binary skip & surrounding context",
    "commands": [
      {
        "id": "grep-recursive-context",
        "desc": "Search logs or directories recursively with Extended Regex, line numbers, binary skip & surrounding context",
        "cmd": "grep -rnIE -C 3 --color=auto 'ERROR|CRITICAL|FATAL|panic|MCE|AER' /var/log/",
        "details": "The primary data center log triage command. '-r' walks directories recursively, '-n' prints 1-based line numbers, '-I' skips binary files so they don't corrupt your terminal, '-E' enables Extended Regex alternation '|', and '-C 3' prints 3 lines before and after every match.",
        "flags": [
          [
            "-r / -R",
            "Recursive directory search (-R follows all symlinks; -r follows only command-line symlinks)"
          ],
          [
            "-n",
            "Prefix each matching output line with its 1-based line number within the file"
          ],
          [
            "-I",
            "Process binary files as if they do not match (prevents terminal garbage)"
          ],
          [
            "-E",
            "Extended Regular Expressions (enables |, +, ?, (), {m,n} without backslashes)"
          ],
          [
            "-C 3",
            "Print 3 lines of leading (-B 3) and trailing (-A 3) context around each match"
          ],
          [
            "-i",
            "Case-insensitive matching"
          ]
        ],
        "subcommands": [
          [
            "grep -rnI -B 2 -A 5 'Out of memory' /var/log/",
            "Show 2 lines before (-B 2) and 5 lines after (-A 5) an OOM-killer trigger"
          ],
          [
            "grep -rnI --include='*.conf' --include='*.yaml' 'timeout' /etc/",
            "Search only files matching specific filename globs (--include) inside /etc/"
          ],
          [
            "grep -rnI --exclude-dir={.git,node_modules,venv,proc,sys} 'listen' /",
            "Exclude specific directories (--exclude-dir) when searching large trees"
          ]
        ],
        "tip": "Always include -I to skip binaries",
        "tags": [
          "grep",
          "search",
          "logs",
          "context",
          "recursive",
          "regex",
          "errors"
        ]
      }
    ]
  },
  {
    "id": "grep-card-2",
    "badge": "grp",
    "title": "grep: Match (-v) to strip comments and blank lines fro",
    "subtitle": "Invert match (-v) to strip comments and blank lines from config files or filter out noisy log lines",
    "commands": [
      {
        "id": "grep-invert-clean-configs",
        "desc": "Invert match (-v) to strip comments and blank lines from config files or filter out noisy log lines",
        "cmd": "grep -Ev '^\\s*(#|$|;)' /etc/ssh/sshd_config",
        "details": "Config files in /etc often have hundreds of '#' or ';' comments and blank lines. 'grep -Ev' inverts the match (-v), printing only active configuration directives.",
        "flags": [
          [
            "-v",
            "Invert match: select only non-matching lines"
          ],
          [
            "^\\s*(#|$|;)",
            "Matches lines starting with optional whitespace followed by #, ;, or empty line"
          ],
          [
            "-e <pat>",
            "Specify multiple independent patterns (e.g. grep -v -e 'CRON' -e 'keepalive')"
          ]
        ],
        "subcommands": [
          [
            "grep -v -e 'CRON' -e 'systemd-logind' /var/log/syslog | tail -n 50",
            "Filter out repetitive cron and session noise when inspecting /var/log/syslog"
          ],
          [
            "grep -Fxv -f known_good_hosts.txt all_rack_hosts.txt",
            "Compare two plain lists and print lines in all_rack_hosts.txt that are missing from known_good_hosts.txt"
          ]
        ],
        "tip": "Instant active-config view",
        "tags": [
          "grep",
          "invert",
          "comments",
          "config",
          "diff",
          "filter"
        ]
      }
    ]
  },
  {
    "id": "grep-card-3",
    "badge": "grp",
    "title": "grep: Only the matched token (-o) using Perl-Compatibl",
    "subtitle": "Extract only the matched token (-o) using Perl-Compatible Regex (-P) lookarounds and \\K match reset",
    "commands": [
      {
        "id": "grep-pcre-extract",
        "desc": "Extract only the matched token (-o) using Perl-Compatible Regex (-P) lookarounds and \\K match reset",
        "cmd": "grep -Po '([0-9]{1,3}\\.){3}[0-9]{1,3}' /var/log/auth.log | sort | uniq -c | sort -nr | head",
        "details": "Adding '-o' (--only-matching) prints ONLY the matched substring on its own line. Combining '-P' (PCRE) with '\\K' (keep only what follows '\\K') lets you extract values from 'key=value' log lines without sed or awk.",
        "flags": [
          [
            "-P",
            "Perl-Compatible Regular Expression (supports \\d, \\s, \\w, \\K, (?=...))"
          ],
          [
            "-o",
            "Print only the matched parts of a matching line, each on a separate line"
          ],
          [
            "\\K",
            "PCRE operator: discard everything matched to the left of \\K from the final -o output"
          ]
        ],
        "subcommands": [
          [
            "grep -Po 'user=\\K[^ ]+' /var/log/auth.log | sort | uniq -c | sort -nr",
            "Extract only the value after 'user=' using \\K without printing 'user=' itself"
          ],
          [
            "grep -Eio '([0-9a-f]{2}:){5}[0-9a-f]{2}' /var/log/syslog | sort -u",
            "Extract all unique MAC addresses (XX:XX:XX:XX:XX:XX) from a log file"
          ],
          [
            "grep -Po '[0-9a-f]{4}:[0-9a-f]{2}:[0-9a-f]{2}\\.[0-7]' /var/log/kern.log | sort -u",
            "Extract all unique PCIe BDF addresses (0000:3b:00.0) mentioned in kernel error logs"
          ]
        ],
        "tip": "grep -Po 'key=\\K\\S+' extracts values cleanly",
        "tags": [
          "grep",
          "pcre",
          "extract",
          "ip",
          "mac",
          "bdf",
          "only-matching"
        ]
      }
    ]
  },
  {
    "id": "grep-card-4",
    "badge": "grp",
    "title": "grep: Matching filenames (-l / -L), count matches (-c)",
    "subtitle": "List matching filenames (-l / -L), count matches (-c), match whole words (-w), read sysfs (-H '') & zgrep",
    "commands": [
      {
        "id": "grep-files-counts-flags",
        "desc": "List matching filenames (-l / -L), count matches (-c), match whole words (-w), read sysfs (-H '') & zgrep",
        "cmd": "grep -H '' /sys/class/net/*/operstate /sys/class/net/*/speed 2>/dev/null",
        "details": "'grep -H \"\" /sys/...' is a classic sysadmin trick: since empty pattern '' matches every line and '-H' forces printing the filename prefix, it prints 'filepath:value' for dozens of sysfs pseudo-files in one shot.",
        "flags": [
          [
            "-w / -x",
            "Match whole words only (-w) or whole lines only (-x)"
          ],
          [
            "-F",
            "Fixed literal string search (disables regex metacharacters; fastest mode)"
          ],
          [
            "-l / -L",
            "Print only filenames WITH matches (-l) or filenames WITHOUT any matches (-L)"
          ],
          [
            "-c",
            "Print count of matching lines per file"
          ],
          [
            "-H / -h",
            "Always print filename prefix (-H) or suppress filename prefix (-h)"
          ]
        ],
        "subcommands": [
          [
            "grep -rnw '/dev/sd' /etc/fstab /etc/mdadm/",
            "Whole-word search (-w) so '/dev/sda' does not accidentally match '/dev/sda1'"
          ],
          [
            "zgrep -iE 'mce|edac|nvme|xid' /var/log/kern.log* /var/log/syslog*",
            "Search across both plain-text and gzip-compressed (.gz) rotated log files transparently"
          ]
        ],
        "tip": "grep -H '' /sys/... reads many sysfs files with filenames!",
        "tags": [
          "grep",
          "zgrep",
          "fgrep",
          "sysfs",
          "count",
          "filenames",
          "word"
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("grep_bookmarks") || "[]"))
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
  const totalCommands = GREP_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of GREP_DATA) {
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

  for (const section of GREP_DATA) {
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
        localStorage.setItem("grep_bookmarks", JSON.stringify([...state.bookmarks]));
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
