import { successResponse } from "../../utils/response.js";
import asyncHandler from "../../utils/asyncHandler.js";
import AuthService from "./auth.service.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

export const pingAuth = (req, res) => {
  successResponse(res, null, "auth module is ready");
};

export const register = asyncHandler(async (req, res) => {
  const { full_name, email, password, phone } = req.body;

  if (!full_name || !full_name.trim()) {
    throw createValidationError("full_name không được để trống");
  }

  if (!email || !EMAIL_PATTERN.test(email)) {
    throw createValidationError("Email không hợp lệ");
  }

  if (!password || password.length < 8) {
    throw createValidationError("Mật khẩu phải có ít nhất 8 ký tự");
  }

  const result = await AuthService.register({
    full_name: full_name.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone: phone?.trim(),
  });

  successResponse(res, result, "Đăng ký thành công", 201);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw createValidationError("Email và mật khẩu không được để trống");
  }

  const result = await AuthService.login(email.trim().toLowerCase(), password);

  successResponse(res, result, "Đăng nhập thành công");
});

export const getMe = asyncHandler(async (req, res) => {
  const memberId = req.user?.member_id;

  if (!memberId) {
    const error = new Error("Not authorized, token failed");
    error.statusCode = 401;
    throw error;
  }

  const user = await AuthService.getMe(memberId);

  successResponse(res, { user }, "Lấy thông tin người dùng thành công");
});
