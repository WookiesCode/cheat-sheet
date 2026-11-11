// hw-reference.js
// Standalone interactive cheat sheet for Rack & hardware reference: Rack & Hardware Reference Hub (power, cooling, memory, drives, GPUs, racks)
const HWREF_HUB_DATA = [
  {
    "part": "hw-power",
    "id": "power-cmd-1",
    "badge": "power",
    "title": "Power & PDUs: Real power draw from the BMC",
    "subtitle": "Real power draw from the BMC (DCMI)",
    "commands": [
      {
        "id": "power-read-bmc",
        "desc": "Real power draw from the BMC (DCMI)",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E dcmi power reading",
        "details": "",
        "flags": [
          [
            "-E",
            "Password from the IPMI_PASSWORD environment variable, not the command line"
          ],
          [
            "Instantaneous / Minimum / Maximum / Average",
            "Watts over the BMC's sampling period"
          ],
          [
            "No DCMI?",
            "Read the PSU input-power sensors instead (next card)"
          ],
          [
            "Budget with the maximum",
            "Size circuits from the peak, not the average"
          ]
        ],
        "tip": "Measure under real load; idle numbers hide the GPU peak",
        "tags": [
          "hardware",
          "reference",
          "power",
          "power",
          "dcmi",
          "watts",
          "psu",
          "budget"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "ipmitool -E reads IPMI_PASSWORD (or IPMITOOL_PASSWORD, which wins). --query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      },
      {
        "id": "power-read-bmc-sub-1",
        "desc": "PSU presence, failures and redundancy",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type \"Power Supply\"",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "power",
          "dcmi",
          "watts"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "ipmitool -E reads IPMI_PASSWORD (or IPMITOOL_PASSWORD, which wins). --query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      },
      {
        "id": "power-read-bmc-sub-2",
        "desc": "Is a power cap set?",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E dcmi power get_limit",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "power",
          "dcmi",
          "watts"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "ipmitool -E reads IPMI_PASSWORD (or IPMITOOL_PASSWORD, which wins). --query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      },
      {
        "id": "power-read-bmc-sub-3",
        "desc": "Per-GPU draw against its limit",
        "cmd": "nvidia-smi --query-gpu=index,power.draw,power.limit --format=csv",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "power",
          "dcmi",
          "watts"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "ipmitool -E reads IPMI_PASSWORD (or IPMITOOL_PASSWORD, which wins). --query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      }
    ]
  },
  {
    "part": "hw-power",
    "id": "power-cmd-2",
    "badge": "power",
    "title": "Power & PDUs: Cord and inlet ratings",
    "subtitle": "Cord and inlet ratings (IEC 60320)",
    "commands": [
      {
        "id": "power-cords",
        "desc": "Cord and inlet ratings (IEC 60320)",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E fru print | grep -iE 'power|psu'",
        "details": "",
        "flags": [
          [
            "C13 / C14",
            "10 A (IEC) / 15 A (UL). The usual server and switch PSU inlet"
          ],
          [
            "C19 / C20",
            "16 A (IEC) / 20 A (UL, with 12 AWG cord). High-power PSUs and PDU outlets"
          ],
          [
            "C14 vs C13",
            "C14 is the inlet (pins, on the PSU); C13 is the cord end"
          ],
          [
            "Mixed cords",
            "A C13 cord on a C14-to-C19 adapter is still limited to the C13 rating"
          ],
          [
            "GPU nodes",
            "Multi-kW PSUs are usually C19/C20, or busbar-fed in OCP racks"
          ]
        ],
        "tip": "Read the PSU label: input current and connector are printed on it",
        "tags": [
          "hardware",
          "reference",
          "power",
          "c13",
          "c19",
          "iec60320",
          "cord",
          "inlet"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://en.wikipedia.org/wiki/IEC_60320",
              "title": "IEC 60320 (Wikipedia)"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_fru.c",
              "title": "ipmitool source: fru print [fru id]"
            }
          ],
          "note": "Ratings from Wikipedia's summary of IEC 60320 and UL/CSA 60320-1, not the standard itself. Which FRU fields mention power is vendor-specific."
        }
      }
    ]
  },
  {
    "part": "hw-power",
    "id": "power-cmd-3",
    "badge": "power",
    "title": "Power & PDUs: Circuit math",
    "subtitle": "Circuit math: the 80% rule and three-phase power",
    "commands": [
      {
        "id": "power-circuit",
        "desc": "Circuit math: the 80% rule and three-phase power",
        "cmd": "awk 'BEGIN{v=415; a=32; pf=0.95; kw=sqrt(3)*v*a*pf/1000; printf \"%.1f kW total, %.1f kW usable at 80%%\\n\", kw, kw*0.8}'",
        "details": "",
        "flags": [
          [
            "NEC 210.20(A)",
            "A continuous load (3 hours or more) needs a breaker rated 125% of it, so load circuits to 80%"
          ],
          [
            "Single-phase",
            "kW = V × A × PF / 1000"
          ],
          [
            "Three-phase",
            "kW = √3 × V(line-to-line) × A × PF / 1000; kVA is the same without PF"
          ],
          [
            "PF",
            "Power factor: about 0.95-0.99 for modern server PSUs"
          ],
          [
            "100%-rated breakers",
            "An exception exists only when the whole assembly is listed for 100%"
          ]
        ],
        "tip": "Change v and a to your PDU's rating and predict the result before you run it",
        "tags": [
          "hardware",
          "reference",
          "power",
          "nec",
          "80-percent",
          "three-phase",
          "kw",
          "circuit",
          "pdu"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "NEC 210.20(A) (NFPA 70) is not freely readable, so the 125 % / 80 % rule and the 100 %-rated exception are not checked here. The kW formulas are standard electrical math."
        }
      },
      {
        "id": "power-circuit-sub-1",
        "desc": "Single-phase 208 V / 30 A circuit",
        "cmd": "awk 'BEGIN{v=208; a=30; printf \"%.1f kW at 80%%\\n\", v*a*0.8/1000}'",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "nec",
          "80-percent",
          "three-phase"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "NEC 210.20(A) (NFPA 70) is not freely readable, so the 125 % / 80 % rule and the 100 %-rated exception are not checked here. The kW formulas are standard electrical math."
        }
      }
    ]
  },
  {
    "part": "hw-power",
    "id": "power-cmd-4",
    "badge": "power",
    "title": "Power & PDUs: PSU redundancy and A/B feeds",
    "subtitle": "PSU redundancy and A/B feeds",
    "commands": [
      {
        "id": "power-redundancy",
        "desc": "PSU redundancy and A/B feeds",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sel elist | grep -iE 'power supply|redundancy|ac lost'",
        "details": "",
        "flags": [
          [
            "A/B feeds",
            "Each PSU on a different PDU fed from a different upstream source"
          ],
          [
            "N+1 / N+N",
            "Spare PSU / a full second set; N+N survives losing a whole feed"
          ],
          [
            "Budget per feed",
            "With N+N, one feed must carry the whole node: size each PDU for it"
          ],
          [
            "AC lost",
            "One PSU reporting AC lost: cord, PDU outlet or breaker first, PSU last"
          ]
        ],
        "tip": "Swap the cord to a known-good outlet before you RMA a PSU",
        "tags": [
          "hardware",
          "reference",
          "power",
          "redundancy",
          "psu",
          "ab-feed",
          "pdu",
          "ac-lost"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            }
          ],
          "note": "SEL wording for PSU events (AC lost, redundancy) varies by vendor."
        }
      },
      {
        "id": "power-redundancy-sub-1",
        "desc": "Which PSU is unhappy",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type \"Power Supply\"",
        "tags": [
          "hardware",
          "reference",
          "power",
          "recipe",
          "redundancy",
          "psu",
          "ab-feed"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            }
          ],
          "note": "SEL wording for PSU events (AC lost, redundancy) varies by vendor."
        }
      }
    ]
  },
  {
    "part": "hw-power",
    "id": "power-pro-tips",
    "badge": "tip",
    "title": "Power & PDUs: Pro Tip",
    "subtitle": "GPU power at the card: the 12V-2x6 connector",
    "commands": [
      {
        "id": "power-tips-card",
        "desc": "GPU power at the card: the 12V-2x6 connector",
        "cmd": "nvidia-smi -q -d POWER",
        "details": "PCIe GPUs such as H200 NVL (up to 600 W) are fed by the 16-pin 12V-2x6 connector (PCIe CEM 5.1, the revision that replaced 12VHPWR), rated up to 600 W. Its sense pins only make contact when the power pins are fully seated. A half-seated plug is a melting risk: push until it clicks and check that no gap shows. SXM GPUs (H200 SXM up to 700 W) are fed through the HGX baseboard.",
        "flags": [
          [
            "Power Limit / Max Power Limit",
            "What the GPU may draw"
          ],
          [
            "Clocks Event Reasons",
            "Shows when power capping slows the GPU"
          ]
        ],
        "tip": "Reseat 12V-2x6 plugs fully before blaming the GPU",
        "tags": [
          "hardware",
          "reference",
          "power",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/h200/",
              "title": "NVIDIA H200"
            },
            {
              "url": "https://en.wikipedia.org/wiki/12VHPWR",
              "title": "12VHPWR / 12V-2x6 (Wikipedia)"
            }
          ],
          "note": "Wikipedia gives 12V-2x6 as 525 W or 600 W depending on the sense pins."
        }
      }
    ]
  },
  {
    "part": "hw-cooling",
    "id": "cooling-cmd-1",
    "badge": "cooling",
    "title": "Cooling: Inlet and component temperatures from the BMC",
    "subtitle": "Inlet and component temperatures from the BMC",
    "commands": [
      {
        "id": "cooling-inlet",
        "desc": "Inlet and component temperatures from the BMC",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type Temperature",
        "details": "",
        "flags": [
          [
            "Inlet / Ambient",
            "The air entering the server: compare it with ASHRAE"
          ],
          [
            "Recommended 18-27 °C",
            "ASHRAE recommended inlet range, classes A1-A4"
          ],
          [
            "A1 allowable 15-32 °C",
            "Wider range the hardware tolerates; A2-A4 allow more"
          ],
          [
            "Exhaust",
            "Usually 10-20 °C above inlet; a small difference with high fan speed points to blocked airflow"
          ]
        ],
        "tip": "One hot node in a cold row is a node problem; a whole hot rack is a room problem",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "temperature",
          "inlet",
          "ashrae",
          "sensors",
          "airflow"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://manpages.debian.org/trixie/lm-sensors/sensors.1.en.html",
              "title": "sensors(1)"
            }
          ],
          "note": "The ASHRAE TC 9.9 ranges (recommended 18-27 °C, A1 allowable 15-32 °C) could not be checked: ASHRAE's reference card is not freely fetchable. The exhaust delta is a rule of thumb."
        }
      },
      {
        "id": "cooling-inlet-sub-1",
        "desc": "Fan speeds and failed fans",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type Fan",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "recipe",
          "temperature",
          "inlet",
          "ashrae"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://manpages.debian.org/trixie/lm-sensors/sensors.1.en.html",
              "title": "sensors(1)"
            }
          ],
          "note": "The ASHRAE TC 9.9 ranges (recommended 18-27 °C, A1 allowable 15-32 °C) could not be checked: ASHRAE's reference card is not freely fetchable. The exhaust delta is a rule of thumb."
        }
      },
      {
        "id": "cooling-inlet-sub-2",
        "desc": "On the host: CPU and board temperatures (lm-sensors)",
        "cmd": "sensors",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "recipe",
          "temperature",
          "inlet",
          "ashrae"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_sdr.c",
              "title": "ipmitool source: sensor type names"
            },
            {
              "url": "https://manpages.debian.org/trixie/lm-sensors/sensors.1.en.html",
              "title": "sensors(1)"
            }
          ],
          "note": "The ASHRAE TC 9.9 ranges (recommended 18-27 °C, A1 allowable 15-32 °C) could not be checked: ASHRAE's reference card is not freely fetchable. The exhaust delta is a rule of thumb."
        }
      }
    ]
  },
  {
    "part": "hw-cooling",
    "id": "cooling-cmd-2",
    "badge": "cooling",
    "title": "Cooling: GPU temperatures and thermal slowdown",
    "subtitle": "GPU temperatures and thermal slowdown",
    "commands": [
      {
        "id": "cooling-gpu",
        "desc": "GPU temperatures and thermal slowdown",
        "cmd": "nvidia-smi --query-gpu=index,temperature.gpu,temperature.memory,power.draw,clocks_event_reasons.active --format=csv",
        "details": "",
        "flags": [
          [
            "temperature.gpu / temperature.memory",
            "Core and HBM temperatures"
          ],
          [
            "clocks_event_reasons.active",
            "Non-zero bits show why clocks dropped (thermal or power)"
          ],
          [
            "nvidia-smi -q -d TEMPERATURE",
            "Slowdown and shutdown thresholds for this GPU"
          ],
          [
            "One GPU hot",
            "Check its slot: airflow, blank panels, cold plate or fan module"
          ]
        ],
        "tip": "Compare the hot GPU with its neighbours in the same chassis",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "gpu",
          "temperature",
          "throttle",
          "hbm",
          "thermal"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "--query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      },
      {
        "id": "cooling-gpu-sub-1",
        "desc": "Thresholds per GPU",
        "cmd": "nvidia-smi -q -d TEMPERATURE",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "recipe",
          "gpu",
          "temperature",
          "throttle"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "--query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      },
      {
        "id": "cooling-gpu-sub-2",
        "desc": "Clock event reasons in words",
        "cmd": "nvidia-smi -q -d PERFORMANCE",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "recipe",
          "gpu",
          "temperature",
          "throttle"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ],
          "note": "--query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page."
        }
      }
    ]
  },
  {
    "part": "hw-cooling",
    "id": "cooling-cmd-3",
    "badge": "cooling",
    "title": "Cooling: Airflow checklist",
    "subtitle": "Airflow checklist (physical)",
    "commands": [
      {
        "id": "cooling-airflow",
        "desc": "Airflow checklist (physical)",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sel elist | grep -iE 'fan|temp'",
        "details": "",
        "flags": [
          [
            "Blanking panels",
            "Every empty U in the rack, or hot exhaust loops back to the front"
          ],
          [
            "Front-to-back",
            "All gear in a row pointing the same way (switches can be reversed)"
          ],
          [
            "Cable bundles",
            "Behind the fans, they choke exhaust"
          ],
          [
            "Fan module",
            "Reseat a fan that reads 0 RPM before replacing it"
          ],
          [
            "Hot aisle / cold aisle",
            "Containment doors closed"
          ]
        ],
        "tip": "Fix airflow before you change fan settings",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "airflow",
          "fans",
          "blanking",
          "physical"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            }
          ],
          "note": "The checklist is field practice, not from a standard."
        }
      }
    ]
  },
  {
    "part": "hw-cooling",
    "id": "cooling-cmd-4",
    "badge": "cooling",
    "title": "Cooling: Liquid cooling",
    "subtitle": "Liquid cooling: ASHRAE W classes",
    "commands": [
      {
        "id": "cooling-liquid",
        "desc": "Liquid cooling: ASHRAE W classes",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr elist | grep -iE 'coolant|leak|flow|pump'",
        "details": "",
        "flags": [
          [
            "W17 / W27 / W32 / W40 / W45",
            "Facility supply-water temperature limits in °C (ASHRAE 5th ed., 2021)"
          ],
          [
            "W+",
            "Supply water above 45 °C"
          ],
          [
            "Rack-scale liquid",
            "GB200 / GB300 NVL72 racks are liquid-cooled"
          ],
          [
            "Leak sensors",
            "Treat any leak event as critical: stop and escalate"
          ],
          [
            "Sensor names",
            "Coolant, flow and leak sensors are vendor-specific: grep broadly"
          ]
        ],
        "tip": "Never open a liquid loop without the facility team",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "liquid",
          "w-class",
          "coolant",
          "leak",
          "nvl72"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
              "title": "NVIDIA GB200 NVL72"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/gb300-nvl72/",
              "title": "NVIDIA GB300 NVL72"
            }
          ],
          "note": "The ASHRAE W classes (W17-W45, W+) could not be checked: ASHRAE's pages refuse automated fetches."
        }
      }
    ]
  },
  {
    "part": "hw-cooling",
    "id": "cooling-pro-tips",
    "badge": "tip",
    "title": "Cooling: Pro Tip",
    "subtitle": "Room vs node: a quick test",
    "commands": [
      {
        "id": "cooling-tips-card",
        "desc": "Room vs node: a quick test",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E sdr type Temperature | grep -i inlet",
        "details": "Read the inlet sensor on the hot node and on two neighbours above and below it. Same inlet everywhere and only one node hot → that node (fans, heatsink, cold plate). Inlet high on all of them → the room or the rack (blanking, containment, CRAH). Put the numbers in the case.",
        "flags": [
          [
            "Neighbours",
            "Same rack, nodes above and below"
          ],
          [
            "Record",
            "Time, inlet, exhaust, fan RPM"
          ]
        ],
        "tip": "Numbers from neighbours settle the argument quickly",
        "tags": [
          "hardware",
          "reference",
          "cooling",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "hw-memory",
    "id": "memory-cmd-1",
    "badge": "memory",
    "title": "Memory population: Every DIMM slot",
    "subtitle": "Every DIMM slot: populated, size, speed, part and serial",
    "commands": [
      {
        "id": "mem-dmidecode",
        "desc": "Every DIMM slot: populated, size, speed, part and serial",
        "cmd": "dmidecode -t memory | grep -E 'Locator|Size|Speed|Part Number|Serial Number'",
        "details": "",
        "flags": [
          [
            "Locator",
            "The silkscreen slot name, for example DIMM_A1: the physical slot to pull"
          ],
          [
            "Bank Locator",
            "Socket / channel as the BIOS sees it"
          ],
          [
            "Speed vs Configured Memory Speed",
            "What the DIMM supports vs what it runs at now"
          ],
          [
            "Size: No Module Installed",
            "An empty slot"
          ],
          [
            "Serial Number",
            "Goes in the RMA"
          ]
        ],
        "tip": "Compare installed DIMMs with the order: a missing DIMM shows as an empty Locator",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "dimm",
          "dmidecode",
          "locator",
          "serial",
          "memory"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lsmem.1.html",
              "title": "lsmem(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ]
        }
      },
      {
        "id": "mem-dmidecode-sub-1",
        "desc": "How many DIMMs are installed",
        "cmd": "dmidecode -t memory | grep -c 'Size: [0-9]'",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "dimm",
          "dmidecode",
          "locator"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lsmem.1.html",
              "title": "lsmem(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ]
        }
      },
      {
        "id": "mem-dmidecode-sub-2",
        "desc": "Total online memory as Linux sees it",
        "cmd": "lsmem --summary",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "dimm",
          "dmidecode",
          "locator"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lsmem.1.html",
              "title": "lsmem(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ]
        }
      },
      {
        "id": "mem-dmidecode-sub-3",
        "desc": "Memory per NUMA node: unequal nodes mean unbalanced DIMMs",
        "cmd": "numactl --hardware",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "dimm",
          "dmidecode",
          "locator"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man1/lsmem.1.html",
              "title": "lsmem(1)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "hw-memory",
    "id": "memory-cmd-2",
    "badge": "memory",
    "title": "Memory population: Channels per socket on current CPUs",
    "subtitle": "Channels per socket on current CPUs",
    "commands": [
      {
        "id": "mem-channels",
        "desc": "Channels per socket on current CPUs",
        "cmd": "lscpu | grep -E 'Model name|Socket|NUMA node\\(s\\)'",
        "details": "",
        "flags": [
          [
            "AMD EPYC 9005",
            "12 DDR5 channels per socket, RDIMM up to 6400 MT/s, up to 2 DIMMs per channel (24 per socket)"
          ],
          [
            "Intel Xeon 6900P",
            "12 channels, DDR5-6400 at 1 DPC (5200 at 2 DPC), MRDIMM up to 8800 MT/s"
          ],
          [
            "Intel Xeon 6700P",
            "8 channels, DDR5-6400 at 1 DPC (5200 at 2 DPC), MRDIMM up to 8000 MT/s on some SKUs"
          ],
          [
            "Highest common speed",
            "The system runs every DIMM at the speed the slowest DIMM and the layout allow"
          ],
          [
            "2 DPC",
            "Two DIMMs per channel usually lowers the speed; check the server's memory guide"
          ]
        ],
        "tip": "One DIMM per channel on every channel is usually the fastest layout",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "channels",
          "dpc",
          "epyc",
          "xeon",
          "ddr5",
          "mrdimm"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man1/lscpu.1.html",
              "title": "lscpu(1)"
            },
            {
              "url": "https://en.wikipedia.org/wiki/Granite_Rapids",
              "title": "Granite Rapids (Wikipedia, Xeon 6900P/6700P)"
            }
          ],
          "note": "Corrected 2026-11-09: Xeon 6 DDR5-6400 is at 1 DPC (5200 at 2 DPC). The AMD EPYC 9005 figures and the 'highest common speed' rule could not be checked (AMD, Kingston and HPE pages refused or timed out); use your server's memory population guide."
        }
      }
    ]
  },
  {
    "part": "hw-memory",
    "id": "memory-cmd-3",
    "badge": "memory",
    "title": "Memory population: Balanced population check",
    "subtitle": "Balanced population check",
    "commands": [
      {
        "id": "mem-balance",
        "desc": "Balanced population check",
        "cmd": "dmidecode -t memory | awk -F: '/Size:/{s=$2} /Bank Locator/{print $2 \" ->\" s}' | sort",
        "details": "",
        "flags": [
          [
            "Balanced",
            "Same number and size of DIMMs on every channel and both sockets"
          ],
          [
            "Unbalanced",
            "Works, but bandwidth drops and one NUMA node has less memory"
          ],
          [
            "Mixed part numbers",
            "Avoid: the system falls back to the slowest common timing"
          ],
          [
            "After a swap",
            "Replacement DIMM: same part number, same slot"
          ]
        ],
        "tip": "Check balance after every DIMM replacement",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "balance",
          "numa",
          "population",
          "dimm"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ],
          "note": "Balance guidance is general; the server vendor's population guide is the authority."
        }
      },
      {
        "id": "mem-balance-sub-1",
        "desc": "Memory per NUMA node",
        "cmd": "numactl --hardware | grep size",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "balance",
          "numa",
          "population"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/numactl.8.html",
              "title": "numactl(8)"
            }
          ],
          "note": "Balance guidance is general; the server vendor's population guide is the authority."
        }
      }
    ]
  },
  {
    "part": "hw-memory",
    "id": "memory-cmd-4",
    "badge": "memory",
    "title": "Memory population: Correctable errors per DIMM",
    "subtitle": "Correctable errors per DIMM",
    "commands": [
      {
        "id": "mem-errors",
        "desc": "Correctable errors per DIMM",
        "cmd": "edac-util -v",
        "details": "",
        "flags": [
          [
            "CE",
            "Correctable errors: count them over time"
          ],
          [
            "UE",
            "Uncorrectable errors: the DIMM (or slot) goes on the RMA"
          ],
          [
            "Map to slot",
            "Match the EDAC row/channel to the dmidecode Locator"
          ],
          [
            "BMC SEL",
            "Also check ipmitool sel elist for memory events"
          ]
        ],
        "tip": "The ECC sheet under Server internals goes deeper",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "ecc",
          "edac",
          "errors",
          "rma"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/edac-utils/edac-util.1.en.html",
              "title": "edac-util(1)"
            },
            {
              "url": "https://www.kernel.org/doc/Documentation/ABI/testing/sysfs-devices-edac",
              "title": "Kernel ABI: sysfs-devices-edac"
            }
          ],
          "note": "edac-util reads world-readable sysfs counters, so it doesn't need root (the old sudo was dropped)."
        }
      },
      {
        "id": "mem-errors-sub-1",
        "desc": "EDAC's slot labels",
        "cmd": "grep -r . /sys/devices/system/edac/mc/mc*/dimm*/dimm_label 2>/dev/null",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "recipe",
          "ecc",
          "edac",
          "errors"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/edac-utils/edac-util.1.en.html",
              "title": "edac-util(1)"
            },
            {
              "url": "https://www.kernel.org/doc/Documentation/ABI/testing/sysfs-devices-edac",
              "title": "Kernel ABI: sysfs-devices-edac"
            }
          ],
          "note": "edac-util reads world-readable sysfs counters, so it doesn't need root (the old sudo was dropped)."
        }
      }
    ]
  },
  {
    "part": "hw-memory",
    "id": "memory-pro-tips",
    "badge": "tip",
    "title": "Memory population: Pro Tip",
    "subtitle": "Before you reseat or swap a DIMM",
    "commands": [
      {
        "id": "memory-tips-card",
        "desc": "Before you reseat or swap a DIMM",
        "cmd": "dmidecode -t memory > dimms-before.txt",
        "details": "Save the DIMM table, note the slot from the Locator (not the Linux row number), drain the node and get approval to power off. After the swap, save dimms-after.txt and diff: same count, same Configured Memory Speed, and the new serial in the right slot.",
        "flags": [
          [
            "diff dimms-before.txt dimms-after.txt",
            "Proves the swap"
          ],
          [
            "Locator",
            "Physical slot name"
          ]
        ],
        "tip": "Before/after files go in the case folder",
        "tags": [
          "hardware",
          "reference",
          "memory",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "hw-drives",
    "id": "drives-cmd-1",
    "badge": "drives",
    "title": "Drive form factors: Which drives, which transport, which model",
    "subtitle": "Which drives, which transport, which model",
    "commands": [
      {
        "id": "drives-identify",
        "desc": "Which drives, which transport, which model",
        "cmd": "lsblk -d -o NAME,TRAN,MODEL,SIZE,SERIAL",
        "details": "",
        "flags": [
          [
            "TRAN nvme / sas / sata",
            "The protocol the drive is using"
          ],
          [
            "nvme list",
            "NVMe drives with model, serial and firmware"
          ],
          [
            "SERIAL",
            "Match it to the bay label and the RMA"
          ]
        ],
        "tip": "Map serial → bay before you pull anything",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "nvme",
          "lsblk",
          "serial",
          "identify"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man8/lsblk.8.html",
              "title": "lsblk(8)"
            },
            {
              "url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-list.txt",
              "title": "nvme-cli: nvme list"
            },
            {
              "url": "https://manpages.debian.org/trixie/smartmontools/smartctl.8.en.html",
              "title": "smartctl(8)"
            }
          ],
          "note": "smartctl -i shows model, serial and firmware; form factor and rotation rate appear only when the drive reports them."
        }
      },
      {
        "id": "drives-identify-sub-1",
        "desc": "NVMe inventory",
        "cmd": "nvme list",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "recipe",
          "nvme",
          "lsblk",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man8/lsblk.8.html",
              "title": "lsblk(8)"
            },
            {
              "url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-list.txt",
              "title": "nvme-cli: nvme list"
            },
            {
              "url": "https://manpages.debian.org/trixie/smartmontools/smartctl.8.en.html",
              "title": "smartctl(8)"
            }
          ],
          "note": "smartctl -i shows model, serial and firmware; form factor and rotation rate appear only when the drive reports them."
        }
      },
      {
        "id": "drives-identify-sub-2",
        "desc": "Model, form factor and rotation rate for SAS/SATA",
        "cmd": "smartctl -i /dev/sda",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "recipe",
          "nvme",
          "lsblk",
          "serial"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://man7.org/linux/man-pages/man8/lsblk.8.html",
              "title": "lsblk(8)"
            },
            {
              "url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-list.txt",
              "title": "nvme-cli: nvme list"
            },
            {
              "url": "https://manpages.debian.org/trixie/smartmontools/smartctl.8.en.html",
              "title": "smartctl(8)"
            }
          ],
          "note": "smartctl -i shows model, serial and firmware; form factor and rotation rate appear only when the drive reports them."
        }
      }
    ]
  },
  {
    "part": "hw-drives",
    "id": "drives-cmd-2",
    "badge": "drives",
    "title": "Drive form factors: U.2 vs U.3",
    "subtitle": "U.2 vs U.3 (same connector, different wiring)",
    "commands": [
      {
        "id": "drives-u2u3",
        "desc": "U.2 vs U.3 (same connector, different wiring)",
        "cmd": "lspci -vv -s <bdf> | grep -E 'LnkCap|LnkSta'",
        "details": "",
        "flags": [
          [
            "U.2",
            "2.5\" NVMe on the SFF-8639 connector"
          ],
          [
            "U.3",
            "SFF-TA-1001 (2017): tri-mode bays, one controller for NVMe, SAS and SATA"
          ],
          [
            "U.3 drive in a U.2 bay",
            "Works: U.3 drives must be backward-compatible with U.2 hosts"
          ],
          [
            "U.2 drive in a U.3 host",
            "Not compatible: U.3 moved the PCIe lanes"
          ],
          [
            "Same plug ≠ works",
            "The backplane and controller must support the protocol too"
          ]
        ],
        "tip": "Check the backplane's spec before ordering spares",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "u.2",
          "u.3",
          "sff-8639",
          "tri-mode",
          "backplane"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://en.wikipedia.org/wiki/U.2",
              "title": "U.2 / U.3 (Wikipedia)"
            },
            {
              "url": "https://www.snia.org/technology-communities/sff/specifications?items_per_page=All",
              "title": "SNIA SFF specifications (SFF-TA-1001)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/lspci.8.html",
              "title": "lspci(8)"
            }
          ],
          "note": "SNIA lists SFF-TA-1001 as the Universal x4 Link Definition for SFF-8639 (1.1, 2018); the U.2/U.3 compatibility rule is from Wikipedia's summary."
        }
      },
      {
        "id": "drives-u2u3-sub-1",
        "desc": "Which controller and path each NVMe drive is on",
        "cmd": "nvme list -v",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "recipe",
          "u.2",
          "u.3",
          "sff-8639"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://en.wikipedia.org/wiki/U.2",
              "title": "U.2 / U.3 (Wikipedia)"
            },
            {
              "url": "https://www.snia.org/technology-communities/sff/specifications?items_per_page=All",
              "title": "SNIA SFF specifications (SFF-TA-1001)"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/lspci.8.html",
              "title": "lspci(8)"
            }
          ],
          "note": "SNIA lists SFF-TA-1001 as the Universal x4 Link Definition for SFF-8639 (1.1, 2018); the U.2/U.3 compatibility rule is from Wikipedia's summary."
        }
      }
    ]
  },
  {
    "part": "hw-drives",
    "id": "drives-cmd-3",
    "badge": "drives",
    "title": "Drive form factors: EDSFF sizes",
    "subtitle": "EDSFF sizes (SNIA)",
    "commands": [
      {
        "id": "drives-edsff",
        "desc": "EDSFF sizes (SNIA)",
        "cmd": "nvme id-ctrl /dev/nvme0 | grep -E '^(mn|sn|fr) '",
        "details": "",
        "flags": [
          [
            "E1.S",
            "SFF-TA-1006. 31.5-33.75 mm wide, about 111-119 mm long, thickness 5.9, 8.01, 9.5, 15 or 25 mm. Up to 20 W and x8 in the 9.5 mm symmetric enclosure"
          ],
          [
            "E1.L",
            "SFF-TA-1007. 38.4 mm × 318.75 mm, 9.5 or 18 mm thick: long ruler for density"
          ],
          [
            "E3.S / E3.L",
            "SFF-TA-1008. 76 mm tall, 112.75 mm (S) or 142.2 mm (L) long, 7.5 mm or 16.8 mm (2T). Up to 70 W"
          ],
          [
            "Connector",
            "SFF-TA-1002 edge connector across the family"
          ],
          [
            "Thickness matters",
            "A 15 mm E1.S does not fit a 9.5 mm bay"
          ]
        ],
        "tip": "Order spares by form factor and thickness, not just capacity",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "edsff",
          "e1.s",
          "e3.s",
          "e1.l",
          "ruler"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.snia.org/forums/cmsi/knowledge/formfactors",
              "title": "SNIA: SSD form factors (EDSFF)"
            },
            {
              "url": "https://github.com/linux-nvme/nvme-cli/blob/master/Documentation/nvme-id-ctrl.txt",
              "title": "nvme-cli: id-ctrl"
            }
          ],
          "note": "The mn/sn/fr field names are nvme-cli output, not listed in its man page."
        }
      }
    ]
  },
  {
    "part": "hw-drives",
    "id": "drives-cmd-4",
    "badge": "drives",
    "title": "Drive form factors: Is the NVMe link at full width and speed?",
    "subtitle": "Is the NVMe link at full width and speed?",
    "commands": [
      {
        "id": "drives-link",
        "desc": "Is the NVMe link at full width and speed?",
        "cmd": "for d in /sys/class/nvme/nvme*; do echo \"$(basename $d): $(cat $d/device/current_link_width)x @ $(cat $d/device/current_link_speed)\"; done",
        "details": "",
        "flags": [
          [
            "current_link_width",
            "Expect 4 for U.2/U.3 and most E1.S/E3.S"
          ],
          [
            "current_link_speed",
            "32.0 GT/s = PCIe 5, 16.0 GT/s = PCIe 4"
          ],
          [
            "max_link_width / max_link_speed",
            "What it should be"
          ],
          [
            "Degraded",
            "x2 or a lower speed: reseat the drive, then check the backplane cable"
          ]
        ],
        "tip": "A degraded link is a physical problem until proven otherwise",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "pcie",
          "link",
          "width",
          "speed",
          "degraded"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "current_link_width/_speed and max_link_* exist in PCI device sysfs (seen on a live system) but are not in the kernel ABI docs."
        }
      }
    ]
  },
  {
    "part": "hw-drives",
    "id": "drives-pro-tips",
    "badge": "tip",
    "title": "Drive form factors: Pro Tip",
    "subtitle": "Find the bay before you pull",
    "commands": [
      {
        "id": "drives-tips-card",
        "desc": "Find the bay before you pull",
        "cmd": "ledctl --listed-only locate=/dev/nvme0n1",
        "details": "Light the bay LED (ledctl --listed-only locate=..., then locate_off=... to switch it off; without --listed-only ledctl turns off every other drive's LEDs, fault LEDs included) and match the serial on the drive label before pulling. The storage playbook (docs/playbooks/storage-jbod.md) covers SES slot mapping for JBODs.",
        "flags": [
          [
            "locate_off=",
            "Turn the LED off again"
          ],
          [
            "Serial",
            "Always match it before pulling"
          ]
        ],
        "tip": "Wrong-drive pulls in a degraded array lose data",
        "tags": [
          "hardware",
          "reference",
          "drives",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/ledmon/ledctl.8.en.html",
              "title": "ledctl(8) (ledmon 0.97)"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "hw-gpu-forms",
    "id": "gpuform-cmd-1",
    "badge": "gpu",
    "title": "GPU form factors: Which GPUs, which bus IDs, which power limits",
    "subtitle": "Which GPUs, which bus IDs, which power limits",
    "commands": [
      {
        "id": "gpu-forms-identify",
        "desc": "Which GPUs, which bus IDs, which power limits",
        "cmd": "nvidia-smi --query-gpu=index,name,pci.bus_id,power.limit,serial --format=csv",
        "details": "",
        "flags": [
          [
            "SXM",
            "Module on an HGX baseboard: NVLink through NVSwitch, power through the board"
          ],
          [
            "PCIe",
            "Standard card in a slot, powered by 12V-2x6; NVLink only with a bridge (NVL variants)"
          ],
          [
            "power.limit",
            "H200 SXM up to 700 W; H200 NVL (PCIe) up to 600 W"
          ],
          [
            "serial",
            "Goes in the RMA, with the bus ID"
          ]
        ],
        "tip": "topo -m tells SXM (NV18 everywhere) from PCIe (PIX/SYS) at a glance",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "sxm",
          "pcie",
          "hgx",
          "topology",
          "identify"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/h200/",
              "title": "NVIDIA H200"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/lspci.8.html",
              "title": "lspci(8)"
            }
          ],
          "note": "--query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page. On some kernels nvidia-smi topo needs root."
        }
      },
      {
        "id": "gpu-forms-identify-sub-1",
        "desc": "How GPUs and NICs connect: NV# = NVLink, PIX/PXB/SYS = PCIe paths",
        "cmd": "nvidia-smi topo -m",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "recipe",
          "sxm",
          "pcie",
          "hgx"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/h200/",
              "title": "NVIDIA H200"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/lspci.8.html",
              "title": "lspci(8)"
            }
          ],
          "note": "--query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page. On some kernels nvidia-smi topo needs root."
        }
      },
      {
        "id": "gpu-forms-identify-sub-2",
        "desc": "NVIDIA devices on the PCIe bus",
        "cmd": "lspci -d 10de: -nn",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "recipe",
          "sxm",
          "pcie",
          "hgx"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/h200/",
              "title": "NVIDIA H200"
            },
            {
              "url": "https://man7.org/linux/man-pages/man8/lspci.8.html",
              "title": "lspci(8)"
            }
          ],
          "note": "--query-gpu field names are listed by nvidia-smi --help-query-gpu on your driver, not on the docs page. On some kernels nvidia-smi topo needs root."
        }
      }
    ]
  },
  {
    "part": "hw-gpu-forms",
    "id": "gpuform-cmd-2",
    "badge": "gpu",
    "title": "GPU form factors: HGX / DGX 8-GPU systems",
    "subtitle": "HGX / DGX 8-GPU systems",
    "commands": [
      {
        "id": "gpu-forms-hgx",
        "desc": "HGX / DGX 8-GPU systems",
        "cmd": "nvidia-smi nvlink -s",
        "details": "",
        "flags": [
          [
            "HGX B200 / B300",
            "8 GPUs, NVLink 5: 1.8 TB/s per GPU, 14.4 TB/s total"
          ],
          [
            "DGX B200",
            "8 Blackwell GPUs, 10 RU, about 14.3 kW max, 10-35 °C operating"
          ],
          [
            "HGX Rubin NVL8",
            "NVLink 6: 3.6 TB/s per GPU"
          ],
          [
            "Fabric Manager",
            "Must be running on NVSwitch systems, at a version compatible with the driver (the same version before driver R620; its own versioning from R620)"
          ],
          [
            "Service",
            "A failed SXM GPU usually means a baseboard-level RMA: collect nvidia-bug-report first"
          ]
        ],
        "tip": "Inactive NVLinks on one GPU point at that module or its baseboard connector",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "hgx",
          "dgx",
          "nvlink",
          "nvswitch",
          "b200",
          "b300"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/hgx/",
              "title": "NVIDIA HGX"
            },
            {
              "url": "https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html",
              "title": "DGX B200 user guide: introduction"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html",
              "title": "Fabric Manager user guide"
            }
          ],
          "note": "Corrected 2026-11-09: Fabric Manager must be compatible with the driver; it matched the driver version only before R620. DGX B200 runs at 10-35 °C (the product page's '90 °F' is a typo for 95 °F)."
        }
      },
      {
        "id": "gpu-forms-hgx-sub-1",
        "desc": "Fabric Manager state",
        "cmd": "systemctl status nvidia-fabricmanager --no-pager",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "recipe",
          "hgx",
          "dgx",
          "nvlink"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/hgx/",
              "title": "NVIDIA HGX"
            },
            {
              "url": "https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html",
              "title": "DGX B200 user guide: introduction"
            },
            {
              "url": "https://docs.nvidia.com/datacenter/tesla/fabric-manager-user-guide/index.html",
              "title": "Fabric Manager user guide"
            }
          ],
          "note": "Corrected 2026-11-09: Fabric Manager must be compatible with the driver; it matched the driver version only before R620. DGX B200 runs at 10-35 °C (the product page's '90 °F' is a typo for 95 °F)."
        }
      }
    ]
  },
  {
    "part": "hw-gpu-forms",
    "id": "gpuform-cmd-3",
    "badge": "gpu",
    "title": "GPU form factors: Rack-scale",
    "subtitle": "Rack-scale: GB200 / GB300 NVL72",
    "commands": [
      {
        "id": "gpu-forms-nvl72",
        "desc": "Rack-scale: GB200 / GB300 NVL72",
        "cmd": "nvidia-smi -q | grep -iA3 fabric",
        "details": "",
        "flags": [
          [
            "GB200 NVL72",
            "36 Grace CPUs + 72 Blackwell GPUs in one NVLink domain (130 TB/s)"
          ],
          [
            "GB300 NVL72",
            "72 Blackwell Ultra GPUs, fully liquid-cooled"
          ],
          [
            "One rack = one system",
            "NVLink switch trays join compute trays; a tray fault affects the domain"
          ],
          [
            "Liquid",
            "Coolant and leak alarms are part of triage (Cooling sheet)"
          ]
        ],
        "tip": "On NVL72, check the NVLink switch trays before blaming one GPU",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "nvl72",
          "gb200",
          "gb300",
          "rack-scale",
          "liquid"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://www.nvidia.com/en-us/data-center/gb200-nvl72/",
              "title": "NVIDIA GB200 NVL72"
            },
            {
              "url": "https://www.nvidia.com/en-us/data-center/gb300-nvl72/",
              "title": "NVIDIA GB300 NVL72"
            },
            {
              "url": "https://docs.nvidia.com/deploy/nvidia-smi/index.html",
              "title": "NVIDIA nvidia-smi documentation"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "hw-gpu-forms",
    "id": "gpuform-pro-tips",
    "badge": "tip",
    "title": "GPU form factors: Pro Tip",
    "subtitle": "Evidence first, then the RMA",
    "commands": [
      {
        "id": "gpuform-tips-card",
        "desc": "Evidence first, then the RMA",
        "cmd": "nvidia-bug-report.sh",
        "details": "Before any GPU swap, collect nvidia-bug-report (long-running), the SEL, and nvidia-smi -q. Record logical and physical IDs together: GPU index, UUID, bus ID and the SXM module or slot number. The NVIDIA DC suite and docs/playbooks/gpu-nvlink.md have the full flow.",
        "flags": [
          [
            "nvidia-smi -q",
            "Full GPU state"
          ],
          [
            "UUID + BDF + slot",
            "Logical and physical IDs"
          ]
        ],
        "tip": "Drain before nvidia-bug-report on a busy node",
        "tags": [
          "hardware",
          "reference",
          "gpuform",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "nvidia-bug-report.sh ships with the NVIDIA driver but isn't described in the nvidia-smi docs."
        }
      }
    ]
  },
  {
    "part": "hw-rack",
    "id": "rack-cmd-1",
    "badge": "rack",
    "title": "Racks & labelling: Who is this server? Serial, model and asset tag",
    "subtitle": "Who is this server? Serial, model and asset tag",
    "commands": [
      {
        "id": "rack-identity",
        "desc": "Who is this server? Serial, model and asset tag",
        "cmd": "dmidecode -s system-serial-number; dmidecode -s system-product-name",
        "details": "",
        "flags": [
          [
            "system-serial-number",
            "Service tag / serial: the RMA key"
          ],
          [
            "system-product-name",
            "Model"
          ],
          [
            "chassis-asset-tag",
            "Your asset tag, if set"
          ],
          [
            "ipmitool fru print 0",
            "Same data through the BMC, even with the OS down"
          ]
        ],
        "tip": "Blink the ID LED before you touch a server in a full rack",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "serial",
          "asset",
          "identify",
          "fru",
          "dmidecode"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_fru.c",
              "title": "ipmitool source: fru print [fru id]"
            }
          ],
          "note": "fru print [fru id] is in ipmitool's source usage text; the man page shows fru print without an ID. chassis identify takes seconds (default 15, 0 = off, force = on)."
        }
      },
      {
        "id": "rack-identity-sub-1",
        "desc": "FRU through the BMC",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E fru print 0",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "recipe",
          "serial",
          "asset",
          "identify"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_fru.c",
              "title": "ipmitool source: fru print [fru id]"
            }
          ],
          "note": "fru print [fru id] is in ipmitool's source usage text; the man page shows fru print without an ID. chassis identify takes seconds (default 15, 0 = off, force = on)."
        }
      },
      {
        "id": "rack-identity-sub-2",
        "desc": "Blink the ID LED for 60 s to find it in the row",
        "cmd": "ipmitool -I lanplus -H $BMC -U $BMC_USER -E chassis identify 60",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "recipe",
          "serial",
          "asset",
          "identify"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/doc/ipmitool.1.in",
              "title": "ipmitool man page"
            },
            {
              "url": "https://github.com/ipmitool/ipmitool/blob/master/lib/ipmi_fru.c",
              "title": "ipmitool source: fru print [fru id]"
            }
          ],
          "note": "fru print [fru id] is in ipmitool's source usage text; the man page shows fru print without an ID. chassis identify takes seconds (default 15, 0 = off, force = on)."
        }
      }
    ]
  },
  {
    "part": "hw-rack",
    "id": "rack-cmd-2",
    "badge": "rack",
    "title": "Racks & labelling: Rack units and rack types",
    "subtitle": "Rack units and rack types",
    "commands": [
      {
        "id": "rack-units",
        "desc": "Rack units and rack types",
        "cmd": "awk 'BEGIN{u=42; printf \"%dU = %.1f mm = %.2f in\\n\", u, u*44.45, u*1.75}'",
        "details": "",
        "flags": [
          [
            "1U",
            "1.75 in = 44.45 mm (EIA-310)"
          ],
          [
            "19-inch rack",
            "Mounting holes 465.14 mm apart, centre to centre"
          ],
          [
            "42U",
            "The common full-height rack"
          ],
          [
            "OCP Open Rack V3",
            "21-inch bay; supports 48 mm OpenU and 44.45 mm EIA units; 48 V busbar power"
          ],
          [
            "Busbar",
            "ORv3 gear takes power from the rear busbar, not PDU cords"
          ]
        ],
        "tip": "Count U from the bottom, the way the rack's numbering does",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "rack-unit",
          "eia-310",
          "ocp",
          "open-rack",
          "busbar"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://en.wikipedia.org/wiki/Rack_unit",
              "title": "Rack unit (Wikipedia, EIA-310)"
            },
            {
              "url": "https://www.opencompute.org/documents/open-rack-base-specification-version-3-pdf/",
              "title": "OCP Open Rack V3 base specification"
            },
            {
              "url": "https://www.opencompute.org/wiki/Rack_&_Power",
              "title": "OCP Rack & Power"
            }
          ]
        }
      }
    ]
  },
  {
    "part": "hw-rack",
    "id": "rack-cmd-3",
    "badge": "rack",
    "title": "Racks & labelling: A labelling scheme",
    "subtitle": "A labelling scheme (TIA-606-D)",
    "commands": [
      {
        "id": "rack-labels",
        "desc": "A labelling scheme (TIA-606-D)",
        "cmd": "printf '%s\\n' 'DC1-R12-U24' 'DC1-R12-U24-PSU1->PDU-R12-A-07' 'DC1-R12-U24-ib0->SW-R12-01:p17'",
        "details": "",
        "flags": [
          [
            "ANSI/TIA-606-D",
            "Current edition (Oct 2021) of the telecom administration (labelling) standard"
          ],
          [
            "Classes 1-4",
            "Scaled to complexity: a single room up to a multi-site campus"
          ],
          [
            "Both ends",
            "Every cable labelled at both ends with both endpoints"
          ],
          [
            "Site-Row/Rack-U",
            "A sortable, unique ID for every position"
          ]
        ],
        "tip": "If the label and the CMDB disagree, trust neither until you trace the cable",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "labels",
          "tia-606",
          "cabling",
          "cmdb"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [],
          "note": "ANSI/TIA-606-D is sold, not published openly, so its date and class definitions are not checked here. The label format is an example."
        }
      }
    ]
  },
  {
    "part": "hw-rack",
    "id": "rack-pro-tips",
    "badge": "tip",
    "title": "Racks & labelling: Pro Tip",
    "subtitle": "Physical location in the case notes",
    "commands": [
      {
        "id": "rack-tips-card",
        "desc": "Physical location in the case notes",
        "cmd": "echo \"$(hostname) serial=$(dmidecode -s system-serial-number) rack=<row-rack> U=<u>\"",
        "details": "Record logical and physical identity together in every case: hostname, serial, BMC address, row/rack/U, and the PDU outlets for each PSU. Field notes on the home page keep them per server.",
        "flags": [
          [
            "Serial + location",
            "Everything an on-site tech needs"
          ],
          [
            "PDU outlets",
            "Per PSU"
          ]
        ],
        "tip": "Replace the placeholders before you run it",
        "tags": [
          "hardware",
          "reference",
          "rack",
          "tips",
          "best-practice"
        ],
        "src": {
          "verified": "2026-11-09",
          "refs": [
            {
              "url": "https://manpages.debian.org/trixie/dmidecode/dmidecode.8.en.html",
              "title": "dmidecode(8)"
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
if (typeof window !== "undefined" && window.migrateMergedSheet) window.migrateMergedSheet("hw-reference.html", "hw-reference_bookmarks", HWREF_HUB_DATA, {"hw-power":"hw-power_bookmarks","hw-cooling":"hw-cooling_bookmarks","hw-rack":"hw-rack_bookmarks","hw-memory":"hw-memory_bookmarks","hw-drives":"hw-drives_bookmarks","hw-gpu-forms":"hw-gpu-forms_bookmarks"});

const state = {
  searchQuery: "",
  activeCategory: "all",
  savedOnly: false,
  theme: localStorage.getItem("linux_cs_theme") || "dark",
  bookmarks: new Set((() => { try { return JSON.parse(localStorage.getItem("hw-reference_bookmarks") || "[]"); } catch (e) { return []; } })())
};
// The part the hash picks (#nv-smi, or a command id): the first render is already filtered.
state.part = typeof window !== "undefined" && window.sheetPartFromHash ? window.sheetPartFromHash(HWREF_HUB_DATA) : "";
if (typeof window !== "undefined") // Each part's own header, as its page had it (title, subtitle, version label).
  window.SHEET_FILTER = { sections: HWREF_HUB_DATA, label: "Rack & hardware reference sheets", parts: {
   "hw-cooling": {
    "title": "Cooling",
    "subtitle": "ASHRAE ranges, reading inlet and GPU temperatures, fan failures, and the W classes for liquid-cooled racks",
    "pill": "ASHRAE TC 9.9 · 5th ed."
   },
   "hw-drives": {
    "title": "Drive form factors",
    "subtitle": "What fits which bay, tri-mode gotchas, and identifying the drive and its link from Linux",
    "pill": "SNIA EDSFF · SFF-TA-1001"
   },
   "hw-gpu-forms": {
    "title": "GPU form factors",
    "subtitle": "What each form factor means for power, NVLink and service, and how to tell them apart on a live node",
    "pill": "HGX · DGX · NVL72"
   },
   "hw-memory": {
    "title": "Memory population",
    "subtitle": "Read the DIMM layout, check speeds and balance, and know the channel counts of current server CPUs",
    "pill": "EPYC 9005 · Xeon 6"
   },
   "hw-power": {
    "title": "Power & PDUs",
    "subtitle": "C13/C19 ratings, the 80% rule, three-phase math, and reading real power draw from the BMC and GPUs",
    "pill": "IEC 60320 · NEC 210.20"
   },
   "hw-rack": {
    "title": "Racks & labelling",
    "subtitle": "Rack units, 19-inch vs 21-inch Open Rack, a labelling scheme, and finding a server's identity from the CLI",
    "pill": "EIA-310 · ORv3 · TIA-606-D"
   }
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
  const allCards = HWREF_HUB_DATA;
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

  for (const card of HWREF_HUB_DATA) {
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
        localStorage.setItem("hw-reference_bookmarks", JSON.stringify([...state.bookmarks]));
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
