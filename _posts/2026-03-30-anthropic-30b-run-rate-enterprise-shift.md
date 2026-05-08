---
title: "Anthropic at $30B annualised, OpenAI at $24B — what the enterprise shift looks like from the trenches"
date: 2026-03-30
tags: [enterprise, market, anthropic, openai]
read_time: 5
excerpt: "Anthropic's run rate quietly passed OpenAI's, and most of the delta is enterprise agentic workflows — not consumer chat. A short field report on what's actually driving that."
---

The headline making rounds last week: **Anthropic reached an annualised run rate of $30 billion**, while OpenAI is reported at $24 billion. The thing worth looking at isn't the number — it's the *shape* of the number.

Most of Anthropic's enterprise revenue comes from **agentic workflows**, not from people typing into a chat box. In our shop and across the half-dozen client projects I've sat in on this quarter, that's exactly what we're seeing.

## What changed

A year ago, "enterprise GenAI" meant a fancy chat interface bolted onto a company's data, with humans driving the conversation. The economics of that pattern were limited: per-seat licensing, weekly active users, the kind of thing that scales with headcount.

In 2026 the dominant pattern is different. The model is invoked by *systems*, not by humans:

- A **document review pipeline** that processes 50,000 contracts a night.
- An **agent** that runs hourly, queries 30 internal services, and fills out a structured report.
- A **data validation step** in a pipeline that touches every record before it reaches the warehouse.
- A **codegen workflow** that opens dozens of pull-requests a day on internal repos.

Each of these can burn more tokens in an hour than a thousand human chat users do in a week. Once you wire even one of these into a real production system, the per-user-seat model stops being the unit of measurement.

## Why Anthropic specifically

Three things, from the conversations I've had with peers building on it:

**One.** Claude's tool-use reliability — both first-party and via MCP — has been ahead of competitors on the boring axis of *not breaking when called 50,000 times in a row*.

**Two.** Their pricing for enterprise tiers has been more predictable than the alternatives. Predictability matters more than headline price when you're forecasting a workload.

**Three.** MCP itself was Anthropic's bet, and it paid off. Customers building on Claude get the easiest path into the connector ecosystem.

This isn't a "Claude wins" post — the numbers will move, OpenAI's enterprise push is real, and Google's agent stack is closing fast. But the *shape* of the GenAI market in 2026 is settled: it's an infrastructure market with agentic workloads on the demand side.

---

**Sources:**
- [LLM News Today (May 2026)](https://llm-stats.com/ai-news)
- [AI Updates Today (May 2026)](https://llm-stats.com/llm-updates)
- [The 2026 MCP Roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
