package main

import (
	"fmt"
	"strings"

	"charm.land/bubbles/v2/textinput"
	tea "charm.land/bubbletea/v2"
	"charm.land/lipgloss/v2"
)

// Colours are the terminal's own 16 ANSI colours, so the TUI follows whatever
// theme the terminal uses (light or dark) without detecting the background.
var (
	stDim      = lipgloss.NewStyle().Foreground(lipgloss.Color("8"))
	stTitle    = lipgloss.NewStyle().Bold(true)
	stAccent   = lipgloss.NewStyle().Foreground(lipgloss.Color("6"))
	stDanger   = lipgloss.NewStyle().Foreground(lipgloss.Color("1")).Bold(true)
	stRoot     = lipgloss.NewStyle().Foreground(lipgloss.Color("3"))
	stOK       = lipgloss.NewStyle().Foreground(lipgloss.Color("2"))
	stSelected = lipgloss.NewStyle().Reverse(true)
	stCmd      = lipgloss.NewStyle().Foreground(lipgloss.Color("4")).Bold(true)
	stRule     = lipgloss.NewStyle().Foreground(lipgloss.Color("8"))
)

// wideLayout is the width at which the list and the detail sit side by side.
const wideLayout = 100

type model struct {
	data    *Data
	input   textinput.Model
	suite   int // -1 = all suites
	results []int
	cursor  int
	offset  int
	alt     int // selected alternative in the current entry
	explain bool
	status  string
	width   int
	height  int

	// Set when Enter picks a command: main prints it to stdout after the TUI exits.
	picked *Entry
	pickAlt int
}

func newModel(d *Data, query string) model {
	in := textinput.New()
	in.Prompt = "› "
	in.Placeholder = "search commands (nvme smart, xid, ib link down…)"
	in.SetValue(query)
	// Focus here, not in Init: Init has a value receiver, so focusing there would
	// only focus a copy and typing would never reach the box.
	in.Focus()
	m := model{data: d, input: in, suite: -1}
	m.refresh()
	return m
}

func (m model) Init() tea.Cmd { return textinput.Blink }

func (m *model) suiteName() string {
	if m.suite < 0 {
		return ""
	}
	return m.data.Suites[m.suite]
}

func (m *model) refresh() {
	m.results = Search(m.data, m.input.Value(), m.suiteName())
	m.cursor, m.offset, m.alt = 0, 0, 0
}

func (m *model) current() *Entry {
	if m.cursor < 0 || m.cursor >= len(m.results) {
		return nil
	}
	return &m.data.Entries[m.results[m.cursor]]
}

func (m *model) move(n int) {
	if len(m.results) == 0 {
		return
	}
	m.cursor = max(0, min(len(m.results)-1, m.cursor+n))
	m.alt = 0
}

func (m model) Update(msg tea.Msg) (tea.Model, tea.Cmd) {
	switch msg := msg.(type) {
	case tea.WindowSizeMsg:
		m.width, m.height = msg.Width, msg.Height
		m.input.SetWidth(max(10, msg.Width-4))
		return m, nil

	case tea.KeyPressMsg:
		m.status = ""
		switch msg.String() {
		case "ctrl+c":
			return m, tea.Quit
		case "esc":
			if m.explain {
				m.explain = false
				return m, nil
			}
			if m.input.Value() != "" {
				m.input.SetValue("")
				m.refresh()
				return m, nil
			}
			return m, tea.Quit
		case "up", "ctrl+p":
			m.move(-1)
			return m, nil
		case "down", "ctrl+n":
			m.move(1)
			return m, nil
		case "pgup":
			m.move(-m.listRows())
			return m, nil
		case "pgdown":
			m.move(m.listRows())
			return m, nil
		case "tab":
			m.suite++
			if m.suite >= len(m.data.Suites) {
				m.suite = -1
			}
			m.refresh()
			return m, nil
		case "shift+tab":
			m.suite--
			if m.suite < -1 {
				m.suite = len(m.data.Suites) - 1
			}
			m.refresh()
			return m, nil
		case "ctrl+t":
			if e := m.current(); e != nil && len(e.Copy) > 1 {
				m.alt = (m.alt + 1) % len(e.Copy)
			}
			return m, nil
		case "ctrl+e":
			m.explain = !m.explain
			return m, nil
		case "ctrl+y":
			e := m.current()
			if e == nil {
				return m, nil
			}
			if len(e.Copy) == 0 {
				m.status = stDim.Render("Reference text: nothing to copy.")
				return m, nil
			}
			m.status = stOK.Render("Copied to your clipboard (OSC 52).")
			if e.Danger {
				m.status = stDanger.Render("⚠ Copied a state-changing command: confirm the node is drained and the change approved before running it.")
			}
			return m, tea.SetClipboard(e.Copy[m.alt])
		case "enter":
			e := m.current()
			if e == nil {
				return m, nil
			}
			if len(e.Copy) == 0 {
				m.status = stDim.Render("Reference text: nothing to print.")
				return m, nil
			}
			m.picked, m.pickAlt = e, m.alt
			return m, tea.Quit
		}
	}

	before := m.input.Value()
	var cmd tea.Cmd
	m.input, cmd = m.input.Update(msg)
	if m.input.Value() != before {
		m.refresh()
	}
	return m, cmd
}

// listRows is how many result lines fit on screen.
func (m *model) listRows() int {
	body := m.height - 4 // header, input, rule, footer
	if m.width < wideLayout {
		body = body / 2
	}
	return max(1, body)
}

func (m model) View() tea.View {
	v := tea.NewView(m.render())
	v.AltScreen = true
	v.WindowTitle = "dc-cheat"
	return v
}

func (m *model) render() string {
	if m.width == 0 {
		return "loading…"
	}
	suite := "All suites"
	if s := m.suiteName(); s != "" {
		suite = s
	}
	header := stTitle.Render("dc-cheat") + "  " + stAccent.Render(suite) + stDim.Render(fmt.Sprintf("  (tab / shift+tab)   %d commands", len(m.results)))
	rule := stRule.Render(strings.Repeat("─", m.width))
	footer := m.status
	if footer == "" {
		footer = stDim.Render("↑↓ move · enter print · ctrl+y copy · ctrl+e explain · ctrl+t alt · esc quit")
	}
	// Never wider than the window: a wrapped line would push the screen up.
	fit := lipgloss.NewStyle().MaxWidth(m.width)
	header, footer = fit.Render(header), fit.Render(footer)

	rows := m.listRows()
	if m.cursor < m.offset {
		m.offset = m.cursor
	}
	if m.cursor >= m.offset+rows {
		m.offset = m.cursor - rows + 1
	}

	var body string
	if m.width >= wideLayout {
		listW := m.width * 45 / 100
		detailW := m.width - listW - 3
		list := m.renderList(listW, rows)
		detail := m.renderDetail(detailW, rows)
		sep := stRule.Render(strings.TrimRight(strings.Repeat("│\n", rows), "\n"))
		body = lipgloss.JoinHorizontal(lipgloss.Top, list, " ", sep, " ", detail)
	} else {
		detailRows := max(1, m.height-4-rows-1)
		body = m.renderList(m.width, rows) + "\n" + rule + "\n" + m.renderDetail(m.width, detailRows)
	}
	return header + "\n" + m.input.View() + "\n" + rule + "\n" + body + "\n" + footer
}

func (m *model) renderList(w, rows int) string {
	lines := make([]string, 0, rows)
	for i := m.offset; i < len(m.results) && len(lines) < rows; i++ {
		e := &m.data.Entries[m.results[i]]
		mark := "  "
		switch {
		case e.Danger:
			mark = stDanger.Render("⚠ ")
		case e.Root == "root":
			mark = stRoot.Render("# ")
		}
		text := truncate(firstLine(e.Cmd), w-2)
		if i == m.cursor {
			text = stSelected.Render(pad(text, w-2))
		} else if e.Ref {
			text = stDim.Render(text)
		}
		lines = append(lines, mark+text)
	}
	if len(lines) == 0 {
		lines = append(lines, stDim.Render("No commands match. Esc clears the search; tab changes the suite."))
	}
	for len(lines) < rows {
		lines = append(lines, "")
	}
	return lipgloss.NewStyle().Width(w).Render(strings.Join(lines, "\n"))
}

func (m *model) renderDetail(w, rows int) string {
	e := m.current()
	if e == nil {
		return ""
	}
	wrap := lipgloss.NewStyle().Width(w)
	var b []string
	b = append(b, stDim.Render(truncate(e.Suite+" › "+strings.TrimSuffix(e.File, ".html")+" › "+e.Sec, w)))
	b = append(b, "")

	if len(e.Copy) > 1 {
		for i := range e.Copy {
			prefix := "  "
			st := stDim
			if i == m.alt {
				prefix, st = "▸ ", stCmd
			}
			b = append(b, wrap.Render(prefix+st.Render(e.Plain(i))))
		}
		b = append(b, stDim.Render(fmt.Sprintf("  alternative %d of %d · ctrl+t for the next", m.alt+1, len(e.Copy))))
	} else {
		b = append(b, wrap.Render(stCmd.Render(strings.TrimPrefix(e.Cmd, "$ "))))
	}
	b = append(b, "")

	if e.Danger {
		b = append(b, wrap.Render(stDanger.Render("⚠ Changes state · drain & get approval first")))
	}
	switch e.Root {
	case "root":
		b = append(b, wrap.Render(stRoot.Render("# needs root")+stDim.Render(" ("+e.RootTool+": "+e.RootWhy+"). Copies with a \"# needs root\" line, no sudo.")))
	case "admin":
		b = append(b, wrap.Render(stRoot.Render("Slurm admin")+stDim.Render(" ("+e.RootWhy+")")))
	case "maybe":
		b = append(b, wrap.Render(stRoot.Render("maybe root")+stDim.Render(" ("+e.RootWhy+")")))
	}
	if e.Ref {
		b = append(b, stDim.Render("Reference text: nothing to copy."))
	}
	if e.Desc != "" {
		b = append(b, wrap.Render(e.Desc))
	}
	if e.Tip != "" {
		b = append(b, "", wrap.Render(stAccent.Render("Tip: ")+e.Tip))
	}
	if m.explain && len(e.Copy) > 0 {
		b = append(b, "", stTitle.Render("Explain"), wrap.Render(ExplainText(Explain(m.data, e.Plain(m.alt)))))
	} else if len(e.Copy) > 0 {
		b = append(b, "", stDim.Render("ctrl+e explains each flag"))
	}

	lines := strings.Split(strings.Join(b, "\n"), "\n")
	if len(lines) > rows {
		lines = append(lines[:rows-1], stDim.Render("…"))
	}
	return strings.Join(lines, "\n")
}

func firstLine(s string) string {
	s = strings.TrimPrefix(s, "$ ")
	if i := strings.IndexByte(s, '\n'); i >= 0 {
		return s[:i] + " …"
	}
	return s
}

// truncate cuts plain text to w terminal cells, ending in "…".
func truncate(s string, w int) string {
	s = strings.ReplaceAll(s, "\t", "  ")
	if w <= 0 {
		return ""
	}
	if lipgloss.Width(s) <= w {
		return s
	}
	r := []rune(s)
	for len(r) > 0 && lipgloss.Width(string(r))+1 > w {
		r = r[:len(r)-1]
	}
	return string(r) + "…"
}

func pad(s string, w int) string {
	if n := w - lipgloss.Width(s); n > 0 {
		return s + strings.Repeat(" ", n)
	}
	return s
}
