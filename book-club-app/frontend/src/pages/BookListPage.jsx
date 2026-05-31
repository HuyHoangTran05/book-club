import { useEffect, useMemo, useState } from "react";
import BookCard, { CommunityBookActions } from "../components/books/BookCard.jsx";
import BookFilters from "../components/books/BookFilters.jsx";
import { Card } from "../components/common/index.js";
import { getBookErrorMessage, getBooks } from "../services/bookService.js";
import { isHiddenBookStatus } from "../utils/bookLabels.js";

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
  const [books, setBooks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBooks() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getBooks({ limit: 100 });

        if (isMounted) {
          setBooks(result.items);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getBookErrorMessage(loadError, "Không thể tải danh sách sách. Vui lòng thử lại."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return books.filter((book) => {
      if (isHiddenBookStatus(book.status)) {
        return false;
      }

      const searchText = `${book.title} ${book.author} ${book.category}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchText.includes(normalizedSearch);
      const matchesCategory = categoryFilter === "all" || book.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [books, categoryFilter, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-extrabold text-[#c9ad2e]">Thư viện cộng đồng</p>
          <h1 className="mt-2 font-serif text-4xl font-extrabold leading-tight text-[#033b2a] md:text-5xl">
            Khám phá sách
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#64736d]">
            Tìm kiếm những cuốn sách đang được thành viên chia sẻ trong cộng đồng.
          </p>
        </div>
        <div className="rounded-3xl border border-[#d9e2d8] bg-white px-5 py-4 shadow-soft">
          <p className="text-sm font-bold text-[#64736d]">Đang hiển thị</p>
          <p className="mt-1 text-3xl font-black text-[#064834]">{filteredBooks.length} sách</p>
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

      <BookFilters
        category={categoryFilter}
        onCategoryChange={setCategoryFilter}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
      />

      {isLoading ? (
        <Card className="text-center text-sm font-bold text-[#64736d]">Đang tải danh sách sách...</Card>
      ) : error ? (
        <Card className="text-center">
          <h2 className="text-xl font-extrabold text-[#033b2a]">Không thể tải danh sách sách</h2>
          <p className="mt-2 text-[#64736d]">{error}</p>
        </Card>
      ) : filteredBooks.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard key={book.copyId || book.bookId || book.title} book={book} actions={<CommunityBookActions />} />
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <h2 className="text-xl font-extrabold text-[#033b2a]">Chưa có sách nào trong cộng đồng.</h2>
          <p className="mt-2 text-[#64736d]">Hãy thử đổi từ khóa hoặc quay lại sau khi có thêm sách mới.</p>
        </Card>
      )}
    </div>
  );
}

export default BookListPage;
