# Agent Coordination Snapshot

Last verified: 2026-07-16

Canonical source: [Agent Coordination - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

## Architecture

The repository is the portable discovery layer. The Google Doc is the canonical standing brief. Zapier MCP is the preferred common action layer. Client-specific instruction files point every supported LLM back to the same resources rather than duplicating independent context.

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

- Canonical standing brief in Google Drive.
- Portable repository instructions for generic agents, Claude, Gemini, and GitHub Copilot.
- Machine-readable resource and capability manifest.
- Project-scoped MCP configuration for VS Code and Claude Code.
- Zapier SDK and durable-workflow skills under `.agents/skills`.
- A local verifier that checks required files, JSON syntax, endpoint consistency, and obvious secret-bearing files.

## Synchronization rule

The canonical brief is authoritative. After a verified state change, update it first when possible, then update this snapshot and `agent-resources.json` in the same Git change. If the canonical brief is inaccessible, label repository changes as pending reconciliation.
