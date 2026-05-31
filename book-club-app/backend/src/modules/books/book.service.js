import { Op } from "sequelize";
import { sequelize, BookCopy, BookTitle, Member } from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const validConditions = ["new", "good", "fair", "worn"];
const validStatuses = [
  "available",
  "reserved",
  "borrowed",
  "exchanged",
  "unavailable",
];
const validExchangeTypes = ["permanent", "lending", "both"];

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

const normalizePagination = ({ page = 1, limit = 20 } = {}) => {
  const normalizedPage = Math.max(Number(page) || 1, 1);
  const normalizedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    offset: (normalizedPage - 1) * normalizedLimit,
  };
};

const bookInclude = [
  {
    model: BookTitle,
    as: "bookTitle",
  },
  {
    model: Member,
    as: "owner",
    attributes: ["member_id", "full_name", "email", "point_balance"],
  },
];

const buildTitleWhere = ({ title, author, publication_year, edition, isbn }) => {
  const normalizedIsbn = normalizeText(isbn);

  if (normalizedIsbn) {
    return { isbn: normalizedIsbn };
  }

  return {
    title: normalizeText(title),
    author: normalizeText(author),
    publication_year: publication_year || null,
    edition: normalizeText(edition),
  };
};

const findOrCreateBookTitle = async (payload, transaction) => {
  const title = normalizeText(payload.title);
  const author = normalizeText(payload.author);

  if (!title || !author) {
    throw createHttpError("title and author are required", 400);
  }

  const titleWhere = buildTitleWhere({ ...payload, title, author });

  const [bookTitle] = await BookTitle.findOrCreate({
    where: titleWhere,
    defaults: {
      title,
      author,
      category: normalizeText(payload.category),
      publisher: normalizeText(payload.publisher),
      edition: normalizeText(payload.edition),
      publication_year: payload.publication_year || null,
      isbn: normalizeText(payload.isbn),
      language: normalizeText(payload.language) || "Vietnamese",
      description: normalizeText(payload.description),
      cover_url: normalizeText(payload.cover_url),
    },
    transaction,
  });

  return bookTitle;
};

const validateCopyPayload = ({ condition, status, exchange_type }) => {
  const normalizedCondition = normalizeText(condition);
  const normalizedStatus = normalizeText(status);
  const normalizedExchangeType = normalizeText(exchange_type);

  if (condition !== undefined && !normalizedCondition) {
    throw createHttpError("condition cannot be empty", 400);
  }

  if (status !== undefined && !normalizedStatus) {
    throw createHttpError("status cannot be empty", 400);
  }

  if (exchange_type !== undefined && !normalizedExchangeType) {
    throw createHttpError("exchange_type cannot be empty", 400);
  }

  if (normalizedCondition && !validConditions.includes(normalizedCondition)) {
    throw createHttpError(`condition must be one of: ${validConditions.join(", ")}`, 400);
  }

  if (normalizedStatus && !validStatuses.includes(normalizedStatus)) {
    throw createHttpError(`status must be one of: ${validStatuses.join(", ")}`, 400);
  }

  if (normalizedExchangeType && !validExchangeTypes.includes(normalizedExchangeType)) {
    throw createHttpError(
      `exchange_type must be one of: ${validExchangeTypes.join(", ")}`,
      400,
    );
  }
};

const getOwnedBookCopy = async (copyId, memberId) => {
  const bookCopy = await BookCopy.findOne({
    where: {
      copy_id: copyId,
      owner_id: memberId,
    },
    include: bookInclude,
  });

  if (!bookCopy) {
    throw createHttpError("Book copy not found or you do not own it", 404);
  }

  return bookCopy;
};

const createBook = async (memberId, payload) => {
  validateCopyPayload(payload);

  return sequelize.transaction(async (transaction) => {
    const bookTitle = await findOrCreateBookTitle(payload, transaction);

    const bookCopy = await BookCopy.create(
      {
        book_id: bookTitle.book_id,
        owner_id: memberId,
        condition: normalizeText(payload.condition) || "good",
        status: normalizeText(payload.status) || "available",
        exchange_type: normalizeText(payload.exchange_type) || "both",
        note: normalizeText(payload.note),
      },
      { transaction },
    );

    return BookCopy.findByPk(bookCopy.copy_id, {
      include: bookInclude,
      transaction,
    });
  });
};

const listBooks = async (query = {}) => {
  const { page, limit, offset } = normalizePagination(query);
  const where = {};
  const bookWhere = {};

  if (query.status) {
    if (!validStatuses.includes(query.status)) {
      throw createHttpError(`status must be one of: ${validStatuses.join(", ")}`, 400);
    }
    where.status = query.status;
  } else {
    where.status = { [Op.ne]: "unavailable" };
  }

  if (query.exchange_type) {
    if (!validExchangeTypes.includes(query.exchange_type)) {
      throw createHttpError(
        `exchange_type must be one of: ${validExchangeTypes.join(", ")}`,
        400,
      );
    }
    where.exchange_type = query.exchange_type;
  }

  const keyword = normalizeText(query.q);
  if (keyword) {
    bookWhere[Op.or] = [
      { title: { [Op.iLike]: `%${keyword}%` } },
      { author: { [Op.iLike]: `%${keyword}%` } },
      { category: { [Op.iLike]: `%${keyword}%` } },
      { isbn: { [Op.iLike]: `%${keyword}%` } },
    ];
  }

  if (query.category) {
    bookWhere.category = { [Op.iLike]: `%${query.category.trim()}%` };
  }

  if (query.author) {
    bookWhere.author = { [Op.iLike]: `%${query.author.trim()}%` };
  }

  const { rows, count } = await BookCopy.findAndCountAll({
    where,
    include: [
      {
        model: BookTitle,
        as: "bookTitle",
        where: Object.keys(bookWhere).length > 0 ? bookWhere : undefined,
      },
      bookInclude[1],
    ],
    order: [["created_at", "DESC"]],
    limit,
    offset,
    distinct: true,
  });

  return {
    items: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const listMyBooks = async (memberId, query = {}) => {
  const { page, limit, offset } = normalizePagination(query);

  const { rows, count } = await BookCopy.findAndCountAll({
    where: { owner_id: memberId },
    include: bookInclude,
    order: [["created_at", "DESC"]],
    limit,
    offset,
    distinct: true,
  });

  return {
    items: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    },
  };
};

const getBookByCopyId = async (copyId) => {
  const bookCopy = await BookCopy.findByPk(copyId, {
    include: bookInclude,
  });

  if (!bookCopy) {
    throw createHttpError("Book copy not found", 404);
  }

  return bookCopy;
};

const updateBook = async (memberId, copyId, payload) => {
  validateCopyPayload(payload);

  return sequelize.transaction(async (transaction) => {
    const bookCopy = await getOwnedBookCopy(copyId, memberId);
    const copyUpdate = {};

    for (const field of ["condition", "status", "exchange_type", "note"]) {
      if (Object.prototype.hasOwnProperty.call(payload, field)) {
        copyUpdate[field] = normalizeText(payload[field]);
      }
    }

    if (Object.keys(copyUpdate).length > 0) {
      await bookCopy.update(copyUpdate, { transaction });
    }

    if (payload.title || payload.author || payload.isbn) {
      const existingTitle = bookCopy.bookTitle?.get({ plain: true }) || {};
      const bookTitle = await findOrCreateBookTitle(
        {
          ...existingTitle,
          ...payload,
        },
        transaction,
      );
      await bookCopy.update({ book_id: bookTitle.book_id }, { transaction });
    }

    return BookCopy.findByPk(copyId, {
      include: bookInclude,
      transaction,
    });
  });
};

const deleteBook = async (memberId, copyId) => {
  const bookCopy = await getOwnedBookCopy(copyId, memberId);

  await bookCopy.update({ status: "unavailable" });

  return BookCopy.findByPk(copyId, {
    include: bookInclude,
  });
};

const bookService = {
  createBook,
  listBooks,
  listMyBooks,
  getBookByCopyId,
  updateBook,
  deleteBook,
};

export default bookService;
