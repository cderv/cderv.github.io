---
name: blog-post
description: Write or review a post for Chris's personal blog (Quarto 2 site, repo cderv/personal-website), from an idea, notes or a French voice dictation. Use when drafting, outlining, proofreading or reviewing a blog post or a long-form text published as Chris (talk abstract, about page).
---

# Blog post (Chris's voice, long form)

A blog post is public writing in Chris's voice. The voice is the same as for issues and comments; only the length and structure change.

## Read before drafting

1. The `writing-voice` skill (shared voice, extracted from gh-issue-style "Tone and voice"). It carries the prose rules: French writing in English kept as is, no em-dash as a separator, cut insurance clauses, hedge real uncertainty, no filler, "not yet supported" rather than "bug", bold package names except Quarto and Pandoc.
2. `references/style-guide.md` (this skill): what is specific to blog posts (openings, structure, footnotes, endings), taken from his posts 2016-2022.
3. `references/review.md` before handing a draft over.
4. For the `.qmd` syntax, the `q2-authoring` skill (the blog renders with q2, not Quarto 1).

## Workflow

1. **Get the material from Chris first.** He often dictates in French, unordered. Collect: what happened (problem, project, PR, question someone asked), what he did or found (real commands, versions, links), who to credit, why he writes it. If a piece is missing, ask one short question in French. Never invent a story, an anecdote or a motivation.
2. **Outline in French**, 4 to 6 lines (title, opening situation, sections, ending). Wait for his OK before drafting anything over ~600 words. Short tips posts can go straight to draft.
3. **Draft** in `posts/YYYY-MM-DD-slug/index.qmd` on a branch. Mark every statement about his experience that he did not give you with `[TO CONFIRM: ...]`.
4. **Review** with `references/review.md`, then show him: the file path, the `[TO CONFIRM]` list, and a short French summary.
5. **Wait.** Being asked to draft is not approval to publish. Never merge to `main`, push or share the link without his explicit OK.

## Front matter

```yaml
---
title: "..."
date: YYYY-MM-DD
description: "One plain sentence, can be a question"
categories: [quarto, windows]
---
```

`aliases:` only for posts moved from the old site. Images go in the post folder, always with `fig-alt`.
