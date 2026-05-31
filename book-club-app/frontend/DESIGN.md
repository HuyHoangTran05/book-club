# DESIGN.md — BookCommunity / Cộng Đồng Sách

> Design system guide for the React + Vite frontend.  
> All future pages must follow this file so the UI stays consistent with the existing Homepage, Login, and Register pages.

---

## 1. Product Identity

### Product name

Use this Vietnamese brand name everywhere in the UI:

```txt
Cộng Đồng Sách
```

Do not show `BookCommunity` in user-facing UI.

Technical names in code can remain English, for example: `BookCard`, `AuthLayout`, `HomePage`.

### Product concept

Cộng Đồng Sách is a Vietnamese academic book community platform where members can:

- share books
- exchange or borrow books
- join reading discussions
- earn reward points
- connect with other readers

The UI should feel:

- academic
- warm
- calm
- trustworthy
- community-oriented
- modern but not flashy

### Visual mood

Use the existing Stitch-inspired visual direction:

- cream/off-white background
- deep green primary color
- gold accent color
- large rounded cards
- soft shadows
- elegant typography
- book/community illustrations
- generous whitespace

Do not redesign the app into a generic SaaS dashboard.

---

## 2. Core Design Rules

### Rule 1 — Keep all pages visually connected

Every new page must look like it belongs to the same product as:

- Homepage
- Login page
- Register page

Reuse the same:

- colors
- font family
- border radius
- button style
- card style
- spacing system
- section heading style
- Vietnamese wording style

### Rule 2 — Vietnamese-first UI

All user-facing text must be Vietnamese.

Examples:

| Avoid         | Use             |
| ------------- | --------------- |
| BookCommunity | Cộng Đồng Sách  |
| Login         | Đăng nhập       |
| Register      | Đăng ký         |
| Dashboard     | Bảng điều khiển |
| Books         | Sách            |
| My Books      | Sách của tôi    |
| Transactions  | Giao dịch       |
| Point History | Lịch sử điểm    |
| Add Book      | Thêm sách       |
| Search        | Tìm kiếm        |
| Save          | Lưu             |
| Cancel        | Hủy             |
| Submit        | Xác nhận        |
| Loading...    | Đang tải...     |
| No data       | Chưa có dữ liệu |

Code identifiers may stay English. UI text must be Vietnamese.

### Rule 3 — Vietnamese font safety

Vietnamese accents must render correctly.

Required font stack:

```css
font-family: "Be Vietnam Pro", "Inter", "Segoe UI", "Roboto", "Arial",
  sans-serif;
```

Recommended Google Font import if the project already uses online fonts:

```css
@import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Noto+Serif:wght@500;600;700;800&display=swap");
```

For elegant serif headings or quotes:

```css
font-family: "Noto Serif", "Merriweather", "Georgia", "Times New Roman", serif;
```

Also make sure `index.html` contains:

```html
<meta charset="UTF-8" />
```

All files must be saved as UTF-8.

### Rule 4 — Do not break Vietnamese words

Avoid excessive letter spacing on Vietnamese text.

Do not use these Tailwind classes on Vietnamese text:

```txt
tracking-widest
tracking-[0.2em]
tracking-[0.3em]
tracking-[0.4em]
```

Use these instead:

```txt
tracking-normal
tracking-[0.02em]
tracking-[0.04em]
```

For long Vietnamese headings, prefer:

```css
line-height: 1.08;
letter-spacing: normal;
word-break: normal;
overflow-wrap: normal;
hyphens: none;
text-wrap: balance;
```

---

## 3. Design Tokens

### Colors

Use these tokens as the main design palette.

```css
:root {
  --color-bg: #f6f4ea;
  --color-surface: #ffffff;
  --color-surface-soft: #fbfaf3;

  --color-primary: #064834;
  --color-primary-dark: #033b2a;
  --color-primary-soft: #e7f1e8;

  --color-secondary: #123c31;
  --color-accent: #c9ad2e;
  --color-accent-soft: #f0e7b7;

  --color-text: #082d24;
  --color-text-muted: #64736d;
  --color-border: #d9e2d8;

  --color-success: #0f7a4f;
  --color-warning: #b98a00;
  --color-danger: #b42318;

  --shadow-soft: 0 18px 45px rgba(6, 72, 52, 0.12);
  --shadow-card: 0 14px 35px rgba(8, 45, 36, 0.1);
}
```

Tailwind equivalent suggestions:

```js
colors: {
  cream: "#F6F4EA",
  surface: "#FFFFFF",
  green: {
    900: "#033B2A",
    800: "#064834",
    700: "#0B5C43",
    100: "#E7F1E8"
  },
  gold: {
    600: "#C9AD2E",
    100: "#F0E7B7"
  },
  text: {
    main: "#082D24",
    muted: "#64736D"
  },
  border: "#D9E2D8"
}
```

### Border radius

Use large soft corners.

```css
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-full: 999px;
```

Default component radius:

| Component  | Radius       |
| ---------- | ------------ |
| Button     | 14px or full |
| Input      | 14px         |
| Card       | 24px         |
| Modal      | 28px         |
| Hero image | 28px         |
| Auth card  | 28px         |

### Spacing

Use comfortable spacing. Avoid cramped UI.

```txt
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 24px
2xl: 32px
3xl: 48px
4xl: 64px
```

Page padding:

```txt
Mobile: 16px
Tablet: 24px
Desktop: 40px to 56px
```

### Typography

Default body:

```txt
font: Be Vietnam Pro
size: 16px
line-height: 1.6
color: #082D24
```

Recommended type scale:

| Use case      |                             Size |  Weight | Line height |
| ------------- | -------------------------------: | ------: | ----------: |
| Hero title    | 64–88px desktop / 42–52px mobile | 700–800 |        1.05 |
| Page title    | 40–56px desktop / 32–40px mobile | 700–800 |        1.12 |
| Section title |                          32–44px |     700 |         1.2 |
| Card title    |                          20–24px |     700 |         1.3 |
| Body          |                          16–18px | 400–500 |         1.6 |
| Small text    |                          13–14px | 500–600 |         1.4 |
| Badge         |                          12–14px |     700 |         1.2 |

For decorative quote text, use serif carefully:

```txt
Noto Serif / Georgia
font-style: italic if needed
line-height: 1.25–1.35
```

---

## 4. Layout System

### Public pages

Used for:

- Homepage
- Login
- Register
- Landing pages

Style:

- cream background
- deep green highlights
- large visual sections
- rounded cards
- minimal navigation

### Auth layout

Used for:

- `/login`
- `/register`

Structure:

```txt
Full screen
├── Left visual panel
│   ├── Logo + Cộng Đồng Sách
│   ├── Illustration image
│   ├── Large Vietnamese headline
│   └── Supporting paragraph
└── Right form area
    └── White rounded auth card
        ├── Back to homepage link
        ├── Badge
        ├── Title
        ├── Subtitle
        ├── Form
        └── Bottom auth switch link
```

Rules:

- Logo and brand link to `/`.
- Add a small link: `← Về trang chủ`.
- Left panel should stay dark green.
- Right side should stay cream/off-white.
- Auth card should be white with rounded corners and soft shadow.
- Do not use English placeholder data.

### Main app layout

Used after login:

- Dashboard
- Book list
- Add book
- My books
- Transactions
- Point history
- Profile

Structure:

```txt
App shell
├── Top header
│   ├── Logo + Cộng Đồng Sách
│   ├── Navigation links
│   └── User/points/logout area
└── Main content
    ├── Page header
    ├── Optional filters/actions
    └── Cards/table/list content
```

For Day 2 mock pages, prefer this layout even before API integration.

---

## 5. Component Guidelines

### Button

Primary button:

```txt
background: deep green
text: white
radius: 14px or full
font-weight: 700
height: 48px
hover: slightly darker
shadow: soft green shadow
```

Vietnamese labels:

```txt
Đăng nhập
Đăng ký
Tham gia ngay
Bắt đầu hành trình
Thêm sách
Lưu thay đổi
Xác nhận
Tìm kiếm
```

Button variants:

| Variant   | Use                              |
| --------- | -------------------------------- |
| Primary   | Main action                      |
| Secondary | Less important action            |
| Ghost     | Navigation or subtle action      |
| Danger    | Delete/cancel destructive action |

### Input

Style:

```txt
height: 48px–56px
border: #D9E2D8
radius: 14px
background: white
focus border: deep green
focus ring: soft green
```

Labels should be bold and Vietnamese.

Examples:

```txt
Họ và tên
Email
Số điện thoại
Mật khẩu
Tên sách
Tác giả
Thể loại
Năm xuất bản
Tình trạng sách
Ghi chú
```

Placeholders must be Vietnamese-friendly:

```txt
Nguyễn Văn A
nguyenvana@example.com
0912345678
Nhập tên sách
Nhập tên tác giả
Chọn thể loại
```

### Card

Use cards for:

- book items
- stats
- forms
- transaction items
- empty states

Style:

```txt
background: white or soft cream
radius: 24px
border: 1px solid subtle green/cream border
shadow: soft, not too strong
padding: 20px–28px
```

### Badge

Use small rounded pills for categories, status, and labels.

Examples:

```txt
Triết học
Kinh tế
Khoa học
Văn học
Sẵn sàng
Đang giữ chỗ
Đang mượn
Đã trao đổi
Tạm ẩn
```

Status colors:

| Status      | Vietnamese   | Style           |
| ----------- | ------------ | --------------- |
| available   | Sẵn sàng     | soft green      |
| reserved    | Đang giữ chỗ | soft gold       |
| borrowed    | Đang mượn    | soft blue/green |
| exchanged   | Đã trao đổi  | neutral         |
| unavailable | Tạm ẩn       | gray            |

### Book card

Book card should follow the homepage book style.

Fields:

```txt
Category badge
Book title
Author
Rating if available
Number of groups/discussions if available
Status badge if authenticated page
Action button
```

Example content:

```txt
Triết học
Lý thuyết Hạnh phúc
Marcus Aurelius
4.9
124 nhóm
```

For mock data, use Vietnamese-looking content where possible.

### Empty state

Use friendly Vietnamese text.

Examples:

```txt
Chưa có sách nào
Hãy thêm cuốn sách đầu tiên để bắt đầu chia sẻ với cộng đồng.
```

```txt
Chưa có giao dịch nào
Khi bạn tạo hoặc nhận giao dịch, thông tin sẽ hiển thị tại đây.
```

### Loading state

Use:

```txt
Đang tải dữ liệu...
```

### Error state

Use:

```txt
Đã có lỗi xảy ra. Vui lòng thử lại.
```

---

## 6. Page-Specific Guidelines

### Homepage `/`

Existing homepage style is the visual source of truth.

Keep:

- cream background
- dark green header
- large literary hero title
- academic illustration
- book cards
- stats panel
- quote section

User-facing text should be Vietnamese.

Brand:

```txt
Cộng Đồng Sách
```

### Login `/login`

Text:

```txt
Thành viên câu lạc bộ
Đăng nhập
Chào mừng bạn quay lại với cộng đồng đọc sách
Email
Nhập email của bạn
Mật khẩu
Nhập mật khẩu
Đăng nhập
Chưa có tài khoản? Đăng ký
← Về trang chủ
```

Left panel:

```txt
Kết nối tri thức qua từng cuốn sách
Nền tảng giúp thành viên chia sẻ, trao đổi và lan tỏa văn hóa đọc trong cộng đồng.
```

### Register `/register`

Text:

```txt
Thành viên mới
Đăng ký
Tạo tài khoản Cộng Đồng Sách của bạn
Tài khoản mới nhận 20 điểm khởi đầu.
Họ và tên
Nguyễn Văn A
Email
nguyenvana@example.com
Số điện thoại
0912345678
Mật khẩu
Tạo mật khẩu
Đăng ký
Đã có tài khoản? Đăng nhập
← Về trang chủ
```

Left panel:

```txt
Tham gia cộng đồng đọc sách thông minh
Tạo tài khoản để chia sẻ sách, kết nối thành viên và tích lũy điểm thưởng trong cộng đồng.
```

### Book list `/books`

Purpose:

Show all available books in the community.

Suggested UI:

```txt
Page title: Khám phá sách
Subtitle: Tìm kiếm những cuốn sách đang được thành viên chia sẻ trong cộng đồng.
Search input: Tìm theo tên sách, tác giả hoặc thể loại
Filter: Thể loại
Filter: Trạng thái
Button: Tìm kiếm
```

Use card grid:

```txt
Desktop: 3 or 4 columns
Tablet: 2 columns
Mobile: 1 column
```

Mock book data:

```txt
Lý thuyết Hạnh phúc — Marcus Aurelius — Triết học
Lịch sử Tiền tệ — Niall Ferguson — Kinh tế
Tâm lý học Hành vi — Daniel Kahneman — Khoa học
Những Thư viện Mở — Jorge Luis Borges — Văn học
Dế Mèn Phiêu Lưu Ký — Tô Hoài — Văn học
Tôi Thấy Hoa Vàng Trên Cỏ Xanh — Nguyễn Nhật Ánh — Văn học
```

### Add book `/books/new`

Purpose:

Let member add a book.

Suggested UI:

```txt
Page title: Thêm sách mới
Subtitle: Chia sẻ cuốn sách của bạn để các thành viên khác có thể tìm thấy.
```

Fields:

```txt
Tên sách
Tác giả
Thể loại
Nhà xuất bản
Năm xuất bản
ISBN
Tình trạng sách
Hình thức trao đổi
Ghi chú
Ảnh bìa
```

Buttons:

```txt
Hủy
Lưu sách
```

Use a white card form, not a plain page.

### My books `/my-books`

Purpose:

Show books owned by the current user.

Text:

```txt
Sách của tôi
Quản lý các cuốn sách bạn đã đăng lên cộng đồng.
Thêm sách
```

Use tabs or filters:

```txt
Tất cả
Sẵn sàng
Đang giữ chỗ
Đang mượn
Đã trao đổi
Tạm ẩn
```

### Transactions `/transactions`

Purpose:

Show user's book transactions.

Text:

```txt
Giao dịch của tôi
Theo dõi các giao dịch mượn, trao đổi và xác nhận hoàn thành.
```

Status labels:

```txt
Đang chờ
Đã hoàn thành
Đã hủy
```

Actions:

```txt
Xem chi tiết
Xác nhận hoàn thành
Hủy giao dịch
```

### Point history `/points`

Purpose:

Show reward point changes.

Text:

```txt
Lịch sử điểm
Theo dõi điểm thưởng của bạn trong quá trình chia sẻ và trao đổi sách.
```

Point reasons:

```txt
Điểm khởi đầu khi đăng ký
Cho mượn sách thành công
Mượn sách thành công
Trao đổi sách thành công
Giao sách miễn phí thành công
```

---

## 7. Vietnamese Copy Style

Use polite, concise Vietnamese.

Good examples:

```txt
Chào mừng bạn quay lại
Tạo tài khoản để bắt đầu chia sẻ sách
Tìm kiếm sách trong cộng đồng
Xác nhận giao dịch
Cập nhật hồ sơ
```

Avoid:

```txt
Submit
Create transaction
Point balance
Book copy
User profile
```

Preferred translations:

| Technical term | User-facing Vietnamese |
| -------------- | ---------------------- |
| Member         | Thành viên             |
| Admin          | Quản trị viên          |
| Book title     | Đầu sách               |
| Book copy      | Bản sách               |
| Transaction    | Giao dịch              |
| Point balance  | Điểm hiện tại          |
| Point history  | Lịch sử điểm           |
| Deliverer      | Người giao sách        |
| Rating         | Đánh giá               |
| Profile        | Hồ sơ                  |
| Available      | Sẵn sàng               |
| Reserved       | Đang giữ chỗ           |
| Borrowed       | Đang mượn              |
| Exchanged      | Đã trao đổi            |
| Unavailable    | Tạm ẩn                 |

---

## 8. Mock Data Rules

For mock UI, use Vietnamese-looking data.

### User examples

```txt
Nguyễn Văn A
Trần Minh Anh
Lê Hoàng Nam
Phạm Thu Hà
```

### Email examples

```txt
nguyenvana@example.com
minhanh@example.com
hoangnam@example.com
thuha@example.com
```

### Phone examples

```txt
0912345678
0987654321
0905123456
0868123456
```

### Addresses

```txt
Cầu Giấy, Hà Nội
Thanh Xuân, Hà Nội
Hai Bà Trưng, Hà Nội
Đống Đa, Hà Nội
```

### Categories

```txt
Triết học
Kinh tế
Khoa học
Văn học
Công nghệ
Kỹ năng
Lịch sử
Tâm lý học
```

---

## 9. Responsiveness

All pages must work on:

```txt
375px mobile
768px tablet
1024px laptop
1440px desktop
```

Rules:

- Do not let headings overflow.
- Do not let cards become too narrow.
- Book grids should collapse from 4 columns to 2 columns to 1 column.
- Auth layout can become single-column on mobile.
- Hide or simplify decorative elements on small screens.
- Keep buttons large enough for touch.

Recommended layout behavior:

```txt
Mobile:
- single column
- full-width buttons
- smaller headings
- less padding

Tablet:
- 2-column cards
- moderate padding

Desktop:
- full hero/auth split layout
- 3–4 column card grid
```

---

## 10. Accessibility

Minimum requirements:

- Buttons must have visible labels.
- Links must be keyboard-focusable.
- Inputs must have labels.
- Contrast must be readable.
- Do not rely only on color for status.
- Add `aria-label` for icon-only buttons.

Examples:

```jsx
<Link to="/" aria-label="Về trang chủ">
  <Logo />
  <span>Cộng Đồng Sách</span>
</Link>
```

```jsx
<button aria-label="Mở menu điều hướng">
  <MenuIcon />
</button>
```

---

## 11. Implementation Rules for Agents

When implementing new UI:

1. Read this file first.
2. Reuse existing components before creating new ones.
3. Do not introduce a new visual style.
4. Do not hard-code many scattered text strings if a constants file already exists.
5. Prefer creating or updating shared content files such as:

```txt
src/constants/homepageContent.ts
src/constants/authContent.ts
src/constants/bookContent.ts
src/constants/navigation.ts
```

6. Keep all user-facing text in Vietnamese.
7. Keep code identifiers in English.
8. Keep Vietnamese text UTF-8 safe.
9. Run the project after changes.
10. Build before final response if possible.

---

## 12. Suggested File Structure

Recommended frontend structure:

```txt
frontend/
  src/
    assets/
    components/
      common/
        Button.tsx
        Input.tsx
        Card.tsx
        Badge.tsx
        Loading.tsx
        EmptyState.tsx
      layout/
        PublicLayout.tsx
        AuthLayout.tsx
        AppLayout.tsx
      books/
        BookCard.tsx
        BookForm.tsx
        BookFilters.tsx
    constants/
      navigation.ts
      authContent.ts
      bookContent.ts
      mockData.ts
    pages/
      HomePage.tsx
      LoginPage.tsx
      RegisterPage.tsx
      BookListPage.tsx
      AddBookPage.tsx
      MyBooksPage.tsx
      TransactionsPage.tsx
      PointHistoryPage.tsx
    styles/
      globals.css
```

Do not create too many duplicate components.

---

## 13. Design Checklist Before Finishing

Before sending final changes, verify:

- [ ] No visible `BookCommunity` remains.
- [ ] Brand displays as `Cộng Đồng Sách`.
- [ ] All visible UI text is Vietnamese.
- [ ] Vietnamese accents display correctly.
- [ ] No weird spacing inside Vietnamese words.
- [ ] New pages match Homepage/Login/Register style.
- [ ] Buttons, inputs, cards, badges use consistent styling.
- [ ] Mobile layout does not overflow.
- [ ] Empty/loading/error states exist where needed.
- [ ] `npm run build` passes if available.

---

## 14. Short Agent Prompt

Use this prompt when asking an AI coding agent to create or modify pages:

```txt
Before coding, read DESIGN.md and follow it strictly.

Build the requested React/Vite page using the existing Cộng Đồng Sách design system. Match the current Homepage/Login/Register visual style: cream background, deep green primary color, gold accents, rounded white cards, soft shadows, Vietnamese-first copy, and Vietnamese-safe typography.

Do not redesign the product. Reuse existing components and layout patterns where possible. All user-facing text must be Vietnamese. Keep code identifiers in English. Avoid excessive letter spacing because it breaks Vietnamese text. Ensure responsive layouts for mobile, tablet, and desktop. Run build after implementation if available.
```
