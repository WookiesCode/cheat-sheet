const REDFISH_CHEAT_SHEET_DATA = [
  {
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
        cmd: 'SYS_URI=$(curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Systems" | jq -r \'.Members[0]."@odata.id"\') && echo "$SYS_URI"',
        flags: [
          ["-g -6", "-g (--globoff) prevents curl from failing on IPv6 brackets [2001:db8::1]; -6 forces IPv6 transport"],
          ['.Members[0]."@odata.id"', "Extracts exact vendor-specific URI (/redfish/v1/Systems/1 vs /redfish/v1/Systems/System.Embedded.1)"],
          ["-sk", "-s silent mode, -k ignore self-signed BMC TLS certificate (use %25eth0 for link-local fe80:: addresses)"]
        ],
        tip: "Always pass -g to curl when using [IPv6] brackets!",
        tags: ["discover", "serviceroot", "systems", "uri", "members", "jq", "ipv6"]
      },
      {
        id: "rf-session-token-create",
        mode: "POST",
        modeClass: "mode-i",
        desc: "Create a Redfish Session Token (`X-Auth-Token`) to avoid slow Basic Auth hashing on every request",
        cmd: 'curl -g -6 -sk -D - -X POST "https://[$BMC]/redfish/v1/SessionService/Sessions" -H "Content-Type: application/json" -d "{\\"UserName\\":\\"$BMC_USER\\",\\"Password\\":\\"$PASS\\"}"',
        flags: [
          ["X-Auth-Token:", "Grab token from response headers and pass via -H 'X-Auth-Token: <token>' on subsequent requests"],
          ["Location:", "Session URI (e.g. .../Sessions/1) — send HTTP DELETE to this URI when done to avoid exhausting BMC session slots!"]
        ],
        tip: "10x faster than Basic Auth",
        tags: ["session", "token", "x-auth-token", "login", "auth", "delete"]
      },
      {
        id: "rf-expand-query-param",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Use `$expand=.($levels=1)` to fetch an entire collection's child objects in a single HTTP call",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Systems/1/Memory?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Name, CapacityMiB, Manufacturer, SerialNumber, Status}\'',
        flags: [
          ["$expand=.($levels=1)", "Inlines all Member objects instead of returning only @odata.id links"],
          ["$only", "Return the single member directly if collection only has 1 item"]
        ],
        tip: "Avoids N+1 HTTP loop",
        tags: ["expand", "levels", "collection", "batch", "fast"]
      }
    ]
  },
  {
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
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" -X POST "https://[$BMC]/redfish/v1/Systems/1/Actions/ComputerSystem.Reset" -H "Content-Type: application/json" -d \'{"ResetType": "PowerCycle"}\'',
        flags: [
          ["PowerCycle", "Cold DC power off followed by power on"],
          ["ForceRestart / GracefulRestart", "Immediate warm reset vs ACPI OS reboot"],
          ["ResetType@Redfish.AllowableValues", "Inspect Actions.#ComputerSystem.Reset in GET /Systems/1 to see supported ResetTypes"]
        ],
        tags: ["power", "reset", "reboot", "powercycle", "forceoff", "on"]
      },
      {
        id: "rf-boot-override-pxe",
        mode: "PATCH",
        modeClass: "mode-c",
        desc: "Set one-time UEFI PXE network boot on next restart (`BootSourceOverrideTarget: Pxe`)",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" -X PATCH "https://[$BMC]/redfish/v1/Systems/1" -H "Content-Type: application/json" -d \'{"Boot": {"BootSourceOverrideTarget": "Pxe", "BootSourceOverrideEnabled": "Once", "BootSourceOverrideMode": "UEFI"}}\'',
        flags: [
          ["BootSourceOverrideEnabled", "'Once' (single reboot), 'Continuous' (permanent), or 'Disabled'"],
          ["BootSourceOverrideTarget", "'Pxe', 'BiosSetup', 'Cd', 'Hdd', 'UefiHttp', 'UefiShell', 'None'"]
        ],
        tip: "Follow with ForceRestart",
        tags: ["pxe", "boot", "uefi", "override", "once", "network"]
      },
      {
        id: "rf-boot-into-bios",
        mode: "PATCH",
        modeClass: "mode-c",
        desc: "Force server to boot directly into UEFI/BIOS Setup utility on next reboot",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" -X PATCH "https://[$BMC]/redfish/v1/Systems/1" -H "Content-Type: application/json" -d \'{"Boot": {"BootSourceOverrideTarget": "BiosSetup", "BootSourceOverrideEnabled": "Once"}}\'',
        flags: [
          ["BiosSetup", "Enters BIOS setup automatically on next boot (viewable via SOL or HTML5 KVM)"]
        ],
        tags: ["bios", "setup", "boot", "uefi"]
      },
      {
        id: "rf-trigger-nmi",
        mode: "POST",
        modeClass: "mode-t",
        desc: "Send diagnostic Non-Maskable Interrupt (`Nmi`) to hung OS to trigger kernel kdump crash dump",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" -X POST "https://[$BMC]/redfish/v1/Systems/1/Actions/ComputerSystem.Reset" -H "Content-Type: application/json" -d \'{"ResetType": "Nmi"}\'',
        flags: [
          ["Nmi", "Triggers kernel panic/kdump when Linux kernel is hard-locked (`kernel.unknown_nmi_panic=1`)"]
        ],
        danger: "Panics OS kernel for kdump",
        tags: ["nmi", "kdump", "crash", "hang", "panic", "diagnostic"]
      }
    ]
  },
  {
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
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Systems/1/Memory?\\$expand=.(\\$levels=1)" | jq \'.Members[] | select(.Status.State=="Enabled") | {Id, DeviceLocator, CapacityMiB, OperatingSpeedMhz, Manufacturer, PartNumber, SerialNumber, Health: .Status.Health}\'',
        flags: [
          ["select(.Status.State==\"Enabled\")", "Filters out empty/unpopulated DIMM sockets (`State: Absent`)"],
          ["DeviceLocator", "Prints silkscreen motherboard slot label (e.g. DIMM_A1, P1-DIMMA1)"]
        ],
        tip: "Pinpoints faulty DIMM slot label",
        tags: ["memory", "dimm", "ram", "serial", "ecc", "slot", "health"]
      },
      {
        id: "rf-processors-cpu-gpu",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Inspect all CPUs and baseboard GPUs (`ProcessorType: CPU` vs `Accelerator`) with core counts and health",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Systems/1/Processors?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Id, ProcessorType, Model, TotalCores, TotalThreads, SerialNumber, Status}\'',
        flags: [
          ["ProcessorType", "'CPU', 'GPU', 'Accelerator', 'FPGA', or 'DPU'"],
          ["ProcessorMetrics", "Follow ProcessorMetrics.@odata.id for out-of-band GPU/CPU bandwidth, temp & ECC metrics"]
        ],
        tags: ["cpu", "gpu", "processors", "cores", "model", "serial"]
      },
      {
        id: "rf-storage-nvme-drives",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Inspect storage controllers, NVMe/SAS/SATA drive health, wear life remaining, and serial numbers",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Systems/1/Storage?\\$expand=.(\\$levels=2)" | jq \'.Members[].Drives[]? | {Id, Name, Model, SerialNumber, CapacityBytes, MediaType, PredictedMediaLifeLeftPercent, Status}\'',
        flags: [
          ["PredictedMediaLifeLeftPercent", "SSD/NVMe wear-out indicator (100 = new, 0 = worn out)"],
          ["FailurePredicted", "Boolean SMART pre-fail warning flag"]
        ],
        tags: ["storage", "nvme", "ssd", "drives", "smart", "wear", "raid"]
      },
      {
        id: "rf-network-mac-addresses",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Collect host & BMC NIC MAC addresses, IPv6 addresses, SLAAC/DHCPv6 state, and link status out-of-band",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Managers/1/EthernetInterfaces?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Id, MACAddress, IPv6DefaultGateway, IPv6Addresses}\'',
        flags: [
          ["IPv6Addresses / IPv6StaticAddresses", "Inspect assigned global unicast, SLAAC, DHCPv6, and link-local fe80:: addresses on BMC or host NICs"],
          ["MACAddress", "Hardware MAC address of onboard LOM and PCIe network adapters (for DHCPv6 DUID / PXEv6)"]
        ],
        tip: "Essential for zero-touch IPv6 PXE",
        tags: ["mac", "nic", "ethernet", "pxe", "ipv6", "dhcpv6", "slaac", "provisioning"]
      }
    ]
  },
  {
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
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Chassis/1/Thermal" | jq \'{Temps: [.Temperatures[] | {Name, ReadingCelsius, UpperThresholdCritical, Health: .Status.Health}], Fans: [.Fans[] | {Name, Reading, ReadingUnits, Health: .Status.Health}]}\'',
        flags: [
          ["/Chassis/1/Sensors", "Note: Newer Redfish 2021+ schemas also expose individual sensor URIs under /Chassis/1/Sensors?$expand=.($levels=1)"]
        ],
        tags: ["thermal", "temperature", "fans", "rpm", "cooling", "inlet"]
      },
      {
        id: "rf-chassis-power-psus",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Check live server power consumption (Watts), power cap, and redundant Power Supply (PSU) health",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Chassis/1/Power" | jq \'{PowerConsumedWatts: .PowerControl[0].PowerConsumedWatts, PSUs: [.PowerSupplies[] | {Name, Model, SerialNumber, PowerInputWatts, LineInputVoltage, Status}]}\'',
        flags: [
          ["PowerConsumedWatts", "Current real-time chassis power draw in Watts"],
          ["LineInputVoltage", "Verify both PSUs have active AC/HVDC input voltage (catches unplugged B-feed cords!)"]
        ],
        tip: "Catches dead A/B PDU feeds",
        tags: ["power", "psu", "watts", "voltage", "redundant", "chassis"]
      },
      {
        id: "rf-chassis-uid-led",
        mode: "PATCH",
        modeClass: "mode-c",
        desc: "Turn on or blink the physical Chassis UID Locator LED to help datacenter techs find the server",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" -X PATCH "https://[$BMC]/redfish/v1/Chassis/1" -H "Content-Type: application/json" -d \'{"LocationIndicatorActive": true}\'',
        flags: [
          ["LocationIndicatorActive", "true = turn on / blink blue UID LED; false = turn off (replaces deprecated IndicatorLED)"]
        ],
        tags: ["led", "uid", "identify", "locate", "blink", "chassis"]
      }
    ]
  },
  {
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
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Managers/1/LogServices/Sel/Entries" | jq -r \'.Members[] | "\\(.Created) [\\(.Severity)] \\(.Message)"\' | tail -n 30',
        flags: [
          ["/Managers/1/LogServices", "Query /LogServices first to see vendor log IDs (e.g. Sel, Lclog, Log1, EventLog, FaultList)"],
          ["/Systems/1/LogServices", "Some BMCs (HPE iLO IML, OpenBMC HostLogger, NVIDIA HGX) also mount host/FDR logs under /Systems/<id>/LogServices"]
        ],
        tags: ["sel", "logs", "events", "history", "lclog", "iml"]
      },
      {
        id: "rf-sel-filter-critical",
        mode: "GET",
        modeClass: "mode-t",
        desc: "Filter SEL entries to show only `Critical` or `Warning` hardware assertions",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Managers/1/LogServices/Sel/Entries" | jq \'.Members[] | select(.Severity == "Critical" or .Severity == "Warning") | {Id, Created, Severity, Message, SensorType}\'',
        flags: [
          ["Severity", "'OK', 'Warning', or 'Critical'"]
        ],
        tip: "Fast root-cause triage",
        tags: ["critical", "warning", "faults", "filter", "triage"]
      },
      {
        id: "rf-sel-clear-log",
        mode: "POST",
        modeClass: "mode-c",
        desc: "Clear all entries in the BMC System Event Log via `LogService.ClearLog` action",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" -X POST "https://[$BMC]/redfish/v1/Managers/1/LogServices/Sel/Actions/LogService.ClearLog" -H "Content-Type: application/json" -d \'{}\'',
        flags: [
          ["LogService.ClearLog", "Resets SEL capacity counter after hardware replacement/repair"]
        ],
        tags: ["clear", "sel", "reset", "logs"]
      }
    ]
  },
  {
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
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Systems/1/Bios" | jq \'.Attributes\'   |   curl -g -6 -sk -u "$BMC_USER:$PASS" -X PATCH "https://[$BMC]/redfish/v1/Systems/1/Bios/Settings" -H "Content-Type: application/json" -d \'{"Attributes": {"SriovGlobalEnable": "Enabled"}}\'',
        flags: [
          ["/Bios", "Shows currently active BIOS attributes from last boot"],
          ["/Bios/Settings", "Staging URI where PATCH changes are written (applied on next System reboot!)"],
          ["If-Match", "If BMC returns HTTP 412, pass -H 'If-Match: *' or the ETag from GET /Bios/Settings"]
        ],
        tip: "PATCH goes to /Bios/Settings",
        tags: ["bios", "attributes", "settings", "sriov", "iommu", "patch"]
      },
      {
        id: "rf-virtual-media-mount",
        mode: "POST",
        modeClass: "mode-c",
        desc: "Mount a remote OS installer ISO over IPv6 HTTP/HTTPS via BMC Virtual Media (`InsertMedia`)",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" -X POST "https://[$BMC]/redfish/v1/Managers/1/VirtualMedia/CD1/Actions/VirtualMedia.InsertMedia" -H "Content-Type: application/json" -d \'{"Image": "http://[2001:db8:dc::5]:8000/ubuntu-24.04-live-server-amd64.iso", "Inserted": true, "WriteProtected": true}\'',
        flags: [
          ["VirtualMedia.InsertMedia", "Attaches remote HTTP/HTTPS/NFS/SMB ISO as virtual USB CD/DVD drive to host"],
          ["VirtualMedia.EjectMedia", "POST '{}' to .../Actions/VirtualMedia.EjectMedia to unmount ISO"]
        ],
        tip: "Pair with BootTarget: Cd",
        tags: ["virtualmedia", "iso", "mount", "cdrom", "install", "http"]
      },
      {
        id: "rf-bmc-manager-reset",
        mode: "POST",
        modeClass: "mode-c",
        desc: "Reboot the Out-of-Band BMC controller itself without disrupting the running host OS",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" -X POST "https://[$BMC]/redfish/v1/Managers/1/Actions/Manager.Reset" -H "Content-Type: application/json" -d \'{"ResetType": "GracefulRestart"}\'',
        flags: [
          ["GracefulRestart / ForceRestart", "Reboots only the BMC management processor (host OS & workloads keep running)"]
        ],
        tags: ["bmc", "manager", "reset", "idrac", "ilo", "reboot"]
      }
    ]
  },
  {
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
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/UpdateService/FirmwareInventory?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Id, Name, Version, Updateable, Status}\'',
        flags: [
          ["Updateable", "Boolean indicating whether component can be flashed via UpdateService"]
        ],
        tags: ["firmware", "version", "bios", "bmc", "cpld", "inventory"]
      },
      {
        id: "rf-firmware-multipart-push",
        mode: "POST",
        modeClass: "mode-c",
        desc: "Upload a local firmware bundle (`.bin` / `.fwpkg` / `.exe`) via Redfish `MultipartHttpPushUri`",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" -X POST "https://[$BMC]/redfish/v1/UpdateService/upload" -F \'UpdateParameters={"Targets":[],"@Redfish.OperationApplyTime":"OnReset"};type=application/json\' -F "UpdateFile=@./firmware.fwpkg;type=application/octet-stream"',
        flags: [
          ["MultipartHttpPushUri", "Check GET /redfish/v1/UpdateService for exact MultipartHttpPushUri path"],
          ["@Redfish.OperationApplyTime", "'Immediate' (for BMC) or 'OnReset' (for BIOS/CPLD/GPU firmware)"]
        ],
        tags: ["update", "flash", "upload", "multipart", "fwpkg", "updateservice"]
      },
      {
        id: "rf-poll-task-service",
        mode: "GET",
        modeClass: "mode-n",
        desc: "Monitor progress percentage and status of asynchronous Redfish jobs (`TaskService`)",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/TaskService/Tasks/1" | jq \'{Id, Name, TaskState, PercentComplete, TaskStatus, Messages}\'',
        flags: [
          ["TaskState", "'Running', 'Pending', 'Completed', 'Exception', or 'Killed'"],
          ["PercentComplete", "0 to 100 integer progress indicator"]
        ],
        tags: ["task", "job", "progress", "async", "poll", "taskservice"]
      }
    ]
  },
  {
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
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Chassis" | jq \'.Members[]["@odata.id"] | select(contains("HGX"))\' && curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Chassis/HGX_GPU_SXM_1" | jq \'{Id, PartNumber, SerialNumber, Status}\'',
        flags: [
          ["HGX_Baseboard_0", "Dedicated HMC (Hardware Management Controller) on ASUS ESC N8 / GIGABYTE G593 / DGX HGX trays"],
          ["HGX_GPU_SXM_1..8", "Out-of-band SXM GPU health, serial number, and thermals readable even when the x86 host is powered off or kernel-panicked!"],
          ["HGX_NVSwitch_0..3", "Check NVSwitch ASIC health and thermal status out-of-band via Redfish"]
        ],
        tip: "Lets you check GPU serials & health even if the server won't boot into Ubuntu!",
        tags: ["hgx", "sxm", "nvswitch", "hmc", "gpu", "out-of-band", "asus", "gigabyte"]
      },
      {
        id: "rf-dlc-leak-sensors",
        mode: "GET",
        modeClass: "mode-t",
        desc: "Check Direct Liquid Cooling (DLC) coldplate leak detection sensors, coolant flow & inlet/outlet temperatures",
        cmd: 'curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Chassis/1/Sensors?\\$expand=.(\\$levels=1)" | jq \'.Members[] | select(.Name | test("Leak|Coolant|Liquid|Flow|Manifold"; "i")) | {Name, Reading, ReadingUnits, Status}\'',
        flags: [
          ["ThermalSubsystem / LeakDetection", "Redfish 2023+ schema (/redfish/v1/Chassis/1/ThermalSubsystem/LeakDetection) reports moisture/rope sensor states"],
          ["Status.Health = Critical", "Triggered immediately if conductive coolant touches the coldplate drip-tray leak rope sensor"]
        ],
        tip: "Inspect leak sensors immediately if a liquid-cooled node shuts down unexpectedly!",
        tags: ["dlc", "liquid-cooling", "leak", "coolant", "coldplate", "manifold", "sensors"]
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
        `curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Systems/${sysId}" | jq '{PowerState, Status, Manufacturer, Model, SerialNumber, BiosVersion}'`
    },
    {
      id: "power-cycle",
      label: "POST ComputerSystem.Reset (PowerCycle)",
      desc: "Execute a cold DC PowerCycle via ComputerSystem.Reset action",
      build: (sysId) =>
        `curl -g -6 -sk -u "$BMC_USER:$PASS" -X POST "https://[$BMC]/redfish/v1/Systems/${sysId}/Actions/ComputerSystem.Reset" -H "Content-Type: application/json" -d '{"ResetType": "PowerCycle"}'`
    },
    {
      id: "boot-pxe",
      label: "PATCH One-Time UEFI PXE Boot Override",
      desc: "Configure server to PXE boot in UEFI mode on the next restart only",
      build: (sysId) =>
        `curl -g -6 -sk -u "$BMC_USER:$PASS" -X PATCH "https://[$BMC]/redfish/v1/Systems/${sysId}" -H "Content-Type: application/json" -d '{"Boot": {"BootSourceOverrideTarget": "Pxe", "BootSourceOverrideEnabled": "Once", "BootSourceOverrideMode": "UEFI"}}'`
    },
    {
      id: "dimm-audit",
      label: "GET Populated Memory DIMMs & Health",
      desc: "Fetch all populated memory DIMMs with slot locator, capacity, speed, and health",
      build: (sysId) =>
        `curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Systems/${sysId}/Memory?\\$expand=.(\\$levels=1)" | jq '.Members[] | select(.Status.State=="Enabled") | {DeviceLocator, CapacityMiB, SerialNumber, Status}'`
    }
  ],
  chassis: [
    {
      id: "sensors-temp",
      label: "GET Thermal Temperatures & Fan Speeds",
      desc: "Read all chassis temperature sensors (°C) and cooling fan speeds",
      build: (_sysId, chasId) =>
        `curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Chassis/${chasId}/Thermal" | jq '{Temperatures: [.Temperatures[] | {Name, ReadingCelsius, Status}], Fans: [.Fans[] | {Name, Reading, Status}]}'`
    },
    {
      id: "psu-wattage",
      label: "GET Power Consumption & PSU Status",
      desc: "Query current chassis power consumption in Watts and redundant PSU status",
      build: (_sysId, chasId) =>
        `curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Chassis/${chasId}/Power" | jq '{PowerConsumedWatts: .PowerControl[0].PowerConsumedWatts, PowerSupplies: [.PowerSupplies[] | {Name, PowerInputWatts, LineInputVoltage, Status}]}'`
    },
    {
      id: "uid-led-on",
      label: "PATCH Turn On Chassis UID Locator LED",
      desc: "Illuminate the physical blue UID locator LED on the server chassis",
      build: (_sysId, chasId) =>
        `curl -g -6 -sk -u "$BMC_USER:$PASS" -X PATCH "https://[$BMC]/redfish/v1/Chassis/${chasId}" -H "Content-Type: application/json" -d '{"LocationIndicatorActive": true}'`
    }
  ],
  managers: [
    {
      id: "sel-entries",
      label: "GET System Event Log (SEL) Entries",
      desc: "Dump recent System Event Log (SEL) hardware events from the BMC",
      build: (_sysId, _chasId, mgrId) =>
        `curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/Managers/${mgrId}/LogServices/Sel/Entries" | jq -r '.Members[] | "\\(.Created) [\\(.Severity)] \\(.Message)"' | tail -n 25`
    },
    {
      id: "bmc-reboot",
      label: "POST GracefulRestart BMC Manager",
      desc: "Restart the out-of-band BMC processor without affecting the running host OS",
      build: (_sysId, _chasId, mgrId) =>
        `curl -g -6 -sk -u "$BMC_USER:$PASS" -X POST "https://[$BMC]/redfish/v1/Managers/${mgrId}/Actions/Manager.Reset" -H "Content-Type: application/json" -d '{"ResetType": "GracefulRestart"}'`
    }
  ],
  update: [
    {
      id: "fw-list",
      label: "GET All Installed Firmware Versions",
      desc: "List all installed firmware packages (BIOS, BMC, CPLD, NIC, PSU, GPU) via UpdateService",
      build: () =>
        `curl -g -6 -sk -u "$BMC_USER:$PASS" "https://[$BMC]/redfish/v1/UpdateService/FirmwareInventory?\\$expand=.(\\$levels=1)" | jq '.Members[] | {Id, Name, Version, Status}'`
    }
  ]
};

const VENDOR_IDS = {
  standard: { sys: "1", chas: "1", mgr: "1" },
  dell: { sys: "System.Embedded.1", chas: "System.Embedded.1", mgr: "iDRAC.Embedded.1" },
  hgx: { sys: "HGX_Baseboard_0", chas: "HGX_Chassis_0", mgr: "HGX_BMC_0" }
};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("rf_cs_bookmarks") || "[]"))
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
    const fullCmd = current.build(ids.sys, ids.chas, ids.mgr);

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
initRfBuilder();
initMiniTabs();
initEvents();
