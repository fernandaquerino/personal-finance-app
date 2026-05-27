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
    </div>
  );
}
