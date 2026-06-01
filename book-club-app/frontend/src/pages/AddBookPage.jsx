import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BookForm, { emptyValues } from "../components/books/BookForm.jsx";
import { validateBookValues } from "../components/books/bookValidation.js";
import { Alert, Card } from "../components/common/index.js";
import { createBook, getBookErrorMessage } from "../services/bookService.js";

function AddBookPage() {
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState(emptyValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateBookValues(formValues);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      await createBook(formValues);
      setMessage("Thêm sách thành công.");
      window.setTimeout(() => {
        navigate("/my-books", { replace: true, state: { message: "Thêm sách thành công." } });
      }, 450);
    } catch (submitError) {
      setMessage(getBookErrorMessage(submitError, "Không thể lưu sách. Vui lòng thử lại."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <p className="text-sm font-extrabold text-[#c9ad2e]">Đóng góp vào thư viện</p>
        <h1 className="mt-2 font-serif text-4xl font-extrabold leading-tight text-[#033b2a] md:text-5xl">
          Thêm sách mới
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#64736d]">
          Chia sẻ cuốn sách của bạn để các thành viên khác có thể tìm thấy.
        </p>
      </div>

      {message ? <Alert type={message.includes("thành công") ? "success" : "error"}>{message}</Alert> : null}

      <Card>
        <BookForm
          errors={errors}
          isSubmitting={isSubmitting}
          onCancel={() => navigate("/books")}
          onChange={setFormValues}
          onSubmit={handleSubmit}
          submitLabel="Lưu sách"
          submittingLabel="Đang lưu..."
          values={formValues}
          allowCoverUpload
        />
      </Card>
    </div>
  );
}

export default AddBookPage;
