// generate-linux-suite.js
// Generates all 15 standalone Linux sysadmin cheat sheets and updates the Linux dropdown across all HTML sheets.
const fs = require('fs');
const path = require('path');

// 1. Read app.js to extract CHEAT_SHEET_DATA
const appJs = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const sandbox = { localStorage: { getItem: () => null } };
const dataEndIdx = appJs.indexOf('const searchInput =');
require('vm').runInNewContext(appJs.slice(0, dataEndIdx) + '\nsandboxData = CHEAT_SHEET_DATA;', sandbox);

const CHEAT_SHEET_DATA = sandbox.sandboxData;
console.log(`Loaded ${CHEAT_SHEET_DATA.length} Linux sections from app.js`);

const LINUX_NAVBAR_SNIPPET = `              <div class="nav-dropdown" id="linux-nav-dropdown">
                <a href="linux.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M12 2C8.8 2 7.2 4.3 7.2 7.2c0 1.4-.4 2.4-1.3 3.7-1.1 1.6-1.9 3.6-1.4 5.2.3.9 1.1 1.2 1.8.8.4 1.8 2.4 3.6 5.7 3.6s5.3-1.8 5.7-3.6c.7.4 1.5.1 1.8-.8.5-1.6-.3-3.6-1.4-5.2-.9-1.3-1.3-2.3-1.3-3.7C16.8 4.3 15.2 2 12 2z" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2"/><ellipse cx="12" cy="14.5" rx="4.1" ry="5" fill="#f8fafc"/><circle cx="10.2" cy="6.5" r="1.4" fill="#fff"/><circle cx="13.8" cy="6.5" r="1.4" fill="#fff"/><circle cx="10.5" cy="6.6" r="0.7" fill="#0f172a"/><circle cx="13.5" cy="6.6" r="0.7" fill="#0f172a"/><path d="M9.6 8.3c1.3-.5 3.5-.5 4.8 0L12 10.6 9.6 8.3z" fill="#f59e0b"/><ellipse cx="8.5" cy="20.5" rx="2.6" ry="1.3" fill="#f59e0b"/><ellipse cx="15.5" cy="20.5" rx="2.6" ry="1.3" fill="#f59e0b"/></svg>
                  <span>Linux</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu linux-dropdown-menu" role="menu">
                  <a href="linux.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Ubuntu Linux Hub</a>
                  <div class="dropdown-divider"></div>
                  <div class="linux-dropdown-grid">
                    <div class="linux-dropdown-col">
                      <div class="linux-dropdown-heading">Hardware &amp; Architecture</div>
                      <a href="dmi-hw.html" class="dropdown-item" role="menuitem"><code>dmi</code> <span class="cmd-desc">DMI / SMBIOS / FRU</span></a>
                      <a href="pcie-numa.html" class="dropdown-item" role="menuitem"><code>pci</code> <span class="cmd-desc">PCIe &amp; NUMA Topology</span></a>
                      <a href="ecc-edac.html" class="dropdown-item" role="menuitem"><code>ecc</code> <span class="cmd-desc">ECC Memory &amp; MCE</span></a>
                      <a href="nvme-smart.html" class="dropdown-item" role="menuitem"><code>nvm</code> <span class="cmd-desc">Enterprise NVMe / SMART</span></a>
                      <a href="kernel-boot.html" class="dropdown-item" role="menuitem"><code>krn</code> <span class="cmd-desc">Kernel &amp; Bootloader</span></a>
                    </div>
                    <div class="linux-dropdown-col">
                      <div class="linux-dropdown-heading">System &amp; Services</div>
                      <a href="systemd.html" class="dropdown-item" role="menuitem"><code>sys</code> <span class="cmd-desc">systemd &amp; journald</span></a>
                      <a href="processes.html" class="dropdown-item" role="menuitem"><code>proc</code> <span class="cmd-desc">Processes &amp; Signals</span></a>
                      <a href="storage.html" class="dropdown-item" role="menuitem"><code>dsk</code> <span class="cmd-desc">Filesystems &amp; LVM</span></a>
                      <a href="archives.html" class="dropdown-item" role="menuitem"><code>tar</code> <span class="cmd-desc">Archives &amp; Compress</span></a>
                      <a href="packages.html" class="dropdown-item" role="menuitem"><code>pkg</code> <span class="cmd-desc">APT &amp; Release Mgmt</span></a>
                    </div>
                    <div class="linux-dropdown-col">
                      <div class="linux-dropdown-heading">Core OS &amp; Security</div>
                      <a href="files.html" class="dropdown-item" role="menuitem"><code>fs</code> <span class="cmd-desc">Files &amp; Directories</span></a>
                      <a href="permissions.html" class="dropdown-item" role="menuitem"><code>perm</code> <span class="cmd-desc">Permissions &amp; ACLs</span></a>
                      <a href="users.html" class="dropdown-item" role="menuitem"><code>usr</code> <span class="cmd-desc">Users, Sudo &amp; SSH</span></a>
                      <a href="network.html" class="dropdown-item" role="menuitem"><code>net</code> <span class="cmd-desc">Network &amp; Firewalls</span></a>
                      <a href="text.html" class="dropdown-item" role="menuitem"><code>txt</code> <span class="cmd-desc">Text &amp; Log Triage</span></a>
                    </div>
                  </div>
                </div>
              </div>`;

// 2. Update navbar across all existing HTML files
const htmlFiles = require('./nav/targets').navFiles();   // the one nav copy, not every page
const linuxLinkPattern = /<a href="index\.html" class="sheet-link(?: active)?">[\s\S]*?<\/svg>\s*Linux<\/a>/;

let updatedNavCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (linuxLinkPattern.test(content)) {
    content = content.replace(linuxLinkPattern, LINUX_NAVBAR_SNIPPET);
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
    updatedNavCount++;
  }
}
console.log(`Updated navbar with Linux dropdown in ${updatedNavCount} existing HTML files`);

// 3. Function to build rich cards for each Linux section
function buildLinuxSectionCards(sec) {
  const cards = [];
  const secName = sec.title.split(',')[0].split('&')[0].trim();

  sec.commands.forEach((cmd, idx) => {
    let cardTitle = cmd.desc.split('.')[0].replace(/^(List|Inspect|Verify|Check|Create|Set|Search|Query|Monitor|Manage|Filter|Partition|Stream|Generate|Find)\s+/i, '').trim();
    if (cardTitle.length > 50) cardTitle = cardTitle.slice(0, 48) + '...';
    const capTitle = cardTitle.charAt(0).toUpperCase() + cardTitle.slice(1);

    cards.push({
      id: `${sec.id}-card-${idx + 1}`,
      badge: sec.badge,
      title: `${secName}: ${capTitle}`,
      subtitle: cmd.desc,
      commands: [ cmd ]
    });
  });

  // If section has fewer than 3 cards, add a pro tips & diagnostics card
  if (cards.length < 3) {
    let proTipCmd = '';
    let proTipDesc = '';
    let proTipDetails = '';
    let flags = [];
    let subcommands = [];

    if (sec.id === 'systemd') {
      proTipDesc = 'Systemd boot latency analysis, critical-chain bottlenecks & log persistence';
      proTipCmd = 'systemd-analyze blame | head -n 15 && systemd-analyze critical-chain';
      proTipDetails = 'Pinpoint services delaying server boot. Check /var/log/journal/ for persistent journal storage and verify systemd service unit syntax with systemd-analyze verify.';
      flags = [
        ['blame', 'Prints list of all running units ordered by initialization time taken'],
        ['critical-chain', 'Prints tree of the time-critical chain of systemd units at boot'],
        ['verify', 'Check unit configuration files for syntax errors and circular dependencies']
      ];
      subcommands = [
        ['journalctl --vacuum-time=14d --vacuum-size=2G', 'Purge archived journal logs older than 14 days or exceeding 2 GiB'],
        ['systemctl is-failed --quiet nginx.service || echo "Running"', 'Quietly check if a service has entered the failed state']
      ];
    } else if (sec.id === 'archives') {
      proTipDesc = 'Multithreaded compression with pigz/zstd and streaming integrity checks';
      proTipCmd = 'tar -I pigz -cf archive.tar.gz /srv/data/ && sha256sum archive.tar.gz > archive.tar.gz.sha256';
      proTipDetails = 'Use pigz (parallel implementation of gzip) or zstd -T0 to saturate all available CPU cores when creating large datacenter archives. Always produce and verify cryptographic checksums.';
      flags = [
        ['-I pigz', 'Use pigz multithreaded gzip compression utility'],
        ['-T0', 'zstd flag to automatically scale thread count to match physical cores'],
        ['--exclude', 'Exclude specific directories or patterns during archive creation']
      ];
      subcommands = [
        ['sha256sum -c archive.tar.gz.sha256', 'Validate SHA-256 hash checksum against computed file integrity'],
        ['tar -tvf archive.tar.gz | head -n 25', 'List table of contents without extracting archive to disk']
      ];
    } else if (sec.id === 'users') {
      proTipDesc = 'Sudoers validation, failed login auditing & account password expiration';
      proTipCmd = 'visudo -c && faillog -a && chage -l $(whoami)';
      proTipDetails = 'Always validate /etc/sudoers syntax with visudo -c before exiting. Audit authentication lockouts using faillog and verify password aging policies with chage.';
      flags = [
        ['visudo -c', 'Check syntax of sudoers file without opening editor'],
        ['faillog -a', 'Display failed login attempts and lockout thresholds for all accounts'],
        ['chage -l', 'List account aging parameters: password change date, expiry, and warning days']
      ];
      subcommands = [
        ['lastb | head -n 20', 'Audit recent bad / failed login attempts recorded in /var/log/btmp'],
        ['passwd -l <username>', 'Lock user account password to prevent interactive password logins']
      ];
    }

    if (proTipCmd) {
      cards.push({
        id: `${sec.id}-tips-diag`,
        badge: 'tip',
        title: `${secName}: Pro Tips & Triage`,
        subtitle: proTipDesc,
        commands: [
          {
            id: `${sec.id}-pro-tips`,
            desc: proTipDesc,
            cmd: proTipCmd,
            details: proTipDetails,
            flags: flags,
            subcommands: subcommands,
            tip: `Standard Ubuntu Server administration & security best practice`,
            tags: [sec.id, 'tips', 'triage', 'diagnostics']
          }
        ]
      });
    }
  }

  return cards;
}

// 4. Function to generate JS file
function generateLinuxJs(sec, cards) {
  const varName = `${sec.id.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`;
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${sec.id}.js
// Standalone interactive cheat sheet for ${sec.title}
const ${varName} = ${jsonCards};

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("${sec.id}_bookmarks") || "[]"); } catch (e) { return []; } })())
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
    /(^|\\s|;|&&|\\|\\||\\|)(sudo\\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\\|\\||&&|\\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return \`<span class="tok-str">\${strLiteral}</span>\`;
      if (flagPart) return \`<span class="tok-flag">\${flagPart}</span>\`;
      if (operatorPart) return \`<span class="tok-pipe">\${operatorPart}</span>\`;
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? \`<span class="tok-pipe">\${sudoPart}</span>\` : "";
        return \`\${prefix}\${sudoHtml}<span class="tok-cmd">\${cmdName}</span>\`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = ${varName}.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    \`<option value="all" \${state.activeCategory === "all" ? "selected" : ""}>All Sections (\${totalCommands} recipes)</option>\`
  ];

  for (const section of ${varName}) {
    const isSelected = state.activeCategory === section.id ? "selected" : "";
    optionsHtml.push(
      \`<option value="\${section.id}" \${isSelected}>\${escapeHtml(section.title)} (\${section.commands.length})</option>\`
    );
  }

  const resetBtnHtml =
    state.activeCategory !== "all"
      ? \`<button type="button" class="cat-reset-btn" data-cat="all" title="Show all sections">✕ Show All</button>\`
      : "";

  categoryTabsEl.innerHTML = \`
    <div class="cat-select-wrapper">
      <select id="cat-select" class="cat-select" aria-label="Filter by section">
        \${optionsHtml.join("")}
      </select>
      <span class="cat-select-arrow" aria-hidden="true">▾</span>
    </div>
    \${resetBtnHtml}
  \`;

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

  for (const section of ${varName}) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\\s+/)
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
        ? \`<div class="flag-pills">\${cmd.flags.map(([f, d]) =>
            \`<span class="flag-pill"><strong class="flag-token">\${escapeHtml(f)}</strong> <span class="flag-desc">\${escapeHtml(d)}</span></span>\`
          ).join("")}</div>\`
        : "";

      const subcommandsHtml = (cmd.subcommands && cmd.subcommands.length > 0)
        ? \`<div class="subcmd-list">\${cmd.subcommands.map(([sc, sd]) =>
            \`<div class="subcmd-row" data-subcmd="\${escapeHtml(sc)}">
              <span class="subcmd-code">\${escapeHtml(sc)}</span>
              <span class="subcmd-desc">\${escapeHtml(sd)}</span>
            </div>\`
          ).join("")}</div>\`
        : "";

      const detailsHtml = cmd.details
        ? \`<p class="cmd-details">\${escapeHtml(cmd.details)}</p>\`
        : "";

      const tipHtml = cmd.tip
        ? \`<div class="cmd-tip"><span class="tip-badge">TIP</span>\${escapeHtml(cmd.tip)}</div>\`
        : "";

      return \`
        <div class="cmd-item" id="cmd-\${escapeHtml(cmd.id)}" data-cmd-id="\${escapeHtml(cmd.id)}">
          <div class="cmd-header-row">
            <span class="cmd-desc">\${escapeHtml(cmd.desc)}</span>
            <button
              type="button"
              class="bookmark-btn \${isBookmarked ? "bookmarked" : ""}"
              data-cmd-id="\${escapeHtml(cmd.id)}"
              title="\${isBookmarked ? "Remove bookmark" : "Bookmark this recipe"}"
              aria-label="\${isBookmarked ? "Remove bookmark" : "Bookmark this recipe"}"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                <path fill="\${isBookmarked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          <div class="cmd-code-box" data-cmd="\${escapeHtml(cmd.cmd)}">
            <pre class="cmd-code"><code>\${highlightCommand(cmd.cmd)}</code></pre>
            <span class="copy-hint">Copy</span>
          </div>

          \${detailsHtml}
          \${flagsHtml}
          \${subcommandsHtml}
          \${tipHtml}
        </div>
      \`;
    }).join("");

    cardsHtml.push(\`
      <div class="section-card" id="sec-\${escapeHtml(section.id)}">
        <div class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">\${escapeHtml(section.badge)}</span>
            <h2 class="section-title">\${escapeHtml(section.title)}</h2>
          </div>
          <span class="cmd-count-badge">\${filteredCommands.length}</span>
        </div>
        <div class="section-body">
          \${commandsHtml}
        </div>
      </div>
    \`);
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
        localStorage.setItem("${sec.id}_bookmarks", JSON.stringify([...state.bookmarks]));
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
`;
}

// 5. Function to generate HTML file
function generateLinuxHtml(sec) {
  const secName = sec.title.split(',')[0].split('&')[0].trim();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${sec.title}: ${sec.subtitle}">
  <title>${sec.title} — Ubuntu Linux Reference</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <!-- Top Navigation Header -->
  <header class="top-bar">
    <div class="container top-bar-inner">
      <div class="brand">
        <div class="terminal-badge" aria-hidden="true">
          <span class="prompt-symbol">$</span><span class="cursor-block">_</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${sec.title}</h1>
            <span class="version-pill">${sec.badge.toUpperCase()} / Linux Admin</span>
            <nav class="sheet-switcher" aria-label="Switch cheat sheet">
${LINUX_NAVBAR_SNIPPET}
              <div class="nav-dropdown" id="cli-nav-dropdown">
                <a href="cli-tools.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2" y="3" width="20" height="18" rx="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 9l3.5 3-3.5 3" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12.5 15h5" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/></svg>
                  <span>CLI Tools</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu cli-dropdown-menu" role="menu">
                  <a href="cli-tools.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 All CLI Tools Hub</a>
                  <div class="dropdown-divider"></div>
                  <div class="cli-dropdown-grid">
                    <div class="cli-dropdown-col">
                      <div class="cli-dropdown-heading">Text &amp; Search</div>
                      <a href="grep.html" class="dropdown-item" role="menuitem"><code>grep</code> <span class="cmd-desc">Pattern search</span></a>
                      <a href="awk.html" class="dropdown-item" role="menuitem"><code>awk</code> <span class="cmd-desc">Columns &amp; math</span></a>
                      <a href="sed.html" class="dropdown-item" role="menuitem"><code>sed</code> <span class="cmd-desc">Stream editing</span></a>
                      <a href="cut.html" class="dropdown-item" role="menuitem"><code>cut</code> <span class="cmd-desc">Delimited slicing</span></a>
                      <a href="tr.html" class="dropdown-item" role="menuitem"><code>tr</code> <span class="cmd-desc">Translate chars</span></a>
                      <a href="sort.html" class="dropdown-item" role="menuitem"><code>sort</code> <span class="cmd-desc">Multi-key sort</span></a>
                      <a href="uniq.html" class="dropdown-item" role="menuitem"><code>uniq</code> <span class="cmd-desc">Deduplicate</span></a>
                      <a href="comm.html" class="dropdown-item" role="menuitem"><code>comm</code> <span class="cmd-desc">Compare lists</span></a>
                      <a href="column.html" class="dropdown-item" role="menuitem"><code>column</code> <span class="cmd-desc">Table align</span></a>
                      <a href="strings.html" class="dropdown-item" role="menuitem"><code>strings</code> <span class="cmd-desc">Binary strings</span></a>
                      <a href="xxd.html" class="dropdown-item" role="menuitem"><code>xxd</code> <span class="cmd-desc">Hex dump</span></a>
                    </div>
                    <div class="cli-dropdown-col">
                      <div class="cli-dropdown-heading">Files &amp; Storage</div>
                      <a href="find.html" class="dropdown-item" role="menuitem"><code>find</code> <span class="cmd-desc">Tree search</span></a>
                      <a href="ls.html" class="dropdown-item" role="menuitem"><code>ls</code> <span class="cmd-desc">File listings</span></a>
                      <a href="stat.html" class="dropdown-item" role="menuitem"><code>stat</code> <span class="cmd-desc">Inode metadata</span></a>
                      <a href="namei.html" class="dropdown-item" role="menuitem"><code>namei</code> <span class="cmd-desc">Path resolver</span></a>
                      <a href="file.html" class="dropdown-item" role="menuitem"><code>file</code> <span class="cmd-desc">Magic headers</span></a>
                      <a href="lsof.html" class="dropdown-item" role="menuitem"><code>lsof</code> <span class="cmd-desc">Open files &amp; ports</span></a>
                      <a href="fuser.html" class="dropdown-item" role="menuitem"><code>fuser</code> <span class="cmd-desc">Process mounts</span></a>
                      <a href="dd.html" class="dropdown-item" role="menuitem"><code>dd</code> <span class="cmd-desc">Direct I/O</span></a>
                      <a href="tar.html" class="dropdown-item" role="menuitem"><code>tar</code> <span class="cmd-desc">Sparse archives</span></a>
                      <a href="zstd.html" class="dropdown-item" role="menuitem"><code>zstd</code> <span class="cmd-desc">Compression</span></a>
                    </div>
                    <div class="cli-dropdown-col">
                      <div class="cli-dropdown-heading">Process &amp; System</div>
                      <a href="ps.html" class="dropdown-item" role="menuitem"><code>ps</code> <span class="cmd-desc">Process table</span></a>
                      <a href="watch.html" class="dropdown-item" role="menuitem"><code>watch</code> <span class="cmd-desc">Diff loop</span></a>
                      <a href="tee.html" class="dropdown-item" role="menuitem"><code>tee</code> <span class="cmd-desc">Pipe splitter</span></a>
                      <a href="strace.html" class="dropdown-item" role="menuitem"><code>strace</code> <span class="cmd-desc">Syscall trace</span></a>
                      <a href="xargs.html" class="dropdown-item" role="menuitem"><code>xargs</code> <span class="cmd-desc">Batch exec</span></a>
                      <a href="sysctl.html" class="dropdown-item" role="menuitem"><code>sysctl</code> <span class="cmd-desc">Kernel params</span></a>
                      <a href="dmesg.html" class="dropdown-item" role="menuitem"><code>dmesg</code> <span class="cmd-desc">Kernel buffer</span></a>
                      <a href="tmux.html" class="dropdown-item" role="menuitem"><code>tmux</code> <span class="cmd-desc">Multiplexer</span></a>
                      <a href="tio.html" class="dropdown-item" role="menuitem"><code>tio</code> <span class="cmd-desc">Serial console</span></a>
                      <a href="base64.html" class="dropdown-item" role="menuitem"><code>base64</code> <span class="cmd-desc">SOL console copy</span></a>
                    </div>
                    <div class="cli-dropdown-col">
                      <div class="cli-dropdown-heading">Network &amp; Hardware</div>
                      <a href="curl.html" class="dropdown-item" role="menuitem"><code>curl</code> <span class="cmd-desc">HTTP/REST</span></a>
                      <a href="rsync.html" class="dropdown-item" role="menuitem"><code>rsync</code> <span class="cmd-desc">Delta mirror</span></a>
                      <a href="scp.html" class="dropdown-item" role="menuitem"><code>scp</code> <span class="cmd-desc">SSH copy</span></a>
                      <a href="sftp.html" class="dropdown-item" role="menuitem"><code>sftp</code> <span class="cmd-desc">Secure FTP</span></a>
                      <a href="ip.html" class="dropdown-item" role="menuitem"><code>ip</code> <span class="cmd-desc">IPv6 &amp; routes</span></a>
                      <a href="ss.html" class="dropdown-item" role="menuitem"><code>ss</code> <span class="cmd-desc">Socket stats</span></a>
                      <a href="tcpdump.html" class="dropdown-item" role="menuitem"><code>tcpdump</code> <span class="cmd-desc">Packet sniff</span></a>
                      <a href="nmap.html" class="dropdown-item" role="menuitem"><code>nmap</code> <span class="cmd-desc">Port scan</span></a>
                      <a href="arp-scan.html" class="dropdown-item" role="menuitem"><code>ndisc6</code> <span class="cmd-desc">Neighbor NDP</span></a>
                      <a href="openssl.html" class="dropdown-item" role="menuitem"><code>openssl</code> <span class="cmd-desc">TLS certs</span></a>
                      <a href="http-server.html" class="dropdown-item" role="menuitem"><code>http.server</code> <span class="cmd-desc">Staging web</span></a>
                      <a href="jq.html" class="dropdown-item" role="menuitem"><code>jq</code> <span class="cmd-desc">JSON parser</span></a>
                      <a href="efibootmgr.html" class="dropdown-item" role="menuitem"><code>efibootmgr</code> <span class="cmd-desc">UEFI boot</span></a>
                      <a href="udevadm.html" class="dropdown-item" role="menuitem"><code>udevadm</code> <span class="cmd-desc">Device events</span></a>
                      <a href="cloud-init.html" class="dropdown-item" role="menuitem"><code>cloud-init</code> <span class="cmd-desc">Init triage</span></a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="nav-dropdown" id="scripting-nav-dropdown">
                <a href="scripting.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 4l-4 16" stroke="#38bdf8" stroke-width="1.8" stroke-linecap="round"/></svg>
                  <span>Scripting</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu" role="menu">
                  <a href="scripting.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 All-in-One Hub</a>
                  <div class="dropdown-divider"></div>
                  <a href="bash.html" class="dropdown-item" role="menuitem"><svg class="menu-logo logo-chip" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><path fill="#293138" d="M112.205 26.129 71.8 2.142A15.326 15.326 0 0 0 64.005 0c-2.688 0-5.386.717-7.796 2.152L15.795 26.14C10.976 28.999 8 34.289 8 40.018v47.975c0 5.729 2.967 11.019 7.796 13.878L56.2 125.858A15.193 15.193 0 0 0 63.995 128a15.32 15.32 0 0 0 7.796-2.142l40.414-23.987c4.819-2.86 7.796-8.16 7.796-13.878V40.007c0-5.718-2.967-11.019-7.796-13.878zm-31.29 74.907.063 3.448c0 .418-.267.889-.588 1.06l-2.046 1.178c-.321.16-.6-.032-.6-.45l-.032-3.394c-1.745.728-3.523.9-4.647.45-.214-.086-.31-.397-.225-.76l.739-3.117c.064-.246.193-.493.364-.643a.726.726 0 0 1 .193-.139c.117-.064.235-.075.332-.032 1.22.407 2.773.214 4.272-.535 1.907-.964 3.18-2.913 3.16-4.84-.022-1.757-.964-2.474-3.267-2.496-2.934.01-5.675-.567-5.718-4.894-.032-3.555 1.81-7.26 4.744-9.595l-.032-3.48c0-.428.257-.9.589-1.07l1.98-1.264c.322-.161.6.042.6.46l.033 3.48c1.456-.578 2.72-.738 3.865-.47.247.063.364.406.257.802l-.77 3.084a1.372 1.372 0 0 1-.354.622.825.825 0 0 1-.203.15c-.108.053-.204.064-.3.053-.525-.118-1.767-.385-3.727.6-2.056 1.038-2.773 2.827-2.763 4.155.022 1.585.825 2.066 3.63 2.11 3.738.063 5.344 1.691 5.387 5.45.053 3.684-1.917 7.657-4.937 10.077zm28.206-64.787L70.89 59.86c-4.765 2.784-8.278 5.911-8.288 11.662v47.107c0 3.437 1.392 5.665 3.523 6.318a12.81 12.81 0 0 1-2.12.204c-2.239 0-4.445-.61-6.383-1.757L17.219 99.408c-3.951-2.345-6.403-6.725-6.403-11.426V40.007c0-4.7 2.452-9.08 6.403-11.426L57.634 4.594a12.555 12.555 0 0 1 6.382-1.756c2.238 0 4.444.61 6.382 1.756l40.415 23.987c3.33 1.981 5.579 5.397 6.21 9.242-1.36-2.86-4.38-3.63-7.902-1.574z"/><path fill="#4fa847" d="m101.614 92.619-10.066 6.018c-.268.16-.46.332-.46.653v2.635c0 .32.214.46.481.3l10.216-6.212c.268-.16.31-.45.31-.77v-2.324c0-.322-.213-.45-.481-.3z"/></svg> Bash &amp; Shell</a>
                  <a href="python.html" class="dropdown-item" role="menuitem"><svg class="menu-logo" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><linearGradient id="scr-python-python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#5A9FD4"/><stop offset="1" stop-color="#306998"/></linearGradient><linearGradient id="scr-python-python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#FFD43B"/><stop offset="1" stop-color="#FFE873"/></linearGradient><path fill="url(#scr-python-python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)"/><path fill="url(#scr-python-python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)"/><radialGradient id="scr-python-python-original-c" cx="1825.678" cy="444.45" r="26.743" gradientTransform="matrix(0 -.24 -1.055 0 532.979 557.576)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#B8B8B8" stop-opacity=".498"/><stop offset="1" stop-color="#7F7F7F" stop-opacity="0"/></radialGradient><path opacity=".444" fill="url(#scr-python-python-original-c)" d="M97.309 119.597c0 3.543-14.816 6.416-33.091 6.416-18.276 0-33.092-2.873-33.092-6.416 0-3.544 14.815-6.417 33.092-6.417 18.275 0 33.091 2.872 33.091 6.417z"/></svg> Python</a>
                  <a href="javascript.html" class="dropdown-item" role="menuitem"><svg class="menu-logo" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"/><path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"/></svg> JavaScript</a>
                  <a href="typescript.html" class="dropdown-item" role="menuitem"><svg class="menu-logo" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><path fill="#fff" d="M22.67 47h99.67v73.67H22.67z"/><path data-name="original" fill="#007acc" d="M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73L82 101l3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49.19 49.19 0 01.12-5.17C29.08 59 39 59 51 59h21.83z"/></svg> TypeScript</a>
                  <a href="powershell.html" class="dropdown-item" role="menuitem"><svg class="menu-logo" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><linearGradient id="scr-powershell-a" x1="96.306" x2="25.454" y1="35.144" y2="98.431" gradientTransform="matrix(1 0 0 -1 0 128)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#a9c8ff"/><stop offset="1" stop-color="#c7e6ff"/></linearGradient><path fill="url(#scr-powershell-a)" fill-rule="evenodd" d="M7.2 110.5c-1.7 0-3.1-.7-4.1-1.9-1-1.2-1.3-2.9-.9-4.6l18.6-80.5c.8-3.4 4-6 7.4-6h92.6c1.7 0 3.1.7 4.1 1.9 1 1.2 1.3 2.9.9 4.6l-18.6 80.5c-.8 3.4-4 6-7.4 6H7.2z" clip-rule="evenodd" opacity=".8"/><linearGradient id="scr-powershell-b" x1="25.336" x2="94.569" y1="98.33" y2="36.847" gradientTransform="matrix(1 0 0 -1 0 128)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#2d4664"/><stop offset=".169" stop-color="#29405b"/><stop offset=".445" stop-color="#1e2f43"/><stop offset=".79" stop-color="#0c131b"/><stop offset="1"/></linearGradient><path fill="url(#scr-powershell-b)" fill-rule="evenodd" d="M120.3 18.5H28.5c-2.9 0-5.7 2.3-6.4 5.2L3.7 104.3c-.7 2.9 1.1 5.2 4 5.2h91.8c2.9 0 5.7-2.3 6.4-5.2l18.4-80.5c.7-2.9-1.1-5.3-4-5.3z" clip-rule="evenodd"/><path fill="#2C5591" fill-rule="evenodd" d="M64.2 88.3h22.3c2.6 0 4.7 2.2 4.7 4.9s-2.1 4.9-4.7 4.9H64.2c-2.6 0-4.7-2.2-4.7-4.9s2.1-4.9 4.7-4.9zM78.7 66.5c-.4.8-1.2 1.6-2.6 2.6L34.6 98.9c-2.3 1.6-5.5 1-7.3-1.4-1.7-2.4-1.3-5.7.9-7.3l37.4-27.1v-.6l-23.5-25c-1.9-2-1.7-5.3.4-7.4 2.2-2 5.5-2 7.4 0l28.2 30c1.7 1.9 1.8 4.5.6 6.4z" clip-rule="evenodd"/><path fill="#FFF" fill-rule="evenodd" d="M77.6 65.5c-.4.8-1.2 1.6-2.6 2.6L33.6 97.9c-2.3 1.6-5.5 1-7.3-1.4-1.7-2.4-1.3-5.7.9-7.3l37.4-27.1v-.6l-23.5-25c-1.9-2-1.7-5.3.4-7.4 2.2-2 5.5-2 7.4 0l28.2 30c1.7 1.8 1.8 4.4.5 6.4zM63.5 87.8h22.3c2.6 0 4.7 2.1 4.7 4.6 0 2.6-2.1 4.6-4.7 4.6H63.5c-2.6 0-4.7-2.1-4.7-4.6 0-2.6 2.1-4.6 4.7-4.6z" clip-rule="evenodd"/></svg> PowerShell</a>
                  <a href="lua.html" class="dropdown-item" role="menuitem"><svg class="menu-logo logo-chip" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><path fill="#000080" d="M112.956.708c-7.912 0-14.335 6.424-14.335 14.336s6.424 14.335 14.335 14.335 14.335-6.41 14.335-14.335c0-7.912-6.424-14.336-14.335-14.336zM64 15.058c-27.02 0-48.956 21.935-48.956 48.955S36.979 112.97 64 112.97c27.02 0 48.956-21.935 48.956-48.956 0-27.02-21.936-48.956-48.956-48.956z"/><path fill="#fff" d="M84.285 29.392c-7.91 0-14.335 6.424-14.335 14.335s6.424 14.336 14.335 14.336 14.336-6.424 14.336-14.336-6.424-14.335-14.335-14.335zM30.773 56.36v32.119h19.961v-3.611H34.87V56.359Zm57.584 8.37c-3.354 0-6.126.975-7.668 2.692-1.055 1.19-1.488 2.516-1.582 4.801h3.705c.311-2.826 1.988-4.098 5.423-4.098 3.3 0 5.153 1.231 5.153 3.435v.974c0 1.542-.92 2.205-3.827 2.556-5.193.663-5.991.839-7.398 1.407-2.69 1.095-4.057 3.164-4.057 6.166 0 4.193 2.908 6.83 7.574 6.83 2.907 0 5.247-1.014 7.843-3.395.257 2.34 1.407 3.395 3.787 3.395.757 0 1.325-.081 2.515-.392v-2.773a2.917 2.917 0 0 1-.798.095c-1.284 0-1.988-.663-1.988-1.812V71.032c0-4.098-3.002-6.302-8.682-6.302zm-33.742.664V83.19c0 3.84 2.867 6.302 7.357 6.302 3.395 0 5.545-1.19 7.709-4.233v3.219h3.3V65.393h-3.652v13.09c0 4.72-2.475 7.804-6.302 7.804-2.907 0-4.76-1.772-4.76-4.544v-16.35Zm38.773 11.67v4.139c0 1.244-.365 1.988-1.46 3.002-1.502 1.366-3.3 2.07-5.464 2.07-2.867 0-4.544-1.367-4.544-3.706 0-2.42 1.636-3.665 5.558-4.233 3.881-.528 4.68-.703 5.91-1.271z"/><path fill="#808080" d="M61.733 0a64.06 64.06 0 0 0-5.57.436l.179 1.458a62.596 62.596 0 0 1 5.442-.426zm5.585.046-.075 1.468a62.432 62.432 0 0 1 5.433.52L72.88.578a63.91 63.91 0 0 0-5.561-.532Zm-16.665 1.31a63.301 63.301 0 0 0-5.409 1.398l.43 1.405a61.835 61.835 0 0 1 5.284-1.367Zm27.72.237-.33 1.431a62.536 62.536 0 0 1 5.262 1.455l.452-1.397a63.998 63.998 0 0 0-5.384-1.489ZM39.98 4.623a63.447 63.447 0 0 0-5.081 2.323l.668 1.308a61.98 61.98 0 0 1 4.964-2.27zm49.012.41-.573 1.353a62.539 62.539 0 0 1 4.929 2.346l.688-1.298a64.012 64.012 0 0 0-5.044-2.4ZM30.04 9.706a63.95 63.95 0 0 0-4.6 3.17l.886 1.173a62.484 62.484 0 0 1 4.494-3.098zm-8.906 6.728a64.247 64.247 0 0 0-3.983 3.918l1.075 1.001a62.774 62.774 0 0 1 3.891-3.827zm-7.61 8.165a64.04 64.04 0 0 0-3.247 4.546l1.231.8a62.571 62.571 0 0 1 3.172-4.44zm-6.086 9.357a63.459 63.459 0 0 0-2.408 5.042l1.352.574a61.99 61.99 0 0 1 2.352-4.925zm113.623.973-1.31.667a62.616 62.616 0 0 1 2.263 4.967l1.362-.55a64.073 64.073 0 0 0-2.315-5.083zM3.075 44.23a63.382 63.382 0 0 0-1.49 5.385l1.432.328a61.91 61.91 0 0 1 1.455-5.26Zm122.166 1.049-1.404.429a62.513 62.513 0 0 1 1.366 5.285l1.437-.306a63.983 63.983 0 0 0-1.399-5.409zM.574 55.108a64.093 64.093 0 0 0-.528 5.561l1.467.075a62.622 62.622 0 0 1 .516-5.434Zm126.988 1.088-1.458.179a62.465 62.465 0 0 1 .428 5.441l1.468-.05a63.916 63.916 0 0 0-.438-5.57zM1.468 66.205 0 66.255a64.082 64.082 0 0 0 .435 5.57l1.458-.179a62.61 62.61 0 0 1-.425-5.441Zm125.018 1.071a62.63 62.63 0 0 1-.518 5.434l1.455.203a64.16 64.16 0 0 0 .53-5.561zM2.79 77.031l-1.437.304a63.332 63.332 0 0 0 1.398 5.41l1.405-.43A61.864 61.864 0 0 1 2.79 77.03Zm122.188 1.046a61.966 61.966 0 0 1-1.457 5.26l1.397.454a63.43 63.43 0 0 0 1.492-5.384zM5.981 87.459l-1.362.551a63.434 63.434 0 0 0 2.323 5.082l1.307-.669a61.968 61.968 0 0 1-2.268-4.964Zm115.627.99a61.98 61.98 0 0 1-2.354 4.925l1.296.69a63.447 63.447 0 0 0 2.41-5.04zM10.944 97.17l-1.245.78a63.949 63.949 0 0 0 3.17 4.6l1.172-.885a62.481 62.481 0 0 1-3.097-4.495zm105.534.904a62.546 62.546 0 0 1-3.173 4.44l1.156.906a64.024 64.024 0 0 0 3.249-4.545zm-98.96 7.8-1.092.983a64.235 64.235 0 0 0 3.917 3.983l1.002-1.074a62.77 62.77 0 0 1-3.827-3.892zm92.24.79a62.76 62.76 0 0 1-3.893 3.826l.983 1.092a64.221 64.221 0 0 0 3.984-3.916zm-84.263 6.648-.906 1.157a64.026 64.026 0 0 0 4.546 3.248l.8-1.232a62.554 62.554 0 0 1-4.44-3.173zm76.16.654a62.475 62.475 0 0 1-4.495 3.096l.78 1.245a63.945 63.945 0 0 0 4.6-3.17zm-67.018 5.294-.691 1.296a63.45 63.45 0 0 0 5.04 2.409l.575-1.352a61.984 61.984 0 0 1-4.924-2.353zm57.775.496a61.956 61.956 0 0 1-4.964 2.268l.551 1.362a63.425 63.425 0 0 0 5.082-2.322zm-47.74 3.77-.453 1.396a63.419 63.419 0 0 0 5.385 1.49l.329-1.43a61.949 61.949 0 0 1-5.26-1.456zm37.632.322a62.05 62.05 0 0 1-5.284 1.365l.304 1.437a63.361 63.361 0 0 0 5.41-1.398zm-27.003 2.122-.203 1.455a64.093 64.093 0 0 0 5.561.529l.075-1.467a62.605 62.605 0 0 1-5.433-.517zm16.335.139a62.635 62.635 0 0 1-5.442.424l.05 1.468a64.114 64.114 0 0 0 5.57-.434z"/></svg> Lua</a>
                  <div class="dropdown-divider"></div>
                  <a href="json.html" class="dropdown-item" role="menuitem"><svg class="menu-logo logo-chip" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><linearGradient id="scr-json-a" x1="-670.564" x2="-583.105" y1="-280.831" y2="-368.306" gradientTransform="matrix(.9988 0 0 -.9987 689.011 -259.008)" gradientUnits="userSpaceOnUse"><stop offset="0"/><stop offset="1" stop-color="#fff"/></linearGradient><path fill="url(#scr-json-a)" fill-rule="evenodd" d="M63.895 94.303c27.433 37.398 54.281-10.438 54.241-39.205-.046-34.012-34.518-53.021-54.263-53.021C32.182 2.077 2 28.269 2 64.105 2 103.937 36.596 126 63.873 126c-6.172-.889-26.742-5.296-27.019-52.674-.186-32.044 10.453-44.846 26.974-39.214.37.137 18.223 7.18 18.223 30.187 0 22.908-18.156 30.004-18.156 30.004z" clip-rule="evenodd"/><linearGradient id="scr-json-b" x1="-579.148" x2="-666.607" y1="-364.34" y2="-276.873" gradientTransform="matrix(.9988 0 0 -.9987 689.011 -259.008)" gradientUnits="userSpaceOnUse"><stop offset="0"/><stop offset="1" stop-color="#fff"/></linearGradient><path fill="url(#scr-json-b)" fill-rule="evenodd" d="M63.863 34.086C45.736 27.838 23.53 42.778 23.53 72.703 23.53 121.565 59.739 126 64.128 126 95.818 126 126 99.808 126 63.972 126 24.14 91.404 2.077 64.127 2.077c7.555-1.046 40.719 8.176 40.719 53.504 0 29.559-24.764 45.651-40.87 38.776-.37-.137-18.223-7.18-18.223-30.187 0-22.91 18.11-30.085 18.11-30.084z" clip-rule="evenodd"/></svg> JSON &amp; jq</a>
                  <a href="yaml.html" class="dropdown-item" role="menuitem"><svg class="menu-logo logo-chip" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><polygon transform="matrix(.24805 0 0 .24805 .5 5.6287)" points="87.702 137.67 0 0 63.25 0 119.02 88.646 175.24 0 235.79 0 143.98 137.67 143.98 224.95 87.702 224.95"/><path d="m82.428 49.149h-25.266l-5.1388 12.408h-11.188l23.659-55.798h11.444l22.699 55.798h-11.956l-4.2525-12.408zm-4.197-11.14-7.7455-20.476-8.6412 20.476z" fill="#cb171e"/><polygon transform="matrix(.24805 0 0 .24805 .5 5.6287)" points="87.701 250.18 87.701 470.65 135 470.65 135 318.57 184.51 420.79 221.74 420.79 272.94 314.98 272.94 470.6 318.32 470.6 318.32 250.18 256.36 250.18 201.38 349.88 149.02 250.18"/><polygon transform="matrix(.24805 0 0 .24805 .5 5.6287)" points="512 422.74 512 422.74 395.64 422.74 395.64 250.12 347.44 250.12 347.44 469.65 512 469.65"/></svg> YAML &amp; yq</a>
                  <a href="toml.html" class="dropdown-item" role="menuitem"><svg class="menu-logo logo-chip" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><path fill="#9c4221" d="M99.236 0v14.382h12.944v99.236H99.236V128H128V0ZM28.764 0v14.382H15.82v99.236h12.944V128H0V0Z"/><path d="M32.36 41.708v-15.82h63.28v15.82H71.91v69.034H56.09V41.708z"/></svg> TOML</a>
                  <div class="dropdown-divider"></div>
                  <a href="regex.html" class="dropdown-item" role="menuitem">🔤 Regex</a>
                  <a href="awk-sed.html" class="dropdown-item" role="menuitem">✂️ AWK &amp; Sed</a>
                  <a href="sql.html" class="dropdown-item" role="menuitem"><svg class="menu-logo" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><defs><linearGradient id="scr-sqlite-sqlite-original-a" x1="-15.615" x2="-6.741" y1="-9.108" y2="-9.108" gradientTransform="rotate(90 -90.486 64.634) scale(9.2712)" gradientUnits="userSpaceOnUse"><stop stop-color="#95d7f4" offset="0"/><stop stop-color="#0f7fcc" offset=".92"/><stop stop-color="#0f7fcc" offset="1"/></linearGradient></defs><path d="M69.5 99.176c-.059-.73-.094-1.2-.094-1.2S67.2 83.087 64.57 78.642c-.414-.707.043-3.594 1.207-7.88.68 1.169 3.54 6.192 4.118 7.81.648 1.824.78 2.347.78 2.347s-1.57-8.082-4.144-12.797a162.286 162.286 0 012.004-6.265c.973 1.71 3.313 5.859 3.828 7.3.102.293.192.543.27.774.023-.137.05-.274.074-.414-.59-2.504-1.75-6.86-3.336-10.082 3.52-18.328 15.531-42.824 27.84-53.754H16.9c-5.387 0-9.789 4.406-9.789 9.789v88.57c0 5.383 4.406 9.789 9.79 9.789h52.897a118.657 118.657 0 01-.297-14.652" fill="#0b7fcc"/><path d="M65.777 70.762c.68 1.168 3.54 6.188 4.117 7.809.649 1.824.781 2.347.781 2.347s-1.57-8.082-4.144-12.797a164.535 164.535 0 012.004-6.27c.887 1.567 2.922 5.169 3.652 6.872l.082-.961c-.648-2.496-1.633-5.766-2.898-8.328 3.242-16.871 13.68-38.97 24.926-50.898H16.899a6.94 6.94 0 00-6.934 6.933v82.11c17.527-6.731 38.664-12.88 56.855-12.614-.672-2.605-1.441-4.96-2.25-6.324-.414-.707.043-3.597 1.207-7.879" fill="url(#scr-sqlite-sqlite-original-a)"/><path d="M115.95 2.781c-5.5-4.906-12.164-2.933-18.734 2.899a44.347 44.347 0 00-2.914 2.859c-11.25 11.926-21.684 34.023-24.926 50.895 1.262 2.563 2.25 5.832 2.894 8.328.168.64.32 1.242.442 1.754.285 1.207.437 1.996.437 1.996s-.101-.383-.515-1.582c-.078-.23-.168-.484-.27-.773-.043-.125-.105-.274-.172-.434-.734-1.703-2.765-5.305-3.656-6.867-.762 2.25-1.437 4.36-2.004 6.265 2.578 4.715 4.149 12.797 4.149 12.797s-.137-.523-.782-2.347c-.578-1.621-3.441-6.64-4.117-7.809-1.164 4.281-1.625 7.172-1.207 7.88.809 1.362 1.574 3.722 2.25 6.323 1.524 5.867 2.586 13.012 2.586 13.012s.031.469.094 1.2a118.653 118.653 0 00.297 14.651c.504 6.11 1.453 11.363 2.664 14.172l.828-.449c-1.781-5.535-2.504-12.793-2.188-21.156.48-12.793 3.422-28.215 8.856-44.289 9.191-24.27 21.938-43.738 33.602-53.035-10.633 9.602-25.023 40.684-29.332 52.195-4.82 12.891-8.238 24.984-10.301 36.574 3.55-10.863 15.047-15.53 15.047-15.53s5.637-6.958 12.227-16.888c-3.95.903-10.43 2.442-12.598 3.352-3.2 1.344-4.067 1.8-4.067 1.8s10.371-6.312 19.27-9.171c12.234-19.27 25.562-46.648 12.141-58.621" fill="#003956"/></svg> SQL &amp; SQLite</a>
                  <a href="git.html" class="dropdown-item" role="menuitem"><svg class="menu-logo" viewBox="0 0 128 128" width="14" height="14" aria-hidden="true"><path fill="#F34F29" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"/></svg> Git</a>
                  <a href="markdown.html" class="dropdown-item" role="menuitem"><svg class="menu-logo" viewBox="0 0 128 128" width="14" height="14" fill="currentColor" aria-hidden="true"><path style="line-height:normal;font-variant-ligatures:normal;font-variant-position:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-alternates:normal;font-variant-east-asian:normal;font-feature-settings:normal;font-variation-settings:normal;text-indent:0;text-align:start;text-decoration-line:none;text-decoration-style:solid;text-decoration-color:#000;text-transform:none;text-orientation:mixed;white-space:normal;shape-padding:0;shape-margin:0;inline-size:0;isolation:auto;mix-blend-mode:normal;solid-color:#000;solid-opacity:1" d="M11.95 24.348c-5.836 0-10.618 4.867-10.618 10.681v57.942c0 5.814 4.782 10.681 10.617 10.681h104.102c5.835 0 10.617-4.867 10.617-10.681V35.03c0-5.814-4.783-10.681-10.617-10.681H14.898l-.002-.002H11.95zm-.007 9.543h104.108c.625 0 1.076.423 1.076 1.14v57.94c0 .717-.453 1.14-1.076 1.14H11.949c-.623 0-1.076-.423-1.076-1.14V35.029c0-.715.451-1.135 1.07-1.138z" color="#000" font-weight="400" font-family="sans-serif" overflow="visible"/><path d="M20.721 84.1V43.9H32.42l11.697 14.78L55.81 43.9h11.696v40.2H55.81V61.044l-11.694 14.78-11.698-14.78V84.1H20.722zm73.104 0L76.28 64.591h11.697V43.9h11.698v20.69h11.698zm0 0"/></svg> Markdown</a>
                </div>
              </div>
              <a href="neovim.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true"><path d="M2.5 5.2L7.3.5v23l-4.8-4.7V5.2z" fill="#16b0ed"/><path d="M16.7.5l4.8 4.7v13.6l-4.8 4.7V.5z" fill="#57a143"/><path d="M7.3.5l12 18.2-2.6 4.8L4.7 5.3 7.3.5z" fill="#7db643"/></svg> Neovim</a>
              <a href="macos.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg> macOS</a>
              <a href="windows.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="13" height="13" fill="#00a4ef" aria-hidden="true"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg> Windows</a>
              <a href="nvidia.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="15" height="15" fill="#76b900" aria-hidden="true"><path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4.01-1.952a6.016 6.016 0 0 0-.786.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.742-.035-1.104-.097v1.325c.292.035.6.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.98-.053v1.864H24V4.063zm0 10.326v1.166c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237h-.008c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.738 3.074M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936Z"/></svg> NVIDIA DC</a>
              <a href="infiniband.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><circle cx="5" cy="6" r="2.5" stroke="#38bdf8" stroke-width="1.8"/><circle cx="19" cy="6" r="2.5" stroke="#38bdf8" stroke-width="1.8"/><circle cx="5" cy="18" r="2.5" stroke="#4ade80" stroke-width="1.8"/><circle cx="19" cy="18" r="2.5" stroke="#4ade80" stroke-width="1.8"/><path d="M7.5 6h9M7.5 18h9M5 8.5v7M19 8.5v7M7 7.5l10 9M17 7.5l-10 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg> InfiniBand</a>
              <a href="switches.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="15" height="14" fill="none" aria-hidden="true"><path d="M1 8h1.5v8H1V8zm20.5 0H23v8h-1.5V8z" fill="currentColor" opacity="0.7"/><rect x="2.5" y="6" width="19" height="12" rx="1.5" fill="#0f172a" stroke="currentColor" stroke-width="1.6"/><circle cx="5.3" cy="9.5" r="1.1" fill="#22c55e"/><circle cx="5.3" cy="14.5" r="1.1" fill="#38bdf8"/><rect x="8.2" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="11.6" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="15" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="18.4" y="8" width="2" height="2.8" rx="0.4" fill="#22c55e"/><rect x="8.2" y="13.2" width="2.4" height="2.8" rx="0.4" fill="#22c55e"/><rect x="11.6" y="13.2" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="15" y="13.2" width="2.4" height="2.8" rx="0.4" fill="#22c55e"/><rect x="18.4" y="13.2" width="2" height="2.8" rx="0.4" fill="currentColor"/></svg> Switches</a>
              <a href="redfish.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 30 20" width="17" height="13" fill="none" aria-hidden="true"><path d="M.2 9.5C.3 8.8 1.8 7.8 5.5 4.7L11.6.5l3.6 2.6L17.9 1l3 2.3-2.4 1.9 2.2 1.7 5.4-4 3.3 2.6-5.3 4.3 5.3 4.3-3.3 2.6-5.4-4-2.2 1.7 2.4 1.9-3 2.3-2.7-2.1-3.6 2.6L.4 10.3l3.1.4L.2 9.5z" fill="#e11d48"/><circle cx="5.6" cy="6.6" r="1.95" fill="#fff"/><circle cx="5.6" cy="6.6" r="1" fill="#e11d48"/></svg> Redfish</a>
              <a href="ipmi.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7.5 12h2l1.5-3 2 6 1.5-3h2" stroke="#4ade80" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg> ipmitool</a>
              <a href="fiber.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2" y="8" width="7" height="8" rx="1.2" stroke="currentColor" stroke-width="1.8"/><path d="M9 10h3v4H9" stroke="currentColor" stroke-width="1.6"/><circle cx="14.5" cy="12" r="1.5" fill="#fbbf24"/><path d="M16 12h6M15.5 9.5l5.5-3.5M15.5 14.5l5.5 3.5" stroke="#22d3ee" stroke-width="1.8" stroke-linecap="round"/></svg> Fiber</a>
              <a href="ethernet.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="5" y="2" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 2v3.5M10.67 2v3.5M13.33 2v3.5M16 2v3.5" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/><path d="M9.5 8.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 12h8l-1 4.5H9L8 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 16.5V22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg> Ethernet</a>
              <a href="motherboards.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="2" stroke="currentColor" stroke-width="1.7"/><rect x="6.5" y="5.5" width="6" height="6" rx="0.8" stroke="#38bdf8" stroke-width="1.6"/><circle cx="9.5" cy="8.5" r="1.2" fill="#38bdf8"/><path d="M15.5 5.5v6M18 5.5v6" stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round"/><path d="M6 15h12M6 18h9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg> Motherboards</a>
            </nav>
          </div>
          <p class="brand-subtitle">${sec.subtitle}</p>
        </div>
      </div>

      <div class="header-actions">

        <button type="button" id="density-toggle" class="action-btn" title="Toggle compact density">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span id="density-label">Compact</span>
        </button>

        <button type="button" id="print-btn" class="action-btn" title="Print Cheat Sheet (Ctrl+P)">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"/>
          </svg>
          <span>Print</span>
        </button>

        <button type="button" id="theme-toggle" class="action-btn icon-only" title="Toggle dark/light theme" aria-label="Toggle theme">
          <svg id="theme-icon-sun" viewBox="0 0 24 24" width="16" height="16">
            <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/>
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
          </svg>
          <svg id="theme-icon-moon" viewBox="0 0 24 24" width="16" height="16" class="hidden">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </div>

  </header>

  <main class="container main-layout">
    <div id="sections-container" class="sections-grid">
      <!-- Populated dynamically -->
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden">
      <div class="empty-icon">404</div>
      <h3>No matching ${secName} commands found</h3>
      <p>Try searching for keywords or reset active filters.</p>
      <button type="button" id="reset-search-btn" class="action-btn">Reset Filters</button>
    </div>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <span>${sec.title} — Part of the Datacenter &amp; Developer Reference Suite</span>
      </div>
      <div class="footer-shortcuts">
        <span><kbd>Ctrl+K</kbd> Global Search</span>
        <span><kbd>/</kbd> In-Sheet Filter</span>
        <span><kbd>Esc</kbd> Clear</span>
        <span><kbd>Ctrl+P</kbd> Print Sheet</span>
      </div>
    </div>
  </footer>

  <div id="toast" class="toast" role="status" aria-live="polite">
    <span class="toast-check">&#10003;</span>
    <span id="toast-text">Copied to clipboard</span>
  </div>

  <script src="global-search-index.js"></script>
  <script src="common.js"></script>
  <script src="${sec.id}.js"></script>
</body>
</html>`;
}

// 6. Generate all 15 Linux sections
let generatedCount = 0;
for (const sec of CHEAT_SHEET_DATA) {
  const cards = buildLinuxSectionCards(sec);
  const jsContent = generateLinuxJs(sec, cards);
  const htmlContent = generateLinuxHtml(sec);

  fs.writeFileSync(path.join(__dirname, `${sec.id}.js`), jsContent, 'utf8');
  // Existing pages are authoritative for header/nav chrome; only create missing ones.
  if (!fs.existsSync(path.join(__dirname, `${sec.id}.html`))) fs.writeFileSync(path.join(__dirname, `${sec.id}.html`), htmlContent, 'utf8');
  generatedCount++;
}

console.log(`Generated all ${generatedCount} individual Linux pages and scripts successfully!`);
