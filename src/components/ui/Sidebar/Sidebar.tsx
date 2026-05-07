import Image from "next/image";
import Link from "next/link";
import { OverviewIcon } from "../icons/OverviewIcon";
import { TransactionsIcon } from "../icons/TransactionsIcon";
import { BudgetsIcon } from "../icons/BudgetsIcon";
import { PotsIcon } from "../icons/PotsIcon";
import { RecurringBillsIcon } from "../icons/RecurringBillsIcon";

export function Sidebar() {
  return (
    <nav className="bg-grey-900 flex h-screen min-w-[300] flex-col rounded-r-2xl pr-600">
      <Link href="/" className="block pt-1000 pb-[64] pl-800">
        <Image src="/images/logo.png" alt="finance" width={120} height={22} />
      </Link>
      <Link
        href="/"
        className="hover:bg-beige-100 hover:border-l-green group flex gap-400 rounded-r-xl border-l-4 border-l-transparent px-800 py-400"
      >
        <OverviewIcon className="text-grey-300 group-hover:text-green" />
        <span className="text-preset-3 text-grey-300 group-hover:text-grey-900">
          Overview
        </span>
      </Link>
      <Link
        href="/transactions"
        className="hover:bg-beige-100 hover:border-l-green group flex gap-400 rounded-r-xl border-l-4 border-l-transparent px-800 py-400"
      >
        <TransactionsIcon className="text-grey-300 group-hover:text-green" />
        <span className="text-preset-3 text-grey-300 group-hover:text-grey-900">
          Transactions
        </span>
      </Link>
      <Link
        href="/budgets"
        className="hover:bg-beige-100 hover:border-l-green group flex gap-400 rounded-r-xl border-l-4 border-l-transparent px-800 py-400"
      >
        <BudgetsIcon className="text-grey-300 group-hover:text-green" />
        <span className="text-preset-3 text-grey-300 group-hover:text-grey-900">
          Budgets
        </span>
      </Link>
      <Link
        href="/pots"
        className="hover:bg-beige-100 hover:border-l-green group flex gap-400 rounded-r-xl border-l-4 border-l-transparent px-800 py-400"
      >
        <PotsIcon className="text-grey-300 group-hover:text-green" />
        <span className="text-preset-3 text-grey-300 group-hover:text-grey-900">
          Pots
        </span>
      </Link>
      <Link
        href="/recurring-bills"
        className="hover:bg-beige-100 hover:border-l-green group flex gap-400 rounded-r-xl border-l-4 border-l-transparent px-800 py-400"
      >
        <RecurringBillsIcon className="text-grey-300 group-hover:text-green" />
        <span className="text-preset-3 text-grey-300 group-hover:text-grey-900">
          Recurring Bills
        </span>
      </Link>
    </nav>
  );
}
