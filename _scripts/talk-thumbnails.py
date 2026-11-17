# /// script
# requires-python = ">=3.10"
# dependencies = ["playwright>=1.45"]
# ///
"""Take the thumbnail of each talk page: a 1200x630 screenshot of its slides or site.

The picture is saved as talks/<folder>/thumbnail.png and used as the page's
`image:` (link preview card). The script adds `image: thumbnail.png` to the
front matter when it is missing.

Which URL: the first link labelled Slides, Materials or Workshop site in the
page's `{.gw-talk-links}` line, unless --url is given. Speaker Deck, YouTube
and PDF links are skipped (no useful screenshot).

Usage (from the root of the site):

    uv run _scripts/talk-thumbnails.py                     # talks without a thumbnail
    uv run _scripts/talk-thumbnails.py 2026-06-17-rr-quarto-lua --force
    uv run _scripts/talk-thumbnails.py 2026-11-19-uros-quarto --url https://cderv.dev/uros2026-quarto-intro/

Browser: uses Microsoft Edge or Chrome when installed (channel), else the
Playwright Chromium (run `uv run --with playwright playwright install chromium` once).
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

from playwright.sync_api import Error as PlaywrightError
from playwright.sync_api import sync_playwright

WIDTH, HEIGHT = 1200, 630
LABELS = ("Slides", "Materials", "Workshop site")
SKIP = ("speakerdeck.com", "youtube.com", "youtu.be", ".pdf")
TALKS = Path("talks")


def links(qmd: str) -> list[tuple[str, str]]:
    line = next((l for l in qmd.splitlines() if "{.gw-talk-links}" in l), "")
    return re.findall(r"\[([^\[\]]+)\]\((https?://[^)\s]+)\)", line)


def pick_url(qmd: str) -> str | None:
    for label, url in links(qmd):
        if label in LABELS and not any(s in url for s in SKIP):
            return url
    return None


def ensure_image_field(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\r?\n(.*?)\r?\n---", text, re.S)
    if not m or re.search(r"^image:", m.group(1), re.M):
        return False
    text = re.sub(r"^(date: .*)$", r"\1\nimage: thumbnail.png", text, count=1, flags=re.M)
    path.write_text(text, encoding="utf-8")
    return True


def launch(p, executable: str | None):
    if executable:
        return p.chromium.launch(executable_path=executable)
    for channel in ("msedge", "chrome", None):
        try:
            return p.chromium.launch(channel=channel) if channel else p.chromium.launch()
        except PlaywrightError:
            continue
    sys.exit("No browser found: run `uv run --with playwright playwright install chromium`.")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("talks", nargs="*", help="talk folders under talks/ (default: all)")
    ap.add_argument("--url", help="page to screenshot (one talk only)")
    ap.add_argument("--force", action="store_true", help="replace an existing thumbnail")
    ap.add_argument("--wait", type=float, default=2.5, help="seconds to wait after load")
    ap.add_argument("--browser-path", help="path to a Chromium executable")
    args = ap.parse_args()

    if not TALKS.is_dir():
        sys.exit("Run from the root of the site (talks/ not found).")
    folders = [TALKS / t for t in args.talks] or sorted(d for d in TALKS.iterdir() if d.is_dir())
    if args.url and len(folders) != 1:
        sys.exit("--url needs exactly one talk folder.")

    with sync_playwright() as p:
        browser = launch(p, args.browser_path)
        page = browser.new_page(viewport={"width": WIDTH, "height": HEIGHT})
        for folder in folders:
            qmd = folder / "index.qmd"
            out = folder / "thumbnail.png"
            if not qmd.exists():
                print(f"skip {folder.name}: no index.qmd")
                continue
            if out.exists() and not args.force:
                print(f"skip {folder.name}: thumbnail.png exists (--force to replace)")
                continue
            url = args.url or pick_url(qmd.read_text(encoding="utf-8"))
            if not url:
                print(f"skip {folder.name}: no Slides/Materials/Workshop site link")
                continue
            try:
                page.goto(url, wait_until="load", timeout=30_000)
            except PlaywrightError as e:
                print(f"FAIL {folder.name}: {url}: {e.message.splitlines()[0]}")
                continue
            page.wait_for_timeout(args.wait * 1000)
            page.screenshot(path=out)
            added = " (image: added to front matter)" if ensure_image_field(qmd) else ""
            print(f"ok   {folder.name}: {url}{added}")
        browser.close()


if __name__ == "__main__":
    main()
