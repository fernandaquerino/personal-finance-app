import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  describe("rendering", () => {
    it("renders nothing when totalPages is 1", () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={1} onPageChange={vi.fn()} />,
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("renders nothing when totalPages is 0", () => {
      const { container } = render(
        <Pagination currentPage={1} totalPages={0} onPageChange={vi.fn()} />,
      );
      expect(container).toBeEmptyDOMElement();
    });

    it("renders prev and next buttons", () => {
      render(
        <Pagination currentPage={2} totalPages={5} onPageChange={vi.fn()} />,
      );
      expect(
        screen.getByRole("button", { name: /previous page/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /next page/i }),
      ).toBeInTheDocument();
    });

    it("renders page buttons for each page", () => {
      render(
        <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
      );
      [1, 2, 3, 4, 5].forEach((page) => {
        expect(
          screen.getAllByRole("button", { name: `Go to page ${page}` }).length,
        ).toBeGreaterThanOrEqual(1);
      });
    });

    it("renders with accessible nav label", () => {
      render(
        <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
      );
      expect(
        screen.getByRole("navigation", { name: /pagination/i }),
      ).toBeInTheDocument();
    });
  });

  describe("disabled state", () => {
    it("disables prev button on first page", () => {
      render(
        <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
      );
      expect(
        screen.getByRole("button", { name: /previous page/i }),
      ).toBeDisabled();
    });

    it("disables next button on last page", () => {
      render(
        <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />,
      );
      expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
    });

    it("enables prev button when not on first page", () => {
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
      );
      expect(
        screen.getByRole("button", { name: /previous page/i }),
      ).not.toBeDisabled();
    });

    it("enables next button when not on last page", () => {
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
      );
      expect(
        screen.getByRole("button", { name: /next page/i }),
      ).not.toBeDisabled();
    });
  });

  describe("active state", () => {
    it("sets aria-current='page' on the current page button", () => {
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
      );
      const activeButtons = screen.getAllByRole("button", {
        name: "Go to page 3",
      });
      activeButtons.forEach((btn) =>
        expect(btn).toHaveAttribute("aria-current", "page"),
      );
    });

    it("does not set aria-current on inactive pages", () => {
      render(
        <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
      );
      const inactiveButtons = screen.getAllByRole("button", {
        name: "Go to page 1",
      });
      inactiveButtons.forEach((btn) =>
        expect(btn).not.toHaveAttribute("aria-current"),
      );
    });
  });

  describe("interactions", () => {
    it("calls onPageChange with previous page when clicking prev", async () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={onPageChange}
        />,
      );
      await userEvent.click(
        screen.getByRole("button", { name: /previous page/i }),
      );
      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("calls onPageChange with next page when clicking next", async () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={onPageChange}
        />,
      );
      await userEvent.click(screen.getByRole("button", { name: /next page/i }));
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("calls onPageChange with the correct page number when clicking a page button", async () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={onPageChange}
        />,
      );
      await userEvent.click(
        screen.getAllByRole("button", { name: "Go to page 4" })[0],
      );
      expect(onPageChange).toHaveBeenCalledWith(4);
    });

    it("does not call onPageChange when clicking disabled prev", async () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={onPageChange}
        />,
      );
      await userEvent.click(
        screen.getByRole("button", { name: /previous page/i }),
      );
      expect(onPageChange).not.toHaveBeenCalled();
    });

    it("does not call onPageChange when clicking disabled next", async () => {
      const onPageChange = vi.fn();
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={onPageChange}
        />,
      );
      await userEvent.click(screen.getByRole("button", { name: /next page/i }));
      expect(onPageChange).not.toHaveBeenCalled();
    });
  });
});
