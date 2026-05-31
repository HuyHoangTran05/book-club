import { useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Card, FormField } from "../components/common/index.js";

function AddBookPage() {
  const [showSuccess, setShowSuccess] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    console.log("Add book form data", Object.fromEntries(formData.entries()));
    setShowSuccess(true);
    event.currentTarget.reset();
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

      {showSuccess ? <Alert type="success">Sách đã được lưu vào danh sách mô phỏng.</Alert> : null}

      <Card>
        <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit}>
          <FormField label="Tên sách" name="title" type="text" placeholder="Nhập tên sách" required />
          <FormField label="Tác giả" name="author" type="text" placeholder="Nhập tên tác giả" required />
          <FormField label="Thể loại" name="category" as="select" defaultValue="" required>
            <option value="" disabled>
              Chọn thể loại
            </option>
            <option>Triết học</option>
            <option>Kinh tế</option>
            <option>Khoa học</option>
            <option>Văn học</option>
            <option>Công nghệ</option>
            <option>Kỹ năng</option>
          </FormField>
          <FormField label="Nhà xuất bản" name="publisher" type="text" placeholder="Nhập nhà xuất bản" />
          <FormField label="Năm xuất bản" name="publicationYear" type="number" placeholder="2024" min="1000" max="2100" />
          <FormField label="ISBN" name="isbn" type="text" placeholder="9786041234567" />
          <FormField label="Tình trạng sách" name="condition" as="select" defaultValue="Tốt" required>
            <option>Như mới</option>
            <option>Rất tốt</option>
            <option>Tốt</option>
            <option>Khá</option>
          </FormField>
          <FormField label="Hình thức trao đổi" name="exchangeType" as="select" defaultValue="Cho mượn" required>
            <option>Cho mượn</option>
            <option>Trao đổi lâu dài</option>
          </FormField>
          <FormField label="Ảnh bìa" name="cover" type="url" placeholder="Dán liên kết ảnh bìa nếu có" className="md:col-span-2" />
          <FormField
            label="Ghi chú"
            name="note"
            as="textarea"
            className="md:col-span-2"
            placeholder="Thêm thông tin về địa điểm nhận sách, tình trạng sách hoặc mong muốn trao đổi"
          />
          <div className="flex flex-col gap-3 pt-2 sm:flex-row md:col-span-2">
            <Button type="submit" className="sm:min-w-40">
              Lưu sách
            </Button>
            <Link
              to="/books"
              className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[#d9e2d8] bg-white px-5 text-sm font-bold text-[#064834] transition hover:bg-[#e7f1e8]"
            >
              Hủy
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AddBookPage;
