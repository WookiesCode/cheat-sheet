const IB_DATA = [
  {
    part: "ib-ibstat",
    id: "ibstat",
    badge: "ibs",
    title: "ibstat — HCA Port State, Rate, LID & GUID",
    subtitle: "Inspecting InfiniBand / RoCEv2 HCA port state (Active vs Init vs Down), physical link state, NDR/HDR rate & LIDs",
    commands: [
      {
        id: "ibstat-status-triage",
        desc: "Inspect all local InfiniBand/RoCE Host Channel Adapters (HCAs), port state, negotiated link rate, LID, and GUIDs",
        cmd: "ibstat && ibstatus",
        details: "Always check two lines per port in 'ibstat': (1) 'Physical state' must be 'LinkUp' (if 'Polling', there is no optical light or cable is unplugged). (2) 'State' must be 'Active' (if 'Physical state: LinkUp' but 'State: Initializing', the physical cable is fine, but the Subnet Manager OpenSM/UFM is down or unreachable!).",
        flags: [
          ["ibstat <ca>", "Show detailed CA type, firmware version, Node/System GUID, and port state for a specific HCA (e.g. mlx5_0)"],
          ["-l", "List only the names of all discovered InfiniBand HCA devices"],
          ["-p", "Display a list of port GUIDs only"],
          ["ibstatus", "Concise shell script wrapper showing active state, LID, SM LID, rate (400 Gbps NDR), and link_layer"]
        ],
        subcommands: [
          ["ibstat | grep -E 'CA |Port |State:|Physical state:|Rate:|Base lid:|Link layer:'", "Condensed multi-HCA summary of all 8 GPU-facing rail HCAs on a compute node"],
          ["ibstat -l", "Print a simple list of all local HCA device names (mlx5_0 .. mlx5_7)"]
        ],
        tip: "LinkUp + State:Init = Subnet Manager (OpenSM/UFM) is not active!",
        tags: ["ibstat", "ibstatus", "hca", "linkup", "active", "init", "ndr", "hdr", "lid", "guid"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibstat.8.in.rst", "title": "ibstat man page (rdma-core)"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibstatus.8.in.rst", "title": "ibstatus man page (rdma-core)"}]}
      }
    ]
  },
  {
    part: "ib-ibv-devinfo",
    id: "ibv-devinfo",
    badge: "ibv",
    title: "ibv_devinfo — RDMA Verbs, MTU & RoCEv2 GID Table",
    subtitle: "Checking RDMA verbs readiness (PORT_ACTIVE), active_mtu (4096), GID index tables & show_gids for RoCEv2",
    commands: [
      {
        id: "ibv-devinfo-gids",
        desc: "Verify RDMA Verbs layer health, active MTU (4096), transport type, and RoCEv2 GID index table",
        cmd: "ibv_devinfo -v && ibv_devices",
        details: "Queries the user-space RDMA Verbs driver (libibverbs). Verify 'state: PORT_ACTIVE (4)', 'active_mtu: 4096 (5)', and check 'link_layer' ('InfiniBand' vs 'Ethernet'). On RoCEv2 Ethernet fabrics, inspect the GID table so NCCL uses the RoCEv2 IPv4-mapped GID index (typically index 3).",
        flags: [
          ["-d <dev>", "Query a specific RDMA device (e.g. ibv_devinfo -d mlx5_0)"],
          ["-v", "Verbose: print max_qp, max_mr, vendor_id, fw_ver, board_id (PSID), and GID table entries"],
          ["ibv_devices", "List all RDMA devices visible to user-space verbs applications and their node GUIDs"]
        ],
        subcommands: [
          ["show_gids", "Display full Global Identifier (GID) table across all mlx5 ports with IPv4/IPv6 addresses and RoCE v1/v2 version", {"verified": "2026-11-09", "refs": [], "note": "show_gids is not described in the MLNX_OFED docs read; the sysfs GID table below is."}],
          ["grep -H . /sys/class/infiniband/mlx5_*/ports/1/gid_attrs/types/* 2>/dev/null | grep 'RoCE v2'", "Find which GID index numbers are configured for 'RoCE v2' directly via sysfs (when show_gids is absent)", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxofedswum/24.10-5.1.6.1lts/rdma-over-converged-ethernet-roce", "title": "MLNX_OFED: RoCE"}]}]
        ],
        tip: "RoCEv2 requires GID index matching 'RoCE v2' + IPv4 address",
        tags: ["ibv_devinfo", "ibv_devices", "show_gids", "rdma", "verbs", "gid", "rocev2", "mtu"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/libibverbs/man/ibv_devinfo.1", "title": "ibv_devinfo man page (rdma-core)"}], "note": "The ibv_devices man page does not mention node GUIDs."}
      }
    ]
  },
  {
    part: "ib-rdma",
    id: "rdma",
    badge: "rdm",
    title: "rdma — Kernel RDMA Subsystem & Netdevice Mapping",
    subtitle: "Mapping mlx5_* RDMA devices to Linux network interfaces (ib0 / eth0), checking adaptive routing & resource counters",
    commands: [
      {
        id: "rdma-link-res-stat",
        desc: "Map RDMA devices (mlx5_0/1) to their corresponding Linux network interfaces (ib0/enp*s0) and inspect active QPs/MRs",
        cmd: "rdma link show && rdma dev show && rdma statistic show",
        details: "Part of iproute2. 'rdma link show' is the fastest way on Ubuntu to see which 'mlx5_X' RDMA device corresponds to which 'netdev' interface name (e.g. 'link mlx5_0/1 state ACTIVE physical_state LINK_UP netdev ib0'), plus active Queue Pairs (QP) and Memory Regions (MR).",
        flags: [
          ["link show", "Map every RDMA port (mlx5_X/1) to its state, physical_state, and Linux netdev (ib0 / eth0)"],
          ["dev show", "Show RDMA device node_guid, sys_image_guid, and adaptive-routing/caps flags"],
          ["res show qp", "List active RDMA Queue Pairs (QPs), owning PIDs, and state (RTS/RTR)"],
          ["statistic show", "Dump hardware RDMA RoCE/IB transport counters (rx_write_requests, out_of_sequence, duplicate_request)"]
        ],
        subcommands: [
          ["rdma res show cm_id", "Show active RDMA Connection Manager IDs, local/remote IPs, and owning process PIDs"],
          ["rdma system show", "Check whether the kernel RDMA netns mode is set to 'exclusive' or 'shared'", {"verified": "2026-11-09", "refs": [{"url": "https://man7.org/linux/man-pages/man8/rdma-system.8.html", "title": "rdma system (iproute2)"}]}]
        ],
        tip: "rdma link show maps mlx5_X directly to netdev ibX/ethX",
        tags: ["rdma", "mlx5", "netdev", "ib0", "qp", "mr", "counters"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://man7.org/linux/man-pages/man8/rdma-link.8.html", "title": "rdma link (iproute2)"}, {"url": "https://man7.org/linux/man-pages/man8/rdma-dev.8.html", "title": "rdma dev"}, {"url": "https://man7.org/linux/man-pages/man8/rdma-resource.8.html", "title": "rdma resource"}, {"url": "https://man7.org/linux/man-pages/man8/rdma-statistic.8.html", "title": "rdma statistic"}]}
      }
    ]
  },
  {
    part: "ib-iblinkinfo",
    id: "iblinkinfo",
    badge: "lnk",
    title: "iblinkinfo & ibnetdiscover — Fabric Topology & Link Audit",
    subtitle: "Mapping every switch-to-HCA and switch-to-switch link across the InfiniBand fabric & spotting degraded link widths",
    commands: [
      {
        id: "iblinkinfo-topology",
        desc: "Query the InfiniBand fabric and print every switch port's link speed, width (4X), state, and connected neighbor HCA/switch",
        cmd: "iblinkinfo -l",
        details: "Queries the IB fabric via SMP MADs to display every link on every switch. Adding '-l' prints one complete link per line (`Switch Port -> Speed Width State -> Remote HCA/Switch`), making it trivial to grep for links that trained at '1X' or '2X' instead of '4X' or downgraded from '100.0 Gbps (NDR)' to '50.0 Gbps (HDR)'.",
        flags: [
          ["-l", "Line-mode: print complete switch-to-neighbor link details on a single greppable line"],
          ["-S <guid> / -D", "Query only the switch specified by GUID (-S) or direct route (-D)"],
          ["-p", "Print additional switch port settings (hoqlife, vl_stall)"],
          ["-C <ca> -P <port>", "Run fabric discovery out of a specific local HCA and port (e.g. -C mlx5_0 -P 1)"]
        ],
        subcommands: [
          ["iblinkinfo -l | grep -vE '4X.*Active|Down'", "Find any active fabric links running at degraded lane width (1X/2X) or stuck in Init/Armed state"],
          ["ibnetdiscover -p", "Generate a concise port-by-port topology map of all switches (SW) and Channel Adapters (CA) in the subnet"]
        ],
        tip: "iblinkinfo -l maps exact switch port to server hostname!",
        tags: ["iblinkinfo", "ibnetdiscover", "topology", "fabric", "switch", "4x", "downgraded"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/iblinkinfo.8.in.rst", "title": "iblinkinfo man page (rdma-core)"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibnetdiscover.8.in.rst", "title": "ibnetdiscover man page (rdma-core)"}], "note": "-C/-P/-D come from the shared infiniband-diags options; the iblinkinfo page does not list them."}
      }
    ]
  },
  {
    part: "ib-ibswitches",
    id: "ibswitches",
    badge: "sw",
    title: "ibswitches & ibhosts — Fabric Node Inventory",
    subtitle: "Listing all InfiniBand switches (Quantum/Quantum-2) and compute node HCAs discovered in the fabric with LIDs & GUIDs",
    commands: [
      {
        id: "ibswitches-ibhosts-list",
        desc: "List all InfiniBand switches and all compute host HCAs visible on the current InfiniBand rail/subnet",
        cmd: "ibswitches && ibhosts",
        details: "Scans the InfiniBand subnet and prints the GUID, port count, node description (switch hostname or server hostname + mlx5_X), and LID for every switch ('ibswitches') and every server HCA ('ibhosts').",
        flags: [
          ["ibswitches", "List all IB switch nodes in the fabric with Switch GUID, port count, NodeDescription, and LID"],
          ["ibhosts", "List all Host Channel Adapter (CA) nodes in the fabric with GUID, port count, hostname, and LID"],
          ["ibnodes", "Combined list of both switches and host CAs"]
        ],
        subcommands: [
          ["ibhosts -C mlx5_0 -P 1 | wc -l", "Count total compute HCA ports visible on Rail 0 (mlx5_0) to verify all servers are online", {"verified": "2026-11-09", "refs": [], "note": "ibhosts does not document -C/-P (they are shared infiniband-diags options): check ibhosts -h."}]
        ],
        tip: "Run per rail (-C mlx5_0 .. mlx5_7) on multi-rail GPU clusters",
        tags: ["ibswitches", "ibhosts", "ibnodes", "inventory", "quantum", "lid", "guid"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibswitches.8.in.rst", "title": "ibswitches man page (rdma-core)"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibhosts.8.in.rst", "title": "ibhosts man page (rdma-core)"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibnodes.8.in.rst", "title": "ibnodes man page (rdma-core)"}]}
      }
    ]
  },
  {
    part: "ib-sminfo",
    id: "sminfo",
    badge: "sm",
    title: "sminfo & saquery — Subnet Manager & SA Verification",
    subtitle: "Identifying the active Master Subnet Manager (OpenSM / UFM) LID, GUID, priority & activity count",
    commands: [
      {
        id: "sminfo-master-check",
        desc: "Query the active InfiniBand Subnet Manager (SM) LID, GUID, priority, and state (MASTER vs STANDBY)",
        cmd: "sminfo && saquery -s",
        details: "Every InfiniBand subnet requires an active Subnet Manager (OpenSM on a switch/host or NVIDIA UFM) to assign LIDs and program switch forwarding tables. 'sminfo' shows which LID and GUID is currently the MASTER SM and its activity counter.",
        flags: [
          ["sminfo", "Print SM LID, SM GUID, activity count, priority (0–15, higher wins), and state (3=MASTER, 2=STANDBY)"],
          ["saquery -s", "Ask the SA for the PortInfo records of ports that run an SM (isSM capability bit): every Master and Standby SM port"]
        ],
        subcommands: [
          ["systemctl status opensm.service", "Check if the local OpenSM Subnet Manager daemon is running on this host", {"verified": "2026-11-09", "refs": [], "note": "The OpenSM service name is not documented in the OpenSM repo read; it depends on your distro/package."}],
          ["saquery -m", "Query Subnet Administrator for all InfiniBand multicast group memberships", {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/saquery.8.in.rst", "title": "saquery man page (rdma-core)"}]}]
        ],
        tip: "saquery -s lists both the Master SM and all Standby SMs",
        tags: ["sminfo", "saquery", "opensm", "ufm", "subnet-manager", "master", "lid"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/sminfo.8.in.rst", "title": "sminfo man page (rdma-core)"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/saquery.8.in.rst", "title": "saquery man page (rdma-core)"}], "note": "State numbers (2 = standby, 3 = master) come from sminfo -s; the page does not describe its output fields."}
      }
    ]
  },
  {
    part: "ib-perfquery",
    id: "perfquery",
    badge: "prf",
    title: "perfquery — IB Port Error & Traffic Counters",
    subtitle: "Reading & resetting (-R) PortCounters for SymbolErrors, LinkDowned, PortRcvErrors, PortXmitDiscards & PortXmitWait",
    commands: [
      {
        id: "perfquery-counters-reset",
        desc: "Read or reset hardware Performance Management (PMA) error and throughput counters on local or remote IB LIDs",
        cmd: "perfquery -x && perfquery -x <LID> <PORT>",
        details: "InfiniBand PMA error counters saturate (stick at their max value, e.g., 65535 for 16-bit counters) until explicitly reset with 'perfquery -R'. Always pass '-x' to read 64-bit extended counters, and inspect 'SymbolErrorCounter', 'LinkDownedCounter', 'PortRcvErrors', and 'PortXmitDiscards'.",
        flags: [
          ["-x", "Query extended 64-bit port counters"],
          ["<lid> <port>", "Query a specific remote switch or HCA LID and port number (omit to query local HCA port)"],
          ["-R", "Reset (clear to 0) hardware counters on the target LID/port so you can see if errors are still incrementing"],
          ["-a", "Aggregated counters for all ports of the target LID (-l lists each port separately)"]
        ],
        subcommands: [
          ["perfquery -R -a <LID>", "Clear all latched PMA error counters across all ports on target LID", {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/perfquery.8.in.rst", "title": "perfquery man page (rdma-core)"}], "note": "Combining -R with -a is not shown as an example; -R is \"only reset counters\"."}],
          ["perfquery --oprcvcounters <LID> <PORT>", "Receive counters per opcode (an optional counter: not every device has it)"]
        ],
        tip: "16-bit IB counters saturate at 65535 — use -R to clear after fixing!",
        tags: ["perfquery", "counters", "errors", "symbolerror", "linkdowned", "xmitdiscards", "reset"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/perfquery.8.in.rst", "title": "perfquery man page (rdma-core)"}], "note": "Corrected 2026-11-09: --oprcv is --oprcvcounters (per-opcode receive counters)."}
      }
    ]
  },
  {
    part: "ib-ibqueryerrors",
    id: "ibqueryerrors",
    badge: "err",
    title: "ibqueryerrors — Fabric-Wide Error & Flap Scanner",
    subtitle: "Scanning all switches and HCAs in the subnet for non-zero symbol errors, link flaps, CRC errors & cable details",
    commands: [
      {
        id: "ibqueryerrors-fabric-scan",
        desc: "Scan the entire InfiniBand fabric and report only switch/HCA ports with non-zero error counters and their connected peer",
        cmd: "ibqueryerrors --data --details",
        details: "Walks the entire IB subnet and queries PMA counters on every switch and HCA port, printing ONLY ports that have exceeded error thresholds along with the exact connected neighbor hostname/port so the tech knows which cable to clean or swap.",
        flags: [
          ["--data", "Include 64-bit data throughput counters alongside error counters"],
          ["--details", "Include transceiver/cable details and error threshold explanations"],
          ["-s RcvSwRelayErrors,XmitWait", "Suppress common non-fatal congestion/relay counters to focus strictly on physical link faults"],
          ["-k / -K", "Clear error counters (-k) or data counters (-K) after reading, whether or not they were printed"]
        ],
        subcommands: [
          ["ibqueryerrors -s RcvSwRelayErrors,XmitDiscard,XmitWait", "Show only physical-layer symbol, link-down, and receive CRC errors across the fabric"],
          ["ibqueryerrors -G <Switch_GUID>", "Check error counters on a single specific InfiniBand switch GUID", {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibqueryerrors.8.in.rst", "title": "ibqueryerrors man page (rdma-core)"}], "note": "-G comes from the shared infiniband-diags options (port GUID)."}]
        ],
        tip: "Suppress RcvSwRelayErrors to focus on real physical bad cables",
        tags: ["ibqueryerrors", "fabric", "errors", "cables", "flaps", "symbol-errors"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibqueryerrors.8.in.rst", "title": "ibqueryerrors man page (rdma-core)"}]}
      }
    ]
  },
  {
    part: "ib-ibdiagnet",
    id: "ibdiagnet",
    badge: "dgn",
    title: "ibdiagnet — Comprehensive Fabric Health, BER & Cable Audit",
    subtitle: "Running deep NVIDIA fabric diagnostics: post-FEC/raw Bit Error Rate (BER), duplicate GUIDs, credit loops & cable temps",
    commands: [
      {
        id: "ibdiagnet-ber-cables",
        desc: "Run full InfiniBand fabric verification: link speeds, Bit Error Rate (BER) thresholds, routing loops & transceiver temps",
        cmd: "ibdiagnet -o /tmp/ibdiagnet2 --get_cable_info --get_phy_info",
        details: "'ibdiagnet' is NVIDIA's comprehensive fabric validation suite. It checks SM status, duplicate GUIDs, LFT routing credit loops, degraded link speeds/widths, and dumps detailed CSV/DB files into '/tmp/ibdiagnet2/' (including 'ibdiagnet2.log', 'ibdiagnet2.cables', and 'ibdiagnet2.ber').",
        flags: [
          ["-o <dir>", "Output directory for the reports (NVIDIA's examples read results from /var/tmp/ibdiagnet2)"],
          ["--get_cable_info", "Query every QSFP cable; results in ibdiagnet2.cables. NVIDIA marks this plugin deprecated"],
          ["--get_phy_info", "Physical-layer info including BER: NVIDIA's BER check for ConnectX-5 and later / Quantum (--ber_test is SwitchX, ConnectX-3/4 only)"],
          ["--pc", "Reset all fabric performance counters at the start of the run"]
        ],
        subcommands: [
          ["ibdiagnet -i mlx5_0 -p 1 -o /tmp/ibdiag_rail0", "Run fabric diagnostics specifically on Rail 0 (mlx5_0 port 1)"],
          ["grep -E '^-E-|^-W-' /tmp/ibdiagnet2/ibdiagnet2.log", "Extract all Error (-E-) and Warning (-W-) summary lines from an ibdiagnet report", {"verified": "2026-11-09", "refs": [], "note": "The -E- / -W- line prefixes are not described in the ibdiagnet docs read."}]
        ],
        tip: "Check /tmp/ibdiagnet2/ibdiagnet2.cables for overtemp optics!",
        tags: ["ibdiagnet", "ber", "cables", "optics", "routing", "diagnostics"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/ibdiagnetutilityum/2.27.0/basic-commands", "title": "ibdiagnet commands"}, {"url": "https://networking-docs.nvidia.com/ibdiagnetutilityum/2.27.0/ibdiagnet-dump-files", "title": "ibdiagnet output files"}], "note": "Corrected 2026-11-09: --ber_test is for SwitchX/ConnectX-3/4 only; NVIDIA says to use --get_phy_info on later devices."}
      }
    ]
  },
  {
    part: "ib-ibping",
    id: "ibping",
    badge: "png",
    title: "ibping & ibtracert — IB Layer-2 Ping & Path Trace",
    subtitle: "Testing InfiniBand MAD reachability between LIDs/GUIDs and tracing exact switch hop-by-hop forwarding paths",
    commands: [
      {
        id: "ibping-ibtracert",
        desc: "Test Layer-2 InfiniBand reachability (ibping) and trace the exact switch port hop path between two LIDs (ibtracert)",
        cmd: "ibtracert <src_LID> <dst_LID> && ibping -c 10 <dst_LID>",
        details: "'ibtracert' traces the exact deterministic or adaptive switch-port path between two LIDs or GUIDs without needing IP/IPoIB configured. 'ibping' requires running 'ibping -S' (server mode) on the target node and 'ibping -c 10 <LID>' on the source node.",
        flags: [
          ["ibtracert <sLID> <dLID>", "Print every switch hop, in-port, and out-port between source LID and destination LID"],
          ["-G <sGUID> <dGUID>", "ibtracert by port GUIDs instead of LIDs (ibping takes a LID or GUID as its destination)"],
          ["ibping -S", "Start ibping responder daemon on target host (run client without -S on source host)"]
        ],
        subcommands: [
          ["ibtracert -G 0x1070fd0300123456 0x1070fd0300654321", "Trace the fabric switch path between two HCA Port GUIDs"]
        ],
        tip: "ibtracert works immediately without any daemon on the remote node!",
        tags: ["ibping", "ibtracert", "lid", "guid", "trace", "hops", "routing"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibtracert.8.in.rst", "title": "ibtracert man page (rdma-core)"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibping.8.in.rst", "title": "ibping man page (rdma-core)"}]}
      }
    ]
  },
  {
    part: "ib-mst",
    id: "mst",
    badge: "mst",
    title: "mst — Mellanox Software Tools Device Manager",
    subtitle: "Starting the MFT driver (mst start) and mapping /dev/mst/* device nodes to PCIe BDFs, mlx5_* RDMA names & netdevs",
    commands: [
      {
        id: "mst-status-verbose",
        desc: "Start Mellanox Firmware Tools (MFT) device nodes and display the full mapping of PCIe BDF, mst device, RDMA mlx5_X & netdev",
        cmd: "mst start && mst status -v",
        details: "'mst status -v' is the Rosetta Stone for NVIDIA ConnectX-6/7 and BlueField-2/3 NICs: in a single table it maps every card's MST device node ('/dev/mst/mt4129_pciconf0'), PCIe BDF ('3b:00.0'), RDMA name ('mlx5_0'), Linux network interface ('net-ib0' or 'net-eth0'), and NUMA node.",
        flags: [
          ["mst start", "Load mst_pci/mst_pciconf kernel modules and create /dev/mst/* character devices"],
          ["mst status -v", "Verbose table mapping MST device, PCI BDF, RDMA device (mlx5_X), netdev, and NUMA node"]
        ],
        subcommands: [
          ["mst cable add && mst status -v", "Discover and create MST device nodes for attached optical transceivers and active cables"]
        ],
        tip: "Run 'mst status -v' first to map BDF <-> mlx5_X <-> netdev",
        tags: ["mst", "mft", "mellanox", "connectx", "bluefield", "bdf", "mlx5"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/linux", "title": "MFT: mst"}, {"url": "https://networking-docs.nvidia.com/mftswum/4330/cable-utilities", "title": "MFT: cable utilities"}]}
      }
    ]
  },
  {
    part: "ib-mlxconfig",
    id: "mlxconfig",
    badge: "cfg",
    title: "mlxconfig — ConnectX / BlueField NVRAM Configuration",
    subtitle: "Switching VPI ports between InfiniBand (1) and Ethernet/RoCE (2), enabling SR-IOV, PCIe settings & factory reset",
    commands: [
      {
        id: "mlxconfig-vpi-mode",
        desc: "Query ConnectX/BlueField non-volatile configuration and switch VPI port protocol between InfiniBand (IB) and Ethernet (ETH)",
        cmd: "mlxconfig -d /dev/mst/mt4129_pciconf0 query | grep -E 'LINK_TYPE|SRIOV|NUM_OF_VFS|PCI'",
        details: "NVIDIA ConnectX VPI adapters can operate in either native InfiniBand mode ('LINK_TYPE_P1=1') or Ethernet/RoCEv2 mode ('LINK_TYPE_P1=2'). Changing NVRAM settings with 'mlxconfig set' requires a firmware reset ('mlxfwreset') or cold server reboot to take effect.",
        flags: [
          ["-d <dev>", "Target PCI BDF (0000:3b:00.0), RDMA name (mlx5_0), or /dev/mst/* device"],
          ["query / q", "Read current, default, and next-boot NVRAM configuration values"],
          ["LINK_TYPE_P1=1 / 2", "Set Port 1 mode: 1 = InfiniBand (IB), 2 = Ethernet (ETH)"],
          ["-y", "Answer yes to confirmation prompt when applying NVRAM changes"]
        ],
        subcommands: [
          ["mlxconfig -y -d mlx5_0 set LINK_TYPE_P1=1 LINK_TYPE_P2=1", "Configure both ports of a dual-port ConnectX VPI adapter for native InfiniBand mode (1)", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxconfig-changing-device-configuration-tool", "title": "MFT: mlxconfig"}, {"url": "https://networking-docs.nvidia.com/mftswum/4330/mft-supported-configurations-and-parameters", "title": "MFT: mlxconfig parameters"}], "note": "NVIDIA documents 2 = ETH (text values like ETH also work); 1 = IB is not spelled out: check mlxconfig show_confs."}],
          ["mlxconfig -y -d mlx5_0 set LINK_TYPE_P1=2 LINK_TYPE_P2=2", "Configure both ports of a ConnectX VPI adapter for Ethernet / RoCEv2 mode (2)", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxconfig-changing-device-configuration-tool", "title": "MFT: mlxconfig"}, {"url": "https://networking-docs.nvidia.com/mftswum/4330/mft-supported-configurations-and-parameters", "title": "MFT: mlxconfig parameters"}], "note": "NVIDIA documents LINK_TYPE_P1=ETH as the same as 2. Reboot to apply."}],
          ["mlxconfig -y -d mlx5_0 reset", "Reset all NVRAM configuration parameters on the adapter back to factory defaults"]
        ],
        tip: "LINK_TYPE: 1 = InfiniBand, 2 = Ethernet; reboot for it to take effect",
        tags: ["mlxconfig", "vpi", "link_type", "infiniband", "ethernet", "roce", "sriov"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxconfig-changing-device-configuration-tool", "title": "MFT: mlxconfig"}, {"url": "https://networking-docs.nvidia.com/mftswum/4330/mft-supported-configurations-and-parameters", "title": "MFT: mlxconfig parameters"}]}
      }
    ]
  },
  {
    part: "ib-mlxlink",
    id: "mlxlink",
    badge: "mlx",
    title: "mlxlink — Optical DOM, BER, FEC & SerDes Eye Grades",
    subtitle: "Inspecting OSFP/QSFP optical laser power (-m), Raw vs Effective BER (-c), PAM4/NRZ SerDes eye opening (-e) & loopback",
    commands: [
      {
        id: "mlxlink-optics-ber-eye",
        desc: "Perform deep physical-layer diagnostics on ConnectX HCAs or Quantum switches: DOM power, BER, FEC & Eye grades",
        cmd: "mlxlink -d mlx5_0 -m -c -e",
        details: "'mlxlink' works identically on both Ethernet and InfiniBand ports (unlike ethtool, which cannot read optical DOM on native IB ports!). Check 'Effective Physical BER' (must be < 1e-15), 'Raw Physical BER' (< 1e-5), 'Rx Power' per lane (dBm), and SerDes 'Eye Opening' grades.",
        flags: [
          ["-d <dev> -p <port>", "Device (mst device, BDF or mlx5_X alias). -p is for switches: on an adapter, pick the per-port device instead"],
          ["-m", "Dump transceiver Module info: vendor, part number, serial, wavelength, temp, and per-lane Tx/Rx dBm power"],
          ["-c", "Show physical Counters: Effective Physical Errors, Raw Physical BER, and Effective Physical BER"],
          ["-e", "Show per-lane SerDes Eye Opening Info (Height/Width mV/mpUI and Eye Grade)"],
          ["--show_fec", "Show supported and active Forward Error Correction (RS-FEC) mode"]
        ],
        subcommands: [
          ["mlxlink -d mlx5_0 --port_state TG", "Toggle (bounce/flap) the physical port link down and back up to force link retraining"],
          ["mlxlink -d mlx5_0 --test_mode EN --rx_prbs PRBS31 --tx_prbs PRBS31", "PRBS31 bit-pattern test: takes the link out of service; end it with --test_mode DS", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility", "title": "MFT: mlxlink"}]}],
          ["mget_temp -d mlx5_0", "Read the on-die ASIC temperature (°C) of the ConnectX / BlueField network adapter", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mget_temp-utility", "title": "MFT: mget_temp"}]}]
        ],
        tip: "ethtool -m doesn't work on IB interfaces — always use mlxlink -m!",
        tags: ["mlxlink", "mget_temp", "optics", "dom", "ber", "eye", "osfp", "qsfp", "fec"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility", "title": "MFT: mlxlink"}]}
      }
    ]
  },
  {
    part: "ib-mlxfwmanager",
    id: "mlxfwmanager",
    badge: "fwm",
    title: "mlxfwmanager & flint — NIC Firmware Query, Burn & Reset",
    subtitle: "Checking installed vs available NIC firmware versions, matching PSID board IDs, online updates (-u) & mlxfwreset",
    commands: [
      {
        id: "mlxfwmanager-flint-fw",
        desc: "Query ConnectX / BlueField firmware version and PSID, burn firmware updates, and reset NIC firmware without rebooting",
        cmd: "mlxfwmanager --query && flint -d /dev/mst/mt4129_pciconf0 q",
        details: "Every Mellanox/NVIDIA NIC has a 16-character 'PSID' (Parameter-Set Identification, e.g. MT_0000000838) that uniquely identifies the board layout and OEM hardware revision. Firmware images (.bin) are strictly matched to the PSID. After flashing, 'mlxfwreset' activates the new firmware live without a host reboot on supported PCIe root complexes.",
        flags: [
          ["mlxfwmanager --query", "List all Mellanox adapters in the server with Part Number, PSID, PCI BDF, and current/available FW version"],
          ["mlxfwmanager -u -y", "Automatically update firmware on all detected adapters using bundled or specified (-i) firmware package"],
          ["flint -d <dev> q", "Low-level firmware flash query showing FW version, FW release date, Product Version, and GUID/MACs"],
          ["mlxfwreset -d <dev> reset", "Reset the adapter to load new firmware; the level decides how far (-l 4 reboots the host)"]
        ],
        subcommands: [
          ["flint -d /dev/mst/mt4129_pciconf0 -i fw-ConnectX7.bin burn", "Burn a specific .bin firmware image onto a target adapter using flint"],
          ["mlxfwreset -d mlx5_0 reset -y", "Reset mlx5_0 to activate newly burned firmware (NVIDIA says reboot to apply mlxconfig changes)"]
        ],
        tip: "Always match the 16-char PSID when downloading NIC firmware!",
        tags: ["mlxfwmanager", "flint", "mlxfwreset", "firmware", "psid", "burn", "connectx"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxfwmanager-firmware-update-and-query-tool", "title": "MFT: mlxfwmanager"}, {"url": "https://networking-docs.nvidia.com/mftswum/4330/flint-firmware-burning-tool", "title": "MFT: flint"}, {"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxfwreset-loading-firmware-on-5th-generation-devices-tool", "title": "MFT: mlxfwreset"}], "note": "Corrected 2026-11-09: mlxfwreset is written \"reset -y\" as in NVIDIA's example."}
      }
    ]
  },
  {
    part: "ib-perftest",
    id: "perftest",
    badge: "bch",
    title: "ib_write_bw & ib_read_lat — RDMA Bandwidth & Latency",
    subtitle: "Benchmarking line-rate 200G/400G RDMA throughput (GB/s), sub-2us latency & GPUDirect RDMA (--use_cuda)",
    commands: [
      {
        id: "perftest-rdma-bw-lat",
        desc: "Measure point-to-point RDMA Write/Read bandwidth (Gb/s) and latency (usec) over IPv6 between two HCAs or GPUs",
        cmd: "ib_write_bw -d mlx5_0 -F --report_gbits -q 4 --ipv6-addr   # Server;   ib_write_bw -d mlx5_0 -F --report_gbits -q 4 --ipv6-addr 2001:db8:dc::1   # Client",
        details: "From the Ubuntu 'perftest' package. Pass '--ipv6-addr' on BOTH server and client so the out-of-band parameter exchange uses an IPv6 address ('--ipv6' only selects an IPv6 GID). On 400G NDR (4X 100G), a healthy PCIe Gen5 x16 ConnectX-7 reaches ~390+ Gb/s (~48.8 GB/s) unidirectional RDMA Write bandwidth and ~1.2–1.8 us latency. If bandwidth is capped around ~250 Gb/s, check 'lspci -vvv' to see if the slot downgraded to PCIe Gen4!",
        flags: [
          ["--ipv6-addr", "Use an IPv6 address for the out-of-band parameter exchange (symmetric: pass it on server and client). --ipv6 is different: it selects an IPv6 GID"],
          ["-d <mlx5_X>", "Specify exact RDMA HCA device to test"],
          ["-F", "Do not fail or warn if CPU frequency scaling governor is not locked to max"],
          ["--report_gbits", "Report throughput in Gb/sec instead of MB/sec (expect ~392 Gb/s on 400G NDR, ~195 Gb/s on 200G HDR)"],
          ["-q 4", "Use 4 Queue Pairs (QPs) to saturate 200G/400G line rate"],
          ["-x <gid_idx>", "Use the GID at this index (on RoCE, find the RoCE v2 index in the GID table)"],
          ["--use_cuda=<gpu>", "Allocate RDMA buffer directly in NVIDIA GPU HBM memory to test GPUDirect RDMA (GDR)!"]
        ],
        subcommands: [
          ["ib_write_lat -d mlx5_0 -F --ipv6-addr   # Server;   ib_write_lat -d mlx5_0 -F --ipv6-addr 2001:db8:dc::1   # Client", "Measure half-round-trip RDMA Write latency in microseconds (usec) over IPv6"],
          ["ib_write_bw -d mlx5_0 -F --report_gbits --use_cuda=0 --ipv6-addr 2001:db8:dc::1", "Benchmark GPUDirect RDMA (GDR) directly between GPU 0 HBM and HCA mlx5_0 bypassing host RAM"]
        ],
        tip: "400G NDR = ~392 Gb/s; pass --ipv6-addr on both ends for an IPv6 server address",
        tags: ["perftest", "ipv6", "ib_write_bw", "ib_write_lat", "rdma", "gpudirect", "bandwidth", "latency"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/perftest/blob/master/man/perftest.1", "title": "perftest man page"}, {"url": "https://github.com/linux-rdma/perftest/blob/master/src/perftest_parameters.c", "title": "perftest source"}], "note": "Corrected 2026-11-09: --ipv6 only selects an IPv6 GID; an IPv6 server address needs --ipv6-addr on both ends. Bandwidth and latency figures are rules of thumb."}
      }
    ]
  },
  {
    part: "ib-mlxcables",
    id: "mlxcables",
    badge: "cbl",
    title: "mlxcables — Transceiver, AOC & DAC Cable EEPROM Inspector",
    subtitle: "Discovering MFT cable devices (mst cable add), reading OSFP/QSFP vendor serials, FW versions & DDM optical power",
    commands: [
      {
        id: "mlxcables-ddm-inventory",
        desc: "Discover all local and fabric-attached OSFP/QSFP transceivers, AOCs, and DACs and dump DDM optical telemetry",
        cmd: "mst start && mst cable add && mlxcables",
        details: "Creates '/dev/mst/*_cable_*' device nodes for every transceiver plugged into ConnectX HCAs or Quantum switches. 'mlxcables --DDM' reads the CMIS/SFF-8636 EEPROM directly to report Linkpartner/Vendor Part Number (e.g., MMA4Z00-NS400), serial number, cable length, firmware version, and per-lane Rx/Tx power and temperature.",
        flags: [
          ["mst cable add", "Scan all local HCAs and register their plugged transceivers as /dev/mst/<dev>_cable_0 devices"],
          ["--DDM", "Print Digital Diagnostic Monitoring (Temperature, Voltage, and 4/8-lane Rx/Tx optical power in dBm)"],
          ["--print_raw", "Dump raw hex EEPROM pages from the optical transceiver module"]
        ],
        subcommands: [
          ["mlxcables -d mt4129_pciconf0_cable_0 --DDM", "Read detailed vendor part number, serial number, FW version, and per-lane DDM power on cable 0"],
          ["mlxcables --read_all_regs -d mt4129_pciconf0_cable_0", "Dump all CMIS control and status registers from an OSFP/QSFP-DD transceiver"]
        ],
        tip: "Run 'mst cable add' first so mlxcables can see all transceivers!",
        tags: ["mlxcables", "mst", "osfp", "qsfp", "aoc", "dac", "serial", "ddm", "transceiver"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxcables-cables-tool", "title": "MFT: mlxcables"}, {"url": "https://networking-docs.nvidia.com/mftswum/4330/linux", "title": "MFT: mst"}, {"url": "https://networking-docs.nvidia.com/mftswum/4330/cable-utilities", "title": "MFT: cable utilities"}], "note": "What mlxcables prints with no options is not documented; -q queries a cable."}
      }
    ]
  },
  {
    part: "ib-bluefield",
    id: "bluefield-dpu",
    badge: "dpu",
    title: "BlueField-3 DPU & SuperNIC Mode (rshim, mlxconfig & bfb)",
    subtitle: "Switching BlueField-3 between DPU (Embedded ARM) and NIC (SuperNIC) modes, rshim console & BFB OS installation",
    commands: [
      {
        id: "bluefield-mode-rshim-bfb",
        desc: "Check or switch BlueField-2/3 between DPU mode and NIC (SuperNIC) mode, access ARM console via rshim, or push a BFB image",
        cmd: "mlxconfig -d /dev/mst/mt41692_pciconf0 q INTERNAL_CPU_OFFLOAD_ENGINE",
        details: "In AI clusters (Spectrum-X / Quantum-2), BlueField-3 often runs in SuperNIC / NIC mode ('INTERNAL_CPU_OFFLOAD_ENGINE=1' DISABLED) so the host x86 OS controls RDMA directly, or in DPU mode ('INTERNAL_CPU_OFFLOAD_ENGINE=0' Enabled) where the embedded ARM cores manage networking via '/dev/rshim0'.",
        flags: [
          ["INTERNAL_CPU_OFFLOAD_ENGINE", "0 = Enabled (DPU Mode: ARM cores own NIC data path); 1 = Disabled (NIC / SuperNIC Mode: Host x86 owns data path)"],
          ["/dev/rshim0/misc", "RShim status: cat it for BF_MODE (DPU or NIC mode); echo 'DISPLAY_LEVEL 2' > /dev/rshim0/misc adds the boot log"],
          ["bfb-install", "Stream a BlueField Bootstream (.bfb) Ubuntu DOCA OS image onto the DPU over rshim0"]
        ],
        subcommands: [
          ["mlxconfig -y -d /dev/mst/mt41692_pciconf0 s INTERNAL_CPU_OFFLOAD_ENGINE=1", "Switch BlueField-3 to NIC mode (=0 for DPU mode). Arm and NIC must reset; NVIDIA recommends a power cycle"],
          ["bfb-install -r rshim0 -b DOCA_2.9.0_Ubuntu_22.04-arm64.bfb", "Flash a fresh DOCA Ubuntu BFB OS image onto BlueField ARM storage over rshim0"],
          ["tio -b 115200 /dev/rshim0/console", "Open serial console directly into the embedded BlueField ARM processor over PCIe rshim"]
        ],
        tip: "DPU <-> NIC mode: reset Arm and NIC, power cycle recommended. SuperNIC SKUs ship in NIC mode",
        tags: ["bluefield", "bf3", "dpu", "supernic", "rshim", "bfb-install", "doca", "mlxconfig"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/bsp/4.16.0/modes-of-operation", "title": "BlueField modes of operation"}, {"url": "https://networking-docs.nvidia.com/bsp/4.16.0/soc-management-interface-rshim", "title": "BlueField RShim"}], "note": "Corrected 2026-11-09: BlueField-3 mode is INTERNAL_CPU_OFFLOAD_ENGINE only (0 = DPU, 1 = NIC); bfb-install takes -r and -b."}
      }
    ]
  }
];

// Interactive Builder Logic
const IB_BUILDER_TASKS = {
  "mlxlink-dom": {
    build: (dev, port) => `mlxlink -d ${dev || "mlx5_0"} -p ${port || "1"} -m -c -e`,
    desc: "Queries ConnectX/Quantum physical layer via mlxlink: optical module DOM (-m), FEC/BER error counters (-c), and SerDes eye diagram grades (-e)."
  },
  "perfquery-err": {
    build: (dev, port) => `perfquery -C ${dev || "mlx5_0"} -P 1 -x ${port || "1"}`,
    desc: "Queries 64-bit extended PMA error and traffic counters (-x) for the specified HCA or target LID/port."
  },
  "perfquery-rst": {
    build: (dev, port) => `perfquery -C ${dev || "mlx5_0"} -P 1 -R -a ${port || ""}`.trim(),
    desc: "Resets (-R) latched hardware PMA error counters across all ports (-a) on the target LID so you can verify if errors have stopped."
  },
  "mlxconfig-vpi": {
    build: (dev, port) => `mlxconfig -y -d ${dev || "mlx5_0"} set LINK_TYPE_P1=${port === "2" ? "2" : "1"} LINK_TYPE_P2=${port === "2" ? "2" : "1"}`,
    desc: "Sets ConnectX VPI port protocol in NVRAM: 1 = InfiniBand (IB), 2 = Ethernet / RoCEv2 (requires reboot or mlxfwreset)."
  },
  "ibwrite-bw": {
    build: (dev, port) => `ib_write_bw -d ${dev || "mlx5_0"} -F --report_gbits -q 4 --ipv6-addr ${port && port !== "1" ? port : "2001:db8:dc::1"}`,
    desc: "Runs an RDMA Write bandwidth test across 4 Queue Pairs (-q 4) over an IPv6 server address (--ipv6-addr, also needed on the server) reporting line-rate throughput in Gb/s."
  },
  "flint-query": {
    build: (dev) => `mlxfwmanager -d ${dev || "mlx5_0"} --query && flint -d ${dev || "mlx5_0"} q`,
    desc: "Queries active NIC firmware version, release date, part number, and 16-character PSID board identifier."
  }
};

// State
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("infiniband.html", "ib_cs_bookmarks", IB_DATA, {"ib-ibstat":"ib-ibstat_bookmarks","ib-ibv-devinfo":"ib-ibv-devinfo_bookmarks","ib-rdma":"ib-rdma_bookmarks","ib-iblinkinfo":"ib-iblinkinfo_bookmarks","ib-ibswitches":"ib-ibswitches_bookmarks","ib-sminfo":"ib-sminfo_bookmarks","ib-perfquery":"ib-perfquery_bookmarks","ib-ibqueryerrors":"ib-ibqueryerrors_bookmarks","ib-ibdiagnet":"ib-ibdiagnet_bookmarks","ib-ibping":"ib-ibping_bookmarks","ib-mlxlink":"ib-mlxlink_bookmarks","ib-mlxcables":"ib-mlxcables_bookmarks","ib-mst":"ib-mst_bookmarks","ib-mlxconfig":"ib-mlxconfig_bookmarks","ib-mlxfwmanager":"ib-mlxfwmanager_bookmarks","ib-perftest":"ib-perftest_bookmarks","ib-bluefield":"ib-bluefield_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("ib_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(IB_DATA) : "";
if (typeof window !== "undefined") window.SHEET_FILTER = { sections: IB_DATA, label: "InfiniBand sheets" };


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
  const totalCommands = IB_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of IB_DATA) {
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

  for (const section of IB_DATA) {
    if (((state.activeCategory !== "all" && state.activeCategory !== section.id) || (state.part && (section.part || section.id) !== state.part))) {
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

function initIbBuilder() {
  const taskSelect = document.getElementById("ib-task-select");
  const devInput = document.getElementById("ib-dev-input");
  const portInput = document.getElementById("ib-port-input");
  const outputEl = document.getElementById("ib-builder-output");
  const descEl = document.getElementById("ib-builder-desc");
  const copyBtn = document.getElementById("ib-builder-copy");

  function update() {
    const task = IB_BUILDER_TASKS[taskSelect.value];
    if (!task) return;
    outputEl.textContent = task.build(devInput.value.trim(), portInput.value.trim());
    descEl.textContent = task.desc;
  }

  taskSelect.addEventListener("change", update);
  devInput.addEventListener("input", update);
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
      localStorage.setItem("ib_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
  initIbBuilder();
  initMiniTabs();
  initEvents();
}

init();
