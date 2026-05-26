---
title: "Google cut AI Ultra from $250 to $100 · the part of I/O nobody covered"
date: 2026-05-26
tags: [google, pricing, consumer, openai, anthropic]
read_time: 3
excerpt: "Everyone wrote about Gemini Spark, Antigravity, Omni. Almost nobody wrote about the pricing slide. Google quietly cut AI Ultra from $250/mo to $100/mo at I/O. That's a 60% cut on the top tier in the middle of a subscription war. It is the most disruptive thing Google did last week."
---

A quick follow-up to the I/O post.

Buried in the rapid-fire agentic-product reveal at I/O was a single pricing slide that nobody I read covered in any depth: **Google cut AI Ultra from $250/month to $100/month.** Effective immediately. Existing subscribers grandfathered for a billing cycle, then auto-migrated to the new price.

That's a 60% cut on the flagship consumer tier of the second-most-valuable AI product on earth, announced in the middle of a subscription war where everyone else is holding price. It deserves more attention than it got.

## The competitive board, after the cut

The consumer top-tier prices, as of this week:

- **ChatGPT Pro**: $200/month
- **Claude Max**: $200/month
- **Google AI Ultra**: $100/month *(was $250)*

Two months ago, AI Ultra was the *most expensive* mainstream consumer AI subscription on the market. Today it is the *cheapest* of the three top tiers, by half. The reframe is total.

## Why Google did this

I see three plausible reads, and unlike the Trump EO post I think these are *not* mutually exclusive — they reinforce each other.

**1. They needed Gemini Spark to land in consumers' hands.** Spark is Google's general-purpose agentic surface — the equivalent of the agentic mode every other lab has. Adoption for an agent-first product matters more than ARPU for an agent-first product, because the data flywheel from agent traces is worth more than the marginal subscription. Cutting the price to expand the user base is a defensible strategic trade if you believe the agent-trace data compounds. Google clearly believes it.

**2. They are pricing against a future cost curve, not a current one.** Gemini 3.5 Flash, which is what Ultra runs on for most workloads, is dramatically cheaper to serve than the equivalent Anthropic or OpenAI flagship. Google's TPUs let them set a price floor the competitors can't follow without compressing margin. The $100 number is the floor that's hard to undercut without losing money. Setting that floor publicly is itself the move.

**3. Workspace bundling.** AI Ultra at $100 plus Workspace Individual at $10 is materially cheaper than ChatGPT Pro alone. For the small-business / pro-sumer segment that buys both productivity software and AI, the bundle is the play. The pricing cut is the cover for the bundle.

## What ChatGPT and Claude do next

The obvious move is to match or hold. Holding is hard. The mid-tier segment — people paying $200 for Pro or Max — was, in my experience, already complaining about whether they're getting their money's worth, and is now being shown a competitor with a comparable agent at half the price.

**OpenAI** has the harder problem. Their margin pressure is well-documented (the IPO S-1 will make it more so), they don't have a TPU-equivalent cost-of-goods advantage, and Pro at $200 was already the highest-priced consumer tier in the market. They'll either:

- Hold the price and lose net subscribers,
- Cut and compress margin going into an IPO, or
- Re-segment the product (Pro stays $200, introduce a new "Plus Max" at $100-120 with reduced compute allocation).

The third is the move I'd bet on. It buys them the optics of not cutting while functionally cutting.

**Anthropic** is in better shape. Claude Max is sold disproportionately to enterprise individuals and power users who are largely insensitive to a $100 price differential — they need the model. The bigger pressure is on Claude Pro at $20, which is now competing against AI Ultra's much-broader feature set for only a 5x price differential. Anthropic will probably hold Max and feature-up Pro.

## Why this is the I/O headline that should have been

The agentic-product slide gave us five new things to build into demos. The pricing slide reset the consumer AI subscription market.

Builds get out-shipped. Prices don't get un-cut. The latter is the more durable change.

This is the story I'd point to in twelve months when someone asks what actually shifted at I/O 2026.
