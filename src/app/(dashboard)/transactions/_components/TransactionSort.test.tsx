import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionSort } from "./TransactionSort";

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

describe("TransactionSort", () => {
  describe("rendering", () => {
    it("renders a combobox", () => {
      render(<TransactionSort />);
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("shows 'Latest' as the default selected value", () => {
      render(<TransactionSort />);
      expect(screen.getByRole("combobox")).toHaveTextContent("Latest");
    });

    it("shows the active sort from the URL param", () => {
      mockUseSearchParams.mockReturnValue(makeSearchParams({ sort: "oldest" }));
      render(<TransactionSort />);
      expect(screen.getByRole("combobox")).toHaveTextContent("Oldest");
    });

    it("shows all sort options when opened", async () => {
      render(<TransactionSort />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => {
        expect(
          screen.getByRole("option", { name: "Latest" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Oldest" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "A to Z" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Z to A" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Highest" }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole("option", { name: "Lowest" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("URL update", () => {
    it("sets ?sort=oldest&page=1 when 'Oldest' is selected", async () => {
      render(<TransactionSort />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByRole("option", { name: "Oldest" }));
      fireEvent.click(screen.getByRole("option", { name: "Oldest" }));

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("sort=oldest"),
      );
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=1"));
    });

    it("removes sort param when 'Latest' is selected (default)", async () => {
      mockUseSearchParams.mockReturnValue(makeSearchParams({ sort: "oldest" }));
      render(<TransactionSort />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByRole("option", { name: "Latest" }));
      fireEvent.click(screen.getByRole("option", { name: "Latest" }));

      const pushedUrl = mockPush.mock.calls[0]?.[0] as string;
      expect(pushedUrl).not.toContain("sort=");
    });

    it("preserves search and category params when sort changes", async () => {
      mockUseSearchParams.mockReturnValue(
        makeSearchParams({ search: "Emma", category: "Bills" }),
      );
      render(<TransactionSort />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByRole("option", { name: "A to Z" }));
      fireEvent.click(screen.getByRole("option", { name: "A to Z" }));

      const pushedUrl = mockPush.mock.calls[0]?.[0] as string;
      expect(pushedUrl).toContain("search=Emma");
      expect(pushedUrl).toContain("category=Bills");
      expect(pushedUrl).toContain("sort=az");
    });

    it("resets page to 1 when sort changes", async () => {
      mockUseSearchParams.mockReturnValue(makeSearchParams({ page: "4" }));
      render(<TransactionSort />);
      fireEvent.click(screen.getByRole("combobox"));
      await waitFor(() => screen.getByRole("option", { name: "Highest" }));
      fireEvent.click(screen.getByRole("option", { name: "Highest" }));

      const pushedUrl = mockPush.mock.calls[0]?.[0] as string;
      expect(pushedUrl).toContain("page=1");
      expect(pushedUrl).not.toContain("page=4");
    });
  });
});
