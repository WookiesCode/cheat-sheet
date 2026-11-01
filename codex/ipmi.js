const IPMI_CHEAT_SHEET_DATA = [
  {
    id: "chassis-power",
    badge: "pwr",
    title: "Chassis Power, Status & UID Identify",
    subtitle: "Power status/on/off/cycle/reset/soft/diag, last power fault reason & UID LED",
    commands: [
      {
        id: "ipmi-power-actions",
        mode: "POWER",
        modeClass: "mode-t",
        desc: "Check chassis power state or execute hard power off, cold power cycle, warm reset, or ACPI shutdown",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" chassis power status   |   ... chassis power cycle   |   ... chassis power reset   |   ... chassis power soft',
        flags: [
          ["power cycle", "Cold DC power off, wait ~1–3s, then power on (must power already be ON)"],
          ["power reset", "Warm hard reset (pulses motherboard reset line without dropping DC power rails)"],
          ["power soft", "Send ACPI power button signal for graceful OS shutdown"],
          ["power off / on", "Immediate hard DC power off / power on"]
        ],
        tip: "Prefer cycle over reset after BIOS/PCIe hangs",
        tags: ["power", "cycle", "reset", "soft", "on", "off", "status"]
      },
      {
        id: "ipmi-chassis-status",
        mode: "CHASSIS",
        modeClass: "mode-n",
        desc: "Inspect detailed chassis state: Last Power Event (AC failed, overload, thermal trip), power restore policy & intrusion",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" chassis status   |   ... chassis policy always-on',
        flags: [
          ["Last Power Event", "Shows why server turned off: 'ac-failed', 'power-overload', 'power-interlock', 'power-fault'"],
          ["chassis policy", "Set AC power recovery mode: 'always-on', 'previous', or 'always-off'"]
        ],
        tip: "Check 'Last Power Event' after unexpected reboot",
        tags: ["chassis", "status", "policy", "ac-failed", "overload", "fault"]
      },
      {
        id: "ipmi-chassis-identify-nmi",
        mode: "CHASSIS",
        modeClass: "mode-c",
        desc: "Blink the physical blue Chassis UID Locator LED or pulse diagnostic NMI for kernel kdump",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" chassis identify force   |   ... chassis identify 0   |   ... chassis power diag',
        flags: [
          ["identify force / 60", "Turn UID LED on indefinitely ('force') or blink for 60 seconds ('0' turns it off)"],
          ["chassis power diag", "Assert hardware Non-Maskable Interrupt (NMI) to trigger Linux kdump on hung node"]
        ],
        tags: ["identify", "uid", "led", "blink", "diag", "nmi", "kdump"]
      }
    ]
  },
  {
    id: "boot-override",
    badge: "boot",
    title: "Boot Device Override (bootdev & bootparam)",
    subtitle: "One-time UEFI PXE network boot, BIOS Setup entry, Virtual CD ISO & clearing 60s timeout",
    commands: [
      {
        id: "ipmi-bootdev-uefi-pxe",
        mode: "BOOT",
        modeClass: "mode-c",
        desc: "Force one-time UEFI PXE network boot on the next reboot and immediately power-cycle",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" chassis bootdev pxe options=efiboot && ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" chassis power cycle',
        flags: [
          ["options=efiboot", "Critical on modern servers: without efiboot, some BMCs attempt Legacy CSM PXE and fail!"],
          ["options=persistent", "Add comma-separated 'options=efiboot,persistent' to make PXE first permanently"]
        ],
        tip: "Always include options=efiboot",
        tags: ["pxe", "bootdev", "efiboot", "uefi", "network", "reinstall"]
      },
      {
        id: "ipmi-bootdev-bios-cdrom",
        mode: "BOOT",
        modeClass: "mode-c",
        desc: "Boot directly into BIOS/UEFI Setup utility, Virtual CD-ROM ISO, or clear boot override",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" chassis bootdev bios   |   ... chassis bootdev cdrom options=efiboot   |   ... chassis bootdev none',
        flags: [
          ["bootdev bios", "Enters BIOS/UEFI Setup automatically on next POST"],
          ["bootdev cdrom", "Boots from mounted Virtual Media CD/DVD ISO"],
          ["bootdev disk", "Boots from primary local disk"],
          ["bootdev none", "Clears any pending one-time boot override"]
        ],
        tags: ["bios", "cdrom", "disk", "none", "bootdev", "setup"]
      },
      {
        id: "ipmi-bootparam-no-timeout",
        mode: "BOOT",
        modeClass: "mode-c",
        desc: "Disable the IPMI 60-second boot flag watchdog timer so `bootdev` isn't cleared if reboot takes >60s",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" chassis bootparam set bootflag force_pxe options=no-timeout',
        flags: [
          ["options=no-timeout", "Prevents BMC from clearing the one-time boot flag if chassis power cycle happens >60 seconds later"]
        ],
        tags: ["bootparam", "timeout", "bootflag", "force_pxe"]
      }
    ]
  },
  {
    id: "sensors-sdr-dcmi",
    badge: "sdr",
    title: "Sensors, SDR, Fan Speeds & DCMI Wattage",
    subtitle: "Extended SDR readings, temperature/fan/PSU filtering, thresholds & DCMI power draw",
    commands: [
      {
        id: "ipmi-sdr-elist-types",
        mode: "SENSORS",
        modeClass: "mode-n",
        desc: "Read all Sensor Data Repository (SDR) entries or filter specifically by Temperature, Fan, or Power Supply",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" sdr elist full   |   ... sdr type Temperature   |   ... sdr type Fan   |   ... sdr type "Power Supply"',
        flags: [
          ["sdr elist full", "Fast bulk read of all analog/discrete sensors with sensor ID, status, and reading"],
          ["sdr type list", "Print all valid sensor type strings (Temperature, Voltage, Current, Fan, Memory, Processor)"]
        ],
        tip: "sdr elist is much faster than sensor list",
        tags: ["sdr", "sensor", "temperature", "fan", "psu", "voltage", "elist"]
      },
      {
        id: "ipmi-dcmi-power-reading",
        mode: "POWER",
        modeClass: "mode-n",
        desc: "Read real-time server power consumption (Watts), min/max/avg power, and thermal status via DCMI",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" dcmi power reading   |   ... dcmi power get_limit',
        flags: [
          ["dcmi power reading", "Prints Instantaneous power (Watts), Min, Max, Average over sample period, and timestamp"],
          ["dcmi power set_limit", "Configure out-of-band node power cap in Watts"]
        ],
        tip: "Works on almost all datacenter BMCs",
        tags: ["dcmi", "power", "watts", "consumption", "limit", "wattage"]
      },
      {
        id: "ipmi-sensor-thresholds",
        mode: "SENSORS",
        modeClass: "mode-n",
        desc: "Inspect lower/upper non-critical, critical, and non-recoverable thresholds for a specific sensor",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" sensor get "Inlet Temp" "FAN1"',
        flags: [
          ["unr / ucr / unc", "Upper Non-Recoverable / Upper Critical / Upper Non-Critical thresholds"],
          ["lnr / lcr / lnc", "Lower Non-Recoverable / Lower Critical / Lower Non-Critical thresholds"]
        ],
        tags: ["thresholds", "critical", "inlet", "fan", "sensor"]
      }
    ]
  },
  {
    id: "sel-logs",
    badge: "sel",
    title: "System Event Log (SEL) & Hardware Triage",
    subtitle: "Decoded SEL event listing, ECC/PCIe/PSU assertion triage, BMC clock sync & clearing logs",
    commands: [
      {
        id: "ipmi-sel-elist",
        mode: "EVENT LOG",
        modeClass: "mode-n",
        desc: "Display System Event Log cross-referenced with SDR sensor names for human-readable hardware triage",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" sel elist   |   ... sel elist last 25',
        flags: [
          ["sel elist", "Resolves raw hex sensor numbers into human-readable sensor names (unlike 'sel list')"],
          ["sel elist last 25", "Fetch only the most recent 25 hardware events"],
          ["sel get <0xID>", "Inspect detailed extended record data for a specific SEL entry ID"]
        ],
        tip: "Always use 'sel elist' (not 'sel list')",
        tags: ["sel", "elist", "logs", "events", "ecc", "pcie", "triage"]
      },
      {
        id: "ipmi-sel-info-clear",
        mode: "EVENT LOG",
        modeClass: "mode-c",
        desc: "Check SEL fullness percentage (`Percent Used`), backup SEL to file, and clear the log",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" sel info   |   ... sel save sel_backup.log   |   ... sel clear',
        flags: [
          ["Overflow : true", "Indicates SEL hit 100% capacity and dropped newer hardware events — clear after saving!"],
          ["sel time get / now", "Check BMC real-time clock or sync it to host clock"]
        ],
        tags: ["clear", "overflow", "save", "backup", "time", "sel"]
      }
    ]
  },
  {
    id: "sol-console",
    badge: "sol",
    title: "Serial-over-LAN (SOL) Console",
    subtitle: "Interactive BIOS/GRUB/kernel serial console over UDP/623, kicking hung sessions & baud rates",
    commands: [
      {
        id: "ipmi-sol-activate",
        mode: "CONSOLE",
        modeClass: "mode-v",
        desc: "Connect to the server's live serial console (BIOS POST, GRUB, Linux ttyS0/ttyS1) over the network",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" -e @ sol activate',
        flags: [
          ["-e @", "Sets escape character to '@' instead of '~' so typing '<Enter>@.' exits SOL without killing your SSH session!"],
          ["Linux kernel args", "Ensure GRUB has 'console=tty0 console=ttyS1,115200n8' (or ttyS0 depending on motherboard)"]
        ],
        tip: "Use -e @ inside SSH sessions!",
        tags: ["sol", "serial", "console", "activate", "escape", "ttys0", "ttys1"]
      },
      {
        id: "ipmi-sol-deactivate-info",
        mode: "CONSOLE",
        modeClass: "mode-c",
        desc: "Force-close a hung or active SOL session and inspect SOL baud rate configuration",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" sol deactivate   |   ... sol info 1   |   ... sol set non-volatile-bit-rate 115.2 1',
        flags: [
          ["sol deactivate", "Frees the SOL channel when 'SOL payload already active on another session' error occurs"],
          ["115.2", "Standard 115200 bps serial baud rate (9.6, 19.2, 38.4, 57.6, 115.2)"]
        ],
        tags: ["deactivate", "baud", "bitrate", "hung", "sol"]
      }
    ]
  },
  {
    id: "bmc-lan-users",
    badge: "lan6",
    title: "BMC Network (lan6 / lan) & User Management",
    subtitle: "In-band BMC IPv6/IPv4 discovery (lan6 print), SLAAC/DHCPv6/Static config, VLAN tagging & user password resets",
    commands: [
      {
        id: "ipmi-lan-print-discover",
        mode: "NETWORK",
        modeClass: "mode-n",
        desc: "Print current BMC IPv6 (Global/SLAAC/DHCPv6/Link-Local) and IPv4 address, MAC, gateway, and VLAN from inside the host OS",
        cmd: "ipmitool lan6 print 1 && ipmitool lan print 1",
        flags: [
          ["lan6 print 1", "Displays IPMI 2.0 IPv6 Static/Dynamic (SLAAC/DHCPv6) addresses, prefix length (/64), link-local fe80:: address, and IPv6 gateway"],
          ["Channel 1 vs 8", "Most servers use Channel 1 for dedicated BMC; some use Channel 8 for shared LOM"]
        ],
        tip: "Use 'lan6 print 1' to see BMC IPv6 SLAAC/DHCPv6 addresses!",
        tags: ["lan6", "lan", "ipv6", "ip", "mac", "gateway", "channel", "discover", "slaac", "dhcpv6"]
      },
      {
        id: "ipmi-lan-set-static-dhcp",
        mode: "NETWORK",
        modeClass: "mode-c",
        desc: "Configure static IPv6 address & prefix (or enable SLAAC/DHCPv6 dynamic addressing) and 802.1Q VLAN on the BMC",
        cmd: "ipmitool lan6 set 1 enabler ipv6_only && ipmitool lan6 set 1 static_addr 0 enable 2001:db8:dc:1::100 64",
        flags: [
          ["lan6 set 1 enabler both / ipv6_only", "Enable dual-stack ('both') or strict 'ipv6_only' on BMC Channel 1"],
          ["lan6 set 1 addr_src <slaac|dhcpv6>", "Enable IPv6 Stateless Address Autoconfiguration (SLAAC) or stateful DHCPv6"],
          ["lan set 1 vlan id 200", "Enable 802.1Q VLAN tagging on VLAN 200 (use 'vlan id off' to disable)"]
        ],
        tags: ["lan6", "ipv6", "static", "dhcpv6", "slaac", "gateway", "vlan", "ipaddr"]
      },
      {
        id: "ipmi-user-password-admin",
        mode: "USERS",
        modeClass: "mode-c",
        desc: "List BMC user accounts, reset forgotten BMC admin password from host OS, or grant Admin privilege",
        cmd: "ipmitool user list 1   |   ipmitool user set password 2 'NewStrongPass!'   |   ipmitool channel setaccess 1 2 link=on ipmi=on callin=on privilege=4",
        flags: [
          ["user list 1", "List all user slot IDs (ID 2 is typically 'admin' or 'root')"],
          ["privilege=4", "Grant ADMINISTRATOR (4) privilege on Channel 1 and enable user via 'ipmitool user enable <id>'"]
        ],
        tip: "Reset BMC password without rebooting!",
        tags: ["user", "password", "reset", "admin", "privilege", "channel"]
      }
    ]
  },
  {
    id: "fru-mc-watchdog",
    badge: "mc",
    title: "FRU Inventory, BMC Reset (mc) & Watchdog",
    subtitle: "Motherboard/chassis/PSU serials, cold resetting hung BMC & hardware watchdog timer",
    commands: [
      {
        id: "ipmi-fru-print",
        mode: "INVENTORY",
        modeClass: "mode-n",
        desc: "Dump Field Replaceable Unit (FRU) EEPROM data: Board/Chassis/Product part & serial numbers",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" fru print',
        flags: [
          ["Board Serial / Product Serial", "Reads factory-programmed EEPROM serials for chassis, backplane, motherboard, and PSUs"]
        ],
        tags: ["fru", "serial", "part-number", "motherboard", "chassis", "inventory"]
      },
      {
        id: "ipmi-mc-info-reset",
        mode: "BMC MGMT",
        modeClass: "mode-c",
        desc: "Check BMC firmware version or perform a non-disruptive cold reset of the BMC processor",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS" mc info   |   ... mc reset cold   |   ... mc reset warm',
        flags: [
          ["mc info", "Displays BMC Firmware Revision, IPMI Version, Manufacturer ID, and Auxiliary FW Rev"],
          ["mc reset cold", "Reboots the BMC controller completely (does NOT reboot the host server or interrupt workloads!)"]
        ],
        tip: "Fixes hung BMC web UI / Redfish",
        tags: ["mc", "bmc", "reset", "cold", "firmware", "version"]
      },
      {
        id: "ipmi-mc-watchdog-kernel",
        mode: "WATCHDOG",
        modeClass: "mode-c",
        desc: "Inspect or disable the BMC hardware watchdog timer (prevents unexpected ASR reboots during maintenance)",
        cmd: "ipmitool mc watchdog get   |   ipmitool mc watchdog off   |   modprobe ipmi_devintf ipmi_si",
        flags: [
          ["mc watchdog off", "Stops active BMC hardware watchdog timer so it doesn't hard-reset the host if OS daemon stops patting it"],
          ["modprobe ipmi_devintf ipmi_si", "Load Linux kernel OpenIPMI drivers to create /dev/ipmi0"]
        ],
        tags: ["watchdog", "asr", "reboot", "kernel", "ipmi_devintf", "ipmi_si"]
      }
    ]
  }
];

// Interactive ipmitool Builder Database
const IPMI_BUILDER_TASKS = {
  chassis: [
    {
      id: "pxe-cycle",
      label: "One-Time UEFI PXE Boot + Cold Power Cycle",
      desc: "Set next boot to UEFI PXE network boot and immediately cold power-cycle the server",
      args: "chassis bootdev pxe options=efiboot",
      chain: "chassis power cycle"
    },
    {
      id: "power-status",
      label: "Check Chassis Power & Last Fault Status",
      desc: "Check current power state and inspect Last Power Event (AC loss, overload, fault)",
      args: "chassis status"
    },
    {
      id: "bios-boot",
      label: "Boot Directly into BIOS/UEFI Setup",
      desc: "Configure server to enter BIOS/UEFI Setup utility on the next boot",
      args: "chassis bootdev bios"
    },
    {
      id: "power-soft",
      label: "Graceful ACPI OS Shutdown (power soft)",
      desc: "Send a graceful ACPI shutdown signal to the operating system",
      args: "chassis power soft"
    }
  ],
  sdr: [
    {
      id: "sdr-temp-fan",
      label: "Read All Temperature & Fan Sensors",
      desc: "Query all chassis, CPU, and inlet/exhaust temperature sensors (°C)",
      args: "sdr type Temperature"
    },
    {
      id: "sdr-elist-all",
      label: "Dump Full Extended Sensor Repository (sdr elist)",
      desc: "Fast bulk dump of all analog and discrete sensors in the SDR",
      args: "sdr elist full"
    },
    {
      id: "dcmi-watts",
      label: "Read Real-Time Server Wattage (dcmi power)",
      desc: "Query instantaneous, minimum, maximum, and average server power consumption in Watts",
      args: "dcmi power reading"
    }
  ],
  sel: [
    {
      id: "sel-elist",
      label: "Read Decoded System Event Log (sel elist)",
      desc: "List System Event Log entries cross-referenced with human-readable SDR sensor names",
      args: "sel elist"
    },
    {
      id: "sel-clear",
      label: "Clear System Event Log (sel clear)",
      desc: "Clear all entries in the BMC System Event Log",
      args: "sel clear"
    }
  ],
  sol: [
    {
      id: "sol-act",
      label: "Activate Serial-over-LAN Console (SSH-safe -e @)",
      desc: "Open interactive serial console using '@' as the escape character (type <Enter>@. to exit)",
      args: "-e @ sol activate"
    },
    {
      id: "sol-deact",
      label: "Force Deactivate Hung SOL Session",
      desc: "Terminate an existing or hung Serial-over-LAN session on the BMC",
      args: "sol deactivate"
    }
  ],
  lan: [
    {
      id: "lan-print",
      label: "Print BMC IPv6 Network Config (lan6 print 1)",
      desc: "Display BMC IPv6 SLAAC/DHCPv6/Static addresses, prefix length, link-local address, and gateway on Channel 1",
      args: "lan6 print 1"
    },
    {
      id: "mc-cold",
      label: "Cold Reset BMC Controller (Non-Disruptive)",
      desc: "Reboot the BMC management processor without interrupting the host OS or workloads",
      args: "mc reset cold"
    }
  ]
};

// Application State
const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  compact: localStorage.getItem("linux_cs_compact") === "1",
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set(JSON.parse(localStorage.getItem("ipmi_cs_bookmarks") || "[]"))
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

function highlightIpmiCmd(raw) {
  const escaped = escapeHtml(raw);
  return escaped.replace(
    /(\s\|\s|\s&&\s|\s\|\|\s)|(\b(?:ipmitool|sudo|modprobe|for|do|done|echo|grep)\b)|(\b(?:chassis|power|bootdev|bootparam|sdr|sensor|dcmi|sel|sol|lan|user|channel|fru|mc|raw)\b)|(\s-[a-zA-Z0-9-]+|\boptions=[a-zA-Z0-9,-]+)/g,
    (match, sep, cmd, sub, flag) => {
      if (sep) return `<span class="tok-pipe">${sep}</span>`;
      if (cmd) return `<span class="tok-cmd">${cmd}</span>`;
      if (sub) return `<span class="tok-str">${sub}</span>`;
      if (flag) return `<span class="tok-flag">${flag}</span>`;
      return match;
    }
  );
}

function renderCategoryTabs() {
  const totalCommands = IPMI_CHEAT_SHEET_DATA.reduce((sum, s) => sum + s.commands.length, 0);
  const optionsHtml = [
    `<option value="all" ${state.activeCategory === "all" ? "selected" : ""}>All Sections (${totalCommands} commands)</option>`
  ];

  for (const section of IPMI_CHEAT_SHEET_DATA) {
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

  for (const section of IPMI_CHEAT_SHEET_DATA) {
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
              <code class="cmd-code">${highlightIpmiCmd(item.cmd)}</code>
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

function initIpmiBuilder() {
  const subEl = document.getElementById("ipmi-sub");
  const taskEl = document.getElementById("ipmi-task");
  const modeEl = document.getElementById("ipmi-mode");
  const cmdOutputEl = document.getElementById("ipmi-cmd-output");
  const previewBox = document.getElementById("ipmi-preview-box");
  const copyBtn = document.getElementById("ipmi-copy-btn");
  const meaningEl = document.getElementById("ipmi-meaning-text");
  const presetBtns = document.querySelectorAll(".ipmi-preset");

  const PREFIX_MAP = {
    lanplus: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -P "$PASS"',
    local: "ipmitool",
    env: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E'
  };

  function populateTasks(subKey, selectedTaskId) {
    const list = IPMI_BUILDER_TASKS[subKey] || [];
    taskEl.innerHTML = list
      .map(
        (t) =>
          `<option value="${t.id}" ${t.id === selectedTaskId ? "selected" : ""}>${escapeHtml(t.label)}</option>`
      )
      .join("");
  }

  function updateIpmiPreview() {
    const subKey = subEl.value;
    const list = IPMI_BUILDER_TASKS[subKey] || [];
    const current = list.find((t) => t.id === taskEl.value) || list[0];
    if (!current) return;

    const modeKey = modeEl.value;
    const prefix = PREFIX_MAP[modeKey] || PREFIX_MAP.lanplus;
    let fullCmd = `${prefix} ${current.args}`;
    if (current.chain) {
      fullCmd += ` && ${prefix} ${current.chain}`;
    }

    cmdOutputEl.innerHTML = highlightIpmiCmd(fullCmd);
    previewBox.dataset.copy = fullCmd;
    meaningEl.textContent = current.desc;

    presetBtns.forEach((btn) => {
      const active =
        btn.dataset.sub === subKey &&
        btn.dataset.task === current.id &&
        btn.dataset.mode === modeKey;
      btn.classList.toggle("active", active);
    });
  }

  subEl.addEventListener("change", () => {
    populateTasks(subEl.value);
    updateIpmiPreview();
  });

  taskEl.addEventListener("change", updateIpmiPreview);
  modeEl.addEventListener("change", updateIpmiPreview);

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      subEl.value = btn.dataset.sub;
      populateTasks(btn.dataset.sub, btn.dataset.task);
      modeEl.value = btn.dataset.mode;
      updateIpmiPreview();
    });
  });

  previewBox.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  copyBtn.addEventListener("click", () => {
    copyToClipboard(previewBox.dataset.copy);
  });

  populateTasks("chassis", "pxe-cycle");
  updateIpmiPreview();
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
        showToast("Removed from saved commands");
      } else {
        state.bookmarks.add(id);
        showToast("Saved command to bookmarks");
      }
      localStorage.setItem("ipmi_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
initIpmiBuilder();
initMiniTabs();
initEvents();
