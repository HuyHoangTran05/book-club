import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import notificationService from "./notification.service.js";

export const pingNotifications = (req, res) => {
  successResponse(res, null, "notifications module is ready");
};

export const listMyNotifications = asyncHandler(async (req, res) => {
  const result = await notificationService.listForMember(req.user.member_id, req.query);
  successResponse(res, result, "Lấy danh sách thông báo thành công");
});

export const getMyNotificationSummary = asyncHandler(async (req, res) => {
  const summary = await notificationService.getSummary(req.user.member_id);
  successResponse(res, summary, "Lấy thông báo mới nhất thành công");
});

export const getMyUnreadCount = asyncHandler(async (req, res) => {
  const result = await notificationService.getUnreadCount(req.user.member_id);
  successResponse(res, result, "Lấy số thông báo chưa đọc thành công");
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markRead(
    req.user.member_id,
    req.params.notificationId,
  );
  successResponse(res, notification, "Đã đánh dấu thông báo là đã đọc");
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllRead(req.user.member_id);
  successResponse(res, result, "Đã đánh dấu tất cả thông báo là đã đọc");
});
