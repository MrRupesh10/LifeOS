# DEPENDENCIES.md — Dependency Manifest

> Every dependency installed in LifeOS, why it exists, and its tradeoffs.
> Created: 2026-07-30 — Phase 1

---

## Dependency Philosophy

LifeOS follows three rules for dependencies (R-DEP-02):

1. **Every dependency must justify its existence.** No "nice to have" packages.
2. **Prefer first-party code for business logic.** Dependencies are for cross-cutting concerns (auth, ORM, forms).
3. **Explicit versioning.** No caret ranges that silently upgrade to breaking changes — we use `^` pinned deliberately.

---

## Production Dependencies (18)

### Framework & UI

| Package | Version | Why | Alternatives Considered |
|---------|---------|-----|------------------------|
| **next** | ^15.5.7 | Full-stack React framework. SSR, streaming, Server Components, Server Actions. ADR-001. | Remix, SvelteKit (see ADR-001) |
| **react** | ^19.0.0 | UI library. Server Components, Actions, `use()` hook. Required by Next.js 15. | None — mandatory |
| **react-dom** | ^19.0.0 | DOM renderer for React. | None — mandatory |

### Styling & UI Primitives

| Package | Version | Why? | Alternatives Considered |
|---------|---------|-----|------------------------|
| **tailwindcss** | ^4.3.3 | Utility-first CSS. v4 uses CSS-based config (`@theme inline`), no tailwind.config.ts. ADR-004. | CSS Modules, MUI, Styled Components (see ADR-004) |
| **@tailwindcss/postcss** | ^4.3.3 | PostCSS plugin for Tailwind v4. Replaces the v3 standalone compiler. | — (mandatory for Tailwind v4) |
| **shadcn** | ^4.16.0 | CLI for generating UI primitives. Copy-paste ownership model. | MUI, Ant Design (see ADR-004) |
| **@base-ui/react** | ^1.6.0 | Headless accessible UI primitives. shadcn/ui v2 uses this (NOT Radix). | Radix UI (legacy shadcn) |
| **class-variance-authority** | ^0.7.1 | Variant API for components. Powers `Button({ variant: "primary" })` pattern. | Writing own variant logic (boilerplate) |
| **clsx** | ^2.1.1 | Conditional className merging. Small (228 bytes). | classnames (similar, clsx is faster) |
| **tailwind-merge** | ^3.6.0 | Intelligently merges Tailwind class strings, resolving conflicts. Powers `cn()` utility. | Writing own merger (error-prone) |
| **tw-animate-css** | ^1.4.0 | CSS animation utilities for Tailwind. Animates dropdowns, modals, sidebar. | Framer Motion (heavier, JS-based) |
| **lucide-react** | ^1.27.0 | Beautiful MIT-licensed icon set. 1,200+ icons, tree-shaken. ADR-004 choice. | React Icons (heavier), Heroicons (smaller set) |
| **next-themes** | ^0.4.6 | Theme toggle with flash prevention. Saves to localStorage + cookie, SSR-safe. ADR-010. | Manual cookie implementation (reinventing wheel) |

### Data & State Management

| Package | Version | Why? | Alternatives Considered |
|---------|---------|-----|------------------------|
| **@tanstack/react-query** | ^5.101.4 | Server data caching + cache invalidation. Stale-while-revalidate strategy. ADR-008 governance. | SWR (less powerful), fetch + useEffect (naïve) |
| **zustand** | ^5.0.14 | Cross-tree UI state (sidebar collapse). 2KB escape hatch, not for server data. ADR-009. | Redux (overkill), Context (re-render penalty) |

### Forms & Validation

| Package | Version | Why? | Alternatives Considered |
|---------|---------|-----|------------------------|
| **react-hook-form** | ^7.83.0 | Performant form state management. Uncontrolled inputs = zero re-renders. | Formik (re-renders on every keystroke) |
| **@hookform/resolvers** | ^5.5.7 | Binding layer: react-hook-form + Zod. | Manual adapter (needless boilerplate) |
| **zod** | ^4.4.3 | Schema-based validation, shared client + server. TypeScript-first. ADR implies this. | Yup (partial TS support), Valibot (smaller, less ecosystem) |

### Database (Config Only — No Migrations in Phase 1)

| Package | Version | Why? | Alternatives Considered |
|---------|---------|-----|------------------------|
| **drizzle-orm** | ^0.45.2 | Type-safe SQL ORM. Schema → TypeScript types, no code gen. ADR-002. | Prisma (heavy), Kysely (no schema def), raw SQL (no types) |
| **postgres** | ^3.4.9 | Native PostgreSQL driver for serverless/node. Chosen over `@neondatabase/serverless` to avoid vendor lock. | @neondatabase/serverless (Neon-specific) |

### Notifications

| Package | Version | Why? | Alternatives Considered |
|---------|---------|-----|------------------------|
| **sonner** | ^2.0.7 | Toast notifications. Rich colors, React-native-like API, theme-aware. | react-hot-toast (less polished) |

### Environment

| Package | Version | Why? | Alternatives Considered |
|---------|---------|-----|------------------------|
| **@t3-oss/env-nextjs** | ^0.13.11 | Fail-fast env validation. Zod schema validates env at build time. | `process.env.X || throw` (runtime discovery) |

---

## Dev Dependencies (12)

| Package | Version | Why? | Layer |
|---------|---------|-----|-------|
| **typescript** | ^5 | Static type checking, IDE IntelliSense. Strict mode. | Compiler |
| **eslint** | ^9.39.5 | Linting framework. ESLint 9 flat config. | Linting |
| **@eslint/js** | ^10.0.1 | ESLint recommended rules for JS. Flat config compatible. | Linting |
| **@next/eslint-plugin-next** | ^15.5.22 | Next.js-specific ESLint rules (flat config). Core web vitals + recommended. | Linting |
| **prettier** | ^3.9.6 | Opinionated code formatter. No disagreements. | Formatting |
| **prettier-plugin-tailwindcss** | ^0.8.1 | Auto-sorts Tailwind classes. Consistent ordering. | Formatting |
| **husky** | ^9.1.7 | Git hooks runner. Pre-commit sprint lint+format. | Git hooks |
| **lint-staged** | ^17.2.0 | Runs linting/formatters only on staged files. Fast CI. | Git hooks |
| **@types/node** | ^20 | Node.js type definitions. | Types |
| **@types/react** | ^19 | React type definitions. | Types |
| **@types/react-dom** | ^19 | React DOM type definitions. | Types |
| **drizzle-kit** | ^0.31.10 | Drizzle schema -> SQL migration generator. Config-only til Phase 4. | Migrations |

---

## What We Explicitly Do NOT Use

| Package | Why We Don't Use It |
|---------|---------------------|
| **better-auth** (Phase 1) | Moved to auth phase (Phase 3). Config placeholder only. |
| **@neondatabase/serverless** | Vendor lock-in. `postgres` driver is universal. |
| **eslint-config-next** | Legacy package incompatible with ESLint 9 flat config. |
| **@radix-ui/* ** | superceded by @base-ui/react (shadcn/ui v2). Not actively used. |
| **framer-motion** | Added when needed for meaningful transitions. Not pre-installed. |
| **recharts** | Charts are Phase 10+ — added then, not now. |
| **vitest** | Testing infra added in Phase 2. |
| **@testing-library/react** | See above. |

---

## Audit Notes

- **Total installed:** 18 production + 12 dev = 30 packages
- **Bundle impact:** Tree-shaken by Next.js at build. Only used code ships.
- **Security:** No critical vulnerabilities as of 2026-07-30.
- **License:** All MIT, MIT-compatible, or ISC.
- **Next audit date:** Before any new dependency is added.
- **Audit command:** `pnpm audit`

---

*Last updated: 2026-07-30 — LifeOS Phase 1*