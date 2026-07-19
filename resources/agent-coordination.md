# NEURO-DIV - agentic communication scaffold (ACS) - Repository Snapshot

Last verified: 2026-07-19

Canonical source: [NEURO-DIV - Agentic Communication Scaffold (ACS) - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

Parent architecture spine: [NEURO-DIV Core Foundation Document v1](https://docs.google.com/document/d/1DRlYOnp6AGBwRWOYgfh03gxNWxn6kaWSjmkddPa7gdY/edit)

## Architecture

ACS is the communications subsystem of the larger NEURO-DIV systematic architecture. It coordinates agent-to-agent handoffs, shared operational state, narrative and cognitive feedback routing, context continuity, verification, and common tool access across ecosystem layers. The repository is its portable discovery layer, the Google Doc is its canonical standing brief, and Zapier MCP is its preferred common action layer.

ACS is not the whole NEURO-DIV framework. The Core Foundation Document is the current parent spine, but it is incomplete and contains transcription contamination. A separate architecture reconstruction must compare the surviving versions, identify missing components, resolve contradictions, and integrate ACS at every applicable layer.

The current theory-to-system crosswalk is documented in [theory-branch-integration.md](theory-branch-integration.md). Its controlling chain is: WIPED behavioral state -> adaptive branch parameters -> branch-structured reasoning -> CBAL identity and lineage -> ACS routing and synchronization -> distributed-worker execution -> verification, convergence, consolidation, and garbage collection. WIPED is a provisional behavioral-adaptation model, not the whole NEURO-DIV theory or a clinically validated universal equation.

QTU is the mandatory epistemic execution gate for state-changing directives within QTU scope. The normalized score is `U_norm = A_OOD * A_CF * (L_min / L(M))`. ACS may route an in-scope directive into execution only when its one-sided 90% lower confidence bound satisfies `QTU-LCB90 >= 0.90`. A point estimate alone is insufficient; missing, stale, or non-reproducible evidence blocks in-scope execution. The canonical source is [A Quantitative Theory of Understanding rev1](https://drive.google.com/file/d/1MOxQjpZ59JzOOZs9EsFEuq49DKN3TkjW).

The mandatory [QTU Administrative and Logistical Safe Harbor](qtu-administrative-logistical-safe-harbor.md) is limited to routine, non-substantive, precisely bounded, readily reversible changes affecting only the user's local personal desktop or browser presentation, accessibility presentation, input convenience, window or tab arrangement, or personal reading experience. It is not a general computer-administration exemption. Work products, documentation of every extension (including Markdown and README files), skills, code, methodology, workflow behavior, project or shared configuration, evidence, verification, security, privacy, authentication, permissions, sharing, external state, publication, commits, pushes, and destructive actions remain within QTU scope. Its examples are illustrative and do not represent all possible activities, settings, purposes, dependencies, or effects; uncertainty returns the action to QTU.

The mandatory [Integrity, Materiality, Evidence, and Commitment Control](integrity-materiality-control.md) governs material claims and completion assertions. It is PCAOB-aligned, not a claim of PCAOB compliance. It requires fact/inference separation, supporting and contradictory evidence, proportional materiality routing, capability and counterpart awareness, durable commitment records, and read-back before claims of memory, synchronization, completion, or remediation. The QTU paper defines the understanding functional; the normalized score, confidence-bound method, and 0.90 threshold are ACS operational extensions.

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
- Mandatory QTU 90% lower-confidence-bound execution gate and directive-envelope schema.
- Mandatory desktop/browser-only administrative and logistical safe-harbor scope amendment with non-exhaustive in-scope, out-of-scope, and borderline examples plus a reproducible authorization record.
- Mandatory PCAOB-aligned integrity, materiality, evidence, capability-awareness, and commitment controls, plus a [provisional cross-platform response-integrity baseline](https://docs.google.com/document/d/1_IDPhh_j5sIROhqpGFtEpEtFq03QHUdU594yTWfgJvc).
- Project-scoped MCP configuration for VS Code and Claude Code.
- Project-local Codex context reminder hooks in `.codex/hooks.json` and `.codex/hooks/ndv_context_hook.py`.
- Zapier SDK and durable-workflow skills under `.agents/skills`.
- A local verifier that checks required files, JSON syntax, endpoint consistency, and obvious secret-bearing files.

## Codex project hooks

Codex has a narrow project-local hook layer for this repository. The hook configuration lives at `.codex/hooks.json` and calls `.codex/hooks/ndv_context_hook.py` for `SessionStart`, `UserPromptSubmit`, and `PostCompact`.

The hook is intentionally read-only. When the active `cwd` is inside `/Users/dinamargelovich/Documents/General`, it emits a compact context reminder to read the repository snapshot and controls before material claims or state-changing work unless canonical Drive access has been directly verified. Outside this workspace it emits nothing. It does not log prompts, write to Drive, block tools, communicate externally, or handle credentials.

Directive `NDV-HOOKS-2026-07-19-A` authorized this reversible hook installation and synchronization. The dry-run protocol passed 60 of 60 OOD context-routing cases and 60 of 60 counterfactual/non-leakage cases. Using independent uniform `Beta(1,1)` component priors, exact one-sided 90% component lower credible bounds of `0.962956`, and `L_min/L = 1.0`, the conservative `QTU-LCB90` is `0.927285`. This is authorization for the narrow hook layer only, not evidence of production effectiveness.

## Synchronization rule

The canonical brief is authoritative. After a verified state change, update it first when possible, then update this snapshot and `agent-resources.json` in the same Git change. If the canonical brief is inaccessible, label repository changes as pending reconciliation.
