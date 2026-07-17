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
skills-lock.json'

missing=0
for file in $required_files; do
  if [ ! -f "$file" ]; then
    printf 'missing: %s\n' "$file" >&2
    missing=1
  fi
done

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
