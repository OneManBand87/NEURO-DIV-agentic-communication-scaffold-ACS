export type AttentionLane = "now" | "next" | "waiting" | "review" | "fyi";

export type ProjectRecord = {
  id: string;
  title: string;
  parentId: string | null;
  status: string;
  summary: string;
  userPlan: string;
  codexPlan: string;
  timelineStatus: string;
  benchmark: string;
  sortOrder: number;
};

export type WorkItemRecord = {
  id: string;
  projectId: string;
  title: string;
  owner: string;
  status: string;
  priority: "critical" | "high" | "normal" | "low";
  attentionLane: AttentionLane;
  dueAt: string | null;
  blocker: string | null;
  sourceLabel: string | null;
  sourceUrl: string | null;
  updatedAt: string;
};

export type ApprovalRecord = {
  id: string;
  projectId: string;
  title: string;
  recipient: string | null;
  payloadJson: string;
  payloadHash: string;
  whyRequired: string;
  riskLevel: "low" | "medium" | "high";
  recommendedAction: string;
  deadline: string | null;
  status: "pending" | "approved" | "declined" | "deferred" | "completed";
  createdAt: string;
  updatedAt: string;
};

export type CommunicationRecord = {
  id: string;
  sourceId: string;
  projectId: string;
  channel: string;
  sender: string;
  subject: string;
  receivedAt: string;
  responseTargetAt: string;
  responseCriticalAt: string;
  hardDeadlineAt: string;
  status: string;
  summary: string;
  draftResponse: string | null;
  approvalId: string | null;
};

export type UsagePreflightRecord = {
  id: string;
  activity: string;
  importanceRank: number;
  baseCostRank: number;
  adjustedCostRank: number;
  maximumRuns: number;
  expiresAt: string;
  estimatedCostBand: string;
  eventDriven: boolean;
  modelClass: string;
  reasoningLevel: string;
  status: string;
  rationale: string;
  createdAt: string;
};

export type AgentStatusRecord = {
  id: string;
  agent: string;
  platform: string;
  projectId: string | null;
  task: string;
  status: string;
  lastSeenAt: string;
  nextAction: string;
  blockedReason: string | null;
  evidence: string;
};

export type IntakeItemRecord = {
  id: string;
  sourceId: string;
  projectId: string;
  kind: "screenshot" | "screen-recording" | "file" | "url" | "text" | "media";
  source: string;
  title: string;
  originalFilename: string | null;
  contentType: string | null;
  sizeBytes: number | null;
  drivePath: string | null;
  sourceUrl: string | null;
  capturedText: string | null;
  device: string;
  sha256: string | null;
  status: "captured" | "processing" | "routed" | "needs-attention";
  occurredAt: string;
  receivedAt: string;
  updatedAt: string;
};

export type CommandCenterState = {
  generatedAt: string;
  projects: ProjectRecord[];
  workItems: WorkItemRecord[];
  approvals: ApprovalRecord[];
  communications: CommunicationRecord[];
  usagePreflights: UsagePreflightRecord[];
  agentStatuses: AgentStatusRecord[];
  intakeItems: IntakeItemRecord[];
  settings: Record<string, string>;
};
