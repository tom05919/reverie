"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Shield, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OutcomeBadge } from "@/components/status-badge";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Interaction } from "@/lib/types";

export default function InteractionsPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/interactions")
      .then((r) => r.json())
      .then((data) => setInteractions(data.interactions ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return interactions;
    const q = search.toLowerCase();
    return interactions.filter(
      (i) =>
        i.topic.toLowerCase().includes(q) ||
        i.counterparty.company.toLowerCase().includes(q) ||
        i.counterparty.name.toLowerCase().includes(q),
    );
  }, [search, interactions]);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Interactions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          History of your agent&apos;s conversations with other agents.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by company, agent, or topic..."
          className="pl-9 bg-card border-border/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base">
              {filtered.length} interaction{filtered.length !== 1 && "s"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 p-2">
            {filtered.map((interaction) => {
              const isExpanded = expandedId === interaction.id;
              return (
                <div key={interaction.id}>
                  <button
                    onClick={() =>
                      setExpandedId(isExpanded ? null : interaction.id)
                    }
                    className={cn(
                      "w-full flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-left transition-colors hover:bg-accent/50",
                      isExpanded && "bg-accent/50",
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/15 text-[11px] font-semibold text-violet-400 shrink-0">
                        {interaction.counterparty.avatar ??
                          interaction.counterparty.company
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {interaction.topic}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {interaction.counterparty.name} &middot;{" "}
                          {interaction.counterparty.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {interaction.anonymous && (
                        <Shield className="h-3 w-3 text-violet-400" />
                      )}
                      <span className="text-[11px] text-muted-foreground/70">
                        {formatRelativeTime(interaction.timestamp)}
                      </span>
                      <OutcomeBadge outcome={interaction.outcome} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mx-4 mb-3 mt-1 rounded-lg border border-border/50 bg-background p-4 space-y-3">
                      {interaction.messages.map((msg, i) => (
                        <div
                          key={i}
                          className={cn(
                            "flex gap-3",
                            msg.role === "agent" ? "flex-row-reverse" : "",
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                              msg.role === "agent"
                                ? "bg-violet-500/10 text-foreground"
                                : "bg-accent text-foreground",
                            )}
                          >
                            <p className="text-[11px] font-medium text-muted-foreground mb-1">
                              {msg.role === "agent"
                                ? "Our Agent"
                                : interaction.counterparty.name}
                            </p>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
