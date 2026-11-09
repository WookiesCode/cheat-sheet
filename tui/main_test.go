package main

import (
	"strings"
	"testing"

	tea "charm.land/bubbletea/v2"
)

func mustData(t *testing.T) *Data {
	t.Helper()
	d, err := loadData()
	if err != nil {
		t.Fatal(err)
	}
	return d
}

func TestDataLoads(t *testing.T) {
	d := mustData(t)
	if len(d.Entries) < 1500 {
		t.Fatalf("only %d commands embedded; rebuild with build-tui-data.js", len(d.Entries))
	}
	if len(d.Suites) < 10 || len(d.Flags) < 100 {
		t.Fatalf("suites=%d tools=%d: data looks incomplete", len(d.Suites), len(d.Flags))
	}
}

// The site's own rules, evaluated at build time, must arrive intact.
func TestSafetyFlags(t *testing.T) {
	d := mustData(t)
	find := func(prefix string) *Entry {
		for i := range d.Entries {
			if strings.HasPrefix(d.Entries[i].Cmd, prefix) {
				return &d.Entries[i]
			}
		}
		t.Fatalf("no command starts with %q", prefix)
		return nil
	}
	if e := find("nvme format"); !e.Danger || e.Root != "root" {
		t.Errorf("nvme format: danger=%v root=%q", e.Danger, e.Root)
	}
	e := find("dmidecode -t system")
	if e.Root != "root" || !strings.HasPrefix(e.Copy[0], "# needs root\n") || e.Plain(0) != e.Cmd {
		t.Errorf("dmidecode: root=%q copy=%q plain=%q", e.Root, e.Copy[0], e.Plain(0))
	}
	if e := find("dmesg -T"); e.Root != "maybe" {
		t.Errorf("dmesg -T: root=%q, want maybe", e.Root)
	}
	if e := find("ipmitool -I lanplus -H"); e.Root == "root" {
		t.Errorf("remote ipmitool should not need local root")
	}
}

func TestSearchRanksLikeTheSite(t *testing.T) {
	d := mustData(t)
	hits := Search(d, "nvme smart", "")
	if len(hits) == 0 {
		t.Fatal("no hits for nvme smart")
	}
	top := d.Entries[hits[0]]
	if !strings.Contains(top.cmdLC+top.about, "smart") {
		t.Errorf("top hit for nvme smart: %q", top.Cmd)
	}
	if got := Search(d, "zzzz-no-such-thing", ""); len(got) != 0 {
		t.Errorf("nonsense query matched %d", len(got))
	}
	// A suite filter only returns that suite.
	for _, i := range Search(d, "", "InfiniBand") {
		if d.Entries[i].Suite != "InfiniBand" {
			t.Fatalf("suite filter leaked %q", d.Entries[i].Suite)
		}
	}
}

func TestSplitStagesKeepsQuotes(t *testing.T) {
	st := splitStages(`dmesg -T | grep -iE 'xid|nvrm' && echo "a;b"`)
	if len(st) != 3 || st[1].Op != "|" || st[2].Op != "&&" {
		t.Fatalf("stages: %+v", st)
	}
	if !strings.Contains(st[1].Text, "'xid|nvrm'") || !strings.Contains(st[2].Text, `"a;b"`) {
		t.Errorf("quotes were split: %+v", st)
	}
}

func TestExplain(t *testing.T) {
	d := mustData(t)
	st := Explain(d, "sudo ss -tlnp")
	if len(st) != 1 || st[0].Tool != "ss" {
		t.Fatalf("tool not found past sudo: %+v", st)
	}
	known := 0
	for _, p := range st[0].Parts {
		if p.Known {
			known++
		}
	}
	if known < 3 {
		t.Errorf("expected -t -l -n -p explained, got %+v", st[0].Parts)
	}
	if out := ExplainText(Explain(d, "ls --no-such-flag-xyz")); !strings.Contains(out, "see man ls") {
		t.Errorf("unknown flag not flagged: %s", out)
	}
}

// Drive the model the way key presses would, without a terminal.
func TestModelKeys(t *testing.T) {
	d := mustData(t)
	var m tea.Model = newModel(d, "")
	m, _ = m.Update(tea.WindowSizeMsg{Width: 120, Height: 40})
	for _, r := range "dmidecode" {
		m, _ = m.Update(tea.KeyPressMsg{Code: r, Text: string(r)})
	}
	mm := m.(model)
	if mm.input.Value() != "dmidecode" || len(mm.results) == 0 {
		t.Fatalf("typing did not search: value=%q results=%d", mm.input.Value(), len(mm.results))
	}
	if !strings.Contains(mm.render(), "dmidecode") {
		t.Error("render does not show the results")
	}
	m, _ = m.Update(tea.KeyPressMsg{Code: tea.KeyTab})
	if m.(model).suite != 0 {
		t.Errorf("tab did not pick the first suite: %d", m.(model).suite)
	}
	m, _ = m.Update(tea.KeyPressMsg{Code: tea.KeyTab, Mod: tea.ModShift})
	if m.(model).suite != -1 {
		t.Errorf("shift+tab did not go back to all suites: %d", m.(model).suite)
	}
	m, cmd := m.Update(tea.KeyPressMsg{Code: tea.KeyEnter})
	if m.(model).picked == nil || cmd == nil {
		t.Fatal("enter did not pick a command and quit")
	}
	// Narrow terminals stack the list over the detail.
	n, _ := newModel(d, "ipmitool").Update(tea.WindowSizeMsg{Width: 80, Height: 30})
	nm := n.(model)
	for _, line := range strings.Split(nm.render(), "\n") {
		if w := len([]rune(stripANSI(line))); w > 80 {
			t.Fatalf("line wider than 80 columns (%d): %q", w, stripANSI(line))
		}
	}
}

func TestCardRender(t *testing.T) {
	d := mustData(t)
	m, _ := newModel(d, "nvme format").Update(tea.WindowSizeMsg{Width: 120, Height: 35})
	mm := m.(model)
	rendered := mm.render()
	if !strings.Contains(rendered, "STATE CHANGE") {
		t.Errorf("expected STATE CHANGE badge in render, got:\n%s", rendered)
	}
	if !strings.Contains(rendered, "NEEDS ROOT") {
		t.Errorf("expected NEEDS ROOT badge in render, got:\n%s", rendered)
	}

	// Test tip and alternatives rendering
	m2, _ := newModel(d, "smartctl -x").Update(tea.WindowSizeMsg{Width: 120, Height: 35})
	mm2 := m2.(model)
	rendered2 := mm2.render()
	if !strings.Contains(rendered2, "Root required") {
		t.Errorf("expected root note in render, got:\n%s", rendered2)
	}
	t.Logf("Rendered Card Sample:\n%s\n", rendered)
}

func TestBrowseMode(t *testing.T) {
	d := mustData(t)
	var m tea.Model = newModel(d, "")
	m, _ = m.Update(tea.WindowSizeMsg{Width: 120, Height: 35})

	// Toggle into browse mode with Ctrl+O
	m, _ = m.Update(tea.KeyPressMsg{Code: 'o', Mod: tea.ModCtrl})
	mm := m.(model)
	if mm.mode != modeBrowse {
		t.Fatal("ctrl+o did not activate browse mode")
	}

	rendered := mm.render()
	if !strings.Contains(rendered, "BROWSE") || !strings.Contains(rendered, "SHEETS") {
		t.Errorf("browse mode render missing expected headers:\n%s", rendered)
	}
	t.Logf("Rendered Browse Sample:\n%s\n", rendered)

	// Move right to Sections
	m, _ = m.Update(tea.KeyPressMsg{Code: tea.KeyRight})
	if m.(model).browseCol != 1 {
		t.Errorf("expected browseCol=1, got %d", m.(model).browseCol)
	}

	// Move down in Sections
	m, _ = m.Update(tea.KeyPressMsg{Code: tea.KeyDown})
	mmDown := m.(model)
	if mmDown.secIdx == 0 && len(mmDown.currentSheet().Sections) > 1 {
		t.Error("down arrow did not increment secIdx")
	}

	// Move right to Commands
	m, _ = m.Update(tea.KeyPressMsg{Code: tea.KeyRight})
	if m.(model).browseCol != 2 {
		t.Errorf("expected browseCol=2, got %d", m.(model).browseCol)
	}

	// Picking with Enter when at browseCol=2
	m, cmd := m.Update(tea.KeyPressMsg{Code: tea.KeyEnter})
	if m.(model).picked == nil || cmd == nil {
		t.Fatal("enter at browseCol=2 did not pick command")
	}

	// Narrow screen test (width 80)
	n, _ := newModel(d, "").Update(tea.WindowSizeMsg{Width: 80, Height: 30})
	n, _ = n.Update(tea.KeyPressMsg{Code: 'o', Mod: tea.ModCtrl})
	nm := n.(model)
	for _, line := range strings.Split(nm.render(), "\n") {
		if w := len([]rune(stripANSI(line))); w > 80 {
			t.Fatalf("browse line wider than 80 columns (%d): %q", w, stripANSI(line))
		}
	}
}

func TestMissionControlHome(t *testing.T) {
	d := mustData(t)
	var m tea.Model = newModel(d, "")
	m, _ = m.Update(tea.WindowSizeMsg{Width: 100, Height: 35})
	mm := m.(model)

	if mm.mode != modeHome {
		t.Fatalf("expected initial modeHome, got %d", mm.mode)
	}

	homeRender := mm.render()
	if !strings.Contains(strings.ToUpper(homeRender), "WHAT'S BROKEN?") {
		t.Fatalf("home view missing hero section:\n%s", homeRender)
	}
	if !strings.Contains(homeRender, "INCIDENT FLOW") {
		t.Fatalf("home view missing incident flow:\n%s", homeRender)
	}

	// Test 80-col line wrapping on home
	m80, _ := newModel(d, "").Update(tea.WindowSizeMsg{Width: 80, Height: 35})
	m80m := m80.(model)
	for _, line := range strings.Split(m80m.render(), "\n") {
		if w := len([]rune(stripANSI(line))); w > 80 {
			t.Fatalf("home line wider than 80 columns (%d): %q", w, stripANSI(line))
		}
	}

	// Press '1' to load Sample 1: Xid 79
	k1 := tea.KeyPressMsg{Code: '1', Text: "1"}
	m, _ = m.Update(k1)
	mm = m.(model)
	if mm.decoded == nil || !strings.Contains(mm.decoded.Title, "Xid 79") {
		t.Fatalf("pressing 1 did not decode Xid 79: %+v", mm.decoded)
	}
	decodedRender := mm.render()
	if !strings.Contains(decodedRender, "Diagnostic steps:") {
		t.Fatalf("expected Diagnostic steps in home view:\n%s", decodedRender)
	}

	// Press 'esc' to clear input and return to empty home
	m, _ = m.Update(tea.KeyPressMsg{Code: tea.KeyEscape})
	if m.(model).input.Value() != "" || m.(model).decoded != nil {
		t.Fatalf("esc did not clear input: %q", m.(model).input.Value())
	}

	// Press 'x' for Node X-Ray
	mx, _ := m.Update(tea.KeyPressMsg{Code: 'x'})
	mmx := mx.(model)
	if mmx.mode != modeXRay {
		t.Fatalf("expected modeXRay, got %d", mmx.mode)
	}
	xrayRender := mmx.render()
	if !strings.Contains(xrayRender, "H200") || !strings.Contains(xrayRender, "GPU 0") {
		t.Fatalf("xray view missing expected gpu tray content:\n%s", xrayRender)
	}

	// Press 'c' for Node Checkup
	mc, _ := mx.Update(tea.KeyPressMsg{Code: 'c'})
	mmc := mc.(model)
	if mmc.mode != modeCheckup {
		t.Fatalf("expected modeCheckup, got %d", mmc.mode)
	}
	checkupRender := mmc.render()
	if !strings.Contains(checkupRender, "78/100") {
		t.Fatalf("checkup view missing health score:\n%s", checkupRender)
	}

	// Press 'r' for Guided Runbooks
	mr, _ := mc.Update(tea.KeyPressMsg{Code: 'r'})
	mmr := mr.(model)
	if mmr.mode != modeRunbooks {
		t.Fatalf("expected modeRunbooks, got %d", mmr.mode)
	}
	runbooksRender := mmr.render()
	if !strings.Contains(runbooksRender, "Guided Runbooks") {
		t.Fatalf("runbooks view missing header:\n%s", runbooksRender)
	}

	// Test 80-col line wrapping on X-Ray, Checkup, and Runbooks
	for _, line := range strings.Split(RenderXRay(DefaultSampleXRay(), 80, 35), "\n") {
		if w := len([]rune(stripANSI(line))); w > 80 {
			t.Fatalf("xray line wider than 80 columns (%d): %q", w, stripANSI(line))
		}
	}
	for _, line := range strings.Split(RenderCheckup(DefaultSampleCheckup(), 80, 35), "\n") {
		if w := len([]rune(stripANSI(line))); w > 80 {
			t.Fatalf("checkup line wider than 80 columns (%d): %q", w, stripANSI(line))
		}
	}
	for _, line := range strings.Split(RenderRunbooks(0, 0, 80, 35), "\n") {
		if w := len([]rune(stripANSI(line))); w > 80 {
			t.Fatalf("runbooks line wider than 80 columns (%d): %q", w, stripANSI(line))
		}
	}
}

func stripANSI(s string) string {
	var b strings.Builder
	esc := false
	for _, r := range s {
		switch {
		case r == 0x1b:
			esc = true
		case esc && (r >= 'a' && r <= 'z' || r >= 'A' && r <= 'Z'):
			esc = false
		case !esc:
			b.WriteRune(r)
		}
	}
	return b.String()
}
