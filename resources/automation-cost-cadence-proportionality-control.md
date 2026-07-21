# Automation Cost, Cadence, and Proportionality Control

Status: Mandatory operating control

Last verified: 2026-07-19

Canonical source: [NEURO-DIV - Agentic Communication Scaffold (ACS) - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

## Purpose

Before any agent creates, enables, reactivates, expands, or materially changes a recurring, scheduled, polling, monitoring, retry, or background workflow, it must weigh the full expected usage and user-attention cost against the importance, urgency, expiry risk, and expected usefulness of the action.

Automation is not justified merely because it is technically possible or generally authorized. Authorization answers whether an action may occur; this control determines whether the chosen recurring mechanism, cadence, model, and burden are proportionate.

## Applicability

This control applies to:

- cron and interval automations;
- recurring Codex tasks and heartbeats;
- polling loops, monitors, retries, and scheduled connector calls;
- event-driven workflows with material recurring execution cost;
- material changes to cadence, model, reasoning level, prompt/context size, tool mix, notification behavior, task creation, run limits, or expiry; and
- reactivation after a pause, failure tripwire, cost overrun, or user complaint.

QTU, privacy, security, authentication, scope, external-communication approval, destructive-action, and platform-policy gates remain independent. This control never waives them.

## Native reminder and notification routing

For ordinary one-time or recurring reminders and notifications, default to the cheapest adequate device-native or product-native mechanism that invokes no AI model. Preferred routes include Apple Reminders, Calendar reminders, local operating-system notifications, and the target product's native notification scheduler. Prefer native recurring reminders over recurring agent runs.

Never create a Codex or other LLM automation merely to wait, poll, check the time, or deliver a reminder. A simple reminder must not consume Codex runs or reasoning tokens, create a task per occurrence, or repeatedly poll. Use Codex automation only when execution-time work genuinely requires Codex reasoning or tool actions; when it is unavoidable, apply this entire control, including event-driven execution first, the cheapest adequate model, bounded runs and expiry, consolidated state, no-op suppression, and the required error, no-op, and user-cost tripwires.

If native cross-device delivery is unavailable because sync or authentication is disabled, use the least-cost already-authorized reachable native channel, clearly disclose the reachability limitation, and reduce the user dependency to the smallest authentication or sync step. Never silently substitute an expensive Codex automation. Codex native notifications remain appropriate for meaningful Codex work completion or a genuine user-only blocker, not generic clock-based reminders. Preserve task ownership and never require the user to remember to return.

## Mandatory decision record

The preflight record must state:

1. task importance;
2. deadline or harm window;
3. event-driven alternatives considered;
4. expected probability that a run produces useful new information or work;
5. maximum run count;
6. expiry and terminal success condition;
7. proposed runs per day;
8. model and reasoning level;
9. prompt/context size and expected tool burden;
10. whether each run creates a user-visible task or notification;
11. monetary estimate when available, otherwise a conservative bounded ordinal cost band;
12. error and no-op tripwires;
13. rollback or pause path; and
14. evidence supporting the cadence and cost assumptions.

Unknown or unbounded cost is not zero. Missing maximum runs, expiry, terminal condition, cost bound, or tripwires blocks activation.

## Cost-versus-importance gate

Classify importance:

| Importance | Rank | Meaning |
| --- | ---: | --- |
| Low | 1 | Convenience or low-value housekeeping with little consequence of delay |
| Normal | 2 | Useful project work without near-term material harm |
| High | 3 | Important deliverable, continuity, or opportunity with material delay cost |
| Critical | 4 | Time-sensitive security, privacy, financial-loss, legal-deadline, credential-compromise, irreversible-window, or externally committed deadline harm |

Classify bounded base cost:

| Cost | Rank | Meaning |
| --- | ---: | --- |
| Low | 1 | Cheapest adequate model, minimal context/tools, bounded light cadence, no task churn |
| Medium | 2 | Standard model or moderate bounded cadence/context/tool burden |
| High | 3 | Frontier/high-reasoning model, frequent execution, large context/tool burden, or material user-attention cost |
| Extreme or unbounded | 4 | Missing bounds or a design capable of substantial open-ended usage, task churn, or monetary exposure |

Increase adjusted cost by one rank, capped at four, for each applicable burden:

- more than four runs per day;
- a new user-visible task per run; and
- a frontier model or high reasoning level.

Decision rule:

- Importance must exceed adjusted cost.
- Equality requires explicit user approval of the bounded cost and design.
- Unbounded cost always blocks activation.
- High or extreme cost requires explicit user approval even when importance is higher.
- A cost estimate must cover the whole planned monitoring window, not one run in isolation.

These ranks are active operational thresholds for automation routing. Dollar estimates, when available, improve the record but do not replace qualitative materiality.

## Least-cost adequate execution

Apply this order:

1. Use an event-driven trigger before polling when a reliable event surface exists.
2. If polling is necessary, use the slowest cadence that still protects the documented harm window.
3. Use the cheapest model and lowest reasoning level proven adequate.
4. Minimize prompt/context size and tool calls for routine checks.
5. Keep status in one consolidated task or control-center record.
6. Make no-op runs terse and non-user-facing.
7. Stop automatically on success, expiry, run ceiling, budget ceiling, or a tripwire.

A frontier or high-reasoning model is prohibited for a binary presence/absence check unless evidence shows a cheaper route is inadequate.

More than four routine runs per day requires all of the following: critical importance, a documented harm window within six hours, explicit cost approval, and a bounded run plan.

A new user-visible task per run is prohibited unless the task is critical, capped at four runs, and explicitly approved. If the platform necessarily creates a new task for every cron run, that platform mechanism is treated as task churn and must be replaced, consolidated, or specifically approved under this rule.

## Budgets and tripwires

Every recurring workflow must include:

- a maximum run count;
- an expiry;
- a terminal success condition;
- a bounded usage budget or conservative ordinal cost band;
- automatic pause after two consecutive system errors;
- automatic pause after three consecutive no-op runs;
- a rollback or pause path; and
- direct read-back of status, actual run count, and available usage/cost evidence.

On a tripwire, pause first. Investigation and redesign precede reactivation. A user complaint about unexpected cost or task proliferation is an immediate pause condition.

## Review and reactivation

Reactivation requires a new preflight record when scope, cost, cadence, model, platform behavior, or security conditions changed. A workflow paused for cost or task churn may not resume merely because its original authorization remains valid.

Completion or sustained-effectiveness claims require actual usage/cost and task-creation read-back where available. Configuration alone is not proof that the control worked.

## Incident record — ChatGPT export monitoring

- **Observed fact:** the automation was configured at `FREQ=MINUTELY;INTERVAL=15`, equivalent to 96 runs per day.
- **Observed fact:** it used `gpt-5.6-sol` with `reasoning_effort = "high"` for a binary ready-email check.
- **Observed fact:** Codex created ten standalone automation tasks; four had `systemError` status before the workflow was paused.
- **Observed fact:** no new ready-export email was found during the reviewed runs.
- **Observed fact:** the automation is now `PAUSED`; nine older duplicate tasks were archived, not deleted.
- **Sourced fact:** the user reports substantial usage consumption and that additional usage had to be purchased.
- **Inference:** absence of cost, cadence, model, task-churn, run-limit, and failure tripwires permitted avoidable consumption.
- **Contradictory evidence:** the original directive permitted a scheduled task and required prompt download once the export became ready; that supports monitoring, but does not establish that fifteen-minute high-cost standalone runs were proportionate.
- **Unknown:** exact provider charges attributable to these runs and whether every visible run consumed the same amount.

The affected automation may not be reactivated until it is redesigned and authorized under this control.

## Directive-specific authorization record

- Directive ID: `NDV-COST-2026-07-19-A`
- Directive hash: `59440be80776be0f83b9b381a62ee1d46a3aec36c8dd49d25d6908d902e9183b`
- Scope: install, synchronize, verify, commit, and push this reversible control; keep the affected export automation paused; do not reactivate it without a compliant bounded design and required approval.
- Target repository state before installation: `d91b1cca0065d7c4e156bd16a27fa442b933221d`
- Target canonical revision before installation: `ALtnJHyA6Dg1iYVQzigRV3vO8sEJctgAX2Nouhpklq4g_Li5Lw7UGx0YlWM22koYQSkZc1ihnx_k2Jx-oGJVkszhM06bmTWKsAA-Nh0VKA`
- OOD design-conformance evidence: 60 of 60 cases passed.
- Paired counterfactual-routing evidence: 60 of 60 cases passed.
- Interval method: independent uniform `Beta(1,1)` component priors; conservative product of exact one-sided 90% lower credible bounds.
- Component lower bounds: `0.962956252` and `0.962956252`.
- Complexity: thirteen required control elements implemented without an additional decision requirement; `L_min/L(M) = 1.0`.
- Normalized posterior-mean point estimate: `0.968002081`.
- `QTU-LCB90`: `0.927284744`.
- Gate status: `QTU_AUTHORIZED`.
- Evaluator: deterministic JavaScript classifier and paired counterfactual catalogue.
- Evaluated: 2026-07-19.
- Evidence expiry: any material change to control logic, thresholds, scope, target destinations, security conditions, or the affected automation's intended design.
- Post-execution verification: canonical Google Doc read-back, repository semantic checks, JSON parsing, local verifier, automation-status read-back, task-state read-back, Git diff, commit, authentication check, push, and remote-head confirmation where authentication permits.

This authorization proves design conformance for the exact reversible installation and synchronization scope only. It does not prove real-world cost savings or sustained effectiveness.

## Native reminder routing authorization record

- Directive ID: `NDV-NOTIFY-2026-07-19-A`
- Directive hash: `5b6c80324c80b0f27cd556982b275972d92ffd5b7d3658fd0cdde59d896f0b4b`
- Scope: install, synchronize, verify, commit, and push the durable native-first reminder and notification instruction; do not create or enable any recurring automation.
- Target repository state before installation: `fb009d19a32620bd60acf510fab54c5aebb69237`.
- Target canonical revision before installation: `ALtnJHzSOSPLxmn3s_xBtcHV-AvLHmrfWtA2brmDsG6IBm5CxY1pVL3QiVGEl8Pyl_Yodl3y5v_2GCROjL2DjpOc1r1N1zq8Aw0AN6OuTg`.
- OOD design-conformance evidence: 60 of 60 cases passed.
- Paired counterfactual-routing evidence: 60 of 60 cases passed.
- Interval method: independent uniform `Beta(1,1)` component priors; conservative product of exact one-sided 90% lower credible bounds.
- Component lower bounds: `0.962956252` and `0.962956252`.
- `L_min`: eight required routing elements: native no-model default, no Codex waiting or reminder polling, Codex only for genuine reasoning or tool work, native recurrence preference, least-cost disclosed fallback, restricted Codex notifications, preserved task ownership, and no recurring automation created by this directive.
- `L(M)`: the same eight elements implemented without an additional decision requirement; `L_min/L(M) = 1.0`.
- Normalized posterior-mean point estimate: `0.968002081`.
- `QTU-LCB90`: `0.927284744`.
- Gate status: `QTU_AUTHORIZED`.
- Evaluator: deterministic JavaScript property classifier and paired counterfactual catalogue.
- Evaluated: `2026-07-20T01:51:48Z`.
- Unresolved assumption: native cross-device sync and authentication availability varies by product and device; the rule requires explicit limitation disclosure and the cheapest reachable native fallback.
- Evidence expiry: any material change to rule scope, destination documents, automation permissions, cost-control logic, or security conditions.
- Post-execution verification: canonical Google Doc read-back, global and repository `AGENTS.md` read-back, repository semantic checks, JSON parsing, local verifier, Git diff, commit, authentication check, push, and remote-head confirmation where authentication permits.

This authorization proves design conformance for the exact reversible instruction installation and synchronization only. It does not establish production effectiveness, cross-device reachability, or permission state.
