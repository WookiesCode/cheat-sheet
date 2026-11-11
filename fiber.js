const FIBER_CHEAT_SHEET_DATA = [
  {
    part: "fo-dom-cli",
    id: "dom-cli",
    badge: "dom",
    title: "DOM / DDM Optical CLI Diagnostics",
    subtitle: "Linux ethtool -m, NVIDIA mlxlink, SONiC sfputil, Arista EOS & Cisco NX-OS transceiver telemetry",
    commands: [
      {
        id: "linux-ethtool-dom",
        mode: "LINUX CLI",
        modeClass: "mode-n",
        desc: "Read SFF-8636 / CMIS transceiver EEPROM & live DOM optical RX/TX power (dBm), temperature, and alarms",
        cmd: "ethtool -m eth0   |   ethtool --show-fec eth0   |   ethtool -S eth0 | grep -E 'rx_pcs|fec|crc|err'",
        flags: [
          ["ethtool -m <iface>", "Dumps vendor, PN, SN, wavelength, per-lane Laser Bias (mA), TX power (dBm/mW), RX power (dBm/mW), and LOS/High/Low alarms"],
          ["--show-fec", "Display active Forward Error Correction mode (RS / BaseR / Off)"]
        ],
        tip: "Works on any Linux NIC driver",
        tags: ["ethtool", "dom", "ddm", "eeprom", "dbm", "rx", "tx", "linux"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://man7.org/linux/man-pages/man8/ethtool.8.html","title":"ethtool(8)"},{"url":"https://git.kernel.org/pub/scm/network/ethtool/ethtool.git/tree/cmis.c","title":"ethtool source: CMIS/QSFP DOM field names"}]}
      },
      {
        id: "nvidia-mlxlink-optics",
        mode: "NVIDIA / IB",
        modeClass: "mode-v",
        desc: "Inspect ConnectX / Quantum / Spectrum optical transceiver DOM, PAM4 eye diagram, BER, and FEC histogram",
        cmd: "mlxlink -d mlx5_0 -m -c -e   |   mlxlink -d /dev/mst/mt4129_pciconf0 -p 1 -m -c",
        flags: [
          ["-m", "Module info: vendor, SN, temp, voltage, and per-lane RX/TX power in dBm"],
          ["-c", "Counters: Raw Physical BER, Effective Post-FEC BER, and RS-FEC corrected/uncorrectable symbol bins"],
          ["-e", "Physical SerDes Eye Opening grades and height/width in mV / mUI per lane"]
        ],
        tip: "Best all-in-one 400G/800G optic check",
        tags: ["mlxlink", "nvidia", "mellanox", "ber", "eye", "pam4", "infiniband", "roce"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://networking-docs.nvidia.com/mftswum/4320/mlxlink-utility","title":"NVIDIA MFT: mlxlink"}]}
      },
      {
        id: "sonic-sfputil-show",
        mode: "SONiC NOS",
        modeClass: "mode-i",
        desc: "Query transceiver presence, DOM optical power levels, and reset/low-power mode on SONiC switches",
        cmd: "sfputil show eeprom -d -p Ethernet0   |   show interfaces transceiver eeprom Ethernet0 --dom",
        flags: [
          ["-d (--dom)", "Include real-time Digital Optical Monitoring (DOM) per-lane RX/TX dBm and bias current"],
          ["sfputil reset Ethernet0", "Hardware-reset a wedged CMIS optical transceiver in port Ethernet0"],
          ["sfputil lpmode off Ethernet0", "Take high-power QSFP-DD/OSFP optic out of Low Power Mode"]
        ],
        tags: ["sonic", "sfputil", "lpmode", "reset", "switch", "dom"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://github.com/sonic-net/sonic-utilities/blob/master/doc/Command-Reference.md","title":"SONiC command reference"},{"url":"https://github.com/sonic-net/sonic-utilities/blob/master/sfputil/main.py","title":"SONiC sfputil source"}]}
      },
      {
        id: "arista-cisco-juniper-dom",
        mode: "SWITCH NOS",
        modeClass: "mode-c",
        desc: "Inspect optical transceiver DOM power levels and FEC counters on Arista EOS, Cisco NX-OS & Juniper Junos",
        cmd: "Arista: show int Eth1/1 transceiver dom   |   NX-OS: show int eth1/1 transceiver details   |   Junos: show chassis pic fpc-slot 0 pic-slot 0",
        flags: [
          ["Arista: show int phy detail", "Shows per-lane PAM4 pre-FEC BER and FEC symbol error counters in EOS"],
          ["Junos: show interfaces diagnostics optics et-0/0/0", "Displays per-lane laser output/receiver power and alarm flags on Junos"]
        ],
        tags: ["arista", "eos", "cisco", "nxos", "juniper", "junos", "switch"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://networkingdocs.hpe.com/documentation/en_US/junos13.2/topics/reference/command-summary/show-interfaces-diagnostics-optics-10-gigabit-ethernet.html","title":"Junos: show interfaces diagnostics optics"},{"url":"https://networkingdocs.hpe.com/documentation/us/en/software/junos/cli-reference/topics/ref/command/show-chassis-pic.html","title":"Junos: show chassis pic"}],"note":"Arista and Cisco documentation refuse automated requests; their syntax was not re-checked here."}
      }
    ]
  },
  {
    "part": "fo-dom-cli",
    "id": "dom-cli-pro-tips",
    "badge": "tip",
    "title": "DOM / DDM Telemetry: Pro Tips & Best Practices",
    "subtitle": "Production Optical DOM Diagnostic Workflow & Threshold Limits",
    "commands": [
      {
        "id": "dom-cli-tips-card",
        "desc": "Production Optical DOM Diagnostic Workflow & Threshold Limits",
        "cmd": "ethtool -m eth0 | grep -Ei \"output power|optical power\" && mlxlink -d mlx5_0 -p 1 --show_module",
        "details": "DOM (Digital Optical Monitoring) / DDM reports real-time laser TX/RX power in dBm and mW, bias current, and module temperature. When bringing up a new link or investigating flaps, check RX power against the module datasheet: for NVIDIA 400G DR4, -5.9 to +4.0 dBm average per lane, with damage above +5 dBm.",
        "flags": [
          [
            "ethtool -m <dev>",
            "Dump SFF-8636 / CMIS transceiver EEPROM memory map and live DOM readings"
          ],
          [
            "mlxlink -d <dev> -p 1 --show_module",
            "Query ConnectX/BlueField HCA optical DOM power and SerDes eye health"
          ],
          [
            "sfputil show eeprom -p <port>",
            "SONiC CLI utility to display optical transceiver EEPROM and DOM telemetry"
          ]
        ],
        "tip": "RX at -40 dBm (or -inf) means no light at all (RX_LOS): check fiber seating, dust, or a reversed pair.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://git.kernel.org/pub/scm/network/ethtool/ethtool.git/tree/cmis.c",
              "title": "ethtool source: CMIS/QSFP DOM field names"
            },
            {
              "url": "https://docs.nvidia.com/nvidia-mms4x00-ns400-400gb-s-single-port-osfp-single-mode-dr4-transceivers-product-specifications.pdf",
              "title": "NVIDIA MMS4X00-NS400 400G DR4 datasheet (RX power, RHS flat top)"
            },
            {
              "url": "https://networking-docs.nvidia.com/mftswum/4320/mlxlink-utility",
              "title": "NVIDIA MFT: mlxlink"
            },
            {
              "url": "https://github.com/sonic-net/sonic-utilities/blob/master/doc/Command-Reference.md",
              "title": "SONiC command reference"
            }
          ],
          "note": "Corrected 2026-11-10: the grep missed the RX line (ethtool labels it \"Receiver/Rcvr signal average optical power\") and the thresholds now come from the DR4 datasheet."
        },
        "tags": [
          "dom-cli",
          "tips",
          "pro",
          "fiber",
          "optics",
          "best-practice"
        ]
      }
    ]
  },
  {
    part: "fo-form-factors",
    id: "form-factors-breakout",
    badge: "xcvr",
    title: "Form Factors, 400G/800G Optics & Breakouts",
    subtitle: "OSFP (Finned vs Flat-top RHS), QSFP-DD, QSFP112, DR8/2xDR4/FR4 & breakout topologies",
    commands: [
      {
        id: "osfp-finned-vs-flattop",
        mode: "800G / 400G",
        modeClass: "mode-v",
        desc: "OSFP Finned (Switch side) vs OSFP Flat-Top / RHS (Riding Heat Sink for ConnectX-7/8 PCIe NICs)",
        cmd: "Switch Port: OSFP Finned (8x100G = 800G)   |   NIC Card: OSFP Flat-Top / RHS or QSFP112 (4x100G = 400G)",
        flags: [
          ["OSFP Finned", "Integrated top heatsink fins — used in Quantum-2 / Spectrum-4 / 800G spine-leaf switches"],
          ["OSFP Flat-Top (RHS)", "Flat top so the PCIe NIC cage's riding heatsink rests on the module — Finned OSFP will NOT fit in a Flat-Top NIC cage!"],
          ["QSFP-DD vs OSFP", "QSFP-DD is backward-compatible with QSFP28/56; OSFP is slightly wider with more room for heat dissipation (check each module's power rating in its datasheet)"]
        ],
        danger: "Finned OSFP physically blocks Flat-Top NIC cages",
        tags: ["osfp", "finned", "flattop", "rhs", "qsfp-dd", "qsfp112", "800g", "400g"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://docs.nvidia.com/nvidia-mms4x00-ns400-400gb-s-single-port-osfp-single-mode-dr4-transceivers-product-specifications.pdf","title":"NVIDIA MMS4X00-NS400 400G DR4 datasheet (RX power, RHS flat top)"},{"url":"https://content.mellanox.com/LinkX/LinkX_Configuration_Maps.pdf","title":"NVIDIA LinkX configuration maps (DAC/ACC reach)"}],"note":"Corrected 2026-11-10: removed an unsourced 30W figure."}
      },
      {
        id: "breakout-topologies-800g-400g",
        mode: "BREAKOUT",
        modeClass: "mode-n",
        desc: "Common AI / Datacenter optical breakout patterns (800G 2xDR4 → 2× 400G DR4, 400G DR4 → 4× 100G DR1)",
        cmd: "800G Twin-Port OSFP (2x MPO-12 APC)  ──►  2× 400G DR4 / QSFP112 (1x MPO-12 APC each)\n400G DR4 (1x MPO-12 APC)             ──►  4× 100G DR1 / SFP112 (4x LC Duplex UPC)",
        flags: [
          ["800G 2xDR4 / 2xFR4", "Houses TWO independent 400G ports (2x MPO-12 or 2x CS/LC) inside a single 800G OSFP switch cage"],
          ["400G DR4 → 4×100G DR1", "MPO-12 (APC Green) fanout cable to 4× LC Duplex (UPC Blue) — 100G/lane PAM4 on both ends!"],
          ["Modulation Match Rule", "Can only passive-breakout when per-lane speed & modulation match (e.g. 100G PAM4/lane to 100G PAM4/lane)"]
        ],
        tip: "Verify 100G/lane vs 50G/lane PAM4 before breakout!",
        tags: ["breakout", "fanout", "2xdr4", "dr4", "dr1", "pam4", "lanes"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://content.mellanox.com/LinkX/LinkX_Configuration_Maps.pdf","title":"NVIDIA LinkX configuration maps (DAC/ACC reach)"},{"url":"https://networking-docs.nvidia.com/mfp7e30nxxxpub","title":"NVIDIA MFP7E30 MPO-12/APC cable (female-female, Type B)"}]}
      },
      {
        id: "dac-acc-aec-aoc",
        mode: "CABLING",
        modeClass: "mode-n",
        desc: "Choosing between Passive DAC, Active AEC (Retimed Copper), AOC, SR, DR, and FR optics by distance",
        cmd: "≤3m: Passive DAC   |   ≤5m: Active copper (ACC/AEC)   |   ≤100m: SR4/SR8 (MMF)   |   ≤500m: DR4/DR8 (SMF)   |   ≤2km: FR4 (SMF)",
        flags: [
          ["Passive DAC (≤3m at 100G/lane, NVIDIA LinkX)", "No power draw and the cheapest option; 26AWG for 2-3m is thick and stiff"],
          ["ACC / AEC (active copper)", "Copper with an equalizer (ACC) or retimer (AEC) chip in the plug; NVIDIA's 100G/lane ACC reaches 4-5m"],
          ["AOC (Active Optical Cable)", "Sealed factory-terminated fiber assembly (cannot clean internal ferrules or patch through panels)"]
        ],
        tags: ["dac", "aec", "acc", "aoc", "copper", "distance", "reach"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://content.mellanox.com/LinkX/LinkX_Configuration_Maps.pdf","title":"NVIDIA LinkX configuration maps (DAC/ACC reach)"},{"url":"https://docs.nvidia.com/mca7j60-nxxx-800gb-s-twin-port-osfp-to-2x400gb-s-osfp-acc-splitter-product-specifications.pdf","title":"NVIDIA MCA7J60 ACC splitter spec"}],"note":"Corrected 2026-11-10: NVIDIA lists passive DAC to 3m and active copper to 5m at 100G/lane (was 2.5m and 7m)."}
      }
    ]
  },
  {
    "part": "fo-form-factors",
    "id": "form-factors-breakout-pro-tips",
    "badge": "tip",
    "title": "Form Factors & Breakouts: Pro Tips & Best Practices",
    "subtitle": "Transceiver Form Factors, Thermal Dissipation & Interconnect Selection",
    "commands": [
      {
        "id": "form-factors-breakout-tips-card",
        "desc": "Transceiver Form Factors, Thermal Dissipation & Interconnect Selection",
        "cmd": "show interfaces transceiver detail && show cables",
        "details": "NVIDIA Quantum-2 NDR switches use finned OSFP cages for top-down forced air cooling , whereas GPU servers use Flat-Top (RHS) OSFPs that insert flush into internal chassis heat sinks. NVIDIA lists passive DAC up to 3m at 100G PAM4/lane and active copper (ACC) at 4-5m; use optical MPO transceivers for longer, rack-to-rack runs.",
        "flags": [
          [
            "OSFP Finned",
            "Thermal fins integrated on transceiver body; required for external switch airflow"
          ],
          [
            "OSFP Flat-Top / RHS",
            "Smooth top surface designed to contact server internal heat sink clamps"
          ],
          [
            "800G 2xDR4 Breakout",
            "Split dual-port 800G OSFP into two 400G DR4 MPO-12 links"
          ]
        ],
        "tip": "Finned OSFPs are for switch cages and flat-top (RHS) OSFPs for adapter cages with a riding heat sink: match the module to the cage.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://content.mellanox.com/LinkX/LinkX_Configuration_Maps.pdf",
              "title": "NVIDIA LinkX configuration maps (DAC/ACC reach)"
            },
            {
              "url": "https://docs.nvidia.com/mca7j60-nxxx-800gb-s-twin-port-osfp-to-2x400gb-s-osfp-acc-splitter-product-specifications.pdf",
              "title": "NVIDIA MCA7J60 ACC splitter spec"
            },
            {
              "url": "https://docs.nvidia.com/nvidia-mms4x00-ns400-400gb-s-single-port-osfp-single-mode-dr4-transceivers-product-specifications.pdf",
              "title": "NVIDIA MMS4X00-NS400 400G DR4 datasheet (RX power, RHS flat top)"
            }
          ],
          "note": "Corrected 2026-11-10: DAC/ACC reach from NVIDIA (3m / 4-5m)."
        },
        "tags": [
          "form-factors-breakout",
          "tips",
          "pro",
          "fiber",
          "optics",
          "best-practice"
        ]
      }
    ]
  },
  {
    part: "fo-mpo-polarity",
    id: "mpo-polarity-connectors",
    badge: "conn",
    title: "MPO/MTP Pinning, Polarity & Connector Types",
    subtitle: "Male vs Female guide pins, Type A/B/C polarity, MPO-12 vs MPO-16 & UPC vs APC ferrules",
    commands: [
      {
        id: "mpo-male-female-pin-rule",
        mode: "MPO GOLDEN RULE",
        modeClass: "mode-t",
        desc: "Prevent transceiver damage: How Male (Pinned) and Female (Unpinned) MPO/MTP connectors mate",
        cmd: "[Transceiver: MALE PINS] ◄── [Patch Cord: FEMALE] ──► [Trunk Panel: MALE] ◄── [Patch Cord: FEMALE] ──► [Transceiver: MALE PINS]",
        flags: [
          ["Transceiver MPO Cage", "Every SR4/SR8/DR4/DR8 transceiver has 2 metal guide pins (MALE) inside the optical receptacle"],
          ["Female-to-Female Patch Cord", "Direct transceiver-to-transceiver MPO jumper MUST be Female (Unpinned) on BOTH ends"],
          ["Male-to-Male Clash", "Forcing a Male (Pinned) cable into a Male transceiver crushes guide pins and ruins the optic!"],
          ["Female-to-Female Mismatch", "Mating two Female connectors in a patch coupler leaves cores unaligned (causes 3–10+ dB loss!)"]
        ],
        danger: "Never plug a Pinned (Male) MPO cable into a transceiver!",
        tags: ["mpo", "mtp", "male", "female", "pins", "pinned", "unpinned", "damage"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://networking-docs.nvidia.com/mfp7e30nxxxpub","title":"NVIDIA MFP7E30 MPO-12/APC cable (female-female, Type B)"}]}
      },
      {
        id: "mpo-polarity-type-a-b-c",
        mode: "POLARITY",
        modeClass: "mode-v",
        desc: "MPO-12 / MPO-16 Polarity Types (Type B rollover for direct patch vs Type A structured trunks)",
        cmd: "Direct Optic-to-Optic Patch: Type B (Key-Up to Key-Up, Female-to-Female)   |   MPO-12 Lanes: TX=1..4, Unused=5..8, RX=9..12",
        flags: [
          ["Type B (Rollover: 1→12, 2→11...)", "Standard direct patch cord between two SR4/DR4/DR8 transceivers: maps Fiber 1 (TX1) to Fiber 12 (RX1)"],
          ["Type A (Straight: 1→1, 2→2...)", "Key-Up to Key-Down trunk cable; requires one Type A + one Type B patch cord at the panels to flip TX→RX"],
          ["Odd number of Type B cables", "In an end-to-end MPO link without cassettes, you generally need an ODD number of Type B flips so Pos 1 lands on Pos 12"]
        ],
        tip: "Direct jumper between 2 optics = Type B Female-Female",
        tags: ["polarity", "type-b", "type-a", "rollover", "key-up", "mpo12", "mpo16"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://networking-docs.nvidia.com/mfp7e30nxxxpub","title":"NVIDIA MFP7E30 MPO-12/APC cable (female-female, Type B)"}]}
      },
      {
        id: "mpo12-vs-mpo16-keying",
        mode: "800G / 400G",
        modeClass: "mode-v",
        desc: "Distinguishing MPO-12 (4-lane SR4/DR4) from MPO-16 (8-lane 800G SR8/DR8) connectors",
        cmd: "MPO-12 (4-lane): Centered Alignment Key   |   MPO-16 (8-lane 800G): Offset (Left-Shifted) Alignment Key",
        flags: [
          ["MPO-12 (Centered Key)", "Used for 4-lane parallel optics (100G SR4/DR4, 400G SR4/DR4); middle 4 fibers (5–8) are dark"],
          ["MPO-16 (Offset Key)", "Used for 8-lane single-port 800G SR8 / DR8 optics (all 16 fibers active: 1–8 TX, 9–16 RX) — offset key prevents plugging MPO-12 into MPO-16!"]
        ],
        tags: ["mpo12", "mpo16", "key", "offset", "sr8", "dr8", "800g"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://res.cloudinary.com/sonepar-fr/raw/upload/s--35m40lxy--/v1/documents/156/111309231.pdf","title":"Base-16 (MPO-16) application guide: offset key"}]}
      },
      {
        id: "lc-cs-sn-mdc-duplex",
        mode: "DUPLEX",
        modeClass: "mode-n",
        desc: "Duplex 2-fiber connectors (LC, CS, SN, MDC) and how to fix RX_LOS polarity swaps in the field",
        cmd: "LC Duplex (FR4/LR4/SR/DR1)   |   CS / SN / MDC (High-Density 2xFR4 / 4xDR1 breakouts)",
        flags: [
          ["Both ends show RX -40 dBm (LOS)", "If both transceivers transmit healthy TX power (~0 dBm) but both read -40 dBm RX, TX is going to TX — pop the LC duplex clip and swap A/B fibers on ONE end!"],
          ["UPC (Blue) vs APC (Green)", "Duplex LR4/FR4/CWDM4 transceivers almost always use flat Blue LC/UPC; single-mode MPO (DR4/DR8) normally uses angled Green MPO/APC (NVIDIA's DR4 parts and cables are APC)"]
        ],
        tip: "TX ok + RX -40dBm on both sides = roll LC clip",
        tags: ["lc", "duplex", "cs", "sn", "mdc", "los", "swap", "roll", "upc", "apc"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://docs.nvidia.com/nvidia-mms4x00-ns400-400gb-s-single-port-osfp-single-mode-dr4-transceivers-product-specifications.pdf","title":"NVIDIA MMS4X00-NS400 400G DR4 datasheet (RX power, RHS flat top)"},{"url":"https://networking-docs.nvidia.com/mfp7e30nxxxpub","title":"NVIDIA MFP7E30 MPO-12/APC cable (female-female, Type B)"}]}
      }
    ]
  },
  {
    "part": "fo-mpo-polarity",
    "id": "mpo-polarity-connectors-pro-tips",
    "badge": "tip",
    "title": "MPO Pinning & Polarity: Pro Tips & Best Practices",
    "subtitle": "MPO Mating Rules, Polarity Inversion & Connector Keying",
    "commands": [
      {
        "id": "mpo-polarity-connectors-tips-card",
        "desc": "MPO Mating Rules, Polarity Inversion & Connector Keying",
        "cmd": "cat /sys/class/infiniband/*/ports/*/counters/link_downed",
        "details": "Parallel-optic transceivers carry the guide pins (male), so the cords that plug into them are female (unpinned): NVIDIA's MPO-12/APC cable is female-to-female, Type-B crossover. Every mated pair needs exactly one pinned side. A direct transceiver-to-transceiver cord must be Type B so fiber 1 (TX) lands on fiber 12 (RX).",
        "flags": [
          [
            "MPO Female (Unpinned)",
            "Smooth guide holes without pins; the normal end on cords that plug into transceivers"
          ],
          [
            "MPO Male (Pinned)",
            "Metal guide pins protruding from the ferrule; transceiver receptacles are pinned"
          ],
          [
            "Type-B Polarity",
            "Key-Up to Key-Up crossover; fiber 1 maps to fiber 12 (TX to RX)"
          ]
        ],
        "tip": "Never attempt to mate two pinned (male) MPO connectors; guide pins will collide and shatter the ceramic ferrule micro-lenses.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/mfp7e30nxxxpub",
              "title": "NVIDIA MFP7E30 MPO-12/APC cable (female-female, Type B)"
            },
            {
              "url": "https://www.kernel.org/doc/Documentation/ABI/stable/sysfs-class-infiniband",
              "title": "Linux ABI: sysfs-class-infiniband (link_downed)"
            }
          ],
          "note": "Corrected 2026-11-10: transceivers are pinned (male), not female; the sysfs counter is link_downed."
        },
        "tags": [
          "mpo-polarity-connectors",
          "tips",
          "pro",
          "fiber",
          "optics",
          "best-practice"
        ]
      }
    ]
  },
  {
    part: "fo-cleaning-testing",
    id: "cleaning-testing-triage",
    badge: "phy",
    title: "Cleaning, OTDR/OLTS Testing, FEC & Triage",
    subtitle: "Inspect-before-you-connect, attenuator protection, FEC bin analysis & fault isolation",
    commands: [
      {
        id: "inspect-clean-connect",
        mode: "MAINTENANCE",
        modeClass: "mode-c",
        desc: "IEC 61300-3-35 Inspect-Before-You-Connect workflow (dirty end faces are a leading cause of link problems)",
        cmd: "1. Inspect w/ 400x Scope  ──►  2. Dry IBC Click-Cleaner (1–2 clicks)  ──►  3. Wet-to-Dry Clean (if oil/gel)  ──►  4. Re-Inspect",
        flags: [
          ["9 µm SMF Core Size", "Single-mode core is only 9 microns wide (1/10th of a human hair) — a single skin-oil smudge or dust speck blocks the entire core!"],
          ["Brand New Patch Cords", "A dust cap is not a guarantee of a clean end face: inspect and clean new cords straight out of the bag too"],
          ["MPO vs LC Cleaners", "Use wide ribbon IBC cleaners for MPO-12/16 (cleans all 12/16 fibers + inside Male guide-pin holes) and 1.25mm pens for LC"]
        ],
        tip: "New out of bag ≠ clean!",
        tags: ["clean", "ibc", "clicker", "scope", "ferrule", "dust", "contamination"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.flukenetworks.com/knowledge-base/fiber-inspection-and-cleaning/inspect-you-connect","title":"Fluke Networks: inspect before you connect"}],"note":"Changed 2026-11-10: dropped the unsourced 85% and outgassing claims."}
      },
      {
        id: "optical-attenuators-overload",
        mode: "PROTECTION",
        modeClass: "mode-t",
        desc: "When to install inline optical attenuators to prevent burning out receiver photodiodes (`RX High Alarm`)",
        cmd: "10km LR4: Safe at 2m patch (Max TX ≤ Max RX)   |   40km ER4 / 80km ZR: MUST use 10–15 dB Attenuator on short patches!",
        flags: [
          ["Damage Threshold vs Overload", "If TX max launch power exceeds RX overload/damage rating (common on ER4, ZR, DWDM), short patch cords will saturate or permanently destroy the APD receiver!"],
          ["DR4 / FR4 / LR4", "Standard 500m DR4, 2km FR4, and 10km LR4 are engineered so Max TX ≤ Max RX Overload (safe for short back-to-back rack patching)"]
        ],
        danger: "Never short-patch ER4/ZR without an attenuator!",
        tags: ["attenuator", "overload", "er4", "zr", "lr4", "burn", "damage", "pad"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://docs.nvidia.com/nvidia-mms4x00-ns400-400gb-s-single-port-osfp-single-mode-dr4-transceivers-product-specifications.pdf","title":"NVIDIA MMS4X00-NS400 400G DR4 datasheet (RX power, RHS flat top)"}],"note":"NVIDIA DR4: max launch +3.0 dBm, max receive +4.0 dBm, damage +5 dBm, so back-to-back DR4 needs no attenuator."}
      },
      {
        id: "fec-ber-fault-triage",
        mode: "TROUBLESHOOTING",
        modeClass: "mode-t",
        desc: "Step-by-step field isolation for flapping links, high Pre-FEC BER, or uncorrectable FEC codeword errors",
        cmd: "Check DOM RX dBm per lane  ──►  Compare lanes (one lane several dB down?)  ──►  Clean Patch & Panel  ──►  Swap Patch Cord  ──►  Loopback Test Optic",
        flags: [
          ["1 single lane low RX (e.g. Lane 3 = -11 dBm, Lanes 0–2 = -2 dBm)", "Classic symptom of contamination on fiber #3/#10 of an MPO ferrule or damaged individual sub-assembly"],
          ["All lanes low RX (near or below the module minimum, about -6 dBm per lane for 400G DR4)", "Excessive link insertion loss: pinched/macro-bent fiber (bend radius <30mm), Female-to-Female unpinned MPO coupler, or dirty trunk cassettes"],
          ["Good RX dBm (-2 dBm) but high Pre-FEC BER / eye closure", "High reflectance (APC mated to UPC!), failing laser/DSP on remote TX or local RX, or chromatic/modal dispersion"]
        ],
        tip: "1 weak lane on MPO = dirty outer fiber",
        tags: ["triage", "troubleshooting", "ber", "fec", "flap", "crc", "skew", "loopback"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://docs.nvidia.com/nvidia-mms4x00-ns400-400gb-s-single-port-osfp-single-mode-dr4-transceivers-product-specifications.pdf","title":"NVIDIA MMS4X00-NS400 400G DR4 datasheet (RX power, RHS flat top)"},{"url":"https://networking-docs.nvidia.com/mftswum/4320/mlxlink-utility","title":"NVIDIA MFT: mlxlink"},{"url":"https://grouper.ieee.org/groups/802/3/bs/public/adhoc/logic/oct23_15/anslow_01_1015_logic.pdf","title":"IEEE 802.3bs contribution: 2.4E-4 pre-FEC BER limit (KP4)"}],"note":"Corrected 2026-11-10: low-RX example uses the DR4 datasheet minimum (-5.9 dBm average per lane)."}
      },
      {
        id: "olts-vs-otdr-testing",
        mode: "CERTIFICATION",
        modeClass: "mode-n",
        desc: "Tier-1 OLTS (Optical Loss Test Set) vs Tier-2 OTDR (Optical Time-Domain Reflectometer) structured cabling tests",
        cmd: "Tier 1 (OLTS Power Meter): Total End-to-End dB Insertion Loss   |   Tier 2 (OTDR): Distance-to-Fault (m) + Per-Panel Reflectance & Splice Loss",
        flags: [
          ["Launch & Receive Reference Cords", "Always use a 150m+ Launch Box & Receive Box with an OTDR so the first and last patch panels don't hide inside the OTDR's event dead zone!"],
          ["Max Datacenter MPO Link Budget", "IEEE 400GBASE-DR4 / 800G-DR8 total channel insertion loss budget is typically ≤ 3.0 dB (500m)"]
        ],
        tags: ["otdr", "olts", "fluke", "exfo", "tier1", "tier2", "launch-cable", "dead-zone"],
        src: {"verified":"2026-11-10","refs":[{"url":"https://www.flukenetworks.com/knowledge-base/fiber-inspection-and-cleaning/inspect-you-connect","title":"Fluke Networks: inspect before you connect"}]}
      }
    ]
  },
  {
    "part": "fo-cleaning-testing",
    "id": "cleaning-testing-triage-pro-tips",
    "badge": "tip",
    "title": "Cleaning & Testing Triage: Pro Tips & Best Practices",
    "subtitle": "Inspect-Before-You-Connect Best Practices & Layer-1 Optical Flap Triage",
    "commands": [
      {
        "id": "cleaning-testing-triage-tips-card",
        "desc": "Inspect-Before-You-Connect Best Practices & Layer-1 Optical Flap Triage",
        "cmd": "ethtool --show-fec eth0 && mlxlink -d mlx5_0 -p 1 -c",
        "details": "Contaminated end faces are a leading cause of optical link problems. Inspect with a fiber microscope before connecting. DR4/FR4 optics are safe back-to-back (NVIDIA DR4 launches at most +3.0 dBm and accepts up to +4.0 dBm); attenuators are for long-reach ER4/ZR-class optics on short links.",
        "flags": [
          [
            "IEC 61300-3-35",
            "International inspection standard defining acceptable scratches and contamination zones on core/cladding"
          ],
          [
            "Pre-FEC BER",
            "Raw bit error rate before Reed-Solomon correction; healthy links sit orders of magnitude below the ~2.4e-4 KP4 limit"
          ],
          [
            "OTDR (Tier-2)",
            "Optical Time-Domain Reflectometer: pinpoints distance to micro-bends, breaks, and high-loss splices"
          ]
        ],
        "tip": "KP4 FEC on PAM4 links is designed for a pre-FEC BER up to about 2.4e-4: a pre-FEC BER climbing toward that, or any uncorrectable codewords, means dirty end faces, bends or a failing optic.",
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.flukenetworks.com/knowledge-base/fiber-inspection-and-cleaning/inspect-you-connect",
              "title": "Fluke Networks: inspect before you connect"
            },
            {
              "url": "https://docs.nvidia.com/nvidia-mms4x00-ns400-400gb-s-single-port-osfp-single-mode-dr4-transceivers-product-specifications.pdf",
              "title": "NVIDIA MMS4X00-NS400 400G DR4 datasheet (RX power, RHS flat top)"
            },
            {
              "url": "https://networking-docs.nvidia.com/mftswum/4320/mlxlink-utility",
              "title": "NVIDIA MFT: mlxlink"
            },
            {
              "url": "https://grouper.ieee.org/groups/802/3/bs/public/adhoc/logic/oct23_15/anslow_01_1015_logic.pdf",
              "title": "IEEE 802.3bs contribution: 2.4E-4 pre-FEC BER limit (KP4)"
            }
          ],
          "note": "Corrected 2026-11-10: mlxlink has no --show_ber (BER is in -c); DR4 does not need attenuators back-to-back."
        },
        "tags": [
          "cleaning-testing-triage",
          "tips",
          "pro",
          "fiber",
          "optics",
          "best-practice"
        ]
      }
    ]
  },
  {
    "id": "team-optics-parts",
    "part": "fo-team-optics",
    "badge": "team",
    "title": "Team Optics: What Fits Where",
    "subtitle": "The team’s transceiver part labels against the eleven devices: a possible cage and speed match, not vendor qualification",
    "commands": [
      {
        "id": "team-sfp-10glr-31",
        "mode": "Single mode",
        "modeClass": "mode-v",
        "desc": "SFP-10GLR-31: Single mode · 1310 nm · Duplex LC · 10 km",
        "cmd": "Part: SFP-10GLR-31   |   Fits: SN5400: 10G SFP28 bonus, SN5600: 10G SFP28 bonus, C9200L: 10G SFP+ uplink, 7260CX3: 10G SFP+ port, CCR2216: 10G SFP28 cage, SN2410: 10G SFP28 cage, N9K-FX3: 10G SFP28 cage   |   MX304: depends on the installed LMIC",
        "details": "FS 10GBASE-LR SFP+ optic. Candidate for a 10G SFP28 bonus port when qualified by the switch; the Hasivo uplinks are 1G. 10G SFP+; not for a 1G Hasivo uplink.",
        "flags": [
          [
            "Medium",
            "Single mode · 1310 nm"
          ],
          [
            "Connector",
            "Duplex LC"
          ],
          [
            "Reach",
            "10 km"
          ],
          [
            "Also used on",
            "10G SFP+ LR port; FS data sheet"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "sfp-10glr-31"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://resource.fs.com/mall/resource/sfp-10glr-31-data-sheet-20251128104131.pdf",
              "title": "FS SFP-10GLR-31 data sheet"
            }
          ],
          "note": "FS data sheet: 10GBASE-LR SFP+, 1310 nm, 10 km. Single-mode duplex LC is the 10GBASE-LR interface; the data sheet text does not spell out the connector. Fit lists are cage and speed matches, not vendor qualification."
        }
      },
      {
        "id": "team-xs-85lc01d",
        "mode": "Multimode",
        "modeClass": "mode-v",
        "desc": "XS+85LC01D: Multimode · 850 nm · Duplex LC/UPC · Up to 100 m at 25G",
        "cmd": "Part: XS+85LC01D   |   Fits: Hasivo: 1G SFP uplink, SN5400: SFP28 bonus, SN5600: SFP28 bonus, C9200L: 1/10G SFP+ uplink, ACS8000: 1G SFP LAN, 7260CX3: 1/10G SFP+ port, CCR2216: SFP28 cage, SN2410: SFP28 cage, N9K-FX3: SFP28 cage   |   MX304: depends on the installed LMIC",
        "details": "MikroTik 1/10/25G SFP/SFP+/SFP28 module. Candidate at 1G for a Hasivo SFP uplink or at 1/10/25G for an NVIDIA SFP28 bonus port; verify switch qualification and configured speed.",
        "flags": [
          [
            "Medium",
            "Multimode · 850 nm"
          ],
          [
            "Connector",
            "Duplex LC/UPC"
          ],
          [
            "Reach",
            "Up to 100 m at 25G"
          ],
          [
            "Also used on",
            "1/10/25G SFP ports; MikroTik CRS/CSS examples"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "xs+85lc01d"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://mikrotik.com/product/xs_85lc01d",
              "title": "MikroTik XS+85LC01D product page"
            }
          ],
          "note": "MikroTik: 1G / 10G / 25G, 850 nm, multimode, dual LC UPC, 100 m at 25G (the page header says 1310 nm; its specification table says 850 nm). Reach at 1G and 10G and the OM grade are not stated."
        }
      },
      {
        "id": "team-qsfp-100g-sr4",
        "mode": "Multimode",
        "modeClass": "mode-v",
        "desc": "QSFP-100G-SR4: Multimode · 850 nm · MPO-12 · 70 m OM3 / 100 m OM4",
        "cmd": "Part: QSFP-100G-SR4   |   Fits: SN5400: QSFP-DD main, 7260CX3: 100G QSFP28, CCR2216: 100G QSFP28, SN2410: 100G QSFP28, N9K-FX3: 100G QSFP28   |   MX304: depends on the installed LMIC",
        "details": "100G QSFP28 SR4. NVIDIA: the SN5400 (50G-PAM4) QSFP-DD cages accept QSFP56 and QSFP28 cables and transceivers, subject to speed and module qualification.",
        "flags": [
          [
            "Medium",
            "Multimode · 850 nm"
          ],
          [
            "Connector",
            "MPO-12 (polish: check the part; not stated in the source)"
          ],
          [
            "Reach",
            "70 m OM3 / 100 m OM4"
          ],
          [
            "Also used on",
            "100G QSFP28 ports; NADDOD N9500-128QC example"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "qsfp-100g-sr4"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://resource.naddod.com/files/2025-11-21/n9500-128qc-datasheet-013354.pdf",
              "title": "NADDOD N9500-128QC switch data sheet: compatible-module table"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/Linking-DGXs,-Switches,-ConnectX-7-&-ConnectX-8-Adapters,-and-BlueField-3-DPUs-Overview",
              "title": "NVIDIA: linking switches, ConnectX-7/8 and BlueField-3; QSFP cage backwards compatibility"
            }
          ],
          "note": "NADDOD module table: 100GBASE-SR4, QSFP28, 850 nm, 70 m OM3 / 100 m OM4, MPO/MTP-12 (polish not given; the guide said UPC). The guide linked this switch data sheet as the module data sheet. NVIDIA for the SN5400 QSFP28 fit."
        }
      },
      {
        "id": "team-qsfp56-200g-sr4",
        "mode": "Multimode",
        "modeClass": "mode-v",
        "desc": "QSFP56-200G-SR4: Multimode · 850 nm · MPO-12/UPC · 100 m",
        "cmd": "Part: QSFP56-200G-SR4   |   Fits: SN5400: QSFP-DD main   |   MX304: depends on the installed LMIC",
        "details": "200G QSFP56 SR4 family. NVIDIA: the SN5400 QSFP-DD cages accept QSFP56; confirm the exact vendor-coded module and port speed.",
        "flags": [
          [
            "Medium",
            "Multimode · 850 nm"
          ],
          [
            "Connector",
            "MPO-12/UPC"
          ],
          [
            "Reach",
            "100 m"
          ],
          [
            "Also used on",
            "200G QSFP56 ports; NADDOD N9500-128QC example"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "qsfp56-200g-sr4"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://resource.naddod.com/files/2025-11-21/n9500-128qc-datasheet-013354.pdf",
              "title": "NADDOD N9500-128QC switch data sheet: compatible-module table"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/Linking-DGXs,-Switches,-ConnectX-7-&-ConnectX-8-Adapters,-and-BlueField-3-DPUs-Overview",
              "title": "NVIDIA: linking switches, ConnectX-7/8 and BlueField-3; QSFP cage backwards compatibility"
            }
          ],
          "note": "NADDOD module table: Q56-200G-SR4, 200GBASE-SR4, QSFP56, 850 nm, 100 m, MPO/MTP-12 UPC. NVIDIA for the SN5400 QSFP56 fit."
        }
      },
      {
        "id": "team-qsfp112-400g-sr4",
        "mode": "Multimode",
        "modeClass": "mode-v",
        "desc": "QSFP112-400G-SR4: Multimode · 850 nm · MPO-12/APC · 100 m",
        "cmd": "Part: QSFP112-400G-SR4   |   Fits: no direct cage match on these fixed-port devices   |   MX304: depends on the installed LMIC",
        "details": "400G QSFP112 SR4 family. A QSFP-DD cage (SN5400) physically takes QSFP112, but NVIDIA lists only QSFP56 and QSFP28 for the 50G-PAM4 SN5400, and a 100G-PAM4 module links there only if it can down-shift (\"many, but not all transceivers\" can). Its home is a QSFP112 port: ConnectX-7/8 QSFP112 or BlueField-3.",
        "flags": [
          [
            "Medium",
            "Multimode · 850 nm"
          ],
          [
            "Connector",
            "MPO-12/APC"
          ],
          [
            "Reach",
            "100 m"
          ],
          [
            "Also used on",
            "QSFP112 adapters and DPUs; NADDOD N9500-128QC 400G QSFP112 switch"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "qsfp112-400g-sr4"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://resource.naddod.com/files/2025-11-21/n9500-128qc-datasheet-013354.pdf",
              "title": "NADDOD N9500-128QC switch data sheet: compatible-module table"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/Linking-DGXs,-Switches,-ConnectX-7-&-ConnectX-8-Adapters,-and-BlueField-3-DPUs-Overview",
              "title": "NVIDIA: linking switches, ConnectX-7/8 and BlueField-3; QSFP cage backwards compatibility"
            }
          ],
          "note": "NADDOD module table: Q112-400G-SR4, 850 nm, 100 m, MTP/MPO-12 APC. NVIDIA: QSFP-DD cage compatibility and down-shift. Corrected 2026-11-10: the guide said the SN5400 cage does not support QSFP112; NVIDIA says a QSFP-DD cage supports QSFP112 devices, but lists only QSFP56/QSFP28 for the SN5400."
        }
      },
      {
        "id": "team-qsfp112-400g-vr4",
        "mode": "Multimode",
        "modeClass": "mode-v",
        "desc": "QSFP112-400G-VR4: Multimode · 850 nm · MPO-12/APC · 50 m",
        "cmd": "Part: QSFP112-400G-VR4   |   Fits: no direct cage match on these fixed-port devices   |   MX304: depends on the installed LMIC",
        "details": "400G QSFP112 VR4 family. A QSFP-DD cage (SN5400) physically takes QSFP112, but NVIDIA lists only QSFP56 and QSFP28 for the 50G-PAM4 SN5400, and a 100G-PAM4 module links there only if it can down-shift (\"many, but not all transceivers\" can). Its home is a QSFP112 port: ConnectX-7/8 QSFP112 or BlueField-3.",
        "flags": [
          [
            "Medium",
            "Multimode · 850 nm"
          ],
          [
            "Connector",
            "MPO-12/APC"
          ],
          [
            "Reach",
            "50 m"
          ],
          [
            "Also used on",
            "QSFP112 adapters and DPUs; NADDOD N9500-128QC 400G QSFP112 switch"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "qsfp112-400g-vr4"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://resource.naddod.com/files/2025-11-21/n9500-128qc-datasheet-013354.pdf",
              "title": "NADDOD N9500-128QC switch data sheet: compatible-module table"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/Linking-DGXs,-Switches,-ConnectX-7-&-ConnectX-8-Adapters,-and-BlueField-3-DPUs-Overview",
              "title": "NVIDIA: linking switches, ConnectX-7/8 and BlueField-3; QSFP cage backwards compatibility"
            }
          ],
          "note": "NADDOD module table: Q112-400G-VR4, 850 nm, 50 m, MTP/MPO-12 APC. NVIDIA: QSFP-DD cage compatibility and down-shift. Corrected 2026-11-10 (QSFP112 in the SN5400 cage), as on the SR4 card."
        }
      },
      {
        "id": "team-qsfp-dd-400g-sr8",
        "mode": "Multimode",
        "modeClass": "mode-v",
        "desc": "QSFP-DD-400G-SR8: Multimode · 850 nm · MPO-16 · 70 m OM3 / 100 m OM4",
        "cmd": "Part: QSFP-DD-400G-SR8   |   Fits: SN5400: QSFP-DD main   |   MX304: depends on the installed LMIC",
        "details": "400G QSFP-DD SR8. Check MPO-16 cabling and polarity; it is not interchangeable with MPO-12 SR4.",
        "flags": [
          [
            "Medium",
            "Multimode · 850 nm"
          ],
          [
            "Connector",
            "MPO-16 (polish: check the part; not stated in the data sheet)"
          ],
          [
            "Reach",
            "70 m OM3 / 100 m OM4 (host FEC required)"
          ],
          [
            "Also used on",
            "NADDOD N9200-64DC 400G QSFP-DD switch"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "qsfp-dd-400g-sr8"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://resource.naddod.com/files/%20products-Optical%20Transceivers%20%26%20Cables/2024-01-30/qdd-400g-sr8-datasheet-009264.pdf",
              "title": "NADDOD QDD-400G-SR8 data sheet"
            },
            {
              "url": "https://resource.naddod.com/files/2025-11-21/n9200-64dc-datasheet-013355.pdf",
              "title": "NADDOD N9200-64DC switch data sheet: compatible-module table"
            }
          ],
          "note": "NADDOD QDD-400G-SR8 data sheet: 8 lanes at 850 nm, MPO-16, 70 m OM3 / 100 m OM4, host FEC required. It does not state APC (the guide said MPO-16/APC)."
        }
      },
      {
        "id": "team-qsfp-dd-400g-dr4",
        "mode": "Single mode",
        "modeClass": "mode-v",
        "desc": "QSFP-DD-400G-DR4: Single mode · 1310 nm · MPO-12/APC · 500 m",
        "cmd": "Part: QSFP-DD-400G-DR4   |   Fits: SN5400: QSFP-DD main   |   MX304: depends on the installed LMIC",
        "details": "400G QSFP-DD DR4. Match a compatible DR4 peer and single mode parallel fiber path.",
        "flags": [
          [
            "Medium",
            "Single mode · 1310 nm"
          ],
          [
            "Connector",
            "MPO-12/APC"
          ],
          [
            "Reach",
            "500 m"
          ],
          [
            "Also used on",
            "NADDOD N9200-64DC 400G QSFP-DD switch"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "qsfp-dd-400g-dr4"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://resource.naddod.com/files/2025-11-21/n9200-64dc-datasheet-013355.pdf",
              "title": "NADDOD N9200-64DC switch data sheet: compatible-module table"
            },
            {
              "url": "https://networking-docs.nvidia.com/sn5000hw/data-interfaces-and-high-power-transceivers-support",
              "title": "NVIDIA SN5000 hardware manual: data interfaces and high-power support"
            }
          ],
          "note": "NADDOD module table: QDD-400G-DR4, 400GBASE-DR4, 1310 nm, 500 m, MTP/MPO-12 APC, SMF (the guide linked this switch data sheet as the module data sheet). NVIDIA: the SN5400 data interfaces take QSFP-DD modules."
        }
      },
      {
        "id": "team-osfp-400g-sr4",
        "mode": "Multimode",
        "modeClass": "mode-v",
        "desc": "OSFP-400G-SR4: Multimode · 850 nm · MPO-12/APC · 70 m OM3 / 100 m OM4",
        "cmd": "Part: OSFP-400G-SR4   |   Fits: no direct cage match on these fixed-port devices   |   MX304: depends on the installed LMIC",
        "details": "Single-port 400G OSFP SR4, flat top. NVIDIA: single-port 400G OSFP or QSFP112 devices cannot be used in twin-port OSFP switch cages (QM9790, SN5600), only in adapters and DPUs; the single-port OSFP is used in ConnectX-7/OSFP adapters.",
        "flags": [
          [
            "Medium",
            "Multimode · 850 nm"
          ],
          [
            "Connector",
            "MPO-12/APC"
          ],
          [
            "Reach",
            "70 m OM3 / 100 m OM4"
          ],
          [
            "Also used on",
            "Single-port OSFP adapter, such as ConnectX-7/OSFP"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "osfp-400g-sr4"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://resource.naddod.com/files/2025-12-05/osfp-400g-sr4-datasheet-013565.pdf",
              "title": "NADDOD OSFP-400G-SR4 data sheet"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/LinkX-100G-PAM4-Product-Line-Overview",
              "title": "NVIDIA LinkX 100G-PAM4 product line overview: twin-port OSFP, flat vs finned, connectors"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/Transceivers-and-Fiber-Details-100G-PAM4",
              "title": "NVIDIA 100G-PAM4 transceivers: single-port OSFP SR4/DR4 for ConnectX-7"
            }
          ],
          "note": "NADDOD data sheet: flat-top OSFP, 850 nm, one MPO-12/APC, 70 m OM3 / 100 m OM4. NVIDIA: single-port OSFP is flat-top and for ConnectX-7/OSFP adapters only (NVIDIA’s own single-port SR4 is rated 50 m)."
        }
      },
      {
        "id": "team-mma4z00-ns",
        "mode": "Multimode",
        "modeClass": "mode-v",
        "desc": "MMA4Z00-NS: Multimode · 850 nm · 2 × MPO-12/APC · 50 m OM4 / 30 m OM3",
        "cmd": "Part: MMA4Z00-NS   |   Fits: QM9790: Twin OSFP main, SN5600: Twin OSFP main   |   MX304: depends on the installed LMIC",
        "details": "NVIDIA MMA4Z00-NS: finned-top twin-port OSFP, 2 × 400G SR4 (two independent 400G paths). NVIDIA: Quantum-2 and Spectrum-4 switches require finned-top OSFP shells for cooling; the main use is linking two switches, or a switch to ConnectX-7 / BlueField-3 through their 400G transceivers.",
        "flags": [
          [
            "Medium",
            "Multimode · 850 nm"
          ],
          [
            "Connector",
            "2 × MPO-12/APC"
          ],
          [
            "Reach",
            "50 m OM4 / 30 m OM3"
          ],
          [
            "Also used on",
            "NVIDIA Quantum-2 / SN5600 finned twin-port OSFP"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "mma4z00-ns"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking/display/mma4z00-ns-800gb-s-twin-port-osfp-2x400gb-s-multimode-2xsr4-50m.pdf",
              "title": "NVIDIA MMA4Z00-NS product spec (incl. the MMA4Z00-NS-FLT row and the NS400 adapter parts)"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/LinkX-100G-PAM4-Product-Line-Overview",
              "title": "NVIDIA LinkX 100G-PAM4 product line overview: twin-port OSFP, flat vs finned, connectors"
            }
          ],
          "note": "NVIDIA MMA4Z00-NS spec: 850 nm VCSEL, 30 m OM3 / 50 m OM4, two MPO-12/APC, finned top for air-cooled Quantum-2 / Spectrum-4 switches."
        }
      },
      {
        "id": "team-mma4z00-ns-flt",
        "mode": "Multimode",
        "modeClass": "mode-v",
        "desc": "MMA4Z00-NS-FLT: Multimode · 850 nm · 2 × MPO-12/APC · 50 m OM4 · flat top",
        "cmd": "Part: MMA4Z00-NS-FLT   |   Fits: no direct cage match on these fixed-port devices   |   MX304: depends on the installed LMIC",
        "details": "NVIDIA MMA4Z00-NS-FLT is the flat-top version of MMA4Z00-NS, for liquid-cooled and DGX H100 (Cedar7) systems; air-cooled switches need the finned version. ConnectX-7 release notes: used with the MCX750500B/C-0D0K / -0D00 cards ONLY, not with a ConnectX-7 PCIe card such as MCX75310AAS-NEA. ConnectX-8 release notes list it as supported. For a single-port adapter NVIDIA’s part is MMA4Z00-NS400 (OSFP) or MMA1Z00-NS400 (QSFP112).",
        "flags": [
          [
            "Medium",
            "Multimode · 850 nm"
          ],
          [
            "Connector",
            "2 × MPO-12/APC"
          ],
          [
            "Reach",
            "50 m OM4 / 30 m OM3"
          ],
          [
            "Also used on",
            "DGX H100 Cedar7 (ConnectX-7 MCX750500B/C mezzanine cards only), liquid-cooled systems, ConnectX-8"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "mma4z00-ns-flt"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking/display/mma4z00-ns-800gb-s-twin-port-osfp-2x400gb-s-multimode-2xsr4-50m.pdf",
              "title": "NVIDIA MMA4Z00-NS product spec (incl. the MMA4Z00-NS-FLT row and the NS400 adapter parts)"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/nvidia-connectx-7-adapter-cards-firmware-release-notes-v28-45-1016.1016.pdf",
              "title": "NVIDIA ConnectX-7 firmware release notes 28.45.1016: supported cables and modules"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/nvidia-connectx-8-supernic-firmware-release-notes-v40-46-1006.1006.pdf",
              "title": "NVIDIA ConnectX-8 SuperNIC firmware release notes 40.46.1006: supported cables and modules"
            }
          ],
          "note": "Corrected 2026-11-10: the guide called this an adapter-side part. NVIDIA: flat top for liquid-cooled and DGX H100 Cedar7 systems; ConnectX-7 MCX750500B/C only; listed for ConnectX-8. (The guide linked the ConnectX-8 release notes as its data sheet.)"
        }
      },
      {
        "id": "team-osfp-800g-2xdr4",
        "mode": "Single mode",
        "modeClass": "mode-v",
        "desc": "OSFP-800G-2XDR4: Single mode · 1310 nm · 2 × MPO-12/APC · 500 m",
        "cmd": "Part: OSFP-800G-2XDR4   |   Fits: QM9790: Twin OSFP main, SN5600: Twin OSFP main   |   MX304: depends on the installed LMIC",
        "details": "Twin-port 800G OSFP 2×DR4 family. Your units have a finned switch-side shell (operator check); NVIDIA requires finned-top shells in the air-cooled Quantum-2 and Spectrum-4 switches, so they are physical candidates for QM9790 and SN5600. Verify the exact module coding, supported link mode, and switch qualification.",
        "flags": [
          [
            "Medium",
            "Single mode · 1310 nm"
          ],
          [
            "Connector",
            "2 × MPO-12/APC"
          ],
          [
            "Reach",
            "500 m"
          ],
          [
            "Also used on",
            "NADDOD N9500-64OC 800G OSFP switch"
          ]
        ],
        "tip": "A possible cage and speed-class match, not vendor qualification: check the exact part against the switch’s supported list.",
        "tags": [
          "team",
          "optics",
          "transceiver",
          "fit",
          "osfp-800g-2xdr4"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://resource.naddod.com/files/products-Switches/2024-10-29/n9500-64oc-datasheet-v2-2-1-010338.pdf",
              "title": "NADDOD N9500-64OC switch data sheet: compatible-module table"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/LinkX-100G-PAM4-Product-Line-Overview",
              "title": "NVIDIA LinkX 100G-PAM4 product line overview: twin-port OSFP, flat vs finned, connectors"
            }
          ],
          "note": "NADDOD module table: OSFP-800G-2xDR4, OSFP, dual MPO-12 APC, 1310 nm, 500 m over SMF (the guide linked this switch data sheet as the module data sheet). NVIDIA: finned top required in Quantum-2 / Spectrum-4 cages. The finned shell on your units is the team’s observation."
        }
      }
    ]
  },
  {
    "id": "team-optics-families",
    "part": "fo-team-optics",
    "badge": "fam",
    "title": "Optic Families & Adapters",
    "subtitle": "General families per switch, and the team’s BlueField-3 / ConnectX-7 adapter ports",
    "commands": [
      {
        "id": "team-optic-families",
        "mode": "Families",
        "modeClass": "mode-v",
        "desc": "Common optic families per switch: medium, connector and reach",
        "cmd": "Families: 1G SX SFP: Multimode fiber, LC duplex, short reach   |   1G LX SFP: Single mode fiber, LC duplex, longer reach   |   2 × 400G SR4 twin port OSFP: Multimode fiber, 2 × MPO-12/APC, short reach   |   2 × 400G DR4 twin port OSFP: Single mode fiber, 2 × MPO-12/APC, data center reach   |   2 × 400G FR4 twin port OSFP: Single mode fiber, 2 × LC duplex, longer reach   |   400G DR4 QSFP-DD: Single mode fiber, MPO-12/APC, data center reach   |   400G QSFP-DD family: Optic, DAC, or AOC, Varies by module, part specific   |   Passive DAC / AOC: Copper / active optical, Integrated ends, part specific",
        "details": "1G SX SFP (Hasivo, ACS8000, C9200L): An example 1G SFP class, 850 nm multimode (Cisco: 550 m on OM2, 1 km on OM3/OM4). Verify Hasivo qualification and match the peer’s SX optic and supported reach. 1G LX SFP (Hasivo, ACS8000, C9200L): An example 1G SFP class, 1310 nm, up to 10 km on SMF (550 m on MMF only with a mode-conditioning patch cord). Verify Hasivo qualification, exact optic, and permitted distance. 2 × 400G SR4 twin port OSFP (QM9790, SN5600): Finned switch-side twin port module. Two independent 400G paths; inspect both MPO endfaces. 2 × 400G DR4 twin port OSFP (QM9790, SN5600): Parallel single mode paths. Confirm peer, fiber polarity, and exact optical part number. 2 × 400G FR4 twin port OSFP (QM9790, SN5600): Wavelength multiplexed optics. Verify the exact module and mating peer before ordering. 400G DR4 QSFP-DD (SN5400): single-mode QSFP-DD module; NVIDIA says the SN5400 data interfaces take QSFP-DD modules (check its interconnect list for qualified parts). 400G QSFP-DD family (SN5400): QSFP-DD is the cage format. Match the module’s exact optical standard, connector, reach, and qualification. Passive DAC / AOC (QM9790, SN5400, SN5600, 7260CX3, CCR2216, SN2410, N9K-FX3): Factory terminated cable assemblies. Select the correct switch-side shell and peer-side connector; do not treat AOC as field-cleanable fiber.",
        "flags": [],
        "tip": "A cage shape (QSFP, OSFP) does not tell you the protocol or the active speed.",
        "tags": [
          "optics",
          "families",
          "sr4",
          "dr4",
          "fr4",
          "dac",
          "aoc"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/gigabit-ethernet-gbic-sfp-modules/datasheet-c78-366584.html",
              "title": "Cisco 1000BASE SFP modules data sheet: SX / LX cabling table"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/LinkX-100G-PAM4-Product-Line-Overview",
              "title": "NVIDIA LinkX 100G-PAM4 product line overview: twin-port OSFP, flat vs finned, connectors"
            },
            {
              "url": "https://networking-docs.nvidia.com/sn5000hw/data-interfaces-and-high-power-transceivers-support",
              "title": "NVIDIA SN5000 hardware manual: data interfaces and high-power support"
            }
          ],
          "note": "Cisco: 1000BASE-SX 850 nm MMF, 1000BASE-LX/LH 1310 nm (10 km SMF), dual LC. NVIDIA LinkX: twin-port 2×SR4 / 2×DR4 use two MPO-12/APC, 2×FR4 uses two duplex LC; finned top in Quantum-2 / Spectrum-4. Corrected 2026-11-10: NVIDIA does not single out 400G DR4 QSFP-DD for the SN5400."
        }
      },
      {
        "id": "team-adapter-fit",
        "mode": "Adapters",
        "modeClass": "mode-v",
        "desc": "Which team optics fit the BlueField-3 B3220, ConnectX-7 and ConnectX-8 ports",
        "cmd": "Adapter: BlueField-3 B3220 900-9D3B6-00CV-A_Ax, 2 × 200G QSFP112, firmware 32.39.4082 LTS   |   ConnectX-7 MCX75310AAS-NEA_Ax, 1 × 400G OSFP (flat top), firmware 28.39.3004 LTS   |   ConnectX-8: model not yet known (entries are per variant)",
        "details": "QSFP-100G-SR4 / QSFP56-200G-SR4: BF3 and CX8 QSFP112 ports (NVIDIA: QSFP112 cages support QSFP56 and QSFP28 devices). QSFP112-400G-SR4 / -VR4: CX8 QSFP112 variant; on BF3 NVIDIA documents its own 400G QSFP112 SR4 (MMA1Z00-NS400) in BlueField-3/QSFP112 DPUs, running at 200G when only two lanes are lit (1:2 splitter fiber); a third-party module needs the same coding check. OSFP-400G-SR4: CX7 and CX8 OSFP variants (single-port flat-top OSFP is for adapters). MMA4Z00-NS-FLT: not for the CX7 MCX75310AAS-NEA (NVIDIA: MCX750500B/C mezzanine cards only); listed as supported on ConnectX-8. Both firmware versions are real LTS releases with newer LTS builds out (e.g. 28.39.5124, 32.39.5124).",
        "flags": [
          [
            "BF3 B3220",
            "2 × QSFP112, 200GbE default (InfiniBand NDR200)"
          ],
          [
            "CX7 MCX75310AAS-NEA",
            "Single-port OSFP, NDR 400Gb/s / 400GbE (manual lists it as MCX75310AAS-NEAT)"
          ],
          [
            "400G QSFP112 optics on BF3",
            "NVIDIA documents MMA1Z00-NS400 in BlueField-3; others: check coding"
          ]
        ],
        "tip": "Confirm optical coding and firmware support before treating a physical match as usable.",
        "tags": [
          "team",
          "bluefield",
          "connectx",
          "adapter",
          "qsfp112",
          "osfp"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://networking-docs.nvidia.com/bf3dpu",
              "title": "NVIDIA BlueField-3 DPU user guide: B3220 OPNs and ports"
            },
            {
              "url": "https://networking-docs.nvidia.com/connectx7hw",
              "title": "NVIDIA ConnectX-7 adapter user manual: ordering part numbers (MCX75310AAS-NEAT)"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/mma4z00-ns-800gb-s-twin-port-osfp-2x400gb-s-multimode-2xsr4-50m.pdf",
              "title": "NVIDIA MMA4Z00-NS product spec (incl. the MMA4Z00-NS-FLT row and the NS400 adapter parts)"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/nvidia-connectx-7-adapter-cards-firmware-release-notes-v28-45-1016.1016.pdf",
              "title": "NVIDIA ConnectX-7 firmware release notes 28.45.1016: supported cables and modules"
            },
            {
              "url": "https://docs.nvidia.com/networking/display/nvidia-connectx-8-supernic-firmware-release-notes-v40-46-1006.1006.pdf",
              "title": "NVIDIA ConnectX-8 SuperNIC firmware release notes 40.46.1006: supported cables and modules"
            },
            {
              "url": "https://networking-docs.nvidia.com/connectx7fwrn/28393004lts/changes-and-new-features",
              "title": "NVIDIA ConnectX-7 firmware 28.39.3004 LTS release notes"
            },
            {
              "url": "https://networking-docs.nvidia.com/bluefield3fwrn/32394082lts",
              "title": "NVIDIA BlueField-3 firmware 32.39.4082 LTS release notes"
            }
          ],
          "note": "NVIDIA: B3220 900-9D3B6-00CV-AA0 is 2-port QSFP112, 200GbE default; MCX75310AAS-NEAT is single-port OSFP, NDR 400Gb/s / 400GbE; MMA1Z00-NS400 in BlueField-3/QSFP112 DPUs; MMA4Z00-NS-FLT limits from the CX7/CX8 release notes. The part labels and installed firmware are the team’s; both versions exist as NVIDIA LTS releases."
        }
      }
    ]
  },
  {
    "id": "first-link",
    "part": "fo-first-link",
    "badge": "start",
    "title": "First Connection: From a Label to a Live Link",
    "subtitle": "The whole path before touching a cable, the words that matter, and what to do when it stays down",
    "commands": [
      {
        "id": "first-link-five-steps",
        "mode": "Steps",
        "modeClass": "mode-v",
        "desc": "From a cable label to a working link, before touching anything",
        "cmd": "1. Identify both ends: switch and host names, expected ports, cable label   |   2. Find the physical cage: switch model + port name in the front panel   |   3. Match the media: speed, fiber type, connector, polish, reach, peer   |   4. Inspect, clean if needed, re-inspect, then connect   |   5. Verify: link state, speed, every lane’s optical reading",
        "details": "Do this in an approved connection or maintenance window. Check the chassis label against the model you picked. On QM9790 one cage holds two numbered ports. A module that fits is not proof it works. Follow the key and latch without forcing the connector, and keep unused ends capped. Record every lane of a parallel optic.",
        "flags": [],
        "tip": "Open the switch front panel (▦ on the Switches page) to find the cage and record the optic in it.",
        "tags": [
          "first",
          "connection",
          "checklist",
          "cabling"
        ],
        "src": {
          "verified": "",
          "refs": [],
          "note": "From the team’s Switch & Fiber Field Guide (2026-11-10)."
        }
      },
      {
        "id": "first-link-words",
        "mode": "Words",
        "modeClass": "mode-v",
        "desc": "Cage, port, lane, breakout; InfiniBand vs Ethernet; Tx must reach Rx",
        "cmd": "Cage: the physical opening   |   Port: the named link end the system reports   |   Lane: one electrical or optical signal path inside a link   |   Breakout: one cage exposed as several logical links (no extra cages)",
        "details": "A transceiver is the removable module in the cage. QM9790 is an InfiniBand switch; the other packet switches here run Ethernet; ACS8000 is a serial console server. A QSFP or OSFP shape alone does not identify the protocol or speed. Each end transmits and receives: on an LC duplex the two fibers run in opposite directions; on parallel MPO optics the lanes and the cable polarity must line up with both optics. Connector colour is only a clue.",
        "flags": [],
        "tip": "A breakout changes how many interfaces the switch reports, not how many cages you can see.",
        "tags": [
          "cage",
          "port",
          "lane",
          "breakout",
          "infiniband",
          "ethernet",
          "tx",
          "rx"
        ],
        "src": {
          "verified": "",
          "refs": [],
          "note": "From the team’s Switch & Fiber Field Guide (2026-11-10)."
        }
      },
      {
        "id": "first-link-jacket",
        "mode": "Fiber",
        "modeClass": "mode-v",
        "desc": "Read the cable: jacket legend, connector, polish",
        "cmd": "Jacket: OM3 / OM4 / OM5 = multimode, OS2 = single mode; fiber count and length   |   Connector: LC duplex = two fibers; MPO/MTP = one multi-fiber ferrule (key, pins, count, polarity)   |   Polish: APC angled 8° (NVIDIA cables: green), UPC flat (blue): APC and UPC are not compatible, never mate them",
        "details": "Read the printed jacket legend and the connector geometry; colour is a clue, not the check. Record both ends before unplugging. Match the optic’s specified polish and never force a connector.",
        "flags": [],
        "tip": "Never look into a live fiber or transceiver; use an inspection probe made for fiber.",
        "tags": [
          "fiber",
          "jacket",
          "om3",
          "om4",
          "om5",
          "os2",
          "apc",
          "upc",
          "lc",
          "mpo"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking/display/400g100gpam4ovdev/LinkX-100G-PAM4-Product-Line-Overview",
              "title": "NVIDIA LinkX 100G-PAM4 product line overview: twin-port OSFP, flat vs finned, connectors"
            },
            {
              "url": "https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/gigabit-ethernet-gbic-sfp-modules/datasheet-c78-366584.html",
              "title": "Cisco 1000BASE SFP modules data sheet: SX / LX cabling table"
            }
          ],
          "note": "NVIDIA LinkX: MPO-12/APC (green, 8° polish) is not compatible with MPO-12/UPC (blue); LC duplex is 2-fiber. Cisco: 1G SFP ports use duplex LC. The jacket legend and handling steps are the team’s practice from the field guide."
        }
      },
      {
        "id": "qm9790-ib-port-numbers",
        "mode": "IB ports",
        "modeClass": "mode-v",
        "desc": "QM9700 / QM9790: which IB port number is in which cage",
        "cmd": "Cage 1: ports 1 | 2   |   Cage 2: ports 4 | 3   |   Cage 3: ports 5 | 6   |   Cage 4: ports 8 | 7",
        "details": "In the non-splittable profile, the IB tools (ibnetdiscover, iblinkinfo) number the 64 NDR ports so that odd cage n holds 2n−1 (left) and 2n (right), and even cage n holds 2n (left) and 2n−1 (right). Port 65 is an internal port for SHARP. The splittable profile numbers 128 ports differently. MLNX-OS names the same ports 1/<cage>/1 and 1/<cage>/2.",
        "flags": [
          [
            "Non-splittable",
            "64 NDR ports + port 65 (SHARP)"
          ],
          [
            "Splittable",
            "128 NDR200 ports + port 129 (SHARP)"
          ]
        ],
        "tip": "In the front panel, type \"port 3\" on the QM9700 / QM9790 to light up its cage.",
        "tags": [
          "qm9790",
          "qm9700",
          "infiniband",
          "port",
          "numbering",
          "iblinkinfo"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/networking/display/qm97xx-1u-ndr-400gbps-infiniband-switch-systems-user-manual.pdf",
              "title": "NVIDIA QM97XX user manual: logical port numbering schematic (p. 32)"
            }
          ]
        }
      },
      {
        "id": "link-symptoms",
        "mode": "Triage",
        "modeClass": "mode-v",
        "desc": "Pick the symptom you see: absent module, link down, one weak lane, errors",
        "cmd": "Module absent or unreadable: cage, seating, shell type, part coding; cleaning cannot fix it   |   Module present, link down: admin state, breakout, speed, peer, protocol; IB LinkUp but not Active = check the Subnet Manager   |   One lane has low Rx: which lane and which end; peer Tx; MPO polarity; inspect and clean both ends   |   Link up with errors or flaps: counters twice, speed, width, FEC, warnings, temperature, strained fiber",
        "details": "Work from identity and light toward the port and peer: confirm identity, read the link (state, speed, module, alarms, per-lane Tx/Rx against that module’s own thresholds), inspect the path (bend, strain, latch, polish, MPO polarity and pin gender), then swap one known-good part at a time under your change process. If the fault follows the part, record its serial and replace it. A blank or zero optical reading is not always a dead laser: the module may not report it or the port may be disabled.",
        "flags": [],
        "tip": "Change one cable or optic at a time, or you will not know which one fixed it.",
        "tags": [
          "triage",
          "link",
          "down",
          "lane",
          "rx",
          "errors",
          "flap",
          "module"
        ],
        "src": {
          "verified": "",
          "refs": [],
          "note": "From the team’s Switch & Fiber Field Guide (2026-11-10)."
        }
      }
    ]
  }
];

// Optical Specs for Interactive Link Budget Calculator
const OPTIC_SPECS = {
  dr4: {
    name: "400G/800G DR4/DR8 (1310nm OS2)",
    attenPerKm: 0.4,
    mateLoss: 0.35,
    rxSens: -9.4,
    rxOverload: 4.0
  },
  fr4: {
    name: "400G FR4 / CWDM4 (1310nm OS2)",
    attenPerKm: 0.4,
    mateLoss: 0.25,
    rxSens: -10.3,
    rxOverload: 3.5
  },
  sr4: {
    name: "400G/800G SR4/SR8 (850nm OM4)",
    attenPerKm: 3.0,
    mateLoss: 0.35,
    rxSens: -8.2,
    rxOverload: 4.0
  },
  lr4: {
    name: "100G/400G LR4 (1310nm OS2 10km)",
    attenPerKm: 0.35,
    mateLoss: 0.25,
    rxSens: -11.5,
    rxOverload: 4.5
  },
  er4: {
    name: "100G/400G ER4 (1550nm OS2 40km)",
    attenPerKm: 0.22,
    mateLoss: 0.25,
    rxSens: -16.5,
    rxOverload: -1.0
  }
};

// Application State
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("fiber.html", "fiber_cs_bookmarks", FIBER_CHEAT_SHEET_DATA, {"fo-dom-cli":"fo-dom-cli_bookmarks","fo-form-factors":"fo-form-factors_bookmarks","fo-mpo-polarity":"fo-mpo-polarity_bookmarks","fo-cleaning-testing":"fo-cleaning-testing_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("fiber_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(FIBER_CHEAT_SHEET_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: FIBER_CHEAT_SHEET_DATA, label: "Fiber sheets", parts: {
   "fo-team-optics": {"title": "Team Optics & Fit", "subtitle": "The team’s transceiver part labels against the eleven devices, optic families, and the BlueField-3 / ConnectX-7 ports", "pill": "Team parts · 2026-11-10"},
   "fo-first-link": {"title": "First Connection", "subtitle": "From a label to a live link: the steps, the words, reading the cable, QM9790 port numbers, and symptom paths", "pill": "Rack-side · before you cable"},
   "fo-cleaning-testing": {
    "title": "Cleaning & Testing Triage",
    "subtitle": "Inspect-before-you-connect, attenuator protection, FEC bin analysis & fault isolation",
    "pill": "PHY / Optical Transceiver & Physical Layer"
   },
   "fo-dom-cli": {
    "title": "DOM / DDM Telemetry",
    "subtitle": "Linux ethtool -m, NVIDIA mlxlink, SONiC sfputil, Arista EOS & Cisco NX-OS transceiver telemetry",
    "pill": "DOM / Optical Transceiver & Physical Layer"
   },
   "fo-form-factors": {
    "title": "Form Factors & Breakouts",
    "subtitle": "OSFP (Finned vs Flat-top RHS), QSFP-DD, QSFP112, DR8/2xDR4/FR4 & breakout topologies",
    "pill": "XCVR / Optical Transceiver & Physical Layer"
   },
   "fo-mpo-polarity": {
    "title": "MPO Pinning & Polarity",
    "subtitle": "Male vs Female guide pins, Type A/B/C polarity, MPO-12 vs MPO-16 & UPC vs APC ferrules",
    "pill": "CONN / Optical Transceiver & Physical Layer"
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
  // One toast for the whole site: common.js keeps a placeholder warning from being replaced.
  if (window.showGlobalToast) return window.showGlobalToast(msg);
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

function highlightFiberText(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(\s\|\s|──►|◄──)|(\b(?:sudo|ethtool|mlxlink|sfputil|show|grep)\b)|(\b(?:OSFP|QSFP-DD|QSFP112|MPO-12|MPO-16|DR4|DR8|FR4|SR4|SR8|LR4|ER4|ZR|UPC|APC|MALE|FEMALE|DAC|AEC|AOC)\b)|(\s-[a-zA-Z0-9-]+|\s--[a-zA-Z0-9-]+)/g,
    (match, sep, cmd, keyword, flag) => {
      if (sep) return `<span class="tok-pipe">${sep}</span>`;
      if (cmd) return `<span class="tok-cmd">${cmd}</span>`;
      if (keyword) return `<span class="tok-str">${keyword}</span>`;
      if (flag) return `<span class="tok-flag">${flag}</span>`;
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = FIBER_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of FIBER_CHEAT_SHEET_DATA) {
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

  for (const section of FIBER_CHEAT_SHEET_DATA) {
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
          ? item.cmd.split("   |   ")[0].trim()
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
                  title="${isSaved ? "Remove bookmark" : "Bookmark item"}"
                  aria-label="Bookmark item"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(copyTarget)}" title="Click to copy">
              <code class="cmd-code">${highlightFiberText(item.cmd)}</code>
              <span class="copy-hint">Copy</span>
            </div>
            ${item.details ? `<p class="cmd-details">${escapeHtml(item.details)}</p>` : ""}

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

// Interactive Optical Link Budget & dBm <-> mW Calculator
function initFiberCalculator() {
  const opticEl = document.getElementById("fib-optic");
  const distEl = document.getElementById("fib-dist");
  const matesEl = document.getElementById("fib-mates");
  const txEl = document.getElementById("fib-tx");
  const rxDbmEl = document.getElementById("fib-rx-dbm");
  const rxMwEl = document.getElementById("fib-rx-mw");
  const marginPill = document.getElementById("fib-margin-pill");
  const meaningEl = document.getElementById("fib-meaning-text");
  const presetBtns = document.querySelectorAll(".fib-preset");

  function updateLinkBudget() {
    const opticKey = opticEl.value;
    const spec = OPTIC_SPECS[opticKey] || OPTIC_SPECS.dr4;
    const distKm = parseFloat(distEl.value) || 0.1;
    const panels = parseInt(matesEl.value, 10) || 0;
    const txDbm = parseFloat(txEl.value) || 0;

    // Total loss = fiber attenuation + panel insertions + 2 transceiver end-connector insertions (0.5 dB total)
    const fiberLoss = distKm * spec.attenPerKm;
    const panelLoss = panels * spec.mateLoss;
    const endMateLoss = 0.5;
    const totalLoss = fiberLoss + panelLoss + endMateLoss;

    const estRxDbm = txDbm - totalLoss;
    const estRxMw = Math.pow(10, estRxDbm / 10);
    const margin = estRxDbm - spec.rxSens;

    rxDbmEl.textContent = `${estRxDbm >= 0 ? "+" : ""}${estRxDbm.toFixed(2)} dBm`;
    rxMwEl.textContent = `${estRxMw.toFixed(2)} mW`;

    if (estRxDbm > spec.rxOverload) {
      marginPill.textContent = `OVERLOAD (> ${spec.rxOverload} dBm — Add Attenuator!)`;
      marginPill.style.color = "var(--accent-red)";
    } else if (margin < 0) {
      marginPill.textContent = `Margin: ${margin.toFixed(2)} dB (FAIL / RX_LOS)`;
      marginPill.style.color = "var(--accent-red)";
    } else if (margin < 2.0) {
      marginPill.textContent = `Margin: +${margin.toFixed(2)} dB (TIGHT MARGIN)`;
      marginPill.style.color = "var(--accent-amber)";
    } else {
      marginPill.textContent = `Margin: +${margin.toFixed(2)} dB (HEALTHY PASS)`;
      marginPill.style.color = "var(--accent-green)";
    }

    meaningEl.innerHTML = `Total Loss: <strong>${totalLoss.toFixed(2)} dB</strong> (Fiber: ${fiberLoss.toFixed(2)} dB + ${panels} panels @ ${spec.mateLoss} dB + 0.50 dB transceiver coupling) | Min RX Sens: <strong>${spec.rxSens} dBm</strong>`;

    presetBtns.forEach((btn) => {
      const active =
        btn.dataset.optic === opticKey &&
        btn.dataset.dist === distEl.value &&
        btn.dataset.mates === matesEl.value &&
        btn.dataset.tx === txEl.value;
      btn.classList.toggle("active", active);
    });
  }

  [opticEl, distEl, matesEl, txEl].forEach((sel) => {
    sel.addEventListener("change", updateLinkBudget);
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      opticEl.value = btn.dataset.optic;
      distEl.value = btn.dataset.dist;
      matesEl.value = btn.dataset.mates;
      txEl.value = btn.dataset.tx;
      updateLinkBudget();
    });
  });

  updateLinkBudget();
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
        showToast("Removed from saved items");
      } else {
        state.bookmarks.add(id);
        showToast("Saved to bookmarks");
      }
      localStorage.setItem("fiber_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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

applyTheme(state.theme);
renderCategoryTabs();
renderSections();
initFiberCalculator();
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
