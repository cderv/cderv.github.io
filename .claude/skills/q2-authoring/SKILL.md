---
name: q2-authoring
description: Use when writing or editing .qmd files or projects rendered with Quarto 2 (the q2 CLI, Rust rewrite), e.g. cderv/personal-website. Lists where q2 differs from Quarto 1 and the posit-dev quarto-authoring skill.
---

# Authoring for Quarto 2 (q2)

Base: the posit-dev `quarto-authoring` skill (Quarto 1.9). Its concepts still apply (divs, spans, callouts, `#|` options, cross-refs, citations). This skill lists what is different, missing or new in q2. When the two disagree, this one wins.

Checked against quarto-dev/q2 at commit `1d0042cb` (2026-11-16), from docs and code, not from a running binary. q2 moves fast: when in doubt, check the source of truth, and say so if a point is unverified.

## Source of truth

- `q2 docs` / `q2 agents-info` serve the q2 guides locally. Prefer them over quarto.org, which documents Quarto 1.
- In the repo: `docs/guides/authoring/migrating-markdown.qmd` (read first, written for agents), `docs/guides/authoring/`, `docs/guides/projects/`, `docs/guides/formats/`, `docs/errors/` (one page per code).
- Guides still `TBD` (cross-references, layout, tables, scholarly-writing): check `crates/` and test fixtures instead of guessing.
- Validate without running code: `q2 render --dry-run --strict`. `q2 render --json-errors` gives one JSON record per diagnostic.

## CLI

- Binary `q2`: `render`, `preview`, `add`, `create project <type> <dir>`, `publish`, `use brand`, `get-config`.
- Stubs (not implemented): `update`, `remove`, `list`, `check`, `install`, `uninstall`, `tools`, `pandoc`, `typst`, `run`, `serve`.
- `q2 add`: no `--global`; remote sources need trust (`--trust` in CI); writes `.quarto-source.yml` (commit it). Update = run `q2 add` again; remove = delete the folder.
- `q2 convert` only does `.qmd` -> `positron-ipynb`. No `.Rmd`/`.ipynb` -> `.qmd`.
- `q2 create project` types: default, website, blog, presentation, book (no manuscript).
- `q2 publish`: `gh-pages` only.
- `q2 preview` is live and read-only by default; `--static` does a real render (needed for listing paging/filters); `--allow-edit`, `--share`.

## Markdown: stricter than Pandoc

- A backslash makes any markup character literal and is never wrong. Escape or use a code span for: `_` at a word boundary (`\_quarto.yml`), `*` at a word end, `$` that is not math, `{ }` in prose, a lone backtick, `[REVISED]`-style brackets, `<placeholder>`, an apostrophe right after a code span or emphasis (`` `x`\'s ``).
- Not supported: indented code blocks, definition lists, reference-style links, grid tables, setext headings, `#Heading` without a space.
- Multi-paragraph footnotes: `::: ^1` ... `:::`.
- Raw HTML: `` `<br>`{=html} `` or a ```` ```{=html} ```` block. Naked HTML warns (Q-2-9).
- Attributes in order: `#id`, `.class`, `key=val`. Space after `:::` (`::: {.note}`).
- Code cell header is only a language token. `{r, echo=FALSE}` is an error (Q-2-36). Show a cell verbatim with a longer fence; `{{python}}` is not supported.
- Shortcodes need spaces (`{{< meta title >}}`) and are expanded inside code too. To show one literally: `shortcodes="false"` on the block or span, or `{{{< ... >}}}`.

## Content features

- Formats: HTML and Reveal.js native. No `format: pdf` (LaTeX) or beamer: PDF means `format: typst`. Ignore `pdf:`/LaTeX options.
- Diagrams: plain ```` ```mermaid ```` / ```` ```dot ```` fences with `%%|` / `//|`; `{mermaid}` is not run (Q-2-58). Only `label`, `fig-cap`, `fig-scap`, `fig-alt`, `fig-align` (+ `graph-layout`). No `file:`, sizing, `mermaid-format`, theming.
- Cross-refs: `[@fig-a; @fig-b]` resolves only the first: write separate refs. Labels via `language:` keys (`crossref-fig-title`), not `crossref: {fig-title}`. Duplicate ids warn and are not numbered.
- Tables: pipe tables and `::: list-table` (`header-rows`, `aligns`, `widths`, colspan/rowspan). No `header-cols`, no grid tables.
- Callouts: same 5 types; don't set both `title=` and a heading.
- Tabsets: `.panel-tabset`, plus `group="name"` and `## Tab {.active}`.
- Shortcodes: `meta`, `env`, `var`, `include` (own paragraph), `pagebreak`, `kbd`, `lipsum`, `placeholder`, `version`, `video`. No `embed`, `contents`, `brand`.
- Code cells: no `code-fold`, no `code-annotations`. knitr `cache: true` works; Jupyter cache unverified.
- Engines: each language goes to the engine that claims it. `engine:` is a list; `engine: markdown` disables execution. `.md` never executes. `.Rmd` is not rendered: rename to `.qmd`.
- Layout (`layout-ncol`, `column-*`, margin): confirmed for Typst only; check HTML renders.
- Conditional content: values in one attribute are OR (`when-profile="a,b"`), different conditions AND.
- New: components, editorial marks, `lmd` cells, `.hep` plots, inline `` `{python} expr` `` in prose and front matter, execution records, `brand:` key (`q2 use brand`, no `_brand.yml` auto-discovery).

## Websites and blogs

- Same as Quarto 1: `website:` navbar/sidebar/search, `site-url`, `draft`, `aliases`, `categories`, listings (`contents`, `type`, `sort`, `categories`, `feed`).
- Post front matter: `title`, `date`, `description`, `categories`, `image`, `author`, `draft`, `aliases`; optional `listing-item: {description, image}`.
- Listing `contents:` is a glob or inline records, not a YAML file (Q-12-23).
- RSS feed needs `website.site-url`, otherwise silently skipped.
- Listing templates use `$it.field$` and output markdown: links and images as markdown.
- `sort-ui` / `filter-ui` not rendered; table/custom listings don't paginate or filter.
- Not implemented: Open Graph / Twitter cards, analytics, cookie consent, comments, `about:` templates.
- Drafts render blank in production, with a banner in preview.
- q2-only: `website.llms-txt`, profiles, pre/post-render scripts, `_metadata.yml`, `announcement`, `repo-actions`, `bread-crumbs`, `diagnostics:`, `--strict`.

## Extensions

- Same layout and `contributes:` (shortcodes, filters, formats, project, metadata). Lua filters/shortcodes work. TS engines are new.
- Custom project types must base on `website` or `default` (Q-16-7).

## Working rule

After editing, run `q2 render --dry-run --strict` (or a full render when code must run) and fix every diagnostic. For a code, read `docs/errors/<area>/<code>.qmd`. A Quarto 1 feature found missing goes in the "Manques à remonter dans q2" list, framed as "not yet supported", not "bug".
