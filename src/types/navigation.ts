import type { LucideIcon } from "lucide-react";

/**
 * Navigation types — shared between Sidebar, MobileNav, and
 * the centralized navigation configuration.
 *
 * Module boundary: types/navigation.ts can be imported by any
 * layout component without violating Module Boundary Rules.
 */

/** A single navigation link in the sidebar or mobile bars. */
export type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  /** Group identifier for headline styling (e.g., Planning, Analyse */
  group?: string;
  /** When true, only show the icon (e.g., settings in bottom bar). */
  compact?: boolean;
  /** Keyboard shortcut to show in the nav (e.g., 'g t' for Tasks). */
  keyboardShortcut: string;
};

/** A section label wrapping related NavItems (e.g., Tools, Data, Settings). */
export type NavGroup = {
  label: string;
  items: NavItem[];
};

/** Full navigation configuration consumed by sidebar and mobile navs. */
export type NavConfig = {
  primary: NavGroup[];
  bottom: NavItem[];
};
