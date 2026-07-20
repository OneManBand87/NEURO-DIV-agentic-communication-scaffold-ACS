# NEURO-DIV - agentic communication scaffold (ACS)

These instructions apply to every AI agent working in this repository.

## Start here

1. Read [resources/agent-coordination.md](resources/agent-coordination.md).
2. Read [resources/agent-resources.json](resources/agent-resources.json) for machine-readable endpoints, capabilities, and status.
3. Read [resources/qtu-provisional-validation-hold.md](resources/qtu-provisional-validation-hold.md); it supersedes QTU as an execution-authorization gate pending independent empirical validation.
4. Read [resources/theory-branch-integration.md](resources/theory-branch-integration.md), including the QTU research functional and validation boundary.
5. Read [resources/qtu-administrative-logistical-safe-harbor.md](resources/qtu-administrative-logistical-safe-harbor.md) as historical scope guidance, subject to the validation hold.
6. Read [resources/integrity-materiality-control.md](resources/integrity-materiality-control.md) before making a material claim, commitment, or completion statement.
7. Read [resources/maximal-progression-user-attention-control.md](resources/maximal-progression-user-attention-control.md) before escalating a user-dependent blocker or transferring any action to the user.
8. Read [resources/automation-cost-cadence-proportionality-control.md](resources/automation-cost-cadence-proportionality-control.md) before creating, enabling, reactivating, or materially changing recurring, scheduled, polling, monitoring, retry, or background work.
9. Treat the canonical Google Doc as the source of truth when the authenticated client can access it:
   [NEURO-DIV - Agentic Communication Scaffold (ACS) - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit).
10. Use the repository snapshot when the canonical document is unavailable, and state that limitation.

## Shared architecture

- ACS is a communications subsystem within the larger NEURO-DIV architecture, not the entire framework.
- Parent architecture spine: [NEURO-DIV Core Foundation Document v1](https://docs.google.com/document/d/1DRlYOnp6AGBwRWOYgfh03gxNWxn6kaWSjmkddPa7gdY/edit). Treat it as an incomplete working spine pending multi-version reconstruction.
- ACS responsibilities include agent-to-agent handoffs, shared-state synchronization, narrative and cognitive feedback routing, context continuity, verification routing, and common tool access across ecosystem layers.
- Participating agent surfaces: Codex, Claude Code, GitHub Copilot/VS Code, Gemini through Antigravity, and Perplexity.
- Preferred common action layer: Zapier MCP at `https://mcp.zapier.com/api/v1/connect`.
- Project MCP definitions are versioned in [.mcp.json](.mcp.json) and [.vscode/mcp.json](.vscode/mcp.json). Authentication is always local and must never be committed.
- Reusable Zapier skills are versioned under [.agents/skills](.agents/skills) with [skills-lock.json](skills-lock.json).

## Operating rules

- Mandatory QTU validation hold: QTU is advisory and diagnostic, not an execution-authorization gate. Historical `QTU_AUTHORIZED` records mean `DESIGN_CONFORMANCE_ONLY — NOT EMPIRICALLY VALIDATED`. The `0.90` value is a provisional policy parameter, not a scientifically established cutoff. QTU cannot independently authorize M3/M4, irreversible, security/privacy, financial, legal, clinical, external, production, or consequential canonical actions. Apply [resources/qtu-provisional-validation-hold.md](resources/qtu-provisional-validation-hold.md) and all independent hard gates.
- Administrative and logistical safe harbor: the governing criterion is whether an action affects a project/work-product or anything used to define, produce, document, govern, configure, test, verify, reproduce, approve, publish, or communicate it. If yes, QTU applies. If no, a routine, non-substantive, bounded, reversible administrative or logistical action may qualify only when every condition in [resources/qtu-administrative-logistical-safe-harbor.md](resources/qtu-administrative-logistical-safe-harbor.md) passes. Desktop/browser settings are examples, not the definition. If applicability remains uncertain, QTU applies. Examples are illustrative and do not represent all possible activities, settings, purposes, dependencies, or effects.
- Artifact-related and protected activity remains within QTU scope regardless of storage location or file extension. This includes all work products and documentation (including Markdown and README files), memoranda, narratives, manifests, registries, indexes, metadata, schemas, evidence, provenance, implementation or status records, skills, agent instructions, controls, examples, templates, methodology, workflows, software code, dependencies, configuration, automation, accessibility requirements, tests, verification, security, privacy, authentication, permissions, sharing, publication, deployment, commits, pushes, and destructive changes.
- Security, privacy, scope, authentication, external-communication approval, destructive-action controls, and platform policy remain independent hard gates whether or not QTU applies.
- Mandatory integrity and materiality control: for material matters, distinguish observed fact, sourced fact, inference, analogy, proposal, and unknown; evaluate supporting and contradictory evidence; record environment and counterpart limitations; and require durable evidence plus read-back before claiming memory, synchronization, completion, or remediation. An apology, agreement, or future promise is not corrective action.
- Mandatory maximal-progression and user-attention control: agents retain task ownership, complete every safe and authorized preparatory step, reduce a genuine user dependency to one irreducible action, present it in an unmistakable `🚨 ACTION REQUIRED FROM YOU` block with exact steps and consequences, and resume automatically after the user acts. The user is an approver, credential holder, identity confirmer, signer, purchaser, or decision maker for the blocked step—not the workflow owner. Never ask the user to remember to request continuation.
- Mandatory automation cost, cadence, and proportionality control: before recurring or background work is created, enabled, reactivated, expanded, or materially changed, agents must apply [resources/automation-cost-cadence-proportionality-control.md](resources/automation-cost-cadence-proportionality-control.md). Bound total runs, expiry, cost, task creation, model/reasoning level, and tripwires; prefer event-driven and least-cost adequate execution; block unknown or disproportionate cost; and weigh the whole planned burden against importance and urgency.
- Native reminder and notification routing: ordinary one-time or recurring reminders and notifications must use the cheapest adequate device-native or product-native mechanism that invokes no AI model, such as Apple Reminders, Calendar reminders, local operating-system notifications, or the target product's native scheduler. Never create a Codex or other LLM automation merely to wait, poll, check time, or deliver a reminder. Use Codex automation only when execution-time work genuinely requires reasoning or tool actions and the automation cost control passes. Prefer native recurring reminders over recurring agent runs. If native cross-device delivery is unavailable, use the least-cost already-authorized reachable native channel, disclose the limitation, and reduce the user dependency to the smallest sync or authentication step; never silently substitute an expensive Codex automation. Codex native notifications are reserved for meaningful Codex work completion or a genuine user-only blocker. Preserve task ownership and never require the user to remember to return.
- Do not create a competing source of truth. Update the canonical brief and then refresh the repository snapshot.
- Do not claim that a connector works unless a real read-only call has been verified.
- Never commit OAuth tokens, API keys, cookies, callback codes, credential files, or exported browser data.
- Before changing shared-agent configuration, preserve a reversible backup or use version control.
- Keep user-facing project artifacts in Google Drive under `My Drive / ChatGPT Projects / [Project Name]` using the standard folders `00 Project Index`, `01 Instructions`, `02 Working Files`, `03 Manifests and Data`, `04 Deliverables`, and `99 Archive`.
- Name artifacts `[Project] - [Artifact] - [Status or Version] - [YYYY-MM-DD]`; stable standing documents may omit the date and use Drive revision history.
- For a client without live MCP or Drive access, use its persistent instruction mechanism to point back to this repository and the canonical brief, and disclose that it is a fallback rather than a live connection.

## Synchronization protocol

When the coordination state changes:

1. Update the canonical Google Doc through Zapier when available.
2. Update `resources/agent-coordination.md` and `resources/agent-resources.json` in the same change.
3. Run `./scripts/verify-agent-resources.sh`.
4. Commit the repository changes with a concise message.
5. Push only to the intended GitHub repository and do not assume repository visibility.
