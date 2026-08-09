# 🚀 LifeOS

> **Your Personal Operating System**
>
> Not a todo app. Not a habit tracker. An operating system for your life.

LifeOS is a modern full-stack productivity platform that unifies **tasks, habits, journaling, notes, projects, goals, calendar, expenses, interview preparation, and resume management** into a single cohesive experience.

Instead of managing your life across multiple disconnected apps, LifeOS provides one integrated workspace with a consistent design language, centralized data model, and scalable architecture.

---

# ✨Why LifeOS Exists
Most productivity tools do one thing well: Todoist for tasks, Notion for notes, separate expense apps — which means your data is scattered across 8 tabs and none of them talk to each other.

Your tasks don't know about your habits
Your journal doesn't know your goals
Your expenses don't show up on your calendar
LifeOS fixes that. It's one app, one experience, one data model, where everything connects.

---

# 📌 Current Status

| Version | Status |
|----------|--------|
| **v0.5.0-alpha** | ✅ Current Release |
| Phase 0 | ✅ Complete |
| Phase 1 | ✅ Complete |
| Phase 2 | ✅ Complete |
| Phase 3 | ✅ Complete |
| Phase 4 | ✅ Complete |
| Phase 5 | ✅ Complete |
| Phase 6 | 🚧 Next |

---

# 🏗️ Tech Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js 15.5 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui + Base UI |
| Icons | Lucide React |
| Theme | next-themes |
| Authentication | Better Auth |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Validation | Zod |
| Forms | React Hook Form |
| State | Zustand |
| Server Cache | TanStack Query |
| Notifications | Sonner |
| Package Manager | pnpm |
| Deployment | Vercel (planned) |

---

# ✨ Current Features

## ✅ Authentication

- Email & Password Authentication
- User Registration
- Login
- Logout
- Forgot Password
- Reset Password
- Email Verification
- Session Management
- Protected Routes
- Middleware Authentication
- Google OAuth
- GitHub OAuth
- Server-side Session Helper

---

## ✅ Database

- PostgreSQL
- Drizzle ORM
- Type-safe Queries
- Database Migrations
- Authentication Schema
- UUID Primary Keys
- Timestamp Columns
- Row-level User Isolation
- Mock Seed Data
- Shared Database Client

---

## ✅ Dashboard Architecture

- `ServiceResult<T>` contract (discriminated union — no helpers, no throwing)
- Typed module contracts for 9 modules + dashboard
- Per-module DataSources (interface + mock impl + factory) — sole access point to mock data
- `toDomain()` adapter isolates mock shapes behind the datasource interface
- Module Services returning `ServiceResult<XxxWidgetData>` (filter/sort/count/slice)
- `getDashboardSnapshot()` aggregator composes `SnapshotContributor[]` via `Promise.all`
- Two registries — data `SnapshotContributor[]` + UI `DashboardWidgetDefinition[]` — joined on `WidgetKey`
- `WidgetState<T>` discriminated union (loading / success / error)
- 11 pure-presentational widgets, each fed exactly its own data slice
- Dashboard page: pure composition layer (333 → ~58 lines), zero business logic

---

## ✅ UI & Design

- Premium Landing Page
- Responsive Dashboard
- Apple / Linear Inspired Design
- Dark / Light Theme
- Design System Showcase
- Accessible Components
- Command Palette
- Animated UI
- Reusable Component Library

---

## ✅ Productivity Modules

Current shell pages include:

- Dashboard
- Tasks
- Habits
- Journal
- Notes
- Projects
- Goals
- Calendar
- Expenses
- Interviews
- Resume
- Analytics
- Settings

---

# 📁 Project Structure

```
src
├── app                    # Routing only (no business logic) — Next.js App Router
│   ├── (marketing)        Public landing page (no sidebar)
│   ├── (dashboard)        Authenticated pages (AppShell with sidebar + header)
│   ├── (auth)
│   └── api
│
├── components
│   ├── ui                 shadcn/ui primitives (Button, Dialog, DropdownMenu)
│   ├── layout             App shell chrome (Sidebar, Header, AppShell, ThemeToggle)
│   ├── landing
│   └── shared             Cross-module components (CommandPalette)
│
├── modules                  Feature modules — isolated, independent, removable
│   ├── auth
│   ├── dashboard
│   ├── tasks
│   ├── habits
│   ├── journal
│   └── ...
│
├── lib
│   ├── auth
│   ├── db
│   ├── config               Configuration (env validation, database, auth)
│   └── utils                Pure utilities (cn helper)
│
├── providers                AppProviders composition root (Theme + Query + Sonner)
├── stores                   Zustand stores (sidebar collapse)
├── hooks                    Shared React hooks
├── config                   Application configuration (site, navigation, layout)
└── types                    Global TypeScript types
```

---

# 🚀 Quick Start

```bash
git clone https://github.com/MrRupesh10/LifeOS.git

cd LifeOS

cp .env.example .env.local

pnpm install

pnpm dev
```

Open

```
http://localhost:3000
```

---

# ⚙️ Environment Variables

```env
DATABASE_URL=

BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_BETTER_AUTH_URL=
```

---

# 📜 Available Scripts

```bash
pnpm dev
```

Start development server

```bash
pnpm build
```

Production build

```bash
pnpm start
```

Run production build

```bash
pnpm lint
```

ESLint

```bash
pnpm typecheck
```

TypeScript verification

```bash
pnpm format
```

Format code

```bash
pnpm format:check
```

Verify formatting

---

# ✅ Quality Gates

| Gate | Status |
|-------|--------|
| TypeScript | ✅ |
| ESLint | ✅ |
| Prettier | ✅ |
| Production Build | ✅ |

---

# 🗺️ Roadmap

## ✅ Phase 0 — Documentation

Completed

- Engineering Documentation
- Product Documentation
- Architecture
- API Documentation
- Security Guide
- Roadmap
- Project Status
- Folder Structure
- Claude Memory
- ADR Decisions

---

## ✅ Phase 1 — Project Setup

Completed

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Husky
- ESLint
- Prettier
- Environment Validation
- App Router
- Dashboard Shell
- Providers
- Theme
- Navigation

---

## ✅ Phase 2 — Design System

Completed

- Apple / Linear Design
- Premium Landing Page
- Rich Dashboard
- Component Library
- Accessibility
- Module Pages
- Animations
- Design System Showcase

---

## ✅ Phase 3 — Authentication

Completed

- Better Auth
- Email Authentication
- Google OAuth
- GitHub OAuth
- Login
- Register
- Forgot Password
- Reset Password
- Email Verification
- Middleware Protection
- Protected Dashboard
- Session Management

---

## ✅ Phase 4 — Database Foundation

Completed

- PostgreSQL
- Drizzle ORM
- Database Client
- Authentication Schema
- Migrations
- Query Helpers
- User Isolation
- Mock Seed Data
- Type-safe Database Layer

---

## ✅ Phase 5 — Dashboard Foundation & Widget Architecture

Completed

- `ServiceResult<T>` Contract
- Typed Module Contracts
- DataSources (mock adapters)
- Module Services
- Dashboard Aggregator
- Widget Registries & Constants
- 11 Dashboard Widgets
- Dashboard Page Refactor
- Architecture Decisions (D1–D14)

---

## 🚧 Upcoming

- Phase 6 — Task Management
- Phase 7 — Habit Tracker
- Phase 8 — Journal
- Phase 9 — Notes
- Phase 10 — Projects
- Phase 11 — Goals
- Phase 12 — Calendar
- Phase 13 — Expenses
- Phase 14 — Interview Tracker
- Phase 15 — Resume Builder
- Phase 16 — Analytics
- Phase 17 — Settings
- Phase 18 — Production + PWA

---

# 📚 Documentation

```
docs/
│
├── API.md
├── Architecture.md
├── CHANGELOG.md
├── DATABASE.md
├── Design-System.md
├── FEATURES.md
├── FOLDER_STRUCTURE.md
├── PROJECT_STATUS.md
├── Roadmap.md
├── SECURITY.md
└── ...
```

---

# 🎯 Learning Goals

This project is being built to master:

- Production-grade Full Stack Development
- System Design
- Authentication
- Database Design
- Scalable Architecture
- UI Engineering
- Performance Optimization
- Modern React Patterns
- Next.js App Router
- Production DevOps Workflow

---

# 📈 Development Progress

| Phase | Progress |
|---------|----------|
| Documentation | ✅ 100% |
| Project Setup | ✅ 100% |
| Design System | ✅ 100% |
| Authentication | ✅ 100% |
| Database | ✅ 100% |
| Dashboard | ✅ 100% |
| Productivity Modules | 🚧 |
| Production Ready | 🚧 |

---

# 👨‍💻 Author

**Rupesh Yadav**

Computer Science Engineering Student

Building LifeOS as a flagship portfolio project to learn production-grade software engineering and modern full-stack architecture.

GitHub: **https://github.com/MrRupesh10**

---

# 📄 License

MIT License

---

> **Current Release:** **v0.5.0-alpha**
>
> **Last Updated:** 2026-08-08
>
> **Status:** Phase 5 Complete • Dashboard Foundation & Widget Architecture Shipped