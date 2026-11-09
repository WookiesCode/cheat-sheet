package main

import (
	"fmt"
	"strings"

	"charm.land/lipgloss/v2"
)

// GPUSlot is one GPU in the physical tray elevation.
type GPUSlot struct {
	Index         int
	BDF           string
	Serial        string
	Model         string
	TempGPU       int
	TempMem       int
	Power         float64
	UncorrECC     int
	RemapPending  bool
	RemapFailure  bool
	LinkGen       int
	LinkWidth     int
	Throttle      string
	Ghost         bool // lost from bus
	Sev           string // "ok", "warn", "crit"
}

// NICSlot is an InfiniBand/Ethernet NIC port.
type NICSlot struct {
	Dev  string
	Up   bool
	Rate string
}

// XRayData holds the parsed telemetry for the HGX / PCIe node tray.
type XRayData struct {
	Host    string
	Model   string
	GPUs    []GPUSlot
	NICs    []NICSlot
	Verdict string
}

// DefaultSampleXRay returns the standard datacenter H200 node tray sample from common.js.
func DefaultSampleXRay() XRayData {
	return XRayData{
		Host:    "gpu-node12",
		Model:   "NVIDIA H200 SXM 141GB",
		Verdict: "8 of 8 GPUs seen · GPU 3 thermal throttling (84°C mem) · GPU 4 row remap failure",
		GPUs: []GPUSlot{
			{Index: 0, BDF: "0000:18:00.0", Serial: "1652823051234", Model: "H200", TempGPU: 41, TempMem: 49, Power: 312.4, LinkGen: 5, LinkWidth: 16, Sev: "ok"},
			{Index: 1, BDF: "0000:2a:00.0", Serial: "1652823051877", Model: "H200", TempGPU: 43, TempMem: 51, Power: 318.0, LinkGen: 5, LinkWidth: 16, Sev: "ok"},
			{Index: 2, BDF: "0000:3a:00.0", Serial: "1652823050991", Model: "H200", TempGPU: 40, TempMem: 48, Power: 305.8, LinkGen: 5, LinkWidth: 16, Sev: "ok"},
			{Index: 3, BDF: "0000:5d:00.0", Serial: "1652823052410", Model: "H200", TempGPU: 66, TempMem: 84, Power: 296.1, LinkGen: 5, LinkWidth: 16, Throttle: "HW Thermal Slowdown", Sev: "warn"},
			{Index: 4, BDF: "0000:9a:00.0", Serial: "1652823051509", Model: "H200", TempGPU: 42, TempMem: 50, Power: 309.5, UncorrECC: 2, RemapPending: true, RemapFailure: true, LinkGen: 5, LinkWidth: 16, Sev: "crit"},
			{Index: 5, BDF: "0000:ba:00.0", Serial: "1652823051302", Model: "H200", TempGPU: 41, TempMem: 48, Power: 314.2, LinkGen: 5, LinkWidth: 16, Sev: "ok"},
			{Index: 6, BDF: "0000:ca:00.0", Serial: "1652823051119", Model: "H200", TempGPU: 44, TempMem: 52, Power: 317.8, LinkGen: 5, LinkWidth: 16, Sev: "ok"},
			{Index: 7, BDF: "0000:da:00.0", Serial: "1652823052003", Model: "H200", TempGPU: 42, TempMem: 49, Power: 311.0, LinkGen: 5, LinkWidth: 16, Sev: "ok"},
		},
		NICs: []NICSlot{
			{Dev: "mlx5_0", Up: true, Rate: "400Gb/s"},
			{Dev: "mlx5_1", Up: true, Rate: "400Gb/s"},
			{Dev: "mlx5_2", Up: true, Rate: "400Gb/s"},
			{Dev: "mlx5_3", Up: false, Rate: "Down (Polling)"},
			{Dev: "mlx5_4", Up: true, Rate: "400Gb/s"},
			{Dev: "mlx5_5", Up: true, Rate: "400Gb/s"},
			{Dev: "mlx5_6", Up: true, Rate: "400Gb/s"},
			{Dev: "mlx5_7", Up: true, Rate: "400Gb/s"},
		},
	}
}

// RenderXRay formats the complete HGX tray elevation into a visual TUI screen.
func RenderXRay(xr XRayData, width, height int) string {
	var b []string

	wrap := lipgloss.NewStyle().Width(max(20, width))

	header := stTitle.Render("Node X-Ray") + "  " + stAccent.Render(xr.Model) + "  " + stDim.Render("["+xr.Host+"]")
	rule := stRule.Render(strings.Repeat("─", max(20, width)))
	b = append(b, wrap.Render(header), wrap.Render(stDim.Render(xr.Verdict)), rule, "")

	// 8-GPU Tray: 2 rows of 4 cards on wide screens, or stacked
	cardWidth := (width - 10) / 4
	if cardWidth < 22 {
		cardWidth = max(20, (width-4)/2)
	}

	renderGPUCard := func(gpu GPUSlot, w int) string {
		var lines []string
		title := fmt.Sprintf("GPU %d (%s)", gpu.Index, gpu.BDF)
		borderColor := lipgloss.Color("8")
		titleStyle := stTitle
		switch gpu.Sev {
		case "crit":
			borderColor = lipgloss.Color("1")
			title = fmt.Sprintf("GPU %d [CRIT]", gpu.Index)
			titleStyle = stDanger
		case "warn":
			borderColor = lipgloss.Color("3")
			title = fmt.Sprintf("GPU %d [WARN]", gpu.Index)
			titleStyle = stRoot
		}

		lines = append(lines, titleStyle.Render(truncate(title, w-4)))
		lines = append(lines, fmt.Sprintf("Core: %d°C · Mem: %d°C", gpu.TempGPU, gpu.TempMem))
		lines = append(lines, fmt.Sprintf("%.0f W · Gen%d x%d", gpu.Power, gpu.LinkGen, gpu.LinkWidth))

		if gpu.RemapFailure {
			lines = append(lines, stDanger.Render("⚠ Remap Failure!"))
		} else if gpu.Throttle != "" {
			lines = append(lines, stRoot.Render("⚠ "+truncate(gpu.Throttle, w-4)))
		} else {
			lines = append(lines, stOK.Render("ECC: 0 · Remap: OK"))
		}

		box := lipgloss.NewStyle().
			Width(w).
			Border(lipgloss.RoundedBorder()).
			BorderForeground(borderColor).
			Padding(0, 1)

		return box.Render(strings.Join(lines, "\n"))
	}

	if len(xr.GPUs) >= 8 && width >= 90 {
		var row1Cards, row2Cards []string
		for i := 0; i < 4; i++ {
			row1Cards = append(row1Cards, renderGPUCard(xr.GPUs[i], cardWidth))
			row2Cards = append(row2Cards, renderGPUCard(xr.GPUs[i+4], cardWidth))
		}
		row1 := lipgloss.JoinHorizontal(lipgloss.Top, row1Cards[0], " ", row1Cards[1], " ", row1Cards[2], " ", row1Cards[3])
		row2 := lipgloss.JoinHorizontal(lipgloss.Top, row2Cards[0], " ", row2Cards[1], " ", row2Cards[2], " ", row2Cards[3])
		b = append(b, row1, row2)
	} else {
		for _, g := range xr.GPUs {
			b = append(b, renderGPUCard(g, width-2))
		}
	}

	b = append(b, "", stTitle.Render("Fabric & NICs (InfiniBand 400G NDR):"))
	var nicPills []string
	for _, n := range xr.NICs {
		if n.Up {
			nicPills = append(nicPills, stOK.Render(fmt.Sprintf("[%s: UP %s]", n.Dev, n.Rate)))
		} else {
			nicPills = append(nicPills, stDanger.Render(fmt.Sprintf("[%s: %s]", n.Dev, n.Rate)))
		}
	}
	b = append(b, lipgloss.NewStyle().Width(width).Render(strings.Join(nicPills, " ")))

	b = append(b, "", rule)
	b = append(b, wrap.Render(stDim.Render("Press [Esc] to return to Mission Control · [c] Checkup · [r] Runbooks · [/] Search")))

	return strings.Join(b, "\n")
}
