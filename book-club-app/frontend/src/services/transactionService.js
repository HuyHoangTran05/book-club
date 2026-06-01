import api, { apiPath } from "./api.js";

const MOCK_STORAGE_KEY = "book_club_mock_transactions";
const MOCK_DELAY_MS = 250;

export const isMockTransactionMode =
  String(import.meta.env?.VITE_USE_MOCK_TRANSACTION ?? "true").toLowerCase() === "true";

const initialMockTransactions = [
  {
    transaction_id: 1,
    copy_id: 1,
    transaction_type: "lending",
    status: "pending",
    giver_confirmed: false,
    receiver_confirmed: true,
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

function getUserId(user = {}) {
  return normalizeId(user.id ?? user.member_id ?? user.memberId);
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
  return {
    member_id: person.member_id ?? person.memberId ?? person.id ?? null,
    full_name: person.full_name ?? person.fullName ?? person.name ?? "Thành viên",
    email: person.email ?? "",
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
    title: book.title ?? book.bookTitle ?? book.name ?? "Chưa có tên sách",
    author: book.author ?? "Chưa rõ tác giả",
    category: book.category ?? "Khác",
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
  const transactionId = rawTransaction.transaction_id ?? rawTransaction.transactionId ?? rawTransaction.id;
  const transactionType = rawTransaction.transaction_type ?? rawTransaction.transactionType ?? rawTransaction.type ?? "lending";
  const expectedReturnDate = rawTransaction.expected_return_date ?? rawTransaction.expectedReturnDate ?? null;
  const completedAt = rawTransaction.completed_at ?? rawTransaction.completedAt ?? null;
  const createdAt = rawTransaction.created_at ?? rawTransaction.createdAt ?? new Date().toISOString();

  return {
    transaction_id: transactionId,
    transactionId,
    copy_id: rawTransaction.copy_id ?? rawTransaction.copyId ?? rawTransaction.book_copy_id ?? rawTransaction.bookCopyId ?? null,
    transaction_type: transactionType,
    transactionType,
    status: rawTransaction.status ?? "pending",
    giver_confirmed: Boolean(rawTransaction.giver_confirmed ?? rawTransaction.giverConfirmed),
    giverConfirmed: Boolean(rawTransaction.giver_confirmed ?? rawTransaction.giverConfirmed),
    receiver_confirmed: Boolean(rawTransaction.receiver_confirmed ?? rawTransaction.receiverConfirmed),
    receiverConfirmed: Boolean(rawTransaction.receiver_confirmed ?? rawTransaction.receiverConfirmed),
    expected_return_date: expectedReturnDate,
    expectedReturnDate,
    completed_at: completedAt,
    completedAt,
    created_at: createdAt,
    createdAt,
    delivery_confirmed: Boolean(rawTransaction.delivery_confirmed ?? rawTransaction.deliveryConfirmed),
    deliveryConfirmed: Boolean(rawTransaction.delivery_confirmed ?? rawTransaction.deliveryConfirmed),
    book: normalizeBook(getTransactionBook(rawTransaction)),
    giver: normalizePerson(rawTransaction.giver ?? rawTransaction.owner ?? rawTransaction.fromMember),
    receiver: normalizePerson(rawTransaction.receiver ?? rawTransaction.borrower ?? rawTransaction.toMember),
    raw: rawTransaction,
  };
}

function toApiPayload(payload = {}) {
  return {
    copy_id: payload.copy_id ?? payload.copyId ?? payload.id,
    transaction_type: payload.transaction_type ?? payload.transactionType ?? "lending",
    expected_return_date: payload.expected_return_date ?? payload.expectedReturnDate ?? null,
  };
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
    giver_confirmed: false,
    receiver_confirmed: true,
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
  };

  const nextTransactions = [transaction, ...transactions];
  saveMockTransactions(nextTransactions);
  return normalizeTransaction(transaction);
}

function getRoleForUser(transaction, currentUser = {}) {
  const userId = getUserId(currentUser);
  const userEmail = currentUser.email;
  const giver = normalizePerson(transaction.giver);
  const receiver = normalizePerson(transaction.receiver);

  if (userId && normalizeId(giver.member_id) === userId) {
    return "giver";
  }

  if (userId && normalizeId(receiver.member_id) === userId) {
    return "receiver";
  }

  if (userEmail && giver.email === userEmail) {
    return "giver";
  }

  if (userEmail && receiver.email === userEmail) {
    return "receiver";
  }

  return "receiver";
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
    };

    if (updatedTransaction.giver_confirmed && updatedTransaction.receiver_confirmed) {
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

  return fallback;
}

export async function getMyTransactions() {
  if (isMockTransactionMode) {
    return mockGetMyTransactions();
  }

  const response = await api.get(apiPath("/transactions/my"));
  const payload = unwrapResponse(response);
  const transactions = payload?.items ?? payload?.transactions ?? payload;
  return Array.isArray(transactions) ? transactions.map(normalizeTransaction) : [];
}

export async function createTransaction(payload) {
  if (isMockTransactionMode) {
    return mockCreateTransaction(payload);
  }

  const response = await api.post(apiPath("/transactions"), toApiPayload(payload));
  return normalizeTransaction(unwrapResponse(response));
}

export async function confirmTransaction(transactionId, currentUser) {
  if (isMockTransactionMode) {
    return mockConfirmTransaction(transactionId, currentUser);
  }

  const response = await api.put(apiPath(`/transactions/${transactionId}/confirm`));
  return normalizeTransaction(unwrapResponse(response));
}

export async function cancelTransaction(transactionId) {
  if (isMockTransactionMode) {
    return mockCancelTransaction(transactionId);
  }

  const response = await api.put(apiPath(`/transactions/${transactionId}/cancel`));
  return normalizeTransaction(unwrapResponse(response));
}

export async function getTransactionById(transactionId) {
  if (isMockTransactionMode) {
    return mockGetTransactionById(transactionId);
  }

  const response = await api.get(apiPath(`/transactions/${transactionId}`));
  return normalizeTransaction(unwrapResponse(response));
}
