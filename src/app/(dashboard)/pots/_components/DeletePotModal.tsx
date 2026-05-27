"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type { PotModel as Pot } from "@/generated/prisma/models";
import { deletePot } from "@/server/actions/pots";

type Props = {
  pot: Pot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function DeletePotModal({ pot, open, onOpenChange }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { name } = pot;

  function handleConfirm() {
    startTransition(async () => {
      await deletePot(pot.id);
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={`Delete '${name}'?`}
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
        Are you sure you want to delete this pot? This action cannot be
        reversed, and all the data inside it will be removed forever.
      </p>
    </Dialog>
  );
}
