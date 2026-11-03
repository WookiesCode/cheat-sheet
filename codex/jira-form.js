// Fill the on-page Jira examples without changing the source recipes.
// The portable build embeds this same script and form.
(function () {
  'use strict';
  const tokens = {
    project: 'PROJECT_KEY',
    site: 'SITE_ID',
    node: 'NODE_NAME',
    rack: 'RACK_ID',
    position: 'POSITION',
    serial: 'SERIAL_NUMBER',
    ticket: 'DC-123'
  };
  const storageKey = 'codex_jira_query_fields';
  let values = {};
  try { values = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch (_) {}
  const form = document.getElementById('jira-form');
  const container = document.getElementById('sections-container');
  if (!form || !container) return;

  function fill(template) {
    let query = template;
    for (const [field, token] of Object.entries(tokens)) {
      const raw = String(values[field] || '').trim();
      if (!raw) continue;
      // Quoted JQL phrases already surround most tokens. Escape their contents.
      const value = raw.replace(/[\\"]/g, char => '\\' + char);
      query = query.split(token).join(value);
    }
    return query;
  }

  function refresh() {
    const portable = Boolean(window.PortableNavigation);
    const onJira = !portable || location.hash.startsWith('#sheet-jira');
    form.hidden = !onJira;
    if (!onJira) return;
    for (const box of container.querySelectorAll('.cmd-code-box[data-cmd], .cmd-code-box[data-copy]')) {
      if (!box.dataset.jqlTemplate) box.dataset.jqlTemplate = box.dataset.cmd || box.dataset.copy;
      const query = fill(box.dataset.jqlTemplate);
      if (box.dataset.cmd !== undefined) box.dataset.cmd = query;
      if (box.dataset.copy !== undefined) box.dataset.copy = query;
      const code = box.querySelector('.cmd-code');
      if (code && code.textContent !== query) code.textContent = query;
    }
  }

  for (const field of Object.keys(tokens)) {
    const input = document.getElementById('jira-' + field);
    if (!input) continue;
    input.value = values[field] || '';
    input.addEventListener('input', () => {
      values[field] = input.value;
      try { localStorage.setItem(storageKey, JSON.stringify(values)); } catch (_) {}
      refresh();
    });
  }
  document.getElementById('jira-clear-btn')?.addEventListener('click', () => {
    values = {};
    for (const field of Object.keys(tokens)) document.getElementById('jira-' + field).value = '';
    try { localStorage.removeItem(storageKey); } catch (_) {}
    refresh();
  });
  // Search and bookmark filters rebuild cards. Refresh their displayed JQL too.
  new MutationObserver(refresh).observe(container, {childList: true, subtree: true});
  window.addEventListener('hashchange', refresh);
  window.JiraQueryForm = {refresh};
  refresh();
})();
