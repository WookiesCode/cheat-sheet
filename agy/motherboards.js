const MOTHERBOARD_CHEAT_SHEET_DATA = [
  {
    id: "memory-post",
    badge: "MRC / RAM",
    title: "Memory (MRC) POST Codes — ASUS & GIGABYTE (50–55, B0–BF)",
    subtitle: "DDR4/DDR5 RDIMM detection, SPD read, rank training, channel population rules & fault isolation",
    commands: [
      {
        id: "post-50-55-memory-init",
        mode: "PEI / MRC HALT",
        modeClass: "mode-c",
        desc: "Decode AMI Aptio V memory initialization halt codes (`0x50`–`0x55`) on ASUS & GIGABYTE boards",
        cmd: "POST 0x53 (Invalid/Incompatible RAM)   |   POST 0x55 (Memory Not Installed / Unseated)",
        flags: [
          ["0x50 / 0x51", "Memory initialization error: Invalid memory type / incompatible speed (0x50) or SPD EEPROM read failure over I2C/I3C (0x51)"],
          ["0x52", "Memory initialization error: Invalid memory size or mismatched rank/capacity modules across symmetric channels"],
          ["0x53", "Memory initialization error: Memory modules detected, but no usable/compatible memory configured (mixing RDIMM & UDIMM/LRDIMM!)"],
          ["0x54", "Unspecified memory initialization error during early PEI MRC training"],
          ["0x55", "Memory Not Installed: Zero DIMMs detected on CPU0 primary channel (ASUS: A1; GIGABYTE: A0) or uneven CPU cooler torque"]
        ],
        tip: "0x55 = Check primary slot population (ASUS=A1, GIGABYTE=A0) & CPU socket pins!",
        tags: ["50", "51", "52", "53", "54", "55", "memory", "ram", "dimm", "rdimm", "mrc", "asus", "gigabyte"]
      },
      {
        id: "post-b0-bf-xeon-epyc-training",
        mode: "MRC TRAINING",
        modeClass: "mode-t",
        desc: "Decode Intel Xeon & AMD EPYC DDR4/DDR5 MRC channel training codes (`0xB0`–`0xBF`, `0x2C`–`0x2F`)",
        cmd: "POST 0xB0 (DIMM Detect)  ->  0xB4 (Rank/RCD)  ->  0xB7 (Channel Training Fail)  ->  0xBF (MRC Done)",
        flags: [
          ["0x2C / 0x2E / 0x2F", "Early PEI Memory detection (2C), configuring memory timings (2E), and memory initialization complete (2F)"],
          ["0xB0 / 0xB1", "Intel MRC: Detect presence of DIMMs via SPD (B0) and check DDR frequency/voltage compatibility (B1)"],
          ["0xB4 / 0xB6", "Registering Clock Driver (RCD) & Data Buffer initialization on DDR4/DDR5 RDIMMs/MRDIMMs"],
          ["0xB7 / 0xB8", "DDR channel training failure / marginal eye margin on a specific DIMM channel (check BMC SEL for exact failing DIMM slot label!)"],
          ["0xBA / 0xBC / 0xBF", "Memory BIST (Built-In Self Test) & Rank Margin Tool (RMT) validation; 0xBF = MRC memory init complete"]
        ],
        tip: "When stuck on 0xB7, check BMC Event Log (SEL) to see which exact DIMM slot failed!",
        tags: ["b0", "b1", "b4", "b7", "b8", "ba", "bf", "2c", "2e", "2f", "mrc", "training", "xeon", "epyc"]
      },
      {
        id: "asus-gigabyte-dimm-population",
        mode: "POPULATION RULES",
        modeClass: "mode-v",
        desc: "ASUS (K14/KRPA/Z13) vs GIGABYTE (MZ/MD/MS) server motherboard DIMM slot naming & population order",
        cmd: "1-DIMM Minimal Boot Test:  ASUS = CPU1_DIMM_A1   |   GIGABYTE = CPU0_DIMM_A0 (or DIMM_P0_A0)",
        flags: [
          ["ASUS Slot Naming", "ASUS server boards label channels A..L and slots 1..2: always populate Slot 1 (e.g. DIMM_A1, B1, C1...) first before Slot 2!"],
          ["GIGABYTE Slot Naming", "GIGABYTE server boards use 0-indexed labels (DIMM_P0_A0, B0, C0...): always populate Slot 0 (furthest from CPU in 2DPC) first!"],
          ["Never Mix RDIMM & LRDIMM", "Mixing Registered (RDIMM), Load-Reduced (LRDIMM/3DS), or Unbuffered (ECC UDIMM) on the same board halts at POST 0x53"],
          ["DDR5 PMIC Training", "First boot after swapping DDR5 RDIMMs on EPYC 9004/9005 or Xeon 4th/5th Gen takes 2–5 minutes at 0x2E/0xB4/0xEA — do not power-cycle early!"]
        ],
        tip: "Wait at least 4 minutes on first DDR5 boot before assuming a hang!",
        tags: ["population", "slots", "a1", "a0", "ddr5", "ddr4", "rdimm", "lrdimm", "asus", "gigabyte"]
      }
    ]
  },
  {
    id: "pcie-dxe-post",
    badge: "DXE / PCIe",
    title: "PCIe, GPU, Riser & Option ROM POST Codes (60–99, d2–d8)",
    subtitle: "DXE phase chipset init, PCIe bus enumeration (92/94/96), Above 4G BAR exhaustion & VGA/Console faults (d6/d7)",
    commands: [
      {
        id: "post-91-96-pcie-enumeration",
        mode: "PCIe / GPU HANG",
        modeClass: "mode-c",
        desc: "Decode PCIe bus, riser card, GPU, and NVMe enumeration hangs (`0x91`–`0x99`)",
        cmd: "POST 0x91 (PCIe Init)  ->  0x92 (Bridge/Riser Detect)  ->  0x94 (Bus Enumeration)  ->  0x96 (BAR Resources)",
        flags: [
          ["0x91", "PCI Bus Initialization is started: Root Complex beginning to probe CPU PCIe lanes"],
          ["0x92", "PCI Bus Bridge initialization: Hung here = faulty PCIe riser card, unseated MCIO/SlimSAS cable, or dead PCIe switch"],
          ["0x93", "PCI Bus Hot-Plug controller initialization"],
          ["0x94", "PCI Bus Enumeration: Probing all endpoints (GPUs, ConnectX NICs, U.2 NVMe). Hang at 0x94 = bad GPU/NIC or unseated riser"],
          ["0x95", "PCI Bus Request Resources: Calculating MMIO aperture requirements across all PCIe devices"],
          ["0x96", "PCI Bus Assign Resources: Out of 32-bit MMIO BAR space! Enable 'Above 4G Decoding' and set 'MMIO High Base / Size' in BIOS"]
        ],
        tip: "Hang at 0x94/0x96 after adding GPUs = Enable 'Above 4G Decoding' in BIOS!",
        tags: ["91", "92", "93", "94", "95", "96", "pcie", "gpu", "riser", "mcio", "slimsas", "above-4g", "bar"]
      },
      {
        id: "post-d0-d8-dxe-console-errors",
        mode: "DXE / VGA FAULT",
        modeClass: "mode-n",
        desc: "Decode DXE error codes (`0xd0`–`0xd8`), missing VGA/Console (`0xd6`), and Option ROM hangs (`0xB2`)",
        cmd: "POST 0xd6 (No Console Output / VGA)   |   POST 0xd7 (No Console Input)   |   POST 0xB2 (Legacy Option ROM)",
        flags: [
          ["0xd0 / 0xd1", "CPU initialization error (d0) or Northbridge / Root Complex initialization error (d1)"],
          ["0xd2 / 0xd4", "Southbridge / PCH initialization error (d2) or PCI resource allocation error — Out of Resources (d4)"],
          ["0xd6", "No Console Output Devices found: Onboard ASPEED AST2500/AST2600 VGA disabled via jumper (VGA_SW1) or discrete GPU missing 12VHPWR/8-pin power"],
          ["0xd7", "No Console Input Devices found: No USB keyboard or BMC virtual HID keyboard detected"],
          ["0xd8", "Invalid password or corrupted UEFI NVRAM variable state"],
          ["0xB2", "Legacy Option ROM Initialization: Hangs if an older RAID HBA/NIC tries to load a Legacy 16-bit OpROM when CSM is misconfigured"]
        ],
        tip: "Check onboard VGA_SW1 jumper on ASUS/GIGABYTE boards if halting at 0xd6!",
        tags: ["d0", "d1", "d2", "d4", "d6", "d7", "d8", "b2", "vga", "console", "option-rom", "ast2600"]
      },
      {
        id: "post-60-79-dxe-core-pch",
        mode: "DXE CHIPSET",
        modeClass: "mode-i",
        desc: "Decode DXE Core, NVRAM, Northbridge/UPI, and Southbridge/PCH codes (`0x60`–`0x79`)",
        cmd: "POST 0x60 (DXE Core)  ->  0x61 (NVRAM)  ->  0x68 (PCI Host Bridge)  ->  0x70 (Southbridge)  ->  0x79 (CSM)",
        flags: [
          ["0x60 / 0x61", "DXE Core started (60) and NVRAM initialization (61 — if stuck at 61, Clear CMOS or reflash corrupted BIOS NVRAM)"],
          ["0x62 / 0x63", "Installation of Southbridge Runtime Services (62) and CPU DXE initialization started (63)"],
          ["0x68 / 0x69", "PCI Host Bridge initialization (68) and Northbridge / Intel IOH / AMD IOD SMM initialization (69)"],
          ["0x70 / 0x71 / 0x72", "Southbridge DXE initialization started (70), Southbridge SMM initialization (71), and Southbridge devices init (72)"],
          ["0x78 / 0x79", "ACPI module initialization (78) and CSM (Compatibility Support Module) initialization (79 — often hangs if GPU vBIOS is corrupted)"]
        ],
        tip: "Stuck at 0x61 = corrupted UEFI NVRAM (use CLRTC / CLR_CMOS jumper)",
        tags: ["60", "61", "62", "63", "68", "69", "70", "78", "79", "dxe", "nvram", "cmos", "acpi", "csm"]
      }
    ]
  },
  {
    id: "storage-bds-post",
    badge: "BDS / BOOT",
    title: "Storage, USB, BIOS Setup & OS Handoff Codes (A0–DF, 00, AA)",
    subtitle: "SATA/NVMe detection (A0/A2), USB initialization (99/B4), BIOS Setup prompt (A9/AB) & OS boot handoff (AD/AA/00)",
    commands: [
      {
        id: "post-a0-a7-storage-usb",
        mode: "STORAGE / USB",
        modeClass: "mode-n",
        desc: "Decode SATA, SAS, M.2 NVMe, and USB bus initialization codes (`0x99`–`0xA7`, `0xB4`)",
        cmd: "POST 0x99 (Super IO)  ->  0x9C (USB Detect)  ->  0xA0 (IDE/AHCI Init)  ->  0xA2 (Drive Detect)  ->  0xB4 (USB Hotplug)",
        flags: [
          ["0x99 / 0x9A", "Super I/O initialization (99) and USB controller initialization started (9A)"],
          ["0x9C / 0x9D", "USB Detect (9C — probing USB ports, KVM dongles, and BMC Virtual Media) and USB Enable (9D)"],
          ["0xA0 / 0xA1", "IDE / SATA AHCI controller initialization started (A0) and reset (A1)"],
          ["0xA2 / 0xA3", "IDE / SATA / M.2 Drive Detect (A2) and Enable (A3): Hang at 0xA2 = dead SATA DOM, failing M.2 SSD, or bad backplane SATA cable!"],
          ["0xA4 / 0xA5 / 0xA6", "SCSI / SAS / NVMe backplane bus initialization (A4), reset (A5), and detect (A6)"],
          ["0xB4", "USB Hot-Plug: Frequent pause point when a faulty USB flash drive or corrupted BMC Virtual Media ISO is mounted"]
        ],
        tip: "Stuck on 0xA2 = unplug SATA/M.2 drives one by one to find the bad drive!",
        tags: ["99", "9c", "a0", "a1", "a2", "a3", "a4", "a6", "b4", "sata", "nvme", "usb", "virtual-media"]
      },
      {
        id: "post-a9-ae-boot-handoff",
        mode: "BOOT HANDOFF",
        modeClass: "mode-v",
        desc: "Decode UEFI Setup entry, PXE/NVMe boot selection, and OS handoff codes (`0xA9`–`0xAE`, `0xAA`, `0x00`)",
        cmd: "POST 0xA9 (Start Setup)  ->  0xAB (Setup Input Wait)  ->  0xAD (Ready To Boot)  ->  0xAA / 0x00 (OS Running)",
        flags: [
          ["0xA9 / 0xAB", "Start of Setup (A9) and Setup Input Wait (AB): The server is NOT hung — it is sitting inside BIOS Setup or waiting for F1 on VGA/SOL!"],
          ["0xAC", "Reserved for ASL / Entering UEFI Shell or boot menu selection"],
          ["0xAD", "Ready To Boot Event: UEFI POST is 100% finished and handing control to GRUB / Linux EFI stub / PXE NBP"],
          ["0xAE", "Legacy Boot Event: Handing control to a legacy MBR bootloader"],
          ["0xAA / 0xA0 (Normal Run)", "System has transitioned into ACPI APIC mode — OS is booted and running normally (ASUS Q-Code often rests on AA or A0 in Ubuntu)"],
          ["0x00 / 0xFF (At Power-On)", "If stuck on 0x00 or 0xFF the instant power is pressed: CPU not executing reset vector (check 8-pin EPS12V cables, CPU VRMs, or BIOS flash)"]
        ],
        tip: "0xAB means the board is waiting at the BIOS prompt (connect BMC KVM/SOL)!",
        tags: ["a9", "ab", "ac", "ad", "ae", "aa", "00", "ff", "bios", "setup", "grub", "boot", "acpi"]
      }
    ]
  },
  {
    id: "amd-epyc-agesa",
    badge: "EPYC CPU",
    title: "AMD EPYC CPU (AGESA ABL & PSP) POST Codes (E0–FF, D0–DF)",
    subtitle: "GIGABYTE (MZ32/MZ33/MZ73/G-Series) & ASUS (K14/KRPA/KNPA) SP3/SP5 EPYC CPU 2-stage POST & ABL fault codes",
    commands: [
      {
        id: "epyc-2stage-abl-post",
        mode: "AGESA / ABL",
        modeClass: "mode-t",
        desc: "Understand the 2-Stage POST sequence on GIGABYTE & ASUS AMD EPYC (Rome/Milan/Genoa/Turin) boards",
        cmd: "Stage 1: AMD PSP & AGESA BootLoader (0xE0..0xFF / 0xD0..0xDF)   -->   Stage 2: AMI Aptio V UEFI (0x10..0xAD)",
        flags: [
          ["Why codes cycle E0–FF first", "On AMD EPYC (SP3/SP5), the integrated Platform Security Processor (PSP) and AGESA BootLoader (ABL) initialize Infinity Fabric and DDR4/DDR5 BEFORE x86 cores start AMI UEFI!"],
          ["0xE0 / 0xE1 / 0xE2", "ABL0/ABL1: Early processor & memory parameter initialization and SPD readout across all 8 or 12 memory channels"],
          ["0xE6 / 0xE7 / 0xE8", "ABL2/ABL3: PMU (PHY Microcontroller Unit) DDR4/DDR5 training across populated DIMM channels"],
          ["0xEA / 0xEB / 0xED", "ABL Memory Training Error: PMU failed to train a DDR4/DDR5 channel (reseat DIMMs, check CPU socket torque of 12.0–13.5 in-lbs on Torx T20)"],
          ["0xEE / 0xEF", "ABL Stage complete — releasing x86 Zen cores from reset to begin AMI Aptio V SEC/PEI (0x10+)"]
        ],
        tip: "EPYC SP3/SP5 sockets are extremely torque-sensitive: uneven Torx T20 screws cause 0xEA/0x55!",
        tags: ["epyc", "amd", "agesa", "abl", "psp", "e0", "e1", "e6", "ea", "eb", "ee", "sp3", "sp5", "genoa", "turin"]
      },
      {
        id: "epyc-xgmi-dual-socket",
        mode: "DUAL-SOCKET xGMI",
        modeClass: "mode-c",
        desc: "Diagnose Dual-Socket (2P) AMD EPYC Infinity Fabric (xGMI) & Intel Xeon UPI link training hangs",
        cmd: "POST 0xE3 / 0xE4 (EPYC xGMI Link Training)   |   POST 0x19 / 0x2A / 0x3B (Intel Xeon UPI Init)",
        flags: [
          ["0xE3 / 0xE4 (AMD EPYC 2P)", "xGMI (External Global Memory Interconnect) inter-socket link training between CPU0 (P0) and CPU1 (P1)"],
          ["Socket 1 (P1) Fault Isolation", "On GIGABYTE MZ72/MZ73 & ASUS KRPA-U16/K14PA: if 2P board halts on 0xE4 or 0xB7, check BMC SEL to see if error is on P0 (Socket 0) or P1 (Socket 1)"],
          ["Mixed Stepping / AGESA Mismatch", "Installing an EPYC 9005 (Turin) or 9004 (Genoa) CPU on a board with older BIOS halts immediately at 0x00 / 0xD0 / 0xE0 — update BIOS via BMC first!"]
        ],
        tip: "You can flash BIOS via ASUS ASMB11 or GIGABYTE GSM BMC even without a supported CPU installed!",
        tags: ["xgmi", "upi", "2p", "dual-socket", "e3", "e4", "mz73", "k14", "krpa"]
      }
    ]
  },
  {
    id: "asus-server-board",
    badge: "ASUS SERVER",
    title: "ASUS Server Boards (ASMB10 / ASMB11 BMC, Q-Code & Jumpers)",
    subtitle: "ASUS K14 / KRPA / KNPA / Z12 / Z13 / Pro WS / ESC8000 / RS720 Q-Codes, onboard LEDs & remote BMC POST queries",
    commands: [
      {
        id: "asus-asmb-redfish-post",
        mode: "ASUS BMC (IPv6)",
        modeClass: "mode-i",
        desc: "Query live & historical POST codes remotely from an ASUS ASMB10 / ASMB11 (ASPEED AST2600) BMC over IPv6",
        cmd: "curl -g -6 -sk -u admin:'<Pass>' \"https://[2001:db8:dc:4::50]/redfish/v1/Systems/Self\" | jq '{PowerState, Status, BootProgress}'",
        flags: [
          ["Systems/Self", "ASUS ASMB10/ASMB11 (AMI MegaRAC SP-X) uses 'Systems/Self' as the primary ComputerSystem Redfish resource URI"],
          ["BootProgress.LastState", "Reports current UEFI boot stage (OSRunning, PCIResourceConfigStarted, PrimaryProcessorInitializationStarted, etc.)"],
          ["Web UI Path", "In ASUS ASMB10/ASMB11 Web GUI: navigate to 'Logs & Reports -> POST Code Log' to view Current vs Previous boot 0x80 hex codes with timestamps"]
        ],
        tip: "ASUS ASMB11 Web GUI records the exact millisecond each 0x80 hex code changed!",
        tags: ["asus", "asmb10", "asmb11", "redfish", "ipv6", "post", "qcode", "megarac"]
      },
      {
        id: "asus-onboard-leds-jumpers",
        mode: "ASUS HARDWARE",
        modeClass: "mode-n",
        desc: "ASUS server motherboard onboard diagnostic LEDs (`BMC_LED1`, `CATERR_LED1`, `Q-LED`) and recovery jumpers",
        cmd: "BMC_LED1 (Blinking Green = ASMB Ready)   |   CATERR_LED1 (Solid Red = CPU IERR/MCERR)   |   CLRTC1 (Clear CMOS)",
        flags: [
          ["Q-Code LED (80 Port)", "2-digit 7-segment display on the motherboard edge showing live Port 0x80 hex POST code (switches to AA/A0 or CPU temp once booted)"],
          ["BMC_LED1 (Heartbeat)", "Blinks green at 1 Hz when ASMB9/10/11 BMC firmware is booted. Do NOT press chassis power until BMC_LED1 is blinking!"],
          ["CATERR_LED1 (Red)", "Catastrophic Error LED: illuminates red if CPU asserts IERR/MCERR due to fatal uncorrectable PCIe AER or CPU core fault"],
          ["Q-LEDs (Pro WS boards)", "4-LED cluster near 24-pin ATX: CPU (Red), DRAM (Yellow/Amber), VGA (White), BOOT (Yellow-Green) — stays lit on the failing component!"],
          ["CLRTC1 /VGA_SW1", "CLRTC1 (short pins 2-3 for 10s with AC unplugged to Clear CMOS); VGA_SW1 (enables/disables onboard ASPEED VGA)"]
        ],
        tip: "Wait ~60s after plugging in AC power for BMC_LED1 to blink green before powering on!",
        tags: ["asus", "bmc_led1", "caterr", "q-led", "clrtc1", "vga_sw1", "jumper", "cmos"]
      }
    ]
  },
  {
    id: "gigabyte-server-board",
    badge: "GIGABYTE",
    title: "GIGABYTE Server Boards (GSM / AST2600 BMC, Dual-BIOS & Jumpers)",
    subtitle: "GIGABYTE MZ32 / MZ33 / MZ72 / MZ73 / MD72 / MS73 / G292 / G492 / G593 POST snooping, LEDs & DIP switches",
    commands: [
      {
        id: "gigabyte-bmc-post-snooping",
        mode: "GIGABYTE BMC",
        modeClass: "mode-i",
        desc: "Query GIGABYTE Server Management (GSM / MegaRAC) BMC POST Snooping code over IPv6 Redfish or IPMI",
        cmd: "curl -g -6 -sk -u admin:'<Pass>' \"https://[2001:db8:dc:4::50]/redfish/v1/Systems/Self\" | jq '{PowerState, BootProgress}'",
        flags: [
          ["Web UI POST Snooping", "In GIGABYTE BMC Web UI: go to 'System -> POST Codes' (or 'Logs -> POST Code') to see the full sequence of Current & Previous Boot 0x80 hex codes"],
          ["ipmitool raw 0x3c", "On GIGABYTE AST2500/AST2600 boards, BMC snoopsLPC/eSPI port 0x80 and logs every checkpoint transition"],
          ["Default GIGABYTE BMC Login", "Older boards: admin / password; Newer AST2600 boards: admin / <8-char unique password printed on motherboard CPU socket cover or chassis pull-tab>"]
        ],
        tip: "Newer GIGABYTE boards print the unique default BMC password on the serial sticker!",
        tags: ["gigabyte", "gsm", "bmc", "post", "snooping", "redfish", "ipv6", "mz73", "ms73", "g492"]
      },
      {
        id: "gigabyte-leds-switches-jumpers",
        mode: "GIGABYTE HW",
        modeClass: "mode-v",
        desc: "GIGABYTE server motherboard status LEDs (`BMC_RDY`, `CPU_ERR`), Dual-BIOS switches & CMOS jumpers",
        cmd: "BMC_RDY LED (Blinking Green)   |   SW_BIOS / BIOS_SW (Dual-BIOS ROM Select)   |   CLR_CMOS (Pins 1-2 Short)",
        flags: [
          ["BMC_RDY LED", "Blinks green when AST2500/AST2600 BMC is initialized. On many GIGABYTE G-series/R-series servers, power button is locked out until BMC_RDY blinks!"],
          ["SW_BIOS / SPI_SEL", "Hardware DIP switch or jumper to flip from primary BIOS SPI flash chip (BIOS1) to backup recovery SPI chip (BIOS2) if stuck at POST 0x00/0xFF"],
          ["CLR_CMOS / BAT", "Short CLR_CMOS jumper for 10 seconds (with standby power off) to reset NVRAM settings if stuck at POST 0x61 or 0x94"],
          ["SYS_ERR / ID_LED", "Front/Rear Blue UID LED (chassis identify) and Amber System Fault LED (triggered by PSU fault, fan fail, ECC uncorrectable, or thermal trip)"]
        ],
        tip: "If a GIGABYTE board won't POST after a failed BIOS flash, flip SW_BIOS to the backup ROM!",
        tags: ["gigabyte", "bmc_rdy", "sw_bios", "dual-bios", "clr_cmos", "jumper", "dip-switch"]
      }
    ]
  },
  {
    id: "inband-board-audit",
    badge: "LINUX / DMI",
    title: "Ubuntu In-Band Motherboard, BIOS & ACPI BERT Error Audit",
    subtitle: "Inspecting ASUS/GIGABYTE board model, PCB revision, BIOS date, slot mapping & previous-boot hardware crash tables",
    commands: [
      {
        id: "sysfs-board-identity",
        mode: "SYSFS / DMI",
        modeClass: "mode-i",
        desc: "Read exact ASUS or GIGABYTE motherboard vendor, model, PCB revision & BIOS version without root",
        cmd: "head -n 1 /sys/class/dmi/id/{board_vendor,board_name,board_version,board_serial,bios_vendor,bios_version,bios_date}",
        flags: [
          ["board_vendor", "Prints 'ASUSTeK COMPUTER INC.' or 'GigaByte Technology Co., Ltd.'"],
          ["board_name", "Prints exact server motherboard model (e.g. 'K14PA-U12', 'KRPA-U16', 'Z13PE-D16', 'MZ73-LM0-000', 'MS73-HB0-000')"],
          ["bios_version / bios_date", "Prints active UEFI BIOS version string and release date for checking against vendor QVL/support matrix"]
        ],
        tip: "Works instantly as a non-root user via /sys/class/dmi/id/",
        tags: ["sysfs", "dmi", "board_name", "bios_version", "asus", "gigabyte", "model"]
      },
      {
        id: "acpi-bert-einj-firmware",
        mode: "ACPI / UEFI",
        modeClass: "mode-t",
        desc: "Inspect ACPI BERT (Boot Error Record Table) after a fatal motherboard reset & check UEFI capsule status",
        cmd: "dmesg | grep -iE 'BERT|GHES|Hardware Error|APEI|AER'   &&   ls -lh /sys/firmware/acpi/tables/BERT 2>/dev/null",
        flags: [
          ["ACPI BERT", "Boot Error Record Table: When an ASUS or GIGABYTE board suffers a fatal CPU/PCIe reset, BIOS saves the crash registers in NVRAM and exposes them to Linux on the next boot via BERT!"],
          ["APEI / GHES", "ACPI Platform Error Interface / Generic Hardware Error Source: decodes physical DIMM rank, PCIe BDF, or CPU APIC ID that caused the crash"],
          ["fwupdmgr get-devices", "Inspect UEFI System Firmware (ESRT) capsule update support and current motherboard/device firmware versions"]
        ],
        tip: "ACPI BERT in dmesg tells you why the motherboard crashed on the PREVIOUS boot!",
        tags: ["bert", "apei", "ghes", "acpi", "crash", "reboot", "hardware-error", "fwupdmgr"]
      },
      {
        id: "ai-server-bios-checklist",
        mode: "AI BIOS CHECKLIST",
        modeClass: "mode-c",
        desc: "Mandatory BIOS settings on ASUS (ESC N8 / ESC8000 / K14 / Z13) & GIGABYTE (G593 / G493 / MZ / MS) 8-GPU AI servers",
        cmd: "Above 4G Decoding = Enabled  |  MMIO High Base = 56T  |  ACS = Disabled  |  IOMMU = Disabled (or iommu=pt)",
        flags: [
          ["Above 4G Decoding & Re-Size BAR", "MUST be Enabled so BIOS can map 8x H100 (80GB) / H200 (141GB) / B200 BAR1 apertures without halting at POST 0x94/0x96/0xd4"],
          ["MMIO High Base / Size", "Set MMIO High Base = 56T (or 64T) and MMIO High Granularity Size = 1024G for 8-GPU SXM/PCIe nodes"],
          ["ACS (Access Control Services)", "Set ACS Control = Disabled in BIOS so GPUDirect RDMA & P2P stay on PCIe switches instead of bottlenecking through the CPU"],
          ["CPU Power / C-States", "Set Power Profile = Performance, Package C-State = C0/C1, and DF C-States = Disabled to prevent NCCL latency jitter"]
        ],
        tip: "After clearing CMOS or flashing BIOS, re-verify Above 4G, MMIO 56T & ACS Disabled!",
        tags: ["bios", "above-4g", "mmio", "acs", "iommu", "resize-bar", "hgx", "asus", "gigabyte"]
      }
    ]
  }
];

// Comprehensive 2-Digit Hex POST Code Dictionary for Interactive Lookup
const POST_CODE_DICTIONARY = {
  "00": {
    phase: "NO EXECUTION / OR OS RUNNING",
    color: "var(--accent-danger)",
    meaning: "0x00 — At Power-On: CPU not executing reset vector. After Boot: System in ACPI OS runtime mode.",
    action: "If stuck at 0x00 immediately on power-up: check 8-pin EPS12V CPU power cables, reseat CPU (check LGA socket pins & Torx torque), or switch Dual-BIOS jumper if SPI flash is corrupted."
  },
  "10": {
    phase: "PEI CORE / CPU INIT",
    color: "var(--accent-primary)",
    meaning: "0x10 — PEI Core is started: Early CPU microcode & Cache-as-RAM (CAR) initialization.",
    action: "If hung at 0x10–0x18: CPU microcode or BIOS does not support installed CPU stepping. Flash latest ASUS/GIGABYTE BIOS via BMC."
  },
  "15": {
    phase: "PEI NORTHBRIDGE INIT",
    color: "var(--accent-primary)",
    meaning: "0x15 — Pre-memory Northbridge / CPU Root Complex initialization is started.",
    action: "Check CPU socket seating and verify both CPUs match stepping on dual-socket (2P) ASUS/GIGABYTE boards."
  },
  "19": {
    phase: "PEI SOUTHBRIDGE / UPI INIT",
    color: "var(--accent-primary)",
    meaning: "0x19 — Pre-memory Southbridge / PCH or Intel Xeon UPI inter-socket link initialization.",
    action: "On 2P Xeon boards, reseat CPU1 or test booting with CPU0 only to isolate a bad socket or PCH fault."
  },
  "2C": {
    phase: "PEI MEMORY DETECT",
    color: "var(--accent-warning)",
    meaning: "0x2C — Memory initialization: Detecting presence of DDR4/DDR5 DIMMs via SPD.",
    action: "Verify DIMMs are populated in the primary channels (ASUS: A1; GIGABYTE: A0) and match board QVL."
  },
  "2E": {
    phase: "PEI MEMORY TIMINGS",
    color: "var(--accent-warning)",
    meaning: "0x2E — Configuring memory timings and programming memory controller registers.",
    action: "Normal to pause here for 1–3 minutes during DDR5 first-boot training. If permanently hung, test 1 DIMM in primary slot."
  },
  "2F": {
    phase: "PEI MEMORY COMPLETE",
    color: "var(--accent-primary)",
    meaning: "0x2F — Memory initialization complete; transitioning from Cache-as-RAM to main DRAM.",
    action: "If hung at 0x2F, reseat CPU0 primary DIMM or swap with a known-good RDIMM."
  },
  "50": {
    phase: "PEI / MRC MEMORY FAULT (HALT)",
    color: "var(--accent-danger)",
    meaning: "0x50 — Memory initialization error: Invalid memory type or incompatible memory speed.",
    action: "Ensure you are using Server ECC RDIMMs (or LRDIMMs) supported by the CPU — desktop non-ECC UDIMMs will halt at 0x50/0x53!"
  },
  "51": {
    phase: "PEI / MRC MEMORY FAULT (HALT)",
    color: "var(--accent-danger)",
    meaning: "0x51 — Memory initialization error: SPD EEPROM reading has failed over SMBus/I3C.",
    action: "Inspect DIMM gold fingers for debris/damage and reseat DIMMs; a faulty DIMM PMIC/SPD chip can block the I2C/I3C bus."
  },
  "52": {
    phase: "PEI / MRC MEMORY FAULT (HALT)",
    color: "var(--accent-danger)",
    meaning: "0x52 — Memory initialization error: Invalid memory size or mismatched rank symmetry.",
    action: "Verify all populated channels have identical rank counts and capacities according to the ASUS/GIGABYTE silkscreen table."
  },
  "53": {
    phase: "PEI / MRC MEMORY FAULT (HALT)",
    color: "var(--accent-danger)",
    meaning: "0x53 — Memory initialization error: DIMMs detected, but no usable/compatible memory configured.",
    action: "Never mix RDIMMs and LRDIMMs/UDIMMs on the same board! Test with a single known-good RDIMM in slot A1 (ASUS) or A0 (GIGABYTE)."
  },
  "55": {
    phase: "PEI / MRC MEMORY FAULT (HALT)",
    color: "var(--accent-danger)",
    meaning: "0x55 — Memory Not Installed: No DDR4/DDR5 RDIMM detected in primary channels.",
    action: "Verify DDR4/DDR5 RDIMMs are fully latched in the primary slots first (ASUS: A1/B1; GIGABYTE: A0/B0). If populated, reseat DIMMs and inspect CPU socket LGA pins/heatsink torque."
  },
  "60": {
    phase: "DXE CORE STARTED",
    color: "var(--accent-primary)",
    meaning: "0x60 — DXE Core is started: Main memory is active; loading UEFI Driver Execution Environment.",
    action: "Normal progression milestone indicating RAM passed MRC training."
  },
  "61": {
    phase: "DXE NVRAM INIT",
    color: "var(--accent-warning)",
    meaning: "0x61 — NVRAM Initialization: Reading/verifying UEFI variables in SPI flash.",
    action: "If hung at 0x61: UEFI NVRAM is corrupted. Power off AC, short CLRTC1 / CLR_CMOS jumper for 10 seconds, and reboot."
  },
  "68": {
    phase: "DXE PCI HOST BRIDGE",
    color: "var(--accent-primary)",
    meaning: "0x68 — PCI Host Bridge initialization started (CPU PCIe Root Complex).",
    action: "If hung at 0x68/0x69: check CPU seating or remove newly added PCIe cards/risers to isolate a shorted PCIe lane."
  },
  "70": {
    phase: "DXE SOUTHBRIDGE INIT",
    color: "var(--accent-primary)",
    meaning: "0x70 — Southbridge / PCH DXE initialization is started.",
    action: "If hung at 0x70–0x72: disconnect internal USB headers, SATA cables, and M.2 drives to isolate a Southbridge bus hang."
  },
  "78": {
    phase: "DXE ACPI INIT",
    color: "var(--accent-primary)",
    meaning: "0x78 — ACPI module initialization (building DSDT, SSDT, SRAT, SLIT tables).",
    action: "If hung at 0x78: Clear CMOS or update BIOS."
  },
  "79": {
    phase: "DXE CSM INIT",
    color: "var(--accent-warning)",
    meaning: "0x79 — CSM (Compatibility Support Module) initialization.",
    action: "If hung at 0x79: an expansion card's Option ROM or GPU vBIOS is hanging CSM. Clear CMOS or disable CSM (pure UEFI mode)."
  },
  "91": {
    phase: "DXE PCIe BUS INIT",
    color: "var(--accent-warning)",
    meaning: "0x91 — PCI Bus Initialization is started.",
    action: "Check PCIe risers and MCIO/SlimSAS high-speed cables if the board halts here."
  },
  "92": {
    phase: "DXE PCIe BRIDGE HANG",
    color: "var(--accent-danger)",
    meaning: "0x92 — PCI Bus Bridge initialization: Probing PCIe switches, risers, and root ports.",
    action: "Hung at 0x92 = unseated PCIe riser card, loose MCIO/OCuLink cable, or faulty PCIe switch/retimer card. Reseat risers one by one."
  },
  "94": {
    phase: "DXE PCIe ENUMERATION HANG",
    color: "var(--accent-danger)",
    meaning: "0x94 — PCI Bus Enumeration: Scanning all GPUs, NICs, RAID HBAs, and NVMe drives on the PCIe bus.",
    action: "Hung at 0x94 = faulty GPU/NIC/NVMe endpoint or PCIe bifurcation mismatch. Pull add-in cards or check Auxiliary 12V/12VHPWR GPU power cables!"
  },
  "95": {
    phase: "DXE PCIe RESOURCES",
    color: "var(--accent-warning)",
    meaning: "0x95 — PCI Bus Request Resources: Calculating MMIO BAR space required by all PCIe devices.",
    action: "If followed by a hang at 0x95/0x96/0xd4, enable 'Above 4G Decoding' in BIOS Setup."
  },
  "96": {
    phase: "DXE PCIe BAR ALLOCATION",
    color: "var(--accent-danger)",
    meaning: "0x96 — PCI Bus Assign Resources: Allocating 32-bit/64-bit MMIO BAR addresses to GPUs & NICs.",
    action: "Multi-GPU / High-BAR hang! Boot with 1 GPU, enter BIOS, enable 'Above 4G Decoding', set 'MMIO High Base = 56T/64T', and disable Legacy OpROMs."
  },
  "99": {
    phase: "BDS SUPER I/O INIT",
    color: "var(--accent-primary)",
    meaning: "0x99 — Super I/O Initialization (serial ports, UART, chassis intrusion,LPC/eSPI bridge).",
    action: "If hung at 0x99, unplug external RS-232 serial cables or front-panel headers and Clear CMOS."
  },
  "9C": {
    phase: "BDS USB DETECT",
    color: "var(--accent-warning)",
    meaning: "0x9C — USB Detect: Probing physical USB ports, crash-cart KVMs, and BMC Virtual Media.",
    action: "If hung at 0x9C: unplug USB flash drives / KVMs and unmount any stale Virtual Media ISO in the ASUS/GIGABYTE BMC Web UI."
  },
  "A0": {
    phase: "BDS SATA INIT / OR OS RUNNING",
    color: "var(--accent-primary)",
    meaning: "0xA0 — During POST: IDE/SATA AHCI initialization. After Boot (on ASUS): ACPI OS Running state.",
    action: "If the OS is already running, 0xA0 is normal! If stuck during POST before video, disconnect SATA cables."
  },
  "A2": {
    phase: "BDS DRIVE DETECT HANG",
    color: "var(--accent-danger)",
    meaning: "0xA2 — IDE / SATA / M.2 Drive Detect: Probing attached storage drives and reading SMART/partition headers.",
    action: "Classic storage hang! A dead SATA DOM, failing M.2 boot SSD, or corrupted drive is locking the bus. Unplug storage drives to isolate."
  },
  "A9": {
    phase: "BDS BIOS SETUP",
    color: "var(--accent-primary)",
    meaning: "0xA9 — Start of Setup: Entering UEFI BIOS Setup utility.",
    action: "Board is entering BIOS Setup. Connect VGA monitor or open BMC HTML5 KVM / SOL console."
  },
  "AA": {
    phase: "ACPI OS RUNNING (NORMAL)",
    color: "var(--accent-primary)",
    meaning: "0xAA — System has transitioned to ACPI Mode (APIC): POST is complete and Ubuntu/OS is running normally!",
    action: "No action needed — 0xAA is the normal healthy resting code on ASUS Q-Code displays once the OS takes control."
  },
  "AB": {
    phase: "WAITING IN BIOS / F1 PROMPT",
    color: "var(--accent-warning)",
    meaning: "0xAB — Setup Input Wait: Board is sitting in BIOS Setup or waiting at 'Press F1 to Run Setup'.",
    action: "Open BMC KVM console or attach crash-cart monitor: you will see the BIOS screen or an F1 prompt (e.g., chassis fan warning or CMOS cleared)."
  },
  "AD": {
    phase: "READY TO BOOT (OS HANDOFF)",
    color: "var(--accent-primary)",
    meaning: "0xAD — Ready To Boot Event: UEFI POST is 100% complete; handing off to GRUB / OS bootloader.",
    action: "Hardware POST succeeded! If the screen goes black or hangs at 0xAD, the issue is in GRUB, kernel cmdline (console=ttyS0), or initramfs."
  },
  "AE": {
    phase: "LEGACY BOOT EVENT",
    color: "var(--accent-warning)",
    meaning: "0xAE — Legacy Boot Event: Attempting to boot a legacy MBR disk or non-UEFI device.",
    action: "If Ubuntu was installed in UEFI mode, enter BIOS and set Boot Mode to UEFI (or select 'ubuntu' UEFI boot entry)."
  },
  "B0": {
    phase: "MRC DIMM DETECT / RUNTIME",
    color: "var(--accent-warning)",
    meaning: "0xB0 — Intel Xeon / AMI MRC: Detecting DIMM presence and reading SPD configuration.",
    action: "If halted on 0xB0 during early boot, check DIMM seating in primary channels and inspect BMC Event Log (SEL) for memory errors."
  },
  "B2": {
    phase: "LEGACY OPTION ROM INIT",
    color: "var(--accent-warning)",
    meaning: "0xB2 — Legacy Option ROM Initialization (loading RAID HBA, NIC PXE, or GPU vBIOS ROM).",
    action: "If hung at 0xB2: set PCIe OpROM policy to 'UEFI Only' in BIOS or reseat the GPU / RAID controller."
  },
  "B4": {
    phase: "USB HOT-PLUG / KVM",
    color: "var(--accent-warning)",
    meaning: "0xB4 — USB Hot-Plug: Initializing newly detected USB mass storage or KVM peripheral.",
    action: "Unplug external USB hubs/drives and reset BMC Virtual Media if stuck at 0xB4."
  },
  "B7": {
    phase: "MRC CHANNEL TRAINING FAIL",
    color: "var(--accent-danger)",
    meaning: "0xB7 — DDR4/DDR5 Channel Training Error: A memory channel failed read/write leveling or eye margining.",
    action: "Open ASUS/GIGABYTE BMC Web UI -> Event Log (SEL): it will name the exact failing DIMM slot (e.g., CPU0_DIMM_C0). Swap or reseat that DIMM!"
  },
  "D4": {
    phase: "PCIe OUT OF RESOURCES",
    color: "var(--accent-danger)",
    meaning: "0xd4 — PCI Resource Allocation Error: Out of PCIe MMIO BAR resources.",
    action: "Enable 'Above 4G Decoding' in BIOS, increase MMIO High Base/Size, and disable unused onboard PCIe slots."
  },
  "D6": {
    phase: "NO CONSOLE OUTPUT (NO VGA)",
    color: "var(--accent-danger)",
    meaning: "0xd6 — No Console Output Devices Found: Neither onboard BMC VGA nor discrete GPU output initialized.",
    action: "Check onboard VGA_SW1 jumper (must be enabled for ASPEED BMC video), or verify auxiliary 8-pin/12VHPWR power cables on discrete GPUs."
  },
  "D7": {
    phase: "NO CONSOLE INPUT",
    color: "var(--accent-warning)",
    meaning: "0xd7 — No Console Input Devices Found: No keyboard or BMC USB HID device detected.",
    action: "Plug in a USB keyboard or reboot the BMC (`ipmitool mc reset cold`) to restore BMC virtual USB keyboard/mouse."
  },
  "E0": {
    phase: "AMD EPYC AGESA ABL0",
    color: "var(--accent-primary)",
    meaning: "0xE0 / 0xE1 — AMD EPYC AGESA BootLoader (ABL): Early PSP & memory channel parameter init.",
    action: "Normal Stage-1 EPYC boot code. If stuck at 0xE0, verify CPU model is supported by current BIOS version."
  },
  "EA": {
    phase: "AMD EPYC PMU MEMORY FAIL",
    color: "var(--accent-danger)",
    meaning: "0xEA / 0xEB — AMD EPYC ABL Memory Training Failure: PMU failed to train DDR4/DDR5 channels.",
    action: "Check EPYC SP3/SP5 Torx T20 heatsink screw torque (12.0–13.5 in-lbs in 1-2-3-4-5-6 order), reseat DIMMs, and check BMC SEL for failing channel."
  },
  "FF": {
    phase: "CPU / VRM / FLASH FAULT",
    color: "var(--accent-danger)",
    meaning: "0xFF — Flash/CPU Fault: BIOS SPI flash read error, CPU VRM power fault, or end of ABL table.",
    action: "If solid 0xFF immediately at power-on: flip GIGABYTE/ASUS Dual-BIOS switch to backup ROM, check EPS12V cables, and inspect CPU socket."
  }
};

// Boot Phase Reference Tabs Data
const PHASE_REFERENCE = {
  pei: [
    ["0x10 – 0x18", "PEI Core & CPU microcode / Cache-as-RAM (CAR) init"],
    ["0x19 – 0x2B", "Pre-memory Northbridge, Southbridge & UPI/xGMI init"],
    ["0x2C – 0x2F", "Memory presence detect (2C), timings (2E) & init done (2F)"],
    ["0x50 / 0x53", "HALT: Invalid memory type/speed (50) or incompatible mix (53)"],
    ["0x51 / 0x52", "HALT: SPD EEPROM read fail (51) or invalid DIMM size (52)"],
    ["0x55", "HALT: Memory Not Installed (check primary slot A1/A0)"],
    ["0xB0 – 0xB6", "Xeon/AMI MRC SPD detect (B0) & RCD/buffer init (B4)"],
    ["0xB7 / 0xB8", "HALT: DDR channel training failure (check BMC SEL slot!)"]
  ],
  dxe: [
    ["0x60 / 0x61", "DXE Core start (60) & UEFI NVRAM init (61 = Clear CMOS)"],
    ["0x68 – 0x72", "PCI Host Bridge (68), Northbridge (69) & PCH DXE (70)"],
    ["0x78 / 0x79", "ACPI tables init (78) & CSM init (79 = OpROM/vBIOS hang)"],
    ["0x91 / 0x92", "PCIe Bus init (91) & PCIe Bridge/Riser detect (92)"],
    ["0x94", "PCIe Enumeration (probing all GPUs, NICs, NVMe drives)"],
    ["0x95 / 0x96", "PCIe BAR allocation (96 hang = enable Above 4G Decoding)"],
    ["0xd4", "HALT: Out of PCIe MMIO resources (adjust MMIO High Base)"],
    ["0xd6 / 0xd7", "HALT: No Console/VGA Output (d6) or No Input (d7)"]
  ],
  bds: [
    ["0x99 / 0x9C", "Super I/O init (99) & USB bus/Virtual Media detect (9C)"],
    ["0xA0 / 0xA2", "SATA/NVMe init (A0) & Drive detect (A2 = bad SSD/DOM)"],
    ["0xA4 / 0xA6", "SCSI/SAS/NVMe backplane HBA scan & LUN detect"],
    ["0xA9 / 0xAB", "Entering BIOS Setup (A9) & Setup Input Wait / F1 (AB)"],
    ["0xAD", "Ready To Boot Event: UEFI POST done -> handing to GRUB"],
    ["0xAE / 0xB2", "Legacy MBR Boot Event (AE) & Legacy Option ROM (B2)"],
    ["0xB4", "USB Hot-Plug event (check KVM or USB thumb drive)"],
    ["0xAA / 0x00", "OS Running in ACPI APIC mode (normal post-boot state)"]
  ],
  agesa: [
    ["Stage 1 -> 2", "AMD EPYC runs PSP/ABL (E0–FF) first, then AMI UEFI (10–AD)"],
    ["0xE0 / 0xE1", "ABL0/1: Early SP3/SP5 processor & SPD channel discovery"],
    ["0xE3 / 0xE4", "Dual-socket (2P) xGMI Infinity Fabric link training"],
    ["0xE6 – 0xE8", "PMU DDR4/DDR5 PHY training (takes 2–4 min on first boot)"],
    ["0xEA / 0xEB", "HALT: ABL Memory Training Fail (check DIMM & CPU torque)"],
    ["0xEE / 0xEF", "ABL complete -> releasing Zen x86 cores to start AMI UEFI"],
    ["ASUS K14/KRPA", "Populate DIMM_A1 first; check BMC_LED1 & CATERR_LED1"],
    ["GIGABYTE MZ/G", "Populate DIMM_P0_A0 first; check BMC_RDY & SW_BIOS"]
  ]
};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compactMode: localStorage.getItem("mb_sheet_compact") === "true",
  theme: localStorage.getItem("mb_sheet_theme") || "dark",
  savedIds: new Set(JSON.parse(localStorage.getItem("mb_sheet_saved") || "[]"))
};

// DOM Elements
const sectionsGrid = document.getElementById("sections-grid");
const categoryTabs = document.getElementById("category-tabs");
const searchInput = document.getElementById("search-input");
const visibleCountEl = document.getElementById("visible-count");
const savedCountEl = document.getElementById("saved-count");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const densityToggleBtn = document.getElementById("density-toggle");
const densityLabel = document.getElementById("density-label");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIconSun = document.getElementById("theme-icon-sun");
const themeIconMoon = document.getElementById("theme-icon-moon");
const emptyState = document.getElementById("empty-state");
const resetSearchBtn = document.getElementById("reset-search-btn");
const toastEl = document.getElementById("toast");
const toastMsg = document.getElementById("toast-msg");

// Initialize
function init() {
  applyTheme(state.theme);
  applyDensity(state.compactMode);
  updateSavedBadge();
  renderCategoryTabs();
  renderSections();
  initPostDecoder();
  initPhaseTabs();
  bindEvents();
}

function initPostDecoder() {
  const hexInput = document.getElementById("post-hex-input");
  const phaseBadge = document.getElementById("post-phase-badge");
  const meaningOut = document.getElementById("post-meaning-output");
  const actionOut = document.getElementById("post-action-output");
  const quickBtns = document.querySelectorAll(".post-quick-btn");

  function lookupCode(raw) {
    const clean = (raw || "").trim().replace(/^0x/i, "").toUpperCase();
    if (!clean) return;
    const entry = POST_CODE_DICTIONARY[clean];
    if (entry) {
      phaseBadge.textContent = entry.phase;
      phaseBadge.style.color = entry.color;
      meaningOut.textContent = entry.meaning;
      actionOut.innerHTML = `<strong>Rack Action:</strong> ${escapeHtml(entry.action)}`;
    } else {
      const num = parseInt(clean, 16);
      let rangeHint = "Standard AMI Aptio V / AGESA checkpoint";
      if (!isNaN(num)) {
        if (num >= 0x01 && num <= 0x0F) rangeHint = "SEC Phase (CPU microcode & early reset vector)";
        else if (num >= 0x10 && num <= 0x2F) rangeHint = "PEI Phase (Pre-memory CPU, Northbridge & MRC timings)";
        else if (num >= 0x30 && num <= 0x4F) rangeHint = "Post-Memory PEI Phase (CPU & chipset validation)";
        else if (num >= 0x50 && num <= 0x5F) rangeHint = "PEI Memory / CPU Error Halt Range (check DIMMs & CPU socket)";
        else if (num >= 0x60 && num <= 0x8F) rangeHint = "DXE Phase (Chipset, NVRAM, ACPI & CSM initialization)";
        else if (num >= 0x90 && num <= 0x9F) rangeHint = "DXE / BDS PCIe & USB Bus Enumeration Range";
        else if (num >= 0xA0 && num <= 0xAF) rangeHint = "BDS Storage / Setup / Boot Handoff Range";
        else if (num >= 0xB0 && num <= 0xBF) rangeHint = "MRC Memory Training / Option ROM / Hot-Plug Range";
        else if (num >= 0xD0 && num <= 0xDF) rangeHint = "DXE Fatal Error Halt Range (CPU/PCH/PCIe BAR/VGA fault)";
        else if (num >= 0xE0 && num <= 0xFF) rangeHint = "AMD EPYC AGESA ABL Stage 1 / S3 Resume / Flash Range";
      }
      phaseBadge.textContent = rangeHint.toUpperCase();
      phaseBadge.style.color = "var(--accent-secondary)";
      meaningOut.textContent = `0x${clean} — ${rangeHint}`;
      actionOut.innerHTML = `<strong>Rack Action:</strong> Type <code>${escapeHtml(clean)}</code> into the search box above to filter matching command cards, or inspect the BMC Event Log (SEL) and POST Code history in ASUS ASMB / GIGABYTE GSM.`;
    }
  }

  if (hexInput) {
    hexInput.addEventListener("input", (e) => lookupCode(e.target.value));
  }
  quickBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const code = btn.dataset.code;
      if (hexInput) hexInput.value = code;
      lookupCode(code);
    });
  });
}

function initPhaseTabs() {
  const tabs = document.querySelectorAll("#phase-tabs .recipe-tab");
  const grid = document.getElementById("phase-grid");

  function renderPhase(key) {
    const items = PHASE_REFERENCE[key] || [];
    grid.innerHTML = items.map(([k, v]) => `
      <div class="kv-item" data-copy="${escapeHtml(k)}" title="Click to copy ${escapeHtml(k)}">
        <span class="kv-key">${escapeHtml(k)}</span>
        <span class="kv-val">${escapeHtml(v)}</span>
      </div>
    `).join("");

    grid.querySelectorAll(".kv-item").forEach((el) => {
      el.addEventListener("click", () => copyText(el.dataset.copy, `Copied ${el.dataset.copy}`));
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderPhase(tab.dataset.phase);
    });
  });

  renderPhase("pei");
}

function renderCategoryTabs() {
  const totalCommands = MOTHERBOARD_CHEAT_SHEET_DATA.reduce((acc, sec) => acc + sec.commands.length, 0);
  let optionsHtml = `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} items)</option>`;

  MOTHERBOARD_CHEAT_SHEET_DATA.forEach((sec) => {
    const sel = state.activeCategory === sec.id ? "selected" : "";
    optionsHtml += `<option value="${sec.id}" ${sel}>[${sec.badge}] ${escapeHtml(sec.title)} (${sec.commands.length})</option>`;
  });

  categoryTabs.innerHTML = `
    <div class="cat-dropdown-wrap">
      <label class="cat-dropdown-label" for="category-select">Section:</label>
      <select id="category-select" class="cat-select" aria-label="Filter by section">
        ${optionsHtml}
      </select>
      ${state.activeCategory !== "all" ? `<button type="button" class="cat-reset-btn" id="category-reset-btn" title="Show all sections">✕ Show All</button>` : ""}
    </div>
  `;

  const selectEl = document.getElementById("category-select");
  if (selectEl) {
    selectEl.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderCategoryTabs();
      renderSections();
    });
  }

  const resetBtn = document.getElementById("category-reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmdObj, secTitle, query) {
  if (!query) return true;
  const q = query.toLowerCase();
  if (secTitle.toLowerCase().includes(q)) return true;
  if (cmdObj.desc.toLowerCase().includes(q)) return true;
  if (cmdObj.cmd.toLowerCase().includes(q)) return true;
  if (cmdObj.mode && cmdObj.mode.toLowerCase().includes(q)) return true;
  if (cmdObj.tip && cmdObj.tip.toLowerCase().includes(q)) return true;
  if (cmdObj.tags && cmdObj.tags.some((t) => t.toLowerCase().includes(q))) return true;
  if (cmdObj.flags && cmdObj.flags.some(([f, d]) => f.toLowerCase().includes(q) || d.toLowerCase().includes(q))) return true;
  return false;
}

function renderSections() {
  let visibleCount = 0;
  const cardsHtml = [];

  MOTHERBOARD_CHEAT_SHEET_DATA.forEach((sec) => {
    if (state.activeCategory !== "all" && state.activeCategory !== sec.id) return;

    const filteredCommands = sec.commands.filter((c) => {
      if (state.savedOnly && !state.savedIds.has(c.id)) return false;
      return matchesSearch(c, sec.title, state.searchQuery);
    });

    if (filteredCommands.length === 0) return;
    visibleCount += filteredCommands.length;

    const itemsHtml = filteredCommands.map((c) => {
      const isSaved = state.savedIds.has(c.id);
      const flagsHtml = (c.flags && c.flags.length)
        ? `<div class="flags-list">${c.flags.map(([flag, desc]) => `
            <div class="flag-row">
              <code class="flag-token">${escapeHtml(flag)}</code>
              <span class="flag-desc">${escapeHtml(desc)}</span>
            </div>
          `).join("")}</div>`
        : "";

      const tipHtml = c.tip
        ? `<div class="cmd-tip">💡 ${escapeHtml(c.tip)}</div>`
        : "";

      return `
        <article class="command-item" data-id="${c.id}">
          <div class="cmd-header">
            <div class="cmd-title-group">
              ${c.mode ? `<span class="vim-mode-badge ${c.modeClass || "mode-n"}">${escapeHtml(c.mode)}</span>` : ""}
              <p class="cmd-desc">${ highlightText(c.desc, state.searchQuery) }</p>
            </div>
            <div class="cmd-actions">
              <button type="button" class="icon-btn save-btn ${isSaved ? "saved" : ""}" data-save-id="${c.id}" title="Bookmark item" aria-label="Bookmark item">
                <svg viewBox="0 0 24 24" width="14" height="14">
                  <path fill="${isSaved ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="code-block" data-copy="${escapeHtml(c.cmd)}" title="Click to copy">
            <code>${ highlightText(c.cmd, state.searchQuery) }</code>
            <span class="copy-hint">Copy</span>
          </div>

          ${flagsHtml}
          ${tipHtml}
        </article>
      `;
    }).join("");

    cardsHtml.push(`
      <section class="section-card" data-section="${sec.id}">
        <header class="section-card-header">
          <span class="section-badge">${escapeHtml(sec.badge)}</span>
          <div class="section-title-Block">
            <h2>${escapeHtml(sec.title)}</h2>
            <p>${escapeHtml(sec.subtitle)}</p>
          </div>
          <span class="section-count">${filteredCommands.length}</span>
        </header>
        <div class="command-list">
          ${itemsHtml}
        </div>
      </section>
    `);
  });

  sectionsGrid.innerHTML = cardsHtml.join("");
  visibleCountEl.textContent = visibleCount;

  if (visibleCount === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  bindCardEvents();
  packMasonry();
}

function packMasonry() {
  if (!sectionsGrid) return;
  const cards = Array.from(sectionsGrid.querySelectorAll(".section-card"));
  cards.forEach((c) => sectionsGrid.appendChild(c));
  sectionsGrid.querySelectorAll(".masonry-col").forEach((col) => col.remove());

  if (cards.length <= 1) return;
  const containerWidth = sectionsGrid.clientWidth || window.innerWidth;
  const numCols = Math.max(1, Math.min(cards.length, Math.floor((containerWidth + 18) / (380 + 18))));
  if (numCols <= 1) {
    sectionsGrid.classList.remove("has-masonry");
    return;
  }
  sectionsGrid.classList.add("has-masonry");
  const cols = [];
  for (let i = 0; i < numCols; i++) {
    const col = document.createElement("div");
    col.className = "masonry-col";
    sectionsGrid.appendChild(col);
    cols.push(col);
  }

  cards.forEach((card) => {
    let shortestCol = cols[0];
    for (let i = 1; i < cols.length; i++) {
      if (cols[i].offsetHeight < shortestCol.offsetHeight) {
        shortestCol = cols[i];
      }
    }
    shortestCol.appendChild(card);
  });
}

let masonryResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 100);
});

function bindCardEvents() {
  sectionsGrid.querySelectorAll(".code-block").forEach((block) => {
    block.addEventListener("click", () => {
      copyText(block.dataset.copy, "Copied to clipboard");
    });
  });

  sectionsGrid.querySelectorAll(".save-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.dataset.saveId;
      if (state.savedIds.has(id)) {
        state.savedIds.delete(id);
      } else {
        state.savedIds.add(id);
      }
      localStorage.setItem("mb_sheet_saved", JSON.stringify([...state.savedIds]));
      updateSavedBadge();
      renderSections();
    });
  });
}

function bindEvents() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.trim();
    renderSections();
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    savedFilterBtn.classList.toggle("active", state.savedOnly);
    renderSections();
  });

  densityToggleBtn.addEventListener("click", () => {
    state.compactMode = !state.compactMode;
    localStorage.setItem("mb_sheet_compact", state.compactMode);
    applyDensity(state.compactMode);
  });

  if (printBtn) printBtn.addEventListener("click", () => window.print());

  themeToggleBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    localStorage.setItem("mb_sheet_theme", state.theme);
    applyTheme(state.theme);
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.activeCategory = "all";
    state.savedOnly = false;
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput && document.activeElement.tagName !== "INPUT") {
      e.preventDefault();
      searchInput.focus();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      state.searchQuery = "";
      searchInput.blur();
      renderSections();
    }
  });
}

function updateSavedBadge() {
  savedCountEl.textContent = state.savedIds.size;
}

function applyDensity(isCompact) {
  document.body.classList.toggle("compact-mode", isCompact);
  densityLabel.textContent = isCompact ? "Comfortable" : "Compact";
  densityToggleBtn.classList.toggle("active", isCompact);
  setTimeout(packMasonry, 20);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "light") {
    themeIconSun.classList.add("hidden");
    themeIconMoon.classList.remove("hidden");
  } else {
    themeIconSun.classList.remove("hidden");
    themeIconMoon.classList.add("hidden");
  }
}

let toastTimer;
function copyText(text, msg = "Copied to clipboard") {
  navigator.clipboard.writeText(text).then(() => {
    toastMsg.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function highlightText(text, query) {
  const safe = escapeHtml(text);
  if (!query) return safe;
  const escapedQ = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return safe.replace(new RegExp(`(${escapedQ})`, "gi"), "<mark>$1</mark>");
}

document.addEventListener("DOMContentLoaded", init);
