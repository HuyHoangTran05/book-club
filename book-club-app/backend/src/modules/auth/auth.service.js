import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sequelize, Member, PointHistory } from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";
import notificationService from "../notifications/notification.service.js";

const INITIAL_POINT_BALANCE = 20;
const DEFAULT_ROLE = "member";
const ACTIVE_ACCOUNT_STATUS = "active";

const normalizeEmail = (email) => email.trim().toLowerCase();

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const plainUser = typeof user.get === "function" ? user.get({ plain: true }) : { ...user };

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
    created_at: plainUser.created_at,
  };
};

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw createHttpError("JWT_SECRET chưa được cấu hình", 500);
  }

  const sanitizedUser = sanitizeUser(user);

  return jwt.sign(
    {
      member_id: sanitizedUser.member_id,
      email: sanitizedUser.email,
      role: sanitizedUser.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

const handleMemberDatabaseError = (error) => {
  if (
    error?.name === "SequelizeDatabaseError" &&
    /relation .*members.* does not exist/i.test(error.message)
  ) {
    throw createHttpError("Bảng members chưa tồn tại. Vui lòng chạy migration trước.", 501);
  }

  throw error;
};

const validateRegisterDto = ({ full_name, email, password }) => {
  if (!full_name?.trim() || !email?.trim() || !password?.trim()) {
    throw createHttpError("full_name, email và password là bắt buộc", 400);
  }

  if (password.length < 8) {
    throw createHttpError("Mật khẩu phải có ít nhất 8 ký tự", 400);
  }
};

const register = async (dto) => {
  validateRegisterDto(dto);

  const normalizedEmail = normalizeEmail(dto.email);

  try {
    const existingMember = await Member.unscoped().findOne({
      where: { email: normalizedEmail },
    });

    if (existingMember) {
      throw createHttpError("Email đã được sử dụng", 409);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await sequelize.transaction(async (transaction) => {
      const createdMember = await Member.create(
        {
          full_name: dto.full_name.trim(),
          email: normalizedEmail,
          password_hash: passwordHash,
          phone: dto.phone?.trim() || null,
          point_balance: INITIAL_POINT_BALANCE,
          role: DEFAULT_ROLE,
          is_deliverer: false,
          account_status: ACTIVE_ACCOUNT_STATUS,
          email_verified: false,
        },
        { transaction },
      );

      await PointHistory.create(
        {
          member_id: createdMember.member_id,
          transaction_id: null,
          point_change: INITIAL_POINT_BALANCE,
          reason: "initial_register",
        },
        { transaction },
      );

      return createdMember;
    });

    await notificationService.createNotification({
      member_id: user.member_id,
      type: "point",
      content: `Chào mừng bạn đến với Cộng Đồng Sách! Bạn được tặng ${INITIAL_POINT_BALANCE} điểm khởi đầu.`,
    });

    await notificationService.notifyAdmins({
      type: "system",
      reference_id: user.member_id,
      content: `Thành viên mới "${user.full_name}" vừa đăng ký tài khoản và nhận ${INITIAL_POINT_BALANCE} điểm khởi đầu.`,
    });

    return {
      user: sanitizeUser(user),
      token: generateToken(user),
    };
  } catch (error) {
    handleMemberDatabaseError(error);
  }
};

const login = async (email, password) => {
  if (!email?.trim() || !password?.trim()) {
    throw createHttpError("email và password là bắt buộc", 400);
  }

  try {
    const member = await Member.unscoped().findOne({
      where: { email: normalizeEmail(email) },
    });

    if (!member) {
      throw createHttpError("Email hoặc mật khẩu không đúng", 401);
    }

    if (member.account_status !== ACTIVE_ACCOUNT_STATUS) {
      throw createHttpError("Tài khoản đã bị khóa hoặc không hoạt động", 403);
    }

    const passwordMatches = await bcrypt.compare(password, member.password_hash);

    if (!passwordMatches) {
      throw createHttpError("Email hoặc mật khẩu không đúng", 401);
    }

    await member.update({ last_login_at: new Date() });

    return {
      user: sanitizeUser(member),
      token: generateToken(member),
    };
  } catch (error) {
    handleMemberDatabaseError(error);
  }
};

const getMe = async (memberId) => {
  if (!memberId) {
    throw createHttpError("Token không hợp lệ: thiếu member_id", 401);
  }

  try {
    const member = await Member.findByPk(memberId);

    if (!member) {
      throw createHttpError("Không tìm thấy người dùng", 404);
    }

    return sanitizeUser(member);
  } catch (error) {
    handleMemberDatabaseError(error);
  }
};

const authService = {
  register,
  login,
  getMe,
  generateToken,
  sanitizeUser,
};

export default authService;
