import { cn } from "@/lib/utils";

type CardVariant = "default" | "hover" | "glass";

interface CardProps {
  children: React.ReactNode;
  variant?: CardVariant;
  className?: string;
}

const variantStyles: Record<CardVariant, string> = {
  default: "bg-card border border-border",
  hover:
    "bg-card border border-border transition-shadow duration-[--duration-normal] ease-[--ease-out] hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5",
  glass: "bg-card/80 backdrop-blur-md border border-border shadow-sm",
};

/**
 * Reusable Card component with three variants.
 *
 * - `default`: Static card (widgets, sections)
 * - `hover`: Card with subtle lift + shadow on hover (feature cards)
 * - `glass`: Frosted glass effect with backdrop blur
 */
export function Card({ children, variant = "default", className }: CardProps) {
  return <div className={cn("rounded-xl p-5", variantStyles[variant], className)}>{children}</div>;
}
