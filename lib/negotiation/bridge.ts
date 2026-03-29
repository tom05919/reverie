/**
 * Converts completed NegotiationSessions into Deal, Interaction,
 * and ActivityItem shapes so other pages reflect live negotiation results.
 */
import type {
  Deal,
  DealStatus,
  DealTerm,
  Interaction,
  InteractionOutcome,
  ActivityItem,
  Agent,
  TimelineEvent,
} from "@/lib/types";
import type { NegotiationSession } from "@/lib/negotiation/sessions";
import { listSessions } from "@/lib/negotiation/sessions";

function sessionCounterparty(session: NegotiationSession): Agent {
  return {
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
}

function sessionToDealStatus(session: NegotiationSession): DealStatus {
  if (session.status !== "completed") return "negotiating";
  if (session.approval === "approved") return "closed_won";
  if (session.approval === "rejected") return "closed_lost";
  if (session.outcome === "agreed") return "pending_approval";
  return "closed_lost";
}

function sessionToDealTerms(session: NegotiationSession): DealTerm[] {
  const terms: DealTerm[] = [];
  const ds = session.dealSummary;
  if (!ds) return terms;

  for (const t of ds.terms) {
    terms.push({
      label: t.label,
      ourPosition: t.party === "their_agent" ? "-" : t.value,
      theirPosition: t.party === "our_agent" ? "-" : t.value,
      status: "agreed",
    });
  }
  return terms;
}

function sessionToTimeline(session: NegotiationSession): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      id: `${session.id}_start`,
      timestamp: session.createdAt,
      actor: "Our Agent",
      action: "Negotiation started",
      detail: `Began negotiation with ${session.agentB.config.companyName}.`,
    },
  ];

  if (session.status === "completed") {
    const lastMsg = session.messages[session.messages.length - 1];
    events.push({
      id: `${session.id}_complete`,
      timestamp: lastMsg?.timestamp ?? session.createdAt,
      actor: "System",
      action:
        session.outcome === "agreed"
          ? "Deal reached"
          : "Negotiation ended",
      detail:
        session.outcome === "agreed"
          ? `Agents agreed on terms after ${session.messages.length} rounds.`
          : `No agreement after ${session.messages.length} rounds.`,
    });
  }

  if (session.approval === "approved") {
    events.push({
      id: `${session.id}_approved`,
      timestamp: new Date().toISOString(),
      actor: "Human",
      action: "Approved",
      detail: "Deal terms approved for execution.",
    });
  } else if (session.approval === "rejected") {
    events.push({
      id: `${session.id}_rejected`,
      timestamp: new Date().toISOString(),
      actor: "Human",
      action: "Rejected",
      detail: "Deal terms rejected.",
    });
  }

  return events;
}

function inferDealValue(session: NegotiationSession): number {
  const ds = session.dealSummary;
  if (ds?.agreedPrice) {
    const cleaned = ds.agreedPrice.replace(/[$,]/g, "");
    const multiplier = cleaned.match(/[Mm]/)
      ? 1_000_000
      : cleaned.match(/[Kk]/)
        ? 1_000
        : 1;
    const num = parseFloat(cleaned.replace(/[KkMmBb]/g, ""));
    if (!isNaN(num)) return Math.round(num * multiplier);
  }
  const a = session.agentA.config.constraints;
  const b = session.agentB.config.constraints;
  const floor = a.priceFloor ?? b.priceFloor ?? 0;
  const ceiling = a.priceCeiling ?? b.priceCeiling ?? 0;
  if (floor && ceiling) return Math.round((floor + ceiling) / 2);
  return floor || ceiling || 0;
}

export function sessionToDeal(session: NegotiationSession): Deal {
  const lastMsg = session.messages[session.messages.length - 1];
  return {
    id: session.id,
    title: session.dealTitle,
    counterparty: sessionCounterparty(session),
    status: sessionToDealStatus(session),
    value: inferDealValue(session),
    lastActivity: lastMsg?.timestamp ?? session.createdAt,
    summary: session.dealSummary?.summary ?? `Live negotiation with ${session.agentB.config.companyName}.`,
    terms: sessionToDealTerms(session),
    timeline: sessionToTimeline(session),
    strategyNotes: session.agentA.config.objectives.join(". "),
    anonymous: session.anonymous,
  };
}

export function sessionToInteraction(session: NegotiationSession): Interaction {
  const outcomeMap: Record<string, InteractionOutcome> = {
    agreed: "success",
    stalemate: "failed",
  };
  return {
    id: `int_${session.id}`,
    counterparty: sessionCounterparty(session),
    topic: session.dealTitle,
    timestamp:
      session.messages[session.messages.length - 1]?.timestamp ??
      session.createdAt,
    outcome:
      session.status === "completed"
        ? (outcomeMap[session.outcome ?? ""] ?? "failed")
        : "ongoing",
    messages: session.messages.map((m) => ({
      role: m.sender === "our_agent" ? ("agent" as const) : ("counterparty" as const),
      content: m.content,
    })),
    anonymous: session.anonymous,
  };
}

export function sessionToActivityItems(
  session: NegotiationSession,
): ActivityItem[] {
  const items: ActivityItem[] = [];

  items.push({
    id: `act_${session.id}_start`,
    type: "deal_update",
    title: `${session.dealTitle} — negotiation started`,
    description: `Started live negotiation with ${session.agentB.config.companyName}.`,
    timestamp: session.createdAt,
  });

  if (session.status === "completed") {
    const lastMsg = session.messages[session.messages.length - 1];
    items.push({
      id: `act_${session.id}_complete`,
      type: "deal_update",
      title:
        session.outcome === "agreed"
          ? `${session.dealTitle} — deal reached`
          : `${session.dealTitle} — no agreement`,
      description:
        session.outcome === "agreed"
          ? `Agents agreed on terms after ${session.messages.length} rounds. Awaiting approval.`
          : `Negotiation ended after ${session.messages.length} rounds with no deal.`,
      timestamp: lastMsg?.timestamp ?? session.createdAt,
    });
  }

  if (session.approval === "approved") {
    items.push({
      id: `act_${session.id}_approved`,
      type: "deal_update",
      title: `${session.dealTitle} — approved`,
      description: `Deal approved and moved to pipeline.`,
      timestamp: new Date().toISOString(),
    });
  } else if (session.approval === "rejected") {
    items.push({
      id: `act_${session.id}_rejected`,
      type: "deal_update",
      title: `${session.dealTitle} — rejected`,
      description: `Deal was reviewed and rejected.`,
      timestamp: new Date().toISOString(),
    });
  }

  return items;
}

export function getDealsFromSessions(): Deal[] {
  return listSessions()
    .filter((s) => s.messages.length > 0)
    .map(sessionToDeal);
}

export function getInteractionsFromSessions(): Interaction[] {
  return listSessions()
    .filter((s) => s.messages.length > 0)
    .map(sessionToInteraction);
}

export function getActivityFromSessions(): ActivityItem[] {
  return listSessions()
    .filter((s) => s.messages.length > 0)
    .flatMap(sessionToActivityItems);
}
