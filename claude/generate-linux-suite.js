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
                <a href="index.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><path d="M12 2C8.8 2 7.2 4.3 7.2 7.2c0 1.4-.4 2.4-1.3 3.7-1.1 1.6-1.9 3.6-1.4 5.2.3.9 1.1 1.2 1.8.8.4 1.8 2.4 3.6 5.7 3.6s5.3-1.8 5.7-3.6c.7.4 1.5.1 1.8-.8.5-1.6-.3-3.6-1.4-5.2-.9-1.3-1.3-2.3-1.3-3.7C16.8 4.3 15.2 2 12 2z" fill="#1e293b" stroke="#94a3b8" stroke-width="1.2"/><ellipse cx="12" cy="14.5" rx="4.1" ry="5" fill="#f8fafc"/><circle cx="10.2" cy="6.5" r="1.4" fill="#fff"/><circle cx="13.8" cy="6.5" r="1.4" fill="#fff"/><circle cx="10.5" cy="6.6" r="0.7" fill="#0f172a"/><circle cx="13.5" cy="6.6" r="0.7" fill="#0f172a"/><path d="M9.6 8.3c1.3-.5 3.5-.5 4.8 0L12 10.6 9.6 8.3z" fill="#f59e0b"/><ellipse cx="8.5" cy="20.5" rx="2.6" ry="1.3" fill="#f59e0b"/><ellipse cx="15.5" cy="20.5" rx="2.6" ry="1.3" fill="#f59e0b"/></svg>
                  <span>Linux</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu linux-dropdown-menu" role="menu">
                  <a href="index.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Ubuntu Linux Hub</a>
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
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'datacenter-cheatsheet-portable.html' && f !== 'omarchy.html');
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
                  <a href="bash.html" class="dropdown-item" role="menuitem">🐚 Bash &amp; Shell</a>
                  <a href="python.html" class="dropdown-item" role="menuitem">🐍 Python</a>
                  <a href="javascript.html" class="dropdown-item" role="menuitem">⚡ JavaScript</a>
                  <a href="typescript.html" class="dropdown-item" role="menuitem">🔷 TypeScript</a>
                  <a href="powershell.html" class="dropdown-item" role="menuitem">💻 PowerShell</a>
                  <a href="lua.html" class="dropdown-item" role="menuitem">🌙 Lua</a>
                  <div class="dropdown-divider"></div>
                  <a href="json.html" class="dropdown-item" role="menuitem">📋 JSON &amp; jq</a>
                  <a href="yaml.html" class="dropdown-item" role="menuitem">📄 YAML &amp; yq</a>
                  <a href="toml.html" class="dropdown-item" role="menuitem">⚙️ TOML</a>
                  <div class="dropdown-divider"></div>
                  <a href="regex.html" class="dropdown-item" role="menuitem">🔤 Regex</a>
                  <a href="awk-sed.html" class="dropdown-item" role="menuitem">✂️ AWK &amp; Sed</a>
                  <a href="sql.html" class="dropdown-item" role="menuitem">🗄️ SQL &amp; SQLite</a>
                  <a href="git.html" class="dropdown-item" role="menuitem">🌿 Git</a>
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

      <div class="search-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"/>
        </svg>
        <input
          type="search"
          id="search-input"
          placeholder="Search ${secName} commands, flags, subcommands, syntax..."
          autocomplete="off"
          spellcheck="false"
          aria-label="Search ${secName} commands"
        />
        <kbd class="search-Shortcut" id="search-kbd">/</kbd>
      </div>

      <div class="header-actions">
        <button type="button" id="saved-filter-btn" class="action-btn" title="Show bookmarked commands">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Saved</span>
          <span id="saved-count" class="count-badge">0</span>
        </button>

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

    <div class="category-bar">
      <div class="container category-bar-inner">
        <nav class="category-tabs" id="category-tabs" aria-label="${secName} sections">
          <!-- Populated by JS -->
        </nav>
        <div class="stats-summary" id="stats-summary">
          Showing <strong id="visible-count">0</strong> recipes
        </div>
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
