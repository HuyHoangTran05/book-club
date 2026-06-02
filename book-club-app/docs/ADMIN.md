# Admin / Quản trị viên

Admin features for the Book Club app (PTTK section 3.1.6 — "Báo cáo & quản trị").

## Account

| Field | Value |
| --- | --- |
| Email | `admin@gmail.com` |
| Password | `Hungdzvcl2005` |
| Role | `admin` |

The account is created two ways (both idempotent — safe to re-run):

```bash
# from book-club-app/backend  (Docker DB must be running)
npm run db:create-admin   # creates or promotes admin@gmail.com to role=admin
# or, included automatically in:
npm run db:seed
```

`create-admin` also resets the password and role on an existing account, so run it
again if the login ever stops working. Credentials can be overridden with the
`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` environment variables.

## Access control

Every admin endpoint is protected by `protect` (valid JWT) **and**
`authorizeRoles("admin")`. A normal member calling these gets `403`.
On the frontend, `AdminRoute` redirects non-admins to `/books`, and the
sidebar "Quản trị" section only renders for admin accounts.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/admin/stats` | Dashboard totals, status/type breakdown, today/7d/30d, top 10 by points, transactions pending > 7 days |
| GET | `/api/admin/members` | List members (filters: `q`, `status`, `role`) |
| PUT | `/api/admin/members/:memberId/status` | Lock / unlock / deactivate (`{ "account_status": "active" \| "locked" \| "inactive" }`) |
| DELETE | `/api/admin/members/:memberId` | Delete a member (blocked with 409 if they own books or have transactions — lock instead) |
| GET | `/api/admin/transactions` | List all transactions (filters: `status`, `type`) |
| PUT | `/api/admin/transactions/:transactionId/cancel` | Force-cancel a pending transaction and release the book |
| GET | `/api/admin/reports/summary?format=xlsx\|pdf\|json` | Download summary report |
| GET | `/api/reports/summary?format=…` | Same report, alias matching the PTTK API design |

## Frontend pages

| Route | Page |
| --- | --- |
| `/admin` | Dashboard — stat cards, status/type breakdown, top members, pending-over-7-days alerts, Excel/PDF export |
| `/admin/members` | Member management — search, lock/unlock, delete |
| `/admin/transactions` | Transaction monitor — filter by status, force-cancel |

## Notes

- **Excel export** keeps full Vietnamese text. **PDF export** romanizes names
  (e.g. "Nguyen Van An") because pdfkit's built-in fonts lack Vietnamese
  diacritics; embed a Unicode TTF font to render full Vietnamese in PDF.
- The admin starts with `point_balance = 0` and does not take part in trading.
- Admin accounts cannot lock, deactivate, or delete other admin accounts, nor
  act on their own account.
