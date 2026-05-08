---
title: "Claude Mythos and Project Glasswing — when capability outruns deployment"
date: 2026-04-08
tags: [security, anthropic, mythos, glasswing]
read_time: 6
excerpt: "Anthropic previewed Claude Mythos last week and didn't ship it. The model can find zero-days at scale. The decision to gate it behind Project Glasswing is the most interesting deployment story of the year so far."
---

On April 7, Anthropic announced two things that ought to be read together: **Claude Mythos Preview**, a frontier model with unusually strong cybersecurity research capabilities, and **Project Glasswing**, an industry-coordinated programme to deploy Mythos against critical software *before* releasing it broadly.

This is the deployment-first announcement I've been waiting for, and it deserves more attention than it's getting.

## What Mythos can apparently do

In Anthropic's own framing, Mythos identified **thousands of zero-day vulnerabilities** across operating systems, browsers, and other major software, autonomously. The standout claim: it found **CVE-2026-4747**, a 17-year-old remote code execution flaw in FreeBSD's NFS that gives any caller root on the affected machine. Seventeen years.

If this generalises — and the partner readouts suggest it does — then we have a model that's a serious force multiplier on **both sides** of the offensive/defensive line. That's the deployment problem.

## Project Glasswing

Anthropic's response is to *not* ship Mythos generally. Instead, Glasswing is a coordinated programme that gives the model only to a vetted set of partners doing defensive work. The launch partners list reads like a who's-who of critical software:

> Amazon Web Services, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, the Linux Foundation, Microsoft, NVIDIA, Palo Alto Networks.

Mythos isn't on the API. Won't be, anytime soon. Eventually, Anthropic says, they want to enable safe deployment of Mythos-class models at scale — but that "eventually" is doing a lot of work.

## What I think is right about it

**Acknowledging the asymmetry.** Defenders take time to patch. Attackers don't. A model that can find zero-days *autonomously, at industrial scale* shifts the asymmetry in a way that needs preparation. Glasswing is preparation.

**Industry coordination over self-regulation.** A single lab gating the model is fragile. A multi-vendor programme — including the kernel maintainers via the Linux Foundation — is more robust.

**The willingness to delay general availability.** This is what I want to see more of. Capability without deployment readiness is a problem. Anthropic chose to slow the deployment, and they were transparent about why.

## What I'm watching

**Will the model leak?** Multi-partner programmes have ways of becoming many-partner programmes. Mythos's parameters won't escape, but its existence creates pressure for someone to ship a comparable open-weight model.

**The economics of defensive use.** Running Mythos against your codebase isn't free. If the cost of *finding* zero-days is lower than the cost of *fixing* them — and that's likely, eventually — the bottleneck moves to remediation. Defensive teams will need new tooling.

**The precedent.** What's the next Mythos-class capability that should be Glasswinged before release?

This is the kind of deployment decision the field has been talking about abstractly for years. Watching it happen in practice is genuinely useful.

---

**Sources:**
- [Claude Mythos Preview · red.anthropic.com](https://red.anthropic.com/2026/mythos-preview/)
- [Project Glasswing · Anthropic](https://www.anthropic.com/glasswing)
- [Anthropic's Claude Mythos Finds Thousands of Zero-Days (The Hacker News)](https://thehackernews.com/2026/04/anthropics-claude-mythos-finds.html)
- [On Anthropic's Mythos Preview and Project Glasswing (Schneier on Security)](https://www.schneier.com/blog/archives/2026/04/on-anthropics-mythos-preview-and-project-glasswing.html)
- [Simon Willison's note on Project Glasswing](https://simonwillison.net/2026/Apr/7/project-glasswing/)
