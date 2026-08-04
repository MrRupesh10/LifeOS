/**
 * Input — native text input styled to match the design system.
 *
 * A thin wrapper around `<input suppressHydrationWarning>` with the same focus-ring,
 * radius, and typography tokens used across the app. Marked as a
 * UI primitive (Base UI has no "Input" component — this is simply
 * a styled native element, which is the shadcn pattern).
 *
 * Forwarded props let callers pass `type`, `autoComplete`,
 * `aria-*`, etc. directly — no special API surface to learn.
 */
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      suppressHydrationWarning
      type={type}
      data-slot="input"
      className={cn(
        "border-input flex h-9 w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 text-sm",
        "text-foreground shadow-xs transition-colors",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-3",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}
