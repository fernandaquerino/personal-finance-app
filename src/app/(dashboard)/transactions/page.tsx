import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { TransactionList } from "./_components/TransactionList";
import { TransactionPagination } from "./_components/TransactionPagination";

const PER_PAGE = 10;

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function TransactionsPage({ searchParams }: Props) {
  const [session, { page }] = await Promise.all([auth(), searchParams]);
  const userId = session!.user!.id;
  const currentPage = Math.max(1, Number(page) || 1);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      skip: (currentPage - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.transaction.count({ where: { userId } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="p-400 lg:p-1000">
      <h1 className="text-preset-1 text-grey-900 mb-800">Transactions</h1>
      <div className="rounded-2xl bg-white p-400 lg:p-800">
        <TransactionList transactions={transactions} />
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
