import type { Transaction } from "@/generated/prisma/models";
import { formatCurrency, formatDate, getInitials } from "@/lib/format";
import { cn } from "@/lib/cn";

type Props = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-1000 text-center">
        <p className="text-preset-2 text-grey-500">No transactions found.</p>
        <p className="text-preset-4 text-grey-300 mt-200">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="border-grey-100 hidden grid-cols-[1fr_auto_auto_auto] gap-400 border-b pb-300 sm:grid">
        <span className="text-preset-5 text-grey-500">Recipient / Sender</span>
        <span className="text-preset-5 text-grey-500">Category</span>
        <span className="text-preset-5 text-grey-500">Transaction Date</span>
        <span className="text-preset-5 text-grey-500 text-right">Amount</span>
      </div>

      <ul>
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            className="border-grey-100 grid grid-cols-[1fr_auto] items-center gap-400 border-b py-400 last:border-none sm:grid-cols-[1fr_auto_auto_auto]"
          >
            <div className="flex items-center gap-400">
              <Avatar name={transaction.name} />
              <span className="text-preset-4-bold text-grey-900">
                {transaction.name}
              </span>
            </div>

            <span className="text-preset-5 text-grey-500 hidden sm:block">
              {transaction.category.replace(/([A-Z])/g, " $1").trim()}
            </span>

            <span className="text-preset-5 text-grey-500 hidden whitespace-nowrap sm:block">
              {formatDate(transaction.date)}
            </span>

            <div className="flex flex-col items-end sm:items-end">
              <span
                className={cn(
                  "text-preset-4-bold",
                  transaction.amount > 0 ? "text-green" : "text-red",
                )}
              >
                {formatCurrency(transaction.amount)}
              </span>
              <span className="text-preset-5 text-grey-500 sm:hidden">
                {formatDate(transaction.date)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <div
      aria-hidden="true"
      className="bg-grey-100 text-grey-500 text-preset-5-bold flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full"
    >
      {getInitials(name)}
    </div>
  );
}
