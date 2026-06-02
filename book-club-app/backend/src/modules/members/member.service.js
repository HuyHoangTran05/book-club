import bcrypt from "bcrypt";
import { Member, PointHistory } from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const allowedProfileFields = ["full_name", "phone", "address"];
const MIN_PASSWORD_LENGTH = 8;

const sanitizeMember = (member) => {
  if (!member) {
    return null;
  }

  const plainMember = typeof member.get === "function"
    ? member.get({ plain: true })
    : { ...member };

  delete plainMember.password_hash;
  delete plainMember.password;

  return plainMember;
};

const normalizeOptionalString = (value, fieldName) => {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    throw createHttpError(`${fieldName} must be a string`, 400);
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
};

const getProfile = async (memberId) => {
  const member = await Member.findByPk(memberId);

  if (!member) {
    throw createHttpError("Member not found", 404);
  }

  return sanitizeMember(member);
};

const updateProfile = async (memberId, payload) => {
  const member = await Member.findByPk(memberId);

  if (!member) {
    throw createHttpError("Member not found", 404);
  }

  const updateData = {};

  for (const field of allowedProfileFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      updateData[field] = normalizeOptionalString(payload[field], field);
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw createHttpError("No valid profile fields to update", 400);
  }

  if (updateData.full_name !== undefined && !updateData.full_name) {
    throw createHttpError("full_name cannot be empty", 400);
  }

  await member.update(updateData);

  return sanitizeMember(member);
};

const changePassword = async (memberId, payload = {}) => {
  const currentPassword = payload.current_password ?? payload.currentPassword;
  const newPassword = payload.new_password ?? payload.newPassword;

  if (!currentPassword) {
    throw createHttpError("current_password is required", 400);
  }

  if (!newPassword) {
    throw createHttpError("new_password is required", 400);
  }

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    throw createHttpError("Passwords must be strings", 400);
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    throw createHttpError(`new_password must be at least ${MIN_PASSWORD_LENGTH} characters`, 400);
  }

  const member = await Member.unscoped().findByPk(memberId);

  if (!member) {
    throw createHttpError("Member not found", 404);
  }

  const passwordMatches = await bcrypt.compare(currentPassword, member.password_hash);

  if (!passwordMatches) {
    throw createHttpError("Current password is incorrect", 400);
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await member.update({
    password_hash: passwordHash,
  });
};

const getPointHistory = async (memberId, { page = 1, limit = 20 } = {}) => {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const offset = (normalizedPage - 1) * normalizedLimit;

  const { rows, count } = await PointHistory.findAndCountAll({
    where: { member_id: memberId },
    order: [["created_at", "DESC"]],
    limit: normalizedLimit,
    offset,
  });

  return {
    items: rows,
    pagination: {
      page: normalizedPage,
      limit: normalizedLimit,
      total: count,
      totalPages: Math.ceil(count / normalizedLimit),
    },
  };
};

const memberService = {
  getProfile,
  updateProfile,
  changePassword,
  getPointHistory,
};

export default memberService;
