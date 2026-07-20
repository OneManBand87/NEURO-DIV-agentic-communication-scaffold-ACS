import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  parentId: text("parent_id"),
  status: text("status").notNull(),
  summary: text("summary").notNull(),
  userPlan: text("user_plan").notNull(),
  codexPlan: text("codex_plan").notNull(),
  timelineStatus: text("timeline_status").notNull(),
  benchmark: text("benchmark").notNull(),
  sortOrder: integer("sort_order").notNull(),
});

export const workItems = sqliteTable("work_items", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  owner: text("owner").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
  attentionLane: text("attention_lane").notNull(),
  dueAt: text("due_at"),
  blocker: text("blocker"),
  sourceLabel: text("source_label"),
  sourceUrl: text("source_url"),
  updatedAt: text("updated_at").notNull(),
});

export const approvals = sqliteTable("approvals", {
  id: text("id").primaryKey(),
  projectId: text("project_id").notNull(),
  title: text("title").notNull(),
  recipient: text("recipient"),
  payloadJson: text("payload_json").notNull(),
  payloadHash: text("payload_hash").notNull(),
  whyRequired: text("why_required").notNull(),
  riskLevel: text("risk_level").notNull(),
  recommendedAction: text("recommended_action").notNull(),
  deadline: text("deadline"),
  status: text("status").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const communications = sqliteTable("communications", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().unique(),
  projectId: text("project_id").notNull(),
  channel: text("channel").notNull(),
  sender: text("sender").notNull(),
  subject: text("subject").notNull(),
  receivedAt: text("received_at").notNull(),
  responseTargetAt: text("response_target_at").notNull(),
  responseCriticalAt: text("response_critical_at").notNull(),
  hardDeadlineAt: text("hard_deadline_at").notNull(),
  status: text("status").notNull(),
  summary: text("summary").notNull(),
  draftResponse: text("draft_response"),
  approvalId: text("approval_id"),
});

export const usagePreflights = sqliteTable("usage_preflights", {
  id: text("id").primaryKey(),
  activity: text("activity").notNull(),
  importanceRank: integer("importance_rank").notNull(),
  baseCostRank: integer("base_cost_rank").notNull(),
  adjustedCostRank: integer("adjusted_cost_rank").notNull(),
  maximumRuns: integer("maximum_runs").notNull(),
  expiresAt: text("expires_at").notNull(),
  estimatedCostBand: text("estimated_cost_band").notNull(),
  eventDriven: integer("event_driven", { mode: "boolean" }).notNull(),
  modelClass: text("model_class").notNull(),
  reasoningLevel: text("reasoning_level").notNull(),
  status: text("status").notNull(),
  rationale: text("rationale").notNull(),
  createdAt: text("created_at").notNull(),
});

export const agentStatuses = sqliteTable("agent_statuses", {
  id: text("id").primaryKey(),
  agent: text("agent").notNull(),
  platform: text("platform").notNull(),
  projectId: text("project_id"),
  task: text("task").notNull(),
  status: text("status").notNull(),
  lastSeenAt: text("last_seen_at").notNull(),
  nextAction: text("next_action").notNull(),
  blockedReason: text("blocked_reason"),
  evidence: text("evidence").notNull(),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const intakeItems = sqliteTable("intake_items", {
  id: text("id").primaryKey(),
  sourceId: text("source_id").notNull().unique(),
  projectId: text("project_id").notNull(),
  kind: text("kind").notNull(),
  source: text("source").notNull(),
  title: text("title").notNull(),
  originalFilename: text("original_filename"),
  contentType: text("content_type"),
  sizeBytes: integer("size_bytes"),
  drivePath: text("drive_path"),
  sourceUrl: text("source_url"),
  capturedText: text("captured_text"),
  device: text("device").notNull(),
  sha256: text("sha256"),
  status: text("status").notNull(),
  occurredAt: text("occurred_at").notNull(),
  receivedAt: text("received_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const intakeAttachments = sqliteTable(
  "intake_attachments",
  {
    id: text("id").primaryKey(),
    intakeItemId: text("intake_item_id").notNull(),
    objectKey: text("object_key").notNull().unique(),
    originalFilename: text("original_filename").notNull(),
    contentType: text("content_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    sha256: text("sha256").notNull(),
    uploadedBy: text("uploaded_by"),
    createdAt: text("created_at").notNull(),
  },
  (table) => [index("intake_attachments_item_idx").on(table.intakeItemId, table.createdAt)],
);

export const signals = sqliteTable(
  "signals",
  {
    id: text("id").primaryKey(),
    sourceId: text("source_id").notNull().unique(),
    projectId: text("project_id").notNull(),
    source: text("source").notNull(),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    severity: text("severity").notNull(),
    status: text("status").notNull(),
    verificationStatus: text("verification_status").notNull(),
    material: integer("material", { mode: "boolean" }).notNull(),
    synthesisStatus: text("synthesis_status").notNull(),
    suggestedAction: text("suggested_action"),
    sourceUrl: text("source_url"),
    occurredAt: text("occurred_at").notNull(),
    dueAt: text("due_at"),
    receivedAt: text("received_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [index("signals_status_idx").on(table.status, table.severity, table.occurredAt)],
);

export const connectorHealth = sqliteTable("connector_health", {
  source: text("source").primaryKey(),
  status: text("status").notNull(),
  consecutiveErrors: integer("consecutive_errors").notNull(),
  consecutiveNoOps: integer("consecutive_no_ops").notNull(),
  lastEventAt: text("last_event_at").notNull(),
  lastSuccessAt: text("last_success_at"),
  lastError: text("last_error"),
  pausedReason: text("paused_reason"),
});
