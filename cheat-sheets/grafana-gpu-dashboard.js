// grafana-gpu-dashboard.js
// Standalone interactive cheat sheet for Grafana: GPU Fleet Dashboard Recipe: DCGM Exporter Panels for H200 / B200 Nodes
const GRAF_GRAFANA_GPU_DASHBOARD_DATA = [
  {
    "id": "grafana-gpu-dashboard-cmd-1",
    "badge": "gpu",
    "title": "GPU Fleet Dashboard: Which metric names does your exporter use? dcgm-exporter 4.9.0 renamed them",
    "subtitle": "Which metric names does your exporter use? dcgm-exporter 4.9.0 renamed them",
    "commands": [
      {
        "id": "gpu-dash-metric-names",
        "desc": "Which metric names does your exporter use? dcgm-exporter 4.9.0 renamed them",
        "cmd": "curl -s http://<node>:9400/metrics | grep -c '^DCGM_FI_DEV_GPU_TEMP_CELSIUS{'",
        "details": "",
        "flags": [
          [
            "Result > 0",
            "4.9.0 or newer: the queries on these sheets work as written"
          ],
          [
            "Result 0",
            "Older exporter: use the old names below, and note the unit changes"
          ],
          [
            "DCGM_FI_DEV_GPU_TEMP",
            "→ DCGM_FI_DEV_GPU_TEMP_CELSIUS (same unit, °C)"
          ],
          [
            "DCGM_FI_DEV_POWER_USAGE",
            "→ DCGM_FI_DEV_BOARD_POWER_WATTS (same unit, W)"
          ],
          [
            "DCGM_FI_DEV_GPU_UTIL",
            "→ DCGM_FI_DEV_GPU_UTIL_RATIO (0-100 percent became a 0-1 ratio)"
          ],
          [
            "DCGM_FI_DEV_FB_USED",
            "→ DCGM_FI_DEV_FB_USED_BYTES (MiB became bytes)"
          ],
          [
            "DCGM_FI_DEV_SM_CLOCK",
            "→ DCGM_FI_DEV_SM_CLOCK_HERTZ (MHz became Hz)"
          ],
          [
            "DCGM_FI_DEV_XID_ERRORS",
            "→ DCGM_FI_DEV_XID_ERROR (last XID code)"
          ],
          [
            "DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL",
            "→ DCGM_FI_DEV_NVLINK_THROUGHPUT_BYTES_PER_SECOND (MB/s became bytes/s)"
          ],
          [
            "DCGM_FI_PROF_GR_ENGINE_ACTIVE",
            "→ DCGM_FI_PROF_GR_ENGINE_UTIL_RATIO"
          ],
          [
            "DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS",
            "→ DCGM_FI_DEV_ROW_REMAP_UNCORRECTABLE_TOTAL"
          ],
          [
            "DCGM_FI_DEV_ROW_REMAP_FAILURE",
            "→ DCGM_FI_DEV_ROW_REMAP_FAILED"
          ],
          [
            "Hostname label",
            "→ hostname since 4.6.0; the driver-version label DCGM_FI_DRIVER_VERSION → DCGM_FI_SYSTEM_DRIVER_VERSION in 4.9.0"
          ]
        ],
        "tip": "Upgrading the exporter breaks old dashboards",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "dcgm",
          "metric names",
          "rename",
          "4.9.0",
          "upgrade",
          "units",
          "hostname"
        ]
      },
      {
        "id": "gpu-dash-metric-names-sub-1",
        "desc": "Mixed fleet during an upgrade: or keeps a series from either name (only safe where the unit did not change)",
        "cmd": "max by (hostname, gpu) (DCGM_FI_DEV_GPU_TEMP_CELSIUS or DCGM_FI_DEV_GPU_TEMP)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dcgm",
          "metric names",
          "rename"
        ]
      },
      {
        "id": "gpu-dash-metric-names-sub-2",
        "desc": "Old percent metric on a panel built for 0-1 ratios",
        "cmd": "DCGM_FI_DEV_GPU_UTIL / 100",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dcgm",
          "metric names",
          "rename"
        ]
      },
      {
        "id": "gpu-dash-metric-names-sub-3",
        "desc": "HELP/TYPE lines show the name, type and unit your exporter really uses",
        "cmd": "curl -s http://<node>:9400/metrics | grep -E '^# (HELP|TYPE) DCGM_FI_DEV_GPU_UTIL'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dcgm",
          "metric names",
          "rename"
        ]
      }
    ]
  },
  {
    "id": "grafana-gpu-dashboard-cmd-2",
    "badge": "gpu",
    "title": "GPU Fleet Dashboard: Layout",
    "subtitle": "Layout: three rows answering 'anything wrong?', 'where?', 'why?'",
    "commands": [
      {
        "id": "gpu-dash-layout",
        "desc": "Layout: three rows answering 'anything wrong?', 'where?', 'why?'",
        "cmd": "Row 1  Fleet health (stat panels, w 4 each = 6 across)\n       GPUs reporting | Exporters down | XID now | Hot GPUs | Fleet power kW | Avg util\nRow 2  Where (w 12 + 12)\n       Per-GPU table (sorted by temp)  |  Temperature heatmap by GPU\nRow 3  Why (time series, repeat by $host)\n       Util | Temp | Power | Memory used | NVLink bandwidth | Clock event reasons",
        "details": "",
        "flags": [
          [
            "Variables",
            "host = label_values(DCGM_FI_DEV_GPU_TEMP_CELSIUS, hostname), gpu chained on host"
          ],
          [
            "Row 1 colors",
            "Every stat is green at 0 problems and red when something needs a technician"
          ],
          [
            "Row 3 repeat",
            "Repeat the row by $host so selecting 3 nodes shows 3 blocks"
          ],
          [
            "Starting point",
            "Community dashboard 12239 shows working queries but uses the pre-4.9 metric names. dcgm-exporter 4.9.0 updated its own Grafana dashboard to the new names and units"
          ]
        ],
        "tip": "Match the dashboard to your exporter's names",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "layout",
          "gpu",
          "dcgm",
          "design",
          "rows",
          "12239"
        ]
      },
      {
        "id": "gpu-dash-layout-sub-1",
        "desc": "Import the community DCGM dashboard (read its JSON before trusting it)",
        "cmd": "Dashboards → New → Import → 12239 → pick the Prometheus data source",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "layout",
          "gpu",
          "dcgm"
        ]
      }
    ]
  },
  {
    "id": "grafana-gpu-dashboard-cmd-3",
    "badge": "gpu",
    "title": "GPU Fleet Dashboard: Row 1 stat queries",
    "subtitle": "Row 1 stat queries: GPUs reporting, exporters down, XID, hot GPUs",
    "commands": [
      {
        "id": "gpu-dash-health-stats",
        "desc": "Row 1 stat queries: GPUs reporting, exporters down, XID, hot GPUs",
        "cmd": "count(DCGM_FI_DEV_GPU_TEMP_CELSIUS)",
        "details": "",
        "flags": [
          [
            "GPUs reporting",
            "count(DCGM_FI_DEV_GPU_TEMP_CELSIUS): compare with the GPUs you own (threshold below the expected count = red)"
          ],
          [
            "Exporters down",
            "count(up{job=\"dcgm\"} == 0) or vector(0)"
          ],
          [
            "XID now",
            "count(DCGM_FI_DEV_XID_ERROR > 0) or vector(0); the metric holds the last XID code, not a count"
          ],
          [
            "Hot GPUs",
            "count(DCGM_FI_DEV_GPU_TEMP_CELSIUS > 85) or vector(0); take the limit from your GPU's spec"
          ],
          [
            "or vector(0)",
            "Turns 'No data' into 0 so the panel stays green instead of grey"
          ]
        ],
        "tip": "or vector(0) keeps stat panels green",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "stat",
          "health",
          "xid",
          "temperature",
          "count",
          "dcgm"
        ]
      },
      {
        "id": "gpu-dash-health-stats-sub-1",
        "desc": "Fleet GPU power in kW (unit: none, or kwatt)",
        "cmd": "sum(DCGM_FI_DEV_BOARD_POWER_WATTS) / 1000",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "stat",
          "health",
          "xid"
        ]
      },
      {
        "id": "gpu-dash-health-stats-sub-2",
        "desc": "Fleet average utilization (unit percentunit, because the value is 0-1)",
        "cmd": "avg(DCGM_FI_DEV_GPU_UTIL_RATIO)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "stat",
          "health",
          "xid"
        ]
      }
    ]
  },
  {
    "id": "grafana-gpu-dashboard-cmd-4",
    "badge": "gpu",
    "title": "GPU Fleet Dashboard: Row 2 per-GPU table",
    "subtitle": "Row 2 per-GPU table: one row per GPU with temp, power, util and memory",
    "commands": [
      {
        "id": "gpu-dash-table",
        "desc": "Row 2 per-GPU table: one row per GPU with temp, power, util and memory",
        "cmd": "A: DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~\"$host\"}\nB: DCGM_FI_DEV_BOARD_POWER_WATTS{hostname=~\"$host\"}\nC: DCGM_FI_DEV_GPU_UTIL_RATIO{hostname=~\"$host\"}\nD: DCGM_FI_DEV_FB_USED_BYTES{hostname=~\"$host\"}\n(all: Format Table, Type Instant)\n→ Merge → Organize fields (keep hostname, gpu, modelName, UUID, pci_bus_id) → Sort by Temp desc",
        "details": "",
        "flags": [
          [
            "Labels you get",
            "gpu (index), UUID, pci_bus_id, device, modelName, plus hostname unless the exporter runs with --no-hostname. Exporters older than 4.6.0 spell it Hostname"
          ],
          [
            "UUID + pci_bus_id",
            "Exactly the identifiers an RMA ticket needs; keep them as columns"
          ],
          [
            "Overrides",
            "Temp → celsius with thresholds; Power → watt; Util → percentunit; FB_USED_BYTES → bytes (pre-4.9 FB_USED was MiB → mbytes)"
          ],
          [
            "Cell display",
            "Override Temp: Cell options → Colored background, so hot rows stand out"
          ]
        ],
        "tip": "Keep UUID and BDF columns for RMAs",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "table",
          "per gpu",
          "merge",
          "uuid",
          "bdf",
          "rma"
        ]
      }
    ]
  },
  {
    "id": "grafana-gpu-dashboard-cmd-5",
    "badge": "gpu",
    "title": "GPU Fleet Dashboard: Row 3 time series queries for one node",
    "subtitle": "Row 3 time series queries for one node (repeat by $host)",
    "commands": [
      {
        "id": "gpu-dash-timeseries",
        "desc": "Row 3 time series queries for one node (repeat by $host)",
        "cmd": "DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~\"$host\"}",
        "details": "",
        "flags": [
          [
            "Legend",
            "GPU {{gpu}} so 8 lines per node read GPU 0 … GPU 7"
          ],
          [
            "Temperature",
            "DCGM_FI_DEV_GPU_TEMP_CELSIUS and DCGM_FI_DEV_MEMORY_TEMP_CELSIUS (HBM), unit celsius"
          ],
          [
            "Power",
            "DCGM_FI_DEV_BOARD_POWER_WATTS, unit watt; one GPU far below its siblings under load is worth a look"
          ],
          [
            "Memory",
            "DCGM_FI_DEV_FB_USED_BYTES, unit bytes (Grafana scales it to GiB for you)"
          ],
          [
            "Utilization",
            "DCGM_FI_DEV_GPU_UTIL_RATIO (share of time the GPU was busy) and DCGM_FI_PROF_GR_ENGINE_UTIL_RATIO (share of time the graphics engine was active); both are in the default counters, unit percentunit"
          ],
          [
            "Clocks",
            "DCGM_FI_DEV_SM_CLOCK_HERTZ (unit hertz; pre-4.9 SM_CLOCK was MHz); a GPU running slower than its siblings is often thermal or power throttling"
          ]
        ],
        "tip": "One GPU unlike its 7 siblings = investigate",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "time series",
          "temperature",
          "power",
          "memory",
          "clocks",
          "nvlink",
          "dcgm"
        ]
      },
      {
        "id": "gpu-dash-timeseries-sub-1",
        "desc": "NVLink throughput across all links: already a per-second gauge, so no rate() (unit Bps)",
        "cmd": "DCGM_FI_DEV_NVLINK_THROUGHPUT_BYTES_PER_SECOND{hostname=~\"$host\"}",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "time series",
          "temperature",
          "power"
        ]
      },
      {
        "id": "gpu-dash-timeseries-sub-2",
        "desc": "Share of time spent thermally throttled (0-1). Optional field: uncomment it (and GPU_POWER_THROTTLE_SECONDS_TOTAL) in the counters CSV",
        "cmd": "rate(DCGM_FI_DEV_GPU_THERMAL_THROTTLE_SECONDS_TOTAL{hostname=~\"$host\"}[$__rate_interval])",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "time series",
          "temperature",
          "power"
        ]
      }
    ]
  },
  {
    "id": "grafana-gpu-dashboard-cmd-6",
    "badge": "gpu",
    "title": "GPU Fleet Dashboard: Error panels",
    "subtitle": "Error panels: XID codes, ECC and row remapping (state timeline)",
    "commands": [
      {
        "id": "gpu-dash-errors",
        "desc": "Error panels: XID codes, ECC and row remapping (state timeline)",
        "cmd": "max by (hostname, gpu) (DCGM_FI_DEV_XID_ERROR{hostname=~\"$host\"})",
        "details": "",
        "flags": [
          [
            "State timeline",
            "Value mapping 0 → OK (green), range 1-999 → 'XID ${__value.raw}' (red): shows when each GPU hit an XID. The value is the last XID code, so look it up on the NVIDIA DC Xid sheet"
          ],
          [
            "ECC",
            "increase(DCGM_FI_DEV_ECC_DBE_VOL_TOTAL[$__range]) for double-bit (uncorrectable) volatile errors. Optional field: commented out in the default counters CSV"
          ],
          [
            "Row remapping",
            "DCGM_FI_DEV_ROW_REMAP_UNCORRECTABLE_TOTAL (counter) and DCGM_FI_DEV_ROW_REMAP_FAILED (gauge, whether remapping failed); both are default fields. FAILED > 0 is an RMA candidate"
          ],
          [
            "Not every metric is on",
            "dcgm-exporter only exports what its counters CSV lists; add missing fields there"
          ],
          [
            "Then go to the node",
            "The dashboard says where; nvidia-smi -q and dmesg on the node say why (see the NVIDIA DC sheets)"
          ]
        ],
        "tip": "Dashboards find the GPU; the CLI proves the fault",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "xid",
          "ecc",
          "row remap",
          "errors",
          "state timeline",
          "rma"
        ]
      }
    ]
  },
  {
    "id": "grafana-gpu-dashboard-cmd-7",
    "badge": "gpu",
    "title": "GPU Fleet Dashboard: Node context from node_exporter",
    "subtitle": "Node context from node_exporter: CPU, memory and InfiniBand link errors",
    "commands": [
      {
        "id": "gpu-dash-node-context",
        "desc": "Node context from node_exporter: CPU, memory and InfiniBand link errors",
        "cmd": "100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[$__rate_interval])))",
        "details": "",
        "flags": [
          [
            "CPU busy %",
            "The query above: 1 minus the idle share, as a percentage"
          ],
          [
            "Memory",
            "1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes (unit percentunit)"
          ],
          [
            "IB link downs",
            "increase(node_infiniband_link_downed_total[$__range]) from node_exporter's infiniband collector"
          ],
          [
            "IB symbol errors",
            "increase(node_infiniband_symbol_error_total[$__range]); a climbing count points at optics or cables"
          ],
          [
            "instance vs hostname",
            "node_exporter labels by instance (host:9100) while DCGM uses hostname; join with node_uname_info or relabel in Prometheus"
          ]
        ],
        "tip": "Rising symbol errors → clean/swap the optic",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "node_exporter",
          "cpu",
          "memory",
          "infiniband",
          "link errors",
          "context"
        ]
      }
    ]
  },
  {
    "id": "grafana-gpu-dashboard-pro-tips",
    "badge": "tip",
    "title": "GPU Fleet Dashboard: Pro Tip",
    "subtitle": "Before trusting a GPU panel, check the pipeline end to end",
    "commands": [
      {
        "id": "grafana-gpu-dashboard-tips-card",
        "desc": "Before trusting a GPU panel, check the pipeline end to end",
        "cmd": "curl -s http://<node>:9400/metrics | grep -cE '^DCGM_FI_DEV_GPU_TEMP(_CELSIUS)?\\{'",
        "details": "Expect one line per GPU (8 on an HGX node). If it is lower, a GPU dropped off the bus or the exporter cannot see it; if the curl fails, the exporter is down and the dashboard is showing stale or no data.",
        "flags": [
          [
            "1. Exporter",
            "curl /metrics on the node (above)"
          ],
          [
            "2. Prometheus",
            "Status → Targets: dcgm job up?"
          ],
          [
            "3. Grafana",
            "Panel → Inspect → Query: did the query return series?"
          ],
          [
            "4. Dashboard",
            "Variables: is the node selected? Time range right?"
          ]
        ],
        "tip": "Exporter → Prometheus → Grafana → panel",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("grafana-gpu-dashboard_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = GRAF_GRAFANA_GPU_DASHBOARD_DATA;
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

  for (const card of GRAF_GRAFANA_GPU_DASHBOARD_DATA) {
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
        localStorage.setItem("grafana-gpu-dashboard_bookmarks", JSON.stringify([...state.bookmarks]));
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
