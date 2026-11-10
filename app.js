const CHEAT_SHEET_DATA = [
  {
    id: "dmi-hw",
    badge: "dmi",
    title: "DMI / SMBIOS, FRU & Motherboard Inventory",
    subtitle: "dmidecode SMBIOS tables, chassis serial/SKU, BIOS revision, DIMM slot mapping & PSU FRUs",
    commands: [
      {
        id: "dmidecode-system-bios",
        desc: "Query system manufacturer, product name, service tag / serial number, UUID & BIOS revision",
        cmd: "dmidecode -t system -t bios -t baseboard -t chassis",
        details: "Reads the motherboard SMBIOS/DMI table directly via /dev/mem or /sys/firmware/dmi/tables. Essential for verifying server asset tags, chassis serial numbers, motherboard revision, and BIOS firmware version without rebooting or logging into the BMC.",
        flags: [
          ["-t system", "DMI Type 1: System Manufacturer, Product Name, Serial Number, SKU & UUID"],
          ["-t bios", "DMI Type 0: BIOS Vendor, Version, Release Date & firmware revision"],
          ["-t baseboard", "DMI Type 2: Motherboard model, serial, asset tag & physical location"],
          ["-t chassis", "DMI Type 3: Rack chassis type, lock status, serial & height (U)"]
        ],
        subcommands: [
          ["dmidecode -s system-serial-number", "Print only the server chassis/system serial number"],
          ["dmidecode -s system-product-name", "Print only the server model (e.g. PowerEdge, ProLiant, Supermicro)"],
          ["dmidecode -s bios-version && dmidecode -s bios-release-date", "Print only the active BIOS version and release date"],
          ["dmidecode -t slot", "DMI Type 9: List all physical PCIe riser slots and whether each slot is In Use or Available"]
        ],
        tip: "Instant FRU / Serial lookup",
        tags: ["dmidecode", "serial", "bios", "motherboard", "fru", "asset", "datacenter"]
      },
      {
        id: "dmidecode-memory-dimms",
        desc: "Inspect physical RAM DIMM slots, populated vs empty sockets, DDR speed, manufacturer & part numbers",
        cmd: "dmidecode -t memory | grep -E 'Size:|Locator:|Bank Locator:|Type:|Speed:|Configured Memory Speed:|Manufacturer:|Serial Number:|Part Number:'",
        details: "Queries DMI Type 16 (Physical Memory Array) and Type 17 (Memory Device). Crucial for data center techs replacing a faulty DIMM or verifying that all populated channels are running at their rated MT/s speed and matching part numbers.",
        flags: [
          ["-t memory", "DMI Types 16 & 17: Physical memory array capacity and individual DIMM slot details"],
          ["Locator", "Silkscreened motherboard DIMM slot label (e.g., PROC 1 DIMM 1A, P0_MC0_DIMM_A0)"],
          ["Configured Memory Speed", "Actual negotiated DDR4/DDR5 transfer rate (check for downclocking)"]
        ],
        subcommands: [
          ["dmidecode -t 16", "Show maximum supported memory capacity, error correction type (Multi-bit ECC), and total slot count"],
          ["dmidecode -t 17 | awk '/Memory Device/,/^$/' | grep -E 'Locator:|Size:'", "Compact list of every motherboard DIMM slot and whether it is populated or 'No Module Installed'"],
          ["lshw -short -C memory", "Concise summary of system RAM banks and populated DIMM sizes"]
        ],
        tip: "Maps OS to motherboard silkscreen",
        tags: ["dimm", "ram", "memory", "ddr5", "ddr4", "slot", "part-number", "dmidecode"]
      },
      {
        id: "dmidecode-psu-cpu",
        desc: "Inspect redundant Power Supply Units (PSU wattage, serial, status) and CPU socket population",
        cmd: "dmidecode -t 39 && dmidecode -t processor",
        details: "DMI Type 39 reports installed server power supplies, their max power capacity (e.g., 1600W/2400W), part/serial numbers, and whether each PSU is Present and OK. DMI Type 4 reports physical CPU sockets, voltage, external clock, and enabled core counts.",
        flags: [
          ["-t 39", "DMI Type 39: System Power Supply (Status, Plugged/Unplugged, Max Power Capacity)"],
          ["-t processor", "DMI Type 4: Socket designation (CPU0/CPU1), family, voltage, max/current speed"]
        ],
        subcommands: [
          ["dmidecode -s processor-version", "Print exact CPU model strings for all populated sockets"],
          ["cat /sys/class/dmi/id/product_name /sys/class/dmi/id/product_serial", "Read product name and serial without root if permissions allow (/sys/class/dmi/id/)"]
        ],
        tags: ["psu", "power-supply", "cpu", "socket", "dmidecode", "datacenter"]
      },
      {
        id: "lshw-hardware-tree",
        desc: "Generate complete hardware inventory tree with bus addresses (PCI/USB/SCSI/NVMe) and driver status",
        cmd: "lshw -short -businfo",
        details: "Probes DMI, sysfs, PCI, USB, and storage subsystems to map physical hardware paths (e.g., pci@0000:3b:00.0) to Linux device names (eth0, nvme0n1) and hardware classes. Spots 'UNCLAIMED' devices missing a kernel driver.",
        flags: [
          ["-short", "Compact tabular hardware tree"],
          ["-businfo", "Include PCI/USB/SCSI/NVMe bus addresses for physical slot tracing"]
        ],
        subcommands: [
          ["lshw -C network -businfo", "List all NIC ports with PCIe bus address, logical interface name, MAC, and link state"],
          ["lshw -C storage -C disk", "List all storage controllers (RAID/HBA/NVMe) and attached physical disks"],
          ["lshw -json > /tmp/server-hw-manifest.json", "Export full machine-readable hardware manifest for DCIM asset ingestion"]
        ],
        tip: "Look for UNCLAIMED devices",
        tags: ["lshw", "inventory", "businfo", "unclaimed", "driver", "manifest"]
      }
    ]
  },
  {
    id: "pcie-numa",
    badge: "pci",
    title: "PCIe Bus, Link Speed/Width, CPU & NUMA Topology",
    subtitle: "lspci link training verification (Gen3/4/5 GT/s & x16/x8), AER errors, CPU & NUMA affinity",
    commands: [
      {
        id: "lspci-link-speed-width",
        desc: "Verify PCIe negotiated link speed (GT/s) and lane width (x16/x8) vs device capability (LnkCap vs LnkSta)",
        cmd: "lspci -vvv -s 0000:3b:00.0 | grep -E 'LnkCap:|LnkSta:|DevSta:|AERCap:'",
        details: "Compares what a PCIe card (GPU, NIC, NVMe HBA) is capable of (LnkCap: Speed 16GT/s or 32GT/s, Width x16) against what it actually negotiated with the motherboard riser (LnkSta). If LnkSta shows 'Downgraded', reseat the card/riser or inspect gold fingers for debris.",
        flags: [
          ["-vvv", "Maximum verbosity (required to decode PCIe configuration space registers)"],
          ["-s <BDF>", "Filter by PCI Bus:Device.Function address (e.g., 3b:00.0)"],
          ["LnkCap", "Hardware maximum rated PCIe link speed (8GT/s=Gen3, 16GT/s=Gen4, 32GT/s=Gen5) and width"],
          ["LnkSta", "Currently trained PCIe speed & width (flags '(downgraded)' if lanes failed training)"]
        ],
        subcommands: [
          ["lspci -vvv | grep -B 1 -E 'LnkSta:.*downgraded'", "Scan all PCIe devices across the server for any downgraded PCIe lane width or speed"],
          ["lspci -nnk", "List all PCIe devices with Vendor:Device hex IDs [10de:2330] and active kernel driver"],
          ["lspci -tv", "Render PCIe root complex, bridges, switches, and endpoints as a tree"]
        ],
        tip: "Detects bad risers / unseated cards",
        tags: ["lspci", "pcie", "lnksta", "lnkcap", "downgraded", "lanes", "gen4", "gen5", "riser"]
      },
      {
        id: "lspci-aer-rescan",
        desc: "Inspect PCIe Advanced Error Reporting (AER) counters and hot-rescan the PCIe bus",
        cmd: "lspci -vvv | grep -E '^[0-9a-f]|UESta:|CESta:' && echo 1 | tee /sys/bus/pci/rescan",
        details: "UESta (Uncorrectable Error Status) and CESta (Correctable Error Status) show PCIe link-level CRC errors, receiver errors, bad TLP/DLLP, or surprise link down events. Writing '1' to /sys/bus/pci/rescan re-enumerates the PCIe bus if a card or U.2 NVMe drive dropped offline.",
        flags: [
          ["UESta:", "Uncorrectable PCIe errors (DLP, SDES, TLP, FCP, CmpltTO, UnxCmplt, MalfTLP)"],
          ["CESta:", "Correctable PCIe errors (RxErr, BadTLP, BadDLLP, Rollover, Timeout)"],
          ["/sys/bus/pci/rescan", "Trigger kernel PCIe bus rescan without rebooting"]
        ],
        subcommands: [
          ["echo 1 | tee /sys/bus/pci/devices/0000:3b:00.0/remove", "Safely hot-remove a specific PCIe BDF device before hot-swapping or rescanning"],
          ["setpci -s 3b:00.0 COMMAND", "Read raw PCI configuration space COMMAND register in hex"]
        ],
        tags: ["aer", "pcie", "errors", "rescan", "hotplug", "tlp", "lspci"]
      },
      {
        id: "lscpu-topology",
        desc: "Inspect CPU socket topology, physical cores vs SMT threads, cache hierarchy, and CPU flags",
        cmd: "lscpu && lscpu -e=CPU,NODE,SOCKET,CORE,L1d:L1i:L2:L3,ONLINE,MAXMHZ,MINMHZ",
        details: "Displays complete processor architecture, sockets, NUMA nodes, L1/L2/L3 cache sizes, virtualization support (VT-x / AMD-V), and per-core frequency scaling limits. Use 'lscpu -e' to verify all cores are ONLINE and running at expected boost clocks.",
        flags: [
          ["-e", "Extended human-readable table mapping every logical vCPU to NUMA node, Socket, and Core"],
          ["ONLINE", "Verify no CPU cores have been offlined due to hardware faults"],
          ["MAXMHZ", "Maximum turbo clock frequency reported by ACPI/cpufreq"]
        ],
        subcommands: [
          ["cpupower frequency-info", "Inspect active CPU frequency governor (performance vs powersave) and hardware P-states"],
          ["cpupower frequency-set -g performance", "Lock all CPU cores to the 'performance' governor for low-latency datacenter workloads"],
          ["grep -E 'model name|microcode|cpu MHz' /proc/cpuinfo | head -n 6", "Check loaded CPU microcode patch version and current clock speed"]
        ],
        tags: ["lscpu", "cpu", "cores", "numa", "governor", "microcode", "smt"]
      },
      {
        id: "numactl-topology",
        desc: "View NUMA node memory allocation, inter-socket latency matrix, and pin processes to a NUMA node",
        cmd: "numactl --hardware && numastat -m",
        details: "On dual-socket or multi-chiplet EPYC/Xeon servers, accessing RAM or PCIe devices attached to a remote CPU socket traverses the UPI/Infinity Fabric interconnect, adding latency. 'numactl --hardware' shows free/total RAM per node and node distance costs.",
        flags: [
          ["--hardware", "Display available NUMA nodes, CPU list per node, node memory size, and distance matrix"],
          ["numastat -m", "Show per-node meminfo table (MemTotal, MemFree, HugePages) in MiB"]
        ],
        subcommands: [
          ["numactl --cpunodebind=0 --membind=0 ./workload", "Pin a process strictly to CPU cores and local RAM on NUMA node 0"],
          ["cat /sys/class/net/eth0/device/numa_node", "Check which CPU NUMA node a specific NIC or NVMe device is physically wired to"],
          ["lstopo-no-graphics", "Render ASCII topology diagram of NUMA nodes, PCIe bridges, NICs, NVMe drives, and caches (hwloc-nox)"]
        ],
        tip: "Match NIC/GPU to local NUMA node",
        tags: ["numa", "numactl", "numastat", "lstopo", "socket", "affinity", "latency"]
      }
    ]
  },
  {
    id: "ecc-edac",
    badge: "ecc",
    title: "ECC Memory, EDAC, MCE & Thermal Triage",
    subtitle: "edac-util DIMM fault isolation, rasdaemon MCE logs, ipmi/lm-sensors thermals & turbostat power",
    commands: [
      {
        id: "edac-dimm-errors",
        desc: "Check Error Detection and Correction (EDAC) memory controllers for Correctable (CE) & Uncorrectable (UE) ECC errors",
        cmd: "edac-util -v && grep -H . /sys/devices/system/edac/mc/mc*/csrow*/ch*_ce_count /sys/devices/system/edac/mc/mc*/dimm*/dimm_*",
        details: "Reads the Linux kernel EDAC subsystem to pinpoint exactly which memory controller (mc0/mc1), channel, and DIMM label is logging single-bit Correctable Errors (CE) or multi-bit Uncorrectable Errors (UE). High CE rates indicate a degrading DIMM that should be scheduled for replacement.",
        flags: [
          ["edac-util -v", "Verbose summary of all memory controllers, chip-select rows, and error counts"],
          ["dimm_label", "Motherboard silkscreen label mapped by EDAC driver"],
          ["dimm_ce_count / dimm_ue_count", "Cumulative single-bit (CE) and multi-bit (UE) ECC error counters since boot"]
        ],
        subcommands: [
          ["edac-util --status", "Check whether the kernel EDAC driver is loaded and monitoring memory controllers"],
          ["head -n 20 /sys/devices/system/edac/mc/mc*/dimm*/{dimm_label,dimm_location,dimm_ce_count,dimm_ue_count}", "Directly read per-DIMM labels and ECC error counts from sysfs (zero dependencies)"]
        ],
        tip: "Pinpoints bad DIMM slot in OS",
        tags: ["ecc", "edac", "dimm", "memory-error", "ce", "ue", "ram"]
      },
      {
        id: "rasdaemon-mce-triage",
        desc: "Query Ubuntu rasdaemon hardware error database for Memory ECC, PCIe AER, and CPU Machine Check Exceptions (MCE)",
        cmd: "ras-mc-ctl --summary && ras-mc-ctl --errors",
        details: "On modern Ubuntu servers, 'rasdaemon' replaces legacy 'mcelog' to record all hardware Reliability, Availability, and Serviceability (RAS) trace events into a persistent SQLite database (/var/lib/rasdaemon/ras-mc_event.db), preserving errors across reboots.",
        flags: [
          ["--summary", "Aggregate count of Memory Controller, PCIe AER, Extlog, and CPU MCE errors"],
          ["--errors", "Print detailed timestamped log of every recorded hardware error event"]
        ],
        subcommands: [
          ["ras-mc-ctl --mainboard", "Display mainboard vendor and model recognized by rasdaemon DIMM label database"],
          ["journalctl -u rasdaemon.service --no-pager -n 50", "Inspect recent hardware error alerts logged by the rasdaemon systemd unit"],
          ["dmesg -T | grep -iE 'mce|edac|hardware error|aer|ghES|apei'", "Search kernel ring buffer for ACPI APEI/GHES firmware-first hardware errors"]
        ],
        tags: ["rasdaemon", "ras-mc-ctl", "mce", "mcelog", "apei", "ghes", "hardware-error"]
      },
      {
        id: "sensors-thermals",
        desc: "Monitor CPU package/core temperatures, NVMe composite temps, VRM voltages & chassis sensors",
        cmd: "sensors && cat /sys/class/thermal/thermal_zone*/{type,temp} 2>/dev/null | paste - -",
        details: "Uses lm-sensors (coretemp / k10temp / drivetemp) and kernel thermal zones (millidegrees Celsius) to check if a server is overheating due to a failed heatsink fan, dried thermal paste, or blocked rack airflow.",
        flags: [
          ["sensors", "Read all hwmon sensors (CPU Package id 0/1, core temps, NVMe composite temp)"],
          ["thermal_zone*/temp", "Raw temperature in millidegrees Celsius (e.g. 45000 = 45.0°C)"]
        ],
        subcommands: [
          ["watch -n 1 sensors", "Live 1-second refresh of all CPU and board temperature sensors"],
          ["grep -H . /sys/devices/system/cpu/cpu0/thermal_throttle/*_count", "Check if CPU0 has experienced core or package thermal throttling events since boot"]
        ],
        tags: ["sensors", "temperature", "thermal", "overheating", "throttling", "fan", "hwmon"]
      },
      {
        id: "turbostat-power-clocks",
        desc: "Real-time x86 CPU telemetry: actual core MHz, busy%, C-state residency, SMI interrupts & package wattage",
        cmd: "turbostat --Summary --quiet --show Busy%,Bzy_MHz,TSC_MHz,IRQ,SMI,PkgTmp,PkgWatt,RAMWatt --interval 2",
        details: "Reads hardware Model-Specific Registers (MSRs) directly. Essential for diagnosing servers that feel 'slow': reveals if BIOS System Management Interrupts (SMI) are stalling cores, if CPU power capping is throttling frequency (Bzy_MHz), or how many Watts CPU & RAM are drawing.",
        flags: [
          ["--Summary", "Print single aggregated system summary line per interval instead of 100+ core lines"],
          ["Bzy_MHz", "Actual average clock speed (MHz) while cores are actively executing instructions"],
          ["SMI", "BIOS System Management Interrupt count (non-zero spikes indicate firmware/ECC stalls)"],
          ["PkgWatt / RAMWatt", "Real-time RAPL power consumption in Watts for CPU sockets and DRAM"]
        ],
        tip: "From linux-tools-common package",
        tags: ["turbostat", "power", "wattage", "mhz", "throttling", "smi", "msr"]
      }
    ]
  },
  {
    id: "nvme-smart",
    badge: "nvm",
    title: "Enterprise NVMe, SMART, RAID & Drive Bay LEDs",
    subtitle: "nvme-cli health/wear/format, smartctl SAS/SATA triage, mdadm RAID rebuilds & ledctl drive locator",
    commands: [
      {
        id: "nvme-list-smart",
        desc: "List all NVMe namespaces (model, serial, FW) and inspect SMART health log for wear, spare & media errors",
        cmd: "nvme list && nvme smart-log /dev/nvme0",
        details: "Queries NVMe admin controller logs. For datacenter drive replacement triage, check 'critical_warning' (must be 0), 'available_spare' vs 'available_spare_threshold', 'percentage_used' (endurance wear), 'media_errors' (unrecovered NAND reads), and 'unsafe_shutdowns'.",
        flags: [
          ["nvme list", "Tabular list of all /dev/nvmeXnY block devices, serial numbers, capacities, and firmware"],
          ["smart-log", "Read NVMe SMART / Health Information Log (Log Page 02h)"],
          ["media_errors", "Count of unrecovered data integrity errors on NAND media (non-zero = replace drive)"]
        ],
        subcommands: [
          ["nvme error-log /dev/nvme0 --log-entries=16", "Inspect recent controller command errors and status codes"],
          ["nvme id-ctrl /dev/nvme0 | grep -E 'mn |sn |fr |ver |tnvmcap'", "Identify controller model (mn), serial (sn), firmware revision (fr), and total NVM capacity"],
          ["nvme list-subsys", "Display NVMe multipath subsystems and PCIe BDF addresses for each controller"]
        ],
        tip: "Check media_errors & percentage_used",
        tags: ["nvme", "nvme-cli", "smart", "ssd", "wear", "endurance", "firmware"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-list.txt", "title": "nvme-cli: nvme list"}, {"url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-log-smart.txt", "title": "nvme-cli: smart log"}, {"url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-log-error.txt", "title": "nvme-cli: error log"}, {"url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-list-subsys.txt", "title": "nvme-cli: list-subsys"}], "note": "nvme-cli 3.0 (Sep 2026) renamed smart-log, error-log and id-ctrl to nvme log smart, nvme log error and nvme id ctrl; the old names still work with a warning. The man pages don't list smart-log or id-ctrl output fields (critical_warning, media_errors, mn, sn, fr): those are nvme-cli's output names."}
      },
      {
        id: "nvme-format-fw",
        desc: "Cryptographically secure-erase an enterprise NVMe drive or update controller firmware online",
        cmd: "nvme format /dev/nvme0n1 --ses=1 --force",
        details: "Executes an NVMe Format NVM Admin command. '--ses=1' performs a User Data Erase; '--ses=2' performs an instant Cryptographic Erase by destroying and regenerating the internal media encryption key. Can also switch logical block size (4096B vs 512B) via '--lbaf'.",
        flags: [
          ["--ses=1", "Secure Erase Setting: 1 = User Data Erase, 2 = Cryptographic Erase (instant key wipe)"],
          ["--lbaf=<N>", "LBA Format index (check 'nvme id-ns /dev/nvme0n1' for 512B vs 4K sector formats)"]
        ],
        subcommands: [
          ["nvme id-ns /dev/nvme0n1 -H | grep 'LBA Format'", "Check supported sector sizes (512B vs 4096B 4Kn) and active LBA format"],
          ["nvme fw-download /dev/nvme0 --fw=firmware.bin && nvme fw-commit /dev/nvme0 --slot=1 --action=1", "Download a firmware image and commit it to slot 1; it activates at the next controller reset (--action=3 activates immediately, without a reset)"],
          ["blkdiscard -v /dev/nvme0n1", "Discard (TRIM/Deallocate) every block on the device: all data is lost (-v only prints the offset and length)"]
        ],
        danger: "Irreversibly erases all data on target namespace",
        tags: ["nvme", "secure-erase", "format", "firmware", "4kn", "blkdiscard", "wipe"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-format.txt", "title": "nvme-cli: format"}, {"url": "https://manpages.debian.org/trixie/nvme-cli/nvme-id-ns.1.en.html", "title": "nvme-id-ns(1) (nvme-cli 2.13)"}, {"url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-fw-commit.txt", "title": "nvme-cli: fw-commit"}, {"url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-fw-download.txt", "title": "nvme-cli: fw-download"}, {"url": "https://man7.org/linux/man-pages/man8/blkdiscard.8.html", "title": "blkdiscard(8)"}], "note": "Corrected 2026-11-09: fw-commit --action=1 activates at the next reset, not on the spot. nvme-cli 3.x moves these to nvme fw download / nvme fw commit / nvme id ns and deprecates -H; the 2.x forms shown still work. The man page doesn't name the 'LBA Format' lines."}
      },
      {
        id: "smartctl-disk-triage",
        desc: "Inspect SATA/SAS/NVMe SMART health attributes, grown defect lists, and trigger background self-tests",
        cmd: "smartctl -x /dev/sda",
        details: "Reads complete SMART and extended device statistics. On SATA drives, check IDs 5 (Reallocated_Sector_Ct), 187 (Reported_Uncorrect), 197 (Current_Pending_Sector), and 198 (Offline_Uncorrectable). On SAS drives, check 'Elements in grown defect list' and 'Non-medium error count'.",
        flags: [
          ["-x", "Print all SMART + Extended info (error logs, self-test history, Phy event counters)"],
          ["-H", "Print brief SMART overall-health self-assessment test result (PASSED / FAILED)"],
          ["-a", "Print standard SMART attributes, capabilities, and error logs"]
        ],
        subcommands: [
          ["smartctl -t short /dev/sda", "Start a short self-test (usually under ten minutes) while the drive stays in service"],
          ["smartctl -l selftest /dev/sda", "Read the self-test log once the test has had time to finish (it shows the percentage left while one is running)"],
          ["smartctl -a -d megaraid,0 /dev/bus/0", "Query physical disk #0 behind a Broadcom/LSI MegaRAID hardware RAID controller"],
          ["smartctl --scan", "Scan and list devices smartctl can open, with device type and protocol"]
        ],
        tip: "Watch Reallocated & Pending sectors",
        tags: ["smartctl", "smart", "sata", "sas", "hdd", "ssd", "megaraid", "defects"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://manpages.debian.org/trixie/smartmontools/smartctl.8.en.html", "title": "smartctl(8)"}], "note": "Corrected 2026-11-09: the self-test and its log were one line (smartctl -t short && smartctl -l selftest), which reads the log before the new test finishes. The SATA attribute IDs and the SAS 'grown defect list' wording are drive-reported names, not from the man page."}
      },
      {
        id: "mdadm-raid-ops",
        desc: "Inspect Linux software RAID (mdadm) array health, sync progress, and hot-swap a failed disk",
        cmd: "cat /proc/mdstat && mdadm --detail /dev/md0",
        details: "Shows active mdraid personalities (RAID1/RAID5/RAID6/RAID10), member disk states ([UU] = healthy, [U_] = degraded), and rebuild speed. When replacing a failed drive in a rack server, mark it faulty, remove it, physically swap the sled, and re-add the replacement.",
        flags: [
          ["/proc/mdstat", "Live kernel status of all active md RAID arrays and rebuild percentage"],
          ["--detail", "Detailed array UUID, layout, state (clean/degraded/recovering), and member disk roles"]
        ],
        subcommands: [
          ["mdadm --manage /dev/md0 --fail /dev/sdb1 --remove /dev/sdb1", "Mark a failing partition as faulty and detach it from /dev/md0 before physical drive pull"],
          ["mdadm --manage /dev/md0 --add /dev/sdb1", "Add newly inserted replacement drive partition into /dev/md0 to start rebuild"],
          ["mdadm --examine /dev/sd[a-z]1", "Inspect RAID superblocks directly on member partitions"],
          ["mdadm --detail --scan | tee -a /etc/mdadm/mdadm.conf && update-initramfs -u", "Append active array definitions to mdadm.conf and update the Ubuntu initramfs (run it twice and you get duplicate ARRAY lines: check the file first)"]
        ],
        tags: ["mdadm", "raid", "mdstat", "degraded", "rebuild", "hotswap"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://man7.org/linux/man-pages/man8/mdadm.8.html", "title": "mdadm(8)"}, {"url": "https://manpages.debian.org/trixie/initramfs-tools/update-initramfs.8.en.html", "title": "update-initramfs(8)"}], "note": "mdadm documents both /etc/mdadm.conf and /etc/mdadm/mdadm.conf; Debian and Ubuntu use the second. --manage is optional: mdadm assumes it when the first option is --add, --fail or --remove."}
      },
      {
        id: "ledctl-lsscsi-multipath",
        desc: "Blink physical drive bay Fault/Locate LEDs (ledctl) and map SCSI/SAS HBA enclosure slots",
        cmd: "ledctl --listed-only locate=/dev/nvme0n1 && lsscsi -g -s -t",
        details: "In a 24-bay server chassis, pulling the wrong drive can take down an array. 'ledctl' (from 'ledmon' package) drives SGPIO/SES-2/SMP/VMD/NPEM backplane LEDs so the technician can visually verify the blinking bay before ejecting the carrier. Without --listed-only, ledctl turns off the LEDs of every other drive, including fault LEDs you may still need.",
        flags: [
          ["--listed-only", "Change only the drives named on the command line; leave every other drive's LEDs alone"],
          ["locate=/dev/...", "Turn on the blue/amber Locate LED on the backplane slot for the specified block device"],
          ["locate_off=/dev/...", "Turn off the Locate LED once the drive has been identified"],
          ["lsscsi -g -s -t", "Show [Host:Channel:Target:LUN], the sg device, the size, and transport details (SAS address) in place of vendor/model"]
        ],
        subcommands: [
          ["ledctl --listed-only locate_off=/dev/nvme0n1", "Turn the Locate LED off once the drive is swapped (other drives' LEDs untouched)"],
          ["ledctl --listed-only normal=/dev/nvme0n1", "Reset this bay's Status, Failure and Locate LEDs to off"],
          ["multipath -ll", "Display Device-Mapper Multipath topology, path-checker states, and LUN WWIDs"]
        ],
        tip: "Never pull a drive without blinking LED",
        tags: ["ledctl", "lsscsi", "multipath", "backplane", "led", "hotswap", "sas"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://manpages.debian.org/trixie/ledmon/ledctl.8.en.html", "title": "ledctl(8) (ledmon 0.97)"}, {"url": "https://manpages.debian.org/trixie/lsscsi/lsscsi.8.en.html", "title": "lsscsi(8)"}, {"url": "https://manpages.debian.org/trixie/multipath-tools/multipath.8.en.html", "title": "multipath(8)"}], "note": "Corrected 2026-11-09: added --listed-only; plain ledctl locate= turns off the LEDs of all other drives. Checked against ledmon 0.97; the 1.x changelog doesn't mention a syntax change."}
      }
    ]
  },
  {
    id: "kernel-boot",
    badge: "krn",
    title: "Kernel Modules, GRUB, Serial Console & Burn-in",
    subtitle: "modprobe/lsmod/dkms drivers, initramfs, GRUB serial console (ttyS0), kdump & hardware burn-in testing",
    commands: [
      {
        id: "lsmod-modinfo-modprobe",
        desc: "Inspect loaded kernel modules, check driver version/parameters, and load or unload modules live",
        cmd: "lsmod | head -n 15 && modinfo mlx5_core | grep -E 'filename:|version:|srcversion:|parm:'",
        details: "Verifies which kernel driver module (.ko/.ko.zst) is currently loaded in RAM, its exact version, file path under /lib/modules/$(uname -r)/, and tunable module parameters. Use 'modprobe' to resolve dependencies when loading or unloading drivers.",
        flags: [
          ["lsmod", "List loaded kernel modules, memory size, and dependent modules"],
          ["modinfo <mod>", "Show driver path, version, firmware files required, and configurable parameters"]
        ],
        subcommands: [
          ["modprobe -v <module_name> && modprobe -rv <module_name>", "Load (-v) or unload (-rv) a kernel module and its unused dependencies"],
          ["grep -H . /sys/module/mlx5_core/parameters/*", "Read currently active runtime parameter values of a loaded kernel module"],
          ["dkms status", "Check Dynamic Kernel Module Support build/install status across installed Ubuntu kernels"]
        ],
        tags: ["lsmod", "modinfo", "modprobe", "dkms", "driver", "kernel-module"]
      },
      {
        id: "grub-serial-initramfs",
        desc: "Inspect kernel boot cmdline, configure SOL serial console (ttyS0) in GRUB, and rebuild Ubuntu initramfs",
        cmd: "cat /proc/cmdline && grep -E '^GRUB_CMDLINE_LINUX|^GRUB_TERMINAL' /etc/default/grub",
        details: "Data center servers rely on Serial-over-LAN (IPMI SOL / Redfish Virtual Serial) at 115200 baud when video crashes. Ensure '/etc/default/grub' includes 'console=tty0 console=ttyS0,115200n8' in GRUB_CMDLINE_LINUX, then run 'update-grub'.",
        flags: [
          ["/proc/cmdline", "Exact kernel boot parameters passed by GRUB to the currently running kernel"],
          ["console=ttyS0,115200n8", "Send kernel boot & panic output to Serial Port 0 (IPMI SOL) at 115200 baud"]
        ],
        subcommands: [
          ["update-grub", "Regenerate /boot/grub/grub.cfg after editing /etc/default/grub"],
          ["update-initramfs -u -k all", "Rebuild initial RAM filesystem images for all installed Ubuntu kernels after driver/mdadm changes"],
          ["systemctl enable --now serial-getty@ttyS0.service", "Enable interactive login prompt on serial console ttyS0 without rebooting"]
        ],
        tip: "Essential for IPMI Serial-over-LAN",
        tags: ["grub", "cmdline", "serial", "ttys0", "sol", "initramfs", "boot"]
      },
      {
        id: "coredumpctl-kdump",
        desc: "Inspect application crashes (systemd-coredump) and verify Ubuntu kernel crash dump (kdump) readiness",
        cmd: "coredumpctl list | tail -n 10 && kdump-config status",
        details: "'coredumpctl' lists user-space processes that terminated with SIGSEGV/SIGABRT and lets you extract backtraces. For full kernel panics on Ubuntu Server (linux-crashdump), 'kdump-config status' verifies that a crashkernel memory reservation is active and ready to capture vmcore dumps to /var/crash.",
        flags: [
          ["coredumpctl list", "List captured application core dumps with timestamp, PID, signal, and executable"],
          ["kdump-config status", "Check if kexec crash kernel is loaded and ready to capture kernel panics"]
        ],
        subcommands: [
          ["coredumpctl info <PID>", "Show detailed stack trace, registers, and signal metadata for the latest crash"],
          ["ls -lh /var/crash/", "Inspect Ubuntu Apport / kdump crash reports and kernel vmcore directories"]
        ],
        tags: ["coredumpctl", "kdump", "crash", "panic", "segfault", "vmcore"]
      },
      {
        id: "stress-fio-burnin",
        desc: "Run post-repair hardware burn-in tests on CPU, ECC Memory (stress-ng), and NVMe storage IOPS (fio)",
        cmd: "stress-ng --cpu 0 --vm 4 --vm-bytes 80% --verify -t 10m --metrics-brief",
        details: "After replacing a motherboard, CPU, PSU, or DIMM in the data center, run a controlled thermal and memory verification burn-in before returning the node to production. '--verify' actively checks memory patterns for bit-flips while 'sensors' and 'edac-util' watch for thermal or ECC trips.",
        flags: [
          ["--cpu 0", "Spawn stressors on all online CPU cores"],
          ["--vm-bytes 80%", "Test 80% of available RAM with active read/write bit verification (--verify)"],
          ["-t 10m", "Run burn-in test for 10 minutes and print throughput metrics"]
        ],
        subcommands: [
          ["fio --name=randread --ioengine=libaio --iodepth=32 --rw=randread --bs=4k --direct=1 --size=4G --numjobs=4 --runtime=60 --time_based --filename=/tmp/fio.test --group_reporting", "Benchmark 4K random read IOPS and tail latency (direct I/O bypassing page cache)"],
          ["iperf3 -s   # on target node   &&   iperf3 -6 -c 2001:db8:dc:10::1 -P 8 -t 30", "Verify IPv6 (-6) 10G/25G/100G/400G NIC throughput across 8 parallel TCP streams for 30 seconds"]
        ],
        tip: "Run after CPU/RAM/Motherboard swap",
        tags: ["stress-ng", "fio", "iperf3", "burnin", "benchmark", "iops", "testing"]
      }
    ]
  },
  {
    id: "files",
    badge: "fs",
    title: "Files & Directories",
    subtitle: "Navigation, listing, finding, linking & safe manipulation",
    commands: [
      {
        id: "ls-lah",
        desc: "List all files with human-readable sizes, permissions & hidden dotfiles",
        cmd: "ls -lah --color=auto",
        details: "Displays permission bits, hard link count, owner, group, human-readable byte size, modification timestamp, and filename for every entry including dotfiles starting with '.'.",
        flags: [
          ["-l", "Long listing format (permissions, owner, size, date)"],
          ["-a", "Include hidden dotfiles (.*)"],
          ["-h", "Human-readable sizes (K, M, G, T)"]
        ],
        subcommands: [
          ["ls -lahtr", "Sort by modification time in reverse so the newest modified files appear at the bottom"],
          ["ls -laSrh", "Sort by file size with the largest files at the bottom of the terminal"],
          ["ls -li", "Include filesystem inode numbers in the first column"]
        ],
        tags: ["list", "directory", "hidden", "size", "recent", "modified"]
      },
      {
        id: "find-mtime-size",
        desc: "Find large or recently modified files across a filesystem without crossing mount boundaries",
        cmd: "find /var/log -xdev -type f -iname '*.log' -mtime -7 -size +50M -exec ls -lh {} +",
        details: "Walks directory trees evaluating predicates on inode metadata. Using '-xdev' prevents descending into mounted network shares, /proc, /sys, or other partitions when hunting down what filled up the root (/) filesystem.",
        flags: [
          ["-xdev", "Stay on the same mounted filesystem (do not cross mount points)"],
          ["-type f", "Match regular files only (use 'd' for directories, 'l' for symlinks)"],
          ["-mtime -7", "Modified less than 7 days ago (-mmin -60 for last 60 minutes)"],
          ["-size +50M", "Files larger than 50 MiB"],
          ["-exec ... +", "Batch pass matched paths to a single command invocation (fast)"]
        ],
        subcommands: [
          ["find / -xdev -type f -size +500M -printf '%s\\t%p\\n' 2>/dev/null | sort -nr | head -n 20", "Find top 20 largest files on the root filesystem with exact byte sizes"],
          ["find /var/log/app -type f -name '*.log.gz' -mtime +30 -delete", "Delete rotated compressed logs older than 30 days"]
        ],
        tip: "Use -xdev on root '/'",
        tags: ["search", "find", "recent", "logs", "large", "big", "cleanup", "space"]
      },
      {
        id: "mkdir-cp-ln",
        desc: "Create nested directories, archive-copy preserving attributes, or atomically flip symlinks",
        cmd: "mkdir -pv /srv/releases/{v1,v2} && cp -a src/ /srv/releases/v2/ && ln -sfn /srv/releases/v2 /srv/current",
        details: "Combines safe directory creation (-p), archive copying (-a preserves ownership, permissions, ACLs, and symlinks without following them), and atomic symlink replacement (-sfn updates a symlink pointing to a directory in a single rename syscall).",
        flags: [
          ["mkdir -pv", "Create parent directories as needed and print each created path"],
          ["cp -a", "Archive mode (-dR --preserve=all: permissions, timestamps, owners, symlinks)"],
          ["ln -sfn", "Create symbolic (-s) link, force overwrite (-f), treat symlink-to-dir as file (-n)"]
        ],
        subcommands: [
          ["readlink -f /srv/current", "Resolve all symlinks in a path and print the canonical physical path"],
          ["stat /etc/fstab", "Display full inode metadata: octal access mode, UID/GID, device ID, links, and Access/Modify/Change/Birth times"]
        ],
        tags: ["mkdir", "cp", "symlink", "ln", "stat", "readlink", "atomic"]
      },
      {
        id: "rsync-mirror",
        desc: "Synchronize directories locally or over SSH with delta transfer, progress bar & resume support",
        cmd: "rsync -avhP --stats src/ user@host:/backup/src/",
        details: "Uses the rsync delta-transfer algorithm to send only changed blocks over the network while preserving permissions, ownership, timestamps, and symlinks. '-P' combines '--partial' (keep partially transferred files if interrupted) and '--progress'.",
        flags: [
          ["-a", "Archive mode (-rlptgoD: recursive, links, perms, times, group, owner, devices)"],
          ["-v -h", "Verbose output with human-readable byte counts"],
          ["-P", "Show live transfer progress and keep partial files for resume"],
          ["--delete", "Optional: delete extraneous files on destination not present in source"]
        ],
        subcommands: [
          ["rsync -avhPn --delete src/ dest/", "Dry-run (-n) mirror with --delete to preview exactly what would be added or deleted"],
          ["rsync -avhP --bwlimit=50M /var/lib/data/ backup-node:/srv/data/", "Throttle transfer bandwidth to 50 MB/s so production NIC traffic is not saturated"]
        ],
        tip: "Always test --delete with -n first",
        tags: ["sync", "backup", "remote", "transfer", "rsync", "mirror"]
      }
    ]
  },
  {
    id: "permissions",
    badge: "perm",
    title: "Permissions, Ownership & ACLs",
    subtitle: "chmod, chown, POSIX ACLs, setgid shared directories & ext4/xfs immutable attributes",
    commands: [
      {
        id: "chmod-dirs-files",
        desc: "Set standard 755 permissions on directories and 644 on files recursively",
        cmd: "find /var/www/html -type d -exec chmod 755 {} + -o -type f -exec chmod 644 {} +",
        details: "Directories require the execute (+x) bit so processes can traverse ('cd') into them, whereas regular data files should not be marked executable. Using 'find' or 'chmod +X' separates directory traversal bits from file execution bits.",
        flags: [
          ["755", "rwxr-xr-x (Owner read/write/exec, Group & Others read/exec)"],
          ["644", "rw-r--r-- (Owner read/write, Group & Others read-only)"],
          ["+X", "In 'chmod -R u+rwX,go+rX', capital X adds execute only to directories and already-executable files"]
        ],
        subcommands: [
          ["chmod -R u+rwX,go+rX,go-w /srv/data", "Smart recursive chmod using capital +X (no find command needed)"],
          ["chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys ~/.ssh/id_ed25519", "Enforce strict SSH directory and key permissions required by sshd StrictModes"]
        ],
        tip: "Fixes SSH & web root permissions",
        tags: ["chmod", "web", "recursive", "permissions", "ssh"]
      },
      {
        id: "chown-setgid",
        desc: "Change recursive ownership and set the SGID bit so new files inherit the directory's group",
        cmd: "chown -R jason:devops /srv/shared && chmod 2775 /srv/shared",
        details: "Normally, newly created files inherit the primary group of the user who created them. Setting the Set-Group-ID (SGID, octal prefix '2' or 'g+s') bit on a shared directory forces all new files and subdirectories created inside it to inherit the directory's group ownership.",
        flags: [
          ["chown -R user:group", "Recursively set both owner and group across directory tree"],
          ["2775 (g+s)", "rwxrwsr-x: Set-Group-ID on directory so child files inherit group"]
        ],
        subcommands: [
          ["chmod 1777 /tmp/scratch", "Set Sticky Bit (octal prefix '1' or '+t') so only a file's owner or root can delete it"]
        ],
        tip: "Essential for shared team folders",
        tags: ["owner", "group", "chown", "setgid", "sgid", "sticky"]
      },
      {
        id: "setfacl-chattr",
        desc: "Grant fine-grained POSIX ACL permissions or lock critical config files with immutable attribute",
        cmd: "setfacl -R -m u:deploy:rwX,d:u:deploy:rwX /srv/app && getfacl /srv/app",
        details: "POSIX Access Control Lists (ACLs) grant read/write/execute rights to additional users or groups without changing the base file owner/group. 'chattr +i' sets the ext4/xfs inode immutable bit so even root cannot modify, rename, or delete the file until 'chattr -i' is run.",
        flags: [
          ["-m u:user:rwX", "Modify current file/directory ACL entry for specific user"],
          ["d:u:user:rwX", "Set Default ACL on directory so future files automatically inherit the ACL"],
          ["getfacl", "View base permissions and extended POSIX ACL entries"]
        ],
        subcommands: [
          ["setfacl -b -R /srv/app", "Strip all extended ACL entries and revert to standard POSIX permissions"],
          ["chattr +i /etc/resolv.conf && lsattr /etc/resolv.conf", "Make a file immutable (+i) and inspect extended filesystem attributes (use -i to unlock)"]
        ],
        tags: ["acl", "getfacl", "setfacl", "chattr", "lsattr", "immutable"]
      }
    ]
  },
  {
    id: "text",
    badge: "txt",
    title: "Text Processing, Log Triage & Streams",
    subtitle: "grep, awk, sed, jq, sort, uniq, cut, column & live log pipelines",
    commands: [
      {
        id: "grep-recursive-logs",
        desc: "Search logs or configs recursively with extended regex, line numbers, and surrounding context",
        cmd: "grep -rnIE -C 2 --color=auto 'ERROR|FATAL|CRITICAL|panic' /var/log/",
        details: "Scans text files recursively (-r), prints 1-based line numbers (-n), skips binary files (-I), enables extended regex alternation (-E), and shows 2 lines of context before and after each match (-C 2) to understand what triggered an error.",
        flags: [
          ["-r -n", "Recursive search with line numbers"],
          ["-I", "Ignore binary files (prevents terminal garbage)"],
          ["-E", "Extended regular expressions (supports |, +, ?, () without escaping)"],
          ["-C 2", "Print 2 lines of leading (-B) and trailing (-A) context"]
        ],
        subcommands: [
          ["grep -Ev '^\\s*(#|$)' /etc/ssh/sshd_config", "Strip all comment lines (#) and blank lines to view only active configuration directives"],
          ["grep -rn --exclude-dir={.git,node_modules,venv} 'pattern' .", "Search source trees excluding version control and dependency directories"],
          ["zgrep -i 'oom-killer' /var/log/syslog* /var/log/kern.log*", "Search transparently inside both plain-text and gzip-compressed (.gz) rotated logs"]
        ],
        tip: "grep -Ev '^\\s*(#|$)' strips comments",
        tags: ["search", "regex", "logs", "grep", "zgrep", "config"]
      },
      {
        id: "awk-sed-pipelines",
        desc: "Parse log columns, aggregate metrics with awk, or perform safe in-place edits with sed",
        cmd: "awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -n 10",
        details: "'awk' splits each line into whitespace-delimited fields ($1, $2, ... $NF for last field) and runs pattern-action blocks. 'sed -i.bak' performs stream regex substitutions directly on a file while automatically saving a '.bak' copy of the original.",
        flags: [
          ["awk '{print $1}'", "Extract first whitespace-delimited column (use -F':' for custom delimiter)"],
          ["uniq -c", "Count occurrences of adjacent sorted lines"],
          ["sort -nr", "Sort numerically (-n) in reverse descending order (-r)"]
        ],
        subcommands: [
          ["ls -l | awk '{sum += $5} END {printf \"Total: %.2f MiB\\n\", sum/1048576}'", "Sum the 5th column (byte size) across all lines and print total in MiB"],
          ["sed -i.bak -E 's/^#?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config", "Edit config file in-place while creating a .bak backup file automatically"],
          ["column -t -s ':' /etc/passwd | head -n 15", "Format any delimiter-separated file or stream into an aligned terminal table"]
        ],
        tags: ["awk", "sed", "sort", "uniq", "column", "logs", "replace"]
      },
      {
        id: "tail-jq-streams",
        desc: "Follow rotating log files live and filter structured JSON output with jq",
        cmd: "tail -F /var/log/syslog /var/log/auth.log",
        details: "Unlike 'tail -f' (which follows an open file descriptor that stops updating when logrotate renames the file), capital 'tail -F' tracks the filename and automatically reopens the new file after log rotation.",
        flags: [
          ["-F", "Follow by filename and retry if file is rotated, truncated, or recreated"],
          ["-n 100", "Output the last 100 lines before following"]
        ],
        subcommands: [
          ["curl -s http://localhost:8080/health | jq '.checks[] | select(.status != \"UP\")'", "Parse JSON stream and filter only objects matching a condition"],
          ["diff -u <(sort file1.txt) <(sort file2.txt)", "Compare two command outputs on the fly using Bash process substitution"]
        ],
        tags: ["tail", "jq", "json", "logs", "diff", "stream"]
      }
    ]
  },
  {
    id: "processes",
    badge: "proc",
    title: "Processes, Signals, Open Files & Performance",
    subtitle: "ps, pgrep/pkill, lsof deleted files, free/vmstat/iostat/pidstat, strace & OOM triage",
    commands: [
      {
        id: "ps-top-cpu-mem",
        desc: "Find top processes consuming the most Resident Memory (RSS) or CPU, and view process tree",
        cmd: "ps -eo pid,ppid,user,%cpu,%mem,rss,stat,lstart,cmd --sort=-%mem | head -n 15",
        details: "Queries /proc/<pid>/stat and status. 'rss' shows physical non-swapped Resident Set Size in KiB; 'stat' shows process state: R (Running), S (Interruptible sleep), D (Uninterruptible I/O sleep — hung NFS/disk), Z (Zombie), T (Stopped).",
        flags: [
          ["-eo ...", "Select exact columns to output for every process on the system"],
          ["--sort=-%mem", "Sort descending by physical memory percentage (use -%cpu for CPU)"],
          ["STAT = D", "Uninterruptible sleep (process is blocked inside a kernel I/O syscall)"]
        ],
        subcommands: [
          ["top -b -n 1 -o +%CPU | head -n 20", "Run top in non-interactive batch mode sorted by highest CPU utilization"],
          ["systemctl status <PID>", "Map any running PID back to its owning systemd service unit and cgroup slice"]
        ],
        tip: "STAT 'D' = blocked on disk/NFS I/O",
        tags: ["ps", "memory", "cpu", "rss", "zombie", "tree", "pgrep", "pkill"]
      },
      {
        id: "lsof-deleted-proc",
        desc: "Find processes holding open file handles to deleted files (fixing 'disk full but du shows space')",
        cmd: "lsof +L1",
        details: "When a huge log file is deleted ('rm /var/log/huge.log') while a daemon still holds an open file descriptor to it, the kernel does not free the disk blocks until the process closes the FD or restarts. 'lsof +L1' lists every open file with a hard link count less than 1.",
        flags: [
          ["+L1", "List open files with link count < 1 (unlinked / deleted from directory tree)"]
        ],
        subcommands: [
          ["lsof +D /var/log", "List all processes holding open files inside the /var/log directory tree"],
          ["ls -l /proc/<PID>/fd /proc/<PID>/exe /proc/<PID>/cwd", "Inspect a process's open file descriptors, binary symlink, and working directory in /proc"]
        ],
        tip: "Fixes invisible disk exhaustion",
        tags: ["lsof", "deleted", "disk-full", "fd", "proc"]
      },
      {
        id: "free-vmstat-iostat",
        desc: "Analyze available RAM, buffer/cache breakdown, swap activity, and per-disk I/O latency (await)",
        cmd: "free -h -w && iostat -xz 1 3",
        details: "In 'free -h', always look at the 'available' column (not 'free'), as Linux uses spare RAM for page cache and reclaims it on demand. In 'iostat -xz' (from Ubuntu 'sysstat' package), check 'r_await' / 'w_await' (average I/O latency in ms) and '%util' to spot saturated disks.",
        flags: [
          ["free -h -w", "Human-readable memory table separating kernel buffers and page cache"],
          ["iostat -xz 1 3", "Extended (-x) disk I/O stats skipping idle devices (-z), 3 samples at 1s interval"],
          ["r_await / w_await", "Average time (ms) for read/write requests (Queue time + Device service time)"]
        ],
        subcommands: [
          ["vmstat -Sm 1 5", "Sample run-queue (r), blocked I/O procs (b), swap in/out (si/so), and CPU iowait (wa) every 1s"],
          ["pidstat -d -u -r 1 5", "Per-process breakdown of disk I/O kB/s (-d), CPU% (-u), and page faults/RSS (-r)"]
        ],
        tags: ["free", "iostat", "vmstat", "pidstat", "sysstat", "iowait", "ram", "latency"]
      },
      {
        id: "strace-oom-debug",
        desc: "Trace live system calls of a hung process and inspect Linux kernel OOM-killer events",
        cmd: "strace -p <PID> -f -T -tt",
        details: "Attaches to a running PID via ptrace and prints every system call (openat, read, write, connect, futex) with wall-clock timestamps (-tt) and time spent inside each syscall in seconds (-T). Essential for seeing why a process is hanging.",
        flags: [
          ["-p <PID>", "Attach to running process ID"],
          ["-f", "Follow child processes and threads forked/cloned by the target"],
          ["-T -tt", "Print microsecond timestamps (-tt) and syscall duration (<0.000124>) (-T)"]
        ],
        subcommands: [
          ["perf top -g", "Live hardware performance counter profiler showing top kernel and userspace functions by CPU cycles"],
          ["dmesg -T | grep -iE -C 3 'out of memory|killed process|oom-kill'", "Check if the Linux kernel OOM killer terminated a process due to memory exhaustion"]
        ],
        tags: ["strace", "syscall", "hang", "debug", "oom", "oom-killer"]
      }
    ]
  },
  {
    id: "network",
    badge: "net",
    title: "Networking, Sockets, DNS, UFW & SSH",
    subtitle: "ss socket inspection, iproute2, DNS dig/resolvectl, curl timing, SSH tunnels, tcpdump & UFW",
    commands: [
      {
        id: "ss-listening-conns",
        desc: "Inspect all listening TCP/UDP ports, owning process/PID, and established socket states",
        cmd: "ss -tulpn",
        details: "Queries kernel netlink TCP_DIAG directly (much faster than legacy netstat on servers with 50,000+ sockets). Shows local bind address (0.0.0.0 vs 127.0.0.1 vs [::]), port number, and the process name + PID holding the socket.",
        flags: [
          ["-t -u", "Show both TCP (-t) and UDP (-u) sockets"],
          ["-l", "Show only listening server sockets (omit -l to see established connections)"],
          ["-p", "Show process name, PID, and file descriptor owning the socket (requires sudo)"],
          ["-n", "Numeric addresses and port numbers (do not block on DNS/service resolution)"]
        ],
        subcommands: [
          ["ss -tanp state established", "List all currently established TCP connections with remote peer IPs and local PIDs"],
          ["ss -s", "Print high-level kernel socket summary (total TCP established, syn-recv, time-wait, orphaned)"],
          ["lsof -iTCP:8080 -sTCP:LISTEN -P -n", "Find the exact process bound to TCP port 8080"]
        ],
        tip: "Fast netlink socket inspection",
        tags: ["ports", "listen", "open", "netstat", "socket", "ss", "lsof"]
      },
      {
        id: "iproute2-interfaces-routes",
        desc: "Inspect NIC link state, MAC, MTU, IPv6 (`/64` & `fe80::`) addresses, IPv6 routing table & NDP neighbor cache",
        cmd: "ip -c -br link show && ip -6 -c -br addr show && ip -6 -c route show",
        details: "Modern iproute2 toolkit for inspecting L2 link state (LOWER_UP = physical carrier detected, UP = admin enabled), L3 IPv6/IPv4 CIDR assignments, default gateways (often link-local fe80:: via Router Advertisements or BGP Unnumbered), and policy routing tables.",
        flags: [
          ["-6 -c -br", "Colorized single-line tabular output of IPv6 Global and Link-Local addresses per interface"],
          ["-s", "Include RX/TX packet, byte, error, and dropped counters (ip -s -s link show eth0)"]
        ],
        subcommands: [
          ["ip -6 route get 2606:4700:4700::1111", "Query the kernel IPv6 routing table to see which egress interface, source IPv6, and next-hop gateway will be used"],
          ["ip -6 -c neigh show", "Display the L2 IPv6 Neighbor Discovery (NDP) table (REACHABLE, STALE, FAILED, router)"],
          ["ip -6 -c rule list && ip -6 route show table all", "Inspect IPv6 policy-based routing (PBR) rules and all kernel routing tables"]
        ],
        tip: "'ip -6 route get <IPv6>' tests routing policy",
        tags: ["ip", "ipv6", "interface", "nic", "gateway", "route", "ndp", "arp", "mtu"]
      },
      {
        id: "dig-curl-diagnostics",
        desc: "Test IPv6 DNS (`AAAA`) resolution against specific nameservers and measure IPv6 HTTP/TLS connection timing",
        cmd: "dig @2606:4700:4700::1111 example.com AAAA +noall +answer && curl -g -6 -sSL -D - -o /dev/null -w 'DNS:%{time_namelookup}s TCP:%{time_connect}s TLS:%{time_appconnect}s TTFB:%{time_starttransfer}s\n' https://example.com",
        details: "Separates IPv6 AAAA DNS lookup issues from TCPv6 routing, TLS handshake slowness, or backend application latency (TTFB = Time To First Byte). Pass '-g -6' when querying literal '[IPv6]' URLs with curl.",
        flags: [
          ["dig @<IPv6_NS> AAAA", "Query a specific IPv6 DNS server directly for AAAA records, bypassing local /etc/resolv.conf"],
          ["curl -g -6 -w '...'", "Force IPv6 (-6), disable bracket globbing (-g), and print DNS/TCP/TLS/TTFB timing"]
        ],
        subcommands: [
          ["dig -x 2606:4700:4700::1111 +short", "Perform reverse DNS (ip6.arpa PTR record) lookup on an IPv6 address"],
          ["openssl s_client -6 -connect \"[2001:db8:dc:4::50]:443\" -servername bmc.local </dev/null 2>/dev/null | openssl x509 -noout -dates -subject -issuer", "Inspect a remote server/BMC's live TLS certificate over IPv6 (-6)"],
          ["nc -6 -zv -w 3 2001:db8:dc:4::25 22 80 443", "Test raw IPv6 TCP port connectivity to a remote host with a 3-second timeout"]
        ],
        tags: ["dns", "ipv6", "aaaa", "dig", "curl", "http", "tls", "ssl", "certificate", "netcat"]
      },
      {
        id: "tcpdump-ufw-ssh",
        desc: "Capture live IPv6/ICMPv6 network packets (`tcpdump`), manage Ubuntu UFW IPv6 firewall rules, and create SSH tunnels",
        cmd: "tcpdump -ni any 'ip6 and (tcp port 443 or icmp6)' -nn -vv -c 50",
        details: "'tcpdump -ni any' captures packets across all interfaces without blocking on DNS or port name resolution (-nn). Filtering 'icmp6' captures IPv6 ping, Neighbor Discovery (NDP), and Router Advertisements.",
        flags: [
          ["ip6 / icmp6", "Capture IPv6 traffic and ICMPv6 (Neighbor Solicitation/Advertisement, Router Advertisements, Ping6)"],
          ["-nn", "Do not resolve hostnames or port service names"],
          ["-i any", "Capture on all interfaces (or specify eth0 / bond0)"]
        ],
        subcommands: [
          ["ufw status numbered && ufw allow from 2001:db8:dc::/48 to any port 22 proto tcp", "View numbered Ubuntu UFW firewall rules and allow SSH only from internal 2001:db8:dc::/48 IPv6 prefix"],
          ["ssh -6 -N -L \"[::1]:5432:[2001:db8:dc::db]:5432\" user@bastion-host", "Forward local IPv6 loopback port 5432 securely through an SSH bastion host to an internal IPv6 database"],
          ["mtr -6 -rwzbc 20 2606:4700:4700::1111", "Run IPv6 My Traceroute report showing per-hop packet loss %, ASN, and latency jitter over 20 pings"]
        ],
        tags: ["tcpdump", "ipv6", "icmp6", "pcap", "ufw", "firewall", "ssh", "tunnel", "mtr", "traceroute"]
      }
    ]
  },
  {
    id: "storage",
    badge: "dsk",
    title: "Filesystems, Partitions, LVM & Mounts",
    subtitle: "df space/inodes, du directory sizes, lsblk/blkid UUIDs, LVM lvextend, fstab verification & dd",
    commands: [
      {
        id: "df-du-space",
        desc: "Check mounted filesystem capacity, inode exhaustion, and top largest directories",
        cmd: "df -hT -x tmpfs -x devtmpfs -x squashfs && df -i /",
        details: "A Linux filesystem can report 'No space left on device' in two ways: running out of data blocks ('df -hT') or running out of inodes ('df -i') due to millions of tiny files in /var/spool or /tmp.",
        flags: [
          ["-hT", "Human-readable sizes and print filesystem type (ext4, xfs, btrfs, zfs, nfs4)"],
          ["-x squashfs", "Exclude Ubuntu Snap loop mounts (squashfs) and pseudo-filesystems"],
          ["-i", "Show inode usage (Inodes, IUsed, IFree, IUse%) instead of disk blocks"]
        ],
        subcommands: [
          ["du -xh --max-depth=1 /var 2>/dev/null | sort -hr | head -n 15", "List the 15 largest subdirectories inside /var on the same filesystem (-x)"],
          ["df -hlT -x squashfs -x tmpfs", "Show only local filesystems (-l), avoiding hangs when a remote NFS server is unreachable"],
          ["df -h --output=source,fstype,size,used,avail,pcent,ipcent,target -x tmpfs -x squashfs", "Show both Block Use% (pcent) and Inode Use% (ipcent) side-by-side in a single table"],
          ["ncdu -x /", "Launch interactive terminal disk usage analyzer on root '/' (staying on one filesystem)"]
        ],
        tip: "Always check both blocks (df -h) & inodes (df -i)",
        tags: ["space", "free", "partition", "mount", "inodes", "du", "ncdu"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://man7.org/linux/man-pages/man1/df.1.html", "title": "df(1)"}, {"url": "https://man7.org/linux/man-pages/man1/du.1.html", "title": "du(1)"}, {"url": "https://dev.yorhel.nl/ncdu/man", "title": "ncdu manual"}]}
      },
      {
        id: "lsblk-blkid-fstab",
        desc: "Inspect block devices, partitions, LVM volumes, filesystem UUIDs & verify /etc/fstab before reboot",
        cmd: "lsblk -o NAME,SIZE,TYPE,FSTYPE,LABEL,UUID,MOUNTPOINTS && findmnt --verify --verbose",
        details: "Before rebooting an Ubuntu server after editing '/etc/fstab', always run 'findmnt --verify' and 'mount -a'. A typo or missing UUID in /etc/fstab without 'nofail' will drop the server into emergency single-user mode on boot.",
        flags: [
          ["lsblk -o ...", "Tree view of disks, partitions, LVM/RAID, filesystem types, and UUIDs, with the columns you list (-f alone gives a fixed filesystem set)"],
          ["findmnt --verify", "Parse /etc/fstab and validate that all UUIDs, mountpoints, and options are valid"]
        ],
        subcommands: [
          ["blkid", "Print block device attributes (UUID, PARTUUID, TYPE) formatted for /etc/fstab"],
          ["lsblk -d -o NAME,SIZE,TRAN,ROTA,MODEL,SERIAL,WWN", "List top-level devices only (-d: no partitions or holders) with transport type, rotational flag (1=HDD, 0=SSD), model, and serial"],
          ["mount -o remount,rw /", "Remount the root filesystem read-write if the system booted into read-only recovery mode"]
        ],
        tip: "Run 'findmnt --verify' before every reboot!",
        tags: ["lsblk", "blkid", "uuid", "fstab", "findmnt", "mount"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://man7.org/linux/man-pages/man8/lsblk.8.html", "title": "lsblk(8)"}, {"url": "https://man7.org/linux/man-pages/man8/findmnt.8.html", "title": "findmnt(8)"}, {"url": "https://man7.org/linux/man-pages/man8/blkid.8.html", "title": "blkid(8)"}, {"url": "https://man7.org/linux/man-pages/man8/mount.8.html", "title": "mount(8)"}], "note": "Corrected 2026-11-09: dropped -f from lsblk -f -o (-f is itself a column list; how the two combine isn't documented). TRAN, ROTA, MODEL, SERIAL and WWN checked with lsblk --list-columns (util-linux 2.42)."}
      },
      {
        id: "lvm-resize-extend",
        desc: "Inspect Ubuntu LVM Physical Volumes (PV), Volume Groups (VG), and grow a Logical Volume (LV) online",
        cmd: "pvs && vgs && lvs",
        details: "Ubuntu Server defaults to installing on LVM (e.g., /dev/mapper/ubuntu--vg-ubuntu--lv) leaving unallocated space in the Volume Group or expanding dynamically. Adding '-r' (--resizefs) to 'lvextend' grows both the LVM volume and the underlying ext4/xfs filesystem online in one step.",
        flags: [
          ["pvs / vgs / lvs", "Concise summary of Physical Volumes, Volume Groups, and Logical Volumes"],
          ["lvextend -r", "Extend the Logical Volume AND automatically resize the ext4/xfs filesystem online"]
        ],
        subcommands: [
          ["lvextend -r -l +100%FREE /dev/ubuntu-vg/ubuntu-lv", "Expand the default Ubuntu root logical volume to use 100% of remaining free space in the VG and resize ext4/xfs live"],
          ["lvextend -r -L +50G /dev/ubuntu-vg/ubuntu-lv", "Add 50 GiB to the logical volume and grow the filesystem online without unmounting"]
        ],
        tip: "lvextend -r resizes LV + filesystem together",
        tags: ["lvm", "lvextend", "vgs", "lvs", "pvs", "resize2fs", "xfs_growfs", "ubuntu-vg"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://man7.org/linux/man-pages/man8/lvextend.8.html", "title": "lvextend(8)"}, {"url": "https://man7.org/linux/man-pages/man8/lvs.8.html", "title": "lvs(8)"}], "note": "The names ubuntu-vg / ubuntu-lv and how much free space the Ubuntu installer leaves in the VG are not in Ubuntu's docs: run lvs and vgs to get yours."}
      },
      {
        id: "dd-parted-fsck",
        desc: "Partition disks >2TB with GPT (parted), check filesystems, or write raw disk images with dd",
        cmd: "parted -l && dd if=ubuntu-server.iso of=/dev/sdX bs=4M status=progress conv=fsync",
        details: "Uses 'parted' to inspect or create GUID Partition Tables (GPT, required for disks > 2 TiB). When using 'dd', add 'conv=fsync' so dd does not exit until the data is physically written to the target device (oflag=sync instead makes every single write synchronous, which is much slower).",
        flags: [
          ["bs=4M", "Read and write 4 MiB blocks at a time for high throughput"],
          ["status=progress", "Display live transfer rate and bytes written"],
          ["conv=fsync", "Physically write output data and metadata before dd finishes (not conv=sync, which pads blocks with NULs)"]
        ],
        subcommands: [
          ["parted -s /dev/nvme1n1 mklabel gpt mkpart data ext4 1MiB 100% && mkfs.ext4 -L data /dev/nvme1n1p1", "Create a 1MiB-aligned GPT partition named 'data' across a new NVMe drive, then format it as ext4 (mkpart makes no filesystem)"],
          ["tune2fs -l /dev/sda1 | grep -E 'Filesystem state|Mount count|Last checked|Reserved block'", "Inspect ext4 superblock health state and reserved root block count"]
        ],
        danger: "dd/mklabel destroys all data on target disk",
        tags: ["dd", "parted", "gpt", "mkfs", "ext4", "iso", "usb"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://man7.org/linux/man-pages/man1/dd.1.html", "title": "dd(1)"}, {"url": "https://www.gnu.org/software/parted/manual/parted.html", "title": "GNU Parted manual"}, {"url": "https://man7.org/linux/man-pages/man8/mke2fs.8.html", "title": "mke2fs(8)"}, {"url": "https://man7.org/linux/man-pages/man8/tune2fs.8.html", "title": "tune2fs(8)"}], "note": "Corrected 2026-11-09: oflag=sync → conv=fsync (the flush-before-exit flag), and mkpart primary → mkpart data (on GPT that word is the partition name). The tune2fs -l output labels aren't listed in the man page."}
      }
    ]
  },
  {
    id: "archives",
    badge: "tar",
    title: "Archives, Compression & Checksums",
    subtitle: "tar, gzip, zstd multithreaded compression, streaming SSH backups & SHA-256 verification",
    commands: [
      {
        id: "tar-create-extract",
        desc: "Create, inspect, and extract tar archives (.tar.gz, .tar.xz, .tar.zst) with target directory control",
        cmd: "tar --exclude='.git' --exclude='node_modules' -czvf backup.tar.gz project/ && tar -ztvf backup.tar.gz | head",
        details: "GNU tar automatically detects the compression format (.gz, .xz, .bz2, .zst) when extracting ('tar -xvf') or listing ('tar -tvf'), so you only need explicit compression flags (-z for gzip, -J for xz, --zstd for zstandard) when creating ('-c') an archive.",
        flags: [
          ["-c / -x / -t", "Create (-c), Extract (-x), or List contents (-t) of an archive"],
          ["-z / -J / --zstd", "Filter through gzip (-z), xz (-J), or zstd (--zstd)"],
          ["-v -f <file>", "Verbose file output (-v) using archive filename (-f)"],
          ["-C <dir>", "Change to target directory before extracting or archiving"]
        ],
        subcommands: [
          ["tar -xvf archive.tar.gz -C /opt/target/", "Extract any compressed tar archive into /opt/target/"],
          ["tar -I 'zstd -T0 -9' -cvf backup.tar.zst /var/www/", "Create a high-ratio Zstandard (.tar.zst) archive utilizing all CPU cores (-T0)"]
        ],
        tip: "zstd -T0 is 5x faster than gzip",
        tags: ["tar", "compress", "extract", "zstd", "gzip", "backup"]
      },
      {
        id: "tar-ssh-sha256",
        desc: "Stream compressed backups directly over SSH without local temp files and verify SHA-256 checksums",
        cmd: "tar -czf - /etc /var/www | ssh user@backup-host 'cat > /backups/host-$(date +%F).tar.gz'",
        details: "When a server's disk is 98% full and there is no local space to create a tarball, 'tar -czf -' writes the compressed stream directly to stdout and pipes it over SSH to a remote host.",
        flags: [
          ["-f -", "Write archive to stdout (or read archive from stdin)"],
          ["sha256sum -c", "Read SHA-256 hashes from a file and verify file integrity"]
        ],
        subcommands: [
          ["sha256sum firmware.bin iso-image.iso > SHA256SUMS && sha256sum -c SHA256SUMS", "Generate and verify cryptographic SHA-256 checksums for ISOs or firmware images"]
        ],
        tags: ["stream", "ssh", "remote-backup", "sha256sum", "checksum", "hash"]
      }
    ]
  },
  {
    id: "systemd",
    badge: "sys",
    title: "Systemd Services, Journald & Boot Analysis",
    subtitle: "systemctl unit control, journalctl boot/priority filtering, systemd-analyze & timers",
    commands: [
      {
        id: "systemctl-manage-units",
        desc: "Manage systemd services, inspect failed units, view unit files, and reload daemon configs",
        cmd: "systemctl --failed && systemctl enable --now nginx.service && systemctl status nginx.service",
        details: "Controls the Ubuntu systemd service manager. 'enable --now' both creates the boot symlink and starts the service immediately. Use 'systemctl cat <unit>' to see the base unit file plus any drop-in overrides in /etc/systemd/system/<unit>.d/override.conf.",
        flags: [
          ["--failed", "List all systemd units currently in a failed state across the system"],
          ["enable --now", "Enable unit at boot AND start it immediately"],
          ["daemon-reload", "Reload systemd manager configuration after editing unit files"]
        ],
        subcommands: [
          ["systemctl cat ssh.service", "Print the full systemd unit file and any active drop-in overrides"],
          ["systemctl edit nginx.service", "Create or edit a safe drop-in override (/etc/systemd/system/nginx.service.d/override.conf)"],
          ["systemctl list-timers --all", "List all systemd timers with next/last trigger times (modern cron replacement)"],
          ["systemctl mask sleep.target suspend.target hibernate.target hybrid-sleep.target", "Permanently mask sleep/suspend targets on a data center server so it can never suspend"],
          ["systemctl reboot --firmware-setup", "Reboot the server directly into the motherboard UEFI/BIOS setup utility"]
        ],
        tags: ["systemctl", "service", "daemon", "failed", "timers", "systemd"]
      },
      {
        id: "journalctl-triage",
        desc: "Filter systemd journal logs by unit, boot session, time window, and syslog severity priority",
        cmd: "journalctl -b 0 -p err..emerg --no-pager && journalctl -u ssh.service --since '1 hour ago' -f",
        details: "Queries structured binary logs from systemd-journald. Use '-b -1' to inspect logs from the previous boot right before an unexpected server reboot or crash, and '-p err..emerg' to filter out informational noise.",
        flags: [
          ["-b 0 / -b -1", "Filter logs from current boot (-b 0) or previous boot before a crash (-b -1)"],
          ["-p err..emerg", "Show only Error (3), Critical (2), Alert (1), and Emergency (0) priority events"],
          ["-u <unit>", "Filter logs for a specific systemd unit"],
          ["-k", "Show only kernel messages (equivalent to dmesg)"]
        ],
        subcommands: [
          ["journalctl --list-boots", "List all recorded system boot sessions with boot IDs and start/stop timestamps"],
          ["journalctl -k -b -1 -n 100 --no-pager", "View the last 100 kernel messages from the previous boot before the server crashed"],
          ["journalctl --disk-usage && journalctl --vacuum-size=500M", "Check journal disk usage in /var/log/journal and prune old logs down to 500 MiB"],
          ["systemd-analyze time && systemd-analyze blame | head -n 15", "Measure kernel + userspace boot time and list the slowest-starting units"]
        ],
        tip: "Use 'journalctl -b -1' after a sudden reboot",
        tags: ["journalctl", "logs", "boot", "crash", "errors", "systemd-analyze"]
      }
    ]
  },
  {
    id: "users",
    badge: "usr",
    title: "Users, Groups, SSH Keys & Sudoers",
    subtitle: "Ubuntu user/group administration, Ed25519 SSH keys, active session auditing & visudo",
    commands: [
      {
        id: "useradd-usermod-ubuntu",
        desc: "Create a new user on Ubuntu with bash shell and sudo group, or append groups to an existing user",
        cmd: "useradd -m -s /bin/bash -G sudo,adm,systemd-journal alice && passwd alice",
        details: "On Ubuntu Linux, members of the 'sudo' group are granted root privileges via /etc/sudoers, and members of 'adm' / 'systemd-journal' can read system logs in /var/log and journalctl without sudo.",
        flags: [
          ["-m", "Create home directory (/home/alice) and copy skeleton files from /etc/skel"],
          ["-s /bin/bash", "Set login shell to /bin/bash (useradd defaults to /bin/sh if omitted)"],
          ["-G sudo,adm", "Supplementary groups (Ubuntu uses 'sudo', not 'wheel')"]
        ],
        subcommands: [
          ["usermod -aG docker $USER && newgrp docker", "Append (-aG) current user to a group without losing existing groups and activate immediately"],
          ["passwd -l <user> && usermod -s /usr/sbin/nologin <user>", "Lock a user's password and disable interactive shell login when offboarding"]
        ],
        danger: "Never omit '-a' with usermod -G!",
        tags: ["useradd", "adduser", "usermod", "sudo", "ubuntu", "groups"]
      },
      {
        id: "ssh-visudo-audit",
        desc: "Generate Ed25519 SSH keys, audit logged-in users/login history, and safely validate sudoers",
        cmd: "id && w && last -n 10 -a -F",
        details: "Audits current user UID/GID memberships ('id'), active TTY/SSH sessions and their current foreground command ('w'), and historical login/reboot records from /var/log/wtmp ('last').",
        flags: [
          ["id", "Print effective UID, GID, and all supplementary group memberships"],
          ["w", "Show who is currently logged in, from what IP, idle time, and running process"],
          ["last -a -F", "Show recent logins and system reboots with full timestamps and source host/IP"]
        ],
        subcommands: [
          ["ssh-keygen -t ed25519 -C 'tech@datacenter' && ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server", "Generate an Ed25519 SSH keypair and install the public key onto a remote server"],
          ["EDITOR=nano visudo -f /etc/sudoers.d/90-datacenter-techs", "Edit a drop-in sudoers file with automatic syntax validation so you never lock out sudo"]
        ],
        tip: "Always use visudo for /etc/sudoers.d/",
        tags: ["ssh-keygen", "visudo", "sudoers", "who", "last", "audit", "security"]
      }
    ]
  },
  {
    id: "packages",
    badge: "pkg",
    title: "Ubuntu APT, dpkg, Snap & Release Management",
    subtitle: "APT upgrades & repo policy, dpkg file ownership & repair, needrestart, Snap & Ubuntu LTS tools",
    commands: [
      {
        id: "apt-update-upgrade",
        desc: "Update Ubuntu APT repositories, perform full upgrade, and purge orphaned packages/kernels",
        cmd: "apt update && apt full-upgrade -y && apt autoremove --purge -y",
        details: "'apt full-upgrade' upgrades installed packages and intelligently resolves dependency changes (such as installing a new Linux kernel ABI package). 'autoremove --purge' removes old unused kernel images and leftover configuration files so /boot does not fill up.",
        flags: [
          ["full-upgrade", "Upgrade packages while handling dependency additions/removals"],
          ["autoremove --purge", "Remove unused dependencies and purge their residual /etc config files"]
        ],
        subcommands: [
          ["apt list --upgradable", "List all packages that have a newer version available in configured APT repositories"],
          ["apt-mark hold linux-image-generic kubelet && apt-mark showhold", "Pin/hold critical packages (e.g. kernel or kubelet) to prevent accidental upgrades"]
        ],
        tip: "Keeps /boot clean of old kernels",
        tags: ["ubuntu", "debian", "apt", "upgrade", "cleanup", "apt-mark", "hold"]
      },
      {
        id: "apt-search-policy",
        desc: "Search APT packages, inspect package dependencies, and debug PPA/repository version priorities",
        cmd: "apt search <keyword> && apt show <pkg> && apt-cache policy <pkg>",
        details: "'apt-cache policy <pkg>' is the definitive command on Ubuntu to see which version is currently installed, what the candidate version is, and which repository (/etc/apt/sources.list.d/) is providing it at what pin priority (500, 990, etc.).",
        flags: [
          ["apt show", "Display package maintainer, version, dependencies, download size, and description"],
          ["apt-cache policy", "Show installed version, candidate version, and APT repository priority table"]
        ],
        subcommands: [
          ["grep -rhE '^deb |^Types:' /etc/apt/sources.list /etc/apt/sources.list.d/", "List all active APT package repositories and PPAs configured on the Ubuntu host"],
          ["apt download <pkg> && dpkg-deb -I <pkg>*.deb", "Download a .deb package to the current directory without installing it and inspect its control metadata"]
        ],
        tip: "Debugs version conflicts & PPAs",
        tags: ["apt", "search", "policy", "repo", "ppa", "version", "sources.list"]
      },
      {
        id: "dpkg-query-files",
        desc: "Query installed .deb packages, find which package owns a binary, or list all files inside a package",
        cmd: "dpkg -S $(which ss) && dpkg -L iproute2 && dpkg -l | grep -E '^ii|^rc'",
        details: "Directly queries the local dpkg database (/var/lib/dpkg/status) without network access. In 'dpkg -l', the first letter is desired state (i=install, r=remove) and the second letter is actual status (i=installed, c=config-files remaining, u=unpacked).",
        flags: [
          ["-S <path>", "Search which installed package owns a specific file path"],
          ["-L <pkg>", "List every file, binary, systemd unit, and manpage installed by <pkg>"],
          ["-l", "List installed packages (status 'ii' = cleanly installed, 'rc' = removed with leftover configs)"]
        ],
        subcommands: [
          ["apt-file update && apt-file search /usr/sbin/ipmitool", "Find which Ubuntu package provides a binary that is NOT yet installed on the system"],
          ["debsums -s", "Verify MD5 checksums of installed Ubuntu package files against dpkg metadata to detect corruption"]
        ],
        tags: ["dpkg", "deb", "owns", "files", "ubuntu", "apt-file"]
      },
      {
        id: "dpkg-fix-needrestart",
        desc: "Repair interrupted dpkg runs, fix broken APT dependencies, and check services/kernel pending restart",
        cmd: "dpkg --configure -a && apt --fix-broken install && needrestart -r l",
        details: "If an SSH session drops mid-upgrade, dpkg may be left with unpacked but unconfigured packages. Running 'dpkg --configure -a' followed by 'apt --fix-broken install' completes the transaction. Ubuntu's 'needrestart' detects which daemons are still using old shared libraries in RAM and whether a kernel reboot is pending.",
        flags: [
          ["--configure -a", "Configure all unpacked but unconfigured .deb packages"],
          ["--fix-broken", "Resolve and install missing dependencies to heal a broken package state"],
          ["needrestart -r l", "List (without restarting) services using outdated libs and check kernel ABI mismatch"]
        ],
        subcommands: [
          ["cat /var/run/reboot-required /var/run/reboot-required.pkgs 2>/dev/null", "Check if Ubuntu requires a system reboot after patching and see which packages triggered it"],
          ["lsof /var/lib/dpkg/lock-frontend /var/lib/apt/lists/lock", "Check if a background apt or unattended-upgrade process is currently holding the dpkg lock"]
        ],
        tip: "Checks /var/run/reboot-required",
        tags: ["dpkg", "broken", "lock", "repair", "needrestart", "reboot-required"]
      },
      {
        id: "snap-ubuntu-release",
        desc: "Check Ubuntu LTS release version, inspect kernel/driver ring buffer, and manage Snap packages",
        cmd: "lsb_release -a && hostnamectl && snap list",
        details: "Displays the Ubuntu distribution release (e.g., Ubuntu 24.04.1 LTS Noble Numbat), chassis type, machine ID, kernel release, and any installed Canonical Snap packages.",
        flags: [
          ["lsb_release -a", "Show Ubuntu Distributor ID, Description, Release number, and Codename"],
          ["hostnamectl", "Display static/transient hostname, chassis type, virtualization, OS, and kernel"],
          ["snap list", "List installed Snap packages, revisions, and publisher status"]
        ],
        subcommands: [
          ["pro status", "Check Ubuntu Pro subscription status (ESM security updates, Livepatch kernel patching)"],
          ["dmesg -T -w --level=err,warn", "Watch the kernel ring buffer live with human-readable timestamps for hardware/driver errors"]
        ],
        tags: ["snap", "ubuntu", "lsb_release", "hostnamectl", "dmesg", "livepatch"]
      }
    ]
  }
];

// State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("linux_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
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
    // Fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copied command to clipboard");
  }
}

// Lightweight shell syntax highlighter
function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Split by pipe or logical operators while keeping delimiters
  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) {
        return `<span class="tok-str">${strLiteral}</span>`;
      }
      if (flagPart) {
        return `<span class="tok-flag">${flagPart}</span>`;
      }
      if (operatorPart) {
        return `<span class="tok-pipe">${operatorPart}</span>`;
      }
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? `<span class="tok-pipe">${sudoPart}</span>` : "";
        return `${prefix}${sudoHtml}<span class="tok-cmd">${cmdName}</span>`;
      }
      return match;
    }
  );
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderCategoryTabs() {
  const totalCommands = CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of CHEAT_SHEET_DATA) {
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

  for (const section of CHEAT_SHEET_DATA) {
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

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }
}

// Chmod Calculator Logic
function initChmodCalculator() {
  const scopes = ["owner", "group", "other"];
  const octalEl = document.getElementById("chmod-octal");
  const symbolicEl = document.getElementById("chmod-symbolic");
  const copyBtn = document.getElementById("chmod-octal-copy");
  const presetBtns = document.querySelectorAll(".preset-btn");

  function updateFromCheckboxes() {
    let octalStr = "";
    let symStr = "-";

    scopes.forEach((scope) => {
      const container = document.querySelector(`.chmod-scope[data-scope="${scope}"]`);
      const r = container.querySelector('input[data-bit="4"]').checked ? 4 : 0;
      const w = container.querySelector('input[data-bit="2"]').checked ? 2 : 0;
      const x = container.querySelector('input[data-bit="1"]').checked ? 1 : 0;
      const sum = r + w + x;
      octalStr += String(sum);
      symStr += (r ? "r" : "-") + (w ? "w" : "-") + (x ? "x" : "-");
    });

    octalEl.textContent = octalStr;
    symbolicEl.textContent = symStr;

    presetBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.preset === octalStr);
    });
  }

  function applyOctalPreset(octal) {
    scopes.forEach((scope, idx) => {
      const digit = parseInt(octal[idx], 10) || 0;
      const container = document.querySelector(`.chmod-scope[data-scope="${scope}"]`);
      container.querySelector('input[data-bit="4"]').checked = Boolean(digit & 4);
      container.querySelector('input[data-bit="2"]').checked = Boolean(digit & 2);
      container.querySelector('input[data-bit="1"]').checked = Boolean(digit & 1);
    });
    updateFromCheckboxes();
  }

  document.querySelectorAll(".chmod-scope input[type='checkbox']").forEach((cb) => {
    cb.addEventListener("change", updateFromCheckboxes);
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      applyOctalPreset(btn.dataset.preset);
    });
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(`chmod ${octalEl.textContent} file`);
  });
}

// Mini Tabs inside Essentials Widget
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

// Event Listeners
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
      localStorage.setItem("linux_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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

  // Global keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
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

// Initialize App
function init() {
  applyTheme(state.theme);
  renderCategoryTabs();
  renderSections();
  initChmodCalculator();
  initMiniTabs();
  initEvents();
}

init();
