"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/Dialog/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { CATEGORY_LABELS } from "@/lib/categories";
import { createTransaction } from "@/server/actions/transactions";
import type { Category } from "@/generated/prisma/enums";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)), "Must be a valid number")
    .refine((v) => Number(v) !== 0, "Amount cannot be zero"),
  category: z.string().min(1, "Select a category"),
  date: z.string().min(1, "Date is required"),
  recurring: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const CATEGORY_OPTIONS = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  }),
);

const todayStr = (() => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
})();

export function AddTransactionModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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
      name: "",
      amount: "",
      category: "",
      date: "",
      recurring: false,
    },
  });

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    setOpen(next);
  }

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await createTransaction({
        name: data.name,
        amount: Number(data.amount),
        category: data.category as Category,
        date: new Date(data.date),
        recurring: data.recurring,
      });

      if (result.success) {
        handleOpenChange(false);
        router.refresh();
        return;
      }

      for (const [field, messages] of Object.entries(result.fieldErrors)) {
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
      trigger={
        <Button size="sm" className="w-auto whitespace-nowrap">
          + Add New Transaction
        </Button>
      }
      title="Add New Transaction"
      description="Fill in the details below to record a new transaction."
      footer={
        <Button type="submit" form="add-transaction-form" loading={isPending}>
          Add Transaction
        </Button>
      }
    >
      <form
        id="add-transaction-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-400 pb-100"
        noValidate
      >
        <Input
          label="Transaction Name"
          placeholder="e.g. Coffee Shop"
          autoComplete="off"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          prefix="$"
          helperText="Negative for expenses (e.g. -5.50), positive for income"
          error={errors.amount?.message}
          {...register("amount")}
        />

        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              label="Category"
              placeholder="Select a category"
              options={CATEGORY_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
              error={errors.category?.message}
            />
          )}
        />

        <Input
          label="Date"
          type="date"
          max={todayStr}
          error={errors.date?.message}
          {...register("date")}
        />

        <div className="flex items-center justify-between py-100">
          <span className="text-preset-5-bold text-grey-500">Recurring</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              {...register("recurring")}
            />
            <div className="bg-beige-500 peer-checked:bg-grey-900 peer-focus-visible:ring-grey-900 h-[24px] w-[44px] rounded-full transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:outline-none" />
            <div className="absolute top-[2px] left-[2px] h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-[20px]" />
          </label>
        </div>
      </form>
    </Dialog>
  );
}
