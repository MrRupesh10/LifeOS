# Design-System.md — LifeOS Visual Language

> **Version:** 0.1.0-alpha  
> **Last updated:** 2026-07-29  
> **Status:** Phase 0 — Pre-implementation specification  
> **Implementation:** Phase 2 (Design System & Layout Shell)

---

## Design Philosophy

**Inspired by:** Apple, Linear, Vercel, Raycast, Notion

**Principles:**
- **Minimal** — Content is the star. Chrome retreats.
- **Professional** — It looks like a pro shipped it.
- **Calm** — Whitespace is generous. Nothing shouts.
- **Responsive** — Mobile, tablet, desktop — one design, adaptive.
- **Accessible** — WCAG AA from day one. No retrofitting.

---

## Color System

### Light Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#FFFFFF` | Page background |
| `foreground` | `#0A0A0A` | Primary text |
| `muted` | `#F5F5F5` | Subtle background (cards, sidebar) |
| `muted-foreground` | `#737373` | Secondary text, captions |
| `border` | `#E5E5E5` | Card borders, input borders, dividers |
| `primary` | `#171717` | Primary action, selected states |
| `primary-foreground` | `#FAFAFA` | Text on primary background |
| `secondary` | `#F5F5F5` | Secondary button, badge bg |
| `secondary-foreground` | `#171717` | Text on secondary |
| `accent` | `#0066FF` | Links, focus rings, brand highlight |
| `accent-foreground` | `#FFFFFF` | Text on accent |
| `destructive` | `#EF4444` | Delete buttons, error text |
| `destructive-foreground` | `#FFFFFF` | Text on destructive |
| `success` | `#22C55E` | Task completion, positive feedback |
| `warning` | `#F59E0B` | Due dates approaching, warnings |
| `info` | `#3B82F6` | Alerts, informational |

### Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#0A0A0A` | Page background |
| `foreground` | `#FAFAFA` | Primary text |
| `muted` | `#171717` | Subtle surfaces |
| `muted-foreground` | `#A3A3A3` | Secondary text |
| `border` | `#262626` | Borders in dark |
| `primary` | `#FAFAFA` | Primary action (inverted) |
| `primary-foreground` | `#0A0A0A` | Text on primary |
| `secondary` | `#262626` | Secondary bg |
| `secondary-foreground` | `#FAFAFA` | Text on secondary |
| `accent` | `#3B82F6` | Accent (slightly lighter in dark mode) |
| `accent-foreground` | `#FFFFFF` | Text on accent |
| `destructive` | `#DC2626` | Destructive (slightly lighter) |
| `success` | `#16A34A` | Success |
| `warning` | `#D97706` | Warning |
| `info` | `#2563EB` | Info |

### Color Usage Rules

- **Never use raw hex values** in components — always use Tailwind semantic tokens
- **Contrast always** checked: text tokens must meet WCAG AA contrast ratio against background tokens
- **No gradients** — flat, solid colors. Exceptions: data visualization charts can use faint gradients.
- **Shades of neutral for layout**, accent for interactive elements, semantic colors (destructive, success) for state

---

## Typography

### Font Stack

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             Roboto, sans-serif;

font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

- **Body text:** Inter (primary typeface)
- **Monospace:** JetBrains Mono (code blocks, dates, numeric data)

### Type Scale

| Token | Size / Line-height | Weight | Usage |
|-------|--------------------|--------|-------|
| `text-xs` | 12px / 16px (0.75rem) | 400 / 500 | Badges, tooltips, timeline dates |
| `text-sm` | 14px / 20px (0.875rem) | 400 / 500 | Secondary text, sidebar nav, form help text, captions |
| `text-base` | 16px / 24px (1rem) | 400 / 500 | Body text, inputs, buttons, descriptions |
| `text-lg` | 18px / 28px (1.125rem) | 500 | Lead paragraphs, card titles |
| `text-xl` | 20px / 28px (1.25rem) | 600 | Section headers |
| `text-2xl` | 24px / 32px (1.5rem) | 600 | Page titles, dialog titles |
| `text-3xl` | 30px / 36px (1.875rem) | 700 | Dashboard numbers, stat tiles |
| `text-4xl` | 36px / 40px (2.25rem) | 700 | Hero text, empty states, landing |

### Typography Rules

- **Body text is 16px.** Not 14px. This aids readability — Tailwind `text-base` maps to 16px.
- **Only one font-weight hierarchy per page** — don't mix semibold/bold in the same context.
- **Line-height 1.5 minimum for reading text.**
- **No uppercase for labels** — use font-weight instead.
- **Number values always monospace** — makes columns align, makes scanning faster.
- **Truncate long text** — `truncate` class for overflowing titles.

---

## Spacing Scale

Tailwind's default 4px-based scale. Keep it standard but use generously.

| Token | Pixels | Usage |
|-------|--------|-------|
| `0` | 0 | Tighter layout |
| `px` | 1px | Hairlines |
| `0.5` | 2px | Tight spacing |
| `1` | 4px | Small spacing |
| `2` | 8px | Item spacing, icon gaps |
| `3` | 12px | Inside cards, vertical spacing |
| `4` | 16px | Standard inside spacing, padding on cards |
| `5` | 20px | Between sections |
| `6` | 24px | Layout gap large |
| `8` | 32px | Page-level spacing |
| `10` | 40px | Section divider |
| `12` | 48px | Space between major sections |

### Whitespace Rule

> "When in doubt, add space." — cluttered interfaces cannot be saved by features.

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `none` | `0px` | Tables, dividers |
| `sm` | `0.125rem` (2px) | Small elements, badges |
| `base` | `0.375rem` (6px) | Default radius — buttons, inputs, cards |
| `md` | `0.5rem` (8px) | Dialogs, modals, larger cards |
| `lg` | `0.75rem` (12px) | Circular elements (avatar, status dot), large container |
| `xl` | `1rem` (16px) | |
| `full` | `9999px` | Pill buttons, badges |

**Rule:** Same radius on all elements in a group (input + button together should have matching radius).

---

## Shadows

LifeOS uses minimal shadows. No excessive depth.

| Token | Value | Usage |
|-------|-------|-------|
| `none` | `none` | Default state |
| `sm` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle lift (hovered card) |
| `base` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Dropdowns, popovers, elevated cards |
| `md` | `0 4px 6px -1px rgba(0,0,0,0.1)` | Dialogs, modals, sheet |
| `lg` | `0 10px 15px -3px rgba(0,0,0,0.1)` | Large modals, command palette |
| `xl` | `0 20px 25px -5px rgba(0,0,0,0.1)` | Presentation cards |

**Dark mode:** Shadow opacity increased 50% to maintain visibility.

---

## Icons

### Library: Lucide Icons

- **All icons from Lucide**
- Stroke width: 2 (bold enough to be visible)
- Size defaults:
  - `size-4` (16x16) — inline with text
  - `size-5` (20x20) — default icon size in button/input
  - `size-6` (24x24) — sidebar menu icon
  - `size-8` (32x32) — empty states, feature icons
- Icons: use `currentColor` — inherit text color, no custom coloring (except for branding)

---

## Components Specification

### Buttons

```
Variants: primary, secondary, outline, ghost, destructive
Sizes: sm, base, lg, icon
```

| Variant | Background | Text Color | Border | Hover |
|---------|----------|-----------|--------|-------|
| **primary** | `primary` token | `primary-foreground` | None | Darken 10% |
| **secondary** | `secondary` token | `secondary-foreground` | None | Darken secondary |
| **outline** | Transparent | `foreground` | `border` token | bg-muted |
| **ghost** | Transparent | `foreground` | None | bg-muted |
| **destructive** | `destructive` | `destructive-foreground` | None | Darken dest |

- All buttons: `rounded-base` (border-radius 6px)
- All buttons: cursor:pointer, focus:ring-2 focus:ring-accent with offset
- Active press: scale down slightly (0.98x over 100ms)

---

### Inputs

- Height: 40px
- Padding: 8px horizontal, center vertical
- Border: 1px solid, border color, rounded-base
- Focus ring: accent color, 2px ring, 2px offset
- Error state: ring-based destructive color, text destructive
- Placeholder: muted-foreground

---

### Cards

- Background: `bg-card` (white in light, `#171717` in dark)
- Padding: 20px (p-5)
- Border: 1px solid border-color
- Shadow: none (default), sm on hover
- Radius: 8px

---

### Dialog / Modal

- Overlay: `bg-black/50` backdrop (semi-transparent)
- Modal container: bg-background, border-radius 8px, shadow-md
- Header: title 24/32, description muted
- Close button: top-right corner (ghost icon)
- Escape key closes
- Click away closes (controlled by `dialog` primitive)

---

### Table

- Header: muted background, muted-foreground text, uppercase text-xs (uppercase handled by shadcn/shadcn-style-correct)
- Rows: striped by row hover bg-muted
- Spacing: py-2 px-4
- No vertical borders; horizontal dividers

---

## Typography for Long Content

- Paragraph spacing: 1em between paragraphs
- Headings: h2 24px / h3 20px
- Rich text blocks use 16px default text size
- Max-width on long content: 65ch for reading comfort
- Blog/journal entry: max-w-prose

---

## Mobile Responsiveness

### Breakpoints

Tailwind defaults (`sm=640, md=768, lg=1024, xl=1280, 2xl=1536`).

```
Default:  mobile-first (all code renders for small screens first)
sm:       small phones → adjustments
md:       tablet portrait → sidebar visible, grid to 2-column
lg:       tablet landscape → full desktop layout
xl:       desktop → wide layout
```

### Mobile Rules

- Action buttons at bottom of card on mobile; full width
- Tables: flip to vertical cards on mobile
- Sidebar collapses to overlay on mobile (≤768px)
- Touch targets: minimum 44x44px (Apple HIG)
- Inputs: three-quarter screen width on mobile, centering
- Dialogs: full-width on small screens with slide up from bottom

---

## Dark Mode Strategy

- **Class-based toggle** (`dark` class on `<html>`)
- **Default: system preference** (`prefers-color-scheme`)
- **User override:** stored in localStorage
- **Implementation:** Tailwind `dark:` variant
- **Flicker-free:** Inline `<script>` in root layout that reads localStorage and applies class before paint

```html
<script>
  const theme = localStorage.getItem('theme') ??
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  if (theme === 'dark') document.documentElement.classList.add('dark')
</script>
```

### Transition

- Smooth transition `transition-colors` on body — subtle, 200ms

---

## Accessibility (Design-Level)

- **Contrast:** All text meets WCAG AA — minimum 4.5:1 for body text, 3:1 for large text
- **Interaction:** All clicks target visible outline
- **Labels:** Every input has a visible or `aria-label`
- **Headings:** Semantic h1→h6 hierarchy, no heading-level skipping
- **Image:** Every `<img>` must have alt text
- **Motion:** `prefers-reduced-motion` respected. No animation if user has motion reduction
- **Tab order:** Logical. focus-trap in modals and dialogs
- **Screen reader:** Visual-only state accompanied by `aria-live` or visually hidden text

---

## Animation Guidelines

### Principles

- **Default:** Leave animation alone unless adding value
- **Trigger:** Material feel, not decorative — subtle entrance/exit for dialogs
- **Fast:** 150–200ms for micro-interactions (toggles, hover states)
- **Expressive:** 300ms for higher-entropy changes (side-panel, modal)

### Specific Animations

| Interaction | Property | Duration | Easing |
|-------------|---------|----------|--------|
| Button hover | background color | 150ms | ease-out |
| Toggle switch | Transform + background | 150ms | ease-in-out |
| Dialog/modal in | opacity + scale (0.95→1) | 200ms | ease-out |
| Sidebar open/close | transform: translateX | 200ms | ease-in-out |
| Task complete | opacity + strike-through + slide-left + scale-down | 250ms | ease-in-out |
| Loading skeleton | pulse animation → 1.5s | 1.5s infinite | linear |
| Chart bars | scale bottom-to-top | 400ms | ease-out |

---

## File Mapping (Where These Live)

| Concern | Location |
|---------|----------|
| Tailwind config extension (tokens) | `tailwind.config.ts` |
| Global CSS variables (:root) | `src/styles/globals.css` |
| shadcn/ui primitives | `src/components/ui/` |
| Layout components | `src/components/layout/` |
| Feature components | `src/modules/<name>/components/` |

---

*Last updated: 2026-07-29 — LifeOS Phase 0*