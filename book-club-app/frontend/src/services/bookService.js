import api, { apiBaseUrl, apiPath } from "./api.js";
import {
  conditionLabels,
  exchangeTypeLabels,
  getConditionLabel,
  getExchangeTypeLabel,
  getStatusLabel,
  isHiddenBookStatus,
  normalizeCategoryLabel,
  normalizeDisplayText,
  statusLabels,
} from "../utils/bookLabels.js";

export { conditionLabels, exchangeTypeLabels, statusLabels };

function unwrapResponse(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

function unwrapBookList(response) {
  const payload = unwrapResponse(response);
  const items = payload?.items || payload?.books || payload?.bookCopies || payload?.data || payload;

  return {
    items: Array.isArray(items) ? items.map(normalizeBook).filter((book) => !isHiddenBookStatus(book.status)) : [],
    pagination: payload?.pagination || response?.data?.pagination || null,
    raw: payload,
  };
}

function unwrapBook(response) {
  const payload = unwrapResponse(response);
  const book = payload?.book || payload?.item || payload;
  return normalizeBook(book);
}

function getNested(rawBook) {
  return rawBook?.bookTitle || rawBook?.book_title || rawBook?.titleInfo || {};
}

function getOwner(rawBook) {
  return rawBook?.owner || rawBook?.member || rawBook?.user || {};
}

export function resolveCoverUrl(coverUrl = "") {
  if (!coverUrl) {
    return "";
  }

  if (/^https?:\/\//i.test(coverUrl) || coverUrl.startsWith("data:") || coverUrl.startsWith("blob:")) {
    return coverUrl;
  }

  if (coverUrl.startsWith("/uploads")) {
    return `${apiBaseUrl}${coverUrl}`;
  }

  return coverUrl;
}

export function normalizeBook(rawBook = {}) {
  const titleInfo = getNested(rawBook);
  const owner = getOwner(rawBook);
  const condition = rawBook.condition || "good";
  const status = rawBook.status || "available";
  const exchangeType = rawBook.exchange_type || rawBook.exchangeType || "both";
  const coverUrl = rawBook.cover_url || rawBook.coverUrl || titleInfo.cover_url || titleInfo.coverUrl || "";

  return {
    copyId: rawBook.copy_id || rawBook.copyId || rawBook.id || "",
    bookId: rawBook.book_id || rawBook.bookId || titleInfo.book_id || titleInfo.bookId || "",
    title: normalizeDisplayText(rawBook.title || titleInfo.title, "Chưa có tên sách"),
    author: normalizeDisplayText(rawBook.author || titleInfo.author, "Chưa rõ tác giả"),
    category: normalizeCategoryLabel(rawBook.category || titleInfo.category),
    publisher: normalizeDisplayText(rawBook.publisher || titleInfo.publisher, ""),
    publicationYear: rawBook.publication_year || rawBook.publicationYear || titleInfo.publication_year || titleInfo.publicationYear || "",
    isbn: rawBook.isbn || titleInfo.isbn || "",
    language: normalizeDisplayText(rawBook.language || titleInfo.language, "Tiếng Việt"),
    description: normalizeDisplayText(rawBook.description || titleInfo.description, ""),
    coverUrl: resolveCoverUrl(coverUrl),
    condition,
    conditionLabel: getConditionLabel(condition),
    status,
    statusLabel: getStatusLabel(status),
    exchangeType,
    exchangeTypeLabel: getExchangeTypeLabel(exchangeType),
    note: normalizeDisplayText(rawBook.note, ""),
    ownerId: rawBook.owner_id || rawBook.ownerId || owner.member_id || owner.memberId || "",
    ownerName: normalizeDisplayText(owner.full_name || owner.fullName || owner.name, "Thành viên Cộng Đồng Sách"),
    raw: rawBook,
  };
}

export function toBookPayload(values) {
  return {
    title: values.title?.trim(),
    author: values.author?.trim(),
    category: values.category?.trim(),
    publisher: values.publisher?.trim() || undefined,
    publication_year: values.publication_year ? Number(values.publication_year) : undefined,
    isbn: values.isbn?.trim() || undefined,
    language: values.language?.trim() || undefined,
    condition: values.condition,
    exchange_type: values.exchange_type,
    note: values.note?.trim() || undefined,
    cover_url: values.cover_url?.trim() || undefined,
  };
}

function appendFormValue(formData, key, value) {
  if (value === undefined || value === null || value === "") {
    return;
  }

  formData.append(key, value);
}

export function toBookFormData(values) {
  const payload = toBookPayload(values);
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    appendFormValue(formData, key, value);
  });

  if (values.coverFile) {
    formData.append("cover", values.coverFile);
  }

  return formData;
}

export function getBookErrorMessage(error, fallback = "Đã có lỗi xảy ra. Vui lòng thử lại.") {
  console.error("Book API error:", error.response?.data || error.message || error);

  if (!error.response) {
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra backend.";
  }

  const status = error.response.status;

  if (status === 401) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }

  if (status === 403) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }

  if (status === 404) {
    return "Không tìm thấy sách.";
  }

  if (status === 400) {
    return "Thông tin sách chưa hợp lệ.";
  }

  return fallback;
}

export async function getBooks(params = {}) {
  const response = await api.get(apiPath("/books"), { params });
  return unwrapBookList(response);
}

export async function getMyBooks() {
  const response = await api.get(apiPath("/books/my"), { params: { limit: 100 } });
  return unwrapBookList(response);
}

export async function getBookById(copyId) {
  const response = await api.get(apiPath(`/books/${copyId}`));
  return unwrapBook(response);
}

export async function createBook(payload) {
  const response = await api.post(apiPath("/books"), toBookFormData(payload));
  return unwrapBook(response);
}

export async function updateBook(copyId, payload) {
  const response = await api.put(apiPath(`/books/${copyId}`), toBookPayload(payload));
  return unwrapBook(response);
}

export async function deleteBook(copyId) {
  const response = await api.delete(apiPath(`/books/${copyId}`));
  return unwrapBook(response);
}
