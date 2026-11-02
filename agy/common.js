// common.js — Shared suite logic: Target Variables Bar, Global Search (Ctrl+K), Triage/RMA Modal & Deep Linking
(function() {
  'use strict';

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
    pass: 'ADMIN',
    iface: 'eno1',
    hca: 'mlx5_0',
    disk: '/dev/nvme0n1',
    gpu: '0'
  };

  const targetState = {
    active: localStorage.getItem('dc_vars_active') !== '0', // default enabled
    collapsed: localStorage.getItem('dc_vars_collapsed') === '1',
    vars: Object.assign({}, DEFAULT_TARGET_VARS, JSON.parse(localStorage.getItem('dc_target_vars') || '{}'))
  };

  function saveTargetState() {
    localStorage.setItem('dc_vars_active', targetState.active ? '1' : '0');
    localStorage.setItem('dc_vars_collapsed', targetState.collapsed ? '1' : '0');
    localStorage.setItem('dc_target_vars', JSON.stringify(targetState.vars));
  }

  // Hook clipboard to automatically substitute variables if active
  function substituteVariables(text) {
    if (!targetState.active || !text) return { text, substituted: false };
    let result = text;
    let count = 0;

    const bmcVal = (targetState.vars.bmc || '').trim();
    if (bmcVal && bmcVal !== DEFAULT_TARGET_VARS.bmc) {
      const bmcRegex = /(\$BMC\b|\$\{BMC\}|<bmc[_-]ip>|<bmc_host>|2001:db8:dc::1|192\.168\.1\.120)/gi;
      if (bmcRegex.test(result)) {
        result = result.replace(bmcRegex, bmcVal);
        count++;
      }
    } else if (bmcVal) {
      result = result.replace(/(\$BMC\b|\$\{BMC\}|<bmc[_-]ip>|<bmc_host>)/gi, bmcVal);
    }

    const userVal = (targetState.vars.user || '').trim();
    if (userVal) {
      result = result.replace(/(\$BMC_USER\b|\$\{BMC_USER\}|\$USER\b|\$\{USER\}|<user>)/g, userVal);
    }

    const passVal = (targetState.vars.pass || '').trim();
    if (passVal) {
      result = result.replace(/(\$BMC_PASS\b|\$\{BMC_PASS\}|\$PASS\b|\$\{PASS\}|<password>|<pass>)/g, passVal);
    }

    const ifaceVal = (targetState.vars.iface || '').trim();
    if (ifaceVal) {
      result = result.replace(/(\$IFACE\b|\$\{IFACE\}|<interface>|<iface>)/gi, ifaceVal);
    }

    const hcaVal = (targetState.vars.hca || '').trim();
    if (hcaVal) {
      result = result.replace(/(\$HCA\b|\$\{HCA\}|<hca>)/gi, hcaVal);
    }

    const diskVal = (targetState.vars.disk || '').trim();
    if (diskVal) {
      result = result.replace(/(\$DISK\b|\$\{DISK\}|<disk>|<device>)/gi, diskVal);
    }

    const gpuVal = (targetState.vars.gpu || '').trim();
    if (gpuVal) {
      result = result.replace(/(\$GPU\b|\$\{GPU\}|<gpu>|<gpu_id>)/gi, gpuVal);
    }

    return { text: result, substituted: result !== text };
  }

  // Intercept navigator.clipboard.writeText so all sheets inherit variable substitution automatically!
  if (navigator.clipboard && navigator.clipboard.writeText) {
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
    navigator.clipboard.writeText = function(text) {
      const { text: newText, substituted } = substituteVariables(text);
      if (substituted) {
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
            <label for="var-user"><span class="var-tag">$USER</span> BMC User</label>
            <input type="text" id="var-user" spellcheck="false" autocomplete="off" value="${escapeHtml(targetState.vars.user)}" placeholder="ADMIN" />
          </div>
          <div class="target-field">
            <label for="var-pass"><span class="var-tag">$PASS</span> BMC Password</label>
            <div class="password-input-wrapper">
              <input type="password" id="var-pass" spellcheck="false" autocomplete="off" value="${escapeHtml(targetState.vars.pass)}" placeholder="ADMIN" />
              <button type="button" id="toggle-pass-visibility" class="password-toggle-btn" title="Show password" aria-label="Toggle password visibility">
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
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
        saveTargetState();
        renderTargetVarsBar();
        showGlobalToast('Target variables reset to defaults');
      });
    }

    const togglePassBtn = document.getElementById('toggle-pass-visibility');
    const passInput = document.getElementById('var-pass');
    if (togglePassBtn && passInput) {
      togglePassBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        togglePassBtn.title = isPass ? 'Hide password' : 'Show password';
        togglePassBtn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
        togglePassBtn.innerHTML = isPass
          ? `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
          : `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      });
    }

    ['bmc', 'user', 'pass', 'iface', 'hca', 'disk', 'gpu'].forEach(key => {
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
          <input type="text" id="palette-search-input" placeholder="Search 768+ commands across all 14 sheets (e.g. 'xid 79', 'edac', 'dom', 'vpi')..." autocomplete="off" spellcheck="false" />
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
    if (!tokens.length) {
      // Show default top picks across sheets
      matches = window.GLOBAL_SEARCH_INDEX.slice(0, 25);
    } else {
      matches = window.GLOBAL_SEARCH_INDEX.filter(item => {
        const text = `${item.sName} ${item.sec} ${item.cmd} ${item.desc} ${item.tags} ${item.tip}`.toLowerCase();
        return tokens.every(token => text.includes(token));
      }).slice(0, 50); // limit to top 50 matches for fast DOM render
    }

    currentSearchResults = matches;
    searchCount.textContent = `${matches.length} command${matches.length === 1 ? '' : 's'} found across 14 sheets`;

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
            <span class="palette-action-hint">Enter to Copy • Click to Open</span>
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
        navigator.clipboard.writeText(cmd);
        showGlobalToast(`Copied command from ${itemEl.querySelector('.palette-sheet-badge').textContent}!`);

        // If not already on this page, navigate to it with hash
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPath !== file) {
          window.location.href = `${file}#${id}`;
        } else {
          closeGlobalSearch();
          scrollToCard(id);
        }
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

    navigator.clipboard.writeText(item.cmd);
    showGlobalToast(`Copied command: ${item.cmd.slice(0, 40)}…`);

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPath !== item.file) {
      window.location.href = `${item.file}#${item.id}`;
    } else {
      closeGlobalSearch();
      scrollToCard(item.id);
    }
  }

  function highlightMatches(text, tokens) {
    if (!text) return '';
    if (!tokens.length) return escapeHtml(text);
    let escaped = escapeHtml(text);
    tokens.forEach(tok => {
      if (!tok) return;
      const regex = new RegExp(`(${escapeRegex(tok)})`, 'gi');
      escaped = escaped.replace(regex, '<mark>$1</mark>');
    });
    return escaped;
  }

  function getSheetColorClass(sheetName) {
    switch (sheetName) {
      case 'Scripting': return 'badge-scripting';
      case 'NVIDIA DC': return 'badge-nvidia';
      case 'InfiniBand': return 'badge-ib';
      case 'Switches': return 'badge-switch';
      case 'Motherboards': return 'badge-mb';
      case 'Redfish': return 'badge-redfish';
      case 'ipmitool': return 'badge-ipmi';
      case 'Fiber': return 'badge-fiber';
      case 'Ethernet': return 'badge-eth';
      case 'Neovim': return 'badge-nvim';
      case 'macOS': return 'badge-mac';
      case 'Windows':
      case 'PS> Windows': return 'badge-win';
      case 'Omarchy': return 'badge-omarchy';
      default: return 'badge-linux';
    }
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
if dmesg | grep -iE 'BERT|APEI|GHES' >/dev/null 2>&1; then
  dmesg | grep -iE 'BERT|APEI|GHES' | head -n 12
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
sudo lspci -vv 2>/dev/null | awk '
  /^[0-9a-f]{2}:[0-9a-f]{2}\\.[0-9]/ { dev=$0 }
  /LnkCap:/ { cap=$0 }
  /LnkSta:/ {
    if (cap != "" && match(cap, /Speed [^,]+, Width x[0-9]+/) && match($0, /Speed [^,]+, Width x[0-9]+/)) {
      c_val=substr(cap, RSTART, RLENGTH)
      s_val=substr($0, RSTART, RLENGTH)
      if (c_val != s_val && !index(s_val, "Width x0")) {
        print "DEGRADED: " substr(dev,1,45) "\\n   Cap: " c_val " -> Current: " s_val
      }
    }
  }
' | head -n 15 || echo "No PCIe link degradation detected."

echo -e "\\n[5/7] NVIDIA GPU HEALTH, XIDS & ROW-REMAPS:"
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi --query-gpu=index,name,serial,uuid,temperature.gpu,power.draw,ecc.errors.uncorrected.volatile.total,ecc.errors.uncorrected.aggregate.total --format=csv,noheader || true
  echo -e "\\nPending & Uncorrectable Row Remap Status:"
  nvidia-smi --query-remapped-rows=gpu_uuid,remapped_due_to_uncorrectable,pending_remapped_due_to_uncorrectable,failure --format=csv 2>/dev/null || true
  echo -e "\\nRecent GPU Xids in dmesg:"
  dmesg -T | grep -i "NVRM: Xid" | tail -n 8 || echo "No Xids found in kernel log."
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
  for dev in /dev/nvme[0-9]n1; do
    [ -e "$dev" ] || continue
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
      navigator.clipboard.writeText(TRIAGE_SCRIPT);
      showGlobalToast('Copied raw Triage Shell Script to clipboard!');
    });

    document.getElementById('copy-triage-script-btn').addEventListener('click', () => {
      const b64 = btoa(unescape(encodeURIComponent(TRIAGE_SCRIPT)));
      const oneLiner = `echo "${b64}" | base64 -d | bash`;
      navigator.clipboard.writeText(oneLiner);
      showGlobalToast('Copied base64 Triage One-Liner to clipboard!');
    });

    // RMA inputs live update
    ['rma-serial', 'rma-model', 'rma-component', 'rma-slot', 'rma-log'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateRmaPreview);
    });

    document.getElementById('copy-rma-ticket-btn').addEventListener('click', () => {
      const text = document.getElementById('rma-preview-text').textContent;
      navigator.clipboard.writeText(text);
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

    if (!document.getElementById('portable-link-btn') && !window.location.pathname.endsWith('datacenter-cheatsheet-portable.html')) {
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
    { id: 'sepia', name: 'Warm Sepia', desc: 'E-reader parchment & espresso ink', swatches: ['#ece4d0', '#f4ecd8', '#2c2523', '#b05a28'] },
    { id: 'nebius', name: 'Nebius Cloud', desc: 'AI cloud petrol navy & volt lime', swatches: ['#031422', '#062238', '#e0ff4f', '#614efa'] },
    { id: 'gruvbox', name: 'Gruvbox Dark', desc: 'Warm retro groove & amber', swatches: ['#1d2021', '#282828', '#fabd2f', '#fe8019'] },
    { id: 'everforest', name: 'Everforest', desc: 'Natural pine, moss & cedar', swatches: ['#232a2e', '#2d353b', '#a7c080', '#dbbc7f'] },
    { id: 'kanagawa', name: 'Kanagawa', desc: 'Japanese sumi-e ink & autumn wave', swatches: ['#16161d', '#1f1f28', '#7aa89f', '#c34043'] },
    { id: 'rosepine', name: 'Rosé Pine', desc: 'Velvet charcoal & dusty rose', swatches: ['#13111b', '#191724', '#ebbcba', '#f6c177'] },
    { id: 'ayumirage', name: 'Ayu Mirage', desc: 'Mid-tone dusk navy & amber', swatches: ['#191e2a', '#212733', '#ffcc66', '#73d0ff'] },
    { id: 'gemini', name: 'Gemini Spark', desc: 'Google Gemini cosmic indigo & violet', swatches: ['#090a12', '#101322', '#818cf8', '#c084fc'] },
    { id: 'claude', name: 'Claude Warm', desc: 'Warm charcoal & terracotta', swatches: ['#1f1e1d', '#262624', '#d97757', '#e8b48f'] },
    { id: 'codex', name: 'Codex Mint', desc: 'Charcoal & mint workspace', swatches: ['#141414', '#1c1c1c', '#8de8c2', '#ececec'] },
    { id: 'startrek', name: 'Star Trek', desc: 'Starship console orange & lilac', swatches: ['#000000', '#17131f', '#ff9900', '#cc99cc'] },
    { id: 'starwars', name: 'Star Wars', desc: 'Deep space black & crawl yellow', swatches: ['#05060a', '#14171f', '#ffe81f', '#5fb8ff'] },
    { id: 'nord', name: 'Nord Frost', desc: 'Arctic cold & polar blue', swatches: ['#242933', '#2e3440', '#88c0d0', '#a3be8c'] },
    { id: 'dracula', name: 'Dracula Night', desc: 'High-contrast vampire purple & pink', swatches: ['#1e1f29', '#282a36', '#bd93f9', '#ff79c6'] },
    { id: 'catppuccin', name: 'Catppuccin Mocha', desc: 'Soothing pastel mantle & mauve', swatches: ['#181825', '#1e1e2e', '#cba6f7', '#a6e3a1'] },
    { id: 'matrix', name: 'Matrix CRT', desc: 'Hacker phosphor green & terminal black', swatches: ['#030804', '#061408', '#00ff66', '#a3e635'] },
    { id: 'tokyonight', name: 'Tokyo Night', desc: 'Vibrant Shibuya neon cyan & violet', swatches: ['#16161e', '#1a1b26', '#7aa2f7', '#bb9af7'] },
    { id: 'solarized', name: 'Solarized Dark', desc: 'Low-contrast precision cyan & gold', swatches: ['#00212b', '#002b36', '#268bd2', '#b58900'] },
    { id: 'zenburn', name: 'Zenburn', desc: 'Low-contrast warm gray & sage', swatches: ['#2b2b2b', '#383838', '#8cd0d3', '#a7caa7'] },
    { id: 'latte', name: 'Catppuccin Latte', label: 'Latte', desc: 'Soft pastel light paper & mauve', swatches: ['#e6e9ef', '#eff1f5', '#7e35de', '#1a5ad8'] },
    { id: 'gruvboxlight', name: 'Gruvbox Light', label: 'Gruvbox L', desc: 'Warm cream paper & forest', swatches: ['#f2e5bc', '#fbf1c7', '#076678', '#67630c'] },
    { id: 'solarizedlight', name: 'Solarized Light', label: 'Solarized L', desc: 'Precision cream & solar cyan', swatches: ['#eee8d5', '#fdf6e3', '#1c679b', '#5a6800'] }
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
    let wrapper = document.getElementById('theme-menu-wrapper');
    let btn = document.getElementById('theme-palette-btn');
    let dropdown = document.getElementById('theme-dropdown-menu');
    const oldToggle = document.getElementById('theme-toggle');

    // If page doesn't have the enhanced theme menu wrapper, construct it or replace old theme-toggle
    if (!wrapper || !dropdown || !btn) {
      const actions = document.querySelector('.header-actions') || document.querySelector('.top-bar-inner');
      if (actions) {
        if (!wrapper) {
          wrapper = document.createElement('div');
          wrapper.id = 'theme-menu-wrapper';
          wrapper.className = 'theme-menu-wrapper';
          wrapper.innerHTML = `
            <button type="button" id="theme-palette-btn" class="action-btn theme-palette-btn" title="Switch Theme (Shift+Click to cycle)" aria-haspopup="true" aria-expanded="false">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"></path>
              </svg>
              <span id="theme-btn-label">Theme</span>
              <svg class="dropdown-caret" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div id="theme-dropdown-menu" class="theme-dropdown-menu">
              <div class="theme-dropdown-header">
                <span>Color Theme</span>
                <span class="theme-count">${THEMES.length} Themes</span>
              </div>
              <div class="theme-options-list"></div>
            </div>
          `;
          if (oldToggle && oldToggle.parentNode) {
            oldToggle.parentNode.replaceChild(wrapper, oldToggle);
          } else {
            actions.appendChild(wrapper);
          }
        }
        btn = document.getElementById('theme-palette-btn');
        dropdown = document.getElementById('theme-dropdown-menu');
      }
    }

    if (oldToggle && wrapper && oldToggle !== wrapper) {
      oldToggle.style.display = 'none';
    }

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

      // Ensure all themes from THEMES array (including Gemini & Clean Light) are rendered
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
    let toastText = document.getElementById('toast-text') || document.getElementById('toast-msg');
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

  // Global keydown handler
  window.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K opens global search
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openGlobalSearch();
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

  // Check URL hash on page load
  window.addEventListener('DOMContentLoaded', () => {
    syncActiveNav();
    setupNavDropdown();
    setupFullscreenObserver();
    injectHeaderControls();
    renderTargetVarsBar();
    enhanceEmptyState();
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
    THEMES
  };

  window.CheatSheetCommon = commonExports;
  window.AppCommon = commonExports;
  window.AntigravityCommon = commonExports;
  window.ClaudeCommon = commonExports;
  window.CodexCommon = commonExports;
})();
