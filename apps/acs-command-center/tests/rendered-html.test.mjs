import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("build output and source contain the ACS Command Center", async () => {
  const [component, layout] = await Promise.all([
    readFile(new URL("../app/CommandCenter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(layout, /title:\s*"ACS Command Center"/i);
  assert.match(component, /ACS COMMAND CENTER/);
  assert.match(component, /Today, without the noise\./);
  assert.match(component, /ONE APPROVAL QUEUE/);
  assert.match(component, /RECRUITER SLA/);
  assert.match(component, /USAGE SENTINEL/);
  assert.match(component, /UNIVERSAL INTAKE/);
  assert.match(component, /QUIET SIGNAL LEDGER/);
  assert.match(component, /role="status"/);
  assert.doesNotMatch(component, /codex-preview/);
});

test("signal intake is authenticated, deduplicated, cost-bounded, and excludes Slack", async () => {
  const [route, database, policy] = await Promise.all([
    readFile(new URL("../app/api/signals/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/command-center.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/signal-policy.ts", import.meta.url), "utf8"),
  ]);
  assert.match(route, /x-acs-device-token/);
  assert.doesNotMatch(route, /z\.enum\(\[[^\]]*slack/i);
  assert.match(database, /Slack is excluded from NEURO-DIV workflows/);
  assert.match(database, /duplicate: true, actionCandidateCreated: false, modelRunSuppressed: true/);
  assert.match(policy, /SIGNAL_ERROR_TRIPWIRE = 2/);
  assert.match(policy, /SIGNAL_NO_OP_TRIPWIRE = 3/);
});

test("universal intake is device-authenticated, bounded, and deduplicated", async () => {
  const [route, database] = await Promise.all([
    readFile(new URL("../app/api/intake/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/command-center.ts", import.meta.url), "utf8"),
  ]);
  assert.match(route, /x-acs-device-token/);
  assert.match(route, /32_768/);
  assert.match(route, /Unauthorized intake device/);
  assert.match(database, /source_id TEXT NOT NULL UNIQUE/);
  assert.match(database, /duplicate: true/);
});

test("browser intake supports bounded private attachments backed by R2", async () => {
  const [component, uploadRoute, downloadRoute, database, hosting] = await Promise.all([
    readFile(new URL("../app/CommandCenter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/api/attachments/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/attachments/[id]/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/command-center.ts", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
  ]);
  assert.match(component, /type="file" multiple/);
  assert.match(component, /\+ Add attachment/);
  assert.match(component, /captureAttachments/);
  assert.match(uploadRoute, /MAX_FILES = 5/);
  assert.match(uploadRoute, /MAX_FILE_BYTES = 20 \* 1024 \* 1024/);
  assert.match(uploadRoute, /Cross-origin attachments are not allowed/);
  assert.match(uploadRoute, /ATTACHMENTS\.put/);
  assert.match(downloadRoute, /Content-Disposition/);
  assert.match(downloadRoute, /Content-Security-Policy/);
  assert.match(database, /CREATE TABLE IF NOT EXISTS intake_attachments/);
  assert.match(hosting, /"r2": "ATTACHMENTS"/);
});

test("keeps the product and safety controls explicit", async () => {
  const [component, css, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/CommandCenter.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(component, /WIP limit: 3/);
  assert.match(component, /Target 2h/);
  assert.match(component, /Pause all background AI/);
  assert.match(component, /payloadHash/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /prefers-contrast:\s*more/);
  assert.match(page, /<CommandCenter/);
  assert.match(layout, /title:\s*"ACS Command Center"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});

test("keeps state mutations bounded and widget rendering injection-safe", async () => {
  const route = await readFile(new URL("../app/api/state/route.ts", import.meta.url), "utf8");
  const widget = await readFile(new URL("../public/command-center-widget.html", import.meta.url), "utf8");

  assert.match(route, /z\.discriminatedUnion/);
  assert.match(route, /private, no-store/);
  assert.match(route, /Cross-origin state changes are not allowed/);
  assert.doesNotMatch(widget, /\.innerHTML\s*=/);
  assert.match(widget, /replaceChildren/);
  assert.match(widget, /event\.origin !== parentOrigin/);
});
