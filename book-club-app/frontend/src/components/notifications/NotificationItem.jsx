import { classNames } from "../../utils/classNames.js";
import { formatRelativeTime, notificationMeta } from "../../utils/notificationDisplay.js";
import { NotificationTypeIcon } from "./NotificationIcons.jsx";

/**
 * A single notification row, shared by the bell dropdown and the full page.
 * Read items appear dimmed; unread items get a tinted background, an accent
 * bar, bolder text and a trailing dot.
 */
function NotificationItem({ notification, onSelect, as = "button" }) {
  const isRead = Boolean(notification.is_read);
  const meta = notificationMeta(notification.type);
  const Element = as === "li" ? "div" : "button";

  return (
    <Element
      type={as === "button" ? "button" : undefined}
      className={classNames("notif-item", isRead ? "is-read" : "is-unread")}
      onClick={onSelect ? () => onSelect(notification) : undefined}
    >
      <span className={classNames("notif-icon", `accent-${meta.accent}`)}>
        <NotificationTypeIcon type={notification.type} />
      </span>

      <span className="notif-body">
        <p className="notif-content">{notification.content}</p>
        <span className="notif-meta">
          <span className="notif-tag">{meta.label}</span>
          <span className="notif-dot-sep" aria-hidden="true" />
          <span>{formatRelativeTime(notification.created_at)}</span>
        </span>
      </span>

      {!isRead ? <span className="notif-unread-dot" aria-label="Chưa đọc" /> : null}
    </Element>
  );
}

export default NotificationItem;
