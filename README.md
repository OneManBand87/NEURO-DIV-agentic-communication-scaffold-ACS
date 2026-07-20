# NEURO-DIV - agentic communication scaffold (ACS)

ACS is the communications subsystem of the larger NEURO-DIV systematic architecture. It gives Codex, Claude Code, GitHub Copilot in VS Code, Gemini/Antigravity, Perplexity, and other compatible agents a shared way to exchange operational context, coordinate responsibilities, route narrative and cognitive feedback, synchronize state, and reach common tools without requiring the user to act as the integration layer.

ACS is not the whole NEURO-DIV architecture. It is the communications team and connective scaffold operating across whichever ecosystem layers require agent-to-agent handoffs, context continuity, feedback routing, verification, or tool-mediated action.

## Relationship to the parent architecture

The current parent spine is the [NEURO-DIV Core Foundation Document v1](https://docs.google.com/document/d/1DRlYOnp6AGBwRWOYgfh03gxNWxn6kaWSjmkddPa7gdY/edit). That document is incomplete and contaminated by transcription noise. It requires a separate, multi-version reconstruction that compares surviving architecture versions, identifies missing pieces, resolves contradictions, and produces a coherent full-system architecture. ACS should be integrated into that reconstruction as a cross-layer communications subsystem, not mistaken for the parent framework.

Start with [AGENTS.md](AGENTS.md). The current capability matrix and synchronization procedure live in [resources/agent-coordination.md](resources/agent-coordination.md).

The integrated theory and branch hierarchy lives in [resources/theory-branch-integration.md](resources/theory-branch-integration.md). It connects WIPED behavioral adaptation, branch-structured reasoning, CBAL branch identity, ACS communication, distributed worker execution, and the integrity and garbage-collection control plane.

All participating agents are subject to the [QTU provisional validation hold](resources/qtu-provisional-validation-hold.md). QTU is advisory design evidence pending independent empirical validation. Historical `QTU_AUTHORIZED` records mean `DESIGN_CONFORMANCE_ONLY — NOT EMPIRICALLY VALIDATED`; `0.90` is a provisional policy parameter, not a scientific cutoff; and QTU cannot independently authorize M3/M4 or consequential action. Historical scope guidance remains in the [administrative and logistical safe harbor](resources/qtu-administrative-logistical-safe-harbor.md), subject to the hold.

Material claims and commitments are also governed by the [Integrity, Materiality, Evidence, and Commitment Control](resources/integrity-materiality-control.md). The control is PCAOB-aligned but does not claim PCAOB compliance; it requires evidence classification, contradiction handling, environment/counterpart awareness, commitment tracking, and verified read-back.

The [Maximal Progression and User-Attention Escalation Control](resources/maximal-progression-user-attention-control.md) keeps workflow ownership with the agent. Agents must complete safe preparation, reduce a genuine user dependency to one prominent action request, and resume automatically after approval or authentication.

The mandatory [Automation Cost, Cadence, and Proportionality Control](resources/automation-cost-cadence-proportionality-control.md) requires every recurring or background workflow to weigh total usage and attention cost against importance and urgency, prefer event-driven and least-cost adequate execution, cap runs and task churn, and pause automatically on repeated errors or no-op polls.

Run the local validation with:

```sh
./scripts/verify-agent-resources.sh
```

OAuth and other credentials are intentionally excluded. Each client must authenticate to Zapier locally.

The active GitHub repository is [OneManBand87/NEURO-DIV-agentic-communication-scaffold-ACS](https://github.com/OneManBand87/NEURO-DIV-agentic-communication-scaffold-ACS). GitHub repository names cannot preserve the spaces and parentheses in the human-facing title, so the repository uses a technically valid slug. The repository was safely repurposed from the earlier Neuro-DIV Bolt prototype; its former default state remains recoverable from `archive/neuro-div-bolt-prototype-2026-07-16`, and its original topic branches remain intact.
