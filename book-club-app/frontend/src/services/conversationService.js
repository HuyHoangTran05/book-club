import api, { apiPath } from "./api.js";
import { getFriendlyApiError } from "../utils/apiError.js";

function unwrapResponse(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export function getConversationId(conversation = {}) {
  return firstDefined(conversation.conversation_id, conversation.conversationId, conversation.id, "");
}

export function normalizeConversation(rawConversation = {}) {
  const otherParticipant =
    rawConversation.otherParticipant ||
    rawConversation.other_participant ||
    rawConversation.participant ||
    rawConversation.member ||
    rawConversation.user ||
    {};

  return {
    conversation_id: getConversationId(rawConversation),
    otherParticipant: {
      member_id: firstDefined(otherParticipant.member_id, otherParticipant.memberId, otherParticipant.id, ""),
      full_name: firstDefined(otherParticipant.full_name, otherParticipant.fullName, otherParticipant.name, ""),
      email: otherParticipant.email ?? "",
      phone: firstDefined(otherParticipant.phone, otherParticipant.phone_number, otherParticipant.phoneNumber, ""),
    },
    last_message: firstDefined(
      rawConversation.last_message,
      rawConversation.lastMessage,
      rawConversation.latestMessage?.content,
      rawConversation.latest_message?.content,
      ""
    ),
    updated_at: firstDefined(rawConversation.updated_at, rawConversation.updatedAt, rawConversation.created_at, rawConversation.createdAt, ""),
    raw: rawConversation,
  };
}

export function normalizeMessage(rawMessage = {}) {
  const sender = rawMessage.sender || rawMessage.member || rawMessage.user || {};

  return {
    message_id: firstDefined(rawMessage.message_id, rawMessage.messageId, rawMessage.id, ""),
    conversation_id: firstDefined(rawMessage.conversation_id, rawMessage.conversationId, ""),
    sender_id: firstDefined(rawMessage.sender_id, rawMessage.senderId, sender.member_id, sender.memberId, sender.id, ""),
    sender,
    content: firstDefined(rawMessage.content, rawMessage.message, rawMessage.body, ""),
    created_at: firstDefined(rawMessage.created_at, rawMessage.createdAt, ""),
    raw: rawMessage,
  };
}

function unwrapConversation(response) {
  const payload = unwrapResponse(response);
  return normalizeConversation(payload?.conversation || payload);
}

function unwrapConversationList(response) {
  const payload = unwrapResponse(response);
  const items = payload?.items ?? payload?.conversations ?? payload?.data ?? payload;
  return Array.isArray(items) ? items.map(normalizeConversation) : [];
}

function unwrapMessageList(response) {
  const payload = unwrapResponse(response);
  const items = payload?.items ?? payload?.messages ?? payload?.data ?? payload;
  return Array.isArray(items) ? items.map(normalizeMessage) : [];
}

export async function createOrGetConversation(userId) {
  const response = await api.post(apiPath(`/conversations/${userId}`));
  return unwrapConversation(response);
}

export async function getConversations() {
  const response = await api.get(apiPath("/conversations"));
  return unwrapConversationList(response);
}

export async function getConversationMessages(conversationId) {
  const response = await api.get(apiPath(`/conversations/${conversationId}/messages`));
  return unwrapMessageList(response);
}

export async function sendMessage(conversationId, payload = {}) {
  const response = await api.post(apiPath(`/conversations/${conversationId}/messages`), {
    content: payload.content ?? payload.message ?? "",
  });
  return normalizeMessage(unwrapResponse(response)?.message || unwrapResponse(response));
}

export function getConversationErrorMessage(error, fallback = "Không thể tải tin nhắn. Vui lòng thử lại.") {
  return getFriendlyApiError(error, "conversations") || fallback;
}
