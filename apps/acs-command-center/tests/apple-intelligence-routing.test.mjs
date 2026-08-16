import assert from "node:assert/strict";
import test from "node:test";
const moduleUrl = new URL("../lib/apple-intelligence-routing.ts", import.meta.url).href;
const { selectAppleIntelligenceRoute } = await import(moduleUrl);

test("routine COC status remains deterministic", () => {
  assert.equal(selectAppleIntelligenceRoute({ taskType: "status-summary" }).route, "deterministic");
});

test("completed preserved voice capture uses the on-device model", () => {
  const decision = selectAppleIntelligenceRoute({ taskType: "voice-intake", explicitlyCompleted: true, originalSourcePreserved: true, sensitiveContent: true });
  assert.equal(decision.route, "apple-on-device");
  assert.equal(decision.mayExecuteAction, false);
  assert.equal(decision.cocVisibilityRequired, true);
});

test("unfinished or unpreserved voice capture is not interpreted", () => {
  assert.equal(selectAppleIntelligenceRoute({ taskType: "voice-intake", explicitlyCompleted: false, originalSourcePreserved: true }).route, "defer-for-review");
  assert.equal(selectAppleIntelligenceRoute({ taskType: "voice-intake", explicitlyCompleted: true, originalSourcePreserved: false }).route, "defer-for-review");
});

test("context, current information, low confidence, and consequential work returns to COC", () => {
  assert.equal(selectAppleIntelligenceRoute({ taskType: "cross-record-analysis" }).route, "coc-reasoning");
  assert.equal(selectAppleIntelligenceRoute({ taskType: "rewrite", currentExternalInformationRequired: true }).route, "coc-reasoning");
  assert.equal(selectAppleIntelligenceRoute({ taskType: "rewrite", onDeviceConfidence: "low" }).route, "coc-reasoning");
  assert.equal(selectAppleIntelligenceRoute({ taskType: "device-control", consequentialActionPossible: true }).route, "coc-reasoning");
});

test("interpretive status is on-device only when explicitly requested", () => {
  assert.equal(selectAppleIntelligenceRoute({ taskType: "status-summary", interpretiveOutputRequested: true }).route, "apple-on-device");
});
