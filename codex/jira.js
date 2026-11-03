// Jira JQL templates. Field names and example values must be adapted to your site.
const JIRA_DATA = [
  {
    "id": "jira-history",
    "badge": "JQL",
    "title": "Server, Node & Serial History",
    "subtitle": "All statuses and all dates; start here before narrowing by project",
    "commands": [
      {
        "id": "jira-node-history",
        "desc": "All tickets mentioning a server or node",
        "cmd": "(summary ~ \"\\\"NODE_NAME\\\"\" OR description ~ \"\\\"NODE_NAME\\\"\") ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Text matching is tokenized: quotes narrow a phrase but do not guarantee exact hostname punctuation or whole-field equality. Check results against serial numbers and aliases. No project, status, or date filter: includes matching closed tickets. Replace NODE_NAME with the hostname.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "server",
          "node",
          "hostname",
          "history"
        ]
      },
      {
        "id": "jira-node-broad",
        "desc": "Broader node mentions, including comments",
        "cmd": "text ~ \"\\\"NODE_NAME\\\"\" ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Text matching is tokenized: quotes narrow a phrase but do not guarantee exact hostname punctuation or whole-field equality. Check results against serial numbers and aliases. The text field searches indexed Summary, Description, environment, comments, and custom text fields. It does not search arbitrary attachments or every previous value in field history.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "node",
          "comments",
          "history"
        ]
      },
      {
        "id": "jira-aliases",
        "desc": "Hostname, old name, or serial number",
        "cmd": "((summary ~ \"\\\"NODE_NAME\\\"\" OR description ~ \"\\\"NODE_NAME\\\"\") OR (summary ~ \"\\\"OLD_NODE_NAME\\\"\" OR description ~ \"\\\"OLD_NODE_NAME\\\"\") OR (summary ~ \"\\\"SERIAL_NUMBER\\\"\" OR description ~ \"\\\"SERIAL_NUMBER\\\"\")) ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Search multiple known identifiers when a node was renamed or moved. Use serial history to distinguish different servers that occupied the same location.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "aliases",
          "serial",
          "rename",
          "history"
        ]
      },
      {
        "id": "jira-serial",
        "desc": "All tickets mentioning a chassis serial",
        "cmd": "(summary ~ \"\\\"SERIAL_NUMBER\\\"\" OR description ~ \"\\\"SERIAL_NUMBER\\\"\") ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Text matching is tokenized: quotes narrow a phrase but do not guarantee exact hostname punctuation or whole-field equality. Check results against serial numbers and aliases. Useful for tracking the same chassis across hostname changes and rack moves.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "serial",
          "chassis",
          "rma"
        ]
      },
      {
        "id": "jira-projects",
        "desc": "Node history within selected projects",
        "cmd": "project IN (PROJECT_A, PROJECT_B) AND (summary ~ \"\\\"NODE_NAME\\\"\" OR description ~ \"\\\"NODE_NAME\\\"\") ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Replace project keys using Jira autocomplete. Parentheses preserve the intended AND/OR grouping. Remove the project clause if you are unsure where older tickets were filed.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "project",
          "node",
          "history"
        ]
      }
    ]
  },
  {
    "id": "jira-location",
    "badge": "JQL",
    "title": "Rack, Position & Site History",
    "subtitle": "Combine location identifiers to avoid matching the same position in unrelated racks",
    "commands": [
      {
        "id": "jira-rack",
        "desc": "All tickets mentioning a rack",
        "cmd": "(summary ~ \"\\\"RACK_ID\\\"\" OR description ~ \"\\\"RACK_ID\\\"\") ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Text matching is tokenized: quotes narrow a phrase but do not guarantee exact hostname punctuation or whole-field equality. Check results against serial numbers and aliases. Includes rack-wide incidents and tickets that explicitly mention the rack; node-only tickets are not automatically associated with their rack.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "rack",
          "history"
        ]
      },
      {
        "id": "jira-position",
        "desc": "Rack plus position / rack unit",
        "cmd": "(summary ~ \"\\\"RACK_ID\\\"\" OR description ~ \"\\\"RACK_ID\\\"\") AND (summary ~ \"\\\"POSITION\\\"\" OR description ~ \"\\\"POSITION\\\"\") ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Text matching is tokenized: quotes narrow a phrase but do not guarantee exact hostname punctuation or whole-field equality. Check results against serial numbers and aliases. Replace POSITION with your recorded format, such as U24. A match means both phrases occur in a ticket, not necessarily in the same sentence or for the same device.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "rack",
          "position",
          "slot",
          "unit"
        ]
      },
      {
        "id": "jira-site-rack",
        "desc": "Site plus rack to disambiguate reused rack IDs",
        "cmd": "(summary ~ \"\\\"SITE_ID\\\"\" OR description ~ \"\\\"SITE_ID\\\"\") AND (summary ~ \"\\\"RACK_ID\\\"\" OR description ~ \"\\\"RACK_ID\\\"\") ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Use a site identifier if racks have the same names in multiple datacenters.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "site",
          "rack",
          "datacenter"
        ]
      },
      {
        "id": "jira-rack-alias",
        "desc": "Rack naming variations",
        "cmd": "((summary ~ \"\\\"RACK_ID\\\"\" OR description ~ \"\\\"RACK_ID\\\"\") OR (summary ~ \"\\\"OLD_RACK_ID\\\"\" OR description ~ \"\\\"OLD_RACK_ID\\\"\")) ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. List known historical rack names. JQL cannot infer physical location changes from an inventory system.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "rack",
          "aliases",
          "history"
        ]
      },
      {
        "id": "jira-location-open",
        "desc": "Open work at a rack position",
        "cmd": "statusCategory != Done AND (summary ~ \"\\\"RACK_ID\\\"\" OR description ~ \"\\\"RACK_ID\\\"\") AND (summary ~ \"\\\"POSITION\\\"\" OR description ~ \"\\\"POSITION\\\"\") ORDER BY priority DESC, updated DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Active work only. Use the all-time rack-position query above for completed work. Status categories avoid relying on a particular workflow status name.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "rack",
          "position",
          "open"
        ]
      }
    ]
  },
  {
    "id": "jira-queues",
    "badge": "JQL",
    "title": "Daily Work & Handoff",
    "subtitle": "Project-scoped queues: replace PROJECT_KEY with your Jira project key",
    "commands": [
      {
        "id": "jira-node-open",
        "desc": "Active tickets for a node",
        "cmd": "statusCategory != Done AND (summary ~ \"\\\"NODE_NAME\\\"\" OR description ~ \"\\\"NODE_NAME\\\"\") ORDER BY priority DESC, updated DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Includes tickets outside the Done status category.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "node",
          "open"
        ]
      },
      {
        "id": "jira-mine",
        "desc": "My active tickets",
        "cmd": "project = PROJECT_KEY AND assignee = currentUser() AND statusCategory != Done ORDER BY priority DESC, updated DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Uses the signed-in Jira user.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "assigned",
          "mine"
        ]
      },
      {
        "id": "jira-unassigned",
        "desc": "Unassigned active tickets",
        "cmd": "project = PROJECT_KEY AND assignee IS EMPTY AND statusCategory != Done ORDER BY priority DESC, created ASC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Shows oldest work first within each priority.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "unassigned",
          "queue"
        ]
      },
      {
        "id": "jira-stale",
        "desc": "Active tickets with no updates in seven days",
        "cmd": "project = PROJECT_KEY AND statusCategory != Done AND updated <= \"-7d\" ORDER BY updated ASC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Any ticket edit or comment can update the updated timestamp; this is not an SLA timer.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "stale",
          "handoff"
        ]
      },
      {
        "id": "jira-new",
        "desc": "Tickets created in the last 24 hours",
        "cmd": "project = PROJECT_KEY AND created >= \"-24h\" ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Rolling window rather than a calendar day.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "new",
          "shift"
        ]
      },
      {
        "id": "jira-shift",
        "desc": "Tickets updated during the last 12 hours",
        "cmd": "project = PROJECT_KEY AND updated >= \"-12h\" ORDER BY updated DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Useful for shift handoff; includes completed work and all types of updates.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "handoff",
          "shift"
        ]
      },
      {
        "id": "jira-overdue",
        "desc": "Overdue active tickets",
        "cmd": "project = PROJECT_KEY AND statusCategory != Done AND due < startOfDay() ORDER BY due ASC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Only tickets with a populated due date match. Jira timezone affects day boundaries.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "overdue",
          "due"
        ]
      },
      {
        "id": "jira-resolved",
        "desc": "Recently resolved tickets",
        "cmd": "project = PROJECT_KEY AND resolved >= \"-7d\" ORDER BY resolved DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Depends on your workflow setting resolution correctly.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "resolved",
          "history"
        ]
      },
      {
        "id": "jira-transitions",
        "desc": "Tickets with status changes in the last week",
        "cmd": "project = PROJECT_KEY AND status CHANGED AFTER \"-7d\" ORDER BY updated DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Finds status changes, not arbitrary edits to hostname or rack fields.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "status",
          "history",
          "handoff"
        ]
      }
    ]
  },
  {
    "id": "jira-hardware",
    "badge": "JQL",
    "title": "Hardware Faults & RMA Follow-up",
    "subtitle": "Keyword-based candidates; results are not a confirmed diagnosis",
    "commands": [
      {
        "id": "jira-gpu",
        "desc": "GPU / NVLink fault tickets for a node",
        "cmd": "(summary ~ \"\\\"NODE_NAME\\\"\" OR description ~ \"\\\"NODE_NAME\\\"\") AND ((summary ~ \"\\\"Xid\\\"\" OR description ~ \"\\\"Xid\\\"\") OR (summary ~ \"\\\"NVLink\\\"\" OR description ~ \"\\\"NVLink\\\"\") OR (summary ~ \"\\\"ECC\\\"\" OR description ~ \"\\\"ECC\\\"\")) ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Searches Summary and Description for symptom keywords. Add your team’s terminology; a keyword match does not prove component failure.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "hardware",
          "gpu",
          "fault"
        ]
      },
      {
        "id": "jira-network",
        "desc": "Fabric / optics tickets for a rack",
        "cmd": "(summary ~ \"\\\"RACK_ID\\\"\" OR description ~ \"\\\"RACK_ID\\\"\") AND ((summary ~ \"\\\"InfiniBand\\\"\" OR description ~ \"\\\"InfiniBand\\\"\") OR (summary ~ \"\\\"BER\\\"\" OR description ~ \"\\\"BER\\\"\") OR (summary ~ \"\\\"transceiver\\\"\" OR description ~ \"\\\"transceiver\\\"\")) ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Searches Summary and Description for symptom keywords. Add your team’s terminology; a keyword match does not prove component failure.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "hardware",
          "network",
          "fault"
        ]
      },
      {
        "id": "jira-storage",
        "desc": "Storage tickets for a node",
        "cmd": "(summary ~ \"\\\"NODE_NAME\\\"\" OR description ~ \"\\\"NODE_NAME\\\"\") AND ((summary ~ \"\\\"NVMe\\\"\" OR description ~ \"\\\"NVMe\\\"\") OR (summary ~ \"\\\"SMART\\\"\" OR description ~ \"\\\"SMART\\\"\") OR (summary ~ \"\\\"disk\\\"\" OR description ~ \"\\\"disk\\\"\")) ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Searches Summary and Description for symptom keywords. Add your team’s terminology; a keyword match does not prove component failure.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "hardware",
          "storage",
          "fault"
        ]
      },
      {
        "id": "jira-rma",
        "desc": "Active RMA / vendor follow-up candidates",
        "cmd": "project = PROJECT_KEY AND statusCategory != Done AND ((summary ~ \"\\\"RMA\\\"\" OR description ~ \"\\\"RMA\\\"\") OR (summary ~ \"\\\"vendor\\\"\" OR description ~ \"\\\"vendor\\\"\")) ORDER BY updated ASC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Keyword query for follow-up candidates, not a guaranteed waiting-on-vendor workflow state.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "rma",
          "vendor",
          "followup"
        ]
      },
      {
        "id": "jira-linked",
        "desc": "A ticket and its directly linked tickets",
        "cmd": "(key = DC-123 OR issue IN linkedIssues(\"DC-123\")) ORDER BY created ASC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Replace DC-123 with a real issue key. Includes direct links only, not recursive relationships; linked tickets still obey permissions.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "linked",
          "incident",
          "rma"
        ]
      }
    ]
  },
  {
    "id": "jira-fields",
    "badge": "JQL",
    "title": "Optional Structured Fields",
    "subtitle": "Use only if your Jira actually has these fields and matching field types",
    "commands": [
      {
        "id": "jira-custom-text",
        "desc": "Custom text fields: node, rack, and position",
        "cmd": "\"Server Name\" ~ \"\\\"NODE_NAME\\\"\" AND \"Rack\" ~ \"\\\"RACK_ID\\\"\" AND \"Rack Position\" ~ \"\\\"POSITION\\\"\" ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. These field names are examples, not standard Jira fields. Verify names and operators with autocomplete. Text fields use ~. If a name is ambiguous, ask for its cf[12345] ID. Assets fields require their own supported syntax.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "custom",
          "field",
          "node",
          "rack"
        ]
      },
      {
        "id": "jira-custom-select",
        "desc": "Exact rack and position using select-list fields",
        "cmd": "\"Rack\" = \"RACK_ID\" AND \"Rack Position\" = \"POSITION\" ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Only for matching select-list fields/options. For numeric position use a number, e.g. \"Rack Position\" = 24. For text fields use the text template. Current field values do not reconstruct historical physical occupancy.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "custom",
          "select",
          "position"
        ]
      },
      {
        "id": "jira-labels",
        "desc": "Exact asset label",
        "cmd": "labels = \"NODE_LABEL\" ORDER BY created DESC",
        "details": "Paste into Jira advanced search (JQL), replace uppercase example values, then Search. These are templates, not connected searches. Only tickets you can access are returned. Use only if your team labels assets consistently. Labels match exactly; a missing label does not mean no ticket exists.",
        "flags": [],
        "subcommands": [],
        "tip": "Replace example values before searching. Save useful queries as Jira filters.",
        "tags": [
          "jira",
          "jql",
          "labels",
          "asset"
        ]
      }
    ]
  }
];

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("jira_bookmarks") || "[]"))
};

// DOM References
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
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
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied JQL query to clipboard");
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  let copied = false;
  try {
    ta.select();
    copied = typeof document.execCommand === "function" && document.execCommand("copy");
  } catch (_) {
    // Clipboard access can also fail through the legacy API.
  } finally {
    ta.remove();
  }
  showToast(copied ? "Copied JQL query to clipboard" : "Clipboard unavailable. Select the query text to copy it manually.");
}

function highlightCommand(raw) { return escapeHtml(raw); }

function renderCategoryTabs() {
  const totalCommands = JIRA_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of JIRA_DATA) {
    const isSelected = state.activeCategory === section.id ? "selected" : "";
    optionsHtml.push(
      `<option value="${section.id}" ${isSelected}>${escapeHtml(section.title)} (${section.commands.length})</option>`
    );
  }

  const resetBtnHtml =
    state.activeCategory !== "all"
      ? `<button type="button" class="cat-reset-btn" data-cat="all" title="Show all sections">✕ Show All</button>`
      : "";

  categoryTabsEl.innerHTML = `
    <div class="cat-select-wrapper">
      <select id="cat-select" class="cat-select" aria-label="Filter by section">
        ${optionsHtml.join("")}
      </select>
      <span class="cat-select-arrow" aria-hidden="true">▾</span>
    </div>
    ${resetBtnHtml}
  `;

  const sel = document.getElementById("cat-select");
  if (sel) {
    sel.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderSections();
      renderCategoryTabs();
    });
  }

  const resetBtn = categoryTabsEl.querySelector(".cat-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.activeCategory = "all";
      renderSections();
      renderCategoryTabs();
    });
  }
}

function matchesSearch(cmdObj, terms) {
  if (terms.length === 0) return true;
  const haystack = [
    cmdObj.desc || "",
    cmdObj.cmd || "",
    cmdObj.details || "",
    cmdObj.tip || "",
    ...(cmdObj.tags || []),
    ...(cmdObj.flags || []).flat(),
    ...(cmdObj.subcommands || []).flat()
  ].join(" ").toLowerCase();

  return terms.every((t) => haystack.includes(t));
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

  for (const section of JIRA_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    const filteredCommands = section.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) return false;
      return matchesSearch(cmd, searchTerms);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const commandsHtml = filteredCommands.map((cmd) => {
      const isBookmarked = state.bookmarks.has(cmd.id);

      const flagsHtml = (cmd.flags && cmd.flags.length > 0)
        ? `<div class="flag-pills">${cmd.flags.map(([f, d]) =>
            `<span class="flag-pill"><strong class="flag-token">${escapeHtml(f)}</strong> <span class="flag-desc">${escapeHtml(d)}</span></span>`
          ).join("")}</div>`
        : "";

      const subcommandsHtml = (cmd.subcommands && cmd.subcommands.length > 0)
        ? `<div class="subcmd-list">${cmd.subcommands.map(([sc, sd]) =>
            `<div class="subcmd-row" data-subcmd="${escapeHtml(sc)}">
              <span class="subcmd-code">${escapeHtml(sc)}</span>
              <span class="subcmd-desc">${escapeHtml(sd)}</span>
              <button type="button" class="subcmd-copy-btn" title="Copy subcommand" aria-label="Copy subcommand">
                <svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/></svg>
              </button>
            </div>`
          ).join("")}</div>`
        : "";

      const detailsHtml = cmd.details
        ? `<p class="cmd-details">${escapeHtml(cmd.details)}</p>`
        : "";

      const tipHtml = cmd.tip
        ? `<div class="cmd-tip"><span class="tip-badge">TIP</span>${escapeHtml(cmd.tip)}</div>`
        : "";

      return `
        <div class="cmd-item" id="cmd-${escapeHtml(cmd.id)}" data-cmd-id="${escapeHtml(cmd.id)}">
          <div class="cmd-header-row">
            <span class="cmd-desc">${escapeHtml(cmd.desc)}</span>
            <button
              type="button"
              class="bookmark-btn ${isBookmarked ? "bookmarked" : ""}"
              data-cmd-id="${escapeHtml(cmd.id)}"
              title="${isBookmarked ? "Remove bookmark" : "Bookmark this recipe"}"
              aria-label="${isBookmarked ? "Remove bookmark" : "Bookmark this recipe"}"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path fill="${isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          <div class="cmd-code-box" data-cmd="${escapeHtml(cmd.cmd)}">
            <pre class="cmd-code"><code>${highlightCommand(cmd.cmd)}</code></pre>
            <button type="button" class="copy-btn" title="Copy JQL query" aria-label="Copy JQL query">
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>
              </svg>
              <span>Copy</span>
            </button>
          </div>

          ${detailsHtml}
          ${flagsHtml}
          ${subcommandsHtml}
          ${tipHtml}
        </div>
      `;
    }).join("");

    cardsHtml.push(`
      <div class="section-card" id="sec-${escapeHtml(section.id)}">
        <div class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">${escapeHtml(section.badge)}</span>
            <h2 class="section-title">${escapeHtml(section.title)}</h2>
          </div>
          <span class="cmd-count-badge">${filteredCommands.length}</span>
        </div>
        <div class="section-body">
          ${commandsHtml}
        </div>
      </div>
    `);
  }

  sectionsContainer.innerHTML = cardsHtml.join("");
  visibleCountEl.textContent = visibleCommandsCount;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
    sectionsContainer.classList.add("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
    sectionsContainer.classList.remove("hidden");
    packMasonry();
  }
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

  densityToggleBtn.addEventListener("click", () => {
    state.compact = !state.compact;
    document.body.classList.toggle("compact-mode", state.compact);
    densityLabel.textContent = state.compact ? "Normal" : "Compact";
    localStorage.setItem("linux_cs_compact", state.compact ? "1" : "0");
    packMasonry();
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
    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
      const codeBox = copyBtn.closest(".cmd-code-box");
      const cmdText = codeBox ? codeBox.getAttribute("data-cmd") : "";
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const subCopyBtn = e.target.closest(".subcmd-copy-btn");
    if (subCopyBtn) {
      const row = subCopyBtn.closest(".subcmd-row");
      const subcmdText = row ? row.getAttribute("data-subcmd") : "";
      if (subcmdText) copyToClipboard(subcmdText);
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
        localStorage.setItem("jira_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.CheatSheetCommon && typeof window.CheatSheetCommon.applyTheme === "function") {
    window.CheatSheetCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch (e) {}
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(state.theme);
  if (state.compact) {
    document.body.classList.add("compact-mode");
    densityLabel.textContent = "Normal";
  }
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
});
