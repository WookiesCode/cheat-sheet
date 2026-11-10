// prometheus.js
// Standalone interactive cheat sheet for SRE toolkit: Prometheus & Alertmanager: Rules, Queries, Silences
const SRE_PROMETHEUS_DATA = [
  {
    "id": "prometheus-cmd-1",
    "badge": "prometheus",
    "title": "Prometheus: Validate the config and rule files before reloading",
    "subtitle": "Validate the config and rule files before reloading",
    "commands": [
      {
        "id": "prom-check",
        "desc": "Validate the config and rule files before reloading",
        "cmd": "promtool check config /etc/prometheus/prometheus.yml",
        "details": "",
        "flags": [
          [
            "check config",
            "Config plus every rule file it references"
          ],
          [
            "check rules <files>",
            "Rule files alone"
          ],
          [
            "--lint=all",
            "Extra checks (duplicate rules, too-long scrape interval)"
          ],
          [
            "--lint-fatal",
            "Make lint findings fail the check (for CI)"
          ],
          [
            "test rules <test.yml>",
            "Unit-test alerting rules against fake series"
          ]
        ],
        "tip": "Run check config in CI so a typo never reaches the server",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "prometheus",
          "promtool",
          "check",
          "rules",
          "ci"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/",
              "title": "Prometheus: unit testing rules"
            }
          ]
        }
      },
      {
        "id": "prom-check-sub-1",
        "desc": "Rules only",
        "cmd": "promtool check rules /etc/prometheus/rules/*.yml",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recipe",
          "prometheus",
          "promtool",
          "check"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/",
              "title": "Prometheus: unit testing rules"
            }
          ]
        }
      },
      {
        "id": "prom-check-sub-2",
        "desc": "Run rule unit tests",
        "cmd": "promtool test rules tests/gpu-alerts-test.yml",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recipe",
          "prometheus",
          "promtool",
          "check"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/",
              "title": "Prometheus: unit testing rules"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "prometheus-cmd-2",
    "badge": "prometheus",
    "title": "Prometheus: Query from the shell",
    "subtitle": "Query from the shell (instant query)",
    "commands": [
      {
        "id": "prom-query",
        "desc": "Query from the shell (instant query)",
        "cmd": "promtool query instant http://localhost:9090 'up == 0'",
        "details": "",
        "flags": [
          [
            "query instant <server> <expr>",
            "Value now; --time for another moment"
          ],
          [
            "query range --start --end --step",
            "A time range"
          ],
          [
            "-o json",
            "JSON output for jq"
          ],
          [
            "HTTP API",
            "GET /api/v1/query?query=… is the same thing for curl"
          ]
        ],
        "tip": "up == 0 is the first query in any monitoring incident",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "promql",
          "query",
          "api",
          "targets",
          "curl"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/management_api/",
              "title": "Prometheus management API"
            }
          ]
        }
      },
      {
        "id": "prom-query-sub-1",
        "desc": "Same query with curl and jq",
        "cmd": "curl -s http://localhost:9090/api/v1/query --data-urlencode 'query=up == 0' | jq '.data.result[].metric.instance'",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recipe",
          "promql",
          "query",
          "api"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/management_api/",
              "title": "Prometheus management API"
            }
          ]
        }
      },
      {
        "id": "prom-query-sub-2",
        "desc": "Targets that are not being scraped",
        "cmd": "curl -s 'http://localhost:9090/api/v1/targets?state=active' | jq -r '.data.activeTargets[] | select(.health != \"up\") | .scrapeUrl'",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recipe",
          "promql",
          "query",
          "api"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/management_api/",
              "title": "Prometheus management API"
            }
          ]
        }
      },
      {
        "id": "prom-query-sub-3",
        "desc": "Ready to answer queries? (/-/healthy is always 200)",
        "cmd": "curl -s http://localhost:9090/-/ready",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recipe",
          "promql",
          "query",
          "api"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/management_api/",
              "title": "Prometheus management API"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "prometheus-cmd-3",
    "badge": "prometheus",
    "title": "Prometheus: An alerting rule",
    "subtitle": "An alerting rule (YAML)",
    "commands": [
      {
        "id": "prom-alert-rule",
        "desc": "An alerting rule (YAML)",
        "cmd": "groups:\n  - name: node\n    rules:\n      - alert: NodeExporterDown\n        expr: up{job=\"node\"} == 0\n        for: 5m\n        keep_firing_for: 5m\n        labels:\n          severity: page\n        annotations:\n          summary: \"{{ $labels.instance }} is not being scraped\"",
        "details": "",
        "flags": [
          [
            "for: 5m",
            "Must be true for 5 minutes before it fires: filters blips"
          ],
          [
            "keep_firing_for",
            "Keep firing this long after it clears (stops flapping)"
          ],
          [
            "labels.severity",
            "What Alertmanager routes on"
          ],
          [
            "annotations",
            "Human text; {{ $labels.x }} inserts a label"
          ]
        ],
        "tip": "Every paging alert needs a runbook link in its annotations",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "alerting",
          "rules",
          "yaml",
          "for",
          "severity"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/",
              "title": "Prometheus: alerting rules"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "prometheus-cmd-4",
    "badge": "prometheus",
    "title": "Prometheus: A recording rule and its naming convention",
    "subtitle": "A recording rule and its naming convention",
    "commands": [
      {
        "id": "prom-recording",
        "desc": "A recording rule and its naming convention",
        "cmd": "groups:\n  - name: gpu\n    rules:\n      - record: instance:dcgm_fi_dev_gpu_util:avg\n        expr: avg by (instance) (DCGM_FI_DEV_GPU_UTIL)",
        "details": "",
        "flags": [
          [
            "level:metric:operations",
            "The documented naming form: aggregation level, metric, operations (newest first)"
          ],
          [
            "Valid metric name",
            "The record name must be a valid metric name"
          ],
          [
            "Why",
            "Precompute expensive queries that dashboards run every refresh"
          ],
          [
            "DCGM names",
            "dcgm-exporter 4.9.0 renamed metrics: check yours (Grafana suite)"
          ]
        ],
        "tip": "Use the recorded series in dashboards and alerts, not the raw expression",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recording",
          "rules",
          "naming",
          "dcgm"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/",
              "title": "Prometheus: recording rules"
            },
            {
              "url": "https://prometheus.io/docs/practices/rules/",
              "title": "Prometheus: recording rule naming"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "prometheus-cmd-5",
    "badge": "prometheus",
    "title": "Prometheus: Alertmanager",
    "subtitle": "Alertmanager: check config, list alerts, silence",
    "commands": [
      {
        "id": "prom-amtool",
        "desc": "Alertmanager: check config, list alerts, silence",
        "cmd": "amtool alert query --alertmanager.url=http://localhost:9093",
        "details": "",
        "flags": [
          [
            "check-config <file>",
            "Validate alertmanager.yml"
          ],
          [
            "alert query [matchers]",
            "Firing alerts, for example alertname=\"NodeExporterDown\""
          ],
          [
            "silence add <matchers>",
            "Create a silence (changes state); check amtool silence add --help for duration and comment flags"
          ],
          [
            "silence query",
            "Active silences"
          ],
          [
            "silence expire <id>",
            "End a silence early (changes state)"
          ],
          [
            "Matchers",
            "=, !=, =~, !~, for example instance=~\"node0[1-4].*\""
          ]
        ],
        "tip": "Silence the drained node, not the alert name, during maintenance",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "alertmanager",
          "amtool",
          "silence",
          "routes"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/prometheus/alertmanager#amtool",
              "title": "Alertmanager README: amtool"
            }
          ]
        }
      },
      {
        "id": "prom-amtool-sub-1",
        "desc": "Validate before reload",
        "cmd": "amtool check-config /etc/alertmanager/alertmanager.yml",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recipe",
          "alertmanager",
          "amtool",
          "silence"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/prometheus/alertmanager#amtool",
              "title": "Alertmanager README: amtool"
            }
          ]
        }
      },
      {
        "id": "prom-amtool-sub-2",
        "desc": "What is silenced right now",
        "cmd": "amtool silence query --alertmanager.url=http://localhost:9093",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recipe",
          "alertmanager",
          "amtool",
          "silence"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/prometheus/alertmanager#amtool",
              "title": "Alertmanager README: amtool"
            }
          ]
        }
      },
      {
        "id": "prom-amtool-sub-3",
        "desc": "Show the routing tree",
        "cmd": "amtool config routes --alertmanager.url=http://localhost:9093",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recipe",
          "alertmanager",
          "amtool",
          "silence"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/prometheus/alertmanager#amtool",
              "title": "Alertmanager README: amtool"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "prometheus-cmd-6",
    "badge": "prometheus",
    "title": "Prometheus: Reload the config after a check",
    "subtitle": "Reload the config after a check",
    "commands": [
      {
        "id": "prom-reload",
        "desc": "Reload the config after a check",
        "cmd": "curl -X POST http://localhost:9090/-/reload",
        "details": "",
        "flags": [
          [
            "--web.enable-lifecycle",
            "Required for /-/reload; off by default"
          ],
          [
            "SIGHUP",
            "The other way to reload: systemctl reload prometheus, or kill -HUP"
          ],
          [
            "Check first",
            "promtool check config, then reload"
          ],
          [
            "Alertmanager 0.34.2+",
            "No CORS headers by default any more; --web.cors.origin restores them"
          ]
        ],
        "tip": "A failed reload keeps the old config; check the log for the error",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "reload",
          "lifecycle",
          "config",
          "sighup"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/management_api/",
              "title": "Prometheus management API"
            },
            {
              "url": "https://github.com/prometheus/alertmanager/blob/main/CHANGELOG.md",
              "title": "Alertmanager changelog"
            }
          ],
          "note": "The CORS change is in Alertmanager 0.34.2 (Oct 29, 2026); 0.35.0 is current."
        }
      },
      {
        "id": "prom-reload-sub-1",
        "desc": "The config Prometheus actually loaded",
        "cmd": "curl -s http://localhost:9090/api/v1/status/config | jq -r .data.yaml | head",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "recipe",
          "reload",
          "lifecycle",
          "config"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/management_api/",
              "title": "Prometheus management API"
            },
            {
              "url": "https://github.com/prometheus/alertmanager/blob/main/CHANGELOG.md",
              "title": "Alertmanager changelog"
            }
          ],
          "note": "The CORS change is in Alertmanager 0.34.2 (Oct 29, 2026); 0.35.0 is current."
        }
      }
    ]
  },
  {
    "id": "prometheus-pro-tips",
    "badge": "tip",
    "title": "Prometheus: Pro Tip",
    "subtitle": "Export your own metrics with the node_exporter textfile collector",
    "commands": [
      {
        "id": "prometheus-tips-card",
        "desc": "Export your own metrics with the node_exporter textfile collector",
        "cmd": "echo \"gpu_burnin_last_success_timestamp $(date +%s)\" > /var/lib/node_exporter/textfile/burnin.prom.$$ && mv /var/lib/node_exporter/textfile/burnin.prom.$$ /var/lib/node_exporter/textfile/burnin.prom",
        "details": "Start node_exporter with --collector.textfile.directory=/var/lib/node_exporter/textfile. It reads every *.prom file in that directory. Write to a temporary name and mv it into place, so a scrape never sees a half-written file. Timestamps inside the file are not supported.",
        "flags": [
          [
            "*.prom",
            "Files it reads"
          ],
          [
            "Write then mv",
            "Atomic update"
          ]
        ],
        "tip": "Good for cron jobs: alert when the timestamp gets old",
        "tags": [
          "sre",
          "devops",
          "prometheus",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/prometheus/node_exporter#textfile-collector",
              "title": "node_exporter: textfile collector"
            }
          ],
          "note": "node_exporter's README shows the write-then-mv pattern and says timestamps are not supported."
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("prometheus_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = SRE_PROMETHEUS_DATA;
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

  for (const card of SRE_PROMETHEUS_DATA) {
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
        localStorage.setItem("prometheus_bookmarks", JSON.stringify([...state.bookmarks]));
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
