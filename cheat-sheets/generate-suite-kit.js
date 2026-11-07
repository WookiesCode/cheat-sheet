// generate-suite-kit.js
// Shared builder for the menu-driven suites (BMC vendor tools, hardware reference, SRE
// toolkit): splits each section into cards, writes the sheet .js (data plus the same
// render/search/bookmark code the Editors and Grafana suites use), creates the .html page
// only when it is missing, and inserts the suite's menu before the Home link, where
// build-nav-groups.js picks it up and files it under its tab.
//
// Not a sheet: the generate- prefix keeps build-index.js and build-portable.js from
// treating it as one. Required by generate-bmc-tools-suite.js, generate-hw-reference-suite.js
// and generate-sre-suite.js.
const fs = require('fs');
const path = require('path');

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// New pages copy the nav from index.html.
const indexHtmlForNav = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

// 4. Split one section into cards: main command, extra flags, recipes, pro tip.
const isMultiline = s => /\n/.test(s || '');
function buildSectionCards(sec, suiteTags) {
  const cards = [];
  const baseTags = [...suiteTags, sec.id];
  sec.commands.forEach((cmd, cIdx) => {
    cards.push({
      id: `${sec.id}-cmd-${cIdx + 1}`,
      badge: sec.badge,
      title: `${sec.name}: ${cmd.desc.split('(')[0].split(':')[0].trim()}`,
      subtitle: cmd.desc,
      commands: [{
        id: cmd.id, desc: cmd.desc, cmd: cmd.cmd, details: cmd.details || '',
        flags: cmd.flags ? cmd.flags.slice(0, 3) : [], tip: cmd.tip || '',
        tags: [...baseTags, ...(cmd.tags || [])]
      }]
    });
    if (cmd.flags && cmd.flags.length > 3) {
      cards.push({
        id: `${sec.id}-flags-${cIdx + 1}`,
        badge: sec.badge,
        title: `${sec.name}: More options`,
        subtitle: `More options for: ${cmd.desc.split('(')[0].trim()}`,
        commands: [{
          id: `${cmd.id}-flags-card`,
          desc: `More options and gotchas for: ${cmd.desc.split('(')[0].trim()}`,
          cmd: cmd.cmd, hideCode: isMultiline(cmd.cmd),
          flags: cmd.flags.slice(3),
          tags: [...baseTags, 'flags', 'options', ...(cmd.tags || []).slice(0, 3)]
        }]
      });
    }
    if (cmd.subcommands && cmd.subcommands.length) {
      cards.push({
        id: `${sec.id}-recipes-${cIdx + 1}`,
        badge: sec.badge,
        title: `${sec.name}: Related commands`,
        subtitle: `Related commands for: ${cmd.desc.split('(')[0].trim()}`,
        commands: cmd.subcommands.map((sub, idx) => ({
          id: `${cmd.id}-sub-${idx + 1}`, desc: sub[1], cmd: sub[0],
          tags: [...baseTags, 'recipe', ...(cmd.tags || []).slice(0, 3)]
        }))
      });
    }
  });
  if (sec.proTip) {
    cards.push({
      id: `${sec.id}-pro-tips`,
      badge: 'tip',
      title: `${sec.name}: Pro Tip`,
      subtitle: sec.proTip.desc,
      commands: [{
        id: `${sec.id}-tips-card`, desc: sec.proTip.desc, cmd: sec.proTip.cmd,
        details: sec.proTip.details, flags: sec.proTip.flags, tip: sec.proTip.tip,
        tags: [...baseTags, 'tips', 'best-practice']
      }]
    });
  }
  return cards;
}

// 5. Sheet JS: data plus the shared render/search/bookmark code used by the other suites.
function generateSheetJs(varName, title, cards, fileKey, suiteName) {
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for ${suiteName}: ${title}
const ${varName} = ${jsonCards};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("${fileKey}_bookmarks") || "[]"); } catch (e) { return []; } })())
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
    /(^|\\s|;|&&|\\|\\||\\|)(sudo\\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\\|\\||&&|\\|)/g,
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
  const allCards = ${varName};
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

  for (const card of ${varName}) {
    if (state.activeCategory !== "all" && state.activeCategory !== card.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\\s+/)
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
      ].join("\\n");

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
      ].join("\\n");
    }).join("\\n");

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
    ].join("\\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\\n");
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
        localStorage.setItem("${fileKey}_bookmarks", JSON.stringify([...state.bookmarks]));
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
`;
}

// 6. HTML page. Mirrors the chrome of the current live sheets (theme menu, density
// toggle); common.js adds the header search pill, rail and tools at runtime.
function generateSheetHtml(o) {
  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(o.docTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="top-bar">
    <div class="container top-bar-inner">
      <div class="brand">
        <div class="terminal-badge" aria-hidden="true">
          <span class="prompt-symbol">${escapeHtml(o.prompt)}</span><span class="cursor-block">${escapeHtml(o.cursor)}</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(o.h1)}</h1>
            <span class="version-pill">${escapeHtml(o.pill)}</span>
            ${EXACT_NAVBAR}
          </div>
          <p class="brand-subtitle">${escapeHtml(o.subtitle)}</p>
        </div>
      </div>
      <div class="header-actions">
        <button
          type="button"
          id="density-toggle"
          class="action-btn"
          title="Toggle compact view (compact spacing)"
          aria-label="Toggle compact view"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <span id="density-label">Compact</span>
        </button>
        <div class="theme-menu-wrapper" id="theme-menu-wrapper">
          <button type="button" id="theme-palette-btn" class="action-btn theme-palette-btn" title="Select Color Theme" aria-haspopup="true" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.5-.7 1.5-1.5 0-.4-.2-.8-.4-1.1-.3-.4-.4-.8-.4-1.4 0-1.1.9-2 2-2h2.5c3.6 0 6.5-2.9 6.5-6.5C22 5.6 17.5 2 12 2z"></path>
            </svg>
            <span id="theme-btn-label">Theme</span>
            <svg class="dropdown-caret" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
        <button type="button" id="theme-toggle" style="display:none;" aria-hidden="true"></button>
      </div>
    </div>
  </header>
  <main class="container main-layout">
    <!-- Commands Container (Masonry Cards) -->
    <section id="sections-container" class="sections-container" aria-label="Command cards"></section>
    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden" role="status">
      <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M17 17l4 4M9 11h4"/>
      </svg>
      <h3>No matching ${escapeHtml(o.h1)} commands</h3>
      <p>Try searching with different keywords or clear active filters.</p>
    </div>
  </main>
  <!-- Toast Notification -->
  <div id="toast" class="toast" role="status" aria-live="polite">
    <span id="toast-text"></span>
  </div>
  <footer class="page-footer">
    <div class="container footer-inner">
      <span>${escapeHtml(o.h1)} Reference Cheat Sheet</span>
      <span>Press <kbd>/</kbd> to search &bull; Click any command to copy</span>
    </div>
  </footer>
  <script src="global-search-index.js"></script>
  <script src="common.js"></script>
  <script src="${o.fileKey}.js"></script>
</body>
</html>
`;
}


// Menu: one column per group, official logo per sheet. The id must be listed in
// build-nav-groups.js SUITES so the menu is filed under its tab.
function menuSnippet(o) {
  const col = g => `                    <div class="ed-dropdown-col">
                      <div class="ed-dropdown-heading">${g.heading}</div>
${o.sections.filter(s => s.group === g.key).map(s => `                      <a href="${s.file}.html" class="dropdown-item" role="menuitem">${o.logos[s.id] || ''} <code>${s.code}</code> <span class="cmd-desc">${escapeHtml(s.name)}: ${escapeHtml(s.navDesc)}</span></a>`).join('\n')}
                    </div>`;
  return `<div class="nav-dropdown" id="${o.menuId}">
                <a href="${o.hubFile}.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  ${o.menuIcon}
                  <span>${o.name}</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu ed-dropdown-menu" role="menu">
                  <a href="${o.hubFile}.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 ${escapeHtml(o.hubLabel)}</a>
                  <div class="dropdown-divider"></div>
                  <div class="ed-dropdown-grid">
${o.groups.map(col).join('\n')}
                  </div>
                </div>
              </div>
              `;
}

// Insert (or replace) the menu in every page, before the Home link.
function insertMenu(menuId, snippet) {
  const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'datacenter-cheatsheet-portable.html');
  const existing = new RegExp(`<div class="nav-dropdown" id="${menuId}">[\\s\\S]*?<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*<\\/div>\\s*`);
  const homeLink = /<a href="index\.html" class="sheet-link nav-home(?: active)?">/;
  let updated = 0;
  const missing = [];
  for (const file of htmlFiles) {
    const p = path.join(__dirname, file);
    let content = fs.readFileSync(p, 'utf8');
    if (!/<nav class="sheet-switcher"/.test(content)) continue;
    const before = content;
    if (existing.test(content)) content = content.replace(existing, snippet);
    else if (homeLink.test(content)) content = content.replace(homeLink, m => snippet + m);
    else { missing.push(file); continue; }
    if (content !== before) { fs.writeFileSync(p, content, 'utf8'); updated++; }
  }
  console.log(`${menuId}: menu written into ${updated} sheet(s)` + (missing.length ? `; no insertion point in: ${missing.join(', ')}` : ''));
}

// Build a whole suite: menu, one sheet per section, and a hub with every card.
function buildSuite(o) {
  const snippet = menuSnippet(o);
  insertMenu(o.menuId, snippet);
  // Pages created this run need the menu too, so write pages first, then insert again.
  const writeSheet = (fileKey, varName, title, cards, page) => {
    fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), generateSheetJs(varName, title, cards, fileKey, o.name), 'utf8');
    const htmlPath = path.join(__dirname, `${fileKey}.html`);
    if (!fs.existsSync(htmlPath)) fs.writeFileSync(htmlPath, generateSheetHtml({ ...page, fileKey }), 'utf8');
    console.log(`${fileKey}.js (${cards.length} cards)`);
  };
  const allCards = [];
  for (const sec of o.sections) {
    const cards = buildSectionCards(sec, o.tags);
    allCards.push(...cards);
    writeSheet(sec.file, `${o.varPrefix}_${sec.file.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`, sec.title, cards, {
      docTitle: `${o.name}: ${sec.name} — ${sec.title}`,
      prompt: o.prompt, cursor: o.cursor, h1: sec.name, pill: sec.pill, subtitle: sec.subtitle
    });
  }
  writeSheet(o.hubFile, `${o.varPrefix}_HUB_DATA`, o.hubTitle, allCards, {
    docTitle: o.hubDocTitle, prompt: o.prompt, cursor: o.cursor, h1: o.name, pill: o.hubPill, subtitle: o.hubSubtitle
  });
  insertMenu(o.menuId, snippet);
  console.log(`${o.name}: ${o.sections.length} sheets + hub.`);
}

module.exports = { buildSuite, escapeHtml };
