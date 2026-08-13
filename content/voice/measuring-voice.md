---
title: Measuring Voice
description: "The script, how to run it on your own corpus, what each metric means, and which ones turned out to be worth anything."
tags:
  - voice
  - writing
  - tools
---

Everything in [[voice-baseline]] came out of one Python script with no dependencies. It lives at `scripts/voice-stylometry.py` in the [repo for this site](https://github.com/corpetty/quartz).

The point of publishing it isn't that it's good code. It's that claims about what makes writing sound human should come with the thing that produced the numbers, so you can check whether the metric measures what I say it measures.

## Running it

```bash
python3 scripts/voice-stylometry.py "Label=path/glob" ["Label2=path/glob" ...]
```

Each argument is a label, an equals sign, and a glob. Every file matching the glob gets concatenated into one corpus and reported as a block, which is what you want for comparing a pile of old writing against a pile of new writing.

```bash
python3 scripts/voice-stylometry.py \
  "Human=content/posts/medium/*.md" \
  "Notes=content/notes/*.md" \
  "AI=content/posts/compersion.md"
```

Add `--matches` to print the surrounding text for every "not X, but Y" hit, which you should do at least once because that regex has real false positives.

The critical move is running it **per file** as well as in aggregate. My headline finding changed when I did that, because the aggregate was hiding the fact that individual pieces swing wildly. Aggregates lie about consistency, and consistency turned out to be the whole story.

```bash
for f in content/posts/*.md; do
  python3 scripts/voice-stylometry.py "$(basename "$f")=$f" | grep -E "===|mean|em-dash"
done
```

## What it does to the text first

Before measuring anything it strips frontmatter, fenced code, raw HTML, images, footnote definitions and inline footnote refs, link syntax (keeping the anchor text), and bare URLs. Then it throws away every line that starts with a heading marker, a bullet, a table pipe, or a blockquote arrow.

That last step matters. Headings and bullets are structure, not voice, and leaving them in makes every technical document look like it has a 4-word average sentence length.

## The metrics, and whether they were worth anything

**Mean sentence length.** The most useful single number I measured. Mine sits at 21 to 23 words across everything I've ever written, in both registers, over six years.

**Coefficient of variation.** Standard deviation over mean, as a burstiness proxy. Useful mainly for showing that the standard advice to increase burstiness was wrong for me. Mine is stable at 0.52 to 0.57.

**Percent under 10 words and percent over 30.** More actionable than the CV, because you can hand them to an editor as a rule. These caught the staccato failure mode that the mean alone would have partly hidden.

**Em-dashes per thousand words.** The highest-signal metric in the whole script by a wide margin. Twenty to seventy times separation between my writing and AI-assisted drafts. If you only implement one thing, implement `grep -o "—" file | wc -l`.

**Contractions per thousand.** Good register discriminator. Mine drops from about 19-32 casual to 5 professional.

**First and second person per thousand.** The cleanest structural difference between my two registers, a near-total inversion. Genuinely useful.

**Profanity per ten thousand.** Low-frequency, so noisy, but it surfaced a rule I didn't know I had about placement in professional writing.

**ALL-CAPS emphasis per ten thousand.** Caught something I'd never have thought to look for, which is that AI drafts substitute bold and em-dashes for a device I actually use a lot.

**Banned AI vocabulary per ten thousand.** Almost worthless as a discriminator, which was itself the useful finding. I use the forbidden words MORE than Claude does when Claude is running my profile.

**"Not X, but Y" antithesis count.** Directionally real, and the regex over-fires. It catches innocent constructions like "not know whether" and "not a bug (but probably not)." Always read the matches before trusting the count.

**Paragraph length and single-sentence paragraph rate.** Mildly useful. Disproved my assumption that AI drafts would be full of one-line dramatic paragraphs.

## Things I'd add if I kept going

Nothing in here measures how an argument is shaped, and that's probably where the remaining signal is.

- **Analogy density and length.** Mine tend to run a full paragraph and carry the argument rather than decorating it.
- **Paragraph-internal position of the point.** Whether I front-load or back-load the claim inside a paragraph.
- **Transition inventory.** Not just banned transitions, but which connectives I actually reach for.
- **Hedge density.** Words like "probably," "I think," "maybe," which I use a lot and which mean something different from corporate hedging.
- **Question marks per thousand words.** I ask the reader a lot of rhetorical questions and then answer them.

## Known limitations

Sentence splitting is a regex on terminal punctuation with a short abbreviation guard. It will mis-split on unusual punctuation and it took me one bug to learn it mis-splits on footnotes. Treat sentence counts as approximate.

The profanity and banned-word lists are fixed and English-only. The contraction regex catches possessives too, so that number is inflated in a consistent way across corpora, which is fine for comparison and wrong as an absolute.

Corpus sizes here are small. My professional register rests on a single 4,439-word document. Everything normalized per ten thousand words, in a corpus of four thousand, is an extrapolation and should be read as one.

None of this measures whether the writing is any good.
