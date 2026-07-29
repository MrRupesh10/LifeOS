# API.md — API Design & Contracts

> This document defines the API architecture, conventions, and contracts.
> It's the source of truth for how the frontend communicates with the backend.

---

## API Philosophy

LifeOS uses **Server Actions** as the primary mutation API and **Route Handlers** only for external-facing endpoints.

| Pattern | Use When | Example |
|---------|----------|---------|
| **Server Action** | Mutate data from a React component (form submit, click) | Create task, toggle habit |
| **Route Handler** | External system needs HTTP endpoint | Webhooks, REST API, health check |

---

## Server Actions Pattern

### Signature Convention

Every Server Action follows this exact contract:

```typescript
type ActionResult<T = void> =
  | { data: T; error?: never }
  | { data?: never; error: string }
```

- Success → `{ data: <result> }`
- Failure → `{ error: "human-readable message" }`

### Action Lifecycle

```
User action in browser
    │
    ▼
form.handleSubmit() or onClick call action
    │
    ▼
Server Action executes (only on server):
    1. Authenticate — verify session exists, attach userId
    2. Validate — Zod parse; return { error } if invalid
    3. Mutate — Drizzle ORM query (parameterized, safe)
    4. Revalidate — attempt to refetch UI data
    5. Return → { data } or { error }
```

### Example: Create Task Action

```typescript
// modules/tasks/actions.ts
'use server'

import { auth } from '@/lib/auth/server'
import { db } from '@/lib/db/client'
import { tasks } from '@/lib/db/schema/tasks'
import { revalidatePath } from 'next/cache'
import { createTaskSchema } from './validation'
import type { Task } from './types'

export async function createTask(
  input: unknown
): Promise<{ data?: Task; error?: string }> {
  // 1. Auth guard
  const session = await auth.getSession()
  if (!session?.user) return { error: 'Authentication required' }

  // 2. Validate
  const parsed = createTaskSchema.safeParse(input)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  // 3. Mutate
  const [task] = await db
    .insert(tasks)
    .values({ ...parsed.data, userId: session.user.id })
    .returning()

  // 4. Revalidate
  revalidatePath('/tasks')

  return { data: task }
}
```

---

## Route Handler API (REST)

### Documented by Module (Future)

When a module requires external or cross-service access that's not a browser component calling a server action, we add route handlers under `app/api/`.

| Method | Path | Purpose | Auth Required |
|--------|------|----------|---------------|
| GET | `/api/health` | Health check endpoint | No |

---

### Webhook Endpoints (Future)

```
POST /api/webhooks/github
POST /api/webhooks/stripe
POST /api/webhooks/ai
```

---

## Client-Side Data Fetching

When data must be fetched from the client (browser), TanStack Query is used:

```typescript
// Communication protocol (Component → Route Handler → DB):
'use client'
function TaskList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks')
      if (!res.ok) throw new Error('Failed to fetch tasks')
      return res.json() as Task[]
    },
  })

  if (isLoading) return <LoadingSkeleton count={3} />
  if (error) return <ErrorState message={error.message} />
  return ( ... )
}
```

But for server-side fetched data (direct in page.tsx), you do NOT need TanStack Query — the server component is loading on the server and reads the DB directly.

---

## API Design Principles

1. **No `any` types** — every response is typed explicitly
2. **User isolation enforced in every query** — `userId` never comes from the client; it comes from the session
3. **Zod validation is the gateway** — no data enters the database without passing Zod validation
4. **Error messages are user-readable** — not: "SQL Error" — "Could not create task. Try again."
5. **Never leak stack traces or database errors to the client**
6. **All mutations are idempotent when possible** — retrying should not create duplicates

### HTTP Status Codes (for Route Handlers)

- `200` — Successful GET or mutation
- `201` — Resource created
- `400` — Bad request (validation failed)
- `401` — Not authenticated
- `403` — Authenticated but insufficient permission
- `404` — Resource not found
- `422` — Data invalid
- `500` — Something went wrong on the server

---

*Last updated: 2026-07-29 — Phase 0*