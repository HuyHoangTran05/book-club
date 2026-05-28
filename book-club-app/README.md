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
        authMiddleware.js
        errorHandler.js
        notFoundHandler.js
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
      models/
        index.js
        member.model.js
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
GET http://localhost:5000/api/auth/ping
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
GET http://localhost:5000/api/auth/me
GET http://localhost:5000/api/books/ping
GET http://localhost:5000/api/transactions/ping
GET http://localhost:5000/api/points/ping
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

## Auth API

### Register

```text
POST http://localhost:5000/api/auth/register
Content-Type: application/json
```

Request:

```json
{
  "full_name": "Nguyen Van A",
  "email": "a@example.com",
  "password": "12345678",
  "phone": "0987654321"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": {
    "user": {
      "member_id": "uuid",
      "full_name": "Nguyen Van A",
      "email": "a@example.com",
      "phone": "0987654321",
      "point_balance": 20,
      "role": "member"
    },
    "token": "jwt-access-token"
  }
}
```

### Login

```text
POST http://localhost:5000/api/auth/login
Content-Type: application/json
```

Request:

```json
{
  "email": "a@example.com",
  "password": "12345678"
}
```

Expected response:

```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "user": {
      "member_id": "uuid",
      "full_name": "Nguyen Van A",
      "email": "a@example.com",
      "point_balance": 20,
      "role": "member"
    },
    "token": "jwt-access-token"
  }
}
```

### Get Me

```text
GET http://localhost:5000/api/auth/me
Authorization: Bearer <token>
```

Expected response:

```json
{
  "success": true,
  "message": "Lấy thông tin người dùng thành công",
  "data": {
    "user": {
      "member_id": "uuid",
      "full_name": "Nguyen Van A",
      "email": "a@example.com",
      "point_balance": 20,
      "role": "member"
    }
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
```
