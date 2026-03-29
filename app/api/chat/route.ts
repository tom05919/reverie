import { NextResponse } from "next/server";
import { chatMessages } from "@/lib/mock-data";

export async function GET() {
  return NextResponse.json(chatMessages);
}

export async function POST(request: Request) {
  const body = await request.json();
  const userMessage = body.message as string;

  const responses: Record<string, string> = {
    default:
      "I'm actively monitoring all negotiations. The Acme deal is the highest priority right now — I'll keep you posted on any movement.",
    status:
      "Currently managing 3 active negotiations: Acme Cloud Infrastructure (negotiating), GlobalSupply Components (exploring), and Quantum Dynamics Pipeline (negotiating). The TechVentures partnership is ready for your approval.",
    acme: "The Acme deal is at a critical point. They've set a $2.0M ceiling, but I've proposed a graduated pricing model starting at $2.1M. I'm confident we can close between $2.1–2.3M with the SLA concession you authorized.",
  };

  let responseContent = responses.default;
  const lower = userMessage.toLowerCase();
  if (lower.includes("status") || lower.includes("update"))
    responseContent = responses.status;
  if (lower.includes("acme")) responseContent = responses.acme;

  return NextResponse.json({
    id: `c${Date.now()}`,
    role: "agent",
    content: responseContent,
    timestamp: new Date().toISOString(),
  });
}
