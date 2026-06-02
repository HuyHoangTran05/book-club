import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Loading } from "../components/common/index.js";
import {
  cancelTransaction,
  getAdminErrorMessage,
  getAdminTransactions,
} from "../services/adminService.js";

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
  const [notice, setNotice] = useState("");
  const [status, setStatus] = useState("");
  const [busyId, setBusyId] = useState("");

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

  async function handleCancel(transaction) {
    const confirmed = window.confirm("Huỷ giao dịch này và trả sách về trạng thái sẵn sàng?");
    if (!confirmed) {
      return;
    }

    setBusyId(transaction.transaction_id);
    setError("");
    setNotice("");
    try {
      await cancelTransaction(transaction.transaction_id);
      setNotice("Đã huỷ giao dịch.");
      await fetchTransactions();
    } catch (err) {
      setError(getAdminErrorMessage(err));
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#082d24]">Giám sát giao dịch</h1>
        <p className="text-sm text-[#64736d]">Theo dõi toàn bộ giao dịch và huỷ các giao dịch bị treo.</p>
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
      {notice ? <Alert type="success">{notice}</Alert> : null}
      {loading ? <Loading label="Đang tải giao dịch..." /> : null}

      {!loading ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-[#64736d]">
                  <th className="px-2 py-2">Sách</th>
                  <th className="px-2 py-2">Người cho</th>
                  <th className="px-2 py-2">Người nhận</th>
                  <th className="px-2 py-2">Loại</th>
                  <th className="px-2 py-2">Trạng thái</th>
                  <th className="px-2 py-2">Ngày tạo</th>
                  <th className="px-2 py-2 text-right">Hành động</th>
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
                    <td className="px-2 py-2 text-right">
                      <Button
                        variant="danger"
                        className="px-3 py-1.5"
                        disabled={transaction.status !== "pending" || busyId === transaction.transaction_id}
                        onClick={() => handleCancel(transaction)}
                      >
                        Huỷ
                      </Button>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-2 py-6 text-center text-[#64736d]">
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
