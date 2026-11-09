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
	stDim        = lipgloss.NewStyle().Foreground(lipgloss.Color("8"))
	stTitle      = lipgloss.NewStyle().Bold(true)
	stAccent     = lipgloss.NewStyle().Foreground(lipgloss.Color("6"))
	stDanger     = lipgloss.NewStyle().Foreground(lipgloss.Color("1")).Bold(true)
	stRoot       = lipgloss.NewStyle().Foreground(lipgloss.Color("3"))
	stOK         = lipgloss.NewStyle().Foreground(lipgloss.Color("2"))
	stSelected   = lipgloss.NewStyle().Reverse(true)
	stCmd        = lipgloss.NewStyle().Foreground(lipgloss.Color("4")).Bold(true)
	stRule       = lipgloss.NewStyle().Foreground(lipgloss.Color("8"))
	stPillDanger = lipgloss.NewStyle().Foreground(lipgloss.Color("1")).Reverse(true).Bold(true)
	stPillRoot   = lipgloss.NewStyle().Foreground(lipgloss.Color("3")).Reverse(true).Bold(true)
	stPillBadge  = lipgloss.NewStyle().Foreground(lipgloss.Color("6")).Reverse(true).Bold(true)
	stPillRef    = lipgloss.NewStyle().Foreground(lipgloss.Color("8")).Reverse(true)
)

// wideLayout is the width at which the list and the detail sit side by side.
const wideLayout = 100

type viewMode int

const (
	modeHome viewMode = iota
	modeSearch
	modeBrowse
	modeXRay
	modeCheckup
	modeRunbooks
)

type model struct {
	data      *Data
	input     textinput.Model
	suite     int // -1 = all suites
	results   []int
	cursor    int
	offset    int
	alt       int // selected alternative in the current entry
	explain   bool
	status    string
	width     int
	height    int

	// Set when Enter picks a command: main prints it to stdout after the TUI exits.
	picked    *Entry
	pickAlt   int

	// View Modes
	mode      viewMode
	decoded   *Symptom
	xray      XRayData
	checkup   CheckupData
	rbIndex   int
	rbStep    int

	// Browse Mode (Suite › Sheet › Section › Command)
	browseCol int // 0 = sheets, 1 = sections, 2 = commands
	sheetIdx  int
	sheetOff  int
	secIdx    int
	secOff    int
}

func newModel(d *Data, query string) model {
	in := textinput.New()
	in.Prompt = "› "
	in.Placeholder = "Paste an error (Xid 79, AER, timeout) or search commands..."
	in.SetValue(query)
	// Focus here, not in Init: Init has a value receiver, so focusing there would
	// only focus a copy and typing would never reach the box.
	in.Focus()
	m := model{
		data:    d,
		input:   in,
		suite:   -1,
		xray:    DefaultSampleXRay(),
		checkup: DefaultSampleCheckup(),
	}
	m.refresh()
	if strings.TrimSpace(query) != "" {
		m.mode = modeSearch
	} else {
		m.mode = modeHome
	}
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

func (m *model) currentSuiteGroup() *SuiteGroup {
	if len(m.data.Hierarchy) == 0 {
		return nil
	}
	sIdx := m.suite
	if sIdx < 0 || sIdx >= len(m.data.Hierarchy) {
		sIdx = 0
	}
	return &m.data.Hierarchy[sIdx]
}

func (m *model) currentSheet() *SheetGroup {
	sg := m.currentSuiteGroup()
	if sg == nil || len(sg.Sheets) == 0 {
		return nil
	}
	idx := max(0, min(len(sg.Sheets)-1, m.sheetIdx))
	return &sg.Sheets[idx]
}

func (m *model) currentSection() *SectionGroup {
	sh := m.currentSheet()
	if sh == nil || len(sh.Sections) == 0 {
		return nil
	}
	idx := max(0, min(len(sh.Sections)-1, m.secIdx))
	return &sh.Sections[idx]
}

func (m *model) current() *Entry {
	if m.mode == modeBrowse {
		sec := m.currentSection()
		if sec == nil || len(sec.Entries) == 0 {
			return nil
		}
		cIdx := max(0, min(len(sec.Entries)-1, m.cursor))
		return &m.data.Entries[sec.Entries[cIdx]]
	}
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
		keyStr := msg.String()
		code := msg.Code
		switch keyStr {
		case "ctrl+c":
			return m, tea.Quit
		}

		switch m.mode {
		case modeXRay:
			switch {
			case keyStr == "esc" || keyStr == "q" || code == tea.KeyEscape || code == 'q':
				m.mode = modeHome
				return m, nil
			case keyStr == "c" || code == 'c':
				m.mode = modeCheckup
				return m, nil
			case keyStr == "r" || code == 'r':
				m.mode = modeRunbooks
				return m, nil
			case keyStr == "b" || code == 'b':
				m.mode = modeBrowse
				m.suite = 0
				return m, nil
			case keyStr == "/" || code == '/':
				m.mode = modeSearch
				m.input.Focus()
				return m, nil
			}
			return m, nil

		case modeCheckup:
			switch {
			case keyStr == "esc" || keyStr == "q" || code == tea.KeyEscape || code == 'q':
				m.mode = modeHome
				return m, nil
			case keyStr == "x" || code == 'x':
				m.mode = modeXRay
				return m, nil
			case keyStr == "r" || code == 'r':
				m.mode = modeRunbooks
				return m, nil
			case keyStr == "b" || code == 'b':
				m.mode = modeBrowse
				m.suite = 0
				return m, nil
			case keyStr == "/" || code == '/':
				m.mode = modeSearch
				m.input.Focus()
				return m, nil
			}
			return m, nil

		case modeRunbooks:
			switch {
			case keyStr == "esc" || keyStr == "q" || code == tea.KeyEscape || code == 'q':
				m.mode = modeHome
				return m, nil
			case code >= '1' && code <= '4':
				idx := int(code - '1')
				if idx >= 0 && idx < len(RunbookCatalog) {
					m.rbIndex = idx
					m.rbStep = 0
				}
				return m, nil
			case keyStr == "1" || keyStr == "2" || keyStr == "3" || keyStr == "4":
				idx := int(keyStr[0] - '1')
				if idx >= 0 && idx < len(RunbookCatalog) {
					m.rbIndex = idx
					m.rbStep = 0
				}
				return m, nil
			case keyStr == "up" || keyStr == "k" || code == tea.KeyUp || code == 'k':
				m.rbStep = max(0, m.rbStep-1)
				return m, nil
			case keyStr == "down" || keyStr == "j" || code == tea.KeyDown || code == 'j':
				m.rbStep = min(len(RunbookCatalog[m.rbIndex].Steps)-1, m.rbStep+1)
				return m, nil
			case keyStr == "enter" || code == tea.KeyEnter:
				cmd := RunbookCatalog[m.rbIndex].Steps[m.rbStep].Command
				m.status = stOK.Render("Copied step command to clipboard (OSC 52).")
				return m, tea.SetClipboard(cmd)
			case keyStr == "x" || code == 'x':
				m.mode = modeXRay
				return m, nil
			case keyStr == "c" || code == 'c':
				m.mode = modeCheckup
				return m, nil
			case keyStr == "b" || code == 'b':
				m.mode = modeBrowse
				m.suite = 0
				return m, nil
			case keyStr == "/" || code == '/':
				m.mode = modeSearch
				m.input.Focus()
				return m, nil
			}
			return m, nil

		case modeBrowse:
			switch keyStr {
			case "ctrl+o", "f2":
				m.mode = modeHome
				return m, nil
			case "/":
				m.mode = modeSearch
				m.input.Focus()
				return m, nil
			case "left", "h":
				m.browseCol = max(0, m.browseCol-1)
				return m, nil
			case "right", "l":
				m.browseCol = min(2, m.browseCol+1)
				return m, nil
			case "esc":
				if m.explain {
					m.explain = false
					return m, nil
				}
				if m.browseCol > 0 {
					m.browseCol--
					return m, nil
				}
				m.mode = modeHome
				return m, nil
			case "up", "ctrl+p", "k":
				switch m.browseCol {
				case 0:
					m.sheetIdx = max(0, m.sheetIdx-1)
					m.secIdx, m.secOff, m.cursor, m.offset, m.alt = 0, 0, 0, 0, 0
				case 1:
					m.secIdx = max(0, m.secIdx-1)
					m.cursor, m.offset, m.alt = 0, 0, 0
				case 2:
					m.cursor = max(0, m.cursor-1)
					m.alt = 0
				}
				return m, nil
			case "down", "ctrl+n", "j":
				switch m.browseCol {
				case 0:
					sg := m.currentSuiteGroup()
					if sg != nil && len(sg.Sheets) > 0 {
						m.sheetIdx = min(len(sg.Sheets)-1, m.sheetIdx+1)
					}
					m.secIdx, m.secOff, m.cursor, m.offset, m.alt = 0, 0, 0, 0, 0
				case 1:
					sh := m.currentSheet()
					if sh != nil && len(sh.Sections) > 0 {
						m.secIdx = min(len(sh.Sections)-1, m.secIdx+1)
					}
					m.cursor, m.offset, m.alt = 0, 0, 0
				case 2:
					sec := m.currentSection()
					if sec != nil && len(sec.Entries) > 0 {
						m.cursor = min(len(sec.Entries)-1, m.cursor+1)
					}
					m.alt = 0
				}
				return m, nil
			case "tab":
				m.suite++
				if m.suite >= len(m.data.Hierarchy) {
					m.suite = 0
				}
				m.sheetIdx, m.sheetOff, m.secIdx, m.secOff, m.cursor, m.offset, m.alt = 0, 0, 0, 0, 0, 0, 0
				return m, nil
			case "shift+tab":
				m.suite--
				if m.suite < 0 {
					m.suite = len(m.data.Hierarchy) - 1
				}
				m.sheetIdx, m.sheetOff, m.secIdx, m.secOff, m.cursor, m.offset, m.alt = 0, 0, 0, 0, 0, 0, 0
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
				if m.browseCol < 2 {
					m.browseCol++
					return m, nil
				}
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
			return m, nil

		case modeHome:
			if m.input.Value() != "" && (keyStr == "esc" || code == tea.KeyEscape) {
				m.input.SetValue("")
				m.decoded = nil
				m.refresh()
				return m, nil
			}

			if m.input.Value() == "" {
				switch {
				case code >= '1' && code <= '5':
					idx := int(code - '1')
					if idx >= 0 && idx < len(DecoderSamples) {
						m.input.SetValue(DecoderSamples[idx][1])
						m.decoded = DecodeSymptom(m.input.Value())
						m.refresh()
						return m, nil
					}
				case keyStr == "1" || keyStr == "2" || keyStr == "3" || keyStr == "4" || keyStr == "5":
					idx := int(keyStr[0] - '1')
					if idx >= 0 && idx < len(DecoderSamples) {
						m.input.SetValue(DecoderSamples[idx][1])
						m.decoded = DecodeSymptom(m.input.Value())
						m.refresh()
						return m, nil
					}
				case keyStr == "x" || code == 'x':
					m.mode = modeXRay
					return m, nil
				case keyStr == "c" || code == 'c':
					m.mode = modeCheckup
					return m, nil
				case keyStr == "r" || code == 'r':
					m.mode = modeRunbooks
					return m, nil
				case keyStr == "b" || code == 'b':
					m.mode = modeBrowse
					m.suite = 0
					return m, nil
				case keyStr == "ctrl+o" || keyStr == "f2":
					m.mode = modeBrowse
					m.suite = 0
					return m, nil
				case keyStr == "esc" || code == tea.KeyEscape:
					return m, tea.Quit
				}
			}

			if keyStr == "ctrl+o" || keyStr == "f2" {
				m.mode = modeBrowse
				m.suite = 0
				return m, nil
			}

			switch keyStr {
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
			}

			if keyStr == "enter" {
				if m.decoded != nil && len(m.decoded.Steps) > 0 {
					cmd := m.decoded.Steps[0][1]
					m.status = stOK.Render("Copied 1st diagnostic command to clipboard (OSC 52).")
					return m, tea.SetClipboard(cmd)
				}
				if strings.TrimSpace(m.input.Value()) != "" {
					m.mode = modeSearch
					m.refresh()
					if len(m.results) > 0 {
						e := m.current()
						if e != nil && len(e.Copy) > 0 {
							m.picked, m.pickAlt = e, m.alt
							return m, tea.Quit
						}
					}
					return m, nil
				}
			}

		case modeSearch:
			switch keyStr {
			case "ctrl+o", "f2":
				m.mode = modeBrowse
				m.suite = 0
				return m, nil
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
				m.mode = modeHome
				return m, nil
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
	}

	before := m.input.Value()
	var cmd tea.Cmd
	m.input, cmd = m.input.Update(msg)
	if m.input.Value() != before {
		m.refresh()
		m.decoded = DecodeSymptom(m.input.Value())
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
	switch m.mode {
	case modeHome:
		return RenderHome(m.input.View(), m.decoded, m.xray, m.checkup, m.width, m.height)
	case modeXRay:
		return RenderXRay(m.xray, m.width, m.height)
	case modeCheckup:
		return RenderCheckup(m.checkup, m.width, m.height)
	case modeRunbooks:
		return RenderRunbooks(m.rbIndex, m.rbStep, m.width, m.height)
	case modeBrowse:
		return m.renderBrowse()
	default:
		return m.renderSearch()
	}
}

func (m *model) renderSearch() string {
	suite := "All suites"
	if s := m.suiteName(); s != "" {
		suite = s
	}
	header := stTitle.Render("dc-cheat") + "  " + stAccent.Render(suite) + stDim.Render(fmt.Sprintf("  (tab / shift+tab)   %d commands", len(m.results))) + "  " + stDim.Render("[ctrl+o browse · esc home]")
	rule := stRule.Render(strings.Repeat("─", m.width))
	footer := m.status
	if footer == "" {
		footer = stDim.Render("↑↓ move · enter print · ctrl+y copy · ctrl+e explain · ctrl+t alt · ctrl+o browse · esc home")
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

func (m *model) renderBrowse() string {
	sg := m.currentSuiteGroup()
	if sg == nil || len(sg.Sheets) == 0 {
		return "no suites or sheets available"
	}
	sh := m.currentSheet()
	sec := m.currentSection()

	header := stTitle.Render("dc-cheat") + "  " + stPillBadge.Render(" BROWSE ") + "  " + stAccent.Render(sg.Name) + stDim.Render("  (tab suite · / search)")

	locSheet := ""
	if sh != nil {
		locSheet = sh.Name
	}
	locSec := ""
	if sec != nil {
		locSec = sec.Name
	}
	subHeader := stAccent.Render(sg.Name) + stDim.Render(" › ") + stCmd.Render(locSheet) + stDim.Render(" › ") + locSec

	rule := stRule.Render(strings.Repeat("─", m.width))
	footer := m.status
	if footer == "" {
		footer = stDim.Render("←→ col · ↑↓ move · enter drill/pick · ctrl+e explain · ctrl+y copy · / search")
	}

	fit := lipgloss.NewStyle().MaxWidth(m.width)
	header, subHeader, footer = fit.Render(header), fit.Render(subHeader), fit.Render(footer)

	rows := m.height - 4
	if rows < 2 {
		rows = 2
	}

	if m.width >= wideLayout {
		col0W := max(16, m.width*22/100)
		col1W := max(18, m.width*24/100)
		sepW := 3 // " │ "
		col2W := m.width - col0W - col1W - (sepW * 2)

		// Column 0: Sheets
		h0 := truncate("SHEETS ("+fmt.Sprint(len(sg.Sheets))+")", col0W)
		if m.browseCol == 0 {
			h0 = stAccent.Render("▶ " + h0)
		} else {
			h0 = stDim.Render("  " + h0)
		}

		if m.sheetIdx < m.sheetOff {
			m.sheetOff = m.sheetIdx
		}
		if m.sheetIdx >= m.sheetOff+rows-1 {
			m.sheetOff = m.sheetIdx - (rows - 1) + 1
		}

		var lines0 []string
		for i := m.sheetOff; i < len(sg.Sheets) && len(lines0) < rows-1; i++ {
			s := &sg.Sheets[i]
			text := truncate(s.Name, col0W-2)
			if i == m.sheetIdx {
				if m.browseCol == 0 {
					text = stSelected.Render(pad(text, col0W-2))
				} else {
					text = stAccent.Render("▸ " + truncate(s.Name, col0W-4))
				}
			} else {
				text = "  " + text
			}
			lines0 = append(lines0, text)
		}
		for len(lines0) < rows-1 {
			lines0 = append(lines0, "")
		}

		// Column 1: Sections
		secLen := 0
		if sh != nil {
			secLen = len(sh.Sections)
		}
		h1 := truncate("SECTIONS ("+fmt.Sprint(secLen)+")", col1W)
		if m.browseCol == 1 {
			h1 = stAccent.Render("▶ " + h1)
		} else {
			h1 = stDim.Render("  " + h1)
		}

		if m.secIdx < m.secOff {
			m.secOff = m.secIdx
		}
		if m.secIdx >= m.secOff+rows-1 {
			m.secOff = m.secIdx - (rows - 1) + 1
		}

		var lines1 []string
		if sh != nil {
			for j := m.secOff; j < len(sh.Sections) && len(lines1) < rows-1; j++ {
				sc := &sh.Sections[j]
				text := truncate(sc.Name, col1W-2)
				if j == m.secIdx {
					if m.browseCol == 1 {
						text = stSelected.Render(pad(text, col1W-2))
					} else {
						text = stAccent.Render("▸ " + truncate(sc.Name, col1W-4))
					}
				} else {
					text = "  " + text
				}
				lines1 = append(lines1, text)
			}
		}
		for len(lines1) < rows-1 {
			lines1 = append(lines1, "")
		}

		// Column 2: Detail
		cmdCount := 0
		if sec != nil {
			cmdCount = len(sec.Entries)
		}
		h2 := fmt.Sprintf("COMMAND (%d/%d)", m.cursor+1, cmdCount)
		if m.browseCol == 2 {
			h2 = stAccent.Render(fmt.Sprintf("▶ COMMAND (%d/%d · ↑↓ step)", m.cursor+1, cmdCount))
		} else {
			h2 = stDim.Render("  " + h2)
		}

		detail := m.renderDetail(col2W, rows-1)

		c0Str := lipgloss.NewStyle().Width(col0W).Render(h0 + "\n" + strings.Join(lines0, "\n"))
		c1Str := lipgloss.NewStyle().Width(col1W).Render(h1 + "\n" + strings.Join(lines1, "\n"))
		c2Str := lipgloss.NewStyle().Width(col2W).Render(h2 + "\n" + detail)
		sep := stRule.Render(strings.TrimRight(strings.Repeat("│\n", rows), "\n"))

		body := lipgloss.JoinHorizontal(lipgloss.Top, c0Str, " ", sep, " ", c1Str, " ", sep, " ", c2Str)
		return header + "\n" + subHeader + "\n" + rule + "\n" + body + "\n" + footer
	}

	// Narrow layout (drill down)
	switch m.browseCol {
	case 0:
		// Sheets list
		h0 := truncate(stAccent.Render("▶ Select Sheet (Enter or → to view sections):"), m.width)
		var lines []string
		lines = append(lines, h0)
		if m.sheetIdx < m.sheetOff {
			m.sheetOff = m.sheetIdx
		}
		if m.sheetIdx >= m.sheetOff+rows-1 {
			m.sheetOff = m.sheetIdx - (rows - 1) + 1
		}
		for i := m.sheetOff; i < len(sg.Sheets) && len(lines) < rows; i++ {
			s := &sg.Sheets[i]
			text := truncate(s.Name, m.width-2)
			if i == m.sheetIdx {
				text = stSelected.Render(pad(text, m.width-2))
			} else {
				text = "  " + text
			}
			lines = append(lines, text)
		}
		for len(lines) < rows {
			lines = append(lines, "")
		}
		body := strings.Join(lines, "\n")
		return header + "\n" + subHeader + "\n" + rule + "\n" + body + "\n" + footer
	case 1:
		// Sections list
		h1 := truncate(stAccent.Render("▶ "+locSheet+" › Select Section:"), m.width)
		var lines []string
		lines = append(lines, h1)
		if m.secIdx < m.secOff {
			m.secOff = m.secIdx
		}
		if m.secIdx >= m.secOff+rows-1 {
			m.secOff = m.secIdx - (rows - 1) + 1
		}
		if sh != nil {
			for j := m.secOff; j < len(sh.Sections) && len(lines) < rows; j++ {
				sc := &sh.Sections[j]
				text := truncate(sc.Name, m.width-2)
				if j == m.secIdx {
					text = stSelected.Render(pad(text, m.width-2))
				} else {
					text = "  " + text
				}
				lines = append(lines, text)
			}
		}
		for len(lines) < rows {
			lines = append(lines, "")
		}
		body := strings.Join(lines, "\n")
		return header + "\n" + subHeader + "\n" + rule + "\n" + body + "\n" + footer
	default:
		// Command in section
		detail := m.renderDetail(m.width, rows)
		return header + "\n" + subHeader + "\n" + rule + "\n" + detail + "\n" + footer
	}
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

	// 1. Breadcrumb location
	loc := e.Suite + " › " + strings.TrimSuffix(e.File, ".html")
	if e.Sec != "" {
		loc += " › " + e.Sec
	}
	b = append(b, stDim.Render(truncate(loc, w)))

	// 2. Badges row
	var badges []string
	if e.Danger {
		badges = append(badges, stPillDanger.Render(" ⚠ STATE CHANGE "))
	}
	switch e.Root {
	case "root":
		badges = append(badges, stPillRoot.Render(" # NEEDS ROOT "))
	case "admin":
		badges = append(badges, stPillRoot.Render(" ⚡ SLURM ADMIN "))
	case "maybe":
		badges = append(badges, stPillRoot.Render(" ? MAYBE ROOT "))
	}
	if e.Badge != "" {
		badges = append(badges, stPillBadge.Render(" "+e.Badge+" "))
	}
	if e.Ref {
		badges = append(badges, stPillRef.Render(" REFERENCE "))
	}
	if len(badges) > 0 {
		b = append(b, wrap.Render(strings.Join(badges, " ")))
	}

	// 3. Command Card Box
	var cmdBody strings.Builder
	if len(e.Copy) > 1 {
		for i := range e.Copy {
			prefix := "  "
			st := stDim
			if i == m.alt {
				prefix, st = "▸ ", stCmd
			}
			if i > 0 {
				cmdBody.WriteString("\n")
			}
			cmdBody.WriteString(prefix + st.Render(e.Plain(i)))
		}
		cmdBody.WriteString("\n" + stDim.Render(fmt.Sprintf("  alt %d of %d · ctrl+t cycles", m.alt+1, len(e.Copy))))
	} else {
		cmdBody.WriteString(stCmd.Render(strings.TrimPrefix(e.Cmd, "$ ")))
	}

	if w >= 20 {
		boxBorder := lipgloss.Color("8")
		if e.Danger {
			boxBorder = lipgloss.Color("1")
		}
		cmdBox := lipgloss.NewStyle().
			Width(w).
			Border(lipgloss.RoundedBorder()).
			BorderForeground(boxBorder).
			Padding(0, 1)
		b = append(b, cmdBox.Render(cmdBody.String()))
	} else {
		b = append(b, wrap.Render(cmdBody.String()))
	}

	// 4. Description
	if e.Desc != "" {
		b = append(b, wrap.Render(e.Desc))
	}

	// 5. Root explanation / warning note
	switch e.Root {
	case "root":
		toolWhy := e.RootWhy
		if e.RootTool != "" {
			toolWhy = e.RootTool + ": " + toolWhy
		}
		b = append(b, wrap.Render(stRoot.Render("🔒 Root required: ")+stDim.Render(toolWhy+" (copies with \"# needs root\", no sudo)")))
	case "admin":
		b = append(b, wrap.Render(stRoot.Render("⚡ Admin: ")+stDim.Render(e.RootWhy)))
	case "maybe":
		b = append(b, wrap.Render(stRoot.Render("? Check privs: ")+stDim.Render(e.RootWhy)))
	}
	if e.Ref {
		b = append(b, stDim.Render("Reference text: nothing to copy."))
	}

	// 6. Tip callout
	if e.Tip != "" {
		tipStyle := lipgloss.NewStyle().
			Border(lipgloss.NormalBorder(), false, false, false, true).
			BorderForeground(lipgloss.Color("6")).
			PaddingLeft(1).
			Width(w)
		b = append(b, tipStyle.Render(stAccent.Render("Tip: ")+e.Tip))
	}

	// 7. Tags
	if e.Tags != "" {
		tags := strings.Fields(e.Tags)
		if len(tags) > 0 {
			b = append(b, wrap.Render(stDim.Render("Tags: "+strings.Join(tags, " · "))))
		}
	}

	// 8. Explain Breakdown
	if m.explain && len(e.Copy) > 0 {
		explainStyle := lipgloss.NewStyle().
			Border(lipgloss.NormalBorder(), false, false, false, true).
			BorderForeground(lipgloss.Color("4")).
			PaddingLeft(1).
			Width(w)
		explained := ExplainText(Explain(m.data, e.Plain(m.alt)))
		b = append(b, stTitle.Render("Flag Breakdown (ctrl+e to hide):"), explainStyle.Render(explained))
	} else if len(e.Copy) > 0 {
		b = append(b, stDim.Render("ctrl+e explains flags"))
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
