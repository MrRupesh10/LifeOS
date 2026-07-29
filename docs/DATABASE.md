# DATABASE.md — Data Model & Schema

> This document describes every database table, its columns, relationships, and rationale.
> It's the authoritative reference for the data model.

---

## Technology

- **Database:** PostgreSQL 16 (Neon Serverless)
- **ORM:** Drizzle ORM (SQL-like, type-safe)
- **Migrations:** Drizzle Kit (SQL-based, version-controlled)
- **Keys:** UUIDv7 (time-ordered UUIDs) for all primary keys

---

## Entity-Relationship Diagram (Conceptual)

```
User
 ├─── 1:N ─── Task
 ├─── 1:N ─── Project
 ├─── 1:N ─── Habit
 ├─── 1:N ─── Journal_Entry
 ├─── 1:N ─── Note
 ├─── 1:N ─── Goal
 ├─── 1:N ─── Expense
 ├─── 1:N ─── Interview
 ├─── 1:N ─── Resume_Entry
 ├─── 1:N ─── Calendar_Event
 └─── 1:N ─── Session

Task     N:1 ─── Project (optional)
Habit    N:1 ─── Goal    (optional)
Task     N:1 ─── Goal    (optional)
Goal     N:1 ─── Goal    (parent goal; hierarchical)
```

### Key Principle: Every row is owned by a user

Every table includes `user_id`. Every query filters by `user_id`. This is the most important security rule.

---

## Core Tables

### `users`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` PK | Auto-generated UUIDv7 |
| `email` | `varchar(255)` | Unique, not null |
| `name` | `varchar(255)` | Display name |
| `password_hash` | `varchar(255)` | Hashed password |
| `email_verified_at` | `timestamptz` | Nullable |
| `avatar_url` | `text` | Nullable |
| `created_at` | `timestamptz` | Default now |
| `updated_at` | `timestamptz` | Auto-updated |

**Indexes:** `users_email_idx` UNIQUE on `email`

---

### `sessions`

Better Auth managed sessions table.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` → `users.id` | FK |
| `expires_at` | `timestamptz` | Session timeout |
| `token` | `text UNIQUE` | Session token |
| `created_at` | `timestamptz` | |

**Indexes:** `sessions_user_id_idx` on `user_id`

---

### `tasks`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `title` | `varchar(255)` | not null |
| `description` | `text` | Nullable |
| `due_date` | `timestamptz` | Nullable |
| `priority` | `enum('low','medium','high')` | Default 'medium' |
| `status` | `enum('pending','in_progress','completed','cancelled')` | Default 'pending' |
| `project_id` | `uuid` | FK → projects (nullable) |
| `goal_id` | `uuid` | FK → goals (nullable) |
| `completed_at` | `timestamptz` | Nullable |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indexes:**
- `tasks_user_id_idx` on `user_id`
- `tasks_status_idx` on `status`
- `tasks_due_date_idx` on `due_date`
- `tasks_project_id_idx` on `project_id`

---

### `projects`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `name` | `varchar(255)` | not null |
| `description` | `text` | Nullable |
| `deadline` | `timestamptz` | Nullable |
| `status` | `enum('active','on_hold','completed','archived')` | Default 'active' |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indexes:** `projects_user_id_idx` on `user_id`

---

### `habits`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `name` | `varchar(255)` | not null |
| `description` | `text` | |
| `days_of_week` | `jsonb | integer[]` | e.g. `[1,3,5]` for Mon/Wed/Fri |
| `color` | `varchar(7)` | Hex color like `#3B82F6` |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indexes:** `habits_user_id_idx` on `user_id`

---

### `habit_logs`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `habit_id` | `uuid` | FK → habits |
| `user_id` | `uuid` | FK → users |
| `completed_date` | `date` | The day completed |
| `notes` | `text` | Nullable |
| `created_at` | `timestamptz` | |

**Unique constraint:** `(habit_id, completed_date)` — one completion per habit per day

**Indexes:** `habit_logs_user_id_idx` on `user_id`, `habit_logs_date_idx` on `completed_date`

---

### `journal_entries`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `title` | `varchar(255)` | |
| `content` | `text` (or `jsonb`) | Rich text content (TipTap JSON) |
| `entry_date` | `date` | The date this entry is for |
| `mood` | `enum('great','good','okay','bad','terrible')` | Nullable; self-assessment for that day |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Unique constraint:** `(user_id, entry_date)` — one entry per day per user

**Indexes:** `journal_entries_user_date_idx` on `(user_id, entry_date)` composite

---

### `notes`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `title` | `varchar(500)` | |
| `content` | `jsonb` | Rich text |
| `is_pinned` | `boolean` | Default false |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indexes:** `notes_user_id_idx` on `user_id`

---

### `note_tags`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `name` | `varchar(100)` | |
| `user_id` | `uuid` | FK → users |
| `created_at` | `timestamptz` | |

**Indexes:** `note_tags_user_id_idx` on `user_id`

---

### `note_to_tags`

M:N relationship between notes and tags.

| Column | Type | Notes |
|--------|------|-------|
| `note_id` | `uuid` | FK → notes |
| `tag_id` | `uuid` | FK → note_tags |

**Composite PK:** `(note_id, tag_id)`

---

### `goals`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `title` | `varchar(500)` | |
| `description` | `text` | Nullable |
| `deadline` | `timestamptz` | Nullable |
| `status` | `enum('active','completed','abandoned')` | Default 'active' |
| `parent_goal_id` | `uuid` | Nullable — FK to same table |
| `metrics` | `jsonb` | Key-value like `{"target": 10, "unit": "books"}` |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indexes:** `goals_user_id_idx`, `goals_parent_idx` on `parent_goal_id`

---

### `calendar_events`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `title` | `varchar(500)` | |
| `description` | `text` | |
| `start_at` | `timestamptz` | |
| `end_at` | `timestamptz` | |
| `all_day` | `boolean` | Default false |
| `event_type` | `enum('event','task','habit','reminder')` | What this event represents |
| `source_id` | `uuid` | Nullable — FK to source table (task for task events, etc.) |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indexes:** `calendar_events_user_id_idx`, `calendar_events_range_idx` composite on `(user_id, start_at, end_at)`

---

### `expenses`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `amount` | `decimal(10, 2)` | — |
| `currency` | `varchar(3)` | Default 'USD' |
| `category` | `varchar(100)` | e.g. 'food', 'transport', 'subscriptions' |
| `description` | `text` | Nullable |
| `spent_at` | `date` | Date money was spent |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indexes:** `expenses_user_id_idx`, `expenses_category_idx`, `expenses_date_idx` on `(user_id, spent_at)`

---

### `interviews`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `company` | `varchar(255)` | not null |
| `role` | `varchar(255)` | Job title |
| `date` | `timestamptz` | Interview schedule |
| `status` | `enum('upcoming','completed','offer_received','rejected','cancelled')` | Default 'upcoming' |
| `notes` | `text` | Prep notes / outcome |
| `reminder_enabled` | `boolean` | Default true |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indexes:** `interviews_user_id_idx`, `interviews_date_idx` on `(user_id, date)`

---

### `resume_entries`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → users |
| `section` | `varchar(100)` | e.g. 'experience', 'education', 'projects' |
| `data` | `jsonb` | Structured content for that section |
| `order_index` | `integer` | Display order |
| `created_at` | `timestamptz` | |
| `updated_at` | `timestamptz` | |

**Indexes:** `resume_entries_user_id_idx`

---

## Database Rules

1. Every query includes `WHERE user_id = ...`
2. All mutations are within transactions when affecting multiple tables
3. Migrations are source-controlled (no direct DB changes)
4. Foreign keys are ON DELETE CASCADE only when the child is meaningless without its parent
5. No secrets in database column

---

## Migration Workflow

1. Modify TypeScript schema file in `src/lib/db/schema/`
2. Run `pnpm drizzle-kit generate` — generates SQL migration
3. Review the SQL migration file (always human review)
4. Commit schema + migration together in one commit
5. Apply via `drizzle-kit migrate`

---

*Last updated: 2026-07-29 — Phase 0 — Pre-implementation*