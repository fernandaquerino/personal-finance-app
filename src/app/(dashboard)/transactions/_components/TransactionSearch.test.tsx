import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TransactionSearch } from "./TransactionSearch";

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

function typeIntoInput(input: HTMLElement, value: string) {
  fireEvent.change(input, { target: { value } });
}

beforeEach(() => {
  vi.useFakeTimers();
  mockPush.mockClear();
  mockUseRouter.mockReturnValue({ push: mockPush } as unknown as ReturnType<
    typeof useRouter
  >);
  mockUseSearchParams.mockReturnValue(makeSearchParams());
});

afterEach(() => {
  vi.useRealTimers();
});

describe("TransactionSearch", () => {
  describe("rendering", () => {
    it("renders an input with the correct aria-label", () => {
      render(<TransactionSearch />);
      expect(
        screen.getByRole("textbox", { name: /search transactions by name/i }),
      ).toBeInTheDocument();
    });

    it("renders the placeholder text", () => {
      render(<TransactionSearch />);
      expect(
        screen.getByPlaceholderText("Search transaction"),
      ).toBeInTheDocument();
    });

    it("initializes with empty value when no search param in URL", () => {
      render(<TransactionSearch />);
      expect(
        screen.getByRole("textbox", { name: /search transactions by name/i }),
      ).toHaveValue("");
    });

    it("initializes with value from existing search param in URL", () => {
      mockUseSearchParams.mockReturnValue(makeSearchParams({ search: "Emma" }));
      render(<TransactionSearch />);
      expect(
        screen.getByRole("textbox", { name: /search transactions by name/i }),
      ).toHaveValue("Emma");
    });
  });

  describe("debounce", () => {
    it("does not push to router on mount", () => {
      render(<TransactionSearch />);
      vi.advanceTimersByTime(400);
      expect(mockPush).not.toHaveBeenCalled();
    });

    it("does not push to router before 300ms after typing", () => {
      render(<TransactionSearch />);
      const input = screen.getByRole("textbox", {
        name: /search transactions by name/i,
      });

      typeIntoInput(input, "Emma");
      vi.advanceTimersByTime(299);

      expect(mockPush).not.toHaveBeenCalled();
    });

    it("pushes to router after 300ms debounce", () => {
      render(<TransactionSearch />);
      const input = screen.getByRole("textbox", {
        name: /search transactions by name/i,
      });

      typeIntoInput(input, "Emma");
      vi.advanceTimersByTime(300);

      expect(mockPush).toHaveBeenCalledOnce();
    });

    it("fires only once after multiple keystrokes within the window", () => {
      render(<TransactionSearch />);
      const input = screen.getByRole("textbox", {
        name: /search transactions by name/i,
      });

      typeIntoInput(input, "E");
      vi.advanceTimersByTime(100);
      typeIntoInput(input, "Em");
      vi.advanceTimersByTime(100);
      typeIntoInput(input, "Emm");
      vi.advanceTimersByTime(300);

      expect(mockPush).toHaveBeenCalledOnce();
    });
  });

  describe("URL update", () => {
    it("sets ?search=term&page=1 after debounce", () => {
      render(<TransactionSearch />);
      const input = screen.getByRole("textbox", {
        name: /search transactions by name/i,
      });

      typeIntoInput(input, "Emma");
      vi.advanceTimersByTime(300);

      expect(mockPush).toHaveBeenCalledWith(
        expect.stringContaining("search=Emma"),
      );
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining("page=1"));
    });

    it("removes search param when input is cleared", () => {
      mockUseSearchParams.mockReturnValue(makeSearchParams({ search: "Emma" }));
      render(<TransactionSearch />);
      const input = screen.getByRole("textbox", {
        name: /search transactions by name/i,
      });

      typeIntoInput(input, "");
      vi.advanceTimersByTime(300);

      const pushedUrl = mockPush.mock.calls[0]?.[0] as string;
      expect(pushedUrl).not.toContain("search=");
    });

    it("preserves other existing params when searching", () => {
      mockUseSearchParams.mockReturnValue(
        makeSearchParams({ sort: "latest", category: "Bills" }),
      );
      render(<TransactionSearch />);
      const input = screen.getByRole("textbox", {
        name: /search transactions by name/i,
      });

      typeIntoInput(input, "Emma");
      vi.advanceTimersByTime(300);

      const pushedUrl = mockPush.mock.calls[0]?.[0] as string;
      expect(pushedUrl).toContain("sort=latest");
      expect(pushedUrl).toContain("category=Bills");
    });

    it("always resets page to 1 when searching", () => {
      mockUseSearchParams.mockReturnValue(makeSearchParams({ page: "5" }));
      render(<TransactionSearch />);
      const input = screen.getByRole("textbox", {
        name: /search transactions by name/i,
      });

      typeIntoInput(input, "Emma");
      vi.advanceTimersByTime(300);

      const pushedUrl = mockPush.mock.calls[0]?.[0] as string;
      expect(pushedUrl).toContain("page=1");
      expect(pushedUrl).not.toContain("page=5");
    });
  });
});
