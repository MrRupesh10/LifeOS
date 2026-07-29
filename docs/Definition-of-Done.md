# Definition of Done — Feature Completion Checklist

> Every feature, every component, every module must satisfy every applicable check here before it is "complete".
> This is a living quality gate — it gets stricter over time as the project matures.

---

## 1. Functionality

- [ ] Acceptance criteria met: Every user story or feature goal works correctly
- [ ] Happy path tested: Normal usage completes without error
- [ ] Minimum of 2 unhappy paths tested: bad input, missing data, etc.
- [ ] Edge cases documented: empty, zero, maximum/minimum values handled
- [ ] No broken links: all internal navigation resolves correctly
- [ ] Feature visible only to authenticated users (if applicable)
- [ ] Feature only shows user's own data (never leaks cross-user data)
- [ ] Feature works with JavaScript disabled (progressive enhancement where possible)

---

## 2. UI & Visual Quality

- [ ] Matches design specification in [`Design-System.md`](./Design-System.md)
- [ ] Consistent spacing with existing components in the module
- [ ] No visual regressions across themes (light + dark mode verified)
- [ ] No jank or layout shift during state transitions
- [ ] Animations are subtle (<200ms, `prefers-reduced-motion` respected)
- [ ] Typography matches the type scale
- [ ] All icons are from Lucide (no imported custom icons unless explicitly approved)

---

## 3. Responsive Design

- [ ] Mobile (<768px): feature works correctly, inputs legible and scrollable, no overflow
- [ ] Tablet (768–1024px): sidebar and content layout adapt correctly
- [ ] Desktop (1024px+): content constrained to readable max-width, no empty or orphaned sidebars
- [ ] Touch targets: minimum 44x44px on touchscreens
- [ ] No horizontal overflow on any viewport

---

## 4. Accessibility

From [`docs/Engineering-Handbook.md`](./Engineering-Handbook.md#accessibility):
- [ ] Keyboard navigation: feature completable via Tab, Enter, Escape
- [ ] Focus management: focus returns to trigger after modal/dialog close
- [ ] All images and icons have descriptive alt attributes
- [ ] Color contrast meets >= 4.5:1 for body text (WCAG AA)
- [ ] Labels on all form inputs (visible or aria-label)
- [ ] Semantic HTML heading hierarchy (h1→h5)
- [ ] Tab order logical, no dead-end tabs
- [ ] `aria-live` for dynamic content (announced to screen reader)

---

## 5. Error Handling

From [`docs/API.md`](./API.md) and [`docs/Engineering-Handbook.md`](./Engineering-Handbook.md#error-handling):
- [ ] Every server action returns `{ data: <T> } | { error: <human-readable-message> }`
- [ ] Invalid form input shows field-level error message
- [ ] Network failures display user-friendly error component
- [ ] Unexpected errors (5xx) caught in error boundary — never crash the whole page
- [ ] Error state for each component renders an error component (never blank)
- [ ] No raw stack traces or SQL errors exposed to user

---

## 6. Loading States

- [ ] Skeleton loader displayed while initial data loads (match layout)
- [ ] Interactive elements disabled during mutation (prevent double submit)
- [ ] No "flash" between loading and content (skeleton matches size)
- [ ] Loading text is not blinking raw data

---

## 7. Empty States

- [ ] No content scenario shows informative message + action CTA (e.g., "No tasks yet")
- [ ] Empty state is visually clear — not a blank white rectangle
- [ ] CTA in empty state, if applicable, leads to creation flow

---

## 8. Type Safety

- [ ] Zero `any` types — all types explicitly defined
- [ ] No `as` type casts — use type guards or Zod parsing
- [ ] All server action parameters are explicitly typed
- [ ] All server action return types are `ActionResult<T>`
- [ ] Component props are destructured with typed interface, not `React.FC`

---

## 9. Performance

- [ ] Client component does not block initial load (use `Suspense` if async)
- [ ] Large list with pagination (not a single render of 500 items)
- [ ] Bundle size: intent to avoid pulling heavy libraries
- [ ] Images are lazy-loaded, use `next/image` where applicable
- [ ] `console.log` removed from production code (kept only for op tracking/debug)

---

## 10. Documentation

- [ ] Relevant file created/updated in documentation:
  - Architecture changed → `docs/Architecture.md` updated
  - New decision → `.claude/DECISIONS.md` recorded
  - New feature → `docs/FEATURES.md` status updated
  - New API → `docs/API.md`
  - Feature complete → `docs/PROJECT_STATUS.md` updated
- [ ] Inline comments explain non-obvious logic
- [ ] No TODO comments without an associated issue tracking number

---

## 11. Testing

From [`docs/Engineering-Handbook.md`](./Engineering-Handbook.md#testing-strategy):
- [ ] Manual testing performed in browser
- [ ] Minimum 2 edge cases demonstrated or tests written
- [ ] Zod validation schema has unit test (valid and invalid payloads)
- [ ] Any critical server action has a basic integration/unit test

---

## 12. Build & Lint

- [ ] `pnpm typecheck` passes (zero TypeScript errors)
- [ ] `pnpm lint` passes (zero ESLint warnings, zero errors)
- [ ] `pnpm build` succeeds in production mode
- [ ] Bundle has no unused imports (tree-shakeable)

---

## 13. Git Requirements

From [`docs/CONTRIBUTING.md`](./CONTRIBUTING.md):
- [ ] Code is on a non-`main` branch (feature/<name>)
- [ ] Commit message follows Conventional Commits format
- [ ] Branch branched from latest `main` (not another feature branch)
- [ ] No merge conflicts with `main`
- [ ] Code review completed (by Claude)

---

## 14. Security (When Applying to This Feature)

From [`docs/SECURITY.md`](./SECURITY.md):
- [ ] Every query includes `userId` filter
- [ ] No sensitive field returned
- [ ] Input validated server-side with Zod before any database operation
- [ ] No `userId` accepted from client request body (only from session)

---

## Interpretation

- If any box under any section is unchecked and that section applies, the feature is **NOT done**.
- **Exception:** Sections that are genuinely not applicable (e.g., dark mode for an email-only feature) may be explicitly waived with a reason noted in the PR.

---

*Last updated: 2026-07-29 — LifeOS Phase 0*