import { useCallback, useEffect, useState } from "react";
import { Alert, Badge, Button, Card, Loading, Modal } from "../components/common/index.js";
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

const defaultActionModal = {
  open: false,
  type: null,
  transaction: null,
};

const actionConfig = {
  cancel: {
    title: "Hủy giao dịch",
    description: "Vui lòng nhập lý do admin hủy giao dịch này.",
    confirmLabel: "Xác nhận hủy",
    loadingLabel: "Đang hủy...",
    successMessage: "Admin đã hủy giao dịch thành công.",
    buttonVariant: "danger",
  },
  "force-complete": {
    title: "Cưỡng chế hoàn tất giao dịch",
    description: "Vui lòng nhập lý do admin xác nhận giao dịch đã hoàn tất.",
    confirmLabel: "Xác nhận hoàn tất",
    loadingLabel: "Đang xử lý...",
    successMessage: "Admin đã cưỡng chế hoàn tất giao dịch thành công.",
    buttonVariant: "primary",
  },
};

function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [status, setStatus] = useState("");
  const [actionModal, setActionModal] = useState(defaultActionModal);
  const [adminReason, setAdminReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

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

  const openAdminActionModal = (type, transaction) => {
    setActionModal({ open: true, type, transaction });
    setAdminReason("");
    setActionError("");
    setError("");
    setSuccessMessage("");
  };

  const closeAdminActionModal = () => {
    if (actionLoading) {
      return;
    }

    setActionModal(defaultActionModal);
    setAdminReason("");
    setActionError("");
  };

  const submitAdminAction = async (event) => {
    event.preventDefault();

    const reason = adminReason.trim();
    const { type, transaction } = actionModal;
    const config = actionConfig[type];

    if (!reason) {
      setActionError("Vui lòng nhập lý do trước khi xác nhận.");
      return;
    }

    if (!transaction || !config) {
      setActionError("Không xác định được giao dịch cần xử lý.");
      return;
    }

    setActionLoading(true);
    setActionError("");

    try {
      const payload = { reason };
      const updatedTransaction = type === "cancel"
        ? await adminCancelTransaction(transaction.transaction_id, payload)
        : await adminForceCompleteTransaction(transaction.transaction_id, payload);

      updateTransactionInList(updatedTransaction);
      setSuccessMessage(config.successMessage);
      setActionModal(defaultActionModal);
      setAdminReason("");
    } catch (err) {
      setActionError(getAdminErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const currentActionConfig = actionConfig[actionModal.type] || actionConfig.cancel;

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
                              disabled={actionLoading}
                              onClick={() => openAdminActionModal("cancel", transaction)}
                            >
                              Hủy giao dịch
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              className="rounded-xl px-3 py-2 text-xs"
                              disabled={actionLoading}
                              onClick={() => openAdminActionModal("force-complete", transaction)}
                            >
                              Cưỡng chế hoàn tất
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

      <Modal
        isOpen={actionModal.open}
        title={currentActionConfig.title}
        onClose={closeAdminActionModal}
      >
        <form className="space-y-4" onSubmit={submitAdminAction}>
          <div className="space-y-2">
            <p className="text-sm font-bold leading-6 text-[#64736d]">
              {currentActionConfig.description}
            </p>
            <div className="rounded-2xl border border-[#ede9da] bg-[#fbfaf3] px-4 py-3 text-sm text-[#082d24]">
              <p className="font-black">
                {actionModal.transaction?.book?.title ?? "Giao dịch chưa rõ sách"}
              </p>
              <p className="mt-1 text-[#64736d]">
                Người cho: {actionModal.transaction?.giver?.full_name ?? "—"} · Người nhận:{" "}
                {actionModal.transaction?.receiver?.full_name ?? "—"}
              </p>
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-black text-[#082d24]">Lý do xử lý</span>
            <textarea
              className="min-h-28 w-full resize-y rounded-2xl border border-[#c9d8ce] bg-[#fbfaf3] px-4 py-3 text-sm font-semibold text-[#082d24] outline-none transition focus:border-[#064834] focus:ring-4 focus:ring-[#064834]/10"
              value={adminReason}
              onChange={(event) => {
                setAdminReason(event.target.value);
                if (actionError) {
                  setActionError("");
                }
              }}
              disabled={actionLoading}
              placeholder="Nhập lý do để lưu lại trong thao tác demo..."
              rows={4}
            />
          </label>

          {actionError ? <Alert type="error">{actionError}</Alert> : null}

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={actionLoading}
              onClick={closeAdminActionModal}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant={currentActionConfig.buttonVariant}
              disabled={actionLoading || !adminReason.trim()}
            >
              {actionLoading ? currentActionConfig.loadingLabel : currentActionConfig.confirmLabel}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminTransactionsPage;
