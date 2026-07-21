# QTU Administrative and Logistical Safe Harbor

Status: Historical scope amendment; subject to the mandatory QTU provisional validation hold

Last verified: 2026-07-20

Current interpretation: [the QTU provisional validation hold](qtu-provisional-validation-hold.md) supersedes this document's execution-gate and authorization language. Preserve that language as provenance only. Every historical `QTU_AUTHORIZED` label means `DESIGN_CONFORMANCE_ONLY — NOT EMPIRICALLY VALIDATED`; `0.90` is a provisional policy parameter; QTU cannot independently authorize consequential action.

Canonical source: [NEURO-DIV - Agentic Communication Scaffold (ACS) - Shared Agent Brief - Current](https://docs.google.com/document/d/1luvRe6aZBdCIuJYC6PlGQjBe_u1yxiAWUS5y5EpfQ_Q/edit)

## Purpose

The QTU gate protects substantive projects, work products, production, documentation, governance, evidence, and consequential execution. It is not intended to block routine administrative or logistical actions that do not affect a project/work-product.

This safe harbor is an applicability rule, not a waiver and not a general computer-administration exemption. An action that fails any condition remains subject to QTU. Security, privacy, authorization, platform-policy, external-communication, destructive-action, and other independent hard gates remain applicable whether or not QTU applies.

## Controlling applicability rule

The governing criterion is whether the action affects a project/work-product or anything used to define, produce, document, govern, configure, test, verify, reproduce, approve, publish, or communicate it. If it does, QTU applies. If it does not, the action may qualify for the safe harbor only when every safe-harbor condition passes.

Purpose, target, dependencies, and reasonably foreseeable downstream effects control the classification. The application, device, storage location, or environment in which an action occurs is not the governing rule.

## Illustrative setting categories

Desktop settings, browser settings, local interface preferences, empty local organizational folders, temporary-file housekeeping, navigation, inspection, and other routine administrative or logistical actions are illustrative categories that may qualify. They are examples, not the definition of the safe harbor. Each real action must be classified by its project/work-product effect and the safe-harbor conditions.

Desktop and browser examples commonly qualify when they affect only personal presentation or convenience, but an identical action remains within QTU when its purpose or effect is project/work-product production, configuration, testing, verification, evidence, workflow, or documentation.

## Artifact-related documentation remains in scope

The safe harbor never covers an action that creates, edits, interprets, approves, validates, publishes, or materially affects:

- any work product or artifact;
- documents or documentation of any kind, regardless of filename or extension, including Markdown (`.md`), README, plain-text, reStructuredText, office, web, and similar files;
- memoranda, narratives, reports, briefs, notes, indexes, manifests, registries, inventories, metadata, schemas, status records, implementation records, evidence, provenance, verification records, or completion claims;
- agent instructions, skills, examples, templates, control narratives, policies, decision rules, methodology, acceptance criteria, production criteria, accessibility requirements, or tests;
- software code, dependencies, extensions, scripts, build settings, developer-tool settings, shared or production configuration, deployments, or automations;
- workflow behavior, workflow inputs or outputs, routing, notifications used for monitoring, canonical state, commits, pushes, uploads, publication, external communication, or purchases;
- security, privacy, credentials, authentication, permissions, sharing, cookies, tracking protection, password management, autofill, proxy, VPN, DNS, firewall, site access, browser synchronization, or destructive clearing of data; or
- any configuration used to generate, inspect, test, approve, validate, reproduce, evidence, or represent a work product or outcome.

Storage on a personal desktop or in a browser does not make a protected action eligible. Characterizing a protected record or configuration as administrative, logistical, supporting, personal, temporary, local, or convenient does not create an exemption.

## Safe-harbor conditions

QTU does not apply only when every condition is true:

1. The action does not affect a project/work-product or anything used to define, produce, document, govern, configure, test, verify, reproduce, approve, publish, or communicate it.
2. The action is routine and non-substantive.
3. The action is precisely bounded and readily reversible.
4. The action remains internal and does not change canonical, shared, published, or externally communicated state.
5. The action has no work-product, artifact, documentation, governance, software, code, methodology, workflow, testing, evidence, security, privacy, authentication, permission, sharing, external-state, canonical-state, or destructive relationship.
6. The action has no reasonably foreseeable material downstream consequence.
7. Independent security, privacy, authorization, platform-policy, external-communication, and destructive-action controls permit it.

An agent using the safe harbor must:

1. identify the action as administrative or logistical and record why it has no project/work-product effect;
2. confirm every condition before acting;
3. record the brief classification basis in working context;
4. keep the mutation to the minimum necessary scope;
5. preserve a recovery path when needed; and
6. perform direct read-back afterward.

If applicability remains genuinely uncertain after examination, QTU applies.

## Non-exhaustive illustrative examples

The examples below are illustrative only. They are not comprehensive, exhaustive, exclusive, or automatic precedents. They do not represent every possible activity, setting, environment, purpose, dependency, or downstream effect. An action does not need to appear on either list to be classified. Similarity to an exempt example does not create an exemption when the actual purpose, target, environment, dependency, or effect is protected. Agents must apply the controlling criteria to the real action and current environment.

### Illustrative examples where QTU does not apply

Subject to every safe-harbor condition, examples include:

- adjusting display brightness for personal comfort;
- toggling a personal local dark mode;
- changing a personal local wallpaper;
- resizing a personal Dock or taskbar;
- toggling personal Dock or taskbar auto-hide;
- changing personal pointer speed;
- changing personal double-click speed;
- reversing personal scroll direction;
- changing personal keyboard repeat rate;
- enabling Sticky Keys solely for personal input;
- enabling Reduce Motion solely for personal use;
- enabling local display contrast solely for personal use;
- enabling a personal color filter solely for personal use;
- enabling a local screen magnifier;
- changing local text scaling solely for personal use;
- rearranging personal monitor positions outside testing or production;
- changing local speaker volume;
- muting non-work local interface sounds;
- rearranging application windows for personal convenience;
- changing browser zoom solely for personal reading;
- changing a local browser theme;
- showing or hiding the bookmarks bar without editing bookmarks;
- showing or hiding a local browser sidebar;
- reordering local browser tabs;
- grouping local browser tabs for a personal session;
- pinning or unpinning a local browser tab for a personal session;
- opening or closing a browser window;
- showing or hiding the browser home button;
- changing a personal new-tab background; and
- using reader view solely for personal reading without treating the transformed view as authoritative evidence.

### Illustrative examples where QTU applies

Examples include:

- creating or editing a README or other work product;
- creating or editing a Markdown or other documentation file;
- creating or updating a manifest, registry, index, schema, metadata definition, evidence record, or status record;
- creating or modifying an agent skill;
- editing `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, Copilot instructions, or other agent instructions;
- modifying software code;
- changing a software dependency;
- changing formatter, lint, compiler, or developer-tool configuration;
- adding or altering tests or test configuration;
- adding or changing accessibility production requirements;
- recording that a feature, control, remediation, synchronization, or artifact is implemented or complete;
- changing a methodology or workflow definition;
- activating or editing an automation;
- changing shared build settings;
- changing deployment configuration;
- committing repository changes;
- pushing repository changes;
- uploading, publishing, or moving canonical artifact-related state;
- editing a Google Drive artifact document or artifact-related memo;
- installing or configuring a browser extension;
- changing camera, microphone, location, notification, file-system, or other site permissions;
- changing password-manager, saved-password, credential, authentication, or autofill settings;
- changing cookie, tracking, privacy, or security settings;
- changing proxy, VPN, DNS, firewall, or network-security settings;
- changing a download destination used by a work process;
- enabling browser synchronization for work or protected data;
- clearing history, cookies, cache, saved sessions, credentials, downloads, or other data;
- changing DevTools overrides or browser emulation used for testing;
- changing zoom, contrast, color, or display settings used as production, testing, screenshot, visual-quality, or verification evidence; and
- changing system language, locale, date, time, or timezone when records, formatting, tests, or workflows may be affected.

## Questionable and borderline determinations

These examples apply the controlling rule; they are not shortcuts or precedents detached from their stated facts.

- **Browser zoom for personal reading — QTU does not apply.** The effect is local presentation only. **The same zoom used to validate responsive design or accessibility — QTU applies** because it becomes a test condition and verification evidence.
- **A personal color filter or contrast setting — QTU does not apply** when used only for personal comfort. **It applies when used to evaluate or approve an artifact** because it affects methodology and evidence.
- **Rearranging windows or monitors — QTU does not apply** for personal convenience. **It applies when the arrangement defines a documented procedure, automated workspace, screenshot baseline, or visual-quality test.**
- **Changing the default browser — QTU does not apply only** when it is a reversible personal link-opening preference with no work dependency. **It applies when authentication, automation, testing, connector behavior, or workflow routing depends on the browser.**
- **Showing or hiding the bookmarks bar — QTU does not apply** when display-only. **Creating, editing, moving, or deleting a bookmark collection used as a project index, source registry, evidence list, or workflow input is within QTU.**
- **Pinning or grouping tabs — QTU does not apply** for a local personal session. **It applies when the tab set is shared, managed, canonical, automated, or relied upon as a workflow checklist.**
- **Reader view — QTU does not apply** for personal reading convenience. **It applies when transformed content is extracted, cited, compared, or retained as authoritative source evidence.**
- **Muting a local interface sound — QTU does not apply** when it affects only personal presentation. **Disabling a monitoring, security, deadline, workflow, or user-attention notification is within QTU** because it changes workflow behavior or risk.
- **Rearranging displays — QTU does not apply** for personal convenience. **It applies when the arrangement is part of accessibility testing, screenshot capture, visual validation, or a documented production setup.**
- **Changing a default PDF viewer — QTU does not apply only** for personal reading convenience. **It applies when the viewer participates in signing, commenting, conversion, export, validation, or another workflow.**
- **Clearing browser cache or cookies — QTU applies** because the action is destructive and may alter sessions, authentication, evidence, or application behavior.
- **Installing an accessibility or productivity extension — QTU applies** because software, permissions, privacy, security, and browser behavior may change.
- **Changing system language, locale, date, time, or timezone — QTU applies** when records, timestamps, formatting, tests, or workflows may change; uncertainty is resolved in favor of QTU.
- **Changing the browser download folder — QTU applies** when downloaded sources, workflow paths, automation, or records may be affected. A purely temporary personal download with no protected relationship must still be classified against every condition.
- **Renaming the computer or changing network identity — QTU applies** because security, authentication, discovery, permissions, or external systems may be affected.

## Decision procedure

Apply this two-stage decision rule:

1. Does the action affect a project/work-product or anything used to define, produce, document, govern, configure, test, verify, reproduce, approve, publish, or communicate it? If yes, QTU applies.
2. If no, is the action routine, administrative or logistical, non-substantive, precisely bounded, readily reversible, internal, free of reasonably foreseeable material downstream consequences, and permitted by every independent hard gate? Only when every condition is satisfied does the safe harbor apply.

The application, device, storage location, or environment is not an eligibility criterion. Examples illustrate how to apply the rule; they do not define or limit it.

## Directive-specific authorization record

- Directive ID: `NDV-QTU-SH-2026-07-19-C`
- Directive hash: `48b04bc06d2a7ee84ef9f14b41a32b1b8171d06512be8fca438e68c04f3f6784`
- Scope: install, synchronize, verify, commit, and push the correction that restores project/work-product effect as the governing criterion and keeps desktop/browser settings as illustrative examples without changing the QTU formula or threshold.
- Superseded point: commit `a81174c` and Directive B's desktop/browser-only eligibility definition. The commit and authorization remain preserved in history.
- Target repository state before correction: `a81174c5efbe6e6126d7c7f01134dd10d313962c`.
- Target canonical-brief revision before correction: `ALtnJHxxUWjUzDJVW99mVxykHiDnC9C8GQl58bbsgNzCWNas2A3DOHvFu1DPQf8tJhz6BFFh12s5kR5FeK7A7fMQrkrJXRVUXYInzp1XHQ`.
- `A_OOD` evidence: 60 of 60 classification cases passed.
- `A_CF` evidence: 60 of 60 paired counterfactual cases passed.
- Interval method: independent uniform `Beta(1,1)` component priors; conservative product of exact one-sided 90% component lower credible bounds.
- Component lower bounds: `0.962956252` for OOD and `0.962956252` for counterfactual performance.
- `L_min`: the two-stage user-directed model: project/work-product effect first, then safe-harbor conditions.
- `L(M)`: the same two stages implemented without an additional eligibility rule.
- Complexity ratio: `L_min/L(M) = 1.0`.
- Normalized posterior-mean point estimate: `0.968002081`.
- `QTU-LCB90`: `0.927284744`.
- Gate status: `QTU_AUTHORIZED`.
- Evaluator: deterministic property classifier executed in Python; expected outcomes derived from the user-directed scope boundary.
- Evaluated timestamp: `2026-07-19T21:06:43Z`.
- Evidence expiry: any material change to scope, target state, security conditions, or requested destinations.
- Post-execution verification: canonical Drive read-back; repository semantic searches; JSON parsing; local verifier; Git diff; commit and remote-push confirmation.

### Reperformance catalogue

The 60 OOD cases are the 30 safe-harbor examples and 30 in-scope examples listed above. For each case, set the ten decision factors according to the described action and apply the decision procedure.

The 60 counterfactual cases are paired transformations of the OOD catalogue:

- for each safe-harbor case, add a project/work-product effect and expect QTU to apply; and
- for each in-scope case, remove every project/work-product effect while preserving a routine, bounded, reversible administrative analogue, then expect the safe harbor to apply.

An independent reperformance must reproduce all 120 classifications, the two `Beta(61,1)` component posteriors, their exact 0.10 quantiles, the complexity ratio, and the conservative product. The authorization proves design conformance for this reversible amendment only; it does not establish production effectiveness.

### Prior authorization history

Directive `NDV-QTU-SH-2026-07-19-A` authorized the original administrative/logistical safe-harbor version. Directive `NDV-QTU-SH-2026-07-19-B` and commit `a81174c` introduced the desktop/browser-only misinterpretation. Directive C supersedes only that point while preserving both earlier authorizations and commits as provenance.
