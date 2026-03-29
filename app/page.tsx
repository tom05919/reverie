import {
  Handshake,
  TrendingUp,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DealStatusBadge } from "@/components/status-badge";
import { deals, interactions, activityFeed } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/format";

const activeDeals = deals.filter(
  (d) => d.status !== "closed_won" && d.status !== "closed_lost"
);
const totalValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
const recentInteractions = interactions.filter((i) => {
  const ts = new Date(i.timestamp).getTime();
  return Date.now() - ts < 86_400_000;
});

const stats = [
  {
    label: "Active Deals",
    value: activeDeals.length.toString(),
    sub: `${formatCurrency(totalValue)} under negotiation`,
    icon: Handshake,
    gradient: "from-violet-500/20 to-blue-500/20",
  },
  {
    label: "Interactions (24h)",
    value: recentInteractions.length.toString(),
    sub: `${interactions.length} total`,
    icon: MessageSquare,
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    label: "Win Rate",
    value: "78%",
    sub: "Last 30 days",
    icon: TrendingUp,
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    label: "Avg. Deal Cycle",
    value: "12 days",
    sub: "From first contact to close",
    icon: Clock,
    gradient: "from-amber-500/20 to-orange-500/20",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your agent&apos;s activity and negotiations.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="relative overflow-hidden border-border/50"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-50`}
            />
            <CardHeader className="relative flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold">{s.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Deals */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold">
              Active Deals
            </CardTitle>
            <Link
              href="/deals"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeDeals.map((deal) => (
              <Link
                key={deal.id}
                href={`/deals/${deal.id}`}
                className="flex items-center justify-between rounded-lg border border-border/50 px-4 py-3 transition-colors hover:bg-accent/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{deal.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {deal.counterparty.company} &middot;{" "}
                    {formatCurrency(deal.value)}
                  </p>
                </div>
                <DealStatusBadge status={deal.status} />
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityFeed.map((item, i) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-violet-400 mt-1.5" />
                    {i < activityFeed.length - 1 && (
                      <div className="w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.description}
                    </p>
                    <p className="text-[11px] text-muted-foreground/70 mt-1">
                      {formatRelativeTime(item.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
