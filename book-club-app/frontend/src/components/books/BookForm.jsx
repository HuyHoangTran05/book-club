import { useEffect, useState } from "react";
import { Button, FormField } from "../common/index.js";
import { categoryOptions, conditionOptions, exchangeTypeOptions } from "./bookOptions.js";
import { resolveCoverUrl } from "../../services/bookService.js";

const allowedCoverTypes = ["image/jpeg", "image/png", "image/webp"];
const maxCoverSize = 5 * 1024 * 1024;

const emptyValues = {
  title: "",
  author: "",
  category: "",
  publisher: "",
  publication_year: "",
  isbn: "",
  language: "Tiếng Việt",
  condition: "",
  exchange_type: "",
  note: "",
  cover_url: "",
  coverFile: null,
  coverFileError: "",
};

function valuesFromBook(book) {
  if (!book) {
    return emptyValues;
  }

  return {
    title: book.title || "",
    author: book.author || "",
    category: book.category || "",
    publisher: book.publisher || "",
    publication_year: book.publicationYear || "",
    isbn: book.isbn || "",
    language: book.language || "Tiếng Việt",
    condition: book.condition || "",
    exchange_type: book.exchangeType || "",
    note: book.note || "",
    cover_url: book.coverUrl || "",
    coverFile: null,
    coverFileError: "",
  };
}

function BookForm({
  errors = {},
  initialBook = null,
  isSubmitting = false,
  onCancel,
  onChange,
  onSubmit,
  submitLabel = "Lưu sách",
  submittingLabel = "Đang lưu...",
  values,
  allowCoverUpload = false,
}) {
  const currentValues = values || valuesFromBook(initialBook);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");

  useEffect(() => {
    if (!currentValues.coverFile) {
      setCoverPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(currentValues.coverFile);
    setCoverPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [currentValues.coverFile]);

  function handleChange(event) {
    const { name, value } = event.target;
    onChange({ ...currentValues, [name]: value });
  }

  function handleCoverFileChange(event) {
    const file = event.target.files?.[0] || null;

    if (!file) {
      onChange({ ...currentValues, coverFile: null, coverFileError: "" });
      return;
    }

    if (!allowedCoverTypes.includes(file.type)) {
      onChange({
        ...currentValues,
        coverFile: null,
        coverFileError: "Ảnh bìa chỉ hỗ trợ JPG, PNG hoặc WEBP.",
      });
      event.target.value = "";
      return;
    }

    if (file.size > maxCoverSize) {
      onChange({
        ...currentValues,
        coverFile: null,
        coverFileError: "Ảnh bìa không được vượt quá 5MB.",
      });
      event.target.value = "";
      return;
    }

    onChange({ ...currentValues, coverFile: file, coverFileError: "" });
  }

  const linkPreviewUrl = currentValues.cover_url ? resolveCoverUrl(currentValues.cover_url) : "";
  const previewUrl = coverPreviewUrl || linkPreviewUrl;

  return (
    <form className="grid gap-5 md:grid-cols-2" onSubmit={onSubmit} noValidate>
      <FormField
        label="Tên sách"
        name="title"
        type="text"
        placeholder="Nhập tên sách"
        value={currentValues.title}
        onChange={handleChange}
        error={errors.title}
        disabled={isSubmitting}
        required
      />
      <FormField
        label="Tác giả"
        name="author"
        type="text"
        placeholder="Nhập tên tác giả"
        value={currentValues.author}
        onChange={handleChange}
        error={errors.author}
        disabled={isSubmitting}
        required
      />
      <FormField
        label="Thể loại"
        name="category"
        as="select"
        value={currentValues.category}
        onChange={handleChange}
        error={errors.category}
        disabled={isSubmitting}
        required
      >
        <option value="">Chọn thể loại</option>
        {categoryOptions.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </FormField>
      <FormField
        label="Nhà xuất bản"
        name="publisher"
        type="text"
        placeholder="Nhập nhà xuất bản"
        value={currentValues.publisher}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      <FormField
        label="Năm xuất bản"
        name="publication_year"
        type="number"
        placeholder="1941"
        value={currentValues.publication_year}
        onChange={handleChange}
        error={errors.publication_year}
        disabled={isSubmitting}
      />
      <FormField
        label="ISBN"
        name="isbn"
        type="text"
        placeholder="9786040000011"
        value={currentValues.isbn}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      <FormField
        label="Ngôn ngữ"
        name="language"
        type="text"
        placeholder="Tiếng Việt"
        value={currentValues.language}
        onChange={handleChange}
        disabled={isSubmitting}
      />
      <FormField
        label="Tình trạng sách"
        name="condition"
        as="select"
        value={currentValues.condition}
        onChange={handleChange}
        error={errors.condition}
        disabled={isSubmitting}
        required
      >
        <option value="">Chọn tình trạng sách</option>
        {conditionOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </FormField>
      <FormField
        label="Hình thức trao đổi"
        name="exchange_type"
        as="select"
        value={currentValues.exchange_type}
        onChange={handleChange}
        error={errors.exchange_type}
        disabled={isSubmitting}
        required
      >
        <option value="">Chọn hình thức trao đổi</option>
        {exchangeTypeOptions.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </FormField>
      {allowCoverUpload ? (
        <div className="md:col-span-2">
          <label className="block" htmlFor="cover">
            <span className="mb-2 block text-sm font-bold text-[#082d24]">Ảnh bìa</span>
            <input
              id="cover"
              name="cover"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleCoverFileChange}
              disabled={isSubmitting}
              className="min-h-12 w-full rounded-2xl border border-dashed border-[#b7c6bb] bg-[#fbfaf3] px-4 py-3 text-sm font-semibold text-[#082d24] shadow-sm outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[#064834] file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:border-[#064834] focus:border-[#064834] focus:ring-2 focus:ring-[#e7f1e8]"
            />
          </label>
          <p className="mt-2 text-xs text-[#64736d]">Hỗ trợ JPG, PNG, WEBP. Tối đa 5MB.</p>
          {currentValues.coverFileError || errors.coverFile ? (
            <span className="mt-1.5 block text-xs font-medium text-rose-600">
              {currentValues.coverFileError || errors.coverFile}
            </span>
          ) : null}
          {previewUrl ? (
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-[#d9e2d8] bg-white p-4">
              <img
                src={previewUrl}
                alt="Xem trước ảnh bìa"
                className="h-28 w-24 rounded-xl object-cover shadow-sm"
              />
              <div>
                <p className="text-sm font-extrabold text-[#082d24]">Xem trước ảnh bìa</p>
                <p className="mt-1 text-xs text-[#64736d]">
                  {currentValues.coverFile ? currentValues.coverFile.name : "Đang dùng link ảnh bìa"}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
      <FormField
        label={allowCoverUpload ? "Link ảnh bìa nếu có" : "Link ảnh bìa"}
        name="cover_url"
        type="url"
        placeholder="Dán liên kết ảnh bìa nếu có"
        value={currentValues.cover_url}
        onChange={handleChange}
        disabled={isSubmitting}
        className="md:col-span-2"
      />
      <FormField
        label="Ghi chú"
        name="note"
        as="textarea"
        placeholder="Sách còn tốt, phù hợp để cho mượn."
        value={currentValues.note}
        onChange={handleChange}
        disabled={isSubmitting}
        className="md:col-span-2"
      />
      <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2">
        <Button type="submit" className="sm:min-w-40" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Hủy
        </Button>
      </div>
    </form>
  );
}

export { emptyValues, valuesFromBook };
export default BookForm;
