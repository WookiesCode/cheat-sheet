// packages.js
// Standalone interactive cheat sheet for Ubuntu APT, dpkg, Snap & Release Management
const PACKAGES_DATA = [
  {
    "id": "packages-card-1",
    "badge": "pkg",
    "title": "Ubuntu APT: Update Ubuntu APT repositories, perform full upg...",
    "subtitle": "Update Ubuntu APT repositories, perform full upgrade, and purge orphaned packages/kernels",
    "commands": [
      {
        "id": "apt-update-upgrade",
        "desc": "Update Ubuntu APT repositories, perform full upgrade, and purge orphaned packages/kernels",
        "cmd": "apt update && apt full-upgrade -y && apt autoremove --purge -y",
        "details": "'apt full-upgrade' upgrades installed packages and intelligently resolves dependency changes (such as installing a new Linux kernel ABI package). 'autoremove --purge' removes old unused kernel images and leftover configuration files so /boot does not fill up.",
        "flags": [
          [
            "full-upgrade",
            "Upgrade packages while handling dependency additions/removals"
          ],
          [
            "autoremove --purge",
            "Remove unused dependencies and purge their residual /etc config files"
          ]
        ],
        "subcommands": [
          [
            "apt list --upgradable",
            "List all packages that have a newer version available in configured APT repositories"
          ],
          [
            "apt-mark hold linux-image-generic kubelet && apt-mark showhold",
            "Pin/hold critical packages (e.g. kernel or kubelet) to prevent accidental upgrades"
          ]
        ],
        "tip": "Keeps /boot clean of old kernels",
        "tags": [
          "ubuntu",
          "debian",
          "apt",
          "upgrade",
          "cleanup",
          "apt-mark",
          "hold"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/apt/apt.8.en.html",
              "title": "apt(8), Debian"
            },
            {
              "url": "https://manpages.debian.org/trixie/apt/apt-mark.8.en.html",
              "title": "apt-mark(8), Debian"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "packages-card-2",
    "badge": "pkg",
    "title": "Ubuntu APT: APT packages, inspect package dependencies, and ...",
    "subtitle": "Search APT packages, inspect package dependencies, and debug PPA/repository version priorities",
    "commands": [
      {
        "id": "apt-search-policy",
        "desc": "Search APT packages, inspect package dependencies, and debug PPA/repository version priorities",
        "cmd": "apt search <keyword> && apt show <pkg> && apt-cache policy <pkg>",
        "details": "'apt-cache policy <pkg>' is the definitive command on Ubuntu to see which version is currently installed, what the candidate version is, and which repository (/etc/apt/sources.list.d/) is providing it at what pin priority (500, 990, etc.).",
        "flags": [
          [
            "apt show",
            "Display package maintainer, version, dependencies, download size, and description"
          ],
          [
            "apt-cache policy",
            "Show installed version, candidate version, and APT repository priority table"
          ]
        ],
        "subcommands": [
          [
            "grep -rhE '^deb |^Types:' /etc/apt/sources.list /etc/apt/sources.list.d/",
            "List all active APT package repositories and PPAs configured on the Ubuntu host"
          ],
          [
            "apt download <pkg> && dpkg-deb -I <pkg>*.deb",
            "Download a .deb package to the current directory without installing it and inspect its control metadata"
          ]
        ],
        "tip": "Debugs version conflicts & PPAs",
        "tags": [
          "apt",
          "search",
          "policy",
          "repo",
          "ppa",
          "version",
          "sources.list"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/apt/apt.8.en.html",
              "title": "apt(8), Debian"
            },
            {
              "url": "https://manpages.debian.org/trixie/apt/apt-cache.8.en.html",
              "title": "apt-cache(8), Debian"
            },
            {
              "url": "https://manpages.debian.org/trixie/dpkg/dpkg-deb.1.en.html",
              "title": "dpkg-deb(1), Debian"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "packages-card-3",
    "badge": "pkg",
    "title": "Ubuntu APT: Installed",
    "subtitle": "Query installed .deb packages, find which package owns a binary, or list all files inside a package",
    "commands": [
      {
        "id": "dpkg-query-files",
        "desc": "Query installed .deb packages, find which package owns a binary, or list all files inside a package",
        "cmd": "dpkg -S $(which ss) && dpkg -L iproute2 && dpkg -l | grep -E '^ii|^rc'",
        "details": "Directly queries the local dpkg database (/var/lib/dpkg/status) without network access. In 'dpkg -l', the first letter is desired state (i=install, r=remove) and the second letter is actual status (i=installed, c=config-files remaining, u=unpacked).",
        "flags": [
          [
            "-S <path>",
            "Search which installed package owns a specific file path"
          ],
          [
            "-L <pkg>",
            "List every file, binary, systemd unit, and manpage installed by <pkg>"
          ],
          [
            "-l",
            "List installed packages (status 'ii' = cleanly installed, 'rc' = removed with leftover configs)"
          ]
        ],
        "subcommands": [
          [
            "apt-file update && apt-file search /usr/sbin/ipmitool",
            "Find which Ubuntu package provides a binary that is NOT yet installed on the system"
          ],
          [
            "debsums -s",
            "Verify MD5 checksums of installed Ubuntu package files against dpkg metadata to detect corruption"
          ]
        ],
        "tags": [
          "dpkg",
          "deb",
          "owns",
          "files",
          "ubuntu",
          "apt-file"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dpkg/dpkg.1.en.html",
              "title": "dpkg(1), Debian"
            },
            {
              "url": "https://manpages.debian.org/trixie/apt-file/apt-file.1.en.html",
              "title": "apt-file(1), Debian"
            },
            {
              "url": "https://manpages.debian.org/trixie/debsums/debsums.1.en.html",
              "title": "debsums(1), Debian"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "packages-card-4",
    "badge": "pkg",
    "title": "Ubuntu APT: Repair interrupted dpkg runs, fix broken APT dep...",
    "subtitle": "Repair interrupted dpkg runs, fix broken APT dependencies, and check services/kernel pending restart",
    "commands": [
      {
        "id": "dpkg-fix-needrestart",
        "desc": "Repair interrupted dpkg runs, fix broken APT dependencies, and check services/kernel pending restart",
        "cmd": "dpkg --configure -a && apt --fix-broken install && needrestart -r l",
        "details": "If an SSH session drops mid-upgrade, dpkg may be left with unpacked but unconfigured packages. Running 'dpkg --configure -a' followed by 'apt --fix-broken install' completes the transaction. Ubuntu's 'needrestart' detects which daemons are still using old shared libraries in RAM and whether a kernel reboot is pending.",
        "flags": [
          [
            "--configure -a",
            "Configure all unpacked but unconfigured .deb packages"
          ],
          [
            "--fix-broken",
            "Resolve and install missing dependencies to heal a broken package state"
          ],
          [
            "needrestart -r l",
            "List (without restarting) services using outdated libs and check kernel ABI mismatch"
          ]
        ],
        "subcommands": [
          [
            "cat /var/run/reboot-required /var/run/reboot-required.pkgs 2>/dev/null",
            "Check if Ubuntu requires a system reboot after patching and see which packages triggered it"
          ],
          [
            "lsof /var/lib/dpkg/lock-frontend /var/lib/apt/lists/lock",
            "Check if a background apt or unattended-upgrade process is currently holding the dpkg lock"
          ]
        ],
        "tip": "Checks /var/run/reboot-required",
        "tags": [
          "dpkg",
          "broken",
          "lock",
          "repair",
          "needrestart",
          "reboot-required"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dpkg/dpkg.1.en.html",
              "title": "dpkg(1), Debian"
            },
            {
              "url": "https://manpages.debian.org/trixie/apt/apt-get.8.en.html",
              "title": "apt-get(8), Debian"
            },
            {
              "url": "https://manpages.debian.org/trixie/needrestart/needrestart.1.en.html",
              "title": "needrestart(1), Debian"
            }
          ]
        }
      }
    ]
  },
  {
    "id": "packages-card-5",
    "badge": "pkg",
    "title": "Ubuntu APT: Ubuntu LTS release version, inspect kernel/drive...",
    "subtitle": "Check Ubuntu LTS release version, inspect kernel/driver ring buffer, and manage Snap packages",
    "commands": [
      {
        "id": "snap-ubuntu-release",
        "desc": "Check Ubuntu LTS release version, inspect kernel/driver ring buffer, and manage Snap packages",
        "cmd": "lsb_release -a && hostnamectl && snap list",
        "details": "Displays the Ubuntu distribution release (e.g., Ubuntu 24.04.1 LTS Noble Numbat), chassis type, machine ID, kernel release, and any installed Canonical Snap packages.",
        "flags": [
          [
            "lsb_release -a",
            "Show Ubuntu Distributor ID, Description, Release number, and Codename"
          ],
          [
            "hostnamectl",
            "Display static/transient hostname, chassis type, virtualization, OS, and kernel"
          ],
          [
            "snap list",
            "List installed Snap packages, revisions, and publisher status"
          ]
        ],
        "subcommands": [
          [
            "pro status",
            "Check Ubuntu Pro subscription status (ESM security updates, Livepatch kernel patching)"
          ],
          [
            "dmesg -T -w --level=err,warn",
            "Watch the kernel ring buffer live with human-readable timestamps for hardware/driver errors"
          ]
        ],
        "tags": [
          "snap",
          "ubuntu",
          "lsb_release",
          "hostnamectl",
          "dmesg",
          "livepatch"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/lsb-release/lsb_release.1.en.html",
              "title": "lsb_release(1), Debian"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/hostnamectl.1.html",
              "title": "hostnamectl(1)"
            },
            {
              "url": "https://manpages.ubuntu.com/manpages/noble/man8/snap.8.html",
              "title": "snap(8), Ubuntu 24.04"
            },
            {
              "url": "https://manpages.ubuntu.com/manpages/noble/man1/pro.1.html",
              "title": "pro(1), Ubuntu 24.04"
            }
          ],
          "note": "Ubuntu-specific: snap and pro are Canonical tools."
        }
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
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("packages_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM References
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
      showToast("Copied command to clipboard");
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
  showToast("Copied command to clipboard");
}

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
  const totalCommands = PACKAGES_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of PACKAGES_DATA) {
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

  for (const section of PACKAGES_DATA) {
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
            <span class="copy-hint">Copy</span>
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

    const row = e.target.closest(".subcmd-row");
    if (row) {
      const subcmdText = row.getAttribute("data-subcmd");
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
        localStorage.setItem("packages_bookmarks", JSON.stringify([...state.bookmarks]));
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

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(state.theme);
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
});
