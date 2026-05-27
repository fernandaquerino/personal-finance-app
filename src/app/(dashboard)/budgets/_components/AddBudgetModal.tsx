"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CATEGORY_LABELS } from "@/lib/categories";
import { THEME_COLORS, THEME_LABELS } from "@/lib/themes";
import type { Theme } from "@/generated/prisma/enums";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  maximum: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)), "Must be a valid number")
    .refine((v) => Number(v) !== 0, "Amount cannot be zero"),
  category: z.string().min(1, "Select a category"),
  theme: z.string().min(1, "Select a theme"),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

type Props = {
  usedThemes: Theme[];
};

export function AddBudgetModal({ usedThemes }: Props) {
  const [open, setOpen] = useState(false);

  const themeOptions = Object.entries(THEME_LABELS).map(([value, label]) => ({
    value,
    label,
    color: THEME_COLORS[value as Theme],
    alreadyUsed: usedThemes.includes(value as Theme),
  }));

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      maximum: "",
      category: "",
      theme: "",
    },
  });

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    setOpen(next);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      trigger={
        <Button size="sm" className="w-auto whitespace-nowrap">
          + Add New Budget
        </Button>
      }
      title="Add New Budget"
      description="Choose a category to set a spending budget. These categories can help you monitor spending."
      footer={
        <Button type="submit" form="add-budget-form">
          Add Budget
        </Button>
      }
    >
      <form
        id="add-budget-form"
        className="flex flex-col gap-400 pb-100"
        noValidate
      >
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              label="Budget Category"
              placeholder="Select a category"
              options={CATEGORY_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.category?.message}
            />
          )}
        />

        <Input
          label="Maximum Spend"
          type="number"
          step="0.01"
          placeholder="e.g. 2000"
          prefix="$"
          error={errors.maximum?.message}
          {...register("maximum")}
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
