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

if ! rg -Fq '🚨 ACTION REQUIRED FROM YOU' resources/maximal-progression-user-attention-control.md ||
   ! rg -Fq 'The agent remains the task owner' resources/maximal-progression-user-attention-control.md ||
   ! rg -Fq 'must not be required to remember to request continuation' resources/maximal-progression-user-attention-control.md ||
   ! rg -Fq 'NDV-ATTN-2026-07-19-A' resources/maximal-progression-user-attention-control.md ||
   ! rg -Fq 'QTU-LCB90`: `0.927284744' resources/maximal-progression-user-attention-control.md; then
  printf 'Maximal-progression control invariants missing\n' >&2
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
