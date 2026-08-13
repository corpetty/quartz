---
title: Voice Profile Template
description: "Blank version of the profile, with the measurement step first. Fill in your own numbers rather than copying mine."
tags:
  - voice
  - writing
  - template
---

If you want to build your own version of this, here's the template. My numbers are in [[profile-personal]] and [[profile-professional]] and you should ignore them, because they describe how I write and there is no reason your writing should look like mine.

The order matters. Measure first, then describe. Most voice profiles get written from intuition about how you write, and intuition is bad at this. I had a hand-written profile for months that correctly said "avoid excessive em-dashes" while my drafts were running at twenty times my natural rate, because "excessive" is not a number and a model can rationalize its way around anything that isn't.

## Step 0: build the corpus

Two piles.

**Pile one** is writing that is unambiguously yours, from before you used AI or written by hand regardless. Aim for 5,000 words minimum. More is better but the returns fall off fast.

**Pile two** is AI-assisted output you weren't happy with. If you don't have any yet, skip it and just establish the baseline. The comparison is what makes the numbers actionable, but the baseline alone is worth having.

If you write in more than one register, split pile one by register. Mine split into personal and professional and the difference between them turned out to be measurable and specific.

## Step 1: measure

Run [[measuring-voice|the script]] over both piles, in aggregate and per file. Fill this in:

```
MY MEASURED BASELINE — [register]
Corpus: [n] files, [n] words, written [when]

Mean sentence length:            ____ words
Sentences under 10 words:        ____ %
Sentences over 30 words:         ____ %
Sentence-length CV:              ____
Em-dashes per 1,000 words:       ____
Contractions per 1,000:          ____
First person per 1,000:          ____
Second person per 1,000:         ____
Profanity per 10,000:            ____
ALL-CAPS emphasis per 10,000:    ____
Mean paragraph length:           ____ words

Same numbers for my AI-assisted drafts:
[fill in]

The three largest gaps between the two:
1.
2.
3.
```

Those three gaps are your profile. Everything else is decoration.

## Step 2: the profile

```
VOICE PROFILE — [Personal / Professional / other register]

QUICK REFERENCE
[Two sentences. Who is talking, to whom, in what situation. Write it as a
person in a room, not as a list of adjectives.]

MEASURED TARGETS
[Paste the table from step 1, as targets rather than observations. Include
the measured range, not a single number, so there's tolerance.]

OPENINGS
How I actually start, with 3-4 real quoted examples from my corpus:
-
-
-
Never open with:
-

STRUCTURE
The shape my pieces actually take, in order:
1.
2.
3.

LANGUAGE PATTERNS
[For each, quote at least one REAL example from your corpus. If you can't
find a real example, delete the pattern. It isn't yours, you just like it.]
- Most distinctive habit:
- How I emphasize:
- How I handle uncertainty:
- Humor, if any:
- Register-specific idiom:

CLOSINGS
How I actually end, with real examples:
-
Never end with:
-

NEVER
[Constructions, words, and moves. Put the things your measurement caught
at the top, not the things every listicle mentions.]

DIAL SETTINGS vs [my other register]
[Table of what changes and, importantly, what does NOT change.]
```

## Step 3: the parts people get wrong

**Quote real examples or delete the line.** The single biggest improvement in my own profile came from replacing "uses parenthetical asides" with four actual asides pulled from my posts. If you can't find the pattern in your corpus, you don't have that habit, you just wish you did.

**Write limits as counts, not adverbs.** "Sparingly" is advice. "At most 2 in this document" is a check. Anything you can't verify with grep or a script will drift.

**Record what does NOT change between registers.** I assumed my professional writing was tighter and shorter. It's the same sentence length and LONGER paragraphs. Knowing what stays fixed prevents a lot of bad edits.

**Don't spend your time on the banned word list.** It's the most fun part to write and it was worth almost nothing in my measurement. Ten minutes, then move on.

**Expect to be wrong and version it.** Mine is in git and public specifically so that when it drifts out of date the writing degrades and I notice.

## Step 4: the test I still owe

Take five paragraphs you wrote and five the model wrote with the profile loaded. Hand them, unlabeled, to somebody who has read you for years. See if they can sort them.

Until you do that, the metrics are a proxy and the profile is a well-measured hypothesis. That includes mine.
