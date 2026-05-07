const PER_PAGE = 10;

function SkeletonRow() {
  return (
    <li className="border-grey-100 grid grid-cols-[1fr_auto] items-center gap-400 border-b py-400 last:border-none sm:grid-cols-[1fr_auto_auto_auto]">
      <div className="flex items-center gap-400">
        <div className="bg-grey-100 h-[40px] w-[40px] shrink-0 animate-pulse rounded-full" />
        <div className="bg-grey-100 h-[16px] w-[120px] animate-pulse rounded" />
      </div>
      <div className="bg-grey-100 hidden h-[14px] w-[80px] animate-pulse rounded sm:block" />
      <div className="bg-grey-100 hidden h-[14px] w-[90px] animate-pulse rounded sm:block" />
      <div className="bg-grey-100 h-[16px] w-[60px] animate-pulse rounded" />
    </li>
  );
}

export function TransactionListSkeleton() {
  return (
    <div className="w-full">
      <div className="border-grey-100 hidden grid-cols-[1fr_auto_auto_auto] gap-400 border-b pb-300 sm:grid">
        {["Recipient / Sender", "Category", "Transaction Date", "Amount"].map(
          (label) => (
            <span key={label} className="text-preset-5 text-grey-500">
              {label}
            </span>
          ),
        )}
      </div>
      <ul>
        {Array.from({ length: PER_PAGE }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </ul>
    </div>
  );
}
