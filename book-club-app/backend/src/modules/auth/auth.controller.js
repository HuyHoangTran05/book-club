import { successResponse } from "../../utils/response.js";
import asyncHandler from "../../utils/asyncHandler.js";
import authService from "./auth.service.js";

export const pingAuth = (req, res) => {
  successResponse(res, null, "auth module is ready");
};

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  successResponse(res, result, "Register successfully", 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  successResponse(res, result, "Login successfully");
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.member_id);
  successResponse(res, user, "Current member profile");
});
