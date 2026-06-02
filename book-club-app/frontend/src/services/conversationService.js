import api, { apiPath } from "./api.js";
import { getFriendlyApiError } from "../utils/apiError.js";

function unwrapResponse(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function normalizeId(value) {
  return value === undefined || value === null || value === "" ? "" : String(value);
}

function isDevelopment() {
  return import.meta.env?.DEV;
}

function logDevelopment(label, value) {
  if (isDevelopment()) {
    console.log(label, value);
  }
}

export function getConversationId(conversation = {}) {
  return normalizeId(firstDefined(conversation.conversation_id, conversation.conversationId, conversation.id, ""));
}

function normalizePerson(rawPerson = {}) {
  return {
    member_id: normalizeId(firstDefined(rawPerson.member_id, rawPerson.memberId, rawPerson.id, "")),
    full_name: firstDefined(rawPerson.full_name, rawPerson.fullName, rawPerson.name, ""),
    email: rawPerson.email ?? "",
    phone: firstDefined(rawPerson.phone, rawPerson.phone_number, rawPerson.phoneNumber, ""),
    raw: rawPerson,
  };
}

function pickLastMessage(rawConversation = {}) {
  const latestMessage =
    rawConversation.lastMessage ||
    rawConversation.last_message ||
    rawConversation.latestMessage ||
    rawConversation.latest_message ||
    rawConversation.messages?.[0] ||
    rawConversation.conversationMessages?.[0] ||
    rawConversation.conversation_messages?.[0] ||
    null;

  if (!latestMessage) {
    return null;
  }

  if (typeof latestMessage === "string") {
    return {
      content: latestMessage,
      created_at: "",
      raw: latestMessage,
    };
  }

  return {
    content: firstDefined(latestMessage.content, latestMessage.message, latestMessage.body, latestMessage.text, ""),
    created_at: firstDefined(latestMessage.created_at, latestMessage.createdAt, latestMessage.sent_at, latestMessage.sentAt, ""),
    raw: latestMessage,
  };
}

export function normalizeConversation(rawConversation = {}, currentUserId = "") {
  const normalizedCurrentUserId = normalizeId(currentUserId);
  const member1 = normalizePerson(rawConversation.member1 || rawConversation.member_1 || {});
  const member2 = normalizePerson(rawConversation.member2 || rawConversation.member_2 || {});
  const member1Id = normalizeId(firstDefined(rawConversation.member1_id, rawConversation.member1Id, member1.member_id, ""));
  const member2Id = normalizeId(firstDefined(rawConversation.member2_id, rawConversation.member2Id, member2.member_id, ""));
  const fallbackOtherParticipant =
    rawConversation.otherParticipant ||
    rawConversation.other_participant ||
    rawConversation.participant ||
    rawConversation.member ||
    rawConversation.user ||
    {};
  let otherUser = normalizePerson(fallbackOtherParticipant);

  if (normalizedCurrentUserId && normalizedCurrentUserId === member1Id) {
    otherUser = member2;
  } else if (normalizedCurrentUserId && normalizedCurrentUserId === member2Id) {
    otherUser = member1;
  } else if (member2.member_id || member2.full_name || member2.email || member2.phone) {
    otherUser = member2;
  } else if (member1.member_id || member1.full_name || member1.email || member1.phone) {
    otherUser = member1;
  }

  const lastMessage = pickLastMessage(rawConversation);

  return {
    conversation_id: getConversationId(rawConversation),
    member1_id: member1Id,
    member2_id: member2Id,
    member1,
    member2,
    otherUser,
    otherParticipant: otherUser,
    lastMessage,
    last_message: lastMessage?.content || "",
    created_at: firstDefined(rawConversation.created_at, rawConversation.createdAt, ""),
    updated_at: firstDefined(rawConversation.updated_at, rawConversation.updatedAt, rawConversation.created_at, rawConversation.createdAt, ""),
    raw: rawConversation,
  };
}

export function normalizeMessage(rawMessage = {}) {
  const sender = rawMessage.sender || rawMessage.member || rawMessage.user || {};

  return {
    message_id: normalizeId(firstDefined(rawMessage.message_id, rawMessage.messageId, rawMessage.id, "")),
    conversation_id: normalizeId(firstDefined(rawMessage.conversation_id, rawMessage.conversationId, "")),
    sender_id: normalizeId(
      firstDefined(rawMessage.sender_id, rawMessage.senderId, rawMessage.member_id, rawMessage.memberId, rawMessage.user_id, rawMessage.userId, sender.member_id, sender.memberId, sender.id, "")
    ),
    sender: normalizePerson(sender),
    content: firstDefined(rawMessage.content, rawMessage.message, rawMessage.body, rawMessage.text, ""),
    created_at: firstDefined(rawMessage.created_at, rawMessage.createdAt, rawMessage.sent_at, rawMessage.sentAt, ""),
    raw: rawMessage,
  };
}

function unwrapConversation(response, currentUserId = "") {
  const payload = unwrapResponse(response);
  return normalizeConversation(payload?.conversation || payload, currentUserId);
}

function unwrapConversationList(response, currentUserId = "") {
  const payload = unwrapResponse(response);
  const items = payload?.items ?? payload?.conversations ?? payload?.data ?? payload;
  const rawConversations = Array.isArray(items) ? items : [];
  const normalizedConversations = rawConversations.map((conversation) => normalizeConversation(conversation, currentUserId));

  logDevelopment("Current user id:", normalizeId(currentUserId));
  logDevelopment("Raw conversations:", rawConversations);
  logDevelopment("Normalized conversations:", normalizedConversations);

  return normalizedConversations;
}

function unwrapMessageList(response) {
  const payload = unwrapResponse(response);
  const items = payload?.items ?? payload?.messages ?? response?.data?.messages ?? response?.data?.items ?? payload?.data ?? payload;
  const rawMessages = Array.isArray(items) ? items : [];
  const normalizedMessages = rawMessages.map(normalizeMessage);

  logDevelopment("Raw messages:", rawMessages);
  logDevelopment("Normalized messages:", normalizedMessages);

  return normalizedMessages;
}

export async function createOrGetConversation(userId, currentUserId = "") {
  const response = await api.post(apiPath(`/conversations/${userId}`));
  return unwrapConversation(response, currentUserId);
}

export async function getConversations(currentUserId = "") {
  const response = await api.get(apiPath("/conversations"));
  return unwrapConversationList(response, currentUserId);
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
