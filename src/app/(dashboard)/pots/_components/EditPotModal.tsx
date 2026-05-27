"use client";

import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { THEME_COLORS, THEME_LABELS } from "@/lib/themes";
import type { Theme } from "@/generated/prisma/enums";
import type { PotModel as Pot } from "@/generated/prisma/models";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { updatePot } from "@/server/actions/pots";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be 30 characters or less"),
  target: z
    .string()
    .min(1, "Target is required")
    .refine((v) => !isNaN(Number(v)), "Must be a valid number")
    .refine((v) => Number(v) > 0, "Target must be greater than zero"),
  theme: z.string().min(1, "Select a theme"),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  pot: Pot;
  usedThemes: Theme[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditPotModal({ pot, usedThemes, open, onOpenChange }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const themeOptions = Object.entries(THEME_LABELS).map(([value, label]) => ({
    value,
    label,
    color: THEME_COLORS[value as Theme],
    alreadyUsed: usedThemes.includes(value as Theme) && value !== pot.theme,
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
      name: pot.name,
      target: String(pot.target),
      theme: pot.theme,
    },
  });

  const nameValue = useWatch({ control, name: "name" });
  const charsLeft = 30 - (nameValue?.length ?? 0);

  function handleOpenChange(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  function onSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await updatePot({
        id: pot.id,
        name: data.name,
        target: Number(data.target),
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
      title="Edit Pot"
      description="If your saving targets change, feel free to update your pots."
      footer={
        <Button type="submit" form="edit-pot-form" loading={isPending}>
          Save Changes
        </Button>
      }
    >
      <form
        id="edit-pot-form"
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-400 pb-100"
        noValidate
      >
        <Input
          label="Pot Name"
          placeholder="e.g. Rainy Days"
          helperText={`${charsLeft} characters left`}
          error={errors.name?.message}
          maxLength={30}
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
