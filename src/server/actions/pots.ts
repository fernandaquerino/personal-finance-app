"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Theme } from "@/generated/prisma/enums";

const createPotSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be 30 characters or less"),
  target: z.number().positive("Target must be greater than zero"),
  theme: z.enum(Theme),
});

export type CreatePotInput = z.infer<typeof createPotSchema>;

export type CreatePotResult =
  | { success: true }
  | {
      success: false;
      fieldErrors?: Partial<Record<keyof CreatePotInput, string[]>>;
    };

export async function createPot(
  input: CreatePotInput,
): Promise<CreatePotResult> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = createPotSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Partial<
        Record<keyof CreatePotInput, string[]>
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

const updatePotSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be 30 characters or less"),
  target: z.number().positive("Target must be greater than zero"),
  theme: z.enum(Theme),
});

export type UpdatePotInput = z.infer<typeof updatePotSchema>;

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
