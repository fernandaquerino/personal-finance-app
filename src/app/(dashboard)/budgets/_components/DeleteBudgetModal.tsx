"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { CATEGORY_LABELS } from "@/lib/categories";
import type { Category } from "@/generated/prisma/enums";
import type { BudgetModel as Budget } from "@/generated/prisma/models";
import { deleteBudget } from "@/server/actions/budgets";

type Props = {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeleteBudgetModal({ budget, open, onOpenChange }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const categoryLabel = CATEGORY_LABELS[budget.category as Category];

  function handleConfirm() {
    startTransition(async () => {
      await deleteBudget(budget.id);
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete '${categoryLabel}'?`}
      footer={
        <>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            No, Go Back
          </Button>
          <Button
            type="button"
            variant="destructive"
            loading={isPending}
            onClick={handleConfirm}
          >
            Yes, Confirm Deletion
          </Button>
        </>
      }
    >
      <p className="text-preset-4 text-grey-500">
        Are you sure you want to delete this budget? This action cannot be
        reversed, and all the data inside it will be removed forever.
      </p>
    </Dialog>
  );
}
