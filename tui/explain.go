package main

import (
	"regexp"
	"strings"
)

// Explain a command with the flag notes the site's sheets already carry
// (flag-index.js, harvested by build-index.js). Tokens the sheets don't cover are
// listed as unknown so you know to check the man page.

// Part is one explained piece of a stage: a subcommand or a flag.
type Part struct {
	Token string
	Desc  string
	Sheet string
	Known bool
}

// Stage is one command in a pipeline or chain.
type Stage struct {
	Op    string // the operator before it: "", "|", ";", "&&", "||"
	Text  string
	Tool  string
	Parts []Part
}

// Same wrappers build-index.js skips when it decides which tool a command belongs to.
var wrappers = regexp.MustCompile(`^(sudo|doas|env|time|nohup|nice|ionice|stdbuf|timeout|watch|exec|command|builtin|xargs)$`)
var envAssign = regexp.MustCompile(`^[A-Za-z_][A-Za-z0-9_]*=`)
var toolName = regexp.MustCompile(`^[A-Za-z][\w.+-]*$`)
var flagKey = regexp.MustCompile(`^--?[\w][\w-]*`)
var shortRun = regexp.MustCompile(`^-[A-Za-z]{2,}$`)

// splitStages cuts at | ; && || and newlines outside quotes, $( ) and { }.
func splitStages(s string) []Stage {
	var out []Stage
	var cur strings.Builder
	op, quote, depth := "", byte(0), 0
	flush := func(next string) {
		out = append(out, Stage{Op: op, Text: strings.TrimSpace(cur.String())})
		cur.Reset()
		op = next
	}
	for i := 0; i < len(s); i++ {
		c := s[i]
		if quote != 0 {
			cur.WriteByte(c)
			if c == quote && (i == 0 || s[i-1] != '\\') {
				quote = 0
			}
			continue
		}
		switch {
		case c == '"' || c == '\'':
			quote = c
		case c == '(' || c == '{':
			depth++
		case (c == ')' || c == '}') && depth > 0:
			depth--
		}
		if depth == 0 && i+1 < len(s) && (s[i:i+2] == "&&" || s[i:i+2] == "||") {
			flush(s[i : i+2])
			i++
			continue
		}
		if depth == 0 && (c == '|' || c == ';' || c == '\n') {
			flush(string(c))
			continue
		}
		cur.WriteByte(c)
	}
	flush("")
	kept := out[:0]
	for _, st := range out {
		if st.Text != "" && !strings.HasPrefix(st.Text, "#") {
			kept = append(kept, st)
		}
	}
	return kept
}

// words splits a stage like a shell would for this purpose: quotes keep spaces.
func words(s string) []string {
	var out []string
	var cur strings.Builder
	quote := byte(0)
	for i := 0; i < len(s); i++ {
		c := s[i]
		switch {
		case quote != 0:
			if c == quote {
				quote = 0
			} else {
				cur.WriteByte(c)
			}
		case c == '"' || c == '\'':
			quote = c
		case c == ' ' || c == '\t':
			if cur.Len() > 0 {
				out = append(out, cur.String())
				cur.Reset()
			}
		default:
			cur.WriteByte(c)
		}
	}
	if cur.Len() > 0 {
		out = append(out, cur.String())
	}
	return out
}

// Explain breaks a command into stages and explains each tool's subcommand and flags.
func Explain(d *Data, cmd string) []Stage {
	stages := splitStages(cmd)
	for si := range stages {
		st := &stages[si]
		w := words(strings.TrimPrefix(strings.TrimSpace(st.Text), "$ "))
		k := 0
		for ; k < len(w); k++ {
			t := w[k]
			if t == "" || envAssign.MatchString(t) || wrappers.MatchString(t) || strings.HasPrefix(t, "-") || isDigits(t) {
				continue
			}
			base := t[strings.LastIndex(t, "/")+1:]
			if toolName.MatchString(base) {
				st.Tool = base
			}
			break
		}
		if st.Tool == "" {
			continue
		}
		bucket := d.Flags[st.Tool]
		args := w[k+1:]

		// Subcommand: the longest run of up to three leading words the sheets know.
		var lead []string
		for _, a := range args {
			if strings.HasPrefix(a, "-") || len(lead) == 3 {
				break
			}
			lead = append(lead, a)
		}
		for n := len(lead); n > 0; n-- {
			key := strings.Join(lead[:n], " ")
			if v, ok := bucket[key]; ok {
				st.Parts = append(st.Parts, part(key, v))
				break
			}
		}

		for _, a := range args {
			if !strings.HasPrefix(a, "-") || a == "-" || a == "--" {
				continue
			}
			key := flagKey.FindString(a)
			if key == "" {
				continue
			}
			if v, ok := bucket[key]; ok {
				st.Parts = append(st.Parts, part(key, v))
				continue
			}
			// -tlnp: try each letter on its own.
			if shortRun.MatchString(key) {
				found := false
				for _, r := range key[1:] {
					if v, ok := bucket["-"+string(r)]; ok {
						st.Parts = append(st.Parts, part("-"+string(r), v))
						found = true
					}
				}
				if found {
					continue
				}
			}
			st.Parts = append(st.Parts, Part{Token: key})
		}
	}
	return stages
}

func part(token string, v []string) Part {
	p := Part{Token: token, Known: true}
	if len(v) > 0 {
		p.Desc = v[0]
	}
	if len(v) > 1 {
		p.Sheet = v[1]
	}
	return p
}

func isDigits(s string) bool {
	for _, r := range s {
		if r < '0' || r > '9' {
			return false
		}
	}
	return s != ""
}

// ExplainText renders an explanation as plain lines.
func ExplainText(stages []Stage) string {
	var b strings.Builder
	for i, st := range stages {
		if i > 0 {
			b.WriteString("\n")
		}
		if st.Op != "" {
			b.WriteString(st.Op + " ")
		}
		b.WriteString(st.Text + "\n")
		if st.Tool == "" {
			b.WriteString("    (no tool found)\n")
			continue
		}
		if len(st.Parts) == 0 {
			b.WriteString("    " + st.Tool + ": no flags or subcommands to explain\n")
			continue
		}
		for _, p := range st.Parts {
			if p.Known {
				b.WriteString("    " + p.Token + "  " + p.Desc)
				if p.Sheet != "" {
					b.WriteString("  [" + strings.TrimSuffix(p.Sheet, ".html") + "]")
				}
				b.WriteString("\n")
			} else {
				b.WriteString("    " + p.Token + "  not on the sheets: see man " + st.Tool + "\n")
			}
		}
	}
	return b.String()
}
