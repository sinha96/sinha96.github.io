---
title: "Migrating from Gemini 2.5 Flash to 3.5 Flash · what actually changed, and what to touch in your code"
date: 2026-05-21
tags: [gemini, migration, api, flash, google]
read_time: 6
excerpt: "A practical migration note for teams running on 2.5 Flash. What's measurably better in 3.5, what's worse (price), the four config changes you'll have to make, and a checklist for cutting over without breaking your function-calling code."
---

If you have a production workload on `gemini-2.5-flash`, the answer to "should I move?" is almost certainly yes — but the migration is *not* a simple model-ID swap. The Gemini 3.x family changed the thinking config, dropped the classic sampling knobs, and tightened the function-calling contract. Here is what I'd hand a teammate on day one of the cutover.

## What actually got better

Hold the model name fixed at Flash and look at the deltas that matter for a production agent:

- **Coding / agentic workloads jumped substantially.** On Terminal-Bench 2.1, 3.5 Flash hits **76.2%** — and notably *beats Gemini 3.1 Pro* on the agentic suite (Terminal-Bench, MCP Atlas, Finance Agent v2, GDPval-AA). That last one is the headline I keep coming back to: a Flash-tier model out-scoring the previous Pro-tier on agent tasks is not a normal generational jump.
- **Low-reasoning coding** is up **10–20%** over the previous Flash generation. This is the band most production traffic actually sits in.
- **Thinking is now first-class.** `thinking_level` is a string enum (`minimal` → `high`), and `medium` is the new default. The model is tuned for it, and chain-of-thought scaffolding in your prompts is now actively counterproductive — simpler prompts at `medium` beat elaborate CoT at `low`.
- **Thought preservation is on by default.** Multi-turn agentic loops get more coherent across tool calls. Token usage goes up a bit; quality goes up more.

## What got worse

One thing, and it matters: **price.**

- 3.5 Flash: **$1.50 / 1M input**, **$9.00 / 1M output**, **$0.15 / 1M cached input**.
- That's roughly **3× the price of the Gemini 3 Flash Preview** and, per Artificial Analysis's full-benchmark suite, about **5.5× the run cost of the previous Flash** (the increase compounds because thinking-on-by-default eats more output tokens).
- It does sit ~40% below Gemini 3.1 Pro ($2.00 / $12.00), so the *intelligence-per-dollar* picture is still favourable — but if your 2.5 Flash bill was tight, model your new cost before you cut over.

The fix on cost is almost always the same: aggressive prompt caching ($0.15/M cached is the cheapest token Google sells), and `thinking_level: 'minimal'` or `'low'` on routes that don't need reasoning.

## The four code changes you'll actually make

### 1. Model ID

```diff
- model = "gemini-2.5-flash"
+ model = "gemini-3.5-flash"
```

GA, no preview suffix. Available in the Gemini API, AI Studio, Antigravity, the Gemini app, and AI Mode in Search.

### 2. Drop `temperature`, `top_p`, `top_k`

These are no longer recommended on any Gemini 3.x model. The reasoning is tuned for default sampling; passing custom values is a net-negative on most evals I've seen.

```diff
- generation_config = {
-   "temperature": 0.2,
-   "top_p": 0.9,
-   "top_k": 40,
- }
+ # leave sampling at defaults on 3.x
```

If you were using `temperature=0` for determinism, you're going to need a new strategy — usually `thinking_level: 'minimal'` plus a stricter system prompt and schema-constrained output.

### 3. `thinking_budget` → `thinking_level`

The integer budget is gone. Replace it with the string enum.

```diff
- thinking_config = ThinkingConfig(thinking_budget=7500)
+ thinking_config = ThinkingConfig(thinking_level="medium")
```

Mapping I've been using as a starting point (adjust per route):

| Old (`thinking_budget`) | New (`thinking_level`) |
|---|---|
| `0` / disabled | `minimal` |
| `~1k–3k` | `low` |
| `~5k–10k` | `medium` *(new default)* |
| `>10k` | `high` |

Important gotcha if you're coming from `gemini-3-flash-preview` rather than 2.5: the preview defaulted to `high`. 3.5 GA defaults to `medium`. If your eval scores quietly dropped after the model-ID swap, this is almost certainly why — set `thinking_level: 'high'` explicitly to restore the previous behaviour.

### 4. Tighten your `FunctionResponse` parts

The function-calling contract is stricter now. Three requirements you must satisfy or the call will be rejected / hallucinated around:

1. **`id` must match the original `FunctionCall.id`** — you can no longer get away with omitting it.
2. **`name` must match the call's `name`.**
3. **Exactly one response per function call** — no merging, no extras.

```diff
  response_part = Part.from_function_response(
+     id=call.id,
      name=call.name,
      response={"result": tool_output},
  )
```

Two related cleanups while you're in this file:

- **Multimodal tool results:** put media *inside* the function response parts, not as sibling parts.
- **Inline instructions** (the "and now do X with this" trailing nudge): append them to the response text with two newlines, rather than sending them as a separate `Part`.

## Prompt cleanups you'll thank yourself for

3.5 Flash punishes the prompting habits that 2.5 Flash rewarded.

- **Strip explicit chain-of-thought scaffolding.** "Think step by step, first list assumptions, then…" — delete it. Set `thinking_level: 'medium'` (or `'high'`) and let the model do the reasoning natively. I've seen 5–10% accuracy gains from *removing* CoT prompts on 3.5.
- **Shorten system prompts.** The model follows tighter instructions more reliably than 2.5 did; verbosity in the system prompt now correlates negatively with instruction-following on a couple of my internal evals.
- **Use schema-constrained output where you used to coerce JSON in the prompt.** Cheaper, more reliable.

## Caveats and not-yets

- **Computer Use is not supported on 3.5 Flash yet.** If you have a workload using the computer-use surface, stay on Gemini 3 Flash Preview for that specific route. Mixed-model deployments are fine.
- **PDF token usage can go up** at `media_resolution_high`. Video usage typically goes *down*. Re-baseline both before you trust your cost projections.
- **Thought preservation increases output tokens.** Worth it for agent loops; you can opt out per route if you're cost-sensitive on single-turn classification work.

## A migration checklist I'd hand a team

1. Swap the model ID in one non-production route. Run your eval set.
2. Remove `temperature` / `top_p` / `top_k`. Re-run.
3. Convert `thinking_budget` → `thinking_level` using the table above. Re-run.
4. Audit every `FunctionResponse` site: add `id`, verify `name`, ensure 1:1 with the call.
5. Move multimodal tool outputs *inside* the function response part.
6. Delete explicit CoT scaffolding from your prompts; trim system prompts.
7. Re-baseline cost on a representative day of traffic — the price jump is real, prompt caching is your main lever.
8. Canary 5% of production traffic for 48 hours. Watch p95 latency, tool-call error rate, and cost-per-request, in that order.
9. Cut over fully. Leave 3 Flash Preview wired up for any computer-use routes.

The TL;DR: the model is meaningfully better at exactly the workloads most teams are running (agents, tool-use, coding) and the migration is mostly a config-and-prompt cleanup rather than an architectural change. Budget a day for a small team, two days if your function-calling layer is non-trivial.

— Priyanshu

---

**Sources:**
- [Gemini 3.5: frontier intelligence with action (Google Blog)](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/)
- [What's new in Gemini 3.5 — generateContent API (Google AI for Developers)](https://ai.google.dev/gemini-api/docs/whats-new-gemini-3.5)
- [What's new in Gemini 3.5 — Interactions API (Google AI for Developers)](https://ai.google.dev/gemini-api/docs/interactions/whats-new-gemini-3.5)
- [Gemini Developer API pricing (Google AI for Developers)](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini 3.5 Flash — Intelligence, Performance & Price Analysis (Artificial Analysis)](https://artificialanalysis.ai/models/gemini-3-5-flash)
- [Gemini 3.5 Flash — DeepMind model page](https://deepmind.google/models/gemini/flash/)
- [Gemini 3.5 Flash Review: Benchmarks, Price & API (Build Fast With AI)](https://www.buildfastwithai.com/blogs/gemini-3-5-flash-review-benchmarks-price-api)
