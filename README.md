# LifeOS

> Your personal operating system. Not a todo app. Not a habit tracker. An operating system for your life.

LifeOS combines tasks, habits, journaling, notes, projects, goals, calendar, expense tracking, interview management, and resume management into one unified experience — like Notion, Todoist, and a habit tracker had a love child, but with a single, coherent design language.

---

## Why LifeOS Exists

Most productivity tools do one thing well: Todoist for tasks, Notion for notes, separate expense apps — which means your data is scattered across 8 tabs and none of them talk to each other.

- Your tasks don't know about your habits
- Your journal doesn't know your goals
- Your expenses don't show up on your calendar

LifeOS fixes that. It's **one app, one experience, one data model**, where everything connects.

---

## Core Principles

| Principle | Meaning |
|-----------|--------|
| **Unified** | Every module shares the same design language, navigation, and data model |
| **Minimal** | Inspired by Apple, Linear, Notion — whitespace, calm, professional |
| **Fast** | Server components, streaming, instant navigation, zero unnecessary JavaScript |
| **Private** | All your data is yours. No analytics, no tracking, no third-party sale |
| **Offline-capable** | (Future) Works even without internet |
| **Platform-native** | Web, then mobile, then desktop. One codebase, many targets |

---

## Tech Stack (Active)

| Layer | Technology | Key Detail |
|-------|-----------|-----------|
| **Framework** | Next.js 15.5 | App Router, route groups, Server Components |
| **Styling** | Tailwind CSS v4 | CSS-based `@theme inline`, NO `tailwind.config.ts` |
| **UI Primitives** | shadcn/ui v2 + `@base-ui/react` | New York base-nova, neutral colors |
| **Fonts** | Geist Sans + Geist Mono | `next/font/google` with CSS variables |
| **Icons** | Lucide React | 1,200+ icons, tree-shaken |
| **Theme** | next-themes | Class strategy, system-default, flash-free |
| **Auth** | Better Auth (Phase 3) | Placeholder only — not wired yet |
| **Database** | PostgreSQL + Drizzle ORM (Phase 4) | Placeholder only — not wired yet |
| **Validation** | Zod 4 | Shared client + server schemas |
| **State** | Zustand (sidebar), TanStack Query (server cache) | ADR-009, ADR-014 |
| **Notifications** | Sonner | Global `<Toaster>` mounted |
| **Forms** | React Hook Form + @hookform/resolvers | For all user input |
| **Package Manager** | pnpm 11 | `pnpm-workspace.yaml` with `allowBuilds` |
| **CI/CD** | Vercel (future) | GitHub integration |
| **Lint/Format** | ESLint 9 + Prettier 3 | Pre-commit via Husky + lint-staged |
| **Env** | @t3-oss/env-nextjs | Zod-powered, fail-fast |

---

## Quick Start

```bash
git clone https://github.com/MrRupesh10/LifeOS.git
cd LifeOS
cp .env.example .env.local    # Set DATABASE_URL
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm format:check` | Check formatting |
| `pnpm typecheck` | TypeScript type checking |

### All Gates Passed

```
TypeScript  pnpm typecheck   — ✅
ESLint      pnpm lint        — ✅
Prettier    pnpm format:check — ✅
Build       pnpm build       — ✅
```

---

## Project Structure

```
src/
├── app/                 # Routing only (no business logic) — Next.js App Router
│   ├── layout.tsx       Root layout: fonts + AppProviders
│   ├── (marketing)/     Public landing page (no sidebar)
│   └── (dashboard)/     Authenticated pages (AppShell with sidebar + header)
├── modules/              Feature modules — isolated, independent, removable
├── components/
│   ├── ui/             shadcn/ui primitives (Button, Dialog, DropdownMenu)
│   ├── layout/         App shell chrome (Sidebar, Header, AppShell, ThemeToggle)
│   └── shared/         Cross-module components (CommandPalette)
├── lib/
│   ├── config/         Configuration (env validation, database, auth)
│   └── utils.ts        Pure utilities (cn helper)
├── stores/ui/           Zustand stores (sidebar collapse)
├── providers/           AppProviders composition root (Theme + Query + Sonner)
├── config/              Application configuration (site, navigation, layout)
├── types/              Global TypeScript types
└── hooks/              Shared React hooks
```

---

## Navigation

14 modules are registered in the navigation structure:

| Section | Modules |
|---------|---------|
| **Main** | Dashboard, Tasks, Habits, Journal, Notes |
| **Planning** | Projects, Goals, Calendar |
| **Career** | Interviews, Resume, Expenses |
| **Review** | Analytics, Settings |

All navigation lives in `src/config/navigation.ts` — the single source of truth.

---

## Documentation

| Document | Covers |
|----------|--------|
| [`docs/Roadmap.md`](docs/Roadmap.md) | Development phases and milestones |
| [`docs/Architecture.md`](docs/Architecture.md) | Full system architecture, diagrams, patterns |
| [`docs/PRD.md`](docs/PRD.md) | Product Requirements Document (vision, users, success metrics) |
| [`docs/Design-System.md`](docs/Design-System.md) | Visual design language (Apple/Linear/Notion) |
| [`docs/Engineering-Handbook.md`](docs/Engineering-Handbook.md) | Code conventions, naming, component patterns |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Data models, schema, ER diagrams |
| [`docs/API.md`](docs/API.md) | API design, Server Actions conventions |
| [`docs/FEATURES.md`](docs/FEATURES.md) | Feature catalog (15 modules) |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Security model, auth flow |
| [`docs/Definition-of-Done.md`](docs/Definition-of-Done.md) | Feature completion checklist |
| [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) | Live: current sprint, what's next |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Version history (Keep a Changelog format) |
| [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) | Git flow, conventional commits, PR template |
| [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md) | Every directory, naming rules, module boundaries |
| [`docs/DEPENDENCIES.md`](docs/DEPENDENCIES.md) | Every dependency, justification, alternatives |
| [`.claude/CLAUDE.md`](.claude/CLAUDE.md) | Claude's permanent memory and technical context |
| [`.claude/DECISIONS.md`](.claude/DECISIONS.md) | 14 Architectural Decision Records |

---

## Current Status

**Phase 1 complete — project foundation shipped.**

| Milestone | Name | Status |
|-----------|------|--------|
| M1 | Next.js 15 scaffold | ✅ |
| M2 | 30 dependencies installed | ✅ |
| M3 | shadcn/ui v2 initialized | ✅ |
| M4 | Tooling (ESLint, Prettier, Husky) | ✅ |
| M5 | Environment validation | ✅ |
| M6 | Production folder structure | ✅ |
| M7 | Core config (fonts, theme, metadata) | ✅ |
| M8 | Base pages (error, loading, 404) | ✅ |
| M9 | Interactive shell (sidebar, theme, ⌘K) | ✅ |
| M10 | Providers setup | ✅ |
| M11 | Wire everything in root layout | ✅ |
| M12 | Verify and test | ✅ All 4 gates green |

**3 routes in production build:** `/` (landing), `/dashboard` (app shell), `/_not-found` (404)

---

## Author & Learning

Flagship portfolio project by **Rupesh** — Computer Science student building this as a personal daily tool and learning vehicle through production-grade engineering mentorship.

### Learning Goals

1. Master full-stack software engineering through real production work
2. Build an outstanding portfolio project for interviews
3. Learn production architecture patterns (module isolation, platform contracts)
4. Create personal the owner uses every day

---

## License

MIT

---

*Last updated: 2026-07-30 — LifeOS Phase * Full Complete (14 milestones, 35+ files, all gates green)*