// sre.js
// Standalone interactive cheat sheet for SRE toolkit: SRE Toolkit Hub (Prometheus, Ansible, Terraform, Helm, Argo CD, incidents)
const SRE_HUB_DATA = [
  {
    "part": "prometheus",
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
    "part": "prometheus",
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
    "part": "prometheus",
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
    "part": "prometheus",
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
    "part": "prometheus",
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
    "part": "prometheus",
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
    "part": "prometheus",
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
  },
  {
    "part": "ansible",
    "id": "ansible-cmd-1",
    "badge": "ansible",
    "title": "Ansible: Can Ansible reach every host?",
    "subtitle": "Can Ansible reach every host?",
    "commands": [
      {
        "id": "ansible-ping",
        "desc": "Can Ansible reach every host?",
        "cmd": "ansible all -i inventory.ini -m ansible.builtin.ping",
        "details": "",
        "flags": [
          [
            "all",
            "Host pattern: a group, a host, or all"
          ],
          [
            "-i <inventory>",
            "Inventory file or directory"
          ],
          [
            "-m ansible.builtin.ping",
            "Checks SSH and Python, not ICMP"
          ],
          [
            "-l / --limit",
            "Narrow the pattern further: -l 'gpu:&rack12'"
          ],
          [
            "-f <n>",
            "Forks: hosts in parallel"
          ]
        ],
        "tip": "ping first: most failures are SSH or inventory, not the playbook",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "ansible",
          "ping",
          "inventory",
          "ad-hoc"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible.html",
              "title": "ansible CLI"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/inventory_guide/intro_patterns.html",
              "title": "Ansible: patterns"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-inventory.html",
              "title": "ansible-inventory"
            }
          ]
        }
      },
      {
        "id": "ansible-ping-sub-1",
        "desc": "Groups and hosts as a tree",
        "cmd": "ansible-inventory -i inventory.ini --graph",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "ansible",
          "ping",
          "inventory"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible.html",
              "title": "ansible CLI"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/inventory_guide/intro_patterns.html",
              "title": "Ansible: patterns"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-inventory.html",
              "title": "ansible-inventory"
            }
          ]
        }
      },
      {
        "id": "ansible-ping-sub-2",
        "desc": "Variables for one host",
        "cmd": "ansible-inventory -i inventory.ini --host node07",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "ansible",
          "ping",
          "inventory"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible.html",
              "title": "ansible CLI"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/inventory_guide/intro_patterns.html",
              "title": "Ansible: patterns"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-inventory.html",
              "title": "ansible-inventory"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ansible",
    "id": "ansible-cmd-2",
    "badge": "ansible",
    "title": "Ansible: One read-only command across a group",
    "subtitle": "One read-only command across a group",
    "commands": [
      {
        "id": "ansible-adhoc",
        "desc": "One read-only command across a group",
        "cmd": "ansible gpu -i inventory.ini -m ansible.builtin.shell -a 'nvidia-smi -L | wc -l'",
        "details": "",
        "flags": [
          [
            "-m ansible.builtin.shell",
            "Needed for pipes and redirects; the default command module has none"
          ],
          [
            "-a '<args>'",
            "Module arguments; single quotes keep $ and | for the remote shell"
          ],
          [
            "-b / --become",
            "Run as root (changes what the command can touch)"
          ],
          [
            "-K",
            "Prompt for the become password"
          ],
          [
            "-o",
            "One line per host"
          ]
        ],
        "tip": "Ad-hoc is for read-only checks; changes belong in a reviewed playbook",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "ad-hoc",
          "shell",
          "fleet",
          "become"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible.html",
              "title": "ansible CLI"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/shell_module.html",
              "title": "ansible.builtin.shell"
            }
          ]
        }
      },
      {
        "id": "ansible-adhoc-sub-1",
        "desc": "Uptime per host, one line each",
        "cmd": "ansible gpu -i inventory.ini -m ansible.builtin.shell -a 'uptime' -o",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "ad-hoc",
          "shell",
          "fleet"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible.html",
              "title": "ansible CLI"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/shell_module.html",
              "title": "ansible.builtin.shell"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ansible",
    "id": "ansible-cmd-3",
    "badge": "ansible",
    "title": "Ansible: Dry-run a playbook on one host with a diff",
    "subtitle": "Dry-run a playbook on one host with a diff",
    "commands": [
      {
        "id": "ansible-playbook-check",
        "desc": "Dry-run a playbook on one host with a diff",
        "cmd": "ansible-playbook -i inventory.ini site.yml --check --diff --limit node07",
        "details": "",
        "flags": [
          [
            "--check",
            "Report what would change, change nothing"
          ],
          [
            "--diff",
            "Show file and template differences"
          ],
          [
            "--syntax-check",
            "Parse only"
          ],
          [
            "--list-hosts / --list-tasks / --list-tags",
            "What would run, where"
          ],
          [
            "--tags / --skip-tags",
            "Run part of a playbook"
          ],
          [
            "--start-at-task '<name>'",
            "Resume after a failure"
          ]
        ],
        "tip": "check + diff on one host, then the real run on that host, then the rest",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "playbook",
          "check",
          "diff",
          "limit",
          "dry-run"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-playbook.html",
              "title": "ansible-playbook"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_checkmode.html",
              "title": "Ansible: check mode"
            }
          ]
        }
      },
      {
        "id": "ansible-playbook-check-sub-1",
        "desc": "Parse only",
        "cmd": "ansible-playbook -i inventory.ini site.yml --syntax-check",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "playbook",
          "check",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-playbook.html",
              "title": "ansible-playbook"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_checkmode.html",
              "title": "Ansible: check mode"
            }
          ]
        }
      },
      {
        "id": "ansible-playbook-check-sub-2",
        "desc": "Which hosts it targets",
        "cmd": "ansible-playbook -i inventory.ini site.yml --list-hosts",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "playbook",
          "check",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-playbook.html",
              "title": "ansible-playbook"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_checkmode.html",
              "title": "Ansible: check mode"
            }
          ]
        }
      },
      {
        "id": "ansible-playbook-check-sub-3",
        "desc": "The real run on one host (changes state)",
        "cmd": "ansible-playbook -i inventory.ini site.yml --limit node07",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "playbook",
          "check",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-playbook.html",
              "title": "ansible-playbook"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/playbook_guide/playbooks_checkmode.html",
              "title": "Ansible: check mode"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ansible",
    "id": "ansible-cmd-4",
    "badge": "ansible",
    "title": "Ansible: Encrypt a secret for a playbook",
    "subtitle": "Encrypt a secret for a playbook",
    "commands": [
      {
        "id": "ansible-vault",
        "desc": "Encrypt a secret for a playbook",
        "cmd": "ansible-vault encrypt_string --prompt --name bmc_password",
        "details": "",
        "flags": [
          [
            "encrypt_string --prompt",
            "Type the secret at a prompt, so it never hits shell history"
          ],
          [
            "--name",
            "Variable name in the output YAML"
          ],
          [
            "create / edit / view <file>",
            "Whole encrypted files"
          ],
          [
            "--ask-vault-password / --vault-password-file",
            "How playbooks unlock it"
          ],
          [
            "rekey",
            "Change the vault password"
          ]
        ],
        "tip": "Never put a vault password file in the repo",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "vault",
          "secrets",
          "encrypt",
          "password"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-vault.html",
              "title": "ansible-vault"
            }
          ]
        }
      },
      {
        "id": "ansible-vault-sub-1",
        "desc": "A new encrypted vars file",
        "cmd": "ansible-vault create group_vars/bmc/vault.yml",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "vault",
          "secrets",
          "encrypt"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-vault.html",
              "title": "ansible-vault"
            }
          ]
        }
      },
      {
        "id": "ansible-vault-sub-2",
        "desc": "Use it",
        "cmd": "ansible-playbook -i inventory.ini site.yml --ask-vault-password --check",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "vault",
          "secrets",
          "encrypt"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-vault.html",
              "title": "ansible-vault"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ansible",
    "id": "ansible-cmd-5",
    "badge": "ansible",
    "title": "Ansible: Collections, config and module docs",
    "subtitle": "Collections, config and module docs",
    "commands": [
      {
        "id": "ansible-tools",
        "desc": "Collections, config and module docs",
        "cmd": "ansible-doc -s ansible.builtin.copy",
        "details": "",
        "flags": [
          [
            "ansible-doc -s <module>",
            "A ready-to-paste task snippet"
          ],
          [
            "ansible-config dump --only-changed",
            "Settings that differ from the default"
          ],
          [
            "ansible-galaxy collection install -r requirements.yml",
            "Install pinned collections"
          ],
          [
            "ansible-lint",
            "Linter for playbooks, roles and collections"
          ]
        ],
        "tip": "Pin collections in requirements.yml",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "ansible-doc",
          "galaxy",
          "config",
          "lint"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-doc.html",
              "title": "ansible-doc"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-config.html",
              "title": "ansible-config"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-galaxy.html",
              "title": "ansible-galaxy"
            },
            {
              "url": "https://docs.ansible.com/projects/lint/",
              "title": "ansible-lint"
            }
          ]
        }
      },
      {
        "id": "ansible-tools-sub-1",
        "desc": "Why does it behave differently here?",
        "cmd": "ansible-config dump --only-changed",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "ansible-doc",
          "galaxy",
          "config"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-doc.html",
              "title": "ansible-doc"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-config.html",
              "title": "ansible-config"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-galaxy.html",
              "title": "ansible-galaxy"
            },
            {
              "url": "https://docs.ansible.com/projects/lint/",
              "title": "ansible-lint"
            }
          ]
        }
      },
      {
        "id": "ansible-tools-sub-2",
        "desc": "Same collections everywhere",
        "cmd": "ansible-galaxy collection install -r requirements.yml",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "recipe",
          "ansible-doc",
          "galaxy",
          "config"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-doc.html",
              "title": "ansible-doc"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-config.html",
              "title": "ansible-config"
            },
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/cli/ansible-galaxy.html",
              "title": "ansible-galaxy"
            },
            {
              "url": "https://docs.ansible.com/projects/lint/",
              "title": "ansible-lint"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "ansible",
    "id": "ansible-pro-tips",
    "badge": "tip",
    "title": "Ansible: Pro Tip",
    "subtitle": "Gather facts as a read-only inventory",
    "commands": [
      {
        "id": "ansible-tips-card",
        "desc": "Gather facts as a read-only inventory",
        "cmd": "ansible gpu -i inventory.ini -m ansible.builtin.setup -a 'filter=ansible_product_serial'",
        "details": "The setup module collects facts without changing anything. Filter to the fact you need: ansible_product_serial, ansible_bios_version, ansible_kernel. Faster than SSHing to each node to compare BIOS versions.",
        "flags": [
          [
            "filter=",
            "Glob of fact names"
          ],
          [
            "Read-only",
            "setup changes nothing"
          ]
        ],
        "tip": "Compare BIOS versions across a rack in one command",
        "tags": [
          "sre",
          "devops",
          "ansible",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.ansible.com/projects/ansible/latest/collections/ansible/builtin/setup_module.html",
              "title": "ansible.builtin.setup"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "terraform",
    "id": "terraform-cmd-1",
    "badge": "terraform",
    "title": "Terraform / OpenTofu: Initialise, format and validate",
    "subtitle": "Initialise, format and validate",
    "commands": [
      {
        "id": "tf-init-validate",
        "desc": "Initialise, format and validate",
        "cmd": "terraform init && terraform fmt -check -recursive && terraform validate",
        "details": "",
        "flags": [
          [
            "init",
            "Download providers and modules; safe to run again"
          ],
          [
            "init -upgrade",
            "Newest providers the constraints allow, ignoring the lock file"
          ],
          [
            "fmt -check -recursive",
            "Fail if any file is not formatted (CI)"
          ],
          [
            "validate",
            "Syntax and internal consistency, no API calls"
          ],
          [
            "tofu",
            "OpenTofu's CLI: the same subcommands with tofu in place of terraform"
          ]
        ],
        "tip": "Commit .terraform.lock.hcl",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "terraform",
          "opentofu",
          "init",
          "fmt",
          "validate"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/init",
              "title": "terraform init"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/fmt",
              "title": "terraform fmt"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/validate",
              "title": "terraform validate"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/providers/lock",
              "title": "terraform providers lock"
            },
            {
              "url": "https://opentofu.org/docs/cli/commands/",
              "title": "OpenTofu CLI"
            }
          ]
        }
      },
      {
        "id": "tf-init-validate-sub-1",
        "desc": "Lock-file hashes for every platform your team uses",
        "cmd": "terraform providers lock -platform=linux_amd64 -platform=darwin_arm64",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "recipe",
          "terraform",
          "opentofu",
          "init"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/init",
              "title": "terraform init"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/fmt",
              "title": "terraform fmt"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/validate",
              "title": "terraform validate"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/providers/lock",
              "title": "terraform providers lock"
            },
            {
              "url": "https://opentofu.org/docs/cli/commands/",
              "title": "OpenTofu CLI"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "terraform",
    "id": "terraform-cmd-2",
    "badge": "terraform",
    "title": "Terraform / OpenTofu: Save a plan, review it, apply exactly that plan",
    "subtitle": "Save a plan, review it, apply exactly that plan",
    "commands": [
      {
        "id": "tf-plan-apply",
        "desc": "Save a plan, review it, apply exactly that plan",
        "cmd": "terraform plan -out=tfplan",
        "details": "",
        "flags": [
          [
            "-out=tfplan",
            "Save the plan; it may contain secrets in clear text, so never commit it"
          ],
          [
            "apply tfplan",
            "Apply exactly what you reviewed (changes state)"
          ],
          [
            "destroy",
            "Delete everything in the configuration (changes state)"
          ],
          [
            "-target",
            "Exceptional cases only: it can hide drift. Split configurations instead"
          ]
        ],
        "tip": "Read every - and -/+ (destroy) line in the plan before you apply",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "plan",
          "apply",
          "destroy",
          "target"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/plan",
              "title": "terraform plan"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/apply",
              "title": "terraform apply"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/show",
              "title": "terraform show"
            }
          ]
        }
      },
      {
        "id": "tf-plan-apply-sub-1",
        "desc": "Review the saved plan",
        "cmd": "terraform show tfplan",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "recipe",
          "plan",
          "apply",
          "destroy"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/plan",
              "title": "terraform plan"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/apply",
              "title": "terraform apply"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/show",
              "title": "terraform show"
            }
          ]
        }
      },
      {
        "id": "tf-plan-apply-sub-2",
        "desc": "Apply the reviewed plan (changes state)",
        "cmd": "terraform apply tfplan",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "recipe",
          "plan",
          "apply",
          "destroy"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/plan",
              "title": "terraform plan"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/apply",
              "title": "terraform apply"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/show",
              "title": "terraform show"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "terraform",
    "id": "terraform-cmd-3",
    "badge": "terraform",
    "title": "Terraform / OpenTofu: Inspect state",
    "subtitle": "Inspect state",
    "commands": [
      {
        "id": "tf-state",
        "desc": "Inspect state",
        "cmd": "terraform state list",
        "details": "",
        "flags": [
          [
            "state list [address]",
            "Every resource Terraform tracks"
          ],
          [
            "state show <address>",
            "One resource's attributes (-json needs 1.16+)"
          ],
          [
            "state mv <src> <dst>",
            "Rename without destroy (changes state); -dry-run first"
          ],
          [
            "output -json",
            "Outputs for scripts; shows sensitive values in clear text"
          ]
        ],
        "tip": "Prefer a moved block to state mv: it is reviewed in the plan",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "state",
          "list",
          "show",
          "output"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/state/list",
              "title": "terraform state list"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/state/show",
              "title": "terraform state show"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/state/mv",
              "title": "terraform state mv"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/output",
              "title": "terraform output"
            }
          ],
          "note": "state show -json needs Terraform 1.16 or later."
        }
      },
      {
        "id": "tf-state-sub-1",
        "desc": "Quote addresses with brackets",
        "cmd": "terraform state show 'module.rack12.aws_instance.node[\"07\"]'",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "recipe",
          "state",
          "list",
          "show"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/state/list",
              "title": "terraform state list"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/state/show",
              "title": "terraform state show"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/state/mv",
              "title": "terraform state mv"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/output",
              "title": "terraform output"
            }
          ],
          "note": "state show -json needs Terraform 1.16 or later."
        }
      },
      {
        "id": "tf-state-sub-2",
        "desc": "Outputs for a script",
        "cmd": "terraform output -json | jq .",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "recipe",
          "state",
          "list",
          "show"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/state/list",
              "title": "terraform state list"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/state/show",
              "title": "terraform state show"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/state/mv",
              "title": "terraform state mv"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/cli/commands/output",
              "title": "terraform output"
            }
          ],
          "note": "state show -json needs Terraform 1.16 or later."
        }
      }
    ]
  },
  {
    "part": "terraform",
    "id": "terraform-cmd-4",
    "badge": "terraform",
    "title": "Terraform / OpenTofu: moved and import blocks",
    "subtitle": "moved and import blocks (reviewed in the plan)",
    "commands": [
      {
        "id": "tf-moved-import",
        "desc": "moved and import blocks (reviewed in the plan)",
        "cmd": "moved {\n  from = aws_instance.worker\n  to   = aws_instance.helper\n}\n\nimport {\n  to = aws_instance.legacy\n  id = \"i-0123456789abcdef0\"\n}",
        "details": "",
        "flags": [
          [
            "moved",
            "Renames the existing object in state before planning: no destroy/create"
          ],
          [
            "import",
            "Adopts an existing object; a matching resource block must exist"
          ],
          [
            "plan -generate-config-out=gen.tf",
            "Experimental: write the resource block for an import"
          ],
          [
            "Why blocks",
            "They show up in plan and code review; state commands don't"
          ]
        ],
        "tip": "Keep moved blocks until every workspace has applied them",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "moved",
          "import",
          "refactor",
          "hcl"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://developer.hashicorp.com/terraform/language/block/moved",
              "title": "Terraform: moved block"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/language/import",
              "title": "Terraform: import block"
            },
            {
              "url": "https://developer.hashicorp.com/terraform/language/import/generating-configuration",
              "title": "Terraform: generating configuration"
            }
          ],
          "note": "plan -generate-config-out is still experimental in Terraform 1.17."
        }
      }
    ]
  },
  {
    "part": "terraform",
    "id": "terraform-pro-tips",
    "badge": "tip",
    "title": "Terraform / OpenTofu: Pro Tip",
    "subtitle": "Terraform or OpenTofu?",
    "commands": [
      {
        "id": "terraform-tips-card",
        "desc": "Terraform or OpenTofu?",
        "cmd": "terraform version; tofu version",
        "details": "Terraform is under the Business Source License 1.1 (production use allowed, except a competing hosted offering; each version becomes MPL 2.0 after four years). OpenTofu is the MPL 2.0 fork with the same workflow. Pick one per repository, and pin its version in CI.",
        "flags": [
          [
            "BUSL 1.1",
            "Terraform"
          ],
          [
            "MPL 2.0",
            "OpenTofu"
          ]
        ],
        "tip": "Don't mix the two on one state file",
        "tags": [
          "sre",
          "devops",
          "terraform",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/hashicorp/terraform/blob/main/LICENSE",
              "title": "Terraform LICENSE (BUSL 1.1)"
            },
            {
              "url": "https://opentofu.org/",
              "title": "OpenTofu"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "helm",
    "id": "helm-cmd-1",
    "badge": "helm",
    "title": "Helm: Add a chart repo and read its default values",
    "subtitle": "Add a chart repo and read its default values",
    "commands": [
      {
        "id": "helm-repo",
        "desc": "Add a chart repo and read its default values",
        "cmd": "helm repo add prometheus-community https://prometheus-community.github.io/helm-charts && helm repo update",
        "details": "",
        "flags": [
          [
            "repo add / update",
            "Register a chart repository and refresh its index"
          ],
          [
            "search repo <term>",
            "Find charts"
          ],
          [
            "show values <chart>",
            "Default values: start your values.yaml from these"
          ],
          [
            "OCI",
            "Many charts are OCI references: helm install x oci://registry/chart"
          ]
        ],
        "tip": "Pin --version on every install",
        "tags": [
          "sre",
          "devops",
          "helm",
          "helm",
          "repo",
          "values",
          "chart"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_repo_add/",
              "title": "helm repo add"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_search_repo/",
              "title": "helm search repo"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_show_values/",
              "title": "helm show values"
            }
          ]
        }
      },
      {
        "id": "helm-repo-sub-1",
        "desc": "Available versions",
        "cmd": "helm search repo prometheus-community/kube-prometheus-stack --versions | head",
        "tags": [
          "sre",
          "devops",
          "helm",
          "recipe",
          "helm",
          "repo",
          "values"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_repo_add/",
              "title": "helm repo add"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_search_repo/",
              "title": "helm search repo"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_show_values/",
              "title": "helm show values"
            }
          ]
        }
      },
      {
        "id": "helm-repo-sub-2",
        "desc": "Defaults to edit",
        "cmd": "helm show values prometheus-community/kube-prometheus-stack > values.yaml",
        "tags": [
          "sre",
          "devops",
          "helm",
          "recipe",
          "helm",
          "repo",
          "values"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_repo_add/",
              "title": "helm repo add"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_search_repo/",
              "title": "helm search repo"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_show_values/",
              "title": "helm show values"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "helm",
    "id": "helm-cmd-2",
    "badge": "helm",
    "title": "Helm: Render and lint before installing",
    "subtitle": "Render and lint before installing",
    "commands": [
      {
        "id": "helm-template",
        "desc": "Render and lint before installing",
        "cmd": "helm template mon prometheus-community/kube-prometheus-stack -f values.yaml -n monitoring > rendered.yaml",
        "details": "",
        "flags": [
          [
            "template",
            "Render the manifests locally; nothing touches the cluster"
          ],
          [
            "lint <chart dir>",
            "Check a chart you maintain"
          ],
          [
            "helm diff upgrade",
            "From the helm-diff plugin (third party): what an upgrade would change"
          ]
        ],
        "tip": "Review rendered.yaml or the diff before every upgrade",
        "tags": [
          "sre",
          "devops",
          "helm",
          "template",
          "lint",
          "diff",
          "render"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_template/",
              "title": "helm template"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_lint/",
              "title": "helm lint"
            },
            {
              "url": "https://github.com/databus23/helm-diff",
              "title": "helm-diff plugin"
            }
          ]
        }
      },
      {
        "id": "helm-template-sub-1",
        "desc": "Install helm-diff (Helm 4 verifies plugin provenance)",
        "cmd": "helm plugin install https://github.com/databus23/helm-diff",
        "tags": [
          "sre",
          "devops",
          "helm",
          "recipe",
          "template",
          "lint",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_template/",
              "title": "helm template"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_lint/",
              "title": "helm lint"
            },
            {
              "url": "https://github.com/databus23/helm-diff",
              "title": "helm-diff plugin"
            }
          ]
        }
      },
      {
        "id": "helm-template-sub-2",
        "desc": "Diff against the live release",
        "cmd": "helm diff upgrade mon prometheus-community/kube-prometheus-stack -f values.yaml -n monitoring",
        "tags": [
          "sre",
          "devops",
          "helm",
          "recipe",
          "template",
          "lint",
          "diff"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_template/",
              "title": "helm template"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_lint/",
              "title": "helm lint"
            },
            {
              "url": "https://github.com/databus23/helm-diff",
              "title": "helm-diff plugin"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "helm",
    "id": "helm-cmd-3",
    "badge": "helm",
    "title": "Helm: Install or upgrade, rolling back on failure",
    "subtitle": "Install or upgrade, rolling back on failure",
    "commands": [
      {
        "id": "helm-upgrade",
        "desc": "Install or upgrade, rolling back on failure",
        "cmd": "helm upgrade --install mon prometheus-community/kube-prometheus-stack -n monitoring --create-namespace -f values.yaml --version <chart-version> --rollback-on-failure",
        "details": "",
        "flags": [
          [
            "upgrade --install",
            "Install if missing, upgrade if present (changes state)"
          ],
          [
            "--rollback-on-failure",
            "Helm 4 name for --atomic; also waits for resources"
          ],
          [
            "--force-replace",
            "Helm 4 name for --force"
          ],
          [
            "--wait / --timeout",
            "Wait for resources (default 5m)"
          ],
          [
            "Server-side apply",
            "Helm 4 default for new installs; Helm 3 releases keep client-side"
          ],
          [
            "-f values.yaml",
            "Repeatable; the rightmost file wins"
          ]
        ],
        "tip": "Old names (--atomic, --force) still work in Helm 4 with a warning",
        "tags": [
          "sre",
          "devops",
          "helm",
          "upgrade",
          "install",
          "atomic",
          "rollback-on-failure",
          "helm4"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_upgrade/",
              "title": "helm upgrade"
            },
            {
              "url": "https://helm.sh/docs/overview/",
              "title": "Helm 4 overview"
            }
          ],
          "note": "Checked against Helm 4.3.1; the old flag names still work with a deprecation warning."
        }
      }
    ]
  },
  {
    "part": "helm",
    "id": "helm-cmd-4",
    "badge": "helm",
    "title": "Helm: Release history and rollback",
    "subtitle": "Release history and rollback",
    "commands": [
      {
        "id": "helm-history",
        "desc": "Release history and rollback",
        "cmd": "helm history mon -n monitoring",
        "details": "",
        "flags": [
          [
            "list -A",
            "Every release in every namespace"
          ],
          [
            "history <release>",
            "Revisions with status and chart version"
          ],
          [
            "get values / get manifest",
            "What is deployed now"
          ],
          [
            "rollback <release> <rev>",
            "Go back to a revision (changes state)"
          ],
          [
            "uninstall",
            "Remove the release (changes state)"
          ]
        ],
        "tip": "history tells you which revision last worked",
        "tags": [
          "sre",
          "devops",
          "helm",
          "history",
          "rollback",
          "list",
          "get"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_history/",
              "title": "helm history"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_rollback/",
              "title": "helm rollback"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_get_values/",
              "title": "helm get values"
            }
          ]
        }
      },
      {
        "id": "helm-history-sub-1",
        "desc": "Values in use",
        "cmd": "helm get values mon -n monitoring",
        "tags": [
          "sre",
          "devops",
          "helm",
          "recipe",
          "history",
          "rollback",
          "list"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_history/",
              "title": "helm history"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_rollback/",
              "title": "helm rollback"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_get_values/",
              "title": "helm get values"
            }
          ]
        }
      },
      {
        "id": "helm-history-sub-2",
        "desc": "Back to revision 3 (changes state)",
        "cmd": "helm rollback mon 3 -n monitoring",
        "tags": [
          "sre",
          "devops",
          "helm",
          "recipe",
          "history",
          "rollback",
          "list"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://helm.sh/docs/helm/helm_history/",
              "title": "helm history"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_rollback/",
              "title": "helm rollback"
            },
            {
              "url": "https://helm.sh/docs/helm/helm_get_values/",
              "title": "helm get values"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "helm",
    "id": "helm-pro-tips",
    "badge": "tip",
    "title": "Helm: Pro Tip",
    "subtitle": "Helm 3 end of support",
    "commands": [
      {
        "id": "helm-tips-card",
        "desc": "Helm 3 end of support",
        "cmd": "helm version",
        "details": "Helm 3 gets security patches through February 2027 (its last feature release was September 9, 2026). Helm 4 reads Helm 3 releases without conversion. Check CI scripts for --atomic and --force (renamed), and for helm version --client, which Helm 4 rejects.",
        "flags": [
          [
            "Helm 4.3.1",
            "Current release"
          ],
          [
            "helm version",
            "Client version"
          ]
        ],
        "tip": "Upgrade the CLI on jumpboxes and CI together",
        "tags": [
          "sre",
          "devops",
          "helm",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/helm/helm/releases",
              "title": "Helm releases"
            },
            {
              "url": "https://helm.sh/blog/",
              "title": "Helm blog (Helm 3 end of life)"
            },
            {
              "url": "https://helm.sh/docs/overview/",
              "title": "Helm 4 overview"
            }
          ],
          "note": "Corrected 2026-11-10: Helm 3 security patches run through February 2027 (not Nov 11, 2026). helm version --client was removed in Helm 4 (changelog, PR #31301)."
        }
      }
    ]
  },
  {
    "part": "argocd",
    "id": "argocd-cmd-1",
    "badge": "argocd",
    "title": "Argo CD: Log in with SSO",
    "subtitle": "Log in with SSO",
    "commands": [
      {
        "id": "argocd-login",
        "desc": "Log in with SSO",
        "cmd": "argocd login argocd.example.com --sso --grpc-web",
        "details": "",
        "flags": [
          [
            "--sso",
            "Browser-based SSO login"
          ],
          [
            "--grpc-web",
            "For proxies or load balancers without HTTP/2"
          ],
          [
            "--core",
            "Talk to Kubernetes directly, no API server login"
          ],
          [
            "--username / --password",
            "Local accounts; avoid typing the password inline"
          ]
        ],
        "tip": "SSO keeps passwords off the jumpbox",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "argocd",
          "login",
          "sso"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_login/",
              "title": "argocd login"
            }
          ],
          "note": "The flags exist separately in the docs; --sso and --core aren't shown together."
        }
      }
    ]
  },
  {
    "part": "argocd",
    "id": "argocd-cmd-2",
    "badge": "argocd",
    "title": "Argo CD: What is out of sync, and what differs",
    "subtitle": "What is out of sync, and what differs",
    "commands": [
      {
        "id": "argocd-status",
        "desc": "What is out of sync, and what differs",
        "cmd": "argocd app list",
        "details": "",
        "flags": [
          [
            "app list",
            "Sync and health status of every application"
          ],
          [
            "app get <app>",
            "Resources, sync status and conditions"
          ],
          [
            "app diff <app>",
            "Git (target) vs live state"
          ],
          [
            "app history <app>",
            "Deployed revisions with IDs"
          ]
        ],
        "tip": "OutOfSync + Healthy is drift; Degraded is broken",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "status",
          "diff",
          "history",
          "drift"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_list/",
              "title": "argocd app list"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_diff/",
              "title": "argocd app diff"
            }
          ]
        }
      },
      {
        "id": "argocd-status-sub-1",
        "desc": "One application in detail",
        "cmd": "argocd app get dcgm-exporter",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "status",
          "diff",
          "history"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_list/",
              "title": "argocd app list"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_diff/",
              "title": "argocd app diff"
            }
          ]
        }
      },
      {
        "id": "argocd-status-sub-2",
        "desc": "What would change on sync",
        "cmd": "argocd app diff dcgm-exporter",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "status",
          "diff",
          "history"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_list/",
              "title": "argocd app list"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_diff/",
              "title": "argocd app diff"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "argocd",
    "id": "argocd-cmd-3",
    "badge": "argocd",
    "title": "Argo CD: Preview, then sync",
    "subtitle": "Preview, then sync",
    "commands": [
      {
        "id": "argocd-sync",
        "desc": "Preview, then sync",
        "cmd": "argocd app sync dcgm-exporter --dry-run",
        "details": "",
        "flags": [
          [
            "--dry-run",
            "Preview the apply without changing the cluster"
          ],
          [
            "(no flag)",
            "Sync for real (changes state)"
          ],
          [
            "--prune",
            "Also delete resources no longer in Git (changes state)"
          ],
          [
            "--resource <group:kind:name>",
            "Sync one resource"
          ],
          [
            "app wait --health --timeout <s>",
            "Block until healthy (seconds)"
          ]
        ],
        "tip": "--prune deletes things: read the diff first",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "sync",
          "dry-run",
          "prune",
          "wait"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_sync/",
              "title": "argocd app sync"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_wait/",
              "title": "argocd app wait"
            }
          ]
        }
      },
      {
        "id": "argocd-sync-sub-1",
        "desc": "Real sync (changes state)",
        "cmd": "argocd app sync dcgm-exporter",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "sync",
          "dry-run",
          "prune"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_sync/",
              "title": "argocd app sync"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_wait/",
              "title": "argocd app wait"
            }
          ]
        }
      },
      {
        "id": "argocd-sync-sub-2",
        "desc": "Wait up to 5 minutes for health",
        "cmd": "argocd app wait dcgm-exporter --health --timeout 300",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "sync",
          "dry-run",
          "prune"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_sync/",
              "title": "argocd app sync"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_wait/",
              "title": "argocd app wait"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "argocd",
    "id": "argocd-cmd-4",
    "badge": "argocd",
    "title": "Argo CD: Roll back, and the auto-sync gotcha",
    "subtitle": "Roll back, and the auto-sync gotcha",
    "commands": [
      {
        "id": "argocd-rollback",
        "desc": "Roll back, and the auto-sync gotcha",
        "cmd": "argocd app history dcgm-exporter",
        "details": "",
        "flags": [
          [
            "app rollback <app> [ID]",
            "Back to a history ID, or the previous one (changes state)"
          ],
          [
            "Auto-sync blocks rollback",
            "Rollback can't run while automated sync is on"
          ],
          [
            "app set --sync-policy manual",
            "Turn auto-sync off first (changes state)"
          ],
          [
            "Real fix",
            "Revert the commit in Git; that is the GitOps rollback"
          ]
        ],
        "tip": "Revert in Git when you can; CLI rollback is for emergencies",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "rollback",
          "auto-sync",
          "gitops",
          "revert"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_rollback/",
              "title": "argocd app rollback"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_set/",
              "title": "argocd app set"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/",
              "title": "Argo CD: automated sync policy"
            }
          ]
        }
      },
      {
        "id": "argocd-rollback-sub-1",
        "desc": "Pause auto-sync (changes state)",
        "cmd": "argocd app set dcgm-exporter --sync-policy manual",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "rollback",
          "auto-sync",
          "gitops"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_rollback/",
              "title": "argocd app rollback"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_set/",
              "title": "argocd app set"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/",
              "title": "Argo CD: automated sync policy"
            }
          ]
        }
      },
      {
        "id": "argocd-rollback-sub-2",
        "desc": "Previous revision (changes state)",
        "cmd": "argocd app rollback dcgm-exporter",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "recipe",
          "rollback",
          "auto-sync",
          "gitops"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_rollback/",
              "title": "argocd app rollback"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/commands/argocd_app_set/",
              "title": "argocd app set"
            },
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/",
              "title": "Argo CD: automated sync policy"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "argocd",
    "id": "argocd-pro-tips",
    "badge": "tip",
    "title": "Argo CD: Pro Tip",
    "subtitle": "Automated sync with prune and self-heal",
    "commands": [
      {
        "id": "argocd-tips-card",
        "desc": "Automated sync with prune and self-heal",
        "cmd": "spec:\n  syncPolicy:\n    automated:\n      prune: true\n      selfHeal: true",
        "details": "automated: {} alone syncs on Git changes but never deletes; prune: true deletes resources removed from Git; selfHeal: true reverts manual changes in the cluster. The same from the CLI: argocd app set <app> --sync-policy automated --auto-prune --self-heal.",
        "flags": [
          [
            "prune",
            "Off by default"
          ],
          [
            "selfHeal",
            "Undo kubectl edits"
          ]
        ],
        "tip": "With selfHeal on, a hotfix made with kubectl is undone: change Git instead",
        "tags": [
          "sre",
          "devops",
          "argocd",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/",
              "title": "Argo CD: automated sync policy"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "incident-response",
    "id": "incident-cmd-1",
    "badge": "incident",
    "title": "Incident response: Roles",
    "subtitle": "Roles (Google SRE incident management)",
    "commands": [
      {
        "id": "ir-roles",
        "desc": "Roles (Google SRE incident management)",
        "cmd": "printf '%s\\n' 'IC: <name>' 'Ops lead: <name>' 'Comms lead: <name>' 'Started (UTC): '\"$(date -u +%FT%TZ)\"",
        "details": "",
        "flags": [
          [
            "Incident Commander (IC)",
            "Coordinates, delegates, decides. Holds every role nobody else has"
          ],
          [
            "Operations lead (OL)",
            "The only one changing systems"
          ],
          [
            "Communications lead (CL)",
            "Regular updates to stakeholders; fields questions"
          ],
          [
            "Handoff",
            "Explicit: \"You're now IC, okay?\", and wait for the yes"
          ],
          [
            "Declare early",
            "Declaring and standing down costs less than a late incident"
          ]
        ],
        "tip": "One person changes production at a time: the Ops lead",
        "tags": [
          "sre",
          "devops",
          "incident",
          "incident",
          "roles",
          "ic",
          "comms",
          "sre"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://sre.google/sre-book/managing-incidents/",
              "title": "Google SRE book: managing incidents"
            },
            {
              "url": "https://sre.google/workbook/incident-response/",
              "title": "SRE workbook: incident response"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "incident-response",
    "id": "incident-cmd-2",
    "badge": "incident",
    "title": "Incident response: First 15 minutes on a node",
    "subtitle": "First 15 minutes on a node: facts, in UTC",
    "commands": [
      {
        "id": "ir-first15",
        "desc": "First 15 minutes on a node: facts, in UTC",
        "cmd": "date -u; uptime; journalctl -p err -b --since '-1h' --no-pager | tail -n 50",
        "details": "",
        "flags": [
          [
            "date -u",
            "Every timeline entry in UTC"
          ],
          [
            "uptime",
            "Recent reboot? Load?"
          ],
          [
            "journalctl -p err -b",
            "Errors since boot"
          ],
          [
            "dmesg -T --level=err,crit",
            "Kernel errors (Xid, MCE, link down)"
          ],
          [
            "Scheduler",
            "Is it already drained? sinfo -R / kubectl get node"
          ]
        ],
        "tip": "Mitigate first (drain, fail over), find the root cause after",
        "tags": [
          "sre",
          "devops",
          "incident",
          "triage",
          "timeline",
          "utc",
          "journalctl",
          "dmesg"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://sre.google/workbook/incident-response/",
              "title": "SRE workbook: incident response"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/journalctl.1.html",
              "title": "journalctl(1)"
            }
          ]
        }
      },
      {
        "id": "ir-first15-sub-1",
        "desc": "Kernel errors",
        "cmd": "dmesg -T --level=err,crit | tail -n 40",
        "tags": [
          "sre",
          "devops",
          "incident",
          "recipe",
          "triage",
          "timeline",
          "utc"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://sre.google/workbook/incident-response/",
              "title": "SRE workbook: incident response"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/journalctl.1.html",
              "title": "journalctl(1)"
            }
          ]
        }
      },
      {
        "id": "ir-first15-sub-2",
        "desc": "Drained nodes and their reasons",
        "cmd": "sinfo -R",
        "tags": [
          "sre",
          "devops",
          "incident",
          "recipe",
          "triage",
          "timeline",
          "utc"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://sre.google/workbook/incident-response/",
              "title": "SRE workbook: incident response"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/journalctl.1.html",
              "title": "journalctl(1)"
            }
          ]
        }
      },
      {
        "id": "ir-first15-sub-3",
        "desc": "What is firing",
        "cmd": "amtool alert query --alertmanager.url=http://localhost:9093",
        "tags": [
          "sre",
          "devops",
          "incident",
          "recipe",
          "triage",
          "timeline",
          "utc"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://sre.google/workbook/incident-response/",
              "title": "SRE workbook: incident response"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/journalctl.1.html",
              "title": "journalctl(1)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "incident-response",
    "id": "incident-cmd-3",
    "badge": "incident",
    "title": "Incident response: Keep a timeline as you go",
    "subtitle": "Keep a timeline as you go",
    "commands": [
      {
        "id": "ir-timeline",
        "desc": "Keep a timeline as you go",
        "cmd": "echo \"$(date -u +%FT%TZ) <what you saw or did>\" >> cases/<ticket>/timeline.md",
        "details": "",
        "flags": [
          [
            "One line per fact or action",
            "Time, who, what, result"
          ],
          [
            "Commands too",
            "The command and its key output, with secrets removed"
          ],
          [
            "Field notes",
            "The home page's Field notes log entries per server, in Markdown"
          ],
          [
            "Feeds the postmortem",
            "A good timeline writes half the postmortem"
          ]
        ],
        "tip": "Replace the placeholders before you run it",
        "tags": [
          "sre",
          "devops",
          "incident",
          "timeline",
          "notes",
          "case",
          "postmortem"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://sre.google/sre-book/managing-incidents/",
              "title": "Google SRE book: managing incidents"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "incident-response",
    "id": "incident-cmd-4",
    "badge": "incident",
    "title": "Incident response: Blameless postmortem outline",
    "subtitle": "Blameless postmortem outline",
    "commands": [
      {
        "id": "ir-postmortem",
        "desc": "Blameless postmortem outline",
        "cmd": "## Summary\n## Impact (who, how long)\n## Timeline (UTC)\n## Root cause and trigger\n## What went well / what didn't\n## Action items (owner, due date)",
        "details": "",
        "flags": [
          [
            "Blameless",
            "About systems and decisions, not people"
          ],
          [
            "Impact",
            "Users, jobs, GPUs and hours affected"
          ],
          [
            "Root cause vs trigger",
            "Why it was possible vs what set it off"
          ],
          [
            "Action items",
            "Each with one owner and a date"
          ]
        ],
        "tip": "Action items without owners don't get done",
        "tags": [
          "sre",
          "devops",
          "incident",
          "postmortem",
          "blameless",
          "rca",
          "actions"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://sre.google/sre-book/postmortem-culture/",
              "title": "Google SRE book: postmortem culture"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "incident-response",
    "id": "incident-pro-tips",
    "badge": "tip",
    "title": "Incident response: Pro Tip",
    "subtitle": "Silence alerts for a node under maintenance",
    "commands": [
      {
        "id": "incident-tips-card",
        "desc": "Silence alerts for a node under maintenance",
        "cmd": "amtool silence add instance=~\"node07.*\" --alertmanager.url=http://localhost:9093",
        "details": "Silence by the node (instance matcher), not by alert name, so other nodes still page. Check amtool silence add --help for the comment and duration flags in your version, and expire the silence when the node is back.",
        "flags": [
          [
            "silence query",
            "List silences"
          ],
          [
            "silence expire <id>",
            "End it"
          ]
        ],
        "tip": "Put the ticket number in the silence comment",
        "tags": [
          "sre",
          "devops",
          "incident",
          "tips",
          "best-practice"
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
  }
];

// Application State
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("sre.html", "sre_bookmarks", SRE_HUB_DATA, {"prometheus":"prometheus_bookmarks","incident-response":"incident-response_bookmarks","ansible":"ansible_bookmarks","terraform":"terraform_bookmarks","helm":"helm_bookmarks","argocd":"argocd_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("sre_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(SRE_HUB_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: SRE_HUB_DATA, label: "SRE toolkit sheets", parts: {
   "ansible": {
    "title": "Ansible",
    "subtitle": "Run a read-only check across a fleet, dry-run a playbook with a diff, and keep BMC passwords encrypted with ansible-vault",
    "pill": "ansible-core 2.22"
   },
   "argocd": {
    "title": "Argo CD",
    "subtitle": "Log in, see what is out of sync and why, sync safely, wait for health, and roll back",
    "pill": "Argo CD 3.6"
   },
   "helm": {
    "title": "Helm",
    "subtitle": "Render before you install, upgrade with automatic rollback, read release history, and the Helm 4 flag renames",
    "pill": "Helm 4.3"
   },
   "incident-response": {
    "title": "Incident response",
    "subtitle": "Declare early, assign roles, keep a timeline, mitigate before root-causing, and write a blameless postmortem",
    "pill": "Google SRE practice"
   },
   "prometheus": {
    "title": "Prometheus",
    "subtitle": "Validate config and rules, query from the shell, write alerting and recording rules, and silence alerts with amtool",
    "pill": "Prometheus 3.16 · Alertmanager 0.35"
   },
   "terraform": {
    "title": "Terraform / OpenTofu",
    "subtitle": "The safe plan → review → apply loop, state commands, moved and import blocks, and the licence difference",
    "pill": "Terraform 1.17 · OpenTofu 1.13"
   }
  } };


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
  const allCards = SRE_HUB_DATA;
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

  for (const card of SRE_HUB_DATA) {
    if (((state.activeCategory !== "all" && state.activeCategory !== card.id) || (state.part && (card.part || card.id) !== state.part))) {
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
        localStorage.setItem("sre_bookmarks", JSON.stringify([...state.bookmarks]));
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

// Picking another part (rail, pager, nav menu, Back) redraws in place: common.js calls this
// with the new part instead of reloading the page. The search box and Section filter reset,
// as a fresh load would; "Saved only" stays as the tech left it.
if (typeof window !== "undefined" && window.SHEET_FILTER) {
  window.SHEET_FILTER.setPart = (part) => {
    state.part = part;
    state.activeCategory = "all";
    state.searchQuery = "";
    if (searchInput) searchInput.value = "";
    renderCategoryTabs();
    renderSections();
  };
}
