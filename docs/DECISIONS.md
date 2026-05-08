# Architecture Decision Records (ADRs)

This document records significant technical decisions made throughout the project.
Each ADR includes context, options considered, the decision made, and trade-offs accepted.

> For interviews: read this file before every technical call.
> Each ADR is a potential answer to "why did you use X?".

---

## ADR-001 — Next.js 15 with App Router

**Date:** Sprint 0

**Context:**
Needed a full-stack framework with SSR, routing, and modern React features
that would demonstrate current market knowledge in interviews.

**Options considered:**

1. **Next.js 15 (App Router)** — RSC, server actions, streaming natively
2. **Next.js 14 (Pages Router)** — more mature, more learning resources available
3. **Remix** — excellent loader/action model, smaller community
4. **Vite + React Router** — lighter, but requires manual SSR/SEO setup

**Decision:** Next.js 15 with App Router.

**Consequences:**

- ✅ Shows current market knowledge (RSC, server actions, streaming)
- ✅ Trivial Vercel deployment
- ✅ Native TypeScript and Tailwind integration
- ⚠️ Steeper learning curve (server vs client components boundary)
- ⚠️ Some libraries not yet fully RSC compatible

---

## ADR-002 — TypeScript strict mode

**Date:** Sprint 0

**Context:**
Returning after 6 months away from code. Wanted the compiler to catch
mistakes automatically. Strict mode is also standard in serious companies.

**Decision:** `strict: true` + `noUncheckedIndexedAccess: true` + `noImplicitOverride: true`.

**Consequences:**

- ✅ More safety during refactors
- ✅ Implicit documentation via types
- ⚠️ More verbose, especially with arrays (must handle T | undefined)

---

## ADR-003 — Prisma as ORM

**Date:** Sprint 1

**Context:**
Needed a type-safe data access layer. Had prior experience with Prisma —
decisive factor given the tight timeline.

**Options considered:**

1. **Prisma** — great ergonomics, full type-safety, declarative schema
2. **Drizzle** — lighter, closer to SQL, better for edge runtime
3. **Kysely** — type-safe query builder, no ORM magic

**Decision:** Prisma.

**Consequences:**

- ✅ Familiarity reduces implementation time
- ✅ Prisma Studio helps with debugging and seeding
- ✅ Versioned migrations
- ⚠️ Larger bundle size than Drizzle/Kysely
- ⚠️ Serverless cold start can be slower (mitigated with Neon connection pooling)

---

## ADR-004 — Auth.js v5 for authentication

**Date:** Sprint 1

**Context:**
Needed email/password auth without implementing from scratch (security
is easy to get wrong). Considered Clerk and Auth0 but wanted a free,
open-source solution that shows knowledge of the ecosystem.

**Options considered:**

1. **Auth.js v5** — free, open-source, integrates with Prisma and App Router
2. **Clerk** — better DX, prebuilt UI, but paid above free tier limits
3. **Auth0** — enterprise-grade, overkill for a personal project

**Decision:** Auth.js v5 with Prisma adapter and Credentials provider.

**Consequences:**

- ✅ Free, full control over the auth flow
- ✅ Well integrated with App Router and middleware
- ⚠️ More setup code than Clerk
- ⚠️ v5 still in beta (stable enough for a personal project)

---

## ADR-005 — TanStack Query for client-side caching

**Date:** Sprint 1

**Context:**
Most data is handled by server components, but modals and optimistic
actions (adding money to a pot, for example) benefit from client-side cache.

**Options considered:**

1. **Server actions + revalidatePath only** — simple, but no client cache
2. **TanStack Query** — robust cache, optimistic updates, devtools
3. **SWR** — lighter, fewer features

**Decision:** TanStack Query, used sparingly — only where server actions
alone are not enough.

**Consequences:**

- ✅ Optimistic updates become trivial (better UX in modals)
- ✅ Devtools help with debugging
- ⚠️ Adds ~12kb to bundle
- ⚠️ Risk of duplicating source of truth — mitigated by convention:
  queries only for data that truly needs client-side cache

---

## ADR-006 — URL search params for filters and sorting

**Date:** Sprint 2

**Context:**
Transactions page has search, filter by category, and sort. Needed to
decide where to store this UI state.

**Options considered:**

1. **Local state (useState)** — simple but not shareable, lost on refresh
2. **URL search params** — shareable, bookmarkable, works with server components

**Decision:** URL search params for all filters, sorting, and pagination.

**Consequences:**

- ✅ Filters are shareable and bookmarkable via URL
- ✅ Works natively with Next.js server components (no client fetch needed)
- ✅ Browser back/forward navigation works correctly
- ✅ "See All" links from Budget cards to filtered Transactions page work trivially
- ⚠️ Slightly more complex to implement than useState

---

## ADR-007 — No automatic seed on signup

**Date:** Sprint 2

**Context:**
Originally planned to auto-seed mock transactions when a new user signs up.
Decided against it to build a more realistic app experience.

**Decision:** Remove auto-seed on signup. Users create transactions manually
via the Add Transaction modal (FIN-49).

**Consequences:**

- ✅ More realistic product experience
- ✅ Add Transaction feature adds portfolio value (not in original Figma)
- ⚠️ New users see empty states on first login
- ⚠️ Required building UI not present in the original design

---

## Template for new ADRs

## ADR-00X — Short title

**Date:** Sprint X

**Context:**
(what problem needed solving)

**Options considered:**

1. **Option A** — description
2. **Option B** — description

**Decision:** Chosen option.

**Consequences:**

- ✅ Benefit
- ⚠️ Trade-off
