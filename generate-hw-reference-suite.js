// generate-hw-reference-suite.js
// Generates the "Rack & hardware reference" suite under the Hardware tab: power and PDUs,
// cooling, memory population, drive form factors, GPU form factors, rack units and labelling,
// plus the hw-reference.html hub. Each sheet pairs the reference numbers with the commands
// that read them off a live node.
//
// Facts checked 2026-11-07 (sources named in each card):
// - IEC 60320 ratings: C13/C14 10 A IEC / 15 A UL, C19/C20 16 A IEC / 20 A UL (Wikipedia,
//   citing UL/CSA 60320-1). NEC 210.20(A): continuous loads (3 h or more) need a breaker rated
//   125% of the load, which is why circuits are loaded to 80%.
// - ASHRAE TC 9.9 Thermal Guidelines 5th ed. (2021) reference card: recommended 18-27 °C for
//   A1-A4, A1 allowable 15-32 °C; liquid classes W17, W27, W32, W40, W45, W+.
// - Memory: AMD EPYC 9005 12 DDR5 channels, RDIMM up to 6400 MT/s, up to 2 DPC (Kingston);
//   HPE: the system runs all DIMMs at the highest common speed. Intel Xeon 6900P 12 channels,
//   DDR5-6400, MRDIMM 8800; 6700P 8 channels, MRDIMM 8000 (Kingston).
// - Drives: SNIA EDSFF form factor page (Oct 2026); U.3 = SFF-TA-1001 (tri-mode, 2017).
// - GPUs: NVIDIA DGX B200, HGX and GB200 NVL72 pages; H200 SXM up to 700 W and H200 NVL up to
//   600 W (NVIDIA datasheet figures quoted by resellers); 12V-2x6 600 W (PCIe CEM 5.1).
// - Racks: EIA-310 1U = 44.45 mm; OCP Open Rack V3 base spec (48 mm OpenU or 44.45 mm EIA,
//   48 V busbar); ANSI/TIA-606-D (Oct 2021).
// Menu logos: generic line icons; these are vendor-neutral reference sheets.
//
// Re-runnable like the other generators.
const { buildSuite } = require('./generate-suite-kit');

const icon = (d, color) => `<svg class="menu-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const LOGOS = {
  power: icon('<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>', '#facc15'),
  cooling: icon('<path d="M12 2v20M4.9 6l14.2 12M19.1 6L4.9 18"/><circle cx="12" cy="12" r="2.5"/>', '#38bdf8'),
  memory: icon('<rect x="2.5" y="7" width="19" height="9" rx="1"/><path d="M6 16v3M10 16v3M14 16v3M18 16v3M6 10h2M11 10h2M16 10h2"/>', '#4ade80'),
  drives: icon('<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 17h8M8 6.5h8"/>', '#a78bfa'),
  gpu: icon('<rect x="2.5" y="6" width="19" height="11" rx="1.5"/><circle cx="9" cy="11.5" r="2.5"/><path d="M15 9.5h3M15 13.5h3M6 17v2.5M10 17v2.5"/>', '#76b900'),
  rack: icon('<rect x="5" y="2.5" width="14" height="19" rx="1"/><path d="M5 7.5h14M5 12h14M5 16.5h14M8 5h.01M8 9.5h.01M8 14h.01"/>', '#fb923c')
};

const HW_SECTIONS = [
  {
    id: "power", group: "facility", file: "hw-power", badge: "power", code: "power",
    name: "Power & PDUs", navDesc: "cords, circuits, power budget", pill: "IEC 60320 · NEC 210.20",
    title: "Power: Cords, PDUs, Circuits and the Power Budget",
    subtitle: "C13/C19 ratings, the 80% rule, three-phase math, and reading real power draw from the BMC and GPUs",
    commands: [
      {
        id: "power-read-bmc",
        desc: "Real power draw from the BMC (DCMI)",
        cmd: "ipmitool -I lanplus -H $BMC -U $BMC_USER -E dcmi power reading",
        flags: [
          ["-E", "Password from the IPMI_PASSWORD environment variable, not the command line"],
          ["Instantaneous / Minimum / Maximum / Average", "Watts over the BMC's sampling period"],
          ["No DCMI?", "Read the PSU input-power sensors instead (next card)"],
          ["Budget with the maximum", "Size circuits from the peak, not the average"]
        ],
        subcommands: [
          ["ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type \"Power Supply\"", "PSU presence, failures and redundancy"],
          ["ipmitool -I lanplus -H $BMC -U $BMC_USER -E dcmi power get_limit", "Is a power cap set?"],
          ["nvidia-smi --query-gpu=index,power.draw,power.limit --format=csv", "Per-GPU draw against its limit"]
        ],
        tip: "Measure under real load; idle numbers hide the GPU peak",
        tags: ["power", "dcmi", "watts", "psu", "budget"]
      },
      {
        id: "power-cords",
        desc: "Cord and inlet ratings (IEC 60320)",
        cmd: "ipmitool -I lanplus -H $BMC -U $BMC_USER -E fru print | grep -iE 'power|psu'",
        flags: [
          ["C13 / C14", "10 A (IEC) / 15 A (UL). The usual server and switch PSU inlet"],
          ["C19 / C20", "16 A (IEC) / 20 A (UL, with 12 AWG cord). High-power PSUs and PDU outlets"],
          ["C14 vs C13", "C14 is the inlet (pins, on the PSU); C13 is the cord end"],
          ["Mixed cords", "A C13 cord on a C14-to-C19 adapter is still limited to the C13 rating"],
          ["GPU nodes", "Multi-kW PSUs are usually C19/C20, or busbar-fed in OCP racks"]
        ],
        subcommands: [],
        tip: "Read the PSU label: input current and connector are printed on it",
        tags: ["c13", "c19", "iec60320", "cord", "inlet"]
      },
      {
        id: "power-circuit",
        desc: "Circuit math: the 80% rule and three-phase power",
        cmd: "awk 'BEGIN{v=415; a=32; pf=0.95; kw=sqrt(3)*v*a*pf/1000; printf \"%.1f kW total, %.1f kW usable at 80%%\\n\", kw, kw*0.8}'",
        flags: [
          ["NEC 210.20(A)", "A continuous load (3 hours or more) needs a breaker rated 125% of it, so load circuits to 80%"],
          ["Single-phase", "kW = V × A × PF / 1000"],
          ["Three-phase", "kW = √3 × V(line-to-line) × A × PF / 1000; kVA is the same without PF"],
          ["PF", "Power factor: about 0.95-0.99 for modern server PSUs"],
          ["100%-rated breakers", "An exception exists only when the whole assembly is listed for 100%"]
        ],
        subcommands: [
          ["awk 'BEGIN{v=208; a=30; printf \"%.1f kW at 80%%\\n\", v*a*0.8/1000}'", "Single-phase 208 V / 30 A circuit"]
        ],
        tip: "Change v and a to your PDU's rating and predict the result before you run it",
        tags: ["nec", "80-percent", "three-phase", "kw", "circuit", "pdu"]
      },
      {
        id: "power-redundancy",
        desc: "PSU redundancy and A/B feeds",
        cmd: "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sel elist | grep -iE 'power supply|redundancy|ac lost'",
        flags: [
          ["A/B feeds", "Each PSU on a different PDU fed from a different upstream source"],
          ["N+1 / N+N", "Spare PSU / a full second set; N+N survives losing a whole feed"],
          ["Budget per feed", "With N+N, one feed must carry the whole node: size each PDU for it"],
          ["AC lost", "One PSU reporting AC lost: cord, PDU outlet or breaker first, PSU last"]
        ],
        subcommands: [
          ["ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type \"Power Supply\"", "Which PSU is unhappy"]
        ],
        tip: "Swap the cord to a known-good outlet before you RMA a PSU",
        tags: ["redundancy", "psu", "ab-feed", "pdu", "ac-lost"]
      }
    ],
    proTip: {
      desc: "GPU power at the card: the 12V-2x6 connector",
      cmd: "nvidia-smi -q -d POWER",
      details: "PCIe GPUs such as H200 NVL (up to 600 W) are fed by the 16-pin 12V-2x6 connector (PCIe CEM 5.1, marked H++), rated up to 600 W. Its sense pins only make contact when the plug is fully seated. A half-seated plug is a melting risk: push until it clicks and check that no gap shows. SXM GPUs (H200 SXM up to 700 W) are fed through the HGX baseboard.",
      flags: [["Power Limit / Max Power Limit", "What the GPU may draw"], ["Clocks Event Reasons", "Shows when power capping slows the GPU"]],
      tip: "Reseat 12V-2x6 plugs fully before blaming the GPU"
    }
  },
  {
    id: "cooling", group: "facility", file: "hw-cooling", badge: "cooling", code: "cooling",
    name: "Cooling", navDesc: "inlet temps, fans, liquid", pill: "ASHRAE TC 9.9 · 5th ed.",
    title: "Cooling: Inlet Temperatures, Fans and Liquid Cooling",
    subtitle: "ASHRAE ranges, reading inlet and GPU temperatures, fan failures, and the W classes for liquid-cooled racks",
    commands: [
      {
        id: "cooling-inlet",
        desc: "Inlet and component temperatures from the BMC",
        cmd: "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type Temperature",
        flags: [
          ["Inlet / Ambient", "The air entering the server: compare it with ASHRAE"],
          ["Recommended 18-27 °C", "ASHRAE recommended inlet range, classes A1-A4"],
          ["A1 allowable 15-32 °C", "Wider range the hardware tolerates; A2-A4 allow more"],
          ["Exhaust", "Usually 10-20 °C above inlet; a small difference with high fan speed points to blocked airflow"]
        ],
        subcommands: [
          ["ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type Fan", "Fan speeds and failed fans"],
          ["sensors", "On the host: CPU and board temperatures (lm-sensors)"]
        ],
        tip: "One hot node in a cold row is a node problem; a whole hot rack is a room problem",
        tags: ["temperature", "inlet", "ashrae", "sensors", "airflow"]
      },
      {
        id: "cooling-gpu",
        desc: "GPU temperatures and thermal slowdown",
        cmd: "nvidia-smi --query-gpu=index,temperature.gpu,temperature.memory,power.draw,clocks_event_reasons.active --format=csv",
        flags: [
          ["temperature.gpu / temperature.memory", "Core and HBM temperatures"],
          ["clocks_event_reasons.active", "Non-zero bits show why clocks dropped (thermal or power)"],
          ["nvidia-smi -q -d TEMPERATURE", "Slowdown and shutdown thresholds for this GPU"],
          ["One GPU hot", "Check its slot: airflow, blank panels, cold plate or fan module"]
        ],
        subcommands: [
          ["nvidia-smi -q -d TEMPERATURE", "Thresholds per GPU"],
          ["nvidia-smi -q -d PERFORMANCE", "Clock event reasons in words"]
        ],
        tip: "Compare the hot GPU with its neighbours in the same chassis",
        tags: ["gpu", "temperature", "throttle", "hbm", "thermal"]
      },
      {
        id: "cooling-airflow",
        desc: "Airflow checklist (physical)",
        cmd: "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sel elist | grep -iE 'fan|temp'",
        flags: [
          ["Blanking panels", "Every empty U in the rack, or hot exhaust loops back to the front"],
          ["Front-to-back", "All gear in a row pointing the same way (switches can be reversed)"],
          ["Cable bundles", "Behind the fans, they choke exhaust"],
          ["Fan module", "Reseat a fan that reads 0 RPM before replacing it"],
          ["Hot aisle / cold aisle", "Containment doors closed"]
        ],
        subcommands: [],
        tip: "Fix airflow before you change fan settings",
        tags: ["airflow", "fans", "blanking", "physical"]
      },
      {
        id: "cooling-liquid",
        desc: "Liquid cooling: ASHRAE W classes",
        cmd: "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr elist | grep -iE 'coolant|leak|flow|pump'",
        flags: [
          ["W17 / W27 / W32 / W40 / W45", "Facility supply-water temperature limits in °C (ASHRAE 5th ed., 2021)"],
          ["W+", "Supply water above 45 °C"],
          ["Rack-scale liquid", "GB200 / GB300 NVL72 racks are liquid-cooled"],
          ["Leak sensors", "Treat any leak event as critical: stop and escalate"],
          ["Sensor names", "Coolant, flow and leak sensors are vendor-specific: grep broadly"]
        ],
        subcommands: [],
        tip: "Never open a liquid loop without the facility team",
        tags: ["liquid", "w-class", "coolant", "leak", "nvl72"]
      }
    ],
    proTip: {
      desc: "Room vs node: a quick test",
      cmd: "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type Temperature | grep -i inlet",
      details: "Read the inlet sensor on the hot node and on two neighbours above and below it. Same inlet everywhere and only one node hot → that node (fans, heatsink, cold plate). Inlet high on all of them → the room or the rack (blanking, containment, CRAH). Put the numbers in the case.",
      flags: [["Neighbours", "Same rack, nodes above and below"], ["Record", "Time, inlet, exhaust, fan RPM"]],
      tip: "Numbers from neighbours settle the argument quickly"
    }
  },
  {
    id: "memory", group: "node", file: "hw-memory", badge: "memory", code: "dimms",
    name: "Memory population", navDesc: "channels, DPC, speeds", pill: "EPYC 9005 · Xeon 6",
    title: "Memory: Channels, DIMMs per Channel and Speeds",
    subtitle: "Read the DIMM layout, check speeds and balance, and know the channel counts of current server CPUs",
    commands: [
      {
        id: "mem-dmidecode",
        desc: "Every DIMM slot: populated, size, speed, part and serial",
        cmd: "sudo dmidecode -t memory | grep -E 'Locator|Size|Speed|Part Number|Serial Number'",
        flags: [
          ["Locator", "The silkscreen slot name, for example DIMM_A1: the physical slot to pull"],
          ["Bank Locator", "Socket / channel as the BIOS sees it"],
          ["Speed vs Configured Memory Speed", "What the DIMM supports vs what it runs at now"],
          ["Size: No Module Installed", "An empty slot"],
          ["Serial Number", "Goes in the RMA"]
        ],
        subcommands: [
          ["sudo dmidecode -t memory | grep -c 'Size: [0-9]'", "How many DIMMs are installed"],
          ["lsmem --summary", "Total online memory as Linux sees it"],
          ["numactl --hardware", "Memory per NUMA node: unequal nodes mean unbalanced DIMMs"]
        ],
        tip: "Compare installed DIMMs with the order: a missing DIMM shows as an empty Locator",
        tags: ["dimm", "dmidecode", "locator", "serial", "memory"]
      },
      {
        id: "mem-channels",
        desc: "Channels per socket on current CPUs",
        cmd: "lscpu | grep -E 'Model name|Socket|NUMA node\\(s\\)'",
        flags: [
          ["AMD EPYC 9005", "12 DDR5 channels per socket, RDIMM up to 6400 MT/s, up to 2 DIMMs per channel (24 per socket)"],
          ["Intel Xeon 6900P", "12 channels, DDR5-6400, MRDIMM up to 8800 MT/s"],
          ["Intel Xeon 6700P", "8 channels, DDR5-6400, MRDIMM up to 8000 MT/s"],
          ["Highest common speed", "The system runs every DIMM at the speed the slowest DIMM and the layout allow"],
          ["2 DPC", "Two DIMMs per channel usually lowers the speed; check the server's memory guide"]
        ],
        subcommands: [],
        tip: "One DIMM per channel on every channel is usually the fastest layout",
        tags: ["channels", "dpc", "epyc", "xeon", "ddr5", "mrdimm"]
      },
      {
        id: "mem-balance",
        desc: "Balanced population check",
        cmd: "sudo dmidecode -t memory | awk -F: '/Size:/{s=$2} /Bank Locator/{print $2 \" ->\" s}' | sort",
        flags: [
          ["Balanced", "Same number and size of DIMMs on every channel and both sockets"],
          ["Unbalanced", "Works, but bandwidth drops and one NUMA node has less memory"],
          ["Mixed part numbers", "Avoid: the system falls back to the slowest common timing"],
          ["After a swap", "Replacement DIMM: same part number, same slot"]
        ],
        subcommands: [
          ["numactl --hardware | grep size", "Memory per NUMA node"]
        ],
        tip: "Check balance after every DIMM replacement",
        tags: ["balance", "numa", "population", "dimm"]
      },
      {
        id: "mem-errors",
        desc: "Correctable errors per DIMM",
        cmd: "sudo edac-util -v",
        flags: [
          ["CE", "Correctable errors: count them over time"],
          ["UE", "Uncorrectable errors: the DIMM (or slot) goes on the RMA"],
          ["Map to slot", "Match the EDAC row/channel to the dmidecode Locator"],
          ["BMC SEL", "Also check ipmitool sel elist for memory events"]
        ],
        subcommands: [
          ["grep -r . /sys/devices/system/edac/mc/mc*/dimm*/dimm_label 2>/dev/null", "EDAC's slot labels"]
        ],
        tip: "The ECC sheet under Server internals goes deeper",
        tags: ["ecc", "edac", "errors", "rma"]
      }
    ],
    proTip: {
      desc: "Before you reseat or swap a DIMM",
      cmd: "sudo dmidecode -t memory > dimms-before.txt",
      details: "Save the DIMM table, note the slot from the Locator (not the Linux row number), drain the node and get approval to power off. After the swap, save dimms-after.txt and diff: same count, same Configured Memory Speed, and the new serial in the right slot.",
      flags: [["diff dimms-before.txt dimms-after.txt", "Proves the swap"], ["Locator", "Physical slot name"]],
      tip: "Before/after files go in the case folder"
    }
  },
  {
    id: "drives", group: "node", file: "hw-drives", badge: "drives", code: "U.2/E3.S",
    name: "Drive form factors", navDesc: "U.2, U.3, E1.S, E3.S", pill: "SNIA EDSFF · SFF-TA-1001",
    title: "Drive Form Factors: U.2, U.3 and EDSFF (E1.S, E1.L, E3.S, E3.L)",
    subtitle: "What fits which bay, tri-mode gotchas, and identifying the drive and its link from Linux",
    commands: [
      {
        id: "drives-identify",
        desc: "Which drives, which transport, which model",
        cmd: "lsblk -d -o NAME,TRAN,MODEL,SIZE,SERIAL",
        flags: [
          ["TRAN nvme / sas / sata", "The protocol the drive is using"],
          ["nvme list", "NVMe drives with model, serial and firmware"],
          ["SERIAL", "Match it to the bay label and the RMA"]
        ],
        subcommands: [
          ["sudo nvme list", "NVMe inventory"],
          ["sudo smartctl -i /dev/sda", "Model, form factor and rotation rate for SAS/SATA"]
        ],
        tip: "Map serial → bay before you pull anything",
        tags: ["nvme", "lsblk", "serial", "identify"]
      },
      {
        id: "drives-u2u3",
        desc: "U.2 vs U.3 (same connector, different wiring)",
        cmd: "sudo lspci -vv -s <bdf> | grep -E 'LnkCap|LnkSta'",
        flags: [
          ["U.2", "2.5\" NVMe on the SFF-8639 connector"],
          ["U.3", "SFF-TA-1001 (2017): tri-mode bays, one controller for NVMe, SAS and SATA"],
          ["U.3 drive in a U.2 bay", "Works: U.3 drives must be backward-compatible with U.2 hosts"],
          ["U.2 drive in a U.3-only bay", "Usually doesn't work: the lane pinout differs"],
          ["Same plug ≠ works", "The backplane and controller must support the protocol too"]
        ],
        subcommands: [
          ["sudo nvme list -v", "Which controller and path each NVMe drive is on"]
        ],
        tip: "Check the backplane's spec before ordering spares",
        tags: ["u.2", "u.3", "sff-8639", "tri-mode", "backplane"]
      },
      {
        id: "drives-edsff",
        desc: "EDSFF sizes (SNIA)",
        cmd: "sudo nvme id-ctrl /dev/nvme0 | grep -E '^(mn|sn|fr) '",
        flags: [
          ["E1.S", "SFF-TA-1006. 31.5-33.75 mm wide, about 111-119 mm long, thickness 5.9, 8, 9.5, 15 or 25 mm. Up to 20 W and x8 in the symmetric enclosure"],
          ["E1.L", "SFF-TA-1007. 38.4 mm × 318.75 mm, 9.5 or 18 mm thick: long ruler for density"],
          ["E3.S / E3.L", "SFF-TA-1008. 76 mm tall, 112.75 mm (S) or 142.2 mm (L) long, 7.5 mm or 16.8 mm (2T). Up to 70 W"],
          ["Connector", "SFF-TA-1002 edge connector across the family"],
          ["Thickness matters", "A 15 mm E1.S does not fit a 9.5 mm bay"]
        ],
        subcommands: [],
        tip: "Order spares by form factor and thickness, not just capacity",
        tags: ["edsff", "e1.s", "e3.s", "e1.l", "ruler"]
      },
      {
        id: "drives-link",
        desc: "Is the NVMe link at full width and speed?",
        cmd: "for d in /sys/class/nvme/nvme*; do echo \"$(basename $d): $(cat $d/device/current_link_width)x @ $(cat $d/device/current_link_speed)\"; done",
        flags: [
          ["current_link_width", "Expect 4 for U.2/U.3 and most E1.S/E3.S"],
          ["current_link_speed", "32.0 GT/s = PCIe 5, 16.0 GT/s = PCIe 4"],
          ["max_link_width / max_link_speed", "What it should be"],
          ["Degraded", "x2 or a lower speed: reseat the drive, then check the backplane cable"]
        ],
        subcommands: [],
        tip: "A degraded link is a physical problem until proven otherwise",
        tags: ["pcie", "link", "width", "speed", "degraded"]
      }
    ],
    proTip: {
      desc: "Find the bay before you pull",
      cmd: "sudo ledctl --listed-only locate=/dev/nvme0n1",
      details: "Light the bay LED (ledctl --listed-only locate=..., then locate_off=... to switch it off; without --listed-only ledctl turns off every other drive's LEDs, fault LEDs included) and match the serial on the drive label before pulling. The storage playbook (docs/playbooks/storage-jbod.md) covers SES slot mapping for JBODs.",
      flags: [["locate_off=", "Turn the LED off again"], ["Serial", "Always match it before pulling"]],
      tip: "Wrong-drive pulls in a degraded array lose data"
    }
  },
  {
    id: "gpuform", group: "node", file: "hw-gpu-forms", badge: "gpu", code: "SXM/PCIe",
    name: "GPU form factors", navDesc: "SXM, PCIe, NVL72", pill: "HGX · DGX · NVL72",
    title: "GPU Form Factors: SXM (HGX/DGX), PCIe and Rack-Scale NVL72",
    subtitle: "What each form factor means for power, NVLink and service, and how to tell them apart on a live node",
    commands: [
      {
        id: "gpu-forms-identify",
        desc: "Which GPUs, which bus IDs, which power limits",
        cmd: "nvidia-smi --query-gpu=index,name,pci.bus_id,power.limit,serial --format=csv",
        flags: [
          ["SXM", "Module on an HGX baseboard: NVLink through NVSwitch, power through the board"],
          ["PCIe", "Standard card in a slot, powered by 12V-2x6; NVLink only with a bridge (NVL variants)"],
          ["power.limit", "H200 SXM up to 700 W; H200 NVL (PCIe) up to 600 W"],
          ["serial", "Goes in the RMA, with the bus ID"]
        ],
        subcommands: [
          ["nvidia-smi topo -m", "How GPUs and NICs connect: NV# = NVLink, PIX/PXB/SYS = PCIe paths"],
          ["lspci -d 10de: -nn", "NVIDIA devices on the PCIe bus"]
        ],
        tip: "topo -m tells SXM (NV18 everywhere) from PCIe (PIX/SYS) at a glance",
        tags: ["sxm", "pcie", "hgx", "topology", "identify"]
      },
      {
        id: "gpu-forms-hgx",
        desc: "HGX / DGX 8-GPU systems",
        cmd: "nvidia-smi nvlink -s",
        flags: [
          ["HGX B200 / B300", "8 GPUs, NVLink 5: 1.8 TB/s per GPU, 14.4 TB/s total"],
          ["DGX B200", "8 Blackwell GPUs, 10 RU, about 14.3 kW max, 10-35 °C operating"],
          ["HGX Rubin NVL8", "NVLink 6: 3.6 TB/s per GPU"],
          ["Fabric Manager", "Must run, at the driver's exact version, before CUDA works on NVSwitch systems"],
          ["Service", "A failed SXM GPU usually means a baseboard-level RMA: collect nvidia-bug-report first"]
        ],
        subcommands: [
          ["systemctl status nvidia-fabricmanager --no-pager", "Fabric Manager state"]
        ],
        tip: "Inactive NVLinks on one GPU point at that module or its baseboard connector",
        tags: ["hgx", "dgx", "nvlink", "nvswitch", "b200", "b300"]
      },
      {
        id: "gpu-forms-nvl72",
        desc: "Rack-scale: GB200 / GB300 NVL72",
        cmd: "nvidia-smi -q | grep -iA3 fabric",
        flags: [
          ["GB200 NVL72", "36 Grace CPUs + 72 Blackwell GPUs in one NVLink domain (130 TB/s)"],
          ["GB300 NVL72", "72 Blackwell Ultra GPUs, fully liquid-cooled"],
          ["One rack = one system", "NVLink switch trays join compute trays; a tray fault affects the domain"],
          ["Liquid", "Coolant and leak alarms are part of triage (Cooling sheet)"]
        ],
        subcommands: [],
        tip: "On NVL72, check the NVLink switch trays before blaming one GPU",
        tags: ["nvl72", "gb200", "gb300", "rack-scale", "liquid"]
      }
    ],
    proTip: {
      desc: "Evidence first, then the RMA",
      cmd: "sudo nvidia-bug-report.sh",
      details: "Before any GPU swap, collect nvidia-bug-report (long-running), the SEL, and nvidia-smi -q. Record logical and physical IDs together: GPU index, UUID, bus ID and the SXM module or slot number. The NVIDIA DC suite and docs/playbooks/gpu-nvlink.md have the full flow.",
      flags: [["nvidia-smi -q", "Full GPU state"], ["UUID + BDF + slot", "Logical and physical IDs"]],
      tip: "Drain before nvidia-bug-report on a busy node"
    }
  },
  {
    id: "rack", group: "facility", file: "hw-rack", badge: "rack", code: "rack",
    name: "Racks & labelling", navDesc: "rack units, OCP, TIA-606", pill: "EIA-310 · ORv3 · TIA-606-D",
    title: "Racks and Labelling: Rack Units, Open Rack and TIA-606",
    subtitle: "Rack units, 19-inch vs 21-inch Open Rack, a labelling scheme, and finding a server's identity from the CLI",
    commands: [
      {
        id: "rack-identity",
        desc: "Who is this server? Serial, model and asset tag",
        cmd: "sudo dmidecode -s system-serial-number; sudo dmidecode -s system-product-name",
        flags: [
          ["system-serial-number", "Service tag / serial: the RMA key"],
          ["system-product-name", "Model"],
          ["chassis-asset-tag", "Your asset tag, if set"],
          ["ipmitool fru print 0", "Same data through the BMC, even with the OS down"]
        ],
        subcommands: [
          ["ipmitool -I lanplus -H $BMC -U $BMC_USER -E fru print 0", "FRU through the BMC"],
          ["ipmitool -I lanplus -H $BMC -U $BMC_USER -E chassis identify 60", "Blink the ID LED for 60 s to find it in the row"]
        ],
        tip: "Blink the ID LED before you touch a server in a full rack",
        tags: ["serial", "asset", "identify", "fru", "dmidecode"]
      },
      {
        id: "rack-units",
        desc: "Rack units and rack types",
        cmd: "awk 'BEGIN{u=42; printf \"%dU = %.1f mm = %.2f in\\n\", u, u*44.45, u*1.75}'",
        flags: [
          ["1U", "1.75 in = 44.45 mm (EIA-310)"],
          ["19-inch rack", "Mounting holes 465.14 mm apart, centre to centre"],
          ["42U", "The common full-height rack"],
          ["OCP Open Rack V3", "21-inch bay; supports 48 mm OpenU and 44.45 mm EIA units; 48 V busbar power"],
          ["Busbar", "ORv3 gear takes power from the rear busbar, not PDU cords"]
        ],
        subcommands: [],
        tip: "Count U from the bottom, the way the rack's numbering does",
        tags: ["rack-unit", "eia-310", "ocp", "open-rack", "busbar"]
      },
      {
        id: "rack-labels",
        desc: "A labelling scheme (TIA-606-D)",
        cmd: "printf '%s\\n' 'DC1-R12-U24' 'DC1-R12-U24-PSU1->PDU-R12-A-07' 'DC1-R12-U24-ib0->SW-R12-01:p17'",
        flags: [
          ["ANSI/TIA-606-D", "Current edition (Oct 2021) of the telecom administration (labelling) standard"],
          ["Classes 1-4", "Scaled to complexity: a single room up to a multi-site campus"],
          ["Both ends", "Every cable labelled at both ends with both endpoints"],
          ["Site-Row/Rack-U", "A sortable, unique ID for every position"]
        ],
        subcommands: [],
        tip: "If the label and the CMDB disagree, trust neither until you trace the cable",
        tags: ["labels", "tia-606", "cabling", "cmdb"]
      }
    ],
    proTip: {
      desc: "Physical location in the case notes",
      cmd: "echo \"$(hostname) serial=$(sudo dmidecode -s system-serial-number) rack=<row-rack> U=<u>\"",
      details: "Record logical and physical identity together in every case: hostname, serial, BMC address, row/rack/U, and the PDU outlets for each PSU. Field notes on the home page keep them per server.",
      flags: [["Serial + location", "Everything an on-site tech needs"], ["PDU outlets", "Per PSU"]],
      tip: "Replace the placeholders before you run it"
    }
  }
];

buildSuite({
  name: 'Rack & hardware reference', menuId: 'hwref-nav-dropdown', hubFile: 'hw-reference',
  hubLabel: 'Hardware Reference Hub', hubTitle: 'Rack & Hardware Reference Hub (power, cooling, memory, drives, GPUs, racks)',
  hubDocTitle: 'Rack & Hardware Reference: Power, Cooling, Memory, Drives, GPU Form Factors & Racks Hub',
  hubPill: 'Power · Cooling · DIMMs · Drives · GPUs · Racks',
  hubSubtitle: 'The numbers you need in front of a rack (power, cooling, DIMM layout, drive and GPU form factors, rack units, labels), with the commands that read them off a node',
  prompt: 'HW', cursor: '#', varPrefix: 'HWREF', tags: ['hardware', 'reference'],
  menuIcon: '<svg class="nav-logo" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="1"/><path d="M5 8h14M5 13.5h14" stroke="#fb923c"/><path d="M8 5.2h.01M8 10.7h.01M8 16.2h.01"/></svg>',
  logos: LOGOS, sections: HW_SECTIONS,
  groups: [{ key: 'facility', heading: 'Rack &amp; facility' }, { key: 'node', heading: 'In the node' }]
});
