import { Member, PointHistory } from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const allowedProfileFields = ["full_name", "phone", "address"];

const getProfile = async (memberId) => {
  const member = await Member.findByPk(memberId);

  if (!member) {
    throw createHttpError("Member not found", 404);
  }

  return member;
};

const updateProfile = async (memberId, payload) => {
  const member = await Member.findByPk(memberId);

  if (!member) {
    throw createHttpError("Member not found", 404);
  }

  const updateData = {};

  for (const field of allowedProfileFields) {
    if (Object.prototype.hasOwnProperty.call(payload, field)) {
      updateData[field] = payload[field] || null;
    }
  }

  if (Object.keys(updateData).length === 0) {
    throw createHttpError("No valid profile fields to update", 400);
  }

  if (updateData.full_name !== undefined && !updateData.full_name) {
    throw createHttpError("full_name cannot be empty", 400);
  }

  await member.update(updateData);

  return member;
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
  getPointHistory,
};

export default memberService;
