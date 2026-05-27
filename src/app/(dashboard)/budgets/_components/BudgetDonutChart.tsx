"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import type { BudgetModel as Budget } from "@/generated/prisma/models";
import type { Category, Theme } from "@/generated/prisma/enums";
import { CATEGORY_LABELS } from "@/lib/categories";
import { THEME_COLORS } from "@/lib/themes";
import { formatAmount } from "@/lib/format";

type ChartEntry = {
  category: Category;
  label: string;
  color: string;
  spent: number;
  maximum: number;
  value: number;
};

type TooltipProps = {
  active?: boolean;
  payload?: { payload: ChartEntry }[];
};

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length || !payload[0]) return null;
  const item = payload[0].payload;
  return (
    <div className="bg-grey-900 rounded-lg px-300 py-200 shadow-md">
      <p className="text-preset-5-bold text-white">{item.label}</p>
      <p className="text-preset-5 text-white">{formatAmount(item.spent)}</p>
    </div>
  );
}

type Props = {
  budgets: Budget[];
  spentByCategory: Record<Category, number>;
};

export function BudgetDonutChart({ budgets, spentByCategory }: Props) {
  const totalSpent = budgets.reduce(
    (sum, b) => sum + (spentByCategory[b.category as Category] ?? 0),
    0,
  );
  const totalLimit = budgets.reduce((sum, b) => sum + b.maximum, 0);

  const entries: ChartEntry[] = budgets.map((b) => ({
    category: b.category as Category,
    label: CATEGORY_LABELS[b.category as Category],
    color: THEME_COLORS[b.theme as Theme],
    spent: spentByCategory[b.category as Category] ?? 0,
    maximum: b.maximum,
    value: spentByCategory[b.category as Category] ?? 0,
  }));

  const hasSpending = totalSpent > 0;
  const chartData: ChartEntry[] = hasSpending
    ? entries.filter((e) => e.value > 0)
    : entries.map((e) => ({ ...e, value: 1 }));

  return (
    <div className="rounded-2xl bg-white p-500">
      {/* Donut */}
      <div className="relative mx-auto mb-400 h-[240px] w-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {chartData.map((entry, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={hasSpending ? entry.color : "#f2f2f2"}
                />
              ))}
            </Pie>
            {hasSpending && <Tooltip content={<CustomTooltip />} />}
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-100">
          <p className="text-preset-1 text-grey-900">
            {formatAmount(totalSpent)}
          </p>
          <p className="text-preset-5 text-grey-500">
            of {formatAmount(totalLimit)} limit
          </p>
        </div>
      </div>

      {/* Spending Summary */}
      <p className="text-preset-2 text-grey-900 mb-300">Spending Summary</p>
      <ul>
        {entries.map((item) => (
          <li
            key={item.category}
            className="border-grey-100 flex items-center justify-between border-b py-300 last:border-none"
          >
            <div className="flex items-center gap-200">
              <span
                className="h-[21px] w-[4px] shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />
              <span className="text-preset-4 text-grey-500">{item.label}</span>
            </div>
            <div className="flex items-center gap-200">
              <span className="text-preset-4-bold text-grey-900">
                {formatAmount(item.spent)}
              </span>
              <span className="text-preset-5 text-grey-500">
                of {formatAmount(item.maximum)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
