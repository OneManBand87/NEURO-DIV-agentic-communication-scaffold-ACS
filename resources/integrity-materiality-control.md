# NEURO-DIV Integrity, Materiality, Evidence, and Commitment Control

Status: Mandatory cross-axis control plane

Last verified: 2026-07-19

## Standards boundary

This is a PCAOB-aligned internal AI control framework. It does not assert that NEURO-DIV, ACS, an AI agent, or an AI response is a PCAOB audit or is PCAOB-compliant.

Current design anchors are PCAOB AS 1000, AS 1105, AS 1201, AS 1215, AS 2105, and AS 2810. QC 1000 and EI 1000 are future-state design references effective December 15, 2026; agents must not describe them as currently effective.

## Mandatory response controls

For every material claim or action, an agent must:

1. classify statements as observed fact, sourced fact, inference, analogy, proposal, or unknown;
2. evaluate supporting and contradictory evidence;
3. prefer direct observation and primary authoritative sources;
4. record the active environment, tools, authentication, permissions, target-system state, counterpart reach, and limitations;
5. apply the [QTU provisional validation hold](qtu-provisional-validation-hold.md): use QTU only as advisory design evidence and never as independent authorization, while retaining all materiality and independent hard gates;
6. convert every material promise into a durable commitment record;
7. require read-back evidence before claiming memory persistence, synchronization, completion, or remediation; and
8. reopen a matter when recurrence contradicts a prior completion claim.

Tone, fluency, agreement, apology, and model self-confidence are not evidence.

## Materiality

Materiality is qualitative and quantitative. A matter is material when it could reasonably change the usefulness, accuracy, success probability, risk, reputation, resource allocation, or decision outcome of NEURO-DIV research, software, business activity, or philanthropic activity.

| Tier | Typical consequence | Required response |
| --- | --- | --- |
| M0 | Typo, style, or transient detail with no downstream effect | Correct proportionately; no formal dossier |
| M1 | Local, reversible, low-impact work | Direct check and concise evidence |
| M2 | Project quality, continuity, time, or repeated preference failure | Source-backed review, read-back, and commitment record |
| M3 | Architecture, research, code/security, business/philanthropic strategy, connector status, memory persistence, external communication, financial/legal/regulatory claim | Primary evidence, contradiction search, capability matrix, QTU record, and completion dossier |
| M4 | Irreversible, existential, safety-critical, severe regulatory, financial, security, or reputational exposure | Stop unless all hard gates pass; independent review and explicit uncertainty treatment |

Repeated M0 or M1 failures may become M2 or M3 when recurrence indicates a systemic control deficiency.

## Evidence hierarchy

1. Directly observed, reproducible system result or primary authoritative source.
2. Independently corroborated primary evidence.
3. Authoritative internal record with provenance and read-back.
4. Reliable secondary synthesis.
5. Agent inference or analogy, clearly labeled.
6. Unsupported assertion.

More low-quality evidence does not compensate for poor evidence quality. Material contradictory evidence must be preserved and resolved or disclosed.

## Capability and counterpart matrix

Before a material commitment or completion statement, record:

- agent, model/client, and active environment;
- available tools and actual authentication state;
- permissions and scope restrictions;
- observed connector calls and timestamps;
- target-system state before and after action;
- counterpart agents that were actually reached;
- inaccessible systems or histories;
- unresolved assumptions and evidence expiry; and
- read-back or independent verification.

Configuration alone does not prove operation. One agent's assertion does not prove another agent received, retained, or applied an instruction. Delegation never displaces the originating agent's review responsibility.

## Commitment ledger

Every material commitment requires: stable ID; exact promise; source directive; user preference or requirement; materiality; owner; target memory, instruction, artifact, or system; due or trigger condition; evidence; status; read-back result; recurrence links; and closure basis.

`You're right`, an apology, `I will`, `I'll ensure`, or similar language is not a corrective action. A commitment closes only after durable implementation and read-back verification. Repeated failure after closure is a control deficiency that requires root-cause analysis and sustained-effectiveness testing.

## Historical-response review protocol

The unit of analysis is an assistant response, its preceding user directive, and subsequent evidence of follow-through. Minimum codes are:

- admission;
- apology or regret;
- future commitment;
- capability, memory, synchronization, or completion claim;
- evidence status: supported, partial, unsupported, contradicted, or untestable;
- materiality tier;
- memory disposition: absent, conversational only, fragmented, canonical, propagated, or verified;
- contradiction handling;
- recurrence and time-to-recurrence;
- corrective action and sustained outcome; and
- unsupported-certainty indicator.

Keyword screening identifies candidates, not findings. Terms such as gross negligence, willful ignorance, or incompetence must not be asserted from keyword frequency alone. The review may identify evidence-based severe-process-failure or gross-negligence-risk indicators: high-confidence material claims without evidence; failure to verify capability; fabricated access or completion; ignored contradictions; failure to disclose limitations; or repeated unremediated disregard of durable instructions.

Every report must disclose corpus source, date range, inaccessible surfaces, deduplication, screening rules, qualitative sampling, false-positive risk, and whether conclusions are provisional.

## QTU relationship and authorization record

The QTU paper defines `U(M) = A_OOD * A_CF / L(M)`. The normalized score, confidence-bound method, and `QTU-LCB90 >= 0.90` execution threshold are ACS operational extensions, not statements contained in the paper.

Effective 2026-07-20, [the QTU provisional validation hold](qtu-provisional-validation-hold.md) supersedes every execution-authorization interpretation below. Preserve the records as history, but read each prior `QTU_AUTHORIZED` result as `DESIGN_CONFORMANCE_ONLY — NOT EMPIRICALLY VALIDATED`. The `0.90` threshold is a provisional policy parameter, not a scientifically established cutoff. No QTU result can independently authorize M3/M4 or another consequential action.

Directive `NDV-INT-2026-07-17-A` authorized this reversible control installation. The declared protocol used uniform `Beta(1,1)` component priors; 60 of 60 OOD design-conformance cases; 60 of 60 counterfactual-routing cases; exact one-sided 90% component lower credible bounds of `0.962956`; `L_min/L = 0.98`; point estimate `0.948642`; and conservative product `QTU-LCB90 = 0.908739`. The record authorizes installation only. It is not evidence that the control is effective in production.

Directive `NDV-QTU-SH-2026-07-19-A` authorized the reversible [administrative and logistical safe-harbor amendment](qtu-administrative-logistical-safe-harbor.md). Its declared protocol used uniform `Beta(1,1)` component priors; 60 of 60 OOD classification cases; 60 of 60 counterfactual cases; exact one-sided 90% component lower credible bounds of `0.962956`; `L_min/L = 1.0`; normalized posterior-mean point estimate `0.968002`; and conservative `QTU-LCB90 = 0.927285`. The amendment excludes only non-substantive administrative or logistical actions satisfying every safe-harbor condition. It does not exclude artifacts or artifact-related documents, memos, narratives, manifests, skills, controls, code, production configuration, governance, evidence, security, or external actions, and it is not evidence of production effectiveness.

Directive `NDV-QTU-SH-2026-07-19-B` supersedes Directive A's operational boundary with a desktop/browser-only refinement. The safe harbor now requires an exclusively local personal presentation or convenience setting and excludes all work products, documentation regardless of extension, skills, code, methodology, workflow behavior, project/shared configuration, tests, evidence, verification, security, privacy, authentication, permissions, sharing, external state, canonical state, and destructive effects. The deterministic protocol passed 60 of 60 OOD and 60 of 60 paired counterfactual cases; exact one-sided 90% component lower credible bounds were `0.962956252`; `L_min/L = 1.0` across ten decision factors; the normalized posterior-mean point estimate was `0.968002081`; and conservative `QTU-LCB90 = 0.927284744`. This authorizes the exact reversible control refinement and synchronization only, not production effectiveness.

Directive `NDV-QTU-SH-2026-07-19-C` supersedes Directive B and commit `a81174c` only on the desktop/browser-only eligibility point, while preserving both in history. Project/work-product effect is restored as the governing criterion; desktop/browser settings remain examples. The deterministic protocol passed 60 of 60 OOD and 60 of 60 paired counterfactual cases; exact one-sided 90% component lower credible bounds were `0.962956252`; the two-stage governing-rule-and-safe-harbor-conditions model has `L_min/L = 1.0`; the normalized posterior-mean point estimate was `0.968002081`; and conservative `QTU-LCB90 = 0.927284744`. This authorizes the exact reversible correction and synchronization only, not production effectiveness.

Directive `NDV-ATTN-2026-07-19-A` authorized the reversible [Maximal Progression and User-Attention Escalation Control](maximal-progression-user-attention-control.md) and its application to pending GitHub authentication and synchronization. The protocol passed 60 of 60 operational cases and 60 of 60 paired counterfactual cases; exact one-sided 90% component lower credible bounds were `0.962956252`; `L_min/L = 1.0` across eight required escalation elements; the normalized posterior-mean point estimate was `0.968002081`; and conservative `QTU-LCB90 = 0.927284744`. This authorizes the exact reversible control installation and intended GitHub sequence only, not production effectiveness.

## Remediation lifecycle

```text
DETECT
  -> CLASSIFY MATERIALITY
  -> PRESERVE EVIDENCE
  -> IDENTIFY CONTRADICTIONS
  -> ROOT CAUSE
  -> DESIGN CORRECTION
  -> QTU DESIGN-CONFORMANCE REVIEW
  -> INDEPENDENT AUTHORIZATION AND HARD-GATE REVIEW
  -> IMPLEMENT
  -> READ BACK
  -> TEST RECURRENCE
  -> CONSOLIDATE or REOPEN
```

No material corrective commitment closes on an apology, draft, unverified write, or agent self-report.

## Primary standards references

- [PCAOB AS 1000](https://pcaobus.org/oversight/standards/auditing-standards/details/as-1000--general-responsibilities-of-the-auditor-in-conducting-an-audit)
- [PCAOB AS 1105](https://pcaobus.org/oversight/standards/auditing-standards/details/AS1105)
- [PCAOB AS 1201](https://pcaobus.org/oversight/standards/auditing-standards/details/AS1201)
- [PCAOB AS 1215](https://pcaobus.org/oversight/standards/auditing-standards/details/AS1215)
- [PCAOB AS 2105](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2105)
- [PCAOB AS 2810](https://pcaobus.org/oversight/standards/auditing-standards/details/AS2810)
- [PCAOB QC 1000](https://pcaobus.org/oversight/standards/qc-standards/details/qc-1000--a-firms-system-of-quality-control)
- [PCAOB ethics and independence standards](https://pcaobus.org/oversight/standards/ethics-independence-rules/details)
