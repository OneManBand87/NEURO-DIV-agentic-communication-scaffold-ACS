import { z } from "zod";
import type { CommandCenterState } from "./types";
import { imageIngestionEvidenceSchema } from "./image-ingestion-gate";

const nullableString = z.string().nullable();
const dateString = z.string().datetime({ offset: true });

const projectSchema = z.object({
  id: z.string(), title: z.string(), parentId: nullableString, status: z.string(), summary: z.string(),
  userPlan: z.string(), codexPlan: z.string(), timelineStatus: z.string(), benchmark: z.string(), sortOrder: z.number().int(),
}).strict();

const workItemSchema = z.object({
  id: z.string(), projectId: z.string(), title: z.string(), owner: z.string(), status: z.string(),
  priority: z.enum(["critical", "high", "normal", "low"]), attentionLane: z.enum(["now", "next", "waiting", "review", "fyi"]),
  dueAt: nullableString, blocker: nullableString, sourceLabel: nullableString, sourceUrl: nullableString, updatedAt: dateString,
}).strict();

const approvalSchema = z.object({
  id: z.string(), projectId: z.string(), title: z.string(), recipient: nullableString, payloadJson: z.string(), payloadHash: z.string(),
  whyRequired: z.string(), riskLevel: z.enum(["low", "medium", "high"]), recommendedAction: z.string(), deadline: nullableString,
  status: z.enum(["pending", "approved", "declined", "deferred", "completed"]), createdAt: dateString, updatedAt: dateString,
}).strict();

const communicationSchema = z.object({
  id: z.string(), sourceId: z.string(), projectId: z.string(), channel: z.string(), sender: z.string(), subject: z.string(),
  receivedAt: dateString, responseTargetAt: dateString, responseCriticalAt: dateString, hardDeadlineAt: dateString,
  status: z.string(), summary: z.string(), draftResponse: nullableString, approvalId: nullableString,
}).strict();

const usagePreflightSchema = z.object({
  id: z.string(), activity: z.string(), importanceRank: z.number().int(), baseCostRank: z.number().int(), adjustedCostRank: z.number().int(),
  maximumRuns: z.number().int(), expiresAt: dateString, estimatedCostBand: z.string(), eventDriven: z.boolean(), modelClass: z.string(),
  reasoningLevel: z.string(), status: z.string(), rationale: z.string(), createdAt: dateString,
}).strict();

const agentStatusSchema = z.object({
  id: z.string(), agent: z.string(), platform: z.string(), projectId: nullableString, task: z.string(), status: z.string(),
  lastSeenAt: dateString, nextAction: z.string(), blockedReason: nullableString, evidence: z.string(),
}).strict();

const intakeAttachmentSchema = z.object({
  id: z.string(), originalFilename: z.string(), contentType: z.string(), sizeBytes: z.number().int().nonnegative(),
  sha256: z.string(), downloadUrl: z.string(),
}).strict();

const intakeItemSchema = z.object({
  id: z.string(), sourceId: z.string(), projectId: z.string(), kind: z.enum(["screenshot", "screen-recording", "file", "url", "text", "media"]),
  source: z.string(), title: z.string(), originalFilename: nullableString, contentType: nullableString, sizeBytes: z.number().int().nonnegative().nullable(),
  drivePath: nullableString, sourceUrl: nullableString, capturedText: nullableString, device: z.string(), sha256: nullableString,
  imageIngestionEvidence: imageIngestionEvidenceSchema.nullable(),
  status: z.enum(["captured", "processing", "routed", "needs-attention"]), occurredAt: dateString, receivedAt: dateString, updatedAt: dateString,
  attachments: z.array(intakeAttachmentSchema),
}).strict();

const signalSourceSchema = z.enum(["claude", "codex", "gmail", "google-workspace", "google-drive", "supabase", "github", "notion", "zapier", "base44", "tapdat", "manual", "other"]);
const signalSchema = z.object({
  id: z.string(), sourceId: z.string(), projectId: z.string(), source: signalSourceSchema,
  kind: z.enum(["finding", "connector-health", "action-candidate", "status-change", "no-op"]), title: z.string(), summary: z.string(),
  severity: z.enum(["critical", "high", "normal", "low"]), status: z.enum(["open", "watching", "resolved", "archived", "suppressed"]),
  verificationStatus: z.enum(["claude-sourced-unverified", "source-verified", "independently-verified", "unknown"]), material: z.boolean(),
  synthesisStatus: z.enum(["not-needed", "needed", "completed", "blocked-by-cost-control"]), suggestedAction: nullableString, sourceUrl: nullableString,
  occurredAt: dateString, dueAt: nullableString, receivedAt: dateString, updatedAt: dateString, ageDays: z.number().int().nonnegative(),
}).strict();

const connectorHealthSchema = z.object({
  source: signalSourceSchema, status: z.enum(["healthy", "degraded", "paused"]), consecutiveErrors: z.number().int().nonnegative(),
  consecutiveNoOps: z.number().int().nonnegative(), lastEventAt: dateString, lastSuccessAt: nullableString, lastError: nullableString, pausedReason: nullableString,
}).strict();

export const commandCenterStateSchema = z.object({
  schemaVersion: z.literal(1), generatedAt: dateString, projects: z.array(projectSchema), workItems: z.array(workItemSchema),
  approvals: z.array(approvalSchema), communications: z.array(communicationSchema), usagePreflights: z.array(usagePreflightSchema),
  agentStatuses: z.array(agentStatusSchema), intakeItems: z.array(intakeItemSchema), signals: z.array(signalSchema),
  connectorHealth: z.array(connectorHealthSchema), settings: z.record(z.string(), z.string()),
}).strict();

export function parseCommandCenterState(input: unknown): CommandCenterState {
  return commandCenterStateSchema.parse(input) as CommandCenterState;
}

export function safeParseCommandCenterState(input: unknown) {
  return commandCenterStateSchema.safeParse(input);
}
