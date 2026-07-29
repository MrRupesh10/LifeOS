# Contributing to LifeOS

> How to contribute code to this project.

---

## Git Workflow

### Branches

```
main             ─ Always working, always deployable
├── feat/...     ─ Feature branches (from main)
├── fix/...      ─ Bugfix branches (from main)
├── docs/...     ─ Documentation changes (from main)
└── refactor/... ─ Refactor without changing behavior
```

**Rules:**

- Never commit directly to `main` — use branches
- Feature branches branch from `main` (not another feature branch)
- Delete branches after merging
- `main` is the single source of truth

---

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <short summary in present tense, < 72 chars>

[Optional detailed body explaining what and why]
```

### Types

| Type | When |
|------|------|
| `feat` | New feature (minor semantic version bump) |
| `fix` | Bug fix (patch bump) |
| `refactor` | Code restructuring, no behavior change |
| `docs` | Documentation changes only |
| `style` | Formatting, missing semicolons, etc (no code change) |
| `test` | Adding or refactoring tests |
| `chore` | Build tooling, dependencies, config |
| `perf` | Performance improvement |
| `ci` | CI configuration |

### Examples

```
feat: add task creation dialog
fix: resolve habit streak calculation when midnight passes
refactor: extract date-range-picker to shared component
docs: add ER diagram for tasks table
chore: upgrade next to 15.2.0
```

**Note:** Manual, final-edit commit messages. No auto-generated commit messages. Every commit should communicate intent.

---

## Branch Naming Convention

```
<type>/<short-description>

Examples:
feat/task-creation-dialog
fix/habit-streak-midnight-bug
docs/database-schema-update
refactor/shared-date-range-picker
```

---

## Pull Requests

### Before Opening a PR

- [ ] Code passes `pnpm typecheck` — no TypeScript errors
- [ ] Code passes `pnpm lint` — no ESLint warnings or errors
- [ ] Your branch is up-to-date with `main` (rebase, not merge)
- [ ] You have verified the change manually in a browser
- [ ] All .claude docs updated if a decision was made
- [ ] CHANGELOG updated in the `Unreleased` section

### PR Title

Match the commit format: `feat: create task dialog animation`

### PR Body

```
## What?
[X new changes]

## Why?
[Reason]

## Screenshots
(Upload before/after or recording)

## Manual Test Steps
1. ...
2. ...
```

---

## Code Review

Every PR must be reviewed by Claude before being considered "ready."

See `docs/Engineering-Handbook.md#code-review-checklist` for the full checklist.

---

## Release Process (Future)

1. Decide what's in the release
2. Update CHANGELOG (move Unreleased → new version section)
3. Bump version in `package.json`
4. Commit tag: `v<major>.<minor>.<patch>`
5. Push tag; Vercel auto-deploys

---

*Last updated: 2026-07-29*