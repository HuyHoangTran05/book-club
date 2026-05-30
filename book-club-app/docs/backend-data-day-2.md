# Backend and Data Day 2 Checklist

This document tracks the Day 2 backend/data scope from the implementation plan.

## Completed Scope

- Sequelize database connection uses `.env` values.
- `GET /api/health` is available.
- Base middleware is in place:
  - CORS
  - JSON body parser
  - URL encoded body parser
  - not found handler
  - error handler
  - JWT auth middleware skeleton
- Core database migration exists for the 5 MVP tables:
  - `members`
  - `book_titles`
  - `book_copies`
  - `book_transactions`
  - `point_histories`
- Core constraints are enforced at database level:
  - `members.point_balance >= 0`
  - member role/status checks
  - book copy condition/status/exchange type checks
  - transaction type/status checks
  - `giver_id <> receiver_id`
  - point history change cannot be zero
  - required foreign keys
- Seed data exists:
  - 3 demo members
  - 5 book titles
  - 5 book copies
  - 3 initial point history rows

## Commands

Run from `book-club-app/backend`.

```powershell
npm.cmd install
npm.cmd run db:migrate
npm.cmd run db:seed
npm.cmd run dev
```

## Demo Accounts

All seeded accounts use password `Password123`.

| Email | Role | Initial points |
| --- | --- | --- |
| `an@example.com` | member | 20 |
| `binh@example.com` | member | 20 |
| `chi@example.com` | member | 20 |

## Verification Result

Latest local verification with Docker PostgreSQL:

| Check | Result |
| --- | --- |
| `npm.cmd run db:migrate` | Pass |
| `npm.cmd run db:seed` | Pass |
| `GET /api/health` | Pass |
| `GET /api/auth/ping` | Pass |
| `GET /api/books/ping` | Pass |
| `GET /api/transactions/ping` | Pass |
| `GET /api/points/ping` | Pass |

Seeded table counts:

| Table | Rows |
| --- | ---: |
| `members` | 3 |
| `book_titles` | 5 |
| `book_copies` | 5 |
| `book_transactions` | 0 |
| `point_histories` | 3 |

`book_transactions` intentionally has no seed rows because transaction core is planned for Day 5.
