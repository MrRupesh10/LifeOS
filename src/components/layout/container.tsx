import { cn } from "@/lib/utils";

/**
 * Content container — constrains width and centers content.
 *
 * Variants:
 *   - "default" — standard page width (max-w-5xl, 1024px)
 *   - "narrow"  — reading comfort (max-w-3xl, 768px)
 *   - "wide"    — data-dense pages (max-w-7xl, 1280px)
 *
 * Always horizontally centered with responsive padding.
 */

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "narrow" | "wide";
  as?: "div" | "section" | "main" | "article";
};

const VARIANT_WIDTHS = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-7xl",
} as const;

export function Container({
  children,
  className,
  variant = "default",
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", VARIANT_WIDTHS[variant], className)}
    >
      {children}
    </Component>
  );
}
