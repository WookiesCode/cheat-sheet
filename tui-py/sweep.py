"""Open every exported sheet in one headless session: crashes and render times."""

import asyncio
import time

from dc_cheat import WHERE, CheatSheet


async def main() -> None:
    app = CheatSheet("ib-mlxlink.html")
    slow, errors = [], []
    async with app.run_test(size=(160, 48)) as pilot:
        await pilot.pause(0.3)
        for file in WHERE:
            app.file = file
            t = time.perf_counter()
            try:
                await app.render_sheet()
                await pilot.pause(0)
            except Exception as e:  # report every failure, keep going
                errors.append(f"{file}: {type(e).__name__}: {e}")
                continue
            slow.append((time.perf_counter() - t, file, len(app.boxes())))
    slow.sort(reverse=True)
    print(f"sheets: {len(WHERE)}  errors: {len(errors)}")
    for e in errors[:10]:
        print("  ", e)
    print("slowest:", ", ".join(f"{f} {s:.2f}s ({n} cmds)" for s, f, n in slow[:5]))
    print(f"median: {sorted(s for s, _, _ in slow)[len(slow) // 2]:.2f}s")


asyncio.run(main())
