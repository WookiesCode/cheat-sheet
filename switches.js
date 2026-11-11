const SWITCH_DATA = [
  {
    part: "sw-quantum-ports",
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
          ["show interfaces ib transceiver", "Dump optical transceiver inventory and DOM diagnostics across all populated InfiniBand switch ports", {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking/display/nvidia-mlnx-os-user-manual-v3-12-6200-lts-2025-lts-u2.pdf", "title": "NVIDIA MLNX-OS 3.12.6200 LTS user manual (PDF)"}], "note": "MLNX-OS 3.12.6200: show interfaces ib [<inf>] transceiver; the port is optional."}],
          ["show interfaces ib 1/1", "IB 1/1 counters are in the per-port output: Rx errors, symbol errors, VL15 dropped packets; Tx discarded", {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking/display/nvidia-mlnx-os-user-manual-v3-12-6200-lts-2025-lts-u2.pdf", "title": "NVIDIA MLNX-OS 3.12.6200 LTS user manual (PDF)"}], "note": "Corrected 2026-11-10: there is no counters keyword. MLNX-OS 3.12.6200: show interfaces ib <inf> displays the configuration and status, with the counters."}],
          ["interface ib 1/1\nclear counters", "Reset IB 1/1 error counters after cleaning fiber or replacing an OSFP/QSFP module (run from configure terminal: clear counters works inside interface ib mode)", {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking/display/nvidia-mlnx-os-user-manual-v3-12-6200-lts-2025-lts-u2.pdf", "title": "NVIDIA MLNX-OS 3.12.6200 LTS user manual (PDF)"}], "note": "MLNX-OS 3.12.6200: clear counters in config interface ib mode clears the interface counters (example: switch (config interface ib 1/1) # clear counters). The global form clear counters [all | interface <type> <number>] also exists."}],
          ["configure terminal ; interface ib 1/1 shutdown ; no interface ib 1/1 shutdown", "Bounce (shut / no shut) InfiniBand switch port IB 1/1 to force link retraining", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/infiniband-interface", "title": "MLNX-OS 3.12.6200: InfiniBand interface"}], "note": "NVIDIA shows interface ib 1/4 shutdown; the no form is not shown."}],
          ["interface ib 1/1\ndescription GPU-Node-01_mlx5_0", "Label InfiniBand switch port IB 1/1 with the connected GPU server hostname and HCA (up to 40 bytes; run from configure terminal)", {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking/display/nvidia-mlnx-os-user-manual-v3-12-6200-lts-2025-lts-u2.pdf", "title": "NVIDIA MLNX-OS 3.12.6200 LTS user manual (PDF)"}], "note": "Corrected 2026-11-10: description <string> is entered inside interface ib mode, not on the interface line. MLNX-OS 3.12.6200: 40 bytes, example description my_interface."}]
        ],
        tip: "Physical 'LinkUp' + Logical 'Init' means OpenSM/UFM Subnet Manager is not reachable!",
        tags: ["nvidia", "quantum", "mlnx-os", "infiniband", "ib", "interfaces", "transceiver", "dom", "counters", "qm9700", "qm8700"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/infiniband-interface", "title": "MLNX-OS 3.12.6200: InfiniBand interface"}], "note": "MLNX-OS (newer Quantum switches may run NVOS instead: check your switch). The per-port form show interfaces ib 1/1 is not shown on its own in the manual."}
      },
      {
        id: "mlnxos-split-ports-cable",
        desc: "Configure or inspect 2x400G (NDR) / 2x200G (HDR) twin-port OSFP/QSFP split mode and cable info on Quantum switches",
        cmd: "show system profile && show interfaces ib 1/1/1 status",
        details: "NVIDIA Quantum-2 QM9700 switches feature 32 physical OSFP cages where each 800G cage natively splits into two 4-lane 400G NDR ports (1/1/1 and 1/1/2, totaling 64x 400G NDR ports) using twin-port OSFP finned transceivers and 2x MPO-12 APC splitters.",
        flags: [
          ["show system profile", "Display active switch system profile (ib, ib-split-ready, etc.) and max port layout"],
          ["interface ib 1/1 → module-type qsfp-split-2", "Split a port: shut it down, then in its interface mode run module-type qsfp-split-2 (module-type qsfp undoes it). Sub-ports are 1/5/1, 1/5/2 on Quantum; Quantum-2 uses 1/3/1/1. Splitting deletes the port's configuration"]
        ],
        subcommands: [
          ["show interfaces ib 1/1/1 transceiver", "Check optical DOM Tx/Rx dBm and module temperature on split sub-port IB 1/1/1"],
          ["show interfaces ib transceiver", "List the transceiver or cable in every populated InfiniBand port (type, vendor, PN/SN, DOM)", {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking/display/nvidia-mlnx-os-user-manual-v3-12-6200-lts-2025-lts-u2.pdf", "title": "NVIDIA MLNX-OS 3.12.6200 LTS user manual (PDF)"}], "note": "Corrected 2026-11-10: show cables is not in the MLNX-OS 3.12.6200 manual; show interfaces ib [<inf>] transceiver is."}]
        ],
        tip: "Quantum-2 QM9700 cages house two 400G NDR ports per OSFP module (64 ports in 32 cages)",
        tags: ["nvidia", "quantum", "mlnx-os", "split", "osfp", "ndr", "hdr", "cables"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/infiniband-interface", "title": "MLNX-OS 3.12.6200: InfiniBand interface"}], "note": "Corrected 2026-11-09: splitting is module-type qsfp-split-2, not \"interface ib … split\"."}
      }
    ]
  },
  {
    "part": "sw-quantum-ports",
    "id": "quantum-mlnxos-ports-pro-tips",
    "badge": "tip",
    "title": "Quantum: Ports & Optics: Pro Tips & Best Practices",
    "subtitle": "NVIDIA Quantum & Quantum-2 (MLNX-OS) Port Provisioning & DOM Diagnostics",
    "commands": [
      {
        "id": "quantum-mlnxos-ports-tips-card",
        "desc": "NVIDIA Quantum & Quantum-2 (MLNX-OS) Port Provisioning & DOM Diagnostics",
        "cmd": "show interfaces ib 1/1 transceiver && show interfaces ib status",
        "details": "Split ports show as three-part names (IB1/1/1, IB1/1/2) in show interfaces ib status; unsplit ports as IB1/2. A port that is Active/LinkUp physically but stuck in Init logically has no Subnet Manager configuring it: check that an SM (embedded, OpenSM or UFM) is running on the fabric.",
        "flags": [
          [
            "show interfaces ib status",
            "Link state, physical state, speed and width for every IB port"
          ],
          [
            "show interfaces ib 1/1 transceiver",
            "Module details and DOM for one port"
          ],
          [
            "show interfaces ib 1/1/1 transceiver",
            "Same for one half of a split port"
          ]
        ],
        "tip": "Physical LinkUp + logical Init = no Subnet Manager has brought the port up. Check the SM, not the cable.",
        "tags": [
          "quantum-mlnxos-ports",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/infiniband-interface",
              "title": "MLNX-OS 3.12.6200: InfiniBand interface"
            }
          ],
          "note": "Corrected 2026-11-10: removed \"restart OpenSM\", an unsourced QM8700/QM9700 split description and the show cables flag (not in the MLNX-OS manual chapters read)."
        }
      }
    ]
  },
  {
    part: "sw-quantum-hw-sm",
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
          ["show inventory && show version", "Display chassis serial number, part number (e.g., MQM9700-NS2F), MLNX-OS software version, and ASIC firmware", {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking/display/nvidia-mlnx-os-user-manual-v3-12-6200-lts-2025-lts-u2.pdf", "title": "NVIDIA MLNX-OS 3.12.6200 LTS user manual (PDF)"}], "note": "MLNX-OS 3.12.6200: show inventory displays system inventory (module, part number, serial); show version the running image. Any command mode."}],
          ["sminfo", "From any host on the fabric: the LID, GUID, priority and state of the master Subnet Manager (infiniband-diags)", {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/sminfo.8.in.rst", "title": "sminfo man page (rdma-core)"}]}],
          ["configure terminal ; ib smnode <sm-node> enable ; configuration write", "Enable the embedded Subnet Manager on a standalone Quantum switch (NVIDIA's example: ib smnode my-sm enable) and save the config", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/subnet-manager", "title": "MLNX-OS 3.12.6200: subnet manager"}]}],
          ["show log", "Inspect recent MLNX-OS system logs for port flaps, thermal alerts, PSU faults, or SM traps (show logging shows the logging settings, not the log)", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/logging", "title": "MLNX-OS 3.12.6200: logging"}]}],
          ["configuration write", "Save running MLNX-OS configuration to startup database (equivalent to 'write memory')", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/logging", "title": "MLNX-OS 3.12.6200: logging"}], "note": "Named in the manual; its own reference entry was not read."}],
          ["show images\nconfigure terminal\nboot system next", "Inspect the installed MLNX-OS images (location 1 vs 2), then boot the other one at the next reload", {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/networking/display/nvidia-mlnx-os-user-manual-v3-12-6200-lts-2025-lts-u2.pdf", "title": "NVIDIA MLNX-OS 3.12.6200 LTS user manual (PDF)"}], "note": "Corrected 2026-11-10: the syntax is boot system {location | next} in config mode (no boot system next undoes it); there is no partition keyword. show images displays the system images and boot parameters."}]
        ],
        tip: "Only enable the switch's SM (ib smnode <name> enable) if you do NOT have UFM or host-based OpenSM running!",
        tags: ["nvidia", "quantum", "mlnx-os", "power", "fan", "temperature", "sm", "opensm", "ufm", "inventory", "version"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/chassis-management", "title": "MLNX-OS 3.12.6200: chassis management"}, {"url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/subnet-manager", "title": "MLNX-OS 3.12.6200: subnet manager"}], "note": "show ib sm is not in the manual chapters read; NVIDIA enables the SM with ib smnode <name> enable."}
      }
    ]
  },
  {
    "part": "sw-quantum-hw-sm",
    "id": "quantum-mlnxos-hw-sm-pro-tips",
    "badge": "tip",
    "title": "Quantum: SM, UFM & HW: Pro Tips & Best Practices",
    "subtitle": "Quantum MLNX-OS Subnet Manager Redundancy & Chassis Health",
    "commands": [
      {
        "id": "quantum-mlnxos-hw-sm-tips-card",
        "desc": "Quantum MLNX-OS Subnet Manager Redundancy & Chassis Health",
        "cmd": "show ib sm && show inventory",
        "details": "NVIDIA documents the embedded MLNX-OS Subnet Manager for fabrics up to 2048 nodes on x86-based switches; larger fabrics usually run the SM on dedicated servers or UFM. The SM is disabled by default. configuration write saves the running configuration.",
        "flags": [
          [
            "ib smnode <sm-node> enable",
            "Enable the embedded Subnet Manager (NVIDIA example: ib smnode my-sm enable)"
          ],
          [
            "ib smnode <sm-node> sm-priority <n>",
            "Set this SM's priority for master election"
          ],
          [
            "configuration write",
            "Save the running configuration"
          ]
        ],
        "tip": "Run one master SM and standbys, with sm-priority set so the intended master wins; if SMs restart repeatedly, NVIDIA says to check that all SM nodes are in the same IB subnet.",
        "tags": [
          "quantum-mlnxos-hw-sm",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/subnet-manager",
              "title": "MLNX-OS 3.12.6200: subnet manager"
            },
            {
              "url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/chassis-management",
              "title": "MLNX-OS 3.12.6200: chassis management"
            },
            {
              "url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/logging",
              "title": "MLNX-OS 3.12.6200: logging"
            }
          ],
          "note": "show ib sm and show inventory are not in the MLNX-OS chapters read."
        }
      }
    ]
  },
  {
    part: "sw-quantum-inband",
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
          ["mlxlink -d lid-1 -p 15 -a TG", "Remotely bounce (toggle) port 15 on Quantum switch LID 1 over the InfiniBand fabric", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility", "title": "MFT: mlxlink"}]}],
          ["perfquery -x 1 15 && perfquery -R 1 15", "Read extended PMA error counters on switch LID 1 port 15, then reset (-R) its counters", {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/perfquery.8.in.rst", "title": "perfquery man page (rdma-core)"}]}],
          ["smpquery nodeinfo 1 && smpquery portinfo 1 15", "Query hardware NodeInfo and PortInfo (Active/Init state, speed, width, LID) of switch LID 1 port 15", {"verified": "2026-11-10", "refs": [{"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/smpquery.8.in.rst", "title": "smpquery man page (rdma-core)"}], "note": "smpquery nodeinfo <lid> and portinfo <lid> [<portnum>]: LID 1 and port 15 are examples (find the switch LID with ibswitches)."}],
          ["flint -d lid-1 q", "Query the ASIC firmware version and PSID of remote Quantum switch LID 1 in-band", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/flint-firmware-burning-tool", "title": "MFT: flint"}], "note": "flint documents q and in-band use, not a lid- example."}],
          ["ibdiagnet --get_phy_info --get_cable_info -o /tmp/ibdiag", "Sweep all Quantum switches in the fabric and dump every switch port's optical transceiver and temperature report", {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/ibdiagnetutilityum/2.27.0/basic-commands", "title": "ibdiagnet commands"}]}]
        ],
        tip: "MQM9790 / MQM8790 switches have no SSH CLI—use 'mlxlink -d lid-<N> -p <Port>' from any host!",
        tags: ["nvidia", "quantum", "unmanaged", "mqm9790", "mqm8790", "inband", "mlxlink", "lid", "perfquery", "smpquery", "flint", "ibswitches"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility", "title": "MFT: mlxlink"}, {"url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibswitches.8.in.rst", "title": "ibswitches man page (rdma-core)"}], "note": "NVIDIA shows mlxlink -d lid-<LID> -p <port> for Quantum split ports."}
      }
    ]
  },
  {
    "part": "sw-quantum-inband",
    "id": "quantum-unmanaged-inband-pro-tips",
    "badge": "tip",
    "title": "Quantum: In-Band MFT: Pro Tips & Best Practices",
    "subtitle": "Out-of-Band vs In-Band Telemetry on Unmanaged QM8700/QM9700 Switches",
    "commands": [
      {
        "id": "quantum-unmanaged-inband-tips-card",
        "desc": "Out-of-Band vs In-Band Telemetry on Unmanaged QM8700/QM9700 Switches",
        "cmd": "mlxlink -d lid-0x0004 -p 1 --show_module --show_counters",
        "details": "Externally managed (unmanaged) Quantum switches have no management CPU or IP, so you read them in-band from a connected host with MFT, addressing the switch by LID: mlxlink -d lid-<LID> -p <port>. On managed MLNX-OS switches, in-band management is blocked by default (system manage inband-ib enables it).",
        "flags": [
          [
            "mlxlink -d lid-<LID> -p <port>",
            "Read a switch port's module and PHY state in-band"
          ],
          [
            "smpquery portinfo <LID> <port>",
            "SMP PortInfo: link speed, width, state, MTU"
          ],
          [
            "ibportstate <LID> <port> reset",
            "Reset a switch port from a host (changes state)"
          ]
        ],
        "tip": "Obtain switch LIDs with \"ibswitches\" or \"ibnetdiscover\" before querying via host in-band MFT tools.",
        "tags": [
          "quantum-unmanaged-inband",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/mftswum/4330/mlxlink-utility",
              "title": "MFT: mlxlink"
            },
            {
              "url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibswitches.8.in.rst",
              "title": "ibswitches man page (rdma-core)"
            },
            {
              "url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/smpquery.8.in.rst",
              "title": "smpquery man page (rdma-core)"
            },
            {
              "url": "https://github.com/linux-rdma/rdma-core/blob/master/infiniband-diags/man/ibportstate.8.in.rst",
              "title": "ibportstate man page (rdma-core)"
            },
            {
              "url": "https://networking-docs.nvidia.com/mlnxosum/3126200lts/infiniband-interface",
              "title": "MLNX-OS 3.12.6200: InfiniBand interface"
            }
          ],
          "note": "The in-band block on managed switches is from the MLNX-OS InfiniBand interface chapter."
        }
      }
    ]
  },
  {
    part: "sw-cumulus-ports",
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
          ["ip -c -br link show", "Since Cumulus is Linux, standard 'ip -c -br link' works directly on swp1..swp64!", {"verified": "2026-11-09", "refs": [{"url": "https://man7.org/linux/man-pages/man8/ip.8.html", "title": "ip(8)"}]}],
          ["nv set interface swp1 link state down && nv config apply --assume-yes && sleep 2 && nv set interface swp1 link state up && nv config apply --assume-yes", "Administratively bounce (shut / no shut) switch port swp1 to force transceiver link retraining"]
        ],
        tip: "Every swp* port is also a standard Linux netdev!",
        tags: ["cumulus", "nvue", "nv", "swp", "interface", "status", "bounce", "counters"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Monitoring-and-Troubleshooting/Troubleshooting-Network-Interfaces/Monitoring-Interfaces-and-Transceivers-with-NVUE/", "title": "Cumulus Linux 5.18: monitoring interfaces"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Set-and-Unset-Commands/Interface/", "title": "NVUE reference: interface set"}]}
      }
    ]
  },
  {
    "part": "sw-cumulus-ports",
    "id": "cumulus-ports-pro-tips",
    "badge": "tip",
    "title": "Cumulus: Port Status: Pro Tips & Best Practices",
    "subtitle": "Cumulus Linux NVUE Interface Configuration & Link Bouncing",
    "commands": [
      {
        "id": "cumulus-ports-tips-card",
        "desc": "Cumulus Linux NVUE Interface Configuration & Link Bouncing",
        "cmd": "nv show interface && nv set interface swp1 link state up",
        "details": "Cumulus Linux is configured with the NVUE CLI. nv set and nv unset change a pending configuration that takes effect only after nv config apply.",
        "flags": [
          [
            "nv show interface",
            "All interfaces with state, speed and MTU"
          ],
          [
            "nv show interface swp1 link stats",
            "Rx/Tx bytes, packets, drops and errors for one port"
          ],
          [
            "nv set interface swp1 link mtu 9216",
            "Set MTU explicitly (9216 is the default)"
          ]
        ],
        "tip": "Cumulus Linux already gives switch ports a 9216 MTU by default; set hosts to a matching jumbo MTU (for example 9000) end to end rather than raising the switch.",
        "tags": [
          "cumulus-ports",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Monitoring-and-Troubleshooting/Troubleshooting-Network-Interfaces/Monitoring-Interfaces-and-Transceivers-with-NVUE/",
              "title": "Cumulus Linux 5.18: monitoring interfaces"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Set-and-Unset-Commands/Interface/",
              "title": "NVUE reference: interface set"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-1-and-Switch-Ports/Interface-Configuration-and-Management/Switch-Port-Attributes/",
              "title": "Cumulus Linux 5.18: switch port attributes (MTU, FEC)"
            }
          ],
          "note": "Corrected 2026-11-10: the link state command needs \"link\"; NVUE is not \"Network Virtualization Underlay Engine\"; 9216 is already the Cumulus default MTU."
        }
      }
    ]
  },
  {
    part: "sw-cumulus-optics",
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
          ["nv set interface swp1 link fec rs && nv config apply --assume-yes", "Configure Forward Error Correction (rs / baser / auto / off) on port swp1"]
        ],
        tip: "Compare Rx dBm across all 4/8 lanes to spot dirty MPO pins",
        tags: ["cumulus", "nvue", "transceiver", "optics", "dom", "dbm", "ethtool", "fec"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/", "title": "NVUE reference: platform"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Monitoring-and-Troubleshooting/Troubleshooting-Network-Interfaces/Monitoring-Interfaces-and-Transceivers-with-ethtool/", "title": "Cumulus Linux 5.18: ethtool"}], "note": "FEC values rs/off are from the Switch Port Attributes page summary."}
      }
    ]
  },
  {
    "part": "sw-cumulus-optics",
    "id": "cumulus-optics-pro-tips",
    "badge": "tip",
    "title": "Cumulus: Optics DOM & FEC: Pro Tips & Best Practices",
    "subtitle": "Transceiver DOM Optical Thresholds & Forward Error Correction",
    "commands": [
      {
        "id": "cumulus-optics-tips-card",
        "desc": "Transceiver DOM Optical Thresholds & Forward Error Correction",
        "cmd": "nv show interface swp1 transceiver && nv show interface swp1 fec",
        "details": "PAM4 links (50G per lane and faster, so 200G, 400G and 800G) depend on RS FEC; a link that comes up with clean optical power but has errors often has mismatched FEC between the two ends. Compare each lane's Rx power with the module's own warning and alarm thresholds, not a fixed number.",
        "flags": [
          [
            "nv show interface swp1 transceiver",
            "Module type, vendor, serial, temperature, voltage and per-lane power"
          ],
          [
            "nv set interface swp1 link fec rs",
            "Force RS FEC (changes state; set the same on the far end)"
          ],
          [
            "ethtool -m swp1",
            "Raw module EEPROM and DOM from Linux"
          ]
        ],
        "tip": "Read the module's thresholds from nv show interface swp1 transceiver (or ethtool -m swp1): they differ per optic type.",
        "tags": [
          "cumulus-optics",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/",
              "title": "NVUE reference: platform"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-1-and-Switch-Ports/Interface-Configuration-and-Management/Switch-Port-Attributes/",
              "title": "Cumulus Linux 5.18: switch port attributes (MTU, FEC)"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Monitoring-and-Troubleshooting/Troubleshooting-Network-Interfaces/Monitoring-Interfaces-and-Transceivers-with-ethtool/",
              "title": "Cumulus Linux 5.18: ethtool"
            }
          ],
          "note": "Corrected 2026-11-10: removed unsourced \"-2 to +2 dBm acceptable\" and \"-8 dBm\" limits, the Clause 91 label (that is 100G RS FEC), and mst/mlxcables on Cumulus."
        }
      }
    ]
  },
  {
    part: "sw-cumulus-lldp",
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
          ["nv show interface neighbor && ip -6 -c neigh show", "Display IPv6 Neighbor Discovery (NDP) table mapping server IPv6 addresses to MACs and swp* ports"],
          ["bridge fdb show | grep -i 'aa:bb:cc'", "Search the Linux kernel bridge Forwarding Database (FDB) directly for a server MAC address", {"verified": "2026-11-09", "refs": [{"url": "https://man7.org/linux/man-pages/man8/bridge.8.html", "title": "bridge(8)"}]}]
        ],
        tip: "Run 'nv show interface lldp' to verify rack cabling matrix",
        tags: ["cumulus", "lldp", "lldpctl", "mac", "arp", "bridge", "fdb"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/LLDP/", "title": "NVUE reference: LLDP"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Bridge/", "title": "NVUE reference: bridge"}], "note": "lldpctl comes from lldpd, not NVUE."}
      }
    ]
  },
  {
    "part": "sw-cumulus-lldp",
    "id": "cumulus-lldp-pro-tips",
    "badge": "tip",
    "title": "Cumulus: LLDP, MAC & ARP: Pro Tips & Best Practices",
    "subtitle": "Cluster Cabling Verification & Host Discovery via LLDP",
    "commands": [
      {
        "id": "cumulus-lldp-tips-card",
        "desc": "Cluster Cabling Verification & Host Discovery via LLDP",
        "cmd": "nv show interface lldp && nv show bridge domain br_default mac-table",
        "details": "Compare LLDP neighbours with the cabling plan to catch miswired GPU nodes before a job runs.",
        "flags": [
          [
            "nv show interface lldp",
            "LLDP neighbours on all ports"
          ],
          [
            "nv show interface swp1 lldp",
            "LLDP settings and neighbour for one port"
          ],
          [
            "nv show bridge domain br_default mac-table",
            "Layer 2 forwarding table: MAC, VLAN, port"
          ]
        ],
        "tip": "Verify that server hostname, interface name, and switch port match the intended topology map.",
        "tags": [
          "cumulus-lldp",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/LLDP/",
              "title": "NVUE reference: LLDP"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Bridge/",
              "title": "NVUE reference: bridge"
            }
          ],
          "note": "Corrected 2026-11-10: NVUE has no --view lldp (the views are ber and dom); removed nv show router arp, not found in the NVUE reference."
        }
      }
    ]
  },
  {
    part: "sw-cumulus-bonds",
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
          ["cat /proc/net/bonding/bond1", "Inspect raw Linux kernel 802.3ad LACP partner MAC, aggregator ID, and link failure counters for bond1", {"verified": "2026-11-09", "refs": [{"url": "https://docs.kernel.org/networking/bonding.html", "title": "Linux bonding"}]}],
          ["nv set interface swp10 bridge domain br_default access 100 && nv config apply --assume-yes", "Configure switch port swp10 as an untagged Access port in VLAN 100"]
        ],
        tip: "Check 'Link Failure Count' in /proc/net/bonding/<bond>",
        tags: ["cumulus", "bond", "lacp", "mlag", "vlan", "trunk", "access"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/MLAG/", "title": "NVUE reference: MLAG"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Bridge/", "title": "NVUE reference: bridge"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-2/Ethernet-Bridging-VLANs/VLAN-aware-Bridge-Mode/", "title": "Cumulus Linux 5.18: VLAN-aware bridge"}], "note": "nv show interface bond (all bonds) is not in the NVUE reference; nv show mlag is."}
      }
    ]
  },
  {
    "part": "sw-cumulus-bonds",
    "id": "cumulus-bonds-pro-tips",
    "badge": "tip",
    "title": "Cumulus: MLAG Bonds & VLAN: Pro Tips & Best Practices",
    "subtitle": "High-Availability MLAG & LACP Dual-Homed Server Uplinks",
    "commands": [
      {
        "id": "cumulus-bonds-tips-card",
        "desc": "High-Availability MLAG & LACP Dual-Homed Server Uplinks",
        "cmd": "nv show mlag && nv show interface bond1",
        "details": "MLAG lets a server bond to two leaf switches as one LACP partner. The pair needs a peer link, a unique MLAG system MAC per pair and a backup IP that the switches use when the peer link is down.",
        "flags": [
          [
            "nv show mlag",
            "MLAG state, peer, backup and system MAC"
          ],
          [
            "nv show interface bond1",
            "Bond members and state"
          ],
          [
            "nv set interface bond1 bond member swp1-2",
            "Add members to a bond (changes state)"
          ]
        ],
        "tip": "Before enabling host bonds, check that nv show mlag reports the peer up and that both switches use the same MLAG system MAC and have the backup IP set.",
        "tags": [
          "cumulus-bonds",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/MLAG/",
              "title": "NVUE reference: MLAG"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-2/Multi-Chassis-Link-Aggregation-MLAG/",
              "title": "Cumulus Linux 5.18: MLAG"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Set-and-Unset-Commands/Interface/",
              "title": "NVUE reference: interface set"
            }
          ],
          "note": "Corrected 2026-11-10: NVIDIA's bond member example uses a range (swp1-4), not a comma list."
        }
      }
    ]
  },
  {
    part: "sw-cumulus-bgp",
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
          ["vtysh -c 'show ip bgp summary'", "Query underlying FRRouting (FRR) BGP daemon directly"]
        ],
        subcommands: [
          ["nv show vrf default router rib ipv6", "Display the IPv6 Routing Information Base (RIB) and ECMP next-hops (often link-local fe80:: via BGP Unnumbered)"],
          ["ethtool -S swp1 | grep -iE 'pfc|pause|ecn|discard'", "Check hardware NIC/ASIC counters on swp1 for Priority Flow Control (PFC) pause storms or buffer drops", {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Monitoring-and-Troubleshooting/Troubleshooting-Network-Interfaces/Monitoring-Interfaces-and-Transceivers-with-ethtool/", "title": "Cumulus Linux 5.18: ethtool"}]}]
        ],
        tip: "BGP state 'Active' or 'Connect' means session is DOWN!",
        tags: ["cumulus", "bgp", "evpn", "frr", "roce", "pfc", "ecn", "qos"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-3/Border-Gateway-Protocol-BGP/Troubleshooting-BGP/", "title": "Cumulus Linux 5.18: troubleshooting BGP"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-1-and-Switch-Ports/Quality-of-Service/RDMA-over-Converged-Ethernet-RoCE/", "title": "Cumulus Linux 5.18: RoCE"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/RIB/", "title": "NVUE reference: RIB"}], "note": "Corrected 2026-11-09: NVIDIA's page uses vtysh show ip bgp summary."}
      }
    ]
  },
  {
    part: "sw-cumulus-hw",
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
          ["nv config apply <revision_id> --assume-yes", "Go back to a known-good revision (list them with nv config history). nv config apply --confirm rolls back by itself if you do not confirm"],
          ["nv config translate revision <revision_id>", "Export a revision as flat, copy-pasteable 'nv set ...' commands (Cumulus 5.12 and later)"]
        ],
        tip: "nv config translate revision <id> exports a revision as nv set commands",
        tags: ["cumulus", "platform", "psu", "fan", "temperature", "config", "rollback"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/", "title": "NVUE reference: platform"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/System/", "title": "NVUE reference: system"}, {"url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Config-Commands/", "title": "NVUE reference: config commands"}], "note": "Corrected 2026-11-09: there is no nv config rollback (use nv config apply <rev>), and nv config show -o takes only auto/json/yaml/native."}
      }
    ]
  },
  {
    "part": "sw-cumulus-hw",
    "id": "cumulus-hw-cfg-pro-tips",
    "badge": "tip",
    "title": "Cumulus: PSU, Fans & Config: Pro Tips & Best Practices",
    "subtitle": "Platform Environmental Monitoring & Safe Atomic Configuration",
    "commands": [
      {
        "id": "cumulus-hw-cfg-tips-card",
        "desc": "Platform Environmental Monitoring & Safe Atomic Configuration",
        "cmd": "nv show platform && nv config diff && nv config apply",
        "details": "NVUE features atomic commit semantics. Review configuration changes with `nv config diff` before applying them with `nv config apply`. If a change causes network isolation, go back with `nv config apply <revision_id>` (list revisions with `nv config history`), or use `nv config apply --confirm` so an unconfirmed change rolls itself back.",
        "flags": [
          [
            "nv show platform environment",
            "Check chassis power supplies (PSU1/PSU2 status, wattage), fan RPMs, and ASIC temps"
          ],
          [
            "nv config diff",
            "Display line-by-line unified diff between candidate buffer and active running configuration"
          ],
          [
            "nv config apply",
            "Atomically validate and apply all pending NVUE configuration changes"
          ],
          [
            "nv config apply <revision_id>",
            "Go back to an earlier revision (nv config history lists them)"
          ]
        ],
        "tip": "Check fans and both PSUs in nv show platform environment before and after hardware work.",
        "tags": [
          "cumulus-hw-cfg",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/Platform/",
              "title": "NVUE reference: platform"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Config-Commands/",
              "title": "NVUE reference: config commands"
            }
          ],
          "note": "nv config apply --confirm rolls back unless confirmed within ten minutes by default. Removed 2026-11-10: an unsourced claim that a PSU failure causes immediate thermal throttling."
        }
      }
    ]
  },
  {
    part: "sw-arista-ports",
    id: "arista-ports-dom",
    badge: "eos",
    title: "Arista EOS — Interface Status, Optical DOM & Counters",
    subtitle: "Checking Ethernet* link states, optical transceiver light levels (dBm), CRC/symbol errors & port bouncing",
    commands: [
      {
        id: "arista-interfaces-dom",
        desc: "Inspect Arista switch port status, SFP/QSFP/OSFP optical DOM power (dBm), and non-zero error counters",
        cmd: "show interfaces status && show interfaces Ethernet1 transceiver detail",
        details: "'show interfaces status' lists every port's description, status (connected / notconnect / errdisabled), VLAN, duplex, speed, and transceiver type. 'show interfaces counters errors' adds FCS, alignment, symbol, runt and giant counters for every port.",
        flags: [
          ["status", "One-line summary per interface (connected, notconnect, disabled, errdisabled)"],
          ["transceiver detail", "Show per-lane optical Tx/Rx power (dBm), laser bias, temp, voltage, and alarm thresholds"],
          ["counters errors", "FCS, Align, Symbol, Rx, Runts, Giants and Tx error counters per interface"]
        ],
        subcommands: [
          ["show interfaces counters errors", "Physical error counters (FCS, Align, Symbol, Runts, Giants) for every port"],
          ["show interfaces Ethernet1 phy detail", "Deep physical-layer SerDes, FEC codeword error, and pre/post-FEC BER diagnostics"],
          ["show inventory", "Display switch chassis serial number, PSU models/serials, and every plugged transceiver's vendor/part/serial", {"verified": "2026-11-11", "refs": [{"url": "https://www.arista.com/en/um-eos/eos-session-management-commands", "title": "Arista EOS 4.37: Session management commands (show inventory)"}], "note": "EXEC mode. The example lists the system model and serial, each power supply's model and serial, the fan modules, and every transceiver slot's manufacturer, model, serial and revision."}]
        ],
        tip: "Run show interfaces counters errors twice a minute apart: a counter that grows is the live problem",
        tags: ["arista", "eos", "interfaces", "transceiver", "dom", "errors", "nz", "phy"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://www.arista.com/um-eos/eos-ethernet-ports", "title": "Arista EOS 4.37: Ethernet ports"}], "note": "Corrected 2026-11-09: EOS documents no nz filter. show inventory is in the session management chapter (its own source line)."}
      }
    ]
  },
  {
    "part": "sw-arista-ports",
    "id": "arista-ports-dom-pro-tips",
    "badge": "tip",
    "title": "Arista EOS: Ports & DOM: Pro Tips & Best Practices",
    "subtitle": "Arista EOS Interface Troubleshooting & Optical DOM Limits",
    "commands": [
      {
        "id": "arista-ports-dom-tips-card",
        "desc": "Arista EOS Interface Troubleshooting & Optical DOM Limits",
        "cmd": "show interfaces status && show interfaces transceiver detail",
        "details": "Arista EOS provides granular real-time telemetry on all QSFP-DD, OSFP, and SFP cages. Use `show interfaces transceiver detail` to check whether optical Rx power is within high/low warning and alarm thresholds.",
        "flags": [
          [
            "show interfaces status",
            "Compact summary table of all Ethernet interfaces: status, VLAN, duplex, speed, and media type"
          ],
          [
            "show interfaces transceiver detail",
            "Per-lane optical Rx/Tx power (dBm), temperature, voltage, and calibrated alarm thresholds"
          ],
          [
            "show interfaces counters errors",
            "Identify interfaces accumulating FCS errors, alignment errors, or symbol errors"
          ]
        ],
        "tip": "notconnect means the port has no link: check the cable, the optic and that both ends agree on speed.",
        "tags": [
          "arista-ports-dom",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.arista.com/um-eos/eos-ethernet-ports",
              "title": "Arista EOS 4.37: Ethernet ports"
            }
          ],
          "note": "EOS shows notconnect in examples but the page read does not define it; the meaning here is general practice."
        }
      }
    ]
  },
  {
    part: "sw-arista-mlag",
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
          ["show mac address-table address <mac> && show ipv6 neighbors <ipv6>", "Locate which switch port or Port-Channel learned a specific server MAC or IPv6 Neighbor Discovery entry", {"verified": "2026-11-09", "refs": [{"url": "https://www.arista.com/um-eos/eos-ipv6", "title": "Arista EOS 4.37: IPv6"}], "note": "show ipv6 neighbors is documented; show mac address-table was not found in the chapters read."}],
          ["bash ethtool -m Ethernet1", "Drop into Arista's underlying Linux bash shell to run standard Linux utilities", {"verified": "2026-11-10", "refs": [], "note": "EOS runs a one-off Linux command as bash <command> (manual examples: bash md5sum …, bash tcpdump -i mirror0), but it does not document the Linux name of Ethernet1 or ethtool: run bash ip -br link first."}]
        ],
        tip: "Member flag (P) = active in LACP; (s) = suspended!",
        tags: ["arista", "eos", "lldp", "port-channel", "lacp", "mlag", "mac", "arp"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://www.arista.com/um-eos/eos-link-layer-discovery-protocol", "title": "Arista EOS 4.37: LLDP"}, {"url": "https://www.arista.com/um-eos/eos-port-channels-and-lacp", "title": "Arista EOS 4.37: port channels"}, {"url": "https://www.arista.com/um-eos/eos-multi-chassis-link-aggregation", "title": "Arista EOS 4.37: MLAG"}, {"url": "https://www.arista.com/um-eos/eos-ipv6", "title": "Arista EOS 4.37: IPv6"}], "note": "show mac address-table was not found in the chapters read."}
      }
    ]
  },
  {
    "part": "sw-arista-mlag",
    "id": "arista-lldp-mlag-pro-tips",
    "badge": "tip",
    "title": "Arista EOS: LLDP & MLAG: Pro Tips & Best Practices",
    "subtitle": "Arista EOS MLAG Health & Dual-Homed Port-Channel Bundling",
    "commands": [
      {
        "id": "arista-lldp-mlag-tips-card",
        "desc": "Arista EOS MLAG Health & Dual-Homed Port-Channel Bundling",
        "cmd": "show mlag && show port-channel summary && show lldp neighbors",
        "details": "Arista MLAG joins two switches over a peer link so a dual-homed server sees one LACP partner. Each peer uses the MLAG System ID (MSI), the MLAG domain's MAC address, in its STP and LACP PDUs.",
        "flags": [
          [
            "show mlag",
            "Display MLAG domain ID, peer link status, peer address heartbeat, and local/peer state"
          ],
          [
            "show port-channel summary",
            "List all Port-Channels (Po1, Po10) with protocol (LACP) and member interface flags"
          ],
          [
            "show lldp neighbors",
            "Quick audit of adjacent hosts, switch spine nodes, and management IP addresses"
          ]
        ],
        "tip": "Before maintenance, show mlag should report state : Active and peer-link status : Up.",
        "tags": [
          "arista-lldp-mlag",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.arista.com/um-eos/eos-multi-chassis-link-aggregation",
              "title": "Arista EOS 4.37: MLAG"
            },
            {
              "url": "https://www.arista.com/um-eos/eos-port-channels-and-lacp",
              "title": "Arista EOS 4.37: port channels"
            },
            {
              "url": "https://www.arista.com/um-eos/eos-link-layer-discovery-protocol",
              "title": "Arista EOS 4.37: LLDP"
            }
          ]
        }
      }
    ]
  },
  {
    part: "sw-arista-bgp",
    id: "arista-bgp-env",
    badge: "env",
    title: "Arista EOS — BGP, Environment, Logs & Config Diff",
    subtitle: "Checking BGP summary, PSU/fan/cooling status (show environment), syslog events & session config diffs",
    commands: [
      {
        id: "arista-bgp-environment-logs",
        desc: "Inspect IPv6/IPv4 BGP peering, chassis power/fan/temperature sensors, recent link-flap logs, and config changes",
        cmd: "show ipv6 bgp summary && show system environment all && show logging",
        details: "Use 'show system environment all' during rack walk-throughs to verify both PSUs are 'Ok', fans are running at normal speed without airflow direction mismatches, and optic/ASIC temperatures are below alert thresholds.",
        flags: [
          ["show ipv6 bgp summary", "List all IPv6 BGP peers, ASNs, message counts, and state/prefixes received (also 'show ip bgp summary')"],
          ["show system environment all", "Show power supply status/wattage, fan tray speeds, and temperature sensors"],
          ["show logging 50", "The 50 most recent syslog messages (show logging last <n> filters by time units, not a count)"]
        ],
        subcommands: [
          ["show version && show boot-config", "Check Arista switch hardware model, serial number, MAC, uptime, and EOS image version, then the image the next reload boots", {"verified": "2026-11-10", "refs": [{"url": "https://www.arista.com/assets/data/pdf/user-manual/EOS-User-Manual.pdf", "title": "Arista EOS 4.37.0F user guide (PDF)"}], "note": "EOS 4.37.0F: show version identifies the switch (model, serial, system MAC, image, uptime); the manual views boot settings with show boot-config."}],
          ["show running-config interfaces ethernet 1", "View the exact configuration block applied to interface Ethernet1", {"verified": "2026-11-10", "refs": [{"url": "https://www.arista.com/assets/data/pdf/user-manual/EOS-User-Manual.pdf", "title": "Arista EOS 4.37.0F user guide (PDF)"}], "note": "EOS 4.37.0F examples: show running-config interfaces ethernet 3 and ethernet 15/1."}]
        ],
        tags: ["arista", "eos", "bgp", "environment", "psu", "fan", "logging", "version"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://www.arista.com/um-eos/eos-border-gateway-protocol-bgp", "title": "Arista EOS 4.37: BGP"}, {"url": "https://www.arista.com/um-eos/eos-environment-commands", "title": "Arista EOS 4.37: environment"}, {"url": "https://www.arista.com/um-eos/eos-switch-administration-commands", "title": "Arista EOS 4.37: show logging"}], "note": "Corrected 2026-11-09: show logging last <n> filters by time; a count is show logging <n>. show version and show boot-config are not in the chapters read."}
      }
    ]
  },
  {
    "part": "sw-arista-bgp",
    "id": "arista-bgp-env-pro-tips",
    "badge": "tip",
    "title": "Arista EOS: BGP & Health: Pro Tips & Best Practices",
    "subtitle": "Arista EOS BGP State & Transactional Config Sessions",
    "commands": [
      {
        "id": "arista-bgp-env-tips-card",
        "desc": "Arista EOS BGP State & Transactional Config Sessions",
        "cmd": "show ip bgp summary && show system environment all",
        "details": "Arista EOS supports transactional configuration via `configure session`. Changes are isolated in a private session where you can verify syntax with `show session-config diff` before committing or aborting.",
        "flags": [
          [
            "show ip bgp summary",
            "Summary of all IPv4 BGP neighbor sessions: peer IP, AS number, state, and prefix count"
          ],
          [
            "show system environment all",
            "Display real-time fan RPMs, chassis temperatures, and power supply wattage/voltage"
          ],
          [
            "configure session <name> ; show session-config diff ; commit",
            "Atomic configuration session with preview diff and commit"
          ]
        ],
        "tip": "Always use \"configure session <name>\" for production changes to prevent accidental live-editing collisions.",
        "tags": [
          "arista-bgp-env",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.arista.com/um-eos/eos-border-gateway-protocol-bgp",
              "title": "Arista EOS 4.37: BGP"
            },
            {
              "url": "https://www.arista.com/um-eos/eos-environment-commands",
              "title": "Arista EOS 4.37: environment"
            }
          ],
          "note": "Arista refused automated reads of the configure session page, so the session commands (configure session, show session-config diffs, commit) are not checked."
        }
      }
    ]
  },
  {
    part: "sw-nxos-ports",
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
        tags: ["nxos", "cisco", "nexus", "interface", "transceiver", "dom", "errors"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_i_showcmds.html", "title": "NX-OS 10.5 show commands: interface"}, {"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_i_showcmds.html", "title": "NX-OS 10.5 show commands: inventory"}], "note": "The status values and the ++ / + DOM legend are not in the show command reference."}
      }
    ]
  },
  {
    "part": "sw-nxos-ports",
    "id": "nxos-ports-dom-pro-tips",
    "badge": "tip",
    "title": "Cisco NX-OS: Ports & DOM: Pro Tips & Best Practices",
    "subtitle": "Cisco Nexus NX-OS Interface Triage & Transceiver Calibration",
    "commands": [
      {
        "id": "nxos-ports-dom-tips-card",
        "desc": "Cisco Nexus NX-OS Interface Triage & Transceiver Calibration",
        "cmd": "show interface brief && show interface transceiver details",
        "details": "On Cisco Nexus 9000/3000 switches, `show interface brief` gives a quick snapshot of link status and speed. `show interface transceiver details` prints per-lane optical levels alongside warning/alarm thresholds calibrated to the optical transceiver part.",
        "flags": [
          [
            "show interface brief",
            "Summary list of Ethernet, Port-Channel, and management interfaces with status and speed"
          ],
          [
            "show interface transceiver details",
            "Detailed optical Tx/Rx power (dBm), temperature, voltage, and threshold alarms"
          ],
          [
            "show interface counters errors",
            "Display CRC, input error, and frame alignment error counts across all switch ports"
          ]
        ],
        "tip": "If Rx power is in the module's warning or alarm range, clean and inspect the fiber and check for tight bends before replacing the optic.",
        "tags": [
          "nxos-ports-dom",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_i_showcmds.html",
              "title": "NX-OS 10.5 show commands: interface"
            }
          ],
          "note": "Removed 2026-11-10: an unsourced \"-14 dBm\" alarm level; thresholds come from each transceiver."
        }
      }
    ]
  },
  {
    part: "sw-nxos-vpc",
    id: "nxos-lldp-vpc",
    badge: "vpc",
    title: "Cisco NX-OS — LLDP/CDP, LACP Port-Channel & vPC",
    subtitle: "Discovering neighbor servers/switches (lldp/cdp), checking LACP port-channel flags (P/I/D) & vPC dual-homing consistency",
    commands: [
      {
        id: "nxos-neighbors-portchannel-vpc",
        desc: "Inspect LLDP and CDP neighbors, LACP Port-Channel member states, vPC dual-ToR health, and MAC/ARP tables",
        cmd: "show lldp neighbors && show port-channel summary && show vpc",
        details: "In Cisco NX-OS 'show port-channel summary', '(P)' means the port is Up in the port-channel, '(I)' means Individual, '(D)' means Down, and '(s)' means suspended. 'show vpc' shows the peer-link, peer-keepalive and consistency status of both peers; 'show vpc consistency-parameters vpc <id>' lists a mismatch on one vPC.",
        flags: [
          ["show lldp neighbors", "Display IEEE 802.1AB LLDP neighbor devices and port IDs (also check 'show cdp neighbors')"],
          ["port-channel summary", "Show Port-Channel groups (Po1..), protocol (LACP), and member status flags (P/D/I/s)"],
          ["show vpc", "Verify Virtual Port-Channel (vPC) peer-link, keepalive status, and per-vPC consistency"]
        ],
        subcommands: [
          ["show cdp neighbors detail && show lldp neighbors detail", "View detailed neighbor management IPs, OS versions, and port descriptions"],
          ["show mac address-table address <mac> && show ipv6 neighbor <ipv6>", "Trace a server MAC or IPv6 Neighbor Discovery (NDP) address to its exact Ethernet1/* or Po* interface", {"verified": "2026-11-09", "refs": [{"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_m_showcmds.html", "title": "NX-OS 10.5 show commands: MAC table"}], "note": "The bare show ipv6 neighbor is not in the 10.5 show reference."}],
          ["show environment", "Check Nexus power supplies, fan trays, and temperature sensor status"]
        ],
        tip: "vPC suspended? show vpc consistency-parameters global, then … vpc <id> for that port-channel",
        tags: ["nxos", "cisco", "lldp", "cdp", "port-channel", "lacp", "vpc", "environment"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_l_showcmds.html", "title": "NX-OS 10.5 show commands: LLDP"}, {"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_c_showcmds.html", "title": "NX-OS 10.5 show commands: CDP"}, {"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_p_showcmds.html", "title": "NX-OS 10.5 show commands: port-channel"}, {"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_v_showcmds.html", "title": "NX-OS 10.5 show commands: vPC"}, {"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_m_showcmds.html", "title": "NX-OS 10.5 show commands: MAC table"}, {"url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_e_showcmds.html", "title": "NX-OS 10.5 show commands: environment"}], "note": "show ipv6 neighbor <addr> is not in the 10.5 show reference; the port-channel flag legend is in a configuration guide, not read."}
      }
    ]
  },
  {
    "part": "sw-nxos-vpc",
    "id": "nxos-lldp-vpc-pro-tips",
    "badge": "tip",
    "title": "Cisco NX-OS: LLDP & vPC: Pro Tips & Best Practices",
    "subtitle": "Cisco Nexus Virtual Port-Channel (vPC) Consistency & Peer Keepalive",
    "commands": [
      {
        "id": "nxos-lldp-vpc-tips-card",
        "desc": "Cisco Nexus Virtual Port-Channel (vPC) Consistency & Peer Keepalive",
        "cmd": "show vpc && show vpc consistency-parameters global",
        "details": "vPC dual-homes a server or switch to two Nexus peers with no STP-blocked ports, but STP still runs on both peers as a fail-safe. The peer-keepalive (management VRF by default, never over the peer-link) is only used when every peer-link member is down: if the other peer is still alive, the secondary disables all its vPC ports. Must-match (Type 1) settings such as STP mode, MTU, port-channel mode, speed and the trunk's allowed VLANs suspend the vPC when they differ; with graceful consistency-check (on by default) only the secondary's links go down.",
        "flags": [
          [
            "show vpc",
            "Overview of vPC domain status, peer link status, peer keepalive status, and vPC interface bundle states"
          ],
          [
            "show vpc consistency-parameters global",
            "Global must-match settings (STP mode, MTU and the like) on both peers"
          ],
          [
            "show vpc consistency-parameters vpc <id>",
            "One vPC's must-match settings: port-channel mode, speed, duplex, allowed VLANs"
          ],
          [
            "show vpc role",
            "Primary or secondary: the lower role priority wins (lowest MAC by default); after a failover the roles stay swapped until vpc role preempt"
          ],
          [
            "show lldp neighbors",
            "List discovered physical neighbors with device ID, port ID, and capabilities"
          ]
        ],
        "tip": "Peer-link down but keepalive up: the secondary's vPC ports go down on purpose. Fix the peer-link, not the server",
        "tags": [
          "nxos-lldp-vpc",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-11",
          "refs": [
            {
              "url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_v_showcmds.html",
              "title": "NX-OS 10.5 show commands: vPC"
            },
            {
              "url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/command-reference/show/b_n9k_show_commands_1051/m_l_showcmds.html",
              "title": "NX-OS 10.5 show commands: LLDP"
            },
            {
              "url": "https://www.cisco.com/c/en/us/td/docs/dcn/nx-os/nexus9000/105x/configuration/interfaces/cisco-nexus-9000-series-nx-os-interfaces-configuration-guide-release-105x/m_configuring_vpcs_9x.html",
              "title": "NX-OS 10.5(x) Interfaces Configuration Guide: Configuring vPCs"
            }
          ],
          "note": "Checked 2026-11-11 against the NX-OS 10.5(x) vPC configuration guide (consistency parameters, peer-keepalive, roles, STP) and the 10.5 show reference (show vpc consistency-parameters { global | vni | interface | vpc }, show vpc role)."
        }
      }
    ]
  },
  {
    part: "sw-sonic",
    id: "sonic-cli",
    badge: "snc",
    title: "SONiC — Enterprise & Cloud Switch CLI",
    subtitle: "Inspecting Ethernet* port status, transceiver optical DOM, lldpctl neighbors, PortChannel bonds & platform sensors",
    commands: [
      {
        id: "sonic-interfaces-sfputil-lldp",
        desc: "Check SONiC switch interface status, optical transceiver DOM EEPROM, LLDP neighbors, and PSU/fan health",
        cmd: "show interfaces status && show interfaces transceiver eeprom --dom Ethernet0",
        details: "SONiC (Software for Open Networking in the Cloud) runs on Debian Linux using Docker containers for each network service (swss, bgp, syncd, lldp, pmon). Standard Linux commands and SONiC 'show' / 'sfputil' / 'config' CLI tools both work.",
        flags: [
          ["show interfaces status", "Oper/Admin state, lanes, speed, MTU, alias and type for every port (FEC is show interfaces fec status)"],
          ["show interfaces transceiver eeprom --dom", "Transceiver EEPROM plus Digital Optical Monitoring (Tx/Rx power, temperature)"],
          ["show lldp table", "Compact table of local ports and connected remote LLDP neighbor hostnames and ports"]
        ],
        subcommands: [
          ["show lldp table && show lldp neighbors Ethernet0", "List all LLDP neighbors across the switch or inspect detailed TLVs on Ethernet0"],
          ["show interfaces counters errors && show pfc counters", "Inspect physical error counters and RoCEv2 Priority Flow Control (PFC) pause counters"],
          ["show platform summary && show platform psustatus && show platform fan && show platform temperature", "Inspect SONiC switch hardware SKU, ASIC, PSU wattage/status, fan RPMs, and board temperatures"],
          ["config interface shutdown Ethernet0 && config interface startup Ethernet0", "Bounce (shut / no shut) port Ethernet0 in SONiC and save with 'config save -y'"]
        ],
        tip: "show interfaces transceiver eeprom --dom reads optical DOM on SONiC switches",
        tags: ["sonic", "sfputil", "interfaces", "lldp", "platform", "psu", "pfc"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/sonic-net/sonic-utilities/blob/master/doc/Command-Reference.md", "title": "SONiC command reference"}], "note": "Corrected 2026-11-09: sfputil show eeprom is not documented; the DOM command is show interfaces transceiver eeprom --dom."}
      }
    ]
  },
  {
    "part": "sw-sonic",
    "id": "sonic-cli-pro-tips",
    "badge": "tip",
    "title": "SONiC: Cloud NOS CLI: Pro Tips & Best Practices",
    "subtitle": "SONiC NOS Architecture, Interface Management & Container Diagnostics",
    "commands": [
      {
        "id": "sonic-cli-tips-card",
        "desc": "SONiC NOS Architecture, Interface Management & Container Diagnostics",
        "cmd": "show interfaces status && show interfaces transceiver eeprom --dom && docker ps",
        "details": "SONiC runs on Debian Linux with its functions in Docker containers (swss, syncd, teamd, bgp, lldp, pmon, database and others). syncd programs the ASIC through SAI (Switch Abstraction Interface).",
        "flags": [
          [
            "show interfaces status",
            "Admin and oper state, lanes, speed, MTU, alias and type (FEC: show interfaces fec status)"
          ],
          [
            "show interfaces transceiver eeprom --dom <port>",
            "Module EEPROM, vendor info and DOM"
          ],
          [
            "show lldp table",
            "Summary of LLDP neighbours"
          ],
          [
            "docker ps",
            "SONiC containers and their uptime (swss, syncd, teamd, bgp, ...)"
          ]
        ],
        "tip": "If forwarding or telemetry stalls, docker ps shows whether swss, syncd and bgp are up; orchagent runs inside swss.",
        "tags": [
          "sonic-cli",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/sonic-net/sonic-utilities/blob/master/doc/Command-Reference.md",
              "title": "SONiC command reference"
            },
            {
              "url": "https://github.com/sonic-net/SONiC/wiki/Architecture",
              "title": "SONiC architecture (containers)"
            }
          ],
          "note": "Corrected 2026-11-10: orchagent is a process in the swss container, not a container."
        }
      }
    ]
  },
  {
    "id": "cumulus-bgp-roce-pro-tips",
    "badge": "tip",
    "title": "Cumulus: BGP, EVPN & RoCEv2: Pro Tips & Best Practices",
    "subtitle": "BGP Unnumbered & RoCEv2 Lossless Buffer Configuration",
    "commands": [
      {
        "id": "cumulus-bgp-roce-tips-card",
        "desc": "BGP Unnumbered & RoCEv2 Lossless Buffer Configuration",
        "cmd": "nv show vrf default router bgp neighbor && nv show qos roce",
        "details": "Leaf-spine fabrics often use BGP unnumbered (IPv6 link-local peering). Cumulus RoCE lossless mode maps switch priority 3 to the RoCE traffic class with PFC and ECN, and priority 6 to CNP; nv set qos roce turns it on.",
        "flags": [
          [
            "nv show vrf default router bgp neighbor",
            "BGP neighbours and state"
          ],
          [
            "nv show qos roce",
            "Current RoCE mode and settings"
          ],
          [
            "nv set qos roce",
            "Enable RoCE lossless mode (default mode; changes state, then nv config apply)"
          ]
        ],
        "tip": "The NIC must tag RoCE traffic with the same priority the switch treats as lossless (3 by default), or the traffic is not protected by PFC.",
        "tags": [
          "cumulus-bgp-roce",
          "tips",
          "pro",
          "switches",
          "fabric",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-3/Border-Gateway-Protocol-BGP/Troubleshooting-BGP/",
              "title": "Cumulus Linux 5.18: troubleshooting BGP"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/cumulus-linux-518/Layer-1-and-Switch-Ports/Quality-of-Service/RDMA-over-Converged-Ethernet-RoCE/",
              "title": "Cumulus Linux 5.18: RoCE"
            },
            {
              "url": "https://docs.nvidia.com/networking-ethernet-software/nvue-reference/Show-Commands/QoS/",
              "title": "NVUE reference: QoS"
            }
          ],
          "note": "Corrected 2026-11-10: replaced an unverified nv set qos pfc syntax with NVIDIA's nv set qos roce."
        }
      }
    ],
    "part": "sw-cumulus-bgp"
  },
  {
    "id": "switch-hardware",
    "part": "sw-hardware",
    "badge": "hw",
    "title": "Hardware: Front Panels & Port Naming",
    "subtitle": "Eleven devices: cages, port names and what to check before recabling",
    "commands": [
      {
        "id": "hw-hasivo",
        "mode": "L2+ ETHERNET",
        "modeClass": "mode-v",
        "desc": "Hasivo S5800W-24G-2S: 24 × 1GbE RJ45 + 2 × 1GbE SFP uplinks",
        "cmd": "Model: Hasivo S5800W-24G-2S   |   24 RJ45 / 2 SFP   |   Access switch · Gigabit Ethernet",
        "details": "Two rows of 12 copper ports (odd ports on top, even below), with the two SFP uplinks (25 and 26) at the right. Confirm the printed port labels on your unit. Ports 1–24 are copper access ports; ports 25–26 are the two SFP uplinks. Confirm the printed port labels before recabling.",
        "flags": [
          [
            "Cage",
            "RJ45 + SFP"
          ],
          [
            "Type",
            "1G access"
          ],
          [
            "Port names",
            "RJ45 5, SFP 1, 25SFP"
          ],
          [
            "Port 1",
            "RJ45 10/100/1000Base-T · RJ45 1"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "hasivo",
          "hasivo"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.hasivopoe.com/full-gigabit-24ge-2sfp-l2-managed-switch/",
              "title": "Hasivo S5800W-24G-2S product page"
            }
          ],
          "note": "Hasivo page for S5800W-24G-2S: 24 × 10/100/1000Base-T RJ45 + 2 × 1000M SFP, layer 2 managed. The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
      },
      {
        "id": "hw-qm9790",
        "mode": "NDR INFINIBAND",
        "modeClass": "mode-v",
        "desc": "NVIDIA MQM9790-NS2R (QM9790): Quantum-2 · 32 twin port OSFP cages · 64 × 400G NDR logical ports",
        "cmd": "Model: NVIDIA MQM9790-NS2R (QM9790)   |   32 OSFP / 64 NDR   |   Unmanaged InfiniBand fabric switch · C2P (connector-to-power, reverse) airflow",
        "details": "Two physical rows × 16 columns. Odd cages are on top, even cages below. Each cage has two 400G logical ports. The map follows NVIDIA’s non-splittable 64-port profile. Odd cages show ascending logical ports; even cages reverse them. A splittable profile changes the logical mapping, so confirm the active profile before recabling.",
        "flags": [
          [
            "Cage",
            "Twin port OSFP"
          ],
          [
            "Type",
            "400G per half"
          ],
          [
            "Port names",
            "port 3, cage 2, ib 1/14/2"
          ],
          [
            "Port 1",
            "Finned twin port OSFP · Cage 1 · ports 1 and 2"
          ],
          [
            "Splittable",
            "128 × NDR200 (200Gb/s)"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "qm9790",
          "qm9790"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking/display/qm97xx-1u-ndr-400gbps-infiniband-switch-systems-user-manual.pdf",
              "title": "NVIDIA QM97XX user manual: ordering table and port splitting"
            }
          ],
          "note": "NVIDIA QM97XX manual ordering table: MQM9790-NS2R, 64-ports NDR, 32 OSFP ports, unmanaged, C2P airflow (NS2F is P2C); up to 128 ports of 200Gb/s with port split. The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
      },
      {
        "id": "hw-sn5400",
        "mode": "400G ETHERNET",
        "modeClass": "mode-v",
        "desc": "NVIDIA SN5400: Spectrum-4 · 64 × 400GbE QSFP-DD + 2 × 25GbE SFP28 (1GbE supported)",
        "cmd": "Model: NVIDIA SN5400   |   64 QSFP-DD / 2 SFP28   |   High speed Ethernet fabric switch",
        "details": "Four physical rows × 16 columns. The first column is cages 1, 2, 3, 4 from top to bottom; the next is 5, 6, 7, 8. SFP28 ports 65 and 66 are at the left. Native mode is one swpN interface per QSFP-DD cage. NVIDIA: each 400GbE port splits to 2 × 200GbE or 4 × 100GbE, or 8 × 50GbE with the port above or below unmapped. The 2× and 4× views illustrate supported breakout naming (swpNs0…) and do not read the actual switch configuration. Confirm the configured mode before recabling.",
        "flags": [
          [
            "Cage",
            "QSFP-DD"
          ],
          [
            "Type",
            "400GbE"
          ],
          [
            "Port names",
            "swp14, swp14s1, cage 65"
          ],
          [
            "Port 1",
            "QSFP-DD · swp1"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "sn5400",
          "sn5400"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/sn5000hw/introduction",
              "title": "NVIDIA SN5000 hardware manual: introduction (ports and speeds)"
            },
            {
              "url": "https://networking-docs.nvidia.com/sn5000hw/cable-installation",
              "title": "NVIDIA SN5000 hardware manual: cable installation and splitting"
            },
            {
              "url": "https://networking-docs.nvidia.com/sn5000hw/data-interfaces-and-high-power-transceivers-support",
              "title": "NVIDIA SN5000 hardware manual: data interfaces and high-power support"
            }
          ],
          "note": "NVIDIA: 64 QSFP-DD 400GbE and 2 × SFP28 25GbE; 1GbE only on SFP28 ports 65 and 66 (10GbE is not stated); split 2×200 / 4×100 / 8×50 GbE; 12 W per QSFP-DD port. The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
      },
      {
        "id": "hw-sn5600",
        "mode": "800G ETHERNET",
        "modeClass": "mode-v",
        "desc": "NVIDIA SN5600: Spectrum-4 · 64 × 800GbE OSFP (2 × 400G per module) + 1 × 25GbE SFP28 (1GbE supported)",
        "cmd": "Model: NVIDIA SN5600   |   64 OSFP / 1 SFP28   |   High speed Ethernet fabric switch",
        "details": "Four physical rows × 16 columns. Each column runs top-to-bottom 1, 2, 3, 4; then 5, 6, 7, 8. SFP28 port 65 is at the left. In 2×400G view, lower inverted OSFP modules show s1 to the left of s0. The 2× view shows connector/subinterface order documented by NVIDIA: upper modules s0 | s1, lower inverted modules s1 | s0. NVIDIA: each OSFP cage runs 800G, 2×400G or 4×200G, or 8×100G with a split fiber (an odd port split to 8 blocks its even neighbour). The 4× view lists logical children; it does not claim a left-to-right fiber order. Confirm the switch’s active breakout configuration.",
        "flags": [
          [
            "Cage",
            "Twin port OSFP"
          ],
          [
            "Type",
            "800GbE"
          ],
          [
            "Port names",
            "swp14, swp14s1, cage 65"
          ],
          [
            "Port 1",
            "Finned twin port OSFP · swp1"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "sn5600",
          "sn5600"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/sn5000hw/introduction",
              "title": "NVIDIA SN5000 hardware manual: introduction (ports and speeds)"
            },
            {
              "url": "https://networking-docs.nvidia.com/sn5000hw/cable-installation",
              "title": "NVIDIA SN5000 hardware manual: cable installation and splitting"
            },
            {
              "url": "https://networking-docs.nvidia.com/sn5000hw/data-interfaces-and-high-power-transceivers-support",
              "title": "NVIDIA SN5000 hardware manual: data interfaces and high-power support"
            }
          ],
          "note": "NVIDIA: 64 OSFP 800GbE and 1 × SFP28 25GbE (1GbE only on port 65); breakout naming C1 = s0, C2 = s1 for 2×400G; 18 W per OSFP port. The left/right order of s0 and s1 on inverted lower modules is shown only in NVIDIA’s illustration and was not re-checked. The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
      },
      {
        "id": "hw-c9200l",
        "mode": "CAMPUS ETHERNET",
        "modeClass": "mode-v",
        "desc": "Cisco C9200L-48T-4X-E: 48 × 1GbE RJ45 + 4 × 1/10G SFP+ fixed uplinks",
        "cmd": "Model: Cisco C9200L-48T-4X-E   |   48 RJ45 / 4 SFP+   |   Campus Ethernet switch · Essentials license",
        "details": "Two rows of 24 copper jacks (odd ports on top, even below), with four fixed 10G SFP+ uplinks at right. Compare printed labels on the exact unit. Access ports are fixed copper. The four SFP+ uplinks are 1/10G; verify the exact optic and Cisco qualification. The -E suffix is the Essentials software license.",
        "flags": [
          [
            "Cage",
            "RJ45 + SFP+"
          ],
          [
            "Type",
            "1G access"
          ],
          [
            "Port names",
            "Gi1/0/14, Te1/1/1, U1"
          ],
          [
            "Port 1",
            "RJ45 10/100/1000Base-T · Gi1/0/1 (example stack member 1)"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "c9200l",
          "c9200l"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-9200-series-switches/nb-06-cat9200-ser-data-sheet-cte-en.html",
              "title": "Cisco Catalyst 9200 Series data sheet (updated 2026-11-05)"
            },
            {
              "url": "https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst9200/hardware/install/b-c9200-hig/product_overview.html",
              "title": "Cisco Catalyst 9200 hardware installation guide: product overview"
            }
          ],
          "note": "Cisco data sheet: C9200L-48T-4X, 48 ports data, 4 × 1/10G fixed uplinks; -E is the Network Essentials ordering option. Install guide: the uplinks take 1G SFP or 10G SFP+ modules; 10/100/1000 ports are RJ-45. The interface names are IOS XE convention, not quoted. The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text. (The guide’s old data-sheet link now returns 404.)"
        }
      },
      {
        "id": "hw-acs8000",
        "mode": "CONSOLE ACCESS",
        "modeClass": "mode-v",
        "desc": "Vertiv Avocent ACS8000: Console-server family · two LAN interfaces with copper or 1G SFP media",
        "cmd": "Model: Vertiv Avocent ACS8000   |   2 LAN / 8–48 serial   |   Serial console server · exact submodel needed for serial map",
        "details": "Network connections only: LAN1 (top row) and LAN2 (bottom row) each have copper (left) and fiber SFP (right) connector choices. Serial-port count varies by submodel: 8, 16, 32, or 48. This is a console server, not a packet switch. Only one media connection per LAN interface may be active at a time; Vertiv says fiber takes priority when both are connected. Check the exact submodel before tracing serial ports.",
        "flags": [
          [
            "Cage",
            "LAN media"
          ],
          [
            "Type",
            "1G management"
          ],
          [
            "Port names",
            "LAN1 Cu, LAN2 SFP"
          ],
          [
            "Port 1",
            "RJ45 10/100/1000Base-T · LAN1"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "acs8000",
          "acs8000"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.vertiv.com/49f5bb/globalassets/products/monitoring-control-and-management/serial-consoles-and-gateways/avocent-acs-8000-quick-installation-guide-english.pdf",
              "title": "Vertiv Avocent ACS8000 quick installation guide"
            },
            {
              "url": "https://www.vertiv.com/en-emea/products-catalog/monitoring-control-and-management/serial-console-and-gateways/avocent-acs-8000-serial-consoles/",
              "title": "Vertiv Avocent ACS 8000 product page: models"
            }
          ],
          "note": "Vertiv quick install guide: LAN ports on the left are copper, on the right fiber (SFP); only one LAN1 and one LAN2 port may be used at a time, and fiber has priority when both are connected. Product page: 8, 16, 32 or 48 RS-232 serial ports; 1Gb SFP modules. The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
      },
      {
        "id": "hw-mx304",
        "mode": "MODULAR ROUTER",
        "modeClass": "mode-v",
        "desc": "Juniper MX304: Modular router · two or three LMIC slots, installed modules set port count",
        "cmd": "Model: Juniper MX304   |   2–3 LMIC slots   |   Modular Ethernet router · slot-level map until LMICs are identified",
        "details": "LMIC0 and LMIC1 are available with two routing engines. The RE1/LMIC2 position can instead hold a third LMIC when one routing engine is installed. Photo shows the two-LMIC layout. These buttons identify module bays, not optic cages. LMIC type, slot occupancy, Junos release, and breakout profile determine actual interfaces. Read the installed LMIC model before mapping its ports.",
        "flags": [
          [
            "Cage",
            "LMIC bay"
          ],
          [
            "Type",
            "module dependent"
          ],
          [
            "Port names",
            "LMIC0, LMIC1, LMIC2"
          ],
          [
            "Port 1",
            "LMIC module slot · LMIC0"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "mx304",
          "mx304"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://networkingdocs.hpe.com/documentation/us/en/hardware/mx304/topics/topic-map/mx304-chassis.html",
              "title": "Juniper MX304 hardware guide: chassis (LMIC slots)"
            }
          ],
          "note": "Juniper (docs now served from networkingdocs.hpe.com): two Routing Engines with LMIC 0 and LMIC 1; with one RE, a third LMIC goes in the RE 1/LMIC2 slot; 2 or 3 LMICs. The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
      },
      {
        "id": "hw-arista7260",
        "mode": "100G ETHERNET",
        "modeClass": "mode-v",
        "desc": "Arista DCS-7260CX3-64-F: 64 × 40/100GbE QSFP28 + 2 × 1/10GbE SFP+",
        "cmd": "Model: Arista DCS-7260CX3-64-F   |   64 QSFP28 / 2 SFP+   |   Data-center Ethernet switch · front-to-rear airflow",
        "details": "Four rows × 16 columns: ports 1–32 occupy the upper two rows (odd over even) and 33–64 the lower two rows; SFP+ ports 65 and 66 are stacked at top right. Confirm printed labels before recabling. 40/100G QSFP100 ports break out to 4 × 10G, 4 × 25G or 2 × 50G, but the map shows native physical cages. The -F SKU specifies front-to-rear airflow; verify exact optic qualification in Arista documentation.",
        "flags": [
          [
            "Cage",
            "QSFP28"
          ],
          [
            "Type",
            "40/100GbE"
          ],
          [
            "Port names",
            "Ethernet14, Et33, Et14/1"
          ],
          [
            "Port 1",
            "QSFP28 · Ethernet1"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "7260cx3",
          "arista7260"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.arista.com/assets/data/pdf/Datasheets/7260X3_Datasheet.pdf",
              "title": "Arista 7260X3 data sheet: ports, breakouts, ordering codes"
            }
          ],
          "note": "Arista data sheet: 7260CX3-64, 64 × 40/100GbE QSFP100 + 2 SFP+, 2RU; breakouts 4×10 / 4×25 / 2×50 GbE; DCS-7260CX3-64-F = front-to-rear air (-R rear-to-front). The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
      },
      {
        "id": "hw-ccr2216",
        "mode": "ROUTEROS ETHERNET",
        "modeClass": "mode-v",
        "desc": "MikroTik CCR2216-1G-12XS-2XQ: 12 × 25G SFP28 + 2 × 100G QSFP28 + 1 × 1G RJ45",
        "cmd": "Model: MikroTik CCR2216-1G-12XS-2XQ   |   12 SFP28 / 2 QSFP28   |   RouterOS Ethernet router · 12 SFP28 and two QSFP28 cages",
        "details": "The two QSFP28 cages are at the left, followed by twelve SFP28 cages (six columns: even ports on top, odd below) and the RJ45 port. Map numbers 13–15 are guide indexes for Q1, Q2, and ether1, not printed chassis numbers. RouterOS QSFP28 breakout naming and enabled speed depend on configuration. Match the printed Q1/Q2 and SFP labels on the chassis; guide indexes 13–15 are for search only.",
        "flags": [
          [
            "Cage",
            "SFP28 + QSFP28"
          ],
          [
            "Type",
            "25/100GbE"
          ],
          [
            "Port names",
            "S1, Q1, sfp28-1, ether1"
          ],
          [
            "Port 1",
            "SFP28 25GbE · sfp28-1"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "ccr2216",
          "ccr2216"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://mikrotik.com/product/ccr2216_1g_12xs_2xq",
              "title": "MikroTik CCR2216-1G-12XS-2XQ product page"
            },
            {
              "url": "https://cdn.mikrotik.com/web-assets/product_files/CCR2216-1G-12XS-2XQ_231005.pdf",
              "title": "MikroTik CCR2216-1G-12XS-2XQ brochure"
            }
          ],
          "note": "MikroTik: 12 × 25G SFP28, 2 × 100G QSFP28, 1 × 10/100/1000 Ethernet, plus an RJ45 serial console. Whether ether1 is a management-only port is not stated. The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
      },
      {
        "id": "hw-msn2410",
        "mode": "25/100G ETHERNET",
        "modeClass": "mode-v",
        "desc": "Mellanox MSN2410-CB2RC: 48 × 25GbE SFP28 + 8 × 100GbE QSFP28",
        "cmd": "Model: Mellanox MSN2410-CB2RC   |   48 SFP28 / 8 QSFP28   |   Spectrum Ethernet switch · Cumulus Linux SKU · End of Life",
        "details": "Two rows of 24 SFP28 cages (odd ports on top, even below) with eight QSFP28 cages (49–56, odd over even) at the right. Confirm printed labels on your chassis. MSN2410-CB2RC is the Cumulus Linux, connector-to-power airflow SKU. Breakout naming depends on active configuration; confirm actual port state before recabling. NVIDIA lists MSN2410-CB2RC as End of Life.",
        "flags": [
          [
            "Cage",
            "SFP28 + QSFP28"
          ],
          [
            "Type",
            "25/100GbE"
          ],
          [
            "Port names",
            "swp14, swp49, swp49s0"
          ],
          [
            "Port 1",
            "SFP28 25GbE · swp1"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "sn2410",
          "msn2410"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking/display/nvidia-spectrum-sn2000-1u-switch-systems-hardware-user-manual.pdf",
              "title": "NVIDIA SN2000 hardware user manual: ordering table"
            }
          ],
          "note": "NVIDIA SN2000 manual ordering table: MSN2410-CB2RC, Spectrum 25GbE/100GbE switch with Cumulus Linux, 48 SFP28 + 8 QSFP28, short depth, C2P airflow, EOL (End of Life). The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
      },
      {
        "id": "hw-n9k",
        "mode": "NEXUS ETHERNET",
        "modeClass": "mode-v",
        "desc": "Cisco N9K-C93180YC-FX3: 48 × 1/10/25GbE SFP28 + 6 × 40/100GbE QSFP28",
        "cmd": "Model: Cisco N9K-C93180YC-FX3   |   48 SFP28 / 6 QSFP28   |   Nexus data-center Ethernet switch",
        "details": "Two rows of 24 SFP28 cages (odd ports on top, even below) in the main bank; QSFP28 ports 49–54 (odd over even) are at right. Confirm the chassis labels. NX-OS interface names use Ethernet1/N for a standalone unit. The QSFP28 uplinks run 40 or 100G (10G through a QSA on ports 49–52); check the configured mode and Cisco’s transceiver support list before assuming a breakout.",
        "flags": [
          [
            "Cage",
            "SFP28 + QSFP28"
          ],
          [
            "Type",
            "25/100GbE"
          ],
          [
            "Port names",
            "Ethernet1/14, Eth1/49"
          ],
          [
            "Port 1",
            "SFP28 1/10/25GbE · Ethernet1/1"
          ]
        ],
        "tip": "Open the switch front panel (▦ on this page) for the drawing, the vendor photo and the installed-optic record.",
        "tags": [
          "hardware",
          "front panel",
          "n9k-fx3",
          "n9k"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.cisco.com/c/en/us/td/docs/dcn/hw/nx-os/nexus9000/93180yc-fx3/cisco-nexus-93180yc-fx3-nx-os-mode-switch-hardware-installation-guide/m_overview1.html",
              "title": "Cisco Nexus 93180YC-FX3 hardware installation guide: overview"
            },
            {
              "url": "https://www.cisco.com/c/en/us/products/collateral/switches/nexus-9000-series-switches/datasheet-c78-744052.html",
              "title": "Cisco N9300-FX3 Series data sheet"
            }
          ],
          "note": "Cisco: 48 × 1/10/25G SFP28 (ports 1–48, 100M also listed in the install guide) and 6 × 40/100G QSFP28 (ports 49–54); the data sheet covers the N9300-FX3 family; its figure is captioned N93180YC-FX3, though the drawing itself reads N9K-C93180YC-FX. Breakout is not described in either. The cage layout was checked against the vendor front view (photo); port order is not described in the vendor text."
        }
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
    errors: () => `show interfaces counters errors`,
    lacp: () => `show port-channel summary && show mlag`,
    env: () => `show system environment all && show inventory`
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
    dom: (p) => `show interfaces transceiver eeprom --dom ${p && p.startsWith("Eth") ? p : "Ethernet0"}`,
    status: (p) => `show interfaces status ${p && p.startsWith("Eth") ? p : "Ethernet0"}`,
    lldp: (p) => `show lldp neighbors ${p && p.startsWith("Eth") ? p : "Ethernet0"}`,
    errors: () => `show interfaces counters errors`,
    lacp: () => `show interfaces portchannel`,
    env: () => `show platform psustatus && show platform fan && show platform temperature`
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
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("switches.html", "sw_cs_bookmarks", SWITCH_DATA, {"sw-quantum-ports":"sw-quantum-ports_bookmarks","sw-quantum-hw-sm":"sw-quantum-hw-sm_bookmarks","sw-quantum-inband":"sw-quantum-inband_bookmarks","sw-sonic":"sw-sonic_bookmarks","sw-cumulus-ports":"sw-cumulus-ports_bookmarks","sw-cumulus-optics":"sw-cumulus-optics_bookmarks","sw-cumulus-lldp":"sw-cumulus-lldp_bookmarks","sw-cumulus-bonds":"sw-cumulus-bonds_bookmarks","sw-cumulus-bgp":"sw-cumulus-bgp_bookmarks","sw-cumulus-hw":"sw-cumulus-hw_bookmarks","sw-arista-ports":"sw-arista-ports_bookmarks","sw-arista-mlag":"sw-arista-mlag_bookmarks","sw-arista-bgp":"sw-arista-bgp_bookmarks","sw-nxos-ports":"sw-nxos-ports_bookmarks","sw-nxos-vpc":"sw-nxos-vpc_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("sw_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(SWITCH_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: SWITCH_DATA, label: "Switches sheets", parts: {
   "sw-hardware": {"title": "Switch Hardware & Front Panels", "subtitle": "Eleven devices: cages, port names, layout and what to check before recabling (open ▦ Front panel for the drawing and photo)", "pill": "11 devices"},
   "sw-arista-bgp": {
    "title": "Arista EOS: BGP & Health",
    "subtitle": "Checking BGP summary, PSU/fan/cooling status (show environment), syslog events & session config diffs",
    "pill": "ENV / DC NOS & Fabric"
   },
   "sw-arista-mlag": {
    "title": "Arista EOS: LLDP & MLAG",
    "subtitle": "Mapping connected servers (show lldp neighbors), inspecting Port-Channels, MLAG dual-ToR state & MAC/ARP tables",
    "pill": "MLG / DC NOS & Fabric"
   },
   "sw-arista-ports": {
    "title": "Arista EOS: Ports & DOM",
    "subtitle": "Checking Ethernet* link states, optical transceiver light levels (dBm), CRC/symbol errors & port bouncing",
    "pill": "EOS / DC NOS & Fabric"
   },
   "sw-cumulus-bgp": {
    "title": "Cumulus: BGP, EVPN & RoCEv2",
    "subtitle": "Checking BGP Unnumbered spine/leaf peers, routing tables, and RoCEv2 Priority Flow Control (PFC) / ECN counters",
    "pill": "BGP / DC NOS & Fabric"
   },
   "sw-cumulus-bonds": {
    "title": "Cumulus: MLAG Bonds & VLAN",
    "subtitle": "Inspecting 802.3ad LACP port-channels, MLAG dual-ToR peer health, and access/trunk VLAN assignments",
    "pill": "LCP / DC NOS & Fabric"
   },
   "sw-cumulus-hw": {
    "title": "Cumulus: PSU, Fans & Config",
    "subtitle": "Checking switch power supplies, fan trays, ASIC temperatures & managing NVUE configuration revisions/rollbacks",
    "pill": "PSU / DC NOS & Fabric"
   },
   "sw-cumulus-lldp": {
    "title": "Cumulus: LLDP, MAC & ARP",
    "subtitle": "Mapping switch ports (swp*) to connected server hostnames/NICs via LLDP and inspecting bridge MAC & ARP entries",
    "pill": "LLD / DC NOS & Fabric"
   },
   "sw-cumulus-optics": {
    "title": "Cumulus: Optics DOM & FEC",
    "subtitle": "Reading SFP/QSFP/OSFP laser Tx/Rx dBm power, module temperature, part/serial numbers & FEC on Spectrum switches",
    "pill": "DOM / DC NOS & Fabric"
   },
   "sw-cumulus-ports": {
    "title": "Cumulus: Port Status",
    "subtitle": "Inspecting swp* link state, speed, MTU, physical error counters & bouncing ports on NVIDIA Spectrum switches",
    "pill": "NVU / DC NOS & Fabric"
   },
   "sw-nxos-ports": {
    "title": "Cisco NX-OS: Ports & DOM",
    "subtitle": "Inspecting Ethernet1/* status, transceiver DOM details, error counters, and hardware inventory on Nexus 9000 switches",
    "pill": "NXO / DC NOS & Fabric"
   },
   "sw-nxos-vpc": {
    "title": "Cisco NX-OS: LLDP & vPC",
    "subtitle": "Discovering neighbor servers/switches (lldp/cdp), checking LACP port-channel flags (P/I/D) & vPC dual-homing consistency",
    "pill": "VPC / DC NOS & Fabric"
   },
   "sw-quantum-hw-sm": {
    "title": "Quantum: SM, UFM & HW",
    "subtitle": "Inspecting PSUs, fans, temperatures, Subnet Manager (SM), UFM state, firmware & saving config on managed Quantum switches",
    "pill": "QSM / DC NOS & Fabric"
   },
   "sw-quantum-inband": {
    "title": "Quantum: In-Band MFT",
    "subtitle": "Querying externally managed Quantum switches (QM8790 / QM9790) over the IB fabric from any GPU host or UFM node using LID",
    "pill": "QIB / DC NOS & Fabric"
   },
   "sw-quantum-ports": {
    "title": "Quantum: Ports & Optics",
    "subtitle": "Managed QM8700 / QM9700 InfiniBand switch CLI: IB 1/1..1/64 port status, OSFP/QSFP DOM light levels, symbol errors & split ports",
    "pill": "QTM / DC NOS & Fabric"
   },
   "sw-sonic": {
    "title": "SONiC: Cloud NOS CLI",
    "subtitle": "Inspecting Ethernet* port status, sfputil optical DOM, lldpctl neighbors, PortChannel bonds & platform sensors",
    "pill": "SNC / DC NOS & Fabric"
   }
  } };


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

// Picking another part (rail, pager, nav menu, Back) redraws in place: common.js calls this
// with the new part instead of reloading the page. The search box and Section filter reset,
// as a fresh load would; "Saved only" stays as the tech left it.
if (typeof window !== "undefined" && window.SHEET_FILTER) {
  window.SHEET_FILTER.setPart = (part) => {
    state.part = part;
    state.activeCategory = "all";
    state.searchQuery = "";
    if (searchInput) searchInput.value = "";
    renderCategoryTabs();
    renderSections();
  };
}
