import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionCategoryFilter } from "./TransactionCategoryFilter";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
  useSearchParams: vi.fn(),
}));

import { useRouter, useSearchParams } from "next/navigation";

const mockPush = vi.fn();
const mockUseRouter = vi.mocked(useRouter);
const mockUseSearchParams = vi.mocked(useSearchParams);

function makeSearchParams(init: Record<string, string> = {}) {
  return new URLSearchParams(init) as unknown as ReturnType<
    typeof useSearchParams
  >;
}

beforeEach(() => {
  mockPush.mockClear();
  mockUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<
    typeof useRouter
  >);
  mockUseSearchParams.mockReturnValue(makeSearchParams());
});

describe("TransactionCategoryFilter", () => {
  describe("rendering", () => {
    it("renders a combobox", () => {
      render(<TransactionCategoryFilter />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("shows 'All Transactions' as the default selected value", () => {
      render(<TransactionCategoryFilter />);
      expect(screen.getByRole("combobox")).toHaveTextContent(
        "All Transactions",
      );
    });

    it("shows the active category from the URL param", () => {
      mockUseSearchParams.mockReturnValue(
        makeSearchParams({ category: "Bills" }),
      );
      render(<TransactionCategoryFilter />);
      expect(screen.getByRole("combobox")).toHaveTextContent("Bills");
    });

    it("shows 'Dining Out' label for DiningOut enum value", () => {
      mockUseSearchParams.mockReturnValue(
        makeSearchParams({ category: "DiningOut" }),
      );
      render(<TransactionCategoryFilter />);
      expect(screen.getByRole("combobox")).toHaveTextContent("Dining Out");
    });

    it("shows all category options when opened", async () => {
      render(<TransactionCategoryFilter />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => {
        expect(
          screen.getByRole("option", { name: "All Transactions" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Entertainment" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Bills" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Dining Out" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Personal Care" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "General" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("URL update", () => {
    it("sets ?category=Bills&page=1 when a category is selected", async () => {
      render(<TransactionCategoryFilter />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByRole("option", { name: "Bills" }));
      fireEvent.click(screen.getByRole("option", { name: "Bills" }));

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("category=Bills"),
      );
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=1"));
    });

    it("removes category param when 'All Transactions' is selected", async () => {
      mockUseSearchParams.mockReturnValue(
        makeSearchParams({ category: "Bills" }),
      );
      render(<TransactionCategoryFilter />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() =>
        screen.getByRole("option", { name: "All Transactions" }),
      );
      fireEvent.click(screen.getByRole("option", { name: "All Transactions" }));

      const pushedUrl = mockPush.mock.calls[0]?.[0] as string;
      expect(pushedUrl).not.toContain("category=");
    });

    it("preserves search param when category changes", async () => {
      mockUseSearchParams.mockReturnValue(makeSearchParams({ search: "Emma" }));
      render(<TransactionCategoryFilter />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByRole("option", { name: "Groceries" }));
      fireEvent.click(screen.getByRole("option", { name: "Groceries" }));

      const pushedUrl = mockPush.mock.calls[0]?.[0] as string;
      expect(pushedUrl).toContain("search=Emma");
      expect(pushedUrl).toContain("category=Groceries");
    });

    it("resets page to 1 when category changes", async () => {
      mockUseSearchParams.mockReturnValue(makeSearchParams({ page: "3" }));
      render(<TransactionCategoryFilter />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByRole("option", { name: "Shopping" }));
      fireEvent.click(screen.getByRole("option", { name: "Shopping" }));

      const pushedUrl = mockPush.mock.calls[0]?.[0] as string;
      expect(pushedUrl).toContain("page=1");
      expect(pushedUrl).not.toContain("page=3");
    });
  });
});
