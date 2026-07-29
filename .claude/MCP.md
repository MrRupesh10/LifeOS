# MCP.md — Model Context Protocol & LifeOS

> **Status:** Documentation only. No MCP servers are installed yet.
> This document defines what MCP is, why we will use it, and the roadmap.

---

## What is MCP?

**Model Context Protocol (MCP)** is an open standard developed by Anthropic that lets AI assistants (like Claude) securely access external tools and data sources through a standardized server interface.

Think of it as a **USB-C for AI tools** — a standard protocol that any AI host can speak to any MCP server.

### How It Works

```
┌─────────────────┐     MCP (JSON-RPC)     ┌──────────────────┐
│   Claude Code    │ ◄──────────────────────► │   MCP Server      │
│   (AI Client)    │                          │   (Tool Provider) │
└─────────────────┘                          └──────────────────┘
                                                     │
                                                     ▼
                                          ┌──────────────────┐
                                          │  External System  │
                                          │ (PostgreSQL, Git, │
                                          │  Filesystem, etc) │
                                          └──────────────────┘
```

The AI discovers tools the MCP server provides, generates the right tool call, and executes it.

### Why MCP for LifeOS

During development, Claude Code connected to MCP servers can:

1. **Read/write files** with full context (filesystem MCP)
2. **Execute database queries** to show or validate schema/data during development (PostgreSQL MCP)
3. **Browse the running app** and inspect UI (Browser MCP)
4. **Perform multi-step reasoning** via Sequential Thinking MCP
5. **Automate Git and GitHub actions** (Git + GitHub MCP)

In production, the same servers (or simplified versions) could:
- Task-management MCP: read/update tasks from external apps
- Calendar MCP: sync events
- Existing servers become production tooling

---

## Planned MCP Servers

| MCP Server | Purpose | Filesystem Context | Priority |
|------------|---------|--------------------|----------|
| **Filesystem** | Read/write project files securely | `src/`, `docs/`, `.claude/` | Highest — essential for development |
| **PostgreSQL** | Direct database access for query verification, schema exploration | Read-only queries during development | High — database heavy |
| **Git / GitHub** | Commits, PRs, branch management | `.git/` | High — professional Git |
| **Browser (Playwright)** | Visual verification of the running app | Browser context | Medium — for dashboard testing |
| **Sequential Thinking** | Complex multi-step debugging or architecture design | Internal reasoning | Medium |
| **Docs** | Reading documentation, searching references | Online | Medium |
| **Task Manager** | (Future) External integration — sync tasks | LifeOS API | Low |
| **Calendar** | (Future) External integration — sync events | LifeOS API | Low |

---

## MCP Design Principles

When we build MCP servers, they follow these rules:

1. **Reusable:** Never tightly couple to LifeOS — each server should work with any project
2. **Isolated:** Each MCP server is a standalone process with well-defined inputs/outputs
3. **Secure:** No full disk access; scoped to the current project directory or explicit paths
4. **Standard-compliant:** Follow MCP specification exactly — use official SDKs
5. **Testable:** Each server has its own test suite

---

## MCP Server Structure (Future)

```
mcp/
├── filesystem/
│   ├── src/
│   │   ├── index.ts          # Server entry
│   │   ├── tools/             # Tool definitions
│   │   └── tests/             # Server tests
│   ├── package.json
│   └── README.md
├── git/
├── postgres/
├── browser/
└── github/
```

Each server will have its own `package.json` and is independently publishable.

---

## Implementation Timing

MCP servers will be installed and configured **after Phase 1 (Project Setup)** when the Next.js project is scaffolded and a basic development experience is established.

Early on, we'll install:
- Filesystem MCP (development automation)
- PostgreSQL MCP (database exploration)

Later:
- Git/GitHub MCP (portfolio-quality commits)
- Browser MCP (visual testing)

---

*Last updated: 2026-07-29 — LifeOS Phase 0*