"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ThemeMode } from "@/types";

/**
 * Theme toggle — dropdown-based theme selection (Light / Dark / System).
 *
 * Uses a shadcn DropdownMenu with a checkmark on the active option.
 * The trigger button displays the icon matching the current theme.
 *
 * Why dropdown over three‑phase cycle: the user sees all choices
 * at once instead of blindly clicking 1‑3 times.
 */

const THEME_OPTIONS: { label: string; value: ThemeMode }[] = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

function ThemeIcon({ mode, className }: { mode: ThemeMode; className?: string }) {
  if (mode === "dark") return <Moon className={className} />;
  if (mode === "light") return <Sun className={className} />;
  return <Monitor className={className} />;
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const current = (theme as ThemeMode) || "system";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="hover:bg-accent inline-flex size-8 items-center justify-center rounded-md"
        aria-label="Select theme"
      >
        <ThemeIcon mode={current} className="h-[1.2rem] w-[1.2rem] transition-all" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        {THEME_OPTIONS.map((opt) => {
          const isSelected = current === opt.value;
          return (
            <DropdownMenuItem
              key={opt.value}
              onClick={() => setTheme(opt.value)}
              className={cn(isSelected && "font-medium")}
            >
              <ThemeIcon mode={opt.value} className="h-4 w-4" />
              <span>{opt.label}</span>
              {isSelected && <Check className="ml-auto h-4 w-4" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
