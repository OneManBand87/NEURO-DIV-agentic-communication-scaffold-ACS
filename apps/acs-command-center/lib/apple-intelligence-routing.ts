export type AppleIntelligenceRoute = "deterministic" | "apple-on-device" | "ccs-reasoning" | "defer-for-review";

export type AppleIntelligenceRoutingInput = {
  taskType: "voice-intake" | "status-summary" | "exact-record-operation" | "reminder" | "device-control" | "rewrite" | "cross-record-analysis";
  explicitlyCompleted?: boolean;
  originalSourcePreserved?: boolean;
  interpretiveOutputRequested?: boolean;
  crossRecordContextRequired?: boolean;
  currentExternalInformationRequired?: boolean;
  consequentialActionPossible?: boolean;
  sensitiveContent?: boolean;
  onDeviceOutputValid?: boolean;
  onDeviceConfidence?: "high" | "medium" | "low";
};

export type AppleIntelligenceRoutingDecision = {
  route: AppleIntelligenceRoute;
  reason: string;
  mayExecuteAction: false;
  ccsVisibilityRequired: boolean;
};

/** Apple Intelligence is a bounded clerical processor beneath CCS. */
export function selectAppleIntelligenceRoute(input: AppleIntelligenceRoutingInput): AppleIntelligenceRoutingDecision {
  const base = { mayExecuteAction: false as const, ccsVisibilityRequired: true };

  if (input.taskType === "voice-intake" && (!input.explicitlyCompleted || !input.originalSourcePreserved)) {
    return { ...base, route: "defer-for-review", reason: "voice-capture-not-finalized-or-source-not-preserved" };
  }
  if (input.consequentialActionPossible) {
    return { ...base, route: "ccs-reasoning", reason: "consequential-work-requires-ccs-controls" };
  }
  if (input.crossRecordContextRequired || input.currentExternalInformationRequired || input.taskType === "cross-record-analysis") {
    return { ...base, route: "ccs-reasoning", reason: "task-requires-context-or-tools-beyond-on-device-processing" };
  }
  if (input.onDeviceOutputValid === false || input.onDeviceConfidence === "low") {
    return { ...base, route: "ccs-reasoning", reason: "on-device-result-failed-validation-or-confidence" };
  }
  if (input.taskType === "voice-intake") {
    return { ...base, route: "apple-on-device", reason: "completed-voice-capture-needs-private-semantic-structuring" };
  }
  if (input.taskType === "rewrite" || (input.taskType === "status-summary" && input.interpretiveOutputRequested)) {
    return { ...base, route: "apple-on-device", reason: "user-requested-bounded-interpretive-transformation" };
  }
  return { ...base, route: "deterministic", reason: "task-can-be-constructed-from-current-records-without-a-model" };
}
