const SWITCH_DATA = [
  {
    id: "quantum-mlnxos-ports",
    badge: "qtm",
    title: "NVIDIA Quantum IB (MLNX-OS) — Ports, Optics & Counters",
    subtitle: "Managed QM8700 / QM9700 InfiniBand switch CLI: IB 1/1..1/64 port status, OSFP/QSFP DOM light levels, symbol errors & split ports",
    commands: [
      {
        id: "mlnxos-show-interfaces-ib",
        desc: "Show operational state, physical link state, NDR/HDR rate, and speed of all InfiniBand switch ports (IB 1/1..1/64)",
        cmd: "show interfaces ib status && show interfaces ib 1/1",
        details: "On managed NVIDIA Quantum (QM8700 HDR) and Quantum-2 (QM9700 NDR) switches running MLNX-OS, enter privileged mode with 'enable' (and 'configure terminal' for config changes). 'show interfaces ib status' lists every IB port's Operational State (Active, Armed, Init, Down), Physical State (LinkUp vs Polling), Speed (NDR 400G / HDR 200G), and Width (4x / 2x).",
        flags: [
          ["enable", "Enter Privileged EXEC mode on MLNX-OS (prompt changes from '>' to '#')"],
          ["show interfaces ib status", "Compact summary table of all IB 1/1..1/64 (or split 1/1/1..1/32/2) switch ports"],
          ["show interfaces ib 1/1", "Detailed link state, LID, physical state, speed, width, FEC, and counters for port IB 1/1"]
        ],
        subcommands: [
          ["show interfaces ib 1/1 transceiver", "Inspect OSFP/QSFP optical DOM on IB 1/1: per-lane Rx/Tx optical power (dBm), bias current, module temp, PN & SN"],
          ["show interfaces ib transceiver", "Dump optical transceiver inventory and DOM diagnostics across all populated InfiniBand switch ports"],
          ["show interfaces ib 1/1 counters", "Display IB 1/1 traffic and physical error counters (SymbolError, LinkErrorRecovery, LinkDowned, PortRcvErrors)"],
          ["clear interfaces ib 1/1 counters", "Reset hardware error counters on IB 1/1 after cleaning fiber or replacing an OSFP/QSFP module"],
          ["configure terminal ; interface ib 1/1 shutdown ; no interface ib 1/1 shutdown", "Bounce (shut / no shut) InfiniBand switch port IB 1/1 to force link retraining"],
          ["interface ib 1/1 description \"GPU-Node-01 mlx5_0\"", "Label InfiniBand switch port IB 1/1 with the connected GPU server hostname and HCA"]
        ],
        tip: "Physical 'LinkUp' + Logical 'Init' means OpenSM/UFM Subnet Manager is not reachable!",
        tags: ["nvidia", "quantum", "mlnx-os", "infiniband", "ib", "interfaces", "transceiver", "dom", "counters", "qm9700", "qm8700"]
      },
      {
        id: "mlnxos-split-ports-cable",
        desc: "Configure or inspect 2x400G (NDR) / 2x200G (HDR) twin-port OSFP/QSFP split mode and cable info on Quantum switches",
        cmd: "show system profile && show interfaces ib 1/1/1 status",
        details: "NVIDIA Quantum-2 QM9700 switches feature 32 physical OSFP cages where each 800G cage natively splits into two 4-lane 400G NDR ports (1/1/1 and 1/1/2, totaling 64x 400G NDR ports) using twin-port OSFP finned transceivers and 2x MPO-12 APC splitters.",
        flags: [
          ["show system profile", "Display active switch system profile (ib, ib-split-ready, etc.) and max port layout"],
          ["interface ib 1/1 split", "Split a 4x port into two 2x sub-ports (1/1/1 and 1/1/2) for HDR100 / NDR200 splitter cables"]
        ],
        subcommands: [
          ["show interfaces ib 1/1/1 transceiver", "Check optical DOM Tx/Rx dBm and module temperature on split sub-port IB 1/1/1"],
          ["show cables", "List all plugged InfiniBand cables/transceivers (OSFP/QSFP, active optical vs passive DAC, length, vendor PN/SN)"]
        ],
        tip: "Quantum-2 QM9700 cages house two 400G NDR ports per OSFP module (64 ports in 32 cages)",
        tags: ["nvidia", "quantum", "mlnx-os", "split", "osfp", "ndr", "hdr", "cables"]
      }
    ]
  },
  {
    id: "quantum-mlnxos-hw-sm",
    badge: "qsm",
    title: "NVIDIA Quantum IB (MLNX-OS) — Hardware, SM/UFM & Config",
    subtitle: "Inspecting PSUs, fans, temperatures, Subnet Manager (SM), UFM state, firmware & saving config on managed Quantum switches",
    commands: [
      {
        id: "mlnxos-hardware-sm-config",
        desc: "Check Quantum switch PSUs, fan trays, ASIC temperatures, Subnet Manager (SM) status, and save configuration",
        cmd: "show power && show fan && show temperature && show ib sm",
        details: "Managed Quantum switches (QM8700 / QM9700) provide full chassis environmental monitoring via MLNX-OS CLI and can optionally run an embedded Subnet Manager (though large GPU clusters typically run external NVIDIA UFM or HA OpenSM on management nodes).",
        flags: [
          ["show power", "Inspect PSU1/PSU2 AC input, DC output status, wattage consumption, and redundancy"],
          ["show fan", "Check fan tray modules, individual rotor speeds (RPM), and airflow direction (P2C vs C2P)"],
          ["show temperature", "Display Quantum switch ASIC junction temperature, board sensors, and thermal alarm thresholds"],
          ["show ib sm", "Verify whether the switch's embedded InfiniBand Subnet Manager is enabled or disabled"]
        ],
        subcommands: [
          ["show inventory && show version", "Display chassis serial number, part number (e.g., MQM9700-NS2F), MLNX-OS software version, and ASIC firmware"],
          ["show ib smgoing && sminfo", "Check which LID/GUID in the InfiniBand fabric is currently acting as the Master Subnet Manager"],
          ["configure terminal ; ib sm ; configuration write", "Enable the embedded Subnet Manager on a standalone Quantum switch and persist config"],
          ["show logging | tail -n 50", "Inspect recent MLNX-OS system logs for port flaps, thermal alerts, PSU faults, or SM traps"],
          ["configuration write", "Save running MLNX-OS configuration to startup database (equivalent to 'write memory')"],
          ["show images && boot system partition next", "Inspect installed MLNX-OS software partition images (image 1 vs image 2) for upgrades"]
        ],
        tip: "Only enable 'ib sm' on the switch if you do NOT have UFM or host-based OpenSM running!",
        tags: ["nvidia", "quantum", "mlnx-os", "power", "fan", "temperature", "sm", "opensm", "ufm", "inventory", "version"]
      }
    ]
  },
  {
    id: "quantum-unmanaged-inband",
    badge: "qib",
    title: "NVIDIA Quantum IB (Unmanaged) — Host In-Band MFT & Diagnostics",
    subtitle: "Querying externally managed Quantum switches (QM8790 / QM9790) over the IB fabric from any GPU host or UFM node using LID",
    commands: [
      {
        id: "quantum-inband-mlxlink-smpquery",
        desc: "Remotely inspect optical DOM (dBm), BER, eye opening, and port counters on an Unmanaged Quantum switch using its IB LID",
        cmd: "ibswitches && mlxlink -d lid-1 -p 1 -m -c -e",
        details: "Unmanaged NVIDIA Quantum switches (such as MQM8790 HDR and MQM9790 NDR) have no local CPU/SSH CLI—they are managed entirely in-band over the InfiniBand fabric via SMP/GMP MAD packets! From any GPU server or UFM appliance with Mellanox MFT installed, you can target any switch by its LID ('lid-<N>') and port ('-p <1..64>') to read optical transceivers, bounce ports, or check firmware.",
        flags: [
          ["ibswitches", "Discover all Quantum InfiniBand switches in the fabric along with their GUID, port count, and LID"],
          ["-d lid-<N>", "Target the remote Quantum switch in-band by its Local Identifier (e.g., -d lid-1 or hex -d lid-0x0001)"],
          ["-p <1..64>", "Specify the physical switch port number on the remote Quantum switch (1..64)"],
          ["-m -c -e", "Dump remote switch port optical module DOM (dBm/temp), BER counters, and SerDes eye grade"]
        ],
        subcommands: [
          ["mlxlink -d lid-1 -p 15 -m -c -e", "Remotely read OSFP/QSFP optical Rx/Tx power (dBm), SNR, and BER on port 15 of Quantum switch LID 1"],
          ["mlxlink -d lid-1 -p 15 -a TG", "Remotely bounce (toggle) port 15 on Quantum switch LID 1 over the InfiniBand fabric"],
          ["perfquery -x 1 15 && perfquery -R 1 15", "Read extended PMA error counters on switch LID 1 port 15, then reset (-R) its counters"],
          ["smpquery nodeinfo 1 && smpquery portinfo 1 15", "Query hardware NodeInfo and PortInfo (Active/Init state, speed, width, LID) of switch LID 1 port 15"],
          ["flint -d lid-1 q", "Query the ASIC firmware version and PSID of remote Quantum switch LID 1 in-band"],
          ["ibdiagnet --get_phy_info --get_cable_info -o /tmp/ibdiag", "Sweep all Quantum switches in the fabric and dump every switch port's optical transceiver and temperature report"]
        ],
        tip: "MQM9790 / MQM8790 switches have no SSH CLI—use 'mlxlink -d lid-<N> -p <Port>' from any host!",
        tags: ["nvidia", "quantum", "unmanaged", "mqm9790", "mqm8790", "inband", "mlxlink", "lid", "perfquery", "smpquery", "flint", "ibswitches"]
      }
    ]
  },
  {
    id: "cumulus-ports",
    badge: "nvu",
    title: "Cumulus NVUE — Port Status, Counters & Bounce",
    subtitle: "Inspecting swp* link state, speed, MTU, physical error counters & bouncing ports on NVIDIA Spectrum switches",
    commands: [
      {
        id: "nvue-show-interface",
        desc: "Show summary status of all switch ports (swp1..64) including link state, speed, MTU, and description",
        cmd: "nv show interface && nv show interface swp1",
        details: "NVIDIA Cumulus Linux 5.x+ uses NVUE ('nv' CLI) on top of Debian Linux. 'nv show interface' lists admin state (up/down), operational link state (up/down), negotiated speed (10G/25G/100G/200G/400G), MTU (9216), and port summary.",
        flags: [
          ["nv show interface", "Tabular overview of all physical (swp*), bond, bridge, and loopback interfaces"],
          ["nv show interface swp1", "Detailed configuration and operational state of port swp1"],
          ["nv show interface swp1 link", "Inspect physical link negotiation, FEC mode, speed, duplex, and link-down counter"]
        ],
        subcommands: [
          ["nv show interface swp1 link stats", "Display hardware RX/TX packets, bytes, CRC errors, drops, and symbol errors on swp1"],
          ["ip -c -br link show", "Since Cumulus is Linux, standard 'ip -c -br link' works directly on swp1..swp64!"],
          ["nv set interface swp1 link state down && nv config apply -y && sleep 2 && nv set interface swp1 link state up && nv config apply -y", "Administratively bounce (shut / no shut) switch port swp1 to force transceiver link retraining"]
        ],
        tip: "Every swp* port is also a standard Linux netdev!",
        tags: ["cumulus", "nvue", "nv", "swp", "interface", "status", "bounce", "counters"]
      }
    ]
  },
  {
    id: "cumulus-optics",
    badge: "dom",
    title: "Cumulus NVUE — Optical DOM, Transceivers & FEC",
    subtitle: "Reading SFP/QSFP/OSFP laser Tx/Rx dBm power, module temperature, part/serial numbers & FEC on Spectrum switches",
    commands: [
      {
        id: "nvue-show-transceiver",
        desc: "Inspect optical transceiver vendor, part/serial number, temperature, and per-lane Tx/Rx optical power (dBm)",
        cmd: "nv show interface swp1 transceiver && ethtool -m swp1",
        details: "Queries CMIS / SFF-8636 I2C EEPROM on the plugged-in optical module. Check 'Rx Power' across all 4 or 8 lanes: if a single lane shows < -12 dBm while others are -1.5 dBm, one fiber ribbon strand inside the MPO connector is dirty or damaged.",
        flags: [
          ["transceiver", "NVUE command showing module vendor, PN, SN, temperature, voltage, and per-channel Tx/Rx power (dBm/mW)"],
          ["ethtool -m swp1", "Direct Linux ethtool DOM dump including high/low alarm and warning thresholds"],
          ["mlxlink -d <dev> -p 1 -m -c -e", "Query Spectrum ASIC SerDes eye opening, Raw/Effective BER, and FEC counters"]
        ],
        subcommands: [
          ["nv show platform transceiver", "Summary table of all populated optical/DAC transceivers across the entire switch"],
          ["nv set interface swp1 link fec rs && nv config apply -y", "Configure Forward Error Correction (rs / baser / auto / off) on port swp1"]
        ],
        tip: "Compare Rx dBm across all 4/8 lanes to spot dirty MPO pins",
        tags: ["cumulus", "nvue", "transceiver", "optics", "dom", "dbm", "ethtool", "fec"]
      }
    ]
  },
  {
    id: "cumulus-lldp",
    badge: "lld",
    title: "Cumulus NVUE — LLDP Neighbors, MAC & ARP Tables",
    subtitle: "Mapping switch ports (swp*) to connected server hostnames/NICs via LLDP and inspecting bridge MAC & ARP entries",
    commands: [
      {
        id: "nvue-lldp-mac-arp",
        desc: "List all connected servers and Spine switches via LLDP, and search bridge MAC and IPv4/IPv6 ARP tables",
        cmd: "nv show interface lldp && lldpctl",
        details: "Essential for rack cable verification: shows every front-panel switch port (swp1..swp64) alongside the remote neighbor's hostname, port name (eth0 / enp*s0), management IP, and port description.",
        flags: [
          ["nv show interface lldp", "Compact table of all switch ports and their detected LLDP neighbor hostname and remote port"],
          ["lldpctl swp1", "Detailed IEEE 802.1AB LLDP TLV output for a specific switch port"],
          ["nv show bridge domain br_default mac-table", "Display Layer-2 MAC address learning table across VLANs and ports"]
        ],
        subcommands: [
          ["nv show vrf default router nexthop neighbor && ip -6 -c neigh show", "Display IPv6 Neighbor Discovery (NDP) table mapping server IPv6 addresses to MACs and swp* ports"],
          ["bridge fdb show | grep -i 'aa:bb:cc'", "Search the Linux kernel bridge Forwarding Database (FDB) directly for a server MAC address"]
        ],
        tip: "Run 'nv show interface lldp' to verify rack cabling matrix",
        tags: ["cumulus", "lldp", "lldpctl", "mac", "arp", "bridge", "fdb"]
      }
    ]
  },
  {
    id: "cumulus-bonds",
    badge: "lcp",
    title: "Cumulus NVUE — LACP Bonds, MLAG & VLANs",
    subtitle: "Inspecting 802.3ad LACP port-channels, MLAG dual-ToR peer health, and access/trunk VLAN assignments",
    commands: [
      {
        id: "nvue-bond-mlag-vlan",
        desc: "Verify LACP bond member links, MLAG dual-homing peer synchronization, and port VLAN trunk/access settings",
        cmd: "nv show interface bond && nv show mlag",
        details: "When a server is dual-homed to two Top-of-Rack switches via LACP, 'nv show mlag' verifies the peer-link is UP and both switches agree on MLAG bond states, while 'nv show interface <bond>' checks individual LACP actor/partner status.",
        flags: [
          ["nv show interface bond", "List all configured LACP bonds, their member swp* ports, and active/down status"],
          ["nv show mlag", "Show Multi-Chassis Link Aggregation (MLAG) peer status, peer-link bond, and backup IP health"],
          ["nv show bridge domain br_default vlan", "List all active VLAN IDs and the ports/bonds assigned to each VLAN"]
        ],
        subcommands: [
          ["cat /proc/net/bonding/bond1", "Inspect raw Linux kernel 802.3ad LACP partner MAC, aggregator ID, and link failure counters for bond1"],
          ["nv set interface swp10 bridge domain br_default access 100 && nv config apply -y", "Configure switch port swp10 as an untagged Access port in VLAN 100"]
        ],
        tip: "Check 'Link Failure Count' in /proc/net/bonding/<bond>",
        tags: ["cumulus", "bond", "lacp", "mlag", "vlan", "trunk", "access"]
      }
    ]
  },
  {
    id: "cumulus-bgp-roce",
    badge: "bgp",
    title: "Cumulus NVUE — BGP, EVPN & RoCEv2 Lossless QoS",
    subtitle: "Checking BGP Unnumbered spine/leaf peers, routing tables, and RoCEv2 Priority Flow Control (PFC) / ECN counters",
    commands: [
      {
        id: "nvue-bgp-roce-qos",
        desc: "Check BGP neighbor session states (Established), IPv4/IPv6 routes, and RoCEv2 lossless PFC/ECN congestion counters",
        cmd: "nv show vrf default router bgp neighbor && nv show qos roce",
        details: "Modern AI/GPU Ethernet fabrics (Spectrum-X / RoCEv2) use BGP Unnumbered on leaf-spine links and lossless Priority Flow Control (PFC on Priority 3) + ECN marking. Verify all BGP peers are 'Established' and check if ports are generating or receiving excessive PFC pause frames.",
        flags: [
          ["router bgp neighbor", "Display BGP peer state (Established vs Active/Connect), uptime, ASN, and prefixes received"],
          ["nv show qos roce", "Inspect RoCEv2 lossless QoS profile, PFC priority bitmask (prio 3), and ECN thresholds"],
          ["vtysh -c 'show bgp summary'", "Query underlying FRRouting (FRR) BGP daemon directly"]
        ],
        subcommands: [
          ["nv show vrf default router rib ipv6", "Display the IPv6 Routing Information Base (RIB) and ECMP next-hops (often link-local fe80:: via BGP Unnumbered)"],
          ["ethtool -S swp1 | grep -iE 'pfc|pause|ecn|discard'", "Check hardware NIC/ASIC counters on swp1 for Priority Flow Control (PFC) pause storms or buffer drops"]
        ],
        tip: "BGP state 'Active' or 'Connect' means session is DOWN!",
        tags: ["cumulus", "bgp", "evpn", "frr", "roce", "pfc", "ecn", "qos"]
      }
    ]
  },
  {
    id: "cumulus-hw-cfg",
    badge: "psu",
    title: "Cumulus NVUE — PSU/Fan Health & Config Rollback",
    subtitle: "Checking switch power supplies, fan trays, ASIC temperatures & managing NVUE configuration revisions/rollbacks",
    commands: [
      {
        id: "nvue-platform-config",
        desc: "Inspect switch PSUs, fan RPMs, thermal sensors, and safely diff, apply, or rollback NVUE config revisions",
        cmd: "nv show platform environment && nv config diff",
        details: "'nv show platform environment' checks all redundant Power Supply Units (PSUs), fan tray modules, and board/ASIC temperature sensors. In NVUE, 'nv set' stages changes in a candidate revision that you can inspect with 'nv config diff' before committing with 'nv config apply'.",
        flags: [
          ["platform environment", "Show status of all PSUs, fan trays, and thermal sensors"],
          ["nv config diff", "Show differences between the running config and pending candidate changes"],
          ["nv config apply", "Apply pending candidate configuration and save to startup"],
          ["nv config history", "List historical configuration commits with timestamps, user, and revision IDs"]
        ],
        subcommands: [
          ["nv show system && nv show platform hardware", "Show Cumulus Linux OS version, uptime, switch model, ASIC type, and serial number"],
          ["nv config rollback <revision_id>", "Roll back the switch configuration to a known-good previous revision ID"],
          ["nv config show -o commands", "Export the entire switch configuration as flat, copy-pasteable 'nv set ...' CLI commands"]
        ],
        tip: "nv config show -o commands exports clean CLI commands",
        tags: ["cumulus", "platform", "psu", "fan", "temperature", "config", "rollback"]
      }
    ]
  },
  {
    id: "arista-ports-dom",
    badge: "eos",
    title: "Arista EOS — Interface Status, Optical DOM & Counters",
    subtitle: "Checking Ethernet* link states, optical transceiver light levels (dBm), CRC/symbol errors & port bouncing",
    commands: [
      {
        id: "arista-interfaces-dom",
        desc: "Inspect Arista switch port status, SFP/QSFP/OSFP optical DOM power (dBm), and non-zero error counters",
        cmd: "show interfaces status && show interfaces Ethernet1 transceiver detail",
        details: "'show interfaces status' lists every port's description, status (connected / notconnect / errdisabled), VLAN, duplex, speed, and transceiver type. Adding 'nz' to 'show interfaces counters errors nz' prints ONLY ports with non-zero error counters!",
        flags: [
          ["status", "One-line summary per interface (connected, notconnect, disabled, errdisabled)"],
          ["transceiver detail", "Show per-lane optical Tx/Rx power (dBm), laser bias, temp, voltage, and alarm thresholds"],
          ["counters errors nz", "Display only interfaces that have non-zero FCS/CRC, symbol, Alignment, or Runt errors"]
        ],
        subcommands: [
          ["show interfaces counters errors nz", "Filter out clean ports and display ONLY ports with non-zero physical error counters"],
          ["show interfaces Ethernet1 phy detail", "Deep physical-layer SerDes, FEC codeword error, and pre/post-FEC BER diagnostics"],
          ["show inventory", "Display switch chassis serial number, PSU models/serials, and every plugged transceiver's vendor/part/serial"]
        ],
        tip: "Append 'nz' in Arista EOS to show only non-zero counters!",
        tags: ["arista", "eos", "interfaces", "transceiver", "dom", "errors", "nz", "phy"]
      }
    ]
  },
  {
    id: "arista-lldp-mlag",
    badge: "mlg",
    title: "Arista EOS — LLDP Neighbors, LACP & MLAG",
    subtitle: "Mapping connected servers (show lldp neighbors), inspecting Port-Channels, MLAG dual-ToR state & MAC/ARP tables",
    commands: [
      {
        id: "arista-lldp-portchannel-mlag",
        desc: "Verify LLDP server connections, LACP Port-Channel member states, MLAG health, and MAC/ARP tables",
        cmd: "show lldp neighbors && show port-channel summary && show mlag",
        details: "In 'show port-channel summary', 'P' next to a member port (e.g. 'Et1(P)') means it is actively bundled in the LACP Port-Channel, 'I' means Individual/standalone, 'D' means Down, and 's' means suspended due to LACP mismatch.",
        flags: [
          ["show lldp neighbors", "Map local Ethernet* ports to remote neighbor system name and remote port ID"],
          ["port-channel summary", "Show all Port-Channels (Po1..) and member port flags (P=bundled, D=down, s=suspended)"],
          ["show mlag", "Verify MLAG domain ID, peer-link state (Up), and local/remote state (Active)"]
        ],
        subcommands: [
          ["show lldp neighbors Ethernet1 detail", "Show complete LLDP chassis ID, system description, management IPv6/IPv4, and VLAN for port Ethernet1"],
          ["show mac address-table address <mac> && show ipv6 neighbors <ipv6>", "Locate which switch port or Port-Channel learned a specific server MAC or IPv6 Neighbor Discovery entry"],
          ["bash ethtool -m Ethernet1", "Drop into Arista's underlying Linux bash shell to run standard Linux utilities"]
        ],
        tip: "Member flag (P) = active in LACP; (s) = suspended!",
        tags: ["arista", "eos", "lldp", "port-channel", "lacp", "mlag", "mac", "arp"]
      }
    ]
  },
  {
    id: "arista-bgp-env",
    badge: "env",
    title: "Arista EOS — BGP, Environment, Logs & Config Diff",
    subtitle: "Checking BGP summary, PSU/fan/cooling status (show environment), syslog events & session config diffs",
    commands: [
      {
        id: "arista-bgp-environment-logs",
        desc: "Inspect IPv6/IPv4 BGP peering, chassis power/fan/temperature sensors, recent link-flap logs, and config changes",
        cmd: "show ipv6 bgp summary && show environment all && show logging last 50",
        details: "Use 'show environment all' during rack walk-throughs to verify both PSUs are 'Ok', fans are running at normal speed without airflow direction mismatches, and optic/ASIC temperatures are below alert thresholds.",
        flags: [
          ["show ipv6 bgp summary", "List all IPv6 BGP peers, ASNs, message counts, and state/prefixes received (also 'show ip bgp summary')"],
          ["show environment all", "Show power supply status/wattage, fan tray speeds, and temperature sensors"],
          ["show logging last 50", "Show the 50 most recent switch syslog messages (link flaps, transceiver insert/remove, LACP)"]
        ],
        subcommands: [
          ["show version && show boot-config", "Check Arista switch hardware model, serial number, MAC, uptime, and EOS image version"],
          ["show running-config interfaces Ethernet1", "View the exact configuration block applied to interface Ethernet1"]
        ],
        tags: ["arista", "eos", "bgp", "environment", "psu", "fan", "logging", "version"]
      }
    ]
  },
  {
    id: "nxos-ports-dom",
    badge: "nxo",
    title: "Cisco NX-OS — Interface Status, Optical DOM & Counters",
    subtitle: "Inspecting Ethernet1/* status, transceiver DOM details, error counters, and hardware inventory on Nexus 9000 switches",
    commands: [
      {
        id: "nxos-interfaces-transceiver",
        desc: "Check Cisco Nexus port status, SFP/QSFP optical DOM power (dBm) with alarm thresholds, and physical error counters",
        cmd: "show interface status && show interface Ethernet1/1 transceiver details",
        details: "On Cisco Nexus switches, 'show interface Ethernet1/1 transceiver details' prints the optical module type, serial number, and a table of Temperature, Voltage, Current, Tx Power, and Rx Power with '+'/'--' flags if any metric crosses high/low warning or alarm thresholds.",
        flags: [
          ["show interface status", "Summary of all ports (connected, notconnec, disabled, sfpAbsent, errDisabled)"],
          ["transceiver details", "Show optical DOM readings (dBm) and high/low alarm (++) and warning (+) flags"],
          ["counters errors", "Display physical layer FCS, Align, Symbol, Runt, Giant, and CRC error counters"]
        ],
        subcommands: [
          ["show interface status err-disabled", "List any switch ports shut down by error-disable (BPDU guard, link-flap, storm-control)"],
          ["show inventory all", "List chassis, linecard, PSU, fan tray, and all plugged transceiver part numbers and serial numbers"]
        ],
        tip: "'++' or '--' in DOM output indicates an active optical alarm!",
        tags: ["nxos", "cisco", "nexus", "interface", "transceiver", "dom", "errors"]
      }
    ]
  },
  {
    id: "nxos-lldp-vpc",
    badge: "vpc",
    title: "Cisco NX-OS — LLDP/CDP, LACP Port-Channel & vPC",
    subtitle: "Discovering neighbor servers/switches (lldp/cdp), checking LACP port-channel flags (P/I/D) & vPC dual-homing consistency",
    commands: [
      {
        id: "nxos-neighbors-portchannel-vpc",
        desc: "Inspect LLDP and CDP neighbors, LACP Port-Channel member states, vPC dual-ToR health, and MAC/ARP tables",
        cmd: "show lldp neighbors && show port-channel summary && show vpc",
        details: "In Cisco NX-OS 'show port-channel summary', '(P)' means the port is Up in the port-channel, '(I)' means Individual, '(D)' means Down, and '(s)' means suspended. 'show vpc' checks peer-keepalive, peer-link status, and Type-1/Type-2 configuration consistency across both ToR switches.",
        flags: [
          ["show lldp neighbors", "Display IEEE 802.1AB LLDP neighbor devices and port IDs (also check 'show cdp neighbors')"],
          ["port-channel summary", "Show Port-Channel groups (Po1..), protocol (LACP), and member status flags (P/D/I/s)"],
          ["show vpc", "Verify Virtual Port-Channel (vPC) peer-link, keepalive status, and per-vPC consistency"]
        ],
        subcommands: [
          ["show cdp neighbors detail && show lldp neighbors detail", "View detailed neighbor management IPs, OS versions, and port descriptions"],
          ["show mac address-table address <mac> && show ipv6 neighbor <ipv6>", "Trace a server MAC or IPv6 Neighbor Discovery (NDP) address to its exact Ethernet1/* or Po* interface"],
          ["show environment", "Check Nexus power supplies, fan trays, and temperature sensor status"]
        ],
        tip: "Run 'show vpc consistency-parameters global' if vPC is suspended",
        tags: ["nxos", "cisco", "lldp", "cdp", "port-channel", "lacp", "vpc", "environment"]
      }
    ]
  },
  {
    id: "sonic-cli",
    badge: "snc",
    title: "SONiC — Enterprise & Cloud Switch CLI",
    subtitle: "Inspecting Ethernet* port status, sfputil optical DOM, lldpctl neighbors, PortChannel bonds & platform sensors",
    commands: [
      {
        id: "sonic-interfaces-sfputil-lldp",
        desc: "Check SONiC switch interface status, optical transceiver DOM EEPROM (sfputil), LLDP neighbors, and PSU/fan health",
        cmd: "show interfaces status && sfputil show eeprom -d -p Ethernet0",
        details: "SONiC (Software for Open Networking in the Cloud) runs on Debian Linux using Docker containers for each network service (swss, bgp, syncd, lldp, pmon). Standard Linux commands and SONiC 'show' / 'sfputil' / 'config' CLI tools both work.",
        flags: [
          ["show interfaces status", "Display Oper/Admin state, speed (100G/400G), MTU, FEC, and alias for all Ethernet* ports"],
          ["sfputil show eeprom -d", "Dump transceiver EEPROM and Digital Optical Monitoring (-d) Tx/Rx dBm power and temperature"],
          ["show lldp table", "Compact table of local ports and connected remote LLDP neighbor hostnames and ports"]
        ],
        subcommands: [
          ["show lldp table && show lldp neighbors Ethernet0", "List all LLDP neighbors across the switch or inspect detailed TLVs on Ethernet0"],
          ["show interfaces counters errors && show pfc counters", "Inspect physical error counters and RoCEv2 Priority Flow Control (PFC) pause counters"],
          ["show platform summary && show platform psu && show platform fan && show platform temperature", "Inspect SONiC switch hardware SKU, ASIC, PSU wattage/status, fan RPMs, and board temperatures"],
          ["config interface shutdown Ethernet0 && config interface startup Ethernet0", "Bounce (shut / no shut) port Ethernet0 in SONiC and save with 'config save -y'"]
        ],
        tip: "sfputil show eeprom -d reads optical DOM on SONiC switches",
        tags: ["sonic", "sfputil", "interfaces", "lldp", "platform", "psu", "pfc"]
      }
    ]
  }
];

// Multi-Vendor Switch Command Translator Matrix
const SW_TRANSLATOR = {
  quantum_mlnxos: {
    dom: (p) => `show interfaces ib ${p && p.includes("/") ? p : "1/1"} transceiver`,
    status: (p) => `show interfaces ib status   # detail: show interfaces ib ${p && p.includes("/") ? p : "1/1"}`,
    lldp: () => `show ib neighbors   # or from host: iblinkinfo`,
    errors: (p) => `show interfaces ib ${p && p.includes("/") ? p : "1/1"} counters`,
    lacp: () => `show ib sm && show system profile`,
    env: () => `show power && show fan && show temperature && show inventory`
  },
  quantum_inband: {
    dom: (p) => `mlxlink -d lid-1 -p ${/^\d+$/.test(p) ? p : "1"} -m -c -e`,
    status: (p) => `smpquery portinfo 1 ${/^\d+$/.test(p) ? p : "1"} && ibswitches`,
    lldp: () => `iblinkinfo -S <Switch_GUID>   # or full fabric: iblinkinfo -l`,
    errors: (p) => `perfquery -x 1 ${/^\d+$/.test(p) ? p : "1"}   # reset: perfquery -R 1 ${/^\d+$/.test(p) ? p : "1"}`,
    lacp: () => `sminfo && ibstat`,
    env: () => `flint -d lid-1 q && ibdiagnet --get_phy_info`
  },
  cumulus: {
    dom: (p) => `nv show interface ${p || "swp1"} transceiver   # or: ethtool -m ${p || "swp1"}`,
    status: (p) => `nv show interface ${p || "swp1"} link`,
    lldp: (p) => `nv show interface ${p || "swp1"} lldp   # all: nv show interface lldp`,
    errors: (p) => `nv show interface ${p || "swp1"} link stats`,
    lacp: (p) => `nv show interface ${p && p.startsWith("bond") ? p : "bond1"} && nv show mlag`,
    env: () => `nv show platform environment && nv show platform transceiver`
  },
  arista: {
    dom: (p) => `show interfaces ${p && p.startsWith("Eth") ? p : "Ethernet1"} transceiver detail`,
    status: (p) => `show interfaces ${p && p.startsWith("Eth") ? p : "Ethernet1"} status`,
    lldp: (p) => `show lldp neighbors ${p && p.startsWith("Eth") ? p : "Ethernet1"} detail`,
    errors: () => `show interfaces counters errors nz`,
    lacp: () => `show port-channel summary && show mlag`,
    env: () => `show environment all && show inventory`
  },
  nxos: {
    dom: (p) => `show interface ${p && p.startsWith("Eth") ? p : "Ethernet1/1"} transceiver details`,
    status: (p) => `show interface ${p && p.startsWith("Eth") ? p : "Ethernet1/1"} status`,
    lldp: (p) => `show lldp neighbors interface ${p && p.startsWith("Eth") ? p : "Ethernet1/1"} detail`,
    errors: (p) => `show interface ${p && p.startsWith("Eth") ? p : "Ethernet1/1"} counters errors`,
    lacp: () => `show port-channel summary && show vpc`,
    env: () => `show environment && show inventory`
  },
  sonic: {
    dom: (p) => `sfputil show eeprom -d -p ${p && p.startsWith("Eth") ? p : "Ethernet0"}`,
    status: (p) => `show interfaces status ${p && p.startsWith("Eth") ? p : "Ethernet0"}`,
    lldp: (p) => `show lldp neighbors ${p && p.startsWith("Eth") ? p : "Ethernet0"}`,
    errors: () => `show interfaces counters errors`,
    lacp: () => `show interfaces portchannel`,
    env: () => `show platform psu && show platform fan && show platform temperature`
  }
};

const SW_TASK_DESC = {
  dom: "Displays SFP/QSFP/OSFP optical laser Tx/Rx power in dBm, module temperature, serial number, and vendor part number on the selected switch port.",
  status: "Checks physical carrier status (Up/Down), negotiated link speed (10G/25G/100G/400G), MTU, and FEC mode.",
  lldp: "Queries IEEE 802.1AB LLDP frames received on the switch port to identify the connected server hostname and NIC MAC/port.",
  errors: "Displays physical-layer FCS/CRC errors, symbol errors, runts, giants, and packet discards to isolate bad cables or dirty optics.",
  lacp: "Displays 802.3ad LACP Port-Channel / Bond member bundle states and MLAG/vPC dual-ToR peer health.",
  env: "Checks redundant Power Supply Units (PSUs), fan tray RPMs/airflow, and switch ASIC/transceiver temperatures."
};

const SW_DEFAULT_PORTS = {
  quantum_mlnxos: "1/1",
  quantum_inband: "1",
  cumulus: "swp1",
  arista: "Ethernet1",
  nxos: "Ethernet1/1",
  sonic: "Ethernet0"
};

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("sw_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM References
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

function showToast(message) {
  toastTextEl.textContent = message;
  toastEl.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
  }, 1900);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(`Copied: ${text.length > 42 ? text.slice(0, 42) + "…" : text}`);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copied command to clipboard");
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

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
  const totalCommands = SWITCH_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of SWITCH_DATA) {
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
      <select id="category-select" class="cat-select" aria-label="Filter by section">
        ${optionsHtml.join("")}
      </select>
      ${resetBtnHtml}
    </div>
  `;
}

function matchesSearch(cmdObj, section, query) {
  if (!query) return true;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const haystack = [
    cmdObj.desc,
    cmdObj.cmd,
    cmdObj.details || "",
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
window.addEventListener("resize", () => packMasonry());
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of SWITCH_DATA) {
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
        const dangerHtml = item.danger
          ? `<span class="danger-badge" title="${escapeHtml(item.danger)}">! ${escapeHtml(item.danger)}</span>`
          : "";
        const tipHtml = item.tip
          ? `<span class="tip-badge">${escapeHtml(item.tip)}</span>`
          : "";
        const detailsHtml = item.details
          ? `<p class="cmd-details">${escapeHtml(item.details)}</p>`
          : "";
        const flagsHtml =
          item.flags && item.flags.length
            ? `<div class="flag-pills">
                ${item.flags
                  .map(
                    ([flag, explanation]) =>
                      `<span class="flag-pill"><code>${escapeHtml(flag)}</code> <span>${escapeHtml(explanation)}</span></span>`
                  )
                  .join("")}
              </div>`
            : "";
        const subcommandsHtml =
          item.subcommands && item.subcommands.length
            ? `<div class="subcmd-list">
                <span class="subcmd-header">Subcommands &amp; Variants (click any to copy)</span>
                ${item.subcommands
                  .map(
                    ([subcmd, explanation]) =>
                      `<div class="subcmd-row" data-copy="${escapeHtml(subcmd)}" title="Click to copy subcommand">
                        <code>${escapeHtml(subcmd)}</code>
                        <span>${escapeHtml(explanation)}</span>
                      </div>`
                  )
                  .join("")}
              </div>`
            : "";

        return `
          <div class="cmd-item" data-id="${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                <span>${escapeHtml(item.desc)}</span>
                ${tipHtml}
                ${dangerHtml}
              </div>
              <div class="cmd-actions">
                <button
                  type="button"
                  class="icon-btn bookmark-btn ${isSaved ? "bookmarked" : ""}"
                  data-bookmark-id="${item.id}"
                  title="${isSaved ? "Remove bookmark" : "Bookmark command"}"
                  aria-label="Bookmark command"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(item.cmd)}" title="Click to copy command">
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
  visibleCountEl.textContent = String(visibleCommandsCount);
  savedCountEl.textContent = String(state.bookmarks.size);
  savedFilterBtn.classList.toggle("active", state.savedOnly);
  emptyStateEl.classList.toggle("hidden", visibleCommandsCount > 0);
}

function initSwTranslator() {
  const nosSelect = document.getElementById("sw-nos-select");
  const taskSelect = document.getElementById("sw-task-select");
  const portInput = document.getElementById("sw-port-input");
  const outputEl = document.getElementById("sw-builder-output");
  const descEl = document.getElementById("sw-builder-desc");
  const copyBtn = document.getElementById("sw-builder-copy");

  function update() {
    const nos = nosSelect.value;
    const task = taskSelect.value;
    const fn = SW_TRANSLATOR[nos]?.[task];
    if (!fn) return;
    outputEl.textContent = fn(portInput.value.trim());
    descEl.textContent = SW_TASK_DESC[task] || "";
  }

  nosSelect.addEventListener("change", () => {
    portInput.value = SW_DEFAULT_PORTS[nosSelect.value] || "swp1";
    update();
  });

  taskSelect.addEventListener("change", update);
  portInput.addEventListener("input", update);
  copyBtn.addEventListener("click", () => copyToClipboard(outputEl.textContent));
  update();
}

function initMiniTabs() {
  const tabs = document.querySelectorAll(".mini-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".mini-tab-panel").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      const targetPanel = document.getElementById(`panel-${tab.dataset.tab}`);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });
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

function initEvents() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    renderSections();
  });

  categoryTabsEl.addEventListener("change", (e) => {
    const sel = e.target.closest(".cat-select");
    if (!sel) return;
    state.activeCategory = sel.value;
    renderCategoryTabs();
    renderSections();
  });

  categoryTabsEl.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-cat]");
    if (!tab) return;
    state.activeCategory = tab.dataset.cat;
    renderCategoryTabs();
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
        showToast("Removed from saved commands");
      } else {
        state.bookmarks.add(id);
        showToast("Saved command to bookmarks");
      }
      localStorage.setItem("sw_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      renderSections();
    }
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    renderSections();
  });

  if (printBtn) printBtn.addEventListener("click", () => window.print());

  themeToggleBtn.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.activeCategory = "all";
    state.savedOnly = false;
    searchInput.value = "";
    renderCategoryTabs();
    renderSections();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      if (searchInput.value) {
        searchInput.value = "";
        state.searchQuery = "";
        renderSections();
      } else {
        searchInput.blur();
      }
    }
  });
}

function init() {
  applyTheme(state.theme);
  renderCategoryTabs();
  renderSections();
  initSwTranslator();
  initMiniTabs();
  initEvents();
}

init();
