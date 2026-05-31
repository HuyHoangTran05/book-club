import { useMemo, useState } from "react";
import { Badge, Button, Card, FormField, Input } from "../components/common/index.js";
import { mockBooks } from "../data/mockData.js";

const categoryOptions = ["Tất cả", "Triết học", "Kinh tế", "Khoa học", "Văn học"];
const statusOptions = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "available", label: "Sẵn sàng" },
  { value: "reserved", label: "Đang giữ chỗ" },
  { value: "borrowed", label: "Đang mượn" },
  { value: "exchanged", label: "Đã trao đổi" },
  { value: "unavailable", label: "Tạm ẩn" },
];

function BookListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Tất cả");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBooks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return mockBooks.filter((book) => {
      const searchText = `${book.title} ${book.author} ${book.category}`.toLowerCase();
      const matchesSearch = !normalizedSearch || searchText.includes(normalizedSearch);
      const matchesCategory = categoryFilter === "Tất cả" || book.category === categoryFilter;
      const matchesStatus = statusFilter === "all" || book.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, searchTerm, statusFilter]);

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
      </div>

      <Card>
        <div className="grid gap-4 lg:grid-cols-[1fr_180px_200px_120px] lg:items-end">
          <label>
            <span className="mb-2 block text-sm font-bold text-[#082d24]">
              Tìm theo tên sách, tác giả hoặc thể loại
            </span>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Nhập tên sách, tác giả hoặc thể loại"
            />
          </label>
          <FormField label="Thể loại" as="select" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            {categoryOptions.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </FormField>
          <FormField label="Trạng thái" as="select" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            {statusOptions.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </FormField>
          <Button type="button" className="h-12">
            Tìm kiếm
          </Button>
        </div>
      </Card>

      {filteredBooks.length ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => (
            <Card key={book.id} className="flex min-h-full flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <Badge status="neutral">{book.category}</Badge>
                <Badge status={book.status} />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold leading-snug text-[#033b2a]">{book.title}</h2>
                <p className="mt-1 text-sm font-semibold text-[#64736d]">{book.author}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-[#fbfaf3] p-3">
                  <p className="font-semibold text-[#64736d]">Đánh giá</p>
                  <p className="mt-1 font-extrabold text-[#9b742d]">★ {book.rating}</p>
                </div>
                <div className="rounded-2xl bg-[#fbfaf3] p-3">
                  <p className="font-semibold text-[#64736d]">Thảo luận</p>
                  <p className="mt-1 font-extrabold text-[#082d24]">{book.groups}</p>
                </div>
                <div className="rounded-2xl bg-[#fbfaf3] p-3">
                  <p className="font-semibold text-[#64736d]">Tình trạng</p>
                  <p className="mt-1 font-extrabold text-[#082d24]">{book.condition}</p>
                </div>
                <div className="rounded-2xl bg-[#fbfaf3] p-3">
                  <p className="font-semibold text-[#64736d]">Hình thức</p>
                  <p className="mt-1 font-extrabold text-[#082d24]">{book.exchangeType}</p>
                </div>
              </div>

              <div className="mt-auto border-t border-[#d9e2d8] pt-4">
                <p className="text-sm font-semibold text-[#64736d]">Chủ sách</p>
                <p className="mt-1 font-bold text-[#082d24]">{book.owner}</p>
                <p className="mt-1 text-sm text-[#64736d]">{book.location}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Button type="button">Tạo giao dịch</Button>
                <Button type="button" variant="secondary">
                  Liên hệ chủ sách
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <h2 className="text-xl font-extrabold text-[#033b2a]">Chưa có sách phù hợp</h2>
          <p className="mt-2 text-[#64736d]">Hãy thử đổi từ khóa hoặc bộ lọc để tìm thêm sách trong cộng đồng.</p>
        </Card>
      )}
    </div>
  );
}

export default BookListPage;
