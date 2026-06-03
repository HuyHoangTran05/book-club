// Shared display helpers for notifications (used by the bell dropdown and the
// dedicated notifications page) so both stay perfectly consistent.

export function formatRelativeTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 45) {
    return "Vừa xong";
  }
  if (diffMin < 60) {
    return `${diffMin} phút trước`;
  }
  if (diffHour < 24) {
    return `${diffHour} giờ trước`;
  }
  if (diffDay === 1) {
    return "Hôm qua";
  }
  if (diffDay < 7) {
    return `${diffDay} ngày trước`;
  }

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Where clicking a notification should take the user, based on its type.
export function notificationRoute(type) {
  switch (type) {
    case "transaction":
      return "/transactions";
    case "message":
      return "/conversations";
    case "rating":
      return "/ratings";
    case "point":
      return "/points/history";
    case "book":
      return "/my-books";
    default:
      return "/notifications";
  }
}

// Visual identity per type: a label and an accent class used for the icon chip.
export function notificationMeta(type) {
  switch (type) {
    case "transaction":
      return { label: "Giao dịch", accent: "transaction" };
    case "message":
      return { label: "Tin nhắn", accent: "message" };
    case "rating":
      return { label: "Đánh giá", accent: "rating" };
    case "point":
      return { label: "Điểm thưởng", accent: "point" };
    case "book":
      return { label: "Sách", accent: "book" };
    default:
      return { label: "Hệ thống", accent: "system" };
  }
}
