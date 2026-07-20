import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { ingestUniversalItem } from "../../../db/command-center";

export const dynamic = "force-dynamic";

const intakeSchema = z.object({
  sourceId: z.string().min(8).max(300),
  projectId: z.string().min(1).max(100).default("general"),
  kind: z.enum(["screenshot", "screen-recording", "file", "url", "text", "media"]),
  source: z.string().min(1).max(100),
  title: z.string().min(1).max(500),
  originalFilename: z.string().max(500).optional(),
  contentType: z.string().max(200).optional(),
  sizeBytes: z.number().int().nonnegative().max(10_000_000_000).optional(),
  drivePath: z.string().max(2000).optional(),
  sourceUrl: z.string().url().max(4000).optional(),
  capturedText: z.string().max(20_000).optional(),
  device: z.string().min(1).max(200),
  sha256: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  occurredAt: z.string().datetime(),
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
  const left = new Uint8Array(expectedHash); const right = new Uint8Array(actualHash);
  return left.length === right.length && left.every((byte, index) => byte === right[index]);
}

export async function POST(request: Request) {
  try {
    if (!(await authorized(request))) return json({ error: "Unauthorized intake device" }, 401);
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 32_768) return json({ error: "Request is too large" }, 413);
    const input = intakeSchema.parse(await request.json());
    const result = await ingestUniversalItem(input);
    return json({ ok: true, ...result }, result.duplicate ? 200 : 201);
  } catch (error) {
    if (error instanceof z.ZodError) return json({ error: "Invalid intake item", issues: error.issues.map((issue) => issue.path.join(".")) }, 400);
    return json({ error: "Unable to record intake item" }, 400);
  }
}
