// sudo.js
// Standalone interactive cheat sheet for sudo & root — Why Root Is Dangerous and How to Use sudo
const SUDO_DATA = [
  {
    "id": "sudo-card-1",
    "badge": "sudo",
    "title": "sudo & root: Why not just work as root? The dangers, and what",
    "subtitle": "Why not just work as root? The dangers, and what sudo does instead",
    "commands": [
      {
        "id": "sudo-dangers",
        "desc": "Why not just work as root? The dangers, and what sudo does instead",
        "cmd": "sudo -l",
        "details": "1) No safety net: rm -rf on the wrong path, dd, mkfs or wipefs on the wrong disk, chmod -R or chown -R on / all just happen. 2) Everything inherits root: every program, script, plugin and editor shell escape started from a root shell runs as root, so a bad install script or a compromised package owns the machine. 3) No accountability: with a shared root password the logs only say root. 4) Root shells linger: a forgotten root shell in tmux or on a jumpbox is an open door. sudo answers each one: root for one command at a time, your own password, your user name and command in the log, cached for 5 minutes by default, and sudoers can allow only the commands you need (least privilege).",
        "flags": [
          [
            "One command at a time",
            "Root only for the command that needs it, then you are back to your normal user"
          ],
          [
            "Your own password",
            "No shared root password to leak or rotate when someone leaves"
          ],
          [
            "Logged by name",
            "Who ran what, where and when: needed for audits and incident timelines"
          ],
          [
            "Time-limited",
            "Your password is cached for 5 minutes by default (sudoers timestamp_timeout); sudo -k ends it now"
          ],
          [
            "Least privilege",
            "sudoers can allow one command (for example ipmitool) instead of everything"
          ],
          [
            "sudo -l",
            "Lists exactly what you are allowed to run here"
          ]
        ],
        "subcommands": [
          [
            "sudo -k",
            "Forget your cached password now (do it before you walk away)"
          ],
          [
            "sudo -v",
            "Refresh the cache without running anything (before a long series of steps)"
          ]
        ],
        "tip": "Root is a tool for one step, not a place to work",
        "tags": [
          "sudo",
          "root",
          "danger",
          "least-privilege",
          "audit",
          "security"
        ]
      }
    ]
  },
  {
    "id": "sudo-card-2",
    "badge": "sudo",
    "title": "sudo & root: Who am I running as? Check before you type anyth",
    "subtitle": "Who am I running as? Check before you type anything destructive",
    "commands": [
      {
        "id": "sudo-who-am-i",
        "desc": "Who am I running as? Check before you type anything destructive",
        "cmd": "id",
        "details": "root is the account with user ID 0. For root the kernel skips most permission checks: any file can be read, changed or deleted, any disk can be overwritten, any process can be killed. That is exactly why it is dangerous: the system stops protecting you from your own typo. A prompt ending in # usually means you are root; $ means a normal user.",
        "flags": [
          [
            "uid=0(root)",
            "You are root right now: nothing checks your permissions"
          ],
          [
            "groups=…sudo / wheel",
            "You may use sudo (Ubuntu and Debian use the sudo group; RHEL and Rocky use wheel)"
          ],
          [
            "# prompt",
            "Usually a root shell. Exit it as soon as the job is done"
          ],
          [
            "Ubuntu",
            "The root password is locked by default: you are meant to use sudo, not log in as root"
          ]
        ],
        "subcommands": [
          [
            "whoami",
            "Just the user name"
          ],
          [
            "sudo -l",
            "What sudo lets you run on this host (asks for your password)"
          ]
        ],
        "tip": "Read the prompt: # means every command is unchecked",
        "tags": [
          "sudo",
          "root",
          "uid",
          "id",
          "whoami",
          "privilege"
        ]
      }
    ]
  },
  {
    "id": "sudo-card-3",
    "badge": "sudo",
    "title": "sudo & root: Run one command as root, or as another user",
    "subtitle": "Run one command as root, or as another user",
    "commands": [
      {
        "id": "sudo-run-one",
        "desc": "Run one command as root, or as another user",
        "cmd": "sudo dmesg -T",
        "details": "sudo checks the sudoers policy, asks for YOUR password (not root's), runs the command as root and logs it. On this site, and in the agent's answers, commands that need root are marked # needs root instead of carrying a sudo prefix: you decide how to elevate.",
        "flags": [
          [
            "-u <user>",
            "Run as that user instead of root, for example a service account: sudo -u postgres psql"
          ],
          [
            "-n",
            "Never prompt: fail with an error if a password is needed (use in scripts so they never hang)"
          ],
          [
            "-k / -v",
            "End the cached password now / refresh it"
          ],
          [
            "--",
            "End of sudo's own options: everything after it belongs to the command"
          ],
          [
            "sudo !!",
            "Re-runs your previous command as root. Read it again first: !! is whatever ran last"
          ]
        ],
        "subcommands": [
          [
            "sudo -u postgres psql -c 'select 1'",
            "Run a command as a service account"
          ],
          [
            "sudo -n true && echo 'sudo works without a prompt'",
            "Check that a script can use sudo before it runs"
          ]
        ],
        "tip": "Prefix the one command, never your whole session",
        "tags": [
          "sudo",
          "run",
          "user",
          "non-interactive",
          "scripts"
        ]
      }
    ]
  },
  {
    "id": "sudo-card-4",
    "badge": "sudo",
    "title": "sudo & root: A root shell when you really need one: sudo -i, ",
    "subtitle": "A root shell when you really need one: sudo -i, sudo -s and su",
    "commands": [
      {
        "id": "sudo-shells",
        "desc": "A root shell when you really need one: sudo -i, sudo -s and su",
        "cmd": "sudo -i",
        "details": "Sometimes a root shell is the practical choice (a long recovery in single-user style). Know the trade-off: sudo logs only the command it runs, so once you are in a root shell the commands you type there are not logged one by one (the sudo man page warns about exactly this). Get in, do the job, type exit.",
        "flags": [
          [
            "sudo -i",
            "Login shell as root: root's environment and home directory, reads root's profile"
          ],
          [
            "sudo -s",
            "Shell as root that keeps your own environment (your $HOME, PATH may be reset by policy)"
          ],
          [
            "su -",
            "Switch to root with ROOT's password: on Ubuntu root's password is locked, so this usually fails"
          ],
          [
            "sudo su / sudo bash",
            "Same as a root shell, and it skips the per-command log: avoid"
          ],
          [
            "exit",
            "Leave the root shell the moment you are done"
          ]
        ],
        "subcommands": [
          [
            "exit",
            "Back to your own user"
          ]
        ],
        "tip": "If you open a root shell, close it in the same breath",
        "tags": [
          "sudo",
          "root-shell",
          "su",
          "login",
          "logging"
        ]
      }
    ]
  },
  {
    "id": "sudo-card-5",
    "badge": "sudo",
    "title": "sudo & root: The redirect gotcha: sudo echo > /etc/file fails",
    "subtitle": "The redirect gotcha: sudo echo > /etc/file fails; use tee (changes state)",
    "commands": [
      {
        "id": "sudo-redirect-gotcha",
        "desc": "The redirect gotcha: sudo echo > /etc/file fails; use tee (changes state)",
        "cmd": "echo 'vm.swappiness = 10' | sudo tee /etc/sysctl.d/99-swappiness.conf",
        "details": "In sudo echo x > /etc/file, your own shell opens /etc/file for the > BEFORE sudo runs, so it fails with Permission denied. Piping into sudo tee makes tee (running as root) open the file. Add > /dev/null to hide tee's echo, and -a to append instead of replace.",
        "flags": [
          [
            "sudo tee <file>",
            "tee opens the file as root, so the write works"
          ],
          [
            "sudo tee -a <file>",
            "Append instead of replacing the file"
          ],
          [
            "> /dev/null",
            "Stop tee from also printing the text to your screen"
          ],
          [
            "sudo sh -c '… > file'",
            "The other fix: the whole line, redirect included, runs as root"
          ]
        ],
        "subcommands": [
          [
            "echo '2001:db8:dc:4::50 bmc-rack04' | sudo tee -a /etc/hosts > /dev/null",
            "Append a line to a root-owned file (changes state)"
          ]
        ],
        "tip": "The shell does the redirect, not sudo",
        "tags": [
          "sudo",
          "tee",
          "redirect",
          "permission-denied",
          "gotcha"
        ]
      }
    ]
  },
  {
    "id": "sudo-card-6",
    "badge": "sudo",
    "title": "sudo & root: Edit a root-owned file safely with sudoedit (sud",
    "subtitle": "Edit a root-owned file safely with sudoedit (sudo -e)",
    "commands": [
      {
        "id": "sudo-edit-files",
        "desc": "Edit a root-owned file safely with sudoedit (sudo -e)",
        "cmd": "sudoedit /etc/ssh/sshd_config",
        "details": "sudoedit copies the file to a temporary file owned by you, runs YOUR editor as you, and writes the result back as root only when you save. Your editor, its plugins and its shell escapes never run as root, unlike sudo nano or sudo vim. Back up first, validate after (sshd -t, visudo -c, findmnt --verify).",
        "flags": [
          [
            "sudoedit = sudo -e",
            "Same thing"
          ],
          [
            "SUDO_EDITOR / VISUAL / EDITOR",
            "Pick the editor it uses, for example SUDO_EDITOR=nano"
          ],
          [
            "Why not sudo vim",
            "Inside sudo vim, :!bash gives a root shell that is not logged"
          ]
        ],
        "subcommands": [
          [
            "sudo sshd -t",
            "Validate sshd_config before restarting sshd"
          ]
        ],
        "tip": "Back up, sudoedit, then validate",
        "tags": [
          "sudo",
          "sudoedit",
          "edit",
          "config",
          "nano",
          "vim"
        ]
      }
    ]
  },
  {
    "id": "sudo-card-7",
    "badge": "sudo",
    "title": "sudo & root: Who may run what: sudoers drop-in files, edited ",
    "subtitle": "Who may run what: sudoers drop-in files, edited only with visudo (changes state)",
    "commands": [
      {
        "id": "sudo-sudoers",
        "desc": "Who may run what: sudoers drop-in files, edited only with visudo (changes state)",
        "cmd": "sudo visudo -f /etc/sudoers.d/90-datacenter-techs",
        "details": "Never edit /etc/sudoers or its drop-ins with a plain editor: one syntax error can leave nobody able to use sudo. visudo locks the file and checks the syntax before saving. Grant the smallest set of commands that does the job. Be careful with NOPASSWD (no password at all) and with commands that can start a shell (editors, less, find -exec, tar --to-command): each one is a way to a full root shell.",
        "flags": [
          [
            "visudo -f <file>",
            "Edit a drop-in in /etc/sudoers.d/ with locking and a syntax check"
          ],
          [
            "visudo -c",
            "Check every sudoers file without editing"
          ],
          [
            "%group ALL=(root) /usr/bin/ipmitool",
            "Example rule: members of a group may run only ipmitool as root"
          ],
          [
            "NOPASSWD:",
            "Skips the password: convenient for automation, risky on a shared account"
          ],
          [
            "sudo-rs visudo",
            "On Ubuntu's newer sudo-rs, visudo is reported to check only /etc/sudoers itself, not the drop-ins: verify on your release"
          ]
        ],
        "subcommands": [
          [
            "sudo visudo -c",
            "Syntax check of every sudoers file"
          ]
        ],
        "tip": "Keep a second root session open while you change sudoers",
        "tags": [
          "sudo",
          "sudoers",
          "visudo",
          "nopasswd",
          "least-privilege"
        ]
      }
    ]
  },
  {
    "id": "sudo-card-8",
    "badge": "sudo",
    "title": "sudo & root: Who ran what as root? Read the sudo log",
    "subtitle": "Who ran what as root? Read the sudo log",
    "commands": [
      {
        "id": "sudo-audit",
        "desc": "Who ran what as root? Read the sudo log",
        "cmd": "sudo journalctl -t sudo --since today --no-pager",
        "details": "Every sudo command is logged with the user, the terminal, the working directory and the full command. That is what makes sudo better than a shared root login during an incident: the timeline shows who changed what. Ubuntu and Debian also write it to /var/log/auth.log; RHEL and Rocky to /var/log/secure.",
        "flags": [
          [
            "-t sudo",
            "Only entries logged by sudo"
          ],
          [
            "--since today / '-1h'",
            "Limit the time range"
          ],
          [
            "/var/log/auth.log",
            "Ubuntu and Debian text log"
          ],
          [
            "/var/log/secure",
            "RHEL and Rocky text log"
          ]
        ],
        "subcommands": [
          [
            "sudo grep -h 'COMMAND=' /var/log/auth.log | tail -n 20",
            "Last 20 sudo commands (Ubuntu and Debian)"
          ]
        ],
        "tip": "Commands typed inside a root shell do not show up here",
        "tags": [
          "sudo",
          "audit",
          "log",
          "journalctl",
          "auth.log",
          "incident"
        ]
      }
    ]
  },
  {
    "id": "sudo-card-9",
    "badge": "sudo",
    "title": "sudo & root: Which sudo is this? Ubuntu 25",
    "subtitle": "Which sudo is this? Ubuntu 25.10 and 26.04 default to sudo-rs",
    "commands": [
      {
        "id": "sudo-implementation",
        "desc": "Which sudo is this? Ubuntu 25.10 and 26.04 default to sudo-rs",
        "cmd": "update-alternatives --display sudo",
        "details": "Ubuntu now ships sudo-rs, a Rust rewrite of sudo, as the default, and keeps the original as sudo.ws. Day-to-day use is the same. Reported differences: sudo-rs shows asterisks while you type the password, visudo checks less, and some sudoers features (LDAP sudoers, mail on failure) are not supported. Upstream sudo is at 1.9.17p2.",
        "flags": [
          [
            "sudo-rs",
            "Default on Ubuntu 25.10 and 26.04"
          ],
          [
            "sudo.ws",
            "The original sudo, still installed as a fallback"
          ],
          [
            "sudo --version",
            "Shows the implementation and version"
          ]
        ],
        "subcommands": [
          [
            "sudo --version",
            "Which sudo, which version"
          ]
        ],
        "tip": "If a sudoers rule behaves differently on Ubuntu 26.04, check which sudo is active",
        "tags": [
          "sudo",
          "sudo-rs",
          "ubuntu",
          "version",
          "rust"
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
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("sudo_bookmarks") || "[]"); } catch (e) { return []; } })())
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
  const totalCommands = SUDO_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of SUDO_DATA) {
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

  for (const section of SUDO_DATA) {
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
        localStorage.setItem("sudo_bookmarks", JSON.stringify([...state.bookmarks]));
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
