import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

const colorForValue = (value: number): string => {
  if (value >= 80) return "bg-chart-2"; // green
  if (value >= 50) return "bg-chart-3"; // orange
  if (value >= 25) return "bg-chart-1"; // blue
  return "bg-destructive"; // red
};

/**
 * Progress Bar — shows progress with label and percentage.
 *
 * Color adapts based on value: green (≥80), orange (≥50),
 * blue (≥25), red (<25). Used in skills, projects, goals.
 */
export function ProgressBar({
  value,
  label,
  showPercentage = true,
  size = "md",
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-foreground text-xs font-medium">{label}</span>}
          {showPercentage && (
            <span className="text-muted-foreground text-xs tabular-nums">{clamped}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn("bg-muted w-full overflow-hidden rounded-full", sizeStyles[size])}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-[--ease-out]",
            colorForValue(clamped),
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
