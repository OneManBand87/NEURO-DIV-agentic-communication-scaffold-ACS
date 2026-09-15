# Source Acquisition Completion Recognition Control

Status: mandatory ACS control

Control ID: `ND-INGEST-RECOG-001`

Canonical source: [NEURO-DIV - Agentic Communication Scaffold (ACS) - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

## Purpose

Prevent a successful download or connector retrieval from being misclassified as a failure merely because its filename, extension, destination, or rendered format differs from an agent's expectation. Prevent unnecessary authentication, credential, copied-profile, alternate-delivery, and user-burden escalation after the requested source already exists.

## Mandatory gate

After every browser, connector, app, or command-based acquisition attempt, and before reporting failure or changing method, the responsible agent must:

1. identify the actual configured destination rather than assuming a generic Downloads folder;
2. enumerate every file created or modified in the relevant time window;
3. inspect candidate MIME/type and byte count;
4. inspect provenance or `WhereFroms` URL when available without exposing credentials;
5. compute and preserve a content hash;
6. inspect only safe title/content markers needed to correlate the file with the request; and
7. record the matched source or the checked directories, time window, and negative evidence.

An unexpected filename, extension, or rendered format is not evidence of failure. Positive temporal, provenance, MIME, hash/size, and content evidence controls over the name expected by the agent.

If a candidate matches, acquisition is successful: preserve the unchanged source, identify its true format, and continue intake. If no candidate matches after the gate, select at most one bounded, authorized alternate route. Do not begin Keychain extraction, credential work, copied-profile experimentation, or user-mediated delivery until the gate is complete.

## Evidence and status

A source file, hash, or download receipt proves acquisition only. Completion requires canonical preservation and downstream read-back. Source text proves control design; one corrected event proves current-event application; neither proves cross-runtime operating effectiveness.

## Origin and regression

On 2026-09-15 Chrome successfully downloaded the user-supplied Claude endpoint as `silent-cron-incident.html` at `2026-09-15T16:07:21Z`, but Codex failed to recognize it because it expected another filename or format and continued into an unnecessary authentication workaround. The corrected regression identified the file using configured destination, time, UTF-8 HTML type, exact provenance URL, 16,133-byte size, SHA-256 `6f2b4546bc09a88c90db8e7a4bd706cbe0efa94a0d31cb84d53cd146971baa5a`, and report content. Six report markers matched the later PDF and the unnecessary Keychain route was not retried.

The detailed record is `ND-DEF-2026-09-15-002`. Cross-runtime operating effectiveness remains open.
