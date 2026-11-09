package main

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
)

// Symptom is a decoded diagnostic report for a pasted error line.
type Symptom struct {
	ID       string
	Sev      string // "crit", "warn", "info"
	Layer    string
	Title    string
	Meaning  string
	Next     string
	Steps    [][2]string // [title, command]
	Sheet    string
}

// Sample errors for quick one-key testing on the Mission Control home page.
var DecoderSamples = [][2]string{
	{"Xid 79", "NVRM: Xid (PCI:0000:8a:00): 79, pid=48213, name=python, GPU has fallen off the bus."},
	{"EDAC CE", "EDAC MC0: 3 CE memory read error on CPU_SrcID#0_MC#0_Chan#1_DIMM#0 (channel:1 slot:0 page:0x1f3a5)"},
	{"IB Polling", "mlx5_4 Physical state: Polling"},
	{"PCIe AER", "pcieport 0000:3a:00.0: AER: Corrected error received: 0000:3b:00.0 — BadTLP"},
	{"NVMe Timeout", "nvme nvme3: I/O 812 QID 14 timeout, aborting"},
}

var xidCatalog = map[int]struct {
	Sev, Layer, Title, Meaning, Next string
}{
	13:  {"warn", "Software / application", "Graphics engine exception", "Usually an application fault such as an out-of-range memory access. If it repeats across different jobs on the same GPU, treat it as a hardware suspect.", "Check whether other jobs on this GPU hit it too. If it follows the GPU rather than the job, drain the node and run dcgmi diag -r 3."},
	31:  {"warn", "Software / application", "GPU memory page fault (MMU fault)", "An application touched memory it does not own. Almost always a user code or framework bug, rarely the driver.", "Hand back to the job owner with the PID and timestamp. Only escalate if it repeats with known-good workloads."},
	43:  {"warn", "Software / application", "GPU stopped processing", "The GPU stopped running the work it was given, usually an application or driver fault. The GPU is normally still healthy.", "Check for a preceding Xid. If it recurs with no app change, capture nvidia-bug-report.sh."},
	45:  {"info", "Software / transient", "Preemptive cleanup", "The driver is cleaning up after a process was killed, often because of an earlier Xid. On its own it is not a fault.", "Look at the Xid logged just before this one. That is the real event."},
	48:  {"crit", "Hard silicon (HBM)", "Double-bit ECC error (DBE)", "Uncorrectable memory error on the GPU. The running job is lost. The GPU may remap the row on next reset.", "Drain the node, then reset the GPU (ask first). If remapping failed or DBEs recur, RMA the GPU."},
	61:  {"crit", "Firmware / silicon", "Internal micro-controller breakpoint", "The GPU's internal controller hit a fault. Work on the GPU stalls.", "Drain and reset the GPU or reboot (ask first). Recurring after a driver update → driver/VBIOS issue; recurring otherwise → RMA."},
	62:  {"crit", "Firmware / silicon", "Internal micro-controller halt", "The GPU's internal controller halted. The GPU is unusable until reset.", "Drain, reset or reboot (ask first), and capture nvidia-bug-report.sh. Recurring → RMA."},
	63:  {"warn", "Hard silicon (HBM)", "ECC page retirement / row remap recorded", "The GPU recorded a bad memory row to retire or remap. Takes effect only after a GPU reset.", "Check remapped rows. If Pending: Yes, schedule a drain and GPU reset."},
	64:  {"crit", "Hard silicon (HBM)", "Row remap / page retirement failure", "The GPU could not record a bad memory row. No spare rows are left, or the remap failed. Hard failure.", "Drain the node and open an RMA for this GPU with serial, BDF and the remap counts."},
	74:  {"crit", "NVLink / Layer-1", "NVLink error", "An NVLink lane between this GPU and the NVSwitch/peer failed or retrained. Multi-GPU jobs fail or slow down.", "Check which link. Correlate with Fabric Manager logs and SXids. Repeated on one link → baseboard / GPU seating → RMA."},
	79:  {"crit", "PCIe / power / Layer-1", "GPU has fallen off the bus", "The GPU stopped responding on PCIe. Causes: power delivery, thermal trip, riser/cable, or a failed GPU. Driver cannot reach it until reset or reboot.", "Run nvidia-bug-report.sh before rebooting. Check SEL for PSU/thermal events at the same time. Reseat GPU / riser if it recurs, then RMA."},
	92:  {"warn", "Hard silicon (HBM)", "High single-bit ECC error rate", "Correctable memory errors are arriving fast. Memory is degrading even though jobs still run.", "Trend the volatile and aggregate SBE counts. Rising → plan a drain and RMA."},
	94:  {"warn", "Hard silicon (HBM)", "Contained ECC error", "Uncorrectable memory error that the GPU contained to one application. Other work on the GPU is unaffected.", "Restart the affected job. Check row remap status. Repeated on the same GPU → RMA."},
	95:  {"crit", "Hard silicon (HBM)", "Uncontained ECC error", "Uncorrectable memory error the GPU could not isolate. All work on the GPU is affected.", "Drain the node and reset the GPU (ask first). Check row remap. Recurring → RMA."},
	119: {"crit", "Firmware / driver (GSP)", "GSP RPC timeout", "The driver timed out talking to the GPU System Processor. The GPU is hung.", "Capture nvidia-bug-report.sh, drain and reset/reboot (ask first). Fleet-wide → driver version issue, not hardware."},
	120: {"crit", "Firmware / driver (GSP)", "GSP error", "The GPU System Processor reported an error. Usually needs a GPU reset.", "Capture nvidia-bug-report.sh, drain and reset (ask first). Compare driver/VBIOS with healthy nodes."},
}

type entities struct {
	bdf, hca, nvme, disk, iface, dimm string
}

func extractEntities(raw string) entities {
	var ent entities
	// BDF (0000:8a:00 or 8a:00.0)
	reBDF := regexp.MustCompile(`(?i)(?:received:\s*)?(?:[0-9a-f]{4}:)?([0-9a-f]{2}:[0-9a-f]{2}(?:\.[0-7])?)`)
	if m := reBDF.FindStringSubmatch(raw); len(m) > 1 {
		ent.bdf = m[1]
	}
	// HCA mlx5_X
	reHCA := regexp.MustCompile(`\bmlx5_\d+\b`)
	if m := reHCA.FindString(raw); m != "" {
		ent.hca = m
	}
	// NVMe
	reNVMe := regexp.MustCompile(`\bnvme\d+(?:n\d+)?\b`)
	if m := reNVMe.FindString(raw); m != "" {
		ent.nvme = m
	}
	// Disk
	reDisk := regexp.MustCompile(`\bdev\s+(sd[a-z]+|nvme\d+n\d+)\b`)
	if m := reDisk.FindStringSubmatch(raw); len(m) > 1 {
		ent.disk = m[1]
	}
	// Interface
	reIF := regexp.MustCompile(`\b(ib\d+|eth\d+|en[ops]\w+|bond\d+)\b`)
	if m := reIF.FindStringSubmatch(raw); len(m) > 1 {
		ent.iface = m[1]
	}
	// DIMM
	reDIMM := regexp.MustCompile(`(?i)\b(CPU_SrcID#\d+_MC#\d+_Chan#\d+_DIMM#\d+|DIMM[_ ]?[A-H]\d)\b`)
	if m := reDIMM.FindStringSubmatch(raw); len(m) > 1 {
		ent.dimm = m[1]
	}
	return ent
}

// DecodeSymptom parses raw log lines into an actionable datacenter diagnostic report.
func DecodeSymptom(raw string) *Symptom {
	q := strings.TrimSpace(raw)
	if len(q) < 4 {
		return nil
	}
	qLower := strings.ToLower(q)
	ent := extractEntities(q)

	// 1. Xid check
	if strings.Contains(qLower, "xid") {
		clean := regexp.MustCompile(`(?i)\(pci:[^)]*\)`).ReplaceAllString(q, "")
		re := regexp.MustCompile(`(?i)\bxid\b[^0-9]{0,6}(\d{1,3})\b`)
		if m := re.FindStringSubmatch(clean); len(m) > 1 {
			num, _ := strconv.Atoi(m[1])
			meta, ok := xidCatalog[num]
			if !ok {
				meta = struct {
					Sev, Layer, Title, Meaning, Next string
				}{"warn", "GPU", "Uncataloged Xid", fmt.Sprintf("Xid %d is not in the common quick table. Check vendor docs.", num), "Capture nvidia-bug-report.sh and dmesg context."}
			}
			gpuTarget := ent.bdf
			if gpuTarget == "" {
				gpuTarget = "$GPU"
			}
			steps := [][2]string{
				{"Map BDF ↔ index ↔ serial", "nvidia-smi --query-gpu=index,pci.bus_id,serial,uuid --format=csv"},
				{"All Xids on node in order", "dmesg -T | grep -i \"NVRM: Xid\""},
				{"ECC + row remap state", "nvidia-smi -q -d ECC,ROW_REMAPPER -i " + gpuTarget},
			}
			if num == 74 {
				steps = append(steps, [2]string{"NVLink state & errors", "nvidia-smi nvlink -s -i " + gpuTarget + " && nvidia-smi nvlink -e -i " + gpuTarget})
			}
			if num == 79 {
				steps = append(steps, [2]string{"Is device still on PCIe bus?", "sudo lspci -vvv -s " + gpuTarget + " | grep -E \"LnkSta:|UESta:|CESta:\""})
				steps = append(steps, [2]string{"Check BMC SEL for power/thermal trip", "ipmitool sel elist | tail -n 40"})
			}
			return &Symptom{
				ID:      "xid",
				Sev:     meta.Sev,
				Layer:   meta.Layer,
				Title:   fmt.Sprintf("Xid %d — %s", num, meta.Title),
				Meaning: meta.Meaning,
				Next:    meta.Next,
				Steps:   steps,
				Sheet:   "nv-smi.html",
			}
		}
	}

	// 2. InfiniBand / mlx5
	if strings.Contains(qLower, "polling") || strings.Contains(qLower, "symbolerror") || strings.Contains(qLower, "linkdowned") || strings.Contains(qLower, "link down") && strings.Contains(qLower, "ib") {
		hca := ent.hca
		if hca == "" {
			hca = "$HCA"
		}
		return &Symptom{
			ID:      "ib",
			Sev:     "warn",
			Layer:   "InfiniBand / Layer-1 Optics",
			Title:   "InfiniBand link down, polling or erroring",
			Meaning: "\"Polling\" means the port sees no link partner. Symbol errors or high BER indicate degraded physical signal: dirty MPO fiber, weak transceiver, or damaged cable.",
			Next:    "Inspect DOM optical power per lane. Clean both MPO ends, reseat the optic, then A/B swap with a known-good link.",
			Steps: [][2]string{
				{"Port state & rate", "ibstat " + hca},
				{"DOM light levels, BER & eye margin", "sudo mlxlink -d " + hca + " -m -c -e"},
				{"Extended error counters", "perfquery -x"},
			},
			Sheet: "ib-mlxlink.html",
		}
	}

	// 3. EDAC memory error
	if strings.Contains(qLower, "edac") || strings.Contains(qLower, "memory read error") || strings.Contains(qLower, "uncorrectable ecc") {
		isUE := strings.Contains(qLower, "ue") || strings.Contains(qLower, "uncorrect")
		sev := "warn"
		title := "Correctable DRAM error (CE)"
		meaning := "ECC corrected a DRAM single-bit error. One CE is normal noise; a steadily rising rate on one DIMM signals impending failure."
		if isUE {
			sev = "crit"
			title = "Uncorrectable DRAM error (UE)"
			meaning = "Main memory error that ECC could not recover. The kernel panicked or killed the offending process. Suspect the named DIMM."
		}
		return &Symptom{
			ID:      "edac",
			Sev:     sev,
			Layer:   "Hard silicon (DIMM)",
			Title:   title,
			Meaning: meaning,
			Next:    "Drain node. Reseat DIMM or swap with neighbour to see if fault follows the module (module RMA) or stays on slot (motherboard).",
			Steps: [][2]string{
				{"EDAC error counts per DIMM", "edac-util -v"},
				{"Hardware RAS error history", "sudo ras-mc-ctl --errors"},
				{"BMC SEL memory logs", "ipmitool sel elist | grep -iE \"ecc|memory\""},
				{"Map DIMM slot to Serial/Part#", "sudo dmidecode -t memory | grep -E \"Locator|Serial|Part Number\" | paste - - - -"},
			},
			Sheet: "ecc-edac.html",
		}
	}

	// 4. PCIe AER
	if strings.Contains(qLower, "aer") || strings.Contains(qLower, "badtlp") || strings.Contains(qLower, "baddllp") || strings.Contains(qLower, "surprise down") {
		isFatal := strings.Contains(qLower, "uncorrect") || strings.Contains(qLower, "fatal") || strings.Contains(qLower, "surprise")
		sev := "warn"
		title := "PCIe corrected error (AER)"
		meaning := "The PCIe bus is replaying corrupted packets (bad TLPs / receiver errors). Signal integrity issue: dirty PCIe slot, cable, or loose riser."
		if isFatal {
			sev = "crit"
			title = "PCIe uncorrectable fatal error (AER)"
			meaning = "PCIe link lost unrecoverable traffic. The endpoint device has likely dropped off the bus."
		}
		bdf := ent.bdf
		if bdf == "" {
			bdf = "<bdf>"
		}
		return &Symptom{
			ID:      "aer",
			Sev:     sev,
			Layer:   "PCIe / Layer-1",
			Title:   title,
			Meaning: meaning,
			Next:    "Reseat PCIe card, riser and power cables. If error recurs, swap card to another PCIe slot to isolate card vs riser/slot.",
			Steps: [][2]string{
				{"Inspect link status & error registers", "sudo lspci -vvv -s " + bdf + " | grep -E \"LnkCap:|LnkSta:|UESta:|CESta:\""},
				{"Find all downgraded links on host", "sudo lspci -vvv | grep -B 30 \"downgraded\" | grep -E \"^[0-9a-f]{2}:|LnkSta:\""},
				{"Recent AER kernel timestamps", "dmesg -T | grep -i aer | tail -n 30"},
			},
			Sheet: "pcie-numa.html",
		}
	}

	// 5. NVMe controller timeout
	if strings.Contains(qLower, "nvme") && (strings.Contains(qLower, "timeout") || strings.Contains(qLower, "controller is down") || strings.Contains(qLower, "resetting")) {
		disk := ent.nvme
		if disk == "" {
			disk = "nvme0n1"
		}
		return &Symptom{
			ID:      "nvme",
			Sev:     "crit",
			Layer:   "Storage controller / drive",
			Title:   "NVMe controller timeout / reset",
			Meaning: "The drive stopped responding to I/O requests within the timeout threshold and the kernel issued a controller reset. Causes: failing NAND, drive firmware crash, or backplane connection fault.",
			Next:    "Check SMART critical warning and media error logs. If error follows drive to another bay, RMA drive. If it stays with bay, inspect backplane.",
			Steps: [][2]string{
				{"List all NVMe drives and serials", "sudo nvme list"},
				{"SMART health, wear & media errors", "sudo nvme smart-log /dev/" + disk},
				{"Controller internal error log", "sudo nvme error-log /dev/" + disk + " | head -n 40"},
				{"Kernel dmesg history for drive", "dmesg -T | grep -i nvme | tail -n 30"},
			},
			Sheet: "nvme-smart.html",
		}
	}

	// 6. Thermal / Over-temp
	if strings.Contains(qLower, "temperature") || strings.Contains(qLower, "thermal trip") || strings.Contains(qLower, "fan") && strings.Contains(qLower, "fail") {
		return &Symptom{
			ID:      "thermal",
			Sev:     "warn",
			Layer:   "Thermals & Cooling",
			Title:   "Thermal threshold exceeded / Fan fault",
			Meaning: "A temperature sensor crossed upper critical limits or a cooling fan stopped. The system will throttle CPUs/GPUs to protect silicon and may trigger shutdown.",
			Next:    "Inspect ambient rack temperature, verify fan modules are spinning, check for missing blanking panels or air baffle blockage.",
			Steps: [][2]string{
				{"Query temperatures & fan RPM", "ipmitool sdr type Temperature; ipmitool sdr type Fan"},
				{"Check CPU thermal throttle counts", "grep -H . /sys/devices/system/cpu/cpu0/thermal_throttle/*_count 2>/dev/null"},
				{"Check GPU temperatures & throttling", "nvidia-smi -q -d TEMPERATURE,PERFORMANCE"},
			},
			Sheet: "ipmi-sensors-sdr.html",
		}
	}

	return nil
}
