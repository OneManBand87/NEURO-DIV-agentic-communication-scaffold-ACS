import { NextResponse } from "next/server";
import { z } from "zod";
import {
  captureWorkItem,
  ingestRecruiterMessage,
  loadCommandCenterState,
  resolveApproval,
  setBackgroundPause,
} from "../../../db/command-center";

export const dynamic = "force-dynamic";

const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("set-background-pause"), paused: z.boolean() }).strict(),
  z.object({ action: z.literal("capture"), text: z.string().trim().min(1).max(1000) }).strict(),
  z.object({
    action: z.literal("resolve-approval"),
    id: z.string().min(1).max(200),
    payloadHash: z.string().regex(/^[a-f0-9]{64}$/),
    decision: z.enum(["approved", "declined", "deferred"]),
  }).strict(),
  z.object({
    action: z.literal("ingest-recruiter-message"),
    sourceId: z.string().min(1).max(300),
    channel: z.enum(["email", "linkedin-email", "indeed-email", "manual-share"]),
    sender: z.string().min(1).max(300),
    subject: z.string().min(1).max(500),
    receivedAt: z.string().datetime(),
    summary: z.string().max(2000),
    draftResponse: z.string().max(5000).optional(),
  }).strict(),
]);

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function isSameOriginMutation(request: Request) {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return false;
  return !origin || origin === new URL(request.url).origin;
}

export async function GET() {
  try {
    return json(await loadCommandCenterState());
  } catch {
    return json({ error: "Unable to load Command Center state" }, 503);
  }
}

export async function POST(request: Request) {
  try {
    if (!isSameOriginMutation(request)) return json({ error: "Cross-origin state changes are not allowed" }, 403);
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 16_384) return json({ error: "Request is too large" }, 413);
    const body = actionSchema.parse(await request.json());
    switch (body.action) {
      case "set-background-pause":
        await setBackgroundPause(body.paused);
        break;
      case "capture": {
        await captureWorkItem(body.text);
        break;
      }
      case "resolve-approval":
        await resolveApproval(body.id, body.payloadHash, body.decision);
        break;
      case "ingest-recruiter-message":
        await ingestRecruiterMessage({
          sourceId: body.sourceId,
          channel: body.channel,
          sender: body.sender,
          subject: body.subject,
          receivedAt: body.receivedAt,
          summary: body.summary,
          draftResponse: body.draftResponse,
        });
        break;
    }
    return json(await loadCommandCenterState());
  } catch (error) {
    if (error instanceof z.ZodError) return json({ error: "Invalid request", issues: error.issues.map((issue) => issue.path.join(".")) }, 400);
    return json({ error: "Unable to update Command Center state" }, 400);
  }
}
