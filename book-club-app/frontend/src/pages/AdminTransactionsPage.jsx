import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Loading } from "../components/common/index.js";
import { getAdminErrorMessage } from "../services/adminService.js";
import {
  adminCancelTransaction,
  adminForceCompleteTransaction,
  getAdminTransactions,
} from "../services/adminTransactionService.js";

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

const confirmLabel = (value) => (value ? "Đã xác nhận" : "Chưa xác nhận");

function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [status, setStatus] = useState("");
  const [actionKey, setActionKey] = useState("");

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const data = await getAdminTransactions({ status });
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getAdminErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status]);

  const updateTransactionInList = (updatedTransaction) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.transaction_id === updatedTransaction.transaction_id
          ? updatedTransaction
          : transaction,
      ),
    );
  };

  const handleAdminAction = async (transaction, action) => {
    const isCancel = action === "cancel";
    const label = isCancel ? "hủy giao dịch" : "cưỡng chế hoàn tất giao dịch";
    const reason = window.prompt(`Nhập lý do ${label}:`);

    if (reason === null) {
      return;
    }

    const confirmed = window.confirm(`Xác nhận ${label} này?`);

    if (!confirmed) {
      return;
    }

    const key = `${action}-${transaction.transaction_id}`;
    setActionKey(key);
    setError("");
    setSuccessMessage("");

    try {
      const payload = { reason: reason.trim() };
      const updatedTransaction = isCancel
        ? await adminCancelTransaction(transaction.transaction_id, payload)
        : await adminForceCompleteTransaction(transaction.transaction_id, payload);

      updateTransactionInList(updatedTransaction);
      setSuccessMessage(
        isCancel
          ? "Admin đã hủy giao dịch thành công."
          : "Admin đã cưỡng chế hoàn tất giao dịch thành công.",
      );
    } catch (err) {
      setError(getAdminErrorMessage(err));
    } finally {
      setActionKey("");
    }
  };

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
      {successMessage ? <Alert type="success">{successMessage}</Alert> : null}
      {loading ? <Loading label="Đang tải giao dịch..." /> : null}

      {!loading ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="text-xs uppercase text-[#64736d]">
                  <th className="px-2 py-2">Sách</th>
                  <th className="px-2 py-2">Người cho</th>
                  <th className="px-2 py-2">Người nhận</th>
                  <th className="px-2 py-2">Người giao</th>
                  <th className="px-2 py-2">Loại</th>
                  <th className="px-2 py-2">Trạng thái</th>
                  <th className="px-2 py-2">Xác nhận</th>
                  <th className="px-2 py-2">Ngày tạo</th>
                  <th className="px-2 py-2">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => {
                  const isPending = transaction.status === "pending";
                  const cancelKey = `cancel-${transaction.transaction_id}`;
                  const forceKey = `force-${transaction.transaction_id}`;

                  return (
                    <tr key={transaction.transaction_id} className="border-t border-[#ede9da]">
                      <td className="px-2 py-2 font-bold text-[#082d24]">{transaction.book?.title ?? "—"}</td>
                      <td className="px-2 py-2">{transaction.giver?.full_name ?? "—"}</td>
                      <td className="px-2 py-2">{transaction.receiver?.full_name ?? "—"}</td>
                      <td className="px-2 py-2">{transaction.deliverer?.full_name ?? "Không có"}</td>
                      <td className="px-2 py-2">
                        {transaction.transaction_type === "permanent" ? "Vĩnh viễn" : "Cho mượn"}
                      </td>
                      <td className="px-2 py-2">
                        <Badge status={statusBadge[transaction.status] ?? "neutral"} />
                      </td>
                      <td className="px-2 py-2 text-xs leading-5 text-[#64736d]">
                        <div>Chủ sách: {confirmLabel(transaction.giver_confirmed)}</div>
                        <div>Người nhận: {confirmLabel(transaction.receiver_confirmed)}</div>
                        <div>
                          Người giao:{" "}
                          {transaction.deliverer_id
                            ? confirmLabel(transaction.delivery_confirmed)
                            : "Không yêu cầu"}
                        </div>
                      </td>
                      <td className="px-2 py-2">
                        {transaction.created_at
                          ? new Date(transaction.created_at).toLocaleDateString("vi-VN")
                          : "—"}
                      </td>
                      <td className="px-2 py-2">
                        {isPending ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="danger"
                              className="rounded-xl px-3 py-2 text-xs"
                              disabled={Boolean(actionKey)}
                              onClick={() => handleAdminAction(transaction, "cancel")}
                            >
                              {actionKey === cancelKey ? "Đang hủy..." : "Hủy giao dịch"}
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              className="rounded-xl px-3 py-2 text-xs"
                              disabled={Boolean(actionKey)}
                              onClick={() => handleAdminAction(transaction, "force")}
                            >
                              {actionKey === forceKey ? "Đang xử lý..." : "Cưỡng chế hoàn tất"}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-[#64736d]">Không khả dụng</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-2 py-6 text-center text-[#64736d]">
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
