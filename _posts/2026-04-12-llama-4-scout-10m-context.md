---
title: "Llama 4 Scout's 10 million-token context window — what changes, and what doesn't"
date: 2026-04-12
tags: [llama, context-window, rag, meta]
read_time: 5
excerpt: "Meta shipped Llama 4 Scout (10M context, MoE) and Maverick (1M context, 128 experts) earlier this month. The context-length number is real. The 'do we still need RAG' question still has the same answer."
---

Meta shipped two **Llama 4** models this month — the headline numbers:

- **Llama 4 Scout** — 17B active / 109B total MoE, 16 experts, **10 million-token context**.
- **Llama 4 Maverick** — 17B active / 400B total MoE, 128 experts, 1M-token context, native multimodal.

Both are open-weight under the Llama Community Licence. Scout's 10M context — supported by a technique called Interleaved RoPE that lets it generalise from a 256K training window — is the largest of any openly available model at launch.

## Two questions everyone asks

**"Is the 10M context real, or marketing?"** Real, in the sense that Scout can be fed and reason over very long inputs. Real-but-caveated, in the sense that performance degrades on the long tail of the window, attention drift is real, and your inference cost scales with input tokens regardless.

**"Does this kill RAG?"** No. Read on.

## Why long-context doesn't replace retrieval

Three things stack against the "stuff everything into the prompt" architecture, even when it's technically possible:

**Cost.** Generating against 8M input tokens costs roughly 8M-tokens-worth of inference. RAG keeps your effective input small (top-K retrieved chunks), and that ratio determines your unit economics. For workloads that run thousands of times an hour, the math doesn't even close.

**Latency.** Time-to-first-token scales with context length. A user-facing query at 1M tokens of context is tens of seconds in. RAG keeps the LLM call fast.

**Recency and update propagation.** A long context is *baked at request time*. RAG is *evaluated at retrieval time*. When your underlying corpus updates, RAG sees the change immediately. Long-context approaches need to re-stuff.

**Access control.** This is the one nobody mentions enough. RAG can apply ACLs at retrieval — the user only ever sees passages they're authorised for. Long-context naively dumps everything in. Solving ACL inside a 10M-token prompt is a problem you don't want.

## Where 10M context *does* change things

**Single-document workflows on huge documents.** Legal corpora, code bases, full books, multi-day audio transcripts. If the entire input is one logical thing the user wants to reason over, the long-context model is the right tool.

**Reduced retrieval engineering for prototypes.** For internal tools and experiments where the corpus is "this one PDF" or "this one repo", you can skip the retrieval stack entirely and ship faster.

**Long-trace agentic workflows.** Agents that maintain extensive history (tool calls, intermediate reasoning) benefit from windows that won't truncate them mid-task.

The thoughtful pattern in 2026 is **RAG for retrieval, long-context for reasoning over the retrieval**. The two compose. They don't replace each other.

---

**Sources:**
- [Meta Llama 4 · llama.com](https://www.llama.com/models/llama-4/)
- [The Llama 4 herd (Meta AI Blog)](https://ai.meta.com/blog/llama-4-multimodal-intelligence/)
- [Welcome Llama 4 Maverick & Scout on Hugging Face](https://huggingface.co/blog/llama4-release)
- [Llama 4 production guide (n1n.ai)](https://explore.n1n.ai/blog/meta-llama-4-scout-maverick-production-guide-2026-04-27)
