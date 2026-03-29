import { NextResponse } from "next/server";
import { getSession, setApproval } from "@/lib/negotiation/sessions";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = getSession(id);

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status !== "completed" || session.outcome !== "agreed") {
    return NextResponse.json(
      { error: "Can only approve/reject a completed deal" },
      { status: 409 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const action = body.action as string;

  if (action !== "approved" && action !== "rejected") {
    return NextResponse.json(
      { error: "action must be 'approved' or 'rejected'" },
      { status: 400 },
    );
  }

  setApproval(id, action);

  return NextResponse.json({
    approval: action,
    dealSummary: session.dealSummary,
  });
}
