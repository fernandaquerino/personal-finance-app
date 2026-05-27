import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTransaction } from "./transactions";

vi.mock("@/lib/auth/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db/prisma", () => ({
  prisma: { transaction: { create: vi.fn() } },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

const mockAuth = vi.mocked(auth);
const mockCreate = vi.mocked(prisma.transaction.create);
const mockRevalidatePath = vi.mocked(revalidatePath);

const VALID_INPUT = {
  name: "Coffee Shop",
  amount: -5.5,
  category: "General" as const,
  date: new Date("2024-08-19"),
  recurring: false,
};

function authenticated(userId = "user-1") {
  mockAuth.mockResolvedValue({
    user: { id: userId },
  } as Awaited<ReturnType<typeof auth>>);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCreate.mockResolvedValue({} as never);
});

describe("createTransaction", () => {
  describe("authentication", () => {
    it("throws when the user is not authenticated", async () => {
      mockAuth.mockResolvedValue(null);

      await expect(createTransaction(VALID_INPUT)).rejects.toThrow(
        "Unauthorized",
      );
    });

    it("throws when session has no user id", async () => {
      mockAuth.mockResolvedValue({ user: {} } as Awaited<
        ReturnType<typeof auth>
      >);

      await expect(createTransaction(VALID_INPUT)).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("validation — name", () => {
    it("returns error when name is empty", async () => {
      authenticated();
      const result = await createTransaction({ ...VALID_INPUT, name: "" });

      expect(result).toMatchObject({
        success: false,
        fieldErrors: { name: expect.arrayContaining([expect.any(String)]) },
      });
    });
  });

  describe("validation — amount", () => {
    it("returns error when amount is zero", async () => {
      authenticated();
      const result = await createTransaction({ ...VALID_INPUT, amount: 0 });

      expect(result).toMatchObject({
        success: false,
        fieldErrors: {
          amount: expect.arrayContaining(["Amount cannot be zero"]),
        },
      });
    });

    it("accepts negative amounts (expenses)", async () => {
      authenticated();
      const result = await createTransaction({ ...VALID_INPUT, amount: -55.5 });

      expect(result).toEqual({ success: true });
    });

    it("accepts positive amounts (income)", async () => {
      authenticated();
      const result = await createTransaction({
        ...VALID_INPUT,
        amount: 120.0,
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("validation — date", () => {
    it("returns error when date is in the future", async () => {
      authenticated();
      const future = new Date();
      future.setDate(future.getDate() + 1);

      const result = await createTransaction({
        ...VALID_INPUT,
        date: future,
      });

      expect(result).toMatchObject({
        success: false,
        fieldErrors: {
          date: expect.arrayContaining(["Date cannot be in the future"]),
        },
      });
    });

    it("accepts today's date", async () => {
      authenticated();
      const result = await createTransaction({
        ...VALID_INPUT,
        date: new Date(),
      });

      expect(result).toEqual({ success: true });
    });

    it("accepts a past date", async () => {
      authenticated();
      const result = await createTransaction({
        ...VALID_INPUT,
        date: new Date("2024-01-01"),
      });

      expect(result).toEqual({ success: true });
    });
  });

  describe("validation — category", () => {
    it("returns error when category is invalid", async () => {
      authenticated();
      const result = await createTransaction({
        ...VALID_INPUT,
        category: "InvalidCategory" as never,
      });

      expect(result).toMatchObject({ success: false });
    });

    it("accepts all valid categories", async () => {
      authenticated();
      const categories = [
        "Entertainment",
        "Bills",
        "Groceries",
        "DiningOut",
        "Transportation",
        "PersonalCare",
        "Education",
        "Lifestyle",
        "Shopping",
        "General",
      ] as const;

      for (const category of categories) {
        const result = await createTransaction({ ...VALID_INPUT, category });
        expect(result).toEqual({ success: true });
      }
    });
  });

  describe("success", () => {
    it("creates the transaction with the correct data", async () => {
      authenticated("user-42");
      await createTransaction(VALID_INPUT);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          name: "Coffee Shop",
          amount: -5.5,
          category: "General",
          date: VALID_INPUT.date,
          recurring: false,
          avatar: "",
          userId: "user-42",
        },
      });
    });

    it("revalidates the transactions path", async () => {
      authenticated();
      await createTransaction(VALID_INPUT);

      expect(mockRevalidatePath).toHaveBeenCalledWith("/transactions");
    });

    it("returns { success: true }", async () => {
      authenticated();
      const result = await createTransaction(VALID_INPUT);

      expect(result).toEqual({ success: true });
    });

    it("does not call prisma when validation fails", async () => {
      authenticated();
      await createTransaction({ ...VALID_INPUT, amount: 0 });

      expect(mockCreate).not.toHaveBeenCalled();
    });

    it("does not revalidate when validation fails", async () => {
      authenticated();
      await createTransaction({ ...VALID_INPUT, name: "" });

      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });
  });
});
