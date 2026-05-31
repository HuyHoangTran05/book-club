import { Op } from "sequelize";
import { sequelize, BookCopy, BookTitle, Member } from "../../models/index.js";
import createHttpError from "../../utils/createHttpError.js";

const BOOK_TITLE_ALIAS = "book";
const OWNER_ALIAS = "owner";

const validConditions = ["new", "good", "fair", "worn"];
const validExchangeTypes = ["permanent", "lending", "both"];
const updatableCopyFields = ["condition", "exchange_type", "note", "status"];
const validUpdateStatuses = ["available", "unavailable"];

const normalizeText = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  return trimmed !== "" ? trimmed : null;
};

const normalizeCondition = (condition) => {
  const normalized = normalizeText(condition);
  return normalized === "like_new" ? "new" : normalized;
};

const normalizePublicationYear = (publicationYear) => {
  if (publicationYear === undefined || publicationYear === null || publicationYear === "") {
    return null;
  }

  const year = Number(publicationYear);
  if (!Number.isInteger(year)) {
    throw createHttpError("publication_year phải là số nguyên", 400);
  }

  return year;
};

const ownerAttributes = [
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

const bookInclude = [
  {
    model: BookTitle,
    as: BOOK_TITLE_ALIAS,
  },
  {
    model: Member,
    as: OWNER_ALIAS,
    attributes: ownerAttributes,
  },
];

const hasWhereConditions = (where) => (
  Object.keys(where).length > 0 || Object.getOwnPropertySymbols(where).length > 0
);

const sanitizeBookCopy = (bookCopy) => {
  if (!bookCopy) {
    return null;
  }

  const plainBookCopy = typeof bookCopy.get === "function"
    ? bookCopy.get({ plain: true })
    : { ...bookCopy };

  if (plainBookCopy[OWNER_ALIAS]) {
    delete plainBookCopy[OWNER_ALIAS].password_hash;
    delete plainBookCopy[OWNER_ALIAS].password;
  }

  return plainBookCopy;
};

const validateTitlePayload = (dto) => {
  if (!normalizeText(dto.title)) {
    throw createHttpError("title là bắt buộc", 400);
  }

  if (!normalizeText(dto.author)) {
    throw createHttpError("author là bắt buộc", 400);
  }
};

const validateCopyPayload = (dto) => {
  const condition = normalizeCondition(dto.condition ?? "good");
  const exchangeType = normalizeText(dto.exchange_type ?? "both");

  if (!validConditions.includes(condition)) {
    throw createHttpError(`condition phải là một trong: ${validConditions.join(", ")}`, 400);
  }

  if (!validExchangeTypes.includes(exchangeType)) {
    throw createHttpError(`exchange_type phải là một trong: ${validExchangeTypes.join(", ")}`, 400);
  }
};

const findOrCreateBookTitle = async (dto, transaction = null) => {
  validateTitlePayload(dto);

  const isbn = normalizeText(dto.isbn);
  if (isbn) {
    const existingByIsbn = await BookTitle.findOne({
      where: { isbn },
      transaction,
    });

    if (existingByIsbn) {
      return existingByIsbn;
    }
  }

  const title = normalizeText(dto.title);
  const author = normalizeText(dto.author);
  const existingByTitleAuthor = await BookTitle.findOne({
    where: {
      title,
      author,
    },
    transaction,
  });

  if (existingByTitleAuthor) {
    return existingByTitleAuthor;
  }

  return BookTitle.create(
    {
      title,
      author,
      category: normalizeText(dto.category),
      publisher: normalizeText(dto.publisher),
      edition: normalizeText(dto.edition),
      publication_year: normalizePublicationYear(dto.publication_year),
      isbn,
      language: normalizeText(dto.language) || "Vietnamese",
      description: normalizeText(dto.description),
      cover_url: normalizeText(dto.cover_url),
    },
    { transaction },
  );
};

const getAvailableBooks = async (query = {}) => {
  const bookWhere = {};
  const keyword = normalizeText(query.keyword ?? query.q);
  const category = normalizeText(query.category);

  if (keyword) {
    bookWhere[Op.or] = [
      { title: { [Op.iLike]: `%${keyword}%` } },
      { author: { [Op.iLike]: `%${keyword}%` } },
      { category: { [Op.iLike]: `%${keyword}%` } },
      { isbn: { [Op.iLike]: `%${keyword}%` } },
    ];
  }

  if (category) {
    bookWhere.category = { [Op.iLike]: `%${category}%` };
  }

  const books = await BookCopy.findAll({
    where: {
      status: "available",
    },
    include: [
      {
        model: BookTitle,
        as: BOOK_TITLE_ALIAS,
        where: hasWhereConditions(bookWhere) ? bookWhere : undefined,
      },
      bookInclude[1],
    ],
    order: [["created_at", "DESC"]],
  });

  return books.map(sanitizeBookCopy);
};

const getMyBooks = async (memberId) => {
  const books = await BookCopy.findAll({
    where: {
      owner_id: memberId,
    },
    include: bookInclude,
    order: [["created_at", "DESC"]],
  });

  return books.map(sanitizeBookCopy);
};

const getBookById = async (copyId) => {
  const bookCopy = await BookCopy.findByPk(copyId, {
    include: bookInclude,
  });

  if (!bookCopy) {
    throw createHttpError("Không tìm thấy sách", 404);
  }

  return sanitizeBookCopy(bookCopy);
};

const getBookCopyForOwnerAction = async (memberId, copyId) => {
  const bookCopy = await BookCopy.findByPk(copyId, {
    include: bookInclude,
  });

  if (!bookCopy) {
    throw createHttpError("Không tìm thấy sách", 404);
  }

  if (bookCopy.owner_id !== memberId) {
    throw createHttpError("Bạn không có quyền thao tác với sách này", 403);
  }

  return bookCopy;
};

const createBook = async (memberId, dto) => {
  validateTitlePayload(dto);
  validateCopyPayload(dto);

  return sequelize.transaction(async (transaction) => {
    const bookTitle = await findOrCreateBookTitle(dto, transaction);
    const bookCopy = await BookCopy.create(
      {
        book_id: bookTitle.book_id,
        owner_id: memberId,
        condition: normalizeCondition(dto.condition) || "good",
        status: "available",
        exchange_type: normalizeText(dto.exchange_type) || "both",
        note: normalizeText(dto.note),
      },
      { transaction },
    );

    const createdBook = await BookCopy.findByPk(bookCopy.copy_id, {
      include: bookInclude,
      transaction,
    });

    return sanitizeBookCopy(createdBook);
  });
};

const updateBook = async (memberId, copyId, dto) => {
  const bookCopy = await getBookCopyForOwnerAction(memberId, copyId);

  if (bookCopy.status === "reserved") {
    throw createHttpError("Không thể cập nhật sách đang trong giao dịch", 400);
  }

  const updates = {};

  for (const field of updatableCopyFields) {
    if (!Object.prototype.hasOwnProperty.call(dto, field)) {
      continue;
    }

    if (field === "condition") {
      const condition = normalizeCondition(dto.condition);
      if (!condition || !validConditions.includes(condition)) {
        throw createHttpError(`condition phải là một trong: ${validConditions.join(", ")}`, 400);
      }
      updates.condition = condition;
      continue;
    }

    if (field === "exchange_type") {
      const exchangeType = normalizeText(dto.exchange_type);
      if (!exchangeType || !validExchangeTypes.includes(exchangeType)) {
        throw createHttpError(`exchange_type phải là một trong: ${validExchangeTypes.join(", ")}`, 400);
      }
      updates.exchange_type = exchangeType;
      continue;
    }

    if (field === "status") {
      const status = normalizeText(dto.status);
      if (!status || !validUpdateStatuses.includes(status)) {
        throw createHttpError(`status chỉ được cập nhật thành: ${validUpdateStatuses.join(", ")}`, 400);
      }
      updates.status = status;
      continue;
    }

    updates.note = normalizeText(dto.note);
  }

  if (Object.keys(updates).length === 0) {
    throw createHttpError("Không có trường hợp lệ để cập nhật", 400);
  }

  await bookCopy.update(updates);

  return getBookById(copyId);
};

const deleteBook = async (memberId, copyId) => {
  const bookCopy = await getBookCopyForOwnerAction(memberId, copyId);

  if (bookCopy.status === "reserved") {
    throw createHttpError("Không thể xóa sách đang trong giao dịch", 400);
  }

  await bookCopy.update({
    status: "unavailable",
  });

  return {
    copy_id: bookCopy.copy_id,
    status: "unavailable",
  };
};

const bookService = {
  getAvailableBooks,
  getMyBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  findOrCreateBookTitle,
  sanitizeBookCopy,
};

export default bookService;
