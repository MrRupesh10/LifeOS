"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "@/providers/theme";
import { QueryProvider } from "@/providers/query";
import { Toaster } from "sonner";

/**
 * Composite provider wrapper for the entire app.
 *
 * Layout doesn't need to know about individual providers —
 * it wraps `<AppProviders>` once. When a new provider is
 * added it occupies one line here and zero lines in layout.
 *
 * Provider order (top → down, outer → inner):
 *  1. MotionConfig       —  respects prefers-reduced-motion (no tree branching)
 *  2. ThemeProvider      —  light/dark mode persistence
 *  3. QueryProvider      —  TanStack Query client
 *  4. (future) AuthProvider   — Better Auth context
 *  5. (future) Sonner.toaster — App-level toast notifications
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <QueryProvider>
          {children}
          <Toaster position="bottom-right" closeButton richColors theme="system" />
        </QueryProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}
