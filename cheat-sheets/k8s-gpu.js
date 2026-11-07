// k8s-gpu.js
// Standalone interactive cheat sheet for Containers: GPUs in Kubernetes: allocatable GPUs, GPU Operator & test pods
const CTR_K8S_GPU_DATA = [
  {
    "id": "k8s-gpu-cmd-1",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: How many GPUs each node advertises to the scheduler",
    "subtitle": "How many GPUs each node advertises to the scheduler",
    "commands": [
      {
        "id": "k8s-gpu-allocatable",
        "desc": "How many GPUs each node advertises to the scheduler",
        "cmd": "kubectl get nodes -o custom-columns=NAME:.metadata.name,GPUS:.status.allocatable.nvidia\\.com/gpu",
        "details": "",
        "flags": [
          [
            "nvidia\\.com/gpu",
            "The dots in the resource name are escaped so custom-columns doesn't read them as path separators"
          ],
          [
            "<none>",
            "The device plugin isn't running on that node, or found no GPUs"
          ],
          [
            "Fewer than installed (e.g. 7 of 8)",
            "A GPU dropped off the bus or failed health checks; check nvidia-smi and dmesg on the node"
          ]
        ],
        "tip": "7 of 8 GPUs? Check the node, not Kubernetes",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "gpu",
          "allocatable",
          "nvidia.com/gpu",
          "custom-columns",
          "capacity"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-recipes-1",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Related commands",
    "subtitle": "Related commands for: How many GPUs each node advertises to the scheduler",
    "commands": [
      {
        "id": "k8s-gpu-allocatable-sub-1",
        "desc": "GPUs requested by pods vs. available on one node",
        "cmd": "kubectl describe node <node> | grep -A10 'Allocated resources'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "allocatable",
          "nvidia.com/gpu"
        ]
      },
      {
        "id": "k8s-gpu-allocatable-sub-2",
        "desc": "Nodes that GPU feature discovery labelled as having GPUs",
        "cmd": "kubectl get nodes -l nvidia.com/gpu.present=true",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "allocatable",
          "nvidia.com/gpu"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-cmd-2",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Check the NVIDIA GPU Operator components",
    "subtitle": "Check the NVIDIA GPU Operator components",
    "commands": [
      {
        "id": "k8s-gpu-operator-pods",
        "desc": "Check the NVIDIA GPU Operator components",
        "cmd": "kubectl get pods -n gpu-operator -o wide",
        "details": "",
        "flags": [
          [
            "gpu-operator namespace",
            "The usual install namespace; yours may differ (kubectl get pods -A | grep -i nvidia)"
          ],
          [
            "driver daemonset",
            "Installs the driver in a container on each GPU node (if the operator manages the driver)"
          ],
          [
            "container-toolkit daemonset",
            "Configures containerd for GPUs"
          ]
        ],
        "tip": "Validator not Completed = stack not ready",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "gpu-operator",
          "device-plugin",
          "driver",
          "dcgm",
          "validator"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-flags-2",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: More options",
    "subtitle": "More options for: Check the NVIDIA GPU Operator components",
    "commands": [
      {
        "id": "k8s-gpu-operator-pods-flags-card",
        "desc": "More options and gotchas for: Check the NVIDIA GPU Operator components",
        "cmd": "kubectl get pods -n gpu-operator -o wide",
        "hideCode": false,
        "flags": [
          [
            "device-plugin daemonset",
            "Advertises nvidia.com/gpu to the scheduler"
          ],
          [
            "dcgm-exporter",
            "GPU metrics for Prometheus"
          ],
          [
            "validator",
            "Checks the stack works; Init or Error here explains missing GPUs"
          ]
        ],
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "flags",
          "options",
          "gpu-operator",
          "device-plugin",
          "driver"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-recipes-2",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Related commands",
    "subtitle": "Related commands for: Check the NVIDIA GPU Operator components",
    "commands": [
      {
        "id": "k8s-gpu-operator-pods-sub-1",
        "desc": "Why GPUs aren't being advertised",
        "cmd": "kubectl logs -n gpu-operator <device-plugin-pod>",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu-operator",
          "device-plugin",
          "driver"
        ]
      },
      {
        "id": "k8s-gpu-operator-pods-sub-2",
        "desc": "Run nvidia-smi through the driver container",
        "cmd": "kubectl exec -n gpu-operator <driver-pod> -- nvidia-smi",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu-operator",
          "device-plugin",
          "driver"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-cmd-3",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Test pod that requests one GPU and runs nvidia-smi",
    "subtitle": "Test pod that requests one GPU and runs nvidia-smi",
    "commands": [
      {
        "id": "k8s-gpu-test-pod",
        "desc": "Test pod that requests one GPU and runs nvidia-smi",
        "cmd": "apiVersion: v1\nkind: Pod\nmetadata:\n  name: gpu-test\nspec:\n  restartPolicy: Never\n  containers:\n    - name: cuda\n      image: nvidia/cuda:<tag>\n      command: [\"nvidia-smi\", \"-L\"]\n      resources:\n        limits:\n          nvidia.com/gpu: 1",
        "details": "",
        "flags": [
          [
            "limits: nvidia.com/gpu: 1",
            "GPUs are requested under limits and are whole devices (no fractions without MIG or time-slicing)"
          ],
          [
            "restartPolicy: Never",
            "Run once and stop, so you can read the output"
          ],
          [
            "Pending: Insufficient nvidia.com/gpu",
            "Every GPU is already allocated, or none are advertised"
          ]
        ],
        "tip": "GPUs go under limits, in whole numbers",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "gpu",
          "pod",
          "test",
          "limits",
          "nvidia-smi"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-flags-3",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: More options",
    "subtitle": "More options for: Test pod that requests one GPU and runs nvidia-smi",
    "commands": [
      {
        "id": "k8s-gpu-test-pod-flags-card",
        "desc": "More options and gotchas for: Test pod that requests one GPU and runs nvidia-smi",
        "cmd": "apiVersion: v1\nkind: Pod\nmetadata:\n  name: gpu-test\nspec:\n  restartPolicy: Never\n  containers:\n    - name: cuda\n      image: nvidia/cuda:<tag>\n      command: [\"nvidia-smi\", \"-L\"]\n      resources:\n        limits:\n          nvidia.com/gpu: 1",
        "hideCode": true,
        "flags": [
          [
            "Toleration",
            "If GPU nodes are tainted, add a matching toleration"
          ]
        ],
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "flags",
          "options",
          "gpu",
          "pod",
          "test"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-recipes-3",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Related commands",
    "subtitle": "Related commands for: Test pod that requests one GPU and runs nvidia-smi",
    "commands": [
      {
        "id": "k8s-gpu-test-pod-sub-1",
        "desc": "Create the test pod (changes state)",
        "cmd": "kubectl apply -f gpu-test.yaml",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "pod",
          "test"
        ]
      },
      {
        "id": "k8s-gpu-test-pod-sub-2",
        "desc": "Should list one GPU",
        "cmd": "kubectl logs gpu-test",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "pod",
          "test"
        ]
      },
      {
        "id": "k8s-gpu-test-pod-sub-3",
        "desc": "Clean up (changes state)",
        "cmd": "kubectl delete pod gpu-test",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "gpu",
          "pod",
          "test"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-cmd-4",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Read GPU metrics from DCGM exporter",
    "subtitle": "Read GPU metrics from DCGM exporter",
    "commands": [
      {
        "id": "k8s-dcgm-metrics",
        "desc": "Read GPU metrics from DCGM exporter",
        "cmd": "kubectl port-forward -n gpu-operator svc/nvidia-dcgm-exporter 9400:9400",
        "details": "",
        "flags": [
          [
            "port 9400",
            "DCGM exporter's default metrics port"
          ],
          [
            "curl -s localhost:9400/metrics",
            "From a second terminal while the port-forward runs"
          ],
          [
            "DCGM_FI_DEV_XID_ERROR",
            "Last Xid error per GPU; map it with the NVIDIA DC Xid sheet (exporters before 4.9.0: DCGM_FI_DEV_XID_ERRORS)"
          ]
        ],
        "tip": "Xid in DCGM → check the NVIDIA DC Xid sheet",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "dcgm",
          "metrics",
          "prometheus",
          "xid",
          "temperature"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-flags-4",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: More options",
    "subtitle": "More options for: Read GPU metrics from DCGM exporter",
    "commands": [
      {
        "id": "k8s-dcgm-metrics-flags-card",
        "desc": "More options and gotchas for: Read GPU metrics from DCGM exporter",
        "cmd": "kubectl port-forward -n gpu-operator svc/nvidia-dcgm-exporter 9400:9400",
        "hideCode": false,
        "flags": [
          [
            "DCGM_FI_DEV_GPU_TEMP_CELSIUS / BOARD_POWER_WATTS",
            "Temperature and power per GPU (before 4.9.0: DCGM_FI_DEV_GPU_TEMP / POWER_USAGE)"
          ]
        ],
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "flags",
          "options",
          "dcgm",
          "metrics",
          "prometheus"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-recipes-4",
    "badge": "kgpu",
    "title": "Kubernetes GPUs: Related commands",
    "subtitle": "Related commands for: Read GPU metrics from DCGM exporter",
    "commands": [
      {
        "id": "k8s-dcgm-metrics-sub-1",
        "desc": "Xid errors and temperatures",
        "cmd": "curl -s localhost:9400/metrics | grep -E 'XID|GPU_TEMP'",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "dcgm",
          "metrics",
          "prometheus"
        ]
      },
      {
        "id": "k8s-dcgm-metrics-sub-2",
        "desc": "Find the exporter service if it's in another namespace",
        "cmd": "kubectl get svc -A | grep -i dcgm",
        "tags": [
          "kubernetes",
          "k8s",
          "kubectl",
          "containers",
          "recipe",
          "dcgm",
          "metrics",
          "prometheus"
        ]
      }
    ]
  },
  {
    "id": "k8s-gpu-pro-tips",
    "badge": "tip",
    "title": "Kubernetes GPUs: Pro Tip",
    "subtitle": "GPU missing in Kubernetes: check from the hardware up",
    "commands": [
      {
        "id": "k8s-gpu-tips-card",
        "desc": "GPU missing in Kubernetes: check from the hardware up",
        "cmd": "kubectl get nodes -o custom-columns=NAME:.metadata.name,GPUS:.status.allocatable.nvidia\\.com/gpu",
        "details": "Start at the bottom. On the node: does nvidia-smi see every GPU, and is dmesg free of Xid or 'fallen off the bus' errors? Then the GPU Operator: driver, toolkit and device-plugin pods Running, validator Completed. Then the node's allocatable count. Only after all three are right is it a scheduling problem.",
        "flags": [
          [
            "1. Node",
            "nvidia-smi and dmesg -T | grep -i xid"
          ],
          [
            "2. Operator",
            "kubectl get pods -n gpu-operator"
          ],
          [
            "3. Allocatable",
            "custom-columns query above"
          ],
          [
            "4. Scheduling",
            "describe pod → Events"
          ]
        ],
        "tip": "Hardware → operator pods → allocatable → scheduling",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("k8s-gpu_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = CTR_K8S_GPU_DATA;
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

  for (const card of CTR_K8S_GPU_DATA) {
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
        localStorage.setItem("k8s-gpu_bookmarks", JSON.stringify([...state.bookmarks]));
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
