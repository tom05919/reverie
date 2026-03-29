import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DealStatusBadge } from "@/components/status-badge";
import { deals } from "@/lib/mock-data";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return deals.map((d) => ({ id: d.id }));
}

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deal = deals.find((d) => d.id === id);
  if (!deal) notFound();

  const termStatusIcon = {
    agreed: "bg-emerald-400",
    disputed: "bg-red-400",
    open: "bg-amber-400",
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/deals"
          className="mt-1 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-semibold tracking-tight">
              {deal.title}
            </h1>
            <DealStatusBadge status={deal.status} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {deal.counterparty.company} &middot;{" "}
            {formatCurrency(deal.value)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {deal.summary}
              </p>
            </CardContent>
          </Card>

          {/* Key Terms */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Key Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-4 text-[11px] font-medium uppercase tracking-wider text-muted-foreground pb-1">
                  <span>Term</span>
                  <span>Our Position</span>
                  <span>Their Position</span>
                  <span>Status</span>
                </div>
                <Separator />
                {deal.terms.map((term) => (
                  <div
                    key={term.label}
                    className="grid grid-cols-4 items-center text-sm py-1"
                  >
                    <span className="font-medium">{term.label}</span>
                    <span className="text-muted-foreground">
                      {term.ourPosition}
                    </span>
                    <span className="text-muted-foreground">
                      {term.theirPosition}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          termStatusIcon[term.status]
                        )}
                      />
                      <span className="text-xs capitalize text-muted-foreground">
                        {term.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Negotiation Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deal.timeline.map((event, i) => (
                  <div key={event.id} className="flex gap-3">
                    <div className="relative flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                      {i < deal.timeline.length - 1 && (
                        <div className="w-px flex-1 bg-border" />
                      )}
                    </div>
                    <div className="pb-4 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">
                          {event.actor}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5"
                        >
                          {event.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.detail}
                      </p>
                      <p className="text-[11px] text-muted-foreground/60 mt-1">
                        {formatDate(event.timestamp)} at{" "}
                        {formatTime(event.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Strategy Notes */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Agent Strategy Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {deal.strategyNotes}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          {deal.status === "pending_approval" && (
            <Card className="border-violet-500/20 bg-violet-500/5">
              <CardHeader>
                <CardTitle className="text-base">Approval Required</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground mb-4">
                  Your agent has finished negotiating. Review the terms and take
                  action.
                </p>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve Deal
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Counter-offer
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
