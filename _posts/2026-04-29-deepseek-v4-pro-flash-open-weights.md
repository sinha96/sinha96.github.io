---
title: "DeepSeek V4-Pro and V4-Flash — open weights catch the closed frontier"
date: 2026-04-29
tags: [deepseek, open-weights, reasoning, mit-license]
read_time: 5
excerpt: "DeepSeek shipped V4-Pro (1.6T MoE) and V4-Flash (284B MoE) on April 24 under MIT licence. V4-Pro is now the #2 open-weights model on the Artificial Analysis Intelligence Index, behind only Kimi K2.6."
---

DeepSeek dropped two models on April 24, and they matter more than the standard "another open release" framing suggests.

The headline:

- **DeepSeek V4-Pro** — 1.6 trillion parameters total, 49B activated per token (MoE), 1M token context.
- **DeepSeek V4-Flash** — 284B parameters total, 13B activated per token (MoE), 1M token context.
- Both shipped **same-day** as API endpoints AND as open weights under the **MIT licence** on Hugging Face.

MIT. Not a Llama-style "community licence" with monthly-active-user carve-outs — a genuinely permissive licence that allows commercial use, modification, and redistribution.

## Where V4-Pro sits

On the **Artificial Analysis Intelligence Index** for open weights, V4-Pro is now **#2**, behind only Kimi K2.6. On the **GDPval-AA** agentic-real-world-tasks benchmark, V4-Pro Max scored **1554**, beating Kimi K2.6 (1484), GLM-5.1 (1535), GLM-5 (1402), and MiniMax-M2.7 (1514).

Coding-specific: V4-Pro now outperforms most closed flagships on Codeforces, LiveCodeBench, and Terminal-Bench. The "open-weights gap" on coding has effectively closed.

## What this means for enterprise builds

Three concrete shifts I'm thinking about for our roadmap:

**One.** For workloads where the cost-per-token math has been borderline (high-volume RAG, agentic pipelines that burn tokens on tool-calling intermediate steps), V4-Flash on self-hosted infrastructure is now competitive on quality with where Claude Sonnet was twelve months ago. The unit economics shift.

**Two.** For *reasoning-heavy* workloads — Text2SQL on complex schemas, code agents, multi-step plans — V4-Pro is the first open-weights model I'd seriously consider against the closed flagships. The activation count (49B per token) means you can serve it on a node a lot of teams already have provisioned.

**Three.** **MIT licence** changes the conversation in regulated industries. The Llama Community Licence is a non-starter at some financial-services and healthcare clients I've worked with — their legal teams won't sign off. MIT clears that hurdle.

## The caveats

- Inference cost for V4-Pro at full quality is still substantial — that 1.6T total parameter count needs serving infrastructure.
- The model has a recognisable Chinese-language tilt in its training mix, which shows up on culturally sensitive evaluations. Test against your domain.
- Open weights are not the same as *open data* — we still don't have the training corpus.

## The bigger pattern

We're now at the point where every 2–4 weeks, a frontier-class open release lands. Llama 4 in early April. Mistral Large 3 in March. Gemma 4 in April under Apache 2.0. DeepSeek V4 now. The closed-source labs still have the absolute leading edge, but the gap measured in "months until the open model is good enough for this workload" has dropped to single digits for most enterprise tasks.

If you haven't priced an open-weights deployment into your 2026 architecture decisions, do it now.

---

**Sources:**
- [DeepSeek V4 Preview Release · DeepSeek API Docs](https://api-docs.deepseek.com/news/news260424)
- [DeepSeek V4-Pro on Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)
- [DeepSeek is back among the leading open weights models (Artificial Analysis)](https://artificialanalysis.ai/articles/deepseek-is-back-among-the-leading-open-weights-models-with-v4-pro-and-v4-flash)
- [DeepSeek V4 Pro Review 2026 (Codersera)](https://codersera.com/blog/deepseek-v4-pro-review-benchmarks-pricing-2026/)
- [CAISI Evaluation of DeepSeek V4 Pro (NIST)](https://www.nist.gov/news-events/news/2026/05/caisi-evaluation-deepseek-v4-pro)
