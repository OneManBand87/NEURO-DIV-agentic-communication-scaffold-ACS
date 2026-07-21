---
name: Sync shared agent context
description: Reconcile the repository snapshot with the canonical shared-agent brief.
agent: agent
---

Read `AGENTS.md`, `resources/agent-coordination.md`, and `resources/agent-resources.json`. Compare their claims with available live connector evidence and the canonical Google Doc. Update only stale coordination facts, preserve credentials outside version control, run `./scripts/verify-agent-resources.sh`, and summarize verified changes and unresolved access limitations.
