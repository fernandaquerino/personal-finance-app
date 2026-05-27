import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createPot,
  updatePot,
  deletePot,
  addMoneyToPot,
  withdrawFromPot,
} from "./pots";

vi.mock("@/lib/auth/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    pot: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findFirst: vi.fn(),
    },
  },
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { revalidatePath } from "next/cache";

const mockAuth = vi.mocked(auth);
const mockCreate = vi.mocked(prisma.pot.create);
const mockUpdate = vi.mocked(prisma.pot.update);
const mockDelete = vi.mocked(prisma.pot.delete);
const mockFindFirst = vi.mocked(prisma.pot.findFirst);
const mockRevalidatePath = vi.mocked(revalidatePath);

const VALID_CREATE_INPUT = {
  name: "Savings",
  target: 2000,
  theme: "Green" as const,
};

const VALID_UPDATE_INPUT = {
  id: "pot-1",
  name: "Emergency Fund",
  target: 5000,
  theme: "Blue" as const,
};

const BASE_POT = {
  id: "pot-1",
  name: "Savings",
  target: 2000,
  total: 500,
  theme: "Green" as const,
  userId: "user-1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

function authenticated(userId = "user-1") {
  mockAuth.mockResolvedValue({
    user: { id: userId },
  } as unknown as Awaited<ReturnType<typeof auth>>);
}

beforeEach(() => {
  vi.clearAllMocks();
  mockCreate.mockResolvedValue({} as never);
  mockUpdate.mockResolvedValue({} as never);
  mockDelete.mockResolvedValue({} as never);
  mockFindFirst.mockResolvedValue(BASE_POT as never);
});

// ─── createPot ───────────────────────────────────────────────────────────────

describe("createPot", () => {
  describe("authentication", () => {
    it("throws when not authenticated", async () => {
      mockAuth.mockResolvedValue(null as never);
      await expect(createPot(VALID_CREATE_INPUT)).rejects.toThrow(
        "Unauthorized",
      );
    });

    it("throws when session has no user id", async () => {
      mockAuth.mockResolvedValue({ user: {} } as never);
      await expect(createPot(VALID_CREATE_INPUT)).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("validation — name", () => {
    it("returns error when name is empty", async () => {
      authenticated();
      const result = await createPot({ ...VALID_CREATE_INPUT, name: "" });
      expect(result).toMatchObject({
        success: false,
        fieldErrors: { name: expect.arrayContaining([expect.any(String)]) },
      });
    });

    it("returns error when name exceeds 30 characters", async () => {
      authenticated();
      const result = await createPot({
        ...VALID_CREATE_INPUT,
        name: "A".repeat(31),
      });
      expect(result).toMatchObject({
        success: false,
        fieldErrors: { name: expect.arrayContaining([expect.any(String)]) },
      });
    });

    it("accepts a name with exactly 30 characters", async () => {
      authenticated();
      const result = await createPot({
        ...VALID_CREATE_INPUT,
        name: "A".repeat(30),
      });
      expect(result).toEqual({ success: true });
    });
  });

  describe("validation — target", () => {
    it("returns error when target is zero", async () => {
      authenticated();
      const result = await createPot({ ...VALID_CREATE_INPUT, target: 0 });
      expect(result).toMatchObject({
        success: false,
        fieldErrors: { target: expect.arrayContaining([expect.any(String)]) },
      });
    });

    it("returns error when target is negative", async () => {
      authenticated();
      const result = await createPot({ ...VALID_CREATE_INPUT, target: -100 });
      expect(result).toMatchObject({
        success: false,
        fieldErrors: { target: expect.arrayContaining([expect.any(String)]) },
      });
    });
  });

  describe("success", () => {
    it("creates the pot scoped to the authenticated user", async () => {
      authenticated("user-42");
      await createPot(VALID_CREATE_INPUT);
      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          name: "Savings",
          target: 2000,
          theme: "Green",
          userId: "user-42",
        },
      });
    });

    it("revalidates /pots", async () => {
      authenticated();
      await createPot(VALID_CREATE_INPUT);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/pots");
    });

    it("returns { success: true }", async () => {
      authenticated();
      const result = await createPot(VALID_CREATE_INPUT);
      expect(result).toEqual({ success: true });
    });

    it("does not call prisma when validation fails", async () => {
      authenticated();
      await createPot({ ...VALID_CREATE_INPUT, target: 0 });
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});

// ─── updatePot ───────────────────────────────────────────────────────────────

describe("updatePot", () => {
  describe("authentication", () => {
    it("throws when not authenticated", async () => {
      mockAuth.mockResolvedValue(null as never);
      await expect(updatePot(VALID_UPDATE_INPUT)).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("validation — name", () => {
    it("returns error when name exceeds 30 characters", async () => {
      authenticated();
      const result = await updatePot({
        ...VALID_UPDATE_INPUT,
        name: "A".repeat(31),
      });
      expect(result).toMatchObject({
        success: false,
        fieldErrors: { name: expect.arrayContaining([expect.any(String)]) },
      });
    });
  });

  describe("validation — target", () => {
    it("returns error when target is zero", async () => {
      authenticated();
      const result = await updatePot({ ...VALID_UPDATE_INPUT, target: 0 });
      expect(result).toMatchObject({
        success: false,
        fieldErrors: { target: expect.arrayContaining([expect.any(String)]) },
      });
    });
  });

  describe("success", () => {
    it("updates scoped to the authenticated user", async () => {
      authenticated("user-99");
      await updatePot(VALID_UPDATE_INPUT);
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "pot-1", userId: "user-99" },
        data: { name: "Emergency Fund", target: 5000, theme: "Blue" },
      });
    });

    it("revalidates /pots", async () => {
      authenticated();
      await updatePot(VALID_UPDATE_INPUT);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/pots");
    });
  });
});

// ─── deletePot ───────────────────────────────────────────────────────────────

describe("deletePot", () => {
  describe("authentication", () => {
    it("throws when not authenticated", async () => {
      mockAuth.mockResolvedValue(null as never);
      await expect(deletePot("pot-1")).rejects.toThrow("Unauthorized");
    });
  });

  describe("success", () => {
    it("deletes scoped to the authenticated user", async () => {
      authenticated("user-7");
      await deletePot("pot-1");
      expect(mockDelete).toHaveBeenCalledWith({
        where: { id: "pot-1", userId: "user-7" },
      });
    });

    it("revalidates /pots", async () => {
      authenticated();
      await deletePot("pot-1");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/pots");
    });

    it("returns { success: true }", async () => {
      authenticated();
      const result = await deletePot("pot-1");
      expect(result).toEqual({ success: true });
    });
  });
});

// ─── addMoneyToPot ───────────────────────────────────────────────────────────

describe("addMoneyToPot", () => {
  describe("authentication", () => {
    it("throws when not authenticated", async () => {
      mockAuth.mockResolvedValue(null as never);
      await expect(addMoneyToPot({ id: "pot-1", amount: 100 })).rejects.toThrow(
        "Unauthorized",
      );
    });
  });

  describe("validation — amount", () => {
    it("returns error when amount is zero", async () => {
      authenticated();
      const result = await addMoneyToPot({ id: "pot-1", amount: 0 });
      expect(result).toMatchObject({ success: false });
    });

    it("returns error when amount is negative", async () => {
      authenticated();
      const result = await addMoneyToPot({ id: "pot-1", amount: -50 });
      expect(result).toMatchObject({ success: false });
    });
  });

  describe("business rules", () => {
    it("returns error when amount would exceed target", async () => {
      authenticated();
      // pot has total=500, target=2000 → max addable = 1500
      const result = await addMoneyToPot({ id: "pot-1", amount: 1501 });
      expect(result).toMatchObject({
        success: false,
        error: expect.any(String),
      });
    });

    it("returns error when pot is already full (total === target)", async () => {
      authenticated();
      mockFindFirst.mockResolvedValueOnce({
        ...BASE_POT,
        total: 2000,
      } as never);
      const result = await addMoneyToPot({ id: "pot-1", amount: 1 });
      expect(result).toMatchObject({ success: false });
    });

    it("allows adding exactly the remaining amount", async () => {
      authenticated();
      // total=500, target=2000 → can add exactly 1500
      const result = await addMoneyToPot({ id: "pot-1", amount: 1500 });
      expect(result).toEqual({ success: true });
    });

    it("throws when pot is not found", async () => {
      authenticated();
      mockFindFirst.mockResolvedValueOnce(null as never);
      await expect(addMoneyToPot({ id: "pot-1", amount: 100 })).rejects.toThrow(
        "Pot not found",
      );
    });
  });

  describe("success", () => {
    it("increments total by the given amount", async () => {
      authenticated();
      await addMoneyToPot({ id: "pot-1", amount: 200 });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "pot-1" },
        data: { total: { increment: 200 } },
      });
    });

    it("revalidates /pots", async () => {
      authenticated();
      await addMoneyToPot({ id: "pot-1", amount: 100 });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/pots");
    });

    it("returns { success: true }", async () => {
      authenticated();
      const result = await addMoneyToPot({ id: "pot-1", amount: 100 });
      expect(result).toEqual({ success: true });
    });
  });
});

// ─── withdrawFromPot ─────────────────────────────────────────────────────────

describe("withdrawFromPot", () => {
  describe("authentication", () => {
    it("throws when not authenticated", async () => {
      mockAuth.mockResolvedValue(null as never);
      await expect(
        withdrawFromPot({ id: "pot-1", amount: 100 }),
      ).rejects.toThrow("Unauthorized");
    });
  });

  describe("validation — amount", () => {
    it("returns error when amount is zero", async () => {
      authenticated();
      const result = await withdrawFromPot({ id: "pot-1", amount: 0 });
      expect(result).toMatchObject({ success: false });
    });

    it("returns error when amount is negative", async () => {
      authenticated();
      const result = await withdrawFromPot({ id: "pot-1", amount: -50 });
      expect(result).toMatchObject({ success: false });
    });
  });

  describe("business rules — balance cannot go negative", () => {
    it("returns error when amount exceeds current total", async () => {
      authenticated();
      // pot has total=500 → cannot withdraw 501
      const result = await withdrawFromPot({ id: "pot-1", amount: 501 });
      expect(result).toMatchObject({
        success: false,
        error: expect.any(String),
      });
    });

    it("returns error when pot has zero total", async () => {
      authenticated();
      mockFindFirst.mockResolvedValueOnce({ ...BASE_POT, total: 0 } as never);
      const result = await withdrawFromPot({ id: "pot-1", amount: 1 });
      expect(result).toMatchObject({ success: false });
    });

    it("allows withdrawing exactly the current total", async () => {
      authenticated();
      // total=500 → can withdraw exactly 500
      const result = await withdrawFromPot({ id: "pot-1", amount: 500 });
      expect(result).toEqual({ success: true });
    });

    it("throws when pot is not found", async () => {
      authenticated();
      mockFindFirst.mockResolvedValueOnce(null as never);
      await expect(
        withdrawFromPot({ id: "pot-1", amount: 100 }),
      ).rejects.toThrow("Pot not found");
    });
  });

  describe("success", () => {
    it("decrements total by the given amount", async () => {
      authenticated();
      await withdrawFromPot({ id: "pot-1", amount: 200 });
      expect(mockUpdate).toHaveBeenCalledWith({
        where: { id: "pot-1" },
        data: { total: { decrement: 200 } },
      });
    });

    it("revalidates /pots", async () => {
      authenticated();
      await withdrawFromPot({ id: "pot-1", amount: 100 });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/pots");
    });

    it("returns { success: true }", async () => {
      authenticated();
      const result = await withdrawFromPot({ id: "pot-1", amount: 100 });
      expect(result).toEqual({ success: true });
    });
  });
});
