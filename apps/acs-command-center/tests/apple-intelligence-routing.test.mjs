import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";

const moduleUrl = pathToFileURL(new URL("../lib/apple-intelligence-routing.ts", import.meta.url).pathname).href;
const { selectAppleIntelligenceRoute } = await import(moduleUrl);

test("routine CCS status remains deterministic", () => {
  assert.equal(selectAppleIntelligenceRoute({ taskType: "status-summary" }).route, "deterministic");
});

test("completed preserved voice capture uses the on-device model", () => {
  const decision = selectAppleIntelligenceRoute({ taskType: "voice-intake", explicitlyCompleted: true, originalSourcePreserved: true, sensitiveContent: true });
  assert.equal(decision.route, "apple-on-device");
  assert.equal(decision.mayExecuteAction, false);
});

test("unfinished or unpreserved voice capture is not interpreted", () => {
  assert.equal(selectAppleIntelligenceRoute({ taskType: "voice-intake", explicitlyCompleted: false, originalSourcePreserved: true }).route, "defer-for-review");
  assert.equal(selectAppleIntelligenceRoute({ taskType: "voice-intake", explicitlyCompleted: true, originalSourcePreserved: false }).route, "defer-for-review");
});

test("context, current information, low confidence, and consequential work returns to CCS", () => {
  assert.equal(selectAppleIntelligenceRoute({ taskType: "cross-record-analysis" }).route, "ccs-reasoning");
  assert.equal(selectAppleIntelligenceRoute({ taskType: "rewrite", currentExternalInformationRequired: true }).route, "ccs-reasoning");
  assert.equal(selectAppleIntelligenceRoute({ taskType: "rewrite", onDeviceConfidence: "low" }).route, "ccs-reasoning");
  assert.equal(selectAppleIntelligenceRoute({ taskType: "device-control", consequentialActionPossible: true }).route, "ccs-reasoning");
});

test("interpretive status is on-device only when explicitly requested", () => {
  assert.equal(selectAppleIntelligenceRoute({ taskType: "status-summary", interpretiveOutputRequested: true }).route, "apple-on-device");
});
