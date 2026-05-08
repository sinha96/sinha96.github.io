---
title: "Three frontier-class open releases this month — and why it matters for enterprise"
date: 2026-03-25
tags: [open-source, llama, mistral, gemma, deepseek]
read_time: 4
excerpt: "Mistral Large 3, Gemma 4 (Apache 2.0), and DeepSeek V3.2 all shipped in the past few weeks. The open-weights frontier is no longer a year behind — it's a quarter behind, sometimes weeks."
---

A short note on what landed in the open-weights world this month, and why I think it changes how I'd advise enterprise clients to think about model selection in 2026.

The releases:

- **Mistral Large 3** — 123B parameters, Mistral Research License. Their flagship open-weight model.
- **Google Gemma 4** — four variants under **Apache 2.0**, the most permissive licence in the open-weights stack.
- **DeepSeek V3.2** — 685B total parameters, only 37B activated per token via the MoE routing.
- **Meta's Llama 4** family is days away (more on Scout and Maverick when they land).

Each of these would have been a flagship event a year ago. They're now landing every two-to-four weeks.

## What changes

**The decision criteria for "use a closed flagship vs run our own" have shifted.** A year ago the calculus was *quality first, everything else second*. Today, for most enterprise tasks I see — RAG, summarisation, structured extraction, agent tool-calling against a known schema — a well-tuned 70B-class open model on your own infrastructure is *good enough*. The closed flagships still win on the long tail: complex reasoning, novel coding, multimodal edge cases. Most enterprise workloads aren't on the long tail.

**Data residency stops being a tradeoff.** This is the under-discussed shift. When the open-weights gap is small, "we run it ourselves and nothing leaves our VPC" stops being a compliance compromise and starts being just *the architecture*.

**Mixture-of-Experts has become the default.** Both Mistral and DeepSeek's recent flagships are MoE; Gemma 4 has dense and MoE variants. The "active parameter" number is the one to watch — that's what dictates inference cost and latency, not the headline parameter count.

## My short take

If you're still running your enterprise GenAI workload exclusively on a closed flagship API in 2026 — *for cost-of-inference reasons, or for data-residency reasons* — you're probably leaving real budget and a real architectural option on the table. Run the eval. The gap is smaller than it was even at the start of this year.

---

**Sources:**
- [Best Open-Source LLM in May 2026 (Codersera)](https://codersera.com/blog/best-open-source-llm-2026-llama-4-qwen-3-5-deepseek-v4-gemma-4-mistral/)
- [Open-Source LLM Releases 2026 (Fazm)](https://fazm.ai/blog/open-source-llm-releases-2026)
- [Open-Source LLM Landscape 2026 (Presenc AI)](https://presenc.ai/research/open-source-llm-landscape-2026)
