// common.js — Shared suite logic: Target Variables Bar, Global Search (Ctrl+K), Triage/RMA Modal & Deep Linking
(function() {
  'use strict';

  // Sheets read and write storage directly, so make it safe once here. If the browser
  // blocks storage, use a copy held in memory; if it's full, skip the write.
  function guardStorage() {
    ['localStorage', 'sessionStorage'].forEach(name => {
      try {
        window[name].getItem('dc_storage_probe');
      } catch (e) {
        const values = new Map();
        const memory = {
          getItem: key => (values.has(String(key)) ? values.get(String(key)) : null),
          setItem: (key, value) => { values.set(String(key), String(value)); },
          removeItem: key => { values.delete(String(key)); },
          clear: () => values.clear()
        };
        try { Object.defineProperty(window, name, { value: memory, configurable: true }); } catch (err) {}
      }
    });
    if (window.Storage) {
      const setItem = Storage.prototype.setItem;
      Storage.prototype.setItem = function(key, value) {
        try { setItem.call(this, key, value); } catch (e) {}
      };
    }
  }
  guardStorage();

  // Apply saved theme immediately on script execution to avoid flash of wrong theme
  try {
    const savedTheme = localStorage.getItem('linux_cs_theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  } catch(e) {}

  // -------------------------------------------------------------
  // 1. RACK TARGET VARIABLES SYSTEM
  // -------------------------------------------------------------
  const DEFAULT_TARGET_VARS = {
    bmc: '2001:db8:dc::50',
    user: 'ADMIN',
    iface: 'eno1',
    hca: 'mlx5_0',
    disk: '/dev/nvme0n1',
    gpu: '0'
  };

  function readStored(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  // The BMC password stays out of localStorage. Earlier versions stored it there,
  // so drop it from any saved state on load. It lives in sessionStorage instead,
  // so it follows you between pages and is gone when the tab closes.
  function readStoredVars() {
    let saved = {};
    try {
      const parsed = JSON.parse(readStored('dc_target_vars') || '{}');
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) saved = parsed;
    } catch (e) {}
    if ('pass' in saved) {
      delete saved.pass;
      try { localStorage.setItem('dc_target_vars', JSON.stringify(saved)); } catch (e) {}
    }
    return saved;
  }

  const PASS_KEY = 'dc_target_pass';

  function readSessionPass() {
    try { return sessionStorage.getItem(PASS_KEY) || ''; } catch (e) { return ''; }
  }

  function saveSessionPass(value) {
    try {
      if (value) sessionStorage.setItem(PASS_KEY, value);
      else sessionStorage.removeItem(PASS_KEY);
    } catch (e) {}
  }

  // Quote the password for where its placeholder sits, so characters like $ or `
  // reach the BMC literally instead of being interpreted by the shell.
  function quotePassword(pass, before) {
    const insideDoubleQuotes = ((before.split('\n').pop().match(/(^|[^\\])"/g) || []).length % 2) === 1;
    if (!insideDoubleQuotes) return `'${pass.replace(/'/g, `'\\''`)}'`;
    const value = before.endsWith('\\"') ? pass.replace(/[\\"]/g, '\\$&') : pass;
    return value.replace(/[\\"$`]/g, '\\$&');
  }

  const targetState = {
    pass: readSessionPass(),
    active: readStored('dc_vars_active') !== '0', // default enabled
    collapsed: readStored('dc_vars_collapsed') === '1',
    vars: Object.assign({}, DEFAULT_TARGET_VARS, readStoredVars())
  };

  function saveTargetState() {
    try {
      localStorage.setItem('dc_vars_active', targetState.active ? '1' : '0');
      localStorage.setItem('dc_vars_collapsed', targetState.collapsed ? '1' : '0');
      localStorage.setItem('dc_target_vars', JSON.stringify(targetState.vars));
    } catch (e) {}
  }

  // Hook clipboard to automatically substitute variables if active
  // Placeholders are uppercase on purpose: lowercase $disk or $hca is a script's
  // own variable, and $USER is the local login, so none of those are rewritten.
  function substituteVariables(text) {
    if (!targetState.active || !text) return { text, substituted: false, hasSecret: false };
    let result = text;

    const bmcVal = (targetState.vars.bmc || '').trim();
    if (bmcVal && bmcVal !== DEFAULT_TARGET_VARS.bmc) {
      const bmcRegex = /(\$BMC\b|\$\{BMC\}|\$BMC_IP\b|\$\{BMC_IP\}|<bmc[_-]ip>|<bmc_host>|2001:db8:dc::1|192\.168\.1\.120)/g;
      result = result.replace(bmcRegex, () => bmcVal);
    } else if (bmcVal) {
      result = result.replace(/(\$BMC\b|\$\{BMC\}|\$BMC_IP\b|\$\{BMC_IP\}|<bmc[_-]ip>|<bmc_host>)/g, () => bmcVal);
    }

    const userVal = (targetState.vars.user || '').trim();
    if (userVal) {
      result = result.replace(/(\$BMC_USER\b|\$\{BMC_USER\}|<bmc_user>)/g, () => userVal);
    }

    const ifaceVal = (targetState.vars.iface || '').trim();
    if (ifaceVal) {
      result = result.replace(/(\$IFACE\b|\$\{IFACE\}|<interface>|<iface>)/g, () => ifaceVal);
    }

    const hcaVal = (targetState.vars.hca || '').trim();
    if (hcaVal) {
      result = result.replace(/(\$HCA\b|\$\{HCA\}|<hca>)/g, () => hcaVal);
    }

    const diskVal = (targetState.vars.disk || '').trim();
    if (diskVal) {
      result = result.replace(/(\$DISK\b|\$\{DISK\}|<disk>|<device>)/g, () => diskVal);
    }

    const gpuVal = (targetState.vars.gpu || '').trim();
    if (gpuVal) {
      result = result.replace(/(\$GPU\b|\$\{GPU\}|<gpu>|<gpu_id>)/g, () => gpuVal);
    }

    // Last, so no other substitution can rewrite part of the password.
    let hasSecret = false;
    if (targetState.pass) {
      const passRegex = /(\$BMC_PASS\b|\$\{BMC_PASS\}|<bmc_pass>|<password>|<pass>)/g;
      result = result.replace(passRegex, (match, _group, offset, whole) => {
        hasSecret = true;
        return quotePassword(targetState.pass, whole.slice(0, offset));
      });
      // A leading space keeps the line out of history where HISTCONTROL ignores spaces.
      if (hasSecret && !result.startsWith(' ')) result = ' ' + result;
    }

    return { text: result, substituted: result !== text, hasSecret };
  }

  // Intercept navigator.clipboard.writeText so all sheets inherit variable substitution automatically!
  // navigator.clipboard is undefined on plain HTTP, so give every caller a fallback.
  function legacyCopy(text) {
    return new Promise((resolve, reject) => {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand('copy');
      area.remove();
      ok ? resolve() : reject(new Error('copy failed'));
    });
  }

  if (!navigator.clipboard) {
    try {
      Object.defineProperty(navigator, 'clipboard', { value: { writeText: legacyCopy }, configurable: true });
    } catch (e) {}
  }

  // Scripts and tickets must reach the clipboard exactly as written.
  let copyVerbatim = legacyCopy;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    copyVerbatim = originalWriteText;
    navigator.clipboard.writeText = function(text) {
      const { text: newText, substituted, hasSecret } = substituteVariables(text);
      if (hasSecret) {
        showGlobalToast('Substituted target variables, including the password. Clear your clipboard after use.');
      } else if (substituted) {
        showGlobalToast(`Substituted target variables! Copied: ${newText.length > 50 ? newText.slice(0, 50) + '…' : newText}`);
      }
      return originalWriteText(newText);
    };
  }

  function renderTargetVarsBar() {
    let container = document.getElementById('target-vars-container');
    if (!container) {
      container = document.createElement('section');
      container.id = 'target-vars-container';
      container.className = 'target-vars-wrapper';
      const categoryBar = document.querySelector('.category-bar');
      if (categoryBar && categoryBar.parentNode) {
        categoryBar.parentNode.insertBefore(container, categoryBar.nextSibling);
      } else {
        const header = document.querySelector('.top-bar');
        if (header && header.parentNode) {
          header.parentNode.insertBefore(container, header.nextSibling);
        }
      }
    }

    container.innerHTML = `
      <div class="container target-vars-inner ${targetState.collapsed ? 'is-collapsed' : ''}">
        <div class="target-vars-header">
          <div class="target-vars-title">
            <span class="target-badge">🎯 RACK TARGETS</span>
            <span class="target-subtitle">Live variables auto-substitute into all copyable commands</span>
          </div>
          <div class="target-vars-actions">
            <label class="target-toggle-label" title="Enable or disable live variable substitution on copy">
              <input type="checkbox" id="target-active-toggle" ${targetState.active ? 'checked' : ''} />
              <span class="toggle-text">Active</span>
            </label>
            <button type="button" id="target-reset-btn" class="target-tool-btn" title="Reset variables to defaults">Reset</button>
            <button type="button" id="target-collapse-btn" class="target-tool-btn" title="Toggle target bar">
              ${targetState.collapsed ? 'Expand ▾' : 'Collapse ▴'}
            </button>
          </div>
        </div>

        <div class="target-inputs-row ${targetState.collapsed ? 'hidden' : ''}">
          <div class="target-field">
            <label for="var-bmc"><span class="var-tag">$BMC</span> BMC IP/Host</label>
            <input type="text" id="var-bmc" spellcheck="false" autocomplete="off" value="${escapeHtml(targetState.vars.bmc)}" placeholder="2001:db8:dc::50" />
          </div>
          <div class="target-field">
            <label for="var-user"><span class="var-tag">$BMC_USER</span> BMC User</label>
            <input type="text" id="var-user" spellcheck="false" autocomplete="off" value="${escapeHtml(targetState.vars.user)}" placeholder="ADMIN" />
          </div>
          <div class="target-field">
            <label for="var-pass"><span class="var-tag">$BMC_PASS</span> BMC Password</label>
            <div class="password-input-wrapper">
              <input type="password" id="var-pass" spellcheck="false" autocomplete="new-password" placeholder="This tab only" title="Hidden, and cleared when this tab closes. Fills $BMC_PASS, &lt;password&gt; and &lt;pass&gt; when you copy. curl -K commands read ~/.bmc-curlrc, and ipmitool -E reads IPMITOOL_PASSWORD from your shell." />
              <button type="button" id="toggle-pass-visibility" class="password-toggle-btn" title="Show password" aria-label="Show password" aria-pressed="false">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>
          <div class="target-field">
            <label for="var-iface"><span class="var-tag">$IFACE</span> NIC</label>
            <input type="text" id="var-iface" spellcheck="false" autocomplete="off" value="${escapeHtml(targetState.vars.iface)}" placeholder="eno1" />
          </div>
          <div class="target-field">
            <label for="var-hca"><span class="var-tag">$HCA</span> IB/NIC HCA</label>
            <input type="text" id="var-hca" spellcheck="false" autocomplete="off" value="${escapeHtml(targetState.vars.hca)}" placeholder="mlx5_0" />
          </div>
          <div class="target-field">
            <label for="var-disk"><span class="var-tag">$DISK</span> NVMe / Disk</label>
            <input type="text" id="var-disk" spellcheck="false" autocomplete="off" value="${escapeHtml(targetState.vars.disk)}" placeholder="/dev/nvme0n1" />
          </div>
          <div class="target-field">
            <label for="var-gpu"><span class="var-tag">$GPU</span> GPU Index</label>
            <input type="text" id="var-gpu" spellcheck="false" autocomplete="off" value="${escapeHtml(targetState.vars.gpu)}" placeholder="0" />
          </div>
        </div>
      </div>
    `;

    // Attach listeners
    const activeToggle = document.getElementById('target-active-toggle');
    if (activeToggle) {
      activeToggle.addEventListener('change', (e) => {
        targetState.active = e.target.checked;
        saveTargetState();
        showGlobalToast(`Target variable substitutions: ${targetState.active ? 'ENABLED' : 'DISABLED'}`);
      });
    }

    const collapseBtn = document.getElementById('target-collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => {
        targetState.collapsed = !targetState.collapsed;
        saveTargetState();
        renderTargetVarsBar();
      });
    }

    const resetBtn = document.getElementById('target-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        targetState.vars = Object.assign({}, DEFAULT_TARGET_VARS);
        targetState.pass = '';
        saveSessionPass('');
        saveTargetState();
        renderTargetVarsBar();
        showGlobalToast('Target variables reset to defaults');
      });
    }

    const passInput = document.getElementById('var-pass');
    if (passInput) {
      passInput.value = targetState.pass;
      passInput.addEventListener('input', (e) => {
        targetState.pass = e.target.value;
        saveSessionPass(targetState.pass);
      });

      const toggleBtn = document.getElementById('toggle-pass-visibility');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          const reveal = passInput.type === 'password';
          passInput.type = reveal ? 'text' : 'password';
          const label = reveal ? 'Hide password' : 'Show password';
          toggleBtn.title = label;
          toggleBtn.setAttribute('aria-label', label);
          toggleBtn.setAttribute('aria-pressed', String(reveal));
        });
      }
    }

    ['bmc', 'user', 'iface', 'hca', 'disk', 'gpu'].forEach(key => {
      const el = document.getElementById(`var-${key}`);
      if (el) {
        el.addEventListener('input', (e) => {
          targetState.vars[key] = e.target.value;
          saveTargetState();
        });
      }
    });
  }

  // -------------------------------------------------------------
  // 2. GLOBAL SEARCH MODAL (Ctrl + K / Search All)
  // -------------------------------------------------------------
  let searchBackdrop = null;
  let searchInput = null;
  let searchResults = null;
  let searchCount = null;
  let searchActiveIndex = 0;
  let currentSearchResults = [];

  function initGlobalSearchModal() {
    if (document.getElementById('global-search-modal')) return;

    searchBackdrop = document.createElement('div');
    searchBackdrop.id = 'global-search-modal';
    searchBackdrop.className = 'global-search-backdrop hidden';
    searchBackdrop.innerHTML = `
      <div class="global-search-box" role="dialog" aria-modal="true" aria-label="Global Command Palette">
        <div class="palette-header">
          <svg class="palette-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="palette-search-input" placeholder="Search ${searchIndexSummary()} (e.g. 'xid 79', 'edac', 'dom', 'vpi')..." autocomplete="off" spellcheck="false" />
          <kbd class="palette-kbd">ESC</kbd>
        </div>
        <div class="palette-toolbar">
          <span id="palette-stats" class="palette-stats">Showing 0 matching commands</span>
          <span class="palette-hints">
            <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
            <span><kbd>Enter</kbd> Copy</span>
            <span><kbd>Click</kbd> Jump to sheet</span>
          </span>
        </div>
        <div id="palette-results" class="palette-results">
          <!-- Dynamic Items -->
        </div>
      </div>
    `;

    document.body.appendChild(searchBackdrop);
    searchInput = document.getElementById('palette-search-input');
    searchResults = document.getElementById('palette-results');
    searchCount = document.getElementById('palette-stats');

    // Close on backdrop click
    searchBackdrop.addEventListener('click', (e) => {
      if (e.target === searchBackdrop) {
        closeGlobalSearch();
      }
    });

    // Input search listener
    searchInput.addEventListener('input', () => {
      searchActiveIndex = 0;
      renderGlobalSearchResults(searchInput.value);
    });

    // Keydown listener for modal navigation
    searchBackdrop.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeGlobalSearch();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        movePaletteHighlight(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        movePaletteHighlight(-1);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeActivePaletteItem();
      }
    });
  }

  function openGlobalSearch(initialQuery = '') {
    initGlobalSearchModal();
    searchBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    searchInput.value = initialQuery;
    searchActiveIndex = 0;
    renderGlobalSearchResults(initialQuery);
    setTimeout(() => {
      searchInput.focus();
      if (initialQuery) searchInput.select();
    }, 40);
  }

  function closeGlobalSearch() {
    if (!searchBackdrop) return;
    searchBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function renderGlobalSearchResults(query) {
    if (!window.GLOBAL_SEARCH_INDEX || !searchResults) return;
    const cleanQuery = query.trim().toLowerCase();
    const tokens = cleanQuery.split(/\s+/).filter(Boolean);

    let matches = [];
    let totalMatches = 0;
    let sheetsMatched = 0;
    if (!tokens.length) {
      // Show default top picks across sheets
      matches = window.GLOBAL_SEARCH_INDEX.slice(0, 25);
      totalMatches = window.GLOBAL_SEARCH_INDEX.length;
      sheetsMatched = new Set(window.GLOBAL_SEARCH_INDEX.map(item => item.file)).size;
    } else {
      matches = window.GLOBAL_SEARCH_INDEX.filter(item => {
        const text = `${item.sName} ${item.sec} ${item.cmd} ${item.desc} ${item.tags} ${item.tip}`.toLowerCase();
        return tokens.every(token => text.includes(token));
      });
      totalMatches = matches.length;
      sheetsMatched = new Set(matches.map(item => item.file)).size;
      matches = matches.slice(0, 50); // limit to top 50 matches for fast DOM render
    }

    currentSearchResults = matches;
    searchCount.textContent = `${totalMatches} command${totalMatches === 1 ? '' : 's'} found across ${sheetsMatched} sheet${sheetsMatched === 1 ? '' : 's'}`;

    if (!matches.length) {
      searchResults.innerHTML = `
        <div class="palette-empty">
          <p>No commands matching "<strong>${escapeHtml(cleanQuery)}</strong>"</p>
          <span class="palette-empty-tip">Try searching for generic keywords like <code>dmesg</code>, <code>xid</code>, <code>pcie</code>, <code>ipmi</code>, <code>dom</code>, <code>vlan</code>, or <code>edac</code>.</span>
        </div>
      `;
      return;
    }

    searchResults.innerHTML = matches.map((item, idx) => {
      const isSelected = idx === searchActiveIndex;
      const sheetColor = getSheetColorClass(item.sName);
      const highlightedCmd = highlightMatches(item.cmd, tokens);
      const highlightedDesc = highlightMatches(item.desc, tokens);

      return `
        <div class="palette-item ${isSelected ? 'is-selected' : ''}" data-index="${idx}" data-file="${escapeHtml(item.file)}" data-id="${escapeHtml(item.id)}" data-cmd="${escapeHtml(item.cmd)}">
          <div class="palette-item-top">
            <span class="palette-sheet-badge ${sheetColor}">${escapeHtml(item.sName)}</span>
            <span class="palette-sec">${escapeHtml(item.sec)}</span>
            <span class="palette-action-hint">${item.noCopy ? 'Enter or Click to Open' : 'Enter to Copy • Click to Open'}</span>
          </div>
          <div class="palette-cmd-code">${highlightedCmd}</div>
          <div class="palette-desc">${highlightedDesc}</div>
        </div>
      `;
    }).join('');

    // Attach click listeners to results
    const items = searchResults.querySelectorAll('.palette-item');
    items.forEach((itemEl, idx) => {
      itemEl.addEventListener('mouseenter', () => {
        searchActiveIndex = idx;
        updatePaletteHighlightClasses();
      });

      itemEl.addEventListener('click', (e) => {
        const file = itemEl.dataset.file;
        const id = itemEl.dataset.id;
        const cmd = itemEl.dataset.cmd;

        // If target is copy or user wants to copy
        if (!currentSearchResults[idx].noCopy) {
          navigator.clipboard.writeText(firstCommand(cmd));
          showGlobalToast(`Copied command from ${itemEl.querySelector('.palette-sheet-badge').textContent}!`);
        }

        // If not already on this page, navigate to it with hash
        openSearchResult(file, id);
      });
    });
  }

  function movePaletteHighlight(delta) {
    if (!currentSearchResults.length) return;
    searchActiveIndex = (searchActiveIndex + delta + currentSearchResults.length) % currentSearchResults.length;
    updatePaletteHighlightClasses();
    const activeEl = searchResults.querySelector(`.palette-item[data-index="${searchActiveIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }

  function updatePaletteHighlightClasses() {
    const items = searchResults.querySelectorAll('.palette-item');
    items.forEach((el, idx) => {
      if (idx === searchActiveIndex) {
        el.classList.add('is-selected');
      } else {
        el.classList.remove('is-selected');
      }
    });
  }

  function executeActivePaletteItem() {
    if (!currentSearchResults.length) return;
    const item = currentSearchResults[searchActiveIndex];
    if (!item) return;

    if (!item.noCopy) {
      navigator.clipboard.writeText(firstCommand(item.cmd));
      showGlobalToast(`Copied command: ${item.cmd.slice(0, 40)}…`);
    }

    openSearchResult(item.file, item.id);
  }

  function openSearchResult(file, id) {
    // The portable build is one file, so sheet pages don't exist beside it.
    if (window.portableOpenSheet) {
      closeGlobalSearch();
      window.portableOpenSheet(file, id);
      return;
    }
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath !== file) {
      window.location.href = `${file}#${id}`;
    } else {
      closeGlobalSearch();
      scrollToCard(id);
    }
  }

  // Entries list alternatives joined by "   |   "; they are not a shell pipeline.
  function searchIndexSummary() {
    const index = window.GLOBAL_SEARCH_INDEX || [];
    return `${index.length.toLocaleString('en-US')} commands across ${new Set(index.map(item => item.file)).size} sheets`;
  }

  function firstCommand(cmd) {
    return String(cmd).split('   |   ')[0].trim();
  }

  function highlightMatches(text, tokens) {
    if (!text) return '';
    const valid = tokens.filter(Boolean).map(escapeRegex).sort((a, b) => b.length - a.length);
    if (!valid.length) return escapeHtml(text);
    // Match on raw text, then escape, so tokens can't hit entities or <mark> tags.
    const regex = new RegExp(`(${valid.join('|')})`, 'gi');
    return String(text).split(regex)
      .map((part, i) => (i % 2 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
      .join('');
  }

  // Index entries are named after their file, so group them by the nav menu they sit under.
  const SHEET_BADGES = [
    [/^(awk-sed|bash|git|javascript|json|lua|markdown|powershell|python|regex|scripting|sql|toml|typescript|yaml)$/, 'badge-scripting'],
    [/^(nv-|nvidia$)/, 'badge-nvidia'],
    [/^(ib-|infiniband$)/, 'badge-ib'],
    [/^(sw-|switches$)/, 'badge-switch'],
    [/^(mb-|motherboards$)/, 'badge-mb'],
    [/^(rf-|redfish$)/, 'badge-redfish'],
    [/^ipmi/, 'badge-ipmi'],
    [/^(fo-|fiber$)/, 'badge-fiber'],
    [/^(eth-|ethernet$)/, 'badge-eth'],
    [/^(nvim-|neovim$)/, 'badge-nvim'],
    [/^macos/, 'badge-mac'],
    [/^(win-|windows$)/, 'badge-win'],
    [/^omarchy$/, 'badge-omarchy'],
    [/^cli-tools$/, 'badge-cli']
  ];

  function getSheetColorClass(sheetName) {
    const match = SHEET_BADGES.find(([pattern]) => pattern.test(sheetName));
    return match ? match[1] : 'badge-linux';
  }

  // -------------------------------------------------------------
  // 3. AI NODE TRIAGE & RMA BUNDLE MODAL
  // -------------------------------------------------------------
  const TRIAGE_SCRIPT = `#!/usr/bin/env bash
# AI Data Center Node Diagnostics & RMA Triage Bundle
# Read-only, non-destructive script for 8-GPU AI nodes (HGX / SXM / ConnectX / DDR5)
set -uo pipefail

echo "=========================================================="
echo "    AI SERVER TRIAGE & HARDWARE HEALTH REPORT"
echo "    Date: $(date -u '+%Y-%m-%d %H:%M:%S UTC') | Host: $(hostname)"
echo "=========================================================="

echo -e "\\n[1/7] MOTHERBOARD, CHASSIS & BIOS FIRMWARE:"
sudo dmidecode -s system-product-name 2>/dev/null || echo "Model: Unknown"
echo -n "Chassis Serial: "; sudo dmidecode -s system-serial-number 2>/dev/null || true
echo -n "BIOS Version:   "; sudo dmidecode -s bios-version 2>/dev/null || true
echo -n "BIOS Date:      "; sudo dmidecode -s bios-release-date 2>/dev/null || true

echo -e "\\n[2/7] PREVIOUS BOOT CRASH RECORDS (ACPI BERT / APEI / GHES):"
KLOG_OK=1
KLOG=$(sudo dmesg -T 2>/dev/null) || KLOG_OK=0
if [ "$KLOG_OK" != 1 ] || [ -z "$KLOG" ]; then
  KLOG_OK=0
  echo "UNKNOWN: Could not read the kernel log. BERT/APEI and Xid checks did not run."
elif printf '%s\\n' "$KLOG" | grep -iE 'BERT|APEI|GHES' >/dev/null 2>&1; then
  printf '%s\\n' "$KLOG" | grep -iE 'BERT|APEI|GHES' | head -n 12
else
  echo "Clean: No ACPI BERT crash records found in dmesg."
fi

echo -e "\\n[3/7] MEMORY & EDAC HARDWARE COUNTERS:"
if command -v edac-util >/dev/null 2>&1; then
  edac-util -v 2>/dev/null || true
fi
if [ -d /sys/devices/system/edac/mc ]; then
  for mc in /sys/devices/system/edac/mc/mc*; do
    [ -d "$mc" ] || continue
    ce=$(cat "$mc/ce_count" 2>/dev/null || echo 0)
    ue=$(cat "$mc/ue_count" 2>/dev/null || echo 0)
    echo "$(basename $mc) -> Correctable Errors: $ce | Uncorrectable Errors: $ue"
  done
fi

echo -e "\\n[4/7] PCIE LINK DEGRADATION (LnkSta vs LnkCap width/speed mismatches):"
PCIE_RAW=$(sudo lspci -vv 2>/dev/null) || PCIE_RAW=""
if ! printf '%s\\n' "$PCIE_RAW" | grep -q 'LnkCap:'; then
  echo "UNKNOWN: Could not read PCIe link capabilities (lspci -vv needs root)."
else
  PCIE_REPORT=$(printf '%s\\n' "$PCIE_RAW" | awk '
    function field(line, re, skip) {
      return match(line, re) ? substr(line, RSTART + skip, RLENGTH - skip) : ""
    }
    /^[0-9a-f]+:[0-9a-f]+(:[0-9a-f]+)?\\.[0-9a-f] / { dev=$0; cs=""; cw="" }
    /LnkCap:/ { cs=field($0, "Speed [0-9.]+GT/s", 6); cw=field($0, "Width x[0-9]+", 7) }
    /LnkSta:/ {
      ss=field($0, "Speed [0-9.]+GT/s", 6); sw=field($0, "Width x[0-9]+", 7)
      if (cs == "" || cw == "" || ss == "" || sw == "" || sw + 0 == 0) next
      if (sw + 0 < cw + 0) tag="DEGRADED (width)"
      else if (ss + 0 < cs + 0) tag="DOWNSHIFTED (speed only; can be idle power saving)"
      else next
      print tag ": " substr(dev, 1, 45) "\\n   Cap: " cs " x" cw " -> Current: " ss " x" sw
    }
  ' | head -n 30)
  if [ -n "$PCIE_REPORT" ]; then
    printf '%s\\n' "$PCIE_REPORT"
  else
    echo "No PCIe link degradation detected."
  fi
fi

echo -e "\\n[5/7] NVIDIA GPU HEALTH, XIDS & ROW-REMAPS:"
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi --query-gpu=index,name,serial,uuid,temperature.gpu,power.draw,ecc.errors.uncorrected.volatile.total,ecc.errors.uncorrected.aggregate.total --format=csv,noheader || true
  echo -e "\\nPending & Uncorrectable Row Remap Status:"
  nvidia-smi --query-remapped-rows=gpu_uuid,remapped_due_to_uncorrectable,pending_remapped_due_to_uncorrectable,failure --format=csv 2>/dev/null || true
  echo -e "\\nRecent GPU Xids in dmesg:"
  if [ "$KLOG_OK" = 1 ]; then
    printf '%s\\n' "$KLOG" | grep -i "NVRM: Xid" | tail -n 8 || echo "No Xids found in kernel log."
  else
    echo "UNKNOWN: Kernel log unavailable, Xids not checked."
  fi
else
  echo "nvidia-smi not detected on this host."
fi

echo -e "\\n[6/7] INFINIBAND / ROCE FABRIC & OPTICAL DOM STATUS:"
if command -v ibstat >/dev/null 2>&1; then
  ibstat -s || true
  for hca in $(ibstat -l 2>/dev/null); do
    echo "--- HCA: $hca ---"
    sudo perfquery -C "$hca" -P 1 -x 2>/dev/null | grep -E 'PortRcvErrors|PortMulticastRcvPkts|SymbolErrorCounter|LinkErrorRecoveryCounter' || true
  done
else
  echo "InfiniBand / RDMA tools not present."
fi

echo -e "\\n[7/7] NVME STORAGE DRIVE HEALTH:"
if command -v nvme >/dev/null 2>&1; then
  for dev in /dev/nvme[0-9]*n[0-9]*; do
    [ -e "$dev" ] || continue
    case "$dev" in *n[0-9]*p[0-9]*) continue ;; esac
    echo -n "$dev: "
    sudo nvme smart-log "$dev" 2>/dev/null | grep -E 'critical_warning|temperature|media_errors|num_err_log_entries|available_spare' | tr '\\n' ' '
    echo ""
  done
else
  echo "nvme-cli not present."
fi

echo -e "\\n=========================================================="
echo "    TRIAGE COMPLETE — COPY OUTPUT TO RMA TICKET"
echo "=========================================================="
`;

  let triageBackdrop = null;

  function initTriageModal() {
    if (document.getElementById('triage-modal')) return;

    triageBackdrop = document.createElement('div');
    triageBackdrop.id = 'triage-modal';
    triageBackdrop.className = 'triage-modal-backdrop hidden';
    triageBackdrop.innerHTML = `
      <div class="triage-dialog" role="dialog" aria-modal="true" aria-label="AI Node Triage & RMA Bundle">
        <div class="triage-header">
          <div class="triage-title-group">
            <h3>🩺 AI Node Triage &amp; RMA Bundle</h3>
            <span class="triage-badge">Crash Cart &amp; Hardware RMA</span>
          </div>
          <button type="button" class="triage-close-btn" id="triage-close-x" aria-label="Close">✕</button>
        </div>

        <div class="triage-nav-tabs">
          <button type="button" class="triage-tab active" data-tab="script">1. Crash-Cart Diagnostic Script</button>
          <button type="button" class="triage-tab" data-tab="ticket">2. RMA Ticket Markdown Formatter</button>
        </div>

        <div class="triage-body">
          <!-- Tab 1: Script -->
          <div class="triage-tab-content active" id="tab-script">
            <p class="triage-lead">Run this read-only bash script on any suspect GPU server to capture BIOS, EDAC memory, PCIe link degradations, GPU Xids, and optical DOM metrics.</p>
            <div class="triage-code-wrap">
              <pre><code id="triage-script-code">${escapeHtml(TRIAGE_SCRIPT)}</code></pre>
            </div>
            <div class="triage-actions">
              <button type="button" id="copy-triage-script-btn" class="triage-primary-btn">
                <span>📋 Copy Triage One-Liner (base64)</span>
              </button>
              <button type="button" id="copy-triage-raw-btn" class="triage-secondary-btn">
                <span>Copy Full Shell Script</span>
              </button>
            </div>
          </div>

          <!-- Tab 2: Ticket Formatter -->
          <div class="triage-tab-content" id="tab-ticket">
            <div class="ticket-grid">
              <div class="ticket-form">
                <div class="ticket-row">
                  <div class="ticket-field">
                    <label>Chassis Serial Number *</label>
                    <input type="text" id="rma-serial" placeholder="e.g. 24S2019482X or SN-902341" />
                  </div>
                  <div class="ticket-field">
                    <label>Server Vendor / Model</label>
                    <input type="text" id="rma-model" placeholder="e.g. ASUS ESC N8-E11 / GIGABYTE G593" />
                  </div>
                </div>

                <div class="ticket-row">
                  <div class="ticket-field">
                    <label>Failing Subsystem</label>
                    <select id="rma-component">
                      <option value="NVIDIA GPU (SXM / PCIe / NVLink)">NVIDIA GPU (SXM / PCIe / NVLink)</option>
                      <option value="RAM DIMM (DDR5 / EDAC CE-UE)">RAM DIMM (DDR5 / EDAC CE-UE)</option>
                      <option value="InfiniBand / RoCE HCA / Transceiver">InfiniBand / RoCE HCA / Transceiver</option>
                      <option value="PCIe Switch / Riser / Degradation">PCIe Switch / Riser / Degradation</option>
                      <option value="NVMe SSD Drive (Critical Warning)">NVMe SSD Drive (Critical Warning)</option>
                      <option value="Motherboard / BMC / VRM / POST 0x94">Motherboard / BMC / VRM / POST 0x94</option>
                    </select>
                  </div>
                  <div class="ticket-field">
                    <label>Physical Silkscreen Slot / Locator</label>
                    <input type="text" id="rma-slot" placeholder="e.g. GPU 3 / DIMM_P0_A1 / Riser 2 Slot 1" />
                  </div>
                </div>

                <div class="ticket-field full-width">
                  <label>Error Details & Log Snippet (Paste dmesg / Xid / EDAC error)</label>
                  <textarea id="rma-log" rows="4" placeholder="e.g. NVRM: Xid 79: GPU has fallen off the bus... or EDAC MC0 CE on P0_MC0_DIMM_A0"></textarea>
                </div>
              </div>

              <div class="ticket-preview-pane">
                <div class="ticket-preview-header">
                  <span>Formatted Vendor RMA Markdown</span>
                  <button type="button" id="copy-rma-ticket-btn" class="triage-primary-btn compact">Copy Ticket</button>
                </div>
                <pre class="ticket-preview-box"><code id="rma-preview-text"></code></pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(triageBackdrop);

    // Event listeners
    document.getElementById('triage-close-x').addEventListener('click', closeTriageModal);
    triageBackdrop.addEventListener('click', (e) => {
      if (e.target === triageBackdrop) closeTriageModal();
    });

    // Tab switching
    const tabs = triageBackdrop.querySelectorAll('.triage-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.triage-tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(`tab-${target}`).classList.add('active');
        if (target === 'ticket') updateRmaPreview();
      });
    });

    // Copy script actions
    document.getElementById('copy-triage-raw-btn').addEventListener('click', () => {
      copyVerbatim(TRIAGE_SCRIPT);
      showGlobalToast('Copied raw Triage Shell Script to clipboard!');
    });

    document.getElementById('copy-triage-script-btn').addEventListener('click', () => {
      const b64 = btoa(unescape(encodeURIComponent(TRIAGE_SCRIPT)));
      const oneLiner = `echo "${b64}" | base64 -d | bash`;
      copyVerbatim(oneLiner);
      showGlobalToast('Copied base64 Triage One-Liner to clipboard!');
    });

    // RMA inputs live update
    ['rma-serial', 'rma-model', 'rma-component', 'rma-slot', 'rma-log'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateRmaPreview);
    });

    document.getElementById('copy-rma-ticket-btn').addEventListener('click', () => {
      const text = document.getElementById('rma-preview-text').textContent;
      copyVerbatim(text);
      showGlobalToast('Copied RMA Ticket Markdown to clipboard!');
    });

    updateRmaPreview();
  }

  function updateRmaPreview() {
    const serial = (document.getElementById('rma-serial')?.value || 'UNKNOWN_SERIAL').trim();
    const model = (document.getElementById('rma-model')?.value || 'AI Server (8-GPU)').trim();
    const comp = (document.getElementById('rma-component')?.value || 'NVIDIA GPU').trim();
    const slot = (document.getElementById('rma-slot')?.value || 'Slot / Port Not Specified').trim();
    const log = (document.getElementById('rma-log')?.value || 'Hardware fault verified via diagnostic triage script.').trim();

    const md = `### Hardware RMA Request: ${comp}
**Server Model:** ${model}
**Chassis Serial Number:** \`${serial}\`
**Faulty Subsystem:** ${comp}
**Physical Silkscreen Location:** \`${slot}\`
**Technician Verification:** Node Triage Diagnostic Script ran on host; error reproduced.

#### Diagnostic Failure Evidence:
\`\`\`text
${log}
\`\`\`

#### Action Requested:
* Please issue Advance Hardware Replacement (RMA) for the faulty ${comp} in physical location \`${slot}\`.
* Return packaging requested for return of defective unit.`;

    const el = document.getElementById('rma-preview-text');
    if (el) el.textContent = md;
  }

  function openTriageModal() {
    initTriageModal();
    triageBackdrop.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeTriageModal() {
    if (!triageBackdrop) return;
    triageBackdrop.classList.add('hidden');
    document.body.style.overflow = '';
  }

  // -------------------------------------------------------------
  // 4. HEADER INJECTIONS (Search All & Triage Buttons)
  // -------------------------------------------------------------
  function injectHeaderControls() {
    const actions = document.querySelector('.header-actions');
    if (!actions) return;

    if (!document.getElementById('global-search-btn')) {
      const searchBtn = document.createElement('button');
      searchBtn.type = 'button';
      searchBtn.id = 'global-search-btn';
      searchBtn.className = 'action-btn global-search-header-btn';
      searchBtn.title = 'Global Command Palette Across All 14 Sheets (Ctrl+K)';
      searchBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <span>Search All</span>
        <kbd class="header-kbd">^K</kbd>
      `;
      searchBtn.addEventListener('click', () => openGlobalSearch());
      actions.insertBefore(searchBtn, actions.firstChild);
    }

    if (!document.getElementById('triage-modal-btn')) {
      const triageBtn = document.createElement('button');
      triageBtn.type = 'button';
      triageBtn.id = 'triage-modal-btn';
      triageBtn.className = 'action-btn triage-header-btn';
      triageBtn.title = 'AI Node Triage & RMA Ticket Bundle';
      triageBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
        <span>Triage &amp; RMA</span>
      `;
      triageBtn.addEventListener('click', () => openTriageModal());
      const savedBtn = document.getElementById('saved-filter-btn');
      if (savedBtn) {
        actions.insertBefore(triageBtn, savedBtn);
      } else {
        actions.appendChild(triageBtn);
      }
    }

    if (!document.getElementById('manuals-btn')) {
      const manualsBtn = document.createElement('button');
      manualsBtn.type = 'button';
      manualsBtn.id = 'manuals-btn';
      manualsBtn.className = 'action-btn';
      manualsBtn.title = 'Search offline manuals (M)';
      manualsBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"></path>
          <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"></path>
        </svg>
        <span>Manuals</span>
      `;
      manualsBtn.addEventListener('click', () => openManuals());
      actions.appendChild(manualsBtn);
    }

    if (!document.getElementById('portable-link-btn') && !window.PORTABLE_SHEETS) {
      const portBtn = document.createElement('a');
      portBtn.id = 'portable-link-btn';
      portBtn.href = 'datacenter-cheatsheet-portable.html';
      portBtn.className = 'action-btn portable-header-link';
      portBtn.title = 'Download / Open 100% Offline Single-File Suite';
      portBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span>1-File Offline</span>
      `;
      actions.appendChild(portBtn);
    }

    setupThemeSelector();
  }

  // -------------------------------------------------------------
  // 4b. MULTI-COLOR THEME SELECTOR ENGINE
  // -------------------------------------------------------------
  const THEMES = [
    { id: 'dark', name: 'Cyber Dark', desc: 'Default obsidian slate & cyan', swatches: ['#0b0e14', '#111621', '#38bdf8', '#4ade80'] },
    { id: 'light', name: 'Clean Light', desc: 'Crisp daylight paper & azure', swatches: ['#f5f7fa', '#ffffff', '#0284c7', '#16a34a'] },
    { id: 'gemini', name: 'Gemini Spark', desc: 'Google Gemini cosmic indigo & violet', swatches: ['#090a12', '#101322', '#818cf8', '#c084fc'] },
    { id: 'claude', name: 'Claude Warm', desc: 'Warm charcoal & terracotta', swatches: ['#1f1e1d', '#262624', '#d97757', '#e8b48f'] },
    { id: 'codex', name: 'Codex Mint', desc: 'Charcoal & mint workspace', swatches: ['#141414', '#1c1c1c', '#8de8c2', '#ececec'] },
    { id: 'startrek', name: 'Star Trek', label: 'Star Trek', desc: 'Starship console orange & lilac', swatches: ['#000000', '#17131f', '#ff9900', '#cc99cc'] },
    { id: 'starwars', name: 'Star Wars', label: 'Star Wars', desc: 'Deep space black & crawl yellow', swatches: ['#05060a', '#14171f', '#ffe81f', '#5fb8ff'] },
    { id: 'nebius', name: 'Nebius Cloud', desc: 'AI cloud petrol navy & volt lime', swatches: ['#031422', '#062238', '#e0ff4f', '#614efa'] },
    { id: 'nord', name: 'Nord Frost', desc: 'Arctic cold & polar blue', swatches: ['#242933', '#2e3440', '#88c0d0', '#a3be8c'] },
    { id: 'dracula', name: 'Dracula Night', desc: 'High-contrast vampire purple & pink', swatches: ['#1e1f29', '#282a36', '#bd93f9', '#ff79c6'] },
    { id: 'catppuccin', name: 'Catppuccin Mocha', label: 'Catppuccin Mocha', desc: 'Soothing pastel mantle & mauve', swatches: ['#181825', '#1e1e2e', '#cba6f7', '#a6e3a1'] },
    { id: 'matrix', name: 'Matrix CRT', desc: 'Hacker phosphor green & terminal black', swatches: ['#030804', '#061408', '#00ff66', '#a3e635'] },
    { id: 'tokyonight', name: 'Tokyo Night', desc: 'Vibrant Shibuya neon cyan & violet', swatches: ['#16161e', '#1a1b26', '#7aa2f7', '#bb9af7'] },
    { id: 'solarized', name: 'Solarized Dark', label: 'Solarized Dark', desc: 'Low-contrast precision cyan & gold', swatches: ['#00212b', '#002b36', '#268bd2', '#b58900'] },
    { id: 'everforest', name: 'Everforest', label: 'Everforest', desc: 'Soft forest green & sage', swatches: ['#232a2e', '#2d353b', '#a7c080', '#85beb7'] },
    { id: 'gruvbox', name: 'Gruvbox Dark', label: 'Gruvbox Dark', desc: 'Warm retro browns & cream', swatches: ['#1d2021', '#282828', '#fabd2f', '#88a99c'] },
    { id: 'rosepine', name: 'Rosé Pine', label: 'Rosé Pine', desc: 'Muted dusk purple & rose', swatches: ['#191724', '#1f1d2e', '#ebbcba', '#c4a7e7'] },
    { id: 'kanagawa', name: 'Kanagawa', label: 'Kanagawa', desc: 'Faded ink blue & parchment', swatches: ['#16161d', '#1f1f28', '#83a0da', '#83a0da'] },
    { id: 'zenburn', name: 'Zenburn', label: 'Zenburn', desc: 'Low-contrast warm gray', swatches: ['#2b2b2b', '#383838', '#8cd0d3', '#8cd0d3'] },
    { id: 'ayumirage', name: 'Ayu Mirage', label: 'Ayu Mirage', desc: 'Mid-tone dusk navy & amber', swatches: ['#191e2a', '#212733', '#ffcc66', '#73d0ff'] },
    { id: 'latte', name: 'Catppuccin Latte', label: 'Catppuccin Latte', desc: 'Soft pastel gray & mauve', swatches: ['#e6e9ef', '#eff1f5', '#7e35de', '#1a5ad8'] },
    { id: 'gruvboxlight', name: 'Gruvbox Light', label: 'Gruvbox Light', desc: 'Warm cream paper', swatches: ['#f2e5bc', '#fbf1c7', '#076678', '#076678'] },
    { id: 'solarizedlight', name: 'Solarized Light', label: 'Solarized Light', desc: 'Precision cream & blue', swatches: ['#eee8d5', '#fdf6e3', '#1c679b', '#1c679b'] },
    { id: 'sepia', name: 'Warm Sepia', label: 'Warm Sepia', desc: 'E-reader parchment & espresso ink', swatches: ['#ece4d0', '#f4ecd8', '#964c22', '#366674'] }
  ];

  function applyGlobalTheme(themeId) {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    document.documentElement.setAttribute('data-theme', theme.id);
    localStorage.setItem('linux_cs_theme', theme.id);

    document.querySelectorAll('.theme-option').forEach(opt => {
      opt.classList.toggle('active', opt.dataset.theme === theme.id);
    });

    const label = document.getElementById('theme-btn-label');
    if (label) {
      label.textContent = theme.label || theme.name.split(' ')[0];
    }
  }

  function setupThemeSelector() {
    const btn = document.getElementById('theme-palette-btn');
    const dropdown = document.getElementById('theme-dropdown-menu');
    const wrapper = document.getElementById('theme-menu-wrapper');

    const currentThemeId = (function() {
      try { return localStorage.getItem('linux_cs_theme') || 'dark'; } catch(e) { return 'dark'; }
    })();

    if (dropdown) {
      const countEl = dropdown.querySelector('.theme-count');
      if (countEl) countEl.textContent = `${THEMES.length} Themes`;

      let list = dropdown.querySelector('.theme-options-list');
      if (!list) {
        list = document.createElement('div');
        list.className = 'theme-options-list';
        dropdown.appendChild(list);
      }

      list.innerHTML = THEMES.map(t => `
        <button type="button" class="theme-option${t.id === currentThemeId ? ' active' : ''}" data-theme="${t.id}" title="${escapeHtml(t.desc)}">
          <div class="theme-swatches">${t.swatches.map(s => `<span class="theme-dot" style="background:${s}"></span>`).join('')}</div>
          <div class="theme-info"><span class="theme-name">${escapeHtml(t.name)}</span><span class="theme-desc">${escapeHtml(t.desc)}</span></div>
          <span class="theme-check">✓</span>
        </button>
      `).join('');
    }

    applyGlobalTheme(currentThemeId);

    if (!btn || !dropdown) return;

    btn.onclick = function(e) {
      e.stopPropagation();
      if (e.shiftKey) {
        const currId = document.documentElement.getAttribute('data-theme') || 'dark';
        const currIdx = THEMES.findIndex(t => t.id === currId);
        const nextIdx = (currIdx + 1) % THEMES.length;
        applyGlobalTheme(THEMES[nextIdx].id);
        showGlobalToast('Theme: ' + THEMES[nextIdx].name);
        return;
      }
      const isOpen = dropdown.classList.contains('open');
      dropdown.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen);
    };

    dropdown.querySelectorAll('.theme-option').forEach(opt => {
      opt.onclick = function(e) {
        e.stopPropagation();
        const themeId = opt.dataset.theme;
        const theme = THEMES.find(t => t.id === themeId);
        applyGlobalTheme(themeId);
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        showGlobalToast('Theme: ' + (theme ? theme.name : themeId));
      };
    });

    document.addEventListener('click', (e) => {
      if (wrapper && !wrapper.contains(e.target)) {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdown.classList.contains('open')) {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // -------------------------------------------------------------
  // 5. TOAST & UTILITIES
  // -------------------------------------------------------------
  let globalToastTimer = null;
  function showGlobalToast(message) {
    let toast = document.getElementById('toast');
    let toastText = document.getElementById('toast-text');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.innerHTML = `<span class="toast-check">&#10003;</span><span id="toast-text">${escapeHtml(message)}</span>`;
      document.body.appendChild(toast);
      toastText = document.getElementById('toast-text');
    } else {
      if (toastText) toastText.textContent = message;
    }

    toast.classList.add('visible');
    clearTimeout(globalToastTimer);
    globalToastTimer = setTimeout(() => {
      toast.classList.remove('visible');
    }, 2200);
  }

  function scrollToCard(cardId) {
    if (!cardId) return;
    const cleanId = cardId.replace(/^#/, '');
    const el = document.getElementById(cleanId);
    if (el) {
      el.classList.add('card-revealed'); // Compact may be hiding the result you came for.
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('cmd-highlight-flash');
      setTimeout(() => el.classList.remove('cmd-highlight-flash'), 2500);
    }
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Sheets use "/" to jump to search. In a form field it has to type a slash instead.
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && e.target instanceof Element && e.target.matches('input, textarea, select, [contenteditable]')) {
      e.stopPropagation();
    }
  }, true);

  // Global keydown handler
  window.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K opens global search
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openGlobalSearch();
    }
    // M opens Manuals, except while typing, in a modal, or inside an offline-copy tool frame.
    const typing = e.target instanceof Element && e.target.matches('input, textarea, select, [contenteditable]');
    const modalOpen = document.querySelector('.global-search-backdrop:not(.hidden), .triage-modal-backdrop:not(.hidden)');
    if (e.key.toLowerCase() === 'm' && !e.ctrlKey && !e.metaKey && !e.altKey && !typing && !modalOpen && window.parent === window) {
      e.preventDefault();
      openManuals();
    }
    // Escape closes modals
    if (e.key === 'Escape') {
      closeGlobalSearch();
      closeTriageModal();
    }
  });

  // Enhance Empty State with cross-sheet suggestions
  function enhanceEmptyState() {
    const localInput = document.getElementById('search-input');
    const emptyState = document.getElementById('empty-state');
    if (!localInput || !emptyState) return;

    let suggestionBox = document.getElementById('empty-global-suggestion');
    if (!suggestionBox) {
      suggestionBox = document.createElement('div');
      suggestionBox.id = 'empty-global-suggestion';
      suggestionBox.className = 'empty-global-suggestion hidden';
      emptyState.appendChild(suggestionBox);
    }

    localInput.addEventListener('input', () => {
      const q = localInput.value.trim().toLowerCase();
      if (!q || !window.GLOBAL_SEARCH_INDEX) {
        suggestionBox.classList.add('hidden');
        return;
      }

      // Check after local rendering cycle
      setTimeout(() => {
        if (!emptyState.classList.contains('hidden')) {
          const tokens = q.split(/\s+/).filter(Boolean);
          const currentFile = window.location.pathname.split('/').pop() || 'index.html';
          const otherMatches = window.GLOBAL_SEARCH_INDEX.filter(item => {
            if (item.file === currentFile) return false;
            const text = `${item.sName} ${item.sec} ${item.cmd} ${item.desc} ${item.tags}`.toLowerCase();
            return tokens.every(tok => text.includes(tok));
          });

          if (otherMatches.length > 0) {
            const sheetNames = [...new Set(otherMatches.map(m => m.sName))].slice(0, 3).join(', ');
            suggestionBox.innerHTML = `
              <div class="empty-global-hint">
                <p>💡 Found <strong>${otherMatches.length}</strong> matching command${otherMatches.length === 1 ? '' : 's'} on other sheets (${sheetNames}${otherMatches.length > 3 ? '...' : ''})</p>
                <button type="button" class="action-btn empty-global-btn" id="empty-open-global-btn">
                  🔍 View in Global Search (Ctrl+K)
                </button>
              </div>
            `;
            suggestionBox.classList.remove('hidden');
            const btn = document.getElementById('empty-open-global-btn');
            if (btn) {
              btn.addEventListener('click', () => openGlobalSearch(localInput.value));
            }
          } else {
            suggestionBox.classList.add('hidden');
          }
        } else {
          suggestionBox.classList.add('hidden');
        }
      }, 50);
    });
  }

  // Synchronize active states across sheet-switcher and all dropdown menus
  function syncActiveNav() {
    const currentFile = window.location.pathname.split("/").pop() || "index.html";

    // Highlight any dropdown toggle if currentFile is inside that dropdown or matches the toggle
    document.querySelectorAll(".nav-dropdown").forEach(dropdown => {
      let isInside = false;
      dropdown.querySelectorAll(".dropdown-item").forEach(item => {
        const href = item.getAttribute("href");
        if (href === currentFile) {
          item.classList.add("active");
          isInside = true;
        } else {
          item.classList.remove("active");
        }
      });

      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (toggle) {
        if (isInside || toggle.getAttribute("href") === currentFile) {
          toggle.classList.add("active");
        } else {
          toggle.classList.remove("active");
        }
      }
    });

    // Ensure non-dropdown sheet links match active state
    document.querySelectorAll(".sheet-switcher > .sheet-link").forEach(link => {
      if (link.getAttribute("href") === currentFile) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // Handle click-to-toggle for dropdowns so menus stay open on click
  function setupNavDropdown() {
    const dropdowns = document.querySelectorAll(".nav-dropdown");
    if (dropdowns.length === 0) return;

    dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector(".dropdown-toggle");
      if (toggle) {
        toggle.addEventListener("click", (e) => {
          e.preventDefault();
          const isOpen = dropdown.classList.contains("open");
          // Close other open dropdowns
          dropdowns.forEach(d => {
            if (d !== dropdown) d.classList.remove("open");
          });
          dropdown.classList.toggle("open", !isOpen);
        });
      }

      dropdown.querySelectorAll(".dropdown-item").forEach(item => {
        item.addEventListener("click", () => {
          dropdown.classList.remove("open");
        });
      });
    });

    document.addEventListener("click", (e) => {
      dropdowns.forEach(dropdown => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("open");
        }
      });
    });
  }

  // Handle fullscreen adjustments and responsive card reflow
  function setupFullscreenObserver() {
    let resizeTimer = null;
    function triggerReflow() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (typeof window.packMasonry === 'function') {
          window.packMasonry();
        } else if (typeof packMasonry === 'function') {
          packMasonry();
        }
      }, 40);
    }

    window.addEventListener('resize', triggerReflow);
    document.addEventListener('fullscreenchange', triggerReflow);
    document.addEventListener('webkitfullscreenchange', triggerReflow);

    const sectionsContainer = document.getElementById('sections-container') || document.querySelector('.sections-grid');
    if (typeof ResizeObserver !== 'undefined' && sectionsContainer) {
      let lastW = 0;
      const ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const w = Math.round(entry.contentRect.width);
          if (w > 0 && Math.abs(w - lastW) > 10) {
            lastW = w;
            triggerReflow();
          }
        }
      });
      ro.observe(sectionsContainer);
    }
  }

  // -------------------------------------------------------------
  // 6. COMPACT VIEW
  // -------------------------------------------------------------
  const COMPACT_KEY = 'linux_cs_compact';
  // The variants are the main content on these sheets, so Compact keeps them.
  const KEEPS_VARIANTS = /^(awk-sed|bash|git|javascript|jira|json|lua|markdown|powershell|python|regex|scripting|sql|toml|typescript|yaml)\.html$/;

  // -------------------------------------------------------------
  // 7. REFERENCE DIAGRAMS
  // -------------------------------------------------------------
  // Drawn here rather than loaded as images so they work offline and follow the theme.
  // Wire colors are the real cable colors, so they stay the same in every theme.
  const WIRE_COLORS = { orange: '#e8791f', green: '#2f9e44', blue: '#2f6fd6', brown: '#9c6b3c' };
  const RJ45_STANDARDS = [
    { name: 'T568B', note: 'Standard for most installs',
      wires: ['white-orange', 'orange', 'white-green', 'blue', 'white-blue', 'green', 'white-brown', 'brown'] },
    { name: 'T568A', note: 'Government and residential',
      wires: ['white-green', 'green', 'white-orange', 'blue', 'white-blue', 'orange', 'white-brown', 'brown'] }
  ];

  function wireLabel(wire) {
    return wire.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join('/');
  }

  function rj45Wire(wire, x) {
    const top = 86;
    const height = 124;
    const striped = wire.startsWith('white-');
    const color = WIRE_COLORS[wire.replace('white-', '')];
    let bands = '';
    if (striped) {
      for (let y = top + 3; y < top + height - 6; y += 14) {
        bands += `<rect x="${x - 6}" y="${y}" width="12" height="7" fill="${color}"/>`;
      }
    }
    return `<rect x="${x - 6}" y="${top}" width="12" height="${height}" rx="2" fill="${striped ? '#f4f4f0' : color}"/>${bands}` +
      `<rect x="${x - 6}" y="${top}" width="12" height="${height}" rx="2" fill="none" stroke="var(--border-strong)"/>`;
  }

  function rj45Svg(standard) {
    const wireX = pin => 59 + pin * 26;
    const pins = standard.wires.map((wire, pin) => {
      const x = wireX(pin);
      return `<text x="${x}" y="58" text-anchor="middle" class="wire-pin">${pin + 1}</text>` +
        `<rect x="${x - 6}" y="66" width="12" height="20" rx="1.5" fill="#d4a72c"/>` +
        rj45Wire(wire, x) +
        `<text transform="translate(${x + 4} 288) rotate(-90)" class="wire-label">${wireLabel(wire)}</text>`;
    }).join('');
    const summary = standard.wires.map((wire, pin) => `${pin + 1} ${wireLabel(wire)}`).join(', ');
    return `<svg viewBox="0 0 300 296" role="img" aria-label="${standard.name} wire order: ${summary}">` +
      `<text x="150" y="18" text-anchor="middle" class="wire-title">${standard.name}</text>` +
      `<text x="150" y="35" text-anchor="middle" class="wire-note">${standard.note}</text>` +
      '<rect x="38" y="62" width="224" height="128" rx="6" class="wire-plug"/>' +
      pins + '</svg>';
  }

  const DIAGRAMS = {
    'rj45-pinout': () => '<figure class="wire-diagram">' + RJ45_STANDARDS.map(rj45Svg).join('') +
      '<figcaption>Hold the plug with the contacts facing you, the clip behind, and the cable pointing down. Pin 1 is on the left.</figcaption></figure>'
  };

  function renderDiagram(name) {
    return DIAGRAMS[name] ? DIAGRAMS[name]() : '';
  }

  // -------------------------------------------------------------
  // 8. READ-ONLY REFERENCE ENTRIES
  // -------------------------------------------------------------
  // build-reference-rules.js decides what isn't a command. About 200 sheet scripts render
  // these boxes, so entries are matched by text here rather than in each renderer.
  const COPY_BOXES = '.cmd-code-box:not([data-ref-checked]), .subcmd-row:not([data-ref-checked])';
  let referenceText = null;

  function getReferenceText() {
    if (!referenceText) {
      referenceText = new Set();
      (window.GLOBAL_SEARCH_INDEX || []).filter(item => item.noCopy).forEach(item => {
        referenceText.add(item.cmd);
        referenceText.add(firstCommand(item.cmd));
      });
    }
    return referenceText;
  }

  function markReferenceEntries() {
    document.querySelectorAll(COPY_BOXES).forEach(box => {
      box.dataset.refChecked = '1';
      const text = box.dataset.copy ?? box.dataset.cmd ?? box.dataset.subcmd;
      if (text !== undefined && getReferenceText().has(text)) {
        box.classList.add('is-reference');
        box.removeAttribute('title');
      }
    });
  }

  function initReferenceEntries() {
    markReferenceEntries();
    new MutationObserver(markReferenceEntries).observe(document.body, { childList: true, subtree: true });
    // Runs before the sheets' own copy handlers.
    window.addEventListener('click', (e) => {
      if (e.target instanceof Element && e.target.closest('.is-reference')) e.stopPropagation();
    }, true);
  }

  // -------------------------------------------------------------
  // 9. MANUALS
  // -------------------------------------------------------------
  // The manuals are about 9 MB, so they load the first time the reader opens rather
  // than on every page. The offline copy embeds them as JSON instead of a script file.
  const MANUAL_MISSING_TEXT = {
    vendor: 'Vendor tool: its manual is left out because the license may not allow redistribution.',
    unavailable: 'No manual for this tool was found in Ubuntu 24.04 main or universe.'
  };
  const MANUAL_ELSEWHERE = 'Search all sheets with Ctrl+K for its commands, or run the tool with --help on the node.';
  let manuals = null;
  let manualsLoading = null;
  let manualsEl = null;
  let manualsFocus = null;
  let manualsSelected = '';
  let manualsTimer = null;

  function buildManuals(data) {
    const pages = Object.entries(data.pages).map(([name, page]) => ({ name, ...page }));
    const absent = Object.entries(data.missing || {}).map(([name, reason]) => ({ name, reason, category: 'Not included' }));
    return { count: pages.length, list: [...pages, ...absent].sort((a, b) => a.name.localeCompare(b.name)) };
  }

  function loadManuals() {
    if (manuals) return Promise.resolve();
    if (manualsLoading) return manualsLoading;
    manualsLoading = new Promise((resolve, reject) => {
      const embedded = document.getElementById('portable-man-pages');
      if (embedded) {
        manuals = buildManuals(JSON.parse(embedded.textContent));
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'man-pages-data.js';
      script.onload = () => {
        manuals = buildManuals(window.MAN_PAGES_DATA);
        delete window.MAN_PAGES_DATA;
        resolve();
      };
      script.onerror = () => {
        manualsLoading = null;
        reject(new Error('man-pages-data.js could not be loaded'));
      };
      document.head.appendChild(script);
    });
    return manualsLoading;
  }

  function manualNode(id) {
    return document.getElementById(id);
  }

  function initManualsReader() {
    if (manualsEl) return;
    manualsEl = document.createElement('div');
    manualsEl.id = 'manuals-modal';
    manualsEl.className = 'manual-backdrop hidden';
    manualsEl.innerHTML = `
      <section class="manual-dialog" role="dialog" aria-modal="true" aria-labelledby="manual-heading">
        <header class="manual-header">
          <h2 id="manual-heading">Manuals</h2>
          <span id="manual-count" class="manual-count" role="status">Loading...</span>
          <button type="button" id="manual-close" class="action-btn" aria-label="Close manuals">Close</button>
        </header>
        <div class="manual-toolbar">
          <input type="search" id="manual-search" placeholder="Search manuals, such as nvme smart-log or ipmitool" aria-label="Search manuals" autocomplete="off" spellcheck="false" />
          <select id="manual-category" aria-label="Filter by category"><option value="">All categories</option></select>
          <label class="manual-fulltext"><input type="checkbox" id="manual-fulltext" /> Search full text</label>
        </div>
        <div class="manual-layout">
          <nav id="manual-list" class="manual-list" aria-label="Manual list"></nav>
          <article class="manual-reader" tabindex="0" aria-label="Selected manual">
            <h3 id="manual-title"></h3>
            <p id="manual-meta" class="manual-meta"></p>
            <pre id="manual-text"></pre>
          </article>
        </div>
      </section>`;
    document.body.appendChild(manualsEl);

    manualNode('manual-close').addEventListener('click', closeManuals);
    manualsEl.addEventListener('click', (e) => {
      if (e.target === manualsEl) closeManuals();
    });
    manualNode('manual-search').addEventListener('input', () => {
      clearTimeout(manualsTimer);
      manualsTimer = setTimeout(renderManualList, 120);
    });
    manualNode('manual-category').addEventListener('change', renderManualList);
    manualNode('manual-fulltext').addEventListener('change', renderManualList);
    manualNode('manual-list').addEventListener('click', (e) => {
      const entry = e.target.closest('[data-manual]');
      if (entry) selectManual(entry.dataset.manual);
    });
    manualsEl.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeManuals();
      } else if (e.key === 'Tab') {
        const focusable = [...manualsEl.querySelectorAll('button, input, select, [tabindex="0"]')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  function manualMatches() {
    const tokens = manualNode('manual-search').value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const category = manualNode('manual-category').value;
    const fullText = manualNode('manual-fulltext').checked;
    const joined = tokens.join('-');
    const rank = entry => (entry.name === joined || entry.name === tokens[0] ? 0 : entry.name.startsWith(joined) ? 1 : 2);
    return manuals.list
      .filter(entry => !category || entry.category === category)
      .filter(entry => {
        const words = `${entry.name} ${entry.package || ''} ${entry.category} ${fullText ? entry.text || '' : ''}`.toLowerCase();
        return tokens.every(token => words.includes(token));
      })
      .sort((a, b) => rank(a) - rank(b));
  }

  function renderManualList() {
    const matches = manualMatches();
    manualNode('manual-count').textContent = `${matches.length} of ${manuals.list.length}`;
    const list = manualNode('manual-list');
    list.replaceChildren(...matches.map(entry => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.manual = entry.name;
      button.className = `manual-entry${entry.text ? '' : ' is-missing'}${entry.name === manualsSelected ? ' active' : ''}`;
      button.textContent = entry.section ? `${entry.name}(${entry.section})` : entry.name;
      return button;
    }));
    if (!matches.length) {
      const empty = document.createElement('p');
      empty.className = 'manual-empty';
      empty.textContent = 'No manuals match. Try fewer words, or turn on Search full text.';
      list.replaceChildren(empty);
    } else if (!matches.some(entry => entry.name === manualsSelected)) {
      selectManual((matches.find(entry => entry.text) || matches[0]).name);
    }
  }

  function selectManual(name) {
    const entry = manuals.list.find(item => item.name === name);
    if (!entry) return;
    manualsSelected = name;
    manualNode('manual-title').textContent = entry.section ? `${entry.name}(${entry.section})` : entry.name;
    manualNode('manual-meta').textContent = entry.text
      ? `${entry.package} ${entry.version} · ${entry.category} · License: ${entry.license} · Source: ${entry.source}. The version on a node can differ.`
      : '';
    manualNode('manual-text').textContent = entry.text || `${MANUAL_MISSING_TEXT[entry.reason] || ''}\n\n${MANUAL_ELSEWHERE}`;
    manualsEl.querySelector('.manual-reader').scrollTop = 0;
    manualsEl.querySelectorAll('.manual-entry').forEach(item => item.classList.toggle('active', item.dataset.manual === name));
  }

  function openManuals(name) {
    initManualsReader();
    if (manualsEl.classList.contains('hidden')) {
      manualsFocus = document.activeElement;
      manualsEl.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
    manualNode('manual-search').focus();
    return loadManuals().then(() => {
      const category = manualNode('manual-category');
      if (category.options.length === 1) {
        [...new Set(manuals.list.map(entry => entry.category))].sort().forEach(value => category.add(new Option(value, value)));
      }
      manualNode('manual-search').value = name || '';
      renderManualList();
      if (name) selectManual(name);
    }).catch(() => {
      manualNode('manual-count').textContent = '';
      manualNode('manual-text').textContent = 'The manuals could not be loaded. Keep man-pages-data.js in the same folder as this page.';
    });
  }

  function closeManuals() {
    if (!manualsEl || manualsEl.classList.contains('hidden')) return;
    clearTimeout(manualsTimer);
    manualsEl.classList.add('hidden');
    document.body.style.overflow = '';
    if (manualsFocus && manualsFocus.focus) manualsFocus.focus();
  }

  function repack() {
    if (typeof window.packMasonry === 'function') window.packMasonry();
  }

  function applyCompact(compact) {
    document.body.classList.toggle('compact-mode', compact);
    const btn = document.getElementById('density-toggle');
    const label = document.getElementById('density-label');
    if (btn) {
      btn.classList.toggle('active', compact);
      btn.setAttribute('aria-pressed', String(compact));
    }
    if (label) label.textContent = compact ? 'Detailed' : 'Compact';
    repack();
  }

  function setSheetContext(file) {
    document.body.classList.toggle('keep-variants', KEEPS_VARIANTS.test(file));
    syncSearchActive();
  }

  // Search reveals everything Compact hides, so a match is never hidden in its own result.
  function syncSearchActive() {
    const input = document.getElementById('search-input');
    const active = !!(input && input.value.trim());
    if (active !== document.body.classList.contains('search-active')) {
      document.body.classList.toggle('search-active', active);
      repack();
    }
  }

  function initCompact() {
    // Motherboards used to keep its own setting.
    const legacy = readStored('mb_sheet_compact');
    if (legacy !== null) {
      if (legacy === 'true' && readStored(COMPACT_KEY) === null) localStorage.setItem(COMPACT_KEY, '1');
      localStorage.removeItem('mb_sheet_compact');
    }
    setSheetContext(window.location.pathname.split('/').pop() || 'index.html');
    applyCompact(readStored(COMPACT_KEY) === '1');

    document.addEventListener('click', (e) => {
      if (!(e.target instanceof Element) || !e.target.closest('#density-toggle')) return;
      const compact = !document.body.classList.contains('compact-mode');
      localStorage.setItem(COMPACT_KEY, compact ? '1' : '0');
      applyCompact(compact);
    });
    document.addEventListener('input', syncSearchActive, true);
    // Esc and Reset clear the box without an input event.
    ['click', 'keyup'].forEach(type => document.addEventListener(type, () => setTimeout(syncSearchActive, 0)));
  }

  // Sheet scripts load after this one, so apply Compact now, before they measure cards.
  if (document.body) initCompact();
  else window.addEventListener('DOMContentLoaded', initCompact);

  // Check URL hash on page load
  window.addEventListener('DOMContentLoaded', () => {
    syncActiveNav();
    setupNavDropdown();
    setupFullscreenObserver();
    injectHeaderControls();
    renderTargetVarsBar();
    enhanceEmptyState();
    initReferenceEntries();
    if (window.location.hash) {
      setTimeout(() => scrollToCard(window.location.hash), 150);
    }
  });

  // Expose global methods (aliased across Antigravity, Claude, Codex, and neutral CheatSheetCommon)
  const commonExports = {
    openGlobalSearch,
    closeGlobalSearch,
    openTriageModal,
    closeTriageModal,
    substituteVariables,
    showToast: showGlobalToast,
    scrollToCard,
    applyTheme: applyGlobalTheme,
    setSheetContext,
    renderDiagram,
    openManuals,
    THEMES
  };

  window.CheatSheetCommon = commonExports;
  window.AppCommon = commonExports;
  window.AntigravityCommon = commonExports;
  window.ClaudeCommon = commonExports;
  window.CodexCommon = commonExports;
})();
