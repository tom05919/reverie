import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AnonymousBadge() {
  return (
    <Badge
      variant="outline"
      className="gap-1 bg-violet-500/10 text-violet-400 border-violet-500/20 text-[10px] px-1.5"
    >
      <Shield className="h-2.5 w-2.5" />
      Anonymous
    </Badge>
  );
}

export function AnonymousBanner() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2">
      <Shield className="h-3.5 w-3.5 text-violet-400 shrink-0" />
      <p className="text-[11px] text-violet-400/90">
        Your identity is hidden from this counterparty
      </p>
    </div>
  );
}
