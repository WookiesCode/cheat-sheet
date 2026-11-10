// argocd.js
// Standalone interactive cheat sheet for SRE toolkit: Argo CD: GitOps Status, Diff, Sync and Rollback
const SRE_ARGOCD_DATA = [
  {
    "id": "argocd-cmd-1",
    "badge": "argocd",
    "title": "Argo CD: Log in with SSO",
    "subtitle": "Log in with SSO",
    "commands": [
      {
        "id": "argocd-login",
        "desc": "Log in with SSO",
        "cmd": "argocd login argocd.example.com --sso --grpc-web",
        "details": "",
        "flags": [
          [
            "--sso",
            "Browser-based SSO login"
          ],
          [
            "--grpc-web",
            "For proxies or load balancers without HTTP/2"
          ],
          [
            "--core",
            "Talk to Kubernetes directly, no API server login"
          ],
          [
            "--username / --password",
            "Local accounts; avoid typing the password inline"
          ]
        ],
        "tip": "SSO keeps passwords off the jumpbox",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "argocd",
          "login",
          "sso"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_login/",
              "title": "argocd login"
            }
          ],
          "note": "The flags exist separately in the docs; --sso and --core aren't shown together."
        }
      }
    ]
  },
  {
    "id": "argocd-cmd-2",
    "badge": "argocd",
    "title": "Argo CD: What is out of sync, and what differs",
    "subtitle": "What is out of sync, and what differs",
    "commands": [
      {
        "id": "argocd-status",
        "desc": "What is out of sync, and what differs",
        "cmd": "argocd app list",
        "details": "",
        "flags": [
          [
            "app list",
            "Sync and health status of every application"
          ],
          [
            "app get <app>",
            "Resources, sync status and conditions"
          ],
          [
            "app diff <app>",
            "Git (target) vs live state"
          ],
          [
            "app history <app>",
            "Deployed revisions with IDs"
          ]
        ],
        "tip": "OutOfSync + Healthy is drift; Degraded is broken",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "status",
          "diff",
          "history",
          "drift"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_list/",
              "title": "argocd app list"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_diff/",
              "title": "argocd app diff"
            }
          ]
        }
      },
      {
        "id": "argocd-status-sub-1",
        "desc": "One application in detail",
        "cmd": "argocd app get dcgm-exporter",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "status",
          "diff",
          "history"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_list/",
              "title": "argocd app list"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_diff/",
              "title": "argocd app diff"
            }
          ]
        }
      },
      {
        "id": "argocd-status-sub-2",
        "desc": "What would change on sync",
        "cmd": "argocd app diff dcgm-exporter",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "status",
          "diff",
          "history"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_list/",
              "title": "argocd app list"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_diff/",
              "title": "argocd app diff"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "argocd-cmd-3",
    "badge": "argocd",
    "title": "Argo CD: Preview, then sync",
    "subtitle": "Preview, then sync",
    "commands": [
      {
        "id": "argocd-sync",
        "desc": "Preview, then sync",
        "cmd": "argocd app sync dcgm-exporter --dry-run",
        "details": "",
        "flags": [
          [
            "--dry-run",
            "Preview the apply without changing the cluster"
          ],
          [
            "(no flag)",
            "Sync for real (changes state)"
          ],
          [
            "--prune",
            "Also delete resources no longer in Git (changes state)"
          ],
          [
            "--resource <group:kind:name>",
            "Sync one resource"
          ],
          [
            "app wait --health --timeout <s>",
            "Block until healthy (seconds)"
          ]
        ],
        "tip": "--prune deletes things: read the diff first",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "sync",
          "dry-run",
          "prune",
          "wait"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_sync/",
              "title": "argocd app sync"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_wait/",
              "title": "argocd app wait"
            }
          ]
        }
      },
      {
        "id": "argocd-sync-sub-1",
        "desc": "Real sync (changes state)",
        "cmd": "argocd app sync dcgm-exporter",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "sync",
          "dry-run",
          "prune"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_sync/",
              "title": "argocd app sync"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_wait/",
              "title": "argocd app wait"
            }
          ]
        }
      },
      {
        "id": "argocd-sync-sub-2",
        "desc": "Wait up to 5 minutes for health",
        "cmd": "argocd app wait dcgm-exporter --health --timeout 300",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "sync",
          "dry-run",
          "prune"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_sync/",
              "title": "argocd app sync"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_wait/",
              "title": "argocd app wait"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "argocd-cmd-4",
    "badge": "argocd",
    "title": "Argo CD: Roll back, and the auto-sync gotcha",
    "subtitle": "Roll back, and the auto-sync gotcha",
    "commands": [
      {
        "id": "argocd-rollback",
        "desc": "Roll back, and the auto-sync gotcha",
        "cmd": "argocd app history dcgm-exporter",
        "details": "",
        "flags": [
          [
            "app rollback <app> [ID]",
            "Back to a history ID, or the previous one (changes state)"
          ],
          [
            "Auto-sync blocks rollback",
            "Rollback can't run while automated sync is on"
          ],
          [
            "app set --sync-policy manual",
            "Turn auto-sync off first (changes state)"
          ],
          [
            "Real fix",
            "Revert the commit in Git; that is the GitOps rollback"
          ]
        ],
        "tip": "Revert in Git when you can; CLI rollback is for emergencies",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "rollback",
          "auto-sync",
          "gitops",
          "revert"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_rollback/",
              "title": "argocd app rollback"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_set/",
              "title": "argocd app set"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/",
              "title": "Argo CD: automated sync policy"
            }
          ]
        }
      },
      {
        "id": "argocd-rollback-sub-1",
        "desc": "Pause auto-sync (changes state)",
        "cmd": "argocd app set dcgm-exporter --sync-policy manual",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "rollback",
          "auto-sync",
          "gitops"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_rollback/",
              "title": "argocd app rollback"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_set/",
              "title": "argocd app set"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/",
              "title": "Argo CD: automated sync policy"
            }
          ]
        }
      },
      {
        "id": "argocd-rollback-sub-2",
        "desc": "Previous revision (changes state)",
        "cmd": "argocd app rollback dcgm-exporter",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "rollback",
          "auto-sync",
          "gitops"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_rollback/",
              "title": "argocd app rollback"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_set/",
              "title": "argocd app set"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/",
              "title": "Argo CD: automated sync policy"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "argocd-pro-tips",
    "badge": "tip",
    "title": "Argo CD: Pro Tip",
    "subtitle": "Automated sync with prune and self-heal",
    "commands": [
      {
        "id": "argocd-tips-card",
        "desc": "Automated sync with prune and self-heal",
        "cmd": "spec:\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true",
        "details": "automated: {} alone syncs on Git changes but never deletes; prune: true deletes resources removed from Git; selfHeal: true reverts manual changes in the cluster. The same from the CLI: argocd app set <app> --sync-policy automated --auto-prune --self-heal.",
        "flags": [
          [
            "prune",
            "Off by default"
          ],
          [
            "selfHeal",
            "Undo kubectl edits"
          ]
        ],
        "tip": "With selfHeal on, a hotfix made with kubectl is undone: change Git instead",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/",
              "title": "Argo CD: automated sync policy"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("argocd_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = SRE_ARGOCD_DATA;
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

  for (const card of SRE_ARGOCD_DATA) {
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
        localStorage.setItem("argocd_bookmarks", JSON.stringify([...state.bookmarks]));
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
