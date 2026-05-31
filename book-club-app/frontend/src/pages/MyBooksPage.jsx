import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BookCard from "../components/books/BookCard.jsx";
import BookForm, { valuesFromBook } from "../components/books/BookForm.jsx";
import ConfirmDialog from "../components/books/ConfirmDialog.jsx";
import { validateBookValues } from "../components/books/bookValidation.js";
import { Alert, Button, Card } from "../components/common/index.js";
import { deleteBook, getBookErrorMessage, getMyBooks, updateBook } from "../services/bookService.js";
import { isHiddenBookStatus } from "../utils/bookLabels.js";

const tabs = [
  { value: "all", label: "Tất cả" },
  { value: "available", label: "Sẵn sàng" },
  { value: "reserved", label: "Đang giữ chỗ" },
  { value: "borrowed", label: "Đang mượn" },
  { value: "exchanged", label: "Đã trao đổi" },
];

function MyBooksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [books, setBooks] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editErrors, setEditErrors] = useState({});
  const [editTarget, setEditTarget] = useState(null);
  const [editValues, setEditValues] = useState(null);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    let isMounted = true;

    async function loadMyBooks() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getMyBooks();

        if (isMounted) {
          setBooks(result.items);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getBookErrorMessage(loadError, "Không thể tải sách của bạn. Vui lòng thử lại."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMyBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(
      (book) => !isHiddenBookStatus(book.status) && (activeTab === "all" || book.status === activeTab)
    );
  }, [activeTab, books]);

  function openEdit(book) {
    setEditTarget(book);
    setEditValues(valuesFromBook(book));
    setEditErrors({});
    setMessage("");
  }

  function closeEdit() {
    setEditTarget(null);
    setEditValues(null);
    setEditErrors({});
  }

  async function handleUpdate(event) {
    event.preventDefault();
    const nextErrors = validateBookValues(editValues);
    setEditErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0 || !editTarget) {
      return;
    }

    setIsUpdating(true);
    setMessage("");

    try {
      const updatedBook = await updateBook(editTarget.copyId, editValues);
      setBooks((currentBooks) =>
        currentBooks.map((book) => (book.copyId === updatedBook.copyId ? updatedBook : book))
      );
      setMessage("Cập nhật sách thành công.");
      closeEdit();
    } catch (updateError) {
      setMessage(getBookErrorMessage(updateError, "Không thể cập nhật sách. Vui lòng thử lại."));
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    setMessage("");

    try {
      await deleteBook(deleteTarget.copyId);
      setBooks((currentBooks) => currentBooks.filter((book) => book.copyId !== deleteTarget.copyId));
      setMessage("Xóa sách thành công.");
      setDeleteTarget(null);
    } catch (deleteError) {
      setMessage(getBookErrorMessage(deleteError, "Không thể xóa sách. Vui lòng thử lại."));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-extrabold text-[#c9ad2e]">Tủ sách cá nhân</p>
          <h1 className="mt-2 font-serif text-4xl font-extrabold leading-tight text-[#033b2a] md:text-5xl">
            Sách của tôi
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#64736d]">
            Quản lý các cuốn sách bạn đã đăng lên cộng đồng.
          </p>
        </div>
        <Link
          to="/books/new"
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#064834] px-5 text-sm font-bold text-white shadow-soft transition hover:bg-[#033b2a]"
        >
          Thêm sách
        </Link>
      </div>

      {message ? <Alert type={message.includes("thành công") ? "success" : "error"}>{message}</Alert> : null}

      <Card>
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition ${
                activeTab === tab.value
                  ? "border-[#064834] bg-[#064834] text-white"
                  : "border-[#d9e2d8] bg-[#fbfaf3] text-[#64736d] hover:border-[#064834] hover:text-[#064834]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {isLoading ? (
        <Card className="text-center text-sm font-bold text-[#64736d]">Đang tải sách của bạn...</Card>
      ) : error ? (
        <Card className="text-center">
          <h2 className="text-xl font-extrabold text-[#033b2a]">Không thể tải sách của bạn</h2>
          <p className="mt-2 text-[#64736d]">{error}</p>
        </Card>
      ) : filteredBooks.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.copyId}
              book={book}
              actions={
                <>
                  <Button type="button" className="sm:flex-1" onClick={() => openEdit(book)}>
                    Sửa
                  </Button>
                  <Button type="button" variant="danger" className="sm:flex-1" onClick={() => setDeleteTarget(book)}>
                    Xóa
                  </Button>
                </>
              }
            />
          ))}
        </div>
      ) : books.length ? (
        <Card className="text-center">
          <h2 className="text-xl font-extrabold text-[#033b2a]">Không có sách trong trạng thái này.</h2>
          <p className="mt-2 text-[#64736d]">Hãy chọn bộ lọc khác để xem thêm sách của bạn.</p>
        </Card>
      ) : (
        <Card className="text-center">
          <h2 className="text-xl font-extrabold text-[#033b2a]">Bạn chưa đăng cuốn sách nào.</h2>
          <p className="mt-2 text-[#64736d]">
            Hãy thêm cuốn sách đầu tiên để bắt đầu chia sẻ với cộng đồng.
          </p>
        </Card>
      )}

      {editTarget ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#082d24]/45 px-4 py-6">
          <div className="mx-auto w-full max-w-5xl rounded-3xl border border-[#d9e2d8] bg-white p-6 shadow-stitch">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-extrabold text-[#c9ad2e]">Cập nhật thông tin sách</p>
                <h2 className="mt-1 text-2xl font-extrabold text-[#033b2a]">Sửa sách</h2>
              </div>
              <Button type="button" variant="ghost" onClick={closeEdit} disabled={isUpdating}>
                Đóng
              </Button>
            </div>
            <BookForm
              errors={editErrors}
              isSubmitting={isUpdating}
              onCancel={closeEdit}
              onChange={setEditValues}
              onSubmit={handleUpdate}
              submitLabel="Lưu thay đổi"
              submittingLabel="Đang cập nhật..."
              values={editValues}
            />
          </div>
        </div>
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        isLoading={isDeleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default MyBooksPage;
