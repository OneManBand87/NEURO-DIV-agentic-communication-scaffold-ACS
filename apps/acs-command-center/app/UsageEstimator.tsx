"use client";

import { useState } from "react";
import type { TaskUsageEstimate } from "../lib/usage-estimator";

const taskClasses = [
  ["quick-response", "Quick answer or status check"],
  ["bounded-documentation", "Bounded documentation change"],
  ["connector-administration", "Connector or administrative action"],
  ["architecture-review", "Architecture or design review"],
  ["code-implementation", "Code implementation and verification"],
  ["large-corpus-analysis", "Large-corpus or historical analysis"],
  ["control-remediation", "Control-deficiency analysis or remediation"],
] as const;

export function UsageEstimator() {
  const [platform, setPlatform] = useState<"codex" | "claude">("codex");
  const [taskClass, setTaskClass] = useState<(typeof taskClasses)[number][0]>("bounded-documentation");
  const [importanceRank, setImportanceRank] = useState(2);
  const [scope, setScope] = useState("medium");
  const [contextState, setContextState] = useState("fresh");
  const [reasoningLevel, setReasoningLevel] = useState("medium");
  const [completionPasses, setCompletionPasses] = useState(1);
  const [estimate, setEstimate] = useState<TaskUsageEstimate | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function runEstimate() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/usage/estimate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ platform, taskClass, importanceRank, scope, contextState, reasoningLevel, completionPasses }),
      });
      const body = await response.json() as TaskUsageEstimate & { error?: string };
      if (!response.ok) throw new Error(body.error ?? "Estimate failed");
      setEstimate(body);
    } catch (caught) {
      setEstimate(null);
      setError(caught instanceof Error ? caught.message : "Estimate failed");
    } finally {
      setBusy(false);
    }
  }

  const unit = estimate?.unit === "credits" ? "credits" : "API-equivalent USD";

  return <div className="usage-estimator">
    <div className="usage-estimator-heading"><div><strong>Pre-execution estimate</strong><span>Deterministic · no AI call</span></div><p>Estimate the full bounded task before dispatch. A fresh focused task is the default.</p></div>
    <div className="usage-estimator-form">
      <label><span>Platform</span><select value={platform} onChange={(event) => setPlatform(event.target.value as "codex" | "claude")}><option value="codex">Codex / OpenAI</option><option value="claude">Claude</option></select></label>
      <label><span>Work type</span><select value={taskClass} onChange={(event) => setTaskClass(event.target.value as typeof taskClass)}>{taskClasses.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
      <label><span>Production importance</span><select value={importanceRank} onChange={(event) => setImportanceRank(Number(event.target.value))}><option value={1}>1 · Low</option><option value={2}>2 · Normal</option><option value={3}>3 · High</option><option value={4}>4 · Critical</option></select></label>
      <label><span>Scope</span><select value={scope} onChange={(event) => setScope(event.target.value)}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label>
      <label><span>Thread context</span><select value={contextState} onChange={(event) => setContextState(event.target.value)}><option value="fresh">Fresh focused task</option><option value="established">Established</option><option value="long">Long</option><option value="saturated">Saturated / near compaction</option></select></label>
      <label><span>Reasoning</span><select value={reasoningLevel} onChange={(event) => setReasoningLevel(event.target.value)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="xhigh">Extra high</option></select></label>
      <label><span>Maximum completion passes</span><input type="number" min="1" max="8" value={completionPasses} onChange={(event) => setCompletionPasses(Math.max(1, Math.min(8, Number(event.target.value) || 1)))} /></label>
      <button type="button" onClick={runEstimate} disabled={busy}>{busy ? "Estimating…" : "Estimate before execution"}</button>
    </div>
    {error ? <p className="usage-estimator-error" role="alert">{error}</p> : null}
    {estimate ? <div className={`usage-estimate-result ${estimate.status}`} aria-live="polite">
      <div className="usage-estimate-decision"><span>{estimate.status.replace("-", " ")}</span><strong>{estimate.p50} / {estimate.p80} / {estimate.p95} {unit}</strong><small>Likely / conservative / stress case · {estimate.confidence} calibration confidence</small></div>
      <div><span>Utility-to-usage ratio</span><strong>{estimate.utilityCostRatio}</strong><small>Utility score {estimate.utilityScore}/100 · cost rank {estimate.costRank}/4</small></div>
      <ul>{estimate.reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
      <ul>{estimate.reductions.map((reduction) => <li key={reduction}>{reduction}</li>)}</ul>
    </div> : null}
    <small className="usage-estimator-note">Claude values measure possible paid overage at API rates; plan-limit percentage remains provider-controlled and must be checked in Claude Settings → Usage. Estimates do not include the minimal cost of reading the original request.</small>
  </div>;
}

