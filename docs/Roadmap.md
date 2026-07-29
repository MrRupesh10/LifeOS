# Roadmap — LifeOS Development Phases

> This roadmap breaks LifeOS into numbered, sequential phases.
> Each phase has clear purpose, goals, deliverables and success criteria.
> Version 1.0 is defined as: "I use it every day; a portfolio that impresses interviewers."

---

## Version Definition

| Version | What It Means | Timeline |
|---------|--------------|----------|
| **0.x** | Pre-1.0 — feature development in progress | First: months |
| **1.0** | Minimum lovable product — all core modules work, I use it daily | Post-final-module |
| **1.1+** | Polish, AI layer, offline, mobile | After 1.0 |

---

## Phase 0 — Documentation

### Purpose
Establish the engineering foundation before writing any code.

### Goals
- Document architecture, standards, roadmap, and technical decisions
- Define project principles and coding rules
- Set up Claude's permanent memory (.claude/)
- Prepare folder structure skeleton

### Deliverables
- [x] `README.md` — project identity
- [x] `docs/Engineering-Handbook.md` — how we write code
- [x] `docs/Architecture.md` — full system design
- [x] `docs/Roadmap.md` — this file
- [x] `docs/DATABASE.md` — data model documentation
- [x] `docs/API.md` — API contract documentation
- [x] `docs/CHANGELOG.md` — version history
- [x] `docs/CONTRIBUTING.md` — how to contribute
- [x] `docs/FEATURES.md` — feature catalog
- [x] `docs/SECURITY.md` — security model
- [x] `.claude/CLAUDE.md` — Claude memory
- [x] `.claude/RULES.md` — non-negotiable rules
- [x] `.claude/DECISIONS.md` — ADR log
- [x] `.claude/MCP.md` — MCP server strategy
- [x] `.claude/SKILLS.md` — Claude skill catalog

### Success Criteria
- [ ] All documents written
- [ ] Folder structure matches Architecture.md
- [ ] Every .claude/ file is populated
- [ ] Documentation approved by developer

---

## Phase 1 — Project Setup

### Purpose
Scaffold the actual Next.js project on disk.

### Goals
- Initialize Next.js 15 with App Router
- Install core dependencies (pnpm, TypeScript, Tailwind, shadcn/ui)
- Configure environment: dev, linting, formatters, `.env`
- Set up Vercel deployment, create app on Vercel
- Run first local dev server and see content

### Deliverables
- Next.js 15 project initialized
- pnpm configured
- TypeScript strict mode enabled
- Tailwind CSS configured
- shadcn/ui initialized (components.json)
- `.eslintrc.json`, `.prettierrc` ready
- `.env.example` with variables documented
- `pnpm dev` working locally

### Success Criteria
- [ ] `pnpm dev` prints "http://localhost:3000"
- [ ] Tailwind CSS classes work
- [ ] shadcn/ui Button renders in browser
- [ ] Repository has a clean git history (Phase 1 in one commit)

---

## Phase 2 — Design System & Layout Shell

### Purpose
Build the shared UI layer: design tokens, primitives, and layout shell.

### Goals
- Define color tokens, typography, spacing in Tailwind config
- Build layout shell (Sidebar + Header + Content)
- Define ThemeProvider (light/dark using shadcn)
- Build first shadcn/ui primitives
- Create a `<Shell>` component that every page will load inside

### Deliverables
- Tailwind token extensions (colors, font sizes, shadows)
- shadcn/ui colors customized to Apple/Linear-inspired palette
- Layout components: `Shell`, `Sidebar`, `Header`, `Breadcrumb`, `Container`
- ThemeToggle component (light/dark)
- Basic mobile-responsive sidebar (collapses)
- Navigation config for sidebar links

### Success Criteria
- [ ] Sidebar is navigable (even if links go nowhere yet)
- [ ] Dark mode toggle works and persists (localStorage)
- [ ] Mobile sidebar shows/hides
- [ ] Layout shell renders with zero console errors

---

## Phase 3 — Authentication

### Purpose
Implement full authentication: register, login, logout, sessions, route protection.

### Goals
- User can create an account, verify email, login, and logout
- Dashboard is fully protected (unauthenticated access intercepts and redirects)
- Auth types: email/password initially; social login added later
- Sessions encrypted, CSRF-protected

### Deliverables
- Better Auth client and server configuration
- Registration page: form, Zod validation, email verification send
- Login page: credentials → JWT or session cookie set
- Logout button: clears session, redirects
- Password reset flow: Forgot Password → Verify email → Reset UI
- Middleware: protects `(dashboard)` route group
- Auth modules: auth/actions.ts, auth/hooks/, auth/components/

### Success Criteria
- [ ] User can register (and receive a confirmation email, logged in console)
- [ ] User can login and get redirected to /dashboard
- [ ] Login error for wrong password
- [ ] Forgot/reset password flow works
- [ ] /dashboard reroutes to /login when not authenticated
- [ ] /dashboard renders with session after login

---

## Phase 4 — Database Foundation

### Purpose
Design and implement full database schema. Drizzle migrations. Connect PostgreSQL.

### Goals
- Design ER diagram covering all current and future modules
- Write Drizzle schema definitions in TypeScript
- Apply migrations to Neon PostgreSQL
- Write core database queries (error handling, userId filter)
- Set up seed data for development and testing

### Deliverables
- Complete database table definitions (~12+ domain tables)
- Migrations applied (drizzle-kit migrate)
- Migration script as CI test
- Database client exported from `src/lib/db/client.ts`
- All queries include user_id filtering; safe parameterized queries
- `docs/DATABASE.md` updated with ER diagram + table documentation

### Success Criteria
- [ ] Drizzle Studio or Neon console shows all tables
- [ ] `INSERT INTO tasks` via node console from actions
- [ ] Foreign key constraints enforced
- [ ] Seed script populates sample data for all modules (for development)

---

## Phase 5 — Dashboard

### Purpose
The main home screen — the user's control center.

### Goals
- Overview: today's tasks, today's habits, today's journal entry
- Quick-add button for tasks, journal entries
- Recent activity cards
- upcoming calendar events
- Daily quote (static for now)
- Mini analytics: tasks completed this week

### Deliverables
- Dashboard page: widgets grid
- Quick action buttons (click to create task / open journal)
- Task list card (next 5 due tasks from today)
- Habit progress card (dot grid)
- Journal entry card (last entry preview)
- Daily quote static content
- All data empty state handled

### Success Criteria
- [ ] Dashboard shows data from real tasks / habits / journal queries
- [ ] Quick add buttons work

---

## Phase 6 — Task Management

### Purpose
Full CRUD for tasks — the most used feature.

### Deliverables
- Task models: title, description, due date, priority, completion state
- Filter: all / today / upcoming / completed
- Sort: by due date, priority, created
- Task creation dialog
- Task editing (inline or modal)
- Completion toggle animation
- Task deletion with confirmation
- Tasks page communicates with backend

### Success Criteria
- [ ] List day's tasks
- [ ] Create, edit, delete task
- [ ] Toggle completion
- [ ] Filter and sort work

---

## Phase 7 — Habit Tracker

### Purpose
Track daily habits with a grid visual (GitHub contribution graph style).

### Deliverables
- Create habit: name, days of week, color
- Habit grid: shows all habits as dot grid over days
- Toggle completion: click a habit cell
- Streak display
- Habit log card
- Today view: list outstanding habits

### Success Criteria
- [ ] Create habit
- [ ] See week/month grid
- [ ] Check off a habitual
- [ ] Toggle a dot cell
- [ ] Streak counter increments

---

## Phase 8 — Journal

### Purpose
Daily journal / daily notes writing. Not plain text — rich text.

### Deliverables
- Rich text editor: TipTap or another editor library integrated
- Daily journal page: write per-day
- Auto-save
- previous entries list
- Search entries (content)

### Success Criteria
- [ ] Write and save a journal entry
- [ ] Navigate to yesterday entry
- [ ] Entry is saved when editor loses content

---

## Phase 9 — Notes

### Purpose
Long-form notes, tagging, search.

### Deliverables
- Note create/edit/delete
- Rich text
- Tagging
- Search / filter by tag
- Note sidebar for navigation

### Success Criteria
- [ ] Create, edit, delete notes

---

## Phase 10 — Project Manager

### Purpose
Group tasks into projects.

### Deliverables
- projects CRUD
- Assign tasks to projects
- Project overview: completion, tasks
- Project deadlines

### Success Criteria
- [ ] Create a project with tasks
- [ ]

---

## Phase 11 — Goal Tracker

### Purpose
Link goals to habits, tasks, and projects.

### Deliverables
- CRUD for goals (description, deadline, metrics)
- Link goals to habits / tasks
- Visual progress bars

### Success Criteria
- [ ] Create goal, link to habits data

---

## Phase 12 — Calendar

### Purpose
Full calendar UI.

### Deliverables
- Month/week/day views
- Integrated with tasks (with due date auto-marks)
- Drag tasks between days (basic)

### Success Criteria
- [ ] Calendar shows tasks marked with due dates

---

## Phase 13 — Expense Tracker

### Purpose
Track daily expenses.

### Deliverables
- Expense create/edit/delete
- Categorization
- Simple dashboard: monthly spend, by category
- Charts via Recharts

### Success Criteria
- [ ] Log an expense → chart updates

---

## Phase 14 — Interview Tracker

### Purpose
Track scheduled interviews: prep level, company, status.

### Deliverables
- Interview entry (company, date, notes)
- Status: upcoming / completed / rejected / offered
- Reminder

### Success Criteria
- [ ] Track interview process

---

## Phase 15 — Resume Manager

### Purpose
Manage resume versions.

### Deliverables
- Add/update resume entries
- Export as PDF or JSON

### Success Criteria
- [ ] Manage resume via app

---

## Phase 16 — Analytics

### Purpose
Unified analytics across tasks, habits, expenses, interviews.

### Deliverables
- Dashboard: charts across all modules
- Weekly summary email or notification
- Productivity trends

### Success Criteria
- [ ] Charts rendering across modules

---

## Phase 17 — Settings & Profile

### Purpose
User settings and profile.

### Deliverables
- Profile editing (display name, avatar)
- Notification preferences
- Change password
- Theme toggle (already done in Phase 2)
- Data export
- Account deletion

### Success Criteria
- [ ] Profile page edit works

---

## Phase 18 — Polish, Production, PWA

### Purpose
Make it public-ready.

### Deliverables
- PWA manifest + service worker → install "app"
- Open Graph meta tags & SEO
- Error monitoring (Sentry)
- Analytics (optional, privacy-first)
- Final performance audit
- Accessibility audit

### Success Criteria
- [ ] Lighthouse performance score 90+
- [ ] Lighthouse accessibility score 95+
- [ ] PWA install works
- [ ] Deploy to custom domain

---

## Post v1 (Future)

- v1.1: AI layer integration
- v1.2: Offline support (IndexedDB)
- v1.3: Mobile (PWA or Capacitor)
- v1.4: Public API
- v1.5: Collaborative onboarding
- v2.0: Plugin / extension system

---

*Last updated: 2026-07-29 — LifeOS Phase 0*