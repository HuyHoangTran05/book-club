import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Alert, Badge, Button } from "../components/common/index.js";
import { useAuth } from "../contexts/AuthContext.jsx";
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

function normalizeId(value) {
  return value === undefined || value === null || value === "" ? "" : String(value);
}

function getUserId(user = {}) {
  return normalizeId(user.id ?? user.member_id ?? user.memberId);
}

function getPersonId(person = {}) {
  return normalizeId(person.member_id ?? person.memberId ?? person.id);
}

function getCurrentUserRole(transaction, currentUser) {
  const userId = getUserId(currentUser);
  const userEmail = currentUser?.email;

  if (userId && getPersonId(transaction.giver) === userId) {
    return "giver";
  }

  if (userId && getPersonId(transaction.receiver) === userId) {
    return "receiver";
  }

  if (userEmail && transaction.giver?.email === userEmail) {
    return "giver";
  }

  if (userEmail && transaction.receiver?.email === userEmail) {
    return "receiver";
  }

  return "receiver";
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

function getConfirmationText(transaction) {
  return [
    transaction.giver_confirmed ? "Người cho đã xác nhận" : "Người cho chưa xác nhận",
    transaction.receiver_confirmed ? "Người nhận đã xác nhận" : "Người nhận chưa xác nhận",
  ];
}

function getPointImpact(transaction, role) {
  const amount = transaction.transaction_type === "permanent" ? 10 : 5;
  const sign = role === "giver" ? "+" : "-";
  return `${sign}${amount} điểm`;
}

function getUserConfirmed(transaction, role) {
  return role === "giver" ? transaction.giver_confirmed : transaction.receiver_confirmed;
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

  async function handleConfirm(transactionId) {
    setActionId(transactionId);
    setActionType("confirm");
    setMessage("");
    setError("");

    try {
      const updatedTransaction = await confirmTransaction(transactionId, user);
      replaceTransaction(updatedTransaction);
      setMessage("Xác nhận giao dịch thành công.");
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
                    <h2>{transaction.book.title}</h2>
                    <p className="transaction-book-meta">
                      {transaction.book.author} · {transaction.book.category}
                    </p>
                  </div>
                  <div className="transaction-points">{getPointImpact(transaction, role)}</div>
                </div>

                <dl className="transaction-details">
                  <div>
                    <dt>Vai trò của bạn</dt>
                    <dd>{role === "giver" ? "Bạn là người cho sách" : "Bạn là người nhận sách"}</dd>
                  </div>
                  <div>
                    <dt>Người cho</dt>
                    <dd>{transaction.giver.full_name}</dd>
                  </div>
                  <div>
                    <dt>Người nhận</dt>
                    <dd>{transaction.receiver.full_name}</dd>
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
                  {getConfirmationText(transaction).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>

                <div className="transaction-actions">
                  {isPending && !userConfirmed ? (
                    <Button type="button" onClick={() => handleConfirm(transactionId)} disabled={Boolean(actionId)}>
                      {isConfirming ? "Đang xác nhận..." : "Xác nhận hoàn thành"}
                    </Button>
                  ) : null}
                  {isPending && userConfirmed ? (
                    <p className="transaction-action-note">Bạn đã xác nhận. Đang chờ bên còn lại.</p>
                  ) : null}
                  {isPending ? (
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => setCancelTarget(transaction)}
                      disabled={Boolean(actionId)}
                    >
                      {isCancelling ? "Đang hủy..." : "Hủy giao dịch"}
                    </Button>
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
