import { successResponse } from "../../utils/response.js";
import asyncHandler from "../../utils/asyncHandler.js";
import pointService from "./point.service.js";

export const pingPoints = (req, res) => {
  successResponse(res, null, "points module is ready");
};

export const listMyPointHistory = asyncHandler(async (req, res) => {
  const pointHistories = await pointService.getPointHistory(req.user.member_id);
  successResponse(res, pointHistories, "Lấy lịch sử điểm thành công");
});
