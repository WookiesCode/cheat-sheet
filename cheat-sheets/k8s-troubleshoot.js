// k8s-troubleshoot.js
// Standalone interactive cheat sheet for Containers: Troubleshooting Pods: describe, events, logs, exec & debug
const CTR_K8S_TROUBLESHOOT_DATA = [
  {
    "id": "k8s-troubleshoot-cmd-1",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Describe a pod",
    "subtitle": "Describe a pod: read the Events section at the bottom first",
    "commands": [
      {
        "id": "kubectl-describe-pod",
        "desc": "Describe a pod: read the Events section at the bottom first",
        "cmd": "kubectl describe pod <pod> -n <ns>",
        "details": "",
        "flags": [
          [
            "Events (bottom)",
            "Scheduling failures, image pull errors, probe failures and OOM kills appear here"
          ],
          [
            "State / Last State",
            "Current state and how the previous container instance ended (reason and exit code)"
          ],
          [
            "Conditions",
            "PodScheduled, Initialized, ContainersReady, Ready"
          ],
          [
            "Node",
            "Which server it landed on; combine with the node sheets"
          ]
        ],
        "tip": "Read Events first",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "describe",
          "events",
          "pod",
          "state"
        ]
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-2",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: What the common pod statuses mean and where to look next",
    "subtitle": "What the common pod statuses mean and where to look next",
    "commands": [
      {
        "id": "kubectl-pod-status-meanings",
        "desc": "What the common pod statuses mean and where to look next",
        "cmd": "kubectl get pods -n <ns>",
        "details": "",
        "flags": [
          [
            "Pending",
            "Not scheduled yet: not enough CPU/memory/GPU, a taint, or an unbound PVC. Check describe → Events"
          ],
          [
            "ContainerCreating (stuck)",
            "Usually a volume that won't mount or a CNI (network) problem"
          ],
          [
            "ImagePullBackOff / ErrImagePull",
            "Wrong image name or tag, a private registry without credentials, or no route to the registry"
          ],
          [
            "CrashLoopBackOff",
            "The container starts and exits again; read logs --previous"
          ],
          [
            "OOMKilled",
            "Hit its memory limit"
          ],
          [
            "Evicted",
            "The node ran out of memory or disk"
          ],
          [
            "Terminating (stuck)",
            "A finalizer or an unreachable node; check the node first"
          ]
        ],
        "tip": "Pending → Events; CrashLoop → logs --previous",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "status",
          "pending",
          "crashloopbackoff",
          "imagepullbackoff",
          "oomkilled",
          "evicted"
        ]
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-3",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Logs from the previous",
    "subtitle": "Logs from the previous (crashed) instance of a container",
    "commands": [
      {
        "id": "kubectl-logs-previous",
        "desc": "Logs from the previous (crashed) instance of a container",
        "cmd": "kubectl logs <pod> -n <ns> --previous --tail=200",
        "details": "",
        "flags": [
          [
            "--previous / -p",
            "The instance that crashed, not the one currently restarting. Essential for CrashLoopBackOff"
          ],
          [
            "-c <container>",
            "Pick a container when the pod has more than one"
          ],
          [
            "--tail=200 / --since=30m",
            "Limit output"
          ],
          [
            "-f",
            "Follow live"
          ],
          [
            "-l app=<label> --all-containers",
            "Logs from every pod matching a label"
          ]
        ],
        "tip": "CrashLoopBackOff? Always add --previous",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "logs",
          "previous",
          "crashloop",
          "container"
        ]
      },
      {
        "id": "kubectl-logs-previous-sub-1",
        "desc": "One container in a multi-container pod",
        "cmd": "kubectl logs <pod> -n <ns> -c <container> --tail=200",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "logs",
          "previous",
          "crashloop"
        ]
      },
      {
        "id": "kubectl-logs-previous-sub-2",
        "desc": "Logs from one pod of a Deployment",
        "cmd": "kubectl logs deploy/<name> -n <ns> --tail=100",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "logs",
          "previous",
          "crashloop"
        ]
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-4",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Recent events in a namespace, oldest first",
    "subtitle": "Recent events in a namespace, oldest first",
    "commands": [
      {
        "id": "kubectl-events-sorted",
        "desc": "Recent events in a namespace, oldest first",
        "cmd": "kubectl get events -n <ns> --sort-by=.lastTimestamp",
        "details": "",
        "flags": [
          [
            "--sort-by=.lastTimestamp",
            "Events are unsorted by default; this puts the newest at the bottom"
          ],
          [
            "--field-selector type=Warning",
            "Only warnings"
          ],
          [
            "Retention",
            "Events are kept for about an hour by default, so capture them early"
          ]
        ],
        "tip": "Events expire after about an hour",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "events",
          "warning",
          "sort",
          "timeline"
        ]
      },
      {
        "id": "kubectl-events-sorted-sub-1",
        "desc": "Warnings across the whole cluster",
        "cmd": "kubectl get events -A --field-selector type=Warning --sort-by=.lastTimestamp",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "events",
          "warning",
          "sort"
        ]
      },
      {
        "id": "kubectl-events-sorted-sub-2",
        "desc": "Events for one object (newer kubectl events command)",
        "cmd": "kubectl events -n <ns> --for pod/<pod>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "events",
          "warning",
          "sort"
        ]
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-5",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Get a shell in a running pod, or attach a debug container to one that has no shell",
    "subtitle": "Get a shell in a running pod, or attach a debug container to one that has no shell",
    "commands": [
      {
        "id": "kubectl-exec-debug",
        "desc": "Get a shell in a running pod, or attach a debug container to one that has no shell",
        "cmd": "kubectl exec -it <pod> -n <ns> -- sh",
        "details": "",
        "flags": [
          [
            "-- (double dash)",
            "Everything after it is the command to run in the container, not kubectl flags"
          ],
          [
            "-c <container>",
            "Choose the container in a multi-container pod"
          ],
          [
            "kubectl debug -it <pod> --image=busybox --target=<container>",
            "Adds a temporary debug container that shares the target's process namespace; works for distroless images"
          ],
          [
            "kubectl debug node/<node> -it --image=busybox",
            "A pod on the node with the host filesystem at /host"
          ]
        ],
        "tip": "No shell in the image? kubectl debug --target",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "exec",
          "debug",
          "ephemeral",
          "shell",
          "distroless"
        ]
      },
      {
        "id": "kubectl-exec-debug-sub-1",
        "desc": "Environment variables the app sees",
        "cmd": "kubectl exec <pod> -n <ns> -- env",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "exec",
          "debug",
          "ephemeral"
        ]
      },
      {
        "id": "kubectl-exec-debug-sub-2",
        "desc": "Ephemeral debug container (changes state: adds a container to the pod)",
        "cmd": "kubectl debug -it <pod> -n <ns> --image=busybox --target=<container>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "exec",
          "debug",
          "ephemeral"
        ]
      },
      {
        "id": "kubectl-exec-debug-sub-3",
        "desc": "Debug pod on a node, host filesystem under /host (changes state)",
        "cmd": "kubectl debug node/<node> -it --image=busybox",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "exec",
          "debug",
          "ephemeral"
        ]
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-cmd-6",
    "badge": "dbg",
    "title": "Kubernetes Troubleshooting: Reach a service from your workstation, and see live resource usage",
    "subtitle": "Reach a service from your workstation, and see live resource usage",
    "commands": [
      {
        "id": "kubectl-port-forward-top",
        "desc": "Reach a service from your workstation, and see live resource usage",
        "cmd": "kubectl port-forward svc/<service> 8080:80 -n <ns>",
        "details": "",
        "flags": [
          [
            "port-forward svc/<svc> 8080:80",
            "Local port 8080 → service port 80, through the API server; stays open until Ctrl+C"
          ],
          [
            "kubectl top pods",
            "Live CPU and memory per pod (needs metrics-server installed)"
          ],
          [
            "--sort-by=memory",
            "Biggest consumers first"
          ]
        ],
        "tip": "Service has no endpoints? Its selector doesn't match any ready pod",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "port-forward",
          "top",
          "metrics",
          "service",
          "endpoints"
        ]
      },
      {
        "id": "kubectl-port-forward-top-sub-1",
        "desc": "Memory hogs in a namespace",
        "cmd": "kubectl top pods -n <ns> --sort-by=memory",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "port-forward",
          "top",
          "metrics"
        ]
      },
      {
        "id": "kubectl-port-forward-top-sub-2",
        "desc": "CPU and memory per node",
        "cmd": "kubectl top nodes",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "port-forward",
          "top",
          "metrics"
        ]
      },
      {
        "id": "kubectl-port-forward-top-sub-3",
        "desc": "Which pod IPs a service actually sends traffic to",
        "cmd": "kubectl get endpointslices -n <ns> -l kubernetes.io/service-name=<service>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "port-forward",
          "top",
          "metrics"
        ]
      }
    ]
  },
  {
    "id": "k8s-troubleshoot-pro-tips",
    "badge": "tip",
    "title": "Kubernetes Troubleshooting: Pro Tip",
    "subtitle": "A fixed order for any broken pod",
    "commands": [
      {
        "id": "k8s-troubleshoot-tips-card",
        "desc": "A fixed order for any broken pod",
        "cmd": "kubectl describe pod <pod> -n <ns> | sed -n '/^Events:/,$p'",
        "details": "1) get pods -o wide: status, restarts and node. 2) describe: Events and Last State. 3) logs --previous: the crash itself. 4) get events --sort-by: what else happened around it. 5) If the node is involved (NotReady, evictions, GPU missing), move to the Nodes and GPU sheets.",
        "flags": [
          [
            "1. kubectl get pods -o wide",
            "Status, restarts, node"
          ],
          [
            "2. kubectl describe pod",
            "Events and Last State"
          ],
          [
            "3. kubectl logs --previous",
            "The crash"
          ],
          [
            "4. kubectl get events --sort-by",
            "Surrounding timeline"
          ]
        ],
        "tip": "Status → Events → previous logs → node",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("k8s-troubleshoot_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = CTR_K8S_TROUBLESHOOT_DATA;
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

  for (const card of CTR_K8S_TROUBLESHOOT_DATA) {
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
        localStorage.setItem("k8s-troubleshoot_bookmarks", JSON.stringify([...state.bookmarks]));
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
