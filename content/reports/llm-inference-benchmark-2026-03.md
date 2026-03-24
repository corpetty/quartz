---
title: "LLM Inference Showdown: Fox vs Ollama vs vLLM on Dual RTX 3090"
date: 2026-03-24
tags:
  - reports
  - ai
  - benchmarks
  - llm
  - inference
  - hardware
description: "A thorough benchmark of three LLM inference frameworks on a dual RTX 3090 server. TL;DR: Fox has two confirmed bugs that prevent valid results, vLLM dominates under concurrency, and Ollama wins for single-user workflows."
---

A few days ago a post appeared on r/LocalLLM claiming that [Fox](https://github.com/ferrumox/fox) — a new Rust-based LLM inference engine — achieves 2× Ollama throughput. The claims looked plausible on the surface (PagedAttention, continuous batching, prefix caching), so I ran a proper benchmark on my local machine. Here's what I found.

## Hardware & Setup

**Machine:** bugger — AMD EPYC 7C13 (64 cores), 503 GB RAM, Ubuntu 24.04  
**GPUs:** 2× RTX 3090 (24 GB each, NVLink **not** connected — purely PCIe)  
**CUDA:** 13.0 / Driver 580.126.09  

**Model tested:** Qwen3-14B-Q4\_K\_M GGUF (~8.4 GB)  
For the vLLM comparison: Qwen3-14B-AWQ (same base model, different quantization, ~9.3 GB)  
**Fox:** built from source at [github.com/ferrumox/fox](https://github.com/ferrumox/fox), commit HEAD as of 2026-03-24  
**Ollama:** v0.18.0 (system daemon, `OLLAMA_SCHED_SPREAD=1`)  
**vLLM:** 0.15.1, launched via `bash ~/vllm-srv/start.sh`  

**Benchmark method:** Three workloads per framework, fully isolated (each framework loaded alone with the other unloaded to free VRAM):

1. **Sequential** — 10 requests, one at a time
2. **Concurrent** — 10 requests, 4 in-flight simultaneously
3. **Multi-turn** — 5 conversations × 3 turns each (realistic chat workload)

All requests sent to the OpenAI-compatible `/v1/chat/completions` endpoint. Same prompt for all tests. `max_tokens=200`.

---

## Security Review: What I Found Before Running Anything

Before benchmarking a new binary that auto-starts a server on `0.0.0.0:8080`, I reviewed the source code. The good news: no malicious code, no telemetry, no backdoors. The actual code quality is genuinely solid Rust — the PagedAttention implementation, KV cache, and prefix caching are correctly written.

The security problems are operational:

**CRITICAL — No authentication.** The API server binds `0.0.0.0:8080` with zero auth. Anyone on your network can submit inference requests, pull models, or delete model files.

**HIGH — Wildcard CORS.** `CorsLayer::permissive()` means any webpage in any browser tab can hit the Fox API. If you run Fox locally and visit a malicious site, that site can query your private model.

**MEDIUM — Fake SHA256 verification.** `pull_handler.rs` constructs a "digest" from the filename rather than actually hashing the file. The verification is a no-op.

**MEDIUM — Path traversal partially mitigated.** The DELETE endpoint lists only `.gguf` files, which limits scope, but there's no `canonicalize()` check.

**LOW — `install.sh` downloads a binary without checksum. `/metrics` endpoint is unauthenticated.**

None of these are blockers for personal local use on a trusted network. But I'd be cautious running Fox on any machine with public network access or in a shared environment until upstream fixes the auth gap.

---

## Fox: Two Bugs That Prevent Valid Benchmarks

Before we get to the comparison, I need to document why Fox has no column in the tables below.

### Bug 1: KV cache allocator ignores `--gpu-memory-fraction`

Fox computes KV cache size purely from `max_context_len × model_architecture_constants`, completely ignoring the `--gpu-memory-fraction` flag. For Qwen3-14B at `max_context_len=4096`, Fox tries to allocate **20,480 MiB** for KV alone, regardless of what fraction you specify:

```
ggml_backend_cuda_buffer_type_alloc_buffer: allocating 20480.00 MiB on device 0: cudaMalloc failed: out of memory
alloc_tensor_range: failed to allocate CUDA0 buffer of size 21474836480
llama_init_from_model: failed to initialize the context: failed to allocate buffer for kv cache
Error: llama_init_from_model failed
```

The model itself is ~8.4 GB. You'd need ~29 GB VRAM *just for model + KV* — more than a single 3090. I found the maximum viable context length for this model on a single 3090:

| Context Length | Result | VRAM Used |
|---|---|---|
| 512 | ✅ OK | ~10.5 GB |
| 1024 | ✅ OK | ~14.8 GB |
| 2048 | ✅ OK | ~20.0 GB |
| 3072 | ❌ OOM | Tried 15,360 MiB KV alone |

Benchmarking at 2048-token max context is technically possible, but it's not a fair comparison — Ollama and vLLM operate at 8192+ tokens by default.

### Bug 2: Segfault during inference

Even with `max_context_len=2048` (which loads successfully and shows "listening"), Fox crashes with a segfault on the first real inference request:

```
/tmp/fox-analysis/target/release/fox(+0x7694208)[...]
/tmp/fox-analysis/target/release/fox(+0x759f11d)[...]
...
/lib/x86_64-linux-gnu/libc.so.6(+0x9caa4)[...]
```

This happened consistently across multiple model formats and context lengths. The segfault occurs in the model execution path, not startup. I was unable to get a single successful inference response from Fox.

**Summary:** Fox's claimed "2× Ollama throughput" cannot be reproduced on this hardware. The KV allocator bug and inference segfault are blockers. I've [opened an issue upstream](https://github.com/ferrumox/fox).

*Note: Fox's own benchmarks used an RTX 4060 with Llama-3.2-3B (a much smaller model). The 4060 has 16 GB VRAM vs 24 GB on the 3090, and 3B vs 14B is a completely different regime. It's possible Fox works correctly on smaller models.*

---

## Ollama vs vLLM: The Real Benchmark

With Fox unable to run, the comparison is Ollama (v0.18.0, SCHED_SPREAD across both GPUs) vs vLLM (0.15.1, single GPU, PagedAttention). Both tested with Qwen3-14B — same base model, Ollama uses GGUF Q4\_K\_M, vLLM uses AWQ.

### Sequential (10 requests, 1 at a time)

| Metric | Ollama (dual GPU) | vLLM (single GPU) | Winner |
|---|---|---|---|
| TTFT P50 | 170 ms | **27 ms** | vLLM 6.3× faster |
| TTFT P95 | 190 ms | 50 ms | vLLM |
| Latency P50 | 2,786 ms | **1,104 ms** | vLLM 2.5× faster |
| Tok/s | 71.0 | **76.8** | vLLM +8% |

### Concurrent (10 requests, 4 in-flight)

| Metric | Ollama (dual GPU) | vLLM (single GPU) | Winner |
|---|---|---|---|
| TTFT P50 | 7,896 ms | **37 ms** | **vLLM 213× faster** |
| TTFT P95 | 8,087 ms | 38 ms | vLLM |
| Latency P50 | 10,505 ms | **1,122 ms** | vLLM 9.4× faster |
| Throughput (tok/s) | 74.8 | **252.6** | **vLLM 3.4× faster** |

### Multi-turn Chat (5 conversations × 3 turns)

| Metric | Ollama (dual GPU) | vLLM (single GPU) | Winner |
|---|---|---|---|
| TTFT P50 | 7,935 ms | **52 ms** | vLLM 153× faster |
| TTFT P95 | 22,141 ms | 61 ms | vLLM |
| Latency P50 | 9,907 ms | **818 ms** | vLLM 12× faster |
| Tok/s | 11.3 | **71.3** | vLLM 6.3× faster |

---

## Analysis

### Why the gap is so large under concurrency

Ollama's architecture **serializes requests**. When 4 requests arrive simultaneously, Ollama queues them and processes them one at a time. Request 4 doesn't start until requests 1–3 are finished. This is why TTFT explodes to 7–8 seconds at 4-way concurrency — you're measuring queuing delay, not inference speed. Single-user Ollama is fast; multi-user Ollama is a bottleneck.

vLLM's **PagedAttention** batches concurrent requests together into a single forward pass. Requests 1–4 literally compute simultaneously on the same hardware. That's why P95 TTFT stays at 38 ms even under 4-way concurrency — there's essentially no queue.

### Why Ollama is still the right tool for solo use

For a single person running local inference — interactive chat, coding assistant, occasional API calls — Ollama is the right choice. It's trivial to set up, maintains a persistent model daemon (`KEEP_ALIVE=24h`), handles model management cleanly, and delivers ~71 tok/s sequential throughput on this hardware. The user experience is excellent.

The 6× TTFT disadvantage (170 ms vs 27 ms) is imperceptible in conversation. The 2.5× latency gap means 2.8 seconds vs 1.1 seconds for a ~200-token response — noticeable but not painful.

### When vLLM matters

vLLM becomes necessary the moment you have concurrent users or latency-sensitive workloads. The 213× TTFT advantage at 4-way concurrency isn't just a benchmark number — it's the difference between a usable API and one that feels broken. If you're building an application that multiple people use simultaneously, or running automated pipelines that batch requests, vLLM is in a completely different league.

The tradeoff: vLLM requires more setup, doesn't manage models, needs explicit launch scripts, and consumes VRAM even when idle. On this machine, I use Ollama as the always-on daemon and launch vLLM manually when I need it (`bash ~/vllm-srv/start.sh`).

### A note on "fair" comparisons

Ollama ran on both GPUs (~8.8 GB VRAM each with `SCHED_SPREAD=1`). vLLM ran on one GPU (~20 GB). Different quantization methods (GGUF Q4\_K\_M vs AWQ). Same base model, same parameter count.

This isn't a perfectly controlled comparison — but it reflects the real-world choice on this hardware. You could run both Ollama and vLLM in a single-GPU configuration for a purer test; the TTFT gap would shrink somewhat for Ollama, but the concurrency gap would remain fundamental since it's architectural, not hardware-dependent.

---

## The Dual-GPU Fox Data (for completeness)

Before discovering the inference segfault, I did collect some Fox numbers using the 35B model with Ollama running simultaneously — this was an **unfair test** (Fox and Ollama were competing for VRAM). I'm including it for transparency, but these should not be taken as valid Fox performance numbers.

*Model: qwen3.5-uncensored:35b-iq4xs GGUF (both frameworks, dual GPU)*  
*Caveat: Ollama had ~25 GB loaded during Fox tests. Not an isolated comparison.*

| Workload | Ollama TTFT P50 | Fox TTFT P50 | Ollama Tok/s | Fox Tok/s |
|---|---|---|---|---|
| Sequential | 305 ms | 147 ms | 58.5 | 46.0 |
| Concurrent (4×) | 6,595 ms | 565 ms | 83.4† | 46.8† |
| Multi-turn | 424 ms | 214 ms | 77.5 | 45.1 |

†wall-clock throughput, not per-request

Fox did show a TTFT advantage in this (unfair) test — 2× faster first-token latency. But Ollama won on throughput, likely because `SCHED_SPREAD=1` leverages both GPUs more efficiently than Fox on this non-NVLink setup. The Fox claim of "2× throughput" is backwards on this hardware; if anything it's 2× faster TTFT at the cost of lower throughput.

Again: take these numbers with a big grain of salt given the non-isolated conditions.

---

## Recommendations

**For local personal use:** Ollama. It just works, the model management is excellent, and 71 tok/s is plenty for interactive use.

**For any multi-user or API workload:** vLLM. The concurrency gap is 2–3 orders of magnitude in TTFT; there's no contest.

**Fox:** Not yet. The KV allocator bug and inference segfaults make it unusable on this hardware. The underlying architecture (PagedAttention in Rust over llama.cpp FFI) is interesting, and if the bugs get fixed it might be worth revisiting on smaller models. Star the repo and check back in a few months.

---

## Methodology Notes

- All tests run with the model pre-loaded (warm). Warmup request sent before timing.
- Same prompt used across all tests: *"Explain the difference between TCP and UDP in 3 sentences."*
- `max_tokens=200`, `temperature=0`
- Ollama: `think: false` injected via local proxy (see note below)
- vLLM: default inference settings, hermes parser
- TTFT = time from request send to first token received
- Tok/s = output tokens generated ÷ total response duration (not wall-clock throughput)
- Throughput = total tokens across all requests ÷ wall-clock time (concurrent tests only)

**Ollama think-mode note:** `qwen3.5-uncensored:35b-iq4xs` generates reasoning tokens (`<think>...</think>`) by default and ignores `think: false` in the API body. To prevent this from consuming the token budget, I run a local proxy on port 11435 that injects `"think": false` at the request level. Without this, Ollama "thinks" for 300–4800 chars before any visible output, which artificially inflates latency. The 14B GGUF model used in the main benchmark doesn't have this issue.

All benchmark scripts available at: [github.com/corpetty/quartz](https://github.com/corpetty/quartz) (reports section).

---

*Posted on the r/LocalLLM thread: https://www.reddit.com/r/LocalLLM/comments/1s2753y/*
