import api, { apiPath } from "./api.js";
import { getFriendlyApiError } from "../utils/apiError.js";

function unwrapResponse(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export function normalizeRating(rawRating = {}) {
  const ratedMember = rawRating.ratedMember || rawRating.rated_member || rawRating.member || {};
  const rater = rawRating.rater || rawRating.raterMember || rawRating.rater_member || {};

  return {
    rating_id: firstDefined(rawRating.rating_id, rawRating.ratingId, rawRating.id, ""),
    transaction_id: firstDefined(rawRating.transaction_id, rawRating.transactionId, ""),
    rated_member_id: firstDefined(rawRating.rated_member_id, rawRating.ratedMemberId, ratedMember.member_id, ratedMember.id, ""),
    rater_id: firstDefined(rawRating.rater_id, rawRating.raterId, rater.member_id, rater.id, ""),
    ratedMember,
    rater,
    score: Number(firstDefined(rawRating.score, rawRating.rating, 0)),
    comment: firstDefined(rawRating.comment, rawRating.content, ""),
    created_at: firstDefined(rawRating.created_at, rawRating.createdAt, ""),
    raw: rawRating,
  };
}

function unwrapRatingList(response) {
  const payload = unwrapResponse(response);
  const items = payload?.items ?? payload?.ratings ?? payload?.data ?? payload;
  return Array.isArray(items) ? items.map(normalizeRating) : [];
}

export async function createRating(payload = {}) {
  const response = await api.post(apiPath("/ratings"), {
    transaction_id: payload.transaction_id ?? payload.transactionId,
    rated_member_id: payload.rated_member_id ?? payload.ratedMemberId,
    score: Number(payload.score),
    comment: payload.comment ?? "",
  });

  const data = unwrapResponse(response);
  return normalizeRating(data?.rating || data);
}

export async function getMemberRatings(memberId) {
  const response = await api.get(apiPath(`/ratings/member/${memberId}`));
  return unwrapRatingList(response);
}

export async function getMyReceivedRatings() {
  const response = await api.get(apiPath("/ratings/my-received"));
  return unwrapRatingList(response);
}

export async function getMyGivenRatings() {
  const response = await api.get(apiPath("/ratings/my-given"));
  return unwrapRatingList(response);
}

export function getRatingErrorMessage(error, fallback = "Không thể gửi đánh giá. Vui lòng thử lại.") {
  const serverMessage = String(error?.response?.data?.message || error?.response?.data?.error || "").toLowerCase();

  if (error?.response?.status === 409 || serverMessage.includes("duplicate") || serverMessage.includes("already")) {
    return "Bạn đã đánh giá người này trong giao dịch này.";
  }

  return getFriendlyApiError(error, "ratings") || fallback;
}
