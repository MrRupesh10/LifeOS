# DECISIONS.md — Architectural Decision Records

> Every meaningful architectural decision is recorded here with:
> - **Date** of decision
> - **Context** — what the problem is
> - **Decision** — what we chose and why
> - **Alternatives** considered — what else we could have done
> - **Consequences** — upsides and downsides of this choice

---

## ADR-001: Next.js 15 App Router

**Date:** 2026-07-29  
**Status:** Accepted  

### Context
We need a full-stack framework that handles SSR, static generation, API routes, file-based routing, and server components. We want to minimize the "framework glue" and focus on product code.

### Decision: Next.js 15 (App Router)

### Why
1. **Unified full-stack** — frontend + backend in one project, one deployment
2. **Server Components by default** — React on the server, zero JS shipped by default. This is a paradigm shift, not just a React version bump
3. **Streaming and Suspense** — load data incrementally, not shower-the-user-with-a-spinner
4. **File-system routing** — zero routing library configuration, opinionated and clean
5. **Vercel deployment** — one-click production deployments, edge-first
6. **Industry standard** — production-tested at Vercel, used by companies shipping real products
7. **React 19** — compiler-first, actions, use() hook, <form> now a React first-class citizen

### Alternatives Considered

| Alternative | Why Not |
|-------------|---------|
| **Remix** | Smaller ecosystem, less community. Similar ideas, but Next.js won the market share |
| **SvelteKit** | We're learning React ecosystem; choosing a different framework limits job readiness |
| **T3 Stack (tRPC + Next)** | We're using Server Actions instead of tRPC; the `app/` Router already handles this |
| **Monorepo with separate API** | Overkill for a personal project; adds build complexity for zero benefit |

### Tradeoffs

| Pro | Con |
|-----|-----|
| One repo, one deployment | Tight coupling to Vercel for optimal performance |
| Server Components reduce JS bundle | React ecosystem churn; these APIs are still evolving |
| Huge community + tutorials | App Router upgrade path has been painful for many |

---

## ADR-002: PostgreSQL + Drizzle ORM

**Date:** 2026-07-29  
**Status:** Pre-database

### Context

We need database persistence. This is a relationship-rich application: tasks share projects, goals link to habits, expenses link to budgets. We need multi-table joins, complex queries, data integrity enforcement, and proper migration tooling — all things that spreadsheet-style databases (MongoDB) struggle with.

### Decision: PostgreSQL + Drizzle ORM + Neon

**Why PostgreSQL**
- **Relations** — foreign keys, joins, constraints, transactions (it's relational)
- **JSONB** — flexible semi-structured data when needed (notes, journal entries) that normalize elsewhere
- **Full-text search** — possible `pg_trgm` for journal search
- **Indexes** — partial indexes, composite indexes, covering indexes
- **Migratability** — table-based, production-tested alters
- **Neon** — serverless PostgreSQL, one-click, free tier sufficient for dev

**Why Drizzle**
- **Type-safe queries** — TypeScript types derive from schema, no code-gen
- **SQL-like API** — feels like writing SQL, not an abstraction layer (Prisma's "hide SQL" model breaks for complex queries)
- **Migrations** — Drizzle Kit generates SQL migration files, and we can version control them
- **Performance** — zero runtime building queries (Prisma generates SQL, but has a thick runtime client)
- **Light-touch** — not as heavy as Prisma, not as light as raw SQL

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|-----------------|
| **Prisma** | Thick client (heavy runtime), migration tooling is good but opinionated, custom SQL is awkward. Drizzle's SQL-like API fits better for a learning project |
| **Raw SQL** | No type safety for query results; too much boilerplate for common operations |
| **Kysely** | Good SQL-building, but Drizzle has better schema definition and migration tooling |
| **MongoDB** | Not relational; poor fit for this pyramid of data; denormalizing would be painful |

### Tradeoffs

| Pro | Con |
|-----|-----|
| Type-safe queries without code-gen | Drizzle is younger than Prisma; smaller community yet |
| SQL-like API → portable knowledge you'll use across any SQL DB | Migration tooling isn't as mature as Prisma Migrate |
| Best performance of any TS ORM | No visual database explorer (Prisma Studio) — use Neon Console |

---

## ADR-003: Better Auth

**Date:** 2026-07-29  
**Status:** Preemptive

### Context
This is a personal-operating system. A user's tasks, journals, expenses — all data must require **authorized access**. The authentication library must handle: registration, email verification, login, logout, token management, session management, password reset, and eventually social login (Google/GitHub).

### Decision: Better Auth

**Why**
- It's the modern, type-safe alternative to Auth.js (NextAuth v5)
- Built specifically for Next.js App Router
- Type-safe API: all auth hooks are typed
- Built-in database adapters for Drizzle, Prisma, PostgreSQL
- Session management using cookies
- OAuth support when needed
- No `getServerSession`, no complex core

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|-----------------|
| **NextAuth.js / Auth.js** | V5 transition is messy; v4 is stable but lack of App Router integration. Better Auth is apples for Next.js App Router |
| **Clerk** | Proprietary, paid. We don't want third-party dependency for auth. Portability is important |
| **Lucia v3 + Oslo** | Lucia was sunset. Oslo is low-level, requires building more auth infrastructure |
| **Roll own** | Possible, but auth is security-critical and shouldn't be homegrown when established solutions exist |

### Tradeoffs

| Pro | Con |
|-----|-----|
| Modern, fast, type-safe | Smaller community/case-studies vs Auth.js |
| Built for App Router | Still evolving rapidly |
| Good TypeScript support | Documentation may have gaps for edge cases |

---

## ADR-004: Tailwind CSS + shadcn/ui

**Date:** 2026-07-29  
**Status:** Preemptive

### Context
The design philosophy is Apple / Linear / Notion — minimal, professional, whitespace, calm. We need a styling approach that scales, is maintainable, and produces professional-quality UI.

### Decision: Tailwind CSS + shadcn/ui

**Why Tailwind**
- Co-located style: styles live with the component, not a distant `.css` file
- Design system tokens: consistent design via configurable (spacing, colors, shadows, typography)
- No naming: no BEM methodology overhead, no naming collisions
- Production: tree-shaken, so only used classes ship to browser
- Tooling: VSCode IntelliSense, Prettier auto-sorting
- Community: the de facto standard when using React in 2025+

**Why shadcn/ui**
- Copy-paste, not install: you own the code; you customize it
- Accessibility-first: Radix UI under the hood, ARIA-compliant primitives
- Beautiful default: matches our Apple/Linear vibes
- TypeScript: full type definitions out of the box
- Extensible: the components are just yours — modify freely

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|-----------------|
| **CSS Modules** | Not scalable to multiple themes; more overhead to maintain |
| **MUI** | Heavier, Material theme doesn't match Apple/Linear aesthetic. |
| **Ant Design** | Even heavier, default Chinese-market design. Overkill and ugly default |
| **Styled Components** | Runtime CSS injection, outdated for React Server Components |

### Tradeoffs — Tailwind

| Pro | Con |
|-----|-----|
| Co-located, fast iteration | Long className strings (mitigated: `cn()` merger) |
| Design system built-in | Tailwind-specific knowledge needed, but it's a marketable skill |
| No CSS shipped | Requires discipline to edit/extract abstractions |

### Tradeoffs — shadcn/ui

| Pro | Con |
|-----|-----|
| You own the code | Version updates are manual |
| Radix accessibility baked in | Minimal component set (no data table, no command palette) |
| Easy to modify | Some components feel a bit same-y — but customizing is the point |

---

## ADR-005: This Folder Structure

**Date:** 2026-07-29  
**Status:** Accepted

### Context
We're building 13+ modules, each with components, hooks, validation, and server actions. Without careful structure, this collapses into unmaintainable.

### Decision: Modules-based folder structure
- `src/modules/<name>/` — feature modules, isolated
- `src/app/` — routing only
- `src/components/` — shared primitives
- `src/lib/` — cross-module utilities (db, auth, etc.)
- `src/hooks/` — cross-module Hooks

### Why This Structure

- **Isolation**: Modules can be added/removed without touching other modules
- **Scalability**: structure stays the same at 10 modules and 50
- **Separation of Concern**: routing ≠ business logic ≠ primitives
- **Best Practice**: pattern used by Cal.com, Dub.co, and Next.js showcase projects

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|-----------------|
| **Feature-first** (src/feature/<name>/**) | No way to split shared infrastructure |
| **Type-based** (src/components/all-tasks-components/) | Does not scale to 15+ features |
| **App organization** (all features inside app/) | App Router convention bleeds |
| **pages/ router** | Legacy approach; App Router is the future |

---

## ADR-006: React Server Components + Server Actions - Default

**Date:** 2026-07-29  
**Status:** Accepted

### Context
We need the best performance and the best developer experience. We're building 15 modules and some will have complex client-side interactivity.

### Decision

- Server Components by default
- Server Actions for mutations
- `'use client'` when browser interactivity is needed

### Why
- **Performance**: server components render to static markup — zero bytes of client UI
- **DX**: Server Actions reduce API route boilerplate for mutations
- **Remaining**: When we need client-side interactivity (forms, modals, editors), we step down gracefully

### Tradeoffs

| Pro | Con |
|-----|-----|
| Less client JS | Mental model is new; no tutorials for "avoid this" |
| Simpler mutations (no fetch) | Server Action return-type serialization is still work-in-progress |
| Progressive enhancement | Requires careful separation of "client" vs "server" files |

---

## ADR-007: pnpm (Planned)

**Date:** 2026-07-29  
**Status:** Pre-emptive

### Decision
Use pnpm as package manager.

### Why
- Fast install; hard-links packages from global store
- No phantom dependencies — cannot import what you didn't install
- Best workspace support if we add MCP servers or extract libs
- Industry standard for new Next.js projects on Vercel

### Alternatives

| Alternative | Why Not Selected |
|-------------|-----------------|
| npm | Slow, phantom dependency issues |
| Yarn | Less common for new project in 2025; pnpm has more momentum |
| Bun | Still maturing; less tooling support |

---

## ADR-008: Zustand Only When Needed

**Date:** 2026-07-29  
**Status:** Accepted

### Context

Most "state management" in React is actually server-sourced data caching dressed in a state manager. We use **TanStack Query** for all async (server) data: tasks, habits, journal entries, notes, etc. Only unique client-side state remaining is:
- Open/close state of modals or dialogs → React state (local)
- Theme toggle → localStorage + cookie
- Session → Better Auth hook
- Cross-component UI states that can't be done via props → (rare case)

### Decision

- Zustand reserved as an **escape hatch** — if we find a case that truly needs non-server, non-prop state across the component tree, Zustand goes there
- Do NOT use Zustand for data fetched from the server — TanStack Query handles that

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|-----------------|
| Redux | Overkill; boilerplate. Zustand is a 2KB store that is far simpler |
| Jotai | Similar to Zustand; Zustand is simpler for our needs |
| Context + useReducer | Context causes rerender of entire tree; it's a mechanism, not a performant state manager |

---

## ADR-009: Zustand for Sidebar Collapse State

**Date:** 2026-07-30  
**Status:** Accepted

### Context

The sidebar collapse state is a **cross-tree UI concern**: the Header needs it (hamburger/mobile toggle), the Sidebar needs it (width, icon-only mode), the AppShell needs it (content margin). Prop drilling this data 3+ levels deep violates Separation of Concern and the single-direction data flow principle.

### Decision: Zustand store at `src/stores/ui/sidebar-store.ts`

- `isCollapsed: boolean` — desktop sidebar collapse (64px vs 256px)
- `isMobileOpen: boolean` — mobile drawer overlay open/close
- Actions: `openMobile()`, `closeMobile()`, `toggleCollapsed()`
- No provider required — components subscribe directly via `useSidebarStore()`
- Mobile drawer closes on: link click, backdrop click (via event bubbling), Escape key (`useEffect` + `document.addEventListener("keydown")`)

### Why Zustand over React Context

- Context with `useContext` forces re-render of **entire** component subtree on any state change
- Zustand's selector pattern means only components reading `isCollapsed` re-render when it changes
- Zero providers to add to the component tree — the store is a module-level singleton

### Tradeoffs

| Pro | Con |
|-----|-----|
| Fine-grained subscriptions (no wasted renders) | Another pattern to learn (small API surface) |
| No provider component needed in the tree | Must namespace stores carefully (`stores/ui/`, `stores/data/`) |
| Simple API — 3 functions on the store | Not suitable for server-fetched data (TanStack Query domain) |

---

## ADR-010: next-themes for Theme Persistence

**Date:** 2026-07-30  
**Status:** Accepted

### Context

A dark/light theme toggle must:
1. Apply immediately without a flash of light theme on page load (SSR-safe)
2. Persist across page refreshes
3. Respect the OS-level preference (`prefers-color-scheme`)
4. Work with Tailwind v4's dark mode variant (`dark:` via `@custom-variant`)

### Decision: next-themes with `attribute="class"` strategy

- **Storage:** Cookie (read by server for SSR-safe initial render) + `localStorage` (client persistence)
- **Default:** `defaultTheme="system"` — follows OS preference until user explicitly picks
- **Anti-flash:** `disableTransitionOnChange` — prevents the 200ms CSS transition flash when toggling
- **System option:** `enableSystem` — user sees "System" as the third option alongside Light/Dark

### Why next-themes

- **Flash prevention is the hard problem.** The `<script>` tag injected into `<head>` reads the cookie **before** the first paint. Manual cookie implementations almost always flash because React can't inject a blocking script before render.
- **Used by shadcn/ui**, Vercel's Next.js docs, and the broader ecosystem
- **Zero-config drop-in** — wraps `<html>`, exports `useTheme()`

### Implementation Note

We use a shadcn DropdownMenu with three radio-style options (Light / Dark / System) — not the common two-way toggle button. This gives the user a visible menu with all choices at once: one click instead of 1–3 blind clicks.

### Alternatives Considered

| Alternative | Why Not |
|-------------|---------|
| Manual cookie + `<script>` | Flash-free requires a blocking script before React hydrates; next-themes already solved this |
| Tailwind forced dark mode | No user preference persistence; ignores OS system preference |
| CSS `prefers-color-shade` only | User can't override; company palette may not match OS |

---

## ADR-011: Geist Font via next/font/google

**Date:** 2026-07-30  
**Status:** Accepted

### Decision: Geist Sans (primary) + Geist Mono (code)

Both loaded from `next/font/google` with CSS custom properties: `--font-sans` and `--font-mono`.

### Why Geist

1. **Vercel's design language typography.** Geist was designed for clean digital interfaces at Vercel — it's the default font in new Next.js projects
2. **Performance.** `next/font/google` at loading automatically self-hosts at build time, serving only the used subsets with `font-display:swap`. Zero external Google Font requests in production
3. **Matching mono available.** Geist Mono for code, terminal, JSON previews — consistent family instead of mixing sans+mono from different designers
4. **Inspired by Linear** — the design we admire uses a minimal, slightly condensed sans-serif profile: Geist hits same notes

### Alternatives Considered

| Alternative | Why Not |
|-------------|---------|
| **Inter** | Good, but Geist is newer and purpose-built for Next.js. Inter has no matching mono variant |
| **System font stack** | Inconsistent rendering across macOS/Windows/Linux; different sizing per OS |
| **JetBrains Mono** | Excellent monospace, but no matching sans — we'd need two families, two design languages |
| **IBM Plex** | More distinctive character; Geist is cleaner for the neutral, calendar-driven aesthetic we want |

---

## ADR-012: shadcn/ui New York Style (base-nova)

**Date:** 2026-07-30  
**Status:** Accepted

### Decision: New York style ('base-nova'), Neutral color palette, CSS custom variables

Selected at `pnpm dlx shadcn@latest init` time and locked into `components.json`.

### Why New York (base-nova)

1. **More minimal than Default** — flatter, less border-radius, less busy corners. Matches the Apple/Linear/Notion aesthetic
2. **Base UI** — shadcn/ui v2 uses `@base-ui/react` (not Radix UI). Base UI is the React 19 primitives suite built by MUI (the MUI team). Radix is sunset. We want future-proof component primitives
3. **Neutral hue** — no forced blue/purple. We build our own palette on a neutral base
4. **CSS variables for everything** — changing the entire color scheme requires editing ~8 lines in `_globals.css` with oklch

### Connection Note

- shadcn v2 + Base UI means **components do NOT support `asChild`** (that was a Radidix compound). Base UI uses a `render` prop instead.
- **Button** does not accept `asChild`. To render a `<button>` as a `<Link>`, use `render={<Link href="...">...</Link>}` or use a plain
- Installed components: Button, Dialog, DropdownMenu. Install new shadcn components with `pnpm dlx shadcn@latest add <name> --yes --overwrite`.

### Alternatives

| Alternative | Why Not |
|-------------|---------|
| Default (Radix) | Less modern visual; Radix will be superseded by Base UI long-term |
| Zinc/Slate palette | Close but not neutral; neutral gives us fuller control over light/dark mapping |
| Custom CSS (no library) | Reinventing accessible primitives (Menu focus traps, Dialog esc, etc.) is wasted engineering |

---

## ADR-013: Sonner for Toast Notifications

**Date:** 2026-07-30  
**Status:** Accepted

### Context

LifeOS needs toast notifications for: action confirmations ("Task created"), error alerts ("Failed to save"), and warnings. The library must:
- Professional out of the box — no developer-needed customization to look good
- Support light and dark themes seamlessly
- Be small — it's a notification utility, not a UI framework

### Decision: Sonner

- Mounted globally inside `<AppProviders>` at bottom-right with `closeButton`, `richColors`, `theme="system"`
- `richColors` gives professional color-coded states (green success, red error, sie warning, blue info)
- `theme="system"` follows `next-themes` theme automatically — the toasts respect the current theme
- `closeButton` provides explicit dismiss alongside auto-dismiss timer

### Server Action Integration Pattern

Server Actions return `{ data } | { error }` union types. Client hooks call `toast.error(error)` or `toast.success(msg)` based on the return type
 — no boilerplate in the module code.

### Alternatives Considered

| Alternative | Why Not Selected |
|-------------|-----------------|
| **react-hot-toast** | Functional but less polished defaults; Sour is prettier with zero effort |
| **Radix Toast** | Full control but requires building the UI wrapper — time suck for Phase 1 |
| **Native alert()** | Unacceptable UX for a professional application |

---

## ADR-014: TanStack Query — Server-Safe Factory Pattern

**Date:** 2026-07-30  
**Status:** Accepted

### Context

TanStack Query's default "one global QueryClient" pattern causes cross-request data leaks on the server: if you reuse a single QueryClient, user A's prefetched data can leak into user B's rendered response. We need a pattern that:
1. Creates a fresh QueryClient for **each server request**
2. Reuses a single QueryClient instance across **client-side renders** (performance)
3. Allows server-side prefectching in the future (those results dehydrate to the client)

### Decision: Factory Pattern in `src/providers/query.tsx`

```typescript
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 60_000 } }
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient(): QueryClient {
  if (typeof window === "undefined") return makeQueryClient()
  // Server: fresh client per request → no cross-request leakage
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  // Client: singleton → one instance for the lifetime of the tab
  return browserQueryClient
}
```

- **`typeof window === "undefine"`** → server → `makeQueryClient()` creates a new instance per request
- **Browser** → singleton pattern → reuses the same instance across renders
- **`staleTime`: 60 seconds** — data stays "fresh" for 1 minute; prevents unnecessary network requests on rapid navigation
- **`straightOnWindow Focus: false`** — in baby
- Don't refetch data when the user tabs back in (MUSTUNE — our data doesn't change that fast)

### Why Not Just `new QueryClient({ ... })` Inline?

That creates a new client on every React render — so every component re-render destroys the cache and creates a new one. The factory means: **create once, resets**. Inline `new` means: **create every time, waste O of cache work**.

### Why Not Skip TanStack Query and Use `fetch()` in Server Components Only?

- RSC `fetch()` covers server-side data only
- Client-side mutations (createTask, toggleHabit) need cache invalidation
- Window-`useEffect` fetch loops are the "fetch on mount" anti-pattern
- TanStack Query handlesities, polling, retry, garbage collection — all of which LifeOS grows into

---

*Last updated: 2026-07-30 — Life Thin Phase 1*