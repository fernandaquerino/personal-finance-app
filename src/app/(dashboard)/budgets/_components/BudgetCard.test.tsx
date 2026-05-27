import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BudgetCard } from "./BudgetCard";
import type { BudgetModel as Budget } from "@/generated/prisma/models";

vi.mock("./BudgetCardActions", () => ({ BudgetCardActions: () => null }));

const BASE_BUDGET: Budget = {
  id: "budget-1",
  category: "Entertainment",
  maximum: 500,
  theme: "Green",
  userId: "user-1",
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-01"),
};

function renderCard(spent: number, maximum = BASE_BUDGET.maximum) {
  return render(
    <BudgetCard
      budget={{ ...BASE_BUDGET, maximum }}
      spent={spent}
      latestTransactions={[]}
      usedThemes={["Green"]}
    />,
  );
}

describe("BudgetCard — spent and remaining", () => {
  it("displays the correct spent amount", () => {
    renderCard(150);
    expect(screen.getByText("$150.00")).toBeInTheDocument();
  });

  it("displays remaining as maximum minus spent", () => {
    renderCard(150, 500);
    expect(screen.getByText("$350.00")).toBeInTheDocument();
  });

  it("displays remaining as $0.00 when spent equals maximum", () => {
    renderCard(500, 500);
    const remaining = screen.getAllByText("$0.00");
    expect(remaining.length).toBeGreaterThan(0);
  });

  it("clamps remaining to $0.00 when spent exceeds maximum", () => {
    renderCard(600, 500);
    const remaining = screen.getAllByText("$0.00");
    expect(remaining.length).toBeGreaterThan(0);
  });
});

describe("BudgetCard — progress bar", () => {
  it("sets aria-valuenow to the correct percentage", () => {
    renderCard(250, 500);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "50");
  });

  it("caps aria-valuenow at 100 when spent exceeds maximum", () => {
    renderCard(750, 500);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "100");
  });

  it("shows 0% progress when spent is zero", () => {
    renderCard(0, 500);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "0");
  });
});
