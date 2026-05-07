"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { BudgetsIcon } from "../icons/BudgetsIcon";
import { OverviewIcon } from "../icons/OverviewIcon";
import { PotsIcon } from "../icons/PotsIcon";
import { RecurringBillsIcon } from "../icons/RecurringBillsIcon";
import { TransactionsIcon } from "../icons/TransactionsIcon";

const navItems = [
  { href: "/", label: "Overview", Icon: OverviewIcon },
  { href: "/transactions", label: "Transactions", Icon: TransactionsIcon },
  { href: "/budgets", label: "Budgets", Icon: BudgetsIcon },
  { href: "/pots", label: "Pots", Icon: PotsIcon },
  { href: "/recurring-bills", label: "Bills", Icon: RecurringBillsIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="bg-grey-900 fixed right-0 bottom-0 left-0 z-50 flex rounded-t-2xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {navItems.map(({ href, label, Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={isActive ? "page" : undefined}
            className="flex flex-1 items-center justify-center py-400"
          >
            <span
              className={cn(
                "flex flex-col items-center gap-100 rounded-xl px-300 py-200 transition-colors duration-200",
                isActive ? "bg-beige-100" : "",
              )}
            >
              <Icon
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "text-green" : "text-grey-300",
                )}
              />
              <span
                className={cn(
                  "text-preset-5 hidden sm:block",
                  isActive ? "text-grey-900" : "text-grey-300",
                )}
              >
                {label}
              </span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
