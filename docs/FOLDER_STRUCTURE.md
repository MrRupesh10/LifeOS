# Folder Structure — LifeOS

> Every folder, its purpose, and what belongs there.
> Created: 2026-07-30 — Phase 1

---

## Top-Level Project Tree

```
LifeOS/
├── src/                       # All application source code
├── docs/                      # Engineering documentation (not user-facing)
├── .claude/                   # Claude Code configuration (CLAUDE.md, DECISIONS.md)
├── .husky/                    # Git hooks (pre-commit)
├── public/                    # Static assets served at / (favicon, robots.txt)
├── package.json               # Dependency manifest + scripts
├── pnpm-lock.yaml             # Dependency lock file (pnpm)
├── pnpm-workspace.yaml        # pnpm config (allowBuilds)
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js framework configuration
├── eslint.config.mjs           # ESLint 9 flat config
├── postcss.config.mjs          # PostCSS + Tailwind v4
├── .prettierrc                 # Prettier configuration
├── components.json             # shadcn/ui v2 configuration
├── .env.example                # Environment variable documentation
└── README.md                   # Project README
```

---

## `src/` — Application Source

```
src/
├── app/                        # Next.js App Router (ROUTING ONLY — no business logic)
│   ├── layout.tsx              # Root layout: fonts, providers, html shell
│   ├── page.tsx                # Landing page (/) — Phase 1 placeholder
│   ├── globals.css             # Tailwind v4 + shadcn CSS custom properties
│   ├── (auth)/                 # Route group — public auth pages (unauthenticated)
│   │   ├── login/              # Email/password + OAuth login
│   │   └── register/           # Account creation form
│   ├── (dashboard)/            # Route group — authenticated app pages
│   │   ├── dashboard/          # Home dashboard (widgets, overview)
│   │   ├── tasks/              # Task management
│   │   ├── habits/             # Habit tracker
│   │   ├── journal/            # Daily journal entries
│   │   ├── notes/              # Notes with folders/tags
│   │   ├── projects/           # Project management
│   │   ├── goals/              # Goal tracking
│   │   ├── calendar/           # Calendar views
│   │   ├── interviews/         # Interview preparation
│   │   ├── expenses/           # Expense tracking
│   │   ├── resume/             # Resume builder
│   │   ├── analytics/          # Data dashboards
│   │   └── settings/           # User preferences
│   └── api/                    # Route handlers (REST endpoints, webhooks)
│
├── modules/                    # Feature modules — isolated, independent
│   ├── tasks/                  # Tasks domain (Phase 5)
│   │   ├── actions.ts          #   Server Actions (createTask, deleteTask, etc.)
│   │   ├── types.ts            #   Module-level types
│   │   ├── validation.ts       #   Zod schemas for this module
│   │   ├── components/          #   React components
│   │   └── hooks/              #   React hooks
│   ├── habits/                 # Habits domain (Phase 7)
│   ├── journal/                # Journal domain (Phase 10)
│   ├── notes/                  # Notes domain (Phase 8)
│   ├── projects/               # Projects domain (Phase 6)
│   ├── goals/                  # Goals domain (Phase 13)
│   ├── calendar/               # Calendar domain (Phase 15)
│   ├── interviews/             # Interview prep domain (Phase 16)
│   ├── expenses/               # Expenses domain (Phase 14)
│   ├── resume/                 # Resume builder domain (Phase 17)
│   ├── analytics/              # Analytics domain (Phase 19)
│   ├── auth/                   # Auth UI (Phase 3)
│   ├── notifications/          # Notification UI (Phase 9)
│   └── settings/               # Settings UI (Phase 20)
│
├── components/
│   ├── ui/                     # shadcn/ui v2 primitives (Base UI, NOT Radix)
│   │   ├── button.tsx          #   Button primitive
│   │   ├── dialog.tsx          #   Dialog (Modal + Portal + Backdrop)
│   │   └── dropdown-menu.tsx   #   Dropdown menu (Base UI Menu)
│   ├── layout/                 # Application shell chrome
│   │   ├── app-shell.tsx       #   Responsive shell (sidebar + header + main + footer)
│   │   ├── sidebar.tsx         #   Collapsible sidebar (desktop) / mobile drawer
│   │   ├── header.tsx          #   Top bar: hamburger, breadcrumb, search, theme
│   │   ├── theme-toggle.tsx    #   Light/Dark/System shadcn DropdownMenu
│   │   └── footer.tsx          #   Footer placeholder
│   └── shared/                 # Cross-module reusable components
│       └── command-palette.tsx  #   ⌘K global listener → Base UI Dialog placeholder
│
├── lib/                        # Shared infrastructure layer
│   ├── config/                 # App configuration (single source of truth)
│   │   ├── env.ts              #   Environment validation (Zod + t3-env)
│   │   ├── database.ts         #   Database client config (Phase 4)
│   │   └── auth.ts             #   Better Auth config (Phase 3)
│   ├── db/                     # Database layer ⚠️ Phase 4 (placeholder dirs)
│   │   ├── schema/             #   Drizzle ORM schema files
│   │   └── migrations/         #   Drizzle Kit migration files
│   ├── ai/                     # AI provider abstraction ⚠️ Future
│   │   └── providers/          #   One adapter per backend
│   ├── auth/                   # Auth module ⚠️ Phase 3
│   ├── email/                  # Email providers ⚠️ Phase 18
│   ├── storage/                # File storage abstraction ⚠️ Future
│   └── utils.ts                # Pure utility functions: cn() helper
│
├── stores/                     # Zustand stores — cross-tree UI state
│   └── ui/
│       └── sidebar-store.ts    #   Sidebar collapse + mobile drawer state
│
├── hooks/                      # Shared React hooks ⚠️ Empty til Phase 2
│
├── providers/                  # React context providers (composition root)
│   ├── index.tsx               #   AppProviders (theme + query + sonner)
│   ├── theme.tsx               #   ThemeProvider wrapper (next-themes)
│   └── query.tsx               #   TanStack Query factory (server-safe)
│
├── types/                      # Global TypeScript types
│   ├── index.ts                #   Barrel exports
│   ├── common.ts               #   Nullable, DeepPartial, UnwrapPromise, Mutable
│   ├── navigation.ts           #   NavItem, NavGroup, NavConfig
│   └── theme.ts               #   ThemeMode, ThemeOption
│
├── validation/                  # Shared Zod schemas ⚠️ Empty til Phase 2
│
└── config/                      # Application configuration (settings, not infra)
    ├── site.ts                  #   siteConfig object — branding, metadata, links
    ├── navigation.ts            #   navigationConfig — nav registry (13 modules, 14 icons)
    └── layout.ts               #   Layout constants — widths, heights, transitions
```

---

## Module Boundary Rules (from Architecture.md)

```
✅ A module MAY import from:
  - src/lib/*           (infrastructure)
  - src/components/*    (shared UI)
  - src/hooks/*         (shared hooks)
  - src/types/*         (global types)
  - src/constants/*      (app constants)
  - src/validation/*    (shared schemas)

❌ A module MUST NEVER:
  - Import from another module (modules/tasks → modules/habits)
  - Contain business logic in app/ route files
  - Directly access another module's database tables
```

---

## Naming Conventions

| What | Convention | Location |
|------|-----------|----------|
| Modules | lowercase directory | `src/modules/tasks/` |
| Components | PascalCase | `TaskCard.tsx` |
| Utilities | kebab-case | `format-date.ts` |
| Route groups | (parentheses) | `(dashboard)/` |
| Zod schemas | camelCase + `Schema` | `createTaskSchema` |
| Server Actions | camelCase | `createTask.ts` |

---

## Key Design Decisions

1. **Route groups** `(auth)` and `(dashboard)` share the same URL path but different layouts — (auth) has no sidebar, (dashboard) wraps in AppShell
2. **One route = one folder** — `app/(dashboard)/tasks/` is a single `page.tsx` with thin routing (delegates to module)
3. **Modules map 1:1 to routes** — `app/(dashboard)/tasks/` calls `modules/tasks/actions.ts`
4. **No cross-module imports** — enforced by convention + code review. ESLint rule added later
5. **lib/config/env.ts is the single source of truth** for environment variables — every env var the app touches is validated there

---

*Last updated: 2026-07-30 — Phase 1*