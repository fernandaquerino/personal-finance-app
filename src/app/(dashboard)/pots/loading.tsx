import { PotListSkeleton } from "./_components/PotListSkeleton";

export default function PotsLoading() {
  return (
    <div className="p-400 lg:p-1000">
      <div className="mb-800 flex items-center justify-between">
        <h1 className="text-preset-1 text-grey-900">Pots</h1>
        <div className="bg-grey-900 h-[40px] w-[140px] animate-pulse rounded-lg" />
      </div>
      <PotListSkeleton />
    </div>
  );
}
