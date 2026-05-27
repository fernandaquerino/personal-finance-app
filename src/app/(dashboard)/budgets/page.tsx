import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import type { Category } from "@/generated/prisma/enums";
import { AddBudgetModal } from "./_components/AddBudgetModal";
import { BudgetList } from "./_components/BudgetList";

export default async function BudgetsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const budgets = await prisma.budget.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });

  const usedThemes = budgets.map((b) => b.theme);
  const usedCategories = budgets.map((b) => b.category);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [monthTransactions, allCategoryTransactions] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        userId,
        category: { in: usedCategories },
        date: { gte: startOfMonth },
        amount: { lt: 0 },
      },
      select: { category: true, amount: true },
    }),
    prisma.transaction.findMany({
      where: { userId, category: { in: usedCategories } },
      orderBy: { date: "desc" },
      select: {
        id: true,
        name: true,
        amount: true,
        date: true,
        avatar: true,
        category: true,
      },
    }),
  ]);

  const spentByCategory = Object.fromEntries(
    usedCategories.map((cat) => [
      cat,
      Math.abs(
        monthTransactions
          .filter((t) => t.category === cat)
          .reduce((sum, t) => sum + t.amount, 0),
      ),
    ]),
  ) as Record<Category, number>;

  const latestByCategory = Object.fromEntries(
    usedCategories.map((cat) => [
      cat,
      allCategoryTransactions.filter((t) => t.category === cat).slice(0, 3),
    ]),
  ) as Record<
    Category,
    { id: string; name: string; amount: number; date: Date; avatar: string }[]
  >;

  return (
    <div className="p-400 lg:p-1000">
      <div className="mb-800 flex items-center justify-between">
        <h1 className="text-preset-1 text-grey-900">Budgets</h1>
        <AddBudgetModal
          usedThemes={usedThemes}
          usedCategories={usedCategories}
        />
      </div>
      {budgets.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-400 rounded-2xl bg-white px-400 py-[80px] text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-grey-300"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
              fill="currentColor"
            />
          </svg>
          <div className="flex flex-col gap-100">
            <p className="text-preset-2 text-grey-900">No budgets yet</p>
            <p className="text-preset-4 text-grey-500 max-w-[320px]">
              Create your first budget to start tracking your spending by
              category.
            </p>
          </div>
        </div>
      ) : (
        <BudgetList
          budgets={budgets}
          spentByCategory={spentByCategory}
          latestByCategory={latestByCategory}
        />
      )}
    </div>
  );
}
