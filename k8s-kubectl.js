// k8s-kubectl.js
// Standalone interactive cheat sheet for Containers: kubectl Basics: contexts, get, describe & output formats
const CTR_K8S_KUBECTL_DATA = [
  {
    "id": "k8s-kubectl-cmd-1",
    "badge": "ctx",
    "title": "kubectl Basics & Contexts: Show which cluster and namespace kubectl is pointed at",
    "subtitle": "Show which cluster and namespace kubectl is pointed at",
    "commands": [
      {
        "id": "kubectl-contexts",
        "desc": "Show which cluster and namespace kubectl is pointed at",
        "cmd": "kubectl config get-contexts",
        "details": "",
        "flags": [
          [
            "* in the CURRENT column",
            "The context every kubectl command will use: check it before anything that changes state"
          ],
          [
            "context",
            "A named combination of cluster + user + default namespace, stored in ~/.kube/config"
          ],
          [
            "KUBECONFIG=<file>",
            "Point one command (or shell) at a different kubeconfig file"
          ]
        ],
        "tip": "Check the context before every change",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "context",
          "kubeconfig",
          "cluster",
          "namespace"
        ]
      },
      {
        "id": "kubectl-contexts-sub-1",
        "desc": "Just the active context name",
        "cmd": "kubectl config current-context",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "context",
          "kubeconfig",
          "cluster"
        ]
      },
      {
        "id": "kubectl-contexts-sub-2",
        "desc": "Switch clusters for every later command (changes local state)",
        "cmd": "kubectl config use-context <context>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "context",
          "kubeconfig",
          "cluster"
        ]
      },
      {
        "id": "kubectl-contexts-sub-3",
        "desc": "Change the default namespace of the current context (changes local state)",
        "cmd": "kubectl config set-context --current --namespace=<ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "context",
          "kubeconfig",
          "cluster"
        ]
      }
    ]
  },
  {
    "id": "k8s-kubectl-cmd-2",
    "badge": "ctx",
    "title": "kubectl Basics & Contexts: List pods in every namespace with their node and IP",
    "subtitle": "List pods in every namespace with their node and IP",
    "commands": [
      {
        "id": "kubectl-get-wide",
        "desc": "List pods in every namespace with their node and IP",
        "cmd": "kubectl get pods -A -o wide",
        "details": "",
        "flags": [
          [
            "-A / --all-namespaces",
            "Every namespace; without it you only see your context's default namespace"
          ],
          [
            "-n <ns>",
            "One namespace"
          ],
          [
            "-o wide",
            "Adds NODE and IP columns: which server is the pod on?"
          ],
          [
            "READY 1/2",
            "One of two containers in the pod isn't ready"
          ],
          [
            "RESTARTS",
            "A climbing number means a crash loop"
          ],
          [
            "-l app=<label>",
            "Filter by label"
          ]
        ],
        "tip": "-o wide shows the node",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "get",
          "pods",
          "wide",
          "namespace",
          "list"
        ]
      },
      {
        "id": "kubectl-get-wide-sub-1",
        "desc": "Pods, services, deployments and replica sets in one namespace (not literally all kinds)",
        "cmd": "kubectl get all -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "get",
          "pods",
          "wide"
        ]
      },
      {
        "id": "kubectl-get-wide-sub-2",
        "desc": "Everything that isn't Running",
        "cmd": "kubectl get pods -A --field-selector=status.phase!=Running",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "get",
          "pods",
          "wide"
        ]
      }
    ]
  },
  {
    "id": "k8s-kubectl-cmd-3",
    "badge": "ctx",
    "title": "kubectl Basics & Contexts: Print exactly the fields you need with jsonpath or custom columns",
    "subtitle": "Print exactly the fields you need with jsonpath or custom columns",
    "commands": [
      {
        "id": "kubectl-output-formats",
        "desc": "Print exactly the fields you need with jsonpath or custom columns",
        "cmd": "kubectl get pods -n <ns> -o custom-columns=NAME:.metadata.name,NODE:.spec.nodeName,PHASE:.status.phase",
        "details": "",
        "flags": [
          [
            "-o yaml",
            "The whole object as YAML: the source of truth for every field"
          ],
          [
            "-o jsonpath='{.items[*].metadata.name}'",
            "One field from every item, space-separated"
          ],
          [
            "-o custom-columns=HEADER:.path,...",
            "Your own table; paths are the same as in -o yaml"
          ],
          [
            "--sort-by=.metadata.creationTimestamp",
            "Sort rows by any field"
          ]
        ],
        "tip": "Find the path in -o yaml, then use it in jsonpath",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "output",
          "jsonpath",
          "custom-columns",
          "yaml",
          "jq",
          "sort"
        ]
      },
      {
        "id": "kubectl-output-formats-sub-1",
        "desc": "Full pod definition and status",
        "cmd": "kubectl get pod <pod> -n <ns> -o yaml",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "output",
          "jsonpath",
          "custom-columns"
        ]
      },
      {
        "id": "kubectl-output-formats-sub-2",
        "desc": "Name and phase, one pod per line",
        "cmd": "kubectl get pods -n <ns> -o jsonpath='{range .items[*]}{.metadata.name}{\"\\t\"}{.status.phase}{\"\\n\"}{end}'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "output",
          "jsonpath",
          "custom-columns"
        ]
      },
      {
        "id": "kubectl-output-formats-sub-3",
        "desc": "Same idea with jq, which is easier to read for complex filters",
        "cmd": "kubectl get pods -n <ns> -o json | jq -r '.items[] | select(.status.phase != \"Running\") | .metadata.name'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "output",
          "jsonpath",
          "custom-columns"
        ]
      }
    ]
  },
  {
    "id": "k8s-kubectl-cmd-4",
    "badge": "ctx",
    "title": "kubectl Basics & Contexts: Look up what a field means without leaving the terminal",
    "subtitle": "Look up what a field means without leaving the terminal",
    "commands": [
      {
        "id": "kubectl-explain",
        "desc": "Look up what a field means without leaving the terminal",
        "cmd": "kubectl explain pod.spec.containers.resources",
        "details": "",
        "flags": [
          [
            "kubectl explain <kind>.<path>",
            "Docs for that field, straight from the cluster's own API (so it matches your version)"
          ],
          [
            "--recursive",
            "Show the whole tree of sub-fields"
          ],
          [
            "kubectl api-resources",
            "Every resource kind, its short name (po, deploy, svc) and whether it's namespaced"
          ]
        ],
        "tip": "kubectl explain matches your cluster's version",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "explain",
          "api-resources",
          "version",
          "docs",
          "auth"
        ]
      },
      {
        "id": "kubectl-explain-sub-1",
        "desc": "All kinds the cluster knows, with short names",
        "cmd": "kubectl api-resources",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "explain",
          "api-resources",
          "version"
        ]
      },
      {
        "id": "kubectl-explain-sub-2",
        "desc": "Client and server versions; kubectl should be within one minor version of the server",
        "cmd": "kubectl version",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "explain",
          "api-resources",
          "version"
        ]
      },
      {
        "id": "kubectl-explain-sub-3",
        "desc": "What you're allowed to do in a namespace",
        "cmd": "kubectl auth can-i --list -n <ns>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "explain",
          "api-resources",
          "version"
        ]
      }
    ]
  },
  {
    "id": "k8s-kubectl-pro-tips",
    "badge": "tip",
    "title": "kubectl Basics & Contexts: Pro Tip",
    "subtitle": "Make the active context impossible to miss",
    "commands": [
      {
        "id": "k8s-kubectl-tips-card",
        "desc": "Make the active context impossible to miss",
        "cmd": "kubectl config current-context",
        "details": "Most Kubernetes accidents are the right command against the wrong cluster. Put the current context in your shell prompt, or run kubectl config current-context before any apply, delete, drain or scale. Separate kubeconfig files per cluster (KUBECONFIG=...) make it harder still to cross wires.",
        "flags": [
          [
            "kubectl config current-context",
            "Run it before every change"
          ],
          [
            "KUBECONFIG=~/.kube/<cluster>.yaml",
            "One file per cluster"
          ],
          [
            "kubectl --context <ctx> ...",
            "Name the cluster explicitly on a single command"
          ]
        ],
        "tip": "Right command, wrong cluster is the classic mistake",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("k8s-kubectl_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = CTR_K8S_KUBECTL_DATA;
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

  for (const card of CTR_K8S_KUBECTL_DATA) {
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
        localStorage.setItem("k8s-kubectl_bookmarks", JSON.stringify([...state.bookmarks]));
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
