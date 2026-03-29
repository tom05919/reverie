"use client";

import { Radio, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { liveNegotiations } from "@/lib/mock-data";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function LivePage() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-6 py-4">
        <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
        <div>
          <h1 className="text-lg font-semibold">Live Negotiations</h1>
          <p className="text-xs text-muted-foreground">
            Observe all agent-to-agent negotiations in real time.
          </p>
        </div>
      </div>

      {/* Multi-conversation grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {liveNegotiations.map((negotiation) => (
            <Card
              key={negotiation.id}
              className="flex flex-col border-border/50 overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-border/50 shrink-0">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-sm font-semibold truncate">
                    {negotiation.dealTitle}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    vs {negotiation.counterparty.company} &middot;{" "}
                    {negotiation.counterparty.name}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[11px] shrink-0 ml-3",
                    negotiation.status === "active"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/15 text-amber-400 border-amber-500/20"
                  )}
                >
                  {negotiation.status === "active" ? "Live" : "Paused"}
                </Badge>
              </CardHeader>

              <ScrollArea className="flex-1">
                <CardContent className="p-4 space-y-3">
                  {negotiation.anonymous && (
                    <div className="flex items-center gap-1.5 rounded-md border border-violet-500/20 bg-violet-500/5 px-2.5 py-1.5">
                      <Shield className="h-3 w-3 text-violet-400 shrink-0" />
                      <p className="text-[10px] text-violet-400/90">
                        Your identity is hidden from this party
                      </p>
                    </div>
                  )}
                  {negotiation.messages.map((msg) => {
                    const isOurs = msg.sender === "our_agent";
                    const displayName =
                      isOurs && negotiation.anonymous
                        ? "Anonymous Agent"
                        : msg.senderName;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          isOurs ? "justify-end" : "justify-start"
                        )}
                      >
                        <div className="max-w-[80%] space-y-0.5">
                          <p
                            className={cn(
                              "text-[10px] font-medium",
                              isOurs
                                ? "text-right text-violet-400"
                                : "text-blue-400"
                            )}
                          >
                            {displayName}
                          </p>
                          <div
                            className={cn(
                              "rounded-xl px-3 py-2 text-xs leading-relaxed",
                              isOurs
                                ? "bg-violet-600/20 border border-violet-500/20 rounded-br-sm"
                                : "bg-blue-600/10 border border-blue-500/15 rounded-bl-sm"
                            )}
                          >
                            {msg.content}
                          </div>
                          <p
                            className={cn(
                              "text-[9px] text-muted-foreground/50",
                              isOurs ? "text-right" : ""
                            )}
                          >
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing indicator */}
                  {negotiation.status === "active" && (
                    <div className="flex justify-start">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-medium text-blue-400">
                          {negotiation.counterparty.name}
                        </p>
                        <div className="rounded-xl rounded-bl-sm bg-blue-600/10 border border-blue-500/15 px-3 py-2">
                          <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400/40 animate-bounce [animation-delay:0ms]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400/40 animate-bounce [animation-delay:150ms]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400/40 animate-bounce [animation-delay:300ms]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          ))}
        </div>

        {/* Read-only notice */}
        <div className="mt-6 rounded-lg border border-border/50 bg-card px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            You&apos;re observing negotiations in read-only mode. Use the{" "}
            <span className="text-violet-400 font-medium">Chat</span> page to
            give your agent new instructions.
          </p>
        </div>
      </div>
    </div>
  );
}
