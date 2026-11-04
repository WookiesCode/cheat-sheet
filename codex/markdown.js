const MARKDOWN_DATA = [
  {
    "id": "md-basics",
    "badge": "MD",
    "title": "Text & Structure",
    "subtitle": "Core Markdown syntax for readable notes and runbooks",
    "commands": [
      {
        "id": "md-headings",
        "desc": "Headings and document outline",
        "cmd": "# Incident summary\n## Evidence\n### GPU telemetry",
        "details": "Use one # heading for the document title, then descend one level at a time. A space after the # characters is required by CommonMark. Keep a blank line around headings for portability.",
        "tags": [
          "markdown",
          "heading",
          "outline"
        ]
      },
      {
        "id": "md-paragraphs",
        "desc": "Paragraphs and line breaks",
        "cmd": "First paragraph.\n\nSecond paragraph.\n\nLine one  \nLine two",
        "details": "A blank line starts a new paragraph. Two trailing spaces make a hard line break, but are easy to miss in review; use separate paragraphs when possible.",
        "tags": [
          "markdown",
          "paragraph",
          "line break"
        ]
      },
      {
        "id": "md-emphasis",
        "desc": "Bold, italic, and inline code",
        "cmd": "**Critical** GPU fault\n*Investigating* fabric state\nRun `nvidia-smi -q`",
        "details": "Use ** for strong emphasis, * for emphasis, and backticks for literal commands, paths, identifiers, and output. Keep punctuation outside code spans unless it is part of the literal text.",
        "tags": [
          "markdown",
          "bold",
          "italic",
          "inline code"
        ]
      },
      {
        "id": "md-escape",
        "desc": "Show Markdown characters literally",
        "cmd": "\\*literal asterisks\\*\n\\# not a heading\nUse `*` for a wildcard",
        "details": "Backslash escapes punctuation in normal Markdown text. An inline code span is often clearer for syntax characters. Backslashes do not escape content inside fenced code blocks.",
        "tags": [
          "markdown",
          "escape",
          "literal"
        ]
      }
    ]
  },
  {
    "id": "md-lists",
    "badge": "MD",
    "title": "Lists & Tasks",
    "subtitle": "Action steps and technician checklists",
    "commands": [
      {
        "id": "md-bullets",
        "desc": "Unordered and numbered lists",
        "cmd": "- Check BMC SEL\n- Capture GPU telemetry\n\n1. Identify the failed device\n2. Map BDF to physical slot",
        "details": "Use a blank line before a list following a paragraph. Start each item with a marker and a space. Numbered lists express sequence; bullets group peers.",
        "tags": [
          "markdown",
          "list",
          "ordered",
          "bullet"
        ]
      },
      {
        "id": "md-nested",
        "desc": "Nested list with supporting detail",
        "cmd": "- GPU 3\n  - BDF: `0000:8a:00.0`\n  - UUID: `GPU-...`\n- GPU 4\n  - Healthy",
        "details": "Indent child bullets beneath the parent item, typically two spaces for a one-character bullet marker. Keep indentation consistent to avoid unexpected list structure.",
        "tags": [
          "markdown",
          "nested list",
          "indent"
        ]
      },
      {
        "id": "md-tasks",
        "desc": "Checklist items for a handoff",
        "cmd": "- [x] Capture SEL\n- [x] Map GPU UUID to BDF\n- [ ] Inspect physical module\n- [ ] Attach logs to ticket",
        "details": "Task checkboxes are a GitHub Flavored Markdown extension, not core CommonMark. Use x for checked and a space for unchecked. Rendering and editability vary by platform.",
        "tags": [
          "markdown",
          "gfm",
          "task list",
          "checklist"
        ]
      }
    ]
  },
  {
    "id": "md-links",
    "badge": "MD",
    "title": "Links & Images",
    "subtitle": "Point to evidence and keep paths reviewable",
    "commands": [
      {
        "id": "md-link",
        "desc": "Inline and reference links",
        "cmd": "[Playbook](../docs/playbooks/gpu-nvlink.md)\n[Vendor guide][vendor]\n\n[vendor]: https://example.com/guide",
        "details": "Relative links work within a repository when the destination moves with it. Reference links keep long URLs out of prose. Check whether the target viewer supports local paths.",
        "tags": [
          "markdown",
          "link",
          "reference",
          "relative path"
        ]
      },
      {
        "id": "md-image",
        "desc": "Image with useful alternate text",
        "cmd": "![Front panel showing OSFP cage 4](images/osfp-cage-4.jpg)",
        "details": "Alt text should describe the image's useful content. A relative image path is resolved from the Markdown file. Do not embed credentials or sensitive labels in images before sharing.",
        "tags": [
          "markdown",
          "image",
          "alt text"
        ]
      },
      {
        "id": "md-autolink",
        "desc": "Autolinks and email addresses",
        "cmd": "<https://example.com/runbook>\n<team@example.com>",
        "details": "Angle brackets make explicit autolinks in CommonMark. Bare URLs are recognized by some renderers, including GitHub Flavored Markdown, but are less portable.",
        "tags": [
          "markdown",
          "autolink",
          "url"
        ]
      }
    ]
  },
  {
    "id": "md-evidence",
    "badge": "MD",
    "title": "Code & Evidence",
    "subtitle": "Preserve exact commands and diagnostic output",
    "commands": [
      {
        "id": "md-fence",
        "desc": "Fenced command block with language",
        "cmd": "```bash\nnvidia-smi -q\n```",
        "details": "Put the opening and closing fences on their own lines. The language hint enables syntax highlighting where supported. A Markdown code fence shows text; it never executes it.",
        "tags": [
          "markdown",
          "fence",
          "code block",
          "bash"
        ]
      },
      {
        "id": "md-output",
        "desc": "Separate command from captured output",
        "cmd": "```text\nGPU 3: Xid 79 at 2026-11-03T14:22:00Z\n```",
        "details": "Use text for raw output so highlighting does not reinterpret it. Keep timestamps, device identifiers, and error wording intact when recording evidence; sanitize credentials before sharing.",
        "tags": [
          "markdown",
          "output",
          "logs",
          "evidence"
        ]
      },
      {
        "id": "md-quote",
        "desc": "Quote an observation or ticket excerpt",
        "cmd": "> Technician observed link LED dark on OSFP cage 4.\n> No cable swap performed yet.",
        "details": "The > marker distinguishes quoted source material from your own diagnosis. Attribute the source and time in surrounding prose when they matter.",
        "tags": [
          "markdown",
          "blockquote",
          "quote"
        ]
      },
      {
        "id": "md-rule",
        "desc": "Separate major sections",
        "cmd": "## Observations\n\n...\n\n---\n\n## Next actions",
        "details": "Three hyphens on their own line make a thematic break. Leave blank lines around it. Use headings for structure; use rules sparingly.",
        "tags": [
          "markdown",
          "horizontal rule",
          "section"
        ]
      }
    ]
  },
  {
    "id": "md-gfm",
    "badge": "GFM",
    "title": "Tables & GitHub Extensions",
    "subtitle": "Compact comparisons and repository documentation",
    "commands": [
      {
        "id": "md-table",
        "desc": "Compare devices in a table",
        "cmd": "| Device | BDF | State |\n| :--- | :---: | ---: |\n| GPU 3 | `0000:8a:00.0` | Fault |\n| GPU 4 | `0000:8b:00.0` | OK |",
        "details": "Tables are a GitHub Flavored Markdown extension. The separator row is required; colons set left, center, or right alignment. Tables are best for short single-line cells.",
        "tags": [
          "markdown",
          "gfm",
          "table",
          "alignment"
        ]
      },
      {
        "id": "md-strike",
        "desc": "Mark superseded text",
        "cmd": "~~Suspected cable fault~~\nConfirmed transceiver fault after A/B swap.",
        "details": "Strikethrough with ~~ is a GitHub Flavored Markdown extension. For incident records, state when and why a conclusion changed rather than relying on strikethrough alone.",
        "tags": [
          "markdown",
          "gfm",
          "strikethrough"
        ]
      },
      {
        "id": "md-footnote",
        "desc": "Add a footnote when the renderer supports it",
        "cmd": "BER exceeded the site threshold.[^threshold]\n\n[^threshold]: See the local fabric acceptance criteria.",
        "details": "Footnotes are supported by GitHub and some other renderers, but are outside core CommonMark. Use a plain link or nearby note when portability matters.",
        "tags": [
          "markdown",
          "footnote",
          "gfm"
        ]
      }
    ]
  },
  {
    "id": "md-github",
    "badge": "GFM",
    "title": "GitHub Features",
    "subtitle": "Renderer-specific tools for longer technical notes",
    "commands": [
      {
        "id": "md-alert",
        "desc": "Call out a note or warning in GitHub",
        "cmd": "> [!NOTE]\n> Link counters were sampled after the cable swap.\n\n> [!WARNING]\n> Obtain approval before resetting the GPU.",
        "details": "GitHub alert syntax is not core CommonMark. Other viewers may show it as an ordinary block quote. Keep the key instruction in the text itself.",
        "tags": [
          "markdown",
          "github",
          "alert",
          "warning"
        ]
      },
      {
        "id": "md-details",
        "desc": "Collapse a long log excerpt on GitHub",
        "cmd": "<details>\n<summary>SEL excerpt</summary>\n\n```text\n2026-11-03 14:22:00 PSU failure\n```\n\n</details>",
        "details": "GitHub supports HTML details and summary elements. Blank lines around the Markdown block inside are needed for reliable rendering. Some viewers sanitize or ignore inline HTML.",
        "tags": [
          "markdown",
          "github",
          "details",
          "logs"
        ]
      },
      {
        "id": "md-mermaid",
        "desc": "Draw a small path diagram where Mermaid is supported",
        "cmd": "```mermaid\nflowchart LR\n  GPU --> HCA --> Switch\n```",
        "details": "Mermaid diagrams render on GitHub and some other platforms, but are not part of CommonMark. Include a text description when the path must remain clear in plain-text viewers.",
        "tags": [
          "markdown",
          "mermaid",
          "diagram",
          "github"
        ]
      },
      {
        "id": "md-heading-links",
        "desc": "Link to a heading in the same document",
        "cmd": "[Jump to evidence](#evidence)\n\n## Evidence",
        "details": "GitHub creates heading fragments from heading text. Fragment rules differ among renderers and duplicate headings can get numbered suffixes; test links in the target viewer.",
        "tags": [
          "markdown",
          "heading",
          "anchor",
          "link"
        ]
      }
    ]
  },
  {
    "id": "md-templates",
    "badge": "MD",
    "title": "Incident Templates",
    "subtitle": "Reusable structure for case notes and runbooks",
    "commands": [
      {
        "id": "md-case-template",
        "desc": "Start a hardware incident summary",
        "cmd": "# Incident: node-a GPU 3\n\n## Symptom\n\n## Safety state\n- Scheduler: drained / active / unknown\n- GPU processes: none / present / unknown\n\n## Evidence\n- GPU UUID / BDF / physical module:\n- Timestamped logs:\n\n## Hypothesis and next action\n\n## Timeline",
        "details": "Record exact identifiers, timestamps, and safety state before proposing intrusive diagnostics. Use unknown until verified; do not present placeholders as findings.",
        "tags": [
          "markdown",
          "incident",
          "template",
          "summary"
        ]
      },
      {
        "id": "md-runbook-template",
        "desc": "Outline a maintenance runbook",
        "cmd": "# Procedure: replace OSFP module\n\n## Scope and prerequisites\n\n## Safety and approval checks\n\n## Steps\n1. Record port and transceiver IDs.\n2. Capture baseline telemetry.\n\n## Verification\n\n## Rollback and escalation",
        "details": "A runbook should name the target, prerequisites, approval point, expected result, and rollback. The sample is only an outline; it does not authorize physical or network changes.",
        "tags": [
          "markdown",
          "runbook",
          "template",
          "maintenance"
        ]
      },
      {
        "id": "md-frontmatter",
        "desc": "Add YAML metadata for a supporting tool",
        "cmd": "---\ntitle: GPU NVLink triage\nowner: datacenter-ops\nstatus: draft\n---\n\n# GPU NVLink triage",
        "details": "YAML front matter is a convention used by static site generators and note apps, not core Markdown. Check the receiving tool's schema and quote values when YAML syntax requires it.",
        "tags": [
          "markdown",
          "yaml",
          "front matter",
          "metadata"
        ]
      }
    ]
  },
  {
    "id": "md-tools",
    "badge": "MD",
    "title": "Preview & Validation",
    "subtitle": "Check Markdown before sharing it",
    "commands": [
      {
        "id": "md-heading-list",
        "desc": "List headings in a Markdown file",
        "cmd": "rg -n '^#{1,6} ' summary.md",
        "details": "A quick plain-text outline. This can also match headings inside fenced code blocks; use a Markdown-aware parser if exact structure matters.",
        "tags": [
          "markdown",
          "ripgrep",
          "heading",
          "outline"
        ]
      },
      {
        "id": "md-lint",
        "desc": "Lint Markdown with an installed CLI",
        "cmd": "markdownlint-cli2 summary.md",
        "details": "Run when markdownlint-cli2 is installed. Its rules depend on local configuration; fix or intentionally configure reported style issues before publishing.",
        "tags": [
          "markdown",
          "lint",
          "cli",
          "format"
        ]
      },
      {
        "id": "md-convert",
        "desc": "Convert Markdown to HTML with Pandoc",
        "cmd": "pandoc summary.md -f gfm -t html -o summary.html",
        "details": "Requires Pandoc. This writes summary.html and may not reproduce every GitHub feature exactly. Review the output and avoid rendering untrusted HTML in privileged contexts.",
        "tags": [
          "markdown",
          "pandoc",
          "convert",
          "html"
        ]
      },
      {
        "id": "md-nested-fence",
        "desc": "Show a fenced block inside Markdown documentation",
        "cmd": "````markdown\n```bash\nnvidia-smi -q\n```\n````",
        "details": "Use an outer fence with more backticks than any inner fence. This preserves literal Markdown examples in a document without prematurely closing the outer block.",
        "tags": [
          "markdown",
          "fence",
          "nested",
          "documentation"
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
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("markdown_cs_bookmarks") || "[]"))
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
  const totalCommands = MARKDOWN_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} recipes)</option>`
  ];

  for (const section of MARKDOWN_DATA) {
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
      <select id="category-select" class="cat-select" aria-label="Filter by ${escapeHtml('Markdown')} section">
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

  for (const section of MARKDOWN_DATA) {
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
      localStorage.setItem("markdown_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
