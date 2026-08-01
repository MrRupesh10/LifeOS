/**
 * Design Token Registry — the single source of truth for every
 * design token used in the LifeOS visual language.
 *
 * This file serves two purposes:
 *   1. Provides typed, importable token definitions for the
 *      design-system showcase page so it can render real swatches.
 *   2. Acts as documentation — every token has a description of
 *      what it controls and where it applies.
 *
 * The ACTUAL CSS values live in src/app/globals.css as CSS custom
 * properties. This file mirrors those values for display purposes
 * only. When you change a token in globals.css, update it here too.
 *
 * Design philosophy: Apple × Linear — minimal, cool-toned neutrals,
 * generous whitespace, crisp borders, fast transitions.
 */

// ─── Color Tokens (Apple/Linear-inspired) ─────────────────────────

export type ColorToken = {
  name: string;
  cssVariable: string;
  description: string;
  /** Hex approximation for display — actual value in globals.css uses oklch */
  lightHex: string;
  darkHex: string;
  /** Token category for grouping */
  category:
    "background" | "foreground" | "surface" | "interactive" | "semantic" | "chart" | "sidebar";
};

export const COLOR_TOKENS: ColorToken[] = [
  {
    category: "background",
    name: "Background",
    cssVariable: "--background",
    description: "Page background. Pure white in light, near-black with cool undertone in dark.",
    lightHex: "#FFFFFF",
    darkHex: "#0C0C0D",
  },
  {
    category: "background",
    name: "Foreground",
    cssVariable: "--foreground",
    description: "Primary body text. Near-black in light, near-white in dark.",
    lightHex: "#1A1A1A",
    darkHex: "#F2F2F2",
  },
  {
    category: "surface",
    name: "Card",
    cssVariable: "--card",
    description: "Card and elevated surface backgrounds. Slightly off-white for definition.",
    lightHex: "#FCFCFC",
    darkHex: "#161618",
  },
  {
    category: "surface",
    name: "Card Foreground",
    cssVariable: "--card-foreground",
    description: "Text on card surfaces.",
    lightHex: "#1A1A1A",
    darkHex: "#F2F2F2",
  },
  {
    category: "surface",
    name: "Popover",
    cssVariable: "--popover",
    description: "Dropdown, popover, and floating element background.",
    lightHex: "#FFFFFF",
    darkHex: "#1C1C1E",
  },
  {
    category: "surface",
    name: "Popover Foreground",
    cssVariable: "--popover-foreground",
    description: "Text inside popovers and dropdowns.",
    lightHex: "#1A1A1A",
    darkHex: "#F2F2F2",
  },
  {
    category: "surface",
    name: "Muted",
    cssVariable: "--muted",
    description:
      "Subtle surface for secondary areas (sidebar bg, pressed states). Cool blue-gray undertone.",
    lightHex: "#F5F5F7",
    darkHex: "#1C1C1E",
  },
  {
    category: "surface",
    name: "Muted Foreground",
    cssVariable: "--muted-foreground",
    description: "Secondary and tertiary text. Used for labels, captions, help text.",
    lightHex: "#6E6E73",
    darkHex: "#98989D",
  },
  {
    category: "surface",
    name: "Border",
    cssVariable: "--border",
    description: "Card borders, input borders, dividers. Minimal — visibility through contrast.",
    lightHex: "#E5E5EA",
    darkHex: "#2C2C2E",
  },
  {
    category: "interactive",
    name: "Primary",
    cssVariable: "--primary",
    description: "Primary action buttons, active nav states. Near-black, not pure black.",
    lightHex: "#1D1D1F",
    darkHex: "#F2F2F2",
  },
  {
    category: "interactive",
    name: "Primary Foreground",
    cssVariable: "--primary-foreground",
    description: "Text on primary backgrounds. White on dark, near-black on light.",
    lightHex: "#FFFFFF",
    darkHex: "#1D1D1F",
  },
  {
    category: "interactive",
    name: "Secondary",
    cssVariable: "--secondary",
    description: "Secondary button / badge background. Cool gray, lower emphasis.",
    lightHex: "#F2F2F7",
    darkHex: "#2C2C2E",
  },
  {
    category: "interactive",
    name: "Secondary Foreground",
    cssVariable: "--secondary-foreground",
    description: "Text on secondary surface.",
    lightHex: "#1D1D1F",
    darkHex: "#F2F2F2",
  },
  {
    category: "interactive",
    name: "Accent",
    cssVariable: "--accent",
    description: "Hover states, selected backgrounds, focus indicators.",
    lightHex: "#F2F2F7",
    darkHex: "#2C2C2E",
  },
  {
    category: "interactive",
    name: "Accent Foreground",
    cssVariable: "--accent-foreground",
    description: "Text on accent surfaces.",
    lightHex: "#1D1D1F",
    darkHex: "#F2F2F2",
  },
  {
    category: "interactive",
    name: "Ring",
    cssVariable: "--ring",
    description: "Focus ring color — visible keyboard focus indicator.",
    lightHex: "#007AFF",
    darkHex: "#0A84FF",
  },
  {
    category: "interactive",
    name: "Input",
    cssVariable: "--input",
    description: "Input field border and background.",
    lightHex: "#E5E5EA",
    darkHex: "#3A3A3C",
  },
  {
    category: "semantic",
    name: "Destructive",
    cssVariable: "--destructive",
    description: "Delete, remove, and error states. Apple-system red.",
    lightHex: "#FF3B30",
    darkHex: "#FF453A",
  },
  {
    category: "chart",
    name: "Chart 1",
    cssVariable: "--chart-1",
    description: "Primary chart series color — cool blue.",
    lightHex: "#007AFF",
    darkHex: "#0A84FF",
  },
  {
    category: "chart",
    name: "Chart 2",
    cssVariable: "--chart-2",
    description: "Secondary chart series — green.",
    lightHex: "#34C759",
    darkHex: "#30D158",
  },
  {
    category: "chart",
    name: "Chart 3",
    cssVariable: "--chart-3",
    description: "Tertiary chart series — orange.",
    lightHex: "#FF9500",
    darkHex: "#FF9F0A",
  },
  {
    category: "chart",
    name: "Chart 4",
    cssVariable: "--chart-4",
    description: "Fourth chart series — purple.",
    lightHex: "#AF52DE",
    darkHex: "#BF5AF2",
  },
  {
    category: "chart",
    name: "Chart 5",
    cssVariable: "--chart-5",
    description: "Fifth chart series — teal.",
    lightHex: "#5AC8FA",
    darkHex: "#64D2FF",
  },
  {
    category: "sidebar",
    name: "Sidebar",
    cssVariable: "--sidebar",
    description: "Sidebar background surface.",
    lightHex: "#F9F9FB",
    darkHex: "#0E0E10",
  },
  {
    category: "sidebar",
    name: "Sidebar Foreground",
    cssVariable: "--sidebar-foreground",
    description: "Sidebar text and icons.",
    lightHex: "#1D1D1F",
    darkHex: "#F2F2F2",
  },
  {
    category: "sidebar",
    name: "Sidebar Primary",
    cssVariable: "--sidebar-primary",
    description: "Sidebar active item background.",
    lightHex: "#1D1D1F",
    darkHex: "#007AFF",
  },
  {
    category: "sidebar",
    name: "Sidebar Primary Foreground",
    cssVariable: "--sidebar-primary-foreground",
    description: "Text on sidebar active item.",
    lightHex: "#FFFFFF",
    darkHex: "#FFFFFF",
  },
  {
    category: "sidebar",
    name: "Sidebar Accent",
    cssVariable: "--sidebar-accent",
    description: "Sidebar hover / focus state.",
    lightHex: "#F2F2F7",
    darkHex: "#1C1C1E",
  },
  {
    category: "sidebar",
    name: "Sidebar Accent Foreground",
    cssVariable: "--sidebar-accent-foreground",
    description: "Text on sidebar hover state.",
    lightHex: "#1D1D1F",
    darkHex: "#F2F2F2",
  },
  {
    category: "sidebar",
    name: "Sidebar Border",
    cssVariable: "--sidebar-border",
    description: "Sidebar right-border separator.",
    lightHex: "#E5E5EA",
    darkHex: "#2C2C2E",
  },
  {
    category: "sidebar",
    name: "Sidebar Ring",
    cssVariable: "--sidebar-ring",
    description: "Sidebar focus rings.",
    lightHex: "#007AFF",
    darkHex: "#0A84FF",
  },
];

// ─── Typography Tokens ────────────────────────────────────────────

export type TypographyToken = {
  name: string;
  tailwindClass: string;
  size: string;
  leading: string;
  weight: "400" | "500" | "600" | "700";
  usage: string;
  sample: string;
};

export const TYPOGRAPHY_TOKENS: TypographyToken[] = [
  {
    name: "xs",
    tailwindClass: "text-xs",
    size: "12px / 0.75rem",
    leading: "16px / 1rem",
    weight: "400",
    usage: "Badges, tooltips, auxiliary labels",
    sample: "The quick brown fox",
  },
  {
    name: "sm",
    tailwindClass: "text-sm",
    size: "14px / 0.875rem",
    leading: "20px / 1.25rem",
    weight: "400",
    usage: "Captions, sidebar items, help text",
    sample: "The quick brown fox",
  },
  {
    name: "base",
    tailwindClass: "text-base",
    size: "16px / 1rem",
    leading: "24px / 1.5rem",
    weight: "400",
    usage: "Body text, inputs, buttons, descriptions",
    sample: "The quick brown fox",
  },
  {
    name: "lg",
    tailwindClass: "text-lg",
    size: "18px / 1.125rem",
    leading: "28px / 1.75rem",
    weight: "500",
    usage: "Lead paragraphs, page intros",
    sample: "The quick brown fox",
  },
  {
    name: "xl",
    tailwindClass: "text-xl",
    size: "20px / 1.25rem",
    leading: "28px / 1.75rem",
    weight: "600",
    usage: "Section headers",
    sample: "The quick brown fox",
  },
  {
    name: "2xl",
    tailwindClass: "text-2xl",
    size: "24px / 1.5rem",
    leading: "32px / 2rem",
    weight: "600",
    usage: "Page titles, dialog titles",
    sample: "The quick brown fox",
  },
  {
    name: "3xl",
    tailwindClass: "text-3xl",
    size: "30px / 1.875rem",
    leading: "36px / 2.25rem",
    weight: "700",
    usage: "Dashboard metrics, stat tiles",
    sample: "The quick brown fox",
  },
];

// ─── Spacing Tokens ───────────────────────────────────────────────

export type SpacingToken = {
  name: string;
  tailwindClass: string;
  px: number;
  usage: string;
};

export const SPACING_TOKENS: SpacingToken[] = [
  {
    name: "0.5",
    tailwindClass: "gap-0.5 / p-0.5",
    px: 2,
    usage: "Icon-to-text gap, micro spacing",
  },
  { name: "1", tailwindClass: "gap-1 / p-1", px: 4, usage: "Inline elements, icon padding" },
  { name: "2", tailwindClass: "gap-2 / p-2", px: 8, usage: "Item spacing, icon gaps" },
  { name: "3", tailwindClass: "gap-3 / p-3", px: 12, usage: "Inside cards, vertical rhythm" },
  { name: "4", tailwindClass: "gap-4 / p-4", px: 16, usage: "Standard card padding" },
  { name: "6", tailwindClass: "gap-6 / p-6", px: 24, usage: "Page-level padding, section gap" },
  { name: "8", tailwindClass: "gap-8 / p-8", px: 32, usage: "Between major sections" },
  { name: "12", tailwindClass: "gap-12 / p-12", px: 48, usage: "Hero spacing, major divide" },
];

// ─── Radius Tokens ─────────────────────────────────────────────────

export type RadiusToken = {
  name: string;
  cssVariable: string;
  value: string;
  usage: string;
};

export const RADIUS_TOKENS: RadiusToken[] = [
  {
    name: "sm",
    cssVariable: "--radius-sm",
    value: "calc(var(--radius) * 0.6)",
    usage: "Small badges, tags",
  },
  {
    name: "md",
    cssVariable: "--radius-md",
    value: "calc(var(--radius) * 0.8)",
    usage: "Buttons, inputs, cards",
  },
  {
    name: "lg",
    cssVariable: "--radius-lg",
    value: "var(--radius)",
    usage: "Dialogs, modals, larger cards",
  },
  {
    name: "xl",
    cssVariable: "--radius-xl",
    value: "calc(var(--radius) * 1.4)",
    usage: "Pill buttons, avatars",
  },
  {
    name: "2xl",
    cssVariable: "--radius-2xl",
    value: "calc(var(--radius) * 1.8)",
    usage: "Rounded containers",
  },
  {
    name: "3xl",
    cssVariable: "--radius-3xl",
    value: "calc(var(--radius) * 2.2)",
    usage: "Very rounded elements",
  },
];

// ─── Shadow Tokens ─────────────────────────────────────────────────

export type ShadowToken = {
  name: string;
  cssVariable: string;
  usage: string;
};

export const SHADOW_TOKENS: ShadowToken[] = [
  { name: "2xs", cssVariable: "shadow-2xs", usage: "Subtle elevation (hovered cards)" },
  { name: "xs", cssVariable: "shadow-xs", usage: "General subtle elevation" },
  { name: "sm", cssVariable: "shadow-sm", usage: "Standard component elevation" },
  { name: "md", cssVariable: "shadow-md", usage: "Dropdowns, popovers" },
  { name: "lg", cssVariable: "shadow-lg", usage: "Modals, dialogs" },
  { name: "xl", cssVariable: "shadow-xl", usage: "Command palette, large modals" },
];

// ─── Duration / Easing Tokens ──────────────────────────────────────────

export type AnimationToken = {
  name: string;
  value: string;
  usage: string;
};

export const ANIMATION_TOKENS: AnimationToken[] = [
  { name: "Duration: instant", value: "75ms", usage: "Hover states, micro changes" },
  { name: "Duration: fast", value: "150ms", usage: "Button hover, toggle switch" },
  { name: "Duration: normal", value: "200ms", usage: "Sidebar transition, dialog in/out" },
  { name: "Duration: slow", value: "300ms", usage: "Modal entrance, page transitions" },
  { name: "Ease: default", value: "cubic-bezier(0.4, 0, 0.2, 1)", usage: "Standard ease-out" },
  {
    name: "Ease: spring",
    value: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    usage: "Micro bounce (diagnostic feedback)",
  },
];

// ─── Font Tokens ─────────────────────────────────────────────────

export type FontToken = {
  name: string;
  cssVariable: string;
  stack: string;
};

export const FONT_TOKENS: FontToken[] = [
  {
    name: "Sans",
    cssVariable: "--font-sans",
    stack: "Geist, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  {
    name: "Mono",
    cssVariable: "--font-mono",
    stack: "Geist Mono, ui-monospace, 'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
  },
  {
    name: "Heading",
    cssVariable: "--font-heading",
    stack: "var(--font-sans) — same as sans; typography consistency",
  },
];
