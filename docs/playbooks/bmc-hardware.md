# Vendor-Agnostic BMC, DIMM, CPU & PCIe Playbook (`bmc-hardware.md`)

Covers **Vendor-Agnostic IPMI / Redfish / OpenBMC**, **Platform Auto-Detection**, **DDR5 ECC Memory / MCEs**, **PCIe Gen5 AER**, and **Power / Thermal / Liquid Cooling Sensors**.

---

## 1. Platform Auto-Detection & FRU Identification

Always start by identifying the server OEM, product model, chassis serial, and BIOS/BMC versions using vendor-agnostic commands:

```bash
# 1. In-Band DMI / SMBIOS Identification (Read-Only)
sudo dmidecode -t system -t baseboard -t bios

# 2. In-Band or Out-of-Band IPMI FRU & BMC Info (Read-Only)
#    Note: For remote BMC, add: -I lanplus -H <bmc_ip> -U <user> -E (using $IPMITOOL_PASSWORD)
sudo ipmitool fru print 0
sudo ipmitool mc info
sudo ipmitool lan print
```

---

## 2. Out-of-Band BMC Telemetry (IPMI & Redfish)

### Security Reminder
- **NEVER** pass plaintext passwords via `-P <password>` in logged shell commands.
- Use `export IPMITOOL_PASSWORD='...'` in your local terminal and run `ipmitool -I lanplus -H <bmc_ip> -U <user> -E ...` or use `-f ~/.ipmi_pass`.

### Read-Only IPMI Diagnostics
```bash
# 1. System Event Log (SEL) with human-readable descriptions
ipmitool sel info
ipmitool sel elist | tail -n 100

# 2. Sensor Data Repository (SDR) — Temperatures, Fans, Voltages, PSU Wattage, Leak Sensors
ipmitool sdr elist full
ipmitool sensor list

# 3. Check Chassis Power Status & Last Power Down Cause
ipmitool chassis status
ipmitool chassis restart_cause
```

### Vendor-Agnostic Redfish Queries (`curl` / `redfishtool`)
Modern H200 / B200 / OpenBMC platforms expose rich diagnostics (including SXM/HGX baseboard sensors and PCIe errors) over Redfish:
```bash
# 1. List Systems and Chassis IDs
curl -sk -u "$BMC_USER:$BMC_PASS" https://<bmc_ip>/redfish/v1/Systems | jq .
curl -sk -u "$BMC_USER:$BMC_PASS" https://<bmc_ip>/redfish/v1/Chassis | jq .

# 2. Query System Health, PowerState, and IndicatorLED
curl -sk -u "$BMC_USER:$BMC_PASS" https://<bmc_ip>/redfish/v1/Systems/1 | jq '{Manufacturer,Model,SerialNumber,PowerState,Status}'

# 3. Query BMC Event Logs / SEL via Redfish
curl -sk -u "$BMC_USER:$BMC_PASS" https://<bmc_ip>/redfish/v1/Systems/1/LogServices/Log1/Entries | jq '.Members[-20:]'
```

---

## 3. Memory (DDR5 ECC) & CPU Machine Check Exceptions (MCE)

### Read-Only Triage Commands
```bash
# 1. Map populated DIMM silk-screen labels, sizes, speeds, serials, and part numbers
sudo dmidecode -t memory | grep -E "Size:|Locator:|Bank Locator:|Type:|Speed:|Manufacturer:|Serial Number:|Part Number:|Configured Memory Speed:"

# 2. Check EDAC (Error Detection and Correction) memory controller counters
edac-util -v                        # Or inspect /sys/devices/system/edac/mc/mc*/csrow*/ch*_ce_count

# 3. Check rasdaemon / mcelog / kernel MCE & GHES hardware error events
ras-mc-ctl --summary
ras-mc-ctl --errors
dmesg -T | grep -E -i "mce|edac|hardware error|ghes|memory error|uncorrected|corrected"

# 4. Correlate with BMC SEL (BMC usually logs exact Silkscreen DIMM slot, e.g. DIMM_A1 / P0_MC0_DIMM_A0)
ipmitool sel elist | grep -i -E "memory|dimm|ecc|mcr"
```

### DIMM Troubleshooting & RMA Rules
1. **Uncorrectable Memory Error (UE / UC / Fatal MCE / Poison Consumption)**:
   - Causes immediate kernel panic or node reboot.
   - Identify exact physical DIMM slot from `ipmitool sel elist` or `dmesg` GHES/EDAC decode.
   - Pull the exact DIMM part number and serial from `dmidecode -t memory` for that `Locator`.
   - **Action**: If first occurrence on a newly racked node, inspect/reseat DIMM or swap with an adjacent channel slot to isolate DIMM vs CPU socket pin. Otherwise, **replace and RMA DIMM**.
2. **Correctable ECC Storm (CE Storm / PPRThreshold Exceeded)**:
   - High rate of correctable errors (`> 1000/day` or BMC `Correctable ECC logging limit reached`) degrades node performance via SMI interrupts and precedes an Uncorrectable Error.
   - Schedule node drain and replace the affected DIMM.
3. **Missing Memory Total (`free -h` shows less RAM than expected)**:
   - Diff `dmidecode -t memory` across channels to find which slot shows `No Module Installed` or `Unknown` when physically populated.

---

## 4. PCIe Gen5 / CXL Bus Errors (AER & Link Training)

AI nodes rely heavily on PCIe Gen5 x16 switches (Broadcom/PEX) and MCIO high-speed cables connecting CPU root ports to GPUs, ConnectX-7/8 NICs, and NVMe backplanes.

```bash
# 1. Find all devices with PCIe Advanced Error Reporting (AER) Non-Zero Counters
dmesg -T | grep -E -i "AER|pcieport|BadTLP|BadDLLP|Replay Timer|Receiver Error|Surprise Down"

# 2. Check PCIe link speed/width vs capability across all high-speed devices
sudo lspci -vvv | grep -E "^[0-9a-f]{2}:[0-9a-f]{2}\.|LnkCap:|LnkSta:|UESta:|CESta:"
```

- **`Receiver Error` / `BadTLP` / `BadDLLP` / `Replay Rollover`**:
  - Indicates Layer-1 signal integrity issues on the PCIe Gen5 bus.
  - Check **MCIO / SlimSAS internal cables** (ensure latch is fully clicked and cable is not kinked near fan wall), PCIe riser seating, or retimer temperature.
- **Link Speed Downgrade (`Speed 16GT/s (downgraded)` or `Width x8 (downgraded)`)**:
  - Device trained at Gen4 instead of Gen5, or lost lanes (`x8`/`x4` instead of `x16`).
  - Isolate by reseating the card/riser/MCIO connector and performing a cold power cycle (when node is drained and approved).

---

## 5. Power Supplies (PSUs), VRDs & Cooling (Air / DLC)

```bash
# Check PSU redundancy, input voltage (208V/240V/277V/48V), output wattage, and status
ipmitool sdr type "Power Supply"
ipmitool sdr type "Current"
ipmitool sdr type "Voltage"

# Check Fan speeds (RPM / PWM %) and Thermal sensors
ipmitool sdr type "Fan"
ipmitool sdr type "Temperature"
```

- **PSU Input Loss (`Power Supply AC lost` / `Predictive Failure`)**:
  - Verify C19/C20 or Saf-D-Grid power cord seating at both PSU and rack PDU outlet.
  - Check rack PDU breaker / phase load before swapping PSU.
- **Direct Liquid Cooling (DLC) / Leak Detection Sensors**:
  - **CRITICAL**: If any BMC sensor or SEL entry reports `Leak Detected`, `Coolant Flow Low`, or `CDU Fault`, **IMMEDIATELY alert the technician**. Never power on a node with an active leak alarm!
