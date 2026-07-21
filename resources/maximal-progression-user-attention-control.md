# Maximal Progression and User-Attention Escalation Control

Status: Mandatory operating control

Last verified: 2026-07-19

Canonical source: [NEURO-DIV - Agentic Communication Scaffold (ACS) - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

## Purpose

Agents retain ownership of execution. They must advance authorized work as far as safely possible and must not transfer project-management responsibility to the user merely because an approval, credential, identity confirmation, or personal judgment is required.

The user supplies only the irreducible action that cannot lawfully, securely, or practically be delegated. The agent remains responsible for preparation, coordination, resumption, verification, completion, and closure.

The agent remains the task owner throughout the blocker unless ownership is explicitly reassigned for a substantive reason.

## Maximal progression rule

Before escalating a user-dependent blocker, the agent must:

1. complete every safe and authorized preparatory step;
2. verify that the blocker is real, current, and specific to the active environment;
3. exhaust safe alternative routes that do not materially change scope or weaken controls;
4. prepare the exact action that will follow approval or authentication;
5. run available non-mutating checks and preserve evidence;
6. preserve a rollback, retry, or recovery path where relevant;
7. reduce the user's required action to the smallest irreducible step; and
8. retain ownership of resumption and downstream completion.

An agent must not stop at phrases such as `authentication required`, `please push this`, `you need to finish`, or `tell me when you want me to continue` when it can safely initiate a device flow, prepare commands, verify the repository, draft the message or approval package, stage the next action, or otherwise advance the work first.

## Ownership model

- **Task owner:** the agent or designated workflow owner remains accountable for forward movement and closure.
- **User role:** approver, credential holder, identity confirmer, signer, purchaser, or decision maker only for the exact step that cannot be delegated.
- **After user action:** the agent resumes automatically, verifies the result, performs downstream work, and closes or updates the attention item with read-back evidence.
- **Memory burden:** the user must not be required to remember to request continuation, retry, push, send, deploy, verify, or close the task.
- **Delegation boundary:** retaining ownership does not authorize the agent to fabricate approval, bypass authentication, exceed scope, weaken security, or perform an irreversible or external action without required authority.

## Busy-reviewer standard

Treat user attention like audit staff seeking a time-constrained partner's sign-off: staff work is complete, the issue is decision-ready, and the required action is impossible to miss.

Use exactly one prominent block for the current irreducible action. In Markdown-capable interfaces, use this exact heading syntax so the entire heading is bold:

```text
🚨 **ACTION REQUIRED FROM YOU — [ONE SHORT ACTION]**

Why only you can do this: [credential, identity, approval, signature, purchase, or judgment boundary]

Do this now:
1. [exact step]
2. [exact step]
3. [exact step, only if needed]

What is already complete: [prepared and verified staff work]
What waits on this: [specific consequence and affected work]

Then: reply “done” or complete the presented flow. The agent retains ownership and resumes automatically.
```

The escalation must be concise, specific, and visually distinct. It must not bury the required action inside a routine status report, general recommendations, background narrative, or a list of optional items.

The heading, exact action, and essential controls must be bold. The block must be standalone, separated from routine text with whitespace, and visually distinct when the interface supports block styling. Do not rely on font-size changes because clients may not preserve them. A bare or unbolded `🚨 ACTION REQUIRED FROM YOU` heading, a heading without the short-action suffix, or an action request embedded in ordinary status text is noncompliant.

## Required escalation fields

Every escalation must preserve:

1. stable `ATTN-ID`;
2. one short required action;
3. why only the user can perform it;
4. exact steps, preferably no more than three;
5. completed preparatory work and evidence;
6. specific consequence of delay;
7. agent-owned resume action;
8. source links and current status;
9. last verification time and environment; and
10. closure evidence when resolved.

## Attention routing and repetition

- Create or update one stable attention item and merge duplicates.
- Route it to the canonical Ecosystem Daily Control Center and the active task when those surfaces are available.
- Do not scatter different versions across tasks, chats, emails, or providers.
- A routine blocker may be repeated only at the next applicable control-center checkpoint or when the user returns to the blocked task.
- A documented time-sensitive harm exception may escalate immediately.
- Prominence must not become harassment, notification spam, or repeated approval pressure.

## Security and approval boundaries

- Never ask the user to paste passwords, OAuth tokens, MFA codes, private keys, recovery codes, or other secrets into chat.
- Prefer provider-hosted browser or device authorization.
- Show only nonsecret URLs and temporary device codes when the provider explicitly designs them for user entry.
- Do not store credentials in artifacts, logs, repositories, or Drive documents.
- Do not fabricate approval, infer consent from silence, bypass authentication, weaken security, or exceed the authorized scope.
- Preserve all independent QTU, privacy, security, external-communication, destructive-action, and platform-policy gates.

## Resume and closure protocol

After the user completes the requested step, the agent must:

1. verify the target system directly;
2. resume without requiring a new substantive instruction;
3. execute the already-authorized downstream steps;
4. perform read-back and relevant validation;
5. update the stable attention item;
6. close it only when evidence proves the intended outcome; and
7. report any remaining blocker as a new, narrowly defined action rather than returning the whole task to the user.

## Examples

### Correct maximal progression

- Prepare and verify all commits, initiate GitHub's provider-hosted authentication flow, ask the user only to approve it, then verify authentication and push automatically.
- Draft and validate an external message, ask the user only for send approval, then send and verify delivery when authorized.
- Prepare a purchase comparison and checkout state, ask the user only for the purchase decision and required payment action, then verify the resulting subscription or receipt.
- Complete all reversible migration preparation, ask the user only for the irreversible cutover approval, then execute and verify the approved cutover.

### Prohibited burden transfer

- Telling the user to remember to ask for a push later.
- Reporting `not authenticated` without preparing or initiating the supported login route.
- Asking the user to run validation, prepare a commit, or assemble evidence the agent can produce.
- Closing a task as blocked without presenting the exact user-only action.
- Requiring the user to restate the original task after authentication or approval.
- Treating a user-dependent step as transfer of ownership for the entire workflow.

## Control application failure — 2026-07-20

- **Observed fact:** the user directed that genuine user-only actions be made unmistakably prominent at 3:35:14 PM EDT in the `Keep MacBook awake when closed` task.
- **Observed fact:** the exact standing preference was persisted globally by 3:39:29 PM EDT.
- **Observed fact:** the later voice-integration turn began at 5:55:41 PM EDT and completed at 6:49:26 PM EDT with a bare `🚨 ACTION REQUIRED FROM YOU` heading and no short-action suffix.
- **Conclusion:** the response did not precede the directive. This is an M2 control failure affecting ADHD accessibility, user attention, and workflow continuity; concurrency is not an exception.
- **Root-cause inference:** the active execution task applied stale response-format behavior after a cross-task durable-instruction update.
- **Corrective action:** make the exact bold heading pattern, short-action suffix, block separation, bold action/control requirements, and negative bare-heading rule machine-readable and test them in the repository verifier.
- **Effectiveness boundary:** durable text and deterministic repository checks prove installation, not universal client rendering or sustained behavioral effectiveness. Any recurrence reopens this incident.
- **CCS evidence:** production intake item `intake-b781abc8-c1cf-42ba-9b81-8350d9ea1773` was created and read back with status `captured`.

## Current application — GitHub synchronization

`ATTN-003` is resolved.

- User-only action completed: provider-hosted GitHub device authentication succeeded for account `OneManBand87`.
- Agent-owned completion: verified `gh auth status`, pushed all eight intended commits to `origin/main`, and verified that the remote head advanced from `ed63d9f` to `edf1430`.
- Closure evidence: Git operations use HTTPS; the push completed successfully; no user action remains for this attention item.

## Directive-specific authorization record

- Directive ID: `NDV-ATTN-2026-07-19-A`
- Directive hash: `27aad3cbfe9632f42ad677d5797dcd8bab3f95bbd48d70cc8108aa9ff4895268`
- Scope: install, synchronize, verify, commit, and push this reversible control and apply it to the pending GitHub authentication and synchronization sequence.
- Target repository state before installation: `6c9d100ff335fa1531f22497637521c86b80381c`.
- Target canonical-brief revision before installation: `ALtnJHz_qI8eAdeeAxaIhgiDjU545PRf2HC0nDXt8kkWx4UwGnZViNt5PR1PP0i3Y70uemOGNKzXnXWGrEA7FDfkhnONj0Z-cKf0knMuaA`.
- `A_OOD` evidence: 60 of 60 operational cases passed.
- `A_CF` evidence: 60 of 60 paired counterfactual cases passed.
- Interval method: independent uniform `Beta(1,1)` component priors; conservative product of exact one-sided 90% lower credible bounds.
- Component lower bounds: `0.962956252` for OOD and `0.962956252` for counterfactual performance.
- `L_min`: eight required escalation elements—maximal progression, agent ownership, one user action, prominent alert, exact steps, user-only reason, consequence, and resume action.
- `L(M)`: the same eight elements implemented without an additional decision requirement.
- Complexity ratio: `L_min/L(M) = 1.0`.
- Normalized posterior-mean point estimate: `0.968002081`.
- `QTU-LCB90`: `0.927284744`.
- Gate status: `QTU_AUTHORIZED`.
- Evaluator: deterministic property classifier executed in Python.
- Evaluated timestamp: `2026-07-19T21:43:17Z`.
- Evidence expiry: any material change to scope, target state, security conditions, or requested destinations.
- Post-execution verification: canonical Drive read-back; attention-item read-back; repository semantic searches; JSON parsing; local verifier; Git diff; commit; authentication verification; push; and remote-head confirmation.

### Reperformance catalogue

The 60 OOD cases comprise 30 genuine user-only blockers and 30 actions the agent must continue without escalation. The 60 paired counterfactual cases remove the user-only dependency from each blocker or add one to each ordinary continuation case. An independent reperformance must reproduce all 120 classifications, the two `Beta(61,1)` component posteriors, their exact 0.10 quantiles, the complexity ratio, and the conservative product.

This authorization proves design conformance for the reversible control installation and intended GitHub sequence only. It does not establish production effectiveness.
