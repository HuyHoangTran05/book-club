import { Op } from "sequelize";
import {
  sequelize,
  BookCopy,
  BookTitle,
  BookTransaction,
  Member,
  PointHistory,
} from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const MEMBER_ATTRIBUTES = [
  "member_id",
  "full_name",
  "email",
  "phone",
  "point_balance",
  "role",
  "is_deliverer",
  "account_status",
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

const normalizeText = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
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
  }

  await bookCopy.update(
    {
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

  const transactions = await BookTransaction.findAll({
    where: {
      [Op.or]: [
        { giver_id: memberId },
        { receiver_id: memberId },
        { deliverer_id: memberId },
      ],
    },
    include: transactionIncludes(),
    order: [["created_at", "DESC"]],
  });

  return transactions.map(sanitizeTransaction);
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
};

export default transactionService;
