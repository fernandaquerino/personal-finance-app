import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { AddBudgetModal } from "./_components/AddBudgetModal";

export default async function BudgetsPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const budgets = await prisma.budget.findMany({
    where: { userId },
    select: { theme: true },
  });

  const usedThemes = budgets.map((b) => b.theme);

  return (
    <div className="p-400 lg:p-1000">
      <div className="mb-800 flex items-center justify-between">
        <h1 className="text-preset-1 text-grey-900">Budgets</h1>
        <AddBudgetModal usedThemes={usedThemes} />
      </div>
      {budgets.length === 0 && (
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
              Create your first budget to start tracking your spending by category.
            </p>
          </div>
        </div>
      )}
      <div>
        {/* Spending Summary */}
        {/* Budgets List */}
      </div>
    </div>
  );
}
