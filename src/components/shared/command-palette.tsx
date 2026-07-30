"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search } from "lucide-react";

/** Auto‑detect the modifier key — macOS shows âŒ~, everything else shows Ctrl. */
const IS_MAC = typeof window !== "undefined" ? window.navigator.platform.includes("Mac") : false;
const MOD_LABEL = IS_MAC ? "âŒ~K" : "Ctrl+K";

/**
 * Global command palette trigger — listens for ⌘K / Ctrl+K and
 * opens a modal dialog with a placeholder "Coming Soon".
 *
 * Design: the Dialog container, search input area, and keyboard handling
 * are in place. When a real search UI arrives it drops directly into this
 * same shell — zero rewiring of the global shortcut.
 */
export function CommandPalette() {
  const [open, setOpen] = useState(false);

  // Toggle open/close on ⌘K or Ctrl+K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Search className="text-muted-foreground size-4" />
            Command Palette
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground text-center text-sm select-none">
            Command palette coming soon.
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            Press{" "}
            <kbd className="bg-muted rounded border px-1.5 py-0.5 text-[0.65rem]">{MOD_LABEL}</kbd>{" "}
            to close.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
