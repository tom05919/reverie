import { NextResponse } from "next/server";
import { getSession } from "@/lib/negotiation/sessions";
import { executeNextTurn } from "@/lib/negotiation/orchestrator";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = getSession(id);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status !== "active") {
    return NextResponse.json(
      { error: `Session is ${session.status}, cannot step` },
      { status: 409 },
    );
  }

  const message = await executeNextTurn(id);

  if (!message) {
    return NextResponse.json(
      { error: "Could not advance negotiation" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message,
    status: session.status,
    turn: session.turn,
    messageCount: session.messages.length,
  });
}
