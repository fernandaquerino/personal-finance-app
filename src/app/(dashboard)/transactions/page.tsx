import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { VALID_CATEGORIES } from "@/lib/categories";
import { TransactionList } from "./_components/TransactionList";
import { TransactionPagination } from "./_components/TransactionPagination";
import { TransactionSearch } from "./_components/TransactionSearch";
import { TransactionCategoryFilter } from "./_components/TransactionCategoryFilter";

const PER_PAGE = 10;

type Props = {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
};

export default async function TransactionsPage({ searchParams }: Props) {
  const [session, { page, search, category }] = await Promise.all([
    auth(),
    searchParams,
  ]);
  const userId = session!.user!.id;
  const currentPage = Math.max(1, Number(page) || 1);
  const searchTerm = search?.trim() || undefined;
  const categoryFilter =
    category && VALID_CATEGORIES.includes(category as never)
      ? (category as (typeof VALID_CATEGORIES)[number])
      : undefined;

  const where = {
    userId,
    ...(searchTerm && {
      name: { contains: searchTerm, mode: "insensitive" as const },
    }),
    ...(categoryFilter && { category: categoryFilter }),
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.transaction.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="p-400 lg:p-1000">
      <h1 className="text-preset-1 text-grey-900 mb-800">Transactions</h1>
      <div className="rounded-2xl bg-white p-400 lg:p-800">
        <div className="mb-600 flex items-center gap-400">
          <TransactionSearch />
          <div className="ml-auto flex items-center gap-300">
            <span className="text-preset-4 text-grey-500 whitespace-nowrap">
              Category
            </span>
            <div className="w-[177px]">
              <TransactionCategoryFilter />
            </div>
          </div>
        </div>
        <TransactionList transactions={transactions} searchTerm={searchTerm} />
        {totalPages > 1 && (
          <div className="mt-600 flex justify-center lg:justify-between">
            <TransactionPagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
