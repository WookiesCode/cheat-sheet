const JIRA_CHEAT_SHEET_DATA = [
  {
    id: "node-triage",
    badge: "node",
    title: "Server, Hostname & Node Lifecycle Triage",
    subtitle: "Historical and active ticket lookups by hostname, IP address, partition, and recurring lemon node detection",
    commands: [
      {
        id: "jql-node-all",
        desc: "Query all historical and active tickets ever logged for a target server hostname",
        cmd: '(summary ~ "gpu-worker-042" OR description ~ "gpu-worker-042" OR text ~ "gpu-worker-042" OR "Host Name" ~ "gpu-worker-042") ORDER BY created DESC',
        details: "Comprehensive query to trace the entire service and repair history of a physical server. Searches standard Jira text fields (summary, description, comments) as well as common DC custom fields ('Host Name', 'Asset', 'Device Name').",
        flags: [
          ["summary ~ \"<host>\"", "Matches hostname anywhere in the ticket subject line"],
          ["text ~ \"<host>\"", "Global text index search across summary, description, comments, and environment fields"],
          ["ORDER BY created DESC", "Presents newest issues first to evaluate recent repairs vs historic failures"]
        ],
        subcommands: [
          ['(text ~ "gpu-worker-042") AND statusCategory != Done', "Filter only currently unresolved/open tickets on this node"],
          ['(text ~ "gpu-worker-042") AND issuetype in (Incident, "Hardware Failure") ORDER BY created DESC', "Filter only physical incident reports, excluding routine maintenance or software tasks"],
          ['(text ~ "gpu-worker-042*") ORDER BY created DESC', "Search wildcard variants (e.g. gpu-worker-042, gpu-worker-042-bmc, gpu-worker-042-ib)"]
        ],
        tip: "Use ~ for wildcard contains matching; use = only for exact match text or select custom fields",
        tags: ["node", "hostname", "server", "history", "triage", "audit", "host", "tickets"]
      },
      {
        id: "jql-node-open",
        desc: "Query currently active, unresolved hardware incidents on a specific node",
        cmd: '(text ~ "gpu-worker-042") AND status not in (Resolved, Closed, Done) AND statusCategory != Done ORDER BY priority DESC, created ASC',
        details: "Checks if a node currently has an active work-in-progress ticket before technicians duplicate work or before cluster schedulers uncordon a node.",
        flags: [
          ["statusCategory != Done", "Jira standard category covering all open, in-progress, pending-vendor, and triage states"],
          ["ORDER BY priority DESC", "Ranks highest severity blockers first (P1/Blocker before P3/Minor)"]
        ],
        subcommands: [
          ['(text ~ "gpu-worker-042") AND status in ("In Progress", "Investigating", "Waiting for Hardware")', "Show issues actively assigned to an on-duty technician"],
          ['(text ~ "gpu-worker-042") AND labels in (drain, cordoned, slurm-drain)', "Check if the server is marked drained in scheduler tracking tickets"]
        ],
        tip: "Check statusCategory != Done to catch custom closed statuses like 'Cancelled' or 'RMA Replaced'",
        tags: ["open", "active", "in-progress", "blocker", "triage", "node", "unresolved"]
      },
      {
        id: "jql-node-bmc",
        desc: "Query tickets by BMC IP or out-of-band management IPv6/IPv4 address",
        cmd: '(text ~ "2001:db8:dc::50" OR text ~ "192.168.1.120" OR "BMC IP" ~ "2001:db8:dc::50") ORDER BY created DESC',
        details: "Useful when automated alerting systems (Prometheus, Nagios, Redfish event receivers) log tickets using the BMC management IP instead of the OS hostname.",
        flags: [
          ["text ~ \"<bmc-ip>\"", "Searches ticket body and automated monitoring alert payloads for the management IP"],
          ["\"BMC IP\" ~ \"...\"", "Matches custom asset management field for BMC address if configured in your Jira instance"]
        ],
        subcommands: [
          ['text ~ "$BMC" AND statusCategory != Done', "Search using the active $BMC target variable from the top bar"],
          ['text ~ "192.168.1.*" AND summary ~ "BMC unresponsive"', "Find all nodes across a subnet with IPMI/BMC network timeouts"]
        ],
        tip: "When searching IPv6, quote the full address to prevent colons from triggering JQL syntax errors",
        tags: ["bmc", "ipmi", "ipv6", "ip", "management", "alert", "monitoring", "oob"]
      },
      {
        id: "jql-node-lemon",
        desc: "Identify chronic / lemon nodes with repeated hardware failures in the last 90 days",
        cmd: '(text ~ "gpu-worker-042") AND created >= -90d AND issuetype in (Incident, "Hardware Failure") ORDER BY created DESC',
        details: "Identifies recurring problem nodes that have suffered 3+ failures in 90 days. Essential for cluster fleet audits to decide between component replacement vs full chassis RMA.",
        flags: [
          ["created >= -90d", "Restricts query to the last 90 days relative to the current timestamp"],
          ["issuetype in (...)", "Excludes general access requests, scheduled reboots, and cluster maintenance"]
        ],
        subcommands: [
          ['(text ~ "gpu-worker-042") AND resolution = "Done" AND resolved >= -60d', "Review what was fixed or replaced on this node in the past 60 days"],
          ['labels = "lemon-node" AND statusCategory != Done', "View fleet-wide chronic failure candidates flagged by senior engineers"]
        ],
        tip: "Combine with 'dcgmi diag -r 3' on the node to verify if intermittent PCIe/NVLink issues persist",
        tags: ["lemon", "chronic", "recurring", "repeat", "history", "audit", "90d"]
      }
    ]
  },
  {
    id: "rack-position",
    badge: "rack",
    title: "Physical Rack, Row, Cage & RU Position",
    subtitle: "Correlate tickets across physical rack units, row aisles, ToR switches, PDUs, and shared cooling loops",
    commands: [
      {
        id: "jql-rack-all",
        desc: "Query all tickets associated with a physical rack (e.g. Rack-14, R14, RK14)",
        cmd: '(text ~ "Rack-14" OR text ~ "Rack 14" OR summary ~ "R14" OR "Rack" ~ "Rack-14" OR "Location" ~ "Rack-14") ORDER BY created DESC',
        details: "Searches across multiple common rack naming conventions. Essential when stepping in front of a rack to know the health status of all servers installed in that enclosure.",
        flags: [
          ["text ~ \"Rack-14\"", "Finds mentions of Rack-14 in descriptions and technician worklogs"],
          ["summary ~ \"R14\"", "Finds short-hand rack naming conventions often used in incident summaries"],
          ["\"Rack\" ~ \"Rack-14\"", "Queries structured datacenter location custom fields"]
        ],
        subcommands: [
          ['(text ~ "Rack-14") AND statusCategory != Done', "View only active, open tickets inside Rack-14"],
          ['(text ~ "Rack-14") AND created >= -7d ORDER BY created DESC', "Show all incidents and maintenance logged in Rack-14 over the past week"]
        ],
        tip: "Always search both hyphenated ('Rack-14') and spaced ('Rack 14') variants to catch manual typos",
        tags: ["rack", "location", "ru", "position", "enclosure", "chassis", "row", "datacenter"]
      },
      {
        id: "jql-rack-slot",
        desc: "Query tickets logged for a specific Rack Unit (RU) slot (e.g. RU21–RU24, U21)",
        cmd: '(text ~ "Rack-14") AND (text ~ "RU21" OR text ~ "U21" OR text ~ "Slot 21" OR "Rack Unit" ~ "21") ORDER BY created DESC',
        details: "Pinpoints tickets affecting a specific 1U, 2U, or 4U chassis position inside a rack. Helps confirm whether an RMA delivery matches the exact physical bay needing replacement.",
        flags: [
          ["text ~ \"RU21\"", "Matches standard Rack Unit notation (RU21, RU-21)"],
          ["text ~ \"U21\"", "Matches short-hand unit notation (U21)"]
        ],
        subcommands: [
          ['(text ~ "Rack-14") AND (text ~ "RU01" OR text ~ "RU02" OR text ~ "RU03") AND statusCategory != Done', "Audit bottom-of-rack nodes (often affected by floor cooling or cable tension)"],
          ['(text ~ "Rack-14") AND (text ~ "RU38" OR text ~ "RU39" OR text ~ "RU40") AND statusCategory != Done', "Audit top-of-rack nodes (often affected by heat rises or short DAC cables)"]
        ],
        tip: "Double check RU numbers from front vs rear: some vendors label bottom-up (RU 1 at bottom)",
        tags: ["ru", "slot", "bay", "unit", "rack", "position", "elevation"]
      },
      {
        id: "jql-rack-shared",
        desc: "Detect correlated rack outages (PDU feed drop, ToR switch failure, Liquid CDI/CDU leak)",
        cmd: '(text ~ "Rack-14") AND (summary ~ "PDU" OR summary ~ "ToR" OR summary ~ "switch" OR summary ~ "CDU" OR summary ~ "leak" OR summary ~ "power feed" OR summary ~ "breaker") AND created >= -30d',
        details: "Triage cascade failures where multiple nodes in the same rack report offline simultaneously due to an upstream electrical, networking, or cooling manifold failure.",
        flags: [
          ["summary ~ \"PDU\"", "Flags Power Distribution Unit circuit breaker trips or A/B feed drops"],
          ["summary ~ \"CDU\"", "Flags Coolant Distribution Unit pressure drops, manifold leaks, or thermal alarms"],
          ["summary ~ \"ToR\"", "Flags Top-of-Rack leaf switch reboot or optical uplink flaps"]
        ],
        subcommands: [
          ['project = "FAC" AND summary ~ "Rack-14" AND statusCategory != Done', "Check Facilities/Datacenter Operations queue for environmental tickets affecting this rack"],
          ['(text ~ "Rack-14") AND summary ~ "offline" AND created >= -24h', "Find all nodes in Rack-14 that dropped offline in the last 24 hours"]
        ],
        tip: "If 4+ nodes in a rack report down at once, check PDU feed meters and ToR switch link state first!",
        tags: ["pdu", "cdu", "tor", "switch", "shared", "power", "cooling", "leak", "breaker"]
      },
      {
        id: "jql-rack-thermal",
        desc: "Query row, aisle, and pod-level thermal excursions and airflow alarm tickets",
        cmd: '(summary ~ "thermal" OR summary ~ "temperature" OR summary ~ "overheat" OR summary ~ "fan failure") AND (text ~ "Row-B" OR text ~ "Pod-2" OR text ~ "Cold Aisle") AND created >= -30d',
        details: "Finds hot-spot issues where cooling containment tiles or blower fans have degraded, causing nodes in a specific row to throttle clock speeds.",
        flags: [
          ["summary ~ \"thermal\"", "Matches thermal throttling, high ambient temp, or inlet sensor trips"],
          ["text ~ \"Cold Aisle\"", "Correlates containment door leaks or perforated floor tile blockages"]
        ],
        subcommands: [
          ['(summary ~ "fan" OR summary ~ "cooling") AND (text ~ "Rack-14") AND statusCategory != Done', "Check for active fan module or pump faults in this specific rack"],
          ['text ~ "thermal throttle" AND statusCategory != Done', "Find all AI GPU nodes reporting thermal clock throttling"]
        ],
        tip: "Correlate with 'ipmitool sensor | grep Temp' and 'nvidia-smi -q -d TEMPERATURE'",
        tags: ["thermal", "temperature", "overheat", "fan", "cooling", "aisle", "pod", "containment"]
      }
    ]
  },
  {
    id: "serial-asset",
    badge: "sn",
    title: "Chassis Serial, Service Tag & Component Identifiers",
    subtitle: "Instant lookups using hardware serial numbers, OEM service tags, GPU SXM IDs, drive WWNs & MACs",
    commands: [
      {
        id: "jql-serial-chassis",
        desc: "Query tickets by server chassis serial number or OEM service tag",
        cmd: '(text ~ "CZ240101AB" OR "Serial Number" ~ "CZ240101AB" OR "Service Tag" ~ "CZ240101AB" OR summary ~ "CZ240101AB") ORDER BY created DESC',
        details: "Direct lookup using the physical server serial number (obtained from 'dmidecode -s system-serial-number' or the pull-out chassis luggage tag). Avoids ambiguity when hostnames have been changed or reprovisioned.",
        flags: [
          ["text ~ \"<serial>\"", "Global search across ticket bodies, attachments, and RMA shipping manifests"],
          ["\"Serial Number\" ~ \"...\"", "Matches formal asset management serial number custom fields"]
        ],
        subcommands: [
          ['text ~ "CZ240101AB" AND labels in (rma, warranty, replacement)', "Find previous warranty claims or part replacements under this chassis tag"],
          ['"Service Tag" = "7XYZ123"', "Exact match Dell Service Tag lookup in environments with Dell enterprise tracking"]
        ],
        tip: "Run 'dmidecode -t system | grep Serial' on the node to grab the exact chassis serial string",
        tags: ["serial", "service-tag", "chassis", "asset", "hardware", "sn", "dmidecode"]
      },
      {
        id: "jql-serial-gpu",
        desc: "Query tickets by NVIDIA SXM module or PCIe GPU serial number",
        cmd: '(text ~ "1324823001234" OR summary ~ "1324823001234" OR "GPU Serial" ~ "1324823001234") ORDER BY created DESC',
        details: "Matches tickets referencing a specific GPU board or SXM module serial number (obtained via 'nvidia-smi -q | grep Serial'). Essential when validating whether an incoming replacement GPU was already triaged elsewhere in the fleet.",
        flags: [
          ["text ~ \"<gpu-sn>\"", "Matches the 13-digit or 14-digit NVIDIA GPU board serial number"],
          ["ORDER BY created DESC", "Shows the initial failure ticket, NVIDIA enterprise RMA case number, and installation log"]
        ],
        subcommands: [
          ['text ~ "1324823001234" AND text ~ "NVIDIA RMA"', "Locate the official NVIDIA Enterprise Support (NVES) RMA case number"],
          ['text ~ "GPU 3" AND text ~ "gpu-worker-042" AND statusCategory != Done', "Find tickets referencing a specific GPU index on a target node"]
        ],
        tip: "Run 'nvidia-smi --query-gpu=index,gpu_serial,gpu_bus_id --format=csv' to list all GPU serials on a node",
        tags: ["gpu", "sxm", "nvidia", "h200", "b200", "serial", "board", "sn"]
      },
      {
        id: "jql-serial-drive",
        desc: "Query tickets by NVMe, SSD, or SAS drive serial number or WWN",
        cmd: '(text ~ "S6B0NE0R123456" OR "Disk Serial" ~ "S6B0NE0R123456" OR summary ~ "S6B0NE0R123456") AND labels in (disk-fail, nvme, rma, storage)',
        details: "Tracks dead NVMe drive replacements and vendor return tracking. Obtained via 'nvme list' or 'smartctl -i /dev/nvmeXn1'.",
        flags: [
          ["text ~ \"<drive-sn>\"", "Matches the drive serial number from 'nvme list' or 'smartctl'"],
          ["labels in (disk-fail, ...)", "Focuses on storage drive swap tickets"]
        ],
        subcommands: [
          ['(text ~ "nvme0n1" OR text ~ "nvme1n1") AND (text ~ "gpu-worker-042") AND statusCategory != Done', "Check open tickets for specific NVMe block devices on a host"],
          ['text ~ "Media and Data Integrity Errors" AND statusCategory != Done', "Find all nodes reporting NVMe SMART critical warning errors"]
        ],
        tip: "Always record both the Drive Serial Number AND the physical Enclosure Bay Slot # in the ticket!",
        tags: ["nvme", "disk", "drive", "smart", "storage", "serial", "ssd", "bay"]
      },
      {
        id: "jql-serial-net",
        desc: "Query tickets by InfiniBand GUID, MAC address, or PCIe BDF address",
        cmd: '(text ~ "00:02:c9:ab:cd:ef" OR text ~ "0002c9abcdef" OR text ~ "0c42a103005b8e90" OR text ~ "0000:8a:00.0") ORDER BY created DESC',
        details: "Searches tickets referencing networking hardware identifiers, such as Mellanox/NVIDIA ConnectX HCA GUIDs, MAC addresses, or PCIe bus numbers.",
        flags: [
          ["text ~ \"<guid>\"", "Matches 16-hex InfiniBand Node or Port GUIDs from 'ibstat' or 'ibv_devinfo'"],
          ["text ~ \"0000:8a:00.0\"", "Matches the PCIe BDF address from 'lspci' or 'dmesg'"]
        ],
        subcommands: [
          ['text ~ "mlx5_0" AND (text ~ "gpu-worker-042") AND statusCategory != Done', "Check open tickets for primary HCA mlx5_0 on target node"],
          ['text ~ "PCIe AER" AND (text ~ "gpu-worker-042")', "Find tickets regarding PCIe Advanced Error Reporting AER bus errors"]
        ],
        tip: "Search MAC addresses both with colons ('00:11:22:33:44:55') and without ('001122334455')",
        tags: ["mac", "guid", "infiniband", "pcie", "bdf", "hca", "connectx", "nic"]
      }
    ]
  },
  {
    id: "hardware-rma",
    badge: "rma",
    title: "Hardware RMAs & Vendor Parts Tracking",
    subtitle: "Track open vendor warranty claims, replacement shipments, reverse logistics, and onsite field engineers",
    commands: [
      {
        id: "jql-rma-all",
        desc: "Query all active, open hardware RMA tickets across all hardware vendors",
        cmd: 'labels in (rma, hardware-rma, vendor-rma) AND statusCategory != Done ORDER BY updated DESC',
        details: "The master queue for datacenter hardware logistics. Tracks all active warranty replacements awaiting vendor review, component shipping, or technician installation.",
        flags: [
          ["labels in (rma, ...)", "Matches standardized datacenter RMA ticket tags"],
          ["statusCategory != Done", "Includes all open, approved, and in-transit statuses"],
          ["ORDER BY updated DESC", "Puts tickets with newest shipping or vendor comments at the top"]
        ],
        subcommands: [
          ['labels in (rma, hardware-rma) AND status in ("Waiting for Parts", "Parts Shipped")', "Filter specifically for parts currently in transit or awaiting courier delivery"],
          ['labels in (rma, hardware-rma) AND status = "Parts Arrived"', "List replacement parts delivered to the datacenter loading dock ready for technician installation"]
        ],
        tip: "Filter by statusCategory != Done to keep closed historical warranty claims out of the active queue",
        tags: ["rma", "vendor", "warranty", "replacement", "parts", "shipping", "hardware"]
      },
      {
        id: "jql-rma-vendor",
        desc: "Filter open RMA tickets by specific hardware vendor (NVIDIA, Supermicro, Dell, HPE)",
        cmd: '(labels in (nvidia-rma, sxm-rma, h200-rma, b200-rma) OR text ~ "NVIDIA RMA" OR "Vendor" = "NVIDIA") AND statusCategory != Done ORDER BY priority DESC',
        details: "Isolate warranty tickets for a specific manufacturer. High-value GPU and switch RMA queues are typically reviewed during weekly vendor escalation calls.",
        flags: [
          ["labels in (nvidia-rma, ...)", "Labels tagged for NVIDIA SXM GPU, NVSwitch, or Quantum-2 switch RMAs"],
          ["\"Vendor\" = \"NVIDIA\"", "Matches vendor dropdown custom field if configured"]
        ],
        subcommands: [
          ['(labels in (smc-rma, supermicro-rma) OR text ~ "Supermicro RMA") AND statusCategory != Done', "View active Supermicro motherboard, power supply, or chassis RMAs"],
          ['(labels in (dell-rma, idrac-rma) OR text ~ "Dell Dispatch") AND statusCategory != Done', "View active Dell PowerEdge server warranty dispatches"]
        ],
        tip: "Include the vendor case number (e.g. NVES #123456 or Dell Dispatch #987654) directly in the ticket summary",
        tags: ["nvidia", "dell", "supermicro", "hpe", "vendor", "rma", "escalation"]
      },
      {
        id: "jql-rma-returns",
        desc: "Track defective core parts awaiting return shipment (Reverse Logistics & SLA Deficit)",
        cmd: 'labels in (rma-pending-return, rma-core-return, return-defective) AND "Return Tracking" is EMPTY AND statusCategory != Done',
        details: "Tracks defective components (failed H200 SXM modules, motherboards, DIMMs) that must be shipped back to the vendor within 14–30 days to avoid unreturned core fee penalties.",
        flags: [
          ["labels in (rma-pending-return, ...)", "Identifies defective components that have been physically pulled from a server"],
          ["\"Return Tracking\" is EMPTY", "Alerts on packages that do not yet have a FedEx/UPS return tracking number recorded"]
        ],
        subcommands: [
          ['labels = "rma-pending-return" AND updated <= -7d', "Flag defective parts pulled over 7 days ago that have not yet shipped"],
          ['text ~ "FedEx" OR text ~ "UPS" AND labels in (rma, return) AND statusCategory != Done', "Look up in-flight reverse logistics tracking numbers"]
        ],
        tip: "Vendors charge massive core fees for late returns on high-value AI accelerator silicon!",
        tags: ["return", "core", "defective", "tracking", "reverse-logistics", "fedex", "ups", "sla"]
      },
      {
        id: "jql-rma-onsite",
        desc: "Query vendor field engineer (FE) onsite crash-cart dispatches and escorted visits",
        cmd: '(summary ~ "onsite" OR summary ~ "dispatch" OR labels in (vendor-dispatch, fe-onsite, crash-cart)) AND statusCategory != Done ORDER BY "Target Start" ASC, created ASC',
        details: "Tracks vendor technicians (Dell, HPE, Supermicro, NVIDIA) scheduled to visit the physical datacenter cage to replace motherboards, midplanes, or liquid manifolds.",
        flags: [
          ["summary ~ \"dispatch\"", "Identifies field engineer onsite dispatch requests"],
          ["ORDER BY \"Target Start\" ASC", "Sorts by scheduled arrival date and time"]
        ],
        subcommands: [
          ['labels in (vendor-dispatch) AND "Security Escort" is EMPTY AND statusCategory != Done', "Flag upcoming vendor visits that still require DC security access clearance"],
          ['(summary ~ "datacenter access" OR summary ~ "badge access") AND statusCategory != Done', "Track vendor security and badge authorization tickets"]
        ],
        tip: "Ensure badge requests and rack escort clearances are submitted at least 24 hours prior to dispatch",
        tags: ["onsite", "dispatch", "field-engineer", "technician", "escort", "crash-cart", "datacenter"]
      }
    ]
  },
  {
    id: "gpu-cluster",
    badge: "gpu",
    title: "GPU, NVLink & Cluster Fabric Outages",
    subtitle: "Triage NVIDIA SXM/PCIe GPU fatalities, Xid errors, dead NVSwitch links, and InfiniBand optical flaps",
    commands: [
      {
        id: "jql-gpu-xid",
        desc: "Query active NVIDIA GPU fatal crashes (Xid 79, Xid 62, GPU fallen off the bus)",
        cmd: '(summary ~ "Xid" OR text ~ "Xid 79" OR text ~ "Xid 62" OR text ~ "SXid" OR summary ~ "fallen off the bus" OR labels in (gpu-xid, sxid-fail)) AND statusCategory != Done ORDER BY priority DESC',
        details: "High-priority triage query for AI GPU cluster failures. Xid 79 (GPU fallen off bus) and Xid 62 (Internal micro-controller halt) indicate hard silicon or SXM socket failures.",
        flags: [
          ["text ~ \"Xid 79\"", "GPU has fallen off the PCIe/NVLink bus (requires chassis power cycle or SXM swap)"],
          ["text ~ \"SXid\"", "NVSwitch fatal fabric error on HGX architectures"],
          ["labels in (gpu-xid, ...)", "Standard incident labels applied by cluster monitoring agents"]
        ],
        subcommands: [
          ['(text ~ "Xid 79") AND (text ~ "gpu-worker-042")', "Check if a specific node has previously reported Xid 79"],
          ['text ~ "Xid 31" AND statusCategory != Done', "Find memory page retirement / excessive recoverable ECC incidents"]
        ],
        tip: "Correlate with 'dmesg -T | grep -E \"NVRM: Xid\"' on the physical node",
        tags: ["xid", "gpu", "nvidia", "h200", "b200", "sxid", "crash", "cluster", "ai"]
      },
      {
        id: "jql-gpu-nvlink",
        desc: "Query active NVLink and NVSwitch link degradation or down-port tickets",
        cmd: '(text ~ "NVLink" OR text ~ "NVSwitch" OR labels in (nvlink-down, nvswitch-fail, fabric-degraded)) AND statusCategory != Done ORDER BY created DESC',
        details: "Finds nodes where inter-GPU NVLink bandwidth is cut in half or training jobs fail with NCCL connection timeouts due to degraded high-speed copper/optical NVLink traces.",
        flags: [
          ["text ~ \"NVLink\"", "Matches NVLink error messages, CRC failures, and degraded link speeds"],
          ["labels in (nvlink-down, ...)", "Used by NCCL health check suites to flag nodes failing 'nccl-tests'"]
        ],
        subcommands: [
          ['(text ~ "NVSwitch") AND (summary ~ "unresponsive" OR summary ~ "offline")', "Find physical NVSwitch ASIC failures on HGX baseboards"],
          ['text ~ "NVLink down" AND text ~ "gpu-worker-042"', "Check NVLink link state history on a specific node"]
        ],
        tip: "Run 'nvidia-smi nvlink -s' and check for replay/recovery errors on active lanes",
        tags: ["nvlink", "nvswitch", "hgx", "nccl", "fabric", "bandwidth", "gpu"]
      },
      {
        id: "jql-gpu-ecc",
        desc: "Query uncorrectable ECC memory and Row Remapping failure incidents",
        cmd: '(text ~ "Row Remap Failure" OR text ~ "uncorrectable ECC" OR summary ~ "Row Remap" OR labels in (row-remap, ecc-uncorrectable)) AND statusCategory != Done',
        details: "Row Remapping Failure indicates the HBM3e/HBM3 high-bandwidth memory has exhausted its spare memory rows, requiring an immediate hardware RMA of the GPU.",
        flags: [
          ["text ~ \"Row Remap Failure\"", "Crucial RMA trigger condition for NVIDIA H100/H200/B200 GPUs"],
          ["text ~ \"uncorrectable ECC\"", "Double-bit memory error requiring immediate GPU/system restart"]
        ],
        subcommands: [
          ['text ~ "Row Remap Pending" AND statusCategory != Done', "Find GPUs that require a node reboot/reset to activate pending row remaps"],
          ['(summary ~ "DIMM" OR summary ~ "ECC") AND (text ~ "gpu-worker-042")', "Audit host CPU DDR5/DDR4 ECC memory replacement history on a node"]
        ],
        tip: "Check row remap status on the node using 'nvidia-smi --query-gpu=remapped_rows.failure --format=csv'",
        tags: ["ecc", "row-remap", "hbm", "memory", "uncorrectable", "dram", "gpu", "rma"]
      },
      {
        id: "jql-ib-flaps",
        desc: "Query InfiniBand fabric port flaps, symbol errors, and optical high-BER tickets",
        cmd: '(text ~ "IB link down" OR text ~ "Symbol Error" OR text ~ "high BER" OR text ~ "port flap" OR labels in (infiniband-flap, optical-dom, ib-ber)) AND statusCategory != Done',
        details: "Identifies nodes causing multi-node distributed training job interruptions due to dirty MPO fiber ferrules, failing OSFP/QSFP optics, or high bit error rates (BER).",
        flags: [
          ["text ~ \"Symbol Error\"", "Physical layer bit corruptions typically caused by contaminated optical end-faces"],
          ["text ~ \"high BER\"", "Bit Error Rate exceeding NDR 400G / XDR 800G FEC forward error correction limits"]
        ],
        subcommands: [
          ['(text ~ "mlx5_") AND (text ~ "link down") AND (text ~ "gpu-worker-042")', "Check for specific ConnectX adapter link down incidents on a node"],
          ['text ~ "Effective BER" AND statusCategory != Done', "Find all nodes reporting critical pre-FEC or post-FEC link degradation"]
        ],
        tip: "Run 'mlxlink -d <dev> -m -c -e' to inspect physical link parameters and transceiver DOM light levels",
        tags: ["infiniband", "ber", "optics", "symbol-error", "link-down", "flap", "mpo", "osfp"]
      }
    ]
  },
  {
    id: "slurm-drain",
    badge: "drain",
    title: "Cluster Scheduler, Node Drains & Maintenance",
    subtitle: "Identify nodes drained in Slurm or cordoned in Kubernetes, burn-in validation tickets, and maintenance windows",
    commands: [
      {
        id: "jql-slurm-drained",
        desc: "Query compute nodes currently drained in Slurm awaiting technician physical triage",
        cmd: 'labels in (slurm-drain, drained-node, node-drain, cordoned) AND statusCategory != Done ORDER BY priority DESC, created ASC',
        details: "Shows all compute nodes that the Slurm scheduler ('sinfo -R' or automated health check epilogs) has drained and placed in maintenance hold. Technicians use this queue to clear repair backlogs.",
        flags: [
          ["labels in (slurm-drain, ...)", "Labels tagged automatically by slurmctld prolog/epilog or site operators"],
          ["ORDER BY created ASC", "Surfaces oldest drained nodes to prevent cluster capacity starvation"]
        ],
        subcommands: [
          ['(text ~ "gpu-worker-042") AND labels in (drain, slurm-drain)', "Check why a specific node was marked drained in Slurm"],
          ['text ~ "scontrol update NodeName" AND statusCategory != Done', "Find tickets referencing manual Slurm drain or resume commands"]
        ],
        tip: "Verify current live Slurm state on jumpbox with 'sinfo -N -n <node> -o \"%N %T %E\"'",
        tags: ["slurm", "drain", "cordon", "scheduler", "cluster", "maintenance", "scontrol", "sinfo"]
      },
      {
        id: "jql-slurm-k8s",
        desc: "Query Kubernetes worker nodes marked Cordoned, NotReady, or Evacuated",
        cmd: '(summary ~ "NotReady" OR summary ~ "Cordoned" OR labels in (k8s-notready, k8s-cordoned)) AND statusCategory != Done ORDER BY created DESC',
        details: "Triage Kubernetes GPU worker clusters. Finds nodes where the Kubelet has stopped responding, container runtime (containerd/docker) crashed, or node was cordoned.",
        flags: [
          ["summary ~ \"NotReady\"", "Node condition NodeReady=False or NodeReady=Unknown"],
          ["labels in (k8s-cordoned, ...)", "Node scheduling disabled by cluster administrator via 'kubectl cordon'"]
        ],
        subcommands: [
          ['text ~ "gpu-worker-042" AND summary ~ "k8s"', "Check Kubernetes cluster events and tickets for target node"],
          ['text ~ "PLEG is not healthy" AND statusCategory != Done', "Find nodes reporting Process Lifecycle Event Generator runtime stalls"]
        ],
        tip: "Check live K8s status via 'kubectl get node <node> -o wide' and 'kubectl describe node <node>'",
        tags: ["k8s", "kubernetes", "cordon", "notready", "worker", "kubelet", "containerd"]
      },
      {
        id: "jql-slurm-burnin",
        desc: "Query hardware burn-in, acceptance testing, and factory validation failures",
        cmd: '(summary ~ "burn-in" OR summary ~ "acceptance" OR summary ~ "L10 triage" OR labels in (burnin-fail, acceptance-fail)) AND statusCategory != Done',
        details: "Tracks newly racked or repaired servers undergoing qualification tests (e.g. 24-hour GEMM GPU stress, HPL, FIO storage test, and NCCL all-reduce).",
        flags: [
          ["summary ~ \"burn-in\"", "Stress testing phases to catch infant mortality on silicon"],
          ["labels in (burnin-fail, ...)", "Flags servers that failed thermal or compute stress tests prior to production handover"]
        ],
        subcommands: [
          ['(text ~ "gpu-worker-042") AND summary ~ "burn-in"', "View burn-in logs and acceptance history for target node"],
          ['text ~ "HPL failed" OR text ~ "nccl-tests failed" AND statusCategory != Done', "Find nodes failing high-performance cluster benchmarks"]
        ],
        tip: "Run 'dcgmi diag -r 3' and 'nccl-tests' locally before closing out burn-in tickets",
        tags: ["burn-in", "acceptance", "validation", "stress", "gemm", "hpl", "nccl", "factory"]
      },
      {
        id: "jql-slurm-maint",
        desc: "Query scheduled maintenance windows, cluster cold-starts, and BIOS/firmware campaigns",
        cmd: 'issuetype in ("Maintenance", "Scheduled Change") AND (summary ~ "BIOS" OR summary ~ "Firmware" OR summary ~ "upgrade" OR summary ~ "outage") AND "Target End" >= now() ORDER BY "Target Start" ASC',
        details: "Tracks planned cluster downtime so technicians don't mistake maintenance reboots for unexpected hardware failures.",
        flags: [
          ["issuetype in (\"Maintenance\", ...)", "Standard change management ticket types"],
          ["\"Target End\" >= now()", "Filters for active and future scheduled maintenance windows"]
        ],
        subcommands: [
          ['text ~ "Rack-14" AND issuetype = "Maintenance" AND "Target End" >= now()', "Check if target rack has upcoming power or networking downtime scheduled"],
          ['summary ~ "Firmware update" AND statusCategory != Done', "Track fleet-wide firmware deployment progress"]
        ],
        tip: "Always verify change calendar before performing mid-day hardware reboots",
        tags: ["maintenance", "scheduled", "change", "downtime", "bios", "firmware", "upgrade"]
      }
    ]
  },
  {
    id: "queue-ops",
    badge: "queue",
    title: "Datacenter Operations & Queue Management",
    subtitle: "P1 blockers, unassigned hardware queue, technician task assignments, and post-maintenance verification",
    commands: [
      {
        id: "jql-ops-blocker",
        desc: "Query Critical, Blocker, and P1 severity hardware outages currently active",
        cmd: 'priority in (Highest, Blocker, Critical, P1) AND project in (DC, HW, INFRA) AND statusCategory != Done ORDER BY created ASC',
        details: "The highest urgency queue in the datacenter. Lists cluster-blocking emergencies (e.g. fire suppression alarms, chiller failures, spine switch down, multi-node training blocks).",
        flags: [
          ["priority in (Highest, Blocker, ...)", "Highest severity classification"],
          ["project in (DC, HW, INFRA)", "Limits search to physical infrastructure projects"],
          ["ORDER BY created ASC", "Surfaces oldest open blockers first to respect MTTR SLA deadlines"]
        ],
        subcommands: [
          ['priority in (Highest, Blocker) AND statusCategory != Done AND assignee is EMPTY', "Show unassigned P1 blockers requiring immediate technician pickup"],
          ['priority = Highest AND created >= -24h', "Show all critical incidents raised in the past 24 hours"]
        ],
        tip: "Review this query at the start of every shift handover!",
        tags: ["p1", "blocker", "critical", "highest", "severity", "urgent", "emergency", "sla"]
      },
      {
        id: "jql-ops-unassigned",
        desc: "Query unassigned tickets in the Datacenter Hardware Operations queue",
        cmd: 'project in (DC, HW, INFRA) AND assignee is EMPTY AND statusCategory = "To Do" ORDER BY priority DESC, created ASC',
        details: "The general dispatch inbox. Technicians pull new hardware repair tasks, drive swaps, and cable inspections from this query.",
        flags: [
          ["assignee is EMPTY", "Finds tickets not yet claimed by any technician"],
          ["statusCategory = \"To Do\"", "Filters out tickets already in progress or completed"]
        ],
        subcommands: [
          ['project = "HW" AND assignee is EMPTY AND labels = "drive-swap"', "Filter unassigned drive swap tasks"],
          ['project = "HW" AND assignee is EMPTY AND labels = "cable-check"', "Filter unassigned optical cable cleaning/inspection tasks"]
        ],
        tip: "Assign ticket to yourself ('assignee = currentUser()') before entering the datacenter cage",
        tags: ["unassigned", "queue", "inbox", "dispatch", "todo", "triage", "operations"]
      },
      {
        id: "jql-ops-my-tickets",
        desc: "Query all active tickets assigned to the currently logged-in technician",
        cmd: 'assignee = currentUser() AND statusCategory in ("To Do", "In Progress") ORDER BY priority DESC, updated DESC',
        details: "Personal technician workboard query. Shows your active repair assignments, pending verifications, and parts in transit.",
        flags: [
          ["assignee = currentUser()", "Dynamically evaluates to whoever is logged into Jira"],
          ["statusCategory in (...)", "Includes work you need to do and work actively underway"]
        ],
        subcommands: [
          ['assignee = currentUser() AND status = "In Progress"', "Show tickets you are actively working on right now"],
          ['assignee = currentUser() AND updated <= -3d AND statusCategory != Done', "Flag stale tickets on your board that have not had an update in 3 days"]
        ],
        tip: "Bookmark this query in your browser for 1-click access to your daily shift tasks",
        tags: ["my-tickets", "assignee", "currentuser", "workboard", "tasks", "technician"]
      },
      {
        id: "jql-ops-resolved-today",
        desc: "Query recently resolved tickets (last 24 hours) for post-maintenance burn-in audit",
        cmd: 'project in (DC, HW, INFRA) AND statusCategory = Done AND resolved >= -24h ORDER BY resolved DESC',
        details: "Shift handover and quality audit query. Review what physical components were replaced in the last 24 hours and verify that nodes have successfully rejoined the scheduler.",
        flags: [
          ["resolved >= -24h", "Matches issues closed within the past 24 hours"],
          ["statusCategory = Done", "Filters for completed tickets"]
        ],
        subcommands: [
          ['project in (DC, HW) AND resolved >= -7d AND labels in (rma, replacement)', "Weekly audit of all replaced hardware components"],
          ['resolution = "Fixed" AND resolved >= startOfDay() ORDER BY resolved DESC', "Show all issues successfully repaired since midnight today"]
        ],
        tip: "Great for writing shift pass-down logs for incoming technicians",
        tags: ["resolved", "done", "audit", "handover", "completed", "shift", "passdown"]
      }
    ]
  },
  {
    id: "jira-api-cli",
    badge: "api",
    title: "Jira REST API & CLI Automation",
    subtitle: "Automate ticket lookups, create hardware incident reports, and post triage notes via curl and jira-cli",
    commands: [
      {
        id: "api-curl-search",
        desc: "Query Jira tickets using JQL via `curl` and parse key fields with `jq`",
        cmd: 'curl -s -u "$JIRA_USER:$JIRA_API_TOKEN" -H "Content-Type: application/json" \\\n  "https://$JIRA_HOST/rest/api/3/search?jql=$(echo \'text ~ "gpu-worker-042" AND statusCategory != Done\' | jq -sRr @uri)&fields=key,summary,priority,status,assignee" \\\n  | jq \'.issues[] | {key: .key, summary: .fields.summary, priority: .fields.priority.name, status: .fields.status.name, assignee: .fields.assignee.displayName}\'',
        details: "Queries the Jira Cloud v3 or Data Center v2 REST search API from your terminal or diagnostic scripts. URL-encodes the JQL query using 'jq -sRr @uri' to avoid encoding breakages.",
        flags: [
          ["-u \"$JIRA_USER:$JIRA_API_TOKEN\"", "Authenticates via email & API token (Cloud) or Bearer Personal Access Token PAT (Data Center)"],
          ["&fields=key,summary,...", "Restricts returned JSON payload to only needed fields, speeding up queries 10x"],
          ["jq -sRr @uri", "Safely URL-encodes spaces, quotes, and operators in JQL for HTTP GET parameters"]
        ],
        subcommands: [
          ['curl -s -H "Authorization: Bearer $JIRA_PAT" "https://$JIRA_HOST/rest/api/2/search?jql=text~%22gpu-worker-042%22" | jq \'.total\'', "Query Jira Data Center / Server using a Personal Access Token (PAT)"],
          ['curl -s -u "$JIRA_USER:$JIRA_API_TOKEN" "https://$JIRA_HOST/rest/api/3/issue/HW-1234?fields=comment" | jq \'.fields.comment.comments[-1].body\'', "Fetch the latest technician triage comment on a specific ticket"]
        ],
        tip: "Set JIRA_HOST='yourcompany.atlassian.net' and store your API token in ~/.jira_token",
        tags: ["curl", "api", "rest", "jql", "search", "jq", "automation", "token"]
      },
      {
        id: "api-curl-create",
        desc: "Create a new hardware incident ticket via Jira REST API using `curl` and JSON payload",
        cmd: 'curl -s -X POST -u "$JIRA_USER:$JIRA_API_TOKEN" \\\n  -H "Content-Type: application/json" "https://$JIRA_HOST/rest/api/3/issue" \\\n  -d \'{\n    "fields": {\n      "project": { "key": "HW" },\n      "summary": "[gpu-worker-042] GPU 3 SXM Row Remap Failure (Xid 79)",\n      "issuetype": { "name": "Incident" },\n      "priority": { "name": "High" },\n      "labels": ["gpu-fail", "rma-needed", "h200"],\n      "description": {\n        "type": "doc",\n        "version": 1,\n        "content": [\n          {\n            "type": "paragraph",\n            "content": [\n              { "type": "text", "text": "Server gpu-worker-042 reported fatal GPU 3 row remap exhaustion. DCGM diag -r 3 failed. RMA required." }\n            ]\n          }\n        ]\n      }\n    }\n  }\' | jq \'{key: .key, self: .self}\'',
        details: "Automate incident ticket creation directly from local diagnostic scripts (e.g. when an automated health check detects a dead GPU, unseated drive, or link down).",
        flags: [
          ["-X POST", "HTTP method to create new issue resource"],
          ["\"project\": { \"key\": \"HW\" }", "The target Jira project key (e.g. HW, DC, INFRA)"],
          ["Atlassian Document Format (ADF)", "Jira Cloud v3 uses structured ADF format for description; Jira Server/Data Center uses plain string"]
        ],
        subcommands: [
          ['# Jira Server / Data Center (v2 plain text format)\ncurl -s -X POST -H "Authorization: Bearer $JIRA_PAT" -H "Content-Type: application/json" \\\n  "https://$JIRA_HOST/rest/api/2/issue" -d \'{"fields":{"project":{"key":"HW"},"summary":"[node-042] Drive Failed","issuetype":{"name":"Incident"},"description":"Disk /dev/nvme0n1 failed SMART"}}', "Jira Data Center v2 syntax using simple text strings"]
        ],
        tip: "Always include the server hostname in square brackets at the start of the summary: '[node-042] ...'",
        tags: ["create", "issue", "api", "rest", "post", "ticket", "curl", "json"]
      },
      {
        id: "api-curl-comment",
        desc: "Append a technician triage note or command output comment to an existing ticket",
        cmd: 'curl -s -X POST -u "$JIRA_USER:$JIRA_API_TOKEN" \\\n  -H "Content-Type: application/json" \\\n  "https://$JIRA_HOST/rest/api/3/issue/HW-1234/comment" \\\n  -d \'{\n    "body": {\n      "type": "doc",\n      "version": 1,\n      "content": [\n        {\n          "type": "paragraph",\n          "content": [\n            { "type": "text", "text": "Technician replaced GPU 3 in bay 3. Re-ran dcgmi diag -r 3: ALL TESTS PASSED. Node resumed in Slurm." }\n          ]\n        }\n      ]\n    }\n  }\' | jq \'.id\'',
        details: "Allows scripts or technicians to append diagnostic logs, serial verification, and post-repair test results directly into the Jira incident record.",
        flags: [
          ["HW-1234", "The target Jira ticket key"],
          ["/comment", "The comments sub-resource endpoint"]
        ],
        subcommands: [
          ['# Jira Server / Data Center (v2 format)\ncurl -s -X POST -H "Authorization: Bearer $JIRA_PAT" -H "Content-Type: application/json" \\\n  "https://$JIRA_HOST/rest/api/2/issue/HW-1234/comment" -d \'{"body":"Technician inspected MPO optical cable: cleaned ferrule and link restored."}\'', "Append note to Jira Data Center issue"]
        ],
        tip: "Paste the output of 'mlxlink' or 'dcgmi diag' into comments for warranty audit proof",
        tags: ["comment", "note", "triage", "update", "api", "rest", "log", "worklog"]
      },
      {
        id: "api-curl-transition",
        desc: "Transition ticket workflow status (e.g. Move to 'In Progress' or 'Resolved')",
        cmd: '# 1. Fetch available workflow transition IDs for ticket\ncurl -s -u "$JIRA_USER:$JIRA_API_TOKEN" "https://$JIRA_HOST/rest/api/3/issue/HW-1234/transitions" | jq \'.transitions[] | {id: .id, name: .name}\'\n\n# 2. Execute transition using desired ID (e.g. ID "31" for Resolved)\ncurl -s -X POST -u "$JIRA_USER:$JIRA_API_TOKEN" -H "Content-Type: application/json" \\\n  "https://$JIRA_HOST/rest/api/3/issue/HW-1234/transitions" \\\n  -d \'{"transition": {"id": "31"}}\'',
        details: "Moves tickets through your company's workflow states automatically when technician actions complete (e.g. automatically mark 'Resolved' when burn-in test succeeds).",
        flags: [
          ["GET /transitions", "Returns all valid next-step states and their numerical IDs for this specific issue"],
          ["POST /transitions", "Executes the transition state change"]
        ],
        subcommands: [
          ['curl -s -X POST -u "$JIRA_USER:$JIRA_API_TOKEN" -H "Content-Type: application/json" "https://$JIRA_HOST/rest/api/3/issue/HW-1234/transitions" -d \'{"transition":{"id":"21"}}\'', "Move issue from 'To Do' to 'In Progress'"]
        ],
        tip: "Transition IDs vary between projects—always query GET /transitions first to find the exact ID",
        tags: ["transition", "status", "resolve", "close", "workflow", "api", "rest"]
      },
      {
        id: "cli-jira-list",
        desc: "Terminal triage using `jira` CLI (go-jira / atlassian-cli)",
        cmd: 'jira issue list -q "(text ~ \'gpu-worker-042\') AND statusCategory != Done" --columns key,priority,summary,status,assignee',
        details: "Fast terminal-based workflow for technicians who prefer staying in their bash terminal or tmux session without opening a heavy web browser.",
        flags: [
          ["-q \"...\"", "Passes arbitrary raw JQL query directly to Jira"],
          ["--columns ...", "Customizes terminal table columns for compact display on small screens"]
        ],
        subcommands: [
          ['jira issue list -q "assignee = currentUser() AND statusCategory != Done"', "List your active assigned tickets from your terminal"],
          ['jira issue view HW-1234', "View ticket details, description, and comments in terminal pager"],
          ['jira issue comment add HW-1234 -m "Inspected node: reseated PCIe riser card."', "Quickly add a triage note from command line"]
        ],
        tip: "Install via 'brew install jira-cli' or download from github.com/ankitpokhrel/jira-cli",
        tags: ["cli", "jira-cli", "terminal", "go-jira", "tmux", "bash", "table"]
      }
    ]
  }
];

// Interactive JQL Query Composer Recipes
const JIRA_COMPOSER_RECIPES = {
  "node-all": {
    name: "All Tickets for Server / Node Hostname",
    defaultArg: "gpu-worker-042",
    placeholder: "Enter hostname (e.g. gpu-worker-042)...",
    desc: "Finds all historical, maintenance, and active tickets ever logged for this specific server node.",
    build: (val) => `(summary ~ "${val}" OR description ~ "${val}" OR text ~ "${val}" OR "Host Name" ~ "${val}") ORDER BY created DESC`
  },
  "node-open": {
    name: "Open / Active Incidents on Target Node",
    defaultArg: "gpu-worker-042",
    placeholder: "Enter hostname...",
    desc: "Lists only currently unresolved incidents and ongoing maintenance on this specific server.",
    build: (val) => `(text ~ "${val}") AND statusCategory != Done ORDER BY priority DESC, created ASC`
  },
  "rack-all": {
    name: "All Tickets for Physical Rack (Rack-14 / R14)",
    defaultArg: "Rack-14",
    placeholder: "Enter rack identifier (e.g. Rack-14, R14)...",
    desc: "Locates all tickets affecting an entire rack enclosure, including nodes, switches, and PDUs.",
    build: (val) => `(text ~ "${val}" OR text ~ "${val.replace('-', ' ')}" OR summary ~ "${val}") ORDER BY created DESC`
  },
  "rack-ru": {
    name: "Tickets for Specific RU Slot in Rack",
    defaultArg: "RU21",
    placeholder: "Enter RU slot (e.g. RU21, U21)...",
    desc: "Combines rack and unit position to pinpoint tickets for a specific server elevation.",
    build: (val) => `(text ~ "Rack-14") AND (text ~ "${val}" OR text ~ "${val.replace('RU', 'U')}" OR "Rack Unit" ~ "${val.replace('RU', '')}") ORDER BY created DESC`
  },
  "serial-chassis": {
    name: "Chassis Serial Number / Service Tag",
    defaultArg: "CZ240101AB",
    placeholder: "Enter serial or service tag...",
    desc: "Direct lookup by physical chassis serial (from dmidecode or luggage tag).",
    build: (val) => `(text ~ "${val}" OR "Serial Number" ~ "${val}" OR "Service Tag" ~ "${val}") ORDER BY created DESC`
  },
  "serial-component": {
    name: "Component Serial (GPU SXM / NVMe / HCA)",
    defaultArg: "1324823001234",
    placeholder: "Enter GPU or NVMe serial number...",
    desc: "Tracks component-level warranty history and vendor RMA records.",
    build: (val) => `(text ~ "${val}" OR summary ~ "${val}") ORDER BY created DESC`
  },
  "open-p1": {
    name: "Open P1 / Blocker Hardware Outages",
    defaultArg: "HW",
    placeholder: "Enter Jira project key (e.g. HW, DC, INFRA)...",
    desc: "Surfaces all critical, blocker, and highest-priority hardware incidents in a project.",
    build: (val) => `project = "${val}" AND priority in (Highest, Blocker, Critical, P1) AND statusCategory != Done ORDER BY created ASC`
  },
  "active-rma": {
    name: "Active Hardware RMAs (Awaiting Parts / Vendor)",
    defaultArg: "NVIDIA",
    placeholder: "Enter vendor or component (e.g. NVIDIA, Dell, Supermicro)...",
    desc: "Filters active warranty claims awaiting shipment, delivery, or core return.",
    build: (val) => `labels in (rma, hardware-rma) AND (text ~ "${val}" OR "Vendor" ~ "${val}") AND statusCategory != Done ORDER BY updated DESC`
  },
  "slurm-drains": {
    name: "Slurm Drained & Cordoned Nodes Queue",
    defaultArg: "slurm-drain",
    placeholder: "Enter drain label or partition...",
    desc: "Lists compute nodes removed from active scheduling awaiting technician repair.",
    build: (val) => `labels in (${val}, drained-node, cordoned) AND statusCategory != Done ORDER BY priority DESC`
  },
  "unassigned-queue": {
    name: "Unassigned Datacenter Hardware Queue",
    defaultArg: "HW",
    placeholder: "Enter Jira project key...",
    desc: "Shows unclaimed hardware triage tickets in need of technician pickup.",
    build: (val) => `project = "${val}" AND assignee is EMPTY AND statusCategory = "To Do" ORDER BY priority DESC, created ASC`
  },
  "recent-closed": {
    name: "Recently Resolved (Last 24 Hours Verification)",
    defaultArg: "HW",
    placeholder: "Enter Jira project key...",
    desc: "Audits hardware repairs closed in the last 24 hours for shift handover verification.",
    build: (val) => `project = "${val}" AND statusCategory = Done AND resolved >= -24h ORDER BY resolved DESC`
  }
};

// Global state for JIRA sheet
let state = {
  searchQuery: "",
  activeCategory: "all",
  bookmarks: new Set(JSON.parse(localStorage.getItem("jira_cs_bookmarks") || "[]")),
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark"
};

// DOM references
const searchInput = document.getElementById("search-input");
const categoryTabsEl = document.getElementById("category-tabs");
const sectionsContainer = document.getElementById("sections-container");
const commandCountEl = document.getElementById("command-count");
const totalCommandsCountEl = document.getElementById("total-commands-count");
const savedCountEl = document.getElementById("saved-count");
const savedFilterBtn = document.getElementById("saved-filter-btn");
const densityToggleBtn = document.getElementById("density-toggle");
const printBtn = document.getElementById("print-btn");
const themeToggleBtn = document.getElementById("theme-toggle");
const resetSearchBtn = document.getElementById("reset-search-btn");

function getFilteredData() {
  const query = state.searchQuery.toLowerCase().trim();

  return JIRA_CHEAT_SHEET_DATA.map((section) => {
    if (state.activeCategory !== "all" && section.id !== state.activeCategory) {
      return null;
    }

    const filteredCommands = section.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) {
        return false;
      }

      if (!query) return true;

      const inDesc = cmd.desc.toLowerCase().includes(query);
      const inCmd = cmd.cmd.toLowerCase().includes(query);
      const inDetails = cmd.details && cmd.details.toLowerCase().includes(query);
      const inTags = cmd.tags && cmd.tags.some((t) => t.toLowerCase().includes(query));
      const inSub = cmd.subcommands && cmd.subcommands.some(([c, d]) =>
        c.toLowerCase().includes(query) || d.toLowerCase().includes(query)
      );

      return inDesc || inCmd || inDetails || inTags || inSub;
    });

    if (filteredCommands.length === 0) return null;

    return {
      ...section,
      commands: filteredCommands
    };
  }).filter(Boolean);
}

function renderCategoryTabs() {
  if (!categoryTabsEl) return;
  const categories = [
    { id: "all", label: "All JQL & API Queries" },
    ...JIRA_CHEAT_SHEET_DATA.map((s) => ({ id: s.id, label: s.title.split("—")[0].trim() }))
  ];

  categoryTabsEl.innerHTML = categories
    .map(
      (cat) => `
    <button
      type="button"
      class="cat-tab ${state.activeCategory === cat.id ? "active" : ""}"
      data-cat="${cat.id}"
      role="tab"
      aria-selected="${state.activeCategory === cat.id}"
    >
      ${escapeHtml(cat.label)}
    </button>
  `
    )
    .join("");
}

function renderSections() {
  if (!sectionsContainer) return;
  const filteredData = getFilteredData();
  const totalVisibleCommands = filteredData.reduce((acc, s) => acc + s.commands.length, 0);

  if (commandCountEl) commandCountEl.textContent = totalVisibleCommands;
  if (savedCountEl) savedCountEl.textContent = state.bookmarks.size;

  const totalAll = JIRA_CHEAT_SHEET_DATA.reduce((acc, s) => acc + s.commands.length, 0);
  if (totalCommandsCountEl) totalCommandsCountEl.textContent = totalAll;

  if (filteredData.length === 0) {
    sectionsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🔍</div>
        <h3>No matching Jira queries found</h3>
        <p>Try searching for a different keyword, hostname, or clear active filters.</p>
        <button type="button" class="btn" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  sectionsContainer.innerHTML = filteredData.map((section) => renderSectionCard(section)).join("");
}

function renderSectionCard(section) {
  return `
    <section class="section-card" id="${section.id}">
      <div class="section-header">
        <div class="section-badge">${escapeHtml(section.badge)}</div>
        <div class="section-title-wrap">
          <h2 class="section-title">${escapeHtml(section.title)}</h2>
          <p class="section-subtitle">${escapeHtml(section.subtitle)}</p>
        </div>
      </div>
      <div class="commands-grid">
        ${section.commands.map((cmd) => renderCommandCard(cmd, section)).join("")}
      </div>
    </section>
  `;
}

function renderCommandCard(cmd, section) {
  const isBookmarked = state.bookmarks.has(cmd.id);

  return `
    <div class="command-card" id="card-${cmd.id}">
      <div class="cmd-top-row">
        <div class="cmd-desc-wrap">
          <span class="cmd-desc">${escapeHtml(cmd.desc)}</span>
        </div>
        <div class="cmd-actions">
          <button
            type="button"
            class="bookmark-btn ${isBookmarked ? "active" : ""}"
            data-bookmark-id="${cmd.id}"
            title="${isBookmarked ? "Remove from saved" : "Save for quick access"}"
            aria-label="${isBookmarked ? "Remove from saved" : "Save for quick access"}"
          >
            ★
          </button>
        </div>
      </div>

      <div class="cmd-code-box" data-copy="${escapeHtml(cmd.cmd)}" title="Click to copy query">
        <div class="cmd-code-header">
          <span class="cmd-lang-label">JQL / API</span>
          <span class="copy-hint">Copy</span>
        </div>
        <pre class="cmd-pre"><code class="cmd-code">${escapeHtml(cmd.cmd)}</code></pre>
      </div>

      ${cmd.details ? `<div class="cmd-details-box"><p>${escapeHtml(cmd.details)}</p></div>` : ""}

      ${
        cmd.flags && cmd.flags.length > 0
          ? `
        <div class="cmd-flags-wrap">
          <span class="mini-heading">Syntax &amp; Parameters</span>
          <div class="flags-table">
            ${cmd.flags
              .map(
                ([flag, desc]) => `
              <div class="flag-row">
                <code class="flag-code">${escapeHtml(flag)}</code>
                <span class="flag-desc">${escapeHtml(desc)}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      ${
        cmd.subcommands && cmd.subcommands.length > 0
          ? `
        <div class="cmd-subcommands-wrap">
          <span class="mini-heading">Practical Variations &amp; Recipes</span>
          <div class="subcommands-list">
            ${cmd.subcommands
              .map(
                ([subCmd, subDesc]) => `
              <div class="subcommand-item">
                <div class="sub-code-line" data-copy="${escapeHtml(subCmd)}" title="Click to copy">
                  <code>${escapeHtml(subCmd)}</code>
                  <span class="copy-hint-tiny">Copy</span>
                </div>
                <div class="sub-desc">${escapeHtml(subDesc)}</div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      <div class="cmd-footer-row">
        ${
          cmd.tags && cmd.tags.length > 0
            ? `
          <div class="cmd-tags-list">
            ${cmd.tags.map((t) => `<span class="cmd-tag">${escapeHtml(t)}</span>`).join("")}
          </div>
        `
            : "<div></div>"
        }
        ${cmd.tip ? `<span class="cmd-tip-pill" title="${escapeHtml(cmd.tip)}">💡 ${escapeHtml(cmd.tip)}</span>` : ""}
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function copyToClipboard(text) {
  if (!navigator.clipboard) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    showToast("Copied query to clipboard!");
    return;
  }
  navigator.clipboard.writeText(text).then(
    () => showToast("Copied query to clipboard!"),
    () => showToast("Failed to copy query")
  );
}

function showToast(msg) {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "toast-notification";
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add("visible"), 10);
  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 250);
  }, 2200);
}

function resetAllFilters() {
  state.searchQuery = "";
  state.activeCategory = "all";
  state.savedOnly = false;
  if (searchInput) searchInput.value = "";
  renderCategoryTabs();
  renderSections();
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("linux_cs_theme", theme);
  } catch (e) {}
}

function applyDensity(compact) {
  state.compact = compact;
  document.body.classList.toggle("compact-mode", compact);
  try {
    localStorage.setItem("linux_cs_compact", compact ? "1" : "0");
  } catch (e) {}
}

// -------------------------------------------------------------
// Interactive JQL Query & Link Composer Logic
// -------------------------------------------------------------
function initJiraComposer() {
  const recipeSelect = document.getElementById("jira-recipe-select");
  const targetInput = document.getElementById("jira-target-input");
  const hostInput = document.getElementById("jira-host-input");
  const outputEl = document.getElementById("jira-composer-output");
  const descEl = document.getElementById("jira-composer-desc");
  const copyBtn = document.getElementById("jira-composer-copy");
  const openBtn = document.getElementById("jira-composer-open");

  if (!recipeSelect || !targetInput || !outputEl) return;

  // Populate recipes
  recipeSelect.innerHTML = Object.entries(JIRA_COMPOSER_RECIPES)
    .map(([key, r]) => `<option value="${key}">${escapeHtml(r.name)}</option>`)
    .join("");

  function updateComposer() {
    const key = recipeSelect.value;
    const recipe = JIRA_COMPOSER_RECIPES[key];
    if (!recipe) return;

    const val = targetInput.value.trim() || recipe.defaultArg;
    const jql = recipe.build(val);

    outputEl.textContent = jql;
    if (descEl) descEl.textContent = recipe.desc;

    // Update Open in Jira Link
    if (openBtn && hostInput) {
      const host = (hostInput.value.trim() || "jira.company.com").replace(/^https?:\/\//, "").replace(/\/$/, "");
      const fullUrl = `https://${host}/issues/?jql=${encodeURIComponent(jql)}`;
      openBtn.href = fullUrl;
    }
  }

  recipeSelect.addEventListener("change", () => {
    const key = recipeSelect.value;
    const recipe = JIRA_COMPOSER_RECIPES[key];
    if (recipe) {
      targetInput.value = recipe.defaultArg;
      targetInput.placeholder = recipe.placeholder;
      updateComposer();
    }
  });

  targetInput.addEventListener("input", updateComposer);
  if (hostInput) hostInput.addEventListener("input", updateComposer);

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      copyToClipboard(outputEl.textContent);
    });
  }

  updateComposer();
}

function initEvents() {
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      renderSections();
    });
  }

  if (categoryTabsEl) {
    categoryTabsEl.addEventListener("click", (e) => {
      const tab = e.target.closest("[data-cat]");
      if (!tab) return;
      state.activeCategory = tab.dataset.cat;
      renderCategoryTabs();
      renderSections();
    });
  }

  if (sectionsContainer) {
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
          showToast("Removed from saved queries");
        } else {
          state.bookmarks.add(id);
          showToast("Saved query to bookmarks");
        }
        localStorage.setItem("jira_cs_bookmarks", JSON.stringify([...state.bookmarks]));
        renderSections();
      }
    });
  }

  if (savedFilterBtn) {
    savedFilterBtn.addEventListener("click", () => {
      state.savedOnly = !state.savedOnly;
      renderSections();
    });
  }

  if (densityToggleBtn) {
    densityToggleBtn.addEventListener("click", () => {
      applyDensity(!state.compact);
    });
  }

  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      applyTheme(state.theme === "dark" ? "light" : "dark");
    });
  }

  if (resetSearchBtn) {
    resetSearchBtn.addEventListener("click", resetAllFilters);
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    } else if (e.key === "Escape") {
      if (document.activeElement === searchInput || state.searchQuery) {
        if (searchInput) searchInput.value = "";
        state.searchQuery = "";
        if (searchInput) searchInput.blur();
        renderSections();
      }
    }
  });
}

applyTheme(state.theme);
applyDensity(state.compact);
renderCategoryTabs();
renderSections();
initJiraComposer();
initEvents();
