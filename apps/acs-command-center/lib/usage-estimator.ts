import { TASK_CALIBRATION, USAGE_CALIBRATION_AS_OF, type UsagePlatform, type UsageTaskClass } from "./usage-calibration.ts";

export type UsageScope = "small" | "medium" | "large";
export type ContextState = "fresh" | "established" | "long" | "saturated";
export type ReasoningLevel = "low" | "medium" | "high" | "xhigh";

export type TokenUsage = {
  inputTokens: number;
  cachedInputTokens?: number;
  outputTokens: number;
  cacheCreationInputTokens?: number;
  cacheReadInputTokens?: number;
};

export type TaskUsageEstimateInput = {
  platform: UsagePlatform;
  taskClass: UsageTaskClass;
  importanceRank: 1 | 2 | 3 | 4;
  scope: UsageScope;
  contextState: ContextState;
  reasoningLevel: ReasoningLevel;
  completionPasses: number;
  model?: string;
  recentUsage?: TokenUsage;
  explicitCostApproval?: boolean;
};

export type TaskUsageEstimate = {
  platform: UsagePlatform;
  taskClass: UsageTaskClass;
  unit: "credits" | "api-equivalent-usd";
  p50: number;
  p80: number;
  p95: number;
  costRank: 1 | 2 | 3 | 4;
  utilityScore: number;
  utilityCostRatio: number;
  status: "allow" | "approval-required" | "block";
  confidence: "low" | "medium" | "high";
  reasons: string[];
  reductions: string[];
  calibrationAsOf: string;
};

type Rate = { input: number; cached: number; output: number; cacheWrite?: number };

const CODEX_RATES: Record<string, Rate> = {
  "gpt-5.6-sol": { input: 125, cached: 12.5, output: 750 },
  "gpt-5.6-terra": { input: 62.5, cached: 6.25, output: 375 },
  "gpt-5.6-luna": { input: 25, cached: 2.5, output: 150 },
  "gpt-5.5": { input: 125, cached: 12.5, output: 750 },
  "gpt-5.4": { input: 62.5, cached: 6.25, output: 375 },
  "gpt-5.4-mini": { input: 18.75, cached: 1.875, output: 113 },
  "gpt-5.3-codex": { input: 43.75, cached: 4.375, output: 350 },
};

const CLAUDE_RATES: Record<string, Rate> = {
  "claude-sonnet-5": { input: 2, cached: 0.2, cacheWrite: 2.5, output: 10 },
  "claude-sonnet-4-6": { input: 3, cached: 0.3, cacheWrite: 3.75, output: 15 },
  "claude-sonnet-4-5": { input: 3, cached: 0.3, cacheWrite: 3.75, output: 15 },
  "claude-opus-4-8": { input: 5, cached: 0.5, cacheWrite: 6.25, output: 25 },
  "claude-opus-4-7": { input: 5, cached: 0.5, cacheWrite: 6.25, output: 25 },
  "claude-opus-4-6": { input: 5, cached: 0.5, cacheWrite: 6.25, output: 25 },
  "claude-opus-4-5": { input: 5, cached: 0.5, cacheWrite: 6.25, output: 25 },
  "claude-haiku-4-5": { input: 1, cached: 0.1, cacheWrite: 1.25, output: 5 },
};

const scopeFactor: Record<UsageScope, number> = { small: 0.75, medium: 1, large: 1.65 };
const contextFactor: Record<ContextState, number> = { fresh: 0.72, established: 1, long: 1.7, saturated: 2.7 };
const reasoningFactor: Record<ReasoningLevel, number> = { low: 0.75, medium: 1, high: 1.28, xhigh: 1.55 };

function round(value: number, platform: UsagePlatform) {
  return platform === "codex" ? Math.round(value * 10) / 10 : Math.round(value * 100) / 100;
}

export function tokenUsageCost(platform: UsagePlatform, usage: TokenUsage, model?: string) {
  const normalizedModel = model?.toLowerCase();
  const rates = platform === "codex" ? CODEX_RATES : CLAUDE_RATES;
  const fallback = platform === "codex" ? CODEX_RATES["gpt-5.6-sol"] : CLAUDE_RATES["claude-sonnet-5"];
  const rate = (normalizedModel && rates[normalizedModel]) || fallback;
  if (platform === "claude") {
    return (
      usage.inputTokens * rate.input +
      (usage.cacheCreationInputTokens ?? 0) * (rate.cacheWrite ?? rate.input) +
      (usage.cacheReadInputTokens ?? usage.cachedInputTokens ?? 0) * rate.cached +
      usage.outputTokens * rate.output
    ) / 1_000_000;
  }
  const cached = Math.min(usage.inputTokens, usage.cachedInputTokens ?? 0);
  return ((usage.inputTokens - cached) * rate.input + cached * rate.cached + usage.outputTokens * rate.output) / 1_000_000;
}

function classifyCost(platform: UsagePlatform, p80: number): 1 | 2 | 3 | 4 {
  const thresholds = platform === "codex" ? [20, 100, 400] : [0.25, 0.75, 2];
  if (p80 <= thresholds[0]) return 1;
  if (p80 <= thresholds[1]) return 2;
  if (p80 <= thresholds[2]) return 3;
  return 4;
}

export function estimateTaskUsage(input: TaskUsageEstimateInput): TaskUsageEstimate {
  const calibration = TASK_CALIBRATION[input.platform][input.taskClass];
  const passes = Math.max(1, Math.min(8, Math.round(input.completionPasses)));
  const multiplier = scopeFactor[input.scope] * contextFactor[input.contextState] * reasoningFactor[input.reasoningLevel] * Math.sqrt(passes);
  let p50 = calibration.p50 * multiplier;
  let p80 = calibration.p80 * multiplier;
  let p95 = calibration.p95 * multiplier;

  if (input.recentUsage) {
    const lastPass = tokenUsageCost(input.platform, input.recentUsage, input.model);
    p50 = Math.max(p50, lastPass * passes);
    p80 = Math.max(p80, lastPass * passes * 1.25);
    p95 = Math.max(p95, lastPass * passes * 1.6);
  }

  p50 = round(p50, input.platform);
  p80 = round(p80, input.platform);
  p95 = round(p95, input.platform);
  const costRank = classifyCost(input.platform, p80);
  const utilityScore = input.importanceRank * 25;
  const referenceCost = input.platform === "codex" ? 45 : 0.5;
  const utilityCostRatio = round(utilityScore / Math.max(0.25, p80 / referenceCost), input.platform);
  const reasons: string[] = [];
  const reductions: string[] = [];

  if (input.contextState === "long" || input.contextState === "saturated") {
    reasons.push("The existing context materially increases repeated input cost.");
    reductions.push("Start a focused task with a concise handoff instead of continuing the long thread.");
  }
  if (input.reasoningLevel === "high" || input.reasoningLevel === "xhigh") {
    reductions.push("Use medium reasoning unless a documented quality requirement needs the higher setting.");
  }
  if (input.scope === "large") reductions.push("Split the work into a bounded decision-producing first pass and defer the remainder.");
  if (passes > 1) reductions.push(`Cap execution at ${passes} completion passes and stop on the first verified terminal result.`);
  if (input.platform === "claude") reasons.push("Dollar values are API-equivalent overage exposure, not a fixed percentage of the Claude Pro allowance.");

  const ratioTooLow = utilityCostRatio < 20;
  const costExceedsImportance = costRank > input.importanceRank;
  let status: TaskUsageEstimate["status"] = "allow";
  if (ratioTooLow || costExceedsImportance) {
    status = "block";
    reasons.push("Expected usage is disproportionate to the stated production utility.");
  } else if ((costRank >= 3 || costRank === input.importanceRank || utilityCostRatio < 40) && !input.explicitCostApproval) {
    status = "approval-required";
    reasons.push("The task is potentially material usage and needs a bounded cost decision before execution.");
  } else {
    reasons.push("The bounded estimate is proportionate to the stated production utility.");
  }
  if (reductions.length === 0) reductions.push("Use the selected bounded scope and stop after verified completion.");

  return {
    platform: input.platform,
    taskClass: input.taskClass,
    unit: input.platform === "codex" ? "credits" : "api-equivalent-usd",
    p50,
    p80,
    p95,
    costRank,
    utilityScore,
    utilityCostRatio,
    status,
    confidence: calibration.confidence,
    reasons,
    reductions,
    calibrationAsOf: USAGE_CALIBRATION_AS_OF,
  };
}
