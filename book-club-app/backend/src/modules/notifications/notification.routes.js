import { Router } from "express";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  getMyNotificationSummary,
  getMyUnreadCount,
  listMyNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  pingNotifications,
} from "./notification.controller.js";

const router = Router();

router.get("/ping", pingNotifications);
router.get("/", protect, listMyNotifications);
router.get("/summary", protect, getMyNotificationSummary);
router.get("/unread-count", protect, getMyUnreadCount);
router.put("/read-all", protect, markAllNotificationsRead);
router.put("/:notificationId/read", protect, markNotificationRead);

export default router;
