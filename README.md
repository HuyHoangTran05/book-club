# Cộng Đồng Sách - Book Club

Ứng dụng web hỗ trợ thành viên câu lạc bộ chia sẻ, cho mượn và trao đổi sách. Hệ thống cung cấp các chức năng quản lý sách, giao dịch, tin nhắn, thông báo, điểm thưởng, người giao sách và khu vực quản trị.

> Mã nguồn ứng dụng nằm trong thư mục `book-club-app`. Các lệnh cài đặt và khởi động bên dưới được thực hiện từ thư mục này.

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Hình ảnh giao diện](#hình-ảnh-giao-diện)
- [Chức năng chính](#chức-năng-chính)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Cấu trúc thư mục](#cấu-trúc-thư-mục)
- [Yêu cầu cài đặt](#yêu-cầu-cài-đặt)
- [Khởi động nhanh](#khởi-động-nhanh)
- [Cài đặt chi tiết](#cài-đặt-chi-tiết)
- [Tài khoản demo](#tài-khoản-demo)
- [Các trang frontend](#các-trang-frontend)
- [REST API](#rest-api)
- [Luồng nghiệp vụ](#luồng-nghiệp-vụ)
- [Cơ chế điểm](#cơ-chế-điểm)
- [Các lệnh npm](#các-lệnh-npm)
- [Xử lý lỗi thường gặp](#xử-lý-lỗi-thường-gặp)
- [Lưu ý bảo mật](#lưu-ý-bảo-mật)

## Giới thiệu

Cộng Đồng Sách là nền tảng kết nối những người có nhu cầu chia sẻ sách trong cộng đồng. Thành viên có thể:

- Đăng sách đang sở hữu lên thư viện chung.
- Tìm kiếm sách theo tên, thể loại, tác giả và năm xuất bản.
- Trao đổi sách vĩnh viễn hoặc cho thành viên khác mượn.
- Nhắn tin với chủ sách.
- Theo dõi và xác nhận quá trình giao dịch.
- Đăng ký làm người giao sách.
- Tích lũy và theo dõi điểm thưởng.
- Đánh giá thành viên sau khi giao dịch hoàn tất.

Quản trị viên có thể theo dõi tình hình hoạt động, quản lý thành viên, xử lý giao dịch và xuất báo cáo.

## Hình ảnh giao diện

### Trang chủ

Trang giới thiệu tổng quan về cộng đồng và điều hướng người dùng đến trang đăng nhập hoặc đăng ký.

![Trang chủ Cộng Đồng Sách](images/Screenshot%202026-06-12%20203846.png)

### Đăng nhập

Người dùng đăng nhập bằng email và mật khẩu để truy cập các chức năng dành cho thành viên.

![Trang đăng nhập](images/Screenshot%202026-06-12%20203857.png)

### Khám phá sách

Thành viên có thể tìm kiếm, lọc và xem những cuốn sách đang được chia sẻ trong thư viện cộng đồng.

![Trang khám phá sách](images/Screenshot%202026-06-12%20203915.png)

### Sách của tôi và thông báo

Trang quản lý sách cá nhân cho phép lọc, sửa hoặc xóa sách. Chuông thông báo hiển thị các sự kiện như tin nhắn mới, giao dịch hoàn tất, thay đổi điểm và đánh giá.

![Trang sách của tôi và danh sách thông báo](images/Screenshot%202026-06-12%20203943.png)

### Hồ sơ người giao sách

Thành viên có thể đăng ký hoặc cập nhật khu vực, thời gian giao và trạng thái sẵn sàng nhận giao sách.

![Trang đăng ký giao sách](images/Screenshot%202026-06-12%20203953.png)

### Giao diện khám phá sách của quản trị viên

Quản trị viên vẫn có thể truy cập thư viện chung, đồng thời có thêm nhóm chức năng quản trị ở thanh điều hướng.

![Thư viện sách của quản trị viên](images/Screenshot%202026-06-12%20204052.png)

### Bảng điều khiển quản trị

Dashboard tổng hợp số lượng thành viên, sách, giao dịch, điểm đang lưu hành và danh sách thành viên có điểm cao.

![Bảng điều khiển quản trị](images/Screenshot%202026-06-12%20204100.png)

### Quản lý thành viên

Quản trị viên có thể tìm kiếm, lọc, khóa, mở khóa và xóa tài khoản thành viên khi dữ liệu liên quan cho phép.

![Trang quản lý thành viên](images/Screenshot%202026-06-12%20204105.png)

### Giám sát giao dịch

Quản trị viên theo dõi trạng thái xác nhận của chủ sách, người nhận và người giao; các giao dịch đang chờ có thể bị hủy hoặc cưỡng chế hoàn tất.

![Trang giám sát giao dịch](images/Screenshot%202026-06-12%20204110.png)

## Chức năng chính

### Khách chưa đăng nhập

- Xem trang giới thiệu.
- Đăng ký tài khoản.
- Đăng nhập.

### Thành viên

- Xem và cập nhật hồ sơ cá nhân.
- Đổi mật khẩu.
- Khám phá và tìm kiếm sách.
- Lọc sách theo thể loại, tác giả và năm xuất bản.
- Thêm sách mới và tải ảnh bìa lên hệ thống.
- Quản lý sách đã đăng.
- Liên hệ và nhắn tin với chủ sách.
- Tạo giao dịch mượn hoặc trao đổi vĩnh viễn.
- Chọn người giao sách cho giao dịch.
- Xác nhận hoặc hủy giao dịch đang chờ.
- Xem thông báo.
- Xem lịch sử điểm.
- Đăng ký làm người giao sách.
- Đánh giá thành viên sau giao dịch.

### Người giao sách

- Cập nhật khu vực giao sách.
- Cập nhật thời gian có thể giao.
- Bật hoặc tắt trạng thái sẵn sàng.
- Xem các giao dịch được phân công.
- Xác nhận đã hoàn thành giao sách.
- Nhận điểm thưởng sau khi giao thành công.

### Quản trị viên

- Xem dashboard thống kê.
- Xem danh sách và tìm kiếm thành viên.
- Lọc thành viên theo trạng thái.
- Khóa hoặc mở khóa tài khoản.
- Xóa thành viên nếu không có dữ liệu ràng buộc.
- Theo dõi toàn bộ giao dịch.
- Lọc giao dịch theo trạng thái.
- Hủy hoặc cưỡng chế hoàn tất giao dịch đang chờ.
- Xuất báo cáo tổng hợp dạng Excel hoặc PDF.

## Công nghệ sử dụng

| Thành phần | Công nghệ |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Axios |
| Giao diện | CSS, Tailwind CSS |
| Backend | Node.js, Express 5 |
| Cơ sở dữ liệu | PostgreSQL 16 |
| ORM | Sequelize 6 |
| Xác thực | JWT, bcrypt |
| Upload ảnh | Multer |
| Xuất báo cáo | ExcelJS, PDFKit |
| Môi trường phát triển | Nodemon |
| Hạ tầng database | Docker, Docker Compose |

## Kiến trúc hệ thống

```text
Trình duyệt
    |
    | HTTP/JSON
    v
React + Vite (localhost:5173)
    |
    | REST API / JWT
    v
Express API (localhost:5000)
    |
    | Sequelize
    v
PostgreSQL (localhost:5433)
```

- Frontend gọi backend qua HTTP.
- Tất cả API nghiệp vụ có tiền tố `/api`.
- API riêng tư nhận JWT qua header `Authorization: Bearer <token>`.
- Backend kết nối PostgreSQL bằng Sequelize.
- Ảnh bìa tải lên được lưu tại `book-club-app/backend/uploads/book-covers`.
- Ảnh upload được phục vụ qua URL `/uploads/book-covers/<tên-file>`.

## Cấu trúc thư mục

```text
book-club/
├── images/                         # Ảnh minh họa dùng trong README
├── PTTK.pdf                        # Tài liệu phân tích/thiết kế
├── README.md                       # Tài liệu đang đọc
└── book-club-app/                  # Mã nguồn ứng dụng
    ├── backend/
    │   ├── src/
    │   │   ├── config/             # Cấu hình database
    │   │   ├── middlewares/        # Auth, upload, xử lý lỗi
    │   │   ├── migrations/         # Tạo và cập nhật cấu trúc database
    │   │   ├── models/             # Sequelize models
    │   │   ├── modules/            # Các module nghiệp vụ
    │   │   ├── routes/             # Router gốc của API
    │   │   ├── scripts/            # Migrate, seed, tạo admin
    │   │   ├── seeders/            # Dữ liệu demo
    │   │   ├── app.js
    │   │   └── server.js
    │   ├── uploads/book-covers/    # Ảnh bìa do người dùng tải lên
    │   ├── .env.example
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
    │   ├── .env.example
    │   ├── package.json
    │   └── vite.config.js
    ├── docs/
    ├── docker-compose.yml
    └── README.md
```

Các module backend hiện có:

- `auth`: đăng ký, đăng nhập và lấy thông tin người dùng.
- `members`: hồ sơ và mật khẩu thành viên.
- `books`: quản lý sách và ảnh bìa.
- `conversations`: cuộc trò chuyện và tin nhắn.
- `transactions`: giao dịch mượn/trao đổi.
- `points`: lịch sử điểm.
- `deliverers`: hồ sơ người giao sách.
- `notifications`: thông báo cá nhân.
- `ratings`: đánh giá sau giao dịch.
- `admin`: quản lý thành viên, giao dịch và thống kê.
- `reports`: xuất báo cáo Excel/PDF.

## Yêu cầu cài đặt

Máy phát triển cần có:

- Node.js 18 trở lên.
- npm 9 trở lên.
- Docker Desktop hoặc Docker Engine có Docker Compose.
- Git nếu tải dự án từ repository.

Có thể dùng PostgreSQL cài trực tiếp thay cho Docker, nhưng cần tự tạo database và cập nhật đúng biến môi trường backend.

Kiểm tra công cụ:

```powershell
node --version
npm --version
docker --version
docker compose version
```

## Khởi động nhanh

Mở PowerShell tại thư mục `book-club`:

```powershell
cd book-club-app
docker compose up -d

cd backend
Copy-Item .env.example .env
npm ci
npm run db:migrate
npm run db:seed
npm run db:create-admin
npm run dev
```

Giữ terminal backend đang chạy. Mở terminal PowerShell thứ hai:

```powershell
cd book-club-app/frontend
Copy-Item .env.example .env
npm ci
npm run dev
```

Truy cập:

- Frontend: <http://localhost:5173>
- Backend: <http://localhost:5000>
- Kiểm tra API: <http://localhost:5000/api/health>

## Cài đặt chi tiết

### 1. Đi đến thư mục mã nguồn

```powershell
cd book-club-app
```

### 2. Khởi động PostgreSQL

```powershell
docker compose up -d
docker compose ps
```

Cấu hình PostgreSQL mặc định trong `docker-compose.yml`:

| Thuộc tính | Giá trị |
| --- | --- |
| Container | `book_club_postgres` |
| Database | `book_club_db` |
| User | `book_club_user` |
| Password | `book_club_password` |
| Host | `localhost` |
| Port trên máy | `5433` |
| Port trong container | `5432` |

Docker volume `postgres_data` được dùng để giữ dữ liệu khi container dừng hoặc được tạo lại.

### 3. Cấu hình backend

```powershell
cd backend
Copy-Item .env.example .env
npm ci
```

Nội dung cấu hình mặc định:

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

JWT_SECRET=change_this_secret
JWT_EXPIRES_IN=7d
```

Ý nghĩa các biến:

| Biến | Ý nghĩa |
| --- | --- |
| `NODE_ENV` | Môi trường chạy ứng dụng |
| `PORT` | Cổng HTTP của backend |
| `DB_HOST` | Máy chủ PostgreSQL |
| `DB_PORT` | Cổng PostgreSQL |
| `DB_NAME` | Tên database |
| `DB_USER` | Tài khoản database |
| `DB_PASSWORD` | Mật khẩu database |
| `DB_DIALECT` | Loại database Sequelize sử dụng |
| `DB_LOGGING` | Bật/tắt log câu SQL |
| `JWT_SECRET` | Khóa ký access token |
| `JWT_EXPIRES_IN` | Thời gian tồn tại của token |

### 4. Tạo cấu trúc và dữ liệu database

Từ thư mục `book-club-app/backend`:

```powershell
npm run db:migrate
npm run db:seed
npm run db:create-admin
```

- `db:migrate`: chạy các migration theo thứ tự để tạo bảng và index.
- `db:seed`: thêm dữ liệu mẫu phục vụ demo.
- `db:create-admin`: tạo admin mới hoặc cập nhật tài khoản admin đã tồn tại.

### 5. Chạy backend

```powershell
npm run dev
```

Thông báo thành công dự kiến:

```text
Database connected successfully
Server running on port 5000
```

Kiểm tra bằng PowerShell:

```powershell
Invoke-RestMethod http://localhost:5000/api/health
```

### 6. Cấu hình frontend

Mở terminal mới:

```powershell
cd book-club-app/frontend
Copy-Item .env.example .env
npm ci
```

File `.env` frontend:

```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK_TRANSACTION=false
```

| Biến | Ý nghĩa |
| --- | --- |
| `VITE_API_URL` | Địa chỉ backend mà frontend gọi tới |
| `VITE_USE_MOCK_TRANSACTION` | Dùng dữ liệu giao dịch giả khi đặt thành `true` |

### 7. Chạy frontend

```powershell
npm run dev
```

Mở <http://localhost:5173> trong trình duyệt.

### 8. Dừng hệ thống

Nhấn `Ctrl + C` ở terminal frontend và backend. Sau đó dừng PostgreSQL:

```powershell
cd book-club-app
docker compose down
```

Lệnh trên không xóa dữ liệu trong Docker volume.

## Tài khoản demo

Sau khi chạy seed và tạo admin:

| Vai trò | Email | Mật khẩu |
| --- | --- | --- |
| Chủ sách chính | `manhdung05072005@gmail.com` | `manhdung123123` |
| Người nhận sách | `23020520@vnu.edu.vn` | `manhdung123123` |
| Người giao sách | `deliverer@example.com` | `manhdung123123` |
| Chủ sách phụ | `owner2@example.com` | `manhdung123123` |
| Người nhận phụ | `receiver2@example.com` | `manhdung123123` |
| Admin | `admin@gmail.com` | `Hungdzvcl2005` |

Seed cơ bản cũng tạo các tài khoản:

| Email | Mật khẩu |
| --- | --- |
| `an@example.com` | `Password123` |
| `binh@example.com` | `Password123` |
| `chi@example.com` | `Password123` |

Thông tin admin có thể được thay đổi trước khi chạy `db:create-admin` bằng các biến:

```env
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=your_secure_password
ADMIN_NAME=Quản trị viên
```

## Các trang frontend

### Trang công khai

| Đường dẫn | Nội dung |
| --- | --- |
| `/` | Trang chủ |
| `/login` | Đăng nhập |
| `/register` | Đăng ký |

### Trang thành viên

| Đường dẫn | Nội dung |
| --- | --- |
| `/books` | Khám phá sách |
| `/books/new` | Thêm sách |
| `/books/add` | Đường dẫn thay thế để thêm sách |
| `/my-books` | Sách của tôi |
| `/transactions` | Giao dịch của tôi |
| `/conversations` | Danh sách cuộc trò chuyện |
| `/conversations/:conversationId` | Chi tiết cuộc trò chuyện |
| `/notifications` | Danh sách thông báo |
| `/deliverer-profile` | Hồ sơ người giao sách |
| `/profile` | Hồ sơ cá nhân |
| `/ratings` | Đánh giá |
| `/points/history` | Lịch sử điểm |

### Trang quản trị

| Đường dẫn | Nội dung |
| --- | --- |
| `/admin` | Dashboard quản trị |
| `/admin/members` | Quản lý thành viên |
| `/admin/transactions` | Giám sát giao dịch |

Các route thành viên yêu cầu đăng nhập. Các route `/admin/*` yêu cầu tài khoản có vai trò `admin`.

## REST API

Base URL:

```text
http://localhost:5000/api
```

API cần đăng nhập sử dụng header:

```http
Authorization: Bearer <token>
```

### Health check

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/health` | Kiểm tra backend và thời gian hoạt động |

### Xác thực

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/auth/ping` | Kiểm tra module xác thực |
| `POST` | `/api/auth/register` | Đăng ký tài khoản |
| `POST` | `/api/auth/login` | Đăng nhập |
| `GET` | `/api/auth/me` | Lấy người dùng hiện tại |

### Thành viên

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/members/me` | Xem hồ sơ |
| `PUT` | `/api/members/me` | Cập nhật hồ sơ |
| `PUT` | `/api/members/me/password` | Đổi mật khẩu |
| `GET` | `/api/members/me/points` | Xem điểm và lịch sử điểm |

### Sách

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/books` | Danh sách sách đang sẵn sàng |
| `GET` | `/api/books/my` | Danh sách sách của tôi |
| `GET` | `/api/books/:copyId` | Chi tiết một bản sách |
| `POST` | `/api/books` | Thêm sách |
| `PUT` | `/api/books/:copyId` | Sửa sách |
| `DELETE` | `/api/books/:copyId` | Ẩn/xóa sách |

`GET /api/books` hỗ trợ các query: `page`, `limit`, `keyword`, `category`, `author`, `year` và `publication_year`.

Khi tải ảnh bìa, gửi `multipart/form-data` với field file tên `cover`. Hệ thống nhận ảnh JPG, PNG và WEBP.

### Tin nhắn

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/conversations` | Danh sách cuộc trò chuyện |
| `POST` | `/api/conversations/:userId` | Tạo hoặc lấy cuộc trò chuyện |
| `GET` | `/api/conversations/:conversationId/messages` | Lấy tin nhắn |
| `POST` | `/api/conversations/:conversationId/messages` | Gửi tin nhắn |

### Giao dịch

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `POST` | `/api/transactions` | Tạo giao dịch |
| `GET` | `/api/transactions/my` | Giao dịch liên quan đến tôi |
| `GET` | `/api/transactions/:transactionId` | Chi tiết giao dịch |
| `PUT` | `/api/transactions/:transactionId/confirm` | Xác nhận giao dịch |
| `PUT` | `/api/transactions/:transactionId/cancel` | Hủy giao dịch đang chờ |

Ví dụ tạo giao dịch trao đổi vĩnh viễn:

```json
{
  "copy_id": "book-copy-uuid",
  "transaction_type": "permanent"
}
```

Ví dụ tạo giao dịch mượn có người giao:

```json
{
  "copy_id": "book-copy-uuid",
  "transaction_type": "lending",
  "expected_return_date": "2026-06-30",
  "deliverer_id": "deliverer-member-uuid"
}
```

### Điểm, người giao, thông báo và đánh giá

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/points/history` | Lịch sử điểm |
| `GET` | `/api/deliverers` | Danh sách người giao đang hoạt động |
| `POST` | `/api/deliverers/register` | Đăng ký làm người giao |
| `GET` | `/api/deliverers/me` | Xem hồ sơ người giao |
| `PUT` | `/api/deliverers/me` | Cập nhật hồ sơ người giao |
| `GET` | `/api/notifications` | Danh sách thông báo |
| `GET` | `/api/notifications/summary` | Tóm tắt thông báo |
| `GET` | `/api/notifications/unread-count` | Số thông báo chưa đọc |
| `PUT` | `/api/notifications/read-all` | Đánh dấu tất cả đã đọc |
| `PUT` | `/api/notifications/:notificationId/read` | Đánh dấu một thông báo đã đọc |
| `POST` | `/api/ratings` | Tạo đánh giá |
| `GET` | `/api/ratings/member/:memberId` | Xem đánh giá của thành viên |
| `GET` | `/api/ratings/my-received` | Đánh giá tôi đã nhận |
| `GET` | `/api/ratings/my-given` | Đánh giá tôi đã gửi |

### Quản trị và báo cáo

| Method | Endpoint | Chức năng |
| --- | --- | --- |
| `GET` | `/api/admin/stats` | Thống kê dashboard |
| `GET` | `/api/admin/members` | Danh sách thành viên |
| `PUT` | `/api/admin/members/:memberId/status` | Khóa/mở khóa tài khoản |
| `DELETE` | `/api/admin/members/:memberId` | Xóa thành viên |
| `GET` | `/api/admin/transactions` | Toàn bộ giao dịch |
| `PUT` | `/api/admin/transactions/:transactionId/cancel` | Hủy giao dịch |
| `PUT` | `/api/admin/transactions/:transactionId/force-complete` | Cưỡng chế hoàn tất |
| `GET` | `/api/reports/summary?format=xlsx` | Xuất báo cáo Excel |
| `GET` | `/api/reports/summary?format=pdf` | Xuất báo cáo PDF |

## Luồng nghiệp vụ

### Trao đổi hoặc mượn sách

1. Người nhận đăng nhập và mở trang khám phá sách.
2. Người nhận chọn sách của thành viên khác.
3. Người nhận chọn hình thức mượn hoặc trao đổi vĩnh viễn.
4. Nếu mượn sách, người nhận nhập ngày dự kiến trả.
5. Người nhận có thể chọn người giao sách.
6. Chủ sách và người nhận xác nhận giao dịch.
7. Nếu có người giao, người giao cũng phải xác nhận.
8. Khi đủ xác nhận, giao dịch chuyển sang trạng thái hoàn tất.
9. Hệ thống cập nhật điểm và tạo thông báo liên quan.

### Đăng và quản lý sách

1. Thành viên mở trang `Thêm sách`.
2. Nhập tên sách, tác giả, thể loại, năm xuất bản, tình trạng và mô tả.
3. Chọn hình thức có thể cho mượn hoặc trao đổi.
4. Tải ảnh bìa nếu có.
5. Sách xuất hiện trong `Sách của tôi` và thư viện khi ở trạng thái sẵn sàng.
6. Chủ sách có thể sửa hoặc xóa/ẩn bản sách.

### Đăng ký giao sách

1. Thành viên mở trang `Đăng ký giao sách`.
2. Nhập khu vực và thời gian có thể giao.
3. Bật trạng thái sẵn sàng.
4. Thành viên khác có thể chọn người này khi tạo giao dịch.
5. Sau khi giao và xác nhận thành công, người giao được cộng điểm.

### Quản trị hệ thống

1. Admin đăng nhập và mở dashboard.
2. Admin theo dõi số lượng thành viên, sách, giao dịch và điểm.
3. Admin khóa/mở khóa tài khoản vi phạm.
4. Admin theo dõi các giao dịch đang chờ.
5. Admin có thể hủy hoặc cưỡng chế hoàn tất giao dịch phù hợp.
6. Admin xuất báo cáo Excel hoặc PDF.

## Cơ chế điểm

| Hoạt động | Điểm |
| --- | ---: |
| Đăng ký thành viên mới | `+20` |
| Trao đổi vĩnh viễn | Chủ sách `+10`, người nhận `-10` |
| Cho mượn sách | Chủ sách `+5`, người mượn `-5` |
| Hoàn thành giao sách | Người giao `+2` |

Điểm được cập nhật khi giao dịch hoàn tất và có thể xem tại `/points/history`.

## Các lệnh npm

### Backend

Chạy trong `book-club-app/backend`:

| Lệnh | Chức năng |
| --- | --- |
| `npm ci` | Cài dependency đúng theo `package-lock.json` |
| `npm run dev` | Chạy backend bằng Nodemon |
| `npm run start` | Chạy backend bằng Node.js |
| `npm run db:migrate` | Chạy migration |
| `npm run db:seed` | Tạo dữ liệu demo |
| `npm run db:create-admin` | Tạo hoặc cập nhật admin |
| `npm run migrate` | Alias của `db:migrate` |
| `npm run seed` | Alias của `db:seed` |
| `npm run create-admin` | Alias của `db:create-admin` |

### Frontend

Chạy trong `book-club-app/frontend`:

| Lệnh | Chức năng |
| --- | --- |
| `npm ci` | Cài dependency đúng theo `package-lock.json` |
| `npm run dev` | Chạy Vite development server |
| `npm run build` | Build frontend cho production |
| `npm run preview` | Xem thử bản production build |

## Xử lý lỗi thường gặp

### Backend không kết nối được PostgreSQL

Kiểm tra container:

```powershell
cd book-club-app
docker compose ps
docker compose logs postgres
```

Đảm bảo backend `.env` dùng:

```env
DB_HOST=localhost
DB_PORT=5433
```

### Cổng PostgreSQL 5433 đang được sử dụng

Đổi port bên trái trong `docker-compose.yml`, ví dụ:

```yaml
ports:
  - "5434:5432"
```

Sau đó đổi `DB_PORT=5434` trong `backend/.env`.

### Frontend không gọi được API

Kiểm tra backend đang chạy tại cổng 5000 và frontend có:

```env
VITE_API_URL=http://localhost:5000
```

Sau khi sửa `.env`, dừng và chạy lại `npm run dev`.

### Lỗi `Route not found`

Các API đều có tiền tố `/api`. Ví dụ endpoint đăng nhập đúng là:

```text
POST http://localhost:5000/api/auth/login
```

### Chưa có bảng hoặc dữ liệu demo

Chạy lại từ thư mục backend:

```powershell
npm run db:migrate
npm run db:seed
```

### Admin không đăng nhập được

```powershell
cd book-club-app/backend
npm run db:create-admin
```

Sau đó đăng nhập bằng tài khoản admin đã cấu hình.

### Ảnh bìa không hiển thị

- Kiểm tra file tồn tại trong `backend/uploads/book-covers`.
- Kiểm tra backend đang chạy.
- URL ảnh phải có dạng `http://localhost:5000/uploads/book-covers/<tên-file>`.
- Chỉ tải lên JPG, PNG hoặc WEBP.

### Giao dịch đang dùng dữ liệu giả

Đặt trong `frontend/.env`:

```env
VITE_USE_MOCK_TRANSACTION=false
```

Sau đó khởi động lại frontend.

### Muốn tạo lại database Docker từ đầu

> Lệnh sau xóa toàn bộ dữ liệu PostgreSQL của dự án.

```powershell
cd book-club-app
docker compose down -v
docker compose up -d

cd backend
npm run db:migrate
npm run db:seed
npm run db:create-admin
```

## Lưu ý bảo mật

- Không commit file `.env` chứa thông tin thật.
- Thay `JWT_SECRET` bằng chuỗi dài và khó đoán khi triển khai.
- Thay mật khẩu admin mặc định.
- Không dùng tài khoản demo trong môi trường production.
- Chỉ cấp quyền database cần thiết cho ứng dụng.
- Nên giới hạn CORS theo domain frontend khi triển khai.
- Nên lưu ảnh upload trên dịch vụ object storage như S3 hoặc Cloudinary.
- Nên dùng HTTPS để bảo vệ token và thông tin đăng nhập.

## Giới hạn hiện tại và hướng phát triển

- Tin nhắn và thông báo chưa cập nhật realtime bằng WebSocket.
- Chưa có trang admin quản lý sách riêng.
- Chưa có quy trình báo cáo nội dung hoặc tài khoản vi phạm.
- Chưa có email xác thực thật.
- Chưa có bộ kiểm thử tự động đầy đủ.
- Có thể bổ sung tìm kiếm nâng cao, phân quyền chi tiết, cloud storage và CI/CD.

