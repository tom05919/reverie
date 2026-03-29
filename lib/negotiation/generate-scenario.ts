import type { NegotiationScenario, NegotiationAgentConfig } from "@/lib/types";

const COUNTERPARTY_COMPANIES = [
  { name: "Apex Partners", agent: "Marcus" },
  { name: "Stellarion Inc", agent: "Elena" },
  { name: "Vanguard Solutions", agent: "Derek" },
  { name: "NovaBridge Corp", agent: "Priya" },
  { name: "Ironclad Industries", agent: "Jonas" },
  { name: "ClearPath Global", agent: "Samira" },
  { name: "Keystone Dynamics", agent: "Luca" },
  { name: "Summit Enterprises", agent: "Nadia" },
];

const STYLES: NegotiationAgentConfig["style"][] = [
  "collaborative",
  "aggressive",
  "balanced",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function extractPrice(prompt: string): number | null {
  const patterns = [
    /\$\s?([\d,]+(?:\.\d+)?)\s*[mM]/,
    /\$\s?([\d,]+(?:\.\d+)?)\s*[kK]/,
    /\$\s?([\d,]+(?:\.\d+)?)/,
    /([\d,]+(?:\.\d+)?)\s*(?:dollars|usd)/i,
  ];
  for (const p of patterns) {
    const m = prompt.match(p);
    if (m) {
      const num = parseFloat(m[1].replace(/,/g, ""));
      if (prompt.match(/\$\s?[\d,]+(?:\.\d+)?\s*[mM]/)) return num * 1_000_000;
      if (prompt.match(/\$\s?[\d,]+(?:\.\d+)?\s*[kK]/)) return num * 1_000;
      return num;
    }
  }
  return null;
}

function inferRole(prompt: string): "buyer" | "seller" {
  const buySignals =
    /\b(buy|purchase|procure|acquire|license|subscribe|get|need|want|looking for|source)\b/i;
  const sellSignals =
    /\b(sell|offer|provide|supply|deliver|pitch|propose to them)\b/i;
  if (sellSignals.test(prompt)) return "seller";
  if (buySignals.test(prompt)) return "buyer";
  return "buyer";
}

function extractDuration(prompt: string): string | null {
  const m = prompt.match(
    /(\d+)\s*[-–]?\s*(year|month|week|quarter)s?/i,
  );
  if (m) return `${m[1]} ${m[2].toLowerCase()}${parseInt(m[1]) > 1 ? "s" : ""}`;
  return null;
}

function extractQuantity(prompt: string): string | null {
  const m = prompt.match(
    /(\d[\d,]*)\s*(seats?|units?|licenses?|users?|devices?|nodes?|instances?)/i,
  );
  if (m) return `${m[1]} ${m[2].toLowerCase()}`;
  return null;
}

function buildTitle(prompt: string): string {
  const cleaned = prompt
    .replace(/^(negotiate|i want|please|can you)\s+/i, "")
    .replace(/\.$/, "");
  if (cleaned.length <= 60) {
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  const firstSentence = cleaned.split(/[.!?]/)[0].trim();
  if (firstSentence.length <= 60) {
    return firstSentence.charAt(0).toUpperCase() + firstSentence.slice(1);
  }
  return firstSentence.slice(0, 57) + "...";
}

export function generateScenarioFromPrompt(
  prompt: string,
): NegotiationScenario {
  const userRole = inferRole(prompt);
  const counterpartyRole = userRole === "buyer" ? "seller" : "buyer";
  const counterparty = pickRandom(COUNTERPARTY_COMPANIES);
  const price = extractPrice(prompt);
  const duration = extractDuration(prompt);
  const quantity = extractQuantity(prompt);

  const basePrice = price ?? 250_000;

  const userFloor =
    userRole === "buyer" ? undefined : Math.round(basePrice * 0.8);
  const userCeiling =
    userRole === "buyer" ? Math.round(basePrice * 1.1) : undefined;
  const counterFloor =
    counterpartyRole === "buyer" ? undefined : Math.round(basePrice * 0.7);
  const counterCeiling =
    counterpartyRole === "buyer" ? Math.round(basePrice * 1.3) : undefined;

  const objectives: string[] = [];
  if (price) {
    objectives.push(
      userRole === "buyer"
        ? `Secure pricing at or below ${formatPrice(basePrice)}`
        : `Close at ${formatPrice(basePrice)} or above`,
    );
  }
  if (duration) objectives.push(`Lock in a ${duration} commitment`);
  if (quantity) objectives.push(`Agree on ${quantity} scope`);
  if (objectives.length === 0) objectives.push("Negotiate the best terms possible");
  objectives.push("Ensure favorable payment and support terms");
  objectives.push("Maintain flexibility for future expansion");

  const counterObjectives = [
    counterpartyRole === "buyer"
      ? `Keep total cost under ${formatPrice(basePrice * 1.2)}`
      : `Achieve revenue of at least ${formatPrice(basePrice * 0.85)}`,
    duration ? `Negotiate ${duration} or shorter term` : "Minimize long-term lock-in",
    "Secure strong SLA and support guarantees",
    "Protect against scope creep and hidden costs",
  ];

  const mustHaves: string[] = [];
  if (/sla|uptime|support/i.test(prompt)) mustHaves.push("Enterprise-grade SLA and support");
  if (/security|compliance|gdpr|soc/i.test(prompt)) mustHaves.push("Security and compliance certification");
  if (duration) mustHaves.push(`Commitment of at most ${duration}`);
  if (mustHaves.length === 0) mustHaves.push("Clear deliverables and timeline");

  const agentA: NegotiationAgentConfig = {
    companyName: "Reverie",
    agentName: "Reverie Agent",
    role: userRole,
    objectives,
    constraints: {
      priceFloor: userFloor,
      priceCeiling: userCeiling,
      mustHaves,
      walkAwayConditions: [
        userRole === "buyer"
          ? `Total cost exceeds ${formatPrice(basePrice * 1.4)}`
          : `Price drops below ${formatPrice(basePrice * 0.65)}`,
        "No clear timeline or deliverables",
      ],
    },
    style: pickRandom(["balanced", "collaborative"]),
    dealContext: `We are looking to ${userRole === "buyer" ? "procure" : "close a deal on"} ${prompt.toLowerCase().replace(/^(negotiate|i want|please|can you)\s+/i, "").slice(0, 200)}. ${price ? `Our target is around ${formatPrice(basePrice)}.` : "We need competitive market pricing."} ${duration ? `Preferred term is ${duration}.` : ""} ${quantity ? `Scope is ${quantity}.` : ""}`.trim(),
  };

  const agentB: NegotiationAgentConfig = {
    companyName: counterparty.name,
    agentName: counterparty.agent,
    role: counterpartyRole,
    objectives: counterObjectives,
    constraints: {
      priceFloor: counterFloor,
      priceCeiling: counterCeiling,
      mustHaves: [
        counterpartyRole === "seller"
          ? "Minimum commitment period"
          : "Demonstrated ROI within first quarter",
        "Standard payment terms (net-30)",
      ],
      walkAwayConditions: [
        counterpartyRole === "buyer"
          ? `Price above ${formatPrice(basePrice * 1.5)}`
          : `Price below ${formatPrice(basePrice * 0.55)}`,
        "Unreasonable scope or timeline demands",
      ],
    },
    style: pickRandom(STYLES),
    dealContext: `We are ${counterpartyRole === "seller" ? "offering" : "evaluating"} a solution in this space. ${price ? `Our internal pricing target is ${formatPrice(counterpartyRole === "seller" ? basePrice * 0.9 : basePrice * 0.8)}.` : "We need to stay competitive with market rates."} We have alternative options but prefer to close this deal if terms are right.`,
  };

  return {
    id: `custom_${Date.now()}`,
    title: buildTitle(prompt),
    description: `Custom negotiation: ${prompt.slice(0, 120)}${prompt.length > 120 ? "..." : ""}`,
    agentA,
    agentB,
    anonymous: true,
  };
}

function formatPrice(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}
