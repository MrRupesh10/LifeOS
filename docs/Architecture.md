# Architecture — LifeOS System Design

> **Version:** 0.1.0-alpha  
> **Last updated:** 2026-07-29  
> **Status:** Phase 0 — Documentation  

---

## Architecture Overview

LifeOS is a **modular monolithic** web application with a thin routing layer, isolated feature modules, and a shared infrastructure layer.

```
                              ┌──────────────────────────┐
                              │        User (Browser)      │
                              └────────────┬─────────────┘
                                           │ HTTPS
                                           ▼
┌──────────────────────────────────────────────────────────┐
│                     Vercel Edge (CDN)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ Static Cache │  │ ISR Cache    │  │ Middleware Auth   │ │
│  └─────────────┘  └──────────────┘  └──────────────────┘ │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│                  Next.js 15 App Router                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    app/                               │  │
│  │  (auth)/          (dashboard)/        api/            │  │
│  │    login/           dashboard/        route-handlers  │  │
│  │    register/        tasks/                            │  │
│  │                     ...14 modules...                  │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                  modules/                             │  │
│  │                                                       │  │
│  │  tasks/   habits/   journal/   notes/   projects/     │  │
│  │    │         │         │          │          │         │  │
│  │    ├─ actions.ts                                       │  │
│  │    ├─ types.ts                                         │  │
│  │    ├─ validation.ts                                    │  │
│  │    ├─ components/                                      │  │
│  │    └─ hooks/                                           │  │
│  │                                                       │  │
│  │  goals/   calendar/  interviews/  expenses/  resume/   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    lib/                               │  │
│  │                                                       │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐ ┌────────┐  │  │
│  │  │ db/     │ │ auth/    │ │ ai/         │ │ utils/  │  │  │
│  │  │ Drizzle │ │ Better   │ │ providers/  │ │ helpers │  │  │
│  │  │ schema  │ │ Auth     │ │ nvidia/     │ └────────┘  │  │
│  │  │ client   │ └──────────┘ │ ollama/    │              │  │
│  │  └─────────┘             │ │ openrouter/ │              │  │
│  │                          │ └───────────┘              │  │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐              │  │
│  │  │ email/  │ │ storage/ │ │ constants/│              │  │
│  │  └─────────┘ └──────────┘ └───────────┘              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               components/                             │  │
│  │                                                       │  │
│  │  ┌────────┐  ┌─────────────┐  ┌───────────────────┐  │  │
│  │  │ ui/    │  │ layout/      │  │ shared/            │  │  │
│  │  │ button│  │ sidebar      │  │ date-picker        │  │  │
│  │  │ card  │  │ header       │  │ command-palette   │  │  │
│  │  │ input │  │ shell        │  │ rich-editor        │  │  │
│  │  │ dialog│  └─────────────┘  │ drag-sort          │  │  │
│  │  └────────┘                   └───────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │        Vercel Serverless       │
              │  ┌─────────────┐ ┌──────────┐ │
              │  │ API Routes  │ │ Server    │ │
              │  │ (Route      │ │ Actions   │ │
              │  │  Handlers)  │ │           │ │
              │  └─────────────┘ └──────────┘ │
              └───────────────┬───────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │      Neon PostgreSQL           │
              │  (Serverless Database)         │
              │                              │
              │  ┌────────┐  ┌────────────┐  │
              │  │ Data   │  │ Connection │  │
              │  │ Store  │  │ Pool       │  │
              │  └────────┘  └────────────┘  │
              └──────────────────────────────┘
```

---

## Frontend Architecture

### Rendering Strategy

```
Every page starts as a SERVER COMPONENT.

User lands on /dashboard
         │
         ▼
  Server Component renders layout (no client JS required)
         │
         ├── Static content? → HTML on server (0 client JS)
         │
         ├── Need interactivity? → Marked 'use client'
         │   (Client component loads minimal JS)
         │
         └── Complex client state?
             Use TanStack Query for async, useState for local
```

**Server Components by default.** Only `'use client'` when browser interactivity is required.

### Component Hierarchy

```
<RootLayout>
│
├── <AuthProvider>              # Better Auth session context
│   └── <QueryClientProvider>   # TanStack Query
│       └── <ThemeProvider>     # Light/dark theme
│           └── <LayoutShell>   # Sidebar + Content
│               │
│               ├── <Sidebar>
│               │   ├── UserProfile
│               │   ├── Navigation
│               │   └── QuickActions
│               │
│               └── <MainContent>
│                   ├── <Header>
│                   │   ├── Breadcrumb
│                   │   ├── Search
│                   │   └── Notifications
│                   │
│                   └── <PageContent>   # Module-specific
│                       ├── Server Component (data fetch)
│                       ├── Client Component (interactivity)
│                       └── Loading / Error / Empty states
```

### Route Architecture

```
app/
├── layout.tsx                    # Root layout (providers)
├── page.tsx                      # Landing → redirects to /dashboard
│
├── (auth)/                       # Unauthenticated route group
│   ├── layout.tsx                # Auth layout (minimal, centered)
│   ├── login/page.tsx            # Login form
│   ├── register/page.tsx         # Registration form
│   ├── forgot-password/page.tsx  # Password reset request
│   └── reset-password/page.tsx   # Reset password with token
│
├── (dashboard)/                      # Authenticated route group
│   ├── layout.tsx                    # Dashboard layout (sidebar + header)
│   ├── dashboard/page.tsx            # Main dashboard
│   │   ├── tasks/page.tsx            # Task list
│   │   ├── habits/page.tsx           # Habit tracker
│   │   ├── journal/page.tsx          # Daily journal
│   │   ├── notes/page.tsx            # Notes
│   │   ├── projects/page.tsx         # Project manager
│   │   ├── goals/page.tsx            # Goal tracker
│   │   ├── calendar/page.tsx         # Calendar view
│   │   ├── interviews/page.tsx       # Interview tracker
│   │   ├── expenses/page.tsx         # Expense tracking
│   │   ├── resume/page.tsx           # Resume manager
│   │   ├── analytics/page.tsx        # Analytics dashboard
│   │   └── settings/page.tsx         # User settings
│
└── api/                          # Route handlers for external APIs
    ├── webhooks/                 # External webhook endpoints
    └── health/route.ts           # Health check endpoint
```

---

## Backend Architecture

### Data Flow

```
  Browser                  Server (Next.js)              Database
  ───────                  ────────────────              ────────

  ┌─────────┐    HTTP     ┌──────────────┐   SQL    ┌──────────┐
  │ React   │◄──────────►│ Route Handler │◄───────►│ PostgreSQL│
  │ Component│  (JSON)    │   or Action   │          │   Neon   │
  └─────────┘             └──────────────┘          └──────────┘
      │                          │
      │                 There are 2 paths to
      │                 update database:
      │
      │     Path 1: Server Actions (preferred for mutations)
      │     ┌──────────────────────────────┐
      │     │ Server Action validates with  │
      │     │ Zod, calls Drizzle, and       │
      │     │ returns ISR or revalidated    │
      │     │ cache tag                     │
      │     └──────────────────────────────┘
      │                          │
      │     Path 2: Route Handlers (webhooks, third-party APIs)
      │     ┌──────────────────────────────┐
      │     │ REST API endpoint (GET/PATCH/ │
      │     │ POST) with SameSecurity      │
      │     │ model as server action       │
      │     └──────────────────────────────┘
```

### Server Actions Pattern

```typescript
// modules/tasks/actions.ts

'use server'  // This only runs on the server

import { auth } from '@/lib/auth/server'
import { db } from '@/lib/db/client'
import { tasks } from '@/lib/db/schema/tasks'
import { createTaskSchema } from './validation'

export async function createTask(input: unknown): Promise<{
  data?: Task
  error?: string
}> {
  // 1. Auth check (session exists)
  const session = await auth.getSession()
  if (!session) return { error: 'Unauthorized' }

  // 2. Validate input with Zod
  const parsed = createTaskSchema.safeParse(input)
  if (!parsed.success) return { error: parsed.error.message }

  // 3. Business logic
  const task = await db.insert(tasks).values({
    ...parsed.data,
    userId: session.user.id,
  }).returning()

  // 4. Evict cache so UI refreshes
  revalidatePath('/tasks')

  return { data: task[0] }
}
```

### Cache Architecture

```
Cache Layer                          Invalidation Triggers
────────────                         ─────────────────────

Next.js Full Route Cache (CDN)  │
  Static pages: fully cached     │  revalidate: 3600 or redeploy
  ISR pages: period re-gen       │  revalidate: 3600 or on-demand

Data Cache (fetch)               │  revalidateTag('tasks')
  Server-side cached fetches     │  revalidatePath('/tasks')

Router Cache (Client-side)       │  Invalidation by Next Router
  Client-side component cache    │  (automatic)

TanStack Query Cache
  Stale-while-revalidate         │  mutation side effects
  Garbage collection             │  onMutate/onSettled
```

---

## Authentication Architecture

### Auth Flow

```
                    User
                     │
                     ▼
            ┌─────────────────┐
            │  Login / Register │
            │  (credentials or │
            │   OAuth)          │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Better Auth     │
            │  Server          │
            │  │- Validate     │
            │  │- Create Session│
            │  │- Set Cookie   │
            └────────┬────────┘
                     │
                     ▼
            ┌─────────────────┐
            │  Auth Middleware  │
            │  (next.config)   │
            │  │               │
            │  Route protection│
            │  │  (auth) →     │
            │  │  password login│
            │  │  (dashboard)→ │
            │  │  authenticated │
            └────────┬────────┘
                     │
            ┌────────▼─────────┐
            │  Server/Client    │
            │  auth.getSession()│
            │  useSession()     │
            └──────────────────┘
```

---

## Module System

### Interface Contract

Every module exposes the same interface:

```typescript
// Every module provides:
// {
//   actions: {...}      // Server actions
//   types: {...}        // TypeScript types for public data
//   components: {...}  // React components
//   validation: {...}  // Zod schemas
// }
```

### Module Communication

Modules do NOT import from each other. Instead:

```
Module A: tasks                  Module B: calendar
────────────────                 ─────────────────

tasks/actions.ts                 calendar/actions.ts
  │                                    │
  ├── Uses src/lib/db     ── same schema──► Uses src/lib/db
  ├── Uses src/components ── same shared UI ─► Uses src/components
  └── Uses validation     ── shared schemas ──► Uses validation


If a task needs to appear on the calendar:
  ✅ Calendar reads `tasks` table via shared DB schema
  ❌ Calendar does NOT import `src/modules/tasks/actions.ts`
```

---

## Database Architecture

See `docs/DATABASE.md` for schema details. Architecture principles:

- PostgreSQL (Neon Serverless) — handles migrations, indexes, relations
- Drizzle ORM — type-safe queries, SQL-like API
- Migrations — source-controlled `.sql` files, never manually applied
- Connection: `@neondatabase/serverless` — edge-compatible driver

---

## State Management Architecture

```
State Strategy Pyramid

    ┌────────────────┐
    │ URL            │  ← Router state (params, query params)
    │                │    Preferred for filters and view state
    └────────────────┘
         │
    ┌────────────────┐
    │ Server         │  ← Data fetched from DB via
    │ Cache          │    Server component or TanStack Query
    │                │    (tasks, habits, notes, etc.)
    └────────────────┘
         │
    ┌────────────────┐
    │ Local State    │  ← useState, useReducer
    │                │    Modal open/close, form drafts
    └────────────────┘
         │
    ┌────────────────┐
    │ Global State   │  ← Zustand (escape hatch)
    │                │    Cross-tree UI state NOT from server
    └────────────────┘
```

---

## AI Architecture (Future)

```
          User Prompt
               │
               ▼
  ┌────────────────────────────┐
  │   AI Abstraction Layer     │
  │   src/lib/ai/providers/    │
  │                            │
  │  Provider interface:        │
  │  streamText(                │
  │    model: string,           │
  │    messages: Message[],     │
  │    tools: Tool[]            │
  │  )                         │
  │                            │
  │  ┌──────┐ ┌──────┐ ┌───┐ │
  │  │Nim   │ │Ollama│ │OR │ │
  │  │(NV)  │ │(loc) │ │(*)│ │
  │  └──────┘ └──────┘ └───┘ │
  └────────────────────────────┘
               │
               ▼
  AI Enhancement Layer (NEVER required)
  - optional chat assistant
  - auto-tagging (auto-tag journal)
  - text extraction (extract receipt line-items)
  - suggestions (could also be client-side API)
```

**Crucial:** AI must NEVER be a dependency. The core app functions completely without AI. The AI layer sits on top — removable, swappable.

---

## Deployment Architecture

```
git push
    │
    ▼
┌─────────────┐
│  GitHub Repo │
└──────┬──────┘
       │
       ▼  (automatic via Vercel Integration)
┌────────────────────────────┐
│  Vercel Build Pipeline     │
│  ├── Install (pnpm install)│
│  ├── Lint (eslint)         │
│  ├── Build (next build)    │
│  ├── Migrate (drizzle)     │
│  └── Deploy to Edge        │
└────────────┬──────────────┘
             │
             ▼
┌────────────────────────┐
│  Production URL        │
│  (lifeos.vercel.app)   │
└────────────────────────┘
       │
       ├── Preview deployments (per branch)
       ├── Production deployments (main branch)
       └── Custom domain (lifeos.app, later)
```

---

## Security Architecture

```
Layer 1: Transport    ─── HTTPS, Content-Security-Policy, CORS
Layer 2: Auth         ─── Better Auth sessions, HTTP-only cookies
Layer 3: Data         ─── Input validation (Zod), parameterized SQL (Drizzle)
Layer 4: App          ─── Row-Level Security (user_id filter on all queries)
Layer 5: Infrastructure─── Vercel/Neon isolation, encrypted connections
```

Every database query filters by `userId` — users can only see their own data. This is the most important security layer.

---

## Future Platform Expansion

### Mobile App (Future)
```
Web Native (PWA) ─── bundle from Next.js
                    ─── capacitor / Tauri Mobile (eventually)
```

### Browser Extension (Future)
```
Chrome Extension ─── communicates with LifeOS API
                   ─── API route handlers extending the server
                   ─── OAuth authentication
```

### Desktop App (Future)
```
Tauri desktop ─── wraps web frontend
               ─── native clipboard, filesystem access
               ─── same API backend
```

### Plugin / Integration System (Future)
```
Plugin API
  ├── Webhook (outgoing for events)
  ├── Incoming API (receive hooks from external services)
  └── Extension points (future possibilities)
```

---

*Last updated: 2026-07-29 — LifeOS Phase 0*