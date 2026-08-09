# Changelog

All notable changes to **LifeOS** are documented in this file.

The format is based on **Keep a Changelog** and the project adheres to **Semantic Versioning**.

---

# [0.5.0-alpha] — 2026-08-09

## Phase 5 — Dashboard Foundation & Widget Architecture

This release replaces the monolithic 333-line dashboard page with a pure composition layer backed by a reusable widget architecture: a `ServiceResult` contract, typed module DataSources and Services, a dashboard aggregator, UI widget definitions, and eleven presentational widgets — each fed exactly its own typed data slice. The visual dashboard is preserved while the architecture underneath is swapped for a production-ready, Phase-6-ready pattern.

### Added

#### ServiceResult Contract

- `ServiceResult<T>` discriminated union (`{ success, data } | { success: false, message }`) at `src/lib/result.ts`
- Returned by every DataSource, Service, and the dashboard aggregator
- No helper functions, no classes, no throwing

#### Module Contracts

- Typed entity types + `XxxWidgetData` slices for all 9 modules + dashboard
- `types.ts` per module (`tasks`, `habits`, `projects`, `goals`, `journal`, `notes`, `calendar`, `expenses`, `activity`) + `dashboard/types.ts`
- Entity types model Drizzle table shapes (UUID ids, ISO dates, `userId`) ahead of Phase 6

#### DataSources

- Interface + mock implementation + `createXxxDataSource()` factory per module
- `toDomain()` adapter isolates mock-data shapes behind the datasource interface
- The only place mock data is imported — swappable to Drizzle in Phase 6 with zero upstream changes

#### Module Services

- Plain `async` functions returning `ServiceResult<XxxWidgetData>`
- Own filter / sort / count / slice logic (`src/modules/*/services/*-service.ts`)
- Optional datasource parameter provides dependency injection for testability

#### Dashboard Aggregator

- `getDashboardSnapshot()` — `SnapshotContributor[]` iterated via `Promise.all`
- Computed `welcome` + `stats` slices derived inside the aggregator

#### Dashboard Widgets

- 11 pure-presentational widgets: WelcomeHeader, StatsRow, 9 data-backed widgets
- Each receives exactly its own `WidgetState` slice — zero business logic
- Shared UI components and utilities only (`Card`, `ProgressBar`, `StatsCard`, `cn`, `formatShortDate`)

#### Widget Registries & Constants

- `WIDGET_DEFINITIONS`, `WIDGET_ICONS`, `QUICK_ACTION_ICON`, `DASHBOARD_GRID` at `src/modules/dashboard/constants.ts`
- `SnapshotContributor` (data) and `DashboardWidgetDefinition` (UI) registries joined on `WidgetKey`

### Changed

- Dashboard page rewritten 333 → ~58 lines as a pure composition layer
- `DashboardSnapshot` redefined as an explicit interface with `WidgetState` per key + `version`/`generatedAt` metadata
- `WidgetProps<T>` replaced by `WidgetState<T>` discriminated union (loading / success / error)
- `priority` renamed to `defaultOrder` (drag-drop ready)

### Fixed

- Removed inline business logic from the dashboard page
- Removed direct mock-data imports from the dashboard
- Replaced a parallel `errors` map with per-widget error embedding

### Architecture Decisions

- ADRs **D1–D14** recorded — independent widget slices, two registries, explicit `DashboardSnapshot`, one justified `as` cast in the aggregator build loop

### Documentation

- Updated README with dashboard architecture
- Updated PROJECT_STATUS with Phase 5 completion
- Updated CLAUDE project memory
- Created `.claude/plans/phase5-dashboard.md` as single source of truth

### Verification

- ✅ `pnpm typecheck`
- ✅ `pnpm lint`
- ✅ `pnpm build`
- ✅ 24 production routes build successfully
- ✅ `/dashboard` prerendered static (`○`)

---

# [0.4.0-alpha] — 2026-08-04

## Phase 4 — Database Foundation

This release establishes the database layer for LifeOS, introducing a production-ready PostgreSQL architecture powered by Drizzle ORM. It provides the persistence foundation required for all future productivity modules.

### Added

- PostgreSQL integration using Drizzle ORM
- Centralized database client (`src/lib/db/client.ts`)
- Typed database schema barrel (`src/lib/db/schema.ts`)
- Better Auth database schema
  - Users
  - Sessions
  - Accounts
  - Verification tables
- Initial SQL migration generated with Drizzle Kit
- Migration metadata and journal files
- Drizzle configuration (`drizzle.config.ts`)
- Environment validation for `DATABASE_URL`
- UUID-based primary key strategy
- Snake_case naming convention across database tables
- Timestamp conventions for future entities
- Type-safe ORM layer for future server actions

### Changed

- Connected authentication layer to the database foundation
- Project configuration updated to support Drizzle workflows
- Environment template updated for database configuration
- Repository prepared for future module persistence

### Fixed

- Removed placeholder database structure
- Standardized schema organization
- Improved project structure for future migrations
- Cleaned migration directories before first release

### Documentation

- Updated README to include database architecture
- Updated PROJECT_STATUS with Phase 4 completion
- Added migration workflow documentation
- Updated project roadmap to begin Phase 5

### Verification

- ✅ `pnpm typecheck`
- ✅ `pnpm lint`
- ✅ `pnpm build`
- ✅ Initial migration generated successfully
- ✅ Database configuration validated
- ✅ 24 production routes build successfully

---

# [0.3.0-alpha] — 2026-08-04

## Phase 3 — Authentication

This release introduces complete authentication for LifeOS using Better Auth, including email/password authentication, OAuth providers, session management, protected routes, and reusable authentication components.

### Added

#### Authentication Core

- Better Auth server configuration
- Better Auth client configuration
- Session helper utilities
- Authentication API route
- Protected middleware
- Secure cookie-based sessions

#### Authentication Pages

- Login
- Register
- Forgot Password
- Reset Password
- Verify Email

#### Authentication Components

- Login Form
- Register Form
- Forgot Password Form
- Reset Password Form
- User Menu
- Logo Link
- Shared Input component
- Shared Label component

#### Authentication Features

- Email & Password authentication
- Google OAuth
- GitHub OAuth
- Email verification flow
- Password reset flow
- Persistent user sessions
- Protected dashboard routes
- Sign out functionality
- Session validation helper

#### Validation

- Shared Zod schemas
- React Hook Form integration
- Typed authentication models

### Changed

- Header now displays authenticated user information
- Dashboard routes protected via middleware
- Authentication configuration integrated into environment validation
- Landing page navigation updated for authenticated users

### Fixed

- Improved authentication routing
- Better form validation feedback
- Consistent authentication UI
- Protected route redirection
- Authentication provider organization

### Documentation

- Updated README with authentication stack
- Updated PROJECT_STATUS for Phase 3 completion
- Added authentication implementation notes
- Updated project roadmap

### Verification

- ✅ `pnpm typecheck`
- ✅ `pnpm lint`
- ✅ `pnpm build`
- ✅ Authentication pages generated successfully
- ✅ Protected routes verified
- ✅ Session middleware verified
- ✅ OAuth providers configured
- ✅ 24 production routes build successfully

---

# [0.2.1-alpha] — 2026-08-01

## Phase 2 Extension — Landing Page & Dashboard

This release transforms the initial project foundation into a polished application by introducing a premium landing page, a redesigned dashboard, reusable UI components, and production-ready module page shells.

### Added

#### Shared UI Library

- Card
- EmptyState
- ProgressBar
- SearchInput
- StatsCard
- SectionHeader
- FilterDropdown
- FadeIn animation wrapper

#### Dashboard

- Welcome section
- Statistics overview
- Today's Tasks widget
- Active Projects
- Habit Streaks
- Upcoming schedule
- Quick Notes
- Recent Activity
- Monthly balance summary

#### Landing Page

- Hero section
- Features section
- How It Works
- Product Preview
- Testimonials
- Roadmap timeline
- Call-to-Action section
- Footer

#### Module Pages

Completed page shells for:

- Dashboard
- Tasks
- Habits
- Journal
- Notes
- Projects
- Goals
- Calendar
- Skills
- Expenses
- Interviews
- Resume
- Analytics
- Settings

### Changed

- Rebuilt dashboard with production-ready layout
- Improved marketing experience
- Introduced reusable UI architecture
- Expanded routing structure
- Enhanced motion and accessibility support

### Fixed

- Corrected icon imports
- Standardized Button imports
- Eliminated hydration issues in date formatting
- Improved animation behavior
- Reduced unused imports across modules

### Documentation

- Updated README
- Updated CHANGELOG
- Updated PROJECT_STATUS
- Updated CLAUDE project memory

### Verification

- ✅ `pnpm typecheck`
- ✅ `pnpm lint`
- ✅ `pnpm build`
- ✅ All module routes verified
- ✅ Landing page verified
- ✅ Dashboard verified
- ✅ 17 production routes generated

---
# [0.2.0-alpha] — 2026-07-31

## Phase 2 — Design System & Layout Shell

This release introduced the visual identity of LifeOS with an Apple/Linear-inspired design language, reusable layout components, accessibility improvements, and a complete design system showcase.

### Added

#### Design System

- Apple/Linear-inspired design language
- Cool-toned OKLCH color palette
- Semantic color tokens
- Typography scale
- Spacing system
- Radius tokens
- Shadow tokens
- Motion tokens
- Font tokens
- Typed design token registry (`src/config/design-tokens.ts`)

#### Layout Components

- Dynamic Breadcrumb component
- Responsive Container component
- Header breadcrumb integration
- Improved dashboard layout consistency

#### Design System Showcase

New `/design-system` route including:

- Complete color palette
- Typography samples
- Spacing scale
- Border radius examples
- Shadow previews
- Button variants
- Dialog examples
- Dropdown examples
- Icon gallery
- Theme switcher

#### Accessibility

- Skip-to-content link
- Improved keyboard navigation
- Focus-visible styling
- ARIA improvements
- Better semantic structure
- Reduced-motion support

### Changed

- Refined overall visual identity
- Improved component consistency
- Updated animation timings
- Improved dark mode appearance
- Enhanced responsive layouts

### Fixed

- Focus ring visibility
- Color contrast improvements
- Theme transition behavior
- Keyboard accessibility
- Scrollbar styling consistency

### Documentation

- Updated README
- Updated PROJECT_STATUS
- Updated Design System documentation
- Updated Engineering Handbook

### Verification

- ✅ `pnpm typecheck`
- ✅ `pnpm lint`
- ✅ `pnpm build`
- ✅ Accessibility verified
- ✅ Design System route verified
- ✅ 4 production routes generated

---

# [0.1.0-alpha] — 2026-07-30

## Phase 1 — Project Foundation

This release established the engineering foundation of LifeOS, including project setup, tooling, application architecture, routing, layout shell, providers, configuration, and development standards.

### Added

#### Project Setup

- Next.js 15.5
- React 19
- TypeScript (Strict Mode)
- Tailwind CSS v4
- App Router architecture

#### Development Tooling

- ESLint 9
- Prettier 3
- Husky
- lint-staged
- Drizzle Kit
- pnpm workspace configuration

#### UI Foundation

- shadcn/ui v2
- Base UI primitives
- New York style
- Button component
- Dialog component
- Dropdown Menu component

#### Application Infrastructure

- Theme Provider
- Query Provider
- Sonner Provider
- Root AppProviders
- Route Groups
- Site Configuration
- Navigation Configuration
- Layout Configuration

#### Layout Shell

- Responsive sidebar
- Mobile navigation drawer
- Sticky header
- Theme switcher
- Command palette
- Dashboard layout
- Marketing layout

#### State Management

- Zustand UI store
- TanStack Query factory
- Shared TypeScript types

#### Environment

- Environment validation
- Zod schemas
- Runtime configuration
- Fail-fast startup validation

### Changed

- Established modular project architecture
- Adopted feature-based folder organization
- Standardized coding conventions
- Introduced provider composition pattern
- Centralized application configuration

### Fixed

- TypeScript strict compliance
- Build configuration
- ESLint configuration
- Formatting consistency
- Provider initialization order

### Documentation

Created comprehensive project documentation including:

- README
- Architecture
- Roadmap
- Engineering Handbook
- Folder Structure
- Dependencies
- Project Status
- Changelog
- ADR documentation

### Verification

- ✅ `pnpm format:check`
- ✅ `pnpm typecheck`
- ✅ `pnpm lint`
- ✅ `pnpm build`
- ✅ Initial project verification completed
- ✅ 3 production routes generated

---

# [0.0.1] — 2026-07-29

## Phase 0 — Documentation Foundation

This initial release established the planning, architecture, engineering standards, and documentation required before application development began.

### Added

#### Core Documentation

- README
- Roadmap
- Architecture
- Product Requirements Document (PRD)
- Design System specification
- Database documentation
- API conventions
- Features catalogue
- Security documentation
- Contribution guidelines
- Definition of Done
- Project Status tracker
- Folder Structure guide

#### AI Engineering Documentation

- CLAUDE.md
- DECISIONS.md (Architectural Decision Records)
- MCP documentation
- Rules documentation
- Skills documentation

#### Repository Foundation

- Complete folder structure
- Initial module architecture
- Development roadmap
- Engineering standards
- Documentation-first workflow

### Changed

- Established project vision
- Defined long-term roadmap
- Standardized engineering practices
- Adopted documentation-first development

### Fixed

- N/A (Initial release)

### Documentation

This release primarily consists of documentation and project planning artifacts that define the architecture and development process for all future phases.

### Verification

- ✅ Documentation reviewed
- ✅ Repository structure finalized
- ✅ Development roadmap approved
- ✅ Architecture established

---

## Version History

| Version | Date | Release |
|----------|------------|----------------------------------------------|
| **0.5.0-alpha** | 2026-08-09 | Phase 5 — Dashboard Foundation & Widget Architecture |
| **0.4.0-alpha** | 2026-08-04 | Phase 4 — Database Foundation |
| **0.3.0-alpha** | 2026-08-04 | Phase 3 — Authentication |
| **0.2.1-alpha** | 2026-08-01 | Phase 2 Extension — Landing Page & Dashboard |
| **0.2.0-alpha** | 2026-07-31 | Phase 2 — Design System & Layout Shell |
| **0.1.0-alpha** | 2026-07-30 | Phase 1 — Project Foundation |
| **0.0.1** | 2026-07-29 | Phase 0 — Documentation Foundation |

---

**Maintained by:** Rupesh Yadav

**Project:** LifeOS

**Versioning:** Semantic Versioning (SemVer)

**Format:** Keep a Changelog

**Latest Release:** **v0.5.0-alpha**

**Last Updated:** **2026-08-09**