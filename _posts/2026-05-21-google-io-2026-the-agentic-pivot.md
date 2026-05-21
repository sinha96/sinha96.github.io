---
title: "Google I/O 2026 · the day Google stopped shipping models and started shipping agents"
date: 2026-05-21
tags: [google, gemini, agents, io-2026]
read_time: 5
excerpt: "Notes from yesterday's I/O keynote — Gemini 3.5, Gemini Omni, Antigravity, Spark, Universal Cart. The story isn't the model numbers. It's that the entire product surface pivoted to agentic in one keynote."
---

I watched the Shoreline keynote yesterday with the same notepad I use for client calls. By the end of it the page had one underlined sentence at the top: *the model is no longer the product.* Below that, the things that actually shipped on 20 May 2026.

## The two models

**Gemini 3.5** is the new frontier family. The framing Google used — "frontier intelligence with action" — is the giveaway. 3.5 is being positioned less as a benchmark-chasing release and more as the substrate the rest of the agentic stack runs on. **Gemini 3.5 Flash** was the SKU shown end-to-end on stage; the bigger sibling was alluded to but not benchmarked head-to-head against Opus 4.7 or GPT-5.5, which tells you something about where Google wants the conversation to go.

**Gemini Omni** is the more interesting release. "Any input to any output, starting with video" is the pitch. The demos that landed were the editing ones — point at a frame, describe the change in natural language, get a coherent edit back across the rest of the clip. This is the first time I've seen a multimodal model where video editing felt like a first-class output modality rather than a party trick stitched onto an image model.

## The agentic surface

This is the part of the keynote I'll remember. Five separate product launches, all of them agents, all shipping into surfaces that already have hundreds of millions of users:

- **Gemini Spark** — a general-purpose agent inside the Gemini app that can reason across your connected apps and take action under your direction. Beta, Ultra subscribers and trusted testers first, wider rollout to follow.
- **Information agents in Search** — Search becomes a thing that goes and does the research loop, not just a thing that ranks ten blue links.
- **Daily Brief** — proactive, 24/7 surfacing inside the Gemini app. The "agent that pre-empts you" pattern that everyone has been trying; Google now has the personal-context graph to actually make it useful.
- **Universal Cart** — a shopping cart that holds items across merchants and lets an agent transact on your behalf. The commerce-side implications of this are bigger than the demo suggested.
- **Google Antigravity** — the agent-first developer platform got a substantial bump. "Moving beyond AI tools that help write, to agents that help act" is the line. This is Google's answer to Cursor + Claude Code + the rest of the agentic-IDE cohort.

## What this actually means

Three things stood out to me, and I think they're going to shape the rest of the year:

**1. Google is now competing on distribution, not model quality.** The model announcements were almost a formality. The keynote spent its minutes on what the models do *inside* Gmail, Docs, Keep, Drive, Search, and the Gemini app. When your moat is a billion-user surface area, the model is a feature; the agent on top of it is the product. Anthropic and OpenAI do not have this lever, and yesterday made that asymmetry very visible.

**2. The "agentic in everything" pivot is now industry-wide.** Microsoft has Copilot agents, Anthropic has Claude with computer-use and tool ecosystems, OpenAI has Operator-class products, and now Google has shipped its own coherent agent layer end-to-end across consumer and developer surfaces in a single keynote. The interesting question for buyers in Q3 is no longer "which model is best" — it's "whose agent layer integrates with our system of record." That is a very different procurement conversation.

**3. Antigravity is the one to watch for developer tooling.** The agentic-IDE space has been fragmenting fast. Google entering with first-party access to Gemini 3.5 + Omni + the Workspace graph is a different kind of entrant than the startups in this category. I expect a real fight over the next two quarters.

## What I'm watching next

- Whether **Gemini Spark** actually generalises across connected apps the way the demo suggested, or whether it ends up being a Google-properties agent with thin connectors. The reliability story on cross-app agents is still unsolved across the industry.
- **Universal Cart**'s merchant adoption curve. If Google can get the big retailers in by holiday season, this becomes the default purchase surface inside the Gemini app and the discovery economics change.
- **Antigravity vs. Claude Code vs. Cursor** on real agentic coding workloads. The benchmarks I'd want here don't exist publicly yet; I'll try to put one together for an enterprise client this quarter and write it up.
- Whether **Omni** lands a real video-editing market or remains a demo capability. The editing UX in the keynote was good. The proof is whether anyone ships paid video workflows on it within 90 days.

The headline yesterday wasn't "Google shipped Gemini 3.5." It was "Google stopped shipping a model and started shipping an operating layer." That is a different company than the one that showed up at I/O 2024.

— Priyanshu

---

**Sources:**
- [Google I/O 2026: Sundar Pichai's opening keynote (Google Blog)](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/)
- [Google I/O 2026: News and announcements (Google Blog)](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-collection/)
- [All the news from the Google I/O 2026 Developer keynote (Google Developers Blog)](https://developers.googleblog.com/all-the-news-from-the-google-io-2026-developer-keynote/)
- [Innovations from Google I/O 26 on Google Cloud (Google Cloud Blog)](https://cloud.google.com/blog/products/ai-machine-learning/innovations-from-google-io-26-on-google-cloud)
- [Google debuts new AI models, personal AI agents (CNBC)](https://www.cnbc.com/2026/05/19/google-ai-ultra-gemini-spark-omni.html)
- [Google I/O 2026 live updates (TechRadar)](https://www.techradar.com/news/live/google-io-2026-live)
