import sequelize from "../config/database.js";
import Member from "./member.model.js";
import BookTitle from "./bookTitle.model.js";
import BookCopy from "./bookCopy.model.js";
import BookTransaction from "./bookTransaction.model.js";
import PointHistory from "./pointHistory.model.js";

BookTitle.hasMany(BookCopy, {
  foreignKey: "book_id",
  as: "copies",
});
BookCopy.belongsTo(BookTitle, {
  foreignKey: "book_id",
  as: "book",
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

export {
  sequelize,
  Member,
  BookTitle,
  BookCopy,
  BookTransaction,
  PointHistory,
};
