# PRD — Product Requirements Document

> **Version:** 0.1.0-alpha  
> **Last updated:** 2026-07-29  
> **Status:** Phase 0 — Living document, evolves with the project  

---

## Product Vision

**LifeOS is a Personal Operating System** — a unified platform where every dimension of personal productivity lives in one place, under one design language, connected by one data model.

It is not a task app with a calendar bolted on. It is a platform where tasks know about projects, habits feed into goals, expenses show up on the analytics dashboard, and journal entries have context from everything you did that day.

---

## Mission

Give one person a single, beautiful, fast, private tool to run their entire productive life — replacing the scatter of 8 disconnected apps with one operating system they love using every day.

---

## Target Users

### Primary: Me (Rupesh) → CS Student + Aspiring Engineer

- Manages coursework deadlines, personal projects, and job applications
- Tracks habits (study, exercise, reading)
- Keeps a daily journal
- Takes notes during learning
- Manages interview pipeline (applications, statuses, prep)
- Tracks expenses on student budget
- Maintains resume versions per job application
- Wants portfolio-worthy application that demonstrates engineering skill

### Secondary: Any individual knowledge worker

- The "life optimizer" — someone who uses multiple productivity apps
- Values privacy and data ownership (not a company tool)
- Wants a single system, not eight disconnected tools
- Appreciates minimal, beautiful design

### Non-target (Out of scope)

- Enterprise teams (no multi-user management, billing, permissions)
- Replacing project management for large organizations
- Social features / collaboration

---

## Problems Being Solved

| Problem | LifeOS Solution |
|---------|----------------|
| **Tool fragmentation** — tasks in Todoist, notes in Notion, habits in Streaks app, journal in Apple Notes — none connected | One app, one data model. Tasks, projects, habits, notes, journal, expenses — everything linked. One tab, not eight. |
| **Context switching** — Workflow is: Check Todo for tasks → Go to Notion to write about the day → Switch to Calendar → ... | A side navigation changes context; data is already linked. No tool-switching overhead. |
| **No cross-domain insights** — Tasks don't reflect your habits. Your spending report doesn't appear in your material. | Visual analytics spanning all modules. Expenses outside this? Plot them against journal entry mood. It can show that over-allocating workload (tasks) correlated with habit breaks. |
| **Student-specific gaps** — No interview tracker integrated with calendar and journal. No resume manager tied to what you're doing daily. | Modules specifically for CS student needs: interviews, resume, projects, with connected data. |
| **Scattered tools means scattered data** — Your data is fragmented across services. | One database. You own your data. Export anytime. |

---

## Core Modules (v1.0)

Comprehensive feature catalog in [`docs/FEATURES.md`](./FEATURES.md).

| # | Module | Phase | Purpose |
|---|--------|-------|---------|
| 1 | **Dashboard** | Phase 5 | Home: daily overview, widgets, quick actions |
| 2 | **Tasks** | Phase 6 | CRUD for tasks — filters, priorities, completion |
| 3 | **Habits** | Phase 7 | Habit grid tracker, GitHub contribution graph style |
| 4 | **Journal** | Phase 8 | Daily rich-text writing, mood, auto-save |
| 5 | **Notes** | Phase 9 | Long-form notes, tags, search |
| 6 | **Projects** | Phase 10 | Group tasks into projects, timelines |
| 7 | **Goals** | Phase 11 | Link goals to habits + tasks, tracking progress |
| 8 | **Calendar** | Phase 12 | Month/week/day view synced with tasks |
| 9 | **Expenses** | Phase 13 | Track spending by category, monthly charts |
|10 | **Interview Tracker** | Phase 14 | Interview pipeline — upcoming/completed/offered |
|11 | **Resume Manager** | Phase 15 | Resume sections, structured content, PDF export |
|12 | **Analytics** | Phase 16 | Cross-module charts and summaries |
|13 | **Settings & Profile** | Phase 17 | Account management, theme, notifications |

---

## Future Modules (Post v1.0)

Detailed in [`docs/Roadmap.md`](./Roadmap.md#post-v1-future).

- AI Assistant — chatbot via swappable provider abstraction
- Voice Assistant — speech-to-text integration
- Offline PWA — IndexedDB sync
- Mobile App — Capacitor + PWA
- Browser Extension — quick-add tasks, capture pages
- Desktop App — Tauri wrapping web frontend
- Plugin System — externally extensible
- Public API — REST endpoints for data access
- MCP Server — LifeOS as an MCP tool provider
- Family Account — multi-user

---

## Out of Scope (Deliberate)

| Area | Why Not |
|------|---------|
| **Real-time collaboration** (Google Docs-style) | Requires WebSockets, conflict resolution, offline sync. Post v1. Solo tool first. |
| **Enterprise features** — SSO, audit logs, admin console | Target is individual user. |
| **Native mobile apps** | PWA + Capacitor first. Native later. |
| **Calendar sync (Google / Apple)** | External API integration is post v1. |
| **Payments / billing** | It's a personal project; free forever. |
| **Email-as-module** | Won't build a mail client. Notifications and reminders only. |
| **Social features** | This is personal; not social network. |

---

## Success Metrics (What "Done" Looks Like)

### At v1.0 Launch

| Metric | Target |
|--------|--------|
| **Daily usage** | Usable daily by the creator (Rupesh) |
| **Task completion** | Create and verify creation workflow within 30 seconds |
| **Journal write time** | Open journal to content visible <3 seconds |
| **Habit checking** | Check a habit in less than 5 seconds |
| **Lighthouse Performance** | Score ≥ 90 |
| **Lighthouse Accessibility** | Score ≥ 95 |
| **Page load** | Dashboard loads under 1.5 seconds on 3G |
| **All 13 modules** | Every module renders its primary page without error |
| **Zero data loss** | Never lose user data through bugs, revalidate consistently |
| **Working auth** | Registration → Login → Logout complete flow, no leaks |

### Interview Portfolio Ready

- [ ] Clean README, Architecture, ER, API — professional docs
- [ ] Live deployment showing real data
- [ ] Tech decisions with documented alternatives
- [ ] All code accessible and reviewable on mobile web

---

## Product Roadmap Summary

Full roadmap: [`docs/Roadmap.md`](./Roadmap.md).

### Phases (already detailed there)

- **0:** Documentation (now)
- **1:** Project setup
- **2→17:** Module construction
- **18:** Polish + production

---

*Last updated: 2026-07-29 — LifeOS Phase 0*