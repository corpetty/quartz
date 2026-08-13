---
title: Writing Voice
description: "A working lab for keeping my writing sounding like me while using AI to write more of it. Measured baselines, two voice profiles, and the checklists I actually run."
tags:
  - voice
  - writing
  - ai
---

I write with AI now, and I've [written about the process](../posts/writing-with-ai) in a way I still mostly stand by, but there's a problem I kept waving at without ever pinning down: how do I know it still sounds like me?

"Sounds like me" is the kind of claim that feels obvious and turns out to be untestable the moment you try to test it. So I did the thing I do with everything else, which is stop arguing about it and go measure it. I took every piece of writing on this site that is unambiguously mine, ran it through a script, and compared it against the posts I've published recently with Claude's help. The results are in [[voice-baseline|My Measured Voice Baseline]], and a couple of them genuinely surprised me.

The short version is that the word blacklist everyone obsesses over turned out not to be where my AI-assisted writing goes wrong, and that em-dashes and sentence length are, by a mile.

This section is that lab, and it holds the research on why AI writing sounds the way it does, the numbers on how my own writing actually behaves, the two voice profiles I run (personal and professional), and the prompts and checklists I use day to day. All of it is versioned in public because I expect to be wrong about parts of it and I'd rather find out fast.

## Start here

- [[voice-baseline|My measured voice baseline]] — the numbers, the method, and the three findings that changed what I do
- [[why-ai-sounds-like-ai|Why AI writing sounds like AI]] — the mechanics, from pretraining through RLHF, and what the research says actually helps
- [[profile-personal|Personal voice profile]] — the register for this site, essays, and anything with my name on it alone
- [[profile-professional|Professional voice profile]] — the register for security work, specs, client documents, and Status/Logos writing

## The working documents

- [[style-prompts|Style prompts]] — paste-ready prompt blocks for both registers
- [[ai-tell-checklist|AI-tell editing checklist]] — the pass I run on every draft, calibrated to my own numbers rather than generic advice
- [[workflow|My writing workflow]] — where AI enters and where it stays out
- [[measuring-voice|Measuring voice]] — the script, how to run it on your own corpus, and what each metric means
- [[profile-template|Voice profile template]] — blank version if you want to build your own

## Sources

- [[research-sources|Research sources]] — every study and claim cited across this section

## Why this is public

Two reasons. The first is that I think most advice on this topic is vibes, and vibes do not survive contact with a corpus. If I'm going to make claims about what makes writing sound human, I should show you the measurements and the script that produced them so you can tell me where I screwed up.

The second reason is selfish, which is that publishing this forces me to keep it current. The profiles here are the ones I actually load into Claude rather than a sanitized version, so when they drift out of date the writing gets worse and I notice.

If you build your own version of this and find something I missed, or you run my script on my corpus and get different numbers, [tell me](../contact). Especially tell me if you think the baseline is measuring the wrong things.
