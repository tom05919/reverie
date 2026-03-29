import type { NegotiationMessage } from "@/lib/types";
import {
  getSession,
  addMessage,
  setTurn,
  completeSession,
} from "@/lib/negotiation/sessions";
import { detectCompletion } from "@/lib/negotiation/completion";
import { generateSimulatedMessage } from "@/lib/negotiation/simulator";
import { extractDealSummary } from "@/lib/negotiation/extract-terms";

let msgCounter = 0;
function nextMsgId(): string {
  msgCounter++;
  return `nm_${Date.now()}_${msgCounter}`;
}

/**
 * Execute a single negotiation turn using the simulator.
 */
export async function executeNextTurn(
  sessionId: string,
): Promise<NegotiationMessage | null> {
  const session = getSession(sessionId);
  if (!session) return null;
  if (session.status !== "active") return null;
  if (session.messages.length >= session.maxTurns) {
    completeSession(sessionId, "stalemate");
    return null;
  }

  const currentSide = session.turn;
  const currentAgent =
    currentSide === "agentA" ? session.agentA : session.agentB;
  const otherSide = currentSide === "agentA" ? "agentB" : "agentA";

  const senderTag =
    currentSide === "agentA" ? "our_agent" : "their_agent";

  const lastMessage =
    session.messages.length > 0
      ? session.messages[session.messages.length - 1].content
      : "";

  const text = generateSimulatedMessage(
    currentAgent.config,
    session.messages.length,
    session.maxTurns,
    lastMessage,
  );

  const msg: NegotiationMessage = {
    id: nextMsgId(),
    sender: senderTag as "our_agent" | "their_agent",
    senderName: currentAgent.name,
    content: text,
    timestamp: new Date().toISOString(),
  };

  addMessage(sessionId, msg);
  setTurn(sessionId, otherSide);

  const outcome = await detectCompletion(session.messages);

  if (outcome !== "ongoing") {
    const summary =
      outcome === "agreed"
        ? extractDealSummary(
            session.dealTitle,
            session.agentA.config,
            session.agentB.config,
            session.messages,
          )
        : undefined;
    completeSession(sessionId, outcome, summary);
  }

  return msg;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const runningNegotiations = new Set<string>();

/**
 * Auto-run the negotiation: agents take turns with a delay
 * until completion, max turns, or pause.
 */
export async function runNegotiation(
  sessionId: string,
  options?: { delayMs?: number },
): Promise<void> {
  if (runningNegotiations.has(sessionId)) return;
  runningNegotiations.add(sessionId);

  const delay = options?.delayMs ?? 2000;

  try {
    while (true) {
      const session = getSession(sessionId);
      if (!session) break;
      if (session.status !== "active") break;
      if (session.messages.length >= session.maxTurns) {
        completeSession(sessionId, "stalemate");
        break;
      }

      const msg = await executeNextTurn(sessionId);
      if (!msg) break;

      const updated = getSession(sessionId);
      if (!updated || updated.status !== "active") break;

      await sleep(delay);
    }
  } finally {
    runningNegotiations.delete(sessionId);
  }
}

export function isRunning(sessionId: string): boolean {
  return runningNegotiations.has(sessionId);
}
