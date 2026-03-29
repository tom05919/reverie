"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DealStatusBadge } from "@/components/status-badge";
import { AnonymousBadge, AnonymousBanner } from "@/components/anonymous-badge";
import { formatCurrency, formatDate, formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Deal } from "@/lib/types";
import React from "react";

const termStatusIcon: Record<string, string> = {
  agreed: "bg-emerald-400",
  disputed: "bg-red-400",
  open: "bg-amber-400",
};

export default function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const resolvedParams = React.use(params);

  useEffect(() => {
    fetch("/api/deals")
      .then((r) => r.json())
      .then((data) => {
        const found = (data.deals as Deal[]).find(
          (d) => d.id === resolvedParams.id,
        );
        setDeal(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleApprove = async () => {
    if (!deal) return;
    setApproving(true);
    try {
      const res = await fetch(`/api/negotiations/${deal.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approved" }),
      });
      if (res.ok) {
        setDeal((prev) => (prev ? { ...prev, status: "closed_won" } : null));
      }
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!deal) return;
    setApproving(true);
    try {
      const res = await fetch(`/api/negotiations/${deal.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rejected" }),
      });
      if (res.ok) {
        setDeal((prev) => (prev ? { ...prev, status: "closed_lost" } : null));
      }
    } finally {
      setApproving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="p-6 lg:p-8 text-center space-y-4">
        <p className="text-muted-foreground">Deal not found.</p>
        <Button variant="outline" onClick={() => router.push("/deals")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Deals
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
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
            {deal.anonymous && <AnonymousBadge />}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {deal.counterparty.company} &middot;{" "}
            {formatCurrency(deal.value)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
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
                          termStatusIcon[term.status] ?? "bg-neutral-400",
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

        <div className="space-y-6">
          {deal.anonymous && <AnonymousBanner />}

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
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white"
                  onClick={handleApprove}
                  disabled={approving}
                >
                  {approving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                  )}
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
                  onClick={handleReject}
                  disabled={approving}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </CardContent>
            </Card>
          )}

          {deal.status === "closed_won" && (
            <Card className="border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <p className="text-sm font-medium text-emerald-400">
                    Deal Approved
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This deal has been approved and is being tracked in your pipeline.
                </p>
              </CardContent>
            </Card>
          )}

          {deal.status === "closed_lost" && (
            <Card className="border-red-500/20 bg-red-500/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <p className="text-sm font-medium text-red-400">
                    Deal Rejected
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  This deal was reviewed and rejected.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
