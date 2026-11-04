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
    // New visitors start with the one-line summary; anyone who chose otherwise keeps it.
    collapsed: readStored('dc_vars_collapsed') !== '0',
    vars: Object.assign({}, DEFAULT_TARGET_VARS, readStoredVars())
  };

  function saveTargetState() {
    try {
      localStorage.setItem('dc_vars_active', targetState.active ? '1' : '0');
      localStorage.setItem('dc_vars_collapsed', targetState.collapsed ? '1' : '0');
      localStorage.setItem('dc_target_vars', JSON.stringify(targetState.vars));
    } catch (e) {}
  }

  // -------------------------------------------------------------
  // 1b. SLOTS — "what you see is what you copy"
  // 139 commands hard-code a sample device (mlx5_0, eth0, /dev/nvme0n1,
  // nvidia-smi -i 0) and 79 use <PID>-style placeholders. Rack Targets only
  // rewrote $VARS, so setting HCA to mlx5_4 still copied "mlxlink -d mlx5_0".
  // Slots are those parts of a command: the display shows the value that will
  // be copied, a click edits it, and copying fills it in. A sample is only
  // replaced once the tech has set a value that differs from the default.
  // -------------------------------------------------------------
  const SLOT_TARGETS = {
    hca:   { label: 'HCA', hint: 'RDMA device, e.g. mlx5_4', samples: ['mlx5_0'] },
    iface: { label: 'Interface', hint: 'netdev, e.g. ens1f0np0', samples: ['eth0', 'eno1', 'ens1f0'] },
    disk:  { label: 'Disk', hint: 'block device, e.g. /dev/nvme3n1', samples: ['/dev/nvme0n1', '/dev/sda'] },
    gpu:   { label: 'GPU', hint: 'nvidia-smi index or BDF', samples: [] },
    bmc:   { label: 'BMC', hint: 'BMC IP or host', samples: [] },
    user:  { label: 'BMC user', hint: 'BMC login', samples: [] }
  };
  const SLOT_VAR_NAMES = { HCA: 'hca', IFACE: 'iface', DISK: 'disk', GPU: 'gpu', BMC: 'bmc', BMC_IP: 'bmc', BMC_USER: 'user' };
  const SLOT_STORE_KEY = 'dc_slot_values';
  const SLOT_SKIP = /^(br|b|i|u|p|a|kbd|sub|sup|mark|details|summary|picture|code|span|div|leader|cr|esc|tab|space|bs|del|enter|ctrl|alt|shift|cmd|[ACMSD]-.+)$/i;
  // Literal samples and placeholders, in one pass. $BMC_PASS is never shown or filled here.
  const SLOT_RE = /\$\{?(HCA|IFACE|DISK|GPU|BMC_USER|BMC_IP|BMC)\}?(?![A-Za-z0-9_])|<([A-Za-z][\w.-]{0,24})>|(?<![\w\/.-])(mlx5_0|eth0|eno1|ens1f0)(?![\w.-])|(\/dev\/(?:nvme0n1|sda))(?![\w])/g;

  function slotStore() {
    try { const v = JSON.parse(localStorage.getItem(SLOT_STORE_KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
  }
  function setSlotStore(name, value) {
    const all = slotStore();
    if (value) all[name] = value; else delete all[name];
    try { localStorage.setItem(SLOT_STORE_KEY, JSON.stringify(all)); } catch (e) {}
  }

  // What a slot resolves to right now: { key, value, set, kind }
  function resolveSlot(match, varName, placeholder, ifaceOrHca, disk) {
    let key = null;
    if (varName) key = SLOT_VAR_NAMES[varName];
    else if (ifaceOrHca) key = ifaceOrHca === 'mlx5_0' ? 'hca' : 'iface';
    else if (disk) key = 'disk';
    if (key) {
      const v = String(targetState.vars[key] || '').trim();
      const isVar = !!varName;
      // A literal sample only changes once the tech picked something other than the default.
      const set = targetState.active && !!v && (isVar || v !== DEFAULT_TARGET_VARS[key]);
      return { key, kind: 'target', value: set ? v : match, set, sample: match };
    }
    if (placeholder && !SLOT_SKIP.test(placeholder)) {
      const name = placeholder.toLowerCase();
      const v = String(slotStore()[name] || '').trim();
      return { key: name, kind: 'custom', value: v || match, set: !!v, sample: match, label: placeholder };
    }
    return null;
  }

  function fillSlots(text) {
    return String(text).replace(SLOT_RE, (match, varName, placeholder, ifaceOrHca, disk) => {
      const r = resolveSlot(match, varName, placeholder, ifaceOrHca, disk);
      // $VARS are handled (with the BMC default special cases) by substituteVariables below.
      if (!r || varName) return match;
      return r.set ? r.value : match;
    }).replace(/(\bnvidia-smi\b[^|;&\n]*?\s-i\s+)(\d)(?![\w:.])/g, (m, pre, idx) => {
      const g = String(targetState.vars.gpu || '').trim();
      return targetState.active && g && g !== DEFAULT_TARGET_VARS.gpu ? pre + g : m;
    });
  }

  // Rendered slot for the Command Anatomy display.
  function slotHtml(word, ctx) {
    let out = '';
    let last = 0;
    SLOT_RE.lastIndex = 0;
    let m;
    while ((m = SLOT_RE.exec(word))) {
      const r = resolveSlot(m[0], m[1], m[2], m[3], m[4]);
      if (!r) continue;
      out += escapeHtml(word.slice(last, m.index));
      out += slotChip(r);
      last = m.index + m[0].length;
    }
    out += escapeHtml(word.slice(last));
    // nvidia-smi -i <n>: the GPU index is a slot too.
    if (!out.includes('class="slot') && ctx && ctx.gpuIndexNext && /^\d$/.test(word)) {
      const g = String(targetState.vars.gpu || '').trim();
      const set = targetState.active && g && g !== DEFAULT_TARGET_VARS.gpu;
      return slotChip({ key: 'gpu', kind: 'target', value: set ? g : word, set, sample: word });
    }
    return out;
  }

  function slotChip(r) {
    const meta = SLOT_TARGETS[r.key];
    const label = meta ? meta.label : r.label || r.key;
    return `<span class="slot ${r.set ? 'slot-set' : 'slot-unset'}" data-slot="${escapeHtml(r.key)}" data-slot-kind="${r.kind}" data-sample="${escapeHtml(r.sample)}" title="${escapeHtml(label)}: ${r.set ? 'filled in on copy' : 'click to set'}" tabindex="0" role="button">${escapeHtml(r.value)}</span>`;
  }

  // Keep every chip on the page in step when a value changes.
  function refreshSlots() {
    refreshTargetSummary();
    document.querySelectorAll('.slot[data-slot]').forEach(chip => {
      const key = chip.dataset.slot;
      const sample = chip.dataset.sample;
      let r;
      if (chip.dataset.slotKind === 'target') {
        const v = String(targetState.vars[key] || '').trim();
        const isVar = /^\$/.test(sample);
        const set = targetState.active && !!v && (isVar || v !== DEFAULT_TARGET_VARS[key]);
        r = { value: set ? v : sample, set };
      } else {
        const v = String(slotStore()[key] || '').trim();
        r = { value: v || sample, set: !!v };
      }
      chip.textContent = r.value;
      chip.classList.toggle('slot-set', r.set);
      chip.classList.toggle('slot-unset', !r.set);
    });
  }

  let slotPop = null;
  function openSlotEditor(chip) {
    if (!slotPop) {
      slotPop = document.createElement('div');
      slotPop.className = 'slot-pop';
      slotPop.setAttribute('role', 'dialog');
      document.body.appendChild(slotPop);
      document.addEventListener('mousedown', (e) => {
        if (slotPop.classList.contains('show') && !slotPop.contains(e.target) && !(e.target instanceof Element && e.target.closest('.slot'))) slotPop.classList.remove('show');
      });
      // Follow the chip while the page scrolls; close only once it is off screen.
      window.addEventListener('scroll', () => {
        if (!slotPop.classList.contains('show') || !slotPop._chip) return;
        if (!slotPop._chip.isConnected) return slotPop.classList.remove('show');
        const r = slotPop._chip.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return slotPop.classList.remove('show');
        placeSlotPop(r);
      }, { passive: true });
    }
    slotPop._chip = chip;
    const key = chip.dataset.slot;
    const kind = chip.dataset.slotKind;
    const meta = SLOT_TARGETS[key];
    const current = kind === 'target' ? String(targetState.vars[key] || '') : String(slotStore()[key] || '');
    const label = meta ? meta.label : chip.dataset.sample;
    slotPop.innerHTML = `
      <label class="slot-pop-label">${escapeHtml(label)}<span>${kind === 'target' ? 'Rack target, used on every sheet' : 'remembered for every command that uses ' + escapeHtml(chip.dataset.sample)}</span></label>
      <div class="slot-pop-row">
        <input type="text" spellcheck="false" autocomplete="off" value="${escapeHtml(current)}" placeholder="${escapeHtml(meta ? meta.hint : chip.dataset.sample)}" />
        <button type="button" data-slot-save>Set</button>
        ${kind === 'custom' && current ? '<button type="button" data-slot-clear>Clear</button>' : ''}
      </div>
      ${kind === 'target' && !targetState.active ? '<p class="slot-pop-warn">Rack Targets are switched off, so copies keep the sample value.</p>' : ''}`;
    slotPop.classList.add('show');
    placeSlotPop(chip.getBoundingClientRect());
    const input = slotPop.querySelector('input');
    input.focus();
    input.select();
    const save = (value) => {
      value = value.trim();
      if (kind === 'target') {
        const real = document.getElementById(`var-${key}`);
        targetState.vars[key] = value || DEFAULT_TARGET_VARS[key];
        saveTargetState();
        if (real) real.value = targetState.vars[key];
      } else {
        setSlotStore(key, value);
      }
      refreshSlots();
      slotPop.classList.remove('show');
      chip.focus();
      showGlobalToast(value ? `${label} set to ${value}: copied commands now use it.` : `${label} cleared.`);
    };
    slotPop.querySelector('[data-slot-save]').addEventListener('click', () => save(input.value));
    const clear = slotPop.querySelector('[data-slot-clear]');
    if (clear) clear.addEventListener('click', () => save(''));
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); save(input.value); }
      if (e.key === 'Escape') { e.stopPropagation(); slotPop.classList.remove('show'); chip.focus(); }
    });
  }

  function placeSlotPop(r) {
    const w = slotPop.offsetWidth;
    slotPop.style.left = `${Math.min(Math.max(8, r.left), window.innerWidth - w - 8)}px`;
    slotPop.style.top = `${r.bottom + 6 + slotPop.offsetHeight > window.innerHeight ? r.top - slotPop.offsetHeight - 6 : r.bottom + 6}px`;
  }

  // Commands that change state get a visible tag and a reminder when copied.
  const DANGER_RE = /\b(nvme\s+(format|sanitize|delete-ns|fw-activate|fw-commit)|mkfs(\.\w+)?|wipefs|sgdisk\s+(-Z|--zap)|parted\b[^|;&]*\bmklabel|dd\b[^|;&]*\bof=\/dev|mdadm\b[^|;&]*--(fail|remove|zero-superblock|create|stop)|zpool\s+(destroy|offline|replace|labelclear)|rm\s+-[a-z]*r[a-z]*f|nvidia-smi\b[^|;&]*\s(-r|--gpu-reset)\b|reboot\b|shutdown\b|poweroff\b|chassis\s+power\s+(off|cycle|reset)|power\s+(off|cycle|reset)\b|scontrol\s+update\b[^|;&]*state=|kubectl\s+(drain|cordon|uncordon|delete)|ip\s+link\s+set\b[^|;&]*\bdown\b|mlxfwmanager\b[^|;&]*(-u|--update)|flint\b[^|;&]*\bburn|fwupdmgr\s+(update|install)|sg_reset|echo\s+1\s*>\s*\S*\/remove|rmmod|modprobe\s+-r|sel\s+clear|systemctl\s+(stop|restart)\b|mlxlink\b[^|;&]*--(port_state|rx_prbs|tx_prbs)|mlxconfig\b[^|;&]*\bset\b|mlxfwreset|ethtool\s+(-s|-K|-G|-A|-L|--set-\S+|--change)\s|ip\s+link\s+set\b[^|;&]*\bmtu\b|ipmitool\b[^|;&]*\b(lan\s+set|user\s+set|mc\s+reset|chassis\s+bootdev)|dcgmi\s+diag\s+-r\s*[234]|\b(ib_write_bw|ib_read_bw|ib_send_bw|nvbandwidth|all_reduce_perf|fio)\b|(?<=-)X\s*(POST|PATCH|PUT|DELETE)\b(?![^|;&]*SessionService)|ComputerSystem\.Reset|Manager\.Reset|nv\s+(set|unset)\b|nv\s+config\s+apply|(?<![\w-])config\s+(interface|save|reload|load|apply|qos|vlan|portchannel|bgp)\b|\bclear\s+(counters|ib|interface|mac|arp|ip)\b|\bsonic-clear\b|\bperfquery\b[^|;&]*\s-R\b)/i;

  // Hook clipboard to automatically substitute variables if active
  // Placeholders are uppercase on purpose: lowercase $disk or $hca is a script's
  // own variable, and $USER is the local login, so none of those are rewritten.
  function substituteVariables(text) {
    if (!text) return { text, substituted: false, hasSecret: false };
    const filled = fillSlots(text);
    if (!targetState.active) return { text: filled, substituted: filled !== text, hasSecret: false };
    let result = filled;

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
      recordTrail(text);
      return originalWriteText(newText);
    };
  }

  // -------------------------------------------------------------
  // NODE WORKSPACES
  // A shift covers several nodes, but targets, the Case Trail, runbook progress
  // and placeholder values were one global state: moving to the next node meant
  // retyping five targets, its ticket mixed in the last node's commands, and a
  // runbook showed the previous node's checked steps. Each node is now a named
  // workspace holding all of that; switching swaps it in place. The live keys
  // always belong to the active node; other nodes are stored as snapshots.
  // The session-only BMC password is cleared on switch so it never follows a
  // command to a different BMC.
  // -------------------------------------------------------------
  const NODES_KEY = 'dc_nodes';
  const NODE_DATA_KEYS = ['dc_target_vars', 'dc_case_trail', 'dc_case_trail_meta', 'dc_runbook_runs', 'dc_slot_values'];

  function readNodes() {
    try {
      const r = JSON.parse(localStorage.getItem(NODES_KEY) || '{}');
      return { active: r && typeof r.active === 'string' ? r.active : null, nodes: r && r.nodes && typeof r.nodes === 'object' ? r.nodes : {} };
    } catch (e) { return { active: null, nodes: {} }; }
  }
  function writeNodes(reg) { try { localStorage.setItem(NODES_KEY, JSON.stringify(reg)); } catch (e) {} }
  function nodeSnapshot() {
    const data = {};
    NODE_DATA_KEYS.forEach(k => { try { data[k] = localStorage.getItem(k); } catch (e) { data[k] = null; } });
    return { data, t: Date.now() };
  }
  function nodeRestore(data) {
    NODE_DATA_KEYS.forEach(k => {
      try { if (data && data[k] != null) localStorage.setItem(k, data[k]); else localStorage.removeItem(k); } catch (e) {}
    });
  }
  const cleanNodeName = s => String(s || '').trim().replace(/\s+/g, '-').replace(/[^\w.:@-]/g, '').slice(0, 48);

  // What the picker shows for a node: live state for the active one, its snapshot otherwise.
  function nodeSummary(name, reg) {
    const live = name === reg.active;
    const get = k => (live ? (() => { try { return localStorage.getItem(k); } catch (e) { return null; } })() : (reg.nodes[name] && reg.nodes[name].data ? reg.nodes[name].data[k] : null));
    let vars = {}, trail = [], runs = {}, meta = {};
    try { vars = JSON.parse(get('dc_target_vars') || '{}') || {}; } catch (e) {}
    try { trail = JSON.parse(get('dc_case_trail') || '[]') || []; } catch (e) {}
    try { runs = JSON.parse(get('dc_runbook_runs') || '{}') || {}; } catch (e) {}
    try { meta = JSON.parse(get('dc_case_trail_meta') || '{}') || {}; } catch (e) {}
    const active = Object.entries(runs).map(([id, run]) => {
      const rb = typeof RUNBOOKS !== 'undefined' ? RUNBOOKS.find(r => r.id === id) : null;
      if (!rb || !run) return null;
      const merged = Object.assign({ done: {}, picks: {} }, run);
      const p = rbProgress(rb, merged);
      return p.done ? `${rb.icon} ${p.done}/${p.total}` : null;
    }).filter(Boolean);
    return { bmc: vars.bmc && vars.bmc !== DEFAULT_TARGET_VARS.bmc ? vars.bmc : '', trail: Array.isArray(trail) ? trail.length : 0, runbooks: active, caseId: meta.caseId || '', t: live ? Date.now() : (reg.nodes[name] && reg.nodes[name].t) || 0 };
  }

  // Re-read the live keys into memory and redraw everything that shows them.
  function applyNodeState() {
    targetState.vars = Object.assign({}, DEFAULT_TARGET_VARS, readStoredVars());
    targetState.pass = '';
    saveSessionPass('');
    renderTargetVarsBar();
    refreshSlots();
    if (typeof refreshTrailUi === 'function') refreshTrailUi(false);
    if (trailDrawer && trailDrawer.classList.contains('open')) {
      const ci = trailDrawer.querySelector('#trail-case-id');
      if (ci) ci.value = trailMeta().caseId;
    }
    if (typeof rbActive !== 'undefined' && document.getElementById('tab-runbook')) {
      if (rbActive) renderRunbook(rbActive.id); else renderRunbookPicker();
    }
    const lp = document.getElementById('launchpad');
    if (lp && lp._sync) lp._sync();
    document.dispatchEvent(new CustomEvent('dc:node-changed'));
  }

  function switchNode(rawName) {
    const name = cleanNodeName(rawName);
    if (!name) return;
    const reg = readNodes();
    if (reg.active === name) return showGlobalToast(`Already on ${name}.`);
    const creating = !reg.nodes[name];
    if (reg.active) reg.nodes[reg.active] = nodeSnapshot();
    else if (Object.keys(reg.nodes).length === 0 && (readTrail().length || JSON.stringify(targetState.vars) !== JSON.stringify(DEFAULT_TARGET_VARS))) {
      // Work done before nodes existed is kept, not discarded.
      reg.nodes['unsaved-work'] = nodeSnapshot();
    }
    if (creating) {
      // A new node starts clean, keeping only the BMC login name.
      const vars = Object.assign({}, DEFAULT_TARGET_VARS, { user: targetState.vars.user || DEFAULT_TARGET_VARS.user });
      reg.nodes[name] = { t: Date.now(), data: { dc_target_vars: JSON.stringify(vars), dc_case_trail: null, dc_case_trail_meta: JSON.stringify({ caseId: name, paused: false, introduced: true }), dc_runbook_runs: null, dc_slot_values: null } };
    }
    nodeRestore(reg.nodes[name].data);
    reg.active = name;
    delete reg.nodes[name];   // the live keys are its copy now
    writeNodes(reg);
    applyNodeState();
    showGlobalToast(creating
      ? `New node ${name}: set its BMC/HCA/GPU and start a fresh trail. BMC password cleared.`
      : `Switched to ${name}: its targets, trail and runbook progress are back. BMC password cleared.`);
  }

  // Name the current (unsaved) state as a node without resetting anything.
  function nameCurrentNode(rawName) {
    const name = cleanNodeName(rawName);
    if (!name) return;
    const reg = readNodes();
    if (reg.nodes[name] && reg.active !== name) return switchNode(name);
    reg.active = name;
    delete reg.nodes[name];
    const meta = trailMeta();
    if (!meta.caseId) saveTrailMeta({ caseId: name });
    writeNodes(reg);
    applyNodeState();
    showGlobalToast(`This workspace is now ${name}.`);
  }

  function removeNode(name) {
    const reg = readNodes();
    if (name === reg.active || !reg.nodes[name]) return;
    delete reg.nodes[name];
    writeNodes(reg);
  }

  // Remove any node, including the one you are on: switch to the most recent other
  // node first, or, if it was the last one, clear the workspace back to unnamed.
  function deleteNode(name) {
    const reg = readNodes();
    if (name !== reg.active) { removeNode(name); return { action: 'removed' }; }
    const others = Object.keys(reg.nodes).filter(n => n !== name).sort((a, b) => (reg.nodes[b].t || 0) - (reg.nodes[a].t || 0));
    if (others.length) { switchNode(others[0]); removeNode(name); return { action: 'switched', to: others[0] }; }
    NODE_DATA_KEYS.forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
    reg.active = null;
    writeNodes(reg);
    applyNodeState();
    return { action: 'cleared' };
  }

  function renameActiveNode(rawName) {
    const name = cleanNodeName(rawName);
    const reg = readNodes();
    if (!name || !reg.active || reg.nodes[name]) return;
    const meta = trailMeta();
    if (meta.caseId === reg.active) saveTrailMeta({ caseId: name });
    reg.active = name;
    writeNodes(reg);
    applyNodeState();
  }

  function nodeChipHtml() {
    const reg = readNodes();
    return `<button type="button" class="node-chip ${reg.active ? '' : 'is-unnamed'}" data-node-picker aria-haspopup="dialog" title="Node workspace: targets, trail and runbook progress for one machine">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3" y="4" width="18" height="7" rx="1.5"/><rect x="3" y="13" width="18" height="7" rx="1.5"/><path d="M7 7.5h.01M7 16.5h.01"/></svg>
      <span>${escapeHtml(reg.active || 'Name this node')}</span><span class="node-caret" aria-hidden="true">▾</span></button>`;
  }

  let nodePop = null;
  function openNodePicker(anchor) {
    if (!nodePop) {
      nodePop = document.createElement('div');
      nodePop.className = 'node-pop';
      nodePop.setAttribute('role', 'dialog');
      nodePop.setAttribute('aria-label', 'Node workspaces');
      document.body.appendChild(nodePop);
      document.addEventListener('mousedown', (e) => {
        if (nodePop.classList.contains('show') && !nodePop.contains(e.target) && !(e.target instanceof Element && e.target.closest('[data-node-picker]'))) nodePop.classList.remove('show');
      });
      nodePop.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); nodePop.classList.remove('show'); } });
      nodePop.addEventListener('click', (e) => {
        const el = e.target instanceof Element ? e.target : null;
        if (!el) return;
        const sw = el.closest('[data-node-switch]');
        const rm = el.closest('[data-node-remove]');
        const act = el.closest('[data-node-act]');
        if (rm) { e.stopPropagation(); removeNode(rm.dataset.nodeRemove); return renderNodePop(); }
        if (sw) { nodePop.classList.remove('show'); return switchNode(sw.dataset.nodeSwitch); }
        if (el.closest('[data-node-board]')) { nodePop.classList.remove('show'); return openBoard(); }
        if (act) submitNodeForm(act.dataset.nodeAct);
      });
      nodePop.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) { e.preventDefault(); submitNodeForm(e.target.dataset.nodeInput); }
      });
    }
    renderNodePop();
    nodePop.classList.add('show');
    const r = anchor.getBoundingClientRect();
    const w = nodePop.offsetWidth;
    nodePop.style.left = `${Math.min(Math.max(8, r.left), window.innerWidth - w - 8)}px`;
    nodePop.style.top = `${r.bottom + 6 + nodePop.offsetHeight > window.innerHeight ? Math.max(8, r.top - nodePop.offsetHeight - 6) : r.bottom + 6}px`;
    const input = nodePop.querySelector('input');
    if (input) input.focus();
  }

  function submitNodeForm(kind) {
    const input = nodePop.querySelector(`[data-node-input="${kind}"]`);
    const value = input ? input.value : '';
    if (!cleanNodeName(value)) { if (input) input.focus(); return; }
    nodePop.classList.remove('show');
    if (kind === 'name') nameCurrentNode(value);
    else if (kind === 'rename') renameActiveNode(value);
    else switchNode(value);
  }

  function renderNodePop() {
    const reg = readNodes();
    const names = Object.keys(reg.nodes).filter(n => n !== reg.active).sort((a, b) => (reg.nodes[b].t || 0) - (reg.nodes[a].t || 0));
    const row = (name, active) => {
      const s = nodeSummary(name, reg);
      const bits = [s.bmc && `BMC ${s.bmc}`, `${s.trail} copied`, ...s.runbooks].filter(Boolean).join(' · ');
      return `<li class="node-row ${active ? 'is-active' : ''}">
        <button type="button" class="node-row-main" ${active ? 'disabled' : `data-node-switch="${escapeHtml(name)}"`}>
          <span class="node-dot" aria-hidden="true"></span>
          <span class="node-row-text"><b>${escapeHtml(name)}</b><small>${escapeHtml(bits)}${!active && s.t ? ` · ${lpAgo(s.t)}` : ''}</small></span>
          ${active ? '<span class="node-tag">active</span>' : '<span class="node-tag">switch</span>'}
        </button>
        ${active ? '' : `<button type="button" class="node-remove" data-node-remove="${escapeHtml(name)}" title="Forget ${escapeHtml(name)}" aria-label="Forget ${escapeHtml(name)}">✕</button>`}
      </li>`;
    };
    nodePop.innerHTML = `
      <div class="node-pop-head"><b>Node workspaces</b><span>Each keeps its own targets, Case Trail, runbook progress and placeholders.</span></div>
      ${reg.active ? `<ul class="node-list">${row(reg.active, true)}</ul>` : `
        <div class="node-form"><label>Name what you're working on now<span>Keeps the current targets, trail and runbook progress.</span></label>
          <div class="node-form-row"><input type="text" data-node-input="name" placeholder="gpu-node-07" spellcheck="false" autocomplete="off" /><button type="button" data-node-act="name">Save</button></div></div>`}
      ${names.length ? `<ul class="node-list">${names.map(n => row(n, false)).join('')}</ul>` : ''}
      <div class="node-form"><label>${reg.active ? 'Switch to a new node' : 'Or start a fresh node'}<span>Starts with empty targets and an empty trail.</span></label>
        <div class="node-form-row"><input type="text" data-node-input="new" placeholder="gpu-node-08" spellcheck="false" autocomplete="off" /><button type="button" data-node-act="new">Start</button></div></div>
      <button type="button" class="node-board-link" data-node-board>Shift board &amp; handoff for all nodes →</button>
      ${reg.active ? `<div class="node-form node-rename"><div class="node-form-row"><input type="text" data-node-input="rename" placeholder="Rename ${escapeHtml(reg.active)}…" spellcheck="false" autocomplete="off" /><button type="button" data-node-act="rename">Rename</button></div></div>` : ''}`;
  }

  // -------------------------------------------------------------
  // SHIFT BOARD & HANDOFF
  // Node workspaces kept each machine's state, but nothing showed them side by
  // side: a node's RMA verdict was only visible after switching to it and
  // opening its runbook, and the incoming shift had no list of open nodes.
  // The board summarises every workspace (status, verdict, progress, next
  // steps, findings, last commands) and exports one handoff document.
  // -------------------------------------------------------------
  const BOARD_STATUS = {
    crit: { label: 'Critical', order: 4 }, rma: { label: 'RMA', order: 3 },
    progress: { label: 'In progress', order: 2 }, ok: { label: 'Resolved', order: 1 }, idle: { label: 'Idle', order: 0 }
  };

  function nodeDetail(name, reg) {
    const live = name === reg.active;
    const get = k => {
      if (live) { try { return localStorage.getItem(k); } catch (e) { return null; } }
      return reg.nodes[name] && reg.nodes[name].data ? reg.nodes[name].data[k] : null;
    };
    const parse = (k, fallback) => { try { const v = JSON.parse(get(k) || 'null'); return v == null ? fallback : v; } catch (e) { return fallback; } };
    const vars = Object.assign({}, DEFAULT_TARGET_VARS, parse('dc_target_vars', {}));
    const trail = parse('dc_case_trail', []);
    const runs = parse('dc_runbook_runs', {});
    const meta = parse('dc_case_trail_meta', {});
    const books = Object.entries(runs || {}).map(([id, raw]) => {
      const rb = RUNBOOKS.find(r => r.id === id);
      if (!rb || !raw) return null;
      const run = Object.assign({ done: {}, notes: {}, picks: {}, unlocked: {}, started: null }, raw);
      const prog = rbProgress(rb, run);
      if (!prog.done && !Object.keys(run.notes).length) return null;
      const v = rbVerdict(rb, run);
      const open = rbSteps(rb).filter(st => !stepStatus(st, run)).slice(0, 3).map(st => st.title);
      const notes = rbSteps(rb).filter(st => run.notes[st.id]).map(st => ({ step: st.title, note: run.notes[st.id] }));
      return { rb, run, prog, v, open, notes };
    }).filter(Boolean).sort((a, b) => (b.run.started || 0) - (a.run.started || 0));
    let status = 'idle';
    books.forEach(bk => {
      const s = !bk.v ? 'progress' : bk.v.opt.sev === 'crit' ? 'crit' : bk.v.opt.rma ? 'rma' : 'ok';
      if (BOARD_STATUS[s].order > BOARD_STATUS[status].order) status = s;
    });
    if (status === 'idle' && Array.isArray(trail) && trail.length) status = 'progress';
    const lastT = Math.max(Array.isArray(trail) && trail.length ? trail[trail.length - 1].t : 0, ...books.map(b => b.run.started || 0), live ? 0 : (reg.nodes[name] && reg.nodes[name].t) || 0);
    return { name, live, vars, trail: Array.isArray(trail) ? trail : [], meta, books, status, lastT };
  }

  function boardNodes() {
    const reg = readNodes();
    const names = [...new Set([reg.active, ...Object.keys(reg.nodes)].filter(Boolean))];
    return names.map(n => nodeDetail(n, reg)).sort((a, b) => BOARD_STATUS[b.status].order - BOARD_STATUS[a.status].order || b.lastT - a.lastT);
  }

  function boardCardHtml(d, compact) {
    const bk = d.books[0];
    const targets = [d.vars.bmc !== DEFAULT_TARGET_VARS.bmc && `BMC ${d.vars.bmc}`, d.vars.gpu !== DEFAULT_TARGET_VARS.gpu && `GPU ${d.vars.gpu}`, d.vars.hca !== DEFAULT_TARGET_VARS.hca && d.vars.hca, d.vars.disk !== DEFAULT_TARGET_VARS.disk && d.vars.disk].filter(Boolean).join(' · ');
    const notes = d.books.flatMap(b => b.notes).slice(0, compact ? 1 : 3);
    const lastCmds = d.trail.slice(-(compact ? 1 : 3)).reverse();
    return `
      <article class="board-card st-${d.status} ${d.live ? 'is-live' : ''}">
        <header class="board-card-head">
          <span class="board-status">${BOARD_STATUS[d.status].label}</span>
          <h3>${escapeHtml(d.name)}</h3>
          ${d.live ? '<span class="board-live">current</span>' : ''}
          <span class="board-ago">${d.lastT ? lpAgo(d.lastT) : ''}</span>
        </header>
        ${d.meta.caseId && d.meta.caseId !== d.name ? `<div class="board-case">${escapeHtml(d.meta.caseId)}</div>` : ''}
        ${targets ? `<div class="board-targets">${escapeHtml(targets)}</div>` : ''}
        ${bk ? `
          <div class="board-rb">
            <span class="board-rb-title">${bk.rb.icon} ${escapeHtml(bk.rb.title)}</span>
            <span class="rb-meter"><span style="width:${Math.round(bk.prog.done / bk.prog.total * 100)}%"></span></span>
            <span class="board-rb-n">${bk.prog.done}/${bk.prog.total}</span>
          </div>
          ${bk.v ? `<p class="board-verdict">${escapeHtml(bk.v.opt.verdict)}</p>` : ''}
          ${bk.open.length && !compact ? `<div class="board-next"><b>Next</b><ul>${bk.open.map(t => `<li>${escapeHtml(t)}</li>`).join('')}</ul></div>` : ''}
          ${d.books.length > 1 ? `<div class="board-more">+${d.books.length - 1} more runbook${d.books.length > 2 ? 's' : ''}</div>` : ''}` : `<p class="board-empty">${d.trail.length ? `${d.trail.length} command${d.trail.length === 1 ? '' : 's'} copied, no runbook started.` : 'Nothing recorded yet.'}</p>`}
        ${notes.length ? `<ul class="board-notes">${notes.map(n => `<li><span>${escapeHtml(n.step)}</span>${escapeHtml(n.note)}</li>`).join('')}</ul>` : ''}
        ${lastCmds.length ? `<div class="board-cmds">${lastCmds.map(e => `<code title="${escapeHtml(e.sheet)} · ${trailTime(e.t)}">${escapeHtml(e.cmd)}</code>`).join('')}</div>` : ''}
        <footer class="board-actions">
          <button type="button" class="board-primary" data-board-resume="${escapeHtml(d.name)}" ${bk ? `data-board-rb="${bk.rb.id}"` : ''}>${d.live ? (bk ? 'Open runbook' : 'Open trail') : 'Resume'}</button>
          ${d.trail.length ? `<button type="button" data-board-trail="${escapeHtml(d.name)}">Trail (${d.trail.length})</button>` : ''}
          <button type="button" class="board-remove" data-board-remove="${escapeHtml(d.name)}" title="Remove ${escapeHtml(d.name)} and its trail and runbook progress">Remove</button>
        </footer>
      </article>`;
  }

  function handoffMarkdown(nodes) {
    const now = Date.now();
    const lines = [`## Shift handoff — ${trailDate(now)} ${trailTime(now).slice(0, 5)}`, `_${nodes.length} node${nodes.length === 1 ? '' : 's'}: ${Object.keys(BOARD_STATUS).map(s => [s, nodes.filter(n => n.status === s).length]).filter(([, c]) => c).map(([s, c]) => `${c} ${BOARD_STATUS[s].label.toLowerCase()}`).join(', ')}_`, ''];
    nodes.forEach(d => {
      lines.push(`### ${d.name}${d.meta.caseId && d.meta.caseId !== d.name ? ` — ${d.meta.caseId}` : ''} · ${BOARD_STATUS[d.status].label}`);
      const t = [d.vars.bmc !== DEFAULT_TARGET_VARS.bmc && `BMC ${d.vars.bmc}`, d.vars.gpu !== DEFAULT_TARGET_VARS.gpu && `GPU ${d.vars.gpu}`, d.vars.hca !== DEFAULT_TARGET_VARS.hca && `HCA ${d.vars.hca}`, d.vars.disk !== DEFAULT_TARGET_VARS.disk && `disk ${d.vars.disk}`].filter(Boolean);
      if (t.length) lines.push(`- **Targets:** ${t.join(' · ')}`);
      d.books.forEach(bk => {
        lines.push(`- **Runbook:** ${bk.rb.title} (${bk.prog.done}/${bk.prog.total})${bk.v ? ` → **${bk.v.opt.verdict}**` : ''}`);
        if (bk.open.length) lines.push(`  - Next: ${bk.open.join('; ')}`);
        bk.notes.forEach(n => lines.push(`  - Finding (${n.step}): ${n.note}`));
      });
      if (!d.books.length) lines.push(`- No runbook started.`);
      if (d.trail.length) {
        lines.push(`- **Last commands:**`);
        d.trail.slice(-3).forEach(e => lines.push(`  - \`${trailTime(e.t).slice(0, 5)}\` \`${e.cmd.split('\n')[0]}\``));
      }
      lines.push('');
    });
    return lines.join('\n').trim();
  }

  function printHandoff(nodes) {
    const md = handoffMarkdown(nodes);
    const html = md.split('\n').map(l => {
      if (l.startsWith('## ')) return `<h1>${escapeHtml(l.slice(3))}</h1>`;
      if (l.startsWith('### ')) return `<h2>${escapeHtml(l.slice(4))}</h2>`;
      if (/^_.*_$/.test(l)) return `<p class="m">${escapeHtml(l.slice(1, -1))}</p>`;
      if (/^\s{2}- /.test(l)) return `<p class="i">${escapeHtml(l.trim().slice(2))}</p>`;
      if (l.startsWith('- ')) return `<p>${escapeHtml(l.slice(2))}</p>`;
      return '';
    }).join('').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/`([^`]+)`/g, '<code>$1</code>');
    const frame = document.createElement('iframe');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    document.body.appendChild(frame);
    frame.onload = () => { try { frame.contentWindow.focus(); frame.contentWindow.print(); } catch (e) {} setTimeout(() => frame.remove(), 60000); };
    frame.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Shift handoff</title><style>
      @page { margin: 0.5in; } body { font: 10pt/1.4 -apple-system, "Segoe UI", Roboto, sans-serif; color: #111; }
      h1 { font-size: 15pt; margin: 0 0 2pt; } h2 { font-size: 11.5pt; margin: 12pt 0 3pt; padding-bottom: 2pt; border-bottom: 1px solid #999; break-after: avoid; }
      p { margin: 2pt 0; } p.m { color: #555; margin-bottom: 8pt; } p.i { margin-left: 14pt; color: #333; }
      code { font: 8.5pt "JetBrains Mono", Menlo, Consolas, monospace; background: #f1f3f5; padding: 0 2pt; border-radius: 2px; }
    </style></head><body>${html}</body></html>`;
  }

  let boardEl = null;
  function openBoard() {
    if (!boardEl) {
      boardEl = document.createElement('div');
      boardEl.className = 'an-backdrop board-backdrop';
      boardEl.innerHTML = `
        <div class="an-dialog board-dialog" role="dialog" aria-modal="true" aria-labelledby="board-title">
          <header class="an-head">
            <div><h2 id="board-title">Shift board</h2><p>Every node workspace at a glance, worst first. Resume one, or hand the whole shift over.</p></div>
            <button type="button" class="trail-close" data-board-close aria-label="Close shift board">✕</button>
          </header>
          <div class="an-body"><div class="board-grid"></div></div>
          <footer class="board-foot">
            <button type="button" class="board-primary" data-board-act="copy">Copy shift handoff</button>
            <button type="button" data-board-act="print">Print handoff</button>
            <button type="button" data-board-act="new">+ New node</button>
          </footer>
        </div>`;
      document.body.appendChild(boardEl);
      boardEl.addEventListener('click', (e) => {
        if (e.target === boardEl || (e.target instanceof Element && e.target.closest('[data-board-close]'))) return closeBoard();
        const act = e.target instanceof Element ? e.target.closest('[data-board-act]') : null;
        if (act) {
          const nodes = boardNodes();
          if (act.dataset.boardAct === 'copy') { copyVerbatim(handoffMarkdown(nodes)); showGlobalToast(`Copied the shift handoff (${nodes.length} nodes).`); }
          if (act.dataset.boardAct === 'print') printHandoff(nodes);
          if (act.dataset.boardAct === 'new') { closeBoard(); const chip = document.querySelector('.node-chip'); if (chip) openNodePicker(chip); }
          return;
        }
        handleBoardClick(e, closeBoard);
      });
      boardEl.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeBoard(); } });
    }
    const nodes = boardNodes();
    boardEl.querySelector('.board-grid').innerHTML = nodes.length
      ? nodes.map(d => boardCardHtml(d, false)).join('')
      : '<div class="trail-empty"><p><b>No nodes yet.</b> Name the machine you are working on with the node chip at the start of the Rack Targets line, then start a runbook. Each node shows up here.</p></div>';
    boardEl.querySelectorAll('[data-board-act="copy"], [data-board-act="print"]').forEach(b => { b.disabled = !nodes.length; });
    boardEl.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => boardEl.querySelector('.trail-close').focus(), 40);
  }
  function closeBoard() {
    if (!boardEl || !boardEl.classList.contains('show')) return;
    boardEl.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Shared by the board dialog and the home page section.
  function handleBoardClick(e, before) {
    const el = e.target instanceof Element ? e.target : null;
    if (!el) return;
    const rm = el.closest('[data-board-remove]');
    if (rm) {
      const name = rm.dataset.boardRemove;
      // Two clicks: removing deletes the node's trail and runbook progress.
      if (rm.dataset.confirm !== '1') {
        rm.dataset.confirm = '1';
        rm.textContent = 'Click again to remove';
        setTimeout(() => { if (rm.isConnected) { rm.dataset.confirm = ''; rm.textContent = 'Remove'; } }, 3000);
        return;
      }
      const res = deleteNode(name);
      setTimeout(() => showGlobalToast(res.action === 'switched' ? `Removed ${name}; you are now on ${res.to}.` : res.action === 'cleared' ? `Removed ${name}; the workspace is now unnamed and empty.` : `Removed ${name}.`), res.action === 'switched' ? 2300 : 0);
      if (boardEl && boardEl.classList.contains('show')) openBoard();
      const lp = document.getElementById('launchpad');
      if (lp && lp._sync) lp._sync();
      return;
    }
    const resume = el.closest('[data-board-resume]');
    const trail = el.closest('[data-board-trail]');
    const target = resume || trail;
    if (!target) return;
    const name = resume ? resume.dataset.boardResume : trail.dataset.boardTrail;
    if (before) before();
    if (readNodes().active !== name) switchNode(name);
    setTimeout(() => {
      if (trail) return openTrail();
      if (resume.dataset.boardRb) openRunbook(resume.dataset.boardRb); else openTrail();
    }, 30);
  }

  // Collapsed Rack Targets: one line of live values instead of a hidden form.
  function targetSummaryHtml() {
    const rows = [['bmc', '$BMC'], ['user', '$BMC_USER'], ['iface', '$IFACE'], ['hca', '$HCA'], ['disk', '$DISK'], ['gpu', '$GPU']];
    const chips = rows.map(([k, tag]) => {
      const v = String(targetState.vars[k] || '').trim();
      const set = !!v && v !== DEFAULT_TARGET_VARS[k];
      return `<button type="button" class="target-chip ${set ? 'is-set' : ''}" data-target-edit="${k}" title="Edit ${tag}"><b>${tag}</b>${escapeHtml(v || '—')}</button>`;
    }).join('');
    const pass = targetState.pass ? '<span class="target-chip is-set is-static"><b>$BMC_PASS</b>•••• this tab</span>' : '';
    return `<span class="target-summary ${targetState.active ? '' : 'is-off'}">${chips}${pass}</span>`;
  }

  function refreshTargetSummary() {
    const sum = document.querySelector('#target-vars-container .target-summary');
    if (sum) sum.outerHTML = targetSummaryHtml();
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

    if (!container.dataset.chipBound) {
      container.dataset.chipBound = '1';
      container.addEventListener('click', (e) => {
        const picker = e.target instanceof Element ? e.target.closest('[data-node-picker]') : null;
        if (picker) return openNodePicker(picker);
        const chip = e.target instanceof Element ? e.target.closest('[data-target-edit]') : null;
        if (!chip) return;
        targetState.collapsed = false;
        saveTargetState();
        renderTargetVarsBar();
        const input = document.getElementById(`var-${chip.dataset.targetEdit}`);
        if (input) { input.focus(); input.select(); }
      });
    }
    container.innerHTML = `
      <div class="container target-vars-inner ${targetState.collapsed ? 'is-collapsed' : ''}">
        <div class="target-vars-header">
          <div class="target-vars-title">
            ${nodeChipHtml()}
            <span class="target-badge">🎯 RACK TARGETS</span>
            ${targetState.collapsed ? targetSummaryHtml() : '<span class="target-subtitle">Live variables auto-substitute into all copyable commands</span>'}
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
          <input type="text" id="palette-search-input" placeholder="Search ${searchIndexSummary()} — or paste a log line (Xid, EDAC, AER, SEL)…" autocomplete="off" spellcheck="false" />
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
    interceptOutputPaste(searchInput, closeGlobalSearch);
    searchResults = document.getElementById('palette-results');
    searchCount = document.getElementById('palette-stats');

    // Close on backdrop click
    searchBackdrop.addEventListener('click', (e) => {
      if (e.target === searchBackdrop) {
        closeGlobalSearch();
      }
    });

    // Symptom decoder: copy a step, open its sheet, or try a sample line.
    searchResults.addEventListener('click', (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const copy = el.closest('[data-dec-copy]');
      const open = el.closest('[data-dec-open]');
      const sample = el.closest('[data-dec-sample]');
      if (el.closest('[data-dec-analyze]')) { closeGlobalSearch(); openAnalyzer(); return; }
      const runbook = el.closest('[data-dec-runbook]');
      if (runbook) {
        closeGlobalSearch();
        openRunbook(runbook.dataset.decRunbook);
        return;
      }
      if (copy) {
        navigator.clipboard.writeText(copy.dataset.decCopy);
        copy.textContent = 'Copied';
        copy.classList.add('copied');
        setTimeout(() => { copy.textContent = 'Copy'; copy.classList.remove('copied'); }, 1400);
      } else if (open) {
        openSearchResult(open.dataset.decOpen, '');
      } else if (sample) {
        searchInput.value = sample.dataset.decSample;
        searchActiveIndex = 0;
        renderGlobalSearchResults(searchInput.value);
        searchInput.focus();
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

  // -------------------------------------------------------------
  // SYMPTOM DECODER
  // Paste a raw log line (dmesg Xid, EDAC, AER, SEL, NVMe, IB) or type an
  // error code into the palette and get a diagnosis card: what it means,
  // severity, which layer it lives in, and the next read-only commands with
  // the device the line names already filled in. Every command here is
  // read-only; anything intrusive is described in `next`, never copied.
  // -------------------------------------------------------------
  const SEV = { crit: 'Critical', warn: 'Warning', info: 'Info' };

  const XID_TABLE = {
    13: { sev: 'warn', layer: 'Software / application', title: 'Graphics engine exception', meaning: 'Usually an application fault such as an out-of-range memory access. If it repeats across different jobs on the same GPU, treat it as a hardware suspect.', next: 'Check whether other jobs on this GPU hit it too. If it follows the GPU rather than the job, drain the node and run dcgmi diag -r 3.' },
    31: { sev: 'warn', layer: 'Software / application', title: 'GPU memory page fault (MMU fault)', meaning: 'An application touched memory it does not own. Almost always a user code or framework bug, rarely the driver.', next: 'Hand back to the job owner with the PID and timestamp. Only escalate if it repeats with known-good workloads.' },
    43: { sev: 'warn', layer: 'Software / application', title: 'GPU stopped processing', meaning: 'The GPU stopped running the work it was given, usually an application or driver fault. The GPU is normally still healthy.', next: 'Check for a preceding Xid. If it recurs with no app change, capture nvidia-bug-report.sh.' },
    45: { sev: 'info', layer: 'Software / transient', title: 'Preemptive cleanup', meaning: 'The driver is cleaning up after a process was killed, often because of an earlier Xid. On its own it is not a fault.', next: 'Look at the Xid logged just before this one. That is the real event.' },
    48: { sev: 'crit', layer: 'Hard silicon (HBM)', title: 'Double-bit ECC error (DBE)', meaning: 'Uncorrectable memory error on the GPU. The running job is lost. The GPU may remap the row on next reset.', next: 'Drain the node, then reset the GPU (ask first). If remapping failed or DBEs recur, RMA the GPU.' },
    61: { sev: 'crit', layer: 'Firmware / silicon', title: 'Internal micro-controller breakpoint', meaning: 'The GPU\'s internal controller hit a fault. Work on the GPU stalls.', next: 'Drain and reset the GPU or reboot (ask first). Recurring after a driver update → driver/VBIOS issue; recurring otherwise → RMA.' },
    62: { sev: 'crit', layer: 'Firmware / silicon', title: 'Internal micro-controller halt', meaning: 'The GPU\'s internal controller halted. The GPU is unusable until reset.', next: 'Drain, reset or reboot (ask first), and capture nvidia-bug-report.sh. Recurring → RMA.' },
    63: { sev: 'warn', layer: 'Hard silicon (HBM)', title: 'ECC page retirement / row remap recorded', meaning: 'The GPU recorded a bad memory row to retire or remap. Usually handled cleanly, but it takes effect only after a GPU reset.', next: 'Check remapped rows. If "Pending: Yes", schedule a drain and GPU reset.' },
    64: { sev: 'crit', layer: 'Hard silicon (HBM)', title: 'Row remap / page retirement failure', meaning: 'The GPU could not record a bad memory row. No spare rows are left, or the remap failed. Hard failure.', next: 'Drain the node and open an RMA for this GPU with serial, BDF and the remap counts.' },
    74: { sev: 'crit', layer: 'NVLink / Layer-1', title: 'NVLink error', meaning: 'An NVLink lane between this GPU and the NVSwitch/peer failed or retrained. Multi-GPU jobs fail or slow down.', next: 'Check which link. Correlate with Fabric Manager logs and SXids. Repeated on one link → baseboard / GPU seating → RMA.' },
    79: { sev: 'crit', layer: 'PCIe / power / Layer-1', title: 'GPU has fallen off the bus', meaning: 'The GPU stopped responding on PCIe. Causes: power delivery, thermal, riser/cable, or a failed GPU. Driver cannot reach it until reset or reboot.', next: 'Run nvidia-bug-report.sh before rebooting. Check SEL for PSU/thermal events at the same time. Reseat the GPU / riser if it recurs, then RMA.' },
    92: { sev: 'warn', layer: 'Hard silicon (HBM)', title: 'High single-bit ECC error rate', meaning: 'Correctable memory errors are arriving fast. Memory is degrading even though jobs still run.', next: 'Trend the volatile and aggregate SBE counts. Rising → plan a drain and RMA.' },
    94: { sev: 'warn', layer: 'Hard silicon (HBM)', title: 'Contained ECC error', meaning: 'Uncorrectable memory error that the GPU contained to one application. Other work on the GPU is unaffected.', next: 'Restart the affected job. Check row remap status. Repeated on the same GPU → RMA.' },
    95: { sev: 'crit', layer: 'Hard silicon (HBM)', title: 'Uncontained ECC error', meaning: 'Uncorrectable memory error the GPU could not isolate. All work on the GPU is affected.', next: 'Drain the node and reset the GPU (ask first). Check row remap. Recurring → RMA.' },
    119: { sev: 'crit', layer: 'Firmware / driver (GSP)', title: 'GSP RPC timeout', meaning: 'The driver timed out talking to the GPU System Processor. The GPU is hung.', next: 'Capture nvidia-bug-report.sh, drain and reset/reboot (ask first). Fleet-wide → driver version issue, not hardware.' },
    120: { sev: 'crit', layer: 'Firmware / driver (GSP)', title: 'GSP error', meaning: 'The GPU System Processor reported an error. Usually needs a GPU reset.', next: 'Capture nvidia-bug-report.sh, drain and reset (ask first). Compare driver/VBIOS with healthy nodes.' },
    154: { sev: 'crit', layer: 'Recovery action', title: 'GPU recovery action changed', meaning: 'The driver is telling you what it needs to recover: the text after "to" (GPU Reset Required, Node Reboot Required, Drain and Reset…) is the instruction.', next: 'Do exactly the action named in the message, after draining (ask first).' }
  };

  const DECODER_RULES = [
    {
      id: 'xid',
      test: q => /\bxid\b/i.test(q) && xidNumber(q) !== null,
      build: (q, ent) => {
        const n = xidNumber(q);
        const x = XID_TABLE[n] || { sev: 'warn', layer: 'GPU', title: 'Not in the local decoder table', meaning: `Xid ${n} is not one of the common codes this decoder knows. Look it up in NVIDIA's Xid catalog for your driver branch.`, next: 'Capture nvidia-bug-report.sh and the full dmesg context around the event.' };
        const gpu = ent.bdf || '$GPU';
        const steps = [
          ['Map BDF ↔ index ↔ serial', 'nvidia-smi --query-gpu=index,pci.bus_id,serial,uuid --format=csv'],
          ['All Xids on this node, in order', 'dmesg -T | grep -i "NVRM: Xid"'],
          ['ECC + row remap state', `nvidia-smi -q -d ECC,ROW_REMAPPER -i ${gpu}`]
        ];
        if (n === 74) steps.push(['NVLink link state & errors', `nvidia-smi nvlink -s -i ${gpu} && nvidia-smi nvlink -e -i ${gpu}`]);
        if (n === 79) steps.push(['Is it still on the bus?', `sudo lspci -vvv -s ${ent.bdf || '<bdf>'} | grep -E "LnkSta:|UESta:|CESta:"`], ['Power / thermal events at the same time', 'ipmitool sel elist | tail -n 40']);
        // Evidence first: a reset or reboot wipes the state the bug report captures.
        if ([119, 120, 61, 62, 79].includes(n)) steps.splice(1, 0, ['Bug report before any reset or reboot', 'sudo nvidia-bug-report.sh']);
        return { sev: x.sev, layer: x.layer, title: `Xid ${n} — ${x.title}`, meaning: x.meaning, next: x.next, steps: steps.slice(0, 6), sheet: n === 74 ? 'nv-nvlink.html' : n === 79 ? 'nv-pcie.html' : 'nv-ops.html', q: `xid ${n}`, boost: ['nv-pcie.html', 'nv-ops.html', 'nv-smi.html', 'nv-nvlink.html', 'nvidia.html', 'nv-dcgm.html'] };
      }
    },
    {
      id: 'fabric',
      test: q => /fabric ?manager|nv-fabricmanager|cuda[^\n]{0,30}\b802\b|system not yet initialized|\bsxid\b|nvswitch/i.test(q),
      build: () => ({ sev: 'crit', layer: 'Software / NVSwitch fabric', title: 'NVSwitch fabric not ready (Fabric Manager / SXid)', meaning: 'On HGX systems CUDA refuses to start (error 802, "system not yet initialized") until Fabric Manager has trained the NVSwitch fabric. A stopped Fabric Manager, a driver/FM version mismatch, or an SXid on a switch keeps the fabric down.', next: 'Fabric Manager version must exactly match the driver. A restart of the service needs a drain and your OK. SXids that repeat on one switch port → baseboard RMA.', steps: [['Fabric Manager service state', 'systemctl status nvidia-fabricmanager --no-pager'], ['FM log, last errors', 'journalctl -u nvidia-fabricmanager --no-pager | tail -n 50'], ['Fabric state per GPU', 'nvidia-smi -q | grep -A3 -i fabric'], ['Driver vs FM version', 'nvidia-smi --query-gpu=driver_version --format=csv,noheader | head -1; nv-fabricmanager --version']], sheet: 'nv-nvlink.html', q: 'fabric manager', boost: ['nv-nvlink.html', 'nv-ops.html', 'nvidia.html'] })
    },
    {
      id: 'edac-ue',
      test: q => /\bUE\b[^\n]*(memory|edac)|edac[^\n]*\bUE\b|uncorrect(ed|able)[^\n]*(ecc|memory)/i.test(q),
      build: ent => ({ sev: 'crit', layer: 'Hard silicon (DIMM)', title: 'Uncorrectable DRAM error (UE)', meaning: 'Main-memory error that ECC could not fix. The kernel may have killed a process or panicked. The DIMM named in the line is the prime suspect.', next: 'Drain the node. Reseat the DIMM, or swap it with a neighbour to see if the error follows it. If it follows → RMA the DIMM.', steps: [['EDAC counts per DIMM', 'edac-util -v'], ['Full RAS error history', 'sudo ras-mc-ctl --errors'], ['BMC view of the same event', 'ipmitool sel elist | grep -i -E "ecc|memory"'], ['DIMM label ↔ slot ↔ serial', 'sudo dmidecode -t memory | grep -E "Locator|Serial|Part Number" | paste - - - -']], sheet: 'ecc-edac.html', q: 'edac', boost: ['ecc-edac.html', 'dmi-hw.html', 'ipmi-sel-logs.html', 'mb-memory-post.html'] })
    },
    {
      id: 'edac-ce',
      test: q => /edac[^\n]*\bCE\b|\bCE\b[^\n]*memory|corrected[^\n]*(ecc|memory)|correctable ecc/i.test(q),
      build: () => ({ sev: 'warn', layer: 'Hard silicon (DIMM)', title: 'Correctable DRAM error (CE)', meaning: 'ECC fixed a memory error, so nothing broke. One CE is noise. A steadily climbing count on one DIMM means that DIMM is failing.', next: 'Trend the count. If one DIMM keeps climbing or the BMC throttled logging, schedule a DIMM swap.', steps: [['CE count per DIMM', 'edac-util -v'], ['Raw sysfs counters with labels', 'grep -H . /sys/devices/system/edac/mc/mc*/dimm*/{dimm_label,dimm_ce_count}'], ['RAS summary', 'sudo ras-mc-ctl --summary']], sheet: 'ecc-edac.html', q: 'edac', boost: ['ecc-edac.html', 'dmi-hw.html', 'mb-memory-post.html'] })
    },
    {
      id: 'aer',
      test: q => /\bAER\b|BadTLP|BadDLLP|Receiver Error|RxErr|Surprise Down|Completion Timeout/i.test(q),
      build: ent => {
        const fatal = /uncorrect|fatal|surprise down|completion timeout/i.test(ent.raw);
        return { sev: fatal ? 'crit' : 'warn', layer: 'PCIe / Layer-1', title: fatal ? 'PCIe uncorrectable (AER) error' : 'PCIe corrected (AER) errors', meaning: fatal ? 'A PCIe link dropped or corrupted traffic it could not recover. The device behind it may have disappeared.' : 'The PCIe link is retrying traffic (bad TLPs / receiver errors). Data is intact, but a steady stream points at signal integrity: riser, cable, slot or card seating.', next: 'Reseat the card and its riser/cable. Move the card to another slot: if the errors follow the card → card RMA; if they stay with the slot → riser/board.', steps: [[`Link speed/width ${ent.bdf ? 'for ' + ent.bdf : ''}`.trim(), `sudo lspci -vvv -s ${ent.bdf || '<bdf>'} | grep -E "LnkCap:|LnkSta:|UESta:|CESta:"`], ['Any downgraded links on the box', 'sudo lspci -vvv | grep -B 30 "downgraded" | grep -E "^[0-9a-f]{2}:|LnkSta:"'], ['AER events over time', 'dmesg -T | grep -i aer | tail -n 30']], sheet: 'pcie-numa.html', q: 'pcie aer', boost: ['pcie-numa.html', 'nv-pcie.html', 'mb-pcie-dxe-post.html'] };
      }
    },
    {
      id: 'pcie-down',
      test: q => /\(downgraded\)|downgraded|LnkSta:[^\n]*Width x(1|2|4|8)\b/i.test(q),
      build: ent => ({ sev: 'warn', layer: 'PCIe / Layer-1', title: 'PCIe link trained below capability', meaning: 'The card negotiated a slower speed or narrower width than it supports. Bandwidth drops silently; GPUs and NICs underperform with no other error.', next: 'Reseat the card, riser and any PCIe cables. Check BIOS slot bifurcation settings. Compare against an identical healthy node.', steps: [['Capability vs actual', `sudo lspci -vvv -s ${ent.bdf || '<bdf>'} | grep -E "LnkCap:|LnkSta:"`], ['All downgraded links', 'sudo lspci -vvv | grep -B 30 "downgraded" | grep -E "^[0-9a-f]{2}:|LnkSta:"'], ['GPU view of PCIe gen/width', 'nvidia-smi --query-gpu=index,pci.bus_id,pcie.link.gen.current,pcie.link.width.current --format=csv']], sheet: 'pcie-numa.html', q: 'lnksta', boost: ['pcie-numa.html', 'nv-pcie.html'] })
    },
    {
      id: 'nvme',
      test: q => /nvme\d*[^\n]*(timeout|controller is down|resetting controller|I\/O[^\n]*error|failed)|critical[_ ]warning|media and data integrity/i.test(q),
      build: ent => ({ sev: 'crit', layer: 'Storage device', title: 'NVMe drive timeout / controller reset', meaning: 'The drive stopped answering I/O in time and the kernel reset or gave up on it. Common causes: failing drive, overheating, or a bad backplane/cable connection.', next: 'Check SMART critical warning and media errors. Errors that follow the drive to another bay → RMA the drive; errors that stay with the bay → backplane/cable.', steps: [['Which drive, model, serial', 'sudo nvme list'], ['SMART: critical warning, temp, media errors', `sudo nvme smart-log /dev/${ent.nvme || '$DISK'}`], ['Controller error log', `sudo nvme error-log /dev/${ent.nvme || '$DISK'} | head -n 40`], ['Kernel history for this drive', `dmesg -T | grep -i ${ent.nvme ? ent.nvme.replace(/n\d+$/, '') : 'nvme'} | tail -n 30`]], sheet: 'nvme-smart.html', q: 'nvme smart', boost: ['nvme-smart.html', 'storage.html'] })
    },
    {
      id: 'disk-io',
      test: q => /blk_update_request|I\/O error, dev|Medium Error|Unrecovered read error|end_request: I\/O error/i.test(q),
      build: ent => ({ sev: 'crit', layer: 'Storage device', title: 'Block device I/O error', meaning: 'Reads or writes to a disk are failing at the device. Usually media failure; sometimes a cable, HBA or enclosure path.', next: 'Check SMART and multipath. Pull the drive only after confirming the array/filesystem can lose it.', steps: [['SMART health & error counters', `sudo smartctl -a /dev/${ent.disk || '$DISK'}`], ['Map device to enclosure slot', 'lsscsi -g'], ['Multipath state', 'sudo multipath -ll']], sheet: 'storage.html', q: 'smartctl', boost: ['storage.html', 'nvme-smart.html'] })
    },
    {
      id: 'ib',
      test: q => /Physical state:\s*(Polling|Disabled)|LinkDowned|SymbolError|port_rcv_errors|link_downed|Physical BER|\bmlx5_\d+\b[^\n]*(down|error)|ib\d+[^\n]*link down/i.test(q),
      build: ent => ({ sev: 'warn', layer: 'InfiniBand / Layer-1 optics', title: 'InfiniBand link down, flapping or erroring', meaning: '"Polling" means the port sees no partner. Symbol errors, link-downed counts or a high BER mean the link is up but the physical path is bad: dirty fiber, a weak transceiver, or a damaged cable.', next: 'Check DOM light levels per lane. Clean both MPO/APC ends, reseat the transceiver, then A/B swap the optic to see if the problem follows it.', steps: [['Port state & rate', `ibstat ${ent.hca || '$HCA'}`], ['DOM, BER & eye per lane', `sudo mlxlink -d ${ent.hca || '$HCA'} -m -c -e`], ['Error counters', `perfquery -x`]], sheet: 'ib-mlxlink.html', q: 'mlxlink', boost: ['ib-mlxlink.html', 'ib-ibstat.html', 'ib-perfquery.html', 'ib-mlxcables.html', 'fo-cleaning-testing.html', 'fo-dom-cli.html'] })
    },
    {
      id: 'netdev',
      test: q => /NETDEV WATCHDOG|transmit queue \d+ timed out|tx timeout|NIC Link is Down|Link is Down/i.test(q),
      build: ent => ({ sev: 'warn', layer: 'Ethernet NIC / Layer-1', title: 'Ethernet link down or TX hang', meaning: 'The NIC lost link or stopped transmitting. Either the physical path (cable, optic, switch port) or the NIC/driver hung.', next: 'Check the switch side with LLDP. Swap the cable/optic before blaming the NIC.', steps: [['Link, speed & errors', `ethtool ${ent.iface || '$IFACE'} && ip -s link show ${ent.iface || '$IFACE'}`], ['Optic DOM', `sudo ethtool -m ${ent.iface || '$IFACE'}`], ['Which switch port', `sudo lldpctl ${ent.iface || '$IFACE'}`]], sheet: 'eth-ethtool-tuning.html', q: 'ethtool', boost: ['eth-ethtool-tuning.html', 'eth-lldp-perf.html', 'ethernet.html'] })
    },
    {
      id: 'psu',
      test: q => /Power Supply[^\n]*(fail|AC lost|lost|predictive|input)|\bPSU\d*[^\n]*(fail|lost|fault)/i.test(q),
      build: () => ({ sev: 'crit', layer: 'Power', title: 'Power supply fault', meaning: 'A PSU failed or lost input power. On GPU nodes the remaining PSUs may not carry full load, which shows up as GPU throttling or Xid 79.', next: 'Check the PDU/feed first (is the whole A or B feed down?), then reseat the PSU cord, then swap the PSU.', steps: [['PSU sensors', 'ipmitool sdr type "Power Supply"'], ['SEL around the event', 'ipmitool sel elist | grep -i -E "power|psu" | tail -n 20'], ['PSU FRU part/serial', 'sudo dmidecode -t 39 | grep -E "Location|Name|Serial|Model|Max Power"']], sheet: 'ipmi-sel-logs.html', q: 'power supply', boost: ['ipmi-sel-logs.html', 'ipmi-sensors-sdr.html', 'rf-thermals-power.html'] })
    },
    {
      id: 'cpu-ierr',
      test: q => /\bIERR\b|\bCATERR\b|Processor[^\n]*(Configuration Error|Thermal Trip)|machine check|mce:|Hardware Error/i.test(q),
      build: () => ({ sev: 'crit', layer: 'CPU / platform', title: 'CPU machine check / IERR', meaning: 'The CPU or a component on its bus raised a fatal hardware error. The BMC and the OS logs together usually name the bank and the culprit (core, cache, memory controller, PCIe root).', next: 'Pull both the SEL and the decoded MCE. Same bank repeating → CPU or board RMA; memory-controller bank → check DIMMs first.', steps: [['Decoded hardware errors', 'sudo ras-mc-ctl --errors'], ['Kernel view', 'dmesg -T | grep -i -E "mce|machine check|hardware error" | tail -n 30'], ['BMC view', 'ipmitool sel elist | grep -i -E "processor|ierr|caterr" | tail -n 20']], sheet: 'ecc-edac.html', q: 'mce', boost: ['ecc-edac.html', 'ipmi-sel-logs.html'] })
    },
    {
      id: 'thermal',
      test: q => /(Temp|Temperature)[^\n]*(Upper (Critical|Non-recoverable)|going high)|Package temperature above threshold|thermal trip|Fan[^\n]*(Lower (Critical|Non-recoverable)|fail)/i.test(q),
      build: () => ({ sev: 'warn', layer: 'Thermal / cooling', title: 'Over-temperature or fan fault', meaning: 'A sensor crossed its critical threshold or a fan dropped below minimum. Expect CPU/GPU throttling and, if sustained, a protective shutdown.', next: 'Check the fan readings and inlet temperature. Look for blocked airflow, missing blanks, or a failed fan module before replacing anything else.', steps: [['Temperatures & fans', 'ipmitool sdr type Temperature; ipmitool sdr type Fan'], ['Throttle counters', 'grep -H . /sys/devices/system/cpu/cpu0/thermal_throttle/*_count'], ['GPU temps & throttle reasons', 'nvidia-smi -q -d TEMPERATURE,PERFORMANCE']], sheet: 'ipmi-sensors-sdr.html', q: 'temperature', boost: ['ipmi-sensors-sdr.html', 'rf-thermals-power.html', 'ipmi-sel-logs.html'] })
    },
    {
      id: 'oom',
      test: q => /Out of memory: Kill|oom-kill|oom_reaper|Killed process \d+/i.test(q),
      build: () => ({ sev: 'info', layer: 'Software / workload', title: 'Kernel OOM killer fired', meaning: 'The node ran out of RAM and the kernel killed a process. A workload problem, not a hardware fault.', next: 'Tell the job owner which process was killed and its RSS. Check for a memory leak or an over-packed node.', steps: [['Which process, how big', 'dmesg -T | grep -i -E "out of memory|killed process" | tail -n 10'], ['Current memory pressure', 'free -h && ps -eo pid,user,rss,comm --sort=-rss | head']], sheet: 'processes.html', q: 'memory', boost: ['processes.html', 'ps.html'] })
    }
  ];

  const DECODER_SAMPLES = [
    ['Xid 79', 'NVRM: Xid (PCI:0000:8a:00): 79, pid=48213, name=python, GPU has fallen off the bus.'],
    ['EDAC CE', 'EDAC MC0: 3 CE memory read error on CPU_SrcID#0_MC#0_Chan#1_DIMM#0 (channel:1 slot:0 page:0x1f3a5)'],
    ['PCIe AER', 'pcieport 0000:3a:00.0: AER: Corrected error received: 0000:3b:00.0 — BadTLP'],
    ['NVMe timeout', 'nvme nvme3: I/O 812 QID 14 timeout, aborting'],
    ['IB polling', 'mlx5_4 Physical state: Polling'],
    ['CUDA 802', 'cudaGetDeviceCount returned 802 -> system not yet initialized']
  ];

  function xidNumber(q) {
    const m = String(q).replace(/\(PCI:[^)]*\)/gi, '').match(/\bxid\b[^0-9]{0,6}(\d{1,3})\b/i);
    return m ? parseInt(m[1], 10) : null;
  }

  function extractEntities(raw) {
    const ent = { raw };
    // AER lines name the root port first and the device that erred after "received:".
    const bdf = raw.match(/received:\s*((?:[0-9a-f]{4}:)?[0-9a-f]{2}:[0-9a-f]{2})(\.[0-7])?\b/i)
      || raw.match(/\b(?:PCI:)?((?:[0-9a-f]{4}:)?[0-9a-f]{2}:[0-9a-f]{2})(\.[0-7])?\b/i);
    if (bdf) {
      const base = bdf[1].length === 5 ? `0000:${bdf[1]}` : bdf[1];
      ent.bdf = (base + (bdf[2] || '.0')).toLowerCase();
    }
    const hca = raw.match(/\bmlx5_\d+\b/);
    if (hca) ent.hca = hca[0];
    const nvme = raw.match(/\bnvme\d+(?:n\d+)?\b/);
    if (nvme) ent.nvme = /n\d+$/.test(nvme[0].replace(/^nvme/, '')) ? nvme[0] : `${nvme[0]}n1`;
    const disk = raw.match(/\bdev (sd[a-z]+|nvme\d+n\d+)\b/);
    if (disk) ent.disk = disk[1];
    const iface = raw.match(/\b(ib\d+|eth\d+|en[ops]\w+|bond\d+)\b/);
    if (iface) ent.iface = iface[1].replace(/:$/, '');
    const dimm = raw.match(/\b(CPU_SrcID#\d+_MC#\d+_Chan#\d+_DIMM#\d+|P\d_\w*DIMM_?\w+|DIMM[_ ]?[A-H]\d)\b/i);
    if (dimm) ent.dimm = dimm[1];
    const pid = raw.match(/\bpid[=: ](\d+)/i);
    if (pid) ent.pid = pid[1];
    return ent;
  }

  function decodeSymptom(raw) {
    const q = String(raw || '').trim();
    if (q.length < 4) return null;
    const rule = DECODER_RULES.find(r => r.test(q));
    if (!rule) return null;
    const ent = extractEntities(q);
    const card = rule.id === 'xid' ? rule.build(q, ent) : rule.build(ent);
    card.ent = ent;
    card.ruleId = rule.id;
    return card;
  }

  function renderDecoderCard(card) {
    const ent = card.ent;
    const chips = [
      ent.bdf && ['BDF', ent.bdf], ent.hca && ['HCA', ent.hca], ent.nvme && ['NVMe', ent.nvme],
      ent.disk && ['Disk', ent.disk], ent.iface && ['Iface', ent.iface], ent.dimm && ['DIMM', ent.dimm], ent.pid && ['PID', ent.pid]
    ].filter(Boolean);
    const sheetName = card.sheet.replace(/\.html$/, '');
    return `
      <section class="decoder-card sev-${card.sev}" aria-label="Symptom decoder result">
        <div class="decoder-top">
          <span class="decoder-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>Symptom decoder</span>
          <span class="decoder-sev">${SEV[card.sev]}</span>
          <span class="decoder-layer">${escapeHtml(card.layer)}</span>
        </div>
        <h3 class="decoder-title">${escapeHtml(card.title)}</h3>
        <p class="decoder-meaning">${escapeHtml(card.meaning)}</p>
        ${chips.length ? `<div class="decoder-entities"><span>Found in your line</span>${chips.map(([k, v]) => `<code><b>${k}</b> ${escapeHtml(v)}</code>`).join('')}</div>` : ''}
        <ol class="decoder-steps">
          ${card.steps.map(([label, cmd]) => `
            <li>
              <div class="decoder-step-label">${escapeHtml(label)}</div>
              <div class="decoder-step-cmd"><code>${escapeHtml(cmd)}</code><button type="button" class="decoder-copy" data-dec-copy="${escapeHtml(cmd)}" title="Copy (Rack Targets substitute automatically)">Copy</button></div>
            </li>`).join('')}
        </ol>
        <div class="decoder-foot">
          <p class="decoder-next"><b>Then:</b> ${escapeHtml(card.next)}</p>
          <span class="decoder-foot-actions">
            ${runbookForDecoded(card) ? `<button type="button" class="decoder-runbook" data-dec-runbook="${runbookForDecoded(card)}">Start guided runbook</button>` : ''}
            <button type="button" class="decoder-open" data-dec-open="${escapeHtml(card.sheet)}">Open ${escapeHtml(sheetName)} sheet →</button>
          </span>
        </div>
      </section>`;
  }

  function renderDecoderSamples() {
    return `
      <div class="decoder-samples">
        <div class="decoder-samples-head"><b>New:</b> paste a raw log line and get a diagnosis plus the next commands. Try one:</div>
        <div class="decoder-sample-row">
          ${DECODER_SAMPLES.map(([label, line]) => `<button type="button" class="decoder-sample" data-dec-sample="${escapeHtml(line)}">${escapeHtml(label)}</button>`).join('')}
          <button type="button" class="decoder-sample decoder-analyze" data-dec-analyze>📈 Paste a full mlxlink / smart-log / topo -m output</button>
        </div>
      </div>`;
  }

  // Relevance: what an entry is *about* (section, description, tags) outweighs
  // text that merely appears inside its example command.
  const GENERIC_SHEETS = /^(markdown|json|yaml|toml|regex|text|scripting|javascript|typescript|python|lua|sql|jira)$/;
  function scoreEntry(item, tokens, phrase, boost) {
    const about = `${item.sec} ${item.desc} ${item.tags} ${item.tip}`.toLowerCase();
    const cmd = String(item.cmd).toLowerCase();
    const sheet = `${item.sName} ${item.badge || ''}`.toLowerCase();
    let score = 0;
    for (const t of tokens) {
      const word = new RegExp(`(^|[^a-z0-9])${escapeRegex(t)}([^a-z0-9]|$)`);
      let s = 0;
      if (word.test(about)) s += 5; else if (about.includes(t)) s += 3;
      if (cmd.startsWith(t)) s += 5; else if (word.test(cmd)) s += 3; else if (cmd.includes(t)) s += 1.5;
      if (sheet.includes(t)) s += 4;
      if (!s) return 0;
      score += s;
    }
    if (tokens.length > 1 && about.includes(phrase)) score += 8;
    if (tokens.length > 1 && cmd.includes(phrase)) score += 2;
    if (boost && boost.includes(item.file)) score += 12;
    if (GENERIC_SHEETS.test(item.sName) && !tokens.includes(item.sName)) score *= 0.5;
    return score;
  }

  function rankIndex(tokens, phrase, boost) {
    return window.GLOBAL_SEARCH_INDEX
      .map((item, i) => ({ item, i, s: scoreEntry(item, tokens, phrase, boost) }))
      .filter(r => r.s > 0)
      .sort((a, b) => b.s - a.s || a.i - b.i)
      .map(r => r.item);
  }

  // -------------------------------------------------------------
  // OUTPUT ANALYZER
  // The suite says which command to run, then stops. Reading the output is
  // left to the tech: mlxlink -m -c -e prints ~60 lines of per-lane dBm, BER
  // exponents and module thresholds; nvme smart-log prints 20 counters. The
  // thresholds that interpret them live in docs/playbooks. Paste either output
  // (Ctrl+K, the home omnibox, or a runbook step) and get a visual report:
  // findings with severity, the playbook rule behind each, and next steps.
  // Pasting multi-line text into a single-line input also lost its line breaks;
  // the paste is intercepted before that happens.
  // -------------------------------------------------------------
  const AN_SEV_ORDER = { crit: 3, warn: 2, info: 1, ok: 0 };

  function anParseKV(text) {
    const kv = new Map();
    String(text).split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Za-z][\w ()/[\].,%°-]{1,60}?)\s*:\s*(.*?)\s*$/);
      if (!m) return;
      const key = m[1].toLowerCase().replace(/\s+/g, ' ').trim();
      if (!kv.has(key)) kv.set(key, m[2]);
    });
    return kv;
  }
  const anGet = (kv, re) => { for (const [k, v] of kv) if (re.test(k)) return v; return null; };
  function anList(v) {
    if (v == null) return null;
    const range = String(v).match(/\[\s*(-?[\d.]+)\s*\.\.\s*(-?[\d.]+)\s*\]/);
    const values = String(v).replace(/\[.*?\]/g, '').split(',').map(x => parseFloat(x)).filter(x => !Number.isNaN(x));
    return { values, range: range ? [parseFloat(range[1]), parseFloat(range[2])] : null };
  }
  const anNum = v => { if (v == null) return null; const n = parseFloat(String(v).replace(/[^\d.eE+-]/g, ' ').trim().split(/\s+/)[0]); return Number.isNaN(n) ? null : n; };
  const anBer = v => { if (v == null) return null; const m = String(v).match(/(\d+(?:\.\d+)?)\s*[eE]\s*([-+]?\d+)/); return m ? parseFloat(m[1]) * Math.pow(10, parseInt(m[2], 10)) : anNum(v); };
  const fmtBer = x => x == null ? '—' : x === 0 || x < 1e-200 ? '0' : x.toExponential(1).replace('e', 'E');

  function detectOutput(text) {
    const t = String(text || '');
    if (/\bGPU0\b/.test(t) && /\b(NV\d+|PIX|PXB|PHB|NODE|SYS)\b/.test(t) && /(Legend|CPU Affinity|^\s*GPU1\b)/m.test(t)) return 'topo';
    if (/Rx Power Current|Effective Physical (Errors|BER)|Raw Physical BER|Physical state\s*:/i.test(t)) return 'mlxlink';
    if (/critical_warning\s*:/i.test(t) && /available_spare|media_errors|percentage_used/i.test(t)) return 'smartlog';
    return null;
  }

  function analyzeMlxlink(text) {
    const kv = anParseKV(text);
    const f = [];
    const add = (sev, title, detail, rule) => f.push({ sev, title, detail, rule });
    const state = anGet(kv, /^state$/) || '';
    const phys = anGet(kv, /^physical state$/) || '';
    const width = anGet(kv, /^width$/) || '';
    const speed = anGet(kv, /^speed$/) || '';
    const fec = anGet(kv, /^fec$/) || '';
    const rxRaw = anGet(kv, /^rx power current/);
    const txRaw = anGet(kv, /^tx power current/);
    const toDbm = (raw, key) => {
      const l = anList(raw);
      if (!l) return null;
      if (/\[mw\]/i.test(key || '')) l.values = l.values.map(mw => (mw > 0 ? 10 * Math.log10(mw) : -40));
      return l;
    };
    const rxKey = [...kv.keys()].find(k => /^rx power current/.test(k));
    const txKey = [...kv.keys()].find(k => /^tx power current/.test(k));
    const rx = toDbm(rxRaw, rxKey);
    const tx = toDbm(txRaw, txKey);
    const temp = anList(anGet(kv, /^temperature/));
    const bias = anList(anGet(kv, /^bias current/));
    const effErr = anNum(anGet(kv, /^effective physical errors$/));
    const effBer = anBer(anGet(kv, /^effective physical ber$/));
    const rawBer = anBer(anGet(kv, /^raw physical ber$/));
    const rawLanes = anList(anGet(kv, /^raw physical errors per lane$/));
    const downs = anNum(anGet(kv, /^link down counter$/));
    const rec = anNum(anGet(kv, /^link error recovery counter$/));

    // Link state
    if (/polling/i.test(phys) || /polling/i.test(state)) add('crit', 'Link is Polling: no partner seen', 'The port is lit but sees no light or no remote port: switch port disabled/down, broken or unplugged fiber, or polarity reversed.', 'network-optics §2 State / Physical state');
    else if (phys && !/linkup|active/i.test(phys)) add('warn', `Physical state is ${phys}`, '"Training" usually means a marginal signal: dirty fiber or a weak optic.', 'network-optics §2 State / Physical state');
    if (/^[12]x$/i.test(width.trim())) add('warn', `Link trained at ${width} width`, 'Lost lanes: look for a dead lane in Rx/Tx power or a bent MPO pin.', 'network-optics §2 Speed / Width');

    // BER
    if (effErr != null && effErr > 0) add('crit', `${effErr} effective (post-FEC) physical errors`, 'Uncorrectable errors are leaking past FEC: expect job hangs and NCCL timeouts.', 'network-optics §2 Effective Physical Errors > 0');
    if (effBer != null && effBer > 1e-12) add('crit', `Effective BER ${fmtBer(effBer)} (limit 1E-12)`, 'Unacceptable post-FEC error rate: clean or swap optics/cable.', 'network-optics §2 Effective Physical BER > 1e-12');
    else if (effBer != null && effBer > 1e-15) add('warn', `Effective BER ${fmtBer(effBer)} is off the floor`, 'Still under the 1E-12 limit, but a clean link sits below 1E-15. Trend it and inspect the fiber before it crosses.', 'network-optics §2 Effective Physical BER healthy < 1e-15');
    if (rawBer != null && rawBer > 5e-4) add('crit', `Raw BER ${fmtBer(rawBer)} above the 5E-4 pre-FEC limit`, 'RS-FEC cannot keep up; the link will flap or drop packets.', 'network-optics §2 Raw Physical BER > 5e-4');
    else if (rawBer != null && rawBer > 1e-5) add('warn', `Raw BER ${fmtBer(rawBer)} is elevated`, 'Above the normal 1E-7…1E-5 band for PAM4 with RS-FEC: trend it and inspect the fiber.', 'network-optics §2 Raw Physical BER');
    if (rawLanes && rawLanes.values.length > 1) {
      const sorted = [...rawLanes.values].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)] || 0;
      rawLanes.values.forEach((v, i) => { if (v > Math.max(1000, median * 20)) add('warn', `Lane ${i} carries most raw errors (${v.toLocaleString('en-US')})`, 'One lane erroring far more than its peers points at that fiber in the MPO: clean, then A/B swap.', 'network-optics §3 Step 2'); });
    }

    // Optical power
    const lanes = n => Array.from({ length: n }, (_, i) => i);
    if (rx && rx.values.length) {
      const los = rx.values.filter(v => v <= -30).length;
      if (los === rx.values.length) add('crit', 'Loss of signal on every lane (Rx ≈ -40 dBm)', 'No light arriving: remote Tx off or port down, unseated/broken fiber, patch-panel polarity (Type A/B), tight bend.', 'network-optics §3 Step 2.1');
      else lanes(rx.values.length).forEach(i => {
        const v = rx.values[i];
        if (v <= -30) add('crit', `Lane ${i}: loss of signal (Rx ${v} dBm)`, 'One dead lane: broken fiber in the MPO or a failed remote laser on that lane.', 'network-optics §2 Rx Power < -10 dBm');
        else if (v < -10) add('crit', `Lane ${i}: Rx ${v} dBm is below -10 dBm`, 'Unseated MPO, broken fiber or dying remote laser.', 'network-optics §2 Rx Power < -10 dBm');
        else if (rx.range && v < rx.range[0]) add('warn', `Lane ${i}: Rx ${v} dBm is below the module's own minimum (${rx.range[0]})`, 'Out of the transceiver’s rated range.', 'module DOM threshold');
      });
      const live = rx.values.filter(v => v > -30);
      if (live.length > 1) {
        const max = Math.max(...live), min = Math.min(...live);
        if (max - min > 3) add('warn', `Rx lane skew ${(max - min).toFixed(1)} dB (limit 3 dB): lane ${rx.values.indexOf(min)} is low`, 'The #1 cause is contamination on that fiber of the MPO end-face: 1-click clean both ends and the bulkhead, then re-check.', 'network-optics §2 lane-to-lane skew > 3 dB');
      }
    }
    if (tx && tx.values.length) lanes(tx.values.length).forEach(i => {
      const v = tx.values[i];
      if (v < -8) add('crit', `Lane ${i}: local Tx ${v} dBm (below -8 dBm)`, 'The local laser on this lane is failing: reseat once; if still low, RMA the transceiver.', 'network-optics §2 Tx Power < -8 dBm');
      else if (tx.range && v < tx.range[0]) add('warn', `Lane ${i}: Tx ${v} dBm below module minimum (${tx.range[0]})`, 'Local transmitter weak.', 'module DOM threshold');
    });
    // Temperature
    const t = temp && temp.values[0];
    if (t != null) {
      const hi = temp.range ? temp.range[1] : 75;
      if (t >= hi || t > 75) add('crit', `Module at ${t} °C (limit ${hi} °C)`, 'Critical: check OSFP airflow, fan speed and dust; heat degrades the laser and raises BER.', 'network-optics §2 Module Temperature');
      else if (t > 70) add('warn', `Module at ${t} °C (warning above 70 °C)`, 'Check finned-top airflow, fan speed or dust obstruction.', 'network-optics §2 Module Temperature');
    }
    if (downs != null && downs > 0) add('warn', `Link went down ${downs} time${downs === 1 ? '' : 's'} since counters cleared`, `Flapping${rec ? ` (plus ${rec} error recoveries)` : ''}: correlate with the switch side and physical work.`, 'perfquery LinkDowned');
    if (!f.length) add('ok', 'Link looks healthy', 'State up, no post-FEC errors, BER and optical power inside limits on every lane.', 'network-optics §2');

    return {
      type: 'mlxlink', title: 'mlxlink: physical layer', runbook: 'ib-link',
      facts: [['State', [state, phys].filter(Boolean).join(' / ') || '—'], ['Speed', [speed, width].filter(Boolean).join(' · ') || '—'], ['FEC', fec || '—'],
        ['Module', [anGet(kv, /^identifier$/), anGet(kv, /^vendor part number$/)].filter(Boolean).join(' · ') || '—'], ['Serial', anGet(kv, /^vendor serial number$/) || '—'],
        ['Eff. BER', fmtBer(effBer)], ['Raw BER', fmtBer(rawBer)], ['Temp', t != null ? `${t} °C` : '—']],
      charts: { rx, tx, bias },
      ber: (rawBer != null || effBer != null) ? { raw: rawBer, eff: effBer } : null,
      findings: f.sort((a, b) => AN_SEV_ORDER[b.sev] - AN_SEV_ORDER[a.sev])
    };
  }

  // -------------------------------------------------------------
  // BER, VISUALLY
  // "Raw Physical BER 2E-6" and "Effective Physical BER 15E-255" mean nothing
  // at a glance. Both are drawn on one log scale (1E-18 … 1E-2) with the
  // playbook zones (network-optics §2): raw/pre-FEC is normal up to 1E-5,
  // elevated to 5E-4, failing above; effective/post-FEC is clean below 1E-15,
  // worth watching to 1E-12, unacceptable above.
  // -------------------------------------------------------------
  const BER_LO = -18, BER_HI = -2;
  const BER_ZONES = {
    raw: [{ to: -5, cls: 'ok', label: 'normal ≤ 1E-5' }, { to: Math.log10(5e-4), cls: 'warn', label: 'elevated' }, { to: BER_HI, cls: 'crit', label: '> 5E-4 FEC overwhelmed' }],
    eff: [{ to: -15, cls: 'ok', label: 'clean < 1E-15' }, { to: -12, cls: 'warn', label: 'watch' }, { to: BER_HI, cls: 'crit', label: '> 1E-12 unacceptable' }]
  };
  const berPos = exp => `${((Math.min(BER_HI, Math.max(BER_LO, exp)) - BER_LO) / (BER_HI - BER_LO) * 100).toFixed(2)}%`;
  function berExp(v) { return v == null || v <= 0 || v < 1e-200 ? BER_LO - 1 : Math.log10(v); }
  function berZone(kind, v) {
    const e = berExp(v);
    return (BER_ZONES[kind].find(z => e <= z.to) || BER_ZONES[kind][BER_ZONES[kind].length - 1]).cls;
  }

  function berScaleHtml(kind, value, label) {
    const zones = BER_ZONES[kind];
    let from = BER_LO;
    const bands = zones.map(z => { const html = `<span class="ber-band z-${z.cls}" style="left:${berPos(from)};width:calc(${berPos(z.to)} - ${berPos(from)})" title="${escapeHtml(z.label)}"></span>`; from = z.to; return html; }).join('');
    const e = berExp(value);
    const zone = berZone(kind, value);
    const shown = value == null ? '—' : (value === 0 || value < 1e-200) ? '≈ 0' : fmtBer(value);
    return `
      <div class="ber-scale">
        <div class="ber-scale-head"><b>${escapeHtml(label)}</b><span class="ber-val z-${zone}">${shown}</span></div>
        <div class="ber-track">${bands}
          ${value == null ? '' : `<span class="ber-marker z-${zone}" style="left:${e < BER_LO ? '1.2%' : berPos(e)}"></span>`}
        </div>
        <div class="ber-axis">${[-18, -15, -12, -9, -6, -3].map(x => `<span style="left:${berPos(x)}">1E${x}</span>`).join('')}</div>
      </div>`;
  }

  const BER_EXAMPLES = [
    { key: 'healthy', title: 'Healthy', cls: 'ok', eff: 0, effText: '15E-255', raw: 3e-8, rawText: '3E-8', errs: 0, downs: 0,
      meaning: 'FEC has nothing to correct that it cannot handle: zero post-FEC errors, effective BER printed as a vanishingly small number (often 15E-255 or 0E+0). Raw BER well inside the normal PAM4 band.',
      action: 'Nothing to do. This is the target state for every NDR/XDR port.' },
    { key: 'degraded', title: 'Degraded, still passing', cls: 'warn', eff: 2e-14, effText: '2E-14', raw: 6e-5, rawText: '6E-5', errs: 0, downs: 0,
      meaning: 'Still no post-FEC errors, but raw BER is above the normal 1E-5 band and effective BER is no longer at the floor. FEC is working hard; traffic is fine today.',
      action: 'Clean both MPO ends and the bulkhead, reseat the optic, then re-check. Compare lane Rx power for a weak lane (skew > 3 dB).' },
    { key: 'failing', title: 'Failing', cls: 'crit', eff: 3e-12, effText: '3E-12', raw: 8e-4, rawText: '8E-4', errs: 18, downs: 2,
      meaning: 'Raw BER above 5E-4 is more than RS-FEC can correct, so uncorrectable errors leak through: effective BER above 1E-12 and non-zero effective errors. Expect link flaps and NCCL timeouts.',
      action: 'Drain the jobs on this link, clean, then A/B swap fiber and transceiver to find what the fault follows. RMA the part it follows.' }
  ];

  function berExampleOutput(x) {
    return [
      'Operational Info', '----------------', `State                              : ${x.key === 'failing' ? 'Active' : 'Active'}`, 'Physical state                     : LinkUp', 'Speed                              : IB-NDR', 'Width                              : 4x', '',
      'Module Info', '-----------', 'Identifier                         : OSFP', 'Temperature [C]                    : 46 [-5..75]',
      `Rx Power Current [dBm]             : ${x.key === 'healthy' ? '1.4,1.2,1.3,1.1' : x.key === 'degraded' ? '1.2,-1.6,1.1,0.9' : '1.1,-4.2,1.0,0.8'} [-8.9..4]`, 'Tx Power Current [dBm]             : 1.1,1.0,1.0,1.1 [-6.4..4]', '',
      'Physical Counters and BER Info', '------------------------------', 'Time Since Last Clear [Min]        : 60.0',
      `Effective Physical Errors          : ${x.errs}`, `Effective Physical BER             : ${x.effText}`, `Raw Physical BER                   : ${x.rawText}`, `Link Down Counter                  : ${x.downs}`
    ].join('\n');
  }

  function berReferenceHtml() {
    return `
      <div class="ber-ref">
        <p class="ber-ref-lead"><b>Raw BER</b> is measured before forward error correction (FEC) and is never zero on a PAM4 link. <b>Effective BER</b> is what is left after FEC and should be at the floor. Read them together: raw tells you how hard FEC is working, effective tells you whether it is keeping up. Thresholds from <code>docs/playbooks/network-optics.md</code> §2.</p>
        <div class="ber-ref-grid">
          ${BER_EXAMPLES.map(x => `
            <article class="ber-card z-${x.cls}">
              <header><span class="ber-badge z-${x.cls}">${escapeHtml(x.title)}</span></header>
              <pre class="ber-lines"><span>Effective Physical Errors : <b class="z-${x.errs ? 'crit' : 'ok'}">${x.errs}</b></span>
<span>Effective Physical BER    : <b class="z-${berZone('eff', x.eff)}">${x.effText}</b></span>
<span>Raw Physical BER          : <b class="z-${berZone('raw', x.raw)}">${x.rawText}</b></span>
<span>Link Down Counter         : <b class="z-${x.downs ? 'warn' : 'ok'}">${x.downs}</b></span></pre>
              ${berScaleHtml('raw', x.raw, 'Raw (pre-FEC)')}
              ${berScaleHtml('eff', x.eff, 'Effective (post-FEC)')}
              <p class="ber-meaning">${escapeHtml(x.meaning)}</p>
              <p class="ber-action"><b>Do:</b> ${escapeHtml(x.action)}</p>
              <button type="button" class="ber-try" data-ber-example="${x.key}">Analyze this example →</button>
            </article>`).join('')}
        </div>
      </div>`;
  }

  let berEl = null;
  function openBerReference() {
    if (!berEl) {
      berEl = document.createElement('div');
      berEl.className = 'an-backdrop ber-backdrop';
      berEl.innerHTML = `
        <div class="an-dialog ber-dialog" role="dialog" aria-modal="true" aria-labelledby="ber-title">
          <header class="an-head"><div><h2 id="ber-title">BER: healthy vs unhealthy</h2><p>What mlxlink -c shows on a clean link, a link that needs cleaning, and a failing one.</p></div><button type="button" class="trail-close" data-ber-close aria-label="Close">✕</button></header>
          <div class="an-body">${berReferenceHtml()}</div>
        </div>`;
      document.body.appendChild(berEl);
      berEl.addEventListener('click', (e) => { if (e.target === berEl || (e.target instanceof Element && e.target.closest('[data-ber-close]'))) closeBer(); });
      berEl.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeBer(); } });
    }
    berEl.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => berEl.querySelector('.trail-close').focus(), 30);
  }
  function closeBer() { if (berEl) { berEl.classList.remove('show'); document.body.style.overflow = ''; } }

  // Inline on the mlxlink sheet, where the BER commands are.
  function renderBerPanel() {
    if (IN_WIDGET_FRAME) return;
    document.querySelectorAll('.ber-panel').forEach(el => el.remove());
    const file = anatSheetFile || window.location.pathname.split('/').pop() || '';
    if (!/^(ib-mlxlink|fo-dom-cli)\.html$/.test(file)) return;
    const main = document.querySelector('main');
    if (!main) return;
    const panel = document.createElement('section');
    panel.className = 'container ber-panel';
    panel.innerHTML = `<details open><summary><h2>BER: healthy vs unhealthy</h2><span>How to read the Physical Counters section of <code>mlxlink -m -c -e</code></span></summary>${berReferenceHtml()}</details>`;
    main.insertAdjacentElement('beforebegin', panel);
  }

  function initBer() {
    if (IN_WIDGET_FRAME) return;
    renderBerPanel();
    document.addEventListener('click', (e) => {
      const ex = e.target instanceof Element ? e.target.closest('[data-ber-example]') : null;
      if (ex) { closeBer(); openAnalyzer(berExampleOutput(BER_EXAMPLES.find(x => x.key === ex.dataset.berExample))); return; }
      if (e.target instanceof Element && e.target.closest('[data-ber-open]')) { closeAnalyzer(); openBerReference(); }
    });
  }

  // -------------------------------------------------------------
  // HEALTH ATLAS
  // The sheets say which command to run, rarely what a good result looks like:
  // nvme-smart gives no range for critical_warning, spare or wear; nv-admin
  // doesn't say what the row-remapper states mean; nv-pcie never states the
  // expected link. The numbers are in docs/playbooks. Each metric becomes a
  // card: the command, a scale with healthy / watch / failing zones and three
  // marked examples (or three example states), and the rule it comes from.
  // Sheets show their own metrics inline; Ctrl+K "healthy" opens all of them.
  // -------------------------------------------------------------
  const HEALTH = [
    { id: 'rx', group: 'Optics', title: 'Rx power per lane', unit: 'dBm', pick: /\bdom\b|dbm|optical|transceiver|rx power/i, pickCmd: /mlxlink[^|;&]*-m|ethtool\s+-m|transceiver|sfputil|\bdom\b/i, cmd: 'sudo mlxlink -d $HCA -m', field: 'Rx Power Current [dBm]', src: 'network-optics §2',
      min: -42, max: 6, zones: [{ to: -10, cls: 'crit', label: '< -10 dBm' }, { to: -6, cls: 'warn', label: 'low' }, { to: 2, cls: 'ok', label: '-6 … +2' }, { to: 6, cls: 'warn', label: 'hot' }],
      ex: [{ v: 1.2, cls: 'ok', label: 'Healthy 1.2' }, { v: -8.5, cls: 'warn', label: 'Weak -8.5' }, { v: -40, cls: 'crit', label: 'LOS -40' }],
      note: '-40 dBm on every lane = no light (port down, unplugged, polarity). One low lane = dirty fiber in the MPO.' },
    { id: 'tx', group: 'Optics', title: 'Tx power per lane', unit: 'dBm', pick: /\bdom\b|dbm|optical|transceiver|tx power/i, pickCmd: /mlxlink[^|;&]*-m|ethtool\s+-m|transceiver|sfputil|\bdom\b/i, cmd: 'sudo mlxlink -d $HCA -m', field: 'Tx Power Current [dBm]', src: 'network-optics §2',
      min: -14, max: 6, zones: [{ to: -8, cls: 'crit', label: '< -8 dBm' }, { to: -3, cls: 'warn', label: 'low' }, { to: 3, cls: 'ok', label: '-3 … +3' }, { to: 6, cls: 'warn', label: 'high' }],
      ex: [{ v: 1.0, cls: 'ok', label: 'Healthy 1.0' }, { v: -5, cls: 'warn', label: 'Weak -5' }, { v: -11, cls: 'crit', label: 'Failing -11' }],
      note: 'Low local Tx on a lane = that laser is dying. Reseat once; if still low, RMA the transceiver.' },
    { id: 'skew', group: 'Optics', title: 'Rx lane-to-lane skew', unit: 'dB', pick: /\bdom\b|dbm|optical|transceiver|rx power/i, pickCmd: /mlxlink[^|;&]*-m|ethtool\s+-m|transceiver|sfputil|\bdom\b/i, cmd: 'sudo mlxlink -d $HCA -m', field: 'max − min of the Rx lanes', src: 'network-optics §2–3',
      min: 0, max: 10, zones: [{ to: 1.5, cls: 'ok', label: 'tight' }, { to: 3, cls: 'warn', label: 'watch' }, { to: 10, cls: 'crit', label: '> 3 dB' }],
      ex: [{ v: 0.4, cls: 'ok', label: '0.4' }, { v: 2.4, cls: 'warn', label: '2.4' }, { v: 5.3, cls: 'crit', label: '5.3' }],
      note: 'The #1 cause of a skewed lane is contamination on that fiber: 1-click clean both ends and the bulkhead.' },
    { id: 'otemp', group: 'Optics', title: 'Transceiver temperature', unit: '°C', pick: /\bdom\b|optical|transceiver|temperature/i, pickCmd: /mlxlink[^|;&]*-m|ethtool\s+-m|transceiver|sfputil|\bdom\b/i, cmd: 'sudo mlxlink -d $HCA -m', field: 'Temperature [C]', src: 'network-optics §2',
      min: 20, max: 90, zones: [{ to: 65, cls: 'ok', label: '< 65' }, { to: 75, cls: 'warn', label: '~70 warn' }, { to: 90, cls: 'crit', label: '75+ critical' }],
      ex: [{ v: 46, cls: 'ok', label: '46' }, { v: 71, cls: 'warn', label: '71' }, { v: 79, cls: 'crit', label: '79' }],
      note: 'Heat ages the laser and raises BER: check finned-top airflow, fan speed and dust before replacing anything.' },
    { id: 'remap', group: 'GPU', title: 'HBM row remapper', cmd: 'nvidia-smi -q -d ROW_REMAPPER -i $GPU', field: 'Pending / Remapping Failure Occurred / Bank histogram', src: 'gpu-nvlink §3',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Pending : No', 'Remapping Failure Occurred : No', 'Bank histogram: Max / High'] },
        { cls: 'warn', label: 'Needs a reset', lines: ['Pending : Yes', 'Remapping Failure Occurred : No'], tip: 'Drain, then GPU reset or reboot to complete the remap.' },
        { cls: 'crit', label: 'RMA', lines: ['Remapping Failure Occurred : Yes', 'or a bank at None + new DBE'], tip: 'No spare rows left: RMA the GPU.' }] },
    { id: 'gdelta', group: 'GPU', title: 'GPU vs HBM temperature delta under load', unit: '°C', cmd: 'nvidia-smi --query-gpu=index,temperature.gpu,temperature.memory --format=csv', field: 'temperature.memory − temperature.gpu', src: 'gpu-nvlink §4',
      min: 0, max: 40, zones: [{ to: 20, cls: 'ok', label: 'normal' }, { to: 25, cls: 'warn', label: 'watch' }, { to: 40, cls: 'crit', label: '> 25 °C' }],
      ex: [{ v: 8, cls: 'ok', label: '8' }, { v: 22, cls: 'warn', label: '22' }, { v: 31, cls: 'crit', label: '31' }],
      note: 'A delta over 25 °C, or a sudden jump, points at TIM dry-out or coldplate seating on SXM modules.' },
    { id: 'pcie', group: 'GPU', title: 'PCIe link speed / width', cmd: 'sudo lspci -vvv -s <bdf> | grep -E "LnkCap:|LnkSta:"', field: 'LnkSta vs LnkCap', src: 'bmc-hardware §4 · network-optics §4',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['LnkCap: Speed 32GT/s, Width x16', 'LnkSta: Speed 32GT/s, Width x16'] },
        { cls: 'warn', label: 'Idle downshift', lines: ['LnkSta: Speed 2.5GT/s (downgraded)'], tip: 'GPUs drop to Gen1 when idle; re-check under load before acting.' },
        { cls: 'crit', label: 'Degraded', lines: ['LnkSta: Width x8 (downgraded)', 'or Speed 16GT/s under load'], tip: 'Lost lanes or a Gen4 retrain: reseat card / riser / MCIO cable, cold-cycle.' }] },
    { id: 'cw', group: 'NVMe', title: 'critical_warning', cmd: 'sudo nvme smart-log $DISK', field: 'critical_warning', src: 'storage-jbod §1',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['critical_warning : 0'] },
        { cls: 'warn', label: 'Cooling', lines: ['critical_warning : 0x2  (temperature)'], tip: 'Fans, airflow, heatsink; not the drive.' },
        { cls: 'crit', label: 'RMA', lines: ['0x1 spare low · 0x4 reliability', '0x8 read-only (immediate)'], tip: 'RMA the drive.' }] },
    { id: 'spare', group: 'NVMe', title: 'available_spare vs threshold', unit: '%', cmd: 'sudo nvme smart-log $DISK', field: 'available_spare / available_spare_threshold', src: 'storage-jbod §1',
      min: 0, max: 100, zones: [{ to: 10, cls: 'crit', label: '< threshold (often 10%)' }, { to: 30, cls: 'warn', label: 'getting low' }, { to: 100, cls: 'ok', label: 'healthy' }],
      ex: [{ v: 100, cls: 'ok', label: '100%' }, { v: 22, cls: 'warn', label: '22%' }, { v: 8, cls: 'crit', label: '8%' }],
      note: 'Below its own threshold the drive raises critical_warning 0x1: replace it.' },
    { id: 'wear', group: 'NVMe', title: 'percentage_used (endurance)', unit: '%', pick: /wear|reliab|health|smart/i, pickCmd: /smart-log|Get-StorageReliabilityCounter|smartctl/i, cmd: 'sudo nvme smart-log $DISK', field: 'percentage_used', src: 'NVMe spec: 100% = rated endurance used',
      min: 0, max: 110, zones: [{ to: 90, cls: 'ok', label: 'normal' }, { to: 100, cls: 'warn', label: '≥ 90 plan' }, { to: 110, cls: 'crit', label: '≥ 100' }],
      ex: [{ v: 3, cls: 'ok', label: '3%' }, { v: 94, cls: 'warn', label: '94%' }, { v: 104, cls: 'crit', label: '104%' }],
      note: 'Rated write endurance is a planning number, not an instant failure; pair it with spare and media errors.' },
    { id: 'media', group: 'NVMe', title: 'media_errors', pick: /error|reliab|health|smart/i, pickCmd: /smart-log|Get-StorageReliabilityCounter|smartctl/i, cmd: 'sudo nvme smart-log $DISK', field: 'media_errors', src: 'storage-jbod §1',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['media_errors : 0'] },
        { cls: 'warn', label: 'Watch', lines: ['media_errors : 3', 'no kernel I/O errors'], tip: 'Trend it; check nvme error-log.' },
        { cls: 'crit', label: 'RMA', lines: ['media_errors climbing', '+ I/O errors in dmesg'], tip: 'Meets the RMA criteria.' }] },
    { id: 'ce', group: 'Memory', title: 'Correctable ECC errors (per DIMM)', unit: '/day', log: true, cmd: 'edac-util -v', field: 'CE count per DIMM, per day', src: 'bmc-hardware §3',
      min: 0, max: 5, zones: [{ to: 2, cls: 'ok', label: 'occasional' }, { to: 3, cls: 'warn', label: 'climbing: trend' }, { to: 5, cls: 'crit', label: '> 1000/day storm' }],
      ex: [{ v: 0.3, cls: 'ok', label: '2/day' }, { v: 2.5, cls: 'warn', label: '300/day' }, { v: 3.9, cls: 'crit', label: '8000/day' }],
      note: 'A CE storm (> 1000/day, or "logging limit reached" in the SEL) precedes an uncorrectable error. Any UE: replace the DIMM.' },

    // ---- Ports and fabric (network-optics §2; perfquery / switch counters)
    { id: 'portctr', group: 'Ports', title: 'Port error counters', pick: /error|counter|crc|symbol|fcs|discard|drop/i, pickCmd: /counter|ethtool\s+-S|stats|perfquery|mlxlink[^|;&]*-c/i, cmd: 'ethtool -S $IFACE | grep -E -i "crc|symbol|err|drop|discard"', field: 'CRC / FCS, symbol errors, link-down, discards: read twice, a minute apart', src: 'network-optics §2 · perfquery',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['All error counters 0,', 'or unchanged between two reads'] },
        { cls: 'warn', label: 'Watch', lines: ['A few new errors right after', 'cleaning, reseating or a reboot'], tip: 'Clear the counters (with approval), then re-read after traffic.' },
        { cls: 'crit', label: 'Failing', lines: ['CRC / symbol errors rising', 'or link-down count climbing'], tip: 'Layer-1: clean fiber, reseat, then A/B swap optic and cable.' }] },
    { id: 'ibstate', group: 'Fabric', title: 'InfiniBand port state, rate and width', pick: /port state|link state|state, |rate|speed|width|portinfo|operational state/i, pickCmd: /ibstat|iblinkinfo|portinfo|show interfaces ib/i, cmd: 'ibstat $HCA', field: 'State / Physical state / Rate / width', src: 'network-optics §2',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['State: Active · Physical state: LinkUp', 'Rate: 400 (NDR) or 800 (XDR) · 4X'] },
        { cls: 'warn', label: 'Up, not in service', lines: ['State: Initializing / Armed', 'Physical state: LinkUp'], tip: 'Physically fine; the Subnet Manager has not configured the port yet. Check sminfo.' },
        { cls: 'crit', label: 'Down or degraded', lines: ['Physical state: Polling / Disabled', 'or width 1X / 2X, or HDR on an NDR fabric'], tip: 'Polling = no light / remote port down. Narrow width = lost lanes: check per-lane Rx power.' }] },
    { id: 'ibctr', group: 'Fabric', title: 'InfiniBand error counters', pick: /error|counter|pma|symbol/i, pickCmd: /perfquery|ibqueryerrors/i, cmd: 'perfquery -x', field: 'SymbolErrorCounter · LinkErrorRecoveryCounter · LinkDownedCounter · PortRcvErrors · PortXmitDiscards', src: 'network-optics §1–2',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['SymbolErrorCounter: 0', 'LinkDownedCounter: 0 · PortRcvErrors: 0'] },
        { cls: 'warn', label: 'Congestion, not cabling', lines: ['PortXmitDiscards / XmitWait rising', 'physical counters at 0'], tip: 'Traffic or routing pressure, not a bad cable: look at the job pattern and SM routing.' },
        { cls: 'crit', label: 'Physical fault', lines: ['SymbolError / LinkErrorRecovery rising', 'or LinkDownedCounter > 0 since clear'], tip: 'Read mlxlink on both ends of the link; clean and A/B swap.' }] },
    { id: 'ibdiag', group: 'Fabric', title: 'ibdiagnet summary', pick: /ibdiagnet/i, cmd: 'ibdiagnet', field: 'Summary table and -E- / -W- lines', src: 'ib-ibdiagnet sheet',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Every stage: 0 errors', 'no -E- lines'] },
        { cls: 'warn', label: 'Warnings', lines: ['-W- lines only, e.g. speed or', 'BER warnings on a few ports'], tip: 'Trend them: the same ports in two runs are the ones to clean.' },
        { cls: 'crit', label: 'Errors', lines: ['-E- lines: link errors, BER over', 'threshold, duplicated GUIDs/LIDs'], tip: 'Fix every -E- before returning the fabric to service.' }] },
    { id: 'sm', group: 'Fabric', title: 'Subnet Manager', pick: /subnet manager|sminfo|\bsm\b|opensm/i, cmd: 'sminfo', field: 'sminfo / sm state', src: 'ib-sminfo sheet',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['One SM in state MASTER', 'others STANDBY'] },
        { cls: 'warn', label: 'Single point', lines: ['One MASTER, no STANDBY'], tip: 'Works, but a reboot of that switch stops fabric changes.' },
        { cls: 'crit', label: 'Broken', lines: ['sminfo fails / no MASTER', 'or two MASTERs (split fabric)'], tip: 'Ports sit in Initializing until an SM configures them.' }] },
    { id: 'verbs', group: 'Fabric', title: 'RDMA verbs port', pick: /ibv_devinfo|verbs|mtu/i, cmd: 'ibv_devinfo -d $HCA', field: 'state · active_mtu · link_layer', src: 'ib-ibv-devinfo sheet',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['state: PORT_ACTIVE', 'active_mtu: 4096'] },
        { cls: 'warn', label: 'MTU mismatch', lines: ['state: PORT_ACTIVE', 'active_mtu: 1024 / 2048'], tip: 'Works, but large messages are split: check the switch / partition MTU.' },
        { cls: 'crit', label: 'Not usable', lines: ['state: PORT_DOWN / PORT_INIT'], tip: 'No RDMA traffic: go back to ibstat and the physical layer.' }] },

    // ---- Power and cooling (bmc-hardware §2, §5)
    { id: 'sensor', group: 'Power & cooling', title: 'BMC sensor status', pick: /sensor|sdr|threshold|environment|thermal/i, pickCmd: /\bsdr\b|sensor|environment|Thermal/i, cmd: 'ipmitool sdr elist', field: 'Status column; the sensor\u2019s own thresholds (lnc/lcr/unc/ucr)', src: 'bmc-hardware §2',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Status: ok on every sensor'] },
        { cls: 'warn', label: 'Non-critical', lines: ['Status: nc (lower/upper', 'non-critical crossed)'], tip: 'Early warning: check airflow, fans, inlet temperature.' },
        { cls: 'crit', label: 'Critical', lines: ['Status: cr or nr', '(critical / non-recoverable)'], tip: 'Throttling or protective shutdown is next. Correlate with the SEL.' }] },
    { id: 'psu', group: 'Power & cooling', title: 'Power supplies', pick: /psu|power suppl|redundan|wattage|environment|chassis power/i, pickCmd: /power|psu|environment|\bsdr\b/i, cmd: 'ipmitool sdr type "Power Supply"', field: 'Presence / redundancy / failure states', src: 'bmc-hardware §5',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Every PSU: Presence detected', 'Redundancy: Fully Redundant'] },
        { cls: 'warn', label: 'Predictive', lines: ['Predictive Failure asserted'], tip: 'Plan a swap; still delivering power.' },
        { cls: 'crit', label: 'Redundancy lost', lines: ['AC lost / Failure detected', 'Redundancy Lost'], tip: 'Check the PDU feed and cord first, then the PSU. GPU nodes may throttle or drop GPUs.' }] },
    { id: 'fan', group: 'Power & cooling', title: 'Fans', pick: /fan|rpm|cooling|environment/i, pickCmd: /fan|environment|Thermal|\bsdr\b/i, cmd: 'ipmitool sdr type Fan', field: 'Fan RPM vs its lower thresholds', src: 'bmc-hardware §5',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['All fans ok, RPM similar', 'across the same fan type'] },
        { cls: 'warn', label: 'Low', lines: ['One fan at lnc', '(lower non-critical)'], tip: 'Bearing or obstruction: plan a swap.' },
        { cls: 'crit', label: 'Failed', lines: ['lcr / 0 RPM / Not present'], tip: 'Replace the fan module; watch GPU and CPU temperatures meanwhile.' }] },
    { id: 'leak', group: 'Power & cooling', title: 'Liquid cooling (DLC)', pick: /leak|coolant|liquid|dlc|cdu/i, cmd: 'ipmitool sdr elist | grep -E -i "leak|coolant|flow|cdu"', field: 'Leak, coolant flow and CDU sensors', src: 'bmc-hardware §5 (CRITICAL)',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Leak: no leak · Flow: ok', 'CDU: ok'] },
        { cls: 'warn', label: 'Watch', lines: ['Coolant or GPU temps rising', 'flow still ok'], tip: 'Tell facilities; check CDU set point and filters.' },
        { cls: 'crit', label: 'STOP', lines: ['Leak Detected / Coolant Flow Low', 'CDU Fault'], tip: 'Alert immediately. Never power on a node with an active leak alarm.' }] },
    { id: 'sel', group: 'Power & cooling', title: 'System Event Log', pick: /\bsel\b|event log|logservice/i, cmd: 'ipmitool sel elist | tail -n 50', field: 'Recent entries and severity', src: 'bmc-hardware §2–3',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Only informational entries', '(power on, log cleared, OS boot)'] },
        { cls: 'warn', label: 'Log nearly full', lines: ['sel info: Percent Used near 100%'], tip: 'New events may be dropped: back it up, then clear with approval.' },
        { cls: 'crit', label: 'Act', lines: ['Critical asserted: Uncorrectable ECC,', 'PSU failure, Processor IERR, leak'], tip: 'Match the timestamp to dmesg and open the matching runbook.' }] },
    { id: 'lastpower', group: 'Power & cooling', title: 'Last power event', pick: /chassis status|last power|power state/i, cmd: 'ipmitool chassis status', field: 'System Power · Last Power Event · Power Overload / Fault', src: 'bmc-hardware §2',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['System Power: on', 'Last Power Event: (blank) or command'] },
        { cls: 'warn', label: 'Explained', lines: ['Last Power Event: command', 'after a planned cycle'], tip: 'Expected after maintenance; confirm with the ticket.' },
        { cls: 'crit', label: 'Unplanned', lines: ['Last Power Event: ac-failed /', 'overload / interlock / fault'], tip: 'Check PDU, PSUs and the SEL around that time.' }] },
    { id: 'rfhealth', group: 'Power & cooling', title: 'Redfish Status.Health', pick: /status|health|systems\/|chassis/i, pickCmd: /redfish\/v1\/(Systems|Chassis)/i, cmd: 'curl -g -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/1" | jq .Status', field: 'Status.State · Status.Health · HealthRollup', src: 'Redfish standard Status values',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['"State": "Enabled"', '"Health": "OK"'] },
        { cls: 'warn', label: 'Warning', lines: ['"Health": "Warning"'], tip: 'Something under this resource needs attention: follow HealthRollup down.' },
        { cls: 'crit', label: 'Critical', lines: ['"Health": "Critical"', 'or "State": "Disabled"/"Absent"'], tip: 'Find the child resource reporting it (fan, PSU, GPU, drive).' }] },

    // ---- Links, bonds and routing
    { id: 'nvlinkst', group: 'GPU', title: 'NVLink lanes', pick: /nvlink.{0,40}(lane|active|crc|replay|error|rate)/i, pickCmd: /nvlink\s+(-s|-e|--status|-c|--capabilities)/i, cmd: 'nvidia-smi nvlink -s -i $GPU && nvidia-smi nvlink -e -i $GPU', field: 'Per-link speed and CRC / replay / recovery counters', src: 'gpu-nvlink §1–2',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Every link: <speed> GB/s', 'CRC / replay / recovery: 0'] },
        { cls: 'warn', label: 'Watch', lines: ['All links up', 'replay counters slowly rising'], tip: 'Trend it; compare with other GPUs on the baseboard.' },
        { cls: 'crit', label: 'Failing', lines: ['Link <inactive>', 'or recovery errors climbing (Xid 74)'], tip: 'Follow the GPU-memory / NVLink runbook; check SXids and Fabric Manager.' }] },
    { id: 'lacp', group: 'Network', title: 'LACP bond members', pick: /lacp|bond|port-channel|aggregat/i, pickCmd: /bonding|port-channel|interface bond|lacp/i, cmd: 'cat /proc/net/bonding/bond0', field: 'MII Status · Aggregator ID · Partner Mac Address', src: 'eth-bonding-vlans sheet',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Every member: MII Status up', 'same Aggregator ID, real Partner MAC'] },
        { cls: 'warn', label: 'Degraded', lines: ['One member down', 'bond still up on the others'], tip: 'Half the bandwidth and no redundancy: fix the member link.' },
        { cls: 'crit', label: 'Not bundling', lines: ['Partner Mac 00:00:00:00:00:00', 'or members on different Aggregator IDs'], tip: 'The switch port is not running LACP or is in the wrong port-channel.' }] },
    { id: 'mlag', group: 'Network', title: 'MLAG / vPC pair', pick: /mlag|vpc|clag|peer/i, pickCmd: /\bmlag\b|\bvpc\b|clag/i, cmd: 'show mlag', field: 'Peer link · keepalive · consistency', src: 'sw-arista-mlag · sw-nxos-vpc sheets',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Peer link up · keepalive up', 'state Active · config consistent'] },
        { cls: 'warn', label: 'Inconsistent', lines: ['Config-sanity / consistency', 'warnings on some ports'], tip: 'Ports may be suspended on one peer: diff the two configs.' },
        { cls: 'crit', label: 'Split', lines: ['Peer link or keepalive down', 'one side inactive'], tip: 'Dual-homed servers lose redundancy; restore the peer link first.' }] },
    { id: 'bgp', group: 'Network', title: 'BGP sessions', pick: /bgp/i, pickCmd: /bgp/i, cmd: 'show ip bgp summary', field: 'State/PfxRcd per neighbour', src: 'sw-cumulus-bgp · sw-arista-bgp sheets',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Established, prefixes received', 'uptime steady'] },
        { cls: 'warn', label: 'Up, empty', lines: ['Established, 0 prefixes'], tip: 'Session is up but policy filters everything: check route maps.' },
        { cls: 'crit', label: 'Down / flapping', lines: ['Idle / Active / Connect', 'or uptime keeps resetting'], tip: 'Check the underlying link, MTU and neighbour config.' }] },
    { id: 'pfc', group: 'Network', title: 'RoCE PFC pause frames', pick: /pfc|priority flow|pause/i, pickCmd: /pfc|pause|qos roce/i, cmd: 'ethtool -S $IFACE | grep -E -i "pause|pfc|prio"', field: 'Per-priority pause counters, read twice', src: 'sw-cumulus-bgp · sw-sonic sheets',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Pause counters low and', 'only growing under heavy load'] },
        { cls: 'warn', label: 'Congested', lines: ['Pauses rising steadily', 'on the RoCE priority'], tip: 'Lossless is working hard: check ECN marking and incast patterns.' },
        { cls: 'crit', label: 'PFC storm', lines: ['Pause counters racing,', 'or PFC watchdog drops'], tip: 'A stuck receiver can freeze the fabric: find the port sourcing the pauses.' }] },
    { id: 'tdr', group: 'Network', title: 'Copper cable test (TDR)', pick: /tdr|cable.?test|cable-test/i, pickCmd: /cable-test|cable_test|tdr/i, cmd: 'sudo ethtool --cable-test $IFACE', field: 'Result per pair (A–D) and fault distance', src: 'eth-rj45-tdr sheet',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['Pair A..D: OK'] },
        { cls: 'warn', label: 'Marginal', lines: ['Pair OK but link trains', 'below rated speed'], tip: 'Check category / length and re-terminate.' },
        { cls: 'crit', label: 'Fault', lines: ['Pair X: Open / Short', 'at N m'], tip: 'The distance shows where: patch cord, panel or run. The test drops the link briefly: idle ports only.' }] },
    { id: 'mtu', group: 'Network', title: 'Jumbo-frame path (9000 MTU)', pick: /jumbo|fragment/i, pickCmd: /ping[^|;&]*-M\s*do/i, cmd: 'ping -6 -M do -s 8952 -c 3 <peer>', field: 'Replies vs "message too long"', src: 'eth-lldp-perf sheet',
      states: [{ cls: 'ok', label: 'Healthy', lines: ['3 packets transmitted, 3 received', 'with -s 8952 (IPv6) / 8972 (IPv4)'] },
        { cls: 'warn', label: 'Partial', lines: ['Some replies lost at full size', 'small pings fine'], tip: 'Possible MTU mismatch on one hop of an ECMP path.' },
        { cls: 'crit', label: 'Mismatch', lines: ['"Message too long" / no replies', 'at full size'], tip: 'A hop has a smaller MTU: compare interface MTU along the path.' }] }
  ];
  const HEALTH_BY_SHEET = [
    [/^(ib-mlxlink|fo-dom-cli|ib-mlxcables|fo-cleaning-testing|fiber|eth-ethtool-tuning)\.html$/, ['rx', 'tx', 'skew', 'otemp']],
    [/^(nv-admin|nv-smi|nv-dcgm|nv-ops)\.html$/, ['remap', 'gdelta', 'pcie']],
    [/^nvidia\.html$/, ['remap', 'gdelta', 'pcie', 'nvlinkst']],
    [/^(nv-pcie|pcie-numa|mb-pcie-dxe-post)\.html$/, ['pcie', 'gdelta']],
    [/^(nvme-smart|storage)\.html$/, ['cw', 'spare', 'wear', 'media']],
    [/^(ecc-edac|mb-memory-post|dmi-hw)\.html$/, ['ce']],
    // switches
    [/^switches\.html$/, ['rx', 'tx', 'otemp', 'portctr', 'psu', 'fan']],
    [/^(sw-quantum-ports|sw-quantum-inband)\.html$/, ['ibstate', 'rx', 'tx', 'portctr']],
    [/^sw-quantum-hw-sm\.html$/, ['psu', 'fan', 'sm']],
    [/^(sw-arista-ports|sw-cumulus-optics)\.html$/, ['rx', 'tx', 'otemp', 'portctr']],
    [/^sw-nxos-ports\.html$/, ['rx', 'tx', 'otemp']],
    [/^sw-cumulus-ports\.html$/, ['portctr']],
    [/^sw-sonic\.html$/, ['rx', 'tx', 'portctr', 'pfc', 'psu', 'fan']],
    [/^sw-cumulus-hw\.html$/, ['psu', 'fan', 'sensor']],
    [/^sw-cumulus-bgp\.html$/, ['bgp', 'pfc']],
    [/^sw-arista-bgp\.html$/, ['bgp', 'psu', 'fan']],
    [/^(sw-arista-mlag|sw-cumulus-bonds)\.html$/, ['mlag', 'lacp']],
    [/^sw-nxos-vpc\.html$/, ['mlag', 'lacp', 'psu', 'fan']],
    // InfiniBand
    [/^infiniband\.html$/, ['ibstate', 'ibctr', 'verbs', 'sm']],
    [/^(ib-ibstat|ib-iblinkinfo)\.html$/, ['ibstate']],
    [/^(ib-perfquery|ib-ibqueryerrors)\.html$/, ['ibctr']],
    [/^ib-ibdiagnet\.html$/, ['ibdiag', 'ibctr']],
    [/^ib-sminfo\.html$/, ['sm']],
    [/^ib-ibv-devinfo\.html$/, ['verbs']],
    // BMC, power, cooling
    [/^ipmi\.html$/, ['sensor', 'psu', 'fan', 'sel', 'lastpower']],
    [/^ipmi-sensors-sdr\.html$/, ['sensor', 'fan', 'psu']],
    [/^ipmi-sel-logs\.html$/, ['sel']],
    [/^ipmi-chassis-power\.html$/, ['lastpower', 'psu']],
    [/^redfish\.html$/, ['rfhealth', 'psu', 'fan', 'leak']],
    [/^rf-thermals-power\.html$/, ['rfhealth', 'fan', 'psu']],
    [/^rf-hgx-dlc\.html$/, ['leak', 'rfhealth']],
    [/^rf-logs-sel\.html$/, ['sel']],
    [/^rf-inventory\.html$/, ['rfhealth']],
    // GPU, Ethernet, Windows storage
    [/^nv-nvlink\.html$/, ['nvlinkst']],
    [/^(eth-bonding-vlans)\.html$/, ['lacp']],
    [/^ethernet\.html$/, ['lacp', 'tdr', 'mtu']],
    [/^eth-rj45-tdr\.html$/, ['tdr']],
    [/^eth-lldp-perf\.html$/, ['mtu']],
    [/^win-storage\.html$/, ['wear', 'media']]
  ];

  // The command shown on a card is the sheet's own command for that reading when the sheet has one
  // (vendor CLI on switch pages, Redfish/ipmitool on BMC pages); otherwise the card's default.
  // Read-only only: a card must never offer a command that changes anything.
  const HX_MUTATES = /-X\s*(POST|PATCH|PUT|DELETE)|\bnv\s+(set|unset)\b|\bnv\s+config\s+(apply|replace|patch|restore)\b|(^|&&\s*|;\s*)(sudo\s+)?config\s|\bclear\b|\breset\b|\bshut|\bset\s|\bapply\b|\bflash|\bburn|\bupdate\b|\benable\b|\bdisable\b|\bdelete\b|\bremove\b|\bwrite\b|\s-R\b|--force/i;
  function sheetCmdFor(m, file) {
    if ((!m.pick && !m.pickCmd) || !file) return m.cmd;
    const items = (window.GLOBAL_SEARCH_INDEX || []).filter(i => i.file === file && !i.noCopy && !DANGER_RE.test(i.cmd) && !HX_MUTATES.test(i.cmd) && !/syntax|options breakdown|man page|--help/i.test(i.desc));
    let best = null, bestScore = 0;
    items.forEach(i => {
      const cmd = firstCommand(i.cmd);
      let score = 0;
      if (m.pickCmd && m.pickCmd.test(cmd)) score += 5;
      if (m.pick) {
        const re = new RegExp(m.pick.source, 'gi');
        score += new Set((i.desc.match(re) || []).map(x => x.toLowerCase())).size;
      }
      if (score > bestScore) { best = cmd; bestScore = score; }
    });
    // A card that names the command shape it wants (pickCmd) only accepts a real match.
    if (m.pickCmd && bestScore < 5) return m.cmd;
    return best || m.cmd;
  }

  function healthCardHtml(m, file) {
    m = Object.assign({}, m, { cmd: sheetCmdFor(m, file) });
    const z = (cls) => ({ ok: 'Healthy', warn: 'Watch', crit: 'Failing' }[cls]);
    let visual = '';
    if (m.states) {
      visual = `<div class="hx-states">${m.states.map(s => `
        <div class="hx-state z-${s.cls}"><span class="ber-badge z-${s.cls}">${escapeHtml(s.label)}</span>
          <pre>${s.lines.map(escapeHtml).join('\n')}</pre>${s.tip ? `<small>${escapeHtml(s.tip)}</small>` : ''}</div>`).join('')}</div>`;
    } else {
      const pos = v => `${((Math.min(m.max, Math.max(m.min, v)) - m.min) / (m.max - m.min) * 100).toFixed(2)}%`;
      let from = m.min;
      const bands = m.zones.map(zn => { const h = `<span class="ber-band z-${zn.cls}" style="left:${pos(from)};width:calc(${pos(zn.to)} - ${pos(from)})" title="${escapeHtml(zn.label)}"></span>`; from = zn.to; return h; }).join('');
      visual = `
        <div class="hx-scale">
          <div class="ber-track hx-track">${bands}${m.ex.map(e => `<span class="ber-marker z-${e.cls}" style="left:${pos(e.v)}"></span>`).join('')}</div>
          <div class="hx-labels">${(() => {
            // Labels closer than ~22% of the bar drop to a second row; edge labels align inward.
            const pct = v => (Math.min(m.max, Math.max(m.min, v)) - m.min) / (m.max - m.min) * 100;
            const sorted = [...m.ex].sort((a, b) => a.v - b.v);
            let lastRow0 = -100;
            return sorted.map(e => {
              const at = pct(e.v);
              const row = at - lastRow0 < 22 ? 1 : 0;
              if (!row) lastRow0 = at;
              const unit = m.log || /%|°|dB/.test(e.label) || !m.unit ? '' : ` ${m.unit}`;
              // Centred labels near the ends spill past the card: align them inward instead.
              const align = at < 22 ? 'start' : at > 78 ? 'end' : 'mid';
              return `<span class="z-${e.cls} row-${row} al-${align}" style="left:${at.toFixed(2)}%"><b>${escapeHtml(z(e.cls))}</b>${escapeHtml(e.label)}${escapeHtml(unit)}</span>`;
            }).join('');
          })()}</div>
          <div class="hx-zones">${m.zones.map(zn => `<span class="z-${zn.cls}"><i></i>${escapeHtml(zn.label)}</span>`).join('')}</div>
        </div>`;
    }
    return `
      <article class="hx-card" id="hx-${m.id}">
        <header><span class="hx-group">${escapeHtml(m.group)}</span><h3>${escapeHtml(m.title)}</h3></header>
        <div class="hx-cmd"><code>${escapeHtml(m.cmd)}</code><button type="button" data-hx-copy="${escapeHtml(m.cmd)}">Copy</button></div>
        <div class="hx-field">Read: <code>${escapeHtml(m.field)}</code></div>
        ${visual}
        ${m.note ? `<p class="hx-note">${escapeHtml(m.note)}</p>` : ''}
        <small class="hx-src">Source: docs/playbooks/${escapeHtml(m.src)}</small>
      </article>`;
  }

  function healthPanelHtml(ids, withBerLink, file) {
    const ms = ids.map(id => HEALTH.find(h => h.id === id)).filter(Boolean);
    return `<div class="hx-grid">${ms.map(m => healthCardHtml(m, file)).join('')}</div>
      ${withBerLink ? '<button type="button" class="hx-more" data-ber-open>BER: healthy vs unhealthy →</button>' : ''}`;
  }

  let atlasEl = null;
  function openHealthAtlas(focusId) {
    if (!atlasEl) {
      atlasEl = document.createElement('div');
      atlasEl.className = 'an-backdrop atlas-backdrop';
      const groups = [...new Set(HEALTH.map(h => h.group))];
      const slug = g => g.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      atlasEl.innerHTML = `
        <div class="an-dialog atlas-dialog" role="dialog" aria-modal="true" aria-labelledby="atlas-title">
          <header class="an-head"><div><h2 id="atlas-title">Health atlas</h2><p>What healthy, worth-watching and failing look like for the numbers you check most. Every range comes from docs/playbooks.</p></div><button type="button" class="trail-close" data-atlas-close aria-label="Close">✕</button></header>
          <nav class="atlas-tabs">${groups.map(g => `<a href="#atlas-${slug(g)}" data-atlas-jump="${slug(g)}">${escapeHtml(g)}</a>`).join('')}<button type="button" data-ber-open>BER →</button></nav>
          <div class="an-body">${groups.map(g => `<section id="atlas-${slug(g)}" class="atlas-group"><h3>${escapeHtml(g)}</h3>${healthPanelHtml(HEALTH.filter(h => h.group === g).map(h => h.id), false)}</section>`).join('')}</div>
        </div>`;
      document.body.appendChild(atlasEl);
      atlasEl.addEventListener('click', (e) => {
        const el = e.target instanceof Element ? e.target : null;
        if (!el) return;
        if (e.target === atlasEl || el.closest('[data-atlas-close]')) return closeAtlas();
        const jump = el.closest('[data-atlas-jump]');
        if (jump) { e.preventDefault(); atlasEl.querySelector(`#atlas-${jump.dataset.atlasJump}`).scrollIntoView({ block: 'start', behavior: 'instant' }); }
        if (el.closest('[data-ber-open]')) closeAtlas();
      });
      atlasEl.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeAtlas(); } });
    }
    atlasEl.classList.add('show');
    document.body.style.overflow = 'hidden';
    const target = focusId && atlasEl.querySelector(`#hx-${focusId}`);
    if (target) target.scrollIntoView({ block: 'center', behavior: 'instant' });
    setTimeout(() => atlasEl.querySelector('.trail-close').focus({ preventScroll: true }), 30);
  }
  function closeAtlas() { if (atlasEl) { atlasEl.classList.remove('show'); document.body.style.overflow = ''; } }

  function renderHealthPanel() {
    if (IN_WIDGET_FRAME) return;
    document.querySelectorAll('.hx-panel').forEach(el => el.remove());
    const file = anatSheetFile || window.location.pathname.split('/').pop() || '';
    const hit = HEALTH_BY_SHEET.find(([re]) => re.test(file));
    const main = document.querySelector('main');
    if (!hit || !main) return;
    const optics = hit[1].includes('rx');
    const panel = document.createElement('section');
    panel.className = 'container hx-panel';
    panel.innerHTML = `<details open><summary><h2>What healthy looks like</h2><span>Ranges for the numbers this sheet's commands print · <button type="button" class="hx-all" data-atlas-open>Open the full health atlas</button></span></summary>${healthPanelHtml(hit[1], optics, file)}</details>`;
    // Above the BER panel when both apply, otherwise straight above the sheet.
    const ber = document.querySelector('.ber-panel');
    (ber || main).insertAdjacentElement('beforebegin', panel);
  }

  function initHealthAtlas() {
    if (IN_WIDGET_FRAME) return;
    renderHealthPanel();
    document.addEventListener('click', (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const copy = el.closest('[data-hx-copy]');
      if (copy) { navigator.clipboard.writeText(copy.dataset.hxCopy); copy.textContent = 'Copied'; setTimeout(() => { copy.textContent = 'Copy'; }, 1300); return; }
      if (el.closest('[data-atlas-open]')) { e.preventDefault(); openHealthAtlas(); }
    });
  }

  function analyzeSmartlog(text) {
    const kv = anParseKV(text);
    const f = [];
    const add = (sev, title, detail, rule) => f.push({ sev, title, detail, rule });
    const cwRaw = anGet(kv, /^critical_warning$/) || '0';
    const cw = /^0x/i.test(cwRaw.trim()) ? parseInt(cwRaw, 16) : parseInt(cwRaw, 10) || 0;
    const temp = anNum(anGet(kv, /^temperature$/));
    const spare = anNum(anGet(kv, /^available_spare$/));
    const spareTh = anNum(anGet(kv, /^available_spare_threshold$/));
    const used = anNum(anGet(kv, /^percentage_used$/));
    const media = anNum(anGet(kv, /^media_errors$/));
    const errs = anNum(anGet(kv, /^num_err_log_entries$/));
    const unsafe = anNum(anGet(kv, /^unsafe_shutdowns$/));
    const hours = anNum(anGet(kv, /^power_on_hours$/));
    const dev = (String(text).match(/device:\s*(\S+)/) || [])[1];

    const bits = [[0x01, 'crit', 'Available spare below threshold', 'RMA the drive.'], [0x02, 'warn', 'Temperature threshold exceeded', 'Check fans, airflow and the drive heatsink rather than the drive.'],
      [0x04, 'crit', 'NVM subsystem reliability degraded', 'Media or internal errors: RMA the drive.'], [0x08, 'crit', 'Media is read-only', 'Immediate RMA.'], [0x10, 'warn', 'Volatile memory backup failed', 'Power-loss protection is compromised.']];
    bits.forEach(([bit, sev, title, detail]) => { if (cw & bit) add(sev, `critical_warning 0x${bit.toString(16).padStart(2, '0')}: ${title}`, detail, 'storage-jbod §1 critical_warning bits'); });
    if (spare != null && spareTh != null && spare < spareTh) add('crit', `Spare ${spare}% is below its ${spareTh}% threshold`, 'Endurance exhausted: replace the drive.', 'storage-jbod §1 available_spare < threshold');
    if (media != null && media > 0) add('crit', `${media} media errors`, 'Unrecovered media/data-integrity errors. With kernel I/O errors this meets the RMA criteria.', 'storage-jbod §1 media_errors > 0');
    if (used != null && used >= 100) add('crit', `Endurance used ${used}%`, 'Rated write endurance is exhausted: plan replacement.', 'NVMe percentage_used');
    else if (used != null && used >= 90) add('warn', `Endurance used ${used}%`, 'Approaching rated write endurance: plan replacement.', 'NVMe percentage_used');
    if (temp != null && temp >= 70) add('warn', `Composite temperature ${temp} °C`, 'Check airflow and heatsink.', 'storage-jbod §1 bit 0x02');
    if (errs != null && errs > 0) add('info', `${errs.toLocaleString('en-US')} error-log entries`, 'Read them with nvme error-log to see which commands failed.', 'nvme error-log');
    if (unsafe != null && unsafe > 10) add('info', `${unsafe} unsafe shutdowns`, 'Power was lost without a clean flush; check PSU/PDU history if this grows.', 'NVMe unsafe_shutdowns');
    if (!f.some(x => x.sev !== 'info')) add('ok', 'No RMA criteria met', 'critical_warning clear, spare above threshold, no media errors.', 'storage-jbod §1');

    return {
      type: 'smartlog', title: `nvme smart-log${dev ? `: ${dev}` : ''}`, runbook: 'nvme',
      facts: [['critical_warning', `0x${cw.toString(16).padStart(2, '0')}`], ['Temperature', temp != null ? `${temp} °C` : '—'], ['Spare', spare != null ? `${spare}% (threshold ${spareTh ?? '—'}%)` : '—'],
        ['Endurance used', used != null ? `${used}%` : '—'], ['Media errors', media ?? '—'], ['Error log', errs ?? '—'], ['Power-on', hours != null ? `${hours.toLocaleString('en-US')} h` : '—']],
      gauges: { spare, spareTh, used },
      findings: f.sort((a, b) => AN_SEV_ORDER[b.sev] - AN_SEV_ORDER[a.sev])
    };
  }

  // nvidia-smi topo -m: tabs or (after a terminal copy) runs of spaces.
  const TOPO_RANK = { PIX: 1, PXB: 2, PHB: 3, NODE: 4, SYS: 5 };
  function analyzeTopo(text) {
    const lines = String(text).split(/\r?\n/);
    // The header lists device names ("GPU0 GPU1 …"); the GPU0 row continues with cells ("GPU0 X NV18 …").
    const headerIdx = lines.findIndex(l => { const t = l.trim().split(/\s+/); return t[0] === 'GPU0' && /^(GPU1|NIC0|mlx5_0)$/.test(t[1] || ''); });
    if (headerIdx < 0) return null;
    const devices = lines[headerIdx].trim().split(/\s+/).filter(t => /^(GPU\d+|NIC\d+|mlx5_\d+)$/.test(t));
    const N = devices.length;
    const m = {};
    const extra = {};
    lines.slice(headerIdx + 1).forEach(l => {
      const tok = l.trim().split(/\s+/);
      if (!devices.includes(tok[0]) || tok.length < N + 1) return;
      m[tok[0]] = {};
      devices.forEach((d, i) => { m[tok[0]][d] = tok[1 + i]; });
      extra[tok[0]] = { cpu: tok[1 + N] || '', numa: /^\d+$/.test(tok[2 + N] || '') ? tok[2 + N] : '' };
    });
    const nicName = {};
    lines.forEach(l => { const mm = l.match(/^\s*(NIC\d+)\s*:\s*(\S+)/); if (mm) nicName[mm[1]] = mm[2]; });
    const gpus = devices.filter(d => /^GPU/.test(d) && m[d]);
    const nics = devices.filter(d => !/^GPU/.test(d));
    const f = [];
    const add = (sev, title, detail, rule) => f.push({ sev, title, detail, rule });
    const flagged = new Set();

    // NVLink between GPU pairs
    const pairs = [];
    gpus.forEach((a, i) => gpus.slice(i + 1).forEach(b => pairs.push([a, b, m[a][b]])));
    const nvCounts = pairs.map(([, , v]) => (/^NV(\d+)$/.exec(v) || [])[1]).filter(Boolean).map(Number);
    if (gpus.length > 1 && nvCounts.length) {
      const freq = {};
      nvCounts.forEach(c => { freq[c] = (freq[c] || 0) + 1; });
      const mode = Number(Object.entries(freq).sort((x, y) => y[1] - x[1])[0][0]);
      const perGpu = {};
      pairs.forEach(([a, b, v]) => {
        const nv = /^NV(\d+)$/.exec(v);
        if (!nv) {
          add('crit', `${a} ↔ ${b}: no NVLink (${v})`, `Other GPU pairs use NV${mode}. Traffic between these two falls back to PCIe. Check nvidia-smi nvlink -s, Fabric Manager and SXids.`, 'gpu-nvlink §2 Xid 74 / NVSwitch');
          flagged.add(`${a}|${b}`); perGpu[a] = (perGpu[a] || 0) + 1; perGpu[b] = (perGpu[b] || 0) + 1;
        } else if (Number(nv[1]) < mode) {
          add('warn', `${a} ↔ ${b}: NV${nv[1]}, other pairs NV${mode}`, `${mode - Number(nv[1])} NVLink lanes are not up between these GPUs: check nvidia-smi nvlink -s / -e for down links and dmesg for Xid 74.`, 'gpu-nvlink §2 Xid 74 NVLink error');
          flagged.add(`${a}|${b}`); perGpu[a] = (perGpu[a] || 0) + 1; perGpu[b] = (perGpu[b] || 0) + 1;
        }
      });
      Object.entries(perGpu).forEach(([g, n]) => {
        if (gpus.length > 2 && n >= gpus.length - 1) add('crit', `${g} has reduced NVLink to every peer`, 'Points at that GPU or its baseboard/SXM seat rather than a single link: correlate with SXids and plan a reseat or RMA.', 'gpu-nvlink §2 SXid / NVSwitch');
      });
    } else if (gpus.length > 1) {
      add('info', 'No NVLink between GPUs', 'This looks like a PCIe-only system. Expected on RTX/PCIe servers, not on HGX.', 'nvidia-smi topo -m legend');
    }

    // GPU ↔ nearest NIC
    const pairing = gpus.map(g => {
      let best = null;
      nics.forEach(n => {
        const r = TOPO_RANK[m[g][n]];
        if (r && (!best || r < best.rank)) best = { nic: n, link: m[g][n], rank: r };
      });
      return { gpu: g, nic: best ? best.nic : '', dev: best ? (nicName[best.nic] || (/^mlx5/.test(best.nic) ? best.nic : '')) : '', link: best ? best.link : '—', rank: best ? best.rank : 9, numa: (extra[g] || {}).numa };
    });
    if (nics.length && pairing.length) {
      const anyLocal = pairing.some(p => p.rank <= 2);
      pairing.forEach(p => {
        if (anyLocal && p.rank >= 4) {
          p.bad = true;
          add('warn', `${p.gpu} has no PCIe-local NIC (nearest is ${p.dev || p.nic} via ${p.link})`, 'GPUDirect RDMA from this GPU crosses the host bridge or the CPU interconnect, which costs bandwidth and NCCL performance. Check that the NIC beside this GPU is seated, enumerated and not disabled in BIOS.', 'nv-gpudirect: GPU ↔ NIC PIX alignment');
        }
      });
      const local = pairing.filter(p => p.rank === 1);
      const byNic = {};
      local.forEach(p => { (byNic[p.nic] = byNic[p.nic] || []).push(p.gpu); });
      Object.entries(byNic).forEach(([n, gs]) => { if (gs.length > 1) add('info', `${gs.join(' and ')} share ${nicName[n] || n}`, 'Two GPUs behind one PCIe switch and NIC split its bandwidth. Normal on some designs; on 1:1 HGX layouts it means a NIC is missing.', 'nv-gpudirect'); });
      if (!anyLocal) add('info', 'No GPU shares a PCIe switch with a NIC', 'Normal on many PCIe servers; on HGX expect one PIX NIC per GPU.', 'nvidia-smi topo -m legend');
    }
    const numas = [...new Set(gpus.map(g => (extra[g] || {}).numa).filter(Boolean))];
    if (!f.some(x => x.sev !== 'info')) add('ok', 'Topology looks consistent', `${gpus.length} GPUs${nvCounts.length ? ` fully meshed over NVLink` : ''}${pairing.some(p => p.rank <= 2) ? ', each with a PCIe-local NIC' : ''}.`, 'nvidia-smi topo -m');

    return {
      type: 'topo', title: 'nvidia-smi topo -m: GPU/NIC topology', sheet: 'nv-nvlink.html',
      facts: [['GPUs', gpus.length], ['NICs', nics.length], ['NVLink', nvCounts.length ? `NV${Math.max(...nvCounts)} max, NV${Math.min(...nvCounts)} min` : 'none'], ['NUMA nodes', numas.length ? numas.join(', ') : '—'], ['GPU→NIC PIX', `${pairing.filter(p => p.rank === 1).length}/${gpus.length}`]],
      matrix: { devices: devices.filter(d => m[d]), m, flagged, nicName },
      pairing,
      findings: f.sort((a, b) => AN_SEV_ORDER[b.sev] - AN_SEV_ORDER[a.sev])
    };
  }

  function topoClass(v) {
    if (!v || /^X$/.test(v)) return 'lk-x';
    const nv = /^NV(\d+)$/.exec(v);
    if (nv) return 'lk-nv';
    return `lk-${v.toLowerCase()}`;
  }

  function renderTopo(r) {
    const { devices, m, flagged, nicName } = r.matrix;
    const label = d => (nicName[d] ? `${d}<small>${escapeHtml(nicName[d])}</small>` : escapeHtml(d));
    const table = `
      <div class="topo-wrap"><table class="topo-grid">
        <thead><tr><th></th>${devices.map(d => `<th scope="col">${label(d)}</th>`).join('')}</tr></thead>
        <tbody>${devices.map(a => `<tr><th scope="row">${label(a)}</th>${devices.map(b => {
          const v = m[a][b] || '';
          const bad = flagged.has(`${a}|${b}`) || flagged.has(`${b}|${a}`);
          return `<td class="${topoClass(v)}${bad ? ' lk-bad' : ''}" title="${escapeHtml(`${a} ↔ ${b}: ${v}`)}">${v === 'X' ? '·' : escapeHtml(v)}</td>`;
        }).join('')}</tr>`).join('')}</tbody>
      </table></div>
      <div class="topo-legend">${['NV', 'PIX', 'PXB', 'PHB', 'NODE', 'SYS'].map(k => `<span><i class="lk-${k.toLowerCase()}"></i>${k === 'NV' ? 'NVLink' : k}</span>`).join('')}<span><i class="lk-bad-key"></i>flagged</span></div>`;
    const pairing = r.pairing.length && r.pairing.some(p => p.nic) ? `
      <div class="an-chart"><div class="an-chart-head"><b>GPU → nearest NIC</b><span>PIX = same PCIe switch, best for GPUDirect RDMA</span></div>
        <table class="topo-pairs"><thead><tr><th>GPU</th><th>NIC</th><th>Device</th><th>Link</th><th>NUMA</th></tr></thead><tbody>
          ${r.pairing.map(p => `<tr class="${p.bad ? 'is-bad' : ''}"><td>${p.gpu}</td><td>${escapeHtml(p.nic || '—')}</td><td>${escapeHtml(p.dev || '—')}</td><td><span class="topo-pill ${topoClass(p.link)}">${escapeHtml(p.link)}</span></td><td>${escapeHtml(p.numa || '—')}</td></tr>`).join('')}
        </tbody></table></div>` : '';
    return `<div class="an-chart topo-chart"><div class="an-chart-head"><b>Link matrix</b><span>hover a cell for the pair</span></div>${table}</div>${pairing}`;
  }

  function analyzeOutput(text) {
    const type = detectOutput(text);
    if (type === 'topo') return analyzeTopo(text);
    if (type === 'mlxlink') return analyzeMlxlink(text);
    if (type === 'smartlog') return analyzeSmartlog(text);
    return null;
  }

  // Lane chart: dBm on a fixed -42…+6 scale with the playbook limit and module range marked.
  function laneChart(label, data, limit, limitLabel) {
    if (!data || !data.values.length) return '';
    const lo = -42, hi = 6;
    const pos = v => `${((Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo) * 100).toFixed(2)}%`;
    const live = data.values.filter(v => v > -30);
    const max = live.length ? Math.max(...live) : 0;
    return `
      <div class="an-chart">
        <div class="an-chart-head"><b>${label}</b><span>dBm per lane${data.range ? ` · module range ${data.range[0]}…${data.range[1]}` : ''}</span></div>
        <div class="an-lanes">
          ${data.values.map((v, i) => {
            const sev = v <= -30 || v < limit ? 'crit' : (data.range && v < data.range[0]) || (label.startsWith('Rx') && max - v > 3) ? 'warn' : 'ok';
            return `<div class="an-lane"><span class="an-lane-n">L${i}</span>
              <span class="an-track">
                ${data.range ? `<span class="an-range" style="left:${pos(data.range[0])};right:calc(100% - ${pos(data.range[1])})"></span>` : ''}
                <span class="an-limit" style="left:${pos(limit)}" title="${escapeHtml(limitLabel)}"></span>
                <span class="an-bar sev-${sev}" style="width:${pos(v)}"></span>
              </span>
              <span class="an-val sev-${sev}">${v.toFixed(1)}</span></div>`;
          }).join('')}
        </div>
        <div class="an-axis">${[-40, -20, 0].map(v => `<span style="left:${pos(v)}">${v}</span>`).join('')}<span style="left:100%">+6</span><span class="an-axis-limit" style="left:${pos(limit)}">${escapeHtml(limitLabel)}</span></div>
      </div>`;
  }

  function gauge(label, value, max, threshold, invert) {
    if (value == null) return '';
    const pct = Math.max(0, Math.min(100, value / max * 100));
    const bad = invert ? value < threshold : value >= threshold;
    return `<div class="an-gauge"><div class="an-chart-head"><b>${label}</b><span>${value}%${threshold != null ? ` · ${invert ? 'threshold' : 'warn at'} ${threshold}%` : ''}</span></div>
      <span class="an-track"><span class="an-bar sev-${bad ? 'crit' : 'ok'}" style="width:${pct}%"></span>${threshold != null ? `<span class="an-limit" style="left:${threshold / max * 100}%"></span>` : ''}</span></div>`;
  }

  function renderAnalysis(r) {
    const worst = r.findings[0] ? r.findings[0].sev : 'ok';
    const verdict = { crit: 'Action needed', warn: 'Degraded: investigate', info: 'Healthy, with notes', ok: 'Healthy' }[worst];
    const rb = RUNBOOKS.find(x => x.id === r.runbook);
    return `
      <div class="an-report sev-${worst}">
        <div class="an-verdict"><span class="an-type">${escapeHtml(r.title)}</span><b>${verdict}</b><span class="an-count">${r.findings.filter(x => x.sev !== 'ok').length} finding${r.findings.filter(x => x.sev !== 'ok').length === 1 ? '' : 's'}</span></div>
        <dl class="an-facts">${r.facts.map(([k, v]) => `<div><dt>${escapeHtml(k)}</dt><dd>${escapeHtml(String(v))}</dd></div>`).join('')}</dl>
        ${r.ber ? `<div class="an-chart ber-in-report"><div class="an-chart-head"><b>Bit error rate</b><button type="button" class="ber-help" data-ber-open>What does healthy look like?</button></div>${berScaleHtml('raw', r.ber.raw, 'Raw (pre-FEC)')}${berScaleHtml('eff', r.ber.eff, 'Effective (post-FEC)')}</div>` : ''}
        ${r.charts ? `<div class="an-charts">${laneChart('Rx power', r.charts.rx, -10, 'Rx alarm -10')}${laneChart('Tx power', r.charts.tx, -8, 'Tx alarm -8')}</div>` : ''}
        ${r.gauges ? `<div class="an-charts">${gauge('Available spare', r.gauges.spare, 100, r.gauges.spareTh, true)}${gauge('Endurance used', r.gauges.used, 100, 90, false)}</div>` : ''}
        ${r.matrix ? renderTopo(r) : ''}
        <ol class="an-findings">
          ${r.findings.map(x => `<li class="sev-${x.sev}"><span class="an-sev">${{ crit: 'Critical', warn: 'Warning', info: 'Note', ok: 'OK' }[x.sev]}</span><div><b>${escapeHtml(x.title)}</b><p>${escapeHtml(x.detail)}</p><small>Rule: ${escapeHtml(x.rule)}</small></div></li>`).join('')}
        </ol>
        <div class="an-actions">
          <button type="button" class="an-primary" data-an="copy">Copy findings</button>
          ${rb ? `<button type="button" data-an="runbook" data-rb="${rb.id}">▶ ${escapeHtml(rb.title)} runbook</button>` : ''}
          ${r.sheet ? `<button type="button" data-an="sheet" data-sheet="${escapeHtml(r.sheet)}">Open ${escapeHtml(r.sheet.replace(/\.html$/, ''))} sheet →</button>` : ''}
          <button type="button" data-an="again">Analyze another</button>
        </div>
      </div>`;
  }

  function analysisMarkdown(r) {
    return [`### Output analysis: ${r.title}`, '', ...r.facts.map(([k, v]) => `- **${k}:** ${v}`), '', '#### Findings',
      ...r.findings.map(x => `- **${x.sev.toUpperCase()}** ${x.title} — ${x.detail} _(rule: ${x.rule})_`),
      ...(r.pairing && r.pairing.some(p => p.nic) ? ['', '#### GPU → nearest NIC', '| GPU | NIC | Device | Link | NUMA |', '|---|---|---|---|---|', ...r.pairing.map(p => `| ${p.gpu} | ${p.nic || '—'} | ${p.dev || '—'} | ${p.link}${p.bad ? ' ⚠' : ''} | ${p.numa || '—'} |`)] : [])].join('\n');
  }

  let anBackdrop = null;
  let anFocus = null;
  function openAnalyzer(text = '') {
    if (!anBackdrop) {
      anBackdrop = document.createElement('div');
      anBackdrop.className = 'an-backdrop';
      anBackdrop.innerHTML = `
        <div class="an-dialog" role="dialog" aria-modal="true" aria-labelledby="an-title">
          <header class="an-head">
            <div><h2 id="an-title">Output analyzer</h2><p>Paste the full output of <code>mlxlink -d &lt;dev&gt; -m -c -e</code>, <code>nvme smart-log</code> or <code>nvidia-smi topo -m</code>. Checked against the team playbooks; nothing leaves this browser.</p></div>
            <button type="button" class="trail-close" data-an="close" aria-label="Close analyzer">✕</button>
          </header>
          <div class="an-body">
            <textarea class="an-input" spellcheck="false" placeholder="Paste command output here…" aria-label="Command output"></textarea>
            <div class="an-samples"><span>No output handy? Try a sample:</span><button type="button" data-an-sample="mlxlink">mlxlink -m -c -e</button><button type="button" data-an-sample="smartlog">nvme smart-log</button><button type="button" data-an-sample="topo">nvidia-smi topo -m</button></div>
            <div class="an-out" aria-live="polite"></div>
          </div>
        </div>`;
      document.body.appendChild(anBackdrop);
      const input = anBackdrop.querySelector('.an-input');
      const out = anBackdrop.querySelector('.an-out');
      const run = () => {
        const r = analyzeOutput(input.value);
        anBackdrop._result = r;
        anBackdrop.classList.toggle('has-result', !!r);
        out.innerHTML = r ? renderAnalysis(r) : (input.value.trim()
          ? '<p class="an-hint">Not recognised yet. Supported: <code>mlxlink -m -c -e</code> (and <code>-m</code> / <code>-c</code> alone), <code>nvme smart-log</code> and <code>nvidia-smi topo -m</code>. Single log lines go in Ctrl+K for the Symptom Decoder.</p>'
          : '<p class="an-hint">Waiting for output…</p>');
      };
      input.addEventListener('input', run);
      anBackdrop.addEventListener('click', (e) => {
        if (e.target === anBackdrop) return closeAnalyzer();
        const sample = e.target instanceof Element ? e.target.closest('[data-an-sample]') : null;
        if (sample) { input.value = AN_SAMPLES[sample.dataset.anSample]; run(); return; }
        const b = e.target instanceof Element ? e.target.closest('[data-an]') : null;
        if (!b) return;
        const act = b.dataset.an;
        if (act === 'close') closeAnalyzer();
        if (act === 'copy' && anBackdrop._result) { copyVerbatim(analysisMarkdown(anBackdrop._result)); showGlobalToast('Copied the findings as Markdown.'); }
        if (act === 'runbook') { closeAnalyzer(); openRunbook(b.dataset.rb); }
        if (act === 'sheet') { closeAnalyzer(); goToSheet(b.dataset.sheet); }
        if (act === 'again') { input.value = ''; run(); input.focus(); }
      });
      anBackdrop.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeAnalyzer(); } });
      anBackdrop._run = run;
    }
    anFocus = document.activeElement;
    const input = anBackdrop.querySelector('.an-input');
    input.value = text;
    anBackdrop._run();
    anBackdrop.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => (text ? anBackdrop.querySelector('.an-out button, .trail-close') : input).focus(), 40);
  }
  function closeAnalyzer() {
    if (!anBackdrop || !anBackdrop.classList.contains('show')) return;
    anBackdrop.classList.remove('show');
    document.body.style.overflow = '';
    if (anFocus && anFocus.focus) anFocus.focus();
  }

  // Multi-line output pasted into a single-line box would be flattened; send it to the analyzer instead.
  function interceptOutputPaste(input, before) {
    if (!input || input.dataset.anPaste) return;
    input.dataset.anPaste = '1';
    input.addEventListener('paste', (e) => {
      const text = e.clipboardData ? e.clipboardData.getData('text') : '';
      if (!text || !/\n/.test(text.trim()) || !detectOutput(text)) return;
      e.preventDefault();
      if (before) before();
      openAnalyzer(text);
    });
  }

  // -------------------------------------------------------------
  // KEYBOARD MODE
  // Command boxes and variant rows were plain divs: no tab stop, no role, no
  // name. Tab skipped every command on a sheet, so copying (the core action)
  // was mouse-only, and invisible to screen readers. Each command is now a
  // labelled button that Enter/Space copies, with vim-style movement for the
  // people this is built for: j/k, J/K, g/G, c/y, b, v, and ? for the map.
  // -------------------------------------------------------------
  const KB_BOXES = '.cmd-code-box:not(.is-reference), .subcmd-row:not(.is-reference)';
  const kbTyping = el => !!el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  function kbOverlayOpen() {
    return document.body.style.overflow === 'hidden' || !!document.querySelector('#global-search-modal:not(.hidden), .triage-modal-backdrop:not(.hidden), .an-backdrop.show, .trail-drawer.open, .tour.show, .fd-sheet.show, .slot-pop.show, .node-pop.show, .kb-help.show, .hdr-more.open');
  }

  function kbEnhance() {
    document.querySelectorAll(`${KB_BOXES}`).forEach(box => {
      if (box.dataset.kb) return;
      box.dataset.kb = '1';
      const text = (box.dataset.cmd ?? box.dataset.copy ?? box.dataset.subcmd ?? box.textContent).trim();
      box.tabIndex = 0;
      box.setAttribute('role', 'button');
      box.setAttribute('aria-label', `Copy command: ${firstCommand(text).slice(0, 140)}${box.classList.contains('anat-danger') || DANGER_RE.test(text) ? '. Changes state; drain and get approval first' : ''}`);
    });
  }

  function kbList() {
    return Array.from(document.querySelectorAll(KB_BOXES)).filter(el => el.offsetParent !== null);
  }

  let kbHintEl = null;
  function kbHint(box) {
    if (!kbHintEl) {
      kbHintEl = document.createElement('div');
      kbHintEl.className = 'kb-hint';
      kbHintEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(kbHintEl);
    }
    if (!box) { kbHintEl.classList.remove('show'); return; }
    const hasSlot = !!box.querySelector('.slot');
    kbHintEl.innerHTML = `<kbd>↵</kbd> copy <kbd>b</kbd> save${hasSlot ? ' <kbd>v</kbd> value' : ''} <kbd>j</kbd><kbd>k</kbd> move <kbd>?</kbd>`;
    const r = box.getBoundingClientRect();
    kbHintEl.classList.add('show');
    kbHintEl.style.top = `${Math.max(4, r.top - kbHintEl.offsetHeight - 4)}px`;
    kbHintEl.style.left = `${Math.min(window.innerWidth - kbHintEl.offsetWidth - 8, Math.max(8, r.right - kbHintEl.offsetWidth))}px`;
  }

  function kbFocus(el) {
    if (!el) return;
    el.focus({ preventScroll: true });
    const r = el.getBoundingClientRect();
    const top = document.body.classList.contains('cbar-on') ? 70 : 10;
    if (r.top < top || r.bottom > window.innerHeight - 10) el.scrollIntoView({ block: 'center', behavior: 'instant' });
    requestAnimationFrame(() => kbHint(el));
  }

  function kbMove(delta, byCard) {
    const list = kbList();
    if (!list.length) return;
    const active = document.activeElement && document.activeElement.closest ? document.activeElement.closest(KB_BOXES) : null;
    let i = active ? list.indexOf(active) : -1;
    if (i < 0) {
      // Start from the first command on screen rather than the top of the page.
      const top = document.body.classList.contains('cbar-on') ? 70 : 0;
      i = list.findIndex(el => el.getBoundingClientRect().bottom > top);
      if (i < 0) i = 0;
      return kbFocus(list[delta < 0 ? Math.max(0, i - 1) : i]);
    }
    if (byCard) {
      const card = list[i].closest('.section-card, .cmd-item');
      let j = i;
      do { j += delta; } while (j >= 0 && j < list.length && list[j].closest('.section-card, .cmd-item') === card);
      if (delta < 0 && j >= 0) { const c = list[j].closest('.section-card, .cmd-item'); while (j > 0 && list[j - 1].closest('.section-card, .cmd-item') === c) j--; }
      return kbFocus(list[Math.min(list.length - 1, Math.max(0, j))]);
    }
    kbFocus(list[Math.min(list.length - 1, Math.max(0, i + delta))]);
  }

  let kbHelpEl = null;
  function toggleKbHelp(force) {
    if (!kbHelpEl) {
      kbHelpEl = document.createElement('div');
      kbHelpEl.className = 'an-backdrop kb-help';
      const row = (keys, what) => `<li><span>${keys.map(k => `<kbd>${escapeHtml(k)}</kbd>`).join('')}</span>${escapeHtml(what)}</li>`;
      kbHelpEl.innerHTML = `
        <div class="an-dialog kb-dialog" role="dialog" aria-modal="true" aria-labelledby="kb-title">
          <header class="an-head"><div><h2 id="kb-title">Keyboard shortcuts</h2><p>Single keys work whenever you are not typing in a box.</p></div><button type="button" class="trail-close" data-kb-close aria-label="Close">✕</button></header>
          <div class="an-body kb-cols">
            <section><h3>Move between commands</h3><ul>
              ${row(['j'], 'Next command')}${row(['k'], 'Previous command')}${row(['J'], 'Next card')}${row(['K'], 'Previous card')}${row(['g'], 'First command')}${row(['G'], 'Last command')}${row(['Tab'], 'Every command is a tab stop too')}
            </ul></section>
            <section><h3>On the focused command</h3><ul>
              ${row(['↵'], 'Copy (targets and values filled in)')}${row(['c'], 'Copy')}${row(['y'], 'Copy (yank)')}${row(['b'], 'Bookmark to My kit')}${row(['v'], 'Set its first value chip')}
            </ul></section>
            <section><h3>Anywhere</h3><ul>
              ${row(['Ctrl', 'K'], 'Command Center: search, sheets, runbooks, actions, quick-set')}${row(['/'], 'Filter this sheet')}${row(['Esc'], 'Clear / close')}${row(['t'], 'Case trail')}${row(['s'], 'My kit')}${row(['n'], 'Node workspaces')}${row(['m'], 'Manuals')}${row(['?'], 'This sheet')}${row(['Ctrl', 'P'], 'Print')}
            </ul></section>
            <section><h3>In Ctrl+K</h3><ul>
              ${row(['↑', '↓'], 'Move')}${row(['↵'], 'Copy, open or run')}${row(['>'], 'List actions')}${row(['gpu 3'], 'Quick-set a target')}${row(['node …'], 'Switch node')}
            </ul></section>
          </div>
        </div>`;
      document.body.appendChild(kbHelpEl);
      kbHelpEl.addEventListener('click', (e) => { if (e.target === kbHelpEl || (e.target instanceof Element && e.target.closest('[data-kb-close]'))) toggleKbHelp(false); });
    }
    const show = force ?? !kbHelpEl.classList.contains('show');
    kbHelpEl.classList.toggle('show', show);
    if (show) setTimeout(() => kbHelpEl.querySelector('.trail-close').focus(), 30);
  }

  function initKeyboardMode() {
    if (IN_WIDGET_FRAME) return;
    kbEnhance();
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; kbEnhance(); });
    }).observe(document.body, { childList: true, subtree: true });

    document.addEventListener('focusin', (e) => {
      const box = e.target instanceof Element ? e.target.closest(KB_BOXES) : null;
      if (box && box.matches(':focus-visible')) kbHint(box); else kbHint(null);
    });
    window.addEventListener('scroll', () => { const a = document.activeElement; if (kbHintEl && kbHintEl.classList.contains('show') && a && a.closest && a.closest(KB_BOXES)) kbHint(a.closest(KB_BOXES)); }, { passive: true });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && kbHelpEl && kbHelpEl.classList.contains('show')) { e.preventDefault(); e.stopImmediatePropagation(); return toggleKbHelp(false); }
      if (e.ctrlKey || e.metaKey || e.altKey || kbTyping(e.target)) return;
      const box = e.target instanceof Element ? e.target.closest(KB_BOXES) : null;
      // Activation on a focused command.
      if (box && (e.key === 'Enter' || e.key === ' ' || e.key === 'c' || e.key === 'y')) {
        e.preventDefault();
        box.click();
        box.classList.add('kb-copied');
        setTimeout(() => box.classList.remove('kb-copied'), 600);
        return;
      }
      if (e.key === '?' ) { if (!kbOverlayOpen() || (kbHelpEl && kbHelpEl.classList.contains('show'))) { e.preventDefault(); toggleKbHelp(); } return; }
      if (kbOverlayOpen()) return;
      const k = e.key;
      if (k === 'j' || k === 'k') { e.preventDefault(); return kbMove(k === 'j' ? 1 : -1, false); }
      if (k === 'J' || k === 'K') { e.preventDefault(); return kbMove(k === 'J' ? 1 : -1, true); }
      if (k === 'g' || k === 'G') { const l = kbList(); if (l.length) { e.preventDefault(); kbFocus(k === 'g' ? l[0] : l[l.length - 1]); } return; }
      if (k === 'b' && box) {
        // Clean Cards moves a single-command card's bookmark into the card header, so look there too.
        const item = box.closest('.cmd-item');
        const btn = (item && item.querySelector('.bookmark-btn')) || (box.closest('.section-card') || document).querySelector('.bookmark-btn');
        if (btn) { e.preventDefault(); btn.click(); showGlobalToast(btn.classList.contains('bookmarked') || btn.classList.contains('active') ? 'Saved to My kit.' : 'Bookmark toggled (My kit).'); box.focus({ preventScroll: true }); }
        return;
      }
      if (k === 'v' && box) { const chip = box.querySelector('.slot[data-slot]'); if (chip) { e.preventDefault(); openSlotEditor(chip); } return; }
      if (k === 't') { e.preventDefault(); return openTrail(); }
      if (k === 's') { e.preventDefault(); return openKit(); }
      if (k === 'n') { const chip = document.querySelector('.node-chip'); if (chip && chip.offsetParent) { e.preventDefault(); openNodePicker(chip); } }
    });

    // Say it where people look for it.
    // The page's own footer, not a <footer> inside a node card, dialog or drawer.
    const footer = document.querySelector('body > footer') || Array.from(document.querySelectorAll('footer')).find(f => !f.closest('.board-card, .an-dialog, .trail-drawer, .launchpad, .hx-card, .rb-step'));
    if (footer && !footer.querySelector('.kb-footer')) {
      const hint = document.createElement('button');
      hint.type = 'button';
      hint.className = 'kb-footer';
      hint.innerHTML = '<kbd>j</kbd><kbd>k</kbd> move · <kbd>↵</kbd> copy · <kbd>?</kbd> all shortcuts';
      hint.addEventListener('click', () => toggleKbHelp(true));
      (footer.querySelector('.container') || footer).appendChild(hint);
    }
  }

  // -------------------------------------------------------------
  // SUITE NAVIGATOR
  // Sheets were connected only through the dropdown nav: the NVIDIA hub's
  // content linked to none of its 9 sub-sheets, InfiniBand's to none of 17,
  // and a sub-sheet ended with nowhere to go. Built from the nav itself, every
  // hub now opens with a directory of its sheets (commands, visited ticks,
  // matching runbooks) and every sub-sheet ends with a suite rail: previous /
  // next, all siblings, back to the hub.
  // -------------------------------------------------------------
  const VISITED_KEY = 'dc_visited_sheets';
  const SUITE_RUNBOOKS = { 'NVIDIA DC': ['gpu-missing', 'gpu-hbm'], InfiniBand: ['ib-link'], Fiber: ['ib-link'], Ethernet: [], Linux: ['dimm', 'nvme'], ipmitool: ['dimm', 'gpu-missing'], Redfish: ['dimm'], Motherboards: ['dimm'] };

  function readVisited() { try { const v = JSON.parse(localStorage.getItem(VISITED_KEY) || '[]'); return new Set(Array.isArray(v) ? v : []); } catch (e) { return new Set(); } }
  function markVisited(file) {
    if (!file || !/\.html$/.test(file) || /portable/.test(file)) return;
    const v = readVisited();
    if (v.has(file)) return;
    v.add(file);
    try { localStorage.setItem(VISITED_KEY, JSON.stringify([...v])); } catch (e) {}
  }

  function navItemFile(a) {
    const key = a.dataset.sheet;
    if (key) {
      const cfg = Array.isArray(window.PORTABLE_SHEETS) ? window.PORTABLE_SHEETS.find(c => c.key === key) : null;
      return cfg ? cfg.file : `${key}.html`;
    }
    return (a.getAttribute('href') || '').split('#')[0];
  }

  function suiteFor(file) {
    const nav = document.querySelector('.top-bar .sheet-switcher');
    if (!nav) return null;
    for (const dd of nav.querySelectorAll(':scope > .nav-dropdown')) {
      const toggle = dd.querySelector('.dropdown-toggle');
      if (!toggle) continue;
      const hub = navItemFile(toggle);
      const items = Array.from(dd.querySelectorAll('.dropdown-item')).map(a => {
        const code = a.querySelector('code');
        const desc = a.querySelector('.cmd-desc');
        return { file: navItemFile(a), code: code ? code.textContent.trim() : '', desc: (desc ? desc.textContent : a.textContent).replace(/📑/g, '').trim() };
      }).filter(it => it.file && it.file !== hub);
      if (hub === file || items.some(it => it.file === file)) {
        return { name: toggle.textContent.replace(/[▾•]/g, '').trim(), icon: toggle.querySelector('svg, img') ? toggle.querySelector('svg, img').outerHTML : '', hub, sheets: items, isHub: hub === file };
      }
    }
    return null;
  }

  function sheetCmdCounts() {
    if (sheetCmdCounts.map) return sheetCmdCounts.map;
    const m = {};
    (window.GLOBAL_SEARCH_INDEX || []).forEach(i => { m[i.file] = (m[i.file] || 0) + 1; });
    sheetCmdCounts.map = m;
    return m;
  }

  function renderSuiteNav() {
    if (IN_WIDGET_FRAME) return;
    const file = anatSheetFile || window.location.pathname.split('/').pop() || 'index.html';
    const main = document.querySelector('main');
    document.querySelectorAll('.suite-dir, .suite-rail').forEach(el => el.remove());
    if (!main) return;
    const suite = suiteFor(file);
    if (!suite || !suite.sheets.length) return;
    const counts = sheetCmdCounts();
    const visited = readVisited();

    if (suite.isHub) {
      const done = suite.sheets.filter(s => visited.has(s.file)).length;
      const rbs = (SUITE_RUNBOOKS[suite.name] || []).map(id => RUNBOOKS.find(r => r.id === id)).filter(Boolean);
      const dir = document.createElement('section');
      dir.className = 'container suite-dir';
      dir.setAttribute('aria-label', `${suite.name} sheets`);
      dir.innerHTML = `
        <div class="suite-dir-head">
          <span class="suite-dir-icon" aria-hidden="true">${suite.icon}</span>
          <h2>In this suite</h2>
          <span class="suite-dir-meta">${suite.sheets.length} sheets · ${suite.sheets.reduce((n, s) => n + (counts[s.file] || 0), 0).toLocaleString('en-US')} commands · ${done}/${suite.sheets.length} visited</span>
          <span class="rb-meter suite-dir-meter"><span style="width:${Math.round(done / suite.sheets.length * 100)}%"></span></span>
        </div>
        <div class="suite-dir-grid">
          ${suite.sheets.map(s => `
            <button type="button" class="suite-tile ${visited.has(s.file) ? 'is-visited' : ''}" data-suite-go="${escapeHtml(s.file)}">
              ${s.code ? `<span class="suite-tile-code">${escapeHtml(s.code)}</span>` : ''}
              <span class="suite-tile-text"><b>${escapeHtml(s.desc)}</b><small>${counts[s.file] ? `${counts[s.file]} commands` : 'reference'}${visited.has(s.file) ? ' · ✓ visited' : ''}</small></span>
            </button>`).join('')}
        </div>
        ${rbs.length ? `<div class="suite-dir-rbs"><span>Guided runbooks for this suite</span>${rbs.map(rb => `<button type="button" data-suite-rb="${rb.id}">${rb.icon} ${escapeHtml(rb.title)}</button>`).join('')}</div>` : ''}`;
      const lp = document.getElementById('launchpad');
      (lp && !lp.hidden ? lp : main).insertAdjacentElement(lp && !lp.hidden ? 'afterend' : 'beforebegin', dir);
      return;
    }

    const i = suite.sheets.findIndex(s => s.file === file);
    const prev = i > 0 ? suite.sheets[i - 1] : { file: suite.hub, desc: `${suite.name} hub`, code: '' };
    const next = i < suite.sheets.length - 1 ? suite.sheets[i + 1] : null;
    const rail = document.createElement('nav');
    rail.className = 'container suite-rail';
    rail.setAttribute('aria-label', `${suite.name} suite`);
    rail.innerHTML = `
      <div class="suite-rail-pager">
        <button type="button" class="suite-pg prev" data-suite-go="${escapeHtml(prev.file)}"><small>← ${i > 0 ? 'Previous' : 'Back to hub'}</small><b>${escapeHtml(prev.desc)}</b></button>
        <button type="button" class="suite-pg hub" data-suite-go="${escapeHtml(suite.hub)}"><span aria-hidden="true">${suite.icon}</span><b>${escapeHtml(suite.name)}</b><small>sheet ${i + 1} of ${suite.sheets.length}</small></button>
        ${next ? `<button type="button" class="suite-pg next" data-suite-go="${escapeHtml(next.file)}"><small>Next →</small><b>${escapeHtml(next.desc)}</b></button>` : `<span class="suite-pg next is-end"><small>End of suite</small><b>${suite.sheets.filter(s => visited.has(s.file)).length}/${suite.sheets.length} visited</b></span>`}
      </div>
      <div class="suite-rail-chips">
        ${suite.sheets.map(s => `<button type="button" class="suite-chip ${s.file === file ? 'is-current' : ''} ${visited.has(s.file) ? 'is-visited' : ''}" data-suite-go="${escapeHtml(s.file)}" ${s.file === file ? 'aria-current="page"' : ''}>${s.code ? `<code>${escapeHtml(s.code)}</code>` : ''}${escapeHtml(s.desc.replace(/^[^:]+:\s*/, ''))}</button>`).join('')}
      </div>`;
    main.insertAdjacentElement('afterend', rail);
  }

  function initSuiteNav() {
    if (IN_WIDGET_FRAME) return;
    markVisited(anatSheetFile || window.location.pathname.split('/').pop() || 'index.html');
    renderSuiteNav();
    document.addEventListener('click', (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const go = el.closest('[data-suite-go]');
      if (go) { if (!go.classList.contains('is-current')) goToSheet(go.dataset.suiteGo); return; }
      const rb = el.closest('[data-suite-rb]');
      if (rb) return openRunbook(rb.dataset.suiteRb);
      // Xid tiles in the reference widgets open the decoder for that code.
      const xid = el.closest('.xid-link');
      if (xid) openGlobalSearch(`xid ${xid.dataset.xid}`);
    });
    markXidTiles();
  }

  function markXidTiles() {
    document.querySelectorAll('.quick-widgets code, .quick-widgets .kv-item > :first-child').forEach(c => {
      const m = c.textContent.match(/^\s*Xid\s+(\d{1,3})/i);
      if (!m) return;
      const host = c.closest('.kv-item') || c;
      if (host.classList.contains('xid-link')) return;
      host.classList.add('xid-link');
      host.dataset.xid = m[1];
      host.setAttribute('role', 'button');
      host.setAttribute('tabindex', '0');
      host.title = `Decode Xid ${m[1]}: meaning, severity and next commands`;
    });
  }

  // Bundled outputs so the analyzer can be tried without a node at hand.
  const AN_SAMPLES = {
    mlxlink: [
      'Operational Info', '----------------', 'State                              : Active', 'Physical state                     : LinkUp', 'Speed                              : IB-NDR', 'Width                              : 4x',
      'FEC                                : Interleaved_Standard_RS-FEC - (544,514)', '', 'Module Info', '-----------', 'Identifier                         : OSFP',
      'Vendor Part Number                 : MMA4Z00-NS400', 'Vendor Serial Number               : MT2234FT01234', 'Temperature [C]                    : 71 [-5..75]',
      'Bias Current [mA]                  : 7.5,7.4,7.6,7.5 [3..15]', 'Rx Power Current [dBm]             : 1.2,-3.4,1.1,0.9 [-8.9..4]', 'Tx Power Current [dBm]             : 1.1,1.0,1.0,1.1 [-6.4..4]', '',
      'Physical Counters and BER Info', '------------------------------', 'Effective Physical Errors          : 18', 'Effective Physical BER             : 3E-12',
      'Raw Physical Errors Per Lane       : 102,90554,98,120', 'Raw Physical BER                   : 2E-6', 'Link Down Counter                  : 2'
    ].join('\n'),
    smartlog: [
      'Smart Log for NVME device:nvme3n1 namespace-id:ffffffff', 'critical_warning\t\t\t: 0x4', 'temperature\t\t\t\t: 41 °C (314 K)', 'available_spare\t\t\t\t: 8%',
      'available_spare_threshold\t\t: 10%', 'percentage_used\t\t\t\t: 97%', 'power_on_hours\t\t\t\t: 31002', 'unsafe_shutdowns\t\t\t: 14', 'media_errors\t\t\t\t: 37', 'num_err_log_entries\t\t\t: 512'
    ].join('\n'),
    topo: (() => {
      const g = [...Array(8).keys()], n = [...Array(8).keys()], numa = i => (i < 4 ? 0 : 1);
      const head = '\t' + [...g.map(i => `GPU${i}`), ...n.map(i => `NIC${i}`)].join('\t') + '\tCPU Affinity\tNUMA Affinity\tGPU NUMA ID';
      const gpuRows = g.map(i => `GPU${i}\t` + [...g.map(j => (i === j ? ' X ' : (i === 2 && j === 5) || (i === 5 && j === 2) ? 'NV12' : 'NV18')), ...n.map(k => (k === i && i !== 6 ? 'PIX' : numa(k) === numa(i) ? 'NODE' : 'SYS'))].join('\t') + `\t${numa(i) ? '56-111' : '0-55'}\t${numa(i)}\t\tN/A`);
      const nicRows = n.map(k => `NIC${k}\t` + [...g.map(i => (k === i && i !== 6 ? 'PIX' : numa(k) === numa(i) ? 'NODE' : 'SYS')), ...n.map(k2 => (k === k2 ? ' X ' : numa(k) === numa(k2) ? 'NODE' : 'SYS'))].join('\t'));
      return [head, ...gpuRows, ...nicRows, '', 'Legend:', '', '  X    = Self', '  NV#  = Connection traversing a bonded set of # NVLinks', '', 'NIC Legend:', '', ...n.map(k => `  NIC${k}: mlx5_${k}`)].join('\n');
    })()
  };

  // -------------------------------------------------------------
  // GUIDED TOUR
  // About sixteen capabilities were added to the suite, and most of them can't
  // be seen until someone points at them: chips you click, outputs you paste, a
  // node chip, Ctrl+K quick-sets, runbooks in a modal tab. Of eight checked, the
  // home page mentioned two. The tour spotlights the real controls one at a
  // time, with a "Try it" that performs the action. Steps whose control is not
  // on this page (or not visible on a phone) are skipped.
  // -------------------------------------------------------------
  const TOUR_SEEN_KEY = 'dc_tour_seen';
  const TOUR_STEPS = [
    { title: 'This reference does more than list commands', body: 'A two-minute tour of the parts that save time on the floor: decoding errors, filling in your node, guided runbooks and handing off a shift. Use ← → or the buttons; Esc ends it.' },
    { target: '#lp-omni-input', title: 'Paste an error, get a diagnosis', body: 'Drop a raw dmesg, SEL or EDAC line here. You get what it means, how bad it is, the next read-only commands and a matching runbook. Full mlxlink, smart-log or topo -m outputs open a visual report instead.',
      try: { label: 'Try an Xid 79 line', run: () => { const i = document.getElementById('lp-omni-input'); if (i) { i.value = 'NVRM: Xid (PCI:0000:8a:00): 79, pid=48213, name=python, GPU has fallen off the bus.'; i.dispatchEvent(new Event('input')); } } } },
    { target: '#global-search-btn, [data-fd="search"]', title: 'Ctrl+K does almost everything', body: 'Search 2,300 commands, open any sheet or runbook, run actions (> lists them), switch themes, or quick-set values: "gpu 3", "hca mlx5_4", "pid 48213", "node gpu-node-08".',
      try: { label: 'Open Ctrl+K with "gpu 3"', run: () => { endTour(); openGlobalSearch('gpu 3'); } } },
    { target: '.node-chip, [data-fd="targets"]', title: 'One workspace per machine', body: 'Name the node you are on. Its targets, Case Trail, runbook progress and placeholder values stay with it, so switching to the next node is one click and nothing leaks between tickets.' },
    { target: '.target-summary, .target-inputs-row, [data-fd="targets"]', title: 'Your targets go into every copy', body: 'BMC, interface, HCA, disk and GPU are filled into commands when you copy them. Click any chip to change it; the password is never stored.' },
    { target: '.cmd-code-box .slot, .cmd-code-box .anat-known', title: 'Commands show what you will paste', body: 'Dashed chips are values that come from your targets or placeholders; click one to set it. Dotted flags explain themselves on hover. Red-tagged commands change state and need a drained node and approval.' },
    { target: '#triage-modal-btn, [data-fd="triage"]', title: 'Guided runbooks and the RMA ticket', body: 'Step-by-step runs of the team playbooks: safety, evidence, decisions, physical isolation. Intrusive steps stay locked until you confirm the drain. The verdict and findings fill the RMA ticket.',
      try: { label: 'Open the runbooks', run: () => { endTour(); openRunbook(); } } },
    { target: '#trail-btn, [data-fd="more"]', title: 'Everything you copy is on the record', body: 'The Case Trail logs each copied command with time, sheet and your targets, ready to paste into the ticket as notes.' },
    { target: '#kit-btn, [data-fd="more"]', title: 'Build your own cheat sheet', body: 'Bookmark commands on any sheet and My kit collects them in one place, ready to print as a two-column pocket card for the crash cart.' },
    { target: '.lp-board, .lp-runbooks', title: 'Your nodes, worst first', body: 'The home page shows every node workspace with its verdict and next steps. The Shift board turns them into one handoff for the next shift.',
      try: { label: 'Open the Shift board', run: () => { endTour(); openBoard(); } } },
    { title: 'Read outputs, not just commands', body: 'Paste a full mlxlink, nvme smart-log or nvidia-smi topo -m output and get lane charts, decoded warning bits and a GPU/NIC topology map, each finding tied to the playbook rule.',
      try: { label: 'Open the analyzer with a sample', run: () => { endTour(); openAnalyzer(AN_SAMPLES.mlxlink); } } },
    { target: '.hdr-more-btn, [data-fd="more"]', title: 'Replay this anytime', body: 'Saved, Compact, themes, Manuals and the offline file live under More. Prefer the keyboard? j/k move between commands, Enter copies, and ? lists every shortcut. Ctrl+K → "tour" brings this walkthrough back.' }
  ];

  let tourEl = null;
  let tourSteps = [];
  let tourIdx = 0;
  let tourPrev = null;

  function tourTarget(step) {
    if (!step.target) return null;
    // Comma-separated selectors are a priority list, not "first in the document".
    for (const sel of step.target.split(',').map(x => x.trim())) {
      for (const el of document.querySelectorAll(sel)) {
        const r = el.getBoundingClientRect();
        if (el.offsetParent === null || !r.width || !r.height) continue;
        // On phones the toolbar lives in a closed Field Mode panel: present, sized, but not on screen.
        if (el.closest('.fd-sheet:not(.show), .hdr-more:not(.open) .hdr-more-menu')) continue;
        if (el.checkVisibility && !el.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue;
        return el;
      }
    }
    return null;
  }

  function startTour() {
    closeGlobalSearch();
    // Steps without a visible control on this page are skipped, except the centred ones.
    tourSteps = TOUR_STEPS.filter(s => !s.target || tourTarget(s));
    tourIdx = 0;
    tourPrev = document.activeElement;
    if (!tourEl) {
      tourEl = document.createElement('div');
      tourEl.className = 'tour';
      tourEl.innerHTML = `
        <div class="tour-hole" aria-hidden="true"></div>
        <div class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-body">
          <div class="tour-progress"><span></span></div>
          <div class="tour-step"></div>
          <h3 id="tour-title"></h3>
          <p id="tour-body"></p>
          <div class="tour-actions">
            <button type="button" class="tour-try" data-tour="try" hidden></button>
            <span class="tour-spacer"></span>
            <button type="button" data-tour="back">Back</button>
            <button type="button" class="tour-next" data-tour="next">Next</button>
          </div>
          <button type="button" class="tour-skip" data-tour="end">End tour</button>
        </div>`;
      document.body.appendChild(tourEl);
      tourEl.addEventListener('click', (e) => {
        const b = e.target instanceof Element ? e.target.closest('[data-tour]') : null;
        if (!b) return;
        const act = b.dataset.tour;
        if (act === 'next') return tourIdx >= tourSteps.length - 1 ? endTour() : showTourStep(tourIdx + 1);
        if (act === 'back') return showTourStep(Math.max(0, tourIdx - 1));
        if (act === 'end') return endTour();
        if (act === 'try') { const s = tourSteps[tourIdx]; if (s.try) s.try.run(); }
      });
      document.addEventListener('keydown', (e) => {
        if (!tourEl.classList.contains('show')) return;
        if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); endTour(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); tourIdx >= tourSteps.length - 1 ? endTour() : showTourStep(tourIdx + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); showTourStep(Math.max(0, tourIdx - 1)); }
      }, true);
      window.addEventListener('resize', () => { if (tourEl.classList.contains('show')) placeTour(); });
      window.addEventListener('scroll', () => { if (tourEl.classList.contains('show')) placeTour(); }, { passive: true });
    }
    try { localStorage.setItem(TOUR_SEEN_KEY, '1'); } catch (e) {}
    const invite = document.querySelector('.tour-invite');
    if (invite) invite.remove();
    tourEl.classList.add('show');
    showTourStep(0);
  }

  function showTourStep(i) {
    tourIdx = i;
    const s = tourSteps[i];
    const card = tourEl.querySelector('.tour-card');
    tourEl.querySelector('.tour-step').textContent = `${i + 1} of ${tourSteps.length}`;
    tourEl.querySelector('.tour-progress span').style.width = `${((i + 1) / tourSteps.length) * 100}%`;
    tourEl.querySelector('#tour-title').textContent = s.title;
    tourEl.querySelector('#tour-body').textContent = s.body;
    const tryBtn = tourEl.querySelector('[data-tour="try"]');
    tryBtn.hidden = !s.try;
    if (s.try) tryBtn.textContent = s.try.label;
    tourEl.querySelector('[data-tour="back"]').disabled = i === 0;
    tourEl.querySelector('[data-tour="next"]').textContent = i === tourSteps.length - 1 ? 'Finish' : 'Next';
    const target = tourTarget(s);
    // "instant": the site sets smooth scrolling, which would leave the spotlight measuring mid-scroll.
    if (target) target.scrollIntoView({ block: 'center', behavior: 'instant' });
    requestAnimationFrame(() => { placeTour(); card.focus({ preventScroll: true }); tourEl.querySelector('[data-tour="next"]').focus({ preventScroll: true }); });
  }

  function placeTour() {
    const s = tourSteps[tourIdx];
    const hole = tourEl.querySelector('.tour-hole');
    const card = tourEl.querySelector('.tour-card');
    const target = s && tourTarget(s);
    tourEl.classList.toggle('centered', !target);
    if (!target) {
      hole.style.cssText = 'left:50%;top:50%;width:0;height:0';
      card.style.left = `${Math.max(8, (window.innerWidth - card.offsetWidth) / 2)}px`;
      card.style.top = `${Math.max(8, (window.innerHeight - card.offsetHeight) / 2)}px`;
      return;
    }
    const pad = 8;
    const r = target.getBoundingClientRect();
    hole.style.cssText = `left:${r.left - pad}px;top:${r.top - pad}px;width:${r.width + pad * 2}px;height:${r.height + pad * 2}px`;
    const cw = card.offsetWidth, ch = card.offsetHeight;
    let top = r.bottom + pad + 12;
    if (top + ch > window.innerHeight - 8) top = r.top - pad - 12 - ch;
    if (top < 8) top = Math.min(window.innerHeight - ch - 8, Math.max(8, r.bottom + pad + 12));
    const left = Math.min(Math.max(8, r.left + r.width / 2 - cw / 2), window.innerWidth - cw - 8);
    card.style.left = `${left}px`;
    card.style.top = `${top}px`;
  }

  function endTour() {
    if (!tourEl || !tourEl.classList.contains('show')) return;
    tourEl.classList.remove('show');
    if (tourPrev && tourPrev.focus) tourPrev.focus({ preventScroll: true });
  }

  function initTourInvite() {
    let seen = null;
    try { seen = localStorage.getItem(TOUR_SEEN_KEY); } catch (e) {}
    if (seen || document.querySelector('.tour-invite')) return;
    const inv = document.createElement('div');
    inv.className = 'tour-invite';
    inv.setAttribute('role', 'status');
    inv.innerHTML = `<span class="tour-invite-dot" aria-hidden="true"></span><div><b>New here?</b><span>Two-minute tour of what this reference can do.</span></div>
      <button type="button" class="tour-invite-go">Take the tour</button><button type="button" class="tour-invite-x" aria-label="Dismiss">✕</button>`;
    document.body.appendChild(inv);
    inv.querySelector('.tour-invite-go').addEventListener('click', startTour);
    inv.querySelector('.tour-invite-x').addEventListener('click', () => { try { localStorage.setItem(TOUR_SEEN_KEY, '1'); } catch (e) {} inv.remove(); });
    setTimeout(() => inv.classList.add('show'), 900);
  }

  // -------------------------------------------------------------
  // COMMAND CENTER
  // Ctrl+K only searched commands: "mlxlink" did not offer the mlxlink sheet,
  // "runbook" returned Markdown examples, and "my kit", "dark theme" or
  // "hca mlx5_4" found nothing, while the toolbar grew to ten buttons.
  // Above the commands the palette now lists sheets, runbooks, actions and a
  // quick-set for targets and placeholders. Enter keeps copying the top command
  // unless the query is a quick-set or a ">" action, so muscle memory still works.
  // -------------------------------------------------------------
  const PE_KIND_LABEL = { set: 'Quick set & nodes', sheet: 'Sheets', runbook: 'Runbooks', action: 'Actions' };

  function paletteSheets() {
    const nav = document.querySelector('.top-bar .sheet-switcher');
    if (!nav) return [];
    const out = [];
    Array.from(nav.children).forEach(child => {
      const toggle = child.querySelector('.dropdown-toggle');
      const group = (toggle || child).textContent.replace(/[▾•]/g, '').trim();
      const icon = toggle && toggle.querySelector('svg, img') ? toggle.querySelector('svg, img').outerHTML : '';
      const items = child.querySelectorAll('.dropdown-item');
      if (!items.length && child.matches('a')) out.push({ name: group, desc: '', group, el: child, icon, hub: true });
      items.forEach((a, i) => {
        const code = a.querySelector('code');
        const desc = a.querySelector('.cmd-desc');
        const name = code ? code.textContent.trim() : a.textContent.replace(/[📑]/g, '').trim();
        out.push({ name, desc: desc ? desc.textContent.trim() : '', group, el: a, icon, hub: i === 0 && !code, file: (a.dataset.sheet || a.getAttribute('href') || '').replace(/^#sheet-/, '').replace(/\.html.*$/, '') });
      });
    });
    return out;
  }

  let knownPlaceholders = null;
  function placeholderNames() {
    if (knownPlaceholders) return knownPlaceholders;
    knownPlaceholders = new Set();
    (window.GLOBAL_SEARCH_INDEX || []).forEach(i => {
      String(i.cmd).replace(/<([A-Za-z][\w.-]{0,24})>/g, (m, n) => { if (!SLOT_SKIP.test(n)) knownPlaceholders.add(n.toLowerCase()); return m; });
    });
    return knownPlaceholders;
  }

  const QUICK_TARGET = [
    { re: /^(hca|rdma|mlx)$/, key: 'hca', ok: v => /^mlx5_\d+$/.test(v) },
    { re: /^(iface|nic|interface|netdev)$/, key: 'iface', ok: v => /^(eth|en|ib|bond|vlan|br|wl)[\w.-]*$/.test(v) },
    { re: /^(disk|drive|dev|device)$/, key: 'disk', ok: v => /^(\/dev\/)?(nvme\d+n\d+|sd[a-z]+|md\d+|vd[a-z]+)$/.test(v), fix: v => v.startsWith('/dev/') ? v : `/dev/${v}` },
    { re: /^gpu$/, key: 'gpu', ok: v => /^\d{1,2}$|^(0000:)?[0-9a-f]{2}:[0-9a-f]{2}\.[0-7]$/i.test(v) },
    { re: /^(bmc|bmc_ip|bmcip|host)$/, key: 'bmc', ok: v => /[.:]/.test(v) },
    { re: /^(bmc_user|bmcuser|user)$/, key: 'user', ok: v => /^[\w.@-]+$/.test(v), needsEq: true }
  ];

  function quickSetEntity(q) {
    const m = q.match(/^(?:set\s+)?([a-z_]+)\s*(=|:|\s)\s*(\S+)$/i);
    if (!m) return null;
    const name = m[1].toLowerCase();
    const raw = m[3];
    for (const t of QUICK_TARGET) {
      if (!t.re.test(name) || (t.needsEq && m[2].trim() === '') || !t.ok(raw)) continue;
      const value = t.fix ? t.fix(raw) : raw;
      const meta = SLOT_TARGETS[t.key];
      return { kind: 'set', strong: true, icon: '🎯', label: `Set ${meta.label} → ${value}`, sub: `Rack target: filled into every command you copy${targetState.vars[t.key] ? ` (now ${targetState.vars[t.key]})` : ''}`,
        run: () => {
          targetState.vars[t.key] = value;
          saveTargetState();
          const real = document.getElementById(`var-${t.key}`);
          if (real) real.value = value;
          refreshSlots();
          showGlobalToast(`${meta.label} set to ${value}: copied commands now use it.`);
        } };
    }
    if (placeholderNames().has(name) && !(name === 'pid' && !/^\d+$/.test(raw))) {
      return { kind: 'set', strong: true, icon: '🎯', label: `Fill <${name.toUpperCase()}> → ${raw}`, sub: `Used in every command with <${name.toUpperCase()}>; shown in the command chips`,
        run: () => { setSlotStore(name, raw); refreshSlots(); showGlobalToast(`<${name.toUpperCase()}> set to ${raw}.`); } };
    }
    return null;
  }

  function paletteActions() {
    const list = [
      { icon: '★', label: 'Open My kit', sub: `${readKit().length} bookmarked commands from every sheet`, kw: 'kit bookmarks saved favorites starred mine', run: openKit },
      { icon: '🖨', label: 'Print pocket card', sub: 'Your kit as a two-column printable card', kw: 'print kit pocket card laminate crash cart', run: () => kitPrint(readKit()) },
      { icon: '⟲', label: 'Open Case trail', sub: `${readTrail().length} commands copied, ready for ticket notes`, kw: 'trail history copied log ticket notes timeline', run: openTrail },
      { icon: '🩺', label: 'Triage & RMA', sub: 'Runbooks, crash-cart script, RMA ticket formatter', kw: 'triage rma ticket crash cart script vendor escalation', run: openTriageModal },
      { icon: '▶', label: 'Guided runbooks', sub: `${RUNBOOKS.length} step-by-step playbooks`, kw: 'runbooks runbook playbooks playbook guided steps', run: () => openRunbook() },
      { icon: '🩻', label: 'Health atlas: what healthy looks like', sub: 'Optics power, temps, row remap, PCIe, NVMe and ECC ranges with examples', kw: 'healthy health atlas thresholds ranges normal good bad unhealthy limits dbm rx tx temperature remap pcie nvme spare wear ecc', run: () => openHealthAtlas() },
      { icon: '📶', label: 'BER: healthy vs unhealthy', sub: 'What raw and effective BER look like on a clean, degraded and failing link', kw: 'ber bit error rate fec raw effective mlxlink healthy unhealthy reference thresholds', run: () => openBerReference() },
      { icon: '⌨', label: 'Keyboard shortcuts', sub: 'j/k move between commands, ↵ copy, b save, ? for the full map', kw: 'keyboard shortcuts keys hotkeys vim navigation help accessibility', run: () => toggleKbHelp(true) },
      { icon: '🧭', label: 'Take the tour', sub: 'Two-minute walkthrough of what this reference can do', kw: 'tour help guide getting started onboarding whats new features walkthrough', run: () => startTour() },
      { icon: '📋', label: 'Shift board & handoff', sub: 'All node workspaces at a glance; copy or print the handoff', kw: 'board shift handoff handover incidents nodes overview status report', run: () => openBoard() },
      { icon: '📈', label: 'Analyze command output', sub: 'Paste mlxlink, nvme smart-log or nvidia-smi topo -m output for a report', kw: 'analyze analyzer output paste mlxlink smart-log smartlog dom ber optics nvme report topo topology nvlink pix numa affinity', run: () => openAnalyzer() },
      { icon: '☰', label: 'Toggle compact view', sub: 'Hide or show explanations and variants', kw: 'compact density detailed dense view', run: () => { const b = document.getElementById('density-toggle'); if (b) b.click(); } },
      { icon: '📖', label: 'Open manuals', sub: 'Offline man pages', kw: 'man manual manuals pages docs offline', run: () => openManuals() },
      { icon: '◆', label: 'Go to Mission Control', sub: 'Home: decode an error, start a runbook', kw: 'home launchpad mission control start index', run: () => goToSheet('index.html') },
      { icon: '🎯', label: `Turn Rack Targets ${targetState.active ? 'off' : 'on'}`, sub: 'Substitution of targets into copied commands', kw: 'targets substitution variables rack toggle on off', run: () => { const t = document.getElementById('target-active-toggle'); if (t) { t.checked = !t.checked; t.dispatchEvent(new Event('change', { bubbles: true })); refreshSlots(); } } }
    ];
    if (!window.PORTABLE_SHEETS) list.push({ icon: '⬇', label: 'Open the 1-file offline suite', sub: 'Everything in one HTML file', kw: 'offline portable download single file', run: () => { window.location.href = 'datacenter-cheatsheet-portable.html'; } });
    return list;
  }

  function paletteEntities(query) {
    let q = query.trim().toLowerCase();
    const actionsOnly = q.startsWith('>');
    if (actionsOnly) q = q.slice(1).trim();
    const tokens = q.split(/\s+/).filter(Boolean);
    // Match at word starts so "tar" does not hit "start", "targets" or "Star Trek".
    const wordRes = tokens.map(t => new RegExp(`(^|[^a-z0-9])${escapeRegex(t)}`, 'i'));
    const hit = hay => wordRes.every(re => re.test(hay));
    // Actions are a small vocabulary: short tokens must be whole words ("kit", "rma"), not prefixes ("tar" → "targets").
    const actRes = tokens.map(t => new RegExp(`(^|[^a-z0-9])${escapeRegex(t)}${t.length < 4 ? '($|[^a-z0-9])' : ''}`, 'i'));
    const actHit = hay => actRes.every(re => re.test(hay));
    const out = [];

    if (!q && !actionsOnly) {
      return paletteActions().filter(a => /My kit|Case trail|Guided runbooks|Triage/.test(a.label)).map(a => ({ kind: 'action', ...a }));
    }
    if (!actionsOnly) {
      // Node workspaces: "node gpu-node-08" switches (or starts) a node; "node" lists them.
      const reg = readNodes();
      const nm = q.match(/^(?:node|host)\s+(\S+)$/);
      if (nm) {
        const name = cleanNodeName(nm[1]);
        const exists = !!reg.nodes[name] || reg.active === name;
        out.push({ kind: 'set', strong: true, icon: '🖥', label: `${exists ? 'Switch to' : 'Start'} node ${name}`, sub: exists ? 'Bring back its targets, Case Trail and runbook progress' : 'Fresh targets and an empty trail; the current node is saved', run: () => switchNode(name) });
      }
      const listAll = /^(node|nodes|host|hosts|workspace|workspaces)$/.test(q);
      Object.keys(reg.nodes).filter(n => n !== reg.active && (listAll || n.toLowerCase() === q || (q.length >= 3 && n.toLowerCase().includes(q)))).slice(0, 5).forEach(n => {
        const sm = nodeSummary(n, reg);
        out.push({ kind: 'set', strong: listAll, icon: '🖥', label: `Switch to node ${n}`, sub: [sm.bmc && `BMC ${sm.bmc}`, `${sm.trail} copied`, ...sm.runbooks].filter(Boolean).join(' · '), run: () => switchNode(n) });
      });
      const set = quickSetEntity(q);
      if (set) out.push(set);
      const sheets = paletteSheets()
        .map(sh => {
          const name = sh.name.toLowerCase();
          const hay = `${name} ${sh.desc} ${sh.group} ${sh.file || ''}`.toLowerCase();
          if (!tokens.length || !hit(hay)) return null;
          let score = 1;
          if (name === q || sh.file === q) score = 100;
          else if (name.startsWith(q) || (sh.file || '').startsWith(q)) score = 50;
          if (sh.group.toLowerCase() === q && sh.hub) score = 90;
          return { sh, score };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score)
        .filter(({ sh }, i, arr) => !sh.file || arr.findIndex(x => x.sh.file === sh.file) === i)
        .slice(0, 4);
      // Nav items are a short code plus a description ("mlx" + "mlxlink: Optical DOM & Eye"); lead with the description.
      sheets.forEach(({ sh }) => out.push({ kind: 'sheet', icon: sh.icon || '📄', label: sh.desc || sh.name, sub: [sh.file ? `${sh.file}.html` : '', sh.group].filter(Boolean).join(' · '), run: () => sh.el.click() }));
      RUNBOOKS.forEach(rb => {
        if (hit(`${rb.title} ${rb.tag} ${rb.id} runbook runbooks playbook guided`.toLowerCase())) {
          const { done, total } = rbProgress(rb, rbRun(rb.id));
          out.push({ kind: 'runbook', icon: rb.icon, label: rb.title, sub: `${rb.tag} · ${done ? `resume ${done}/${total}` : `${total} steps`}`, run: () => openRunbook(rb.id) });
        }
      });
    }
    const actions = paletteActions();
    const themeWanted = tokens.includes('theme') || tokens.includes('themes');
    THEMES.forEach(t => actions.push({ icon: '🎨', label: `Theme: ${t.name}`, sub: t.desc, kw: `theme themes color colour ${t.name} ${t.id} ${t.desc}`.toLowerCase(), theme: true, run: () => applyGlobalTheme(t.id) }));
    actions.forEach(a => {
      const hay = `${a.label} ${a.kw}`.toLowerCase();
      if (a.theme && !themeWanted && !actHit(`${a.label} ${a.kw}`.toLowerCase().replace(/theme|color|colour/g, ''))) return;
      if (tokens.length ? actHit(hay) : actionsOnly) out.push({ kind: 'action', strong: actionsOnly, ...a });
    });
    // A query that names exactly one action by its label ("handoff", "my kit") makes it the Enter default.
    if (tokens.length && q.length >= 4 && !out.some(e => e.strong)) {
      const byLabel = out.filter(e => e.kind === 'action' && actHit(e.label.toLowerCase()));
      if (byLabel.length === 1) byLabel[0].strong = true;
    }
    // Keep the list short: a few of each kind.
    const capped = [];
    const per = { set: 6, sheet: 4, runbook: 3, action: actionsOnly ? 12 : 4 };
    out.forEach(e => { if (capped.filter(x => x.kind === e.kind).length < per[e.kind]) capped.push(e); });
    return capped;
  }

  function renderPaletteEntities(entities) {
    let html = '';
    let kind = '';
    entities.forEach((e, idx) => {
      if (e.kind !== kind) { kind = e.kind; html += `<div class="pe-heading">${PE_KIND_LABEL[kind]}</div>`; }
      html += `
        <div class="palette-item palette-entity pe-${e.kind} ${idx === searchActiveIndex ? 'is-selected' : ''}" data-index="${idx}" role="option">
          <span class="pe-icon" aria-hidden="true">${/^</.test(e.icon) ? e.icon : escapeHtml(e.icon)}</span>
          <span class="pe-text"><b>${escapeHtml(e.label)}</b>${e.sub ? `<small>${escapeHtml(e.sub)}</small>` : ''}</span>
          <span class="pe-go">${e.kind === 'set' ? 'Enter to set' : e.kind === 'sheet' ? 'Open' : e.kind === 'runbook' ? 'Start' : 'Run'}</span>
        </div>`;
    });
    return html;
  }

  function runPaletteEntity(e) {
    closeGlobalSearch();
    setTimeout(() => e.run(), 0);
  }

  function renderGlobalSearchResults(query) {
    if (!window.GLOBAL_SEARCH_INDEX || !searchResults) return;
    const cleanQuery = query.trim().toLowerCase();
    let tokens = cleanQuery.split(/\s+/).filter(Boolean);
    const decoded = decodeSymptom(query);

    let matches = [];
    let totalMatches = 0;
    let sheetsMatched = 0;
    if (!tokens.length) {
      // Show default top picks across sheets
      matches = window.GLOBAL_SEARCH_INDEX.slice(0, 25);
      totalMatches = window.GLOBAL_SEARCH_INDEX.length;
      sheetsMatched = new Set(window.GLOBAL_SEARCH_INDEX.map(item => item.file)).size;
    } else {
      // A pasted log line won't match word-for-word; search what the decoder understood instead.
      let phrase = cleanQuery;
      if (decoded && tokens.length > 3) {
        phrase = decoded.q;
        tokens = phrase.split(/\s+/);
      }
      let ranked = rankIndex(tokens, phrase, decoded && decoded.boost);
      if (!ranked.length && decoded && phrase !== decoded.q) {
        tokens = decoded.q.split(/\s+/);
        ranked = rankIndex(tokens, decoded.q, decoded.boost);
      }
      matches = ranked;
      totalMatches = matches.length;
      sheetsMatched = new Set(matches.map(item => item.file)).size;
      matches = matches.slice(0, 50); // limit to top 50 matches for fast DOM render
    }

    const entities = decoded ? [] : paletteEntities(query);
    if (query.trim().startsWith('>')) { matches = []; totalMatches = 0; sheetsMatched = 0; }
    // Enter copies the top command as before, unless the query is a quick-set or an explicit "> action".
    if (searchActiveIndex === 0 && entities.length && matches.length && !entities.some(e => e.strong)) searchActiveIndex = entities.length;
    currentSearchResults = [...entities, ...matches];
    searchCount.textContent = `${decoded ? 'Decoded · ' : ''}${entities.length ? `${entities.length} shortcut${entities.length === 1 ? '' : 's'} · ` : ''}${totalMatches} command${totalMatches === 1 ? '' : 's'} found across ${sheetsMatched} sheet${sheetsMatched === 1 ? '' : 's'}`;
    const lead = (decoded ? renderDecoderCard(decoded) : (!tokens.length ? renderDecoderSamples() : '')) + renderPaletteEntities(entities)
      + (entities.length && matches.length ? '<div class="pe-heading">Commands</div>' : '');

    if (!matches.length && entities.length) {
      searchResults.innerHTML = lead;
      bindPaletteItems();
      return;
    }
    if (!matches.length) {
      searchResults.innerHTML = lead + (decoded ? '' : `
        <div class="palette-empty">
          <p>No commands matching "<strong>${escapeHtml(cleanQuery)}</strong>"</p>
          <span class="palette-empty-tip">Try searching for generic keywords like <code>dmesg</code>, <code>xid</code>, <code>pcie</code>, <code>ipmi</code>, <code>dom</code>, <code>vlan</code>, or <code>edac</code> — or paste a whole log line.</span>
        </div>
      `);
      return;
    }

    const offset = entities.length;
    searchResults.innerHTML = lead + (decoded ? '<div class="decoder-related">Related commands</div>' : '') + matches.map((item, i) => {
      const idx = i + offset;
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

    bindPaletteItems();
    const active = searchResults.querySelector('.palette-item.is-selected');
    if (active && searchActiveIndex > 0) active.scrollIntoView({ block: 'nearest' });
  }

  function bindPaletteItems() {
    // Attach click listeners to results
    const items = searchResults.querySelectorAll('.palette-item');
    items.forEach((itemEl, idx) => {
      itemEl.addEventListener('mouseenter', () => {
        searchActiveIndex = idx;
        updatePaletteHighlightClasses();
      });

      itemEl.addEventListener('click', (e) => {
        const entity = currentSearchResults[idx];
        if (entity && entity.run) return runPaletteEntity(entity);
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
    if (item.run) return runPaletteEntity(item);

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
      window.location.href = id ? `${file}#${id}` : file;
    } else {
      closeGlobalSearch();
      if (id) scrollToCard(id);
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
          <button type="button" class="triage-tab active" data-tab="runbook">1. Guided Runbooks</button>
          <button type="button" class="triage-tab" data-tab="script">2. Crash-Cart Diagnostic Script</button>
          <button type="button" class="triage-tab" data-tab="ticket">3. RMA Ticket Markdown Formatter</button>
        </div>

        <div class="triage-body">
          <!-- Tab 1: Guided runbooks (rendered by initRunbooks) -->
          <div class="triage-tab-content active" id="tab-runbook"></div>

          <!-- Tab 2: Script -->
          <div class="triage-tab-content" id="tab-script">
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
                <label class="ticket-field full-width rma-trail-toggle">
                  <input type="checkbox" id="rma-include-trail" checked />
                  <span>Attach my Case Trail: the <b id="rma-trail-count">0</b> diagnostic commands I copied, in order</span>
                </label>
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
    const trailToggle = document.getElementById('rma-include-trail');
    if (trailToggle) trailToggle.addEventListener('change', updateRmaPreview);

    document.getElementById('copy-rma-ticket-btn').addEventListener('click', () => {
      const text = document.getElementById('rma-preview-text').textContent;
      copyVerbatim(text);
      showGlobalToast('Copied RMA Ticket Markdown to clipboard!');
    });

    updateRmaPreview();
    initRunbooks();
  }

  function rmaTrailSection() {
    const box = document.getElementById('rma-include-trail');
    const list = readTrail();
    if (!box || !box.checked || !list.length) return '';
    return `${trailMarkdown(list.slice(-25), '####').replace(/^#### Command trail/, '#### Diagnostic Commands Run (Case Trail)')}\n\n`;
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

${rmaTrailSection()}#### Action Requested:
* Please issue Advance Hardware Replacement (RMA) for the faulty ${comp} in physical location \`${slot}\`.
* Return packaging requested for return of defective unit.`;

    const el = document.getElementById('rma-preview-text');
    if (el) el.textContent = md;
  }

  function openTriageModal() {
    initTriageModal();
    refreshTrailUi(false);
    updateRmaPreview();
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
    const changed = anatSheetFile && anatSheetFile !== file;
    anatSheetFile = file;
    // The portable build swaps sheets in place: keep recents and the launchpad in step.
    if (changed && !IN_WIDGET_FRAME) queueVisit(file);
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
    initCleanCards();
    initCommandAnatomy();
    // The portable build runs each sheet's interactive widgets in an about:srcdoc frame
    // with its own copy of this file; page chrome belongs to the outer page only.
    if (!IN_WIDGET_FRAME) {
      initCaseTrail();
      initKit();
      initToolbar();
      initFieldDock();
      initCommandBar();
      initLaunchpad();
      initSuiteNav();
      initKeyboardMode();
      initBer();
      initHealthAtlas();
      initTourInvite();
      recordVisit(anatSheetFile || window.location.pathname.split('/').pop() || 'index.html');
    }
    if (window.location.hash) {
      setTimeout(() => scrollToCard(window.location.hash), 150);
    }
  });

  // -------------------------------------------------------------
  // SLIM HEADER TOOLBAR (desktop)
  // Nine equal-weight buttons wrapped the toolbar onto its own row, so the
  // header grew to 393px at 1440 wide and 490px at 1024. Four primary tools
  // stay visible; Saved, Compact, Theme, Manuals and the offline file move
  // into a More menu. Field Mode (phones) shows them all flat, as before.
  // -------------------------------------------------------------
  const TOOLBAR_PRIMARY = ['global-search-btn', 'triage-modal-btn', 'kit-btn', 'trail-btn'];

  function initToolbar() {
    const actions = document.querySelector('.top-bar .header-actions');
    if (!actions || actions.querySelector('.hdr-more')) return;
    const secondary = Array.from(actions.children).filter(el => !TOOLBAR_PRIMARY.includes(el.id));
    if (secondary.length < 2) return;

    const wrap = document.createElement('div');
    wrap.className = 'hdr-more';
    wrap.innerHTML = `
      <button type="button" class="action-btn hdr-more-btn" aria-haspopup="true" aria-expanded="false" title="Saved, view, theme, manuals, offline">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="19" cy="12" r="1.3" fill="currentColor"/></svg>
        <span>More</span><span class="hdr-more-dot" hidden></span>
      </button>
      <div class="hdr-more-menu" role="menu"></div>`;
    const menu = wrap.querySelector('.hdr-more-menu');
    secondary.forEach(el => menu.appendChild(el));
    const tourBtn = document.createElement('button');
    tourBtn.type = 'button';
    tourBtn.className = 'action-btn tour-menu-btn';
    tourBtn.innerHTML = '<span aria-hidden="true">🧭</span><span>Take the tour</span>';
    tourBtn.addEventListener('click', () => startTour());
    menu.appendChild(tourBtn);
    // Primary order: Search All, Triage, My kit, Trail, More.
    TOOLBAR_PRIMARY.forEach(id => { const el = document.getElementById(id); if (el && el.parentNode === actions) actions.appendChild(el); });
    actions.appendChild(wrap);
    actions.classList.add('has-more');

    const btn = wrap.querySelector('.hdr-more-btn');
    const dot = wrap.querySelector('.hdr-more-dot');
    const setOpen = (open) => {
      wrap.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(!wrap.classList.contains('open')); });
    document.addEventListener('click', (e) => {
      if (!wrap.classList.contains('open') || !(e.target instanceof Element)) return;
      if (!wrap.contains(e.target)) return setOpen(false);
      // A tool inside the menu ran: close, unless it opens its own submenu (theme picker).
      if (e.target.closest('.hdr-more-menu .action-btn, .hdr-more-menu a') && !e.target.closest('.theme-palette-btn')) setTimeout(() => setOpen(false), 0);
    });
    // The theme picker stops its clicks from bubbling, so watch for a pick in the capture phase.
    document.addEventListener('click', (e) => {
      if (wrap.classList.contains('open') && e.target instanceof Element && e.target.closest('.hdr-more-menu .theme-option')) setTimeout(() => setOpen(false), 0);
    }, true);
    wrap.addEventListener('keydown', (e) => { if (e.key === 'Escape' && wrap.classList.contains('open')) { e.stopPropagation(); setOpen(false); btn.focus(); } });

    // Saved lives in the menu now: surface its count and its filter state on More.
    const sync = () => {
      const saved = document.getElementById('saved-count');
      const savedBtn = document.getElementById('saved-filter-btn');
      const n = saved ? parseInt(saved.textContent, 10) || 0 : 0;
      const active = !!(savedBtn && (savedBtn.classList.contains('active') || savedBtn.getAttribute('aria-pressed') === 'true'));
      dot.hidden = !n && !active;
      dot.textContent = active ? '★' : String(n);
      btn.classList.toggle('active', active);
      btn.title = `More: ${n} saved on this sheet${active ? ' (showing saved only)' : ''}, view, theme, manuals, offline`;
    };
    sync();
    const mo = new MutationObserver(sync);
    const saved = document.getElementById('saved-count');
    const savedBtn = document.getElementById('saved-filter-btn');
    if (saved) mo.observe(saved, { childList: true, characterData: true, subtree: true });
    if (savedBtn) mo.observe(savedBtn, { attributes: true, attributeFilter: ['class', 'aria-pressed'] });
  }

  // -------------------------------------------------------------
  // MY KIT
  // Bookmarks were stored in 188 separate silos (<sheet>_bookmarks) and the
  // Saved button only filtered the current sheet, so bookmarking across sheets
  // never added up to anything. My Kit gathers every bookmark from every sheet
  // into one personal cheat sheet: grouped, filtered, shown with targets
  // filled in, exportable as Markdown or a printable pocket card.
  // -------------------------------------------------------------
  const KIT_KEY_RE = /^(.+)_bookmarks$/;

  function kitIndex() {
    // First entry per file#id is the card's main command.
    if (kitIndex.map) return kitIndex.map;
    const byFileId = new Map();
    const byId = new Map();
    (window.GLOBAL_SEARCH_INDEX || []).forEach(item => {
      const k = `${item.file}#${item.id}`;
      if (!byFileId.has(k)) byFileId.set(k, item);
      if (!byId.has(item.id)) byId.set(item.id, item);
    });
    kitIndex.map = { byFileId, byId };
    return kitIndex.map;
  }

  function kitFileForKey(key) {
    const name = key.replace(KIT_KEY_RE, '$1');
    if (name === 'linux_cs') return 'index.html';
    if (name === 'portable') return null;   // ids only; resolved by id
    return `${name}.html`;
  }

  function readKit() {
    const { byFileId, byId } = kitIndex();
    const out = [];
    const seen = new Set();
    let keys = [];
    try { keys = Object.keys(localStorage); } catch (e) { keys = []; }
    keys.filter(k => KIT_KEY_RE.test(k)).forEach(key => {
      let ids = [];
      try { ids = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { ids = []; }
      if (!Array.isArray(ids)) return;
      const file = kitFileForKey(key);
      ids.forEach(id => {
        const item = file ? byFileId.get(`${file}#${id}`) || byId.get(id) : byId.get(id);
        if (!item) return;
        const k = `${item.file}#${item.id}`;
        if (seen.has(k)) return;
        seen.add(k);
        out.push({ key, id, item });
      });
    });
    return out;
  }

  // Remove one bookmark. On its own sheet the sheet's in-memory state owns it,
  // so press the real button; elsewhere edit that sheet's stored list.
  function kitRemove(entry) {
    const btn = document.querySelector(`.bookmark-btn[data-cmd-id="${CSS.escape(entry.id)}"], .bookmark-btn[data-bookmark-id="${CSS.escape(entry.id)}"]`);
    const onThisSheet = btn && (entry.key === 'portable_bookmarks' || kitFileForKey(entry.key) === (anatSheetFile || window.location.pathname.split('/').pop() || 'index.html'));
    if (onThisSheet) { btn.click(); return; }
    try {
      const ids = JSON.parse(localStorage.getItem(entry.key) || '[]').filter(x => x !== entry.id);
      localStorage.setItem(entry.key, JSON.stringify(ids));
    } catch (e) {}
  }

  function kitGroups(list, q) {
    const groups = new Map();
    const tokens = tidyNorm(q).split(' ').filter(Boolean);
    list.forEach(e => {
      const hay = tidyNorm(`${e.item.sName} ${e.item.sec} ${e.item.desc} ${e.item.cmd} ${e.item.tags}`);
      if (tokens.length && !tokens.every(t => hay.includes(t))) return;
      const g = e.item.sName;
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g).push(e);
    });
    return groups;
  }

  function kitMarkdown(list) {
    const lines = ['## My kit', `_${list.length} commands · ${trailDate(Date.now())}${trailTargetsSummary() ? ` · targets: ${trailTargetsSummary()}` : ''}_`, ''];
    kitGroups(list, '').forEach((entries, sheet) => {
      lines.push(`### ${sheet}`);
      entries.forEach(e => {
        lines.push(`- ${DANGER_RE.test(e.item.cmd) ? '⚠ **Changes state: drain + approval first.** ' : ''}${e.item.desc}`, '  ```bash', ...firstCommand(trailSafeText(e.item.cmd)).split('\n').map(l => `  ${l}`), '  ```');
      });
      lines.push('');
    });
    return lines.join('\n').trim();
  }

  function kitPrint(list) {
    const groups = kitGroups(list, '');
    const body = [...groups.entries()].map(([sheet, entries]) => `
      <section><h2>${escapeHtml(sheet)}</h2>${entries.map(e => `
        <div class="c${DANGER_RE.test(e.item.cmd) ? ' d' : ''}"><p>${DANGER_RE.test(e.item.cmd) ? '<b class="w">⚠ CHANGES STATE · DRAIN + APPROVAL</b>' : ''}${escapeHtml(e.item.desc)}</p><code>${escapeHtml(firstCommand(trailSafeText(e.item.cmd)))}</code></div>`).join('')}</section>`).join('');
    const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>My kit</title><style>
      @page { size: letter; margin: 0.45in; }
      * { box-sizing: border-box; }
      body { font: 9pt/1.3 -apple-system, "Segoe UI", Roboto, sans-serif; color: #111; margin: 0; }
      header { display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #111; padding-bottom: 4pt; margin-bottom: 6pt; }
      header h1 { font-size: 13pt; margin: 0; } header span { font-size: 8pt; color: #555; }
      main { columns: 2; column-gap: 14pt; }
      section { break-inside: avoid-column; margin-bottom: 6pt; }
      h2 { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .06em; margin: 0 0 3pt; color: #444; border-bottom: 1px solid #bbb; }
      .c { break-inside: avoid; margin: 0 0 4pt; }
      .c p { margin: 0 0 1pt; font-weight: 600; }
      .w { display: block; font-size: 6.5pt; letter-spacing: .05em; color: #b00020; }
      .d code { border: 1.5px solid #b00020; background: #fff5f6; }
      code { display: block; font: 8pt/1.35 "JetBrains Mono", Menlo, Consolas, monospace; background: #f1f3f5; border: 1px solid #d6dade; border-radius: 3px; padding: 2pt 4pt; white-space: pre-wrap; word-break: break-word; }
    </style></head><body><header><h1>My kit</h1><span>${list.length} commands · ${escapeHtml(trailDate(Date.now()))}${trailTargetsSummary() ? ' · ' + escapeHtml(trailTargetsSummary()) : ''}</span></header><main>${body}</main></body></html>`;
    const frame = document.createElement('iframe');
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
    document.body.appendChild(frame);
    frame.onload = () => {
      try { frame.contentWindow.focus(); frame.contentWindow.print(); } catch (e) { showGlobalToast('Printing was blocked by the browser.'); }
      setTimeout(() => frame.remove(), 60000);
    };
    frame.srcdoc = doc;
  }

  let kitDrawer = null;
  let kitQuery = '';
  function renderKit() {
    if (!kitDrawer) return;
    const list = readKit();
    kitDrawer.querySelector('.kit-count').textContent = list.length;
    kitDrawer.querySelectorAll('.trail-foot button').forEach(b => { b.disabled = !list.length; });
    const box = kitDrawer.querySelector('.trail-list');
    if (!list.length) {
      box.innerHTML = `
        <div class="trail-empty">
          <div class="trail-empty-icon kit-empty-icon" aria-hidden="true">★</div>
          <p><b>Your kit is empty.</b> Bookmark any command on any sheet (the bookmark icon on each card) and it is collected here.</p>
          <p>Build the 20 commands you actually run, then print them as a two-column pocket card for the crash cart.</p>
        </div>`;
      return;
    }
    const groups = kitGroups(list, kitQuery);
    if (!groups.size) { box.innerHTML = `<p class="kit-none">Nothing in your kit matches “${escapeHtml(kitQuery)}”.</p>`; return; }
    box.innerHTML = [...groups.entries()].map(([sheet, entries]) => `
      <section class="kit-group">
        <h3><span>${escapeHtml(sheet)}</span><small>${entries.length}</small></h3>
        ${entries.map(e => `
          <div class="kit-entry" data-kit="${escapeHtml(e.key)}|${escapeHtml(e.id)}">
            ${DANGER_RE.test(e.item.cmd) ? '<span class="danger-tag">⚠ Changes state · drain &amp; get approval first</span>' : ''}
            <div class="kit-desc">${escapeHtml(e.item.desc)}</div>
            <code class="trail-cmd">${escapeHtml(firstCommand(trailSafeText(e.item.cmd)))}</code>
            <div class="kit-actions">
              <button type="button" data-kit-act="copy">Copy</button>
              <button type="button" data-kit-act="open">Open in ${escapeHtml(e.item.file.replace(/\.html$/, ''))} →</button>
              <button type="button" data-kit-act="remove" title="Remove bookmark" aria-label="Remove bookmark">✕</button>
            </div>
          </div>`).join('')}
      </section>`).join('');
  }

  function buildKitDrawer() {
    const scrim = document.createElement('div');
    scrim.className = 'trail-scrim';
    kitDrawer = document.createElement('aside');
    kitDrawer.className = 'trail-drawer kit-drawer';
    kitDrawer.setAttribute('role', 'dialog');
    kitDrawer.setAttribute('aria-modal', 'true');
    kitDrawer.setAttribute('aria-labelledby', 'kit-title');
    kitDrawer.innerHTML = `
      <header class="trail-head kit-head">
        <div>
          <h2 id="kit-title">My kit <span class="trail-count kit-count">0</span></h2>
          <p>Every command you bookmarked, from every sheet, in one place. Shown with your Rack Targets filled in.</p>
        </div>
        <button type="button" class="trail-close" aria-label="Close my kit">✕</button>
      </header>
      <div class="trail-case"><label class="trail-case-id">Filter
        <input type="search" class="kit-filter" placeholder="mlxlink, sel, nvme…" autocomplete="off" spellcheck="false" />
      </label></div>
      <div class="trail-list"></div>
      <footer class="trail-foot">
        <button type="button" class="trail-primary kit-primary" data-kit-act="print">Print pocket card</button>
        <button type="button" data-kit-act="md">Copy as Markdown</button>
      </footer>`;
    document.body.append(scrim, kitDrawer);
    kitDrawer._scrim = scrim;
    scrim.addEventListener('click', closeKit);
    kitDrawer.querySelector('.trail-close').addEventListener('click', closeKit);
    kitDrawer.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closeKit(); } });
    kitDrawer.querySelector('.kit-filter').addEventListener('input', (e) => { kitQuery = e.target.value; renderKit(); });
    kitDrawer.addEventListener('click', (e) => {
      const btn = e.target instanceof Element ? e.target.closest('[data-kit-act]') : null;
      if (!btn) return;
      const act = btn.dataset.kitAct;
      const list = readKit();
      if (act === 'print') return kitPrint(list);
      if (act === 'md') { copyVerbatim(kitMarkdown(list)); return showGlobalToast(`Copied your kit (${list.length} commands) as Markdown.`); }
      const row = btn.closest('[data-kit]');
      if (!row) return;
      const [key, ...idParts] = row.dataset.kit.split('|');
      const entry = list.find(x => x.key === key && x.id === idParts.join('|'));
      if (!entry) return;
      if (act === 'copy') {
        navigator.clipboard.writeText(firstCommand(entry.item.cmd));   // targets, slots and Case Trail apply
        btn.textContent = 'Copied';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1300);
      }
      if (act === 'open') { closeKit(); openSearchResult(entry.item.file, entry.item.id); }
      if (act === 'remove') { kitRemove(entry); setTimeout(() => { renderKit(); refreshKitUi(); }, 30); }
    });
  }

  let kitFocus = null;
  function openKit() {
    if (!kitDrawer) buildKitDrawer();
    kitFocus = document.activeElement;
    renderKit();
    kitDrawer.classList.add('open');
    kitDrawer._scrim.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => kitDrawer.querySelector('.kit-filter').focus(), 60);
  }
  function closeKit() {
    if (!kitDrawer || !kitDrawer.classList.contains('open')) return;
    kitDrawer.classList.remove('open');
    kitDrawer._scrim.classList.remove('show');
    document.body.style.overflow = '';
    if (kitFocus && kitFocus.focus) kitFocus.focus();
  }

  function refreshKitUi() {
    const n = readKit().length;
    document.querySelectorAll('.kit-badge').forEach(b => {
      if (b.textContent !== String(n)) { b.textContent = n; b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
    });
    if (kitDrawer && kitDrawer.classList.contains('open')) renderKit();
  }

  function initKit() {
    const actions = document.querySelector('.header-actions');
    if (actions && !document.getElementById('kit-btn')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'kit-btn';
      btn.className = 'action-btn kit-header-btn';
      btn.title = 'My kit: every bookmarked command from every sheet';
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>
        </svg>
        <span>My kit</span>
        <span class="count-badge kit-badge">0</span>`;
      btn.addEventListener('click', openKit);
      const trailBtn = document.getElementById('trail-btn');
      if (trailBtn && trailBtn.parentNode === actions) trailBtn.after(btn); else actions.appendChild(btn);
    }
    const n = readKit().length;
    document.querySelectorAll('.kit-badge').forEach(b => { b.textContent = n; });
    // Sheets save bookmarks themselves; notice those writes (same tab) and other tabs.
    if (window.Storage && !Storage.prototype.setItem._kit) {
      const set = Storage.prototype.setItem;
      const wrapped = function (key, value) {
        set.call(this, key, value);
        if (KIT_KEY_RE.test(String(key))) setTimeout(refreshKitUi, 0);
      };
      wrapped._kit = true;
      Storage.prototype.setItem = wrapped;
    }
    window.addEventListener('storage', (e) => { if (e.key && KIT_KEY_RE.test(e.key)) refreshKitUi(); });
  }

  // -------------------------------------------------------------
  // CLEAN CARDS
  // Measured across all sheets: 864 cards, 652 holding a single command;
  // 302 repeat the same sentence as subtitle and description, 76 titles are
  // cut off mid-word ("…columns us"), and single-command cards still carry a
  // count badge reading "1". Cards are tidied after each render: truncated
  // titles are rebuilt from the full description (topic prefix becomes an
  // eyebrow), duplicate lines are hidden, and on single-command cards the
  // bookmark takes the place of the "1".
  // -------------------------------------------------------------
  const tidyNorm = s => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();

  function tidyCard(card) {
    if (card.dataset.tidy) return;
    card.dataset.tidy = '1';
    const items = card.querySelectorAll('.cmd-item');
    const header = card.querySelector('.section-header');
    const titleEl = card.querySelector('.section-title');
    const subEl = card.querySelector('.section-subtitle');
    if (!items.length || !header || !titleEl) return;
    const first = items[0];
    const descEl = first.querySelector('.cmd-desc');
    const descText = descEl ? (descEl.querySelector('span') || descEl).textContent.trim() : '';

    // 1. Rebuild a truncated title from the full description.
    const rawTitle = titleEl.textContent.trim();
    const m = rawTitle.match(/^([^:]{1,40}):\s*(.+)$/);
    const body = m ? m[2] : rawTitle;
    let repaired = false;
    // Generated titles are the description cut at a fixed length, sometimes after
    // dropping its first word ("Search logs…" → "Logs…"), so look near the start.
    const at = descText ? tidyNorm(descText).indexOf(tidyNorm(body)) : -1;
    if (descText && !titleEl.querySelector('mark') && body.length >= 8
        && at >= 0 && at <= 16
        && tidyNorm(descText).length > at + tidyNorm(body).length + 2
        && !/[.)\]!?]$/.test(body)) {
      titleEl.innerHTML = `${m ? `<span class="tidy-eyebrow">${escapeHtml(m[1])}</span>` : ''}${escapeHtml(descText)}`;
      titleEl.title = rawTitle;
      repaired = true;
    } else if (m && tidyNorm(m[2]) === tidyNorm(descText)) {
      titleEl.innerHTML = `<span class="tidy-eyebrow">${escapeHtml(m[1])}</span>${escapeHtml(m[2])}`;
      repaired = true;
    }

    if (items.length !== 1) return;
    card.classList.add('tidy-single');
    const sub = subEl ? tidyNorm(subEl.textContent) : '';
    const desc = tidyNorm(descText);
    const titleBody = tidyNorm(repaired ? descText : body);

    // 2. One sentence, said once.
    if (subEl && sub && (sub === desc || sub === titleBody)) subEl.classList.add('tidy-dup');
    const descIsDup = descEl && desc && (desc === sub || desc === titleBody);
    if (descIsDup) descEl.classList.add('tidy-dup');

    // 3. The bookmark replaces the "1" count badge; the description row goes if nothing is left in it.
    const count = header.querySelector('.count-badge, .cmd-count-badge');
    const row = first.querySelector('.cmd-header-row, .cmd-top-row');
    const bookmark = row && row.querySelector('.bookmark-btn');
    if (bookmark && descIsDup) {
      bookmark.classList.add('tidy-bookmark');
      if (count) count.replaceWith(bookmark); else header.appendChild(bookmark);
      const leftovers = Array.from(row.querySelectorAll(':scope > *')).filter(el => !el.classList.contains('tidy-dup') && !(el.classList.contains('cmd-actions') && !el.children.length));
      if (!leftovers.length) row.classList.add('tidy-dup');
    } else if (count && count.textContent.trim() === '1') {
      count.classList.add('tidy-dup');
    }
  }

  function initCleanCards() {
    const run = () => {
      const cards = document.querySelectorAll('.section-card:not([data-tidy])');
      if (!cards.length) return false;
      cards.forEach(tidyCard);
      return true;
    };
    if (run()) repack();
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { queued = false; if (run()) repack(); });
    }).observe(document.body, { childList: true, subtree: true });
  }

  // -------------------------------------------------------------
  // MISSION CONTROL (home launchpad)
  // The home page used to open on a chmod calculator, so nothing told a new
  // visitor this is a 188-sheet datacenter suite that can decode a pasted
  // error, run a playbook or build an RMA. The launchpad leads with "what's
  // broken?" and surfaces the decoder, runbooks, recents and suites.
  // -------------------------------------------------------------
  const LP_HIDDEN_KEY = 'dc_launchpad_hidden';
  const RECENT_KEY = 'dc_recent_sheets';

  const IN_WIDGET_FRAME = window.location.href === 'about:srcdoc';

  function recordVisit(file) {
    if (!file || IN_WIDGET_FRAME || !/\.html$/.test(file) || /portable/.test(file)) return;
    const h1 = document.querySelector('.top-bar h1');
    const name = (h1 ? h1.textContent.trim() : file).replace(/\s+/g, ' ');
    let list = [];
    try { list = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch (e) {}
    if (!Array.isArray(list)) list = [];
    list = [{ file, name, t: Date.now() }, ...list.filter(x => x && x.file !== file)].slice(0, 8);
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(list)); } catch (e) {}
  }
  // The portable build calls setSheetContext() before it re-renders the header,
  // so the visit is recorded when the title actually changes (or after a timeout).
  let pendingVisit = null;
  let pendingTimer = null;
  let titleWatch = null;
  function flushVisit() {
    if (!pendingVisit) return;
    const file = pendingVisit;
    pendingVisit = null;
    clearTimeout(pendingTimer);
    recordVisit(file);
    markVisited(file);
    const lp = document.getElementById('launchpad');
    if (lp && lp._sync) lp._sync();
    renderSuiteNav();
    renderBerPanel();
    renderHealthPanel();
    markXidTiles();
  }
  function queueVisit(file) {
    pendingVisit = file;
    clearTimeout(pendingTimer);
    pendingTimer = setTimeout(flushVisit, 1200);
    const h1 = document.querySelector('.top-bar h1');
    if (h1 && !titleWatch) {
      titleWatch = new MutationObserver(() => { if (pendingVisit) setTimeout(flushVisit, 0); });
      titleWatch.observe(h1, { childList: true, characterData: true, subtree: true });
    }
  }

  function readRecents() {
    try { const l = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); return Array.isArray(l) ? l : []; } catch (e) { return []; }
  }

  function goToSheet(file) {
    if (window.portableOpenSheet) window.portableOpenSheet(file, '');
    else window.location.href = file;
  }

  function lpSuites() {
    const nav = document.querySelector('.top-bar .sheet-switcher');
    if (!nav) return [];
    return Array.from(nav.children).map(child => {
      const toggle = child.querySelector('.dropdown-toggle') || (child.matches('a') ? child : null);
      if (!toggle) return null;
      const items = child.querySelectorAll('.dropdown-item');
      const hub = items[0] || toggle;
      return {
        name: toggle.textContent.replace(/[▾•]/g, '').trim(),
        icon: toggle.querySelector('svg, img') ? toggle.querySelector('svg, img').outerHTML : '',
        count: items.length ? items.length - (items[0] && /hub|all /i.test(items[0].textContent) ? 1 : 0) : 1,
        link: hub
      };
    }).filter(Boolean);
  }

  function lpAgo(t) {
    const s = Math.max(1, Math.round((Date.now() - t) / 1000));
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.round(s / 60)} min ago`;
    if (s < 86400) return `${Math.round(s / 3600)} h ago`;
    return `${Math.round(s / 86400)} d ago`;
  }

  function renderLaunchpad(lp) {
    const index = window.GLOBAL_SEARCH_INDEX || [];
    const sheets = new Set(index.map(i => i.file)).size;
    const hidden = readStored(LP_HIDDEN_KEY) === '1';
    lp.classList.toggle('is-collapsed', hidden);
    if (hidden) {
      lp.innerHTML = `<div class="lp-collapsed"><button type="button" data-lp="show">◆ Mission Control: decode an error, start a runbook, jump to a suite</button></div>`;
      return;
    }
    const recents = readRecents().filter(r => r.file !== 'index.html').slice(0, 5);
    const trail = readTrail().slice(-3).reverse();
    const kit = readKit();
    const suites = lpSuites();
    lp.innerHTML = `
      <div class="lp-hero">
        <div class="lp-hero-main">
          <div class="lp-eyebrow"><span class="lp-dot" aria-hidden="true"></span>Datacenter field reference · works offline</div>
          <h2 class="lp-title">What's broken?</h2>
          <p class="lp-sub">Paste an error straight from <code>dmesg</code>, the SEL or <code>mlxlink</code> for a diagnosis and the next commands, or search ${index.length.toLocaleString('en-US')} commands across ${sheets} sheets.</p>
          <form class="lp-omni" role="search">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.6-4.6"/></svg>
            <input type="text" id="lp-omni-input" placeholder="NVRM: Xid (PCI:0000:8a:00): 79 …  or  mlxlink ber" autocomplete="off" spellcheck="false" aria-label="Paste an error line or search commands" />
            <button type="submit">Diagnose<kbd>↵</kbd></button>
          </form>
          <div class="lp-preview" aria-live="polite"></div>
          <div class="lp-samples"><button type="button" class="lp-atlas" data-atlas-open>🩻 What healthy looks like</button><span>Try:</span>${DECODER_SAMPLES.map(([label, line]) => `<button type="button" data-lp-sample="${escapeHtml(line)}">${escapeHtml(label)}</button>`).join('')}</div>
        </div>
        <div class="lp-stats" aria-label="Suite size">
          <div><b>${sheets}</b><span>sheets</span></div>
          <div><b>${index.length.toLocaleString('en-US')}</b><span>commands</span></div>
          <div><b>${RUNBOOKS.length}</b><span>guided runbooks</span></div>
          <div><b>${suites.length}</b><span>suites</span></div>
        </div>
      </div>

      ${(() => {
        const nodes = boardNodes();
        if (!nodes.length) return '';
        return `<div class="lp-section lp-board">
          <div class="lp-section-head"><h3>Your nodes</h3><span>${nodes.length} workspace${nodes.length === 1 ? '' : 's'}, worst first</span><button type="button" class="lp-board-open" data-lp="board">Shift board &amp; handoff →</button></div>
          <div class="board-grid board-grid-compact">${nodes.slice(0, 4).map(d => boardCardHtml(d, true)).join('')}</div>
        </div>`;
      })()}

      <div class="lp-section">
        <div class="lp-section-head"><h3>Guided runbooks</h3><span>Safety → evidence → decision → physical isolation → RMA</span></div>
        <div class="lp-runbooks">
          ${RUNBOOKS.map(rb => {
            const run = rbRun(rb.id);
            const { done, total } = rbProgress(rb, run);
            return `<button type="button" class="lp-rb" data-lp-runbook="${rb.id}">
              <span class="lp-rb-icon" aria-hidden="true">${rb.icon}</span>
              <span class="lp-rb-text"><b>${escapeHtml(rb.title)}</b><small>${escapeHtml(rb.tag)}</small></span>
              <span class="lp-rb-state">${done ? `<span class="rb-meter"><span style="width:${Math.round(done / total * 100)}%"></span></span>Resume ${done}/${total}` : 'Start →'}</span>
            </button>`;
          }).join('')}
        </div>
      </div>

      <div class="lp-cols">
        <div class="lp-section">
          <div class="lp-section-head"><h3>Pick up where you left off</h3></div>
          ${recents.length || trail.length || kit.length ? `
            ${recents.length ? `<div class="lp-recents">${recents.map(r => `<button type="button" class="lp-recent" data-lp-go="${escapeHtml(r.file)}"><span>${escapeHtml(r.name)}</span><small>${lpAgo(r.t)}</small></button>`).join('')}</div>` : ''}
            ${kit.length ? `<div class="lp-trail lp-kit"><div class="lp-trail-head">My kit · ${kit.length} bookmarked <button type="button" data-lp="kit">Open kit →</button></div>${kit.slice(0, 3).map(e => `<code title="${escapeHtml(e.item.sName)}">${escapeHtml(firstCommand(trailSafeText(e.item.cmd)))}</code>`).join('')}</div>` : ''}
            ${trail.length ? `<div class="lp-trail"><div class="lp-trail-head">Last copied <button type="button" data-lp="trail">Open trail (${readTrail().length}) →</button></div>${trail.map(e => `<code title="${escapeHtml(e.sheet)} · ${trailTime(e.t)}">${escapeHtml(e.cmd)}</code>`).join('')}</div>` : ''}
          ` : `<p class="lp-empty">Sheets you open and commands you copy show up here, so you can get back to them mid-incident.</p>`}
        </div>
        <div class="lp-section">
          <div class="lp-section-head"><h3>Browse suites</h3><span>${sheets} sheets</span></div>
          <div class="lp-suites">
            ${suites.map((s, i) => `<button type="button" class="lp-suite" data-lp-suite="${i}">${s.icon}<span>${escapeHtml(s.name)}</span><small>${s.count}</small></button>`).join('')}
          </div>
        </div>
      </div>
      <button type="button" class="lp-hide" data-lp="hide" title="Collapse the launchpad (remembered)">Hide launchpad ▴</button>`;

    const input = lp.querySelector('#lp-omni-input');
    interceptOutputPaste(input);
    const preview = lp.querySelector('.lp-preview');
    const updatePreview = () => {
      const d = decodeSymptom(input.value);
      if (!d) { preview.innerHTML = ''; preview.classList.remove('show'); return; }
      const rbId = runbookForDecoded(d);
      preview.classList.add('show');
      preview.innerHTML = `<span class="lp-pv-sev sev-${d.sev}">${SEV[d.sev]}</span><b>${escapeHtml(d.title)}</b><span class="lp-pv-layer">${escapeHtml(d.layer)}</span>
        <span class="lp-pv-actions">${rbId ? `<button type="button" data-lp-runbook="${rbId}">▶ Runbook</button>` : ''}<button type="button" data-lp="open">Full diagnosis ↵</button></span>`;
    };
    input.addEventListener('input', updatePreview);
    lp.querySelector('.lp-omni').addEventListener('submit', (e) => {
      e.preventDefault();
      openGlobalSearch(input.value.trim());
    });
    lp._suites = suites;
  }

  function initLaunchpad() {
    const main = document.querySelector('main');
    if (!main || document.getElementById('launchpad')) return;
    const lp = document.createElement('section');
    lp.id = 'launchpad';
    lp.className = 'container launchpad';
    lp.setAttribute('aria-label', 'Mission Control');
    main.parentNode.insertBefore(lp, main);

    lp.addEventListener('click', (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const input = lp.querySelector('#lp-omni-input');
      const sample = el.closest('[data-lp-sample]');
      const rb = el.closest('[data-lp-runbook]');
      if (el.closest('[data-board-resume], [data-board-trail], [data-board-remove]')) return handleBoardClick(e);
      const go = el.closest('[data-lp-go]');
      const suite = el.closest('[data-lp-suite]');
      const act = el.closest('[data-lp]');
      if (sample && input) { input.value = sample.dataset.lpSample; input.dispatchEvent(new Event('input')); input.focus(); return; }
      if (rb) return openRunbook(rb.dataset.lpRunbook);
      if (go) return goToSheet(go.dataset.lpGo);
      if (suite && lp._suites) { const s = lp._suites[+suite.dataset.lpSuite]; if (s && s.link) s.link.click(); return; }
      if (!act) return;
      if (act.dataset.lp === 'open') return openGlobalSearch(input ? input.value.trim() : '');
      if (act.dataset.lp === 'trail') return openTrail();
      if (act.dataset.lp === 'kit') return openKit();
      if (act.dataset.lp === 'board') return openBoard();
      if (act.dataset.lp === 'hide') { try { localStorage.setItem(LP_HIDDEN_KEY, '1'); } catch (err) {} return renderLaunchpad(lp); }
      if (act.dataset.lp === 'show') { try { localStorage.removeItem(LP_HIDDEN_KEY); } catch (err) {} return renderLaunchpad(lp); }
    });

    const sync = () => {
      const file = anatSheetFile || window.location.pathname.split('/').pop() || 'index.html';
      const home = file === 'index.html' || file === '';
      lp.hidden = !home;
      if (home) renderLaunchpad(lp);
    };
    sync();
    lp._sync = sync;
  }

  // -------------------------------------------------------------
  // GUIDED RUNBOOKS
  // The team's playbooks (docs/playbooks/*.md) as interactive runs that follow
  // the 5-step method in AGENTS.md: safety → collect → correlate → physical
  // isolation → RMA. Read-only commands copy with Rack Targets filled in (and
  // land in the Case Trail). Intrusive steps stay locked until the tech
  // confirms the node is drained and the action approved. Decisions produce a
  // verdict, and the run exports a summary or pre-fills the RMA formatter.
  // Progress is kept per runbook in this browser.
  // -------------------------------------------------------------
  const DRAIN_CHECK = { id: 'drain', type: 'cmd', title: 'Check workload and scheduler drain state', cmd: 'nvidia-smi --query-compute-apps=pid,process_name,used_memory --format=csv; sinfo -N -n $(hostname -s) -o "%N %T %E"', look: 'No compute PIDs, and the node shows drain/drained before anything intrusive. Running jobs → coordinate before touching hardware.' };

  const RUNBOOKS = [
    {
      id: 'gpu-missing', icon: '🛑', title: 'GPU missing / fallen off the bus', tag: 'Xid 79 · nvidia-smi shows 7/8', component: 'NVIDIA GPU (SXM / PCIe / NVLink)', source: 'gpu-nvlink.md §4',
      phases: [
        { name: 'Identify & safety', steps: [
          DRAIN_CHECK,
          { id: 'platform', type: 'cmd', title: 'Record platform, chassis serial and BIOS', cmd: 'sudo dmidecode -t system -t bios | grep -E "Manufacturer|Product Name|Serial Number|Version|Release Date"', look: 'Goes straight into the RMA identification block.' }
        ] },
        { name: 'Collect', steps: [
          { id: 'xids', type: 'cmd', title: 'Find the Xid 79 and what came right before it', cmd: 'dmesg -T | grep -E -i "NVRM: Xid|nvidia-nvswitch: SXid|AER|pcieport|fallen off the bus"', look: 'The BDF in "Xid (PCI:0000:xx:00): 79". A Xid 48/74/119 just before it points at the real cause.' },
          { id: 'count', type: 'cmd', title: 'Count GPUs on the PCIe bus', cmd: 'lspci -nn | grep -i nvidia', look: 'Fewer 3D controllers than installed (8 on HGX) means the device dropped off PCIe, not just the driver.' },
          { id: 'map', type: 'cmd', title: 'Map surviving GPUs: index ↔ BDF ↔ serial', cmd: 'nvidia-smi --query-gpu=index,pci.bus_id,serial,uuid,vbios_version --format=csv', look: 'Which BDF is missing from the list identifies the slot / SXM module.' },
          { id: 'sel', type: 'cmd', title: 'BMC: power, VRD, thermal and leak events', cmd: 'ipmitool sel elist | tail -n 50; ipmitool sdr elist | grep -E -i "gpu|sxm|pwr|temp|vrd|leak"', look: 'Events at the same timestamp as the Xid. Any "Leak Detected" / "Coolant Flow Low" → STOP and alert; never power on with an active leak alarm.' },
          { id: 'bugreport', type: 'cmd', title: 'NVIDIA bug report (safe mode, before any reset)', cmd: 'sudo nvidia-bug-report.sh --safe-mode', look: '--safe-mode stops the script hanging on a GPU that is off the bus. Attach the .log.gz to the RMA.' }
        ] },
        { name: 'Correlate', steps: [
          { id: 'parent', type: 'cmd', title: 'Parent root port / switch link state', cmd: 'sudo lspci -vvv -s <parent_bridge_bdf> | grep -E "LnkSta:|LnkCap:|AER|UESta"', look: 'Link down or UESta errors on the bridge above the missing GPU.' },
          { id: 'cause', type: 'decide', title: 'What did the BMC show at the time of the Xid?', options: [
            { label: 'PSU / VRD / power event', verdict: 'Power path suspect: check PSU, busbar and power cabling before blaming the GPU.' },
            { label: 'Thermal trip / high temps', verdict: 'Cooling suspect: check coldplate/heatsink seating and GPU vs memory temp delta (> 25 °C is a red flag).' },
            { label: 'Leak / coolant alarm', verdict: 'STOP: active leak alarm. Do not power on. Escalate to facilities / DLC team immediately.', sev: 'crit' },
            { label: 'Nothing correlated', verdict: 'GPU or slot suspect: proceed with physical isolation and a cold power cycle.' }
          ] }
        ] },
        { name: 'Physical isolation', steps: [
          { id: 'pcie-power', type: 'check', title: 'PCIe / RTX cards: power connectors, riser and slot', body: 'Check 12VHPWR / 12V-2x6 / 8-pin seating, riser gold fingers and the slot latch. Under load the link should train at Gen5 x16 (or Gen4 x16).' },
          { id: 'sxm', type: 'check', title: 'SXM (H200 / B200): power and cooling', body: 'Check 48 V / 54 V busbar voltage, SXM socket/interposer history, and coldplate seating.' },
          { id: 'cycle', type: 'gate', title: 'Drain, then full DC off for 60 s and power on', cmd: 'scontrol update NodeName=$(hostname -s) State=DRAIN Reason="Xid 79 GPU off bus"', look: 'An nvidia-smi -r usually fails after Xid 79 because the device left PCIe. A cold cycle re-trains PCIe and the SXM power sequencers.' },
          { id: 'after', type: 'decide', title: 'After the cold power cycle…', options: [
            { label: 'GPU is back and stays stable', verdict: 'Recovered: return to service and monitor for recurrence. No RMA yet.' },
            { label: 'Back, but Xid 79 recurs', verdict: 'RMA GPU (swap to another slot first if possible to rule out the slot/baseboard).', rma: true },
            { label: 'Still missing', verdict: 'RMA: GPU or HGX baseboard. Escalate with the bug report and SEL.', rma: true, sev: 'crit' }
          ] }
        ] }
      ]
    },
    {
      id: 'gpu-hbm', icon: '🧠', title: 'GPU memory errors / row remap', tag: 'Xid 48 · 63 · 64 · 94 · 95', component: 'NVIDIA GPU (SXM / PCIe / NVLink)', source: 'gpu-nvlink.md §2–3',
      phases: [
        { name: 'Identify & safety', steps: [DRAIN_CHECK] },
        { name: 'Collect', steps: [
          { id: 'xids', type: 'cmd', title: 'Which Xids, on which GPU', cmd: 'dmesg -T | grep -E -i "NVRM: Xid|SXid"', look: 'Xid 13/31/43 alone are usually application faults. 48/63/64/94/95 are memory hardware.' },
          { id: 'remap', type: 'cmd', title: 'Row remapper and ECC state', cmd: 'nvidia-smi -q -d ECC,ROW_REMAPPER -i $GPU', look: '"Pending: Yes" → needs a reset to remap. "Remapping Failure Occurred: Yes" → RMA. Bank histogram at "None" means no spare rows. "SRAM Uncorrectable" > 0 cannot be remapped.' },
          { id: 'ecc', type: 'cmd', title: 'ECC counters across all GPUs', cmd: 'nvidia-smi --query-gpu=index,serial,pci.bus_id,ecc.errors.uncorrected.volatile.total,ecc.errors.uncorrected.aggregate.total --format=csv', look: 'Is it one GPU or several? Several at once points at software/driver, not HBM.' }
        ] },
        { name: 'Correlate', steps: [
          { id: 'state', type: 'decide', title: 'Row remapper says…', options: [
            { label: 'Remapping Failure Occurred: Yes', verdict: 'RMA GPU: row remap failure (Xid 64 criteria).', rma: true, sev: 'crit' },
            { label: 'SRAM Uncorrectable > 0 with Xid 48/95', verdict: 'RMA GPU: SRAM uncorrectable cannot be remapped.', rma: true, sev: 'crit' },
            { label: 'Pending: Yes', verdict: 'Drain and reset the GPU to complete the remap, then re-check.' },
            { label: 'Clean, nothing pending', verdict: 'No HBM fault recorded: treat as application/driver; monitor.' }
          ] }
        ] },
        { name: 'Recovery', steps: [
          { id: 'reset', type: 'gate', title: 'GPU reset to complete the remap', cmd: 'sudo nvidia-smi -r -i $GPU', look: 'Only on a drained node with no processes on the GPU. A cold reboot also completes the remap.' },
          { id: 'diag', type: 'gate', title: 'DCGM level 3 diagnostic', cmd: 'dcgmi diag -r 3', look: '10–15 minutes of memory/PCIe/NVLink stress. The result goes in the RMA.' },
          { id: 'after', type: 'decide', title: 'After reset and diag…', options: [
            { label: 'Remap done, diag passes, no new DBEs', verdict: 'Recovered: return to service and trend ECC.' },
            { label: 'DBEs recur or diag fails', verdict: 'RMA GPU with remap state, ECC counts and DCGM result.', rma: true, sev: 'crit' }
          ] }
        ] }
      ]
    },
    {
      id: 'ib-link', icon: '🔦', title: 'InfiniBand link down, flapping or high BER', tag: 'Polling · symbol errors · NCCL timeouts', component: 'InfiniBand / RoCE HCA / Transceiver', source: 'network-optics.md §2–3',
      phases: [
        { name: 'Identify', steps: [
          { id: 'ibstat', type: 'cmd', title: 'Port state and rate', cmd: 'ibstat $HCA', look: '"Polling" = no light / remote port down / broken fiber. "Training" = marginal signal. Rate below NDR 400 or width < 4x = lost lanes.' },
          { id: 'mst', type: 'cmd', title: 'Map HCA ↔ BDF ↔ netdev', cmd: 'sudo mst status -v', look: 'Ties mlx5_X to the PCIe slot and ibX for the ticket.' }
        ] },
        { name: 'Collect', steps: [
          { id: 'mlxlink', type: 'cmd', analyze: true, title: 'Physical layer: DOM, BER, FEC, eye', cmd: 'sudo mlxlink -d $HCA -m -c -e', look: 'Effective Physical Errors > 0 · Raw BER > 5e-4 · Effective BER > 1e-12 · Rx < -10 dBm (-40 = LOS) · lane-to-lane Rx skew > 3 dB · Tx < -8 dBm · module temp > 70 °C.' },
          { id: 'perf', type: 'cmd', title: 'Fabric error counters', cmd: 'perfquery -x', look: 'SymbolErrorCounter and LinkDownedCounter rising.' },
          { id: 'pcie', type: 'cmd', title: 'HCA PCIe width / speed', cmd: 'sudo lspci -vvv -s <hca_bdf> | grep -E "LnkCap:|LnkSta:"', look: 'ConnectX-7 at 400G needs Gen5 x16. x8 caps at ~200 Gb/s and causes NCCL regressions.' }
        ] },
        { name: 'Correlate', steps: [
          { id: 'dom', type: 'decide', title: 'The DOM / BER pattern is…', options: [
            { label: 'All lanes Rx -40 dBm, local Tx normal', verdict: 'No light arriving: check switch port admin state, patch-panel polarity (Type A/B), and fiber bend/pinch.' },
            { label: '1–2 lanes low Rx or high BER', verdict: 'Dirty MPO ferrule (#1 cause): clean both ends and the bulkhead, scope if available.' },
            { label: 'Local Tx low (< -8 dBm) or Tx fault', verdict: 'Local laser failing: reseat once; if still low, RMA the transceiver.', rma: true },
            { label: 'DOM healthy but Training / high BER', verdict: 'Suspect APC/UPC mismatch, damaged core or transceiver DSP: run the A/B swap.' }
          ] }
        ] },
        { name: 'Physical isolation', steps: [
          { id: 'conn', type: 'check', title: 'Confirm connector geometry', body: 'DR4/DR8/FR4 single-mode is MPO-12 APC (green). Never mate APC with UPC: it crushes the end-faces. Host side is usually OSFP flat-top; never force a finned OSFP into an HCA cage.' },
          { id: 'clean', type: 'check', title: 'Clean and inspect both ends', body: '1-click MPO cleaner on the cable ferrule and inside the transceiver bulkhead, on both host and switch side. Scope if available.' },
          { id: 'route', type: 'check', title: 'Check routing', body: 'Bend radius ≥ 30 mm; no pinch points in cable-management arms.' },
          { id: 'swap', type: 'check', title: 'A/B cross-swap', body: 'Swap the fiber between two ports, then swap the transceiver with a known-good adjacent port. Note what the fault follows.' },
          { id: 'ab', type: 'decide', title: 'The fault…', options: [
            { label: 'Cleared after cleaning / reseat', verdict: 'Resolved at Layer 1 (contamination / seating). Monitor counters.' },
            { label: 'Follows the fiber', verdict: 'Replace the patch cord / trunk or the switch-side optic.' },
            { label: 'Follows the transceiver', verdict: 'RMA the transceiver with DOM readings attached.', rma: true },
            { label: 'Stays on the host port after both swaps', verdict: 'Inspect HCA cage pins; escalate for HCA replacement.', rma: true, sev: 'crit' }
          ] }
        ] }
      ]
    },
    {
      id: 'dimm', icon: '🧩', title: 'Memory ECC errors (DIMM)', tag: 'EDAC CE storm · UE · fatal MCE', component: 'RAM DIMM (DDR5 / EDAC CE-UE)', source: 'bmc-hardware.md §3',
      phases: [
        { name: 'Identify & safety', steps: [
          { id: 'drain', type: 'cmd', title: 'Uptime and scheduler state', cmd: 'uptime; sinfo -N -n $(hostname -s) -o "%N %T %E"', look: 'A UE usually panics or reboots the node. Short uptime + UE = recent crash.' }
        ] },
        { name: 'Collect', steps: [
          { id: 'edac', type: 'cmd', title: 'EDAC counters per DIMM', cmd: 'edac-util -v', look: 'Which mc/csrow/channel is counting. One DIMM climbing = that DIMM.' },
          { id: 'ras', type: 'cmd', title: 'RAS history', cmd: 'sudo ras-mc-ctl --summary && sudo ras-mc-ctl --errors', look: 'Corrected vs uncorrected, and the DIMM label the kernel decoded.' },
          { id: 'sel', type: 'cmd', title: 'BMC silkscreen slot', cmd: 'ipmitool sel elist | grep -i -E "memory|dimm|ecc|mcr"', look: 'The BMC usually names the exact slot (DIMM_A1 / P0_MC0_DIMM_A0) and whether the CE logging limit was reached.' },
          { id: 'dmi', type: 'cmd', title: 'Serial and part number for that slot', cmd: 'sudo dmidecode -t memory | grep -E "Locator:|Size:|Speed:|Serial Number:|Part Number:"', look: 'Match the Locator to the slot from the SEL. These go in the RMA.' }
        ] },
        { name: 'Correlate', steps: [
          { id: 'kind', type: 'decide', title: 'The errors are…', options: [
            { label: 'Uncorrectable (UE / fatal MCE / poison)', verdict: 'Replace and RMA the DIMM. If this is a newly racked node, reseat or swap first to rule out the socket.', rma: true, sev: 'crit' },
            { label: 'CE storm (> 1000/day or logging limit reached)', verdict: 'Schedule a drain and replace the DIMM; CE storms precede UEs and cost performance via SMIs.', rma: true },
            { label: 'A few CEs', verdict: 'Monitor and trend; no action yet.' },
            { label: 'Capacity missing', verdict: 'Find the slot reporting "No Module Installed" / "Unknown" while physically populated; reseat.' }
          ] }
        ] },
        { name: 'Physical isolation', steps: [
          { id: 'swapgate', type: 'gate', title: 'Drain and power off for a DIMM swap', cmd: 'scontrol update NodeName=$(hostname -s) State=DRAIN Reason="DIMM ECC isolation"', look: 'Move the suspect DIMM to an adjacent channel slot to tell DIMM from CPU socket pins.' },
          { id: 'follows', type: 'decide', title: 'After the swap the errors…', options: [
            { label: 'Follow the DIMM', verdict: 'RMA the DIMM (serial / part number from dmidecode).', rma: true },
            { label: 'Stay with the slot', verdict: 'CPU socket / board issue: inspect socket pins and escalate to the OEM.', rma: true, sev: 'crit' }
          ] }
        ] }
      ]
    },
    {
      id: 'nvme', icon: '💽', title: 'NVMe drive errors or missing drive', tag: 'critical_warning · I/O timeout · media errors', component: 'NVMe SSD Drive (Critical Warning)', source: 'storage-jbod.md §1, §3',
      phases: [
        { name: 'Identify & safety', steps: [
          { id: 'list', type: 'cmd', title: 'Drives, models, serials, firmware', cmd: 'sudo nvme list', look: 'Is the drive listed at all? Missing → bay / backplane isolation.' },
          { id: 'raid', type: 'cmd', title: 'Array / pool health before touching anything', cmd: 'cat /proc/mdstat; zpool status -v 2>/dev/null', look: 'Never pull a member of a DEGRADED array without confirming which serial is already FAULTED/REMOVED.' }
        ] },
        { name: 'Collect', steps: [
          { id: 'smart', type: 'cmd', analyze: true, title: 'SMART / health log', cmd: 'sudo nvme smart-log $DISK', look: 'critical_warning bits: 0x01 spare low · 0x02 temperature · 0x04 reliability degraded · 0x08 read-only. Also media_errors and available_spare vs threshold.' },
          { id: 'errlog', type: 'cmd', title: 'Controller error log', cmd: 'sudo nvme error-log $DISK | head -n 40', look: 'Recent error entries and their status codes.' },
          { id: 'dmesg', type: 'cmd', title: 'Kernel: timeouts, resets, I/O errors', cmd: 'dmesg -T | grep -E -i "nvme|I/O error|blk_update_request|AER|pciehp"', look: 'Timeouts + controller resets + I/O errors on the same drive.' },
          { id: 'slot', type: 'cmd', title: 'Controller → PCIe BDF / slot', cmd: 'ls -l /sys/class/nvme/', look: 'The symlink shows the BDF; match it to the bay for the swap.' }
        ] },
        { name: 'Correlate', steps: [
          { id: 'verdict', type: 'decide', title: 'SMART shows…', options: [
            { label: 'critical_warning 0x08 (read-only)', verdict: 'Immediate RMA of the drive.', rma: true, sev: 'crit' },
            { label: '0x01 spare low or 0x04 reliability', verdict: 'RMA the drive.', rma: true },
            { label: 'media_errors > 0 with kernel I/O errors', verdict: 'RMA the drive.', rma: true },
            { label: '0x02 temperature', verdict: 'Cooling issue: check fans, airflow and the drive heatsink, not the drive.' },
            { label: 'Drive missing from nvme list', verdict: 'Isolate drive vs bay: check bay LED, slot power and backplane cable, then try a known-good drive in the bay.' }
          ] }
        ] },
        { name: 'Physical isolation', steps: [
          { id: 'label', type: 'check', title: 'Verify the serial on the carrier label', body: 'Confirm the serial from nvme list on the physical drive before pulling anything.' },
          { id: 'pull', type: 'gate', title: 'Remove the drive from the array (if it is a member)', cmd: 'sudo mdadm --detail /dev/md0', look: 'Read the array first. Any --fail / --remove or zpool offline is a storage mutation that needs approval.' }
        ] }
      ]
    }
  ];

  const RB_KEY = 'dc_runbook_runs';
  const DECODER_RUNBOOK = { 'edac-ue': 'dimm', 'edac-ce': 'dimm', ib: 'ib-link', nvme: 'nvme', 'disk-io': 'nvme' };
  function runbookForDecoded(card) {
    if (!card) return null;
    const ruleId = card.ruleId;
    if (ruleId === 'xid') {
      const n = parseInt((card.title.match(/^Xid (\d+)/) || [])[1], 10);
      if (n === 79) return 'gpu-missing';
      if ([48, 63, 64, 92, 94, 95].includes(n)) return 'gpu-hbm';
      return null;
    }
    return DECODER_RUNBOOK[ruleId] || null;
  }

  function rbRuns() { try { return JSON.parse(localStorage.getItem(RB_KEY) || '{}') || {}; } catch (e) { return {}; } }
  function rbRun(id) { return Object.assign({ done: {}, notes: {}, picks: {}, unlocked: {}, started: null }, rbRuns()[id] || {}); }
  function rbSave(id, run) { const all = rbRuns(); all[id] = run; try { localStorage.setItem(RB_KEY, JSON.stringify(all)); } catch (e) {} }
  function rbSteps(rb) { return rb.phases.flatMap(p => p.steps); }
  function rbProgress(rb, run) {
    const steps = rbSteps(rb);
    const done = steps.filter(s => s.type === 'decide' ? run.picks[s.id] !== undefined : run.done[s.id]).length;
    return { done, total: steps.length };
  }
  function rbVerdict(rb, run) {
    let last = null;
    rbSteps(rb).forEach(s => { if (s.type === 'decide' && run.picks[s.id] !== undefined) last = { step: s, opt: s.options[run.picks[s.id]] }; });
    return last;
  }

  let rbActive = null;

  function renderRunbookPicker() {
    const host = document.getElementById('tab-runbook');
    if (!host) return;
    rbActive = null;
    host.innerHTML = `
      <p class="triage-lead">Step-by-step runs of the team playbooks: safety first, read-only evidence, decisions, physical isolation, then an RMA package. Intrusive steps stay locked until you confirm the node is drained and the action is approved.</p>
      <div class="rb-grid">
        ${RUNBOOKS.map(rb => {
          const run = rbRun(rb.id);
          const { done, total } = rbProgress(rb, run);
          const v = rbVerdict(rb, run);
          return `
            <button type="button" class="rb-card" data-rb="${rb.id}">
              <span class="rb-card-icon" aria-hidden="true">${rb.icon}</span>
              <span class="rb-card-title">${escapeHtml(rb.title)}</span>
              <span class="rb-card-tag">${escapeHtml(rb.tag)}</span>
              <span class="rb-card-foot">
                <span class="rb-meter"><span style="width:${Math.round(done / total * 100)}%"></span></span>
                <span>${done ? `${done}/${total} steps` : `${total} steps`}</span>
              </span>
              ${v ? `<span class="rb-card-verdict ${v.opt.rma ? 'is-rma' : ''}">${escapeHtml(v.opt.label)}</span>` : ''}
            </button>`;
        }).join('')}
      </div>`;
  }

  function stepStatus(step, run) {
    if (step.type === 'decide') return run.picks[step.id] !== undefined;
    return !!run.done[step.id];
  }

  function renderRunbook(id) {
    const rb = RUNBOOKS.find(r => r.id === id);
    const host = document.getElementById('tab-runbook');
    if (!rb || !host) return;
    rbActive = rb;
    const run = rbRun(id);
    if (!run.started) { run.started = Date.now(); rbSave(id, run); }
    const { done, total } = rbProgress(rb, run);
    const v = rbVerdict(rb, run);
    let n = 0;
    host.innerHTML = `
      <div class="rb-head">
        <button type="button" class="rb-back" data-rb-act="back">← All runbooks</button>
        <div class="rb-head-main">
          <h4><span aria-hidden="true">${rb.icon}</span> ${escapeHtml(rb.title)}</h4>
          <span class="rb-source">From docs/playbooks/${escapeHtml(rb.source)}</span>
        </div>
        <div class="rb-progress" aria-label="${done} of ${total} steps done">
          <span class="rb-meter"><span style="width:${Math.round(done / total * 100)}%"></span></span>
          <b>${done}/${total}</b>
        </div>
      </div>
      ${v ? `<div class="rb-verdict ${v.opt.sev === 'crit' ? 'sev-crit' : v.opt.rma ? 'sev-rma' : 'sev-ok'}"><span>Current verdict</span>${escapeHtml(v.opt.verdict)}</div>` : ''}
      <ol class="rb-phases">
        ${rb.phases.map((ph, pi) => `
          <li class="rb-phase">
            <div class="rb-phase-name"><span>${pi + 1}</span>${escapeHtml(ph.name)}</div>
            <ol class="rb-steps">
              ${ph.steps.map(st => {
                n++;
                const isDone = stepStatus(st, run);
                const locked = st.type === 'gate' && !run.unlocked[st.id];
                return `
                <li class="rb-step type-${st.type} ${isDone ? 'is-done' : ''}" data-step="${st.id}">
                  <div class="rb-step-head">
                    ${st.type === 'decide'
                      ? `<span class="rb-step-num" aria-hidden="true">?</span>`
                      : `<label class="rb-check"><input type="checkbox" data-rb-act="done" ${isDone ? 'checked' : ''} ${locked ? 'disabled' : ''} aria-label="Mark step ${n} done"/><span class="rb-step-num">${isDone ? '✓' : n}</span></label>`}
                    <div class="rb-step-title">${escapeHtml(st.title)}${st.type === 'gate' ? ' <span class="rb-gate-tag">needs drain + approval</span>' : ''}${st.type === 'check' ? ' <span class="rb-hands-tag">hands-on</span>' : ''}</div>
                  </div>
                  ${st.body ? `<p class="rb-body">${escapeHtml(st.body)}</p>` : ''}
                  ${st.cmd ? (locked
                    ? `<div class="rb-locked">
                         <code>${escapeHtml(st.cmd)}</code>
                         <label><input type="checkbox" data-rb-act="unlock"/> The node is drained and this action is approved by the technician on site</label>
                       </div>`
                    : `<div class="rb-cmd"><code>${escapeHtml(st.cmd)}</code><button type="button" data-rb-act="copy" data-cmd="${escapeHtml(st.cmd)}">Copy</button>${st.analyze ? '<button type="button" class="rb-analyze" data-rb-act="analyze">Analyze output</button>' : ''}</div>`) : ''}
                  ${st.look ? `<p class="rb-look"><b>${st.type === 'gate' ? 'Note' : 'Look for'}:</b> ${escapeHtml(st.look)}</p>` : ''}
                  ${st.type === 'decide' ? `<div class="rb-options" role="radiogroup" aria-label="${escapeHtml(st.title)}">${st.options.map((o, oi) => `
                    <button type="button" role="radio" aria-checked="${run.picks[st.id] === oi}" class="rb-option ${run.picks[st.id] === oi ? 'picked' : ''} ${o.rma ? 'is-rma' : ''} ${o.sev === 'crit' ? 'is-crit' : ''}" data-rb-act="pick" data-opt="${oi}">
                      <span class="rb-option-label">${escapeHtml(o.label)}</span>
                      ${run.picks[st.id] === oi ? `<span class="rb-option-verdict">${escapeHtml(o.verdict)}</span>` : ''}
                    </button>`).join('')}</div>` : ''}
                  <input type="text" class="rb-note" data-rb-act="note" value="${escapeHtml(run.notes[st.id] || '')}" placeholder="Finding (goes into the summary), e.g. Xid 79 on 0000:8a:00 at 14:02" aria-label="Finding for this step" />
                </li>`;
              }).join('')}
            </ol>
          </li>`).join('')}
      </ol>
      <div class="rb-foot">
        <button type="button" class="rb-primary" data-rb-act="summary">Copy case summary</button>
        <button type="button" data-rb-act="rma" ${v && v.opt.rma ? '' : 'title="Pick an RMA verdict first, or fill the formatter by hand"'}>Send to RMA formatter →</button>
        <button type="button" class="rb-reset" data-rb-act="reset">Reset run</button>
      </div>`;
  }

  function runbookSummary(rb, run) {
    const meta = trailMeta();
    const targets = trailTargetsSummary();
    const v = rbVerdict(rb, run);
    const { done, total } = rbProgress(rb, run);
    const lines = [
      `### [RUNBOOK] ${rb.title}${meta.caseId ? ` — ${meta.caseId}` : ''}`,
      `_Started ${run.started ? `${trailDate(run.started)} ${trailTime(run.started).slice(0, 5)}` : '—'} · ${done}/${total} steps · playbook docs/playbooks/${rb.source}${targets ? ` · targets: ${targets}` : ''}_`,
      '',
      `**Verdict:** ${v ? v.opt.verdict : 'not reached yet'}`,
      ''
    ];
    rb.phases.forEach(ph => {
      lines.push(`#### ${ph.name}`);
      ph.steps.forEach(st => {
        const note = run.notes[st.id] ? ` — ${run.notes[st.id]}` : '';
        if (st.type === 'decide') {
          const pick = run.picks[st.id];
          lines.push(`- ${pick !== undefined ? '[x]' : '[ ]'} ${st.title} ${pick !== undefined ? `**${st.options[pick].label}**` : ''}${note}`);
        } else {
          lines.push(`- ${run.done[st.id] ? '[x]' : '[ ]'} ${st.title}${st.cmd ? ` (\`${st.cmd.length > 90 ? st.cmd.slice(0, 87) + '…' : st.cmd}\`)` : ''}${note}`);
        }
      });
      lines.push('');
    });
    return lines.join('\n').trim();
  }

  function runbookFindings(rb, run) {
    const v = rbVerdict(rb, run);
    const notes = rbSteps(rb).filter(s => run.notes[s.id]).map(s => `${s.title}: ${run.notes[s.id]}`);
    return [`Runbook: ${rb.title}`, v ? `Verdict: ${v.opt.verdict}` : '', ...notes].filter(Boolean).join('\n');
  }

  function initRunbooks() {
    const host = document.getElementById('tab-runbook');
    if (!host || host.dataset.ready) return;
    host.dataset.ready = '1';
    renderRunbookPicker();

    host.addEventListener('click', (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const card = el.closest('[data-rb]');
      if (card) return renderRunbook(card.dataset.rb);
      const actEl = el.closest('[data-rb-act]');
      if (!actEl || !rbActive) return;
      const act = actEl.dataset.rbAct;
      const rb = rbActive;
      const run = rbRun(rb.id);
      const stepEl = actEl.closest('[data-step]');
      const stepId = stepEl && stepEl.dataset.step;
      if (act === 'back') return renderRunbookPicker();
      if (act === 'analyze') { if (stepId && !run.done[stepId]) { run.done[stepId] = true; rbSave(rb.id, run); } return openAnalyzer(); }
      if (act === 'copy') {
        navigator.clipboard.writeText(actEl.dataset.cmd);   // Rack Targets + Case Trail apply
        actEl.textContent = 'Copied';
        setTimeout(() => { actEl.textContent = 'Copy'; }, 1300);
        if (stepId && !run.done[stepId]) { run.done[stepId] = true; rbSave(rb.id, run); rbRefresh(stepId); }
        return;
      }
      if (act === 'pick') {
        const opt = parseInt(actEl.dataset.opt, 10);
        if (run.picks[stepId] === opt) delete run.picks[stepId]; else run.picks[stepId] = opt;
        rbSave(rb.id, run);
        return rbRefresh(stepId);
      }
      if (act === 'summary') {
        copyVerbatim(runbookSummary(rb, run));
        return showGlobalToast('Copied the runbook case summary.');
      }
      if (act === 'rma') {
        const comp = document.getElementById('rma-component');
        if (comp && [...comp.options].some(o => o.value === rb.component)) comp.value = rb.component;
        const log = document.getElementById('rma-log');
        if (log) log.value = runbookFindings(rb, run);
        const slot = document.getElementById('rma-slot');
        const vars = targetState.vars || {};
        if (slot && !slot.value) {
          if (rb.id.startsWith('gpu') && vars.gpu) slot.value = `GPU ${vars.gpu}`;
          if (rb.id === 'ib-link' && vars.hca) slot.value = vars.hca;
          if (rb.id === 'nvme' && vars.disk) slot.value = vars.disk;
        }
        const tab = document.querySelector('.triage-tab[data-tab="ticket"]');
        if (tab) tab.click();
        return;
      }
      if (act === 'reset') {
        if (actEl.dataset.confirm !== '1') {
          actEl.dataset.confirm = '1';
          actEl.textContent = 'Reset everything?';
          setTimeout(() => { actEl.dataset.confirm = ''; actEl.textContent = 'Reset run'; }, 2500);
          return;
        }
        rbSave(rb.id, { done: {}, notes: {}, picks: {}, unlocked: {}, started: null });
        return renderRunbook(rb.id);
      }
    });

    host.addEventListener('change', (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement) || !rbActive) return;
      const stepEl = input.closest('[data-step]');
      if (!stepEl) return;
      const run = rbRun(rbActive.id);
      const id = stepEl.dataset.step;
      if (input.dataset.rbAct === 'done') { if (input.checked) run.done[id] = true; else delete run.done[id]; }
      else if (input.dataset.rbAct === 'unlock') { if (input.checked) run.unlocked[id] = true; else delete run.unlocked[id]; }
      else return;
      rbSave(rbActive.id, run);
      rbRefresh(id);
    });
    host.addEventListener('input', (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement) || input.dataset.rbAct !== 'note' || !rbActive) return;
      const run = rbRun(rbActive.id);
      const id = input.closest('[data-step]').dataset.step;
      if (input.value.trim()) run.notes[id] = input.value.trim(); else delete run.notes[id];
      rbSave(rbActive.id, run);
    });
  }

  // Re-render but keep the reader where they were.
  function rbRefresh(stepId) {
    const host = document.getElementById('tab-runbook');
    const body = host && host.closest('.triage-body');
    const scroller = body && body.scrollHeight > body.clientHeight ? body : host;
    const before = scroller ? scroller.scrollTop : 0;
    renderRunbook(rbActive.id);
    if (scroller) scroller.scrollTop = before;
    const el = stepId && host.querySelector(`[data-step="${stepId}"] [data-rb-act]`);
    if (el && document.activeElement === document.body) el.focus({ preventScroll: true });
  }

  function openRunbook(id) {
    openTriageModal();
    const tab = document.querySelector('.triage-tab[data-tab="runbook"]');
    if (tab) tab.click();
    initRunbooks();
    if (id) renderRunbook(id); else renderRunbookPicker();
  }

  // -------------------------------------------------------------
  // COMMAND BAR (desktop)
  // The full header (title, two nav rows, toolbar, topic picker, Rack Targets)
  // is 338px tall and used to be sticky, so on a 900px laptop it covered 38%
  // of the window while reading. It now scrolls away with the page, and once
  // it is gone a slim fixed bar slides in carrying what is used mid-page:
  // in-sheet search, topic, a live target chip and the tool buttons.
  // Every control proxies the real one, so the sheets' own handlers run.
  // -------------------------------------------------------------
  const CBAR_QUERY = '(min-width: 769px)';
  const CBAR_HEIGHT = 60;
  const CBAR_ICONS = {
    all: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.6-4.6"/><path d="M8 11h6M11 8v6"/>',
    triage: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    trail: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
    saved: '<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
    compact: '<path d="M4 6h16M4 10h16M4 14h16M4 18h16"/>',
    top: '<path d="M12 19V5M5 12l7-7 7 7"/>',
    kit: '<path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>'
  };
  const cbarIcon = (n, s = 16) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${CBAR_ICONS[n]}</svg>`;

  function initCommandBar() {
    const header = document.querySelector('.top-bar');
    const realSearch = document.getElementById('search-input');
    if (!header || document.getElementById('command-bar') || !window.IntersectionObserver) return;

    const bar = document.createElement('div');
    bar.id = 'command-bar';
    bar.className = 'cbar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Sheet command bar');
    bar.innerHTML = `
      <div class="cbar-inner">
        <button type="button" class="cbar-title" title="Back to top">
          <span class="cbar-badge" aria-hidden="true"></span>
          <span class="cbar-name"></span>
        </button>
        <label class="cbar-search">
          ${cbarIcon('all', 15).replace('<path d="M8 11h6M11 8v6"/>', '')}
          <input type="search" placeholder="Filter this sheet…" aria-label="Filter commands on this sheet" autocomplete="off" spellcheck="false" />
          <kbd>/</kbd>
        </label>
        <select class="cbar-topic" aria-label="Jump to topic"></select>
        <button type="button" class="cbar-target" aria-haspopup="dialog" aria-expanded="false" title="Rack targets: values filled into every copied command">
          ${cbarIcon('target', 15)}<span class="cbar-target-text">Targets</span>
        </button>
        <div class="cbar-tools">
          <button type="button" class="cbar-btn" data-proxy="global-search-btn" title="Search all sheets (Ctrl+K)">${cbarIcon('all')}</button>
          <button type="button" class="cbar-btn cbar-triage" data-proxy="triage-modal-btn" title="Triage &amp; RMA">${cbarIcon('triage')}</button>
          <button type="button" class="cbar-btn" data-proxy="trail-btn" title="Case trail">${cbarIcon('trail')}<span class="cbar-count" data-count="trail"></span></button>
          <button type="button" class="cbar-btn" data-proxy="saved-filter-btn" title="Saved on this sheet">${cbarIcon('saved')}<span class="cbar-count" data-count="saved"></span></button>
          <button type="button" class="cbar-btn cbar-kit" data-proxy="kit-btn" title="My kit: bookmarks from every sheet">${cbarIcon('kit')}<span class="cbar-count" data-count="kit"></span></button>
          <button type="button" class="cbar-btn" data-proxy="density-toggle" title="Toggle compact view">${cbarIcon('compact')}</button>
          <button type="button" class="cbar-btn cbar-up" title="Back to top">${cbarIcon('top')}</button>
        </div>
      </div>
      <div class="cbar-pop" role="dialog" aria-label="Rack targets" hidden>
        <div class="cbar-pop-head"><b>Rack targets</b><span>Filled into every command you copy</span></div>
        <div class="cbar-pop-grid"></div>
      </div>`;
    document.body.appendChild(bar);
    document.body.classList.add('has-cbar');

    const mq = window.matchMedia(CBAR_QUERY);
    const proxySearch = bar.querySelector('.cbar-search input');
    const topic = bar.querySelector('.cbar-topic');
    const chip = bar.querySelector('.cbar-target');
    const pop = bar.querySelector('.cbar-pop');
    let shown = false;

    function syncIdentity() {
      const h1 = document.querySelector('.top-bar h1');
      bar.querySelector('.cbar-name').textContent = h1 ? h1.textContent.trim() : document.title;
      const badge = document.querySelector('.top-bar .terminal-badge');
      bar.querySelector('.cbar-badge').textContent = badge ? badge.textContent.replace(/\s+/g, '').slice(0, 6) : '$_';
      if (realSearch) proxySearch.placeholder = realSearch.placeholder || 'Filter this sheet…';
    }

    function syncTopics() {
      const real = document.querySelector('.category-bar select');
      topic.hidden = !real;
      if (!real) return;
      topic.innerHTML = real.innerHTML;
      topic.value = real.value;
    }

    function syncCounts() {
      const saved = document.getElementById('saved-count');
      const trail = document.querySelector('.trail-badge');
      const set = (key, el) => {
        const span = bar.querySelector(`[data-count="${key}"]`);
        const n = el ? el.textContent.trim() : '';
        span.textContent = n && n !== '0' ? n : '';
      };
      set('saved', saved);
      set('trail', trail);
      set('kit', document.querySelector('.kit-badge'));
      ['saved-filter-btn', 'density-toggle'].forEach(id => {
        const real = document.getElementById(id);
        const mine = bar.querySelector(`[data-proxy="${id}"]`);
        if (mine) mine.classList.toggle('active', !!(real && (real.classList.contains('active') || real.getAttribute('aria-pressed') === 'true')));
      });
    }

    function syncChip() {
      const v = targetState.vars || {};
      const bits = [];
      if (v.bmc) bits.push(v.bmc);
      if (v.gpu && v.gpu !== DEFAULT_TARGET_VARS.gpu) bits.push(`GPU ${v.gpu}`);
      if (v.hca && v.hca !== DEFAULT_TARGET_VARS.hca) bits.push(v.hca);
      const node = readNodes().active;
      if (node) bits.unshift(node);
      chip.querySelector('.cbar-target-text').textContent = targetState.active ? (bits.join(' · ') || 'Targets') : 'Targets off';
      chip.classList.toggle('is-off', !targetState.active);
      chip.classList.toggle('is-custom', !!(v.bmc && v.bmc !== DEFAULT_TARGET_VARS.bmc));
    }

    function show(on) {
      if (on === shown) return;
      shown = on;
      bar.classList.toggle('show', on);
      document.body.classList.toggle('cbar-on', on);
      if (on) { syncIdentity(); syncTopics(); syncCounts(); syncChip(); if (realSearch) proxySearch.value = realSearch.value; }
      else closePop();
    }

    // The bar appears once the real header has fully scrolled away. While you are
    // filtering from it (or editing targets) it stays, even if the results get short.
    const pinned = () => document.activeElement === proxySearch || !!proxySearch.value || !pop.hidden;
    function evaluate() {
      const r = header.getBoundingClientRect();
      const want = mq.matches && r.bottom <= CBAR_HEIGHT;   // gone, or tucked behind the bar
      if (!want && pinned() && mq.matches) return;
      show(want);
    }
    const io = new IntersectionObserver(evaluate, { rootMargin: `-${CBAR_HEIGHT}px 0px 0px 0px` });
    io.observe(header);
    proxySearch.addEventListener('blur', () => setTimeout(() => { syncFiltering(); evaluate(); }, 0));
    function syncFiltering() {
      document.body.classList.toggle('cbar-filtering', document.activeElement === proxySearch || !!proxySearch.value);
    }
    proxySearch.addEventListener('focus', syncFiltering);
    mq.addEventListener ? mq.addEventListener('change', () => { if (!mq.matches) show(false); }) : null;

    // ---- search proxy
    function scrollResultsIntoView() {
      const main = document.querySelector('main') || document.querySelector('.main-layout');
      if (!main) return;
      const top = main.getBoundingClientRect().top + window.scrollY - 64;
      if (Math.abs(window.scrollY - top) > 4) window.scrollTo({ top, behavior: 'auto' });
    }
    proxySearch.addEventListener('input', () => {
      syncFiltering();
      if (!realSearch) return;
      realSearch.value = proxySearch.value;
      realSearch.dispatchEvent(new Event('input', { bubbles: true }));
      realSearch.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: proxySearch.value.slice(-1) || 'Backspace' }));
      requestAnimationFrame(scrollResultsIntoView);
    });
    proxySearch.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        if (proxySearch.value) { proxySearch.value = ''; proxySearch.dispatchEvent(new Event('input')); }
        else proxySearch.blur();
      }
    });
    if (realSearch) realSearch.addEventListener('input', () => { if (document.activeElement !== proxySearch) proxySearch.value = realSearch.value; });

    // "/" would focus the real search box and scroll the page back to the top.
    window.addEventListener('keydown', (e) => {
      if (!shown || e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      proxySearch.focus();
      proxySearch.select();
    }, true);

    // ---- topic proxy
    topic.addEventListener('change', () => {
      const real = document.querySelector('.category-bar select');
      if (!real) return;
      real.value = topic.value;
      real.dispatchEvent(new Event('change', { bubbles: true }));
      requestAnimationFrame(scrollResultsIntoView);
    });

    // ---- tool proxies
    bar.addEventListener('click', (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const proxy = el.closest('[data-proxy]');
      if (proxy) {
        const real = document.getElementById(proxy.dataset.proxy);
        if (real) real.click();
        setTimeout(syncCounts, 50);
        if (proxy.dataset.proxy === 'saved-filter-btn') requestAnimationFrame(scrollResultsIntoView);
        return;
      }
      if (el.closest('.cbar-up, .cbar-title')) window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });

    // ---- target chip → quick editor that drives the real Rack Targets inputs
    function buildPop() {
      const grid = pop.querySelector('.cbar-pop-grid');
      grid.innerHTML = '';
      document.querySelectorAll('#target-vars-container .target-field').forEach(field => {
        const real = field.querySelector('input');
        const label = field.querySelector('label');
        if (!real) return;
        const wrap = document.createElement('label');
        wrap.className = 'cbar-field';
        wrap.innerHTML = `<span>${label ? label.innerHTML : escapeHtml(real.id)}</span>`;
        const input = document.createElement('input');
        input.type = real.type === 'password' ? 'password' : 'text';
        input.value = real.value;
        input.placeholder = real.placeholder;
        input.spellcheck = false;
        input.autocomplete = 'off';
        const realId = real.id;
        input.addEventListener('input', () => {
          const target = document.getElementById(realId) || real;   // the bar may have re-rendered
          target.value = input.value;
          target.dispatchEvent(new Event('input', { bubbles: true }));
          target.dispatchEvent(new Event('change', { bubbles: true }));
          syncChip();
        });
        wrap.appendChild(input);
        grid.appendChild(wrap);
      });
      const active = document.getElementById('target-active-toggle');
      if (active) {
        const row = document.createElement('label');
        row.className = 'cbar-active';
        row.innerHTML = `<input type="checkbox" ${active.checked ? 'checked' : ''}/> Substitute these into copied commands`;
        row.querySelector('input').addEventListener('change', (ev) => {
          const toggle = document.getElementById('target-active-toggle') || active;
          toggle.checked = ev.target.checked;
          toggle.dispatchEvent(new Event('change', { bubbles: true }));
          syncChip();
        });
        grid.appendChild(row);
      }
    }
    function openPop() {
      buildPop();
      pop.hidden = false;
      chip.setAttribute('aria-expanded', 'true');
      const first = pop.querySelector('input');
      if (first) first.focus();
    }
    function closePop() {
      if (pop.hidden) return;
      pop.hidden = true;
      chip.setAttribute('aria-expanded', 'false');
      setTimeout(evaluate, 0);
    }
    chip.addEventListener('click', () => (pop.hidden ? openPop() : closePop()));
    pop.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); closePop(); chip.focus(); } });
    document.addEventListener('click', (e) => {
      if (!pop.hidden && e.target instanceof Node && !pop.contains(e.target) && !chip.contains(e.target)) closePop();
    });

    // Badges and the Rack Targets bar are re-rendered by other code; follow them.
    const watch = new MutationObserver(() => { if (shown) { syncCounts(); syncChip(); } });
    ['saved-count'].forEach(id => { const el = document.getElementById(id); if (el) watch.observe(el, { childList: true, characterData: true, subtree: true }); });
    document.querySelectorAll('.trail-badge, .kit-badge').forEach(el => watch.observe(el, { childList: true, characterData: true, subtree: true }));
    const tv = document.getElementById('target-vars-container');
    if (tv) watch.observe(tv, { childList: true, subtree: true });
    document.addEventListener('input', (e) => { if (shown && e.target instanceof Element && e.target.closest('#target-vars-container')) syncChip(); });
    // The portable build swaps sheets in place.
    const h1 = document.querySelector('.top-bar h1');
    if (h1) new MutationObserver(() => { syncIdentity(); syncTopics(); }).observe(h1, { childList: true, characterData: true, subtree: true });
  }

  // -------------------------------------------------------------
  // CASE TRAIL
  // Every command copied anywhere in the suite is logged with the time, the
  // sheet it came from and the Rack Targets filled in, so the tech can hand a
  // ticket an exact record of what was run instead of rebuilding it from memory.
  // The BMC password is never written: entries are re-substituted with the
  // password left as $BMC_PASS. Stored in localStorage (this browser only).
  // -------------------------------------------------------------
  const TRAIL_KEY = 'dc_case_trail';
  const TRAIL_META_KEY = 'dc_case_trail_meta';
  const TRAIL_MAX = 300;
  let trailSkip = false;

  function readTrail() {
    try {
      const list = JSON.parse(localStorage.getItem(TRAIL_KEY) || '[]');
      return Array.isArray(list) ? list.filter(e => e && typeof e.cmd === 'string') : [];
    } catch (e) { return []; }
  }
  function writeTrail(list) {
    try { localStorage.setItem(TRAIL_KEY, JSON.stringify(list.slice(-TRAIL_MAX))); } catch (e) {}
  }
  function trailMeta() {
    try { return Object.assign({ caseId: '', paused: false, introduced: false }, JSON.parse(localStorage.getItem(TRAIL_META_KEY) || '{}')); }
    catch (e) { return { caseId: '', paused: false, introduced: false }; }
  }
  function saveTrailMeta(patch) {
    try { localStorage.setItem(TRAIL_META_KEY, JSON.stringify(Object.assign(trailMeta(), patch))); } catch (e) {}
  }

  function trailSafeText(text) {
    const pass = targetState.pass;
    targetState.pass = '';
    let safe;
    try { safe = substituteVariables(text).text; } finally { targetState.pass = pass; }
    // Belt and braces: a password typed straight into a command is masked too.
    if (pass && pass.length >= 4) safe = safe.split(pass).join('$BMC_PASS');
    return safe.replace(/^ /, '');
  }

  function currentSheetName() {
    const file = anatSheetFile || window.location.pathname.split('/').pop() || 'index.html';
    return file.replace(/\.html$/, '').replace(/^index$/, 'linux');
  }

  function recordTrail(text) {
    if (trailSkip || !text || String(text).length > 4000) return;
    const meta = trailMeta();
    if (meta.paused) return;
    const cmd = trailSafeText(String(text));
    const list = readTrail();
    const last = list[list.length - 1];
    if (last && last.cmd === cmd && Date.now() - last.t < 5000) return;
    list.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), t: Date.now(), cmd, sheet: currentSheetName(), note: '' });
    writeTrail(list);
    refreshTrailUi(true);
    if (!meta.introduced) {
      saveTrailMeta({ introduced: true });
      setTimeout(() => showGlobalToast('Saved to your Case Trail. Open "Trail" to turn what you ran into ticket notes.'), 900);
    }
  }

  function trailTargetsSummary() {
    const v = targetState.vars || {};
    const parts = [];
    if (v.bmc && v.bmc !== DEFAULT_TARGET_VARS.bmc) parts.push(`BMC ${v.bmc}`);
    if (v.iface && v.iface !== DEFAULT_TARGET_VARS.iface) parts.push(`iface ${v.iface}`);
    if (v.hca && v.hca !== DEFAULT_TARGET_VARS.hca) parts.push(`HCA ${v.hca}`);
    if (v.disk && v.disk !== DEFAULT_TARGET_VARS.disk) parts.push(`disk ${v.disk}`);
    if (v.gpu && v.gpu !== DEFAULT_TARGET_VARS.gpu) parts.push(`GPU ${v.gpu}`);
    return parts.join(' · ');
  }

  const pad2 = n => String(n).padStart(2, '0');
  const trailTime = t => { const d = new Date(t); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`; };
  const trailDate = t => { const d = new Date(t); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };

  function trailMarkdown(list, heading = '###') {
    const meta = trailMeta();
    const targets = trailTargetsSummary();
    const now = Date.now();
    const lines = [
      `${heading} Command trail${meta.caseId ? ` — ${meta.caseId}` : ''}`,
      `_${list.length} command${list.length === 1 ? '' : 's'} · exported ${trailDate(now)} ${trailTime(now).slice(0, 5)} local${targets ? ` · targets: ${targets}` : ''}_`,
      ''
    ];
    let day = '';
    list.forEach((e, i) => {
      const d = trailDate(e.t);
      if (d !== day) { day = d; if (new Set(list.map(x => trailDate(x.t))).size > 1) lines.push(`**${d}**`, ''); }
      lines.push(`${i + 1}. \`${trailTime(e.t)}\` · ${e.sheet}`, '   ```bash', ...e.cmd.split('\n').map(l => `   ${l}`), '   ```');
      if (e.note) lines.push(`   → ${e.note}`);
      lines.push('');
    });
    return lines.join('\n').trim();
  }

  let trailDrawer = null;
  function trailDayLabel(t) {
    const d = trailDate(t);
    const today = trailDate(Date.now());
    const yesterday = trailDate(Date.now() - 864e5);
    return d === today ? 'Today' : d === yesterday ? 'Yesterday' : d;
  }

  function renderTrailList() {
    if (!trailDrawer) return;
    const list = readTrail();
    const box = trailDrawer.querySelector('.trail-list');
    trailDrawer.querySelector('.trail-count').textContent = list.length;
    trailDrawer.querySelectorAll('.trail-foot button[data-act="md"], .trail-foot button[data-act="plain"], .trail-foot button[data-act="clear"]').forEach(b => { b.disabled = !list.length; });
    const targets = trailTargetsSummary();
    trailDrawer.querySelector('.trail-targets').innerHTML = targets
      ? `<span>Targets</span>${escapeHtml(targets)}`
      : '<span>Targets</span>none set: commands keep their $BMC / $GPU placeholders';
    if (!list.length) {
      box.innerHTML = `
        <div class="trail-empty">
          <div class="trail-empty-icon" aria-hidden="true">⌁</div>
          <p><b>Nothing yet.</b> Copy any command on any sheet, or from Ctrl+K or the Symptom Decoder, and it lands here with a timestamp.</p>
          <p>When you're done, <b>Copy ticket notes</b> gives you a Markdown record of exactly what you ran, in order, ready for the ticket or <code>cases/&lt;host&gt;/summary.md</code>.</p>
        </div>`;
      return;
    }
    let html = '';
    let day = '';
    list.slice().reverse().forEach(e => {
      const label = trailDayLabel(e.t);
      if (label !== day) { day = label; html += `<li class="trail-day">${escapeHtml(label)}</li>`; }
      html += `
        <li class="trail-entry" data-id="${escapeHtml(e.id)}">
          <div class="trail-meta">
            <time datetime="${new Date(e.t).toISOString()}">${trailTime(e.t)}</time>
            <span class="trail-sheet">${escapeHtml(e.sheet || '')}</span>
            <span class="trail-actions">
              <button type="button" data-act="note" title="Add what it showed">${e.note ? 'Edit note' : '+ Note'}</button>
              <button type="button" data-act="copy" title="Copy again">Copy</button>
              <button type="button" data-act="del" title="Remove from trail" aria-label="Remove from trail">✕</button>
            </span>
          </div>
          <code class="trail-cmd">${escapeHtml(e.cmd)}</code>
          <input type="text" class="trail-note ${e.note ? '' : 'hidden'}" value="${escapeHtml(e.note || '')}" placeholder="What did it show? e.g. PSU2 AC lost at 14:20" aria-label="Note for this command" />
        </li>`;
    });
    box.innerHTML = `<ol class="trail-entries">${html}</ol>`;
  }

  function refreshTrailUi(pulse) {
    const n = readTrail().length;
    document.querySelectorAll('.trail-badge').forEach(b => {
      b.textContent = n;
      if (pulse) { b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse'); }
    });
    if (trailDrawer && trailDrawer.classList.contains('open')) renderTrailList();
    const rmaCount = document.getElementById('rma-trail-count');
    if (rmaCount) rmaCount.textContent = n;
  }

  function trailCopy(text, msg) {
    trailSkip = true;
    Promise.resolve(copyVerbatim(text)).then(() => showGlobalToast(msg), () => showGlobalToast('Copy failed: select the text and copy it by hand.'));
    trailSkip = false;
  }

  function buildTrailDrawer() {
    const scrim = document.createElement('div');
    scrim.className = 'trail-scrim';
    trailDrawer = document.createElement('aside');
    trailDrawer.className = 'trail-drawer';
    trailDrawer.setAttribute('role', 'dialog');
    trailDrawer.setAttribute('aria-modal', 'true');
    trailDrawer.setAttribute('aria-labelledby', 'trail-title');
    trailDrawer.innerHTML = `
      <header class="trail-head">
        <div>
          <h2 id="trail-title">Case trail <span class="trail-count">0</span></h2>
          <p>Every command you copy, in order, with your targets filled in. Passwords are never stored. Kept in this browser only.</p>
        </div>
        <button type="button" class="trail-close" aria-label="Close case trail">✕</button>
      </header>
      <div class="trail-case">
        <label class="trail-case-id">Ticket / host
          <input type="text" id="trail-case-id" placeholder="INC-48213 · gpu-node-07" autocomplete="off" spellcheck="false" />
        </label>
        <label class="trail-rec" title="Pause to stop logging copies">
          <input type="checkbox" id="trail-recording" /> <span>Recording</span>
        </label>
      </div>
      <div class="trail-targets"></div>
      <div class="trail-list"></div>
      <footer class="trail-foot">
        <button type="button" class="trail-primary" data-act="md">Copy ticket notes</button>
        <button type="button" data-act="plain">Copy commands</button>
        <button type="button" class="trail-danger" data-act="clear">Clear</button>
      </footer>`;
    document.body.append(scrim, trailDrawer);

    const meta = trailMeta();
    const caseInput = trailDrawer.querySelector('#trail-case-id');
    const rec = trailDrawer.querySelector('#trail-recording');
    caseInput.value = meta.caseId;
    rec.checked = !meta.paused;
    caseInput.addEventListener('input', () => saveTrailMeta({ caseId: caseInput.value.trim() }));
    rec.addEventListener('change', () => {
      saveTrailMeta({ paused: !rec.checked });
      trailDrawer.classList.toggle('paused', !rec.checked);
    });
    trailDrawer.classList.toggle('paused', !!meta.paused);

    const close = () => closeTrail();
    scrim.addEventListener('click', close);
    trailDrawer.querySelector('.trail-close').addEventListener('click', close);
    trailDrawer.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });

    trailDrawer.addEventListener('click', (e) => {
      const btn = e.target instanceof Element ? e.target.closest('button[data-act]') : null;
      if (!btn) return;
      const act = btn.dataset.act;
      const entryEl = btn.closest('.trail-entry');
      const list = readTrail();
      if (act === 'md') return trailCopy(trailMarkdown(list), `Copied ticket notes (${list.length} commands).`);
      if (act === 'plain') return trailCopy(list.map(x => x.cmd).join('\n'), `Copied ${list.length} commands.`);
      if (act === 'clear') {
        if (btn.dataset.confirm !== '1') {
          btn.dataset.confirm = '1';
          btn.textContent = 'Clear all?';
          setTimeout(() => { btn.dataset.confirm = ''; btn.textContent = 'Clear'; }, 2500);
          return;
        }
        writeTrail([]);
        btn.dataset.confirm = '';
        btn.textContent = 'Clear';
        return refreshTrailUi(false), renderTrailList();
      }
      if (!entryEl) return;
      const entry = list.find(x => x.id === entryEl.dataset.id);
      if (!entry) return;
      if (act === 'copy') trailCopy(entry.cmd, 'Copied again.');
      if (act === 'del') { writeTrail(list.filter(x => x !== entry)); refreshTrailUi(false); renderTrailList(); }
      if (act === 'note') {
        const input = entryEl.querySelector('.trail-note');
        input.classList.remove('hidden');
        input.focus();
      }
    });
    trailDrawer.addEventListener('input', (e) => {
      const input = e.target;
      if (!(input instanceof HTMLInputElement) || !input.classList.contains('trail-note')) return;
      const list = readTrail();
      const entry = list.find(x => x.id === input.closest('.trail-entry').dataset.id);
      if (entry) { entry.note = input.value.trim(); writeTrail(list); }
    });
    trailDrawer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.classList.contains('trail-note')) e.target.blur();
    });
    trailDrawer._scrim = scrim;
  }

  let trailFocus = null;
  function openTrail() {
    if (!trailDrawer) buildTrailDrawer();
    trailFocus = document.activeElement;
    renderTrailList();
    trailDrawer.classList.add('open');
    trailDrawer._scrim.classList.add('show');
    document.body.style.overflow = 'hidden';
    setTimeout(() => trailDrawer.querySelector('.trail-close').focus(), 50);
  }
  function closeTrail() {
    if (!trailDrawer || !trailDrawer.classList.contains('open')) return;
    trailDrawer.classList.remove('open');
    trailDrawer._scrim.classList.remove('show');
    document.body.style.overflow = '';
    if (trailFocus && trailFocus.focus) trailFocus.focus();
  }

  function initCaseTrail() {
    const actions = document.querySelector('.header-actions');
    if (actions && !document.getElementById('trail-btn')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'trail-btn';
      btn.className = 'action-btn trail-header-btn';
      btn.title = 'Case trail: every command you copied, ready for the ticket';
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>
        </svg>
        <span>Trail</span>
        <span class="count-badge trail-badge">0</span>`;
      btn.addEventListener('click', openTrail);
      const saved = document.getElementById('saved-filter-btn');
      if (saved && saved.parentNode === actions) saved.after(btn);
      else actions.appendChild(btn);
    }
    refreshTrailUi(false);
    // Another tab (or page) added to the trail.
    window.addEventListener('storage', (e) => { if (e.key === TRAIL_KEY) refreshTrailUi(false); });
  }

  // -------------------------------------------------------------
  // COMMAND ANATOMY
  // Commands used to render as one clipped line, so the end of a pipeline
  // (often the part that matters) was never visible before copying. Each
  // command box is re-rendered for reading: one pipeline stage per line with
  // the operator in a gutter, wrapped arguments, and every flag that the card
  // explains linked to its explanation (hover the flag, or hover the pill).
  // Display only: every sheet copies from data-cmd / data-copy, never from
  // the rendered text.
  // -------------------------------------------------------------
  const ANAT_BREAK_AT = 46;           // characters before a pipeline gets one stage per line
  const ANAT_PREFIXES = /^(sudo|env|time|nohup|watch|exec|xargs|nice|ionice|timeout|stdbuf|-\S+|\d+(\.\d+)?[smh]?)$/;

  // Split at top-level shell operators, ignoring anything inside quotes, $(), {}, () or [].
  function anatSplit(cmd) {
    const parts = [];
    let buf = '', quote = null, depth = 0, op = '';
    for (let i = 0; i < cmd.length; i++) {
      const c = cmd[i], next = cmd[i + 1];
      if (c === '\\' && quote !== "'") { buf += c + (next || ''); i++; continue; }
      if (quote) { if (c === quote) quote = null; buf += c; continue; }
      if (c === "'" || c === '"' || c === '`') { quote = c; buf += c; continue; }
      if ('({['.includes(c)) depth++;
      if (')}]'.includes(c)) depth = Math.max(0, depth - 1);
      if (!depth) {
        const two = c + (next || '');
        const found = two === '&&' || two === '||' ? two : two === '|&' ? two : (c === '|' || c === ';') ? c : '';
        if (found) {
          if (buf.trim()) parts.push({ op, text: buf.trim() });
          op = found; buf = '';
          i += found.length - 1;
          continue;
        }
      }
      buf += c;
    }
    if (buf.trim()) parts.push({ op, text: buf.trim() });
    return parts;
  }

  // Keymaps, editor motions, code in other languages and diagrams are not shell commands:
  // they must not get a $ prompt or be split at | and ;.
  // Hoisted: setSheetContext() runs at startup, before this line is reached.
  var anatSheetFile;
  const ANAT_SKIP_SHEETS = /^(neovim|nvim-|markdown|regex|json|yaml|toml|lua|python|javascript|typescript|sql|jira|omarchy|macos-(finder-keys|system-keys|text-editing|trackpad)|win-shortcuts|fiber|motherboards)/;
  function anatLooksShell(raw) {
    if (ANAT_SKIP_SHEETS.test(anatSheetFile || window.location.pathname.split('/').pop() || '')) return false;
    if (/[⌘⌥⌃⇧⌫←→↑↓─►▸•]/.test(raw)) return false;
    if (/^(<|#|>|\[|\/\/|--\s|POST\b)/.test(raw)) return false;
    if (/^(Win|Ctrl|Alt|Shift|Cmd|Super)\s*\+/i.test(raw)) return false;
    const first = raw.trim().split(/\s+/)[0];
    return /^[\w.\/~$-]+$/.test(first) && /[a-z]/i.test(first);
  }

  // A newline outside quotes means a multi-line script; inside quotes it is just data (curl -w '...\n').
  function anatBareNewline(cmd) {
    let quote = null;
    for (const c of cmd) {
      if (quote) { if (c === quote) quote = null; continue; }
      if (c === "'" || c === '"') quote = c;
      else if (c === '\n') return true;
    }
    return false;
  }

  function anatWords(stage) {
    const words = [];
    let buf = '', quote = null, depth = 0;
    for (let i = 0; i < stage.length; i++) {
      const c = stage[i];
      if (c === '\\' && quote !== "'") { buf += c + (stage[i + 1] || ''); i++; continue; }
      if (quote) { if (c === quote) quote = null; buf += c; continue; }
      if (c === "'" || c === '"') { quote = c; buf += c; continue; }
      if ('({['.includes(c)) depth++;
      if (')}]'.includes(c)) depth = Math.max(0, depth - 1);
      if (/\s/.test(c) && !depth) { if (buf) { words.push(buf); buf = ''; } continue; }
      buf += c;
    }
    if (buf) words.push(buf);
    return words;
  }

  // Flag explanations already on the card, keyed by flag: "-r / -R", "-C 3", "topo -m", "--query-gpu=...".
  function anatFlagMap(item) {
    const map = new Map();
    const pills = item ? Array.from(item.querySelectorAll('.flag-pill')) : [];
    pills.forEach((pill, idx) => {
      const tokEl = pill.querySelector('.flag-token, code, strong');
      if (!tokEl) return;
      const label = tokEl.textContent.trim();
      const desc = (pill.querySelector('.flag-desc') || pill.querySelector('span:last-child') || pill).textContent.trim();
      pill.dataset.anatIdx = String(idx);
      label.split(/\s*[\/,]\s*|\s+/).forEach(word => {
        if (!/^--?[A-Za-z0-9]/.test(word)) return;
        const key = word.replace(/[=<\[{(].*$/, '');
        if (key.length > 1 && !map.has(key)) map.set(key, { idx, label, desc });
      });
    });
    return map;
  }

  function anatLookup(word, map) {
    if (!map.size || !/^-/.test(word)) return [];
    const base = word.replace(/=.*$/, '');
    if (map.has(base)) return [{ key: base, ...map.get(base) }];
    // Bundled short flags: -rnIE explains as -r, -n, -I and -E.
    if (/^-[A-Za-z]{2,}$/.test(base)) {
      return base.slice(1).split('').map(ch => map.has('-' + ch) ? { key: '-' + ch, ...map.get('-' + ch) } : null).filter(Boolean);
    }
    return [];
  }

  function anatStageHtml(stage, map) {
    let seenCmd = false;
    let cmdName = '';
    let prev = '';
    return anatWords(stage).map(word => {
      const ctx = { gpuIndexNext: cmdName === 'nvidia-smi' && prev === '-i' };
      prev = word;
      let cls = 'anat-arg';
      if (/^['"]/.test(word)) cls = 'anat-str';
      else if (/^-/.test(word)) cls = 'anat-flag';
      else if (/^\w+=/.test(word) && !seenCmd) cls = 'anat-var';
      else if (!seenCmd && !ANAT_PREFIXES.test(word) && !/^[<>]/.test(word)) { cls = 'anat-cmd'; seenCmd = true; cmdName = word; }
      else if (/^(sudo|env|time|nohup|watch|xargs|timeout)$/.test(word)) cls = 'anat-cmd anat-pre';
      else if (/\$/.test(word)) cls = 'anat-var';
      else if (/^[0-9]*[<>]/.test(word)) cls = 'anat-redir';

      const hits = anatLookup(word, map);
      const inner = slotHtml(word, ctx);
      if (!hits.length) return `<span class="${cls}">${inner}</span>`;
      const tip = hits.map(h => `${h.key}\u0001${h.desc}`).join('\u0002');
      const idx = [...new Set(hits.map(h => h.idx))].join(',');
      return `<span class="${cls} anat-known" data-anat-pills="${idx}" data-anat-tip="${escapeHtml(tip)}">${inner}</span>`;
    }).join(' ');
  }

  function renderAnatomy(box) {
    if (box.dataset.anat || box.classList.contains('is-reference')) return;
    const codeEl = box.querySelector('.cmd-code');
    if (!codeEl || codeEl.querySelector('mark')) return;
    const copied = box.dataset.cmd ?? box.dataset.copy;
    if (!copied || anatBareNewline(copied)) return;   // real multi-line scripts keep their own layout
    // Some sheets copy only the first of several alternatives they display. Render what was shown.
    const shown = codeEl.textContent.trim();
    const raw = shown.replace(/\s+/g, ' ') === copied.replace(/\s+/g, ' ').trim() ? copied : shown;
    if (anatBareNewline(raw) || !anatLooksShell(raw)) return;
    box.dataset.anat = '1';

    const map = anatFlagMap(box.closest('.cmd-item'));
    // "   |   " separates alternative commands in this suite, not a pipe.
    const alternatives = raw.split(/\s{3}\|\s{3}/).map(s => s.trim()).filter(Boolean);
    const lines = [];
    alternatives.forEach((alt, ai) => {
      const stages = anatSplit(alt);
      const breakUp = alt.length > ANAT_BREAK_AT && stages.length > 1;
      if (breakUp) {
        stages.forEach((st, si) => lines.push({ op: si === 0 ? (ai ? 'or' : '') : st.op, html: anatStageHtml(st.text, map) }));
      } else {
        const html = stages.map((st, si) => (si ? `<span class="anat-op-inline">${escapeHtml(st.op)}</span> ` : '') + anatStageHtml(st.text, map)).join(' ');
        lines.push({ op: ai ? 'or' : '', html });
      }
    });
    const gutter = lines.some(l => l.op);
    const danger = DANGER_RE.test(raw);
    const inner = (danger ? '<span class="danger-tag" aria-label="Changes state">⚠ Changes state · drain &amp; get approval first</span>' : '')
      + lines.map(l => `<span class="anat-line">${gutter ? `<span class="anat-op">${escapeHtml(l.op)}</span>` : ''}<span class="anat-body">${l.html}</span></span>`).join('');
    if (danger) box.classList.add('anat-danger');
    const target = codeEl.tagName === 'PRE' ? codeEl : codeEl;
    target.innerHTML = codeEl.tagName === 'PRE' ? `<code>${inner}</code>` : inner;
    codeEl.classList.add('anat', gutter ? 'anat-gutter' : 'anat-flat');
    box.classList.add('anat-on');
    if (map.size) box.closest('.cmd-item')?.classList.add('anat-linked');
  }

  let anatTip = null;
  function showAnatTip(el) {
    if (!anatTip) {
      anatTip = document.createElement('div');
      anatTip.className = 'anat-tip';
      anatTip.setAttribute('role', 'tooltip');
      document.body.appendChild(anatTip);
    }
    anatTip.innerHTML = el.dataset.anatTip.split('\u0002').map(entry => {
      const [key, desc] = entry.split('\u0001');
      return `<div class="anat-tip-row"><code>${escapeHtml(key)}</code><span>${escapeHtml(desc)}</span></div>`;
    }).join('');
    anatTip.classList.add('show');
    const r = el.getBoundingClientRect();
    const t = anatTip.getBoundingClientRect();
    let left = Math.min(Math.max(8, r.left + r.width / 2 - t.width / 2), window.innerWidth - t.width - 8);
    let top = r.top - t.height - 8;
    if (top < 8) top = r.bottom + 8;
    anatTip.style.left = `${left}px`;
    anatTip.style.top = `${top}px`;
  }

  function anatHighlight(item, indices, on) {
    if (!item) return;
    indices.forEach(i => {
      item.querySelectorAll(`.flag-pill[data-anat-idx="${i}"]`).forEach(p => p.classList.toggle('anat-hot', on));
      item.querySelectorAll('.anat-known').forEach(tok => {
        if (tok.dataset.anatPills.split(',').includes(i)) tok.classList.toggle('anat-hot', on);
      });
    });
  }

  function initSlots() {
    // A chip edits its value instead of copying the whole command. Capture phase
    // runs before the sheets' own copy handlers.
    window.addEventListener('click', (e) => {
      const chip = e.target instanceof Element ? e.target.closest('.slot[data-slot]') : null;
      if (chip) {
        e.preventDefault();
        e.stopImmediatePropagation();
        openSlotEditor(chip);
        return;
      }
      const box = e.target instanceof Element ? e.target.closest('.cmd-code-box.anat-danger') : null;
      if (box) setTimeout(() => showGlobalToast('⚠ State-changing command copied: confirm the node is drained and the action approved before running it.'), 2400);
    }, true);
    window.addEventListener('keydown', (e) => {
      const xid = e.target instanceof Element ? e.target.closest('.xid-link') : null;
      if (xid && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openGlobalSearch(`xid ${xid.dataset.xid}`); return; }
      const chip = e.target instanceof Element ? e.target.closest('.slot[data-slot]') : null;
      if (chip && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); e.stopImmediatePropagation(); openSlotEditor(chip); }
    }, true);
    // Rack Targets edited in the bar, the command bar popover, Field Mode or Reset.
    document.addEventListener('input', (e) => { if (e.target instanceof Element && e.target.closest('#target-vars-container')) refreshSlots(); });
    document.addEventListener('change', (e) => { if (e.target instanceof Element && e.target.closest('#target-vars-container')) setTimeout(refreshSlots, 0); });
    document.addEventListener('click', (e) => { if (e.target instanceof Element && e.target.closest('#target-reset-btn')) setTimeout(refreshSlots, 0); });
    window.addEventListener('storage', (e) => { if (e.key === SLOT_STORE_KEY || e.key === 'dc_target_vars') refreshSlots(); });
  }

  function initCommandAnatomy() {
    initSlots();
    // Returns whether anything new was rendered, so layout only repacks when it has to.
    const run = () => {
      const fresh = document.querySelectorAll('.cmd-code-box:not([data-anat])');
      fresh.forEach(renderAnatomy);
      return fresh.length > 0;
    };
    run();
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      // Repacking moves cards between masonry columns, which drops keyboard focus and costs a
      // full layout; only do it when new command boxes were actually rendered.
      requestAnimationFrame(() => { queued = false; if (run()) repack(); });
    }).observe(document.body, { childList: true, subtree: true });
    repack();

    document.addEventListener('mouseover', (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const tok = el.closest('.anat-known');
      const pill = el.closest('.anat-linked .flag-pill[data-anat-idx]');
      if (tok) {
        showAnatTip(tok);
        anatHighlight(tok.closest('.cmd-item'), tok.dataset.anatPills.split(','), true);
      } else if (pill) {
        anatHighlight(pill.closest('.cmd-item'), [pill.dataset.anatIdx], true);
      }
    });
    document.addEventListener('mouseout', (e) => {
      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const tok = el.closest('.anat-known');
      const pill = el.closest('.anat-linked .flag-pill[data-anat-idx]');
      if (tok) {
        if (anatTip) anatTip.classList.remove('show');
        anatHighlight(tok.closest('.cmd-item'), tok.dataset.anatPills.split(','), false);
      } else if (pill) {
        anatHighlight(pill.closest('.cmd-item'), [pill.dataset.anatIdx], false);
      }
    });
    window.addEventListener('scroll', () => anatTip && anatTip.classList.remove('show'), { passive: true });
  }

  // -------------------------------------------------------------
  // FIELD MODE: phone layout for the cold aisle.
  // Below 768px the header chrome (sheet nav, action buttons, Rack Targets)
  // used to fill the first screen and a half before any command showed.
  // Field Mode moves those into slide-up sheets behind a thumb dock, so the
  // first screen is the sheet's search and its commands.
  // -------------------------------------------------------------
  const FIELD_QUERY = '(max-width: 768px)';
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.6-4.6"/>',
    sheets: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    targets: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
    triage: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    more: '<circle cx="5" cy="12" r="1.4" fill="currentColor"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/><circle cx="19" cy="12" r="1.4" fill="currentColor"/>'
  };

  function dockIcon(name) {
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
  }

  function initFieldDock() {
    if (document.getElementById('field-dock') || !window.matchMedia) return;
    const nav = document.querySelector('.sheet-switcher');
    const actions = document.querySelector('.header-actions');
    if (!nav && !actions) return;

    const dock = document.createElement('nav');
    dock.id = 'field-dock';
    dock.className = 'fd-dock';
    dock.setAttribute('aria-label', 'Quick actions');
    dock.innerHTML = `
      <button type="button" class="fd-btn" data-fd="search">${dockIcon('search')}<span>Search</span></button>
      <button type="button" class="fd-btn" data-fd="sheets" aria-controls="fd-sheet-sheets">${dockIcon('sheets')}<span>Sheets</span></button>
      <button type="button" class="fd-btn fd-btn-targets" data-fd="targets" aria-controls="fd-sheet-targets">${dockIcon('targets')}<span class="fd-target-label">Targets</span></button>
      <button type="button" class="fd-btn fd-btn-triage" data-fd="triage">${dockIcon('triage')}<span>Triage</span></button>
      <button type="button" class="fd-btn" data-fd="more" aria-controls="fd-sheet-more">${dockIcon('more')}<span>Tools</span></button>`;

    const scrim = document.createElement('div');
    scrim.className = 'fd-scrim';

    function makeSheet(id, title, extra = '') {
      const el = document.createElement('section');
      el.id = id;
      el.className = 'fd-sheet';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-label', title);
      el.innerHTML = `
        <div class="fd-grabber" aria-hidden="true"></div>
        <div class="fd-sheet-head"><h2>${title}</h2><button type="button" class="fd-close" aria-label="Close">✕</button></div>
        ${extra}
        <div class="fd-sheet-body"></div>`;
      el.querySelector('.fd-close').addEventListener('click', closeSheets);
      return el;
    }

    const sheetsPanel = makeSheet('fd-sheet-sheets', 'Jump to a sheet',
      '<div class="fd-filter"><input type="search" placeholder="Filter sheets… (mlxlink, sel, nvme)" aria-label="Filter sheets" autocomplete="off" spellcheck="false"></div>');
    const targetsPanel = makeSheet('fd-sheet-targets', 'Rack targets');
    const morePanel = makeSheet('fd-sheet-more', 'Tools & view');
    document.body.append(scrim, sheetsPanel, targetsPanel, morePanel, dock);

    // Remember where moved nodes live so desktop gets them back untouched.
    const homes = new Map();
    function borrow(node, into) {
      if (!node || node.parentNode === into) return;
      if (!homes.has(node)) {
        const marker = document.createComment('field-dock-home');
        node.parentNode.insertBefore(marker, node);
        homes.set(node, marker);
      }
      into.appendChild(node);
    }
    function giveBack() {
      homes.forEach((marker, node) => {
        if (marker.parentNode) marker.parentNode.insertBefore(node, marker.nextSibling);
      });
    }

    let openSheet = null;
    let lastFocus = null;
    function open(panel) {
      if (openSheet === panel) return closeSheets();
      closeSheets(false);
      lastFocus = document.activeElement;
      openSheet = panel;
      document.body.classList.add('fd-locked');
      scrim.classList.add('show');
      panel.classList.add('show');
      dock.querySelectorAll('.fd-btn').forEach(b => b.classList.toggle('active', b.getAttribute('aria-controls') === panel.id));
      const focusEl = panel.querySelector('.fd-filter input') || panel.querySelector('input, button');
      if (focusEl && panel !== sheetsPanel) focusEl.focus({ preventScroll: true });
    }
    function closeSheets(restoreFocus = true) {
      if (!openSheet) return;
      openSheet.classList.remove('show');
      openSheet = null;
      scrim.classList.remove('show');
      document.body.classList.remove('fd-locked');
      dock.querySelectorAll('.fd-btn').forEach(b => b.classList.remove('active'));
      if (restoreFocus && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    }
    scrim.addEventListener('click', () => closeSheets());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && openSheet) { e.stopPropagation(); closeSheets(); }
    }, true);

    // Swipe a sheet down by its handle to dismiss it.
    [sheetsPanel, targetsPanel, morePanel].forEach(panel => {
      let startY = null;
      panel.addEventListener('touchstart', (e) => {
        startY = e.target.closest('.fd-grabber, .fd-sheet-head') ? e.touches[0].clientY : null;
      }, { passive: true });
      panel.addEventListener('touchmove', (e) => {
        if (startY === null) return;
        const dy = Math.max(0, e.touches[0].clientY - startY);
        panel.style.transform = `translateY(${dy}px)`;
      }, { passive: true });
      panel.addEventListener('touchend', (e) => {
        if (startY === null) return;
        const dy = e.changedTouches[0].clientY - startY;
        panel.style.transform = '';
        startY = null;
        if (dy > 80) closeSheets();
      });
    });

    // ---- Sheets panel: a flat, touch-sized directory built from the header nav.
    const currentFile = () => (window.location.pathname.split('/').pop() || 'index.html');
    function itemLabel(a) {
      const code = a.querySelector('code');
      const desc = a.querySelector('.cmd-desc');
      if (code || desc) return { name: code ? code.textContent.trim() : '', desc: desc ? desc.textContent.trim() : '' };
      return { name: a.textContent.replace(/[▾•]/g, '').trim(), desc: '' };
    }
    function isCurrent(a) {
      const portableHash = window.location.hash.replace(/^#sheet-/, '');
      if (a.dataset.sheet) return a.dataset.sheet === portableHash;
      return (a.getAttribute('href') || '').split('#')[0] === currentFile();
    }
    function buildSheetList() {
      const body = sheetsPanel.querySelector('.fd-sheet-body');
      body.innerHTML = '';
      if (!nav) return;
      const groups = [];
      Array.from(nav.children).forEach(child => {
        if (child.classList.contains('nav-dropdown')) {
          const toggle = child.querySelector('.dropdown-toggle');
          const items = Array.from(child.querySelectorAll('.dropdown-item'));
          groups.push({ title: toggle ? toggle.textContent.replace('▾', '').trim() : 'Sheets', icon: toggle && toggle.querySelector('svg, img'), items });
        } else if (child.matches('a')) {
          let loose = groups.find(g => g.loose);
          if (!loose) { loose = { title: 'More', loose: true, items: [] }; groups.push(loose); }
          loose.items.push(child);
        }
      });
      groups.forEach(g => {
        const details = document.createElement('details');
        details.className = 'fd-group';
        const hasCurrent = g.items.some(isCurrent);
        if (hasCurrent) details.open = true;
        const summary = document.createElement('summary');
        if (g.icon) summary.appendChild(g.icon.cloneNode(true));
        summary.insertAdjacentHTML('beforeend', `<span class="fd-group-title">${escapeHtml(g.title)}</span><span class="fd-group-count">${g.items.length}</span>`);
        details.appendChild(summary);
        const list = document.createElement('div');
        list.className = 'fd-group-list';
        g.items.forEach(orig => {
          const { name, desc } = itemLabel(orig);
          const link = document.createElement('a');
          link.className = 'fd-item' + (isCurrent(orig) ? ' current' : '');
          link.href = orig.getAttribute('href') || '#';
          link.dataset.search = `${g.title} ${name} ${desc}`.toLowerCase();
          link.innerHTML = `<code>${escapeHtml(name)}</code>${desc ? `<span>${escapeHtml(desc)}</span>` : ''}`;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            closeSheets(false);
            orig.click();
          });
          list.appendChild(link);
        });
        details.appendChild(list);
        body.appendChild(details);
      });
      const current = body.querySelector('.fd-item.current');
      if (current) requestAnimationFrame(() => current.scrollIntoView({ block: 'center' }));
    }
    const filterInput = sheetsPanel.querySelector('.fd-filter input');
    filterInput.addEventListener('input', () => {
      const q = filterInput.value.trim().toLowerCase();
      sheetsPanel.querySelectorAll('.fd-group').forEach(group => {
        let shown = 0;
        group.querySelectorAll('.fd-item').forEach(item => {
          const hit = !q || q.split(/\s+/).every(t => item.dataset.search.includes(t));
          item.hidden = !hit;
          if (hit) shown++;
        });
        group.hidden = shown === 0;
        if (q) group.open = shown > 0;
      });
    });

    // ---- Targets: show the live $BMC on the dock so the tech knows which box commands hit.
    function syncTargetLabel() {
      const label = dock.querySelector('.fd-target-label');
      const bmc = document.getElementById('var-bmc');
      const value = bmc && bmc.value.trim();
      label.textContent = value || 'Targets';
      dock.querySelector('.fd-btn-targets').classList.toggle('has-value', !!value);
    }
    document.addEventListener('input', (e) => {
      if (e.target && e.target.id === 'var-bmc') syncTargetLabel();
    });

    dock.addEventListener('click', (e) => {
      const btn = e.target.closest('.fd-btn');
      if (!btn) return;
      switch (btn.dataset.fd) {
        case 'search': closeSheets(false); openGlobalSearch(); break;
        case 'sheets':
          if (openSheet !== sheetsPanel) { filterInput.value = ''; buildSheetList(); filterInput.dispatchEvent(new Event('input')); }
          open(sheetsPanel);
          break;
        case 'targets': open(targetsPanel); break;
        case 'triage': closeSheets(false); openTriageModal(); break;
        case 'more': open(morePanel); break;
      }
    });
    // A tool inside the Tools sheet that opens a modal should not leave the sheet on top.
    morePanel.addEventListener('click', (e) => {
      const btn = e.target.closest('#global-search-btn, #triage-modal-btn, #manuals-btn, #saved-filter-btn, #trail-btn, #kit-btn, .tour-menu-btn');
      if (btn) closeSheets(false);
    });

    const mq = window.matchMedia(FIELD_QUERY);
    function apply() {
      const on = mq.matches;
      document.body.classList.toggle('field-mode', on);
      if (on) {
        borrow(actions, morePanel.querySelector('.fd-sheet-body'));
        borrow(document.getElementById('target-vars-container'), targetsPanel.querySelector('.fd-sheet-body'));
      } else {
        closeSheets(false);
        giveBack();
      }
      syncTargetLabel();
      repack();
    }
    if (mq.addEventListener) mq.addEventListener('change', apply);
    else if (mq.addListener) mq.addListener(apply);
    apply();
  }

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
    openTrail,
    openRunbook,
    openKit,
    openAnalyzer,
    analyzeOutput,
    switchNode,
    openBoard,
    startTour,
    toggleKbHelp,
    openBerReference,
    openHealthAtlas,
    THEMES
  };

  window.CheatSheetCommon = commonExports;
  window.AppCommon = commonExports;
  window.AntigravityCommon = commonExports;
  window.ClaudeCommon = commonExports;
  window.CodexCommon = commonExports;
})();
