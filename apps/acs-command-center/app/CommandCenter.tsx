"use client";

import { useEffect, useMemo, useState } from "react";
import type { ApprovalRecord, CommandCenterState, CommunicationRecord, WorkItemRecord } from "../lib/types";

type SpeechRecognitionEventLike = { results: ArrayLike<{ 0: { transcript: string } }> };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const laneLabels: Record<WorkItemRecord["attentionLane"], string> = {
  now: "Now",
  next: "Next",
  waiting: "Waiting",
  review: "Review",
  fyi: "FYI",
};

function formatDate(value: string | null, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "No deadline";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", options ?? { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(parsed);
}

function recruiterUrgency(message: CommunicationRecord) {
  const now = Date.now();
  if (message.status !== "response-needed") return "handled";
  if (now >= new Date(message.responseCriticalAt).getTime()) return "critical";
  if (now >= new Date(message.responseTargetAt).getTime()) return "urgent";
  return "on-track";
}

export function CommandCenter({ initialState }: { initialState: CommandCenterState }) {
  const [state, setState] = useState(initialState);
  const [capture, setCapture] = useState("");
  const [listening, setListening] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState("Live data is loading.");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/state", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Live state is not available");
        return response.json() as Promise<CommandCenterState>;
      })
      .then((next) => {
        if (!cancelled) {
          setState(next);
          setNotice("Live control-center state loaded.");
        }
      })
      .catch(() => {
        if (!cancelled) setNotice("Showing the verified local snapshot. Live persistence is temporarily unavailable.");
      });
    return () => { cancelled = true; };
  }, []);

  const pendingApprovals = useMemo(
    () => state.approvals.filter((approval) => approval.status === "pending"),
    [state.approvals],
  );
  const recruiterMessages = useMemo(
    () => state.communications.filter((message) => message.status === "response-needed"),
    [state.communications],
  );
  const attentionItems = useMemo(
    () => state.workItems.filter((item) => item.attentionLane === "now").slice(0, 3),
    [state.workItems],
  );
  const backgroundPaused = state.settings.background_ai_paused !== "false";

  async function mutate(payload: Record<string, unknown>, label: string) {
    setBusy(label);
    try {
      const response = await fetch("/api/state", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const next = await response.json() as CommandCenterState & { error?: string };
      if (!response.ok) throw new Error(next.error ?? "Update failed");
      setState(next);
      setNotice(`${label} completed.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "The update could not be completed.");
    } finally {
      setBusy(null);
    }
  }

  function startVoiceCapture() {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setNotice("Browser voice capture is unavailable here. Use the microphone on your phone keyboard in the capture field.");
      return;
    }
    const recognition = new Recognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      setCapture((current) => [current, transcript].filter(Boolean).join(" "));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setNotice("Voice capture stopped. You can continue with keyboard dictation.");
    };
    setListening(true);
    recognition.start();
  }

  async function submitCapture() {
    const text = capture.trim();
    if (!text) return;
    await mutate({ action: "capture", text }, "Idea capture");
    setCapture("");
  }

  return (
    <main className="command-center">
      <header className="topbar">
        <div>
          <p className="eyebrow">ACS COMMAND CENTER</p>
          <h1>Today, without the noise.</h1>
          <p className="subtitle">One place for priorities, approvals, recruiter timing, agents, projects, and usage protection.</p>
        </div>
        <div className="topbar-status" aria-label="System status">
          <span className="status-dot" />
          <div><strong>Control center active</strong><span>{formatDate(state.generatedAt, { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span></div>
        </div>
      </header>

      <nav className="section-nav" aria-label="Command Center sections">
        <a href="#today">Today</a>
        <a href="#approvals">Approvals <span>{pendingApprovals.length}</span></a>
        <a href="#communications">Recruiters <span>{recruiterMessages.length}</span></a>
        <a href="#projects">Projects</a>
        <a href="#agents">Agents</a>
        <a href="#usage">Usage</a>
      </nav>

      <p className="sr-notice" role="status" aria-live="polite">{notice}</p>

      <section className="capture-card" aria-labelledby="capture-title">
        <div className="capture-copy">
          <span className="section-kicker">VOICE INBOX</span>
          <h2 id="capture-title">Say it now. Routing comes later.</h2>
          <p>Your exact thought is preserved. Codex can classify and connect it without interrupting capture.</p>
        </div>
        <div className="capture-controls">
          <label className="sr-only" htmlFor="quick-capture">Quick capture</label>
          <textarea id="quick-capture" value={capture} onChange={(event) => setCapture(event.target.value)} placeholder="Speak or type an idea, task, reminder, or issue…" rows={3} />
          <div className="button-row">
            <button className="button secondary" type="button" onClick={startVoiceCapture} aria-pressed={listening}>{listening ? "Listening…" : "Use microphone"}</button>
            <button className="button primary" type="button" onClick={submitCapture} disabled={!capture.trim() || busy !== null}>{busy === "Idea capture" ? "Saving…" : "Capture"}</button>
          </div>
        </div>
      </section>

      <section id="today" className="section-block" aria-labelledby="today-title">
        <div className="section-heading">
          <div><span className="section-kicker">FOCUS</span><h2 id="today-title">The three things that matter now</h2></div>
          <span className="quiet-badge">WIP limit: 3</span>
        </div>
        <div className="focus-grid">
          {attentionItems.map((item, index) => (
            <article className="focus-card" key={item.id}>
              <div className="focus-number">0{index + 1}</div>
              <div className="focus-content">
                <div className="meta-row"><span className={`priority ${item.priority}`}>{item.priority}</span><span>{item.owner}</span></div>
                <h3>{item.title}</h3>
                <p>{item.status}</p>
                <div className="focus-footer"><span>{state.projects.find((project) => project.id === item.projectId)?.title}</span><span>{formatDate(item.dueAt)}</span></div>
              </div>
            </article>
          ))}
        </div>
        <div className="lane-strip" aria-label="Attention lanes">
          {(Object.keys(laneLabels) as WorkItemRecord["attentionLane"][]).map((lane) => (
            <div key={lane}><strong>{state.workItems.filter((item) => item.attentionLane === lane).length}</strong><span>{laneLabels[lane]}</span></div>
          ))}
        </div>
      </section>

      <section id="approvals" className="section-block accent-block" aria-labelledby="approvals-title">
        <div className="section-heading">
          <div><span className="section-kicker">ONE APPROVAL QUEUE</span><h2 id="approvals-title">Only decisions that genuinely require you</h2></div>
          <span className={`count-badge ${pendingApprovals.length ? "attention" : "clear"}`}>{pendingApprovals.length} waiting</span>
        </div>
        {pendingApprovals.length === 0 ? (
          <div className="empty-state"><span aria-hidden="true">✓</span><div><strong>No approvals are blocking work.</strong><p>Codex continues everything else without transferring workflow ownership to you.</p></div></div>
        ) : (
          <div className="approval-list">
            {pendingApprovals.map((approval) => <ApprovalCard key={approval.id} approval={approval} busy={busy} onDecision={mutate} />)}
          </div>
        )}
      </section>

      <section id="communications" className="section-block" aria-labelledby="communications-title">
        <div className="section-heading">
          <div><span className="section-kicker">RECRUITER SLA</span><h2 id="communications-title">Respond before the opportunity cools</h2></div>
          <div className="sla-legend"><span>Target 2h</span><span>Critical 3h</span><span>Hard stop same day</span></div>
        </div>
        {recruiterMessages.length === 0 ? (
          <div className="recruiter-clear">
            <div className="timer-ring"><strong>0</strong><span>waiting</span></div>
            <div><h3>No recruiter response is currently overdue.</h3><p>The approved design uses message events, one drafting run, and native timers—never recurring AI polling.</p></div>
          </div>
        ) : (
          <div className="message-list">
            {recruiterMessages.map((message) => {
              const urgency = recruiterUrgency(message);
              return <article className={`message-card ${urgency}`} key={message.id}>
                <div className="message-main"><span>{message.channel}</span><h3>{message.sender}</h3><p>{message.subject}</p><small>{message.summary}</small></div>
                <div className="message-status"><strong>{message.status === "approved-to-send" ? "approved draft" : urgency.replace("-", " ")}</strong><span>Target {formatDate(message.responseTargetAt)}</span></div>
                {message.draftResponse ? <div className="message-draft"><strong>Prepared reply</strong><p>{message.draftResponse}</p><div className="button-row">
                  <button className="button primary" type="button" onClick={() => navigator.clipboard.writeText(message.draftResponse ?? "")}>Copy reply</button>
                  <a className="button secondary" href={`https://mail.google.com/mail/#all/${message.sourceId}`} target="_blank" rel="noreferrer">Open notification</a>
                </div><small>{message.status === "approved-to-send" ? "Approved for manual sending through LinkedIn." : "Review and approve the exact draft in the approval queue first."}</small></div> : null}
              </article>;
            })}
          </div>
        )}
        <div className="linkedin-note"><strong>LinkedIn route:</strong><span>Individual email notifications → job-search Gmail → event intake → approval queue → one-tap copy/open. No scraping or automated LinkedIn activity.</span></div>
      </section>

      <section id="projects" className="section-block" aria-labelledby="projects-title">
        <div className="section-heading"><div><span className="section-kicker">PROJECT TREE</span><h2 id="projects-title">Six homes, one operating picture</h2></div><span className="quiet-badge">Drive remains canonical</span></div>
        <div className="project-grid">
          {state.projects.map((project) => (
            <article className="project-card" key={project.id}>
              <div className="project-top"><span className={`project-mark mark-${project.sortOrder}`} /><span>{project.status}</span></div>
              <h3>{project.title}</h3><p>{project.summary}</p>
              <dl><div><dt>Today</dt><dd>{project.codexPlan}</dd></div><div><dt>Benchmark</dt><dd>{project.benchmark}</dd></div></dl>
            </article>
          ))}
        </div>
      </section>

      <section id="agents" className="section-block" aria-labelledby="agents-title">
        <div className="section-heading"><div><span className="section-kicker">ACS AGENTS</span><h2 id="agents-title">Who is doing what</h2></div><span className="quiet-badge">Evidence-labelled status</span></div>
        <div className="agent-list">
          {state.agentStatuses.map((agent) => (
            <article className="agent-row" key={agent.id}><div className="agent-avatar">{agent.agent.slice(0, 1)}</div><div className="agent-main"><div><h3>{agent.agent}</h3><span>{agent.platform}</span></div><p>{agent.task}</p></div><div className="agent-status"><strong>{agent.status}</strong><span>{agent.nextAction}</span></div></article>
          ))}
        </div>
      </section>

      <section id="usage" className="section-block usage-block" aria-labelledby="usage-title">
        <div className="section-heading"><div><span className="section-kicker">USAGE SENTINEL</span><h2 id="usage-title">Spend attention and AI only where it matters</h2></div><span className={`count-badge ${backgroundPaused ? "clear" : "attention"}`}>{backgroundPaused ? "Background AI paused" : "Background AI enabled"}</span></div>
        <div className="usage-summary">
          <div><span>Recurring AI runs</span><strong>0 enabled</strong><small>{state.settings.paused_automation_count ?? "2"} paused</small></div>
          <div><span>Active bounded work</span><strong>{state.usagePreflights.filter((item) => item.status.includes("active")).length}</strong><small>No task-per-run churn</small></div>
          <div><span>Recruiter monitoring</span><strong>Event-driven</strong><small>One run per message</small></div>
        </div>
        <div className="usage-policy-grid">
          {state.usagePreflights.map((preflight) => (
            <article key={preflight.id}><div><span>{preflight.status}</span><strong>{preflight.estimatedCostBand} cost</strong></div><h3>{preflight.activity}</h3><p>{preflight.rationale}</p><footer><span>Max {preflight.maximumRuns} run{preflight.maximumRuns === 1 ? "" : "s"}</span><span>{preflight.eventDriven ? "Event-driven" : "Scheduled"}</span></footer></article>
          ))}
        </div>
        <button className={`pause-control ${backgroundPaused ? "paused" : "live"}`} type="button" disabled={busy !== null} onClick={() => mutate({ action: "set-background-pause", paused: !backgroundPaused }, backgroundPaused ? "Background AI enablement" : "Background AI pause")}>
          <span>{backgroundPaused ? "Background AI is paused" : "Pause all background AI"}</span><small>{backgroundPaused ? "Enabling still requires activity-level preflight controls." : "Immediate global stop for recurring AI work."}</small>
        </button>
      </section>

      <footer className="page-footer"><strong>ACS Command Center v0.2</strong><span>Observed facts, sourced facts, proposals, and unknowns remain explicitly separated.</span></footer>
    </main>
  );
}

function ApprovalCard({ approval, busy, onDecision }: { approval: ApprovalRecord; busy: string | null; onDecision: (payload: Record<string, unknown>, label: string) => Promise<void> }) {
  const payload = (() => { try { return JSON.stringify(JSON.parse(approval.payloadJson), null, 2); } catch { return approval.payloadJson; } })();
  return (
    <article className="approval-card">
      <div className="meta-row"><span className={`priority ${approval.riskLevel === "high" ? "critical" : "high"}`}>{approval.riskLevel} risk</span><span>{formatDate(approval.deadline)}</span></div>
      <h3>{approval.title}</h3><p>{approval.whyRequired}</p><pre>{payload}</pre><strong className="recommendation">Recommended: {approval.recommendedAction}</strong>
      <div className="button-row">
        <button className="button primary" disabled={busy !== null} onClick={() => onDecision({ action: "resolve-approval", id: approval.id, payloadHash: approval.payloadHash, decision: "approved" }, "Approval")}>Approve exact draft</button>
        <button className="button secondary" disabled={busy !== null} onClick={() => onDecision({ action: "resolve-approval", id: approval.id, payloadHash: approval.payloadHash, decision: "deferred" }, "Approval deferral")}>Defer</button>
        <button className="button ghost" disabled={busy !== null} onClick={() => onDecision({ action: "resolve-approval", id: approval.id, payloadHash: approval.payloadHash, decision: "declined" }, "Approval decline")}>Decline</button>
      </div>
    </article>
  );
}
