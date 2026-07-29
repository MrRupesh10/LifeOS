# Engineering Handbook — How We Write Code

> This is the comprehensive guide for writing production-grade code in LifeOS.
> It covers philosophy, conventions, and patterns.
> Every engineer contributing to this project should read this first.

---

## Table of Contents

1. [Coding Philosophy](#coding-philosophy)
2. [Naming Conventions](#naming-conventions)
3. [Folder Conventions](#folder-conventions)
4. [Component Conventions](#component-conventions)
5. [Server vs Client Component Guide](#server-vs-client-component-guide)
6. [Error Handling](#error-handling)
7. [Logging](#logging)
8. [Performance](#performance)
9. [Accessibility](#accessibility)
10. [Testing Strategy](#testing-strategy)
11. [Code Review Checklist](#code-review-checklist)
12. [AI Code Guidelines](#ai-code-guidelines)

---

## Coding Philosophy

### Principle 1: Explicit Always

Code that communicates intent wins. An engineer reading your code for the first time should understand what it does in 30 seconds.

```typescript
// ❌ Implicit — magic numbers and abbreviations
if (tsk.d > new Date()) { ... }

// ✅ Explicit
if (task.dueDate > new Date()) { ... }
```

### Principle 2: Fail Fast, Fail Loud

If something goes wrong, the error should surface immediately with a clear message. Never silently swallow errors unless there's a well-documented reason.

```typescript
// ❌ Silent failure
try {
  await processPayment()
} catch (e) {
  // (nothing)
}

// ✅ Fail loud
try {
  await processPayment()
} catch (error) {
  console.error('[PaymentProcessor] Failed to process payment:', error)
  Sentry.captureException(error) // future monitoring
  throw new PaymentError('Payment failed, please try again')
}
```

### Principle 3: Single Responsibility

Every function, component, and file does one thing. If you need "and" in the description, it's too much.

### Principle 4: Early Return

Prefer early return over nesting.

```typescript
// ❌ Deep nesting
function getTasks(userId: string) {
  if (userId) {
    const user = findUser(userId)
    if (user) {
      const tasks = user.getTasks()
      if (tasks?.length > 0) {
        return tasks
      }
    }
  }
  return []
}

// ✅ Early return
function getTasks(userId: string): Task[] {
  if (!userId) return []
  const user = findUser(userId)
  if (!user) return []
  const tasks = user.getTasks()
  return tasks ?? []
}
```

### Principle 5: Composition Over Inheritance

React components use composition. Not class hierarchy.

```typescript
// ✅ Composition
<Card>
  <CardHeader title="Projects" />
  <CardBody>
    <ProjectList projects={projects} />
  </CardBody>
  <CardFooter>
    <CreateProjectButton />
  </CardFooter>
</Card>
```

---

## Naming Conventions

| Category | Convention | Example |
|----------|-----------|----------|
| **Component Files** | PascalCase | `TaskCard.tsx` |
| **Utility Files** | kebab-case | `format-date.ts` |
| **Server Action Files** | `actions.ts` (always) | `tasks/actions.ts` |
| **Validation Files** | `validation.ts` (always) | `tasks/validation.ts` |
| **Type Files** | `types.ts` (always) | `tasks/types.ts` |
| **Component Props** | `ComponentProps` interface | `TaskCardProps` |
| **Functions** | camelCase, verb-first | `createTask()`, `getUser()` |
| **Event Handlers** | `handle + Event` | `handleSubmit`, `handleClick` |
| **Boolean Variables** | `is` / `has` / `should` prefix | `isLoading`, `hasError`, `shouldRedirect` |
| **Types/Interfaces** | PascalCase | `Task`, `User`, `CreateTaskInput` |
| **Zod Schemas** | camelCase + `Schema` | `createTaskSchema`, `loginSchema` |
| **Database Tables** | plural snake_case | `tasks`, `user_sessions` |
| **Database Columns** | singular snake_case | `created_at`, `user_id` |
| **Hooks** | `use` prefix | `useTasks()`, `useCreateTask()` |
| **Context Providers** | PascalCase + `Provider` | `AuthProvider` |

### Name Length Guideline

- Short names for tiny scopes (loop indices: `i`, `task`)
- Medium names for folder-level scope (`TaskRepository`)
- **The more visible something is, the more descriptive it must be.**

---

## Folder Conventions

### What Goes Where

```
src/
├── app/               └── Routing ONLY.  Thin layer.
│
├── modules/           └── Feature code.
│   Ownership: module-specific logic (business logic, components, hooks)
│   Does NOT contain: shared infra, shared UI
│
├── components/
│   ├── ui/            └── Basic design-system primitives (Button, Card, Dialog)
│   │   Ownership: shadcn/ui + custom primitives
│   │   Does NOT contain: any business logic
│   │
│   ├── layout/        └── Layout structure (Sidebar, Header, Shell)
│   │   Ownership: layout grid, responsive behavior
│   │   Does NOT contain: page-specific content
│   │
│   └── shared/        └── UI components used across modules
│       Ownership: cross-module convenience components
│
├── lib/               └── Infrastructure. Platform servers that
│       each module depends on.
│   ├── db/            — Database: schema, migrations, client
│   ├── auth/          — Better Auth config (server + client)
│   ├── email/         — Email provider abstraction
│   ├── ai/            — AI provider swaps (future)
│   ├── utils/         — Pure utility functions, no side effects
│   └── config/        — Configuration (loads from env)
│
├── hooks/             — Shared Hooks (used by 2+)
│   Description: React hooks that are not tied to any one module
│
├── types/             — Global TypeScript definitions
│   Description: Types that the whole app imports
│   Does NOT contain: module-specific types (those in modules/<name>/types.ts)
│
├── validation/         — Shared Zod schemas
│   Description: The schemas that might be used by multiple modules
│
├── config/            — Application configuration
│   Description: Reading environment variables, merging defaults
│
├── constants/          — Imperative constants
│   Description: Values that never change
│
├── providers/         — React context providers
│   Description: AuthProvider, QueryClientProvider, ThemeProvider
│
└── styles/              — Global CSS or Tailwind config
```

### Antipatterns — Where NOT to Put Things

| Antipattern | Why It's Bad | Where Instead |
|-------------|-------------|---------------|
| `components/TaskCard.tsx` | Not a UI primitive, not shareable | `modules/tasks/components/` |
| `lib/create-task.ts` | Not infrastructure | `modules/tasks/actions.ts` |
| `app/(dashboard)/tasks/logic.ts` | `app/` is for routing | `modules/tasks/` |
| Dump everything into `lib/` | No ownership boundary | Split by domain |

---

## Component Conventions

### Component Template

```typescript
// ─── Imports ───
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'

// ─── Types ───
interface TaskCardCoreProps {
  id: string
  title: string
  completed: boolean
  onToggle: (id: string) => void
}

export function TaskCard({ id, title, completed, onToggle }: TaskCardCoreProps) {
  // 1. Hooks
  const [isExpanded, setIsExpanded] = useState(false)

  // 2. Derived state
  const statusLabel = completed ? 'Done' : 'Pending'

  // 3. Event handlers
  function handleExpandToggle() {
    setIsExpanded(prev => !prev)
  }

  // 4. Render
  return (
    <div className={cn('p-4 rounded', completed && 'bg-green-50')}>
      <h3>{title}</h3>
      <Button onClick={() => onToggle(id)}>{statusLabel}</Button>
    </div>
  )
}
```

### Rules

1. **One component per file.** Private helper components (<30 lines) can share the same file.
2. **Props as destructured parameter**, not `React.FC`.
3. **No default exports** for components — use named exports.
4. **Every component handles three states:** Loading, Empty, Error (see below).

### Three States Everywhere

Every data-driven component must handle these three states:

```typescript
function TaskList({ tasks, isLoading, error }: TaskListProps) {
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />
  if (isLoading) return <LoadingSkeleton count={3} />
  if (!tasks?.length) return <EmptyState icon={CheckCircle} message="No tasks" />
  return tasks.map(task => <TaskCard key={task.id} {...task} />)
}
```

---

## Server vs Client Component Guide

### Decision Tree

```
Where does the component go?

    Can this component render without browser interaction?
    (No useState, useEffect, event handlers, browser APIs)

          YES ─────────► Server Component (default)
          │              Benefits:
          │              - Rendering on the server
          │              - Zero bytes client JS
          │              - Can `await` inside
          │              - Direct DB access

          NO ───► Client Component ('use client')
                   Required for:
                   - useState / useReducer / useEffect
                   - onClick, onSubmit, onChange
                   - window, document, localStorage
                   - Context consumption
```

### The Composition Pattern

When a page needs both server and client parts:

```typescript
// page.tsx — Server Component
// Can do: await db.query.tasks.findMany()
export default async function TasksPage() {
  const tasks = await getTasks()
  return (
    <div>
      <h1>Tasks</h1>
      {/* Client component nested inside server */}
      <TaskList tasks={tasks} />      // Now has clickable tasks
    </div>
  )
}

// TaskList.tsx — Client Component
'use client'
export function TaskList({ tasks }: { tasks: Task[] }) {
  // 'use client' for: useState, interaction
  const [filter, setFilter] = useState('all')
  return (
    <Select value={filter} onChange={setFilter}>
      {tasks.filter(byFilter(filter)).map(task => (
        <TaskCard key={task.id} {...task} />
      ))}
    </Select>
  )
}
```

### Data Fetching Pattern

```typescript
// Server Component: fetch here
// Date: 2026-07-29 — async in server component
export default async function TasksPage() {
  const tasks = await db.query.tasks.findMany({
    where: eq(tasks.userId, userId)
  })

  return <TaskClientList tasks={tasks} />
}

// Client Component: from TanStack Query
'use client'
export function TaskClientList({ tasks: initialTasks }: { tasks: Task[] }) {
  const { data: tasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => fetch('/api/tasks').then(r => r.json()),
    initialData: initialTasks, // Hydrate from server props
  })
}
```

---

## Error Handling

### Error Boundary Pattern

```
API → Route/Server Action → [Any errors] → { error: <message> } object

```
// Every server action return Union type
type ActionResult<T> = { data: T } | { error: string }
```

Server Action pattern:

```typescript
export async function createTask(input: unknown): Promise<ActionResult<Task>> {
  try {
    const session = await auth()
    if (!session) return { error: 'Unauthorized' }

    const parsed = createTaskSchema.parse(input)
    const [task] = await db.insert(tasks).values({
      ...parsed,
      userId: session.user.id,
    }).returning()

    return { data: task }
  } catch (error) {
    console.error('[createTask] Failed:', error)
    return { error: 'Failed to create task. Please try again.' }
  }
}
```

Calling side (React Hook):

```typescript
// handles the { error } pattern
const { execute, error } = useCreateTask()

if (error) {
  toast.error(error)
}
```

### Error. Boundaries

```typescript
<ErrorBoundary fallback={<TaskListError />}>
  <TaskList />
</ErrorBoundary>
```

---

## Logging

### Log Levels

- **`console.error()`** — Unrecoverable problems that prevent core function
- **`console.warn()`** — Anomalies that need developer attention
- **`console.info()`** — Important events (user signup, deletion)
- **`console.debug()`** — (Not in production)

### Log Format

```typescript
// Always prefix with module name
console.error('[Tasks] Failed to create task:', taskId, error)

// For structured logging (future):
logger.error({
  module: 'tasks',
  action: 'createTask',
  error: error.message,
  userId: userId
})
```

---

## Performance

### Architecture-Level

- **Server Components** are free optimization — no client JS
- **Code splitting** — Next.js splits by route automatically
- **Image optimization** — Next.js `<Image>`, lazy by default
- **Connection pooling** — Neon serverless connections always pooled

### Component-Level

- **Memoize expensive computations** with `useMemo`
- **Memoize callback props** with `useCallback` when passed to `React.memo`
- **Use `startTransition` for expensive updates** → keep UI responsive

### TanStack Query

- **Stale-while-revalidate** by default — shows cache, fetches new data in background
- **Query cache** garbage-collected after inactivity

---

## Accessibility

### Required Checklist for Every New Component

- [All interactive elements are clickable/usable with a keyboard]
- [All images have `alt` text or `alt=""` for decoration]
- [Contrast ratio meets WCAG AA]
- [Focus management: focus returns to trigger after dialog/modal closes]
- [Forms always have labels (visible or `aria-label`)]
- [Headless UI (shadcn/ui) ensures most a11y out of the box]
- [Testing: test with keyboard (Tab, Enter, Escape)]

---

## Testing Strategy

### Hierarchical Testing

```
Level 1: Manual Verification ─ Every feature verified in browser first
  │
Level 2: Unit Tests ─ Complex utilities, validation schemas
  │
Level 3: Integration Tests ─ API endpoints, full flow from input to output
  │
Level 4: E2E (Future) ─ Playwright for critical user paths
`

### Testing Approach

For each feature:

1. **Manual test** — spin up the app, test on happy path + edge case
2. **Validation test** — Zod schemas tested with valid / invalid payloads
3. **Action test** — server action called in test with mock session
4. **Component test** — React Testing Library simulating user interaction (future)

### Example Unit Test for Zod

```typescript
describe('createTaskSchema', () => {
  it('rejects empty title', () => {
    const result = createTaskSchema.safeParse({ title: '' })
    expect(result.success).toBe(false)
  })

  it('accepts valid task', () => {
    const result = createTaskSchema.safeParse({
      title: 'Buy groceries',
      priority: 'high'
    })
    expect(result.success).toBe(true)
  })
})
```

---

## Code Review Checklist

Every PR must pass these checks:

### Before Opening PR
- [ ] Branches from `main` (not from another feature branch)
- [ ] Code passes local linting and type-check
- [ ] Components handle loading, empty, error, and success states
- [ ] No `any` types anywhere
- [ ] No unused imports
- [ ] No leftover `console.log` in production code
- [ ] No commented-out code (Git history exists for a reason)
- [ ] Feature checked on mobile viewport

### During Review
- [ ] Error handling: all server actions return `{ data }` or `{ error }`
- [ ] Security: all DB queries filter by `userId`
- [ ] No dead code or duplicate utilities
- [ ] Component complexity is reasonable (split if >200 lines)
- [ ] Asynchronous work gracefully handled (async/await not fire-and-forget)

---

## Code Generation Guidelines (for AI)

When AI generates code in LifeOS, it must do:

- [ ] Write comments using explicit function names and data flow
- [ ] Never write magic numbers (name them as constants)
- [ ] Named exports everywhere
- [ ] Explicit return types on all functions (ensure type safety)
- [ ] Error handling in every server action and API route
- [ ] No TODO comments without a tracking issue number
- [ ] Prefer `const` over `let` over `var`

When AI generates React code, it must:

- [ ] Mark `'use client'` only when client features are needed
- [ ] Destructure props, obvious naming
- [ ] Every input field connected to a form state
- [ ] All forms validate client-side AND server-side

When AI generates API code, it must:

- [ ] Every handler has: Authentication check, input validation, business logic, response serialization
- [ ] All errors are user-readable messages (not stack traces)

---

*Last updated: 2026-07-29 — LifeOS Phase 0*