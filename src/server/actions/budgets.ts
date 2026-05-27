"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Category, Theme } from "@/generated/prisma/enums";

const createBudgetSchema = z.object({
  category: z.enum(Category),
  maximum: z.number().positive("Maximum must be greater than zero"),
  theme: z.enum(Theme),
});

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;

export type CreateBudgetResult =
  | { success: true }
  | {
      success: false;
      fieldErrors?: Partial<Record<keyof CreateBudgetInput, string[]>>;
    };

export async function createBudget(
  input: CreateBudgetInput,
): Promise<CreateBudgetResult> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = createBudgetSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Partial<
        Record<keyof CreateBudgetInput, string[]>
      >,
    };
  }

  const { category, maximum, theme } = parsed.data;

  try {
    await prisma.budget.create({
      data: { category, maximum, theme, userId: session.user.id },
    });
  } catch (err) {
    if (isPrismaUniqueError(err)) {
      return {
        success: false,
        fieldErrors: {
          category: ["A budget for this category already exists"],
        },
      };
    }
    throw err;
  }

  revalidatePath("/budgets");
  return { success: true };
}

const updateBudgetSchema = z.object({
  id: z.string().min(1),
  maximum: z.number().positive("Maximum must be greater than zero"),
  theme: z.enum(Theme),
});

export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;

export type UpdateBudgetResult =
  | { success: true }
  | {
      success: false;
      fieldErrors?: Partial<
        Record<keyof Omit<UpdateBudgetInput, "id">, string[]>
      >;
    };

export async function updateBudget(
  input: UpdateBudgetInput,
): Promise<UpdateBudgetResult> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = updateBudgetSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Partial<
        Record<keyof Omit<UpdateBudgetInput, "id">, string[]>
      >,
    };
  }

  const { id, maximum, theme } = parsed.data;

  await prisma.budget.update({
    where: { id, userId: session.user.id },
    data: { maximum, theme },
  });

  revalidatePath("/budgets");
  return { success: true };
}

export async function deleteBudget(id: string): Promise<{ success: true }> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.budget.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/budgets");
  return { success: true };
}

function isPrismaUniqueError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code: string }).code === "P2002"
  );
}
