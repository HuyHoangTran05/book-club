# book-club-app

Demo project for an app that connects members of a book reading club.

## Tech Stack

- Backend: Node.js + Express
- ORM: Sequelize
- Database: PostgreSQL
- Future auth: JWT + bcrypt
- Frontend: React + Vite
- Package manager: npm
- Local environment: Windows PowerShell

## Folder Structure

```text
book-club-app/
  backend/
    package.json
    nodemon.json
    .env.example
    src/
      app.js
      server.js
      config/
        database.js
      routes/
        index.js
      migrations/
        202605300001-create-core-tables.js
      middlewares/
        authMiddleware.js
        errorHandler.js
        notFoundHandler.js
      models/
        index.js
        member.model.js
        bookTitle.model.js
        bookCopy.model.js
        bookTransaction.model.js
        pointHistory.model.js
      seeders/
        202605300001-core-demo-data.js
      scripts/
        migrate.js
        seed.js
      utils/
        asyncHandler.js
        response.js
      modules/
        auth/
          auth.routes.js
          auth.controller.js
          auth.service.js
        books/
          book.routes.js
          book.controller.js
          book.service.js
        transactions/
          transaction.routes.js
          transaction.controller.js
          transaction.service.js
        points/
          point.routes.js
          point.controller.js
          point.service.js
  frontend/
  docs/
  docker-compose.yml
  README.md
  .gitignore
```

## Run PostgreSQL With Docker

From the project root:

```powershell
docker compose up -d
```

## Setup Backend

```powershell
cd backend
npm install
copy .env.example .env
npm run migrate
npm run seed
npm run dev
```

## Database Day 2

The Day 2 database deliverable is implemented with five core tables from the plan and
system design:

- `members`
- `book_titles`
- `book_copies`
- `book_transactions`
- `point_histories`

The migration adds the required foreign keys, status checks, point balance check, and
indexes for the MVP flow. The seed creates 3 demo members, 5 book titles, 5 book
copies, and initial point history rows. Demo accounts all use password
`Password123`.

Book copy responses use `bookTitle` as the canonical alias for the related
`book_titles` record.

See `docs/backend-data-day-2.md` for the backend/data checklist and verification
result.

The backend should log:

```text
Database connected successfully
Server running on port 5000
```

## Setup Frontend

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

For a production build:

```powershell
npm run build
```

## Backend Environment

Create `backend/.env` from `backend/.env.example`:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=book_club_db
DB_USER=book_club_user
DB_PASSWORD=book_club_password
DB_DIALECT=postgres
DB_LOGGING=false

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
```

`DB_LOGGING=true` enables Sequelize SQL logs for debugging. Keep it `false`
for a cleaner demo terminal.

## Demo Accounts

After running `npm run seed`, the demo password for every seeded account is
`Password123`.

| Role | Name | Email | Notes |
|---|---|---|---|
| User A / owner | Nguyễn Văn An | `an@example.com` | Owns available demo books |
| User B / receiver | Trần Thị Bình | `binh@example.com` | Can request books and is marked as a deliverer |
| User C / member | Lê Minh Chi | `chi@example.com` | Can register as a deliverer via API/UI |

## Backend API Quick Reference

```text
GET http://localhost:5000/api/health
GET http://localhost:5000/api/auth/ping
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
GET http://localhost:5000/api/auth/me
GET http://localhost:5000/api/members/me
PUT http://localhost:5000/api/members/me
GET http://localhost:5000/api/members/me/points
GET http://localhost:5000/api/books/ping
GET http://localhost:5000/api/books
GET http://localhost:5000/api/books/my
GET http://localhost:5000/api/books/:copyId
POST http://localhost:5000/api/books
PUT http://localhost:5000/api/books/:copyId
DELETE http://localhost:5000/api/books/:copyId
GET http://localhost:5000/api/transactions/ping
POST http://localhost:5000/api/transactions
GET http://localhost:5000/api/transactions/my
GET http://localhost:5000/api/transactions/:transactionId
PUT http://localhost:5000/api/transactions/:transactionId/confirm
PUT http://localhost:5000/api/transactions/:transactionId/cancel
GET http://localhost:5000/api/points/ping
GET http://localhost:5000/api/points/history
GET http://localhost:5000/api/deliverers
POST http://localhost:5000/api/deliverers/register
GET http://localhost:5000/api/deliverers/me
PUT http://localhost:5000/api/deliverers/me
```

All protected endpoints require:

```text
Authorization: Bearer <token>
```

## Auth API

### Register

```text
POST /api/auth/register
Token: no
Content-Type: application/json
```

Request:

```json
{
  "full_name": "Nguyen Van A",
  "email": "a@example.com",
  "password": "Password123",
  "phone": "0987654321"
}
```

Response:

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "member_id": "uuid",
      "full_name": "Nguyen Van A",
      "email": "a@example.com",
      "point_balance": 20,
      "role": "member"
    },
    "token": "jwt-token"
  }
}
```

### Login

```text
POST /api/auth/login
Token: no
Content-Type: application/json
```

Request:

```json
{
  "email": "an@example.com",
  "password": "Password123"
}
```

### Get Current User

```text
GET /api/auth/me
Token: required
```

Response does not include `password_hash`.

## Books API

### List Available Books

```text
GET /api/books
Token: no
Query: keyword, q, category
```

### List My Books

```text
GET /api/books/my
Token: required
```

### Get Book Detail

```text
GET /api/books/:copyId
Token: no
```

### Create Book

```text
POST /api/books
Token: required
Content-Type: application/json or multipart/form-data
```

JSON request:

```json
{
  "title": "Nha Gia Kim",
  "author": "Paulo Coelho",
  "category": "Tieu thuyet",
  "publication_year": 2020,
  "condition": "good",
  "exchange_type": "both",
  "note": "San sang trao doi hoac cho muon",
  "cover_url": "https://example.com/cover.jpg"
}
```

Multipart upload uses field name `cover`:

```text
title=Nha Gia Kim
author=Paulo Coelho
condition=good
exchange_type=both
cover=<jpg/png/webp file>
```

Uploaded covers are saved under:

```text
backend/uploads/book-covers
```

The stored `cover_url` looks like:

```text
/uploads/book-covers/cover-1780000000000-file-name.jpg
```

The image is served publicly at:

```text
http://localhost:5000/uploads/book-covers/<filename>
```

If no file is uploaded, `cover_url` from the body still works.

### Update Book

```text
PUT /api/books/:copyId
Token: required, owner only
Content-Type: application/json
```

Request:

```json
{
  "condition": "good",
  "exchange_type": "lending",
  "note": "Muon toi da 14 ngay",
  "status": "available"
}
```

### Delete Book

```text
DELETE /api/books/:copyId
Token: required, owner only
```

Delete is a soft delete: the book copy status becomes `unavailable`.
Book responses include `bookTitle` and `owner`, and owner data does not include
`password_hash`.

## Transactions API

### Create Transaction

```text
POST /api/transactions
Token: required
Content-Type: application/json
```

Without deliverer:

```json
{
  "copy_id": "book-copy-uuid",
  "transaction_type": "permanent"
}
```

With lending return date and deliverer:

```json
{
  "copy_id": "book-copy-uuid",
  "transaction_type": "lending",
  "expected_return_date": "2026-06-30",
  "deliverer_id": "member-uuid"
}
```

Rules:

- A member cannot request their own book.
- The book copy must be `available`.
- Receiver must have enough points: `10` for `permanent`, `5` for `lending`.
- Creating a transaction reserves the book copy.
- Without `deliverer_id`, giver and receiver confirmation completes it.
- With `deliverer_id`, giver, receiver, and deliverer confirmation are required.
- Completed transactions cannot be confirmed again, so points are not changed twice.

### My Transactions

```text
GET /api/transactions/my
Token: required
```

Returns transactions where current user is giver, receiver, or deliverer.

### Transaction Detail

```text
GET /api/transactions/:transactionId
Token: required, participant only
```

### Confirm Transaction

```text
PUT /api/transactions/:transactionId/confirm
Token: required, participant only
```

The backend infers whether the current user confirms as giver, receiver, or
deliverer.

### Cancel Transaction

```text
PUT /api/transactions/:transactionId/cancel
Token: required, participant only
```

Only pending transactions can be cancelled. Cancelling restores a reserved book
copy to `available` and does not change points.

## Points API

### Point History

```text
GET /api/points/history
Token: required
```

Response:

```json
{
  "success": true,
  "message": "Lấy lịch sử điểm thành công",
  "data": [
    {
      "point_history_id": "uuid",
      "member_id": "uuid",
      "transaction_id": "uuid",
      "point_change": 10,
      "reason": "permanent_exchange",
      "created_at": "2026-06-01T00:00:00.000Z"
    }
  ]
}
```

After a completed transaction:

- Giver receives `+10` for `permanent` or `+5` for `lending`.
- Receiver pays `-10` for `permanent` or `-5` for `lending`.
- Deliverer receives `+2` when delivery is used and confirmed.

## Deliverers API

### List Deliverers

```text
GET /api/deliverers
Token: required
```

Returns active members with `is_deliverer = true`. Response does not include
`password_hash`.

### Register As Deliverer

```text
POST /api/deliverers/register
Token: required
Content-Type: application/json
```

Request:

```json
{
  "service_area": "Cau Giay, Ha Noi",
  "available_hours": "18:00 - 21:00"
}
```

This sets `is_deliverer = true` and creates or updates the current user's
`deliverer_profile`.

### My Deliverer Profile

```text
GET /api/deliverers/me
Token: required
```

### Update My Deliverer Profile

```text
PUT /api/deliverers/me
Token: required
Content-Type: application/json
```

```json
{
  "service_area": "Dong Da, Ha Noi",
  "available_hours": "Weekend",
  "is_active": true
}
```

## Backend Demo Checklist

```text
1. docker compose up -d
2. cd backend
3. npm install
4. copy .env.example .env
5. npm run migrate
6. npm run seed
7. npm run dev
```

Expected health response:

```json
{
  "success": true,
  "message": "Book Club API is running",
  "data": {
    "status": "OK",
    "timestamp": "2026-06-01T00:00:00.000Z",
    "uptime": 12.345
  }
}
```

Manual test checklist:

```text
Register thành công: HTTP 201, có user, token, point_balance = 20
Register trùng email: HTTP 409
Login đúng: HTTP 200, có token
Login sai password: HTTP 401
Get me với Bearer token: HTTP 200, không trả password_hash
GET /api/books: HTTP 200, không trả owner.password_hash
POST /api/books multipart/form-data: HTTP 201, cover_url bắt đầu bằng /uploads/book-covers/
POST /api/transactions: HTTP 201, sách chuyển reserved
Confirm đủ các bên: transaction completed, point_histories được ghi
Cancel pending: transaction cancelled, sách quay lại available
```
