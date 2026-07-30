# Tooling — Configuration Decisions

> Documents the tooling stack and why specific versions were chosen.
> Created: 2026-07-30 — Phase 1

---

## Tailwind CSS v4

### Decision

Use Tailwind CSS v4 with CSS-based configuration (`@tailwindcss/postcss`) instead of Tailwind v3's `tailwind.config.ts`.

### Why

1. **CSS-first configuration** — themes, colors, and utilities are defined in `globals.css` via `@theme inline`, removing the need for `tailwind.config.ts`
2. **Native cascade layers** — Tailwind v4 uses native `@layer` CSS, avoiding build-time layer ordering hacks
3. **Faster builds** — Uses Lightning CSS under the hood instead of the legacy PostCSS pipeline
4. **Container queries are native** — no plugin required
5. **Automatic content detection** — no need to manually specify `content` paths via glob

### Implementation

- **PostCSS:** `@tailwindcss/postcss` plugin (replaces `tailwindcss` + `autoprefixer`)
- **Config location:** `src/app/globals.css` — `@import "tailwindcss"` + `@theme inline { ... }`
- **Color tokens:** defined as CSS custom properties in `:root` and `.dark`, mapped to Tailwind utilities via `@theme inline`

### Removed

- `tailwind.config.ts` — no longer needed
- `autoprefixer` — included in `@tailwindcss/postcss`

---

## ESLint 9 Flat Config

### Decision

Use ESLint 9 with the new flat configuration format (`eslint.config.mjs`).

### Why

1. **Future-proof** — ESLint 8 is deprecated and no longer receiving updates
2. **Direct plugin integration** — `@next/eslint-plugin-next` v15 ships with ES Module exports (`flatConfig.recommended`, `flatConfig.coreWebVitals`) designed for ESLint 9 flat config
3. **No middleware patching** — ESLint 9 flat config removes the need for `@rushstack/eslint-patch` that caused failures with ESLint 9 + `eslint-config-next` (that middleware patching legacy behavior was incompatible with ESLint 9's ESM architecture)

### Implementation

`eslint.config.mjs` uses:
- `@eslint/js` — core ESLint recommended rules
- `@next/eslint-plugin-next` — `flatConfig.recommended` + `flatConfig.coreWebVitals`
- `globalIgnores` — `.next`, `out`, `build`, `next-env.d.ts`

### Compatibility Note

`eslint-config-next@15` (the package) uses `@rushstack/eslint-patch` which is incompatible with ESLint 9's ESM module loading. The workaround is to use `@next/eslint-plugin-next` directly with its flat config exports — this is the documented path for Next.js 15 + ESLint 9.

---

## TypeScript Configuration

- **Strict mode** enabled — `"strict": true`, `"noUncheckedIndexedAccess": true`, `"noImplicitReturns": true`
- **Module resolution:** `bundler` (required by Next.js 15)
- **Path alias:** `@/*` → `./src/*`
- **jsx:** `"preserve"` (Next.js handles JSX transformation)

---

## Package Manager

**pnpm v11** — chosen in ADR-007 for fast installs, no phantom dependencies, and best workspace support.

### pnpm-workspace.yaml

Contains `allowedBuildDependencies` for `sharp` + `unrs-resolver` (needed by Next.js image optimization and Tailwind).

---

*Last updated: 2026-07-30 — Phase 1*