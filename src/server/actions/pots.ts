"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Theme } from "@/generated/prisma/enums";

const potNameSchema = z
  .string()
  .min(1, "Name is required")
  .max(30, "Name must be 30 characters or less");

const potTargetSchema = z.number().positive("Target must be greater than zero");

const createPotSchema = z.object({
  name: potNameSchema,
  target: potTargetSchema,
  theme: z.enum(Theme),
});

const updatePotSchema = z.object({
  id: z.string().min(1),
  name: potNameSchema,
  target: potTargetSchema,
  theme: z.enum(Theme),
});

const addMoneySchema = z.object({
  id: z.string().min(1),
  amount: z.number().positive("Amount must be greater than zero"),
});

export type CreatePotInput = z.infer<typeof createPotSchema>;
export type UpdatePotInput = z.infer<typeof updatePotSchema>;
export type AddMoneyInput = z.infer<typeof addMoneySchema>;

export type PotActionResult =
  | { success: true }
  | { success: false; error?: string; fieldErrors?: Record<string, string[]> };

export async function createPot(
  input: CreatePotInput,
): Promise<PotActionResult> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createPotSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const { name, target, theme } = parsed.data;
  await prisma.pot.create({
    data: { name, target, theme, userId: session.user.id },
  });

  revalidatePath("/pots");
  return { success: true };
}

export type UpdatePotResult =
  | { success: true }
  | {
      success: false;
      fieldErrors?: Partial<Record<keyof Omit<UpdatePotInput, "id">, string[]>>;
    };

export async function updatePot(
  input: UpdatePotInput,
): Promise<UpdatePotResult> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = updatePotSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Partial<
        Record<keyof Omit<UpdatePotInput, "id">, string[]>
      >,
    };
  }

  const { id, name, target, theme } = parsed.data;
  await prisma.pot.update({
    where: { id, userId: session.user.id },
    data: { name, target, theme },
  });

  revalidatePath("/pots");
  return { success: true };
}

export async function deletePot(id: string): Promise<{ success: true }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.pot.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/pots");
  return { success: true };
}

export type AddMoneyResult =
  | { success: true }
  | { success: false; error?: string };

export async function addMoneyToPot(
  input: AddMoneyInput,
): Promise<AddMoneyResult> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = addMoneySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message,
    };
  }

  const { id, amount } = parsed.data;

  const pot = await prisma.pot.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!pot) throw new Error("Pot not found");

  if (pot.total + amount > pot.target) {
    return {
      success: false,
      error: `Amount exceeds target. You can add at most $${(pot.target - pot.total).toFixed(2)}.`,
    };
  }

  await prisma.pot.update({
    where: { id },
    data: { total: { increment: amount } },
  });

  revalidatePath("/pots");
  return { success: true };
}
