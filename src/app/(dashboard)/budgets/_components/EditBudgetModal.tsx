"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CATEGORY_LABELS } from "@/lib/categories";
import { THEME_COLORS, THEME_LABELS } from "@/lib/themes";
import type { Category, Theme } from "@/generated/prisma/enums";
import type { BudgetModel as Budget } from "@/generated/prisma/models";
import { updateBudget } from "@/server/actions/budgets";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  maximum: z
    .string()
    .min(1, "Maximum is required")
    .refine((v) => !isNaN(Number(v)), "Must be a valid number")
    .refine((v) => Number(v) > 0, "Maximum must be greater than zero"),
  theme: z.string().min(1, "Select a theme"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  budget: Budget;
  usedThemes: Theme[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditBudgetModal({
  budget,
  usedThemes,
  open,
  onOpenChange,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const themeOptions = Object.entries(THEME_LABELS).map(([value, label]) => ({
    value,
    label,
    color: THEME_COLORS[value as Theme],
    alreadyUsed: usedThemes.includes(value as Theme) && value !== budget.theme,
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
    values: {
      maximum: String(budget.maximum),
      theme: budget.theme,
    },
  });

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await updateBudget({
        id: budget.id,
        maximum: Number(data.maximum),
        theme: data.theme as Theme,
      });

      if (result.success) {
        handleOpenChange(false);
        router.refresh();
        return;
      }

      for (const [field, messages] of Object.entries(
        result.fieldErrors ?? {},
      )) {
        if (messages?.length) {
          setError(field as keyof FormValues, { message: messages[0] });
        }
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Edit Budget"
      description="As your budgets change, feel free to update your spending limits."
      footer={
        <Button type="submit" form="edit-budget-form" loading={isPending}>
          Save Changes
        </Button>
      }
    >
      <form
        id="edit-budget-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-400 pb-100"
        noValidate
      >
        <Input
          label="Budget Category"
          value={CATEGORY_LABELS[budget.category as Category]}
          disabled
          readOnly
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
