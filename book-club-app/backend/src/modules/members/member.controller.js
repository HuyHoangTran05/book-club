import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import memberService from "./member.service.js";

export const pingMembers = (req, res) => {
  successResponse(res, null, "members module is ready");
};

export const getMyProfile = asyncHandler(async (req, res) => {
  const member = await memberService.getProfile(req.user.member_id);
  successResponse(res, member, "Member profile");
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const member = await memberService.updateProfile(req.user.member_id, req.body);
  successResponse(res, member, "Member profile updated");
});

export const getMyPointHistory = asyncHandler(async (req, res) => {
  const history = await memberService.getPointHistory(req.user.member_id, req.query);
  successResponse(res, history, "Member point history");
});
