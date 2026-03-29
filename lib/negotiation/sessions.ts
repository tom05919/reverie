import type {
  NegotiationAgentConfig,
  NegotiationMessage,
  LiveNegotiation,
  Agent,
  DealSummary,
  DealApproval,
} from "@/lib/types";

export interface NegotiationSession {
  id: string;
  dealTitle: string;
  agentA: { config: NegotiationAgentConfig; name: string };
  agentB: { config: NegotiationAgentConfig; name: string };
  messages: NegotiationMessage[];
  status: "active" | "paused" | "completed";
  outcome: "agreed" | "stalemate" | null;
  dealSummary: DealSummary | null;
  approval: DealApproval;
  turn: "agentA" | "agentB";
  maxTurns: number;
  anonymous: boolean;
  createdAt: string;
  listeners: Set<ReadableStreamDefaultController>;
}

const sessions = new Map<string, NegotiationSession>();

let idCounter = 0;
function nextId(): string {
  idCounter++;
  return `neg_${Date.now()}_${idCounter}`;
}

export function createSession(opts: {
  dealTitle: string;
  agentA: { config: NegotiationAgentConfig; name: string };
  agentB: { config: NegotiationAgentConfig; name: string };
  maxTurns?: number;
  anonymous?: boolean;
}): NegotiationSession {
  const session: NegotiationSession = {
    id: nextId(),
    dealTitle: opts.dealTitle,
    agentA: opts.agentA,
    agentB: opts.agentB,
    messages: [],
    status: "active",
    outcome: null,
    dealSummary: null,
    approval: "pending",
    turn: "agentA",
    maxTurns: opts.maxTurns ?? 20,
    anonymous: opts.anonymous ?? true,
    createdAt: new Date().toISOString(),
    listeners: new Set(),
  };
  sessions.set(session.id, session);
  return session;
}

export function getSession(id: string): NegotiationSession | undefined {
  return sessions.get(id);
}

export function listSessions(): NegotiationSession[] {
  return Array.from(sessions.values());
}

export function addMessage(
  sessionId: string,
  msg: NegotiationMessage,
): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.messages.push(msg);

  const event = `event: message\ndata: ${JSON.stringify(msg)}\n\n`;
  for (const controller of session.listeners) {
    try {
      controller.enqueue(new TextEncoder().encode(event));
    } catch {
      session.listeners.delete(controller);
    }
  }
}

export function updateStatus(
  sessionId: string,
  status: NegotiationSession["status"],
): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.status = status;

  const event = `event: status\ndata: ${JSON.stringify({ status })}\n\n`;
  for (const controller of session.listeners) {
    try {
      controller.enqueue(new TextEncoder().encode(event));
    } catch {
      session.listeners.delete(controller);
    }
  }
}

export function completeSession(
  sessionId: string,
  outcome: "agreed" | "stalemate",
  dealSummary?: DealSummary,
): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.status = "completed";
  session.outcome = outcome;
  if (dealSummary) session.dealSummary = dealSummary;

  const payload: Record<string, unknown> = { status: "completed", outcome };
  if (dealSummary) payload.dealSummary = dealSummary;

  const event = `event: complete\ndata: ${JSON.stringify(payload)}\n\n`;
  for (const controller of session.listeners) {
    try {
      controller.enqueue(new TextEncoder().encode(event));
    } catch {
      session.listeners.delete(controller);
    }
  }
}

export function setApproval(
  sessionId: string,
  approval: DealApproval,
): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.approval = approval;

  const event = `event: approval\ndata: ${JSON.stringify({ approval })}\n\n`;
  for (const controller of session.listeners) {
    try {
      controller.enqueue(new TextEncoder().encode(event));
    } catch {
      session.listeners.delete(controller);
    }
  }
}

export function setTurn(
  sessionId: string,
  turn: "agentA" | "agentB",
): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  session.turn = turn;

  const event = `event: turn\ndata: ${JSON.stringify({ turn })}\n\n`;
  for (const controller of session.listeners) {
    try {
      controller.enqueue(new TextEncoder().encode(event));
    } catch {
      session.listeners.delete(controller);
    }
  }
}

export function addListener(
  sessionId: string,
  controller: ReadableStreamDefaultController,
): void {
  const session = sessions.get(sessionId);
  if (!session) return;
  session.listeners.add(controller);
}

export function removeListener(
  sessionId: string,
  controller: ReadableStreamDefaultController,
): void {
  const session = sessions.get(sessionId);
  if (!session) return;
  session.listeners.delete(controller);
}

/**
 * Convert a session to the LiveNegotiation shape the frontend expects.
 */
export function sessionToLiveNegotiation(
  session: NegotiationSession,
): LiveNegotiation {
  const counterparty: Agent = {
    id: session.agentB.config.agentName,
    name: session.agentB.name,
    company: session.agentB.config.companyName,
    avatar: session.agentB.config.companyName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  };

  return {
    id: session.id,
    dealTitle: session.dealTitle,
    counterparty,
    messages: session.messages,
    status: session.status,
    outcome: session.outcome ?? undefined,
    dealSummary: session.dealSummary ?? undefined,
    approval: session.approval,
    anonymous: session.anonymous,
  };
}
