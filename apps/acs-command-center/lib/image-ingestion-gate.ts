import { z } from "zod";

export const IMAGE_INGESTION_CONTROL_ID = "NEURO-DIV-IMAGE-INGESTION-2026-08-15";

const visualKinds = new Set(["screenshot", "screen-recording"]);
const visualMimePattern = /^(image|video)\//i;
const visualFilenamePattern = /\.(avif|bmp|gif|heic|heif|jpeg|jpg|mov|mp4|m4v|png|svg|tif|tiff|webm|webp)$/i;

export const imageIngestionEvidenceSchema = z.object({
  controlId: z.literal(IMAGE_INGESTION_CONTROL_ID),
  sourceAvailable: z.literal(true),
  originalPreserved: z.literal(true),
  normalizationStatus: z.enum(["pending", "complete"]),
  validationStatus: z.enum(["pending", "passed", "blocked"]),
  reasoningBlockedUntilValidated: z.literal(true),
  evidenceRef: z.string().min(1).max(500),
  failureReason: z.string().min(1).max(500).optional(),
}).strict().superRefine((value, context) => {
  if (value.validationStatus === "passed" && value.normalizationStatus !== "complete") {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["normalizationStatus"], message: "Validated visual input must have a complete normalized record" });
  }
  if (value.validationStatus === "blocked" && !value.failureReason) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["failureReason"], message: "Blocked visual input must preserve a bounded failure reason" });
  }
  if (value.validationStatus !== "blocked" && value.failureReason) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["failureReason"], message: "A failure reason is only valid for blocked visual input" });
  }
});

export type ImageIngestionEvidence = z.infer<typeof imageIngestionEvidenceSchema>;

export class ImageIngestionGateError extends Error {
  readonly code = "IMAGE_INGESTION_GATE_REQUIRED";

  constructor(message: string) {
    super(message);
    this.name = "ImageIngestionGateError";
  }
}

export function isVisualInput(input: { kind?: string; contentType?: string; originalFilename?: string }) {
  return visualKinds.has(input.kind ?? "")
    || visualMimePattern.test(input.contentType ?? "")
    || visualFilenamePattern.test(input.originalFilename ?? "");
}

export function buildPendingImageIngestionEvidence(evidenceRef: string): ImageIngestionEvidence {
  return imageIngestionEvidenceSchema.parse({
    controlId: IMAGE_INGESTION_CONTROL_ID,
    sourceAvailable: true,
    originalPreserved: true,
    normalizationStatus: "pending",
    validationStatus: "pending",
    reasoningBlockedUntilValidated: true,
    evidenceRef,
  });
}

export function parseStoredImageIngestionEvidence(value: unknown): ImageIngestionEvidence | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  try {
    const parsed = JSON.parse(value) as unknown;
    const result = imageIngestionEvidenceSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function requireImageIngestionGate(input: {
  kind?: string;
  contentType?: string;
  originalFilename?: string;
  sourceId: string;
  imageIngestion?: unknown;
}) {
  if (!isVisualInput(input)) {
    return { required: false as const, disposition: "not-applicable" as const, evidence: null };
  }

  const evidence = imageIngestionEvidenceSchema.safeParse(input.imageIngestion);
  if (!evidence.success) {
    throw new ImageIngestionGateError("Visual intake requires image-ingestion control evidence before it can enter CCS");
  }
  if (evidence.data.evidenceRef !== input.sourceId) {
    throw new ImageIngestionGateError("Image-ingestion evidence must reference the preserved source record");
  }

  return {
    required: true as const,
    disposition: evidence.data.validationStatus === "passed" ? "validated" as const : "held" as const,
    evidence: evidence.data,
  };
}
