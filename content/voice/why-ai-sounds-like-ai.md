---
title: Why AI Writing Sounds Like AI
description: "The measured dialect, the training mechanics that produce it, and what the research says actually helps. Plus the two places where my own corpus disagrees with the standard advice."
tags:
  - voice
  - writing
  - ai
  - research
---

There's a shared instinct that you can tell when something was written by a model, and that instinct is usually right for reasons that are documented rather than mystical. The dialect is measurable, the mechanism that produces it is understood well enough to name, and the fixes have known ceilings.

This is the research layer under everything else in this section. Sources for every claim are collected in [[research-sources]], and where my own measurements in [[voice-baseline]] contradict what's below, I say so, because a couple of the standard recommendations turned out to be actively wrong for my writing.

## The dialect is documented, not folklore

The anchor study is Kobak et al., which analyzed more than 15 million PubMed abstracts from 2010 through 2024. The clever part is the method: they borrowed the "excess mortality" approach from COVID epidemiology and applied it to vocabulary, establishing an expected frequency for each word from the pre-ChatGPT years and then measuring the surplus.

What they found was an abrupt post-ChatGPT surge in STYLE words rather than content words. From that they estimate at least 13.5% of 2024 abstracts were processed by a model, reaching roughly 40% in some subcorpora. Of the 2024 excess words, 66% were verbs and 18% adjectives, which means verbs overtook nouns as the dominant part of speech in the surplus.

The words: delve, underscore, intricate, meticulous, realm, pivotal, showcasing, crucial, comprehensive, align. "Delves" ran about 28 times its expected frequency, "underscores" about 10.9 times, and "showcasing" about 10.2.

The detection vendor Pangram, looking at its own corpus, reports that "complex and multifaceted" appears 700 times more often in AI writing than human writing, "intricate interplay" 100 times, and "played a crucial role" 70 times.

**Where my corpus disagrees:** this is all true and it was not my problem. My AI-assisted posts use blacklisted vocabulary at 14.6 instances per ten thousand words. My own security writing uses them at 24.8. I violate the list harder than the model does. Kobak et al. measured aggregate drift across a scientific corpus during a specific window, which is a real finding about publishing, and it does not automatically transfer into a rule about whether one particular sentence sounds like a person. Enforce the list, spend ten minutes on it, then go look at your structure.

## The constructions matter more than the words

The most-cited syntactic tell is negative parallelism, the "it's not X, it's Y" antithesis. The Atlantic called it the most famous and the most mysterious of the AI tics. A Washington Post dataset found variants of "not just X, but Y" in roughly 6% of all chatbot messages in a July sample. Barron's counted the construction in Fortune 500 filings rising from around 50 in 2023 to over 200 in 2025.

OpenAI's product manager for model behavior, Laurentia Romaniuk, calls it "contrastive phrasing" and has said they're working on broadening the repertoire. The leading theory for why it's there is boring and probably correct: human reviewers rewarded it during training because it sounds insightful.

The rest of the inventory runs like this. Tricolons, meaning rule-of-three lists deployed as a reflex rather than because there happen to be three things. "Not only… but also." Em-dash density, and the disappearance of plain "is" and "are" in favor of "serves as" and "features." Relentless signposting, restating the question before answering it, and summary conclusions that add nothing. Bulleted lists with bolded lead-ins. False balance, where every claim gets a counterpoint and no strong opinion survives without a softener attached.

Somebody on Reddit put the general case better than any of the papers do: AI emphasizes everything because it doesn't know what's important.

## Models have distinguishable accents

Stylometric work finds Claude specifically produces longer and more elaborate rhetorical constructions than GPT or Gemini, uses more em-dashes, and tends toward what one analysis called extreme formality and an unwavering objective tone, and it can apparently identify its own output at above-chance rates.

**Where my corpus agrees loudly:** the em-dash finding held up harder than anything else I measured. My human baseline across four corpora is 0.00, 0.00, 0.20, and 0.54 per thousand words of prose, while my Claude-assisted posts averaged 9.37 and two of them ran above 19. The research says the signal is density and misplacement rather than presence, and that's exactly right, because plenty of humans love em-dashes and none of them produce these at seventeen times their own baseline.

## Where it comes from

Three training stages each contribute something to the result.

**Pretraining distribution.** The corpus over-represents corporate blogging, SEO content, Wikipedia, and academic abstracts, which are registers full of hedged, comprehensive, formal prose. The output is a funhouse mirror of all of them at once.

**RLHF and mode collapse.** Kirk et al. found that RLHF generalizes better than supervised fine-tuning but significantly reduces output diversity across a range of measures, which implies a real tradeoff between generalization and diversity. This is the "mode collapse" everyone refers to, where the model puts disproportionate probability on a narrow band of responses, and it's attributed to the mode-seeking behavior of the KL-regularized objective. The diversity loss shows up lexically, syntactically, semantically, and conceptually, and it's worse for creative prompts than for factual ones.

**Sycophancy.** Sharma et al., out of Anthropic, showed that human preference data systematically favors responses matching the user's stated views over accurate ones, and that sycophancy is a general property of RLHF-trained models rather than a quirk of any one of them. This is where the hedging, the validation, and the false balance come from. It tends to get worse with scale.

**Instruction-tuning format bias.** Do Xuan Long et al. ran the first systematic evaluation of format bias and found significant bias across state-of-the-art models toward lists, wrapping, and mapping formats. That's the mechanical root of the reflexive headers and bullets.

**Token dynamics.** The model samples high-probability tokens at every step, so the output is predictable by construction. That's what produces the low perplexity and low burstiness that detectors key on.

**Helpfulness objectives.** Claude's constitution prioritizes being broadly safe, broadly ethical, compliant, and genuinely helpful, and frames Claude as something like a brilliant friend. That objective is a direct driver of the preamble, the caveats, and the compulsive summarizing.

I find the mechanistic story useful mostly because it kills the idea that any of this is a style choice you can just ask the model to abandon. It's the shape of the optimization itself, which means you're working against a gradient rather than against a preference.

## On detectors

Perplexity measures how surprised a model is by a text and burstiness measures the variation in sentence length and complexity across a document. GPTZero pioneered both, though as of late 2023 it moved to a deep-learning classifier and no longer relies on them directly.

The numbers you'll see quoted, human writing around 80-100 perplexity units against GPT-4 output at 20-30, human burstiness spread 0.6-1.2 against GPT clustering at 0.2-0.4, come from vendors selling detection. Treat them as illustrative and don't build anything on them.

More importantly, do not use detectors as ground truth, because they produce false positives on human writing, and the evidence suggests they're biased toward catching GPT-family output specifically. Passing a detector is not the goal and never was.

## What actually works, and how well

**Show, don't tell.** The consistent practitioner finding is that examples beat adjectives. "Conversational but professional" just makes the model guess, whereas two or three real samples of your writing tell it more than any description will, and you should put the samples before the instruction.

**But the ceiling is real, and it's low for informal writing.** Wang et al. tested six models across more than 40,000 generations imitating over 400 real authors in four domains. Structured writing imitates well, hitting 95-97% authorship verification on news and about 96% on email. Informal writing fails badly, dropping to 50-66% on forums and 17-21% on blogs.

Two results from that paper that should change how you spend your time. First, going from 2 examples to 10 barely moved anything, so assembling a large sample corpus is wasted effort. Second, the imitations stayed detectable, with GPT-4o output flagged as AI by GPTZero nearly 100% of the time. Their summary is that current models still struggle to reproduce nuanced personal styles, especially in informal and stylistically diverse domains.

Note that they didn't test Claude, and they used GPTZero, which may be tuned against GPT-family output. Read the cross-model comparisons carefully.

The practical read: few-shot is worth doing, it plateaus around three to five samples, and it works far better on your structured professional documents than on your personal essays. That maps almost exactly onto which of my own pieces came out sounding like me, which is why [[workflow|my workflow]] keeps AI out of the drafting seat for personal work.

**Negative constraints work partially.** Banning specific words and constructions measurably reduces them. The failure modes are that models substitute un-banned synonyms, and that a banned concept sometimes rebounds. Pangram found that instructing Claude to "acknowledge complexity" just made it overuse "complex."

**Workflow changes are the highest-leverage thing available.** Use AI for structure and research and write the prose yourself. Or draft yourself and have AI edit, which is the safest option for voice. Or have it interview you and assemble your own answers, ideally combined with dictation, since spoken phrasing carries voice better than typed phrasing does.

**Verbalized sampling** is the one genuinely clever prompting result I've seen recently. Zhang et al. trace mode collapse partly to a typicality bias in human preferences and propose asking the model for several responses with explicit probabilities, then sampling from the tails. It increases creative-writing diversity by 1.6 to 2.1 times and recovers about 67% of the base model's pre-alignment diversity without hurting safety, and more capable models benefit more. The prompt is in [[style-prompts]].

**Fine-tuning is the only method that clearly beats the ceiling.** Chakrabarty et al. fine-tuned on individual authors' work and reversed expert judgments. MFA-trained readers preferred the fine-tuned output for stylistic fidelity at an odds ratio of 8.16 and even for quality at 1.87, and the fine-tuned output was flagged as AI 3% of the time against 97% for in-context prompting. Median cost was about $81 per author.

That's a large enough gap that I'd stop pretending prompting is going to close it. I'm not doing it yet, and my trigger conditions for reconsidering are in [[workflow]].

## The two places I'd revise the standard advice

**Burstiness.** Every guide tells you to vary your sentence length because humans vary and AI is uniform. My sentence-length coefficient of variation sits at 0.52 to 0.57 across four corpora spanning six years and two registers, which is stable, and my AI-assisted posts came in higher, not lower. Asking for burstiness gets read as license to chop everything into fragments for emphasis, and four of my seven AI-assisted posts came out with 38 to 51 percent of their sentences under ten words. Measure before you accept this one.

**Consistency over any individual metric.** The thing my AI-assisted drafts most obviously lacked wasn't a specific tic. It was stability. My mean sentence length varies by 2.4 words across everything I've written. Across seven AI-assisted posts written the same year with the same profile loaded, it ranged from 11.3 to 24.7 words, apparently taking its cue from the topic. Whatever "sounds like me" means, a large part of it is sounding the same way about different things.

## Disclosure

Professional norms are formalizing. PRSA's 2025 guidance says to clearly disclose when content is significantly influenced or generated by AI, while allowing that disclosure may not be required where AI supported rather than replaced your thinking and the final product is meaningfully shaped by human input.

For client work, read the contract. For your own writing, I'd treat it as governance rather than guilt, and I'd also point out the selfish argument: publishing the process is how you get corrected. If I hid this, nobody would tell me the burstiness advice was backwards for my corpus.
