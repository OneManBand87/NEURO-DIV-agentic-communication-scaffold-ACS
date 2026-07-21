import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";

const moduleUrl = pathToFileURL(new URL("../lib/usage-estimator.ts", import.meta.url).pathname).href;
const { estimateTaskUsage, tokenUsageCost } = await import(moduleUrl);

test("reproduces the GPT-5.6 Sol token rate card", () => {
  const credits = tokenUsageCost("codex", { inputTokens: 2_000_000, cachedInputTokens: 1_000_000, outputTokens: 100_000 }, "gpt-5.6-sol");
  assert.equal(credits, 212.5);
});

test("reproduces Claude Sonnet 5 API-equivalent pricing", () => {
  const dollars = tokenUsageCost("claude", {
    inputTokens: 1_000_000,
    cacheCreationInputTokens: 1_000_000,
    cacheReadInputTokens: 1_000_000,
    outputTokens: 100_000,
  }, "claude-sonnet-5");
  assert.equal(dollars, 5.7);
});

test("blocks low-utility expensive work", () => {
  const estimate = estimateTaskUsage({
    platform: "codex",
    taskClass: "large-corpus-analysis",
    importanceRank: 1,
    scope: "large",
    contextState: "saturated",
    reasoningLevel: "high",
    completionPasses: 4,
  });
  assert.equal(estimate.status, "block");
  assert.equal(estimate.costRank, 4);
  assert.match(estimate.reasons.join(" "), /disproportionate/i);
});

test("allows a fresh bounded high-utility task", () => {
  const estimate = estimateTaskUsage({
    platform: "codex",
    taskClass: "bounded-documentation",
    importanceRank: 3,
    scope: "small",
    contextState: "fresh",
    reasoningLevel: "low",
    completionPasses: 1,
  });
  assert.equal(estimate.status, "allow");
  assert.equal(estimate.costRank, 1);
});

test("recent task usage creates a conservative estimate floor", () => {
  const estimate = estimateTaskUsage({
    platform: "codex",
    taskClass: "quick-response",
    importanceRank: 4,
    scope: "small",
    contextState: "fresh",
    reasoningLevel: "low",
    completionPasses: 2,
    model: "gpt-5.6-sol",
    recentUsage: { inputTokens: 1_000_000, cachedInputTokens: 900_000, outputTokens: 10_000 },
    explicitCostApproval: true,
  });
  assert.ok(estimate.p80 >= 78.1);
});

