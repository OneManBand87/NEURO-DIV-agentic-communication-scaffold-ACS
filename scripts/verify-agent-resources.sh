#!/bin/sh

set -eu

root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
cd "$root"

required_files='AGENTS.md
CLAUDE.md
GEMINI.md
.mcp.json
.vscode/mcp.json
.vscode/settings.json
.github/copilot-instructions.md
.github/instructions/agent-coordination.instructions.md
resources/agent-coordination.md
resources/agent-resources.json
resources/theory-branch-integration.md
resources/qtu-provisional-validation-hold.md
resources/qtu-administrative-logistical-safe-harbor.md
resources/integrity-materiality-control.md
resources/maximal-progression-user-attention-control.md
resources/automation-cost-cadence-proportionality-control.md
resources/ai-response-integrity-review-2026-07-17.md
scripts/verify-automation-cost-control.mjs
skills-lock.json'

missing=0
for file in $required_files; do
  if [ ! -f "$file" ]; then
    printf 'missing: %s\n' "$file" >&2
    missing=1
  fi
done

for ai_ccs_file in AGENTS.md resources/agent-coordination.md; do
  if ! rg -Fq 'Mandatory AI routing through CCS' "$ai_ccs_file" &&
     ! rg -Fq 'mandatory orchestration and visibility layer for all substantive AI-assisted work across NEURO-DIV' "$ai_ccs_file"; then
    printf 'Mandatory AI-to-CCS routing rule missing: %s\n' "$ai_ccs_file" >&2
    exit 1
  fi
done

if ! jq -e '.commandCenter.aiRouting | (.status == "mandatory") and (.scope == "all-substantive-ai-assisted-neuro-div-work") and (.ccsRole == "orchestration-and-visibility-layer") and (.coveredParticipants == "any-acs-member-or-other-ai-system") and (.triggerConditions | index("potentially-determinative") != null) and (.requiredCoverage | index("device-control-paths") != null) and (.requiredCoverage | index("handoffs") != null) and (.uncertaintyRule == "route-through-ccs") and (.supersedesCodexOnlyRule == true) and (.productionIntakeId | startswith("intake-"))' resources/agent-resources.json >/dev/null; then
  printf 'Mandatory AI-to-CCS routing metadata mismatch\n' >&2
  exit 1
fi

for slack_exclusion_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md resources/agent-coordination.md; do
  if ! rg -Fqi 'Slack is completely excluded' "$slack_exclusion_file" &&
     ! rg -Fqi 'Complete Slack exclusion' "$slack_exclusion_file"; then
    printf 'Complete Slack exclusion missing: %s\n' "$slack_exclusion_file" >&2
    exit 1
  fi
done

if ! jq -e '.slackExclusionControl | (.status == "mandatory-complete-exclusion") and (.architectureRole == "none") and (.allowedUses | length == 0) and (.prohibitedUses | index("agent-coordination") != null) and (.prohibitedUses | index("user-facing-interaction") != null) and (.historicalContentDisposition == "provenance-only-not-current-state-or-source-of-truth") and (.replacementControlPlane == "central-command-center") and (.userNavigationRequired == false) and (.canonicalBriefRevision | length > 20) and (.approvedArchitectureRevision | length > 20)' resources/agent-resources.json >/dev/null; then
  printf 'Complete Slack exclusion metadata mismatch\n' >&2
  exit 1
fi

for labor_boundary_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md resources/agent-coordination.md; do
  if ! rg -Fq 'Claude is reserved for explicitly assigned high-value coding and deep design work' "$labor_boundary_file"; then
    printf 'Claude labor boundary missing: %s\n' "$labor_boundary_file" >&2
    exit 1
  fi
done

if ! jq -e '.ccsSignalIngestionControl | (.architecture == "event-driven-single-ccs-ledger") and (.duplicateDisposition == "suppress-task-and-model-run") and (.noChangeDisposition == "suppress-task-and-model-run") and (.connectorTripwires.consecutiveErrors == 2) and (.connectorTripwires.consecutiveNoChangeEvents == 3) and (.claudeRoutine.status == "paused") and (.claudeRoutine.allowedRole == "explicit-high-value-coding-and-deep-design") and (.acsAct002 == "unexecuted-pending-canonical-reconciliation")' resources/agent-resources.json >/dev/null; then
  printf 'CCS signal ingestion or Claude labor boundary metadata mismatch\n' >&2
  exit 1
fi

for automation_cost_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md README.md resources/agent-coordination.md resources/theory-branch-integration.md; do
  if ! rg -Fq 'automation-cost-cadence-proportionality-control.md' "$automation_cost_file"; then
    printf 'Automation cost control link missing: %s\n' "$automation_cost_file" >&2
    exit 1
  fi
done

if ! rg -Fq 'Unknown or unbounded cost is not zero' resources/automation-cost-cadence-proportionality-control.md ||
   ! rg -Fq 'automatic pause after two consecutive system errors' resources/automation-cost-cadence-proportionality-control.md ||
   ! rg -Fq 'automatic pause after three consecutive no-op runs' resources/automation-cost-cadence-proportionality-control.md ||
   ! rg -Fq 'NDV-COST-2026-07-19-A' resources/automation-cost-cadence-proportionality-control.md ||
   ! rg -Fq 'QTU-LCB90`: `0.927284744' resources/automation-cost-cadence-proportionality-control.md; then
  printf 'Automation cost control invariants missing\n' >&2
  exit 1
fi

if ! jq -e '.automationCostCadenceProportionalityControl | (.status == "mandatory") and (.tripwires.consecutiveSystemErrors == 2) and (.tripwires.consecutiveNoOpRuns == 3) and (.affectedAutomation.status == "paused") and (.authorization.directiveId == "NDV-COST-2026-07-19-A") and (.authorization.qtuLcb90 >= 0.90)' resources/agent-resources.json >/dev/null; then
  printf 'Automation cost control metadata mismatch\n' >&2
  exit 1
fi

if ! rg -Fq 'automation-cost-cadence-proportionality-control.md' .codex/hooks/ndv_context_hook.py ||
   ! rg -Fq 'automation cost/cadence control' .codex/hooks/ndv_context_hook.py ||
   ! rg -Fq 'qtu-provisional-validation-hold.md' .codex/hooks/ndv_context_hook.py; then
  printf 'Codex context hook automation cost reminder missing\n' >&2
  exit 1
fi

node scripts/verify-automation-cost-control.mjs >/dev/null

for native_reminder_file in AGENTS.md resources/agent-coordination.md resources/automation-cost-cadence-proportionality-control.md; do
  if ! rg -Fq 'cheapest adequate device-native or product-native mechanism' "$native_reminder_file" ||
     ! rg -Fq 'Never create a Codex or other LLM automation merely to wait, poll, check' "$native_reminder_file"; then
    printf 'Native reminder routing control missing: %s\n' "$native_reminder_file" >&2
    exit 1
  fi
done

if ! rg -Fq 'NDV-NOTIFY-2026-07-19-A' resources/automation-cost-cadence-proportionality-control.md ||
   ! rg -Fq 'QTU-LCB90`: `0.927284744' resources/automation-cost-cadence-proportionality-control.md; then
  printf 'Native reminder routing authorization missing\n' >&2
  exit 1
fi

if ! jq -e '.nativeReminderNotificationRoutingControl | (.status == "mandatory") and (.authorization.directiveId == "NDV-NOTIFY-2026-07-19-A") and (.authorization.qtuLcb90 >= 0.90) and (.recurrencePreference == "native-recurring-reminder-over-recurring-agent-run")' resources/agent-resources.json >/dev/null; then
  printf 'Native reminder routing metadata mismatch\n' >&2
  exit 1
fi

for attention_control_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md README.md resources/agent-coordination.md resources/theory-branch-integration.md resources/integrity-materiality-control.md; do
  if ! rg -Fq 'maximal-progression-user-attention-control.md' "$attention_control_file"; then
    printf 'Maximal-progression control link missing: %s\n' "$attention_control_file" >&2
    exit 1
  fi
done

if ! rg -Fq '🚨 **ACTION REQUIRED FROM YOU — [ONE SHORT ACTION]**' resources/maximal-progression-user-attention-control.md ||
   ! rg -Fq 'bare or unbolded `🚨 ACTION REQUIRED FROM YOU` heading' resources/maximal-progression-user-attention-control.md ||
   ! rg -Fq 'NDV-ATTN-INC-2026-07-20-A' resources/agent-resources.json ||
   ! rg -Fq '🚨 **ACTION REQUIRED FROM YOU — [SHORT ACTION]**' AGENTS.md ||
   ! rg -Fq 'The agent remains the task owner' resources/maximal-progression-user-attention-control.md ||
   ! rg -Fq 'must not be required to remember to request continuation' resources/maximal-progression-user-attention-control.md ||
   ! rg -Fq 'NDV-ATTN-2026-07-19-A' resources/maximal-progression-user-attention-control.md ||
   ! rg -Fq 'QTU-LCB90`: `0.927284744' resources/maximal-progression-user-attention-control.md; then
  printf 'Maximal-progression control invariants missing\n' >&2
  exit 1
fi

if ! jq -e '.maximalProgressionUserAttentionControl | (.attentionTemplateHeader == "🚨 ACTION REQUIRED FROM YOU — [SHORT ACTION]") and (.attentionTemplateHeaderMarkdown == "🚨 **ACTION REQUIRED FROM YOU — [SHORT ACTION]**") and (.headingMustBeBold == true) and (.shortActionSuffixRequired == true) and (.standaloneVisualSeparationRequired == true) and (.exactActionAndEssentialControlsMustBeBold == true) and (.fontSizeRelianceProhibited == true) and (.bareHeadingIsNoncompliant == true) and (.controlApplicationIncident.id == "NDV-ATTN-INC-2026-07-20-A") and (.controlApplicationIncident.materiality == "M2") and (.controlApplicationIncident.chronologyConclusion == "noncompliant-response-followed-directive-and-global-persistence") and (.controlApplicationIncident.concurrencyDisposition == "mechanism-not-exception") and (.controlApplicationIncident.status == "corrective-control-installed-sustained-effectiveness-open") and (.controlApplicationIncident.productionCcsIntakeId | startswith("intake-")) and (.controlApplicationIncident.productionCcsReadBackStatus == "captured") and (.controlApplicationIncident.canonicalBriefRevision | length > 20)' resources/agent-resources.json >/dev/null; then
  printf 'ADHD-salient user-action presentation control mismatch\n' >&2
  exit 1
fi

for integrity_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md resources/agent-coordination.md resources/integrity-materiality-control.md; do
  if ! rg -Fq 'integrity-materiality-control.md' "$integrity_file" && [ "$integrity_file" != 'resources/integrity-materiality-control.md' ]; then
    printf 'integrity control link missing: %s\n' "$integrity_file" >&2
    exit 1
  fi
done

if ! rg -Fq 'PCAOB-aligned' resources/integrity-materiality-control.md || ! rg -Fq 'QTU-LCB90 = 0.908739' resources/integrity-materiality-control.md; then
  printf 'integrity control invariants missing\n' >&2
  exit 1
fi

for qtu_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md README.md resources/agent-coordination.md resources/agent-resources.json resources/theory-branch-integration.md resources/integrity-materiality-control.md; do
  if ! rg -Fq 'qtu-provisional-validation-hold.md' "$qtu_file"; then
    printf 'QTU provisional validation hold missing: %s\n' "$qtu_file" >&2
    exit 1
  fi
done

for qtu_hold_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md README.md resources/agent-coordination.md resources/theory-branch-integration.md resources/integrity-materiality-control.md; do
  if ! rg -Fq 'qtu-provisional-validation-hold.md' "$qtu_hold_file"; then
    printf 'QTU provisional validation hold link missing: %s\n' "$qtu_hold_file" >&2
    exit 1
  fi
done

if ! rg -Fq 'DESIGN_CONFORMANCE_ONLY — NOT EMPIRICALLY VALIDATED' resources/qtu-provisional-validation-hold.md ||
   ! rg -Fq 'provisional policy parameter' resources/qtu-provisional-validation-hold.md ||
   ! rg -Fq 'cannot independently authorize' resources/qtu-provisional-validation-hold.md; then
  printf 'QTU provisional validation hold invariants missing\n' >&2
  exit 1
fi

if ! jq -e '.qtuExecutionGate | (.status == "provisional-validation-hold") and (.independentExecutionAuthorization == false) and (.interval.provisionalPolicyParameter == 0.9) and (.interval.scientificallyEstablishedCutoff == false) and (.activeDesignStatus == "QTU_DESIGN_CONFORMANT") and (.empiricallyValidatedStatusAvailable == false) and (.cannotIndependentlyAuthorize | index("M3") != null) and (.cannotIndependentlyAuthorize | index("M4") != null)' resources/agent-resources.json >/dev/null; then
  printf 'QTU provisional validation hold metadata mismatch\n' >&2
  exit 1
fi

for safe_harbor_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md README.md resources/agent-coordination.md resources/theory-branch-integration.md resources/integrity-materiality-control.md; do
  if ! rg -Fq 'qtu-administrative-logistical-safe-harbor.md' "$safe_harbor_file"; then
    printf 'QTU safe-harbor link missing: %s\n' "$safe_harbor_file" >&2
    exit 1
  fi
done

if ! rg -Fq 'not comprehensive, exhaustive, exclusive, or automatic precedents' resources/qtu-administrative-logistical-safe-harbor.md ||
   ! rg -Fq 'Artifact-related documentation remains in scope' resources/qtu-administrative-logistical-safe-harbor.md ||
   ! rg -Fq 'The governing criterion is whether the action affects a project/work-product' resources/qtu-administrative-logistical-safe-harbor.md ||
   ! rg -Fq 'They are examples, not the definition of the safe harbor' resources/qtu-administrative-logistical-safe-harbor.md ||
   ! rg -Fq 'do not represent every possible activity, setting, environment, purpose, dependency, or downstream effect' resources/qtu-administrative-logistical-safe-harbor.md ||
   ! rg -Fq 'QTU-LCB90`: `0.927284744' resources/qtu-administrative-logistical-safe-harbor.md; then
  printf 'QTU safe-harbor invariants missing\n' >&2
  exit 1
fi

safe_example_count=$(awk '/^### Illustrative examples where QTU does not apply/{active=1; next} /^### Illustrative examples where QTU applies/{active=0} active && /^- /{count++} END{print count+0}' resources/qtu-administrative-logistical-safe-harbor.md)
qtu_example_count=$(awk '/^### Illustrative examples where QTU applies/{active=1; next} /^## Questionable and borderline determinations/{active=0} active && /^- /{count++} END{print count+0}' resources/qtu-administrative-logistical-safe-harbor.md)
borderline_example_count=$(awk '/^## Questionable and borderline determinations/{active=1; next} /^## Decision procedure/{active=0} active && /^- /{count++} END{print count+0}' resources/qtu-administrative-logistical-safe-harbor.md)
if [ "$safe_example_count" -ne 30 ] || [ "$qtu_example_count" -ne 30 ] || [ "$borderline_example_count" -ne 15 ]; then
  printf 'QTU safe-harbor example catalogue mismatch: safe=%s qtu=%s borderline=%s\n' "$safe_example_count" "$qtu_example_count" "$borderline_example_count" >&2
  exit 1
fi

if ! jq -e '.qtuExecutionGate.administrativeLogisticalSafeHarbor | (.decisionStages | length == 2) and (.desktopBrowserSettingsRole == "illustrative-examples-not-eligibility-definition") and (.authorization.directiveId == "NDV-QTU-SH-2026-07-19-C")' resources/agent-resources.json >/dev/null; then
  printf 'QTU safe-harbor governing-rule metadata mismatch\n' >&2
  exit 1
fi

if [ "$missing" -ne 0 ]; then
  exit 1
fi

for json_file in .mcp.json .vscode/mcp.json .vscode/settings.json resources/agent-resources.json skills-lock.json; do
  jq empty "$json_file"
done

expected='https://mcp.zapier.com/api/v1/connect'
for endpoint_file in .mcp.json .vscode/mcp.json resources/agent-resources.json; do
  if ! rg -Fq "$expected" "$endpoint_file"; then
    printf 'Zapier endpoint mismatch: %s\n' "$endpoint_file" >&2
    exit 1
  fi
done

tracked_sensitive=$(git ls-files | rg -i '(^|/)(\.env($|\.)|.*token.*|.*credential.*|cookies.*)' || true)
if [ -n "$tracked_sensitive" ]; then
  printf 'possible sensitive tracked files:\n%s\n' "$tracked_sensitive" >&2
  exit 1
fi

printf 'agent resources verified\n'
