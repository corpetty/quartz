---
title: "Sources: Writing Voice"
description: "Every study and claim cited across this section, organized by where it appears, with an explicit note on which ones I've verified and which ones I haven't."
tags:
  - sources
  - voice
---

Sources for the claims in [[why-ai-sounds-like-ai]] and [[voice-baseline]].

> [!WARNING] Verification status
> The citations below came out of a research report compiled with AI assistance. **I have not independently verified most of them.** Per my own [step 11](../posts/writing-with-ai), that verification is outstanding work, and I'm publishing this with the gap marked rather than quietly implying I've done it.
>
> The arXiv identifiers and the peer-reviewed papers are the ones I'd trust most and the easiest to check. The journalism claims, particularly the specific counts attributed to the Washington Post and Barron's and the Atlantic piece, are the ones I'd check first, because quantitative claims quoted secondhand from news coverage are exactly where numbers drift.
>
> Anything sourced to a detection vendor should be read as marketing-adjacent by default.
>
> Everything in [[voice-baseline]] is different. Those numbers I generated myself with [a script you can run](measuring-voice), and you should check them by running it rather than by trusting me.

---

## The measured dialect

**Claim:** Analysis of 15M+ PubMed abstracts (2010-2024) using an "excess vocabulary" method found an abrupt post-ChatGPT surge in style words, estimating at least 13.5% of 2024 abstracts were LLM-processed, reaching ~40% in some subcorpora. Of 2024 excess words, 66% were verbs and 18% adjectives. "Delves" ran ~28x expected frequency, "underscores" ~10.9x, "showcasing" ~10.2x.

**Source:** Kobak, D., et al. "Delving into LLM-assisted writing in biomedical publications through excess vocabulary." *Science Advances* 11(27):eadt3813, 2025.

- DOI: 10.1126/sciadv.adt3813
- Preprint: [arXiv:2406.07016](https://arxiv.org/abs/2406.07016)
- Word list, MIT licensed: `berenslab/llm-excess-vocab` on GitHub

*Status: peer-reviewed, preprint and data are public. Highest-confidence item in this list.*

**Claim:** "Complex and multifaceted" appears 700x more often in AI writing than human writing; "intricate interplay" 100x; "played a crucial role" 70x.

**Source:** Pangram Labs, analysis of their own detection corpus.

*Status: unverified, and it's a detection vendor describing its own proprietary corpus. Directionally plausible, not independently checkable.*

**Claim:** "Delve" and "underscore" co-appeared in 96.5% of all articles ever to contain both, within 2023-2024 alone.

**Source:** Independent analysis cited in the research report. Original not identified.

*Status: unverified, no primary source. Treat as anecdote.*

---

## The antithesis construction

**Claim:** The Atlantic (July 2026) called "it's not X, it's Y" the most famous and most mysterious AI tic.

*Status: unverified.*

**Claim:** A Washington Post dataset found variants of "not just X, but Y" in about 6% of all chatbot messages in a July sample.

*Status: unverified. Check the sampling methodology before citing this number anywhere that matters.*

**Claim:** Barron's counted the construction in Fortune 500 filings rising from ~50 in 2023 to over 200 in 2025.

*Status: unverified.*

**Claim:** OpenAI's product manager for model behavior, Laurentia Romaniuk, calls the pattern "contrastive phrasing" and has said the company is working to broaden the model's repertoire.

*Status: unverified, attributed to public statements.*

---

## Training mechanics

**Claim:** RLHF generalizes better than supervised fine-tuning but significantly reduces output diversity across a variety of measures, implying a generalization-versus-diversity tradeoff.

**Source:** Kirk, R., et al. "Understanding the Effects of RLHF on LLM Generalisation and Diversity." ICLR 2024.

- [arXiv:2310.06452](https://arxiv.org/abs/2310.06452)

*Status: peer-reviewed conference paper, unverified by me but easily checkable.*

**Claim:** Human preference data systematically favors responses matching user views over accurate ones, and sycophancy is a general behavioral property of RLHF-trained models.

**Source:** Sharma, M., et al. (Anthropic). "Towards Understanding Sycophancy in Language Models." ICLR 2024.

- [arXiv:2310.13548](https://arxiv.org/abs/2310.13548)

*Status: peer-reviewed, unverified by me.*

**Claim:** First systematic evaluation of format bias finds significant bias across state-of-the-art LLMs toward list, wrapping, and mapping formats.

**Source:** Do Xuan Long, et al. "LLMs Are Biased Towards Output Formats!"

- [arXiv:2408.08656](https://arxiv.org/abs/2408.08656)

*Status: unverified.*

**Claim:** Claude's constitution (~23,000 words, updated January 2026) prioritizes being broadly safe, broadly ethical, compliant, and genuinely helpful, in that order.

**Source:** Anthropic, published constitution.

*Status: unverified as to length and date. The document is public and this one is trivially checkable.*

---

## Style imitation and its ceiling

**Claim:** Six LLMs tested across 40,000+ generations imitating 400+ real authors in four domains. Authorship verification reached ~95-97% on news and ~96% on email, but dropped to 50-66% on forums and 17-21% on blogs. Going from 2 to 10 writing examples affected the metrics very little. GPT-4o and GPT-4o-mini outputs were flagged as AI by GPTZero nearly 100% of the time.

**Source:** Wang, et al. "Catch Me If You Can? Not Yet." Stony Brook, 2025.

- [arXiv:2509.14543](https://arxiv.org/abs/2509.14543)

*Status: unverified. Two caveats the paper itself raises and that I'd repeat: Claude was not among the models tested, and GPTZero may be optimized against GPT-family output, which would bias the cross-model detection comparisons.*

**Claim:** Fine-tuning on an author's work reversed expert judgments. MFA-trained readers favored the fine-tuned output for stylistic fidelity (odds ratio 8.16) and for quality (OR 1.87). Fine-tuned outputs were flagged as AI 3% of the time versus 97% for in-context prompting. Median cost ~$81 per author.

**Source:** Chakrabarty, T., Ginsburg, and Dhillon. Stony Brook / Columbia / University of Michigan.

- [arXiv:2510.13939](https://arxiv.org/abs/2510.13939)

*Status: unverified. This is the single most consequential claim in the section, since it's the basis for saying prompting has a ceiling that fine-tuning clears. Worth verifying before acting on it.*

**Claim:** Verbalized sampling, prompting for several responses with explicit probabilities and sampling from the tails, increases creative-writing diversity 1.6-2.1x and recovers 66.8% of the base model's pre-alignment diversity without sacrificing safety.

**Source:** Zhang, et al. "Verbalized Sampling: How to Mitigate Mode Collapse and Unlock LLM Diversity."

- [arXiv:2510.01171](https://arxiv.org/abs/2510.01171)

*Status: unverified.*

---

## Stylometry

**Claim:** A study using Burrows' Delta on hundreds of short stories found AI models produce compact, predictable styles while human writing remains more varied and idiosyncratic.

**Source:** Dr. James O'Sullivan, University College Cork.

*Status: unverified.*

**Claim:** Clear stylistic clusters separate human text from GPT-3.5, GPT-4, and Llama output.

**Source:** *Humanities and Social Sciences Communications* (Nature portfolio).

*Status: unverified, specific paper not identified.*

---

## Detection

**Claim:** Reported ranges of ~80-100 perplexity units for human writing against ~20-30 for GPT-4 output, and human burstiness spread of 0.6-1.2 against GPT clustering at 0.2-0.4. GPTZero pioneered both metrics but moved to a deep-learning classifier in autumn 2023 and no longer relies on them directly.

**Source:** Vendor documentation and secondary coverage.

*Status: unverified and explicitly marketing-adjacent. I cite these only to say they shouldn't be relied on.*

---

## Claude-specific features

**Claim:** Custom Styles launched November 26, 2024, generating ~3 sentences of style instructions plus examples from uploaded samples. Pangram found the auto-generated examples are generated rather than excerpted and read as generic against the source. Memory rolled out to all accounts in early March 2026. Styles are migrating into Skills.

**Source:** Anthropic product announcements and Pangram commentary.

*Status: unverified, and this category ages fastest. Check current behavior rather than trusting any of it.*

---

## Disclosure norms

**Claim:** PRSA's 2025 guidance states: "Clearly disclose when content, decisions, or interactions are significantly influenced or generated by AI," while allowing that "if AI is used to support, not replace, your thinking and the final product is meaningfully shaped by human input, disclosure may not be required."

**Source:** Public Relations Society of America, "Promise & Pitfalls: The Ethical Use of AI for Public Relations Practitioners," 2025.

*Status: unverified quotation.*

---

## My own measurements

Everything in [[voice-baseline]] was generated by `scripts/voice-stylometry.py` in [this repo](https://github.com/corpetty/quartz), run over:

- **Medium archive:** `content/posts/medium/*.md`, 25 files, 22,166 words, published 2016-2019
- **writing-to-think:** `content/posts/writing-to-think.md`, 824 words, 2022
- **Notes:** `content/notes/*.md`, 31 files, 4,974 words
- **Professional register:** [What is a security audit, when you should get one, and how to prepare](https://our.status.im/what-is-a-security-audit-when-you-should-get-one-and-how-to-prepare/), Status blog, February 2021, 4,439 words
- **AI-assisted corpus:** 7 posts published in 2026, 15,044 words

Known methodological limits are documented in [[measuring-voice]]. The one that bit me during this analysis, inline footnote markers preventing sentence splits and inflating mean sentence length on heavily cited posts, is fixed in the script and described in [[voice-baseline]].

If you run it and get different numbers, [tell me](../contact).
