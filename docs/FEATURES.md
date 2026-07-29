# FEATURES.md — Feature Catalog

> Every feature in LifeOS, documented by module.
> Status legend: 🔜 Planned | 🚧 In Progress | ✅ Complete | 🔮 Future (post v1.0)

---

## Core Modules

### Dashboard ✅

| Feature | Status |
|---------|--------|
| Overview widget grid | 🔜 |
| Today's tasks card | 🔜 |
| Today's habits card | 🔜 |
| Journal entry quick view | 🔜 |
| Quick-add button (FAB) | 🔜 |
| Weekly activity chart | 🔜 |
| Daily quote | 🔜 |

### Tasks ✅

| Feature | Status |
|---------|--------|
| Create / Edit / Delete task | 🔜 |
| Task list with status columns | 🔜 |
| Filter: all, today, upcoming, completed | 🔜 |
| Sort: by due date, priority, created | 🔜 |
| Completion toggle with animation | 🔜 |
| Due date picker | 🔜 |
| Priority (low, medium, high) | 🔜 |
| Inline edit | 🔜 |
| Bulk actions (select multiple) | 🔮 |

### Habits ✅

| Feature | Status |
|---------|--------|
| Create / Edit / Delete habit | 🔜 |
| Habit grid display (GitHub-style) | 🔜 |
| Daily completion toggle | 🔜 |
| Streak counter | 🔜 |
| Habit color | 🔜 |
| Weekly completion report | 🔮 |

### Journal ✅

| Feature | Status |
|---------|--------|
| Daily journal entry | 🔜 |
| Rich text editor (TipTap) | 🔜 |
| Auto-save | 🔜 |
| Navigation by day | 🔜 |
| Past entries list | 🔜 |
| Mood tracking | 🔜 |
| Search entries | 🔮 |
| Calendar view of entries | 🔮 |

### Notes ✅

| Feature | Status |
|---------|--------|
| Create / Edit / Delete note | 🔜 |
| Rich text editor | 🔜 |
| Tags | 🔜 |
| Search by text / tag | 🔜 |
| Pin notes | 🔜 |
| Note sidebar for navigation | 🔜 |
| Markdown export | 🔮 |

### Projects ✅

| Feature | Status |
|---------|--------|
| Create / Edit / Delete project | 🔜 |
| Create tasks inside projects | 🔜 |
| Project deadline | 🔜 |
| Project progress bar | 🔜 |
| Project archive | 🔜 |
| Gantt/ Timeline view | 🔮 |

### Goals ✅

| Feature | Status |
|---------|--------|
| Create / Edit / Delete goal | 🔜 |
| Link goals to tasks / habits | 🔜 |
| Hierarchical goals (parent/child) | 🔜 |
| Progress tracking (bar) | 🔜 |
| Custom metrics | 🔜 |

### Calendar ✅

| Feature | Status |
|---------|--------|
| Month view | 🔜 |
| Week view | 🔜 |
| Day view | 🔜 |
| Tasks auto-appear on their due date | 🔜 |
| Create event (time-bound) | 🔜 |
| Drag-to-reschedule | 🔮 |

### Interview Tracker ✅

| Feature | Status |
|---------|--------|
| Create interview (company, date, role) | 🔜 |
| Track status: upcoming, completed, offer, rejected | 🔜 |
| Prep notes | 🔜 |
| Reminder enabled/disabled | 🔜 |
| Interview analytics (count, conversion) | 🔮 |

### Expense Tracker ✅

| Feature | Status |
|---------|--------|
| Create / Edit / Delete expense | 🔜 |
| Category selection | 🔜 |
| Date of spending | 🔜 |
| Monthly total chart | 🔜 |
| Category breakdown chart | 🔜 |
| Export to CSV | 🔮 |

### Resume Manager ✅

| Feature | Status |
|---------|--------|
| Resume sections (experience, education, projects) | 🔜 |
| Rich-structured JSON per entry | 🔜 |
| Order/rank entries | 🔜 |
| PDF export | 🔮 |

### Analytics ✅

| Feature | Status |
|---------|--------|
| Dashboard with charts across modules | 🔜 |
| Tasks completed trend (weekly) | 🔜 |
| Habits consistency (heatmap) | 🔜 |
| Expense breakdown (by category) | 🔜 |
| Productivity score | 🔮 |
| Export report | 🔮 |

### Settings & Profile ✅

| Feature | Status |
|---------|--------|
| Edit display name, avatar | 🔜 |
| Change password | 🔜 |
| Notifications preferences | 🔜 |
| Theme toggle (light/dark) | 🔜 |
| Data export | 🔮 |
| Account deletion | 🔮 |

---

## Cross-Cutting Features

### Dashboard ✅

| Feature | Status |
|---------|--------|
| Homepage with widgets | 🔜 |
| Widgets: tasks, habits, journal, calendar, analytics mini | 🔜 |
| Daily quote | 🔜 |

### Authentication ✅

| Feature | Status |
|---------|--------|
| Register (email/password) | 🔜 |
| Login | 🔜 |
| Logout | 🔜 |
| Email verification | 🔜 |
| Forgot password / reset | 🔜 |
| Session management | 🔜 |
| Route protection (middleware) | 🔜 |
| OAuth (Google, GitHub) | 🔮 |

### Notifications ✅

| Feature | Status |
|---------|--------|
| In-app notifications bell | 🔮 |
| Reminder (habit due, task due, interview) | 🔮 |
| Email notifications | 🔮 |

### AI Assistant ✅

| Feature | Status |
|---------|--------|
| Chat interface | 🔮 |
| Auto-suggest tasks | 🔮 |
| Summarize journal | 🔮 |

### Search ✅

| Feature | Status |
|---------|--------|
| Global search command palette | 🔜 |
| Full-text search across notes/journal | 🔮 |

---

## Deployment & Infrastructure ✅

| Feature | Status |
|---------|--------|
| Vercel deployment | 🔜 |
| Neon PostgreSQL | 🔜 |
| PWA (installable) | 🔮 |
| Custom domain | 🔮 |
| CI (Vercel auto-deploy) | 🔜 |

---

## Future (post v1)

### Platform

| Feature | Status |
|---------|--------|
| Offline mode (IndexedDB) | 🔮 |
| Mobile PWA | 🔮 |
| Desktop app (Tauri) | 🔮 |
| Browser extension | 🔮 |
| Public API | 🔮 |
| MCP integration (use as external tool) | 🔮 |
| Multi-user / family plan | 🔮 |

---

*Last updated: 2026-07-29 — Phase 0*