import api, { apiPath } from "./api.js";

function unwrap(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

export function getNotificationErrorMessage(error, fallback = "Không tải được thông báo. Vui lòng thử lại.") {
  if (!error?.response) {
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra backend.";
  }

  return error.response.data?.message || fallback;
}

// 5 most recent + unread count, for the bell dropdown.
export async function getNotificationSummary() {
  const response = await api.get(apiPath("/notifications/summary"));
  return unwrap(response);
}

// Paginated list (10 per page) for the dedicated page.
export async function getNotifications({ page = 1, limit = 10 } = {}) {
  const response = await api.get(apiPath("/notifications"), {
    params: { page, limit },
  });
  return unwrap(response);
}

export async function getUnreadCount() {
  const response = await api.get(apiPath("/notifications/unread-count"));
  return unwrap(response);
}

export async function markNotificationRead(notificationId) {
  const response = await api.put(apiPath(`/notifications/${notificationId}/read`));
  return unwrap(response);
}

export async function markAllNotificationsRead() {
  const response = await api.put(apiPath("/notifications/read-all"));
  return unwrap(response);
}
