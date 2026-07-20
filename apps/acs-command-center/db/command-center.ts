import { env } from "cloudflare:workers";
import { initialCommandCenterState } from "../lib/seed-state";
import { ageInDays, evaluateSignalPolicy, nextConnectorHealth } from "../lib/signal-policy";
import type { CommandCenterState } from "../lib/types";

type D1Row = Record<string, unknown>;

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, parent_id TEXT, status TEXT NOT NULL,
    summary TEXT NOT NULL, user_plan TEXT NOT NULL, codex_plan TEXT NOT NULL,
    timeline_status TEXT NOT NULL, benchmark TEXT NOT NULL, sort_order INTEGER NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS work_items (
    id TEXT PRIMARY KEY, project_id TEXT NOT NULL, title TEXT NOT NULL, owner TEXT NOT NULL,
    status TEXT NOT NULL, priority TEXT NOT NULL, attention_lane TEXT NOT NULL, due_at TEXT,
    blocker TEXT, source_label TEXT, source_url TEXT, updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS approvals (
    id TEXT PRIMARY KEY, project_id TEXT NOT NULL, title TEXT NOT NULL, recipient TEXT,
    payload_json TEXT NOT NULL, payload_hash TEXT NOT NULL, why_required TEXT NOT NULL,
    risk_level TEXT NOT NULL, recommended_action TEXT NOT NULL, deadline TEXT,
    status TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS communications (
    id TEXT PRIMARY KEY, source_id TEXT NOT NULL UNIQUE, project_id TEXT NOT NULL,
    channel TEXT NOT NULL, sender TEXT NOT NULL, subject TEXT NOT NULL, received_at TEXT NOT NULL,
    response_target_at TEXT NOT NULL, response_critical_at TEXT NOT NULL,
    hard_deadline_at TEXT NOT NULL, status TEXT NOT NULL, summary TEXT NOT NULL,
    draft_response TEXT, approval_id TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS usage_preflights (
    id TEXT PRIMARY KEY, activity TEXT NOT NULL, importance_rank INTEGER NOT NULL,
    base_cost_rank INTEGER NOT NULL, adjusted_cost_rank INTEGER NOT NULL,
    maximum_runs INTEGER NOT NULL, expires_at TEXT NOT NULL, estimated_cost_band TEXT NOT NULL,
    event_driven INTEGER NOT NULL, model_class TEXT NOT NULL, reasoning_level TEXT NOT NULL,
    status TEXT NOT NULL, rationale TEXT NOT NULL, created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS agent_statuses (
    id TEXT PRIMARY KEY, agent TEXT NOT NULL, platform TEXT NOT NULL, project_id TEXT,
    task TEXT NOT NULL, status TEXT NOT NULL, last_seen_at TEXT NOT NULL,
    next_action TEXT NOT NULL, blocked_reason TEXT, evidence TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS intake_items (
    id TEXT PRIMARY KEY, source_id TEXT NOT NULL UNIQUE, project_id TEXT NOT NULL,
    kind TEXT NOT NULL, source TEXT NOT NULL, title TEXT NOT NULL,
    original_filename TEXT, content_type TEXT, size_bytes INTEGER, drive_path TEXT,
    source_url TEXT, captured_text TEXT, device TEXT NOT NULL, sha256 TEXT,
    status TEXT NOT NULL, occurred_at TEXT NOT NULL, received_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS intake_attachments (
    id TEXT PRIMARY KEY, intake_item_id TEXT NOT NULL, object_key TEXT NOT NULL UNIQUE,
    original_filename TEXT NOT NULL, content_type TEXT NOT NULL, size_bytes INTEGER NOT NULL,
    sha256 TEXT NOT NULL, uploaded_by TEXT, created_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS signals (
    id TEXT PRIMARY KEY, source_id TEXT NOT NULL UNIQUE, project_id TEXT NOT NULL,
    source TEXT NOT NULL, kind TEXT NOT NULL, title TEXT NOT NULL, summary TEXT NOT NULL,
    severity TEXT NOT NULL, status TEXT NOT NULL, verification_status TEXT NOT NULL,
    material INTEGER NOT NULL, synthesis_status TEXT NOT NULL, suggested_action TEXT,
    source_url TEXT, occurred_at TEXT NOT NULL, due_at TEXT, received_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS connector_health (
    source TEXT PRIMARY KEY, status TEXT NOT NULL, consecutive_errors INTEGER NOT NULL,
    consecutive_no_ops INTEGER NOT NULL, last_event_at TEXT NOT NULL, last_success_at TEXT,
    last_error TEXT, paused_reason TEXT
  )`,
  "CREATE INDEX IF NOT EXISTS work_items_lane_idx ON work_items(attention_lane, priority)",
  "CREATE INDEX IF NOT EXISTS communications_status_idx ON communications(status, response_target_at)",
  "CREATE INDEX IF NOT EXISTS approvals_status_idx ON approvals(status, deadline)",
  "CREATE INDEX IF NOT EXISTS intake_status_idx ON intake_items(status, received_at)",
  "CREATE INDEX IF NOT EXISTS intake_attachments_item_idx ON intake_attachments(intake_item_id, created_at)",
  "CREATE INDEX IF NOT EXISTS signals_status_idx ON signals(status, severity, occurred_at)",
];

function database() {
  if (!env.DB) throw new Error("D1 binding DB is unavailable");
  return env.DB;
}

export async function ensureCommandCenterDatabase() {
  const db = database();
  await db.batch(schemaStatements.map((statement) => db.prepare(statement)));
  const existing = await db.prepare("SELECT COUNT(*) AS count FROM projects").first<{ count: number }>();
  if ((existing?.count ?? 0) > 0) return;

  const statements = [];
  for (const project of initialCommandCenterState.projects) {
    statements.push(
      db.prepare(
        `INSERT INTO projects
          (id,title,parent_id,status,summary,user_plan,codex_plan,timeline_status,benchmark,sort_order)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
      ).bind(
        project.id,
        project.title,
        project.parentId,
        project.status,
        project.summary,
        project.userPlan,
        project.codexPlan,
        project.timelineStatus,
        project.benchmark,
        project.sortOrder,
      ),
    );
  }
  for (const item of initialCommandCenterState.workItems) {
    statements.push(
      db.prepare(
        `INSERT INTO work_items
          (id,project_id,title,owner,status,priority,attention_lane,due_at,blocker,source_label,source_url,updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      ).bind(
        item.id,
        item.projectId,
        item.title,
        item.owner,
        item.status,
        item.priority,
        item.attentionLane,
        item.dueAt,
        item.blocker,
        item.sourceLabel,
        item.sourceUrl,
        item.updatedAt,
      ),
    );
  }
  for (const usage of initialCommandCenterState.usagePreflights) {
    statements.push(
      db.prepare(
        `INSERT INTO usage_preflights
          (id,activity,importance_rank,base_cost_rank,adjusted_cost_rank,maximum_runs,expires_at,
           estimated_cost_band,event_driven,model_class,reasoning_level,status,rationale,created_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      ).bind(
        usage.id,
        usage.activity,
        usage.importanceRank,
        usage.baseCostRank,
        usage.adjustedCostRank,
        usage.maximumRuns,
        usage.expiresAt,
        usage.estimatedCostBand,
        usage.eventDriven ? 1 : 0,
        usage.modelClass,
        usage.reasoningLevel,
        usage.status,
        usage.rationale,
        usage.createdAt,
      ),
    );
  }
  for (const agent of initialCommandCenterState.agentStatuses) {
    statements.push(
      db.prepare(
        `INSERT INTO agent_statuses
          (id,agent,platform,project_id,task,status,last_seen_at,next_action,blocked_reason,evidence)
         VALUES (?,?,?,?,?,?,?,?,?,?)`,
      ).bind(
        agent.id,
        agent.agent,
        agent.platform,
        agent.projectId,
        agent.task,
        agent.status,
        agent.lastSeenAt,
        agent.nextAction,
        agent.blockedReason,
        agent.evidence,
      ),
    );
  }
  for (const [key, value] of Object.entries(initialCommandCenterState.settings)) {
    statements.push(
      db.prepare("INSERT INTO settings (key,value,updated_at) VALUES (?,?,?)").bind(
        key,
        value,
        initialCommandCenterState.generatedAt,
      ),
    );
  }
  await db.batch(statements);
}

const asString = (row: D1Row, key: string) => String(row[key] ?? "");
const asNullableString = (row: D1Row, key: string) => (row[key] == null ? null : String(row[key]));

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function loadCommandCenterState(): Promise<CommandCenterState> {
  await ensureCommandCenterDatabase();
  const db = database();
  const [projectRows, workRows, approvalRows, communicationRows, usageRows, agentRows, intakeRows, attachmentRows, signalRows, connectorRows, settingRows] =
    await Promise.all([
      db.prepare("SELECT * FROM projects ORDER BY sort_order").all<D1Row>(),
      db.prepare("SELECT * FROM work_items ORDER BY CASE priority WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END, updated_at DESC").all<D1Row>(),
      db.prepare("SELECT * FROM approvals ORDER BY CASE status WHEN 'pending' THEN 1 ELSE 2 END, deadline").all<D1Row>(),
      db.prepare("SELECT * FROM communications ORDER BY received_at DESC").all<D1Row>(),
      db.prepare("SELECT * FROM usage_preflights ORDER BY created_at DESC").all<D1Row>(),
      db.prepare("SELECT * FROM agent_statuses ORDER BY agent").all<D1Row>(),
      db.prepare("SELECT * FROM intake_items ORDER BY received_at DESC LIMIT 100").all<D1Row>(),
      db.prepare("SELECT * FROM intake_attachments ORDER BY created_at").all<D1Row>(),
      db.prepare("SELECT * FROM signals ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'normal' THEN 3 ELSE 4 END, occurred_at DESC LIMIT 100").all<D1Row>(),
      db.prepare("SELECT * FROM connector_health ORDER BY source").all<D1Row>(),
      db.prepare("SELECT * FROM settings").all<D1Row>(),
    ]);

  const settings = Object.fromEntries(settingRows.results.map((row) => [asString(row, "key"), asString(row, "value")]));
  const attachmentsByItem = new Map<string, CommandCenterState["intakeItems"][number]["attachments"]>();
  for (const row of attachmentRows.results) {
    const intakeItemId = asString(row, "intake_item_id");
    const attachments = attachmentsByItem.get(intakeItemId) ?? [];
    attachments.push({
      id: asString(row, "id"),
      originalFilename: asString(row, "original_filename"),
      contentType: asString(row, "content_type"),
      sizeBytes: Number(row.size_bytes ?? 0),
      sha256: asString(row, "sha256"),
      downloadUrl: `/api/attachments/${encodeURIComponent(asString(row, "id"))}`,
    });
    attachmentsByItem.set(intakeItemId, attachments);
  }
  return {
    generatedAt: new Date().toISOString(),
    settings,
    projects: projectRows.results.map((row) => ({
      id: asString(row, "id"), title: asString(row, "title"), parentId: asNullableString(row, "parent_id"),
      status: asString(row, "status"), summary: asString(row, "summary"), userPlan: asString(row, "user_plan"),
      codexPlan: asString(row, "codex_plan"), timelineStatus: asString(row, "timeline_status"),
      benchmark: asString(row, "benchmark"), sortOrder: Number(row.sort_order ?? 0),
    })),
    workItems: workRows.results.map((row) => ({
      id: asString(row, "id"), projectId: asString(row, "project_id"), title: asString(row, "title"),
      owner: asString(row, "owner"), status: asString(row, "status"),
      priority: asString(row, "priority") as CommandCenterState["workItems"][number]["priority"],
      attentionLane: asString(row, "attention_lane") as CommandCenterState["workItems"][number]["attentionLane"],
      dueAt: asNullableString(row, "due_at"), blocker: asNullableString(row, "blocker"),
      sourceLabel: asNullableString(row, "source_label"), sourceUrl: asNullableString(row, "source_url"),
      updatedAt: asString(row, "updated_at"),
    })),
    approvals: approvalRows.results.map((row) => ({
      id: asString(row, "id"), projectId: asString(row, "project_id"), title: asString(row, "title"),
      recipient: asNullableString(row, "recipient"), payloadJson: asString(row, "payload_json"),
      payloadHash: asString(row, "payload_hash"), whyRequired: asString(row, "why_required"),
      riskLevel: asString(row, "risk_level") as CommandCenterState["approvals"][number]["riskLevel"],
      recommendedAction: asString(row, "recommended_action"), deadline: asNullableString(row, "deadline"),
      status: asString(row, "status") as CommandCenterState["approvals"][number]["status"],
      createdAt: asString(row, "created_at"), updatedAt: asString(row, "updated_at"),
    })),
    communications: communicationRows.results.map((row) => ({
      id: asString(row, "id"), sourceId: asString(row, "source_id"), projectId: asString(row, "project_id"),
      channel: asString(row, "channel"), sender: asString(row, "sender"), subject: asString(row, "subject"),
      receivedAt: asString(row, "received_at"), responseTargetAt: asString(row, "response_target_at"),
      responseCriticalAt: asString(row, "response_critical_at"), hardDeadlineAt: asString(row, "hard_deadline_at"),
      status: asString(row, "status"), summary: asString(row, "summary"),
      draftResponse: asNullableString(row, "draft_response"), approvalId: asNullableString(row, "approval_id"),
    })),
    usagePreflights: usageRows.results.map((row) => ({
      id: asString(row, "id"), activity: asString(row, "activity"), importanceRank: Number(row.importance_rank ?? 0),
      baseCostRank: Number(row.base_cost_rank ?? 0), adjustedCostRank: Number(row.adjusted_cost_rank ?? 0),
      maximumRuns: Number(row.maximum_runs ?? 0), expiresAt: asString(row, "expires_at"),
      estimatedCostBand: asString(row, "estimated_cost_band"), eventDriven: Number(row.event_driven ?? 0) === 1,
      modelClass: asString(row, "model_class"), reasoningLevel: asString(row, "reasoning_level"),
      status: asString(row, "status"), rationale: asString(row, "rationale"), createdAt: asString(row, "created_at"),
    })),
    agentStatuses: agentRows.results.map((row) => ({
      id: asString(row, "id"), agent: asString(row, "agent"), platform: asString(row, "platform"),
      projectId: asNullableString(row, "project_id"), task: asString(row, "task"), status: asString(row, "status"),
      lastSeenAt: asString(row, "last_seen_at"), nextAction: asString(row, "next_action"),
      blockedReason: asNullableString(row, "blocked_reason"), evidence: asString(row, "evidence"),
    })),
    intakeItems: intakeRows.results.map((row) => {
      const id = asString(row, "id");
      return {
      id, sourceId: asString(row, "source_id"), projectId: asString(row, "project_id"),
      kind: asString(row, "kind") as CommandCenterState["intakeItems"][number]["kind"],
      source: asString(row, "source"), title: asString(row, "title"),
      originalFilename: asNullableString(row, "original_filename"), contentType: asNullableString(row, "content_type"),
      sizeBytes: row.size_bytes == null ? null : Number(row.size_bytes), drivePath: asNullableString(row, "drive_path"),
      sourceUrl: asNullableString(row, "source_url"), capturedText: asNullableString(row, "captured_text"),
      device: asString(row, "device"), sha256: asNullableString(row, "sha256"),
      status: asString(row, "status") as CommandCenterState["intakeItems"][number]["status"],
      occurredAt: asString(row, "occurred_at"), receivedAt: asString(row, "received_at"), updatedAt: asString(row, "updated_at"),
      attachments: attachmentsByItem.get(id) ?? [],
    };}),
    signals: signalRows.results.map((row) => ({
      id: asString(row, "id"), sourceId: asString(row, "source_id"), projectId: asString(row, "project_id"),
      source: asString(row, "source") as CommandCenterState["signals"][number]["source"],
      kind: asString(row, "kind") as CommandCenterState["signals"][number]["kind"],
      title: asString(row, "title"), summary: asString(row, "summary"),
      severity: asString(row, "severity") as CommandCenterState["signals"][number]["severity"],
      status: asString(row, "status") as CommandCenterState["signals"][number]["status"],
      verificationStatus: asString(row, "verification_status") as CommandCenterState["signals"][number]["verificationStatus"],
      material: Number(row.material ?? 0) === 1,
      synthesisStatus: asString(row, "synthesis_status") as CommandCenterState["signals"][number]["synthesisStatus"],
      suggestedAction: asNullableString(row, "suggested_action"), sourceUrl: asNullableString(row, "source_url"),
      occurredAt: asString(row, "occurred_at"), dueAt: asNullableString(row, "due_at"),
      receivedAt: asString(row, "received_at"), updatedAt: asString(row, "updated_at"),
      ageDays: ageInDays(asString(row, "occurred_at")),
    })),
    connectorHealth: connectorRows.results.map((row) => ({
      source: asString(row, "source") as CommandCenterState["connectorHealth"][number]["source"],
      status: asString(row, "status") as CommandCenterState["connectorHealth"][number]["status"],
      consecutiveErrors: Number(row.consecutive_errors ?? 0), consecutiveNoOps: Number(row.consecutive_no_ops ?? 0),
      lastEventAt: asString(row, "last_event_at"), lastSuccessAt: asNullableString(row, "last_success_at"),
      lastError: asNullableString(row, "last_error"), pausedReason: asNullableString(row, "paused_reason"),
    })),
  };
}

export async function ingestSignal(input: {
  sourceId: string;
  projectId: string;
  source: CommandCenterState["signals"][number]["source"];
  kind: CommandCenterState["signals"][number]["kind"];
  title: string;
  summary: string;
  severity: CommandCenterState["signals"][number]["severity"];
  verificationStatus: CommandCenterState["signals"][number]["verificationStatus"];
  material: boolean;
  actionable: boolean;
  suggestedAction?: string;
  sourceUrl?: string;
  occurredAt: string;
  dueAt?: string;
  connectorOutcome?: "success" | "error" | "no-op";
  connectorError?: string;
}) {
  await ensureCommandCenterDatabase();
  if (input.source.toLowerCase() === "slack") throw new Error("Slack is excluded from NEURO-DIV workflows");
  const db = database();
  const existing = await db.prepare("SELECT id FROM signals WHERE source_id = ?").bind(input.sourceId).first<{ id: string }>();
  if (existing) return { id: existing.id, duplicate: true, actionCandidateCreated: false, modelRunSuppressed: true };

  const now = new Date().toISOString();
  const policy = evaluateSignalPolicy(input);
  const id = `signal-${crypto.randomUUID()}`;
  const statements = [
    db.prepare(
      `INSERT INTO signals
        (id,source_id,project_id,source,kind,title,summary,severity,status,verification_status,material,
         synthesis_status,suggested_action,source_url,occurred_at,due_at,received_at,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(
      id, input.sourceId, input.projectId, input.source, input.kind, input.title, input.summary,
      input.severity, input.kind === "no-op" ? "suppressed" : "open", input.verificationStatus,
      input.material ? 1 : 0, policy.synthesisStatus, input.suggestedAction ?? null, input.sourceUrl ?? null,
      input.occurredAt, input.dueAt ?? null, now, now,
    ),
  ];

  if (policy.createActionCandidate) {
    statements.push(
      db.prepare(
        `INSERT INTO work_items
          (id,project_id,title,owner,status,priority,attention_lane,due_at,blocker,source_label,source_url,updated_at)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      ).bind(
        `signal-work-${id}`, input.projectId, input.title, "Codex",
        input.verificationStatus === "claude-sourced-unverified" ? "Verification required before action" : input.suggestedAction ?? "Review signal",
        input.severity, input.severity === "critical" ? "now" : "review", input.dueAt ?? null,
        input.verificationStatus === "claude-sourced-unverified" ? "Claude-sourced; not independently reverified" : null,
        `${input.source} signal`, input.sourceUrl ?? null, now,
      ),
    );
  }

  if (input.connectorOutcome) {
    const current = await db.prepare("SELECT consecutive_errors, consecutive_no_ops, last_success_at FROM connector_health WHERE source = ?")
      .bind(input.source).first<{ consecutive_errors: number; consecutive_no_ops: number; last_success_at: string | null }>();
    const health = nextConnectorHealth({
      currentErrors: current?.consecutive_errors ?? 0,
      currentNoOps: current?.consecutive_no_ops ?? 0,
      outcome: input.connectorOutcome,
    });
    statements.push(
      db.prepare(
        `INSERT INTO connector_health
          (source,status,consecutive_errors,consecutive_no_ops,last_event_at,last_success_at,last_error,paused_reason)
         VALUES (?,?,?,?,?,?,?,?)
         ON CONFLICT(source) DO UPDATE SET status=excluded.status, consecutive_errors=excluded.consecutive_errors,
         consecutive_no_ops=excluded.consecutive_no_ops, last_event_at=excluded.last_event_at,
         last_success_at=excluded.last_success_at, last_error=excluded.last_error, paused_reason=excluded.paused_reason`,
      ).bind(
        input.source, health.status, health.consecutiveErrors, health.consecutiveNoOps, now,
        input.connectorOutcome === "success" ? now : current?.last_success_at ?? null,
        input.connectorOutcome === "error" ? input.connectorError ?? input.summary : null,
        health.pausedReason,
      ),
    );
  }
  await db.batch(statements);
  return { id, duplicate: false, actionCandidateCreated: policy.createActionCandidate, modelRunSuppressed: policy.suppressModelRun };
}

export async function ingestUniversalItem(input: {
  sourceId: string; projectId: string; kind: string; source: string; title: string;
  originalFilename?: string; contentType?: string; sizeBytes?: number; drivePath?: string;
  sourceUrl?: string; capturedText?: string; device: string; sha256?: string; occurredAt: string;
}) {
  await ensureCommandCenterDatabase();
  const db = database();
  const existing = await db.prepare("SELECT id FROM intake_items WHERE source_id = ?").bind(input.sourceId).first<{ id: string }>();
  if (existing) return { id: existing.id, duplicate: true };
  const id = `intake-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  await db.prepare(
    `INSERT INTO intake_items
      (id,source_id,project_id,kind,source,title,original_filename,content_type,size_bytes,drive_path,
       source_url,captured_text,device,sha256,status,occurred_at,received_at,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).bind(
    id, input.sourceId, input.projectId, input.kind, input.source, input.title,
    input.originalFilename ?? null, input.contentType ?? null, input.sizeBytes ?? null,
    input.drivePath ?? null, input.sourceUrl ?? null, input.capturedText ?? null,
    input.device, input.sha256 ?? null, "captured", input.occurredAt, now, now,
  ).run();
  return { id, duplicate: false };
}

export async function createBrowserIntake(input: {
  text: string;
  uploadedBy: string | null;
  attachments: Array<{
    id: string;
    objectKey: string;
    originalFilename: string;
    contentType: string;
    sizeBytes: number;
    sha256: string;
  }>;
}) {
  await ensureCommandCenterDatabase();
  const db = database();
  const now = new Date().toISOString();
  const intakeId = `intake-${crypto.randomUUID()}`;
  const workId = `capture-${crypto.randomUUID()}`;
  const sourceId = `browser:${crypto.randomUUID()}`;
  const fallbackTitle = input.attachments.length === 1
    ? `Review attachment — ${input.attachments[0].originalFilename}`
    : `Review ${input.attachments.length} attachments`;
  const title = input.text.trim().slice(0, 500) || fallbackTitle;
  const totalBytes = input.attachments.reduce((total, attachment) => total + attachment.sizeBytes, 0);
  const contentType = input.attachments.length === 0
    ? null
    : input.attachments.length === 1
      ? input.attachments[0].contentType
      : "multipart/mixed";
  const originalFilename = input.attachments.length === 1 ? input.attachments[0].originalFilename : null;
  const statements = [
    db.prepare(
      `INSERT INTO intake_items
        (id,source_id,project_id,kind,source,title,original_filename,content_type,size_bytes,drive_path,
         source_url,captured_text,device,sha256,status,occurred_at,received_at,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(
      intakeId, sourceId, "general", input.attachments.length ? "file" : "text", "command-center-web",
      title, originalFilename, contentType, totalBytes, null, null, input.text.trim() || null,
      "Command Center web", null, "captured", now, now, now,
    ),
    db.prepare(
      `INSERT INTO work_items
        (id,project_id,title,owner,status,priority,attention_lane,due_at,blocker,source_label,source_url,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(
      workId, "general", title, "Codex",
      input.attachments.length ? `Captured with ${input.attachments.length} attachment${input.attachments.length === 1 ? "" : "s"} — routing needed` : "Captured — routing needed",
      "normal", "next", null, null, "Command Center intake", null, now,
    ),
  ];
  for (const attachment of input.attachments) {
    statements.push(
      db.prepare(
        `INSERT INTO intake_attachments
          (id,intake_item_id,object_key,original_filename,content_type,size_bytes,sha256,uploaded_by,created_at)
         VALUES (?,?,?,?,?,?,?,?,?)`,
      ).bind(
        attachment.id, intakeId, attachment.objectKey, attachment.originalFilename,
        attachment.contentType, attachment.sizeBytes, attachment.sha256, input.uploadedBy, now,
      ),
    );
  }
  await db.batch(statements);
  return { intakeId, workId };
}

export async function getIntakeAttachment(id: string) {
  await ensureCommandCenterDatabase();
  return database().prepare(
    `SELECT id, object_key, original_filename, content_type, size_bytes, sha256
     FROM intake_attachments WHERE id = ?`,
  ).bind(id).first<{
    id: string;
    object_key: string;
    original_filename: string;
    content_type: string;
    size_bytes: number;
    sha256: string;
  }>();
}

export async function setBackgroundPause(paused: boolean) {
  await ensureCommandCenterDatabase();
  await database()
    .prepare("INSERT INTO settings (key,value,updated_at) VALUES ('background_ai_paused',?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at")
    .bind(paused ? "true" : "false", new Date().toISOString())
    .run();
}

export async function captureWorkItem(text: string) {
  await ensureCommandCenterDatabase();
  const id = `capture-${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  await database().prepare(
    `INSERT INTO work_items
      (id,project_id,title,owner,status,priority,attention_lane,due_at,blocker,source_label,source_url,updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).bind(id, "general", text, "Codex", "Captured — routing needed", "normal", "next", null, null, "Voice / quick capture", null, now).run();
  return id;
}

export async function resolveApproval(id: string, payloadHash: string, decision: "approved" | "declined" | "deferred") {
  await ensureCommandCenterDatabase();
  const existing = await database().prepare("SELECT payload_hash, status FROM approvals WHERE id = ?").bind(id).first<{ payload_hash: string; status: string }>();
  if (!existing) throw new Error("Approval item not found");
  if (existing.status !== "pending") return;
  if (existing.payload_hash !== payloadHash) throw new Error("Approval payload changed; review the current payload before approving");
  const db = database();
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("UPDATE approvals SET status = ?, updated_at = ? WHERE id = ? AND payload_hash = ?").bind(decision, now, id, payloadHash),
    db.prepare("UPDATE communications SET status = ? WHERE approval_id = ?").bind(
      decision === "approved" ? "approved-to-send" : decision,
      id,
    ),
  ]);
}

export async function ingestRecruiterMessage(input: {
  sourceId: string;
  channel: string;
  sender: string;
  subject: string;
  receivedAt: string;
  summary: string;
  draftResponse?: string;
}) {
  await ensureCommandCenterDatabase();
  const db = database();
  const received = new Date(input.receivedAt);
  const target = new Date(received.getTime() + 120 * 60_000);
  const critical = new Date(received.getTime() + 180 * 60_000);
  const hard = new Date(received);
  hard.setHours(23, 59, 59, 999);
  const current = await db.prepare("SELECT id, approval_id FROM communications WHERE source_id = ?")
    .bind(input.sourceId)
    .first<{ id: string; approval_id: string | null }>();
  const id = current?.id ?? `comm-${crypto.randomUUID()}`;
  let approvalId = current?.approval_id ?? null;

  if (input.draftResponse && !approvalId) {
    approvalId = `approval-${crypto.randomUUID()}`;
    const now = new Date().toISOString();
    const payloadJson = JSON.stringify({
      action: "send-linkedin-reply-manually",
      channel: input.channel,
      recipient: input.sender,
      subject: input.subject,
      draftResponse: input.draftResponse,
      sourceId: input.sourceId,
    });
    const payloadHash = await sha256(payloadJson);
    await db.prepare(
      `INSERT INTO approvals
        (id,project_id,title,recipient,payload_json,payload_hash,why_required,risk_level,
         recommended_action,deadline,status,created_at,updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    ).bind(
      approvalId,
      "jobs-work",
      `Approve recruiter reply — ${input.sender}`,
      input.sender,
      payloadJson,
      payloadHash,
      "An external message will represent you. Approve only this exact draft; approval does not send it automatically.",
      "medium",
      "Approve the draft, then use Copy reply and Open notification to send it through LinkedIn.",
      hard.toISOString(),
      "pending",
      now,
      now,
    ).run();
  }

  await db.prepare(
    `INSERT INTO communications
      (id,source_id,project_id,channel,sender,subject,received_at,response_target_at,response_critical_at,
       hard_deadline_at,status,summary,draft_response,approval_id)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
     ON CONFLICT(source_id) DO UPDATE SET summary=excluded.summary, draft_response=COALESCE(excluded.draft_response, communications.draft_response)`,
  ).bind(
    id, input.sourceId, "jobs-work", input.channel, input.sender, input.subject, received.toISOString(),
    target.toISOString(), critical.toISOString(), hard.toISOString(), "response-needed", input.summary,
    input.draftResponse ?? null, approvalId,
  ).run();
}
