/**
 * Label — styled form label with peer-focus awareness.
 *
 * Wraps a native `<label>` element; the `peer` class styling lets
 * inputs declare `peer` and react to focus via Tailwind's peer-*
 * variants if needed. Lightweight, accessible, server-renderable.
 */
import type { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none",
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
