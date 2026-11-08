package main

import (
	"regexp"
	"sort"
	"strings"
)

// Ported from scoreEntry() in cheat-sheets/common.js so the terminal ranks results
// the same way the site's search does. Every word of the query must match somewhere.
var genericSheets = regexp.MustCompile(`^(markdown|json|yaml|toml|regex|text|scripting|javascript|typescript|python|lua|sql|jira)$`)

func score(e *Entry, tokens []string, words []*regexp.Regexp, phrase string) float64 {
	total := 0.0
	for i, t := range tokens {
		s := 0.0
		switch {
		case words[i].MatchString(e.about):
			s += 5
		case strings.Contains(e.about, t):
			s += 3
		}
		switch {
		case strings.HasPrefix(e.cmdLC, t):
			s += 5
		case words[i].MatchString(e.cmdLC):
			s += 3
		case strings.Contains(e.cmdLC, t):
			s += 1.5
		}
		if strings.Contains(e.sheetLC, t) {
			s += 4
		}
		if s == 0 {
			return 0
		}
		total += s
	}
	if len(tokens) > 1 && strings.Contains(e.about, phrase) {
		total += 8
	}
	if len(tokens) > 1 && strings.Contains(e.cmdLC, phrase) {
		total += 2
	}
	if genericSheets.MatchString(e.Sheet) && !contains(tokens, e.Sheet) {
		total *= 0.5
	}
	return total
}

func contains(list []string, s string) bool {
	for _, v := range list {
		if v == s {
			return true
		}
	}
	return false
}

// Search returns entry indexes, best first. suite "" means every suite.
// An empty query lists the suite in sheet order.
func Search(d *Data, query, suite string) []int {
	tokens := strings.Fields(strings.ToLower(query))
	words := make([]*regexp.Regexp, len(tokens))
	for i, t := range tokens {
		// A whole word: not a letter or digit on either side.
		words[i] = regexp.MustCompile(`(^|[^a-z0-9])` + regexp.QuoteMeta(t) + `([^a-z0-9]|$)`)
	}
	phrase := strings.Join(tokens, " ")

	type hit struct {
		i int
		s float64
	}
	var hits []hit
	for i := range d.Entries {
		e := &d.Entries[i]
		if suite != "" && e.Suite != suite {
			continue
		}
		if len(tokens) == 0 {
			hits = append(hits, hit{i, 0})
			continue
		}
		if s := score(e, tokens, words, phrase); s > 0 {
			hits = append(hits, hit{i, s})
		}
	}
	// Stable: equal scores keep sheet order, like the site.
	sort.SliceStable(hits, func(a, b int) bool { return hits[a].s > hits[b].s })
	out := make([]int, len(hits))
	for k, h := range hits {
		out[k] = h.i
	}
	return out
}
