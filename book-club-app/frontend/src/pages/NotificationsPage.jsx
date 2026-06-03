import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationItem from "../components/notifications/NotificationItem.jsx";
import { BellOffIcon } from "../components/notifications/NotificationIcons.jsx";
import "../components/notifications/notifications.css";
import {
  getNotifications,
  getNotificationErrorMessage,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notificationService.js";
import { notificationRoute } from "../utils/notificationDisplay.js";
import "./NotificationsPage.css";

const PAGE_SIZE = 10;

// Windowed page list: 1 … (cur-1) cur (cur+1) … last
function buildPageList(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((page) => page >= 1 && page <= total).sort((a, b) => a - b);

  const result = [];
  let previous = 0;
  for (const page of sorted) {
    if (page - previous > 1) {
      result.push(`gap-${page}`);
    }
    result.push(page);
    previous = page;
  }
  return result;
}

function NotificationsPage() {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPage = useCallback(async (targetPage) => {
    setLoading(true);
    setError("");
    try {
      const data = await getNotifications({ page: targetPage, limit: PAGE_SIZE });
      setItems(Array.isArray(data?.items) ? data.items : []);
      setPagination(
        data?.pagination ?? { page: targetPage, totalPages: 1, total: 0 },
      );
      setUnreadCount(Number(data?.unreadCount) || 0);
    } catch (requestError) {
      setError(getNotificationErrorMessage(requestError));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, loadPage]);

  const handleSelect = async (notification) => {
    if (!notification.is_read) {
      setItems((prev) =>
        prev.map((item) =>
          item.notification_id === notification.notification_id
            ? { ...item, is_read: true }
            : item,
        ),
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
      markNotificationRead(notification.notification_id).catch(() => loadPage(page));
    }

    navigate(notificationRoute(notification.type));
  };

  const handleMarkAll = async () => {
    if (unreadCount === 0) {
      return;
    }
    setItems((prev) => prev.map((item) => ({ ...item, is_read: true })));
    setUnreadCount(0);
    try {
      await markAllNotificationsRead();
    } catch {
      loadPage(page);
    }
  };

  const totalPages = Math.max(Number(pagination.totalPages) || 1, 1);
  const total = Number(pagination.total) || 0;
  const pageList = buildPageList(page, totalPages);

  return (
    <div className="notif notif-page-wrap">
      <header className="notif-page-head">
        <div className="notif-page-head-row">
          <div>
            <h1 className="notif-page-title">Thông báo</h1>
            <p className="notif-page-sub">
              Tất cả hoạt động về giao dịch, tin nhắn, đánh giá và điểm thưởng của bạn.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end" }}>
            <span className="notif-page-unread-chip">
              <b>{unreadCount}</b> chưa đọc
            </span>
            <button
              type="button"
              className="notif-page-markall"
              onClick={handleMarkAll}
              disabled={unreadCount === 0}
            >
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        </div>
      </header>

      {error ? <div className="notif-page-error">{error}</div> : null}

      <section className="notif-page-card">
        {loading ? (
          <div className="notif-page-state">
            <span className="notif-page-spinner" />
            <span>Đang tải thông báo...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="notif-page-state">
            <BellOffIcon />
            <p>Chưa có thông báo nào</p>
            <span>Khi có hoạt động mới, thông báo sẽ xuất hiện tại đây.</span>
          </div>
        ) : (
          <>
            <div className="notif-page-list">
              {items.map((notification) => (
                <NotificationItem
                  key={notification.notification_id}
                  notification={notification}
                  onSelect={handleSelect}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav className="notif-pager" aria-label="Phân trang thông báo">
                <button
                  type="button"
                  className="notif-pager-btn"
                  onClick={() => setPage((current) => Math.max(current - 1, 1))}
                  disabled={page <= 1}
                  aria-label="Trang trước"
                >
                  ‹
                </button>

                {pageList.map((entry) =>
                  typeof entry === "number" ? (
                    <button
                      key={entry}
                      type="button"
                      className={`notif-pager-btn${entry === page ? " is-active" : ""}`}
                      onClick={() => setPage(entry)}
                      aria-current={entry === page ? "page" : undefined}
                    >
                      {entry}
                    </button>
                  ) : (
                    <span key={entry} className="notif-pager-ellipsis">
                      …
                    </span>
                  ),
                )}

                <button
                  type="button"
                  className="notif-pager-btn"
                  onClick={() => setPage((current) => Math.min(current + 1, totalPages))}
                  disabled={page >= totalPages}
                  aria-label="Trang sau"
                >
                  ›
                </button>

                <p className="notif-pager-info">
                  Trang {page}/{totalPages} · {total} thông báo
                </p>
              </nav>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

export default NotificationsPage;
