import Link from "next/link";
import { ArrowRightIcon } from "@/components/ui/icons/ArrowRightIcon";
import { PotsIcon } from "@/components/ui/icons/PotsIcon";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { formatAmount } from "@/lib/format";
import { THEME_COLORS } from "@/lib/themes";

export default async function Overview() {
  const session = await auth();
  const userId = session!.user!.id!;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [balance, income, expenses, potsTotal, pots] = await Promise.all([
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
    prisma.pot.aggregate({
      where: { userId },
      _sum: { total: true },
    }),
    prisma.pot.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      take: 4,
      select: {
        id: true,
        name: true,
        total: true,
        theme: true,
      },
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

      <section
        aria-labelledby="overview-pots-heading"
        className="mt-400 rounded-xl bg-white p-500 lg:mt-600 lg:p-800"
      >
        <div className="mb-500 flex items-center justify-between">
          <h2
            id="overview-pots-heading"
            className="text-preset-2 text-grey-900"
          >
            Pots
          </h2>
          <Link
            href="/pots"
            className="text-preset-4 text-grey-500 hover:text-grey-900 flex items-center gap-300 transition-colors"
          >
            See Details
            <ArrowRightIcon />
          </Link>
        </div>

        <div className="grid gap-500 md:grid-cols-[minmax(220px,247px)_1fr]">
          <div className="bg-beige-100 flex min-h-[110px] items-center gap-400 rounded-xl p-400">
            <PotsIcon className="text-green h-[32px] w-[32px] shrink-0" />
            <div className="min-w-0">
              <p className="text-preset-4 text-grey-500 mb-200">Total Saved</p>
              <p className="text-preset-1 text-grey-900">
                {formatAmount(potsTotal._sum.total ?? 0)}
              </p>
            </div>
          </div>

          {pots.length > 0 ? (
            <ul className="grid grid-cols-1 gap-x-400 gap-y-400 sm:grid-cols-2">
              {pots.map((pot) => (
                <li key={pot.id} className="flex min-w-0 gap-400">
                  <span
                    className="h-[43px] w-[4px] shrink-0 rounded-full"
                    style={{ backgroundColor: THEME_COLORS[pot.theme] }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-preset-5 text-grey-500 truncate">
                      {pot.name}
                    </p>
                    <p className="text-preset-4-bold text-grey-900">
                      {formatAmount(pot.total)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="border-grey-300 flex min-h-[110px] items-center rounded-xl border border-dashed px-400">
              <p className="text-preset-4 text-grey-500">
                No pots yet. Create one to start tracking your savings.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
