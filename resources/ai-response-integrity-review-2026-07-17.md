# NEURO-DIV AI Response Integrity Review

Status: Provisional baseline; corpus recovery incomplete

Review date: 2026-07-17

Canonical Drive copy: [NEURO-DIV - agentic communication scaffold (ACS) - AI Response Integrity Review - Provisional v1 - 2026-07-17](https://docs.google.com/document/d/1_IDPhh_j5sIROhqpGFtEpEtFq03QHUdU594yTWfgJvc)

## Conclusion

The available evidence establishes a recurring risk pattern worth formal control: assistant language frequently makes future commitments and sometimes acknowledges error, while durable implementation and later adherence cannot be inferred from the language itself. This baseline does not support a complete cross-platform conclusion because the ChatGPT export is stale, Claude coverage is limited to five local Claude Code sessions, Gemini CLI coverage is one nearly empty session, and Antigravity history is stored in application databases that were only partially screenable.

The principal finding is therefore a control-design finding, not a verdict about intent or legal culpability: apologies, admissions, memory claims, and promises must be linked to observable implementation, read-back, and recurrence testing.

## Available corpus

| Platform | Source reviewed | Coverage | Limitation |
| --- | --- | --- | --- |
| ChatGPT | Local `conversations.json`, modified 2026-02-09 | 1,216 conversations containing 16,701 assistant messages in the extracted mapping | Stale; branch mappings may contain duplicates; not a current full-account export |
| Claude Code | Five local JSONL session logs | 16 substantive assistant text messages | Very small, recent, and not Claude.ai or Cowork history |
| Gemini CLI | One local JSONL session | Session metadata/user context; no substantive assistant response extracted | Insufficient for behavioral conclusions |
| Antigravity | Three local conversation databases, 101 total step rows | Plain-text screening and metadata inspection | Proprietary/opaque serialization; not yet reconstructed into reliable message turns |
| Google Drive | Existing ChatGPT corpus manifest/synthesis and scattered Gemini artifacts | Corroborates prior provisional corpus work | No verified complete Claude or Gemini export located |

## Automated candidate screen

The screen is case-insensitive and operates on assistant-message text. Counts are candidate occurrences, not adjudicated failures.

| Indicator | ChatGPT full export | Claude Code local |
| --- | ---: | ---: |
| Explicit admission/error acknowledgment | 442 | 0 |
| Apology/regret | 148 | 0 |
| Future commitment | 2,890 | 4 |
| `ensure`/remember/follow-style commitment | 456 | 1 |
| Memory/instruction/preference persistence claim | 152 | 0 |
| Completion claim | 890 | 2 |
| Explicit uncertainty/access limitation | 120 | 0 |
| Apology plus future commitment in same response | 20 | 0 |
| Admission/apology after corrective user language | 106 | 0 |

### Same-conversation sequence screen

For each ChatGPT assistant candidate, the screen examined the next 20 chronological mapping messages for later user language indicating a missed instruction, repeated error, broken promise, or continued frustration.

| Earlier assistant indicator | Candidate events later followed by corrective language | Distinct conversation titles |
| --- | ---: | ---: |
| Future commitment | 1,064 | 176 |
| Apology or admission | 257 | 98 |
| Memory/instruction/preference persistence claim | 74 | 29 |
| Completion claim | 304 | 111 |

These are high-recall triage counts, not substantiated recurrence rates. ChatGPT mapping branches may duplicate messages; the correction may concern a different subtask; and the regex includes broad terms such as `again`. Manual adjudication must establish same-obligation identity, materiality, evidence of implementation, and actual recurrence before any event is classified as a failed commitment.

The broad NEURO-DIV/project keyword screen over-selected 366 ChatGPT conversations because terms such as `memory`, `architecture`, and agent names occur in unrelated contexts. Those results are not used as a project-specific prevalence estimate. The existing Drive manifest's manually narrower 50 project-signal conversations is the preferred starting set for the next qualitative pass.

## Qualitative observations

1. Commitment language is far more common than explicit uncertainty language in the stale ChatGPT export. That difference is a triage signal, not proof of overconfidence, because many commitments concern ordinary future assistance.
2. The sequence screen found enough same-conversation candidates to make commitment-follow-through a material review priority, especially memory and completion claims. It does not establish that every later correction concerns the earlier promise.
3. Some candidate responses pair apology with a promise to change future behavior but provide no evidence in the same response of a durable instruction write or control update. Under the new protocol these are `unverified corrective commitments`, not completed remediation.
4. The Claude Code logs demonstrate why capability claims need environment-specific evidence. One session reported an expired OAuth token; another described a restricted Linux/GitHub environment. Those facts cannot be generalized to Claude as a whole or to the current local Claude Code environment.
5. Antigravity data contains at least one repeated autonomous-proceed commitment in raw strings, but serialization and turn attribution are not sufficiently reconstructed to adjudicate recurrence or follow-through.
6. The present corpus cannot support a defensible finding of gross negligence, willful ignorance, or incompetence. It can support risk indicators for unsupported certainty, performative correction, fragmented memory, and recurrent control failure after message-level adjudication.

## Required next review stage

1. Obtain fresh native exports for ChatGPT, Claude/Claude.ai or Cowork, and Gemini where providers permit.
2. Reconstruct Antigravity database records into attributable user/assistant turns and validate the decoder against visible conversations.
3. Deduplicate branches and identify the canonical turn sequence.
4. Apply the coding form in `integrity-materiality-control.md` to all high-materiality candidates and a stratified sample of lower-materiality candidates.
5. Link commitments to instruction files, memory repositories, Drive artifacts, tool receipts, and later recurrence.
6. Calculate inter-rater agreement or conduct independent second-pass review before publishing prevalence or severity conclusions.

## Interpretation boundary

This report is a provisional baseline generated from locally accessible and Drive-indexed material. It should not be represented as a comprehensive review of all ChatGPT, Claude, Gemini, or Antigravity history until the missing exports and turn reconstruction are completed.
