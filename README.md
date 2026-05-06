# Personal Finance App

A full-stack personal finance application built as part of the [Frontend Mentor](https://www.frontendmentor.io/) challenge.

**Live demo:** https://personal-finance-app-five-lyart.vercel.app/

## Features

- **Overview** — dashboard with balance summary and spending snapshot
- **Transactions** — transaction history with search, filter and pagination
- **Budgets** — set monthly budgets per category and track spending
- **Pots** — savings pots with deposit and withdrawal
- **Recurring Bills** — track and visualize recurring expenses
- **Auth** — sign up, sign in and protected routes

## Tech Stack

| Layer         | Technology               |
| ------------- | ------------------------ |
| Framework     | Next.js 16 (App Router)  |
| Language      | TypeScript (strict)      |
| Styling       | Tailwind CSS v4          |
| Database      | PostgreSQL (Neon)        |
| ORM           | Prisma                   |
| Auth          | Auth.js v5               |
| Data fetching | TanStack Query           |
| Unit tests    | Vitest + Testing Library |
| E2E tests     | Playwright               |
| CI            | GitHub Actions           |

## Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
# Fill in the required values in .env.local

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
npm run format       # Format all files with Prettier
npm run format:check # Check formatting without writing
npm test             # Run unit tests with Vitest
```

## Project Structure

```
src/
└── app/          # Next.js App Router pages and layouts
```
