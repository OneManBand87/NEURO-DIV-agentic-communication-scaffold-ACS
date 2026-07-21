import { env } from "cloudflare:workers";
import { getIntakeAttachment } from "../../../../db/command-center";

export const dynamic = "force-dynamic";

function contentDisposition(filename: string) {
  const fallback = filename.replace(/[^\x20-\x7e]/g, "_").replace(/["\\]/g, "_");
  return `attachment; filename="${fallback}"; filename*=UTF-8''${encodeURIComponent(filename)}`;
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite === "cross-site") return Response.json({ error: "Cross-site attachment access is not allowed" }, { status: 403 });
  if (!env.ATTACHMENTS) return Response.json({ error: "Attachment storage is unavailable" }, { status: 503 });
  const { id } = await context.params;
  if (!/^attachment-[a-f0-9-]{36}$/.test(id)) return Response.json({ error: "Attachment not found" }, { status: 404 });
  const metadata = await getIntakeAttachment(id);
  if (!metadata) return Response.json({ error: "Attachment not found" }, { status: 404 });
  const object = await env.ATTACHMENTS.get(metadata.object_key);
  if (!object) return Response.json({ error: "Attachment bytes are unavailable" }, { status: 404 });
  return new Response(object.body, {
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Content-Disposition": contentDisposition(metadata.original_filename),
      "Content-Length": String(metadata.size_bytes),
      "Content-Type": "application/octet-stream",
      "Content-Security-Policy": "sandbox",
      "X-Content-Type-Options": "nosniff",
      "X-Original-Content-Type": metadata.content_type,
    },
  });
}
