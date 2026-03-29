import type { NegotiationMessage } from "@/lib/types";

export type NegotiationOutcome = "agreed" | "stalemate" | "ongoing";

const AGREEMENT_PATTERNS = [
  /\bwe have a deal\b/i,
  /\bdeal is agreed\b/i,
  /\blet'?s finalize\b/i,
  /\bagreed on all terms\b/i,
  /\baccept (these|the|your|this) terms?\b/i,
  /\bterms are acceptable\b/i,
  /\bwe('re| are) in agreement\b/i,
  /\bI believe we have a deal\b/i,
  /\bmove to (formalize|documentation|paperwork)\b/i,
  /\bput pen to paper\b/i,
  /\bready to sign\b/i,
];

const WALKAWAY_PATTERNS = [
  /\bcannot (proceed|continue|accept)\b/i,
  /\bdeal (is off|cannot work|won'?t work)\b/i,
  /\bwalk(ing)? away\b/i,
  /\bwithdraw(ing)? (from|our)\b/i,
  /\bunable to reach\b/i,
  /\bfundamentally incompatible\b/i,
];

/**
 * Heuristic-only completion detection using pattern matching.
 */
export async function detectCompletion(
  messages: NegotiationMessage[],
): Promise<NegotiationOutcome> {
  if (messages.length < 2) return "ongoing";

  const last3 = messages.slice(-3).map((m) => m.content);

  for (const text of last3) {
    if (AGREEMENT_PATTERNS.some((p) => p.test(text))) return "agreed";
    if (WALKAWAY_PATTERNS.some((p) => p.test(text))) return "stalemate";
  }

  return "ongoing";
}
