---
tags:
  - posts
  - writing
  - ai
title: How to Write with AI Without Producing Slop
---
> [!NOTE] All sources for claims can be found in the accompanying [[writing-with-ai-sources|sources]] document

I've always enjoyed writing, and for me, it's an important [[writing-to-think|part of thinking]]. Recently, with the onslaught of ever-improving AI, I've found it useful to alter my process in order to amplify my ability to write _and think_ about interesting topics.

But how to keep it from producing what is colloquially called "slop"? How do you maintain a level of quality and personality when the vast majority of the actual words that end up in a given article are produced by LLMs just probabilistically guessing the next one in the sentence? (This is how they work, if you didn't know.)

The answer here is, for me, straightforward and exactly how you constrain AI-driven software development: **give it good context** and let it do what it does best.

## Garbage In, Garbage Out

When "data science" emerged as a discipline, practitioners quickly ran into a familiar problem: the tools were powerful, but the outputs were only as good as what you fed them. The aphorism that emerged—"garbage in, garbage out"—became a teaching mantra. The phrase dates back to the late 1950s, when early programmers were first grappling with automated systems. George Fuechsel, an IBM instructor, popularized it as a warning: computers cannot think for themselves, and sophisticated algorithms cannot compensate for flawed inputs.

The data science field learned this lesson painfully. Google Flu Trends, celebrated in the bestseller _Big Data_, was supposed to predict flu outbreaks faster than the CDC by analyzing search queries. Instead, it overestimated flu prevalence by more than 50% and was quietly discontinued. The algorithm confused correlation with causation—searches for "high school basketball" correlated with flu season but indicated nothing about illness. Gartner predicted in 2015 that 60% of big data projects would fail; analysts later admitted they were too conservative—the actual failure rate approached 85%.

The parallel to AI writing is direct. You can't just naively use the tool and expect it to produce good things. You have to feed it good things and guide it. The same principle that humbled the data science field applies here: **the quality of your input determines the quality of your output**.

## What AI Does Well (That I Don't)

Before getting into the process, it's worth being explicit about _why_ I use AI at all for writing. The answer is leverage—AI does certain things inhumanly well that save me time and allow for rapid iteration:

**Research and summarization.** AI can search across sources and synthesize information far faster than I ever could. What might take me hours of reading and note-taking, AI can condense into minutes. This isn't "research" in the academic sense—I hate that we call it that—but it's effective for gathering a landscape of sources and claims around a topic.

**Rapid critique and feedback.** Before bothering another human or waiting for their attention, I can get quality critique quickly. AI can identify logical gaps, missing considerations, and weak arguments in ways that help me stress-test ideas before committing to them.

**Draft generation from structured input.** Once I've done the thinking work—the outline, the constraints, the key points—AI can string those thoughts together into prose faster than I can type. This is where it shines as an amplifier rather than a replacement.

The research supports this. A 2023 study of 758 BCG consultants found that for tasks within AI's capability boundary, speed increased by 25% or more and performance improved by 40% or more. But—and this is critical—for tasks _outside_ that boundary, consultants using AI were 19 percentage points _less likely_ to produce correct solutions than those working without it. The researchers called this the "jagged technological frontier." Knowing what AI does well versus poorly is essential to using it effectively.

## My Process

This is how I'm currently grappling with writing with AI. It's allowed me to start fulfilling a desire to output content I think is interesting, and it has served me well in fleshing out new ideas and complex topics. I'm not claiming this is the definitive approach—it's what's working for me now, and it will continue to evolve.

### 1. Start with a Detailed Description

Before touching any AI tool, I write down what I actually want to discuss and investigate. This isn't a prompt—it's clarification for myself. What's the core question? What am I trying to figure out or communicate? The more specific I can be here, the better everything downstream becomes.

### 2. Name the Key Points

What should a reader walk away with after reading this? There should only be a few—if you have more than three or four, you probably have multiple articles. These key points become the spine of everything that follows.

### 3. Write Down Constraints

This is crucial. I write down a number of things that MUST remain true or be included within the article. Then I explain _why_ those things must be there and how they relate to the key points.

For example, a constraint might be: "This article must acknowledge that I'm trading some cognitive benefit for efficiency." The _why_: because the research on writing-as-thinking suggests that outsourcing prose generation has real costs, and being honest about that makes the argument more credible.

Constraints serve as guardrails. When reviewing the AI's output, I can check each constraint systematically. Did it violate any of them? If so, that needs to be fixed before anything else.

### 4. Create an Outline

Just like you learned in grade school. The more detail you can have here, the better. This gives the AI scaffolding to work with, and—more importantly—forces you to ensure the idea is fleshed out reasonably completely _before_ you start generating prose.

The outline is where most of the thinking happens. If you can't outline it coherently, you don't understand it well enough to write about it. This step is non-negotiable.

### 5. Have the AI Do Research

Given all of the above, have the AI go out and do web research. The point is to gather sources around the topic and have the AI summarize those points along with where it got them from.

I use this to find supporting evidence, counterarguments, and examples I wouldn't have thought of. The AI is good at casting a wide net quickly. But I treat these as leads to verify, not facts to accept.

### 6. Have the AI Critique the Argument

This is a step I've added that wasn't in my original process, but it's become valuable. Before drafting, I ask the AI to critique the key points and look for logical fallacies, weak arguments, or gaps in reasoning.

The AI is genuinely useful here—it can pattern-match against logical structures and identify potential weaknesses faster than I can when I'm close to my own ideas. But the critical part is that _I_ then evaluate this feedback. Not everything it flags is a real problem. Not everything it misses is fine. The human judgment remains essential.

This serves as part of the "required effort" that keeps me cognitively engaged. I'm not just accepting AI output—I'm actively wrestling with its critique of my thinking.

### 7. Have the AI Write a Draft

Now, finally, I have the AI combine all of the above—description, key points, constraints, outline, research, and critique responses—into a draft.

This is where the AI does what it does best: generating coherent prose from structured input. The heavy thinking has already happened. The AI is executing on a well-defined plan, not trying to think for me.

### 8. Review It Thoroughly

Review the living shit out of it. Specifically:

- Check every constraint. Did the AI violate any of them?
- Read for accuracy. Does this actually say what I mean?
- Read for coherence. Does the argument flow logically?
- Read for voice. Does this sound like something I would write, or does it have that generic AI tone?

The research on AI content failures is instructive here. CNET published 77 AI-generated articles and had to correct 53% of them—including basic math errors. The problem wasn't that the AI wrote badly; the writing was fluent and confident. That fluency actually _reduced_ editorial scrutiny. The text read well even when factually wrong.

I try to read AI drafts with _more_ skepticism than I would human writing, precisely because the confidence can be misleading.

### 9. Get Human Review

Once I'm semi-happy with the draft—meaning I've iterated enough that I'd be comfortable showing it to someone—I have others review it. This is somewhat optional and depends on the audience and purpose of the piece. But for anything important, getting domain expert feedback is valuable.

The point is to get the draft to a personally subjective quality level where you feel comfortable showing it to another human. If you don't know what you're talking about, that will probably come through when someone knowledgeable reads it. But that would happen without AI too.

### 10. Iterate Based on Feedback

You can provide explicit feedback to the AI and have it alter things. My experience is that giving it detailed updates tends to do a decent job without butchering the initial draft. Major structural changes are harder; I often do those manually.

### 11. Generate and Verify Sources

Have the AI generate a separated source document that details where it sourced any claims. Then go check the important claims explicitly.

This is tedious but essential. AI can and does hallucinate sources. I've had it cite papers that don't exist, attribute quotes to people who never said them, and confidently reference statistics that are fabricated. The source document makes verification tractable.

### 12. Acknowledge AI Assistance

When publishing, acknowledge that the article was written with the assistance of AI, and give instructions for feedback or corrections so issues can be fixed and updated.

I think this acknowledgment matters for two reasons. First, transparency is simply the right thing to do. Second, it signals that I _want_ to improve things if others find problems. It's an invitation to hold me accountable.

## What I'm Trading Away

I want to be honest about the costs of this approach.

**Voice.** ~~There's a "voice" I'm losing by allowing AI to string thoughts together via words. The prose that comes out is competent but not distinctively mine. For semi-educational material, this is acceptable. For personal essays or anything where my particular perspective is the point, this process probably isn't appropriate.~~

**Update:** I've addressed this. After writing the original article, I analyzed a bunch of my previous writing—posts where I was genuinely frustrated, excited, or working through something hard—and distilled it into a voice profile. The profile captures the patterns that make my writing sound like *me*: the strategic profanity, the parenthetical asides, the willingness to say "I don't know" or "this pisses me off," the invitation for critique at the end.

Now when I have AI generate drafts, I include the voice profile as context. It's not perfect, but it's *dramatically* better than generic AI prose. Compare the original version of this article (competent but flat) with something like [[ice-constitutional-guardrails|my ICE analysis]]—the latter has personality. It cusses when the situation warrants it. It admits uncertainty. It tells the reader to "shut the fuck up" if they won't engage with the evidence. That's me.

The voice profile approach adds another constraint layer: after generating a draft, I check it against the anti-patterns list. If I see "It's worth noting that..." or "Furthermore" or any of the other AI-isms I've catalogued, those get rewritten. The profile also gives positive patterns to inject—opening with personal observation, clearly marking opinion sections, inviting dialogue at the end.

Is it as good as writing everything myself? Probably not. But the gap is much smaller than I expected, and I'm still iterating.

**Some cognitive benefit.** The research on writing-as-thinking suggests that the struggle of finding words, revising, and iterating is where deep understanding develops. Turing Award winner Leslie Lamport put it starkly: "If you're thinking without writing, you only think you're thinking." Paul Graham made a similar argument in his essay "Writes and Write-Nots," warning that a world divided into those who write and those who don't is really a world of "thinks and think-nots." By outsourcing the prose generation, I'm trading some of that cognitive workout for efficiency.

I've tried to preserve the thinking by front-loading it into the outline, constraints, and critique steps. The jury's still out on whether that's sufficient. This is an ongoing experiment.

**The boundaries aren't clear yet.** I haven't figured out where this process doesn't work. ~~It probably isn't good for writing where your voice needs to be specifically yours. Personal essays, creative work, arguments you haven't fully worked out—these might need a different approach or no AI at all.~~ The voice profile helps with this more than I expected—but I'm still not sure I'd use this process for something deeply personal. Analysis pieces, technical writing, arguments I've already worked out in my head? The process works well. The jury's still out on creative work.

## Why This Isn't Just "Let AI Do It"

A sophisticated objection to this whole approach goes something like: "You're doing all the hard thinking yourself, then handing it to AI to generate prose you'll have to carefully review anyway. At that point, you've done 80% of the work. Why bother with the AI?"

Fair question. My answer: the remaining 20%—the actual prose generation—is genuinely time-consuming for me, and AI does it faster. The research and summarization would take me hours; AI does it in minutes. The critique step surfaces considerations I might miss. The iteration is faster because I'm editing rather than writing from scratch.

This isn't about avoiding work. It's about directing my effort where it matters most—the thinking—and letting AI handle the parts where it has genuine leverage.

Maybe this process works because I've already developed the skills that make AI useful: clear thinking, the ability to articulate constraints, enough domain knowledge to evaluate outputs. Maybe it filters for people who were going to produce quality work regardless. I don't know. What I know is that it's working for me, and the output is more coherent and reasonable than naive AI writing.

## My Tools (For Now)

**[Claude](https://claude.ai/)** — I tend to use Opus 4.5 with Thinking and Research skills turned on. The $20 subscription is more than enough for my usage.

**[Gemini](https://gemini.google.com/)** — Gemini Pro's research is good for gathering sources and summarizing them. NotebookLM isn't bad either for putting together sources you already have and generating summaries.

**[Obsidian](https://obsidian.md/) and [Quartz](https://quartz.jzhao.xyz/)** — These are my writing tools. I write everything in Obsidian vaults and publish via Quartz (including this website).

---

_This article was written with the assistance of AI, following the process described above. If you find errors, logical problems, or have feedback, please let me know so I can improve it._