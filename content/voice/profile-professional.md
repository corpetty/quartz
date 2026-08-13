---
title: "Voice Profile: Professional"
description: "The register for security work, specs, RfPs, and anything with an organization's name on it. Same voice as the personal profile with the person dial inverted."
tags:
  - voice
  - writing
  - security
---

This is the profile for security writing, technical specifications, RfPs, assessment documentation, client-facing material, and anything published under an organization's banner rather than mine alone.

It is the same voice as [[profile-personal]] with two dials moved. I don't become a different writer when I get paid, I just get out of the way of the reader.

## A caveat about the evidence

This profile rests substantially on one document: the [security assessment article](https://our.status.im/what-is-a-security-audit-when-you-should-get-one-and-how-to-prepare/) I wrote for the Status blog in 2021, 4,439 words. That's a thin sample. The person-inversion finding is stark enough that I trust it, and the sentence-length finding matches all four of my other corpora so it's corroborated, but anything here that rests only on the Status article should be treated as a hypothesis. If I write two more substantial professional pieces I should re-run [[measuring-voice|the script]] and revise this.

## Quick reference

The same guy, now writing documentation. He has done this work, he is telling you how to do it, and he will not pad the page to look authoritative. He states what a thing is NOT before he says what it is, because most of the confusion in his field comes from people importing the wrong mental model. He scopes honestly, refuses to speculate where he doesn't know, and treats the document as a living thing that will be wrong later.

## Measured targets

| Metric | Target | Note |
|---|---|---|
| Mean sentence length | 21-23 words | Identical to personal. Does not tighten under formality |
| Sentences under 10 words | at most 10% | Measured 8% |
| Sentences over 30 words | ~19% | Long sentences survive into professional writing |
| Em-dashes | zero | The Status article contains NONE across 4,439 words |
| Contractions | ~5 per 1,000 words | Down sharply from personal. Not eliminated |
| I/me/my | ~2 per 1,000 words | I nearly vanish from the text |
| you/your | ~29 per 1,000 words | The reader is the subject of almost every sentence |
| Profanity | exactly one, placed last | See below |
| ALL-CAPS emphasis | ~11 per 10,000 words | Reserved for absolute prohibitions |
| Paragraph length | ~72 words mean | LONGER than personal writing, not shorter |
| One-sentence paragraphs | ~15% | Rare |

The paragraph number is worth dwelling on. Business writing advice universally tells you to shorten paragraphs for skimmability, and my professional paragraphs are 40% longer than my personal ones. My professional register is documentation, not memo. Do not let a draft get chopped into bullet-ready fragments in the name of professionalism.

## The person inversion

This is the defining structural feature. In personal writing I narrate my own thinking, so first person runs 15 to 55 per thousand words. In professional writing it drops to 1.6 and second person climbs to 28.8.

Nearly every sentence has "you" as its subject, doing something:

> It is your job to come to the table with expectations.
> You are paying for their expertise, maximize it.
> Do them, explicitly.
> Attempt to access things that should not be accessed. Put in random characters where there should be numbers, go nuts.
> You have designed the work, you have done the work, you have documented the work, you have tested the work.

First person appears almost exclusively to mark opinion or to disclaim scope, which is the one job it keeps:

> Many use the terms interchangeably; this document will use the term assessment as it implies (in my opinion) the appropriate way of thinking about things.
> I am not going to belabor you on the various kinds of testing frameworks that are available, but I will point out some things that should be done.
> I will not speculate here as to why.

That last one is the whole ethic in six words. Where I don't know, I say I'm not going to guess, and I move on.

## Structural patterns

1. **Define by negation first.** Open by clearing out the wrong mental model before installing the right one. The Status article spends its first several paragraphs on why "audit" is the wrong word and what an assessment is NOT, because the misconception is the actual obstacle.
2. **Scope the document honestly and early.** "Note that this is not a comprehensive guide on all things regarding assessments."
3. **Declare it a living document.** "This document will most likely change over time as we at Status become more educated and seasoned in this process, so check back occasionally."
4. **Enumerate what the reader gets.** Bulleted lists of concrete outcomes, framed as what the organization will be able to do.
5. **Second-person process narration.** Walk them through it in order, in the imperative.
6. **Consequences, not commands.** Explain what happens if they skip a step rather than just asserting the step. "If inadequate, a vendor will either spend a substantial portion of the paid-for assessment time getting up to speed."
7. **Disclose conflicts of interest plainly.** Advisor roles, prior working relationships, anything that could look like shilling. State it, state that it isn't paid, move on.
8. **Point at resources rather than reproducing them.** Link out generously, credit the people it was learned from.

## Language patterns that survive into professional writing

**Section headers with personality.** "Get your mind right." "Document all of the things!" "Color Outside the Lines." "Test it yourself."

**Direct conversational openers.** "Let's talk about audits." "Okay!" "So you got a working system. You think it does what you set out to do. Good, now make sure of it."

**Anticipating the reader's objection out loud.** "You might be saying 'but we already made a specification!' Good, but..."

**Casual idiom inside technical guidance.** "go from zero to hero," "go nuts," "the lion's share," "bird's eye view."

**ALL CAPS for absolute prohibitions only.** "an external assessment DOES NOT give guarantees of code quality," "users WILL attempt to do things outside of what you expect them to do."

**Parentheticals, still.** "(we all know most hate this part)," "(which you've conveniently defined already)," "(but probably not)!"

**Precision about uncertainty.** "absence of evidence is not evidence of absence with respect to vulnerabilities detected during the assessment."

## The one profanity rule

The Status article contains exactly one instance of profanity across 4,439 words. It is the final sentence of the document, after every section, resource list, and caveat:

> Lastly, you actually have to fucking do those things instead of just talking about them.

That is the rule. In a professional document I get ONE, and I spend it on the single thing I most want to survive the reader's memory, placed where nothing follows it. Do not sprinkle. Do not open with it. If nothing in the document earns it, don't use it at all.

## Never

- Em-dashes. Zero in the reference corpus, so zero in the draft
- Corporate hedging that avoids saying anything. State the position, then state its limits
- Marketing language about the organization
- Claiming comprehensiveness. Always scope
- Speculating past the evidence. Say "I will not speculate here as to why"
- Pretending the document is finished
- Bulleted fragments where a paragraph is doing real explanatory work
- The standard banned-vocabulary list, though per [[voice-baseline]] my professional writing legitimately uses "additionally" and "comprehensive," so enforce this one with judgment rather than a blind find-and-replace

## Closings

The Status article ends with a resources list and then the one profane line. The pattern is: give them the next thing to read, then land the point that matters, then stop. No summary of what was covered, no encouraging sign-off.
