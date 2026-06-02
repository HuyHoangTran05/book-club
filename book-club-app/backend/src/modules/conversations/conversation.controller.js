import asyncHandler from "../../utils/asyncHandler.js";
import { successResponse } from "../../utils/response.js";
import conversationService from "./conversation.service.js";

export const createOrGetConversation = asyncHandler(async (req, res) => {
  const conversation = await conversationService.createOrGetConversation(
    req.user.member_id,
    req.params.userId,
  );

  successResponse(res, conversation, "Tạo hoặc lấy cuộc trò chuyện thành công");
});

export const listMyConversations = asyncHandler(async (req, res) => {
  const conversations = await conversationService.listMyConversations(req.user.member_id);
  successResponse(res, conversations, "Lấy danh sách cuộc trò chuyện thành công");
});

export const listMessages = asyncHandler(async (req, res) => {
  const messages = await conversationService.listMessages(
    req.user.member_id,
    req.params.conversationId,
  );
  successResponse(res, messages, "Lấy tin nhắn thành công");
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = await conversationService.sendMessage(
    req.user.member_id,
    req.params.conversationId,
    req.body,
  );
  successResponse(res, message, "Gửi tin nhắn thành công", 201);
});
