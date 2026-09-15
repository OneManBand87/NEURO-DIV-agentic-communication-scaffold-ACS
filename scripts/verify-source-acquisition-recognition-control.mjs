import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const [control, agents, coordination, resources] = await Promise.all([
  fs.readFile(path.join(root, "resources", "source-acquisition-completion-recognition-control.md"), "utf8"),
  fs.readFile(path.join(root, "AGENTS.md"), "utf8"),
  fs.readFile(path.join(root, "resources", "agent-coordination.md"), "utf8"),
  fs.readFile(path.join(root, "resources", "agent-resources.json"), "utf8").then(JSON.parse),
]);

const markers = [
  "ND-INGEST-RECOG-001",
  "actual configured destination",
  "relevant time window",
  "MIME/type",
  "WhereFroms",
  "content hash",
  "unexpected filename",
  "one bounded, authorized alternate route",
];

for (const marker of markers) assert.match(control, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
assert.match(agents, /source-acquisition-completion-recognition-control\.md/);
assert.match(coordination, /ND-INGEST-RECOG-001/);
assert.equal(resources.sourceAcquisitionRecognitionControl?.status, "mandatory");
assert.equal(resources.sourceAcquisitionRecognitionControl?.repositoryControl, "resources/source-acquisition-completion-recognition-control.md");

function decide({ matchingCandidate, gateComplete, negativeEvidenceRecorded }) {
  if (matchingCandidate) return "PROCEED_INTAKE";
  if (!gateComplete) return "BLOCK_ALTERNATE_ROUTE";
  if (negativeEvidenceRecorded) return "ALLOW_ONE_BOUNDED_ALTERNATE";
  return "BLOCK_ALTERNATE_ROUTE";
}

const scenarios = [
  [{ matchingCandidate: true, gateComplete: true, negativeEvidenceRecorded: false }, "PROCEED_INTAKE"],
  [{ matchingCandidate: false, gateComplete: false, negativeEvidenceRecorded: false }, "BLOCK_ALTERNATE_ROUTE"],
  [{ matchingCandidate: false, gateComplete: true, negativeEvidenceRecorded: true }, "ALLOW_ONE_BOUNDED_ALTERNATE"],
];

for (const [input, expected] of scenarios) assert.equal(decide(input), expected);
console.log(`ND-INGEST-RECOG-001 source markers: ${markers.length}/${markers.length} PASS`);
console.log(`ND-INGEST-RECOG-001 scenarios: ${scenarios.length}/${scenarios.length} PASS`);
