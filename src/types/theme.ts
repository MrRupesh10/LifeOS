/**
 * Theme-related types shared between the ThemeToggle,
 * ThemeProvider, and any component that needs theme info.
 */

/** The three theme strategies Next-Themes supports. */
export type ThemeMode = "light" | "dark" | "system";

/** Describes what a theme option looks like. Used by ThemeToggle. */
export type ThemeOption = {
  label: string;
  value: ThemeMode;
  icon: string; // Lucide icon name — renders dynamically
};
