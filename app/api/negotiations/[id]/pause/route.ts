import { NextResponse } from "next/server";
import { getSession, updateStatus } from "@/lib/negotiation/sessions";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = getSession(id);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === "active") {
    updateStatus(id, "paused");
    return NextResponse.json({ status: "paused" });
  }

  if (session.status === "paused") {
    updateStatus(id, "active");
    return NextResponse.json({ status: "active" });
  }

  return NextResponse.json(
    { error: `Session is ${session.status}, cannot toggle pause` },
    { status: 409 },
  );
}
