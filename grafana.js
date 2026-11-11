// grafana.js
// Standalone interactive cheat sheet for Grafana: Grafana Hub (Building Dashboards)
const GRAFANA_CHEAT_SHEET_DATA = [
  {
    "part": "grafana-setup",
    "id": "grafana-setup-cmd-1",
    "badge": "lab",
    "title": "Grafana Lab Setup: compose.yaml for a local Grafana + Prometheus lab",
    "subtitle": "compose.yaml for a local Grafana + Prometheus lab (bound to 127.0.0.1)",
    "commands": [
      {
        "id": "grafana-compose-lab",
        "desc": "compose.yaml for a local Grafana + Prometheus lab (bound to 127.0.0.1)",
        "cmd": "services:\n  prometheus:\n    image: prom/prometheus:latest\n    ports: [\"127.0.0.1:9090:9090\"]\n    volumes:\n      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro\n      - prom-data:/prometheus\n  grafana:\n    image: grafana/grafana:13.3.0\n    ports: [\"127.0.0.1:3000:3000\"]\n    environment:\n      GF_SECURITY_ADMIN_PASSWORD__FILE: /run/secrets/grafana_admin\n    secrets: [grafana_admin]\n    volumes:\n      - grafana-data:/var/lib/grafana\n      - ./provisioning:/etc/grafana/provisioning:ro\n      - ./dashboards:/var/lib/grafana/dashboards:ro\nsecrets:\n  grafana_admin:\n    file: ./grafana_admin.txt   # chmod 600, keep out of git\nvolumes:\n  prom-data:\n  grafana-data:",
        "details": "",
        "flags": [
          [
            "127.0.0.1:3000:3000",
            "Publish only on loopback. Reach it from your laptop with ssh -L 3000:127.0.0.1:3000 <jumpbox> instead of opening the port to the network"
          ],
          [
            "GF_SECURITY_ADMIN_PASSWORD__FILE",
            "Any Grafana setting can come from an env var GF_<SECTION>_<KEY>; the __FILE suffix reads the value from a file, so the password never appears in compose.yaml or docker inspect"
          ],
          [
            "grafana-data volume",
            "Holds grafana.db (users, UI-made dashboards, API keys). Lose the volume and you lose everything not provisioned from files"
          ],
          [
            "./provisioning",
            "Data sources and dashboard providers as YAML, loaded at startup (see the cards below)"
          ],
          [
            "image tag",
            "Pin a version (13.3.0, released Oct 27, 2026, was current on 2026-11-10); check the Grafana releases page before upgrading"
          ]
        ],
        "tip": "Bind to 127.0.0.1, tunnel with ssh -L",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "compose",
          "docker",
          "install",
          "lab",
          "prometheus",
          "secrets"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/",
              "title": "Grafana: configure a Docker image"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/",
              "title": "Grafana: configuration"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/other/",
              "title": "Grafana: health API"
            },
            {
              "url": "https://github.com/grafana/grafana/releases",
              "title": "Grafana releases"
            },
            {
              "url": "https://docs.docker.com/reference/compose-file/secrets/",
              "title": "Compose file: secrets"
            }
          ],
          "note": "Corrected 2026-11-10: the image tag was 13.2.4; 13.3.0 (Oct 27, 2026) is current."
        }
      },
      {
        "id": "grafana-compose-lab-sub-1",
        "desc": "Start the lab in the background (changes state)",
        "cmd": "docker compose up -d",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "compose",
          "docker",
          "install"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/",
              "title": "Grafana: configure a Docker image"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/",
              "title": "Grafana: configuration"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/other/",
              "title": "Grafana: health API"
            },
            {
              "url": "https://github.com/grafana/grafana/releases",
              "title": "Grafana releases"
            },
            {
              "url": "https://docs.docker.com/reference/compose-file/secrets/",
              "title": "Compose file: secrets"
            }
          ],
          "note": "Corrected 2026-11-10: the image tag was 13.2.4; 13.3.0 (Oct 27, 2026) is current."
        }
      },
      {
        "id": "grafana-compose-lab-sub-2",
        "desc": "Both services should show running / healthy",
        "cmd": "docker compose ps",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "compose",
          "docker",
          "install"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/",
              "title": "Grafana: configure a Docker image"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/",
              "title": "Grafana: configuration"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/other/",
              "title": "Grafana: health API"
            },
            {
              "url": "https://github.com/grafana/grafana/releases",
              "title": "Grafana releases"
            },
            {
              "url": "https://docs.docker.com/reference/compose-file/secrets/",
              "title": "Compose file: secrets"
            }
          ],
          "note": "Corrected 2026-11-10: the image tag was 13.2.4; 13.3.0 (Oct 27, 2026) is current."
        }
      },
      {
        "id": "grafana-compose-lab-sub-3",
        "desc": "Startup errors: provisioning YAML mistakes show up here",
        "cmd": "docker compose logs --tail 50 grafana",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "compose",
          "docker",
          "install"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/",
              "title": "Grafana: configure a Docker image"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/",
              "title": "Grafana: configuration"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/other/",
              "title": "Grafana: health API"
            },
            {
              "url": "https://github.com/grafana/grafana/releases",
              "title": "Grafana releases"
            },
            {
              "url": "https://docs.docker.com/reference/compose-file/secrets/",
              "title": "Compose file: secrets"
            }
          ],
          "note": "Corrected 2026-11-10: the image tag was 13.2.4; 13.3.0 (Oct 27, 2026) is current."
        }
      },
      {
        "id": "grafana-compose-lab-sub-4",
        "desc": "Grafana is up when database is \"ok\"; also shows the version",
        "cmd": "curl -s http://127.0.0.1:3000/api/health | jq",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "compose",
          "docker",
          "install"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-docker/",
              "title": "Grafana: configure a Docker image"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/",
              "title": "Grafana: configuration"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/other/",
              "title": "Grafana: health API"
            },
            {
              "url": "https://github.com/grafana/grafana/releases",
              "title": "Grafana releases"
            },
            {
              "url": "https://docs.docker.com/reference/compose-file/secrets/",
              "title": "Compose file: secrets"
            }
          ],
          "note": "Corrected 2026-11-10: the image tag was 13.2.4; 13.3.0 (Oct 27, 2026) is current."
        }
      }
    ]
  },
  {
    "part": "grafana-setup",
    "id": "grafana-setup-cmd-2",
    "badge": "lab",
    "title": "Grafana Lab Setup: prometheus.yml",
    "subtitle": "prometheus.yml: scrape node_exporter (9100) and dcgm-exporter (9400) on your nodes",
    "commands": [
      {
        "id": "prometheus-scrape-config",
        "desc": "prometheus.yml: scrape node_exporter (9100) and dcgm-exporter (9400) on your nodes",
        "cmd": "global:\n  scrape_interval: 15s\nscrape_configs:\n  - job_name: node\n    static_configs:\n      - targets: ['gpu-node01:9100', 'gpu-node02:9100']\n  - job_name: dcgm\n    static_configs:\n      - targets: ['gpu-node01:9400', 'gpu-node02:9400']",
        "details": "",
        "flags": [
          [
            "scrape_interval: 15s",
            "How often Prometheus pulls /metrics. Grafana needs to know this value too (timeInterval on the data source) so $__rate_interval is right"
          ],
          [
            "job_name",
            "Becomes the job label on every series, so you can filter with {job=\"dcgm\"}"
          ],
          [
            "targets",
            "host:port pairs. node_exporter listens on 9100, dcgm-exporter on 9400 by default"
          ],
          [
            "YAML indentation",
            "Spaces only, never tabs. A list item (-) under static_configs must line up exactly or Prometheus refuses to start"
          ],
          [
            "file_sd_configs",
            "For a fleet, keep targets in a separate JSON/YAML file Prometheus re-reads on change, instead of editing this file"
          ]
        ],
        "tip": "No data in Grafana? Check Prometheus targets first",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "prometheus",
          "scrape",
          "targets",
          "node_exporter",
          "dcgm-exporter",
          "yaml"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/configuration/",
              "title": "Prometheus configuration"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            },
            {
              "url": "https://github.com/prometheus/node_exporter",
              "title": "node_exporter README"
            }
          ]
        }
      },
      {
        "id": "prometheus-scrape-config-sub-1",
        "desc": "Validate the file before restarting Prometheus",
        "cmd": "promtool check config prometheus.yml",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "prometheus",
          "scrape",
          "targets"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/configuration/",
              "title": "Prometheus configuration"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            },
            {
              "url": "https://github.com/prometheus/node_exporter",
              "title": "node_exporter README"
            }
          ]
        }
      },
      {
        "id": "prometheus-scrape-config-sub-2",
        "desc": "List every target and whether its last scrape worked (up / down)",
        "cmd": "curl -s http://127.0.0.1:9090/api/v1/targets | jq -r '.data.activeTargets[] | \"\\(.health)\\t\\(.labels.job)\\t\\(.scrapeUrl)\"'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "prometheus",
          "scrape",
          "targets"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/configuration/",
              "title": "Prometheus configuration"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            },
            {
              "url": "https://github.com/prometheus/node_exporter",
              "title": "node_exporter README"
            }
          ]
        }
      },
      {
        "id": "prometheus-scrape-config-sub-3",
        "desc": "Check the exporter directly on a node before blaming Prometheus or Grafana (matches old and new metric names)",
        "cmd": "curl -s http://gpu-node01:9400/metrics | grep -m5 -E '^DCGM_FI_DEV_GPU_TEMP(_CELSIUS)?\\{'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "prometheus",
          "scrape",
          "targets"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://prometheus.io/docs/prometheus/latest/configuration/configuration/",
              "title": "Prometheus configuration"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/command-line/promtool/",
              "title": "promtool"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            },
            {
              "url": "https://github.com/prometheus/node_exporter",
              "title": "node_exporter README"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-setup",
    "id": "grafana-setup-cmd-3",
    "badge": "lab",
    "title": "Grafana Lab Setup: Provision the Prometheus data source from YAML",
    "subtitle": "Provision the Prometheus data source from YAML (provisioning/datasources/prometheus.yaml)",
    "commands": [
      {
        "id": "grafana-datasource-provisioning",
        "desc": "Provision the Prometheus data source from YAML (provisioning/datasources/prometheus.yaml)",
        "cmd": "apiVersion: 1\ndatasources:\n  - name: Prometheus\n    type: prometheus\n    uid: prometheus\n    access: proxy\n    url: http://prometheus:9090\n    isDefault: true\n    jsonData:\n      timeInterval: 15s",
        "details": "",
        "flags": [
          [
            "uid: prometheus",
            "A fixed, readable UID. Dashboards reference the data source by UID, so a fixed one keeps dashboard JSON portable between Grafana instances"
          ],
          [
            "access: proxy",
            "The Grafana server makes the request (the browser never talks to Prometheus directly)"
          ],
          [
            "url",
            "Resolved from inside the Grafana container: in compose, the service name prometheus works; from the host it would be 127.0.0.1:9090"
          ],
          [
            "jsonData.timeInterval",
            "Set to your scrape_interval. Grafana uses it as the minimum step and to compute $__rate_interval"
          ],
          [
            "Changed it in the UI?",
            "Provisioned data sources are read-only in the UI; edit the YAML and restart Grafana"
          ]
        ],
        "tip": "Fixed data source UIDs keep dashboards portable",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "datasource",
          "provisioning",
          "prometheus",
          "uid",
          "yaml"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/administration/provisioning/",
              "title": "Grafana: provisioning"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/configure/",
              "title": "Grafana: configure the Prometheus data source"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/data_source/",
              "title": "Grafana: data source API"
            }
          ]
        }
      },
      {
        "id": "grafana-datasource-provisioning-sub-1",
        "desc": "Reload provisioning files (changes state)",
        "cmd": "docker compose restart grafana",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "datasource",
          "provisioning",
          "prometheus"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/administration/provisioning/",
              "title": "Grafana: provisioning"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/configure/",
              "title": "Grafana: configure the Prometheus data source"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/data_source/",
              "title": "Grafana: data source API"
            }
          ]
        }
      },
      {
        "id": "grafana-datasource-provisioning-sub-2",
        "desc": "List data sources and their UIDs (needs an admin token)",
        "cmd": "curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/datasources\" | jq -r '.[] | \"\\(.uid)\\t\\(.type)\\t\\(.name)\"'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "datasource",
          "provisioning",
          "prometheus"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/administration/provisioning/",
              "title": "Grafana: provisioning"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/configure/",
              "title": "Grafana: configure the Prometheus data source"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/data_source/",
              "title": "Grafana: data source API"
            }
          ]
        }
      },
      {
        "id": "grafana-datasource-provisioning-sub-3",
        "desc": "Run a query through Grafana's proxy: proves Grafana can reach Prometheus",
        "cmd": "curl -s -G -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/datasources/proxy/uid/prometheus/api/v1/query\" --data-urlencode 'query=up' | jq '.data.result | length'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "datasource",
          "provisioning",
          "prometheus"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/administration/provisioning/",
              "title": "Grafana: provisioning"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/configure/",
              "title": "Grafana: configure the Prometheus data source"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/data_source/",
              "title": "Grafana: data source API"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-setup",
    "id": "grafana-setup-cmd-4",
    "badge": "lab",
    "title": "Grafana Lab Setup: Create a service account token for API and CLI use, and load it without echoing it",
    "subtitle": "Create a service account token for API and CLI use, and load it without echoing it",
    "commands": [
      {
        "id": "grafana-service-account-token",
        "desc": "Create a service account token for API and CLI use, and load it without echoing it",
        "cmd": "read -rsp 'Grafana token: ' GRAFANA_TOKEN && export GRAFANA_TOKEN GRAFANA_URL=http://127.0.0.1:3000",
        "details": "",
        "flags": [
          [
            "Where to create it",
            "Administration → Users and access → Service accounts → Add service account (role Editor for dashboards, Admin only if you manage data sources) → Add token"
          ],
          [
            "read -rsp",
            "-r keeps backslashes, -s hides typing, -p shows a prompt: the token never lands in shell history or on screen"
          ],
          [
            "export",
            "Makes the variable visible to curl and other child processes started from this shell"
          ],
          [
            "Authorization: Bearer $GRAFANA_TOKEN",
            "How every API call below authenticates"
          ],
          [
            "Expiry",
            "Give tokens an expiry and one service account per tool, so you can revoke one without breaking the rest"
          ]
        ],
        "tip": "Never paste tokens into commands that get logged",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "token",
          "service account",
          "api",
          "auth",
          "secrets"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/administration/service-accounts/",
              "title": "Grafana: service accounts"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/bash.1.html",
              "title": "bash(1): read builtin"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/folder_dashboard_search/",
              "title": "Grafana: search API"
            }
          ]
        }
      },
      {
        "id": "grafana-service-account-token-sub-1",
        "desc": "Token works if this prints a number instead of an auth error",
        "cmd": "curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/search?limit=1\" | jq length",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "token",
          "service account",
          "api"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/administration/service-accounts/",
              "title": "Grafana: service accounts"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/bash.1.html",
              "title": "bash(1): read builtin"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/folder_dashboard_search/",
              "title": "Grafana: search API"
            }
          ]
        }
      },
      {
        "id": "grafana-service-account-token-sub-2",
        "desc": "Drop the token from this shell when you are done",
        "cmd": "unset GRAFANA_TOKEN",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "token",
          "service account",
          "api"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/administration/service-accounts/",
              "title": "Grafana: service accounts"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/bash.1.html",
              "title": "bash(1): read builtin"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/folder_dashboard_search/",
              "title": "Grafana: search API"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-setup",
    "id": "grafana-setup-pro-tips",
    "badge": "tip",
    "title": "Grafana Lab Setup: Pro Tip",
    "subtitle": "Lab first: build dashboards against a local copy, ship them as files",
    "commands": [
      {
        "id": "grafana-setup-tips-card",
        "desc": "Lab first: build dashboards against a local copy, ship them as files",
        "cmd": "ssh -L 3000:127.0.0.1:3000 <jumpbox>",
        "details": "Build and break dashboards in the compose lab, export the JSON, keep it in git, and provision it to the shared Grafana. The tunnel lets your laptop browser reach a Grafana that only listens on the jumpbox's loopback.",
        "flags": [
          [
            "-L 3000:127.0.0.1:3000",
            "Local port 3000 → the jumpbox's 127.0.0.1:3000; then open http://localhost:3000"
          ],
          [
            "Why not open the port?",
            "Grafana with default settings on a datacenter network is an easy target; a tunnel needs no firewall change"
          ]
        ],
        "tip": "Lab → JSON in git → provisioned",
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
              "url": "https://man.openbsd.org/ssh",
              "title": "ssh(1)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/",
              "title": "Grafana: configuration"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-panels",
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
          ],
          [
            "Save message",
            "Every save is a version (Dashboard settings → Versions); a message makes rollback easy"
          ],
          [
            "Grafana 13 layouts",
            "Dynamic dashboards (GA in 13) add tabs, an auto grid and show/hide rules; Custom layout is the default for a new dashboard, and older dashboards are migrated when opened"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard/",
              "title": "Grafana: create dashboards"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/public/app/features/dashboard-scene/scene/keyboardShortcuts.ts",
              "title": "Grafana source: dashboard shortcuts"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/whatsnew/whats-new-in-v13/whats-new-in-v13-0/",
              "title": "What's new in Grafana 13.0"
            }
          ],
          "note": "Corrected 2026-11-10: zoom out is t - (or Ctrl+Z) in Grafana 13, not t z."
        }
      },
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard/",
              "title": "Grafana: create dashboards"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/public/app/features/dashboard-scene/scene/keyboardShortcuts.ts",
              "title": "Grafana source: dashboard shortcuts"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/whatsnew/whats-new-in-v13/whats-new-in-v13-0/",
              "title": "What's new in Grafana 13.0"
            }
          ],
          "note": "Corrected 2026-11-10: zoom out is t - (or Ctrl+Z) in Grafana 13, not t z."
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard/",
              "title": "Grafana: create dashboards"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/public/app/features/dashboard-scene/scene/keyboardShortcuts.ts",
              "title": "Grafana source: dashboard shortcuts"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/whatsnew/whats-new-in-v13/whats-new-in-v13-0/",
              "title": "What's new in Grafana 13.0"
            }
          ],
          "note": "Corrected 2026-11-10: zoom out is t - (or Ctrl+Z) in Grafana 13, not t z."
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard/",
              "title": "Grafana: create dashboards"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/public/app/features/dashboard-scene/scene/keyboardShortcuts.ts",
              "title": "Grafana source: dashboard shortcuts"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/whatsnew/whats-new-in-v13/whats-new-in-v13-0/",
              "title": "What's new in Grafana 13.0"
            }
          ],
          "note": "Corrected 2026-11-10: zoom out is t - (or Ctrl+Z) in Grafana 13, not t z."
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard/",
              "title": "Grafana: create dashboards"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/public/app/features/dashboard-scene/scene/keyboardShortcuts.ts",
              "title": "Grafana source: dashboard shortcuts"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/whatsnew/whats-new-in-v13/whats-new-in-v13-0/",
              "title": "What's new in Grafana 13.0"
            }
          ],
          "note": "Corrected 2026-11-10: zoom out is t - (or Ctrl+Z) in Grafana 13, not t z."
        }
      },
      {
        "id": "grafana-first-dashboard-sub-5",
        "desc": "Zoom out the time range (Ctrl+Z does the same)",
        "cmd": "t -",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "dashboard",
          "panel",
          "ui"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard/",
              "title": "Grafana: create dashboards"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/public/app/features/dashboard-scene/scene/keyboardShortcuts.ts",
              "title": "Grafana source: dashboard shortcuts"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/whatsnew/whats-new-in-v13/whats-new-in-v13-0/",
              "title": "What's new in Grafana 13.0"
            }
          ],
          "note": "Corrected 2026-11-10: zoom out is t - (or Ctrl+Z) in Grafana 13, not t z."
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard/",
              "title": "Grafana: create dashboards"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/public/app/features/dashboard-scene/scene/keyboardShortcuts.ts",
              "title": "Grafana source: dashboard shortcuts"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/whatsnew/whats-new-in-v13/whats-new-in-v13-0/",
              "title": "What's new in Grafana 13.0"
            }
          ],
          "note": "Corrected 2026-11-10: zoom out is t - (or Ctrl+Z) in Grafana 13, not t z."
        }
      }
    ]
  },
  {
    "part": "grafana-panels",
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
          ],
          [
            "Heatmap",
            "Hundreds of GPUs in one panel: each row a GPU, color = temperature. Spots a single hot GPU faster than 800 lines"
          ],
          [
            "Avoid",
            "Pie charts for anything but small parts-of-a-whole; time series with more than ~20 lines (aggregate or use a table)"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/",
              "title": "Grafana: visualizations"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/state-timeline/",
              "title": "Grafana: state timeline"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/table/",
              "title": "Grafana: table"
            }
          ],
          "note": "Which visualization to pick is advice; the type IDs are from the visualization pages."
        }
      }
    ]
  },
  {
    "part": "grafana-panels",
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
          ],
          [
            "mappings",
            "value (exact match), range (from/to), regex, special (null, NaN, true/false). Mapped text replaces the number"
          ],
          [
            "Thresholds are examples",
            "Take temperature and power limits from the vendor spec for your exact GPU/CPU SKU"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-thresholds/",
              "title": "Grafana: thresholds"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-value-mappings/",
              "title": "Grafana: value mappings"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            }
          ]
        }
      },
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-thresholds/",
              "title": "Grafana: thresholds"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-value-mappings/",
              "title": "Grafana: value mappings"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-thresholds/",
              "title": "Grafana: thresholds"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-value-mappings/",
              "title": "Grafana: value mappings"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-thresholds/",
              "title": "Grafana: thresholds"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-value-mappings/",
              "title": "Grafana: value mappings"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-panels",
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
          ],
          [
            "Add in the UI",
            "Edit panel → Overrides tab → Add field override; the JSON above is the result"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-overrides/",
              "title": "Grafana: field overrides"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/transformations/matchers/ids.ts",
              "title": "Grafana source: matcher IDs"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-panels",
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
          ],
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/query-transform-data/transform-data/",
              "title": "Grafana: transform data"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/query-editor/",
              "title": "Grafana: Prometheus query editor"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-panels",
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
          ],
          [
            "Where",
            "Edit panel → Data links and actions → Add link; type $ in the URL box to get a list of variables"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-data-links/",
              "title": "Grafana: data links and actions"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard-url-variables/",
              "title": "Grafana: dashboard URL variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            }
          ]
        }
      },
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-data-links/",
              "title": "Grafana: data links and actions"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard-url-variables/",
              "title": "Grafana: dashboard URL variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-data-links/",
              "title": "Grafana: data links and actions"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/create-dashboard-url-variables/",
              "title": "Grafana: dashboard URL variables"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-panels",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/",
              "title": "Grafana: dashboard best practices"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-promql",
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
    "part": "grafana-promql",
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
    "part": "grafana-promql",
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
    "part": "grafana-promql",
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
    "part": "grafana-promql",
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
    "part": "grafana-promql",
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
    "part": "grafana-promql",
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
    "part": "grafana-promql",
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
  },
  {
    "part": "grafana-variables",
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
    "part": "grafana-variables",
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
    "part": "grafana-variables",
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
    "part": "grafana-variables",
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
    "part": "grafana-variables",
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
    "part": "grafana-variables",
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
    "part": "grafana-variables",
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
  },
  {
    "part": "grafana-as-code",
    "id": "grafana-as-code-cmd-1",
    "badge": "code",
    "title": "Dashboards as Code: Minimal dashboard JSON",
    "subtitle": "Minimal dashboard JSON (classic model) with one panel",
    "commands": [
      {
        "id": "grafana-dashboard-json-skeleton",
        "desc": "Minimal dashboard JSON (classic model) with one panel",
        "cmd": "{\n  \"uid\": \"gpu-fleet\",\n  \"title\": \"GPU Fleet\",\n  \"tags\": [\"gpu\", \"dcgm\"],\n  \"time\": { \"from\": \"now-6h\", \"to\": \"now\" },\n  \"refresh\": \"30s\",\n  \"panels\": [\n    {\n      \"type\": \"timeseries\",\n      \"title\": \"GPU utilization\",\n      \"gridPos\": { \"x\": 0, \"y\": 0, \"w\": 12, \"h\": 8 },\n      \"datasource\": { \"type\": \"prometheus\", \"uid\": \"prometheus\" },\n      \"targets\": [\n        { \"refId\": \"A\",\n          \"expr\": \"avg by (hostname) (DCGM_FI_DEV_GPU_UTIL_RATIO{hostname=~\\\"$host\\\"})\",\n          \"legendFormat\": \"{{hostname}}\" }\n      ],\n      \"fieldConfig\": { \"defaults\": { \"unit\": \"percentunit\", \"min\": 0, \"max\": 1 }, \"overrides\": [] }\n    }\n  ]\n}",
        "details": "",
        "flags": [
          [
            "uid",
            "Stable ID used in URLs (/d/gpu-fleet) and by the API. Set it yourself so it never changes"
          ],
          [
            "gridPos",
            "24 columns wide; w = width in columns, h = height in rows (~30 px), x/y = position. w 12 = half width"
          ],
          [
            "targets[].expr",
            "The PromQL. Inside JSON, double quotes in the query must be escaped as \\\""
          ],
          [
            "Leave out id",
            "id is per-instance; when moving a dashboard between Grafanas, remove it (or set null) and keep uid"
          ],
          [
            "Grafana 13",
            "A dashboard can be exported as Classic JSON (like this) or the V2 Resource schema (apiVersion/kind/spec); classic JSON still imports and is migrated when opened"
          ]
        ],
        "tip": "Set uid yourself; drop id when moving",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "json",
          "model",
          "uid",
          "gridPos",
          "panels",
          "export",
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
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana: Dashboard API (/apis)"
            }
          ]
        }
      },
      {
        "id": "grafana-dashboard-json-skeleton-sub-1",
        "desc": "Check the file is valid JSON before loading it",
        "cmd": "jq . gpu-fleet.json > /dev/null && echo valid",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "json",
          "model",
          "uid"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/view-dashboard-json-model/",
              "title": "Grafana: dashboard JSON model"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana: Dashboard API (/apis)"
            }
          ]
        }
      },
      {
        "id": "grafana-dashboard-json-skeleton-sub-2",
        "desc": "List panels in layout order",
        "cmd": "jq -r '.panels[] | \"\\(.gridPos.y)\\t\\(.gridPos.x)\\t\\(.title)\"' gpu-fleet.json | sort -n",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "json",
          "model",
          "uid"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/view-dashboard-json-model/",
              "title": "Grafana: dashboard JSON model"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana: Dashboard API (/apis)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-as-code",
    "id": "grafana-as-code-cmd-2",
    "badge": "code",
    "title": "Dashboards as Code: Load dashboards from a folder of JSON files",
    "subtitle": "Load dashboards from a folder of JSON files (provisioning/dashboards/fleet.yaml)",
    "commands": [
      {
        "id": "grafana-dashboard-provider",
        "desc": "Load dashboards from a folder of JSON files (provisioning/dashboards/fleet.yaml)",
        "cmd": "apiVersion: 1\nproviders:\n  - name: fleet\n    type: file\n    disableDeletion: true\n    allowUiUpdates: false\n    updateIntervalSeconds: 30\n    options:\n      path: /var/lib/grafana/dashboards\n      foldersFromFilesStructure: true",
        "details": "",
        "flags": [
          [
            "options.path",
            "Grafana reads every .json file here (inside the container, so mount your git folder there)"
          ],
          [
            "foldersFromFilesStructure",
            "Each subfolder becomes a Grafana folder (dashboards/gpu/ → folder gpu). Do not also set folder/folderUid"
          ],
          [
            "updateIntervalSeconds",
            "How often Grafana re-reads the files; edits in git show up without a restart"
          ],
          [
            "allowUiUpdates: false",
            "UI edits are blocked, so git stays the source of truth. To change a dashboard: edit in the lab, export JSON, commit"
          ],
          [
            "disableDeletion",
            "Removing a file does not delete the dashboard; safer while you are learning"
          ]
        ],
        "tip": "Git is the source of truth: allowUiUpdates false",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "provisioning",
          "yaml",
          "file",
          "folders",
          "gitops"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/administration/provisioning/",
              "title": "Grafana: provisioning"
            }
          ]
        }
      },
      {
        "id": "grafana-dashboard-provider-sub-1",
        "desc": "See which dashboards loaded and any JSON errors",
        "cmd": "docker compose logs grafana | grep -i provisioning",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "provisioning",
          "yaml",
          "file"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/administration/provisioning/",
              "title": "Grafana: provisioning"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-as-code",
    "id": "grafana-as-code-cmd-3",
    "badge": "code",
    "title": "Dashboards as Code: Export a dashboard's JSON with the HTTP API",
    "subtitle": "Export a dashboard's JSON with the HTTP API",
    "commands": [
      {
        "id": "grafana-api-export",
        "desc": "Export a dashboard's JSON with the HTTP API",
        "cmd": "curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/dashboards/uid/gpu-fleet\" | jq '.dashboard | del(.id)' > gpu-fleet.json",
        "details": "",
        "flags": [
          [
            "/api/dashboards/uid/<uid>",
            "Returns { dashboard: {...}, meta: {...} }; meta holds folder and version info"
          ],
          [
            "jq '.dashboard | del(.id)'",
            "Keep only the dashboard and remove the instance-specific id"
          ],
          [
            "> gpu-fleet.json",
            "Redirect into a file you commit to git"
          ],
          [
            "Grafana 13",
            "The /api routes are deprecated in favour of /apis, but still served: they just no longer get updates"
          ]
        ],
        "tip": "Export → del(.id) → commit",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "api",
          "export",
          "curl",
          "jq",
          "backup",
          "uid"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana 12.4: dashboard API (/api/dashboards)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/folder_dashboard_search/",
              "title": "Grafana: search API"
            },
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/folder/",
              "title": "Grafana 12.4: folder API"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana: Dashboard API (/apis)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/",
              "title": "Grafana: legacy HTTP API (deprecation)"
            }
          ],
          "note": "Added 2026-11-10: Grafana 13 deprecates /api routes for /apis; they are still served but no longer updated."
        }
      },
      {
        "id": "grafana-api-export-sub-1",
        "desc": "Find dashboards and their UIDs",
        "cmd": "curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/search?type=dash-db&query=gpu\" | jq -r '.[] | \"\\(.uid)\\t\\(.folderTitle)\\t\\(.title)\"'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "api",
          "export",
          "curl"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana 12.4: dashboard API (/api/dashboards)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/folder_dashboard_search/",
              "title": "Grafana: search API"
            },
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/folder/",
              "title": "Grafana 12.4: folder API"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana: Dashboard API (/apis)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/",
              "title": "Grafana: legacy HTTP API (deprecation)"
            }
          ],
          "note": "Added 2026-11-10: Grafana 13 deprecates /api routes for /apis; they are still served but no longer updated."
        }
      },
      {
        "id": "grafana-api-export-sub-2",
        "desc": "List folders and their UIDs",
        "cmd": "curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/folders\" | jq -r '.[] | \"\\(.uid)\\t\\(.title)\"'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "api",
          "export",
          "curl"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana 12.4: dashboard API (/api/dashboards)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/folder_dashboard_search/",
              "title": "Grafana: search API"
            },
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/folder/",
              "title": "Grafana 12.4: folder API"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana: Dashboard API (/apis)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/",
              "title": "Grafana: legacy HTTP API (deprecation)"
            }
          ],
          "note": "Added 2026-11-10: Grafana 13 deprecates /api routes for /apis; they are still served but no longer updated."
        }
      },
      {
        "id": "grafana-api-export-sub-3",
        "desc": "Back up every dashboard to <uid>.json",
        "cmd": "for uid in $(curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/search?type=dash-db\" | jq -r '.[].uid'); do curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/api/dashboards/uid/$uid\" | jq '.dashboard | del(.id)' > \"$uid.json\"; done",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "api",
          "export",
          "curl"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana 12.4: dashboard API (/api/dashboards)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/folder_dashboard_search/",
              "title": "Grafana: search API"
            },
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/folder/",
              "title": "Grafana 12.4: folder API"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana: Dashboard API (/apis)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/",
              "title": "Grafana: legacy HTTP API (deprecation)"
            }
          ],
          "note": "Added 2026-11-10: Grafana 13 deprecates /api routes for /apis; they are still served but no longer updated."
        }
      },
      {
        "id": "grafana-api-export-sub-4",
        "desc": "The same dashboard from the new Dashboard API (Grafana 12+); spec holds the classic JSON. The namespace is default in Grafana's examples",
        "cmd": "curl -s -H \"Authorization: Bearer $GRAFANA_TOKEN\" \"$GRAFANA_URL/apis/dashboard.grafana.app/v1/namespaces/default/dashboards/gpu-fleet\" | jq '.spec'",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "api",
          "export",
          "curl"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana 12.4: dashboard API (/api/dashboards)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/folder_dashboard_search/",
              "title": "Grafana: search API"
            },
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/folder/",
              "title": "Grafana 12.4: folder API"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana: Dashboard API (/apis)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/",
              "title": "Grafana: legacy HTTP API (deprecation)"
            }
          ],
          "note": "Added 2026-11-10: Grafana 13 deprecates /api routes for /apis; they are still served but no longer updated."
        }
      }
    ]
  },
  {
    "part": "grafana-as-code",
    "id": "grafana-as-code-cmd-4",
    "badge": "code",
    "title": "Dashboards as Code: Create or update a dashboard from a JSON file with the HTTP API",
    "subtitle": "Create or update a dashboard from a JSON file with the HTTP API (changes state)",
    "commands": [
      {
        "id": "grafana-api-import",
        "desc": "Create or update a dashboard from a JSON file with the HTTP API (changes state)",
        "cmd": "jq '{dashboard: (. | .id = null), folderUid: \"<folder-uid>\", overwrite: true, message: \"update from git\"}' gpu-fleet.json | curl -s -X POST -H \"Authorization: Bearer $GRAFANA_TOKEN\" -H 'Content-Type: application/json' --data-binary @- \"$GRAFANA_URL/api/dashboards/db\" | jq",
        "details": "",
        "flags": [
          [
            "jq '{dashboard: ..., ...}'",
            "Wraps the dashboard in the body the API expects"
          ],
          [
            "folderUid",
            "Folder to save into. If you leave it out on an update, the dashboard moves to the root level"
          ],
          [
            "overwrite: true",
            "Replace an existing dashboard with the same uid. Without it, the API refuses (412 version-mismatch / name-exists)"
          ],
          [
            "message",
            "Shows in the dashboard's version history"
          ],
          [
            "--data-binary @-",
            "Read the body from stdin (the jq output) without changing newlines"
          ]
        ],
        "tip": "412 = someone changed it; re-export first",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "api",
          "import",
          "post",
          "curl",
          "jq",
          "overwrite",
          "folder"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/v12.4/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana 12.4: dashboard API (/api/dashboards)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/dashboard/",
              "title": "Grafana: Dashboard API (/apis)"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/developer-resources/api-reference/http-api/api-legacy/",
              "title": "Grafana: legacy HTTP API (deprecation)"
            }
          ],
          "note": "Corrected 2026-11-10: leaving out folderUid on an update moves the dashboard to the root level (it was \"can move\")."
        }
      }
    ]
  },
  {
    "part": "grafana-as-code",
    "id": "grafana-as-code-cmd-5",
    "badge": "code",
    "title": "Dashboards as Code: gcx",
    "subtitle": "gcx: pull and push dashboards as files (successor to grafanactl; full support on Grafana 13+)",
    "commands": [
      {
        "id": "grafana-gcx",
        "desc": "gcx: pull and push dashboards as files (successor to grafanactl; full support on Grafana 13+)",
        "cmd": "gcx resources pull --path ./resources/ -o yaml",
        "details": "",
        "flags": [
          [
            "gcx resources pull",
            "Download resources (dashboards, folders…) from the current context into files"
          ],
          [
            "-p / --path",
            "Directory to read/write; the default is ./resources"
          ],
          [
            "-o yaml|json",
            "File format for pulled resources"
          ],
          [
            "--include-managed",
            "Also touch resources owned by Terraform or Git Sync (skipped by default)"
          ],
          [
            "Contexts",
            "gcx login creates a context per Grafana (lab, prod); gcx config manages and switches them (gcx config --help)"
          ],
          [
            "grafanactl",
            "Deprecated (last release v0.1.10, April 2026). Its README says to search-and-replace grafanactl with gcx in old scripts"
          ]
        ],
        "tip": "Old scripts: grafanactl → gcx",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "gcx",
          "grafanactl",
          "cli",
          "pull",
          "push",
          "gitops"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/grafana/gcx",
              "title": "gcx README"
            },
            {
              "url": "https://github.com/grafana/gcx/blob/main/cmd/gcx/resources/pull.go",
              "title": "gcx source: resources pull flags"
            },
            {
              "url": "https://github.com/grafana/grafanactl",
              "title": "grafanactl README (deprecation)"
            }
          ],
          "note": "Corrected 2026-11-10: grafanactl's repo was announced for archiving on June 1, 2026 but was still not archived on Nov 10; gcx fully supports Grafana 13+ only."
        }
      },
      {
        "id": "grafana-gcx-sub-1",
        "desc": "Upload the files to the current context (changes state)",
        "cmd": "gcx resources push -p ./resources/",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "gcx",
          "grafanactl",
          "cli"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/grafana/gcx",
              "title": "gcx README"
            },
            {
              "url": "https://github.com/grafana/gcx/blob/main/cmd/gcx/resources/pull.go",
              "title": "gcx source: resources pull flags"
            },
            {
              "url": "https://github.com/grafana/grafanactl",
              "title": "grafanactl README (deprecation)"
            }
          ],
          "note": "Corrected 2026-11-10: grafanactl's repo was announced for archiving on June 1, 2026 but was still not archived on Nov 10; gcx fully supports Grafana 13+ only."
        }
      },
      {
        "id": "grafana-gcx-sub-2",
        "desc": "Local live-reload preview of dashboard files while you edit them (replaces grafanactl resources serve; runs until Ctrl+C)",
        "cmd": "gcx dev serve",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "gcx",
          "grafanactl",
          "cli"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/grafana/gcx",
              "title": "gcx README"
            },
            {
              "url": "https://github.com/grafana/gcx/blob/main/cmd/gcx/resources/pull.go",
              "title": "gcx source: resources pull flags"
            },
            {
              "url": "https://github.com/grafana/grafanactl",
              "title": "grafanactl README (deprecation)"
            }
          ],
          "note": "Corrected 2026-11-10: grafanactl's repo was announced for archiving on June 1, 2026 but was still not archived on Nov 10; gcx fully supports Grafana 13+ only."
        }
      },
      {
        "id": "grafana-gcx-sub-3",
        "desc": "Commands vary by version and some are marked [experimental]; check help before scripting",
        "cmd": "gcx --help",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "gcx",
          "grafanactl",
          "cli"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/grafana/gcx",
              "title": "gcx README"
            },
            {
              "url": "https://github.com/grafana/gcx/blob/main/cmd/gcx/resources/pull.go",
              "title": "gcx source: resources pull flags"
            },
            {
              "url": "https://github.com/grafana/grafanactl",
              "title": "grafanactl README (deprecation)"
            }
          ],
          "note": "Corrected 2026-11-10: grafanactl's repo was announced for archiving on June 1, 2026 but was still not archived on Nov 10; gcx fully supports Grafana 13+ only."
        }
      }
    ]
  },
  {
    "part": "grafana-as-code",
    "id": "grafana-as-code-cmd-6",
    "badge": "code",
    "title": "Dashboards as Code: Git Sync",
    "subtitle": "Git Sync (GA in Grafana 13): keep dashboards in a Git repo (GitHub, GitLab, Bitbucket or any Git) from the UI",
    "commands": [
      {
        "id": "grafana-git-sync",
        "desc": "Git Sync (GA in Grafana 13): keep dashboards in a Git repo (GitHub, GitLab, Bitbucket or any Git) from the UI",
        "cmd": "Administration → General → Provisioning → Configure Git Sync",
        "details": "",
        "flags": [
          [
            "What it does",
            "Dashboards saved in the UI become commits (or pull requests) in a repo, and changes in the repo flow back to Grafana"
          ],
          [
            "Auth",
            "GitHub: personal access token, GitHub App or OAuth App; GitLab and Bitbucket: a token. Use a dedicated repo or folder"
          ],
          [
            "vs file provisioning",
            "File provisioning is one-way (files → Grafana). Git Sync is two-way and keeps UI editing"
          ],
          [
            "vs API/gcx",
            "API and gcx are scripts you run; Git Sync runs continuously inside Grafana"
          ]
        ],
        "tip": "One-way: files. Two-way: Git Sync",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "git sync",
          "git",
          "gitops",
          "github",
          "provisioning"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://grafana.com/docs/grafana/latest/as-code/git-sync/",
              "title": "Grafana: Git Sync"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/as-code/git-sync/git-sync-setup/",
              "title": "Grafana: set up Git Sync"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/whatsnew/whats-new-in-v13/whats-new-in-v13-0/",
              "title": "What's new in Grafana 13.0"
            }
          ],
          "note": "Corrected 2026-11-10: Git Sync works with any Git repo, and GitHub can also use a personal access token or an OAuth App."
        }
      }
    ]
  },
  {
    "part": "grafana-as-code",
    "id": "grafana-as-code-pro-tips",
    "badge": "tip",
    "title": "Dashboards as Code: Pro Tip",
    "subtitle": "Pick one source of truth per dashboard",
    "commands": [
      {
        "id": "grafana-as-code-tips-card",
        "desc": "Pick one source of truth per dashboard",
        "cmd": "Lab UI edit → export JSON → git commit → provision / push → shared Grafana (read-only)",
        "details": "Problems start when the same dashboard is changed in the UI and in git. Decide per folder: provisioned from git (UI read-only) or UI-owned (backed up by the export loop).",
        "flags": [
          [
            "Review diffs",
            "git diff on dashboard JSON shows exactly which query or threshold changed"
          ],
          [
            "Datasource UIDs",
            "Use the same provisioned UID everywhere so JSON moves between lab and prod untouched"
          ],
          [
            "Backups",
            "The export loop on the previous cards is a cheap nightly backup even for UI-owned dashboards"
          ]
        ],
        "tip": "Never edit the same dashboard in two places",
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
              "url": "https://grafana.com/docs/grafana/latest/administration/provisioning/",
              "title": "Grafana: provisioning"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/as-code/git-sync/",
              "title": "Grafana: Git Sync"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-gpu-dashboard",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/release-notes/dcgm-exporter.html",
              "title": "dcgm-exporter release notes"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/release-notes/dcgm-exporter.html",
              "title": "dcgm-exporter release notes"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/release-notes/dcgm-exporter.html",
              "title": "dcgm-exporter release notes"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/release-notes/dcgm-exporter.html",
              "title": "dcgm-exporter release notes"
            },
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-gpu-dashboard",
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
            "dcgm-exporter 4.9.0 updated the dashboard in its repo (grafana/dcgm-exporter-dashboard.json) to the new names and units. Dashboard 12239 on grafana.com (NVIDIA, last revised 2021) still uses the pre-4.9 names"
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/grafana/dcgm-exporter-dashboard.json",
              "title": "dcgm-exporter 4.9.0 Grafana dashboard"
            },
            {
              "url": "https://grafana.com/grafana/dashboards/12239-nvidia-dcgm-exporter-dashboard/",
              "title": "Grafana dashboard 12239"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/import-dashboards/",
              "title": "Grafana: import dashboards"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            }
          ],
          "note": "Corrected 2026-11-10: 12239 is published by NVIDIA (not community) and was last revised in 2021; the 4.9.0 dashboard is in the exporter repo."
        }
      },
      {
        "id": "gpu-dash-layout-sub-1",
        "desc": "Import the exporter's own dashboard (read its JSON before trusting it); entering ID 12239 instead gets the pre-4.9 one",
        "cmd": "Dashboards → New → Import → upload dcgm-exporter-dashboard.json → pick the Prometheus data source",
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "recipe",
          "layout",
          "gpu",
          "dcgm"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/grafana/dcgm-exporter-dashboard.json",
              "title": "dcgm-exporter 4.9.0 Grafana dashboard"
            },
            {
              "url": "https://grafana.com/grafana/dashboards/12239-nvidia-dcgm-exporter-dashboard/",
              "title": "Grafana dashboard 12239"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/import-dashboards/",
              "title": "Grafana: import dashboards"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/datasources/prometheus/template-variables/",
              "title": "Grafana: Prometheus template variables"
            }
          ],
          "note": "Corrected 2026-11-10: 12239 is published by NVIDIA (not community) and was last revised in 2021; the 4.9.0 dashboard is in the exporter repo."
        }
      }
    ]
  },
  {
    "part": "grafana-gpu-dashboard",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-standard-options/",
              "title": "Grafana: standard options"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-gpu-dashboard",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/release-notes/dcgm-exporter.html",
              "title": "dcgm-exporter release notes"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/query-transform-data/transform-data/",
              "title": "Grafana: transform data"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/table/",
              "title": "Grafana: table"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-gpu-dashboard",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            }
          ]
        }
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://github.com/grafana/grafana/blob/main/packages/grafana-data/src/valueFormats/categories.ts",
              "title": "Grafana source: unit IDs"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-gpu-dashboard",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/NVIDIA/dcgm-exporter/blob/4.9.0/etc/default-counters.csv",
              "title": "dcgm-exporter 4.9.0 default-counters.csv"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/visualizations/state-timeline/",
              "title": "Grafana: state timeline"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/panels-visualizations/configure-value-mappings/",
              "title": "Grafana: value mappings"
            }
          ],
          "note": "XID codes themselves are on the NVIDIA DC Xid sheet."
        }
      }
    ]
  },
  {
    "part": "grafana-gpu-dashboard",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/prometheus/node_exporter",
              "title": "node_exporter README"
            },
            {
              "url": "https://github.com/prometheus/node_exporter/blob/master/collector/infiniband_linux.go",
              "title": "node_exporter infiniband collector"
            },
            {
              "url": "https://github.com/prometheus/node_exporter/blob/master/collector/uname.go",
              "title": "node_exporter uname collector"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/operators/",
              "title": "PromQL operators"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "grafana-gpu-dashboard",
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
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/reference/command-line-reference/dcgm-exporter.html",
              "title": "dcgm-exporter command reference"
            },
            {
              "url": "https://prometheus.io/docs/prometheus/latest/querying/api/",
              "title": "Prometheus HTTP API"
            },
            {
              "url": "https://grafana.com/docs/grafana/latest/visualizations/dashboards/use-dashboards/",
              "title": "Grafana: use dashboards (shortcuts)"
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
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("grafana.html", "grafana_bookmarks", GRAFANA_CHEAT_SHEET_DATA, {"grafana-setup":"grafana-setup_bookmarks","grafana-panels":"grafana-panels_bookmarks","grafana-promql":"grafana-promql_bookmarks","grafana-variables":"grafana-variables_bookmarks","grafana-as-code":"grafana-as-code_bookmarks","grafana-gpu-dashboard":"grafana-gpu-dashboard_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("grafana_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(GRAFANA_CHEAT_SHEET_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: GRAFANA_CHEAT_SHEET_DATA, label: "Grafana sheets", parts: {
   "grafana-as-code": {
    "title": "Dashboards as Code",
    "subtitle": "Export dashboards to JSON, keep them in git, and load them with provisioning files, the HTTP API, gcx or Git Sync",
    "pill": "Grafana 13.x / Prometheus"
   },
   "grafana-gpu-dashboard": {
    "title": "GPU Fleet Dashboard",
    "subtitle": "A worked example: the panels, queries and layout for a datacenter GPU dashboard built on dcgm-exporter and node_exporter",
    "pill": "Grafana 13.x / Prometheus"
   },
   "grafana-panels": {
    "title": "Grafana Panels",
    "subtitle": "The click-path for a first dashboard, which visualization fits which question, and the field settings that make panels readable",
    "pill": "Grafana 13.x / Prometheus"
   },
   "grafana-promql": {
    "title": "PromQL for Dashboards",
    "subtitle": "The PromQL patterns behind most panels: counters with rate(), aggregation by label, top-N, comparisons and label joins",
    "pill": "Grafana 13.x / Prometheus"
   },
   "grafana-setup": {
    "title": "Grafana Lab Setup",
    "subtitle": "Stand up a local Grafana + Prometheus lab, point Prometheus at your exporters, and connect the data source",
    "pill": "Grafana 13.x / Prometheus"
   },
   "grafana-variables": {
    "title": "Grafana Variables",
    "subtitle": "One dashboard for every node and GPU: query variables, chained filters, multi-value formatting and repeated panels",
    "pill": "Grafana 13.x / Prometheus"
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
  // One toast for the whole site: common.js keeps a placeholder warning from being replaced.
  if (window.showGlobalToast) return window.showGlobalToast(msg);
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
  const allCards = GRAFANA_CHEAT_SHEET_DATA;
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

  for (const card of GRAFANA_CHEAT_SHEET_DATA) {
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
        localStorage.setItem("grafana_bookmarks", JSON.stringify([...state.bookmarks]));
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
