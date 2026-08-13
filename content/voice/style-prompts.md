---
title: Style Prompts
description: "Paste-ready prompt blocks for both registers, plus the edit-mode and interview-mode prompts I use more often than the draft-mode one."
tags:
  - voice
  - writing
  - ai
  - prompts
---

These are the actual blocks I paste. They put numbers where most style prompts put adjectives, because a model can rationalize its way around "use em-dashes sparingly" and cannot rationalize its way around "at most 2 in this document, count them."

The research is consistent that showing beats telling, so every one of these expects real samples pasted underneath it. Three to five is the useful range. Wang et al. tested 2 against 10 and found more samples barely moved the needle, so don't spend an afternoon assembling a corpus.

One caveat before you use these. Verbatim style rules in a prompt reliably decay after a couple of paragraphs of generation, which is why [[workflow|my workflow]] leans on editing rather than drafting for anything where voice actually matters.

## Personal register, draft mode

```
Write in my voice, defined by the samples below.

STRUCTURE
- Open with the thing that made me want to write this: an observation, a
  frustration, a question I couldn't shake, or an admission. Never a thesis
  statement about what the piece will cover.
- Evidence before interpretation. If there's data, describe how it was
  gathered and where it might be wrong before drawing conclusions.
- Mark opinion sections explicitly as opinion.
- Close with an invitation to argue, or a commitment. Never a summary.

SENTENCES (these are measured targets, hit them)
- Mean sentence length 21-23 words.
- At most 15% of sentences under 10 words.
- At least 18% of sentences over 30 words.
- Do NOT "vary sentence length for burstiness." My variation is already
  stable. Erring toward chopped, punchy fragments is the failure mode.
- Paragraphs average 45-55 words. Real paragraphs, not one-line drama.

HARD LIMITS
- Em-dashes: at most 1 per 1,000 words. Use commas, periods, colons, or
  parentheses. I will count these.
- "It's not X, it's Y" antithesis: at most once, and only if the inversion
  genuinely surprises.
- No rule-of-three lists as a rhetorical reflex.
- No bolded lead-ins on bullets in prose sections.

VOICE
- Contractions on, including "ya know," "em," "gonna," "cause."
- I'm in the text. Narrate my own thinking and uncertainty.
- Use ALL CAPS for emphasis, not bold and not italics.
- Parenthetical asides that undercut the sentence are my most distinctive
  habit. Use them.
- Profanity is allowed and should be aimed at the thing I actually feel
  strongly about. Roughly 1-5 instances per 2,000 words. Never for shock.
- Take a position. No false balance. If one side is right, say so.
- Leave real tensions unresolved rather than smoothing them over.

BANNED
delve, tapestry, realm, landscape, testament, underscore, pivotal,
multifaceted, intricate, meticulous, robust, seamless, leverage, harness,
unlock, elevate, foster, showcase, crucial, comprehensive, commendable,
paramount, compelling, transformative, utilize, facilitate, embark, myriad,
nuanced, holistic, resonate, furthermore, moreover, "it's worth noting
that," "let's dive in," "in conclusion," "incredibly," "absolutely,"
"remarkably."

SAMPLES OF MY WRITING:
[paste 3-5 real samples]

Now draft: [task]
```

## Professional register, draft mode

```
Write in my professional voice, defined by the samples below. This is
security and technical documentation, not marketing and not a memo.

PERSON (this is the defining feature)
- Second person throughout. The reader is the subject of nearly every
  sentence, doing something.
- First person almost never. Use "I" only to mark an opinion as an opinion
  or to disclaim scope, e.g. "I will not speculate here as to why."

STRUCTURE
- Open by clearing out the wrong mental model before installing the right
  one. Say what the thing is NOT first.
- Scope the document honestly and early: state what it does not cover.
- Declare it a living document that will change.
- Explain consequences, not just commands. Say what happens if they skip
  the step.
- Disclose any conflict of interest plainly and move on.
- Link out generously and credit where the approach was learned.

SENTENCES
- Mean sentence length 21-23 words. Do NOT tighten for formality.
- At most 10% of sentences under 10 words.
- Paragraphs average ~72 words. LONGER than casual writing. Do not chop
  into bullet fragments for skimmability.

HARD LIMITS
- Em-dashes: ZERO.
- Contractions: sparing, roughly 5 per 1,000 words. Not eliminated.
- ALL CAPS reserved for absolute prohibitions only, e.g. "DOES NOT."
- Exactly one instance of profanity, placed as the final sentence of the
  document, on the single point most worth remembering. If nothing earns
  it, use none.

VOICE
- Section headers can have personality: "Get your mind right," "Document
  all of the things!", "Color Outside the Lines."
- Anticipate the reader's objection out loud and answer it.
- Casual idiom inside technical guidance is fine: "go from zero to hero,"
  "go nuts," "the lion's share."
- Be precise about uncertainty rather than hedging vaguely.
- Never claim comprehensiveness.

BANNED
Corporate hedging that avoids taking a position. Marketing language.
Speculation past the evidence. Summary conclusions.

SAMPLES OF MY WRITING:
[paste 3-5 real samples]

Now draft: [task]
```

## Edit mode

This is the one I use most, and per the research it's the safest for voice because the thinking and the phrasing are already mine.

```
Edit the draft below. Do not rewrite it. Preserve my meaning, my structure,
and my phrasing wherever it works.

Fix only:
- Sentences that are unclear or say the same thing twice.
- Claims I've made that the draft doesn't support.
- Places where I've buried the point.

Do NOT:
- Smooth out my rough edges, informality, or profanity.
- Balance my positions or add caveats I didn't write.
- Add em-dashes. Remove any I've overused.
- Add transitions like "furthermore," "moreover," "additionally."
- Add a summary paragraph or a concluding restatement.
- Convert prose into bullets.
- Make sentences shorter for punchiness.

Return the edited draft, then a short list of what you changed and why.
```

## Interview mode

For pieces where the thinking isn't done yet. The output is my words, which sidesteps the voice problem entirely.

```
I want to write about [topic]. Do not draft anything yet.

Interview me. Ask one question at a time. Push on the parts where my
reasoning is thin, ask for the concrete example when I've said something
abstract, and tell me when I'm dodging.

After roughly 10 questions, stop and give me back an outline built ONLY
from what I actually said, quoting my own phrasing wherever possible.
```

Pair this one with dictation if you can. Spoken phrasing carries voice better than typed phrasing, and the transcript needs only light cleanup.

## Diagnostic mode

Run this on a draft before the [[ai-tell-checklist|checklist]] to catch what a human pass will miss.

```
Analyze the draft below against these targets and report actual numbers.
Do not fix anything yet.

- Mean sentence length (target 21-23 words)
- Percentage of sentences under 10 words (target under 15%)
- Percentage of sentences over 30 words (target over 18%)
- Total em-dash count and count per 1,000 words (target under 1.0)
- Every instance of "not X, but Y" or "it's not X, it's Y", quoted
- Every banned word, quoted with its sentence
- Any paragraph that summarizes rather than advances
- Any sentence that hedges without landing a position

Report as a table. Flag every target that's missed.
```

The model is unreliable at counting, so verify the em-dash number yourself:

```bash
grep -o "—" draft.md | wc -l
```

## Verbalized sampling

Worth knowing about when a draft comes back generic in a way that reads as the average of everything ever written on the topic. Zhang et al. found that asking for several responses with explicit probabilities and sampling from the tails recovers a meaningful chunk of the diversity that preference-tuning strips out.

```
Generate 5 responses to the query, each in a separate tag with a text and a
numeric probability. Sample from the tails of the distribution, such that
each response's probability is less than 0.10.
```

I use this for angles and framings rather than for prose. It's good at getting me out of the obvious take and bad at sounding like me.
