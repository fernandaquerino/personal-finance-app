"use client";

import { useState } from "react";
import type { Theme } from "@/generated/prisma/enums";
import type { PotModel as Pot } from "@/generated/prisma/models";
import { DropdownMenu } from "@/components/ui/DropdownMenu/DropdownMenu";
import { DeletePotModal } from "./DeletePotModal";
import { EditPotModal } from "./EditPotModal";

type Props = {
  pot: Pot;
  usedThemes: Theme[];
};

export function PotCardActions({ pot, usedThemes }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu
        trigger={
          <button
            className="text-grey-300 hover:text-grey-500 cursor-pointer rounded p-100 transition-colors"
            aria-label="Pot options"
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
          { label: "Edit Pot", onClick: () => setEditOpen(true) },
          {
            label: "Delete Pot",
            onClick: () => setDeleteOpen(true),
            destructive: true,
          },
        ]}
      />
      <DeletePotModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        pot={pot}
      />
      <EditPotModal
        open={editOpen}
        onOpenChange={setEditOpen}
        pot={pot}
        usedThemes={usedThemes}
      />
    </>
  );
}
