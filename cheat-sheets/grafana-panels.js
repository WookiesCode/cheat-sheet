// grafana-panels.js
// Standalone interactive cheat sheet for Grafana: Grafana Panels: Build a Dashboard, Pick Visualizations, Units & Thresholds
const GRAF_GRAFANA_PANELS_DATA = [
  {
    "id": "grafana-panels-cmd-1",
    "badge": "pnl",
    "title": "Grafana Panels: Build your first dashboard",
    "subtitle": "Build your first dashboard: the click-path from empty to saved",
    "commands": [
      {
        "id": "grafana-first-dashboard",
        "desc": "Build your first dashboard: the click-path from empty to saved",
        "cmd": "1. Dashboards → New → New dashboard → Add visualization\n2. Pick the Prometheus data source\n3. Query: avg by (hostname) (DCGM_FI_DEV_GPU_UTIL_RATIO)   → Run queries\n4. Legend (Options): {{hostname}}\n5. Right pane: Visualization = Time series, Title = GPU utilization\n6. Standard options → Unit = Percent (0.0-1.0), Min 0, Max 1\n7. Thresholds: 0.8 orange, 0.95 red; Show thresholds = As lines\n8. Back to dashboard → drag/resize → Save (Ctrl+S) with a message",
        "details": "",
        "flags": [
          [
            "Code vs Builder",
            "The query editor has a Builder (clicks) and Code (type PromQL) mode. Builder is a good way to learn PromQL: build it, then switch to Code to read it"
          ],
          [
            "Legend {{hostname}}",
            "Text in double braces is replaced by that label's value, so lines are named gpu-node01 instead of a full label set"
          ],
          [
            "Unit",
            "Sets axis labels, tooltip formatting and stat values in one place; pick it before anything else. _RATIO metrics are 0-1, so use Percent (0.0-1.0), not Percent (0-100)"
          ]
        ],
        "tip": "Set the unit before anything else",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "dashboard",
          "panel",
          "ui",
          "first",
          "save",
          "shortcuts",
          "beginner"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-flags-1",
    "badge": "pnl",
    "title": "Grafana Panels: More options",
    "subtitle": "More options for: Build your first dashboard: the click-path from empty to saved",
    "commands": [
      {
        "id": "grafana-first-dashboard-flags-card",
        "desc": "More options and gotchas for: Build your first dashboard: the click-path from empty to saved",
        "cmd": "1. Dashboards → New → New dashboard → Add visualization\n2. Pick the Prometheus data source\n3. Query: avg by (hostname) (DCGM_FI_DEV_GPU_UTIL_RATIO)   → Run queries\n4. Legend (Options): {{hostname}}\n5. Right pane: Visualization = Time series, Title = GPU utilization\n6. Standard options → Unit = Percent (0.0-1.0), Min 0, Max 1\n7. Thresholds: 0.8 orange, 0.95 red; Show thresholds = As lines\n8. Back to dashboard → drag/resize → Save (Ctrl+S) with a message",
        "hideCode": true,
        "flags": [
          [
            "Save message",
            "Every save is a version (Dashboard settings → Versions); a message makes rollback easy"
          ],
          [
            "Grafana 13 layouts",
            "New dashboards use the v2 schema with auto grid, tabs and conditional rendering; older dashboards are migrated when opened"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "dashboard",
          "panel",
          "ui"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-recipes-1",
    "badge": "pnl",
    "title": "Grafana Panels: Related commands",
    "subtitle": "Related commands for: Build your first dashboard: the click-path from empty to saved",
    "commands": [
      {
        "id": "grafana-first-dashboard-sub-1",
        "desc": "Save the dashboard",
        "cmd": "Ctrl+S",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dashboard",
          "panel",
          "ui"
        ]
      },
      {
        "id": "grafana-first-dashboard-sub-2",
        "desc": "Edit that panel",
        "cmd": "e (hover a panel)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dashboard",
          "panel",
          "ui"
        ]
      },
      {
        "id": "grafana-first-dashboard-sub-3",
        "desc": "View the panel full screen",
        "cmd": "v (hover a panel)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dashboard",
          "panel",
          "ui"
        ]
      },
      {
        "id": "grafana-first-dashboard-sub-4",
        "desc": "Toggle kiosk mode (for wall screens)",
        "cmd": "d k",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dashboard",
          "panel",
          "ui"
        ]
      },
      {
        "id": "grafana-first-dashboard-sub-5",
        "desc": "Zoom out the time range",
        "cmd": "t z",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dashboard",
          "panel",
          "ui"
        ]
      },
      {
        "id": "grafana-first-dashboard-sub-6",
        "desc": "Show every keyboard shortcut",
        "cmd": "?",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dashboard",
          "panel",
          "ui"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-cmd-2",
    "badge": "pnl",
    "title": "Grafana Panels: Pick the visualization from the question you are answering",
    "subtitle": "Pick the visualization from the question you are answering",
    "commands": [
      {
        "id": "grafana-visualization-choice",
        "desc": "Pick the visualization from the question you are answering",
        "cmd": "Question                         → Visualization (JSON \"type\")\nHow does it change over time?    → Time series   (timeseries)\nWhat is it right now?            → Stat          (stat)\nHow close to a limit?            → Gauge / Bar gauge (gauge, bargauge)\nWhich GPU/node is worst?         → Table, sorted (table)\nUp/down or OK/fault over time?   → State timeline (state-timeline)\nDistribution across many nodes?  → Heatmap       (heatmap)\nNotes, runbook links             → Text          (text)",
        "details": "",
        "flags": [
          [
            "Stat",
            "One big number per series with an optional sparkline. Set Calculation (Last, Max, Mean) under Value options"
          ],
          [
            "Table",
            "Use an Instant query with Format = Table: one row per series, one column per label. Best for 'which GPU is hot'"
          ],
          [
            "State timeline",
            "Turns numbers into colored bands via value mappings (0 = OK green, >0 = XID red); great for link up/down and error flags"
          ]
        ],
        "tip": "Too many lines? Aggregate, table or heatmap",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "visualization",
          "time series",
          "stat",
          "gauge",
          "table",
          "heatmap",
          "state timeline"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-flags-2",
    "badge": "pnl",
    "title": "Grafana Panels: More options",
    "subtitle": "More options for: Pick the visualization from the question you are answering",
    "commands": [
      {
        "id": "grafana-visualization-choice-flags-card",
        "desc": "More options and gotchas for: Pick the visualization from the question you are answering",
        "cmd": "Question                         → Visualization (JSON \"type\")\nHow does it change over time?    → Time series   (timeseries)\nWhat is it right now?            → Stat          (stat)\nHow close to a limit?            → Gauge / Bar gauge (gauge, bargauge)\nWhich GPU/node is worst?         → Table, sorted (table)\nUp/down or OK/fault over time?   → State timeline (state-timeline)\nDistribution across many nodes?  → Heatmap       (heatmap)\nNotes, runbook links             → Text          (text)",
        "hideCode": true,
        "flags": [
          [
            "Heatmap",
            "Hundreds of GPUs in one panel: each row a GPU, color = temperature. Spots a single hot GPU faster than 800 lines"
          ],
          [
            "Avoid",
            "Pie charts for anything but small parts-of-a-whole; time series with more than ~20 lines (aggregate or use a table)"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "visualization",
          "time series",
          "stat"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-cmd-3",
    "badge": "pnl",
    "title": "Grafana Panels: Units, min/max, thresholds and value mappings in the panel JSON",
    "subtitle": "Units, min/max, thresholds and value mappings in the panel JSON (fieldConfig.defaults)",
    "commands": [
      {
        "id": "grafana-fieldconfig-json",
        "desc": "Units, min/max, thresholds and value mappings in the panel JSON (fieldConfig.defaults)",
        "cmd": "\"fieldConfig\": {\n  \"defaults\": {\n    \"unit\": \"celsius\",\n    \"min\": 0,\n    \"max\": 100,\n    \"decimals\": 0,\n    \"thresholds\": {\n      \"mode\": \"absolute\",\n      \"steps\": [\n        { \"color\": \"green\",  \"value\": null },\n        { \"color\": \"orange\", \"value\": 80 },\n        { \"color\": \"red\",    \"value\": 87 }\n      ]\n    },\n    \"mappings\": [\n      { \"type\": \"value\", \"options\": { \"0\": { \"text\": \"OK\", \"color\": \"green\" } } }\n    ]\n  },\n  \"overrides\": []\n}",
        "details": "",
        "flags": [
          [
            "Common unit IDs",
            "percent (0-100), percentunit (0-1), celsius, watt, bytes, mbytes (MiB), bps (bits/s), Bps (bytes/s), s, ms, short"
          ],
          [
            "steps[0].value: null",
            "The first step is the base color for everything below the next threshold; it must be null"
          ],
          [
            "mode",
            "absolute = raw values; percentage = percent of min..max"
          ]
        ],
        "tip": "Inspect → Panel JSON shows what the UI set",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "fieldconfig",
          "unit",
          "thresholds",
          "mappings",
          "json",
          "colors"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-flags-3",
    "badge": "pnl",
    "title": "Grafana Panels: More options",
    "subtitle": "More options for: Units, min/max, thresholds and value mappings in the panel JSON",
    "commands": [
      {
        "id": "grafana-fieldconfig-json-flags-card",
        "desc": "More options and gotchas for: Units, min/max, thresholds and value mappings in the panel JSON",
        "cmd": "\"fieldConfig\": {\n  \"defaults\": {\n    \"unit\": \"celsius\",\n    \"min\": 0,\n    \"max\": 100,\n    \"decimals\": 0,\n    \"thresholds\": {\n      \"mode\": \"absolute\",\n      \"steps\": [\n        { \"color\": \"green\",  \"value\": null },\n        { \"color\": \"orange\", \"value\": 80 },\n        { \"color\": \"red\",    \"value\": 87 }\n      ]\n    },\n    \"mappings\": [\n      { \"type\": \"value\", \"options\": { \"0\": { \"text\": \"OK\", \"color\": \"green\" } } }\n    ]\n  },\n  \"overrides\": []\n}",
        "hideCode": true,
        "flags": [
          [
            "mappings",
            "value (exact match), range (from/to), regex, special (null, NaN, true/false). Mapped text replaces the number"
          ],
          [
            "Thresholds are examples",
            "Take temperature and power limits from the vendor spec for your exact GPU/CPU SKU"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "fieldconfig",
          "unit",
          "thresholds"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-recipes-3",
    "badge": "pnl",
    "title": "Grafana Panels: Related commands",
    "subtitle": "Related commands for: Units, min/max, thresholds and value mappings in the panel JSON",
    "commands": [
      {
        "id": "grafana-fieldconfig-json-sub-1",
        "desc": "See and edit exactly this JSON for any panel",
        "cmd": "Panel menu → Inspect → Panel JSON",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "fieldconfig",
          "unit",
          "thresholds"
        ]
      },
      {
        "id": "grafana-fieldconfig-json-sub-2",
        "desc": "See the numbers behind the panel (and download CSV)",
        "cmd": "Panel menu → Inspect → Data",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "fieldconfig",
          "unit",
          "thresholds"
        ]
      },
      {
        "id": "grafana-fieldconfig-json-sub-3",
        "desc": "See the exact request sent and the time it took",
        "cmd": "Panel menu → Inspect → Query",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "fieldconfig",
          "unit",
          "thresholds"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-cmd-4",
    "badge": "pnl",
    "title": "Grafana Panels: Overrides",
    "subtitle": "Overrides: different settings for one series or field (e.g. a second unit on the same panel)",
    "commands": [
      {
        "id": "grafana-overrides",
        "desc": "Overrides: different settings for one series or field (e.g. a second unit on the same panel)",
        "cmd": "\"overrides\": [\n  {\n    \"matcher\": { \"id\": \"byName\", \"options\": \"Power\" },\n    \"properties\": [\n      { \"id\": \"unit\", \"value\": \"watt\" },\n      { \"id\": \"custom.axisPlacement\", \"value\": \"right\" }\n    ]\n  },\n  {\n    \"matcher\": { \"id\": \"byRegexp\", \"options\": \"/.*gpu-node0[1-4].*/\" },\n    \"properties\": [ { \"id\": \"color\", \"value\": { \"mode\": \"fixed\", \"fixedColor\": \"purple\" } } ]\n  }\n]",
        "details": "",
        "flags": [
          [
            "byName",
            "Match one field by its display name (what the legend shows)"
          ],
          [
            "byRegexp",
            "Match many fields by a regex on the name"
          ],
          [
            "byFrameRefID",
            "Match every field from query A, B, …: handy when query B is a different metric"
          ]
        ],
        "tip": "Second metric, second axis: override on query B",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "overrides",
          "matcher",
          "axis",
          "unit",
          "json"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-flags-4",
    "badge": "pnl",
    "title": "Grafana Panels: More options",
    "subtitle": "More options for: Overrides: different settings for one series or field",
    "commands": [
      {
        "id": "grafana-overrides-flags-card",
        "desc": "More options and gotchas for: Overrides: different settings for one series or field",
        "cmd": "\"overrides\": [\n  {\n    \"matcher\": { \"id\": \"byName\", \"options\": \"Power\" },\n    \"properties\": [\n      { \"id\": \"unit\", \"value\": \"watt\" },\n      { \"id\": \"custom.axisPlacement\", \"value\": \"right\" }\n    ]\n  },\n  {\n    \"matcher\": { \"id\": \"byRegexp\", \"options\": \"/.*gpu-node0[1-4].*/\" },\n    \"properties\": [ { \"id\": \"color\", \"value\": { \"mode\": \"fixed\", \"fixedColor\": \"purple\" } } ]\n  }\n]",
        "hideCode": true,
        "flags": [
          [
            "Add in the UI",
            "Edit panel → Overrides tab → Add field override; the JSON above is the result"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "overrides",
          "matcher",
          "axis"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-cmd-5",
    "badge": "pnl",
    "title": "Grafana Panels: Transformations",
    "subtitle": "Transformations: reshape query results in Grafana (join, rename, filter, calculate)",
    "commands": [
      {
        "id": "grafana-transformations",
        "desc": "Transformations: reshape query results in Grafana (join, rename, filter, calculate)",
        "cmd": "Per-GPU table from several instant queries:\n  Query A: DCGM_FI_DEV_GPU_TEMP_CELSIUS     (Format: Table, Type: Instant)\n  Query B: DCGM_FI_DEV_BOARD_POWER_WATTS  (Format: Table, Type: Instant)\n  Query C: DCGM_FI_DEV_GPU_UTIL_RATIO     (Format: Table, Type: Instant)\nTransformations:\n  1. Merge            → one row per GPU with Value #A, #B, #C\n  2. Organize fields  → hide Time/job/instance, rename Value #A → Temp\n  3. Sort by          → Temp, descending",
        "details": "",
        "flags": [
          [
            "Merge",
            "Combines table results that share label columns into one table (one row per GPU)"
          ],
          [
            "Organize fields by name",
            "Hide, rename and reorder columns"
          ],
          [
            "Join by field",
            "Join time series on a shared field (usually Time)"
          ]
        ],
        "tip": "Instant + Table format + Merge = per-GPU table",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "transformations",
          "merge",
          "organize",
          "table",
          "reduce",
          "join"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-flags-5",
    "badge": "pnl",
    "title": "Grafana Panels: More options",
    "subtitle": "More options for: Transformations: reshape query results in Grafana",
    "commands": [
      {
        "id": "grafana-transformations-flags-card",
        "desc": "More options and gotchas for: Transformations: reshape query results in Grafana",
        "cmd": "Per-GPU table from several instant queries:\n  Query A: DCGM_FI_DEV_GPU_TEMP_CELSIUS     (Format: Table, Type: Instant)\n  Query B: DCGM_FI_DEV_BOARD_POWER_WATTS  (Format: Table, Type: Instant)\n  Query C: DCGM_FI_DEV_GPU_UTIL_RATIO     (Format: Table, Type: Instant)\nTransformations:\n  1. Merge            → one row per GPU with Value #A, #B, #C\n  2. Organize fields  → hide Time/job/instance, rename Value #A → Temp\n  3. Sort by          → Temp, descending",
        "hideCode": true,
        "flags": [
          [
            "Reduce",
            "Turn each series into one row: Last, Max, Mean… (good for 'max temp in range' tables)"
          ],
          [
            "Filter data by values",
            "Keep only rows where Temp > 80, for a 'problems only' table"
          ],
          [
            "Order matters",
            "Transformations run top to bottom; use the debug (bug icon) view to see the data after each step"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "transformations",
          "merge",
          "organize"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-cmd-6",
    "badge": "pnl",
    "title": "Grafana Panels: Data links",
    "subtitle": "Data links: click a node in an overview panel to open its detail dashboard",
    "commands": [
      {
        "id": "grafana-data-links",
        "desc": "Data links: click a node in an overview panel to open its detail dashboard",
        "cmd": "/d/<node-dashboard-uid>/node-detail?var-host=${__field.labels.hostname}&${__url_time_range}",
        "details": "",
        "flags": [
          [
            "${__field.labels.hostname}",
            "The hostname label of the series that was clicked"
          ],
          [
            "${__url_time_range}",
            "Carries the current from/to time range to the target dashboard"
          ],
          [
            "${__value.raw}",
            "The raw value of the clicked point"
          ]
        ],
        "tip": "Overview → click → detail is the classic layout",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "data links",
          "drilldown",
          "url",
          "kiosk",
          "variables"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-flags-6",
    "badge": "pnl",
    "title": "Grafana Panels: More options",
    "subtitle": "More options for: Data links: click a node in an overview panel to open its detail dashboard",
    "commands": [
      {
        "id": "grafana-data-links-flags-card",
        "desc": "More options and gotchas for: Data links: click a node in an overview panel to open its detail dashboard",
        "cmd": "/d/<node-dashboard-uid>/node-detail?var-host=${__field.labels.hostname}&${__url_time_range}",
        "hideCode": false,
        "flags": [
          [
            "Where",
            "Edit panel → Data links and actions → Add link; type $ in the URL box to get a list of variables"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "data links",
          "drilldown",
          "url"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-recipes-6",
    "badge": "pnl",
    "title": "Grafana Panels: Related commands",
    "subtitle": "Related commands for: Data links: click a node in an overview panel to open its detail dashboard",
    "commands": [
      {
        "id": "grafana-data-links-sub-1",
        "desc": "Dashboard URL with a multi-value variable and a time range",
        "cmd": "/d/<uid>/<slug>?var-host=gpu-node01&var-host=gpu-node02&from=now-6h&to=now",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "data links",
          "drilldown",
          "url"
        ]
      },
      {
        "id": "grafana-data-links-sub-2",
        "desc": "Auto-refresh and hide the chrome: ready for a NOC wall screen",
        "cmd": "&refresh=30s&kiosk",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "data links",
          "drilldown",
          "url"
        ]
      }
    ]
  },
  {
    "id": "grafana-panels-pro-tips",
    "badge": "tip",
    "title": "Grafana Panels: Pro Tip",
    "subtitle": "Design rules for a dashboard people actually use",
    "commands": [
      {
        "id": "grafana-panels-tips-card",
        "desc": "Design rules for a dashboard people actually use",
        "cmd": "Top row: is anything wrong? → Middle: where? → Bottom: why?",
        "details": "Put red/green summary stats at the top (GPUs down, XID errors, hot GPUs), sortable tables or heatmaps in the middle to find the node, and detailed time series at the bottom or behind a data link.",
        "flags": [
          [
            "One question per panel",
            "If a title needs 'and', split the panel"
          ],
          [
            "Same units, same colors",
            "Green/orange/red mean the same thing on every panel"
          ],
          [
            "Repeat, don't copy",
            "Use a variable + repeat instead of 8 hand-copied per-node panels"
          ],
          [
            "Text panel",
            "Add a short 'how to read this / runbook link' panel at the top"
          ]
        ],
        "tip": "Summary → where → why",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("grafana-panels_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = GRAF_GRAFANA_PANELS_DATA;
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

  for (const card of GRAF_GRAFANA_PANELS_DATA) {
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
        localStorage.setItem("grafana-panels_bookmarks", JSON.stringify([...state.bookmarks]));
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
