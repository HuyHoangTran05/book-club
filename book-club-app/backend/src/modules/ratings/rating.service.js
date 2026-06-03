import { UniqueConstraintError } from "sequelize";
import {
  BookTransaction,
  Member,
  Rating,
} from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";
import notificationService from "../notifications/notification.service.js";

const MAX_COMMENT_LENGTH = 1000;

const memberAttributes = [
  "member_id",
  "full_name",
  "email",
  "phone",
  "point_balance",
  "role",
  "is_deliverer",
  "account_status",
  "created_at",
];

const ratingInclude = [
  {
    model: Member,
    as: "rater",
    attributes: memberAttributes,
  },
  {
    model: Member,
    as: "ratedMember",
    attributes: memberAttributes,
  },
  {
    model: BookTransaction,
    as: "transaction",
    attributes: [
      "transaction_id",
      "copy_id",
      "giver_id",
      "receiver_id",
      "deliverer_id",
      "transaction_type",
      "status",
      "completed_at",
      "created_at",
    ],
  },
];

const sanitizePlain = (record) => {
  if (!record) {
    return null;
  }

  return typeof record.get === "function"
    ? record.get({ plain: true })
    : { ...record };
};

const normalizeScore = (value) => {
  const score = Number(value);

  if (!Number.isInteger(score) || score < 1 || score > 5) {
    throw createHttpError("score must be an integer from 1 to 5", 400);
  }

  return score;
};

const normalizeComment = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    throw createHttpError("comment must be a string", 400);
  }

  const comment = value.trim();

  if (comment.length > MAX_COMMENT_LENGTH) {
    throw createHttpError(`comment must be at most ${MAX_COMMENT_LENGTH} characters`, 400);
  }

  return comment || null;
};

const getParticipantIds = (transaction = {}) => {
  return [
    transaction.giver_id,
    transaction.receiver_id,
    transaction.deliverer_id,
  ].filter(Boolean);
};

const assertTransactionParticipant = (transaction, memberId, message) => {
  if (!getParticipantIds(transaction).includes(memberId)) {
    throw createHttpError(message, 403);
  }
};

const getRatingById = async (ratingId) => {
  const rating = await Rating.findByPk(ratingId, {
    include: ratingInclude,
  });

  return sanitizePlain(rating);
};

const createRating = async (currentMemberId, payload = {}) => {
  const transactionId = payload.transaction_id ?? payload.transactionId;
  const ratedMemberId = payload.rated_member_id ?? payload.ratedMemberId;
  const score = normalizeScore(payload.score);
  const comment = normalizeComment(payload.comment);

  if (!transactionId) {
    throw createHttpError("transaction_id is required", 400);
  }

  if (!ratedMemberId) {
    throw createHttpError("rated_member_id is required", 400);
  }

  if (currentMemberId === ratedMemberId) {
    throw createHttpError("You cannot rate yourself", 400);
  }

  const [transaction, ratedMember] = await Promise.all([
    BookTransaction.findByPk(transactionId),
    Member.findByPk(ratedMemberId),
  ]);

  if (!transaction) {
    throw createHttpError("Transaction not found", 404);
  }

  if (!ratedMember) {
    throw createHttpError("Rated member not found", 404);
  }

  if (transaction.status !== "completed") {
    throw createHttpError("Only completed transactions can be rated", 400);
  }

  const plainTransaction = sanitizePlain(transaction);
  assertTransactionParticipant(
    plainTransaction,
    currentMemberId,
    "You are not allowed to rate this transaction",
  );
  assertTransactionParticipant(
    plainTransaction,
    ratedMemberId,
    "Rated member is not part of this transaction",
  );

  const existingRating = await Rating.findOne({
    where: {
      transaction_id: transactionId,
      rater_id: currentMemberId,
      rated_member_id: ratedMemberId,
    },
  });

  if (existingRating) {
    throw createHttpError("You have already rated this member for this transaction", 409);
  }

  try {
    const rating = await Rating.create({
      transaction_id: transactionId,
      rater_id: currentMemberId,
      rated_member_id: ratedMemberId,
      score,
      comment,
    });

    const created = await getRatingById(rating.rating_id);

    const raterName = created?.rater?.full_name ?? "Một thành viên";
    await notificationService.createNotification({
      member_id: ratedMemberId,
      type: "rating",
      reference_id: created?.rating_id ?? rating.rating_id,
      content: `${raterName} đã đánh giá bạn ${score}★ sau giao dịch.`,
    });

    return created;
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw createHttpError("You have already rated this member for this transaction", 409);
    }

    throw error;
  }
};

const buildRatingSummary = (ratings = []) => {
  const totalRatings = ratings.length;
  const averageScore = totalRatings === 0
    ? 0
    : Number((ratings.reduce((total, rating) => total + Number(rating.score), 0) / totalRatings).toFixed(2));

  return {
    average_score: averageScore,
    total_ratings: totalRatings,
  };
};

const getMemberRatings = async (memberId) => {
  const member = await Member.findByPk(memberId, {
    attributes: memberAttributes,
  });

  if (!member) {
    throw createHttpError("Member not found", 404);
  }

  const ratings = await Rating.findAll({
    where: {
      rated_member_id: memberId,
    },
    include: ratingInclude,
    order: [["created_at", "DESC"]],
  });
  const ratingItems = ratings.map(sanitizePlain);

  return {
    member: sanitizePlain(member),
    summary: buildRatingSummary(ratingItems),
    ratings: ratingItems,
  };
};

const getMyReceivedRatings = async (memberId) => {
  return getMemberRatings(memberId);
};

const getMyGivenRatings = async (memberId) => {
  const ratings = await Rating.findAll({
    where: {
      rater_id: memberId,
    },
    include: ratingInclude,
    order: [["created_at", "DESC"]],
  });

  return ratings.map(sanitizePlain);
};

const ratingService = {
  createRating,
  getMemberRatings,
  getMyReceivedRatings,
  getMyGivenRatings,
};

export default ratingService;
