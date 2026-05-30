import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
>>>>>>> 10c5cba45aeaa08cba10b118549187666f1717ac
};

export default authService;
