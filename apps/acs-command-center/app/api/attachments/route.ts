import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { createBrowserIntake, loadCommandCenterState } from "../../../db/command-center";

export const dynamic = "force-dynamic";

const MAX_FILES = 5;
const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_TOTAL_BYTES = 40 * 1024 * 1024;
const MAX_REQUEST_BYTES = 42 * 1024 * 1024;
const MAX_TEXT_LENGTH = 5_000;

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

function safeFilename(value: string) {
  const normalized = value.normalize("NFKC").replace(/[\\/\u0000-\u001f\u007f]/g, "_").trim();
  return (normalized || "attachment").slice(0, 240);
}

async function sha256(bytes: ArrayBuffer) {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const uploadedKeys: string[] = [];
  try {
    if (!isSameOriginMutation(request)) return json({ error: "Cross-origin attachments are not allowed" }, 403);
    if (!env.ATTACHMENTS) return json({ error: "Attachment storage is unavailable" }, 503);
    const contentType = request.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
      return json({ error: "Attachment intake requires multipart form data" }, 415);
    }
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > MAX_REQUEST_BYTES) return json({ error: "Attachment request is too large" }, 413);

    const form = await request.formData();
    const text = String(form.get("text") ?? "").trim();
    if (text.length > MAX_TEXT_LENGTH) return json({ error: "Intake text is too long" }, 400);
    const files = form.getAll("attachments").filter((entry): entry is File => entry instanceof File && entry.size > 0);
    if (!text && files.length === 0) return json({ error: "Add a message or at least one attachment" }, 400);
    if (files.length > MAX_FILES) return json({ error: `Attach no more than ${MAX_FILES} files at once` }, 400);
    const totalBytes = files.reduce((total, file) => total + file.size, 0);
    if (totalBytes > MAX_TOTAL_BYTES) return json({ error: "Combined attachments exceed 40 MB" }, 413);
    const oversized = files.find((file) => file.size > MAX_FILE_BYTES);
    if (oversized) return json({ error: `${safeFilename(oversized.name)} exceeds 20 MB` }, 413);

    const attachmentMetadata = [];
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const hash = await sha256(bytes);
      const id = `attachment-${crypto.randomUUID()}`;
      const objectKey = `intake/${new Date().toISOString().slice(0, 10)}/${id}`;
      const originalFilename = safeFilename(file.name);
      const storedContentType = (file.type || "application/octet-stream").slice(0, 200);
      await env.ATTACHMENTS.put(objectKey, bytes, {
        httpMetadata: { contentType: "application/octet-stream" },
        customMetadata: { originalFilename, contentType: storedContentType, sha256: hash },
      });
      uploadedKeys.push(objectKey);
      attachmentMetadata.push({
        id,
        objectKey,
        originalFilename,
        contentType: storedContentType,
        sizeBytes: file.size,
        sha256: hash,
      });
    }

    await createBrowserIntake({
      text,
      uploadedBy: request.headers.get("oai-authenticated-user-email"),
      attachments: attachmentMetadata,
    });
    return json(await loadCommandCenterState(), 201);
  } catch {
    if (env.ATTACHMENTS) await Promise.all(uploadedKeys.map((key) => env.ATTACHMENTS.delete(key)));
    return json({ error: "Unable to save the intake attachment" }, 400);
  }
}
