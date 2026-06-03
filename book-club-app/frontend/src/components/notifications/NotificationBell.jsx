import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { classNames } from "../../utils/classNames.js";
import { notificationRoute } from "../../utils/notificationDisplay.js";
import {
  getNotificationSummary,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notificationService.js";
import { BellIcon, BellOffIcon } from "./NotificationIcons.jsx";
import NotificationItem from "./NotificationItem.jsx";
import "./notifications.css";

const POLL_INTERVAL_MS = 30000;

function NotificationBell({ className = "" }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const containerRef = useRef(null);

  const loadSummary = useCallback(async () => {
    try {
      const summary = await getNotificationSummary();
      setItems(Array.isArray(summary?.items) ? summary.items : []);
      setUnreadCount(Number(summary?.unreadCount) || 0);
    } catch (error) {
      // Don't disrupt the UI, but log so issues (e.g. missing notifications
      // table → run `npm run migrate`) are diagnosable from the console.
      const message = error?.response?.data?.message || error?.message;
      if (message) {
        console.warn("[notifications] Không tải được thông báo:", message);
      }
    } finally {
      setLoading(false);
      setHasLoadedOnce(true);
    }
  }, []);

  // Initial load + lightweight polling so the badge stays fresh.
  useEffect(() => {
    if (!isAuthenticated) {
      return undefined;
    }

    loadSummary();
    const timer = setInterval(loadSummary, POLL_INTERVAL_MS);

    const handleFocus = () => loadSummary();
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isAuthenticated, loadSummary]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handlePointer = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  if (!isAuthenticated) {
    return null;
  }

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        loadSummary();
      }
      return next;
    });
  };

  const handleSelect = async (notification) => {
    setOpen(false);

    if (!notification.is_read) {
      setItems((prev) =>
        prev.map((item) =>
          item.notification_id === notification.notification_id
            ? { ...item, is_read: true }
            : item,
        ),
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));

      try {
        await markNotificationRead(notification.notification_id);
      } catch {
        loadSummary();
      }
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
      loadSummary();
    }
  };

  const handleViewAll = () => {
    setOpen(false);
    navigate("/notifications");
  };

  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <div className={classNames("notif notif-bell", className)} ref={containerRef}>
      <button
        type="button"
        className={classNames(
          "notif-bell-btn",
          open && "is-open",
          unreadCount > 0 && "has-unread",
        )}
        onClick={toggleOpen}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={
          unreadCount > 0
            ? `Thông báo, ${unreadCount} chưa đọc`
            : "Thông báo"
        }
      >
        <BellIcon />
        {unreadCount > 0 ? <span className="notif-dot" aria-hidden="true" /> : null}
      </button>

      {open ? (
        <div className="notif-panel" role="dialog" aria-label="Danh sách thông báo">
          <div className="notif-panel-head">
            <span className="notif-panel-title">
              Thông báo
              {unreadCount > 0 ? <span className="notif-count-chip">{badgeLabel}</span> : null}
            </span>
            <button
              type="button"
              className="notif-markall"
              onClick={handleMarkAll}
              disabled={unreadCount === 0}
            >
              Đánh dấu đã đọc
            </button>
          </div>

          {loading && !hasLoadedOnce ? (
            <div className="notif-loading">
              <span className="notif-spinner" />
            </div>
          ) : items.length === 0 ? (
            <div className="notif-empty">
              <BellOffIcon />
              <p>Chưa có thông báo nào</p>
              <span>Các hoạt động mới sẽ hiện ở đây.</span>
            </div>
          ) : (
            <div className="notif-list notif-list-scroll">
              {items.map((notification) => (
                <NotificationItem
                  key={notification.notification_id}
                  notification={notification}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )}

          <div className="notif-foot">
            <button type="button" className="notif-foot-btn" onClick={handleViewAll}>
              Xem tất cả
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default NotificationBell;
