package main

import (
	"fmt"
	"strings"

	"charm.land/lipgloss/v2"
)

// RunbookStep is one sequential procedure step in a guided runbook.
type RunbookStep struct {
	Title   string
	Command string
	Desc    string
	Safety  string
}

// Runbook is a guided procedure for a specific datacenter hardware failure.
type Runbook struct {
	ID       string
	Title    string
	Subsys   string
	Severity string
	Steps    []RunbookStep
}

// Built-in datacenter guided runbooks from docs/playbooks/.
var RunbookCatalog = []Runbook{
	{
		ID:       "xid79",
		Title:    "GPU Fallen Off the Bus (Xid 79)",
		Subsys:   "NVIDIA GPU / PCIe",
		Severity: "crit",
		Steps: []RunbookStep{
			{
				Title:   "1. Drain node in Slurm / Kubernetes",
				Command: "scontrol update node=$(hostname -s) state=drain reason=\"GPU 79 triage\"",
				Desc:    "Prevent jobs from landing on the node before executing diagnostic commands.",
				Safety:  "Required before touching hardware or resetting controllers.",
			},
			{
				Title:   "2. Capture NVIDIA bug report before reset",
				Command: "sudo nvidia-bug-report.sh",
				Desc:    "Rebooting wipes the volatile GPU registers. Capture telemetry first for vendor RMA.",
				Safety:  "Read-only capture: saves nvidia-bug-report.log.gz in current directory.",
			},
			{
				Title:   "3. Verify PCIe endpoint status and AER registers",
				Command: "sudo lspci -vvv -s $GPU | grep -E \"LnkSta:|UESta:|CESta:\"",
				Desc:    "Checks whether the GPU is still responding on the PCIe bus and if AER logged a fatal error.",
				Safety:  "Read-only diagnostic.",
			},
			{
				Title:   "4. Inspect BMC event log for PSU / thermal trip",
				Command: "ipmitool sel elist | tail -n 40",
				Desc:    "Differentiates between GPU silicon failure vs power supply drop or thermal trip.",
				Safety:  "Read-only SEL log review.",
			},
			{
				Title:   "5. Execute chassis power cycle",
				Command: "sudo ipmitool power cycle",
				Desc:    "Warm reboot (reboot command) rarely resets PCIe power rails; cold power cycle required.",
				Safety:  "State changing: verify node drain first.",
			},
		},
	},
	{
		ID:       "ib-link",
		Title:    "InfiniBand Link Down, Polling or High BER",
		Subsys:   "InfiniBand / Optics",
		Severity: "warn",
		Steps: []RunbookStep{
			{
				Title:   "1. Check physical port state & speed",
				Command: "ibstat $HCA",
				Desc:    "Verify if state is Down, Polling (no partner), or Active (negotiated rate).",
				Safety:  "Read-only.",
			},
			{
				Title:   "2. Query optical power (DOM) and Physical BER",
				Command: "sudo mlxlink -d $HCA -m -c -e",
				Desc:    "Reads transceiver Rx/Tx power per lane, bit error rate, and eye diagram margins.",
				Safety:  "Read-only MFT diagnostic.",
			},
			{
				Title:   "3. Inspect and reset error counters",
				Command: "perfquery -x -R",
				Desc:    "Checks SymbolError and LinkDowned counters, then resets counters to trend fresh errors.",
				Safety:  "Resets port counters only.",
			},
			{
				Title:   "4. Inspect switch side via LLDP / Subnet Manager",
				Command: "sudo lldpctl $IFACE || ibnetdiscover",
				Desc:    "Find which switch port the transceiver is cabled to before physical intervention.",
				Safety:  "Read-only.",
			},
		},
	},
	{
		ID:       "edac-ue",
		Title:    "Uncorrectable DRAM ECC Error (EDAC UE)",
		Subsys:   "Memory / CPU",
		Severity: "crit",
		Steps: []RunbookStep{
			{
				Title:   "1. Cordon & drain compute node",
				Command: "scontrol update node=$(hostname -s) state=drain reason=\"DRAM UE triage\"",
				Desc:    "Stop new jobs from allocating corrupted memory addresses.",
				Safety:  "Drain first.",
			},
			{
				Title:   "2. Identify channel, slot and DIMM locator",
				Command: "edac-util -v; sudo ras-mc-ctl --errors",
				Desc:    "Parses Linux EDAC sysfs to identify which memory controller channel faulted.",
				Safety:  "Read-only.",
			},
			{
				Title:   "3. Map slot locator to serial number and part number",
				Command: "sudo dmidecode -t memory | grep -E \"Locator|Serial|Part Number\" | paste - - - -",
				Desc:    "Cross-references motherboard silk-screen locator with DIMM barcode for replacement.",
				Safety:  "Read-only DMI table lookup.",
			},
			{
				Title:   "4. Reseat or A/B swap with adjacent channel",
				Command: "# Swap DIMM A1 with B1; verify if error follows module or stays on socket",
				Desc:    "Isolates whether the DIMM module is defective (DIMM RMA) or the CPU socket/slot is damaged.",
				Safety:  "Physical server maintenance.",
			},
		},
	},
	{
		ID:       "nvme-timeout",
		Title:    "NVMe Drive Timeout & Controller Reset",
		Subsys:   "Storage / NVMe",
		Severity: "crit",
		Steps: []RunbookStep{
			{
				Title:   "1. Inspect NVMe namespace inventory",
				Command: "sudo nvme list",
				Desc:    "Confirms whether the controller is still detected or dropped from PCIe.",
				Safety:  "Read-only.",
			},
			{
				Title:   "2. Check SMART health, wear and media errors",
				Command: "sudo nvme smart-log /dev/$DISK",
				Desc:    "Reads Critical Warning bits, percentage used (endurance), media errors, and unsafe shutdowns.",
				Safety:  "Read-only controller log page.",
			},
			{
				Title:   "3. Read controller error log entries",
				Command: "sudo nvme error-log /dev/$DISK | head -n 40",
				Desc:    "Retrieves internal NVMe command submission/completion timeout entries.",
				Safety:  "Read-only.",
			},
			{
				Title:   "4. Review kernel storage dmesg messages",
				Command: "dmesg -T | grep -i nvme | tail -n 30",
				Desc:    "Checks for PCIe link retraining or controller abort logs.",
				Safety:  "Read-only.",
			},
		},
	},
}

// RenderRunbooks formats the guided playbooks list and active runbook into a clean TUI screen.
func RenderRunbooks(rbIndex, stepIndex int, width, height int) string {
	if rbIndex < 0 || rbIndex >= len(RunbookCatalog) {
		rbIndex = 0
	}
	rb := RunbookCatalog[rbIndex]

	var b []string
	colW := max(20, width-4)
	wrap := lipgloss.NewStyle().Width(colW)
	fit := lipgloss.NewStyle().MaxWidth(max(20, width))

	header := stTitle.Render("Guided Runbooks") + "  " + stAccent.Render(rb.Title) + "  " + stDim.Render(fmt.Sprintf("[%d of %d]", rbIndex+1, len(RunbookCatalog)))
	rule := stRule.Render(strings.Repeat("─", max(20, width)))
	b = append(b, fit.Render(header))
	b = append(b, fit.Render(stDim.Render("Safety → Evidence → Root Cause Decision → Physical Isolation → RMA")))
	b = append(b, rule, "")

	// Horizontal pills to switch runbooks
	var pills []string
	for i, r := range RunbookCatalog {
		p := fmt.Sprintf("[%d: %s]", i+1, r.Subsys)
		if i == rbIndex {
			pills = append(pills, stSelected.Render(p))
		} else {
			pills = append(pills, stDim.Render(p))
		}
	}
	b = append(b, wrap.Render(strings.Join(pills, " ")), "")

	for idx, s := range rb.Steps {
		stepTitleStyle := stTitle
		prefix := "  "
		if idx == stepIndex {
			prefix = "▸ "
			stepTitleStyle = stCmd
		}

		b = append(b, fit.Render(prefix+stepTitleStyle.Render(s.Title)))
		b = append(b, "   "+wrap.Render(stDim.Render(s.Desc)))

		// Render command box
		cmdBox := lipgloss.NewStyle().
			Width(colW-4).
			Border(lipgloss.RoundedBorder()).
			BorderForeground(lipgloss.Color("8")).
			Padding(0, 1)

		b = append(b, "   "+cmdBox.Render(stCmd.Render(s.Command)))
		b = append(b, "   "+wrap.Render(stDim.Render("Safety: ")+stAccent.Render(s.Safety)))
		b = append(b, "")
	}

	b = append(b, rule)
	b = append(b, wrap.Render(stDim.Render("1-4 switch runbook · ↑↓ select step · Enter copy command · [Esc] Home · [/] Search")))

	return strings.Join(b, "\n")
}
