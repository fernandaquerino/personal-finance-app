import type { BudgetModel as Budget } from "@/generated/prisma/models";
import type { Category, Theme } from "@/generated/prisma/enums";
import { BudgetCard } from "./BudgetCard";

type Transaction = {
  id: string;
  name: string;
  amount: number;
  date: Date;
  avatar: string;
};

type Props = {
  budgets: Budget[];
  spentByCategory: Record<Category, number>;
  latestByCategory: Record<Category, Transaction[]>;
};

export function BudgetList({
  budgets,
  spentByCategory,
  latestByCategory,
}: Props) {
  const usedThemes = budgets.map((b) => b.theme as Theme);

  return (
    <div className="flex flex-col gap-300">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          spent={spentByCategory[budget.category as Category] ?? 0}
          latestTransactions={
            latestByCategory[budget.category as Category] ?? []
          }
          usedThemes={usedThemes}
        />
      ))}
    </div>
  );
}
