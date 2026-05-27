import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PotCard } from "./PotCard";
import type { PotModel as Pot } from "@/generated/prisma/models";

vi.mock("./PotCardActions", () => ({ PotCardActions: () => null }));
vi.mock("./AddMoneyModal", () => ({ AddMoneyModal: () => null }));
vi.mock("./WithdrawMoneyModal", () => ({ WithdrawMoneyModal: () => null }));

const BASE_POT: Pot = {
  id: "pot-1",
  name: "Savings",
  target: 2000,
  total: 500,
  theme: "Green",
  userId: "user-1",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

function renderCard(total: number, target = BASE_POT.target) {
  return render(
    <PotCard pot={{ ...BASE_POT, total, target }} usedThemes={["Green"]} />,
  );
}

describe("PotCard — total saved display", () => {
  it("displays the correct total saved", () => {
    renderCard(500);
    expect(screen.getByText("$500.00")).toBeInTheDocument();
  });

  it("displays the correct target", () => {
    renderCard(500, 2000);
    expect(screen.getByText("Target of $2,000.00")).toBeInTheDocument();
  });
});

describe("PotCard — progress bar", () => {
  it("sets aria-valuenow to the correct percentage", () => {
    renderCard(1000, 2000);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "50");
  });

  it("caps aria-valuenow at 100 when total exceeds target", () => {
    renderCard(2500, 2000);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });

  it("shows 0% when total is zero", () => {
    renderCard(0, 2000);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });

  it("shows 100% when total equals target", () => {
    renderCard(2000, 2000);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });
});

describe("PotCard — Add Money button", () => {
  it("is enabled when total is below target", () => {
    renderCard(500, 2000);
    const btn = screen.getByRole("button", { name: /add money/i });
    expect(btn).not.toBeDisabled();
  });

  it("is disabled when total equals target (pot is full)", () => {
    renderCard(2000, 2000);
    const btn = screen.getByRole("button", { name: /add money/i });
    expect(btn).toBeDisabled();
  });

  it("is disabled when total exceeds target", () => {
    renderCard(2500, 2000);
    const btn = screen.getByRole("button", { name: /add money/i });
    expect(btn).toBeDisabled();
  });
});
