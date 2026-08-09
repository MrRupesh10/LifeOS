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
- [x] `docs/PRD.md` — Product Requirements Document
- [x] `docs/Design-System.md` — Visual design language specification
- [x] `docs/Definition-of-Done.md` — Feature completion checklist
- [x] `docs/PROJECT_STATUS.md` — Live project tracker

### Success Criteria
- [x] All documents written (19 total)
- [x] Folder structure matches Architecture.md
- [x] Every .claude/ file is populated
- [x] Documentation approved by developer

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

## Phase 5 — Dashboard Architecture & Dashboard Experience
### Purpose

Build LifeOS's main home screen — the user's control center — and establish a clean architecture for aggregating data from multiple modules into dashboard widgets.

Phase 5 is not only a UI phase. It establishes the dashboard's architectural boundary so the dashboard page does not contain business logic or direct module-specific data fetching.

### Goals
Build the dashboard widget-based UI.
Provide a single dashboard entry point for multiple module summaries.
Aggregate data from tasks, habits, projects, goals, journal, notes, calendar, expenses, and activity.
Keep module-specific logic inside their own services.
Introduce a typed DashboardSnapshot.
Introduce WidgetState<T> for consistent loading/success/error handling.
Keep the dashboard page as a thin composition layer.
Support independent widget failures without breaking the entire dashboard.
Provide dashboard summary statistics from already-loaded module data.
Provide quick actions from the dashboard.
Prepare the dashboard architecture for future Drizzle-backed module services.
Phase 5 Architecture

The dashboard follows this flow:

┌──────────────────────────────┐
│      Dashboard Page          │
│       page.tsx               │
└──────────────┬───────────────┘
               │
               │ ONE call
               ▼
┌──────────────────────────────┐
│   getDashboardSnapshot()     │
│   Dashboard Aggregator       │
└──────────────┬───────────────┘
               │
       SnapshotContributor[]
               │
     ┌─────────┼─────────┬─────────────┐
     ▼         ▼         ▼             ▼
   Tasks     Habits    Projects       Goals
   Service   Service   Service        Service
     │         │         │             │
     ├─────────┴─────────┴─────────────┤
     │                                 │
     ▼                                 ▼
 Journal / Notes / Calendar / Expenses / Activity
     │
     └───────────────┬─────────────────┘
                     ▼
             DashboardSnapshot
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   Computed Slices        Module Slices
   welcome + stats       WidgetState<T>
          │                     │
          └──────────┬──────────┘
                     ▼
              Dashboard Widgets
                     │
                     ▼
                    UI
### Architectural Rules

The dashboard page follows these rules:

page.tsx calls getDashboardSnapshot() once.
The page handles only the top-level ServiceResult failure.
The page does not fetch individual module data.
The page does not contain business logic.
The page does not contain mock dashboard data.
The page does not contain filtering, sorting, aggregation, or transformation logic.
Each widget receives its own WidgetState<T> slice.
Individual module failures are isolated to their corresponding widget.
Cross-module dashboard statistics are computed by the dashboard aggregator.
Module-specific data access remains inside module services/data sources.
DashboardSnapshot provides the typed contract between the aggregator and UI.
WidgetState<T> provides a consistent state contract for dashboard widgets.
Dashboard Widgets

The completed dashboard composition contains:

WelcomeHeader
StatsRow
TodaysTasksWidget
HabitStreaksWidget
ActiveProjectsWidget
UpcomingEventsWidget
QuickNotesWidget
ThisMonthWidget
QuarterlyGoalsWidget
RecentActivityWidget
QuickActionsWidget
Dashboard Data Sources

The dashboard aggregator currently collects summaries from:

Tasks
Habits
Projects
Goals
Journal
Notes
Calendar
Expenses
Activity

The journal slice is available in the dashboard snapshot, but a dedicated journal dashboard widget was not implemented in Phase 5 and remains a future extension.

Computed Dashboard Data

The aggregator also provides:

Welcome information
Dashboard statistics

Current statistics include:

Tasks due today
Habits remaining
Active projects
Categories engaged

These statistics are derived from already-loaded dashboard slices rather than making additional module queries.

Completed Deliverables
 Dashboard page with widget grid
 Dashboard aggregator
 getDashboardSnapshot()
 DashboardSnapshot type
 WidgetState<T> architecture
 SnapshotContributor registry
 Independent module-slice error handling
 Welcome header
 Dashboard statistics row
 Today's tasks widget
 Habit streaks widget
 Active projects widget
 Upcoming events widget
 Quick notes widget
 Monthly expenses widget
 Quarterly goals widget
 Recent activity widget
 Quick actions widget
 Thin dashboard page composition layer
 Type-safe dashboard snapshot
 Dashboard build/type/lint verification
Intentionally Deferred

The following items from the original Phase 5 plan were not treated as completed Phase 5 requirements:

 Dedicated journal entry dashboard widget
 Daily quote
 Full weekly task analytics
 Fully database-backed dashboard data
 Production-grade unbounded statistics
 Complete task/journal creation flows

These should be implemented in the appropriate later phases rather than artificially marking them complete in Phase 5.

### Phase 5 Verification
 pnpm typecheck
 pnpm lint
 pnpm build
 Dashboard page reduced to a thin composition layer
 No dashboard mock-data imports
 No dashboard business logic in page.tsx
 No duplicated widget rendering
 Dashboard widgets consume typed snapshot slices
 Top-level aggregator failure is handled
 Individual module failures remain isolated
Phase 5 Result

Phase 5 is complete as an architectural dashboard phase.

The dashboard now has a stable boundary:

Module Services
      ↓
Dashboard Aggregator
      ↓
DashboardSnapshot
      ↓
WidgetState<T>
      ↓
Dashboard Widgets
      ↓
Dashboard Page

Future database implementation should replace or extend the underlying data sources rather than adding database logic to the dashboard page.

## Phase 6 — Task Management
### Purpose

Implement the first complete user-facing CRUD module: Tasks.

Tasks are the most frequently used LifeOS feature and will become the first module to move from dashboard summary data toward complete persistent domain functionality.

Phase 6 should use the architecture established in Phases 4–5 rather than introducing a separate data-access pattern.

### Goals
Implement the complete task domain.
Connect tasks to the PostgreSQL/Drizzle database.
Provide full task CRUD.
Provide task completion functionality.
Provide filtering and sorting.
Provide a useful task-management page.
Keep task business logic inside the task module.
Ensure dashboard task summaries consume the same task service/data layer.
Task Model

The task domain should support:

Title
Description
Due date
Priority
Completion state
Created timestamp
Updated timestamp
User ownership

Where appropriate, the existing Phase 4 database schema/types should be reused rather than creating duplicate task structures.

Deliverables
Task Data Layer
 Drizzle task schema verified against the Phase 4 database foundation
 Task repository/data source
 Task queries
 User-scoped queries
 Create task operation
 Update task operation
 Delete task operation
 Toggle completion operation
Task Service Layer
 Task service
 ServiceResult-based error handling
 User ownership validation
 Domain/data transformation where required
 Dashboard task summary continues to use the task service
Tasks Page
 Tasks page
 Task list
 Empty state
 Loading state
 Error state
 Task creation UI
 Task editing UI
 Task deletion UI
 Completion toggle
Filtering
 All tasks
 Today's tasks
 Upcoming tasks
 Completed tasks
Sorting
 Due date
 Priority
 Created date
UX
 Task creation dialog
 Task editing dialog or inline editing
 Delete confirmation
 Completion animation/feedback
 Responsive layout
 Keyboard/accessibility considerations
Architecture

Phase 6 should follow the established project direction:

Tasks Page
    │
    ▼
Task Actions / Server Logic
    │
    ▼
Task Service
    │
    ▼
Task Data Source / Repository
    │
    ▼
Drizzle ORM
    │
    ▼
PostgreSQL

The dashboard should continue to consume:

Task Service
     ↓
getDashboardSnapshot()
     ↓
TodaysTasksWidget

There should not be a second independent task implementation for the dashboard.

### `Success Criteria
 User can view their tasks
 User can create a task
 User can edit a task
 User can delete a task
 User can mark a task complete/incomplete
 User can filter tasks
 User can sort tasks
 Tasks are persisted in PostgreSQL
 Every task query is scoped to the authenticated user
 Dashboard task summary uses the same underlying task service
 Empty/loading/error states work
 pnpm typecheck passes
 pnpm lint passes
 pnpm build passes
### Phase 6 Completion Definition

Phase 6 is complete when the Tasks module is a real persistent feature, not merely a dashboard summary:

Create
  ↓
Persist
  ↓
Read
  ↓
Edit
  ↓
Complete / Incomplete
  ↓
Filter / Sort
  ↓
Delete

and the dashboard automatically reflects the same task data through its existing aggregation architecture.
Phase 7 — Habit Tracker
Purpose

Build the first complete habit-tracking module with persistent daily completion and streak tracking.

Deliverables

Habit Data Layer

Drizzle habit schema and user-scoped queries
Habit repository/data source
Create, update, delete operations
Habit completion/log operations

Habit Module

Create/edit/delete habit
Habit name, schedule, and visual settings
Today habit list
Week/month completion grid
Toggle daily completion
Streak calculation
Empty/loading/error states

Dashboard Integration

Habit summary uses the same Habit Service
Dashboard habit widget reflects persistent habit data
Success Criteria
 Create, edit, and delete habits
 Mark habits complete/incomplete
 View weekly/monthly progress
 Streaks calculate correctly
 Data persists in PostgreSQL
 Dashboard reflects real habit data
 User-scoped queries work
 Typecheck, lint, and build pass
Phase 8 — Journal
Purpose

Build the daily journal as a persistent rich-text writing experience.

Deliverables
Journal database/data layer
Daily journal entry create/update/read
Rich-text editor
Auto-save
Previous entries navigation
Entry search
Today/yesterday navigation
Empty/loading/error states
Dashboard journal summary
Success Criteria
 Write and save a journal entry
 Edit an existing entry
 Navigate between dates
 Auto-save works
 Search entries
 Dashboard shows the latest journal information
 Data persists per user
Phase 9 — Notes
Purpose

Build persistent long-form notes with organization and search.

Deliverables
Note database/data layer
Create/edit/delete notes
Rich-text editing
Tags
Search
Filter by tag
Notes navigation/sidebar
Empty/loading/error states
Success Criteria
 Create a note
 Edit and delete a note
 Add/remove tags
 Search notes
 Filter by tags
 Data persists in PostgreSQL
Phase 10 — Project Manager
Purpose

Allow users to organize tasks into projects and track project progress.

Deliverables
Project CRUD
Project name, description, status, deadline
Assign tasks to projects
Project task list
Completion/progress calculation
Project overview
Project filtering
Empty/loading/error states
Success Criteria
 Create/edit/delete a project
 Assign tasks to projects
 View project progress
 Project deadlines work
 Tasks and projects remain properly linked
Phase 11 — Goal Tracker
Purpose

Connect long-term goals with the user's tasks, habits, and projects.

Deliverables
Goal CRUD
Goal description, deadline, metrics
Goal progress tracking
Link goals with tasks
Link goals with habits/projects where appropriate
Progress visualization
Goal overview
Success Criteria
 Create and manage goals
 Set deadlines and measurable targets
 Link goals with existing modules
 Progress updates correctly
 Goal data persists per user
Phase 12 — Calendar
Purpose

Provide a unified calendar for time-based LifeOS data.

Deliverables
Month/week/day views
Calendar data layer
Task due-date integration
Events CRUD
Event details
Basic drag/reschedule support
User-scoped calendar queries
Empty/loading/error states
Success Criteria
 View calendar by month/week/day
 Create and manage events
 Tasks appear on their due dates
 Rescheduling works where supported
 Calendar data persists correctly
Phase 13 — Expense Tracker
Purpose

Track personal expenses and provide simple financial summaries.

Deliverables
Expense CRUD
Amount, date, category, description
Category management where required
Monthly spending summary
Category-based spending breakdown
Basic charts
Filtering by date/category
Empty/loading/error states
Success Criteria
 Add an expense
 Edit/delete an expense
 Categorize expenses
 View monthly spending
 View category breakdown
 Charts reflect stored data
Phase 14 — Interview Tracker
Purpose

Track job interviews and the complete interview pipeline.

Deliverables
Interview CRUD
Company, role, date, notes
Interview status
Preparation level/notes
Upcoming interview view
Completed/rejected/offered states
Reminder support where appropriate
Success Criteria
 Create an interview
 Update interview status
 Track preparation
 View upcoming interviews
 Maintain interview history
Phase 15 — Resume Manager
Purpose

Manage multiple resume versions and career information inside LifeOS.

Deliverables
Resume/profile entries
Resume versions
Create/edit/delete resume data
Version organization
Export to PDF/JSON
Basic resume preview
Success Criteria
 Create a resume version
 Edit and manage versions
 Preview resume
 Export resume data/document
Phase 16 — Analytics
Purpose

Create unified analytics using real data from the completed LifeOS modules.

Deliverables
Cross-module analytics dashboard
Task productivity trends
Habit consistency/streak trends
Expense trends
Project/goal progress
Interview statistics
Date-range filtering
Charts and summaries
Weekly productivity summary
Success Criteria
 Analytics use real persisted data
 Charts update from module data
 Date filtering works
 Cross-module summaries are accurate
Phase 17 — Settings & Profile
Purpose

Complete user profile, preferences, privacy, and account management.

Deliverables
Profile editing
Display name/avatar
Notification preferences
Password management
Theme preferences
Data export
Account deletion
Account/security settings
Success Criteria
 Edit profile
 Update preferences
 Manage account security
 Export user data
 Delete account safely
Phase 18 — Dashboard & Product UX Polish

I recommend changing the original Phase 18 slightly and making this the dedicated UI/UX improvement phase you asked about.

Purpose

Transform the functional LifeOS dashboard and application into a polished, professional product without changing the underlying architecture.

Deliverables
Dashboard visual redesign
Improved widget hierarchy
Better spacing and typography
Professional empty/loading/error states
Improved responsive/mobile layout
Dashboard customization where useful
Better quick actions
Improved charts and data visualization
Consistent interactions and animations
Accessibility improvements
Cross-module visual consistency
UX review of all completed modules
Success Criteria
 Dashboard looks production-quality
 Desktop and mobile layouts work properly
 All widgets have consistent UX
 Visual hierarchy is clear
 No unnecessary visual duplication
 Accessibility issues addressed
 Existing services/data architecture remains unchanged
 Typecheck, lint, and build pass

This is where I would redesign your dashboard professionally. Don't redesign it now while the underlying modules are still being built. Once real data is flowing through it, the UI can be designed around actual information rather than placeholders.

Phase 19 — Production, PWA & Launch
Purpose

Prepare LifeOS for real-world use and public deployment.

Deliverables
PWA manifest and service worker
Installable application
SEO and Open Graph metadata
Error monitoring
Privacy-conscious analytics
Performance optimization
Accessibility audit
Security review
Production environment configuration
Custom-domain deployment
Backup/recovery strategy
Success Criteria
 Production deployment works
 PWA installation works
 Lighthouse performance ≥ 90
 Lighthouse accessibility ≥ 95
 No critical security issues
 Error monitoring works
 Custom domain works
Post v1 — Future
v1.1 — AI layer and intelligent LifeOS assistance
v1.2 — Offline support / IndexedDB
v1.3 — Advanced mobile experience
v1.4 — Public API
v1.5 — Collaboration / onboarding features
v2.0 — Plugin / extension system