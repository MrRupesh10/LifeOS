# SKILLS.md — Claude Skills for LifeOS

> **Status:** Documentation only. Skills will be created as we discover repeatable workflows.
> This document serves as both a catalog and a planning tool.

---

## What Are Claude Skills?

Claude Skills are reusable, named workflows that Claude Code can invoke on demand.

A Skill is:
- A `.md` file that loads a specific set of instructions for a specific task type
- Invoked by the user with `/<skill-name>` or by Claude automatically when the task matches
- Reusable across sessions and projects

Skills capture **expertise and workflow patterns** so Claude doesn't need to reinvent the approach each time.

---

## Why Skills Matter for LifeOS

1. **Consistency** — every code review follows the same checklist
2. **Speed** — reproducibility means no rewriting "how to review React code" each time
3. **Mentorship** — skills encode senior engineer thinking into reusable instructions
4. **Portability** — skills are stored in this repo as files; they travel with the project

---

## Planned Skills

### Code Quality

| Skill | Triggers On | Purpose |
|-------|-----------|----------|
| **Code Reviewer** | `review`, `/code-review`, "check this code", "review my PR" | Review code for correctness, security, performance, style; use ReportFindings format |
| **Security Auditor** | `security`, `audit`, `vulnerability`, `data leak` | Scan code for OWASP top 10; check auth, input validation, SQL injection, XSS |
| **Testing Engineer** | `test`, `write tests`, `test coverage` | Write unit/integration tests for given code; choose testing pattern |
| **Performance Optimizer** | `performance`, `slow`, `optimize`, `bundle size` | Profile, identify bottlenecks, load best practices for React/Next.js slow paths |
| **Refactoring Assistant** | `refactor`, `clean up`, `simplify` | Restructure without changing behavior; maintain backward compatibility |
| **Accessibility Expert** | `a11y`, `accessibility`, `screen reader`, `keyboard` | Check ARIA, focus management, color contrast, semantic HTML |

### Development

| Skill | Triggers On | Purpose |
|-------|-----------|----------|
| **React Expert** | Complex React questions, component design, hooks patterns | Best practices for server/client component separation, composition, rendering optimization |
| **Next.js Optimizer** | `next`, `Next.js`, `build`, `deploy`, `route handler` | Route design, server actions, data caching, ISR/SSG decisions, Middleware |
| **Database Architect** | `database`, `schema`, `migration`, `query`, `index` | Design schema ER, write migrations, index advice, query optimization |
| **API Designer** | `api`, `endpoint`, `route handler`, `REST` | Design restful API patterns, error responses, pagination, filtering, versioning |

### Design & Documentation

| Skill | Triggers On | Purpose |
|-------|-----------|----------|
| **UI Designer** | `design`, `component`, `looks`, `style`, `responsive` | Design component layout, responsive breakpoints, visual hierarchy; apply design system |
| **Documentation Writer** | `document`, `README`, `decisions`, `architecture` | Write clear technical documentation that explains WHY, not just WHAT |

---

## Skill Creation Convention

When we create a new Skill:

1. The Skill file lives in `skills/<name>.md`
2. It includes:
   - **Triggers** — when does this skill activate
   - **Instructions** — what Claude should do when invoked
   - **Checklist** — the quality gates for this skill type
   - **Examples** — good vs. bad practice for this domain

---

## Skill Schedule

| Order | Skill | Phase |
|-------|-------|-------|
| 1 | Code Reviewer | Project Setup (Phase 1) |
| 2 | React Expert | Authentication (Phase 2) |
| 3 | Database Architect | Database (Phase 4) |
| 4 | API Designer | Module implementation |
| 5 | Next.js Optimizer | Deployment prep |
| 6 | Security Auditor | Before public launch |

Full set by Phase 15 (v1.0 ready).

---

*Last updated: 2026-07-29 — LifeOS Phase 0*