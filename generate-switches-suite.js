// generate-switches-suite.js
// Generates all 15 standalone Data Center Switch cheat sheets and updates the Switches dropdown across all HTML sheets.
const fs = require('fs');
const path = require('path');
const { mergeCommandCards } = require('./generate-card-utils');

// 1. Read switches.js to extract SWITCH_DATA
const swJs = fs.readFileSync(path.join(__dirname, 'switches.js'), 'utf8');
const dataEndIdx = swJs.indexOf('const state = {');
const dataCode = swJs.slice(0, dataEndIdx) + '\nSWITCH_DATA;';
const SWITCH_DATA = eval(dataCode);
console.log(`Loaded ${SWITCH_DATA.length} Switches sections from switches.js`);


const indexHtmlForNav = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 2. Define the Switches Navbar Dropdown Snippet
const SW_NAVBAR_SNIPPET = `              <div class="nav-dropdown" id="switches-nav-dropdown">
                <a href="switches.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 24 24" width="15" height="14" fill="none" aria-hidden="true"><path d="M1 8h1.5v8H1V8zm20.5 0H23v8h-1.5V8z" fill="currentColor" opacity="0.7"/><rect x="2.5" y="6" width="19" height="12" rx="1.5" fill="#0f172a" stroke="currentColor" stroke-width="1.6"/><circle cx="5.3" cy="9.5" r="1.1" fill="#22c55e"/><circle cx="5.3" cy="14.5" r="1.1" fill="#38bdf8"/><rect x="8.2" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="11.6" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="15" y="8" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="18.4" y="8" width="2" height="2.8" rx="0.4" fill="#22c55e"/><rect x="8.2" y="13.2" width="2.4" height="2.8" rx="0.4" fill="#22c55e"/><rect x="11.6" y="13.2" width="2.4" height="2.8" rx="0.4" fill="currentColor"/><rect x="15" y="13.2" width="2.4" height="2.8" rx="0.4" fill="#22c55e"/><rect x="18.4" y="13.2" width="2" height="2.8" rx="0.4" fill="currentColor"/></svg>
                  <span>Switches</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu sw-dropdown-menu" role="menu">
                  <a href="switches.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 DC Switch Hub &amp; Multi-NOS Translator</a>
                  <div class="dropdown-divider"></div>
                  <div class="sw-dropdown-grid">
                    <div class="sw-dropdown-col">
                      <div class="sw-dropdown-heading">NVIDIA Quantum &amp; SONiC</div>
                      <a href="sw-quantum-ports.html" class="dropdown-item" role="menuitem"><code>qtm</code> <span class="cmd-desc">Quantum IB: Ports &amp; Optics</span></a>
                      <a href="sw-quantum-hw-sm.html" class="dropdown-item" role="menuitem"><code>qsm</code> <span class="cmd-desc">Quantum IB: SM, UFM &amp; HW</span></a>
                      <a href="sw-quantum-inband.html" class="dropdown-item" role="menuitem"><code>qib</code> <span class="cmd-desc">Quantum IB: In-Band MFT</span></a>
                      <a href="sw-sonic.html" class="dropdown-item" role="menuitem"><code>snc</code> <span class="cmd-desc">SONiC: Cloud NOS CLI</span></a>
                    </div>
                    <div class="sw-dropdown-col">
                      <div class="sw-dropdown-heading">Cumulus Linux (NVUE)</div>
                      <a href="sw-cumulus-ports.html" class="dropdown-item" role="menuitem"><code>nvu</code> <span class="cmd-desc">Cumulus: Port Status &amp; Bounce</span></a>
                      <a href="sw-cumulus-optics.html" class="dropdown-item" role="menuitem"><code>dom</code> <span class="cmd-desc">Cumulus: Optics DOM &amp; FEC</span></a>
                      <a href="sw-cumulus-lldp.html" class="dropdown-item" role="menuitem"><code>lld</code> <span class="cmd-desc">Cumulus: LLDP, MAC &amp; ARP</span></a>
                      <a href="sw-cumulus-bonds.html" class="dropdown-item" role="menuitem"><code>lcp</code> <span class="cmd-desc">Cumulus: MLAG Bonds &amp; VLAN</span></a>
                      <a href="sw-cumulus-bgp.html" class="dropdown-item" role="menuitem"><code>bgp</code> <span class="cmd-desc">Cumulus: BGP, EVPN &amp; RoCEv2</span></a>
                      <a href="sw-cumulus-hw.html" class="dropdown-item" role="menuitem"><code>psu</code> <span class="cmd-desc">Cumulus: PSU, Fans &amp; Config</span></a>
                    </div>
                    <div class="sw-dropdown-col">
                      <div class="sw-dropdown-heading">Arista EOS &amp; Cisco NX-OS</div>
                      <a href="sw-arista-ports.html" class="dropdown-item" role="menuitem"><code>eos</code> <span class="cmd-desc">Arista EOS: Ports &amp; DOM</span></a>
                      <a href="sw-arista-mlag.html" class="dropdown-item" role="menuitem"><code>mlg</code> <span class="cmd-desc">Arista EOS: LLDP &amp; MLAG</span></a>
                      <a href="sw-arista-bgp.html" class="dropdown-item" role="menuitem"><code>env</code> <span class="cmd-desc">Arista EOS: BGP &amp; Health</span></a>
                      <a href="sw-nxos-ports.html" class="dropdown-item" role="menuitem"><code>nxo</code> <span class="cmd-desc">Cisco NX-OS: Ports &amp; DOM</span></a>
                      <a href="sw-nxos-vpc.html" class="dropdown-item" role="menuitem"><code>vpc</code> <span class="cmd-desc">Cisco NX-OS: LLDP &amp; vPC</span></a>
                    </div>
                  </div>
                </div>
              </div>`;

// 3. Update navbar across all existing HTML files
const htmlFiles = require('./nav/targets').navFiles();   // the one nav copy, not every page
const swLinkPattern = /<a href="switches\.html" class="sheet-link(?: active)?">[\s\S]*?<\/svg>\s*Switches<\/a>/;

let updatedNavCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (swLinkPattern.test(content)) {
    content = content.replace(swLinkPattern, SW_NAVBAR_SNIPPET);
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
    updatedNavCount++;
  }
}
console.log(`Updated navbar with Switches dropdown in ${updatedNavCount} existing HTML files`);

// 4. Section mapping & file keys
const SECTION_MAP = {
  'quantum-mlnxos-ports': {
    file: 'sw-quantum-ports',
    badge: 'qtm',
    name: 'Quantum: Ports & Optics',
    heading: 'Managed MLNX-OS Port Status, Split Ports & OSFP/QSFP DOM Telemetry',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/infiniband-interface", "title": "MLNX-OS 3.12.6200: InfiniBand interface"}], "note": "Corrected 2026-11-10: removed \"restart OpenSM\", an unsourced QM8700/QM9700 split description and the show cables flag (not in the MLNX-OS manual chapters read)."},
      desc: 'NVIDIA Quantum & Quantum-2 (MLNX-OS) Port Provisioning & DOM Diagnostics',
      cmd: 'show interfaces ib 1/1 transceiver && show interfaces ib status',
      details: 'Split ports show as three-part names (IB1/1/1, IB1/1/2) in show interfaces ib status; unsplit ports as IB1/2. A port that is Active/LinkUp physically but stuck in Init logically has no Subnet Manager configuring it: check that an SM (embedded, OpenSM or UFM) is running on the fabric.',
      tip: 'Physical LinkUp + logical Init = no Subnet Manager has brought the port up. Check the SM, not the cable.',
      flags: [
        ['show interfaces ib status', 'Link state, physical state, speed and width for every IB port'],
        ['show interfaces ib 1/1 transceiver', 'Module details and DOM for one port'],
        ['show interfaces ib 1/1/1 transceiver', 'Same for one half of a split port']
      ]
    }
  },
  'quantum-mlnxos-hw-sm': {
    file: 'sw-quantum-hw-sm',
    badge: 'qsm',
    name: 'Quantum: SM, UFM & HW',
    heading: 'Quantum Chassis Environment, Embedded OpenSM, UFM Agent & Config',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/subnet-manager", "title": "MLNX-OS 3.12.6200: subnet manager"}, {"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/chassis-management", "title": "MLNX-OS 3.12.6200: chassis management"}, {"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/logging", "title": "MLNX-OS 3.12.6200: logging"}], "note": "show ib sm and show inventory are not in the MLNX-OS chapters read."},
      desc: 'Quantum MLNX-OS Subnet Manager Redundancy & Chassis Health',
      cmd: 'show ib sm && show inventory',
      details: 'NVIDIA documents the embedded MLNX-OS Subnet Manager for fabrics up to 2048 nodes on x86-based switches; larger fabrics usually run the SM on dedicated servers or UFM. The SM is disabled by default. configuration write saves the running configuration.',
      tip: 'Run one master SM and standbys, with sm-priority set so the intended master wins; if SMs restart repeatedly, NVIDIA says to check that all SM nodes are in the same IB subnet.',
      flags: [
        ['ib smnode <sm-node> enable', 'Enable the embedded Subnet Manager (NVIDIA example: ib smnode my-sm enable)'],
        ['ib smnode <sm-node> sm-priority <n>', 'Set this SM\'s priority for master election'],
        ['configuration write', 'Save the running configuration']
      ]
    }
  },
  'quantum-unmanaged-inband': {
    file: 'sw-quantum-inband',
    badge: 'qib',
    name: 'Quantum: In-Band MFT',
    heading: 'Host In-Band Remote Switch Telemetry, mlxlink & Diagnostics',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility", "title": "MFT: mlxlink"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibswitches.8.in.rst", "title": "ibswitches man page (rdma-core)"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/smpquery.8.in.rst", "title": "smpquery man page (rdma-core)"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibportstate.8.in.rst", "title": "ibportstate man page (rdma-core)"}, {"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/infiniband-interface", "title": "MLNX-OS 3.12.6200: InfiniBand interface"}], "note": "The in-band block on managed switches is from the MLNX-OS InfiniBand interface chapter."},
      desc: 'Out-of-Band vs In-Band Telemetry on Unmanaged QM8700/QM9700 Switches',
      cmd: 'mlxlink -d lid-0x0004 -p 1 --show_module --show_counters',
      details: 'Externally managed (unmanaged) Quantum switches have no management CPU or IP, so you read them in-band from a connected host with MFT, addressing the switch by LID: mlxlink -d lid-<LID> -p <port>. On managed MLNX-OS switches, in-band management is blocked by default (system manage inband-ib enables it).',
      tip: 'Obtain switch LIDs with "ibswitches" or "ibnetdiscover" before querying via host in-band MFT tools.',
      flags: [
        ['mlxlink -d lid-<LID> -p <port>', 'Read a switch port\'s module and PHY state in-band'],
        ['smpquery portinfo <LID> <port>', 'SMP PortInfo: link speed, width, state, MTU'],
        ['ibportstate <LID> <port> reset', 'Reset a switch port from a host (changes state)']
      ]
    }
  },
  'cumulus-ports': {
    file: 'sw-cumulus-ports',
    badge: 'nvu',
    name: 'Cumulus: Port Status',
    heading: 'Cumulus Linux NVUE Interface States, Speed, MTU & Bounce',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Monitoring-and-Troubleshooting/Troubleshooting-Network-Interfaces/Monitoring-Interfaces-and-Transceivers-with-NVUE/", "title": "Cumulus Linux 5.18: monitoring interfaces"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Set-and-Unset-Commands/Interface/", "title": "NVUE reference: interface set"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-1-and-Switch-Ports/Interface-Configuration-and-Management/Switch-Port-Attributes/", "title": "Cumulus Linux 5.18: switch port attributes (MTU, FEC)"}], "note": "Corrected 2026-11-10: the link state command needs \"link\"; NVUE is not \"Network Virtualization Underlay Engine\"; 9216 is already the Cumulus default MTU."},
      desc: 'Cumulus Linux NVUE Interface Configuration & Link Bouncing',
      cmd: 'nv show interface && nv set interface swp1 link state up',
      details: 'Cumulus Linux is configured with the NVUE CLI. nv set and nv unset change a pending configuration that takes effect only after nv config apply.',
      tip: 'Cumulus Linux already gives switch ports a 9216 MTU by default; set hosts to a matching jumbo MTU (for example 9000) end to end rather than raising the switch.',
      flags: [
        ['nv show interface', 'All interfaces with state, speed and MTU'],
        ['nv show interface swp1 link stats', 'Rx/Tx bytes, packets, drops and errors for one port'],
        ['nv set interface swp1 link mtu 9216', 'Set MTU explicitly (9216 is the default)']
      ]
    }
  },
  'cumulus-optics': {
    file: 'sw-cumulus-optics',
    badge: 'dom',
    name: 'Cumulus: Optics DOM & FEC',
    heading: 'Cumulus NVUE Transceiver DOM Telemetry, EEPROM & FEC RS Mode',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/", "title": "NVUE reference: platform"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-1-and-Switch-Ports/Interface-Configuration-and-Management/Switch-Port-Attributes/", "title": "Cumulus Linux 5.18: switch port attributes (MTU, FEC)"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Monitoring-and-Troubleshooting/Troubleshooting-Network-Interfaces/Monitoring-Interfaces-and-Transceivers-with-ethtool/", "title": "Cumulus Linux 5.18: ethtool"}], "note": "Corrected 2026-11-10: removed unsourced \"-2 to +2 dBm acceptable\" and \"-8 dBm\" limits, the Clause 91 label (that is 100G RS FEC), and mst/mlxcables on Cumulus."},
      desc: 'Transceiver DOM Optical Thresholds & Forward Error Correction',
      cmd: 'nv show interface swp1 transceiver && nv show interface swp1 fec',
      details: 'PAM4 links (50G per lane and faster, so 200G, 400G and 800G) depend on RS FEC; a link that comes up with clean optical power but has errors often has mismatched FEC between the two ends. Compare each lane\'s Rx power with the module\'s own warning and alarm thresholds, not a fixed number.',
      tip: 'Read the module\'s thresholds from nv show interface swp1 transceiver (or ethtool -m swp1): they differ per optic type.',
      flags: [
        ['nv show interface swp1 transceiver', 'Module type, vendor, serial, temperature, voltage and per-lane power'],
        ['nv set interface swp1 link fec rs', 'Force RS FEC (changes state; set the same on the far end)'],
        ['ethtool -m swp1', 'Raw module EEPROM and DOM from Linux']
      ]
    }
  },
  'cumulus-lldp': {
    file: 'sw-cumulus-lldp',
    badge: 'lld',
    name: 'Cumulus: LLDP, MAC & ARP',
    heading: 'Cumulus NVUE LLDP Discovery, Neighbor Audit & Forwarding Tables',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/LLDP/", "title": "NVUE reference: LLDP"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Bridge/", "title": "NVUE reference: bridge"}], "note": "Corrected 2026-11-10: NVUE has no --view lldp (the views are ber and dom); removed nv show router arp, not found in the NVUE reference."},
      desc: 'Cluster Cabling Verification & Host Discovery via LLDP',
      cmd: 'nv show interface lldp && nv show bridge domain br_default mac-table',
      details: 'Compare LLDP neighbours with the cabling plan to catch miswired GPU nodes before a job runs.',
      tip: 'Verify that server hostname, interface name, and switch port match the intended topology map.',
      flags: [
        ['nv show interface lldp', 'LLDP neighbours on all ports'],
        ['nv show interface swp1 lldp', 'LLDP settings and neighbour for one port'],
        ['nv show bridge domain br_default mac-table', 'Layer 2 forwarding table: MAC, VLAN, port']
      ]
    }
  },
  'cumulus-bonds': {
    file: 'sw-cumulus-bonds',
    badge: 'lcp',
    name: 'Cumulus: MLAG Bonds & VLAN',
    heading: 'Cumulus NVUE 802.3ad LACP Bonds, MLAG Dual-Homing & VLAN Trunks',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/MLAG/", "title": "NVUE reference: MLAG"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-2/Multi-Chassis-Link-Aggregation-MLAG/", "title": "Cumulus Linux 5.18: MLAG"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Set-and-Unset-Commands/Interface/", "title": "NVUE reference: interface set"}], "note": "Corrected 2026-11-10: NVIDIA's bond member example uses a range (swp1-4), not a comma list."},
      desc: 'High-Availability MLAG & LACP Dual-Homed Server Uplinks',
      cmd: 'nv show mlag && nv show interface bond1',
      details: 'MLAG lets a server bond to two leaf switches as one LACP partner. The pair needs a peer link, a unique MLAG system MAC per pair and a backup IP that the switches use when the peer link is down.',
      tip: 'Before enabling host bonds, check that nv show mlag reports the peer up and that both switches use the same MLAG system MAC and have the backup IP set.',
      flags: [
        ['nv show mlag', 'MLAG state, peer, backup and system MAC'],
        ['nv show interface bond1', 'Bond members and state'],
        ['nv set interface bond1 bond member swp1-2', 'Add members to a bond (changes state)']
      ]
    }
  },
  'cumulus-bgp-roce': {
    file: 'sw-cumulus-bgp',
    badge: 'bgp',
    name: 'Cumulus: BGP, EVPN & RoCEv2',
    heading: 'Cumulus NVUE BGP Unnumbered, EVPN VXLAN & RoCEv2 Lossless QoS',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-3/Border-Gateway-Protocol-BGP/Troubleshooting-BGP/", "title": "Cumulus Linux 5.18: troubleshooting BGP"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-1-and-Switch-Ports/Quality-of-Service/RDMA-over-Converged-Ethernet-RoCE/", "title": "Cumulus Linux 5.18: RoCE"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/QoS/", "title": "NVUE reference: QoS"}], "note": "Corrected 2026-11-10: replaced an unverified nv set qos pfc syntax with NVIDIA's nv set qos roce."},
      desc: 'BGP Unnumbered & RoCEv2 Lossless Buffer Configuration',
      cmd: 'nv show vrf default router bgp neighbor && nv show qos roce',
      details: 'Leaf-spine fabrics often use BGP unnumbered (IPv6 link-local peering). Cumulus RoCE lossless mode maps switch priority 3 to the RoCE traffic class with PFC and ECN, and priority 6 to CNP; nv set qos roce turns it on.',
      tip: 'The NIC must tag RoCE traffic with the same priority the switch treats as lossless (3 by default), or the traffic is not protected by PFC.',
      flags: [
        ['nv show vrf default router bgp neighbor', 'BGP neighbours and state'],
        ['nv show qos roce', 'Current RoCE mode and settings'],
        ['nv set qos roce', 'Enable RoCE lossless mode (default mode; changes state, then nv config apply)']
      ]
    }
  },
  'cumulus-hw-cfg': {
    file: 'sw-cumulus-hw',
    badge: 'psu',
    name: 'Cumulus: PSU, Fans & Config',
    heading: 'Cumulus NVUE Platform Hardware Health, Atomic Diffs & Rollback',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/", "title": "NVUE reference: platform"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Config-Commands/", "title": "NVUE reference: config commands"}], "note": "nv config apply --confirm rolls back unless confirmed within ten minutes by default. Removed 2026-11-10: an unsourced claim that a PSU failure causes immediate thermal throttling."},
      desc: 'Platform Environmental Monitoring & Safe Atomic Configuration',
      cmd: 'nv show platform && nv config diff && nv config apply',
      details: 'NVUE features atomic commit semantics. Review configuration changes with `nv config diff` before applying them with `nv config apply`. If a change causes network isolation, go back with `nv config apply <revision_id>` (list revisions with `nv config history`), or use `nv config apply --confirm` so an unconfirmed change rolls itself back.',
      tip: 'Check fans and both PSUs in nv show platform environment before and after hardware work.',
      flags: [
        ['nv show platform environment', 'Check chassis power supplies (PSU1/PSU2 status, wattage), fan RPMs, and ASIC temps'],
        ['nv config diff', 'Display line-by-line unified diff between candidate buffer and active running configuration'],
        ['nv config apply', 'Atomically validate and apply all pending NVUE configuration changes'],
        ['nv config apply <revision_id>', 'Go back to an earlier revision (nv config history lists them)']
      ]
    }
  },
  'arista-ports-dom': {
    file: 'sw-arista-ports',
    badge: 'eos',
    name: 'Arista EOS: Ports & DOM',
    heading: 'Arista EOS Interface Status, Optical DOM Diagnostics & Error Rates',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://www.arista.com/um-eos/eos-ethernet-ports", "title": "Arista EOS 4.37: Ethernet ports"}], "note": "EOS shows notconnect in examples but the page read does not define it; the meaning here is general practice."},
      desc: 'Arista EOS Interface Troubleshooting & Optical DOM Limits',
      cmd: 'show interfaces status && show interfaces transceiver detail',
      details: 'Arista EOS provides granular real-time telemetry on all QSFP-DD, OSFP, and SFP cages. Use `show interfaces transceiver detail` to check whether optical Rx power is within high/low warning and alarm thresholds.',
      tip: 'notconnect means the port has no link: check the cable, the optic and that both ends agree on speed.',
      flags: [
        ['show interfaces status', 'Compact summary table of all Ethernet interfaces: status, VLAN, duplex, speed, and media type'],
        ['show interfaces transceiver detail', 'Per-lane optical Rx/Tx power (dBm), temperature, voltage, and calibrated alarm thresholds'],
        ['show interfaces counters errors', 'Identify interfaces accumulating FCS errors, alignment errors, or symbol errors']
      ]
    }
  },
  'arista-lldp-mlag': {
    file: 'sw-arista-mlag',
    badge: 'mlg',
    name: 'Arista EOS: LLDP & MLAG',
    heading: 'Arista EOS LLDP Discovery, Port-Channel LACP Bundles & MLAG Peering',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://www.arista.com/um-eos/eos-multi-chassis-link-aggregation", "title": "Arista EOS 4.37: MLAG"}, {"url": "https://www.arista.com/um-eos/eos-port-channels-and-lacp", "title": "Arista EOS 4.37: port channels"}, {"url": "https://www.arista.com/um-eos/eos-link-layer-discovery-protocol", "title": "Arista EOS 4.37: LLDP"}]},
      desc: 'Arista EOS MLAG Health & Dual-Homed Port-Channel Bundling',
      cmd: 'show mlag && show port-channel summary && show lldp neighbors',
      details: 'Arista MLAG joins two switches over a peer link so a dual-homed server sees one LACP partner. Each peer uses the MLAG System ID (MSI), the MLAG domain\'s MAC address, in its STP and LACP PDUs.',
      tip: 'Before maintenance, show mlag should report state : Active and peer-link status : Up.',
      flags: [
        ['show mlag', 'Display MLAG domain ID, peer link status, peer address heartbeat, and local/peer state'],
        ['show port-channel summary', 'List all Port-Channels (Po1, Po10) with protocol (LACP) and member interface flags'],
        ['show lldp neighbors', 'Quick audit of adjacent hosts, switch spine nodes, and management IP addresses']
      ]
    }
  },
  'arista-bgp-env': {
    file: 'sw-arista-bgp',
    badge: 'env',
    name: 'Arista EOS: BGP & Health',
    heading: 'Arista EOS BGP EVPN Routing, Chassis Environment & Config Session',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://www.arista.com/um-eos/eos-border-gateway-protocol-bgp", "title": "Arista EOS 4.37: BGP"}, {"url": "https://www.arista.com/um-eos/eos-environment-commands", "title": "Arista EOS 4.37: environment"}], "note": "Arista refused automated reads of the configure session page, so the session commands (configure session, show session-config diffs, commit) are not checked."},
      desc: 'Arista EOS BGP State & Transactional Config Sessions',
      cmd: 'show ip bgp summary && show system environment all',
      details: 'Arista EOS supports transactional configuration via `configure session`. Changes are isolated in a private session where you can verify syntax with `show session-config diff` before committing or aborting.',
      tip: 'Always use "configure session <name>" for production changes to prevent accidental live-editing collisions.',
      flags: [
        ['show ip bgp summary', 'Summary of all IPv4 BGP neighbor sessions: peer IP, AS number, state, and prefix count'],
        ['show system environment all', 'Display real-time fan RPMs, chassis temperatures, and power supply wattage/voltage'],
        ['configure session <name> ; show session-config diff ; commit', 'Atomic configuration session with preview diff and commit']
      ]
    }
  },
  'nxos-ports-dom': {
    file: 'sw-nxos-ports',
    badge: 'nxo',
    name: 'Cisco NX-OS: Ports & DOM',
    heading: 'Cisco Nexus Interface Status, Transceiver DOM Telemetry & Counters',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_i_showcmds.html", "title": "NX-OS 10.5 show commands: interface"}], "note": "Removed 2026-11-10: an unsourced \"-14 dBm\" alarm level; thresholds come from each transceiver."},
      desc: 'Cisco Nexus NX-OS Interface Triage & Transceiver Calibration',
      cmd: 'show interface brief && show interface transceiver details',
      details: 'On Cisco Nexus 9000/3000 switches, `show interface brief` gives a quick snapshot of link status and speed. `show interface transceiver details` prints per-lane optical levels alongside warning/alarm thresholds calibrated to the optical transceiver part.',
      tip: 'If Rx power is in the module\'s warning or alarm range, clean and inspect the fiber and check for tight bends before replacing the optic.',
      flags: [
        ['show interface brief', 'Summary list of Ethernet, Port-Channel, and management interfaces with status and speed'],
        ['show interface transceiver details', 'Detailed optical Tx/Rx power (dBm), temperature, voltage, and threshold alarms'],
        ['show interface counters errors', 'Display CRC, input error, and frame alignment error counts across all switch ports']
      ]
    }
  },
  'nxos-lldp-vpc': {
    file: 'sw-nxos-vpc',
    badge: 'vpc',
    name: 'Cisco NX-OS: LLDP & vPC',
    heading: 'Cisco Nexus LLDP/CDP Neighbors, Port-Channel & Virtual Port-Channel',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_v_showcmds.html", "title": "NX-OS 10.5 show commands: vPC"}, {"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_l_showcmds.html", "title": "NX-OS 10.5 show commands: LLDP"}], "note": "The vPC configuration guide (Type 1/2 consistency, peer-keepalive role) could not be read; only the show command reference was checked."},
      desc: 'Cisco Nexus Virtual Port-Channel (vPC) Consistency & Peer Keepalive',
      cmd: 'show vpc && show vpc consistency-parameters global',
      details: 'Cisco vPC provides active-active dual-homing without Spanning Tree loop blocking. The vPC peer-keepalive link exchanges heartbeats out-of-band to prevent split-brain scenarios if the high-speed vPC peer-link fails.',
      tip: 'Verify "vPC domain role: primary/secondary" and ensure no Type 1 consistency parameter failures exist.',
      flags: [
        ['show vpc', 'Overview of vPC domain status, peer link status, peer keepalive status, and vPC interface bundle states'],
        ['show vpc consistency-parameters global', 'Verify STP, MTU, and VLAN consistency between the two vPC peer switches'],
        ['show lldp neighbors', 'List discovered physical neighbors with device ID, port ID, and capabilities']
      ]
    }
  },
  'sonic-cli': {
    file: 'sw-sonic',
    badge: 'snc',
    name: 'SONiC: Cloud NOS CLI',
    heading: 'SONiC Cloud NOS Interface Status, sfputil DOM, LLDP & Containers',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://github.com/sonic-net/sonic-utilities/blob/master/doc/Command-Reference.md", "title": "SONiC command reference"}, {"url": "https://github.com/sonic-net/SONiC/wiki/Architecture", "title": "SONiC architecture (containers)"}], "note": "Corrected 2026-11-10: orchagent is a process in the swss container, not a container."},
      desc: 'SONiC NOS Architecture, Interface Management & Container Diagnostics',
      cmd: 'show interfaces status && show interfaces transceiver eeprom --dom && docker ps',
      details: 'SONiC runs on Debian Linux with its functions in Docker containers (swss, syncd, teamd, bgp, lldp, pmon, database and others). syncd programs the ASIC through SAI (Switch Abstraction Interface).',
      tip: 'If forwarding or telemetry stalls, docker ps shows whether swss, syncd and bgp are up; orchagent runs inside swss.',
      flags: [
        ['show interfaces status', 'Admin and oper state, lanes, speed, MTU, alias and type (FEC: show interfaces fec status)'],
        ['show interfaces transceiver eeprom --dom <port>', 'Module EEPROM, vendor info and DOM'],
        ['show lldp table', 'Summary of LLDP neighbours'],
        ['docker ps', 'SONiC containers and their uptime (swss, syncd, teamd, bgp, ...)']
      ]
    }
  }
};

// 5. Function to build cards for each Switch sub-sheet
function buildSwSectionCards(sec) {
  const cfg = SECTION_MAP[sec.id] || { file: `sw-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
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
          details: cmd.details || '',
          flags: cmd.flags ? cmd.flags.slice(0, 3) : [],
          tip: cmd.tip || '',
          tags: [cfg.name, 'switch', 'nos', 'cli', 'triage', ...(cmd.tags || [])],
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
        title: `${cfg.name}: Flags & Options Reference`,
        subtitle: `Key arguments, parameters, and filtering flags for ${cmd.desc.split('.')[0].trim()}`,
        commands: [
          {
            id: `${cmd.id}-flags-card`,
            desc: `Options breakdown and parameter syntax for ${cmd.desc.split('.')[0].trim()}`,
            cmd: cmd.cmd,
            flags: cmd.flags.slice(3),
            details: `Common operational, diagnostic, and filtering arguments on production data center fabrics.`,
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
        subtitle: `Production CLI commands, transceivers & diagnostic workflows for ${cfg.name}`,
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
          tags: [sec.id, 'tips', 'pro', 'switches', 'fabric', 'best-practice'],
          ...(cfg.proTip.src ? { src: cfg.proTip.src } : {})
        }
      ]
    });
  }

  return mergeCommandCards(cards);
}

// 6. Generate JS file for each Switch sub-sheet
function generateSwJs(sec, cards, fileKey) {
  const varName = `SW_${fileKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`;
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for Switches: ${sec.title}
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

// Switch NOS Command Syntax Highlighting
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
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <span class="copy-hint">Copy</span>',
        '  </div>',
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

// 7. Generate HTML file for each Switch sub-sheet
function generateSwHtml(sec, fileKey) {
  const cfg = SECTION_MAP[sec.id] || { file: `sw-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Switches: ${escapeHtml(cfg.name)} — ${escapeHtml(cfg.heading)}</title>
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
          <span class="prompt-symbol">SW</span><span class="cursor-block">#</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(cfg.name)}</h1>
            <span class="version-pill">${escapeHtml(cfg.badge.toUpperCase())} / DC NOS &amp; Fabric</span>
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

// 8. Generate each Switch sub-sheet
let createdSheets = 0;
for (const sec of SWITCH_DATA) {
  const cfg = SECTION_MAP[sec.id] || { file: `sw-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
  const fileKey = cfg.file;
  const cards = buildSwSectionCards(sec);

  const jsContent = generateSwJs(sec, cards, fileKey);
  fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), jsContent, 'utf8');

  const htmlContent = generateSwHtml(sec, fileKey);
  // Existing pages are authoritative for header/nav chrome; only create missing ones.
  if (!fs.existsSync(path.join(__dirname, `${fileKey}.html`))) fs.writeFileSync(path.join(__dirname, `${fileKey}.html`), htmlContent, 'utf8');

  createdSheets++;
  console.log(`Created ${fileKey}.html and ${fileKey}.js (${cards.length} cards)`);
}

console.log(`\nSuccessfully created ${createdSheets} standalone Switch cheat sheets.`);
