import type {
  NegotiationAgentConfig,
  NegotiationMessage,
  DealSummary,
  DealSummaryTerm,
} from "@/lib/types";

const PRICE_PATTERN = /\$[\d,.]+[KMBkmb]?/g;

function extractPrices(text: string): string[] {
  return Array.from(text.matchAll(PRICE_PATTERN)).map((m) => m[0]);
}

function extractPercentages(text: string): string[] {
  return Array.from(text.matchAll(/\d+(?:\.\d+)?%/g)).map((m) => m[0]);
}

function lastPriceMentioned(messages: NegotiationMessage[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const prices = extractPrices(messages[i].content);
    if (prices.length > 0) return prices[prices.length - 1];
  }
  return null;
}

function inferAgreedPrice(
  messages: NegotiationMessage[],
  agentA: NegotiationAgentConfig,
  agentB: NegotiationAgentConfig,
): string | null {
  const lastPrice = lastPriceMentioned(messages);
  if (lastPrice) return lastPrice;

  const sellerFloor =
    agentA.role === "seller"
      ? agentA.constraints.priceFloor
      : agentB.constraints.priceFloor;
  const buyerCeiling =
    agentA.role === "buyer"
      ? agentA.constraints.priceCeiling
      : agentB.constraints.priceCeiling;

  if (sellerFloor != null && buyerCeiling != null) {
    const mid = Math.round((sellerFloor + buyerCeiling) / 2);
    if (mid >= 1_000_000) return `$${(mid / 1_000_000).toFixed(1)}M`;
    if (mid >= 1_000) return `$${(mid / 1_000).toFixed(0)}K`;
    return `$${mid.toLocaleString()}`;
  }

  return null;
}

function buildTermsFromConfig(
  agentA: NegotiationAgentConfig,
  agentB: NegotiationAgentConfig,
  messages: NegotiationMessage[],
): DealSummaryTerm[] {
  const terms: DealSummaryTerm[] = [];

  const allMustHaves = new Set([
    ...agentA.constraints.mustHaves,
    ...agentB.constraints.mustHaves,
  ]);
  for (const mh of allMustHaves) {
    const fromA = agentA.constraints.mustHaves.includes(mh);
    const fromB = agentB.constraints.mustHaves.includes(mh);
    terms.push({
      label: mh,
      value: "Included",
      party: fromA && fromB ? "mutual" : fromA ? "our_agent" : "their_agent",
    });
  }

  const allText = messages.map((m) => m.content).join(" ");
  const pcts = extractPercentages(allText);
  if (pcts.length > 0) {
    terms.push({
      label: "Discount / Escalation",
      value: pcts[pcts.length - 1],
      party: "mutual",
    });
  }

  const durationMatch = allText.match(
    /(\d+)[\s-]*(month|year|week|quarter)s?/i,
  );
  if (durationMatch) {
    terms.push({
      label: "Contract Duration",
      value: `${durationMatch[1]} ${durationMatch[2]}${Number(durationMatch[1]) > 1 ? "s" : ""}`,
      party: "mutual",
    });
  }

  const paymentMatch = allText.match(
    /(?:net[\s-]?\d+|payment within \d+ days|\d+ days? payment|quarterly payments?|monthly payments?|annual payments?)/i,
  );
  if (paymentMatch) {
    terms.push({
      label: "Payment Terms",
      value: paymentMatch[0],
      party: "mutual",
    });
  }

  for (const obj of agentA.objectives) {
    if (!terms.some((t) => t.label.toLowerCase() === obj.toLowerCase())) {
      terms.push({ label: obj, value: "Agreed", party: "our_agent" });
    }
  }

  return terms;
}

function buildSummaryText(
  dealTitle: string,
  agreedPrice: string | null,
  agentA: NegotiationAgentConfig,
  agentB: NegotiationAgentConfig,
  messageCount: number,
): string {
  const parts: string[] = [];
  parts.push(
    `After ${messageCount} rounds of negotiation between ${agentA.companyName} and ${agentB.companyName},`,
  );
  if (agreedPrice) {
    parts.push(`the parties agreed on a deal valued at ${agreedPrice}.`);
  } else {
    parts.push("the parties reached a mutual agreement on terms.");
  }
  parts.push(
    `The deal covers ${dealTitle.toLowerCase()} and addresses key requirements from both sides.`,
  );
  return parts.join(" ");
}

export function extractDealSummary(
  dealTitle: string,
  agentA: NegotiationAgentConfig,
  agentB: NegotiationAgentConfig,
  messages: NegotiationMessage[],
): DealSummary {
  const agreedPrice = inferAgreedPrice(messages, agentA, agentB);
  const terms = buildTermsFromConfig(agentA, agentB, messages);
  const summary = buildSummaryText(
    dealTitle,
    agreedPrice,
    agentA,
    agentB,
    messages.length,
  );

  return {
    title: dealTitle,
    agreedPrice,
    terms,
    summary,
    generatedAt: new Date().toISOString(),
  };
}
