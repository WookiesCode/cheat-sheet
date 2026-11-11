// bmc-tools.js
// Standalone interactive cheat sheet for BMC vendor tools: BMC tools hub (FreeIPMI, serial consoles)
const BMC_HUB_DATA = [
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-1",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Sensors with a health state, password prompted",
    "subtitle": "Sensors with a health state, password prompted",
    "commands": [
      {
        "id": "freeipmi-sensors",
        "desc": "Sensors with a health state, password prompted",
        "cmd": "ipmi-sensors -h $BMC -u $BMC_USER -P --output-sensor-state --ignore-not-available-sensors",
        "details": "",
        "flags": [
          [
            "-P / --password-prompt",
            "Ask for the password, so it never shows in ps or shell history"
          ],
          [
            "--output-sensor-state",
            "Add NOMINAL / WARNING / CRITICAL per sensor"
          ],
          [
            "--ignore-not-available-sensors",
            "Hide N/A sensors"
          ],
          [
            "--sdr-cache-recreate",
            "Rebuild a stale SDR cache (after a BMC firmware update)"
          ],
          [
            "-D LAN_2_0",
            "Force IPMI 2.0 (LAN is IPMI 1.5)"
          ],
          [
            "-I 3",
            "Cipher suite (default 3)"
          ]
        ],
        "tip": "-P (prompt) is the safe default; -p puts the password in ps",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "freeipmi",
          "sensors",
          "sdr",
          "bmc-info",
          "fru"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sensors.8.en.html",
              "title": "FreeIPMI ipmi-sensors(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/bmc-info.8.en.html",
              "title": "FreeIPMI bmc-info(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-fru.8.en.html",
              "title": "FreeIPMI ipmi-fru(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.7.en.html",
              "title": "FreeIPMI freeipmi(7)"
            }
          ],
          "note": "Sensor type names: list them with ipmi-sensors -L."
        }
      },
      {
        "id": "freeipmi-sensors-sub-1",
        "desc": "Only temperatures and fans",
        "cmd": "ipmi-sensors -h $BMC -u $BMC_USER -P -t Temperature,Fan",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "freeipmi",
          "sensors",
          "sdr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sensors.8.en.html",
              "title": "FreeIPMI ipmi-sensors(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/bmc-info.8.en.html",
              "title": "FreeIPMI bmc-info(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-fru.8.en.html",
              "title": "FreeIPMI ipmi-fru(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.7.en.html",
              "title": "FreeIPMI freeipmi(7)"
            }
          ],
          "note": "Sensor type names: list them with ipmi-sensors -L."
        }
      },
      {
        "id": "freeipmi-sensors-sub-2",
        "desc": "BMC firmware and IPMI version",
        "cmd": "bmc-info -h $BMC -u $BMC_USER -P --get-device-id",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "freeipmi",
          "sensors",
          "sdr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sensors.8.en.html",
              "title": "FreeIPMI ipmi-sensors(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/bmc-info.8.en.html",
              "title": "FreeIPMI bmc-info(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-fru.8.en.html",
              "title": "FreeIPMI ipmi-fru(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.7.en.html",
              "title": "FreeIPMI freeipmi(7)"
            }
          ],
          "note": "Sensor type names: list them with ipmi-sensors -L."
        }
      },
      {
        "id": "freeipmi-sensors-sub-3",
        "desc": "FRU serials for the RMA",
        "cmd": "ipmi-fru -h $BMC -u $BMC_USER -P",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "freeipmi",
          "sensors",
          "sdr"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sensors.8.en.html",
              "title": "FreeIPMI ipmi-sensors(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/bmc-info.8.en.html",
              "title": "FreeIPMI bmc-info(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-fru.8.en.html",
              "title": "FreeIPMI ipmi-fru(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.7.en.html",
              "title": "FreeIPMI freeipmi(7)"
            }
          ],
          "note": "Sensor type names: list them with ipmi-sensors -L."
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-2",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Last SEL entries, interpreted",
    "subtitle": "Last SEL entries, interpreted",
    "commands": [
      {
        "id": "freeipmi-sel",
        "desc": "Last SEL entries, interpreted",
        "cmd": "ipmi-sel -h $BMC -u $BMC_USER -P --tail=50 --interpret-oem-data --output-event-state",
        "details": "",
        "flags": [
          [
            "--tail=<n>",
            "About the last n records (vendor SELs vary)"
          ],
          [
            "--interpret-oem-data",
            "Decode OEM records where FreeIPMI knows the vendor"
          ],
          [
            "--output-event-state",
            "NOMINAL / WARNING / CRITICAL per event"
          ],
          [
            "--display-range=<a>-<b>",
            "A range of record IDs"
          ],
          [
            "--clear / --post-clear / --delete=<id>",
            "Change the SEL (changes state)"
          ]
        ],
        "tip": "Save the SEL before anyone clears it",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "sel",
          "events",
          "logs",
          "oem"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sel.8.en.html",
              "title": "FreeIPMI ipmi-sel(8)"
            }
          ]
        }
      },
      {
        "id": "freeipmi-sel-sub-1",
        "desc": "Save the whole SEL to the case folder",
        "cmd": "ipmi-sel -h $BMC -u $BMC_USER -P --output-event-state > sel.txt",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "sel",
          "events",
          "logs"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-sel.8.en.html",
              "title": "FreeIPMI ipmi-sel(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-3",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Power status for a whole rack at once",
    "subtitle": "Power status for a whole rack at once",
    "commands": [
      {
        "id": "freeipmi-power",
        "desc": "Power status for a whole rack at once",
        "cmd": "ipmipower -h \"rack12-node[01-16]-bmc\" -u $BMC_USER -P --stat",
        "details": "",
        "flags": [
          [
            "-h \"prefix[01-16]\"",
            "Host range; quote it so the shell doesn't expand the brackets"
          ],
          [
            "--stat",
            "Read-only power status (USER privilege)"
          ],
          [
            "--on / --off / --cycle / --reset",
            "Power actions (change state; OPERATOR privilege)"
          ],
          [
            "--soft",
            "ACPI soft shutdown (changes state)"
          ],
          [
            "--on-if-off",
            "Power on instead of cycle/reset when the node is off"
          ],
          [
            "-F <n>",
            "Fan-out: hosts in parallel (default 64)"
          ]
        ],
        "tip": "Host ranges make rack-wide status checks one command",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "power",
          "ipmipower",
          "chassis",
          "hostrange",
          "rack"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmipower.8.en.html",
              "title": "FreeIPMI ipmipower(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-chassis.8.en.html",
              "title": "FreeIPMI ipmi-chassis(8)"
            }
          ],
          "note": "A host range with text after the brackets ([01-16]-bmc) is not shown in the man page; the fan-out default 64 is stated on the sibling tools' pages."
        }
      },
      {
        "id": "freeipmi-power-sub-1",
        "desc": "Power, last power event, intrusion",
        "cmd": "ipmi-chassis -h $BMC -u $BMC_USER -P --get-chassis-status",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "power",
          "ipmipower",
          "chassis"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-chassis.8.en.html",
              "title": "FreeIPMI ipmi-chassis(8)"
            }
          ],
          "note": "The man page does not list what the status shows (power, last event, intrusion)."
        }
      },
      {
        "id": "freeipmi-power-sub-2",
        "desc": "Clean OS shutdown (changes state)",
        "cmd": "ipmipower -h $BMC -u $BMC_USER -P --soft",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "power",
          "ipmipower",
          "chassis"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmipower.8.en.html",
              "title": "FreeIPMI ipmipower(8)"
            },
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-chassis.8.en.html",
              "title": "FreeIPMI ipmi-chassis(8)"
            }
          ],
          "note": "A host range with text after the brackets ([01-16]-bmc) is not shown in the man page; the fan-out default 64 is stated on the sibling tools' pages."
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-4",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Serial-over-LAN console",
    "subtitle": "Serial-over-LAN console",
    "commands": [
      {
        "id": "freeipmi-sol",
        "desc": "Serial-over-LAN console",
        "cmd": "ipmiconsole -h $BMC -u $BMC_USER -P",
        "details": "",
        "flags": [
          [
            "&.",
            "Disconnect (the escape character is &)"
          ],
          [
            "&?",
            "List the escape sequences"
          ],
          [
            "&B",
            "Send a serial break"
          ],
          [
            "-e <char>",
            "Change the escape character"
          ],
          [
            "--dont-steal",
            "Don't take over a session someone else has open (the default is to steal it)"
          ],
          [
            "--deactivate",
            "Close a stuck SOL session and exit"
          ],
          [
            "Cipher suites 3, 8, 12",
            "The only ones that encrypt console traffic"
          ]
        ],
        "tip": "Use --dont-steal on a node someone else may be working on",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "sol",
          "console",
          "serial",
          "ipmiconsole"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmiconsole.8.en.html",
              "title": "FreeIPMI ipmiconsole(8)"
            }
          ]
        }
      },
      {
        "id": "freeipmi-sol-sub-1",
        "desc": "Free a stuck SOL session",
        "cmd": "ipmiconsole -h $BMC -u $BMC_USER -P --deactivate",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "sol",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmiconsole.8.en.html",
              "title": "FreeIPMI ipmiconsole(8)"
            }
          ]
        }
      },
      {
        "id": "freeipmi-sol-sub-2",
        "desc": "Watch only if nobody else is attached",
        "cmd": "ipmiconsole -h $BMC -u $BMC_USER -P --dont-steal",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "sol",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmiconsole.8.en.html",
              "title": "FreeIPMI ipmiconsole(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-cmd-5",
    "badge": "freeipmi",
    "title": "GNU FreeIPMI: Power draw from the BMC",
    "subtitle": "Power draw from the BMC (DCMI)",
    "commands": [
      {
        "id": "freeipmi-dcmi",
        "desc": "Power draw from the BMC (DCMI)",
        "cmd": "ipmi-dcmi -h $BMC -u $BMC_USER -P --get-system-power-statistics",
        "details": "",
        "flags": [
          [
            "--get-system-power-statistics",
            "Current, min, max and average watts"
          ],
          [
            "--get-enhanced-system-power-statistics",
            "Averages over several periods"
          ],
          [
            "--get-power-limit",
            "The configured power cap"
          ],
          [
            "--set-power-limit",
            "Change the cap (changes state)"
          ]
        ],
        "tip": "A power cap can explain GPUs that never reach full clocks",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "dcmi",
          "power",
          "watts",
          "cap"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-dcmi.8.en.html",
              "title": "FreeIPMI ipmi-dcmi(8)"
            }
          ]
        }
      },
      {
        "id": "freeipmi-dcmi-sub-1",
        "desc": "Is a power cap active?",
        "cmd": "ipmi-dcmi -h $BMC -u $BMC_USER -P --get-power-limit",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "recipe",
          "dcmi",
          "power",
          "watts"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmi-dcmi.8.en.html",
              "title": "FreeIPMI ipmi-dcmi(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "freeipmi",
    "id": "freeipmi-pro-tips",
    "badge": "tip",
    "title": "GNU FreeIPMI: Pro Tip",
    "subtitle": "Credentials in a config file instead of on the command line",
    "commands": [
      {
        "id": "freeipmi-tips-card",
        "desc": "Credentials in a config file instead of on the command line",
        "cmd": "install -m 600 /dev/null /etc/freeipmi/freeipmi.conf",
        "details": "freeipmi.conf takes one option per line: username <user>, password <pass>, driver-type LAN_2_0, cipher-suite-id 3. Tool-specific keys such as ipmi-sel-password override the general ones. Keep the file mode 600, or point a tool at your own file with --config-file. Never commit it, and never paste it into a case.",
        "flags": [
          [
            "--config-file <file>",
            "Use another config file"
          ],
          [
            "Command line wins",
            "Options on the command line override the file"
          ]
        ],
        "tip": "Mode 600, and keep it out of git",
        "tags": [
          "bmc",
          "remote-management",
          "freeipmi",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-common/freeipmi.conf.5.en.html",
              "title": "FreeIPMI freeipmi.conf(5)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-cmd-1",
    "badge": "serial",
    "title": "Serial consoles: Open a USB serial console",
    "subtitle": "Open a USB serial console",
    "commands": [
      {
        "id": "serial-picocom",
        "desc": "Open a USB serial console",
        "cmd": "picocom -b 115200 /dev/ttyUSB0",
        "details": "",
        "flags": [
          [
            "-b 115200",
            "Baud rate: most servers and switches use 115200 or 9600"
          ],
          [
            "C-a C-x",
            "Exit and reset the port"
          ],
          [
            "C-a C-q",
            "Quit without resetting the port"
          ],
          [
            "C-a C-h",
            "Help: every C-a command"
          ],
          [
            "C-a C-\\",
            "Send a break"
          ],
          [
            "-g <file>",
            "Log the session to a file"
          ]
        ],
        "tip": "Use /dev/serial/by-id paths: ttyUSB numbers change on replug",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "serial",
          "picocom",
          "console",
          "usb",
          "tty"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/npat-efault/picocom/blob/master/picocom.1.md",
              "title": "picocom(1)"
            }
          ]
        }
      },
      {
        "id": "serial-picocom-sub-1",
        "desc": "Stable names for USB serial adapters",
        "cmd": "ls -l /dev/serial/by-id/",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ],
        "src": {
          "verified": "2026-11-11",
          "refs": [
            {
              "url": "https://github.com/systemd/systemd/blob/main/rules.d/60-serial.rules",
              "title": "systemd udev rules: 60-serial.rules (/dev/serial/by-id, by-path)"
            }
          ],
          "note": "systemd's 60-serial.rules creates /dev/serial/by-id/<bus>-<serial>-if<n> (and by-path) links for USB serial devices."
        }
      },
      {
        "id": "serial-picocom-sub-2",
        "desc": "Which ttyUSB the adapter just became",
        "cmd": "dmesg -T | grep -i tty",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ],
        "src": {
          "verified": "2026-11-11",
          "refs": [
            {
              "url": "https://github.com/torvalds/linux/blob/master/drivers/usb/serial/bus.c",
              "title": "Linux usb-serial bus.c (\"converter now attached to ttyUSB%d\")"
            }
          ],
          "note": "The usb-serial core logs \"<driver> converter now attached to ttyUSB<n>\" when an adapter binds; CDC-ACM adapters show up as ttyACM instead."
        }
      },
      {
        "id": "serial-picocom-sub-3",
        "desc": "Are you in the dialout (or uucp) group that owns the port?",
        "cmd": "id -nG",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "serial",
          "picocom",
          "console"
        ],
        "src": {
          "verified": "2026-11-11",
          "refs": [
            {
              "url": "https://salsa.debian.org/debian/base-passwd/-/blob/master/doc/users-and-groups.sgml",
              "title": "Debian base-passwd: users and groups (dialout)"
            },
            {
              "url": "https://wiki.archlinux.org/title/Users_and_groups",
              "title": "ArchWiki: Users and groups (uucp)"
            }
          ],
          "note": "Debian (and Ubuntu): dialout = \"full and direct access to serial ports\". Arch: uucp owns ttyS, ttyUSB and ttyACM. Log out and back in after adding the group."
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-cmd-2",
    "badge": "serial",
    "title": "Serial consoles: Share a serial port on the network with ser2net",
    "subtitle": "Share a serial port on the network with ser2net (YAML)",
    "commands": [
      {
        "id": "serial-ser2net",
        "desc": "Share a serial port on the network with ser2net (YAML)",
        "cmd": "connection: &rack12-sw1\n  accepter: telnet(rfc2217),tcp,3001\n  connector: serialdev,/dev/ttyUSB0,115200N81\n  options:\n    kickolduser: false\n    banner: \"rack12-sw1 console\\r\\n\"",
        "details": "",
        "flags": [
          [
            "/etc/ser2net/ser2net.yaml",
            "The YAML config path in the ser2net README (some distro packages put it elsewhere: check your package)"
          ],
          [
            "accepter",
            "What clients connect to: tcp,<port> or telnet(rfc2217),tcp,<port>"
          ],
          [
            "connector",
            "The device: serialdev,<path>,<baud><parity><bits><stop>"
          ],
          [
            "kickolduser",
            "true: a new user takes over from the old one"
          ],
          [
            "max-connections",
            "Default 1"
          ],
          [
            "*{file}",
            "YAML v1: insert a file's contents, so secrets stay out of the config"
          ]
        ],
        "tip": "Bind ser2net to a management VLAN only: it has no login by default",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "ser2net",
          "serial",
          "network",
          "yaml",
          "rfc2217"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/README.rst",
              "title": "ser2net README"
            },
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/ser2net.yaml.5",
              "title": "ser2net.yaml(5)"
            }
          ],
          "note": "kickolduser (default false), max-connections (default 1) and the *{filename} include (YAML version 1) checked in ser2net.yaml(5)."
        }
      },
      {
        "id": "serial-ser2net-sub-1",
        "desc": "Is it running?",
        "cmd": "systemctl status ser2net --no-pager",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "ser2net",
          "serial",
          "network"
        ],
        "src": {
          "verified": "2026-11-11",
          "refs": [
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/ser2net.service.in",
              "title": "ser2net: ser2net.service.in (upstream unit)"
            }
          ],
          "note": "Upstream ships ser2net.service (runs as user ser2net, group dialout); a distro package may rename it."
        }
      },
      {
        "id": "serial-ser2net-sub-2",
        "desc": "Connect (the README recommends gensiot over telnet)",
        "cmd": "gensiot telnet(rfc2217),tcp,localhost,3001",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "ser2net",
          "serial",
          "network"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/README.rst",
              "title": "ser2net README"
            },
            {
              "url": "https://github.com/cminyard/gensio",
              "title": "gensio / gensiot"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-cmd-3",
    "badge": "serial",
    "title": "Serial consoles: List and attach to logged consoles",
    "subtitle": "List and attach to logged consoles (conserver)",
    "commands": [
      {
        "id": "serial-conserver",
        "desc": "List and attach to logged consoles (conserver)",
        "cmd": "console -u",
        "details": "",
        "flags": [
          [
            "console -u",
            "Every console with state (up, down, init) and who is attached"
          ],
          [
            "console <name>",
            "Attach read-write"
          ],
          [
            "console -s <name>",
            "Spy: read-only"
          ],
          [
            "^Ec.",
            "Disconnect (Ctrl-E, c, period)"
          ],
          [
            "^Ec?",
            "List escape commands"
          ],
          [
            "^Ecr / ^Ecl0",
            "Replay recent output / send a break"
          ]
        ],
        "tip": "conserver logs every console, so the boot that crashed at 3 a.m. is in the log",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "conserver",
          "console",
          "serial",
          "logging"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/console.man.html",
              "title": "conserver console(1)"
            }
          ]
        }
      },
      {
        "id": "serial-conserver-sub-1",
        "desc": "Watch a console without typing into it",
        "cmd": "console -s rack12-node07",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "conserver",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/console.man.html",
              "title": "conserver console(1)"
            }
          ]
        }
      },
      {
        "id": "serial-conserver-sub-2",
        "desc": "Who is attached where",
        "cmd": "console -w",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "recipe",
          "conserver",
          "console",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/console.man.html",
              "title": "conserver console(1)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-cmd-4",
    "badge": "serial",
    "title": "Serial consoles: conserver console for an IPMI SOL target",
    "subtitle": "conserver console for an IPMI SOL target",
    "commands": [
      {
        "id": "serial-conserver-ipmi",
        "desc": "conserver console for an IPMI SOL target",
        "cmd": "console rack12-node07 {\n  master localhost;\n  type ipmi;\n  host rack12-node07-bmc.example.com;\n  username <bmc_user>;\n  rw *;\n}",
        "details": "",
        "flags": [
          [
            "type ipmi",
            "IPMI Serial-over-LAN through FreeIPMI"
          ],
          [
            "host / username / password",
            "BMC address and login. Keep the password in a root-only include, never in a shared copy"
          ],
          [
            "ipmiciphersuite / ipmiprivlevel",
            "Cipher suite and privilege (default admin)"
          ],
          [
            "type device + device + baud",
            "A local serial port instead"
          ]
        ],
        "tip": "chmod 600 conserver.cf when it holds BMC passwords",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "conserver",
          "ipmi",
          "sol",
          "config"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.conserver.com/docs/conserver.cf.man.html",
              "title": "conserver.cf(5)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "serial-console",
    "id": "serial-pro-tips",
    "badge": "tip",
    "title": "Serial consoles: Pro Tip",
    "subtitle": "Pick the console path by situation",
    "commands": [
      {
        "id": "serial-tips-card",
        "desc": "Pick the console path by situation",
        "cmd": "ipmiconsole -h $BMC -u $BMC_USER -P --dont-steal",
        "details": "OS hung but BMC alive → SOL (ipmiconsole, ipmitool sol activate, or the conserver entry). BMC unreachable or a switch with no network → USB serial and picocom. Console that several people need, or one you want logged → ser2net or conserver.",
        "flags": [
          [
            "SOL",
            "Through the BMC network"
          ],
          [
            "USB serial",
            "When the network is the problem"
          ]
        ],
        "tip": "Log every console session to the case folder",
        "tags": [
          "bmc",
          "remote-management",
          "serial",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-10",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/freeipmi-tools/ipmiconsole.8.en.html",
              "title": "FreeIPMI ipmiconsole(8)"
            },
            {
              "url": "https://github.com/npat-efault/picocom/blob/master/picocom.1.md",
              "title": "picocom(1)"
            },
            {
              "url": "https://github.com/cminyard/ser2net/blob/master/README.rst",
              "title": "ser2net README"
            },
            {
              "url": "https://www.conserver.com/docs/conserver.cf.man.html",
              "title": "conserver.cf(5)"
            }
          ]
        }
      }
    ]
  }
];

// Application State
// One page for the whole group: the old per-topic pages are parts of it (#part in the URL).
// Stars, visited ticks and practice from those pages move here once, before the stars are read.
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("bmc-tools.html", "bmc-tools_bookmarks", BMC_HUB_DATA, {"freeipmi":"freeipmi_bookmarks","serial-console":"serial-console_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("bmc-tools_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(BMC_HUB_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: BMC_HUB_DATA, label: "BMC vendor tools sheets", parts: {
   "freeipmi": {
    "title": "GNU FreeIPMI",
    "subtitle": "The vendor-neutral IPMI toolkit: password prompt instead of -p, host ranges for whole racks, and readable SEL output",
    "pill": "FreeIPMI 1.6.20"
   },
   "serial-console": {
    "title": "Serial consoles",
    "subtitle": "Talk to a switch or server console over USB serial, share it on the network with ser2net, and log every console with conserver",
    "pill": "ser2net 4.6.8 · conserver 8.3.0"
   },
  } };


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
  // One toast for the whole site: common.js keeps a placeholder warning from being replaced.
  if (window.showGlobalToast) return window.showGlobalToast(msg);
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

// Command Syntax Highlighting
function highlightCommand(raw) {
  const escaped = raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped.replace(
    /(^|\s|;|&&|\|\||\|)(sudo\s+)?([a-zA-Z0-9_.-]+)|('[^']*'|"[^"]*")|(\s--?[a-zA-Z0-9_-]+(?:=[a-zA-Z0-9_.,*/:-]+)?)|(\|\||&&|\|)/g,
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
  const allCards = BMC_HUB_DATA;
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

  for (const card of BMC_HUB_DATA) {
    if (((state.activeCategory !== "all" && state.activeCategory !== card.id) || (state.part && (card.part || card.id) !== state.part))) {
      continue;
    }

    const searchTerms = state.searchQuery
      .trim()
      .toLowerCase()
      .split(/\s+/)
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

      const codeBoxHtml = cmd.diagram
        ? window.CheatSheetCommon.renderDiagram(cmd.diagram)
        : cmd.hideCode ? "" : [
        '  <div class="cmd-code-box" data-cmd="' + escapeHtml(copyTarget) + '" title="Click to copy command">',
        '    <pre class="cmd-code"><code>' + highlightCommand(cmd.cmd) + '</code></pre>',
        '    <span class="copy-hint">Copy</span>',
        '  </div>'
      ].join("\n");

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
        '  ' + codeBoxHtml,
        '  ' + detailsHtml,
        '  ' + flagsHtml,
        '  ' + tipHtml,
        '</div>'
      ].join("\n");
    }).join("\n");

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
    ].join("\n"));
  }

  sectionsContainer.innerHTML = cardsHtml.join("\n");
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
        localStorage.setItem("bmc-tools_bookmarks", JSON.stringify([...state.bookmarks]));
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
