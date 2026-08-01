import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { direction: "up" | "down"; label: string };
  className?: string;
}

/**
 * Stats Card — compact stat with icon, value, and optional trend.
 *
 * Used in page headers, dashboard widgets, and analytics.
 */
export function StatsCard({ icon: Icon, label, value, trend, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "border-border bg-card flex items-center gap-3 rounded-xl border p-4",
        className,
      )}
    >
      <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-lg">
        <Icon className="text-muted-foreground size-5" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="text-muted-foreground text-xs">{label}</p>
        <p className="text-lg font-semibold tracking-tight tabular-nums">{value}</p>
        {trend && (
          <p
            className={cn(
              "text-xs font-medium",
              trend.direction === "up" ? "text-chart-2" : "text-destructive",
            )}
          >
            {trend.direction === "up" ? "↑" : "↓"} {trend.label}
          </p>
        )}
      </div>
    </div>
  );
}
