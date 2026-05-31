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
npm run db:migrate
npm run db:seed
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

## Test API

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
GET http://localhost:5000/api/points/ping
```

Example login payload:

```json
{
  "email": "an@example.com",
  "password": "Password123"
}
```

Example create book payload:

```json
{
  "title": "Nha Gia Kim",
  "author": "Paulo Coelho",
  "category": "Tieu thuyet",
  "publication_year": 2020,
  "condition": "good",
  "exchange_type": "both",
  "note": "San sang trao doi hoac cho muon"
}
```

Expected health response:

```json
{
  "success": true,
  "message": "Book Club API is running",
  "data": {
    "status": "OK",
    "timestamp": "2026-05-28T00:00:00.000Z",
    "uptime": 12.345
  }
}
```

Expected module ping response:

```json
{
  "success": true,
  "message": "auth module is ready",
  "data": null
}
```
