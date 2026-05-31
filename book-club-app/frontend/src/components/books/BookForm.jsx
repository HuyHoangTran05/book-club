import { Button, FormField } from "../common/index.js";
import { categoryOptions, conditionOptions, exchangeTypeOptions } from "./bookOptions.js";

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
}) {
  const currentValues = values || valuesFromBook(initialBook);

  function handleChange(event) {
    const { name, value } = event.target;
    onChange({ ...currentValues, [name]: value });
  }

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
      <FormField
        label="Link ảnh bìa"
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
