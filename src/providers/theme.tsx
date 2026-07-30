"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * Theme provider wrapping next-themes with LifeOS defaults.
 *
 * Why next-themes (ADR-010):
 *   - Prevents the browser "flash" on page load by injecting a
 *     script before paint that reads localStorage.
 *   - Supports `class` strategy which works with Tailwind's
 *     `.dark` variant (globals.css uses @custom-variant dark).
 *   - System-aware: respects prefers-color-scheme by default.
 *
 * attribute="class":
 *   Toggles `.dark` class on <html>. Tailwind v4's
 *   @custom-variant dark (&:is(.dark *)) picks this up
 *   and applies dark: utilities inside the selector.
 *
 * defaultTheme="system":
 *   First visit → system preference. User toggle → persisted
 *   in localStorage, taking precedence on subsequent visits.
 *
 * disableTransitionOnChange:
 *   Prevents CSS transition flicker when theme class is
 *   applied during hydration. After mount, transitions
 *   are re-enabled so users see smooth light→dark swaps.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
