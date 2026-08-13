#!/usr/bin/env python3
"""
Stylometric baseline for writing voice.

Measures the metrics that actually discriminated human writing from AI-assisted
writing in my corpus. See content/voice/voice-baseline.md for the findings and
content/voice/measuring-voice.md for what each metric means.

Usage:
    python3 scripts/voice-stylometry.py "Label=path/glob" ["Label2=path/glob" ...]

Examples:
    python3 scripts/voice-stylometry.py "Medium=content/posts/medium/*.md"
    python3 scripts/voice-stylometry.py \
        "Human=content/posts/medium/*.md" \
        "AI=content/posts/compersion.md"

Flags:
    --matches   also print the surrounding text for every antithesis hit,
                so you can check the regex isn't producing false positives
"""
import glob
import os
import re
import statistics as st
import sys

BANNED = """delve delves delving tapestry realm realms landscape testament underscore underscores
underscoring pivotal multifaceted intricate intricacies meticulous meticulously robust seamless
seamlessly leverage leveraging harness harnessing unlock unlocking elevate elevating foster
fostering showcase showcases showcasing navigate navigating crucial crucially comprehensive
commendable notably paramount compelling transformative cutting-edge game-changer utilize
utilizing facilitate facilitates embark embarking myriad nuanced holistic profound profoundly
resonate resonates ultimately furthermore moreover additionally""".split()

CONTRACTIONS = re.compile(r"\b\w+(?:'|’)(?:s|t|re|ve|ll|d|m)\b", re.I)
PROFANITY = re.compile(r"\b(fuck\w*|shit\w*|damn|hell|ass|piss\w*|crap|bitch\w*|bullshit)\b", re.I)
NOT_X_BUT_Y = re.compile(
    r"\b(?:it|this|that|there)?'?s?\s*not\s+"
    r"(?:just\s+|only\s+|merely\s+|simply\s+|about\s+)?[^.;:!?]{2,60}?[,;]?\s*"
    r"(?:it'?s|but|it is|they're|rather)\b",
    re.I,
)
NOT_ONLY_BUT = re.compile(r"\bnot only\b[^.]{0,120}?\bbut\b", re.I)
ABBREV = re.compile(r"\b(?:i\.e|e\.g|etc|vs|Mr|Dr|Ms|St|approx|al|Inc|Ltd|Fig|No|cf)\.", re.I)


def strip_md(text):
    """Remove frontmatter, code, HTML, images, footnotes and link syntax."""
    text = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.S)
    text = re.sub(r"```.*?```", " ", text, flags=re.S)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    # Footnote definitions ("[^5]: source") must go before inline refs.
    text = re.sub(r"^\s*\[\^[^\]]+\]:.*$", " ", text, flags=re.M)
    # Inline footnote refs glue sentences together across the following period,
    # which silently inflates mean sentence length on well-cited pieces.
    text = re.sub(r"\[\^[^\]]+\]", "", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"https?://\S+", " ", text)
    return text


def prose_only(text):
    """Keep prose lines. Headings, bullets, tables and quotes are structure, not voice."""
    keep = []
    for line in text.split("\n"):
        s = line.strip()
        if not s or s.startswith(("#", "-", "*", "|", ">", "1.", "2.", "3.")):
            continue
        keep.append(s)
    return " ".join(keep)


def sentences(text):
    text = ABBREV.sub("X", text)
    return [p for p in re.split(r"(?<=[.!?])\s+", text) if len(p.split()) >= 3]


def paragraphs(md):
    out = []
    for block in re.split(r"\n\s*\n", md):
        keep = [
            l.strip()
            for l in block.split("\n")
            if l.strip() and not l.strip().startswith(("#", "-", "*", "|", ">"))
        ]
        if keep:
            out.append(" ".join(keep))
    return out


def analyze(name, texts, show_matches=False):
    raw = "\n".join(texts)
    md = strip_md(raw)
    prose = prose_only(md)
    words = re.findall(r"[A-Za-z'’-]+", prose)
    nw = len(words) or 1
    sents = sentences(prose)
    lens = [len(s.split()) for s in sents] or [1]
    mean = st.mean(lens)
    sd = st.pstdev(lens)
    low = [w.lower().strip("'’-") for w in words]

    hits = {b: low.count(b) for b in BANNED if low.count(b)}
    total_banned = sum(hits.values())
    paras = paragraphs(md)
    plens = [len(p.split()) for p in paras] or [1]

    per1k = lambda n: round(n * 1000 / nw, 2)
    per10k = lambda n: round(n * 10000 / nw, 1)
    pct = lambda n, d: 100 * n / max(d, 1)

    print(f"\n=== {name} ===")
    print(f"  words {nw:,}   sentences {len(sents):,}   paragraphs {len(paras):,}")
    print(f"  sentence length: mean {mean:.1f}  sd {sd:.1f}  CV(burstiness) {sd / mean:.2f}")
    print(f"    under 10w {pct(sum(1 for l in lens if l < 10), len(lens)):.0f}%   "
          f"over 30w {pct(sum(1 for l in lens if l > 30), len(lens)):.0f}%   longest {max(lens)}")
    # Counted on prose, not raw markdown: an em-dash separating a list item from
    # its gloss is a layout choice, the tell is em-dash-as-connector inside sentences.
    print(f"  em-dash /1k words: {per1k(prose.count(chr(8212)))}"
          f"   (incl. lists/headings: {per1k(md.count(chr(8212)))})")
    print(f"  contractions /1k: {per1k(len(CONTRACTIONS.findall(prose)))}")
    print(f"  1st person (I/me/my/mine) /1k: {per1k(sum(low.count(w) for w in ['i', 'my', 'me', 'mine']))}")
    print(f"  2nd person (you/your/yours) /1k: {per1k(sum(low.count(w) for w in ['you', 'your', 'yours']))}")
    print(f"  profanity /10k: {per10k(len(PROFANITY.findall(prose)))}  "
          f"(raw {len(PROFANITY.findall(prose))})")
    print(f"  ALL-CAPS emphasis /10k: {per10k(sum(1 for w in words if len(w) > 2 and w.isupper()))}")
    print(f"  banned AI words /10k: {per10k(total_banned)}  (raw {total_banned})")
    if hits:
        top = sorted(hits.items(), key=lambda x: -x[1])[:12]
        print(f"    top: {', '.join(f'{k}x{v}' for k, v in top)}")
    n_anti = len(NOT_X_BUT_Y.findall(prose))
    print(f"  'not X, it's Y' /10k: {per10k(n_anti)}  (raw {n_anti})")
    print(f"  'not only...but' /10k: {per10k(len(NOT_ONLY_BUT.findall(prose)))}")
    print(f"  paragraphs: mean {st.mean(plens):.0f}w  median {st.median(plens):.0f}w  "
          f"single-sentence {pct(sum(1 for p in paras if len(sentences(p)) <= 1), len(paras)):.0f}%")

    if show_matches:
        for m in NOT_X_BUT_Y.finditer(prose):
            print(f"      >> ...{prose[max(0, m.start() - 30):m.end() + 40]}...")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    show = "--matches" in sys.argv
    if not args:
        print(__doc__)
        sys.exit(1)

    for arg in args:
        if "=" not in arg:
            print(f"skipping {arg!r}: expected Label=path/glob")
            continue
        label, pattern = arg.split("=", 1)
        paths = sorted(p for p in glob.glob(pattern) if os.path.isfile(p))
        if not paths:
            print(f"\n=== {label} ===\n  no files matched {pattern!r}")
            continue
        texts = []
        for p in paths:
            with open(p, encoding="utf-8", errors="ignore") as f:
                texts.append(f.read())
        analyze(f"{label} ({len(paths)} file{'s' if len(paths) != 1 else ''})", texts, show)


if __name__ == "__main__":
    main()
