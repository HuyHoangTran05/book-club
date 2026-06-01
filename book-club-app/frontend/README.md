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
