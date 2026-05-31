import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert, Badge, Button, Card, FormField, Input, Loading } from "../components/common/index.js";
import apiClient from "../services/apiClient.js";

const statusOptions = ["all", "available", "reserved", "borrowed", "exchanged", "unavailable"];

function getBookTitle(copy) {
  return copy.book?.title || copy.title || "Untitled book";
}

function getBookAuthor(copy) {
  return copy.book?.author || copy.author || "Unknown author";
}

function getBookCategory(copy) {
  return copy.book?.category || copy.category || "Uncategorized";
}

function getOwnerName(copy) {
  return copy.owner?.full_name || copy.owner?.email || copy.owner_name || "Unknown owner";
}

function formatValue(value) {
  if (!value) {
    return "Not provided";
  }

  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function BookListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMyBooksPage = location.pathname === "/my-books";
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const loadBooks = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (isMyBooksPage && !token) {
      setBooks([]);
      setLoading(false);
      setError("Bạn cần đăng nhập để xem sách của mình.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get(isMyBooksPage ? "/books/my" : "/books", {
        params: !isMyBooksPage && searchTerm.trim() ? { keyword: searchTerm.trim() } : undefined,
      });
      setBooks(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (requestError) {
      setBooks([]);
      setError(requestError.response?.data?.message || "Không thể tải danh sách sách. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }, [isMyBooksPage, searchTerm]);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const filteredBooks = useMemo(() => {
    return books.filter((copy) => {
      const searchText = `${getBookTitle(copy)} ${getBookAuthor(copy)} ${getBookCategory(copy)} ${copy.book?.isbn || ""}`.toLowerCase();
      const matchesSearch = isMyBooksPage || !searchTerm.trim() || searchText.includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || copy.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [books, isMyBooksPage, searchTerm, statusFilter]);

  async function handleDelete(copyId) {
    setDeletingId(copyId);
    setError("");
    setSuccess("");

    try {
      await apiClient.delete(`/books/${copyId}`);
      setBooks((currentBooks) => currentBooks.map((copy) => (copy.copy_id === copyId ? { ...copy, status: "unavailable" } : copy)));
      setSuccess("Đã ẩn sách khỏi danh sách trao đổi.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể xóa sách. Vui lòng thử lại.");
    } finally {
      setDeletingId("");
    }
  }

  const pageTitle = isMyBooksPage ? "My Books" : "Book List";
  const pageDescription = isMyBooksPage
    ? "Quản lý các sách bạn đã đăng lên BookCommunity."
    : "Khám phá sách đang sẵn sàng trao đổi từ cộng đồng BookCommunity.";

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-teal-700">{isMyBooksPage ? "Personal library" : "Library"}</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">{pageTitle}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">{pageDescription}</p>
        </div>

        {isMyBooksPage ? (
          <Link
            to="/books/add"
            className="inline-flex items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-700"
          >
            Add Book
          </Link>
        ) : null}
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}
      {success ? <Alert type="success">{success}</Alert> : null}

      {isMyBooksPage && !localStorage.getItem("token") ? (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-700">Vui lòng đăng nhập để xem và quản lý sách của bạn.</p>
          <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
        </Card>
      ) : (
        <>
          <Card>
            <div className="grid gap-4 md:grid-cols-[1fr_220px]">
              <label>
                <span className="mb-1.5 block text-sm font-semibold text-slate-700">Search books</span>
                <Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search by title, author, category, or ISBN" />
              </label>
              <FormField label="Status filter" as="select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "All statuses" : formatValue(status)}
                  </option>
                ))}
              </FormField>
            </div>
          </Card>

          {loading ? <Loading label="Loading books" /> : null}

          {!loading && filteredBooks.length === 0 ? (
            <Card className="text-center">
              <h2 className="text-lg font-black text-slate-950">{isMyBooksPage ? "Bạn chưa có sách nào." : "Chưa có sách phù hợp."}</h2>
              <p className="mt-2 text-sm text-slate-500">
                {isMyBooksPage ? "Hãy thêm cuốn sách đầu tiên để bắt đầu trao đổi với cộng đồng." : "Thử đổi từ khóa tìm kiếm hoặc quay lại sau."}
              </p>
            </Card>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-2">
            {filteredBooks.map((copy) => (
              <Card key={copy.copy_id || copy.id} className="flex flex-col justify-between gap-5">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-950">{getBookTitle(copy)}</h2>
                      <p className="mt-1 text-sm font-medium text-slate-500">by {getBookAuthor(copy)}</p>
                    </div>
                    <Badge status={copy.status || "neutral"} />
                  </div>

                  <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold text-slate-500">Category</dt>
                      <dd className="font-bold text-slate-900">{getBookCategory(copy)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-500">Condition</dt>
                      <dd className="font-bold text-slate-900">{formatValue(copy.condition)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-500">Exchange type</dt>
                      <dd className="font-bold text-slate-900">{formatValue(copy.exchange_type || copy.exchangeType)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-slate-500">Owner</dt>
                      <dd className="font-bold text-slate-900">{getOwnerName(copy)}</dd>
                    </div>
                  </dl>
                </div>

                {isMyBooksPage ? (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="secondary" className="sm:flex-1" onClick={loadBooks}>
                      Refresh
                    </Button>
                    <Button
                      variant="danger"
                      className="sm:flex-1"
                      disabled={copy.status === "unavailable" || deletingId === copy.copy_id}
                      onClick={() => handleDelete(copy.copy_id)}
                    >
                      {deletingId === copy.copy_id ? "Đang xóa..." : "Ẩn sách"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button className="sm:flex-1" disabled>
                      Create Transaction
                    </Button>
                    <Button variant="secondary" className="sm:flex-1" disabled>
                      Contact Owner
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default BookListPage;
