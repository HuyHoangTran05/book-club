import { Op } from "sequelize";
import {
  sequelize,
  Member,
  BookTitle,
  BookCopy,
  BookTransaction,
  PointHistory,
} from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const ACCOUNT_STATUSES = ["active", "locked"];

const memberPublicAttributes = [
  "member_id",
  "full_name",
  "email",
  "phone",
  "address",
  "point_balance",
  "role",
  "is_deliverer",
  "account_status",
  "email_verified",
  "last_login_at",
  "created_at",
  "updated_at",
];

const transactionInclude = [
  {
    model: BookCopy,
    as: "bookCopy",
    include: [{ model: BookTitle, as: "bookTitle" }],
  },
  { model: Member, as: "giver", attributes: ["member_id", "full_name", "email"] },
  { model: Member, as: "receiver", attributes: ["member_id", "full_name", "email"] },
  { model: Member, as: "deliverer", attributes: ["member_id", "full_name", "email"] },
];

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const sanitizeTransaction = (transaction) => {
  if (!transaction) {
    return null;
  }

  const plain = typeof transaction.get === "function"
    ? transaction.get({ plain: true })
    : { ...transaction };

  if (plain.bookCopy?.bookTitle) {
    plain.book = plain.bookCopy.bookTitle;
  }

  return plain;
};

const getStats = async () => {
  const [
    totalMembers,
    totalAdmins,
    totalDeliverers,
    lockedMembers,
    totalBookTitles,
    totalBookCopies,
    availableCopies,
    totalTransactions,
    pendingTransactions,
    completedTransactions,
    cancelledTransactions,
    permanentTransactions,
    lendingTransactions,
    transactionsToday,
    transactionsLast7Days,
    transactionsLast30Days,
  ] = await Promise.all([
    Member.count(),
    Member.count({ where: { role: "admin" } }),
    Member.count({ where: { is_deliverer: true } }),
    Member.count({ where: { account_status: "locked" } }),
    BookTitle.count(),
    BookCopy.count(),
    BookCopy.count({ where: { status: "available" } }),
    BookTransaction.count(),
    BookTransaction.count({ where: { status: "pending" } }),
    BookTransaction.count({ where: { status: "completed" } }),
    BookTransaction.count({ where: { status: "cancelled" } }),
    BookTransaction.count({ where: { transaction_type: "permanent" } }),
    BookTransaction.count({ where: { transaction_type: "lending" } }),
    BookTransaction.count({ where: { created_at: { [Op.gte]: startOfToday() } } }),
    BookTransaction.count({ where: { created_at: { [Op.gte]: daysAgo(7) } } }),
    BookTransaction.count({ where: { created_at: { [Op.gte]: daysAgo(30) } } }),
  ]);

  const topMembers = await Member.findAll({
    attributes: ["member_id", "full_name", "email", "point_balance", "role", "is_deliverer"],
    order: [["point_balance", "DESC"], ["created_at", "ASC"]],
    limit: 10,
  });

  const pendingOver7Days = await BookTransaction.findAll({
    where: { status: "pending", created_at: { [Op.lt]: daysAgo(7) } },
    include: transactionInclude,
    order: [["created_at", "ASC"]],
  });

  const recentTransactions = await BookTransaction.findAll({
    include: transactionInclude,
    order: [["created_at", "DESC"]],
    limit: 10,
  });

  const pointsAgg = await PointHistory.findAll({
    attributes: [
      [sequelize.fn("COALESCE", sequelize.fn("SUM", sequelize.col("point_change")), 0), "total"],
    ],
    raw: true,
  });

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      members: totalMembers,
      admins: totalAdmins,
      deliverers: totalDeliverers,
      lockedMembers,
      bookTitles: totalBookTitles,
      bookCopies: totalBookCopies,
      availableCopies,
      transactions: totalTransactions,
    },
    transactionsByStatus: {
      pending: pendingTransactions,
      completed: completedTransactions,
      cancelled: cancelledTransactions,
    },
    transactionsByType: {
      permanent: permanentTransactions,
      lending: lendingTransactions,
    },
    transactionsOverTime: {
      today: transactionsToday,
      last7Days: transactionsLast7Days,
      last30Days: transactionsLast30Days,
    },
    pointsInCirculation: Number(pointsAgg?.[0]?.total ?? 0),
    topMembers: topMembers.map((member) => member.get({ plain: true })),
    pendingOver7Days: pendingOver7Days.map(sanitizeTransaction),
    recentTransactions: recentTransactions.map(sanitizeTransaction),
  };
};

const listMembers = async (query = {}) => {
  const where = {};
  const keyword = String(query.q ?? query.keyword ?? "").trim();
  const status = String(query.status ?? "").trim();
  const role = String(query.role ?? "").trim();

  if (keyword) {
    where[Op.or] = [
      { full_name: { [Op.iLike]: `%${keyword}%` } },
      { email: { [Op.iLike]: `%${keyword}%` } },
    ];
  }

  if (status) {
    where.account_status = status;
  }

  if (role) {
    where.role = role;
  }

  const members = await Member.findAll({
    where,
    attributes: memberPublicAttributes,
    order: [["created_at", "DESC"]],
  });

  return members.map((member) => member.get({ plain: true }));
};

const updateMemberStatus = async (adminId, memberId, accountStatus) => {
  const status = String(accountStatus ?? "").trim();

  if (!ACCOUNT_STATUSES.includes(status)) {
    throw createHttpError(`account_status phải là một trong: ${ACCOUNT_STATUSES.join(", ")}`, 400);
  }

  if (memberId === adminId) {
    throw createHttpError("Không thể thay đổi trạng thái tài khoản của chính bạn", 400);
  }

  const member = await Member.findByPk(memberId);

  if (!member) {
    throw createHttpError("Không tìm thấy thành viên", 404);
  }

  if (member.role === "admin") {
    throw createHttpError("Không thể thay đổi trạng thái của tài khoản quản trị khác", 403);
  }

  await member.update({ account_status: status });

  return member.get({ plain: true });
};

const deleteMember = async (adminId, memberId) => {
  if (memberId === adminId) {
    throw createHttpError("Không thể xoá tài khoản của chính bạn", 400);
  }

  const member = await Member.findByPk(memberId);

  if (!member) {
    throw createHttpError("Không tìm thấy thành viên", 404);
  }

  if (member.role === "admin") {
    throw createHttpError("Không thể xoá tài khoản quản trị", 403);
  }

  try {
    await member.destroy();
  } catch (error) {
    if (error?.name === "SequelizeForeignKeyConstraintError") {
      throw createHttpError(
        "Không thể xoá thành viên đang có sách hoặc giao dịch liên quan. Hãy khoá tài khoản thay thế.",
        409,
      );
    }
    throw error;
  }

  return { member_id: memberId, deleted: true };
};

const listTransactions = async (query = {}) => {
  const where = {};
  const status = String(query.status ?? "").trim();
  const type = String(query.type ?? "").trim();

  if (status) {
    where.status = status;
  }

  if (type) {
    where.transaction_type = type;
  }

  const transactions = await BookTransaction.findAll({
    where,
    include: transactionInclude,
    order: [["created_at", "DESC"]],
    limit: Math.min(Number(query.limit) || 200, 500),
  });

  return transactions.map(sanitizeTransaction);
};

const adminService = {
  getStats,
  listMembers,
  updateMemberStatus,
  deleteMember,
  listTransactions,
};

export default adminService;
