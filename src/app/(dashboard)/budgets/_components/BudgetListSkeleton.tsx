function SkeletonTransaction() {
  return (
    <div className="border-grey-100 flex items-center justify-between border-b py-300 last:border-none">
      <div className="flex items-center gap-300">
        <div className="bg-grey-100 h-800 w-800 shrink-0 animate-pulse rounded-full" />
        <div className="bg-grey-100 h-[14px] w-[100px] animate-pulse rounded" />
      </div>
      <div className="flex flex-col items-end gap-100">
        <div className="bg-grey-100 h-[14px] w-[50px] animate-pulse rounded" />
        <div className="bg-grey-100 h-[12px] w-[70px] animate-pulse rounded" />
      </div>
    </div>
  );
}

function BudgetCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-500">
      {/* Header */}
      <div className="mb-500 flex items-center gap-200">
        <div className="bg-grey-100 h-[16px] w-[16px] shrink-0 animate-pulse rounded-full" />
        <div className="bg-grey-100 h-[20px] w-[120px] animate-pulse rounded" />
      </div>

      {/* Maximum */}
      <div className="bg-grey-100 mb-300 h-[14px] w-[140px] animate-pulse rounded" />

      {/* Progress bar */}
      <div className="bg-beige-100 mb-400 h-[12px] w-full animate-pulse rounded-full" />

      {/* Spent / Remaining */}
      <div className="mb-500 grid grid-cols-2 gap-400">
        <div className="border-grey-100 border-l-4 pl-300">
          <div className="bg-grey-100 mb-100 h-[12px] w-[40px] animate-pulse rounded" />
          <div className="bg-grey-100 h-[16px] w-[60px] animate-pulse rounded" />
        </div>
        <div className="border-grey-100 border-l-4 pl-300">
          <div className="bg-grey-100 mb-100 h-[12px] w-[60px] animate-pulse rounded" />
          <div className="bg-grey-100 h-[16px] w-[60px] animate-pulse rounded" />
        </div>
      </div>

      {/* Latest Spending */}
      <div className="bg-beige-100 rounded-xl p-400">
        <div className="mb-300 flex items-center justify-between">
          <div className="bg-grey-100 h-[16px] w-[120px] animate-pulse rounded" />
          <div className="bg-grey-100 h-[14px] w-[50px] animate-pulse rounded" />
        </div>
        <SkeletonTransaction />
        <SkeletonTransaction />
        <SkeletonTransaction />
      </div>
    </div>
  );
}

export function BudgetListSkeleton() {
  return (
    <div className="flex flex-col gap-300">
      <BudgetCardSkeleton />
      <BudgetCardSkeleton />
      <BudgetCardSkeleton />
    </div>
  );
}
