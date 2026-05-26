---
title: "GLM-4.7 on Huawei Ascend · the first frontier-adjacent model trained with zero NVIDIA silicon"
date: 2026-05-26
tags: [china, huawei, geopolitics, open-weights, zhipu]
read_time: 4
excerpt: "Zhipu trained GLM-4.7 on 100,000 Huawei Ascend 910B processors. No H100s, no H200s, no Blackwell. The technical merit of the model matters less than the proof of concept: China can now train a frontier-adjacent model on a domestic stack. That's the chart that 2026 ends with."
---

The quiet story of May, buried under Google I/O and the Anthropic round, is that **Zhipu trained GLM-4.7 on 100,000 Huawei Ascend 910B processors** — and shipped it as an open-weights coding model with credible benchmarks. No H100s. No H200s. No Blackwell. No NVIDIA anywhere in the training run.

That's the chart. The model is the data point underneath it.

## What was trained, on what

- **Hardware**: ~100,000 Huawei Ascend 910B accelerators. Domestic Chinese silicon, fabbed in part on SMIC processes. Not the leading edge of what TSMC ships, but workable.
- **Software**: Huawei's MindSpore framework + CANN compute stack. Not PyTorch + CUDA. The entire training pipeline runs on a non-NVIDIA software stack.
- **Output**: GLM-4.7, an open-weights coding model with credible-to-strong scores on the standard coding benchmarks and aggressive pricing ($0.11/M input is the number I've seen quoted in Chinese coverage; haven't fully verified against the official price card).

The Ascend 910B is not a Blackwell. On raw FLOPs per chip, it's well behind. The training therefore had to span more chips, with more interconnect overhead, on a less-mature software stack. That Zhipu got a coherent frontier-adjacent model out the other end is a real engineering result independent of how the model itself stacks up to Claude or GPT-5.5.

## Why this matters more than the benchmark numbers

The export-control regime that began in 2022 and tightened through 2023–2025 was built on a single bet: that the bleeding-edge AI capability frontier requires NVIDIA's leading-edge silicon plus CUDA, and that denying both to China would meaningfully delay Chinese frontier capability.

GLM-4.7 is the first widely-discussed data point that the bet may have been timed correctly and outcome-wrong. The frontier got delayed in China — DeepSeek V4 Pro and Kimi K2.6 are six-to-twelve months behind the US frontier on the standard evals — but the *training stack* that produced GLM-4.7 is, from the export-control perspective, the worst news of the year.

Three implications:

**1. The Ascend curve is steeper than the export-control architects assumed.** Each generation of domestic silicon shrinks the per-chip gap a little. The compounding effect over three years is non-trivial. If 910B gets you GLM-4.7, 910C (rumoured 2027) likely gets you something at parity with mid-2025 frontier US models. The "we'll always be a generation ahead" thesis needs revisiting.

**2. The software stack lock-in has weakened.** CUDA was supposed to be the moat that survived even if the hardware moat slipped. MindSpore + CANN training a real frontier-adjacent model at this scale is the first widely-public evidence that the CUDA moat is a moat made of policy and inertia, not of irreproducible engineering. Inertia gets eroded.

**3. The open-weights dynamic compounds the problem.** GLM-4.7 ships open. Anyone can download the weights. The training stack is irrelevant to a downstream user — what matters is the model. So even if Ascend stays a generation behind, the *outputs* of an Ascend-trained run circulate globally on the same terms as Llama or DeepSeek. The export controls were aimed at training-time capability. The deployment-time landscape they end up shaping is much weaker than intended.

## The lab-by-lab consequence

I keep coming back to one structural read:

US labs (Anthropic, OpenAI, Google) win the frontier evaluations and the enterprise contracts. The capital and the compute concentrate there. The valuation numbers from this week — Anthropic at $900B, OpenAI at $852B, both with an order of magnitude more revenue than the Chinese labs — confirm that.

Chinese labs (Zhipu, DeepSeek, Moonshot, Qwen) win the open-weights diffusion layer and the developing-world adoption tier. They lose the absolute frontier and win the volume floor. GLM-4.7 on Ascend is the first model that says the volume floor is now untethered from the US compute stack.

Those are not the same game. They don't compete head-to-head. They compete for the *default* — what does a developer in Lagos, or São Paulo, or Jakarta, or Bangalore reach for when they need a model. That default is, increasingly, going to be Chinese open weights. And the export controls don't bite there at all.

## What I'm watching next

GLM-5 is the obvious one — Zhipu has been telegraphing a 700B+ MoE successor with a much lower hallucination rate, also trained on Ascend. If that ships and benches close to GPT-5.5, the "trained without NVIDIA" line stops being a curiosity and starts being the default expectation for the Chinese frontier.

The next data point worth waiting for is **whether DeepSeek follows Zhipu onto Ascend** for V5. DeepSeek has been the most NVIDIA-dependent of the Chinese labs. If even they move, the export controls are, functionally, done.

May's biggest story might not have been an American one at all.
