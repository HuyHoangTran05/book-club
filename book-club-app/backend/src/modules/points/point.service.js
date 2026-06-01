import {
  BookCopy,
  BookTitle,
  BookTransaction,
  PointHistory,
} from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const handleDatabaseNotReady = (error) => {
  if (
    error?.name === "SequelizeDatabaseError" &&
    /relation .*(point_histories|book_transactions|book_copies|book_titles).* does not exist/i
      .test(error.message)
  ) {
    throw createHttpError("Database cho lịch sử điểm chưa sẵn sàng. Vui lòng chạy migration trước.", 501);
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

const sanitizePointHistory = (pointHistory) => {
  if (!pointHistory) {
    return null;
  }

  return typeof pointHistory.get === "function"
    ? pointHistory.get({ plain: true })
    : { ...pointHistory };
};

const getPointHistory = async (memberId) => withDatabaseGuard(async () => {
  if (!memberId) {
    throw createHttpError("Token không hợp lệ: thiếu member_id", 401);
  }

  const pointHistories = await PointHistory.findAll({
    where: {
      member_id: memberId,
    },
    include: [
      {
        model: BookTransaction,
        as: "transaction",
        required: false,
        include: [
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
        ],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  return pointHistories.map(sanitizePointHistory);
});

const pointService = {
  getPointHistory,
};

export default pointService;
