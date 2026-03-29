import type { NegotiationAgentConfig, NegotiationMessage } from "@/lib/types";

type Phase = "opening" | "exploration" | "counter" | "concession" | "closing";

function getPhase(turnIndex: number, maxTurns: number): Phase {
  const ratio = turnIndex / maxTurns;
  if (turnIndex === 0) return "opening";
  if (ratio < 0.25) return "exploration";
  if (ratio < 0.55) return "counter";
  if (ratio < 0.8) return "concession";
  return "closing";
}

function formatPrice(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getAnchorPrice(config: NegotiationAgentConfig): string | null {
  if (config.role === "seller" && config.constraints.priceFloor != null) {
    const aggressive = config.constraints.priceFloor * 1.3;
    return formatPrice(aggressive);
  }
  if (config.role === "buyer" && config.constraints.priceCeiling != null) {
    const aggressive = config.constraints.priceCeiling * 0.75;
    return formatPrice(aggressive);
  }
  return null;
}

function getMidPrice(config: NegotiationAgentConfig): string | null {
  if (config.role === "seller" && config.constraints.priceFloor != null) {
    return formatPrice(config.constraints.priceFloor * 1.12);
  }
  if (config.role === "buyer" && config.constraints.priceCeiling != null) {
    return formatPrice(config.constraints.priceCeiling * 0.9);
  }
  return null;
}

function getFinalPrice(config: NegotiationAgentConfig): string | null {
  if (config.role === "seller" && config.constraints.priceFloor != null) {
    return formatPrice(config.constraints.priceFloor * 1.05);
  }
  if (config.role === "buyer" && config.constraints.priceCeiling != null) {
    return formatPrice(config.constraints.priceCeiling * 0.97);
  }
  return null;
}

function buildOpening(config: NegotiationAgentConfig): string {
  const price = getAnchorPrice(config);
  const objective = config.objectives[0] ?? "reach favorable terms";
  const mustHave = config.constraints.mustHaves[0];

  if (config.role === "seller") {
    const templates = [
      `Thank you for taking the time to discuss this. Based on our assessment of the scope and value we're bringing to the table, we'd like to propose an initial price point of ${price ?? "a competitive rate"}. ${mustHave ? `We consider ${mustHave.toLowerCase()} to be essential for this arrangement.` : `Our goal is to ${objective.toLowerCase()}.`}`,
      `Good to connect on this. We've put together what we believe is a strong offer at ${price ?? "market-competitive pricing"}. This reflects the full value of our solution, including implementation support. ${mustHave ? `One thing that's non-negotiable for us: ${mustHave.toLowerCase()}.` : ""}`,
      `Let me start by outlining our position. We're looking at ${price ?? "a price point that reflects the quality of our offering"} for this engagement. We've factored in the level of service and customization your team requires. ${config.objectives[1] ? `We'd also like to discuss ${config.objectives[1].toLowerCase()}.` : ""}`,
    ];
    return pickRandom(templates);
  }

  const templates = [
    `Appreciate the opportunity to discuss this. We've done our market research and are prepared to move quickly at the right price. We're targeting ${price ?? "a price that fits our budget"} for this scope. ${mustHave ? `On our end, ${mustHave.toLowerCase()} is a hard requirement.` : `Our priority is to ${objective.toLowerCase()}.`}`,
    `Thanks for getting this started. We're very interested in moving forward, but pricing needs to work for both sides. Our initial thinking is around ${price ?? "a competitive number"}. ${mustHave ? `We need to ensure ${mustHave.toLowerCase()}.` : "We're flexible on structure if the economics work."}`,
    `Let's get into it. We have budget allocated for this but need to stay disciplined. We're thinking ${price ?? "something in a range that works for our procurement cycle"}. ${config.objectives[1] ? `We also need to address ${config.objectives[1].toLowerCase()}.` : "Happy to discuss terms in detail."}`,
  ];
  return pickRandom(templates);
}

function buildExploration(
  config: NegotiationAgentConfig,
  lastMessage: string,
): string {
  const mustHave = config.constraints.mustHaves[0];
  const secondObjective = config.objectives[1] ?? config.objectives[0];

  const templates = [
    `I hear your position. Before we get deeper into pricing, I'd like to understand your requirements around ${secondObjective.toLowerCase()}. ${mustHave ? `From our side, ${mustHave.toLowerCase()} is something we need to lock down early.` : "This could affect the overall structure of the deal."}`,
    `That's a reasonable starting point for discussion. Let me push back a bit though — ${pickRandom(["the market rates we've seen suggest a different range", "we need to factor in the full scope of deliverables", "there are some variables that could shift the economics"])}. Can you walk me through how you arrived at that number?`,
    `Understood. I want to make sure we're aligned on scope before we finalize numbers. ${secondObjective ? `Specifically, ${secondObjective.toLowerCase()} — how are you thinking about that?` : "What's your timeline looking like?"} ${mustHave ? `Also, ${mustHave.toLowerCase()} is critical for us.` : ""}`,
    `I appreciate the transparency. Let me share some context from our side: ${config.dealContext.split(".")[0].toLowerCase()}. That's why ${secondObjective.toLowerCase()} matters so much to us. How flexible are you on the non-price terms?`,
  ];
  return pickRandom(templates);
}

function buildCounter(
  config: NegotiationAgentConfig,
  _lastMessage: string,
): string {
  const midPrice = getMidPrice(config);
  const mustHave =
    config.constraints.mustHaves[Math.floor(Math.random() * config.constraints.mustHaves.length)];

  if (config.style === "aggressive") {
    const templates = [
      `I've reviewed your proposal carefully, and frankly the numbers don't work for us at that level. We can do ${midPrice ?? "something closer to our target"}, but that's contingent on ${mustHave ? mustHave.toLowerCase() : "favorable payment terms"}. This is a significant commitment on our part.`,
      `Let me be direct — we're apart on price. My counter is ${midPrice ?? "a number that better reflects fair market value"}. ${mustHave ? `And ${mustHave.toLowerCase()} isn't something we'll compromise on.` : "We need to see movement from your side to justify this deal internally."}`,
    ];
    return pickRandom(templates);
  }

  if (config.style === "collaborative") {
    const templates = [
      `I think there's a path forward here. What if we adjusted to ${midPrice ?? "a middle ground on pricing"} and structured the ${mustHave ? mustHave.toLowerCase() : "terms"} in a way that works for both sides? I'm trying to find a creative solution rather than just splitting the difference.`,
      `I appreciate your flexibility so far. From our side, ${midPrice ?? "our revised number"} would be a strong fit. ${mustHave ? `If we can align on ${mustHave.toLowerCase()}, ` : "If we can structure this right, "}I think we're close to something both teams can champion internally.`,
    ];
    return pickRandom(templates);
  }

  const templates = [
    `Taking into account what we've discussed, I'd like to propose ${midPrice ?? "an adjusted figure"}. This reflects a fair balance given the scope. ${mustHave ? `On ${mustHave.toLowerCase()} — that's a firm requirement for us, but I'm open to creative structuring elsewhere.` : "I'm open to discussing timeline and payment terms."}`,
    `Here's where I'd like to land: ${midPrice ?? "a number that accounts for both sides' needs"}. I believe this is competitive and fair. ${mustHave ? `We do need ${mustHave.toLowerCase()} — ` : ""}Can you work with this, or should we explore bundling additional value?`,
  ];
  return pickRandom(templates);
}

function buildConcession(
  config: NegotiationAgentConfig,
  _lastMessage: string,
): string {
  const finalPrice = getFinalPrice(config);
  const concedable = config.constraints.mustHaves[config.constraints.mustHaves.length - 1];

  const templates = [
    `I've gone back to my team on this. We can move to ${finalPrice ?? "our best and final position"}. ${concedable ? `We're also willing to be flexible on ${concedable.toLowerCase()} if that helps close the gap.` : "This is very close to our limit, but I want to make this work."} I think we're close — can you meet us here?`,
    `In the interest of reaching an agreement, I'm prepared to adjust to ${finalPrice ?? "a more competitive position"}. This required internal approval and represents real movement from our side. ${concedable ? `I can also work with you on ${concedable.toLowerCase()}.` : "What do you need to get this across the line?"}`,
    `I want to find a way to get this done. ${finalPrice ?? "Our revised offer"} is where I can land. ${concedable ? `I'm also willing to concede on ${concedable.toLowerCase()} — ` : ""}I hope that demonstrates our commitment. Are we in the same ballpark now?`,
  ];
  return pickRandom(templates);
}

function buildClosing(
  config: NegotiationAgentConfig,
  turnIndex: number,
  maxTurns: number,
): string {
  const finalPrice = getFinalPrice(config);
  const isLastTurns = maxTurns - turnIndex <= 2;

  if (isLastTurns) {
    return `I believe we've found solid common ground. At ${finalPrice ?? "the terms we've been discussing"}, with the conditions we've outlined, I believe we have a deal. Let me summarize: ${config.objectives.slice(0, 2).map((o) => o.toLowerCase()).join(", and ")}. Shall we move to formalize this?`;
  }

  const templates = [
    `We're very close. If you can confirm ${finalPrice ?? "the pricing we discussed"} with the terms on the table, I think we have a deal. I'm ready to move to documentation.`,
    `I think the framework we've built works for both sides. ${finalPrice ?? "At this price point"}, combined with what we've agreed on, this is a strong outcome. I believe we have a deal — let's put pen to paper.`,
    `Looking at where we've landed, I'm comfortable saying this works. ${finalPrice ?? "The economics"} make sense, and the terms address our key requirements. I believe we have a deal.`,
  ];
  return pickRandom(templates);
}

export function generateSimulatedMessage(
  config: NegotiationAgentConfig,
  turnIndex: number,
  maxTurns: number,
  lastMessage: string,
): string {
  const phase = getPhase(turnIndex, maxTurns);

  switch (phase) {
    case "opening":
      return buildOpening(config);
    case "exploration":
      return buildExploration(config, lastMessage);
    case "counter":
      return buildCounter(config, lastMessage);
    case "concession":
      return buildConcession(config, lastMessage);
    case "closing":
      return buildClosing(config, turnIndex, maxTurns);
  }
}
