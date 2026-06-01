## Frontend Verification Checklist — Day 1 to Day 4

### Day 1 — Frontend Setup & Base UI

- [x] Frontend chạy được bằng lệnh:

```bash
npm install
npm run dev
```

- [x] Ứng dụng mở được tại:

```text
http://localhost:5173
```

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

### Day 2 — Backend/Data Integration Readiness

- [x] Frontend có thể kết nối backend thông qua biến môi trường:

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

### Day 3 — Authentication

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

### Day 4 — Book CRUD Frontend

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

---

### Day 5 — Transaction Core Frontend

> Status: Frontend implemented with mock mode first.
> Backend transaction API can be integrated later by changing `VITE_USE_MOCK_TRANSACTION=false`.

#### Environment

Frontend supports transaction mock mode through:

```env
VITE_USE_MOCK_TRANSACTION=true
```

Use this while backend transaction APIs are not ready.

When backend transaction APIs are ready, switch to:

```env
VITE_USE_MOCK_TRANSACTION=false
```

Then restart frontend:

```bash
npm run dev
```

---

#### Frontend Transaction Scope

- [x] Transaction page exists:

```text
/transactions
```

- [x] `/transactions` is protected and requires login.

- [x] Transaction page displays Vietnamese UI.

- [x] Transaction page supports loading, error, and empty states.

- [x] Transaction cards show:

  - Book title
  - Author
  - Category
  - Transaction type
  - Transaction status
  - Current user's role
  - Confirmation status
  - Expected return date if lending
  - Created date
  - Completed date if completed
  - Point impact

- [x] User can create a transaction from `/books`.

- [x] Book cards show `Tạo giao dịch` for available books not owned by the current user.

- [x] Book cards show `Sách của bạn` for books owned by the current user.

- [x] Create transaction modal works.

- [x] User can choose transaction type:

  - `Cho mượn`
  - `Trao đổi vĩnh viễn`

- [x] Lending transaction shows expected return date field.

- [x] Transaction point cost is displayed:

  - Lending: `Bạn sẽ dùng 5 điểm cho giao dịch này.`
  - Permanent: `Bạn sẽ dùng 10 điểm cho giao dịch này.`

- [x] User can submit a mock transaction.

- [x] After creating a transaction, user is redirected to `/transactions`.

- [x] User can confirm a pending transaction.

- [x] User can cancel a pending transaction.

- [x] Mock transaction data is saved in localStorage, so refresh does not immediately lose mock transactions.

- [x] `transactionService` can switch between mock mode and real API mode.

- [x] Existing Day 1–4 features still work.

---

#### Transaction UI Labels

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

Confirmation labels:

```text
giver_confirmed true    -> Người cho đã xác nhận
giver_confirmed false   -> Người cho chưa xác nhận
receiver_confirmed true -> Người nhận đã xác nhận
receiver_confirmed false -> Người nhận chưa xác nhận
```

Current user role labels:

```text
giver    -> Bạn là người cho sách
receiver -> Bạn là người nhận sách
```

Point impact labels:

```text
giver + permanent    -> +10 điểm
receiver + permanent -> -10 điểm
giver + lending      -> +5 điểm
receiver + lending   -> -5 điểm
```

---

#### Manual Test Flow — Mock Mode

Before testing, make sure frontend `.env` contains:

```env
VITE_API_URL=http://localhost:5000
VITE_USE_MOCK_TRANSACTION=true
```

Start backend:

```bash
cd backend
npm run dev
```

Start frontend:

```bash
cd frontend
npm run dev
```

Login with seeded account:

```text
Email: an@example.com
Password: Password123
```

Test flow:

1. Open:

```text
http://localhost:5173/transactions
```

2. Confirm the page displays correctly.
3. Open:

```text
http://localhost:5173/books
```

4. Find a book not owned by the current user.
5. Click:

```text
Tạo giao dịch
```

6. Select:

```text
Cho mượn
```

7. Enter expected return date, for example:

```text
2026-06-15
```

8. Click:

```text
Gửi yêu cầu
```

9. Confirm the app redirects to:

```text
/transactions
```

10. Confirm the new transaction appears with status:

```text
Đang chờ xác nhận
```

11. Click:

```text
Xác nhận hoàn thành
```

12. Confirm the UI updates to show:

```text
Bạn đã xác nhận. Đang chờ bên còn lại.
```

13. Create another pending transaction.
14. Click:

```text
Hủy giao dịch
```

15. Confirm the transaction status becomes:

```text
Đã hủy
```

16. Refresh the page.
17. Confirm mock transactions are still visible.

---

#### Backend API Contract Needed for Real Integration

Backend should implement the following endpoints so frontend can switch from mock mode to real API mode.

##### 1. Create transaction

```text
POST /api/transactions
```

Request body:

```json
{
  "copy_id": 1,
  "transaction_type": "lending",
  "expected_return_date": "2026-06-15"
}
```

Also acceptable if backend supports camelCase:

```json
{
  "copyId": 1,
  "transactionType": "lending",
  "expectedReturnDate": "2026-06-15"
}
```

Expected behavior:

- Current logged-in user is receiver.
- Book owner is giver.
- Receiver cannot create a transaction with their own book.
- Book copy must be `available`.
- Receiver must have enough points:

  - `lending`: at least 5 points
  - `permanent`: at least 10 points

- On success:

  - Create transaction with status `pending`.
  - Change book copy status from `available` to `reserved`.

Expected response:

```json
{
  "success": true,
  "message": "Tạo giao dịch thành công.",
  "transaction": {
    "transaction_id": 1,
    "copy_id": 1,
    "transaction_type": "lending",
    "status": "pending",
    "giver_confirmed": false,
    "receiver_confirmed": false,
    "expected_return_date": "2026-06-15",
    "created_at": "2026-06-01T10:00:00.000Z"
  }
}
```

---

##### 2. Get current user's transactions

```text
GET /api/transactions/my
```

Expected behavior:

Return transactions where current user is either giver or receiver.

Expected response shape:

```json
{
  "success": true,
  "transactions": [
    {
      "transaction_id": 1,
      "copy_id": 1,
      "transaction_type": "lending",
      "status": "pending",
      "giver_confirmed": false,
      "receiver_confirmed": true,
      "expected_return_date": "2026-06-15",
      "completed_at": null,
      "created_at": "2026-06-01T10:00:00.000Z",
      "book": {
        "title": "Nhà Giả Kim",
        "author": "Paulo Coelho",
        "category": "Tiểu thuyết"
      },
      "giver": {
        "member_id": 1,
        "full_name": "Nguyễn Văn An",
        "email": "an@example.com"
      },
      "receiver": {
        "member_id": 2,
        "full_name": "Trần Bình",
        "email": "binh@example.com"
      }
    }
  ]
}
```

---

##### 3. Confirm transaction

```text
PUT /api/transactions/:transactionId/confirm
```

Expected behavior:

- Only giver or receiver can confirm.
- If current user is giver, set `giver_confirmed = true`.
- If current user is receiver, set `receiver_confirmed = true`.
- If only one side has confirmed, transaction remains `pending`.
- If both sides have confirmed, backend completes the transaction atomically.

Completion rules:

For `lending`:

```text
giver: +5 points
receiver: -5 points
book copy status: borrowed
transaction status: completed
```

For `permanent`:

```text
giver: +10 points
receiver: -10 points
book copy status: exchanged
transaction status: completed
```

Backend must create point history records for both users.

Expected response if waiting for other side:

```json
{
  "success": true,
  "message": "Xác nhận giao dịch thành công. Đang chờ bên còn lại xác nhận.",
  "transaction": {
    "transaction_id": 1,
    "status": "pending",
    "giver_confirmed": false,
    "receiver_confirmed": true
  }
}
```

Expected response if completed:

```json
{
  "success": true,
  "message": "Giao dịch đã hoàn tất và điểm đã được cập nhật.",
  "transaction": {
    "transaction_id": 1,
    "status": "completed",
    "giver_confirmed": true,
    "receiver_confirmed": true,
    "completed_at": "2026-06-01T10:30:00.000Z"
  }
}
```

---

##### 4. Cancel transaction

```text
PUT /api/transactions/:transactionId/cancel
```

Expected behavior:

- Only giver or receiver can cancel.
- Only pending transactions can be canceled.
- Set transaction status to `cancelled`.
- Set book copy status back to `available`.
- Do not update points.

Expected response:

```json
{
  "success": true,
  "message": "Đã hủy giao dịch.",
  "transaction": {
    "transaction_id": 1,
    "status": "cancelled"
  }
}
```

---

##### 5. Point history

Frontend already expects point history from:

```text
GET /api/members/me/points
```

After a completed transaction, backend should return new point history records.

Expected point history item:

```json
{
  "point_history_id": 1,
  "member_id": 1,
  "transaction_id": 1,
  "point_change": 5,
  "reason": "Cho mượn sách thành công",
  "created_at": "2026-06-01T10:30:00.000Z"
}
```

Suggested reason values:

```text
Trao đổi sách thành công
Nhận sách qua trao đổi
Cho mượn sách thành công
Mượn sách thành công
```

---

#### Backend Requirements Summary

Backend needs to implement:

```text
POST /api/transactions
GET /api/transactions/my
GET /api/transactions/:transactionId
PUT /api/transactions/:transactionId/confirm
PUT /api/transactions/:transactionId/cancel
GET /api/members/me/points
```

Backend should guarantee:

- [ ] Transaction APIs require JWT.
- [ ] User cannot create transaction with their own book.
- [ ] Book must be available before creating transaction.
- [ ] Book status changes `available -> reserved` after transaction creation.
- [ ] One-sided confirmation does not update points.
- [ ] Two-sided confirmation updates points.
- [ ] Point update uses database transaction.
- [ ] Point history is created for both users.
- [ ] Lending transaction changes book status to `borrowed`.
- [ ] Permanent transaction changes book status to `exchanged`.
- [ ] Canceling pending transaction changes book status back to `available`.
- [ ] Receiver cannot go below 0 points.
- [ ] Double confirmation must not create duplicate point history records.

---

### Current Status

```text
Day 1: Passed
Day 2: Passed
Day 3: Passed
Day 4: Passed
Day 5: Frontend mock mode ready
```

Frontend Day 5 is ready for backend transaction API integration. Once backend finishes the transaction endpoints, set:

```env
VITE_USE_MOCK_TRANSACTION=false
```

Then restart frontend and test the real transaction flow.

### Vietnamese UI Check

- [x] Tất cả text người dùng nhìn thấy đều là tiếng Việt.
- [x] Không còn text tiếng Anh không cần thiết trong UI.
- [x] Các trạng thái sách hiển thị đúng:

```text
available   -> Sẵn sàng
reserved    -> Đang giữ chỗ
borrowed    -> Đang mượn
exchanged   -> Đã trao đổi
unavailable -> Tạm ẩn
```

- [x] Tình trạng sách hiển thị đúng:

```text
new  -> Mới
good -> Còn tốt
fair -> Đã qua sử dụng
worn -> Hơi cũ
```

- [x] Hình thức trao đổi hiển thị đúng:

```text
permanent -> Trao đổi vĩnh viễn
lending   -> Cho mượn
both      -> Trao đổi hoặc cho mượn
```

- [x] Dữ liệu demo hiển thị đúng dấu tiếng Việt, ví dụ:

```text
Tieu thuyet                    -> Tiểu thuyết
Nha Gia Kim                    -> Nhà Giả Kim
Nguyen Van An                  -> Nguyễn Văn An
Con tốt                        -> Còn tốt
Van hoc Viet Nam               -> Văn học Việt Nam
Toi Thay Hoa Vang Tren Co Xanh -> Tôi thấy hoa vàng trên cỏ xanh
Nguyen Nhat Anh                -> Nguyễn Nhật Ánh
Muon toi da 14 ngay            -> Mượn tối đa 14 ngày
```

---

### Manual Test Flow

Use this flow to verify the frontend manually.

1. Start backend:

```bash
cd backend
npm run migrate
npm run seed
npm run dev
```

2. Start frontend:

```bash
cd frontend
npm run dev
```

3. Open frontend:

```text
http://localhost:5173
```

4. Login with seeded account:

```text
Email: an@example.com
Password: Password123
```

5. Verify these pages:

```text
/
/login
/register
/books
/my-books
/books/new
/points
/transactions
```

6. Add a new book with sample data:

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

7. Confirm the book appears in `/my-books`.

8. Edit the book note or condition.

9. Delete the book.

10. Refresh the page and confirm the deleted book does not appear again.

---

### Current Status

```text
Day 1: Passed
Day 2: Passed
Day 3: Passed
Day 4: Passed
```

The frontend is ready to continue with Day 5: Transaction core, including creating transactions, confirming transactions, updating points, and displaying point history.
