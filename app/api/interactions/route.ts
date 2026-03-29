import { NextResponse } from "next/server";
import { interactions as mockInteractions } from "@/lib/mock-data";
import { getInteractionsFromSessions } from "@/lib/negotiation/bridge";

export async function GET() {
  const realInteractions = getInteractionsFromSessions();
  const all = [...realInteractions, ...mockInteractions];

  all.sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return NextResponse.json({ interactions: all });
}
