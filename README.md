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

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui, Framer Motion |
| **Backend** | Next.js Server Actions, Route Handlers |
| **Auth** | Better Auth |
| **Database** | PostgreSQL (Neon Serverless), Drizzle ORM |
| **Validation** | Zod |
| **State** | TanStack Query, Zustand (when needed) |
| **Charts** | Recharts |
| **Package Manager** | pnpm |
| **Deployment** | Vercel |

---

## Project Structure

```
LifeOS/
├── src/
│   ├── app/            # Next.js App Router (routing only)
│   ├── modules/         # Feature modules (isolated, independent)
│   ├── components/      # Shared UI (primitives, layout, shared)
│   ├── lib/             # Infrastructure (db, auth, email, ai, utils)
│   ├── hooks/           # Shared React hooks
│   ├── config/          # App configuration
│   ├── types/           # Global types
│   ├── validation/       # Shared Zod schemas
│   ├── providers/       # React context providers
│   └── styles/           # Global CSS
├── docs/                 # Complete documentation
├── .claude/              # Claude memory and configuration
├── tests/                # Test suites
├── mcp/                  # MCP servers (future)
└── skills/               # Claude skills (future)
```

See `docs/Architecture.md` for the full system design.

---

## Quick Start

> **Note:** The project is in **Phase 0 — Documentation**. Code will begin in Phase 1.

```bash
# Coming soon (Phase 1):
git clone https://github.com/username/LifeOS.git
cd LifeOS
pnpm install
pnpm dev
```

---

## Documentation

| Document | What It Covers |
|----------|---------------|
| [`docs/Roadmap.md`](docs/Roadmap.md) | Development phases and milestones |
| [`docs/Architecture.md`](docs/Architecture.md) | Full system design |
| [`docs/PRD.md`](docs/PRD.md) | Product requirements and vision |
| [`docs/Design-System.md`](docs/Design-System.md) | Visual design language |
| [`docs/Engineering-Handbook.md`](docs/Engineering-Handbook.md) | How we write code |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Data models and schema |
| [`docs/API.md`](docs/API.md) | API design and contracts |
| [`docs/FEATURES.md`](docs/FEATURES.md) | Feature catalog |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Security model |
| [`docs/Definition-of-Done.md`](docs/Definition-of-Done.md) | Feature completion checklist |
| [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md) | Live project tracker |
| [`docs/CHANGELOG.md`](docs/CHANGELOG.md) | Version history |
| [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) | How to contribute |
| [`.claude/CLAUDE.md`](.claude/CLAUDE.md) | Claude's permanent memory |

---

## Current Status

**Phase 0 — Documentation complete.**

- [x] All engineering documentation written
- [x] Complete folder structure designed
- [x] Architectural decisions documented
- [x] Claude configuration files prepared

Next: **Phase 1 — Project Setup** (scaffold Next.js, install dependencies)

---

## Author & Learning

This is a flagship portfolio project by **Rupesh** — Computer Science student using this project to:

1. Master full-stack engineering
2. Build a production-grade application
3. Learn from an experienced mentor (Claude — AI pair programmer)
4. Create a tool for personal daily use

---

## License

MIT

---

*Last updated: 2026-07-29 — Phase 0*