import { NextResponse } from "next/server";
import { deals as mockDeals } from "@/lib/mock-data";
import { getDealsFromSessions } from "@/lib/negotiation/bridge";

export async function GET() {
  const realDeals = getDealsFromSessions();
  const allDeals = [...realDeals, ...mockDeals];

  allDeals.sort(
    (a, b) =>
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime(),
  );

  return NextResponse.json({ deals: allDeals });
}
