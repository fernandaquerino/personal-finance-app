"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { Category } from "@/generated/prisma/enums";

const createTransactionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z
    .number()
    .refine((v) => v !== 0, { message: "Amount cannot be zero" }),
  category: z.enum(Category),
  date: z.coerce.date().refine((d) => d <= new Date(), {
    message: "Date cannot be in the future",
  }),
  recurring: z.boolean(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;

export type CreateTransactionResult =
  | { success: true }
  | {
      success: false;
      fieldErrors: Partial<Record<keyof CreateTransactionInput, string[]>>;
    };

export async function createTransaction(
  input: CreateTransactionInput,
): Promise<CreateTransactionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = createTransactionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors as Partial<
        Record<keyof CreateTransactionInput, string[]>
      >,
    };
  }

  const { name, amount, category, date, recurring } = parsed.data;

  await prisma.transaction.create({
    data: {
      name,
      amount,
      category,
      date,
      recurring,
      avatar: "",
      userId: session.user.id,
    },
  });

  revalidatePath("/transactions");
  return { success: true };
}
