# NEURO-DIV WIPED, Branch, and ACS Integration

Status: Canonical crosswalk snapshot

Last verified: 2026-07-17

This document records how the WIPED behavioral model, branch-structured reasoning, the Cryptographic Branch Addressing Layer (CBAL), the Agentic Communication Scaffold (ACS), the distributed worker plane, and the structural-integrity control plane fit into the larger NEURO-DIV architecture.

## Architectural chain

```text
WIPED behavioral state
  -> adaptive branch parameters
  -> branch-structured reasoning workspace
  -> CBAL identity, lineage, privacy, and integrity
  -> ACS routing and shared-state synchronization
  -> stigmergic distributed-worker execution
  -> verification and convergence
  -> consolidation, archival, and garbage collection
  -> outcome telemetry and model recalibration
```

WIPED is not the complete NEURO-DIV theory. It belongs in the Behavioral Modeling and Adaptation layer. Branch-structured reasoning is the navigable interaction and executive-scaffolding layer. CBAL supplies stable identity and lineage. ACS carries branch state across agents and tools. The distributed worker plane performs bounded work. The integrity plane prevents duplication, corruption, runaway reinforcement, and stale-state accumulation.

## Three-axis placement

The NDV Architecture Ontology & Axial Framework v2 defines three interacting organizing axes:

- Understanding: perception, world modeling, semantic compression, causal abstraction, and predictive coherence.
- Navigation: WIPED-informed adaptation, branch reasoning, executive coordination, workflow traversal, and adaptive pathfinding.
- Persistence: context memory, symbolic encoding, governance, recoverability, lineage, and contextual integrity.

Cross-axis systems include ACS communication, distributed cognition, integrity verification, garbage collection, consolidation, artifact governance, and recursive optimization.

## QTU understanding and execution gate

The Quantitative Theory of Understanding defines:

```text
U(M) = A_OOD(M) * A_CF(M) / L(M)
```

`A_OOD` measures predictive validity under distributional shift, `A_CF` measures causal or counterfactual intervention accuracy, and `L(M)` measures description length or representational complexity. The raw functional is not automatically a probability. The operational execution score is therefore normalized as:

```text
U_norm(M) = A_OOD(M) * A_CF(M) * (L_min / L(M))
```

The task class must define `L_min` and its evaluation protocol before scoring. All terms are bounded so `U_norm` lies in `[0,1]`.

No AI agent may execute a state-changing directive unless:

```text
QTU-LCB90(U_norm) >= 0.90
```

`QTU-LCB90` is the one-sided 90% lower confidence bound, calculated using a declared reproducible method such as a bootstrap confidence bound or Bayesian lower credible bound. A point estimate of `0.90` does not pass when its lower bound is below `0.90`. Missing evidence is `QTU_UNESTABLISHED`, never an invitation to guess. Model fluency, consensus, and self-reported confidence do not count as evidence.

Before authorization, agents may perform only non-state-changing epistemic work needed to establish the bound: read-only retrieval, inspection, clarification, calculation, comparison, threat analysis, simulation, validation, and non-mutating dry runs. State-changing file edits, commits, pushes, external messages, workflow activation, permission changes, purchases, destructive commands, and similar actions remain blocked.

Every directive record must preserve: directive identity; target and scope; `A_OOD`; `A_CF`; `L(M)`; predefined `L_min`; `U_norm`; interval method; `QTU-LCB90`; evidence references; unresolved assumptions; evaluator; timestamp; evidence expiry or target-state version; gate status; and post-execution verification requirement.

Gate states are:

```text
QTU_UNESTABLISHED -> QTU_VERIFYING -> QTU_AUTHORIZED
                               `--> QTU_BLOCKED
```

Material changes to the directive, evidence, scope, target state, or security conditions invalidate authorization. Passing QTU is necessary but does not override security, privacy, authentication, external-communication approval, user scope, or platform policy.

## Integrated hierarchy

```text
NEURO-DIV
|-- Understanding axis
|   |-- Input and perception
|   |-- Vision and world modeling
|   |-- QTU and semantic compression
|   `-- Causal abstraction and prediction
|-- Navigation axis
|   |-- WIPED behavioral modeling and adaptation
|   |-- Branch-structured reasoning
|   |-- Executive coordination and scaffolding
|   `-- Workflow traversal and intervention
|-- Persistence axis
|   |-- Context memory
|   |-- CBAL branch identity and lineage
|   |-- Sleep and consolidation
|   `-- Artifact governance and recovery
`-- Cross-axis control planes
    |-- ACS communication and synchronization
    |-- Stigmergic distributed-worker coordination
    |-- Context and retrieval integrity
    |-- Garbage collection and pruning
    `-- Recursive self-optimization
```

## WIPED-to-branch control contract

WIPED represents Willpower, Impulsivity, Planning, Emotional Regulation, and Dopamine or reward sensitivity. Its extended state may include Attention, Working Memory, Historical or environmental fit, positive and negative incentive weights, and other contextual modifiers.

The output is a provisional Behavioral Decision Weight and cognitive-state or profile vector. The branch controller can translate that state into:

- visible branch count and branch type;
- depth granularity and reveal pacing;
- checkpoint frequency and resumable-state support;
- salience and feedback interval;
- interruption-recovery behavior;
- explicit planning support; and
- persistence and convergence thresholds.

The model is simulation-based and requires empirical validation. It must not be represented as a clinically validated universal equation or used as a deterministic diagnosis. User autonomy and consent override inferred personalization.

## Branch-structured reasoning contract

A branch is a persistent, navigable reasoning trajectory. Branches support controlled divergence, incremental depth, comparison, switching without context loss, pause and resume, convergence, and pruning. This externalizes intermediate cognitive state instead of requiring the user to retain it in working memory.

The interface and orchestration layer should distinguish:

- a conceptual branch, representing an idea or solution trajectory;
- a task branch, representing bounded executable work;
- an evidence branch, representing a claim and its support;
- an artifact branch, representing a durable output and lineage; and
- a recovery branch, representing preserved superseded or failed state.

## CBAL branch envelope

Every durable inter-agent branch unit should carry:

- `Branch_ID`: stable content-derived or registry-issued identifier;
- `Branch_Label`: human-readable symbolic path;
- `Parent_ID`: prior branch or artifact lineage pointer;
- source reference and source agent;
- target agent, role, or destination;
- transformation type;
- WIPED or cognitive-state parameters when applicable and consented;
- payload or redacted summary;
- privacy class;
- evidence and confidence state;
- lifecycle status;
- timestamp;
- verification state; and
- artifact or registry destination.

Semantic routing determines what a branch means. Cryptographic anchoring verifies its identity, ancestry, and change history.

Recommended symbolic grammar:

```text
NDV/[DOMAIN]/[LAYER]/[ACTION]/[STATUS]
```

Example:

```text
NDV/ARCH/BRANCH/SYNTH/VERIFIED
```

## ACS function

ACS transports and synchronizes branch-addressed events, commands, evidence, state changes, integrity results, and agent handoffs. It connects Codex, Claude Code, GitHub Copilot and VS Code, Gemini and Antigravity, Perplexity, Zapier, Google Drive, GitHub, and future compatible participants.

ACS does not own semantic understanding, behavioral diagnosis, branch generation, artifact storage, or task execution. It supplies the communication contracts and connective regulation required for those systems to cooperate.

## Distributed worker contract

Each worker receives:

- one bounded branch objective;
- only the context necessary for that objective;
- constraints and resource budget;
- parent and output branch addresses;
- an evidence or verification criterion; and
- a defined completion, failure, or escalation state.

Workers return results to the shared branch environment. Reinforcement promotes evidence-supported paths. Inhibition prevents duplicate or conflicting work. Signal decay prevents outdated instructions from becoming permanent. No worker is assumed to understand the entire ecosystem.

## Branch lifecycle and integrity control

```text
CAPTURE
  -> NORMALIZE
  -> CLASSIFY
  -> ADDRESS
  -> ROUTE
  -> EXPAND
  -> VERIFY
  -> CONVERGE
  -> ACT
  -> CONSOLIDATE
  -> ARCHIVE or PRUNE
```

The structural-integrity plane must provide:

- exact and semantic deduplication;
- stale-state and confidence expiry;
- no-material-change suppression;
- contradiction and poisoned-branch detection;
- branch quarantine and circuit breaking;
- bounded retries and expansion budgets;
- evidence refresh requirements;
- consolidation and archival; and
- provenance-preserving cleanup.

Positive trail strength, confidence, and priority decay unless refreshed by evidence. Otherwise an early mistake can become a permanent runaway instruction.

## Functional biological analogy

The analogy is functional, not literal:

| Biological or ecological function | NEURO-DIV function |
| --- | --- |
| Fast nervous signaling | Events, commands, and targeted handoffs |
| Endocrine modulation | Standing policy, priority, and system-wide operating state |
| Immune recognition and containment | Identity, validation, anomaly detection, quarantine, and recovery |
| Circulation | Connector and message transport |
| Memory consolidation | Canonical Drive state, repository snapshots, and validated artifacts |
| Cellular maintenance and clearance | Deduplication, pruning, archival, and garbage collection |
| Ant-colony stigmergy | Distributed work allocation through shared signals and local rules |
| Genetic or developmental constraints | Durable schemas, invariants, and versioned policy |

DNA, epigenetic inheritance, emotion, hormonal modulation, telomere attrition, and Paleozoic oxygen and insect size remain research comparisons and environmental constraints. They are not interchangeable mechanisms and do not prove the software architecture.

## Canonical sources

- [NEURO-DIV Core Foundation Document v1](https://docs.google.com/document/d/1DRlYOnp6AGBwRWOYgfh03gxNWxn6kaWSjmkddPa7gdY/edit)
- [A Quantitative Theory of Understanding rev1](https://drive.google.com/file/d/1MOxQjpZ59JzOOZs9EsFEuq49DKN3TkjW)
- [WIPED Model for Human Decision-Making and ADHD](https://docs.google.com/document/d/1Pi_qvpV6L3ME12W18gHl8rOZfUTc6AR6VNUYJcSAtiE)
- [Branch-Structured AI Reasoning](https://drive.google.com/file/d/1gDpdnOqq93A8YPmUKO8lRpNXCmPXISQr)
- [NDV Architecture Ontology & Axial Framework v2](https://drive.google.com/file/d/1nOU3l02RZSxRhKisC-r7eBoRn5fFMBJG)
- [Cryptographic Branch Addressing Layer](https://drive.google.com/file/d/1tURDxNJgb7UFWo5sYCzbdVt0d94dHuG4)
- [ACS Shared Agent Brief](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

This crosswalk is now incorporated into the Core Foundation and ACS standing brief. It does not replace the larger multi-version reconstruction still required to recover the full architecture, reconcile contradictions, verify citations, and identify missing layers.
