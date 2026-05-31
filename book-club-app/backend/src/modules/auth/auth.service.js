import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
<<<<<<< HEAD
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
=======
import { sequelize, Member, PointHistory } from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const sanitizeMember = (member) => {
  const plain = member.get({ plain: true });
  delete plain.password_hash;
  return plain;
};

const signToken = (member) => {
  return jwt.sign(
    {
      member_id: member.member_id,
      email: member.email,
      role: member.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
};

const register = async ({ full_name, email, password, phone, address }) => {
  if (!full_name || !email || !password) {
    throw createHttpError("full_name, email, and password are required", 400);
  }

  if (password.length < 8) {
    throw createHttpError("Password must be at least 8 characters", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingMember = await Member.unscoped().findOne({
    where: { email: normalizedEmail },
  });

  if (existingMember) {
    throw createHttpError("Email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const member = await sequelize.transaction(async (transaction) => {
    const createdMember = await Member.create(
      {
        full_name: full_name.trim(),
        email: normalizedEmail,
        password_hash: passwordHash,
        phone: phone || null,
        address: address || null,
        point_balance: 20,
      },
      { transaction },
    );

    await PointHistory.create(
      {
        member_id: createdMember.member_id,
        transaction_id: null,
        point_change: 20,
        reason: "initial_register",
      },
      { transaction },
    );

    return createdMember;
  });

  return {
    token: signToken(member),
    member: sanitizeMember(member),
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw createHttpError("email and password are required", 400);
  }

  const member = await Member.unscoped().findOne({
    where: { email: email.trim().toLowerCase() },
  });

  if (!member) {
    throw createHttpError("Invalid email or password", 401);
  }

  if (member.account_status !== "active") {
    throw createHttpError("Account is not active", 403);
  }

  const passwordMatches = await bcrypt.compare(password, member.password_hash);

  if (!passwordMatches) {
    throw createHttpError("Invalid email or password", 401);
  }

  await member.update({ last_login_at: new Date() });

  return {
    token: signToken(member),
    member: sanitizeMember(member),
  };
};

const getCurrentMember = async (memberId) => {
  const member = await Member.findByPk(memberId);

  if (!member) {
    throw createHttpError("Member not found", 404);
  }

  return member;
>>>>>>> origin/main
};

const authService = {
  register,
  login,
<<<<<<< HEAD
  getMe,
  generateToken,
  sanitizeUser,
=======
  getCurrentMember,
>>>>>>> origin/main
};

export default authService;
