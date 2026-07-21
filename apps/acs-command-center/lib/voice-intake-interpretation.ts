export const voiceIntakeKinds = ["idea", "task", "concern", "evidence"] as const;
export type VoiceIntakeKind = (typeof voiceIntakeKinds)[number];

export type VoiceIntakeInterpretation = {
  captureId: string;
  title: string;
  summary: string;
  items: Array<{ type: VoiceIntakeKind; text: string }>;
  dates: Array<{ originalText: string; normalized: string | null; context: string; confidence: "high" | "medium" | "low" }>;
  people: Array<{ name: string; context: string; confidence: "high" | "medium" | "low" }>;
  proposedActions: Array<{ text: string; reviewRequired: true }>;
  confidence: "high" | "medium" | "low";
  needsHumanReview: true;
  originalAudioPreserved: true;
  modelRoute: "on-device" | "private-cloud-compute" | "ccs" | "manual";
  transcript: string;
};

export type SemanticTitleResult = {
  title: string;
  status: "accepted" | "normalized" | "fallback";
  reason: string | null;
};

const genericTitle = /^(voice|audio|recording|note|idea|thought|untitled|new recording|voice memo)(\s+(capture|note|memo|recording))?$/i;
const titlePrefix = /^(title|subject|topic)\s*:\s*/i;

function clean(value: string) {
  return value.replace(/[`*_#]/g, "").replace(/\s+/g, " ").trim();
}

function comparable(value: string) {
  return clean(value).toLocaleLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "");
}

function firstSpokenSentence(transcript: string) {
  return clean(transcript).split(/(?<=[.!?])\s+/u)[0] ?? "";
}

export function semanticVoiceTitle(candidate: string, transcript: string, captureId: string): SemanticTitleResult {
  const stripped = clean(candidate.replace(titlePrefix, "")).replace(/[.!?,;:—–-]+$/u, "").trim();
  const words = stripped.split(/\s+/u).filter(Boolean);
  const fallback = `Review voice capture ${captureId}`;
  const firstSentence = comparable(firstSpokenSentence(transcript));
  const titleComparable = comparable(stripped);

  let reason: string | null = null;
  if (!/^\d{6}$/.test(captureId)) reason = "invalid-capture-id";
  else if (stripped.length < 12 || stripped.length > 72) reason = "title-length";
  else if (words.length < 4 || words.length > 10) reason = "title-word-count";
  else if (genericTitle.test(stripped)) reason = "generic-title";
  else if (firstSentence && (titleComparable === firstSentence || firstSentence.startsWith(`${titleComparable} `))) reason = "copied-opening-sentence";

  if (reason) return { title: fallback, status: "fallback", reason };
  return {
    title: stripped,
    status: stripped === clean(candidate) ? "accepted" : "normalized",
    reason: null,
  };
}

export function isVoiceIntakeInterpretation(value: unknown): value is VoiceIntakeInterpretation {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const items = Array.isArray(record.items) ? record.items : [];
  const dates = Array.isArray(record.dates) ? record.dates : null;
  const people = Array.isArray(record.people) ? record.people : null;
  const actions = Array.isArray(record.proposedActions) ? record.proposedActions : [];
  return /^\d{6}$/.test(String(record.captureId ?? ""))
    && typeof record.title === "string"
    && typeof record.summary === "string" && record.summary.trim().length > 0
    && typeof record.transcript === "string" && record.transcript.trim().length > 0
    && dates !== null
    && people !== null
    && ["high", "medium", "low"].includes(String(record.confidence ?? ""))
    && record.needsHumanReview === true
    && record.originalAudioPreserved === true
    && ["on-device", "private-cloud-compute", "ccs", "manual"].includes(String(record.modelRoute ?? ""))
    && items.every((item) => Boolean(item) && typeof item === "object" && voiceIntakeKinds.includes(String((item as Record<string, unknown>).type) as VoiceIntakeKind) && typeof (item as Record<string, unknown>).text === "string")
    && actions.every((action) => Boolean(action) && typeof action === "object" && typeof (action as Record<string, unknown>).text === "string" && (action as Record<string, unknown>).reviewRequired === true);
}
