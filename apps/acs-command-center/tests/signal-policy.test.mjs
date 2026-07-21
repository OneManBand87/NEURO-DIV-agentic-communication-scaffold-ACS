import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";

const moduleUrl = pathToFileURL(new URL("../lib/signal-policy.ts", import.meta.url).pathname).href;
const { ageInDays, evaluateSignalPolicy, nextConnectorHealth } = await import(moduleUrl);

test("non-material and no-op signals suppress synthesis", () => {
  assert.equal(evaluateSignalPolicy({ kind: "no-op", severity: "high", material: true, actionable: true }).suppressModelRun, true);
  assert.equal(evaluateSignalPolicy({ kind: "finding", severity: "normal", material: false, actionable: false }).suppressModelRun, true);
});

test("only material high-severity signals enter synthesis queue", () => {
  const result = evaluateSignalPolicy({ kind: "finding", severity: "high", material: true, actionable: true });
  assert.equal(result.synthesisStatus, "needed");
  assert.equal(result.createActionCandidate, true);
});

test("connector pauses after two errors", () => {
  const first = nextConnectorHealth({ currentErrors: 0, currentNoOps: 0, outcome: "error" });
  const second = nextConnectorHealth({ currentErrors: first.consecutiveErrors, currentNoOps: first.consecutiveNoOps, outcome: "error" });
  assert.equal(first.status, "degraded");
  assert.equal(second.status, "paused");
});

test("connector pauses after three no-change events", () => {
  let state = { consecutiveErrors: 0, consecutiveNoOps: 0 };
  for (let index = 0; index < 3; index += 1) state = nextConnectorHealth({ currentErrors: state.consecutiveErrors, currentNoOps: state.consecutiveNoOps, outcome: "no-op" });
  assert.equal(state.status, "paused");
});

test("aging is calculated without polling", () => {
  assert.equal(ageInDays("2026-07-15T12:00:00Z", new Date("2026-07-20T12:00:00Z")), 5);
});
