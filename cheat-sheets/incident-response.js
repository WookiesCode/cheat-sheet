// incident-response.js
// Standalone interactive cheat sheet for SRE toolkit: Incident Response: Roles, the First 15 Minutes, and the Postmortem
const SRE_INCIDENT_RESPONSE_DATA = [
  {
    "id": "incident-cmd-1",
    "badge": "incident",
    "title": "Incident response: Roles",
    "subtitle": "Roles (Google SRE incident management)",
    "commands": [
      {
        "id": "ir-roles",
        "desc": "Roles (Google SRE incident management)",
        "cmd": "printf '%s\\n' 'IC: <name>' 'Ops lead: <name>' 'Comms lead: <name>' 'Started (UTC): '\"$(date -u +%FT%TZ)\"",
        "details": "",
        "flags": [
          [
            "Incident Commander (IC)",
            "Coordinates, delegates, decides. Holds every role nobody else has"
          ],
          [
            "Operations lead (OL)",
            "The only one changing systems"
          ],
          [
            "Communications lead (CL)",
            "Regular updates to stakeholders; fields questions"
          ]
        ],
        "tip": "One person changes production at a time: the Ops lead",
        "tags": [
          "sre",
          "devops",
          "incident",
          "incident",
          "roles",
          "ic",
          "comms",
          "sre"
        ]
      }
    ]
  },
  {
    "id": "incident-flags-1",
    "badge": "incident",
    "title": "Incident response: More options",
    "subtitle": "More options for: Roles",
    "commands": [
      {
        "id": "ir-roles-flags-card",
        "desc": "More options and gotchas for: Roles",
        "cmd": "printf '%s\\n' 'IC: <name>' 'Ops lead: <name>' 'Comms lead: <name>' 'Started (UTC): '\"$(date -u +%FT%TZ)\"",
        "hideCode": false,
        "flags": [
          [
            "Handoff",
            "Explicit: \"You're now IC, okay?\", and wait for the yes"
          ],
          [
            "Declare early",
            "Declaring and standing down costs less than a late incident"
          ]
        ],
        "tags": [
          "sre",
          "devops",
          "incident",
          "flags",
          "options",
          "incident",
          "roles",
          "ic"
        ]
      }
    ]
  },
  {
    "id": "incident-cmd-2",
    "badge": "incident",
    "title": "Incident response: First 15 minutes on a node",
    "subtitle": "First 15 minutes on a node: facts, in UTC",
    "commands": [
      {
        "id": "ir-first15",
        "desc": "First 15 minutes on a node: facts, in UTC",
        "cmd": "date -u; uptime; journalctl -p err -b --since '-1h' --no-pager | tail -n 50",
        "details": "",
        "flags": [
          [
            "date -u",
            "Every timeline entry in UTC"
          ],
          [
            "uptime",
            "Recent reboot? Load?"
          ],
          [
            "journalctl -p err -b",
            "Errors since boot"
          ]
        ],
        "tip": "Mitigate first (drain, fail over), find the root cause after",
        "tags": [
          "sre",
          "devops",
          "incident",
          "triage",
          "timeline",
          "utc",
          "journalctl",
          "dmesg"
        ]
      }
    ]
  },
  {
    "id": "incident-flags-2",
    "badge": "incident",
    "title": "Incident response: More options",
    "subtitle": "More options for: First 15 minutes on a node: facts, in UTC",
    "commands": [
      {
        "id": "ir-first15-flags-card",
        "desc": "More options and gotchas for: First 15 minutes on a node: facts, in UTC",
        "cmd": "date -u; uptime; journalctl -p err -b --since '-1h' --no-pager | tail -n 50",
        "hideCode": false,
        "flags": [
          [
            "dmesg -T --level=err,crit",
            "Kernel errors (Xid, MCE, link down)"
          ],
          [
            "Scheduler",
            "Is it already drained? sinfo -R / kubectl get node"
          ]
        ],
        "tags": [
          "sre",
          "devops",
          "incident",
          "flags",
          "options",
          "triage",
          "timeline",
          "utc"
        ]
      }
    ]
  },
  {
    "id": "incident-recipes-2",
    "badge": "incident",
    "title": "Incident response: Related commands",
    "subtitle": "Related commands for: First 15 minutes on a node: facts, in UTC",
    "commands": [
      {
        "id": "ir-first15-sub-1",
        "desc": "Kernel errors",
        "cmd": "sudo dmesg -T --level=err,crit | tail -n 40",
        "tags": [
          "sre",
          "devops",
          "incident",
          "recipe",
          "triage",
          "timeline",
          "utc"
        ]
      },
      {
        "id": "ir-first15-sub-2",
        "desc": "Drained nodes and their reasons",
        "cmd": "sinfo -R",
        "tags": [
          "sre",
          "devops",
          "incident",
          "recipe",
          "triage",
          "timeline",
          "utc"
        ]
      },
      {
        "id": "ir-first15-sub-3",
        "desc": "What is firing",
        "cmd": "amtool alert query --alertmanager.url=http://localhost:9093",
        "tags": [
          "sre",
          "devops",
          "incident",
          "recipe",
          "triage",
          "timeline",
          "utc"
        ]
      }
    ]
  },
  {
    "id": "incident-cmd-3",
    "badge": "incident",
    "title": "Incident response: Keep a timeline as you go",
    "subtitle": "Keep a timeline as you go",
    "commands": [
      {
        "id": "ir-timeline",
        "desc": "Keep a timeline as you go",
        "cmd": "echo \"$(date -u +%FT%TZ) <what you saw or did>\" >> cases/<ticket>/timeline.md",
        "details": "",
        "flags": [
          [
            "One line per fact or action",
            "Time, who, what, result"
          ],
          [
            "Commands too",
            "The command and its key output, with secrets removed"
          ],
          [
            "Field notes",
            "The home page's Field notes log entries per server, in Markdown"
          ]
        ],
        "tip": "Replace the placeholders before you run it",
        "tags": [
          "sre",
          "devops",
          "incident",
          "timeline",
          "notes",
          "case",
          "postmortem"
        ]
      }
    ]
  },
  {
    "id": "incident-flags-3",
    "badge": "incident",
    "title": "Incident response: More options",
    "subtitle": "More options for: Keep a timeline as you go",
    "commands": [
      {
        "id": "ir-timeline-flags-card",
        "desc": "More options and gotchas for: Keep a timeline as you go",
        "cmd": "echo \"$(date -u +%FT%TZ) <what you saw or did>\" >> cases/<ticket>/timeline.md",
        "hideCode": false,
        "flags": [
          [
            "Feeds the postmortem",
            "A good timeline writes half the postmortem"
          ]
        ],
        "tags": [
          "sre",
          "devops",
          "incident",
          "flags",
          "options",
          "timeline",
          "notes",
          "case"
        ]
      }
    ]
  },
  {
    "id": "incident-cmd-4",
    "badge": "incident",
    "title": "Incident response: Blameless postmortem outline",
    "subtitle": "Blameless postmortem outline",
    "commands": [
      {
        "id": "ir-postmortem",
        "desc": "Blameless postmortem outline",
        "cmd": "## Summary\n## Impact (who, how long)\n## Timeline (UTC)\n## Root cause and trigger\n## What went well / what didn't\n## Action items (owner, due date)",
        "details": "",
        "flags": [
          [
            "Blameless",
            "About systems and decisions, not people"
          ],
          [
            "Impact",
            "Users, jobs, GPUs and hours affected"
          ],
          [
            "Root cause vs trigger",
            "Why it was possible vs what set it off"
          ]
        ],
        "tip": "Action items without owners don't get done",
        "tags": [
          "sre",
          "devops",
          "incident",
          "postmortem",
          "blameless",
          "rca",
          "actions"
        ]
      }
    ]
  },
  {
    "id": "incident-flags-4",
    "badge": "incident",
    "title": "Incident response: More options",
    "subtitle": "More options for: Blameless postmortem outline",
    "commands": [
      {
        "id": "ir-postmortem-flags-card",
        "desc": "More options and gotchas for: Blameless postmortem outline",
        "cmd": "## Summary\n## Impact (who, how long)\n## Timeline (UTC)\n## Root cause and trigger\n## What went well / what didn't\n## Action items (owner, due date)",
        "hideCode": true,
        "flags": [
          [
            "Action items",
            "Each with one owner and a date"
          ]
        ],
        "tags": [
          "sre",
          "devops",
          "incident",
          "flags",
          "options",
          "postmortem",
          "blameless",
          "rca"
        ]
      }
    ]
  },
  {
    "id": "incident-pro-tips",
    "badge": "tip",
    "title": "Incident response: Pro Tip",
    "subtitle": "Silence alerts for a node under maintenance",
    "commands": [
      {
        "id": "incident-tips-card",
        "desc": "Silence alerts for a node under maintenance",
        "cmd": "amtool silence add instance=~\"node07.*\" --alertmanager.url=http://localhost:9093",
        "details": "Silence by the node (instance matcher), not by alert name, so other nodes still page. Check amtool silence add --help for the comment and duration flags in your version, and expire the silence when the node is back.",
        "flags": [
          [
            "silence query",
            "List silences"
          ],
          [
            "silence expire <id>",
            "End it"
          ]
        ],
        "tip": "Put the ticket number in the silence comment",
        "tags": [
          "sre",
          "devops",
          "incident",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("incident-response_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = SRE_INCIDENT_RESPONSE_DATA;
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

  for (const card of SRE_INCIDENT_RESPONSE_DATA) {
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
        localStorage.setItem("incident-response_bookmarks", JSON.stringify([...state.bookmarks]));
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
