"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { signOutAction } from "@/server/actions/auth";
import { BudgetsIcon } from "../icons/BudgetsIcon";
import { MinimizeMenuIcon } from "../icons/MinimizeMenuIcon";
import { OverviewIcon } from "../icons/OverviewIcon";
import { PotsIcon } from "../icons/PotsIcon";
import { RecurringBillsIcon } from "../icons/RecurringBillsIcon";
import { TransactionsIcon } from "../icons/TransactionsIcon";

const navItems = [
  { href: "/", label: "Overview", Icon: OverviewIcon },
  { href: "/transactions", label: "Transactions", Icon: TransactionsIcon },
  { href: "/budgets", label: "Budgets", Icon: BudgetsIcon },
  { href: "/pots", label: "Pots", Icon: PotsIcon },
  {
    href: "/recurring-bills",
    label: "Recurring Bills",
    Icon: RecurringBillsIcon,
  },
];

type SidebarProps = {
  user?: { name?: string | null; email?: string | null };
};

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <nav
      className={cn(
        "bg-grey-900 hidden h-screen flex-col justify-between overflow-hidden rounded-r-2xl pb-1000 transition-[width] duration-300 ease-in-out lg:flex",
        isMinimized ? "w-auto" : "w-[300]",
        isMinimized ? "pr-200" : "pr-600",
      )}
    >
      <div>
        <Link
          href="/"
          className="relative block h-[22px] pt-1000 pb-[64] pl-800"
        >
          <Image
            src="/images/logo.png"
            alt="finance"
            width={120}
            height={22}
            className={cn(
              "absolute transition-opacity duration-300",
              isMinimized ? "opacity-0" : "opacity-100",
            )}
          />
          <Image
            src="/images/mini-logo.png"
            alt=""
            width={50}
            height={22}
            className={cn(
              "absolute left-0 transition-opacity duration-300",
              isMinimized ? "opacity-100" : "opacity-0",
            )}
          />
        </Link>
        {navItems.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex gap-400 rounded-r-xl border-l-4 px-400 py-400 pr-0 transition-colors duration-200",
                isActive
                  ? "bg-beige-100 border-l-green"
                  : "border-l-transparent",
              )}
            >
              <Icon
                className={cn(
                  isActive
                    ? "text-green"
                    : "text-grey-300 group-hover:text-grey-100",
                )}
              />
              {!isMinimized && (
                <span
                  className={cn(
                    "text-preset-3",
                    isActive
                      ? "text-grey-900"
                      : "text-grey-300 group-hover:text-grey-100",
                  )}
                >
                  {label}
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <div
        className={cn("flex flex-col gap-400", isMinimized ? "p-400" : "p-800")}
      >
        {user && (
          <form action={signOutAction}>
            <button
              type="submit"
              className={cn(
                "text-preset-5 text-grey-300 hover:text-grey-100 flex w-full cursor-pointer items-center gap-300 transition-colors duration-200",
                isMinimized && "justify-center",
              )}
              title={
                isMinimized
                  ? `Sign out (${user.name ?? user.email})`
                  : undefined
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 14H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h3M11 11l3-3-3-3M14 8H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {!isMinimized && (
                <span className="truncate">{user.name ?? user.email}</span>
              )}
            </button>
          </form>
        )}
        <button
          onClick={() => setIsMinimized((prev) => !prev)}
          className="text-preset-3 text-grey-300 hover:text-grey-100 flex cursor-pointer items-center gap-400 transition-colors duration-200"
        >
          <span
            className={cn(
              "transition-transform duration-300",
              isMinimized ? "rotate-180" : "rotate-0",
            )}
          >
            <MinimizeMenuIcon />
          </span>
          {!isMinimized && "Minimize Menu"}
        </button>
      </div>
    </nav>
  );
}
