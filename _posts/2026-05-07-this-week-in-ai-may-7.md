---
title: "This week in AI · the lines I drew on the whiteboard"
date: 2026-05-07
tags: [weekly, links, digest]
read_time: 4
excerpt: "Six things that earned a tab and a sticky note this week — Anthropic's compute deal, CAISI's pre-launch evaluations, the open-weights frontier closing in, and one quiet shift in the agent stack."
---

A short week-in-review. Six items I keep returning to, with a one-line take on each.

**Anthropic's compute deal with SpaceX is the structural story of the week.** 220K+ GPUs at Colossus 1, doubled Claude Code rate limits, and gigawatt-scale orbital data-centre talks. The capex race is now openly the lever pulling everything else. *(I wrote about this on Tuesday — see the previous post.)*

**CAISI's pre-launch agreements with Google, Microsoft, xAI.** Pre-deployment government evaluation moved from voluntary commitment to formal-and-repeated. This is going to start showing up as a procurement-checklist item by Q4. Anthropic has had a separate arrangement; OpenAI's status is less clear. Watch for the next labs to sign on.

**DeepSeek V4-Pro is the #2 open-weights model on Artificial Analysis's intelligence index.** Behind only Kimi K2.6. Open-weights gap on reasoning is single-digit-percent territory now. MIT licence on V4 makes it deployable in places Llama Community Licence isn't. *(Wrote about this last week.)*

**MCP roadmap update is worth reading.** The 2026 priorities are unglamorous but exactly right: audit trails, SSO-integrated auth, gateway patterns, async/long-running tools, configuration portability. The protocol won the integration layer. Now the boring work of enterprise-readiness gets done. The community link is below.

**Quiet shift in the agent stack:** the move from "frameworks" to "primitives". The trend through 2024 was full-stack agent frameworks — opinionated, vertically integrated. The trend in 2026 is people composing **MCP servers + a stateful orchestrator (LangGraph or similar) + their own evaluation harness**, instead of buying a framework. We made that move last quarter and the operability gain was real.

**GPT-5.5 ("Spud") shipping under the GPT-5 brand instead of GPT-6.** OpenAI held the line on what counts as a major version. Industry-restraint signal. Worth watching whether competitors follow suit; the model-versioning hype cycle has been a problem for buyers.

## What I'm thinking about for next week

- A longer note on **agentic evaluation harnesses** — what we've built, what we're still missing.
- A field report on **moving an enterprise client from Llama 3.3 to a V4-Flash deployment** — what changed, what didn't.
- Possibly a shorter post on **Project Glasswing's ripple effects** — security teams I'm talking to are starting to plan around the assumption that Mythos-class capabilities will be more broadly available within 12 months.

Take care of yourselves. See you next week.

— Priyanshu

---

**Sources:**
- [Higher usage limits for Claude and a compute deal with SpaceX (Anthropic)](https://www.anthropic.com/news/higher-limits-spacex)
- [Microsoft, Google and xAI will let the government test their AI models (CNN Business)](https://www.cnn.com/2026/05/05/tech/microsoft-google-xai-government-test-ai-models)
- [DeepSeek is back among the leading open weights (Artificial Analysis)](https://artificialanalysis.ai/articles/deepseek-is-back-among-the-leading-open-weights-models-with-v4-pro-and-v4-flash)
- [The 2026 MCP Roadmap (Model Context Protocol Blog)](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
- [GPT-5.5 System Card (OpenAI)](https://openai.com/index/gpt-5-5-system-card/)
- [Project Glasswing (Anthropic)](https://www.anthropic.com/glasswing)
