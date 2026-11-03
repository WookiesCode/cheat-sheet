// Offline-only manual browser. No fetches, external assets, or command execution.
(function () {
  'use strict';
  let backdrop, list, search, category, fullText, content, title, metadata, count, notices, previousFocus, copyBtn;
  let currentId = '', oldOverflow = '', searchTimer;
  const data = () => window.OFFLINE_MANUALS;

  function selectManual(manual) {
    currentId = manual.id;
    title.textContent = manual.title;
    metadata.textContent = `${manual.category} · ${manual.version}\nCaptured ${manual.captured}\nSource: ${manual.source}`;
    content.textContent = manual.text;
    const reader = content.closest('.manual-reader');
    if (reader) reader.scrollTop = 0;
    notices.replaceChildren();
    const sourceDetails = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Original source and copyright notices';
    const sourceText = document.createElement('pre');
    sourceText.textContent = manual.originalSource;
    sourceDetails.append(summary, sourceText);
    notices.append(sourceDetails);
    const licenseDetails = document.createElement('details');
    const licenseSummary = document.createElement('summary');
    licenseSummary.textContent = 'Bundled license and attribution texts';
    licenseDetails.append(licenseSummary);
    // Populate long notices only when requested.
    licenseDetails.addEventListener('toggle', () => {
      if (!licenseDetails.open || licenseDetails.dataset.loaded) return;
      licenseDetails.dataset.loaded = 'true';
      const explanation = document.createElement('p');
      explanation.textContent = 'The original source identifies applicable terms. Shared license texts are included for reference; they do not change the license of a manual.';
      licenseDetails.append(explanation);
      for (const id of manual.notices) {
        const heading = document.createElement('h4');
        heading.textContent = id;
        const text = document.createElement('pre');
        text.textContent = data().notices[id] || 'See original source notices.';
        licenseDetails.append(heading, text);
      }
    });
    notices.append(licenseDetails);
    list.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.manualId === currentId)));
  }

  function renderList() {
    const tokens = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const matches = data().manuals.filter(manual => {
      if (category.value && category.value !== manual.category) return false;
      const haystack = [manual.name, manual.title, manual.category, ...(manual.aliases || []), fullText.checked ? manual.text : ''].join(' ').toLowerCase();
      return tokens.every(token => haystack.includes(token));
    });
    list.replaceChildren();
    count.textContent = `${matches.length} of ${data().manuals.length} manuals`;
    for (const manual of matches) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'manual-list-item';
      button.dataset.manualId = manual.id;
      button.textContent = manual.title;
      button.title = `${manual.category} — ${manual.version}`;
      button.setAttribute('aria-pressed', String(manual.id === currentId));
      button.addEventListener('click', () => selectManual(manual));
      list.append(button);
    }
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'manual-empty';
      empty.textContent = 'No bundled manual matches. Try fewer words or enable full-text search. Coverage details are below.';
      list.append(empty);
    }
    if (matches.length && !matches.some(manual => manual.id === currentId)) selectManual(matches[0]);
  }

  function close() {
    if (!backdrop || backdrop.hidden) return;
    clearTimeout(searchTimer);
    backdrop.hidden = true;
    document.body.style.overflow = oldOverflow;
    previousFocus?.focus();
  }

  function init() {
    if (backdrop) return;
    backdrop = document.createElement('div');
    backdrop.id = 'offline-manuals-modal';
    backdrop.className = 'manual-backdrop';
    backdrop.hidden = true;
    backdrop.innerHTML = `
      <section class="manual-dialog" role="dialog" aria-modal="true" aria-labelledby="manual-library-title">
        <header class="manual-header">
          <div><h2 id="manual-library-title">Offline manuals</h2><p>Full text stored in this document. No internet needed.</p></div>
          <div style="display:flex;gap:0.5rem;align-items:center;">
            <button type="button" class="action-btn" id="manual-copy-btn" aria-label="Copy manual text" title="Copy full manual text">Copy</button>
            <button type="button" class="action-btn" id="manual-close" aria-label="Close offline manuals">Close ✕</button>
          </div>
        </header>
        <div class="manual-toolbar">
          <label class="manual-search-label">Search manuals<input id="manual-search" type="search" placeholder="Command, e.g. ipmitool, nvme, ssh…" autocomplete="off"></label>
          <label>Category<select id="manual-category"><option value="">All categories</option></select></label>
          <label class="manual-fulltext-label"><input id="manual-fulltext" type="checkbox"> Search full text</label>
          <span id="manual-count" role="status"></span>
        </div>
        <div class="manual-layout">
          <nav id="manual-list" aria-label="Bundled manuals"></nav>
          <article class="manual-reader" tabindex="0" aria-label="Selected manual">
            <h3 id="manual-title"></h3><p id="manual-metadata"></p>
            <pre id="manual-content"></pre><div id="manual-notices"></div>
          </article>
        </div>
        <details class="manual-coverage"><summary>Coverage and versions</summary><ul id="manual-coverage-list"></ul></details>
      </section>`;
    document.body.append(backdrop);
    list = document.getElementById('manual-list');
    search = document.getElementById('manual-search');
    category = document.getElementById('manual-category');
    fullText = document.getElementById('manual-fulltext');
    content = document.getElementById('manual-content');
    title = document.getElementById('manual-title');
    metadata = document.getElementById('manual-metadata');
    count = document.getElementById('manual-count');
    notices = document.getElementById('manual-notices');
    copyBtn = document.getElementById('manual-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        if (!content.textContent) return;
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(content.textContent);
          } else {
            const ta = document.createElement('textarea');
            ta.value = content.textContent;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
          }
          const orig = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = orig; }, 1500);
        } catch (err) {
          console.error('Failed to copy manual text:', err);
        }
      });
    }
    for (const name of [...new Set(data().manuals.map(manual => manual.category))].sort()) {
      const option = document.createElement('option');
      option.value = name; option.textContent = name; category.append(option);
    }
    for (const note of data().coverageNotes) {
      const item = document.createElement('li'); item.textContent = note;
      document.getElementById('manual-coverage-list').append(item);
    }
    document.getElementById('manual-close').addEventListener('click', close);
    backdrop.addEventListener('click', event => { if (event.target === backdrop) close(); });
    search.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(renderList, 120); });
    category.addEventListener('change', renderList);
    fullText.addEventListener('change', renderList);
    backdrop.addEventListener('keydown', event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
      if (event.key === 'Tab') {
        const focusable = [...backdrop.querySelectorAll('button, input, select, summary, [tabindex="0"]')]
          .filter(element => !element.disabled && !element.closest('details:not([open]) > :not(summary)'));
        const first = focusable[0], last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  function open(query) {
    if (!data()?.manuals?.length) return;
    init();
    if (backdrop.hidden) {
      previousFocus = document.activeElement;
      oldOverflow = document.body.style.overflow;
    }
    backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
    if (typeof query === 'string') search.value = query;
    renderList();
    search.focus();
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'm' || event.key === 'M') {
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || document.activeElement?.isContentEditable) return;
      if (backdrop && !backdrop.hidden) {
        close();
      } else if (data()?.manuals?.length) {
        event.preventDefault();
        open();
      }
    }
  });

  document.addEventListener('DOMContentLoaded', () => {
    if (!data()?.manuals?.length || document.getElementById('offline-manuals-btn')) return;
    const actions = document.querySelector('.header-actions, .filter-actions');
    if (!actions) return;
    const button = document.createElement('button');
    button.type = 'button'; button.id = 'offline-manuals-btn'; button.className = 'action-btn';
    button.textContent = 'Manuals'; button.title = `${data().manuals.length} embedded offline manuals (Press 'm')`;
    button.addEventListener('click', () => open());
    actions.append(button);
  });
  window.OfflineManuals = {open, close};
})();
