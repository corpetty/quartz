---
title: AI-Tell Editing Checklist
description: "The pass I run on every AI-assisted draft, ordered by how much it actually matters for my writing rather than by how often it appears in generic advice."
tags:
  - voice
  - writing
  - ai
  - checklist
---

Generic versions of this checklist lead with the word blacklist. Mine doesn't, because when I [measured my own corpus](voice-baseline) the blacklist turned out to be the item that was already handled and the em-dashes turned out to be a seventeen-fold deviation nobody was catching.

Ordered by measured impact. If you only do the first three, you've captured most of the available gain.

## Tier 1: the ones that actually matter

### 1. Count the em-dashes

```bash
grep -o "—" draft.md | wc -l
```

Budget is **1 per 1,000 words** for personal writing and **zero** for professional. A 2,000-word post gets at most two.

My baseline across four human corpora is 0.00, 0.00, 0.20, and 0.54 per thousand words of prose. My AI-assisted posts came in at 9.37, with two individual posts above 19. This is the single loudest tell in my writing and the cheapest to fix.

Count prose only. Em-dashes separating a bullet from its gloss are layout, not rhythm, and mixing them in inflated one of my own measurements by a factor of eight before I caught it.

Most of them want to be a comma. Some want a period. A few want a colon, and a few want parentheses. Almost none of them want to stay.

### 2. Fix the sentence-length collapse

Run the [[measuring-voice|script]] or the diagnostic prompt and check three numbers:

- [ ] Mean sentence length is 21-23 words. If it's under 19, the draft has been chopped.
- [ ] At most 15% of sentences are under 10 words. AI drafts hit 38%, and four of my seven ran 38-51%.
- [ ] At least 18% of sentences run over 30 words.

The fix is counterintuitive if you've read the standard advice: **join sentences back together.** Look for consecutive short sentences that were one thought before something split them for emphasis. Fragments. Like these. Used for punch.

Do NOT try to increase burstiness. My variation coefficient is stable at 0.52-0.57 across everything I've written, and the AI drafts overshoot to 0.73. More variation is the disease, not the cure.

Also check the mean against my OTHER pieces, not just against the target. My mean varies by 2.4 words across six years and two registers, while seven AI drafts ranged from 11.3 to 24.7. Holding the rhythm steady across topics is most of the signal.

### 3. Kill the antithesis constructions

Search for `not just`, `not only`, `isn't about`, `rather than`, and bare `not ` followed by a comma or `but` within the same sentence.

- [ ] At most ONE "it's not X, it's Y" in the whole piece, and only if the inversion genuinely surprises
- [ ] Zero "not only… but also"

My AI-assisted posts run these at roughly three times my human rate, and a manual read confirmed that nearly all the AI instances are the genuine rhetorical tic while several of my human hits were regex false positives. The real gap is wider than the raw counts suggest.

## Tier 2: structure

- [ ] Delete the opening paragraph if it restates the task or announces what the piece will cover. My real openings start with the observation, frustration, or confession that made me write.
- [ ] Delete the closing paragraph if it summarizes. Personal pieces end on an invitation to argue or a commitment. Professional ones end on the single point most worth remembering.
- [ ] Check every paragraph advances something. Cut the ones that restate the previous paragraph in different words.
- [ ] Convert bolded bullet lead-ins back to prose anywhere the content is actually an argument. Bullets are for specs and lists of concrete things.
- [ ] Check heading density. If there's a header every 150 words, the piece has been formatted rather than written.
- [ ] Paragraph length in range: 45-55 words personal, ~72 professional. If paragraphs are averaging under 35 words, the draft got chopped for skimmability and it shouldn't have been.

## Tier 3: voice

- [ ] Am I in the text at the right level? Personal writing runs 15-55 first-person per thousand words. Professional runs about 2, with second person around 29. If a personal piece is written from nowhere, put me back in it.
- [ ] Contractions present at the right density. 19-32 per thousand personal, ~5 professional.
- [ ] Emphasis is carried by ALL CAPS, not bold and not em-dashes. I use caps at roughly 114 per 10,000 words in casual writing and the AI drafts use it at a third of that while substituting bold.
- [ ] At least one parenthetical aside that undercuts its own sentence. This is my most distinctive habit and it's the first thing that disappears.
- [ ] Profanity is aimed, not sprinkled. Personal: 1-5 per 2,000 words, on things I actually feel strongly about. Professional: exactly one, as the final sentence, or none.
- [ ] Every position is actually taken. Find the hedges and either commit or cut the sentence.
- [ ] Find the false balance. If the draft presents "both sides" of something where one side is right, say which.
- [ ] Real tensions left unresolved rather than smoothed into a tidy synthesis.

## Tier 4: the word list

Yes, run it. No, don't spend time on it.

```bash
grep -inE "delve|tapestry|realm|testament|underscore|pivotal|multifaceted|intricate|meticulous|robust|seamless|leverage|harness|unlock|elevate|foster|showcase|commendable|paramount|transformative|utilize|embark|myriad|nuanced|holistic|resonate|furthermore|moreover|it's worth noting|let's dive in|in conclusion" draft.md
```

Two caveats from the measurement. First, my AI drafts use these at 14.6 per 10,000 words while my own Status article uses them at 24.8, so the list is already being enforced and I'm the one who violates it. Second, "additionally," "landscape," "comprehensive," and "crucial" are normal English that landed on the list because of a study about biomedical abstracts. Use judgment. A find-and-replace here does more damage than good.

## Tier 5: the human pass

Nothing automated catches these.

- [ ] Read it out loud. Delete anything that sounds too smooth to have been said by a person.
- [ ] Add one concrete, specific detail that only I would know. A number, a name, a thing that actually happened. AI drafts are specific about abstractions and vague about particulars.
- [ ] Check the analogies do real explanatory work rather than decorating. Mine tend to run a paragraph and carry the argument.
- [ ] Ask whether I'd defend every claim in the piece to someone who disagreed with me. Cut what I wouldn't.
- [ ] Disclose AI assistance if it materially shaped the output.

## The honest limit

Running this checklist makes a draft deviate less from my measured habits. It does not make the draft indistinguishable from something I wrote, and I have no evidence that it does. The research is fairly consistent that style-imitated output stays detectable, and the only method that reliably beat that in a controlled study was fine-tuning, not prompting.

What the checklist buys is a draft that doesn't have obvious tells and does sound recognizably like the person whose name is on it. That's the actual goal. Passing a detector was never the point.
