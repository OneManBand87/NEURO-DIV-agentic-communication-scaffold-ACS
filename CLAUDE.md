# Claude Code entry point

Read and follow [AGENTS.md](AGENTS.md) before working in this repository.

Do not execute a state-changing directive unless its recorded `QTU-LCB90` is at least `0.90`. If the QTU evidence or interval is missing, treat the directive as `QTU_UNESTABLISHED` and perform only permitted read-only verification work.

The shared Zapier MCP server is declared in [.mcp.json](.mcp.json). Use `/mcp` to authenticate locally if needed. Never add authentication material to the repository.

Use [resources/agent-coordination.md](resources/agent-coordination.md) as the repository snapshot and the canonical Google Doc linked there as the source of truth.
