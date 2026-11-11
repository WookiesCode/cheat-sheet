const IPMI_CHEAT_SHEET_DATA = [
  {
    part: "ipmi-chassis-power",
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
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E chassis power status   |   ... chassis power cycle   |   ... chassis power reset   |   ... chassis power soft',
        flags: [
          ["power cycle", "Power off, then on again, with an off interval of at least 1 second"],
          ["power reset", "Warm hard reset (pulses motherboard reset line without dropping DC power rails)"],
          ["power soft", "Send ACPI power button signal for graceful OS shutdown"],
          ["power off / on", "Immediate hard DC power off / power on"]
        ],
        tip: "Prefer cycle over reset after BIOS/PCIe hangs",
        tags: ["power", "cycle", "reset", "soft", "on", "off", "status"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}, {"url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_chassis.c", "title": "ipmitool source (ipmi_chassis.c)"}]}
      },
      {
        id: "ipmi-chassis-status",
        mode: "CHASSIS",
        modeClass: "mode-n",
        desc: "Inspect detailed chassis state: Last Power Event (AC failed, overload, thermal trip), power restore policy & intrusion",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E chassis status   |   ... chassis policy always-on',
        flags: [
          ["Last Power Event", "Why it last went off: 'ac-failed', 'overload', 'interlock', 'fault' or 'command'"],
          ["chassis policy", "Set AC power recovery mode: 'always-on', 'previous', or 'always-off'"]
        ],
        tip: "Check 'Last Power Event' after unexpected reboot",
        tags: ["chassis", "status", "policy", "ac-failed", "overload", "fault"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}, {"url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_chassis.c", "title": "ipmitool source (ipmi_chassis.c)"}], "note": "Corrected 2026-11-09: Last Power Event names as ipmitool prints them."}
      },
      {
        id: "ipmi-chassis-identify-nmi",
        mode: "CHASSIS",
        modeClass: "mode-c",
        desc: "Blink the physical blue Chassis UID Locator LED or pulse diagnostic NMI for kernel kdump",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E chassis identify force   |   ... chassis identify 0',
        flags: [
          ["identify force / 60", "Turn UID LED on indefinitely ('force') or blink for 60 seconds ('0' turns it off)"],
          ["chassis power diag", "Pulse a diagnostic interrupt (NMI): a hung Linux host panics and writes a kdump if one is set up"]
        ],
        subcommands: [
          ['ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E chassis power diag', "Pulse an NMI to a hung host so it panics and writes a kdump (reference only: it crashes the kernel)", {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}, {"url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_chassis.c", "title": "ipmitool source (ipmi_chassis.c)"}]}]
        ],
        tags: ["identify", "uid", "led", "blink", "diag", "nmi", "kdump"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}]}
      }
    ]
  },
  {
    "part": "ipmi-chassis-power",
    "id": "chassis-power-pro-tips",
    "badge": "tip",
    "title": "Chassis Power & UID: Pro Tips & Best Practices",
    "subtitle": "Chassis Power Cycling & Hard Freeze Triage",
    "commands": [
      {
        "id": "chassis-power-tips-card",
        "desc": "Chassis Power Cycling & Hard Freeze Triage",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E chassis power status",
        "details": "Try \"power soft\" first: it asks the OS for an ACPI shutdown. If the kernel is hard frozen, \"power diag\" pulses an NMI so a kdump-configured kernel writes a crash dump; \"power cycle\" powers off for at least 1 second, then back on.",
        "flags": [
          [
            "chassis power status",
            "Query whether the host motherboard is currently on or off"
          ],
          [
            "chassis power cycle",
            "Hard power off for at least 1 s, then on (no clean OS shutdown)"
          ],
          [
            "chassis identify <seconds>",
            "Blink the identify (UID) LED; default 15 s, 0 = off, force = on until turned off"
          ]
        ],
        "tip": "Run \"chassis status\" after unexpected node drops to inspect \"Last Power Event\" (e.g. AC failed, power overload, power interlock).",
        "tags": [
          "chassis-power",
          "tips",
          "pro",
          "ipmitool",
          "bmc",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool(1) man page"
            }
          ]
        }
      }
    ]
  },
  {
    part: "ipmi-boot-override",
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
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E chassis bootdev pxe options=efiboot && ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E chassis power cycle',
        flags: [
          ["options=efiboot", "Critical on modern servers: without efiboot, some BMCs attempt Legacy CSM PXE and fail!"],
          ["options=persistent", "Add comma-separated 'options=efiboot,persistent' to make PXE first permanently"]
        ],
        tip: "Always include options=efiboot",
        tags: ["pxe", "bootdev", "efiboot", "uefi", "network", "reinstall"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}, {"url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_chassis.c", "title": "ipmitool source (ipmi_chassis.c)"}], "note": "options=efiboot,persistent are in ipmitool's source, not its man page."}
      },
      {
        id: "ipmi-bootdev-bios-cdrom",
        mode: "BOOT",
        modeClass: "mode-c",
        desc: "Boot directly into BIOS/UEFI Setup utility, Virtual CD-ROM ISO, or clear boot override",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E chassis bootdev bios   |   ... chassis bootdev cdrom options=efiboot   |   ... chassis bootdev none',
        flags: [
          ["bootdev bios", "Enters BIOS/UEFI Setup automatically on next POST"],
          ["bootdev cdrom", "Boots from mounted Virtual Media CD/DVD ISO"],
          ["bootdev disk", "Boots from primary local disk"],
          ["bootdev none", "Clears any pending one-time boot override"]
        ],
        tags: ["bios", "cdrom", "disk", "none", "bootdev", "setup"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}]}
      },
      {
        id: "ipmi-bootparam-no-timeout",
        mode: "BOOT",
        modeClass: "mode-c",
        desc: "Stop the BMC clearing a boot override after 60 seconds without a power command (run before bootdev; ipmitool 1.8.19's options=no-timeout is broken)",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E raw 0x00 0x08 0x03 0x08 && ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E chassis bootparam get 3',
        flags: [
          ["raw 0x00 0x08", "Set System Boot Options (chassis netfn 0x00, command 0x08): what ipmitool's bootparam set sends"],
          ["0x03 0x08", "Parameter 3, boot flag valid bit clearing; bit 0x08 = don't clear the boot flag on the 60-second timeout. The other bits (PEF, watchdog, reset, power button) are written as 0"],
          ["bootparam get 3", "Check: prints \"Don't automatically clear boot flag valid bit on timeout\""],
          ["raw 0x00 0x08 0x03 0x00", "Undo: the BMC clears the boot flag on timeout again"],
          ["options=no-timeout", "Broken in ipmitool 1.8.19 (the latest release): prints \"Invalid option: no-timeout\", still sets the boot device and exits 0. Fixed on Codeberg master (2024-06-24), not yet released"]
        ],
        tip: "Simpler when you can: chain bootdev with chassis power cycle on one line, or use options=persistent",
        tags: ["bootparam", "timeout", "bootflag", "raw", "60 seconds", "no-timeout"],
        src: {"verified": "2026-11-11", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_chassis.c", "title": "ipmitool source: ipmi_chassis.c (Set Boot Options, parameter 3 bits)"}, {"url": "https://github.com/ipmitool/ipmitool/blob/master/include/ipmitool/ipmi_constants.h", "title": "ipmitool source: ipmi_constants.h (boot parameter numbers)"}, {"url": "https://codeberg.org/IPMITool/ipmitool/commit/b67f400825", "title": "ipmitool commit b67f400825: restore the no- option prefix"}], "note": "Rewritten 2026-11-11: options=no-timeout matched only a bare \"no-\" from 2020-06-10 (6e037d6) until Codeberg commit b67f400825; IPMITOOL_1_8_19 (2022) has the bug. The raw bytes are the ones ipmitool's own code sends."}
      }
    ]
  },
  {
    "part": "ipmi-boot-override",
    "id": "boot-override-pro-tips",
    "badge": "tip",
    "title": "Boot Device Override: Pro Tips & Best Practices",
    "subtitle": "Automated PXE Re-imaging & Boot Flag Persistence",
    "commands": [
      {
        "id": "boot-override-tips-card",
        "desc": "Automated PXE Re-imaging & Boot Flag Persistence",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E chassis bootdev pxe options=efiboot",
        "details": "A boot override is cleared automatically if no chassis power command arrives within 60 seconds. Chain the bootdev command with \"chassis power cycle\" on one line, or add options=persistent to keep the device for all future boots (set it back with bootdev disk afterwards).",
        "flags": [
          [
            "bootdev pxe",
            "Direct next host boot to UEFI PXE network installer (HTTP/TFTP)"
          ],
          [
            "bootdev bios",
            "Boot into BIOS (UEFI) Setup next time"
          ],
          [
            "bootdev pxe options=persistent,efiboot",
            "Keep PXE as the boot device for all future boots, in UEFI mode"
          ]
        ],
        "tip": "Always specify \"options=efiboot\" on modern UEFI servers to avoid legacy BIOS CSM boot failure.",
        "tags": [
          "boot-override",
          "tips",
          "pro",
          "ipmitool",
          "bmc",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool(1) man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_chassis.c",
              "title": "ipmitool source: ipmi_chassis.c (boot options)"
            }
          ],
          "note": "Corrected 2026-11-10: removed \"bootparam set bootflag no-timeout\"; ipmitool's parser rejects no-timeout. The 60-second timeout is from the man page."
        }
      }
    ]
  },
  {
    part: "ipmi-sensors-sdr",
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
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E sdr elist full   |   ... sdr type Temperature   |   ... sdr type Fan   |   ... sdr type "Power Supply"',
        flags: [
          ["sdr elist full", "Fast bulk read of all analog/discrete sensors with sensor ID, status, and reading"],
          ["sdr type list", "Print all valid sensor type strings (Temperature, Voltage, Current, Fan, Memory, Processor)"]
        ],
        tip: "sdr elist is much faster than sensor list",
        tags: ["sdr", "sensor", "temperature", "fan", "psu", "voltage", "elist"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}], "note": "Type names: list them with sdr type list."}
      },
      {
        id: "ipmi-dcmi-power-reading",
        mode: "POWER",
        modeClass: "mode-n",
        desc: "Read real-time server power consumption (Watts), min/max/avg power, and thermal status via DCMI",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E dcmi power reading   |   ... dcmi power get_limit',
        flags: [
          ["dcmi power reading", "Prints Instantaneous power (Watts), Min, Max, Average over sample period, and timestamp"],
          ["dcmi power set_limit", "Configure out-of-band node power cap in Watts"]
        ],
        tip: "Works on almost all datacenter BMCs",
        tags: ["dcmi", "power", "watts", "consumption", "limit", "wattage"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}], "note": "\"Works on almost all BMCs\" is a rule of thumb."}
      },
      {
        id: "ipmi-sensor-thresholds",
        mode: "SENSORS",
        modeClass: "mode-n",
        desc: "Inspect lower/upper non-critical, critical, and non-recoverable thresholds for a specific sensor",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E sensor get "Inlet Temp" "FAN1"',
        flags: [
          ["unr / ucr / unc", "Upper Non-Recoverable / Upper Critical / Upper Non-Critical thresholds"],
          ["lnr / lcr / lnc", "Lower Non-Recoverable / Lower Critical / Lower Non-Critical thresholds"]
        ],
        tags: ["thresholds", "critical", "inlet", "fan", "sensor"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}]}
      }
    ]
  },
  {
    "part": "ipmi-sensors-sdr",
    "id": "sensors-sdr-dcmi-pro-tips",
    "badge": "tip",
    "title": "Sensors & DCMI Power: Pro Tips & Best Practices",
    "subtitle": "Hardware Environmental Triage & Thermal Throttling Detection",
    "commands": [
      {
        "id": "sensors-sdr-dcmi-tips-card",
        "desc": "Hardware Environmental Triage & Thermal Throttling Detection",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E sdr elist full",
        "details": "sdr elist full prints each threshold sensor (volts, amps, RPM, degrees C) with its status (ok, nc, cr, nr), sensor number and entity. dcmi power reading reports the BMC's instantaneous, minimum, maximum and average power in watts, where the BMC supports DCMI.",
        "flags": [
          [
            "sdr elist full",
            "Display all populated sensors with calibrated analog units and health status"
          ],
          [
            "dcmi power reading",
            "Read instantaneous, minimum, maximum, and average server power consumption in Watts"
          ],
          [
            "sensor get <name>",
            "Display lower and upper non-critical, critical, and non-recoverable threshold boundaries"
          ]
        ],
        "tip": "Filter SDR by sensor type using \"sdr type Temperature\" or \"sdr type Fan\" to cut through noisy SDR catalogs.",
        "tags": [
          "sensors-sdr-dcmi",
          "tips",
          "pro",
          "ipmitool",
          "bmc",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool(1) man page"
            }
          ]
        }
      }
    ]
  },
  {
    part: "ipmi-sel-logs",
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
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E sel elist   |   ... sel elist last 25',
        flags: [
          ["sel elist", "Resolves raw hex sensor numbers into human-readable sensor names (unlike 'sel list')"],
          ["sel elist last 25", "Fetch only the most recent 25 hardware events"],
          ["sel get <0xID>", "Inspect detailed extended record data for a specific SEL entry ID"]
        ],
        tip: "Always use 'sel elist' (not 'sel list')",
        tags: ["sel", "elist", "logs", "events", "ecc", "pcie", "triage"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}, {"url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sel.c", "title": "ipmitool source (ipmi_sel.c)"}]}
      },
      {
        id: "ipmi-sel-info-clear",
        mode: "EVENT LOG",
        modeClass: "mode-c",
        desc: "Check SEL fullness percentage (`Percent Used`), backup SEL to file, and clear the log",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E sel info   |   ... sel save sel_backup.log   |   ... sel clear',
        flags: [
          ["Overflow : true", "Indicates SEL hit 100% capacity and dropped newer hardware events — clear after saving!"],
          ["sel time get / set", "Read the SEL clock, or set it: sel time set \"mm/dd/yyyy hh:mm:ss\""]
        ],
        tags: ["clear", "overflow", "save", "backup", "time", "sel"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}, {"url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sel.c", "title": "ipmitool source (ipmi_sel.c)"}], "note": "Corrected 2026-11-09: there is no \"sel time set now\"; give a date and time."}
      }
    ]
  },
  {
    "part": "ipmi-sel-logs",
    "id": "sel-logs-pro-tips",
    "badge": "tip",
    "title": "SEL Logs & Faults: Pro Tips & Best Practices",
    "subtitle": "Out-of-Band Hardware Event Triage & Post-Mortem Crash Analysis",
    "commands": [
      {
        "id": "sel-logs-tips-card",
        "desc": "Out-of-Band Hardware Event Triage & Post-Mortem Crash Analysis",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E sel elist",
        "details": "The BMC System Event Log records hardware events the BMC sees or BIOS reports to it (memory ECC errors, PSU failures, thermal trips, PCIe errors), even when the OS is down. \"sel elist\" adds the sensor names from the SDR to each entry.",
        "flags": [
          [
            "sel elist",
            "Print human-readable SEL entries cross-referenced against the SDR catalog"
          ],
          [
            "sel info",
            "Inspect SEL fullness percentage, total entries, and free record space"
          ],
          [
            "sel clear",
            "Purge the BMC SEL memory buffer after documenting diagnostic fault traces"
          ]
        ],
        "tip": "Back up SEL entries to a timestamped file before calling \"sel clear\", as cleared events cannot be recovered.",
        "tags": [
          "sel-logs",
          "tips",
          "pro",
          "ipmitool",
          "bmc",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool(1) man page"
            }
          ]
        }
      }
    ]
  },
  {
    part: "ipmi-sol-console",
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
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E -e @ sol activate',
        flags: [
          ["-e @", "Sets escape character to '@' instead of '~' so typing '<Enter>@.' exits SOL without killing your SSH session!"],
          ["Linux kernel args", "Ensure GRUB has 'console=tty0 console=ttyS1,115200n8' (or ttyS0 depending on motherboard)"]
        ],
        tip: "Use -e @ inside SSH sessions!",
        tags: ["sol", "serial", "console", "activate", "escape", "ttys0", "ttys1"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}]}
      },
      {
        id: "ipmi-sol-deactivate-info",
        mode: "CONSOLE",
        modeClass: "mode-c",
        desc: "Force-close a hung or active SOL session and inspect SOL baud rate configuration",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E sol deactivate   |   ... sol info 1   |   ... sol set non-volatile-bit-rate 115.2 1',
        flags: [
          ["sol deactivate", "Frees the SOL channel when 'SOL payload already active on another session' error occurs"],
          ["115.2", "Standard 115200 bps serial baud rate (9.6, 19.2, 38.4, 57.6, 115.2)"]
        ],
        tags: ["deactivate", "baud", "bitrate", "hung", "sol"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}], "note": "The trailing channel argument of sol set is not confirmed in the man page."}
      }
    ]
  },
  {
    "part": "ipmi-sol-console",
    "id": "sol-console-pro-tips",
    "badge": "tip",
    "title": "SOL Serial Console: Pro Tips & Best Practices",
    "subtitle": "Out-of-Band Serial Console Operations & Session Recovery",
    "commands": [
      {
        "id": "sol-console-tips-card",
        "desc": "Out-of-Band Serial Console Operations & Session Recovery",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E sol activate",
        "details": "Serial-over-LAN carries the host serial console (COM1/ttyS0 or COM2/ttyS1, set in BIOS) over an IPMI 2.0 lanplus session. If someone left a session open, \"sol deactivate\" releases it.",
        "flags": [
          [
            "sol activate",
            "Open bidirectional Serial-over-LAN terminal to view BIOS POST and GRUB"
          ],
          [
            "sol deactivate",
            "Forcefully terminate a hung or abandoned SOL session on the BMC"
          ],
          [
            "sol info",
            "SOL settings: bit rate, character accumulate/send thresholds, encryption and authentication"
          ]
        ],
        "tip": "To disconnect an active SOL session without killing the terminal, press Enter, then ~ (tilde), then . (period).",
        "tags": [
          "sol-console",
          "tips",
          "pro",
          "ipmitool",
          "bmc",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool(1) man page"
            }
          ],
          "note": "The default escape character is ~; ipmitool -e <char> changes it when ~ conflicts with ssh."
        }
      }
    ]
  },
  {
    part: "ipmi-bmc-lan-users",
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
        tags: ["lan6", "lan", "ipv6", "ip", "mac", "gateway", "channel", "discover", "slaac", "dhcpv6"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}, {"url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_lanp6.c", "title": "ipmitool source (ipmi_lanp6.c)"}], "note": "lan6 is in ipmitool's source but not its man page."}
      },
      {
        id: "ipmi-lan-set-static-dhcp",
        mode: "NETWORK",
        modeClass: "mode-c",
        desc: "Configure static IPv6 address & prefix (or enable SLAAC/DHCPv6 dynamic addressing) and 802.1Q VLAN on the BMC",
        cmd: "ipmitool lan6 set 1 enables ipv6 && ipmitool lan6 set 1 static_addr 0 enable 2001:db8:dc:1::100 64",
        flags: [
          ["lan6 set 1 enables ipv4 / ipv6 / both", "IPv4 only, IPv6 only, or dual-stack on BMC channel 1"],
          ["lan6 print 1", "Shows the dynamic (SLAAC/DHCPv6) addresses; ipmitool has no lan6 addr_src setting (dynamic_addr is read-only)"],
          ["lan set 1 vlan id 200", "Enable 802.1Q VLAN tagging on VLAN 200 (use 'vlan id off' to disable)"]
        ],
        tags: ["lan6", "ipv6", "static", "dhcpv6", "slaac", "gateway", "vlan", "ipaddr"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_lanp6.c", "title": "ipmitool source (ipmi_lanp6.c)"}, {"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}], "note": "Corrected 2026-11-09: the parameter is enables (ipv4|ipv6|both), not enabler ipv6_only; there is no addr_src."}
      },
      {
        id: "ipmi-user-password-admin",
        mode: "USERS",
        modeClass: "mode-c",
        desc: "List BMC user accounts, reset forgotten BMC admin password from host OS, or grant Admin privilege",
        cmd: "ipmitool user list 1   |   ipmitool user set password 2 '<new-password>'   |   ipmitool channel setaccess 1 2 link=on ipmi=on callin=on privilege=4",
        flags: [
          ["user list 1", "List all user slot IDs (ID 2 is typically 'admin' or 'root')"],
          ["privilege=4", "Grant ADMINISTRATOR (4) privilege on Channel 1 and enable user via 'ipmitool user enable <id>'"]
        ],
        tip: "Reset BMC password without rebooting!",
        tags: ["user", "password", "reset", "admin", "privilege", "channel"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}], "note": "Fill <new-password> yourself; the sample password was removed."}
      }
    ]
  },
  {
    "part": "ipmi-bmc-lan-users",
    "id": "bmc-lan-users-pro-tips",
    "badge": "tip",
    "title": "BMC Network & Users: Pro Tips & Best Practices",
    "subtitle": "BMC Out-of-Band Network Provisioning & Root Password Recovery",
    "commands": [
      {
        "id": "bmc-lan-users-tips-card",
        "desc": "BMC Out-of-Band Network Provisioning & Root Password Recovery",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E lan print 1",
        "details": "The BMC LAN channel is usually 1, but some vendors use another number: find it with \"channel info <n>\" (look for 802.3 LAN). From the host OS as root, in-band ipmitool (no -H) can reset a lost BMC password with \"user set password <id>\".",
        "flags": [
          [
            "lan print 1",
            "Display current BMC IP address, MAC address, subnet mask, and default gateway"
          ],
          [
            "lan6 print 1",
            "Display current BMC IPv6 global, link-local, SLAAC, and DHCPv6 addresses"
          ],
          [
            "user set password <id> <new_pass>",
            "Change BMC user password directly from local host or over RMCP+"
          ]
        ],
        "tip": "If the BMC has IPv6 enabled, \"lan6 print 1\" shows its static, SLAAC and DHCPv6 addresses",
        "tags": [
          "bmc-lan-users",
          "tips",
          "pro",
          "ipmitool",
          "bmc",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool(1) man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_lanp6.c",
              "title": "ipmitool source: ipmi_lanp6.c (lan6)"
            },
            {
              "url": "https://docs.kernel.org/driver-api/ipmi.html",
              "title": "Linux kernel IPMI driver"
            }
          ]
        }
      }
    ]
  },
  {
    part: "ipmi-fru-mc",
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
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E fru print',
        flags: [
          ["Board Serial / Product Serial", "Reads factory-programmed EEPROM serials for chassis, backplane, motherboard, and PSUs"]
        ],
        tags: ["fru", "serial", "part-number", "motherboard", "chassis", "inventory"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}]}
      },
      {
        id: "ipmi-mc-info-reset",
        mode: "BMC MGMT",
        modeClass: "mode-c",
        desc: "Check BMC firmware version or perform a non-disruptive cold reset of the BMC processor",
        cmd: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E mc info   |   ... mc reset cold   |   ... mc reset warm',
        flags: [
          ["mc info", "Displays BMC Firmware Revision, IPMI Version, Manufacturer ID, and Auxiliary FW Rev"],
          ["mc reset cold", "Reboots the BMC controller completely (does NOT reboot the host server or interrupt workloads!)"]
        ],
        tip: "Fixes hung BMC web UI / Redfish",
        tags: ["mc", "bmc", "reset", "cold", "firmware", "version"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}]}
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
        tags: ["watchdog", "asr", "reboot", "kernel", "ipmi_devintf", "ipmi_si"],
        src: {"verified": "2026-11-09", "refs": [{"url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in", "title": "ipmitool man page"}, {"url": "https://docs.kernel.org/driver-api/ipmi.html", "title": "Linux kernel IPMI driver"}], "note": "The kernel doc does not name /dev/ipmi0 itself."}
      }
    ]
  },
  {
    "id": "fru-mc-watchdog-pro-tips",
    "badge": "tip",
    "title": "FRU, BMC Reset & Watchdog: Pro Tips & Best Practices",
    "subtitle": "Hardware Inventory Audit & BMC Health Maintenance",
    "commands": [
      {
        "id": "fru-mc-watchdog-tips-card",
        "desc": "Hardware Inventory Audit & BMC Health Maintenance",
        "cmd": "ipmitool -I lanplus -H \"$BMC\" -U \"$BMC_USER\" -E fru print",
        "details": "FRU (Field Replaceable Unit) EEPROMs store board, chassis and PSU part numbers, serials and asset tags. If the BMC stops serving its web UI or Redfish, \"mc reset cold\" restarts the BMC; on most servers the host keeps running, but fans may ramp while it boots.",
        "flags": [
          [
            "fru print",
            "Dump board manufacturer, product name, serial number, and part number EEPROM data"
          ],
          [
            "mc info",
            "Display BMC firmware revision, IPMI version compliance (v2.0), and device ID"
          ],
          [
            "mc reset cold",
            "Restart the BMC (the host normally stays up)"
          ]
        ],
        "tip": "Check \"mc watchdog get\" to verify hardware watchdog timer parameters; disable watchdog during prolonged debug sessions.",
        "tags": [
          "fru-mc-watchdog",
          "tips",
          "pro",
          "ipmitool",
          "bmc",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool(1) man page"
            }
          ],
          "note": "\"The host stays up\" and fan ramp during a BMC reset are typical server behaviour, not stated in the ipmitool man page."
        }
      }
    ],
    "part": "ipmi-fru-mc"
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
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("ipmi.html", "ipmi_cs_bookmarks", IPMI_CHEAT_SHEET_DATA, {"ipmi-chassis-power":"ipmi-chassis-power_bookmarks","ipmi-boot-override":"ipmi-boot-override_bookmarks","ipmi-sensors-sdr":"ipmi-sensors-sdr_bookmarks","ipmi-sel-logs":"ipmi-sel-logs_bookmarks","ipmi-sol-console":"ipmi-sol-console_bookmarks","ipmi-bmc-lan-users":"ipmi-bmc-lan-users_bookmarks","ipmi-fru-mc":"ipmi-fru-mc_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("ipmi_cs_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(IPMI_CHEAT_SHEET_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: IPMI_CHEAT_SHEET_DATA, label: "ipmitool sheets", parts: {
   "ipmi-bmc-lan-users": {
    "title": "BMC Network & Users",
    "subtitle": "In-band BMC IPv6/IPv4 discovery (lan6 print), SLAAC/DHCPv6/Static config, VLAN tagging & user password resets",
    "pill": "LAN / IPMI 2.0 & RMCP+"
   },
   "ipmi-boot-override": {
    "title": "Boot Device Override",
    "subtitle": "One-time UEFI PXE network boot, BIOS Setup entry, Virtual CD ISO & clearing 60s timeout",
    "pill": "BOOT / IPMI 2.0 & RMCP+"
   },
   "ipmi-chassis-power": {
    "title": "Chassis Power & UID",
    "subtitle": "Power status/on/off/cycle/reset/soft/diag, last power fault reason & UID LED",
    "pill": "PWR / IPMI 2.0 & RMCP+"
   },
   "ipmi-fru-mc": {
    "title": "FRU, BMC Reset & Watchdog",
    "subtitle": "Motherboard/chassis/PSU serials, cold resetting hung BMC & hardware watchdog timer",
    "pill": "FRU / IPMI 2.0 & RMCP+"
   },
   "ipmi-sel-logs": {
    "title": "SEL Logs & Faults",
    "subtitle": "Decoded SEL event listing, ECC/PCIe/PSU assertion triage, BMC clock sync & clearing logs",
    "pill": "SEL / IPMI 2.0 & RMCP+"
   },
   "ipmi-sensors-sdr": {
    "title": "Sensors & DCMI Power",
    "subtitle": "Extended SDR readings, temperature/fan/PSU filtering, thresholds & DCMI power draw",
    "pill": "SDR / IPMI 2.0 & RMCP+"
   },
   "ipmi-sol-console": {
    "title": "SOL Serial Console",
    "subtitle": "Interactive BIOS/GRUB/kernel serial console over UDP/623, kicking hung sessions & baud rates",
    "pill": "SOL / IPMI 2.0 & RMCP+"
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

        // Recipes (they had cards of their own on the old per-topic pages).
        const subcommandsHtml =
          item.subcommands && item.subcommands.length
            ? `<div class="subcmd-list">
                <span class="subcmd-header">Subcommands &amp; Recipes (click any to copy)</span>
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
    lanplus: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -E',
    local: "ipmitool",
    env: 'ipmitool -I lanplus -H "$BMC" -U "$BMC_USER" -f ~/.ipmi_pass'
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
      localStorage.setItem("ipmi_cs_bookmarks", JSON.stringify([...state.bookmarks]));
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
initIpmiBuilder();
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
