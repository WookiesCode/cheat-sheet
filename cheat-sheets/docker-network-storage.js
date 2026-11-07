// docker-network-storage.js
// Standalone interactive cheat sheet for Containers: Docker Networking, Ports & Volumes
const CTR_DOCKER_NETWORK_STORAGE_DATA = [
  {
    "id": "docker-network-storage-cmd-1",
    "badge": "dnet",
    "title": "Docker Networking & Storage: List Docker networks and see which containers are on one",
    "subtitle": "List Docker networks and see which containers are on one",
    "commands": [
      {
        "id": "docker-network-ls",
        "desc": "List Docker networks and see which containers are on one",
        "cmd": "docker network ls",
        "details": "",
        "flags": [
          [
            "bridge (default)",
            "Private network with NAT to the host; containers on the default bridge can't resolve each other by name"
          ],
          [
            "user-defined bridge",
            "docker network create <net>: containers on it resolve each other by container name"
          ],
          [
            "host",
            "--network host: the container shares the host's network stack, no port mapping and no isolation"
          ]
        ],
        "tip": "Use a user-defined network for name resolution",
        "tags": [
          "docker",
          "containers",
          "network",
          "bridge",
          "host",
          "dns"
        ]
      }
    ]
  },
  {
    "id": "docker-network-storage-flags-1",
    "badge": "dnet",
    "title": "Docker Networking & Storage: More options",
    "subtitle": "More options for: List Docker networks and see which containers are on one",
    "commands": [
      {
        "id": "docker-network-ls-flags-card",
        "desc": "More options and gotchas for: List Docker networks and see which containers are on one",
        "cmd": "docker network ls",
        "hideCode": false,
        "flags": [
          [
            "none",
            "No networking at all"
          ]
        ],
        "tags": [
          "docker",
          "containers",
          "flags",
          "options",
          "network",
          "bridge",
          "host"
        ]
      }
    ]
  },
  {
    "id": "docker-network-storage-recipes-1",
    "badge": "dnet",
    "title": "Docker Networking & Storage: Related commands",
    "subtitle": "Related commands for: List Docker networks and see which containers are on one",
    "commands": [
      {
        "id": "docker-network-ls-sub-1",
        "desc": "Containers attached to a network and their IPs",
        "cmd": "docker network inspect <network> --format '{{range .Containers}}{{.Name}} {{.IPv4Address}}{{\"\\n\"}}{{end}}'",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "network",
          "bridge",
          "host"
        ]
      },
      {
        "id": "docker-network-ls-sub-2",
        "desc": "Create a user-defined bridge (changes state)",
        "cmd": "docker network create <network>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "network",
          "bridge",
          "host"
        ]
      },
      {
        "id": "docker-network-ls-sub-3",
        "desc": "Attach a running container to another network (changes state)",
        "cmd": "docker network connect <network> <container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "network",
          "bridge",
          "host"
        ]
      }
    ]
  },
  {
    "id": "docker-network-storage-cmd-2",
    "badge": "dnet",
    "title": "Docker Networking & Storage: Show which host ports a container publishes",
    "subtitle": "Show which host ports a container publishes",
    "commands": [
      {
        "id": "docker-port-check",
        "desc": "Show which host ports a container publishes",
        "cmd": "docker port <container>",
        "details": "",
        "flags": [
          [
            "80/tcp -> 0.0.0.0:8080",
            "Container port 80 is reachable on every host interface at port 8080"
          ],
          [
            "-p 127.0.0.1:8080:80",
            "Publish only on localhost, so it is not exposed to the network"
          ],
          [
            "Firewall note",
            "Published ports are added to iptables/nftables by Docker and can bypass ufw rules"
          ]
        ],
        "tip": "Docker-published ports can bypass ufw",
        "tags": [
          "docker",
          "containers",
          "port",
          "publish",
          "ss",
          "firewall",
          "ufw"
        ]
      }
    ]
  },
  {
    "id": "docker-network-storage-recipes-2",
    "badge": "dnet",
    "title": "Docker Networking & Storage: Related commands",
    "subtitle": "Related commands for: Show which host ports a container publishes",
    "commands": [
      {
        "id": "docker-port-check-sub-1",
        "desc": "Confirm what is listening on the host side",
        "cmd": "sudo ss -ltnp | grep <port>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "port",
          "publish",
          "ss"
        ]
      },
      {
        "id": "docker-port-check-sub-2",
        "desc": "Test name resolution from inside a container",
        "cmd": "docker exec <container> getent hosts <other-container>",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "port",
          "publish",
          "ss"
        ]
      }
    ]
  },
  {
    "id": "docker-network-storage-cmd-3",
    "badge": "dnet",
    "title": "Docker Networking & Storage: List volumes and find where one lives on the host",
    "subtitle": "List volumes and find where one lives on the host",
    "commands": [
      {
        "id": "docker-volumes",
        "desc": "List volumes and find where one lives on the host",
        "cmd": "docker volume ls",
        "details": "",
        "flags": [
          [
            "named volume (-v data:/path)",
            "Managed by Docker under /var/lib/docker/volumes; survives container removal"
          ],
          [
            "bind mount (-v /host/path:/path)",
            "A host directory mapped in directly; you manage permissions and backups"
          ],
          [
            ":ro",
            "Mount read-only, e.g. -v /etc/ssl:/etc/ssl:ro"
          ]
        ],
        "tip": "-v creates a missing host path silently; --mount errors",
        "tags": [
          "docker",
          "containers",
          "volume",
          "bind",
          "mount",
          "storage",
          "backup"
        ]
      }
    ]
  },
  {
    "id": "docker-network-storage-flags-3",
    "badge": "dnet",
    "title": "Docker Networking & Storage: More options",
    "subtitle": "More options for: List volumes and find where one lives on the host",
    "commands": [
      {
        "id": "docker-volumes-flags-card",
        "desc": "More options and gotchas for: List volumes and find where one lives on the host",
        "cmd": "docker volume ls",
        "hideCode": false,
        "flags": [
          [
            "--mount type=bind,src=...,dst=...",
            "Longer syntax that fails loudly if the host path doesn't exist (-v silently creates it)"
          ]
        ],
        "tags": [
          "docker",
          "containers",
          "flags",
          "options",
          "volume",
          "bind",
          "mount"
        ]
      }
    ]
  },
  {
    "id": "docker-network-storage-recipes-3",
    "badge": "dnet",
    "title": "Docker Networking & Storage: Related commands",
    "subtitle": "Related commands for: List volumes and find where one lives on the host",
    "commands": [
      {
        "id": "docker-volumes-sub-1",
        "desc": "Host path of a named volume",
        "cmd": "docker volume inspect <volume> --format '{{.Mountpoint}}'",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "volume",
          "bind",
          "mount"
        ]
      },
      {
        "id": "docker-volumes-sub-2",
        "desc": "Back up a named volume to a tarball in the current directory",
        "cmd": "docker run --rm -v <volume>:/data -v \"$PWD\":/backup ubuntu:24.04 tar czf /backup/<volume>.tgz -C /data .",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "volume",
          "bind",
          "mount"
        ]
      },
      {
        "id": "docker-volumes-sub-3",
        "desc": "Delete unused volumes: this deletes data (changes state)",
        "cmd": "docker volume prune",
        "tags": [
          "docker",
          "containers",
          "recipe",
          "volume",
          "bind",
          "mount"
        ]
      }
    ]
  },
  {
    "id": "docker-network-storage-pro-tips",
    "badge": "tip",
    "title": "Docker Networking & Storage: Pro Tip",
    "subtitle": "RDMA and host networking for GPU jobs",
    "commands": [
      {
        "id": "docker-network-storage-tips-card",
        "desc": "RDMA and host networking for GPU jobs",
        "cmd": "docker run --rm --network host --device /dev/infiniband --ulimit memlock=-1 <image> ibv_devinfo",
        "details": "Multi-node GPU jobs that use InfiniBand or RoCE need the host's RDMA devices inside the container. --network host avoids NAT, --device /dev/infiniband exposes the verbs devices, and an unlimited memlock lets RDMA pin memory. Check the HCA from inside with ibv_devinfo before blaming the fabric.",
        "flags": [
          [
            "--network host",
            "Container uses the host's interfaces directly"
          ],
          [
            "--device /dev/infiniband",
            "Pass the RDMA verbs devices through"
          ],
          [
            "--ulimit memlock=-1",
            "Allow unlimited locked memory for RDMA registration"
          ]
        ],
        "tip": "ibv_devinfo inside the container should match the host",
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("docker-network-storage_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const allCards = CTR_DOCKER_NETWORK_STORAGE_DATA;
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

  for (const card of CTR_DOCKER_NETWORK_STORAGE_DATA) {
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
        localStorage.setItem("docker-network-storage_bookmarks", JSON.stringify([...state.bookmarks]));
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
