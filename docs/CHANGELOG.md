# Changelog

All notable changes to LifeOS are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

---

## [0.1.0-alpha] — 2026-07-30

### Phase 1 Complete — Project Foundation

**14 milestones delivered. 30 packages. 3 routes. 14 ADRs. 15 docs.**

#### M1 — Next.js 15 Scaffold
- Next.js 15.5 App Router, React 19, TypeScript strict
- Tailwind CSS v4 (CSS-based `@theme inline`, no `tailwind.config.ts`)

#### M2 — Dependencies Installed
- 18 production: Next, React, shadcn/ui v2, TanStack Query, Zustand, next-themes, Sonner, Drizzle, Zod, React Hook Form, etc.
- 12 dev: ESLint 9, Prettier, Husky, lint-staged, Drizzle Kit, TypeScript

#### M3 — shadcn/ui v2 Initialized
- New York style (base-nova), neutral colors, Base UI primitives
- First component: Button
- Two additional components added in M9: Dialog, DropdownMenu

#### M4 — Tooling Configured
- ESLint 9 flat config (`@next/eslint-plugin-next` + `@eslint/js`)
- Prettier 3 + `prettier-plugin-tailwindcss`, printWidth 100
- Husky 9 + lint-staged: `*.{ts,tsx}` → eslint --fix + prettier --write

#### M5 — Environment Validation
- `@t3-oss/env-nextjs` + Zod schema at `src/lib/config/env.ts`
- Validates: NODE_ENV, DATABASE_URL, NEXT_PUBLIC_APP_URL

#### M6 — Production Folder Structure
- 84 directories with .gitkeep purpose docs
- Module boundary architecture: modules/ for features, components/ui for primitives
- `docs/FOLDER_STRUCTURE.md` — complete directory map

#### M7 — Core Configuration
- Geist Sans + Mono fonts via `next/font/google`
- `next-themes` ThemeProvider — class strategy, system-default
- `siteConfig` object — single source for branding, metadata, Open Graph
- Route groups: `(marketing)` for public, `(dashboard)` for authenticated shell

#### M8 — Base Page Files
- `loading.tsx` — full-page pulse skeleton
- `error.tsx` — client error boundary with retry + support link
- `global-error.tsx` — no-Tailwind, inline CSS, self-contained html/body
- `not-found.tsx` — 404 messaging + link to /
- `(marketing)/page.tsx` — landing page placeholder
- `(dashboard)/dashboard/page.tsx` — dashboard placeholder

#### M9 — Interactive Layout Shell
- `src/stores/ui/sidebar-store.ts` — Zustand store (isCollapsed, isMobileOpen, close-on-Escape)
- `src/config/navigation.ts` — centralized nav registry (13 modules, 14 lucide-react icons)
- `src/config/layout.ts` — layout constants (sidebar widths, transition, header height)
- Sidebar: desktop expand/collapse (64↔256px, 200ms), mobile drawer with blur backdrop
- Header: hamburger (mobile), breadcrumb, search trigger (⌘K), theme toggle
- Theme toggle: shadcn DropdownMenu — Light / Dark / System with Check indicator
- Command Palette: ⌘K/CTRL+K global listener, Base UI Dialog placeholder
- `src/types/` — common.ts (Nullable, DeepPartial, etc.), navigation.ts (NavItem, NavGroup), theme.ts (ThemeMode)
- `src/providers/query.tsx` — TanStack Query factory (server-safe, fresh per request)
- `src/providers/index.tsx` — composite AppProviders (Theme + Query + Sonner)

#### M10 — Providers Setup
- ThemeProvider, QueryClientProvider (factory pattern), Sonner `<Toaster>`
- Composition root at `src/providers/index.tsx` — single wrapping point
- Auth provider placeholder deferred to Phase 3

#### M11 — Connect Everything in Root Layout
- Root layout: Geist fonts → `<html>` → `<body>` → `<AppProviders>`
- Dashboard layout: `<AppShell>` with responsive sidebar, header, footer
- Route groups: (marketing) — minimal layout; (dashboard) — full shell

#### M12 — Verify and Test
- `pnpm format:check` — ✅ All files pass
- `pnpm typecheck` — ✅ Zero errors
- `pnpm lint` — ✅ Zero warnings
- `pnpm build` — ✅ 3 static routes generated (/, /_not-found, /dashboard)
- Total first-load JS: 102 kB shared + per-route chunks (< 1 kB each)

#### Documentation (M13)
- `docs/DEPENDENCIES.md` — 30 packages with justifications and alternatives
- `.claude/DECISIONS.md` — 14 ADRs (001 through 014)
- `docs/PROJECT_STATUS.md` — Phase 1 complete tracker
- `docs/FOLDER_STRUCTURE.md` — updated with final file locations
- `docs/CHANGELOG.md` — this file (complete)
- `docs/Engineering-Handbook.md` — updated with AppProviders and siteConfig patterns

#### New ADRs (M13)
- **ADR-009:** Zustand for sidebar collapse (cross-tree UI state)
- **ADR-010:** next-themes for theme persistence (flash prevention)
- **ADR-012:** Geist fonts via next/font/google
- **ADR-012:** shadcn/ui New York style (base-nova)
- **ADR-013:** Sonner for toast notifications
- **ADR-014:** TanStack Query factory pattern (server-safe QueryClient)

### Active Technology Configuration

| Layer | Choice | Key Detail |
|-------|--------|-----------|
| Styling | Tailwind CSS v4 | CSS-based `@theme inline`, NO `tailwind.config.ts` |
| UI | shadcn/ui v2 | `@base-ui/react` (NOT Radix), New York base-nova |
| Linting | ESLint 9 | Flat config, NO `eslint-config-next` |
| Package | pnpm 11 | `allowBuilds` for `sharp`, `unrs-resolver` |
| Fonts | Geist Sans + Mono | `next/font/google` with CSS variables |

---

## [0.0.1] — 2026-07-29

### Added
- Complete engineering documentation (Phase 0)
  - README.md, Architecture.md, Roadmap.md, DATABASE.md, API.md, CONTRIBUTING.md, FEATURES.md, SECURITY.md
- Claude configuration files
  - CLAUDE.md, RULES.md, DECISIONS.md (ADR-001–008), MCP.md, SKILLS.md
- Complete folder structure skeleton for full Next.js app
- Supplementary Phase 0 documentation
  - PRD.md, Design System.md, Definition of Done.md, PROJECT_STATUS.md

---

*Last updated: 2026-07-30 — LifeOS Phase 1 Complete*