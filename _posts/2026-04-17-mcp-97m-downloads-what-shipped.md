---
title: "MCP at 97 million monthly downloads — what's shipped, what's still missing"
date: 2026-04-17
tags: [mcp, integration, agents, enterprise]
read_time: 6
excerpt: "Model Context Protocol's adoption numbers are extraordinary — 970× growth in 18 months, 9,400+ public servers, 78% of enterprise teams running agents in production. A status check from a working integrator."
---

Model Context Protocol shipped in November 2024 with roughly 100,000 SDK downloads in its first month. By March 2026, that monthly number was **97 million** — a **970× increase in 18 months**.

We use MCP heavily at Elastiq. We've also tripped over most of the rough edges. A short field report on what's actually shipped, and what's still in the roadmap column.

## What's shipped

**A real connector ecosystem.** The public MCP server registry grew from ~1,200 in Q1 2025 to **9,400+ by April 2026**, and that's just the public ones — the count of internal/private servers in enterprises is much higher. Drive, GCS, S3, Azure Blob, Slack, GitHub, Postgres, Sentry, Snowflake, Salesforce — every major data source has at least one server, often three.

**Cross-vendor adoption.** Anthropic open-sourced MCP. The interesting part is that **OpenAI, Google, Microsoft, and AWS have all adopted it** as a first-class integration surface. The protocol is genuinely vendor-neutral now, in a way it wasn't 12 months ago.

**Enterprise deployment patterns.** **78% of enterprise teams** with AI agents in production are now running them on MCP. The "build a connector for every model provider" anti-pattern has died.

## What's still missing

**Audit trails and SSO-integrated auth.** This is the biggest gap. Out-of-the-box MCP doesn't give you the audit story enterprise security teams want. Most production deployments have a custom logging layer wrapped around the protocol. The 2026 roadmap calls these out as priorities — *enterprise readiness* is the headline theme — but they're not in the standard yet.

**Gateway patterns.** As MCP servers proliferate, you need to centralise auth, rate-limiting, and policy. The community is converging on a *gateway* pattern (an MCP-aware reverse proxy), but there's no blessed implementation. We rolled our own.

**Async / long-running tools.** MCP doesn't have a great answer for tool calls that take 30+ seconds, or that want to stream partial results back. The roadmap mentions a **Tasks primitive** for async agent calls; it's not there yet.

**Configuration portability.** Moving an MCP setup from one host application to another (Claude Desktop → Cursor → your own product, etc.) is still more friction than it should be.

**ACL propagation.** I keep banging on about this. Connectors know who the user is. The LLM doesn't have a first-class way to honour that identity downstream when it composes responses or chains calls. Solved in our shop with a custom layer. Should be in the protocol.

## My take

The protocol has *won* the integration layer. That's settled. The next 12 months are about closing the enterprise-readiness gap — auth, audit, gateways, async — without breaking the simplicity that made it spread in the first place. Hard problem. Solvable.

If you're building enterprise AI in 2026 and you're not on MCP, the burden of proof is now on you to explain why.

---

**Sources:**
- [MCP Adoption Statistics 2026 (Digital Applied)](https://www.digitalapplied.com/blog/mcp-adoption-statistics-2026-model-context-protocol)
- [The 2026 MCP Roadmap (Model Context Protocol Blog)](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/)
- [MCP's biggest growing pains for production use (The New Stack)](https://thenewstack.io/model-context-protocol-roadmap-2026/)
- [What Is an MCP Gateway (DEV / Composio)](https://dev.to/composiodev/what-is-an-mcp-gateway-and-why-do-enterprise-ai-teams-need-one-in-2026-1lie)
- [2026: The Year for Enterprise-Ready MCP Adoption (CData)](https://www.cdata.com/blog/2026-year-enterprise-ready-mcp-adoption)
