// grafana-promql.js
// Standalone interactive cheat sheet for Grafana: PromQL for Grafana Dashboards: rate, Aggregation, topk & Joins
const GRAF_GRAFANA_PROMQL_DATA = [
  {
    "id": "grafana-promql-cmd-1",
    "badge": "pql",
    "title": "PromQL for Dashboards: Turn a counter into a per-second rate",
    "subtitle": "Turn a counter into a per-second rate (network throughput in bits/s)",
    "commands": [
      {
        "id": "promql-rate-counter",
        "desc": "Turn a counter into a per-second rate (network throughput in bits/s)",
        "cmd": "sum by (instance) (rate(node_network_receive_bytes_total{device!~\"lo|veth.*|docker.*\"}[$__rate_interval])) * 8",
        "details": "",
        "flags": [
          [
            "Counter (_total)",
            "Only ever goes up (and resets to 0 on restart). Graphing it raw is almost never useful: wrap it in rate()"
          ],
          [
            "rate(x[window])",
            "Average per-second increase over the window; handles counter resets"
          ],
          [
            "$__rate_interval",
            "Grafana picks a window that is at least 4 × the scrape interval, so the graph never has gaps. Use it instead of a fixed [5m] in dashboards"
          ],
          [
            "sum by (instance)",
            "Add up all interfaces per host; every other label is dropped"
          ],
          [
            "* 8",
            "Bytes to bits; then set the panel unit to bps"
          ],
          [
            "!~",
            "Regex does-not-match. =~ and !~ regexes are fully anchored: \"lo\" does not match \"lo0\""
          ]
        ],
        "tip": "_total metric? Wrap it in rate()",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "promql",
          "rate",
          "counter",
          "network",
          "throughput",
          "rate_interval"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/basics/",
              "title": "PromQL basics"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            }
          ]
        }
      },
      {
        "id": "promql-rate-counter-sub-1",
        "desc": "Total errors in the last hour (rate × seconds): nicer for stat panels",
        "cmd": "increase(node_network_receive_errs_total[1h])",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "rate",
          "counter"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/basics/",
              "title": "PromQL basics"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            }
          ]
        }
      },
      {
        "id": "promql-rate-counter-sub-2",
        "desc": "Uses only the last two samples: spiky, only for fast-moving zoomed-in graphs",
        "cmd": "irate(x[$__rate_interval])",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "rate",
          "counter"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/basics/",
              "title": "PromQL basics"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            }
          ]
        }
      },
      {
        "id": "promql-rate-counter-sub-3",
        "desc": "How many times a counter reset (process or node restarts)",
        "cmd": "resets(x[1d])",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "rate",
          "counter"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/basics/",
              "title": "PromQL basics"
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
    "id": "grafana-promql-cmd-2",
    "badge": "pql",
    "title": "PromQL for Dashboards: Aggregate across GPUs and nodes",
    "subtitle": "Aggregate across GPUs and nodes: avg, max, count by label",
    "commands": [
      {
        "id": "promql-aggregation",
        "desc": "Aggregate across GPUs and nodes: avg, max, count by label",
        "cmd": "avg by (hostname) (DCGM_FI_DEV_GPU_UTIL_RATIO)",
        "details": "",
        "flags": [
          [
            "by (labels)",
            "Keep only these labels; everything else is aggregated away"
          ],
          [
            "without (labels)",
            "Keep everything except these labels"
          ],
          [
            "avg / max / min / sum / count",
            "max is often better than avg for health: one hot GPU disappears in an 8-GPU average"
          ],
          [
            "Gauge vs counter",
            "DCGM_FI_DEV_GPU_UTIL_RATIO is a gauge (a current value) so no rate() is needed"
          ]
        ],
        "tip": "Use max for health, avg for capacity",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "promql",
          "aggregation",
          "avg",
          "max",
          "count",
          "by",
          "without"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            }
          ]
        }
      },
      {
        "id": "promql-aggregation-sub-1",
        "desc": "Hottest GPU per node",
        "cmd": "max by (hostname) (DCGM_FI_DEV_GPU_TEMP_CELSIUS)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "aggregation",
          "avg"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            }
          ]
        }
      },
      {
        "id": "promql-aggregation-sub-2",
        "desc": "How many GPUs of each model are reporting",
        "cmd": "count by (modelName) (DCGM_FI_DEV_GPU_TEMP_CELSIUS)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "aggregation",
          "avg"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            }
          ]
        }
      },
      {
        "id": "promql-aggregation-sub-3",
        "desc": "How many GPUs are above 85 °C right now (empty result = none)",
        "cmd": "count(DCGM_FI_DEV_GPU_TEMP_CELSIUS > 85)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "aggregation",
          "avg"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            }
          ]
        }
      },
      {
        "id": "promql-aggregation-sub-4",
        "desc": "Same, but returns 0 instead of 'No data' so a stat panel stays green",
        "cmd": "count(DCGM_FI_DEV_GPU_TEMP_CELSIUS > 85) or vector(0)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "aggregation",
          "avg"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            }
          ]
        }
      },
      {
        "id": "promql-aggregation-sub-5",
        "desc": "Total GPU power of the fleet in kW",
        "cmd": "sum(DCGM_FI_DEV_BOARD_POWER_WATTS) / 1000",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "aggregation",
          "avg"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-promql-cmd-3",
    "badge": "pql",
    "title": "PromQL for Dashboards: Top-N",
    "subtitle": "Top-N: the 10 hottest GPUs right now",
    "commands": [
      {
        "id": "promql-topk",
        "desc": "Top-N: the 10 hottest GPUs right now",
        "cmd": "topk(10, DCGM_FI_DEV_GPU_TEMP_CELSIUS)",
        "details": "",
        "flags": [
          [
            "topk / bottomk",
            "Keep the N highest/lowest series. Use with an Instant query in a table or bar gauge"
          ],
          [
            "In a time series",
            "topk is evaluated at every step, so different GPUs drift in and out; the legend gets confusing over long ranges"
          ],
          [
            "Fixed set over a range",
            "topk(10, max_over_time(DCGM_FI_DEV_GPU_TEMP_CELSIUS[$__range])) with an Instant query: top 10 of the whole visible range"
          ]
        ],
        "tip": "topk + Instant query + table",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "promql",
          "topk",
          "bottomk",
          "top",
          "ranking"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/variables/built-in-variables/",
              "title": "Grafana: built-in variables"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-promql-cmd-4",
    "badge": "pql",
    "title": "PromQL for Dashboards: Functions over a time range",
    "subtitle": "Functions over a time range: max, avg, changes, comparisons with offset",
    "commands": [
      {
        "id": "promql-over-time",
        "desc": "Functions over a time range: max, avg, changes, comparisons with offset",
        "cmd": "max_over_time(DCGM_FI_DEV_GPU_TEMP_CELSIUS[$__range])",
        "details": "",
        "flags": [
          [
            "$__range",
            "The dashboard's whole time range (e.g. 6h); good with Instant queries in stat panels"
          ],
          [
            "avg_over_time / min_over_time / max_over_time",
            "Summarize a gauge over a window"
          ],
          [
            "changes(x[1h])",
            "How many times the value changed: link flaps, clock-event reason flips"
          ],
          [
            "offset 1d",
            "Same query one day earlier, for 'today vs yesterday'"
          ]
        ],
        "tip": "$__range + Instant = one number for the view",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "promql",
          "over_time",
          "offset",
          "changes",
          "range"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/basics/",
              "title": "PromQL basics"
            }
          ]
        }
      },
      {
        "id": "promql-over-time-sub-1",
        "desc": "Power now vs this time yesterday",
        "cmd": "sum(DCGM_FI_DEV_BOARD_POWER_WATTS) - sum(DCGM_FI_DEV_BOARD_POWER_WATTS offset 1d)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "over_time",
          "offset"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/basics/",
              "title": "PromQL basics"
            }
          ]
        }
      },
      {
        "id": "promql-over-time-sub-2",
        "desc": "GPUs averaging under 20% for an hour (idle allocation); the ratio is 0-1, so 20% is 0.2",
        "cmd": "avg_over_time(DCGM_FI_DEV_GPU_UTIL_RATIO[1h]) < 0.2",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "over_time",
          "offset"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/basics/",
              "title": "PromQL basics"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-promql-cmd-5",
    "badge": "pql",
    "title": "PromQL for Dashboards: Is anything missing? Down targets and vanished metrics",
    "subtitle": "Is anything missing? Down targets and vanished metrics",
    "commands": [
      {
        "id": "promql-up-absent",
        "desc": "Is anything missing? Down targets and vanished metrics",
        "cmd": "up == 0",
        "details": "",
        "flags": [
          [
            "up",
            "Prometheus writes up=1 for every successful scrape and up=0 for a failed one, per target"
          ],
          [
            "== 0",
            "A comparison filters: only series where the condition is true remain"
          ],
          [
            "absent(x)",
            "Returns 1 if no series match at all: catches an exporter that disappeared completely"
          ],
          [
            "Why it matters",
            "A crashed dcgm-exporter makes a GPU panel look 'quiet', not broken. Put up == 0 on the dashboard"
          ]
        ],
        "tip": "Silence is not health: graph up == 0",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "promql",
          "up",
          "absent",
          "missing",
          "targets",
          "gpu fell off bus"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/configuration/",
              "title": "Prometheus configuration"
            }
          ]
        }
      },
      {
        "id": "promql-up-absent-sub-1",
        "desc": "Down targets per job",
        "cmd": "count by (job) (up == 0)",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "up",
          "absent"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/configuration/",
              "title": "Prometheus configuration"
            }
          ]
        }
      },
      {
        "id": "promql-up-absent-sub-2",
        "desc": "1 if node01 reports no GPU temperature at all",
        "cmd": "absent(DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=\"gpu-node01\"})",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "up",
          "absent"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/configuration/",
              "title": "Prometheus configuration"
            }
          ]
        }
      },
      {
        "id": "promql-up-absent-sub-3",
        "desc": "Nodes reporting fewer than 8 GPUs (a GPU fell off the bus)",
        "cmd": "count by (hostname) (DCGM_FI_DEV_GPU_TEMP_CELSIUS) < 8",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "up",
          "absent"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/functions/",
              "title": "PromQL functions"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/configuration/",
              "title": "Prometheus configuration"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-promql-cmd-6",
    "badge": "pql",
    "title": "PromQL for Dashboards: Join labels from another metric",
    "subtitle": "Join labels from another metric (add the node name to node_exporter series)",
    "commands": [
      {
        "id": "promql-join-group-left",
        "desc": "Join labels from another metric (add the node name to node_exporter series)",
        "cmd": "rate(node_cpu_seconds_total{mode=\"idle\"}[$__rate_interval]) * on (instance) group_left (nodename) node_uname_info",
        "details": "",
        "flags": [
          [
            "node_uname_info",
            "An 'info' metric: value is always 1, the useful data is in its labels (nodename, release…)"
          ],
          [
            "* on (instance)",
            "Match series from both sides that have the same instance label"
          ],
          [
            "group_left (nodename)",
            "Many-to-one join: copy the nodename label from the right side onto each left series"
          ],
          [
            "Multiply by 1",
            "Because info metrics are 1, the values stay the same; only labels are added"
          ]
        ],
        "tip": "Info metric × group_left = add labels",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "promql",
          "join",
          "group_left",
          "on",
          "labels",
          "info metric"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://github.com/prometheus/node_exporter/blob/master/collector/uname.go",
              "title": "node_exporter uname collector"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-promql-cmd-7",
    "badge": "pql",
    "title": "PromQL for Dashboards: Test a query from the shell before putting it in a panel",
    "subtitle": "Test a query from the shell before putting it in a panel",
    "commands": [
      {
        "id": "promql-test-cli",
        "desc": "Test a query from the shell before putting it in a panel",
        "cmd": "curl -s -G http://127.0.0.1:9090/api/v1/query --data-urlencode 'query=max by (hostname) (DCGM_FI_DEV_GPU_TEMP_CELSIUS)' | jq -r '.data.result[] | \"\\(.metric.hostname)\\t\\(.value[1])\"'",
        "details": "",
        "flags": [
          [
            "-G",
            "Send --data-urlencode as URL query parameters with GET; without -G curl would POST"
          ],
          [
            "--data-urlencode",
            "Escapes spaces, braces and quotes in the PromQL for you"
          ],
          [
            "/api/v1/query",
            "Instant query (one value per series); /api/v1/query_range takes start, end and step"
          ],
          [
            "jq .value[1]",
            "Prometheus returns [timestamp, \"value\"]; the value is a string"
          ]
        ],
        "tip": "Use -G so curl sends a GET",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "promql",
          "curl",
          "api",
          "jq",
          "promtool",
          "test"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://curl.se/docs/manpage.html",
              "title": "curl man page"
            }
          ]
        }
      },
      {
        "id": "promql-test-cli-sub-1",
        "desc": "Same with promtool, if it is installed",
        "cmd": "promtool query instant http://127.0.0.1:9090 'up == 0'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "curl",
          "api"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://curl.se/docs/manpage.html",
              "title": "curl man page"
            }
          ]
        }
      },
      {
        "id": "promql-test-cli-sub-2",
        "desc": "Every value of a label: what a variable dropdown will show",
        "cmd": "curl -s -G http://127.0.0.1:9090/api/v1/label/hostname/values | jq -r '.data[]'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "curl",
          "api"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://curl.se/docs/manpage.html",
              "title": "curl man page"
            }
          ]
        }
      },
      {
        "id": "promql-test-cli-sub-3",
        "desc": "Every label on a metric: shows exactly which labels you can use in by()",
        "cmd": "curl -s -G http://127.0.0.1:9090/api/v1/series --data-urlencode 'match[]=DCGM_FI_DEV_GPU_TEMP_CELSIUS' | jq '.data[0]'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "promql",
          "curl",
          "api"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://curl.se/docs/manpage.html",
              "title": "curl man page"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "grafana-promql-pro-tips",
    "badge": "tip",
    "title": "PromQL for Dashboards: Pro Tip",
    "subtitle": "Find the metric and labels before writing the query",
    "commands": [
      {
        "id": "grafana-promql-tips-card",
        "desc": "Find the metric and labels before writing the query",
        "cmd": "curl -s http://gpu-node01:9400/metrics | grep -v '^#' | cut -d'{' -f1 | sort -u",
        "details": "Exporters list everything they expose on /metrics. Read the # HELP and # TYPE lines: TYPE counter means use rate(), TYPE gauge means use it as is.",
        "flags": [
          [
            "grep -v '^#'",
            "Drop the HELP/TYPE comment lines"
          ],
          [
            "cut -d'{' -f1",
            "Keep only the metric name (everything before the label braces)"
          ],
          [
            "sort -u",
            "One line per metric name"
          ],
          [
            "Grafana Explore",
            "Explore (compass icon) → Metrics browser does the same with clicks"
          ]
        ],
        "tip": "TYPE counter → rate(); gauge → as is",
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
              "url": "https://prometheus.io/docs/instrumenting/exposition_formats/",
              "title": "Prometheus exposition formats"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/explore/",
              "title": "Grafana: Explore"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("grafana-promql_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = GRAF_GRAFANA_PROMQL_DATA;
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

  for (const card of GRAF_GRAFANA_PROMQL_DATA) {
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
        localStorage.setItem("grafana-promql_bookmarks", JSON.stringify([...state.bookmarks]));
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
