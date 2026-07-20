# ACS Universal Intake

Status: Implemented locally; production deployment and end-to-end verification pending

## Objective

Provide one low-friction route into the ACS Command Center for screenshots, screen recordings, files, URLs, selected text, and media originating inside or outside the NEURO-DIV ecosystem on macOS and iOS.

## Intake contract

1. Apple Shortcuts supplies the cross-application Share Sheet entry point named `Send to NEURO-DIV`.
2. macOS saves system screenshots and screen recordings directly into the same device-synced pending folder.
3. A native macOS LaunchAgent reacts to folder changes; it does not poll and invokes no AI model.
4. Raw inputs are retained in device-synced Apple intake storage. Routed work products remain canonical in the ACS Command Center Google Drive project.
5. The router submits bounded metadata to the owner-only Command Center through Sites access plus a separate device token stored in macOS Keychain.
6. D1 stores the operational queue, provenance, hash, type, source, device, timestamps, and routing status. SHA-256 source IDs suppress duplicate intake records.

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
- Only metadata is transmitted to the Command Center. Raw file bytes remain in device-synced intake storage until governed routing determines their canonical destination.
- Intake is preservation and triage, not permission to publish, send, execute, or otherwise act on captured content.

## Current evidence and limitations

- Observed: source build, lint, MCP type-check, and four contract tests pass locally.
- Observed: screenshot destination points to the managed pending folder.
- Observed: the LaunchAgent is installed, enabled, event-driven, and uses a 60-second launch throttle.
- Observed: macOS Shortcuts sharing extension is enabled, and `Send to NEURO-DIV` is configured for the Share Sheet.
- Sourced: Apple documents that Share Sheet shortcuts can receive content from other apps and can sync to iOS/iPadOS when iCloud Shortcuts sync is enabled.
- Pending: production v0.3 deployment, production metadata write/read-back, one real capture, and confirmation that the shortcut has synchronized to the user's iOS devices.
- Unknown until tested: how each third-party app converts proprietary objects into a Shortcuts-compatible file, URL, or text representation.
