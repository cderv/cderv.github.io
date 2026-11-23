# personal-website

Source of Christophe Dervieux's personal site and blog, built with [q2](https://github.com/quarto-dev/q2) (Quarto 2).

Render locally with `q2 render`, preview with `q2 preview`.

Talk thumbnails (`talks/<folder>/thumbnail.png`, used as the page `image:` for link previews) are screenshots of each talk's slides or site: `just thumbnails` takes the missing ones, `just thumbnails <folder> --force` retakes one, `--url` picks another page. It needs `uv`, and uses Edge or Chrome when installed. See `_scripts/talk-thumbnails.py`. The "Talk thumbnails" workflow runs it on any branch that changes a talk page and commits the new thumbnails; it can also be run by hand from the Actions tab.

The theme lives in `_extensions/cderv/ghostwriter/`, a q2 extension that defines the `ghostwriter` project type (see its README).

The theme is committed in `_extensions/cderv/ghostwriter/`; its source is [cderv/quarto-ghostwriter](https://github.com/cderv/quarto-ghostwriter). `just theme-update` reinstalls it from GitHub, and `just theme-dev` installs a local clone at `../quarto-ghostwriter`. A local install lands in `_extensions/ghostwriter/` rather than `_extensions/cderv/ghostwriter/`: move it by hand, or use the GitHub install, before committing.

Link previews (LinkedIn, Bluesky, Mastodon): q2 writes the Open Graph and Twitter card tags (turned on by the Ghostwriter extension). A page uses its `description` and its `image`, else an image found in its body, else the default card `images/social-card.png` (`website.image`). To change that card, edit `_social-card/card.html` and run `node _social-card/make-card.js` (needs Playwright). To check the tags after a render: `uv run _scripts/social-meta.py`.

Site styles on top of the theme: `styles/site.scss` (light and dark). The Projects page is data: inline records in its front matter, one custom listing per section, rendered by the extension's `projects.template`.
