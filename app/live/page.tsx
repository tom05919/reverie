"use client";

import { useState } from "react";
import { Radio, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { liveNegotiations } from "@/lib/mock-data";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function LivePage() {
  const [selectedId, setSelectedId] = useState(liveNegotiations[0]?.id ?? "");
  const selected = liveNegotiations.find((n) => n.id === selectedId);

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          <div>
            <h1 className="text-lg font-semibold">Live Negotiations</h1>
            <p className="text-xs text-muted-foreground">
              Observe agent-to-agent negotiations in real time.
            </p>
          </div>
        </div>

        {/* Negotiation selector */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border/50 bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
              <span className="max-w-[200px] truncate">
                {selected?.dealTitle ?? "Select negotiation"}
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            {liveNegotiations.map((neg) => (
              <DropdownMenuItem
                key={neg.id}
                onClick={() => setSelectedId(neg.id)}
                className="flex items-center justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {neg.dealTitle}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    vs {neg.counterparty.company}
                  </p>
                </div>
                {neg.status === "active" && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0 ml-2" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Conversation */}
      {selected ? (
        <ScrollArea className="flex-1 px-6">
          <div className="mx-auto max-w-3xl py-6">
            {/* Negotiation info */}
            <Card className="mb-6 border-border/50">
              <CardContent className="flex items-center justify-between py-3 px-4">
                <div>
                  <p className="text-sm font-semibold">{selected.dealTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {selected.counterparty.company} &middot; Agent:{" "}
                    {selected.counterparty.name}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[11px]",
                    selected.status === "active"
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/15 text-amber-400 border-amber-500/20"
                  )}
                >
                  {selected.status === "active" ? "Live" : "Paused"}
                </Badge>
              </CardContent>
            </Card>

            {/* Messages */}
            <div className="space-y-4">
              {selected.messages.map((msg) => {
                const isOurs = msg.sender === "our_agent";
                return (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      isOurs ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className="max-w-[75%] space-y-1">
                      <p
                        className={cn(
                          "text-[11px] font-medium",
                          isOurs ? "text-right text-violet-400" : "text-blue-400"
                        )}
                      >
                        {msg.senderName}
                      </p>
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          isOurs
                            ? "bg-violet-600/20 border border-violet-500/20 rounded-br-md"
                            : "bg-blue-600/10 border border-blue-500/15 rounded-bl-md"
                        )}
                      >
                        {msg.content}
                      </div>
                      <p
                        className={cn(
                          "text-[10px] text-muted-foreground/60",
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
              {selected.status === "active" && (
                <div className="flex justify-start">
                  <div className="space-y-1">
                    <p className="text-[11px] font-medium text-blue-400">
                      {selected.counterparty.name} ({selected.counterparty.company})
                    </p>
                    <div className="rounded-2xl rounded-bl-md bg-blue-600/10 border border-blue-500/15 px-4 py-3">
                      <div className="flex gap-1">
                        <span className="h-2 w-2 rounded-full bg-blue-400/40 animate-bounce [animation-delay:0ms]" />
                        <span className="h-2 w-2 rounded-full bg-blue-400/40 animate-bounce [animation-delay:150ms]" />
                        <span className="h-2 w-2 rounded-full bg-blue-400/40 animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Read-only notice */}
            <div className="mt-8 rounded-lg border border-border/50 bg-card px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                You&apos;re observing this negotiation in read-only mode. Use the{" "}
                <span className="text-violet-400 font-medium">Chat</span> page
                to give your agent new instructions.
              </p>
            </div>
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground">
            No active negotiations at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
