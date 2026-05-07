import { TransactionListSkeleton } from "./_components/TransactionListSkeleton";

export default function TransactionsLoading() {
  return (
    <div className="p-400 lg:p-1000">
      <h1 className="text-preset-1 text-grey-900 mb-800">Transactions</h1>
      <div className="rounded-2xl bg-white p-400 lg:p-800">
        <TransactionListSkeleton />
      </div>
    </div>
  );
}
