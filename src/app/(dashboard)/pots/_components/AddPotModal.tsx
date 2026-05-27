"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { THEME_COLORS, THEME_LABELS } from "@/lib/themes";
import type { Theme } from "@/generated/prisma/enums";
import { Select } from "@/components/ui/Select";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be 30 characters or less"),
  target: z.string().min(1, "Target is required"),
  theme: z.string().min(1, "Select a theme"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  usedThemes: Theme[];
};

export function AddPotModal({ usedThemes }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const themeOptions = Object.entries(THEME_LABELS).map(([value, label]) => ({
    value,
    label,
    color: THEME_COLORS[value as Theme],
    alreadyUsed: usedThemes.includes(value as Theme),
  }));

  const {
    register,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      target: "",
      theme: "",
    },
  });

  function handleOpenChange(next: boolean) {
    setOpen(next);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Button size="sm" className="w-auto whitespace-nowrap">
          + Add New Pot
        </Button>
      }
      title="Add New Pot"
      description="Create a pot to set savings targets. These can help keep you on track as you save for special purchases."
      footer={
        <Button type="submit" form="add-pot-form" loading={isPending}>
          Add Pot
        </Button>
      }
    >
      <form className="flex flex-col gap-400 pb-100">
        <Input
          label="Pot Name"
          type="text"
          placeholder="e.g. Rainy Days"
          error={errors.name?.message}
          {...register("name")}
        />
        <Input
          label="Target"
          type="number"
          step="0.01"
          placeholder="e.g. 2000"
          prefix="$"
          error={errors.target?.message}
          {...register("target")}
        />
        <Controller
          control={control}
          name="theme"
          render={({ field }) => (
            <Select
              label="Theme"
              placeholder="Select a theme"
              options={themeOptions}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.theme?.message}
              avoidCollisions={false}
            />
          )}
        />
      </form>
    </Dialog>
  );
}
