-----

## layout: post
title: “From Llama 3.3 to DeepSeek V4-Flash — a field report”
date: 2026-05-14
description: >
We moved an enterprise client’s RAG stack from Llama 3.3 70B to DeepSeek V4-Flash
last quarter. Here’s what actually changed, what surprised us, and what stayed
exactly the same.
tags: [llama, deepseek, rag, enterprise, deployment]
reading_time: 6

We moved an enterprise client’s RAG stack from Llama 3.3 70B to DeepSeek V4-Flash last
quarter. I’ve been meaning to write this up properly since the migration closed.
Here it is.

-----

## The setup

The client runs a document-heavy internal knowledge platform — legal, compliance, and
operational documents spread across S3, SharePoint, and an internal wiki. Roughly 2.1
million chunks in OpenSearch. Hybrid BM25 + kNN retrieval, cross-encoder re-ranking
before inference, document-level ACL enforcement at query time.

They were on **Llama 3.3 70B** — the dense 70B, self-hosted on four A100s on AWS EKS.
It had been stable for about eight months. The prompt-to-first-token latency sat around
**1.8–2.2 seconds** under normal load, spiking to 3.8s during peak. Accuracy on their
evaluation set — a curated 600-question benchmark across document types — was at **81.4%**.
Good enough to ship, not good enough to stop looking.

The reason to move wasn’t dissatisfaction with Llama 3.3. It was the MIT licence on
DeepSeek V4-Flash, the published numbers, and the fact that the 284B MoE architecture
fits on the same hardware budget as the 70B dense model in active-parameter terms. We
had a window. We ran the evaluation. We migrated.

-----

## What changed

### 1. Inference latency dropped — but not the way I expected

The first thing everyone asks about MoE at inference time is routing overhead. My mental
model going in was: *the active-parameter count is lower, so generation should be faster,
but the routing step adds a tax and the total weight on disk means more I/O*.

What actually happened: **prompt-to-first-token improved to 1.1–1.4s** under the same
load profile. Generation throughput on long completions was roughly flat. The routing
overhead is real but it’s dwarfed by the reduction in compute for the active parameters.
Peak-load spikes flattened — the worst P99 we saw post-migration was 2.1s, versus 3.8s
before. The memory bandwidth pressure shifted: less pressure on compute, more on memory
for the expert weight pages. On A100s with NVLink that’s a fine trade.

**What this meant for the client:** their UI team had been throttling streaming responses
to hide the latency. They turned that off. Small thing. Noticeable.

### 2. Reasoning quality on multi-hop queries improved meaningfully

This is the one I’ll caveat the hardest, because it’s benchmark-specific and your mileage
will vary with your domain. On the client’s 600-question eval set, **accuracy went from
81.4% to 87.1%**. The gain was concentrated almost entirely in the multi-hop
questions — queries that require synthesising information from two or more retrieved
chunks rather than extracting a single fact.

My working theory: the MoE architecture at 284B total parameters, even at a fraction of
active parameters, seems to carry richer associative capacity for chaining inferences.
The single-hop extraction questions barely moved (81.1% → 82.3%). The multi-hop
questions moved a lot (79.6% → 88.7%).

If your workload is primarily extraction — “what does clause 4.2 say” — the gain will
be modest. If it involves synthesis — “compare the indemnity provisions across these
three contracts” — the gain is real.

### 3. Context utilisation got better, and that required a prompt adjustment

Llama 3.3 70B has a 128K context window. V4-Flash has the same. But empirically — and
this matches what others have reported — V4-Flash uses the far end of long contexts more
reliably. The classic “lost in the middle” degradation is less pronounced.

This mattered for us because our re-ranker was passing the top-8 chunks as context, and
we had tuned the ordering specifically to front-load the most relevant chunks to
compensate for Llama 3.3’s middle-context weakness. With V4-Flash, that front-loading
became unnecessary — and actually slightly hurt performance because the model was now
attending to all eight chunks more evenly, and our ordering had baked in an assumption
it shouldn’t.

**We reordered the re-ranked chunks to a more neutral, document-flow order** and accuracy
on long-context multi-chunk queries improved another 1.2 points. Small, but it illustrates
the point: migrating the model is not just a swap. The model’s context behaviour is part
of your retrieval architecture.

### 4. Cost changed

The self-hosted maths shift because the active-parameter count drops while the total
weight on disk rises. On our hardware setup, the net effect was roughly **22% reduction
in GPU compute cost per query**, offset partially by marginally higher memory bandwidth
utilisation. Overall the client’s inference cost per 1,000 queries dropped. Not
dramatically, but enough that the migration paid for itself in infrastructure terms inside
two billing cycles.

If you’re running on spot instances or preemptible VMs, the larger checkpoint size means
cold-start time goes up. That’s a real cost on spiky traffic profiles.

-----

## What didn’t change

### 1. RAG is still necessary. Completely.

Every few months the “do we still need RAG with a long-context model” question comes back
around. The answer is still the same. The 128K window isn’t your corpus. The client has
2.1 million chunks. Retrieval isn’t optional.

More importantly: retrieval is where **access control lives**. The ACL-filtered retrieval
step is what ensures a user in the finance team doesn’t get chunks from legal documents
they’re not permitted to read. No context window size changes that. RAG isn’t a workaround
for small context windows. It’s the architecture that makes ACL-aware LLM responses
possible at enterprise scale.

### 2. Prompt discipline matters as much as it ever did

V4-Flash is a better model. It is not a more forgiving model. Sloppy system prompts
that got away with vague instructions under Llama 3.3 didn’t suddenly start working.
If anything, the increased reasoning capacity meant V4-Flash was more likely to notice
ambiguities and hedge, where Llama 3.3 would sometimes just pick the most plausible
interpretation and proceed.

We spent about a week on prompt regression. Four prompts that had been stable needed
revision. Two of them were genuinely underspecified — the model was right to hedge, and
the fix was to be clearer. Two were cases where V4-Flash’s instruction-following was
stricter about format constraints than Llama 3.3 had been, and we had to loosen the
output schema slightly.

### 3. Evaluation harness is non-negotiable and pre-migration

If you’re migrating a model in a production RAG stack without a domain-specific
evaluation set, you are flying blind. The 600-question benchmark the client had took
about three weeks to build properly, including adversarial cases and the multi-hop
subset. It was the most valuable thing we built on this engagement.

The aggregate accuracy number (81.4% → 87.1%) matters less than the per-category
breakdown. The multi-hop gain might have been the headline, but the eval also caught two
regression cases in the “date-range” query category that we fixed before any user saw
them.

### 4. The retrieval stack didn’t change at all

Same OpenSearch indices. Same BM25 weight. Same kNN parameters. Same cross-encoder.
Same ACL filter. The retrieval layer is upstream of the model and orthogonal to the
model choice, which is exactly what you want from an architecture standpoint.

The only retrieval-adjacent change was the chunk-ordering adjustment described above —
and that was responding to V4-Flash’s improved context utilisation, not a retrieval
quality issue.

-----

## One thing I’m still watching

V4-Flash’s expert routing is non-deterministic in ways that occasionally produce
higher output variance than Llama 3.3 on short queries with sparse context. It’s rare
and it hasn’t broken anything. But the P99 accuracy tail is slightly fatter than I’d
like on the single-chunk extraction questions. I don’t have a clean explanation yet.
Might be temperature sensitivity, might be something about how the routing distributes
on short prompts. Still watching.

-----

## The summary line

The migration was worth doing. The latency improvement was real, the reasoning quality
improvement was real, and the MIT licence gives the client deployment flexibility they
didn’t have under Llama’s community terms.

The things that didn’t change are the things that matter architecturally: the retrieval
stack, the access control model, the evaluation discipline, and the prompt craft. A
better model is a better tool. It doesn’t change what you’re building with it.

-----

*Next up: a longer note on how we build evaluation harnesses — what we’ve learned
about adversarial coverage, multi-hop construction, and the unglamorous work of keeping
benchmarks honest as the system evolves.*

— Priyanshu
