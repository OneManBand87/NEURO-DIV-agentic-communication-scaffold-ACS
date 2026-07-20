# ACS Command Center

A mobile-first, ADHD-friendly operating interface for the NEURO-DIV Agentic
Communication Scaffold. It consolidates focus, approvals, recruiter response
timing, project status, external-agent status, and AI usage controls without
requiring the user to navigate separate project menus.

## Prerequisites

- Node.js `>=22.13.0`

## Local development

```bash
npm install
npm run dev
npm run mcp
npm run build
```

This starter does not use `wrangler.jsonc`.

The web interface runs at `http://localhost:3000`. The MCP server runs at
`http://127.0.0.1:8787/mcp` and uses the web API as its live state layer.

## Architecture

- `app/` contains the responsive dashboard and API routes.
- `db/` contains the durable D1 schema, runtime initialization, and state access.
- `lib/` contains typed seed state and the usage preflight policy.
- `mcp/` exposes standard `search` and `fetch` tools plus dashboard, capture,
  recruiter-ingestion, approval, and usage-preflight tools.
- `public/command-center-widget.html` is the MCP Apps/ChatGPT widget.

Google Drive remains the canonical artifact store. D1 is an operational index,
not a competing source of truth.

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Controls enforced in v0.1

- Three-item work-in-progress limit on the main focus surface.
- Unified approval queue with exact payload hashes.
- Recruiter response target at two hours, critical threshold at three hours,
  and a same-day hard deadline.
- Event-driven recruiter design with no recurring AI polling.
- Global background-AI pause and bounded usage preflight policy.
- Native/no-model reminder preference.

## Universal intake (v0.3)

`POST /api/intake` accepts bounded metadata from trusted device routers using
the `x-acs-device-token` header. It records screenshots, screen recordings,
files, URLs, selected text, and other media in one deduplicated D1 queue. Source
bytes remain in device-synced Apple intake storage; routed work products remain
canonical in the project’s Google Drive structure. The native routers are
event-driven and invoke no AI model.

## Quiet signal ledger

`POST /api/signals` accepts authenticated cross-source findings, connector results,
status changes, no-change events, and action candidates. Slack is not an accepted
source. Source IDs are deduplicated, aging is calculated at read time, and no-change
events do not create tasks or invoke a model. Only material high-severity signals
become eligible for bounded low-cost synthesis. Connector sources pause after two
consecutive errors or three consecutive no-change events.

## Useful commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build and verify the rendered Command Center contract
- `npm run db:generate`: generate Drizzle migrations after schema changes
- `npm run mcp`: run the local MCP Apps server

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
