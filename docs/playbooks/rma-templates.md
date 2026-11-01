# RMA Evidence & Ticket Escalation Templates (`rma-templates.md`)

Use these standardized templates when generating `cases/<ticket-or-hostname>/summary.md` or providing a copy-paste escalation block for vendor RMAs (NVIDIA, Server OEM, Optics/Switch vendor) and internal DCIM/Jira/ServiceNow tickets.

---

## 1. GPU / HGX SXM / NVSwitch RMA Template

```markdown
### [RMA REQUEST] GPU / HGX Fault — <Hostname> (<Ticket_ID>)

**1. System Identification**
- **Hostname / Rack / U-Position**: <Hostname> | Rack: <Rack_ID> | U: <U_Pos>
- **Server OEM & Model**: <Manufacturer> <Product Name> (from `dmidecode -t system`)
- **Chassis Serial Number**: <System Serial>
- **Baseboard / HGX Tray Serial**: <Board Serial>
- **BIOS / BMC Firmware Version**: BIOS: <Ver> | BMC: <Ver>
- **OS / Kernel / NVIDIA Driver / Fabric Manager**: <OS> | <Kernel> | Driver: <Ver> | FM: <Ver>

**2. Faulty Component Details**
- **Logical GPU Index**: GPU <Index>
- **Physical Location / SXM Socket / PCIe Slot**: <e.g., SXM5 Module 4 / PCIe Slot 3>
- **PCIe Bus ID (BDF)**: `<0000:xx:00.0>`
- **GPU Model**: <e.g., NVIDIA H200 SXM 141GB / B200 / RTX 6000 Ada>
- **GPU Serial Number**: `<Serial from nvidia-smi -q>`
- **GPU UUID**: `<GPU-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx>`
- **VBIOS Version**: `<VBIOS>`

**3. Failure Symptom & RMA Justification**
- **Primary Error Code(s)**: <e.g., Xid 64 (Row Remap Failure) / Xid 48 (DBE) / Xid 79 (Fallen off bus) / SXid 28004>
- **Row Remapper State**: Pending: `<Yes/No>` | Failure Occurred: `<Yes/No>` | Bank Availability: `None: <count>`
- **Uncorrectable ECC Counts**: Volatile DBE: `<count>` | Aggregate DBE: `<count>` | SRAM Uncorrectable: `<count>`

**4. Troubleshooting & Isolation Performed**
- [x] Verified node drained in scheduler (`<Slurm/K8s state>`)
- [x] Checked thermal, power, and voltage sensors in BMC SEL/SDR
- [x] Performed cold reboot / AC power cycle (Fault persisted: `<Yes/No>`)
- [x] Ran `dcgmi diag -r 3` (Result: `<FAIL on GPU X - Memory/PCIe/NVLink>`)
- [x] Attached `nvidia-bug-report.log.gz` (`cases/<id>/logs/nvidia-bug-report.log.gz`)

**5. Key Log Evidence**
```text
<Paste 5-15 lines of exact timestamped dmesg Xid/SXid, nvidia-smi -q ROW_REMAPPER, or BMC SEL output>
```
```

---

## 2. Network / Optical Transceiver / HCA RMA & L1 Escalation Template

```markdown
### [NETWORK / OPTICS ESCALATION] Link Fault — <Hostname> (<Ticket_ID>)

**1. Endpoint & Link Mapping**
- **Host Node**: `<Hostname>`
- **Linux Interface / RDMA Device**: `<ibX / ethX>` (`<mlx5_X>`)
- **PCIe BDF & HCA Model**: `<0000:xx:00.0>` | `<ConnectX-7 / ConnectX-8 / BlueField-3>`
- **HCA Serial & PSID / FW**: SN: `<Serial>` | FW: `<FW_Ver>`
- **Switch Name & Port (LLDP / IB)**: `<Switch_Hostname>` : `<Port / Cage / Split>`

**2. Optical Transceiver & Cable Identification**
- **Host Optic Vendor / Part Number (OPN)**: `<Vendor>` `<PN>` (e.g., MMS4X00-NM / MFP7E10)
- **Host Optic Serial Number & FW**: SN: `<Optic_SN>` | FW: `<Optic_FW>`
- **Connector / Fiber Type**: `<OSFP Finned / OSFP Flat / QSFP112 / MPO-12 APC Single-Mode / AOC>`

**3. Telemetry & DOM Summary (`mlxlink -m -c -e`)**
- **Link State / Speed / Width**: `<Polling / Active>` | `<NDR 400G / XDR 800G>` | `<4x / degraded 2x>`
- **Raw Physical BER**: `<e.g., 2.4e-4>` (Threshold: `< 5e-4`)
- **Effective Physical Errors / BER**: `<Errors>` | `<Effective BER>`
- **Module Temp**: `<Temp °C>`
- **Per-Lane Optical Power (dBm)**:
  - **Rx Power (Lanes 0..3/7)**: `[ <L0>, <L1>, <L2>, <L3> ] dBm`
  - **Tx Power (Lanes 0..3/7)**: `[ <L0>, <L1>, <L2>, <L3> ] dBm`
  - **SNR / Eye Grades (Lanes 0..3/7)**: `[ <L0>, <L1>, <L2>, <L3> ]`

**4. Layer-1 Physical Isolation Completed**
- [ ] Inspected & cleaned MPO-APC / LC fiber end-faces (Host + Patch Panel + Switch)
- [ ] Reseated transceiver module
- [ ] Performed A/B cross-swap with adjacent port (`Fault followed: <Optic / Fiber / Host Port / Switch Port>`)
```

---

## 3. DIMM / Storage Drive (NVMe / JBOD SAS) Replacement Template

```markdown
### [COMPONENT REPLACEMENT] <DIMM / NVMe / JBOD Drive> — <Hostname> (<Ticket_ID>)

**1. Location & Chassis**
- **Hostname / JBOD Shelf**: `<Hostname>` | Rack: `<Rack>` | U: `<U>`
- **Chassis Model & Serial**: `<Model>` | SN: `<Chassis_SN>`
- **RAID / ZFS / Filesystem Status**: `<e.g., ZFS DEGRADED / MDADM Clean / WEKA Drive Down / N/A>`

**2. Faulty Part Identification**
- **Component Type**: `<DDR5 RDIMM / U.2 NVMe / E3.S NVMe / 3.5" SAS HDD>`
- **Physical Slot / Bay / Silkscreen Label**: `<e.g., DIMM_P0_A1 / Bay 14 / Enclosure sg4 Slot 42>`
- **Linux Device / PCIe BDF**: `<e.g., /dev/nvme2n1 (0000:65:00.0) / /dev/sdac / EDAC mc0 csrow0>`
- **Vendor & Model / Part Number**: `<Manufacturer>` `<Part_Number>`
- **Component Serial Number**: **`<EXACT_SERIAL_NUMBER>`** *(Verify physically on label before pulling!)*
- **Capacity / Speed / Firmware**: `<Capacity>` | `<FW>`

**3. Error Summary & Logs**
- **Failure Reason**: `<e.g., Uncorrectable ECC MCE / NVMe critical_warning 0x04 / SMART Grown Defects 412>`
```text
<Paste exact smartctl / nvme smart-log / ipmitool sel / ras-mc-ctl snippet>
```
```
