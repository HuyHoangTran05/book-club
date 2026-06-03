# BookCommunity - Hệ thống kết nối thành viên câu lạc bộ đọc sách

BookCommunity, hay Cộng Đồng Sách, là ứng dụng web giúp thành viên câu lạc bộ đọc sách chia sẻ, trao đổi và cho mượn sách trong cộng đồng.

Hệ thống dùng cơ chế điểm để khuyến khích chia sẻ:

- Thành viên mới nhận 20 điểm khi đăng ký.
- Trao đổi vĩnh viễn: chủ sách +10 điểm, người nhận -10 điểm.
- Cho mượn sách: chủ sách +5 điểm, người mượn -5 điểm.
- Người giao sách xác nhận giao thành công nhận +2 điểm.

Ứng dụng có các luồng chính: đăng sách, tìm kiếm sách, liên hệ chủ sách, nhắn tin, tạo giao dịch mượn hoặc trao đổi, chọn người giao sách, xác nhận giao dịch, xem lịch sử điểm và đánh giá sau giao dịch.

## Tổng quan chức năng

### Khách

- Xem trang chủ.
- Đăng ký tài khoản.
- Đăng nhập.

### Thành viên

- Quản lý hồ sơ cá nhân.
- Đổi mật khẩu.
- Xem danh sách sách.
- Tìm kiếm, lọc và phân trang sách.
- Thêm sách mới.
- Upload ảnh bìa sách.
- Xem sách của tôi.
- Sửa hoặc xóa sách của tôi.
- Liên hệ chủ sách.
- Nhắn tin trong cuộc trò chuyện.
- Tạo giao dịch mượn hoặc trao đổi sách.
- Chọn người giao sách nếu cần.
- Xác nhận hoặc hủy giao dịch.
- Xem lịch sử điểm.
- Đăng ký làm người giao sách.
- Đánh giá thành viên sau giao dịch hoàn tất.

### Người giao sách

- Đăng ký hồ sơ giao sách.
- Cập nhật khu vực và thời gian giao sách.
- Bật hoặc tắt trạng thái hoạt động.
- Xác nhận giao sách.
- Nhận điểm thưởng +2 khi giao dịch hoàn tất có người giao sách.

### Admin

Admin hiện có các chức năng:

- Đăng nhập bằng tài khoản quản trị.
- Xem dashboard thống kê hệ thống.
- Quản lý thành viên.
- Tìm kiếm, lọc thành viên theo trạng thái hoặc vai trò.
- Khóa, mở khóa hoặc xóa thành viên.
- Giám sát danh sách giao dịch.
- Lọc giao dịch theo trạng thái hoặc loại giao dịch.
- Xuất báo cáo tổng hợp dạng Excel hoặc PDF qua API báo cáo.

Chưa có trang admin quản lý sách riêng. Nếu báo cáo hoặc demo cần phần này, có thể xem là hướng phát triển tiếp theo.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| Frontend | React, Vite, CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| ORM | Sequelize |
| Authentication | JWT, bcrypt |
| Upload file | multer |
| Report export | exceljs, pdfkit |
| DevOps | Docker, Docker Compose |

## Cấu trúc thư mục

```text
book-club-app/
├── backend/
│   ├── uploads/
│   │   └── book-covers/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── migrations/
│   │   ├── models/
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── books/
│   │   │   ├── conversations/
│   │   │   ├── deliverers/
│   │   │   ├── members/
│   │   │   ├── points/
│   │   │   ├── ratings/
│   │   │   └── transactions/
│   │   ├── routes/
│   │   ├── scripts/
│   │   ├── seeders/
│   │   └── utils/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── package.json
├── docs/
├── docker-compose.yml
└── README.md
```

## Yêu cầu cài đặt

- Node.js >= 18.
- npm >= 9.
- Git.
- Docker Desktop hoặc Docker Engine nếu chạy PostgreSQL bằng Docker Compose.
- PostgreSQL >= 14 nếu không dùng Docker.

Project hiện dùng PostgreSQL 16 trong `docker-compose.yml`.

## Cách chạy project

### 1. Clone project

```bash
git clone <repo-url>
cd <project-folder>/book-club-app
```

Nếu repository của bạn clone trực tiếp vào thư mục `book-club-app`, chỉ cần:

```bash
cd book-club-app
```

### 2. Chạy PostgreSQL bằng Docker

```bash
docker compose up -d
```

Theo cấu hình hiện tại:

- PostgreSQL trong container chạy ở port `5432`.
- Máy host truy cập PostgreSQL qua port `5433`.

Thông tin database:

```text
Database: book_club_db
User: book_club_user
Password: book_club_password
Host: localhost
Port: 5433
```

### 3. Cài đặt và cấu hình backend

```bash
cd backend
npm install
cp .env.example .env
```

Nếu dùng Windows PowerShell:

```powershell
cd backend
npm install
copy .env.example .env
```

Nội dung `backend/.env` nên có dạng:

```env
NODE_ENV=development
PORT=5000

DB_HOST=localhost
DB_PORT=5433
DB_NAME=book_club_db
DB_USER=book_club_user
DB_PASSWORD=book_club_password
DB_DIALECT=postgres
DB_LOGGING=false

JWT_SECRET=change_this_secret_in_local_env
JWT_EXPIRES_IN=7d
```

Lưu ý: `JWT_SECRET` ở trên chỉ là ví dụ cho môi trường local. Không dùng secret này cho production.

### 4. Chạy migration, seed data và tạo admin

Từ thư mục `backend`:

```bash
npm run db:migrate
npm run db:seed
npm run db:create-admin
```

Các alias tương đương cũng tồn tại:

```bash
npm run migrate
npm run seed
npm run create-admin
```

`npm run db:create-admin` tạo hoặc cập nhật tài khoản admin mặc định:

```text
Email: admin@gmail.com
Password: Hungdzvcl2005
```

### 5. Chạy backend

Từ thư mục `backend`:

```bash
npm run dev
```

Backend chạy tại:

```text
http://localhost:5000
```

Kiểm tra backend:

```bash
curl http://localhost:5000/api/health
```

Kết quả mong đợi:

```json
{
  "success": true,
  "message": "Book Club API is running"
}
```

### 6. Cài đặt và chạy frontend

Mở terminal khác, từ thư mục `book-club-app`:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Nếu dùng Windows PowerShell:

```powershell
cd frontend
npm install
copy .env.example .env
npm run dev
```

Nội dung `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK_TRANSACTION=false
```

Frontend chạy tại:

```text
http://localhost:5173
```

### 7. Build frontend

Từ thư mục `frontend`:

```bash
npm run build
```

## Tài khoản demo

Sau khi chạy seed, có nhiều tài khoản demo. Một số tài khoản thường dùng:

| Vai trò | Email | Password |
|---|---|---|
| Chủ sách chính | `manhdung05072005@gmail.com` | `manhdung123123` |
| Người nhận sách | `23020520@vnu.edu.vn` | `manhdung123123` |
| Người giao sách | `deliverer@example.com` | `manhdung123123` |
| Chủ sách phụ | `owner2@example.com` | `manhdung123123` |
| Người nhận phụ | `receiver2@example.com` | `manhdung123123` |
| Admin | `admin@gmail.com` | `Hungdzvcl2005` |

Nếu tài khoản admin không đăng nhập được, chạy lại:

```bash
cd backend
npm run db:create-admin
```

## API chính

Base URL:

```text
http://localhost:5000/api
```

Các API cần đăng nhập dùng header:

```text
Authorization: Bearer <token>
```

### Auth

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/auth/ping` | Kiểm tra module auth |
| POST | `/api/auth/register` | Đăng ký |
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/me` | Lấy user hiện tại |

### Members/Profile

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/members/me` | Xem hồ sơ |
| PUT | `/api/members/me` | Cập nhật hồ sơ |
| PUT | `/api/members/me/password` | Đổi mật khẩu |
| GET | `/api/members/me/points` | Lấy điểm/lịch sử điểm theo member |

### Books

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/books` | Danh sách sách available, có filter/pagination |
| GET | `/api/books/my` | Sách của tôi |
| GET | `/api/books/:copyId` | Chi tiết một bản sách |
| POST | `/api/books` | Thêm sách |
| PUT | `/api/books/:copyId` | Sửa sách của tôi |
| DELETE | `/api/books/:copyId` | Ẩn/xóa sách của tôi |

Query hỗ trợ cho `GET /api/books`:

```text
page
limit
keyword
category
author
year
```

Upload ảnh bìa khi thêm sách:

- Dùng `multipart/form-data`.
- Field file: `cover`.
- Ảnh được lưu tại `backend/uploads/book-covers`.
- URL lưu trong database dạng `/uploads/book-covers/<filename>`.

### Conversations

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/conversations/:userId` | Tạo hoặc lấy cuộc trò chuyện với user |
| GET | `/api/conversations` | Danh sách cuộc trò chuyện của tôi |
| GET | `/api/conversations/:conversationId/messages` | Tin nhắn trong cuộc trò chuyện |
| POST | `/api/conversations/:conversationId/messages` | Gửi tin nhắn |

### Transactions

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/transactions` | Tạo giao dịch |
| GET | `/api/transactions/my` | Giao dịch liên quan tới tôi |
| GET | `/api/transactions/:transactionId` | Chi tiết giao dịch |
| PUT | `/api/transactions/:transactionId/confirm` | Xác nhận giao dịch hoặc xác nhận giao sách |
| PUT | `/api/transactions/:transactionId/cancel` | Hủy giao dịch pending |

Payload tạo giao dịch không có người giao sách:

```json
{
  "copy_id": "book-copy-uuid",
  "transaction_type": "permanent"
}
```

Payload tạo giao dịch có người giao sách:

```json
{
  "copy_id": "book-copy-uuid",
  "transaction_type": "lending",
  "expected_return_date": "2026-06-30",
  "deliverer_id": "deliverer-member-uuid"
}
```

### Points

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/points/history` | Lịch sử điểm của user hiện tại |

### Deliverers

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/deliverers` | Danh sách người giao sách đang hoạt động |
| POST | `/api/deliverers/register` | Đăng ký làm người giao sách |
| GET | `/api/deliverers/me` | Hồ sơ giao sách của tôi |
| PUT | `/api/deliverers/me` | Cập nhật hồ sơ giao sách |

### Ratings

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/ratings` | Tạo đánh giá sau giao dịch completed |
| GET | `/api/ratings/member/:memberId` | Xem đánh giá của một thành viên |
| GET | `/api/ratings/my-received` | Đánh giá tôi nhận được |
| GET | `/api/ratings/my-given` | Đánh giá tôi đã gửi |

### Admin

Admin API yêu cầu JWT hợp lệ và role `admin`.

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/admin/stats` | Thống kê dashboard admin |
| GET | `/api/admin/members` | Danh sách thành viên |
| PUT | `/api/admin/members/:memberId/status` | Khóa hoặc mở khóa thành viên |
| DELETE | `/api/admin/members/:memberId` | Xóa thành viên nếu không vướng dữ liệu liên quan |
| GET | `/api/admin/transactions` | Danh sách giao dịch toàn hệ thống |
| GET | `/api/reports/summary?format=xlsx` | Xuất báo cáo Excel |
| GET | `/api/reports/summary?format=pdf` | Xuất báo cáo PDF |

## Frontend routes

### Public

| Route | Mô tả |
|---|---|
| `/` | Trang chủ |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |

### User

| Route | Mô tả |
|---|---|
| `/books` | Khám phá sách |
| `/books/new` | Thêm sách |
| `/books/add` | Alias thêm sách |
| `/my-books` | Sách của tôi |
| `/transactions` | Giao dịch của tôi |
| `/conversations` | Danh sách cuộc trò chuyện |
| `/conversations/:conversationId` | Chi tiết cuộc trò chuyện |
| `/deliverer-profile` | Hồ sơ người giao sách |
| `/profile` | Hồ sơ cá nhân |
| `/ratings` | Đánh giá |
| `/points/history` | Lịch sử điểm |

### Admin

| Route | Mô tả |
|---|---|
| `/admin` | Dashboard admin |
| `/admin/members` | Quản lý thành viên |
| `/admin/transactions` | Giám sát giao dịch |

## Luồng demo gợi ý

### Luồng 1: Thành viên tạo giao dịch không có người giao

1. Đăng nhập bằng tài khoản người nhận.
2. Vào `/books`.
3. Chọn sách của thành viên khác.
4. Tạo giao dịch vĩnh viễn hoặc cho mượn.
5. Người nhận xác nhận.
6. Đăng xuất, đăng nhập bằng chủ sách.
7. Chủ sách xác nhận.
8. Giao dịch chuyển `completed`.
9. Kiểm tra `/points/history`.

### Luồng 2: Giao dịch có người giao sách

1. Đăng nhập bằng người nhận.
2. Vào `/books`.
3. Tạo giao dịch và chọn người giao sách.
4. Người nhận và chủ sách xác nhận.
5. Giao dịch vẫn `pending` nếu người giao chưa xác nhận.
6. Đăng nhập bằng người giao sách.
7. Vào `/transactions`.
8. Xác nhận giao sách.
9. Giao dịch chuyển `completed`.
10. Người giao sách nhận +2 điểm.

### Luồng 3: Admin

1. Đăng nhập bằng `admin@gmail.com`.
2. Vào `/admin`.
3. Xem thống kê tổng quan.
4. Vào `/admin/members` để khóa/mở khóa thành viên.
5. Vào `/admin/transactions` để xem giao dịch.
6. Xuất báo cáo từ dashboard.

## Script npm

### Backend

| Script | Mô tả |
|---|---|
| `npm run dev` | Chạy backend bằng nodemon |
| `npm run start` | Chạy backend bằng node |
| `npm run db:migrate` | Chạy migration |
| `npm run db:seed` | Chạy seed data |
| `npm run db:create-admin` | Tạo hoặc cập nhật admin |
| `npm run migrate` | Alias của `db:migrate` |
| `npm run seed` | Alias của `db:seed` |
| `npm run create-admin` | Alias của `db:create-admin` |

### Frontend

| Script | Mô tả |
|---|---|
| `npm run dev` | Chạy Vite dev server |
| `npm run build` | Build production |
| `npm run preview` | Preview bản build |

## Troubleshooting

### Backend không kết nối được PostgreSQL

Kiểm tra Docker:

```bash
docker compose ps
```

Nếu compose publish port `5433:5432`, `backend/.env` phải dùng:

```env
DB_PORT=5433
```

Sau khi sửa `.env`, restart backend.

### Lỗi `Route not found: POST /auth/register`

Backend API có prefix `/api`. Endpoint đúng là:

```text
POST http://localhost:5000/api/auth/register
```

Frontend phải dùng `VITE_API_URL=http://localhost:5000`.

### Giao dịch hiển thị dữ liệu giả

Kiểm tra frontend env:

```env
VITE_USE_MOCK_TRANSACTION=false
```

Service transaction chỉ bật mock khi biến này đúng bằng `"true"`.

### Admin không đăng nhập được

Chạy lại:

```bash
cd backend
npm run db:create-admin
```

Sau đó đăng nhập:

```text
admin@gmail.com / Hungdzvcl2005
```

### Ảnh upload không hiển thị

Backend phục vụ static upload qua:

```text
http://localhost:5000/uploads/book-covers/<filename>
```

Kiểm tra file có tồn tại trong:

```text
backend/uploads/book-covers
```

## Kiểm tra nhanh trước demo

Từ `book-club-app/backend`:

```bash
npm run db:migrate
npm run db:seed
npm run db:create-admin
npm run dev
```

Từ `book-club-app/frontend`:

```bash
npm run build
npm run dev
```

Mở:

```text
http://localhost:5173/
http://localhost:5173/books
http://localhost:5173/admin
```

Kiểm tra API:

```bash
curl http://localhost:5000/api/health
```

## Hướng phát triển

Các chức năng sau chưa phải phần hoàn thiện chính trong code hiện tại hoặc có thể mở rộng thêm:

- Notification/thông báo thời gian thực.
- Chat realtime bằng WebSocket.
- Trang admin quản lý sách riêng.
- Admin xử lý báo cáo vi phạm.
- Export báo cáo nâng cao theo khoảng thời gian.
- Upload ảnh lên cloud storage như S3 hoặc Cloudinary.
- Tích hợp email verification thật.

## Ghi chú bảo mật

- Không commit file `.env` thật.
- Không dùng `JWT_SECRET` mặc định cho production.
- Mật khẩu được hash bằng bcrypt.
- API admin được bảo vệ bằng JWT và role `admin`.
- API upload chỉ nhận ảnh JPG, PNG hoặc WEBP.
