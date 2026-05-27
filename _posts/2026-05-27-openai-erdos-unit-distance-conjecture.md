---
title: "An LLM disproved an Erdős conjecture · the moment AI mathematics actually arrived"
date: 2026-05-27
tags: [openai, mathematics, reasoning, erdos]
read_time: 5
excerpt: "An internal OpenAI model disproved Paul Erdős's 1946 unit-distance conjecture autonomously, using infinite class field towers from algebraic number theory. Tim Gowers called it 'a milestone in AI mathematics.' This is the first time we've gotten a genuinely novel mathematical result out of a language model, and the technique it used is the part that matters."
---

I keep going back to this paper. OpenAI dropped it on the 20th, and I've been chewing on it for a week without writing it up because I wanted to make sure I understood the proof before I tried to.

The setup, in one sentence: **an internal OpenAI reasoning model autonomously disproved Paul Erdős's 1946 unit-distance conjecture by exhibiting an infinite family of point configurations using infinite class field towers, beating the long-standing square-grid construction by a polynomial factor.**

That sentence contains roughly four separate things that have never happened before in machine-generated mathematics. Let me take them in order.

## What Erdős asked

Place *n* points on a plane. How many pairs of those points can be exactly distance 1 apart from each other?

Sounds simple. The "obvious" construction is a √n × √n square grid, which gives you roughly *n* × (some logarithmic factor) unit-distance pairs. For eighty years, the best known constructions were variants of the square grid, all giving the same essential shape.

The conjecture, in its strong form: the square grid is essentially optimal — you can't asymptotically do meaningfully better.

That's what the model disproved.

## What the model produced

A construction that **exceeds the square grid by a polynomial factor**, asymptotically. Not a constant-factor improvement. A genuinely better growth rate.

The route it took to get there is the headline:

- Instead of staying in geometry, the model **re-cast the problem in algebraic number theory**.
- It used **infinite class field towers** — specifically the Golod–Shafarevich machinery from the 1960s.
- It produced an **infinite family** of configurations, parametrised by the structure of those number-field towers.
- The proof has been checked by external mathematicians, with a companion paper by **Tim Gowers** giving the human-facing exposition.

This is not a model that ran an exhaustive search and found a counterexample. It is a model that **noticed** a mathematical bridge — between a discrete geometry problem and a deep result in algebraic number theory — that human mathematicians had not crossed in eighty years of effort on this conjecture.

## Why "AI mathematics arrived" is not hyperbole

There have been a lot of AI-mathematics announcements. AlphaProof, AlphaGeometry, the OpenAI IMO results, the various Lean-formalisation efforts. Most of them are extraordinary engineering. Almost none of them have produced a result that working mathematicians would cite for its mathematical content, independent of the fact that an AI produced it.

This is the first one that does.

Three reasons:

**1. The conjecture was open.** Not a re-derivation, not a new proof of a known result. The conjecture was *unsolved*. The result is new mathematics.

**2. The technique is non-obvious to humans.** The Golod–Shafarevich connection is not the obvious tool. It's the kind of connection that working number theorists know about but discrete geometers typically don't. The model crossed a sub-disciplinary boundary that most human researchers would not have. Tim Gowers's companion paper essentially says: *I would not have looked there.*

**3. Gowers signed off.** Fields medallists do not put their names to AI-mathematics papers casually. The "milestone in AI mathematics" line is doing a lot of work — it's a statement of validation from someone who has been deeply sceptical of AI-mathematics overclaiming for a decade.

## What the proof tells us about the model

We don't have weights or architecture details — OpenAI is being characteristically opaque about which internal model produced this — but the *shape* of the result tells us a few things.

**It's a reasoning model, run for a long time.** This is not a one-shot inference. The proof requires sustained mathematical reasoning across multiple sub-fields, and the kind of multi-day compute budget that only the internal-tier reasoning systems currently have.

**It has access to mathematical tools.** Some combination of formal verification (Lean is the obvious candidate), symbolic manipulation, and probably literature retrieval. The Golod–Shafarevich theory isn't something you'd reconstruct from first principles in a reasonable time budget.

**It's cross-domain.** The single hardest thing about machine mathematics has been bridging sub-disciplines. The model demonstrably did that.

## The slightly uncomfortable implication

If this generalises — and it's one result, the base rate on "single result that generalises" is low — then the floor on machine-assisted research has just moved. The picture changes from "AI helps mathematicians with bookkeeping and search" to "AI proposes proof strategies that humans then verify." That's a different research workflow. It's the workflow Gowers's companion paper is implicitly endorsing.

The careful read: this is one open problem, in one corner of combinatorial geometry, where one specific algebraic-number-theory connection happened to apply. It's not yet evidence that arbitrary open problems are now tractable.

The less careful read, and the one I find harder to dismiss the more I sit with the paper: this is the first credible existence proof that **a frontier LLM, given enough thinking time and the right tools, can produce mathematics that working mathematicians find genuinely novel.** The base rate of that happening, before this paper, was zero.

It is no longer zero.

## What I'm watching

Three things, in priority order:

1. **Replication.** Does the same model — or another lab's model — produce a second result on a different open problem, on a similar timescale? One result is an existence proof. Two is a trend.

2. **The mathematicians.** How do the working number theorists and discrete geometers respond over the next six months? The Polymath-style follow-ups, the simplifications, the generalisations. If the result *catalyses* further human work, the floor has moved durably.

3. **The methodology paper.** OpenAI will, eventually, publish on the reasoning system that produced this. The architecture and prompting details are the artefact I want most. If the answer is "we let a reasoning model think for a week with tool access," it changes how every lab budgets for the next twelve months.

I think this paper will be cited in the AI history books. Not because of the unit-distance problem specifically — most readers will never need to care about that problem — but because of where the technique came from and what it implies. The math is the lever. The lever is what just moved.
