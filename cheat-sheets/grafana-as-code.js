// grafana-as-code.js
// Standalone interactive cheat sheet for Grafana: Grafana Dashboards as Code: JSON, Provisioning, HTTP API, gcx & Git Sync
const GRAF_GRAFANA_AS_CODE_DATA = [
  {
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
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-flags-1",
    "badge": "code",
    "title": "Dashboards as Code: More options",
    "subtitle": "More options for: Minimal dashboard JSON",
    "commands": [
      {
        "id": "grafana-dashboard-json-skeleton-flags-card",
        "desc": "More options and gotchas for: Minimal dashboard JSON",
        "cmd": "{\n  \"uid\": \"gpu-fleet\",\n  \"title\": \"GPU Fleet\",\n  \"tags\": [\"gpu\", \"dcgm\"],\n  \"time\": { \"from\": \"now-6h\", \"to\": \"now\" },\n  \"refresh\": \"30s\",\n  \"panels\": [\n    {\n      \"type\": \"timeseries\",\n      \"title\": \"GPU utilization\",\n      \"gridPos\": { \"x\": 0, \"y\": 0, \"w\": 12, \"h\": 8 },\n      \"datasource\": { \"type\": \"prometheus\", \"uid\": \"prometheus\" },\n      \"targets\": [\n        { \"refId\": \"A\",\n          \"expr\": \"avg by (hostname) (DCGM_FI_DEV_GPU_UTIL_RATIO{hostname=~\\\"$host\\\"})\",\n          \"legendFormat\": \"{{hostname}}\" }\n      ],\n      \"fieldConfig\": { \"defaults\": { \"unit\": \"percentunit\", \"min\": 0, \"max\": 1 }, \"overrides\": [] }\n    }\n  ]\n}",
        "hideCode": true,
        "flags": [
          [
            "Leave out id",
            "id is per-instance; when moving a dashboard between Grafanas, remove it (or set null) and keep uid"
          ],
          [
            "Grafana 13",
            "Exports default to the v2 resource schema (apiVersion/kind/spec); classic JSON like this still imports and is migrated"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "json",
          "model",
          "uid"
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-recipes-1",
    "badge": "code",
    "title": "Dashboards as Code: Related commands",
    "subtitle": "Related commands for: Minimal dashboard JSON",
    "commands": [
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
        ]
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
        ]
      }
    ]
  },
  {
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
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-flags-2",
    "badge": "code",
    "title": "Dashboards as Code: More options",
    "subtitle": "More options for: Load dashboards from a folder of JSON files",
    "commands": [
      {
        "id": "grafana-dashboard-provider-flags-card",
        "desc": "More options and gotchas for: Load dashboards from a folder of JSON files",
        "cmd": "apiVersion: 1\nproviders:\n  - name: fleet\n    type: file\n    disableDeletion: true\n    allowUiUpdates: false\n    updateIntervalSeconds: 30\n    options:\n      path: /var/lib/grafana/dashboards\n      foldersFromFilesStructure: true",
        "hideCode": true,
        "flags": [
          [
            "allowUiUpdates: false",
            "UI edits are blocked, so git stays the source of truth. To change a dashboard: edit in the lab, export JSON, commit"
          ],
          [
            "disableDeletion",
            "Removing a file does not delete the dashboard; safer while you are learning"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "provisioning",
          "yaml",
          "file"
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-recipes-2",
    "badge": "code",
    "title": "Dashboards as Code: Related commands",
    "subtitle": "Related commands for: Load dashboards from a folder of JSON files",
    "commands": [
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
        ]
      }
    ]
  },
  {
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
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-recipes-3",
    "badge": "code",
    "title": "Dashboards as Code: Related commands",
    "subtitle": "Related commands for: Export a dashboard's JSON with the HTTP API",
    "commands": [
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
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
            "Folder to save into. If you leave it out on an update, the dashboard can move to the General folder"
          ],
          [
            "overwrite: true",
            "Replace an existing dashboard with the same uid or title. Without it, the API refuses (412 version-mismatch / name-exists)"
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
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-flags-4",
    "badge": "code",
    "title": "Dashboards as Code: More options",
    "subtitle": "More options for: Create or update a dashboard from a JSON file with the HTTP API",
    "commands": [
      {
        "id": "grafana-api-import-flags-card",
        "desc": "More options and gotchas for: Create or update a dashboard from a JSON file with the HTTP API",
        "cmd": "jq '{dashboard: (. | .id = null), folderUid: \"<folder-uid>\", overwrite: true, message: \"update from git\"}' gpu-fleet.json | curl -s -X POST -H \"Authorization: Bearer $GRAFANA_TOKEN\" -H 'Content-Type: application/json' --data-binary @- \"$GRAFANA_URL/api/dashboards/db\" | jq",
        "hideCode": false,
        "flags": [
          [
            "message",
            "Shows in the dashboard's version history"
          ],
          [
            "--data-binary @-",
            "Read the body from stdin (the jq output) without changing newlines"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "api",
          "import",
          "post"
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-cmd-5",
    "badge": "code",
    "title": "Dashboards as Code: gcx",
    "subtitle": "gcx: pull and push dashboards as files (successor to grafanactl, Grafana 12+)",
    "commands": [
      {
        "id": "grafana-gcx",
        "desc": "gcx: pull and push dashboards as files (successor to grafanactl, Grafana 12+)",
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
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-flags-5",
    "badge": "code",
    "title": "Dashboards as Code: More options",
    "subtitle": "More options for: gcx: pull and push dashboards as files",
    "commands": [
      {
        "id": "grafana-gcx-flags-card",
        "desc": "More options and gotchas for: gcx: pull and push dashboards as files",
        "cmd": "gcx resources pull --path ./resources/ -o yaml",
        "hideCode": false,
        "flags": [
          [
            "--include-managed",
            "Also touch resources owned by Terraform or Git Sync (skipped by default)"
          ],
          [
            "Contexts",
            "Configure one context per Grafana (lab, prod) and switch between them; see gcx config --help"
          ],
          [
            "grafanactl",
            "Deprecated; its repo was archived 2026-06-01. Replace grafanactl with gcx in old scripts"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "gcx",
          "grafanactl",
          "cli"
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-recipes-5",
    "badge": "code",
    "title": "Dashboards as Code: Related commands",
    "subtitle": "Related commands for: gcx: pull and push dashboards as files",
    "commands": [
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
        ]
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
        ]
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
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-cmd-6",
    "badge": "code",
    "title": "Dashboards as Code: Git Sync",
    "subtitle": "Git Sync (GA in Grafana 13): keep dashboards in a GitHub/GitLab/Bitbucket repo from the UI",
    "commands": [
      {
        "id": "grafana-git-sync",
        "desc": "Git Sync (GA in Grafana 13): keep dashboards in a GitHub/GitLab/Bitbucket repo from the UI",
        "cmd": "Administration → General → Provisioning → Configure Git Sync",
        "details": "",
        "flags": [
          [
            "What it does",
            "Dashboards saved in the UI become commits (or pull requests) in a repo, and changes in the repo flow back to Grafana"
          ],
          [
            "Auth",
            "GitHub App or a token for GitLab/Bitbucket; use a dedicated repo or folder"
          ],
          [
            "vs file provisioning",
            "File provisioning is one-way (files → Grafana). Git Sync is two-way and keeps UI editing"
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
        ]
      }
    ]
  },
  {
    "id": "grafana-as-code-flags-6",
    "badge": "code",
    "title": "Dashboards as Code: More options",
    "subtitle": "More options for: Git Sync",
    "commands": [
      {
        "id": "grafana-git-sync-flags-card",
        "desc": "More options and gotchas for: Git Sync",
        "cmd": "Administration → General → Provisioning → Configure Git Sync",
        "hideCode": false,
        "flags": [
          [
            "vs API/gcx",
            "API and gcx are scripts you run; Git Sync runs continuously inside Grafana"
          ]
        ],
        "tags": [
          "grafana",
          "dashboards",
          "observability",
          "flags",
          "options",
          "git sync",
          "git",
          "gitops"
        ]
      }
    ]
  },
  {
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("grafana-as-code_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = GRAF_GRAFANA_AS_CODE_DATA;
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

  for (const card of GRAF_GRAFANA_AS_CODE_DATA) {
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
        localStorage.setItem("grafana-as-code_bookmarks", JSON.stringify([...state.bookmarks]));
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
