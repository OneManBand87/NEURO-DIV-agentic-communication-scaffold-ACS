import { NextResponse } from "next/server";
import { z } from "zod";
import { TASK_CLASS_LABELS, USAGE_CALIBRATION_AS_OF } from "../../../../lib/usage-calibration";
import { estimateTaskUsage } from "../../../../lib/usage-estimator";

export const dynamic = "force-dynamic";

const schema = z.object({
  platform: z.enum(["codex", "claude"]),
  taskClass: z.enum(["quick-response", "bounded-documentation", "connector-administration", "architecture-review", "code-implementation", "large-corpus-analysis", "control-remediation"]),
  importanceRank: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  scope: z.enum(["small", "medium", "large"]),
  contextState: z.enum(["fresh", "established", "long", "saturated"]),
  reasoningLevel: z.enum(["low", "medium", "high", "xhigh"]),
  completionPasses: z.number().int().min(1).max(8),
  model: z.string().trim().min(1).max(100).optional(),
  explicitCostApproval: z.boolean().optional(),
}).strict();

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store, max-age=0", "X-Content-Type-Options": "nosniff" } });
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;
  return !origin || origin === new URL(request.url).origin;
}

export async function GET() {
  return json({ taskClasses: TASK_CLASS_LABELS, calibrationAsOf: USAGE_CALIBRATION_AS_OF });
}

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) return json({ error: "Cross-origin usage estimates are not allowed" }, 403);
    if (Number(request.headers.get("content-length") ?? "0") > 8_192) return json({ error: "Request is too large" }, 413);
    return json(estimateTaskUsage(schema.parse(await request.json())));
  } catch (error) {
    if (error instanceof z.ZodError) return json({ error: "Invalid estimate request", issues: error.issues.map((issue) => issue.path.join(".")) }, 400);
    return json({ error: "Unable to estimate usage" }, 400);
  }
}

