---
title: "GPT-5.5 ships as 'Spud' — what the rebrand from GPT-6 tells us"
date: 2026-04-26
tags: [openai, gpt-5-5, model-naming, benchmarks]
read_time: 5
excerpt: "The model OpenAI confirmed for an April 14 launch — internal codename 'Spud' — finally shipped on April 23. Branded GPT-5.5, not GPT-6. The renaming is the most honest thing about the release."
---

OpenAI's most-anticipated model of the year shipped this week, eight days late and with a different name on the box.

The recap, briefly:

- The model — internally codenamed **Spud** — was confirmed for an **April 14, 2026** global launch.
- That date came and went. No public weights, no API rollout, no developer keys.
- On **April 23**, OpenAI shipped it — branded **GPT-5.5**, not GPT-6.

There are two threads to pull on here. The benchmarks, and the naming.

## The benchmarks

Pre-launch leaks pointed to GPT-6-class performance: a high-70s SWE-bench Pro score (the agentic software-engineering benchmark that's become the headline metric for "frontier" claims), substantial improvements on long-context reasoning, etc.

The actual numbers in the system card came in lower than the leaks. SWE-bench Pro at **58.6%**, well short of the high-70s rumour. Strong-but-incremental gains on most other axes.

That score is genuinely good — comparable to or above the latest Claude Opus releases on several axes — but it's not the leap that "GPT-6" had been priced into.

## The naming

The decision to ship as **GPT-5.5** rather than **GPT-6** is the part of this release I find most worth dwelling on.

OpenAI has been criticised — fairly — for inflating model versioning in the past (the GPT-4-Turbo / GPT-4o / o1 lineage was a mess for end users to track). Choosing to *not* call this GPT-6 when the benchmark didn't land is a small but real act of restraint. It's the right call. It also tells us something:

- **OpenAI has internal numerical bars for major versions**, and they apparently held the line.
- **The GPT-6 brand is now being saved** for whatever ships next that does clear that bar.
- The model is good. It's not the leap the rumour mill was paying for.

## What I'm telling clients

GPT-5.5 is a serious frontier release — particularly on coding and reasoning workloads. It's also incremental. If you've already standardised on Claude Opus 4.6 / 4.7 or Gemini 2.5 Pro, there's no urgent reason to switch. If you're on an older GPT-4-class model, the upgrade is worth running an eval on.

The bigger story is the *honesty* of the renaming. We're past the era where every release has to be the biggest one yet, and that's a healthier place for the field to be.

---

**Sources:**
- [GPT-5.5 System Card (OpenAI)](https://openai.com/index/gpt-5-5-system-card/)
- [Introducing GPT-5.5 (OpenAI)](https://openai.com/index/introducing-gpt-5-5/)
- [ChatGPT 6 Release Date: Spud Shipped as GPT-5.5 (Fello AI)](https://felloai.com/all-we-know-about-chatgpt-6/)
- [GPT-6 (Spud): What's Real, What's Hype (Mejba Ahmed)](https://www.mejba.me/blog/gpt-6-spud-openai-analysis)
- [GPT-6 Release Date: 7 Days Past April 14 (FindSkill.ai)](https://findskill.ai/blog/gpt-6-release-date/)
