"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * Search Input — instant-search input with icon and clear button.
 *
 * Client component (uses React state for controlled value).
 * Designed for filter bars and list pages.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  className,
}: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        strokeWidth={1.5}
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border-border bg-card placeholder:text-muted-foreground/60 focus-visible:ring-ring h-9 w-full rounded-lg border pr-8 pl-9 text-sm transition-shadow outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 transition-colors"
          aria-label="Clear search"
        >
          <X className="size-3.5" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
}
