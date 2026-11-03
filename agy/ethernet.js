const ETHERNET_CHEAT_SHEET_DATA = [
  {
    id: "rj45-pinout-tdr",
    badge: "rj45",
    title: "RJ45 Pinouts (T568B/A) & TDR Cable Testing",
    subtitle: "8P8C wire color sequences, 100Mbps fallback diagnosis, PHY TDR cable test & port LED blink",
    commands: [
      {
        id: "rj45-t568b-t568a-chart",
        mode: "RJ45 PINOUT",
        modeClass: "mode-v",
        desc: "Complete TIA/EIA-568B vs 568A RJ45 (8P8C) wire order (Hold plug clip-down, gold pins facing you, left=Pin 1)",
        cmd: "T568B (Standard): 1:W/Org  2:Org  3:W/Grn  4:Blu  5:W/Blu  6:Grn  7:W/Brn  8:Brn\nT568A (Gov/Res):  1:W/Grn  2:Grn  3:W/Org  4:Blu  5:W/Blu  6:Org  7:W/Brn  8:Brn",
        flags: [
          ["Pair 2 (Orange) & Pair 3 (Green)", "Pins 1–2 and Pins 3–6 carry TX/RX in 10/100BASE-TX (swapping Orange & Green converts T568B ↔ T568A)"],
          ["Pair 1 (Blue: Pins 4–5)", "Center pair (Pins 4 & 5) is ALWAYS Blue / White-Blue in both T568B and T568A"],
          ["Pair 4 (Brown: Pins 7–8)", "Rightmost pair (Pins 7 & 8) is ALWAYS White-Brown / Brown in both T568B and T568A"],
          ["1G / 2.5G / 5G / 10GBASE-T", "Uses ALL 4 pairs (Pins 1–8) simultaneously in full-duplex PAM5 / PAM16"]
        ],
        tip: "Only Orange & Green swap between B and A",
        tags: ["rj45", "pinout", "t568b", "t568a", "568b", "568a", "wires", "colors", "8p8c"]
      },
      {
        id: "ethtool-cable-test-tdr",
        mode: "CABLE TEST",
        modeClass: "mode-t",
        desc: "Run built-in NIC PHY Time-Domain Reflectometer (TDR) to find broken RJ45 pins & exact distance to fault",
        cmd: "ethtool --cable-test eth0   |   ethtool --cable-test-tdr eth0",
        flags: [
          ["--cable-test", "Tests Pair A (1-2), Pair B (3-6), Pair C (4-5), Pair D (7-8) for 'OK', 'Open', or 'Short' and distance in meters!"],
          ["Why 1GbE drops to 100Mb/s", "If Pair C (Pins 4-5 Blue) or Pair D (Pins 7-8 Brown) has a bad crimp/punchdown, 1000BASE-T fails and downshifts to 100BASE-TX (which only uses Pins 1,2,3,6)!"],
          ["Split Pair Error", "Wiring Pin 3 & 4 as a pair instead of Pin 3 & 6 passes basic continuity lights but fails at 1Gbps due to severe NEXT crosstalk!"]
        ],
        tip: "Finds bad crimp distance in meters!",
        tags: ["cable-test", "tdr", "ethtool", "open", "short", "100mbps", "crimp", "rj45"]
      },
      {
        id: "ethtool-identify-blink-led",
        mode: "PHYSICAL ID",
        modeClass: "mode-n",
        desc: "Physically blink the RJ45/SFP port LED on a multi-port NIC to identify which cable is `eth0`/`eno1`",
        cmd: "ethtool -p eno1 30",
        flags: [
          ["-p <iface> 30", "Flashes the physical activity/link LED on that specific NIC port for 30 seconds"]
        ],
        tip: "Never unplug the wrong port again",
        tags: ["blink", "led", "identify", "port", "ethtool", "physical"]
      }
    ]
  },
  {
    id: "ethtool-phy-tuning",
    badge: "eth",
    title: "ethtool Link Speed, Offloads & Ring Buffers",
    subtitle: "Negotiated speed/duplex, forcing link modes, CRC error counters, ring buffers & RSS queues",
    commands: [
      {
        id: "ethtool-link-speed-autoneg",
        mode: "LINK PHY",
        modeClass: "mode-n",
        desc: "Check negotiated link speed, duplex, auto-negotiation, and link partner advertised speeds",
        cmd: "ethtool eth0   |   ethtool -r eth0   |   ethtool -s eth0 speed 1000 duplex full autoneg on",
        flags: [
          ["Link detected: yes/no", "Physical layer carrier lock status"],
          ["Link partner advertised link modes", "Shows what speeds/duplex the upstream switch port is offering"],
          ["ethtool -r <iface>", "Restart auto-negotiation on the interface"],
          ["Note on 1000BASE-T", "IEEE 802.3ab requires autoneg ON for 1000BASE-T (to negotiate Master/Slave clock timing)"]
        ],
        tags: ["speed", "duplex", "autoneg", "ethtool", "carrier", "1000base-t"]
      },
      {
        id: "ethtool-crc-drop-counters",
        mode: "COUNTERS",
        modeClass: "mode-t",
        desc: "Inspect hardware NIC MAC/PHY counters for bad cables (`rx_crc_errors`), ring drops, or pause frames",
        cmd: "ethtool -S eth0 | grep -iE 'err|drop|crc|fcs|align|miss|fifo|over|pause' | grep -v ': 0'",
        flags: [
          ["rx_crc_errors / rx_fcs_errors", "Physical layer bit corruption (bad RJ45 crimp, EMI, damaged patch cable, or dirty optic)"],
          ["rx_missed_errors / rx_no_buffer", "NIC dropped packets because host CPU/ring buffer couldn't drain frames fast enough"],
          ["tx_pause / rx_pause", "802.3x flow-control pause frames throttling traffic"]
        ],
        tip: "rx_crc_errors > 0 = replace cable",
        tags: ["crc", "fcs", "errors", "drops", "counters", "pause", "ethtool"]
      },
      {
        id: "ethtool-ring-buffers-queues",
        mode: "TUNING",
        modeClass: "mode-c",
        desc: "Inspect and increase NIC RX/TX descriptor ring buffers and multi-queue RSS channels",
        cmd: "ethtool -g eth0   |   ethtool -G eth0 rx 4096 tx 4096   |   ethtool -l eth0   |   ethtool -L eth0 combined 16",
        flags: [
          ["-g / -G", "Show / Set RX & TX ring buffer size (increasing from 512 to 4096 prevents microburst packet drops)"],
          ["-l / -L", "Show / Set number of multi-queue RSS channels (spreads IRQ softirq load across CPU cores)"],
          ["ethtool -k eth0", "Inspect hardware offloads (tcp-segmentation-offload, generic-receive-offload, rx-checksumming)"]
        ],
        tags: ["ring", "buffer", "rss", "queues", "offload", "tso", "gro", "drops"]
      },
      {
        id: "ethtool-driver-pci-bdf",
        mode: "DRIVER / PCI",
        modeClass: "mode-n",
        desc: "Identify kernel driver (`igb`, `ixgbe`, `i40e`, `ice`, `mlx5_core`, `r8169`), NIC firmware & PCI bus address",
        cmd: "ethtool -i eth0   |   lspci -nnk | grep -A3 -i net",
        flags: [
          ["driver / version / firmware-version", "Prints kernel module name, driver version, and NIC NVM/EEPROM firmware version"],
          ["bus-info", "Prints exact PCI BDF (e.g. 0000:04:00.0) to correlate with lspci -vvv"]
        ],
        tags: ["driver", "firmware", "pci", "bdf", "lspci", "ixgbe", "mlx5"]
      }
    ]
  },
  {
    id: "ubuntu-netplan",
    badge: "netp",
    title: "Ubuntu Netplan, networkctl & nmcli",
    subtitle: "/etc/netplan YAML workflow, rollback-safe netplan try, systemd-networkd & NetworkManager",
    commands: [
      {
        id: "netplan-try-apply-status",
        mode: "UBUNTU NETPLAN",
        modeClass: "mode-c",
        desc: "Validate and safely test `/etc/netplan/*.yaml` changes with automatic rollback if SSH disconnects",
        cmd: "chmod 600 /etc/netplan/*.yaml && netplan generate && netplan try --timeout 60",
        flags: [
          ["chmod 600", "Silences Netplan warning 'Permissions for /etc/netplan/*.yaml are too open'"],
          ["netplan try --timeout 60", "Applies config and waits 60s for you to press Enter; automatically reverts if you lose SSH!"],
          ["netplan status --all", "Display active addresses, routes, DNS, and underlying renderer state (Ubuntu 22.04+)"],
          ["netplan get", "Dump merged active Netplan YAML configuration across all files"]
        ],
        tip: "Always use 'netplan try' over remote SSH!",
        tags: ["netplan", "try", "apply", "ubuntu", "yaml", "rollback", "chmod"]
      },
      {
        id: "networkctl-systemd-networkd",
        mode: "NETWORKD",
        modeClass: "mode-n",
        desc: "Inspect `systemd-networkd` link state, DHCP leases, and discovered LLDP switch neighbors on Ubuntu Server",
        cmd: "networkctl list   |   networkctl status eth0   |   networkctl lldp   |   networkctl reconfigure eth0",
        flags: [
          ["networkctl status <iface>", "Shows driver, hardware MAC, IPv4/IPv6, gateway, DNS, and recent systemd-networkd log events"],
          ["networkctl lldp", "Prints connected switch hostname, port ID, and description passively received via LLDP!"],
          ["networkctl reconfigure <iface>", "Reload interface configuration without restarting all network interfaces"]
        ],
        tip: "networkctl lldp works out-of-the-box!",
        tags: ["networkctl", "networkd", "systemd", "lldp", "status", "ubuntu"]
      },
      {
        id: "nmcli-ubuntu-desktop-server",
        mode: "NMCLI",
        modeClass: "mode-c",
        desc: "Manage IPv6 Ethernet connections using NetworkManager CLI (`nmcli`) on Ubuntu Desktop or Server",
        cmd: "nmcli dev status   |   nmcli con show   |   nmcli con mod 'Wired connection 1' ipv6.addresses 2001:db8:dc:10::50/64 ipv6.gateway 2001:db8:dc:10::1 ipv6.dns '2606:4700:4700::1111' ipv6.method manual && nmcli con up 'Wired connection 1'",
        flags: [
          ["ipv6.method manual / auto / dhcp", "Set static IPv6 ('manual'), SLAAC + RA ('auto'), or stateful DHCPv6 ('dhcp')"],
          ["ipv4.method disabled", "Disable IPv4 on pure IPv6-only data center interfaces"]
        ],
        tags: ["nmcli", "networkmanager", "ipv6", "static", "slaac", "dhcpv6", "connection"]
      }
    ]
  },
  {
    id: "iproute2",
    badge: "ip6",
    title: "iproute2: IPv6 Links, Addresses, Routes & NDP",
    subtitle: "Brief color IPv6 tables (-6 -br -c), Jumbo Frame MTU 9000, IPv6 policy route lookups & NDP neighbor discovery",
    commands: [
      {
        id: "ip-brief-color-overview",
        mode: "IPROUTE2",
        modeClass: "mode-n",
        desc: "Show compact color-coded table of all network interfaces, MACs, link state, and Global/Link-Local IPv6 addresses",
        cmd: "ip -br -c link   |   ip -6 -br -c addr   |   ip -s -s link show dev eth0",
        flags: [
          ["-6 -br -c", "Brief single-line IPv6 tabular format (-6 -br) with UP/DOWN color highlighting (-c)"],
          ["scope global vs link", "Global Unicast (2000::/3) or Unique Local (fd00::/8) vs Link-Local (fe80::/10, requires %eth0 zone ID)"],
          ["-s -s link", "Detailed RX/TX byte/packet counters plus specific crc_errors, frame, fifo, and carrier_changes counts"]
        ],
        tip: "ip -6 -br -c addr shows all IPv6 prefixes cleanly",
        tags: ["ip", "ipv6", "brief", "addr", "link", "mac", "stats", "fe80"]
      },
      {
        id: "ip-mtu-up-down-addr",
        mode: "IPROUTE2",
        modeClass: "mode-c",
        desc: "Bring interface up/down, enable Jumbo Frames (`mtu 9000`), or add/remove IPv6 `/64` or `/128` addresses on the fly",
        cmd: "ip link set dev eth0 mtu 9000 up   |   ip -6 addr add 2001:db8:dc:10::50/64 dev eth0   |   ip -6 addr flush scope global dev eth0",
        flags: [
          ["mtu 9000", "Enable 9000-byte Jumbo Frames (ensure switch port & remote host also have MTU ≥ 9000)"],
          ["scope global", "Flush only global IPv6 addresses while preserving the required fe80:: link-local address!"]
        ],
        tip: "Never flush link-local fe80:: — IPv6 NDP & routing need it!",
        tags: ["mtu", "jumbo", "9000", "up", "down", "ipv6", "cidr", "flush"]
      },
      {
        id: "ip-route-get-lookup",
        mode: "IPV6 ROUTING",
        modeClass: "mode-n",
        desc: "Inspect IPv6 routing table or ask kernel which exact egress interface, next-hop (often `fe80::`), and source IPv6 will reach a target",
        cmd: "ip -6 -c route   |   ip -6 route get 2606:4700:4700::1111   |   ip -6 route replace default via fe80::1 dev eth0",
        flags: [
          ["ip -6 route get <ipv6>", "Resolves multipath/policy routing rules and prints exact 'via <next-hop> dev <if> src <ipv6>'"],
          ["via fe80::1 dev eth0", "IPv6 routers commonly route over link-local next-hops (BGP Unnumbered / RA) — always specify 'dev eth0'!"],
          ["ip -6 rule show", "List IPv6 policy-based routing (PBR) tables and priorities"]
        ],
        tip: "'ip -6 route get' debugs multi-NIC IPv6 routing",
        tags: ["route", "ipv6", "gateway", "default", "egress", "source", "pbr", "fe80"]
      },
      {
        id: "ip-neigh-arping-duplicate",
        mode: "NDP / L2",
        modeClass: "mode-t",
        desc: "Inspect IPv6 Neighbor Discovery Protocol (NDP) cache (`REACHABLE`, `STALE`, `FAILED`, `router`) or probe with `ndisc6` / `rdisc6`",
        cmd: "ip -6 -c neigh show   |   ip -6 neigh flush all   |   ndisc6 2001:db8:dc:10::1 eth0   |   rdisc6 eth0",
        flags: [
          ["ip -6 -c neigh show", "Replaces IPv4 ARP! Maps IPv6 addresses to L2 MACs and marks upstream routers with the 'router' flag"],
          ["ndisc6 <ipv6> <if>", "Send an explicit ICMPv6 Neighbor Solicitation (type 135) to resolve target IPv6's MAC address"],
          ["rdisc6 <if>", "Send an ICMPv6 Router Solicitation (type 133) to inspect switch Router Advertisement (RA) prefixes, MTU, and flags"]
        ],
        tip: "IPv6 uses ICMPv6 Neighbor Discovery (NDP) instead of ARP!",
        tags: ["ndp", "neigh", "ndisc6", "rdisc6", "ipv6", "mac", "l2", "router-advertisement"]
      }
    ]
  },
  {
    id: "bonding-vlans-bridges",
    badge: "bond",
    title: "LACP Bonding (802.3ad), 802.1Q VLANs & Bridges",
    subtitle: "/proc/net/bonding LACP health, 802.1Q tagged sub-interfaces & KVM/container bridges",
    commands: [
      {
        id: "lacp-bonding-proc-status",
        mode: "802.3AD LACP",
        modeClass: "mode-v",
        desc: "Verify LACP (`802.3ad`) bond health, Partner System MAC, Aggregator ID, and slave `Link Failure Count`",
        cmd: "cat /proc/net/bonding/bond0   |   ip -d link show bond0",
        flags: [
          ["Aggregator ID", "All active slave NICs in bond0 MUST share the same Aggregator ID; if Partner MAC is 00:00:00:00:00:00, switch port isn't running LACP!"],
          ["Link Failure Count", "Spots intermittent flapping patch cords or switch ports inside a bond"],
          ["xmit_hash_policy layer3+4", "Hashes on IP + TCP/UDP port so multiple flows between two hosts load-balance across all links"]
        ],
        tip: "Partner MAC 00:00:.. = switch LACP off",
        tags: ["bond", "lacp", "802.3ad", "bonding", "aggregator", "mlag", "port-channel"]
      },
      {
        id: "iproute2-create-bond-vlan",
        mode: "VLAN / BOND",
        modeClass: "mode-c",
        desc: "Create an 802.1Q tagged VLAN sub-interface (`eth0.100`) or LACP bond dynamically via `ip link`",
        cmd: "ip link add link eth0 name eth0.100 type vlan id 100 && ip link set eth0.100 up",
        flags: [
          ["type vlan id 100", "Tags egress frames with 802.1Q VLAN ID 100 and strips tag on ingress"],
          ["cat /proc/net/vlan/eth0.100", "Inspect 802.1Q VLAN ID, reorder header flag, and per-VLAN packet counters"]
        ],
        tags: ["vlan", "802.1q", "trunk", "tagged", "subinterface"]
      },
      {
        id: "bridge-fdb-vlan",
        mode: "LINUX BRIDGE",
        modeClass: "mode-n",
        desc: "Inspect Linux software bridge ports, learned L2 MAC forwarding database (FDB), and bridge VLANs",
        cmd: "bridge link show   |   bridge fdb show br br0   |   bridge vlan show",
        flags: [
          ["bridge link show", "Lists all member interfaces (physical NICs, veth pairs, tap VMs) enslaved to bridges"],
          ["bridge fdb show", "Displays learned MAC address table per bridge port (like 'show mac address-table' on a switch)"]
        ],
        tags: ["bridge", "br0", "fdb", "mac-table", "kvm", "veth"]
      }
    ]
  },
  {
    id: "lldp-mtu-diag",
    badge: "diag",
    title: "LLDP Switch Discovery, Jumbo Ping, iperf3 & DNS",
    subtitle: "Finding upstream switch/port without leaving the server, DF MTU ping, iperf3 & resolvectl",
    commands: [
      {
        id: "lldp-cdp-capture-switch-port",
        mode: "LLDP / CDP",
        modeClass: "mode-v",
        desc: "Identify which physical upstream switch name, port number, and native VLAN `eth0` is plugged into",
        cmd: "lldpctl eth0   |   tcpdump -nn -v -i eth0 -s 1500 -c 1 '(ether proto 0x88cc or ether[20:2] == 0x2000)'",
        flags: [
          ["lldpctl (lldpd package)", "Queries & transmits LLDP frames (prints SysName, PortID, PortDescr,MgmtIP, and PVID VLAN)"],
          ["tcpdump ether proto 0x88cc", "Zero-install trick: captures 1 raw LLDP (0x88cc) or Cisco CDP (0x2000) frame (sent every 30s by switches)"]
        ],
        tip: "Traces cables without going to the rack!",
        tags: ["lldp", "cdp", "switch", "port", "tcpdump", "lldpctl", "trace"]
      },
      {
        id: "jumbo-frame-mtu-ping",
        mode: "IPV6 MTU TEST",
        modeClass: "mode-t",
        desc: "Verify end-to-end IPv6 9000-byte Jumbo Frame path without fragmentation (`ping -6 -M do -s 8952`)",
        cmd: "ping -6 -M do -s 8952 -c 4 2001:db8:dc:10::1   |   ping -6 -M do -s 1452 -c 4 2606:4700:4700::1111",
        flags: [
          ["-6 -M do", "Force IPv6 without local fragmentation (routers never fragment IPv6 in flight; returns ICMPv6 Packet Too Big if MTU < 9000)"],
          ["-s 8952 / -s 1452", "Payload size + 8-byte ICMPv6 header + 40-byte IPv6 header = exact 9000 (Jumbo) or 1500 (Standard) frame!"]
        ],
        tip: "IPv6 header is 40B: 8952 + 48 = 9000 MTU (vs 8972 on IPv4)",
        tags: ["mtu", "jumbo", "ping", "ping6", "ipv6", "fragment", "df", "8952", "1452"]
      },
      {
        id: "iperf3-line-rate-test",
        mode: "BANDWIDTH",
        modeClass: "mode-n",
        desc: "Test IPv6 (`-6`) 1G / 10G / 25G / 100G / 400G TCP & UDP line-rate throughput and TCP retransmissions (`Retr`)",
        cmd: "# Server: iperf3 -s   |   # Client: iperf3 -6 -c 2001:db8:dc:10::1 -P 8 -t 30   |   iperf3 -6 -c 2001:db8:dc:10::1 -R",
        flags: [
          ["-6", "Use IPv6 addressing (for link-local fe80:: targets, append interface scope e.g. fe80::1%eth0)"],
          ["-P 8", "Run 8 parallel TCP streams to saturate multi-queue 10G/25G/100G/400G links"],
          ["-R (Reverse)", "Server sends, client receives (tests download direction without switching sides)"],
          ["Retr column", "Watch TCP Retransmissions column: high Retr indicates switch buffer drops or bad cable CRC errors"]
        ],
        tags: ["iperf3", "ipv6", "bandwidth", "throughput", "speedtest", "retransmissions", "10g"]
      },
      {
        id: "ubuntu-resolvectl-dns",
        mode: "UBUNTU DNS",
        modeClass: "mode-n",
        desc: "Inspect per-interface IPv6 DNS servers, query `AAAA` records, and flush cache in Ubuntu's `systemd-resolved`",
        cmd: "resolvectl status   |   resolvectl query --type=AAAA example.com   |   resolvectl flush-caches",
        flags: [
          ["resolvectl status", "Shows why /etc/resolv.conf points to 127.0.0.53 and lists actual upstream IPv6 DNS servers per NIC"],
          ["resolvectl dns eth0 2606:4700:4700::1111 2001:4860:4860::8888", "Set upstream IPv6 DNS servers for interface eth0 on the fly"]
        ],
        tags: ["dns", "ipv6", "aaaa", "resolvectl", "systemd-resolved", "127.0.0.53", "ubuntu"]
      }
    ]
  }
];

// Interactive Netplan & iproute2 Topology Generator Database
const ETH_TOPO_CONFIGS = {
  static: {
    desc: "Configure static IPv6 (/64), Jumbo MTU 9000, IPv6 default gateway, and IPv6 DNS on eth0",
    iproute2:
      "ip -6 addr add 2001:db8:dc:10::50/64 dev eth0 && ip link set dev eth0 mtu 9000 up && ip -6 route replace default via 2001:db8:dc:10::1 dev eth0 && resolvectl dns eth0 2606:4700:4700::1111 2001:4860:4860::8888",
    netplan: `cat << 'EOF' | tee /etc/netplan/01-static-ipv6.yaml && chmod 600 /etc/netplan/01-static-ipv6.yaml && netplan try
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: false
      dhcp6: false
      accept-ra: false
      mtu: 9000
      addresses:
        - "2001:db8:dc:10::50/64"
      routes:
        - to: "::/0"
          via: "2001:db8:dc:10::1"
      nameservers:
        addresses: ["2606:4700:4700::1111", "2001:4860:4860::8888"]
EOF`
  },
  lacp: {
    desc: "Configure 802.3ad LACP active-active bond0 over eth0 + eth1 with IPv6 and layer3+4 hash policy",
    iproute2:
      "ip link add bond0 type bond mode 802.3ad miimon 100 lacp_rate fast xmit_hash_policy layer3+4 && ip link set eth0 down && ip link set eth1 down && ip link set eth0 master bond0 && ip link set eth1 master bond0 && ip link set bond0 mtu 9000 up && ip -6 addr add 2001:db8:dc:10::50/64 dev bond0",
    netplan: `cat << 'EOF' | tee /etc/netplan/02-bond-ipv6.yaml && chmod 600 /etc/netplan/02-bond-ipv6.yaml && netplan try
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0: {dhcp4: false, dhcp6: false}
    eth1: {dhcp4: false, dhcp6: false}
  bonds:
    bond0:
      interfaces: [eth0, eth1]
      addresses: ["2001:db8:dc:10::50/64"]
      mtu: 9000
      parameters:
        mode: 802.3ad
        lacp-rate: fast
        transmit-hash-policy: layer3+4
        mii-monitor-interval: 100
EOF`
  },
  vlan: {
    desc: "Create 802.1Q tagged VLAN 100 sub-interface with IPv6 on trunk port eth0",
    iproute2:
      "ip link add link eth0 name eth0.100 type vlan id 100 && ip link set dev eth0 up && ip link set dev eth0.100 up && ip -6 addr add 2001:db8:dc:100::50/64 dev eth0.100",
    netplan: `cat << 'EOF' | tee /etc/netplan/03-vlan-ipv6.yaml && chmod 600 /etc/netplan/03-vlan-ipv6.yaml && netplan try
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0: {dhcp4: false, dhcp6: false}
  vlans:
    eth0.100:
      id: 100
      link: eth0
      addresses: ["2001:db8:dc:100::50/64"]
EOF`
  },
  bridge: {
    desc: "Create L2 network bridge br0 with IPv6 enslaved to eth0 (for KVM/libvirt VMs or containers)",
    iproute2:
      "ip link add name br0 type bridge && ip link set dev eth0 master br0 && ip -6 addr flush scope global dev eth0 && ip -6 addr add 2001:db8:dc:10::50/64 dev br0 && ip link set dev br0 up",
    netplan: `cat << 'EOF' | tee /etc/netplan/04-bridge-ipv6.yaml && chmod 600 /etc/netplan/04-bridge-ipv6.yaml && netplan try
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0: {dhcp4: false, dhcp6: false}
  bridges:
    br0:
      interfaces: [eth0]
      addresses: ["2001:db8:dc:10::50/64"]
      parameters:
        stp: false
        forward-delay: 0
EOF`
  }
};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("eth_cs_bookmarks") || "[]"))
};

// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const savedCountEl = document.getElementById("saved-count");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const emptyStateEl = document.getElementById("empty-state");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastTextEl = document.getElementById("toast-text");

let toastTimer = null;

function showToast(msg) {
  toastTextEl.textContent = msg;
  toastEl.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
  }, 1800);
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
    showToast("Copied to clipboard");
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightEthCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(\s\|\s|\s&&\s)|(\b(?:sudo|ethtool|netplan|networkctl|nmcli|ip|bridge|arping|lldpctl|tcpdump|ping|iperf3|resolvectl|cat|grep|chmod|tee|lspci)\b)|(\b(?:T568B|T568A|802\.3ad|802\.1Q)\b)|(\s-[a-zA-Z0-9-]+|\s--[a-zA-Z0-9-]+)/g,
    (match, sep, cmd, proto, flag) => {
      if (sep) return `<span class="tok-pipe">${sep}</span>`;
      if (cmd) return `<span class="tok-cmd">${cmd}</span>`;
      if (proto) return `<span class="tok-str">${proto}</span>`;
      if (flag) return `<span class="tok-flag">${flag}</span>`;
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = ETHERNET_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of ETHERNET_CHEAT_SHEET_DATA) {
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
    cmdObj.mode || "",
    section.title,
    ...(cmdObj.tags || []),
    ...(cmdObj.flags || []).flat()
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

function isRunnableCommand(cmd) {
  if (!cmd || typeof cmd !== 'string') return false;
  const s = cmd.trim();
  if (!s) return false;

  if (/^POST\s+0x/i.test(s)) return false;
  if (/^Stage\s+[0-9]:/i.test(s)) return false;
  if (/^1-DIMM\b/i.test(s)) return false;
  if (/^BMC_LED/i.test(s)) return false;
  if (/^BMC_RDY/i.test(s)) return false;
  if (/^Above\s+4G\b/i.test(s)) return false;
  if (/POST\s+0x[0-9A-Fa-f]{2}/.test(s) && (s.includes(" -> ") || s.includes(" | "))) return false;

  if (/^T568[AB]\b/i.test(s)) return false;

  if (/^\[Transceiver/i.test(s)) return false;
  if (/^Switch\s+Port:\s+OSFP/i.test(s)) return false;
  if (/^800G\s+Twin-Port/i.test(s)) return false;
  if (/^0\.5[–-]2\.5m:/i.test(s)) return false;
  if (/^Direct\s+Optic-to-Optic/i.test(s)) return false;
  if (/^MPO-12\b/i.test(s)) return false;
  if (/^LC\s+Duplex\b/i.test(s)) return false;
  if (/^1\.\s+Inspect\b/i.test(s)) return false;
  if (/^Check\s+DOM\s+RX/i.test(s)) return false;
  if (/^10km\s+LR4:/i.test(s)) return false;
  if (/^Tier\s+[12]\b/i.test(s)) return false;
  if (s.includes("──►") || s.includes("◄──")) return false;

  if (/^(Win|Alt|Ctrl)\+[A-Za-z0-9]/i.test(s)) return false;
  if (/[⇧⌘⌥⌃]/.test(s)) return false;
  if (/^[0-9]+-Finger\s+Swipe/i.test(s)) return false;

  return true;
}

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of ETHERNET_CHEAT_SHEET_DATA) {
    if (state.activeCategory !== "all" && state.activeCategory !== section.id) {
      continue;
    }

    const filteredCommands = section.commands.filter((cmdObj) => {
      if (state.savedOnly && !state.bookmarks.has(cmdObj.id)) {
        return false;
      }
      return matchesSearch(cmdObj, section, state.searchQuery);
    });

    if (filteredCommands.length === 0) {
      continue;
    }

    visibleCommandsCount += filteredCommands.length;

    const itemsHtml = filteredCommands
      .map((item) => {
        const isSaved = state.bookmarks.has(item.id);
        const modeHtml = item.mode
          ? `<span class="mode-pill ${item.modeClass || "mode-n"}">${escapeHtml(item.mode)}</span>`
          : "";
        const tipHtml = item.tip
          ? `<span class="tip-badge">${escapeHtml(item.tip)}</span>`
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

        const copyTarget = item.cmd.includes("   |   ")
          ? item.cmd.split("   |   ")[0].replace(/^#\s*Server:\s*/i, "").trim()
          : item.cmd.trim();

        return `
          <div class="cmd-item" data-id="${item.id}">
            <div class="cmd-top-row">
              <div class="cmd-desc">
                ${modeHtml}
                <span>${escapeHtml(item.desc)}</span>
                ${tipHtml}
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

            ${isRunnableCommand(item.cmd)
              ? `<div class="cmd-code-box" data-copy="${escapeHtml(copyTarget)}" title="Click to copy">
                  <code class="cmd-code">${highlightEthCmd(item.cmd)}</code>
                  <span class="copy-hint">Copy</span>
                </div>`
              : `<div class="cmd-code-box ref-box">
                  <code class="cmd-code">${highlightEthCmd(item.cmd)}</code>
                </div>`
            }

            ${flagsHtml}
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

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }
}

function initEthGenerator() {
  const topoEl = document.getElementById("eth-topo");
  const formatEl = document.getElementById("eth-format");
  const cmdOutputEl = document.getElementById("eth-cmd-output");
  const previewBox = document.getElementById("eth-preview-box");
  const copyBtn = document.getElementById("eth-copy-btn");
  const meaningEl = document.getElementById("eth-meaning-text");
  const presetBtns = document.querySelectorAll(".eth-preset");

  function updateEthPreview() {
    const topoKey = topoEl.value;
    const formatKey = formatEl.value;
    const cfg = ETH_TOPO_CONFIGS[topoKey] || ETH_TOPO_CONFIGS.static;
    const text = cfg[formatKey] || cfg.iproute2;

    cmdOutputEl.innerHTML = highlightEthCmd(text);
    previewBox.dataset.copy = text;
    meaningEl.textContent = cfg.desc;

    presetBtns.forEach((btn) => {
      const active = btn.dataset.topo === topoKey && btn.dataset.format === formatKey;
      btn.classList.toggle("active", active);
    });
  }

  topoEl.addEventListener("change", updateEthPreview);
  formatEl.addEventListener("change", updateEthPreview);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      topoEl.value = btn.dataset.topo;
      formatEl.value = btn.dataset.format;
      updateEthPreview();
    });
  });

  previewBox.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  updateEthPreview();
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

function applyDensity(compact) {
  state.compact = compact;
  document.body.classList.toggle("compact-mode", compact);
  densityToggleBtn.classList.toggle("active", compact);
  densityLabel.textContent = compact ? "Detailed" : "Compact";
  localStorage.setItem("linux_cs_compact", compact ? "1" : "0");
  packMasonry();
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
    const copyBox = e.target.closest(".cmd-code-box[data-copy]");
    if (copyBox && copyBox.dataset.copy) {
      copyToClipboard(copyBox.dataset.copy);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const id = bookmarkBtn.dataset.bookmarkId;
      if (state.bookmarks.has(id)) {
        state.bookmarks.delete(id);
        showToast("Removed from saved items");
      } else {
        state.bookmarks.add(id);
        showToast("Saved to bookmarks");
      }
      localStorage.setItem("eth_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      renderSections();
    }
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
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
    renderCategoryTabs();
    renderSections();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.key === "/") && document.activeElement !== searchInput) {
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

applyTheme(state.theme);
applyDensity(state.compact);
renderCategoryTabs();
renderSections();
initEthGenerator();
initMiniTabs();
initEvents();
