import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  headline: string;
  description: string;
  buttonLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * Premium empty state — used across all module placeholder pages.
 *
 * Centers a Lucide icon, headline, description, and primary CTA button.
 * Design matches Linear's empty state patterns.
 */
export function EmptyState({
  icon: Icon,
  headline,
  description,
  buttonLabel,
  onAction,
  className,
}: EmptyStateProps) {
  // Only render a button when there is something to do: a live action or an
  // explicit label (preserving the decorative button legacy callers used).
  const showButton = Boolean(onAction) || Boolean(buttonLabel);

  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      <div className="border-border bg-muted/50 mb-5 rounded-2xl border p-4">
        <Icon className="text-muted-foreground size-8" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-semibold tracking-tight">{headline}</h2>
      <p className="text-muted-foreground mt-1.5 max-w-sm text-sm leading-relaxed">{description}</p>
      {showButton && (
        <Button className="mt-6" size="lg" onClick={onAction}>
          {buttonLabel ?? "Get Started"}
        </Button>
      )}
    </div>
  );
}
