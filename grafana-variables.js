// grafana-variables.js
// Standalone interactive cheat sheet for Grafana: Grafana Variables: Dropdowns, Chaining & Repeating Panels
const GRAF_GRAFANA_VARIABLES_DATA = [
  {
    "id": "grafana-variables-cmd-1",
    "badge": "var",
    "title": "Grafana Variables: A host dropdown filled from Prometheus labels",
    "subtitle": "A host dropdown filled from Prometheus labels (Dashboard settings → Variables → New)",
    "commands": [
      {
        "id": "grafana-query-variable",
        "desc": "A host dropdown filled from Prometheus labels (Dashboard settings → Variables → New)",
        "cmd": "label_values(DCGM_FI_DEV_GPU_TEMP_CELSIUS, hostname)",
        "details": "",
        "flags": [
          [
            "Variable type: Query",
            "Values come from the data source; the query above lists every hostname that has GPU metrics"
          ],
          [
            "Query type",
            "Typing label_values() is the Classic query type, which Grafana's docs mark deprecated. The same list without it: Query type = Label values, Label = hostname, Metric = DCGM_FI_DEV_GPU_TEMP_CELSIUS"
          ],
          [
            "Name: host",
            "Use it in queries as $host: DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~\"$host\"}"
          ],
          [
            "Multi-value + Include All",
            "Lets people pick several hosts or All; then always use =~ (regex match), never ="
          ],
          [
            "Refresh: On time range change",
            "Picks up nodes that joined since the dashboard was opened"
          ],
          [
            "Custom all value: .*",
            "Without it, All sends a regex of every host, which gets slow and long on big fleets"
          ]
        ],
        "tip": "Multi-value variables need =~ not =",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "variables",
          "templating",
          "label_values",
          "dropdown",
          "query variable"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/add-template-variables/",
              "title": "Grafana: add variables"
            }
          ],
          "note": "Added 2026-11-10: typed label_values() is the Classic query type, which the Prometheus variables page marks deprecated."
        }
      },
      {
        "id": "grafana-query-variable-sub-1",
        "desc": "Every label name in the data source (Classic query; the Label names query type does the same)",
        "cmd": "label_names()",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "variables",
          "templating",
          "label_values"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/add-template-variables/",
              "title": "Grafana: add variables"
            }
          ],
          "note": "Added 2026-11-10: typed label_values() is the Classic query type, which the Prometheus variables page marks deprecated."
        }
      },
      {
        "id": "grafana-query-variable-sub-2",
        "desc": "Values of a label across all metrics (slower than naming a metric)",
        "cmd": "label_values(hostname)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "variables",
          "templating",
          "label_values"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/add-template-variables/",
              "title": "Grafana: add variables"
            }
          ],
          "note": "Added 2026-11-10: typed label_values() is the Classic query type, which the Prometheus variables page marks deprecated."
        }
      },
      {
        "id": "grafana-query-variable-sub-3",
        "desc": "Values from any PromQL result; pair with a Regex such as /hostname=\"([^\"]+)\"/",
        "cmd": "query_result(topk(5, max by (hostname) (DCGM_FI_DEV_GPU_TEMP_CELSIUS)))",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "variables",
          "templating",
          "label_values"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/add-template-variables/",
              "title": "Grafana: add variables"
            }
          ],
          "note": "Added 2026-11-10: typed label_values() is the Classic query type, which the Prometheus variables page marks deprecated."
        }
      }
    ]
  },
  {
    "id": "grafana-variables-cmd-2",
    "badge": "var",
    "title": "Grafana Variables: Chained variables",
    "subtitle": "Chained variables: the GPU dropdown only shows GPUs on the selected hosts",
    "commands": [
      {
        "id": "grafana-chained-variable",
        "desc": "Chained variables: the GPU dropdown only shows GPUs on the selected hosts",
        "cmd": "label_values(DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~\"$host\"}, gpu)",
        "details": "",
        "flags": [
          [
            "$host inside the query",
            "This variable is re-queried whenever host changes"
          ],
          [
            "Order",
            "Variables evaluate top to bottom in the settings list; a chained variable must come after the one it uses"
          ],
          [
            "Panel query",
            "DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~\"$host\", gpu=~\"$gpu\"}"
          ],
          [
            "Regex field",
            "/^gpu-node(\\d+)$/ in the variable's Regex box would keep only the number; leave empty to keep full names"
          ]
        ],
        "tip": "Order variables parent first",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "variables",
          "chained",
          "dependent",
          "filter",
          "gpu"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/add-template-variables/",
              "title": "Grafana: add variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-variables-cmd-3",
    "badge": "var",
    "title": "Grafana Variables: The same host variable as dashboard JSON",
    "subtitle": "The same host variable as dashboard JSON (templating.list)",
    "commands": [
      {
        "id": "grafana-variable-json",
        "desc": "The same host variable as dashboard JSON (templating.list)",
        "cmd": "\"templating\": {\n  \"list\": [\n    {\n      \"name\": \"host\",\n      \"label\": \"Host\",\n      \"type\": \"query\",\n      \"datasource\": { \"type\": \"prometheus\", \"uid\": \"prometheus\" },\n      \"query\": { \"query\": \"label_values(DCGM_FI_DEV_GPU_TEMP_CELSIUS, hostname)\" },\n      \"refresh\": 2,\n      \"multi\": true,\n      \"includeAll\": true,\n      \"allValue\": \".*\",\n      \"sort\": 1\n    }\n  ]\n}",
        "details": "",
        "flags": [
          [
            "refresh",
            "1 = on dashboard load, 2 = on time range change"
          ],
          [
            "sort",
            "1 = alphabetical ascending; 3 = numerical ascending (gpu-node2 before gpu-node10 needs natural sort, 7)"
          ],
          [
            "datasource.uid",
            "Matches the provisioned data source UID; that is why a fixed UID matters"
          ],
          [
            "Schema note",
            "This is the classic JSON model; Grafana 13 stores dashboards in the v2 schema and converts classic JSON on load"
          ]
        ],
        "tip": "refresh 2 picks up new nodes",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "variables",
          "json",
          "templating",
          "schema"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/view-dashboard-json-model/",
              "title": "Grafana: dashboard JSON model"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/types/templateVars.ts",
              "title": "Grafana source: variable sort/refresh values"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/add-template-variables/",
              "title": "Grafana: add variables"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-variables-cmd-4",
    "badge": "var",
    "title": "Grafana Variables: Format a multi-value variable for where it is used",
    "subtitle": "Format a multi-value variable for where it is used",
    "commands": [
      {
        "id": "grafana-variable-formats",
        "desc": "Format a multi-value variable for where it is used",
        "cmd": "${host:regex}",
        "details": "",
        "flags": [
          [
            "${host:regex}",
            "node01|node02 with regex characters escaped: for =~ in PromQL"
          ],
          [
            "${host:pipe}",
            "node01|node02 without escaping"
          ],
          [
            "${host:csv}",
            "node01,node02: for SQL IN (...) lists or APIs"
          ],
          [
            "${host:json}",
            "[\"node01\",\"node02\"]"
          ],
          [
            "${host:queryparam}",
            "var-host=node01&var-host=node02: for links to another dashboard"
          ],
          [
            "${host:text}",
            "The display text instead of the value"
          ]
        ],
        "tip": "Links to other dashboards: ${var:queryparam}",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "variables",
          "format",
          "regex",
          "csv",
          "queryparam",
          "interpolation"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/variable-syntax/",
              "title": "Grafana: variable syntax"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-variables-cmd-5",
    "badge": "var",
    "title": "Grafana Variables: Repeat a panel or row once per selected host",
    "subtitle": "Repeat a panel or row once per selected host",
    "commands": [
      {
        "id": "grafana-repeat-panels",
        "desc": "Repeat a panel or row once per selected host",
        "cmd": "\"repeat\": \"host\",\n\"repeatDirection\": \"h\",\n\"maxPerRow\": 4",
        "details": "",
        "flags": [
          [
            "Where in the UI",
            "Edit panel → Panel options → Repeat options → Repeat by variable: host"
          ],
          [
            "Inside the panel query",
            "Use $host as normal; each copy gets one value"
          ],
          [
            "repeatDirection",
            "h = side by side (wraps after maxPerRow), v = stacked"
          ],
          [
            "Repeat a row",
            "Put several panels in a row and repeat the row: one block of panels per node"
          ],
          [
            "Title",
            "Use $host in the title so each copy is labeled"
          ]
        ],
        "tip": "Repeat rows, not copy-pasted panels",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "repeat",
          "rows",
          "variables",
          "per node",
          "layout"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-panel-options/",
              "title": "Grafana: panel options (repeat)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/view-dashboard-json-model/",
              "title": "Grafana: dashboard JSON model"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-variables-cmd-6",
    "badge": "var",
    "title": "Grafana Variables: Built-in variables you can use in any query or title",
    "subtitle": "Built-in variables you can use in any query or title",
    "commands": [
      {
        "id": "grafana-builtin-variables",
        "desc": "Built-in variables you can use in any query or title",
        "cmd": "$__interval  $__rate_interval  $__range  $__from  $__to  $__dashboard  $__user.login",
        "details": "",
        "flags": [
          [
            "$__interval",
            "Time per data point for the current zoom; changes as you zoom"
          ],
          [
            "$__rate_interval",
            "Safe window for rate()/increase(): at least 4 × scrape interval"
          ],
          [
            "$__range",
            "Length of the selected time range (6h, 7d…)"
          ],
          [
            "$__from / $__to",
            "Range start/end in epoch ms; ${__from:date:iso} formats it"
          ],
          [
            "Interval variable type",
            "A dropdown of windows (1m, 5m, 1h) the user can pick, used as [$window]"
          ]
        ],
        "tip": "Use $__rate_interval for every rate()",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "variables",
          "builtin",
          "interval",
          "range",
          "rate_interval"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/built-in-variables/",
              "title": "Grafana: built-in variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/add-template-variables/",
              "title": "Grafana: add variables"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-variables-pro-tips",
    "badge": "tip",
    "title": "Grafana Variables: Pro Tip",
    "subtitle": "Variables turn 50 dashboards into one",
    "commands": [
      {
        "id": "grafana-variables-tips-card",
        "desc": "Variables turn 50 dashboards into one",
        "cmd": "Host ▾  GPU ▾  →  every panel filters with {hostname=~\"$host\", gpu=~\"$gpu\"}",
        "details": "Build one 'GPU node' dashboard driven by host and gpu variables instead of a dashboard per node. Linked from the fleet overview with a data link, it becomes the drill-down for any node.",
        "flags": [
          [
            "Hidden variables",
            "Set Hide = Variable for helper variables people should not change"
          ],
          [
            "Constants",
            "A constant variable for a cluster name or job keeps queries short and editable in one place"
          ]
        ],
        "tip": "One templated dashboard per kind of thing",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/add-template-variables/",
              "title": "Grafana: add variables"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("grafana-variables_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = GRAF_GRAFANA_VARIABLES_DATA;
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

  for (const card of GRAF_GRAFANA_VARIABLES_DATA) {
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
        localStorage.setItem("grafana-variables_bookmarks", JSON.stringify([...state.bookmarks]));
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
