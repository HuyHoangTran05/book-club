import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, FormField } from "../components/common/index.js";
import apiClient from "../services/apiClient.js";

const initialForm = {
  title: "",
  author: "",
  category: "",
  publisher: "",
  publication_year: "",
  isbn: "",
  language: "vi",
  description: "",
  cover_url: "",
  condition: "good",
  exchange_type: "both",
  note: "",
};

function AddBookPage() {
  const navigate = useNavigate();
  const redirectTimerRef = useRef(null);
  const [formValues, setFormValues] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      setError("Bạn cần đăng nhập để thêm sách.");
    }

    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!formValues.title.trim()) {
      return "Vui lòng nhập tên sách.";
    }

    if (!formValues.author.trim()) {
      return "Vui lòng nhập tác giả.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!localStorage.getItem("token")) {
      setError("Bạn cần đăng nhập để thêm sách.");
      redirectTimerRef.current = setTimeout(() => navigate("/login"), 1200);
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        ...formValues,
        title: formValues.title.trim(),
        author: formValues.author.trim(),
        category: formValues.category.trim(),
        publisher: formValues.publisher.trim(),
        publication_year: formValues.publication_year ? Number(formValues.publication_year) : undefined,
        isbn: formValues.isbn.trim(),
        language: formValues.language.trim(),
        description: formValues.description.trim(),
        cover_url: formValues.cover_url.trim(),
        note: formValues.note.trim(),
      };

      await apiClient.post("/books", payload);
      setSuccess("Thêm sách thành công.");
      setFormValues(initialForm);
      redirectTimerRef.current = setTimeout(() => navigate("/my-books"), 1000);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Không thể thêm sách. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Contribute</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Add Book</h1>
        <p className="mt-2 text-sm text-slate-500">Đăng sách của bạn lên BookCommunity để trao đổi hoặc cho mượn.</p>
      </div>

      {error ? <Alert type="error">{error}</Alert> : null}
      {success ? <Alert type="success">{success}</Alert> : null}

      {!localStorage.getItem("token") ? (
        <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-700">Bạn cần đăng nhập trước khi thêm sách.</p>
          <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
        </Card>
      ) : (
        <Card>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <FormField label="Book title" name="title" type="text" placeholder="Book title" value={formValues.title} onChange={updateField} required />
            <FormField label="Author" name="author" type="text" placeholder="Author name" value={formValues.author} onChange={updateField} required />
            <FormField label="Category" name="category" type="text" placeholder="Fiction, Design, Business" value={formValues.category} onChange={updateField} />
            <FormField label="Publisher" name="publisher" type="text" placeholder="Publisher" value={formValues.publisher} onChange={updateField} />
            <FormField
              label="Publication year"
              name="publication_year"
              type="number"
              placeholder="2024"
              min="1000"
              max="2100"
              value={formValues.publication_year}
              onChange={updateField}
            />
            <FormField label="ISBN" name="isbn" type="text" placeholder="978-0-000000-0-0" value={formValues.isbn} onChange={updateField} />
            <FormField label="Language" name="language" type="text" placeholder="vi" value={formValues.language} onChange={updateField} />
            <FormField label="Cover URL" name="cover_url" type="url" placeholder="https://..." value={formValues.cover_url} onChange={updateField} />
            <FormField label="Condition" name="condition" as="select" value={formValues.condition} onChange={updateField} required>
              <option value="new">New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="worn">Worn</option>
            </FormField>
            <FormField label="Exchange type" name="exchange_type" as="select" value={formValues.exchange_type} onChange={updateField} required>
              <option value="both">Both</option>
              <option value="lending">Lending</option>
              <option value="permanent">Permanent exchange</option>
            </FormField>
            <FormField
              label="Description"
              name="description"
              as="textarea"
              className="md:col-span-2"
              placeholder="Short book description"
              value={formValues.description}
              onChange={updateField}
            />
            <FormField
              label="Note"
              name="note"
              as="textarea"
              className="md:col-span-2"
              placeholder="Add pickup details or book notes"
              value={formValues.note}
              onChange={updateField}
            />
            <div className="md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Đang thêm sách..." : "Add Book"}
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}

export default AddBookPage;
