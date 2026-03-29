"use client";

import { useState, useRef, useEffect } from "react";
import {
  Radio,
  Shield,
  Plus,
  Play,
  Pause,
  SkipForward,
  Zap,
  Loader2,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  FileText,
  DollarSign,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  useNegotiations,
  useNegotiationStream,
} from "@/lib/hooks/use-negotiations";
import type { LiveNegotiation, DealSummary, DealApproval } from "@/lib/types";

function DealReviewPanel({
  summary,
  approval,
  counterpartyName,
  termsExpanded,
  onToggleTerms,
  onApprove,
  onReject,
}: {
  summary: DealSummary | null;
  approval: DealApproval;
  counterpartyName: string;
  termsExpanded: boolean;
  onToggleTerms: () => void;
  onApprove: () => void;
  onReject: () => void;
}) {
  if (!summary) {
    return (
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <p className="text-xs font-medium text-emerald-400">
            Agents reached a deal
          </p>
        </div>
      </div>
    );
  }

  const isDecided = approval === "approved" || approval === "rejected";

  return (
    <div className="divide-y divide-border/50">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-2">
        <FileText className="h-4 w-4 text-emerald-400 shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-emerald-400">
            Deal Terms for Review
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Negotiated with {counterpartyName}
          </p>
        </div>
        {approval === "approved" && (
          <Badge className="text-[10px] bg-emerald-500/15 text-emerald-400 border-emerald-500/20">
            Approved
          </Badge>
        )}
        {approval === "rejected" && (
          <Badge className="text-[10px] bg-red-500/15 text-red-400 border-red-500/20">
            Rejected
          </Badge>
        )}
      </div>

      {/* Price highlight */}
      {summary.agreedPrice && (
        <div className="px-4 py-2.5 bg-emerald-500/3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="text-[10px] text-muted-foreground">
              Agreed Price
            </span>
            <span className="text-sm font-bold text-emerald-400 ml-auto">
              {summary.agreedPrice}
            </span>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="px-4 py-2.5">
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {summary.summary}
        </p>
      </div>

      {/* Collapsible terms */}
      <div>
        <button
          onClick={onToggleTerms}
          className="w-full px-4 py-2 flex items-center gap-2 text-left hover:bg-muted/30 transition-colors"
        >
          <Users className="h-3.5 w-3.5 text-violet-400 shrink-0" />
          <span className="text-[11px] font-medium flex-1">
            Terms &amp; Conditions ({summary.terms.length})
          </span>
          {termsExpanded ? (
            <ChevronUp className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          )}
        </button>
        {termsExpanded && (
          <div className="px-4 pb-3 space-y-1.5">
            {summary.terms.map((term, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 rounded-md border border-border/40 px-2.5 py-1.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full shrink-0",
                      term.party === "mutual" && "bg-emerald-400",
                      term.party === "our_agent" && "bg-violet-400",
                      term.party === "their_agent" && "bg-blue-400",
                    )}
                  />
                  <span className="text-[11px] text-foreground truncate">
                    {term.label}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {term.value}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] text-muted-foreground">
                  Mutual
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                <span className="text-[9px] text-muted-foreground">
                  Our requirement
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                <span className="text-[9px] text-muted-foreground">
                  Their requirement
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isDecided ? (
        <div className="px-4 py-3 flex items-center gap-2">
          <Button
            size="sm"
            className="h-8 text-xs gap-1.5 flex-1 bg-emerald-600 hover:bg-emerald-700"
            onClick={onApprove}
          >
            <ThumbsUp className="h-3 w-3" />
            Approve Deal
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
            onClick={onReject}
          >
            <ThumbsDown className="h-3 w-3" />
            Reject
          </Button>
        </div>
      ) : (
        <div className="px-4 py-2.5">
          <p className="text-[10px] text-center text-muted-foreground">
            {approval === "approved"
              ? "You approved this deal. It will be tracked in your deals pipeline."
              : "You rejected this deal. No further action required."}
          </p>
        </div>
      )}
    </div>
  );
}

function NegotiationCard({
  negotiation,
  isSelected,
  onSelect,
  onNewNegotiation,
}: {
  negotiation: LiveNegotiation;
  isSelected: boolean;
  onSelect: () => void;
  onNewNegotiation: () => void;
}) {
  const {
    messages,
    status,
    outcome,
    dealSummary,
    approval,
    connected,
    hasReceivedStatus,
    step,
    run,
    togglePause,
    approveDeal,
    rejectDeal,
  } = useNegotiationStream(negotiation.id);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isStepping, setIsStepping] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(true);

  const displayMessages =
    messages.length > 0 ? messages : negotiation.messages;

  const effectiveStatus = hasReceivedStatus ? status : negotiation.status;
  const effectiveOutcome = outcome ?? negotiation.outcome ?? null;
  const effectiveSummary = dealSummary ?? negotiation.dealSummary ?? null;
  const effectiveApproval = approval ?? negotiation.approval ?? "pending";

  useEffect(() => {
    if (effectiveStatus !== "active") setIsRunning(false);
  }, [effectiveStatus]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayMessages.length]);

  const handleStep = async () => {
    if (effectiveStatus !== "active") return;
    setIsStepping(true);
    await step();
    setTimeout(() => setIsStepping(false), 500);
  };

  const handleRun = async () => {
    if (effectiveStatus !== "active") return;
    setIsRunning(true);
    await run(2500);
  };

  const handlePause = async () => {
    await togglePause();
    setIsRunning(false);
  };

  return (
    <Card
      className={cn(
        "flex flex-col border-border/50 overflow-hidden transition-all",
        isSelected && "ring-1 ring-violet-500/40",
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-border/50 shrink-0">
        <button onClick={onSelect} className="min-w-0 flex-1 text-left">
          <CardTitle className="text-sm font-semibold truncate">
            {negotiation.dealTitle}
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            vs {negotiation.counterparty.company} &middot;{" "}
            {negotiation.counterparty.name}
          </p>
        </button>
        <div className="flex items-center gap-2 ml-3 shrink-0">
          {connected && effectiveStatus === "active" && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          )}
          <Badge
            variant="outline"
            className={cn(
              "text-[11px]",
              effectiveStatus === "active" &&
                "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
              effectiveStatus === "paused" &&
                "bg-amber-500/15 text-amber-400 border-amber-500/20",
              effectiveStatus === "completed" &&
                effectiveOutcome === "agreed" &&
                "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
              effectiveStatus === "completed" &&
                effectiveOutcome === "stalemate" &&
                "bg-red-500/15 text-red-400 border-red-500/20",
            )}
          >
            {effectiveStatus === "active" && "Live"}
            {effectiveStatus === "paused" && "Paused"}
            {effectiveStatus === "completed" &&
              effectiveOutcome === "agreed" &&
              "Deal Reached"}
            {effectiveStatus === "completed" &&
              effectiveOutcome === "stalemate" &&
              "Stalemate"}
            {effectiveStatus === "completed" &&
              !effectiveOutcome &&
              "Completed"}
          </Badge>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 max-h-[400px]">
        <CardContent ref={scrollRef} className="p-4 space-y-3">
          {negotiation.anonymous && (
            <div className="flex items-center gap-1.5 rounded-md border border-violet-500/20 bg-violet-500/5 px-2.5 py-1.5">
              <Shield className="h-3 w-3 text-violet-400 shrink-0" />
              <p className="text-[10px] text-violet-400/90">
                Your identity is hidden from this party
              </p>
            </div>
          )}

          {displayMessages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Sparkles className="h-8 w-8 text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                No messages yet
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Use the controls below to start the negotiation
              </p>
            </div>
          )}

          {displayMessages.map((msg) => {
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
                  isOurs ? "justify-end" : "justify-start",
                )}
              >
                <div className="max-w-[80%] space-y-0.5">
                  <p
                    className={cn(
                      "text-[10px] font-medium",
                      isOurs
                        ? "text-right text-violet-400"
                        : "text-blue-400",
                    )}
                  >
                    {displayName}
                  </p>
                  <div
                    className={cn(
                      "rounded-xl px-3 py-2 text-xs leading-relaxed",
                      isOurs
                        ? "bg-violet-600/20 border border-violet-500/20 rounded-br-sm"
                        : "bg-blue-600/10 border border-blue-500/15 rounded-bl-sm",
                    )}
                  >
                    {msg.content}
                  </div>
                  <p
                    className={cn(
                      "text-[9px] text-muted-foreground/50",
                      isOurs ? "text-right" : "",
                    )}
                  >
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}

          {isRunning && effectiveStatus === "active" && (
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

      {effectiveStatus === "completed" ? (
        <div className="border-t border-border/50">
          {effectiveOutcome === "agreed" ? (
            <DealReviewPanel
              summary={effectiveSummary}
              approval={effectiveApproval}
              counterpartyName={negotiation.counterparty.company}
              termsExpanded={termsExpanded}
              onToggleTerms={() => setTermsExpanded((v) => !v)}
              onApprove={approveDeal}
              onReject={rejectDeal}
            />
          ) : (
            <div className="px-4 py-3 space-y-2.5">
              <div className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/5 px-3 py-2">
                <XCircle className="h-4 w-4 text-red-400 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-red-400">
                    No agreement reached
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    The agents couldn&apos;t find common ground on this deal.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1.5 w-full"
                onClick={onNewNegotiation}
              >
                <RotateCcw className="h-3 w-3" />
                Start New Negotiation
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="border-t border-border/50 px-4 py-2.5 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStep}
            disabled={effectiveStatus !== "active" || isStepping || isRunning}
            className="h-7 text-xs gap-1.5"
          >
            {isStepping ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <SkipForward className="h-3 w-3" />
            )}
            Step
          </Button>

          {isRunning && effectiveStatus === "active" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePause}
              className="h-7 text-xs gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <Pause className="h-3 w-3" />
              Pause
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={effectiveStatus !== "active"}
              className="h-7 text-xs gap-1.5"
            >
              <Play className="h-3 w-3" />
              Auto-run
            </Button>
          )}

          {effectiveStatus === "paused" && !isRunning && (
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                await togglePause();
              }}
              className="h-7 text-xs gap-1.5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Play className="h-3 w-3" />
              Resume
            </Button>
          )}

          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground/60">
              {displayMessages.length} messages
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

function NewNegotiationDialog({
  open,
  onOpenChange,
  scenarios,
  onSelectPreset,
  onSubmitPrompt,
  busy,
  error,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scenarios: { id: string; title: string; description: string }[];
  onSelectPreset: (id: string) => void;
  onSubmitPrompt: (prompt: string) => void;
  busy: boolean;
  error: string | null;
}) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim().length < 10 || busy) return;
    onSubmitPrompt(prompt.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Negotiation</DialogTitle>
          <DialogDescription>
            Describe the contract you want negotiated, or pick a preset scenario.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-1 space-y-3">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. &quot;Negotiate a 12-month SaaS license for 500 seats at under $80/seat with an enterprise support SLA&quot;"
            className="min-h-[80px] resize-none text-sm"
            disabled={busy}
          />
          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}
          <Button
            type="submit"
            disabled={prompt.trim().length < 10 || busy}
            className="w-full gap-2"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating scenario...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate &amp; Start
              </>
            )}
          </Button>
        </form>

        {scenarios.length > 0 && (
          <>
            <div className="flex items-center gap-3 mt-1">
              <Separator className="flex-1" />
              <span className="text-[11px] text-muted-foreground shrink-0">
                or pick a preset
              </span>
              <Separator className="flex-1" />
            </div>

            <div className="space-y-2">
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectPreset(s.id)}
                  disabled={busy}
                  className={cn(
                    "w-full text-left rounded-lg border border-border/50 px-4 py-3",
                    "transition-all hover:border-violet-500/40 hover:bg-violet-500/5",
                    "disabled:opacity-50 disabled:pointer-events-none",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{s.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-1">
                        {s.description}
                      </p>
                    </div>
                    <Zap className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function LivePage() {
  const { sessions, scenarios, loading, createSession, createFromPrompt } =
    useNegotiations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const handleSelectPreset = async (scenarioId: string) => {
    setBusy(true);
    setCreateError(null);
    const session = await createSession(scenarioId);
    setBusy(false);
    if (session) {
      setSelectedId(session.id);
      setDialogOpen(false);
    }
  };

  const handleSubmitPrompt = async (prompt: string) => {
    setBusy(true);
    setCreateError(null);
    try {
      const session = await createFromPrompt(prompt);
      if (session) {
        setSelectedId(session.id);
        setDialogOpen(false);
      }
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to generate scenario",
      );
    } finally {
      setBusy(false);
    }
  };

  const activeSessions = sessions.filter((s) => s.status === "active");
  const pausedSessions = sessions.filter((s) => s.status === "paused");
  const completedSessions = sessions.filter((s) => s.status === "completed");

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          <div>
            <h1 className="text-lg font-semibold">Live Negotiations</h1>
            <p className="text-xs text-muted-foreground">
              Launch and observe agent-to-agent negotiations in real time.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {sessions.length > 0 && (
            <div className="flex items-center gap-2 mr-2">
              {activeSessions.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-[11px] bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                >
                  {activeSessions.length} active
                </Badge>
              )}
              {pausedSessions.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-[11px] bg-amber-500/15 text-amber-400 border-amber-500/20"
                >
                  {pausedSessions.length} paused
                </Badge>
              )}
              {completedSessions.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-[11px] bg-blue-500/15 text-blue-400 border-blue-500/20"
                >
                  {completedSessions.length} done
                </Badge>
              )}
            </div>
          )}
          <Button
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="gap-1.5 h-8"
          >
            <Plus className="h-3.5 w-3.5" />
            New Negotiation
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="rounded-full bg-violet-500/10 p-4 mb-4">
              <Zap className="h-8 w-8 text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold mb-1">No active negotiations</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-4">
              Describe any contract and watch two AI agents negotiate it live.
              Or pick a preset demo scenario to get started.
            </p>
            <Button onClick={() => setDialogOpen(true)} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Start a Negotiation
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              {sessions.map((negotiation) => (
                <NegotiationCard
                  key={negotiation.id}
                  negotiation={negotiation}
                  isSelected={selectedId === negotiation.id}
                  onSelect={() =>
                    setSelectedId(
                      selectedId === negotiation.id
                        ? null
                        : negotiation.id,
                    )
                  }
                  onNewNegotiation={() => setDialogOpen(true)}
                />
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-border/50 bg-card px-4 py-3 text-center">
              <p className="text-xs text-muted-foreground">
                <span className="text-violet-400 font-medium">Step</span>{" "}
                advances one turn.{" "}
                <span className="text-violet-400 font-medium">Auto-run</span>{" "}
                lets agents negotiate continuously.{" "}
                Use the{" "}
                <span className="text-violet-400 font-medium">Chat</span> page
                to give your agent new instructions.
              </p>
            </div>
          </>
        )}
      </div>

      <NewNegotiationDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setCreateError(null);
        }}
        scenarios={scenarios}
        onSelectPreset={handleSelectPreset}
        onSubmitPrompt={handleSubmitPrompt}
        busy={busy}
        error={createError}
      />
    </div>
  );
}
