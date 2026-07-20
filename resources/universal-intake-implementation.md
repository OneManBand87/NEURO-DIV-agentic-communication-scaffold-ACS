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

- The iPhone Action Button and a spoken activation phrase are equivalent entrances to the same dedicated open-line recording Shortcut; neither creates a separate capture workflow.
- Voice activation must use an on-device Vocal Shortcut or another confirmed silent trigger that launches the recorder directly without invoking Siri or Alexa at any point.
- Siri and Alexa are prohibited from spoken intake, voice activation, interpretation, and user-facing responses, including as fallbacks. The user must never receive their clarification, confirmation, interpretation, error message, or `I don't understand` prompt.
- If assistant-free voice activation cannot be guaranteed, voice activation remains unavailable and the Action Button remains the supported trigger. The workflow must never degrade to Siri or Alexa.
- Any future use of Alexa-compatible hardware as a silent physical-environment endpoint requires separate validation and must not require the user to speak to, hear from, or otherwise deal with Alexa.
- A continuously listening voice trigger's microphone state must be visible and tested for privacy, battery, false-trigger, and interference costs before adoption.
- Either trigger starts or opens the recording surface; it does not authorize transcription, interpretation, submission, or downstream action.
- Siri and Alexa have no role in capture or activation.
- Spoken-word intake must use a real open-line audio recording rather than assistant dictation or a speech-to-text prompt box.
- Recording continues until the user explicitly stops and finalizes it through the recorder control. Long pauses, topic changes, self-correction, repetition, and nonlinear ADHD speech do not constitute completion.
- The recorder must support pause and resume without finalizing or routing the item.
- The original audio is the primary source and must be preserved before transcription, summarization, classification, or routing. Transcripts are linked derivative aids that may contain errors and must not silently replace the audio.
- No capture surface may interrupt with clarifying questions, suggestions, confirmations, summaries, or conclusions while the user is thinking aloud.
- After explicit completion, the recording may enter CCS intake for downstream transcription and interpretation. Any proposed task, decision, state change, or external action remains subject to normal CCS verification and approval controls.
- If the available spoken-trigger or Shortcut route cannot guarantee explicit-stop recording, original-audio preservation, and complete avoidance of Siri and Alexa, use the Action Button, recorder control, or another assistant-free open-line capture surface instead.

## Current evidence and limitations

- Observed: source build, lint, MCP type-check, and five contract tests pass.
- Observed: screenshot destination points to the managed pending folder.
- Observed: the LaunchAgent is installed, enabled, event-driven, and uses a five-second launch throttle.
- Observed: macOS Shortcuts sharing is enabled; `Send to NEURO-DIV` is configured for the Share Sheet; and `Process NEURO-DIV Intake` provides the privacy-compatible Mac processor.
- Observed: owner-only Sites v0.4 (Sites version 5) is deployed in production and a live metadata write/read-back succeeded.
- Observed: the browser capture box exposes `Add attachment`; a live Markdown file was uploaded to R2, linked to its D1 intake record, downloaded through the authenticated attachment route, and verified byte-identical by SHA-256.
- Observed: a real screenshot was automatically archived and appeared in the production queue as `screenshot`, `captured`, with device and SHA-256 provenance.
- Observed: a real file passed through `Send to NEURO-DIV`, the processor shortcut, the router, and production deduplication.
- Sourced: Apple documents that Share Sheet shortcuts can receive content from other apps and can sync to iOS/iPadOS when iCloud Shortcuts sync is enabled.
- Observed: iPhone Mirroring connected at a physical distance of approximately 3–4 feet. iOS Spotlight indexed `Send to NEURO-DIV`, but the shortcut did not appear in the iPhone Shortcuts Library or the complete Photo Share Sheet action list.
- Observed: iPhone Shortcuts iCloud Sync is enabled, while Finder reports zero iCloud bytes available and the signed shortcut export remains `Waiting to Update`. The evidence supports full iCloud storage as the current synchronization blocker; it does not establish iOS Share Sheet operation.
- Pending: install the already configured shortcut on iPhone after iCloud capacity is restored or by a direct private device transfer, then repeat the physical Share Sheet test.
- Unknown until tested: how each third-party app converts proprietary objects into a Shortcuts-compatible file, URL, or text representation.
