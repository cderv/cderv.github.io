# Reviewing a blog draft

Two cases: Chris wrote the draft (fix real errors only, keep his text), or an agent drafted it (hunt AI tone first). For the editorial pass on agent text, the `review-claude-wording` skill applies too; this file adds what is specific to Chris's posts.

## Pass 1: real errors

- Grammar and tense that a reader would stop on ("I have officially make" -> "made").
- Wrong words and typos that change meaning or look careless in a published post ("used too" -> "used to").
- Do NOT rewrite a correct sentence to sound more native. French-English phrasing is the voice (see `writing-voice`).
- Space before `?` and `!`: remove it in blog posts (decided 2026-11-17). Issues and comments keep it (writing-voice).

## Pass 2: AI tone (mandatory for agent drafts)

- Words: delve, leverage, seamless, robust, crucial, pivotal, game-changer, unlock, empower, elevate, harness, streamline, landscape, journey, realm, "it's worth noting", "in today's...".
- Structures: "not just X, but Y", triplets, a punchline closing each paragraph, "Here's the thing:", a question followed by its own answer, a closing paragraph that summarizes the post, enthusiasm he would not say ("thrilled", "excited").
- Em-dash as separator, insurance clauses, greetings, "I hope this helps", emoji.
- Uniform paragraph length, too many headings or bullet lists.
- Test per paragraph: would he write this in a GitHub comment? If not, simplify.

## Pass 3: facts

- Every claim about his experience, role or feelings: in his notes or in the confirmed facts? Otherwise `[TO CONFIRM: ...]`.
- Versions, commands, function names: checked. Links: opened. No dead or guessed link.
- People credited: names spelled right, linked to their own work.

## Pass 4: render

- Front matter has `title`, `date`, `description`, `categories`. Images have `fig-alt`.
- `q2 render --dry-run --strict` passes (see `q2-authoring`).

## Output to Chris (in French)

1. The corrected text, or a diff for long posts.
2. Short list of changes: errors fixed / AI tone removed / points to confirm.
3. Nothing else. No praise, no score.
