import api, { apiPath } from "./api.js";

const MOCK_STORAGE_KEY = "book_club_mock_transactions";
const MOCK_DELAY_MS = 250;
const STALE_MOCK_STORAGE_KEYS = [
  "book_club_mock_transactions",
  "mock_transactions",
  "mockTransactions",
  "transaction_mock_data",
];

const USE_MOCK_TRANSACTION = import.meta.env.VITE_USE_MOCK_TRANSACTION === "true";

export const isMockTransactionMode = USE_MOCK_TRANSACTION;

if (import.meta.env.DEV) {
  console.log("Transaction mock mode:", USE_MOCK_TRANSACTION);
}

if (!USE_MOCK_TRANSACTION && typeof localStorage !== "undefined") {
  STALE_MOCK_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
}

const initialMockTransactions = [
  {
    transaction_id: 1,
    copy_id: 1,
    transaction_type: "lending",
    status: "pending",
    giver_id: 1,
    receiver_id: 2,
    deliverer_id: null,
    giver_confirmed: false,
    receiver_confirmed: true,
    delivery_confirmed: false,
    expected_return_date: "2026-06-15",
    completed_at: null,
    created_at: "2026-06-01T10:00:00.000Z",
    book: {
      title: "Nhà Giả Kim",
      author: "Paulo Coelho",
      category: "Tiểu thuyết",
    },
    giver: {
      member_id: 1,
      full_name: "Nguyễn Văn An",
      email: "an@example.com",
    },
    receiver: {
      member_id: 2,
      full_name: "Trần Bình",
      email: "binh@example.com",
    },
    deliverer: null,
  },
];

function delay(value) {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(value), MOCK_DELAY_MS);
  });
}

function unwrapResponse(response) {
  const body = response?.data ?? response;
  return body?.data ?? body;
}

function normalizeId(value) {
  return value === undefined || value === null || value === "" ? "" : String(value);
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function getUserId(user = {}) {
  return normalizeId(user.member_id ?? user.memberId ?? user.id);
}

export function getUserDisplayName(user = {}) {
  return firstDefined(user.full_name, user.fullName, user.name, user.email, "Chưa rõ");
}

function getBackendMessage(error) {
  const data = error?.response?.data;
  return data?.message || data?.error || data?.data?.message || "";
}

function getStoredMockTransactions() {
  try {
    const storedValue = localStorage.getItem(MOCK_STORAGE_KEY);

    if (!storedValue) {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initialMockTransactions));
      return initialMockTransactions;
    }

    const parsedValue = JSON.parse(storedValue);
    return Array.isArray(parsedValue) ? parsedValue : initialMockTransactions;
  } catch (error) {
    console.error("Transaction error:", error.response?.data || error.message);
    localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(initialMockTransactions));
    return initialMockTransactions;
  }
}

function saveMockTransactions(transactions) {
  localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(transactions));
}

function normalizePerson(person = {}) {
  if (!person) {
    return null;
  }

  return {
    member_id: firstDefined(person.member_id, person.memberId, person.id, null),
    memberId: firstDefined(person.member_id, person.memberId, person.id, null),
    full_name: getUserDisplayName(person),
    fullName: getUserDisplayName(person),
    email: person.email ?? "",
    raw: person,
  };
}

function normalizeBookFromTransaction(transaction = {}) {
  const bookCopy = transaction.bookCopy ?? {};
  const bookCopyTitle = bookCopy.bookTitle ?? {};
  const bookCopyBook = bookCopy.book ?? {};
  const snakeBookCopy = transaction.book_copy ?? {};
  const snakeBookTitle = snakeBookCopy.book_title ?? {};
  const bookTitle = transaction.bookTitle ?? {};
  const book = transaction.book ?? {};

  return {
    title: firstDefined(
      bookCopyTitle.title,
      bookCopyBook.title,
      snakeBookTitle.title,
      bookTitle.title,
      book.title,
      transaction.title,
      "Chưa có tên sách"
    ),
    author: firstDefined(
      bookCopyTitle.author,
      bookCopyBook.author,
      snakeBookTitle.author,
      bookTitle.author,
      book.author,
      transaction.author,
      "Chưa rõ tác giả"
    ),
    category: firstDefined(
      bookCopyTitle.category,
      bookCopyBook.category,
      snakeBookTitle.category,
      bookTitle.category,
      book.category,
      transaction.category,
      "Khác"
    ),
  };
}

function normalizeBook(book = {}) {
  if (typeof book === "string") {
    return {
      title: book,
      author: "Chưa rõ tác giả",
      category: "Khác",
    };
  }

  return {
    title: firstDefined(book.title, book.bookTitle, book.name, "Chưa có tên sách"),
    author: firstDefined(book.author, "Chưa rõ tác giả"),
    category: firstDefined(book.category, "Khác"),
  };
}

function getTransactionBook(rawTransaction = {}) {
  const bookCopy = rawTransaction.bookCopy ?? rawTransaction.book_copy ?? rawTransaction.copy ?? {};
  const bookTitle = bookCopy.bookTitle ?? bookCopy.book_title ?? {};

  return (
    rawTransaction.book ??
    {
      title: rawTransaction.bookTitle ?? rawTransaction.title ?? bookTitle.title,
      author: rawTransaction.author ?? bookTitle.author,
      category: rawTransaction.category ?? bookTitle.category,
    }
  );
}

export function normalizeTransaction(rawTransaction = {}) {
  const transactionId = firstDefined(rawTransaction.transaction_id, rawTransaction.transactionId, rawTransaction.id);
  const transactionType = firstDefined(rawTransaction.transaction_type, rawTransaction.transactionType, rawTransaction.type, "lending");
  const expectedReturnDate = firstDefined(rawTransaction.expected_return_date, rawTransaction.expectedReturnDate, null);
  const completedAt = firstDefined(rawTransaction.completed_at, rawTransaction.completedAt, null);
  const createdAt = firstDefined(rawTransaction.created_at, rawTransaction.createdAt, new Date().toISOString());
  const giver = normalizePerson(firstDefined(rawTransaction.giver, rawTransaction.owner, {}));
  const receiver = normalizePerson(firstDefined(rawTransaction.receiver, {}));
  const delivererSource = firstDefined(rawTransaction.deliverer, null);
  const deliverer = delivererSource ? normalizePerson(delivererSource) : null;
  const giverId = firstDefined(rawTransaction.giver_id, rawTransaction.giverId, giver?.member_id, null);
  const receiverId = firstDefined(rawTransaction.receiver_id, rawTransaction.receiverId, receiver?.member_id, null);
  const delivererId = firstDefined(rawTransaction.deliverer_id, rawTransaction.delivererId, deliverer?.member_id, null);

  return {
    transaction_id: transactionId,
    transactionId,
    copy_id: firstDefined(
      rawTransaction.copy_id,
      rawTransaction.copyId,
      rawTransaction.bookCopy?.copy_id,
      rawTransaction.bookCopy?.copyId,
      rawTransaction.book_copy?.copy_id,
      null
    ),
    transaction_type: transactionType,
    transactionType,
    status: firstDefined(rawTransaction.status, "pending"),
    giver_id: giverId,
    giverId,
    receiver_id: receiverId,
    receiverId,
    deliverer_id: delivererId,
    delivererId,
    giver_confirmed: Boolean(firstDefined(rawTransaction.giver_confirmed, rawTransaction.giverConfirmed, false)),
    giverConfirmed: Boolean(firstDefined(rawTransaction.giver_confirmed, rawTransaction.giverConfirmed, false)),
    receiver_confirmed: Boolean(firstDefined(rawTransaction.receiver_confirmed, rawTransaction.receiverConfirmed, false)),
    receiverConfirmed: Boolean(firstDefined(rawTransaction.receiver_confirmed, rawTransaction.receiverConfirmed, false)),
    delivery_confirmed: Boolean(firstDefined(rawTransaction.delivery_confirmed, rawTransaction.deliveryConfirmed, false)),
    deliveryConfirmed: Boolean(firstDefined(rawTransaction.delivery_confirmed, rawTransaction.deliveryConfirmed, false)),
    expected_return_date: expectedReturnDate,
    expectedReturnDate,
    completed_at: completedAt,
    completedAt,
    created_at: createdAt,
    createdAt,
<<<<<<< HEAD
    delivery_confirmed: Boolean(rawTransaction.delivery_confirmed ?? rawTransaction.deliveryConfirmed),
    deliveryConfirmed: Boolean(rawTransaction.delivery_confirmed ?? rawTransaction.deliveryConfirmed),
    book: normalizeBook(getTransactionBook(rawTransaction)),
    giver: normalizePerson(rawTransaction.giver ?? rawTransaction.owner ?? rawTransaction.fromMember),
    receiver: normalizePerson(rawTransaction.receiver ?? rawTransaction.borrower ?? rawTransaction.toMember),
=======
    book: normalizeBookFromTransaction(rawTransaction),
    giver: giver ?? normalizePerson({}),
    receiver: receiver ?? normalizePerson({}),
    deliverer,
>>>>>>> b86729fa19f3247762b376c4cf29fe281ea4f5cf
    raw: rawTransaction,
  };
}

function toApiPayload(payload = {}) {
  const apiPayload = {
    copy_id: payload.copy_id ?? payload.copyId ?? payload.id,
    transaction_type: payload.transaction_type ?? payload.transactionType ?? "lending",
  };

  const expectedReturnDate = payload.expected_return_date ?? payload.expectedReturnDate;

  if (expectedReturnDate) {
    apiPayload.expected_return_date = expectedReturnDate;
  }

  const delivererId = payload.deliverer_id ?? payload.delivererId;

  if (delivererId) {
    apiPayload.deliverer_id = delivererId;
  }

  return apiPayload;
}

function createMockTransaction(payload = {}) {
  const transactions = getStoredMockTransactions();
  const book = payload._book ?? {};
  const currentUser = payload._currentUser ?? {};
  const receiverId = getUserId(currentUser) || 2;
  const rawOwnerId = book.ownerId ?? book.owner_id ?? book.raw?.owner_id ?? book.raw?.owner?.member_id;
  const ownerId = normalizeId(rawOwnerId) && normalizeId(rawOwnerId) !== normalizeId(receiverId) ? rawOwnerId : 99;
  const nextId = transactions.reduce((maxId, transaction) => Math.max(maxId, Number(transaction.transaction_id ?? 0)), 0) + 1;

  const transaction = {
    transaction_id: nextId,
    copy_id: payload.copy_id ?? payload.copyId ?? book.copyId ?? book.copy_id ?? book.id,
    transaction_type: payload.transaction_type ?? payload.transactionType ?? "lending",
    status: "pending",
    giver_id: ownerId,
    receiver_id: receiverId,
    deliverer_id: null,
    giver_confirmed: false,
    receiver_confirmed: true,
    delivery_confirmed: false,
    expected_return_date: payload.expected_return_date ?? payload.expectedReturnDate ?? null,
    completed_at: null,
    created_at: new Date().toISOString(),
    book: normalizeBook(book),
    giver: {
      member_id: ownerId,
      full_name: book.ownerName ?? book.owner?.full_name ?? book.raw?.owner?.full_name ?? "Chủ sách",
      email: book.ownerEmail ?? book.raw?.owner?.email ?? "",
    },
    receiver: {
      member_id: receiverId,
      full_name: currentUser.full_name ?? currentUser.fullName ?? currentUser.name ?? "Bạn",
      email: currentUser.email ?? "",
    },
    deliverer: null,
  };

  const nextTransactions = [transaction, ...transactions];
  saveMockTransactions(nextTransactions);
  return normalizeTransaction(transaction);
}

function getRoleForUser(transaction, currentUser = {}) {
  const userId = getUserId(currentUser);
  const userEmail = currentUser.email;
  const normalizedTransaction = normalizeTransaction(transaction);

  if (userId && normalizeId(normalizedTransaction.giver_id) === userId) {
    return "giver";
  }

  if (userId && normalizeId(normalizedTransaction.receiver_id) === userId) {
    return "receiver";
  }

  if (userId && normalizeId(normalizedTransaction.deliverer_id) === userId) {
    return "deliverer";
  }

  if (userEmail && normalizedTransaction.giver?.email === userEmail) {
    return "giver";
  }

  if (userEmail && normalizedTransaction.receiver?.email === userEmail) {
    return "receiver";
  }

  if (userEmail && normalizedTransaction.deliverer?.email === userEmail) {
    return "deliverer";
  }

  return null;
}

function updateMockTransaction(transactionId, updater) {
  const transactions = getStoredMockTransactions();
  const targetId = normalizeId(transactionId);
  let updatedTransaction = null;

  const nextTransactions = transactions.map((transaction) => {
    if (normalizeId(transaction.transaction_id ?? transaction.id) !== targetId) {
      return transaction;
    }

    updatedTransaction = updater(transaction);
    return updatedTransaction;
  });

  if (!updatedTransaction) {
    const error = new Error("Không tìm thấy giao dịch.");
    error.response = { status: 404 };
    throw error;
  }

  saveMockTransactions(nextTransactions);
  return normalizeTransaction(updatedTransaction);
}

async function mockGetMyTransactions() {
  return delay(getStoredMockTransactions().map(normalizeTransaction));
}

async function mockGetTransactionById(transactionId) {
  const transaction = getStoredMockTransactions().find(
    (item) => normalizeId(item.transaction_id ?? item.id) === normalizeId(transactionId)
  );

  if (!transaction) {
    const error = new Error("Không tìm thấy giao dịch.");
    error.response = { status: 404 };
    throw error;
  }

  return delay(normalizeTransaction(transaction));
}

async function mockCreateTransaction(payload) {
  return delay(createMockTransaction(payload));
}

async function mockConfirmTransaction(transactionId, currentUser) {
  const transaction = updateMockTransaction(transactionId, (currentTransaction) => {
    if (currentTransaction.status !== "pending") {
      return currentTransaction;
    }

    const role = getRoleForUser(currentTransaction, currentUser);
    const updatedTransaction = {
      ...currentTransaction,
      giver_confirmed: role === "giver" ? true : currentTransaction.giver_confirmed,
      receiver_confirmed: role === "receiver" ? true : currentTransaction.receiver_confirmed,
      delivery_confirmed: role === "deliverer" ? true : currentTransaction.delivery_confirmed,
    };

    const needsDelivery = Boolean(updatedTransaction.deliverer_id || updatedTransaction.deliverer);

    if (
      updatedTransaction.giver_confirmed &&
      updatedTransaction.receiver_confirmed &&
      (!needsDelivery || updatedTransaction.delivery_confirmed)
    ) {
      updatedTransaction.status = "completed";
      updatedTransaction.completed_at = new Date().toISOString();
    }

    return updatedTransaction;
  });

  return delay(transaction);
}

async function mockCancelTransaction(transactionId) {
  const transaction = updateMockTransaction(transactionId, (currentTransaction) => ({
    ...currentTransaction,
    status: currentTransaction.status === "completed" ? currentTransaction.status : "cancelled",
  }));

  return delay(transaction);
}

export function getTransactionErrorMessage(error, fallback = "Đã có lỗi xảy ra. Vui lòng thử lại.") {
  console.error("Transaction error:", error.response?.data || error.message);

  if (!error.response) {
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra backend.";
  }

  if (error.response.status === 401) {
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }

  if (error.response.status === 403) {
    return "Bạn không có quyền thực hiện thao tác này.";
  }

  if (error.response.status === 404) {
    return "Không tìm thấy giao dịch.";
  }

  if (error.response.status === 409) {
    return "Giao dịch không thể thực hiện ở trạng thái hiện tại.";
  }

  const backendMessage = getBackendMessage(error);
  return backendMessage || fallback;
}

export function getCreateTransactionErrorMessage(error) {
  console.error("Create transaction failed:", error.response?.data || error.message);

  if (!error.response) {
    return "Không thể kết nối máy chủ. Vui lòng kiểm tra backend.";
  }

  const backendMessage = getBackendMessage(error);
  const normalizedMessage = backendMessage.toLowerCase();

  if (normalizedMessage.includes("does not support this transaction type")) {
    return "Cuốn sách này không hỗ trợ hình thức giao dịch đã chọn.";
  }

  if (
    error.response.status === 400 &&
    (normalizedMessage.includes("điểm") ||
      normalizedMessage.includes("point") ||
      normalizedMessage.includes("không đủ") ||
      normalizedMessage.includes("insufficient"))
  ) {
    return "Bạn không đủ điểm để thực hiện giao dịch này.";
  }

  if (
    normalizedMessage.includes("own book") ||
    normalizedMessage.includes("your own book") ||
    normalizedMessage.includes("chính mình")
  ) {
    return "Bạn không thể tạo giao dịch với sách của chính mình.";
  }

  if (error.response.status === 409) {
    return "Sách này hiện không còn sẵn sàng.";
  }

  if (
    normalizedMessage.includes("not available") ||
    normalizedMessage.includes("không còn sẵn") ||
    normalizedMessage.includes("không sẵn sàng")
  ) {
    return "Sách này hiện không còn sẵn sàng.";
  }

  return backendMessage || "Không thể tạo giao dịch. Vui lòng thử lại.";
}

export async function getMyTransactions() {
  if (USE_MOCK_TRANSACTION) {
    return mockGetMyTransactions();
  }

  const response = await api.get(apiPath("/transactions/my"));
  const payload = unwrapResponse(response);
  const transactions = payload?.items ?? payload?.transactions ?? payload;
  const normalizedTransactions = Array.isArray(transactions) ? transactions.map(normalizeTransaction) : [];

  if (import.meta.env.DEV) {
    console.log("Transactions from real API:", normalizedTransactions);
  }

  return normalizedTransactions;
}

export async function createTransaction(payload) {
  if (USE_MOCK_TRANSACTION) {
    return mockCreateTransaction(payload);
  }

  const response = await api.post(apiPath("/transactions"), toApiPayload(payload));
  return normalizeTransaction(unwrapResponse(response));
}

export async function confirmTransaction(transactionId, currentUser) {
  if (USE_MOCK_TRANSACTION) {
    return mockConfirmTransaction(transactionId, currentUser);
  }

  const response = await api.put(apiPath(`/transactions/${transactionId}/confirm`));
  return normalizeTransaction(unwrapResponse(response));
}

export async function cancelTransaction(transactionId) {
  if (USE_MOCK_TRANSACTION) {
    return mockCancelTransaction(transactionId);
  }

  const response = await api.put(apiPath(`/transactions/${transactionId}/cancel`));
  return normalizeTransaction(unwrapResponse(response));
}

export async function getTransactionById(transactionId) {
  if (USE_MOCK_TRANSACTION) {
    return mockGetTransactionById(transactionId);
  }

  const response = await api.get(apiPath(`/transactions/${transactionId}`));
  return normalizeTransaction(unwrapResponse(response));
}
