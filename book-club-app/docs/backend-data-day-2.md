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
- Member demo API is available:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `GET /api/members/me`
  - `PUT /api/members/me`
  - `GET /api/members/me/points`
- Book demo API is available:
  - `POST /api/books`
  - `GET /api/books`
  - `GET /api/books/my`
  - `GET /api/books/:copyId`
  - `PUT /api/books/:copyId`
  - `DELETE /api/books/:copyId`
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
npm.cmd run migrate
npm.cmd run seed
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
| `npm.cmd run migrate` | Alias for `db:migrate` |
| `npm.cmd run seed` | Alias for `db:seed` |
| `GET /api/health` | Pass |
| `GET /api/auth/ping` | Pass |
| `POST /api/auth/login` with seeded member | Pass |
| `GET /api/auth/me` with token | Pass |
| `GET /api/members/me` with token | Pass |
| `GET /api/members/me/points` with token | Pass |
| `GET /api/books/ping` | Pass |
| `GET /api/books` | Pending re-check after Docker starts |
| `GET /api/books/my` with token | Pending re-check after Docker starts |
| `POST /api/books` with token | Pending re-check after Docker starts |
| `PUT /api/books/:copyId` with owner token | Pending re-check after Docker starts |
| `DELETE /api/books/:copyId` with owner token | Pending re-check after Docker starts |
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

## Schema Notes

- `BookCopy -> BookTitle` uses the canonical Sequelize alias `bookTitle`.
- `book_transactions.updated_at` is available before Day 5.
- `point_histories.updated_at` is available before Day 5.
