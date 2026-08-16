# NEURO-DIV Generalized Image-Ingestion Control

Status: Mandatory primary semantic-input control; operating effectiveness pending

Last verified: 2026-08-15

Control role: This is the detailed primary control for semantic ingestion of user-supplied images and visual inputs. It complements, but does not replace, universal intake, COC routing, integrity/materiality, security/privacy, or other independent hard gates.

## Purpose and design basis

This control addresses a recurring failure mode in which an image or screenshot is visually recognized but its substantive text, structure, or relationships are not normalized before reasoning. The observed source case involved an answer about when a setting runs when the question concerned what the setting controls. The failure mechanism was salience anchoring and acceptance of a nearby interpretation without a heading-to-content and semantic-category validation pass.

Basis: user-reported failure, directly inspected source conversation, existing NEURO-DIV capture and integrity controls, and a conservative protective default. This is design evidence for the targeted error, not evidence that every client or model has the same failure rate.

## Scope and trigger

This control applies to every user-supplied image used in NEURO-DIV or ACS work, including screenshots, photographs, scans, charts, graphs, flowcharts, diagrams, menus, dialogs, UI captures, code or text images, contact or correspondence information, and competing-product or platform material.

The default presumption is that each image is substantive and relevant to one or more active NEURO-DIV projects. Do not infer that an image is decorative, incidental, or irrelevant from its appearance, filename, thumbnail, placement, or salience. A clear current user instruction may narrow the scope of that particular image; the narrowing must be explicit and must not waive higher-priority safety, privacy, security, platform, or authorization controls.

Trigger this procedure:

- when an image is attached, received, referenced, or made available through an intake or connector surface;
- before any answer, action, classification, routing decision, or material claim that could depend on the image; and
- separately for every image in a multi-image input, including images that appear repetitive.

## Required ingestion and normalization sequence

Image-dependent reasoning is blocked until this sequence is complete for the relevant source:

1. **Access and source check.** Confirm that the actual image is available to the agent, not merely a filename, thumbnail, alt text, or user reference. Preserve the original source and note rotation, crop, resolution, occlusion, stale state, and other access limitations.
2. **Complete content inventory.** Identify all legible text, labels, controls, values, legends, axes, code, contact/correspondence details, and other materially relevant content. Identify meaningful visual structure: hierarchy, grouping, arrows, connectors, sequence, containment, alignment, state, trend, comparison, and spatial or causal relationships.
3. **Structured normalization.** Produce a compact representation containing, as applicable, verbatim text, object/control/value triples, UI hierarchy, diagram nodes and edges, graph axes and trends, workflow sequence, code regions, entities, project relevance, and explicitly unreadable, missing, ambiguous, or conflicting regions. Keep visual relationships that a flat transcription would lose.
4. **Question alignment.** State the semantic object and answer category required by the user’s question before reasoning. Distinguish function or effect from trigger, scope, timing, persistence, configuration, or adjacent lifecycle facts. Integrate the normalized image record with the supplied text and active project context.
5. **Evidence and uncertainty labeling.** Separate directly legible or structurally observed content from inference, interpretation, analogy, proposal, and unknown. Do not silently fill gaps or present an image-derived inference as observed fact.
6. **Pre-reasoning validation.** Run the gate below. Only after it passes may the agent provide image-dependent reasoning or take an image-dependent action.

The normalized representation is substantive project context, equivalent in status to relevant pasted structured text plus the preserved visual relationships. It is not an optional caption or decorative observation.

## Validation gate before reasoning

The gate passes only when all applicable checks pass:

- **Source availability:** the actual source was inspected; no claim of visual inspection is based only on a name, thumbnail, alt text, or assumed attachment.
- **Coverage:** all legible content and all visual relationships material to the question were inventoried; the process did not attend only to the most salient label or control.
- **Semantic alignment:** the planned answer addresses the asked function, effect, purpose, scope, trigger, timing, or other category rather than a nearby category.
- **Paste-equivalence:** ask whether the answer would materially change if the same information had been pasted as structured text. If yes, return to normalization and resolve the missing relationship or text.
- **Uncertainty and contradiction:** unreadable, cropped, stale, occluded, ambiguous, or conflicting content is marked and bounded; unknown remains unknown.
- **Context integration:** the image-derived record is reconciled with the user’s wording, project context, and applicable controls.
- **Action boundary:** image interpretation does not itself authorize clicking, sending, publishing, executing, purchasing, deleting, or any other downstream action.

If the gate is not passed, do not continue image-dependent reasoning. A text-only portion may proceed only with an explicit boundary stating that the image-dependent portion is held.

## Failure and remediation handling

If access, rendering, extraction, normalization, semantic alignment, or validation fails:

1. stop image-dependent reasoning and action;
2. state exactly what was unavailable, unreadable, omitted, or conflicting;
3. preserve the original image and any partial normalized record within the authorized task/evidence boundary;
4. complete all safe text-only or preparatory work that does not depend on the failed image;
5. request the smallest bounded recovery needed: re-upload, clearer image, crop, alternate format, or pasted text for only the missing region; and
6. after recovery, rerun the complete sequence and validation gate rather than resuming from memory or salience.

Do not claim that the image was inspected when it was not. Do not require the user to reconstruct content that can be recovered from the source or an authorized connector. If a conflict between instructions or image interpretations remains unresolved, quarantine the image-dependent conclusion and route the conflict through COC and the applicable integrity/remediation process.

A repeated user-visible semantic mismatch is at least an M2 control concern under the integrity/materiality framework. A deficiency that affects architecture, research, software, security, business, canonical state, or multiple projects is routed as M3 or higher as appropriate. Use the existing remediation lifecycle: detect, classify, preserve evidence, identify contradictions, determine root cause, design the smallest correction, review conformance, implement, read back, test recurrence, and consolidate or reopen.

## Precedence and interaction

The following rules prevent this control from competing with broader controls:

1. System and developer instructions, safety, privacy, security, authentication, platform policy, and other mandatory hard gates remain controlling.
2. An explicit current user scope controls the requested image context only when it is clear and compatible with the higher-priority rules.
3. The canonical shared brief and repository `AGENTS.md` establish the NEURO-DIV global minimum. This detailed control operationalizes that minimum for image semantics; it may not accidentally scope out the global presumption, validation gate, or failure recovery.
4. Specialized controls apply within their ownership and may add constraints but may not weaken this control or another independent hard gate. If two controls actually conflict, do not synthesize an ad hoc compromise: hold the affected conclusion, record the conflict, and use the stricter compatible requirement pending formal resolution.
5. Client defaults, model habits, visual salience, and convenience are lower-priority and never override the control.

ChatGPT persistent memory is the supplemental/entity-level compensating control. Where present, it supplies the broad presumption that images are substantive and the conservative stop-and-recover behavior if the detailed procedure is missed. It is not the source of truth, does not replace this sequence, and is not a second procedure to merge with it. If memory and the detailed control appear to differ, follow the stricter compatible requirement; an actual conflict is handled by the precedence rule above rather than by informal synthesis. Memory or a Markdown read is not, by itself, proof of runtime enforcement.

### Control ownership boundaries

| Control | Owns | Does not own |
| --- | --- | --- |
| Universal intake | transport, preservation, provenance, deduplication, routing, and triage of raw inputs | semantic interpretation of image contents |
| This image-ingestion control | access check, content inventory, visual-relationship extraction, normalization, semantic alignment, and the pre-reasoning gate | authorization for downstream actions or evidence/materiality disposition |
| COC / ACS | orchestration, visibility, routing, handoffs, and state synchronization | permission to bypass source inspection or validation |
| Integrity/materiality | claim classification, contradictory evidence, materiality, durable commitments, read-back, and recurrence handling | replacing the image source or silently interpreting an unavailable image |
| QTU hold | advisory diagnostic/design-conformance input only | independent authorization or waiver of any hard gate |
| Security, privacy, authentication, and platform controls | independent hard gates | being weakened by image relevance or user convenience |

## Evidence and operating-effectiveness status

Installation of this file, the manifest entry, and canonical-brief read-back demonstrate design conformance and synchronization only. They do not demonstrate operating effectiveness.

Operating tests must include, at minimum: a settings screenshot asking function/effect rather than trigger/timing; a screenshot asking applicability or scope; a graph or flowchart; a code or text image; contact/correspondence information; a competing-platform UI; a low-resolution, cropped, unavailable, or conflicting image; multiple images; and a case where a detailed task instruction appears to narrow the global presumption.

Acceptance requires complete normalized records, correct semantic-category answers, explicit uncertainty, no image-dependent reasoning before validation, bounded failure recovery, and recurrence testing in the actual consuming client or runtime. Any missed case reopens the control and its evidence status.

## Change record

- 2026-08-15: Installed as the detailed primary generalized image-ingestion control after review of the Codex Setting Explanation source conversation and the existing ACS Markdown architecture. ChatGPT persistent memory remains a supplemental/entity-level compensating layer; no memory effectiveness claim is made by this repository change.
