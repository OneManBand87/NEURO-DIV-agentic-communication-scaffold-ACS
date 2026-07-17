# Gemini and Antigravity entry point

Read and follow [AGENTS.md](AGENTS.md) before working in this repository.

Do not execute a state-changing directive unless its recorded `QTU-LCB90` is at least `0.90`. If the QTU evidence or interval is missing, treat the directive as `QTU_UNESTABLISHED` and perform only permitted read-only verification work.

Use [resources/agent-coordination.md](resources/agent-coordination.md) as the repository snapshot and the canonical Google Doc linked there as the source of truth.

The Zapier MCP endpoint is `https://mcp.zapier.com/api/v1/connect`. Current Antigravity authentication and protocol status is recorded in [resources/agent-resources.json](resources/agent-resources.json); do not infer success from configuration alone.
