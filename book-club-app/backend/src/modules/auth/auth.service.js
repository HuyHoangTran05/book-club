import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Member } from "../../models/index.js";

const createHttpError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sanitizeUser = (user) => {
  const plainUser = typeof user.get === "function"
    ? user.get({ plain: true })
    : user;

  return {
    member_id: plainUser.member_id,
    full_name: plainUser.full_name,
    email: plainUser.email,
    phone: plainUser.phone,
    point_balance: plainUser.point_balance,
    role: plainUser.role,
    is_deliverer: plainUser.is_deliverer,
    account_status: plainUser.account_status,
    email_verified: plainUser.email_verified,
    created_at: plainUser.created_at || plainUser.createdAt,
  };
};

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw createHttpError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign(
    {
      member_id: user.member_id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

const register = async (dto) => {
  const existingMember = await Member.findOne({
    where: { email: dto.email },
  });

  if (existingMember) {
    throw createHttpError("Email đã được sử dụng", 409);
  }

  const passwordHash = await bcrypt.hash(dto.password, 10);

  const member = await Member.create({
    full_name: dto.full_name,
    email: dto.email,
    password_hash: passwordHash,
    phone: dto.phone || null,
    point_balance: 20,
    role: "member",
    account_status: "active",
    email_verified: false,
  });

  const user = sanitizeUser(member);
  const token = generateToken(user);

  return { user, token };
};

const login = async (email, password) => {
  const member = await Member.findOne({
    where: { email },
  });

  if (!member) {
    throw createHttpError("Email hoặc mật khẩu không đúng", 401);
  }

  if (member.account_status !== "active") {
    throw createHttpError("Tài khoản đã bị khóa hoặc không hoạt động", 403);
  }

  const isPasswordMatched = await bcrypt.compare(password, member.password_hash);

  if (!isPasswordMatched) {
    throw createHttpError("Email hoặc mật khẩu không đúng", 401);
  }

  const user = sanitizeUser(member);
  const token = generateToken(user);

  return { user, token };
};

const getMe = async (memberId) => {
  const member = await Member.findByPk(memberId);

  if (!member) {
    throw createHttpError("Không tìm thấy người dùng", 404);
  }

  return sanitizeUser(member);
};

const authService = {
  register,
  login,
  getMe,
  generateToken,
  sanitizeUser,
};

export default authService;
