# One-Off AI Usage Preflight and Utility-Cost Gate

Status: Mandatory operating control

Last verified: 2026-07-21

Canonical source: [NEURO-DIV - Agentic Communication Scaffold (ACS) - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

Decision analysis: [NEURO-DIV - AI Usage Preflight and Utility-Cost Analysis - v1 - 2026-07-21](https://docs.google.com/document/d/1SS04mfOXWlPKo4dv-MSOtAWLzv_h8kDzpI10xEjE7K8/edit)

## Purpose

Before substantive one-off Codex or Claude execution could materially consume a hard plan allowance or paid overage, estimate the bounded completion cost and compare it with production utility. This control complements the recurring-automation cost control; it does not replace it.

The preflight is deterministic and invokes no model. It controls substantive execution after intake. A prompt already submitted directly to an AI platform necessarily incurs at least the platform's intake and interpretation cost; running the CCS preflight before dispatch avoids that start cost.

## Required inputs

- platform: Codex/OpenAI or Claude;
- work type;
- production-importance rank from one through four;
- bounded scope: small, medium, or large;
- context state: fresh, established, long, or saturated;
- reasoning level;
- maximum completion passes;
- selected model when known; and
- most recent input, cached-input, and output token mix when available.

## Estimate output

Return all of the following before execution:

- likely (`p50`), conservative (`p80`), and stress-case (`p95`) usage;
- unit and provider-rate basis;
- calibration confidence and sample size;
- cost rank;
- utility score and normalized utility-to-usage ratio;
- allow, bounded-cost-decision, or block status; and
- lower-cost alternatives considered first.

Codex reports credits under the current provider token rate for input, cached input, and output. Claude reports API-equivalent overage exposure. Claude values must not be described as a percentage of the Pro allowance because Anthropic does not publish a stable token-to-plan conversion.

## Active gates

Codex cost ranks:

- low: no more than 20 credits;
- medium: above 20 through 100 credits;
- high: above 100 through 400 credits; and
- extreme: above 400 credits.

Claude API-equivalent cost ranks:

- low: no more than $0.25;
- medium: above $0.25 through $0.75;
- high: above $0.75 through $2.00; and
- extreme: above $2.00.

Decision rules:

- Block when adjusted cost rank exceeds importance rank.
- Block when normalized utility-to-usage ratio is below 20.
- Require a bounded cost decision when cost and importance are equal, cost is high or extreme, or the ratio is below 40.
- Allow automatically only when the task is bounded, cost is below importance, and the ratio is at least 40.
- Unknown or unbounded scope is not low cost and blocks execution.

Before escalating a bounded cost decision, the agent must attempt the cheaper viable design: fresh focused task, concise handoff, smaller decision-producing scope, medium or lower reasoning, deterministic connector or native action, one completion pass, and an explicit stop condition.

## Calibration and evidence

Initial Codex calibration uses 74 non-fork local task records. Fork snapshots and inherited history are excluded to avoid double counting. Initial Claude calibration uses four locally available task records and is therefore low confidence.

Post-run actual token and cost evidence must update calibration by platform, model, work type, context state, and completion scope. Provider rate changes require a calibration-version update before new estimates are treated as current.

## Implementation

- CCS form: `apps/acs-command-center/app/UsageEstimator.tsx`
- deterministic API: `apps/acs-command-center/app/api/usage/estimate/route.ts`
- estimator: `apps/acs-command-center/lib/usage-estimator.ts`
- calibration: `apps/acs-command-center/lib/usage-calibration.ts`
- agent tool: `estimate_task_usage`
- verification: `apps/acs-command-center/tests/usage-estimator.test.mjs`

