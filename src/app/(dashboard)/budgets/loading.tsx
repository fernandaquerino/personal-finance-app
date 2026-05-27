import {
  BudgetListSkeleton,
  BudgetDonutSkeleton,
} from "./_components/BudgetListSkeleton";

export default function BudgetsLoading() {
  return (
    <div className="p-400 lg:p-1000">
      <div className="mb-800 flex items-center justify-between">
        <h1 className="text-preset-1 text-grey-900">Budgets</h1>
        <div className="bg-grey-900 h-[40px] w-[140px] animate-pulse rounded-lg" />
      </div>
      <div className="grid grid-cols-1 items-start gap-300 lg:grid-cols-[2fr_3fr]">
        <BudgetDonutSkeleton />
        <BudgetListSkeleton />
      </div>
    </div>
  );
}
