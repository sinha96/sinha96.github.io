---
title: "Domain-aware knowledge graph extraction — making LLMs understand what they're extracting"
date: 2036-05-08
tags: [graphrag, knowledge-graph, entity-extraction, rag, nlp]
read_time: 8
excerpt: "Standard graph extraction pipelines ask LLMs to extract entities and relationships from documents. The problem: without domain context, the LLM collapses critically different concepts into generic types. Here's how forcing chain-of-thought domain analysis before type generation produces dramatically better graphs."
---

Most GraphRAG pipelines follow the same pattern: chunk a document, send each chunk to an LLM with a prompt like *"extract entities and relationships"*, collect the results, build a graph. The entity types and relationship types are either hardcoded or discovered by a separate LLM call that scans the document.

This works well enough for recall. The LLM finds things. The problem is **precision** — specifically, the LLM collapses concepts that look similar but mean fundamentally different things into the same generic type. And once that distinction is lost at the type level, no amount of downstream processing can recover it.

## The problem: type collapse

Consider a product data sheet with two tables:

| **Specifications** | Limit | Test Method |
|---|---|---|
| Acid Value | <8 mg KOH/g | AOCS Cd 3d-63 |
| Color | <10 Gardner | AOCS Td 1a 64 |

| **Typical Properties** | Value |
|---|---|
| HLB | 8.5 |
| Moisture | <1% |

A standard extraction prompt produces this:

```
Acid Value   → type: Property
HLB          → type: Property
Moisture     → type: Property
Color        → type: Property
```

All four are "Property". But in reality:
- **Acid Value** and **Color** are *specification limits* — formally tested, pass/fail criteria, with reference analytical methods.
- **HLB** and **Moisture** are *typical values* — informational, characteristic, not tested for compliance.

A downstream system querying "what are the specification limits for this product?" would get all four. A compliance check would treat informational values as hard limits. The graph has technically correct entities connected by technically correct relationships — but the types don't carry the semantic precision the domain requires.

This isn't a one-off. The same collapse pattern shows up everywhere:

- **Storage conditions** typed as generic "Property" alongside actual product attributes
- **Handling instructions** typed as "TestMethod"
- **Ingredient concentrations** given the same relationship type as specification limits
- **Marketing claims** indistinguishable from technical specifications
- **Section headings** extracted as entities alongside real named things

## Why it happens

The standard approach to type discovery is a single LLM call: *"Read this document and list all entity types and relationship types."*

The LLM responds with what it sees on the surface — "Property", "Value", "Method" — because without explicit guidance, it has no reason to distinguish between a specification limit and a typical value. Both are numeric values associated with a product. The distinction lives in the *domain semantics* (source, purpose, authority), not in the surface text.

## The fix: chain-of-thought domain analysis

The solution is to force the LLM to articulate domain-specific distinctions *before* generating types. This is chain-of-thought applied to ontology design.

Instead of:

```
Prompt: "List entity types and relationship types for this document."
Output: {entities: ["Property", "Method", "Product", ...], relationships: ["HAS_PROPERTY", ...]}
```

The prompt requires a structured analysis in a fixed order:

**Step 1 — Classify the domain.** What kind of document is this? What industry, what document type?

**Step 2 — Summarize.** What does the document contain?

**Step 3 — Identify critical data distinctions.** This is the key step. The prompt asks: *"What concepts in this document look similar but mean different things?"* For each distinction, explain what the concepts are, why they appear similar, and how they actually differ.

**Step 4 — Generate types that respect the distinctions.** For each distinction identified in Step 3, the output must contain separate entity types or relationship types. The prompt explicitly states: if you identified that two concepts differ, they cannot share a type.

The output is a single JSON object with all four steps, structured so the distinctions come *before* the types:

```json
{
  "domain": "...",
  "document_type": "...",
  "document_summary": "...",
  "critical_data_distinctions": [
    {
      "similar_concepts": ["Specification limits", "Typical values"],
      "why_similar": "Both are numeric values associated with product properties",
      "how_different": "Specification limits are formally tested pass/fail criteria with reference methods. Typical values are informational characteristics."
    }
  ],
  "entities": ["Product", "Specification", "TypicalProperty", "TestMethod", ...],
  "relationships": ["HAS_SPECIFICATION", "HAS_TYPICAL_PROPERTY", "TESTED_BY", ...]
}
```

Because the LLM must write the distinctions before the types, it effectively reasons about what's different before committing to a schema. The types become a direct consequence of the analysis, not a surface-level guess.

## What goes wrong without ontology discipline

Forcing distinctions solves the collapse problem but can introduce the opposite: **type proliferation**. Left unconstrained, the LLM will invent hyper-specific types like `FinishedProductMarketingClaim` or `EmulsionPerformanceCharacteristic` — types so narrow they fragment the graph and can't be reused across documents.

The fix is ontology discipline rules in the same prompt:

- **Cap the count.** Aim for 8-15 entity types and 10-20 relationship types.
- **Cap the name length.** Entity types: 1-2 words. Relationship types: 2-3 words.
- **Prefer stable categories.** Types should work across many documents in the same domain, not be tailored to one specific file.

## Entities vs attributes

The second major quality issue is **entity fragmentation** — the LLM creates graph nodes for things that should be attributes. Phrases like "rapid absorption", "excellent stability", or "24 months" become standalone entities with zero or few connections, inflating the graph with noise.

The prompt must define a clear boundary: an entity is something with a **unique name** that can be **independently referenced**. If it can't stand alone — if it only makes sense as a descriptor of something else — it's an attribute, not a node.

Scalar values, measurements, units, benefit phrases, and section headings all fall on the attribute side. They belong in entity descriptions or relationship descriptions, not as graph nodes. A specification limit of "<8 mg KOH/g" is a *property of* the entity "Acid Value", expressed in its description — not a separate entity connected by a "HAS_VALUE" relationship.

## Multilingual deduplication

Documents in different languages processed into the same knowledge base create parallel disconnected subgraphs. "Skin care" and "cuidado cutaneo" are the same concept — but with different entity names, they become separate nodes that never connect.

The extraction prompt should specify: entity names use the English canonical form, with the original-language term preserved in the description for traceability. This prevents duplicates at creation time rather than trying to merge them later.

## Entity name reconciliation

Even within a single document, the LLM writes slightly different names for the same entity across chunks — "EcoDropGel" in one chunk, "EcoDrop Gel" in another. After extraction, both names exist in the relationship edge list, but only one exists as a node. The other becomes an orphaned reference.

The fix is a post-extraction reconciliation step that fuzzy-matches relationship endpoints against actual entity node names. The matching uses a weighted combination of NLP techniques:

- **Character-level similarity** (SequenceMatcher) — catches spacing and punctuation differences
- **Fuzzy token overlap** — matches tokens within names even when individual words have typos or inflection differences
- **Edit distance ratio** — catches single-character typos
- **Token containment** — catches cases where one name is a subset of another
- **Prefix matching** — catches truncated names

This runs as a deterministic NLP step with no LLM calls. It reconciles the majority of name mismatches before the graph is built.

## Entity resolution: NLP candidates, LLM verification

For entities that survive reconciliation as separate nodes but might still be the same thing — "Mr. Gandhi" vs "Mrs. Gandhi" vs "Mahatma Gandhi" — string-level NLP alone can't make the right call. Edit distance says "Mr." and "Mrs." are one character apart, but they denote different people.

The architecture uses NLP heuristics to **generate candidates** and the LLM to **verify them**:

1. **Blocking** groups entities by type, name prefix, and length bucket — reducing O(n^2) comparisons to O(n).
2. **Similarity heuristics** (edit distance, SequenceMatcher, token overlap, containment) flag candidate pairs.
3. **LLM verification** receives candidates in batches (up to 100 pairs per call) and answers "are these the same entity?" for each.

The NLP step casts a wide net. The LLM step provides semantic precision. Batching keeps costs proportional to the number of ambiguous pairs, not the total entity count.

## Results

On an 8-document corpus spanning product data sheets, corporate reports, and technical presentations:

| Metric | Before | After |
|--------|--------|-------|
| Entity types | 40+ (hyper-specific) | 13 (stable, reusable) |
| Scalar values as entities | Many | None |
| Section headings as entities | Present | Eliminated |
| Specification vs typical value distinction | Collapsed | Preserved |
| Storage conditions vs product properties | Conflated | Separate types |
| Visual/logo noise entities | 12 per document | Filtered |
| Orphaned UNKNOWN entities | 24 | Reduced by ~80% |
| Ingredient extraction quality | Strong | Strong (preserved) |
| Product recognition | Strong | Strong (preserved) |

The extraction system's strongest capabilities — ingredient extraction, product recognition, technical domain understanding — were preserved. The improvements targeted precision: ontology quality, entity canonicalization, and relationship semantics.

## The pattern

The general pattern is applicable to any graph extraction pipeline:

1. **Domain-aware type generation.** Force the LLM to reason about domain distinctions before generating types. Chain-of-thought ontology design, not surface-level type listing.
2. **Ontology discipline.** Cap type counts, cap name lengths, enforce reuse of existing types.
3. **Entity vs attribute boundary.** Define what should be a node vs what should be a description. Not everything the LLM can name deserves a node.
4. **NLP-first name reconciliation.** Deterministic fuzzy matching to clean up name variants before graph construction. No LLM calls needed for the common cases.
5. **LLM verification only for ambiguous cases.** Reserve the expensive LLM call for pairs that NLP heuristics can't confidently resolve.

The underlying insight: graph extraction quality is bottlenecked by *type quality*, not extraction recall. The LLM is already good at finding things. The challenge is giving it the right vocabulary to describe what it found.
