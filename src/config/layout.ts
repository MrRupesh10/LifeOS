/**
 * Layout constants — single source of truth for size, spacing,
 * and breakpoint decisions across the application shell.
 *
 * WHY CONSTANTS: Changing sidebar width from 256 to 272 requires
 * updating CSS classes in Sidebar, AppShell, Header, and mobile
 * overlay. With constants, it's one number here.
 *
 * Dimensions in px (translated to Tailwind classes at the component).
 */

/** Sidebar widths in pixels. Must match the class in sidebar tsx. */
export const SIDEBAR_EXPANDED_WIDTH = 256;
export const SIDEBAR_COLLAPSED_WIDTH = 64;

/** Transition timing for collapse/expand animation. */
export const SIDEBAR_TRANSITION_MS = 200;

/** Header height — must match the h-1rem class in header.tsx. */
export const HEADER_HEIGHT = 56; // 14 * 4px

/** Breakpoint where the mobile sidebar shows as drawer (instead of inline). */
export const MOBILE_BREAKPOINT = 1024; // lg in Tailwind default
