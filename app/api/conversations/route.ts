import { NextResponse } from "next/server";
import { liveNegotiations } from "@/lib/mock-data";
import {
  listSessions,
  sessionToLiveNegotiation,
} from "@/lib/negotiation/sessions";

export async function GET() {
  const liveSessions = listSessions().map(sessionToLiveNegotiation);

  // Merge real sessions with mock data for backwards compatibility.
  // Real sessions appear first; mock data fills in when no real sessions exist.
  const combined =
    liveSessions.length > 0
      ? [...liveSessions, ...liveNegotiations]
      : liveNegotiations;

  return NextResponse.json(combined);
}
