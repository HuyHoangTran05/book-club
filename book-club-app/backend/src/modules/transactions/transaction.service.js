import { Op, Transaction } from "sequelize";
import {
  sequelize,
  Member,
  BookCopy,
  BookTitle,
  BookTransaction,
  DelivererProfile,
  PointHistory,
} from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const TRANSACTION_COST = {
  permanent: 10,
  lending: 5,
};

const POINT_REASON = {
  permanent: "permanent_exchange",
  lending: "lending",
};

const memberAttributes = [
  "member_id",
  "full_name",
  "email",
  "phone",
  "point_balance",
  "role",
  "is_deliverer",
  "account_status",
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

const normalizeText = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
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

const assertTransactionParticipant = (transaction, memberId) => {
  if (!memberId) {
    return;
  }

  const participantIds = [
    transaction.giver_id,
    transaction.receiver_id,
    transaction.deliverer_id,
  ].filter(Boolean);

  if (!participantIds.includes(memberId)) {
    throw createHttpError("You are not allowed to view this transaction", 403);
  }
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

const getTransactionById = async (transactionId, memberId = null) => {
  const transaction = await BookTransaction.findByPk(transactionId, {
    include: transactionInclude,
  });

  if (!transaction) {
    throw createHttpError("Transaction not found", 404);
  }

  assertTransactionParticipant(transaction, memberId);

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
      if (delivererId === memberId) {
        throw createHttpError("Deliverer cannot be the transaction receiver", 400);
      }

      const deliverer = await Member.findByPk(delivererId, {
        transaction: dbTransaction,
        lock: Transaction.LOCK.UPDATE,
      });

      if (!deliverer || deliverer.account_status !== "active") {
        throw createHttpError("Deliverer account is not active", 403);
      }

      if (!deliverer.is_deliverer) {
        throw createHttpError("Selected member is not a deliverer", 400);
      }

      const delivererProfile = await DelivererProfile.findOne({
        where: {
          member_id: delivererId,
        },
        transaction: dbTransaction,
      });

      if (delivererProfile && !delivererProfile.is_active) {
        throw createHttpError("Deliverer is not active", 400);
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

  if (transaction.deliverer_id && !transaction.delivery_confirmed) {
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
      await DelivererProfile.increment("total_deliveries", {
        by: 1,
        where: {
          member_id: deliverer.member_id,
        },
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
  }

  await bookCopy.update(
    {
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

const listMyTransactions = async (memberId) => {
  const transactions = await BookTransaction.findAll({
    where: {
      [Op.or]: [
        { giver_id: memberId },
        { receiver_id: memberId },
        { deliverer_id: memberId },
      ],
    },
    include: transactionInclude,
    order: [["created_at", "DESC"]],
  });

  return transactions.map(sanitizeTransaction);
};

const transactionService = {
  createTransaction,
  confirmTransaction,
  cancelTransaction,
  getTransactionById,
  listMyTransactions,
};

export default transactionService;
