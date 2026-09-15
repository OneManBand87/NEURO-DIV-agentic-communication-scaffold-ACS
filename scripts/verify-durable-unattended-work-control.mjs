#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const controlPath = path.join(root, "resources", "automation-cost-cadence-proportionality-control.md");
const text = fs.readFileSync(controlPath, "utf8");

const required = [
  "ND-AUTO-DUR-001",
  "Silence is never evidence of progress",
  "independent liveness signal",
  "missed-run or mechanism-death detection",
  "creation or configuration receipt proves only",
  "unverified best-effort aid",
  "Recreating the same ephemeral mechanism as a “safety net” does not close",
  "may not certify its own good faith, intent, root cause, or remediation effectiveness",
];

const missing = required.filter((marker) => !text.includes(marker));
if (missing.length) {
  console.error(JSON.stringify({ status: "FAIL", missing }, null, 2));
  process.exit(1);
}

const scenarios = [
  {
    name: "session-only primary promise",
    sessionScoped: true,
    independentLiveness: false,
    missedRunAlert: false,
    proposedRole: "primary",
    expected: "BLOCK",
  },
  {
    name: "durable external scheduler with watchdog",
    sessionScoped: false,
    independentLiveness: true,
    missedRunAlert: true,
    proposedRole: "primary",
    expected: "ALLOW",
  },
  {
    name: "session-only disclosed best-effort aid",
    sessionScoped: true,
    independentLiveness: false,
    missedRunAlert: false,
    proposedRole: "best_effort_aid",
    expected: "ALLOW_WITH_LIMITATION",
  },
];

function classify(s) {
  if (s.proposedRole === "primary" && (s.sessionScoped || !s.independentLiveness || !s.missedRunAlert)) return "BLOCK";
  if (s.proposedRole === "best_effort_aid" && s.sessionScoped) return "ALLOW_WITH_LIMITATION";
  return "ALLOW";
}

const results = scenarios.map((scenario) => ({ ...scenario, actual: classify(scenario) }));
const failures = results.filter((item) => item.actual !== item.expected);
console.log(JSON.stringify({ status: failures.length ? "FAIL" : "PASS", controlPath, sourceMarkers: `${required.length}/${required.length - missing.length}`, scenarios: results }, null, 2));
process.exit(failures.length ? 1 : 0);
