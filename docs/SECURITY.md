# SECURITY.md — Security Model & Practices

> The security architecture, threat model, and secure development practices for LifeOS.

---

## Security Philosophy

- **Defense in depth:** multiple security layers, not just one
- **Zero trust in client input:** validate everything on the server
- **User isolation by design:** every query filters by `userId`
- **Fail secure:** if auth fails, deny access

---

## Security Architecture

```
Transport Layer   ── HTTPS (Vercel edge) encrypts all traffic

Auth Layer        ── Better Auth: HTTP-only cookies, session management,
                     CSRF protection built-in

Data Layer        ── Zod validation on every input (server-side),
                     Drizzle parameterized queries (no SQL injection)

Access Layer      ── Every query: WHERE user_id = <session.user.id>

Infrastructure    ── Vercel isolation, Neon connection pooling, 
                     no database credentials in client code
```

---

## Threat Model

| Threat | Mitigation | Status |
|--------|----------|--------|
| **SQL Injection** | Drizzle ORM — all queries parameterized | 🔜 Built in |
| **XSS (Cross-Site Scripting)** | React JSX auto-escapes HTML; Content-Security-Policy header | 🔜 React + CSP |
| **CSRF (Cross-Site Request Forgery)** | Server Actions auto-handle CSRF tokens | 🔜 Built in |
| **Authentication Bypass** | Server-side auth check in every action; middleware redirecting unauthenticated requests | 🔜 Implementation |
| **Unauthorized Data Access** | `userId` filter on every query; Row-Level Security implicit | 🔜 Implementation |
| **Password Attacks (brute-force)** | Rate limiting on login; bcrypt hashing (slow, salted) | 🔜 Implementation |
| **Information Leakage** | Error messages never expose stack traces or SQL errors | 🔜 Implementation |
| **Denial of Service** | Vercel edge protection, rate limiting | 🔜 Built in |
| **Data Breach** | Encrypted at rest (PostgreSQL); encrypted in transit (TLS) | 🔜 Built in |
| **Dependency Vulnerability** | `pnpm audit` / Dependabot scanning | 🔮 Future |
| **Supply Chain Attack** | Lock files; limited dependencies; audit review | 🔜 Ongoing |

---

## Security Rules

### Authentication
- Passwords hashed with bcrypt (12 salt rounds minimum)
- Sessions stored server-side (not in browser localStorage)
- Tokens restricted to HTTP-only cookies
- Login rate-limited (future: track failed attempts → temporary lockout)
- OAuth uses state verification (when added)

### Data Access
- Every route handler and server action: authenticate first, then query with userId
- Read: `WHERE user_id = <current_user_id>`
- Write: `INSERT ... VALUES (user_id = <current_user_id>, ...)`
- Delete: `WHERE user_id = <current_user_id> AND id = <resource_id>`
- Never use user-supplied `userId` from a request body

### Input Validation
- Zod validates from `handler/action` before any database operation
- Validation logic shared between client and server (same Zod schema)
- No raw user input enters SQL

### Secrets
- Never commit `.env` to git
- Use `.env.example` template — no real values, just placeholder
- Vercel environment variables for production

### Logging (Future)
- Never log passwords, tokens, or session IDs
- Mask emails when logging (`user: e***@email.com`)
- Access logs include `userId` but never session token

---

## Dependency Security

```bash
pn exec audit       # Run audit
pnpm outdated        # Check for updates
```

Routine: every module update runs `pnpm audit`

---

## Reporting a Vulnerability

If you discover a security issue, DO NOT open a public issue.

**Contact:** [rupesh — contact info placeholder]

---

## Security Checklist (Every Module)

When a new module is implemented:

- [ ] All actions authenticated (session check first)
- [ ] All queries filter by `userId`
- [ ] Zod validates all input before DB insert
- [ ] No `userId` accepted from client request
- [ ] No sensitive information in error responses
- [ ] No `.env` in source control
- [ ] Confirmed no SQL injection possible (Drizzle handles)

---

## CSP (Content Security Policy) — Future

Once deployed, add CSP header:

```
default-src 'self';
script-src 'self'
img-src 'self' data: placeholder.co
style-src 'self' 'unsafe-inline' (Tailwind requires this)
connect-src 'self' /api/
```

---

*Last updated: 2026-07-29 — Phase 0*