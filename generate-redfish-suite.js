// generate-redfish-suite.js
// Generates all 8 standalone DMTF Redfish cheat sheets and updates the Redfish dropdown across all HTML sheets.
const fs = require('fs');
const path = require('path');
const { mergeCommandCards } = require('./generate-card-utils');

// 1. Read redfish.js to extract REDFISH_CHEAT_SHEET_DATA
const rfJs = fs.readFileSync(path.join(__dirname, 'redfish.js'), 'utf8');
const dataEndIdx = rfJs.indexOf('const state = {');
const dataCode = rfJs.slice(0, dataEndIdx) + '\nREDFISH_CHEAT_SHEET_DATA;';
const REDFISH_CHEAT_SHEET_DATA = eval(dataCode);
console.log(`Loaded ${REDFISH_CHEAT_SHEET_DATA.length} Redfish sections from redfish.js`);

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 2. Define the Redfish Navbar Dropdown Snippet
const RF_NAVBAR_SNIPPET = `              <div class="nav-dropdown" id="redfish-nav-dropdown">
                <a href="redfish.html" class="sheet-link dropdown-toggle" aria-haspopup="true">
                  <svg class="nav-logo" viewBox="0 0 30 20" width="17" height="13" fill="none" aria-hidden="true"><path d="M.2 9.5C.3 8.8 1.8 7.8 5.5 4.7L11.6.5l3.6 2.6L17.9 1l3 2.3-2.4 1.9 2.2 1.7 5.4-4 3.3 2.6-5.3 4.3 5.3 4.3-3.3 2.6-5.4-4-2.2 1.7 2.4 1.9-3 2.3-2.7-2.1-3.6 2.6L.4 10.3l3.1.4L.2 9.5z" fill="#e11d48"/><circle cx="5.6" cy="6.6" r="1.95" fill="#fff"/><circle cx="5.6" cy="6.6" r="1" fill="#e11d48"/></svg>
                  <span>Redfish</span> <span class="dropdown-caret">▾</span>
                </a>
                <div class="nav-dropdown-menu rf-dropdown-menu" role="menu">
                  <a href="redfish.html" class="dropdown-item dropdown-hub-link" role="menuitem">📑 Redfish Hub &amp; Request Builder</a>
                  <div class="dropdown-divider"></div>
                  <div class="rf-dropdown-grid">
                    <div class="rf-dropdown-col">
                      <div class="rf-dropdown-heading">Discovery, Power &amp; Platform</div>
                      <a href="rf-discovery.html" class="dropdown-item" role="menuitem"><code>auth</code> <span class="cmd-desc">ServiceRoot, Tokens &amp; ETag</span></a>
                      <a href="rf-power-boot.html" class="dropdown-item" role="menuitem"><code>pwr</code> <span class="cmd-desc">Power Actions &amp; Boot Override</span></a>
                      <a href="rf-inventory.html" class="dropdown-item" role="menuitem"><code>inv</code> <span class="cmd-desc">Hardware: CPU, RAM &amp; PCIe</span></a>
                      <a href="rf-thermals-power.html" class="dropdown-item" role="menuitem"><code>sns</code> <span class="cmd-desc">Thermals, PSUs &amp; UID LED</span></a>
                    </div>
                    <div class="rf-dropdown-col">
                      <div class="rf-dropdown-heading">Operations, Firmware &amp; GPU</div>
                      <a href="rf-logs-sel.html" class="dropdown-item" role="menuitem"><code>log</code> <span class="cmd-desc">SEL Logs &amp; Fault Triage</span></a>
                      <a href="rf-bios-bmc.html" class="dropdown-item" role="menuitem"><code>bmc</code> <span class="cmd-desc">BIOS Settings &amp; Virtual Media</span></a>
                      <a href="rf-firmware.html" class="dropdown-item" role="menuitem"><code>fw</code> <span class="cmd-desc">Firmware &amp; Task Service</span></a>
                      <a href="rf-hgx-dlc.html" class="dropdown-item" role="menuitem"><code>hgx</code> <span class="cmd-desc">HGX Baseboard &amp; DLC Leaks</span></a>
                    </div>
                  </div>
                </div>
              </div>`;

// 3. Update navbar across all existing HTML files
const htmlFiles = require('./nav/targets').navFiles();   // the one nav copy, not every page
const rfLinkPattern = /<a href="redfish\.html" class="sheet-link(?: active)?">[\s\S]*?<\/svg>\s*Redfish<\/a>/;

let updatedNavCount = 0;
for (const file of htmlFiles) {
  let content = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (rfLinkPattern.test(content)) {
    content = content.replace(rfLinkPattern, RF_NAVBAR_SNIPPET);
    fs.writeFileSync(path.join(__dirname, file), content, 'utf8');
    updatedNavCount++;
  }
}
console.log(`Updated navbar with Redfish dropdown in ${updatedNavCount} existing HTML files`);

// Read pristine updated navbar from index.html
const indexHtmlForNav = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const EXACT_NAVBAR = indexHtmlForNav.match(/<nav class="sheet-switcher" aria-label="Switch cheat sheet">[\s\S]*?<\/nav>/)[0];

// 4. Section mapping & file keys
const SECTION_MAP = {
  'discovery-auth': {
    file: 'rf-discovery',
    badge: 'auth',
    name: 'Discovery & Auth',
    heading: 'ServiceRoot Query, Dynamic Member URIs, X-Auth-Token & $expand',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "DMTF DSP0266 Redfish Specification 1.25.0"}, {"url": "https://curl.se/docs/manpage.html", "title": "curl man page"}]},
      desc: 'Production Redfish API Discovery & Authentication Best Practices',
      cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1" | jq .',
      details: 'Start at the service root (/redfish/v1) and follow the @odata.id links instead of hard-coding vendor paths. For scripts, log in once with a POST to /redfish/v1/SessionService/Sessions and send the returned X-Auth-Token header on later requests instead of Basic auth on every call.',
      tip: 'When the script finishes, DELETE the session URI from the Location header; otherwise the session stays open until it times out.',
      flags: [
        ['-g', 'Turn off curl URL globbing so [IPv6] brackets in the URL work'],
        ['-k', 'Skip TLS certificate checks (BMCs often use self-signed certificates)'],
        ['-H "X-Auth-Token: <token>"', 'Send the session token instead of Basic auth']
      ]
    }
  },
  'power-boot': {
    file: 'rf-power-boot',
    badge: 'pwr',
    name: 'Power & Boot',
    heading: 'Chassis Power Control, ResetType Actions & UEFI Boot Overrides',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Resource.json", "title": "DMTF Resource schema (ResetType, Status)"}, {"url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.v1_29_0.json", "title": "DMTF ComputerSystem v1.29.0"}, {"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "DMTF DSP0266 Redfish Specification 1.25.0"}], "note": "Corrected 2026-11-10: ForceRestart was described as a 4-second power-button hold, and Nmi as a sysrq trigger. Systems/1 is a common ID; read /redfish/v1/Systems for yours."},
      desc: 'Chassis Power State Triage & Boot Target Verification',
      cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/Systems/1/Actions/ComputerSystem.Reset" -H "Content-Type: application/json" -d \'{"ResetType":"GracefulRestart"}\'',
      details: 'GracefulShutdown and GracefulRestart ask the OS to shut down cleanly. If the kernel is hung, ForceRestart restarts without the OS, or Nmi sends a diagnostic interrupt so a kdump-configured kernel can write a crash dump. Read ResetType@Redfish.AllowableValues on the action first: each BMC supports a different subset.',
      tip: 'BootSourceOverrideEnabled "Once" goes back to Disabled after one boot; "Continuous" keeps the override until you cancel it.',
      flags: [
        ['GracefulRestart', 'Clean OS shutdown, then restart'],
        ['ForceRestart', 'Immediate non-graceful restart (no OS shutdown)'],
        ['Nmi', 'Diagnostic interrupt (usually an NMI on x86); typically halts the system']
      ]
    }
  },
  'inventory-hw': {
    file: 'rf-inventory',
    badge: 'inv',
    name: 'Hardware Inventory',
    heading: 'CPUs, Accelerators, DIMM Memory, NVMe Drives & PCIe Topology',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Memory.v1_24_0.json", "title": "DMTF Memory v1.24.0"}, {"url": "https://redfish.dmtf.org/schemas/v1/Processor.v1_24_0.json", "title": "DMTF Processor v1.24.0"}, {"url": "https://redfish.dmtf.org/schemas/v1/Resource.json", "title": "DMTF Resource schema (ResetType, Status)"}, {"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "DMTF DSP0266 Redfish Specification 1.25.0"}], "note": "Corrected 2026-11-10: the command now escapes $expand and $levels so the shell leaves them alone."},
      desc: 'Automated Node Audit & Hardware Baseline Verification',
      cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Systems/1/Memory?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Slot: .Id, Cap: .CapacityMiB, Health: .Status.Health}\'',
      details: 'At provisioning, read Systems/1/Memory and Processors and compare DIMM count, capacity and core counts with the build sheet before the node joins Slurm or Kubernetes. Keep the backslash in \\$expand: inside double quotes the shell would otherwise replace $expand with nothing. Not every BMC supports $expand (see ProtocolFeaturesSupported in the service root).',
      tip: 'Status.HealthRollup on a parent resource covers it and everything under it, so one read flags a failing child.',
      flags: [
        ['Memory', 'CapacityMiB, OperatingSpeedMhz, Manufacturer, PartNumber, SerialNumber, Status'],
        ['Processors', 'ProcessorType (CPU, GPU, ...), Model, TotalCores, TotalThreads'],
        ['Storage', 'Controllers and Drives; drives report PredictedMediaLifeLeftPercent where supported']
      ]
    }
  },
  'thermals-power-sensors': {
    file: 'rf-thermals-power',
    badge: 'sns',
    name: 'Thermals & Sensors',
    heading: 'Thermal Sensors (°C), Fan Speeds (RPM), PSU Power Wattage & UID LED',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/Thermal.json", "title": "DMTF Thermal schema (deprecated)"}, {"url": "https://redfish.dmtf.org/schemas/v1/Power.json", "title": "DMTF Power schema (deprecated)"}, {"url": "https://redfish.dmtf.org/schemas/v1/Chassis.v1_29_0.json", "title": "DMTF Chassis v1.29.0"}], "note": "Corrected 2026-11-10: IndicatorLED is deprecated in favour of LocationIndicatorActive."},
      desc: 'Thermal Triage & Power Supply Redundancy Telemetry',
      cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Chassis/1/Thermal" | jq \'.Temperatures[] | {Sensor: .Name, Reading: .ReadingCelsius, UpperThresh: .UpperThresholdCritical}\'',
      details: 'Chassis Thermal lists temperature sensors (CPU, inlet, DIMM zones, ...) and fans; Chassis Power lists power use and each PSU. Before trusting A/B feed redundancy, check that every PSU is healthy and shows input voltage. Both resources are deprecated in favour of ThermalSubsystem and PowerSubsystem but many BMCs still serve them.',
      tip: 'To find the server in the rack, PATCH {"LocationIndicatorActive": true} on the Chassis (older BMCs: IndicatorLED "Blinking").',
      flags: [
        ['Thermal', 'Temperatures[] with thresholds; Fans[] with Reading and ReadingUnits (RPM or Percent)'],
        ['Power', 'PowerControl (watts used), PowerSupplies[] (input voltage, health), Redundancy'],
        ['LocationIndicatorActive', 'true/false identify LED; replaces the deprecated IndicatorLED (Lit, Blinking, Off)']
      ]
    }
  },
  'logs-sel': {
    file: 'rf-logs-sel',
    badge: 'log',
    name: 'Logs & SEL Triage',
    heading: 'BMC System Event Log (SEL), Hardware Faults & Event Clearing',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/LogService.v1_9_0.json", "title": "DMTF LogService v1.9.0"}, {"url": "https://redfish.dmtf.org/schemas/v1/LogEntry.v1_22_0.json", "title": "DMTF LogEntry v1.22.0"}, {"url": "https://redfish.dmtf.org/schemas/v1/Resource.json", "title": "DMTF Resource schema (ResetType, Status)"}, {"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "DMTF DSP0266 Redfish Specification 1.25.0"}, {"url": "https://curl.se/docs/manpage.html", "title": "curl man page"}], "note": "Corrected 2026-11-10: EventLog is not a standard path, and the old command lost $filter to the shell and sent spaces unencoded."},
      desc: 'Hardware Event Log Analysis & Pre-Failure Detection',
      cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc --get --data-urlencode "\\$filter=Severity eq \'Critical\'" "https://[$BMC]/redfish/v1/Managers/1/LogServices/Sel/Entries" | jq .',
      details: 'BMC event logs record hardware events the BMC sees even when the OS is down (memory ECC, PSU loss, thermal trips, PCIe errors). Log service names and places vary by vendor (Sel, SEL, EventLog; under Managers or Systems), so list .../LogServices first. $filter is optional in Redfish and a BMC that lacks it ignores it: if every entry comes back, filter with jq select(.Severity == "Critical") instead.',
      tip: 'Export and archive the entries before LogService.ClearLog during an RMA or re-provisioning.',
      flags: [
        ['LogServices', 'List the log services this BMC has, then read each one\'s Entries'],
        ['--data-urlencode "\\$filter=Severity eq \'Critical\'"', 'Server-side filter, URL-encoded by curl (Severity is OK, Warning or Critical)'],
        ['LogService.ClearLog', 'Action that clears the log (changes state)']
      ]
    }
  },
  'bios-vmedia-bmc': {
    file: 'rf-bios-bmc',
    badge: 'bmc',
    name: 'BIOS & BMC Control',
    heading: 'BIOS Attribute Inspection, Virtual Media ISO Mounting & BMC Reset',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/VirtualMedia.v1_7_0.json", "title": "DMTF VirtualMedia v1.7.0"}, {"url": "https://redfish.dmtf.org/schemas/v1/Manager.v1_25_0.json", "title": "DMTF Manager v1.25.0"}, {"url": "https://redfish.dmtf.org/schemas/v1/ComputerSystem.v1_29_0.json", "title": "DMTF ComputerSystem v1.29.0"}, {"url": "https://redfish.dmtf.org/schemas/v1/Bios.v1_3_0.json", "title": "DMTF Bios v1.3.0"}, {"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "DMTF DSP0266 Redfish Specification 1.25.0"}], "note": "Corrected 2026-11-10: Managers/{id}/VirtualMedia is deprecated in favour of Systems/{id}/VirtualMedia, and the BIOS settings URI comes from @Redfish.Settings (Bios/Settings is only a common name)."},
      desc: 'Out-of-Band OS Deployment via Virtual Media & BIOS Tuning',
      cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc -X POST "https://[$BMC]/redfish/v1/Managers/1/VirtualMedia/CD/Actions/VirtualMedia.InsertMedia" -H "Content-Type: application/json" -d \'{"Image":"https://example.com/ubuntu-24.04.iso"}\'',
      details: 'Virtual Media attaches a remote ISO (HTTP, HTTPS, NFS, CIFS and others, per TransferProtocolType) to the host as a virtual CD or USB drive, for OS installs or recovery without a USB stick. Newer services put VirtualMedia under Systems/{id}; the Managers/{id}/VirtualMedia link is deprecated. Media IDs (CD, Cd, 1, ...) vary, so list the collection first. BIOS changes are PATCHed to the settings object named in @Redfish.Settings on the Bios resource.',
      tip: 'Staged BIOS settings take effect at the next host reset; @Redfish.SettingsApplyTime, where supported, says when.',
      flags: [
        ['InsertMedia', 'Attach a remote image (Image URI, optional TransferProtocolType)'],
        ['EjectMedia', 'Detach the image after the install'],
        ['Manager.Reset', 'Restart the BMC; the host normally keeps running']
      ]
    }
  },
  'firmware-tasks': {
    file: 'rf-firmware',
    badge: 'fw',
    name: 'Firmware & Tasks',
    heading: 'Firmware Inventory, UpdateService Multipart Push & Async Task Polling',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://redfish.dmtf.org/schemas/v1/UpdateService.v1_17_1.json", "title": "DMTF UpdateService v1.17.1"}, {"url": "https://redfish.dmtf.org/schemas/v1/Task.v1_7_4.json", "title": "DMTF Task v1.7.4"}, {"url": "https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.25.0.pdf", "title": "DMTF DSP0266 Redfish Specification 1.25.0"}], "note": "Corrected 2026-11-10: the inventory command now expands members (the collection alone has only links), and the 202 goes to a task monitor rather than a POST to UpdateService itself."},
      desc: 'Asynchronous Firmware Flashing & Task Service Monitoring',
      cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/UpdateService/FirmwareInventory?\\$expand=.(\\$levels=1)" | jq \'.Members[] | {Name: .Name, Version: .Version, Updateable: .Updateable}\'',
      details: 'Firmware updates run asynchronously: a SimpleUpdate POST, or a multipart push to MultipartHttpPushUri, returns 202 Accepted with a Location header pointing to a task monitor. Poll it, or the Task under TaskService/Tasks, until TaskState is Completed (or Exception, Killed or Cancelled).',
      tip: 'Watch PercentComplete on the Task and read its Messages for errors.',
      flags: [
        ['FirmwareInventory', 'Installed firmware with Version and Updateable (BMC, BIOS, CPLD, NICs, ...)'],
        ['UpdateService.SimpleUpdate', 'BMC pulls the image from ImageURI (TransferProtocol HTTP, HTTPS, TFTP, ... as supported)'],
        ['TaskService/Tasks/<id>', 'TaskState (New, Running, Completed, Exception, ...) and PercentComplete']
      ]
    }
  },
  'hgx-dlc-redfish': {
    file: 'rf-hgx-dlc',
    badge: 'hgx',
    name: 'HGX Baseboard & DLC',
    heading: 'NVIDIA HGX SXM GPU Health, NVSwitch Thermals & DLC Leak Sensors',
    proTip: {
      src: {"verified": "2026-11-10", "refs": [{"url": "https://docs.nvidia.com/dgx/dgxh100-user-guide/redfish-api-supp.html", "title": "NVIDIA DGX H100/H200 Redfish APIs"}, {"url": "https://redfish.dmtf.org/schemas/v1/LeakDetector.json", "title": "DMTF LeakDetector schema"}, {"url": "https://redfish.dmtf.org/schemas/v1/Chassis.v1_29_0.json", "title": "DMTF Chassis v1.29.0"}], "note": "Corrected 2026-11-10: GPUs are GPU_SXM_<n> under Systems/HGX_Baseboard_0 on DGX (not Processors/GPU_0..7), and the leak property is LeakDetection, not LeakDetectionSensors. Leak detection on non-NVIDIA HGX boards varies by vendor."},
      desc: 'AI Server HGX Baseboard & Liquid Cooling Telemetry',
      cmd: 'curl -g -6 -sk -K ~/.bmc-curlrc "https://[$BMC]/redfish/v1/Chassis/HGX_Baseboard_0" | jq .',
      details: 'HGX GPU baseboards have their own Redfish chassis (Chassis/HGX_Baseboard_0 on NVIDIA DGX) and expose GPUs as Systems/HGX_Baseboard_0/Processors/GPU_SXM_<n>; other server vendors may name them differently. On liquid-cooled racks, check the leak detectors (ThermalSubsystem/LeakDetection/LeakDetectors, DetectorState) and coolant sensors before powering up GPUs.',
      tip: 'A leak detector reporting anything but OK means stop: follow the site leak procedure before powering the GPUs on.',
      flags: [
        ['Chassis/HGX_Baseboard_0', 'GPU baseboard chassis on DGX: serial, status, sensors'],
        ['ThermalSubsystem/LeakDetection/LeakDetectors', 'One entry per leak detector with DetectorState'],
        ['Systems/HGX_Baseboard_0/Processors/GPU_SXM_<n>', 'Per-GPU model, serial and health (DGX naming)']
      ]
    }
  }
};

// 5. Function to build cards for each Redfish sub-sheet
function buildRfSectionCards(sec) {
  const cfg = SECTION_MAP[sec.id] || { file: `rf-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
  const cards = [];

  sec.commands.forEach((cmd, cIdx) => {
    // Card: Primary Command & Status Triage
    cards.push({
      id: `${sec.id}-cmd-${cIdx + 1}`,
      badge: cfg.badge,
      title: `${cfg.name}: ${cmd.desc.split('.')[0].split('(')[0].trim()}`,
      subtitle: cmd.desc,
      commands: [
        {
          id: cmd.id,
          desc: cmd.desc,
          cmd: cmd.cmd,
          details: cmd.details || '',
          flags: cmd.flags ? cmd.flags.slice(0, 3) : [],
          tip: cmd.tip || '',
          tags: [cfg.name, 'redfish', 'rest', 'api', 'bmc', ...(cmd.tags || [])],
          // Where the command was checked (drawn under the card by common.js initSources).
          ...(cmd.src ? { src: cmd.src } : {})
        }
      ]
    });

    // Card: Flags & Parameter Breakdown (if more flags exist)
    if (cmd.flags && cmd.flags.length > 3) {
      cards.push({
        id: `${sec.id}-flags-${cIdx + 1}`,
        badge: cfg.badge,
        title: `${cfg.name}: Parameters & Query Options`,
        subtitle: `Key arguments, parameters, and filtering options for ${cmd.desc.split('.')[0].trim()}`,
        commands: [
          {
            id: `${cmd.id}-flags-card`,
            desc: `Options breakdown and parameter syntax for ${cmd.desc.split('.')[0].trim()}`,
            cmd: cmd.cmd,
            flags: cmd.flags.slice(3),
            details: `Common operational, diagnostic, and filtering parameters for Redfish REST requests.`,
            tags: [cfg.name, 'flags', 'options', 'syntax']
          }
        ]
      });
    }

    // Card: Common Recipes & Subcommands (if subcommands exist)
    if (cmd.subcommands && cmd.subcommands.length > 0) {
      cards.push({
        id: `${sec.id}-recipes-${cIdx + 1}`,
        badge: cfg.badge,
        title: `${cfg.name}: Common Recipes & Verification`,
        subtitle: `Production Redfish curl & jq pipelines for ${cfg.name}`,
        commands: cmd.subcommands.map((sub, idx) => ({
          id: `${cmd.id}-sub-${idx + 1}`,
          desc: sub[1],
          cmd: sub[0],
          tags: [cfg.name, 'recipe', 'automation', 'curl'],
          // A recipe's own source (third element) wins; otherwise it shares the command's.
          ...((sub[2] || cmd.src) ? { src: sub[2] || cmd.src } : {})
        }))
      });
    }
  });

  // Pro Tips & Production Best Practices Card
  if (cfg.proTip) {
    cards.push({
      id: `${sec.id}-pro-tips`,
      badge: 'tip',
      title: `${cfg.name}: Pro Tips & Best Practices`,
      subtitle: cfg.proTip.desc,
      commands: [
        {
          id: `${sec.id}-tips-card`,
          desc: cfg.proTip.desc,
          cmd: cfg.proTip.cmd,
          details: cfg.proTip.details,
          flags: cfg.proTip.flags,
          tip: cfg.proTip.tip,
          tags: [sec.id, 'tips', 'pro', 'redfish', 'rest', 'best-practice'],
          ...(cfg.proTip.src ? { src: cfg.proTip.src } : {})
        }
      ]
    });
  }

  return mergeCommandCards(cards);
}

// 6. Generate JS file for each Redfish sub-sheet
function generateRfJs(sec, cards, fileKey) {
  const varName = `RF_${fileKey.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_DATA`;
  const jsonCards = JSON.stringify(cards, null, 2);

  return `// ${fileKey}.js
// Standalone interactive cheat sheet for Redfish: ${sec.title}
const ${varName} = ${jsonCards};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("${fileKey}_bookmarks") || "[]"); } catch (e) { return []; } })())
};

// DOM Elements
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

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function showToast(msg) {
  if (!toastEl) return;
  toastTextEl.textContent = msg;
  toastEl.classList.add("visible");
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("visible");
    toastEl.classList.remove("show");
  }, 2200);
}

function copyToClipboard(text) {
  if (window.AntigravityCommon && typeof window.AntigravityCommon.substituteVariables === "function") {
    const subResult = window.AntigravityCommon.substituteVariables(text);
    text = subResult.text;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  showToast("Copied: " + (text.length > 40 ? text.slice(0, 38) + "..." : text));
}

// Redfish REST & curl Syntax Highlighting
function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /(^|\\s|;|&&|\\|\\||\\|)(sudo\\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\\|\\||&&|\\|)/g,
    (match, lead, sudoPart, cmdName, strLiteral, flagPart, operatorPart) => {
      if (strLiteral) return '<span class="tok-str">' + strLiteral + '</span>';
      if (flagPart) return '<span class="tok-flag">' + flagPart + '</span>';
      if (operatorPart) return '<span class="tok-pipe">' + operatorPart + '</span>';
      if (cmdName) {
        const prefix = lead || "";
        const sudoHtml = sudoPart ? '<span class="tok-pipe">' + sudoPart + '</span>' : "";
        return prefix + sudoHtml + '<span class="tok-cmd">' + cmdName + '</span>';
      }
      return match;
    }
  );
}

function renderCategoryTabs() {
  const allCards = ${varName};
  const totalCmds = allCards.reduce((acc, c) => acc + c.commands.length, 0);

  const optionsHtml = [
    '<option value="all"' + (state.activeCategory === "all" ? " selected" : "") + '>All Topics (' + totalCmds + ' items)</option>'
  ];

  for (const card of allCards) {
    const isSelected = state.activeCategory === card.id ? " selected" : "";
    optionsHtml.push(
      '<option value="' + escapeHtml(card.id) + '"' + isSelected + '>' +
      escapeHtml(card.title) + ' (' + card.commands.length + ')' +
      '</option>'
    );
  }

  const resetBtnHtml = state.activeCategory !== "all"
    ? '<button type="button" class="cat-reset-btn" id="cat-reset-btn" title="Show all topics">✕ Show All</button>'
    : "";

  categoryTabsEl.innerHTML =
    '<div class="cat-dropdown-wrap">' +
      '<label class="cat-dropdown-label" for="category-select">Topic:</label>' +
      '<select id="category-select" class="cat-select" aria-label="Filter by topic">' +
        optionsHtml.join("") +
      '</select>' +
      resetBtnHtml +
    '</div>';

  const catSelect = document.getElementById("category-select");
  if (catSelect) {
    catSelect.addEventListener("change", (e) => {
      state.activeCategory = e.target.value;
      renderCategoryTabs();
      renderSections();
    });
  }

  const catReset = document.getElementById("cat-reset-btn");
  if (catReset) {
    catReset.addEventListener("click", () => {
      state.activeCategory = "all";
      renderCategoryTabs();
      renderSections();
    });
  }
}

function matchesSearch(cmd, searchTerms) {
  if (!searchTerms.length) return true;
  const target = [
    cmd.cmd || "",
    cmd.desc || "",
    cmd.details || "",
    cmd.tip || "",
    (cmd.tags || []).join(" "),
    (cmd.flags || []).map(([f, d]) => f + " " + d).join(" ")
  ].join(" ").toLowerCase();

  return searchTerms.every(term => target.includes(term));
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

let masonryResizeTimer = null;
window.addEventListener("resize", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("fullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
document.addEventListener("webkitfullscreenchange", () => {
  clearTimeout(masonryResizeTimer);
  masonryResizeTimer = setTimeout(packMasonry, 40);
});
window.packMasonry = packMasonry;

function renderSections() {
  let visibleCommandsCount = 0;
  const cardsHtml = [];

  for (const card of ${varName}) {
    if (state.activeCategory !== "all" && state.activeCategory !== card.id) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\\s+/)
      .filter(Boolean);

    const filteredCommands = card.commands.filter((cmd) => {
      if (state.savedOnly && !state.bookmarks.has(cmd.id)) return false;
      return matchesSearch(cmd, searchTerms);
    });

    if (filteredCommands.length === 0) continue;
    visibleCommandsCount += filteredCommands.length;

    const commandsHtml = filteredCommands.map((cmd) => {
      const isBookmarked = state.bookmarks.has(cmd.id);

      const flagsHtml = (cmd.flags && cmd.flags.length > 0)
        ? '<div class="flag-pills">' + cmd.flags.map(([f, d]) =>
            '<span class="flag-pill"><strong class="flag-token">' + escapeHtml(f) + '</strong> <span class="flag-desc">' + escapeHtml(d) + '</span></span>'
          ).join("") + '</div>'
        : "";

      const detailsHtml = cmd.details
        ? '<p class="cmd-details">' + escapeHtml(cmd.details) + '</p>'
        : "";

      const tipHtml = cmd.tip
        ? '<div class="cmd-tip"><span class="tip-badge">TIP</span>' + escapeHtml(cmd.tip) + '</div>'
        : "";

      const copyTarget = cmd.cmd.includes("   |   ")
        ? cmd.cmd.split("   |   ")[0].trim()
        : cmd.cmd.trim();

      return [
        '<div class="cmd-item" id="cmd-' + escapeHtml(cmd.id) + '" data-cmd-id="' + escapeHtml(cmd.id) + '">',
        '  <div class="cmd-header-row">',
        '    <div class="cmd-desc">',
        '      <span>' + escapeHtml(cmd.desc) + '</span>',
        '    </div>',
        '    <button',
        '      type="button"',
        '      class="bookmark-btn ' + (isBookmarked ? "bookmarked" : "") + '"',
        '      data-cmd-id="' + escapeHtml(cmd.id) + '"',
        '      title="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '      aria-label="' + (isBookmarked ? "Remove bookmark" : "Bookmark this command") + '"',
        '    >',
        '      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">',
        '        <path fill="' + (isBookmarked ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
        '      </svg>',
        '    </button>',
        '  </div>',
        '',
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <span class="copy-hint">Copy</span>',
        '  </div>',
        '  ' + detailsHtml,
        '  ' + flagsHtml,
        '  ' + tipHtml,
        '</div>'
      ].join("\\n");
    }).join("\\n");

    cardsHtml.push([
      '<article class="section-card" id="sec-' + escapeHtml(card.id) + '">',
      '  <header class="section-header">',
      '    <div class="section-title-wrap">',
      '      <span class="section-badge">' + escapeHtml(card.badge) + '</span>',
      '      <div>',
      '        <h2 class="section-title">' + escapeHtml(card.title) + '</h2>',
      '        <p class="section-subtitle">' + escapeHtml(card.subtitle) + '</p>',
      '      </div>',
      '    </div>',
      '    <span class="count-badge">' + filteredCommands.length + '</span>',
      '  </header>',
      '  <div class="command-list">',
      commandsHtml,
      '  </div>',
      '</article>'
    ].join("\\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\\n");
  visibleCountEl.textContent = visibleCommandsCount;

  if (visibleCommandsCount === 0) {
    emptyStateEl.classList.remove("hidden");
  } else {
    emptyStateEl.classList.add("hidden");
  }

  packMasonry();
}

function updateSavedCount() {
  savedCountEl.textContent = state.bookmarks.size;
  if (state.bookmarks.size > 0) {
    savedFilterBtn.classList.add("has-saved");
  } else {
    savedFilterBtn.classList.remove("has-saved");
  }
}

function initEventListeners() {
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    renderSections();
  });

  resetSearchBtn.addEventListener("click", () => {
    state.searchQuery = "";
    state.savedOnly = false;
    state.activeCategory = "all";
    searchInput.value = "";
    savedFilterBtn.classList.remove("active");
    renderCategoryTabs();
    renderSections();
    searchInput.focus();
  });

  savedFilterBtn.addEventListener("click", () => {
    state.savedOnly = !state.savedOnly;
    savedFilterBtn.classList.toggle("active", state.savedOnly);
    renderSections();
  });

  if (printBtn) printBtn.addEventListener("click", () => {
    window.print();
  });

  themeToggleBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    applyTheme(state.theme);
    localStorage.setItem("linux_cs_theme", state.theme);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    } else if (e.key === "Escape" && document.activeElement === searchInput) {
      searchInput.value = "";
      state.searchQuery = "";
      renderSections();
      searchInput.blur();
    }
  });

  sectionsContainer.addEventListener("click", (e) => {
    const codeBox = e.target.closest(".cmd-code-box");
    if (codeBox) {
      const cmdText = codeBox.getAttribute("data-cmd");
      if (cmdText) copyToClipboard(cmdText);
      return;
    }

    const bookmarkBtn = e.target.closest(".bookmark-btn");
    if (bookmarkBtn) {
      const cmdId = bookmarkBtn.getAttribute("data-cmd-id");
      if (cmdId) {
        if (state.bookmarks.has(cmdId)) {
          state.bookmarks.delete(cmdId);
          bookmarkBtn.classList.remove("bookmarked");
        } else {
          state.bookmarks.add(cmdId);
          bookmarkBtn.classList.add("bookmarked");
        }
        localStorage.setItem("${fileKey}_bookmarks", JSON.stringify([...state.bookmarks]));
        updateSavedCount();
        if (state.savedOnly) renderSections();
      }
      return;
    }
  });
}

function applyTheme(theme) {
  const sunIcon = document.getElementById("theme-icon-sun");
  const moonIcon = document.getElementById("theme-icon-moon");
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    sunIcon?.classList.add("hidden");
    moonIcon?.classList.remove("hidden");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
    sunIcon?.classList.remove("hidden");
    moonIcon?.classList.add("hidden");
  }
}

function init() {
  applyTheme(state.theme);
  updateSavedCount();
  renderCategoryTabs();
  renderSections();
  initEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
`;
}

// 7. Generate HTML file for each Redfish sub-sheet
function generateRfHtml(sec, fileKey) {
  const cfg = SECTION_MAP[sec.id] || { file: `rf-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redfish: ${escapeHtml(cfg.name)} — ${escapeHtml(cfg.heading)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="top-bar">
    <div class="container top-bar-inner">
      <div class="brand">
        <div class="terminal-badge" aria-hidden="true">
          <span class="prompt-symbol">RF</span><span class="cursor-block">&gt;</span>
        </div>
        <div>
          <div class="brand-title-row">
            <h1>${escapeHtml(cfg.name)}</h1>
            <span class="version-pill">${escapeHtml(cfg.badge.toUpperCase())} / DMTF Redfish REST API</span>
            ${EXACT_NAVBAR}
          </div>
          <p class="brand-subtitle">${escapeHtml(sec.subtitle)}</p>
        </div>
      </div>

      <div class="header-actions">

        <button
          type="button"
          id="density-toggle"
          class="action-btn"
          title="Toggle compact view (compact spacing)"
          aria-label="Toggle compact view"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
          <span id="density-label">Compact</span>
        </button>

        <button
          type="button"
          id="print-btn"
          class="print-btn"
          title="Print cheat sheet (Ctrl+P)"
          aria-label="Print cheat sheet"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8" rx="1" fill="none" stroke="currentColor" stroke-width="2"/>
          </svg>
        </button>

        <button
          type="button"
          id="theme-toggle"
          class="theme-toggle-btn"
          title="Toggle light/dark theme"
          aria-label="Toggle light/dark theme"
        >
          <svg id="theme-icon-sun" class="hidden" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/>
            <path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
          </svg>
          <svg id="theme-icon-moon" viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
            <path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <main class="container main-layout">

    <!-- Commands Container (Masonry Cards) -->
    <section id="sections-container" class="sections-container" aria-label="Command cards"></section>

    <!-- Empty State -->
    <div id="empty-state" class="empty-state hidden" role="status">
      <svg viewBox="0 0 24 24" width="40" height="40" aria-hidden="true">
        <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" stroke-width="1.5"/>
        <path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M17 17l4 4M9 11h4"/>
      </svg>
      <h3>No matching ${escapeHtml(cfg.name)} endpoints</h3>
      <p>Try searching with different keywords or clear active filters.</p>
    </div>
  </main>

  <!-- Toast Notification -->
  <div id="toast" class="toast" role="status" aria-live="polite">
    <span id="toast-text"></span>
  </div>

  <footer class="page-footer">
    <div class="container footer-inner">
      <span>${escapeHtml(cfg.name)} Reference Cheat Sheet</span>
      <span>Press <kbd>/</kbd> to search &bull; Click any command to copy</span>
    </div>
  </footer>

  <script src="global-search-index.js"></script>
  <script src="common.js"></script>
  <script src="${fileKey}.js"></script>
</body>
</html>
`;
}

// 8. Generate each Redfish sub-sheet
let createdSheets = 0;
for (const sec of REDFISH_CHEAT_SHEET_DATA) {
  const cfg = SECTION_MAP[sec.id] || { file: `rf-${sec.id}`, badge: sec.badge, name: sec.id, heading: sec.title };
  const fileKey = cfg.file;
  const cards = buildRfSectionCards(sec);

  const jsContent = generateRfJs(sec, cards, fileKey);
  fs.writeFileSync(path.join(__dirname, `${fileKey}.js`), jsContent, 'utf8');

  const htmlContent = generateRfHtml(sec, fileKey);
  // Existing pages are authoritative for header/nav chrome; only create missing ones.
  if (!fs.existsSync(path.join(__dirname, `${fileKey}.html`))) fs.writeFileSync(path.join(__dirname, `${fileKey}.html`), htmlContent, 'utf8');

  createdSheets++;
  console.log(`Created ${fileKey}.html and ${fileKey}.js (${cards.length} cards)`);
}

console.log(`\nSuccessfully created ${createdSheets} standalone Redfish cheat sheets.`);
