export function validateBookValues(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Vui lòng nhập tên sách.";
  }

  if (!values.author.trim()) {
    errors.author = "Vui lòng nhập tác giả.";
  }

  if (!values.category) {
    errors.category = "Vui lòng chọn thể loại.";
  }

  if (!values.condition) {
    errors.condition = "Vui lòng chọn tình trạng sách.";
  }

  if (!values.exchange_type) {
    errors.exchange_type = "Vui lòng chọn hình thức trao đổi.";
  }

  const publicationYear = values.publication_year === undefined || values.publication_year === null ? "" : String(values.publication_year).trim();

  if (publicationYear && Number.isNaN(Number(publicationYear))) {
    errors.publication_year = "Năm xuất bản không hợp lệ.";
  }

  return errors;
}
