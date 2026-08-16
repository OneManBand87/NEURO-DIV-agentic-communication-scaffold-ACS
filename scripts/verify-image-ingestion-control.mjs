import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const readText = (path) => readFile(new URL(path, root), "utf8");
const [control, manifestText, gate, stateSchema, database, intakeRoute, attachmentRoute, nativeRouter, widget] = await Promise.all([
  readText("resources/image-ingestion-control.md"),
  readText("resources/agent-resources.json"),
  readText("apps/acs-command-center/lib/image-ingestion-gate.ts"),
  readText("apps/acs-command-center/lib/command-center-state-schema.ts"),
  readText("apps/acs-command-center/db/command-center.ts"),
  readText("apps/acs-command-center/app/api/intake/route.ts"),
  readText("apps/acs-command-center/app/api/attachments/route.ts"),
  readText("apps/acs-command-center/native/macos/acs-universal-intake.zsh"),
  readText("apps/acs-command-center/public/command-center-widget.html"),
]);
const manifest = JSON.parse(manifestText);
const runtimeGate = manifest.imageIngestionControl?.runtimeGate;
assert.equal(runtimeGate?.status, "installed");
assert.equal(runtimeGate?.controlId, "NEURO-DIV-IMAGE-INGESTION-2026-08-15");
assert.equal(runtimeGate?.evidenceField, "intake_items.image_ingestion_evidence");
for (const consumer of [
  "apps/acs-command-center/app/api/intake/route.ts",
  "apps/acs-command-center/db/command-center.ts",
  "apps/acs-command-center/app/api/attachments/route.ts",
  "apps/acs-command-center/native/macos/acs-universal-intake.zsh",
]) assert.ok(runtimeGate.consumers.includes(consumer), `missing runtime consumer: ${consumer}`);
assert.match(control, /## Runtime enforcement boundary/);
assert.match(control, /evidence-backed verification/);
assert.match(gate, /requireImageIngestionGate/);
assert.match(gate, /IMAGE_INGESTION_CONTROL_ID/);
assert.match(stateSchema, /commandCenterStateSchema/);
assert.match(database, /requireImageIngestionGate/);
assert.match(database, /image_ingestion_evidence/);
assert.match(intakeRoute, /imageIngestionEvidenceSchema/);
assert.match(attachmentRoute, /createBrowserIntake/);
assert.match(nativeRouter, /imageIngestion/);
assert.match(widget, /isCommandCenterState/);
assert.doesNotMatch(widget, /\bfetch\s*\(/);
assert.doesNotMatch(widget, /setInterval|setTimeout/);
console.log("image ingestion runtime gate verified");
