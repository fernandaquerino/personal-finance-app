"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import type { PotModel as Pot } from "@/generated/prisma/models";
import { THEME_COLORS } from "@/lib/themes";
import { PotCardActions } from "./PotCardActions";
import type { Theme } from "@/generated/prisma/enums";
import { AddMoneyModal } from "./AddMoneyModal";

type Props = {
  pot: Pot;
  usedThemes: Theme[];
};

const fmt = (amount: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    amount,
  );

export function PotCard({ pot, usedThemes }: Props) {
  const { name, theme, target, total } = pot;
  const themeColor = THEME_COLORS[theme];
  const progress = Math.min(100, (total / target) * 100);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-500">
      {/* Header */}
      <div className="mb-500 flex items-center justify-between">
        <div className="flex items-center gap-200">
          <span
            className="h-[16px] w-[16px] shrink-0 rounded-full"
            style={{ backgroundColor: themeColor }}
            aria-hidden="true"
          />
          <h2 className="text-preset-2 text-grey-900">{name}</h2>
        </div>
        <PotCardActions pot={pot} usedThemes={usedThemes} />
      </div>

      {/* Total Saved */}
      <div className="mb-400 flex items-center justify-between">
        <p className="text-preset-4 text-gray-500">Total Saved</p>
        <p className="text-preset-1 text-grey-900">{fmt(total)}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-800">
        <div className="bg-beige-100 mb-300 h-[8px] w-full overflow-hidden rounded-full">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ backgroundColor: themeColor, width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${Math.round(progress)}% of target saved`}
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-preset-5-bold text-gray-500">
            {progress.toFixed(2)}%
          </p>
          <p className="text-preset-5 text-grey-500">Target of {fmt(target)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex gap-400">
        <Button variant="secondary" onClick={() => setAddMoneyOpen(true)}>
          + Add Money
        </Button>
        <Button variant="secondary">Withdraw</Button>
      </div>

      <AddMoneyModal
        pot={pot}
        open={addMoneyOpen}
        onOpenChange={setAddMoneyOpen}
      />
    </div>
  );
}
