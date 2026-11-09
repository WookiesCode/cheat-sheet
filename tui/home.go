package main

import (
	"fmt"
	"strings"

	"charm.land/lipgloss/v2"
)

// RenderHome formats the Mission Control home screen with hero triage, live decoder,
// node cockpit (GPU tray), and the 5-step incident pipeline from AGENTS.md.
func RenderHome(inputView string, sym *Symptom, xr XRayData, ck CheckupData, width, height int) string {
	var b []string

	wrap := lipgloss.NewStyle().Width(max(20, width))
	fit := lipgloss.NewStyle().MaxWidth(max(20, width))

	header := stTitle.Render("dc-cheat") + "  " + stAccent.Render("Mission Control") + "  " + stDim.Render("Datacenter Field Reference · AGENTS.md Triage")
	rule := stRule.Render(strings.Repeat("─", max(20, width)))
	b = append(b, fit.Render(header), rule)

	// Hero: What's broken?
	heroTitle := stTitle.Render("WHAT'S BROKEN?")
	heroSub := wrap.Render(stDim.Render("Paste an error straight from dmesg, the SEL or mlxlink for a diagnosis, or search commands."))
	b = append(b, heroTitle, heroSub, inputView)

	// Quick sample pills
	var samplePills []string
	samplePills = append(samplePills, stDim.Render("Try sample error: "))
	for i, s := range DecoderSamples {
		samplePills = append(samplePills, stDim.Render(fmt.Sprintf("[%d: %s]", i+1, s[0])))
	}
	b = append(b, wrap.Render(strings.Join(samplePills, " ")), "")

	// If an error is decoded, show the Live Diagnosis card!
	if sym != nil {
		sevPill := stPillDanger.Render(" " + strings.ToUpper(sym.Sev) + " ")
		if sym.Sev == "warn" {
			sevPill = stPillRoot.Render(" " + strings.ToUpper(sym.Sev) + " ")
		}

		diagHeader := sevPill + " " + stTitle.Render(sym.Title) + "  " + stDim.Render("["+sym.Layer+"]")
		diagMeaning := sym.Meaning
		diagNext := stAccent.Render("Next Action: ") + sym.Next

		var diagLines []string
		diagLines = append(diagLines, diagHeader, "")
		diagLines = append(diagLines, lipgloss.NewStyle().Width(width-6).Render(diagMeaning), "")
		diagLines = append(diagLines, lipgloss.NewStyle().Width(width-6).Render(diagNext), "")
		diagLines = append(diagLines, stTitle.Render("Diagnostic steps:"))

		for _, step := range sym.Steps {
			diagLines = append(diagLines, fmt.Sprintf("  • %s:", stDim.Render(step[0])))
			diagLines = append(diagLines, "    "+stCmd.Render(step[1]))
		}

		diagBox := lipgloss.NewStyle().
			Width(width-2).
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("6")).
			Padding(0, 1)

		b = append(b, diagBox.Render(strings.Join(diagLines, "\n")), "")
	}

	// Cockpit & 5-Step Flow side-by-side or stacked
	flowW := width
	cockpitW := width
	if width >= 100 {
		flowW = width * 55 / 100
		cockpitW = width - flowW - 3
	}

	// 5-Step Incident Pipeline
	var flowLines []string
	flowLines = append(flowLines, stTitle.Render("INCIDENT FLOW (5-Step Method)"))
	flowLines = append(flowLines, fmt.Sprintf("  %s %s", stOK.Render("[1. Identify]"), stDim.Render("Node: "+ck.Host+" · BMC 10.240.12.45 · Drain verified")))
	flowLines = append(flowLines, fmt.Sprintf("  %s %s", stOK.Render("[2. Collect] "), stDim.Render("Node checkup (78/100) · 6 telemetry commands run")))
	flowLines = append(flowLines, fmt.Sprintf("  %s %s", stRoot.Render("[3. Correlate]"), stDim.Render("Node X-ray: GPU 4 remap failure · mlx5_3 polling")))
	flowLines = append(flowLines, fmt.Sprintf("  %s %s", stDim.Render("[4. Isolate]  "), stDim.Render("Runbooks: GPU Xid 79, IB cable clean & reseat")))
	flowLines = append(flowLines, fmt.Sprintf("  %s %s", stDim.Render("[5. Document] "), stDim.Render("Case evidence pinned · RMA ticket ready")))

	flowBox := lipgloss.NewStyle().Width(flowW).Render(strings.Join(flowLines, "\n"))

	// Node Cockpit (Mini GPU Tray)
	var cpLines []string
	scoreBadge := stRoot.Render(fmt.Sprintf("%d/100 ATTENTION", ck.Score))
	if ck.Crit > 0 {
		scoreBadge = stDanger.Render(fmt.Sprintf("%d/100 1 CRIT", ck.Score))
	}
	cpLines = append(cpLines, stTitle.Render("NODE COCKPIT")+"  "+scoreBadge+"  "+stDim.Render("["+ck.Host+"]"))

	// Mini GPU lights
	var gpuLights []string
	for _, g := range xr.GPUs {
		switch g.Sev {
		case "crit":
			gpuLights = append(gpuLights, stDanger.Render(fmt.Sprintf("[%d:!]", g.Index)))
		case "warn":
			gpuLights = append(gpuLights, stRoot.Render(fmt.Sprintf("[%d:▲]", g.Index)))
		default:
			gpuLights = append(gpuLights, stOK.Render(fmt.Sprintf("[%d:✓]", g.Index)))
		}
	}
	cpLines = append(cpLines, "GPUs: "+strings.Join(gpuLights[:4], " ")+"  "+strings.Join(gpuLights[4:], " "))

	// NIC status summary
	var nicLights []string
	for i, n := range xr.NICs {
		if i >= 4 {
			break
		}
		if n.Up {
			nicLights = append(nicLights, stOK.Render(n.Dev+":UP"))
		} else {
			nicLights = append(nicLights, stDanger.Render(n.Dev+":DOWN"))
		}
	}
	cpLines = append(cpLines, "NICs: "+strings.Join(nicLights, " ")+" ...")

	cockpitBox := lipgloss.NewStyle().Width(cockpitW).Render(strings.Join(cpLines, "\n"))

	if width >= 100 {
		sep := stRule.Render(strings.Repeat("│\n", 6))
		b = append(b, lipgloss.JoinHorizontal(lipgloss.Top, flowBox, " ", sep, " ", cockpitBox))
	} else {
		b = append(b, flowBox, "", cockpitBox)
	}

	b = append(b, "", rule)
	b = append(b, wrap.Render(stDim.Render("QUICK MODES:  [Enter] Search/Diagnose · [x] Node X-Ray · [c] Checkup · [r] Runbooks · [b] Browse · [1-5] Sample Error · [Esc] Quit")))

	return strings.Join(b, "\n")
}
