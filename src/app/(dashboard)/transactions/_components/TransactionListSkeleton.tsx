const PER_PAGE = 10;

function SkeletonRow() {
  return (
    <tr className="border-grey-100 border-b last:border-none">
      <td className="py-400 pr-400">
        <div className="flex items-center gap-400">
          <div className="bg-grey-100 h-[40px] w-[40px] shrink-0 animate-pulse rounded-full" />
          <div className="bg-grey-100 h-[16px] w-[120px] animate-pulse rounded" />
        </div>
      </td>
      <td className="hidden py-400 pr-400 sm:table-cell">
        <div className="bg-grey-100 h-[14px] w-[80px] animate-pulse rounded" />
      </td>
      <td className="hidden py-400 pr-400 sm:table-cell">
        <div className="bg-grey-100 h-[14px] w-[90px] animate-pulse rounded" />
      </td>
      <td className="py-400 text-right">
        <div className="bg-grey-100 ml-auto h-[16px] w-[60px] animate-pulse rounded" />
      </td>
    </tr>
  );
}

export function TransactionListSkeleton() {
  return (
    <table className="w-full border-collapse">
      <thead className="hidden sm:table-header-group">
        <tr className="border-grey-100 border-b">
          <th className="text-preset-5 text-grey-500 pb-300 text-left font-normal">
            Recipient / Sender
          </th>
          <th className="text-preset-5 text-grey-500 pb-300 text-left font-normal">
            Category
          </th>
          <th className="text-preset-5 text-grey-500 pb-300 text-left font-normal">
            Transaction Date
          </th>
          <th className="text-preset-5 text-grey-500 pb-300 text-right font-normal">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: PER_PAGE }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </tbody>
    </table>
  );
}
