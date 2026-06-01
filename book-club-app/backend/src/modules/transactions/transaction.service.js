<<<<<<< HEAD
import { Op, Transaction } from "sequelize";
import {
  sequelize,
  Member,
  BookCopy,
  BookTitle,
  BookTransaction,
=======
import { Op } from "sequelize";
import {
  sequelize,
  BookCopy,
  BookTitle,
  BookTransaction,
  Member,
>>>>>>> 08c52326dfdb42b658154d43585d6f425946d3f2
  PointHistory,
} from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

<<<<<<< HEAD
const TRANSACTION_COST = {
  permanent: 10,
  lending: 5,
};

const POINT_REASON = {
  permanent: "permanent_exchange",
  lending: "lending",
};

const memberAttributes = [
=======
const MEMBER_ATTRIBUTES = [
>>>>>>> 08c52326dfdb42b658154d43585d6f425946d3f2
  "member_id",
  "full_name",
  "email",
  "phone",
  "point_balance",
  "role",
  "is_deliverer",
  "account_status",
<<<<<<< HEAD
];

const transactionInclude = [
  {
    model: BookCopy,
    as: "bookCopy",
    include: [
      {
        model: BookTitle,
        as: "bookTitle",
      },
    ],
  },
  {
    model: Member,
    as: "giver",
    attributes: memberAttributes,
  },
  {
    model: Member,
    as: "receiver",
    attributes: memberAttributes,
  },
  {
    model: Member,
    as: "deliverer",
    attributes: memberAttributes,
  },
  {
    model: PointHistory,
    as: "pointHistories",
  },
];
=======
  "email_verified",
  "created_at",
];

const TRANSACTION_TYPES = ["permanent", "lending"];
const TRANSACTION_POINTS = {
  permanent: 10,
  lending: 5,
};
const DELIVERY_BONUS_POINTS = 2;
const ACTIVE_ACCOUNT_STATUS = "active";
>>>>>>> 08c52326dfdb42b658154d43585d6f425946d3f2

const normalizeText = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
<<<<<<< HEAD
  return trimmed.length > 0 ? trimmed : null;
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

const getCost = (transactionType) => {
  const cost = TRANSACTION_COST[transactionType];

  if (!cost) {
    throw createHttpError("transaction_type must be permanent or lending", 400);
  }

  return cost;
};

const assertBookSupportsTransactionType = (bookCopy, transactionType) => {
  if (bookCopy.exchange_type === "both") {
    return;
  }

  if (bookCopy.exchange_type !== transactionType) {
    throw createHttpError("Book copy does not support this transaction type", 400);
  }
};

const getTransactionById = async (transactionId) => {
  const transaction = await BookTransaction.findByPk(transactionId, {
    include: transactionInclude,
  });

  if (!transaction) {
    throw createHttpError("Transaction not found", 404);
  }

  return sanitizeTransaction(transaction);
};

const createTransaction = async (memberId, payload) => {
  const copyId = normalizeText(payload.copy_id ?? payload.copyId);
  const transactionType = normalizeText(payload.transaction_type ?? payload.transactionType);
  const delivererId = normalizeText(payload.deliverer_id ?? payload.delivererId);
  const expectedReturnDate = normalizeText(
    payload.expected_return_date ?? payload.expectedReturnDate,
  );

  if (!copyId) {
    throw createHttpError("copy_id is required", 400);
  }

  const cost = getCost(transactionType);

  const createdTransaction = await sequelize.transaction(async (dbTransaction) => {
    const bookCopy = await BookCopy.findByPk(copyId, {
      transaction: dbTransaction,
      lock: Transaction.LOCK.UPDATE,
    });

    if (!bookCopy) {
      throw createHttpError("Book copy not found", 404);
    }

    if (bookCopy.status !== "available") {
      throw createHttpError("Book copy is not available", 400);
    }

    if (bookCopy.owner_id === memberId) {
      throw createHttpError("Owner cannot create a transaction for their own book", 400);
    }

    assertBookSupportsTransactionType(bookCopy, transactionType);

    const receiver = await Member.findByPk(memberId, {
      transaction: dbTransaction,
      lock: Transaction.LOCK.UPDATE,
    });

    if (!receiver) {
      throw createHttpError("Receiver not found", 404);
    }

    if (receiver.account_status !== "active") {
      throw createHttpError("Receiver account is not active", 403);
    }

    if (receiver.point_balance < cost) {
      throw createHttpError("Receiver does not have enough points", 400);
    }

    const giver = await Member.findByPk(bookCopy.owner_id, {
      transaction: dbTransaction,
      lock: Transaction.LOCK.UPDATE,
    });

    if (!giver || giver.account_status !== "active") {
      throw createHttpError("Book owner account is not active", 403);
    }

    if (delivererId) {
      const deliverer = await Member.findByPk(delivererId, {
        transaction: dbTransaction,
        lock: Transaction.LOCK.UPDATE,
      });

      if (!deliverer || deliverer.account_status !== "active") {
        throw createHttpError("Deliverer account is not active", 403);
      }
    }

    const newTransaction = await BookTransaction.create(
      {
        copy_id: bookCopy.copy_id,
        giver_id: bookCopy.owner_id,
        receiver_id: memberId,
        deliverer_id: delivererId,
        transaction_type: transactionType,
        status: "pending",
        expected_return_date: transactionType === "lending" ? expectedReturnDate : null,
      },
      { transaction: dbTransaction },
    );

    await bookCopy.update(
      {
        status: "reserved",
      },
      { transaction: dbTransaction },
    );

    return newTransaction;
  });

  return getTransactionById(createdTransaction.transaction_id);
};

const completeTransactionIfReady = async (transaction, dbTransaction) => {
  if (!transaction.giver_confirmed || !transaction.receiver_confirmed) {
    return transaction;
  }

  const cost = getCost(transaction.transaction_type);
  const reason = POINT_REASON[transaction.transaction_type];

  const bookCopy = await BookCopy.findByPk(transaction.copy_id, {
    transaction: dbTransaction,
    lock: Transaction.LOCK.UPDATE,
  });

  if (!bookCopy) {
    throw createHttpError("Book copy not found", 404);
  }

  const giver = await Member.findByPk(transaction.giver_id, {
    transaction: dbTransaction,
    lock: Transaction.LOCK.UPDATE,
  });
  const receiver = await Member.findByPk(transaction.receiver_id, {
    transaction: dbTransaction,
    lock: Transaction.LOCK.UPDATE,
  });

  if (!giver || !receiver) {
    throw createHttpError("Transaction member not found", 404);
  }

  if (receiver.point_balance < cost) {
    throw createHttpError("Receiver does not have enough points", 400);
  }

  await giver.increment("point_balance", {
    by: cost,
    transaction: dbTransaction,
  });
  await receiver.decrement("point_balance", {
    by: cost,
    transaction: dbTransaction,
  });

  await PointHistory.bulkCreate(
    [
      {
        member_id: giver.member_id,
        transaction_id: transaction.transaction_id,
        point_change: cost,
        reason,
      },
      {
        member_id: receiver.member_id,
        transaction_id: transaction.transaction_id,
        point_change: -cost,
        reason,
      },
    ],
    { transaction: dbTransaction },
  );

  if (transaction.deliverer_id && transaction.delivery_confirmed) {
    const deliverer = await Member.findByPk(transaction.deliverer_id, {
      transaction: dbTransaction,
      lock: Transaction.LOCK.UPDATE,
    });

    if (deliverer) {
      await deliverer.increment("point_balance", {
        by: 2,
        transaction: dbTransaction,
      });
      await PointHistory.create(
        {
          member_id: deliverer.member_id,
          transaction_id: transaction.transaction_id,
          point_change: 2,
          reason: "delivery_bonus",
        },
        { transaction: dbTransaction },
      );
    }
=======
  return trimmed === "" ? null : trimmed;
};

const sanitizeMember = (member) => {
  if (!member) {
    return null;
  }

  const plainMember = typeof member.get === "function"
    ? member.get({ plain: true })
    : { ...member };

  delete plainMember.password_hash;
  delete plainMember.password;

  return plainMember;
};

const sanitizeTransaction = (bookTransaction) => {
  if (!bookTransaction) {
    return null;
  }

  const plainTransaction = typeof bookTransaction.get === "function"
    ? bookTransaction.get({ plain: true })
    : { ...bookTransaction };

  if (plainTransaction.giver) {
    plainTransaction.giver = sanitizeMember(plainTransaction.giver);
  }

  if (plainTransaction.receiver) {
    plainTransaction.receiver = sanitizeMember(plainTransaction.receiver);
  }

  if (plainTransaction.deliverer) {
    plainTransaction.deliverer = sanitizeMember(plainTransaction.deliverer);
  }

  if (plainTransaction.bookCopy?.owner) {
    plainTransaction.bookCopy.owner = sanitizeMember(plainTransaction.bookCopy.owner);
  }

  return plainTransaction;
};

const transactionIncludes = ({ includePointHistories = false } = {}) => {
  const includes = [
    {
      model: BookCopy,
      as: "bookCopy",
      include: [
        {
          model: BookTitle,
          as: "bookTitle",
        },
        {
          model: Member,
          as: "owner",
          attributes: MEMBER_ATTRIBUTES,
        },
      ],
    },
    {
      model: Member,
      as: "giver",
      attributes: MEMBER_ATTRIBUTES,
    },
    {
      model: Member,
      as: "receiver",
      attributes: MEMBER_ATTRIBUTES,
    },
    {
      model: Member,
      as: "deliverer",
      attributes: MEMBER_ATTRIBUTES,
      required: false,
    },
  ];

  if (includePointHistories) {
    includes.push({
      model: PointHistory,
      as: "pointHistories",
      required: false,
      order: [["created_at", "DESC"]],
    });
  }

  return includes;
};

const handleDatabaseNotReady = (error) => {
  if (
    error?.name === "SequelizeDatabaseError" &&
    /relation .*(book_transactions|book_copies|book_titles|members|point_histories).* does not exist/i
      .test(error.message)
  ) {
    throw createHttpError("Database cho transaction chưa sẵn sàng. Vui lòng chạy migration trước.", 501);
  }

  throw error;
};

const withDatabaseGuard = async (callback) => {
  try {
    return await callback();
  } catch (error) {
    handleDatabaseNotReady(error);
  }
};

const isRelatedMember = (bookTransaction, memberId) => [
  bookTransaction.giver_id,
  bookTransaction.receiver_id,
  bookTransaction.deliverer_id,
].filter(Boolean).includes(memberId);

const validateCreateDto = (dto) => {
  const copyId = normalizeText(dto.copy_id);
  const transactionType = normalizeText(dto.transaction_type);

  if (!copyId) {
    throw createHttpError("copy_id là bắt buộc", 400);
  }

  if (!transactionType) {
    throw createHttpError("transaction_type là bắt buộc", 400);
  }

  if (!TRANSACTION_TYPES.includes(transactionType)) {
    throw createHttpError(`transaction_type phải là một trong: ${TRANSACTION_TYPES.join(", ")}`, 400);
  }

  return {
    copyId,
    transactionType,
    delivererId: normalizeText(dto.deliverer_id),
    expectedReturnDate: normalizeText(dto.expected_return_date),
  };
};

const ensureActiveMember = (member, message = "Không tìm thấy thành viên") => {
  if (!member) {
    throw createHttpError(message, 404);
  }

  if (member.account_status !== ACTIVE_ACCOUNT_STATUS) {
    throw createHttpError("Tài khoản không hoạt động", 403);
  }
};

const findTransactionForResponse = async (
  transactionId,
  { transaction = null, includePointHistories = false } = {},
) => {
  const bookTransaction = await BookTransaction.findByPk(transactionId, {
    include: transactionIncludes({ includePointHistories }),
    transaction,
  });

  if (!bookTransaction) {
    throw createHttpError("Không tìm thấy giao dịch", 404);
  }

  return sanitizeTransaction(bookTransaction);
};

const createPointHistory = async (
  { memberId, transactionId, pointChange, reason },
  transaction,
) => PointHistory.create(
  {
    member_id: memberId,
    transaction_id: transactionId,
    point_change: pointChange,
    reason,
  },
  { transaction },
);

const applyCompletionPointChanges = async (bookTransaction, transaction) => {
  const pointDelta = TRANSACTION_POINTS[bookTransaction.transaction_type];
  const pointReason = bookTransaction.transaction_type === "permanent"
    ? "permanent_exchange"
    : "lending";

  const receiver = await Member.findByPk(bookTransaction.receiver_id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });
  const giver = await Member.findByPk(bookTransaction.giver_id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  ensureActiveMember(receiver, "Không tìm thấy người nhận");
  ensureActiveMember(giver, "Không tìm thấy chủ sách");

  if (receiver.point_balance < pointDelta) {
    throw createHttpError("Người nhận không đủ điểm để hoàn tất giao dịch", 400);
  }

  await receiver.update(
    { point_balance: receiver.point_balance - pointDelta },
    { transaction },
  );
  await giver.update(
    { point_balance: giver.point_balance + pointDelta },
    { transaction },
  );

  await createPointHistory(
    {
      memberId: receiver.member_id,
      transactionId: bookTransaction.transaction_id,
      pointChange: -pointDelta,
      reason: pointReason,
    },
    transaction,
  );
  await createPointHistory(
    {
      memberId: giver.member_id,
      transactionId: bookTransaction.transaction_id,
      pointChange: pointDelta,
      reason: pointReason,
    },
    transaction,
  );

  if (bookTransaction.deliverer_id) {
    const deliverer = await Member.findByPk(bookTransaction.deliverer_id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    ensureActiveMember(deliverer, "Không tìm thấy người giao sách");

    await deliverer.update(
      { point_balance: deliverer.point_balance + DELIVERY_BONUS_POINTS },
      { transaction },
    );
    await createPointHistory(
      {
        memberId: deliverer.member_id,
        transactionId: bookTransaction.transaction_id,
        pointChange: DELIVERY_BONUS_POINTS,
        reason: "delivery_bonus",
      },
      transaction,
    );
  }
};

const completeLockedTransaction = async (bookTransaction, transaction) => {
  if (bookTransaction.status !== "pending") {
    throw createHttpError("Giao dịch không còn ở trạng thái chờ xác nhận", 400);
  }

  const deliveryConfirmed = !bookTransaction.deliverer_id || bookTransaction.delivery_confirmed;
  const readyToComplete = (
    bookTransaction.giver_confirmed &&
    bookTransaction.receiver_confirmed &&
    deliveryConfirmed
  );

  if (!readyToComplete) {
    await bookTransaction.save({ transaction });
    return false;
  }

  await applyCompletionPointChanges(bookTransaction, transaction);

  const bookCopy = await BookCopy.findByPk(bookTransaction.copy_id, {
    transaction,
    lock: transaction.LOCK.UPDATE,
  });

  if (!bookCopy) {
    throw createHttpError("Không tìm thấy bản sách", 404);
>>>>>>> 08c52326dfdb42b658154d43585d6f425946d3f2
  }

  await bookCopy.update(
    {
<<<<<<< HEAD
      status: transaction.transaction_type === "permanent" ? "exchanged" : "borrowed",
    },
    { transaction: dbTransaction },
  );

  await transaction.update(
    {
      status: "completed",
      completed_at: new Date(),
    },
    { transaction: dbTransaction },
  );

  return transaction;
};

const confirmTransaction = async (memberId, transactionId) => {
  await sequelize.transaction(async (dbTransaction) => {
    const transaction = await BookTransaction.findByPk(transactionId, {
      transaction: dbTransaction,
      lock: Transaction.LOCK.UPDATE,
    });

    if (!transaction) {
      throw createHttpError("Transaction not found", 404);
    }

    if (transaction.status !== "pending") {
      throw createHttpError("Only pending transactions can be confirmed", 400);
    }

    const updates = {};

    if (transaction.giver_id === memberId) {
      updates.giver_confirmed = true;
    } else if (transaction.receiver_id === memberId) {
      updates.receiver_confirmed = true;
    } else if (transaction.deliverer_id === memberId) {
      updates.delivery_confirmed = true;
    } else {
      throw createHttpError("You are not allowed to confirm this transaction", 403);
    }

    await transaction.update(updates, { transaction: dbTransaction });
    await completeTransactionIfReady(transaction, dbTransaction);
  });

  return getTransactionById(transactionId);
};

const listMyTransactions = async (memberId) => {
=======
      status: bookTransaction.transaction_type === "lending" ? "borrowed" : "exchanged",
    },
    { transaction },
  );

  bookTransaction.status = "completed";
  bookTransaction.completed_at = new Date();
  await bookTransaction.save({ transaction });

  return true;
};

const completeTransaction = async (transactionId) => withDatabaseGuard(async () => (
  sequelize.transaction(async (transaction) => {
    const bookTransaction = await BookTransaction.findByPk(transactionId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!bookTransaction) {
      throw createHttpError("Không tìm thấy giao dịch", 404);
    }

    const completed = await completeLockedTransaction(bookTransaction, transaction);

    if (!completed) {
      throw createHttpError("Giao dịch chưa đủ xác nhận để hoàn tất", 400);
    }

    return findTransactionForResponse(
      bookTransaction.transaction_id,
      { transaction, includePointHistories: true },
    );
  })
));

const createTransaction = async (receiverId, dto) => withDatabaseGuard(async () => {
  if (!receiverId) {
    throw createHttpError("Token không hợp lệ: thiếu member_id", 401);
  }

  const {
    copyId,
    transactionType,
    delivererId,
    expectedReturnDate,
  } = validateCreateDto(dto);

  return sequelize.transaction(async (transaction) => {
    const receiver = await Member.findByPk(receiverId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    ensureActiveMember(receiver, "Không tìm thấy người nhận");

    const bookCopy = await BookCopy.findByPk(copyId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!bookCopy) {
      throw createHttpError("Không tìm thấy bản sách", 404);
    }

    if (bookCopy.status !== "available") {
      throw createHttpError("Sách này hiện không khả dụng để giao dịch", 409);
    }

    if (bookCopy.owner_id === receiverId) {
      throw createHttpError("Bạn không thể tạo giao dịch với sách của chính mình", 400);
    }

    if (bookCopy.exchange_type !== "both" && bookCopy.exchange_type !== transactionType) {
      throw createHttpError("Loại giao dịch không phù hợp với sách này", 400);
    }

    const requiredPoints = TRANSACTION_POINTS[transactionType];
    if (receiver.point_balance < requiredPoints) {
      throw createHttpError("Bạn không đủ điểm để tạo giao dịch này", 400);
    }

    if (delivererId) {
      if (delivererId === receiverId) {
        throw createHttpError("Người nhận không thể đồng thời là người giao sách", 400);
      }

      const deliverer = await Member.findByPk(delivererId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      ensureActiveMember(deliverer, "Không tìm thấy người giao sách");

      if (!deliverer.is_deliverer) {
        throw createHttpError("Thành viên này chưa đăng ký làm người giao sách", 400);
      }
    }

    await bookCopy.update({ status: "reserved" }, { transaction });

    const bookTransaction = await BookTransaction.create(
      {
        copy_id: bookCopy.copy_id,
        giver_id: bookCopy.owner_id,
        receiver_id: receiverId,
        deliverer_id: delivererId,
        transaction_type: transactionType,
        status: "pending",
        giver_confirmed: false,
        receiver_confirmed: false,
        delivery_confirmed: false,
        expected_return_date: transactionType === "lending" ? expectedReturnDate : null,
      },
      { transaction },
    );

    return findTransactionForResponse(bookTransaction.transaction_id, { transaction });
  });
});

const getMyTransactions = async (memberId) => withDatabaseGuard(async () => {
  if (!memberId) {
    throw createHttpError("Token không hợp lệ: thiếu member_id", 401);
  }

>>>>>>> 08c52326dfdb42b658154d43585d6f425946d3f2
  const transactions = await BookTransaction.findAll({
    where: {
      [Op.or]: [
        { giver_id: memberId },
        { receiver_id: memberId },
        { deliverer_id: memberId },
      ],
    },
<<<<<<< HEAD
    include: transactionInclude,
=======
    include: transactionIncludes(),
>>>>>>> 08c52326dfdb42b658154d43585d6f425946d3f2
    order: [["created_at", "DESC"]],
  });

  return transactions.map(sanitizeTransaction);
<<<<<<< HEAD
};

const cancelTransaction = async (memberId, transactionId) => {
  await sequelize.transaction(async (dbTransaction) => {
    const transaction = await BookTransaction.findByPk(transactionId, {
      transaction: dbTransaction,
      lock: Transaction.LOCK.UPDATE,
    });

    if (!transaction) {
      throw createHttpError("Transaction not found", 404);
    }

    if (transaction.status !== "pending") {
      throw createHttpError("Only pending transactions can be cancelled", 400);
    }

    const isParticipant = [
      transaction.giver_id,
      transaction.receiver_id,
      transaction.deliverer_id,
    ].includes(memberId);

    if (!isParticipant) {
      throw createHttpError("You are not allowed to cancel this transaction", 403);
    }

    const bookCopy = await BookCopy.findByPk(transaction.copy_id, {
      transaction: dbTransaction,
      lock: Transaction.LOCK.UPDATE,
    });

    await transaction.update(
      {
        status: "cancelled",
      },
      { transaction: dbTransaction },
    );

    if (bookCopy && bookCopy.status === "reserved") {
      await bookCopy.update(
        {
          status: "available",
        },
        { transaction: dbTransaction },
      );
    }
  });

  return getTransactionById(transactionId);
};

const transactionService = {
  createTransaction,
  confirmTransaction,
  cancelTransaction,
  getTransactionById,
  listMyTransactions,
=======
});

const getTransactionById = async (memberId, transactionId) => withDatabaseGuard(async () => {
  if (!memberId) {
    throw createHttpError("Token không hợp lệ: thiếu member_id", 401);
  }

  const bookTransaction = await BookTransaction.findByPk(transactionId, {
    include: transactionIncludes({ includePointHistories: true }),
  });

  if (!bookTransaction) {
    throw createHttpError("Không tìm thấy giao dịch", 404);
  }

  if (!isRelatedMember(bookTransaction, memberId)) {
    throw createHttpError("Bạn không có quyền xem giao dịch này", 403);
  }

  return sanitizeTransaction(bookTransaction);
});

const confirmTransaction = async (memberId, transactionId) => withDatabaseGuard(async () => {
  if (!memberId) {
    throw createHttpError("Token không hợp lệ: thiếu member_id", 401);
  }

  return sequelize.transaction(async (transaction) => {
    const bookTransaction = await BookTransaction.findByPk(transactionId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!bookTransaction) {
      throw createHttpError("Không tìm thấy giao dịch", 404);
    }

    if (!isRelatedMember(bookTransaction, memberId)) {
      throw createHttpError("Bạn không có quyền xác nhận giao dịch này", 403);
    }

    if (bookTransaction.status === "completed") {
      throw createHttpError("Giao dịch đã hoàn tất", 400);
    }

    if (bookTransaction.status === "cancelled") {
      throw createHttpError("Giao dịch đã bị hủy", 400);
    }

    let hasConfirmationRole = false;
    let changed = false;

    if (bookTransaction.giver_id === memberId) {
      hasConfirmationRole = true;
      if (!bookTransaction.giver_confirmed) {
        bookTransaction.giver_confirmed = true;
        changed = true;
      }
    }

    if (bookTransaction.receiver_id === memberId) {
      hasConfirmationRole = true;
      if (!bookTransaction.receiver_confirmed) {
        bookTransaction.receiver_confirmed = true;
        changed = true;
      }
    }

    if (bookTransaction.deliverer_id === memberId) {
      hasConfirmationRole = true;
      if (!bookTransaction.delivery_confirmed) {
        bookTransaction.delivery_confirmed = true;
        changed = true;
      }
    }

    if (!hasConfirmationRole) {
      throw createHttpError("Bạn không có vai trò xác nhận trong giao dịch này", 403);
    }

    if (!changed) {
      throw createHttpError("Bạn đã xác nhận giao dịch này rồi", 400);
    }

    await completeLockedTransaction(bookTransaction, transaction);

    return findTransactionForResponse(
      bookTransaction.transaction_id,
      { transaction, includePointHistories: true },
    );
  });
});

const cancelTransaction = async (memberId, transactionId) => withDatabaseGuard(async () => {
  if (!memberId) {
    throw createHttpError("Token không hợp lệ: thiếu member_id", 401);
  }

  return sequelize.transaction(async (transaction) => {
    const bookTransaction = await BookTransaction.findByPk(transactionId, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    if (!bookTransaction) {
      throw createHttpError("Không tìm thấy giao dịch", 404);
    }

    if (![bookTransaction.giver_id, bookTransaction.receiver_id].includes(memberId)) {
      throw createHttpError("Bạn không có quyền hủy giao dịch này", 403);
    }

    if (bookTransaction.status !== "pending") {
      throw createHttpError("Chỉ có thể hủy giao dịch đang chờ xác nhận", 400);
    }

    const bookCopy = await BookCopy.findByPk(bookTransaction.copy_id, {
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    bookTransaction.status = "cancelled";
    await bookTransaction.save({ transaction });

    if (bookCopy?.status === "reserved") {
      await bookCopy.update({ status: "available" }, { transaction });
    }

    return findTransactionForResponse(bookTransaction.transaction_id, { transaction });
  });
});

const transactionService = {
  createTransaction,
  getMyTransactions,
  getTransactionById,
  confirmTransaction,
  completeTransaction,
  cancelTransaction,
>>>>>>> 08c52326dfdb42b658154d43585d6f425946d3f2
};

export default transactionService;
