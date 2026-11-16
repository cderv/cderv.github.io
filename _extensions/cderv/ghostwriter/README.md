# Ghostwriter for Quarto 2

A blog theme for [q2](https://github.com/quarto-dev/q2) (Quarto 2) websites:
centered header with boxed navigation, a plain one-line post listing, a strong
rule under titles, and light and dark palettes that follow the reader's
system preference.

It is packaged as a custom project type built on `website`.

## Install

```bash
q2 add <org>/<repo>
```

Then, in `_quarto.yml`:

```yaml
project:
  type: ghostwriter
```

Remove any `theme: <name>` you already set under `format: html:` (a new blog
sets `theme: cosmo`). A single theme name replaces the extension's light and
dark themes.

## What the extension sets

| Key | Value |
|-----|-------|
| `format.html.theme` | `ghostwriter.scss` + `design-a.scss` (light), plus `design-a-dark.scss` (dark) |
| `format.html.respect-user-color-scheme` | `true` |
| `format.html.syntax-highlighting` | `github` |
| `format.html.date-format` | `ddd, MMM D, YYYY` |
| `format.html.title-block-banner` | `false` |
| `website.page-footer.center` | site title, back-to-top link, credits |

Anything you set in `_quarto.yml` or in a document overrides these.

## What you set

In `_quarto.yml`:

```yaml
website:
  title: "My Blog"
  description: "..."
  site-url: https://example.com
  navbar:
    left:              # text links, shown as a row under the header
      - text: Blog
        href: index.qmd
      - text: About
        href: about.qmd
    right:             # icon links, shown as boxes next to the title
      - icon: github
        href: https://github.com/me
      - icon: rss
        href: index.xml
```

On the listing page (the extension cannot set listing options for you):

```yaml
listing:
  contents: posts
  type: default
  fields: [title, date]
  categories: false
  sort: "date desc"
  sort-ui: false
  filter-ui: false
  feed: true
```

To write your own footer, use the theme's classes:

```yaml
website:
  page-footer:
    center: |
      [[My Blog](/index.html){.gw-footer-title} [↑](#){.gw-top aria-label="Back to top"}]{.gw-footer-brand}
      [© 2026 Me]{.gw-footer-line}
```

## Limits

- The theme has no styles for banner title blocks. Keep `title-block-banner`
  unset or `false` (a site made with `q2 create project blog` sets it to
  `true` in `index.qmd` and `posts/_metadata.yml`).
- Put text links in `navbar.left` and icon links in `navbar.right`. A text
  link in `navbar.right` is clipped to the size of an icon box.
- Listings are styled for `type: default` with the `title` and `date` fields
  only. Images, categories and `page-layout: full` are not styled.

## Customizing

Colors and sizes are Sass variables prefixed with `$gw-`, declared with
`!default` at the top of `ghostwriter.scss` and `design-a.scss`. To change
them, add your own SCSS file. Theme lists combine, so your file is layered
after the extension's and its variables win:

```yaml
format:
  html:
    theme:
      light: [my-colors.scss]
```

```scss
/*-- scss:defaults --*/
$gw-primary: #8a3ffc;
```

The dark palette in `design-a-dark.scss` assigns its variables without
`!default`, so it cannot be overridden this way; replace the `dark` list with
`!prefer` and your own palette file instead.

`ghostwriter.scss` alone gives the original look (red accent, Open Sans loaded
from Google Fonts). `design-a.scss` layers a petrol palette and a system font
stack on top of it.

## Credits

The layout follows the [Ghostwriter](https://github.com/roryg/ghostwriter)
theme for Ghost by Rory Gibson (JollyGoodThemes), as ported to Hugo by
[jbub](https://github.com/jbub/ghostwriter). Ghostwriter is released under the
MIT License; its notice is in [LICENSE-ghostwriter.md](LICENSE-ghostwriter.md).
