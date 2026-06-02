import sequelize from "../config/database.js";
import Member from "./member.model.js";
import BookTitle from "./bookTitle.model.js";
import BookCopy from "./bookCopy.model.js";
import BookTransaction from "./bookTransaction.model.js";
import Conversation from "./conversation.model.js";
import DelivererProfile from "./delivererProfile.model.js";
import Message from "./message.model.js";
import PointHistory from "./pointHistory.model.js";

BookTitle.hasMany(BookCopy, {
  foreignKey: "book_id",
  as: "copies",
});
BookCopy.belongsTo(BookTitle, {
  foreignKey: "book_id",
  as: "bookTitle",
});

Member.hasMany(BookCopy, {
  foreignKey: "owner_id",
  as: "ownedBooks",
});
BookCopy.belongsTo(Member, {
  foreignKey: "owner_id",
  as: "owner",
});

BookCopy.hasMany(BookTransaction, {
  foreignKey: "copy_id",
  as: "transactions",
});
BookTransaction.belongsTo(BookCopy, {
  foreignKey: "copy_id",
  as: "bookCopy",
});

Member.hasMany(BookTransaction, {
  foreignKey: "giver_id",
  as: "givenTransactions",
});
BookTransaction.belongsTo(Member, {
  foreignKey: "giver_id",
  as: "giver",
});

Member.hasMany(BookTransaction, {
  foreignKey: "receiver_id",
  as: "receivedTransactions",
});
BookTransaction.belongsTo(Member, {
  foreignKey: "receiver_id",
  as: "receiver",
});

Member.hasMany(BookTransaction, {
  foreignKey: "deliverer_id",
  as: "deliveredTransactions",
});
BookTransaction.belongsTo(Member, {
  foreignKey: "deliverer_id",
  as: "deliverer",
});

Member.hasMany(PointHistory, {
  foreignKey: "member_id",
  as: "pointHistories",
});
PointHistory.belongsTo(Member, {
  foreignKey: "member_id",
  as: "member",
});

BookTransaction.hasMany(PointHistory, {
  foreignKey: "transaction_id",
  as: "pointHistories",
});
PointHistory.belongsTo(BookTransaction, {
  foreignKey: "transaction_id",
  as: "transaction",
});

Member.hasOne(DelivererProfile, {
  foreignKey: "member_id",
  as: "delivererProfile",
});
DelivererProfile.belongsTo(Member, {
  foreignKey: "member_id",
  as: "member",
});

Member.hasMany(Conversation, {
  foreignKey: "member1_id",
  as: "member1Conversations",
});
Conversation.belongsTo(Member, {
  foreignKey: "member1_id",
  as: "member1",
});

Member.hasMany(Conversation, {
  foreignKey: "member2_id",
  as: "member2Conversations",
});
Conversation.belongsTo(Member, {
  foreignKey: "member2_id",
  as: "member2",
});

Conversation.hasMany(Message, {
  foreignKey: "conversation_id",
  as: "messages",
});
Message.belongsTo(Conversation, {
  foreignKey: "conversation_id",
  as: "conversation",
});

Member.hasMany(Message, {
  foreignKey: "sender_id",
  as: "sentMessages",
});
Message.belongsTo(Member, {
  foreignKey: "sender_id",
  as: "sender",
});

export {
  sequelize,
  Member,
  BookTitle,
  BookCopy,
  BookTransaction,
  Conversation,
  DelivererProfile,
  Message,
  PointHistory,
};
