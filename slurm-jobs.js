// slurm-jobs.js
// Standalone interactive cheat sheet for Slurm: Slurm Jobs: What Runs Where, Why It Waits, How It Ended
const SLURM_SLURM_JOBS_DATA = [
  {
    "id": "slurm-jobs-cmd-1",
    "badge": "jobs",
    "title": "Jobs & accounting: Jobs on one node",
    "subtitle": "Jobs on one node: who, state, run time and node list",
    "commands": [
      {
        "id": "slurm-squeue-node",
        "desc": "Jobs on one node: who, state, run time and node list",
        "cmd": "squeue -w <node> -o \"%.10i %.9u %.8T %.10M %.10l %.6D %R\"",
        "details": "",
        "flags": [
          [
            "%i %u %T",
            "Job ID, user, state (long form)"
          ],
          [
            "%M / %l",
            "Time used / time limit"
          ],
          [
            "%R",
            "Pending: the reason in parentheses. Running: the node list. Failed: why"
          ],
          [
            "-u <user>",
            "One user's jobs"
          ],
          [
            "--start",
            "Expected start times of pending jobs (needs the backfill scheduler)"
          ]
        ],
        "tip": "Empty squeue -w = safe to work on the node",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "squeue",
          "jobs",
          "node",
          "running"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-squeue-node-sub-1",
        "desc": "Your own jobs",
        "cmd": "squeue -u $USER",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "squeue",
          "jobs",
          "node"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-squeue-node-sub-2",
        "desc": "When pending jobs are expected to start",
        "cmd": "squeue --start",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "squeue",
          "jobs",
          "node"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "slurm-jobs-cmd-2",
    "badge": "jobs",
    "title": "Jobs & accounting: Pending jobs and why they wait",
    "subtitle": "Pending jobs and why they wait",
    "commands": [
      {
        "id": "slurm-pending",
        "desc": "Pending jobs and why they wait",
        "cmd": "squeue -t PD -o \"%.10i %.9u %.10l %R\"",
        "details": "",
        "flags": [
          [
            "Resources",
            "What the job asked for is in use by other jobs"
          ],
          [
            "Priority",
            "Higher-priority jobs are ahead in the partition"
          ],
          [
            "ReqNodeNotAvail",
            "A node the job needs is unavailable; DOWN or DRAINED nodes are listed as UnavailableNodes"
          ],
          [
            "Dependency",
            "Waiting on another job"
          ],
          [
            "QOSMaxGRESPerUser",
            "The user hit the QOS limit on GPUs (or other GRES)"
          ]
        ],
        "tip": "ReqNodeNotAvail often means your drained node",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "squeue",
          "pending",
          "reason",
          "priority",
          "resources"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_reason_codes.html",
              "title": "Slurm: job reason codes"
            },
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-pending-sub-1",
        "desc": "Pending jobs held up by this node (it appears in their ReqNodeNotAvail reason)",
        "cmd": "squeue -t PD -o \"%.10i %.9u %R\" | grep <node>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "squeue",
          "pending",
          "reason"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_reason_codes.html",
              "title": "Slurm: job reason codes"
            },
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-pending-sub-2",
        "desc": "Full job record: reason, requested TRES and GRES, node list, times",
        "cmd": "scontrol show job <jobid>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "squeue",
          "pending",
          "reason"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/squeue.html",
              "title": "squeue (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_reason_codes.html",
              "title": "Slurm: job reason codes"
            },
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "scontrol (Slurm 26.05)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "slurm-jobs-cmd-3",
    "badge": "jobs",
    "title": "Jobs & accounting: How a job ended",
    "subtitle": "How a job ended: state, exit code, nodes and times",
    "commands": [
      {
        "id": "slurm-sacct-job",
        "desc": "How a job ended: state, exit code, nodes and times",
        "cmd": "sacct -j <jobid> --format=JobID,JobName,State,ExitCode,NodeList,Elapsed,Start,End",
        "details": "",
        "flags": [
          [
            "COMPLETED / FAILED",
            "Exit code zero on all nodes / non-zero exit or other failure"
          ],
          [
            "TIMEOUT / NODE_FAIL",
            "Hit its time limit / ended because a node failed"
          ],
          [
            "OUT_OF_MEMORY",
            "The job hit an out-of-memory error"
          ],
          [
            "ExitCode a:b",
            "Exit code, and the signal that ended it"
          ],
          [
            "-X",
            "The allocation only, not each step"
          ]
        ],
        "tip": "NODE_FAIL jobs point at the hardware",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "sacct",
          "accounting",
          "exit-code",
          "node_fail",
          "history"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sacct.html",
              "title": "sacct (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_state_codes.html",
              "title": "Slurm: job state codes"
            }
          ],
          "note": "sacct reads job accounting (AccountingStorageType); -a shows other users' jobs only for root or when PrivateData allows."
        }
      },
      {
        "id": "slurm-sacct-job-sub-1",
        "desc": "Every job that ran on a node in the last day: line it up with dmesg and the SEL",
        "cmd": "sacct -N <node> -S now-1days -X -a --format=JobID,User,State,ExitCode,Start,End",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "sacct",
          "accounting",
          "exit-code"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sacct.html",
              "title": "sacct (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_state_codes.html",
              "title": "Slurm: job state codes"
            }
          ],
          "note": "sacct reads job accounting (AccountingStorageType); -a shows other users' jobs only for root or when PrivateData allows."
        }
      },
      {
        "id": "slurm-sacct-job-sub-2",
        "desc": "Just the allocation's outcome",
        "cmd": "sacct -j <jobid> -X --format=JobID,State,ExitCode,NodeList",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "sacct",
          "accounting",
          "exit-code"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sacct.html",
              "title": "sacct (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_state_codes.html",
              "title": "Slurm: job state codes"
            }
          ],
          "note": "sacct reads job accounting (AccountingStorageType); -a shows other users' jobs only for root or when PrivateData allows."
        }
      }
    ]
  },
  {
    "id": "slurm-jobs-cmd-4",
    "badge": "jobs",
    "title": "Jobs & accounting: Cancel a job",
    "subtitle": "Cancel a job (changes state: ask the owner first)",
    "commands": [
      {
        "id": "slurm-scancel",
        "desc": "Cancel a job (changes state: ask the owner first)",
        "cmd": "scancel <jobid>",
        "details": "",
        "flags": [
          [
            "<jobid>",
            "The job and all of its steps"
          ],
          [
            "-u <user>",
            "Only that user's jobs"
          ],
          [
            "-w <nodes>",
            "Every job using those nodes: combine with -u to narrow it"
          ]
        ],
        "tip": "Drain and wait beats scancel",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "scancel",
          "cancel",
          "jobs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scancel.html",
              "title": "scancel (Slurm 26.05)"
            }
          ]
        }
      },
      {
        "id": "slurm-scancel-sub-1",
        "desc": "That user's jobs on that node only (changes state)",
        "cmd": "scancel -u <user> -w <node>",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "recipe",
          "scancel",
          "cancel",
          "jobs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scancel.html",
              "title": "scancel (Slurm 26.05)"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "slurm-jobs-pro-tips",
    "badge": "tip",
    "title": "Jobs & accounting: Pro Tip",
    "subtitle": "Was it the job or the node?",
    "commands": [
      {
        "id": "slurm-jobs-tips-card",
        "desc": "Was it the job or the node?",
        "cmd": "sacct -N <node> -S now-1days -X -a --format=JobID,User,State,ExitCode,Start,End",
        "details": "List what ran on the node around the failure. NODE_FAIL on several users' jobs points at the node; one job FAILED or OUT_OF_MEMORY while others on the node COMPLETED points at the job. Line the times up with dmesg -T and the BMC SEL.",
        "flags": [
          [
            "NODE_FAIL",
            "Hardware or the node, usually"
          ],
          [
            "Several users failing",
            "The node, not the code"
          ]
        ],
        "tip": "Many users failing on one node = the node",
        "tags": [
          "slurm",
          "hpc",
          "scheduler",
          "slurm-jobs",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/sacct.html",
              "title": "sacct (Slurm 26.05)"
            },
            {
              "url": "https://slurm.schedmd.com/job_state_codes.html",
              "title": "Slurm: job state codes"
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("slurm-jobs_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = SLURM_SLURM_JOBS_DATA;
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

  for (const card of SLURM_SLURM_JOBS_DATA) {
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
        localStorage.setItem("slurm-jobs_bookmarks", JSON.stringify([...state.bookmarks]));
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
