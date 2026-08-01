"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
  className?: string;
}

/**
 * Filter Dropdown — multi-select dropdown with checkmarks.
 *
 * Client component. Used for filtering lists by category or status.
 */
export function FilterDropdown({
  options,
  selected,
  onChange,
  label = "Filter",
  className,
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const isActive = selected.length > 0;

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(!open)}
        className={cn(isActive && "border-ring text-ring")}
      >
        {label}
        {isActive && (
          <span className="bg-primary text-primary-foreground ml-1.5 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold">
            {selected.length}
          </span>
        )}
        <ChevronDown
          className={cn("ml-1.5 size-3.5 transition-transform", open && "rotate-180")}
          strokeWidth={1.5}
        />
      </Button>

      {open && (
        <>
          {/* Backdrop to close on outside click */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="border-border bg-popover absolute top-full left-0 z-50 mt-1.5 w-48 rounded-lg border p-1 shadow-lg">
            {options.map((option) => {
              const isSelected = selected.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => toggle(option.value)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                    isSelected
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-4 items-center justify-center rounded border transition-colors",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background",
                    )}
                  >
                    {isSelected && <Check className="size-3" strokeWidth={2.5} />}
                  </div>
                  {option.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
