---
title: "Welcome to Latent"
date: 2026-03-22
tags: [meta, newsletter]
read_time: 3
excerpt: "Field notes from the GenAI frontier — what to expect from this newsletter, who it's for, and how often it'll land."
---

This is **Latent** — a continuous newsletter on enterprise AI, RAG architecture, agentic systems, and the slow grind of taking a model from a notebook to a production system someone actually depends on.

I write this newsletter from my desk at Elastiq AI, where I lead the architecture of an enterprise RAG platform — multi-source ingestion, hybrid retrieval (BM25 + kNN on OpenSearch), cross-encoder re-ranking, and document-level access control synchronized across cloud providers. Most of what gets published here will come out of that work, or out of conversations with engineers and founders trying to ship the same kind of thing.

## What you'll find here

A small, high-signal stream of:

- **Architecture notes** — how we're building production-grade RAG, agent orchestration, and search infrastructure that actually holds under enterprise load.
- **Fine-tuning logbook** — what we tried with QLoRA / LoRA on LLaMA-class models, what worked, what didn't.
- **Tooling deep-dives** — a particular library, protocol (looking at you, MCP), or evaluation harness — what it does well, where it bends.
- **The unglamorous infrastructure** — the stuff that decides whether a GenAI feature is a demo or a product. ACL sync, observability, evaluation, fallback paths.
- **Field reports** — short notes from real client engagements, anonymised where they need to be.

## Who it's for

If you're an AI/ML engineer, a CTO at a 10–200-person company looking to ship GenAI in earnest, or a founder trying to understand what "production-grade" really costs — this is for you.

If you want hot-takes on every model release, this isn't the place. If you want practical, somewhat-opinionated notes from someone who's currently in the trenches, you're in the right inbox.

## Cadence

I aim for **one substantive post a week**, sometimes more if a particular thread is warm. No filler. If a week passes and I have nothing useful to say, I won't say anything.

## How to read

You can:

- [Subscribe via RSS]({{ '/newsletter/feed.xml' | relative_url }}) — the simplest, most durable way.
- Bookmark this page and check in.
- Email me at <a href="mailto:{{ site.author.email }}">{{ site.author.email }}</a> if you want to talk about anything I publish.

The first technical post lands shortly. Until then — talk soon.

— Priyanshu
