"""Interaction tests: drive the prototype like a person (clicks and keys), headless.

Run: .venv/bin/python -m pytest -q test_dc_cheat.py   (or: .venv/bin/python test_dc_cheat.py)
"""

import asyncio

from textual import events
from textual.widgets import Input, TextArea

from dc_cheat import CheatSheet, CommandBox, ExplainScreen, Link


async def scenario() -> list[str]:
    fails: list[str] = []

    def check(ok: bool, what: str) -> None:
        print(("ok   " if ok else "FAIL ") + what)
        if not ok:
            fails.append(what)

    app = CheatSheet("ib-mlxlink.html")
    async with app.run_test(size=(160, 48)) as pilot:
        await pilot.pause(0.5)
        check(isinstance(app.focused, CommandBox), "starts on the first command, not the search box")
        check(str(app.query_one("#brand-chip").render()).strip() == "IB#", "brand chip reads IB#")

        # Enter copies the focused command in the house style (root note, no sudo).
        await pilot.press("enter")
        check(app.clipboard == "# needs root\nmlxlink -d mlx5_0 -m -c -e", f"enter copies with the root note: {app.clipboard!r}")

        # j moves to the next command in the sheet's order.
        first = app.focused
        await pilot.press("j")
        check(app.focused is not first and isinstance(app.focused, CommandBox), "j moves to the next command")

        # A real click on a command copies it (mouse down/up via the pilot).
        box = app.order[0]
        box.scroll_visible(animate=False)
        await pilot.pause(0.2)
        app.copy_to_clipboard("")
        await pilot.click(box, offset=(5, 2))
        check(app.clipboard.endswith("mlxlink -d mlx5_0 -m -c -e"), "clicking a command copies it")

        # ] goes to the next sheet in the suite, [ comes back.
        await pilot.press("right_square_bracket")
        await pilot.pause(0.5)
        check(app.file == "ib-mlxcables.html", f"] opens the next sheet ({app.file})")
        await pilot.press("left_square_bracket")
        await pilot.pause(0.5)
        check(app.file == "ib-mlxlink.html", "[ comes back")

        # Clicking a sidebar item opens that sheet.
        item = next(w for w in app.query(".side-item") if isinstance(w, Link) and w.target == "ib-ibstat.html")
        await pilot.click(item)
        await pilot.pause(0.5)
        check(app.file == "ib-ibstat.html", "sidebar click opens ibstat")

        # Clicking a nav tab opens that tab's first sheet.
        tab = next(w for w in app.query(".tab") if "Hardware" in str(w.render()))
        await pilot.click(tab)
        await pilot.pause(0.5)
        check(app.file == tab.target and "-active" in tab.classes or app.file == tab.target, f"Hardware tab opens {tab.target}")

        # Search: / focuses it; Enter jumps to the first match and focuses that command.
        await pilot.press("slash")
        check(app.focused is app.query_one("#search"), "/ focuses search")
        for ch in "fallen off":
            await pilot.press("space" if ch == " " else ch)
        await pilot.press("enter")
        await pilot.pause(0.6)
        f = app.focused
        check(isinstance(f, CommandBox) and "fallen off" in (f.entry["cmd"] + f.entry["desc"]).lower(), f"search lands on a matching command ({app.file})")

        # The pager's NEXT box is a working link.
        nxt = app.query_one("#page-next", Link)
        if nxt.target:
            want = nxt.target
            await pilot.click(nxt)
            await pilot.pause(0.5)
            check(app.file == want, "pager NEXT opens the next sheet")

    # Alternatives that wrap: a click on the third one ("reset") copies that one.
    app = CheatSheet("ipmi-chassis-power.html")
    async with app.run_test(size=(160, 48)) as pilot:
        await pilot.pause(0.5)
        box = app.order[0]
        rows = {}
        for y in range(1, box.size.height - 1):
            rows.setdefault(box.alt_at(y), y)
        await pilot.click(box, offset=(10, rows.get(2, 0)))
        check(app.clipboard.endswith("chassis power reset"), f"click on the 3rd wrapped alternative copies it: {app.clipboard[-40:]!r}")
        await pilot.click(box, offset=(10, rows.get(0, 0)))
        check(app.clipboard.endswith("chassis power status"), "click on the 1st copies status")

    # Explain: e on a focused command opens it with that command, explained.
    app = CheatSheet("ib-mlxlink.html")
    async with app.run_test(size=(160, 48)) as pilot:
        await pilot.pause(0.5)
        await pilot.press("e")
        await pilot.pause(0.6)
        scr = app.screen
        check(isinstance(scr, ExplainScreen), "e opens Explain")
        inp = scr.query_one("#ex-input", TextArea)
        check(inp.text == "mlxlink -d mlx5_0 -m -c -e", f"e fills in the focused command (no root note): {inp.text!r}")
        check(scr.last is not None and scr.last.stages[0].tool == "mlxlink", "it is explained straight away")
        # Sheet keys don't act on the page behind the dialog.
        file = app.file
        await pilot.press("escape")
        await pilot.pause(0.3)
        check(not isinstance(app.screen, ExplainScreen), "Esc closes Explain")
        check(isinstance(app.focused, CommandBox), "focus goes back to the sheet's command")

        # The toolbar button opens it empty, with the site's samples; clicking one explains it.
        await pilot.click("#explain-btn")
        await pilot.pause(0.6)
        scr = app.screen
        check(isinstance(scr, ExplainScreen) and scr.query_one("#ex-input", TextArea).text == "", "Explain button opens it empty")
        scr.query_one("#ex-close").focus()  # off the input, so the keys aren't typed into it
        await pilot.press("j", "right_square_bracket", "c")
        await pilot.pause(0.3)
        check(app.file == file and isinstance(app.screen, ExplainScreen), "j ] c do nothing to the sheet while Explain is open")
        sample = scr.query(".ex-sample")[1]  # the ipmitool power cycle with -P Hunter2
        await pilot.click(sample)
        await pilot.pause(0.6)
        check(scr.last is not None and scr.last.verdict == "crit", "a sample click explains it: stop verdict")
        check(len(scr.query(".ex-finding")) == 3, "three findings: changes state, password, remote")

        # Tab from the input goes straight to the first button (the results aren't a Tab stop).
        scr.query_one("#ex-input", TextArea).focus()
        await pilot.press("tab")
        check("safe version" in str(getattr(app.focused, "content", "")), f"Tab from the input reaches the first button ({type(app.focused).__name__})")

        # Copy the safe version: the password swapped for -E.
        btn = next(b for b in scr.query(".exbtn") if "safe version" in str(b.render()))
        btn.scroll_visible(animate=False)
        await pilot.pause(0.2)
        await pilot.click(btn)
        check(app.clipboard == "ipmitool -I lanplus -H 10.20.4.17 -U admin -E chassis power cycle", f"safe copy: {app.clipboard!r}")

        # Typing updates it, a moment after the last key.
        inp = scr.query_one("#ex-input", TextArea)
        inp.focus()
        inp.text = ""
        for ch in "nvidia-smi -r":
            await pilot.press({"-": "minus", " ": "space"}.get(ch, ch))
        await pilot.pause(0.6)
        rows = [r for s in scr.last.stages for r in s.rows]
        check(any(r.tok == "-r" and "reset" in r.plain().lower() for r in rows), "typing nvidia-smi -r explains -r as a GPU reset")
        check(scr.last.verdict == "crit", "nvidia-smi -r: changes state")

        # A paste keeps its lines: history with a "$ " prompt and a backslash continuation.
        inp.text = ""
        inp.focus()
        app.post_message(events.Paste(  # as a terminal delivers it: to the app, which hands it to the focused widget
            "$ dmesg -T \\\n  --level=err\n$ journalctl -k -f"))
        await pilot.pause(0.6)
        tools = [s.tool for s in scr.last.stages]
        check(tools == ["dmesg", "journalctl"] and "--level=err" in scr.last.stages[0].raw, f"pasted lines kept: {tools} {inp.text!r}")
        check(any(f.title == "Never returns on its own" for f in scr.last.findings), "journalctl -f: never returns")
        inp.text = "nvidia-smi -r"
        await pilot.pause(0.6)

        # Copy command, with the keyboard: Tab to the button and press Enter.
        copy = next(b for b in scr.query(".exbtn") if "Copy command" in str(b.render()))
        copy.focus()
        await pilot.press("enter")
        check(app.clipboard == "nvidia-smi -r", "Copy command (Enter on the button)")

        # Sheet: … → closes Explain and opens that sheet.
        # nvidia-smi's sheet is the NVIDIA hub, which the terminal lacks: the button opens the suite.
        sheet_btn = next(b for b in scr.query(".exbtn") if "Suite: NVIDIA" in str(b.render()))
        sheet_btn.scroll_visible(animate=False)
        await pilot.pause(0.2)
        await pilot.click(sheet_btn)
        await pilot.pause(0.6)
        check(not isinstance(app.screen, ExplainScreen) and app.file.startswith("nv-"), f"Suite button opens the NVIDIA suite ({app.file})")

        # Search the sheets for <tool>: closes Explain and jumps to the first match.
        await pilot.press("e")
        await pilot.pause(0.6)
        scr = app.screen
        scr.query_one("#ex-input", TextArea).text = "ibstat -v"
        await pilot.pause(0.6)
        srch = next(b for b in scr.query(".exbtn") if "Search the sheets" in str(b.render()))
        srch.scroll_visible(animate=False)
        await pilot.pause(0.2)
        await pilot.click(srch)
        await pilot.pause(0.8)
        f = app.focused
        check(app.query_one("#search", Input).value == "ibstat" and isinstance(f, CommandBox) and "ibstat" in f.entry["cmd"], f"search button jumps to an ibstat command ({app.file})")

    # Narrow window: one column, nothing wider than the screen.
    app = CheatSheet("ib-mlxlink.html")
    async with app.run_test(size=(120, 40)) as pilot:
        await pilot.pause(0.5)
        check(not app.query_one("#col2").display, "120 columns: cards in one column")

    # A small laptop window: the Explain button is still on screen and works.
    app = CheatSheet("nv-smi.html")
    async with app.run_test(size=(90, 36)) as pilot:
        await pilot.pause(0.5)
        btn = app.query_one("#explain-btn")
        check(btn.region.right <= 90 and btn.region.width > 0, f"90 columns: Explain button visible ({btn.region})")
        await pilot.click(btn)
        await pilot.pause(0.6)
        check(isinstance(app.screen, ExplainScreen), "90 columns: clicking it opens Explain")
    return fails


def test_scenario() -> None:
    assert asyncio.run(scenario()) == []


if __name__ == "__main__":
    raise SystemExit(1 if asyncio.run(scenario()) else 0)
