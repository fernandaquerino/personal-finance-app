import type { TransactionModel as Transaction } from "@/generated/prisma/models/Transaction";
import { cn } from "@/lib/cn";
import { formatCurrency, formatDate, getInitials } from "@/lib/format";

type Props = {
  transactions: Transaction[];
  searchTerm?: string;
};

export function TransactionList({ transactions, searchTerm }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-1000 text-center">
        <p className="text-preset-2 text-grey-500">No transactions found.</p>
        <p className="text-preset-4 text-grey-300 mt-200">
          {searchTerm
            ? `No results for "${searchTerm}". Try a different name.`
            : "Try adjusting your filters or check back later."}
        </p>
      </div>
    );
  }

  return (
    <table className="w-full border-collapse">
      <thead className="hidden sm:table-header-group">
        <tr className="border-grey-100 border-b">
          <th className="text-preset-5 text-grey-500 pb-300 text-left font-normal">
            Recipient / Sender
          </th>
          <th className="text-preset-5 text-grey-500 pb-300 text-left font-normal">
            Category
          </th>
          <th className="text-preset-5 text-grey-500 pb-300 text-left font-normal">
            Transaction Date
          </th>
          <th className="text-preset-5 text-grey-500 pb-300 text-right font-normal">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction) => (
          <tr
            key={transaction.id}
            className="border-grey-100 border-b last:border-none"
          >
            <td className="py-400 pr-400">
              <div className="flex items-center gap-400">
                <Avatar name={transaction.name} />
                <div className="flex flex-col">
                  <span className="text-preset-4-bold text-grey-900">
                    {transaction.name}
                  </span>
                  <span className="text-preset-5 text-grey-500 sm:hidden">
                    {transaction.category.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
              </div>
            </td>

            <td className="text-preset-5 text-grey-500 hidden py-400 pr-400 sm:table-cell">
              {transaction.category.replace(/([A-Z])/g, " $1").trim()}
            </td>

            <td className="text-preset-5 text-grey-500 hidden py-400 pr-400 whitespace-nowrap sm:table-cell">
              {formatDate(transaction.date)}
            </td>

            <td className="py-400 text-right">
              <span
                className={cn(
                  "text-preset-4-bold block",
                  transaction.amount > 0 ? "text-green" : "text-red",
                )}
              >
                {formatCurrency(transaction.amount)}
              </span>
              <span className="text-preset-5 text-grey-500 sm:hidden">
                {formatDate(transaction.date)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
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
