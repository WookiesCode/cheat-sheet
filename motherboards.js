const MOTHERBOARD_CHEAT_SHEET_DATA = [
  {
    part: "mb-memory-post",
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
        cmd: "POST 0x53 (No usable memory)   |   POST 0x55 (Memory not installed)",
        flags: [
          ["0x50","Memory initialization error: invalid memory type or incompatible memory speed"],
          ["0x51","Memory initialization error: SPD reading has failed"],
          ["0x52","Memory initialization error: invalid memory size, or memory modules do not match"],
          ["0x53","Memory initialization error: no usable memory detected (for example after mixing RDIMM and LRDIMM)"],
          ["0x54","Unspecified memory initialization error"],
          ["0x55","Memory not installed: check the first slot of CPU0 (ASUS boards often call it A1, GIGABYTE A0; the manual has the exact name)"]
        ],
        tip: "0x55 = no DIMM found: reseat the first slot of CPU0",
        tags: ["50", "51", "52", "53", "54", "55", "memory", "ram", "dimm", "rdimm", "mrc", "asus", "gigabyte"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf","title":"AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"}],"note":"Corrected 2026-11-10: wording follows AMI's Aptio V table."}
      },
      {
        id: "post-b0-bf-xeon-epyc-training",
        mode: "MRC TRAINING",
        modeClass: "mode-t",
        desc: "Intel Xeon memory init (MRC) codes B0–BF, and why the same codes mean something else later in boot",
        cmd: "Intel MRC: 0xB0 (Detect DIMMs)  ->  0xB7 (Train DDR4 ranks)  ->  0xBF (MRC done)   |   AMI BDS later: B2 Option ROM, B4 USB hot plug, B7 NVRAM reset",
        flags: [
          ["0x2C / 0x2E / 0x2F","AMI PEI: memory presence detection (2C), configuring memory (2E), memory initialization, other (2F)"],
          ["0xB0 / 0xB1 / 0xB2","Intel MRC: detect DIMM population (B0), set DDR4 frequency (B1), gather remaining SPD data (B2)"],
          ["0xB4 / 0xB6","Intel MRC: evaluate RAS modes and save rank information (B4); JEDEC initialization sequence (B6)"],
          ["0xB7 / 0xB8","Intel MRC: train DDR4 ranks (B7); initialize closed/open-loop thermal throttling (B8)"],
          ["0xB9–0xBC / 0xBF","Intel MRC: memory test, software init, memory map, RAS configuration; BF = MRC is done"],
          ["Same code, later phase","After memory init, AMI reuses B0–B7 for BDS (B2 legacy option ROM, B4 USB hot plug, B7 configuration reset). AMD EPYC boards do not use B0–BF for memory training"],
          ["Intel fatal memory errors","Intel lists E8 = no usable memory and EA = DDR4 channel training error"]
        ],
        tip: "Stuck on 0xB7 during memory init: check the BMC SEL for the failing DIMM",
        tags: ["b0", "b1", "b4", "b7", "b8", "ba", "bf", "2c", "2e", "2f", "mrc", "training", "xeon", "epyc"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://miyconst.github.io/assets/2024-07-27-intel-s2600-tpm20/Intel_S2600ST_TPS.pdf","title":"Intel S2600ST TPS: MRC progress and error codes (copy)"},{"url":"https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf","title":"AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"}],"note":"Corrected 2026-11-10: B0–BF are Intel MRC codes during memory init and AMI BDS codes later; AMD does not use them for training."}
      },
      {
        id: "asus-gigabyte-dimm-population",
        mode: "POPULATION RULES",
        modeClass: "mode-v",
        desc: "ASUS (K14/KRPA/Z13) vs GIGABYTE (MZ/MD/MS) server motherboard DIMM slot naming & population order",
        cmd: "1-DIMM Minimal Boot Test:  ASUS = CPU1_DIMM_A1   |   GIGABYTE = CPU0_DIMM_A0 (or DIMM_P0_A0)",
        flags: [
          ["ASUS Slot Naming","ASUS server boards usually label channels A, B, C… and slots 1 and 2: fill slot 1 of each channel first"],
          ["GIGABYTE Slot Naming","GIGABYTE server boards usually count from 0 (DIMM_P0_A0, B0, C0…): fill slot 0 first"],
          ["Never Mix RDIMM & LRDIMM","Mixing RDIMM, LRDIMM/3DS or UDIMM on one board fails memory init (AMI 0x50-0x53 range)"],
          ["DDR5 first boot","The first boot after a DDR5 change can spend minutes in memory training: do not power-cycle it early"]
        ],
        tip: "Give the first DDR5 boot several minutes before assuming a hang",
        tags: ["population", "slots", "a1", "a0", "ddr5", "ddr4", "rdimm", "lrdimm", "asus", "gigabyte"],
        src: {"verified":"2026-11-10","refs":[],"note":"Board-specific (LED names, jumper positions, menu paths): check this board's manual; not confirmed against a vendor document here."}
      }
    ]
  },
  {
    "part": "mb-memory-post",
    "id": "memory-post-pro-tips",
    "badge": "tip",
    "title": "Memory MRC Codes: Pro Tips & Best Practices",
    "subtitle": "Memory Initialization & Rank Training Fault Isolation",
    "commands": [
      {
        "id": "memory-post-tips-card",
        "desc": "Memory Initialization & Rank Training Fault Isolation",
        "cmd": "dmidecode -t 17 | grep -E \"(Locator|Size|Speed|Part Number)\" && edac-util -v",
        "details": "AMI's PEI memory errors are 0x50–0x55: 0x51 = SPD read failed, 0x53 = no usable memory detected, 0x55 = memory not installed. On Intel Xeon boards, B0–BF during memory init are Intel MRC progress codes (B7 = train DDR4 ranks). If stuck on 0x55, reseat the first DIMM slot of CPU0.",
        "flags": [
          [
            "0x53 (No usable memory)",
            "Memory was found but none of it could be used: mixed types, bad DIMM or wrong population"
          ],
          [
            "0x55 (Not installed)",
            "No DIMM detected: unseated first slot, or a socket-contact problem"
          ],
          [
            "0xB7 (Intel MRC)",
            "Training DDR4 ranks: a hang here points at one DIMM or channel; the BMC SEL names it"
          ]
        ],
        "tip": "Populate DIMMs in the order the board manual's population table gives.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf",
              "title": "AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"
            },
            {
              "url": "https://miyconst.github.io/assets/2024-07-27-intel-s2600-tpm20/Intel_S2600ST_TPS.pdf",
              "title": "Intel S2600ST TPS: MRC progress and error codes (copy)"
            },
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/edac-utils/edac-util.1.en.html",
              "title": "edac-util(1)"
            }
          ],
          "note": "Corrected 2026-11-10: 0x53 is no usable memory and 0x55 not installed (was swapped); the SPD failure is 0x51."
        },
        "tags": [
          "memory-post",
          "tips",
          "pro",
          "motherboard",
          "post",
          "best-practice"
        ]
      }
    ]
  },
  {
    part: "mb-pcie-dxe-post",
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
        cmd: "POST 0x92 (PCI Bus init)  ->  0x94 (PCI Bus Enumeration)  ->  0x95 (Request Resources)  ->  0x96 (Assign Resources)",
        flags: [
          ["0x91","Driver connecting is started (start of BDS device connection)"],
          ["0x92","PCI Bus initialization is started: a hang here points at a riser, cable or add-in card"],
          ["0x93","PCI Bus Hot Plug Controller initialization"],
          ["0x94","PCI Bus Enumeration: a hang here usually means a bad GPU or NIC, or an unseated riser"],
          ["0x95","PCI Bus Request Resources"],
          ["0x96","PCI Bus Assign Resources: if it appears after adding GPUs, enable Above 4G Decoding and check MMIO settings"]
        ],
        tip: "Hang at 0x94/0x96 after adding GPUs = Enable 'Above 4G Decoding' in BIOS!",
        tags: ["91", "92", "93", "94", "95", "96", "pcie", "gpu", "riser", "mcio", "slimsas", "above-4g", "bar"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf","title":"AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"}],"note":"Corrected 2026-11-10: 0x91 is driver connecting and 0x92 is PCI bus init."}
      },
      {
        id: "post-d0-d8-dxe-console-errors",
        mode: "DXE / VGA FAULT",
        modeClass: "mode-n",
        desc: "Decode DXE error codes (`0xd0`–`0xd8`), missing VGA/Console (`0xd6`), and Option ROM hangs (`0xB2`)",
        cmd: "POST 0xd6 (No Console Output / VGA)   |   POST 0xd7 (No Console Input)   |   POST 0xB2 (Legacy Option ROM)",
        flags: [
          ["0xd0 / 0xd1","CPU initialization error (d0); North Bridge initialization error (d1)"],
          ["0xd2 / 0xd4","South Bridge initialization error (d2); PCI resource allocation error, out of resources (d4)"],
          ["0xd6","No Console Output Devices are found: for example the onboard VGA disabled, or a GPU without power"],
          ["0xd7","No Console Input Devices are found: no USB keyboard or BMC virtual keyboard"],
          ["0xd8","Invalid password"],
          ["0xB2","Legacy Option ROM initialization (BDS): an old RAID card or NIC option ROM can hang here"]
        ],
        tip: "0xd6: check that the onboard VGA is enabled (the jumper name varies by board)",
        tags: ["d0", "d1", "d2", "d4", "d6", "d7", "d8", "b2", "vga", "console", "option-rom", "ast2600"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf","title":"AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"}],"note":"Corrected 2026-11-10: 0xd8 is invalid password only."}
      },
      {
        id: "post-60-79-dxe-core-pch",
        mode: "DXE CHIPSET",
        modeClass: "mode-i",
        desc: "Decode DXE Core, NVRAM, Northbridge/UPI, and Southbridge/PCH codes (`0x60`–`0x79`)",
        cmd: "POST 0x60 (DXE Core)  ->  0x61 (NVRAM)  ->  0x68 (PCI Host Bridge)  ->  0x70 (Southbridge)  ->  0x79 (CSM)",
        flags: [
          ["0x60 / 0x61","DXE Core is started (60); NVRAM initialization (61: if stuck here, clearing CMOS/NVRAM is the usual next step)"],
          ["0x62 / 0x63","South Bridge Runtime Services installation (62); CPU DXE initialization started (63)"],
          ["0x68 / 0x69","PCI host bridge initialization (68); North Bridge DXE initialization started (69; its SMM init is 6A)"],
          ["0x70 / 0x71 / 0x72","South Bridge DXE initialization started (70), South Bridge DXE SMM initialization (71), South Bridge devices initialization (72)"],
          ["0x78 / 0x79","ACPI module initialization (78); CSM initialization (79)"]
        ],
        tip: "Stuck at 0x61 = corrupted UEFI NVRAM (use CLRTC / CLR_CMOS jumper)",
        tags: ["60", "61", "62", "63", "68", "69", "70", "78", "79", "dxe", "nvram", "cmos", "acpi", "csm"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf","title":"AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"}],"note":"Corrected 2026-11-10: 0x69 is North Bridge DXE init (SMM is 0x6A)."}
      }
    ]
  },
  {
    "part": "mb-pcie-dxe-post",
    "id": "pcie-dxe-post-pro-tips",
    "badge": "tip",
    "title": "PCIe & DXE Codes: Pro Tips & Best Practices",
    "subtitle": "PCIe Bus Hangs, Bifurcation & Option ROM Freeze Triage",
    "commands": [
      {
        "id": "pcie-dxe-post-tips-card",
        "desc": "PCIe Bus Hangs, Bifurcation & Option ROM Freeze Triage",
        "cmd": "lspci -tv && lspci -vvv -d 10de: | grep -E \"(LnkCap|LnkSta|DevSta)\"",
        "details": "0x92–0x96 are BDS PCI bus initialization, enumeration and resource assignment. A hang at 0x94 (PCI Bus Enumeration) usually means an unseated riser, a bad retimer or cable, or a dead add-in card. 0xD6 means no console output device was found.",
        "flags": [
          [
            "0x94 (PCI Bus Enum)",
            "PCIe bus scan failure: unseated riser, bad cable, or dead add-in card"
          ],
          [
            "0x96 (PCI Resource)",
            "PCI resource allocation failure: enable \"Above 4G Decoding\" and Large BARs"
          ],
          [
            "0xd6 (No Console)",
            "No VGA display device detected: verify primary display selection in BMC"
          ]
        ],
        "tip": "Verify PCIe bifurcation settings in BIOS: setting an x16 slot to x4x4x4x4 for quad M.2 cards avoids post code 0x94 hangs.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf",
              "title": "AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/lspci.8.html",
              "title": "lspci(8)"
            }
          ]
        },
        "tags": [
          "pcie-dxe-post",
          "tips",
          "pro",
          "motherboard",
          "post",
          "best-practice"
        ]
      }
    ]
  },
  {
    part: "mb-storage-bds-post",
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
          ["0x99 / 0x9A","Super IO initialization (99); USB initialization is started (9A)"],
          ["0x9C / 0x9D","USB Detect (9C: USB ports, KVM dongles, BMC virtual media); USB Enable (9D)"],
          ["0xA0 / 0xA1","IDE (SATA) initialization is started (A0); IDE reset (A1)"],
          ["0xA2 / 0xA3","IDE Detect (A2) and Enable (A3): a hang at A2 points at a failing SATA drive, SATA DOM or cable"],
          ["0xA4 / 0xA5 / 0xA6","SCSI initialization is started (A4), SCSI reset (A5), SCSI detect (A6)"],
          ["0xB4","USB hot plug: a common pause point with a faulty USB drive or a bad virtual-media ISO"]
        ],
        tip: "Stuck on 0xA2 = unplug SATA/M.2 drives one by one to find the bad drive!",
        tags: ["99", "9c", "a0", "a1", "a2", "a3", "a4", "a6", "b4", "sata", "nvme", "usb", "virtual-media"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf","title":"AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"}]}
      },
      {
        id: "post-a9-ae-boot-handoff",
        mode: "BOOT HANDOFF",
        modeClass: "mode-v",
        desc: "Decode UEFI Setup entry, PXE/NVMe boot selection, and OS handoff codes (`0xA9`–`0xAE`, `0xAA`, `0x00`)",
        cmd: "POST 0xA9 (Start Setup)  ->  0xAB (Setup Input Wait)  ->  0xAD (Ready To Boot)  ->  0xAA (ACPI mode: OS running)",
        flags: [
          ["0xA9 / 0xAB","Start of Setup (A9) and Setup Input Wait (AB): not hung, it is in BIOS Setup or waiting for a key (check KVM/SOL)"],
          ["0xAC","Reserved for ASL in BDS; as an ASL code, AC = ACPI mode with the interrupt controller in PIC mode"],
          ["0xAD","Ready To Boot event: UEFI is handing control to the bootloader or PXE"],
          ["0xAE","Legacy Boot event"],
          ["0xAA (Normal Run)","ASL code: system has transitioned into ACPI mode, interrupt controller in APIC mode: the usual \"OS running\" value"],
          ["0x00 / 0xFF (At Power-On)","0x00 is \"not used\" in AMI's table: a display stuck at 00 or FF at power-on means no code was written yet (power, CPU or BIOS flash)"]
        ],
        tip: "0xAB means the board is waiting at the BIOS prompt (connect BMC KVM/SOL)!",
        tags: ["a9", "ab", "ac", "ad", "ae", "aa", "00", "ff", "bios", "setup", "grub", "boot", "acpi"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf","title":"AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"}],"note":"Corrected 2026-11-10: 0xAC is the ASL PIC-mode code; 0x00 is not used."}
      }
    ]
  },
  {
    "part": "mb-storage-bds-post",
    "id": "storage-bds-post-pro-tips",
    "badge": "tip",
    "title": "Storage & Boot BDS: Pro Tips & Best Practices",
    "subtitle": "Storage Detection, Boot Device Selection (BDS) & OS Handoff",
    "commands": [
      {
        "id": "storage-bds-post-tips-card",
        "desc": "Storage Detection, Boot Device Selection (BDS) & OS Handoff",
        "cmd": "lsblk -o NAME,MODEL,SERIAL,SIZE,FSTYPE,MOUNTPOINT && efibootmgr -v",
        "details": "0x90–0xCF are BDS (Boot Device Selection) codes. A hang at 0xA2 (IDE detect) points at a failing SATA drive or cable. 0xAA (an ASL code) means ACPI mode with the APIC interrupt controller: the normal running state.",
        "flags": [
          [
            "0xA2 (IDE Detect)",
            "SATA drive detection hang: bad drive, SATA DOM or cable"
          ],
          [
            "0xAD (Ready To Boot)",
            "UEFI handoff pending: check the USB installer, NVMe bootloader, or PXE target"
          ],
          [
            "0xAA (OS Active)",
            "ACPI mode with APIC: the OS has taken over"
          ]
        ],
        "tip": "0xAD (Ready To Boot) means the system is waiting for boot media; check efibootmgr order or PXE timeout.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf",
              "title": "AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/lsblk.8.html",
              "title": "lsblk(8)"
            },
            {
              "url": "https://github.com/rhboot/efibootmgr",
              "title": "efibootmgr"
            }
          ],
          "note": "Corrected 2026-11-10: BDS is 0x90–0xCF, not \"codes starting with A\"."
        },
        "tags": [
          "storage-bds-post",
          "tips",
          "pro",
          "motherboard",
          "post",
          "best-practice"
        ]
      }
    ]
  },
  {
    part: "mb-epyc-agesa",
    id: "amd-epyc-agesa",
    badge: "EPYC CPU",
    title: "AMD EPYC CPU (AGESA ABL & PSP) POST Codes (E0–FF, D0–DF)",
    subtitle: "GIGABYTE (MZ32/MZ33/MZ73/G-Series) & ASUS (K14/KRPA/KNPA) SP3/SP5 EPYC CPU 2-stage POST & ABL fault codes",
    commands: [
      {
        id: "epyc-2stage-abl-post",
        mode: "AGESA / ABL",
        modeClass: "mode-t",
        desc: "AMD EPYC boards show AMD firmware codes before AMI UEFI starts: decode those from the board manual, not AMI's table",
        cmd: "Stage 1: AMD PSP / AGESA boot loader (vendor-specific codes)   -->   Stage 2: AMI Aptio V UEFI (0x10 onward)",
        flags: [
          ["Why other codes appear first","On AMD EPYC, the Platform Security Processor and AGESA boot loader (ABL) train memory before the x86 cores run AMI's UEFI, and they write their own port-80 codes"],
          ["Do not decode with AMI's table","In AMI's table E0–E8 are S3 resume and E9–EF S3 resume errors (EA = S3 boot script error). Intel's MRC uses E8/EA for memory errors. Neither applies to EPYC's ABL codes"],
          ["Where to look","The board manual's AMD POST code section and the BMC SEL"]
        ],
        tip: "Early-code hang after a DIMM or CPU change: reseat, then look the code up in the board manual",
        tags: ["epyc", "amd", "agesa", "abl", "psp", "e0", "e1", "e6", "ea", "eb", "ee", "sp3", "sp5", "genoa", "turin"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf","title":"AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"},{"url":"https://miyconst.github.io/assets/2024-07-27-intel-s2600-tpm20/Intel_S2600ST_TPS.pdf","title":"Intel S2600ST TPS: MRC progress and error codes (copy)"}],"note":"Corrected 2026-11-10: removed specific E0–EF ABL meanings and socket-torque figures that contradicted each other and had no source."}
      },
      {
        id: "epyc-xgmi-dual-socket",
        mode: "DUAL-SOCKET xGMI",
        modeClass: "mode-c",
        desc: "Two-socket boards (AMD EPYC xGMI, Intel Xeon UPI): find which socket failed, and update BIOS before a newer CPU",
        cmd: "BMC SEL: which socket (P0 / P1) logged the error   |   New CPU generation: update BIOS first",
        flags: [
          ["2-socket hang","Read the BMC SEL to see whether the failing DIMM or link is on socket 0 or 1, then reseat or swap on that side"],
          ["Newer CPU, older BIOS","The BIOS must support the CPU generation: update it before installing the new CPU"],
          ["BIOS update without a supported CPU","Many server BMCs can flash the host BIOS with the host off: check your board's BMC guide"]
        ],
        tip: "Update BIOS through the BMC before swapping in a newer CPU generation",
        tags: ["xgmi", "upi", "2p", "dual-socket", "e3", "e4", "mz73", "k14", "krpa"],
        src: {"verified":"2026-11-10","refs":[],"note":"Corrected 2026-11-10: removed unsourced xGMI/UPI code numbers. General advice; check your board's BMC guide."}
      }
    ]
  },
  {
    "part": "mb-epyc-agesa",
    "id": "amd-epyc-agesa-pro-tips",
    "badge": "tip",
    "title": "AMD EPYC AGESA & PSP: Pro Tips & Best Practices",
    "subtitle": "AMD EPYC AGESA Boot Loader (ABL) & xGMI Infinity Fabric Diagnostics",
    "commands": [
      {
        "id": "amd-epyc-agesa-tips-card",
        "desc": "AMD EPYC AGESA Boot Loader (ABL) & xGMI Infinity Fabric Diagnostics",
        "cmd": "lscpu | grep -E \"(Model name|NUMA|Socket)\" && numactl --hardware",
        "details": "AMD EPYC boots in two stages: AMD's PSP and AGESA boot loader train memory first, then AMI's UEFI runs its own PEI/DXE codes. The early codes are vendor-specific, so decode them with the board manual.",
        "flags": [
          [
            "lscpu | grep -E \"Socket|NUMA\"",
            "Confirm both sockets and all NUMA nodes came up"
          ],
          [
            "numactl --hardware",
            "Confirm every NUMA node has memory (a missing node points at a socket or its DIMMs)"
          ],
          [
            "2-Stage Boot",
            "AMD firmware codes first, then a reset into AMI's 0x10-onward codes: normal behavior"
          ]
        ],
        "tip": "AMI's E0–EF meanings (S3 resume) do not apply to EPYC's early boot codes: use the board manual.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.supermicro.com/manuals/other/AMI_AptioV_BIOS_POST_Codes_for_SM_Motherboards.pdf",
              "title": "AMI Aptio V POST codes (Supermicro, from AMI Aptio 5.x Status Codes rev 2.04)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lscpu.1.html",
              "title": "lscpu(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ],
          "note": "Corrected 2026-11-10: removed 0xEA/0xEE meanings and a torque value that contradicted the other card."
        },
        "tags": [
          "amd-epyc-agesa",
          "tips",
          "pro",
          "motherboard",
          "post",
          "best-practice"
        ]
      }
    ]
  },
  {
    part: "mb-asus-servers",
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
        cmd: "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/Systems/Self\" | jq '{PowerState, Status, BootProgress}'",
        flags: [
          ["Systems/Self","AMI MegaRAC-based BMCs often name the system Self: list /redfish/v1/Systems to find the ID on yours"],
          ["BootProgress.LastState","Standard Redfish boot stage (for example PrimaryProcessorInitializationStarted, PCIResourceConfigStarted, OSRunning)"],
          ["Web UI POST code log","ASMB web GUIs have a POST code log with current and previous boot codes (menu names vary by firmware)"]
        ],
        tip: "BootProgress shows the stage; the BMC POST code log shows the exact codes",
        tags: ["asus", "asmb10", "asmb11", "redfish", "ipv6", "post", "qcode", "megarac"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://redfish.dmtf.org/schemas/v1/ComputerSystem.v1_22_0.json","title":"DMTF Redfish ComputerSystem schema (BootProgress)"}],"note":"The ASMB web-UI menu path is not confirmed against an ASUS document."}
      },
      {
        id: "asus-onboard-leds-jumpers",
        mode: "ASUS HARDWARE",
        modeClass: "mode-n",
        desc: "ASUS server motherboard onboard diagnostic LEDs (`BMC_LED1`, `CATERR_LED1`, `Q-LED`) and recovery jumpers",
        cmd: "BMC_LED1 (Blinking Green = ASMB Ready)   |   CATERR_LED1 (Solid Red = CPU IERR/MCERR)   |   CLRTC1 (Clear CMOS)",
        flags: [
          ["Q-Code LED (80 Port)","2-digit display showing the live port-80 POST code (it may switch to another value once booted)"],
          ["BMC_LED1 (Heartbeat)","Blinks when the BMC firmware is up: wait for it before pressing power"],
          ["CATERR_LED1 (Red)","Lights when the CPU signals a catastrophic error (IERR/MCERR)"],
          ["CLRTC1 / VGA_SW1","Clear CMOS (follow the jumper positions in the board manual, with AC unplugged); VGA_SW1 enables or disables the onboard VGA"]
        ],
        tip: "Wait ~60s after plugging in AC power for BMC_LED1 to blink green before powering on!",
        tags: ["asus", "bmc_led1", "caterr", "q-led", "clrtc1", "vga_sw1", "jumper", "cmos"],
        src: {"verified":"2026-11-10","refs":[],"note":"Board-specific (LED names, jumper positions, menu paths): check this board's manual; not confirmed against a vendor document here."}
      }
    ]
  },
  {
    "part": "mb-asus-servers",
    "id": "asus-server-board-pro-tips",
    "badge": "tip",
    "title": "ASUS Server Boards: Pro Tips & Best Practices",
    "subtitle": "ASUS Server ASMB BMC Telemetry & Hardware Recovery Jumpers",
    "commands": [
      {
        "id": "asus-server-board-tips-card",
        "desc": "ASUS Server ASMB BMC Telemetry & Hardware Recovery Jumpers",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E sel elist",
        "details": "ASUS server boards (ESC8000, KRPA, Z13, K14 series) have a 2-digit Q-Code display and an ASMB BMC. Use the BMC event log first, then the board's clear-CMOS jumper for corrupt NVRAM.",
        "flags": [
          [
            "ipmitool … sel elist",
            "BMC event log with sensor names: DIMM, CPU and PCIe faults"
          ],
          [
            "CLRTC jumper",
            "Clear CMOS with AC removed; jumper positions are in the board manual"
          ],
          [
            "BMC_LED1",
            "BMC heartbeat LED: wait for it before powering on"
          ]
        ],
        "tip": "Read POST codes remotely from the BMC web UI's POST code log, and the boot stage from Redfish BootProgress.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool",
              "title": "ipmitool"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.v1_22_0.json",
              "title": "DMTF Redfish ComputerSystem schema (BootProgress)"
            }
          ],
          "note": "Corrected 2026-11-10: replaced an unsourced raw IPMI command and an unverified ASUS Redfish OEM path."
        },
        "tags": [
          "asus-server-board",
          "tips",
          "pro",
          "motherboard",
          "post",
          "best-practice"
        ]
      }
    ]
  },
  {
    part: "mb-gigabyte-servers",
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
        cmd: "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/Systems/Self\" | jq '{PowerState, BootProgress}'",
        flags: [
          ["Web UI POST codes","The BMC web UI keeps the POST codes of the current and previous boot (menu names vary by firmware)"],
          ["Redfish BootProgress","Standard Redfish field with the current boot stage (see the command above)"],
          ["Default GIGABYTE BMC Login","Shipped before March 2020: admin / password. Later boards: a unique password, the last 11 characters of the serial number on the board's sticker"]
        ],
        tip: "Newer GIGABYTE boards: the default BMC password is on the serial-number sticker",
        tags: ["gigabyte", "gsm", "bmc", "post", "snooping", "redfish", "ipv6", "mz73", "ms73", "g492"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.gigabyte.com/Support/Security/1762","title":"GIGABYTE: BMC unique pre-programmed password"},{"url":"https://redfish.dmtf.org/schemas/v1/ComputerSystem.v1_22_0.json","title":"DMTF Redfish ComputerSystem schema (BootProgress)"}],"note":"Corrected 2026-11-10: GIGABYTE says the unique password is the last 11 characters of the serial (was 8); removed an unsourced raw IPMI command."}
      },
      {
        id: "gigabyte-leds-switches-jumpers",
        mode: "GIGABYTE HW",
        modeClass: "mode-v",
        desc: "GIGABYTE server motherboard status LEDs (`BMC_RDY`, `CPU_ERR`), Dual-BIOS switches & CMOS jumpers",
        cmd: "BMC_RDY LED (Blinking Green)   |   SW_BIOS / BIOS_SW (Dual-BIOS ROM Select)   |   CLR_CMOS (Pins 1-2 Short)",
        flags: [
          ["BMC_RDY LED","Blinks when the BMC has finished booting; on many models the power button waits for it"],
          ["BIOS_SW / BIOS_SEL","Switch or jumper selecting the primary or backup BIOS flash chip (the name varies by board)"],
          ["CLR_CMOS","Clear CMOS with standby power removed (positions and timing in the board manual)"],
          ["SYS_ERR / ID_LED","Blue UID (identify) LED and amber system-fault LED"]
        ],
        tip: "If a GIGABYTE board won't POST after a failed BIOS flash, flip SW_BIOS to the backup ROM!",
        tags: ["gigabyte", "bmc_rdy", "sw_bios", "dual-bios", "clr_cmos", "jumper", "dip-switch"],
        src: {"verified":"2026-11-10","refs":[],"note":"Board-specific (LED names, jumper positions, menu paths): check this board's manual; not confirmed against a vendor document here."}
      }
    ]
  },
  {
    part: "mb-linux-audit",
    id: "inband-board-audit",
    badge: "LINUX / DMI",
    title: "Ubuntu In-Band Motherboard, BIOS & ACPI BERT Error Audit",
    subtitle: "Inspecting ASUS/GIGABYTE board model, PCB revision, BIOS date, slot mapping & previous-boot hardware crash tables",
    commands: [
      {
        id: "sysfs-board-identity",
        mode: "SYSFS / DMI",
        modeClass: "mode-i",
        desc: "Read the motherboard vendor, model, revision and BIOS version from sysfs (board_serial needs root)",
        cmd: "head -n 1 /sys/class/dmi/id/{board_vendor,board_name,board_version,board_serial,bios_vendor,bios_version,bios_date}",
        flags: [
          ["board_vendor", "Prints 'ASUSTeK COMPUTER INC.' or 'GigaByte Technology Co., Ltd.'"],
          ["board_name", "Prints exact server motherboard model (e.g. 'K14PA-U12', 'KRPA-U16', 'Z13PE-D16', 'MZ73-LM0-000', 'MS73-HB0-000')"],
          ["bios_version / bios_date", "Prints active UEFI BIOS version string and release date for checking against vendor QVL/support matrix"]
        ],
        tip: "Everything except board_serial reads as a normal user",
        tags: ["sysfs", "dmi", "board_name", "bios_version", "asus", "gigabyte", "model"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://github.com/torvalds/linux/blob/master/drivers/firmware/dmi-id.c","title":"Linux dmi-id.c (serial files are 0400)"}],"note":"Corrected 2026-11-10: board_serial is mode 0400 (root only)."}
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
        tip: "BERT records in dmesg say why the board crashed on the PREVIOUS boot (reading the table file needs root)",
        tags: ["bert", "apei", "ghes", "acpi", "crash", "reboot", "hardware-error", "fwupdmgr"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://github.com/torvalds/linux/blob/master/drivers/acpi/apei/bert.c","title":"Linux ACPI BERT driver"},{"url":"https://docs.kernel.org/firmware-guide/acpi/apei/output_format.html","title":"Linux APEI output format"},{"url":"https://fwupd.github.io/libfwupdplugin/","title":"fwupd"}]}
      },
      {
        id: "ai-server-bios-checklist",
        mode: "AI BIOS CHECKLIST",
        modeClass: "mode-c",
        desc: "Mandatory BIOS settings on ASUS (ESC N8 / ESC8000 / K14 / Z13) & GIGABYTE (G593 / G493 / MZ / MS) 8-GPU AI servers",
        cmd: "Above 4G Decoding = Enabled  |  MMIO High per the vendor GPU guide  |  ACS = Disabled on PCIe switches  |  IOMMU / VT-d = Disabled or passthrough",
        flags: [
          ["Above 4G Decoding & Re-Size BAR","Enable so the BIOS can map large GPU BAR1 apertures (H100/H200/B200) without stopping at 0x94/0x96/0xd4"],
          ["MMIO High Base / Size","Use the values your server vendor gives for its 8-GPU configuration; they differ between vendors"],
          ["ACS (Access Control Services)","NVIDIA: ACS on PCIe switches sends P2P traffic through the CPU root complex; disable it (check with lspci -vvv | grep ACSCtl)"],
          ["CPU Power / C-States","Many GPU-server guides recommend a performance power profile and fewer deep C-states for steadier latency"]
        ],
        tip: "After clearing CMOS or flashing BIOS, re-check Above 4G, MMIO and ACS",
        tags: ["bios", "above-4g", "mmio", "acs", "iommu", "resize-bar", "hgx", "asus", "gigabyte"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/troubleshooting/gpu_troubleshooting.html","title":"NVIDIA NCCL: GPU troubleshooting (ACS, IOMMU)"}],"note":"Corrected 2026-11-10: removed the fixed 56T / 1024G MMIO values, which vary by vendor."}
      }
    ]
  },
  {
    "part": "mb-linux-audit",
    "id": "inband-board-audit-pro-tips",
    "badge": "tip",
    "title": "In-Band DMI & ACPI Audit: Pro Tips & Best Practices",
    "subtitle": "Production In-Band Motherboard Telemetry & Fatal Crash Log Extraction",
    "commands": [
      {
        "id": "inband-board-audit-tips-card",
        "desc": "Production In-Band Motherboard Telemetry & Fatal Crash Log Extraction",
        "cmd": "dmesg | grep -i bert && cp /sys/firmware/acpi/tables/BERT bert.dat",
        "details": "The ACPI BERT (Boot Error Record Table) keeps hardware errors from a fatal crash for the next boot. The table files under /sys/firmware/acpi/tables are root-only. Use dmidecode -t 2 to audit motherboard maker, serial and revision across a fleet.",
        "flags": [
          [
            "dmidecode -t 2",
            "Query motherboard model, PCB hardware revision, and manufacturer serial number"
          ],
          [
            "/sys/firmware/acpi/tables/BERT",
            "ACPI Boot Error Record Table containing fatal post-mortem crash records"
          ],
          [
            "SR-IOV & Above 4G",
            "Mandatory BIOS settings for PCIe Gen4/Gen5 GPU accelerators and multi-port NICs"
          ]
        ],
        "tip": "Ensure \"Above 4G Decoding\" and \"SR-IOV Support\" are enabled in BIOS to avoid post code 0x96 resource allocation failure with multi-GPU accelerators.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/torvalds/linux/blob/master/drivers/acpi/apei/bert.c",
              "title": "Linux ACPI BERT driver"
            },
            {
              "url": "https://docs.kernel.org/firmware-guide/acpi/apei/output_format.html",
              "title": "Linux APEI output format"
            },
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://github.com/torvalds/linux/blob/master/drivers/firmware/dmi-id.c",
              "title": "Linux dmi-id.c (serial files are 0400)"
            }
          ]
        },
        "tags": [
          "inband-board-audit",
          "tips",
          "pro",
          "motherboard",
          "post",
          "best-practice"
        ]
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
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("motherboards.html", "mb_sheet_saved", MOTHERBOARD_CHEAT_SHEET_DATA, {"mb-memory-post":"mb-memory-post_bookmarks","mb-pcie-dxe-post":"mb-pcie-dxe-post_bookmarks","mb-storage-bds-post":"mb-storage-bds-post_bookmarks","mb-epyc-agesa":"mb-epyc-agesa_bookmarks","mb-asus-servers":"mb-asus-servers_bookmarks","mb-gigabyte-servers":"mb-gigabyte-servers_bookmarks","mb-linux-audit":"mb-linux-audit_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("mb_sheet_theme") || "dark",
  savedIds: new Set((() => { try { return JSON.parse(localStorage.getItem("mb_sheet_saved") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(MOTHERBOARD_CHEAT_SHEET_DATA) : "";
if (typeof window !== "undefined") window.SHEET_FILTER = { sections: MOTHERBOARD_CHEAT_SHEET_DATA, label: "Motherboards sheets" };


// DOM Elements
const sectionsGrid = document.getElementById("sections-grid");
const categoryTabs = document.getElementById("category-tabs");
const searchInput = document.getElementById("search-input");
const visibleCountEl = document.getElementById("visible-count");
const savedCountEl = document.getElementById("saved-count");
const savedFilterBtn = document.getElementById("saved-filter-btn");
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
      <div class="kv-item">
        <span class="kv-key">${escapeHtml(k)}</span>
        <span class="kv-val">${escapeHtml(v)}</span>
      </div>
    `).join("");
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
    if (((state.activeCategory !== "all" && state.activeCategory !== sec.id) || (state.part && (sec.part || sec.id) !== state.part))) return;

    const filteredCommands = sec.commands.filter((c) => {
      if (state.savedOnly && !state.savedIds.has(c.id)) return false;
      return matchesSearch(c, sec.title, state.searchQuery);
    });

    if (filteredCommands.length === 0) return;
    visibleCount += filteredCommands.length;

    const itemsHtml = filteredCommands.map((c) => {
      const isSaved = state.savedIds.has(c.id);
      const flagsHtml = (c.flags && c.flags.length)
        ? `<div class="flag-pills">${c.flags.map(([flag, desc]) =>
            `<span class="flag-pill"><code>${escapeHtml(flag)}</code> <span>${escapeHtml(desc)}</span></span>`
          ).join("")}</div>`
        : "";

      const tipHtml = c.tip
        ? `<div class="cmd-tip"><span class="tip-badge">TIP</span>${escapeHtml(c.tip)}</div>`
        : "";

      return `
        <div class="cmd-item" id="${c.id}" data-id="${c.id}">
          <div class="cmd-top-row">
            <div class="cmd-desc">
              ${c.mode ? `<span class="mode-pill ${c.modeClass || "mode-n"}">${escapeHtml(c.mode)}</span>` : ""}
              <span>${highlightText(c.desc, state.searchQuery)}</span>
            </div>
            <div class="cmd-actions">
              <button type="button" class="icon-btn bookmark-btn save-btn ${isSaved ? "bookmarked" : ""}" data-save-id="${c.id}" title="${isSaved ? "Remove bookmark" : "Bookmark item"}" aria-label="Bookmark item">
                ${isSaved ? "★" : "☆"}
              </button>
            </div>
          </div>

          <div class="cmd-code-box" data-copy="${escapeHtml(c.cmd)}" title="Click to copy">
            <code class="cmd-code">${highlightText(c.cmd, state.searchQuery)}</code>
            <span class="copy-hint">Copy</span>
          </div>

          ${flagsHtml}
          ${tipHtml}
        </div>
      `;
    }).join("");

    cardsHtml.push(`
      <article class="section-card" id="sec-${sec.id}" data-section="${sec.id}">
        <header class="section-header">
          <div class="section-title-wrap">
            <span class="section-badge">${escapeHtml(sec.badge)}</span>
            <div>
              <h2 class="section-title">${escapeHtml(sec.title)}</h2>
              <p class="section-subtitle">${escapeHtml(sec.subtitle)}</p>
            </div>
          </div>
          <span class="count-badge">${filteredCommands.length}</span>
        </header>
        <div class="command-list">
          ${itemsHtml}
        </div>
      </article>
    `);
  });

  sectionsGrid.innerHTML = cardsHtml.join("");
  renderedCards = Array.from(sectionsGrid.querySelectorAll(".section-card"));
  visibleCountEl.textContent = visibleCount;

  if (visibleCount === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  bindCardEvents();
  packMasonry();
}

// Kept in render order. Reading the cards back from the columns would shuffle them.
let renderedCards = [];

function packMasonry() {
  if (!sectionsGrid) return;
  const cards = renderedCards;
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
  sectionsGrid.querySelectorAll(".cmd-code-box").forEach((block) => {
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

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (theme === "light") {
    themeIconSun?.classList.add("hidden");
    themeIconMoon?.classList.remove("hidden");
  } else {
    themeIconSun?.classList.remove("hidden");
    themeIconMoon?.classList.add("hidden");
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
