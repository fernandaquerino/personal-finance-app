"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { THEME_COLORS } from "@/lib/themes";
import type { PotModel as Pot } from "@/generated/prisma/models";
import { addMoneyToPot } from "@/server/actions/pots";
import { formatAmount } from "@/lib/format";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !isNaN(Number(v)), "Must be a valid number")
    .refine((v) => Number(v) > 0, "Amount must be greater than zero"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  pot: Pot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddMoneyModal({ pot, open, onOpenChange }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const themeColor = THEME_COLORS[pot.theme];

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { amount: "" },
  });

  const amountValue = useWatch({ control, name: "amount" });
  const parsedAmount = Number(amountValue) || 0;
  const newTotal = Math.min(pot.total + parsedAmount, pot.target);
  const currentProgress = (pot.total / pot.target) * 100;
  const addedProgress = ((newTotal - pot.total) / pot.target) * 100;
  const totalProgress = Math.min(100, currentProgress + addedProgress);
  const wouldExceed = parsedAmount > 0 && pot.total + parsedAmount > pot.target;

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await addMoneyToPot({
        id: pot.id,
        amount: Number(data.amount),
      });

      if (result.success) {
        handleOpenChange(false);
        router.refresh();
        return;
      }

      if (result.error) {
        setError("amount", { message: result.error });
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title={`Add to '${pot.name}'`}
      description="Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance."
      footer={
        <Button
          type="submit"
          form="add-money-form"
          loading={isPending}
          disabled={wouldExceed || isPending}
        >
          Confirm Addition
        </Button>
      }
    >
      <form
        id="add-money-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-400 pb-100"
        noValidate
      >
        {/* Progress preview */}
        <div>
          <div className="mb-300 flex items-center justify-between">
            <p className="text-preset-4 text-grey-500">New Amount</p>
            <p className="text-preset-1 text-grey-900">
              {formatAmount(newTotal)}
            </p>
          </div>

          <div className="bg-beige-100 mb-300 h-[8px] w-full overflow-hidden rounded-full">
            <div className="flex h-full overflow-hidden rounded-full">
              <div
                className="h-full rounded-l-full"
                style={{
                  backgroundColor: "#201f24",
                  width: `${currentProgress}%`,
                }}
              />
              {addedProgress > 0 && (
                <div
                  className="h-full"
                  style={{
                    backgroundColor: themeColor,
                    width: `${addedProgress}%`,
                    borderRadius:
                      totalProgress >= 100 ? "0 9999px 9999px 0" : "0",
                  }}
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-preset-5-bold" style={{ color: themeColor }}>
              {totalProgress.toFixed(2)}%
            </p>
            <p className="text-preset-5 text-grey-500">
              Target of {formatAmount(pot.target)}
            </p>
          </div>
        </div>

        <Input
          label="Amount to Add"
          type="number"
          step="0.01"
          placeholder="e.g. 100"
          prefix="$"
          error={errors.amount?.message}
          {...register("amount")}
        />
      </form>
    </Dialog>
  );
}
