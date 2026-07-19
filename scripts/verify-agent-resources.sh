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
resources/qtu-administrative-logistical-safe-harbor.md
resources/integrity-materiality-control.md
resources/ai-response-integrity-review-2026-07-17.md
skills-lock.json'

missing=0
for file in $required_files; do
  if [ ! -f "$file" ]; then
    printf 'missing: %s\n' "$file" >&2
    missing=1
  fi
done

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

for qtu_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md resources/agent-coordination.md resources/agent-resources.json resources/theory-branch-integration.md; do
  if ! rg -Fq 'QTU-LCB90' "$qtu_file"; then
    printf 'QTU execution gate missing: %s\n' "$qtu_file" >&2
    exit 1
  fi
done

for safe_harbor_file in AGENTS.md CLAUDE.md GEMINI.md .github/copilot-instructions.md .github/instructions/agent-coordination.instructions.md README.md resources/agent-coordination.md resources/theory-branch-integration.md resources/integrity-materiality-control.md; do
  if ! rg -Fq 'qtu-administrative-logistical-safe-harbor.md' "$safe_harbor_file"; then
    printf 'QTU safe-harbor link missing: %s\n' "$safe_harbor_file" >&2
    exit 1
  fi
done

if ! rg -Fq 'not comprehensive, exhaustive, exclusive, or automatic precedents' resources/qtu-administrative-logistical-safe-harbor.md ||
   ! rg -Fq 'Artifact-related documentation remains in scope' resources/qtu-administrative-logistical-safe-harbor.md ||
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

if ! jq -e '.qtuExecutionGate.administrativeLogisticalSafeHarbor.decisionFactors | length == 10' resources/agent-resources.json >/dev/null; then
  printf 'QTU safe-harbor decision-factor count mismatch\n' >&2
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
