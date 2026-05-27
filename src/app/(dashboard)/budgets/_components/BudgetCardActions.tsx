"use client";

import { useState } from "react";
import { DropdownMenu } from "@/components/ui/DropdownMenu/DropdownMenu";

type Props = {
  budgetId: string;
};

export function BudgetCardActions({ budgetId: _budgetId }: Props) {
  const [_editOpen, setEditOpen] = useState(false);
  const [_deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        trigger={
          <button
            className="text-grey-300 hover:text-grey-500 cursor-pointer rounded p-100 transition-colors"
            aria-label="Budget options"
          >
            <svg
              width="16"
              height="4"
              viewBox="0 0 16 4"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="2" cy="2" r="2" fill="currentColor" />
              <circle cx="8" cy="2" r="2" fill="currentColor" />
              <circle cx="14" cy="2" r="2" fill="currentColor" />
            </svg>
          </button>
        }
        items={[
          { label: "Edit Budget", onClick: () => setEditOpen(true) },
          {
            label: "Delete Budget",
            onClick: () => setDeleteOpen(true),
            destructive: true,
          },
        ]}
      />
      {/* EditBudgetModal — FIN-54 */}
      {/* DeleteBudgetModal — FIN-55 */}
    </>
  );
}
