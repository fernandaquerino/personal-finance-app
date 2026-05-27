"use client";

import { useState } from "react";
import type { Theme } from "@/generated/prisma/enums";
import type { BudgetModel as Budget } from "@/generated/prisma/models";
import { DropdownMenu } from "@/components/ui/DropdownMenu/DropdownMenu";
import { EditBudgetModal } from "./EditBudgetModal";
import { DeleteBudgetModal } from "./DeleteBudgetModal";

type Props = {
  budget: Budget;
  usedThemes: Theme[];
};

export function BudgetCardActions({ budget, usedThemes }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

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
      <EditBudgetModal
        budget={budget}
        usedThemes={usedThemes}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteBudgetModal
        budget={budget}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </>
  );
}
