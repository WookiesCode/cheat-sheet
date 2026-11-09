// docker-compose.js
// Standalone interactive cheat sheet for Containers: Docker Compose: multi-container stacks
const CTR_DOCKER_COMPOSE_DATA = [
  {
    "id": "docker-compose-cmd-1",
    "badge": "compose",
    "title": "Docker Compose: Start",
    "subtitle": "Start (or update) every service in compose.yaml in the background (changes state)",
    "commands": [
      {
        "id": "compose-up",
        "desc": "Start (or update) every service in compose.yaml in the background (changes state)",
        "cmd": "docker compose up -d",
        "details": "",
        "flags": [
          [
            "docker compose (with a space)",
            "The current Compose plugin. The old Python docker-compose (v1) is end-of-life; don't install it"
          ],
          [
            "up -d",
            "Create networks and volumes, then start containers detached. Re-running applies changes to compose.yaml"
          ],
          [
            "-f <file>",
            "Use a different file; default is compose.yaml (or docker-compose.yml) in the current directory"
          ],
          [
            "--build",
            "Rebuild images that have a build: section before starting"
          ],
          [
            "-p <project>",
            "Project name, used as a prefix for containers, networks and volumes (default: the directory name)"
          ]
        ],
        "tip": "Run docker compose config before up",
        "tags": [
          "docker",
          "containers",
          "compose",
          "up",
          "stack",
          "services"
        ]
      },
      {
        "id": "compose-up-sub-1",
        "desc": "Print the final merged config with variables filled in; a quick syntax check",
        "cmd": "docker compose config",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "up",
          "stack"
        ]
      },
      {
        "id": "compose-up-sub-2",
        "desc": "Pull newer images for all services (changes state)",
        "cmd": "docker compose pull",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "up",
          "stack"
        ]
      },
      {
        "id": "compose-up-sub-3",
        "desc": "Recreate one service even if nothing changed (changes state)",
        "cmd": "docker compose up -d --force-recreate <service>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "up",
          "stack"
        ]
      }
    ]
  },
  {
    "id": "docker-compose-cmd-2",
    "badge": "compose",
    "title": "Docker Compose: See the state of every service in the stack",
    "subtitle": "See the state of every service in the stack",
    "commands": [
      {
        "id": "compose-ps-logs",
        "desc": "See the state of every service in the stack",
        "cmd": "docker compose ps",
        "details": "",
        "flags": [
          [
            "ps",
            "One row per service container, with state and health"
          ],
          [
            "logs --tail 100 <service>",
            "Logs for one service; without a service name you get all of them interleaved"
          ],
          [
            "exec <service> sh",
            "Shell inside a service by its name in compose.yaml, not the container name"
          ]
        ],
        "tip": "Use the service name from compose.yaml",
        "tags": [
          "docker",
          "containers",
          "compose",
          "ps",
          "logs",
          "exec"
        ]
      },
      {
        "id": "compose-ps-logs-sub-1",
        "desc": "Last 100 lines from one service",
        "cmd": "docker compose logs --tail 100 <service>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "ps",
          "logs"
        ]
      },
      {
        "id": "compose-ps-logs-sub-2",
        "desc": "Follow all services live (Ctrl+C to stop)",
        "cmd": "docker compose logs -f",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "ps",
          "logs"
        ]
      },
      {
        "id": "compose-ps-logs-sub-3",
        "desc": "Interactive shell in a service container",
        "cmd": "docker compose exec <service> sh",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "ps",
          "logs"
        ]
      }
    ]
  },
  {
    "id": "docker-compose-cmd-3",
    "badge": "compose",
    "title": "Docker Compose: Stop and remove the stack's containers and networks",
    "subtitle": "Stop and remove the stack's containers and networks (changes state)",
    "commands": [
      {
        "id": "compose-down",
        "desc": "Stop and remove the stack's containers and networks (changes state)",
        "cmd": "docker compose down",
        "details": "",
        "flags": [
          [
            "down",
            "Stops and removes containers and the default network. Named volumes are kept"
          ],
          [
            "-v / --volumes",
            "Also deletes named volumes, so databases lose their data"
          ],
          [
            "stop",
            "Use docker compose stop to pause the stack without removing anything"
          ]
        ],
        "tip": "down keeps volumes; down -v deletes them",
        "tags": [
          "docker",
          "containers",
          "compose",
          "down",
          "stop",
          "volumes"
        ]
      },
      {
        "id": "compose-down-sub-1",
        "desc": "Stop containers but keep them (changes state)",
        "cmd": "docker compose stop",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "down",
          "stop"
        ]
      },
      {
        "id": "compose-down-sub-2",
        "desc": "Restart one service (changes state)",
        "cmd": "docker compose restart <service>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "compose",
          "down",
          "stop"
        ]
      }
    ]
  },
  {
    "id": "docker-compose-cmd-4",
    "badge": "compose",
    "title": "Docker Compose: Example compose.yaml",
    "subtitle": "Example compose.yaml: a web service plus a database with a named volume and a health check",
    "commands": [
      {
        "id": "compose-yaml-example",
        "desc": "Example compose.yaml: a web service plus a database with a named volume and a health check",
        "cmd": "services:\n  web:\n    image: nginx:1.27\n    ports:\n      - \"8080:80\"\n    depends_on:\n      db:\n        condition: service_healthy\n  db:\n    image: postgres:16\n    environment:\n      POSTGRES_PASSWORD_FILE: /run/secrets/db_pw\n    volumes:\n      - dbdata:/var/lib/postgresql/data\n    healthcheck:\n      test: [\"CMD\", \"pg_isready\"]\n      interval: 10s\nvolumes:\n  dbdata:",
        "details": "",
        "flags": [
          [
            "services:",
            "Each key is one service; its name is also its DNS name on the stack's network (web can reach db at db:5432)"
          ],
          [
            "ports: \"8080:80\"",
            "Quote port mappings: YAML can misread unquoted values like 22:22 as a number"
          ],
          [
            "depends_on + condition: service_healthy",
            "Start web only after db's healthcheck passes, not just after db starts"
          ],
          [
            "volumes: dbdata",
            "A named volume that survives docker compose down (but not down -v)"
          ],
          [
            "*_FILE / secrets",
            "Read passwords from files instead of putting them in compose.yaml"
          ]
        ],
        "tip": "Services reach each other by service name",
        "tags": [
          "docker",
          "containers",
          "compose",
          "yaml",
          "services",
          "volumes",
          "healthcheck",
          "depends_on"
        ]
      }
    ]
  },
  {
    "id": "docker-compose-pro-tips",
    "badge": "tip",
    "title": "Docker Compose: Pro Tip",
    "subtitle": "Keep secrets out of compose.yaml",
    "commands": [
      {
        "id": "docker-compose-tips-card",
        "desc": "Keep secrets out of compose.yaml",
        "cmd": "docker compose config --quiet && echo OK",
        "details": "Compose reads a .env file in the project directory automatically and substitutes ${VAR} references. Keep that .env out of git (add it to .gitignore) and commit a .env.example with placeholder values instead. --quiet validates without printing the merged config, which would otherwise show secret values on screen.",
        "flags": [
          [
            ".env",
            "Loaded automatically for ${VAR} substitution in compose.yaml"
          ],
          [
            "config --quiet",
            "Validate only; prints nothing on success"
          ],
          [
            "environment: vs env_file:",
            "Inline values vs. a file of KEY=value lines passed into the container"
          ]
        ],
        "tip": "Commit .env.example, never .env",
        "tags": [
          "docker",
          "containers",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("docker-compose_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = CTR_DOCKER_COMPOSE_DATA;
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

  for (const card of CTR_DOCKER_COMPOSE_DATA) {
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
        localStorage.setItem("docker-compose_bookmarks", JSON.stringify([...state.bookmarks]));
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
