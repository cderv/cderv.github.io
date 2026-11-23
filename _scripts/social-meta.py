# /// script
# requires-python = ">=3.10"
# ///
"""List the link-preview meta tags (og:*, twitter:*, description) of rendered pages.

Usage: uv run _scripts/social-meta.py [_site] > tags.tsv
One line per page and tag: path, tag name, content. Redirect pages are skipped.
Use it to compare the tags before and after a change to the site or q2.
"""
import html.parser
import pathlib
import sys


class Meta(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags = []
        self.redirect = False

    def handle_starttag(self, tag, attrs):
        if tag != "meta":
            return
        a = dict(attrs)
        if a.get("http-equiv", "").lower() == "refresh":
            self.redirect = True
        key = a.get("property") or a.get("name")
        if key and (key.startswith(("og:", "twitter:")) or key == "description"):
            self.tags.append((key, a.get("content", "")))


site = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
for page in sorted(site.rglob("*.html")):
    p = Meta()
    p.feed(page.read_text(encoding="utf-8", errors="replace"))
    if p.redirect:
        continue
    for key, content in sorted(p.tags):
        print(f"{page.relative_to(site).as_posix()}\t{key}\t{content}")
