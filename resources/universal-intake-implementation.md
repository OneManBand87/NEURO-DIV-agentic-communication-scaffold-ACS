# ACS Universal Intake

Status: Production v0.4 verified for macOS routing and private browser attachments; iOS shortcut installation blocked by full iCloud storage

## Objective

Provide one low-friction route into the ACS Command Center for screenshots, screen recordings, files, URLs, selected text, and media originating inside or outside the NEURO-DIV ecosystem on macOS and iOS.

## Intake contract

1. Apple Shortcuts supplies the cross-application Share Sheet entry point named `Send to NEURO-DIV`.
2. macOS saves system screenshots and screen recordings directly into the same device-synced pending folder.
3. A native macOS LaunchAgent reacts to folder changes and opens the dedicated `Process NEURO-DIV Intake` shortcut. Shortcuts performs the iCloud read under its existing macOS privacy authorization, then invokes the bounded router. The route does not poll and invokes no AI model.
4. Raw inputs are retained in device-synced Apple intake storage. Routed work products remain canonical in the ACS Command Center Google Drive project.
5. The router submits bounded metadata to the owner-only Command Center through Sites access plus a separate device token stored in macOS Keychain.
6. D1 stores the operational queue, provenance, hash, type, source, device, timestamps, and routing status. SHA-256 source IDs suppress duplicate intake records.
7. The Command Center capture box accepts optional private attachments alongside an inquiry. Browser attachment bytes are stored in the Sites R2 binding, while D1 stores their bounded metadata and intake/work-item relationship.

## Automation preflight

- Importance: high (rank 3); it removes repeated user routing decisions and preserves externally discovered information.
- Harm window: ordinary captures should be available on the next Command Center review; no critical sub-hour deadline is assumed.
- Mechanism: event-driven filesystem notification, not polling.
- Expected useful-run probability: high; the agent is invoked only when the intake folder changes.
- Run ceiling: 50,000 events or annual control review, whichever occurs first.
- Expiry/review: annual review required by 2027-07-20.
- Model/reasoning: none.
- Prompt/tool burden: none; one bounded metadata request per unique input.
- User-visible task/notification per run: none.
- Cost band: low local-device and network cost.
- Tripwires: automatic disable after two consecutive indexing errors or three consecutive no-op launches; any user cost/task-churn complaint pauses immediately.
- Recovery: timestamped screenshot-setting and LaunchAgent backups are preserved under the local Universal Intake application-support directory; reinstall re-enables the agent and resets counters with prior pause state backed up.

## Security and privacy boundary

- The production site remains owner-only.
- The device route requires the Sites dispatch authorization and a separate application device token.
- Both secrets are stored in macOS Keychain and are not committed or written into project artifacts.
- Native Mac and Share Sheet routing transmits only metadata; raw native-intake bytes remain in device-synced Apple storage until governed routing determines their canonical destination.
- Files deliberately attached in the Command Center are transmitted to its private Sites R2 storage. The route accepts no more than five files, 20 MB per file, and 40 MB combined; download responses force attachment disposition, disable caching, apply a sandbox content policy, and do not render the original MIME type inline.
- Intake is preservation and triage, not permission to publish, send, execute, or otherwise act on captured content.

## Voice-assistant and spoken-word capture boundary

- The user may choose direct text dictation or the dedicated open-line recorder; neither path is mandatory for every spoken prompt.
- Direct dictation through macOS or iPhone Voice Control or system Dictation into the CCS Quick Capture box or another NEURO-DIV text-entry surface is permitted for fast, ordinary prompting.
- The exact text explicitly submitted by the user is the source record for direct dictation. No original-audio record or audio-verified transcript is implied, and recognition errors, typos, omissions, or accidentally captured nearby speech remain visible and correctable.
- Listening may remain hands free, but direct text enters CCS only through an explicit user submission command or action. Silence, pauses, and topic changes never submit automatically.
- The iPhone Action Button and an assistant-free Vocal Shortcut remain permitted entrances to the same dedicated open-line recorder.
- Use the recorder for long or nonlinear thought capture, tolerance for extended pauses and self-correction, higher-fidelity review, or original-audio preservation.
- Recorder voice activation must use an on-device Vocal Shortcut or another confirmed silent trigger that launches the recorder directly without invoking Siri or Alexa at any point.
- Conversational Siri and Alexa assistant surfaces are prohibited from activation, intake, interpretation, confirmation, error handling, and user-facing responses, including as fallbacks.
- Operating-system speech-recognition services used by Voice Control or Dictation are permitted only as subordinate text-input mechanisms that do not invoke assistant dialogue or independent interpretation.
- If assistant-free recorder activation cannot be guaranteed, the Action Button remains the supported recorder trigger. The workflow must never degrade to conversational Siri or Alexa.
- Any future use of Alexa-compatible hardware as a silent physical-environment endpoint requires separate validation and must not require the user to speak to, hear from, or otherwise deal with Alexa.
- A continuously listening recorder trigger or dictation state must be visible and tested for privacy, battery, false-trigger, and interference costs before adoption.
- Recording continues until the user explicitly stops and finalizes it through the recorder control. Long pauses, topic changes, self-correction, repetition, and nonlinear ADHD speech do not constitute completion.
- The recorder must support pause and resume without finalizing or routing the item.
- The original audio is the primary source and must be preserved before transcription, summarization, classification, or routing. Transcripts are linked derivative aids that may contain errors and must not silently replace the audio.
- No capture surface may interrupt with clarifying questions, suggestions, confirmations, summaries, or conclusions while the user is thinking aloud.
- After explicit completion, the recording may enter CCS intake for downstream transcription and interpretation. Directly dictated text may enter CCS after explicit submission. Any proposed task, decision, state change, or external action from either path remains subject to normal CCS verification and approval controls.
- If the available spoken-trigger or Shortcut route cannot guarantee explicit-stop recording, original-audio preservation, and complete avoidance of Siri and Alexa, use the Action Button, recorder control, or another assistant-free open-line capture surface instead.

## Implemented iPhone Action Button route

- Observed configuration: `NEURO-DIV Voice Intake` is installed in the iPhone Shortcuts Library and selected in Settings > Action Button > Shortcut.
- The Shortcut starts Record Audio immediately and stops only when the user taps to finish.
- It renames the recording to `NEURO-DIV Voice Intake - [six-digit random number].m4a`, using the range 100000–999999.
- It saves automatically to the Mac router's watched `iCloud Drive / Shortcuts / NEURO-DIV Intake / Pending` folder; `Ask Where To Save` is disabled, overwrite is disabled, and save access is set to `Always Allow`.
- Observed verification: the Shortcuts Library and Action Button settings read back the exact shortcut name; a mirrored test produced the expected randomized filename and increased the watched Pending queue from zero to one item; the Files picker reported the queue as synced with iCloud.
- CCS visibility: the implementation and its validation boundary were mirrored to production intake item `intake-9e324b1f-6643-449c-8a3e-1b8c11d863e0`; the pause/resume correction was mirrored to `intake-2482b02f-2568-480b-a035-3d729cc0160c`; both were read back from the production state API. The canonical brief read-back revision is `ALtnJHx4NTskisog_pnXF4KFLq4gqo0Zq_h227V9KX0Tdo7TwrrkeYnRO3MQuH06A0ggQydQv4GbSNQkAKnkuqLI69xUTZBhwEjpgiHVBg`.
- Validation limitation: iPhone Mirroring cannot supply the iPhone microphone. The mirrored test verifies execution, naming, permission, destination, and iCloud queue routing, but it does not verify usable audio. One physical Action Button recording remains required before real-audio capture is declared validated. The observed Record Audio screen exposed an explicit finish control but no pause/resume control, so pause/resume remains unmet and the route is not yet fully conformant with the standing capture specification.
- No exported-shortcut signature is required because the Shortcut was created locally and runs on the same iPhone. The relevant assignment control is the verified Action Button selection.

## Semantic title and structured interpretation layer

- Preserve and save the original audio before any transcription or interpretation. The audio remains authoritative; the transcript and every extraction remain linked derivative aids.
- After capture, `Transcribe Audio` may produce a complete transcript. `Use Model` should use Apple's `On-Device` model by default for this simple, privacy-sensitive clerical pass. Private Cloud Compute or CCS processing requires a demonstrated need; the ChatGPT extension model remains excluded from this route.
- The interpretation output is a strict JSON sidecar named `NEURO-DIV Voice Intake - [six-digit capture ID].ccs-intake.json` beside the matching audio file.
- The sidecar preserves the complete transcript and separates zero or more `idea`, `task`, `concern`, and `evidence` items. It also extracts explicitly stated dates and people, assigns confidence, and records proposed actions only with `reviewRequired: true`.
- A proposed action is never an approval, commitment, calendar event, message, or completed task. Material downstream action remains subject to normal CCS verification and approval controls.
- The semantic title describes the central subject of the whole capture in 4–10 words and no more than 72 characters. It must remove filler and false starts, must not copy the opening sentence, and must not invent people, dates, organizations, commitments, or subjects. Generic titles such as `Voice Note`, `Recording`, `New Idea`, and `Untitled` are rejected.
- If the subject is unclear, the honest fallback is `Review voice capture [capture ID]`; the system must not manufacture a confident caption merely to avoid a fallback.
- The Mac router validates the sidecar, pairs it with the matching audio, uses the guarded semantic title for the single CCS intake item, retains the original audio filename, and carries the structured JSON as captured derivative context. Invalid or absent sidecars leave the raw-audio fallback route intact.
- No model is invoked merely to wait, poll, or deliver a reminder. Interpretation is event-driven and runs only after a completed voice capture.
- Production verification item `intake-208002db-cd65-4e00-850a-d40bea79fc4b` read back the title `Semantic title extraction verification`, retained original filename `NEURO-DIV Voice Intake - 864209.m4a`, identified source `apple-voice-intake-on-device`, and preserved the structured JSON payload.
- Final implementation synchronization was accepted and read back through production CCS intake item `intake-e6236b53-127d-4649-9a5c-044eba855451`.
- The canonical shared-agent Google Doc now contains the same semantic-layer boundary and was read back at revision `ALtnJHyhbAMfJCu9Z3m2ZX3eK3nTdz2XVZfidNOvDKi-3nZ0UPpy7japiDneVlvIkAOhR4FEU1SXKoFNjAHnk3f13EZXbblp5PoWDM9lqg`.
- Final Mac processor: `Process NEURO-DIV Voice Intake` transcribes one stable, narrowly scoped local bridge file, calls Apple Intelligence `On-Device`, and returns separate model and exact-transcript envelopes. The router normalizes each completed M4A into that bridge, validates and repairs the model JSON, filters unsupported date and person extractions, replaces placeholder capture IDs, enforces review-required proposed actions, preserves and archives the original audio plus sidecar, and falls back to raw-audio intake if interpretation fails.
- Observed end-to-end evidence: unique synthetic capture `734828` produced both archived files and production CCS item `intake-4c49287f-93e0-4119-b635-35928538c3c0`, which read back source `apple-voice-intake-on-device`, original filename `NEURO-DIV Voice Intake - 734828.m4a`, semantic title `Confirm reliable action button voice intake into command center`, complete transcript, task and concern items, no unsupported dates or people, and review-required actions.
- Current trigger boundary: the processing chain is verified when `Process NEURO-DIV Intake` is invoked in an authorized user context. Automatic background triggering is not yet operational because Shortcuts lacks permission to enumerate the iCloud `Pending` folder during a background run. The LaunchAgent remains installed but is not greenlit until that narrow folder authorization is granted and re-tested. Physical iPhone microphone capture, Vocal Shortcuts phrase training, and pause/resume remain unverified. The canonical brief was read back at revision `AIroW35JP7b51Xx7udBbc-tGgiFeC8yp-Rs8PvoRR4fBDiPjQqDoIxFFaIv6gKfx2rjIogkyurrCBQ2Ym4oRj_QCMBK56Mx6Ox__y5kVuA`; production CCS item `intake-17de3f3e-11f8-423e-a9da-b6d13b09154a` mirrors the verified finalization state and permission boundary.

## Apple Intelligence selective-adoption boundary

- Apple Intelligence is not included in NEURO-DIV scope merely because it is available.
- Apply the contingent routing protocol before every proposed Apple Intelligence use. The permitted routes are `deterministic`, `apple-on-device`, `ccs-reasoning`, and `defer-for-review`; every route remains visible to CCS and none may execute an action.
- Use `deterministic` for routine CCS status briefs, exact record operations, reminders, and device control when current structured records can produce the result without interpretation. Do not invoke a model merely to make routine status sound conversational.
- Use `apple-on-device` after an explicitly completed voice capture whose original audio was already preserved, because semantic titling, classification, entity extraction, and proposed-action drafting provide distinct clerical value. Also permit it for a bounded rewrite or interpretive status summary only when the user explicitly requests interpretation.
- Use `ccs-reasoning` whenever the task needs cross-record context, current external information, connectors or tools, consequential judgment, or any action-producing decision. Also use CCS when the on-device result fails schema/title validation or has low confidence.
- Use `defer-for-review` when voice capture has not been explicitly completed, original-source preservation is unverified, or safe routing cannot yet be established.
- Privacy preference is on-device processing for simple sensitive transformations, but sensitivity never authorizes Apple Intelligence to bypass CCS, normal approval controls, or preserved-source verification.
- Siri, Alexa, Siri-to-ChatGPT, and the ChatGPT Shortcut model are prohibited fallback routes. A failure must return to CCS or review, never degrade into an assistant conversation.
- Alexa is outside the NEURO-DIV and CCS ecosystem. Independent use for music playback or optional room-light control is not an integration and creates no CCS dependency; no Alexa endpoint, skill, monitor, or future workflow is planned.
- The contingent gate passed five route-specific contract tests and all nine combined voice-title and Apple-routing tests. The canonical shared-agent brief was updated with the full validation evidence and read back at revision `ALtnJHzhMRj2rxeiuaqjSYcsq_NiGZqr_OR3Fbuy3QykqQ98IVaAPqwIqNBivpjJkH2DfW8nCff3Wp2wx0cl88SJQr4uhLcHQIye4yhyFA`.
- Production CCS intake item `intake-7267ed62-1160-41b5-b65b-d48ef2881707` mirrors the contingent-routing protocol, Alexa exclusion, test evidence, canonical revision, and remaining iPhone Mirroring boundary; it was read back from the production state API.
- Full validation also passed the Command Center production build, all 20 repository tests, ESLint, and the MCP TypeScript check.
- The Siri-to-ChatGPT experience is excluded and may not serve as a CCS front door, spoken intake surface, conversational operator, or task executor.
- Supported photo or document transfer through Siri still requires file confirmation and does not satisfy the low-friction intake requirement or replace CCS document routing.
- A Shortcuts `Use Model` action may be considered only when the entire route is silent, bounded, subordinate to CCS, and demonstrably useful. Its output may feed predetermined actions but may not become an independent task orchestrator.
- Keep the ChatGPT extension model out of scope unless a tested Shortcut proves a distinct benefit that direct CCS or Codex routing cannot provide with equal or lower friction.
- Notification prioritization, Reduce Interruptions, user-invoked Writing Tools, local or Private Cloud Compute preprocessing, Notes or call summaries, Photos search, and Visual Intelligence are optional attention or convenience candidates only.
- No Apple Intelligence feature may independently determine material status, suppress required alerts, create canonical output, or be enabled before its use case, privacy route, failure behavior, CCS visibility, and net ADHD workflow value have been evaluated.

## Current evidence and limitations

- Observed: source build, lint, MCP type-check, and five contract tests pass.
- Observed: screenshot destination points to the managed pending folder.
- Observed: the event-driven LaunchAgent and five-second throttle are installed. Automatic background enumeration is permission-blocked and is not represented as operational.
- Observed: macOS Shortcuts sharing is enabled; `Send to NEURO-DIV` is configured for the Share Sheet; and `Process NEURO-DIV Intake` provides the privacy-compatible Mac processor.
- Observed: owner-only Sites v0.4 (Sites version 5) is deployed in production and a live metadata write/read-back succeeded.
- Observed: the browser capture box exposes `Add attachment`; a live Markdown file was uploaded to R2, linked to its D1 intake record, downloaded through the authenticated attachment route, and verified byte-identical by SHA-256.
- Observed: a real screenshot was automatically archived and appeared in the production queue as `screenshot`, `captured`, with device and SHA-256 provenance.
- Observed: a real file passed through `Send to NEURO-DIV`, the processor shortcut, the router, and production deduplication.
- Sourced: Apple documents that Share Sheet shortcuts can receive content from other apps and can sync to iOS/iPadOS when iCloud Shortcuts sync is enabled.
- Superseded observation: the earlier missing-Shortcut/zero-capacity condition no longer blocks voice intake. `NEURO-DIV Voice Intake` is now installed directly on the iPhone and assigned to the Action Button.
- Observed: the iPhone `Pending` queue accepted the mirrored test item and reported `Synced with iCloud`; complete Photo Share Sheet operation remains a separate unverified path.
- Pending: make one recording from the physical iPhone Action Button, speak a short test phrase, tap to finish, and verify that the resulting file contains usable audio and continues through downstream CCS processing.
- Unknown until tested: how each third-party app converts proprietary objects into a Shortcuts-compatible file, URL, or text representation.
