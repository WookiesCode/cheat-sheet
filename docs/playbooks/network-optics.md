# InfiniBand, RoCEv2 & Optical Interconnect Playbook (`network-optics.md`)

Covers **NVIDIA Quantum 400G/800G (NDR/XDR) InfiniBand**, **RoCEv2 Ethernet**, **ConnectX-7 / ConnectX-8 HCAs**, **BlueField-3 DPUs**, and **OSFP / QSFP112 / QSFP-DD / MPO-APC / AOC / DAC** physical optics.

---

## 1. Quick Non-Destructive Triage Commands

Run these read-only checks to map HCA ports, link state, bit error rates (BER), and optical DOM levels:

```bash
# 1. List all RDMA / InfiniBand / RoCE devices, link states, and physical rates
ibstat
ibv_devinfo -v

# 2. Map PCIe BDF <-> mlx5_X <-> netdev (ibX / ethX / enpXsX)
mst status -v               # Or: rdma link show

# 3. Inspect Physical Layer, FEC, SNR, Eye Grade, and BER via mlxlink (Read-Only)
#    Works with PCIe BDF (-d 0000:xx:00.0) or mst device or ib device (-d mlx5_0)
sudo mlxlink -d mlx5_0 -m -c -e

# 4. Query InfiniBand fabric error counters (SymbolError, LinkDowned, PortRcvErrors)
perfquery -x

# 5. For RoCEv2 / Ethernet interfaces: check link, FEC, pause frames (PFC), and DOM optics
ethtool <iface>
ethtool -m <iface>          # Transceiver DOM (Rx/Tx dBm, Temp, Voltage, Bias, Serial/PN)
ethtool -S <iface> | grep -E -i "err|drop|crc|symbol|fec|pause|pfc|out_of_buffer|discards"

# 6. Check LLDP / switch port neighbor discovery (Ethernet) or SM LID / Switch GUID (IB)
lldpctl                     # Or: networkctl lldp
sminfo                      # InfiniBand Subnet Manager info
iblinkinfo -l | grep <hostname>
```

---

## 2. Interpreting `mlxlink -m -c -e` (NDR 400G / XDR 800G & RoCE)

When running `sudo mlxlink -d <dev> -m -c -e`, focus on these critical indicators:

| Field in `mlxlink` | Healthy Target (400G NDR / 800G XDR / PAM4) | Degraded / Fault Threshold & Meaning |
| :--- | :--- | :--- |
| **State / Physical state** | `Active` / `LinkUp` (`ETH_AN_FSM_ENABLE`) | `Polling` (No light / remote port down / broken fiber) or `Training` (Dirty fiber / marginal signal). |
| **Speed / Width** | `NDR (400Gb/s) / 4x` or `XDR (800Gb/s)` or `400G_4X` | `HDR` / `2x` / `1x` width downgrade -> Check dead lane in Rx/Tx Power or bent MPO pin. |
| **Effective Physical Errors** | `0` (Post-FEC Uncorrectable = `0`) | **Any `Effective Physical Errors > 0`** means uncorrectable FEC errors are leaking up the stack, causing job hangs/NCCL timeouts. |
| **Raw Physical BER** | `< 1e-7` to `1e-5` (Normal for 100G/200G PAM4 per lane with RS-FEC) | **`> 5e-4` (Pre-FEC threshold)** -> RS-FEC cannot keep up; link will flap or drop packets. |
| **Effective Physical BER** | `< 1e-15` (Often shown as `1E-254` or `0E+0` when clean) | **`> 1e-12`** -> Unacceptable post-FEC error rate. Clean/swap optics or cable immediately. |
| **Rx Power (dBm) per lane** | **`-6.0 dBm` to `+2.0 dBm`** (typical DR4/FR4/SR4) | **`< -10.0 dBm` or `-40.0 dBm` (LOS)** -> Broken fiber, unseated MPO, or dead remote Tx laser.<br>**Lane-to-lane skew `> 3.0 dBm`** -> Dirty MPO ferrule on specific fibers! |
| **Tx Power (dBm) per lane** | **`-3.0 dBm` to `+3.0 dBm`** across all lanes | **`< -8.0 dBm` or `0.0 mW`** on one or more lanes -> Local transceiver laser diode failure (**RMA transceiver**). |
| **Module Temperature** | `< 65°C` (Warning ~70°C, Critical ~75°C+) | `> 70°C` -> Check OSFP finned-top airflow, fan speed, or dust obstruction. High temp degrades laser life and raises BER. |
| **Eye Opening / Grade (PAM4)** | Consistent positive Eye Height/Grades across all 4/8 lanes | Single lane with `0` or drastically lower grade than peers -> Isolate dirty fiber lane vs transceiver Rx photodiode. |

---

## 3. Optical Transceiver & Fiber Layer-1 Isolation Workflow

Before replacing an expensive ConnectX-7/8 HCA, BlueField-3 DPU, or switch blade, execute this Layer-1 physical isolation checklist:

### Step 1: Identify Transceiver Type & Connector Geometry
- **OSFP (Finned Top vs Flat Top)**:
  - *Switch side*: Usually **OSFP Finned Top** (Twin-port 2x400G/800G on Quantum-2/Spectrum-4).
  - *Host HCA side*: Usually **OSFP Flat Top** (Riding heatsink on ConnectX-7/8) or **QSFP112**.
  - *Never force a Finned OSFP into a Flat-Top HCA cage!*
- **MPO/MTP Polarity & Angle (CRITICAL)**:
  - **400G NDR / 800G XDR Single-Mode (DR4 / DR8 / FR4)** almost universally uses **MPO-12 APC (Angled Physical Contact — GREEN boot/housing)**.
  - **Multi-Mode (SR4 / SR8)** traditionally uses **MPO UPC (Flat — Aqua/Magenta housing)**, though newer 400G/800G SR4/VR4 may use APC.
  - **NEVER mate an APC (angled) ferrule with a UPC (flat) ferrule** — this physically crushes the glass fiber end-faces and causes massive reflection/return loss!

### Step 2: Diagnose via `mlxlink -m` DOM Readings
1. **All Lanes Rx Power = `-40 dBm` (Loss of Signal), Local Tx Power = Normal (`~0 dBm`)**:
   - Check if switch port is administratively disabled (`Polling`).
   - Verify patch panel / trunk cross-connect polarity (Type A vs Type B rollover).
   - Inspect fiber for tight bend radius (`< 30mm`) or pinch points in cable management arms (CMA).
2. **1 or 2 Lanes Have Low Rx Power (`> 3 dBm` lower than neighbor lanes) or High Raw BER**:
   - **#1 Cause: Contamination on MPO fiber end-face.**
   - Action: Use a **1-click MPO mechanical cleaner** on both the cable ferrule and inside the transceiver bulkhead adapter (and inspect with a fiber scope if available).
3. **Local Tx Power Low (`< -8 dBm`) or `Tx Fault` Flag Asserted on 1+ Lanes**:
   - Local transceiver laser is failing. Reseat the module once; if `Tx Power` remains low, **swap and RMA the transceiver**.
4. **DOM Shows Healthy Rx/Tx Power (`-1.5 dBm` on all lanes), But Link Stays in `Training` or Has High BER**:
   - Suspect **APC/UPC mismatch**, damaged fiber core, or defective transceiver DSP/CDR.
   - Perform an **A/B Cross-Swap**:
     - Swap the fiber between Port A and Port B on the host.
     - *If the fault follows the fiber* -> Replace fiber/patch cord or switch-side optic.
     - *If the fault stays on the host port* -> Swap the host transceiver with a known-good adjacent port.
     - *If the fault still stays on the host port after transceiver swap* -> Inspect HCA cage pins; escalate for **HCA replacement**.

---

## 4. ConnectX-7 / ConnectX-8 & BlueField-3 PCIe / Thermal Checks

```bash
# Check HCA / DPU internal ASIC temperature (Read-Only)
mget_temp -d mlx5_0         # Or via mlxlink / sensors / ipmitool

# Check PCIe link speed and width (Should be Gen5 x16 for 400G NDR / ConnectX-7)
lspci -vvv -s <hca_bdf> | grep -E "LnkCap:|LnkSta:|Product Name:|SN:"

# Check dmesg for mlx5 firmware syndromes, PCIe AER, or CRDUMP events
dmesg -T | grep -E -i "mlx5|syndrome|health buffer|AER|pcie"
```
- **PCIe Width Degradation (`Width x8` instead of `x16`)**: Caps bandwidth at ~200Gbps and triggers NCCL regressions. Reseat HCA / riser cable / MCIO connector.
- **`mlx5_core: health buffer` / `fw_synd`**: Firmware assert on the HCA. Collect `mst status -v`, `flint -d <dev> q` (read-only FW query), and kernel logs before requesting approval for a node reboot or HCA RMA.
