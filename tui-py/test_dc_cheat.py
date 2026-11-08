"""Interaction tests: drive the prototype like a person (clicks and keys), headless.

Run: .venv/bin/python -m pytest -q test_dc_cheat.py   (or: .venv/bin/python test_dc_cheat.py)
"""

import asyncio

from dc_cheat import CheatSheet, CommandBox, Link


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

    # Narrow window: one column, nothing wider than the screen.
    app = CheatSheet("ib-mlxlink.html")
    async with app.run_test(size=(120, 40)) as pilot:
        await pilot.pause(0.5)
        check(not app.query_one("#col2").display, "120 columns: cards in one column")
    return fails


def test_scenario() -> None:
    assert asyncio.run(scenario()) == []


if __name__ == "__main__":
    raise SystemExit(1 if asyncio.run(scenario()) else 0)
