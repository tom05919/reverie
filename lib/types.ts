export type DealStatus =
  | "exploring"
  | "negotiating"
  | "pending_approval"
  | "closed_won"
  | "closed_lost";

export type InteractionOutcome = "success" | "ongoing" | "failed";

export interface Agent {
  id: string;
  name: string;
  company: string;
  avatar?: string;
}

export interface Deal {
  id: string;
  title: string;
  counterparty: Agent;
  status: DealStatus;
  value: number;
  lastActivity: string;
  summary: string;
  terms: DealTerm[];
  timeline: TimelineEvent[];
  strategyNotes: string;
  anonymous?: boolean;
}

export interface DealTerm {
  label: string;
  ourPosition: string;
  theirPosition: string;
  status: "agreed" | "disputed" | "open";
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
}

export interface Interaction {
  id: string;
  counterparty: Agent;
  topic: string;
  timestamp: string;
  outcome: InteractionOutcome;
  messages: { role: "agent" | "counterparty"; content: string }[];
  anonymous?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
}

export interface NegotiationMessage {
  id: string;
  sender: "our_agent" | "their_agent";
  senderName: string;
  content: string;
  timestamp: string;
}

export interface DealSummaryTerm {
  label: string;
  value: string;
  party: "mutual" | "our_agent" | "their_agent";
}

export interface DealSummary {
  title: string;
  agreedPrice: string | null;
  terms: DealSummaryTerm[];
  summary: string;
  generatedAt: string;
}

export type DealApproval = "pending" | "approved" | "rejected";

export interface LiveNegotiation {
  id: string;
  dealTitle: string;
  counterparty: Agent;
  messages: NegotiationMessage[];
  status: "active" | "paused" | "completed";
  outcome?: "agreed" | "stalemate";
  dealSummary?: DealSummary;
  approval?: DealApproval;
  anonymous?: boolean;
}

export interface ActivityItem {
  id: string;
  type: "deal_update" | "interaction" | "message" | "file_upload";
  title: string;
  description: string;
  timestamp: string;
}

export interface NegotiationAgentConfig {
  companyName: string;
  agentName: string;
  role: "buyer" | "seller";
  objectives: string[];
  constraints: {
    priceFloor?: number;
    priceCeiling?: number;
    mustHaves: string[];
    walkAwayConditions: string[];
  };
  style: "collaborative" | "aggressive" | "balanced";
  dealContext: string;
}

export interface NegotiationScenario {
  id: string;
  title: string;
  description: string;
  agentA: NegotiationAgentConfig;
  agentB: NegotiationAgentConfig;
  anonymous: boolean;
}
