# NEURO-DIV - agentic communication scaffold (ACS) - Repository Snapshot

Last verified: 2026-07-17

Canonical source: [NEURO-DIV - Agentic Communication Scaffold (ACS) - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

Parent architecture spine: [NEURO-DIV Core Foundation Document v1](https://docs.google.com/document/d/1DRlYOnp6AGBwRWOYgfh03gxNWxn6kaWSjmkddPa7gdY/edit)

## Architecture

ACS is the communications subsystem of the larger NEURO-DIV systematic architecture. It coordinates agent-to-agent handoffs, shared operational state, narrative and cognitive feedback routing, context continuity, verification, and common tool access across ecosystem layers. The repository is its portable discovery layer, the Google Doc is its canonical standing brief, and Zapier MCP is its preferred common action layer.

ACS is not the whole NEURO-DIV framework. The Core Foundation Document is the current parent spine, but it is incomplete and contains transcription contamination. A separate architecture reconstruction must compare the surviving versions, identify missing components, resolve contradictions, and integrate ACS at every applicable layer.

The current theory-to-system crosswalk is documented in [theory-branch-integration.md](theory-branch-integration.md). Its controlling chain is: WIPED behavioral state -> adaptive branch parameters -> branch-structured reasoning -> CBAL identity and lineage -> ACS routing and synchronization -> distributed-worker execution -> verification, convergence, consolidation, and garbage collection. WIPED is a provisional behavioral-adaptation model, not the whole NEURO-DIV theory or a clinically validated universal equation.

QTU is the mandatory epistemic execution gate for that chain. The normalized score is `U_norm = A_OOD * A_CF * (L_min / L(M))`. ACS may route a directive into state-changing execution only when its one-sided 90% lower confidence bound satisfies `QTU-LCB90 >= 0.90`. A point estimate alone is insufficient; missing, stale, or non-reproducible evidence blocks execution. The canonical source is [A Quantitative Theory of Understanding rev1](https://drive.google.com/file/d/1MOxQjpZ59JzOOZs9EsFEuq49DKN3TkjW).

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
- Project-scoped MCP configuration for VS Code and Claude Code.
- Zapier SDK and durable-workflow skills under `.agents/skills`.
- A local verifier that checks required files, JSON syntax, endpoint consistency, and obvious secret-bearing files.

## Synchronization rule

The canonical brief is authoritative. After a verified state change, update it first when possible, then update this snapshot and `agent-resources.json` in the same Git change. If the canonical brief is inaccessible, label repository changes as pending reconciliation.
