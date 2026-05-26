---
title: "SubQ · the 12-million-token context window, and the architecture story of the month"
date: 2026-05-26
tags: [architecture, long-context, attention, subq]
read_time: 5
excerpt: "A Miami startup nobody had heard of three weeks ago shipped a 12M-token context window on a sparse subquadratic attention architecture, claims 52x speedup over FlashAttention at 1M tokens, and priced it at roughly a fifth of Opus or GPT-5.5. The catch: no paper, no weights, and a graveyard of similar claims behind them."
---

I've been meaning to write about **SubQ** since the launch on May 5th. Three weeks in and I still don't know what to make of it, which is partly why it deserves a post.

## What they shipped

**Subquadratic** — a Miami-based startup founded by Justin Dangel (CEO) and Alex Whedon (CTO, ex-Head of Generative AI at Meta) — launched out of stealth with a $29M seed (Justin Mateen, plus early Anthropic / OpenAI / Stripe / Brex investors) and a model called **SubQ**.

The numbers, as stated:

- **12 million token context** in the research configuration. 1M tokens in the production API.
- New attention mechanism called **Subquadratic Sparse Attention (SSA)**. Scales linearly with context length, not quadratically.
- **~1,000x cheaper attention compute** at 12M tokens vs full self-attention.
- **~52x faster than FlashAttention** at 1M tokens.
- Priced at roughly **one-fifth** of Claude Opus or GPT-5.5 for comparable workloads.

If those numbers hold even directionally, the long-context economics of LLMs flip this year. A 12M-token window at production API economics is the kind of thing that makes RAG look like a workaround for a problem that no longer exists in the specific domain SubQ targets.

## What SSA actually does, roughly

The shape of the idea (from the blog posts, since there's no paper yet): instead of computing every-token-attends-to-every-token softmax, the model **selects a sparse subset of "relevant" tokens** per query and computes attention only within that subset. The selection mechanism is learned. The sparsity is structural — it's not a post-hoc top-k on a full attention matrix, it's a different operator entirely.

The compute claim ("1,000x at 12M") is consistent with what you'd expect from going from O(n²) to something close to O(n·k) where k is the selected subset size and stays roughly constant in n. That math is well-trodden. The novelty, if there is one, is not the asymptotic — Mamba, RWKV, RetNet, DeepSeek's sparse attention all have favourable asymptotics — it's whether SSA actually *trains* to frontier quality without the silent degradations that have killed every previous subquadratic candidate at scale.

That's the open question. And it stays open until they publish.

## The reasons to be sceptical

Three, and they're heavy:

**1. No technical report.** Three weeks in, no paper. Marketing materials, a demo, an API. The reason this matters is that the long-context evaluation literature is full of models that report stellar numbers on synthetic needle-in-a-haystack tasks and collapse on anything that requires actual multi-document reasoning at depth. Without an eval breakdown — RULER, LongBench v2, the multi-hop variants — we cannot tell which side of that line SubQ lives on.

**2. No open weights.** Hard to externally verify the 52x-vs-FlashAttention claim without a reference implementation. The 1,000x number is a theoretical attention-compute reduction. The 52x number is the one I'd want to bench against actual hardware. Without weights, we can't.

**3. The graveyard.** Mamba. RWKV. RetNet. Hyena. DeepSeek Sparse Attention. Every one of these had a compelling theoretical story. Every one of them has, so far, failed to displace dense transformers at frontier scale — not because the asymptotics are wrong, but because something subtle in the training dynamics, gradient flow, or in-context-learning behaviour degrades as you push the architecture harder. The base rate on "subquadratic architecture eats the transformer's lunch" is, at this point, *very low*.

## The reasons to take it seriously anyway

Three, and they're not light either:

**1. Whedon's pedigree.** Running generative AI at Meta is not the kind of role you take a flier from. The bench is real.

**2. The investor list.** Early-Anthropic and early-OpenAI cheques didn't go into this without diligence on the architecture. They've seen the internal benchmarks. That's not proof — it's not a paper — but it raises the prior.

**3. The pricing.** A startup that doesn't have the compute to bench-fake a frontier-quality model at a fifth of Opus pricing tends not to put that pricing in market. If the unit economics work, the architecture works. If the unit economics don't work, the company runs out of cash on the demo. Either way, we'll know within two quarters.

## What I'm going to do about it

Use it. The API is live. I have a long-document workload — research paper synthesis across 40-80 papers — that's been a forcing function for whichever model can hold the corpus in working memory without RAG. Claude Opus 4.7 at its 1M context is the current champion. SubQ at production-1M is the obvious A/B.

If SubQ holds on a real workload, I'll be the first to write a follow-up.
If it doesn't, I'll be the first to write that one too.

The architecture story of May is that someone shipped a real production API at 1M tokens on a non-transformer attention operator. Whether the architecture story of 2026 is the same one depends entirely on the paper that should have shipped three weeks ago.
