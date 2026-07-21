export const SIGNAL_ERROR_TRIPWIRE = 2;
export const SIGNAL_NO_OP_TRIPWIRE = 3;

export type SignalPolicyInput = {
  kind: "finding" | "connector-health" | "action-candidate" | "status-change" | "no-op";
  severity: "critical" | "high" | "normal" | "low";
  material: boolean;
  actionable: boolean;
  connectorOutcome?: "success" | "error" | "no-op";
};

export function evaluateSignalPolicy(input: SignalPolicyInput) {
  const synthesisNeeded = input.material && input.kind !== "no-op" && (input.severity === "critical" || input.severity === "high");
  return {
    createActionCandidate: input.actionable && input.kind !== "no-op",
    synthesisStatus: synthesisNeeded ? "needed" as const : "not-needed" as const,
    suppressModelRun: !synthesisNeeded,
  };
}

export function nextConnectorHealth(input: {
  currentErrors: number;
  currentNoOps: number;
  outcome: "success" | "error" | "no-op";
}) {
  const consecutiveErrors = input.outcome === "error" ? input.currentErrors + 1 : 0;
  const consecutiveNoOps = input.outcome === "no-op" ? input.currentNoOps + 1 : 0;
  const paused = consecutiveErrors >= SIGNAL_ERROR_TRIPWIRE || consecutiveNoOps >= SIGNAL_NO_OP_TRIPWIRE;
  return {
    consecutiveErrors,
    consecutiveNoOps,
    status: paused ? "paused" as const : input.outcome === "error" ? "degraded" as const : "healthy" as const,
    pausedReason: consecutiveErrors >= SIGNAL_ERROR_TRIPWIRE
      ? `Paused after ${SIGNAL_ERROR_TRIPWIRE} consecutive connector errors.`
      : consecutiveNoOps >= SIGNAL_NO_OP_TRIPWIRE
        ? `Paused after ${SIGNAL_NO_OP_TRIPWIRE} consecutive no-change events.`
        : null,
  };
}

export function ageInDays(occurredAt: string, now = new Date()) {
  const occurred = new Date(occurredAt);
  if (Number.isNaN(occurred.getTime())) return 0;
  return Math.max(0, Math.floor((now.getTime() - occurred.getTime()) / 86_400_000));
}
