// k8s-nodes.js
// Standalone interactive cheat sheet for Containers: Nodes: health, cordon & drain, taints, kubelet and crictl
const CTR_K8S_NODES_DATA = [
  {
    "id": "k8s-nodes-cmd-1",
    "badge": "node",
    "title": "Kubernetes Nodes & Maintenance: List nodes with status, version, OS and container runtime",
    "subtitle": "List nodes with status, version, OS and container runtime",
    "commands": [
      {
        "id": "kubectl-nodes-wide",
        "desc": "List nodes with status, version, OS and container runtime",
        "cmd": "kubectl get nodes -o wide",
        "details": "",
        "flags": [
          [
            "STATUS Ready",
            "kubelet is reporting healthy; NotReady means kubelet stopped reporting (crashed, network, or server down)"
          ],
          [
            "SchedulingDisabled",
            "The node is cordoned: existing pods stay, no new ones arrive"
          ],
          [
            "VERSION",
            "kubelet version"
          ],
          [
            "CONTAINER-RUNTIME",
            "Usually containerd://<version>"
          ]
        ],
        "tip": "NotReady = kubelet stopped reporting",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "nodes",
          "ready",
          "notready",
          "describe",
          "wide"
        ]
      },
      {
        "id": "kubectl-nodes-wide-sub-1",
        "desc": "Conditions, capacity, allocated resources, taints and recent events",
        "cmd": "kubectl describe node <node>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "nodes",
          "ready",
          "notready"
        ]
      },
      {
        "id": "kubectl-nodes-wide-sub-2",
        "desc": "Every pod on one node, e.g. before draining it",
        "cmd": "kubectl get pods -A -o wide --field-selector spec.nodeName=<node>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "nodes",
          "ready",
          "notready"
        ]
      }
    ]
  },
  {
    "id": "k8s-nodes-cmd-2",
    "badge": "node",
    "title": "Kubernetes Nodes & Maintenance: Take a node out of service for hardware work",
    "subtitle": "Take a node out of service for hardware work: cordon, then drain (changes state: ask first)",
    "commands": [
      {
        "id": "kubectl-cordon-drain",
        "desc": "Take a node out of service for hardware work: cordon, then drain (changes state: ask first)",
        "cmd": "kubectl drain <node> --ignore-daemonsets --delete-emptydir-data --timeout=10m",
        "details": "",
        "flags": [
          [
            "kubectl cordon <node>",
            "Stop new pods landing on it; running pods stay"
          ],
          [
            "kubectl drain <node>",
            "Cordon, then evict pods so their controllers recreate them elsewhere"
          ],
          [
            "--ignore-daemonsets",
            "DaemonSet pods (CNI, GPU operator, monitoring) are meant to run everywhere and are left alone"
          ],
          [
            "--delete-emptydir-data",
            "Allow evicting pods with emptyDir volumes; that scratch data is lost"
          ],
          [
            "PodDisruptionBudget errors",
            "Drain waits rather than break an app's minimum availability; don't --force past it without the app owner"
          ],
          [
            "kubectl uncordon <node>",
            "Put the node back into service after the work"
          ]
        ],
        "tip": "Approval first; check the active context",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "drain",
          "cordon",
          "uncordon",
          "maintenance",
          "pdb",
          "rma"
        ]
      },
      {
        "id": "kubectl-cordon-drain-sub-1",
        "desc": "Mark unschedulable (changes state)",
        "cmd": "kubectl cordon <node>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "drain",
          "cordon",
          "uncordon"
        ]
      },
      {
        "id": "kubectl-cordon-drain-sub-2",
        "desc": "Return to service (changes state)",
        "cmd": "kubectl uncordon <node>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "drain",
          "cordon",
          "uncordon"
        ]
      },
      {
        "id": "kubectl-cordon-drain-sub-3",
        "desc": "true = still cordoned",
        "cmd": "kubectl get node <node> -o jsonpath='{.spec.unschedulable}'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "drain",
          "cordon",
          "uncordon"
        ]
      }
    ]
  },
  {
    "id": "k8s-nodes-cmd-3",
    "badge": "node",
    "title": "Kubernetes Nodes & Maintenance: Show a node's taints and labels",
    "subtitle": "Show a node's taints and labels",
    "commands": [
      {
        "id": "kubectl-taints-labels",
        "desc": "Show a node's taints and labels",
        "cmd": "kubectl get node <node> -o jsonpath='{.spec.taints}'",
        "details": "",
        "flags": [
          [
            "taint key=value:NoSchedule",
            "Only pods that tolerate the taint can be scheduled here (common on GPU nodes)"
          ],
          [
            "NoExecute",
            "Also evicts running pods that don't tolerate it"
          ],
          [
            "key=value:NoSchedule- (trailing dash)",
            "Removes that taint"
          ],
          [
            "--show-labels",
            "kubectl get nodes --show-labels lists every label"
          ]
        ],
        "tip": "Trailing dash removes a taint",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "taint",
          "toleration",
          "label",
          "noschedule"
        ]
      },
      {
        "id": "kubectl-taints-labels-sub-1",
        "desc": "All node labels",
        "cmd": "kubectl get nodes --show-labels",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "taint",
          "toleration",
          "label"
        ]
      },
      {
        "id": "kubectl-taints-labels-sub-2",
        "desc": "Add a taint (changes state)",
        "cmd": "kubectl taint nodes <node> <key>=<value>:NoSchedule",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "taint",
          "toleration",
          "label"
        ]
      },
      {
        "id": "kubectl-taints-labels-sub-3",
        "desc": "Add or change a label (changes state)",
        "cmd": "kubectl label node <node> <key>=<value>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "taint",
          "toleration",
          "label"
        ]
      }
    ]
  },
  {
    "id": "k8s-nodes-cmd-4",
    "badge": "node",
    "title": "Kubernetes Nodes & Maintenance: On the node itself",
    "subtitle": "On the node itself: kubelet logs and containers via crictl (works when the API is unreachable)",
    "commands": [
      {
        "id": "node-kubelet-crictl",
        "desc": "On the node itself: kubelet logs and containers via crictl (works when the API is unreachable)",
        "cmd": "journalctl -u kubelet --since '30 min ago' --no-pager",
        "details": "",
        "flags": [
          [
            "journalctl -u kubelet",
            "kubelet's own log: registration, image pulls, eviction decisions, volume mounts"
          ],
          [
            "crictl",
            "Talks to containerd directly through the CRI socket; Kubernetes no longer uses Docker (dockershim was removed in 1.24)"
          ],
          [
            "crictl ps -a",
            "Containers including exited ones, with their pod names"
          ],
          [
            "cgroup v2",
            "stat -fc %T /sys/fs/cgroup must print cgroup2fs; kubelet 1.37 refuses cgroup v1 by default"
          ]
        ],
        "tip": "API down? crictl on the node still works",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "kubelet",
          "crictl",
          "containerd",
          "journalctl",
          "cgroup",
          "node"
        ]
      },
      {
        "id": "node-kubelet-crictl-sub-1",
        "desc": "Are kubelet and containerd running",
        "cmd": "systemctl status kubelet containerd --no-pager",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ]
      },
      {
        "id": "node-kubelet-crictl-sub-2",
        "desc": "All containers on this node",
        "cmd": "sudo crictl ps -a",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ]
      },
      {
        "id": "node-kubelet-crictl-sub-3",
        "desc": "Container logs without going through the API server",
        "cmd": "sudo crictl logs --tail 100 <container-id>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ]
      },
      {
        "id": "node-kubelet-crictl-sub-4",
        "desc": "Pod sandboxes on this node",
        "cmd": "sudo crictl pods",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ]
      },
      {
        "id": "node-kubelet-crictl-sub-5",
        "desc": "cgroup2fs = cgroup v2 (required by kubelet 1.37 by default)",
        "cmd": "stat -fc %T /sys/fs/cgroup",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "kubelet",
          "crictl",
          "containerd"
        ]
      }
    ]
  },
  {
    "id": "k8s-nodes-pro-tips",
    "badge": "tip",
    "title": "Kubernetes Nodes & Maintenance: Pro Tip",
    "subtitle": "Hardware work on a Kubernetes GPU node",
    "commands": [
      {
        "id": "k8s-nodes-tips-card",
        "desc": "Hardware work on a Kubernetes GPU node",
        "cmd": "kubectl get pods -A -o wide --field-selector spec.nodeName=<node>",
        "details": "Before an RMA or reseat: list what's running on the node, get approval, cordon, drain with --ignore-daemonsets, confirm only DaemonSet pods remain, then do the work. Afterwards check the node is Ready, the GPU count is back (see the GPU sheet), and uncordon. If Slurm also schedules on the node, drain it there as well.",
        "flags": [
          [
            "Before",
            "List pods on the node and get approval"
          ],
          [
            "Drain",
            "--ignore-daemonsets --delete-emptydir-data"
          ],
          [
            "After",
            "Node Ready + GPU allocatable restored, then uncordon"
          ]
        ],
        "tip": "List → approve → cordon → drain → work → verify → uncordon",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("k8s-nodes_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = CTR_K8S_NODES_DATA;
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

  for (const card of CTR_K8S_NODES_DATA) {
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
        localStorage.setItem("k8s-nodes_bookmarks", JSON.stringify([...state.bookmarks]));
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
