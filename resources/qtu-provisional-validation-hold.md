# QTU Provisional Validation Hold

Status: Mandatory interim superseding control

Effective: 2026-07-20

## Controlling conclusion

The Quantitative Theory of Understanding (QTU) functional remains useful as a research and design diagnostic. The current ACS normalization, confidence-bound construction, 60-case protocols, and `0.90` threshold have not been independently established as a valid real-world execution-authorization mechanism.

Until a separate empirical validation is completed and explicitly adopted, QTU is advisory and diagnostic only. It may identify uncertainty, demand more evidence, or block overclaiming, but it cannot independently authorize a state-changing action.

## Immediate interpretation rule

- Preserve historical QTU records, labels, numerical results, directive IDs, and commits as provenance.
- Interpret every historical `QTU_AUTHORIZED` label as `DESIGN_CONFORMANCE_ONLY — NOT EMPIRICALLY VALIDATED`.
- Do not describe `0.927284744`, `0.927285`, `0.908739`, or any similar result as evidence of real-world effectiveness, safety, validity, or authorization.
- Retain `0.90` only as a provisional policy parameter selected for risk preference. It is not a scientifically established cutoff, and a 90% interval is not the same thing as 90% confidence that a conclusion is correct.
- Do not work backward from a preferred score, threshold, expectation, or conclusion when defining tests, cases, complexity, priors, or interval methods.

## Consequential-action rule

QTU must never be the sole or decisive authorization for:

- M3 or M4 materiality;
- irreversible or destructive action;
- security, privacy, authentication, credential, permission, or sharing changes;
- financial, legal, regulatory, clinical, or safety-sensitive activity;
- external communication, publication, deployment, production change, or consequential canonical write.

Those actions require the applicable independent authorization, capability, evidence, materiality, security, privacy, and user-scope controls regardless of any QTU result.

## Required active gates

Before a material completion, effectiveness, authorization, or remediation assertion, require:

1. direct evidence tied to the exact target and state;
2. a search for contradictory and disconfirming evidence;
3. materiality classification and consequence routing;
4. capability, authentication, privacy, security, scope, and external-communication checks;
5. durable change and provenance records;
6. post-write or post-action read-back;
7. independent review for M3/M4 or other consequential matters.

Self-authored design tests may demonstrate internal consistency or design conformance. They do not, by themselves, demonstrate empirical effectiveness, independence, generalization, or absence of bias.

## Active status vocabulary

- `QTU_UNESTABLISHED`: evidence or method is insufficient for even design assessment.
- `QTU_VERIFYING`: a declared assessment is in progress.
- `QTU_DESIGN_CONFORMANT`: the artifact passed a declared design-conformance protocol; no empirical authorization follows.
- `QTU_BLOCKED`: evidence or an independent hard gate blocks the proposed conclusion or action.
- `QTU_EMPIRICALLY_VALIDATED`: reserved; unavailable unless an independent validation package is approved under this control.

Historical `QTU_AUTHORIZED` maps to `QTU_DESIGN_CONFORMANT` and does not map to `QTU_EMPIRICALLY_VALIDATED`.

## Minimum validation package before reinstatement

A proposal to reinstate QTU as an execution gate must include, at minimum:

- a preregistered protocol and frozen scoring rules;
- representative, held-out cases not authored or selected to confirm the target conclusion;
- independent evaluators and documented adjudication;
- explicit negative controls and failure cases;
- justified sampling assumptions and dependence analysis;
- an operational, reproducible definition of complexity and `L_min/L`;
- joint uncertainty analysis rather than an unexplained product of component bounds;
- calibration against observed prospective outcomes and consequence severity;
- sensitivity analysis across priors, thresholds, datasets, and scoring choices;
- a documented limitations statement and independent approval.

No historical numerical result can reinstate the gate automatically.

## Basis and change authority

This hold implements the user's explicit 2026-07-20 direction to prevent circular validation of a pre-established expectation. It is a conservative, reversible correction: historical records are retained, active claims are narrowed, and stronger independent controls remain in force. It does not rely on QTU to validate QTU.

The original QTU paper defines the raw functional `U(M) = A_OOD(M) * A_CF(M) / L(M)`. The normalized score, the `0.90` threshold, the Beta-binomial component-bound method, and the 60-case execution protocols are ACS operational extensions rather than results established by that paper.

Research guidance:

- NIST AI RMF Measure guidance: https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
- NIST AI TEVV: https://www.nist.gov/ai-test-evaluation-validation-and-verification-tevv
- NIST binomial-model assumptions: https://www.itl.nist.gov/div898/handbook/eda/section3/eda366i.htm
- NIST confidence intervals: https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm

## Review and reinstatement

This hold remains controlling until a later, explicit, versioned decision replaces it. Any replacement must preserve this record, identify the validating evidence, state who performed the independent review, and explain why the proposed use is not circular.
