import { Member, Notification } from "../../models/index.js";
import { NOTIFICATION_TYPES } from "../../models/notification.model.js";
import createHttpError from "../../utils/createHttpError.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;
const RECENT_LIMIT = 5;
const MAX_CONTENT_LENGTH = 500;

const handleDatabaseNotReady = (error) => {
  if (
    error?.name === "SequelizeDatabaseError" &&
    /relation .*notifications.* does not exist/i.test(error.message)
  ) {
    throw createHttpError(
      "Bảng thông báo chưa sẵn sàng. Vui lòng chạy migration trước.",
      501,
    );
  }

  throw error;
};

const withDatabaseGuard = async (callback) => {
  try {
    return await callback();
  } catch (error) {
    handleDatabaseNotReady(error);
  }
};

const sanitizeNotification = (notification) => {
  if (!notification) {
    return null;
  }

  return typeof notification.get === "function"
    ? notification.get({ plain: true })
    : { ...notification };
};

const normalizePage = (value) => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : DEFAULT_PAGE;
};

const normalizeLimit = (value) => {
  const limit = Number(value);

  if (!Number.isInteger(limit) || limit < 1) {
    return DEFAULT_LIMIT;
  }

  return Math.min(limit, MAX_LIMIT);
};

const normalizeContent = (value) => {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  return trimmed.length > MAX_CONTENT_LENGTH
    ? `${trimmed.slice(0, MAX_CONTENT_LENGTH - 1)}…`
    : trimmed;
};

/**
 * Best-effort notification creation. Notifications are a secondary concern:
 * a failure here must NEVER break or roll back the core business flow that
 * triggered it, so all errors are swallowed and logged.
 */
const createNotification = async ({ member_id, type, reference_id = null, content } = {}) => {
  try {
    if (!member_id) {
      return null;
    }

    const safeType = NOTIFICATION_TYPES.includes(type) ? type : "system";
    const safeContent = normalizeContent(content);

    if (!safeContent) {
      return null;
    }

    const notification = await Notification.create({
      member_id,
      type: safeType,
      reference_id: reference_id ?? null,
      content: safeContent,
    });

    return sanitizeNotification(notification);
  } catch (error) {
    console.error("Không thể tạo thông báo:", error?.message ?? error);
    return null;
  }
};

/**
 * Create several notifications at once (best-effort). Falsy entries are skipped
 * so callers can build the list conditionally without extra guards.
 */
const createNotifications = async (notifications = []) => {
  const valid = (Array.isArray(notifications) ? notifications : [])
    .filter((item) => item && item.member_id && normalizeContent(item.content))
    .map((item) => ({
      member_id: item.member_id,
      type: NOTIFICATION_TYPES.includes(item.type) ? item.type : "system",
      reference_id: item.reference_id ?? null,
      content: normalizeContent(item.content),
    }));

  if (valid.length === 0) {
    return [];
  }

  try {
    const created = await Notification.bulkCreate(valid);
    return created.map(sanitizeNotification);
  } catch (error) {
    console.error("Không thể tạo các thông báo:", error?.message ?? error);
    return [];
  }
};

/**
 * Fan a notification out to every admin (best-effort). Used for monitoring
 * events such as new members, new transactions, point changes and account
 * lock/delete actions.
 */
const notifyAdmins = async ({
  type = "system",
  reference_id = null,
  content,
  excludeMemberId = null,
} = {}) => {
  try {
    if (!normalizeContent(content)) {
      return [];
    }

    const admins = await Member.findAll({
      where: { role: "admin" },
      attributes: ["member_id"],
    });

    const notifications = admins
      .map((admin) => admin.member_id)
      .filter((memberId) => memberId && memberId !== excludeMemberId)
      .map((memberId) => ({ member_id: memberId, type, reference_id, content }));

    return await createNotifications(notifications);
  } catch (error) {
    console.error("Không thể tạo thông báo cho admin:", error?.message ?? error);
    return [];
  }
};

const listForMember = async (memberId, query = {}) => withDatabaseGuard(async () => {
  const page = normalizePage(query.page);
  const limit = normalizeLimit(query.limit);
  const offset = (page - 1) * limit;

  const { rows, count } = await Notification.findAndCountAll({
    where: { member_id: memberId },
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });

  const unreadCount = await Notification.count({
    where: { member_id: memberId, is_read: false },
  });

  return {
    items: rows.map(sanitizeNotification),
    unreadCount,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.max(Math.ceil(count / limit), 1),
    },
  };
});

const getSummary = async (memberId) => withDatabaseGuard(async () => {
  const [recent, unreadCount] = await Promise.all([
    Notification.findAll({
      where: { member_id: memberId },
      order: [["created_at", "DESC"]],
      limit: RECENT_LIMIT,
    }),
    Notification.count({ where: { member_id: memberId, is_read: false } }),
  ]);

  return {
    items: recent.map(sanitizeNotification),
    unreadCount,
  };
});

const getUnreadCount = async (memberId) => withDatabaseGuard(async () => {
  const unreadCount = await Notification.count({
    where: { member_id: memberId, is_read: false },
  });

  return { unreadCount };
});

const markRead = async (memberId, notificationId) => withDatabaseGuard(async () => {
  const notification = await Notification.findByPk(notificationId);

  if (!notification) {
    throw createHttpError("Không tìm thấy thông báo", 404);
  }

  if (notification.member_id !== memberId) {
    throw createHttpError("Bạn không có quyền thao tác với thông báo này", 403);
  }

  if (!notification.is_read) {
    await notification.update({ is_read: true });
  }

  return sanitizeNotification(notification);
});

const markAllRead = async (memberId) => withDatabaseGuard(async () => {
  const [updated] = await Notification.update(
    { is_read: true },
    { where: { member_id: memberId, is_read: false } },
  );

  return { updated, unreadCount: 0 };
});

const notificationService = {
  createNotification,
  createNotifications,
  notifyAdmins,
  listForMember,
  getSummary,
  getUnreadCount,
  markRead,
  markAllRead,
};

export default notificationService;
