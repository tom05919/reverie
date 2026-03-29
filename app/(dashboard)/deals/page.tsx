"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { DealStatusBadge } from "@/components/status-badge";
import { AnonymousBadge } from "@/components/anonymous-badge";
import { formatCurrency, formatRelativeTime } from "@/lib/format";
import { ArrowUpRight, Loader2 } from "lucide-react";
import type { Deal } from "@/lib/types";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/deals")
      .then((r) => r.json())
      .then((data) => setDeals(data.deals ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Deals</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Current and recent negotiations managed by your agent.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {deals.map((deal) => (
            <Link key={deal.id} href={`/deals/${deal.id}`}>
              <Card className="group relative overflow-hidden border-border/50 transition-all hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 h-full">
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold leading-tight truncate">
                        {deal.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {deal.counterparty.company}
                      </p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 shrink-0" />
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {deal.summary}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <DealStatusBadge status={deal.status} />
                      {deal.anonymous && <AnonymousBadge />}
                    </div>
                    <span className="text-sm font-semibold tabular-nums">
                      {formatCurrency(deal.value)}
                    </span>
                  </div>

                  <p className="text-[11px] text-muted-foreground/70">
                    Last activity {formatRelativeTime(deal.lastActivity)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
