# NEURO-DIV - agentic communication scaffold (ACS)

ACS is the communications subsystem of the larger NEURO-DIV systematic architecture. It gives Codex, Claude Code, GitHub Copilot in VS Code, Gemini/Antigravity, Perplexity, and other compatible agents a shared way to exchange operational context, coordinate responsibilities, route narrative and cognitive feedback, synchronize state, and reach common tools without requiring the user to act as the integration layer.

ACS is not the whole NEURO-DIV architecture. It is the communications team and connective scaffold operating across whichever ecosystem layers require agent-to-agent handoffs, context continuity, feedback routing, verification, or tool-mediated action.

## Relationship to the parent architecture

The current parent spine is the [NEURO-DIV Core Foundation Document v1](https://docs.google.com/document/d/1DRlYOnp6AGBwRWOYgfh03gxNWxn6kaWSjmkddPa7gdY/edit). That document is incomplete and contaminated by transcription noise. It requires a separate, multi-version reconstruction that compares surviving architecture versions, identifies missing pieces, resolves contradictions, and produces a coherent full-system architecture. ACS should be integrated into that reconstruction as a cross-layer communications subsystem, not mistaken for the parent framework.

Start with [AGENTS.md](AGENTS.md). The current capability matrix and synchronization procedure live in [resources/agent-coordination.md](resources/agent-coordination.md).

The integrated theory and branch hierarchy lives in [resources/theory-branch-integration.md](resources/theory-branch-integration.md). It connects WIPED behavioral adaptation, branch-structured reasoning, CBAL branch identity, ACS communication, distributed worker execution, and the integrity and garbage-collection control plane.

All participating agents are subject to the QTU pre-execution gate documented there: state-changing directives within QTU scope require a directive-specific one-sided 90% lower confidence bound of at least `0.90` on the normalized QTU score. The [administrative and logistical safe harbor](resources/qtu-administrative-logistical-safe-harbor.md) excludes only non-substantive, bounded, reversible local personal desktop/browser presentation and convenience settings. Work products, documentation, software, methodology, workflows, project/shared configuration, tests, evidence, security, external, canonical, and destructive actions remain in scope.

Material claims and commitments are also governed by the [Integrity, Materiality, Evidence, and Commitment Control](resources/integrity-materiality-control.md). The control is PCAOB-aligned but does not claim PCAOB compliance; it requires evidence classification, contradiction handling, environment/counterpart awareness, commitment tracking, and verified read-back.

Run the local validation with:

```sh
./scripts/verify-agent-resources.sh
```

OAuth and other credentials are intentionally excluded. Each client must authenticate to Zapier locally.

The active GitHub repository is [OneManBand87/NEURO-DIV-agentic-communication-scaffold-ACS](https://github.com/OneManBand87/NEURO-DIV-agentic-communication-scaffold-ACS). GitHub repository names cannot preserve the spaces and parentheses in the human-facing title, so the repository uses a technically valid slug. The repository was safely repurposed from the earlier Neuro-DIV Bolt prototype; its former default state remains recoverable from `archive/neuro-div-bolt-prototype-2026-07-16`, and its original topic branches remain intact.
