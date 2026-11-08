"""Render the prototype headless and save an SVG screenshot (for comparing with the site).

Usage: .venv/bin/python shot.py <sheet.html> <out.svg> [cols] [rows] [keys...]
"""

import asyncio
import sys
from pathlib import Path

from dc_cheat import CheatSheet


async def main() -> None:
    sheet, out = sys.argv[1], Path(sys.argv[2]).resolve()
    cols = int(sys.argv[3]) if len(sys.argv) > 3 else 160
    rows = int(sys.argv[4]) if len(sys.argv) > 4 else 48
    keys = sys.argv[5:]
    app = CheatSheet(sheet)
    async with app.run_test(size=(cols, rows)) as pilot:
        await pilot.pause(0.5)
        for k in keys:
            await pilot.press(k)
            await pilot.pause(0.2)
        await pilot.pause(0.3)
        app.save_screenshot(filename=out.name, path=str(out.parent))


asyncio.run(main())
