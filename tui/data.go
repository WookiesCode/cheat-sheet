package main

import (
	_ "embed"
	"encoding/json"
	"fmt"
	"strings"
)

// tui-data.json is written by cheat-sheets/build-tui-data.js from the site's own
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

// Data is the whole embedded file.
type Data struct {
	SourceHash string // changes whenever the site's commands or rules change
	Suites     []string
	Entries    []Entry
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
	return &d, nil
}

// Plain is the command with no "# needs root" line, for printing into a shell prompt.
func (e *Entry) Plain(alt int) string {
	if alt < 0 || alt >= len(e.Copy) {
		return ""
	}
	return strings.TrimPrefix(e.Copy[alt], "# needs root\n")
}
