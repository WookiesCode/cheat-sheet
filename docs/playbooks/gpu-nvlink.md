# GPU, NVLink & NVSwitch Troubleshooting Playbook (`gpu-nvlink.md`)

Covers **NVIDIA H200 (Hopper)**, **B200 (Blackwell)**, **NVSwitch Gen3/Gen4**, and **RTX Enterprise/Pro** PCIe GPUs.

---

## 1. Quick Non-Destructive Triage Commands

Run these read-only checks first and save outputs to `cases/<id>/logs/`:

```bash
# 1. Overall GPU status, driver/CUDA version, and active compute PIDs
nvidia-smi

# 2. Full telemetry dump (Serials, VBIOS, PCIe link width/speed, ECC, Row Remap, Temps, Clocks)
nvidia-smi -q > cases/<id>/logs/nvidia-smi-q.txt

# 3. Quick tabular view of BDF, Serial, UUID, Persistence Mode, ECC, Temp, Power
nvidia-smi --query-gpu=index,name,serial,uuid,pci.bus_id,vbios_version,temperature.gpu,temperature.memory,power.draw,ecc.errors.uncorrected.volatile.total,ecc.errors.uncorrected.aggregate.total --format=csv

# 4. Row Remapper status (H200 / B200 HBM3/HBM3e critical health indicator)
nvidia-smi -q -d ROW_REMAPPER

# 5. NVLink status, link speeds, and error counters across all GPUs
nvidia-smi nvlink -s
nvidia-smi nvlink -e

# 6. Topology matrix (Verify all GPUs see NVSwitch / expected NUMA & NIC affinity)
nvidia-smi topo -m

# 7. Fabric Manager & NVSwitch SXid status (HGX H200 / B200 nodes)
systemctl status nvidia-fabricmanager
journalctl -u nvidia-fabricmanager --no-pager -n 200

# 8. Extract Xid and SXid errors from kernel ring buffer with human timestamps
dmesg -T | grep -E -i "NVRM: Xid|nvidia-nvswitch: SXid|AER|pcieport|fallen off the bus"
```

---

## 2. Xid & SXid Error Decoding Matrix

In `dmesg -T`, look for `NVRM: Xid (PCI:0000:xx:00): <Code>, ...`:

| Xid Code | Meaning | Typical Root Cause & Technician Action |
| :--- | :--- | :--- |
| **Xid 13** | Graphics Engine Exception | Usually user application / illegal memory access. Not hardware unless paired with Xid 48/63/94. |
| **Xid 31** | GPU Memory Page Fault | Application bug or out-of-bounds pointer. Ignore for RMA unless accompanied by ECC/Row Remap errors. |
| **Xid 43** | GPU Stopped Processing | Application hang or TDR timeout. Check if accompanied by Xid 48/79/119. |
| **Xid 48** | **Double-Bit ECC Error (DBE)** | **Hardware Memory Fault.** Check `nvidia-smi -q -d ECC,ROW_REMAPPER`. Requires cold reboot/drain to trigger row remapping, or RMA if remapping fails. |
| **Xid 62** | Internal Microcontroller Halt | GPU internal firmware halt. Requires cold reset (GPU reset or power cycle). Frequent recurrence = RMA. |
| **Xid 63** | **Row Remap Recording Event (HBM)** | New HBM row marked for remapping in InfoROM. Drain node and perform a **GPU reset or cold reboot** to complete remap. |
| **Xid 64** | **Row Remap Failure** | **Immediate RMA.** HBM bank has exhausted spare rows (max 8 rows per bank on Hopper/Blackwell) or InfoROM write failed. |
| **Xid 74** | **NVLink Error** | Physical NVLink lane training/CRC/replay error between SXM module and NVSwitch baseboard. Check `nvidia-smi nvlink -e` and `SXid` logs. |
| **Xid 79** | **GPU Has Fallen Off The Bus** | **Critical PCIe / Power / Thermal drop.** GPU disappeared from PCIe tree. Check `lspci`, BMC SEL for PSU/VRD/thermal trips, PCIe AER errors, or SXM/PCIe seating. |
| **Xid 92** | High Single-Bit ECC Error Rate | Degrading HBM memory cell. Monitor Row Remapper and schedule maintenance drain. |
| **Xid 94** | **Contained ECC Error** | Uncorrectable ECC isolated to a single process. Check `ROW_REMAPPER`; reset GPU after draining. |
| **Xid 95** | **Uncontained ECC Error** | **Severe Hardware Fault.** Uncorrectable ECC in shared state or SRAM parity error. Requires immediate GPU reset; if SRAM uncorrectable > 0 or repeats, **RMA**. |
| **Xid 119 / 120** | **GSP RPC Timeout / GSP Error** | GPU System Processor (GSP) hung on H200/B200/RTX. Check for preceding Xid 48/74/79 or thermal throttling. Requires GPU reset or cold AC cycle. |
| **Xid 140** | Unrecoverable ECC Error | Blackwell / Hopper unrecoverable memory error. Check `nvidia-smi -q -d ECC,ROW_REMAPPER`. |
| **SXid (NVSwitch)** | `nvidia-nvswitch: SXid (PCI:0000:xx:00.0): <Code>` | **20000–28xxx**: NVSwitch port/link/routing faults. Correlate the NVSwitch PCIe BDF and link number with the connected GPU to isolate SXM module vs. HGX baseboard. |

---

## 3. HBM3 / HBM3e ECC & Row Remapping Rules (H200 & B200)

On H200 and B200 GPUs, dynamic page retirement is replaced by **Hardware Row Remapping**:
1. Inspect `nvidia-smi -q -d ROW_REMAPPER`:
   - `Pending : Yes` -> A faulty HBM row was detected, waiting for a GPU reset (`nvidia-smi -r`) or reboot to remap.
   - `Remapping Failure Occurred : Yes` -> **RMA Criteria Met.** The HBM bank ran out of spare rows.
   -Look at **Bank Remap Availability Histogram** (`Max`, `High`, `Partial`, `Low`, `None`):
     - If any bank is at `None` (0 spare rows left) and another DBE occurs in that bank, `Remapping Failure Occurred` flips to `Yes`.
2. Inspect `nvidia-smi -q -d ECC`:
   - **SRAM Uncorrectable Errors** (L1/L2 cache/register file): Unlike HBM DRAM, **SRAM cannot row-remap** as readily. Any persistent `SRAM Uncorrectable > 0` accompanied by Xid 48/95 is immediate RMA criteria.

---

## 4. Missing GPU / "Fallen Off the Bus" (Xid 79) Isolation

When `nvidia-smi` shows fewer GPUs than expected (e.g., 7/8 on HGX) or reports `Unable to determine the device handle for GPU 0000:xx:00.0`:

1. **Check PCIe Enumeration (Read-Only)**:
   ```bash
   # Count visible 3D controllers / NVIDIA devices
   lspci -nn | grep -i nvidia
   # Check the parent PCIe root port / switch downstream port link status
   lspci -vvv -s <parent_bridge_bdf> | grep -E "LnkSta:|LnkCap:|AER|UESta"
   ```
2. **Check BMC SEL & Power/Thermal Sensors (Read-Only)**:
   ```bash
   ipmitool sel elist | tail -n 50
   ipmitool sdr elist | grep -E -i "gpu|sxm|pwr|temp|vrd|leak"
   ```
3. **Physical / Layer-1 Isolation**:
   - **RTX / PCIe Cards**: Check 12VHPWR / 12V-2x6 / 8-pin auxiliary power seating, riser card gold fingers, and PCIe slot latch. Ensure PCIe Link Speed/Width matches `Gen5 x16` (or `Gen4 x16`) under load.
   - **H200 / B200 SXM Modules**: Check SXM socket torque/interposer history, 48V/54V busbar voltage, and coldplate/heatsink thermal deltas (`GPU Temp` vs `Memory Temp` — a delta > 25°C under load or sudden spike indicates TIM dry-out or coldplate seating issue).
4. **Recovery Sequence (Ask Permission First!)**:
   - Confirm node is drained in Slurm/K8s.
   - Attempt secondary bus reset or `nvidia-smi -r -i <id>` (often fails if Xid 79 dropped the device from PCIe).
   - Perform a **full DC power off, wait 60 seconds (or virtual AC cycle / flea power drain), and power on** to re-train PCIe and SXM power sequencers.

---

## 5. DCGM Diagnostics & RMA Evidence Collection

> **WARNING**: Never run `dcgmi diag -r 2`, `3`, or `4` or `nvidia-bug-report.sh` (if it hangs on locked GPUs) without checking active workloads first.

- **Level 1 (Safe / Read-only quick check)**: `dcgmi diag -r 1`
- **Level 2 / 3 / 4 (Intrusive — Requires Drained Node + User Approval)**:
  - `dcgmi diag -r 3` (Tests deployment, hardware, memory, PCIe, and targeted stress ~10-15 mins)
  - `dcgmi diag -r 4` (Extended pulse/stress test for intermittent Xids/thermals)
- **Official NVIDIA Bug Report**:
  - Run `sudo nvidia-bug-report.sh --output-file cases/<id>/logs/nvidia-bug-report.log.gz` (Note: if a GPU is hung on the bus, pass `--safe-mode` so the script doesn't hang).
