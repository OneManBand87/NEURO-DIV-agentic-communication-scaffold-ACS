import { readFileSync } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";
import { initialCommandCenterState } from "../lib/seed-state";
import { evaluateUsagePreflight } from "../lib/usage-policy";
import type { CommandCenterState } from "../lib/types";

const here = dirname(fileURLToPath(import.meta.url));
const widgetHtml = readFileSync(resolve(here, "../public/command-center-widget.html"), "utf8");
const templateUri = "ui://acs-command-center/dashboard-v1.html";
const apiBase = process.env.COMMAND_CENTER_BASE_URL ?? "http://127.0.0.1:3000";

async function liveState(): Promise<CommandCenterState> {
  try {
    const response = await fetch(`${apiBase}/api/state`, { headers: { accept: "application/json" } });
    if (response.ok) return await response.json() as CommandCenterState;
  } catch {
    // A verified local snapshot keeps read-only tools available during local setup.
  }
  return initialCommandCenterState;
}

async function mutate(payload: Record<string, unknown>): Promise<CommandCenterState> {
  const response = await fetch(`${apiBase}/api/state`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json() as CommandCenterState & { error?: string };
  if (!response.ok) throw new Error(result.error ?? "Command Center update failed");
  return result;
}

function buildServer() {
  const server = new McpServer(
    { name: "acs-command-center", version: "0.1.0" },
    {
      instructions:
        "Use search and fetch for read-only discovery. Show the dashboard with render_command_center. Never create polling or recurring AI work without a bounded usage preflight. Resolve only an exact approval payload hash.",
    },
  );

  registerAppResource(server, "acs-command-center-widget", templateUri, {}, async () => ({
    contents: [{
      uri: templateUri,
      mimeType: RESOURCE_MIME_TYPE,
      text: widgetHtml,
      _meta: {
        ui: {
          prefersBorder: true,
          csp: { connectDomains: [], resourceDomains: [] },
        },
        "openai/widgetDescription": "A compact ACS dashboard showing current focus, approvals, recruiter SLA, and usage protection.",
      },
    }],
  }));

  server.registerTool(
    "search",
    {
      title: "Search ACS Command Center",
      description: "Use this when you need to find a project, work item, approval, communication, usage record, or agent status.",
      inputSchema: { query: z.string().min(1).max(300) },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    },
    async ({ query }) => {
      const state = await liveState();
      const normalized = query.toLowerCase();
      const records = [
        ...state.projects.map((item) => ({ id: `project:${item.id}`, title: item.title, text: `${item.summary} ${item.status} ${item.benchmark}` })),
        ...state.workItems.map((item) => ({ id: `work:${item.id}`, title: item.title, text: `${item.status} ${item.owner} ${item.priority}` })),
        ...state.approvals.map((item) => ({ id: `approval:${item.id}`, title: item.title, text: `${item.status} ${item.whyRequired}` })),
        ...state.communications.map((item) => ({ id: `communication:${item.id}`, title: `${item.sender}: ${item.subject}`, text: `${item.channel} ${item.summary} ${item.status}` })),
        ...state.agentStatuses.map((item) => ({ id: `agent:${item.id}`, title: item.agent, text: `${item.platform} ${item.task} ${item.status}` })),
      ];
      const results = records
        .filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(normalized))
        .slice(0, 20)
        .map((item) => ({ id: item.id, title: item.title, url: `acs-command-center://${item.id}` }));
      return { content: [{ type: "text", text: JSON.stringify({ results }) }] };
    },
  );

  server.registerTool(
    "fetch",
    {
      title: "Fetch ACS Command Center record",
      description: "Use this when you have an ACS record ID from search and need its complete current details.",
      inputSchema: { id: z.string().min(1).max(300) },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    },
    async ({ id }) => {
      const state = await liveState();
      const [kind, recordId] = id.split(":", 2);
      const collection = kind === "project" ? state.projects : kind === "work" ? state.workItems : kind === "approval" ? state.approvals : kind === "communication" ? state.communications : kind === "agent" ? state.agentStatuses : [];
      const record = collection.find((item) => item.id === recordId);
      if (!record) throw new Error(`Record ${id} was not found`);
      return {
        content: [{ type: "text", text: JSON.stringify({ id, title: "title" in record ? record.title : "agent" in record ? record.agent : id, text: JSON.stringify(record, null, 2), url: `acs-command-center://${id}`, metadata: { kind } }) }],
      };
    },
  );

  registerAppTool(
    server,
    "render_command_center",
    {
      title: "Show ACS Command Center",
      description: "Use this when the user wants the current focus, approval queue, recruiter SLA, agent status, or usage controls in one visual dashboard.",
      inputSchema: {},
      _meta: {
        ui: { resourceUri: templateUri },
        "openai/outputTemplate": templateUri,
        "openai/toolInvocation/invoking": "Loading the Command Center…",
        "openai/toolInvocation/invoked": "Command Center ready.",
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    },
    async () => {
      const state = await liveState();
      return { structuredContent: state, content: [{ type: "text", text: `ACS Command Center: ${state.workItems.filter((item) => item.attentionLane === "now").length} focus items, ${state.approvals.filter((item) => item.status === "pending").length} approvals, and ${state.communications.filter((item) => item.status === "response-needed").length} recruiter responses waiting.` }] };
    },
  );

  server.registerTool(
    "capture_item",
    {
      title: "Capture an idea or task",
      description: "Use this when the user speaks or types an idea, task, issue, reminder, or observation that should be preserved before routing.",
      inputSchema: { text: z.string().min(1).max(1000) },
      _meta: { ui: { visibility: ["model", "app"] } },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false, idempotentHint: false },
    },
    async ({ text }) => {
      const state = await mutate({ action: "capture", text });
      return { structuredContent: state, content: [{ type: "text", text: "Captured. Routing can proceed without losing the original wording." }] };
    },
  );

  server.registerTool(
    "resolve_approval",
    {
      title: "Resolve exact approval item",
      description: "Use this only when the user approves, declines, or defers the exact payload currently displayed in the unified approval queue.",
      inputSchema: {
        id: z.string().min(1),
        payloadHash: z.string().min(1),
        decision: z.enum(["approved", "declined", "deferred"]),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false, idempotentHint: true },
    },
    async ({ id, payloadHash, decision }) => {
      const state = await mutate({ action: "resolve-approval", id, payloadHash, decision });
      return { structuredContent: state, content: [{ type: "text", text: `Approval item ${decision}. The workflow owner retains responsibility for the next step.` }] };
    },
  );

  server.registerTool(
    "ingest_recruiter_message",
    {
      title: "Ingest recruiter message",
      description: "Use this when an event-triggered recruiter email or LinkedIn email notification needs SLA tracking and response preparation.",
      inputSchema: {
        sourceId: z.string().min(1).max(300), channel: z.enum(["email", "linkedin-email", "indeed-email", "manual-share"]),
        sender: z.string().min(1).max(300), subject: z.string().min(1).max(500), receivedAt: z.string().datetime(),
        summary: z.string().max(2000), draftResponse: z.string().max(5000).optional(),
      },
      annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false, idempotentHint: true },
    },
    async (message) => {
      const state = await mutate({ action: "ingest-recruiter-message", ...message });
      return { structuredContent: state, content: [{ type: "text", text: "Recruiter message recorded with a two-hour target, three-hour critical threshold, and same-day hard deadline." }] };
    },
  );

  server.registerTool(
    "preflight_usage",
    {
      title: "Evaluate AI usage preflight",
      description: "Use this before any recurring, polling, background, multi-agent, or otherwise potentially wasteful AI activity.",
      inputSchema: {
        importanceRank: z.number().int().min(1).max(4), baseCostRank: z.number().int().min(1).max(4),
        runsPerDay: z.number().int().min(0).max(10000), createsTaskPerRun: z.boolean(), frontierOrHighReasoning: z.boolean(),
        maximumRuns: z.number().int().positive().optional(), expiresAt: z.string().optional(), terminalCondition: z.string().optional(),
        costBand: z.enum(["low", "medium", "high", "extreme"]).optional(), errorTripwire: z.number().int().positive().optional(),
        noOpTripwire: z.number().int().positive().optional(), explicitCostApproval: z.boolean().optional(),
      },
      annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
    },
    async (input) => {
      const decision = evaluateUsagePreflight(input as Parameters<typeof evaluateUsagePreflight>[0]);
      return { content: [{ type: "text", text: JSON.stringify(decision) }], structuredContent: decision };
    },
  );

  return server;
}

const port = Number(process.env.MCP_PORT ?? 8787);
const httpServer = createServer(async (request, response) => {
  if (!request.url) return response.writeHead(400).end("Missing URL");
  const url = new URL(request.url, `http://${request.headers.host ?? "localhost"}`);
  if (request.method === "GET" && url.pathname === "/") {
    return response.writeHead(200, { "content-type": "application/json" }).end(JSON.stringify({ status: "ok", service: "acs-command-center-mcp" }));
  }
  if (url.pathname === "/mcp" && request.method && ["POST", "GET", "DELETE"].includes(request.method)) {
    const server = buildServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined, enableJsonResponse: true });
    response.on("close", () => { transport.close(); server.close(); });
    try {
      await server.connect(transport);
      await transport.handleRequest(request, response);
    } catch (error) {
      if (!response.headersSent) response.writeHead(500).end(error instanceof Error ? error.message : "MCP server error");
    }
    return;
  }
  response.writeHead(404).end("Not Found");
});

httpServer.listen(port, "127.0.0.1", () => {
  process.stdout.write(`ACS Command Center MCP listening on http://127.0.0.1:${port}/mcp\n`);
});
