// generate-windows-suite.js
// Generates all 8 standalone Windows cheat sheets and updates the Windows dropdown across all HTML sheets.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Read windows.js to extract WINDOWS_CHEAT_SHEET_DATA
const windowsJs = fs.readFileSync(path.join(__dirname, 'windows.js'), 'utf8');
const sandbox = {};
vm.createContext(sandbox);
const dataEndIdx = windowsJs.indexOf('const state =');
const dataCode = windowsJs.slice(0, dataEndIdx) + '\nWINDOWS_CHEAT_SHEET_DATA;';
const WINDOWS_CHEAT_SHEET_DATA = vm.runInContext(dataCode, sandbox);
console.log(`Loaded ${WINDOWS_CHEAT_SHEET_DATA.length} Windows sections from windows.js`);

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 2. Define the Windows Navbar Dropdown Snippet
const WIN_NAVBAR_SNIPPET = `              <div class="nav-dropdown" id="win-nav-dropdown">
                <a href="windows.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="13" height="13" fill="#00a4ef" aria-hidden="true"><path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/></svg>
                  <span>Windows</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu win-dropdown-menu" role="menu">
                  <a href="windows.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Windows Hub &amp; Quick Admin</a>
                  <div class="dropdown-divider"></div>
                  <div class="win-dropdown-grid">
                    <div class="win-dropdown-col">
                      <div class="win-dropdown-heading">OS &amp; Desktop</div>
                      <a href="win-shortcuts.html" class="dropdown-item" role="menuitem"><code>keys</code> <span class="cmd-desc">Snap &amp; Explorer Keys</span></a>
                      <a href="win-storage.html" class="dropdown-item" role="menuitem"><code>dsk</code> <span class="cmd-desc">Disks &amp; BitLocker</span></a>
                      <a href="win-packages.html" class="dropdown-item" role="menuitem"><code>pkg</code> <span class="cmd-desc">Winget &amp; PS Modules</span></a>
                      <a href="win-wsl.html" class="dropdown-item" role="menuitem"><code>wsl</code> <span class="cmd-desc">WSL 2 &amp; Interop</span></a>
                    </div>
                    <div class="win-dropdown-col">
                      <div class="win-dropdown-heading">Sysadmin &amp; Triage</div>
                      <a href="win-processes.html" class="dropdown-item" role="menuitem"><code>proc</code> <span class="cmd-desc">Processes &amp; Services</span></a>
                      <a href="win-network.html" class="dropdown-item" role="menuitem"><code>net</code> <span class="cmd-desc">Network, Ports &amp; DNS</span></a>
                      <a href="win-registry.html" class="dropdown-item" role="menuitem"><code>reg</code> <span class="cmd-desc">Registry &amp; Environment</span></a>
                      <a href="win-sysadmin.html" class="dropdown-item" role="menuitem"><code>adm</code> <span class="cmd-desc">System Repair &amp; Robocopy</span></a>
                    </div>
                  </div>
                </div>
              </div>`;

// 3. Update navbar across all existing HTML files
const htmlFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.html') && f !== 'datacenter-cheatsheet-portable.html' && f !== 'omarchy.html');
const winLinkPattern = /<a href="windows\.html" class="sheet-link(?: active)?">[\s\S]*?<\/svg>\s*Windows<\/a>/;

let updatedNavCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (winLinkPattern.test(content)) {
    content = content.replace(winLinkPattern, WIN_NAVBAR_SNIPPET);
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
    updatedNavCount++;
  }
}
console.log(`Updated navbar with Windows dropdown in ${updatedNavCount} existing HTML files`);

// 4. Section mapping & badges
const SECTION_MAP = {
  'win-keys': { file: 'win-shortcuts', badge: 'keys', title: 'Windows 11, Snap & Explorer Shortcuts' },
  'win-storage': { file: 'win-storage', badge: 'dsk', title: 'Disks, Volumes & BitLocker Encryption' },
  'ps-sys': { file: 'win-processes', badge: 'proc', title: 'Processes, Services, Events & Hardware' },
  'ps-net': { file: 'win-network', badge: 'net', title: 'Networking, Ports, DNS & Firewall' },
  'winget-pkg': { file: 'win-packages', badge: 'pkg', title: 'Winget, Packages & PS Modules' },
  'wsl': { file: 'win-wsl', badge: 'wsl', title: 'WSL 2 (Subsystem for Linux) & Interop' },
  'reg-env': { file: 'win-registry', badge: 'reg', title: 'Environment, Profile, Registry & Admin' },
  'sysadmin-repair': { file: 'win-sysadmin', badge: 'adm', title: 'System Repair, Robocopy, Power & UEFI' }
};

// 5. Pro tips definitions for each of the 8 Windows sheets
const PRO_TIPS = {
  'win-keys': {
    desc: 'Instant graphics driver reset, Snipping Tool OCR & Task Manager shortcut',
    cmd: 'Win+Ctrl+Shift+B   |   Win+Shift+S   |   Ctrl+Shift+Esc   |   Win+X',
    details: 'Press Win+Ctrl+Shift+B to instantly restart your graphics driver subsystem when experiencing screen flickering or black screen freezes without rebooting. Use Win+Shift+S for text OCR extraction from any image.',
    flags: [
      ['Win+Ctrl+Shift+B', 'Beeps and restarts GPU display driver pipeline without closing apps'],
      ['Win+Shift+S', 'Snipping Tool: capture region, window, screen recording, or extract text (OCR)'],
      ['Ctrl+Shift+Esc', 'Directly open Task Manager without going through Ctrl+Alt+Del lock screen'],
      ['Win+V', 'Open Clipboard History (press once to turn on, stores up to 25 items + pins)']
    ],
    tip: 'Press Win+X then A to launch an elevated Administrator PowerShell prompt in 1 second!'
  },
  'win-storage': {
    desc: 'Retrieve 48-digit BitLocker recovery password & clean disk wipe',
    cmd: 'manage-bde -protectors -get C:   |   Get-Disk | Where-Object OperationalStatus -ne "OK"',
    details: 'Always backup your 48-digit BitLocker numerical recovery password before BIOS/firmware updates using manage-bde. Inspect unhealthy or degraded physical storage drives with Get-Disk.',
    flags: [
      ['manage-bde -protectors -get C:', 'Outputs Numerical Password (Recovery Key ID and 48-digit key)'],
      ['Clear-Disk -Number 1 -RemoveData -Confirm:$false', 'Wipe disk partition table completely to prepare for clean provisioning'],
      ['Initialize-Disk -Number 1 -PartitionStyle GPT', 'Initialize newly attached drive with modern GPT partition table'],
      ['Get-Volume | Format-Table -AutoSize', 'List all drive letters, file system types (NTFS/ReFS), and free space']
    ],
    tip: 'Use ReFS formatting for dedicated Hyper-V, WSL 2, or dev storage for instant block cloning!'
  },
  'ps-sys': {
    desc: 'Accurate system uptime, parent process tree inspection & crash triage',
    cmd: '(Get-CimInstance Win32_OperatingSystem).LastBootUpTime   |   Get-Service | Where Status -eq "Running"',
    details: 'Windows Fast Startup causes Task Manager uptime to not reset on normal shutdown. Querying LastBootUpTime from CIM provides true hardware boot timestamp.',
    flags: [
      ['LastBootUpTime', 'Calculates true cold boot time bypassing Fast Startup hybrid hibernation'],
      ['Get-Process | Sort-Object WorkingSet64 -Descending | Select -First 10', 'Identifies top RAM consumers in bytes'],
      ['Stop-Process -Name "target" -Force', 'Forcefully terminates all process instances immediately'],
      ['Get-WinEvent -FilterHashtable @{LogName=\'System\'; Level=1,2} -MaxEvents 20', 'Pulls recent Critical (1) and Error (2) events']
    ],
    tip: 'Use Get-CimInstance Win32_Process to inspect full command-line arguments and parent PIDs!'
  },
  'ps-net': {
    desc: 'Instant listening port ownership mapping & PowerShell netcat replacement',
    cmd: 'Get-NetTCPConnection -State Listen | Select LocalPort, OwningProcess   |   Test-NetConnection',
    details: 'Map listening TCP ports directly to process IDs without third-party utilities. Use Test-NetConnection as a built-in replacement for netcat, telnet, and traceroute.',
    flags: [
      ['Get-NetTCPConnection -State Listen', 'Returns all active listening TCP ports with OwningProcess PID'],
      ['Test-NetConnection -ComputerName 1.1.1.1 -Port 443', 'Tests TCP handshake connectivity and reports ping RTT'],
      ['Resolve-DnsName -Name google.com -Type AAAA', 'Queries specific DNS records bypassing local hosts file'],
      ['Clear-DnsClientCache', 'Immediately purges Windows DNS resolver cache']
    ],
    tip: 'Use Invoke-RestMethod instead of curl to parse JSON REST endpoints directly into PowerShell objects!'
  },
  'winget-pkg': {
    desc: 'Silent batch application upgrades & reproducible JSON machine manifests',
    cmd: 'winget upgrade --all --include-unknown   |   winget export -o winget.json',
    details: 'The official Windows Package Manager (winget) can update your entire software suite with one command. Export your installed software catalog to JSON for instant provisioning on new machines.',
    flags: [
      ['winget upgrade --all', 'Updates all detected outdated applications across machine silently'],
      ['winget export -o manifest.json', 'Creates JSON manifest of all installed winget packages'],
      ['winget import -i manifest.json', 'Batch installs all packages specified in manifest'],
      ['Set-ExecutionPolicy RemoteSigned -Scope CurrentUser', 'Allows running local .ps1 scripts without admin rights']
    ],
    tip: 'Pass --accept-package-agreements --accept-source-agreements for 100% unattended installs!'
  },
  'wsl': {
    desc: 'Reclaim RAM instantly with VM shutdown & Windows-Linux filesystem interop',
    cmd: 'wsl --shutdown   |   explorer.exe \\\\wsl$\\Ubuntu\\   |   wsl --export Ubuntu D:\\backup.tar',
    details: 'WSL 2 runs a lightweight Hyper-V VM that retains RAM caches. Running wsl --shutdown terminates the background VM and immediately releases gigabytes of RAM to Windows.',
    flags: [
      ['wsl --shutdown', 'Stops all running distributions and completely reclaims VM memory'],
      ['\\\\wsl$\\<distro>\\', 'Access the Linux root filesystem directly inside Windows File Explorer'],
      ['wsl -u root', 'Log into default distribution as root user to fix broken sudoers or permissions'],
      ['wsl --export <distro> <file.tar>', 'Create full portable backup snapshot of your Linux environment']
    ],
    tip: 'You can run Windows commands from inside Linux bash (e.g. clip.exe < file.txt)!'
  },
  'reg-env': {
    desc: 'Persistent environment variables, Registry PSDrives & Admin elevation',
    cmd: '[Environment]::SetEnvironmentVariable("NAME", "VAL", "User")   |   cd HKCU:\\Software',
    details: 'PowerShell allows navigating the Windows Registry just like a file folder using HKCU: and HKLM:. Persist environment variables cleanly across reboots without clicking through System Properties.',
    flags: [
      ['[Environment]::SetEnvironmentVariable()', 'Permanently sets User or Machine level environment variables'],
      ['$env:PATH -split ";"', 'Cleanly splits PATH variable into one readable line per directory'],
      ['cd HKCU:\\', 'Navigate Current User Registry hive using standard cd, ls, dir, and Get-Item'],
      ['Start-Process wt -Verb RunAs', 'Launches an elevated Administrator Windows Terminal window']
    ],
    tip: 'Edit your startup profile with notepad $PROFILE to define custom functions and persistent aliases!'
  },
  'sysadmin-repair': {
    desc: 'High-speed 16-thread Robocopy directory mirror & corruption repair',
    cmd: 'robocopy <src> <dst> /MIR /MT:16 /R:1 /W:1   |   DISM /Online /Cleanup-Image /RestoreHealth',
    details: 'Robocopy with /MT:16 copies files up to 10x faster than Windows Explorer by using multi-threaded execution. Use DISM /RestoreHealth followed by sfc /scannow to fix corrupted Windows files.',
    flags: [
      ['robocopy /MIR /MT:16', 'Mirrors directory structure using 16 concurrent worker threads'],
      ['/R:1 /W:1', 'Wait only 1 second before retrying locked files instead of default 30 seconds'],
      ['DISM /Online /Cleanup-Image /RestoreHealth', 'Downloads clean replacement system files from Windows Update'],
      ['sfc /scannow', 'Scans and repairs local protected operating system files'],
      ['shutdown /r /fw /t 0', 'Instantly reboots directly into motherboard UEFI/BIOS configuration']
    ],
    tip: 'Generate a detailed laptop battery degradation report with: powercfg /batteryreport'
  }
};

// 6. Clean titles map for all Windows cards
const CMD_TITLES = {
  'win-power-user-admin': 'Power User Menu & Task Manager (Win+X)',
  'win-snap-multimonitor': 'Window Snapping & Layouts (Win+Z / Arrows)',
  'win-virtual-desktops': 'Virtual Desktops Management (Win+Ctrl+D/F4)',
  'win-clipboard-capture-gpu': 'Clipboard History & GPU Reset (Win+V / Win+Ctrl+Shift+B)',
  'win-explorer-power-tricks': 'Explorer Path Copy & Terminal Launch',
  'get-disk-inventory': 'Physical Disks & Partition Styles (Get-Disk)',
  'disk-partition-format': 'Disk Initialization & Partition Format',
  'bitlocker-status-keys': 'BitLocker Encryption Status & Recovery Keys',
  'process-top-kill': 'Top Memory Processes & Force Termination',
  'process-commandline-parent': 'Process Command-Line Arguments & Parent PID',
  'windows-services-manage': 'Windows Services Control (Get-Service / Restart-Service)',
  'eventlog-winevent': 'Event Viewer & Crash Diagnostics (Get-WinEvent)',
  'hardware-specs-uptime': 'Hardware Inventory & Boot Uptime (Get-CimInstance)',
  'find-listening-ports-pid': 'Listening TCP Ports & Process ID (Get-NetTCPConnection)',
  'test-netconnection-tnc': 'Network Port Test & Traceroute (Test-NetConnection)',
  'dns-resolve-flush': 'DNS Record Query & Cache Flush (Resolve-DnsName)',
  'invoke-restmethod-webrequest': 'REST API Queries & HTTP Downloads (Invoke-RestMethod)',
  'ip-adapters-firewall': 'IP Configuration & Firewall Port Rules',
  'winget-search-install': 'Package Search & Silent Install (winget)',
  'winget-upgrade-all': 'Batch Package Upgrades (winget upgrade --all)',
  'winget-export-import': 'System Package Export & Restore Manifest',
  'ps-execution-policy-modules': 'PowerShell ExecutionPolicy & PSGallery Modules',
  'wsl-install-list': 'WSL 2 Installation & Distribution Status',
  'wsl-shutdown-root': 'WSL VM Shutdown & Root Login',
  'wsl-export-import-move': 'WSL Distro Backup & Relocation (.tar)',
  'wsl-windows-interop': 'Windows-Linux Interoperability & File Sharing',
  'env-vars-path': 'Environment Variables & $env:PATH Splitting',
  'ps-profile-aliases': 'PowerShell $PROFILE & Command History',
  'registry-psdrive': 'Registry Navigation & Editing (HKCU: / HKLM:)',
  'elevate-runas-admin': 'Administrator Elevation & Token Verification',
  'dism-sfc-repair': 'DISM & SFC System Image Corruption Repair',
  'robocopy-mirror-fast': 'Multi-Threaded Robocopy Directory Mirroring',
  'powercfg-battery-sleep': 'Laptop Battery Health Report & Sleep Inhibitors',
  'shutdown-uefi-bios': 'Direct Motherboard UEFI / BIOS Setup Reboot'
};

// 7. Generate cards for each Windows section
function buildWindowsSectionCards(sec) {
  const cards = [];
  const cfg = SECTION_MAP[sec.id] || { badge: sec.badge, title: sec.title };
  const secName = cfg.title.split(',')[0].split('&')[0].trim();

  sec.commands.forEach((cmd, idx) => {
    const cardTitle = CMD_TITLES[cmd.id] || cmd.desc.split('.')[0].trim();

    cards.push({
      id: `${sec.id}-card-${idx + 1}`,
      badge: cfg.badge,
      title: `${secName}: ${cardTitle}`,
      subtitle: cmd.desc,
      commands: [ cmd ]
    });
  });

  // Add Pro Tips card
  const proTip = PRO_TIPS[sec.id];
  if (proTip) {
    cards.push({
      id: `${sec.id}-pro-tips`,
      badge: 'tip',
      title: `${secName}: Pro Tips & Best Practices`,
      subtitle: proTip.desc,
      commands: [
        {
          id: `${sec.id}-tips-card`,
          desc: proTip.desc,
          cmd: proTip.cmd,
          details: proTip.details,
          flags: proTip.flags,
          tip: proTip.tip,
          tags: [sec.id, 'tips', 'pro', 'windows', 'powershell', 'best-practices']
        }
      ]
    });
  }

  return cards;
}

// 8. Generate JS file for each Windows sub-sheet
function generateWindowsJs(sec, cards, fileKey) {
  const varName = `WIN_${fileKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`;
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for Windows: ${sec.title}
const ${varName} = ${jsonCards};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("${fileKey}_bookmarks") || "[]"))
};

// DOM References
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const emptyStateEl = document.getElementById("empty-state");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const savedCountEl = document.getElementById("saved-count");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
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

// Windows Shortcut & PowerShell Syntax Highlighting
function highlightPsCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(\\b(?:Win|Ctrl|Alt|Shift)(?:\\+[A-Za-z0-9←→↑↓.\`]+)+)|(\\s\\|\\s)|(\\b[A-Z][a-zA-Z]+-[A-Z][a-zA-Z0-9]+\\b|\\b(?:winget|wsl|robocopy|powercfg|shutdown|DISM\\.exe|sfc|netstat|findstr|where\\.exe|explorer\\.exe|clip\\.exe|notepad)\\b)|(\\$[a-zA-Z0-9_:]+|\\$_)|(\\s-[a-zA-Z0-9-]+|\\s\\/[a-zA-Z0-9:]+)/g,
    (match, shortcut, sep, cmdlet, variable, flag) => {
      if (shortcut) return '<span class="tok-flag">' + shortcut + '</span>';
      if (sep) return '<span class="tok-pipe">' + sep + '</span>';
      if (cmdlet) return '<span class="tok-cmd">' + cmdlet + '</span>';
      if (variable) return '<span class="tok-str">' + variable + '</span>';
      if (flag) return '<span class="tok-flag">' + flag + '</span>';
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

function isRunnableCommand(cmd) {
  if (window.AntigravityCommon && window.AntigravityCommon.isRunnableCommand) {
    return window.AntigravityCommon.isRunnableCommand(cmd);
  }
  if (!cmd || typeof cmd !== 'string') return false;
  var s = cmd.trim();
  if (!s) return false;
  if (s.startsWith('POST ') || s.startsWith('Stage ') || s.startsWith('1-DIMM') || s.startsWith('BMC_') || s.startsWith('Above 4G')) return false;
  if (s.startsWith('T568') || s.startsWith('[Transceiver') || s.startsWith('Switch Port: OSFP') || s.startsWith('800G Twin-Port') || s.startsWith('0.5')) return false;
  if (s.startsWith('Direct Optic-to-Optic') || s.startsWith('MPO-12') || s.startsWith('LC Duplex') || s.startsWith('1. Inspect') || s.startsWith('Check DOM') || s.startsWith('10km LR4') || s.startsWith('Tier ')) return false;
  if (s.includes('──►') || s.includes('◄──')) return false;
  if (s.startsWith('Win+') || s.startsWith('Alt+') || s.startsWith('Ctrl+')) return false;
  if (/[⇧⌘⌥⌃]/.test(s) || s.includes('-Finger Swipe')) return false;
  return true;
}

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

      const isRun = isRunnableCommand(cmd.cmd);
      const codeBoxLines = isRun
        ? [
            '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
            '    <pre class="cmd-code"><code>' + highlightPsCmd(cmd.cmd) + '</code></pre>',
            '    <button type="button" class="copy-btn" title="Copy command" aria-label="Copy command">',
            '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
            '        <rect x="9" y="9" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
            '        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" fill="none" stroke="currentColor" stroke-width="2"/>',
            '      </svg>',
            '      <span class="copy-feedback">Copy</span>',
            '    </button>',
            '  </div>'
          ]
        : [
            '  <div class="cmd-code-box ref-box">',
            '    <pre class="cmd-code"><code>' + highlightPsCmd(cmd.cmd) + '</code></pre>',
            '  </div>'
          ];

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
        codeBoxLines.join("\\n"),
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

  densityToggleBtn.addEventListener("click", () => {
    state.compact = !state.compact;
    document.body.classList.toggle("compact-mode", state.compact);
    densityLabel.textContent = state.compact ? "Normal" : "Compact";
    localStorage.setItem("linux_cs_compact", state.compact ? "1" : "0");
    packMasonry();
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
    const copyBtn = e.target.closest(".copy-btn");
    if (copyBtn) {
      const codeBox = copyBtn.closest(".cmd-code-box[data-cmd]");
      const cmdText = codeBox ? codeBox.getAttribute("data-cmd") : "";
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const codeBox = e.target.closest(".cmd-code-box[data-cmd]");
    if (codeBox && !e.target.closest(".copy-btn")) {
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
  state.theme = theme;
  if (window.CheatSheetCommon && window.CheatSheetCommon.applyTheme) {
    window.CheatSheetCommon.applyTheme(theme);
  } else if (window.AntigravityCommon && window.AntigravityCommon.applyTheme) {
    window.AntigravityCommon.applyTheme(theme);
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("linux_cs_theme", theme); } catch(e) {}
  }
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");
  if (sunIcon && moonIcon) {
    if (theme === "light") {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }
  }
}

function init() {
  applyTheme(state.theme);
  if (state.compact) {
    document.body.classList.add("compact-mode");
    densityLabel.textContent = "Normal";
  }
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
`;
}

// 9. Generate HTML file for each Windows sub-sheet
function generateWindowsHtml(sec, fileKey) {
  const cfg = SECTION_MAP[sec.id] || { badge: sec.badge, title: sec.title };
  const secName = cfg.title.split(',')[0].split('&')[0].trim();

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Windows: ${escapeHtml(cfg.title)} — PowerShell &amp; Admin</title>
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
          <span class="prompt-symbol">C:\\&gt;</span><span class="cursor-block">_</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(cfg.title)}</h1>
            <span class="version-pill">${escapeHtml(cfg.badge.toUpperCase())} / Windows 11 &amp; Server</span>
            <nav class="sheet-switcher" aria-label="Switch cheat sheet">
              <div class="nav-dropdown" id="linux-nav-dropdown">
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
              </div>
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
                  <a href="git.html" class="dropdown-item" role="menuitem">🌿 Git</a>
                  <div class="dropdown-divider"></div>
                  <a href="json.html" class="dropdown-item" role="menuitem">📋 JSON &amp; jq</a>
                  <a href="yaml.html" class="dropdown-item" role="menuitem">📄 YAML &amp; yq</a>
                  <a href="toml.html" class="dropdown-item" role="menuitem">⚙️ TOML</a>
                  <div class="dropdown-divider"></div>
                  <a href="regex.html" class="dropdown-item" role="menuitem">🔤 Regex</a>
                  <a href="awk-sed.html" class="dropdown-item" role="menuitem">✂️ AWK &amp; Sed</a>
                  <a href="sql.html" class="dropdown-item" role="menuitem">🗄️ SQL &amp; SQLite</a>
                </div>
              </div>
              <div class="nav-dropdown" id="nvim-nav-dropdown">
                <a href="neovim.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true"><path d="M2.5 5.2L7.3.5v23l-4.8-4.7V5.2z" fill="#16b0ed"/><path d="M16.7.5l4.8 4.7v13.6l-4.8 4.7V.5z" fill="#57a143"/><path d="M7.3.5l12 18.2-2.6 4.8L4.7 5.3 7.3.5z" fill="#7db643"/></svg>
                  <span>Neovim</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu nvim-dropdown-menu" role="menu">
                  <a href="neovim.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Neovim Hub &amp; Composer</a>
                  <div class="dropdown-divider"></div>
                  <div class="nvim-dropdown-grid">
                    <div class="nvim-dropdown-col">
                      <div class="nvim-dropdown-heading">Editing &amp; Motions</div>
                      <a href="nvim-motions.html" class="dropdown-item" role="menuitem"><code>mov</code> <span class="cmd-desc">Motions &amp; Jumps</span></a>
                      <a href="nvim-operators.html" class="dropdown-item" role="menuitem"><code>edit</code> <span class="cmd-desc">Operators &amp; Objects</span></a>
                      <a href="nvim-visual.html" class="dropdown-item" role="menuitem"><code>vis</code> <span class="cmd-desc">Visual &amp; Block Mode</span></a>
                      <a href="nvim-search.html" class="dropdown-item" role="menuitem"><code>srch</code> <span class="cmd-desc">Search &amp; Substitute</span></a>
                      <a href="nvim-macros.html" class="dropdown-item" role="menuitem"><code>mac</code> <span class="cmd-desc">Macros &amp; Registers</span></a>
                    </div>
                    <div class="nvim-dropdown-col">
                      <div class="nvim-dropdown-heading">Workspace &amp; Ecosystem</div>
                      <a href="nvim-windows.html" class="dropdown-item" role="menuitem"><code>win</code> <span class="cmd-desc">Windows, Splits &amp; Tabs</span></a>
                      <a href="nvim-lsp.html" class="dropdown-item" role="menuitem"><code>lsp</code> <span class="cmd-desc">Built-in LSP &amp; Treesitter</span></a>
                      <a href="nvim-lazyvim.html" class="dropdown-item" role="menuitem"><code>lazy</code> <span class="cmd-desc">LazyVim, Picker &amp; Git</span></a>
                      <a href="nvim-ex-shell.html" class="dropdown-item" role="menuitem"><code>ex</code> <span class="cmd-desc">Ex Commands &amp; Shell</span></a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="nav-dropdown" id="macos-nav-dropdown">
                <a href="macos.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
                  <span>macOS</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu macos-dropdown-menu" role="menu">
                  <a href="macos.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 macOS Hub &amp; Tweak Generator</a>
                  <div class="dropdown-divider"></div>
                  <div class="macos-dropdown-grid">
                    <div class="macos-dropdown-col">
                      <div class="macos-dropdown-heading">Shortcuts &amp; UI</div>
                      <a href="macos-system-keys.html" class="dropdown-item" role="menuitem"><code>keys</code> <span class="cmd-desc">System &amp; Screenshots</span></a>
                      <a href="macos-finder-keys.html" class="dropdown-item" role="menuitem"><code>fndr</code> <span class="cmd-desc">Finder &amp; Quick Look</span></a>
                      <a href="macos-text-editing.html" class="dropdown-item" role="menuitem"><code>txt</code> <span class="cmd-desc">Text &amp; Selection</span></a>
                      <a href="macos-trackpad.html" class="dropdown-item" role="menuitem"><code>pad</code> <span class="cmd-desc">Trackpad &amp; Gestures</span></a>
                    </div>
                    <div class="macos-dropdown-col">
                      <div class="macos-dropdown-heading">Terminal &amp; Sysadmin</div>
                      <a href="macos-darwin-cli.html" class="dropdown-item" role="menuitem"><code>cli</code> <span class="cmd-desc">Darwin &amp; Clipboard CLI</span></a>
                      <a href="macos-homebrew.html" class="dropdown-item" role="menuitem"><code>brew</code> <span class="cmd-desc">Homebrew Packages</span></a>
                      <a href="macos-system-admin.html" class="dropdown-item" role="menuitem"><code>sys</code> <span class="cmd-desc">Defaults &amp; Launchd</span></a>
                      <a href="macos-net-disk-sec.html" class="dropdown-item" role="menuitem"><code>net</code> <span class="cmd-desc">Network, Disks &amp; Security</span></a>
                    </div>
                  </div>
                </div>
              </div>
${WIN_NAVBAR_SNIPPET}
              <a href="nvidia.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="15" height="15" fill="#76b900" aria-hidden="true"><path d="M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.774 3.851-5.75 3.851c-.398 0-.787-.062-1.158-.185v-4.346c1.528.185 1.837.857 2.747 2.385l2.04-1.714s-1.492-1.952-4.01-1.952a6.016 6.016 0 0 0-.786.035m0-4.735v2.138l.424-.027c5.45-.185 9.01 4.47 9.01 4.47s-4.08 4.964-8.33 4.964c-.37 0-.742-.035-1.104-.097v1.325c.292.035.6.062.91.062 3.957 0 6.82-2.023 9.593-4.408.459.371 2.34 1.263 2.73 1.652-2.633 2.208-8.772 3.984-12.253 3.984-.335 0-.653-.018-.98-.053v1.864H24V4.063zm0 10.326v1.166c-3.657-.654-4.673-4.46-4.673-4.46s1.758-1.944 4.673-2.262v1.237h-.008c-1.528-.186-2.73 1.245-2.73 1.245s.68 2.412 2.738 3.074M2.456 10.9s2.164-3.197 6.5-3.533V6.201C4.153 6.59 0 10.653 0 10.653s2.35 6.802 8.948 7.42v-1.237c-4.84-.6-6.492-5.936-6.492-5.936Z"/></svg> NVIDIA DC</a>
              <a href="infiniband.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><circle cx="5" cy="6" r="2.5" stroke="#38bdf8" stroke-width="1.8"/><circle cx="19" cy="6" r="2.5" stroke="#38bdf8" stroke-width="1.8"/><circle cx="5" cy="18" r="2.5" stroke="#4ade80" stroke-width="1.8"/><circle cx="19" cy="18" r="2.5" stroke="#4ade80" stroke-width="1.8"/><path d="M7.5 6h9M7.5 18h9M5 8.5v7M19 8.5v7M7 7.5l10 9M17 7.5l-10 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg> InfiniBand</a>
              <a href="switches.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="15" height="14" fill="none" aria-hidden="true"><path d="M1 8h1.5v8H1V8zm20.5 0H23v8h-1.5V8z" fill="currentColor" opacity="0.7"/><rect x="2.5" y="6" width="19" height="12" rx="1.5" fill="#0f172a" stroke="currentColor" stroke-width="1.6"/><circle cx="5.3" cy="9.5" r="1.1" fill="#22c55e"/><circle cx="5.3" cy="14.5" r="1.1" fill="#38bdf8"/><rect x="8.2" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="11.6" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="15" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="18.4" y="8" width="2" height="2.8" rx="0.4" fill="#22c55e"/><rect x="8.2" y="13.2" width="2.4" height="2.8" rx="0.4" fill="#22c55e"/><rect x="11.6" y="13.2" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="15" y="13.2" width="2.4" height="2.8" rx="0.4" fill="#22c55e"/><rect x="18.4" y="13.2" width="2" height="2.8" rx="0.4" fill="currentColor"/></svg> Switches</a>
              <a href="redfish.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 30 20" width="17" height="13" fill="none" aria-hidden="true"><path d="M.2 9.5C.3 8.8 1.8 7.8 5.5 4.7L11.6.5l3.6 2.6L17.9 1l3 2.3-2.4 1.9 2.2 1.7 5.4-4 3.3 2.6-5.3 4.3 5.3 4.3-3.3 2.6-5.4-4-2.2 1.7 2.4 1.9-3 2.3-2.7-2.1-3.6 2.6L.4 10.3l3.1.4L.2 9.5z" fill="#e11d48"/><circle cx="5.6" cy="6.6" r="1.95" fill="#fff"/><circle cx="5.6" cy="6.6" r="1" fill="#e11d48"/></svg> Redfish</a>
              <a href="ipmi.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M7.5 12h2l1.5-3 2 6 1.5-3h2" stroke="#4ade80" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg> ipmitool</a>
              <a href="fiber.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2" y="8" width="7" height="8" rx="1.2" stroke="currentColor" stroke-width="1.8"/><path d="M9 10h3v4H9" stroke="currentColor" stroke-width="1.6"/><circle cx="14.5" cy="12" r="1.5" fill="#fbbf24"/><path d="M16 12h6M15.5 9.5l5.5-3.5M15.5 14.5l5.5 3.5" stroke="#22d3ee" stroke-width="1.8" stroke-linecap="round"/></svg> Fiber</a>
              <a href="ethernet.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="5" y="2" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 2v3.5M10.67 2v3.5M13.33 2v3.5M16 2v3.5" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/><path d="M9.5 8.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 12h8l-1 4.5H9L8 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 16.5V22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg> Ethernet</a>
              <a href="motherboards.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="2" stroke="currentColor" stroke-width="1.7"/><rect x="6.5" y="5.5" width="6" height="6" rx="0.8" stroke="#38bdf8" stroke-width="1.6"/><circle cx="9.5" cy="8.5" r="1.2" fill="#38bdf8"/><path d="M15.5 5.5v6M18 5.5v6" stroke="#fbbf24" stroke-width="1.6" stroke-linecap="round"/><path d="M6 15h12M6 18h9" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg> Motherboards</a>
              <a href="jira.html" class="sheet-link"><svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="#0052cc" aria-hidden="true"><path d="M11.53 2c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V2h-10.48zm-5.76 5.76c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V7.76H5.77zM0 13.52c0 2.4 1.97 4.35 4.35 4.35h1.78v1.74c0 2.4 1.97 4.35 4.35 4.35V13.52H0z"/></svg> Jira</a>
            </nav>
          </div>
          <p class="brand-subtitle">${escapeHtml(sec.subtitle)}</p>
        </div>
      </div>

      <div class="search-wrapper">
        <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"/>
        </svg>
        <input
          type="search"
          id="search-input"
          placeholder="Search ${escapeHtml(secName)} commands, PowerShell cmdlets, flags..."
          autocomplete="off"
          spellcheck="false"
          aria-label="Search ${escapeHtml(secName)} commands"
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
        <nav class="category-tabs" id="category-tabs" aria-label="Windows categories">
          <!-- Populated by JS -->
        </nav>
        <div class="stats-summary" id="stats-summary">
          Showing <strong id="visible-count">0</strong> items
        </div>
      </div>
    </div>
  </header>

  <main class="container main-layout">
    <div id="sections-container" class="sections-grid">
      <!-- Populated dynamically from ${fileKey}.js -->
    </div>

    <div id="empty-state" class="empty-state hidden">
      <div class="empty-icon">C:\&gt;?</div>
      <h3>No matching ${escapeHtml(secName)} commands or shortcuts found</h3>
      <p>Try searching with another keyword or reset active filters.</p>
      <button type="button" id="reset-search-btn" class="action-btn">Reset Filters</button>
    </div>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div>
        <span>Tip: Click any command or shortcut box to copy it to clipboard.</span>
      </div>
      <div class="footer-shortcuts">
        <span><kbd>/</kbd> Search</span>
        <span><kbd>Esc</kbd> Clear</span>
        <span><kbd>Ctrl+P</kbd> Print</span>
      </div>
    </div>
  </footer>

  <div id="toast" class="toast" role="status" aria-live="polite">
    <span class="toast-check">&#10003;</span>
    <span id="toast-text">Copied to clipboard</span>
  </div>

  <script src="global-search-index.js"></script>
  <script src="manuals-data.js"></script>
  <script src="manuals-ui.js"></script>
  <script src="common.js"></script>
  <script src="${fileKey}.js"></script>
</body>
</html>`;
}

// 10. Generate all 8 sub-sheets
console.log('Generating 8 standalone Windows sub-sheets...');
for (const sec of WINDOWS_CHEAT_SHEET_DATA) {
  const cfg = SECTION_MAP[sec.id];
  if (!cfg) continue;

  const cards = buildWindowsSectionCards(sec);
  const jsContent = generateWindowsJs(sec, cards, cfg.file);
  const htmlContent = generateWindowsHtml(sec, cfg.file);

  const jsPath = path.join(__dirname, `${cfg.file}.js`);
  const htmlPath = path.join(__dirname, `${cfg.file}.html`);

  fs.writeFileSync(jsPath, jsContent, 'utf8');
  fs.writeFileSync(htmlPath, htmlContent, 'utf8');

  console.log(`  + Created ${cfg.file}.html & ${cfg.file}.js (${cards.length} cards)`);
}

console.log('Windows suite generation complete!');
