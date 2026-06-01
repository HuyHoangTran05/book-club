import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Badge, Button } from "../components/common/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { getCurrentUser as getStoredCurrentUser } from "../utils/auth.js";
import {
  displayAuthorName,
  displayBookTitle,
  displayCategory,
  displayPersonName,
} from "../utils/vietnameseDisplay.js";
import {
  cancelTransaction,
  confirmTransaction,
  getMyTransactions,
  getTransactionErrorMessage,
} from "../services/transactionService.js";
import "./TransactionsPage.css";

const transactionTypeLabels = {
  permanent: "Trao đổi vĩnh viễn",
  lending: "Cho mượn",
};

const statusLabels = {
  pending: "Đang chờ xác nhận",
  completed: "Đã hoàn thành",
  cancelled: "Đã hủy",
};

const roleLabels = {
  giver: "Bạn là chủ sách",
  receiver: "Bạn là người nhận sách",
  deliverer: "Bạn là người giao sách",
};

function normalizeId(value) {
  return value === undefined || value === null || value === "" ? "" : String(value);
}

function getUserId(user = {}) {
  return normalizeId(user.member_id ?? user.memberId ?? user.id);
}

function getRelatedId(transaction, role) {
  return normalizeId(
    transaction?.[`${role}_id`] ??
      transaction?.[`${role}Id`] ??
      transaction?.[role]?.member_id ??
      transaction?.[role]?.memberId ??
      transaction?.[role]?.id
  );
}

function getCurrentUserRole(transaction, currentUser) {
  const fallbackUser = currentUser || getStoredCurrentUser();
  const userId = getUserId(fallbackUser);

  if (!userId) {
    return null;
  }

  if (getRelatedId(transaction, "giver") === userId) {
    return "giver";
  }

  if (getRelatedId(transaction, "receiver") === userId) {
    return "receiver";
  }

  if (getRelatedId(transaction, "deliverer") === userId) {
    return "deliverer";
  }

  return null;
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getDisplayName(person) {
  return displayPersonName(person?.full_name || person?.fullName || person?.name || person?.email, "Chưa rõ");
}

function hasDeliverer(transaction) {
  return Boolean(transaction.deliverer_id || transaction.delivererId || transaction.deliverer);
}

function getConfirmationRows(transaction) {
  return [
    {
      label: "Chủ sách",
      value: transaction.giver_confirmed ? "Đã xác nhận" : "Chưa xác nhận",
    },
    {
      label: "Người nhận",
      value: transaction.receiver_confirmed ? "Đã xác nhận" : "Chưa xác nhận",
    },
    {
      label: "Người giao",
      value: hasDeliverer(transaction)
        ? transaction.delivery_confirmed
          ? "Đã xác nhận"
          : "Chưa xác nhận"
        : "Không yêu cầu",
    },
  ];
}

function getPointImpact(transaction, role) {
  if (!role) {
    return "Không áp dụng";
  }

  if (role === "deliverer") {
    return "+2 điểm";
  }

  const amount = transaction.transaction_type === "permanent" ? 10 : 5;
  const sign = role === "giver" ? "+" : "-";
  return `${sign}${amount} điểm`;
}

function getUserConfirmed(transaction, role) {
  if (role === "giver") {
    return transaction.giver_confirmed;
  }

  if (role === "receiver") {
    return transaction.receiver_confirmed;
  }

  if (role === "deliverer") {
    return transaction.delivery_confirmed;
  }

  return true;
}

function TransactionsPage() {
  const location = useLocation();
  const { user } = useAuth();
  const [actionId, setActionId] = useState(null);
  const [actionType, setActionType] = useState("");
  const [cancelTarget, setCancelTarget] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  useEffect(() => {
    let isMounted = true;

    async function loadTransactions() {
      setIsLoading(true);
      setError("");

      try {
        const result = await getMyTransactions();

        if (isMounted) {
          setTransactions(result);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(getTransactionErrorMessage(loadError, "Không thể tải danh sách giao dịch. Vui lòng thử lại."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((first, second) => {
      return new Date(second.created_at).getTime() - new Date(first.created_at).getTime();
    });
  }, [transactions]);

  function replaceTransaction(updatedTransaction) {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) =>
        normalizeId(transaction.transaction_id) === normalizeId(updatedTransaction.transaction_id) ? updatedTransaction : transaction
      )
    );
  }

  async function handleConfirm(transactionId, role) {
    setActionId(transactionId);
    setActionType("confirm");
    setMessage("");
    setError("");

    try {
      const updatedTransaction = await confirmTransaction(transactionId, user || getStoredCurrentUser());
      replaceTransaction(updatedTransaction);
      setMessage(role === "deliverer" ? "Xác nhận giao sách thành công." : "Xác nhận giao dịch thành công.");
    } catch (confirmError) {
      setError(getTransactionErrorMessage(confirmError));
    } finally {
      setActionId(null);
      setActionType("");
    }
  }

  async function handleCancel() {
    if (!cancelTarget) {
      return;
    }

    setActionId(cancelTarget.transaction_id);
    setActionType("cancel");
    setMessage("");
    setError("");

    try {
      const updatedTransaction = await cancelTransaction(cancelTarget.transaction_id);
      replaceTransaction(updatedTransaction);
      setMessage("Đã hủy giao dịch.");
      setCancelTarget(null);
    } catch (cancelError) {
      setError(getTransactionErrorMessage(cancelError));
    } finally {
      setActionId(null);
      setActionType("");
    }
  }

  return (
    <div className="transactions-page">
      <header className="transactions-header">
        <p>Hoạt động trao đổi</p>
        <h1>Giao dịch của tôi</h1>
        <span>Theo dõi các giao dịch mượn, trao đổi và xác nhận hoàn thành.</span>
      </header>

      {message ? <Alert type="success">{message}</Alert> : null}
      {error && !isLoading ? <Alert type="error">{error}</Alert> : null}

      {isLoading ? (
        <section className="transactions-state" aria-live="polite">
          Đang tải giao dịch...
        </section>
      ) : null}

      {!isLoading && !error && sortedTransactions.length === 0 ? (
        <section className="transactions-state">
          <h2>Chưa có giao dịch nào.</h2>
          <p>Khi bạn tạo hoặc nhận giao dịch, thông tin sẽ hiển thị tại đây.</p>
        </section>
      ) : null}

      {!isLoading && sortedTransactions.length > 0 ? (
        <section className="transactions-grid" aria-label="Danh sách giao dịch">
          {sortedTransactions.map((transaction) => {
            const role = getCurrentUserRole(transaction, user);
            const isPending = transaction.status === "pending";
            const userConfirmed = getUserConfirmed(transaction, role);
            const transactionId = transaction.transaction_id;
            const isConfirming = actionId === transactionId && actionType === "confirm";
            const isCancelling = actionId === transactionId && actionType === "cancel";
            const canActOnTransaction = Boolean(role);

            return (
              <article className="transaction-card" key={transactionId}>
                <div className="transaction-card-top">
                  <div>
                    <div className="transaction-card-badges">
                      <Badge status={transaction.status}>{statusLabels[transaction.status] ?? transaction.status}</Badge>
                      <Badge status="neutral">
                        {transactionTypeLabels[transaction.transaction_type] ?? transaction.transaction_type}
                      </Badge>
                    </div>
                    <h2>{displayBookTitle(transaction.book?.title)}</h2>
                    <p className="transaction-book-meta">
                      {displayAuthorName(transaction.book?.author)} · {displayCategory(transaction.book?.category)}
                    </p>
                  </div>
                  <div className="transaction-points">{getPointImpact(transaction, role)}</div>
                </div>

                <dl className="transaction-details">
                  <div>
                    <dt>Vai trò của bạn</dt>
                    <dd>{roleLabels[role] ?? "Bạn không thuộc giao dịch này"}</dd>
                  </div>
                  <div>
                    <dt>Chủ sách</dt>
                    <dd>{getDisplayName(transaction.giver)}</dd>
                  </div>
                  <div>
                    <dt>Người nhận</dt>
                    <dd>{getDisplayName(transaction.receiver)}</dd>
                  </div>
                  <div>
                    <dt>Người giao</dt>
                    <dd>{hasDeliverer(transaction) ? getDisplayName(transaction.deliverer) : "Không có người giao"}</dd>
                  </div>
                  <div>
                    <dt>Ngày tạo</dt>
                    <dd>{formatDate(transaction.created_at)}</dd>
                  </div>
                  {transaction.transaction_type === "lending" ? (
                    <div>
                      <dt>Ngày dự kiến trả</dt>
                      <dd>{formatDate(transaction.expected_return_date) || "Chưa chọn"}</dd>
                    </div>
                  ) : null}
                  {transaction.status === "completed" ? (
                    <div>
                      <dt>Ngày hoàn thành</dt>
                      <dd>{formatDate(transaction.completed_at)}</dd>
                    </div>
                  ) : null}
                </dl>

                <div className="transaction-confirmations">
                  {getConfirmationRows(transaction).map((item) => (
                    <span key={item.label}>
                      <strong>{item.label}:</strong> {item.value}
                    </span>
                  ))}
                </div>

                <div className="transaction-actions">
                  {isPending && canActOnTransaction && !userConfirmed ? (
                    <Button type="button" onClick={() => handleConfirm(transactionId, role)} disabled={Boolean(actionId)}>
                      {isConfirming ? "Đang xác nhận..." : role === "deliverer" ? "Xác nhận giao sách" : "Xác nhận giao dịch"}
                    </Button>
                  ) : null}
                  {isPending && canActOnTransaction && userConfirmed ? (
                    <p className="transaction-action-note">Bạn đã xác nhận. Đang chờ bên còn lại.</p>
                  ) : null}
                  {isPending && canActOnTransaction ? (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setCancelTarget(transaction)}
                      disabled={Boolean(actionId)}
                    >
                      {isCancelling ? "Đang hủy..." : "Hủy giao dịch"}
                    </Button>
                  ) : null}
                  {isPending && !canActOnTransaction ? (
                    <p className="transaction-action-note">Bạn không có quyền thao tác với giao dịch này.</p>
                  ) : null}
                  {transaction.status === "completed" ? (
                    <p className="transaction-action-note">Giao dịch đã hoàn tất.</p>
                  ) : null}
                  {transaction.status === "cancelled" ? (
                    <p className="transaction-action-note">Giao dịch đã bị hủy.</p>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      ) : null}

      {cancelTarget ? (
        <div className="transaction-dialog-backdrop">
          <div className="transaction-dialog" role="dialog" aria-modal="true" aria-labelledby="cancel-transaction-title">
            <h2 id="cancel-transaction-title">Hủy giao dịch</h2>
            <p>Bạn có chắc muốn hủy giao dịch này không?</p>
            <div className="transaction-dialog-actions">
              <Button type="button" variant="secondary" onClick={() => setCancelTarget(null)} disabled={actionType === "cancel"}>
                Không
              </Button>
              <Button type="button" variant="danger" onClick={handleCancel} disabled={actionType === "cancel"}>
                {actionType === "cancel" ? "Đang hủy..." : "Hủy giao dịch"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TransactionsPage;
