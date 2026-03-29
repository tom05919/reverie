import { NextResponse } from "next/server";
import {
  createSession,
  listSessions,
  sessionToLiveNegotiation,
} from "@/lib/negotiation/sessions";
import { getScenario, listScenarios } from "@/lib/negotiation/scenarios";
import { generateScenarioFromPrompt } from "@/lib/negotiation/generate-scenario";
import type { NegotiationScenario } from "@/lib/types";

export async function GET() {
  const sessions = listSessions();
  return NextResponse.json({
    sessions: sessions.map(sessionToLiveNegotiation),
    scenarios: listScenarios(),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const scenarioId = body.scenario as string | undefined;
  const prompt = body.prompt as string | undefined;

  if (!scenarioId && !prompt) {
    return NextResponse.json(
      {
        error:
          "Provide either 'scenario' (preset ID) or 'prompt' (describe the deal you want).",
        available: listScenarios(),
      },
      { status: 400 },
    );
  }

  let scenario: NegotiationScenario;

  if (scenarioId) {
    const found = getScenario(scenarioId);
    if (!found) {
      return NextResponse.json(
        { error: `Unknown scenario: ${scenarioId}`, available: listScenarios() },
        { status: 400 },
      );
    }
    scenario = found;
  } else {
    scenario = generateScenarioFromPrompt(prompt!);
  }

  const session = createSession({
    dealTitle: scenario.title,
    agentA: { config: scenario.agentA, name: scenario.agentA.agentName },
    agentB: { config: scenario.agentB, name: scenario.agentB.agentName },
    maxTurns: body.maxTurns ?? 20,
    anonymous: scenario.anonymous,
  });

  return NextResponse.json(sessionToLiveNegotiation(session), { status: 201 });
}
