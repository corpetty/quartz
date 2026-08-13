---
title: My Writing Workflow
description: "Where the voice layer plugs into the 12-step process I already use, which register to run, and the honest rule about when to keep AI out of the drafting entirely."
tags:
  - voice
  - writing
  - ai
  - process
---

I already documented the general process in [How to Write with AI Without Producing Slop](../posts/writing-with-ai), and I'm not going to restate all twelve steps here. That post covers the part that matters most, which is that the thinking happens in the description, key points, constraints, and outline, before any prose gets generated.

This document covers the layer I bolted on afterward: where voice enters, which profile to load, and when to keep AI out of the drafting entirely.

## Pick the register before anything else

| If it's… | Load |
|---|---|
| An essay, a post on this site, anything under my name alone | [[profile-personal]] |
| Security work, a spec, an RfP, assessment docs, anything under an org's banner | [[profile-professional]] |
| Something genuinely personal, raw, or still unresolved in my head | Neither. See below |

This matters more than it sounds like it does, because the two registers differ by a near-total inversion of the person dial, first person at 15-55 per thousand words against about 2, and getting that wrong produces writing that is confusingly intimate in a spec or weirdly distant in an essay, while everything else is a much smaller correction.

## Where voice enters the 12 steps

**Steps 1 through 4 (description, key points, constraints, outline).** No voice profile, no style prompt. This is thinking, and dressing it up wastes attention. What I DO add here is one or two voice constraints in the constraints list when they're load-bearing for the piece, things like "this has to admit I don't know whether the cognitive tradeoff is worth it."

**Steps 5 and 6 (research and critique).** Still no voice profile. I want the critique blunt and I want the research raw. Loading a style guide here just makes the model's criticism of my argument sound like me, which is the opposite of useful.

**Step 7 (draft).** Load the register profile and the matching block from [[style-prompts]]. Paste three to five real samples. Not more than five, because the research says the returns plateau there and I'd rather spend the context on the outline.

**Step 8 (review).** This is where [[ai-tell-checklist]] runs. Do the constraint check first, exactly as the original post says, because a draft that violates a constraint is going to get rewritten anyway and there's no point polishing the voice on prose that's about to be replaced. Then run the checklist top-down and stop caring once you're through Tier 3.

**Steps 9 through 12 (human review, iterate, sources, disclose).** Unchanged. One addition: when I hand a draft to a human reviewer, I don't tell them AI was involved until after they've read it. If they can't tell, that's information. If they immediately say "this doesn't sound like you," that's better information.

## The rule about when to keep AI out

I've been going back and forth on this and the measurement helped me land somewhere concrete.

The Wang et al. study found that LLMs imitate structured writing well, hitting 95-97% on news and 96% on email authorship verification, and fail badly on informal writing, dropping to 17-21% on blogs. That maps almost exactly onto my own experience of which of my pieces came out sounding like me and which didn't. My technical and analytical writing survives the process intact, while my personal essays come out competent and slightly hollow.

So the rule is:

**AI drafts the prose when the thinking is finished and the register is structured.** Technical explanation, security guidance, analysis where I've already done the work, anything where the value is in the argument and the evidence rather than in how it feels to read it.

**I draft the prose when the piece IS the voice.** Personal essays, anything I'm still working out, anything where being unresolved on the page is the point. For these, AI stays in steps 5, 6, and 8. It researches, it critiques, and it edits. It does not generate.

**Dictation for the middle case.** When I know what I think but writing it out is the bottleneck, I talk it through, transcribe, and have AI do a light cleanup pass only. Spoken phrasing carries voice better than typed phrasing does, and the cleanup prompt in [[style-prompts]] is deliberately restrictive about what it's allowed to touch.

## What I'd change if the checklist stops working

The measurement is the point of the whole exercise, so the trigger conditions should be explicit.

**If a draft passes the checklist and still doesn't sound like me**, the checklist is measuring the wrong things. Go back to [[measuring-voice]], find a new metric, and add it to the baseline. Prime suspects I haven't measured yet: how I use analogy, paragraph-to-paragraph transitions, and whether I front-load or back-load the point within a paragraph.

**If a reader who knows my writing sorts AI paragraphs from mine at better than chance**, prompting has hit its ceiling and the next lever is fine-tuning. Chakrabarty et al. found fine-tuning reversed expert judgments entirely, with fine-tuned output flagged as AI 3% of the time against 97% for in-context prompting, at a median cost around $81 per author. I'm not there yet and I'd want the blind test to fail first.

**If I'm producing 50-plus near-identical pieces a month**, same answer, for economic reasons rather than quality ones. I'm nowhere close.

## Disclosure

Say it when AI materially shaped the output, and give people a way to tell me what's wrong. That's already how I close the posts and I see no reason to change it.

The version of this I care about is less about ethics-as-compliance and more about the fact that publishing "written with AI, here's my process, here's the measurement, tell me where I'm wrong" is the only way any of this gets better. If I hide the process then I lose the corrections along with it.
