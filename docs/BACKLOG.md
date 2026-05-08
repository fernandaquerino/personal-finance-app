# Personal Finance App — Full Backlog

Project based on the [Frontend Mentor Personal Finance App](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1) challenge.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind · Prisma · PostgreSQL (Neon) · Auth.js v5 · TanStack Query · Vitest · Playwright

**Total:** 6 sprints · 1 week each · ~10-12h per sprint

---

## Conventions

**Branch prefix:** `feat/`, `fix/`, `chore/`, `ci/`, `docs/`, `test/`
**Labels:** `infra` · `design-system` · `frontend` · `backend` · `testing` · `docs` · `a11y` · `tech-debt`
**Estimates:** 30min · 1h · 2h · 4h (if >4h, break into subtasks)

---

## EPIC-01 — Foundations & Infra

| ID     | Task                                 | Estimate | Sprint |
| ------ | ------------------------------------ | -------- | ------ |
| FIN-01 | Create repo + branch protection      | 30min    | 0      |
| FIN-02 | Setup Next.js 15 + TS strict         | 1h       | 0      |
| FIN-03 | ESLint, Prettier, Husky, Commitlint  | 2h       | 0      |
| FIN-05 | CI/CD GitHub Actions                 | 2h       | 0      |
| FIN-06 | Initial Vercel deploy                | 1h       | 0      |
| FIN-10 | README + DECISIONS.md + docs         | 1h       | 0      |
| FIN-11 | Prisma setup + initial schema + Neon | 2h       | 1      |
| FIN-12 | Vitest + Testing Library setup       | 1h       | 0      |
| FIN-13 | Playwright setup                     | 1h       | 5      |
| FIN-14 | TanStack Query + provider            | 1h       | 1      |

---

## EPIC-02 — Design System

| ID     | Task                                 | Estimate | Sprint |
| ------ | ------------------------------------ | -------- | ------ |
| FIN-04 | Tailwind + Figma design tokens       | 2h       | 0      |
| FIN-07 | Button component (CVA variants)      | 1h       | 0      |
| FIN-08 | Input + Select components            | 2h       | 0      |
| FIN-09 | Card + base typography               | 1h       | 0      |
| FIN-15 | Modal/Dialog component (Radix)       | 2h       | 1      |
| FIN-16 | Dropdown menu component (Radix)      | 1h       | 1      |
| FIN-17 | Pagination component                 | 1h       | 2      |
| FIN-18 | /styleguide page with all components | 1h       | 0      |

---

## EPIC-03 — Authentication

| ID     | Task                                    | Estimate | Sprint  |
| ------ | --------------------------------------- | -------- | ------- |
| FIN-20 | Auth.js v5 setup with Prisma adapter    | 2h       | 1       |
| FIN-21 | Login page (UI)                         | 2h       | 1       |
| FIN-22 | Signup page (UI)                        | 2h       | 1       |
| FIN-23 | Auth server actions with Zod validation | 2h       | 1       |
| FIN-24 | Route protection middleware             | 1h       | 1       |
| FIN-25 | Logout + session display                | 30min    | 1       |
| FIN-26 | ~~Auto seed transactions on signup~~    | -        | removed |

---

## EPIC-04 — Layout & Navigation

| ID     | Task                            | Estimate | Sprint |
| ------ | ------------------------------- | -------- | ------ |
| FIN-30 | Desktop sidebar with navigation | 2h       | 1      |
| FIN-31 | Mobile bottom navigation        | 1h       | 1      |
| FIN-32 | Responsive dashboard layout     | 1h       | 1      |

---

## EPIC-06 — Transactions

> Built before Overview because Overview consumes transaction data.

| ID     | Task                                             | Estimate | Sprint |
| ------ | ------------------------------------------------ | -------- | ------ |
| FIN-40 | Prisma schema for Transaction + Category         | 1h       | 2      |
| FIN-41 | Seed with mock transactions (data.json)          | 1h       | 2      |
| FIN-42 | Transaction list (server component + pagination) | 3h       | 2      |
| FIN-43 | Search by name with debounce                     | 2h       | 2      |
| FIN-44 | Filter by category                               | 1h       | 2      |
| FIN-45 | Sort transactions                                | 1h       | 2      |
| FIN-46 | Mobile layout for transactions                   | 1h       | 2      |
| FIN-47 | Transaction page unit tests                      | 1h       | 2      |
| FIN-48 | Server action createTransaction                  | 1h       | 2      |
| FIN-49 | Modal Add new transaction                        | 2h       | 2      |

---

## EPIC-07 — Budgets

| ID     | Task                                      | Estimate | Sprint |
| ------ | ----------------------------------------- | -------- | ------ |
| FIN-50 | Prisma schema for Budget                  | 30min    | 3      |
| FIN-51 | Budget list with progress cards           | 2h       | 3      |
| FIN-52 | Donut chart (Recharts)                    | 2h       | 3      |
| FIN-53 | Modal Add new budget                      | 2h       | 3      |
| FIN-54 | Modal Edit budget                         | 1h       | 3      |
| FIN-55 | Modal Delete budget                       | 1h       | 3      |
| FIN-56 | Latest 3 transactions per budget category | 1h       | 3      |
| FIN-57 | Budget unit tests                         | 1h       | 3      |

---

## EPIC-08 — Pots

| ID     | Task                        | Estimate | Sprint |
| ------ | --------------------------- | -------- | ------ |
| FIN-60 | Prisma schema for Pot       | 30min    | 3      |
| FIN-61 | Pot list with progress bars | 2h       | 3      |
| FIN-62 | Modal Add new pot           | 1h       | 3      |
| FIN-63 | Modal Edit + Delete pot     | 1h       | 3      |
| FIN-64 | Modal Add money to pot      | 2h       | 3      |
| FIN-65 | Modal Withdraw from pot     | 1h       | 3      |
| FIN-66 | Pot unit tests              | 1h       | 3      |

---

## EPIC-05 — Overview Dashboard

| ID     | Task                                       | Estimate | Sprint |
| ------ | ------------------------------------------ | -------- | ------ |
| FIN-70 | Balance cards (Current, Income, Expenses)  | 1h       | 4      |
| FIN-71 | Pots section (total saved + first 4)       | 1h       | 4      |
| FIN-72 | Transactions section (last 5)              | 1h       | 4      |
| FIN-73 | Budgets section (donut + categories)       | 1h       | 4      |
| FIN-74 | Recurring Bills section (totals by status) | 1h       | 4      |
| FIN-75 | Loading states + Suspense boundaries       | 2h       | 4      |
| FIN-76 | Empty states on all pages                  | 1h       | 4      |

---

## EPIC-09 — Recurring Bills

| ID     | Task                                          | Estimate | Sprint |
| ------ | --------------------------------------------- | -------- | ------ |
| FIN-80 | Recurring transactions business logic         | 2h       | 4      |
| FIN-81 | Recurring Bills page                          | 2h       | 4      |
| FIN-82 | Bill status badges (paid, upcoming, due soon) | 1h       | 4      |
| FIN-83 | Search + sort in Recurring Bills              | 1h       | 4      |

---

## EPIC-10 — Quality, Accessibility & Showcase

| ID     | Task                                         | Estimate | Sprint |
| ------ | -------------------------------------------- | -------- | ------ |
| FIN-90 | Accessibility audit (axe-core)               | 2h       | 5      |
| FIN-91 | Full keyboard navigation                     | 1h       | 5      |
| FIN-92 | E2E tests with Playwright (3 critical flows) | 3h       | 5      |
| FIN-93 | Performance audit (Lighthouse)               | 2h       | 5      |
| FIN-94 | README as case study                         | 2h       | 5      |
| FIN-95 | DECISIONS.md final                           | 1h       | 5      |
| FIN-96 | Demo video (Loom, 2-3 min)                   | 1h       | 5      |

---

## Sprint summary

| Sprint   | Focus                       | Epics            | Issues           |
| -------- | --------------------------- | ---------------- | ---------------- |
| Sprint 0 | Foundations & Design System | EPIC-01, EPIC-02 | FIN-01 to FIN-18 |
| Sprint 1 | Auth & Layout               | EPIC-03, EPIC-04 | FIN-20 to FIN-32 |
| Sprint 2 | Transactions                | EPIC-06          | FIN-40 to FIN-49 |
| Sprint 3 | Budgets & Pots              | EPIC-07, EPIC-08 | FIN-50 to FIN-66 |
| Sprint 4 | Overview & Recurring Bills  | EPIC-05, EPIC-09 | FIN-70 to FIN-83 |
| Sprint 5 | Quality & Showcase          | EPIC-10          | FIN-90 to FIN-96 |

---

## Definition of Done — full project

- App deployed and stable on Vercel
- CI green on all merged PRs
- Test coverage >= 60% on business logic (budget, pot calculations)
- 3 critical E2E flows passing: signup → create budget · add transaction · add/withdraw from pot
- Lighthouse: Performance >= 90, Accessibility = 100, Best Practices >= 95
- README with "AI workflow" section describing how AI was used
- Minimum 40 merged PRs (history shows process)
