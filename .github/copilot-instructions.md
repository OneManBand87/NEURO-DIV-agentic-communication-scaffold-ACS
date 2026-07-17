# Shared agent instructions

- Read and follow [AGENTS.md](../AGENTS.md) for every request in this repository.
- Do not execute a state-changing directive unless its recorded `QTU-LCB90` is at least `0.90`; missing evidence means `QTU_UNESTABLISHED` and permits only read-only verification work.
- Use [resources/agent-coordination.md](../resources/agent-coordination.md) for the current capability matrix and synchronization rules.
- Treat the canonical Google Doc linked from those files as the source of truth when it is accessible.
- Use Zapier MCP from [.vscode/mcp.json](../.vscode/mcp.json) for shared actions when authenticated.
- Never store credentials in repository files, and never describe an unverified connector as operational.
