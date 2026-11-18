# cderv.dev

Personal site of Christophe Dervieux, built with q2 (Quarto 2). See README.md for commands.

## The theme is a separate project

The look of the site (layout, listings, talks page, blog page, footer, dark mode) comes from the Ghostwriter extension in `_extensions/cderv/ghostwriter/`. That folder is a copy of [cderv/quarto-ghostwriter](https://github.com/cderv/quarto-ghostwriter), installed with `just theme-update`.

So a change to how a page looks is usually a change to the extension:

- Edit the copy here so the site PR works on its own, and say so in the PR.
- Open an issue (or a PR) on cderv/quarto-ghostwriter to carry the same change there. Otherwise the next `just theme-update` erases it. That change bumps the patch number in the extension's `_extension.yml` (`0.1.z`) and adds a line to its `CHANGELOG.md`; no GitHub release.
- Keep site-only things out of the extension: navbar, footer text, listing options in `index.qmd` and `talks.qmd`, and the pages themselves.

Templates and classes from the extension used by the site: `talks.template` and `.gw-talks` (talks.qmd), `feed.template` and `.gw-years` (blog in index.qmd, grouped by year), `tags.html` (clickable tags; `categories: true` on the blog listings).

## Working rules

- One PR per change. The repository is public, and so is any pushed branch.
- No Claude session links (`claude.ai/code/session_...`, `Claude-Session:`) in commits or PRs.
- Before a PR: `q2 render --dry-run --strict`, then a full `q2 render`. Install q2 with `uvx --from quarto2 q2` if it is missing.
- Write q2 markdown with `.claude/skills/q2-authoring`. Note any Quarto 1 feature missing in q2.
- Prefer reusable tooling (`_scripts/` run with `uv run`, `just` recipes) over one-off scripts.
