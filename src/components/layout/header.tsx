"use client";

import { PanelLeft, Search } from "lucide-react";
import { useSidebarStore } from "@/stores/ui/sidebar-store";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { CommandPalette } from "@/components/shared/command-palette";

/**
 * Application header — top bar shown on every dashboard page.
 *
 * Left: hamburger button (mobile) + dynamic Breadcrumb
 * Right: command palette trigger, theme toggle
 */

export function Header() {
  const { isMobileOpen, openMobile } = useSidebarStore();

  return (
    <>
      <CommandPalette />

      <header className="bg-background sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b px-4">
        {/* Left: hamburger (mobile) + breadcrumb navigation */}
        <div className="flex items-center gap-2">
          <button
            className="hover:bg-accent rounded-md p-1.5 lg:hidden"
            onClick={openMobile}
            aria-label="Open sidebar"
            aria-expanded={isMobileOpen}
            type="button"
          >
            <PanelLeft className="h-5 w-5" />
          </button>

          <Breadcrumb className="hidden sm:flex" />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">
          {/* Search trigger (/⌘K) */}
          <button
            onClick={() => {
              // trigger a native keydown for CommandPalette
              document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
            }}
            className="bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground inline-flex h-8 items-center gap-2 rounded-md border px-3 text-xs transition-colors"
            type="button"
          >
            <Search className="size-3.5" />
            <span className="hidden md:block">Ctrl+K</span>
          </button>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
