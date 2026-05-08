# AI Workflow

This document describes how AI was used intentionally and critically
throughout this project. It serves as a reference during development
and as portfolio material for interviews.

---

## The 4 modes

### 1. Architect mode — before starting any feature

**When:** before writing any code for a new feature.
**Where:** Claude chat (not Claude Code).
**Why:** architecture decisions define everything else. 20 minutes of
discussion before coding saves hours of refactoring.

**Prompt template:**

```
I'm building a personal finance app with this stack:
Next.js 15 (App Router), TypeScript, Tailwind, Prisma, PostgreSQL,
Auth.js v5, TanStack Query.

I'm about to implement [FEATURE]. Expected behavior:
- [behavior 1]
- [behavior 2]

Help me think through:
1. Data model (Prisma schema)
2. Route structure and server vs client components
3. Caching and revalidation strategy
4. Edge cases and validations
5. How I'll test it

Don't write code yet — I want to discuss the design first.
```

**What to do with the output:** copy the relevant parts to
`docs/DECISIONS.md` as a new ADR.

---

### 2. Pair programmer mode — during implementation

**When:** while coding.
**Where:** Claude Code in VS Code (Cmd+K for inline edits, Cmd+L for chat).

**Good for:**

- Converting Figma designs to JSX
- Generating boilerplate (forms, CVA variants, Zod schemas)
- Writing tests from an existing function
- Refactoring (rename, extract component, move to hook)
- TypeScript types from examples

**Golden rule:**

> If you can't explain a line of generated code, you can't accept it.
> If you got stuck, open Tutor mode.

---

### 3. Code reviewer mode — before merging

**When:** PR is open, CI is green, before merge. Always.
**Where:** Claude chat. Paste the full diff.

**Prompt template:**

```
Here is the diff for my PR [title].

Do a critical code review focused on:
1. Bugs and unhandled edge cases
2. Performance (unnecessary re-renders, N+1 queries, bundle size)
3. Accessibility (semantics, ARIA, keyboard navigation)
4. Security (input validation, authorization, XSS)
5. TypeScript quality (hidden any, unsafe casts)

Be direct. I want to know what's wrong, not what's good.
Rate each issue: blocker / major / minor / nit.
```

**What to do with the output:**

- Blocker and major → fix before merge
- Minor → fix or create a tech debt issue
- Nit → your call

---

### 4. Tutor mode — when stuck on a concept

**When:** something doesn't make sense.
**Where:** Claude chat.

**Prompt template:**

```
Explain [CONCEPT] as if I were a senior developer who has been
away from code for 6 months.

Use concrete examples from my project (finance app with Next.js + Prisma).
After explaining, ask me 3 questions to test my understanding.
```

**Tip:** after finishing each feature, spend 15 minutes reviewing
the concepts that came up. This becomes ready-made interview material.

---

## Quick reference

| Mode            | Where                 | When                           |
| --------------- | --------------------- | ------------------------------ |
| Architect       | Claude chat           | Before coding — discuss design |
| Pair programmer | Claude Code (VS Code) | During implementation          |
| Code reviewer   | Claude chat           | Before merge — review PR diff  |
| Tutor           | Claude chat           | When stuck on a concept        |

Simple rule: **Claude chat for thinking, Claude Code for doing.**

---

## Anti-patterns — don't do this

**Accepting code without reading it.**
If you can't explain a line in an interview, you can't have it in your codebase.

**Asking for entire features at once.**
The larger the scope, the more AI hallucinates and the harder it is to review.
Break it into small pieces.

**Blindly trusting suggested imports and APIs.**
AI invents libraries that don't exist or uses deprecated APIs.
Always verify against official docs.

**Letting AI write your commit messages and PRs without review.**
Recruiters look at your git history. Generic messages ("update files")
or over-the-top AI-flavored ones ("✨ Implemented robust authentication")
are both red flags for different reasons. Write them yourself.

---

## Documenting AI usage — for the portfolio

This section will be completed at the end of the project (Sprint 5).
It will include:

- Which tools were used and at what points
- Concrete examples where AI accelerated development (with PR links)
- Cases where AI hallucinated or got things wrong (shows critical thinking)
- What I learned about when to use and when not to use AI

This document is a differentiator in interviews. Companies in 2026 want
to know how you use AI and showing critical judgment stands out from
those who just praise the tool.

---

## Final reminder

AI is leverage. Without a foundation, leverage lifts nothing.
Keep studying fundamentals: deep JavaScript, React internals,
design patterns, accessibility. AI amplifies those who understand
and exposes those who don't.

You have 10+ years of foundation. Use AI to warm up faster,
not to replace what you already know.
