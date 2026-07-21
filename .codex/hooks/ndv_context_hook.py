#!/usr/bin/env python3
import json
import os
import sys


PROJECT_ROOT = "/Users/dinamargelovich/Documents/General"
REQUIRED_FILES = [
    "resources/agent-coordination.md",
    "resources/agent-resources.json",
    "resources/theory-branch-integration.md",
    "resources/qtu-provisional-validation-hold.md",
    "resources/qtu-administrative-logistical-safe-harbor.md",
    "resources/integrity-materiality-control.md",
    "resources/maximal-progression-user-attention-control.md",
    "resources/automation-cost-cadence-proportionality-control.md",
]


def main() -> int:
    try:
        payload = json.load(sys.stdin)
    except Exception:
        payload = {}

    cwd = os.path.abspath(payload.get("cwd") or os.getcwd())
    event = payload.get("hook_event_name", "unknown")

    if cwd != PROJECT_ROOT and not cwd.startswith(PROJECT_ROOT + os.sep):
        return 0

    missing = [
        rel for rel in REQUIRED_FILES
        if not os.path.exists(os.path.join(PROJECT_ROOT, rel))
    ]

    if missing:
        message = (
            "NEURO-DIV context check: required local instruction files are missing: "
            + ", ".join(missing)
            + ". Do not make material completion or synchronization claims until resolved."
        )
    else:
        message = (
            "NEURO-DIV context check: before material claims or state-changing work, use the "
            "repository snapshot unless canonical Drive access has been directly verified; read "
            "agent coordination, resource manifest, QTU provisional validation hold, historical "
            "safe harbor, integrity control, "
            "maximal-progression control, and automation cost/cadence control. "
            "Hook event: "
            + event
            + "."
        )

    print(json.dumps({"systemMessage": message}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
