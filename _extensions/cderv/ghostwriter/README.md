# Ghostwriter for Quarto 2

A Quarto port of the [Ghostwriter](https://github.com/roryg/ghostwriter) theme
by Rory Gibson, for [q2](https://github.com/quarto-dev/q2) (Quarto 2) websites.
It keeps the original layout: a centered header with boxed navigation, a plain
one-line post listing, and a strong rule under titles.

It is packaged as a **custom project type** named `ghostwriter`, built on the
`website` type. A site opts in with one line in `_quarto.yml`, and gets the
theme, a dark mode and a footer without copying any SCSS.

The default look is a refreshed variant of the original (petrol accent, system
fonts, dark mode). The original look (red accent, Open Sans, light only) is
one setting away; see [Original look](#original-look).

## Quick start

1. Put the extension in your project at `_extensions/cderv/ghostwriter/`,
   either by copying this folder or with `q2 add` once it is published in its
   own repository (planned: `cderv/quarto-ghostwriter`).
2. In `_quarto.yml`, use the project type:

   ```yaml
   project:
     type: ghostwriter
   ```

3. Remove any `theme: <name>` under `format: html:` (a site made with
   `q2 create project blog` sets `theme: cosmo`). A single theme name replaces
   both of the extension's theme lists. Also remove `title-block-banner: true`
   from `index.qmd` and `posts/_metadata.yml` if they set it; see
   [Limits](#limits).

`q2 render` and `q2 preview` then work as for any website.

## How q2 loads the project type

A custom project type is not code. It is a fragment of `_quarto.yml` that the
extension ships under `contributes: project:` in `_extension.yml`. When q2
reads `project: type: ghostwriter`, it:

1. finds an extension named `ghostwriter` in `_extensions/` (the name is the
   extension's directory name; write `cderv/ghostwriter` if two installed
   extensions share it);
2. reads the base type from the fragment's own `project: type:` key. Here it
   is `website`, so the project renders as a website;
3. merges the fragment underneath your `_quarto.yml`, then renders as if you
   had written the combined configuration yourself.

The merge follows q2's usual rules:

- **Your value wins** when you and the extension set the same key.
- **Lists combine**, the extension's entries first and yours after. This is
  how you can add your own SCSS file after the extension's (see
  [Customizing](#customizing)).
- **`!prefer`** on your list replaces the extension's list instead of
  extending it.

File names in the fragment, such as `ghostwriter.scss`, are relative to the
extension folder; q2 resolves them for you. Paths you write in your own
`_quarto.yml` stay relative to your project root.

To see the merged result, run `q2 get-config`. If q2 cannot find the
extension, it stops with error Q-5-17 (unknown project type) and lists the
project types it did find.

## Files

| File | Role |
|------|------|
| `_extension.yml` | Manifest. Declares the `ghostwriter` project type: base type `website`, the default footer, and the HTML format options listed below. |
| `ghostwriter.scss` | The theme itself: the original Ghostwriter palette as `$gw-` Sass variables, then every layout rule (header, title block, content, code, talks, post list, footer, small screens). Used alone, it gives the original look. |
| `design-a.scss` | The default variant, layered after `ghostwriter.scss`. Changes the palette and fonts (petrol accent, system font stack, no Google Fonts request), sets titles in sentence case, underlines links, and recolors the dark-mode toggle. |
| `design-a-dark.scss` | Dark palette for the default variant. Only variables, layered last in the dark theme. |
| `talks.template` | Optional listing template for a page of talks; see [Talks listing](#talks-listing). |
| `LICENSE` | MIT license for this extension. |
| `LICENSE-ghostwriter.md` | MIT notice of the original Ghostwriter theme. |

The layering is plain Quarto theming: each theme list starts with `default`
(Bootstrap), then adds the SCSS files in order. When Quarto assembles the
theme, it places the `scss:defaults` sections of later files first, so a
later file's `!default` value wins over an earlier one. That is how
`design-a.scss` replaces the palette of `ghostwriter.scss`.
`design-a-dark.scss` goes one step further and assigns its variables without
`!default`, so nothing listed before it can change them.

## What the extension sets

| Key | Value |
|-----|-------|
| `project.type` | `website` (base type) |
| `format.html.theme.light` | `[default, ghostwriter.scss, design-a.scss]` |
| `format.html.theme.dark` | `[default, ghostwriter.scss, design-a.scss, design-a-dark.scss]` |
| `format.html.respect-user-color-scheme` | `true` |
| `format.html.syntax-highlighting` | `github` |
| `format.html.date-format` | `ddd, MMM D, YYYY` |
| `format.html.title-block-banner` | `false` |
| `website.page-footer.center` | site title, back-to-top link, credits |

Anything you set in `_quarto.yml` or in a document overrides these.

## What you set

The extension cannot know your site, so these stay in `_quarto.yml`:

```yaml
website:
  title: "My Blog"
  description: "..."
  site-url: https://example.com   # needed for the RSS feed
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

Listing options belong to the page that holds the listing, so the extension
cannot set them either. The theme is styled for this setup, in `index.qmd`:

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

## Options

### Dark mode

On by default. The page follows the reader's system preference
(`respect-user-color-scheme: true`), and a toggle in the header lets the
reader switch. To turn dark mode off, replace the theme with a single list:

```yaml
format:
  html:
    theme: !prefer [default, _extensions/cderv/ghostwriter/ghostwriter.scss, _extensions/cderv/ghostwriter/design-a.scss]
```

### Original look

`ghostwriter.scss` alone gives the original look: red accent and Open Sans
loaded from Google Fonts. To use it, replace both theme lists with `!prefer`:

```yaml
format:
  html:
    theme:
      light: !prefer [default, _extensions/cderv/ghostwriter/ghostwriter.scss]
      dark: !prefer [default, _extensions/cderv/ghostwriter/ghostwriter.scss]
```

The original theme has no dark palette, so both lists use the same file. The
paths are written from the project root because they are in your
`_quarto.yml`, not in the extension.

### Footer

The default footer shows the site title, a back-to-top arrow and the credits.
Setting `website.page-footer` replaces it. Use the theme's classes to keep
the same layout:

```yaml
website:
  page-footer:
    center: |
      [[My Blog](/index.html){.gw-footer-title} [↑](#){.gw-top aria-label="Back to top"}]{.gw-footer-brand}
      [© 2026 Me]{.gw-footer-line}
      [Layout inspired by the [Ghostwriter theme](https://github.com/roryg/ghostwriter) by JollyGoodThemes]{.gw-footer-line}
```

Please keep the credit line to the original theme.

### Customizing

Colors and sizes are Sass variables prefixed with `$gw-` (and the usual
Bootstrap variables), declared with `!default` at the top of
`ghostwriter.scss` and `design-a.scss`. To change them, add your own SCSS
file. Your list is appended after the extension's, and since the extension's
values are `!default`, yours win:

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

The dark palette in `design-a-dark.scss` does not use `!default`, so this
does not work for dark colors. To change them, replace the `dark` list with
`!prefer` and put your own palette file last.

## Talks listing

`talks.template` renders a list of talks for a `type: custom` listing: title
with optional badges, an optional summary, and a "date · event" line, with
the whole row clickable. Each talk is a page whose front matter supplies the
values under `listing-item: extra:` (`when`, `event`, and optionally `kind`,
`language`, `summary`):

```yaml
listing:
  - id: talks-2025
    type: custom
    template: !str /_extensions/cderv/ghostwriter/talks.template
    contents: "talks/2025-*/index.qmd"
    sort: "date desc"
```

Give the template path the `!str` tag: q2 otherwise parses it as markdown
and warns about the underscore. The path depends on where the extension is
installed. Wrap the year sections in `::: {.gw-talks}` for the section
spacing. Talk pages can embed slides or a video in a 16:9 box with a
raw-HTML `<div class="gw-embed"><iframe ...></iframe></div>`.

## Limits

- The theme has no styles for banner title blocks. Keep `title-block-banner`
  unset or `false`.
- Put text links in `navbar.left` and icon links in `navbar.right`. A text
  link in `navbar.right` is clipped to the size of an icon box.
- Listings are styled for `type: default` with the `title` and `date` fields
  only. Images, categories and `page-layout: full` are not styled.

## Generic parts and site-specific parts

The extension was built for [cderv/personal-website](https://github.com/cderv/personal-website)
and is meant to move to its own repository. What is generic and what comes
from that site:

- **Generic**: the project type, both looks, dark mode, the footer classes,
  the post list and every rule in the SCSS files except the talks section.
- **Added for that site, usable elsewhere**: `talks.template`, the
  `.gw-talks`, `.gw-talk-*` and `.gw-embed` styles (the "Talks" section of
  `ghostwriter.scss`). A site without a talks page simply does not use them.
- **Kept in the site, not in the extension**: the site title, navbar, the
  footer text with the copyright line, the listing options in `index.qmd` and
  `talks.qmd`, and the talk pages themselves.

## Credits and license

This extension is a port of the [Ghostwriter](https://github.com/roryg/ghostwriter)
theme for Ghost by Rory Gibson (JollyGoodThemes), drawing on its Hugo port by
[jbub](https://github.com/jbub/ghostwriter). Ghostwriter is released under the
MIT License; its notice is in [LICENSE-ghostwriter.md](LICENSE-ghostwriter.md).

The extension itself is released under the MIT License; see [LICENSE](LICENSE).
