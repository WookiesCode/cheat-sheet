package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"strings"
)

// tui-data.json is written by build-tui-data.js from the site's own
// search index, flag index and safety rules, then compiled into the binary.
//
//go:embed data/tui-data.json
var rawData []byte

// Entry is one command from the site. Danger, Root and Copy were worked out by the
// site's JavaScript rules at build time, so the TUI and the site always agree.
type Entry struct {
	Suite    string
	Sheet    string
	Badge    string
	File     string
	Sec      string
	Cmd      string
	Desc     string
	Tip      string
	Tags     string
	Ref      bool     // reference text: shown, nothing to copy
	Danger   bool     // changes state: drain and get approval first
	Root     string   // "root", "admin", "maybe" or ""
	RootWhy  string   // why it needs root
	RootTool string   // which part of the command needs it
	Copy     []string // one per alternative, in the house copy style

	// Lower-cased search fields, filled once at load.
	about, cmdLC, sheetLC string
}

// SectionGroup groups commands under one section header on a sheet.
type SectionGroup struct {
	Name    string
	Entries []int // index into d.Entries
}

// SheetGroup groups sections and commands belonging to one cheat sheet.
type SheetGroup struct {
	File     string
	Name     string
	Badge    string
	Sections []SectionGroup
	All      []int // all entry indices in this sheet
}

// SuiteGroup groups sheets under one suite category.
type SuiteGroup struct {
	Name   string
	Sheets []SheetGroup
}

// Data is the whole embedded file.
type Data struct {
	SourceHash string // changes whenever the site's commands or rules change
	Suites     []string
	Entries    []Entry
	Hierarchy  []SuiteGroup
	// tool -> flag or subcommand -> [description, sheet]
	Flags map[string]map[string][]string
}

func loadData() (*Data, error) {
	var d Data
	if err := json.Unmarshal(rawData, &d); err != nil {
		return nil, fmt.Errorf("embedded data is unreadable (rebuild with build-tui-data.js): %w", err)
	}
	if len(d.Entries) == 0 {
		return nil, fmt.Errorf("embedded data has no commands (rebuild with build-tui-data.js)")
	}
	for i := range d.Entries {
		e := &d.Entries[i]
		e.about = strings.ToLower(e.Sec + " " + e.Desc + " " + e.Tags + " " + e.Tip)
		e.cmdLC = strings.ToLower(e.Cmd)
		e.sheetLC = strings.ToLower(e.Sheet + " " + e.Badge)
	}
	d.buildHierarchy()
	return &d, nil
}

func (d *Data) buildHierarchy() {
	suiteMap := make(map[string]int)
	for i, s := range d.Suites {
		d.Hierarchy = append(d.Hierarchy, SuiteGroup{Name: s})
		suiteMap[s] = i
	}
	for idx := range d.Entries {
		e := &d.Entries[idx]
		suiteIdx, ok := suiteMap[e.Suite]
		if !ok {
			d.Hierarchy = append(d.Hierarchy, SuiteGroup{Name: e.Suite})
			suiteIdx = len(d.Hierarchy) - 1
			suiteMap[e.Suite] = suiteIdx
		}
		sg := &d.Hierarchy[suiteIdx]
		sheetIdx := -1
		for sIdx := range sg.Sheets {
			if sg.Sheets[sIdx].File == e.File {
				sheetIdx = sIdx
				break
			}
		}
		if sheetIdx < 0 {
			sg.Sheets = append(sg.Sheets, SheetGroup{
				File:  e.File,
				Name:  e.Sheet,
				Badge: e.Badge,
			})
			sheetIdx = len(sg.Sheets) - 1
		}
		sheet := &sg.Sheets[sheetIdx]
		sheet.All = append(sheet.All, idx)

		secName := e.Sec
		if secName == "" {
			secName = "General"
		}
		secIdx := -1
		for scIdx := range sheet.Sections {
			if sheet.Sections[scIdx].Name == secName {
				secIdx = scIdx
				break
			}
		}
		if secIdx < 0 {
			sheet.Sections = append(sheet.Sections, SectionGroup{Name: secName})
			secIdx = len(sheet.Sections) - 1
		}
		sheet.Sections[secIdx].Entries = append(sheet.Sections[secIdx].Entries, idx)
	}
}

// Plain is the command with no "# needs root" line, for printing into a shell prompt.
func (e *Entry) Plain(alt int) string {
	if alt < 0 || alt >= len(e.Copy) {
		return ""
	}
	return strings.TrimPrefix(e.Copy[alt], "# needs root\n")
}
