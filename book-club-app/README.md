# book-club-app

Demo project for an app that connects members of a book reading club.

## Tech Stack

- Backend: Node.js + Express
- ORM: Sequelize
- Database: PostgreSQL
- Future auth: JWT + bcrypt
- Future frontend: React + Vite
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
      middlewares/
        errorHandler.js
        notFoundHandler.js
      modules/
        auth/
        books/
        transactions/
        points/
      models/
      migrations/
      seeders/
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
npm run dev
```

The backend should log:

```text
Database connected successfully
Server running on port 5000
```

## Test API

```text
GET http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Book Club API is running",
  "timestamp": "2026-05-28T00:00:00.000Z"
}
```
