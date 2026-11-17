# personal-website

Source of Christophe Dervieux's personal site and blog, built with [q2](https://github.com/quarto-dev/q2) (Quarto 2).

Render locally with `q2 render`, preview with `q2 preview`.

The theme lives in `_extensions/cderv/ghostwriter/`, a q2 extension that defines the `ghostwriter` project type (see its README).

The theme is committed in `_extensions/cderv/ghostwriter/`; its source is [cderv/quarto-ghostwriter](https://github.com/cderv/quarto-ghostwriter). `just theme-update` reinstalls it from GitHub, and `just theme-dev` installs a local clone at `../quarto-ghostwriter`. A local install lands in `_extensions/ghostwriter/` rather than `_extensions/cderv/ghostwriter/`: move it by hand, or use the GitHub install, before committing.

Link previews (LinkedIn, Bluesky, Mastodon): q2 does not write Open Graph tags yet, so `_scripts/opengraph.js` adds them after each render (`post-render` in `_quarto.yml`, needs Node). A page uses its `description` (else `subtitle`) and its `image` front matter, or the default card `images/social-card.png`. To change that card, edit `_social-card/card.html` and run `node _social-card/make-card.js` (needs Playwright).
