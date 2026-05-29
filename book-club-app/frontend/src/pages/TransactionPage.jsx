import { useState } from "react";
import { Badge, Button, Card } from "../components/common/index.js";
import { mockTransactions } from "../data/mockData.js";

function confirmationLabel(isConfirmed) {
  return isConfirmed ? "Confirmed" : "Waiting";
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
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Exchange activity</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">My Transactions</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">Confirmations update local React state only for Day 1.</p>
      </div>

      <div className="grid gap-5">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-black text-slate-950">{transaction.bookTitle}</h2>
                  <Badge status={transaction.status} />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {transaction.giver} gives this book to {transaction.receiver}
                </p>
              </div>
              <Button
                disabled={transaction.status === "completed" || transaction.status === "cancelled"}
                onClick={() => handleConfirm(transaction.id)}
              >
                Confirm Transaction
              </Button>
            </div>

            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-semibold text-slate-500">Transaction type</dt>
                <dd className="mt-1 font-bold capitalize text-slate-900">{transaction.type}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-semibold text-slate-500">Status</dt>
                <dd className="mt-1">
                  <Badge status={transaction.status} />
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-semibold text-slate-500">Giver confirmation</dt>
                <dd className="mt-1 font-bold text-slate-900">{confirmationLabel(transaction.giverConfirmed)}</dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <dt className="font-semibold text-slate-500">Receiver confirmation</dt>
                <dd className="mt-1 font-bold text-slate-900">{confirmationLabel(transaction.receiverConfirmed)}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TransactionPage;
