import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";

const moduleUrl = pathToFileURL(new URL("../lib/voice-intake-interpretation.ts", import.meta.url).pathname).href;
const { isVoiceIntakeInterpretation, semanticVoiceTitle } = await import(moduleUrl);

test("semantic title rejects a copied opening sentence", () => {
  const result = semanticVoiceTitle(
    "Okay so I was thinking about the recruiter response.",
    "Okay so I was thinking about the recruiter response. The actual issue is preserving the same-day deadline.",
    "123456",
  );
  assert.deepEqual(result, { title: "Review voice capture 123456", status: "fallback", reason: "copied-opening-sentence" });
});

test("semantic title accepts a concise whole-capture subject", () => {
  const result = semanticVoiceTitle(
    "Recruiter response deadline safeguards",
    "Okay, this is rambling. We need safeguards so recruiter responses still meet the same-day deadline.",
    "654321",
  );
  assert.equal(result.title, "Recruiter response deadline safeguards");
  assert.equal(result.status, "accepted");
});

test("semantic title enforces the configured four-to-ten-word limit", () => {
  assert.equal(
    semanticVoiceTitle("Three word title", "The capture concerns a different subject.", "111111").reason,
    "title-word-count",
  );
  assert.equal(
    semanticVoiceTitle("One two three four five six seven eight nine ten eleven", "The capture concerns a different subject.", "222222").reason,
    "title-word-count",
  );
});

test("interpretation requires preserved audio and human review", () => {
  const valid = {
    captureId: "654321",
    title: "Recruiter response deadline safeguards",
    summary: "Protect the same-day response deadline.",
    items: [{ type: "concern", text: "A long caption hides the actual issue." }],
    dates: [],
    people: [],
    proposedActions: [{ text: "Review a shorter title", reviewRequired: true }],
    confidence: "high",
    needsHumanReview: true,
    originalAudioPreserved: true,
    modelRoute: "on-device",
    transcript: "We need safeguards so recruiter responses still meet the same-day deadline.",
  };
  assert.equal(isVoiceIntakeInterpretation(valid), true);
  assert.equal(isVoiceIntakeInterpretation({ ...valid, needsHumanReview: false }), false);
  assert.equal(isVoiceIntakeInterpretation({ ...valid, originalAudioPreserved: false }), false);
});
