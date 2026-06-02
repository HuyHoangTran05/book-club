import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import delivererService from "./deliverer.service.js";

export const pingDeliverers = (_req, res) => {
  successResponse(res, null, "deliverers module is ready");
};

export const listDeliverers = asyncHandler(async (_req, res) => {
  const deliverers = await delivererService.listDeliverers();
  successResponse(res, deliverers, "Lấy danh sách người giao sách thành công");
});

export const registerDeliverer = asyncHandler(async (req, res) => {
  const profile = await delivererService.upsertMyProfile(req.user.member_id, req.body, {
    defaultActive: true,
  });
  successResponse(res, profile, "Đăng ký làm người giao sách thành công", 201);
});

export const getMyDelivererProfile = asyncHandler(async (req, res) => {
  const profile = await delivererService.getMyProfile(req.user.member_id);
  successResponse(res, profile, profile ? "Hồ sơ người giao sách của tôi" : "Bạn chưa đăng ký làm người giao sách");
});

export const updateMyDelivererProfile = asyncHandler(async (req, res) => {
  const profile = await delivererService.upsertMyProfile(req.user.member_id, req.body, {
    defaultActive: true,
    requireProfileFields: false,
  });
  successResponse(res, profile, "Cập nhật hồ sơ người giao sách thành công");
});
