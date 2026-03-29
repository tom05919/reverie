"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Radio } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LiveNegotiationsStat() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/negotiations")
      .then((res) => res.json())
      .then((data) => {
        const active = (data.sessions ?? []).filter(
          (s: { status: string }) => s.status === "active",
        ).length;
        setCount(active);
      })
      .catch(() => setCount(0));
  }, []);

  return (
    <Link href="/live">
      <Card className="relative overflow-hidden border-border/50 transition-colors hover:border-violet-500/30 cursor-pointer h-full">
        <div className="absolute inset-0 bg-linear-to-br from-violet-500/20 to-emerald-500/20 opacity-50" />
        <CardHeader className="relative flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Live Negotiations
          </CardTitle>
          <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">
            {count === null ? "-" : count}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {count === 0
              ? "Launch a demo scenario"
              : "Active sessions running"}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
