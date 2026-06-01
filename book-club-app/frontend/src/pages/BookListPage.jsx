import { useCallback, useEffect, useMemo, useState } from "react";
import { getBookErrorMessage, getBooks } from "../services/bookService.js";
import { categoryOptions } from "../components/books/bookOptions.js";
import { isHiddenBookStatus } from "../utils/bookLabels.js";
import "./BookListPage.css";

function normalizeText(value, fallback = "Chưa rõ") {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return String(value);
}

function getRawBook(book) {
  return book?.raw || book || {};
}

function getTitle(book) {
  const rawBook = getRawBook(book);
  return normalizeText(book?.title || rawBook.title || rawBook.bookTitle?.title || rawBook.book?.title, "Chưa có tên sách");
}

function getAuthor(book) {
  const rawBook = getRawBook(book);
  return normalizeText(book?.author || rawBook.author || rawBook.bookTitle?.author || rawBook.book?.author, "Chưa rõ tác giả");
}

function getCategory(book) {
  const rawBook = getRawBook(book);
  return normalizeText(book?.category || rawBook.category || rawBook.bookTitle?.category || rawBook.book?.category, "Khác");
}

function getOwnerName(book) {
  const rawBook = getRawBook(book);
  const ownerName =
    rawBook.owner?.full_name ||
    rawBook.owner?.name ||
    rawBook.member?.full_name ||
    rawBook.member?.name ||
    book?.ownerName;

  return ownerName && ownerName !== "Thành viên Cộng Đồng Sách" ? ownerName : "Chưa rõ";
}

function getDescription(book) {
  const rawBook = getRawBook(book);
  return normalizeText(
    book?.description || book?.note || rawBook.description || rawBook.note || rawBook.bookTitle?.description || rawBook.book?.description,
    "Chưa có mô tả cho cuốn sách này."
  );
}

function getStatusLabel(book) {
  return normalizeText(book?.statusLabel || book?.status, "Không rõ");
}

function getExchangeTypeLabel(book) {
  return normalizeText(book?.exchangeTypeLabel || book?.exchangeType || book?.exchange_type, "Chưa rõ");
}

function getCoverUrl(book) {
  const rawBook = getRawBook(book);
  return book?.coverUrl || rawBook.cover_url || rawBook.coverUrl || rawBook.bookTitle?.cover_url || rawBook.book?.cover_url || "";
}

function getConditionLabel(book) {
  return normalizeText(book?.conditionLabel || book?.condition, "Chưa rõ");
}

function getBookKey(book) {
  return book?.copyId || book?.bookId || getRawBook(book).copy_id || getTitle(book);
}

function BookListPage() {
  const [books, setBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  function handleContactOwner(book) {
    const ownerName = getOwnerName(book);
    alert(`Bạn muốn liên hệ với chủ sách: ${ownerName}`);
  }

  return (
    <div className="booklist-page">
      {/* ================= STITCH BOOKLIST HTML PASTE ZONE START =================
          Dán HTML từ Stitch cho BookListPage vào đây.
          Lưu ý:
          - Đổi class thành className
          - Đổi for thành htmlFor
          - Không dán thẻ html/body
          - Giữ logic map books từ API
          - Giữ button Liên hệ chủ sách
      */}
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
            <span className="booklist-summary-icon">▥</span>
            <strong>{filteredBooks.length} sách</strong>
            <p>Đang hiển thị</p>
          </article>
          <article className="booklist-summary-card">
            <span className="booklist-summary-icon">◷</span>
            <strong>{books.length} sách mới</strong>
            <p>Trong thư viện</p>
          </article>
        </div>
      </section>

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

            return (
              <article className="booklist-card" key={getBookKey(book)}>
                <div className="booklist-cover-wrap">
                  {coverUrl ? (
                    <img className="booklist-cover" src={coverUrl} alt={`Bìa sách ${getTitle(book)}`} loading="lazy" />
                  ) : (
                    <div className="booklist-cover-placeholder" aria-hidden="true">
                      <span>▱</span>
                    </div>
                  )}
                </div>

                <div className="booklist-card-tags">
                  <span>{getCategory(book)}</span>
                  <span className="booklist-status-tag">{getStatusLabel(book)}</span>
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

                <div className="booklist-card-actions">
                  <button className="booklist-contact-button" type="button" onClick={() => handleContactOwner(book)}>
                    Liên hệ chủ sách
                  </button>
                  <button className="booklist-transaction-button" type="button">
                    Tạo giao dịch
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : null}
      {/* ================= STITCH BOOKLIST HTML PASTE ZONE END ================= */}
    </div>
  );
}

export default BookListPage;
