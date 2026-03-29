import { NextResponse } from "next/server";
import { getSession } from "@/lib/negotiation/sessions";
import { runNegotiation, isRunning } from "@/lib/negotiation/orchestrator";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = getSession(id);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status !== "active") {
    return NextResponse.json(
      { error: `Session is ${session.status}, cannot run` },
      { status: 409 },
    );
  }

  if (isRunning(id)) {
    return NextResponse.json(
      { error: "Negotiation is already running" },
      { status: 409 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const delayMs = (body as { delayMs?: number }).delayMs ?? 3000;

  // Fire and forget -- progress is streamed via SSE
  runNegotiation(id, { delayMs });

  return NextResponse.json({
    status: "running",
    sessionId: id,
    streamUrl: `/api/negotiations/${id}/stream`,
  });
}
