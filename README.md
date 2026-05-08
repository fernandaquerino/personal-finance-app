# Personal Finance App

A full-stack personal finance application for tracking budgets, saving pots,
transactions, and recurring bills.

> **Status:** 🚧 In progress (Sprint 2 / 6)

> **Live demo:** https://personal-finance-app-five-lyart.vercel.app/

> Based on the [Frontend Mentor Personal Finance App](https://www.frontendmentor.io/challenges/personal-finance-app-JfjtZgyMt1) challenge.
> Architecture, backend, and authentication are original implementations.

---

## Stack

| Category     | Technology               | Why                                   |
| ------------ | ------------------------ | ------------------------------------- |
| Framework    | Next.js 15 (App Router)  | RSC, server actions, streaming        |
| Language     | TypeScript (strict)      | End-to-end type safety                |
| Styling      | Tailwind CSS             | Speed + consistency via design tokens |
| ORM          | Prisma                   | Type-safe, familiar, great DX         |
| Database     | PostgreSQL (Neon)        | Serverless, generous free tier        |
| Auth         | Auth.js v5               | Free, integrates with Prisma          |
| Client state | TanStack Query           | Optimistic updates                    |
| Unit tests   | Vitest + Testing Library | Fast, SWC compatible                  |
| E2E tests    | Playwright               | Multi-browser, great debugger         |
| CI           | GitHub Actions           | Industry standard, free               |
| Deploy       | Vercel                   | Zero config for Next.js               |

Every decision is documented in [`docs/DECISIONS.md`](./docs/DECISIONS.md).

---

---

## Features

- ✅ Authentication (signup, login, logout)
- ✅ Overview dashboard with balance, income and expenses summary
- ✅ Transactions list with search, filter, sort and pagination
- ✅ Add new transactions
- ✅ Budgets with CRUD, donut chart and spending progress
- ✅ Saving pots with CRUD, add and withdraw money
- ✅ Recurring bills with status (paid, upcoming, due soon)
- ✅ Fully keyboard navigable
- ✅ Responsive (mobile, tablet, desktop)
- ✅ Accessibility audit (Lighthouse score 100)

---

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/fernandaquerino/personal-finance-app.git
cd personal-finance-app

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and AUTH_SECRET

# 4. Run migrations and seed
npx prisma migrate dev
npm run db:seed

# 5. Start development server
npm run dev
```

App available at http://localhost:3000.

### Scripts

| Script               | Description                  |
| -------------------- | ---------------------------- |
| `npm run dev`        | Development server           |
| `npm run build`      | Production build             |
| `npm run start`      | Run production build         |
| `npm run lint`       | ESLint                       |
| `npm run type-check` | TypeScript check             |
| `npm run test`       | Unit tests (Vitest)          |
| `npm run test:e2e`   | E2E tests (Playwright)       |
| `npm run format`     | Format with Prettier         |
| `npm run db:seed`    | Seed database with mock data |

---

## Architecture

```
src/
├── app/
│   ├── (auth)/           # login, signup
│   └── (dashboard)/      # authenticated routes
│       ├── page.tsx      # overview
│       ├── transactions/
│       ├── budgets/
│       ├── pots/
│       └── recurring-bills/
├── components/
│   ├── ui/               # design system
│   └── features/         # feature components
├── lib/
│   ├── db/               # Prisma client
│   ├── auth/             # Auth.js config
│   └── utils/            # helpers
└── server/
├── actions/          # server actions
└── queries/          # read queries
```
