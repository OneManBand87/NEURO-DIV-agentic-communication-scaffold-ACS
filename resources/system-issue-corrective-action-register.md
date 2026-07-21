# NEURO-DIV System Issue and Corrective-Action Register

Status: Current standing register

Canonical source: [NEURO-DIV - System Issue and Corrective Action Register](https://docs.google.com/document/d/1KInHd27pOBMH1TWrop2FK6bF_X-UHazTtpNmNrPp9CA/edit) in `My Drive / ChatGPT Projects / NEURO-DIV - agentic communication scaffold (ACS) / 03 Manifests and Data`

Canonical register revision read back: `ALtnJHx-ahk4BRjqrMt0cdkJse6tAuKUDMToNaIHP1i98Gc02Qc1dqQxv3J3D1I2wV2MsOx-KVxQ29zbUhrueHXMEFiBIng06FWKD3Gpxw`

## Purpose

Maintain one cross-system record of operational, architectural, control, application, device, connector, and agent-execution issues from detection through verified correction. Existing specialized incident records remain source evidence; this register is the umbrella index and must link to them rather than silently duplicate or renumber them.

## Required record fields

Every material issue record must include:

- stable issue ID, concise title, status, owner, and materiality;
- task nature or workstream;
- affected systems, programs, devices, agents, connectors, and environment;
- creation or detection context, occurrence date when known, detected date, and resolved date when applicable;
- observed facts, sourced facts, inference, unknowns, impact, and contradictory evidence;
- `Deficiency_Source` and `NEURO_DIV_Control_Result` using the controlled values in `integrity-materiality-control.md`;
- root cause or current mechanism classification, including uncertainty when root cause is not established;
- corrective actor or actors and the exact corrective action taken;
- verification, read-back evidence, residual risk, recurrence status, and closure basis;
- the exact system-process narrative, control, configuration, code, or instruction updated as a result;
- durable links or references to CCS records, Google Drive revisions, repository paths, commits, deployments, and related incident IDs; and
- reuse candidates: other controls, workflows, systems, or future designs that may benefit from the resolution.

An apology, intention, configuration change, or unverified test is not a completed corrective action. Status becomes `resolved` only after durable implementation and read-back evidence. Recurrence after resolution reopens the record or creates a linked recurrence record.

## Review and reuse rule

The desired governance cadence is one cross-control learning review every two weeks. The review examines issues resolved or materially updated since the prior review and asks whether the correction should be applied to another control, workflow, system, program, device route, agent instruction, or future design.

No recurring review, reminder, scheduler, or Codex automation is currently created or authorized by this record. Activation requires a separate bounded automation decision under `automation-cost-cadence-proportionality-control.md`. Until then, the cadence is documented as `DESIRED — NOT SCHEDULED`.

## Issue records

### NDV-SYS-2026-07-21-001 — Mac capture routing blocked by background iCloud enumeration

- Status: `resolved — monitor for recurrence`.
- Materiality: M2 operational continuity issue.
- Owner: Codex / ACS Command Center implementation.
- Task nature or workstream: universal intake; automatic macOS screenshot and screen-recording routing into the Central Command Center (CCS).
- Affected systems and programs: macOS Screenshot and Screen Recording, LaunchAgent, Apple Shortcuts, iCloud Drive, local filesystem events, CCS intake API, macOS Keychain, Google Drive canonical records, and GitHub repository synchronization.
- Creation or detection context: the existing intake LaunchAgent was installed but disabled after a background Shortcut could not enumerate the iCloud `Pending` folder. macOS capture destination had fallen back to the Desktop, so new native captures were not entering the managed queue automatically.
- Detected: 2026-07-21.
- Resolved: 2026-07-21.
- Observed facts: Shortcuts background execution logged `Operation not permitted` for the iCloud pending folder; the LaunchAgent was disabled; direct interactive shell access was available; iCloud-folder event delivery did not reliably trigger after file creation; device credentials remained present in Keychain.
- `Deficiency_Source`: `HYBRID` — `EXTERNAL_PLATFORM_OR_ENVIRONMENT` for macOS/Shortcuts privacy and iCloud event behavior, with `NEURO_DIV_ARCHITECTURE` contribution because the automatic path depended on those unverified behaviors.
- `NEURO_DIV_Control_Result`: `ARCHITECTURE_GAP_OUTSIDE_SUPPLEMENTAL_CONTROL` for the original trigger design; preservation, credential separation, bounded metadata, deduplication, and failure tripwires otherwise worked as designed.
- Root cause or mechanism: an automatic background path depended on a Shortcut enumerating a protected iCloud folder and on reliable filesystem events from that iCloud location. Both dependencies were unsuitable for the required native Mac capture trigger.
- Corrective actor: Codex, operating within the ACS Command Center repository and the authorized Mac environment.
- Corrective action: changed the LaunchAgent to invoke the bounded router directly; moved native Mac capture staging to a private local pending folder; retained the iCloud processed archive; restored the global macOS screenshot and screen-recording destination to the local managed queue; preserved `Send to NEURO-DIV` and `Process NEURO-DIV Intake` as cross-application and recovery paths; reinstalled and enabled the agent.
- Verification and read-back: a screenshot and a screen recording triggered automatic runs; the local pending queue emptied only after successful indexing; originals appeared in the iCloud processed archive; production CCS read back `intake-0343035d-398d-4e2e-b5b1-87ed8114700a` as `screenshot` and `intake-b93ca066-da5c-4861-a354-0246fd265c15` as `screen-recording`, both `captured` with Mac device and SHA-256 provenance; repository verification passed; commit `c3a115a` was pushed and remote-head matched.
- Updated system-process narrative: canonical shared-agent brief section `Universal intake v0.4`; `resources/universal-intake-implementation.md`; `resources/agent-coordination.md`; `resources/agent-resources.json`; `apps/acs-command-center/native/macos/install.zsh`; and `apps/acs-command-center/native/macos/org.neuro-div.acs.universal-intake.plist.template`.
- Canonical narrative revision: `AIroW36SCt_uc8APm-92XRaUB8mkGX_s3FQUuPYthepq_UEqynaLmZ8Ung5eep5wJinUggkC5txzOkdMEQpIdnjmlflUNyh2hsC3G43itw`.
- Umbrella-register synchronization: production CCS item `intake-705832fa-0ca3-4ee3-b654-296ba0fe9273` was read back as `captured`; the canonical shared-agent brief was read back at revision `ALtnJHyGEQSNNOeKZRgj0RPneCRS9uVwu8hG-oDgl_jXCTylFNHJ0U4TZR5Q-sODPlfgIPDilhNzxxZcSH4nr63MIaJ14iuG6Uwici70xg` with the register link, standing fields, review status, seeded issue ID, and CCS reference.
- Related records: `resources/universal-intake-implementation.md`; production CCS verification items above.
- Residual boundary: macOS native captures are automatic. Third-party applications that save proprietary captures outside the macOS capture destination still require their supported Share action or a separately verified app-specific route. Physical iPhone microphone capture, assistant-free Vocal Shortcut training, and recorder pause/resume remain separate open validation items.
- Reuse candidates: review every background workflow that watches iCloud or another provider-synchronized folder. Prefer a local event-driven staging queue with post-acknowledgment archival when synchronized-folder events or permissions are not demonstrated reliable. Do not generalize this correction without verifying each platform's privacy, synchronization, data-preservation, and failure behavior.

### NDV-SYS-2026-07-21-002 — CCS lacked a one-step native Mac entrance

- Status: `resolved — monitor authentication friction and recurrence`.
- Materiality: M2 ADHD workflow-continuity and access issue.
- Owner: Codex / ACS Command Center implementation.
- Task nature or workstream: direct access to the Central Command Center from the user's Mac desktop, Spotlight, or a bounded spoken open command.
- Affected systems and programs: macOS Finder and Desktop, Launch Services, Siri application launch, default browser, ChatGPT Sites owner authentication, Codex desktop, and the production CCS.
- Creation or detection context: the user reported that CCS had no standalone clickable application. The normal route required opening ChatGPT desktop, navigating into Codex, manually reaching the site, and then completing passkey and confirmation steps, which made idea capture likely to fail before CCS was reached.
- Detected: 2026-07-21.
- Resolved: 2026-07-21 for the native entrance; independent owner-session expiry remains a residual security boundary.
- Observed facts: no CCS or NEURO-DIV Command Center application existed in the user's Applications folders before correction; the production surface was available only as a URL; the default HTTPS handler was Chrome; the user supplied direct testimony about the authentication chain and its cognitive cost.
- `Deficiency_Source`: `NEURO_DIV_ARCHITECTURE` — the system exposed a browser surface without the promised low-friction native entrance.
- `NEURO_DIV_Control_Result`: `CONTROL_DEFICIENCY` — the required CCS visibility layer existed but its primary user entrance did not meet the operational friction requirement.
- Root cause or mechanism: implementation stopped at a private web surface and did not install a durable native launcher or model the launch path as a required production control.
- Corrective actor: Codex, operating in the authorized repository and Mac environment.
- Corrective action: built, ad-hoc signed, installed, and registered `NEURO-DIV Command Center.app` under the user's Applications folder; created a Desktop entry; configured the app to open the production CCS URL directly in the default browser; declared `CCS` as its spoken and alternative app name; and preserved owner authentication rather than storing or bypassing a passkey.
- Verification and read-back: the installed bundle passed `codesign --verify`; its Info.plist passed validation; Launch Services read back bundle identifier `org.neuro-div.command-center`; the Applications bundle and Desktop entry were read back; and an actual app launch successfully dispatched through macOS. Authentication-session reuse is expected browser behavior but was not claimed verified beyond dispatch because an expired owner session may still require identity confirmation.
- Updated system-process narrative: `AGENTS.md`; `resources/universal-intake-implementation.md`; `resources/agent-coordination.md`; `resources/agent-resources.json`; `apps/acs-command-center/native/macos/command-center-launcher/main.swift`; `apps/acs-command-center/native/macos/command-center-launcher/Info.plist`; and `apps/acs-command-center/native/macos/install-command-center-launcher.zsh`.
- CCS reference: production item `intake-61208f7f-d429-4842-9380-4dec4513800c`, read back as `captured`.
- Canonical narrative revision: shared-agent brief revision `AIroW368AYoexFQfl8iKuSLAsUzdb3ozFWsygtNWMnCxMkqc6RYJxYY4i6p4oaVPHvx3gLbb2qN8GuUp_b0dWVXdED4jFLIZv6sFOwUs9A`, read back with the v0.5 correction.
- Residual boundary: mandatory owner-authentication expiry cannot be bypassed safely. The intended steady-state route is one click with the existing browser session; an expired session may add the minimum platform-required identity confirmation.
- Reuse candidates: treat entry-point friction as a production acceptance criterion for every high-frequency NEURO-DIV surface; distinguish session reuse from authentication bypass; provide a stable native name, Desktop/Spotlight route, and narrowly bounded spoken open command when supported.

### NDV-SYS-2026-07-21-003 — `Send to NEURO-DIV` absent from Mac and iPhone source surfaces

- Status: `partially resolved — Mac verified; signed iOS Shortcut awaits Apple-required import and device read-back`.
- Materiality: M2 universal-intake availability and documentation-integrity issue.
- Owner: Codex / ACS Command Center implementation.
- Task nature or workstream: route source files, URLs, text, and media directly from macOS Finder and iOS Share Sheets into CCS.
- Affected systems and programs: macOS Finder context and Services menus, Launch Services, native CCS app, Apple Shortcuts, iCloud Shortcuts synchronization, iOS Share Sheet, local intake staging, LaunchAgent router, iCloud processed archive, and production CCS.
- Creation or detection context: the user right-clicked an iCloud Drive file on Mac and opened an iPhone document Share Sheet. The supplied screenshots show no `Send to NEURO-DIV` or CCS action on either surface even though earlier project records claimed the Shortcut was observed and available.
- Evidence: `/Users/dinamargelovich/Downloads/Your'e very response is indicative of a greater issue progressive….png` shows the iPhone Share Sheet without a NEURO-DIV action; `/var/folders/1j/wzyjvt_s2g5543h_8n9k6bc40000gn/T/codex-clipboard-13d9ec9d-5ca4-48bf-8634-07d8dcd7a94d.png` shows the Mac Finder context menu without the action; `shortcuts list` and read-only Shortcuts database inspection confirmed no installed shortcut named `Send to NEURO-DIV`.
- Detected: 2026-07-21.
- Mac correction completed: 2026-07-21.
- `Deficiency_Source`: `HYBRID` — `NEURO_DIV_ARCHITECTURE` and `AI_NATIVE_EXECUTION` because the user-facing route was not installed and earlier agent records incorrectly claimed observed availability; `EXTERNAL_PLATFORM_OR_ENVIRONMENT` applies only to Apple's mandatory local Shortcut import confirmation and cross-device synchronization behavior.
- `NEURO_DIV_Control_Result`: `CONTROL_DEFICIENCY` for the missing route and unsupported completion claim; `ARCHITECTURE_GAP_OUTSIDE_SUPPLEMENTAL_CONTROL` remains for unverified iOS installation and synchronization until device read-back.
- Root cause or mechanism: the background processor and capture router were implemented, but the named user-facing Shortcut was never installed. Documentation treated an intended configuration as observed production state, and no device-surface acceptance test caught the mismatch.
- Corrective actor: Codex for implementation, installation, evidence correction, and CCS synchronization; the user is required only for Apple's irreducible local `Add Shortcut` confirmation.
- Corrective action on Mac: extended the installed native CCS application with a registered `Send to NEURO-DIV` service accepting file URLs, URLs, and text; used a private staging directory and atomic queue publication; explicitly started the existing LaunchAgent once per share; retained device-token authentication, SHA-256 deduplication, post-acknowledgment archival, and zero model use.
- Mac verification and read-back: Launch Services read back service name `Send to NEURO-DIV`; `NSPerformService` returned success; a real repository fixture routed through the service; pending and staging queues emptied after acknowledgment; the original appeared in the processed archive; production CCS item `intake-e21601a6-4369-4924-afa1-ba3441e38b8a` read back as `captured`, source `apple-share-and-capture`, with original filename, Mac device, and SHA-256 provenance.
- iOS corrective preparation: created and cryptographically signed a versioned `Send to NEURO-DIV` Shortcut accepting common Share Sheet content and targeting the existing iCloud Shortcuts pending folder; opened Apple's local import screen.
- iOS closure boundary: do not claim installed, synchronized, or visible until the user presses `Add Shortcut` and both the Mac Shortcuts library and physical iPhone Share Sheet are read back. The signed installer is stored locally under `Library/Application Support/NEURO-DIV/Shortcut Installation` and its source is versioned in the repository.
- Updated system-process narrative: `AGENTS.md`; `resources/universal-intake-implementation.md`; `resources/agent-coordination.md`; `resources/agent-resources.json`; the native launcher/service sources; and `apps/acs-command-center/native/shortcuts/Send to NEURO-DIV.shortcut.plist` plus its preparation script.
- CCS reference: production item `intake-ad49165b-d79b-499a-b594-fbd78c710f32`, read back as `captured`.
- Canonical narrative revision: shared-agent brief revision `AIroW368AYoexFQfl8iKuSLAsUzdb3ozFWsygtNWMnCxMkqc6RYJxYY4i6p4oaVPHvx3gLbb2qN8GuUp_b0dWVXdED4jFLIZv6sFOwUs9A`, read back with the contradictory evidence, Mac verification, Siri launch-only boundary, and open iOS status.
- Reuse candidates: every claimed user-facing integration must include a surface-level acceptance test on each applicable device; implementation of a background processor is not evidence that the Share Sheet or context-menu entrance exists; preserve a native service fallback on Mac even when cross-device Shortcuts are available.

## Linked source registers

- `resources/ai-response-integrity-review-2026-07-17.md` — supplementary adjudicated incident records, including `NDV-INC-ICLOUD-01`, `NDV-INC-EVASION-01`, and `NDV-INC-EVASION-02`.
- `resources/integrity-materiality-control.md` — commitment, evidence, materiality, source-classification, correction, recurrence, and closure requirements.
- `resources/automation-cost-cadence-proportionality-control.md` — mandatory gate before any biweekly review mechanism is activated.
