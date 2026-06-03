import { Op, UniqueConstraintError } from "sequelize";
import {
  Conversation,
  Member,
  Message,
  sequelize,
} from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";
import notificationService from "../notifications/notification.service.js";

const MAX_MESSAGE_LENGTH = 2000;

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

const memberInclude = [
  {
    model: Member,
    as: "member1",
    attributes: memberAttributes,
  },
  {
    model: Member,
    as: "member2",
    attributes: memberAttributes,
  },
];

const messageInclude = [
  {
    model: Member,
    as: "sender",
    attributes: memberAttributes,
  },
];

const normalizePair = (firstMemberId, secondMemberId) => {
  const memberIds = [String(firstMemberId), String(secondMemberId)].sort();

  return {
    member1_id: memberIds[0],
    member2_id: memberIds[1],
  };
};

const sanitizePlain = (record) => {
  if (!record) {
    return null;
  }

  return typeof record.get === "function"
    ? record.get({ plain: true })
    : { ...record };
};

const isConversationParticipant = (conversation, memberId) => {
  return [conversation.member1_id, conversation.member2_id].includes(memberId);
};

const getConversationOrThrow = async (conversationId) => {
  const conversation = await Conversation.findByPk(conversationId, {
    include: memberInclude,
  });

  if (!conversation) {
    throw createHttpError("Conversation not found", 404);
  }

  return conversation;
};

const assertParticipant = (conversation, memberId) => {
  const plainConversation = sanitizePlain(conversation);

  if (!isConversationParticipant(plainConversation, memberId)) {
    throw createHttpError("You are not allowed to access this conversation", 403);
  }
};

const getConversationById = async (conversationId) => {
  const conversation = await Conversation.findByPk(conversationId, {
    include: memberInclude,
  });

  return sanitizePlain(conversation);
};

const createOrGetConversation = async (currentUserId, targetUserId) => {
  if (!targetUserId) {
    throw createHttpError("target user id is required", 400);
  }

  if (currentUserId === targetUserId) {
    throw createHttpError("Cannot create a conversation with yourself", 400);
  }

  const targetUser = await Member.findByPk(targetUserId);

  if (!targetUser) {
    throw createHttpError("Target user not found", 404);
  }

  const pair = normalizePair(currentUserId, targetUserId);

  const existingConversation = await Conversation.findOne({
    where: pair,
    include: memberInclude,
  });

  if (existingConversation) {
    return sanitizePlain(existingConversation);
  }

  try {
    const conversation = await sequelize.transaction(async (transaction) => {
      const createdConversation = await Conversation.create(pair, { transaction });

      return Conversation.findByPk(createdConversation.conversation_id, {
        include: memberInclude,
        transaction,
      });
    });

    return sanitizePlain(conversation);
  } catch (error) {
    if (!(error instanceof UniqueConstraintError)) {
      throw error;
    }

    const existingConversationAfterRace = await Conversation.findOne({
      where: pair,
      include: memberInclude,
    });

    return sanitizePlain(existingConversationAfterRace);
  }
};

const listMyConversations = async (memberId) => {
  const conversations = await Conversation.findAll({
    where: {
      [Op.or]: [
        { member1_id: memberId },
        { member2_id: memberId },
      ],
    },
    include: memberInclude,
    order: [["updated_at", "DESC"]],
  });

  return conversations.map(sanitizePlain);
};

const listMessages = async (memberId, conversationId) => {
  const conversation = await getConversationOrThrow(conversationId);
  assertParticipant(conversation, memberId);

  const messages = await Message.findAll({
    where: {
      conversation_id: conversationId,
    },
    include: messageInclude,
    order: [["created_at", "ASC"]],
  });

  return messages.map(sanitizePlain);
};

const sendMessage = async (memberId, conversationId, payload = {}) => {
  const conversation = await getConversationOrThrow(conversationId);
  assertParticipant(conversation, memberId);

  if (typeof payload.content !== "string") {
    throw createHttpError("content is required", 400);
  }

  const content = payload.content.trim();

  if (!content) {
    throw createHttpError("content cannot be empty", 400);
  }

  if (content.length > MAX_MESSAGE_LENGTH) {
    throw createHttpError(`content must be at most ${MAX_MESSAGE_LENGTH} characters`, 400);
  }

  const message = await sequelize.transaction(async (transaction) => {
    const createdMessage = await Message.create(
      {
        conversation_id: conversationId,
        sender_id: memberId,
        content,
        is_read: false,
      },
      { transaction },
    );

    await conversation.update({ updated_at: new Date() }, { transaction });

    return Message.findByPk(createdMessage.message_id, {
      include: messageInclude,
      transaction,
    });
  });

  const plainMessage = sanitizePlain(message);

  const recipientId = [conversation.member1_id, conversation.member2_id].find(
    (id) => id && id !== memberId,
  );

  if (recipientId) {
    const senderName = plainMessage?.sender?.full_name ?? "Một thành viên";
    await notificationService.createNotification({
      member_id: recipientId,
      type: "message",
      reference_id: conversationId,
      content: `${senderName} đã gửi cho bạn một tin nhắn mới.`,
    });
  }

  return plainMessage;
};

const conversationService = {
  createOrGetConversation,
  listMyConversations,
  listMessages,
  sendMessage,
};

export default conversationService;
