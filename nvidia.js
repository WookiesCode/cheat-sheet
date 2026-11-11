const NVIDIA_CHEAT_SHEET_DATA = [
  {
    part: "nv-smi",
    id: "nvidia-smi",
    badge: "smi",
    title: "nvidia-smi Telemetry, Queries & Topology",
    subtitle: "CSV fleet queries, dmon/pmon live streams, NUMA/NVLink matrix & clock throttle reasons",
    commands: [
      {
        id: "smi-topo-matrix",
        mode: "TOPOLOGY",
        modeClass: "mode-n",
        desc: "Display full GPU-to-GPU, NVLink, PCIe switch, NIC (mlx5), and NUMA CPU affinity matrix",
        cmd: "nvidia-smi topo -m   |   nvidia-smi topo -p2p r",
        flags: [
          ["topo -m", "Print topology matrix (NV18 = 18 NVLinks, PIX = same PCIe switch, PHB = same host bridge, SYS = cross-NUMA/QPI)"],
          ["topo -p2p r|w|n|a|p", "Peer-to-peer capability matrix: r = read, w = write, n = NVLink, a = atomics, p = PCIe"]
        ],
        tip: "Verify NIC-to-GPU PIX alignment",
        tags: ["topology", "numa", "nvlink", "pcie", "pix", "pxb", "mlx5", "p2p"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}]}
      },
      {
        id: "smi-dmon-live",
        mode: "TELEMETRY",
        modeClass: "mode-n",
        desc: "Scroll live 1-second device telemetry (Power, Temp, SM/Mem Util, Clocks, ECC, PCIe/NVLink)",
        cmd: "nvidia-smi dmon -s pucvmet -d 1   |   nvidia-smi pmon -s um -d 1",
        flags: [
          ["-s pucvmet", "p=Power/Temp, u=Util, c=Clocks, v=Violations, m=FB/BAR1, e=ECC + PCIe replay errors, t=PCIe Rx/Tx throughput"],
          ["pmon -s um", "Per-process GPU utilization (u) and framebuffer memory usage (m) every 1s"]
        ],
        tip: "Lightweight top for GPUs",
        tags: ["dmon", "pmon", "live", "monitor", "watch", "utilization", "power", "temp"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}]}
      },
      {
        id: "smi-query-inventory-pcie",
        mode: "INVENTORY",
        modeClass: "mode-n",
        desc: "Audit GPU serial numbers, UUIDs, VBIOS versions, and active vs max PCIe Gen/Width",
        cmd: "nvidia-smi --query-gpu=index,name,serial,uuid,vbios_version,pci.bus_id,pcie.link.gen.current,pcie.link.gen.max,pcie.link.width.current,pcie.link.width.max --format=csv",
        flags: [
          ["pcie.link.width.current", "Spot degraded risers/slots (e.g. x8 or x4 instead of x16)"],
          ["pcie.link.gen.current", "Note: idle GPUs downshift to Gen1; run load or check gen.max"],
          ["--format=csv,noheader,nounits", "Strip headers and units for clean awk/script parsing"]
        ],
        tip: "Catches degraded x8/x4 PCIe lanes",
        tags: ["serial", "uuid", "vbios", "pcie", "lanes", "width", "gen5", "inventory", "csv"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}], "note": "The --query field names are not listed on the docs page: check them with nvidia-smi --help-query-gpu on your driver."}
      },
      {
        id: "smi-throttle-reasons",
        mode: "PERFORMANCE",
        modeClass: "mode-n",
        desc: "Inspect exact hardware/thermal/power clock throttling flags per GPU",
        cmd: "nvidia-smi -q -d PERFORMANCE,CLOCK,POWER,TEMPERATURE",
        flags: [
          ["HW Slowdown", "Active if GPU temp > max threshold or external power brake asserted"],
          ["HW Thermal Slowdown", "GPU or HBM memory temperature exceeded thermal slowdown threshold"],
          ["HW Power Brake", "External power brake asserted (e.g. by the system power supply)"],
          ["SW Power Cap", "Clocks capped because GPU hit configured power limit (normal under full load)"]
        ],
        tags: ["throttle", "slowdown", "thermal", "power-brake", "clocks", "performance"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}], "note": "NVIDIA marks \"HW Slowdown\" for future removal."}
      },
      {
        id: "smi-compute-processes",
        mode: "PROCESSES",
        modeClass: "mode-n",
        desc: "List all active compute PIDs, process names, GPU UUIDs, and VRAM consumption",
        cmd: "nvidia-smi --query-compute-apps=gpu_bus_id,gpu_uuid,pid,process_name,used_memory --format=csv",
        flags: [
          ["--query-compute-apps", "Outputs only active CUDA/Compute contexts across all GPUs"],
          ["fuser -v /dev/nvidia*", "Show every host process holding open any /dev/nvidia character device"]
        ],
        tags: ["processes", "pid", "vram", "memory", "fuser", "zombie"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}], "note": "Field names: check with nvidia-smi --help-query-compute-apps on your driver."}
      }
    ]
  },
  {
    "part": "nv-smi",
    "id": "nvidia-smi-pro-tips",
    "badge": "tip",
    "title": "nvidia-smi Telemetry: Pro Tips & Best Practices",
    "subtitle": "Automated CSV telemetry logger, NUMA matrix & throttling reason flags",
    "commands": [
      {
        "id": "nvidia-smi-tips-card",
        "desc": "Automated CSV telemetry logger, NUMA matrix & throttling reason flags",
        "cmd": "nvidia-smi --query-gpu=timestamp,name,pci.bus_id,utilization.gpu,memory.used,temperature.gpu,power.draw --format=csv -l 1   |   nvidia-smi topo -m",
        "details": "Log 1-second continuous telemetry directly to CSV for post-crash analysis. Use nvidia-smi topo -m to audit GPU-to-GPU interconnects (NVLink vs PCIe vs NUMA traversal).",
        "flags": [
          [
            "--format=csv -l 1",
            "Streams continuous CSV telemetry metrics every 1 second to stdout"
          ],
          [
            "topo -m",
            "Matrix showing NV# (NVLink), PIX (PCIe switch), NODE (same NUMA), SYS (remote socket)"
          ],
          [
            "--query-gpu=clocks_throttle_reasons.active",
            "Detects SW_POWER_CAP, HW_SLOWDOWN, or THERMAL clock throttling"
          ],
          [
            "nvidia-smi dmon -s pucvmet -d 1",
            "One line per GPU per second: power/temp, utilization, clocks, violations, memory, ECC/PCIe, PCIe throughput"
          ]
        ],
        "tip": "NV# in topo -m means the pair talks over # NVLinks; H100 fourth-generation NVLink totals 900 GB/s per GPU",
        "tags": [
          "nvidia-smi",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/h100/",
              "title": "NVIDIA H100 (fourth-generation NVLink, 900 GB/s)"
            }
          ],
          "note": "clocks_throttle_reasons.* is the older field name; newer drivers also list it as clocks_event_reasons.* (check nvidia-smi --help-query-gpu)."
        }
      }
    ]
  },
  {
    part: "nv-admin",
    id: "gpu-admin-ecc",
    badge: "adm",
    title: "GPU Admin, Reset, ECC, Row Remap & Clocks",
    subtitle: "HBM row remapper RMA checks, persistence daemon, GPU reset, power caps & clock locking",
    commands: [
      {
        id: "row-remapper-rma-check",
        mode: "ECC / HBM",
        modeClass: "mode-t",
        desc: "Inspect HBM Row Remapper state, pending remaps, failure flags & bank availability histogram",
        cmd: "nvidia-smi -q -d ROW_REMAPPER,PAGE_RETIREMENT,ECC",
        flags: [
          ["Pending : Yes", "A row remap is queued; requires a GPU reset (or node reboot) to take effect!"],
          ["Remapping Failure Occurred : Yes", "A row remapping has failed (Xid 64: GPU memory remapping failure) — RMA candidate"],
          ["Bank Remap Availability", "Classifies each bank's remap availability as Maximum / High / Partial / Low / None"]
        ],
        tip: "Primary A100/H100 HBM RMA check",
        tags: ["remap", "row-remapper", "ecc", "dbe", "sbe", "hbm", "rma", "page-retirement"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}, {"url": "https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html", "title": "NVIDIA Xid catalog"}]}
      },
      {
        id: "gpu-reset-drain",
        mode: "ADMIN",
        modeClass: "mode-c",
        desc: "Drain processes holding GPU device files and perform a secondary-bus GPU reset",
        cmd: "fuser -kv /dev/nvidia0   &&   nvidia-smi --gpu-reset -i 0",
        flags: [
          ["fuser -kv /dev/nvidia*", "Kill processes holding open GPU device nodes"],
          ["--gpu-reset -i 0", "Reset specific GPU (clears Xid 95/48, applies pending row remaps or MIG changes)"],
          ["NVSwitch systems", "Ampere (A100) NVSwitch systems need Fabric Manager to reset a GPU; Hopper and later (H100/H200/B200) do not. NVIDIA: reset is not guaranteed to work in all cases"]
        ],
        danger: "Kills active CUDA contexts on target GPU",
        tags: ["reset", "gpu-reset", "drain", "fuser", "hang", "xid"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}]}
      },
      {
        id: "persistence-mode-daemon",
        mode: "ADMIN",
        modeClass: "mode-c",
        desc: "Enable NVIDIA Persistence Daemon so driver state stays loaded when no job is running",
        cmd: "systemctl enable --now nvidia-persistenced   |   nvidia-smi -pm 1",
        flags: [
          ["nvidia-persistenced", "Preferred systemd daemon keeping NVML state initialized across idle periods"],
          ["-pm 1", "Legacy persistence mode: NVIDIA calls it near end-of-life and recommends nvidia-persistenced; -pm does not persist across reboots"]
        ],
        tip: "Mandatory on datacenter nodes",
        tags: ["persistence", "persistenced", "daemon", "init", "latency"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/driver-persistence/persistence-daemon.html", "title": "NVIDIA driver persistence"}, {"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}]}
      },
      {
        id: "power-limit-clock-lock",
        mode: "TUNING",
        modeClass: "mode-c",
        desc: "Cap GPU TDP wattage (for rack power budgeting) or lock SM/Memory clocks for benchmarks",
        cmd: "nvidia-smi -pl 650   |   nvidia-smi -lgc 1980,1980   |   nvidia-smi -rgc",
        flags: [
          ["-pl <watts>", "Set power management limit in Watts (check min/max in nvidia-smi -q -d POWER)"],
          ["-lgc <min,max>", "Lock GPU SM clocks to exact MHz range for deterministic NCCL/inference latency"],
          ["-rgc / -rmc", "Reset locked GPU / Memory clocks back to dynamic boost defaults"]
        ],
        tags: ["power", "limit", "tdp", "clocks", "lock", "lgc", "benchmark"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}]}
      },
      {
        id: "ecc-toggle-clear",
        mode: "ECC / HBM",
        modeClass: "mode-t",
        desc: "Clear volatile/aggregate ECC counters or enable ECC mode on workstation/L40S GPUs",
        cmd: "nvidia-smi -p 0   |   nvidia-smi -p 1   |   nvidia-smi -e 1",
        flags: [
          ["-p 0 (--reset-ecc-errors=0)", "Reset the volatile ECC error counters"],
          ["-p 1 (--reset-ecc-errors=1)", "Reset the aggregate ECC counters: not supported on Ampere and later (A100/H100/H200/B200)"],
          ["-e 1", "Enable ECC: takes effect after the next reboot and is persistent"]
        ],
        danger: "Clears ECC counts that an RMA needs: save nvidia-smi -q -d ECC,ROW_REMAPPER first",
        tags: ["ecc", "clear", "counters", "volatile", "aggregate"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}], "note": "Corrected 2026-11-09: --clear-ecc-error-counts does not exist; the option is -p / --reset-ecc-errors."}
      }
    ]
  },
  {
    "part": "nv-admin",
    "id": "gpu-admin-ecc-pro-tips",
    "badge": "tip",
    "title": "GPU Admin: Pro Tips & Best Practices",
    "subtitle": "HBM Row Remapper RMA inspection, persistent daemon & secondary bus reset",
    "commands": [
      {
        "id": "gpu-admin-ecc-tips-card",
        "desc": "HBM Row Remapper RMA inspection, persistent daemon & secondary bus reset",
        "cmd": "nvidia-smi --query-remapped-rows=gpu_name,gpu_bus_id,remapped_rows.correctable,remapped_rows.uncorrectable,remapped_rows.pending,remapped_rows.failure --format=csv",
        "details": "HBM GPUs replace failing rows with spare rows (row remapping). Pending = a remap is waiting for a GPU reset to take effect. remapped_rows.failure = a remap has failed in the past (Xid 64): an RMA candidate.",
        "flags": [
          [
            "remapped_rows.failure",
            "Yes if a row remapping has failed in the past (RMA candidate)"
          ],
          [
            "nvidia-smi --gpu-reset -i <ID>",
            "Resets one GPU without a host reboot (the default method is usually a Function Level Reset); check its health afterwards"
          ],
          [
            "systemctl enable --now nvidia-persistenced",
            "Keeps the driver loaded with no clients; the daemon drops root via --user (running it as root is not recommended)"
          ],
          [
            "nvidia-smi -i <ID> -pl <WATTS>",
            "Caps GPU maximum TDP power limit for rack thermal budgeting"
          ]
        ],
        "tip": "Always drain holding processes with fuser -v /dev/nvidia* before running --gpu-reset!",
        "tags": [
          "gpu-admin-ecc",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://docs.nvidia.com/deploy/driver-persistence/persistence-daemon.html",
              "title": "NVIDIA persistence daemon"
            },
            {
              "url": "https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html",
              "title": "NVIDIA Xid catalog"
            }
          ]
        }
      }
    ]
  },
  {
    part: "nv-dcgm",
    id: "dcgm",
    badge: "dcgm",
    title: "DCGM (dcgmi) Diagnostics, Health & Profiling",
    subtitle: "Hardware burn-in qualification (Level 1–4), passive health watches & Tensor/FP pipe telemetry",
    commands: [
      {
        id: "dcgmi-diag-levels",
        mode: "DIAGNOSTIC",
        modeClass: "mode-t",
        desc: "Run official NVIDIA DCGM hardware qualification & stress diagnostics (Levels 1 to 4)",
        cmd: "dcgmi diag -r 1   |   dcgmi diag -r 2   |   dcgmi diag -r 3   |   dcgmi diag -r 4",
        flags: [
          ["-r 1 (< 2.5 s)", "Quick: system validation (software, driver, deployment). Good as a job prologue"],
          ["-r 2 (< 2.5 min on 4 GPUs, < 10.5 min on 8)", "Medium: adds the memory test and PCIe/NVLink"],
          ["-r 3 (< 10 min on 4 GPUs, < 35 min on 8)", "Long: adds memory bandwidth, diagnostic, targeted stress and targeted power"],
          ["-r 4 (< 45 min on 4 GPUs, < 2.25 h on 8)", "Extended: longer-running hardware diagnostics; each level includes the ones below"]
        ],
        tip: "Run -r 3 before returning node to prod",
        tags: ["dcgmi", "diag", "burn-in", "stress", "qualification", "eud", "memtest"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/dcgm-diagnostics.html", "title": "DCGM diagnostics"}, {"url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html", "title": "DCGM feature overview"}], "note": "Corrected 2026-11-09: run times now from the DCGM docs (they grow with GPU count)."}
      },
      {
        id: "dcgmi-diag-targeted",
        mode: "DIAGNOSTIC",
        modeClass: "mode-t",
        desc: "Run specific DCGM diagnostic tests by name (`pcie`, `memtest`, `targeted_stress`, `targeted_power`)",
        cmd: "dcgmi diag -r 'pcie,memtest,targeted_stress,targeted_power' -i 0 -v",
        flags: [
          ["pcie", "Tests Host-to-Device & Device-to-Host DMA bandwidth and PCIe AER replay errors"],
          ["memtest", "Tests HBM memory patterns for SBE/DBE faults"],
          ["targeted_stress / targeted_power", "Sustained FP64/Tensor compute load & max TDP thermal test"],
          ["-j", "Output structured JSON diagnostic report for automated ticketing"]
        ],
        tags: ["plugin", "pcie", "memtest", "stress", "power", "pulse", "dcgmi"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/dcgm-diagnostics.html", "title": "DCGM diagnostics"}]}
      },
      {
        id: "dcgmi-discovery-health",
        mode: "HEALTH",
        modeClass: "mode-n",
        desc: "Discover GPUs/NVSwitches in DCGM hostengine and run passive background health checks",
        cmd: "dcgmi discovery -l   |   dcgmi health -g 0 -s a   |   dcgmi health -g 0 -c",
        flags: [
          ["discovery -l", "List the active GPUs and any NVSwitches tracked by nv-hostengine (-a shows all GPUs)"],
          ["health -g 0 -s a", "Enable all health watches (a = p PCIe, m memory, i InfoROM, t thermal/power, n NVLink, d driver, x ConnectX)"],
          ["health -g 0 -c", "Check current health status and print any degraded/faulty subsystem warnings"]
        ],
        tags: ["discovery", "health", "hostengine", "watches", "nvswitch"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/getting-started.html", "title": "DCGM getting started"}, {"url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html", "title": "DCGM feature overview"}], "note": "The docs name the default all-GPU group but not its ID: confirm group 0 with dcgmi group -l."}
      },
      {
        id: "dcgmi-dmon-profiling",
        mode: "PROFILING",
        modeClass: "mode-n",
        desc: "Monitor hardware performance counters: SM Occupancy, Tensor Core, FP16/FP32/FP64 & NVLink",
        cmd: "dcgmi dmon -e 203,1002,1003,1004,1006,1007,1008,1011,1012 -d 1000",
        flags: [
          ["1002 / 1003", "SM Active (fraction of cycles ≥1 warp active) / SM Occupancy"],
          ["1004", "Tensor Core (HMMA/IMMA/DMMA) pipe active ratio (0.0 to 1.0)"],
          ["1006 / 1007 / 1008", "FP64 / FP32 / FP16 compute pipe active ratio"],
          ["1011 / 1012", "NVLink TX / RX bandwidth in bytes/sec"]
        ],
        tip: "Exposes real Tensor Core usage",
        tags: ["dmon", "tensor", "sm", "occupancy", "fp16", "fp64", "profiling", "counters"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/dcgm/latest/dcgm-api/dcgm-api-field-ids.html", "title": "DCGM field IDs"}, {"url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html", "title": "DCGM feature overview"}]}
      }
    ]
  },
  {
    "part": "nv-dcgm",
    "id": "dcgm-pro-tips",
    "badge": "tip",
    "title": "DCGM (dcgmi) Diagnostics: Pro Tips & Best Practices",
    "subtitle": "Official NVIDIA hardware burn-in qualification (Level 1–4) & stress tests",
    "commands": [
      {
        "id": "dcgm-tips-card",
        "desc": "Official NVIDIA hardware burn-in qualification (Level 1–4) & stress tests",
        "cmd": "dcgmi diag -r 3   |   dcgmi diag -r pcie,targeted_stress,memtest   |   dcgmi health -c",
        "details": "Measured on Hopper: r1 < 2.5 s, r2 < 10.5 min, r3 < 35 min, r4 < 2.25 h on an 8-GPU system (about a quarter of that on 4 GPUs). r3 adds diagnostic, targeted_stress, targeted_power, nvbandwidth and nccl_tests; memtest and pulse run only at r4.",
        "flags": [
          [
            "dcgmi diag -r 1",
            "Short readiness check: software and deployment (seconds)"
          ],
          [
            "dcgmi diag -r 3",
            "Long: adds stress, power, nvbandwidth and NCCL tests (drain first)"
          ],
          [
            "dcgmi diag -r 4",
            "Extra long: adds memtest and pulse; NVIDIA lists r3/r4 for post-mortem runs"
          ],
          [
            "dcgmi health -g <GROUP> -s mpi then -c",
            "-s sets background watches (PCIe, memory, InfoROM, ...); -c reports what they caught"
          ]
        ],
        "tip": "Ensure nvidia-dcgm.service is active before executing dcgmi CLI commands!",
        "tags": [
          "dcgm",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/dcgm-diagnostics.html",
              "title": "NVIDIA DCGM diagnostics (run levels)"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/dcgm/latest/user-guide/feature-overview.html",
              "title": "NVIDIA DCGM feature overview (health watches)"
            }
          ],
          "note": "Corrected 2026-11-10: run times and per-level tests now follow NVIDIA's table; memtest is r4 only."
        }
      }
    ]
  },
  {
    part: "nv-nvlink",
    id: "nvlink-fabric",
    badge: "nvl",
    title: "NVLink, NVSwitch & Fabric Manager",
    subtitle: "NVLink per-lane status, CRC/Replay errors, SXM Fabric Manager & nvbandwidth tests",
    commands: [
      {
        id: "nvlink-status-errors",
        mode: "NVLINK",
        modeClass: "mode-v",
        desc: "Verify all NVLink lanes are active at full rate and inspect CRC/Replay/Recovery error counters",
        cmd: "nvidia-smi nvlink -s   |   nvidia-smi nvlink -e   |   nvidia-smi nvlink -re",
        flags: [
          ["nvlink -s", "List active state and GB/s rate of all NVLink lanes per GPU (12 on A100, 18 on H100/B200)"],
          ["nvlink -e", "Display CRC Flit, CRC Data, Replay, and Recovery error counters per link"],
          ["nvlink -re", "Reset all NVLink error counters to zero (--reseterrorcounters). Not supported on NVLink 5 (B200)"],
          ["nvlink -R", "Not a reset: shows the remote end (PCI bus ID and link ID) of each link"]
        ],
        tip: "Any inactive lane breaks NCCL ring",
        tags: ["nvlink", "crc", "replay", "errors", "lanes", "status"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}], "note": "Corrected 2026-11-09: the reset flag is -re, not -R (which shows remote link info)."}
      },
      {
        id: "fabric-manager-sxm",
        mode: "NVSWITCH",
        modeClass: "mode-v",
        desc: "Manage `nvidia-fabricmanager` daemon required on 8-GPU HGX SXM / NVSwitch baseboards",
        cmd: "systemctl status nvidia-fabricmanager   |   grep -E 'ERROR|SXid' /var/log/fabricmanager.log",
        flags: [
          ["nvidia-fabricmanager", "Initializes the NVSwitch fabric; until it has, CUDA fails with cudaErrorSystemNotReady (802)"],
          ["SXid", "NVSwitch errors carry the SXid prefix in the kernel log; FM logs the GPU behind fatal ones. Not used on DGX/HGX B200/B300"],
          ["Version", "Before driver 620 (pre-4th-gen NVSwitch) FM must match the driver version; from 620 FM has its own 2.0.x version"]
        ],
        tip: "CUDA Error 802 = check Fabric Manager",
        tags: ["fabricmanager", "nvswitch", "hgx", "sxm", "sxid", "802"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html", "title": "Fabric Manager user guide"}, {"url": "https://docs.nvidia.com/cuda/cuda-runtime-api/group__CUDART__TYPES.html", "title": "CUDA runtime error codes"}]}
      },
      {
        id: "nvbandwidth-p2p",
        mode: "BENCHMARK",
        modeClass: "mode-v",
        desc: "Measure unidirectional and bidirectional GPU-to-GPU NVLink & Host-to-Device PCIe bandwidth",
        cmd: "nvbandwidth -t device_to_device_memcpy_read_ce,device_to_device_bidirectional_memcpy_read_ce,host_to_device_memcpy_ce",
        flags: [
          ["device_to_device_..._ce", "Copy-Engine P2P bandwidth matrix across all GPU pairs (expect ~400+ GB/s unidir on H100)"],
          ["host_to_device_memcpy_ce", "Verify each GPU achieves full PCIe Gen4 (~26 GB/s) or Gen5 (~54 GB/s) DMA speed"]
        ],
        tags: ["nvbandwidth", "p2p", "bandwidth", "memcpy", "benchmark", "nvlink"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/NVIDIA/nvbandwidth", "title": "nvbandwidth (NVIDIA)"}], "note": "The two read_ce names are built in the source, not listed in the README: list yours with nvbandwidth -l. Bandwidth figures are rules of thumb."}
      }
    ]
  },
  {
    "part": "nv-nvlink",
    "id": "nvlink-fabric-pro-tips",
    "badge": "tip",
    "title": "NVLink: Pro Tips & Best Practices",
    "subtitle": "SXM NVSwitch Fabric Manager required daemon, CRC error counters & bandwidth testing",
    "commands": [
      {
        "id": "nvlink-fabric-tips-card",
        "desc": "SXM NVSwitch Fabric Manager required daemon, CRC error counters & bandwidth testing",
        "cmd": "systemctl status nvidia-fabricmanager   |   nvidia-smi nvlink -e -i 0   |   nvbandwidth",
        "details": "NVSwitch HGX systems need nvidia-fabricmanager running before CUDA jobs start; without it new jobs fail with cudaErrorSystemNotReady. Before driver 620 the FM package must match the driver version exactly; from 620 FM is versioned on its own. HGX B200/B300 also need NVLSM and OFED.",
        "flags": [
          [
            "nvidia-fabricmanager",
            "Required on NVSwitch systems; if it stops, new CUDA jobs fail"
          ],
          [
            "nvidia-smi nvlink -e -i <ID>",
            "NVLink error counters (replay, recovery, CRC); rising counts point at the link or baseboard"
          ],
          [
            "nvbandwidth",
            "NVIDIA open-source P2P bandwidth test for measuring full NVLink crossbar saturation"
          ],
          [
            "nvidia-smi nvlink -s -i <ID>",
            "Link status; an active link shows its bandwidth"
          ]
        ],
        "tip": "On drivers before 620, upgrade the driver and nvidia-fabricmanager together: the versions must match",
        "tags": [
          "nvlink-fabric",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html",
              "title": "NVIDIA Fabric Manager user guide"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://github.com/NVIDIA/nvbandwidth",
              "title": "NVIDIA nvbandwidth"
            }
          ],
          "note": "Corrected 2026-11-10: HGX NVLink is not optical, the version-match rule ends at driver 620, and B200/B300 need NVLSM."
        }
      }
    ]
  },
  {
    part: "nv-mig",
    id: "mig-partition",
    badge: "mig",
    title: "MIG (Multi-Instance GPU) Partitioning",
    subtitle: "Hardware isolation into up to 7 GPU Instances (GI) and Compute Instances (CI)",
    commands: [
      {
        id: "mig-enable-disable",
        mode: "MIG ADMIN",
        modeClass: "mode-c",
        desc: "Enable or disable MIG mode on A100/H100/H200 GPUs and apply pending mode change",
        cmd: "nvidia-smi -i 0 -mig 1   |   nvidia-smi --gpu-reset -i 0",
        flags: [
          ["-mig 1 / -mig 0", "Enable (1) or Disable (0) MIG mode on specified GPU(s)"],
          ["--gpu-reset", "Ampere (A100) only: applies a pending MIG mode. Hopper and later (H100/H200) enable MIG without a reset, and the mode does not survive a reboot"]
        ],
        tags: ["mig", "enable", "disable", "partition", "reset"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/tesla/mig-user-guide/getting-started-with-mig.html", "title": "MIG user guide"}, {"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}], "note": "Corrected 2026-11-09: the reset is only needed on Ampere."}
      },
      {
        id: "mig-list-create-instances",
        mode: "MIG ADMIN",
        modeClass: "mode-c",
        desc: "List supported MIG profiles and slice a GPU into isolated GPU + Compute Instances",
        cmd: "nvidia-smi mig -lgip   |   nvidia-smi mig -i 0 -cgi 9,9 -C   |   nvidia-smi mig -i 0 -cgi 19,19,19,19,19,19,19 -C",
        flags: [
          ["-lgip", "List GPU Instance Profiles (IDs, SM count, memory size, and available instances)"],
          ["-cgi 9,9 -C", "Profile IDs differ by GPU: on A100 40GB, 9 = 3g.20gb (two fit). Read yours from -lgip, or pass names (H200 141GB: 3g.71gb). -C adds matching Compute Instances"],
          ["-cgi 19,19,... -C", "Seven 1g instances: 19 = 1g.5gb on A100 40GB; H100 80GB 1g.10gb and H200 1g.18gb also fit 7 (check the ID with -lgip)"]
        ],
        tip: "Use -C to auto-create Compute Instances",
        tags: ["mig", "cgi", "lgip", "slice", "profile", "1g", "3g"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/tesla/mig-user-guide/getting-started-with-mig.html", "title": "MIG user guide"}, {"url": "https://docs.nvidia.com/datacenter/tesla/mig-user-guide/supported-mig-profiles.html", "title": "MIG profiles"}, {"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}], "note": "NVIDIA documents profile IDs 9 and 19 for A100 40GB only; on H100/H200 read them from -lgip."}
      },
      {
        id: "mig-inspect-destroy",
        mode: "MIG ADMIN",
        modeClass: "mode-c",
        desc: "List active MIG instance UUIDs or tear down all Compute & GPU Instances",
        cmd: "nvidia-smi -L   |   nvidia-smi mig -lgi   |   nvidia-smi mig -dci && nvidia-smi mig -dgi",
        flags: [
          ["nvidia-smi -L", "Print all GPUs and their child MIG-<UUID> strings for CUDA_VISIBLE_DEVICES"],
          ["-dci && -dgi", "Destroy all Compute Instances (-dci) first, then destroy all GPU Instances (-dgi)"]
        ],
        tags: ["mig", "uuid", "destroy", "dci", "dgi", "cleanup"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/tesla/mig-user-guide/getting-started-with-mig.html", "title": "MIG user guide"}]}
      }
    ]
  },
  {
    "part": "nv-mig",
    "id": "mig-partition-pro-tips",
    "badge": "tip",
    "title": "MIG (Multi-Instance GPU) Partitioning: Pro Tips & Best Practices",
    "subtitle": "Hardware slice partitioning into up to 7 isolated GPU Instances (GI) & Compute Instances (CI)",
    "commands": [
      {
        "id": "mig-partition-tips-card",
        "desc": "Hardware slice partitioning into up to 7 isolated GPU Instances (GI) & Compute Instances (CI)",
        "cmd": "nvidia-smi -i <ID> -mig 1   |   nvidia-smi mig -lgip   |   nvidia-smi mig -cgi <PROFILE_ID>,<PROFILE_ID> -C",
        "details": "MIG splits a supported GPU (A100, H100 and later) into up to seven GPU instances, each with its own compute and memory resources. Profile IDs differ by GPU model: read them from -lgip, never copy them from another model.",
        "flags": [
          [
            "nvidia-smi -i 0 -mig 1",
            "Enables MIG mode on target GPU (all processes must be closed)"
          ],
          [
            "nvidia-smi mig -lgip",
            "Lists the GPU instance profiles and IDs this GPU supports (-lgi lists instances already created)"
          ],
          [
            "nvidia-smi mig -cgi <ID> -C",
            "Creates GPU Instance and immediately provisions child Compute Instance"
          ],
          [
            "nvidia-smi mig -dci && nvidia-smi mig -dgi",
            "Destroys all active Compute Instances and GPU Instances on device"
          ]
        ],
        "tip": "Export CUDA_VISIBLE_DEVICES=MIG-UUID to target specific slices in container workloads!",
        "tags": [
          "mig-partition",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/datacenter/tesla/mig-user-guide/getting-started-with-mig.html",
              "title": "NVIDIA MIG user guide: getting started"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "Corrected 2026-11-10: profiles are listed with -lgip; profile IDs such as 19 are model-specific."
        }
      }
    ]
  },
  {
    part: "nv-gpudirect",
    id: "gpudirect-rdma-nccl",
    badge: "rdma",
    title: "GPUDirect RDMA, Perftest & NCCL Validation",
    subtitle: "nvidia-peermem, ib_write_bw CUDA DMA tests & multi-GPU/multi-node nccl-tests",
    commands: [
      {
        id: "nvidia-peermem-verify",
        mode: "GPUDIRECT",
        modeClass: "mode-v",
        desc: "Verify `nvidia-peermem` kernel module is loaded for zero-copy GPUDirect RDMA over InfiniBand/RoCE",
        cmd: "lsmod | grep nvidia_peermem   ||   modprobe nvidia-peermem",
        flags: [
          ["nvidia_peermem", "Allows InfiniBand HCA (mlx5) to DMA directly to/from GPU HBM BAR1 over PCIe without CPU bounce buffers"],
          ["DMA-BUF", "With DMA-BUF (open kernel modules) NCCL does not need nvidia-peermem; otherwise it must be loaded on every boot"]
        ],
        tip: "Required for full multi-node NCCL speed",
        tags: ["gpudirect", "rdma", "peermem", "nvidia-peermem", "bar1", "dma"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/gpu_troubleshooting.html", "title": "NCCL troubleshooting"}, {"url": "https://docs.nvidia.com/cuda/gpudirect-rdma/index.html", "title": "GPUDirect RDMA"}], "note": "NVIDIA's pages write the module as nvidia-peermem; lsmod prints module names with underscores, so grep nvidia_peermem."}
      },
      {
        id: "ib-write-bw-cuda",
        mode: "RDMA TEST",
        modeClass: "mode-v",
        desc: "Test line-rate GPUDirect RDMA bandwidth directly from GPU memory (`--use_cuda`) between two nodes",
        cmd: "# Server: ib_write_bw -d mlx5_0 --use_cuda=0 -a -F --report_gbits --ipv6-addr   |   # Client: ib_write_bw -d mlx5_0 --use_cuda=0 -a -F --report_gbits --ipv6-addr 2001:db8:dc::1",
        flags: [
          ["-d mlx5_0 --use_cuda=0", "Bind HCA mlx5_0 to local GPU 0 (match closest PIX pair from 'nvidia-smi topo -m'!)"],
          ["--report_gbits -F", "Report throughput in Gb/s (expect ~385–392 Gb/s on NDR400, ~192 Gb/s on HDR200) and ignore CPU freq warning"],
          ["ib_write_lat", "Run latency counterpart (expect ~1.2–1.8 µs RDMA write latency)"]
        ],
        tip: "Pair mlx5_X with its PIX-local GPU",
        tags: ["ib_write_bw", "perftest", "cuda", "gpudirect", "bandwidth", "latency"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-rdma/perftest", "title": "perftest"}], "note": "Corrected 2026-11-09: --ipv6-addr (not --ipv6) for an IPv6 server address, on both ends. Gb/s and latency figures are rules of thumb."}
      },
      {
        id: "nccl-tests-allreduce",
        mode: "NCCL",
        modeClass: "mode-v",
        desc: "Run single-node or multi-node `all_reduce_perf` with NCCL topology/IB debugging enabled",
        cmd: "NCCL_DEBUG=INFO NCCL_IB_HCA=mlx5 ./build/all_reduce_perf -b 8M -e 8G -f 2 -g 8",
        flags: [
          ["-b 8M -e 8G -f 2 -g 8", "Sweep message sizes from 8 MB to 8 GB by 2x factor across 8 GPUs"],
          ["algbw / busbw", "Check 'busbw' column: healthy 8x H100 SXM hits ~360–390 GB/s intra-node busbw"],
          ["NCCL_DEBUG=INFO", "Prints detected rings/trees, NVLS/SHARP status, and selected IB HCAs"],
          ["NCCL_P2P_LEVEL=NVL", "Force or debug P2P transport selection"]
        ],
        tip: "Watch busbw (not algbw) for health",
        tags: ["nccl", "all_reduce_perf", "busbw", "nvls", "sharp", "benchmark"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/NVIDIA/nccl-tests", "title": "nccl-tests"}, {"url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html", "title": "NCCL environment variables"}], "note": "NCCL_IB_HCA=mlx5 is a prefix match (mlx5_*); use =mlx5_0 for an exact device. busbw figures are rules of thumb."}
      }
    ]
  },
  {
    "part": "nv-gpudirect",
    "id": "gpudirect-rdma-nccl-pro-tips",
    "badge": "tip",
    "title": "GPUDirect RDMA: Pro Tips & Best Practices",
    "subtitle": "Zero-copy GPUDirect RDMA kernel module, CUDA DMA bandwidth & NCCL benchmarks",
    "commands": [
      {
        "id": "gpudirect-rdma-nccl-tips-card",
        "desc": "Zero-copy GPUDirect RDMA kernel module, CUDA DMA bandwidth & NCCL benchmarks",
        "cmd": "lsmod | grep nvidia_peermem   |   ib_write_bw -d mlx5_0 -F --use_cuda=0   |   all_reduce_perf",
        "details": "GPUDirect RDMA enables ConnectX InfiniBand/RoCE adapters to read/write directly to GPU VRAM bypassing CPU host memory. Requires nvidia-peermem module loaded in kernel.",
        "flags": [
          [
            "nvidia-peermem",
            "Kernel bridge driver enabling direct P2P DMA between NIC and GPU HBM"
          ],
          [
            "ib_write_bw --use_cuda=0",
            "Tests raw line-rate InfiniBand RDMA write bandwidth directly from GPU VRAM"
          ],
          [
            "NCCL_DEBUG=INFO",
            "Prints detailed NCCL tree/ring topology, IB verbs, and GPUDirect initialization"
          ],
          [
            "all_reduce_perf -b 8M -e 1G -f 2 -g 8",
            "Runs nccl-tests across all 8 GPUs measuring AllReduce bus bandwidth"
          ]
        ],
        "tip": "Compare all_reduce_perf busbw against your platform vendor's acceptance numbers; a single slow rank drags the whole result down",
        "tags": [
          "gpudirect-rdma-nccl",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/cuda/gpudirect-rdma/index.html",
              "title": "NVIDIA GPUDirect RDMA"
            },
            {
              "url": "https://github.com/linux-rdma/perftest",
              "title": "linux-rdma perftest"
            },
            {
              "url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html",
              "title": "NCCL environment variables"
            },
            {
              "url": "https://github.com/NVIDIA/nccl-tests",
              "title": "NVIDIA nccl-tests"
            }
          ],
          "note": "Removed 2026-11-10: an unsourced \"~450 GB/s on 8x H100\" target."
        }
      }
    ]
  },
  {
    part: "nv-pcie",
    id: "pcie-kernel-triage",
    badge: "pcie",
    title: "PCIe AER, ACS, Xid Triage, GSP & Bug Reports",
    subtitle: "dmesg Xid/SXid decoding, lspci link/AER audits, ACS P2P disable & nvidia-bug-report.sh",
    commands: [
      {
        id: "dmesg-xid-sxid-triage",
        mode: "TRIAGE",
        modeClass: "mode-t",
        desc: "Extract all NVIDIA Xid, NVSwitch SXid, NVLink, and PCIe AER hardware errors with timestamps",
        cmd: "dmesg -T | grep -E 'NVRM: Xid|nvidia-nvswitch: SXid|nvlink|AER|fallen off the bus'",
        flags: [
          ["PCI:xxxx:xx:xx.x", "The PCI BDF printed in the Xid log identifies the exact physical GPU that faulted!"],
          ["Xid 79", "GPU fell off PCIe bus — inspect PSU cables, PCIe riser/retimer, and motherboard BMC/SEL logs"],
          ["Xid 48 / 64 / 95", "48 = double-bit ECC, 64 = memory remapping failure, 95 = uncontained memory error (reset the GPU) — run nvidia-smi -q -d ROW_REMAPPER"]
        ],
        tip: "Match PCI BDF to physical slot",
        tags: ["xid", "sxid", "dmesg", "aer", "triage", "fault", "79", "48", "64"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html", "title": "NVIDIA Xid catalog"}, {"url": "https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html", "title": "Fabric Manager user guide"}]}
      },
      {
        id: "lspci-link-aer-audit",
        mode: "PCIE BUS",
        modeClass: "mode-t",
        desc: "Inspect PCIe Link Capabilities vs Link Status (Speed/Width), NUMA node, and AER error registers",
        cmd: "lspci -vvv -d 10de: | grep -E '^([0-9a-f]{2}:|.*LnkCap:|.*LnkSta:|.*NUMA|.*UESta:|.*CESta:)'",
        flags: [
          ["LnkCap vs LnkSta", "Verify Speed (16GT/s=Gen4, 32GT/s=Gen5) and Width (x16) match capability"],
          ["UESta / CESta", "Uncorrectable / Correctable PCIe AER error status flags (BadTLP, BadDLLP, Replay Timer Timeout)"]
        ],
        tags: ["lspci", "aer", "pcie", "lnksta", "lnkcap", "gen5", "gen4", "numa"],
        src: {"verified": "2026-11-09", "refs": [], "note": "Not checked against vendor docs yet (pciutils lspci)."}
      },
      {
        id: "disable-pcie-acs",
        mode: "PCIE P2P",
        modeClass: "mode-c",
        desc: "Disable PCIe Access Control Services (ACS) on PCIe switch ports to prevent P2P traffic routing through CPU root complex",
        cmd: "for bdf in $(lspci -d '*:*:0604' | awk '{print $1}'); do setpci -v -s $bdf ECAP_ACS+0x6.w=0000; done",
        flags: [
          ["ECAP_ACS+0x6.w=0000", "Clears ACSControl register on PCIe bridge/switch ports so GPUDirect P2P & RDMA stay on switch fabric"],
          ["IOMMU / VT-d", "NVIDIA: avoid translated IOMMU mode for GPU P2P (dmesg 'Default domain type: Translated'); pass-through (e.g. iommu=pt) or disable it. ACS changes reset on reboot"]
        ],
        tip: "Fixes slow SYS P2P on PCIe servers",
        tags: ["acs", "setpci", "p2p", "gpudirect", "iommu", "bridge", "switch"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/gpu_troubleshooting.html", "title": "NCCL troubleshooting"}, {"url": "https://docs.nvidia.com/cuda/gpudirect-rdma/index.html", "title": "GPUDirect RDMA"}], "note": "setpci ECAP_ACS+0x6.w=0000 is NVIDIA's; NVIDIA finds the bridges with lspci | grep PLX, and selecting class 0604 here also matches CPU root ports."}
      },
      {
        id: "gsp-firmware-bugreport",
        mode: "SUPPORT / RMA",
        modeClass: "mode-c",
        desc: "Check GSP firmware status and generate official `nvidia-bug-report.log.gz` for vendor RMA",
        cmd: "cat /proc/driver/nvidia/gpus/*/information   |   nvidia-bug-report.sh --output-file /tmp/nvidia-bug-report.log.gz",
        flags: [
          ["nvidia-bug-report.sh", "Collects NVML state, dmesg, Xids, VBIOS, lspci, acpidump, and DCGM logs required for RMA tickets"],
          ["NVreg_EnableGpuFirmware=0", "Kernel module parameter workaround if troubleshooting GSP firmware hangs (Xid 119/120)"]
        ],
        tip: "Capture BEFORE rebooting faulted node!",
        tags: ["bug-report", "rma", "gsp", "firmware", "support", "proc"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html", "title": "NVIDIA Xid catalog"}], "note": "Xid 119/120 (GSP) checked; nvidia-bug-report.sh --output-file and NVreg_EnableGpuFirmware=0 were not found in the docs read. Newer GPUs may require GSP: check the driver README."}
      }
    ]
  },
  {
    "part": "nv-pcie",
    "id": "pcie-kernel-triage-pro-tips",
    "badge": "tip",
    "title": "PCIe AER: Pro Tips & Best Practices",
    "subtitle": "Critical Xid error decoding, PCIe AER link errors & vendor RMA bug reports",
    "commands": [
      {
        "id": "pcie-kernel-triage-tips-card",
        "desc": "Critical Xid error decoding, PCIe AER link errors & vendor RMA bug reports",
        "cmd": "dmesg -T | grep -E \"NVRM: Xid|AER\"   |   lspci -vvv -s <BUS_ID>   |   nvidia-bug-report.sh",
        "details": "Xid errors are logged to dmesg. Xid 31 = GPU memory page fault (usually the application); Xid 43 = GPU stopped processing after an application fault, GPU still healthy; Xid 79 = GPU fallen off the bus. Run nvidia-bug-report.sh before rebooting.",
        "flags": [
          [
            "Xid 79",
            "GPU fallen off PCIe bus: check PCIe auxiliary power cables, risers, or cold-plate torque"
          ],
          [
            "Xid 45",
            "Preemptive cleanup after an app aborted or earlier errors; if other Xids appear with it, follow those"
          ],
          [
            "Xid 62",
            "Internal micro-controller halt; NVIDIA's action is reset the GPU, then contact support"
          ],
          [
            "nvidia-bug-report.sh",
            "Writes nvidia-bug-report.log.gz, the bundle NVIDIA support asks for"
          ]
        ],
        "tip": "On bare metal, PCIe ACS on switches can block GPU peer-to-peer and GPUDirect; NCCL's guide shows how to check and disable it",
        "tags": [
          "pcie-kernel-triage",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/xid-errors/analyzing-xid-catalog.html",
              "title": "NVIDIA Xid catalog"
            },
            {
              "url": "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/gpu_troubleshooting.html",
              "title": "NCCL troubleshooting: ACS and IOMMU"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "Corrected 2026-11-10: Xid 45 and 62 now use the Xid catalog descriptions."
        }
      }
    ]
  },
  {
    part: "nv-ops",
    id: "slurm-nvsm-burnin",
    badge: "ops",
    title: "Slurm Drain, NVSM, Liquid Cooling & Container Triage",
    subtitle: "Draining Slurm GPU nodes before maintenance, NVSM health dumps, HBM3/DLC thermal delta & /dev/nvidia* checks",
    commands: [
      {
        id: "slurm-drain-resume",
        mode: "SLURM OPS",
        modeClass: "mode-c",
        desc: "Check active Slurm GPU jobs on a node, drain it with a ticket reason before hardware work, and resume after burn-in",
        cmd: "squeue -w $(hostname -s)   &&   scontrol update NodeName=$(hostname -s) State=DRAIN Reason=\"DC Tech: GPU 3 Xid 79 RMA\"",
        flags: [
          ["State=DRAIN", "Marks node offline for new jobs while allowing currently running jobs to finish (use State=DOWN to kill immediately)"],
          ["State=RESUME", "Returns a drained node back to IDLE/ALLOCATED production state after DCGM Level 3 passes"],
          ["sinfo -Nl -n $(hostname -s)", "Show current node state (idle, alloc, drain, down*) and drain reason string"]
        ],
        tip: "Always check 'squeue -w $(hostname -s)' before rebooting a GPU node!",
        tags: ["slurm", "scontrol", "squeue", "sinfo", "drain", "resume", "maintenance"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://slurm.schedmd.com/scontrol.html", "title": "Slurm scontrol"}], "note": "The scontrol page does not say whether State=DOWN ends running jobs."}
      },
      {
        id: "nvsm-health-dump",
        mode: "DGX / HGX NVSM",
        modeClass: "mode-i",
        desc: "Run NVIDIA System Management (`nvsm`) health check and generate a full chassis/GPU diagnostic bundle",
        cmd: "nvsm show health   &&   nvsm show alerts   &&   nvsm dump health",
        flags: [
          ["nvsm show health", "Audits GPUs, NVSwitches, NVLinks, PCIe risers, ConnectX HCAs, drives, PSUs, and fans on DGX/HGX systems"],
          ["nvsm dump health", "Generates /tmp/nvsm-health-*.tar.xz bundle for NVIDIA Enterprise Support RMA"],
          ["nv-fabricmanager -v", "Print the Fabric Manager version (must match the driver before driver 620)"]
        ],
        tip: "Fabric Manager version mismatch stops multi-GPU jobs from starting!",
        tags: ["nvsm", "dgx", "hgx", "health", "alerts", "fabricmanager"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html", "title": "Fabric Manager user guide"}], "note": "NVSM commands not verified: NVIDIA's NVSM docs pages returned no content. Only nv-fabricmanager -v is checked (Fabric Manager guide)."}
      },
      {
        id: "hbm-dlc-thermal-delta",
        mode: "DLC / THERMALS",
        modeClass: "mode-t",
        desc: "Compare GPU die temp vs HBM3/HBM3e memory temp to spot cold-plate contact or TIM degradation on air/liquid nodes",
        cmd: "nvidia-smi --query-gpu=index,pci.bus_id,temperature.gpu,temperature.memory,temperature.gpu.tlimit,power.draw,clocks_event_reasons.hw_thermal_slowdown --format=csv",
        flags: [
          ["temperature.memory", "HBM3/HBM3e stack temperature (throttles at ~95°C; if >20°C hotter than temperature.gpu, check cold-plate / TIM seating)"],
          ["temperature.gpu.tlimit", "Remaining thermal margin (°C) before GPU hits hardware thermal slowdown"],
          ["hw_thermal_slowdown", "True = GPU or HBM is actively downclocking due to failed fan, air baffle gap, or blocked DLC manifold"]
        ],
        tip: "High HBM temp with normal GPU temp = bad thermal pad / coldplate torque!",
        tags: ["hbm", "dlc", "liquid-cooling", "thermal", "temperature", "coldplate", "tim"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html", "title": "NVIDIA nvidia-smi documentation"}], "note": "The --query field names are not listed on the docs page: check them with nvidia-smi --help-query-gpu on your driver. clocks_event_reasons.* may be clocks_throttle_reasons.* on older drivers. Temperature limits are rules of thumb."}
      },
      {
        id: "nvidia-container-devices",
        mode: "CONTAINERS",
        modeClass: "mode-v",
        desc: "Verify `/dev/nvidia*` device nodes, UVM/MIG capabilities, and test Docker/Kubernetes GPU & RDMA pass-through",
        cmd: "ls -la /dev/nvidia* /dev/infiniband/   &&   nvidia-ctk system create-dev-char-symlinks --create-all",
        flags: [
          ["/dev/nvidia-uvm", "Unified Virtual Memory device node (if missing, run 'nvidia-modprobe -u -c=0')"],
          ["/dev/nvidia-caps/*", "Required device nodes for MIG instances and nvlink/imex fabric channels"],
          ["docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi", "NVIDIA's sample workload: the container runtime can see the GPUs"]
        ],
        tip: "Run 'nvidia-modprobe -u -c=0' if containers fail to open /dev/nvidia-uvm",
        tags: ["container", "docker", "k8s", "nvidia-uvm", "nvidia-ctk", "nvidia-modprobe"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/sample-workload.html", "title": "Container Toolkit sample workload"}], "note": "nvidia-ctk system create-dev-char-symlinks is not in the Container Toolkit docs read: check nvidia-ctk system --help."}
      }
    ]
  },
  {
    "part": "nv-ops",
    "id": "slurm-nvsm-burnin-pro-tips",
    "badge": "tip",
    "title": "Slurm Drain: Pro Tips & Best Practices",
    "subtitle": "Slurm GPU node drain, NVSM chassis diagnostics & HBM3 liquid cooling thermal triage",
    "commands": [
      {
        "id": "slurm-nvsm-burnin-tips-card",
        "desc": "Slurm GPU node drain, NVSM chassis diagnostics & HBM3 liquid cooling thermal triage",
        "cmd": "scontrol update nodename=node01 state=DRAIN reason=\"Xid triage\"   |   nvsm show health   |   nvidia-smi -q -d TEMPERATURE",
        "details": "Drain Slurm nodes before physical or driver maintenance. On liquid-cooled nodes, compare GPU and memory temperatures across identical GPUs: one GPU running hotter than its neighbours points at its cold plate or coolant flow.",
        "flags": [
          [
            "scontrol update state=DRAIN",
            "Prevents new Slurm scheduler jobs from landing on server during triage"
          ],
          [
            "scontrol update state=RESUME",
            "Returns validated and qualified node to active Slurm partition"
          ],
          [
            "nvsm show health",
            "NVIDIA System Management: queries chassis fans, power supplies, BMC, and GPUs"
          ],
          [
            "nvidia-smi -q -d TEMPERATURE",
            "GPU and memory (HBM) temperatures plus the slowdown and shutdown thresholds"
          ]
        ],
        "tip": "Give containers GPUs with --gpus (NVIDIA Container Toolkit) or CDI rather than mounting /dev/nvidia* by hand",
        "tags": [
          "slurm-nvsm-burnin",
          "tips",
          "pro",
          "nvidia",
          "gpu",
          "datacenter",
          "best-practices"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://slurm.schedmd.com/scontrol.html",
              "title": "Slurm scontrol"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/sample-workload.html",
              "title": "NVIDIA Container Toolkit: sample workload"
            }
          ],
          "note": "nvsm show health: NVIDIA's NVSM docs returned empty pages, so it is not checked. Removed 2026-11-10: an unsourced GPU vs HBM delta > 15°C rule."
        }
      }
    ]
  }
];

// Interactive Telemetry & Qualification Builder Database
const NV_BUILDER_PROFILES = {
  "smi-query": [
    {
      id: "thermals-throttle",
      label: "Thermal, Power & Clock Throttle Audit",
      desc: "Audit GPU & HBM temperatures, power draw, SM clocks, and active throttle bitmask",
      all: "nvidia-smi --query-gpu=index,pci.bus_id,name,temperature.gpu,temperature.memory,power.draw,clocks.current.sm,clocks_event_reasons.active --format=csv",
      gpu0: "nvidia-smi -i 0 --query-gpu=index,pci.bus_id,name,temperature.gpu,temperature.memory,power.draw,clocks.current.sm,clocks_event_reasons.active --format=csv",
      loop: "nvidia-smi -l 1 --query-gpu=index,pci.bus_id,temperature.gpu,temperature.memory,power.draw,clocks.current.sm,clocks_event_reasons.active --format=csv"
    },
    {
      id: "ecc-remap",
      label: "ECC SBE/DBE & Serial/UUID RMA Audit",
      desc: "Query GPU serials, PCI BDFs, and volatile/aggregate Single-Bit & Double-Bit ECC counts",
      all: "nvidia-smi --query-gpu=index,serial,pci.bus_id,ecc.errors.corrected.volatile.total,ecc.errors.uncorrected.volatile.total,ecc.errors.uncorrected.aggregate.total --format=csv",
      gpu0: "nvidia-smi -i 0 -q -d ECC,ROW_REMAPPER,PAGE_RETIREMENT",
      loop: "nvidia-smi -q -d ROW_REMAPPER,ECC | grep -E 'GPU 0|Serial|Pending|Failure|Uncorrectable|Correctable'"
    },
    {
      id: "pcie-lanes",
      label: "PCIe Link Generation & Width Verification",
      desc: "Verify all GPUs trained at expected PCIe Gen4/Gen5 speed and full x16 lane width",
      all: "nvidia-smi --query-gpu=index,pci.bus_id,name,vbios_version,pcie.link.gen.current,pcie.link.gen.max,pcie.link.width.current,pcie.link.width.max --format=csv",
      gpu0: "nvidia-smi -i 0 -q -d PIDS,PCI",
      loop: "nvidia-smi dmon -s et -d 1"
    }
  ],
  "dcgm-diag": [
    {
      id: "diag-r3",
      label: "Level 3 — Full HW Burn-in & Qualification (~15m)",
      desc: "Run Level 3 DCGM diagnostic (EUD, 90% HBM memory test, PCIe DMA, targeted compute & power stress)",
      all: "dcgmi diag -r 3 -p 'memory.minimum_allocation_percentage=90'",
      gpu0: "dcgmi diag -r 3 -i 0 -p 'memory.minimum_allocation_percentage=90'",
      loop: "dcgmi diag -r 3 -v -j"
    },
    {
      id: "diag-r2",
      label: "Level 2 — Medium Deployment & PCIe Check (~2m)",
      desc: "Run Level 2 DCGM check validating driver, NVML, PCIe throughput, and basic memory health",
      all: "dcgmi diag -r 2",
      gpu0: "dcgmi diag -r 2 -i 0",
      loop: "dcgmi diag -r 2 -v -j"
    },
    {
      id: "diag-pcie-mem",
      label: "Targeted PCIe + HBM Memtest + Pulse Power",
      desc: "Run targeted PCIe DMA, HBM memory test, and transient pulse power test plugins",
      all: "dcgmi diag -r 'pcie,memtest,pulse_test'",
      gpu0: "dcgmi diag -r 'pcie,memtest,pulse_test' -i 0",
      loop: "dcgmi diag -r 'pcie,memtest,pulse_test' -v"
    }
  ],
  "dcgm-dmon": [
    {
      id: "tensor-fp",
      label: "Tensor Core, FP16/FP32/FP64 & SM Occupancy",
      desc: "Stream hardware profiling counters for SM Active, SM Occupancy, Tensor Core, and FP pipes",
      all: "dcgmi dmon -e 203,1002,1003,1004,1006,1007,1008",
      gpu0: "dcgmi dmon -i 0 -e 203,1002,1003,1004,1006,1007,1008",
      loop: "dcgmi dmon -e 203,1002,1003,1004,1006,1007,1008 -d 1000"
    },
    {
      id: "dcgm-ecc-remap",
      label: "HBM Temp, Power & Row Remap Telemetry",
      desc: "Monitor GPU/HBM temperatures, power draw, remapped rows, and row remap failure flags",
      all: "dcgmi dmon -e 150,140,155,393,394,395 -c 1",
      gpu0: "dcgmi dmon -i 0 -e 150,140,155,393,394,395 -c 1",
      loop: "dcgmi dmon -e 150,140,155,393,394,395 -d 1000"
    },
    {
      id: "dcgm-bus-bw",
      label: "PCIe & NVLink TX/RX Throughput (Bytes/s)",
      desc: "Monitor live PCIe and NVLink transmit/receive bandwidth across GPUs",
      all: "dcgmi dmon -e 203,1009,1010,1011,1012",
      gpu0: "dcgmi dmon -i 0 -e 203,1009,1010,1011,1012",
      loop: "dcgmi dmon -e 203,1009,1010,1011,1012 -d 500"
    }
  ],
  nvlink: [
    {
      id: "nvl-errors",
      label: "NVLink Link Status & CRC/Replay Error Check",
      desc: "Verify all NVLink lanes are up and inspect CRC Flit, CRC Data, and Replay error counters",
      all: "nvidia-smi nvlink -s && nvidia-smi nvlink -e",
      gpu0: "nvidia-smi nvlink -i 0 -s && nvidia-smi nvlink -i 0 -e",
      loop: "watch -n 1 'nvidia-smi nvlink -e | grep -v \": 0\"'"
    },
    {
      id: "nvl-reset",
      label: "Reset NVLink Error Counters",
      desc: "Zero out all NVLink CRC, replay, and recovery error counters before a test run",
      all: "nvidia-smi nvlink -re",
      gpu0: "nvidia-smi nvlink -i 0 -re",
      loop: "nvidia-smi nvlink -re && nvidia-smi nvlink -e"
    }
  ],
  "ib-perftest": [
    {
      id: "gdr-bw",
      label: "GPUDirect RDMA Write Bandwidth (ib_write_bw)",
      desc: "Measure zero-copy GPUDirect RDMA throughput directly from CUDA HBM memory over mlx5 HCA",
      all: "ib_write_bw -d mlx5_0 --use_cuda=0 -a -F --report_gbits",
      gpu0: "ib_write_bw -d mlx5_0 --use_cuda=0 -s 8388608 -n 5000 -F --report_gbits",
      loop: "ib_write_bw -d mlx5_0 --use_cuda=0 -D 30 -F --report_gbits"
    },
    {
      id: "gdr-lat",
      label: "GPUDirect RDMA Write Latency (ib_write_lat)",
      desc: "Measure point-to-point GPUDirect RDMA write latency from GPU HBM memory",
      all: "ib_write_lat -d mlx5_0 --use_cuda=0 -F",
      gpu0: "ib_write_lat -d mlx5_0 --use_cuda=0 -s 2 -n 10000 -F",
      loop: "ib_write_lat -d mlx5_0 --use_cuda=0 -a -F"
    }
  ]
};

// Application State
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("nvidia.html", "nv_cs_bookmarks", NVIDIA_CHEAT_SHEET_DATA, {"nv-smi":"nv-smi_bookmarks","nv-nvlink":"nv-nvlink_bookmarks","nv-dcgm":"nv-dcgm_bookmarks","nv-gpudirect":"nv-gpudirect_bookmarks","nv-admin":"nv-admin_bookmarks","nv-mig":"nv-mig_bookmarks","nv-pcie":"nv-pcie_bookmarks","nv-ops":"nv-ops_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("nv_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(NVIDIA_CHEAT_SHEET_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: NVIDIA_CHEAT_SHEET_DATA, label: "NVIDIA DC sheets", parts: {
   "nv-admin": {
    "title": "GPU Admin, Reset, ECC, Row Remap & Clocks",
    "subtitle": "HBM row remapper RMA checks, persistence daemon, GPU reset, power caps & clock locking",
    "pill": "ADM / NVIDIA Datacenter"
   },
   "nv-dcgm": {
    "title": "DCGM (dcgmi) Diagnostics, Health & Profiling",
    "subtitle": "Hardware burn-in qualification (Level 1–4), passive health watches & Tensor/FP pipe telemetry",
    "pill": "DCGM / NVIDIA Datacenter"
   },
   "nv-gpudirect": {
    "title": "GPUDirect RDMA, Perftest & NCCL Validation",
    "subtitle": "nvidia-peermem, ib_write_bw CUDA DMA tests & multi-GPU/multi-node nccl-tests",
    "pill": "RDMA / NVIDIA Datacenter"
   },
   "nv-mig": {
    "title": "MIG (Multi-Instance GPU) Partitioning",
    "subtitle": "Hardware isolation into up to 7 GPU Instances (GI) and Compute Instances (CI)",
    "pill": "MIG / NVIDIA Datacenter"
   },
   "nv-nvlink": {
    "title": "NVLink, NVSwitch & Fabric Manager",
    "subtitle": "NVLink per-lane status, CRC/Replay errors, SXM Fabric Manager & nvbandwidth tests",
    "pill": "NVL / NVIDIA Datacenter"
   },
   "nv-ops": {
    "title": "Slurm Drain, NVSM, Cooling & Container Triage",
    "subtitle": "Draining Slurm GPU nodes before maintenance, NVSM health dumps, HBM3/DLC thermal delta & /dev/nvidia* checks",
    "pill": "OPS / NVIDIA Datacenter"
   },
   "nv-pcie": {
    "title": "PCIe AER, ACS, Xid Triage & Bug Reports",
    "subtitle": "dmesg Xid/SXid decoding, lspci link/AER audits, ACS P2P disable & nvidia-bug-report.sh",
    "pill": "PCIE / NVIDIA Datacenter"
   },
   "nv-smi": {
    "title": "nvidia-smi Telemetry, Queries & Topology",
    "subtitle": "CSV fleet queries, dmon/pmon live streams, NUMA/NVLink matrix & clock throttle reasons",
    "pill": "SMI / NVIDIA Datacenter"
   }
  } };


// DOM Elements
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const visibleCountEl = document.getElementById("visible-count");
const savedCountEl = document.getElementById("saved-count");
const savedFilterBtn = document.getElementById("saved-filter-btn");
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

// Syntax Highlighting for NVIDIA Datacenter CLI Commands
function highlightNvCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(#[^\n|]*)|(\s\|\s|\s&&\s|\s\|\|\s)|(\b(?:nvidia-smi|dcgmi|nvbandwidth|nvidia-bug-report\.sh|ibstat|ibstatus|ibv_devinfo|rdma|mlxlink|perfquery|ibdiagnet|mst|mlxfwmanager|mlxconfig|ib_write_bw|ib_write_lat|all_reduce_perf|lspci|setpci|dmesg|fuser|systemctl|modprobe|lsmod|watch|grep|cat|sudo)\b)|(\s-[a-zA-Z0-9-]+|\s--[a-zA-Z0-9_-]+=?)(\S*)/g,
    (match, comment, sep, cmd, flag, flagVal) => {
      if (comment) {
        return `<span class="tok-comment">${comment}</span>`;
      }
      if (sep) {
        return `<span class="tok-pipe">${sep}</span>`;
      }
      if (cmd) {
        return `<span class="tok-cmd">${cmd}</span>`;
      }
      if (flag) {
        return `<span class="tok-flag">${flag}</span>${flagVal || ""}`;
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = NVIDIA_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of NVIDIA_CHEAT_SHEET_DATA) {
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

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const section of NVIDIA_CHEAT_SHEET_DATA) {
    if (((state.activeCategory !== "all" && state.activeCategory !== section.id) || (state.part && (section.part || section.id) !== state.part))) {
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
        const dangerHtml = item.danger
          ? `<span class="danger-badge">! ${escapeHtml(item.danger)}</span>`
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

            <div class="cmd-code-box" data-copy="${escapeHtml(copyTarget)}" title="Click to copy">
              <code class="cmd-code">${highlightNvCmd(item.cmd)}</code>
              <span class="copy-hint">Copy</span>
            </div>

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

// Interactive Datacenter Telemetry & Qualification Builder
function initNvBuilder() {
  const toolEl = document.getElementById("nv-tool");
  const profileEl = document.getElementById("nv-profile");
  const scopeEl = document.getElementById("nv-scope");
  const cmdOutputEl = document.getElementById("nv-cmd-output");
  const previewBox = document.getElementById("nv-preview-box");
  const copyBtn = document.getElementById("nv-copy-btn");
  const meaningEl = document.getElementById("nv-meaning-text");
  const presetBtns = document.querySelectorAll(".nv-preset");

  function populateProfiles(toolKey, selectedProfileId) {
    const list = NV_BUILDER_PROFILES[toolKey] || [];
    profileEl.innerHTML = list
      .map(
        (p) =>
          `<option value="${p.id}" ${p.id === selectedProfileId ? "selected" : ""}>${escapeHtml(p.label)}</option>`
      )
      .join("");
  }

  function updateBuilderPreview() {
    const toolKey = toolEl.value;
    const list = NV_BUILDER_PROFILES[toolKey] || [];
    const current = list.find((p) => p.id === profileEl.value) || list[0];
    if (!current) return;

    const scopeKey = scopeEl.value;
    const fullCmd = current[scopeKey] || current.all;

    cmdOutputEl.innerHTML = highlightNvCmd(fullCmd);
    previewBox.dataset.copy = fullCmd;
    meaningEl.textContent = current.desc;

    presetBtns.forEach((btn) => {
      const active =
        btn.dataset.tool === toolKey &&
        btn.dataset.profile === current.id &&
        btn.dataset.scope === scopeKey;
      btn.classList.toggle("active", active);
    });
  }

  toolEl.addEventListener("change", () => {
    populateProfiles(toolEl.value);
    updateBuilderPreview();
  });

  profileEl.addEventListener("change", updateBuilderPreview);
  scopeEl.addEventListener("change", updateBuilderPreview);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      toolEl.value = btn.dataset.tool;
      populateProfiles(btn.dataset.tool, btn.dataset.profile);
      scopeEl.value = btn.dataset.scope;
      updateBuilderPreview();
    });
  });

  previewBox.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  populateProfiles("smi-query", "thermals-throttle");
  updateBuilderPreview();
}

// Mini Tabs inside Triage Reference Widget
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

// Theme & Density
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
    const copyBox = e.target.closest(".cmd-code-box");
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
      localStorage.setItem("nv_cs_bookmarks", JSON.stringify([...state.bookmarks]));
      renderSections();
    }
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    renderSections();
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

// Initialize
applyTheme(state.theme);
renderCategoryTabs();
renderSections();
initNvBuilder();
initMiniTabs();
initEvents();

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
