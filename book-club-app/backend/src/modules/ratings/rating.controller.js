import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import ratingService from "./rating.service.js";

export const createRating = asyncHandler(async (req, res) => {
  const rating = await ratingService.createRating(req.user.member_id, req.body);
  successResponse(res, rating, "Đánh giá thành công", 201);
});

export const getMemberRatings = asyncHandler(async (req, res) => {
  const ratings = await ratingService.getMemberRatings(req.params.memberId);
  successResponse(res, ratings, "Lấy đánh giá thành viên thành công");
});

export const getMyReceivedRatings = asyncHandler(async (req, res) => {
  const ratings = await ratingService.getMyReceivedRatings(req.user.member_id);
  successResponse(res, ratings, "Lấy đánh giá của tôi thành công");
});

export const getMyGivenRatings = asyncHandler(async (req, res) => {
  const ratings = await ratingService.getMyGivenRatings(req.user.member_id);
  successResponse(res, ratings, "Lấy đánh giá tôi đã gửi thành công");
});
