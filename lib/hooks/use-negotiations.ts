"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  LiveNegotiation,
  NegotiationMessage,
  DealSummary,
  DealApproval,
} from "@/lib/types";

interface Scenario {
  id: string;
  title: string;
  description: string;
}

interface NegotiationsState {
  sessions: LiveNegotiation[];
  scenarios: Scenario[];
  loading: boolean;
  error: string | null;
}

export function useNegotiations() {
  const [state, setState] = useState<NegotiationsState>({
    sessions: [],
    scenarios: [],
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/negotiations");
      if (!res.ok) throw new Error("Failed to fetch negotiations");
      const data = await res.json();
      setState((prev) => ({
        ...prev,
        sessions: data.sessions,
        scenarios: data.scenarios,
        loading: false,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createSession = useCallback(
    async (scenarioId: string): Promise<LiveNegotiation | null> => {
      try {
        const res = await fetch("/api/negotiations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scenario: scenarioId }),
        });
        if (!res.ok) throw new Error("Failed to create session");
        const session: LiveNegotiation = await res.json();
        setState((prev) => ({
          ...prev,
          sessions: [session, ...prev.sessions],
        }));
        return session;
      } catch {
        return null;
      }
    },
    [],
  );

  const createFromPrompt = useCallback(
    async (prompt: string): Promise<LiveNegotiation | null> => {
      try {
        const res = await fetch("/api/negotiations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to create session");
        }
        const session: LiveNegotiation = await res.json();
        setState((prev) => ({
          ...prev,
          sessions: [session, ...prev.sessions],
        }));
        return session;
      } catch (err) {
        throw err instanceof Error ? err : new Error("Unknown error");
      }
    },
    [],
  );

  return { ...state, refresh, createSession, createFromPrompt };
}

type SessionStatus = "active" | "paused" | "completed";
type NegotiationOutcome = "agreed" | "stalemate" | null;

export function useNegotiationStream(sessionId: string | null) {
  const [messages, setMessages] = useState<NegotiationMessage[]>([]);
  const [status, setStatus] = useState<SessionStatus>("active");
  const [outcome, setOutcome] = useState<NegotiationOutcome>(null);
  const [dealSummary, setDealSummary] = useState<DealSummary | null>(null);
  const [approval, setApproval] = useState<DealApproval>("pending");
  const [connected, setConnected] = useState(false);
  const statusRef = useRef(status);
  statusRef.current = status;
  const hasReceivedStatus = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    setMessages([]);
    setConnected(false);
    setOutcome(null);
    setDealSummary(null);
    setApproval("pending");
    hasReceivedStatus.current = false;

    const es = new EventSource(`/api/negotiations/${sessionId}/stream`);
    eventSourceRef.current = es;

    es.addEventListener("init", (e) => {
      const data = JSON.parse(e.data);
      setStatus(data.status);
      if (data.outcome) setOutcome(data.outcome);
      if (data.dealSummary) setDealSummary(data.dealSummary);
      if (data.approval) setApproval(data.approval);
      hasReceivedStatus.current = true;
      setConnected(true);
    });

    es.addEventListener("message", (e) => {
      const msg: NegotiationMessage = JSON.parse(e.data);
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    });

    es.addEventListener("status", (e) => {
      const data = JSON.parse(e.data);
      setStatus(data.status);
      hasReceivedStatus.current = true;
    });

    es.addEventListener("complete", (e) => {
      const data = JSON.parse(e.data);
      setStatus("completed");
      setOutcome(data.outcome);
      if (data.dealSummary) setDealSummary(data.dealSummary);
      hasReceivedStatus.current = true;
    });

    es.addEventListener("approval", (e) => {
      const data = JSON.parse(e.data);
      setApproval(data.approval);
    });

    es.addEventListener("turn", () => {});

    es.onerror = () => {
      setConnected(false);
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [sessionId]);

  const step = useCallback(async () => {
    if (!sessionId || statusRef.current !== "active") return;
    const res = await fetch(`/api/negotiations/${sessionId}/step`, {
      method: "POST",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      if (data.error) console.warn("Step:", data.error);
    }
  }, [sessionId]);

  const run = useCallback(
    async (delayMs = 3000) => {
      if (!sessionId || statusRef.current !== "active") return;
      const res = await fetch(`/api/negotiations/${sessionId}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delayMs }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error) console.warn("Run:", data.error);
      }
    },
    [sessionId],
  );

  const togglePause = useCallback(async () => {
    if (!sessionId) return;
    const res = await fetch(`/api/negotiations/${sessionId}/pause`, {
      method: "POST",
    });
    if (res.ok) {
      const data = await res.json();
      setStatus(data.status);
      hasReceivedStatus.current = true;
    }
  }, [sessionId]);

  const approveDeal = useCallback(async () => {
    if (!sessionId) return;
    const res = await fetch(`/api/negotiations/${sessionId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approved" }),
    });
    if (res.ok) {
      setApproval("approved");
    }
  }, [sessionId]);

  const rejectDeal = useCallback(async () => {
    if (!sessionId) return;
    const res = await fetch(`/api/negotiations/${sessionId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rejected" }),
    });
    if (res.ok) {
      setApproval("rejected");
    }
  }, [sessionId]);

  return {
    messages,
    status,
    outcome,
    dealSummary,
    approval,
    connected,
    hasReceivedStatus: hasReceivedStatus.current,
    step,
    run,
    togglePause,
    approveDeal,
    rejectDeal,
  };
}
