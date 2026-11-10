// generate-ethernet-suite.js
// Generates all 6 standalone Datacenter Ethernet cheat sheets and updates the Ethernet dropdown across all HTML sheets.
const fs = require('fs');
const path = require('path');
const { mergeCommandCards } = require('./generate-card-utils');

// 1. Read ethernet.js to extract ETHERNET_CHEAT_SHEET_DATA
const ethJs = fs.readFileSync(path.join(__dirname, 'ethernet.js'), 'utf8');
const dataEndIdx = ethJs.indexOf('const state = {');
const dataCode = ethJs.slice(0, dataEndIdx) + '\nETHERNET_CHEAT_SHEET_DATA;';
const ETHERNET_CHEAT_SHEET_DATA = eval(dataCode);
console.log(`Loaded ${ETHERNET_CHEAT_SHEET_DATA.length} Ethernet sections from ethernet.js`);

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 2. Define the Ethernet Navbar Dropdown Snippet
const ETH_NAVBAR_SNIPPET = `              <div class="nav-dropdown" id="ethernet-nav-dropdown">
                <a href="ethernet.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true"><rect x="5" y="2" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="1.8"/><path d="M8 2v3.5M10.67 2v3.5M13.33 2v3.5M16 2v3.5" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round"/><path d="M9.5 8.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 12h8l-1 4.5H9L8 12z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 16.5V22" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
                  <span>Ethernet</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu eth-dropdown-menu" role="menu">
                  <a href="ethernet.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Ethernet Hub &amp; Netplan Generator</a>
                  <div class="dropdown-divider"></div>
                  <div class="eth-dropdown-grid">
                    <div class="eth-dropdown-col">
                      <div class="eth-dropdown-heading">Physical, PHY &amp; Netplan</div>
                      <a href="eth-rj45-tdr.html" class="dropdown-item" role="menuitem"><code>rj45</code> <span class="cmd-desc">RJ45 Pinouts &amp; TDR Testing</span></a>
                      <a href="eth-ethtool-tuning.html" class="dropdown-item" role="menuitem"><code>eth</code> <span class="cmd-desc">ethtool, Speed &amp; Ring Buffers</span></a>
                      <a href="eth-netplan-systemd.html" class="dropdown-item" role="menuitem"><code>netp</code> <span class="cmd-desc">Netplan &amp; networkctl</span></a>
                    </div>
                    <div class="eth-dropdown-col">
                      <div class="eth-dropdown-heading">Protocol, Bonds &amp; Triage</div>
                      <a href="eth-iproute2-ip6.html" class="dropdown-item" role="menuitem"><code>ip6</code> <span class="cmd-desc">iproute2 &amp; IPv6 Routing</span></a>
                      <a href="eth-bonding-vlans.html" class="dropdown-item" role="menuitem"><code>bond</code> <span class="cmd-desc">LACP Bonds, VLANs &amp; Bridges</span></a>
                      <a href="eth-lldp-perf.html" class="dropdown-item" role="menuitem"><code>diag</code> <span class="cmd-desc">LLDP Discovery &amp; iperf3</span></a>
                    </div>
                  </div>
                </div>
              </div>`;

// 3. Update navbar across all existing HTML files
const htmlFiles = require('./nav/targets').navFiles();   // the one nav copy, not every page
const ethLinkPattern = /<a href="ethernet\.html" class="sheet-link(?: active)?">[\s\S]*?<\/svg>\s*Ethernet<\/a>/;

let updatedNavCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (ethLinkPattern.test(content)) {
    content = content.replace(ethLinkPattern, ETH_NAVBAR_SNIPPET);
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
    updatedNavCount++;
  }
}
console.log(`Updated navbar with Ethernet dropdown in ${updatedNavCount} existing HTML files`);

// Read pristine updated navbar from index.html
const indexHtmlForNav = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

// 4. Section mapping & file keys
const SECTION_MAP = {
  'rj45-pinout-tdr': {
    file: 'eth-rj45-tdr',
    badge: 'rj45',
    name: 'RJ45 Pinouts & TDR',
    heading: 'TIA/EIA-568B/A Wire Sequences, PHY TDR Cable Diagnostics & Port LED',
    proTip: {
      src: {"verified":"2026-11-10","refs":[{"url":"https://man7.org/linux/man-pages/man8/ethtool.8.html","title":"ethtool(8)"}],"note":"Wiring reference: the TIA-568 standard is not freely available, so the pinout was not checked against it. The 100 Mb/s pair rule is a rule of thumb. Removed 2026-11-10: an unsourced \"within 1 meter\" accuracy claim."},
      desc: 'Physical Layer RJ45 Cable Certification & TDR Fault Locating',
      cmd: 'ethtool --cable-test eth0 && ethtool -p eth0 5',
      details: 'ethtool --cable-test asks the PHY to test each pair; what it reports depends on the NIC, typically OK, open or short per pair and, for a fault, the approximate distance. 10/100BASE-TX use only pins 1-2 and 3-6, so a gigabit link that comes up at 100 Mb/s usually has a bad blue (4-5) or brown (7-8) pair.',
      tip: 'Never punch down mixed T568A and T568B on opposite patch panel ends unless intentionally building a legacy crossover cable.',
      flags: [
        ['ethtool --cable-test <dev>', 'PHY cable test per pair (needs PHY support; the link drops while it runs)'],
        ['ethtool -p <dev> <sec>', 'Blink the port LED for <sec> seconds to find the port by sight'],
        ['T568B Standard', 'Pin 1: White/Orange, 2: Orange, 3: White/Green, 4: Blue, 5: White/Blue, 6: Green, 7: White/Brown, 8: Brown']
      ]
    }
  },
  'ethtool-phy-tuning': {
    file: 'eth-ethtool-tuning',
    badge: 'eth',
    name: 'ethtool & Ring Buffers',
    heading: 'Link Speed Negotiation, CRC Drop Counters, Ring Buffers & Hardware Offloads',
    proTip: {
      src: {"verified":"2026-11-10","refs":[{"url":"https://man7.org/linux/man-pages/man8/ethtool.8.html","title":"ethtool(8)"}],"note":"Counter names such as rx_missed_errors and rx_no_buffer_count are driver-specific; the counter meanings are general practice, not from the ethtool man page."},
      desc: 'NIC Descriptor Ring Buffering & Hardware Packet Drop Elimination',
      cmd: 'ethtool -S eth0 | grep -E "(drop|error|miss)" && ethtool -G eth0 rx 4096 tx 4096',
      details: 'Small RX rings overflow during bursts and show up as rx drop / no-buffer counters (names vary by driver). Read the current and maximum sizes with ethtool -g, then raise rx/tx toward the maximum the NIC reports; larger rings trade a little latency and memory for fewer drops.',
      tip: 'Rising rx_crc_errors point at the physical link (cable, optic, dirty connector); rx_missed_errors mean the NIC dropped frames because the host did not drain them in time',
      flags: [
        ['ethtool -S <dev>', 'Dump comprehensive low-level hardware MAC/PHY statistics and error counters'],
        ['ethtool -G <dev> rx <N> tx <N>', 'Set ring sizes (no larger than the maximums from ethtool -g)'],
        ['ethtool -k <dev>', 'Inspect status of hardware offloads (TSO, GSO, GRO, checksum offloading)']
      ]
    }
  },
  'ubuntu-netplan': {
    file: 'eth-netplan-systemd',
    badge: 'netp',
    name: 'Netplan & networkctl',
    heading: 'Netplan YAML Configs, networkctl State & NetworkManager CLI (nmcli)',
    proTip: {
      src: {"verified":"2026-11-10","refs":[{"url":"https://netplan.readthedocs.io/en/stable/netplan-try/","title":"netplan try"},{"url":"https://yaml.org/spec/1.2.2/","title":"YAML 1.2.2 spec (no tabs in indentation)"},{"url":"https://man7.org/linux/man-pages/man1/networkctl.1.html","title":"networkctl(1)"},{"url":"https://networkmanager.dev/docs/api/latest/nmcli.html","title":"nmcli(1)"}],"note":"Corrected 2026-11-10: YAML does not require 2-space indentation, only no tabs; netplan try defaults to 120 seconds."},
      desc: 'Safe Declarative Network Provisioning & Automated Rollback',
      cmd: 'netplan try --timeout 30 && networkctl status',
      details: 'Test remote network changes with "netplan try": it applies the YAML and rolls it back unless you confirm within the timeout (default 120 seconds), so a change that cuts your SSH session undoes itself. "networkctl status" shows link state, addresses and DNS servers.',
      tip: 'YAML forbids tabs for indentation: use spaces (any consistent amount) in /etc/netplan/*.yaml',
      flags: [
        ['netplan try', 'Apply the YAML and revert it unless you press Enter to confirm before the timeout'],
        ['networkctl status <dev>', 'Link type, state, driver, hardware and IP addresses, DNS servers'],
        ['nmcli device show', 'NetworkManager device details: MAC, state, active connection, IP settings']
      ]
    }
  },
  'iproute2': {
    file: 'eth-iproute2-ip6',
    badge: 'ip6',
    name: 'iproute2 & IPv6 NDP',
    heading: 'ip link/addr/route, IPv6 SLAAC, Jumbo MTU & Neighbor Discovery Protocol',
    proTip: {
      src: {"verified":"2026-11-10","refs":[{"url":"https://man7.org/linux/man-pages/man8/ip-address.8.html","title":"ip-address(8)"},{"url":"https://man7.org/linux/man-pages/man8/ip-link.8.html","title":"ip-link(8)"},{"url":"https://man7.org/linux/man-pages/man8/ip-neighbour.8.html","title":"ip-neighbour(8)"},{"url":"https://man7.org/linux/man-pages/man8/ip-route.8.html","title":"ip-route(8)"}],"note":"The MTU mismatch symptom (handshake works, large transfers stall) is general practice, not from the man pages."},
      desc: 'Production iproute2 CLI Operations & IPv6 Neighbor Discovery',
      cmd: 'ip -br -c a && ip -6 route show && ip -6 neigh show',
      details: 'iproute2 replaces ifconfig, route and arp. "ip -br -c a" prints one coloured line per interface with its state and addresses. "ip -6 neigh show" lists the IPv6 neighbour (NDP) cache with each entry\'s state (REACHABLE, STALE, DELAY, FAILED, ...).',
      tip: 'Always verify MTU symmetry across both ends of a link: mismatched MTUs cause TCP handshake success but silent payload drops on large packets.',
      flags: [
        ['ip -br -c link', 'Compact one-line per interface status (UP/DOWN/LOWER_UP) with color coding'],
        ['ip link set <dev> mtu 9000', 'Jumbo frames (changes state; every hop on the path must allow it)'],
        ['ip -6 route get <ip>', 'Ask kernel routing subsystem exactly which egress interface and source IP will be used']
      ]
    }
  },
  'bonding-vlans-bridges': {
    file: 'eth-bonding-vlans',
    badge: 'bond',
    name: 'LACP Bonds & VLANs',
    heading: '802.3ad Link Aggregation, 802.1Q VLAN Sub-Interfaces & Software Bridges',
    proTip: {
      src: {"verified":"2026-11-10","refs":[{"url":"https://docs.kernel.org/networking/bonding.html","title":"Linux kernel: bonding driver"},{"url":"https://github.com/torvalds/linux/blob/master/drivers/net/bonding/bond_procfs.c","title":"Linux source: bond_procfs.c (/proc/net/bonding fields)"},{"url":"https://man7.org/linux/man-pages/man8/ip-link.8.html","title":"ip-link(8)"},{"url":"https://man7.org/linux/man-pages/man8/bridge.8.html","title":"bridge(8)"}],"note":"Corrected 2026-11-10: layer3+4 does not spread a single flow, and does not balance evenly by design."},
      desc: 'High-Availability LACP Aggregation & 802.1Q Tagged VLANs',
      cmd: 'cat /proc/net/bonding/bond0 && ip link add link eth0 name eth0.100 type vlan id 100',
      details: 'LACP (802.3ad, mode 4) bundles several links into one logical link and negotiates it with the switch. /proc/net/bonding/bond0 shows each member\'s MII status, the aggregator IDs and the partner (switch) MAC: members with different aggregator IDs are not in the same LAG. 802.1Q sub-interfaces (eth0.100) separate VLANs on one link.',
      tip: 'xmit_hash_policy=layer3+4 hashes on IP and port so different flows can use different members; one flow still stays on one link, and the kernel notes it is not fully 802.3ad compliant',
      flags: [
        ['/proc/net/bonding/bond0', 'Bond mode, members, MII status, aggregator and partner details'],
        ['type vlan id <vlan>', 'Create kernel 802.1Q tagged sub-interface for VLAN trunk separation'],
        ['bridge fdb show', 'Display Layer-2 forwarding database (MAC learning table) on Linux bridge interfaces']
      ]
    }
  },
  'lldp-mtu-diag': {
    file: 'eth-lldp-perf',
    badge: 'diag',
    name: 'LLDP & Line-Rate Tests',
    heading: 'LLDP Switch Discovery, Jumbo Ping MTU Triage, iperf3 & resolvectl DNS',
    proTip: {
      src: {"verified":"2026-11-10","refs":[{"url":"https://manpages.debian.org/trixie/lldpd/lldpctl.8.en.html","title":"lldpctl(8) (lldpcli)"},{"url":"https://man7.org/linux/man-pages/man8/ping.8.html","title":"ping(8)"},{"url":"https://software.es.net/iperf/invoking.html","title":"iperf3: invoking"}],"note":"Corrected 2026-11-10: -P sets parallel streams; both directions need --bidir."},
      desc: 'Automated Switch Topology Discovery & Line-Rate Performance Validation',
      cmd: 'lldpcli show neighbors && ping -6 -M do -s 8952 <dest_ip>',
      details: 'LLDP shows what the switch advertises on that port (chassis name, port ID, often VLAN and management IP) without switch credentials, if the switch sends LLDP. To check a new NIC\'s throughput, run iperf3 with several parallel streams (-P 8); add --bidir to test both directions at once.',
      tip: 'Use "ping -M do -s 8952" (8952 payload + 40-byte IPv6 header + 8-byte ICMPv6 header = 9000 bytes) to audit MTU 9000 paths without fragmentation.',
      flags: [
        ['lldpcli show neighbors', 'What the neighbour advertises: system name, port ID, management IP'],
        ['ping -M do -s <bytes>', 'Enforce Don\'t Fragment flag to detect Path MTU Discovery blackholes'],
        ['iperf3 -6 -c <ip> -P 8', 'Run 8 parallel TCP streams over IPv6 to benchmark line-rate NIC performance']
      ]
    }
  }
};

// 5. Function to build cards for each Ethernet sub-sheet
function buildEthSectionCards(sec) {
  const cfg = SECTION_MAP[sec.id] || { file: `eth-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
  const cards = [];

  sec.commands.forEach((cmd, cIdx) => {
    // Card: Primary Command & Status Triage
    cards.push({
      id: `${sec.id}-cmd-${cIdx + 1}`,
      badge: cfg.badge,
      title: `${cfg.name}: ${cmd.desc.split('.')[0].split('(')[0].trim()}`,
      subtitle: cmd.desc,
      commands: [
        {
          id: cmd.id,
          desc: cmd.desc,
          cmd: cmd.cmd,
          diagram: cmd.diagram,
          details: cmd.details || '',
          flags: cmd.flags ? cmd.flags.slice(0, 3) : [],
          tip: cmd.tip || '',
          tags: [cfg.name, 'ethernet', 'nic', 'networking', 'linux', ...(cmd.tags || [])],
          // Where the command was checked (drawn under the card by common.js initSources).
          ...(cmd.src ? { src: cmd.src } : {})
        }
      ]
    });

    // Card: Flags & Parameter Breakdown (if more flags exist)
    if (cmd.flags && cmd.flags.length > 3) {
      cards.push({
        id: `${sec.id}-flags-${cIdx + 1}`,
        badge: cfg.badge,
        title: `${cfg.name}: Arguments & Parameters`,
        subtitle: `Key arguments, parameters, and filtering options for ${cmd.desc.split('.')[0].trim()}`,
        commands: [
          {
            id: `${cmd.id}-flags-card`,
            desc: `Options breakdown and parameter syntax for ${cmd.desc.split('.')[0].trim()}`,
            cmd: cmd.cmd,
            hideCode: !!cmd.diagram,
            flags: cmd.flags.slice(3),
            details: `Common operational and diagnostic parameters for Linux Ethernet networking.`,
            tags: [cfg.name, 'flags', 'options', 'syntax']
          }
        ]
      });
    }

    // Card: Common Recipes & Subcommands (if subcommands exist)
    if (cmd.subcommands && cmd.subcommands.length > 0) {
      cards.push({
        id: `${sec.id}-recipes-${cIdx + 1}`,
        badge: cfg.badge,
        title: `${cfg.name}: Common Recipes & Verification`,
        subtitle: `Production Ethernet commands & pipelines for ${cfg.name}`,
        commands: cmd.subcommands.map((sub, idx) => ({
          id: `${cmd.id}-sub-${idx + 1}`,
          desc: sub[1],
          cmd: sub[0],
          tags: [cfg.name, 'recipe', 'automation', 'cli'],
          // A recipe's own source (third element) wins; otherwise it shares the command's.
          ...((sub[2] || cmd.src) ? { src: sub[2] || cmd.src } : {})
        }))
      });
    }
  });

  // Pro Tips & Production Best Practices Card
  if (cfg.proTip) {
    cards.push({
      id: `${sec.id}-pro-tips`,
      badge: 'tip',
      title: `${cfg.name}: Pro Tips & Best Practices`,
      subtitle: cfg.proTip.desc,
      commands: [
        {
          id: `${sec.id}-tips-card`,
          desc: cfg.proTip.desc,
          cmd: cfg.proTip.cmd,
          details: cfg.proTip.details,
          flags: cfg.proTip.flags,
          tip: cfg.proTip.tip,
          tags: [sec.id, 'tips', 'pro', 'ethernet', 'nic', 'best-practice'],
          ...(cfg.proTip.src ? { src: cfg.proTip.src } : {})
        }
      ]
    });
  }

  return mergeCommandCards(cards);
}

// 6. Generate JS file for each Ethernet sub-sheet
function generateEthJs(sec, cards, fileKey) {
  const varName = `ETH_${fileKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`;
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for Ethernet: ${sec.title}
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

// Ethernet Command Syntax Highlighting
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

// 7. Generate HTML file for each Ethernet sub-sheet
function generateEthHtml(sec, fileKey) {
  const cfg = SECTION_MAP[sec.id] || { file: `eth-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ethernet: ${escapeHtml(cfg.name)} — ${escapeHtml(cfg.heading)}</title>
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
          <span class="prompt-symbol">ETH</span><span class="cursor-block">#</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(cfg.name)}</h1>
            <span class="version-pill">${escapeHtml(cfg.badge.toUpperCase())} / Linux Networking &amp; Datacenter Ethernet</span>
            ${EXACT_NAVBAR}
          </div>
          <p class="brand-subtitle">${escapeHtml(sec.subtitle)}</p>
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

        <button
          type="button"
          id="print-btn"
          class="print-btn"
          title="Print cheat sheet (Ctrl+P)"
          aria-label="Print cheat sheet"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>

        <button
          type="button"
          id="theme-toggle"
          class="theme-toggle-btn"
          title="Toggle light/dark theme"
          aria-label="Toggle light/dark theme"
        >
          <svg id="theme-icon-sun" class="hidden" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
          <svg id="theme-icon-moon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
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
      <h3>No matching ${escapeHtml(cfg.name)} commands</h3>
      <p>Try searching with different keywords or clear active filters.</p>
    </div>
  </main>

  <!-- Toast Notification -->
  <div id="toast" class="toast" role="status" aria-live="polite">
    <span id="toast-text"></span>
  </div>

  <footer class="page-footer">
    <div class="container footer-inner">
      <span>${escapeHtml(cfg.name)} Reference Cheat Sheet</span>
      <span>Press <kbd>/</kbd> to search &bull; Click any command to copy</span>
    </div>
  </footer>

  <script src="global-search-index.js"></script>
  <script src="common.js"></script>
  <script src="${fileKey}.js"></script>
</body>
</html>
`;
}

// 8. Generate each Ethernet sub-sheet
let createdSheets = 0;
for (const sec of ETHERNET_CHEAT_SHEET_DATA) {
  const cfg = SECTION_MAP[sec.id] || { file: `eth-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
  const fileKey = cfg.file;
  const cards = buildEthSectionCards(sec);

  const jsContent = generateEthJs(sec, cards, fileKey);
  fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), jsContent, 'utf8');

  const htmlContent = generateEthHtml(sec, fileKey);
  // Existing pages are authoritative for header/nav chrome; only create missing ones.
  if (!fs.existsSync(path.join(__dirname, `${fileKey}.html`))) fs.writeFileSync(path.join(__dirname, `${fileKey}.html`), htmlContent, 'utf8');

  createdSheets++;
  console.log(`Created ${fileKey}.html and ${fileKey}.js (${cards.length} cards)`);
}

console.log(`\nSuccessfully created ${createdSheets} standalone Ethernet cheat sheets.`);
