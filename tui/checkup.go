package main

import (
	"fmt"
	"strings"

	"charm.land/lipgloss/v2"
)

// CheckItem represents one subsystem diagnostic result in the checkup sweep.
type CheckItem struct {
	Subsys  string
	Title   string
	Summary string
	Sev     string // "ok", "warn", "crit"
}

// CheckupData holds the complete node checkup report card.
type CheckupData struct {
	Host    string
	Vendor  string
	Model   string
	BIOS    string
	Uptime  string
	Cores   int
	Score   int
	Crit    int
	Warn    int
	OK      int
	Verdict string
	Checks  []CheckItem
}

// DefaultSampleCheckup returns the broken H200 node checkup sample from common.js.
func DefaultSampleCheckup() CheckupData {
	return CheckupData{
		Host:    "gpu-node12",
		Vendor:  "Supermicro",
		Model:   "SYS-821GE-TNHR",
		BIOS:    "2.1a",
		Uptime:  "up 41 days, 6:02",
		Cores:   224,
		Score:   78,
		Crit:    1,
		Warn:    2,
		OK:      14,
		Verdict: "78/100 · 1 Critical (GPU 4 row remap failure), 2 Warnings (IB link down, PCIe AER)",
		Checks: []CheckItem{
			{"Scheduler", "Slurm Drain State", "Node drained: 'GPU 4 row remap failure / RMA triage'", "warn"},
			{"GPUs", "NVIDIA H200 Telemetry", "8 GPUs seen; GPU 4 reports uncorrectable row remap failure", "crit"},
			{"NVLink", "NVSwitch Fabric", "All NVSwitches trained; Fabric Manager active (OK)", "ok"},
			{"Kernel", "PCIe AER & Xid", "pcieport 0000:89:00.0 AER corrected error BadTLP received", "warn"},
			{"Memory", "CPU DRAM ECC / EDAC", "0 CE, 0 UE across all 32 DDR5-5600 DIMMs", "ok"},
			{"InfiniBand", "Mellanox ConnectX-7", "7 ports 400 Gb/s NDR ACTIVE; mlx5_3 DOWN (Polling)", "warn"},
			{"Storage", "Enterprise NVMe Health", "4x Micron 7450 NVMe drives: 0 media errors, 100% spare", "ok"},
			{"Systemd", "Core Daemons", "0 failed units; nv-fabricmanager, containerd, kubelet active", "ok"},
			{"Filesystem", "Disk Capacity", "/ at 42%, /var at 68% (no filesystems over 85%)", "ok"},
		},
	}
}

// RenderCheckup formats the node checkup report card into a clean TUI screen.
func RenderCheckup(ck CheckupData, width, height int) string {
	var b []string

	scoreBadge := stOK.Render(fmt.Sprintf("%d/100 EXCELLENT", ck.Score))
	if ck.Score < 80 {
		scoreBadge = stRoot.Render(fmt.Sprintf("%d/100 ATTENTION NEEDED", ck.Score))
	}
	if ck.Crit > 0 {
		scoreBadge = stDanger.Render(fmt.Sprintf("%d/100 CRITICAL FAULT", ck.Score))
	}

	colW := max(20, width-4)
	wrap := lipgloss.NewStyle().Width(colW)
	fit := lipgloss.NewStyle().MaxWidth(max(20, width))

	header := stTitle.Render("Node Checkup") + "  " + scoreBadge + "  " + stDim.Render("["+ck.Host+" · "+ck.Vendor+" "+ck.Model+"]")
	rule := stRule.Render(strings.Repeat("─", max(20, width)))
	b = append(b, fit.Render(header))
	b = append(b, fit.Render(stDim.Render(fmt.Sprintf("%s · %d Cores · BIOS %s · %s", ck.Uptime, ck.Cores, ck.BIOS, ck.Verdict))))
	b = append(b, rule, "")

	for _, c := range ck.Checks {
		mark := stOK.Render("✓ ")
		pill := stOK.Render("[OK]")
		switch c.Sev {
		case "crit":
			mark = stDanger.Render("✖ ")
			pill = stDanger.Render("[CRIT]")
		case "warn":
			mark = stRoot.Render("▲ ")
			pill = stRoot.Render("[WARN]")
		}

		titleLine := mark + stTitle.Render(c.Subsys+" › "+c.Title) + "  " + pill
		b = append(b, fit.Render(titleLine))
		b = append(b, "   "+wrap.Render(stDim.Render(c.Summary)))
		b = append(b, "")
	}

	b = append(b, rule)
	b = append(b, wrap.Render(stDim.Render("Press [Esc] to return to Mission Control · [x] Node X-Ray · [r] Runbooks · [/] Search")))

	return strings.Join(b, "\n")
}
