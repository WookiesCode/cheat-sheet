const GIT_DATA = [
  {
    id: "git-start", badge: "GIT", title: "Start & Inspect", subtitle: "Identify the repository and review changes before acting",
    commands: [
      { id: "git-init-clone", desc: "Create a repository or clone an existing one", cmd: "git init\ngit clone <repository-url>\ngit clone --branch <branch> <repository-url>", details: "git init starts version control in the current directory. Clone copies a remote repository into a new local directory. Replace angle-bracket placeholders before running.", flags: [["--branch", "Check out the named branch after cloning"]], tags: ["git", "init", "clone", "setup"] },
      { id: "git-status", desc: "See the branch and working tree state", cmd: "git status --short --branch\ngit status", details: "Check staged, unstaged, and untracked paths before staging, committing, switching branches, or synchronizing.", flags: [["--short", "Compact two-column status"], ["--branch", "Show branch and upstream summary"]], tags: ["git", "status", "working tree", "read only"] },
      { id: "git-diff", desc: "Review unstaged and staged changes", cmd: "git diff\ngit diff --staged\ngit diff --check", details: "Plain git diff shows tracked changes outside the index. --staged compares the index with HEAD. --check detects whitespace errors and conflict markers.", flags: [["--staged", "Show changes prepared for the next commit"], ["--check", "Check patch formatting"]], tags: ["git", "diff", "staged", "review"] },
      { id: "git-log", desc: "Inspect recent commits and a file's history", cmd: "git log --oneline --decorate --graph -15\ngit log --oneline -- path/to/file\ngit show --stat <commit>", details: "The path separator tells Git that the final argument is a file path. git show can inspect a commit without changing the working tree.", flags: [["--oneline", "Abbreviate commits"], ["--stat", "Summarize changed files"]], tags: ["git", "log", "show", "history"] }
    ]
  },
  {
    id: "git-commit", badge: "GIT", title: "Stage & Commit", subtitle: "Review exactly what the next commit contains",
    commands: [
      { id: "git-add", desc: "Stage a file or interactively select hunks", cmd: "git add -- path/to/file\ngit add -p\ngit diff --cached", details: "Prefer explicit paths or interactive staging when the working tree contains unrelated edits. Inspect the staged diff before committing.", flags: [["-p", "Choose individual hunks"], ["--", "Separate options from paths"]], tags: ["git", "add", "stage", "hunks"] },
      { id: "git-commit", desc: "Commit reviewed staged changes", cmd: "git diff --cached --check\ngit commit -m \"Describe the change\"", details: "Commit records the current index. The -m text is the commit message; it does not stage files automatically.", flags: [["-m", "Supply a commit message"]], tags: ["git", "commit", "message"] },
      { id: "git-unstage", desc: "Remove a path from the index while keeping its edits", cmd: "git restore --staged -- path/to/file\ngit status --short", details: "This changes the index only; the file's working-tree edits remain. Review status afterward.", flags: [["--staged", "Restore the index from HEAD"]], tags: ["git", "restore", "unstage", "index"] },
      { id: "git-ignore", desc: "Inspect why a path is ignored", cmd: "git check-ignore -v -- path/to/file\ngit ls-files -- path/to/file", details: "check-ignore names the matching ignore rule. Ignore rules do not stop tracking a file already in the index.", tags: ["git", "ignore", "tracked", "inspect"] }
    ]
  },
  {
    id: "git-branches", badge: "GIT", title: "Branches & Changes", subtitle: "Move between lines of work and carry selected commits",
    commands: [
      { id: "git-branch-list", desc: "List local and remote branches", cmd: "git branch -vv\ngit branch -a\ngit remote -v", details: "-vv shows upstream and ahead/behind information for local branches. Remote-tracking branches reflect the last fetch.", tags: ["git", "branch", "remote", "upstream"] },
      { id: "git-switch", desc: "Create or switch to a branch", cmd: "git switch -c <new-branch>\ngit switch <existing-branch>", details: "Confirm status first; Git may block a switch if local changes would be overwritten. -c creates and switches to the new branch.", flags: [["-c", "Create the branch before switching"]], tags: ["git", "switch", "branch", "create"] },
      { id: "git-merge", desc: "Merge another branch into the current branch", cmd: "git status --short --branch\ngit merge <source-branch>", details: "Run while on the destination branch. A merge may create a merge commit or stop for conflict resolution. Review the incoming commits first with git log HEAD..<source-branch>.", tags: ["git", "merge", "branch", "conflict"] },
      { id: "git-cherry-pick", desc: "Apply one existing commit to the current branch", cmd: "git show --stat <commit>\ngit cherry-pick <commit>", details: "Cherry-pick creates a new commit with a new ID. If conflicts occur, resolve them and use git cherry-pick --continue, or abort with git cherry-pick --abort.", tags: ["git", "cherry-pick", "commit", "conflict"] },
      { id: "git-stash", desc: "Temporarily save tracked edits", cmd: "git stash push -m \"work in progress\"\ngit stash list\ngit stash show -p stash@{0}\ngit stash apply stash@{0}", details: "By default stash does not include untracked files; add -u only after reviewing those paths. apply keeps the stash entry, while pop removes it if application succeeds.", flags: [["-u", "Include untracked files"], ["apply", "Restore a stash without dropping it"]], tags: ["git", "stash", "working tree"] }
    ]
  },
  {
    id: "git-remotes", badge: "GIT", title: "Remotes & Collaboration", subtitle: "Fetch first, inspect, then publish intentionally",
    commands: [
      { id: "git-fetch", desc: "Download remote history without integrating it", cmd: "git fetch origin\ngit log --oneline --left-right HEAD...origin/<branch>", details: "Fetch updates remote-tracking refs but does not merge them into the checked-out branch. Inspect divergence before pulling or rebasing.", tags: ["git", "fetch", "remote", "history"] },
      { id: "git-pull", desc: "Integrate the configured upstream branch", cmd: "git pull --ff-only", details: "--ff-only updates only if no local merge commit is needed; it fails on divergent history. Check git status and upstream configuration first.", flags: [["--ff-only", "Allow only a fast-forward update"]], tags: ["git", "pull", "fast forward", "remote"] },
      { id: "git-push", desc: "Publish a branch to its remote", cmd: "git push -u origin <branch>\ngit push", details: "The first command sets the branch's upstream. Push changes a remote repository; verify the destination and branch before running. Avoid force push on shared branches.", flags: [["-u", "Set upstream tracking for future pushes"]], tags: ["git", "push", "publish", "upstream"] },
      { id: "git-remote-inspect", desc: "Inspect remote URLs and upstream tracking", cmd: "git remote -v\ngit branch -vv\ngit rev-parse --show-toplevel", details: "These read-only checks help prevent pushing to the wrong repository or working in the wrong checkout.", tags: ["git", "remote", "upstream", "repository"] }
    ]
  },
  {
    id: "git-recovery", badge: "GIT", title: "Investigate & Recover", subtitle: "Use targeted recovery commands after inspecting the diff",
    commands: [
      { id: "git-blame", desc: "Find the commit that last changed a line", cmd: "git blame -L 10,30 -- path/to/file\ngit show <commit>", details: "Blame maps lines to commits. Follow the referenced commit with git show to see its full context.", tags: ["git", "blame", "history", "line"] },
      { id: "git-reflog", desc: "Find recently visited commits and branch tips", cmd: "git reflog -10\ngit show <commit>", details: "Reflog is local and records movements such as commits, resets, and checkouts. Inspect a candidate before using it for recovery.", tags: ["git", "reflog", "recovery", "read only"] },
      { id: "git-restore-file", desc: "Discard local unstaged changes in one tracked file", cmd: "git diff -- path/to/file\ngit restore --worktree -- path/to/file", details: "This overwrites unstaged changes in the named file. Review the diff and confirm those edits are no longer needed before running.", flags: [["--worktree", "Restore the working copy from the index"]], tags: ["git", "restore", "discard", "destructive"] },
      { id: "git-revert", desc: "Undo a committed change with a new commit", cmd: "git show --stat <commit>\ngit revert <commit>", details: "Revert preserves published history by adding a new inverse commit. It can conflict and may require manual resolution.", tags: ["git", "revert", "undo", "commit"] },
      { id: "git-worktree", desc: "Create a separate checkout for another branch", cmd: "git worktree list\ngit worktree add -b <new-branch> ../<directory>", details: "Worktrees share one repository's object database while keeping separate working directories. Choose a new directory and branch name deliberately.", tags: ["git", "worktree", "branch", "checkout"] }
    ]
  },
  {
    id: "git-setup-more", badge: "GIT", title: "Setup & Release", subtitle: "Configuration, tags, and repository boundaries",
    commands: [
      { id: "git-config", desc: "Inspect and set author identity for this repository", cmd: "git config --show-origin --get user.name\ngit config --show-origin --get user.email\ngit config --local user.name \"Your Name\"\ngit config --local user.email \"you@example.com\"", details: "The first two commands inspect configuration and its source. --local writes only this repository's config; use the identity you intend for future commits. Never put access tokens in Git config examples.", tags: ["git", "config", "identity", "setup"] },
      { id: "git-alias", desc: "Create and inspect a short command alias", cmd: "git config --local alias.st 'status --short --branch'\ngit config --local --get alias.st\ngit st", details: "Aliases are stored in repository config with --local. Review shared configuration and avoid aliases that hide destructive flags or override familiar workflows.", tags: ["git", "config", "alias", "setup"] },
      { id: "git-ignore-rules", desc: "Ignore generated output and local secrets", cmd: "printf '%s\\n' 'logs/' '*.tmp' '.env' >> .gitignore\ngit check-ignore -v -- .env", details: "The first command changes .gitignore. Review the file before committing. Ignore rules do not remove already tracked files, and an ignored secret already committed remains in history.", tags: ["git", "gitignore", "secrets", "setup"] },
      { id: "git-tags", desc: "Inspect and create an annotated release tag", cmd: "git tag --list\ngit show v1.0.0\ngit tag -a v1.0.1 -m \"Release v1.0.1\"\ngit push origin v1.0.1", details: "Tags mark a specific commit. Creating a tag changes local refs; pushing publishes it. Check HEAD and the destination before tagging. Use git tag -a <tag> <commit> to target a different commit.", tags: ["git", "tag", "release", "publish"] }
    ]
  },
  {
    id: "git-advanced", badge: "GIT", title: "History & Conflict Work", subtitle: "Trace regressions and resolve integration conflicts",
    commands: [
      { id: "git-rebase", desc: "Replay local commits onto an updated branch", cmd: "git status --short --branch\ngit fetch origin\ngit rebase origin/main", details: "Rebase rewrites local commit IDs. Inspect divergence and ensure the working tree is clean. Avoid rebasing commits others already use; if conflicts occur, resolve them and run git rebase --continue or git rebase --abort.", tags: ["git", "rebase", "branch", "history"] },
      { id: "git-conflicts", desc: "Find and resolve conflicted files", cmd: "git status --short\ngit diff --name-only --diff-filter=U\ngit diff --check\ngit add -- path/to/resolved-file", details: "Edit each conflict marker and verify the result before staging. After a merge, use git commit if needed; after a rebase or cherry-pick, use its --continue command. The add command changes the index.", tags: ["git", "conflict", "merge", "rebase"] },
      { id: "git-search-history", desc: "Search commits by message or changed text", cmd: "git log --all --grep='Xid 79' --oneline\ngit log -S'fabricmanager' --oneline -- path/to/file\ngit log -G'NVLink.*down' --oneline", details: "--grep searches commit messages; -S finds changes in occurrence count of an exact string; -G finds diffs matching a regular expression. These are read-only history searches.", tags: ["git", "log", "search", "pickaxe"] },
      { id: "git-bisect", desc: "Locate the first bad commit with a reproducible check", cmd: "git bisect start\ngit bisect bad\ngit bisect good <known-good-commit>\n# Run the same check, then: git bisect good OR git bisect bad\ngit bisect reset", details: "Bisect checks out historical commits in the working tree. Start with a clean tree and a reliable, safe test. The good/bad decision moves the search; reset returns to the original branch.", tags: ["git", "bisect", "regression", "history"] },
      { id: "git-reset", desc: "Move a local branch back while retaining file changes", cmd: "git status --short --branch\ngit log --oneline -5\ngit reset --soft HEAD~1", details: "--soft moves the current branch pointer and leaves the index and working tree intact. This rewrites local history; avoid it on shared published commits. Use git reflog to recover the prior tip if needed.", tags: ["git", "reset", "undo", "history"] }
    ]
  },
  {
    id: "git-ops", badge: "GIT", title: "Operations & Large Repositories", subtitle: "Nested projects, offline transfer, and deployment inspection",
    commands: [
      { id: "git-submodule", desc: "Inspect and initialize nested repositories", cmd: "git submodule status\ngit submodule update --init --recursive", details: "status is read-only. update fetches and checks out the commits recorded by the parent repository. Review submodule URLs before running it in an untrusted repository.", tags: ["git", "submodule", "nested repository"] },
      { id: "git-hooks", desc: "Inspect local hooks and hook path", cmd: "git config --show-origin --get core.hooksPath\ngit rev-parse --git-path hooks\ngit status --short", details: "Hooks can execute during Git operations and are local to a checkout or configured hook directory. Inspect hook scripts before running commands that trigger them.", tags: ["git", "hooks", "automation", "security"] },
      { id: "git-bundle", desc: "Transfer a branch to an air-gapped machine", cmd: "git bundle create project.bundle main\ngit bundle verify project.bundle\ngit clone project.bundle project-copy", details: "Bundle create writes a file containing Git history reachable from the named ref. Verify it before transfer. The receiving host can clone without contacting a remote; ensure the bundle includes every required ref.", tags: ["git", "bundle", "offline", "air gap"] },
      { id: "git-deployed", desc: "Identify the revision and dirty state on a deployed checkout", cmd: "git -C /opt/app rev-parse --show-toplevel\ngit -C /opt/app rev-parse HEAD\ngit -C /opt/app status --short --branch", details: "These commands inspect an existing checkout without modifying it. Compare the commit ID with the expected release; a dirty tree may make the deployed code differ from that commit.", tags: ["git", "deployment", "revision", "read only"] },
      { id: "git-secret-response", desc: "Check whether a sensitive path is tracked", cmd: "git ls-files -- .env\ngit log --all --oneline -- .env", details: "These commands inspect tracking and history. If a secret was committed, revoke or rotate it first; deleting the file or adding .gitignore does not erase old commits. Plan any history rewrite with repository owners.", tags: ["git", "secret", "incident", "history"] }
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
  bookmarks: new Set(JSON.parse(localStorage.getItem("git_cs_bookmarks") || "[]"))
};

// DOM Elements
const sectionsContainer = document.getElementById("sections-container");
const categoryTabsEl = document.getElementById("category-tabs");
const searchInput = document.getElementById("search-input");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
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
  const totalCommands = GIT_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of GIT_DATA) {
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
      <select id="category-select" class="cat-select" aria-label="Filter by ${escapeHtml('Bash')} section">
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

  for (const section of GIT_DATA) {
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

function applyDensity(compact) {
  state.compact = compact;
  document.body.classList.toggle("compact-mode", compact);
  densityLabel.textContent = compact ? "Relaxed" : "Compact";
  localStorage.setItem("linux_cs_compact", compact ? "1" : "0");
  packMasonry();
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
      localStorage.setItem("git_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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

  densityToggleBtn.addEventListener("click", () => {
    applyDensity(!state.compact);
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

// Initialize
applyTheme(state.theme);
applyDensity(state.compact);
renderCategoryTabs();
renderSections();
initEvents();
