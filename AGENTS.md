# Shared Agent Coordination

These instructions apply to every AI agent working in this repository.

## Start here

1. Read [resources/agent-coordination.md](resources/agent-coordination.md).
2. Read [resources/agent-resources.json](resources/agent-resources.json) for machine-readable endpoints, capabilities, and status.
3. Treat the canonical Google Doc as the source of truth when the authenticated client can access it:
   [Agent Coordination - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit).
4. Use the repository snapshot when the canonical document is unavailable, and state that limitation.

## Shared architecture

- Participating agent surfaces: Codex, Claude Code, GitHub Copilot/VS Code, Gemini through Antigravity, and Perplexity.
- Preferred common action layer: Zapier MCP at `https://mcp.zapier.com/api/v1/connect`.
- Project MCP definitions are versioned in [.mcp.json](.mcp.json) and [.vscode/mcp.json](.vscode/mcp.json). Authentication is always local and must never be committed.
- Reusable Zapier skills are versioned under [.agents/skills](.agents/skills) with [skills-lock.json](skills-lock.json).

## Operating rules

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
