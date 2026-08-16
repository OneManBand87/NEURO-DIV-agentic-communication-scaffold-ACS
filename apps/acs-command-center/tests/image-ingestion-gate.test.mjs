import assert from "node:assert/strict";
import test from "node:test";
import {
  IMAGE_INGESTION_CONTROL_ID,
  ImageIngestionGateError,
  buildPendingImageIngestionEvidence,
  requireImageIngestionGate,
} from "../lib/image-ingestion-gate.ts";

const sourceId = "sha256:1234567890abcdef";

test("visual intake fails closed when evidence is missing or points at another source", () => {
  assert.throws(
    () => requireImageIngestionGate({ kind: "screenshot", sourceId }),
    (error) => error instanceof ImageIngestionGateError && error.code === "IMAGE_INGESTION_GATE_REQUIRED",
  );
  const pending = buildPendingImageIngestionEvidence(sourceId);
  assert.throws(
    () => requireImageIngestionGate({ kind: "screenshot", sourceId, imageIngestion: { ...pending, evidenceRef: "sha256:other" } }),
    /reference the preserved source record/,
  );
});

test("non-visual intake remains available without the visual control envelope", () => {
  assert.deepEqual(
    requireImageIngestionGate({ kind: "text", contentType: "text/plain", sourceId }),
    { required: false, disposition: "not-applicable", evidence: null },
  );
});

test("pending visual evidence is held and validated evidence requires complete normalization", () => {
  const pending = buildPendingImageIngestionEvidence(sourceId);
  assert.equal(requireImageIngestionGate({ kind: "media", contentType: "image/png", sourceId, imageIngestion: pending }).disposition, "held");
  assert.throws(
    () => requireImageIngestionGate({
      kind: "image",
      contentType: "image/png",
      sourceId,
      imageIngestion: { ...pending, validationStatus: "passed" },
    }),
    /requires image-ingestion control evidence/,
  );
  const validated = { ...pending, normalizationStatus: "complete", validationStatus: "passed" };
  assert.equal(requireImageIngestionGate({ kind: "image", contentType: "image/png", sourceId, imageIngestion: validated }).disposition, "validated");
  assert.equal(validated.controlId, IMAGE_INGESTION_CONTROL_ID);
});
