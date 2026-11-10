// generate-sre-suite.js
// Generates the "SRE toolkit" suite under the DevOps tab: Prometheus & Alertmanager, Ansible,
// Terraform / OpenTofu, Helm, Argo CD and incident response, plus the sre.html hub.
//
// Facts checked 2026-11-07, re-checked 2026-11-09/10 (each card's src lists the pages) against official sources: Prometheus 3.16.0 (Nov 4, 2026),
// Alertmanager 0.34.2 (Oct 29, 2026; no CORS headers by default; 0.35.0 since Nov 9), node_exporter 1.12.1;
// promtool, rule, Alertmanager config, amtool and HTTP API docs. ansible-core 2.21, 2.22 since Nov 2 (Ansible
// 14.x community package) CLI docs. Terraform 1.17.1 (Oct 28, 2026, BUSL 1.1) and OpenTofu
// 1.13.9 (Nov 5, 2026, MPL 2.0) CLI and language docs. Helm 4.3.1 (Oct 15, 2026; Helm 4 renames
// --atomic to --rollback-on-failure and --force to --force-replace; Helm 3 security patches
// through February 2027). Argo CD 3.6.1 (Nov 4, 2026) CLI and auto-sync docs. Google SRE book ch. 14 and
// SRE workbook ch. 9 (incident roles).
// Menu logos: official marks from Simple Icons 15.0.0 (CC0): Prometheus, Ansible, Terraform,
// Helm, Argo. Incident response uses a generic icon (it is a practice, not a product).
//
// Re-runnable like the other generators.
const { buildSuite } = require('./generate-suite-kit');

const LOGOS = {
 "prometheus": "<svg class=\"menu-logo\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"#E6522C\" d=\"M12 0C5.373 0 0 5.372 0 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-6.628-5.373-12-12-12zm0 22.46c-1.885 0-3.414-1.26-3.414-2.814h6.828c0 1.553-1.528 2.813-3.414 2.813zm5.64-3.745H6.36v-2.046h11.28v2.046zm-.04-3.098H6.391c-.037-.043-.075-.086-.111-.13-1.155-1.401-1.427-2.133-1.69-2.879-.005-.025 1.4.287 2.395.511 0 0 .513.119 1.262.255-.72-.843-1.147-1.915-1.147-3.01 0-2.406 1.845-4.508 1.18-6.207.648.053 1.34 1.367 1.387 3.422.689-.951.977-2.69.977-3.755 0-1.103.727-2.385 1.454-2.429-.648 1.069.168 1.984.894 4.256.272.854.237 2.29.447 3.201.07-1.892.395-4.652 1.595-5.605-.529 1.2.079 2.702.494 3.424.671 1.164 1.078 2.047 1.078 3.716a4.642 4.642 0 01-1.11 2.996c.792-.149 1.34-.283 1.34-.283l2.573-.502s-.374 1.538-1.81 3.019z\"/></svg>",
 "ansible": "<svg class=\"menu-logo\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"#EE0000\" d=\"M10.617 11.473l4.686 3.695-3.102-7.662zM12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm5.797 17.305c-.011.471-.403.842-.875.83-.236 0-.416-.09-.664-.293l-6.19-5-2.079 5.203H6.191L11.438 5.44c.124-.314.427-.52.764-.506.326-.014.63.189.742.506l4.774 11.494c.045.111.08.234.08.348-.001.009-.001.009-.001.023z\"/></svg>",
 "terraform": "<svg class=\"menu-logo\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"#844FBA\" d=\"M1.44 0v7.575l6.561 3.79V3.787zm21.12 4.227l-6.561 3.791v7.574l6.56-3.787zM8.72 4.23v7.575l6.561 3.787V8.018zm0 8.405v7.575L15.28 24v-7.578z\"/></svg>",
 "helm": "<svg class=\"menu-logo logo-chip\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"#0F1689\" d=\"M12.337 0c-.475 0-.861 1.016-.861 2.269 0 .527.069 1.011.183 1.396a8.514 8.514 0 0 0-3.961 1.22 5.229 5.229 0 0 0-.595-1.093c-.606-.866-1.34-1.436-1.79-1.43a.381.381 0 0 0-.217.066c-.39.273-.123 1.326.596 2.353.267.381.559.705.84.948a8.683 8.683 0 0 0-1.528 1.716h1.734a7.179 7.179 0 0 1 5.381-2.421 7.18 7.18 0 0 1 5.382 2.42h1.733a8.687 8.687 0 0 0-1.32-1.53c.35-.249.735-.643 1.078-1.133.719-1.027.986-2.08.596-2.353a.382.382 0 0 0-.217-.065c-.45-.007-1.184.563-1.79 1.43a4.897 4.897 0 0 0-.676 1.325 8.52 8.52 0 0 0-3.899-1.42c.12-.39.193-.887.193-1.429 0-1.253-.386-2.269-.862-2.269zM1.624 9.443v5.162h1.358v-1.968h1.64v1.968h1.357V9.443H4.62v1.838H2.98V9.443zm5.912 0v5.162h3.21v-1.108H8.893v-.95h1.64v-1.142h-1.64v-.84h1.853V9.443zm4.698 0v5.162h3.218v-1.362h-1.86v-3.8zm4.706 0v5.162h1.364v-2.643l1.357 1.225 1.35-1.232v2.65h1.365V9.443h-.614l-2.1 1.914-2.109-1.914zm-11.82 7.28a8.688 8.688 0 0 0 1.412 1.548 5.206 5.206 0 0 0-.841.948c-.719 1.027-.985 2.08-.596 2.353.39.273 1.289-.338 2.007-1.364a5.23 5.23 0 0 0 .595-1.092 8.514 8.514 0 0 0 3.961 1.219 5.01 5.01 0 0 0-.183 1.396c0 1.253.386 2.269.861 2.269.476 0 .862-1.016.862-2.269 0-.542-.072-1.04-.193-1.43a8.52 8.52 0 0 0 3.9-1.42c.121.4.352.865.675 1.327.719 1.026 1.617 1.637 2.007 1.364.39-.273.123-1.326-.596-2.353-.343-.49-.727-.885-1.077-1.135a8.69 8.69 0 0 0 1.202-1.36h-1.771a7.174 7.174 0 0 1-5.227 2.252 7.174 7.174 0 0 1-5.226-2.252z\"/></svg>",
 "argocd": "<svg class=\"menu-logo\" viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" aria-hidden=\"true\"><path fill=\"#EF7B4D\" d=\"M12.581 0c.436.037.871.1 1.299.186 1.679.383 3.121 1.213 4.382 2.365 1.161 1.06 1.917 2.372 2.335 3.881.089.321.216.56.586.624.205.035.238.245.239.43.003.646.002 1.294.002 1.94l-.002 1.21c-.001.356-.116.479-.466.474-.211-.003-.293.119-.344.291-.146.489-.33.966-.552 1.426-.818 1.682-2.084 2.938-3.688 3.87-.077.045-.155.088-.233.131-.252.137-.258.146-.155.415.114.299.358.529.664.625.269.096.553.134.827.21a.672.672 0 0 1 .236.094c-.066.082-.156.067-.231.082-.36.073-.713.184-1.086.17a1.275 1.275 0 0 1-.438-.064c-.114-.045-.152-.006-.176.109a5.354 5.354 0 0 0-.084.92c-.015.617-.071 1.23-.112 1.844-.042.598-.018.651.558.842.281.094.563.187.842.286.069.024.15.038.192.117-.04.057-.098.035-.146.035-.493.003-.985.005-1.478.001-.524-.005-.806-.282-.845-.803-.055-.762-.12-1.524-.182-2.286a.947.947 0 0 0-.026-.12c-.079.455-.065.879-.084 1.298-.023.528-.008 1.057-.007 1.584 0 .27.086.388.335.483.359.135.711.295 1.114.262.141-.012.276.062.402.129.032.017.073.033.069.073-.004.043-.049.047-.084.045-.657-.019-1.317.065-1.972-.028-.323-.046-.533-.236-.631-.552-.094-.303-.114-.617-.137-.93-.046-.626-.078-1.253-.116-1.88a.222.222 0 0 0-.061-.171.282.282 0 0 0-.031.193c-.002.956-.002 1.911-.001 2.866 0 .388.123.575.494.708.481.172.976.298 1.47.423.11.028.225.047.242.192h-1.852c-.051-.01-.103-.022-.155-.03-.701-.1-1.001-.372-1.143-1.042l-.067-.331-.226-1.103c-.069.12-.118.25-.144.386-.083.399-.151.802-.243 1.2-.113.493-.444.763-.932.857l-.33.063H8.558c.057-.171.216-.185.355-.221.476-.127.96-.223 1.417-.409a.603.603 0 0 0 .397-.521c.058-.435.002-.865-.013-1.296a1.528 1.528 0 0 0-.078-.315.405.405 0 0 0-.071.207c-.026.296-.049.591-.075.886-.038.432-.273.716-.679.81a1.702 1.702 0 0 1-.37.045c-.557.003-1.115-.001-1.673-.005-.048 0-.109.019-.148-.065.178-.103.377-.168.582-.187a5.67 5.67 0 0 0 .939-.193c.42-.114.522-.249.512-.687-.023-.931-.091-1.86-.069-2.791.004-.184.001-.368.001-.551a2.387 2.387 0 0 0-.05.385 40.299 40.299 0 0 1-.186 2.623c-.052.513-.296.748-.804.805-.446.051-.889.002-1.332-.02-.108-.006-.234.012-.339-.064.043-.066.106-.07.16-.087.362-.115.725-.224 1.086-.344.246-.081.35-.235.355-.492a2.241 2.241 0 0 0-.003-.232 45.315 45.315 0 0 1-.105-2.149 5.487 5.487 0 0 0-.035-.478c-.024-.188-.131-.287-.295-.258-.505.092-.99-.006-1.473-.139-.059-.016-.134-.007-.178-.088a.986.986 0 0 1 .285-.09c.255-.052.507-.121.753-.208.312-.112.564-.347.695-.651.089-.203.056-.317-.112-.398-1.418-.683-2.512-1.73-3.391-3.017a8.152 8.152 0 0 1-1.123-2.447c-.067-.246-.156-.3-.383-.26-.306.053-.401.006-.535-.273v-3.49c.144-.303.205-.341.534-.329.235.01.247-.004.309-.242.396-1.508 1.082-2.861 2.171-3.988C6.9 1.42 8.523.631 10.34.203c.456-.108.922-.15 1.387-.203h.854Zm7.974 8.948a7.34 7.34 0 0 0-.048-.938 8.353 8.353 0 0 0-.099-.65c-.598-2.964-2.344-5.02-5.051-6.268-1.553-.715-3.21-.835-4.878-.511-3.248.633-5.396 2.583-6.539 5.652-.436 1.173-.495 2.406-.37 3.65.087.935.339 1.846.745 2.694.585 1.213 1.444 2.207 2.477 3.058.343.286.719.528 1.121.719.235.111.247.105.245-.146.006-.16.003-.32-.009-.48-.125-1.02-.142-2.045-.169-3.069a.392.392 0 0 0-.184-.353c-.385-.268-.713-.592-.921-1.019-.474-.97-.372-2.361.813-3.215.136-.097.217-.19.198-.373a1.724 1.724 0 0 1 .031-.442c.177-1.187.748-2.138 1.722-2.84.68-.492 1.442-.772 2.286-.782.483-.007.953.11 1.414.244 1.609.467 2.846 2.07 2.845 3.697a.64.64 0 0 0 .268.565c.463.371.821.83.943 1.426.22 1.077-.083 1.982-.979 2.634-.266.194-.347.406-.333.698.002.047 0 .095-.002.142l-.062 1.439c-.025.586-.138 1.165-.117 1.754.008.223.006.226.201.128a7.46 7.46 0 0 0 2.393-1.903c1.32-1.577 2.074-3.372 2.059-5.511ZM9.117 12.102c1.489.021 2.443-1.578 1.716-2.879a1.937 1.937 0 0 0-1.699-.991c-1.094-.004-1.954.822-1.958 1.881-.005 1.148.813 1.985 1.941 1.989Zm5.794 0c1.101.002 1.935-.823 1.935-1.917 0-1.091-.846-1.949-1.92-1.947-1.064.003-1.94.866-1.943 1.915-.003 1.105.831 1.948 1.928 1.949Zm-1.472 1.937c-.208.128-.407.277-.63.384-.536.257-1.063.257-1.579-.048-.158-.094-.308-.201-.464-.298-.047-.028-.092-.103-.15-.062-.044.03-.01.1-.001.151.037.179.064.362.082.544.027.565.293.992.742 1.31a.984.984 0 0 0 .791.186c.565-.119 1.025-.614 1.124-1.218.043-.266.005-.544.109-.803a.133.133 0 0 0-.024-.146Zm-8.78-4.92c-.012-1.102.143-2.055.54-2.961.633-1.443 1.642-2.553 2.98-3.374a.378.378 0 0 1 .459.067c.06.06.036.118.01.178a1.09 1.09 0 0 1-.48.51c-1.079.639-1.829 1.571-2.357 2.688a6.325 6.325 0 0 0-.618 2.986c.055 1.309.439 2.516 1.213 3.588.088.104.148.23.173.365.01.08.059.168-.031.228a.312.312 0 0 1-.288.041.502.502 0 0 1-.234-.185c-.72-.979-1.193-2.056-1.331-3.273-.036-.326-.004-.653-.036-.858ZM8.94 2.34a.373.373 0 0 1 .378-.382c.211.001.409.226.416.473.004.138-.309.39-.476.386-.189-.005-.318-.2-.318-.477Zm-.465 7.48a.609.609 0 0 1 .586-.631c.38-.003.671.271.675.633.004.356-.27.622-.639.621-.38-.002-.621-.241-.622-.623Zm6.496.623c-.381-.002-.625-.255-.621-.646a.635.635 0 0 1 .596-.613.656.656 0 0 1 .669.643c.001.354-.275.618-.644.616Z\"/></svg>"
};
LOGOS.incident = '<svg class="menu-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#f87171" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5h.01"/></svg>';

const SRE_SECTIONS = [
  {
    id: "prometheus", group: "observe", file: "prometheus", badge: "prometheus", code: "promtool",
    name: "Prometheus", navDesc: "rules, queries, Alertmanager", pill: "Prometheus 3.16 · Alertmanager 0.35",
    title: "Prometheus & Alertmanager: Rules, Queries, Silences",
    subtitle: "Validate config and rules, query from the shell, write alerting and recording rules, and silence alerts with amtool",
    commands: [
      {
        id: "prom-check",
        desc: "Validate the config and rule files before reloading",
        cmd: "promtool check config /etc/prometheus/prometheus.yml",
        flags: [
          ["check config", "Config plus every rule file it references"],
          ["check rules <files>", "Rule files alone"],
          ["--lint=all", "Extra checks (duplicate rules, too-long scrape interval)"],
          ["--lint-fatal", "Make lint findings fail the check (for CI)"],
          ["test rules <test.yml>", "Unit-test alerting rules against fake series"]
        ],
        subcommands: [
          ["promtool check rules /etc/prometheus/rules/*.yml", "Rules only"],
          ["promtool test rules tests/gpu-alerts-test.yml", "Run rule unit tests"]
        ],
        tip: "Run check config in CI so a typo never reaches the server",
        tags: ["prometheus", "promtool", "check", "rules", "ci"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/", "title": "promtool"}, {"url": "https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/", "title": "Prometheus: unit testing rules"}]}
      },
      {
        id: "prom-query",
        desc: "Query from the shell (instant query)",
        cmd: "promtool query instant http://localhost:9090 'up == 0'",
        flags: [
          ["query instant <server> <expr>", "Value now; --time for another moment"],
          ["query range --start --end --step", "A time range"],
          ["-o json", "JSON output for jq"],
          ["HTTP API", "GET /api/v1/query?query=… is the same thing for curl"]
        ],
        subcommands: [
          ["curl -s http://localhost:9090/api/v1/query --data-urlencode 'query=up == 0' | jq '.data.result[].metric.instance'", "Same query with curl and jq"],
          ["curl -s 'http://localhost:9090/api/v1/targets?state=active' | jq -r '.data.activeTargets[] | select(.health != \"up\") | .scrapeUrl'", "Targets that are not being scraped"],
          ["curl -s http://localhost:9090/-/ready", "Ready to answer queries? (/-/healthy is always 200)"]
        ],
        tip: "up == 0 is the first query in any monitoring incident",
        tags: ["promql", "query", "api", "targets", "curl"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/", "title": "promtool"}, {"url": "https://prometheus.io/docs/prometheus/latest/querying/api/", "title": "Prometheus HTTP API"}, {"url": "https://prometheus.io/docs/prometheus/latest/management_api/", "title": "Prometheus management API"}]}
      },
      {
        id: "prom-alert-rule",
        desc: "An alerting rule (YAML)",
        cmd: "groups:\n  - name: node\n    rules:\n      - alert: NodeExporterDown\n        expr: up{job=\"node\"} == 0\n        for: 5m\n        keep_firing_for: 5m\n        labels:\n          severity: page\n        annotations:\n          summary: \"{{ $labels.instance }} is not being scraped\"",
        flags: [
          ["for: 5m", "Must be true for 5 minutes before it fires: filters blips"],
          ["keep_firing_for", "Keep firing this long after it clears (stops flapping)"],
          ["labels.severity", "What Alertmanager routes on"],
          ["annotations", "Human text; {{ $labels.x }} inserts a label"]
        ],
        subcommands: [],
        tip: "Every paging alert needs a runbook link in its annotations",
        tags: ["alerting", "rules", "yaml", "for", "severity"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://prometheus.io/docs/prometheus/latest/configuration/alerting_rules/", "title": "Prometheus: alerting rules"}]}
      },
      {
        id: "prom-recording",
        desc: "A recording rule and its naming convention",
        cmd: "groups:\n  - name: gpu\n    rules:\n      - record: instance:dcgm_fi_dev_gpu_util:avg\n        expr: avg by (instance) (DCGM_FI_DEV_GPU_UTIL)",
        flags: [
          ["level:metric:operations", "The documented naming form: aggregation level, metric, operations (newest first)"],
          ["Valid metric name", "The record name must be a valid metric name"],
          ["Why", "Precompute expensive queries that dashboards run every refresh"],
          ["DCGM names", "dcgm-exporter 4.9.0 renamed metrics: check yours (Grafana suite)"]
        ],
        subcommands: [],
        tip: "Use the recorded series in dashboards and alerts, not the raw expression",
        tags: ["recording", "rules", "naming", "dcgm"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://prometheus.io/docs/prometheus/latest/configuration/recording_rules/", "title": "Prometheus: recording rules"}, {"url": "https://prometheus.io/docs/practices/rules/", "title": "Prometheus: recording rule naming"}]}
      },
      {
        id: "prom-amtool",
        desc: "Alertmanager: check config, list alerts, silence",
        cmd: "amtool alert query --alertmanager.url=http://localhost:9093",
        flags: [
          ["check-config <file>", "Validate alertmanager.yml"],
          ["alert query [matchers]", "Firing alerts, for example alertname=\"NodeExporterDown\""],
          ["silence add <matchers>", "Create a silence (changes state); check amtool silence add --help for duration and comment flags"],
          ["silence query", "Active silences"],
          ["silence expire <id>", "End a silence early (changes state)"],
          ["Matchers", "=, !=, =~, !~, for example instance=~\"node0[1-4].*\""]
        ],
        subcommands: [
          ["amtool check-config /etc/alertmanager/alertmanager.yml", "Validate before reload"],
          ["amtool silence query --alertmanager.url=http://localhost:9093", "What is silenced right now"],
          ["amtool config routes --alertmanager.url=http://localhost:9093", "Show the routing tree"]
        ],
        tip: "Silence the drained node, not the alert name, during maintenance",
        tags: ["alertmanager", "amtool", "silence", "routes"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://github.com/prometheus/alertmanager#amtool", "title": "Alertmanager README: amtool"}]}
      },
      {
        id: "prom-reload",
        desc: "Reload the config after a check",
        cmd: "curl -X POST http://localhost:9090/-/reload",
        flags: [
          ["--web.enable-lifecycle", "Required for /-/reload; off by default"],
          ["SIGHUP", "The other way to reload: systemctl reload prometheus, or kill -HUP"],
          ["Check first", "promtool check config, then reload"],
          ["Alertmanager 0.34.2+", "No CORS headers by default any more; --web.cors.origin restores them"]
        ],
        subcommands: [
          ["curl -s http://localhost:9090/api/v1/status/config | jq -r .data.yaml | head", "The config Prometheus actually loaded"]
        ],
        tip: "A failed reload keeps the old config; check the log for the error",
        tags: ["reload", "lifecycle", "config", "sighup"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://prometheus.io/docs/prometheus/latest/management_api/", "title": "Prometheus management API"}, {"url": "https://github.com/prometheus/alertmanager/blob/main/CHANGELOG.md", "title": "Alertmanager changelog"}], "note": "The CORS change is in Alertmanager 0.34.2 (Oct 29, 2026); 0.35.0 is current."}
      }
    ],
    proTip: {
      desc: "Export your own metrics with the node_exporter textfile collector",
      cmd: "echo \"gpu_burnin_last_success_timestamp $(date +%s)\" > /var/lib/node_exporter/textfile/burnin.prom.$$ && mv /var/lib/node_exporter/textfile/burnin.prom.$$ /var/lib/node_exporter/textfile/burnin.prom",
      details: "Start node_exporter with --collector.textfile.directory=/var/lib/node_exporter/textfile. It reads every *.prom file in that directory. Write to a temporary name and mv it into place, so a scrape never sees a half-written file. Timestamps inside the file are not supported.",
      flags: [["*.prom", "Files it reads"], ["Write then mv", "Atomic update"]],
      tip: "Good for cron jobs: alert when the timestamp gets old",
      src: {"verified": "2026-11-10", "refs": [{"url": "https://github.com/prometheus/node_exporter#textfile-collector", "title": "node_exporter: textfile collector"}], "note": "node_exporter's README shows the write-then-mv pattern and says timestamps are not supported."}
    }
  },
  {
    id: "ansible", group: "automate", file: "ansible", badge: "ansible", code: "ansible",
    name: "Ansible", navDesc: "ad-hoc, playbooks, vault", pill: "ansible-core 2.22",
    title: "Ansible: Ad-hoc Commands, Playbooks and Vault",
    subtitle: "Run a read-only check across a fleet, dry-run a playbook with a diff, and keep BMC passwords encrypted with ansible-vault",
    commands: [
      {
        id: "ansible-ping",
        desc: "Can Ansible reach every host?",
        cmd: "ansible all -i inventory.ini -m ansible.builtin.ping",
        flags: [
          ["all", "Host pattern: a group, a host, or all"],
          ["-i <inventory>", "Inventory file or directory"],
          ["-m ansible.builtin.ping", "Checks SSH and Python, not ICMP"],
          ["-l / --limit", "Narrow the pattern further: -l 'gpu:&rack12'"],
          ["-f <n>", "Forks: hosts in parallel"]
        ],
        subcommands: [
          ["ansible-inventory -i inventory.ini --graph", "Groups and hosts as a tree"],
          ["ansible-inventory -i inventory.ini --host node07", "Variables for one host"]
        ],
        tip: "ping first: most failures are SSH or inventory, not the playbook",
        tags: ["ansible", "ping", "inventory", "ad-hoc"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.ansible.com/ansible/latest/cli/ansible.html", "title": "ansible CLI"}, {"url": "https://docs.ansible.com/ansible/latest/inventory_guide/intro_patterns.html", "title": "Ansible: patterns"}, {"url": "https://docs.ansible.com/ansible/latest/cli/ansible-inventory.html", "title": "ansible-inventory"}]}
      },
      {
        id: "ansible-adhoc",
        desc: "One read-only command across a group",
        cmd: "ansible gpu -i inventory.ini -m ansible.builtin.shell -a 'nvidia-smi -L | wc -l'",
        flags: [
          ["-m ansible.builtin.shell", "Needed for pipes and redirects; the default command module has none"],
          ["-a '<args>'", "Module arguments; single quotes keep $ and | for the remote shell"],
          ["-b / --become", "Run as root (changes what the command can touch)"],
          ["-K", "Prompt for the become password"],
          ["-o", "One line per host"]
        ],
        subcommands: [
          ["ansible gpu -i inventory.ini -m ansible.builtin.shell -a 'uptime' -o", "Uptime per host, one line each"]
        ],
        tip: "Ad-hoc is for read-only checks; changes belong in a reviewed playbook",
        tags: ["ad-hoc", "shell", "fleet", "become"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.ansible.com/ansible/latest/cli/ansible.html", "title": "ansible CLI"}, {"url": "https://docs.ansible.com/ansible/latest/collections/ansible/builtin/shell_module.html", "title": "ansible.builtin.shell"}]}
      },
      {
        id: "ansible-playbook-check",
        desc: "Dry-run a playbook on one host with a diff",
        cmd: "ansible-playbook -i inventory.ini site.yml --check --diff --limit node07",
        flags: [
          ["--check", "Report what would change, change nothing"],
          ["--diff", "Show file and template differences"],
          ["--syntax-check", "Parse only"],
          ["--list-hosts / --list-tasks / --list-tags", "What would run, where"],
          ["--tags / --skip-tags", "Run part of a playbook"],
          ["--start-at-task '<name>'", "Resume after a failure"]
        ],
        subcommands: [
          ["ansible-playbook -i inventory.ini site.yml --syntax-check", "Parse only"],
          ["ansible-playbook -i inventory.ini site.yml --list-hosts", "Which hosts it targets"],
          ["ansible-playbook -i inventory.ini site.yml --limit node07", "The real run on one host (changes state)"]
        ],
        tip: "check + diff on one host, then the real run on that host, then the rest",
        tags: ["playbook", "check", "diff", "limit", "dry-run"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html", "title": "ansible-playbook"}, {"url": "https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_checkmode.html", "title": "Ansible: check mode"}]}
      },
      {
        id: "ansible-vault",
        desc: "Encrypt a secret for a playbook",
        cmd: "ansible-vault encrypt_string --prompt --name bmc_password",
        flags: [
          ["encrypt_string --prompt", "Type the secret at a prompt, so it never hits shell history"],
          ["--name", "Variable name in the output YAML"],
          ["create / edit / view <file>", "Whole encrypted files"],
          ["--ask-vault-password / --vault-password-file", "How playbooks unlock it"],
          ["rekey", "Change the vault password"]
        ],
        subcommands: [
          ["ansible-vault create group_vars/bmc/vault.yml", "A new encrypted vars file"],
          ["ansible-playbook -i inventory.ini site.yml --ask-vault-password --check", "Use it"]
        ],
        tip: "Never put a vault password file in the repo",
        tags: ["vault", "secrets", "encrypt", "password"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.ansible.com/ansible/latest/cli/ansible-vault.html", "title": "ansible-vault"}]}
      },
      {
        id: "ansible-tools",
        desc: "Collections, config and module docs",
        cmd: "ansible-doc -s ansible.builtin.copy",
        flags: [
          ["ansible-doc -s <module>", "A ready-to-paste task snippet"],
          ["ansible-config dump --only-changed", "Settings that differ from the default"],
          ["ansible-galaxy collection install -r requirements.yml", "Install pinned collections"],
          ["ansible-lint", "Linter for playbooks, roles and collections"]
        ],
        subcommands: [
          ["ansible-config dump --only-changed", "Why does it behave differently here?"],
          ["ansible-galaxy collection install -r requirements.yml", "Same collections everywhere"]
        ],
        tip: "Pin collections in requirements.yml",
        tags: ["ansible-doc", "galaxy", "config", "lint"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.ansible.com/ansible/latest/cli/ansible-doc.html", "title": "ansible-doc"}, {"url": "https://docs.ansible.com/ansible/latest/cli/ansible-config.html", "title": "ansible-config"}, {"url": "https://docs.ansible.com/ansible/latest/cli/ansible-galaxy.html", "title": "ansible-galaxy"}, {"url": "https://ansible.readthedocs.io/projects/lint/", "title": "ansible-lint"}]}
      }
    ],
    proTip: {
      desc: "Gather facts as a read-only inventory",
      cmd: "ansible gpu -i inventory.ini -m ansible.builtin.setup -a 'filter=ansible_product_serial'",
      details: "The setup module collects facts without changing anything. Filter to the fact you need: ansible_product_serial, ansible_bios_version, ansible_kernel. Faster than SSHing to each node to compare BIOS versions.",
      flags: [["filter=", "Glob of fact names"], ["Read-only", "setup changes nothing"]],
      tip: "Compare BIOS versions across a rack in one command",
      src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.ansible.com/ansible/latest/collections/ansible/builtin/setup_module.html", "title": "ansible.builtin.setup"}]}
    }
  },
  {
    id: "terraform", group: "automate", file: "terraform", badge: "terraform", code: "terraform",
    name: "Terraform / OpenTofu", navDesc: "plan, apply, state", pill: "Terraform 1.17 · OpenTofu 1.13",
    title: "Terraform and OpenTofu: Plan, Apply and State",
    subtitle: "The safe plan → review → apply loop, state commands, moved and import blocks, and the licence difference",
    commands: [
      {
        id: "tf-init-validate",
        desc: "Initialise, format and validate",
        cmd: "terraform init && terraform fmt -check -recursive && terraform validate",
        flags: [
          ["init", "Download providers and modules; safe to run again"],
          ["init -upgrade", "Newest providers the constraints allow, ignoring the lock file"],
          ["fmt -check -recursive", "Fail if any file is not formatted (CI)"],
          ["validate", "Syntax and internal consistency, no API calls"],
          ["tofu", "OpenTofu's CLI: the same subcommands with tofu in place of terraform"]
        ],
        subcommands: [
          ["terraform providers lock -platform=linux_amd64 -platform=darwin_arm64", "Lock-file hashes for every platform your team uses"]
        ],
        tip: "Commit .terraform.lock.hcl",
        tags: ["terraform", "opentofu", "init", "fmt", "validate"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://developer.hashicorp.com/terraform/cli/commands/init", "title": "terraform init"}, {"url": "https://developer.hashicorp.com/terraform/cli/commands/fmt", "title": "terraform fmt"}, {"url": "https://developer.hashicorp.com/terraform/cli/commands/validate", "title": "terraform validate"}, {"url": "https://developer.hashicorp.com/terraform/cli/commands/providers/lock", "title": "terraform providers lock"}, {"url": "https://opentofu.org/docs/cli/commands/", "title": "OpenTofu CLI"}]}
      },
      {
        id: "tf-plan-apply",
        desc: "Save a plan, review it, apply exactly that plan",
        cmd: "terraform plan -out=tfplan",
        flags: [
          ["-out=tfplan", "Save the plan; it may contain secrets in clear text, so never commit it"],
          ["apply tfplan", "Apply exactly what you reviewed (changes state)"],
          ["destroy", "Delete everything in the configuration (changes state)"],
          ["-target", "Exceptional cases only: it can hide drift. Split configurations instead"]
        ],
        subcommands: [
          ["terraform show tfplan", "Review the saved plan"],
          ["terraform apply tfplan", "Apply the reviewed plan (changes state)"]
        ],
        tip: "Read every - and -/+ (destroy) line in the plan before you apply",
        tags: ["plan", "apply", "destroy", "target"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://developer.hashicorp.com/terraform/cli/commands/plan", "title": "terraform plan"}, {"url": "https://developer.hashicorp.com/terraform/cli/commands/apply", "title": "terraform apply"}, {"url": "https://developer.hashicorp.com/terraform/cli/commands/show", "title": "terraform show"}]}
      },
      {
        id: "tf-state",
        desc: "Inspect state",
        cmd: "terraform state list",
        flags: [
          ["state list [address]", "Every resource Terraform tracks"],
          ["state show <address>", "One resource's attributes (-json needs 1.16+)"],
          ["state mv <src> <dst>", "Rename without destroy (changes state); -dry-run first"],
          ["output -json", "Outputs for scripts; shows sensitive values in clear text"]
        ],
        subcommands: [
          ["terraform state show 'module.rack12.aws_instance.node[\"07\"]'", "Quote addresses with brackets"],
          ["terraform output -json | jq .", "Outputs for a script"]
        ],
        tip: "Prefer a moved block to state mv: it is reviewed in the plan",
        tags: ["state", "list", "show", "output"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://developer.hashicorp.com/terraform/cli/commands/state/list", "title": "terraform state list"}, {"url": "https://developer.hashicorp.com/terraform/cli/commands/state/show", "title": "terraform state show"}, {"url": "https://developer.hashicorp.com/terraform/cli/commands/state/mv", "title": "terraform state mv"}, {"url": "https://developer.hashicorp.com/terraform/cli/commands/output", "title": "terraform output"}], "note": "state show -json needs Terraform 1.16 or later."}
      },
      {
        id: "tf-moved-import",
        desc: "moved and import blocks (reviewed in the plan)",
        cmd: "moved {\n  from = aws_instance.worker\n  to   = aws_instance.helper\n}\n\nimport {\n  to = aws_instance.legacy\n  id = \"i-0123456789abcdef0\"\n}",
        flags: [
          ["moved", "Renames the existing object in state before planning: no destroy/create"],
          ["import", "Adopts an existing object; a matching resource block must exist"],
          ["plan -generate-config-out=gen.tf", "Experimental: write the resource block for an import"],
          ["Why blocks", "They show up in plan and code review; state commands don't"]
        ],
        subcommands: [],
        tip: "Keep moved blocks until every workspace has applied them",
        tags: ["moved", "import", "refactor", "hcl"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://developer.hashicorp.com/terraform/language/moved", "title": "Terraform: moved block"}, {"url": "https://developer.hashicorp.com/terraform/language/import", "title": "Terraform: import block"}, {"url": "https://developer.hashicorp.com/terraform/language/import/generating-configuration", "title": "Terraform: generating configuration"}], "note": "plan -generate-config-out is still experimental in Terraform 1.17."}
      }
    ],
    proTip: {
      desc: "Terraform or OpenTofu?",
      cmd: "terraform version; tofu version",
      details: "Terraform is under the Business Source License 1.1 (production use allowed, except a competing hosted offering; each version becomes MPL 2.0 after four years). OpenTofu is the MPL 2.0 fork with the same workflow. Pick one per repository, and pin its version in CI.",
      flags: [["BUSL 1.1", "Terraform"], ["MPL 2.0", "OpenTofu"]],
      tip: "Don't mix the two on one state file",
      src: {"verified": "2026-11-10", "refs": [{"url": "https://github.com/hashicorp/terraform/blob/main/LICENSE", "title": "Terraform LICENSE (BUSL 1.1)"}, {"url": "https://opentofu.org/", "title": "OpenTofu"}]}
    }
  },
  {
    id: "helm", group: "deliver", file: "helm", badge: "helm", code: "helm",
    name: "Helm", navDesc: "charts and releases (Helm 4)", pill: "Helm 4.3",
    title: "Helm 4: Charts, Releases and Rollbacks",
    subtitle: "Render before you install, upgrade with automatic rollback, read release history, and the Helm 4 flag renames",
    commands: [
      {
        id: "helm-repo",
        desc: "Add a chart repo and read its default values",
        cmd: "helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && helm repo update",
        flags: [
          ["repo add / update", "Register a chart repository and refresh its index"],
          ["search repo <term>", "Find charts"],
          ["show values <chart>", "Default values: start your values.yaml from these"],
          ["OCI", "Many charts are OCI references: helm install x oci://registry/chart"]
        ],
        subcommands: [
          ["helm search repo prometheus-community/kube-prometheus-stack --versions | head", "Available versions"],
          ["helm show values prometheus-community/kube-prometheus-stack > values.yaml", "Defaults to edit"]
        ],
        tip: "Pin --version on every install",
        tags: ["helm", "repo", "values", "chart"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://helm.sh/docs/helm/helm_repo_add/", "title": "helm repo add"}, {"url": "https://helm.sh/docs/helm/helm_search_repo/", "title": "helm search repo"}, {"url": "https://helm.sh/docs/helm/helm_show_values/", "title": "helm show values"}]}
      },
      {
        id: "helm-template",
        desc: "Render and lint before installing",
        cmd: "helm template mon prometheus-community/kube-prometheus-stack -f values.yaml -n monitoring > rendered.yaml",
        flags: [
          ["template", "Render the manifests locally; nothing touches the cluster"],
          ["lint <chart dir>", "Check a chart you maintain"],
          ["helm diff upgrade", "From the helm-diff plugin (third party): what an upgrade would change"]
        ],
        subcommands: [
          ["helm plugin install https://github.com/databus23/helm-diff", "Install helm-diff (Helm 4 verifies plugin provenance)"],
          ["helm diff upgrade mon prometheus-community/kube-prometheus-stack -f values.yaml -n monitoring", "Diff against the live release"]
        ],
        tip: "Review rendered.yaml or the diff before every upgrade",
        tags: ["template", "lint", "diff", "render"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://helm.sh/docs/helm/helm_template/", "title": "helm template"}, {"url": "https://helm.sh/docs/helm/helm_lint/", "title": "helm lint"}, {"url": "https://github.com/databus23/helm-diff", "title": "helm-diff plugin"}]}
      },
      {
        id: "helm-upgrade",
        desc: "Install or upgrade, rolling back on failure",
        cmd: "helm upgrade --install mon prometheus-community/kube-prometheus-stack -n monitoring --create-namespace -f values.yaml --version <chart-version> --rollback-on-failure",
        flags: [
          ["upgrade --install", "Install if missing, upgrade if present (changes state)"],
          ["--rollback-on-failure", "Helm 4 name for --atomic; also waits for resources"],
          ["--force-replace", "Helm 4 name for --force"],
          ["--wait / --timeout", "Wait for resources (default 5m)"],
          ["Server-side apply", "Helm 4 default for new installs; Helm 3 releases keep client-side"],
          ["-f values.yaml", "Repeatable; the rightmost file wins"]
        ],
        subcommands: [],
        tip: "Old names (--atomic, --force) still work in Helm 4 with a warning",
        tags: ["upgrade", "install", "atomic", "rollback-on-failure", "helm4"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://helm.sh/docs/helm/helm_upgrade/", "title": "helm upgrade"}, {"url": "https://helm.sh/docs/overview/", "title": "Helm 4 overview"}], "note": "Checked against Helm 4.3.1; the old flag names still work with a deprecation warning."}
      },
      {
        id: "helm-history",
        desc: "Release history and rollback",
        cmd: "helm history mon -n monitoring",
        flags: [
          ["list -A", "Every release in every namespace"],
          ["history <release>", "Revisions with status and chart version"],
          ["get values / get manifest", "What is deployed now"],
          ["rollback <release> <rev>", "Go back to a revision (changes state)"],
          ["uninstall", "Remove the release (changes state)"]
        ],
        subcommands: [
          ["helm get values mon -n monitoring", "Values in use"],
          ["helm rollback mon 3 -n monitoring", "Back to revision 3 (changes state)"]
        ],
        tip: "history tells you which revision last worked",
        tags: ["history", "rollback", "list", "get"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://helm.sh/docs/helm/helm_history/", "title": "helm history"}, {"url": "https://helm.sh/docs/helm/helm_rollback/", "title": "helm rollback"}, {"url": "https://helm.sh/docs/helm/helm_get_values/", "title": "helm get values"}]}
      }
    ],
    proTip: {
      desc: "Helm 3 end of support",
      cmd: "helm version",
      details: "Helm 3 gets security patches through February 2027 (its last feature release was September 9, 2026). Helm 4 reads Helm 3 releases without conversion. Check CI scripts for --atomic and --force (renamed), and for helm version --client, which Helm 4 rejects.",
      flags: [["Helm 4.3.1", "Current release"], ["helm version", "Client version"]],
      tip: "Upgrade the CLI on jumpboxes and CI together",
      src: {"verified": "2026-11-10", "refs": [{"url": "https://github.com/helm/helm/releases", "title": "Helm releases"}, {"url": "https://helm.sh/blog/", "title": "Helm blog (Helm 3 end of life)"}, {"url": "https://helm.sh/docs/overview/", "title": "Helm 4 overview"}], "note": "Corrected 2026-11-10: Helm 3 security patches run through February 2027 (not Nov 11, 2026). helm version --client was removed in Helm 4 (changelog, PR #31301)."}
    }
  },
  {
    id: "argocd", group: "deliver", file: "argocd", badge: "argocd", code: "argocd",
    name: "Argo CD", navDesc: "GitOps sync and rollback", pill: "Argo CD 3.6",
    title: "Argo CD: GitOps Status, Diff, Sync and Rollback",
    subtitle: "Log in, see what is out of sync and why, sync safely, wait for health, and roll back",
    commands: [
      {
        id: "argocd-login",
        desc: "Log in with SSO",
        cmd: "argocd login argocd.example.com --sso --grpc-web",
        flags: [
          ["--sso", "Browser-based SSO login"],
          ["--grpc-web", "For proxies or load balancers without HTTP/2"],
          ["--core", "Talk to Kubernetes directly, no API server login"],
          ["--username / --password", "Local accounts; avoid typing the password inline"]
        ],
        subcommands: [],
        tip: "SSO keeps passwords off the jumpbox",
        tags: ["argocd", "login", "sso"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_login/", "title": "argocd login"}], "note": "The flags exist separately in the docs; --sso and --core aren't shown together."}
      },
      {
        id: "argocd-status",
        desc: "What is out of sync, and what differs",
        cmd: "argocd app list",
        flags: [
          ["app list", "Sync and health status of every application"],
          ["app get <app>", "Resources, sync status and conditions"],
          ["app diff <app>", "Git (target) vs live state"],
          ["app history <app>", "Deployed revisions with IDs"]
        ],
        subcommands: [
          ["argocd app get dcgm-exporter", "One application in detail"],
          ["argocd app diff dcgm-exporter", "What would change on sync"]
        ],
        tip: "OutOfSync + Healthy is drift; Degraded is broken",
        tags: ["status", "diff", "history", "drift"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_list/", "title": "argocd app list"}, {"url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_diff/", "title": "argocd app diff"}]}
      },
      {
        id: "argocd-sync",
        desc: "Preview, then sync",
        cmd: "argocd app sync dcgm-exporter --dry-run",
        flags: [
          ["--dry-run", "Preview the apply without changing the cluster"],
          ["(no flag)", "Sync for real (changes state)"],
          ["--prune", "Also delete resources no longer in Git (changes state)"],
          ["--resource <group:kind:name>", "Sync one resource"],
          ["app wait --health --timeout <s>", "Block until healthy (seconds)"]
        ],
        subcommands: [
          ["argocd app sync dcgm-exporter", "Real sync (changes state)"],
          ["argocd app wait dcgm-exporter --health --timeout 300", "Wait up to 5 minutes for health"]
        ],
        tip: "--prune deletes things: read the diff first",
        tags: ["sync", "dry-run", "prune", "wait"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_sync/", "title": "argocd app sync"}, {"url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_wait/", "title": "argocd app wait"}]}
      },
      {
        id: "argocd-rollback",
        desc: "Roll back, and the auto-sync gotcha",
        cmd: "argocd app history dcgm-exporter",
        flags: [
          ["app rollback <app> [ID]", "Back to a history ID, or the previous one (changes state)"],
          ["Auto-sync blocks rollback", "Rollback can't run while automated sync is on"],
          ["app set --sync-policy manual", "Turn auto-sync off first (changes state)"],
          ["Real fix", "Revert the commit in Git; that is the GitOps rollback"]
        ],
        subcommands: [
          ["argocd app set dcgm-exporter --sync-policy manual", "Pause auto-sync (changes state)"],
          ["argocd app rollback dcgm-exporter", "Previous revision (changes state)"]
        ],
        tip: "Revert in Git when you can; CLI rollback is for emergencies",
        tags: ["rollback", "auto-sync", "gitops", "revert"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_rollback/", "title": "argocd app rollback"}, {"url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_set/", "title": "argocd app set"}, {"url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/", "title": "Argo CD: automated sync policy"}]}
      }
    ],
    proTip: {
      desc: "Automated sync with prune and self-heal",
      cmd: "spec:\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true",
      details: "automated: {} alone syncs on Git changes but never deletes; prune: true deletes resources removed from Git; selfHeal: true reverts manual changes in the cluster. The same from the CLI: argocd app set <app> --sync-policy automated --auto-prune --self-heal.",
      flags: [["prune", "Off by default"], ["selfHeal", "Undo kubectl edits"]],
      tip: "With selfHeal on, a hotfix made with kubectl is undone: change Git instead",
      src: {"verified": "2026-11-10", "refs": [{"url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/", "title": "Argo CD: automated sync policy"}]}
    }
  },
  {
    id: "incident", group: "observe", file: "incident-response", badge: "incident", code: "IC",
    name: "Incident response", navDesc: "roles, triage, postmortem", pill: "Google SRE practice",
    title: "Incident Response: Roles, the First 15 Minutes, and the Postmortem",
    subtitle: "Declare early, assign roles, keep a timeline, mitigate before root-causing, and write a blameless postmortem",
    commands: [
      {
        id: "ir-roles",
        desc: "Roles (Google SRE incident management)",
        cmd: "printf '%s\\n' 'IC: <name>' 'Ops lead: <name>' 'Comms lead: <name>' 'Started (UTC): '\"$(date -u +%FT%TZ)\"",
        flags: [
          ["Incident Commander (IC)", "Coordinates, delegates, decides. Holds every role nobody else has"],
          ["Operations lead (OL)", "The only one changing systems"],
          ["Communications lead (CL)", "Regular updates to stakeholders; fields questions"],
          ["Handoff", "Explicit: \"You're now IC, okay?\", and wait for the yes"],
          ["Declare early", "Declaring and standing down costs less than a late incident"]
        ],
        subcommands: [],
        tip: "One person changes production at a time: the Ops lead",
        tags: ["incident", "roles", "ic", "comms", "sre"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://sre.google/sre-book/managing-incidents/", "title": "Google SRE book: managing incidents"}, {"url": "https://sre.google/workbook/incident-response/", "title": "SRE workbook: incident response"}]}
      },
      {
        id: "ir-first15",
        desc: "First 15 minutes on a node: facts, in UTC",
        cmd: "date -u; uptime; journalctl -p err -b --since '-1h' --no-pager | tail -n 50",
        flags: [
          ["date -u", "Every timeline entry in UTC"],
          ["uptime", "Recent reboot? Load?"],
          ["journalctl -p err -b", "Errors since boot"],
          ["dmesg -T --level=err,crit", "Kernel errors (Xid, MCE, link down)"],
          ["Scheduler", "Is it already drained? sinfo -R / kubectl get node"]
        ],
        subcommands: [
          ["dmesg -T --level=err,crit | tail -n 40", "Kernel errors"],
          ["sinfo -R", "Drained nodes and their reasons"],
          ["amtool alert query --alertmanager.url=http://localhost:9093", "What is firing"]
        ],
        tip: "Mitigate first (drain, fail over), find the root cause after",
        tags: ["triage", "timeline", "utc", "journalctl", "dmesg"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://sre.google/workbook/incident-response/", "title": "SRE workbook: incident response"}, {"url": "https://man7.org/linux/man-pages/man1/journalctl.1.html", "title": "journalctl(1)"}]}
      },
      {
        id: "ir-timeline",
        desc: "Keep a timeline as you go",
        cmd: "echo \"$(date -u +%FT%TZ) <what you saw or did>\" >> cases/<ticket>/timeline.md",
        flags: [
          ["One line per fact or action", "Time, who, what, result"],
          ["Commands too", "The command and its key output, with secrets removed"],
          ["Field notes", "The home page's Field notes log entries per server, in Markdown"],
          ["Feeds the postmortem", "A good timeline writes half the postmortem"]
        ],
        subcommands: [],
        tip: "Replace the placeholders before you run it",
        tags: ["timeline", "notes", "case", "postmortem"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://sre.google/sre-book/managing-incidents/", "title": "Google SRE book: managing incidents"}]}
      },
      {
        id: "ir-postmortem",
        desc: "Blameless postmortem outline",
        cmd: "## Summary\n## Impact (who, how long)\n## Timeline (UTC)\n## Root cause and trigger\n## What went well / what didn't\n## Action items (owner, due date)",
        flags: [
          ["Blameless", "About systems and decisions, not people"],
          ["Impact", "Users, jobs, GPUs and hours affected"],
          ["Root cause vs trigger", "Why it was possible vs what set it off"],
          ["Action items", "Each with one owner and a date"]
        ],
        subcommands: [],
        tip: "Action items without owners don't get done",
        tags: ["postmortem", "blameless", "rca", "actions"],
        src: {"verified": "2026-11-10", "refs": [{"url": "https://sre.google/sre-book/postmortem-culture/", "title": "Google SRE book: postmortem culture"}]}
      }
    ],
    proTip: {
      desc: "Silence alerts for a node under maintenance",
      cmd: "amtool silence add instance=~\"node07.*\" --alertmanager.url=http://localhost:9093",
      details: "Silence by the node (instance matcher), not by alert name, so other nodes still page. Check amtool silence add --help for the comment and duration flags in your version, and expire the silence when the node is back.",
      flags: [["silence query", "List silences"], ["silence expire <id>", "End it"]],
      tip: "Put the ticket number in the silence comment",
      src: {"verified": "2026-11-10", "refs": [{"url": "https://github.com/prometheus/alertmanager#amtool", "title": "Alertmanager README: amtool"}]}
    }
  }
];

buildSuite({
  name: 'SRE toolkit', menuId: 'sre-nav-dropdown', hubFile: 'sre',
  hubLabel: 'SRE Toolkit Hub', hubTitle: 'SRE Toolkit Hub (Prometheus, Ansible, Terraform, Helm, Argo CD, incidents)',
  hubDocTitle: 'SRE Toolkit: Prometheus, Ansible, Terraform/OpenTofu, Helm, Argo CD & Incident Response Hub',
  hubPill: 'Observe · Automate · Deliver',
  hubSubtitle: 'Monitoring and alerting, fleet automation, infrastructure as code, Kubernetes delivery, and incident response',
  prompt: 'SRE', cursor: '$', varPrefix: 'SRE', tags: ['sre', 'devops'],
  menuIcon: '<svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l2.5-6 4 12 2.5-6h5" stroke="#34d399"/></svg>',
  logos: LOGOS, sections: SRE_SECTIONS,
  groups: [{ key: 'observe', heading: 'Observe &amp; respond' }, { key: 'automate', heading: 'Automate' }, { key: 'deliver', heading: 'Deliver' }]
});
