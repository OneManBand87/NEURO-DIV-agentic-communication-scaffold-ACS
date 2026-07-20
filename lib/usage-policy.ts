export type UsagePreflightInput = {
  importanceRank: 1 | 2 | 3 | 4;
  baseCostRank: 1 | 2 | 3 | 4;
  runsPerDay: number;
  createsTaskPerRun: boolean;
  frontierOrHighReasoning: boolean;
  maximumRuns?: number;
  expiresAt?: string;
  terminalCondition?: string;
  costBand?: "low" | "medium" | "high" | "extreme";
  errorTripwire?: number;
  noOpTripwire?: number;
  explicitCostApproval?: boolean;
};

export type UsageDecision = {
  adjustedCostRank: number;
  status: "allow" | "approval-required" | "block";
  reasons: string[];
};

export function evaluateUsagePreflight(input: UsagePreflightInput): UsageDecision {
  const reasons: string[] = [];
  let adjustedCostRank: number = input.baseCostRank;

  if (input.runsPerDay > 4) adjustedCostRank += 1;
  if (input.createsTaskPerRun) adjustedCostRank += 1;
  if (input.frontierOrHighReasoning) adjustedCostRank += 1;
  adjustedCostRank = Math.min(4, adjustedCostRank);

  const missingBounds =
    !input.maximumRuns ||
    !input.expiresAt ||
    !input.terminalCondition ||
    !input.costBand ||
    !input.errorTripwire ||
    !input.noOpTripwire;

  if (missingBounds) reasons.push("Missing a run, expiry, terminal, cost, or tripwire bound.");
  if (input.baseCostRank === 4 || input.costBand === "extreme") reasons.push("Cost is extreme or unbounded.");
  if (input.importanceRank < adjustedCostRank) reasons.push("Adjusted cost exceeds task importance.");
  if (input.runsPerDay > 4 && input.importanceRank < 4) reasons.push("More than four daily runs require critical importance.");
  if (input.frontierOrHighReasoning && input.runsPerDay > 1) reasons.push("Expensive reasoning is repeated more than once daily.");

  if (missingBounds || input.baseCostRank === 4 || input.costBand === "extreme" || input.importanceRank < adjustedCostRank) {
    return { adjustedCostRank, status: "block", reasons };
  }

  const needsApproval =
    input.importanceRank === adjustedCostRank ||
    adjustedCostRank >= 3 ||
    input.runsPerDay > 4 ||
    input.createsTaskPerRun;

  if (needsApproval && !input.explicitCostApproval) {
    reasons.push("The bounded design requires explicit usage approval.");
    return { adjustedCostRank, status: "approval-required", reasons };
  }

  reasons.push("The activity is bounded and proportionate under the current policy.");
  return { adjustedCostRank, status: "allow", reasons };
}
