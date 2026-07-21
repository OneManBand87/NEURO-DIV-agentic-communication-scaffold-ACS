export type UsagePlatform = "codex" | "claude";
export type UsageTaskClass =
  | "quick-response"
  | "bounded-documentation"
  | "connector-administration"
  | "architecture-review"
  | "code-implementation"
  | "large-corpus-analysis"
  | "control-remediation";

export type EstimateBand = { p50: number; p80: number; p95: number; sampleSize: number; confidence: "low" | "medium" | "high" };

export const USAGE_CALIBRATION_AS_OF = "2026-07-21";

// Codex values are credits under the current token-based rate card. Claude values
// are API-equivalent USD, which is the actual exposure if paid extra usage begins.
// Bands are intentionally conservative and are calibrated from local task records;
// they are not provider guarantees.
export const TASK_CALIBRATION: Record<UsagePlatform, Record<UsageTaskClass, EstimateBand>> = {
  codex: {
    "quick-response": { p50: 5, p80: 12, p95: 25, sampleSize: 12, confidence: "high" },
    "bounded-documentation": { p50: 18, p80: 40, p95: 85, sampleSize: 9, confidence: "medium" },
    "connector-administration": { p50: 32, p80: 95, p95: 180, sampleSize: 11, confidence: "medium" },
    "architecture-review": { p50: 88, p80: 260, p95: 440, sampleSize: 8, confidence: "medium" },
    "code-implementation": { p50: 290, p80: 530, p95: 1280, sampleSize: 9, confidence: "medium" },
    "large-corpus-analysis": { p50: 160, p80: 545, p95: 1300, sampleSize: 10, confidence: "medium" },
    "control-remediation": { p50: 135, p80: 650, p95: 1300, sampleSize: 3, confidence: "low" },
  },
  claude: {
    "quick-response": { p50: 0.08, p80: 0.18, p95: 0.3, sampleSize: 2, confidence: "low" },
    "bounded-documentation": { p50: 0.2, p80: 0.45, p95: 0.8, sampleSize: 2, confidence: "low" },
    "connector-administration": { p50: 0.25, p80: 0.55, p95: 0.9, sampleSize: 2, confidence: "low" },
    "architecture-review": { p50: 0.48, p80: 0.9, p95: 1.85, sampleSize: 3, confidence: "low" },
    "code-implementation": { p50: 0.75, p80: 1.4, p95: 2.25, sampleSize: 3, confidence: "low" },
    "large-corpus-analysis": { p50: 1.1, p80: 2.25, p95: 4, sampleSize: 1, confidence: "low" },
    "control-remediation": { p50: 0.5, p80: 1.2, p95: 2.25, sampleSize: 1, confidence: "low" },
  },
};

export const TASK_CLASS_LABELS: Record<UsageTaskClass, string> = {
  "quick-response": "Quick answer or status check",
  "bounded-documentation": "Bounded documentation change",
  "connector-administration": "Connector or administrative action",
  "architecture-review": "Architecture or design review",
  "code-implementation": "Code implementation and verification",
  "large-corpus-analysis": "Large-corpus or historical analysis",
  "control-remediation": "Control-deficiency analysis or remediation",
};

