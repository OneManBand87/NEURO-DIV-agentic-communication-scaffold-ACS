# NEURO-DIV - agentic communication scaffold (ACS) - Repository Snapshot

Last verified: 2026-07-20

Canonical source: [NEURO-DIV - Agentic Communication Scaffold (ACS) - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

Parent architecture spine: [NEURO-DIV Core Foundation Document v1](https://docs.google.com/document/d/1DRlYOnp6AGBwRWOYgfh03gxNWxn6kaWSjmkddPa7gdY/edit)

## Architecture

ACS is the communications subsystem of the larger NEURO-DIV systematic architecture. It coordinates agent-to-agent handoffs, shared operational state, narrative and cognitive feedback routing, context continuity, verification, and common tool access across ecosystem layers. The repository is its portable discovery layer, the Google Doc is its canonical standing brief, and Zapier MCP is its preferred common action layer.

ACS is not the whole NEURO-DIV framework. The Core Foundation Document is the current parent spine, but it is incomplete and contains transcription contamination. A separate architecture reconstruction must compare the surviving versions, identify missing components, resolve contradictions, and integrate ACS at every applicable layer.

The current theory-to-system crosswalk is documented in [theory-branch-integration.md](theory-branch-integration.md). Its controlling chain is: WIPED behavioral state -> adaptive branch parameters -> branch-structured reasoning -> CBAL identity and lineage -> ACS routing and synchronization -> distributed-worker execution -> verification, convergence, consolidation, and garbage collection. WIPED is a provisional behavioral-adaptation model, not the whole NEURO-DIV theory or a clinically validated universal equation.

QTU is under a mandatory [provisional validation hold](qtu-provisional-validation-hold.md). The normalized score `U_norm = A_OOD * A_CF * (L_min / L(M))`, its one-sided 90% interval, and the `0.90` threshold are ACS research extensions, not an independently validated execution gate. Historical `QTU_AUTHORIZED` records mean `DESIGN_CONFORMANCE_ONLY — NOT EMPIRICALLY VALIDATED`; `0.90` is a provisional policy parameter. QTU cannot independently authorize M3/M4 or consequential action. The original functional is in [A Quantitative Theory of Understanding rev1](https://drive.google.com/file/d/1MOxQjpZ59JzOOZs9EsFEuq49DKN3TkjW).

The mandatory [QTU Administrative and Logistical Safe Harbor](qtu-administrative-logistical-safe-harbor.md) is governed by project/work-product effect, not application or environment. An action affecting a project/work-product or anything used to define, produce, document, govern, configure, test, verify, reproduce, approve, publish, or communicate it remains within QTU. Otherwise, a routine, non-substantive, precisely bounded, readily reversible administrative or logistical action may qualify only when every safe-harbor condition and independent hard gate passes. Desktop/browser settings are examples, not the definition. Its examples are illustrative and do not represent all possible activities, settings, purposes, dependencies, or effects; uncertainty returns the action to QTU.

The mandatory [Integrity, Materiality, Evidence, and Commitment Control](integrity-materiality-control.md) governs material claims and completion assertions. It is PCAOB-aligned, not a claim of PCAOB compliance. It requires fact/inference separation, supporting and contradictory evidence, proportional materiality routing, capability and counterpart awareness, durable commitment records, and read-back before claims of memory, synchronization, completion, or remediation. The QTU paper defines the understanding functional; the normalized score, confidence-bound method, and 0.90 threshold are ACS operational extensions.

The mandatory [Maximal Progression and User-Attention Escalation Control](maximal-progression-user-attention-control.md) keeps task ownership with the agent. Before escalating, agents must complete all safe authorized preparation, verify the blocker, reduce the user's role to one irreducible approval or credential step, and present one prominent `🚨 ACTION REQUIRED FROM YOU` block with exact steps, completed work, consequences, and the agent-owned resume action. After the user acts, the agent resumes automatically and verifies closure; the user is not required to remember to request continuation.

The mandatory [Automation Cost, Cadence, and Proportionality Control](automation-cost-cadence-proportionality-control.md) governs recurring, scheduled, polling, monitoring, retry, and background work. It requires a whole-window cost-versus-importance preflight; event-driven and least-cost adequate execution; bounded runs, expiry, cost, model/reasoning level, task creation, and tripwires; and automatic pause after two consecutive system errors, three consecutive no-op runs, or a user cost complaint. Unknown, unbounded, or disproportionate cost blocks activation.

The native reminder and notification routing rule requires ordinary one-time or recurring reminders to use the cheapest adequate device-native or product-native mechanism that invokes no AI model, including Apple Reminders, Calendar reminders, local operating-system notifications, or the target product's native scheduler. Never create a Codex or other LLM automation merely to wait, poll, check time, or deliver a reminder. Codex automation is reserved for execution-time work that genuinely requires reasoning or tool actions and still must pass the automation cost control. Native recurring reminders are preferred over recurring agent runs. If native cross-device delivery is unavailable, agents must disclose the reachability limitation and use the least-cost already-authorized reachable native channel rather than silently substituting an expensive Codex automation. Codex native notifications are reserved for meaningful Codex completion or a genuine user-only blocker, while task ownership remains with the agent.

## ACS Command Center

The [private ACS Command Center](https://acs-command-center.onemanband87.chatgpt.site) is the ADHD-friendly management surface for current priorities, universal intake, exact-payload approvals, recruiter response SLAs, the six approved parent branches, project plans and timeline health, agent status, suggested next actions, and AI usage controls. Version 0.2 is the current owner-only production deployment; version 0.3 universal-intake source and native macOS routing are implemented locally pending production deployment and end-to-end read-back.

The implementation lives under `apps/acs-command-center`. Its production surface uses a durable D1 operational index; Google Drive remains canonical. The [project index](https://docs.google.com/document/d/1yy0OeOAsqi-qLBABiZPWPYng8mAkV0CSpUHE6sJ7fL4/edit), [approved architecture and controls](https://docs.google.com/document/d/1Fop9QaYrLrQMlnLRcEvDBsnVghm1gBK96BEzFmoFHos/edit), and [v0.2 release record](https://docs.google.com/document/d/1CrZ7ZVCDDflLUcfUevnquadmC2f1hBWdhLJ2XxBRP6M/edit) are stored in the canonical Drive project.

Verified implementation evidence includes successful production build, lint, source/build contract tests, D1 health and state responses, MCP initialization, seven-tool discovery, live dashboard-state return, Drive artifact read-back, owner-only Sites version 3 deployment, a live read from the authorized `eliekurtz01@gmail.com` mailbox, and production intake of two LinkedIn recruiter notifications with two prepared replies and two exact-draft approvals. Production verification also confirmed safe DOM widget rendering, strict bounded request validation, cross-origin mutation rejection, no-store API responses, baseline response security headers, and a zero-vulnerability production dependency audit. The MCP/ChatGPT-app server is implemented and locally verified but is not yet registered as a ChatGPT developer connector.

Universal-intake v0.3 adds one normalized queue for screenshots, screen recordings, files, URLs, selected text, and media. The macOS screenshot destination and event-driven LaunchAgent are installed; a `Send to NEURO-DIV` Share Sheet shortcut is configured; device secrets remain in Keychain; metadata is bounded and deduplicated; raw inputs remain in device-synced Apple intake storage; and routed artifacts remain canonical in Google Drive. The production endpoint and cross-device Shortcut synchronization remain pending verification until v0.3 is deployed and read back.

Recruiter response policy is a two-hour target, three-hour critical escalation, and same-day hard deadline. The compliant LinkedIn route uses individual LinkedIn email notifications delivered to Gmail, event-driven processing, draft preparation, and one-tap copy/open controls, with manual mobile sharing as fallback. No scraping or prohibited automated LinkedIn activity is authorized. Continuous notification-event delivery, the second Gmail account, native alerts, and end-to-end same-day handling remain pending; no recurring AI polling was enabled.

Active context should be compacted after substantive conclusions or state-changing work while full transcript, evidence, rationale, dissent, and superseded material remain preserved in history or archive. Task titles and branch classification should then be reviewed so the task reflects its actual primary matter and preserves the ideation-to-execution trail.

## Capability matrix

| Client | Repository context | Zapier MCP | Verified status |
| --- | --- | --- | --- |
| Codex | `AGENTS.md` | User-level connection | Operational |
| Claude Code | `CLAUDE.md`, `AGENTS.md`, `.mcp.json` | Project and user configuration | Operational; project config may require local approval/authentication |
| GitHub Copilot / VS Code | `.github/copilot-instructions.md`, `AGENTS.md` | `.vscode/mcp.json` | Zapier MCP authenticated and running; Copilot GitHub sign-in still required |
| Gemini CLI | `GEMINI.md`, `AGENTS.md` | Project endpoint documented | Individual-account onboarding blocked by Google migration notice |
| Antigravity | `GEMINI.md`, `AGENTS.md` | Configured and OAuth-authenticated | Live Zapier calls fail on unauthorized MCP notification traffic |
| Perplexity | Persistent custom instructions | No Zapier/custom MCP exposed on current Free account | Shared context verified; live common action layer unavailable |
| Other LLMs | `AGENTS.md`, this snapshot, JSON manifest | Use the documented HTTP endpoint if supported | Client-dependent |

## Available resources

- Public GitHub repository: [OneManBand87/NEURO-DIV-agentic-communication-scaffold-ACS](https://github.com/OneManBand87/NEURO-DIV-agentic-communication-scaffold-ACS).
- Legacy prototype recovery branch: `archive/neuro-div-bolt-prototype-2026-07-16`.
- Canonical standing brief in Google Drive.
- Portable repository instructions for generic agents, Claude, Gemini, and GitHub Copilot.
- Machine-readable resource and capability manifest.
- WIPED, branch-structured reasoning, CBAL, ACS, worker-plane, and integrity-plane crosswalk.
- Mandatory QTU provisional validation hold, design-conformance assessment schema, and independent-hard-gate routing.
- Mandatory project/work-product-effect administrative and logistical safe-harbor control with non-exhaustive in-scope, out-of-scope, and borderline examples plus a reproducible authorization record.
- Mandatory PCAOB-aligned integrity, materiality, evidence, capability-awareness, and commitment controls, plus a [provisional cross-platform response-integrity baseline](https://docs.google.com/document/d/1_IDPhh_j5sIROhqpGFtEpEtFq03QHUdU594yTWfgJvc).
- Mandatory maximal-progression, agent-ownership, and prominent user-attention escalation control.
- Mandatory automation cost, cadence, task-churn, budget, and proportionality control.
- Mandatory native, no-model-first reminder and notification routing with Codex automation prohibited for simple waiting, polling, time checks, or reminder delivery.
- Project-scoped MCP configuration for VS Code and Claude Code.
- Project-local Codex context reminder hooks in `.codex/hooks.json` and `.codex/hooks/ndv_context_hook.py`.
- Zapier SDK and durable-workflow skills under `.agents/skills`.
- A local verifier that checks required files, JSON syntax, endpoint consistency, and obvious secret-bearing files.
- Private ACS Command Center v0.2, its canonical Drive project records, exact-payload approval queue, two ingested recruiter items and prepared replies, recruiter SLA model, agent ledger, Usage Sentinel, D1 operational index, and locally verified seven-tool MCP/ChatGPT-app server.

GitHub synchronization attention item `ATTN-003` is resolved. Provider-hosted device authentication succeeded for account `OneManBand87`; all eight intended local commits were pushed to `origin/main`, and the remote head advanced from `ed63d9f` to `edf1430` before the closure-record update.

## Codex project hooks

Codex has a narrow project-local hook layer for this repository. The hook configuration lives at `.codex/hooks.json` and calls `.codex/hooks/ndv_context_hook.py` for `SessionStart`, `UserPromptSubmit`, and `PostCompact`.

The hook is intentionally read-only. When the active `cwd` is inside `/Users/dinamargelovich/Documents/General`, it emits a compact context reminder to read the repository snapshot and controls before material claims or state-changing work unless canonical Drive access has been directly verified. Outside this workspace it emits nothing. It does not log prompts, write to Drive, block tools, communicate externally, or handle credentials.

Directive `NDV-HOOKS-2026-07-19-A` authorized this reversible hook installation and synchronization. The dry-run protocol passed 60 of 60 OOD context-routing cases and 60 of 60 counterfactual/non-leakage cases. Using independent uniform `Beta(1,1)` component priors, exact one-sided 90% component lower credible bounds of `0.962956`, and `L_min/L = 1.0`, the conservative `QTU-LCB90` is `0.927285`. This is authorization for the narrow hook layer only, not evidence of production effectiveness.

## Synchronization rule

The canonical brief is authoritative. After a verified state change, update it first when possible, then update this snapshot and `agent-resources.json` in the same Git change. If the canonical brief is inaccessible, label repository changes as pending reconciliation.
