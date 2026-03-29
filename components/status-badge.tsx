import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DealStatus, InteractionOutcome } from "@/lib/types";

const dealStatusStyles: Record<DealStatus, string> = {
  exploring:
    "bg-blue-500/15 text-blue-400 border-blue-500/20",
  negotiating:
    "bg-violet-500/15 text-violet-400 border-violet-500/20",
  pending_approval:
    "bg-amber-500/15 text-amber-400 border-amber-500/20",
  closed_won:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  closed_lost:
    "bg-red-500/15 text-red-400 border-red-500/20",
};

const dealStatusLabels: Record<DealStatus, string> = {
  exploring: "Exploring",
  negotiating: "Negotiating",
  pending_approval: "Pending Approval",
  closed_won: "Closed Won",
  closed_lost: "Closed Lost",
};

const outcomeStyles: Record<InteractionOutcome, string> = {
  success:
    "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  ongoing:
    "bg-violet-500/15 text-violet-400 border-violet-500/20",
  failed:
    "bg-red-500/15 text-red-400 border-red-500/20",
};

const outcomeLabels: Record<InteractionOutcome, string> = {
  success: "Success",
  ongoing: "Ongoing",
  failed: "Failed",
};

export function DealStatusBadge({ status }: { status: DealStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium", dealStatusStyles[status])}
    >
      {dealStatusLabels[status]}
    </Badge>
  );
}

export function OutcomeBadge({ outcome }: { outcome: InteractionOutcome }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-[11px] font-medium", outcomeStyles[outcome])}
    >
      {outcomeLabels[outcome]}
    </Badge>
  );
}
