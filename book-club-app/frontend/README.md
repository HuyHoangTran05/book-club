# Frontend Verification Checklist — Cộng Đồng Sách

README này dùng để kiểm tra phần frontend từ Day 1 đến Day 5.

> Trạng thái hiện tại: Day 1–5 đã chạy được với API thật.
> `VITE_USE_MOCK_TRANSACTION=false` là chế độ mặc định để demo.

---

## Environment

Trong `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK_TRANSACTION=false
```

Trong `frontend/.env.example` nên có:

```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK_TRANSACTION=false
```

Sau khi sửa `.env`, cần restart frontend:

```bash
npm run dev
```

---

## Day 1 — Frontend Setup & Base UI

- [x] Frontend chạy được bằng lệnh:

```bash
npm install
npm run dev
```

- [x] Ứng dụng mở được tại:

```text
http://localhost:5173
```

> Nếu Vite đổi port, có thể là `http://localhost:5174`.

- [x] Homepage hiển thị đúng giao diện chính.
- [x] Login page hiển thị đúng layout.
- [x] Register page hiển thị đúng layout.
- [x] Giao diện sử dụng tiếng Việt.
- [x] Không còn hiển thị tên `BookCommunity` trong UI.
- [x] Brand hiển thị là `Cộng Đồng Sách`.
- [x] Font tiếng Việt hiển thị đúng dấu.
- [x] Không có lỗi tách chữ hoặc lỗi spacing tiếng Việt.
- [x] Nút hoặc logo quay về trang chủ hoạt động từ Login/Register.

---

## Day 2 — Backend/Data Integration Readiness

- [x] Frontend kết nối backend qua biến môi trường:

```env
VITE_API_URL=http://localhost:5000
```

- [x] Backend health check hoạt động:

```text
GET /api/health
```

- [x] Auth ping hoạt động:

```text
GET /api/auth/ping
```

- [x] Book API cơ bản đã sẵn sàng để frontend gọi.
- [x] Seed data backend có thể được hiển thị trên frontend.
- [x] Không còn lỗi `ConnectionRefusedError` khi backend và PostgreSQL đang chạy.

---

## Day 3 — Authentication

- [x] Login page gọi API thật:

```text
POST /api/auth/login
```

- [x] Register page gọi API thật:

```text
POST /api/auth/register
```

- [x] Register gửi đúng field backend yêu cầu:

```json
{
  "full_name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0912345678",
  "password": "Password123"
}
```

- [x] Đăng nhập thành công bằng tài khoản seed:

```text
an@example.com / Password123
binh@example.com / Password123
chi@example.com / Password123
```

- [x] Đăng nhập sai mật khẩu hiển thị lỗi phù hợp.
- [x] Đăng ký tài khoản mới thành công.
- [x] Đăng ký trùng email hiển thị lỗi phù hợp.
- [x] Token được lưu trong `localStorage` với key:

```text
auth_token
```

- [x] Refresh trang không làm mất phiên đăng nhập.
- [x] Route protected hoạt động: chưa đăng nhập thì bị chuyển về `/login`.
- [x] Đăng xuất xóa token và chuyển về `/login`.
- [x] API `/api/auth/me` hoạt động với token hợp lệ.
- [x] API `/api/members/me` hoạt động với token hợp lệ.
- [x] API `/api/members/me/points` hoạt động với token hợp lệ.

---

## Day 4 — Book CRUD Frontend

- [x] Trang danh sách sách hoạt động:

```text
/books
```

- [x] Trang sách của tôi hoạt động:

```text
/my-books
```

- [x] Trang thêm sách hoạt động:

```text
/books/new
```

hoặc:

```text
/books/add
```

- [x] `/books` lấy dữ liệu thật từ backend:

```text
GET /api/books
```

- [x] `/my-books` lấy sách của người dùng hiện tại:

```text
GET /api/books/my
```

- [x] Thêm sách mới thành công:

```text
POST /api/books
```

- [x] Sửa thông tin sách thành công:

```text
PUT /api/books/:copyId
```

- [x] Xóa sách thành công:

```text
DELETE /api/books/:copyId
```

- [x] Sau khi xóa sách, F5 lại trang thì sách đã xóa không hiển thị lại.
- [x] Sách có trạng thái `unavailable` không hiển thị trong danh sách thông thường.
- [x] Loading state hiển thị đúng khi đang tải dữ liệu.
- [x] Error state hiển thị đúng khi API lỗi.
- [x] Empty state hiển thị đúng khi chưa có sách.
- [x] Form thêm/sửa sách có validation cơ bản.
- [x] Xóa sách có hộp thoại xác nhận trước khi xóa.
- [x] Danh sách sách responsive trên desktop và mobile.
- [x] Sidebar active route hoạt động đúng: vào `/books/new` chỉ active `Thêm sách`, không active đồng thời `Khám phá sách`.

---

## Day 5 — Transaction Core Frontend with Real API

> Trạng thái hiện tại: Day 5 đã tích hợp API thật.
> Mock transaction chỉ còn dùng cho dev khi bật rõ ràng `VITE_USE_MOCK_TRANSACTION=true`.

### Day 5 API used by frontend

Frontend hiện dùng các API thật:

```text
POST /api/transactions
GET /api/transactions/my
GET /api/transactions/:transactionId
PUT /api/transactions/:transactionId/confirm
PUT /api/transactions/:transactionId/cancel
GET /api/points/history
GET /api/members/me/points
```

### Transaction real API mode

- [x] `VITE_USE_MOCK_TRANSACTION=false` là chế độ demo thật.
- [x] `transactionService` dùng strict check:

```js
import.meta.env.VITE_USE_MOCK_TRANSACTION === "true";
```

- [x] Khi real API mode đang bật, frontend không đọc mock localStorage.
- [x] Các key mock cũ được bỏ qua hoặc xóa:

```text
book_club_mock_transactions
mock_transactions
mockTransactions
transaction_mock_data
```

- [x] Nếu backend trả:

```json
{
  "success": true,
  "data": []
}
```

thì `/transactions` hiển thị empty state, không hiển thị giao dịch giả.

### Transaction page

- [x] Trang giao dịch tồn tại:

```text
/transactions
```

- [x] `/transactions` là protected route.
- [x] Trang giao dịch hiển thị tiếng Việt.
- [x] Có loading, error và empty state.
- [x] Transaction card hiển thị:

  - Tên sách
  - Tác giả
  - Thể loại
  - Người cho / chủ sách
  - Người nhận
  - Người giao nếu có
  - Trạng thái giao dịch
  - Vai trò hiện tại của user
  - `giver_confirmed`
  - `receiver_confirmed`
  - `delivery_confirmed` nếu có deliverer
  - Ngày tạo
  - Ngày dự kiến trả nếu là giao dịch mượn
  - Ngày hoàn thành nếu completed
  - Điểm cộng/trừ theo vai trò

### Create transaction from `/books`

- [x] User có thể tạo giao dịch từ `/books`.
- [x] Sách của chính user hiển thị `Sách của bạn` và không cho tạo giao dịch.
- [x] Sách không sẵn sàng không cho tạo giao dịch.
- [x] Modal tạo giao dịch hoạt động.
- [x] Modal chỉ cho chọn hình thức giao dịch mà sách hỗ trợ:

  - `lending` -> chỉ cho `Cho mượn`
  - `permanent` -> chỉ cho `Trao đổi vĩnh viễn`
  - `both` -> cho cả hai

- [x] Nếu backend trả lỗi `Book copy does not support this transaction type`, frontend hiển thị:

  - `Cuốn sách này không hỗ trợ hình thức giao dịch đã chọn.`

- [x] Nếu backend trả lỗi sách không sẵn sàng, frontend hiển thị:

  - `Sách này hiện không còn sẵn sàng.`

- [x] Nếu backend trả lỗi không đủ điểm, frontend hiển thị:

  - `Bạn không đủ điểm để thực hiện giao dịch này.`

- [x] Tạo giao dịch thành công gọi API thật:

```text
POST /api/transactions
```

- [x] Sau khi tạo giao dịch thành công, user được chuyển sang `/transactions`.

### Confirm transaction

- [x] Người nhận có thể xác nhận giao dịch.
- [x] Một bên xác nhận thì giao dịch chưa hoàn thành.
- [x] Chủ sách có thể xác nhận giao dịch.
- [x] Khi đủ điều kiện xác nhận, giao dịch chuyển sang `completed`.
- [x] Nếu có người giao, UI hỗ trợ hiển thị và xác nhận `delivery_confirmed`.
- [x] User không liên quan tới giao dịch không thấy nút xác nhận/hủy.
- [x] User đã xác nhận không thấy nút xác nhận lần nữa.

### Point history

- [x] PointHistoryPage dùng API thật:

```text
GET /api/points/history
```

- [x] Không dùng `mockCurrentUser`.
- [x] Không dùng `mockPointHistory`.
- [x] Lịch sử điểm hiển thị:

  - Thời gian
  - Giao dịch
  - Điểm thay đổi
  - Lý do

- [x] Hiển thị dấu `+` cho điểm dương.
- [x] Hiển thị dấu `-` cho điểm âm.
- [x] Card `Điểm hiện tại` hiển thị điểm hiện tại của user.
- [x] Nếu API không trả trực tiếp `point_balance`, frontend có thể tính điểm hiện tại bằng tổng các `point_change`.
- [x] Lý do điểm được map sang tiếng Việt:

  - `initial_register` -> `Điểm khởi đầu khi đăng ký`
  - `permanent_exchange` + điểm dương -> `Trao đổi sách thành công`
  - `permanent_exchange` + điểm âm -> `Nhận sách qua trao đổi`
  - `lending` + điểm dương -> `Cho mượn sách thành công`
  - `lending` + điểm âm -> `Mượn sách thành công`

---

## Transaction UI Labels

Transaction type labels:

```text
permanent -> Trao đổi vĩnh viễn
lending   -> Cho mượn
```

Transaction status labels:

```text
pending   -> Đang chờ xác nhận
completed -> Đã hoàn thành
cancelled -> Đã hủy
```

Book status labels after transaction:

```text
reserved  -> Đang giữ chỗ
borrowed  -> Đang mượn
exchanged -> Đã trao đổi
```

Confirmation labels:

```text
giver_confirmed true     -> Chủ sách đã xác nhận
giver_confirmed false    -> Chủ sách chưa xác nhận
receiver_confirmed true  -> Người nhận đã xác nhận
receiver_confirmed false -> Người nhận chưa xác nhận
delivery_confirmed true  -> Người giao đã xác nhận
delivery_confirmed false -> Người giao chưa xác nhận
no deliverer             -> Không có người giao
```

Current user role labels:

```text
giver     -> Bạn là chủ sách
receiver  -> Bạn là người nhận
deliverer -> Bạn là người giao
```

Point impact labels:

```text
giver + permanent    -> +10 điểm
receiver + permanent -> -10 điểm
giver + lending      -> +5 điểm
receiver + lending   -> -5 điểm
```

---

## Vietnamese UI Check

- [x] Tất cả text người dùng nhìn thấy đều là tiếng Việt.
- [x] Không còn text tiếng Anh không cần thiết trong UI.
- [x] Không còn hiển thị tên `BookCommunity`.
- [x] Brand hiển thị là `Cộng Đồng Sách`.
- [x] Font tiếng Việt hiển thị đúng dấu.
- [x] Không có lỗi tách chữ hoặc lỗi spacing tiếng Việt.

### Book labels

Trạng thái sách:

```text
available   -> Sẵn sàng
reserved    -> Đang giữ chỗ
borrowed    -> Đang mượn
exchanged   -> Đã trao đổi
unavailable -> Tạm ẩn
```

Tình trạng sách:

```text
new  -> Mới
good -> Còn tốt
fair -> Đã qua sử dụng
worn -> Hơi cũ
```

Hình thức trao đổi:

```text
permanent -> Trao đổi vĩnh viễn
lending   -> Cho mượn
both      -> Trao đổi hoặc cho mượn
```

### Demo data normalization

- [x] Dữ liệu demo hiển thị đúng dấu tiếng Việt, ví dụ:

```text
Tieu thuyet                    -> Tiểu thuyết
Nha Gia Kim                    -> Nhà Giả Kim
Dac Nhan Tam                   -> Đắc Nhân Tâm
Ky nang song                   -> Kỹ năng sống
Nguyen Van An                  -> Nguyễn Văn An
Tran Thi Binh                  -> Trần Thị Bình
Le Minh Chi                    -> Lê Minh Chi
Con tốt                        -> Còn tốt
Van hoc Viet Nam               -> Văn học Việt Nam
Toi Thay Hoa Vang Tren Co Xanh -> Tôi thấy hoa vàng trên cỏ xanh
Nguyen Nhat Anh                -> Nguyễn Nhật Ánh
Muon toi da 14 ngay            -> Mượn tối đa 14 ngày
```

---

## Manual Test Flow — Full Demo

### 1. Start backend

```bash
cd backend
npm run dev
```

Nếu cần reset database demo:

```bash
npm run migrate
npm run seed
npm run dev
```

### 2. Start frontend

```bash
cd frontend
npm run dev
```

Mở frontend:

```text
http://localhost:5173
```

hoặc port Vite đang báo, ví dụ:

```text
http://localhost:5174
```

### 3. Login

Dùng tài khoản seed:

```text
an@example.com / Password123
binh@example.com / Password123
chi@example.com / Password123
```

### 4. Verify base pages

Kiểm tra các route:

```text
/
/login
/register
/books
/my-books
/books/new
/transactions
/points
/points/history
```

### 5. Book CRUD flow

1. Login bằng `an@example.com`.
2. Vào `/books/new`.
3. Thêm sách mới với dữ liệu mẫu:

```text
Tên sách: Dế Mèn Phiêu Lưu Ký
Tác giả: Tô Hoài
Thể loại: Văn học Việt Nam
Nhà xuất bản: NXB Kim Đồng
Năm xuất bản: 1941
ISBN: 9786040000011
Ngôn ngữ: Tiếng Việt
Tình trạng: Còn tốt
Hình thức trao đổi: Cho mượn
Ghi chú: Sách còn tốt, phù hợp để cho mượn.
```

4. Kiểm tra sách xuất hiện trong `/my-books`.
5. Sửa thông tin sách.
6. Xóa sách.
7. F5 lại trang và xác nhận sách đã xóa không hiện lại.

### 6. Transaction flow — Permanent exchange

1. Login bằng user nhận sách, ví dụ `an@example.com`.
2. Vào `/books`.
3. Chọn sách của user khác có hình thức `Trao đổi vĩnh viễn` hoặc `Trao đổi hoặc cho mượn`.
4. Bấm `Tạo giao dịch`.
5. Chọn `Trao đổi vĩnh viễn`.
6. Bấm `Gửi yêu cầu`.
7. Vào `/transactions`.
8. User nhận sách xác nhận giao dịch.
9. Logout.
10. Login bằng chủ sách, ví dụ `binh@example.com`.
11. Vào `/transactions`.
12. Chủ sách xác nhận giao dịch.
13. Giao dịch chuyển sang `Đã hoàn thành`.
14. Vào `/points/history`.
15. Kiểm tra:

    - Chủ sách có `+10 điểm`.
    - Người nhận có `-10 điểm`.
    - Lý do hiển thị tiếng Việt, không hiển thị raw `permanent_exchange`.

### 7. Transaction flow — Lending

1. Login bằng user nhận sách.
2. Vào `/books`.
3. Chọn sách có hình thức `Cho mượn` hoặc `Trao đổi hoặc cho mượn`.
4. Bấm `Tạo giao dịch`.
5. Chọn `Cho mượn`.
6. Nhập ngày dự kiến trả.
7. Bấm `Gửi yêu cầu`.
8. User nhận sách xác nhận.
9. Logout.
10. Login bằng chủ sách.
11. Chủ sách xác nhận.
12. Giao dịch chuyển sang `Đã hoàn thành`.
13. Vào `/points/history`.
14. Kiểm tra:

    - Chủ sách có `+5 điểm`.
    - Người nhận có `-5 điểm`.

---

## API Verification with PowerShell

### Login and get token

```powershell
$loginBody = @{
  email = "an@example.com"
  password = "Password123"
} | ConvertTo-Json

$response = Invoke-RestMethod `
  -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json; charset=utf-8" `
  -Body $loginBody

$token = $response.data.token
```

### Check transactions

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:5000/api/transactions/my" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 10
```

### Check point history

```powershell
Invoke-RestMethod `
  -Uri "http://localhost:5000/api/points/history" `
  -Method GET `
  -Headers @{ Authorization = "Bearer $token" } | ConvertTo-Json -Depth 10
```

---

## Day 6 — Test, Fix Bug, Edge Case, UI Polish

- [x] Loading, error, and success messages are present.
- [x] PointHistoryPage displays real API data.
- [x] Current point card displays correct points.
- [x] TransactionsPage ignores mock localStorage in real mode.
- [x] Create transaction modal restricts invalid transaction type.
- [x] Vietnamese display normalization works.
- [x] Sidebar active route is correct.
- [x] End-to-end demo flow passes.
- [x] `npm run build` passes.

---

## Final Verification Checklist

- [x] `npm run build` pass.
- [x] `VITE_USE_MOCK_TRANSACTION=false`.
- [x] `/transactions` gọi API thật.
- [x] `/points/history` gọi API thật.
- [x] Không còn dùng mock point history.
- [x] Real API mode không đọc mock transaction localStorage.
- [x] Tạo giao dịch từ `/books` thành công.
- [x] `/transactions` hiển thị giao dịch thật.
- [x] Người nhận xác nhận được.
- [x] Chủ sách xác nhận được.
- [x] Giao dịch completed sau khi đủ xác nhận.
- [x] Point history hiển thị `+10/-10` với permanent exchange.
- [x] Point history hiển thị `+5/-5` với lending.
- [x] Card `Điểm hiện tại` hiển thị đúng điểm hiện tại.
- [x] Dữ liệu demo tiếng Việt hiển thị đúng dấu.
- [x] Sidebar active route hoạt động đúng.
- [x] Không còn giao dịch mock/stale localStorage trong real API mode.

---

## Current Status

```text
Day 1: Passed
Day 2: Passed
Day 3: Passed
Day 4: Passed
Day 5: Passed with real API
```

Frontend is ready for the full demo flow: authentication, book CRUD, transaction creation, transaction confirmation, point update, and point history display.
