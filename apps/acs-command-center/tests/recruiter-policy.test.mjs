import assert from "node:assert/strict";
import test from "node:test";
import { recruiterDeadlines, recruiterPolicy, validateRecruiterDraft } from "../lib/recruiter-policy.ts";

test("recruiter deadlines use two-hour, three-hour, and Eastern same-day limits", () => {
  const result = recruiterDeadlines("2026-07-30T23:25:09.000Z");
  assert.equal(result.target.toISOString(), "2026-07-31T01:25:09.000Z");
  assert.equal(result.critical.toISOString(), "2026-07-31T02:25:09.000Z");
  assert.equal(result.hard.toISOString(), "2026-07-31T03:59:59.999Z");
});

test("canonical recruiter draft requires the best email", () => {
  assert.deepEqual(validateRecruiterDraft("Thank you.", "not-requested"), ["missing-best-email"]);
  assert.deepEqual(validateRecruiterDraft(`Best email: ${recruiterPolicy.bestEmail}`, "not-requested"), []);
});

test("weekend replies do not disclose availability times", () => {
  const draft = `I am available at 2 pm. Best email: ${recruiterPolicy.bestEmail}`;
  assert.deepEqual(validateRecruiterDraft(draft, "none-weekend"), ["weekend-availability-disclosed"]);
});
