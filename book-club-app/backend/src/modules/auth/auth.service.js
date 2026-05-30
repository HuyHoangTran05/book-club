import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const MEMBER_MODEL_NOT_READY_MESSAGE = "Member model is not ready";
const DEFAULT_MEMBER_ROLE = "member";
const DEFAULT_POINT_BALANCE = 20;
const ACTIVE_ACCOUNT_STATUS = "active";

let cachedMemberModel;
let memberModelLoaded = false;

const createHttpError = (message, statusCode = 500, errors = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (errors) {
    error.errors = errors;
  }
  return error;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const getMemberModel = async () => {
  if (memberModelLoaded) {
    return cachedMemberModel;
  }

  memberModelLoaded = true;

  try {
    // TODO: Import Member model after Person 2 completes database setup.
    // Expected export shape: backend/src/models/index.js exports named `Member`.
    const models = await import("../../models/index.js");
    cachedMemberModel = models.Member || models.default?.Member || null;
  } catch (error) {
    if (error.code !== "ERR_MODULE_NOT_FOUND") {
      throw error;
    }

    cachedMemberModel = null;
  }

  return cachedMemberModel;
};

const ensureMemberModelReady = async () => {
  const Member = await getMemberModel();

  if (!Member) {
    throw createHttpError(
      `${MEMBER_MODEL_NOT_READY_MESSAGE}. Export Member from src/models/index.js when database setup is completed.`,
      501,
    );
  }

  return Member;
};

const validateRegisterDto = (dto) => {
  const errors = {};

  if (!dto.full_name?.trim()) {
    errors.full_name = "full_name is required";
  }

  if (!dto.email?.trim()) {
    errors.email = "email is required";
  }

  if (!dto.password?.trim()) {
    errors.password = "password is required";
  } else if (dto.password.length < 6) {
    errors.password = "password must be at least 6 characters";
  }

  if (Object.keys(errors).length > 0) {
    throw createHttpError("Validation failed", 400, errors);
  }
};

const findMemberByEmail = async (Member, email) => {
  return Member.findOne({
    where: {
      email,
    },
  });
};

const findMemberById = async (Member, memberId) => {
  return Member.findByPk(memberId);
};

const sanitizeUser = (user) => {
  if (!user) {
    return null;
  }

  const plainUser = typeof user.get === "function" ? user.get({ plain: true }) : { ...user };
  delete plainUser.password_hash;
  delete plainUser.password;

  return plainUser;
};

const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw createHttpError("JWT_SECRET is not configured", 500);
  }

  const plainUser = sanitizeUser(user);

  return jwt.sign(
    {
      member_id: plainUser.member_id,
      email: plainUser.email,
      role: plainUser.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    },
  );
};

const handleMemberPersistenceError = (error) => {
  if (
    error?.name === "SequelizeDatabaseError" &&
    /relation .*members.* does not exist/i.test(error.message)
  ) {
    throw createHttpError("Member table is not ready. Run database migrations after Person 2 completes them.", 501);
  }

  throw error;
};

const register = async (dto) => {
  validateRegisterDto(dto);

  const Member = await ensureMemberModelReady();
  const email = normalizeEmail(dto.email);

  try {
    const existingMember = await findMemberByEmail(Member, email);

    if (existingMember) {
      throw createHttpError("Email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const member = await Member.create({
      full_name: dto.full_name.trim(),
      email,
      password_hash: passwordHash,
      phone: dto.phone?.trim() || null,
      point_balance: DEFAULT_POINT_BALANCE,
      role: DEFAULT_MEMBER_ROLE,
      is_deliverer: false,
      account_status: ACTIVE_ACCOUNT_STATUS,
      email_verified: false,
    });

    return {
      token: generateToken(member),
      user: sanitizeUser(member),
    };
  } catch (error) {
    handleMemberPersistenceError(error);
  }
};

const login = async (emailInput, password) => {
  if (!emailInput?.trim() || !password?.trim()) {
    throw createHttpError("email and password are required", 400);
  }

  const Member = await ensureMemberModelReady();
  const email = normalizeEmail(emailInput);

  try {
    const member = await findMemberByEmail(Member, email);

    if (!member) {
      throw createHttpError("Invalid email or password", 401);
    }

    const plainMember = typeof member.get === "function" ? member.get({ plain: true }) : member;

    if (plainMember.account_status && plainMember.account_status !== ACTIVE_ACCOUNT_STATUS) {
      throw createHttpError("Account is not active", 403);
    }

    const passwordMatches = await bcrypt.compare(password, plainMember.password_hash || "");

    if (!passwordMatches) {
      throw createHttpError("Invalid email or password", 401);
    }

    return {
      token: generateToken(member),
      user: sanitizeUser(member),
    };
  } catch (error) {
    handleMemberPersistenceError(error);
  }
};

const getMe = async (memberId) => {
  if (!memberId) {
    throw createHttpError("member_id is required", 400);
  }

  const Member = await ensureMemberModelReady();

  try {
    const member = await findMemberById(Member, memberId);

    if (!member) {
      throw createHttpError("Member not found", 404);
    }

    return sanitizeUser(member);
  } catch (error) {
    handleMemberPersistenceError(error);
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
