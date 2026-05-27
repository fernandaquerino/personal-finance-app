import Link from "next/link";
import type { BudgetModel as Budget } from "@/generated/prisma/models";
import type { Category } from "@/generated/prisma/enums";
import { CATEGORY_LABELS } from "@/lib/categories";
import { THEME_COLORS } from "@/lib/themes";
import { formatCurrency, formatDate, getInitials } from "@/lib/format";

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
  avatar: string;
};

type Props = {
  budget: Budget;
  spent: number;
  latestTransactions: Transaction[];
};

const fmt = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

export function BudgetCard({ budget, spent, latestTransactions }: Props) {
  const { category, maximum, theme } = budget;
  const themeColor = THEME_COLORS[theme];
  const remaining = Math.max(0, maximum - spent);
  const progress = Math.min(100, (spent / maximum) * 100);
  const categoryLabel = CATEGORY_LABELS[category as Category];

  return (
    <div className="rounded-2xl bg-white p-500">
      {/* Header */}
      <div className="mb-500 flex items-center justify-between">
        <div className="flex items-center gap-200">
          <span
            className="h-[16px] w-[16px] shrink-0 rounded-full"
            style={{ backgroundColor: themeColor }}
            aria-hidden="true"
          />
          <h2 className="text-preset-2 text-grey-900">{categoryLabel}</h2>
        </div>
      </div>

      {/* Maximum */}
      <p className="text-preset-4 text-grey-500 mb-300">
        Maximum of {fmt(maximum)}
      </p>

      {/* Progress bar */}
      <div className="bg-beige-100 mb-400 h-[12px] w-full overflow-hidden rounded-full">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ backgroundColor: themeColor, width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${Math.round(progress)}% of budget spent`}
        />
      </div>

      {/* Spent / Remaining */}
      <div className="mb-500 grid grid-cols-2 gap-400">
        <div className="border-l-4 pl-300" style={{ borderColor: themeColor }}>
          <p className="text-preset-5 text-grey-500 mb-100">Spent</p>
          <p className="text-preset-4-bold text-grey-900">{fmt(spent)}</p>
        </div>
        <div className="border-beige-500 border-l-4 pl-300">
          <p className="text-preset-5 text-grey-500 mb-100">Remaining</p>
          <p className="text-preset-4-bold text-grey-900">{fmt(remaining)}</p>
        </div>
      </div>

      {/* Latest Spending */}
      <div className="bg-beige-100 rounded-xl p-400">
        <div className="mb-300 flex items-center justify-between">
          <p className="text-preset-4-bold text-grey-900">Latest Spending</p>
          <Link
            href={`/transactions?category=${category}`}
            className="text-preset-4 text-grey-500 hover:text-grey-900 flex items-center gap-150 transition-colors"
          >
            See All
            <svg
              width="6"
              height="10"
              viewBox="0 0 6 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        {latestTransactions.length === 0 ? (
          <p className="text-preset-5 text-grey-500 py-200">
            No transactions yet
          </p>
        ) : (
          <ul>
            {latestTransactions.map((t, i) => (
              <li
                key={t.id}
                className={`flex items-center justify-between py-300 ${
                  i < latestTransactions.length - 1
                    ? "border-grey-100 border-b"
                    : ""
                }`}
              >
                <div className="flex items-center gap-300">
                  <div className="bg-grey-100 flex h-800 w-800 shrink-0 items-center justify-center overflow-hidden rounded-full">
                    {t.avatar ? (
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-preset-5-bold text-grey-500">
                        {getInitials(t.name)}
                      </span>
                    )}
                  </div>
                  <p className="text-preset-5-bold text-grey-900">{t.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-preset-5-bold text-grey-900">
                    {formatCurrency(t.amount)}
                  </p>
                  <p className="text-preset-5 text-grey-500">
                    {formatDate(t.date)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
