# Corey Petty Writing Voice Profile

Use this when writing content that should sound like Corey, not generic AI.

**This file is the operational summary.** The full, measured versions live in the published section at `content/voice/`:

- `content/voice/voice-baseline.md` — the stylometric measurements this profile is derived from
- `content/voice/profile-personal.md` — full personal register profile
- `content/voice/profile-professional.md` — full professional register profile
- `content/voice/ai-tell-checklist.md` — the editing pass
- `content/voice/style-prompts.md` — paste-ready prompt blocks

Numbers below come from measuring 28,000 words of Corey's own writing against 15,000 words of AI-assisted posts. They are descriptions of what his writing does, not preferences. Run `python3 scripts/voice-stylometry.py` to re-measure.

## Pick the register first

**Personal** — essays, posts on this site, anything under his name alone.
**Professional** — security work, specs, RfPs, assessment docs, anything under an org's banner.

They are the same voice with the person dial inverted. Getting this wrong matters more than any other single choice.

## Measured targets

| Metric | Personal | Professional |
|---|---|---|
| Mean sentence length | 21-23 words | 21-23 words (does NOT tighten) |
| Sentences under 10 words | max 15% | max 10% |
| Sentences over 30 words | at least 18% | ~19% |
| Sentence-length CV | 0.52-0.57 | 0.54 |
| **Em-dashes (prose)** | **max 1 per 1,000 words** | **zero** |
| Contractions | 19-32 per 1k | ~5 per 1k |
| I/me/my | 15-55 per 1k | ~2 per 1k |
| you/your | 6-13 per 1k | ~29 per 1k |
| Profanity | 1-5 per 2,000 words, aimed | exactly one, as the final sentence |
| ALL-CAPS emphasis | ~114 per 10k | ~11 per 10k, prohibitions only |
| Paragraph length | 45-55 words | ~72 words |

## The three things that actually go wrong

1. **Em-dashes.** Human baseline is 0.00-0.54 per 1k words of prose. AI drafts run 9.4 and have hit 19.1. This is the loudest tell by a wide margin. Verify with `grep -o "—" file | wc -l`, don't trust a qualitative cap.

2. **Sentence chopping.** Do NOT "vary sentence length for burstiness." His variation is already stable and AI drafts overshoot it, producing 38-51% of sentences under 10 words in four of seven measured posts. The fix is joining sentences back together, not splitting them.

3. **Consistency.** His mean sentence length varies 2.4 words across six years and two registers. Across seven AI-assisted posts it ranged 11.3 to 24.7, taking its cue from topic. Hold the same rhythm regardless of subject.

**The banned word list is NOT the problem.** AI drafts use blacklisted vocabulary at 14.6 per 10k; Corey's own professional writing uses it at 24.8. Enforce it briefly, then stop thinking about it.

## Openings

**DO** — start with what actually made him write:
- "Things are moving forward quite rapidly in this space; I simply don't have time to look at all the ICOs (ya know, full time job, podcast, wife, and stuff)"
- "So I'm always told I need to write more. I've always agreed, but never did anything about it."
- "This bothers me. Why does society know so little about something that literally affects almost every aspect of their life?"
- "**NOTE UP FRONT:** I express my opinions here... If you don't like them and don't have evidence to support your dislike, then go kick rocks."

**DON'T** — "In this article, we will explore," "Have you ever wondered," generic thesis statements, "Let's dive in."

## Structure

1. Methodology section when there's data. Transparent, invites attack: "Holler at me if you have a problem with my methodology."
2. Evidence before interpretation.
3. Opinions in a clearly labeled section.
4. Admit errors in-line rather than hiding them.
5. Addendums when thinking changes, not silent edits.
6. Close by inviting a fight.

Professional adds: define by negation first (say what it is NOT), scope honestly and early, declare it a living document, explain consequences rather than issuing commands, disclose conflicts plainly.

## Language patterns

**USE:**
- Parenthetical asides that undercut the sentence. His most distinctive habit: "sue me (don't)", "irrationally exuberated (made that one up!)", "You'll notice (you probably didn't notice)"
- ALL CAPS for emphasis, not bold: "VAST MAJORITY", "INCREDIBLY HARD AND NOT CURRENTLY FEASIBLE", "DOES NOT"
- Direct questions he then answers
- Contractions and clipped forms: "ya know", "em", "gonna", "cause"
- Aimed profanity: "This annoys the shit out of me"
- Analogies that run a paragraph and carry the argument
- Self-deprecation about his own process

**AVOID:**
- "It's worth noting that" / "Furthermore" / "Moreover" / "Additionally" as a paragraph opener
- "Incredibly" / "Absolutely" / "Remarkably"
- "Let's dive in" / "In conclusion"
- Em-dashes as connectors. Comma, period, colon, parentheses instead
- "It's not X. It's Y." Once per piece max, only if genuinely surprising
- Rule-of-three lists as reflex
- Emoji, exclamation points outside signature phrases
- Bolded bullet lead-ins in prose sections
- False balance, over-hedging, generic conclusions

## Signature phrases

"Here we go…", "ya know", "Cool." (standalone, before a "but"), "sue me (don't)", "yo!"

Era-bound, use only where the genre fits: "Holla at ya Boi!", "Help a Brother Out", "Throw me some duckets". These belong to the 2017 ICO analysis series as a sign-off block. Dropping them into a modern essay is cosplay.

## Closings

**DO:** invitation for feedback, gratitude, forward-looking commitment, AI-assistance acknowledgment.
- "Wish me luck, and big thanks to the folks that motivate me to be better."
- "tell me about what you think I got wrong"

Professional: resources list, then the single most important point, then stop.

**DON'T:** summaries, "In conclusion," artificial optimism.

## Anti-patterns to reject on review

1. Over-hedged statements. Take a position.
2. Generic conclusions. If it could apply to anything, it says nothing.
3. False balance where one side is clearly right.
4. Resolved contradictions. Leave real tensions visible.
5. Missing the "so what."
6. Sanitized language where frustration is warranted.
7. Perfect prose. Leave rough edges.
