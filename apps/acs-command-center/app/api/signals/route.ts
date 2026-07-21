import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ingestSignal } from "../../../db/command-center";

export const dynamic = "force-dynamic";

const signalSchema = z.object({
  sourceId: z.string().min(8).max(300),
  projectId: z.string().min(1).max(100).default("general"),
  source: z.enum(["claude", "codex", "gmail", "google-workspace", "google-drive", "supabase", "github", "notion", "zapier", "base44", "tapdat", "manual", "other"]),
  kind: z.enum(["finding", "connector-health", "action-candidate", "status-change", "no-op"]),
  title: z.string().min(1).max(500),
  summary: z.string().min(1).max(5000),
  severity: z.enum(["critical", "high", "normal", "low"]),
  verificationStatus: z.enum(["claude-sourced-unverified", "source-verified", "independently-verified", "unknown"]),
  material: z.boolean(),
  actionable: z.boolean().default(false),
  suggestedAction: z.string().max(2000).optional(),
  sourceUrl: z.string().url().max(4000).optional(),
  occurredAt: z.string().datetime(),
  dueAt: z.string().datetime().optional(),
  connectorOutcome: z.enum(["success", "error", "no-op"]).optional(),
  connectorError: z.string().max(2000).optional(),
}).strict();

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

async function authorized(request: Request) {
  const expected = env.INTAKE_DEVICE_TOKEN;
  const actual = request.headers.get("x-acs-device-token");
  if (!expected || !actual) return false;
  const [expectedHash, actualHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(expected)),
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(actual)),
  ]);
  const left = new Uint8Array(expectedHash);
  const right = new Uint8Array(actualHash);
  return left.length === right.length && left.every((byte, index) => byte === right[index]);
}

export async function POST(request: Request) {
  try {
    if (!(await authorized(request))) return json({ error: "Unauthorized signal source" }, 401);
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 32_768) return json({ error: "Request is too large" }, 413);
    const input = signalSchema.parse(await request.json());
    const result = await ingestSignal(input);
    return json({ ok: true, ...result }, result.duplicate ? 200 : 201);
  } catch (error) {
    if (error instanceof z.ZodError) return json({ error: "Invalid signal", issues: error.issues.map((issue) => issue.path.join(".")) }, 400);
    return json({ error: error instanceof Error ? error.message : "Unable to record signal" }, 400);
  }
}
