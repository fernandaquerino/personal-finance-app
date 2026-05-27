import { beforeEach, describe, expect, it, vi } from "vitest";
import { createBudget, updateBudget, deleteBudget } from "./budgets";

vi.mock("@/lib/auth/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    budget: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

const mockAuth = vi.mocked(auth);
const mockCreate = vi.mocked(prisma.budget.create);
const mockUpdate = vi.mocked(prisma.budget.update);
const mockDelete = vi.mocked(prisma.budget.delete);
const mockRevalidatePath = vi.mocked(revalidatePath);

const VALID_CREATE_INPUT = {
  category: "Entertainment" as const,
  maximum: 500,
  theme: "Green" as const,
};

const VALID_UPDATE_INPUT = {
  id: "budget-1",
  maximum: 750,
  theme: "Blue" as const,
};

function authenticated(userId = "user-1") {
  mockAuth.mockResolvedValue({
    user: { id: userId },
  } as unknown as Awaited<ReturnType<typeof auth>>);
}

function prismaUniqueError() {
  const err = new Error("Unique constraint failed");
  (err as unknown as Record<string, string>).code = "P2002";
  return err;
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCreate.mockResolvedValue({} as never);
  mockUpdate.mockResolvedValue({} as never);
  mockDelete.mockResolvedValue({} as never);
});

// ─── createBudget ────────────────────────────────────────────────────────────

describe("createBudget", () => {
  describe("authentication", () => {
    it("throws when not authenticated", async () => {
      mockAuth.mockResolvedValue(
        null as unknown as Awaited<ReturnType<typeof auth>>,
      );
      await expect(createBudget(VALID_CREATE_INPUT)).rejects.toThrow(
        "Unauthorized",
      );
    });

    it("throws when session has no user id", async () => {
      mockAuth.mockResolvedValue({ user: {} } as unknown as Awaited<
        ReturnType<typeof auth>
      >);
      await expect(createBudget(VALID_CREATE_INPUT)).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("validation — maximum", () => {
    it("returns error when maximum is zero", async () => {
      authenticated();
      const result = await createBudget({ ...VALID_CREATE_INPUT, maximum: 0 });

      expect(result).toMatchObject({
        success: false,
        fieldErrors: { maximum: expect.arrayContaining([expect.any(String)]) },
      });
    });

    it("returns error when maximum is negative", async () => {
      authenticated();
      const result = await createBudget({
        ...VALID_CREATE_INPUT,
        maximum: -100,
      });

      expect(result).toMatchObject({
        success: false,
        fieldErrors: { maximum: expect.arrayContaining([expect.any(String)]) },
      });
    });

    it("accepts a positive maximum", async () => {
      authenticated();
      const result = await createBudget(VALID_CREATE_INPUT);
      expect(result).toEqual({ success: true });
    });
  });

  describe("validation — category", () => {
    it("returns error when category is invalid", async () => {
      authenticated();
      const result = await createBudget({
        ...VALID_CREATE_INPUT,
        category: "InvalidCategory" as never,
      });
      expect(result).toMatchObject({ success: false });
    });
  });

  describe("duplicate category", () => {
    it("returns a field error when the category already has a budget", async () => {
      authenticated();
      mockCreate.mockRejectedValueOnce(prismaUniqueError());

      const result = await createBudget(VALID_CREATE_INPUT);

      expect(result).toMatchObject({
        success: false,
        fieldErrors: {
          category: expect.arrayContaining([
            "A budget for this category already exists",
          ]),
        },
      });
    });

    it("does not swallow unexpected prisma errors", async () => {
      authenticated();
      mockCreate.mockRejectedValueOnce(new Error("Connection lost"));

      await expect(createBudget(VALID_CREATE_INPUT)).rejects.toThrow(
        "Connection lost",
      );
    });
  });

  describe("success", () => {
    it("creates the budget with correct data", async () => {
      authenticated("user-42");
      await createBudget(VALID_CREATE_INPUT);

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          category: "Entertainment",
          maximum: 500,
          theme: "Green",
          userId: "user-42",
        },
      });
    });

    it("revalidates /budgets", async () => {
      authenticated();
      await createBudget(VALID_CREATE_INPUT);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/budgets");
    });

    it("returns { success: true }", async () => {
      authenticated();
      const result = await createBudget(VALID_CREATE_INPUT);
      expect(result).toEqual({ success: true });
    });

    it("does not call prisma when validation fails", async () => {
      authenticated();
      await createBudget({ ...VALID_CREATE_INPUT, maximum: 0 });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});

// ─── updateBudget ────────────────────────────────────────────────────────────

describe("updateBudget", () => {
  describe("authentication", () => {
    it("throws when not authenticated", async () => {
      mockAuth.mockResolvedValue(
        null as unknown as Awaited<ReturnType<typeof auth>>,
      );
      await expect(updateBudget(VALID_UPDATE_INPUT)).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("validation — maximum", () => {
    it("returns error when maximum is zero", async () => {
      authenticated();
      const result = await updateBudget({ ...VALID_UPDATE_INPUT, maximum: 0 });

      expect(result).toMatchObject({
        success: false,
        fieldErrors: { maximum: expect.arrayContaining([expect.any(String)]) },
      });
    });

    it("returns error when maximum is negative", async () => {
      authenticated();
      const result = await updateBudget({
        ...VALID_UPDATE_INPUT,
        maximum: -50,
      });

      expect(result).toMatchObject({
        success: false,
        fieldErrors: { maximum: expect.arrayContaining([expect.any(String)]) },
      });
    });

    it("accepts a positive maximum", async () => {
      authenticated();
      const result = await updateBudget(VALID_UPDATE_INPUT);
      expect(result).toEqual({ success: true });
    });
  });

  describe("success", () => {
    it("updates with correct data scoped to the authenticated user", async () => {
      authenticated("user-99");
      await updateBudget(VALID_UPDATE_INPUT);

      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "budget-1", userId: "user-99" },
        data: { maximum: 750, theme: "Blue" },
      });
    });

    it("revalidates /budgets", async () => {
      authenticated();
      await updateBudget(VALID_UPDATE_INPUT);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/budgets");
    });

    it("does not call prisma when validation fails", async () => {
      authenticated();
      await updateBudget({ ...VALID_UPDATE_INPUT, maximum: 0 });
      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });
});

// ─── deleteBudget ────────────────────────────────────────────────────────────

describe("deleteBudget", () => {
  describe("authentication", () => {
    it("throws when not authenticated", async () => {
      mockAuth.mockResolvedValue(
        null as unknown as Awaited<ReturnType<typeof auth>>,
      );
      await expect(deleteBudget("budget-1")).rejects.toThrow("Unauthorized");
    });
  });

  describe("success", () => {
    it("deletes scoped to the authenticated user", async () => {
      authenticated("user-7");
      await deleteBudget("budget-1");

      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: "budget-1", userId: "user-7" },
      });
    });

    it("revalidates /budgets", async () => {
      authenticated();
      await deleteBudget("budget-1");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/budgets");
    });

    it("returns { success: true }", async () => {
      authenticated();
      const result = await deleteBudget("budget-1");
      expect(result).toEqual({ success: true });
    });
  });
});
