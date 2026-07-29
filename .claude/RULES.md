# RULES.md — Non-Negotiable Coding Rules

> Every rule in this file is non-negotiable. Violations should be treated as bugs.
> This file evolves as we learn — rules can be added, clarified, or (rarely) removed.

---

## Dependency Rules

### R-DEP-01: Never Install Deprecated Packages
Before installing any package, verify it hasn't been deprecated or superseded. Check:
- npm registry metadata (`deprecated` field)
- GitHub last-commit date (should be <1 year inactive)
- Community adoption trends

### R-DEP-02: Justify Every Dependency
Every new dependency must answer:
- **What** it does
- **Why** we need it
- **What alternatives** exist
- **What tradeoffs** come with this choice
- **Record** in `.claude/DECISIONS.md`

### R-DEP-03: Prefer Zero Dependencies
Always explore the native solution first. Never pull a library for:
- Left-pad (`"test".padStart(10)`)
- `.isEmpty()` (`!arr.length`)
- Simple helper functions you can write yourself

---

## File Organization Rules

### R-ORG-01: Never Dump Into `components/` or `lib/`
- Module-specific code lives in `src/modules/<name>/`
- Shared components live in `src/components/shared/`
- Infrastructure code lives in `src/lib/`
- A file's location signals its ownership

### R-ORG-02: One Component Per File
- Exceptions: small private helper components (under ~30 lines)
- If a component is exported, it deserves its own file

### R-ORG-03: Co-locate Tests
Keep test files reflecting the same structure as `src/`:
```
tests/unit/modules/tasks/actions.test.ts
tests/unit/lib/utils/format-date.test.ts
```

---

## TypeScript Rules

### R-TS01: Never Use `any`
Use `unknown` and narrow:
```typescript
// ❌
const data: any = await response.json()
return data.items

// ✅
const data = await response.json()
if (isApiResponse(data)) {
  return data.items
}
```

### R-TS02: Never Use `as` Type Casts
Use type guards or Zod parsing:
```typescript
// ❌
const task = data as Task

// ✅
const task = taskSchema.parse(data)
```

### R-TS03: Always Use Strict TypeScript
- `"strict": true` in tsconfig
- `"noUncheckedIndexedAccess": true`
- `"noImplicitReturns": true`

### R-TS04: Always Explicitly Return Exported Functions
```typescript
// ❌
export function getTask(id: string) {
  return tasks.find(t => t.id === id)
}

// ✅
export function getTask(id: string): Task | undefined {
  return tasks.find(t => t.id === id)
}
```

---

## React Rules

### R-REACT01: Prefer Server Components
Default to server components. Only use `'use client'` when you need:
- `useState`, `useEffect`, `useRef`
- Event handlers (`onClick`, `onSubmit`)
- Browser APIs (`window`, `localStorage`, etc)
- Context consumers
- Refs

### R-REACT02: Prefer Server Actions
For mutations (creates, updates, deletes), use Server Actions:
```typescript
// ❌ POST /api/tasks
// ✅
export async function createTask(input: CreateTaskInput): Promise<Task> {
  // ...
}
```

### R-REACT03: Use React Hook Form + Zod
- Forms: React Hook Form
- Validation: Zod (shared schemas work the client and server)
- No `useState` for form inputs

### R-REACT04: Never Use Global State for Server Data
- Server data → TanStack Query
- Local UI-only state → `useState`/`useReducer`
- Rare cross-component UI state → Zustand (last resort)

---

## Component Rules

### R-COMP01: Every Component Must Handle Three States
```
loading → <LoadingSkeleton />
empty   → <EmptyState />
error   → <ErrorState />
data    → <ActualComponent />
```

### R-COMP02: Prefer Composition Over Inheritance
```typescript
// ❌
class TaskCard extends Card { ... }

// ✅
<Card>
  <TaskContent />
</Card>
```

### R-COMP03: Props Before Context
- Pass data through props by default
- Context only when props drill through 3+ layers and the intermediary components don't use the data

### R-COMP04: Never Duplicate Components
Before creating a component:
1. Search `/components/ui/` first
2. Then search `/components/shared/`
3. Then ask: "Does this already exist in any module's components?"

---

## Architecture Rules

### R-ARCH01: Modules Must Be Independent
- A module must function even if another module is removed
- Shared logic must be elevated to `src/lib/`

### R-ARCH02: Never Import Across Modules
```
✅ modules/tasks/components/TaskCard.tsx → src/components/ui/Button.tsx
✅ modules/tasks/components/TaskCard.tsx → src/lib/utils/format-date.ts
❌ modules/tasks/components/TaskCard.tsx → src/modules/habits/components/HabitCard.tsx
```

### R-ARCH03: AI Is an Enhancement, Never a Dependency
- Base application must work with zero AI
- AI providers must be swappable without changing platform code
- AI integration goes through `src/lib/ai/providers/` abstraction

---

## Code Review Rules

Every piece of code written must pass these checks:

- [ ] Correct: it actually works for all states (happy path + error + empty + loading)
- [ ] Safe: type-safe, no bad casts, input validated, SQL parametrized
- [ ] Readable: a new engineer can understand what it does in 30 seconds
- [ ] Consistent: follows naming conventions, file conventions
- [ ] Documented: complex logic explained with comments, decisions recorded
- [ ] Tested: at minimum manual, ideally unit
- [ ] No duplicates: searches the codebase for existing solutions first

---

## Explanation Rules

### R-EXP01: Explain Architecture Before Code
Every Plan and every feature starts with **architecture**, then **file structure**, then **implementation**.

### R-EXP02: Every File Explained
When creating a file, explain:
- **Why** it exists
- **What** its responsibility is
- **How** it interacts with the rest of the project

### R-EXP03: Every Folder Explained
When creating a folder, explain:
- **Why** it exists
- **What** belongs inside it
- **What** does NOT belong inside it

---

## Phase Zero Rules

### R-PHASE00: Wait for Approval
Do NOT create any application code until explicit approval is given. Phase 0 is documentation only.

---

*Last updated: 2026-07-29 — LifeOS Phase 0*