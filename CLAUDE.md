# Personal Finance App — Project Context

## What is this project

A personal finance app based on a Frontend Mentor premium challenge.
Pages: Overview, Transactions, Budgets, Pots, Recurring Bills.
Figma: https://www.figma.com/design/LveKlmbMuSlb6HWOnq0DvV/personal-finance-app

## Stack

- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS (Figma tokens mapped in tailwind.config.ts)
- Prisma ORM + PostgreSQL (Neon)
- Auth.js v5 with Credentials provider (email + password)
- TanStack Query for client-side caching (used sparingly)
- Vitest + Testing Library for unit tests
- Playwright for E2E tests
- GitHub Actions for CI

## Folder structure

src/
├── app/
│ ├── (auth)/ # login, signup pages
│ └── (dashboard)/ # authenticated routes
├── components/
│ ├── ui/ # design system (Button, Input, Card, Modal...)
│ └── features/ # feature-specific components
├── lib/
│ ├── db/ # Prisma client singleton
│ ├── auth/ # Auth.js config
│ └── utils/ # helpers (cn, formatCurrency...)
└── server/
├── actions/ # server actions
└── queries/ # server-side read queries

## Conventions

- Commits: Conventional Commits (feat:, fix:, chore:, docs:, test:, refactor:)
- Branches: feat/, fix/, chore/, ci/, docs/, test/
- One PR per task — never commit directly to main
- Always use squash and merge
- Never commit .env files

## Available scripts

```bash
npm run dev          # development server
npm run build        # production build
npm run type-check   # TypeScript check (tsc --noEmit)
npm run lint         # ESLint
npm run format       # Prettier
npm run test         # Vitest unit tests
npm run test:watch   # Vitest watch mode
npm run test:e2e     # Playwright E2E tests
npm run db:seed      # seed database with mock data
```

## Environment variables

DATABASE_URL= # Neon PostgreSQL connection string
AUTH_SECRET= # Auth.js secret (generate with: openssl rand -base64 32)

## Current sprint

Sprint 2 — Transactions

- [ ] FIN-42 — Transaction list with pagination
- [ ] FIN-43 — Search by name with debounce
- [ ] FIN-44 — Filter by category
- [ ] FIN-45 — Sort transactions
- [ ] FIN-46 — Mobile layout
- [ ] FIN-47 — Unit tests
- [ ] FIN-48 — Server action createTransaction
- [ ] FIN-49 — Modal Add new transaction

## Business rules

### Transactions

- Paginate 10 per page
- Search by name (partial match, case insensitive)
- Sort options: Latest (default), Oldest, A to Z, Z to A, Highest, Lowest
- Filter by category: Entertainment, Bills, Groceries, Dining Out,
  Transportation, Personal Care, Education, Lifestyle, Shopping, General
- Negative amount = expense, positive amount = income
- Users only see their own transactions

### Budgets

- Spent = sum of transactions in that category for the current month
- Latest Spending = 3 most recent transactions in the category (any month)
- "See All" navigates to /transactions with that category filter active
- When a budget is created, automatically pulls in the 3 latest transactions
  from that category and calculates amount spent for the current month
- Deleting a budget removes it from Budgets page and Overview

### Pots

- Adding money to a pot DEDUCTS that amount from the Current Balance
- Withdrawing money from a pot ADDS that amount to the Current Balance
- Deleting a pot returns ALL money from that pot to the Current Balance
- Total in a pot cannot exceed its target
- Total in a pot cannot go below zero

### Recurring Bills

- Show only one item per vendor
- Paid = recurring transactions already paid in the current month
- Due Soon = not yet paid, but due within 5 days of the most recent
  transaction in the app (reference: Emma Richardson — 19 Aug 2024)
- Upcoming = everything else not yet paid
- Search by name
- Sort options: Latest (earliest in month), Oldest, A to Z, Z to A,
  Highest, Lowest

### Overview

- Build this page last — it depends on logic from all other pages
- Current Balance = sum of all transactions
- Income = sum of positive transactions for the current month
- Expenses = sum of negative transactions for the current month (absolute value)
- Pots section: show total saved + first 4 pots
- Transactions section: show 5 most recent
- Budgets section: reuse donut chart + show up to 4 categories
- Recurring Bills section: show totals by status (paid, upcoming, due soon)

## Design tokens (Tailwind)

Colors are mapped in tailwind.config.ts. Use semantic aliases in UI:

- bg-background-primary / bg-background-secondary
- text-primary / text-secondary / text-tertiary
- border (default border color)

Category/theme colors (used in budgets and pots):
green, yellow, cyan, navy, red, purple, turquoise, brown,
magenta, blue, navy-grey, army-green, gold, orange

Typography: use text-preset-1 through text-preset-5 classes.
Font: Public Sans (loaded via next/font/google).

## Key decisions

- Prisma chosen over Drizzle for familiarity and DX
- TanStack Query used sparingly — only where server actions + revalidatePath
  are not enough (e.g. optimistic updates in pot/budget modals)
- Auth.js v5 beta — stable enough for this project
- No automatic seed on signup — users create transactions manually via UI
- Filters and sorting are handled via URL search params (not local state)
- See docs/DECISIONS.md for full Architecture Decision Records
