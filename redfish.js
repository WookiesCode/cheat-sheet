const REDFISH_CHEAT_SHEET_DATA = [
  {
    part: "rf-discovery",
    id: "discovery-auth",
    badge: "auth",
    title: "Discovery, Session Tokens & ETag Headers",
    subtitle: "ServiceRoot inspection, dynamic member URI discovery, X-Auth-Token & $expand",
    commands: [
      {
        id: "rf-service-root-discover",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Query `/redfish/v1` ServiceRoot over IPv6 (`-g -6`) and dynamically discover System & Manager URIs",
        cmd: 'SYS_URI=$(curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems" | jq -r \'.Members[0]."@odata.id"\') && echo "$SYS_URI"',
        flags: [
          ["-g -6", "-g turns off URL globbing (curl already accepts numeric [IPv6] addresses without it; -g matters when a URL has other [ ] or { }); -6 resolves names to IPv6 only"],
          ['.Members[0]."@odata.id"', "Extracts exact vendor-specific URI (/redfish/v1/Systems/1, or whatever Id the vendor chose)"],
          ["-sk", "-s silent mode, -k ignore self-signed BMC TLS certificate (use %25eth0 for link-local fe80:: addresses)"]
        ],
        tip: "Link-local BMC address? Write the zone as %25, e.g. [fe80::1%25eth0]",
        tags: ["discover", "serviceroot", "systems", "uri", "members", "jq", "ipv6"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://curl.se/docs/manpage.html", "title": "curl man page"}, {"url": "https://curl.se/docs/url-syntax.html", "title": "curl URL syntax"}], "note": "Corrected 2026-11-09: -g is not needed for numeric IPv6 addresses (curl detects them); kept because it is harmless."}
      },
      {
        id: "rf-session-token-create",
        mode: "POST",
        modeClass: "mode-i",
        desc: "Create a Redfish Session Token (`X-Auth-Token`) to avoid slow Basic Auth hashing on every request",
        cmd: 'curl -g -6 -sk -D - -X POST "https://[$BMC]/redfish/v1/SessionService/Sessions" -H "Content-Type: application/json" -d "{\\"UserName\\":\\"$BMC_USER\\",\\"Password\\":\\"$BMC_PASS\\"}"',
        flags: [
          ["X-Auth-Token:", "Grab token from response headers and pass via -H 'X-Auth-Token: <token>' on subsequent requests"],
          ["Location:", "Session URI (e.g. .../Sessions/1) — send HTTP DELETE to this URI when done to avoid exhausting BMC session slots!"]
        ],
        tip: "10x faster than Basic Auth",
        tags: ["session", "token", "x-auth-token", "login", "auth", "delete"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "Redfish Specification DSP0266 1.25"}], "note": "\"Faster than Basic Auth\" is a rule of thumb, not from the spec."}
      },
      {
        id: "rf-expand-query-param",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Use `$expand=.($levels=1)` to fetch an entire collection's child objects in a single HTTP call",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/1/Memory?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Name, CapacityMiB, Manufacturer, SerialNumber, Status}\'',
        flags: [
          ["$expand=.($levels=1)", "Inlines all Member objects instead of returning only @odata.id links"],
          ["only", "Query parameter only (no $): if the collection has exactly one member, return that member instead of the collection"]
        ],
        tip: "Avoids N+1 HTTP loop",
        tags: ["expand", "levels", "collection", "batch", "fast"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "Redfish Specification DSP0266 1.25"}], "note": "Corrected 2026-11-09: the single-member parameter is only, not $only."}
      }
    ]
  },
  {
    "part": "rf-discovery",
    "id": "discovery-auth-pro-tips",
    "badge": "tip",
    "title": "Discovery & Auth: Pro Tips & Best Practices",
    "subtitle": "Production Redfish API Discovery & Authentication Best Practices",
    "commands": [
      {
        "id": "discovery-auth-tips-card",
        "desc": "Production Redfish API Discovery & Authentication Best Practices",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1\" | jq .",
        "details": "Start at the service root (/redfish/v1) and follow the @odata.id links instead of hard-coding vendor paths. For scripts, log in once with a POST to /redfish/v1/SessionService/Sessions and send the returned X-Auth-Token header on later requests instead of Basic auth on every call.",
        "flags": [
          [
            "-g",
            "Turn off curl URL globbing so [IPv6] brackets in the URL work"
          ],
          [
            "-k",
            "Skip TLS certificate checks (BMCs often use self-signed certificates)"
          ],
          [
            "-H \"X-Auth-Token: <token>\"",
            "Send the session token instead of Basic auth"
          ]
        ],
        "tip": "When the script finishes, DELETE the session URI from the Location header; otherwise the session stays open until it times out.",
        "tags": [
          "discovery-auth",
          "tips",
          "pro",
          "redfish",
          "rest",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf",
              "title": "DMTF DSP0266 Redfish Specification 1.25.0"
            },
            {
              "url": "https://curl.se/docs/manpage.html",
              "title": "curl man page"
            }
          ]
        }
      }
    ]
  },
  {
    part: "rf-power-boot",
    id: "power-boot",
    badge: "pwr",
    title: "Chassis Power Control & Boot Overrides",
    subtitle: "ComputerSystem.Reset actions, one-time UEFI PXE boot, BIOS Setup boot & NMI crash dump",
    commands: [
      {
        id: "rf-power-state-reset",
        mode: "POST",
        modeClass: "mode-t",
        desc: "Check current server power state or execute `ComputerSystem.Reset` (On, ForceOff, ForceRestart, PowerCycle)",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/Systems/1/Actions/ComputerSystem.Reset" -H "Content-Type: application/json" -d \'{"ResetType": "PowerCycle"}\'',
        flags: [
          ["PowerCycle", "Cold DC power off followed by power on"],
          ["ForceRestart / GracefulRestart", "Immediate warm reset vs ACPI OS reboot"],
          ["ResetType@Redfish.AllowableValues", "Inspect Actions.#ComputerSystem.Reset in GET /Systems/1 to see supported ResetTypes"]
        ],
        tags: ["power", "reset", "reboot", "powercycle", "forceoff", "on"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Resource.json", "title": "Redfish schema: ResetType"}, {"url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.json", "title": "Redfish schema: ComputerSystem"}], "note": "ResetType@Redfish.AllowableValues was not confirmed in the schema text read; GET the system to see what your BMC offers."}
      },
      {
        id: "rf-boot-override-pxe",
        mode: "PATCH",
        modeClass: "mode-c",
        desc: "Set one-time UEFI PXE network boot on next restart (`BootSourceOverrideTarget: Pxe`)",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X PATCH "https://[$BMC]/redfish/v1/Systems/1" -H "Content-Type: application/json" -d \'{"Boot": {"BootSourceOverrideTarget": "Pxe", "BootSourceOverrideEnabled": "Once", "BootSourceOverrideMode": "UEFI"}}\'',
        flags: [
          ["BootSourceOverrideEnabled", "'Once' (single reboot), 'Continuous' (permanent), or 'Disabled'"],
          ["BootSourceOverrideTarget", "'Pxe', 'BiosSetup', 'Cd', 'Hdd', 'UefiHttp', 'UefiShell', 'None'"]
        ],
        tip: "Follow with ForceRestart",
        tags: ["pxe", "boot", "uefi", "override", "once", "network"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.json", "title": "Redfish schema: ComputerSystem"}]}
      },
      {
        id: "rf-boot-into-bios",
        mode: "PATCH",
        modeClass: "mode-c",
        desc: "Force server to boot directly into UEFI/BIOS Setup utility on next reboot",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X PATCH "https://[$BMC]/redfish/v1/Systems/1" -H "Content-Type: application/json" -d \'{"Boot": {"BootSourceOverrideTarget": "BiosSetup", "BootSourceOverrideEnabled": "Once"}}\'',
        flags: [
          ["BiosSetup", "Enters BIOS setup automatically on next boot (viewable via SOL or HTML5 KVM)"]
        ],
        tags: ["bios", "setup", "boot", "uefi"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.json", "title": "Redfish schema: ComputerSystem"}]}
      },
      {
        id: "rf-trigger-nmi",
        mode: "POST",
        modeClass: "mode-t",
        desc: "Send diagnostic Non-Maskable Interrupt (`Nmi`) to hung OS to trigger kernel kdump crash dump",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/Systems/1/Actions/ComputerSystem.Reset" -H "Content-Type: application/json" -d \'{"ResetType": "Nmi"}\'',
        flags: [
          ["Nmi", "Triggers kernel panic/kdump when Linux kernel is hard-locked (`kernel.unknown_nmi_panic=1`)"]
        ],
        danger: "Panics OS kernel for kdump",
        tags: ["nmi", "kdump", "crash", "hang", "panic", "diagnostic"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Resource.json", "title": "Redfish schema: ResetType"}]}
      }
    ]
  },
  {
    "part": "rf-power-boot",
    "id": "power-boot-pro-tips",
    "badge": "tip",
    "title": "Power & Boot: Pro Tips & Best Practices",
    "subtitle": "Chassis Power State Triage & Boot Target Verification",
    "commands": [
      {
        "id": "power-boot-tips-card",
        "desc": "Chassis Power State Triage & Boot Target Verification",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc -X POST \"https://[$BMC]/redfish/v1/Systems/1/Actions/ComputerSystem.Reset\" -H \"Content-Type: application/json\" -d '{\"ResetType\":\"GracefulRestart\"}'",
        "details": "GracefulShutdown and GracefulRestart ask the OS to shut down cleanly. If the kernel is hung, ForceRestart restarts without the OS, or Nmi sends a diagnostic interrupt so a kdump-configured kernel can write a crash dump. Read ResetType@Redfish.AllowableValues on the action first: each BMC supports a different subset.",
        "flags": [
          [
            "GracefulRestart",
            "Clean OS shutdown, then restart"
          ],
          [
            "ForceRestart",
            "Immediate non-graceful restart (no OS shutdown)"
          ],
          [
            "Nmi",
            "Diagnostic interrupt (usually an NMI on x86); typically halts the system"
          ]
        ],
        "tip": "BootSourceOverrideEnabled \"Once\" goes back to Disabled after one boot; \"Continuous\" keeps the override until you cancel it.",
        "tags": [
          "power-boot",
          "tips",
          "pro",
          "redfish",
          "rest",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Resource.json",
              "title": "DMTF Resource schema (ResetType, Status)"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.v1_29_0.json",
              "title": "DMTF ComputerSystem v1.29.0"
            },
            {
              "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf",
              "title": "DMTF DSP0266 Redfish Specification 1.25.0"
            }
          ],
          "note": "Corrected 2026-11-10: ForceRestart was described as a 4-second power-button hold, and Nmi as a sysrq trigger. Systems/1 is a common ID; read /redfish/v1/Systems for yours."
        }
      }
    ]
  },
  {
    part: "rf-inventory",
    id: "inventory-hw",
    badge: "inv",
    title: "Hardware Inventory: CPU, Memory, Drives & PCIe",
    subtitle: "DIMM health & serial numbers, CPU/GPU processors, NVMe drives & NIC MAC addresses",
    commands: [
      {
        id: "rf-dimm-memory-health",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Audit all populated RAM DIMM slots, capacity, speed, part/serial numbers, and ECC health status",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/1/Memory?\\$expand=.(\\$levels=1)" | jq \'.Members[] | select(.Status.State=="Enabled") | {Id, DeviceLocator, CapacityMiB, OperatingSpeedMhz, Manufacturer, PartNumber, SerialNumber, Health: .Status.Health}\'',
        flags: [
          ["select(.Status.State==\"Enabled\")", "Filters out empty/unpopulated DIMM sockets (`State: Absent`)"],
          ["DeviceLocator", "Slot label (e.g. DIMM_A1). Deprecated in the schema in favor of Location.PartLocation.ServiceLabel; many BMCs still fill it"]
        ],
        tip: "Pinpoints faulty DIMM slot label",
        tags: ["memory", "dimm", "ram", "serial", "ecc", "slot", "health"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Memory.v1_24_0.json", "title": "Redfish schema: Memory"}], "note": "DeviceLocator is deprecated in favor of Location.PartLocation.ServiceLabel."}
      },
      {
        id: "rf-processors-cpu-gpu",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Inspect all CPUs and baseboard GPUs (`ProcessorType: CPU` vs `Accelerator`) with core counts and health",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/1/Processors?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Id, ProcessorType, Model, TotalCores, TotalThreads, SerialNumber, Status}\'',
        flags: [
          ["ProcessorType", "'CPU', 'GPU', 'FPGA', 'DSP', 'Accelerator', 'Core', 'Thread', 'Partition' or 'OEM' (the schema has no DPU type)"],
          ["ProcessorMetrics", "Follow ProcessorMetrics.@odata.id for out-of-band GPU/CPU bandwidth, temp & ECC metrics"]
        ],
        tags: ["cpu", "gpu", "processors", "cores", "model", "serial"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Processor.v1_24_0.json", "title": "Redfish schema: Processor"}, {"url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.json", "title": "Redfish schema: ComputerSystem"}], "note": "Corrected 2026-11-09: there is no DPU ProcessorType."}
      },
      {
        id: "rf-storage-nvme-drives",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Inspect storage controllers, NVMe/SAS/SATA drive health, wear life remaining, and serial numbers",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/1/Storage?\\$expand=.(\\$levels=2)" | jq \'.Members[].Drives[]? | {Id, Name, Model, SerialNumber, CapacityBytes, MediaType, PredictedMediaLifeLeftPercent, Status}\'',
        flags: [
          ["PredictedMediaLifeLeftPercent", "SSD/NVMe wear-out indicator (100 = new, 0 = worn out)"],
          ["FailurePredicted", "Boolean SMART pre-fail warning flag"]
        ],
        tags: ["storage", "nvme", "ssd", "drives", "smart", "wear", "raid"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Drive.v1_22_0.json", "title": "Redfish schema: Drive"}]}
      },
      {
        id: "rf-network-mac-addresses",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Collect host & BMC NIC MAC addresses, IPv6 addresses, SLAAC/DHCPv6 state, and link status out-of-band",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Managers/1/EthernetInterfaces?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Id, MACAddress, IPv6DefaultGateway, IPv6Addresses}\'',
        flags: [
          ["IPv6Addresses / IPv6StaticAddresses", "Inspect assigned global unicast, SLAAC, DHCPv6, and link-local fe80:: addresses on BMC or host NICs"],
          ["MACAddress", "Hardware MAC address of onboard LOM and PCIe network adapters (for DHCPv6 DUID / PXEv6)"]
        ],
        tip: "Essential for zero-touch IPv6 PXE",
        tags: ["mac", "nic", "ethernet", "pxe", "ipv6", "dhcpv6", "slaac", "provisioning"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/EthernetInterface.v1_12_6.json", "title": "Redfish schema: EthernetInterface"}]}
      }
    ]
  },
  {
    "part": "rf-inventory",
    "id": "inventory-hw-pro-tips",
    "badge": "tip",
    "title": "Hardware Inventory: Pro Tips & Best Practices",
    "subtitle": "Automated Node Audit & Hardware Baseline Verification",
    "commands": [
      {
        "id": "inventory-hw-tips-card",
        "desc": "Automated Node Audit & Hardware Baseline Verification",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/Systems/1/Memory?\\$expand=.(\\$levels=1)\" | jq '.Members[] | {Slot: .Id, Cap: .CapacityMiB, Health: .Status.Health}'",
        "details": "At provisioning, read Systems/1/Memory and Processors and compare DIMM count, capacity and core counts with the build sheet before the node joins Slurm or Kubernetes. Keep the backslash in \\$expand: inside double quotes the shell would otherwise replace $expand with nothing. Not every BMC supports $expand (see ProtocolFeaturesSupported in the service root).",
        "flags": [
          [
            "Memory",
            "CapacityMiB, OperatingSpeedMhz, Manufacturer, PartNumber, SerialNumber, Status"
          ],
          [
            "Processors",
            "ProcessorType (CPU, GPU, ...), Model, TotalCores, TotalThreads"
          ],
          [
            "Storage",
            "Controllers and Drives; drives report PredictedMediaLifeLeftPercent where supported"
          ]
        ],
        "tip": "Status.HealthRollup on a parent resource covers it and everything under it, so one read flags a failing child.",
        "tags": [
          "inventory-hw",
          "tips",
          "pro",
          "redfish",
          "rest",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Memory.v1_24_0.json",
              "title": "DMTF Memory v1.24.0"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Processor.v1_24_0.json",
              "title": "DMTF Processor v1.24.0"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Resource.json",
              "title": "DMTF Resource schema (ResetType, Status)"
            },
            {
              "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf",
              "title": "DMTF DSP0266 Redfish Specification 1.25.0"
            }
          ],
          "note": "Corrected 2026-11-10: the command now escapes $expand and $levels so the shell leaves them alone."
        }
      }
    ]
  },
  {
    part: "rf-thermals-power",
    id: "thermals-power-sensors",
    badge: "sns",
    title: "Thermals, Power Supplies, Fans & UID LED",
    subtitle: "Inlet/exhaust temperatures, fan RPMs, PSU input/output wattage & Chassis indicator LED",
    commands: [
      {
        id: "rf-chassis-thermal-temps-fans",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Read all Chassis temperature sensors (°C) and cooling fan speeds (RPM / %)",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Chassis/1/Thermal" | jq \'{Temps: [.Temperatures[] | {Name, ReadingCelsius, UpperThresholdCritical, Health: .Status.Health}], Fans: [.Fans[] | {Name, Reading, ReadingUnits, Health: .Status.Health}]}\'',
        flags: [
          ["/Chassis/1/Sensors", "Thermal and Power are deprecated in the schema (ThermalSubsystem, PowerSubsystem and Sensors replace them); many BMCs still serve them"]
        ],
        tags: ["thermal", "temperature", "fans", "rpm", "cooling", "inlet"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Thermal.json", "title": "Redfish schema: Thermal (deprecated)"}, {"url": "https://redfish.dmtf.org/schemas/v1/Chassis.v1_29_0.json", "title": "Redfish schema: Chassis"}], "note": "Thermal is deprecated (ThermalSubsystem/Sensors); it still works on many BMCs."}
      },
      {
        id: "rf-chassis-power-psus",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Check live server power consumption (Watts), power cap, and redundant Power Supply (PSU) health",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Chassis/1/Power" | jq \'{PowerConsumedWatts: .PowerControl[0].PowerConsumedWatts, PSUs: [.PowerSupplies[] | {Name, Model, SerialNumber, PowerInputWatts, LineInputVoltage, Status}]}\'',
        flags: [
          ["PowerConsumedWatts", "Current real-time chassis power draw in Watts"],
          ["LineInputVoltage", "Verify both PSUs have active AC/HVDC input voltage (catches unplugged B-feed cords!)"]
        ],
        tip: "Catches dead A/B PDU feeds",
        tags: ["power", "psu", "watts", "voltage", "redundant", "chassis"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Power.json", "title": "Redfish schema: Power (deprecated)"}, {"url": "https://redfish.dmtf.org/schemas/v1/Chassis.v1_29_0.json", "title": "Redfish schema: Chassis"}], "note": "Power is deprecated (PowerSubsystem/Sensors); it still works on many BMCs."}
      },
      {
        id: "rf-chassis-uid-led",
        mode: "PATCH",
        modeClass: "mode-c",
        desc: "Turn on or blink the physical Chassis UID Locator LED to help datacenter techs find the server",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X PATCH "https://[$BMC]/redfish/v1/Chassis/1" -H "Content-Type: application/json" -d \'{"LocationIndicatorActive": true}\'',
        flags: [
          ["LocationIndicatorActive", "true = turn on / blink blue UID LED; false = turn off (replaces deprecated IndicatorLED)"]
        ],
        tags: ["led", "uid", "identify", "locate", "blink", "chassis"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Chassis.v1_29_0.json", "title": "Redfish schema: Chassis"}]}
      }
    ]
  },
  {
    "part": "rf-thermals-power",
    "id": "thermals-power-sensors-pro-tips",
    "badge": "tip",
    "title": "Thermals & Sensors: Pro Tips & Best Practices",
    "subtitle": "Thermal Triage & Power Supply Redundancy Telemetry",
    "commands": [
      {
        "id": "thermals-power-sensors-tips-card",
        "desc": "Thermal Triage & Power Supply Redundancy Telemetry",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/Chassis/1/Thermal\" | jq '.Temperatures[] | {Sensor: .Name, Reading: .ReadingCelsius, UpperThresh: .UpperThresholdCritical}'",
        "details": "Chassis Thermal lists temperature sensors (CPU, inlet, DIMM zones, ...) and fans; Chassis Power lists power use and each PSU. Before trusting A/B feed redundancy, check that every PSU is healthy and shows input voltage. Both resources are deprecated in favour of ThermalSubsystem and PowerSubsystem but many BMCs still serve them.",
        "flags": [
          [
            "Thermal",
            "Temperatures[] with thresholds; Fans[] with Reading and ReadingUnits (RPM or Percent)"
          ],
          [
            "Power",
            "PowerControl (watts used), PowerSupplies[] (input voltage, health), Redundancy"
          ],
          [
            "LocationIndicatorActive",
            "true/false identify LED; replaces the deprecated IndicatorLED (Lit, Blinking, Off)"
          ]
        ],
        "tip": "To find the server in the rack, PATCH {\"LocationIndicatorActive\": true} on the Chassis (older BMCs: IndicatorLED \"Blinking\").",
        "tags": [
          "thermals-power-sensors",
          "tips",
          "pro",
          "redfish",
          "rest",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Thermal.json",
              "title": "DMTF Thermal schema (deprecated)"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Power.json",
              "title": "DMTF Power schema (deprecated)"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Chassis.v1_29_0.json",
              "title": "DMTF Chassis v1.29.0"
            }
          ],
          "note": "Corrected 2026-11-10: IndicatorLED is deprecated in favour of LocationIndicatorActive."
        }
      }
    ]
  },
  {
    part: "rf-logs-sel",
    id: "logs-sel",
    badge: "log",
    title: "System Event Logs (SEL), Faults & ClearLog",
    subtitle: "Querying BMC hardware event logs, filtering Critical/Warning events & clearing SEL",
    commands: [
      {
        id: "rf-sel-entries-dump",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Fetch BMC System Event Log (SEL) entries and format timestamp, severity, and message",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Managers/1/LogServices/Sel/Entries" | jq -r \'.Members[] | "\\(.Created) [\\(.Severity)] \\(.Message)"\' | tail -n 30',
        flags: [
          ["/Managers/1/LogServices", "Query /LogServices first to see vendor log IDs (e.g. Sel, Lclog, Log1, EventLog, FaultList)"],
          ["/Systems/1/LogServices", "Some BMCs (OpenBMC HostLogger, NVIDIA HGX) also mount host/FDR logs under /Systems/<id>/LogServices"]
        ],
        tags: ["sel", "logs", "events", "history", "lclog", "iml"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/LogService.v1_9_0.json", "title": "Redfish schema: LogService"}, {"url": "https://redfish.dmtf.org/schemas/v1/LogEntry.v1_22_0.json", "title": "Redfish schema: LogEntry"}], "note": "The log service ID (Sel here) is vendor-specific: list /LogServices first."}
      },
      {
        id: "rf-sel-filter-critical",
        mode: "GET",
        modeClass: "mode-t",
        desc: "Filter SEL entries to show only `Critical` or `Warning` hardware assertions",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Managers/1/LogServices/Sel/Entries" | jq \'.Members[] | select(.Severity == "Critical" or .Severity == "Warning") | {Id, Created, Severity, Message, SensorType}\'',
        flags: [
          ["Severity", "'OK', 'Warning', or 'Critical'"]
        ],
        tip: "Fast root-cause triage",
        tags: ["critical", "warning", "faults", "filter", "triage"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/LogEntry.v1_22_0.json", "title": "Redfish schema: LogEntry"}]}
      },
      {
        id: "rf-sel-clear-log",
        mode: "POST",
        modeClass: "mode-c",
        desc: "Clear all entries in the BMC System Event Log via `LogService.ClearLog` action",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/Managers/1/LogServices/Sel/Actions/LogService.ClearLog" -H "Content-Type: application/json" -d \'{}\'',
        flags: [
          ["LogService.ClearLog", "Resets SEL capacity counter after hardware replacement/repair"]
        ],
        tags: ["clear", "sel", "reset", "logs"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/LogService.v1_9_0.json", "title": "Redfish schema: LogService"}], "note": "ClearLog may require the LogEntriesETag parameter (HTTP 428 without it)."}
      }
    ]
  },
  {
    "part": "rf-logs-sel",
    "id": "logs-sel-pro-tips",
    "badge": "tip",
    "title": "Logs & SEL Triage: Pro Tips & Best Practices",
    "subtitle": "Hardware Event Log Analysis & Pre-Failure Detection",
    "commands": [
      {
        "id": "logs-sel-tips-card",
        "desc": "Hardware Event Log Analysis & Pre-Failure Detection",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc --get --data-urlencode \"\\$filter=Severity eq 'Critical'\" \"https://[$BMC]/redfish/v1/Managers/1/LogServices/Sel/Entries\" | jq .",
        "details": "BMC event logs record hardware events the BMC sees even when the OS is down (memory ECC, PSU loss, thermal trips, PCIe errors). Log service names and places vary by vendor (Sel, SEL, EventLog; under Managers or Systems), so list .../LogServices first. $filter is optional in Redfish and a BMC that lacks it ignores it: if every entry comes back, filter with jq select(.Severity == \"Critical\") instead.",
        "flags": [
          [
            "LogServices",
            "List the log services this BMC has, then read each one's Entries"
          ],
          [
            "--data-urlencode \"\\$filter=Severity eq 'Critical'\"",
            "Server-side filter, URL-encoded by curl (Severity is OK, Warning or Critical)"
          ],
          [
            "LogService.ClearLog",
            "Action that clears the log (changes state)"
          ]
        ],
        "tip": "Export and archive the entries before LogService.ClearLog during an RMA or re-provisioning.",
        "tags": [
          "logs-sel",
          "tips",
          "pro",
          "redfish",
          "rest",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://redfish.dmtf.org/schemas/v1/LogService.v1_9_0.json",
              "title": "DMTF LogService v1.9.0"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/LogEntry.v1_22_0.json",
              "title": "DMTF LogEntry v1.22.0"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Resource.json",
              "title": "DMTF Resource schema (ResetType, Status)"
            },
            {
              "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf",
              "title": "DMTF DSP0266 Redfish Specification 1.25.0"
            },
            {
              "url": "https://curl.se/docs/manpage.html",
              "title": "curl man page"
            }
          ],
          "note": "Corrected 2026-11-10: EventLog is not a standard path, and the old command lost $filter to the shell and sent spaces unencoded."
        }
      }
    ]
  },
  {
    part: "rf-bios-bmc",
    id: "bios-vmedia-bmc",
    badge: "bmc",
    title: "BIOS Settings, Virtual Media ISO & BMC Reset",
    subtitle: "Reading/patching BIOS attributes, mounting HTTP ISOs & rebooting the BMC",
    commands: [
      {
        id: "rf-bios-read-patch",
        mode: "GET / PATCH",
        modeClass: "mode-c",
        desc: "Inspect current BIOS attributes or stage pending BIOS settings for next server reboot",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/1/Bios" | jq \'.Attributes\'   |   curl -g -6 -sk -K ~/.bmc-curlrc -X PATCH "https://[$BMC]/redfish/v1/Systems/1/Bios/Settings" -H "Content-Type: application/json" -d \'{"Attributes": {"SriovGlobalEnable": "Enabled"}}\'',
        flags: [
          ["/Bios", "Shows currently active BIOS attributes from last boot"],
          ["/Bios/Settings", "The settings object: its URI is in @Redfish.Settings.SettingsObject from GET /Bios (often /Bios/Settings); changes apply on the next reboot"],
          ["If-Match", "HTTP 428 = If-Match missing; HTTP 412 = stale ETag: GET it again and send the fresh ETag in If-Match (some BMCs also accept *)"]
        ],
        tip: "PATCH goes to /Bios/Settings",
        tags: ["bios", "attributes", "settings", "sriov", "iommu", "patch"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Bios.v1_3_0.json", "title": "Redfish schema: Bios"}, {"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "Redfish Specification DSP0266 1.25"}], "note": "Corrected 2026-11-09: the settings URI comes from @Redfish.Settings; 412 means a stale ETag, 428 a missing one."}
      },
      {
        id: "rf-virtual-media-mount",
        mode: "POST",
        modeClass: "mode-c",
        desc: "Mount a remote OS installer ISO over IPv6 HTTP/HTTPS via BMC Virtual Media (`InsertMedia`)",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/Managers/1/VirtualMedia/CD1/Actions/VirtualMedia.InsertMedia" -H "Content-Type: application/json" -d \'{"Image": "http://[2001:db8:dc::5]:8000/ubuntu-24.04-live-server-amd64.iso", "Inserted": true, "WriteProtected": true}\'',
        flags: [
          ["VirtualMedia.InsertMedia", "Attaches remote HTTP/HTTPS/NFS/SMB ISO as virtual USB CD/DVD drive to host"],
          ["VirtualMedia.EjectMedia", "POST '{}' to .../Actions/VirtualMedia.EjectMedia to unmount ISO"]
        ],
        tip: "Pair with BootTarget: Cd",
        tags: ["virtualmedia", "iso", "mount", "cdrom", "install", "http"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/VirtualMedia.v1_7_0.json", "title": "Redfish schema: VirtualMedia"}]}
      },
      {
        id: "rf-bmc-manager-reset",
        mode: "POST",
        modeClass: "mode-c",
        desc: "Reboot the Out-of-Band BMC controller itself without disrupting the running host OS",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/Managers/1/Actions/Manager.Reset" -H "Content-Type: application/json" -d \'{"ResetType": "GracefulRestart"}\'',
        flags: [
          ["GracefulRestart / ForceRestart", "Reboots only the BMC management processor (host OS & workloads keep running)"]
        ],
        tags: ["bmc", "manager", "reset", "reboot"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Manager.v1_25_0.json", "title": "Redfish schema: Manager"}]}
      }
    ]
  },
  {
    "part": "rf-bios-bmc",
    "id": "bios-vmedia-bmc-pro-tips",
    "badge": "tip",
    "title": "BIOS & BMC Control: Pro Tips & Best Practices",
    "subtitle": "Out-of-Band OS Deployment via Virtual Media & BIOS Tuning",
    "commands": [
      {
        "id": "bios-vmedia-bmc-tips-card",
        "desc": "Out-of-Band OS Deployment via Virtual Media & BIOS Tuning",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc -X POST \"https://[$BMC]/redfish/v1/Managers/1/VirtualMedia/CD/Actions/VirtualMedia.InsertMedia\" -H \"Content-Type: application/json\" -d '{\"Image\":\"https://example.com/ubuntu-24.04.iso\"}'",
        "details": "Virtual Media attaches a remote ISO (HTTP, HTTPS, NFS, CIFS and others, per TransferProtocolType) to the host as a virtual CD or USB drive, for OS installs or recovery without a USB stick. Newer services put VirtualMedia under Systems/{id}; the Managers/{id}/VirtualMedia link is deprecated. Media IDs (CD, Cd, 1, ...) vary, so list the collection first. BIOS changes are PATCHed to the settings object named in @Redfish.Settings on the Bios resource.",
        "flags": [
          [
            "InsertMedia",
            "Attach a remote image (Image URI, optional TransferProtocolType)"
          ],
          [
            "EjectMedia",
            "Detach the image after the install"
          ],
          [
            "Manager.Reset",
            "Restart the BMC; the host normally keeps running"
          ]
        ],
        "tip": "Staged BIOS settings take effect at the next host reset; @Redfish.SettingsApplyTime, where supported, says when.",
        "tags": [
          "bios-vmedia-bmc",
          "tips",
          "pro",
          "redfish",
          "rest",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://redfish.dmtf.org/schemas/v1/VirtualMedia.v1_7_0.json",
              "title": "DMTF VirtualMedia v1.7.0"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Manager.v1_25_0.json",
              "title": "DMTF Manager v1.25.0"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.v1_29_0.json",
              "title": "DMTF ComputerSystem v1.29.0"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Bios.v1_3_0.json",
              "title": "DMTF Bios v1.3.0"
            },
            {
              "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf",
              "title": "DMTF DSP0266 Redfish Specification 1.25.0"
            }
          ],
          "note": "Corrected 2026-11-10: Managers/{id}/VirtualMedia is deprecated in favour of Systems/{id}/VirtualMedia, and the BIOS settings URI comes from @Redfish.Settings (Bios/Settings is only a common name)."
        }
      }
    ]
  },
  {
    part: "rf-firmware",
    id: "firmware-tasks",
    badge: "fw",
    title: "Firmware Inventory, UpdateService & Tasks",
    subtitle: "Auditing BMC/BIOS/CPLD/NIC firmware versions, Multipart HTTP push & Task polling",
    commands: [
      {
        id: "rf-firmware-inventory",
        mode: "GET",
        modeClass: "mode-n",
        desc: "List all installed firmware components (BMC, BIOS, CPLD, PSU, NVMe, GPU, NIC) and versions",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/UpdateService/FirmwareInventory?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Id, Name, Version, Updateable, Status}\'',
        flags: [
          ["Updateable", "Boolean indicating whether component can be flashed via UpdateService"]
        ],
        tags: ["firmware", "version", "bios", "bmc", "cpld", "inventory"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/UpdateService.v1_17_1.json", "title": "Redfish schema: UpdateService"}], "note": "Updateable lives on SoftwareInventory, not checked here."}
      },
      {
        id: "rf-firmware-multipart-push",
        mode: "POST",
        modeClass: "mode-c",
        desc: "Upload a local firmware bundle (`.bin` / `.fwpkg` / `.exe`) via Redfish `MultipartHttpPushUri`",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/UpdateService/upload" -F \'UpdateParameters={"Targets":[],"@Redfish.OperationApplyTime":"OnReset"};type=application/json\' -F "UpdateFile=@./firmware.fwpkg;type=application/octet-stream"',
        flags: [
          ["MultipartHttpPushUri", "Check GET /redfish/v1/UpdateService for exact MultipartHttpPushUri path"],
          ["@Redfish.OperationApplyTime", "'Immediate' (for BMC) or 'OnReset' (for BIOS/CPLD/GPU firmware)"]
        ],
        tags: ["update", "flash", "upload", "multipart", "fwpkg", "updateservice"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "Redfish Specification DSP0266 1.25"}, {"url": "https://redfish.dmtf.org/schemas/v1/UpdateService.v1_17_1.json", "title": "Redfish schema: UpdateService"}], "note": "/UpdateService/upload is an example: POST to the MultipartHttpPushUri your BMC reports."}
      },
      {
        id: "rf-poll-task-service",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Monitor progress percentage and status of asynchronous Redfish jobs (`TaskService`)",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/TaskService/Tasks/1" | jq \'{Id, Name, TaskState, PercentComplete, TaskStatus, Messages}\'',
        flags: [
          ["TaskState", "'Running', 'Pending', 'Completed', 'Exception', 'Cancelled'… ('Killed' is deprecated in favor of 'Cancelled')"],
          ["PercentComplete", "0 to 100 integer progress indicator"]
        ],
        tags: ["task", "job", "progress", "async", "poll", "taskservice"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Task.v1_7_4.json", "title": "Redfish schema: Task"}]}
      }
    ]
  },
  {
    "part": "rf-firmware",
    "id": "firmware-tasks-pro-tips",
    "badge": "tip",
    "title": "Firmware & Tasks: Pro Tips & Best Practices",
    "subtitle": "Asynchronous Firmware Flashing & Task Service Monitoring",
    "commands": [
      {
        "id": "firmware-tasks-tips-card",
        "desc": "Asynchronous Firmware Flashing & Task Service Monitoring",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/UpdateService/FirmwareInventory?\\$expand=.(\\$levels=1)\" | jq '.Members[] | {Name: .Name, Version: .Version, Updateable: .Updateable}'",
        "details": "Firmware updates run asynchronously: a SimpleUpdate POST, or a multipart push to MultipartHttpPushUri, returns 202 Accepted with a Location header pointing to a task monitor. Poll it, or the Task under TaskService/Tasks, until TaskState is Completed (or Exception, Killed or Cancelled).",
        "flags": [
          [
            "FirmwareInventory",
            "Installed firmware with Version and Updateable (BMC, BIOS, CPLD, NICs, ...)"
          ],
          [
            "UpdateService.SimpleUpdate",
            "BMC pulls the image from ImageURI (TransferProtocol HTTP, HTTPS, TFTP, ... as supported)"
          ],
          [
            "TaskService/Tasks/<id>",
            "TaskState (New, Running, Completed, Exception, ...) and PercentComplete"
          ]
        ],
        "tip": "Watch PercentComplete on the Task and read its Messages for errors.",
        "tags": [
          "firmware-tasks",
          "tips",
          "pro",
          "redfish",
          "rest",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://redfish.dmtf.org/schemas/v1/UpdateService.v1_17_1.json",
              "title": "DMTF UpdateService v1.17.1"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Task.v1_7_4.json",
              "title": "DMTF Task v1.7.4"
            },
            {
              "url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf",
              "title": "DMTF DSP0266 Redfish Specification 1.25.0"
            }
          ],
          "note": "Corrected 2026-11-10: the inventory command now expands members (the collection alone has only links), and the 202 goes to a task monitor rather than a POST to UpdateService itself."
        }
      }
    ]
  },
  {
    part: "rf-hgx-dlc",
    id: "hgx-dlc-redfish",
    badge: "HGX / DLC",
    title: "HGX GPU Baseboard, NVSwitch & Liquid-Cooling Leak Sensors",
    subtitle: "Out-of-band HGX H100/H200/B200 SXM GPU telemetry, NVSwitch health & Direct Liquid Cooling (DLC) leak detection",
    commands: [
      {
        id: "rf-hgx-chassis-gpus",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Query NVIDIA HGX SXM GPU Baseboard, SXM GPU health, and NVSwitch status out-of-band when the host OS is hung",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Chassis" | jq \'.Members[]["@odata.id"] | select(contains("HGX"))\' && curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/HGX_Baseboard_0/Processors/GPU_SXM_1" | jq \'{Id, PartNumber, SerialNumber, Status}\'',
        flags: [
          ["HGX_Baseboard_0", "The GPU baseboard as a Redfish system (the HMC serves it); named this in NVIDIA's DGX H100/H200/B200 docs, check your OEM"],
          ["GPU_SXM_1..8", "Each SXM GPU under /Systems/HGX_Baseboard_0/Processors (EnvironmentMetrics for power and thermals), read through the BMC"],
          ["Chassis members", "Names containing HGX vary by vendor and generation: list them first, as the first command does"]
        ],
        tip: "Lets you check GPU serials & health even if the server won't boot into Ubuntu!",
        tags: ["hgx", "sxm", "nvswitch", "hmc", "gpu", "out-of-band"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://docs.nvidia.com/dgx/dgxh100-user-guide/redfish-api-supp.html", "title": "NVIDIA DGX H100/H200 Redfish"}, {"url": "https://docs.nvidia.com/dgx/dgxb200-user-guide/redfish-api-supp.html", "title": "NVIDIA DGX B200 Redfish"}], "note": "Corrected 2026-11-09: GPUs are /Systems/HGX_Baseboard_0/Processors/GPU_SXM_<n> in NVIDIA's DGX docs (NVIDIA documents the HGX baseboard there); other HGX vendors may differ. Reading GPUs with the host off is not documented."}
      },
      {
        id: "rf-dlc-leak-sensors",
        mode: "GET",
        modeClass: "mode-t",
        desc: "Check Direct Liquid Cooling (DLC) coldplate leak detection sensors, coolant flow & inlet/outlet temperatures",
        cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Chassis/1/Sensors?\\$expand=.(\\$levels=1)" | jq \'.Members[] | select(.Name | test("Leak|Coolant|Liquid|Flow|Manifold"; "i")) | {Name, Reading, ReadingUnits, Status}\'',
        flags: [
          ["ThermalSubsystem / LeakDetection", "Redfish 2023+ schema (/redfish/v1/Chassis/1/ThermalSubsystem/LeakDetection) reports moisture/rope sensor states"],
          ["Status.Health = Critical", "Triggered immediately if conductive coolant touches the coldplate drip-tray leak rope sensor"]
        ],
        tip: "Inspect leak sensors immediately if a liquid-cooled node shuts down unexpectedly!",
        tags: ["dlc", "liquid-cooling", "leak", "coolant", "coldplate", "manifold", "sensors"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Chassis.v1_29_0.json", "title": "Redfish schema: Chassis"}, {"url": "https://redfish.dmtf.org/schemas/v1/LeakDetection.json", "title": "Redfish schema: LeakDetection"}]}
      }
    ]
  },
  {
    "part": "rf-hgx-dlc",
    "id": "hgx-dlc-redfish-pro-tips",
    "badge": "tip",
    "title": "HGX Baseboard & DLC: Pro Tips & Best Practices",
    "subtitle": "AI Server HGX Baseboard & Liquid Cooling Telemetry",
    "commands": [
      {
        "id": "hgx-dlc-redfish-tips-card",
        "desc": "AI Server HGX Baseboard & Liquid Cooling Telemetry",
        "cmd": "curl -g -6 -sk -K ~/.bmc-curlrc \"https://[$BMC]/redfish/v1/Chassis/HGX_Baseboard_0\" | jq .",
        "details": "HGX GPU baseboards have their own Redfish chassis (Chassis/HGX_Baseboard_0 in NVIDIA's DGX docs) and expose GPUs as Systems/HGX_Baseboard_0/Processors/GPU_SXM_<n>; other server vendors may name them differently. On liquid-cooled racks, check the leak detectors (ThermalSubsystem/LeakDetection/LeakDetectors, DetectorState) and coolant sensors before powering up GPUs.",
        "flags": [
          [
            "Chassis/HGX_Baseboard_0",
            "GPU baseboard chassis (NVIDIA naming): serial, status, sensors"
          ],
          [
            "ThermalSubsystem/LeakDetection/LeakDetectors",
            "One entry per leak detector with DetectorState"
          ],
          [
            "Systems/HGX_Baseboard_0/Processors/GPU_SXM_<n>",
            "Per-GPU model, serial and health (NVIDIA naming)"
          ]
        ],
        "tip": "A leak detector reporting anything but OK means stop: follow the site leak procedure before powering the GPUs on.",
        "tags": [
          "hgx-dlc-redfish",
          "tips",
          "pro",
          "redfish",
          "rest",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://docs.nvidia.com/dgx/dgxh100-user-guide/redfish-api-supp.html",
              "title": "NVIDIA DGX H100/H200 Redfish APIs"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/LeakDetector.json",
              "title": "DMTF LeakDetector schema"
            },
            {
              "url": "https://redfish.dmtf.org/schemas/v1/Chassis.v1_29_0.json",
              "title": "DMTF Chassis v1.29.0"
            }
          ],
          "note": "Corrected 2026-11-10: GPUs are GPU_SXM_<n> under Systems/HGX_Baseboard_0 in NVIDIA's DGX docs (not Processors/GPU_0..7), and the leak property is LeakDetection, not LeakDetectionSensors. Leak detection on non-NVIDIA HGX boards varies by vendor."
        }
      }
    ]
  }
];

// Interactive Redfish Builder Database
const RF_BUILDER_ACTIONS = {
  systems: [
    {
      id: "sys-summary",
      label: "GET System Summary (Power, Health, BIOS, Serial)",
      desc: "Query server power state, overall health status, model, serial number, and BIOS version",
      build: (sysId) =>
        `curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/${sysId}" | jq '{PowerState, Status, Manufacturer, Model, SerialNumber, BiosVersion}'`
    },
    {
      id: "power-cycle",
      label: "POST ComputerSystem.Reset (PowerCycle)",
      desc: "Execute a cold DC PowerCycle via ComputerSystem.Reset action",
      build: (sysId) =>
        `curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/Systems/${sysId}/Actions/ComputerSystem.Reset" -H "Content-Type: application/json" -d '{"ResetType": "PowerCycle"}'`
    },
    {
      id: "boot-pxe",
      label: "PATCH One-Time UEFI PXE Boot Override",
      desc: "Configure server to PXE boot in UEFI mode on the next restart only",
      build: (sysId) =>
        `curl -g -6 -sk -K ~/.bmc-curlrc -X PATCH "https://[$BMC]/redfish/v1/Systems/${sysId}" -H "Content-Type: application/json" -d '{"Boot": {"BootSourceOverrideTarget": "Pxe", "BootSourceOverrideEnabled": "Once", "BootSourceOverrideMode": "UEFI"}}'`
    },
    {
      id: "dimm-audit",
      label: "GET Populated Memory DIMMs & Health",
      desc: "Fetch all populated memory DIMMs with slot locator, capacity, speed, and health",
      build: (sysId) =>
        `curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/${sysId}/Memory?\\$expand=.(\\$levels=1)" | jq '.Members[] | select(.Status.State=="Enabled") | {DeviceLocator, CapacityMiB, SerialNumber, Status}'`
    }
  ],
  chassis: [
    {
      id: "sensors-temp",
      label: "GET Thermal Temperatures & Fan Speeds",
      desc: "Read all chassis temperature sensors (°C) and cooling fan speeds",
      build: (_sysId, chasId) =>
        `curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Chassis/${chasId}/Thermal" | jq '{Temperatures: [.Temperatures[] | {Name, ReadingCelsius, Status}], Fans: [.Fans[] | {Name, Reading, Status}]}'`
    },
    {
      id: "psu-wattage",
      label: "GET Power Consumption & PSU Status",
      desc: "Query current chassis power consumption in Watts and redundant PSU status",
      build: (_sysId, chasId) =>
        `curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Chassis/${chasId}/Power" | jq '{PowerConsumedWatts: .PowerControl[0].PowerConsumedWatts, PowerSupplies: [.PowerSupplies[] | {Name, PowerInputWatts, LineInputVoltage, Status}]}'`
    },
    {
      id: "uid-led-on",
      label: "PATCH Turn On Chassis UID Locator LED",
      desc: "Illuminate the physical blue UID locator LED on the server chassis",
      build: (_sysId, chasId) =>
        `curl -g -6 -sk -K ~/.bmc-curlrc -X PATCH "https://[$BMC]/redfish/v1/Chassis/${chasId}" -H "Content-Type: application/json" -d '{"LocationIndicatorActive": true}'`
    }
  ],
  managers: [
    {
      id: "sel-entries",
      label: "GET System Event Log (SEL) Entries",
      desc: "Dump recent System Event Log (SEL) hardware events from the BMC",
      build: (_sysId, _chasId, mgrId, selId = "Sel") =>
        `curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Managers/${mgrId}/LogServices/${selId}/Entries" | jq -r '.Members[] | "\\(.Created) [\\(.Severity)] \\(.Message)"' | tail -n 25`
    },
    {
      id: "bmc-reboot",
      label: "POST GracefulRestart BMC Manager",
      desc: "Restart the out-of-band BMC processor without affecting the running host OS",
      build: (_sysId, _chasId, mgrId) =>
        `curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/Managers/${mgrId}/Actions/Manager.Reset" -H "Content-Type: application/json" -d '{"ResetType": "GracefulRestart"}'`
    }
  ],
  update: [
    {
      id: "fw-list",
      label: "GET All Installed Firmware Versions",
      desc: "List all installed firmware packages (BIOS, BMC, CPLD, NIC, PSU, GPU) via UpdateService",
      build: () =>
        `curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/UpdateService/FirmwareInventory?\\$expand=.(\\$levels=1)" | jq '.Members[] | {Id, Name, Version, Status}'`
    }
  ]
};

// Resource ids per vendor, plus the SEL log service id (Redfish paths are case-sensitive).
// GPU-tray queries live on the rf-hgx-dlc sheet. No Dell or DGX preset: the fleet has neither
// (both removed 2026-11-11).
const VENDOR_IDS = {
  standard: { sys: "1", chas: "1", mgr: "1", sel: "Sel" }
};

// Application State
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("redfish.html", "rf_cs_bookmarks", REDFISH_CHEAT_SHEET_DATA, {"rf-discovery":"rf-discovery_bookmarks","rf-power-boot":"rf-power-boot_bookmarks","rf-inventory":"rf-inventory_bookmarks","rf-thermals-power":"rf-thermals-power_bookmarks","rf-logs-sel":"rf-logs-sel_bookmarks","rf-bios-bmc":"rf-bios-bmc_bookmarks","rf-firmware":"rf-firmware_bookmarks","rf-hgx-dlc":"rf-hgx-dlc_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("rf_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(REDFISH_CHEAT_SHEET_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: REDFISH_CHEAT_SHEET_DATA, label: "Redfish sheets", parts: {
   "rf-bios-bmc": {
    "title": "BIOS & BMC Control",
    "subtitle": "Reading/patching BIOS attributes, mounting HTTP ISOs & rebooting the BMC",
    "pill": "BMC / DMTF Redfish REST API"
   },
   "rf-discovery": {
    "title": "Discovery & Auth",
    "subtitle": "ServiceRoot inspection, dynamic member URI discovery, X-Auth-Token & $expand",
    "pill": "AUTH / DMTF Redfish REST API"
   },
   "rf-firmware": {
    "title": "Firmware & Tasks",
    "subtitle": "Auditing BMC/BIOS/CPLD/NIC firmware versions, Multipart HTTP push & Task polling",
    "pill": "FW / DMTF Redfish REST API"
   },
   "rf-hgx-dlc": {
    "title": "HGX Baseboard & DLC",
    "subtitle": "Out-of-band HGX H100/H200/B200 SXM GPU telemetry, NVSwitch health & Direct Liquid Cooling (DLC) leak detection",
    "pill": "HGX / DMTF Redfish REST API"
   },
   "rf-inventory": {
    "title": "Hardware Inventory",
    "subtitle": "DIMM health & serial numbers, CPU/GPU processors, NVMe drives & NIC MAC addresses",
    "pill": "INV / DMTF Redfish REST API"
   },
   "rf-logs-sel": {
    "title": "Logs & SEL Triage",
    "subtitle": "Querying BMC hardware event logs, filtering Critical/Warning events & clearing SEL",
    "pill": "LOG / DMTF Redfish REST API"
   },
   "rf-power-boot": {
    "title": "Power & Boot",
    "subtitle": "ComputerSystem.Reset actions, one-time UEFI PXE boot, BIOS Setup boot & NMI crash dump",
    "pill": "PWR / DMTF Redfish REST API"
   },
   "rf-thermals-power": {
    "title": "Thermals & Sensors",
    "subtitle": "Inlet/exhaust temperatures, fan RPMs, PSU input/output wattage & Chassis indicator LED",
    "pill": "SNS / DMTF Redfish REST API"
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

function highlightRfCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(\s\|\s|\s&&\s)|(\b(?:curl|jq|echo|tail)\b)|(\b(?:GET|POST|PATCH|DELETE)\b)|(\s-[a-zA-Z0-9-]+)|(\/redfish\/v1\/[^\s"'\\]*)/g,
    (match, sep, cmd, method, flag, uri) => {
      if (sep) return `<span class="tok-pipe">${sep}</span>`;
      if (cmd) return `<span class="tok-cmd">${cmd}</span>`;
      if (method) return `<span class="tok-pipe">${method}</span>`;
      if (flag) return `<span class="tok-flag">${flag}</span>`;
      if (uri) return `<span class="tok-str">${uri}</span>`;
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = REDFISH_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of REDFISH_CHEAT_SHEET_DATA) {
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

  for (const section of REDFISH_CHEAT_SHEET_DATA) {
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
                  title="${isSaved ? "Remove bookmark" : "Bookmark request"}"
                  aria-label="Bookmark request"
                >
                  ${isSaved ? "★" : "☆"}
                </button>
              </div>
            </div>

            <div class="cmd-code-box" data-copy="${escapeHtml(copyTarget)}" title="Click to copy">
              <code class="cmd-code">${highlightRfCmd(item.cmd)}</code>
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

// Interactive Redfish Builder
function initRfBuilder() {
  const colEl = document.getElementById("rf-collection");
  const actEl = document.getElementById("rf-action");
  const venEl = document.getElementById("rf-vendor");
  const cmdOutputEl = document.getElementById("rf-cmd-output");
  const previewBox = document.getElementById("rf-preview-box");
  const copyBtn = document.getElementById("rf-copy-btn");
  const meaningEl = document.getElementById("rf-meaning-text");
  const presetBtns = document.querySelectorAll(".rf-preset");

  function populateActions(colKey, selectedActId) {
    const list = RF_BUILDER_ACTIONS[colKey] || [];
    actEl.innerHTML = list
      .map(
        (a) =>
          `<option value="${a.id}" ${a.id === selectedActId ? "selected" : ""}>${escapeHtml(a.label)}</option>`
      )
      .join("");
  }

  function updateRfPreview() {
    const colKey = colEl.value;
    const list = RF_BUILDER_ACTIONS[colKey] || [];
    const current = list.find((a) => a.id === actEl.value) || list[0];
    if (!current) return;

    const venKey = venEl.value;
    const ids = VENDOR_IDS[venKey] || VENDOR_IDS.standard;
    const fullCmd = current.build(ids.sys, ids.chas, ids.mgr, ids.sel);

    cmdOutputEl.innerHTML = highlightRfCmd(fullCmd);
    previewBox.dataset.copy = fullCmd;
    meaningEl.textContent = current.desc;

    presetBtns.forEach((btn) => {
      const active =
        btn.dataset.col === colKey &&
        btn.dataset.act === current.id &&
        btn.dataset.ven === venKey;
      btn.classList.toggle("active", active);
    });
  }

  colEl.addEventListener("change", () => {
    populateActions(colEl.value);
    updateRfPreview();
  });

  actEl.addEventListener("change", updateRfPreview);
  venEl.addEventListener("change", updateRfPreview);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      colEl.value = btn.dataset.col;
      populateActions(btn.dataset.col, btn.dataset.act);
      venEl.value = btn.dataset.ven;
      updateRfPreview();
    });
  });

  previewBox.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  populateActions("systems", "sys-summary");
  updateRfPreview();
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
        showToast("Removed from saved requests");
      } else {
        state.bookmarks.add(id);
        showToast("Saved request to bookmarks");
      }
      localStorage.setItem("rf_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
initRfBuilder();
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
