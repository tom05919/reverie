import {
  getSession,
  addListener,
  removeListener,
} from "@/lib/negotiation/sessions";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const session = getSession(id);

  if (!session) {
    return new Response("Session not found", { status: 404 });
  }

  let controllerRef: ReadableStreamDefaultController | null = null;

  const stream = new ReadableStream({
    start(controller) {
      controllerRef = controller;
      addListener(id, controller);

      // Send current state as initial payload
      const init = JSON.stringify({
        sessionId: session.id,
        status: session.status,
        outcome: session.outcome ?? undefined,
        dealSummary: session.dealSummary ?? undefined,
        approval: session.approval,
        turn: session.turn,
        messageCount: session.messages.length,
      });
      controller.enqueue(
        new TextEncoder().encode(`event: init\ndata: ${init}\n\n`),
      );

      // Send existing messages so the client can catch up
      for (const msg of session.messages) {
        controller.enqueue(
          new TextEncoder().encode(
            `event: message\ndata: ${JSON.stringify(msg)}\n\n`,
          ),
        );
      }
    },
    cancel() {
      if (controllerRef) {
        removeListener(id, controllerRef);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
