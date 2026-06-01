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
