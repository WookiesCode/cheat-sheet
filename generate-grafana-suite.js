// generate-grafana-suite.js
// Generates the Grafana suite: a hub (grafana.html) plus 6 sheets on building dashboards,
// and inserts the Grafana dropdown into the nav of every HTML sheet.
//
// Facts checked 2026-11-07 against official sources: Grafana 13.x (13.0 GA April 2026;
// dynamic dashboards and the v2 dashboard schema are the default, older JSON is migrated
// on load), Git Sync GA in 13, `grafanactl` replaced by `gcx` (repo archived 2026-06-01),
// dashboard HTTP API POST /api/dashboards/db, dcgm-exporter on port 9400.
// DCGM metric names are the dcgm-exporter 4.9.0 defaults (renamed to DCGM 4.7 names with
// unit suffixes; utilization is a 0-1 ratio, memory in bytes); the GPU sheet maps the
// pre-4.9 names. Labels per NVIDIA's exporter metrics page: gpu, UUID, pci_bus_id,
// device, modelName, hostname (lowercase since 4.6.0).
//
// Nav icon: official Grafana mark (Simple Icons 15.0.0, CC0) in Grafana orange.
//
// Re-runnable: sheet .js files are rewritten every run; .html files are only created when
// missing (existing pages own their chrome); the nav dropdown is replaced if present.
const fs = require('fs');
const path = require('path');
const { mergeCommandCards } = require('./generate-card-utils');

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 1. Section data. Each section becomes one sheet. `group` picks the nav column.
const GRAFANA_SECTIONS = [
  // ---------------------------------------------------------------- BUILD
  {
    id: "grafana-setup", group: "build", file: "grafana-setup", badge: "lab", code: "lab",
    name: "Grafana Lab Setup", navDesc: "run Grafana, Prometheus, data sources",
    title: "Grafana Lab Setup: Grafana, Prometheus & Data Sources",
    subtitle: "Stand up a local Grafana + Prometheus lab, point Prometheus at your exporters, and connect the data source",
    commands: [
      {
        id: "grafana-compose-lab",
        desc: "compose.yaml for a local Grafana + Prometheus lab (bound to 127.0.0.1)",
        cmd: `services:
  prometheus:
    image: prom/prometheus:latest
    ports: ["127.0.0.1:9090:9090"]
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prom-data:/prometheus
  grafana:
    image: grafana/grafana:13.2.4
    ports: ["127.0.0.1:3000:3000"]
    environment:
      GF_SECURITY_ADMIN_PASSWORD__FILE: /run/secrets/grafana_admin
    secrets: [grafana_admin]
    volumes:
      - grafana-data:/var/lib/grafana
      - ./provisioning:/etc/grafana/provisioning:ro
      - ./dashboards:/var/lib/grafana/dashboards:ro
secrets:
  grafana_admin:
    file: ./grafana_admin.txt   # chmod 600, keep out of git
volumes:
  prom-data:
  grafana-data:`,
        flags: [
          ["127.0.0.1:3000:3000", "Publish only on loopback. Reach it from your laptop with ssh -L 3000:127.0.0.1:3000 <jumpbox> instead of opening the port to the network"],
          ["GF_SECURITY_ADMIN_PASSWORD__FILE", "Any Grafana setting can come from an env var GF_<SECTION>_<KEY>; the __FILE suffix reads the value from a file, so the password never appears in compose.yaml or docker inspect"],
          ["grafana-data volume", "Holds grafana.db (users, UI-made dashboards, API keys). Lose the volume and you lose everything not provisioned from files"],
          ["./provisioning", "Data sources and dashboard providers as YAML, loaded at startup (see the cards below)"],
          ["image tag", "Pin a version (13.2.4 was current on 2026-11-07); check the Grafana releases page before upgrading"]
        ],
        subcommands: [
          ["docker compose up -d", "Start the lab in the background (changes state)"],
          ["docker compose ps", "Both services should show running / healthy"],
          ["docker compose logs --tail 50 grafana", "Startup errors: provisioning YAML mistakes show up here"],
          ["curl -s http://127.0.0.1:3000/api/health | jq", "Grafana is up when database is \"ok\"; also shows the version"]
        ],
        tip: "Bind to 127.0.0.1, tunnel with ssh -L",
        tags: ["compose", "docker", "install", "lab", "prometheus", "secrets"]
      },
      {
        id: "prometheus-scrape-config",
        desc: "prometheus.yml: scrape node_exporter (9100) and dcgm-exporter (9400) on your nodes",
        cmd: `global:
  scrape_interval: 15s
scrape_configs:
  - job_name: node
    static_configs:
      - targets: ['gpu-node01:9100', 'gpu-node02:9100']
  - job_name: dcgm
    static_configs:
      - targets: ['gpu-node01:9400', 'gpu-node02:9400']`,
        flags: [
          ["scrape_interval: 15s", "How often Prometheus pulls /metrics. Grafana needs to know this value too (timeInterval on the data source) so $__rate_interval is right"],
          ["job_name", "Becomes the job label on every series, so you can filter with {job=\"dcgm\"}"],
          ["targets", "host:port pairs. node_exporter listens on 9100, dcgm-exporter on 9400 by default"],
          ["YAML indentation", "Spaces only, never tabs. A list item (-) under static_configs must line up exactly or Prometheus refuses to start"],
          ["file_sd_configs", "For a fleet, keep targets in a separate JSON/YAML file Prometheus re-reads on change, instead of editing this file"]
        ],
        subcommands: [
          ["promtool check config prometheus.yml", "Validate the file before restarting Prometheus"],
          ["curl -s http://127.0.0.1:9090/api/v1/targets | jq -r '.data.activeTargets[] | \"\\(.health)\\t\\(.labels.job)\\t\\(.scrapeUrl)\"'", "List every target and whether its last scrape worked (up / down)"],
          ["curl -s http://gpu-node01:9400/metrics | grep -m5 -E '^DCGM_FI_DEV_GPU_TEMP(_CELSIUS)?\\{'", "Check the exporter directly on a node before blaming Prometheus or Grafana (matches old and new metric names)"]
        ],
        tip: "No data in Grafana? Check Prometheus targets first",
        tags: ["prometheus", "scrape", "targets", "node_exporter", "dcgm-exporter", "yaml"]
      },
      {
        id: "grafana-datasource-provisioning",
        desc: "Provision the Prometheus data source from YAML (provisioning/datasources/prometheus.yaml)",
        cmd: `apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    uid: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    jsonData:
      timeInterval: 15s`,
        flags: [
          ["uid: prometheus", "A fixed, readable UID. Dashboards reference the data source by UID, so a fixed one keeps dashboard JSON portable between Grafana instances"],
          ["access: proxy", "The Grafana server makes the request (the browser never talks to Prometheus directly)"],
          ["url", "Resolved from inside the Grafana container: in compose, the service name prometheus works; from the host it would be 127.0.0.1:9090"],
          ["jsonData.timeInterval", "Set to your scrape_interval. Grafana uses it as the minimum step and to compute $__rate_interval"],
          ["Changed it in the UI?", "Provisioned data sources are read-only in the UI; edit the YAML and restart Grafana"]
        ],
        subcommands: [
          ["docker compose restart grafana", "Reload provisioning files (changes state)"],
          ["curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/datasources\" | jq -r '.[] | \"\\(.uid)\\t\\(.type)\\t\\(.name)\"'", "List data sources and their UIDs (needs an admin token)"],
          ["curl -s -G -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/datasources/proxy/uid/prometheus/api/v1/query\" --data-urlencode 'query=up' | jq '.data.result | length'", "Run a query through Grafana's proxy: proves Grafana can reach Prometheus"]
        ],
        tip: "Fixed data source UIDs keep dashboards portable",
        tags: ["datasource", "provisioning", "prometheus", "uid", "yaml"]
      },
      {
        id: "grafana-service-account-token",
        desc: "Create a service account token for API and CLI use, and load it without echoing it",
        cmd: "read -rsp 'Grafana token: ' GRAFANA_TOKEN && export GRAFANA_TOKEN GRAFANA_URL=http://127.0.0.1:3000",
        flags: [
          ["Where to create it", "Administration → Users and access → Service accounts → Add service account (role Editor for dashboards, Admin only if you manage data sources) → Add token"],
          ["read -rsp", "-r keeps backslashes, -s hides typing, -p shows a prompt: the token never lands in shell history or on screen"],
          ["export", "Makes the variable visible to curl and other child processes started from this shell"],
          ["Authorization: Bearer $GRAFANA_TOKEN", "How every API call below authenticates"],
          ["Expiry", "Give tokens an expiry and one service account per tool, so you can revoke one without breaking the rest"]
        ],
        subcommands: [
          ["curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/search?limit=1\" | jq length", "Token works if this prints a number instead of an auth error"],
          ["unset GRAFANA_TOKEN", "Drop the token from this shell when you are done"]
        ],
        tip: "Never paste tokens into commands that get logged",
        tags: ["token", "service account", "api", "auth", "secrets"]
      }
    ],
    proTip: {
      desc: "Lab first: build dashboards against a local copy, ship them as files",
      cmd: "ssh -L 3000:127.0.0.1:3000 <jumpbox>",
      details: "Build and break dashboards in the compose lab, export the JSON, keep it in git, and provision it to the shared Grafana. The tunnel lets your laptop browser reach a Grafana that only listens on the jumpbox's loopback.",
      flags: [
        ["-L 3000:127.0.0.1:3000", "Local port 3000 → the jumpbox's 127.0.0.1:3000; then open http://localhost:3000"],
        ["Why not open the port?", "Grafana with default settings on a datacenter network is an easy target; a tunnel needs no firewall change"]
      ],
      tip: "Lab → JSON in git → provisioned"
    }
  },
  {
    id: "grafana-panels", group: "build", file: "grafana-panels", badge: "pnl", code: "pnl",
    name: "Grafana Panels", navDesc: "first dashboard, visualizations, units, thresholds",
    title: "Grafana Panels: Build a Dashboard, Pick Visualizations, Units & Thresholds",
    subtitle: "The click-path for a first dashboard, which visualization fits which question, and the field settings that make panels readable",
    commands: [
      {
        id: "grafana-first-dashboard",
        desc: "Build your first dashboard: the click-path from empty to saved",
        cmd: `1. Dashboards → New → New dashboard → Add visualization
2. Pick the Prometheus data source
3. Query: avg by (hostname) (DCGM_FI_DEV_GPU_UTIL_RATIO)   → Run queries
4. Legend (Options): {{hostname}}
5. Right pane: Visualization = Time series, Title = GPU utilization
6. Standard options → Unit = Percent (0.0-1.0), Min 0, Max 1
7. Thresholds: 0.8 orange, 0.95 red; Show thresholds = As lines
8. Back to dashboard → drag/resize → Save (Ctrl+S) with a message`,
        flags: [
          ["Code vs Builder", "The query editor has a Builder (clicks) and Code (type PromQL) mode. Builder is a good way to learn PromQL: build it, then switch to Code to read it"],
          ["Legend {{hostname}}", "Text in double braces is replaced by that label's value, so lines are named gpu-node01 instead of a full label set"],
          ["Unit", "Sets axis labels, tooltip formatting and stat values in one place; pick it before anything else. _RATIO metrics are 0-1, so use Percent (0.0-1.0), not Percent (0-100)"],
          ["Save message", "Every save is a version (Dashboard settings → Versions); a message makes rollback easy"],
          ["Grafana 13 layouts", "New dashboards use the v2 schema with auto grid, tabs and conditional rendering; older dashboards are migrated when opened"]
        ],
        subcommands: [
          ["Ctrl+S", "Save the dashboard"],
          ["e (hover a panel)", "Edit that panel"],
          ["v (hover a panel)", "View the panel full screen"],
          ["d k", "Toggle kiosk mode (for wall screens)"],
          ["t z", "Zoom out the time range"],
          ["?", "Show every keyboard shortcut"]
        ],
        tip: "Set the unit before anything else",
        tags: ["dashboard", "panel", "ui", "first", "save", "shortcuts", "beginner"]
      },
      {
        id: "grafana-visualization-choice",
        desc: "Pick the visualization from the question you are answering",
        cmd: `Question                         → Visualization (JSON "type")
How does it change over time?    → Time series   (timeseries)
What is it right now?            → Stat          (stat)
How close to a limit?            → Gauge / Bar gauge (gauge, bargauge)
Which GPU/node is worst?         → Table, sorted (table)
Up/down or OK/fault over time?   → State timeline (state-timeline)
Distribution across many nodes?  → Heatmap       (heatmap)
Notes, runbook links             → Text          (text)`,
        flags: [
          ["Stat", "One big number per series with an optional sparkline. Set Calculation (Last, Max, Mean) under Value options"],
          ["Table", "Use an Instant query with Format = Table: one row per series, one column per label. Best for 'which GPU is hot'"],
          ["State timeline", "Turns numbers into colored bands via value mappings (0 = OK green, >0 = XID red); great for link up/down and error flags"],
          ["Heatmap", "Hundreds of GPUs in one panel: each row a GPU, color = temperature. Spots a single hot GPU faster than 800 lines"],
          ["Avoid", "Pie charts for anything but small parts-of-a-whole; time series with more than ~20 lines (aggregate or use a table)"]
        ],
        tip: "Too many lines? Aggregate, table or heatmap",
        tags: ["visualization", "time series", "stat", "gauge", "table", "heatmap", "state timeline"]
      },
      {
        id: "grafana-fieldconfig-json",
        desc: "Units, min/max, thresholds and value mappings in the panel JSON (fieldConfig.defaults)",
        cmd: `"fieldConfig": {
  "defaults": {
    "unit": "celsius",
    "min": 0,
    "max": 100,
    "decimals": 0,
    "thresholds": {
      "mode": "absolute",
      "steps": [
        { "color": "green",  "value": null },
        { "color": "orange", "value": 80 },
        { "color": "red",    "value": 87 }
      ]
    },
    "mappings": [
      { "type": "value", "options": { "0": { "text": "OK", "color": "green" } } }
    ]
  },
  "overrides": []
}`,
        flags: [
          ["Common unit IDs", "percent (0-100), percentunit (0-1), celsius, watt, bytes, mbytes (MiB), bps (bits/s), Bps (bytes/s), s, ms, short"],
          ["steps[0].value: null", "The first step is the base color for everything below the next threshold; it must be null"],
          ["mode", "absolute = raw values; percentage = percent of min..max"],
          ["mappings", "value (exact match), range (from/to), regex, special (null, NaN, true/false). Mapped text replaces the number"],
          ["Thresholds are examples", "Take temperature and power limits from the vendor spec for your exact GPU/CPU SKU"]
        ],
        subcommands: [
          ["Panel menu → Inspect → Panel JSON", "See and edit exactly this JSON for any panel"],
          ["Panel menu → Inspect → Data", "See the numbers behind the panel (and download CSV)"],
          ["Panel menu → Inspect → Query", "See the exact request sent and the time it took"]
        ],
        tip: "Inspect → Panel JSON shows what the UI set",
        tags: ["fieldconfig", "unit", "thresholds", "mappings", "json", "colors"]
      },
      {
        id: "grafana-overrides",
        desc: "Overrides: different settings for one series or field (e.g. a second unit on the same panel)",
        cmd: `"overrides": [
  {
    "matcher": { "id": "byName", "options": "Power" },
    "properties": [
      { "id": "unit", "value": "watt" },
      { "id": "custom.axisPlacement", "value": "right" }
    ]
  },
  {
    "matcher": { "id": "byRegexp", "options": "/.*gpu-node0[1-4].*/" },
    "properties": [ { "id": "color", "value": { "mode": "fixed", "fixedColor": "purple" } } ]
  }
]`,
        flags: [
          ["byName", "Match one field by its display name (what the legend shows)"],
          ["byRegexp", "Match many fields by a regex on the name"],
          ["byFrameRefID", "Match every field from query A, B, …: handy when query B is a different metric"],
          ["Add in the UI", "Edit panel → Overrides tab → Add field override; the JSON above is the result"]
        ],
        tip: "Second metric, second axis: override on query B",
        tags: ["overrides", "matcher", "axis", "unit", "json"]
      },
      {
        id: "grafana-transformations",
        desc: "Transformations: reshape query results in Grafana (join, rename, filter, calculate)",
        cmd: `Per-GPU table from several instant queries:
  Query A: DCGM_FI_DEV_GPU_TEMP_CELSIUS     (Format: Table, Type: Instant)
  Query B: DCGM_FI_DEV_BOARD_POWER_WATTS  (Format: Table, Type: Instant)
  Query C: DCGM_FI_DEV_GPU_UTIL_RATIO     (Format: Table, Type: Instant)
Transformations:
  1. Merge            → one row per GPU with Value #A, #B, #C
  2. Organize fields  → hide Time/job/instance, rename Value #A → Temp
  3. Sort by          → Temp, descending`,
        flags: [
          ["Merge", "Combines table results that share label columns into one table (one row per GPU)"],
          ["Organize fields by name", "Hide, rename and reorder columns"],
          ["Join by field", "Join time series on a shared field (usually Time)"],
          ["Reduce", "Turn each series into one row: Last, Max, Mean… (good for 'max temp in range' tables)"],
          ["Filter data by values", "Keep only rows where Temp > 80, for a 'problems only' table"],
          ["Order matters", "Transformations run top to bottom; use the debug (bug icon) view to see the data after each step"]
        ],
        tip: "Instant + Table format + Merge = per-GPU table",
        tags: ["transformations", "merge", "organize", "table", "reduce", "join"]
      },
      {
        id: "grafana-data-links",
        desc: "Data links: click a node in an overview panel to open its detail dashboard",
        cmd: "/d/<node-dashboard-uid>/node-detail?var-host=${__field.labels.hostname}&${__url_time_range}",
        flags: [
          ["${__field.labels.hostname}", "The hostname label of the series that was clicked"],
          ["${__url_time_range}", "Carries the current from/to time range to the target dashboard"],
          ["${__value.raw}", "The raw value of the clicked point"],
          ["Where", "Edit panel → Data links and actions → Add link; type $ in the URL box to get a list of variables"]
        ],
        subcommands: [
          ["/d/<uid>/<slug>?var-host=gpu-node01&var-host=gpu-node02&from=now-6h&to=now", "Dashboard URL with a multi-value variable and a time range"],
          ["&refresh=30s&kiosk", "Auto-refresh and hide the chrome: ready for a NOC wall screen"]
        ],
        tip: "Overview → click → detail is the classic layout",
        tags: ["data links", "drilldown", "url", "kiosk", "variables"]
      }
    ],
    proTip: {
      desc: "Design rules for a dashboard people actually use",
      cmd: "Top row: is anything wrong? → Middle: where? → Bottom: why?",
      details: "Put red/green summary stats at the top (GPUs down, XID errors, hot GPUs), sortable tables or heatmaps in the middle to find the node, and detailed time series at the bottom or behind a data link.",
      flags: [
        ["One question per panel", "If a title needs 'and', split the panel"],
        ["Same units, same colors", "Green/orange/red mean the same thing on every panel"],
        ["Repeat, don't copy", "Use a variable + repeat instead of 8 hand-copied per-node panels"],
        ["Text panel", "Add a short 'how to read this / runbook link' panel at the top"]
      ],
      tip: "Summary → where → why"
    }
  },
  {
    id: "grafana-promql", group: "build", file: "grafana-promql", badge: "pql", code: "pql",
    name: "PromQL for Dashboards", navDesc: "rate, sum by, topk, joins, $__rate_interval",
    title: "PromQL for Grafana Dashboards: rate, Aggregation, topk & Joins",
    subtitle: "The PromQL patterns behind most panels: counters with rate(), aggregation by label, top-N, comparisons and label joins",
    commands: [
      {
        id: "promql-rate-counter",
        desc: "Turn a counter into a per-second rate (network throughput in bits/s)",
        cmd: "sum by (instance) (rate(node_network_receive_bytes_total{device!~\"lo|veth.*|docker.*\"}[$__rate_interval])) * 8",
        flags: [
          ["Counter (_total)", "Only ever goes up (and resets to 0 on restart). Graphing it raw is almost never useful: wrap it in rate()"],
          ["rate(x[window])", "Average per-second increase over the window; handles counter resets"],
          ["$__rate_interval", "Grafana picks a window that is at least 4 × the scrape interval, so the graph never has gaps. Use it instead of a fixed [5m] in dashboards"],
          ["sum by (instance)", "Add up all interfaces per host; every other label is dropped"],
          ["* 8", "Bytes to bits; then set the panel unit to bps"],
          ["!~", "Regex does-not-match. =~ and !~ regexes are fully anchored: \"lo\" does not match \"lo0\""]
        ],
        subcommands: [
          ["increase(node_network_receive_errs_total[1h])", "Total errors in the last hour (rate × seconds): nicer for stat panels"],
          ["irate(x[$__rate_interval])", "Uses only the last two samples: spiky, only for fast-moving zoomed-in graphs"],
          ["resets(x[1d])", "How many times a counter reset (process or node restarts)"]
        ],
        tip: "_total metric? Wrap it in rate()",
        tags: ["promql", "rate", "counter", "network", "throughput", "rate_interval"]
      },
      {
        id: "promql-aggregation",
        desc: "Aggregate across GPUs and nodes: avg, max, count by label",
        cmd: "avg by (hostname) (DCGM_FI_DEV_GPU_UTIL_RATIO)",
        flags: [
          ["by (labels)", "Keep only these labels; everything else is aggregated away"],
          ["without (labels)", "Keep everything except these labels"],
          ["avg / max / min / sum / count", "max is often better than avg for health: one hot GPU disappears in an 8-GPU average"],
          ["Gauge vs counter", "DCGM_FI_DEV_GPU_UTIL_RATIO is a gauge (a current value) so no rate() is needed"]
        ],
        subcommands: [
          ["max by (hostname) (DCGM_FI_DEV_GPU_TEMP_CELSIUS)", "Hottest GPU per node"],
          ["count by (modelName) (DCGM_FI_DEV_GPU_TEMP_CELSIUS)", "How many GPUs of each model are reporting"],
          ["count(DCGM_FI_DEV_GPU_TEMP_CELSIUS > 85)", "How many GPUs are above 85 °C right now (empty result = none)"],
          ["count(DCGM_FI_DEV_GPU_TEMP_CELSIUS > 85) or vector(0)", "Same, but returns 0 instead of 'No data' so a stat panel stays green"],
          ["sum(DCGM_FI_DEV_BOARD_POWER_WATTS) / 1000", "Total GPU power of the fleet in kW"]
        ],
        tip: "Use max for health, avg for capacity",
        tags: ["promql", "aggregation", "avg", "max", "count", "by", "without"]
      },
      {
        id: "promql-topk",
        desc: "Top-N: the 10 hottest GPUs right now",
        cmd: "topk(10, DCGM_FI_DEV_GPU_TEMP_CELSIUS)",
        flags: [
          ["topk / bottomk", "Keep the N highest/lowest series. Use with an Instant query in a table or bar gauge"],
          ["In a time series", "topk is evaluated at every step, so different GPUs drift in and out; the legend gets confusing over long ranges"],
          ["Fixed set over a range", "topk(10, max_over_time(DCGM_FI_DEV_GPU_TEMP_CELSIUS[$__range])) with an Instant query: top 10 of the whole visible range"]
        ],
        tip: "topk + Instant query + table",
        tags: ["promql", "topk", "bottomk", "top", "ranking"]
      },
      {
        id: "promql-over-time",
        desc: "Functions over a time range: max, avg, changes, comparisons with offset",
        cmd: "max_over_time(DCGM_FI_DEV_GPU_TEMP_CELSIUS[$__range])",
        flags: [
          ["$__range", "The dashboard's whole time range (e.g. 6h); good with Instant queries in stat panels"],
          ["avg_over_time / min_over_time / max_over_time", "Summarize a gauge over a window"],
          ["changes(x[1h])", "How many times the value changed: link flaps, clock-event reason flips"],
          ["offset 1d", "Same query one day earlier, for 'today vs yesterday'"]
        ],
        subcommands: [
          ["sum(DCGM_FI_DEV_BOARD_POWER_WATTS) - sum(DCGM_FI_DEV_BOARD_POWER_WATTS offset 1d)", "Power now vs this time yesterday"],
          ["avg_over_time(DCGM_FI_DEV_GPU_UTIL_RATIO[1h]) < 0.2", "GPUs averaging under 20% for an hour (idle allocation); the ratio is 0-1, so 20% is 0.2"]
        ],
        tip: "$__range + Instant = one number for the view",
        tags: ["promql", "over_time", "offset", "changes", "range"]
      },
      {
        id: "promql-up-absent",
        desc: "Is anything missing? Down targets and vanished metrics",
        cmd: "up == 0",
        flags: [
          ["up", "Prometheus writes up=1 for every successful scrape and up=0 for a failed one, per target"],
          ["== 0", "A comparison filters: only series where the condition is true remain"],
          ["absent(x)", "Returns 1 if no series match at all: catches an exporter that disappeared completely"],
          ["Why it matters", "A crashed dcgm-exporter makes a GPU panel look 'quiet', not broken. Put up == 0 on the dashboard"]
        ],
        subcommands: [
          ["count by (job) (up == 0)", "Down targets per job"],
          ["absent(DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=\"gpu-node01\"})", "1 if node01 reports no GPU temperature at all"],
          ["count by (hostname) (DCGM_FI_DEV_GPU_TEMP_CELSIUS) < 8", "Nodes reporting fewer than 8 GPUs (a GPU fell off the bus)"]
        ],
        tip: "Silence is not health: graph up == 0",
        tags: ["promql", "up", "absent", "missing", "targets", "gpu fell off bus"]
      },
      {
        id: "promql-join-group-left",
        desc: "Join labels from another metric (add the node name to node_exporter series)",
        cmd: "rate(node_cpu_seconds_total{mode=\"idle\"}[$__rate_interval]) * on (instance) group_left (nodename) node_uname_info",
        flags: [
          ["node_uname_info", "An 'info' metric: value is always 1, the useful data is in its labels (nodename, release…)"],
          ["* on (instance)", "Match series from both sides that have the same instance label"],
          ["group_left (nodename)", "Many-to-one join: copy the nodename label from the right side onto each left series"],
          ["Multiply by 1", "Because info metrics are 1, the values stay the same; only labels are added"]
        ],
        tip: "Info metric × group_left = add labels",
        tags: ["promql", "join", "group_left", "on", "labels", "info metric"]
      },
      {
        id: "promql-test-cli",
        desc: "Test a query from the shell before putting it in a panel",
        cmd: "curl -s -G http://127.0.0.1:9090/api/v1/query --data-urlencode 'query=max by (hostname) (DCGM_FI_DEV_GPU_TEMP_CELSIUS)' | jq -r '.data.result[] | \"\\(.metric.hostname)\\t\\(.value[1])\"'",
        flags: [
          ["-G", "Send --data-urlencode as URL query parameters with GET; without -G curl would POST"],
          ["--data-urlencode", "Escapes spaces, braces and quotes in the PromQL for you"],
          ["/api/v1/query", "Instant query (one value per series); /api/v1/query_range takes start, end and step"],
          ["jq .value[1]", "Prometheus returns [timestamp, \"value\"]; the value is a string"]
        ],
        subcommands: [
          ["promtool query instant http://127.0.0.1:9090 'up == 0'", "Same with promtool, if it is installed"],
          ["curl -s -G http://127.0.0.1:9090/api/v1/label/hostname/values | jq -r '.data[]'", "Every value of a label: what a variable dropdown will show"],
          ["curl -s -G http://127.0.0.1:9090/api/v1/series --data-urlencode 'match[]=DCGM_FI_DEV_GPU_TEMP_CELSIUS' | jq '.data[0]'", "Every label on a metric: shows exactly which labels you can use in by()"]
        ],
        tip: "Use -G so curl sends a GET",
        tags: ["promql", "curl", "api", "jq", "promtool", "test"]
      }
    ],
    proTip: {
      desc: "Find the metric and labels before writing the query",
      cmd: "curl -s http://gpu-node01:9400/metrics | grep -v '^#' | cut -d'{' -f1 | sort -u",
      details: "Exporters list everything they expose on /metrics. Read the # HELP and # TYPE lines: TYPE counter means use rate(), TYPE gauge means use it as is.",
      flags: [
        ["grep -v '^#'", "Drop the HELP/TYPE comment lines"],
        ["cut -d'{' -f1", "Keep only the metric name (everything before the label braces)"],
        ["sort -u", "One line per metric name"],
        ["Grafana Explore", "Explore (compass icon) → Metrics browser does the same with clicks"]
      ],
      tip: "TYPE counter → rate(); gauge → as is"
    }
  },
  {
    id: "grafana-variables", group: "build", file: "grafana-variables", badge: "var", code: "var",
    name: "Grafana Variables", navDesc: "dropdowns, chained variables, repeat panels",
    title: "Grafana Variables: Dropdowns, Chaining & Repeating Panels",
    subtitle: "One dashboard for every node and GPU: query variables, chained filters, multi-value formatting and repeated panels",
    commands: [
      {
        id: "grafana-query-variable",
        desc: "A host dropdown filled from Prometheus labels (Dashboard settings → Variables → New)",
        cmd: "label_values(DCGM_FI_DEV_GPU_TEMP_CELSIUS, hostname)",
        flags: [
          ["Variable type: Query", "Values come from the data source; the query above lists every hostname that has GPU metrics"],
          ["Name: host", "Use it in queries as $host: DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~\"$host\"}"],
          ["Multi-value + Include All", "Lets people pick several hosts or All; then always use =~ (regex match), never ="],
          ["Refresh: On time range change", "Picks up nodes that joined since the dashboard was opened"],
          ["Custom all value: .*", "Without it, All sends a regex of every host, which gets slow and long on big fleets"]
        ],
        subcommands: [
          ["label_names()", "Every label name in the data source"],
          ["label_values(hostname)", "Values of a label across all metrics (slower than naming a metric)"],
          ["query_result(topk(5, max by (hostname) (DCGM_FI_DEV_GPU_TEMP_CELSIUS)))", "Values from any PromQL result; pair with a Regex such as /hostname=\"([^\"]+)\"/"]
        ],
        tip: "Multi-value variables need =~ not =",
        tags: ["variables", "templating", "label_values", "dropdown", "query variable"]
      },
      {
        id: "grafana-chained-variable",
        desc: "Chained variables: the GPU dropdown only shows GPUs on the selected hosts",
        cmd: "label_values(DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~\"$host\"}, gpu)",
        flags: [
          ["$host inside the query", "This variable is re-queried whenever host changes"],
          ["Order", "Variables evaluate top to bottom in the settings list; a chained variable must come after the one it uses"],
          ["Panel query", "DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~\"$host\", gpu=~\"$gpu\"}"],
          ["Regex field", "/^gpu-node(\\d+)$/ in the variable's Regex box would keep only the number; leave empty to keep full names"]
        ],
        tip: "Order variables parent first",
        tags: ["variables", "chained", "dependent", "filter", "gpu"]
      },
      {
        id: "grafana-variable-json",
        desc: "The same host variable as dashboard JSON (templating.list)",
        cmd: `"templating": {
  "list": [
    {
      "name": "host",
      "label": "Host",
      "type": "query",
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "query": { "query": "label_values(DCGM_FI_DEV_GPU_TEMP_CELSIUS, hostname)" },
      "refresh": 2,
      "multi": true,
      "includeAll": true,
      "allValue": ".*",
      "sort": 1
    }
  ]
}`,
        flags: [
          ["refresh", "1 = on dashboard load, 2 = on time range change"],
          ["sort", "1 = alphabetical ascending; 3 = numerical ascending (gpu-node2 before gpu-node10 needs natural sort, 7)"],
          ["datasource.uid", "Matches the provisioned data source UID; that is why a fixed UID matters"],
          ["Schema note", "This is the classic JSON model; Grafana 13 stores dashboards in the v2 schema and converts classic JSON on load"]
        ],
        tip: "refresh 2 picks up new nodes",
        tags: ["variables", "json", "templating", "schema"]
      },
      {
        id: "grafana-variable-formats",
        desc: "Format a multi-value variable for where it is used",
        cmd: "${host:regex}",
        flags: [
          ["${host:regex}", "node01|node02 with regex characters escaped: for =~ in PromQL"],
          ["${host:pipe}", "node01|node02 without escaping"],
          ["${host:csv}", "node01,node02: for SQL IN (...) lists or APIs"],
          ["${host:json}", "[\"node01\",\"node02\"]"],
          ["${host:queryparam}", "var-host=node01&var-host=node02: for links to another dashboard"],
          ["${host:text}", "The display text instead of the value"]
        ],
        tip: "Links to other dashboards: ${var:queryparam}",
        tags: ["variables", "format", "regex", "csv", "queryparam", "interpolation"]
      },
      {
        id: "grafana-repeat-panels",
        desc: "Repeat a panel or row once per selected host",
        cmd: `"repeat": "host",
"repeatDirection": "h",
"maxPerRow": 4`,
        flags: [
          ["Where in the UI", "Edit panel → Panel options → Repeat options → Repeat by variable: host"],
          ["Inside the panel query", "Use $host as normal; each copy gets one value"],
          ["repeatDirection", "h = side by side (wraps after maxPerRow), v = stacked"],
          ["Repeat a row", "Put several panels in a row and repeat the row: one block of panels per node"],
          ["Title", "Use $host in the title so each copy is labeled"]
        ],
        tip: "Repeat rows, not copy-pasted panels",
        tags: ["repeat", "rows", "variables", "per node", "layout"]
      },
      {
        id: "grafana-builtin-variables",
        desc: "Built-in variables you can use in any query or title",
        cmd: "$__interval  $__rate_interval  $__range  $__from  $__to  $__dashboard  $__user.login",
        flags: [
          ["$__interval", "Time per data point for the current zoom; changes as you zoom"],
          ["$__rate_interval", "Safe window for rate()/increase(): at least 4 × scrape interval"],
          ["$__range", "Length of the selected time range (6h, 7d…)"],
          ["$__from / $__to", "Range start/end in epoch ms; ${__from:date:iso} formats it"],
          ["Interval variable type", "A dropdown of windows (1m, 5m, 1h) the user can pick, used as [$window]"]
        ],
        tip: "Use $__rate_interval for every rate()",
        tags: ["variables", "builtin", "interval", "range", "rate_interval"]
      }
    ],
    proTip: {
      desc: "Variables turn 50 dashboards into one",
      cmd: "Host ▾  GPU ▾  →  every panel filters with {hostname=~\"$host\", gpu=~\"$gpu\"}",
      details: "Build one 'GPU node' dashboard driven by host and gpu variables instead of a dashboard per node. Linked from the fleet overview with a data link, it becomes the drill-down for any node.",
      flags: [
        ["Hidden variables", "Set Hide = Variable for helper variables people should not change"],
        ["Constants", "A constant variable for a cluster name or job keeps queries short and editable in one place"]
      ],
      tip: "One templated dashboard per kind of thing"
    }
  },
  // ---------------------------------------------------------------- SHIP
  {
    id: "grafana-as-code", group: "ship", file: "grafana-as-code", badge: "code", code: "code",
    name: "Dashboards as Code", navDesc: "JSON model, provisioning, API, gcx, Git Sync",
    title: "Grafana Dashboards as Code: JSON, Provisioning, HTTP API, gcx & Git Sync",
    subtitle: "Export dashboards to JSON, keep them in git, and load them with provisioning files, the HTTP API, gcx or Git Sync",
    commands: [
      {
        id: "grafana-dashboard-json-skeleton",
        desc: "Minimal dashboard JSON (classic model) with one panel",
        cmd: `{
  "uid": "gpu-fleet",
  "title": "GPU Fleet",
  "tags": ["gpu", "dcgm"],
  "time": { "from": "now-6h", "to": "now" },
  "refresh": "30s",
  "panels": [
    {
      "type": "timeseries",
      "title": "GPU utilization",
      "gridPos": { "x": 0, "y": 0, "w": 12, "h": 8 },
      "datasource": { "type": "prometheus", "uid": "prometheus" },
      "targets": [
        { "refId": "A",
          "expr": "avg by (hostname) (DCGM_FI_DEV_GPU_UTIL_RATIO{hostname=~\\"$host\\"})",
          "legendFormat": "{{hostname}}" }
      ],
      "fieldConfig": { "defaults": { "unit": "percentunit", "min": 0, "max": 1 }, "overrides": [] }
    }
  ]
}`,
        flags: [
          ["uid", "Stable ID used in URLs (/d/gpu-fleet) and by the API. Set it yourself so it never changes"],
          ["gridPos", "24 columns wide; w = width in columns, h = height in rows (~30 px), x/y = position. w 12 = half width"],
          ["targets[].expr", "The PromQL. Inside JSON, double quotes in the query must be escaped as \\\""],
          ["Leave out id", "id is per-instance; when moving a dashboard between Grafanas, remove it (or set null) and keep uid"],
          ["Grafana 13", "Exports default to the v2 resource schema (apiVersion/kind/spec); classic JSON like this still imports and is migrated"]
        ],
        subcommands: [
          ["jq . gpu-fleet.json > /dev/null && echo valid", "Check the file is valid JSON before loading it"],
          ["jq -r '.panels[] | \"\\(.gridPos.y)\\t\\(.gridPos.x)\\t\\(.title)\"' gpu-fleet.json | sort -n", "List panels in layout order"]
        ],
        tip: "Set uid yourself; drop id when moving",
        tags: ["json", "model", "uid", "gridPos", "panels", "export", "schema"]
      },
      {
        id: "grafana-dashboard-provider",
        desc: "Load dashboards from a folder of JSON files (provisioning/dashboards/fleet.yaml)",
        cmd: `apiVersion: 1
providers:
  - name: fleet
    type: file
    disableDeletion: true
    allowUiUpdates: false
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true`,
        flags: [
          ["options.path", "Grafana reads every .json file here (inside the container, so mount your git folder there)"],
          ["foldersFromFilesStructure", "Each subfolder becomes a Grafana folder (dashboards/gpu/ → folder gpu). Do not also set folder/folderUid"],
          ["updateIntervalSeconds", "How often Grafana re-reads the files; edits in git show up without a restart"],
          ["allowUiUpdates: false", "UI edits are blocked, so git stays the source of truth. To change a dashboard: edit in the lab, export JSON, commit"],
          ["disableDeletion", "Removing a file does not delete the dashboard; safer while you are learning"]
        ],
        subcommands: [
          ["docker compose logs grafana | grep -i provisioning", "See which dashboards loaded and any JSON errors"]
        ],
        tip: "Git is the source of truth: allowUiUpdates false",
        tags: ["provisioning", "yaml", "file", "folders", "gitops"]
      },
      {
        id: "grafana-api-export",
        desc: "Export a dashboard's JSON with the HTTP API",
        cmd: "curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/dashboards/uid/gpu-fleet\" | jq '.dashboard | del(.id)' > gpu-fleet.json",
        flags: [
          ["/api/dashboards/uid/<uid>", "Returns { dashboard: {...}, meta: {...} }; meta holds folder and version info"],
          ["jq '.dashboard | del(.id)'", "Keep only the dashboard and remove the instance-specific id"],
          ["> gpu-fleet.json", "Redirect into a file you commit to git"]
        ],
        subcommands: [
          ["curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/search?type=dash-db&query=gpu\" | jq -r '.[] | \"\\(.uid)\\t\\(.folderTitle)\\t\\(.title)\"'", "Find dashboards and their UIDs"],
          ["curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/folders\" | jq -r '.[] | \"\\(.uid)\\t\\(.title)\"'", "List folders and their UIDs"],
          ["for uid in $(curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/search?type=dash-db\" | jq -r '.[].uid'); do curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/dashboards/uid/$uid\" | jq '.dashboard | del(.id)' > \"$uid.json\"; done", "Back up every dashboard to <uid>.json"]
        ],
        tip: "Export → del(.id) → commit",
        tags: ["api", "export", "curl", "jq", "backup", "uid"]
      },
      {
        id: "grafana-api-import",
        desc: "Create or update a dashboard from a JSON file with the HTTP API (changes state)",
        cmd: "jq '{dashboard: (. | .id = null), folderUid: \"<folder-uid>\", overwrite: true, message: \"update from git\"}' gpu-fleet.json | curl -s -X POST -H \"Authorization: Bearer $GRAFANA_TOKEN\" -H 'Content-Type: application/json' --data-binary @- \"$GRAFANA_URL/api/dashboards/db\" | jq",
        flags: [
          ["jq '{dashboard: ..., ...}'", "Wraps the dashboard in the body the API expects"],
          ["folderUid", "Folder to save into. If you leave it out on an update, the dashboard can move to the General folder"],
          ["overwrite: true", "Replace an existing dashboard with the same uid or title. Without it, the API refuses (412 version-mismatch / name-exists)"],
          ["message", "Shows in the dashboard's version history"],
          ["--data-binary @-", "Read the body from stdin (the jq output) without changing newlines"]
        ],
        tip: "412 = someone changed it; re-export first",
        tags: ["api", "import", "post", "curl", "jq", "overwrite", "folder"]
      },
      {
        id: "grafana-gcx",
        desc: "gcx: pull and push dashboards as files (successor to grafanactl, Grafana 12+)",
        cmd: "gcx resources pull --path ./resources/ -o yaml",
        flags: [
          ["gcx resources pull", "Download resources (dashboards, folders…) from the current context into files"],
          ["-p / --path", "Directory to read/write; the default is ./resources"],
          ["-o yaml|json", "File format for pulled resources"],
          ["--include-managed", "Also touch resources owned by Terraform or Git Sync (skipped by default)"],
          ["Contexts", "Configure one context per Grafana (lab, prod) and switch between them; see gcx config --help"],
          ["grafanactl", "Deprecated; its repo was archived 2026-06-01. Replace grafanactl with gcx in old scripts"]
        ],
        subcommands: [
          ["gcx resources push -p ./resources/", "Upload the files to the current context (changes state)"],
          ["gcx dev serve", "Local live-reload preview of dashboard files while you edit them (replaces grafanactl resources serve; runs until Ctrl+C)"],
          ["gcx --help", "Commands vary by version and some are marked [experimental]; check help before scripting"]
        ],
        tip: "Old scripts: grafanactl → gcx",
        tags: ["gcx", "grafanactl", "cli", "pull", "push", "gitops"]
      },
      {
        id: "grafana-git-sync",
        desc: "Git Sync (GA in Grafana 13): keep dashboards in a GitHub/GitLab/Bitbucket repo from the UI",
        cmd: "Administration → General → Provisioning → Configure Git Sync",
        flags: [
          ["What it does", "Dashboards saved in the UI become commits (or pull requests) in a repo, and changes in the repo flow back to Grafana"],
          ["Auth", "GitHub App or a token for GitLab/Bitbucket; use a dedicated repo or folder"],
          ["vs file provisioning", "File provisioning is one-way (files → Grafana). Git Sync is two-way and keeps UI editing"],
          ["vs API/gcx", "API and gcx are scripts you run; Git Sync runs continuously inside Grafana"]
        ],
        tip: "One-way: files. Two-way: Git Sync",
        tags: ["git sync", "git", "gitops", "github", "provisioning"]
      }
    ],
    proTip: {
      desc: "Pick one source of truth per dashboard",
      cmd: "Lab UI edit → export JSON → git commit → provision / push → shared Grafana (read-only)",
      details: "Problems start when the same dashboard is changed in the UI and in git. Decide per folder: provisioned from git (UI read-only) or UI-owned (backed up by the export loop).",
      flags: [
        ["Review diffs", "git diff on dashboard JSON shows exactly which query or threshold changed"],
        ["Datasource UIDs", "Use the same provisioned UID everywhere so JSON moves between lab and prod untouched"],
        ["Backups", "The export loop on the previous cards is a cheap nightly backup even for UI-owned dashboards"]
      ],
      tip: "Never edit the same dashboard in two places"
    }
  },
  {
    id: "grafana-gpu-dashboard", group: "ship", file: "grafana-gpu-dashboard", badge: "gpu", code: "gpu",
    name: "GPU Fleet Dashboard", navDesc: "DCGM panels: health, temp, power, XID",
    title: "GPU Fleet Dashboard Recipe: DCGM Exporter Panels for H200 / B200 Nodes",
    subtitle: "A worked example: the panels, queries and layout for a datacenter GPU dashboard built on dcgm-exporter and node_exporter",
    commands: [
      {
        id: "gpu-dash-metric-names",
        desc: "Which metric names does your exporter use? dcgm-exporter 4.9.0 renamed them",
        cmd: "curl -s http://<node>:9400/metrics | grep -c '^DCGM_FI_DEV_GPU_TEMP_CELSIUS{'",
        flags: [
          ["Result > 0", "4.9.0 or newer: the queries on these sheets work as written"],
          ["Result 0", "Older exporter: use the old names below, and note the unit changes"],
          ["DCGM_FI_DEV_GPU_TEMP", "→ DCGM_FI_DEV_GPU_TEMP_CELSIUS (same unit, °C)"],
          ["DCGM_FI_DEV_POWER_USAGE", "→ DCGM_FI_DEV_BOARD_POWER_WATTS (same unit, W)"],
          ["DCGM_FI_DEV_GPU_UTIL", "→ DCGM_FI_DEV_GPU_UTIL_RATIO (0-100 percent became a 0-1 ratio)"],
          ["DCGM_FI_DEV_FB_USED", "→ DCGM_FI_DEV_FB_USED_BYTES (MiB became bytes)"],
          ["DCGM_FI_DEV_SM_CLOCK", "→ DCGM_FI_DEV_SM_CLOCK_HERTZ (MHz became Hz)"],
          ["DCGM_FI_DEV_XID_ERRORS", "→ DCGM_FI_DEV_XID_ERROR (last XID code)"],
          ["DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL", "→ DCGM_FI_DEV_NVLINK_THROUGHPUT_BYTES_PER_SECOND (MB/s became bytes/s)"],
          ["DCGM_FI_PROF_GR_ENGINE_ACTIVE", "→ DCGM_FI_PROF_GR_ENGINE_UTIL_RATIO"],
          ["DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS", "→ DCGM_FI_DEV_ROW_REMAP_UNCORRECTABLE_TOTAL"],
          ["DCGM_FI_DEV_ROW_REMAP_FAILURE", "→ DCGM_FI_DEV_ROW_REMAP_FAILED"],
          ["Hostname label", "→ hostname since 4.6.0; the driver-version label DCGM_FI_DRIVER_VERSION → DCGM_FI_SYSTEM_DRIVER_VERSION in 4.9.0"]
        ],
        subcommands: [
          ["max by (hostname, gpu) (DCGM_FI_DEV_GPU_TEMP_CELSIUS or DCGM_FI_DEV_GPU_TEMP)", "Mixed fleet during an upgrade: or keeps a series from either name (only safe where the unit did not change)"],
          ["DCGM_FI_DEV_GPU_UTIL / 100", "Old percent metric on a panel built for 0-1 ratios"],
          ["curl -s http://<node>:9400/metrics | grep -E '^# (HELP|TYPE) DCGM_FI_DEV_GPU_UTIL'", "HELP/TYPE lines show the name, type and unit your exporter really uses"]
        ],
        tip: "Upgrading the exporter breaks old dashboards",
        tags: ["dcgm", "metric names", "rename", "4.9.0", "upgrade", "units", "hostname"]
      },
      {
        id: "gpu-dash-layout",
        desc: "Layout: three rows answering 'anything wrong?', 'where?', 'why?'",
        cmd: `Row 1  Fleet health (stat panels, w 4 each = 6 across)
       GPUs reporting | Exporters down | XID now | Hot GPUs | Fleet power kW | Avg util
Row 2  Where (w 12 + 12)
       Per-GPU table (sorted by temp)  |  Temperature heatmap by GPU
Row 3  Why (time series, repeat by $host)
       Util | Temp | Power | Memory used | NVLink bandwidth | Clock event reasons`,
        flags: [
          ["Variables", "host = label_values(DCGM_FI_DEV_GPU_TEMP_CELSIUS, hostname), gpu chained on host"],
          ["Row 1 colors", "Every stat is green at 0 problems and red when something needs a technician"],
          ["Row 3 repeat", "Repeat the row by $host so selecting 3 nodes shows 3 blocks"],
          ["Starting point", "Community dashboard 12239 shows working queries but uses the pre-4.9 metric names. dcgm-exporter 4.9.0 updated its own Grafana dashboard to the new names and units"]
        ],
        subcommands: [
          ["Dashboards → New → Import → 12239 → pick the Prometheus data source", "Import the community DCGM dashboard (read its JSON before trusting it)"]
        ],
        tip: "Match the dashboard to your exporter's names",
        tags: ["layout", "gpu", "dcgm", "design", "rows", "12239"]
      },
      {
        id: "gpu-dash-health-stats",
        desc: "Row 1 stat queries: GPUs reporting, exporters down, XID, hot GPUs",
        cmd: "count(DCGM_FI_DEV_GPU_TEMP_CELSIUS)",
        flags: [
          ["GPUs reporting", "count(DCGM_FI_DEV_GPU_TEMP_CELSIUS): compare with the GPUs you own (threshold below the expected count = red)"],
          ["Exporters down", "count(up{job=\"dcgm\"} == 0) or vector(0)"],
          ["XID now", "count(DCGM_FI_DEV_XID_ERROR > 0) or vector(0); the metric holds the last XID code, not a count"],
          ["Hot GPUs", "count(DCGM_FI_DEV_GPU_TEMP_CELSIUS > 85) or vector(0); take the limit from your GPU's spec"],
          ["or vector(0)", "Turns 'No data' into 0 so the panel stays green instead of grey"]
        ],
        subcommands: [
          ["sum(DCGM_FI_DEV_BOARD_POWER_WATTS) / 1000", "Fleet GPU power in kW (unit: none, or kwatt)"],
          ["avg(DCGM_FI_DEV_GPU_UTIL_RATIO)", "Fleet average utilization (unit percentunit, because the value is 0-1)"]
        ],
        tip: "or vector(0) keeps stat panels green",
        tags: ["stat", "health", "xid", "temperature", "count", "dcgm"]
      },
      {
        id: "gpu-dash-table",
        desc: "Row 2 per-GPU table: one row per GPU with temp, power, util and memory",
        cmd: `A: DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~"$host"}
B: DCGM_FI_DEV_BOARD_POWER_WATTS{hostname=~"$host"}
C: DCGM_FI_DEV_GPU_UTIL_RATIO{hostname=~"$host"}
D: DCGM_FI_DEV_FB_USED_BYTES{hostname=~"$host"}
(all: Format Table, Type Instant)
→ Merge → Organize fields (keep hostname, gpu, modelName, UUID, pci_bus_id) → Sort by Temp desc`,
        flags: [
          ["Labels you get", "gpu (index), UUID, pci_bus_id, device, modelName, plus hostname unless the exporter runs with --no-hostname. Exporters older than 4.6.0 spell it Hostname"],
          ["UUID + pci_bus_id", "Exactly the identifiers an RMA ticket needs; keep them as columns"],
          ["Overrides", "Temp → celsius with thresholds; Power → watt; Util → percentunit; FB_USED_BYTES → bytes (pre-4.9 FB_USED was MiB → mbytes)"],
          ["Cell display", "Override Temp: Cell options → Colored background, so hot rows stand out"]
        ],
        tip: "Keep UUID and BDF columns for RMAs",
        tags: ["table", "per gpu", "merge", "uuid", "bdf", "rma"]
      },
      {
        id: "gpu-dash-timeseries",
        desc: "Row 3 time series queries for one node (repeat by $host)",
        cmd: "DCGM_FI_DEV_GPU_TEMP_CELSIUS{hostname=~\"$host\"}",
        flags: [
          ["Legend", "GPU {{gpu}} so 8 lines per node read GPU 0 … GPU 7"],
          ["Temperature", "DCGM_FI_DEV_GPU_TEMP_CELSIUS and DCGM_FI_DEV_MEMORY_TEMP_CELSIUS (HBM), unit celsius"],
          ["Power", "DCGM_FI_DEV_BOARD_POWER_WATTS, unit watt; one GPU far below its siblings under load is worth a look"],
          ["Memory", "DCGM_FI_DEV_FB_USED_BYTES, unit bytes (Grafana scales it to GiB for you)"],
          ["Utilization", "DCGM_FI_DEV_GPU_UTIL_RATIO (share of time the GPU was busy) and DCGM_FI_PROF_GR_ENGINE_UTIL_RATIO (share of time the graphics engine was active); both are in the default counters, unit percentunit"],
          ["Clocks", "DCGM_FI_DEV_SM_CLOCK_HERTZ (unit hertz; pre-4.9 SM_CLOCK was MHz); a GPU running slower than its siblings is often thermal or power throttling"]
        ],
        subcommands: [
          ["DCGM_FI_DEV_NVLINK_THROUGHPUT_BYTES_PER_SECOND{hostname=~\"$host\"}", "NVLink throughput across all links: already a per-second gauge, so no rate() (unit Bps)"],
          ["rate(DCGM_FI_DEV_GPU_THERMAL_THROTTLE_SECONDS_TOTAL{hostname=~\"$host\"}[$__rate_interval])", "Share of time spent thermally throttled (0-1). Optional field: uncomment it (and GPU_POWER_THROTTLE_SECONDS_TOTAL) in the counters CSV"]
        ],
        tip: "One GPU unlike its 7 siblings = investigate",
        tags: ["time series", "temperature", "power", "memory", "clocks", "nvlink", "dcgm"]
      },
      {
        id: "gpu-dash-errors",
        desc: "Error panels: XID codes, ECC and row remapping (state timeline)",
        cmd: "max by (hostname, gpu) (DCGM_FI_DEV_XID_ERROR{hostname=~\"$host\"})",
        flags: [
          ["State timeline", "Value mapping 0 → OK (green), range 1-999 → 'XID ${__value.raw}' (red): shows when each GPU hit an XID. The value is the last XID code, so look it up on the NVIDIA DC Xid sheet"],
          ["ECC", "increase(DCGM_FI_DEV_ECC_DBE_VOL_TOTAL[$__range]) for double-bit (uncorrectable) volatile errors. Optional field: commented out in the default counters CSV"],
          ["Row remapping", "DCGM_FI_DEV_ROW_REMAP_UNCORRECTABLE_TOTAL (counter) and DCGM_FI_DEV_ROW_REMAP_FAILED (gauge, whether remapping failed); both are default fields. FAILED > 0 is an RMA candidate"],
          ["Not every metric is on", "dcgm-exporter only exports what its counters CSV lists; add missing fields there"],
          ["Then go to the node", "The dashboard says where; nvidia-smi -q and dmesg on the node say why (see the NVIDIA DC sheets)"]
        ],
        tip: "Dashboards find the GPU; the CLI proves the fault",
        tags: ["xid", "ecc", "row remap", "errors", "state timeline", "rma"]
      },
      {
        id: "gpu-dash-node-context",
        desc: "Node context from node_exporter: CPU, memory and InfiniBand link errors",
        cmd: "100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{mode=\"idle\"}[$__rate_interval])))",
        flags: [
          ["CPU busy %", "The query above: 1 minus the idle share, as a percentage"],
          ["Memory", "1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes (unit percentunit)"],
          ["IB link downs", "increase(node_infiniband_link_downed_total[$__range]) from node_exporter's infiniband collector"],
          ["IB symbol errors", "increase(node_infiniband_symbol_error_total[$__range]); a climbing count points at optics or cables"],
          ["instance vs hostname", "node_exporter labels by instance (host:9100) while DCGM uses hostname; join with node_uname_info or relabel in Prometheus"]
        ],
        tip: "Rising symbol errors → clean/swap the optic",
        tags: ["node_exporter", "cpu", "memory", "infiniband", "link errors", "context"]
      }
    ],
    proTip: {
      desc: "Before trusting a GPU panel, check the pipeline end to end",
      cmd: "curl -s http://<node>:9400/metrics | grep -cE '^DCGM_FI_DEV_GPU_TEMP(_CELSIUS)?\\{'",
      details: "Expect one line per GPU (8 on an HGX node). If it is lower, a GPU dropped off the bus or the exporter cannot see it; if the curl fails, the exporter is down and the dashboard is showing stale or no data.",
      flags: [
        ["1. Exporter", "curl /metrics on the node (above)"],
        ["2. Prometheus", "Status → Targets: dcgm job up?"],
        ["3. Grafana", "Panel → Inspect → Query: did the query return series?"],
        ["4. Dashboard", "Variables: is the node selected? Time range right?"]
      ],
      tip: "Exporter → Prometheus → Grafana → panel"
    }
  }
];

// 2. Navbar dropdown inserted into every sheet, just before the Omarchy link.
const navCol = (group, heading) => `                    <div class="graf-dropdown-col">
                      <div class="graf-dropdown-heading">${heading}</div>
${GRAFANA_SECTIONS.filter(s => s.group === group).map(s => `                      <a href="${s.file}.html" class="dropdown-item" role="menuitem"><code>${s.code}</code> <span class="cmd-desc">${escapeHtml(s.navDesc)}</span></a>`).join('\n')}
                    </div>`;

const GRAF_NAVBAR_SNIPPET = `<div class="nav-dropdown" id="grafana-nav-dropdown">
                <a href="grafana.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="#F46800" d="M23.02 10.59a8.578 8.578 0 0 0-.862-3.034 8.911 8.911 0 0 0-1.789-2.445c.337-1.342-.413-2.505-.413-2.505-1.292-.08-2.113.4-2.416.62-.052-.02-.102-.044-.154-.064-.22-.089-.446-.172-.677-.247-.231-.073-.47-.14-.711-.197a9.867 9.867 0 0 0-.875-.161C14.557.753 12.94 0 12.94 0c-1.804 1.145-2.147 2.744-2.147 2.744l-.018.093c-.098.029-.2.057-.298.088-.138.042-.275.094-.413.143-.138.055-.275.107-.41.166a8.869 8.869 0 0 0-1.557.87l-.063-.029c-2.497-.955-4.716.195-4.716.195-.203 2.658.996 4.33 1.235 4.636a11.608 11.608 0 0 0-.607 2.635C1.636 12.677.953 15.014.953 15.014c1.926 2.214 4.171 2.351 4.171 2.351.003-.002.006-.002.006-.005.285.509.615.994.986 1.446.156.19.32.371.488.548-.704 2.009.099 3.68.099 3.68 2.144.08 3.553-.937 3.849-1.173a9.784 9.784 0 0 0 3.164.501h.08l.055-.003.107-.002.103-.005.003.002c1.01 1.44 2.788 1.646 2.788 1.646 1.264-1.332 1.337-2.653 1.337-2.94v-.058c0-.02-.003-.039-.003-.06.265-.187.52-.387.758-.6a7.875 7.875 0 0 0 1.415-1.7c1.43.083 2.437-.885 2.437-.885-.236-1.49-1.085-2.216-1.264-2.354l-.018-.013-.016-.013a.217.217 0 0 1-.031-.02c.008-.092.016-.18.02-.27.011-.162.016-.323.016-.48v-.253l-.005-.098-.008-.135a1.891 1.891 0 0 0-.01-.13c-.003-.042-.008-.083-.013-.125l-.016-.124-.018-.122a6.215 6.215 0 0 0-2.032-3.73 6.015 6.015 0 0 0-3.222-1.46 6.292 6.292 0 0 0-.85-.048l-.107.002h-.063l-.044.003-.104.008a4.777 4.777 0 0 0-3.335 1.695c-.332.4-.592.84-.768 1.297a4.594 4.594 0 0 0-.312 1.817l.003.091c.005.055.007.11.013.164a3.615 3.615 0 0 0 .698 1.82 3.53 3.53 0 0 0 1.827 1.282c.33.098.66.14.971.137.039 0 .078 0 .114-.002l.063-.003c.02 0 .041-.003.062-.003.034-.002.065-.007.099-.01.007 0 .018-.003.028-.003l.031-.005.06-.008a1.18 1.18 0 0 0 .112-.02c.036-.008.072-.013.109-.024a2.634 2.634 0 0 0 .914-.415c.028-.02.056-.041.085-.065a.248.248 0 0 0 .039-.35.244.244 0 0 0-.309-.06l-.078.042c-.09.044-.184.083-.283.116a2.476 2.476 0 0 1-.475.096c-.028.003-.054.006-.083.006l-.083.002c-.026 0-.054 0-.08-.002l-.102-.006h-.012l-.024.006c-.016-.003-.031-.003-.044-.006-.031-.002-.06-.007-.091-.01a2.59 2.59 0 0 1-.724-.213 2.557 2.557 0 0 1-.667-.438 2.52 2.52 0 0 1-.805-1.475 2.306 2.306 0 0 1-.029-.444l.006-.122v-.023l.002-.031c.003-.021.003-.04.005-.06a3.163 3.163 0 0 1 1.352-2.29 3.12 3.12 0 0 1 .937-.43 2.946 2.946 0 0 1 .776-.101h.06l.07.002.045.003h.026l.07.005a4.041 4.041 0 0 1 1.635.49 3.94 3.94 0 0 1 1.602 1.662 3.77 3.77 0 0 1 .397 1.414l.005.076.003.075c.002.026.002.05.002.075 0 .024.003.052 0 .07v.065l-.002.073-.008.174a6.195 6.195 0 0 1-.08.639 5.1 5.1 0 0 1-.267.927 5.31 5.31 0 0 1-.624 1.13 5.052 5.052 0 0 1-3.237 2.014 4.82 4.82 0 0 1-.649.066l-.039.003h-.287a6.607 6.607 0 0 1-1.716-.265 6.776 6.776 0 0 1-3.4-2.274 6.75 6.75 0 0 1-.746-1.15 6.616 6.616 0 0 1-.714-2.596l-.005-.083-.002-.02v-.056l-.003-.073v-.096l-.003-.104v-.07l.003-.163c.008-.22.026-.45.054-.678a8.707 8.707 0 0 1 .28-1.355c.128-.444.286-.872.473-1.277a7.04 7.04 0 0 1 1.456-2.1 5.925 5.925 0 0 1 .953-.763c.169-.111.343-.213.524-.306.089-.05.182-.091.273-.135.047-.02.093-.042.138-.062a7.177 7.177 0 0 1 .714-.267l.145-.045c.049-.015.098-.026.148-.041.098-.029.197-.052.296-.076.049-.013.1-.02.15-.033l.15-.032.151-.028.076-.013.075-.01.153-.024c.057-.01.114-.013.171-.023l.169-.021c.036-.003.073-.008.106-.01l.073-.008.036-.003.042-.002c.057-.003.114-.008.171-.01l.086-.006h.023l.037-.003.145-.007a7.999 7.999 0 0 1 1.708.125 7.917 7.917 0 0 1 2.048.68 8.253 8.253 0 0 1 1.672 1.09l.09.077.089.078c.06.052.114.107.171.159.057.052.112.106.166.16.052.055.107.107.159.164a8.671 8.671 0 0 1 1.41 1.978c.012.026.028.052.04.078l.04.078.075.156c.023.051.05.1.07.153l.065.15a8.848 8.848 0 0 1 .45 1.34.19.19 0 0 0 .201.142.186.186 0 0 0 .172-.184c.01-.246.002-.532-.024-.856z"/></svg>
                  <span>Grafana</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu graf-dropdown-menu" role="menu">
                  <a href="grafana.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Grafana Hub (Building Dashboards)</a>
                  <div class="dropdown-divider"></div>
                  <div class="graf-dropdown-grid">
${navCol('build', 'Build')}
${navCol('ship', 'Ship &amp; Recipes')}
                  </div>
                </div>
              </div>
              `;

// 3. Insert (or replace) the Grafana dropdown in every sheet's nav.
const htmlFiles = require('./nav/targets').navFiles();   // the one nav copy, not every page
const existingDropdown = /<div class="nav-dropdown" id="grafana-nav-dropdown">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*/;
// Fallback insertion point (the menu is missing once build-nav-groups.js has filed it in a tab):
// just before the Home link. build-nav-groups.js then moves it into its tab again.
const omarchyLink = /<a href="index\.html" class="sheet-link nav-home(?: active)?">/;
let navUpdated = 0, navMissing = [];
for (const file of htmlFiles) {
  const p = path.join(__dirname, file);
  let content = fs.readFileSync(p, 'utf8');
  if (!/<nav class="sheet-switcher"/.test(content)) continue;
  const before = content;
  if (existingDropdown.test(content)) content = content.replace(existingDropdown, GRAF_NAVBAR_SNIPPET);
  else if (omarchyLink.test(content)) content = content.replace(omarchyLink, m => GRAF_NAVBAR_SNIPPET + m);
  else { navMissing.push(file); continue; }
  if (content !== before) { fs.writeFileSync(p, content, 'utf8'); navUpdated++; }
}
console.log(`Grafana dropdown written into ${navUpdated} sheet(s)` + (navMissing.length ? `; no insertion point in: ${navMissing.join(', ')}` : ''));

// New pages copy the nav from index.html, which now includes the dropdown.
const indexHtmlForNav = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

// 4. Split one section into cards: main command, extra flags, recipes, pro tip.
const isMultiline = s => /\n/.test(s || '');
function buildSectionCards(sec) {
  const cards = [];
  const baseTags = ['grafana', 'dashboards', 'observability'];
  sec.commands.forEach((cmd, cIdx) => {
    cards.push({
      id: `${sec.id}-cmd-${cIdx + 1}`,
      badge: sec.badge,
      title: `${sec.name}: ${cmd.desc.split('(')[0].split(':')[0].trim()}`,
      subtitle: cmd.desc,
      commands: [{
        id: cmd.id, desc: cmd.desc, cmd: cmd.cmd, details: cmd.details || '',
        flags: cmd.flags ? cmd.flags.slice(0, 3) : [], tip: cmd.tip || '',
        tags: [...baseTags, ...(cmd.tags || [])]
      }]
    });
    if (cmd.flags && cmd.flags.length > 3) {
      cards.push({
        id: `${sec.id}-flags-${cIdx + 1}`,
        badge: sec.badge,
        title: `${sec.name}: More options`,
        subtitle: `More options for: ${cmd.desc.split('(')[0].trim()}`,
        commands: [{
          id: `${cmd.id}-flags-card`,
          desc: `More options and gotchas for: ${cmd.desc.split('(')[0].trim()}`,
          cmd: cmd.cmd, hideCode: isMultiline(cmd.cmd),
          flags: cmd.flags.slice(3),
          tags: [...baseTags, 'flags', 'options', ...(cmd.tags || []).slice(0, 3)]
        }]
      });
    }
    if (cmd.subcommands && cmd.subcommands.length) {
      cards.push({
        id: `${sec.id}-recipes-${cIdx + 1}`,
        badge: sec.badge,
        title: `${sec.name}: Related commands`,
        subtitle: `Related commands for: ${cmd.desc.split('(')[0].trim()}`,
        commands: cmd.subcommands.map((sub, idx) => ({
          id: `${cmd.id}-sub-${idx + 1}`, desc: sub[1], cmd: sub[0],
          tags: [...baseTags, 'recipe', ...(cmd.tags || []).slice(0, 3)]
        }))
      });
    }
  });
  if (sec.proTip) {
    cards.push({
      id: `${sec.id}-pro-tips`,
      badge: 'tip',
      title: `${sec.name}: Pro Tip`,
      subtitle: sec.proTip.desc,
      commands: [{
        id: `${sec.id}-tips-card`, desc: sec.proTip.desc, cmd: sec.proTip.cmd,
        details: sec.proTip.details, flags: sec.proTip.flags, tip: sec.proTip.tip,
        tags: [...baseTags, 'tips', 'best-practice']
      }]
    });
  }
  return mergeCommandCards(cards);
}

// 5. Sheet JS: data plus the shared render/search/bookmark code used by the other suites.
function generateSheetJs(varName, title, cards, fileKey) {
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for Grafana: ${title}
const ${varName} = ${jsonCards};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("${fileKey}_bookmarks") || "[]"); } catch (e) { return []; } })())
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
    /(^|\\s|;|&&|\\|\\||\\|)(sudo\\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\\|\\||&&|\\|)/g,
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
  const allCards = ${varName};
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

  for (const card of ${varName}) {
    if (state.activeCategory !== "all" && state.activeCategory !== card.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\\s+/)
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
      ].join("\\n");

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
      ].join("\\n");
    }).join("\\n");

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
    ].join("\\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\\n");
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
        localStorage.setItem("${fileKey}_bookmarks", JSON.stringify([...state.bookmarks]));
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
`;
}

// 6. HTML page. Mirrors the chrome of the current live sheets (theme menu, density
// toggle); common.js adds the header search pill, rail and tools at runtime.
function generateSheetHtml(o) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(o.docTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="top-bar">
    <div class="container top-bar-inner">
      <div class="brand">
        <div class="terminal-badge" aria-hidden="true">
          <span class="prompt-symbol">${escapeHtml(o.prompt)}</span><span class="cursor-block">${escapeHtml(o.cursor)}</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(o.h1)}</h1>
            <span class="version-pill">${escapeHtml(o.pill)}</span>
            ${EXACT_NAVBAR}
          </div>
          <p class="brand-subtitle">${escapeHtml(o.subtitle)}</p>
        </div>
      </div>
      <div class="header-actions">
        <button
          type="button"
          id="density-toggle"
          class="action-btn"
          title="Toggle compact view (compact spacing)"
          aria-label="Toggle compact view"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <span id="density-label">Compact</span>
        </button>
        <div class="theme-menu-wrapper" id="theme-menu-wrapper">
          <button type="button" id="theme-palette-btn" class="action-btn theme-palette-btn" title="Select Color Theme" aria-haspopup="true" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.4-.4-.8-.4-1.4 0-1.1.9-2 2-2h2.5c3.6 0 6.5-2.9 6.5-6.5C22 5.6 17.5 2 12 2z"></path>
            </svg>
            <span id="theme-btn-label">Theme</span>
            <svg class="dropdown-caret" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
        <button type="button" id="theme-toggle" style="display:none;" aria-hidden="true"></button>
      </div>
    </div>
  </header>
  <main class="container main-layout">
    <!-- Commands Container (Masonry Cards) -->
    <section id="sections-container" class="sections-container" aria-label="Command cards"></section>
    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden" role="status">
      <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M17 17l4 4M9 11h4"/>
      </svg>
      <h3>No matching ${escapeHtml(o.h1)} commands</h3>
      <p>Try searching with different keywords or clear active filters.</p>
    </div>
  </main>
  <!-- Toast Notification -->
  <div id="toast" class="toast" role="status" aria-live="polite">
    <span id="toast-text"></span>
  </div>
  <footer class="page-footer">
    <div class="container footer-inner">
      <span>${escapeHtml(o.h1)} Reference Cheat Sheet</span>
      <span>Press <kbd>/</kbd> to search &bull; Click any command to copy</span>
    </div>
  </footer>
  <script src="global-search-index.js"></script>
  <script src="common.js"></script>
  <script src="${o.fileKey}.js"></script>
</body>
</html>
`;
}

// 7. Write each sheet, then the hub (every card from every sheet).
const PILL = 'Grafana 13.x / Prometheus';
const writeSheet = (fileKey, varName, title, cards, page) => {
  fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), generateSheetJs(varName, title, cards, fileKey), 'utf8');
  const htmlPath = path.join(__dirname, `${fileKey}.html`);
  if (!fs.existsSync(htmlPath)) fs.writeFileSync(htmlPath, generateSheetHtml({ ...page, fileKey }), 'utf8');
  console.log(`${fileKey}.js (${cards.length} cards)`);
};

const allCards = [];
for (const sec of GRAFANA_SECTIONS) {
  const cards = buildSectionCards(sec);
  allCards.push(...cards);
  writeSheet(sec.file, `GRAF_${sec.file.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`, sec.title, cards, {
    docTitle: `Grafana: ${sec.name} — ${sec.title}`,
    prompt: 'GRF', cursor: '$', h1: sec.name, pill: PILL, subtitle: sec.subtitle
  });
}
writeSheet('grafana', 'GRAFANA_CHEAT_SHEET_DATA', 'Grafana Hub (Building Dashboards)', allCards, {
  docTitle: 'Grafana: Building Dashboards Hub',
  prompt: 'GRF', cursor: '$', h1: 'Grafana: Building Dashboards', pill: PILL,
  subtitle: 'Set up a lab, write PromQL, build panels and variables, ship dashboards as code, and a GPU fleet recipe'
});
console.log(`\nGrafana suite: ${GRAFANA_SECTIONS.length} sheets + hub.`);
