import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { formatAmount } from "@/lib/format";

export default async function Overview() {
  const session = await auth();
  const userId = session!.user!.id!;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [balance, income, expenses] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        amount: { gt: 0 },
        date: { gte: startOfMonth, lt: startOfNextMonth },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        amount: { lt: 0 },
        date: { gte: startOfMonth, lt: startOfNextMonth },
      },
      _sum: { amount: true },
    }),
  ]);

  const summaryCards = [
    {
      label: "Current Balance",
      value: formatAmount(balance._sum.amount ?? 0),
      className: "bg-grey-900 text-white",
      labelClassName: "text-white",
      valueClassName: "text-white",
    },
    {
      label: "Income",
      value: formatAmount(income._sum.amount ?? 0),
      className: "bg-white text-grey-900",
      labelClassName: "text-grey-500",
      valueClassName: "text-grey-900",
    },
    {
      label: "Expenses",
      value: formatAmount(Math.abs(expenses._sum.amount ?? 0)),
      className: "bg-white text-grey-900",
      labelClassName: "text-grey-500",
      valueClassName: "text-grey-900",
    },
  ];

  return (
    <div className="p-400 lg:p-1000">
      <h1 className="text-preset-1 text-grey-900 mb-800">Overview</h1>

      <section
        aria-label="Account summary"
        className="grid grid-cols-1 gap-300 md:grid-cols-3 lg:gap-600"
      >
        {summaryCards.map((card) => (
          <article
            key={card.label}
            className={`flex min-h-[119px] flex-col justify-center gap-300 rounded-xl p-500 lg:p-600 ${card.className}`}
          >
            <p className={`text-preset-5 ${card.labelClassName}`}>
              {card.label}
            </p>
            <p className={`text-preset-1 ${card.valueClassName}`}>
              {card.value}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
