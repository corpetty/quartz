---
title: My Measured Voice Baseline
description: "I ran every piece of writing that's unambiguously mine through a stylometry script and compared it to my AI-assisted posts. The word blacklist wasn't the problem. Em-dashes and sentence length were."
tags:
  - voice
  - writing
  - ai
  - analysis
---

Everyone writing about AI voice preservation hands you the same list of forbidden words. Delve, tapestry, pivotal, robust, leverage. I had that list in my voice profile for months and my AI-assisted posts still didn't read like me, which meant either the list was incomplete or the list was aimed at the wrong thing.

So I measured it, and what follows is that measurement.

## Quick Obligatory Methodology Section

I split my writing into two piles, one of them unambiguously mine and the other one everything I've published with Claude's help.

The HUMAN pile is stuff I wrote before I used AI for anything, or wrote by hand regardless: the archived Medium posts and drafts from 2016 through 2019, 25 files in all, [[../posts/writing-to-think|writing to think]] from 2022, everything in [notes](../notes), and the [security assessment article](https://our.status.im/what-is-a-security-audit-when-you-should-get-one-and-how-to-prepare/) I wrote for the Status blog in 2021. That last one is the only substantial sample of my professional register that exists in one place, so it carries a lot of weight in the profile even though it's a single document, which is worth knowing before you trust anything I say about the professional register.

The AI-ASSISTED pile is the seven posts I published in 2026 with Claude, using the voice profile I'd written by hand from intuition.

Then I wrote [a script](measuring-voice) that strips frontmatter, code blocks, HTML, images, footnotes, and link syntax, throws away headings and list items so I'm measuring prose and not structure, and computes a set of metrics on what's left. Sentence splitting is naive regex with a few abbreviation guards, so treat sentence counts as approximate rather than exact. Everything is normalized per thousand or per ten thousand words so the corpora are comparable despite wildly different sizes.

One bug worth confessing, because it nearly gave me a wrong headline. My first version didn't strip inline footnote markers, and a citation like `.[^5]` sits between the period and the following space, which means the sentence splitter never splits there. My two most heavily cited posts got their sentences glued together and reported means of 32.5 and 24.7 words, and the democratization post appeared to contain a single 209-word sentence that was really four sentences wearing a trenchcoat. After stripping the footnote refs its real mean came out at 22.8. If you cite heavily and you're measuring sentence length, go check this before you believe your own numbers.

The script and the raw output are both in [[measuring-voice]]. Holler at me if you have a problem with my methodology, and especially if you think a metric is measuring something other than what I claim it measures.

## The numbers

| | Medium 2016-19 | writing-to-think | notes | Status audit (pro) | **AI posts 2026** |
|---|---|---|---|---|---|
| words | 22,166 | 824 | 4,974 | 4,439 | **15,044** |
| mean sentence length | 22.4 | 21.1 | 23.5 | 23.0 | **14.9** |
| sentence-length CV | 0.57 | 0.55 | 0.52 | 0.54 | **0.73** |
| sentences under 10 words | 13% | 10% | 10% | 8% | **38%** |
| sentences over 30 words | 21% | 18% | 24% | 19% | **10%** |
| em-dashes per 1k words (prose) | 0.54 | 0.00 | 0.20 | 0.00 | **9.37** |
| contractions per 1k | 19.0 | 31.6 | 20.7 | 5.2 | 35.6 |
| I/me/my per 1k | 15.4 | 54.6 | 21.5 | 1.6 | 12.8 |
| you/your per 1k | 13.1 | 6.1 | 10.7 | 28.8 | 13.9 |
| profanity per 10k | 5.9 | 24.3 | 2.0 | 2.3 | 2.7 |
| ALL-CAPS emphasis per 10k | 113.8 | 0.0 | 36.2 | 11.3 | 39.9 |
| blacklisted "AI words" per 10k | 7.2 | 24.3 | 18.1 | 24.8 | **14.6** |
| mean paragraph length | 53w | 52w | 43w | 72w | 58w |

## Finding 1: the word blacklist is already working, and it was never the problem

Look at the bottom row of that table, where my AI-assisted posts use blacklisted AI vocabulary at 14.6 instances per ten thousand words, while my own Status security article uses them at 24.8 and my notes use them at 18.1.

I use the forbidden words MORE than Claude does when Claude is running my profile.

The words doing it are "additionally," "landscape," "comprehensive," and "crucial," which are just normal English that ended up on a list because a 2024 study found them overrepresented in biomedical abstracts. Kobak et al. measured excess frequency in a specific corpus during a specific window, which is a real and useful finding about aggregate drift in scientific publishing, and it is not the same thing as a rule about whether one particular sentence sounds like it came from a person.

The blacklist works and it has been working the whole time, which means every hour I spend extending it is an hour spent on a solved problem. The whack-a-mole failure mode is real too: Pangram found that telling Claude to "acknowledge complexity" just made it say "complex" constantly, so you ban a word and get its synonym.

I'm keeping the list, and I'm going to stop thinking about it.

## Finding 2: em-dashes, and it isn't close

A note on how this is counted, because I got it wrong the first time. My original script counted em-dashes across the whole document, which swept in list items like "**thing** — gloss." That's a layout choice, not a prose rhythm, and it inflated one post to a spectacular-looking 88.8 per thousand words that turned out to be almost entirely bullets. The numbers below count em-dashes in prose only, which is where the tell actually lives.

My human baseline for em-dashes per thousand words of prose, across four corpora spanning 2016 to 2022, in both registers: **0.00, 0.00, 0.20, 0.54**.

My AI-assisted posts, in aggregate: **9.37**. Per post the range is 0.00, 0.00, 9.22, 11.01, 16.15, 19.00, 19.12.

That's roughly seventeen times my highest human rate on average and thirty-five times at the top end. It is the single loudest signal in the entire dataset and nothing else has that kind of separation.

Put it in units that mean something: in a 2,000-word post, my own writing produces at most one em-dash and usually zero. The AI-assisted version produces around EIGHTEEN, and the worst offenders push forty. A reader who knows my writing doesn't need to consciously notice this to feel that something is off, because it changes the rhythm of every few sentences.

Two of the seven posts contain none at all, which is worth sitting with. The tic isn't constant, it's another instance of the instability in Finding 3.

The frustrating part is that my voice profile already said "2-3 max per piece." The instruction was correct and it was being ignored, which taught me something about how these constraints actually behave: a qualitative cap the model can rationalize is not a constraint. "Use em-dashes sparingly" is advice. "This 2,000-word draft may contain at most 2 em-dashes, count them" is a check. I now write it as a number and I verify it with grep instead of trusting it.

This is also the cheapest possible fix in the entire document, because most of those em-dashes want to be a comma, a period, or a colon, and swapping them takes about four minutes with a search.

## Finding 3: consistency IS the voice, and that's the thing AI doesn't reproduce

I originally wrote this section up as "AI collapses my sentences into fragments," because the aggregate says my AI posts average 14.9 words against my 21 to 23. Then I broke the aggregate out per post and the story changed, so here's the corrected version.

| AI-assisted post | mean sentence | under 10w | over 30w | em-dash /1k (prose) |
|---|---|---|---|---|
| asking-for-desire-resonance | 11.3 | 47% | 1% | 0.00 |
| the-shape-of-intimacy | 11.9 | 51% | 4% | 19.00 |
| the-emotional-man | 12.6 | 45% | 4% | 0.00 |
| outrage-essay | 13.0 | 38% | 0% | 9.22 |
| architectural-primitives | 18.3 | 14% | 17% | 11.01 |
| the-democratization-paradox | 22.8 | 7% | 27% | 19.12 |
| compersion | 24.7 | 19% | 35% | 16.15 |

Now compare that spread against mine, across four corpora written six years apart in two different registers, one of them a professional security document: **21.1, 22.4, 23.0, 23.5**, a total range of 2.4 words.

The AI posts range from 11.3 to 24.7, a spread of 13.4 words, which is more than five times mine across seven pieces written in the same year with the same voice profile loaded.

The em-dash column does the same thing, with two posts containing zero and two others running above 19 per thousand words of prose, which is more than thirty times my ceiling.

So the real finding isn't that AI writes short, it's that **AI-assisted drafts have no stable voice at all.** Each piece gets its own register, apparently inherited from the topic, so the relational essays come out staccato, the analytical ones come out long, and the technical one comes out drowning in em-dashes. My own writing does the exact opposite, because whether I'm explaining elliptic curve math, analyzing an ICO, telling people how to prepare for a security assessment, or writing about why I don't write enough, I land within about a word of the same rhythm every time.

That consistency was invisible to me before I measured it, and it's most of what "sounds like me" actually means.

The practical upshot for the profiles is the same either way, since the dominant failure mode is still the staccato one in four of seven pieces. I inverted the generic advice, so the profiles no longer ask for burstiness, because my variation is already stable and asking for more just licenses chopping everything into fragments for emphasis. Short sentence. For punch. Like this. Instead they specify the target mean, cap the fraction allowed under ten words, and require that roughly a fifth run past thirty. If you're building a profile from a research checklist, "vary your sentence length" is the item most likely to be wrong for you, and you won't find out without measuring.

One caveat worth keeping is that the staccato lives inside paragraphs rather than between them. I expected these posts to be full of dramatic one-line paragraphs and they aren't. Their paragraphs average 58 words against my 43 to 53, so the paragraph structure is fine and it's the sentences inside them that got chopped.

## Finding 4: the two registers are separable by two numbers

I suspected my professional writing was a different voice, and it turns out to be the same voice with two dials turned.

Personal register: first person runs 15 to 55 per thousand words, second person runs 6 to 13. Professional register, in the Status article: first person drops to **1.6** and second person climbs to **28.8**.

That's a near-total inversion, and it's the cleanest structural difference between the two profiles. When I'm writing for myself I'm narrating what I did and what I think. When I'm writing professionally I'm telling you what to do and I nearly disappear from the text.

Contractions move with it, from roughly 19 to 32 per thousand down to 5.2. Everything else stays put, and sentence length barely budges between registers, at 22.4 personal against 23.0 professional. Paragraph length actually goes UP professionally, to 72 words, which is the opposite of what business-writing advice would predict and is a good reminder that my professional register is closer to documentation than to a memo.

## Finding 5: profanity is rationed, not sprinkled

My Medium posts run 5.9 instances per ten thousand words. The single most informal thing in the corpus, [[../posts/writing-to-think|writing to think]], runs 24.3.

The Status security article contains exactly ONE instance across 4,439 words, and it's the final sentence of the entire piece:

> Lastly, you actually have to fucking do those things instead of just talking about them.

That's the rule, and I didn't know I had it until I ran the numbers. In professional writing I get one, I save it, and I spend it on the thing I most want to survive the reader's memory. The AI-assisted posts sit at 2.7 per ten thousand, which is roughly right on volume but the placement is scattered rather than aimed.

## Finding 6: ALL CAPS is my emphasis mechanism and it's being replaced

My Medium corpus uses full-caps emphasis at 113.8 per ten thousand words. Things like INCREDIBLY HARD AND NOT CURRENTLY FEASIBLE, and VAST MAJORITY, and DOES NOT.

The AI-assisted posts use it at 39.9, roughly a third of the rate, and they've substituted bold text and em-dashes for the same job. Which is a reasonable substitution if you're optimizing for looking professional, and the wrong one if you're optimizing for sounding like me. I shout occasionally. It's load-bearing.

## What I changed as a result

1. Stopped extending the banned word list. It's done.
2. Em-dash budget is now a hard count, verified with grep, not a vibe. One per thousand words, max.
3. Reversed the burstiness instruction. Target mean sentence length of 22 words, at most 15% of sentences under 10 words, at least 18% over 30. Same numbers for every piece regardless of topic, because holding them steady across topics is the actual signal.
4. Split the two profiles on the person dial explicitly rather than on adjectives like "formal."
5. One profanity per professional document, placed at the end, on the sentence that matters most.
6. Restored ALL CAPS as the emphasis tool instead of bold.

Those are the deltas that produced [[profile-personal]] and [[profile-professional]].

## What I still don't know

I don't know whether any of this generalizes, because it's one person's corpus, roughly 32,000 words of human writing against 15,000 of AI-assisted, and my human sample is heavily weighted toward 2016-2019 writing that may not reflect how I'd write today anyway. The professional register rests on ONE article, which is thin enough that I'd distrust any conclusion from it that wasn't as stark as the 1.6-against-28.8 person inversion.

I also haven't tested whether fixing these six things actually makes readers perceive the output as mine. The metrics are a proxy for the thing I actually care about, and Wang et al. found that style-imitated output stays detectable as AI even when the imitation is decent, and I have no reason to think I've escaped that. What I can claim is narrower: my AI-assisted writing now deviates from my own measured habits on six specific axes, and it doesn't have to.

The next honest test is a blind one: take five paragraphs of mine and five of Claude's running the updated profile, hand them unlabeled to somebody who's read me for years, and see whether they can sort them. Until I do that, everything above is a well-measured hypothesis.
