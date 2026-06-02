import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { categoryOptions } from "../components/books/bookOptions.js";
import { Alert } from "../components/common/index.js";
import { getBookErrorMessage, getBooks, resolveCoverUrl } from "../services/bookService.js";
import { createTransaction, getCreateTransactionErrorMessage } from "../services/transactionService.js";
import {
  displayAuthorName,
  displayBookTitle,
  displayCategory,
  displayCondition,
  displayExchangeType,
  displayOwnerName,
  getStatusLabel,
  isHiddenBookStatus,
  normalizeDisplayText,
} from "../utils/bookLabels.js";
import "./BookListPage.css";

function normalizeText(value, fallback = "Chưa rõ") {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return String(value);
}

function normalizeId(value) {
  return value === undefined || value === null || value === "" ? "" : String(value);
}

function getRawBook(book) {
  return book?.raw || book || {};
}

function getTitle(book) {
  const rawBook = getRawBook(book);
  return displayBookTitle(book?.title || rawBook.title || rawBook.bookTitle?.title || rawBook.book?.title);
}

function getAuthor(book) {
  const rawBook = getRawBook(book);
  return displayAuthorName(book?.author || rawBook.author || rawBook.bookTitle?.author || rawBook.book?.author);
}

function getCategory(book) {
  const rawBook = getRawBook(book);
  return displayCategory(book?.category || rawBook.category || rawBook.bookTitle?.category || rawBook.book?.category);
}

function getOwnerName(book) {
  const rawBook = getRawBook(book);
  const ownerName =
    rawBook.owner?.full_name ||
    rawBook.owner?.fullName ||
    rawBook.owner?.name ||
    rawBook.member?.full_name ||
    rawBook.member?.name ||
    book?.ownerName;

  return ownerName && ownerName !== "Thành viên Cộng Đồng Sách" ? displayOwnerName(ownerName) : "Chưa rõ";
}

function getDescription(book) {
  const rawBook = getRawBook(book);
  return normalizeText(
    book?.description || book?.note || rawBook.description || rawBook.note || rawBook.bookTitle?.description || rawBook.book?.description,
    "Chưa có mô tả cho cuốn sách này."
  );
}

function getExchangeTypeLabel(book) {
  return displayExchangeType(book?.exchangeType || book?.exchange_type || book?.raw?.exchange_type || book?.exchangeTypeLabel);
}

function normalizeExchangeType(value) {
  const normalizedValue = String(value || "").trim().toLowerCase();

  if (normalizedValue === "lending" || normalizedValue === "cho mượn") {
    return "lending";
  }

  if (normalizedValue === "permanent" || normalizedValue === "trao đổi vĩnh viễn") {
    return "permanent";
  }

  if (normalizedValue === "both" || normalizedValue === "trao đổi hoặc cho mượn") {
    return "both";
  }

  return "";
}

function getAllowedTransactionTypes(book) {
  const rawBook = getRawBook(book);
  const exchangeType = normalizeExchangeType(
    book?.exchange_type || book?.exchangeType || rawBook.exchange_type || rawBook.exchangeType || book?.exchangeTypeLabel
  );

  if (exchangeType === "lending") {
    return [{ value: "lending", label: "Cho mượn" }];
  }

  if (exchangeType === "permanent") {
    return [{ value: "permanent", label: "Trao đổi vĩnh viễn" }];
  }

  if (exchangeType === "both") {
    return [
      { value: "lending", label: "Cho mượn" },
      { value: "permanent", label: "Trao đổi vĩnh viễn" },
    ];
  }

  return [];
}

function getCoverUrl(book) {
  const rawBook = getRawBook(book);
  return resolveCoverUrl(book?.coverUrl || rawBook.cover_url || rawBook.coverUrl || rawBook.bookTitle?.cover_url || rawBook.book?.cover_url || "");
}

function getConditionLabel(book) {
  return displayCondition(book?.condition || book?.raw?.condition || book?.conditionLabel);
}

function getBookKey(book) {
  return book?.copyId || book?.bookId || getRawBook(book).copy_id || getTitle(book);
}

function getCopyId(book) {
  const rawBook = getRawBook(book);
  return book?.copyId || book?.copy_id || rawBook.copy_id || rawBook.copyId || rawBook.id || book?.id;
}

function getCurrentUserId(user = {}) {
  return normalizeId(user.id ?? user.member_id ?? user.memberId);
}

function getCurrentUserName(user = {}) {
  return displayOwnerName(user.full_name ?? user.fullName ?? user.name ?? "");
}

function bookBelongsToUser(book, user) {
  const rawBook = getRawBook(book);
  const userId = getCurrentUserId(user);
  const ownerId = normalizeId(
    book?.ownerId ??
      book?.owner_id ??
      rawBook.owner_id ??
      rawBook.ownerId ??
      rawBook.owner?.member_id ??
      rawBook.owner?.memberId ??
      rawBook.owner?.id ??
      rawBook.member?.member_id ??
      rawBook.member?.id
  );
  const ownerEmail = rawBook.owner?.email || rawBook.member?.email || book?.ownerEmail;
  const userName = getCurrentUserName(user);

  if (userId && ownerId && userId === ownerId) {
    return true;
  }

  if (user?.email && ownerEmail && user.email === ownerEmail) {
    return true;
  }

  return Boolean(userName && getOwnerName(book) === userName);
}

function getInitialReturnDate() {
  const date = new Date();
  date.setDate(date.getDate() + 14);
  return date.toISOString().slice(0, 10);
}

function BookListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [transactionValues, setTransactionValues] = useState({
    transaction_type: "lending",
    expected_return_date: getInitialReturnDate(),
    deliverer_id: "",
  });

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getBooks({ limit: 100 });
      setBooks(result.items);
    } catch (loadError) {
      setError(getBookErrorMessage(loadError, "Không thể tải danh sách sách. Vui lòng thử lại."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return books.filter((book) => {
      if (isHiddenBookStatus(book.status)) {
        return false;
      }

      const searchText = `${getTitle(book)} ${getAuthor(book)} ${getCategory(book)}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchText.includes(normalizedSearch);
      const matchesCategory = categoryFilter === "all" || getCategory(book) === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [books, categoryFilter, searchTerm]);

  const allowedTransactionTypes = useMemo(() => getAllowedTransactionTypes(selectedBook), [selectedBook]);
  const hasValidTransactionType = allowedTransactionTypes.length > 0;

  function openTransactionModal(book) {
    const allowedTypes = getAllowedTransactionTypes(book);

    setSelectedBook(book);
    setMessage("");
    setMessageType("error");
    setTransactionValues({
      transaction_type: allowedTypes[0]?.value || "",
      expected_return_date: getInitialReturnDate(),
      deliverer_id: "",
    });
  }

  function closeTransactionModal() {
    if (isCreating) {
      return;
    }

    setSelectedBook(null);
  }

  function handleContactOwner(book) {
    const ownerName = getOwnerName(book);
    setMessageType("success");
    setMessage(`Chủ sách: ${ownerName}. Vui lòng liên hệ qua thông tin thành viên nếu có.`);
  }

  async function handleCreateTransaction(event) {
    event.preventDefault();

    if (!selectedBook) {
      return;
    }

    const allowedTypes = getAllowedTransactionTypes(selectedBook);
    const isSupportedTransactionType = allowedTypes.some((type) => type.value === transactionValues.transaction_type);

    if (!isSupportedTransactionType) {
      setMessageType("error");
      setMessage("Cuốn sách này chưa có hình thức giao dịch hợp lệ.");
      return;
    }

    if (transactionValues.transaction_type === "lending" && !transactionValues.expected_return_date) {
      setMessageType("error");
      setMessage("Vui lòng chọn ngày dự kiến trả.");
      return;
    }

    setIsCreating(true);
    setMessage("");

    const payload = {
      copy_id: getCopyId(selectedBook),
      transaction_type: transactionValues.transaction_type,
      expected_return_date:
        transactionValues.transaction_type === "lending" ? transactionValues.expected_return_date : null,
      _book: selectedBook,
      _currentUser: user,
    };

    if (transactionValues.deliverer_id) {
      payload.deliverer_id = transactionValues.deliverer_id;
    }

    try {
      await createTransaction(payload);
      setBooks((currentBooks) =>
        currentBooks.map((book) =>
          normalizeId(getCopyId(book)) === normalizeId(getCopyId(selectedBook))
            ? { ...book, status: "reserved", statusLabel: getStatusLabel("reserved") }
            : book
        )
      );
      navigate("/transactions", { state: { message: "Tạo giao dịch thành công." } });
    } catch (createError) {
      setMessageType("error");
      setMessage(getCreateTransactionErrorMessage(createError));
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="booklist-page">
      <section className="booklist-hero">
        <div>
          <p className="booklist-eyebrow">Thư viện cộng đồng</p>
          <h1>Khám phá sách</h1>
          <p className="booklist-description">
            Tìm kiếm những cuốn sách đang được thành viên chia sẻ trong cộng đồng học thuật, trao đổi kiến thức và mở rộng hiểu biết.
          </p>
        </div>

        <div className="booklist-summary">
          <article className="booklist-summary-card">
            <span className="booklist-summary-icon">□</span>
            <strong>{filteredBooks.length} sách</strong>
            <p>Đang hiển thị</p>
          </article>
          <article className="booklist-summary-card">
            <span className="booklist-summary-icon">◇</span>
            <strong>{books.length} sách mới</strong>
            <p>Trong thư viện</p>
          </article>
        </div>
      </section>

      {message ? <Alert type={messageType}>{message}</Alert> : null}

      <section className="booklist-filter-panel" aria-label="Tìm kiếm và lọc sách">
        <label className="booklist-search-field" htmlFor="booklist-search">
          <span>Tìm kiếm</span>
          <input
            id="booklist-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Tìm theo tên sách, tác giả hoặc thể loại"
          />
        </label>

        <label className="booklist-category-field" htmlFor="booklist-category">
          <span>Thể loại</span>
          <select id="booklist-category" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">Tất cả thể loại</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <button className="booklist-search-button" type="button">
          Tìm kiếm
        </button>
      </section>

      {loading ? (
        <section className="booklist-state-card" aria-live="polite">
          Đang tải danh sách sách...
        </section>
      ) : null}

      {!loading && error ? (
        <section className="booklist-state-card booklist-state-card-error" role="alert">
          <h2>Không thể tải danh sách sách</h2>
          <p>{error}</p>
          <button type="button" onClick={fetchBooks}>
            Thử lại
          </button>
        </section>
      ) : null}

      {!loading && !error && filteredBooks.length === 0 ? (
        <section className="booklist-state-card">
          <h2>Chưa có sách nào trong cộng đồng.</h2>
          <p>Hãy thử đổi từ khóa hoặc quay lại sau khi có thêm sách mới.</p>
        </section>
      ) : null}

      {!loading && !error && filteredBooks.length > 0 ? (
        <section className="booklist-grid" aria-label="Danh sách sách">
          {filteredBooks.map((book) => {
            const ownerName = getOwnerName(book);
            const coverUrl = getCoverUrl(book);
            const isOwnBook = bookBelongsToUser(book, user);
            const canCreateTransaction = book.status === "available" && !isOwnBook;

            return (
              <article className="booklist-card" key={getBookKey(book)}>
                <div className="booklist-cover-wrap">
                  {coverUrl ? (
                    <img className="booklist-cover" src={coverUrl} alt={`Bìa sách ${getTitle(book)}`} loading="lazy" />
                  ) : (
                    <div className="booklist-cover-placeholder" aria-hidden="true">
                      <span>□</span>
                    </div>
                  )}
                </div>

                <div className="booklist-card-tags">
                  <span>{getCategory(book)}</span>
                  <span className="booklist-status-tag">
                    {normalizeDisplayText(book?.statusLabel || getStatusLabel(book.status), "Không rõ")}
                  </span>
                  {isOwnBook ? <span className="booklist-own-tag">Sách của bạn</span> : null}
                </div>

                <h2>{getTitle(book)}</h2>
                <p className="booklist-author">{getAuthor(book)}</p>
                <p className="booklist-card-description">{getDescription(book)}</p>

                <dl className="booklist-meta">
                  <div>
                    <dt>Tình trạng</dt>
                    <dd>{getConditionLabel(book)}</dd>
                  </div>
                  <div>
                    <dt>Hình thức</dt>
                    <dd>{getExchangeTypeLabel(book)}</dd>
                  </div>
                </dl>

                <div className="booklist-owner">
                  <span className="booklist-owner-avatar" aria-hidden="true">
                    ○
                  </span>
                  <p>
                    Chủ sách: <strong>{ownerName}</strong>
                  </p>
                </div>

                <div className={canCreateTransaction ? "booklist-card-actions" : "booklist-card-actions booklist-card-actions-single"}>
                  <button className="booklist-contact-button" type="button" onClick={() => handleContactOwner(book)}>
                    Liên hệ chủ sách
                  </button>
                  {canCreateTransaction ? (
                    <button className="booklist-transaction-button" type="button" onClick={() => openTransactionModal(book)}>
                      Tạo giao dịch
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      {selectedBook ? (
        <div className="booklist-modal-backdrop">
          <form className="booklist-transaction-modal" onSubmit={handleCreateTransaction}>
            <div className="booklist-modal-header">
              <div>
                <p>Tạo yêu cầu mới</p>
                <h2>Tạo giao dịch sách</h2>
              </div>
              <button type="button" onClick={closeTransactionModal} disabled={isCreating}>
                Đóng
              </button>
            </div>

            <div className="booklist-modal-book">
              <h3>{getTitle(selectedBook)}</h3>
              <p>{getAuthor(selectedBook)}</p>
              <span>{getCategory(selectedBook)}</span>
            </div>

            <label className="booklist-modal-field" htmlFor="transaction-type">
              <span>Hình thức giao dịch</span>
              <select
                id="transaction-type"
                value={transactionValues.transaction_type}
                disabled={!hasValidTransactionType || isCreating}
                onChange={(event) =>
                  setTransactionValues((currentValues) => ({
                    ...currentValues,
                    transaction_type: event.target.value,
                  }))
                }
              >
                {allowedTransactionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>

            {!hasValidTransactionType ? (
              <p className="booklist-point-notice">Cuốn sách này chưa có hình thức giao dịch hợp lệ.</p>
            ) : null}

            {transactionValues.transaction_type === "lending" ? (
              <label className="booklist-modal-field" htmlFor="expected-return-date">
                <span>Ngày dự kiến trả</span>
                <input
                  id="expected-return-date"
                  type="date"
                  value={transactionValues.expected_return_date}
                  onChange={(event) =>
                    setTransactionValues((currentValues) => ({
                      ...currentValues,
                      expected_return_date: event.target.value,
                    }))
                  }
                  required
                />
              </label>
            ) : null}

            <label className="booklist-modal-field" htmlFor="deliverer-id">
              <span>Người giao sách (tùy chọn)</span>
              <select
                id="deliverer-id"
                value={transactionValues.deliverer_id}
                disabled
                onChange={(event) =>
                  setTransactionValues((currentValues) => ({
                    ...currentValues,
                    deliverer_id: event.target.value,
                  }))
                }
              >
                <option value="">Không chọn người giao sách</option>
              </select>
            </label>
            <p className="booklist-point-notice">
              Chưa có API danh sách người giao sách, nên giao dịch hiện sẽ tạo không kèm người giao.
            </p>

            {hasValidTransactionType ? (
              <p className="booklist-point-notice">
                {transactionValues.transaction_type === "lending"
                  ? "Bạn sẽ dùng 5 điểm cho giao dịch này."
                  : "Bạn sẽ dùng 10 điểm cho giao dịch này."}
              </p>
            ) : null}

            <div className="booklist-modal-actions">
              <button type="button" className="booklist-contact-button" onClick={closeTransactionModal} disabled={isCreating}>
                Hủy
              </button>
              <button type="submit" className="booklist-transaction-button" disabled={isCreating || !hasValidTransactionType}>
                {isCreating ? "Đang tạo giao dịch..." : "Gửi yêu cầu"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}

export default BookListPage;
