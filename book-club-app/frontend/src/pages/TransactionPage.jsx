import { useState } from "react";
import { Badge, Button, Card } from "../components/common/index.js";
import { mockTransactions } from "../data/mockData.js";

function confirmationLabel(isConfirmed) {
  return isConfirmed ? "Đã xác nhận" : "Đang chờ";
}

function TransactionPage() {
  const [transactions, setTransactions] = useState(mockTransactions);

  function handleConfirm(transactionId) {
    setTransactions((currentTransactions) =>
      currentTransactions.map((transaction) => {
        if (transaction.id !== transactionId) {
          return transaction;
        }

        const updatedTransaction = {
          ...transaction,
          receiverConfirmed: true,
        };

        return {
          ...updatedTransaction,
          status: updatedTransaction.giverConfirmed ? "completed" : updatedTransaction.status,
        };
      })
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-extrabold text-[#c9ad2e]">Hoạt động trao đổi</p>
        <h1 className="mt-2 font-serif text-4xl font-extrabold leading-tight text-[#033b2a] md:text-5xl">
          Giao dịch của tôi
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#64736d]">
          Theo dõi các giao dịch mượn, trao đổi và xác nhận hoàn thành.
        </p>
      </div>

      <div className="grid gap-6">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-2xl font-extrabold leading-snug text-[#033b2a]">{transaction.bookTitle}</h2>
                  <Badge status={transaction.status} />
                </div>
                <p className="mt-2 text-sm leading-6 text-[#64736d]">
                  {transaction.giver} giao sách cho {transaction.receiver}
                </p>
                <p className="mt-1 text-sm text-[#64736d]">{transaction.location} · {transaction.createdAt}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="button" variant="secondary">
                  Xem chi tiết
                </Button>
                <Button
                  type="button"
                  disabled={transaction.status === "completed" || transaction.status === "cancelled"}
                  onClick={() => handleConfirm(transaction.id)}
                >
                  Xác nhận hoàn thành
                </Button>
              </div>
            </div>

            <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-[#fbfaf3] p-4">
                <dt className="font-semibold text-[#64736d]">Hình thức</dt>
                <dd className="mt-1 font-extrabold text-[#082d24]">{transaction.type}</dd>
              </div>
              <div className="rounded-2xl bg-[#fbfaf3] p-4">
                <dt className="font-semibold text-[#64736d]">Trạng thái</dt>
                <dd className="mt-2">
                  <Badge status={transaction.status} />
                </dd>
              </div>
              <div className="rounded-2xl bg-[#fbfaf3] p-4">
                <dt className="font-semibold text-[#64736d]">Người giao</dt>
                <dd className="mt-1 font-extrabold text-[#082d24]">{confirmationLabel(transaction.giverConfirmed)}</dd>
              </div>
              <div className="rounded-2xl bg-[#fbfaf3] p-4">
                <dt className="font-semibold text-[#64736d]">Người nhận</dt>
                <dd className="mt-1 font-extrabold text-[#082d24]">{confirmationLabel(transaction.receiverConfirmed)}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TransactionPage;
