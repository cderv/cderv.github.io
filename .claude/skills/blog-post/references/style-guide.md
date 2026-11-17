# Blog post style guide

Specific to long-form posts. The prose voice itself lives in the `writing-voice` skill and is not repeated here. Corpus: `posts/` in cderv/personal-website (7 posts, 2016-2022). His writing before 2026 is the reference for his own voice; later text may be agent-assisted.

## Opening: start from what happened

- "Recently, I was pinged on Twitter about a 'How to' with **rmarkdown** and **knitr**"
- "Recently, I have been working on migrating our workflows for TinyTeX bundles ... from Appveyor to Github Action"
- "Signing git commit is something that I have already done in the past ... However, last week I stumble upon Garrick's post"

The reader gets the real situation before any explanation. No thesis statement, no "In this post, I will...".

## Structure

Three shapes come back:

1. **Tip / how-to**: "Some context about the problem" -> one or two solutions with code -> short conclusion (which one he used, when it stops being needed).
2. **Answer to a question**: the question (quote or link) -> the idea in one sentence -> the pieces (functions, docs, links) -> full example -> other possible approaches -> pointer to further reading.
3. **Story / announcement**: a short story -> what changed -> what comes next, as an informal list.

- `#` sections, few of them. Short paragraphs. "The important pieces are:" followed by a short list.
- Code blocks with comments inside the code rather than long prose around it.
- Footnotes for PR links, background and side remarks, so the main text stays short.
- 500 to 1,200 words. Shorter is fine.

## Credit people

He names who he builds on, early, with a link: Garrick's post, Emi Tanaka's post, Yihui, David Robinson's talk. Keep that habit. Same @-mention rule as for issues (`writing-voice`): a link is enough.

## Honest and modest

- Says what he does not know: "I am not sure why this process does not start on windows startup unfortunately."
- Admits limits: "Blogging (writing) is not my thing!"
- Light humor, rare: a fake quote ("--- Voice in my head"), "Truth is...".
- Endings: "This post will be useful for future me maybe ... But maybe it can be useful to someone else", "I let you try." An invitation or an open question, never a summary of the post.

## Recurring angles

- Windows: what a Windows user needs when the tutorial only covered macOS or Linux.
- Notes for future self, made public: "that is why it is best to go public with notes, right ?"

## Facts about Chris

Only what he confirmed: Quarto team at Posit (quarto-cli mostly, also contributes to q2), maintains R Markdown, co-author of the R Markdown Cookbook (2020), joined RStudio in August 2020, about nine years at RTE before, learned to code on the job and through open source, writes most of his code with AI agents, on Windows. Anything else: ask, or mark `[TO CONFIRM: ...]`.
