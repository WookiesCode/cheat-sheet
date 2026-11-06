const JIRA_CHEAT_SHEET_DATA = [
  {
    id: "jira-hardware",
    badge: "hw",
    title: "Tickets by Server, Rack & Position",
    subtitle: "Full history for a node, rack, position, site, serial number, or BMC",
    commands: [
      {
        id: "jira-node-history",
        desc: "Every ticket that mentions a server or node, open or closed",
        cmd: "text ~ \"\\\"$NODE\\\"\" ORDER BY created DESC",
        flags: [
          ["text ~", "Searches summary, description, comments, environment, and text custom fields"],
          ["\\\"...\\\"", "Inner quotes search for the exact phrase, which keeps hyphenated names together"],
          ["ORDER BY created DESC", "Newest tickets first"]
        ],
        subcommands: [
          ["text ~ \"\\\"$NODE\\\"\" AND statusCategory != Done ORDER BY updated DESC", "Open tickets only"],
          ["text ~ \"\\\"$NODE\\\"\" AND statusCategory = Done ORDER BY resolved DESC", "Closed tickets only"],
          ["text ~ \"\\\"$NODE\\\"\" AND created >= -90d ORDER BY created DESC", "Last 90 days"],
          ["project = \"$PROJECT\" AND text ~ \"\\\"$NODE\\\"\" ORDER BY created DESC", "Limit to one project"],
          ["summary ~ \"\\\"$NODE\\\"\" ORDER BY created DESC", "Only tickets with the node in the title"],
          ["text ~ \"\\\"node-01\\\"\" OR text ~ \"\\\"node-02\\\"\" ORDER BY created DESC", "Several nodes at once"],
          ["summary ~ \"gpu-node*\" ORDER BY created DESC", "Names starting with a prefix. Wildcards can't go at the start."]
        ],
        tip: "Start here. text ~ finds the node even if it's only mentioned in a comment.",
        tags: ["node", "server", "host", "hostname", "history", "all tickets", "text"]
      },
      {
        id: "jira-rack-history",
        desc: "Every ticket for a rack, including all the nodes in it if the rack is mentioned",
        cmd: "text ~ \"\\\"$RACK\\\"\" ORDER BY created DESC",
        flags: [
          ["$RACK", "Use the name as it's written in your tickets, such as R12 or Rack 12"]
        ],
        subcommands: [
          ["text ~ \"\\\"$RACK\\\"\" AND statusCategory != Done ORDER BY priority DESC", "Open tickets for the rack, most urgent first"],
          ["text ~ \"\\\"$RACK\\\"\" AND created >= -30d ORDER BY created DESC", "Last 30 days"],
          ["text ~ \"\\\"$RACK\\\"\" AND text ~ \"PDU\" ORDER BY created DESC", "Rack power tickets"],
          ["text ~ \"\\\"$RACK\\\"\" AND (text ~ \"switch\" OR text ~ \"ToR\") ORDER BY created DESC", "Rack switch tickets"]
        ],
        tip: "Tickets that name only the node won't match. Search the nodes too for a full picture.",
        tags: ["rack", "cabinet", "history", "pdu", "tor"]
      },
      {
        id: "jira-position-history",
        desc: "Every ticket for one rack position, such as a U number or slot",
        cmd: "text ~ \"\\\"$RACK\\\"\" AND text ~ \"\\\"$POSITION\\\"\" ORDER BY created DESC",
        flags: [
          ["$POSITION", "Use the form your tickets use, such as U23"],
          ["AND", "Both must appear, but not necessarily next to each other"]
        ],
        subcommands: [
          ["text ~ \"\\\"$RACK $POSITION\\\"\" ORDER BY created DESC", "Written together: R12 U23"],
          ["text ~ \"\\\"$RACK-$POSITION\\\"\" ORDER BY created DESC", "Written with a hyphen: R12-U23"],
          ["text ~ \"\\\"$RACK/$POSITION\\\"\" ORDER BY created DESC", "Written with a slash: R12/U23"]
        ],
        tip: "The same position can hold different servers over time, so this also shows work on earlier hardware.",
        tags: ["position", "rack unit", "ru", "u", "slot", "location", "elevation"]
      },
      {
        id: "jira-site-history",
        desc: "Open tickets for a site, data hall, or row",
        cmd: "text ~ \"\\\"$SITE\\\"\" AND statusCategory != Done ORDER BY priority DESC, created ASC",
        flags: [
          ["$SITE", "Site, data hall, or row name"],
          ["priority DESC, created ASC", "Most urgent first, then oldest first"]
        ],
        subcommands: [
          ["text ~ \"\\\"$SITE\\\"\" AND created >= startOfDay() ORDER BY created DESC", "Opened at this site today"],
          ["text ~ \"\\\"$SITE\\\"\" AND assignee is EMPTY AND statusCategory != Done", "Unassigned work at this site"]
        ],
        tags: ["site", "data hall", "datacenter", "row", "location"]
      },
      {
        id: "jira-serial-bmc",
        desc: "Find tickets by serial number or BMC address, which also follow hardware that moved",
        cmd: "text ~ \"\\\"$SERIAL\\\"\" ORDER BY created DESC",
        flags: [
          ["$SERIAL", "Chassis, GPU, drive, or part serial number"],
          ["$BMC", "Filled from BMC IP/Host in the Rack Targets bar when you copy"]
        ],
        subcommands: [
          ["text ~ \"\\\"$BMC\\\"\" ORDER BY created DESC", "Tickets that mention the BMC address"],
          ["text ~ \"\\\"$NODE\\\"\" OR text ~ \"\\\"$SERIAL\\\"\" ORDER BY created DESC", "By name or serial, which helps after a rename or a move"]
        ],
        tip: "Serials stay with the hardware when a server is renamed or moved.",
        tags: ["serial", "sn", "asset", "bmc", "ip", "rma"]
      },
      {
        id: "jira-custom-fields",
        desc: "Templates for dedicated fields, if your Jira has them. More precise than text search.",
        cmd: "\"Rack\" ~ \"$RACK\" ORDER BY created DESC",
        flags: [
          ["\"Field Name\" ~", "For text fields. Replace the name with your field's name."],
          ["\"Field Name\" =", "For dropdown fields, which need an exact value"],
          ["cf[10050]", "Field by ID, useful when two fields share a name"]
        ],
        subcommands: [
          ["\"Hostname\" ~ \"$NODE\" ORDER BY created DESC", "Node field"],
          ["\"Rack\" ~ \"$RACK\" AND \"Rack Position\" ~ \"$POSITION\" ORDER BY created DESC", "Rack and position fields"],
          ["\"Serial Number\" ~ \"$SERIAL\" ORDER BY created DESC", "Serial number field"],
          ["cf[10050] ~ \"$NODE\" ORDER BY created DESC", "Same search using a field ID (replace 10050 with yours)"]
        ],
        tip: "In Jira's Advanced search, start typing a field name and it will suggest the real names.",
        tags: ["custom field", "cf", "hostname", "rack", "position", "serial", "field"]
      }
    ]
  },
  {
    id: "jira-failures",
    badge: "rma",
    title: "Failures, Repeats & RMAs",
    subtitle: "Find repeat problems, reopened work, and hardware returns",
    commands: [
      {
        id: "jira-fault-type",
        desc: "Past tickets on a node for one kind of fault",
        cmd: "text ~ \"\\\"$NODE\\\"\" AND (text ~ \"Xid\" OR text ~ \"NVLink\" OR text ~ \"ECC\" OR text ~ \"GPU\") ORDER BY created DESC",
        subcommands: [
          ["text ~ \"\\\"$NODE\\\"\" AND (text ~ \"NVMe\" OR text ~ \"SMART\" OR text ~ \"drive\" OR text ~ \"disk\") ORDER BY created DESC", "Storage faults"],
          ["text ~ \"\\\"$NODE\\\"\" AND (text ~ \"InfiniBand\" OR text ~ \"transceiver\" OR text ~ \"optic\" OR text ~ \"link\") ORDER BY created DESC", "Network and optics faults"],
          ["text ~ \"\\\"$NODE\\\"\" AND (text ~ \"PSU\" OR text ~ \"power\" OR text ~ \"thermal\" OR text ~ \"fan\") ORDER BY created DESC", "Power and cooling faults"],
          ["text ~ \"\\\"$NODE\\\"\" AND (text ~ \"DIMM\" OR text ~ \"memory\" OR text ~ \"BMC\" OR text ~ \"BIOS\") ORDER BY created DESC", "Memory and firmware faults"]
        ],
        tip: "Check this before an RMA. A repeat fault after a part swap can point at the slot or riser, not the part.",
        tags: ["gpu", "xid", "nvlink", "ecc", "nvme", "optics", "psu", "dimm", "fault"]
      },
      {
        id: "jira-rma",
        desc: "Hardware returns for a node, and RMAs that are still open",
        cmd: "text ~ \"\\\"$NODE\\\"\" AND text ~ \"RMA\" ORDER BY created DESC",
        subcommands: [
          ["project = \"$PROJECT\" AND text ~ \"RMA\" AND statusCategory != Done ORDER BY created ASC", "All open RMAs, oldest first"],
          ["project = \"$PROJECT\" AND text ~ \"RMA\" AND statusCategory != Done AND updated <= -7d", "RMAs with no update for 7 days"],
          ["project = \"$PROJECT\" AND text ~ \"RMA\" AND resolved >= -30d ORDER BY resolved DESC", "RMAs closed in the last 30 days"]
        ],
        tags: ["rma", "return", "replacement", "warranty", "parts"]
      },
      {
        id: "jira-reopened",
        desc: "Tickets that were closed and came back, a sign the first fix didn't hold",
        cmd: "project = \"$PROJECT\" AND status WAS IN (\"Done\", \"Closed\", \"Resolved\") AND statusCategory != Done ORDER BY updated DESC",
        flags: [
          ["status WAS IN (...)", "Matches past statuses. Use your workflow's status names."]
        ],
        subcommands: [
          ["text ~ \"\\\"$NODE\\\"\" AND status WAS IN (\"Done\", \"Closed\", \"Resolved\") AND statusCategory != Done", "Reopened tickets for one node"]
        ],
        tags: ["reopened", "repeat", "regression", "was"]
      },
      {
        id: "jira-related",
        desc: "Everything connected to one ticket",
        cmd: "issue in linkedIssues(\"$TICKET\") ORDER BY created DESC",
        flags: [
          ["linkedIssues()", "Tickets linked to the one you name"],
          ["parent", "Sub-tasks, or child work under an epic"]
        ],
        subcommands: [
          ["parent = \"$TICKET\" ORDER BY created ASC", "Sub-tasks and child tickets"],
          ["issue in linkedIssues(\"$TICKET\", \"blocks\")", "Only one kind of link"]
        ],
        tags: ["linked", "related", "parent", "subtask", "epic"]
      }
    ]
  },
  {
    id: "jira-queue",
    badge: "me",
    title: "My Work",
    subtitle: "Your tickets, watched tickets, and recent activity",
    commands: [
      {
        id: "jira-my-open",
        desc: "Your open tickets, most urgent first",
        cmd: "assignee = currentUser() AND statusCategory != Done ORDER BY priority DESC, updated ASC",
        subcommands: [
          ["assignee = currentUser() AND due <= 7d AND statusCategory != Done ORDER BY due ASC", "Due in the next 7 days"],
          ["reporter = currentUser() AND statusCategory != Done ORDER BY updated DESC", "Tickets you opened that are still open"],
          ["watcher = currentUser() AND statusCategory != Done ORDER BY updated DESC", "Tickets you're watching"]
        ],
        tip: "currentUser() works for anyone, so you can share these queries.",
        tags: ["my tickets", "assignee", "currentuser", "queue", "watching"]
      },
      {
        id: "jira-my-history",
        desc: "Find a ticket you worked on or looked at recently",
        cmd: "issuekey in issueHistory() ORDER BY lastViewed DESC",
        flags: [
          ["issueHistory()", "Tickets you've recently viewed"]
        ],
        subcommands: [
          ["issue in updatedBy(currentUser(), \"-7d\") ORDER BY updated DESC", "Tickets you changed in the last 7 days"],
          ["assignee WAS currentUser() AND updated >= -30d ORDER BY updated DESC", "Tickets that were assigned to you"],
          ["assignee CHANGED FROM currentUser() AFTER -7d", "Tickets you handed off in the last 7 days"]
        ],
        tags: ["recent", "viewed", "history", "updatedby", "handoff"]
      }
    ]
  },
  {
    id: "jira-team",
    badge: "team",
    title: "Team Queue & Health",
    subtitle: "Unassigned, stale, urgent, overdue, and SLA risk",
    commands: [
      {
        id: "jira-unassigned",
        desc: "Open tickets nobody has picked up",
        cmd: "project = \"$PROJECT\" AND assignee is EMPTY AND statusCategory != Done ORDER BY priority DESC, created ASC",
        tags: ["unassigned", "triage", "queue", "empty"]
      },
      {
        id: "jira-stale",
        desc: "Open tickets with no update for a week",
        cmd: "project = \"$PROJECT\" AND statusCategory != Done AND updated <= -7d ORDER BY updated ASC",
        subcommands: [
          ["project = \"$PROJECT\" AND statusCategory = \"In Progress\" AND updated <= -3d ORDER BY updated ASC", "In progress but quiet for 3 days"],
          ["project = \"$PROJECT\" AND statusCategory != Done AND created <= -30d ORDER BY created ASC", "Open for more than 30 days"]
        ],
        tags: ["stale", "aging", "stuck", "old"]
      },
      {
        id: "jira-urgent",
        desc: "High-priority and overdue tickets",
        cmd: "project = \"$PROJECT\" AND priority in (Highest, High) AND statusCategory != Done ORDER BY priority DESC, created ASC",
        flags: [
          ["priority in (...)", "Use the priority names your Jira has"]
        ],
        subcommands: [
          ["project = \"$PROJECT\" AND due < now() AND statusCategory != Done ORDER BY due ASC", "Past their due date"],
          ["project = \"$PROJECT\" AND priority in (Highest, High) AND assignee is EMPTY AND statusCategory != Done", "Urgent and unassigned"]
        ],
        tags: ["priority", "urgent", "overdue", "due", "p1"]
      },
      {
        id: "jira-sla",
        desc: "SLA risk. These only work in Jira Service Management projects.",
        cmd: "project = \"$PROJECT\" AND \"Time to resolution\" = breached() AND statusCategory != Done ORDER BY created ASC",
        flags: [
          ["\"Time to resolution\"", "Use the SLA names set up in your project"],
          ["breached()", "The SLA has been missed"]
        ],
        subcommands: [
          ["project = \"$PROJECT\" AND \"Time to resolution\" < remaining(\"2h\") AND statusCategory != Done", "Under 2 hours left on the SLA"],
          ["project = \"$PROJECT\" AND \"Time to first response\" = breached() AND resolved >= -30d", "Missed first response in the last 30 days"]
        ],
        tags: ["sla", "breached", "remaining", "service management", "jsm"]
      }
    ]
  },
  {
    id: "jira-handoff",
    badge: "shift",
    title: "Shift Handoff & Reporting",
    subtitle: "What happened today, this shift, and this week",
    commands: [
      {
        id: "jira-shift",
        desc: "Everything that changed in the last 12 hours",
        cmd: "project = \"$PROJECT\" AND updated >= -12h ORDER BY updated DESC",
        subcommands: [
          ["project = \"$PROJECT\" AND created >= -12h ORDER BY priority DESC", "Opened in the last 12 hours"],
          ["project = \"$PROJECT\" AND resolved >= -12h ORDER BY resolved DESC", "Closed in the last 12 hours"],
          ["project = \"$PROJECT\" AND status CHANGED AFTER -12h ORDER BY updated DESC", "Status changed in the last 12 hours"],
          ["project = \"$PROJECT\" AND statusCategory = \"In Progress\" ORDER BY assignee, updated DESC", "In progress, grouped by person"]
        ],
        tip: "Change -12h to match your shift length.",
        tags: ["shift", "handoff", "turnover", "today", "12h"]
      },
      {
        id: "jira-weekly",
        desc: "Daily, weekly, and monthly counts",
        cmd: "project = \"$PROJECT\" AND created >= startOfDay() ORDER BY created DESC",
        subcommands: [
          ["project = \"$PROJECT\" AND resolved >= startOfDay() ORDER BY resolved DESC", "Closed today"],
          ["project = \"$PROJECT\" AND created >= startOfWeek() ORDER BY created DESC", "Opened this week"],
          ["project = \"$PROJECT\" AND resolved >= startOfWeek() ORDER BY resolved DESC", "Closed this week"],
          ["project = \"$PROJECT\" AND created >= startOfMonth(-1) AND created < startOfMonth() ORDER BY created ASC", "Opened last month"]
        ],
        tags: ["report", "weekly", "monthly", "metrics", "startofweek"]
      }
    ]
  },
  {
    id: "jira-reference",
    badge: "jql",
    title: "JQL Quick Reference",
    subtitle: "Operators, dates, functions, and text search rules",
    commands: [
      {
        id: "jira-operators",
        desc: "The operators you'll use most",
        cmd: "field operator value AND field operator value ORDER BY field DESC",
        flags: [
          ["= / !=", "Exactly equal / not equal"],
          ["~ / !~", "Contains text / doesn't contain text"],
          ["in / not in", "Any of a list: status in (Open, Blocked)"],
          ["is EMPTY / is not EMPTY", "Field has no value / has a value"],
          [">= / <=", "Dates, numbers, and priorities"],
          ["WAS / CHANGED", "Past values and changes, for status, assignee, and similar fields"],
          ["AND / OR / NOT", "Combine conditions. Use parentheses when mixing AND with OR."]
        ],
        tags: ["operators", "syntax", "was", "changed", "empty"]
      },
      {
        id: "jira-dates",
        desc: "Dates and common functions",
        cmd: "created >= -7d AND created < startOfDay()",
        flags: [
          ["-7d / -12h / -2w", "Relative time: days, hours, weeks"],
          ["startOfDay() / startOfWeek() / startOfMonth()", "Start of the period. Add an offset like startOfDay(-1)."],
          ["now()", "The current time"],
          ["currentUser()", "Whoever runs the query"],
          ["membersOf(\"group\")", "Everyone in a group"],
          ["statusCategory", "To Do, In Progress, or Done, whatever your status names are"]
        ],
        tags: ["dates", "functions", "startofday", "now", "membersof", "statuscategory"]
      },
      {
        id: "jira-text-rules",
        desc: "How text search behaves, which explains most surprising results",
        cmd: "text ~ \"\\\"exact phrase\\\"\" AND text ~ \"prefix*\"",
        flags: [
          ["\\\"phrase\\\"", "Exact words in order. Punctuation is mostly ignored, so node-01 can also match node 01."],
          ["word*", "Prefix match. *word doesn't work."],
          ["No quotes inside", "Without inner quotes, the words can appear anywhere and in any order"],
          ["~ isn't exact", "It matches whole words, so gpu won't match gpu01. Use gpu* for that."],
          ["= on text", "Text fields don't support =, so use ~"]
        ],
        tip: "If a search misses a ticket you know exists, try a prefix search or fewer words.",
        tags: ["text", "search", "wildcard", "phrase", "quotes", "syntax"]
      },
      {
        id: "jira-use-it",
        desc: "Running a query and keeping it",
        cmd: "Filters > View all issues > Switch to JQL > paste > Enter",
        flags: [
          ["Save as", "Saves the query as a filter you can reopen or share"],
          ["Subscribe", "Emails you the results on a schedule, useful for stale tickets or RMAs"],
          ["Export", "Download the results as a CSV"]
        ],
        tip: "Menu names vary by Jira version.",
        tags: ["filter", "save", "subscribe", "export", "advanced search"]
      }
    ]
  }
];

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("jira_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
const sectionsContainer = document.getElementById("sections-container");
const categoryTabsEl = document.getElementById("category-tabs");
const searchInput = document.getElementById("search-input");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const themeToggleBtn = document.getElementById("theme-toggle");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toast-text");
const printBtn = document.getElementById("print-btn");

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
  if (!toast) return;
  toastText.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied snippet to clipboard");
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
  showToast("Copied snippet to clipboard");
}

// Shell & language syntax highlighter
function highlightCommand(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return `<span class="tok-str">${strLiteral}</span>`;
      if (flagPart) return `<span class="tok-flag">${flagPart}</span>`;
      if (operatorPart) return `<span class="tok-pipe">${operatorPart}</span>`;
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? `<span class="tok-pipe">${sudoPart}</span>` : "";
        return `${prefix}${sudoHtml}<span class="tok-cmd">${cmdName}</span>`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = JIRA_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of JIRA_CHEAT_SHEET_DATA) {
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
    <div class="cat-dropdown-wrap">
      <label class="cat-dropdown-label" for="category-select">Section:</label>
      <select id="category-select" class="cat-select" aria-label="Filter by ${escapeHtml('Jira')} section">
        ${optionsHtml.join("")}
      </select>
      ${resetBtnHtml}
    </div>
  `;

  const sel = document.getElementById("category-select");
  if (sel) {
    sel.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderSections();
    });
  }

  const resetBtn = categoryTabsEl.querySelector(".cat-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmdObj, section, query) {
  if (!query) return true;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    cmdObj.desc,
    cmdObj.cmd,
    cmdObj.details || "",
    cmdObj.tip || "",
    section.title,
    section.subtitle,
    ...(cmdObj.tags || []),
    ...(cmdObj.flags || []).flat(),
    ...(cmdObj.subcommands || []).flat()
  ]
    .join(" ")
    .toLowerCase();

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

let masonryResizeTimer;
function scheduleMasonry() {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
}
window.addEventListener("resize", scheduleMasonry);
document.addEventListener("fullscreenchange", scheduleMasonry);

if (typeof ResizeObserver !== "undefined" && sectionsContainer) {
  let lastObservedWidth = 0;
  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.round(entry.contentRect.width);
      if (w > 0 && Math.abs(w - lastObservedWidth) > 10) {
        lastObservedWidth = w;
        scheduleMasonry();
      }
    }
  });
  ro.observe(sectionsContainer);
}

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of JIRA_CHEAT_SHEET_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const filteredCommands = section.commands.filter((cmdObj) => {
      if (state.savedOnly && !state.bookmarks.has(cmdObj.id)) {
        return false;
      }
      return matchesSearch(cmdObj, section, state.searchQuery);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const itemsHtml = filteredCommands
      .map((item) => {
        const isSaved = state.bookmarks.has(item.id);
        const tipHtml = item.tip ? `<span class="tip-badge">${escapeHtml(item.tip)}</span>` : "";
        const detailsHtml = item.details ? `<p class="cmd-details">${escapeHtml(item.details)}</p>` : "";

        const flagsHtml =
          item.flags && item.flags.length
            ? `<div class="flag-pills">
                ${item.flags
                  .map(
                    ([flag, exp]) =>
                      `<span class="flag-pill"><code>${escapeHtml(flag)}</code> <span>${escapeHtml(exp)}</span></span>`
                  )
                  .join("")}
              </div>`
            : "";

        const subcommandsHtml =
          item.subcommands && item.subcommands.length
            ? `<div class="subcmd-list">
                <span class="subcmd-header">Subcommands, Variations &amp; Snippets</span>
                ${item.subcommands
                  .map(
                    ([subcmd, exp]) =>
                      `<div class="subcmd-row" data-copy="${escapeHtml(subcmd)}" title="Click to copy snippet">
                        <code>${escapeHtml(subcmd)}</code>
                        <span>${escapeHtml(exp)}</span>
                      </div>`
                  )
                  .join("")}
              </div>`
            : "";

        return `
          <div class="cmd-item" id="${item.id}" data-id="${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                <span>${escapeHtml(item.desc)}</span>
                ${tipHtml}
              </div>
              <div class="cmd-actions">
                <button
                  type="button"
                  class="icon-btn bookmark-btn ${isSaved ? "bookmarked" : ""}"
                  data-bookmark-id="${item.id}"
                  title="${isSaved ? "Remove bookmark" : "Bookmark snippet"}"
                  aria-label="Bookmark snippet"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(item.cmd)}" title="Click to copy snippet">
              <code class="cmd-code">${highlightCommand(item.cmd)}</code>
              <span class="copy-hint">Copy</span>
            </div>

            ${detailsHtml}
            ${flagsHtml}
            ${subcommandsHtml}
          </div>
        `;
      })
      .join("");

    cardsHtml.push(`
      <article class="section-card" id="sec-${section.id}">
        <header class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">${escapeHtml(section.badge)}</span>
            <div>
              <h2 class="section-title">${escapeHtml(section.title)}</h2>
              <p class="section-subtitle">${escapeHtml(section.subtitle)}</p>
            </div>
          </div>
          <span class="count-badge">${filteredCommands.length}</span>
        </header>
        <div class="command-list">
          ${itemsHtml}
        </div>
      </article>
    `);
  }

  sectionsContainer.innerHTML = cardsHtml.join("");
  packMasonry();
  visibleCountEl.textContent = visibleCommandsCount;
  savedCountEl.textContent = state.bookmarks.size;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
    sectionsContainer.classList.add("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
    sectionsContainer.classList.remove("hidden");
  }
}

function applyTheme(theme) {
  state.theme = theme;
  if (window.AntigravityCommon && window.AntigravityCommon.applyTheme) {
    window.AntigravityCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch(e) {}
  }
}

function initEvents() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    renderSections();
  });

  sectionsContainer.addEventListener("click", (e) => {
    const copyBox = e.target.closest(".cmd-code-box, .subcmd-row");
    if (copyBox) {
      copyToClipboard(copyBox.dataset.copy);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const id = bookmarkBtn.dataset.bookmarkId;
      if (state.bookmarks.has(id)) {
        state.bookmarks.delete(id);
        bookmarkBtn.classList.remove("bookmarked");
        bookmarkBtn.textContent = "☆";
        bookmarkBtn.title = "Bookmark snippet";
        showToast("Removed from saved bookmarks");
      } else {
        state.bookmarks.add(id);
        bookmarkBtn.classList.add("bookmarked");
        bookmarkBtn.textContent = "★";
        bookmarkBtn.title = "Remove bookmark";
        showToast("Added to saved bookmarks");
      }
      localStorage.setItem("jira_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      savedCountEl.textContent = state.bookmarks.size;
      if (state.savedOnly) {
        renderSections();
      }
    }
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
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.activeCategory = "all";
    state.savedOnly = false;
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape") {
      if (document.activeElement === searchInput || state.searchQuery) {
        searchInput.value = "";
        state.searchQuery = "";
        searchInput.blur();
        renderSections();
      }
    }
  });
}

// Query fill-in form: entered values replace placeholders in every query.
const JIRA_FIELDS = { project: "$PROJECT", site: "$SITE", node: "$NODE", rack: "$RACK", position: "$POSITION", serial: "$SERIAL", ticket: "$TICKET" };
const JIRA_TEMPLATES = JSON.parse(JSON.stringify(JIRA_CHEAT_SHEET_DATA));

const jiraValues = (() => {
  try { return JSON.parse(localStorage.getItem("jira_cs_targets") || "{}") || {}; } catch (e) { return {}; }
})();

// Quotes and backslashes would end the JQL string early.
function jiraValue(key) {
  return String(jiraValues[key] || "").replace(/["\\]/g, "").trim();
}

function fillQuery(query) {
  let result = query;
  for (const [key, token] of Object.entries(JIRA_FIELDS)) {
    const value = jiraValue(key);
    if (value) result = result.split(token).join(value);
  }
  return result;
}

function applyJiraValues() {
  JIRA_CHEAT_SHEET_DATA.forEach((section, s) => {
    section.commands.forEach((command, c) => {
      const template = JIRA_TEMPLATES[s].commands[c];
      command.cmd = fillQuery(template.cmd);
      if (template.subcommands) {
        command.subcommands = template.subcommands.map(([query, note]) => [fillQuery(query), note]);
      }
    });
  });
  renderSections();
  // In the offline copy this form runs in a frame, away from the queries on screen.
  if (window.parent !== window) {
    const fill = Object.fromEntries(Object.entries(JIRA_FIELDS).map(([key, token]) => [token, jiraValue(key)]));
    window.parent.postMessage({ portableQueryFill: fill }, "*");
  }
}

function initJiraForm() {
  for (const key of Object.keys(JIRA_FIELDS)) {
    const input = document.getElementById(`jira-${key}`);
    if (!input) continue;
    input.value = jiraValues[key] || "";
    input.addEventListener("input", () => {
      jiraValues[key] = input.value;
      try { localStorage.setItem("jira_cs_targets", JSON.stringify(jiraValues)); } catch (e) {}
      applyJiraValues();
    });
  }
  const clear = document.getElementById("jira-clear-btn");
  if (clear) {
    clear.addEventListener("click", () => {
      for (const key of Object.keys(JIRA_FIELDS)) {
        delete jiraValues[key];
        const input = document.getElementById(`jira-${key}`);
        if (input) input.value = "";
      }
      try { localStorage.removeItem("jira_cs_targets"); } catch (e) {}
      applyJiraValues();
    });
  }
}

// Initialize
applyTheme(state.theme);
renderCategoryTabs();
initEvents();
initJiraForm();
applyJiraValues();
