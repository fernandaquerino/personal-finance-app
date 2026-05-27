function PotCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-500">
      {/* Header */}
      <div className="mb-500 flex items-center gap-200">
        <div className="bg-grey-100 h-[16px] w-[16px] shrink-0 animate-pulse rounded-full" />
        <div className="bg-grey-100 h-[20px] w-[120px] animate-pulse rounded" />
      </div>

      {/* Total Saved */}
      <div className="mb-400 flex items-center justify-between">
        <div className="bg-grey-100 mb-100 h-[12px] w-[40px] animate-pulse rounded" />
        <div className="bg-grey-100 h-[16px] w-[60px] animate-pulse rounded" />
      </div>

      {/* Progress bar */}
      <div className="mb-800">
        <div className="bg-beige-100 mb-400 h-[12px] w-full animate-pulse rounded-full" />
        <div className="flex items-center justify-between">
          <div className="bg-grey-100 mb-100 h-[12px] w-[40px] animate-pulse rounded" />
          <div className="bg-grey-100 h-[16px] w-[60px] animate-pulse rounded" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-400">
        <div className="bg-grey-100 h-[40px] w-full animate-pulse rounded" />
        <div className="bg-grey-100 h-[40px] w-full animate-pulse rounded" />
      </div>
    </div>
  );
}
export function PotListSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-600">
      <PotCardSkeleton />
      <PotCardSkeleton />
      <PotCardSkeleton />
      <PotCardSkeleton />
    </div>
  );
}
