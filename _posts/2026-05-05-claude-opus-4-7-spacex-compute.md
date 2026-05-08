---
title: "Claude Opus 4.7 and the SpaceX deal — orbital compute, doubled Code limits, same prices"
date: 2026-05-05
tags: [anthropic, claude-opus, spacex, compute]
read_time: 5
excerpt: "Anthropic shipped Opus 4.7 yesterday and announced a SpaceX compute partnership: 220K+ NVIDIA GPUs at Colossus 1, doubled Claude Code rate limits, and exploratory work on orbital data centres."
---

Two announcements from Anthropic on May 4 that ought to be read together: a **new flagship model**, and a **compute deal that materially changes their capacity ceiling**.

## Claude Opus 4.7

The model itself is positioned as an incremental upgrade over Opus 4.6:

- **Notable gains on advanced software engineering**, particularly on the hardest tasks. Anthropic's framing — and matching independent reports — is that Opus 4.7 is the first Claude where you can confidently hand off your hardest coding work without babysitting.
- **Substantially better vision** — higher resolution image inputs, improved fine-detail extraction.
- **Same pricing as 4.6** — $5/M input tokens, $25/M output tokens.

Pricing-flat-with-quality-up is the move I've been expecting from all the frontier labs as competition tightens. Worth noting that the headline numbers don't move; the unit economics do.

## The SpaceX partnership

The structurally interesting announcement. Anthropic signed a deal with SpaceX for the **entire compute capacity at Colossus 1**:

- **300+ megawatts of new capacity**.
- **220,000+ NVIDIA GPUs** coming online within the month.
- The two companies are exploring **orbital data centres** — Anthropic mentioned interest in *multiple gigawatts of orbital AI compute capacity*.

Yes, orbital. The pitch for space-based compute is solar (constant illumination), thermal (radiative cooling against deep space), and political (jurisdiction, supply-chain redundancy). Whether it's actually economical at scale is a different question, but the fact that it's being seriously discussed at the GW scale by an organisation that ships product is worth filing away.

The downstream effects are immediate:

- **Claude Code's 5-hour rate limits doubled** for Pro, Max, Team, and Enterprise plans, effective immediately.
- **API rate limits raised across the board** for Opus.
- This is the second compute capacity announcement from Anthropic in two months — they've been visibly compute-constrained, and this addresses it.

## What I take from this

**The compute war is here.** The frontier labs are now openly trading capital for capacity in ways that show up as customer-facing rate limits. Operating at the frontier is a capex question first, R&D question second.

**The duopoly dynamic is real.** Anthropic at $30B annualised, OpenAI at $24B, both racing to lock in compute. The mid-2025 view that the field would have 4–6 frontier labs is now harder to defend. Most of the rest are de-facto open-source partners or cloud-vendor offerings.

**Vendor risk is back on the agenda.** When two companies are responsible for most of the inference for the GenAI economy, single-vendor dependency starts costing real procurement points. Build for vendor-neutrality (MCP, abstracted model calls) accordingly.

We doubled our Claude Code allocation today and used it. The new Opus is genuinely better. If the orbital data-centre piece comes together, this gets even more interesting.

---

**Sources:**
- [Higher usage limits for Claude and a compute deal with SpaceX (Anthropic)](https://www.anthropic.com/news/higher-limits-spacex)
- [Introducing Claude Opus 4.7 (Anthropic)](https://www.anthropic.com/news/claude-opus-4-7)
- [Anthropic will get compute capacity from Elon Musk's SpaceX (Axios)](https://www.axios.com/2026/05/06/anthropic-spacex-elon-musk-compute)
- [Anthropic doubles Claude Code limits, thanks to a deal with SpaceX (PCWorld)](https://www.pcworld.com/article/3132997/anthropic-doubles-claude-code-limits-thanks-to-a-deal-with-spacex.html)
- [Anthropic signs Elon Musk's SpaceX for Colossus 1 compute (CoinDesk)](https://www.coindesk.com/tech/2026/05/06/anthropic-signs-elon-musk-s-spacex-for-colossus-1-compute-ahead-of-june-ipo)
