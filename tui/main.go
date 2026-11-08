// dc-cheat: the datacenter cheat sheet in the terminal.
//
// Same commands as the cheat-sheet site, compiled into one static binary.
//
//	dc-cheat [query]          interactive search; Enter prints the command to stdout
//	dc-cheat -q <query>       print the best matches and exit (no UI)
//	dc-cheat explain "<cmd>"  explain each flag of a command
//	dc-cheat --version
package main

import (
	"flag"
	"fmt"
	"os"
	"strings"

	tea "charm.land/bubbletea/v2"
)

// Set at build time by build.sh (-ldflags "-X main.version=…").
var version = "dev"

func main() {
	os.Exit(run())
}

func run() int {
	fs := flag.NewFlagSet("dc-cheat", flag.ContinueOnError)
	query := fs.String("q", "", "print the best matches for `query` and exit")
	limit := fs.Int("n", 20, "how many matches -q prints")
	showVersion := fs.Bool("version", false, "print the version and the data build")
	fs.Usage = func() {
		fmt.Fprintf(fs.Output(), "Usage:\n  dc-cheat [query]          search interactively (Enter prints the command)\n  dc-cheat -q <query>       print matches and exit\n  dc-cheat explain \"<cmd>\"  explain a command's flags\n\nFlags:\n")
		fs.PrintDefaults()
	}
	if err := fs.Parse(os.Args[1:]); err != nil {
		return 2
	}

	d, err := loadData()
	if err != nil {
		fmt.Fprintln(os.Stderr, "dc-cheat:", err)
		return 1
	}

	switch {
	case *showVersion:
		fmt.Printf("dc-cheat %s · %d commands · data %s\n", version, len(d.Entries), d.SourceHash)
		return 0
	case *query != "":
		printMatches(d, *query, *limit)
		return 0
	case fs.NArg() > 0 && fs.Arg(0) == "explain":
		cmd := strings.Join(fs.Args()[1:], " ")
		if strings.TrimSpace(cmd) == "" {
			fmt.Fprintln(os.Stderr, `usage: dc-cheat explain "<command>"`)
			return 2
		}
		fmt.Print(ExplainText(Explain(d, cmd)))
		return 0
	}

	// The UI draws on stderr so stdout carries only the picked command:
	// cmd=$(dc-cheat) and shell key bindings get a clean line.
	p := tea.NewProgram(newModel(d, strings.Join(fs.Args(), " ")), tea.WithOutput(os.Stderr))
	final, err := p.Run()
	if err != nil {
		fmt.Fprintln(os.Stderr, "dc-cheat:", err)
		return 1
	}
	m, ok := final.(model)
	if !ok || m.picked == nil {
		return 130 // cancelled, like fzf
	}
	e := m.picked
	if e.Danger {
		fmt.Fprintln(os.Stderr, "⚠ Changes state: confirm the node is drained and the change approved before running it.")
	}
	if e.Root == "root" {
		fmt.Fprintf(os.Stderr, "# needs root (%s: %s)\n", e.RootTool, e.RootWhy)
	}
	fmt.Println(e.Plain(m.pickAlt))
	return 0
}

func printMatches(d *Data, query string, limit int) {
	hits := Search(d, query, "")
	if len(hits) == 0 {
		fmt.Fprintln(os.Stderr, "no matches")
		return
	}
	for i, idx := range hits {
		if i == limit {
			fmt.Fprintf(os.Stderr, "… %d more (use -n)\n", len(hits)-limit)
			break
		}
		e := &d.Entries[idx]
		flags := ""
		if e.Danger {
			flags += " ⚠changes-state"
		}
		if e.Root == "root" {
			flags += " #needs-root"
		}
		fmt.Printf("%s\n    # %s  [%s]%s\n", firstLine(e.Cmd), e.Desc, strings.TrimSuffix(e.File, ".html"), flags)
	}
}
