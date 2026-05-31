import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Button, Card } from "../components/common/index.js";
import { mockBooks } from "../data/mockData.js";

const tabs = [
  { value: "all", label: "Tất cả" },
  { value: "available", label: "Sẵn sàng" },
  { value: "reserved", label: "Đang giữ chỗ" },
  { value: "borrowed", label: "Đang mượn" },
  { value: "exchanged", label: "Đã trao đổi" },
  { value: "unavailable", label: "Tạm ẩn" },
];

function MyBooksPage() {
  const [activeTab, setActiveTab] = useState("all");
  const myBooks = useMemo(() => {
    return mockBooks.filter((book) => book.isMine && (activeTab === "all" || book.status === activeTab));
  }, [activeTab]);

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

      {myBooks.length ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {myBooks.map((book) => (
            <Card key={book.id} className="flex flex-col gap-5">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge status="neutral">{book.category}</Badge>
                    <Badge status={book.status} />
                  </div>
                  <h2 className="mt-4 text-2xl font-extrabold leading-snug text-[#033b2a]">{book.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-[#64736d]">{book.author}</p>
                </div>
                <div className="rounded-2xl bg-[#fbfaf3] px-4 py-3 text-right">
                  <p className="text-xs font-bold text-[#64736d]">Đánh giá</p>
                  <p className="text-lg font-black text-[#9b742d]">★ {book.rating}</p>
                </div>
              </div>

              <p className="text-sm leading-6 text-[#64736d]">{book.note}</p>

              <dl className="grid gap-3 text-sm sm:grid-cols-3">
                <div className="rounded-2xl bg-[#fbfaf3] p-3">
                  <dt className="font-semibold text-[#64736d]">Tình trạng</dt>
                  <dd className="mt-1 font-extrabold text-[#082d24]">{book.condition}</dd>
                </div>
                <div className="rounded-2xl bg-[#fbfaf3] p-3">
                  <dt className="font-semibold text-[#64736d]">Hình thức</dt>
                  <dd className="mt-1 font-extrabold text-[#082d24]">{book.exchangeType}</dd>
                </div>
                <div className="rounded-2xl bg-[#fbfaf3] p-3">
                  <dt className="font-semibold text-[#64736d]">Thảo luận</dt>
                  <dd className="mt-1 font-extrabold text-[#082d24]">{book.groups}</dd>
                </div>
              </dl>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" className="sm:flex-1">
                  Cập nhật
                </Button>
                <Button type="button" variant="secondary" className="sm:flex-1">
                  Ẩn sách
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <h2 className="text-xl font-extrabold text-[#033b2a]">Chưa có sách nào</h2>
          <p className="mt-2 text-[#64736d]">
            Hãy thêm cuốn sách đầu tiên để bắt đầu chia sẻ với cộng đồng.
          </p>
        </Card>
      )}
    </div>
  );
}

export default MyBooksPage;
