import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Card, Loading } from "../components/common/index.js";
import { getAdminErrorMessage, getAdminTransactions } from "../services/adminService.js";

const statusOptions = [
  { value: "", label: "Tất cả" },
  { value: "pending", label: "Đang chờ" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã huỷ" },
];

const statusBadge = {
  pending: "pending",
  completed: "completed",
  cancelled: "cancelled",
};

function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminTransactions({ status });
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getAdminErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#082d24]">Giám sát giao dịch</h1>
        <p className="text-sm text-[#64736d]">Theo dõi toàn bộ giao dịch và phát hiện các giao dịch đang treo.</p>
      </div>

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatus(option.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-bold transition ${
                status === option.value
                  ? "bg-[#064834] text-white"
                  : "bg-[#fbfaf3] text-[#64736d] hover:bg-[#e7f1e8]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </Card>

      {error ? <Alert type="error">{error}</Alert> : null}
      {loading ? <Loading label="Đang tải giao dịch..." /> : null}

      {!loading ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-[#64736d]">
                  <th className="px-2 py-2">Sách</th>
                  <th className="px-2 py-2">Người cho</th>
                  <th className="px-2 py-2">Người nhận</th>
                  <th className="px-2 py-2">Loại</th>
                  <th className="px-2 py-2">Trạng thái</th>
                  <th className="px-2 py-2">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.transaction_id} className="border-t border-[#ede9da]">
                    <td className="px-2 py-2 font-bold text-[#082d24]">{transaction.book?.title ?? "—"}</td>
                    <td className="px-2 py-2">{transaction.giver?.full_name ?? "—"}</td>
                    <td className="px-2 py-2">{transaction.receiver?.full_name ?? "—"}</td>
                    <td className="px-2 py-2">
                      {transaction.transaction_type === "permanent" ? "Vĩnh viễn" : "Cho mượn"}
                    </td>
                    <td className="px-2 py-2">
                      <Badge status={statusBadge[transaction.status] ?? "neutral"} />
                    </td>
                    <td className="px-2 py-2">
                      {transaction.created_at
                        ? new Date(transaction.created_at).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-2 py-6 text-center text-[#64736d]">
                      Không có giao dịch nào.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

export default AdminTransactionsPage;
